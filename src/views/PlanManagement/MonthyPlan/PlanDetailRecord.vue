<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-card ">
      <el-form :model="queryForm" :rules="queryFormRules" ref="queryFormRef" inline>
        <el-form-item label="计划期数" prop="planMonth">
          <gc-select 
            :options="planMonthOptions" 
            v-model="queryForm.planMonth"
            :clearable="false" 
            class="w-150" />
        </el-form-item>
        <el-form-item label="机构" prop="orgIds">
          <DropdownZhOrg
            key="dropdownZhOrgPlanDetail"
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
        <el-form-item label="学员所在分行" class="student-branch" style="width: 350px;">
          <!-- <gc-select placeholder="UM号/姓名" v-model.trim="queryForm.branchOrgOptons"></gc-select> -->
          <gc-select
            class="w-full"
            filterable
            multiple
            collapse-tags
            :options="branchOrgOptons"
            v-model="queryForm.branchList"
          ></gc-select>
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
        <template v-if="isOrgAdmin">
          <template v-if="orgOptions.length && !planIsRelease">
            <span class="instructor-icons__upload" @click="openImportForm()"><i class="instructor-icons__upload__icon"></i>批量添加</span>
            <span class="instructor-icons__add" @click="openBaseForm('add')"><i class="instructor-icons__add__icon"></i>添加</span>
            <span class="instructor-icons__add" @click="submitPlanDetail()"><i class="instructor-icons__submit__icon"></i>提交</span>
          </template>
          <span v-if="!planIsRelease" class="instructor-icons__del" @click="deletePlanDetail()"><i class="instructor-icons__del__icon"></i>删除</span>
        </template>
        <el-popover @show="openTableHeader"  transfer trigger="click" ref="popovercasescoreRef">
          <div class="mt12">
            <div class="infinite-list">
              <el-checkbox-group v-model="tableHeaderArr">
                <ul class="column-list">
                  <li v-for="col in columnList.slice(1)" :key="col.prop">
                    <el-checkbox :label="col.prop" :disabled="columnListDisabled.includes(col.prop)">{{col.label}}</el-checkbox>
                  </li>
                </ul>
              </el-checkbox-group>
            </div>
            <div class="state-popover-btns">
              <span @click="comfirmTableHeader" class="active fl StatementCentre__btn-text">确定</span>
              <span @click="resetTableHeader" class="active fr StatementCentre__btn-text">重置</span>
            </div>
          </div>
          <span slot="reference" class="instructor-icons__edit" ><i class="instructor-icons__edit__icon"></i>表头设置</span>
        </el-popover>
        <span class="instructor-icons__upload" @click="_exportDataList()"><i class="instructor-icons__download__icon"></i>导出</span>
      </div>
      <table-pagination
        :page-sizes="[10,50,100]"
        :list="columnListAfterSet"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="queryDataListFormat"
        v-loading="getLoadingStatus('LOADING_MONTH_PLAN_DETAIL_LIST')"
        :key="tableUid"
        ref="tablePaginationRef">
        <el-table-column slot="hasBranch" label="是否包含分行学员" width="140px">
          <template slot="header">
            <gc-tablecolumnfilters
              ref="hasBranchFilterRef"
              label="是否包含分行学员"
              className="table__screen__icon"
              :list="yesOrNoMap"
              confirmText="确定"
              popperClass="circular"
              @filter="commonFilter($event, queryForm, 'hasBranch', queryDataListFormat, 'filter')"
              @reset="commonFilter($event, queryForm, 'hasBranch', queryDataListFormat)"
              radio>
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            <el-button type="text" @click="openViewOrgForm(scope.row)" v-if="scope.row.hasBranch === YES_STATUS">是</el-button>
            <span v-else style="padding: 0px 10px;">否</span>
          </template>
        </el-table-column>
        <!-- 判断是否普通用户 -->
        <el-table-column label="操作" width="105px" fixed="right" v-if="isOrgAdmin">
          <template slot-scope="scope">
            <!-- 判断是否包含有机构权限 -->
            <div v-if="scope.row.isOrgAdmin === YES_STATUS">
              <span v-if="scope.row.status === NO_INT" class="item active mr10" @click="openBaseForm('edit', scope.row)">编辑</span>
              <span class="item active" :class="{ 'pass': scope.row.checkType !== NO_INT}" v-if="scope.row.status === YES_INT" @click="openRelateClass(scope.row)">{{ scope.row.checkType === NO_INT ? '检视' : '已检视' }}</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 导入学员评价 -->
    <gc-model :title="baseFormTitle" :visible="baseFormShow" width="700px"
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
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="邮件提醒" prop="emailSwitch">
          <el-switch v-model="baseForm.emailSwitch" 
            active-color="#e4e7ed" inactive-color="#fd6720"
            active-text="否" inactive-text="是" 
            active-value="N" inactive-value="Y"
          ></el-switch>
        </el-form-item>
        <el-form-item label="邮件内容" prop="classId">
          
        </el-form-item>
      </el-form>
    </gc-model>

    <!-- 批量导入弹框 -->
    <ImportModel
      :show="importShow"
      :faildColumns="importFaildColumns"
      :uploadParams="uploadParams"
      :importFetchFn="fetchBatchImportPlanMonthDetail"
      :faildExportFetchFn="fetchExportFailPlanMonthDetail"
      templateCode="MONTH_PLAN_ADD_BATCH"
      @showChange="importShow = $event"
      @comfirm="comfirmImportForm"
    ></ImportModel>

    <!-- 弹框：涉及分行 -->
    <gc-model title="查看涉及分行" :visible="viewOrgFormShow" width="700px"
      cancelText=""
      comfirmText="关闭"
      @close="closeViewOrgForm" 
      @comfirm="closeViewOrgForm">
      <el-form :model="viewOrgFormForm" label-width="90px">
        <el-form-item label="培训班名称 :">
          <span>{{viewOrgFormForm.planClassName}}</span>
        </el-form-item>
        <el-form-item label="涉及分行 :">
          <div class="org-list-view mtb10">
            <template v-if="viewOrgFormForm.branchOrgList && viewOrgFormForm.branchOrgList.length" >
              <el-tag class="mr10" type="info" v-for="(item,i) in viewOrgFormForm.branchOrgList" :key="i" :closable="false">
                <span>{{item.treeName}}</span>
              </el-tag>
            </template>
          </div>
        </el-form-item>
      </el-form>
    </gc-model>

    <!-- 弹框：检视 -->
    <gc-model title="检视" :visible="relateClassShow" width="600px" 
      @close="closeRelateClass" 
      @cancel="closeRelateClass" 
      :isShowFooter="!relateClassForm.disabled"
      :comfirmLoading="comfirmLoading"
      @comfirm="comfirmRelateClass">
      <el-form label-width="120px" :model="relateClassForm" :rules="relateClassFormRules" ref="relateClassFormRef">
        <el-form-item label="培训班名称 :" class="w-full">
          <span class="active">{{relateClassForm.planClassName}}</span>
        </el-form-item>
        <el-form-item label="执行情况 :" class="w-full" prop="checkType">
          <div class="status-switch">
            <div v-for="(item, index) in CHECK_STATUS_OPTIONS" :key="index" 
            :class="{'active': relateClassForm.checkType === item.value, 'disable': relateClassForm.disabled }"
            @click="changeCheckType(item.value)"
            class="status-item">{{item.label}}</div>
          </div>
        </el-form-item>
        <el-form-item v-if="relateClassForm.checkType === YES_INT" label="关联培训班编号 :" class="w-full" prop="classId">
          <gc-select-auto 
            v-model="relateClassForm.classId"
            :disabled="relateClassForm.disabled"
            :fetchFn="fetchSelectClassInfoById"
            :getParams="(v)=> ({ planMonth: relateClassForm.planMonth , classId: v})"
            :getResList ="handleResList"
          ></gc-select-auto>
        </el-form-item>
        <el-form-item v-if="relateClassForm.checkType === DELAY" label="延期至 :" prop="delayEndDate">
          <DateRange
            v-model="relateClassForm"
            start-key="delayStartDate"
            end-key="delayEndDate"
            :start-options="dateRangeOptions"
            :end-options="dateRangeOptions"
            :dataRangeDisableDate="dataRangeDisableDate"
            :disabled="relateClassForm.disabled"
            width="90px"
          ></DateRange>
          <div class="tips-delay mt10">
            <span>注：此项目将自动出现在延期举办开始时间所在月份的月度计划中，届时请注意提交</span>
          </div>
        </el-form-item>
        <el-form-item v-if="relateClassForm.checkType === CANCEL" label="取消原因 :" prop="cancelReason">
          <el-input
            type="textarea"
            resize="none"
            :rows="4"
            :disabled="relateClassForm.disabled"
            maxlength="100"
            show-word-limit
            v-model="relateClassForm.cancelReason"
            placeholder="请输入取消原因"
          ></el-input>
        </el-form-item>
      </el-form>
    </gc-model>

  </div>
