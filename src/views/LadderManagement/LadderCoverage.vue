<template>
  <div class="LadderManagement__LadderCoverage">
    <el-card class="search-form-card">
      <el-form :model="pageForm" inline>
        <el-form-item label="岗位">
          <el-cascader
            ref="cascaderArr"
            style="width:200px;"
            popper-class="LadderManagement__LadderCoverage__cascader"
            clearable
            v-model="pageForm.courseInfo"
            @change="channelTypesChange"
            :options="planOptions.channelTypes"
            :props="{
              label: 'dataValue',
              value: 'dataEncode',
              children: 'childPlanDict'
            }"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card v-if="showContent" class="mt10">
      <div class="content-list">
        <div class="tip fz16">覆盖情况</div>
        <div class="coverage border-line">
          <el-form class="clearfix" :model="queryForm" inline>
            <el-form-item class="mr80" label="机构">
              <gc-institution
                orgUrl="/fn/user/selectFixedTree"
                v-model="queryForm.orgIds"
                :busiType="$store.state.userInfo.blgStripLine"
                :left-show="false"
                :default-show="true"
                :otherParams="{isAll: 'Y'}"
                @change="orgChangeHandle"
                @setDataFinish="orgIdsFinish"
                ref="institutionRef"
              >
              </gc-institution>
            </el-form-item>
            <el-form-item label="入岗时间">
              <time-chunk v-model="queryForm.date"></time-chunk>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="queryForm.isShowSecondFH">查看二级分行</el-checkbox>
            </el-form-item>
            <el-form-item class="fr mb20 m0">
              <el-button @click="queryCoverageList" class="button-w80-h30" type="primary">查询</el-button>
              <el-button @click="resetCoverage" class="button-w80-h30">重置</el-button>
            </el-form-item>
          </el-form>
          <div>
            <div class="right">
              <div class="menu-right">
                <span class="instructor-icons__upload" @click="exportTable"><i class="instructor-icons__download__icon"></i>导出表格</span>
                <span class="instructor-icons__upload" @click="openDetailModel"><i class="instructor-icons__download__icon"></i>导出明细</span>
              </div>
              <table-pagination
                v-loading="loadingCoverage"
                height="400"
                :list="list"
                :tableList="tableList"
                :queryForm="queryForm"
                :getList="getList"
                border
                :cell-class-name="hideRowBoder"
                :header-cell-class-name="hideRowBoder"
                @hook:mounted="backUpWidth"
                ref="tablePagination"
              >
                <template v-for="item in LADDER_COVERAGE_TABS">
                  <el-table-column align="center" :label="item.label" :key="item.name">
                    <el-table-column v-for="(subItem, subIndex) in headerList" :label="subItem.label" :prop="subItem.prop" :key="subIndex">
                      <template slot-scope="scope">
                        <span :class="{ 'hide-boder': subItem.prop !== 'CoverRateStr' }">{{
                          scope.row[item.name.toLowerCase() + subItem.prop]
                        }}</span>
                      </template>
                    </el-table-column>
                  </el-table-column>
                </template>
              </table-pagination>
            </div>
          </div>
        </div>
        <div class="change__trend mt20">
          <div class="tip fz16">变化趋势</div>
          <el-row class="border-line">
            <el-form ref="form" :model="queryForm" :inline="true">
              <el-form-item label="培训子系列">
                <el-select @change="navTabChangeHandle" style="width:200px;" v-model="tabActive" placeholder="请选择">
                  <el-option v-for="item in LADDER_COVERAGE_TABS" :key="item.name" :label="item.label" :value="item.name"> </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-row v-loading="loadingChart">
              <ChangeChart class="chart" @change-datazoom="changeDatazoom" ref="echartsCahrt" :coverSituations="coverSituations" :months="months" />
            </el-row>
          </el-row>
        </div>
      </div>
    </el-card>
    <div v-show="!showContent" class="no_data">
      <img src="@/assets/images/no-data.png" alt="" />
      <p>请选择要查询的岗位</p>
    </div>
    <!-- 导出明细 -->
    <gc-model
      title="导出明细"
      :visible="detailVisible"
      width="400px"
      @close="detailVisible = false"
      @comfirm="detailExportComfirm"
      @cancel="detailVisible = false"
    >
      <span class="ml10 fz14">选择需要导出的培训类型明细</span>
      <el-checkbox-group v-model="selectExportDetail">
        <el-checkbox class="block ml80" v-for="item in LADDER_COVERAGE_TABS" :key="item.name" :label="item.name">{{ item.label }}明细</el-checkbox>
      </el-checkbox-group>
    </gc-model>
  </div>
