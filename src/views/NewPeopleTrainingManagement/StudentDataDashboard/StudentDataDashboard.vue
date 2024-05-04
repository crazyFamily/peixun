<template>
  <div class="dashboard-wrapper">
    <el-card class="search-card mt10">
      <el-form :model="queryForm" :rules="formRules" inline ref="querFormRef" label-width="50px">
        <el-form-item label="入职年月" label-width="80px" prop="entryDate">
          <el-date-picker
            class="year-style month-style"
            :editable="false"
            size="mini"
            value-format="yyyy-MM"
            placeholder="开始日期"
            type="month"
            v-model="queryForm.entryDateStart"
            :picker-options="startPickerOptions"
            :clearable="false"
            align="center"
            style="width: 120px;"
          >
          </el-date-picker>
          <span style="padding: 0 10px">至</span>
          <el-date-picker
            class="year-style month-style"
            :editable="false"
            size="mini"
            value-format="yyyy-MM"
            placeholder="结束日期"
            type="month"
            v-model="queryForm.entryDateEnd"
            :picker-options="endPickerOptions"
            :clearable="false"
            align="center"
            style="width: 120px;"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="机构" prop="orgIds">
          <DropdownZhOrg
            :style="{ width: '250px' }"
            :search="true"
            :list="orgList"
            @change="orgIdChange"
            valueField="orgId"
            labelField="orgName"
            ref="dropdownTreeRef"
          ></DropdownZhOrg>
        </el-form-item>
        <el-form-item label="条线" prop="lines" class="line-wrapper">
          <gc-select :options="BLGSTRIPLINE_OPTIONS" multiple collapse-tags v-model="queryForm.lines" placeholder="请选择条线" class="w-full" />
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryData">查询</el-button>
          <el-button @click="resetData">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <div class="dashboard-chart-wrapper" ref="chartRenderRef">
      <!-- 人员结构 -->
      <div class="chart-item user-structure-wrapper">
        <p class="title">
          <span class="title__menu"></span>
          人员结构占比
        </p>
        <div class="chart-container">
          <div class="chart-container-item">
            <Charts
              chart-type="pie"
              :colors="blueLineColors"
              :chart-options="createPieChartTitle('层级占比')"
              :chart-data="trainingUserLevel"
              ref="chart1Ref"
            ></Charts>
          </div>
          <div class="chart-container-item">
            <Charts
              chart-type="pie"
              :colors="blueLineColors"
              :chart-options="createPieChartTitle('条线占比')"
              :chart-data="trainingUserLine"
              ref="chart2Ref"
            ></Charts>
          </div>
        </div>
      </div>
      <!-- 人员年龄 -->
      <div class="chart-item user-age-wrapper">
        <p class="title">
          <span class="title__menu"></span>
          人员年龄占比
        </p>
        <div class="chart-container">
          <div class="chart-container-item">
            <Charts
              chart-type="pie"
              :colors="redLineColors"
              :chart-options="createPieChartTitle('基层及以下')"
              :chart-data="baseUserAgeByLevel"
              ref="chart3Ref"
            ></Charts>
          </div>
          <div class="chart-container-item">
            <Charts
              chart-type="pie"
              :colors="redLineColors"
              :chart-options="createPieChartTitle('中级干部')"
              :chart-data="middleUserAgeByLevel"
              ref="chart4Ref"
            ></Charts>
          </div>
        </div>
      </div>
      <!-- 参训通过率 -->
      <div class="chart-item success-status-wrapper">
        <p class="title">
          <span class="title__menu"></span>
          各机构线上培训营通过率及参训人数
        </p>
        <div class="chart-container">
          <Charts chart-type="lineBar" :colors="{ bar: BAR_BLUR_COLOR_LIST, line: ['#F7B500'] }" :chart-options="onlineChartOptions" :chart-data="onlineTrainingRate" ref="successChartRef"></Charts>
        </div>
      </div>
      <!-- 覆盖率 -->
      <div class="chart-item cover-status-wrapper">
        <p class="title">
          <span class="title__menu"></span>
          各机构线下培训营覆盖率
        </p>
        <div class="chart-container">
          <Charts chart-type="bar" :colors="BAR_BLUR_COLOR_LIST" :chart-options="offlineChartOptions" :chart-data="offlineTrainingRate" ref="coverChartRef"></Charts>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useTable } from '@/hooks/useTable'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'