</template>
<script setup>
import { reactive, ref, nextTick, computed, onMounted, watch, set } from 'vue'
import { usePageList } from '@/hooks/usePageList'
import { useMonthlyPlan } from '../hooks/useMonthlyPlan'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'

import DateRange from '@/components/dateRange/DateRange'
import { commonFilter, getLoadingStatus, customHint, optionsToObj, isObj, CopyObj, uuid, resetObj, merge, filterObj, formatDate, lastDay } from '@/util/utils'
import { TRAININGMODE, SUBMIT_STATUS_OPTIONS, YES_STATUS , YES_INT , NO_INT, yesOrNoMap, EXECUTE_STATUS_OPTIONS } from '@/util/constants'
import { TRAIN_TYPE_OPTIONS, CHECK_STATUS_OPTIONS, DELAY, CANCEL } from '../enum'
import { 
  fetchSelectPlanMonthDetailList,
  fetchExportPlanMonthDetaillList,
  fetchBatchImportPlanMonthDetail,
  fetchSaveBatchImportPlanMonthDetail,
  fetchExportFailPlanMonthDetail,
  fetchSelectPlanMonthDetail,
  fetchDeletePlanMonthDetail,
  fetchSelectZhFixedOrg,
  fetchSelectPlanMonthAndAuthority,
  fetchSubmitPlanMonthDetailById,
  fetchSubmitPlanMonthDetailByOrg,
  fetchSelectClassInfoById,
  fetchCheckPlanDetail,
  fetchSelectNoPlanDetailForOrg,
  fetchSelectMonthPlanPosterStatus,
  fetchSelectAllBranchOrg
} from '@/fetch/planManagement'
import ImportModel from '@/components/upload/ImportModel'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'
import { Message } from 'element-ui'
import { useRouter, useRoute } from '@/router'