</template>

<script>
import { CopyObj, filterObj, getCurrentTime, formatDate } from '../../util/utils'
import { fetchCoverSituation, fetchVariationTrend, fetchExportCoverSituation, fetchExportTrainDetails } from '@/fetch/ladderManagement'
import ChangeChart from './compontes/ChangeChart'
import { fetchListPlanDict } from '@/fetch/public'
import { LADDER_COVERAGE_TABS } from '@/util/constants'
export default {
  name: 'LadderCoverage',
  components: {
    ChangeChart
  },
  data() {
    return {
      pageForm: {},
      queryForm: {
        date: {
          start: getCurrentTime().slice(0, -2) + '01',
          end: getCurrentTime()
        },
        blgStripLine: this.$store.state.userInfo.blgStripLine,
        currPage: 1,
        pageSize: 10,
        isShowSecondFH: false
      },
      tabActive: 'SG',
      defaultTime: {
        start: new Date().getFullYear() - 1 + '-01-01',
        end: getCurrentTime()
      },
      showContent: false,
      queryOrgIds: [],
      list: [
        {
          label: '单位',
          prop: 'lateFixNodeName',
          width: '226'
        },
        {
          label: '归属区域',
          prop: 'treeZoneName',
          width: '100'
        }
      ],
      headerList: [
        {
          label: '入岗人数',
          prop: 'JobNum',
          width: '90'
        },
        {
          label: '参训人数',
          prop: 'CultivateNum',
          width: '90'
        },
        {
          label: '覆盖率',
          prop: 'CoverRateStr',
          width: '80'
        }
      ],
      tableList: [],
      planOptions: [],
      LADDER_COVERAGE_TABS,
      statistics: {},
      coverSituations: [],
      months: [],
      loadingCoverage: false,
      loadingChart: false,
      detailVisible: false,
      selectExportDetail: []
    }
  },
  methods: {
    backUpWidth() {
      this.$refs.tablePagination.getOriginTableRef().columns.forEach(v => {
        v.backWidth = v.realWidth || v.width || v.minWidth
      })
    },
    hideRowBoder(row) {
      if (['JobNum', 'CultivateNum'].includes(row.column.property)) {
        return 'hide-boder'
      }
    },
    openDetailModel() {
      this.selectExportDetail = []
      this.detailVisible = true
    },
    detailExportComfirm() {
      if (!this.selectExportDetail.length) {
        this.$message.warning('请选择需要导出的培训类型明细')
        return
      }
      for (let i = 0; i < this.selectExportDetail.length; i++) {
        this.exportTableDetail(this.selectExportDetail[i])
      }
      this.detailVisible = false
    },
    changeDatazoom() {
      let startTimeArr = this.defaultTime.start.split('-')
      // 当开始年份为2018年时，设置成最小查询时间为2018-05-01，查询数据，当上一次查询年份为2018年时不需要发请求
      if (startTimeArr[0] === '2018' && startTimeArr[1] === '05') return
      this.defaultTime.end = formatDate(startTimeArr[0] - 1 + '-12-31')
      if (startTimeArr[0] === '2019') {
        this.defaultTime.start = '2018-05-01'
      } else {
        this.defaultTime.start = formatDate(startTimeArr[0] - 1 + '-' + startTimeArr[1] + '-01')
      }
      this.getChangeTrend()
    },
    orgChangeHandle(val) {
      this.queryForm.orgName = val
    },
    // 级联选择框 change 事件
    channelTypesChange(data) {
      ;[this.pageForm.channelType, this.pageForm.keyJobs] = data
      if (data.length) {
        this.pageForm.keyJobsName = this.$refs.cascaderArr.getCheckedNodes()?.[0].label
        if (this.showContent) {
          this._resetData()
        }
        this.showContent = true
        this.getChangeTrend()
      } else {
        this.pageForm.keyJobsName = ''
        this._resetData()
      }
    },
    queryCoverageList() {
      this.queryForm.currPage = 1
      this.getList()
    },
    resetCoverage() {
      this.queryForm = this.$options.data.call(this).queryForm
      this.$refs.tablePagination.resetFilters()
      this.$refs.tablePagination.getOriginTableRef().columns.forEach(v => {
        v.width = v.backWidth
      })
      this.$refs.tablePagination.getOriginTableRef().store.scheduleLayout()
      this.$refs.institutionRef.createTreeData()
    },
    resetChart() {
      this.defaultTime = this.$options.data.call(this).defaultTime
      this.$refs.echartsCahrt.resetData()
    },
    navTabChangeHandle() {
      this.resetChart()
      this.getChangeTrend()
    },
    _resetData() {
      this.tabActive = this.$options.data.call(this).tabActive
      this.resetChart()
      this.resetCoverage()
      this.showContent = false
    },
    // 查询变化趋势图表数据
    getChangeTrend() {
      this.loadingChart = true
      let request = { ...this.queryForm }
      request.date = { ...this.defaultTime }
      request = this._formatSendParams(request)
      Reflect.deleteProperty(request, 'orgId')
      fetchVariationTrend(request)
        .then(res => {
          const { months, coverSituations } = res || {}
          this.coverSituations = coverSituations || []
          this.months = months || []
        })
        .finally(() => {
          this.loadingChart = false
        })
    },
    getList() {
      this.loadingCoverage = true
      let request = this._formatSendParams(this.queryForm)
      fetchCoverSituation(request)
        .then(res => {
          const { list, statistics } = res || {}
          this.tableList = list?.list || []
          this.queryForm.total = list?.total
          this.statistics = statistics
        })
        .finally(() => {
          this.loadingCoverage = false
        })
    },
    orgIdsFinish(val) {
      this.queryOrgIds = CopyObj(this.queryForm.orgIds)
      this.getList()
    },
    exportTable() {
      let request = this._formatSendParams(this.queryForm)
      fetchExportCoverSituation(request)
    },
    exportTableDetail(tips) {
      let request = this._formatSendParams(this.queryForm)
      request.tips = tips
      fetchExportTrainDetails(request)
    },
    // 格式化发送数据
    _formatSendParams(params) {
      params.startDate = params.date.start
      params.endDate = params.date.end
      params.channelType = this.pageForm.channelType
      params.keyJobs = this.pageForm.keyJobs
      params.keyJobsName = this.pageForm.keyJobsName
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      data.tips = this.tabActive
      data.isShowSecondFH = data.isShowSecondFH ? 'Y' : 'N'
      Reflect.deleteProperty(data, 'orgIds')
      Reflect.deleteProperty(data, 'courseInfo')
      Reflect.deleteProperty(data, 'date')
      return data
    },
    format(percentage) {
      return `覆盖率\n${percentage}%`
    },
    async getPlanOptions() {
      let data = await fetchListPlanDict({
        line: this.$store.state.userInfo.blgStripLine,
        type: '01001'
      })
      this.planOptions = data
    }
  },
  mounted() {
    this.getPlanOptions()
  }
}
</script>
<style lang="scss" scoped>
.LadderManagement__LadderCoverage {
  :deep(.el-table th:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
  :deep(.general__table) {
    border: 0 none;
  }
  :deep(.el-table) {
    .hide-boder {
      border-right: 0 none;
    }
  }
  :deep(.el-table th:not(:first-child):before) {
    position: initial;
  }
  :deep(.el-table td:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
  .content-list {
    .tip {
      color: #7d8292;
    }
    .border-line {
      border: 1px solid #e4e7ed;
      padding: 15px;
      border-radius: 4px;
    }
    .chart {
      width: 100%;
      height: 400px;
    }
  }
  .no_data {
    text-align: center;
    width: 100%;
    height: 100%;
    img {
      margin-top: 200px;
    }
    p {
      color: #b4b6bc;
      font-size: 16px;
      margin-left: 16px;
    }
  }
  :deep(.block) {
    display: block;
  }
}
.LadderManagement__LadderCoverage__cascader {
  .el-radio__inner {
    top: -18px;
    left: -19px;
    border-radius: 0;
    border: 0;
    width: 170px;
    height: 34px;
    background-color: transparent;
    cursor: pointer;
    box-sizing: border-box;
    position: absolute;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: transparent;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border: 0 none;
  }
  .el-radio__input.is-checked .el-radio__inner::after {
    width: 0;
    height: 0;
    background-color: #fff;
  }
}
</style>