import { useRecruitQryParam } from '../hooks/useNewPeopleTraining'
import { BLGSTRIPLINE_OPTIONS } from '../enum'
import Charts from '@/components/charts'
import store from '@/store'
import { CopyObj, HSL2RGB, uuid } from '@/util/utils'
import { fetchStatisticCaseStudy, fetchStatisticClassDistribution, fetchStatisticTotalStudy } from '@/fetch/dataDashboard'
import html2canvas from 'html2canvas'
import { useChart } from '@/components/charts/hooks/useChart'
import {
  fetchExportXrTrainingRateReport,
  fetchListOfflineTrainingRate,
  fetchListOnlineTrainingRate,
  fetchListTrainingUserLevel,
  fetchListTrainingUserLine,
  fetchListUserAgeByLevel
} from '@/fetch/newPeopleTrainingManagement'

const { BASE_OPTIONS } = useChart({})

const BAR_BLUR_COLOR_LIST = [
    {
    x: 0,
    y: 1,
    x2: 0,
    y2: 0,
    colorStops: [
      { offset: 0, color: '#0182DD' },
      { offset: 1, color: '#69DBFD' }
    ]
  }
]
const BAR_RED_COLOR_LIST = [
    {
    x: 0,
    y: 1,
    x2: 0,
    y2: 0,
    colorStops: [
      { offset: 0, color: '#F05E19' },
      { offset: 1, color: '#FFB164' }
    ]
  }
]

const pieChartOptions = {
  title: {
    text: '',
    top: 'center',
    left: 'center'
  },
  graphic: {
    type: 'text',
    left: 'center',
    top: 'center',
    style: { 
      text: '', 
      font: '14px Microsoft YaHei',
    }
  },
  legend: { show: false },
  tooltip: {
    trigger: 'item',
    formatter: ({ percent, value, name, seriesName, marker }, ticket, callback) => {
      return `
        ${name} <br/> 
        <p style="margin-top:5px;" ><span style="padding-right: 10px;">${marker}${value}</span> ${percent}%</p>
      `
    }
  }
}

const linebarChartOptions = {}

const chartOptions = {
  ...BASE_OPTIONS,
  grid: {
    left: '3%',
    right: '3%',
    bottom: '30%'
  },
  tooltip: {
    trigger: 'axis',
    formatter: (arr, ticket, callback) => {
      const name = arr[0]?.name || ''
      const list = []
      arr.forEach(row => {
        if(['completeRate', 'trainingRate'].includes(row.seriesId)) {
          list.push(`<p style="margin-top:5px;" ><span style="padding-right: 10px;">通过率：${row.marker}${row.value}%</span></p>`)
        } else {
          list.push(`<p style="margin-top:5px;" ><span style="padding-right: 10px;">报名人数：${row.marker}${row.value}</span></p>`)
        }
      })
      return `
        ${name} <br/> 
        ${list.join('')}
      `
    }
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      formatter: (v, i) => {
        const jsxDom = (value) => {
          const list = value.split('')
          return list.map((row) => `${row}\n`).join('')
        }
        return jsxDom(v)
      }
    }
  }
}

const onlineChartOptions = Object.assign({}, CopyObj(chartOptions), {
  yAxis: [
    {
      type: 'value',
      name: '通过率(%)',
      splitLine: {lineStyle: {}}
    },
    {
      type: 'value',
      name: '报名人数',
      splitLine: {lineStyle: {}}
    }
  ]})



const offlineChartOptions = {
  ...CopyObj(chartOptions),
  tooltip: {
    trigger: 'axis',
    formatter: (arr, ticket, callback) => {
      const name = arr[0]?.name || ''
      const list = []
      arr.forEach(row => {
        if(['completeRate', 'trainingRate'].includes(row.seriesId)) {
          list.push(`<p style="margin-top:5px;" ><span style="padding-right: 10px;">覆盖率：${row.marker}${row.value}%</span></p>`)
        } else {
          list.push(`<p style="margin-top:5px;" ><span style="padding-right: 10px;">报名人数：${row.marker}${row.value}</span></p>`)
        }
      })
      return `
        ${name} <br/> 
        ${list.join('')}
      `
    }
  },
}

