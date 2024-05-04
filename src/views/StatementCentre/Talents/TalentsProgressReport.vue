<template>
  <div class="talents-report-wrapper">
    <SearchParams immediate default-max-annual :params="defaultSearchParams" @search="queryData" @reset="resetData" ref="searchParamsRef"></SearchParams>
    <!-- <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="年度">

        </el-form-item>
        <el-form-item label="单位类型">

        </el-form-item>
        <el-form-item label="项目所属单位">

        </el-form-item>

        <div class="buttons">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetData" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card> -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <table-pagination v-loading="getLoadingStatus('LOADING_TRAINING_PROCESS_REPORT')" :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePaginationRef"> </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { useTable } from '@/hooks/useTable'
import { CopyObj } from '@/plugins/until'
import { nextTick, onMounted, ref } from 'vue'
import SearchParams from '@/views/TalentsCultivation/components/SearchParams.vue'
import { PROJECT_TYPE_OPTIONS, PROJECT_STATUS_OPTIONS, PROJECT_STATUS_WAITING } from '@/views/TalentsCultivation/enum'
import { fetchListQcTrainingProcessReport, fetchExportListQcTrainingProcessReport } from '@/fetch/statementCentre'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { formatParamsByProjectType } from '@/views/TalentsCultivation/utils'
import { getLoadingStatus } from '@/util/utils'
const { mergeReactive } = useBaseDataEvents()

const defaultSearchParams = ['annual', 'projectType', 'treeData']
const baseParams = {
  annual: '',
  projectType: '',
  projectBlgType: '',
  projectInfo: '',
  studentInfo: '',
  subjectInfo: '',
  evaluateStatus: [],
  status: [],
  projectTypeList:[]
}
const { queryForm, tableList, query, reset, tableFilterSetting } = useTable(baseParams)

const searchParamsRef = ref(null)
const columns = [
  { label: '年度', prop: 'annual' },
  { label: '单位类型', prop: 'projectBlgType' },
  { label: '项目所属单位', prop: 'projectBlg', width: '100px' },
  { label: '项目ID', prop: 'projectId' },
  { label: '项目名称', prop: 'projectName', width: '200px' },
  { label: '项目类型', prop: 'projectTypeDesc', width: '130px'},
  { label: '方案ID', prop: 'customizePlanId', width: '100px'},
  { label: '主办单位', prop: 'orgName', width: '150px' },
  { label: '项目周期', prop: 'projectCyle', width: '180px' },
  {
    label: '方案提交状态',
    prop: 'statusStr',
    width: '110px',
    ...tableFilterSetting(
      'status',
      PROJECT_STATUS_OPTIONS.filter((row) => row.value !== PROJECT_STATUS_WAITING)
    )
  },
  { label: '项目状态', prop: 'projectStatus', type: 'setWidth', width: 80 },
  { label: '议题创建数量', prop: 'subjectCreatedNum', width: '100px' },
  { label: '议题终审数量', prop: 'subjectFinalNum', width: '100px' },
  { label: '议题待终审数量', prop: 'subjectReadyNum', width: '110px' },
  { label: '应评价学员数量', prop: 'evaAllNum', width: '110px' },
  { label: '已评价学员数量', prop: 'evatedNum', width: '110px' },
  { label: '未评价学员数量', prop: 'noEvaNum', width: '110px' }
]


// const formatParams = (params) => {
//   const data = formatParamsByProjectType(queryForm, orgData.value)
//   const resultParams = CopyObj(params)
//   return resultParams
// }

const orgData = ref([])
const getList = async () => {
  queryForm.status = queryForm.status || []
  const data = formatParamsByProjectType(queryForm, orgData.value)
  const {list, total} = await fetchListQcTrainingProcessReport( { data: {...data, projectBlgType: data.projectType} } )
  tableList.value = list
  queryForm.total = total
}

const queryData = (data, treeData) => {
  mergeReactive({origin: queryForm, target: data})
  treeData && (orgData.value = treeData)
  if(!treeData) orgData.value = []
  query(getList)
}
// queryData()

onMounted(() => {
  // searchParamsRef.value.queryDatas()
})

const tablePaginationRef = ref(null)
const resetData = async () => {
  tablePaginationRef.value.resetFilters()
  await nextTick()
  reset(getList)
}

const exportHandle = async () => {
  const data = formatParamsByProjectType(queryForm, orgData.value)
  await fetchExportListQcTrainingProcessReport({ data: {...data, projectBlgType: data.projectType} })
}
</script>
<script>
export default {
  name: 'TalentsProgressReport'
}
</script>
<style lang='scss' scoped>
</style>