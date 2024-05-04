<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-card ">
      <el-form :model="queryForm" :rules="queryFormRules" inline ref="queryFormRef">
        <el-form-item label="计划期数" prop="planMonth">
          <gc-select 
            :options="planMonthOptions" 
            v-model="queryForm.planMonth" 
            :clearable="false" 
            class="w-150" />
        </el-form-item>
        <el-form-item label="机构" prop="orgIds">
          <DropdownZhOrg
            :style="{width: '250px'}"
            :search="true"
            :list="orgOptions"
            @change="orgIdChange"
            valueField="orgId"
            labelField='orgName'
            ref="dropdownTreeRef"
          ></DropdownZhOrg>
        </el-form-item>
        <el-form-item label="更新人">
          <gc-input placeholder="UM号/姓名" v-model.trim="queryForm.updatedBy"></gc-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="_queryDataList()">查询</el-button>
          <el-button @click="_resetDataList()">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <template v-if="isAdmin">
          <span class="instructor-icons__add" @click="openBaseForm('add')"><i class="instructor-icons__add__icon"></i>新增计划</span>
          <span class="instructor-icons__edit" @click="openBaseForm('edit')"><i class="instructor-icons__edit__icon"></i>编辑计划</span>
          <span class="instructor-icons__del" @click="deletePlan()"><i class="instructor-icons__del__icon"></i>删除计划</span>
        </template>
        <span class="instructor-icons__upload" @click="exportDataList()"><i class="instructor-icons__download__icon"></i>导出</span>
      </div>
      <table-pagination
        :page-sizes="[10,50,100]"
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="queryDataListFormat"
        v-loading="getLoadingStatus('LOADING_MONTH_PLAN_PAGE')"
        ref="tablePaginationRef">
        <el-table-column slot="planClassNum" label="月度计划项目数" width="120px">
          <template slot-scope="scope">
            <el-button type="text" @click="gotoPlanDetail(scope.row)">{{scope.row.planClassNum}}</el-button>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 新增/编辑计划 -->
    <gc-model :title="baseFormTitle" :visible="baseFormShow" width="1100px" top="5vh"
      @close="closeBaseForm" 
      @cancel="closeBaseForm" 
      @comfirm="comfirmBaseForm">
      <el-form :model="baseForm" :rules="baseFormRules" ref="baseFormRef" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="计划年月" prop="planMonth">
              <el-date-picker
                class="w-120 clearable-data-pick"
                v-model="baseForm.planMonth"
                type="month"
                placeholder="开始月份"
                :clearable="true"
                value-format="yyyy-MM-dd"
                :disabled="isEdit"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="邮件提醒" prop="emailSendFlag">
          <el-switch v-model="baseForm.emailSendFlag" 
            active-color="#fd6720" inactive-color="#e4e7ed"
            active-text="开启" inactive-text="关闭" 
            active-value="Y" inactive-value="N"
            @change="emailSendFlagChange"
          ></el-switch>
          <el-button v-show="canSendEmail" type="text" @click="openEmailUserList">配置通知名单</el-button>
        </el-form-item>
        <el-form-item label="邮件内容" prop="classId" v-show="canSendEmail && baseForm.planMonth">
          <p class="email-desc">{平安银行基础零售事业部} 计划管理员 {xxx} 您好： </p>
          <gc-editor
            @change="emailContentChange"
            :maxLen="emailContentMaxLen"
            :content-text="emailContent"
            width="900px"
          ></gc-editor>
          <p class="email-desc">操作路径：<a>培训管理系统-培训计划管理-月度计划，切换到“计划明细录入”</a></p>
          <span v-if="!emailContentValid" class="error-color">邮件内容不能超过200</span>
        </el-form-item>
      </el-form>
    </gc-model>

     <!-- 配置通知名单弹框 -->
    <gc-model title="配置通知名单" :visible="emailUserListShow" width="850px" top="5vh"
      @close="closeEmailUserList" 
      @cancel="closeEmailUserList"
      @comfirm="comfirmEmailUserList">
      <p class="mb10 color-theme">注：默认邮件通知所有机构的计划管理员，已提交月度计划将自动调整为不再通知，未提交状态的可通过开关调整是否邮件通知</p>
      <gc-table
        :list="emailUserListColumnList"
        :tableList="renderEmailUserListDataList"
        v-loading="getLoadingStatus('LOADING_SELECT_EMAIL_USER_LIST')"
        ref="importManageTableRef">
        <el-table-column prop="planStatus" width="150px">
          <template slot="header">
            <gc-tablecolumnfilters
              label="月度计划状态"
              ref="planStatusFilter"
              className="table__screen__icon"
              :list="emailSubmitOptions"
              confirmText="确定"
              popperClass="circular"
              @filter="filterElements($event, 'planStatus')"
              @reset="resetUserListFilter('planStatus')"
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            {{ optionsToObj(emailSubmitOptions)[scope.row.planStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="emailSendFlag" width="150px">
          <template slot="header">
            <gc-tablecolumnfilters
              label="是否邮件通知"
              ref="emailSendFlagFilter"
              className="table__screen__icon"
              :list="[{ label: '开启', value: 'Y' }, { label: '关闭', value: 'N' }]"
              confirmText="确定"
              popperClass="circular"
              @filter="filterElements($event, 'emailSendFlag')"
              @reset="resetUserListFilter('emailSendFlag')"
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.emailSendFlag" :key="scope.row.id"
              active-color="#fd6720" inactive-color="#e4e7ed"
              active-value="Y" inactive-value="N"
              active-text="开" inactive-text="关"
              :disabled="scope.row.planStatus === YES_INT"
            ></el-switch>
          </template>
        </el-table-column>
      </gc-table>
    </gc-model>
  </div>
</template>
<script setup>
import { reactive, ref, nextTick, computed, onMounted, watch } from 'vue'
import { 
  fetchSelectMonthPlanPage, 
  fetchExportMonthPlanPage,
  fetchSaveOrUpdateMonthPlan,
  fetchSelectEmailUserList,
  fetchDeleteMonthPlan,
  fetchSelectZhFixedOrg,
  fetchSelectPlanMonthAndAuthority,
  fetchSelectMonthPlanInfo
} from '@/fetch/planManagement'
import { usePageList } from '@/hooks/usePageList'
import { useMonthlyPlan } from '../hooks/useMonthlyPlan'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'

import { getLoadingStatus, customHint, CopyObj, resetObj, optionsToObj } from '@/util/utils'
import { SUBMIT_STATUS_OPTIONS, YES_STATUS, NO_STATUS, YES_INT, NO_INT } from '@/util/constants'
import { fetchListTrainingClass } from '@/fetch/newPeopleTrainingManagement'
import { Message } from 'element-ui'
import gcEditor from '@/components/editor'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'

const emits = defineEmits(['pageChange', 'reloadOptions'])
const baseQueryForm = {
  planMonth: '', // 计划年度月度
  orgIds: [], // 机构
  updatedBy: '', // 更新人
  status: '',
  currPage: 1,
  pageSize: 10,
  total: 0,
}

const {
  tableFilterSetting,
  queryForm,
  dataList,
  queryDataListFormat,
  queryDataList,
  resetDataList,
  exportDataList,
} = usePageList({
  baseQueryForm,
  apiDataList: fetchSelectMonthPlanPage,
  apiExportDataList: fetchExportMonthPlanPage
})

const queryFormRules = {
  planMonth: [{ required: true, message: '请选择计划期数', trigger: 'change' }],
}

const {
  isAdmin,
  dropdownOrgValue,
  planMonthOptions,
  orgOptions,
  orgIdChange,
  getOrgOptions,
  getPlanMonthOptions,
  setDefaultMonthOption
} = useMonthlyPlan({
  queryForm
})

// 列表相关数据
const submitOptions = SUBMIT_STATUS_OPTIONS.map(m => ({...m, value: m.code}))
const columnList = [
  { type: 'index', label: '序号' },
  { width: '250', label: '举办机构', prop: 'orgName' },
  { width: '120', label: '月度计划状态', prop: 'planStatus',
    formatter: (row) => optionsToObj(submitOptions)[row.planStatus],
    ...tableFilterSetting('status', submitOptions, false) 
  },
  { width: '120', label: '月度计划项目数', prop: 'planClassNum', slot: 'planClassNum' },
  { width: '100', label: '计划覆盖人数', prop: 'planCoverNum' },
  { width: '150', label: '更新人', prop: 'updatedNameAndUm' },
  { width: '150', label: '更新时间', prop: 'updatedDate' },
  { width: '120', label: '已执行项目数', prop: 'executedNum' },
  { width: '120', label: '实际覆盖人数', prop: 'realCoverNum' },
]

// ========================== 新增/编辑计划 ==========================
const baseFormShow = ref(false)
const baseFormType = ref('')
const isAdd = computed(() => baseFormType.value === 'add')
const isEdit = computed(() => baseFormType.value === 'edit')
const baseFormTitle = ref('')
const baseFormData = {
  operate: '', // 操作：save新增，update修改
  planMonth: '', 
  emailSendFlag: 'N',
  emailContent: '',
  emailContentLen: 0,
  emailSendUsers: []
}
const emailContentMaxLen = 200
const emailContentValid = computed(() => baseForm.emailContentLen <= emailContentMaxLen)
const baseForm = reactive(CopyObj(baseFormData))
const emailContent = ref('')
const canSendEmail = computed(() => baseForm.emailSendFlag === YES_STATUS )
watch(() => baseForm.planMonth, (newVal, oldVal) => {
  if (isAdd.value && newVal) {
    const [year, month] = baseForm.planMonth.split('-')
    emailContent.value = `<p><font size="2">&nbsp; &nbsp; &nbsp; ${year}年${month}月月度培训计划已经开始收集，请您尽快到培训管理系统中完成<b style=""><font color="#f9963b">月度计划录入</font></b>及<b style=""><font color="#f9963b">上月计划执行检视</font></b>（将已举办的项目关联上对应的培训班编号），本月没有培训计划的也请到系统中提交确认，谢谢!</font><br/></p>`
  }
})
const baseFormRules = {
  planMonth: [{ required: true, message: '请输入培训计划年月', trigger: 'change' }],
  emailSendFlag: [{ required: true, message: '请设置邮件提醒', trigger: 'change' }]
}

function openBaseForm (icon) {
  mergeReactive({ origin: baseForm, target: CopyObj(baseFormData) })
  if (icon === 'add') {
    baseFormTitle.value = '新增计划'
    baseForm.operate = 'save'
  } else {
    if (!queryForm.planMonth) return Message.warning('请先选择计划期数')
    baseFormTitle.value = '编辑计划'
  }
  nextTick(async () => {
    baseFormRef.value.clearValidate()
    if (isEdit.value) {
      getPlanInfo()
    } 
  })
  baseFormType.value = icon
  baseFormShow.value = true
}

async function getPlanInfo () {
  const params = { planMonth: queryForm.planMonth }
  const data = await fetchSelectMonthPlanInfo(params)
  baseForm.planMonth = data.planMonth
  baseForm.emailSendFlag = data.emailSendFlag
  baseForm.emailContent = data.emailContent
  emailContent.value = data.emailContent
  baseForm.operate = 'update'
}

function getPlanDetail () {
  const params = { planMonth: queryForm.planMonth }
  fetchSelectMonthPlanInfo(params)
}

function emailContentChange (data) {
  baseForm.emailContent = data.content
  baseForm.emailContentLen = data.len
}
function emailSendFlagChange (value) {
  console.log(value)
  if (value === YES_STATUS && !baseForm.planMonth) {
    Message.warning('请先设置计划期数')
    baseForm.emailSendFlag = NO_STATUS
  }
}
const closeBaseForm = () => {
  baseFormShow.value = false
  nextTick(() => {
    baseFormRef.value.clearValidate()
  })
}
const baseFormRef = ref(null)
const comfirmBaseForm = () => {
  baseFormRef.value?.validate(async valid => {
    if (!emailContentValid.value) return Message.warning(`邮件内容不能超过${emailContentMaxLen}字`)
    if (valid && emailContentValid.value) {
      const params = { ...baseForm }
      params.emailContent = baseForm.emailContent || emailContent.value
      params.planMonth = baseForm.planMonth.replace('-','').substr(0,6)
      await fetchSaveOrUpdateMonthPlan(params)
      await getPlanMonthOptions(true, params.planMonth)
      _queryDataList()
      closeBaseForm()
      emits('reloadOptions', { reload: true })
      Message.success(`保存成功`)
    }
  })
}

// ============================== 配置通知名单 ==============================
const emailUserListShow = ref(false)
const emailUserListColumnList = [
  { type: 'index', label: '序号' },
  { label: '计划管理员', prop: 'empName', width: '150px', formatter: row => `${row.empName}(${row.umId})` },
  { label: '所属机构', prop: 'orgName', width: '200px' },
  { label: '月度计划状态', slot: 'planStatus' },
  { label: '是否邮件通知', slot: 'emailSendFlag' },
]
const emailSubmitOptions = computed(() => {
  return [...submitOptions.map(m => ({...m, text: m.label})), { value: '-', text: '计划未创建', label: '计划未创建' }]
}) 
const emailUserListDataList = ref([])
const renderEmailUserListDataList = ref([]) // 渲染用
// 获取导入记录
function getEmailUserList () {
  const planMonth = baseForm.planMonth.replace('-', '').substr(0,6)
  const params = { planMonth }
  fetchSelectEmailUserList(params)
  .then(resData => {
    emailUserListDataList.value = resData.filter(m => m.umId) || []
    handleCacheEmailUserList()
  })
}
// 本地筛选过滤方法
function filterData(data, conditions) {
  return data.filter( item => {
    for (let key in conditions) {
      if(conditions[key].length && conditions[key].every(m => m !== item[key])) {
        return false
      }
    }
    return true
  })
}
const filterFrom = {
  planStatus: [],
  emailSendFlag: []
}
function filterElements (list, type) {
  filterFrom[type] = list.list || []
  renderEmailUserListDataList.value = filterData(emailUserListDataList.value, filterFrom)
}

function resetUserListFilter (type) {
  filterFrom[type] = []
  renderEmailUserListDataList.value = filterData(emailUserListDataList.value, filterFrom)
}
function handleCacheEmailUserList () {
  if (baseForm.emailSendUsers?.length) {
    baseForm.emailSendUsers.forEach(m => {
      const index = emailUserListDataList.value.findIndex(u => u.umId === m.umId && u.orgId === m.orgId)
      emailUserListDataList.value[index].emailSendFlag = m.emailSendFlag
    })
    baseForm.emailSendUsers = []
  }
  renderEmailUserListDataList.value = emailUserListDataList.value
}

function openEmailUserList () {
  if (!baseForm.planMonth) 
    return Message.warning('请先设置计划年月')
  emailUserListDataList.value = []
  emailUserListShow.value = true
  getEmailUserList()
}

const importManageTableRef = ref(null)
const planStatusFilter = ref(null)
const emailSendFlagFilter = ref(null)
function closeEmailUserList () {
  emailUserListShow.value = false
  resetObj(filterFrom)
  planStatusFilter.value.$reset()
  emailSendFlagFilter.value.$reset()
  importManageTableRef.value.getTableRef().clearFilter()
}

// 确认-配置人员名单
function comfirmEmailUserList () {
  const submitUserList = emailUserListDataList.value
    .filter(m => m.planStatus !== YES_INT)
    .map(m => ({ umId: m.umId, orgId: m.orgId, emailSendFlag: m.emailSendFlag }))
  baseForm.emailSendUsers = submitUserList
  closeEmailUserList()
}

// ============================== 主列表操作 ==============================
const queryFormRef = ref(null)
const tablePaginationRef = ref(null)
const dropdownTreeRef = ref(null)
function  _queryDataList () {
  queryFormRef.value.validate(valid => {
    if (!valid) return
    queryDataList()
  })
}

const { mergeReactive } = useBaseDataEvents()
function _resetDataList () {
  mergeReactive({ origin: queryForm, target: CopyObj(baseQueryForm) })
  setDefaultMonthOption()
  queryFormRef.value.clearValidate()
  tablePaginationRef.value?.resetFilters()
  dropdownTreeRef.value?.setValue([])
  if (queryForm.planMonth) {
    _queryDataList()
  }
}

// 删除计划
function deletePlan () {
  customHint('删除后无法恢复，确认删除本期计划？', '提示', '取消')
  .then(async () => {
    const params = { planMonth: queryForm.planMonth }
    await fetchDeleteMonthPlan(params)
    await getPlanMonthOptions(true)
    // 需要加一个逻辑判断，如果全部计划月都删除了的话，只做重置，不做查询
    if(!planMonthOptions.value?.length) {
      dataList.value = []
      queryFormRef.value?.clearValidate()
      queryForm.total = 0
    } else {
      _queryDataList()
    }
    emits('reloadOptions', { reload: true })
    Message.success('删除成功！')
  })
}

function gotoPlanDetail (row) {
  emits('pageChange', {
    tabName: 'PlanDetailRecord',
    pageName: 'list',
    row: { orgIds: row.orgId, planMonth: queryForm.planMonth }
  })
}

// 初始化页面数据
onMounted(async () => {
  getOrgOptions(true)
  await getPlanMonthOptions(true)
  if (queryForm.planMonth) {
    _queryDataList()
  }
})

defineExpose({
  _queryDataList
})

</script>
<style lang="scss" scoped>
.color-theme {
  color: $themeColor;
}
.email-desc {
  font-size: 14px;
  a {
    text-decoration: underline;
    color: rgb(25, 137, 250);
  }
}
// :deep(.el-table-filter) {
//   .el-table-filter__bottom {
//     display: flex;
//     justify-content: space-between;
//   }
// }
</style>