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
          <el-input
            class="w200"
            placeholder="员工编号/员工姓名"
            v-model="queryForm.employee"
          ></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="between-noc">
        <div>
          <div class="title fz24">学习情况</div>
          <div class="learn-condition" ref="learnCondition"></div>
        </div>
        <div>
          <div class="title fz24">学习完成率</div>
          <div class="learn-percentage" ref="learnPercentage"></div>
        </div>
        <div class="relative">
          <div class="title fz24">学习时长</div>
          <div class="learn-time__minute">
            <span class="fz24 mr20">{{
              chartData.convertTotalStudyDuration
            }}</span>
            <span>分钟</span>
          </div>
          <div class="learn-time" ref="learnTime"></div>
          <div class="learn-time__duration">
            当日时长
            <span>{{ chartData.convertTodayStudyDuration }}</span>
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
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import { resetObj, handleBlob, CopyObj, jsonHeaders } from '@/util/utils'
import { httpService } from './caseReportUtils'
import echarts from '@/plugins/echarts'
export default {
  // 按案例题统计
  name: 'CompCaseTypeReport',

  props: {
    caseId: {
      type: [Number, null],
      required: true
    }
  },

  data() {
    return {
      list: [
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
          label: '案例编号',
          prop: 'caseId'
        },
        {
          label: '案例名称',
          prop: 'caseName'
        },
        {
          label: '分享人',
          prop: 'shareUserName'
        },
        {
          label: '案例时长(分钟)',
          width: '120',
          prop: 'convertCaseDuration'
        },
        {
          label: '进度',
          prop: 'progress',
          width: '70'
        },
        {
          type: 'tablecolumnfilters',
          label: '案例学习状态',
          prop: 'caseStatusStr',
          labelKey: 'studyStatus',
          radio: true,
          list: [
            { label: '未完成', value: '1' },
            { label: '已完成', value: '2' }
          ],
          width: '110'
        },
        {
          label: '学习完成时间',
          prop: 'firstFinishedDateStr',
          width: '140'
        },
        {
          label: '学习累计时长(分钟)',
          width: '140',
          prop: 'convertLearnTime'
        },
        {
          label: '评分',
          width: '70',
          prop: 'score'
        }
      ],
      tableList: [],
      queryForm: {
        id: '',
        orgId: '',
        orgIds: [],
        studyStatus: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      cacheOrgIds: [],
      learnCondition: null,
      learnPercentage: null,
      learnTime: null,
      chartData: {}
    }
  },

  components: {},

  computed: {},

  methods: {
    orgIdsFinish() {
      this.queryForm.id = this.caseId
      this.cacheOrgIds = CopyObj(this.queryForm.orgIds)
      this.query()
    },
    // 执行查询
    query() {
      this.queryForm.currPage = 1
      this.getList()
      this.getChartData()
    },
    // 表单重置
    reset() {
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10,
        total: 0,
        id: this.caseId,
        orgIds: this.cacheOrgIds
      })
      this.$refs.tablePagination.resetFilters()
      this.$refs.institutionRef.createTreeData()
    },
    // 拉取数据
    getList() {
      let data = this.queryForm
      data.orgId = data.orgIds?.[1]
      httpService('/fn/caseCenter/case/caseStatisticsReport', {
        data
      }).then((res) => {
        const { total, list } = res
        this.queryForm.total = total
        this.tableList = list
      })
    },
    // 导出
    exportHandle() {
      let data = this.queryForm
      data.orgId = data.orgIds?.[1]
      httpService(
        '/fn/caseCenter/case/exportCaseStatisticsReport',
        { data },
        { headers: { responseType: 'blob' }, allRes: true }
      ).then((res) => {
        if (res.data.type === 'application/json') {
          const reader = new FileReader()
          const that = this
          reader.onload = function (event) {
            var content = reader.result //内容就在这里
            that.$message.error(JSON.parse(content).msg)
          }
          reader.readAsText(res.data)
        } else {
          handleBlob(res)
        }
      })
    },
    // 获取图表数据
    getChartData() {
      let data = this.queryForm
      data.orgId = data.orgIds?.[1]
      this.$axios
        .post('/fn/caseCenter/case/caseChartData', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.chartData = data
            this.renderEcherts()
          }
        })
    },
    // 渲染图表
    renderEcherts() {
      const learnCondition =
        this.learnCondition ||
        (this.learnCondition = echarts.init(this.$refs.learnCondition))
      learnCondition.setOption({
        grid: {
          top: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          show: false
        },

        yAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: ['学习完成人数', '学习人数']
        },

        series: [
          {
            type: 'bar',
            barWidth: 24,
            label: {
              show: true,
              position: 'right'
            },
            data: [this.chartData.studyFinishNum, this.chartData.studyUserNum]
          }
        ]
      })
      const learnPercentage =
        this.learnPercentage ||
        (this.learnPercentage = echarts.init(this.$refs.learnPercentage))
      learnPercentage.setOption({
        series: {
          type: 'gauge',
          splitNumber: 4,
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            distance: 0
          },
          anchor: {
            show: false
          },
          progress: {
            show: true
          },
          data: [parseInt(this.chartData.studyFinishRate) || 0],

          axisLabel: {
            distance: 0,
            formatter(value) {
              switch (value) {
                case 25:
                  return '{a1|差}'
                case 50:
                  return '{a2|中}'
                case 75:
                  return '{a3|良}'
                case 100:
                  return '{a4|优}'
                default:
                  return
              }
            },
            rich: {
              a1: {
                color: '#000',
                padding: [70, 0, 0, 0]
              },
              a2: {
                color: '#000',
                padding: [14, 60, 0, 0]
              },
              a3: {
                color: '#000',
                padding: [24, 20, 60, 0]
              },
              a4: {
                color: '#000',
                padding: [0, -10, 70, 0]
              }
            }
          },

          detail: {
            formatter(value) {
              return value + '%'
            },
            fontSize: 24
          }
        }
      })
      const learnTime =
        this.learnTime || (this.learnTime = echarts.init(this.$refs.learnTime))
      learnTime.setOption({
        grid: {
          top: '30%',
          left: '0%',
          bottom: '30%',
          containLabel: true
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br />{c}'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          data: this.chartData.cumulativeTimeDateList.map((v) => v.date)
        },

        yAxis: {
          type: 'value',
          show: false
        },
        series: [
          {
            name: 'Line 1',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8
            },
            emphasis: {
              focus: 'series'
            },
            data: this.chartData.cumulativeTimeDateList.map(
              (v) => v.conCumulativeTime
            )
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.learn-condition {
  width: 400px;
  height: 180px;
}
.learn-percentage {
  width: 200px;
  height: 180px;
}
.learn-time {
  width: 300px;
  height: 180px;
  &__minute {
    position: absolute;
    top: 25%;
    left: 20%;
  }
  &__duration {
    position: absolute;
    left: 10%;
    bottom: 10%;
  }
}
</style>
