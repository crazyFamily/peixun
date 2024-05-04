<template>
  <div class="learningRanking">
    <el-radio-group v-model="tabPosition" @change="tabChangeHandle">
      <el-radio-button label="top" class="radio-button">排名区间</el-radio-button>
      <el-radio-button label="rankTop" class="radio-button">排行榜</el-radio-button>
    </el-radio-group>
    <div v-show="tabPosition === 'top'" class="org-line-bar">
      <div class="chart-wrapper" ref="chartsRef"></div>
    </div>
    <div v-show="tabPosition === 'rankTop'" class="rank-range">
      <div class="my-rank rank-box">
        <div class="position">NO.{{ myHourRank.totalRank }}</div>
        <div class="user-info">
          <p class="user-name">
            <span class="name">{{ myHourRank.empName }}</span>
            <span class="self">自己</span>
          </p>
          <p class="dep">
            {{ myHourRank.orgName }}
          </p>
        </div>
        <div class="learining-info">
          <span class="time">{{ myHourRank.totalHour }}</span
          >小时
        </div>
      </div>
      <div class="other-rank">
        <div v-for="(item, index) in hourRankList" :key="index" :class="{ 'my-rank mt0': item.umId === myHourRank.umId }" class="rank-box">
          <div
            :class="{
              first: item.totalRank === 1,
              second: item.totalRank === 2,
              three: item.totalRank === 3
            }"
            class="position"
          >
            NO.{{ item.totalRank }}
          </div>
          <div class="user-info">
            <p class="user-name">
              <span class="name">{{ item.empName }}</span>
              <span v-if="item.umId === myHourRank.umId" class="self">自己</span>
            </p>
            <p class="dep">
              {{ item.orgName }}
            </p>
          </div>
          <div class="learining-info">
            <span class="time">{{ item.totalHour }}</span
            >小时
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import echarts from '@/plugins/echarts'
import { ScatterChart } from 'echarts/charts'
echarts.use(ScatterChart)
import positionWhite from '@/assets/images/position-white.png'
import { fetchListStudyHourRank, fetchStudyHourRankBarChart } from '@/fetch/learningProfiles'
import { RANK_XLABEL, ISMYSELF } from '../../enum'
const tabPosition = ref('top')
const tabChangeHandle = (val) => {
  if (val === 'top') {
  }
}
const props = defineProps({
  currentYear: {
    type: String,
    default: ''
  },
  umId: {
    type: String,
    required: true
  },
})
// ------------------- 排行榜 start -------------------
const myHourRank = ref({})
const hourRankList = ref([])
watch(
  () => props.currentYear,
  (n) => {
    getListStudyHourRank({ data: { calYear: n, umId: props.umId } })
    getStudyHourRankBarChart({ data: { calYear: n, umId: props.umId } })
  }
)
const getListStudyHourRank = async (params) => {
  const res = await fetchListStudyHourRank(params)
  myHourRank.value = res.myHourRank || {}
  hourRankList.value = res.hourRankList || []
}
// ------------------- 排行榜 end -------------------
const echartsInstance = ref(null)
const chartsRef = ref(null)
// 初始化
const initEcharts = () => {
  if (!chartsRef.value) return
  const chartDom = chartsRef.value
  echartsInstance.value = echarts.init(chartDom)
  updateChart()
}
// 更新图表
const updateChart = () => {
  nextTick(() => {
    echartsInstance.value.clear()
    echartsInstance.value.setOption({
      grid: {
        top: 40,
        left: 40,
        right: 54,
        bottom: 28
      },
      legend: {
        right: -4,
        textStyle: {
          color: '#FF865F',
          fontSize: 12,
          fontFamily: 'PingFangSC-Regular'
        },
        selectedMode: false,
        itemWidth: 14,
        itemHeight: 19,
      },
      tooltip: {
        trigger: 'item',
        data: Object,
        formatter: (item, ticket, callback) => {
          const list = []
          const seriesItem = rankRangeList.value.find((v) => v.key === item.name) || {}
          list.push(
            `<p ><p style="color: #00000099">学时排名${item.name}</p><p style="font-size: 14px;color: #000">共${seriesItem.peopleNum}人</p><p style="font-size: 14px;color: #000">平均时长${item.value}小时</p></p>`
          )
          return `${list.join('')}`
        }
      },
      xAxis: [
        {
          type: 'category',
          data: RANK_XLABEL.map((v) => v.label),
          name: '排名区间',
          nameGap: 4,
          nameTextStyle: {
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular',
            verticalAlign: 'top',
            color: 'rgba(0, 0, 0 ,0.4)'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DFE2E9',
              width: 1
            }
          },
          // 坐标轴标签
          axisLabel: {
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular',
            color: 'rgba(0, 0, 0 ,0.6)'
          },
          // 坐标轴刻度相关设置
          axisTick: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          show: true,
          name: '人均学时:(小时)',
          nameGap: 12,
          nameTextStyle: {
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular',
            color: 'rgba(0, 0, 0 ,0.4)'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#DFE2E9',
              width: 1
            }
          },
          // 坐标轴标签
          axisLabel: {
            fontSize: 12,
            fontFamily: 'PingFangSC-Regular',
            color: 'rgba(0, 0, 0 ,0.6)'
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        }
      ],
      series: [
        {
          data: rankRangeList.value, // [10, 20, 30, 40, 50]
          type: 'bar',
          color: {
            type: 'linear',
            x: 0,
            y: 1,
            x2: 0,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#FF865F' },
              { offset: 1, color: '#FFA269' }
            ]
          },
          barWidth: 20,
          barGap: 22,
          markLine: {
            silent: true,
            animation: false,
            symbol: 'none',
            data: [
              {
                type: 'average',
                yAxis: avgTotalHour.value // 要修改的平均值
              }
            ],
            label: {
              show: true,
              position: 'end',
              rich: {
                tipName: {
                  align: 'left',
                  fontFamily: 'PingFangSC-Regular',
                  color: '#FD6720',
                  fontWeight: 400,
                  lineHeight: 16
                }
              },
              formatter: (name) => {
                return ['{tipName|全行平均}\n', '{tipName|' + name.value + '}'].join('')
              }
            },
            lineStyle: {
              type: 'solid'
            }
          }
        },
        {
          type: 'scatter',
          name: '我的位置',
          symbol: `image://${positionWhite}`,
          symbolSize: [14, 19],
          symbolOffset: [0, '-50%'],
          data: myRankRangeList.value.length ? [myRankRangeList.value] : [], // 我的位置信息 ['前20%', 10]
          tooltip: {
            trigger: 'item',
            data: Object,
            formatter: (item) => {
              return `<p style="color: #00000099">学时排名${item.name}</p><p style="font-size: 14px;color: #000">学习时长${item.value[1]}小时</p>`
            }
          }
        }
      ]
    })
  })
}
const rankRangeList = ref([])
// 全行平均总学习时长
const avgTotalHour = ref(0)
const myRankRangeList = ref([])
const getStudyHourRankBarChart = async (params) => {
  const res = (await fetchStudyHourRankBarChart(params)) || {}
  avgTotalHour.value = res.avgTotalHour || 0
  myRankRangeList.value = []
  const dataInfo = []
  RANK_XLABEL.forEach((v) => {
    const rankRangeRow = res.rankRangeList?.find((i) => i.rankRange === v.value) || {}
    dataInfo.push({
      key: v.label,
      rankRange: v.label,
      peopleNum: rankRangeRow.peopleNum || 0,
      avgHour: rankRangeRow.avgHour || 0,
      value: rankRangeRow.avgHour || 0,
      haveMySelf: rankRangeRow.haveMySelf
    })
    // 我的位置信息
    if (rankRangeRow.haveMySelf === ISMYSELF) {
      myRankRangeList.value = [v.label, res.totalHour]
    }
  })
  rankRangeList.value = dataInfo
  nextTick(() => {
    updateChart()
  })
}
onMounted(() => {
  initEcharts()
})
</script>