const emits = defineEmits(['pageChange', 'reloadPlanList'])
const props = defineProps({
  activeName: String,
  planMonth: String,
  orgIds: String
})

// 获取分行选项
const branchOrgOptons = ref([])
async function getBranchOrgOptons () {
  const res = await fetchSelectAllBranchOrg()
  branchOrgOptons.value = res.map(m => {
    m.value = m.treeId
    m.label = m.treeName
    return m
  }) || []
}
getBranchOrgOptons()

const tablePaginationRef = ref(null)
const baseQueryForm = {
  orgIds: [],
  planMonth: '', // 参训年份
  planMonthOld: '', // 参训年份
  updatedBy: '',
  headList: [],
  classTypeList: [], // 培训类型
  trainingModeList: [], // 举办形式
  status: '',
  hasBranch: '',
  checkType: '',
  currPage: 1,
  pageSize: 10,
  total: 0,
  // 学员所在分行
  branchList: []
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
  apiDataList: fetchSelectPlanMonthDetailList,
  apiExportDataList: fetchExportPlanMonthDetaillList
})

const queryFormRules = {
  planMonth: [{ required: true, message: '请选择计划期数', trigger: 'change' }],
}

const {
  isAdmin,
  isOrgAdmin,
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
const columnList = ref([
  // { type: 'selection', selectable: (row, index) => row.status === NO_INT },
  { type: 'selection', fixed: 'left' },
  { type: 'index', label: '序号', prop: 'finalSeq', canHide: false },
  { width: '200', label: '举办机构', prop: 'treeName', canHide: false },
  { width: '120', label: '培训类型', prop: 'classTypeName', canHide: false,
    ...tableFilterSetting('classTypeList', TRAIN_TYPE_OPTIONS) 
  },
  { width: '200', label: '培训班名称', prop: 'planClassName', canHide: false },
  { width: '200', label: '培训对象', prop: 'attendObject', isHide: false },
  { width: '200', label: '培训内容/主题', prop: 'trainingSubject' },
  { width: '100', label: '举办形式', prop: 'trainingModeDesc',
    ...tableFilterSetting('trainingModeList', TRAININGMODE)  
  },
  { width: '200', label: '计划举办时间', prop: 'planDateStr' },
  { width: '100', label: '培训天数', prop: 'trainingDays' },
  { width: '120', label: '计划培训人数', prop: 'planNum' },
  { width: '120', label: '是否包含分行学员', prop: 'hasBranch', slot: 'hasBranch' },
  { width: '100', label: '提交状态', prop: 'status',
    formatter: (row) => optionsToObj(submitOptions)[row.status],
    ...tableFilterSetting('status', submitOptions, false) 
  },
  { width: '120', label: '培训执行情况', prop: 'checkTypeDesc',
    ...tableFilterSetting('checkType', EXECUTE_STATUS_OPTIONS, false) 
  },
  { width: '120', label: '关联培训班编号', prop: 'classId' },
  { width: '180', label: '更新人', prop: 'updatedByName' },
  { width: '120', label: '更新时间', prop: 'updatedDateStr' },
])

const columnListAfterSet = computed(() => {
  return columnList.value.filter(m => !m.isHide)
})
const planIsRelease = ref(false)
watch(() => queryForm.planMonth, async (newV, oldV) => {
  queryForm.planMonthOld = oldV
})
// ============================== 导入学员成绩 ==============================
const importShow = ref(false)
// 导入失败数据列表
const importFaildColumns = [
  { label: '序号', type: 'index', width: '40px' },
  { label: '举办机构', prop: 'treeName', width: '200px' },
  { label: '培训类型', prop: 'classTypeName', width: '90px' },
  { label: '培训班名称', prop: 'planClassName', width: '150px' },
  { label: '培训对象', prop: 'attendObject', width: '120px' },
  { label: '培训内容/主题', prop: 'trainingSubject', width: '150px' },
  { label: '举办形式', prop: 'trainingModeDesc', width: '90px' },
  { label: '计划举办开始时间', prop: 'startDateStr', width: '130px' },
  { label: '计划举办结束时间', prop: 'endDateStr', width: '130px' },
  { label: '培训天数', prop: 'trainingDays', width: '80px' },
  { label: '培训人数', prop: 'planNum', width: '80px' },
  { label: '是否包含分行学员', prop: 'hasBranchDesc', width: '90px' },
  { label: '涉及分行', prop: 'branchOrgName', width: '200px' },
  { label: '失败原因', prop: 'msg', width: '200px' }
]
const uploadParams = ref({})
// 打开导入弹框
function openImportForm () {
  uploadParams.value = { planMonth: queryForm.planMonth, tip: 'N' }
  importShow.value = true
}
// 导入确认
async function comfirmImportForm (data) {
  await fetchSaveBatchImportPlanMonthDetail({ planMonth: queryForm.planMonth, detailList: data.successList, tip: 'Y'})
    importShow.value = false
    _queryDataList()
    Message.success('新增成功！')
}

// ========================== 新增/编辑计划 ==========================
const baseFormShow = ref(false)
const baseFormTitle = ref('')
const baseForm = reactive({
  planMonth: '',
  emailSwitch: 'Y'
})
const baseFormRules = {
  planMonth: [{ required: true, message: '请输入培训计划年月', trigger: 'change' }],
  emailSwitch: [{ required: true, message: '请设置邮件提醒', trigger: 'change' }]
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
    if (valid) {
      const params = { classId: baseForm.classId }
      const number = await fetchAddTrainingClass(params)
      _queryDataList()
      closeBaseForm()
      Message.success(`保存成功`)
    }
  })
}

