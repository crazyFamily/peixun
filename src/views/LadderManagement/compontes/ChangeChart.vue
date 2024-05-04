<template>
  <div class="changeChart" ref="chart"></div>
</template>
<script>
import echarts from '@/plugins/echarts'
import 'echarts/lib/component/dataZoom'
export default {
  props: {
    months: {
      type: Array,
      default: []
    },
    coverSituations: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      xAxisData: [],
      employeData: [],
      joinData: [],
      coverageData: [],
      start: 0, // x轴显示的data初始下标
      end: 0,
      oldStartXAxisData: '',
      oldEndXAxisData: '',
      startYear: '',
      isEmit: false,
      chart: null
    }
  },
  methods: {
    // 渲染图表
    renderChart() {
      this.chart = this.chart || (this.chart = echarts.init(this.$refs.chart))
      this.chart.setOption({
        color: ['#fd6720', '#ffe060', '#53acfc'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          //上面提示的东西
          left: '6%',
          itemGap: 30 //左右间隔
        },
        dataZoom: [
          {
            type: 'slider',
            startValue: this.start,
            endValue: this.end,
            backgroundColor: '#e3e3e7',
            fillerColor: '#eba185',
            handleIcon: 'circle',
            moveHandleSize: 5,
            handleSize: 12,
            emphasis: {
              //高亮样式设置
              handleStyle: {
                borderColor: '#eba185'
              },
              moveHandleStyle: {
                color: '#eba185'
              }
            },
            borderColor: '#e3e3e7',
            showDataShadow: false, // 是否展示数据阴影
            height: 8,
            rangeMode: ['value', 'percent'],
            brushSelect: false, // 是否开启筛选功能
            handleStyle: {
              //手柄样式控制
              borderColor: '#f9764c',
              borderWidth: 2
            }
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: this.xAxisData,
            axisLabel: {
              formatter(value) {
                return value.split('年')[1]
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true, // 是否是脱离 0 值比例
            position: 'left'
          },
          {
            type: 'value',
            scale: true,
            position: 'right',
            axisLabel: {
              formatter(value) {
                return value + '%'
              }
            }
          }
        ],
        series: [
          {
            name: '入岗人数',
            type: 'bar',
            data: this.employeData,
            barGap: 0
          },
          {
            name: '覆盖人数',
            type: 'bar',
            data: this.joinData
          },
          {
            name: '覆盖率',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function(value) {
                return value + '%'
              }
            },
            data: this.coverageData
          }
        ]
      })
      this.chart.on('datazoom', params => {
        let startX = this.chart.getModel().option.dataZoom[0].startValue
        let endX = this.chart.getModel().option.dataZoom[0].endValue
        this.oldStartXAxisData = this.xAxisData[startX] // 当前缩放后X轴展示的起始时间
        this.oldEndXAxisData = this.xAxisData[endX] // 当前缩放后X轴展示的结束时间,数据更新之后设置缩放下标需要用到
        this.showStartYear = this.oldStartXAxisData.split('年')[0]
        if (this.showStartYear === this.startYear && this.isEmit) {
          // 当前缩放展示的当前年份等于初始数据的年份触发事件,并且要防止重复触发
          this.$emit('change-datazoom')
          this.isEmit = false
        }
      })
    },
    _initData() {
      this.months.forEach((v, i) => {
        this.xAxisData.unshift(
          this.months[this.months.length - 1 - i].replace('-', '年') + '月'
        )
      })
      this.startYear = this.xAxisData[0]?.split('年')[0]
      const startIndex = this.xAxisData.findIndex(
        i => i === this.oldStartXAxisData
      )
      const endIndex = this.xAxisData.findIndex(i => i === this.oldEndXAxisData)
      this.end = this.oldEndXAxisData ? endIndex : this.xAxisData.length - 1
      this.start = this.oldStartXAxisData ? startIndex : this.end - 11
      this.oldStartXAxisData = this.xAxisData[this.start]
      this.coverSituations.forEach((v, i) => {
        this.employeData.unshift(
          this.coverSituations[this.coverSituations.length - 1 - i].jobNum
        )
        this.joinData.unshift(
          this.coverSituations[this.coverSituations.length - 1 - i].cultivateNum
        )
        this.coverageData.unshift(
          this.coverSituations[this.coverSituations.length - 1 - i].coverRate
        )
      })
      this.isEmit = true
    },
    // 父组件重置数据时父组件调用的方法
    resetData() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.renderChart()
    }
  },
  watch: {
    months(n) {
      this._initData()
      this.renderChart()
    }
  }
}
</script>
<style lang="scss" scoped>
.changeChart {
  width: 100%;
  height: 100%;
}
</style>