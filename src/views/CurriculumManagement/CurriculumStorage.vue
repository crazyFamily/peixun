<template>
  <div class="CurriculumManagement__curriculumStorage">
    <!-- 搜索 框 -->
    <el-card>
      <div class="between">
        <div class="">项目名称：{{ classObj.className }}</div>
        <div class="">
          <el-button @click="handleBack" class="button-w80-h30">返回</el-button>
          <el-button
            class="button-w100-h30"
            type="primary"
            @click="openStorageApprova"
            >发起入库审批</el-button
          >
        </div>
      </div>
    </el-card>

    <!-- 表格 内容 和分页 -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="handleAdd">
          <i class="instructor-icons__add__icon"></i>
          新增
        </span>
        <span class="instructor-icons__del" @click="delCurriculum">
          <i class="instructor-icons__del__icon"></i>
          删除
        </span>
        <!-- <span
                    class="instructor-icons__download"
                    @click="importCurriculum"
                >
                    <i class="instructor-icons__download__icon"></i>
                    批量新增
                </span> -->
      </div>
      <gc-table
        class="general__table"
        ref="dataTableRef"
        :list="dataList"
        v-loading="loadingTable"
        :tableList="dataTableList"
      >
        <el-table-column min-width="120" label="资料状态">
          <template slot-scope="scope">
            <span v-if="scope.row.eoaStatus !== '02005'">{{
              scope.row.eoaStatusName
            }}</span>
            <el-tooltip
              v-else
              :content="scope.row.synKb"
              popper-class="icon-popper"
            >
              {{ scope.row.eoaStatusName }}
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <div class="">
              <span class="active mr20" @click="openEditPage(scope.row)">
                <el-tooltip content="修改" popper-class="icon-popper">
                  <i class="operation__edit"></i>
                </el-tooltip>
              </span>
              <span class="active ml10" @click="row = CopyObj(scope.row)">
                <el-tooltip content="下载" popper-class="icon-popper">
                  <i class="operation__download"></i>
                </el-tooltip>
              </span>
            </div>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 15]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getCurriculumList)"
        @currentChange="currentChange($event, queryForm, getCurriculumList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 入库审批 dialog -->
    <gc-model
      title="入库审批"
      width="1000px"
      class="storage-approval"
      :visible="storageApprovalVisible"
      @close="storageApprovalClose"
      @cancel="storageApprovalVisible = false"
      @comfirm="storageApprovalComfirm"
    >
      <el-form
        ref="storageApprovalFormRef"
        :model="storageApprovalForm"
        label-width="148px"
        :rules="storageApprovalRules"
        @submit.native.prevent
      >
        <el-form-item label="审批链" prop="approvalValue">
          <span slot="label">
            <span>审批链</span>
            <el-tooltip effect="light" popper-class="whiteness" placement="top" >
              <i class="el-icon-question active"></i>
              <div class="tips-container" slot="content">
                  <p class="tips-content">
                  1、当审批的课程（与上一次发起时选择的课程一样）、审批链都没有变化时，再次审批时将会从退回处继续审批
                  </p>
                  <p class="tips-content">
                  2、当审批的课程有变化、或审批链有调整时，再次审批时将从第一个审批人重新开始审批
                  </p>
              </div>
            </el-tooltip>
          </span>
          <ApprovalChain
            v-model="storageApprovalForm.approvalValue"
            @confirm="approvalChainConfirm"
            ref="approvalChain"
          />
        </el-form-item>
        <el-form-item label="审是否涉及产品、营销" required>
          <el-radio-group
            v-model="storageApprovalForm.flag"
            @click.native="radioClick"
          >
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="资料上传"
          prop="files"
          class="change-position"
          v-if="storageApprovalForm.flag === '1'"
        >
          <div class="aic">
            <gc-fileInput
              class="mr10"
              accept=".xls,.doc,.htm,.pdf,.ppt,.mht,.msg,.rar,.zip,.txt,.html,.docx,.xlsx,.pptx,.png,.jpg,.jpeg"
              @change="uploadFileChange"
            ></gc-fileInput>
            <span class="shallow"
              >可上传文件格式：.xls,.doc,.htm,.pdf,.ppt,.mht,.msg,.rar,.zip,.txt,.html,.docx,.xlsx,.pptx,.png,.jpg,.jpeg，文件大小≤5M</span
            >
          </div>
          <div class="upload-file-wrap">
            <gc-lineProgress
              v-for="(item, i) in storageApprovalForm.files"
              :key="i"
              :index="i"
              :name="item.file.name"
              :percentage="item.progress"
              @del="handleDel"
            ></gc-lineProgress>
          </div>
        </el-form-item>
      </el-form>
    </gc-model>

    <!-- 批量新增课程 dialog -->
    <InstructorBatchImport
      title="批量新增课程"
      :visible="batchAddCurriculumVisible"
      @close="batchAddClose"
      @cancel="batchAddCurriculumVisible = false"
      @comfirm="batchAddComfirm"
      @change="batchAddChange"
    />



    <!-- 下载资料 dialog -->
    <DownloadData :row="row" :customRequest="downDate" />
  </div>
