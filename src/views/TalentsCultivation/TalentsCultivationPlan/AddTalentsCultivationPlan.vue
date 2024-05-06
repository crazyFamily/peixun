<template>
  <div>
    <el-card>
      <StepTopbar current-step="方案创建" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <div class="permission-container talents-container mt10">
      <div class="main-box">
        <div class="main-container">
          <div class="title">
            <div class="title__menu"></div>
            基本信息
          </div>
          <div class="base-info-container">
            <el-button type="primary" @click="choseProjectHandle" :disabled="status === 'view' || baseInfoForm.status === '1'"
              >选择潜才项目</el-button
            >
            <span class="tips">说明：请选择需要创建方案的潜才培养项目</span>
            <el-form class="base-info-form" :model="baseInfoForm" :rules="baseFormRules" ref="baseInfoFormRef" :disabled="status === 'view'" inline>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="项目ID">
                <el-input class="input-width" v-model="baseInfoForm.projectId" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="项目名称">
                <el-input class="input-width" v-model="baseInfoForm.projectName" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="年度">
                <el-input class="input-width" v-model="baseInfoForm.annual" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="项目类型">
                <el-input class="input-width" v-model="baseInfoForm.projectTypeDesc" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="所属单位">
                <el-input class="input-width" v-model="baseInfoForm.projectBlg" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="主办部门" prop="orgs">
                <gc-institution
                  class="input-width"
                  v-model="baseInfoForm.orgs"
                  @change="institutionChangeHandle"
                  ref="institutionRef"
                  :disabled="status === 'view'"
                  busi-type="FL"
                  :left-show="false"
                  :fetchParams="{ showBusiType: 'FL' }"
                  style="width: 350px;"
                >
                </gc-institution>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="项目周期" prop="daterange">
                <el-date-picker
                  class="rms-daterange-picker input-width"
                  v-model="baseInfoForm.daterange"
                  type="daterange"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="选择开始日期"
                  end-placeholder="选择结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item class="base-info-item form-item-df" :label-width="formLabelWidth" label="总顾问团" prop="advisers">
                <MockInputTag
                  width="350"
                  :list="baseInfoForm.advisers"
                  @remove="advisersTagRemoveHandle"
                  :disabled="status === 'view'"
                  label="empName"
                ></MockInputTag>
                <el-button
                  type="primary"
                  @click="advisersShowHandle"
                  :disabled="status === 'view' || !baseInfoForm.proId"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="plan-infomation-container">
            <div class="title">
              <div class="title__menu"></div>
              方案信息
            </div>
            <el-form class="plan-infomation-form" :model="planInfoForm" :rules="planFormRules" ref="planInfoFormRef" :disabled="status === 'view'">
              <el-form-item class="plan-infomation-item" :label-width="formLabelWidth" label="培养方案概要" style="width: 80%" prop="outline">
                <el-input
                  type="textarea"
                  resize="none"
                  maxlength="800"
                  show-word-limit
                  :rows="8"
                  v-model="planInfoForm.outline"
                  placeholder="简明扼要填写相关内容"
                ></el-input>
              </el-form-item>
              <el-form-item class="plan-infomation-item" :label-width="formLabelWidth" label="培养方案" prop="planFile">
                <el-button type="primary" @click="isUploadFile = true" :disabled="status === 'view' || !baseInfoForm.proId">上传文件</el-button>
                <span class="tips">支持扩展名：{{ renderFileType }}...，每次上传附件大小限制在{{ uploadFileSize }}以内</span>
                <div class="file-container">
                  <div class="label">方案类型附件：</div>
                  <div class="file-content" v-show="Object.keys(planUploadFile).length">
                    <el-tag :closable="status !== 'view'" @close="planUploadFile = {}">
                      <span @click="handleDownloadFile(planUploadFile.udmpId)" download class="active download-style">{{ planUploadFile.fileName }}</span>
                    </el-tag>
                  </div>
                </div>
                <div class="file-container other-type">
                  <div class="label">其他类型附件：</div>
                  <div class="file-content" :class="{ 'no-margin': index === 0 }" v-for="(item, index) in otherUploadFileList" :key="index">
                    <el-tag :closable="status !== 'view'" @close="otherUploadFileList.splice(index, 1)">
                      <span @click="handleDownloadFile(item.udmpId)" download class="active download-style">{{ item.fileName }}</span>
                    </el-tag>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="plan-infomation-container" v-show="status === 'view'">
            <div class="title">
              <div class="title__menu"></div>
              学员信息
            </div>
            <table-pagination
              :list="studentColumns"
              :tableList="studentTables"
              :queryForm="queryForm"
              :getList="getStudentInfo"
              ref="tablePaginationRef">
            </table-pagination>
          </div>
        </div>
      </div>
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="closeHandle">关闭</el-button>
        <el-button class="button-w80-h30" type="primary" @click="saveHandle('save')" v-if="!isHideSaveButton"
          >保存</el-button
        >
        <el-button class="button-w80-h30" type="primary" @click="saveHandle('submit')" :disabled="status === 'view'">提交</el-button>
      </div>

      <!-- 项目有多个的弹窗选择 -->
      <MultipleProjectSelect 
        :show.sync="isMultipleProject"
        :columns="mutileColumns" 
        :table-list.sync="multipleTableList"
        @save="mutileSelectComfirmHandle"
      >
      </MultipleProjectSelect>

      <!-- 上传文件的弹窗 -->
      <gc-model :visible.sync="isUploadFile" :isShowFooter="false" title="请选择上传文件">
        <UploadUdmp
          :accept="uploadFileType"
          @uploadFinish="uploadFinishHandle"
          :size="300"
          ref="headquarterUploadRef"
        ></UploadUdmp>
        <div class="condition-container">
          <el-radio-group v-model="uploadType">
            <el-radio label="PLAN">方案类型附件</el-radio>
            <el-radio label="OTHER">其他类型附件</el-radio>
          </el-radio-group>
        </div>
      </gc-model>

      <!-- 选择顾问团的弹窗 -->
      <SelectUserDialog
        title="请选择顾问团"
        :show.sync="isAddAdvisers"
        :proId="baseInfoForm.proId"
        @save="advisersConfirmHandle"
        :list="baseInfoForm.advisers"
        :maxlen="10"
      ></SelectUserDialog>

      <!-- 提示弹窗 -->
      <gc-model
        title="提示"
        width="600px"
        :visible="isTipDialogShow"
        :show-close="false"
        @close="isTipDialogShow = false"
        @cancel="isTipDialogShow = false"
        @comfirm="resultSave"
        comfirm-text="是"
        cancel-text="否"
      >
        <p>培养方案已成功提交（仍可修改），是否进入“议题创建”环节？</p>
      </gc-model>
    </div>
  </div>
