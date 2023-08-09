<template>
  <div class="CaseCenter__ActivityData__Activity">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="所属片区">
          <el-input
            v-model="queryForm.areaName"
            placeholder="请输入所属片区"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属一级分行/分中心">
          <el-input
            v-model="queryForm.subBranchName"
            placeholder="请输入所属一级分行/分中心"
          ></el-input>
        </el-form-item>
        <el-form-item label="案例信息">
          <el-input
            v-model="queryForm.trailInfo"
            placeholder="输入案例ID/名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="创建时间" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.startDate"
              type="date"
              placeholder="开始日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endDate"
              type="date"
              placeholder="结束日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="案例分享人">
          <el-input
          v-model="queryForm.shareUser"
            placeholder="输入分享人姓名/UM号"
          ></el-input>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="downCase" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        @sort-change="sortChange"
        ref="tablePagination"
      >
        <el-table-column slot="caseName" label="案例名称">
          <template slot-scope="scope">
            <span class="active">
              {{ scope.row.trailName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <span class="active" @click="checkInfo(scope.row)">查看明细</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 案例明细 -->
    <gc-model
      width="800px"
      title="案例明细"
     :visible.sync="caseInfoVisible"
      @close="caseInfoClose"
      @comfirm="caseInfoComfirm"
    >
      <div>
        <p>
          案例名称：<span class="active">{{ caseInfoForm.trailName }}</span>
        </p>
        <el-form :model="caseInfoForm" inline class="between mt20 mb20">
          <el-form-item label="姓名" class="mb0">
            <el-input
              v-model="caseInfoForm.umOrName"
              placeholder="输入姓名/UM号"
            ></el-input>
          </el-form-item>
          <div class="buttons">
            <el-button
              @click="queryCaseInfo"
              class="button-w80-h30"
              type="primary"
              >查询</el-button
            >
            <el-button @click="resetCaseInfo" class="button-w80-h30"
              >重置</el-button
            >
            <el-button @click="downCaseInfo" class="button-w80-h30"
              >导出</el-button
            >
          </div>
        </el-form>
        <table-pagination
          :list="caseInfoList"
          :tableList="caseInfoTableList"
          :queryForm="caseInfoForm"
          :getList="getCaseInfoList"
          ref="caseInfoRef"
        >
        </table-pagination>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { filterObj, resetObj } from '@/util/utils'
import {
  fetchListAreaOrg,
  fetchListToTrailRank,
  fetchExportTrailRankList,
  fetchHeroTrailWinningRecord
} from '@/fetch/caseCenter'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        areaName: '',
        subBranchName: '',
        trailInfo: '',
        shareUser: '',
        rankType: '',
        startDate: '',
        endDate: '',
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      list: [
        { type: 'selection' },
        { label: '序号', type: 'index' },
        { label: '案例ID', prop: 'trailId' },
        { slot: 'caseName' },
        { label: '排名', prop: 'rank', sortable: 'custom' },
        { label: '能量值', prop: 'powerValue' },
        { label: '分享人', prop: 'umName' },
        { label: '所属片区', prop: 'areaName' },
        { label: '所属一级分行/分中心', prop: 'subBranchName', width: '160' },
        { label: '岗位', prop: 'position' },
        {
          label: '创建人',
          prop: '',
          ctx: (row) => `${row.umName}(${row.umId})`
        }
      ],
      tableList: [],
      caseInfoVisible: false,
      caseInfoForm: {
        trailName: '',
        trailId: '',
        umOrName: '',
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      caseInfoList: [
        { type: 'index', label: '序号' },
        {
          label: '姓名',
          prop: 'umName',
          ctx: (row) =>
            `${row.umName ? `${row.umName}(${row.umId})` : row.umId}`
        },
        { label: '机构', prop: 'orgName' },
        { label: '点亮时间', prop: 'createdDate' },
        { label: '是否中奖', prop: 'awardName' }
      ],
      caseInfoTableList: [],
      areaList: [],
      branchList: []
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
      this.$refs.tablePagination.resetFilters()
      this.getList()
    },
    getList() {
      const data = filterObj(this.queryForm)
      fetchListToTrailRank({ data }).then((res) => {
        const { list, total } = res
        this.tableList = list
        this.queryForm.total = total
      })
    },
    downCase() {
      const data = filterObj(this.queryForm)
      fetchExportTrailRankList({ data })
    },
    checkInfo(row) {
      const { id, trailName } = row
      this.caseInfoForm.trailId = id
      this.caseInfoForm.trailName = trailName
      this.caseInfoVisible = true
    },
    caseInfoClose() {
      resetObj(this.caseInfoForm)
      this.caseInfoTableList = []
      this.caseInfoVisible = false
    },
    caseInfoComfirm() {
      this.caseInfoVisible = false
    },
    getCaseInfoList() {
      const data = filterObj(this.caseInfoForm)
      data.tip = 'Y'
      fetchHeroTrailWinningRecord({ data }).then((res) => {
        const { list, total } = res
        this.caseInfoTableList = list
        this.caseInfoForm.total = total
      })
    },
    queryCaseInfo() {
      this.caseInfoForm.currPage = 1
      this.caseInfoForm.pageSize = 10
      this.getCaseInfoList()
    },
    resetCaseInfo() {
      this.caseInfoForm.umOrName = ''
      this.caseInfoForm.currPage = 1
      this.caseInfoForm.pageSize = 10
      this.getCaseInfoList()
    },
    downCaseInfo() {
      const data = filterObj(this.caseInfoForm)
      data.tip = 'N'
      fetchHeroTrailWinningRecord(
        { data },
        { headers: { responseType: 'blob' } }
      )
    },
  getArea() {
      fetchListAreaOrg().then((res) => {
        const { areaList = [], branchList = [] } = res
        this.areaList = areaList
        this.branchList = branchList
      })
    },
    sortChange({ order }) {
      if (order === 'ascending') {
        this.queryForm.rankType = 'A'
      } else if (order === 'descending') {
        this.queryForm.rankType = 'D'
      } else {
        this.queryForm.rankType = ''
      }
      this.getList()
    }
  },
  mounted() {
    this.getArea()
  }
}
</script>

<style lang="scss" scoped></style>
