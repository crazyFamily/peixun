<template>
  <div class="report-wrapper">
    <!-- 搜索 card -->
    <el-card class="search-form-card search-card-fixed-center">
      <el-form :model="queryForm" inline>
        <el-form-item label="年度">
          <el-date-picker
            v-model="queryForm.searchYear"
            placeholder="选择日期"
            :clearable="true"
            type="year"
            popper-class="date-picker"
            value-format="yyyy"
            @change="searchYearChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="起始日期">
          <DateRange
            :key="dateRangeKey"
            v-model="queryForm"
            start-key="dateStart"
            end-key="dateEnd"
            :start-options="dateRangeOptions"
            :end-options="dateRangeOptions"
            :dataRangeDisableDate="limitQueryYear"
            width="90px"
          ></DateRange
        ></el-form-item>
        <el-form-item label="计划名称">
          <el-input v-model="queryForm.planPackageName" placeholder="请输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="计划所属单位">
          <gc-institution v-model="queryForm.planBlgDepts"
            :defaultShow="true"
            hasResetBlgStripLine
            @setDataFinish="orgSetDataFinishHandle"
           :fetchParams="{ module: 'planModule' }" ref="institutionRef"></gc-institution>
          <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10">含下属机构</el-checkbox>
        </el-form-item>
        <el-form-item label="计划项目名称">
          <el-input v-model="queryForm.planName" placeholder="请输入计划项目名称"></el-input>
        </el-form-item>

        <el-form-item label="项目分类">
          <ClassTypesCascader v-model="queryForm.classTypeList" ref="classTypesCascaderRef"></ClassTypesCascader>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        v-loading="getLoadingStatus('LOADING_TRAINING_PLANEXECUTE_REPORT')"
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePaginationRef"
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import DateRange from '@/components/dateRange/DateRange'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useReport } from './hooks/useReport'
import { TRAINING_OPTIONS } from '@/views/Establish/enum'
import { TRAIN_SHAPE_OPTIONS, IF_CONFORMANCE_OPTIONS } from '../enum'
import { PLAN_TRAINING_OPTIONS } from '@/views/StatementCentre/enum'
import { busiTypes, LINE_MAP } from '@/util/constants'
import { blgStripLineOptions, CopyObj, getLoadingStatus, renderName, formatDate } from '@/util/utils'
import { fetchListPlanClassDetail, fetchExportListPlanClassDetail } from '@/fetch/statementCentre'
import ClassTypesCascader from '@/components/ClassTypesCascader.vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import store from '@/store'
import { fetchUserOrgTree } from '@/fetch/public'
const { mergeReactive } = useBaseDataEvents()

const { typesDatas, getClassTypesDatas, getPlanDict, trainTypes, channelTypes, trainSeries, childSeries, classTypeOneList, classTypeTwoList } =
  useReport()

const dateRangeOptions = { 'value-format': 'yyyy-MM-dd', type: 'date' }
const baseInt = {
  planName: '',
  planPackageName: '',
  planBlgDepts: [],
  searchYear: String(new Date().getFullYear()),
  isGotSubBranch: true,
  classTypeList: [],
  planBusiTypeList: [],
  planClassTypeList: [],
  classTypeTwoList: [],
  trainSeriesList: [],
  trainChildSeriesList: [],
  dateStart:'',
  dateEnd:'',
  classBusiTypeList: [],
  currPage: 1,
  pageSize: 10,
  total: 0
}
const dateRangeKey = ref('dateRangeKey' + Date.now())
const limitQueryYear = () => {
  const start_date = queryForm.searchYear + '-01-01'
  const end_date = queryForm.searchYear + '-12-31'
  return {
    startPickerOptions: {
      disabledDate: (time) => {
        if (formatDate(end_date) < formatDate(time) || formatDate(time) < formatDate(start_date)) return true
        return false
      }
    },
    endPickerOptions: {
      disabledDate: (time) => {
        if (formatDate(end_date) < formatDate(time) || formatDate(time) < formatDate(start_date)) return true
        return false
      }
    }
  }
}
const searchYearChange = (value) => {
  dateRangeKey.value = 'dateRangeKey' + Date.now()
  queryForm.dateStart = ''
  queryForm.dateEnd = ''
}
const queryForm = reactive(CopyObj(baseInt))

const tableFilterSetting = (key, list, multiple = true) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