// ========================== 弹框：查看涉及分行 ==========================
const viewOrgFormShow = ref(false)
const viewOrgFormForm = reactive({
  planClassName: '',
  branchOrgList: []
})

async function openViewOrgForm (row) {
  row = await fetchSelectPlanMonthDetail({ id: row.id })
  viewOrgFormForm.planClassName = row.planClassName
  viewOrgFormForm.branchOrgList = row.branchOrgList
  viewOrgFormShow.value = true
}

const closeViewOrgForm = () => {
  viewOrgFormShow.value = false
}

// ============================== 弹框：关联培训班 ==============================
const relateClassShow = ref(false)
const relateClassFormRef = ref(null)
const relateClassForm = ref({
  id: '',
  classId: '',
  planMonth: '',
  checkType: '', // 检视类型 1:已执行、2:延期、3:取消
  delayStartDate: '',
  delayEndDate: '',
  cancelReason: '',
  planClassName: '',
  disabled: false
})
const relateClassFormRules = {
  checkType: [{ required: true, message: '请选择执行情况' }],
  classId: [{ required: true, message: '请输入关联培训班编号' }],
  delayEndDate: [{ required: true, message: '请选择延期时间', 
    validator: (rule, value, callback) => {
      if (!relateClassForm.value.delayEndDate || !relateClassForm.value.delayStartDate) {
        return callback(new Error('请选择延期时间'))
      }
      return callback()
    }
  }],
  cancelReason: [{ required: true, message: '请输入取消原因' }]
}
const dateRangeOptions = { 'value-format': 'yyyy-MM-dd', type: 'date' }
const dataRangeDisableDate = () => {
  return {
    startPickerOptions: {
      disabledDate: (time) => {
        const year = queryForm.planMonth.substr(0, 4)
        const month = queryForm.planMonth.substr(4, 2)
        if(formatDate(time) <= lastDay(`${year}-${month}-01`)){
          return true
        }
        if (relateClassForm.value.delayEndDate && (formatDate(time) > relateClassForm.value.delayEndDate)) {
          return true
        }
      }
    },
    // el-date-picker 结束时间限制
    endPickerOptions: {
      disabledDate: (time) => {
        const year = queryForm.planMonth.substr(0, 4)
        const month = queryForm.planMonth.substr(4, 2)
        if(formatDate(time) <= lastDay(`${year}-${month}-01`)){
          return true
        }
        if (relateClassForm.value.delayStartDate) {
          return formatDate(time) < relateClassForm.value.delayStartDate
        }
      }
    }
  }
}
const validateMsg = ref(false)
const relateClassFormSubmiting = ref(false)

