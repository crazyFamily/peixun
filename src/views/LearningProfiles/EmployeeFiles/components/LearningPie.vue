<template>
  <div class="learningPie">
    <div class="content-container chart-wrapper">
      <div
        class="content-container chart-wrapper"
        :style="`height: 262px;`"
        :key="updateTotalHourKey"
        v-loading="getLoadingStatus('LOADING_STATISTIC_CLASS_DISTRIBUTION')"
      >
        <Charts
          chart-type="pie"
          :chart-data="statisticClassDistribution"
          :colors="PIE_COLOR_LIST2"
          :chart-options="classDistributionOpts"
          :pie-radius="[40, 70]"
          :isSolid="false"
          ref="learningPieRef"
        ></Charts>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue'
import { getLoadingStatus } from '@/util/utils'
import Charts from '@/components/charts/index.vue'
import { STUDYTYPES } from '../../enum'
import { fetchStudyHourPieChart } from '@/fetch/learningProfiles'
const props = defineProps({
  currentYear: {
    type: String,
    default: ''
  },
  totalHour: null,
  umId: {
    type: String,
    required: true
  },
})

watch(
  () => props.currentYear,
  (n) => {
    getStatisticClassDistribution({ data: { calYear: n, umId: props.umId } })
  }
)
const learningPieRef = ref(null)
// 图表定定义配置项
const classDistributionOpts = ref({})
const updateTotalHourKey = ref(Date.now())
watch(
  () => props.totalHour,
  () => {
    classDistributionOpts.value = {
      tooltip: {
        trigger: 'item',
        formatter: ({ percent, value, name, marker }) => {
          return `
          <span style="font-family: 'PingFangSC-Regular';font-size: 14px;color: rgba(0,0,0,0.60);">${name}</span> <br/> 
          <p style="margin-top:10px;font-size: 14px;font-family: 'DINAlternate-Bold';color:#000"><span style="margin-right: 3px;font-size: 18px;">${marker}${value}</span>小时<span style="margin-left: 3px;font-size: 18px;">${percent?.toFixed(1)}</span>%</p>
        `
        }
      },
      title: {
        show: true,
        text: ['{tipName|总学时}', `{hour|${props.totalHour || 0}}`].join('\n') + '\n{unit|小时}',
        left: '88',
        top: 'center',
        textAlign: 'center',
        textStyle: {
          fontSize: 14,
          color: 'rgba(0,0,0,0.60)',
          fontWeight: 400,
          rich: {
            tipName: {
              fontSize: 14,
              color: 'rgba(0,0,0,0.60)',
              fontWeight: 400,
              lineHeight: 26
            },
            hour: {
              fontSize: 18,
              fontWeight: 700,
              color: 'rgba(0,0,0,1)',
              padding: [0, 3, 0, 0]
            },
            unit: {
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 20
            }
          }
        }
      },
      legend: {
        show: true,
        orient: 'vertical',
        itemHeight: '10',
        itemGap: 10,
        right: 'right',
        top: 'center',
        icon: 'circle',
        selectedMode: false,
        textStyle: {
          fontSize: 14,
          width: 170,
          rich: {
            tipName: {
              align: 'left',
              fontSize: 14,
              color: 'rgba(0, 0, 0, 0.6)',
              fontWeight: 400
            },
            tipNameHour: {
              align: 'right',
              fontSize: 14,
              color: '#000000',
              fontWeight: 400
            },
            hour: {
              align: 'right',
              fontSize: 14,
              color: '#000000',
              padding: [0, 3, 0, 0],
              fontWeight: 700
            },
            percentHour: {
              align: 'right',
              fontSize: 14,
              color: '#000000',
              fontWeight: 700,
              padding: [0, 0, 0, 5]
            }
          }
        },
        formatter: (name) => {
          let item = pieInfoList.value.find((item) => name === item.name)
          let percent = 0
          if (props.totalHour) {
            percent = Number(((100 * item.value) / props.totalHour).toFixed(1))
          }
          return [
            '{tipName|' + item.name + '}',
            '{hour|' + item.value + '}',
            '{tipNameHour|' + '小时' + '}',
            '{percentHour|' + `${percent}` + '}',
            '{tipNameHour|' + '%' + '}'
          ].join('')
        }
      }
    }
    nextTick(() => {
      updateTotalHourKey.value = Date.now()
    })
  },
  {
    immediate: true
  }
)
// 饼图series的颜色系列
const PIE_COLOR_LIST2 = ['#336CE8', '#6091FF', '#00BBE6', '#25DBB9', '#FFC15D', '#FF7C3A', '#FF4A52']

const statisticClassDistributionRef = ref(null)
// 项目分布
const statisticClassDistribution = ref([])
const pieInfoList = ref([])
const getStatisticClassDistribution = async (params) => {
  const res = (await fetchStudyHourPieChart(params)) || {}
  pieInfoList.value = STUDYTYPES.map((v) => {
    let value
    if (v.label === '培训班') {
      value = res.classStudyHour || 0
    } else if (v.label === '课程') {
      value = res.courseStudyHour || 0
    } else if (v.label === '直播') {
      value = res.liveStudyHour || 0
    } else if (v.label === '考试') {
      value = res.examStudyHour || 0
    } else if (v.label === '案例') {
      value = res.caseStudyHour || 0
    } else if (v.label === 'AI练') {
      value = res.aiTrainStudyHour || 0
    } else if (v.label === '其他') {
      value = res.otherStudyHour || 0
    }
    return {
      name: v.label,
      value
    }
  })
  statisticClassDistribution.value = [
    {
      tooltip: {
        trigger: 'item'
      },
      showEmptyCircle: true,
      center: [95, 'center'],
      radius: [60, 90],
      label: {
        show: false // 显示标签文本
      },
      labelLine: {
        show: false
      },
      dataInfo: pieInfoList.value
    }
  ]
}
</script>

<script>
export default {
  name: 'LearningPie'
}
</script>
<style lang="scss" scoped>
.learningPie {
  background-color: #fff;
  width: 400px;
  min-width: 400px;
  height: 262px;
  .content-container {
    width: 100%;
    height: 100%;
  }
}
</style>