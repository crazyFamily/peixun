<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="员工机构" class="">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              busiType="LS"
              :left-show="false"
              :default-show="true"
              @setDataFinish="orgIdsFinish"
              ref="institutionRef"
            >
            </gc-institution>
          </div>
        </el-form-item>
        <el-form-item label="员工信息">
          <el-input class="w200" placeholder="员工编号/员工姓名" v-model="queryForm.employee"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="df">
        <div class="grade-chart">
          <div class="title">评分占比</div>
          <div class="chart" ref="chartRef"></div>
        </div>
        <div class="grade-star">
          <div class="star df" v-for="grade in gradeKeys" :key="grade.label">
            <div class="title relative">
              {{ grade.label }}
              <el-tooltip :visible-arrow="false" popper-class="bgf shadow-1" v-if="grade.label === '整体评分'"
                ><i class="el-icon-question active"></i>
                <span slot="content" class="fontColor">整体分数=五个评分维度取平均值</span>
              </el-tooltip>
            </div>
            <el-rate disabled :max="10" :value="handleStar(charData[grade.value])" class="ml40 mr10"></el-rate>
            <span v-if="charData[grade.value]">{{ charData[grade.value] }}分</span>
            <span v-else>暂无评分</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="exportHandle">
          <i class="instructor-icons__add__icon"></i>
          导出
        </span>
     </div>
      <table-pagination
        class="table-left"
        :list="detailColumn"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        v-loading="getLoadingStatus('LOADING_CASECENTER_SCORETYPE_REP')"
        ref="tablePaginationRef"
      >
      </table-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'CompScoreTypeReport'
}
</script>
<script setup>
import { ref, reactive } from 'vue'
// 按评分统计
import { resetObj, CopyObj, filterObj, getLoadingStatus } from '@/util/utils'
import { fetchScoreCaseStatisticsReport, fetchScoreChartData, fetchExportScoreCaseStatisticsReport } from '@/fetch/caseCenter'
import echarts from '@/plugins/echarts'
const props = defineProps({
  caseId: {
    type: Number,
    required: true
  }
})
const detailColumn = [
  {
    label: '员工姓名',
    prop: 'umName'
  },
  {
    label: '员工UM号',
    prop: 'umId'
  },
  {
    label: '员工机构',
    prop: 'orgName'
  },
  {
    type: 'tablecolumnfilters',
    label: '评价分数',
    prop: 'score',
    labelKey: 'scoreList',
    list: [
      { label: '1-2', value: '1-2' },
      { label: '2-4', value: '2-4' },
      { label: '4-6', value: '4-6' },
      { label: '6-8', value: '6-8' },
      { label: '8-10', value: '8-10' }
    ]
  },
  {
    label: '评价时间',
    prop: 'assessTime'
  },
  {
    label: '评价内容',
    prop: 'content',
    width: '220px',
    'show-overflow-tooltip': false
  }
]
const tableList = ref([])
const queryForm = reactive({
  id: '',
  orgId: '',
  orgIds: [],
  employee: '',
  scoreList: [],
  // 当前页
  currPage: 1,
  // 每页条数
  pageSize: 10,
  // 数据总量
  total: 0
})
let cacheOrgIds = []
let chart = null
let charData = ref({})
// 评分 key 数组
const gradeKeys = [
  {
    label: '场景典型',
    value: 'contentScore'
  },
  {
    label: '挑战充分',
    value: 'elementScore'
  },
  {
    label: '案例撰写',
    value: 'fabricationScore'
  },
  {
    label: '干法有效',
    value: 'enlightenmentScore'
  },
  {
    label: '推荐指数',
    value: 'npsScore'
  },
  {
    label: '整体评分',
    value: 'caseScore'
  }
]
const orgIdsFinish = () => {
  queryForm.id = props.caseId
  cacheOrgIds = CopyObj(queryForm.orgIds)
  query()
}
const query = () => {
  queryForm.currPage = 1
  getList()
  getChartData()
}
const getList = async () => {
  let data = filterObj(queryForm)
  data.orgId = data.orgIds?.[1]
  const { total, list } = await fetchScoreCaseStatisticsReport({ data })
  queryForm.total = total
  tableList.value = list
}
const exportHandle = async () => {
  let data = queryForm
  data.orgId = data.orgIds?.[1]
  await fetchExportScoreCaseStatisticsReport({ data })
}
const getChartData = async () => {
  let data = queryForm
  data.orgId = data.orgIds?.[1]
  charData.value = await fetchScoreChartData({ data })
  renderChart()
}
const chartRef = ref(null)
const renderChart = () => {
  const data = charData.value.scoreGroup || []
  data.forEach(v => {
    v.name = v.scoreRegion + '分'
    v.value = v.scoreUserNum
  })
  chart = chart || (chart = echarts.init(chartRef.value))
  chart.setOption({
    legend: {
      orient: 'vertical',
     right: 10,
      top: 22,
      bottom: 20,
      selectedMode: false,
      formatter(value) {
        const item = data.find(v => v.name === value)
        return [`{text|${value}}`, `{line|}`, `{percentage|${item.rate}}`, `${item.scoreUserNum}人`].join('')
      },
      textStyle: {
        rich: {
          text: {
            width: 40
          },
          line: {
            color: 'red',
            width: 0,
            height: 20,
            borderWidth: 1,
            borderColor: '#7d8292'
          },
          percentage: {
            width: 60,
            padding: [0, 0, 0, 20]
          }
        }
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['26%', '50%'],
        label: {
          position: 'center',
          formatter: `评分人数\n{personnel|${charData.value.scoreNum}人}`,
          rich: {
            personnel: {
              fontSize: 20,
              height: 30
            }
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        data
      }
    ]
  })
}
const tablePaginationRef = ref(null)
const institutionRef = ref(null)
const reset = () => {
  resetObj(queryForm, {
    currPage: 1,
    pageSize: 10,
    total: 0,
    id: props.caseId,
    orgIds: cacheOrgIds
  })
  tablePaginationRef.value.resetFilters()
  institutionRef.value.createTreeData()
}
const handleStar = num => {
  if (!num) return num
  const min = Math.floor(num)
  const float = num - min
  return min + (float < 0.5 ? 0 : 0.5)
}
</script>
<style lang="scss" scoped>
.chart {
  width: 400px;
  height: 200px;
}
.grade-star {
  margin: 20px 0 0 100px;
  .star {
    margin-top: 15px;
  }
  .relative .el-icon-question {
    position: absolute;
    right: -18px;
    top: 3px;
  }
}
</style>