// 表头设置-打开弹框
async function openRelateClass (row) {
  resetObj(relateClassForm.value)
  merge(relateClassForm.value, row)
  relateClassForm.value.planMonth = queryForm.planMonth
  if (relateClassForm.value.checkType !== NO_INT) {
    relateClassForm.value.disabled = true
  }
  relateClassShow.value = true
}
// 执行情况切换
function changeCheckType (val) {
  if (relateClassForm.value.disabled) return
  relateClassForm.value.checkType = val
  relateClassFormRef.value.clearValidate()
}
// 表头设置-关闭弹框
function closeRelateClass () {
  relateClassShow.value = false
  relateClassFormRef.value?.clearValidate()
}
// 状态描述 1 成功可用 2 不存在，3 未结训:只能关联已结训的培训班，请先结训  4 该培训班本期已关联，请勿重复关联
function handleResList (res) {
  let list = []
  if (res.status === '2') {
    validateMsg.value = false
  } else if (res.status === '1') {
    list = [res.classManagerVO] || []
    list.forEach(m => {
      m.value = m.classId
      m.label = `编号 : ${m.classId} -- 名称 : ${m.className}`
    })
    validateMsg.value = false
  } else {
    list = [res.classManagerVO] || []
    list.forEach(m => {
      m.value = m.classId
      m.label = `编号 : ${m.classId} -- 名称 : ${m.className} -- ${res.statusDesc}`
      m.disabled = true
    })
    validateMsg.value = { code: res.status, msg: res.statusDesc }
  }
  return list
}
const comfirmLoading = ref(false)
// 检视-确认
async function comfirmRelateClass () {
  relateClassFormRef.value?.validate(async valid => {
    if (valid) {
      comfirmLoading.value = true
      await fetchCheckPlanDetail({ data: filterObj(relateClassForm.value) }).finally(() => comfirmLoading.value = false)
      _queryDataList()
      closeRelateClass()
      Message.success('检视成功！')
      emits('reloadPlanList', { reload: true })
    }
  })
  
}

