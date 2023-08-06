import { nextTick, onMounted, ref, watch } from "vue"
import echarts from '@/plugins/echarts'
import { CopyObj } from "@/plugins/until"
import { isArray, isObj } from "@/util/utils"

// 合并两个对像, obj2为最后产出的源
const mergeObjects = (obj1, obj2) => {
  // 如果 obj1 或 obj2 不是对象，则返回 obj2
  if (typeof obj1 !== 'object' || obj1 === null) {
    return obj2
  }
  if (typeof obj2 !== 'object' || obj2 === null) {
    return obj1
  } // 创建一个新对象，将 obj1 和 obj2 的属性复制到其中

  const newObj = {}
  for (const prop in obj1) {
    newObj[prop] = mergeObjects(obj1[prop], obj2[prop])
  }
  for (const prop in obj2) {
    if (!newObj[prop]) {
      newObj[prop] = mergeObjects(obj1[prop], obj2[prop])
    }
  }
  return newObj
}

export function useChart({ dom, props = {} }) {
// 暗色，字白
    const DARK_TEXT_STYLE = {
        axisLabel: {
        textStyle: { color: '#fff' }
        },
        title: {
        textStyle: { color: '#fff' }
        },
        legend: {
        textStyle: { color: '#fff' },
        pageTextStyle: { color: '#fff' }
        },
        tooltip: {
        textStyle: { color: '#fff' }
        },
        xAxis: {
        axisLabel: { textStyle: { color: '#fff' } }
        },
        yAxis: {
        axisLabel: { textStyle: { color: '#fff' } }
        }
    }

  // 基础数据配置
  let BASE_OPTIONS = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      borderColor: props.templateStyle === 'dark' ? 'rgba(255,255,255,0.5)' : '#fff'
    },
    grid: {
      right: '3%',
      bottom: '15%'
    },
    legend: {
      type: 'scroll',
      left: 'center'
    },
    xAxis: {
      type: 'category',
      axisTick: 'inside',
      data: []
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255,255,255,0.2)'
        }
      },
      axisLabel: {
        textStyle: {},
        formatter: (v, i) => {
          if (v >= 1000) {
            return `${Number((v / 1000).toFixed(2))}k`
          }
          return Number(v.toFixed(2))
        }
      }
    },
    series: []
}
    if(props.templateStyle === 'dark') {
    BASE_OPTIONS.yAxis.axisLabel.textStyle.color = '#fff'
    BASE_OPTIONS.tooltip.extraCssText = 'backdrop-filter: blur(10px); background-color: rgba(0,0,0,0.3);'
    }
console.log(props)
props.chartOptions && (BASE_OPTIONS = Object.assign({}, BASE_OPTIONS, props.chartOptions))

// 饼图基础数据配置
let PIE_BASE_OPTIONS = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    type: 'scroll',
    left: 'center'
  },
  series: []
}
if(props.templateStyle === 'dark') {
  PIE_BASE_OPTIONS.tooltip = {
    trigger: 'item',
    extraCssText: 'backdrop-filter: blur(10px); background-color: rgba(0,0,0,0.3);'
  }
}
props.colors && props.colors.length && (PIE_BASE_OPTIONS.color = props.colors)
props.chartOptions && (PIE_BASE_OPTIONS = Object.assign({}, PIE_BASE_OPTIONS, props.chartOptions))