const blueLineColors = ['#0177FD', '#6BBAFE', '#3492FD', '#4C88E3', '#3EC992', '#01A7FD', '#49B6BE', '#4C8EE3', '#3D5ED7', '#E5F1FE']
const redLineColors = ['#F05E19', '#FC9F7E', '#FCD0BC', '#FE98A7', '#D25A7F', '#FCC454', '#EC85A9', '#FC8D6F', '#F5CAD3', '#FDEEE8']

const baseParams = {
  orgIds: [],
  lines: [],
  currPage: 1,
  pageSize: 10,
  total: 0,
  entryDateStart: '',
  entryDateEnd: ''
}

const currentYear = new Date().getFullYear()

// 默认月逻辑：当前月-2，最小值为当前年01月
let currentMonth
if([0, 1].includes(new Date().getMonth())) {
  currentMonth = new Date().getMonth() + 1
} else {
  currentMonth = new Date().getMonth() - 1
}
currentMonth = String(currentMonth).padStart(2, '0')

baseParams.entryDateStart = `${currentYear}-01`
baseParams.entryDateEnd = `${currentYear}-${currentMonth}`

const { queryForm, dataRangeRules, query, reset, requiredHandle } = useTable(baseParams)
const formRules = {
  entryDate: [{
      required: true,
      validator: (rule, value, callback) => {
        if (!queryForm.entryDateStart || !queryForm.entryDateEnd) {
          return callback(new Error('请选择入职时间'))
        }
        return callback()
      },
      blur: 'change'
    }]
  }

const {
  initRecruitQryParam,
  annualChangeHandle,
  filterNodeMethod,
  isZhAdmin,
  orgList,
  orgOneNode,
  annualList,
  recruitNumList,
  recruitNumListAll,
  setNewYearData
} = useRecruitQryParam(queryForm)

initRecruitQryParam(true)

const orgIdChange = (keys) => {
  queryForm.orgIds = keys
}

const { startPickerOptions, endPickerOptions } = dataRangeRules('entryDateStart', 'entryDateEnd')

const createPieChartTitle = (title) => {
  const res = CopyObj(pieChartOptions)
  res.graphic.style.text = title
  return res
}

const formatParams = (params) => {
  const res = CopyObj(params)
  res.entryDateStart = `${res.entryDateStart}-01`
  res.entryDateEnd = `${res.entryDateEnd}-01`
  return res
}

// 学员层级人数占比统计
const trainingUserLevel = ref([])
const getListTrainingUserLevel = () => {
  fetchListTrainingUserLevel({ data: formatParams(queryForm) }).then((res) => {
    const dataInfo = res.map((row) => ({ key: uuid(), dataLabel: row.capLevelName, value: row.userNum }))
    const baseItem = {
      id: 'trainingUserLevel',
      name: '层级占比',
      dataInfo,
      radius: [40, 70],
      itemStyle: { borderWidth: 2, borderColor: '#fff' },
      label: {
        normal: {
          show: true
        }
      },
      labelLine: {
        show: true,
        length: 8,
        length2: 8
      }
    }
    trainingUserLevel.value = [baseItem]
  })
}
getListTrainingUserLevel()

const trainingUserLine = ref([])
const getListTrainingUserLine = () => {
  fetchListTrainingUserLine({ data: formatParams(queryForm) }).then((res) => {
    const dataInfo = res.map((row) => ({ key: row.blgStripLine, dataLabel: row.blgStripLineName, value: row.userNum }))
    const baseItem = {
      id: 'trainingUserLevel',
      name: '条线占比',
      dataInfo,
      radius: [40, 70],
      itemStyle: { borderWidth: 2, borderColor: '#fff' },
      label: {
        normal: {
          show: true
        }
      },
      labelLine: {
        show: true,
        length: 8,
        length2: 8
      }
    }
    trainingUserLine.value = [baseItem]
  })
}
getListTrainingUserLine()