<script>
export default {
  name: 'LearningRanking'
}
</script>
<style lang="scss" scoped>
.learningRanking {
  flex: 1;
  min-width: 389px;
  background-color: #fff;
  margin-left: 83px;
  height: 262px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .radio-button {
    width: 75px;
    height: 28px;
    :deep(.el-radio-button__inner) {
      width: 100%;
      padding: 0;
      line-height: 28px;
      font-family: 'PingFangSC-Regular', arial;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      text-align: center;
      font-weight: 400;
      background-color: #f7f8fa;
    }
    &.is-active {
      :deep(.el-radio-button__inner) {
        background-color: #fff;
        color: #FC652F;
      }
    }
  }
  .rank-range {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    .rank-box {
      width: 361px;
      height: 59px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      .position {
        width: 50px;
        min-height: 18px;
        margin-left: 10px;
        margin-right: 8px;
        background: rgba(253, 103, 32, 0.1);
        border-radius: 2px;
        font-family: 'HelveticaNeue-BoldItalic', arial;
        font-size: 13px;
        color: #fd6720;
        text-align: center;
        font-weight: 700;
        &.first {
          background: linear-gradient(to right, #FFA200, #FFC400);
          color: #fff;
        }
        &.second {
          background: linear-gradient(to right, #BFC4CE, #D7DAE0);
          color: #fff;
        }
        &.three {
          background: linear-gradient(to right, #FFA06A, #FFB17E);
          color: #fff;
        }
      }
      .user-info {
        flex: 1;
        overflow: hidden;
        .dep {
          margin-top: 4px;
          font-family: 'PingFangSC-Regular', arial;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
          line-height: 14px;
          font-weight: 400;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .user-name {
          display: flex;
          align-items: center;
          .name {
            font-size: 14px;
            color: #000;
            line-height: 14px;
            font-family: 'PingFangSC-Regular', arial;
            font-weight: 400;
          }
          .self {
            width: 36px;
            height: 16px;
            display: inline-block;
            margin-left: 6px;
            background: rgba(253, 103, 32, 0.1);
            border-radius: 2px;
            font-family: 'PingFangSC-Regular', arial;
            font-size: 12px;
            line-height: 16px;
            color: #fd6720;
            text-align: center;
            font-weight: 400;
          }
        }
      }
      .learining-info {
        margin-left: 18px;
        margin-right: 15px;
        font-family: 'PingFangSC-Regular', arial;
        font-size: 14px;
        color: #000000;
        line-height: 12px;
        font-weight: 400;
        .time {
          margin-right: 2px;
          font-family: 'DINAlternate-Bold', arial;
          font-size: 14px;
          color: #000000;
          line-height: 12px;
          font-weight: 700;
        }
      }
      .mt10 .position {
        min-width: 60px;
      }
      &.my-rank {
        margin-top: 19px;
        background-color: #f5f6fb;
        .user-info {
          .user-name {
            .name {
              color: #fd6720;
              font-family: 'PingFangSC-Medium', arial;
              font-weight: 500;
            }
          }
          .dep {
            color: rgba(253,103,32,0.60);
          }
        }
        .learining-info {
          color: #fd6720;
          .time {
            color: #fd6720;
          }
        }
      }
    }
    .other-rank {
      flex: 1;
      overflow: auto;
      width: 378px;
    }
  }
  .org-line-bar {
    width: 363px;
    height: 240px;
    .chart-wrapper {
      width: 100%;
      height: 100%;
    }
  }
}
</style>