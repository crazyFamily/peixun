<template>
  <div class="chart-wrapper" ref="chartsRef"></div>
</template>

<script setup>
import echarts from '@/plugins/echarts'
import { useChart } from './hooks/useChart'
import { onMounted, ref, watch } from 'vue'
import { CopyObj, isArray } from '@/util/utils'
const props = defineProps({
  /**
   * interface seriesDataItem {
   *  [string]: {
   *    dataLabel?: string
   *    value: number   
   *  }
   * }
   * 
   * inteface seriesItem {
   *  id?: string
   *  dataInfo: seriesDataItem[]  
   * }
   * 
   * type seriesInfos = seriesItem[]
   */
  seriesInfos: {
    type: Array,
    required: true
  },
  // 是否显示loading
  loading: {
    type: Boolean,
    default: false
  },
  // 是否实心环
  isSolid: {
    type: Boolean,
    default: true
  },
  // 间隔-单位%
  margin: {
    type: Number,
    default: 0
  },
  templateStyle: {
    type: String
  },
  colors: {
    type: Array
  },
  // 自定义的配置
  chartOptions: {
    type: Object
  }
})

const chartsRef = ref(null)
const { echartsInstance, updateChart, createChartOptions, getEchartInstance, exportImage } = useChart({
  dom: chartsRef,
  props
})

watch(() => props.seriesInfos, value => {
  if(!isArray(value)) return
  const opt = createChartOptions({type: 'pie', series: value})
  updateChart(opt)
}, {immediate: true})

defineExpose({ updateChart, getEchartInstance, exportImage })
</script>
<script>
export default {
  name: 'PieChart'
}
</script>

<style lang='scss' scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
