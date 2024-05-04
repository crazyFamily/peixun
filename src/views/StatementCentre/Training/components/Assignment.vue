<template>
  <div class="dept-dispense-wrapper">
    <!-- 搜索 card -->
    <el-card class="search-form-card search-card-fixed-center">
      <el-form :model="queryForm" inline>
        <el-form-item label="年份">
          <el-date-picker v-model="queryForm.year" placeholder="选择日期" :clearable="true" type="year" popper-class="date-picker" value-format="yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分配机构">
          <gc-institution v-model="queryForm.blgDepts" :otherParams="otherParams" busiType="LS" @setDataFinish="orgIdsFinish"  :left-show="false" :defaultShow="true" orgUrl="/fn/user/selectFixedTree" ref="institutionRef" />
        </el-form-item>
        <div class="buttons">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetData" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="handleExport">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
        <span class="instructor-icons__download" @click="handleExportDetail">
          <i class="instructor-icons__download__icon"></i>
          导出明细
        </span>
      </div>
      <table-pagination v-loading="loadingStatus" :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tableRef">
        <el-table-column slot="holdRate" label="执行进度" width="200">
          <template slot-scope="scope">
            <el-progress class="progress-style" :percentage="Number(scope.row.holdRate)"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <span class="active" @click="handleDetail(scope.row)">明细</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 明细弹窗 -->
    <gc-model title="查看详情" width="1200px" :visible.sync="isDetailShow">
      <p style="margin-bottom: 10px;">被分配机构: <span class="active">{{currentRow.blgDeptName}}</span></p>
      <table-pagination :list="detailColumns" :tableList="detailTableList" :queryForm="detailQueryForm" :getList="detailGetList" ref="detailTableRef"></table-pagination>
    </gc-model>
  </div>
</template>

<script setup>
import { useTable } from '@/hooks/useTable'
import { computed, ref } from 'vue'
import { CopyObj, getLoadingStatus, resetObj } from '@/util/utils'
import { API_SELECT_FIXED_TREE } from '@/fetch/public'
const baseOtherParams = {
  authority: 'planModule',
  orgId: 'SD00000001'
}
const otherParams = ref({ ...baseOtherParams})
import {
  fetchDeptDispensePlanDetail,
  fetchExportDeptDispensePlan,
  fetchExportDispensePlanDetail,
  fetchListDeptDispensePlan
} from '@/fetch/statementCentre'
const baseParams = {
  year: String(new Date().getFullYear()),
  blgDepts: [],
  total: 0,
  currPage: 1,
  view: 1
}
const tableRef = ref(null)

const columns = [
  {
    type: 'index',
    label: '序号'
  },
  {
    label: '被分配机构',
    prop: 'blgDeptName'
  },
  {
    label: '分配项目数',
    prop: 'dispensePlanNum'
  },
  {
    label: '分配项目总期数',
    prop: 'dispenseNum'
  },
  {
    label: '已举办期数',
    prop: 'holdNum'
  },
  { slot: 'holdRate' }
]

const { queryForm, query, reset, tableList } = useTable(baseParams, tableRef)

const formatParams = (params) => {
  const res = CopyObj(params)
  res.blgDept = res.blgDepts?.slice(-1)[0]
  Reflect.deleteProperty(res, 'blgDepts')
  return res
}
const getList = async () => {
  const data = formatParams(queryForm)
  const { total, list } = await fetchListDeptDispensePlan({ data })
  tableList.value = list
  queryForm.total = total
}

const queryData = () => {
  query(getList)
}

const orgIdsFinish = () => {
  otherParams.value = {  authority: 'planModule' }
  queryData()
}
const institutionRef = ref(null)
const resetData = async () => {
  otherParams.value = { ...baseOtherParams }
  await reset()
  institutionRef.value.createTreeData()
}

const handleExport = () => {
  const data = formatParams(queryForm)
  fetchExportDeptDispensePlan({ data })
}

const loadingStatus = computed(() => {
  return (
    getLoadingStatus('LOADING_DEPT_DISPENSE_PLAN') ||
    getLoadingStatus('LOADING_EXPORT_DEPT_DISPENSE_PLAN') ||
    getLoadingStatus('LOADING_DEPT_DISPENSE_PLAN_DETAIL') ||
    getLoadingStatus('LOADING_EXPORT_DEPT_DISPENSE_PLAN_DETAIL')
  )
})

// ----- 明细的弹窗 ----
const isDetailShow = ref(false)
const baseDetailParams = {
  year: '',
  blgDept: '',
  view: 1
}
const detailColumns = [
  { type: 'index', label: '序号' },
  { prop: 'className', label: '分配项目名称' },
  { prop: 'channelTypeDesc', label: '业务模块' },
  { prop: 'keyJobsDesc', label: '关键岗位' },
  { prop: 'trainSeriesDesc', label: '培训系列' },
  { prop: 'childSeriesDesc', label: '子系列' },
  { prop: 'dispenseNum', label: '分配期数' },
  { prop: 'holdNum', label: '已举办期数' },
  { prop: 'updatedByName', label: '分配人' },
  { prop: 'updatedByDept', label: '分配人所属机构' }
]
const { queryForm: detailQueryForm, query: detailQuery, tableList: detailTableList } = useTable(baseDetailParams)

const detailGetList = async () => {
  const { total, list } = await fetchDeptDispensePlanDetail({ data: detailQueryForm })
  detailTableList.value = list
  detailQueryForm.total = total
}

const currentRow = ref({})
const handleDetail = async (row) => {
  currentRow.value = row
  detailQueryForm.year = row.year
  detailQueryForm.blgDept = row.blgDept
  detailQueryForm.dispenseDept = queryForm.blgDepts?.slice(-1)[0]
  detailQueryForm.view = 1
  detailQueryForm.pageSize = 10
  await detailGetList()
  isDetailShow.value = true
}

const handleExportDetail = () => {
  const data = formatParams(queryForm)
  fetchExportDispensePlanDetail({ data })
}
</script>
<script>
export default {
  name: 'Assignment'
}
</script>

<style lang='scss' scoped>
.search-form-card.search-card-fixed-center {
  border-top: 0 none;
}
.progress-style {
  :deep(.el-progress__text) {
    font-size: 12px !important;
  }
}
</style>