// 根据能力层级查询年龄层占比-基层以及下
const baseUserAgeByLevel = ref([])
// 根据能力层级查询年龄层占比-中层
const middleUserAgeByLevel = ref([])
const getListUserAgeByLevel = () => {
  fetchListUserAgeByLevel({ data: { ...formatParams(queryForm), level: 1 } }).then((res) => {
    const dataInfo = res.map((row) => ({ key: uuid(), dataLabel: row.ageStage, value: row.userNum }))
    const baseItem = {
      id: 'baseUserAgeByLevel',
      name: '基层以及下',
      dataInfo,
      radius: [40, 70],
      itemStyle: { borderWidth: 2, borderColor: '#fff' },
      label: {
        normal: {
          show: true
        }
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 10
      }
    }
    baseUserAgeByLevel.value = [baseItem]
  })
  fetchListUserAgeByLevel({ data: { ...formatParams(queryForm), level: 2 } }).then((res) => {
    const dataInfo = res.map((row) => ({ key: uuid(), dataLabel: row.ageStage, value: row.userNum }))
    const baseItem = {
      id: 'middleUserAgeByLevel',
      name: '中级干部',
      dataInfo,
      radius: [40, 70],
      itemStyle: { borderWidth: 2, borderColor: '#fff' },
      label: {
        normal: {
          show: true
        }
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 10
      }
    }
    middleUserAgeByLevel.value = [baseItem]
  })
}
getListUserAgeByLevel()

//  各机构线上培训营通过率及参训人数
const onlineTrainingRate = ref([])
const getOnlineTrainingRate = () => {
  fetchListOnlineTrainingRate({ data: formatParams(queryForm) }).then((res) => {
    const completeRateItem = {
      id: 'completeRate',
      name: '线上培训营通过率',
      type: 'bar',
      dataInfo: [],
      markLine: {
        //取消开始结束标记（不显示箭头）
        symbol: 'none',
        data: [
          {
            //支持 average，min，max
            type: 'average',
            name: '全行平均通过率',
            yAxis: 0
          }
        ],
        label: {
          show: true,
          position: 'middle',
          color: 'red',
          formatter: ({ name, value }) => {
            return `${name}: ${Number(value.toFixed(2))}%`
          }
        },
        lineStyle: { type: 'dashed', color: 'red', width: 2 },
      },
      itemStyle: {
        normal: {
          borderRadius: [10, 10, 0, 0],
          color: ({ value }) => {
            // 这里要用下res的平均值
            if(value < Number(res[0]?.avgRate)) {
              return BAR_BLUR_COLOR_LIST[0]
            }
            return BAR_RED_COLOR_LIST[0]
          }
        }
      }
    }
    const userNumerItem = { id: 'userNum', name: '报名人数', type: 'line', dataInfo: [] }
    let selfOrgIndex = -1
    res.forEach((row, i) => {
      if(row.selfOrg === 'Y') {
        selfOrgIndex = i
      }
      completeRateItem.markLine.data[0].yAxis = Number(row.avgRate)
      completeRateItem.dataInfo.push({ key: row.orgId, dataLabel: row.orgName, value: row.completeRate })
      userNumerItem.dataInfo.push({ key: row.orgId, dataLabel: row.orgName, value: row.userNum })
    })

    onlineChartOptions.xAxis.axisLabel.color = (name, index, c) => {
      if(index === selfOrgIndex) return 'red'
      return '#000'
    }
    
    onlineTrainingRate.value = [completeRateItem, userNumerItem]
  })
}
getOnlineTrainingRate()

