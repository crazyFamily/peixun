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
            <el-form class="base-info-form" :model="baseInfoForm" :rules="baseFormRules" ref="baseInfoFormRef" inline>
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
                  disabled
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
                  disabled
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item class="base-info-item form-item-df" :label-width="formLabelWidth" label="总顾问团" prop="advisers">
                <MockInputTag
                  width="350"
                  :list="baseInfoForm.advisers"
                  @remove="advisersTagRemoveHandle"
                  disabled
                  label="empName"
                ></MockInputTag>
              </el-form-item>
              <el-form-item class="team-info-item long-content student-wrapper" :label-width="formLabelWidth" label="学员信息" prop="team">
                <div class="team-member" style="margin-top: 10px;">
                  <div class="menu-right">
                    <span class="instructor-icons__add" @click="isUploadTeamFile = true">
                      <i class="instructor-icons__add__icon"></i>
                      批量添加
                    </span>
                    <span class="instructor-icons__del" @click="handleRemoveStudent">
                      <i class="instructor-icons__del__icon"></i>
                      删除
                    </span>
                    <span class="instructor-icons__download" @click="handleExport">
                      <i class="instructor-icons__download__icon"></i>
                      导出
                    </span>
                  </div>
                  <table-pagination
                    :list="studentColumns"
                    :tableList="studentTables"
                    :queryForm="queryForm"
                    :getList="getStudentInfo"
                    @selection-change="handleSelectStudent"
                    ref="tablePaginationRef">
                  </table-pagination>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="closeHandle">关闭</el-button>
      </div>

      <!-- 项目有多个的弹窗选择 -->
      <MultipleSelect :show.sync="isMultipleProject" :columns="mutileColumns" :table-list="multipleTableList" @save="mutileSelectComfirmHandle">
      </MultipleSelect>


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

      <!-- 批量添加学员 -->
      <TanlentsUpload
        :show.sync="isUploadTeamFile"
        templateCode="TANLENTS_PLAN_STUDENT"
        :fetchFn="fetchBatchImportQcPlanTeams"
        :upload-params="uploadStudentParams"
        @comfirm="imortSuccessHandle"
        :upload-table-columns="studentTableColumns"
        :export-fetch="fetchExportFailedPlanTeamsInfo"
      ></TanlentsUpload>
    </div>
  </div>
</template>

<script setup>
import { TALENT_STEP, UPLOAD_FILE_TYPE } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
import TanlentsUpload from '../components/TanlentsUpload.vue'
import { onActivated, reactive, ref } from 'vue'
import { useRoute } from '@/router'
import { fetchBatchImportQcPlanTeams, fetchDeletePlanTeams, fetchExportFailedPlanTeamsInfo, fetchExportListPlanTeams, fetchHandleQcPlanTeamsInfo, fetchListPlanTeams } from '@/fetch/tanlents'

defineExpose({ UPLOAD_FILE_TYPE })

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

const studentColumns = [
  {type: 'selection'},
  {label: '序号', type: 'index'},
  {label: '姓名', prop: 'umName', type: 'setWidth', width: '100px'},
  {label: 'UM', prop: 'umId', type: 'setWidth', width: '150px'},
  {label: '部门', prop: 'deptName'},
  {label: '当前岗位', prop: 'postName'},
]
const studentTables = ref([])

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

// 选择事件
const selectedStudent = ref([])
const handleSelectStudent = (list) => {
  selectedStudent.value = list
}

const isUploadTeamFile = ref(false)
// 添加学员成功回调
const imortSuccessHandle = async (list, batchId) => {
  console.log(list);
  const data = { sucessList: list, tip: 'Y', batchId, planId: planId.value }
  const res = await fetchHandleQcPlanTeamsInfo(data)
  console.log(res, '====>>> 成功导入');
  // 弹窗会自动关闭，重新接取最新的学员数据
  queryStudentList()
}

const studentTableColumns = [
  {label: 'umID', prop: 'umId',},
  {label: '名字', prop: 'umName',},
  {label: '失败原因', prop: 'msg'},
]

// 批量删除学员
const handleRemoveStudent = async () => {
  console.log(selectedStudent, '===>> selectedStudent');
  if(!selectedStudent.value.length) return Message.warning('请选择一条数据')
  const data = { planId: planId.value, umIds: selectedStudent.value.map(row => row.umId)}
  const res = await fetchDeletePlanTeams(data)
  Message.success('已删除')
  getStudentInfo()
}

// 导出学业员
const handleExport = async () => {
  const data = queryForm
  data.planId = planId.value
  const {total, list} = await fetchExportListPlanTeams({ data })
}

onActivated(() => {
  console.log(useRoute().params.id, '--->>');
  if(useRoute().params.id) {
    planId.value = useRoute().params.id
    planId.value && queryStudentList()
  }
})

</script>
<script>
import { fetchFosterPlanDetail, fetchAddOrEditFosterPlan, fetchAuthProjectList, fetchBatchImportQcPlanTeams } from '@/fetch/tanlents'
import { goToPage } from '@/views/TalentsCultivation/utils'
import MultipleSelect from '../components/MultipleSelect.vue'
import MockInputTag from '../components/MockInputTag.vue'
import { closeCurrPageAndGoPath, CopyObj, handleUdmpHref } from '@/util/utils'
import SelectUserDialog from '../components/SelectUserDialog.vue'
import { PROJECT_STATUS, PROJECT_STATUS_WAITING } from '@/views/TalentsCultivation/enum'
import store from '@/store'
import { Message } from 'element-ui'

export default {
  name: 'AddTalentsStudent',

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
        {
          label: '方案状态',
          prop: 'status',
          formatter: row => PROJECT_STATUS[row.status]
        }
      ],
      multipleTableList: [],
      uploadType: 'PLAN',
      planUploadFile: {},
      otherUploadFileList: [],
      isAddAdvisers: false,
      advisersSelectedList: [],
      isSaveing: false,
      isTipDialogShow: false,
      // 接收后端返回的数据
      planFetchBackData: {},
      uploadStudentParams: { planId: this.$route.params.id, tip: 'N' },
      handleUdmpHref
    }
  },

  components: {
    MultipleSelect,
    MockInputTag,
    SelectUserDialog
  },

  computed: {
    isHideSaveButton() {
      return this.status === 'view' || this.baseInfoForm.status === '1'
    }
  },

  mounted() {},

  methods: {
    async _initData() {
      this.status = this.$route.params.type || this.status
      if (this.$route.params.id) {
        this.uploadStudentParams = { planId: this.$route.params.id, tip: 'N' }
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
    async choseProjectHandle() {
      let { list } = await fetchAuthProjectList()
      if (!list.length) return this.$message.warning('没有查询到项目信息')
      if (list.length === 1) this._mergeBaseInfoHandle(list[0])
      if (list.length > 1) {
        this.isMultipleProject = true
        this.multipleTableList = list.map(row => ({...row, disabledSelect: row.status !== PROJECT_STATUS_WAITING}))
        console.log(this.multipleTableList);
      }
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
.student-wrapper {
  width: 100%;
  :deep(.el-form-item__content) {
    width: calc(100% - 180px);
  }
}
</style>