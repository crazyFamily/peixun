<template>
  <div class="dispense-wrapper">
    <div class="menu-right">
      <span class="instructor-icons__download" @click="handleExport">
        <i class="instructor-icons__download__icon"></i>
        导出</span
      >
    </div>
    <table-pagination
      :list="columns"
      :tableList="tableList"
      :page-sizes="[5, 10]"
      :queryForm="queryForm"
      :getList="getList"
      auto-height
      ref="tablePaginationRef"
      class="dispense-table"
    >
    </table-pagination>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
import { useTable } from '@/hooks/useTable'
import { useAnnual } from '../hooks/useAnnual'
import store from '@/store'
import EditDispensePLan from './EditDispensePLan.vue'
import { fetchExportDispensePageByDept, fetchQueryDispensePageByDept } from '@/fetch/planManagement'
import { LADDER_TRAIN_TYPE } from '../enum'
const { getAnnualInfo, getAnnualPackageInfo } = useAnnual()
const readly = false
const baseParams = {
  total: 0,
  currPage: 1,
  pageSize: 5
}
const { queryForm, query, tableList } = useTable(baseParams)
watch(
  () => store.getters['planManagement/getAnnualDispenseList'],
  (n) => {
    tableList.value = n
    queryForm.total = getAnnualInfo()?.dispenseTotal
    queryForm.currPage = 1
    console.log(queryForm, '===>>> queryForm');
  }
)
const columns = [
  { label: '序号', type: 'index' },
  { label: '项目名称', prop: 'className' },
  { label: '培训类型', prop: 'trainTypeDesc' },
  { label: '业务模块', prop: 'channelTypeDesc' },
  { label: '关键岗位', prop: 'keyJobsDesc' },
  { label: '培训系列', prop: 'trainSeriesDesc' },
  { label: '培训子系列', prop: 'childSeriesDesc' },
  { label: '分配期数', prop: 'dispenseNum' },
  { label: '已举办期数', prop: 'holdNum' },
  { label: '分配人', prop: 'updatedByName' },
  { label: '分配部门', prop: 'blgDeptName' },
]

const formatParams = (params) => {
  const data = CopyObj(params)
  const searchParams = store.getters['planManagement/getCurrentTopSearchParams']
  data.blgDept = searchParams.busiType[1]
  data.blgStripLine = searchParams.busiType[0]
  data.year = searchParams.year
  return data
}
const getList = async () => {
  const data = formatParams(queryForm)
  const {total ,list} = await fetchQueryDispensePageByDept({ data })
  tableList.value = list
  queryForm.total = total
}
const handleExport = () => {
  const data = formatParams(queryForm)
  fetchExportDispensePageByDept({ data })
}

</script>
<script>
export default {
  name: "AnnualDispense"
}
</script>

<style lang='scss' scoped>
.dispense-table {
  :deep(.el-table td:first-of-type .cell) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
  }
}
</style>