</template>

<script>
import $ from 'jquery'
import {
  merge,
  CopyObj,
  resetObj,
  throttle,
  uploadFile,
  sizeChange,
  jsonHeaders,
  dataHeaders,
  currentChange,
  fileImportHint,
  addAllowKeepAlive
} from '../../util/utils'
import UploadData from './components/UploadData.vue'
import DownloadData from './components/DownloadData.vue'
import { handlePickerOptions } from '../../mixins/component'

export default {
  name: 'CurriculumStorage',
  mixins: [handlePickerOptions],
  components: {
    UploadData,
    DownloadData
  },
  data() {
    return {
      // 总条数
      total: 0,
      // 查询表单
      queryForm: {
        classId: '',
        currPage: 1,
        pageSize: 10
      },
      // 课程字段数组
      dataList: [
        {
          type: 'selection',
          width: '64'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '课程名称',
          width: '296',
          prop: 'courseName'
        },
        {
          label: '机构',
          width: '300',
          prop: 'blgOrgName'
        },
        {
          label: '课程创建时间',
          width: '110',
          prop: 'createdDate'
        },
        {
          label: '课程类型',
          width: '90',
          prop: 'courseTypeName'
        }
      ],
      // 课程 数据列表
      dataTableList: [],
      // 审批链dialog 状态
      storageApprovalVisible: false,
      // 审批链数据对象
      storageApprovalForm: {
        approvalValue: '',
        flag: '1',
        files: [],
        courseIds: []
      },
      // 审批链 表单规则验证对象
      storageApprovalRules: {
        approvalValue: [
          {
            required: true,
            trigger: 'blur',
            message: '审批链未填写'
          }
        ]
      },
      // 批量新增课程 dialog 状态
      batchAddCurriculumVisible: false,
      // 上传文件 数组
      uploadDataList: [],
      // 传给 上传组件的数据
      uploadRow: {},
      // 下载组件需要的数据
      row: {},
      // 工具函数
      CopyObj,
      // 批量上传文件对象
      batchAddFile: {},
      // 上个页面传的培训班对象
      classObj: {},
      // 入库审批提交按钮是否禁用 防止重复提交
      storageApprovalFlag: true,
      // 分页工具函数
      sizeChange,
      currentChange,
      loadingTable: false
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 获取课程数据
    getCurriculumList() {
      const courseMaterials = this.queryForm
      this.loadingTable = true
      this.$axios
        .post(
          '/fn/course/materials/listClassCourseMaterials',
          { courseMaterials },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.total = total
            list.forEach((v) => {
              v.createdDate = v.createdDate.split(' ')[0]
            })
            this.dataTableList = list
          }
        }).finally(()=>{
          this.loadingTable = false
        })
    },
    // 新增课程
    handleAdd() {
      addAllowKeepAlive('/addCurriculum')
      this.$router.push({
        name: '新增/修改课程',
        params: { state: 'add', row: this.classObj }
      })
    },
    // 删除课程
    delCurriculum() {
      const selection = this.$refs.dataTableRef.$children[0].selection
      if (selection < 1) {
        return this.$message.warning('请先选择课程')
      }
      const approval = selection.find((v) => v.eoaStatusName === '审批中')
      if (approval) {
        return this.$message.warning(
          `${approval.courseName}的资料状态是审批中不能删除`
        )
      }
      this.$alert('确定删除课程吗？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      }).then((valied) => {
        if (valied === 'confirm') {
          const data = selection.map((v) => v.courseId)
          this.$axios
            .post(
              '/fn/course/materials/deleteClassStore',
              { data },
              jsonHeaders
            )
            .then((res) => {
              const { code, data } = res.data
              if (code === 0) {
                this.$message.success('删除成功')
                this.getCurriculumList()
              }
            })
        }
      })
    },
    // 批量导入课程
    importCurriculum() {
      this.batchAddCurriculumVisible = true
    },
    // 审批链确认事件
    approvalChainConfirm(data) {
      this._.merge(this.storageApprovalForm, data)
    },
    handleBack() {
      const items = $(
        `.component-head__left__tags__item__content:contains(${this.$route.name})`
      )
      const item = Array.from(items).find(
        (v) => $(v).text().trim() === this.$route.name
      )
      if (item) {
        $(item).next().click()
      } else {
        addAllowKeepAlive('/CurriculumStorageManagement')
        this.$router.push({
          name: '课程入库管理'
        })
      }
    },
    // 批量新增入库 确认 事件
    batchAddComfirm() {
      if (!this.batchAddFile.size) {
        return
      }
      const data = new FormData()
      data.append('file', this.batchAddFile)
      data.append(classId, this.classObj.classId)
      this.$axios
        .post('/courseFileFunc/materials/batchImport', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            fileImportHint(data)
            this.query()
          }
        })
    },
    // 批量新增 选择文件变化事件
    batchAddChange($event) {
      this.batchAddFile = $event.target.files[0]
    },
    // 批量新增 关闭事件
    batchAddClose() {
      this.batchAddFile = {}
      this.batchAddCurriculumVisible = false
    },
    // 发起审批入库 上传文件change 事件
    uploadFileChange($event) {
      const file = { file: $event.target.files[0], progress: 0 }
      uploadFile({
        files: file.file,
        busiId: '',
        reimClass: '',
        headers: {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              file.progress =
                (progressEvent.loaded / progressEvent.total) * 100 || 0
            }
          }
        }
      }).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this._.merge(file, data[0])
        }
      })
      this.storageApprovalForm.files.push(file)
    },
    // 入库审批 dialog 删除文件
    handleDel(index) {
      this.storageApprovalForm.files.splice(index, 1)
    },
    // 入库审批 dialog 确定事件
    storageApprovalComfirm() {
      if (!this.storageApprovalFlag) return
      this.storageApprovalFlag = false
      const files = this.storageApprovalForm.files.map((v) => {
        const { createdBy, fileName, sizes, submodule, udmpId } = v
        return { createdBy, fileName, sizes, submodule, udmpId }
      })
      const { auditUsers, auditUsersName, auditUsersUm } =
        this.storageApprovalForm
      if (!auditUsers) {
        this.storageApprovalFlag = true
        return this.$message.warning('审批链未选择')
      }
      const eoaRequestDTO = {
        auditUsers,
        auditUsersName,
        auditUsersUm,
        fileList: files
      }
      let courseFileApprove
      if (this.storageApprovalForm.flag === '2') {
        Reflect.deleteProperty(eoaRequestDTO, 'files')
        courseFileApprove = 'N'
      } else {
        courseFileApprove = 'Y'
      }
      const courseIds = this.storageApprovalForm.courseIds
      const data = { eoaRequestDTO, courseIds, courseFileApprove }
      return this.$axios
        .post('/fn/course/materials/courseFileApprove', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.query()
            this.storageApprovalForm = {
              approvalValue: '',
              flag: '1',
              files: [],
              courseIds: []
            }
            this.storageApprovalVisible = false
          }
          this.storageApprovalFlag = true
        })
        .catch((err) => {
          this.storageApprovalFlag = true
        })
    },
    // 入库审批 dialog close 事件
    storageApprovalClose() {
      this.storageApprovalVisible = false
      this.storageApprovalForm.approvalValue = ''
      this.storageApprovalForm.flag = '1'
      this.storageApprovalForm.files = []
    },
    // 打开入库审批 dialog
    openStorageApprova() {
      const selection = this.$refs.dataTableRef.$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('请先选择课程')
      }
      const approval = selection.find((v) => v.eoaStatusName === '审批中')
      if (approval) {
        return this.$message.warning(
          `${approval.courseName}的资料状态是审批中不能发起入库审批`
        )
      }
      const notUpload = selection.find((v) => v.eoaStatusName === '未上传')
      if (notUpload) {
        return this.$message.warning(
          `${notUpload.courseName}的资料状态是未上传不能发起入库审批`
        )
      }
      const allready = selection.find((v) => v.eoaStatusName === '已完成')
      if (allready) {
        return this.$message.warning(
          `${allready.courseName}的资料状态是已完成不能发起入库审批`
        )
      }
      this.storageApprovalForm.courseIds = selection.map((v) => v.courseId)
      this.storageApprovalVisible = true
    },
    // 跳转到编辑页面
    openEditPage(row) {
      if (row.eoaStatusName === '审批中') {
        return this.$message.warning('审批中的课程不能修改')
      }
      addAllowKeepAlive('/addCurriculum')
      this.$router.push({
        name: '新增/修改课程',
        params: { state: 'edit', row: this.classObj, course: row }
      })
    },
    // 下载组件 自定义获取数据
    downDate() {
      return new Promise((resolve, reject) => {
        const data = { courseId: this.row.courseId }
        this.$axios
          .post(
            '/fn/course/materials/findClassStoreDetail',
            { courseInfoRequest: data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              resolve(data.files)
            } else {
              reject()
            }
          })
          .catch((err) => reject(err))
      })
    },
    // 审是否涉及产品、营销  的点击事件
    radioClick($event) {
      if (
        $event.target.nodeName === 'INPUT' &&
        $($event.target).closest('label').find('.el-radio__label').text() ===
          '否'
      ) {
        $event.preventDefault()
        if (this.storageApprovalForm.flag === '1') {
          this.$alert('确定该课程不涉及产品、营销？', '提示', {
            confirmButtonText: '确定',
            showCancelButton: true,
            cancelButtonClass: 'cancel',
            customClass: 'loginTimeout'
          })
            .then((valied) => {
              if (valied === 'confirm') {
                this.storageApprovalForm.flag = '2'
              }
            })
            .catch((err) => err)
        }
      }
    }
  },
  activated() {
    const params = this.$route.params
    if (!params.classId) {
      this.getCurriculumList()
      return
    }
    this.classObj = params
    this.useLine = params.useLine
    this.queryForm.classId = params.classId
    this.getCurriculumList()
  },
  created() {
    this.storageApprovalComfirm = throttle(this.storageApprovalComfirm)
  }
}
</script>

<style lang="scss">
.CurriculumManagement__curriculumStorage {
  .storage-approval {
    .el-dialog__body {
      padding: 20px 80px !important;
    }
    .upload-file-wrap {
      margin-top: 15px;
      padding: 0 0 20px 20px;
      min-height: 140px;
      border: 1px solid #eaecf1;
    }
  }
}
</style>
