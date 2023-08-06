<template>
  <div class="charts-wrapper" ref="chartsWrapperRef">
    <component 
      v-if="currentChartCompnent"
      :is="currentChartCompnent"
      ref="chartRef"
      :x-label="chartXLabel"
      :series-infos="seriesInfos"
      :chart-options="chartOptions"
      :colors="colors"
      :loading="loading"
      v-bind="$attrs"
      v-on="$listeners"
    ></component>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import LineChart from './LineChart.vue';
import BarChart from './BarChart.vue';
import PieChart from './PieChart.vue';
import LineBarChart from './LineBarChart.vue';
import { CopyObj } from '@/plugins/until';
const typeComponentMap = {
  'line': LineChart,
  'bar': BarChart,
  'pie': PieChart,
  'lineBar': LineBarChart
}
const props = defineProps({
  chartType: {
    type: String,
    required: true
  },
 chartData: {
    type: Array,
    required: true
  },
  chartXLabel: {
    type: Array
  },
  // 自定义配置
  chartOptions: {
    type: Object
  },
  // 颜色系列
  colors: {
    type: [Array, Object]
  },
  loading: {
    type: Boolean
  }
})
const currentChartCompnent = computed(() => {
  return typeComponentMap[props.chartType]
})

const formatBarData = (data) => {
  const result = CopyObj(data).map(( data ) => ({...data, type: 'bar'}))
  return result
}
const formatLineData = (data) => {
  const result = CopyObj(data).map(( data ) => ({...data, type: 'line'}))
  return result
}

const seriesInfos = computed(() => {
  switch(props.chartType) {
    case 'bar':
      return formatBarData(props.chartData)
    case 'line':
      return formatLineData(props.chartData)
    default: 
      return props.chartData
  }
})

// 更新图表，刷新数据
const chartRef = ref(null)
const updateChart = (...rest) => {
  chartRef.value.updateChart(...rest)
}
const getEchartInstance = () => {
  return chartRef.value.getEchartInstance()
}
const exportImage = (options) => {
  console.log(chartRef.value, '===>>> ');
  return chartRef.value.exportImage(options)
}
defineExpose({ updateChart, getEchartInstance, exportImage })

</script>
<script>
export default {
  name: "index"
}
</script>

<style lang='scss' scoped>
.charts-wrapper {
  width: 100%;
  height: 100%;
}
</style>