// ============================== 配置表头弹框 ==============================
const popovercasescoreRef = ref(null)
// const tableHeaderShow = ref(false)
const tableHeaderArr = ref([])
// 固定-不能取消的字段
const columnListDisabled = computed(() => {
  return columnList.value.filter(m => m.canHide === false).map(m => m.prop)
})
// 表头设置-打开弹框
function openTableHeader () {
  // tableHeaderShow.value = true
  tableHeaderArr.value = columnList.value.filter(m => !m.isHide).map(m => m.prop)
}
function closeTableHeader () {
  // tableHeaderShow.value = false
  popovercasescoreRef.value?.doClose()
}
// 表头设置-关闭弹框
function resetTableHeader () {
  // tableHeaderShow.value = false
  tableHeaderArr.value = columnList.value.map(m => m.prop)
  comfirmTableHeader()
}
// 表头设置-确认
const tableUid = ref(uuid())
function comfirmTableHeader () {
  const cacheList = CopyObj(columnList.value)
  cacheList.forEach(m => {
    if (columnListDisabled.value.includes(m.prop)) return
    if (tableHeaderArr.value.includes(m.prop)){
      m.isHide = false
    } else {
      m.isHide = true
    }
  })
  columnList.value = cacheList
  closeTableHeader()
  tableUid.value = uuid()
}
// 列全选
function fieldCheckAllChange (value) {
  if (value) {
    tableHeaderArr.value = columnList.value.map(m => m.prop)
  } else {
    tableHeaderArr.value = columnListDisabled.value
  }
}

// ==========================================

async function openBaseForm (type, row) {
  if (type === 'edit') {
    set(row, 'branchOrgIds', row?.branchOrgId ? row.branchOrgId.split(',') : [])
    // row.branchOrgIds = row?.branchOrgId ? row.branchOrgId.split(',') : []
  }
  emits('pageChange', {
    pageName: 'form',
    formType: type,
    row 
  })
}