// 各机构线下营覆盖率统计
const offlineTrainingRate = ref([])
const OfflineTrainingParams = reactive({})
const getListOfflineTrainingRate = () => {
  fetchListOfflineTrainingRate({ data: formatParams(queryForm) }).then((res) => {
    const baseItem = {
      id: 'trainingRate',
      name: '线下培训营覆盖率',
      type: 'bar',
      dataInfo: [],
      markLine: {
        //取消开始结束标记（不显示箭头）
        symbol: 'none',
        data: [
          {
            //支持 average，min，max
            type: 'average',
            name: '全行平均线下覆盖率',
            yAxis: 0
          }
        ],
        label: {
          show: true,
          position: 'middle',
          color: 'red',
          formatter: ({ name, value }) => {
            return `${name}: ${Number(value.toFixed(2))}%`
          }
        },
        lineStyle: { type: 'dashed', color: 'red', width: 2 }
      },
      itemStyle: {
        normal: {
          borderRadius: [10, 10, 0, 0],
          color: ({ value }) => {
            // 这里要用下res的平均值
            if(value < Number(res[0]?.avgRate)) {
              return BAR_BLUR_COLOR_LIST[0]
            }
            return BAR_RED_COLOR_LIST[0]
          }
        }
      }
    }
    let selfOrgIndex = -1
    res.forEach((row, i) => {
      // baseItem.dataInfo.push({ key: row.orgId, dataLabel: row.orgName, value: Math.floor(Math.random() * 51) })
      // baseItem.dataInfo.sort((a,b) => b.value - a.value)
      baseItem.markLine.data[0].yAxis = Number(row.avgRate)
      baseItem.dataInfo.push({ key: row.orgId, dataLabel: row.orgName, value: row.completeRate })
      if(row.selfOrg === 'Y') {
        selfOrgIndex = i
      }
    })
    offlineChartOptions.xAxis.axisLabel.color = (name, index, c) => {
      if(index === selfOrgIndex) return 'red'
      return '#000'
    }
    offlineTrainingRate.value = [baseItem]
  })
}
getListOfflineTrainingRate()

const getList = () => {
  // 层级占比
  getListTrainingUserLevel()
  // 年龄占比
  getListUserAgeByLevel()
  // 条线占比
  getListTrainingUserLine()
  // 线上培训
  getOnlineTrainingRate()
  // 线下营
  getListOfflineTrainingRate()
}

const querFormRef = ref(null)
const queryData = () => {
  querFormRef.value.validate(v => {
    if(!v) return 
    query(getList)
  })
}

const dropdownTreeRef = ref(null)
const resetData = () => {
  reset()
  dropdownTreeRef.value.setValue([])
}

const chart1Ref = ref(null)
const chart2Ref = ref(null)
const chart3Ref = ref(null)
const chart4Ref = ref(null)
const successChartRef = ref(null)
const coverChartRef = ref(null)
const updateEchart = () => {
  chart1Ref.value?.updateChart()
  chart2Ref.value?.updateChart()
  chart3Ref.value?.updateChart()
  chart4Ref.value?.updateChart()
  successChartRef.value?.updateChart()
  coverChartRef.value?.updateChart()
}

const chartRenderRef = ref(null)
const downloadImg = (href) => {
  const a = document.createElement('a')
  a.setAttribute('download', '新人培养数据看板')
  a.href = href
  a.click()
}

const handleExport = () => {
  html2canvas(chartRenderRef.value, {
    width: chartRenderRef.value.offsetWidth,
    height: chartRenderRef.value.offsetHeight
  }).then(function (canvas) {
    downloadImg(canvas.toDataURL('image/png'))
  })

  fetchExportXrTrainingRateReport(formatParams(queryForm))
}

// 更新图表
watch(
  () => store.getters['app/getAsideCollapse'],
  (n) => {
    updateEchart()
  }
)
</script>
<script>
export default {
  name: 'StudentDataDashboard'
}
</script>

<style lang='scss' scoped>
.dashboard-wrapper {
  background-color: '#cdcdcd';
}

.search-card {
  :deep(.el-form > .el-form-item) {
    margin-right: 20px;
  }
}

.line-wrapper {
  width: 220px;
  :deep(.el-form-item__content) {
    width: calc(100% - 50px);
  }
}

.dashboard-chart-wrapper {
  margin-top: 10px;
  min-height: 50vh;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, auto);
  background-color: #f5f6fb;

  .chart-item {
    height: 220px;
    padding: 10px;
    padding-top: 5px;
    margin: 5px;
    background-color: #fff;
    box-sizing: border-box;
  }

  .chart-container {
    width: 100%;
    height: calc(100% - 20px);
    display: flex;
    justify-content: center;
    .chart-container-item {
      width: 50%;
    }
  }

  .success-status-wrapper {
    height: 450px;
    grid-area: 2/1/2/3;
  }
  .cover-status-wrapper {
    height: 450px;
    grid-area: 3/1/3/3;
  }
}
</style>