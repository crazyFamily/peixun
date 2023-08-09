<template>
  <!-- 培训项目数量 -->
  <div class="base-container">
    <div class="header-container">
      <span class="title">培训项目数量</span>
      <SelectSwitch
        :data-info="[
          { label: '月度', value: 'month' },
          { label: '年度', value: 'year' }
        ]"
        v-model="trainingNumberTimeType"
        @change="handleSwtich"
      ></SelectSwitch>
    </div>
    <div class="content-container chart-wrapper" :style="`height: ${height}px;`" v-loading="getLoadingStatus('LOADING_STATISTIC_CLASS_NUM')">
      <Charts
        chart-type="bar"
        :chart-data="statisticClassInfo"
        :stack-info="statisticClassStack"
        template-style="dark"
        :colors="BAR_COLOR_LIST"
        ref="statisticClassInfoRef"
      ></Charts>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDataDashboard } from '../hooks/useDataDashboard'
import { fetchStatisticClassNum } from '@/fetch/dataDashboard'
import { getLoadingStatus } from '@/util/utils'
import Charts from '@/components/charts/index.vue'
import SelectSwitch from '@/components/select/SelectSwitch.vue'
const trainingNumberTimeType = ref('month')
const statisticClassInfo = ref([])
const statisticClassStack = ref({})

const props = defineProps({
  orgs: {
    type: Array
  },
  height: { type: Number }
})
const statisticClassInfoRef = ref(null)
const { BAR_COLOR_LIST, watchOrgsCallback } = useDataDashboard({dom: statisticClassInfoRef, props})

// 培训项目数量
const baseParams = {
  annualType: trainingNumberTimeType.value,
  orgId: props.orgs[props.orgs.length-1]
}

// 培训项目数量
const getStatisticClassNum = () => {
  fetchStatisticClassNum({data: baseParams}).then((res) => {
    const classNumberInfo = { id: 'classNumber', name: '培训班', type: 'bar', dataInfo: [] }
    const nonClassNumberInfo = { id: 'nonClassNumber', name: '非培训班', type: 'bar', dataInfo: [] }
    res.forEach((row) => {
      if(trainingNumberTimeType.value === 'month') {
        classNumberInfo.dataInfo.push({ key: row.month, dataLabel: `${row.month}月`, value: row.classNum })
        nonClassNumberInfo.dataInfo.push({ key: row.month, dataLabel: `${row.month}月`, value: row.nonClassNum })
      }

      if(trainingNumberTimeType.value === 'year') {
        classNumberInfo.dataInfo.push({ key: row.year, dataLabel: `${row.year}年`, value: row.classNum })
        nonClassNumberInfo.dataInfo.push({ key: row.year, dataLabel: `${row.year}年`, value: row.nonClassNum })
      }
    })
    statisticClassInfo.value = [classNumberInfo, nonClassNumberInfo]
    statisticClassStack.value = { classStack: [classNumberInfo.id, nonClassNumberInfo.id] }
  })
}
// getStatisticClassNum()

const handleSwtich = () => {
  baseParams.annualType = trainingNumberTimeType.value
  baseParams.orgId = props.orgs[props.orgs.length-1]
  getStatisticClassNum()
}
watchOrgsCallback(handleSwtich)
</script>
<script>
export default {
  name: 'DataDashboardClassNum'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';
</style>