// 这里对传进来的stackMap做一次反转组装，方便后续逻辑进行寻址
const stackMap = new Map()
watch(
    () => props.stackInfo,
    (value) => {
      if (!isObj(value)) return
      stackMap.clear()
      Object.entries(value).forEach(([stackName, value]) => {
        value.forEach((xAxisName) => {
          stackMap.set(xAxisName, stackName)
        })
      })
    },
    { immediate: true }
  )

  const echartsInstance = ref(null)
  // 初始化
  const initEcharts = () => {
    if(!dom) return
    const chartDom = dom.value
    echartsInstance.value = echarts.init(chartDom)
  }

  // 更新图表
  const updateChart = (opt = {}) => {
    resizeChart()
    if(!Object.keys(opt).length) return
    nextTick(() => {
      echartsInstance.value.clear()
      echartsInstance.value.setOption(opt)
    })
  }

  // 图表容器resize
  const resizeChart = () => {
    nextTick(() => {
      echartsInstance.value.resize()
    })
  }

  const getEchartInstance = () => {
    return echartsInstance.value
  }

  // 导出图片
  const exportImage = (options = {}) => {
    return echartsInstance.value.getDataURL(options)
  }

  // 构建series颜色系列, 当前只用于线柱图
  const createSeriesColors = (series) => {
    const res = CopyObj(series)
    // 过滤出柱图
    const barDatas = res.filter((row) => row.type === 'bar')
    const lineDatas = res.filter((row) => row.type === 'line')

    let currentColors = CopyObj(props.colors)
    barDatas.forEach((row, i) => {
      if (!row.itemStyle) row.itemStyle = {}
      if (isObj(props.colors)) currentColors = props.colors.bar
      currentColors && currentColors[i] && (row.itemStyle.color = currentColors[i])
    })
    lineDatas.forEach((row, i) => {
      if (!row.itemStyle) row.itemStyle = {}
      if (isObj(props.colors)) currentColors = props.colors.line
      currentColors && currentColors[i] && (row.itemStyle.color = currentColors[i])
    })

    // 过滤出线图
    return res
  }

  // 构建基础数据，当仅适合用在line和bar类型
  const createBaseChartSeries = (series, labels = props.xLabel) => {
    const resultSeries = []
    let xAxisDatas = []
    const legendData = []
    createSeriesColors(series).forEach(({ dataInfo, ...rest }, seriesIndex) => {
      if (!isArray(dataInfo) || !dataInfo.length) return
      const seriesItem = { ...rest, data: [], barMaxWidth: 10 }
      seriesItem.itemStyle = Object.assign({}, seriesItem.itemStyle || {}, { borderRadius: [10, 10, 0, 0] })
      legendData.push(seriesItem.name)
      if (stackMap.has(seriesItem.id)) seriesItem.stack = stackMap.get(seriesItem.id)
      xAxisDatas = []
      const seriesItemsDatas = []
      dataInfo.forEach(({ key, dataLabel, value }) => {
        xAxisDatas.push(dataLabel || key)
        seriesItemsDatas.push(value)
      })
      seriesItem.data = seriesItemsDatas
      resultSeries.push(seriesItem)
    })

    // 结合xLabel和xAxisDatas，以xLabel为优先取值
    if (labels) {
      xAxisDatas.forEach((v, k) => {
        xAxisDatas[k] = labels[k] || xAxisDatas[k]
      })
    }

    props.stackInfo &&
      Object.values(props.stackInfo).forEach((stackRow) => {
        stackRow.forEach((row, index) => {
          if (index !== stackRow.length - 1) {
            const seriesItem = resultSeries.find((seriesItem) => seriesItem.id == row)
            // 被stack的去掉圆角
            seriesItem.itemStyle && (seriesItem.itemStyle.borderRadius = [0, 0, 0, 0])
          }
        })
      })

    const xAxis = {
      ...mergeObjects(props.templateStyle === 'dark' ? DARK_TEXT_STYLE.xAxis : {}, BASE_OPTIONS.xAxis),
      data: xAxisDatas
    }

    const legend = {
      ...mergeObjects(props.templateStyle === 'dark' ? DARK_TEXT_STYLE.legend : {}, BASE_OPTIONS.legend),
      data: legendData
    }

    return { series: CopyObj(resultSeries), xAxis, legend }
  }

  // 构建线柱图数据
  const createLineBarSeries = (series, labels = props.xLabel) => {
    const { series: resultSeries, xAxis: baseXAxis, legend } = createBaseChartSeries(series, labels)
    let yAxisDatas = []
    if (Array.isArray(props?.chartOptions?.yAxis)) {
      yAxisDatas = props?.chartOptions?.yAxis
    } else {
      resultSeries.forEach((seriesItem) => {
        const maxData = Math.max(...seriesItem.data)
        const minData = 0
        // 份额
        const market = 5
        const middleData = Math.floor(maxData / market)
        const baseItem = {
          // ...mergeObjects(props.templateStyle === 'dark' ? DARK_TEXT_STYLE.yAxis : {}, BASE_OPTIONS.yAxis),
          ...BASE_OPTIONS.yAxis,
          type: 'value',
          alignTicks: true,
          name: seriesItem.name,
          // min: minData,
          // max: maxData,
          // interval: middleData
        }
  
        if (props.templateStyle === 'dark') {
          baseItem?.axisLabel?.textStyle?.color && ( baseItem.axisLabel.textStyle.color = '#fff')
          baseItem?.title?.textStyle?.color && ( baseItem.title.textStyle.color = '#fff')
          baseItem?.legend?.textStyle?.color && ( baseItem.legend.textStyle.color = '#fff')
          baseItem?.legend?.pageTextStyle?.color && ( baseItem.legend.pageTextStyle.color = '#fff')
          baseItem?.tooltip?.textStyle?.color && ( baseItem.tooltip.textStyle.color = '#fff')
          baseItem?.xAxis?.axisLabel?.textStyle?.color && ( baseItem.xAxis.axisLabel.textStyle.color = '#fff')
          baseItem?.yAxis?.axisLabel?.textStyle?.color && ( baseItem.yAxis.axisLabel.textStyle.color = '#fff')
          !baseItem.nameTextStyle && (baseItem.nameTextStyle = {})
          baseItem.nameTextStyle.color = '#fff'
        }
        yAxisDatas.push(CopyObj(baseItem))
      })
    }

    try {
      resultSeries[1] && (resultSeries[1].yAxisIndex = 1)
      yAxisDatas[0] && (yAxisDatas[0].splitLine.lineStyle.color = 'transparent')
    } catch (error) {
      console.log(error)
    }

    const xAxis = [baseXAxis]
    const yAxis = yAxisDatas

    console.log(resultSeries, '===>> resultSeries')

    return { series: resultSeries, xAxis, yAxis, legend }
  }

  // 构建饼图数据
  const createPieSeries = (series) => {
    const resultSeries = []
    /**
     * 根据series与间隔自动计算每个环的间隔
     * 逻辑思路：
     * 以最大空间量为边界, 除以环数，算出每份可占最大空间量
     * 最大空间量 = 外环 - 内环 + 间隔
     * 如果设置的间隔大于等于最大空间量，循环/2，直到小于最大量
     * 内环 = 外环 / 2，如果值大于最大环粗，则取最大值
     * 内环不能小于最小值
     */
     const computedRadius = (series) => {
        const pieLength = series.length
        const maxSpace = 70
        const minMargin = props.isSolid ? 0 : 5
        // 最大的环粗
        const maxPieWidth = 20
        // 每份最大间隔
        const perMaxSpace = Math.floor(maxSpace / pieLength)
        // 内环+外环+间隔不可大于每份最大份额，如果间隔大于最大份额，则间隔/2
        let resultMargin = props.margin
        while (resultMargin >= perMaxSpace) {
          resultMargin = Math.floor(resultMargin / 2)
        }
        const resultRadiusList = new Array(pieLength).fill([])
        let outerPieNumber = maxSpace
        let innerPieNumber = 0
        for (let index = pieLength - 1; index >= 0; index--) {
          const diffPieWidth = perMaxSpace - resultMargin
          innerPieNumber = outerPieNumber - (diffPieWidth > maxPieWidth ? maxPieWidth : diffPieWidth)
          innerPieNumber = innerPieNumber < minMargin ? minMargin : innerPieNumber
          resultRadiusList[index] = [`${innerPieNumber}%`, `${outerPieNumber}%`]
          outerPieNumber = innerPieNumber - resultMargin
        }
  
        // 如果是实心，第一份要为0
        if (props.isSolid) {
          resultRadiusList[0] && (resultRadiusList[0][0] = 0)
        }
  
        return resultRadiusList
      }
      const resultRadius = computedRadius(series)

    // { name, radius, dataInfo, ...rest }
    series.forEach((seriesRow, index) => {
        const seriesItem = { ...seriesRow, type: 'pie', data: [] }
        seriesItem.name = seriesRow.name
        seriesItem.radius = seriesRow.radius || resultRadius[index]
        const seriesItemsDatas = []
        seriesRow.dataInfo.forEach(({ dataLabel, value, key, ...rest }) => {
          seriesItemsDatas.push({ value, name: dataLabel || key, ...rest })
        })
        seriesItem.data = seriesItemsDatas
        resultSeries.push(seriesItem)
      })
  
      return { series: CopyObj(resultSeries) }
    }
  
    // 格式化图表数据
    const createSeriesDatas = (type) => {
      switch (type) {
        case 'line':
        case 'bar':
          return createBaseChartSeries
        case 'lineBar':
          return createLineBarSeries
      }
    }
  
    // 构建基础配置
    const createBaseOptions = (baseOptions = BASE_OPTIONS) => {
      let res = {}
      if (props.templateStyle === 'dark') {
        res = mergeObjects(DARK_TEXT_STYLE, baseOptions)
      } else {
        res = baseOptions
    }
    return CopyObj(res)
  }

  // 构建图表配置数据
  const createChartOptions = ({ type, series }) => {
    let resultSeries = {}
    let opt = {}
    switch (type) {
      case 'line':
      case 'bar':
        opt = createBaseOptions()
        resultSeries = createBaseChartSeries(series)
        resultSeries.series = resultSeries.series
        break
      case 'lineBar':
        opt = createBaseOptions()
        // const o = { ...opt.grid }
        // Reflect.deleteProperty(o, 'right')
        // opt.grid = o
        resultSeries = createLineBarSeries(series)
        console.log(opt, resultSeries)
        break
      case 'pie':
        opt = createBaseOptions(PIE_BASE_OPTIONS)
        Reflect.deleteProperty(opt, 'xAxis')
        Reflect.deleteProperty(opt, 'yAxis')
        resultSeries = createPieSeries(series)
        break
    }
    return Object.assign({}, opt, resultSeries)
  }

  // loading
  watch(
    () => props.loading,
    (value) => {
      if (value) echartsInstance.value?.showLoading()
      else echartsInstance.value?.hideLoading()
    },
    { immediate: true }
  )

  onMounted(() => {
    initEcharts()
  })

  return {
    echartsInstance,
    updateChart,
    exportImage,
    createSeriesDatas,
    createChartOptions,
    BASE_OPTIONS
  }
}
    
                    