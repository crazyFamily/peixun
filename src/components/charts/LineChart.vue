<template>
  <div class="chart-wrapper" ref="chartsRef"></div>
</template>

<script setup>
import echarts from '@/plugins/echarts'
import { onMounted, ref, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
import { isArray, isObj } from '@/util/utils'
import { useChart } from './hooks/useChart'
const props = defineProps({
  // 是否显示loading
  loading: {
    type: Boolean,
    default: false
  },
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
  xLabel: {
    type: Array
  },
 seriesInfos: {
    type: Array,
    required: true
  },
  templateStyle: {
    type: String
  },
  colors: {
    type: Array
  },
  chartOptions: {
    type: Object
  }
})
const chartsRef = ref(null)
const { echartsInstance, updateChart, createChartOptions, getEchartInstance, exportImage } = useChart({ dom: chartsRef, props })

watch(() => props.seriesInfos, value => {
  if(!isArray(value)) return
  // 组装series的值
  const opt = createChartOptions({type: 'line', series: value})
  updateChart(opt)
}, {immediate: true})

defineExpose({ updateChart,getEchartInstance, exportImage })
</script>
<script>
export default {
  name: 'LineChart'
}
</script>

<style lang='scss' scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
