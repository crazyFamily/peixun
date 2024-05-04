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
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划名称">
          <el-input v-model="queryForm.planPackageName" placeholder="请输入计划名称"></el-input>
        </el-form-item>
        <el-form-item label="计划所属单位">
          <gc-institution v-model="queryForm.planBlgDepts"
            :defaultShow="true"
            hasResetBlgStripLine
            @setDataFinish="orgSetDataFinishHandle"
           :fetchParams="{ module: 'planModule' }" ref="institutionRef"> </gc-institution>
          <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10">含下属机构</el-checkbox>
        </el-form-item>
        <el-form-item label="计划项目名称">
          <el-input v-model="queryForm.planName" placeholder="请输入计划项目名称"></el-input>
        </el-form-item>
        <el-form-item label="计划项目分类">
          <ClassTypesCascader v-model="queryForm.classTypeList" type="plan" class="w-300" ref="classTypesCascaderRef" />
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
        v-loading="getLoadingStatus('LOADING_LISTPLAN')"
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
import { onMounted, reactive, ref, nextTick } from 'vue'
import { useReport } from './hooks/useReport'
import { PLAN_TRAINING_OPTIONS } from '@/views/StatementCentre/enum'
import { IF_CONFORMANCE_OPTIONS } from '../enum'
import { blgStripLineOptions, CopyObj, getLoadingStatus, renderName } from '@/util/utils'
import { fetchListPlanDetail, fetchExportListPlanDetail } from '@/fetch/statementCentre'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import ClassTypesCascader from '@/components/ClassTypesCascader.vue'
import store from '@/store'
import { LINE_MAP } from '@/util/constants'
const { mergeReactive } = useBaseDataEvents()

const { typesDatas, getClassTypesDatas, getPlanDict, trainTypes, channelTypes, trainSeries, childSeries, lines } = useReport()

const baseInt = {
  planName: '',
  planPackageName: '',
  planBlgDepts: [],
  searchYear: String(new Date().getFullYear()),
  isGotSubBranch: true,
  planBusiTypeList: [],
  trainSeriesList: [],
  trainChildSeriesList: [],
  classTypeList: [],
  currPage: 1,
  pageSize: 10,
  total: 0
}
const queryForm = reactive(CopyObj(baseInt))
const defaultOrg = reactive({
  line: '',
  orgId: '',
  orgName: ''
})

// 获取类型数据
getClassTypesDatas()

// 表头过滤器
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
getPlanDict().then(() => {
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
    { label: '提交人', prop: 'createdBy', formatter: (row) => renderName(row.createdByName, row.createdBy), width: '150' },
    { label: '提交时间', prop: 'createdDate', width: '100' },
    { label: '计划项目名称', prop: 'annualPlanName', width: '200' },
    {
      label: '计划分类',
      prop: 'planClassTypeName',
      width: 110
    },
    {
      label: '计划项目类型',
      prop: 'planTypeDesc',
      width: 110
    },
    {
      label: '是否消保培训',
      prop: 'ifConformanceDesc',
      width: '120',
      ...tableFilterSetting('ifConformance', IF_CONFORMANCE_OPTIONS, false)
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
    { label: '计划总期数', prop: 'termNum' }
  ]
})

const tableList = ref([])

// 格式化查询入参
const formatParams = (data) => {
  const params = CopyObj(data)
  params.page = params.currPage
  params.isGotSubBranch = params.isGotSubBranch ? 'Y' : 'N'
  params.planBlgStripLine = params.planBlgDepts[0]
  params.planBlgDept = params.planBlgDepts.slice(-1)[0]
  Reflect.deleteProperty(params, 'planBlgDepts')
  return params
}

const getList = async () => {
  const data = formatParams(queryForm)
  const { list, total } = await fetchListPlanDetail({ data })
  tableList.value = list
  queryForm.total = total
}
const query = () => {
  queryForm.currPage = 1
  getList()
}

const institutionRef = ref(null)
const initData = () => {
  const { blgStripLine, deptno } = store.state.userInfo
  queryForm.planBlgStripLine = userInfo.blgStripLine
  queryForm.planBlgDept = res[0].orgList[0].orgId;
  institutionRef.value.setContentValue([LINE_MAP[blgStripLine], store.state.userInfo.deptName])
}
 const fillDefaultDeps = async () => {
  const userInfo = store.getters['getUserInfo']
  console.log(userInfo)
  const params = { module: 'planModule', busiType: userInfo.blgStripLine }
  fetchUserOrgTree(params).then((res) => {
    queryForm.planBlgDepts = [userInfo.blgStripLine, res[0].orgList[0].orgId]
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
  queryForm.planBlgDepts = [defaultOrg.line, defaultOrg.orgId]
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
  // fillDefaultDeps()
  // await getDefaultOrgs()
  // query()
}
const exportHandle = async () => {
  const data = formatParams(queryForm)
  await fetchExportListPlanDetail({ data })
}
</script>
<script>
export default {
  name: 'TrainingPlanReport'
}
</script>
<style lang="scss" scoped></style>