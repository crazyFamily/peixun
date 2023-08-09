<template>
  <div class="base-container">
    <div class="header-container">
      <span class="title">案例产出</span>
      <SelectSwitch
        :data-info="[
          { label: '月度', value: 'month' },
          { label: '年度', value: 'year' }
        ]"
        v-model="caseCreate"
        @change="handleSwitch"
      ></SelectSwitch>
    </div>
    <div class="content-container chart-wrapper" :style="`height: ${height}px;`" v-loading="getLoadingStatus('LOADING_STATISTIC_CASE_NUM')">
      <Charts
        chart-type="bar"
        :chart-data="statisticCaseInfo"
        template-style="dark"
        :colors="BAR_COLOR_LIST"
        ref="statisticCaseInfoRef"
      ></Charts>
    </div>
  </div>
</template>

<script setup>
import SelectSwitch from '@/components/select/SelectSwitch.vue'
import Charts from '@/components/charts/index.vue'
import { useDataDashboard } from '../hooks/useDataDashboard'
import { fetchStatisticCaseNum } from '@/fetch/dataDashboard'
import { getLoadingStatus } from '@/util/utils'
import { ref, watch } from 'vue'
const statisticCaseInfoRef = ref(null)
const props = defineProps({
  orgs: {
    type: Array
  },
  height: { type: Number }
})
const {BAR_COLOR_LIST, watchOrgsCallback} = useDataDashboard({ dom: statisticCaseInfoRef, props })
const caseCreate = ref('month')
const statisticCaseInfo = ref([])
const baseParams = {
  annualType: caseCreate.value,
  orgId: props.orgs[props.orgs.length-1]
}


// 案例产出
const getStatisticCaseNum = () => {
  fetchStatisticCaseNum({data: baseParams}).then((res) => {
    const caseBaseItem = { id: 'caseNum', name: '上架案例数', type: 'line', dataInfo: [] }
    const perfectCaseBaseItem = { id: 'perfectCaseNum', name: '优秀案例数量	', type: 'line', dataInfo: [] }
    res.forEach((row) => {
      if(caseCreate.value === 'month') {
        caseBaseItem.dataInfo.push({ key: row.month, dataLabel: `${row.month}月`, value: row.caseNum })
        perfectCaseBaseItem.dataInfo.push({ key: row.month, dataLabel: `${row.month}月`, value: row.perfectCaseNum })
      }
      if(caseCreate.value === 'year') {
        caseBaseItem.dataInfo.push({ key: row.year, dataLabel: `${row.year}年`, value: row.caseNum })
        perfectCaseBaseItem.dataInfo.push({ key: row.year, dataLabel: `${row.year}年`, value: row.perfectCaseNum })
      }
    })
    statisticCaseInfo.value = [caseBaseItem, perfectCaseBaseItem]
  })
}
// getStatisticCaseNum()

const handleSwitch = () => {
  baseParams.annualType = caseCreate.value
  baseParams.orgId = props.orgs[props.orgs.length-1]
  getStatisticCaseNum()
}
watchOrgsCallback(handleSwitch)
</script>
<script>
export default {
  name: 'DataDashboardCaseInfo'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';
</style>