</template>

<script setup>
import { TALENT_STEP, UPLOAD_FILE_TYPE } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
import { fetchListPlanTeams } from '@/fetch/tanlents'
import { onActivated, reactive, ref } from 'vue'
import { useRoute } from '@/router'
import { downloadFileAsAlink } from '@/util/utils'
defineExpose({ UPLOAD_FILE_TYPE })

const studentColumns = [
  // {type: 'selection'},
  {label: '序号', type: 'index'},
  {label: '姓名', prop: 'umName'},
  {label: 'UM', prop: 'umId'},
  {label: '部门', prop: 'deptName'},
  {label: '当前岗位', prop: 'postName'},
]
const studentTables = ref([])

const planId = ref(useRoute().params.id)
// 获取学员信息
const queryForm = reactive({
  // 方案ID
  planId: planId.value,
  // 当前页
  currPage: 1,
  // 页大小
  pageSize: 10,
  total: 0
})
const queryStudentList = () => {
  queryForm.currPage = 1
  getStudentInfo()
}
const getStudentInfo = async () => {
  const data = queryForm
  data.planId = planId.value
  const {total, list} = await fetchListPlanTeams({ data })
  studentTables.value = list
  queryForm.total = total
}
// queryStudentList()
// 下载文件
async function handleDownloadFile (udmpId) {
  try {
    downloadFileAsAlink(await fileDownload(udmpId))
  } catch (error) {}
}

