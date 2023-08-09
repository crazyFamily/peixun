import { watch } from 'vue'
import { BASE_CLASS_COLOR, BASE_NON_CLASS_COLOR } from '../enum'
import store from '@/store'

export function useDataDashboard({ dom, props = {} }) {
  const currentYear = String(new Date().getFullYear())
  const currentMonth = String(new Date().getMonth() + 1)

  // 柱状图
  const BAR_COLOR_LIST = [
    {
      x: 0,
      y: 1,
      x2: 0,
      y2: 0,
      colorStops: [
        { offset: 0, color: '#004DA8' },
        { offset: 1, color: '#4994EC' }
      ]
    },
    {
      x: 0,
      y: 1,
      x2: 0,
      y2: 0,
      colorStops: [
        { offset: 0, color: '#36F8B0' },
        { offset: 1, color: '#AEFCE9' }
      ]
    }
  ]

  // 线图
  const LINE_COLOR_LIST = ['#FFF08F']

  // 饼图series的颜色系列
  const PIE_COLOR_LIST = ['#73E5FF', '#C46948', '#35D05F', '#006CD0', '#8C01E5', '#F4BD7B', '#36F8B0', '#3697F8', '#3138B4', '#C74F4F']
  const PIE_COLOR_LIST2 = [BASE_CLASS_COLOR, BASE_NON_CLASS_COLOR]

  // 饼图tooltip设置
  const PIE_TOOLTIP_OPTION = {
    tooltip: {
      trigger: 'item',
      extraCssText: 'backdrop-filter: blur(10px); background-color: rgba(0,0,0,0.3);',
      formatter: ({ percent, value, name, seriesName, marker }, ticket, callback) => {
        return `
          ${name} <br/> 
          <p style="margin-top:5px;" ><span style="padding-right: 10px;">${marker}${value}</span> ${percent}%</p>
        `
      }
    }
  }

  const updateEchart = () => {
    dom?.value?.updateChart()
  }

  watch(
    () => props.height,
    (n) => {
      updateEchart()
    },
    { immediate: true }
  )

  // 更新图表
  watch(
    () => store.getters['app/getAsideCollapse'],
    (n) => {
      updateEchart()
    }
  )

  const watchOrgsCallback = (callback) => {
    watch(
      () => props.orgs,
      (n) => {
        if (n && n?.length >= 2) {
          callback && callback()
        }
      }
    )
  }

  return { BAR_COLOR_LIST, LINE_COLOR_LIST, PIE_COLOR_LIST, PIE_COLOR_LIST2, currentYear, currentMonth, PIE_TOOLTIP_OPTION, watchOrgsCallback }
}
