<template>
  <div>
    <div class="menu-right" v-if="!readly">
      <div>
        <span class="instructor-icons__add" @click="addReservedCost">
          <i class="instructor-icons__add__icon"></i>
          新增</span
        >
      </div>
      <div>
        <span class="instructor-icons__del" @click="handleDel('reservedCostTableRef', 'getReservedCostList')">
          <i class="instructor-icons__del__icon"></i>
          删除</span
        >
      </div>
      <div>
        <span class="instructor-icons__download" @click="handleExport('/fn/plan/annual/reportReverseFeePage', $parent.handleQueryForm())">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
    </div>
    <table-pagination
      :list="reservedCostList"
      :tableList="reservedCostTableList"
      :queryForm="reservedCostForm"
      :getList="getReservedCostList"
      :pageSizes="[5, 10]"
      @selection-change="handleSelection"
      :showSummary="true"
      :summaryMethod="summaryTrainingCoursePlan"
      auto-height
      ref="reservedCostTableRef"
    >
      <el-table-column label="预留费用（元）" min-width="292" prop="unitExpense">
        <template slot-scope="scope">
          <span v-show="!scope.row.edit">{{ scope.row.unitTotalFee }}</span>
          <el-input v-show="scope.row.edit" class="w120" v-model="scope.row.unitTotalFee"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="预留费用余额（元）" min-width="304" prop="unitTotalFee"></el-table-column>
      <el-table-column label="备注" min-width="356">
        <template slot-scope="scope">
          <span v-show="!scope.row.edit">{{ scope.row.otherExpenseDescribe }}</span>
          <el-input v-show="scope.row.edit" v-model="scope.row.otherExpenseDescribe"></el-input>
        </template>
     </el-table-column>
      <el-table-column label="操作" min-width="124" fixed="right">
        <div slot-scope="scope" v-if="!readly">
          <span class="" v-show="!scope.row.edit" @click="reservedCostEdit(scope.row)">
            <el-tooltip content="修改" popper-class="icon-popper">
              <i class="operation__edit"></i>
            </el-tooltip>
          </span>
          <span class="" v-show="scope.row.edit" @click="reservedCostEdit(scope.row)">
            <el-tooltip content="完成" popper-class="icon-popper">
              <i class="operation__curriculumStorageAccomplish"></i>
            </el-tooltip>
          </span>
        </div>
      </el-table-column>
    </table-pagination>
  </div>
</template>

<script setup>
import { fetchListReverseFee, fetchReportReverseFeePage } from '@/fetch/planManagement'
import { reactive, ref, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
import store from '@/store'
import { useAnnual } from '../hooks/useAnnual'
import { CLASS_TYPES_MAP, RESERVED } from '../enum'
const { getAnnualInfo, getAnnualPackageInfo, summaryMethod } = useAnnual()
const readly = false
const addReservedCost = () => {}
const handleDel = () => {}
const handleExport = () => {
  const data = {}
  fetchReportReverseFeePage(data)
}

const baseParams = {
  packageId: '',
  total: 0,
  currPage: 1,
  pageSize: 5,
}
const reservedCostForm = reactive(CopyObj(baseParams))

const reservedCostList = [
  {
    type: 'selection',
    width: '54'
  },
]
const reservedCostTableList = ref([])
watch(
  () => store.getters['planManagement/getAnnualReverseFee'],
  (n) => {
    reservedCostTableList.value = (n || []).map(row => ({...row, edit: false}))
    reservedCostForm.packageId = getAnnualPackageInfo()?.planPackageId
    reservedCostForm.total = getAnnualInfo()?.reverseFeeTotal
    reservedCostForm.currPage = 1
  }
)

const reservedCostEdit = () => {}

const formatParams = (params) => {
  const data = CopyObj(params)
  data.page = params.currPage
  data.size = params.pageSize
  return data
}

const getReservedCostList = async () => {
  const data = formatParams(reservedCostForm)
  console.log(data, '--- << formdata');
  const { total, list } = await fetchListReverseFee(data)
  reservedCostTableList.value = list
  reservedCostForm.total = total
}

const handleSelection = () => {}

const summaryTrainingCoursePlan = (param) => {
  console.log(summaryMethod(param, 'reservedCost', CLASS_TYPES_MAP[RESERVED]), '===>> sss');
  return summaryMethod(param, 'reservedCost', CLASS_TYPES_MAP[RESERVED])
}
</script>
<script>
export default {
  name: 'ReservedCost'
}
</script>

<style lang='scss' scoped>
</style>
