<template>
  <div class="base-container">
    <div class="header-container">
      <span class="title">培训项目分布</span>
      <el-date-picker
        popper-class="DataDashboard__date-picker__template-dark"
        class="year-style"
        :editable="false"
        size="mini"
        v-model="projectYear"
        type="year"
        :clearable="false"
        align="center"
        value-format="yyyy"
        @change="handleChange"
      >
      </el-date-picker>
    </div>
    <div class="content-container chart-wrapper" :style="`height: ${height}px;`" v-loading="getLoadingStatus('LOADING_STATISTIC_CLASS_DISTRIBUTION')">
      <Charts
        chart-type="pie"
        :chart-data="statisticClassDistribution"
        template-style="dark"
        :colors="PIE_COLOR_LIST2"
        :chart-options="classDistributionOpts"
        :pie-radius="[0, 60]"
        ref="statisticClassDistributionRef"
      ></Charts>
    </div>
  </div>
</template>

<script setup>
import { fetchStatisticClassDistribution } from '@/fetch/dataDashboard'
import { ref, watch } from 'vue'
import { NOT_TRAINING_COURSE_TYPE, TRAINING_COURSE_TYPE } from '@/util/constants'
import { getLoadingStatus } from '@/util/utils'
import { useDataDashboard } from '../hooks/useDataDashboard'
import Charts from '@/components/charts/index.vue'
import { BASE_CLASS_COLOR, BASE_NON_CLASS_COLOR } from '../enum'
const props = defineProps({
  orgs: {
    type: Array
  },
  height: { type: Number }
})

const statisticClassDistributionRef = ref(null)
const { BAR_COLOR_LIST, currentYear, PIE_COLOR_LIST2, PIE_TOOLTIP_OPTION, watchOrgsCallback } = useDataDashboard({
  dom: statisticClassDistributionRef,
  props
})

const projectYear = ref(currentYear)

// 图表定定义配置项
const classDistributionOpts = {
  ...PIE_TOOLTIP_OPTION,
  legend: { show: false }
}
// 项目分布
const statisticClassDistribution = ref([])

const baseParams = {
  year: projectYear.value,
  orgId: props.orgs[props.orgs.length-1]
}
// 培训项目分布
const getStatisticClassDistribution = () => {
  fetchStatisticClassDistribution({ data: baseParams }).then((res) => {
    // 过滤出培训班/非培训班
    const classInfos = res.filter((row) => row.classTypeOne === TRAINING_COURSE_TYPE)
    const nonclassInfos = res.filter((row) => row.classTypeOne === NOT_TRAINING_COURSE_TYPE)
    const totalClassInfo = { key: 'totalClass', dataLabel: '培训班', value: 0 }
    const totalNonClassInfo = { key: 'totalNonClass', dataLabel: '非培训班', value: 0 }
    const colorsMap = new Map()

    const BASE_CLASS_COLOR_RGB = 'rgba(54,182,248,0.5)'
    colorsMap.set('培训班', BASE_CLASS_COLOR_RGB)
    const classSeries = classInfos.map((row) => {
      totalClassInfo.value += Number(row.classNum)
      colorsMap.set(row.classTypeTwoDesc, BASE_CLASS_COLOR)
      return {
        key: row.classTypeTwo,
        dataLabel: row.classTypeTwoDesc,
        label: { color: BASE_CLASS_COLOR },
        value: row.classNum,
        tooltip: { borderColor: BASE_CLASS_COLOR_RGB }
      }
    })

    const BASE_NON_CLASS_COLOR_RGB = 'rgba(54,248,176,0.5)'
    colorsMap.set('非培训班', BASE_NON_CLASS_COLOR_RGB)
    const nonClassSeries = nonclassInfos.map((row) => {
      totalNonClassInfo.value += Number(row.classNum)
      colorsMap.set(row.classTypeTwoDesc, BASE_NON_CLASS_COLOR)
      return {
        key: row.classTypeTwo,
        dataLabel: row.classTypeTwoDesc,
        label: { color: BASE_NON_CLASS_COLOR },
        value: row.classNum,
        tooltip: { borderColor: BASE_NON_CLASS_COLOR_RGB }
      }
    })

    const colorCallback = (data) => {
      return colorsMap.get(data.name)
    }

    const filterNoUserStatus = () => {
      if (totalClassInfo.value === 0 && totalNonClassInfo.value === 0) return []
      if (totalClassInfo.value === 0) return [totalNonClassInfo]
      if (totalNonClassInfo.value === 0) return [totalClassInfo]
      return [totalClassInfo, totalNonClassInfo]
    }
    statisticClassDistribution.value = [
      {
        id: 'establish',
        name: '项目分布',
        type: 'pie',
        label: { position: filterNoUserStatus()?.length === 1 ? 'center' : 'inside', color: '#fff', textBorderWidth: 0, textShadowColor: 'transparent', textBorderColor: 'transparent' },
        itemStyle: { color: colorCallback, borderWidth: 2, borderColor: '#000' },
        radius: [0, '45%'],
        dataInfo: filterNoUserStatus()
      },
      {
        id: 'detailClass',
        name: '项目分布',
        type: 'pie',
        label: { textBorderWidth: 0, textShadowColor: 'transparent', textBorderColor: 'transparent' },
        itemStyle: { color: colorCallback, borderWidth: 2, borderColor: '#000' },
        radius: ['46%', '80%'],
        dataInfo: [...classSeries, ...nonClassSeries]
      }
    ]
  })
}
// getStatisticClassDistribution()

const handleChange = () => {
  baseParams.year = projectYear.value
  baseParams.orgId = props.orgs[props.orgs.length - 1]
  getStatisticClassDistribution()
}
watchOrgsCallback(handleChange)
</script>
<script>
export default {
  name: 'DataDashboardClassDistribution'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';
</style>
