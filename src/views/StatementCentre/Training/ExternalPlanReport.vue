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
        <el-form-item label="项目信息">
          <el-input v-model="queryForm.classIdOrName" placeholder="请输入项目名称或者编号"></el-input>
        </el-form-item>
        <el-form-item label="项目所属部门">
          <gc-institution v-model="queryForm.classBlgDepts"
           :fetchParams="{ module: 'planModule' }"
           :defaultShow="true"
           hasResetBlgStripLine
            @setDataFinish="orgSetDataFinishHandle"
           ref="institutionRef"> </gc-institution>
          <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10">含下属机构</el-checkbox>
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
        v-loading="getLoadingStatus('LOADING_EXTERNAL_PLAN')"
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
import { fetchUserOrgTree } from '@/fetch/public'
import DateRange from '@/components/dateRange/DateRange'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useReport } from './hooks/useReport'
import { TRAINING_OPTIONS } from '@/views/Establish/enum'
import { TRAIN_SHAPE_OPTIONS, IF_CONFORMANCE_OPTIONS } from '../enum'
import { busiTypes, LINE_MAP } from '@/util/constants'
import { blgStripLineOptions, CopyObj, getLoadingStatus, formatDate } from '@/util/utils'
import { fetchListExternalPlanDetail, fetchExportListExternalPlanDetail } from '@/fetch/statementCentre'
import ClassTypesCascader from '@/components/ClassTypesCascader.vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import store from '@/store'

const { mergeReactive } = useBaseDataEvents()
const { typesDatas, getClassTypesDatas, getPlanDict, trainTypes, channelTypes, trainSeries, childSeries, classTypeOneList, classTypeTwoList } =
  useReport()

const dateRangeOptions = { 'value-format': 'yyyy-MM-dd', type: 'date' }
const baseInt = {
  classIdOrName: '',
  searchYear: String(new Date().getFullYear()),
  classBlgDepts: [],
  isGotSubBranch: true,
  classTypeList: [],
  classBusiTypeList: [],
  dateStart:'',
  dateEnd:'',
  currPage: 1,
  pageSize: 10,
  total: 0
}
const defaultOrg = reactive({
  line: '',
  orgId: '',
  orgName: ''
})
const queryForm = reactive(CopyObj(baseInt))
const columns = ref([])
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
// 表头过滤器
const tableFilterSetting = (key, list, multiple = true) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

// 获取字典数据信息，组装表格头
getClassTypesDatas().then(() => {
  columns.value = [
    { label: '年度', prop: 'startYear' },
    { label: '项目编号', prop: 'classId' },
    { label: '项目名称', prop: 'className', width: 150 },
    {
      label: '项目所属条线',
      prop: 'classBlgStripLineName',
      width: 110,
      ...tableFilterSetting('classBusiTypeList', blgStripLineOptions)
    },
    { label: '项目所属部门', prop: 'classBlgDeptName', width: '150' },
    { label: '项目类型', prop: 'classTypeOneDesc', width: 110 },
    { label: '项目子类型', prop: 'classTypeDesc', width: 150 },
    {
      label: '是否消保培训',
      prop: 'ifConformanceDesc',
      width: '120',
      ...tableFilterSetting('ifConformance', IF_CONFORMANCE_OPTIONS, false)
    },
    {
      label: '培训形式',
      prop: 'trainingModeDesc',
      width: '100',
      ...tableFilterSetting('trainingModes', TRAIN_SHAPE_OPTIONS)
    },
    { label: '立项人', prop: 'createdByStr', width: '200' },
    // { label: '立项人', prop: 'createdByName', width: '200' },
    // { label: '立项人UM号', prop: 'createdBy', width: '140' },
    { label: '项目状态', prop: 'classApplyStatusDesc', type: 'setWidth', width: 80 },
    { label: '开始日期', prop: 'dateStart', type: 'setWidth', width: 110 },
    { label: '结束日期', prop: 'dateEnd', type: 'setWidth', width: 110 },
    { label: '立项日期', prop: 'createdDate', type: 'setWidth', width: 110 }
  ]
})
const planTypes = ref([])

const tableList = ref([])
// 格式化查询入参
const formatParams = (data) => {
  const params = CopyObj(data)
  params.page = params.currPage
  params.planBlgStripLine = params.classBlgDepts[0]
  params.planBlgDept = params.classBlgDepts.slice(-1)[0]
  // params.classBlgDept = params.classBlgDepts[1]
  params.isGotSubBranch = params.isGotSubBranch ? 'Y' : 'N'
  Reflect.deleteProperty(params, 'classBlgDepts')
  return params
}
const getList = async () => {
  const data = formatParams(queryForm)
  const { list, total } = await fetchListExternalPlanDetail({ data })
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
//   queryForm.classBlgDepts = [blgStripLine, deptno]
//   institutionRef.value.setContentValue([LINE_MAP[blgStripLine], store.state.userInfo.deptName])
// }
const fillDefaultDeps = () => {
  const userInfo = store.getters['getUserInfo']
  console.log(userInfo)
  const params = { module: 'planModule', busiType: userInfo.blgStripLine }
  fetchUserOrgTree(params).then((res) => {
    queryForm.classBlgDepts = [userInfo.blgStripLine, res[0].orgList[0].orgId]
    institutionRef.value.setContentValue([res[0].orgList[0].orgName])
    query()
  })
}
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
  queryForm.classBlgDepts = [defaultOrg.line, defaultOrg.orgId]
  institutionRef.value.setContentValue([LINE_MAP[defaultOrg.line], defaultOrg.orgName])
}
const orgSetDataFinishHandle = () => {
  query()
}
onMounted(async () => {
  // await getDefaultOrgs()
  // query()
})

const tablePaginationRef = ref(null)
const classTypesCascaderRef = ref(null)
const reset = async () => {
  mergeReactive({ origin: queryForm, target: CopyObj(baseInt) })
  classTypesCascaderRef.value.reset()
  tablePaginationRef.value.resetFilters()
  institutionRef.value.resetBlgStripLineMaping()
  institutionRef.value.createTreeData()
  // await nextTick()
  // getDefaultOrgs()
  // query()
}
const exportHandle = async () => {
  const data = formatParams(queryForm)
  await fetchExportListExternalPlanDetail({ data })
}
</script>
<script>
export default {
  name: 'ExternalPlanReport'
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