onActivated(() => {
  if(useRoute().params.id) {
    planId.value = useRoute().params.id
    planId.value && queryStudentList()
  }
})


</script>
<script>
import UploadUdmp from '@/components/upload/UploadUdmp.vue'
import { fetchFosterPlanDetail, fetchAddOrEditFosterPlan, fetchAuthProjectList, fetchListPlanTeams } from '@/fetch/tanlents'
import { goToPage } from '@/views/TalentsCultivation/utils'
import MultipleProjectSelect from '../components/MultipleProjectSelect.vue'
import MockInputTag from '../components/MockInputTag.vue'
import { closeCurrPageAndGoPath, CopyObj } from '@/util/utils'
import SelectUserDialog from '../components/SelectUserDialog.vue'
import { fileDownload } from '@/util/udmp'
import store from '@/store'

export default {
  name: 'AddTalentsCultivationPlan',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      baseInfoForm: {
        orgs: [],
        daterange: [],
        advisers: [],
        orgName: '',
        status: null
      },
      planInfoForm: {
        outline: ''
      },
      planFormRules: {
        outline: [requiredHandle('请输入方案概要')],
        planFile: [
          {
            validator: (rule, value, callback) => {
              if (!Object.keys(this.planUploadFile).length) {
                return callback(new Error('请上传培养方案（方案类型附件必传，其他类型可选）'))
              }
              return callback()
            },
            required: true
          }
        ]
      },
      baseFormRules: {
        orgs: [
          {
            validator: (rule, value, callback) => {
              if (!this.baseInfoForm.orgs.length) {
                return callback(new Error('请选择主办部门'))
              }
              return callback()
            },
            required: true
          }
        ],
        daterange: [
          requiredHandle('请选择项目周期'),
        ]
      },
      status: 'create',
      formLabelWidth: '100px',
      uploadFileType: UPLOAD_FILE_TYPE,
      uploadFileSize: '300m',
      isMultipleProject: false,
      mutileColumns: [
        {
          type: 'selection'
        },
        {
          label: '项目ID',
          prop: 'projectId'
        },
        {
          label: '项目名称',
          prop: 'projectName',
          width: '100px'
        },
        {
          label: '年度',
          prop: 'annual'
        },
        {
          label: '项目类型',
          prop: 'projectTypeDesc'
        },
        {
          label: '所属单位',
          prop: 'projectBlg'
        },
        // {
        //   label: '方案状态',
        //   prop: 'status',
        //   formatter: row => PROJECT_STATUS[row.status]
        // }
      ],
      multipleTableList: [],
      isUploadFile: false,
      uploadParams: {},
      uploadType: 'PLAN',
      planUploadFile: {},
      otherUploadFileList: [],
      isAddAdvisers: false,
      advisersSelectedList: [],
      isSaveing: false,
      isTipDialogShow: false,
      // 接收后端返回的数据
      planFetchBackData: {},
    }
  },

  components: {
    UploadUdmp,
    MultipleProjectSelect,
    MockInputTag,
    SelectUserDialog
  },

  computed: {
    renderFileType() {
      return this.uploadFileType.map((item) => `.${item}`).join(' ')
    },
    isHideSaveButton() {
      return this.status === 'view' || this.baseInfoForm.status === '1'
    }
  },

  mounted() {},

  methods: {
    async _initData() {
      this.status = this.$route.params.type || this.status
      if (this.$route.params.id) {
        let res = await fetchFosterPlanDetail({ planId: this.$route.params.id })
        this.baseInfoForm = {
          ...this.baseInfoForm,
          ...this._formatRanderData(res)
        }
        this.planInfoForm.outline = res.outline

        if (res.fileList.length) {
          let planFileIndex = res.fileList.findIndex((item) => item.submodule === 'plan_file')

          if (planFileIndex > -1) {
            this.planUploadFile = res.fileList.splice(planFileIndex, 1)[0]
          }
        }

        this.otherUploadFileList = res.fileList
      }
      // 不能从缓存取，会导致页签切换后会被重置
      if (this.$route.params.type === 'create') {
        this._resetData()
        this.$nextTick(() => {
          this.$refs.baseInfoFormRef.clearValidate()
          this.$refs.planInfoFormRef.clearValidate()
        })
      }
    },
    _formatRanderData(data) {
      data.adviserList && (data.advisers = data.adviserList)
      data.orgs = [data.orgId]
      if (!data.proId) {
        data.proId = data.id
        Reflect.deleteProperty(data, 'id')
      }

      if (data.startDate && data.endDate) {
        data.daterange = [data.startDate, data.endDate]
      }

      this.$refs.institutionRef.content = [data.orgName]
      return data
    },
    // 校验保存信息
    _validateSaveInfo() {
      let validator = true
      this.$refs.baseInfoFormRef.validate((v) => {
        if (!v) validator = false
      })
      this.$refs.planInfoFormRef.validate((v) => {
        if (!v) validator = false
      })
      return validator
    },
    _formatParams(target = {}) {
      let params = { ...this.baseInfoForm, ...this.planInfoForm, ...target }
      params.startDate = params.daterange[0]
      params.endDate = params.daterange[1]
      params.oprType = params.planId ? 'edit' : 'add'
      params.fileList = [{ ...this.planUploadFile, submodule: 'plan_file' }].concat(
        this.otherUploadFileList.map((item) => ({
          ...item,
          submodule: 'other_file'
        }))
      )

      params.orgId = params.orgs[params.orgs.length - 1]
      Reflect.deleteProperty(params, 'daterange')
      Reflect.deleteProperty(params, 'orgs')
      return params
    },
    saveHandle(status = 'save') {
      let statusMap = {
        save: 0,
        submit: 1
      }
      if (!this._validateSaveInfo()) return
      if (this.isSaveing) return
      let data = this._formatParams()
      console.log(data, '===>>> data')
      fetchAddOrEditFosterPlan({ data: { ...data, status: statusMap[status] } })
        .then(async (res) => {
          this.$message.success('提交成功')
          this.planFetchBackData = res
          // 如果是提交的话，需要进行用户跳转议题确认
          if (status === 'submit') {
            await this.toTopicPageTips()
            this.isTipDialogShow = true
          } else {
            this.closeHandle()
          }
          // 设置待更新状态
          store.commit('updateQueue', '/TalentsCultivationPlan')
        })
        .finally(() => {
          this.isSaveing = false
        })
    },
    resultSave() {
      this.closeHandle()
      let data = this._formatParams(this.planFetchBackData)
      goToPage('/AddTalentsTopic', this.$router, {
        type: 'create',
        planData: data
      })
    },
    closeHandle() {
      let { name } = this.$router.getRoutes().find((item) => item.path === '/TalentsCultivationPlan')
      closeCurrPageAndGoPath({ path: this.$route.path })
      this.$router.push({ name })
    },
    _resetData() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    },
    // 跳转议题页面
    toTopicPageTips() {
      this.isTipDialogShow = true
      // return new Promise((resolve, reject) => {
      //   this.$confirm('提示', {
      //     message: (
      //       <p>
      //         您已经成功提交培养方案，后续您仍可再次编辑！接下来需要您确认是否进入填写创建议题
      //         环节，你还要继续吗？
      //       </p>
      //     ),
      //     confirmButtonText: '确定',
      //     showCancelButton: true,
      //     cancelButtonClass: 'cancel',
      //     customClass: 'loginTimeout'
      //   })
      //     .then(() => {
      //       return resolve()
      //     })
      //     .catch(() => {
      //       return reject()
      //     })
      // })
    },
    uploadFinishHandle(result) {
      if (result.status !== 'success') return
      let { fname, doc_id } = result.data[0]
      switch (this.uploadType) {
        case 'PLAN':
          this.planUploadFile = { udmpId: doc_id, fileName: fname }
          break
        case 'OTHER':
          this.otherUploadFileList.push({ udmpId: doc_id, fileName: fname })
          break
      }
      this._resetUploadData()
    },
    _resetUploadData() {
      this.uploadType = 'PLAN'
      this.isUploadFile = false
    },
    async choseProjectHandle() {
      this.isMultipleProject = true
      // let { list } = await fetchAuthProjectList()
      // if (!list.length) return this.$message.warning('没有查询到项目信息')
      // if (list.length === 1) this._mergeBaseInfoHandle(list[0])
      // if (list.length > 1) {
      //   this.isMultipleProject = true
      //   this.multipleTableList = list.map(row => ({...row, disabledSelect: row.status !== PROJECT_STATUS_WAITING}))
      //   console.log(this.multipleTableList);
      // }
    },
    // 计算6个月的时间间隔
    _diffMonth(startTime, endTime) {
      function diffMouth(value) {
        var d = new Date(value)
        // 因为getMonth()获取的月份的值只能在0~11之间所以我们在进行setMonth()之前先给其减一
        d.setMonth(d.getMonth() + 6)
        var yy1 = d.getFullYear()
        var mm1 = d.getMonth() + 1
        var dd1 = d.getDate()
        if (mm1 < 10) {
          mm1 = '0' + mm1
        }
        if (dd1 < 10) {
          dd1 = '0' + dd1
        }
        return `${yy1}-${mm1}-${dd1}`
      }
      let diffData = diffMouth(startTime)
      return endTime.replace(/-/g, '') > diffData.replace(/-/g, '') > 0
      // startTime = new Date(startTime)
      // endTime = new Date(endTime)
      // let diff
      // let startDate =
      //   startTime.getDate() +
      //   startTime.getHours() / 24 +
      //   startTime.getMinutes() / 24 / 60
      // let endDate =
      //   endTime.getDate() +
      //   endTime.getHours() / 24 +
      //   endTime.getMinutes() / 24 / 60
      // console.log(startDate, endDate)
      // diff = endDate >= startDate ? 0 : -1
      // return (
      //   (endTime.getYear() - startTime.getYear()) * 12 +
      //   endTime.getMonth() -
      //   startTime.getMonth() +
      //   diff
      // )
    },
    advisersConfirmHandle(list) {
      this.baseInfoForm.advisers = CopyObj(list).map((item) => ({
        umId: item.umId,
        empName: item.empName
      }))
    },
    advisersCloseHandle() {
      this.$refs.advisersTablePagination.clearSelection()
    },
    advisersTagRemoveHandle(index) {
      if (this.status === 'view') return
      this.baseInfoForm.advisers.splice(index, 1)
    },
    mutileSelectComfirmHandle(data) {
      console.log(data, '===>>');
      this._mergeBaseInfoHandle(data)
    },
    _mergeBaseInfoHandle(data) {
      this.baseInfoForm = Object.assign({}, this.baseInfoForm, this._formatRanderData(data))
    },
    advisersShowHandle() {
      this.isAddAdvisers = true
    },
    institutionChangeHandle(name) {
      this.baseInfoForm.orgName = name || ''
    }
  },
  activated() {
    this._initData()
  }
}
</script>
<style lang='scss' scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';

.file-content {
  margin-bottom: 10px;
}

.condition-container {
  text-align: center;
}

:deep(.input-width) {
  width: 350px;
  &.gc-institution .input {
    width: 350px;
  }
}

.download-style {
  text-decoration: underline;
}

.form-item-df {
  :deep(.el-form-item__content) {
    display: inline-flex;
    align-items: center;
  }
}

.long-content {
  :deep(.el-form-item__content) {
    max-width: calc(100% - 180px);
  }
}
</style>