const queryFormRef = ref(null)
const dropdownTreeRef = ref(null)
const hasBranchFilterRef = ref(null)
function  _queryDataList () {

  queryFormRef.value.validate(valid => {
    if (!valid) return
    // 查看当前查询月份的计划是否已发布
    if (queryForm.planMonth !== queryForm.planMonthOld) {
      fetchSelectMonthPlanPosterStatus({ planMonth: queryForm.planMonth })
      .then(res => {
        planIsRelease.value = res === '1'
      })
    }
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
  hasBranchFilterRef.value.$reset()
  if (queryForm.planMonth) {
    _queryDataList()
  }
}

function _exportDataList () {
  queryFormRef.value.validate(valid => {
    if (!valid) return
    queryForm.headList = columnListAfterSet.value.filter(m => m.prop).map(m => m.prop)
    const params = { ...queryForm }
    exportDataList(params)
  })
}

async function submitPlanDetail () {
  const selectList = tablePaginationRef.value.getSelection()
  if (selectList?.length) {
    if (selectList.some(m => m.status === YES_INT)) 
      return Message.warning('已提交的记录不用再提交，请重新选择')
    customHint('提交的培训项目不能修改和删除，确认是否提交？', '提示', '取消')
    .then(async () => {
      const ids = selectList.map(m => m.id)
      await fetchSubmitPlanMonthDetailById({planMonth: queryForm.planMonth, ids})
      Message.success('提交成功')
      _queryDataList()
      emits('reloadPlanList', { reload: true })
    })
  } else { 
    // 未选择培训计划
    // XX年XX期XX机构无培训计划，请确认是否提交
    if (!queryForm.orgIds?.length) {
      return Message.warning('若本期无培训项目，请选择机构后直接提交，否则至少选择一个项目提交')
    }
    const orgNames = dropdownOrgValue.value.map(m => m.label)
    const orgNamesStr = orgNames.join() || ''
    // const commitOrgs = dropdownOrgValue.value.map(m => ({ xrCode: m.value, xrMsg: m.label }))
    const year = queryForm.planMonth.substr(0, 4)
    const month = queryForm.planMonth.substr(4, 2)
    const params = { planMonth: queryForm.planMonth, orgList: dropdownOrgValue.value.map(m => m.value) }
    const resNoPlanDetail = await fetchSelectNoPlanDetailForOrg(params)
    // debugger
    if (resNoPlanDetail.status === 1) {
      // await customHint(`${year}年${month}期"${orgNamesStr}"无培训计划，请确认是否提交？`, '提示', '取消')
      await customHint(`${resNoPlanDetail.msg}无培训计划，请确认是否提交？`, '提示', '取消')
    } else {
      await customHint('提交的培训项目不能修改和删除，确认是否提交？', '提示', '取消')
    }
    await fetchSubmitPlanMonthDetailByOrg(params)
    Message.success(`提交成功`)
    _queryDataList()
    emits('reloadPlanList', { reload: true })
  }
}

// 删除计划明细
function deletePlanDetail () {
  const selectList = tablePaginationRef.value.getSelection()
  if (!selectList?.length) return Message.warning('请选择要删除的记录')
  // 不为超管 且 所选择的记录包含“已提交”的记录
  if (!isAdmin.value && selectList.some(m => m.status === YES_INT)) {
    return Message.warning('已提交的数据不能被删除，请重新选择')
  }
  customHint('确认要删除所选记录吗？', '提示', '取消')
  .then(async () => {
    const ids = selectList.map(m => m.id)
    await fetchDeletePlanMonthDetail({ ids })
    _queryDataList()
    Message.success('删除成功！')
    emits('reloadPlanList', { reload: true })
  })
}

async function loadOptions () {
  await getPlanMonthOptions()
  if(!planMonthOptions.value?.length) {
    dataList.value = []
    queryFormRef.value?.clearValidate()
    queryForm.total = 0
  }
}

defineExpose({
  _queryDataList,
  loadOptions
})

async function _initOptionsAndList () {
  getOrgOptions(true)
  await getPlanMonthOptions(true)
  if (queryForm.planMonth) {
    _queryDataList()
  }
}

async function _initData (planMonth, orgIds) {
  if (planMonthOptions.value?.length) {
    queryForm.planMonth = planMonth
  } else {
    await getPlanMonthOptions(true, planMonth)
  }
  // const orgList = orgOptions.value?.length ? orgOptions.value : await getOrgOptions(true)
  if (orgIds) {
    let orgIdArr = props.orgIds.split(',')
    orgIdArr = orgOptions.value.filter(m => orgIdArr.includes(m.orgId)).map(m=> ({orgId: m.orgId, orgName: m.orgName}))
    dropdownTreeRef.value?.setValue(orgIdArr)
  }
  nextTick(() => {
    if (queryForm.planMonth) {
      _queryDataList()
    }
  })
}

watch(() => {
  return [props.activeName, props.planMonth, props.orgIds]
}, (newV, oldV)=> {
  console.log('PlanDetailRecord-watch',newV, oldV)
  const [ activeName, planMonth, orgIds ] = newV
  const [ activeNameOld, planMonthOld, orgIdsOld ] = oldV
  if (activeName === 'PlanDetailRecord') {
    if (planMonth && orgIds && (planMonth !== planMonthOld || orgIds !==orgIdsOld)) {
      _initData(planMonth, orgIds)
    } else if (!planMonthOptions.value.length && !orgOptions.value.length) {
      _initOptionsAndList()
    }
  }
})

</script>
<style lang="scss" scoped>
.infinite-list {
  padding: 10px 15px;
  .column-list {
    line-height: 22px;
  }
}
.state-popover-btns {
  line-height: 25px;
}

.org-list-view {
  padding: 5px 10px;
  border: 1px #e9e9e9 solid;
  border-radius: 2px;
  min-height: 200px;
  
  :deep(.el-tag) {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.status-switch {
  display: flex;
  .status-item {
    padding: 0 20px;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    cursor: pointer;
    &:first-child {
      border-left: 1px solid #e4e7ed;
      border-bottom-left-radius: 6px;
      border-top-left-radius: 6px;
    }
    &:last-child {
      border-right: 1px solid #e4e7ed;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
    }
    &.active {
      border: 1px solid #fec85d;
      margin-left: -1px;
    }
    &:first-child.active {
      border: 1px solid #fec85d;
      margin-right: -1px;
      margin-left: 0;
    }
    &.disable {
      cursor: not-allowed;
    }
  }
}
.tips-delay {
  line-height: 16px;
  span {
    color: #909399;
  }
}
.item.active.pass {
  color: #12BA8D;
}
.student-branch {
  width: 350px;
  :deep(.el-form-item__content) {
    width: 250px;
  }
  :deep(.el-input__inner) {
    height: 30px !important;
  }
}
</style>