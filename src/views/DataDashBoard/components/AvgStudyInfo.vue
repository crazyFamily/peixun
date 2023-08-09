<template>
  <div class="base-container">
    <div class="header-container">
      <span class="title">人均学时</span>
      <SelectSwitch
        :data-info="[
          { label: '月度', value: 'month' },
          { label: '年度', value: 'year' }
        ]"
        v-model="learnHours"
        @change="handleSwtich"
      ></SelectSwitch>
    </div>
    <div class="content-container chart-wrapper" :style="`height: ${height}px;`" v-loading="getLoadingStatus('LOADING_STATISTIC_AVG_STUDY')">
      <Charts
        chart-type="line"
        :chart-data="avgStudyInfo"
        template-style="dark"
        :colors="LINE_COLOR_LIST"
        :chart-options="chartOptions"
        ref="avgStudyInfoRef"
      ></Charts>
    </div>
  </div>
</template>

<script setup>
import { fetchStatisticAvgStudy } from '@/fetch/dataDashboard'
import { useDataDashboard } from '../hooks/useDataDashboard'
import { ref, watch } from 'vue'
import { getLoadingStatus } from '@/util/utils'
import SelectSwitch from '@/components/select/SelectSwitch.vue'
import Charts from '@/components/charts/index.vue'

const chartOptions = {
  valueFormatter: function(value) {
    return value + '小时'
  }
}

const props = defineProps({
  orgs: {
    type: Array
  },
  height: { type: Number }
})
const avgStudyInfoRef = ref(null)
const { LINE_COLOR_LIST, watchOrgsCallback } = useDataDashboard({dom: avgStudyInfoRef, props})
// 人均学时
const avgStudyInfo = ref([])
const learnHours = ref('month')

const baseParams = {
  annualType: learnHours.value,
  orgId: props.orgs[props.orgs.length-1]
}
// 人均学时
const getStatisticAvgStudy = () => {
  fetchStatisticAvgStudy({data: baseParams}).then((res) => {
    let dataInfo
    if(learnHours.value === 'month') {
      dataInfo = res.map((row) => ({ key: row.month, dataLabel: `${row.month}月`, value: row.studyHour }))
    }
    if(learnHours.value === 'year') {
      dataInfo = res.map((row) => ({ key: row.year, dataLabel: `${row.year}年`, value: row.studyHour }))
    }
    const baseItem = { id: 'avgStudy', name: '人均学时', type: 'line', dataInfo }
    avgStudyInfo.value = [baseItem]
  })
}
// getStatisticAvgStudy()

const handleSwtich = () => {
  baseParams.annualType = learnHours.value
  baseParams.orgId = props.orgs[props.orgs.length-1]
  getStatisticAvgStudy()
}

watchOrgsCallback(handleSwtich)

</script>
<script>
export default {
  name: 'DataDashboardAvgStudyInfo'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';
</style>