const columns = ref([])
// 获取字典数据信息，组装表格头
Promise.all([getPlanDict(), getClassTypesDatas()]).then(() => {
  columns.value = [
    { label: '年度', prop: 'planYear' },
    { label: '计划名称', prop: 'planPackageName', width: '150' },
    {
      label: '计划所属条线',
      prop: 'planBlgStripLineName',
      width: '120',
      ...tableFilterSetting('planBusiTypeList', blgStripLineOptions)
    },
    { label: '计划所属单位', prop: 'planBlgDeptName', width: '150' },
    { label: '计划状态', prop: 'planApplyStatusDesc' },
    { label: '计划项目名称', prop: 'annualPlanName', width: '200' },
    {
      label: '计划分类',
      prop: 'planClassTypeName',
      width: 110,
      ...tableFilterSetting('planClassTypeList', PLAN_TRAINING_OPTIONS)
    },
    {
      label: '计划项目类型',
      prop: 'planTypeDesc',
      width: 110,
      ...tableFilterSetting('classTypeTwoList', trainTypes.value)
    },
    {
      label: '计划是否消保培训',
      prop: 'planIfConformanceDesc',
      width: '120',
      ...tableFilterSetting('planIfConformance', IF_CONFORMANCE_OPTIONS, false)
    },
    {
      label: '培训系列',
      prop: 'trainSeriesDesc',
      width: 90,
      ...tableFilterSetting('trainSeriesList', trainSeries.value)
    },
    {
      label: '子系列',
      prop: 'childSeriesDesc',
      width: 90,
      ...tableFilterSetting('trainChildSeriesList', childSeries.value)
    },
    { label: '计划总期数', prop: 'termNum' },
    { label: '执行项目数', prop: 'doneNum' },
    { label: '项目编号', prop: 'classId' },
    { label: '项目名称', prop: 'className', width: 150 },
    {
      label: '项目所属条线',
      prop: 'classBlgStripLineName',
      width: 110,
      ...tableFilterSetting('classBusiTypeList', blgStripLineOptions)
    },
    { label: '项目所属部门', prop: 'classBlgDeptName', width: '150' },
    {
      label: '项目类型',
      prop: 'classTypeOneDesc',
      width: 110
    },
    {
      label: '项目子类型',
      prop: 'classTypeDesc',
      width: 150
    },
    {
      label: '项目是否消保培训',
      prop: 'classIfConformanceDesc',
      width: '120',
      ...tableFilterSetting('classIfConformance', IF_CONFORMANCE_OPTIONS, false)
    },
    {
      label: '培训形式',
      prop: 'trainingModeDesc',
      width: '100',
      ...tableFilterSetting('trainingModes', TRAIN_SHAPE_OPTIONS)
    },
    { label: '项目状态', prop: 'classApplyStatusDesc' },
    { label: '开始日期', prop: 'dateStart', type: 'setWidth', width: 100 },
    { label: '结束日期', prop: 'dateEnd', type: 'setWidth', width: 100 },
    { label: '立项日期', prop: 'createdDate', type: 'setWidth', width: 100 }
  ]
})

const planTypes = ref([])

const tableList = ref([])

// 格式化查询入参
const formatParams = (data) => {
  const params = CopyObj(data)
  params.page = params.currPage
  params.planBlgStripLine = params.planBlgDepts[0]
  params.planBlgDept = params.planBlgDepts.slice(-1)[0]
  params.isGotSubBranch = params.isGotSubBranch ? 'Y' : 'N'
  Reflect.deleteProperty(params, 'planBlgDepts')
  return params
}

const getList = async () => {
  const data = formatParams(queryForm)
  const { list, total } = await fetchListPlanClassDetail({ data })
  tableList.value = list
  queryForm.total = total
}

const query = () => {
  queryForm.currPage = 1
  getList()
}

const institutionRef = ref(null)
// const initData = () => {
//   const {blgStripLine, deptno} = store.state.userInfo
//   queryForm.planBlgDepts = [blgStripLine, deptno]
//   institutionRef.value.setContentValue([LINE_MAP[blgStripLine], store.state.userInfo.deptName])
// }

const defaultOrg = reactive({
  line: '',
  orgId: '',
  orgName: ''
})
const getDefaultOrgs = async () => {
  if (!defaultOrg.orgId || !defaultOrg.orgName) {
    defaultOrg.line = store.state.userInfo.blgStripLine
    const list = await fetchUserOrgTree({ module: 'planModule', busiType: defaultOrg.line || 'LS' })
    if (!list[0] || !list[0].orgList || !list[0].orgList[0]) return
    // 取列表的第一个作为默认机构
    const selectedItem = list[0].orgList[0]
    defaultOrg.orgId = selectedItem.orgId
    defaultOrg.orgName = selectedItem.orgName
  }
  queryForm.planBlgDepts = [defaultOrg.line, defaultOrg.orgId]
  institutionRef.value.setContentValue([LINE_MAP[defaultOrg.line], defaultOrg.orgName])
}
const orgSetDataFinishHandle = () => {
  query()
}
onMounted(async () => {
  // initData()
  // await getDefaultOrgs()
  // query()
})

const tablePaginationRef = ref(null)
const classTypesCascaderRef = ref(null)
const reset = async () => {
  mergeReactive({ origin: queryForm, target: CopyObj(baseInt) })
  // queryForm.planBlgDepts = [defaultOrg.line, defaultOrg.orgId]
  classTypesCascaderRef.value.reset()
  tablePaginationRef.value.resetFilters()
  institutionRef.value.resetBlgStripLineMaping()
  institutionRef.value.createTreeData()
  // await nextTick()
  // await getDefaultOrgs()
  // query()
}

const exportHandle = async () => {
  const data = formatParams(queryForm)
  await fetchExportListPlanClassDetail({ data })
}
</script>
<script>
export default {
  name: 'TrainingPlanExecuteReport'
}
</script>
<style lang="scss" scoped>
.search-form-card {
  :deep(.el-form .el-form-item) {
    margin-right: 20px;
  }

  :deep(.el-cascader .el-input) {
    width: 350px !important;
  }
}
</style>