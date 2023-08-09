<template>
  <div class="base-container">
    <div class="header-container">
      <span class="title">案例学习</span>
      <SelectSwitch
        :data-info="[
          { label: '月度', value: 'month' },
          { label: '年度', value: 'year' }
        ]"
        v-model="caseLearn"
        @change="handleSwtich"
      ></SelectSwitch>
    </div>
    <div class="content-container chart-wrapper" :style="`height: ${height}px;`" v-loading="getLoadingStatus('LOADING_STATISTIC_CASE_STUDY')">
      <Charts
        chart-type="lineBar"
        :chart-data="statisticCaseStudy"
        template-style="dark"
        :colors="{ bar: BAR_COLOR_LIST, line: LINE_COLOR_LIST }"
        :chartOptions="chartOptions"
        ref="statisticCaseStudyRef"
      ></Charts>
    </div>
  </div>
</template>

<script setup>
import SelectSwitch from '@/components/select/SelectSwitch.vue'
import Charts from '@/components/charts/index.vue'
import { useDataDashboard } from '../hooks/useDataDashboard'
import { fetchStatisticCaseStudy } from '@/fetch/dataDashboard'
import { ref, watch } from 'vue'
import { getLoadingStatus } from '@/util/utils'

const props = defineProps({
  orgs: {
    type: Array
  },
  height: { type: Number }
})
const statisticCaseStudyRef = ref(null)
const { BAR_COLOR_LIST, LINE_COLOR_LIST, watchOrgsCallback } = useDataDashboard({ dom: statisticCaseStudyRef, props })

const chartOptions = {
  // valueFormatter: function(value) {
  //   console.log(value, '===>>>value111');
  //   return value + '小时'
  // },
  tooltip: {
    trigger: 'axis',
    borderColor: 'rgba(255,255,255,0.5)',
    extraCssText: 'backdrop-filter: blur(10px); background-color: rgba(0,0,0,0.3);',
    formatter: (arr, ticket, callback) => {
      const name = arr[0]?.name || ''
      const list = []
      arr.forEach(row => {
        if(row.seriesId === 'studyHour') {
          list.push(`<p style="margin-top:5px;" ><span style="padding-right: 10px;">${row.marker}${row.seriesName}: </span>${row.value}小时</p>`)
        } else {
          list.push(`<p style="margin-top:5px;" ><span style="padding-right: 10px;">${row.marker}${row.seriesName}: </span>${row.value}</p>`)
        }
      })
      return `
        ${name} <br/> 
        ${list.join('')}
      `
    }
  },
  grid: {
    bottom: '15%'
  },
  yAxis: [
    {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255,255,255,0.2)'
        }
      },
      axisLabel: {
        textStyle: { color: '#fff' },
        formatter: (v, i) => {
          if (v >= 1000) {
            return `${Number((v / 1000).toFixed(2))}k`
          }
          return v
        }
      },
      nameTextStyle: { color: '#fff' },
      alignTicks: true,
      name: '学习时长'
    },
    {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'transparent'
        }
      },
      axisLabel: { 
        textStyle: { color: '#fff' },
        formatter: (v, i) => {
          if (v >= 1000) {
            return `${Number((v / 1000).toFixed(2))}k`
          }
          return v
        }
      },
      nameTextStyle: { color: '#fff' },
      alignTicks: true,
      name: '学习人数'
    }
  ]
}

const caseLearn = ref('month')
// 案例学习
const statisticCaseStudy = ref([])

const baseParams = {
  annualType: caseLearn.value,
  orgId: props.orgs[props.orgs.length - 1]
}

// 案例学习
const getStatisticCaseStudy = () => {
  fetchStatisticCaseStudy({ data: baseParams }).then((res) => {
    const studyHourCaseBaseItem = { id: 'studyHour', name: '学习时长', type: 'bar', dataInfo: [] }
    const studyNumBaseItem = { id: 'studyNum', name: '学习人数', type: 'line', dataInfo: [] }
    if (caseLearn.value === 'month') {
      res.forEach((row) => {
        studyHourCaseBaseItem.dataInfo.push({ key: row.month, dataLabel: `${row.month}月`, value: row.studyHour })
        studyNumBaseItem.dataInfo.push({ key: row.month, dataLabel: `${row.month}月`, value: row.studyNum })
      })
    }
    if (caseLearn.value === 'year') {
      res.forEach((row) => {
        studyHourCaseBaseItem.dataInfo.push({ key: row.year, dataLabel: `${row.year}年`, value: row.studyHour })
        studyNumBaseItem.dataInfo.push({ key: row.year, dataLabel: `${row.year}年`, value: row.studyNum })
      })
    }
    statisticCaseStudy.value = [studyHourCaseBaseItem, studyNumBaseItem]
  })
}
// getStatisticCaseStudy()

const handleSwtich = () => {
  baseParams.annualType = caseLearn.value
  baseParams.orgId = props.orgs[props.orgs.length - 1]
  getStatisticCaseStudy()
}
watchOrgsCallback(handleSwtich)
</script>
<script>
export default {
  name: 'DataDashboardCaseStudy'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';
</style>
