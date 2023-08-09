<template>
  <div class="base-container">
    <div class="header-container">
      <span class="title">年度总学时</span>
      <el-date-picker
        popper-class="DataDashboard__date-picker__template-dark"
        class="year-style"
        :editable="false"
        size="mini"
        v-model="totalLearnTime"
        type="year"
        :clearable="false"
        align="center"
        value-format="yyyy"
        @change="handleChange"
      >
      </el-date-picker>
    </div>
    <div class="content-container chart-wrapper" :style="`height: ${height}px;`" v-loading="getLoadingStatus('LOADING_STATISTIC_TOTAL_STUDY')">
      <Charts
        chart-type="pie"
        :chart-data="statisticTotalStudyInfo"
        template-style="dark"
        :is-solid="false"
        :colors="PIE_COLOR_LIST"
        :chart-options="statisticTotalStudyOpts"
        ref="statisticTotalStudyInfoRef"
      ></Charts>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDataDashboard } from '../hooks/useDataDashboard'
import { fetchStatisticTotalStudy } from '@/fetch/dataDashboard'
import { getLoadingStatus } from '@/util/utils'
import Charts from '@/components/charts/index.vue'

const props = defineProps({
  orgs: {
    type: Array
  },
  height: { type: Number }
})

const statisticTotalStudyInfoRef = ref(null)
const { currentYear, PIE_COLOR_LIST, PIE_TOOLTIP_OPTION, watchOrgsCallback } = useDataDashboard({ dom: statisticTotalStudyInfoRef, props })

// 年度总学时图表配置
const statisticTotalStudyOpts = {
  ...PIE_TOOLTIP_OPTION,
  legend: {
    // orient: 'vertical',
    type: 'scroll',
    pageIconColor: '#74c6fe',
    // pageIconInactiveColor: 'red'
  } 
}

// 年度学时
const statisticTotalStudyInfo = ref([])
const totalLearnTime = ref(currentYear)

const baseParams = {
  year: totalLearnTime.value,
  orgId: props.orgs[props.orgs.length-1]
}
// 年度学时
const getStatisticTotalStudy = () => {
  fetchStatisticTotalStudy({data: baseParams}).then((res) => {
    const dataInfo = res.map((row) => ({ key: row.studyType, dataLabel: row.studyTypeName, value: row.studyHour }))
    const baseItem = { id: 'avgStudy', name: '人均学时', label: { show: false }, dataInfo }
    statisticTotalStudyInfo.value = [baseItem]
  })
}
// getStatisticTotalStudy()

const handleChange = () => {
  baseParams.year = totalLearnTime.value
  baseParams.orgId = props.orgs[props.orgs.length - 1]
  getStatisticTotalStudy()
}
watchOrgsCallback(handleChange)
</script>
<script>
export default {
  name: 'DataDashboardTotalStudyInfo'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';
</style>
