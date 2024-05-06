<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" :rules="queryRules" inline ref="queryFormRef">
        <el-form-item label="部门" class="">
          <div class="df">
            <gc-institution v-model="queryForm.blgOrgIds" ref="institutionRef"> </gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"> 含下属机构 </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="评聘年度" prop="evaluateYear">
          <gc-select k="evaluateYearName" v="evaluateYearId" class="w-200" :options="yearsOptions" v-model="queryForm.evaluateYear"></gc-select>
        </el-form-item>
        <el-form-item label="培训师类型">
          <gc-select class="w-250" multiple collapse-tags :options="trainersTypes" v-model="queryForm.trainersType"></gc-select>
        </el-form-item>
        <el-form-item label="培训师UM号/姓名">
          <el-input v-model="queryForm.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="授课类型">
          <gc-select class="w-200" multiple collapse-tags :options="TRAINING_TYPES" v-model="queryForm.trainingTypes"></gc-select>
        </el-form-item>
        <el-form-item label="授课日期">
          <el-date-picker
            class="w-120"
            v-model="queryForm.trainingStartDate"
            type="date"
            placeholder="开始日期"
            :picker-options="trainingStartDateOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <span style="padding: 0 10px;">至</span>
          <el-date-picker
            class="w-120"
            v-model="queryForm.trainingEndDate"
            type="date"
            placeholder="结束日期"
            :picker-options="trainingEndDateOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记账日期">
          <el-date-picker
            class="w-120"
            v-model="queryForm.accountStartDate"
            type="date"
            placeholder="开始日期"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <span style="padding: 0 10px;">至</span>
          <el-date-picker
            class="w-120"
            v-model="queryForm.accountEndDate"
            type="date"
            placeholder="结束日期"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="queryData" type="primary">查询</el-button>
          <el-button @click="resetData">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination class="table-left" :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePaginationRef">
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'PointDetailReport'
}
</script>

<script setup>
import { CopyObj } from '@/util/utils'
import { trainersTypes, busiTypes } from '@/util/constants'
import { fetchSelectTrainersDetailPoints, fetchListEvaluationYear, fetchExportSelectTrainersDetailPoints } from '@/fetch/pointManagement'
import { useTable } from '@/hooks/useTable'
import { POINTS_INCOMES, ORDER_TYPES, HOLIDAY_OPTIONS, TRAINING_TYPES, HOLIDAY_STATUS } from '@/views/TrainerManagement/enum'
import { ref } from 'vue'

const baseParams = {
  teacherName: '',
  evaluateYear: '',
  blgOrgIds: [],
  trainerUM: '',
  department: '',
  evaluateYear: '',
  trainersType: [],
  trainingTypes: [],
  teacherOrgNameOrder: '0',
  pointTotalOrder: '0',
  isHoliday: '',
  pointsIncome: '',
  // 授课日期
  // trainingRange: [],
  trainingStartDate: '',
  trainingEndDate: '',
  // 记账日期
  accountStartDate: '',
  accountEndDate: '',
  isGotSubBranch: true
}
const tablePaginationRef = ref(null)
const { queryForm, tableList, query, reset, tableFilterSetting, requiredHandle, dataRangeRules } = useTable(baseParams, tablePaginationRef)
const { startPickerOptions, endPickerOptions } = dataRangeRules('accountStartDate', 'accountEndDate')
const { startPickerOptions: trainingStartDateOptions, endPickerOptions: trainingEndDateOptions } = dataRangeRules('trainingStartDate', 'trainingEndDate')
const columns = [
  { label: 'UM帐号', prop: 'umId', width: '150' },
  { label: '姓名', prop: 'teacherName' },
  {
    label: '部门',
    prop: 'orgName',
    width: '150',
    ...tableFilterSetting('teacherOrgNameOrder', ORDER_TYPES, false)
  },
  {
    label: '业务条线',
    prop: 'blgStripLineName',
    width: '100'
  },
  { label: '岗位', prop: 'postDesc', width: '150' },
  { label: '评聘年度', prop: 'evaluateYearName', width: '100' },
  {
    label: '培训师类型',
    prop: 'trainersTypeName',
    width: '120'
  },
  {
    label: '授课类型',
    prop: 'trainingType',
    width: '100'
  },
  {
    label: '收入/支出',
    prop: 'pointsIncome',
    width: '100',
    ...tableFilterSetting('pointsIncome', POINTS_INCOMES, false)
  },
  { label: '积分原因', prop: 'remark', width: '200' },
  {
    label: '积分值',
    prop: 'totalPoints',
    ...tableFilterSetting('pointTotalOrder', ORDER_TYPES, false)
  },
  {
    label: '是否双倍积分',
    prop: 'isHolidayDesc',
    width: '110',
    ...tableFilterSetting('isHoliday', HOLIDAY_OPTIONS, false)
  },
  { label: '授课项目ID', prop: 'trainingId', width: '150' },
  { label: '授课名称', prop: 'courseName', width: '150' },
  { label: '授课开始时间', prop: 'startTime', width: '160' },
  { label: '授课结束时间', prop: 'endTime', width: '160' },
  { label: '授课时长（分钟）', prop: 'totalDuration', width: '130' },
  { label: '课程上架日期', prop: 'microsUploadTime', width: '160' },
  { label: '记账时间', prop: 'accountTime', width: '160' },
  { label: '记账方式', prop: 'accountPattern', width: '110' },
  { label: '备注', prop: 'otherRemark', width: '160' }
]

// 规则
const queryRules = {
  evaluateYear: [requiredHandle('请选择评聘年度')]
}

// 格式化
const formatParams = (params) => {
  const data = CopyObj(params)
  const [busiType, orgId] = data.blgOrgIds
  data.busiType = busiType
  data.orgId = orgId
  data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
  data.trainersType = data.trainersType.join(',')
  Reflect.deleteProperty(data, 'blgOrgIds')
  if(!data.trainingStartDate) Reflect.deleteProperty(data, 'trainingStartDate')
  if(!data.trainingEndDate) Reflect.deleteProperty(data, 'trainingEndDate')
  if(!data.accountStartDate) Reflect.deleteProperty(data, 'accountStartDate')
  if(!data.accountEndDate) Reflect.deleteProperty(data, 'accountEndDate')
  return data
}

const queryFormRef = ref(null)
const getList = async () => {
  queryFormRef.value.validate(async (v) => {
    if (!v) return false
    const data = formatParams(queryForm)
    const { list, total } = await fetchSelectTrainersDetailPoints({ data })
    tableList.value = list
    queryForm.total = total
  })
}

const yearsOptions = ref([])
const getEvaluationYear = async () => {
  yearsOptions.value = await fetchListEvaluationYear()
}
getEvaluationYear()

const exportHandle = () => {
  queryFormRef.value.validate(async (v) => {
    if (!v) return false
    const data = formatParams(queryForm)
    fetchExportSelectTrainersDetailPoints({ data })
  })
}

const queryData = () => {
  query(getList)
}

// 需求要求只重置不做查询
const resetData = () => {
  reset()
}
</script>

<style lang="scss" scoped>
  .search-form-card {
    :deep(.el-date-editor .el-input__suffix .el-input__suffix-inner) {
      i {
        transition: unset;
      }
      i.el-icon-circle-close {
        bottom: 0;
        background: unset;
      }
    }
  }
</style>