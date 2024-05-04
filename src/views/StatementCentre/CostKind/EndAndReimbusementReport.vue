<template>
  <div class="ear-wrapper">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="项目所属部门">
          <div class="df">
            <gc-institution v-model="queryForm.orgIds" :fetchParams="{ module: 'classModule' }"> </gc-institution>
            <!-- <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10">含下属机构</el-checkbox> -->
          </div>
        </el-form-item>
        <el-form-item label="结束日期" label-width="60px">
          <!-- <el-date-picker v-model="queryForm.dateEnd" placeholder="选择日期" value-format="yyyy-MM-dd" popper-class="date-picker"> </el-date-picker> -->
          <!-- <el-date-picker
            class="rms-daterange-picker input-width"
            v-model="queryForm.dateEndRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker> -->
          <el-date-picker
            class="w-120"
            v-model="queryForm.dateStart"
            type="date"
            placeholder="开始日期"
            :clearable="false"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <span style="padding: 0 10px;">至</span>
          <el-date-picker
            class="w-120"
            v-model="queryForm.dateEnd"
            type="date"
            placeholder="结束日期"
            :clearable="false"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目信息">
          <el-input v-model="queryForm.classInfo" placeholder="请输入项目ID或者项目名称"></el-input>
        </el-form-item>
        <el-form-item label="立项人" style="margin-right: 20px !important;">
          <el-input v-model="queryForm.applyInfo" placeholder="请输入立项人名称或者UM"></el-input>
        </el-form-item>
        <el-form-item label="项目分类">
          <ClassTypesCascader v-model="queryForm.classTypeList" ref="classTypesCascaderRef"></ClassTypesCascader>
        </el-form-item>

        <div class="buttons">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetData" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right" style="justify-content: space-between;">
        <p class="tips" style="color: #fd6720;">
          *逾期天数说明：正数表示已逾期，其数值为逾期天数；负数表示暂未逾期，其数值为距离逾期的天数。
        </p>
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <table-pagination v-loading="getLoadingStatus('LOADING_CLASS_REIMSITUATION')" :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePaginationRef"> </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { useTable } from '@/hooks/useTable'
import { blgStripLineOptions, CopyObj, getCurrentTime, getLoadingStatus } from '@/util/utils'
import { YES_STATUS, NO_STATUS } from '@/util/constants'
import { TRAIN_SHAPE_OPTIONS, IF_CONFORMANCE_OPTIONS } from '../enum'
import { fetchListClassAndReimSituation, fetchExportListClassAndReimSituation } from '@/fetch/statementCentre'
import ClassTypesCascader from '@/components/ClassTypesCascader.vue'
import { TRAINING_STATUS_OPTIONS } from '@/views/Establish/enum'
import { nextTick, onMounted, ref } from 'vue'

const REIMBURSED_STATUS_OPTIONS = [
  {
    label: '未发起',
    value: '01'
  },
  {
    label: '已发起',
    value: '02'
  },
]

const baseParams = {
  orgIds: [],
  isGotSubBranch: true,
  classInfo: '',
  applyInfo: '',
  dateEndRange: [],
  dateStart: '',
  dateEnd: '',
  classTypeList: [],
  classStatusList: [],
  reimStatusList: [],
  classBusiTypeList: []
}

const { queryForm, tableList, query, reset, tableFilterSetting, dataRangeRules } = useTable(baseParams)
const { startPickerOptions, endPickerOptions } = dataRangeRules('dateStart', 'dateEnd')

