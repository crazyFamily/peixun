<template>
  <div class="point-record">
    <div v-show="active === 1">
      <el-card class="search-form-card">
        <el-form :model="queryForm" inline>
          <el-form-item label="部门" class="">
            <div class="df">
              <gc-institution
                v-model="queryForm.busiType"
                busiType="LS"
                :default-show="true"
                @setDataFinish="orgIdsFinish"
                ref="institutionRef"
              >
              </gc-institution>
              <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10">
                含下属机构
              </el-checkbox>
            </div>
          </el-form-item>
          <el-form-item label="评聘年度">
            <gc-select
              class="w-200"
              :options="yearsOptions"
              v-model="queryForm.evaluateYear"
              k="evaluateYearName"
              v="evaluateYearId"
            ></gc-select>
          </el-form-item>
          <el-form-item label="培训师类型">
            <gc-select
              class="w-200"
              :options="trainerOptions"
              v-model="queryForm.trainersType"
            ></gc-select>
          </el-form-item>
          <el-form-item label="培训师UM号/姓名">
            <el-input
              v-model="queryForm.teacherName"
              placeholder="请输入培训师UM号/姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="积分日期">
            <el-date-picker
              v-model="queryForm.pointsDate"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              placeholder="请选择积分日期"
              class="point-date-picker"
              start-placeholder="选择开始日期"
              end-placeholder="选择结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="授课日期">
            <el-date-picker
              v-model="queryForm.trainingDate"
              type="daterange"
              range-separator="至"
              start-placeholder="选择开始日期时间"
              end-placeholder="选择结束日期时间"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="point-date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <div class="search-card__button">
            <el-button @click="query" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form>
      </el-card>
      <el-card class="mt10">
        <div class="menu-right">
          <span class="instructor-icons__add" @click="addHandle">
            <i class="instructor-icons__add__icon"></i>
            新增
          </span>
          <span class="instructor-icons__upload" @click="active = 2">
            <i class="instructor-icons__upload__icon"></i>
            批量导入
          </span>
          <span class="instructor-icons__download" @click="exportHandle">
            <i class="instructor-icons__download__icon"></i>
            导出
          </span>
          <!-- <span class="instructor-icons__del">
          <i class="instructor-icons__del__icon"></i>
          删除
        </span> -->
        </div>
        <table-pagination
          class="table-left"
          :list="list"
          :tableList="tableList"
          :queryForm="queryForm"
          :getList="getList"
          @sort-change="tableSortHandle"
          :header-cell-class-name="handleHeaderClass"
          ref="tablePagination"
        >
        </table-pagination>
      </el-card>
    </div>
    <el-card v-show="active === 2">
      <div class="upload-wrap">
        <el-upload
          class="upload-demo"
          drag
          action=""
          :auto-upload="false"
          :file-list="fileList"
          :on-change="uploadChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div
          class="active mt20"
          @click="downloadAdapter({ templateCode: 'POINT_RECORD' })"
        >
          导入模板下载
        </div>
      </div>
      <hr class="mt20" />
      <el-progress :percentage="percentage"></el-progress>
      <div class="mt20">
        导入校验成功！此次校验成功了{{ succNum }}条数据，校验失败数据{{
          errorNum
        }}条。
      </div>
      <div>
        <div class="menu-right">
          <span class="instructor-icons__download" @click="exportHandleError">
            <i class="instructor-icons__download__icon"></i>
            导出
          </span>
        </div>
        <gc-table
          class="general__table"
          :list="uploadList"
          :tableList="uploadTableList"
          :queryForm="queryForm"
          :getList="getList"
          ref="tablePagination"
        ></gc-table>
      </div>
      <div class="dfc mt20">
        <el-button class="button-w80-h30" type="primary" @click="nextStep"
          >下一步</el-button
        >
        <el-button class="button-w80-h30" @click="active = 1">返回</el-button>
      </div>
    </el-card>
    <div v-show="active === 3" class="submit-card">
      <el-card>
        <el-form
          ref="addForm"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="请示事项" prop="taskTitle">
            <el-input
              v-model="formData.taskTitle"
              placeholder="【培训师管理平台】有关补录XX等多人积分的事宜请示"
            ></el-input>
          </el-form-item>
          <el-form-item label="请示内容" prop="taskDesc">
            <el-input
              class="h-90"
              type="textarea"
              placeholder="请输入具体内容，字数控制在500字以内"
              resize="none"
              maxlength="500"
              show-word-limit
              v-model="formData.taskDesc"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="审批链"
            prop="auditUsersUm"
            style="width: calc(100% + 240px)"
          >
            <approval-chain
              :value="approvalChainValue"
              chainType="5"
              @confirm="approvalChainConfirm"
            ></approval-chain>
          </el-form-item>
          <el-form-item label="附件内容">
            <a
              class="active"
              :href="nextFormData.fileUrl"
              :download="nextFormData.fileName"
            >
              {{ nextFormData.fileName }}
            </a>
          </el-form-item>
        </el-form>
        <div class="dfcc new-app-footer">
          <el-button class="button-w80-h30" type="primary" @click="saveHandle"
            >发起审批</el-button
          >
          <el-button class="button-w80-h30" @click="active = 2">返回</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  addAllowKeepAlive,
  filterObj,
  resetObj,
  downloadAdapter,
  dataHeaders
} from '@/util/utils'
import {
  fetchSelectTrainersPoints,
  fetchListEvaluationYear,
  fetchExportTrainersPoints,
  fetchBatchImportHandPoints,
  fetchErrorImportHandPoints,
  fetchSubmitImportHandPoint,
  fetchShowImportHandPointsFileInfo
} from '@/fetch/pointManagement'
export default {
  name: 'PointRecord',

  props: {},

  data() {
    return {
      active: 1,
      yearsOptions: [],
      list: [
        { type: 'selection' },
        { label: '培训师UM帐号', prop: 'umId', width: '110' },
        { label: '培训师姓名', prop: 'teacherName', width: '90' },
        { label: '部门', prop: 'orgName', sortable: 'custom' },
        { label: '评聘年度', prop: 'evaluateYearName' },
        { label: '授课类型', prop: 'trainingType' },
        { label: '授课ID', prop: 'courseId' },
        { label: '授课名称', prop: 'courseName' },
        { label: '授课开始时间', prop: 'startTime', width: '130' },
        { label: '授课结束时间', prop: 'endTime', width: '130' },
        { label: '授课时长', prop: 'totalDuration' },
        { label: '收入/支出', prop: 'pointsIncome' },
        { label: '积分原因', prop: 'remark' },
        { label: '积分值', prop: 'totalPoints', sortable: 'custom' },
        { label: '课程上架日期', prop: 'microsUploadTime', width: '100' },
        { label: 'EOA审批结果', prop: 'approveResult', width: '110' },
        { label: 'EOA签报号', prop: 'eoaNo', width: '100' }
      ],
      tableList: [],
      blgOrgIds: [],
      queryForm: {
        busiType: [],
        orgId: '',
        teacherName: '',
        evaluateYear: '',
        trainersType: '',
        pointsDate: [],
        trainingDate: [],
        currPage: 1,
        pageSize: 10,
        total: 0,
        tip: '',
        teacherOrgNameOrder: '0',
        pointTotalOrder: '0',
        isGotSubBranch: ''
        // pointsIncome: ''
      },
      // 培训师类型下拉选项
      trainerOptions: [
        {
          label: '菁英培训师(一级)',
          value: '03001001'
        },
        {
          label: '菁英培训师(二级)',
          value: '03001002'
        },
        {
          label: '菁英培训师(三级)',
          value: '03001003'
        },
        {
          label: '菁英培训师(四级)',
          value: '03001004'
        },
        {
          label: '菁英培训师(五级)',
          value: '03001005'
        }
      ],
      trainingDate: [],
      fileList: [],
      uploadList: [
        { label: 'UM账号', prop: 'umId' },
        { label: '姓名', prop: 'teacherName' },
        { label: '收入/支出', prop: 'pointsIncome' },
        { label: '积分原因', prop: 'remark' },
        // { label: '积分值', prop: '' },
        { label: '评聘年度', prop: 'evaluateYearName' },
        { label: '授课类型', prop: 'trainingType' },
        { label: '授课ID', prop: 'courseId' },
        { label: '失败原因', prop: 'errorMsg' }
      ],
      uploadTableList: [],
      formData: {
        batchNum: '',
        taskDesc: '',
        auditUsersUm: ''
      },
      formRules: {
        taskTitle: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写请示事项'
          }
        ],
        taskDesc: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写请示内容'
          }
        ],
        auditUsersUm: [
          {
            required: true,
            trigger: 'change',
            message: '请选择审批链'
          }
        ]
      },
      percentage: 0,
      sortMap: {
        orgName: 'teacherOrgNameOrder',
        totalPoints: 'pointTotalOrder'
      },
      alreadySort: {},
      succNum: 0,
      errorNum: 0,
      downloadAdapter,
      approvalChainValue: '',
      nextFormData: {},
      flag: false
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.getEvaluateYearOptions()
  },

  methods: {
    orgIdsFinish() {
      // this.queryForm.id = this.caseId;
      // this.cacheOrgIds = CopyObj(this.queryForm.orgIds);
      this.query()
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10, evaluateYear: '' })
      this.alreadySort = {}
      this.$refs.tablePagination.resetFilters()
      this.getList()
    },
    async exportHandle() {
      let data = filterObj(this.queryForm)
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      ;[data.busiType, data.orgId] = data.busiType || []
      ;[data.pointsStartDate, data.pointsEndDate] = data.pointsDate || []
      ;[data.trainingStartDate, data.trainingEndDate] = data.trainingDate || []
      await fetchExportTrainersPoints({ data })
    },
    async getList() {
      let data = filterObj(this.queryForm)
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      ;[data.busiType, data.orgId] = data.busiType || []
      ;[data.pointsStartDate, data.pointsEndDate] = data.pointsDate || []
      ;[data.trainingStartDate, data.trainingEndDate] = data.trainingDate || []
      let { list, total } = await fetchSelectTrainersPoints({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    editHandle(row) {
      addAllowKeepAlive('/AddPointRecord')
      this.$router.push({
        name: '新增/编辑积分补录',
        params: row
      })
    },
    removeHandle() {},
    addHandle() {
      addAllowKeepAlive('/AddPointRecord')
      this.$router.push('/AddPointRecord')
    },
    async getEvaluateYearOptions() {
      this.yearsOptions = await fetchListEvaluationYear()
    },
    uploadChange(file, fileList) {
      this.fileList = [file]
      const data = new FormData()
      this.formData.batchNum = Math.floor(new Date().getTime() / 1000) + ''
      data.append('file', file.raw)
      data.append('batchNum', this.formData.batchNum)
      fetchBatchImportHandPoints(data, {
        headers: {
          ...dataHeaders,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              this.percentage =
                (progressEvent.loaded / progressEvent.total) * 100 || 0
            }
          }
        }
      }).then((res) => {
        fetchErrorImportHandPoints({
          tip: 'Y',
          batchNum: this.formData.batchNum
        }).then((res) => {
          const { succNum, errorNum, errorList } = res
          this.succNum = succNum || 0
          this.errorNum = errorNum || 0
          this.uploadTableList = errorList || []
        })
      })
    },
    saveHandle() {
      return this.$refs.addForm.validate(async (v) => {
        if (!v) return false
        if (this.flag) return
        let data = this.formData
        try {
          this.flag = true
          await fetchSubmitImportHandPoint({ data })
          this.$message.success('新增成功')
          resetObj(this.formData)
          this.active = 1
        } finally {
          this.flag = false
        }
      })
    },
    // 选择审批链确认事件
    approvalChainConfirm(data) {
      this._.merge(this.formData, data)
    },
    tableSortHandle({ prop, order }) {
      if (order === 'descending') {
        this.queryForm[this.sortMap[prop]] = '2'
      } else if (order === 'ascending') {
        this.queryForm[this.sortMap[prop]] = '1'
      } else {
        this.queryForm[this.sortMap[prop]] = '0'
      }
      this.alreadySort[prop] = { order }
      this.getList()
    },
    handleHeaderClass({ column }) {
      let prop = this.alreadySort[column.property]
      if (prop) {
        column.order = prop.order
      } else {
        column.order = ''
      }
    },
    nextStep() {
      if (!this.formData.batchNum) return this.$message('请先上传文件')
      fetchShowImportHandPointsFileInfo({
        batchNum: this.formData.batchNum
      }).then((data) => {
        this.nextFormData = data
        this.approvalChainValue = data.auditUsers
        this.formData.udmpId = data.udmpId
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate()
        })
        this.active = 3
      })
    },
    exportHandleError() {
      if (!this.formData.batchNum) return this.$message('请先上传文件')
      fetchErrorImportHandPoints(
        { tip: 'N', batchNum: this.formData.batchNum },
        { headers: { responseType: 'blob' } }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.point-date-picker {
  :deep(.el-range-input) {
    font-size: 12px;
  }

  :deep(.el-range-separator) {
    display: flex;
    align-items: center;
  }
}

.buttons .active {
  margin-right: 10px;
}

.upload-wrap {
  width: 600px;
  margin: auto;
  .upload-demo {
    :deep(.el-upload-dragger) {
      width: 600px;
    }
    :deep(.el-upload-list) {
      display: none;
    }
  }
}

.el-progress {
  width: 800px;
  margin-top: 30px;
}
.submit-card {
  .el-form {
    width: 600px;
    margin: auto;
  }
}
</style>