const columns = [
  { label: '项目编号', prop: 'classId' },
  { label: '项目名称', prop: 'className', width: '150px' },
  { 
    label: '项目所属条线', 
    prop: 'busiTypeDesc', 
    width: '110px',
    ...tableFilterSetting('classBusiTypeList', blgStripLineOptions)
  },
  { label: '项目所属部门', prop: 'orgName', width: '200px' },
  { label: '项目分类', prop: 'classTypeDesc', width: '150px' },
  {
    label: '是否消保培训',
    prop: 'ifConformanceDesc',
    width: '100',
    ...tableFilterSetting('ifConformance', IF_CONFORMANCE_OPTIONS, false)
  },
  {
    label: '培训形式',
    prop: 'trainingModeDesc',
    width: '100',
    ...tableFilterSetting('trainingModes', TRAIN_SHAPE_OPTIONS)
  },
  { label: '立项金额', prop: 'totalFee', width: '100px' },
  { label: '立项人', prop: 'createdByName', width: '150px' },
  { label: '立项日期', prop: 'createdDate', width: '100px' },
  { label: '开始日期', prop: 'dateStart', width: '100px' },
  { label: '结束日期', prop: 'dateEnd', width: '100px' },
  {
    label: '结训状态',
    prop: 'classStatus',
    width: '100px',
    ...tableFilterSetting('classStatusList', TRAINING_STATUS_OPTIONS),
    formatter: row => {
      if(TRAINING_STATUS_OPTIONS.find(item => item.value === row.classStatus)) {
        return TRAINING_STATUS_OPTIONS.find(item => item.value === row.classStatus)?.label
      }
      return row.classStatusDesc
    }
  },
  { label: '结训日期', prop: 'dateFinish', width: '100px' },
  { 
    label: '报销状态', 
    prop: 'reimStatusDesc',
    width: '100px',
    ...tableFilterSetting('reimStatusList', REIMBURSED_STATUS_OPTIONS)
  },
  { label: '报销日期', prop: 'reimSubmitDate', width: '100px' },
  { label: '最晚处理日期', prop: 'latestProcessDate', width: '100px' },
  { label: '结训逾期天数', prop: 'classOverdueDay', width: '100px' },
  { label: '报销逾期天数', prop: 'reimOverdueDay', width: '100px' }
]

const formatParams = (params) => {
  const resultParams = CopyObj(params)
  // 处理element时间框组件清除动作返回的为nul的现象
  resultParams.dateEndRange = resultParams.dateEndRange || []
  resultParams.classBlgStripLine = resultParams.orgIds[0]
  resultParams.orgId = resultParams.orgIds?.slice(-1)[0]
  // resultParams.dateStart = resultParams.dateEndRange[0]
  // resultParams.dateEnd = resultParams.dateEndRange[1]
  resultParams.isGotSubBranch = resultParams.isGotSubBranch ? YES_STATUS : NO_STATUS
  if(!resultParams.dateStart) Reflect.deleteProperty(resultParams, 'dateStart')
  if(!resultParams.dateEnd) Reflect.deleteProperty(resultParams, 'dateEnd')
  Reflect.deleteProperty(resultParams, 'dateEndRange')
  Reflect.deleteProperty(resultParams, 'orgIds')
  return resultParams
}

const getList = async () => {
  const data = formatParams(queryForm)
  const {list, total} = await fetchListClassAndReimSituation({ data })
  tableList.value = list
  queryForm.total = total
}

const queryData = () => {
  query(getList)
}
onMounted(() => {
  // 设置默认值
  // queryForm.dateEndRange = [getCurrentTime(), getCurrentTime()]
  const currentYear = new Date().getFullYear()
  queryForm.dateStart = `${currentYear}-01-01`
  queryForm.dateEnd = `${currentYear}-12-31`
  queryData()
})

const classTypesCascaderRef = ref(null)
const tablePaginationRef = ref(null)
const resetData = async () => {
  classTypesCascaderRef.value.reset()
  tablePaginationRef.value.resetFilters()
  await nextTick()
  reset()
}

const exportHandle = async () => {
  const data = formatParams(queryForm)
  await fetchExportListClassAndReimSituation({ data })
}
</script>
<script>
export default {
  name: 'EndAndReimbusementReport'
}
</script>
<style lang='scss' scoped>
.search-form-card {
  :deep(.el-form .el-form-item) {
    margin-right: 20px;
  }

  :deep(.el-cascader .el-input) {
    width: 350px !important;
  }
}
</style>