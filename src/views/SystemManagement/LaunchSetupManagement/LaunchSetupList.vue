<template>
  <div>
    <!-- 搜索框 -->
    <el-card class="search-card more-line">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item>
          <gc-select
            label="开关类型"
            :options="functionNameOptions"
            v-model="queryForm.functionType"
          />
        </el-form-item>
        <el-form-item label="开关名称">
          <el-input v-model="queryForm.functionName"></el-input>
        </el-form-item>
        <el-form-item label="年份">
          <el-date-picker
            v-model="queryForm.searchYear"
            placeholder="选择年份"
            :clearable="true"
            type="year"
            popper-class="date-picker"
            value-format="yyyy"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 表格内容框 -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="editRow('add')">
          <i class="instructor-icons__add__icon"></i>新增
        </span>
        <span class="instructor-icons__download" @click="exportData">
          <i class="instructor-icons__download__icon"></i>导出
        </span>
      </div>
      <table-pagination
        :list="columns"
        :tableList="listData"
        :queryForm="queryForm"
        :getList="getList"
        :page-sizes="pageSizes"
        :vLoading="listDataLoading"
        ref="tableRef"
      >
        <template v-slot:index>
          <el-table-column width="64" prop="functionName" label="序号">
            <template slot-scope="scope">{{(queryForm.currPage -1) * queryForm.pageSize + scope.$index + 1}}</template>
          </el-table-column>
        </template>
        <template v-slot:functionName>
          <el-table-column min-width="110" prop="functionName" label="名称">
            <template slot-scope="scope">
              <span
                style="color:#fd6720;cursor: pointer;"
                @click="editRow('view', scope.row)"
              >{{scope.row.functionName}}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="操作" min-width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              placement="left"
              :visible-arrow="false"
              popper-class="bgf shadow-1"
            >
              <div slot="content" class="tooltip__operation">
                <!-- <span class="active" @click="editRow('view', scope.row)">查看</span> -->
                <span class="active" @click="editRow('edit', scope.row)">编辑</span>
                <!-- <span class="active">生效</span>
                <span class="active">失效</span> -->
                <span class="active" @click="deleteRow(scope.row)">删除</span>
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          <!-- </template> -->
            <!-- <span class="active mr20" @click="deleteRow(scope.row)">
                  <el-tooltip content="删除" popper-class="icon-popper">
                      <i class="operation__download"></i>
                  </el-tooltip>
            </span>-->
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>
<script>
import { addAllowKeepAlive, handleExport, renderName, customHint } from '@/util/utils'
import {
  fetchListFunctionSwitch,
  fetchExportFunctionSwitch,
  fetchListFunctionName,
  fetchRemoveFunction
} from '@/fetch/launchSetupManagement'
// const optionAll = { label: '全部', value: '全部' }
const optionAll = {  }
export default {
  data() {
    return {
      stateOptions: [
        { label: '全行', value: '01' },
        { label: '指定架构', value: '02' },
        { label: '不启用', value: '03' },
      ],
      pageSizes: [10, 20, 50],
      functionNameOptions: [],
      functionNameLoading: false,
      queryForm: {
        // 年份
        searchYear: String(new Date().getFullYear()),
        // 类型
        functionType: '',
        functionName: '', // UM号或者姓名
        total: 0,
        currPage: 1,
        pageSize: 10,
        tip: 'Y',
      },
      columns: [
        { label: '序号', width: '64', type: 'index', slot: 'index' },
        {
          label: '名称',
          prop: 'functionName',
          width: '140',
          type: 'component',
          slot: 'functionName',
        },
        {
          label: '类型',
          width: '140',
          prop: 'functionTypeName'
        },
        { label: '架构范围', prop: 'lineAndOrgNameAll', width: '250px' },
        { label: '开始日期', prop: 'startDate', width: '100px' },
        { label: '结束日期', prop: 'endDate', width: '100px' },
        { label: '创建时间', prop: 'createdDate', width: '150px' },
        { 
          label: '创建人', 
          prop: 'createdBy', 
          width: '150px',
          formatter: (row) => renderName(row.createdByName, row.createdBy)
        },
        { label: '更新时间', prop: 'updatedDate', width: '150px' },
        { 
          label: '更新人', 
          prop: 'updatedBy', 
          width: '150px',
          formatter: (row) => renderName(row.updatedByName, row.updatedBy)
        },
        { label: '状态', prop: 'functionStatusName', width: '120px' },
      ],
      listData: [],
      listDataLoading: false,
    }
  },
  methods: {
    // 加载功能名称(筛选下拉)
    async loadFunctionName(value) {
      const res = await fetchListFunctionName()
      const optionsArr = res.map(m => ({ value: m.keyCode, label: m.keyValue }))
      this.functionNameOptions = optionsArr
    },
    async getList() {
      this.listDataLoading = true
      const params = { request: this.queryForm }
      try {
        const res = await fetchListFunctionSwitch(params)
        if (res) {
          this.queryForm.total = res.total
          this.listData = res.list
        }
        this.listDataLoading = false
      } catch (e) {
        this.listDataLoading = false
      }
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset() {
      // this.queryForm.functionName = ''
      this.queryForm = this.$options.data.call(this).queryForm
      this.queryForm.currPage = 1
      this.getList()
    },
    editRow(btn, row = {}) {
      const params = row
      if (typeof btn === 'string') {
        btn = { pageState: btn }
      }
      addAllowKeepAlive('/LaunchSetupForm')
      this.$router.push({
        name: '功能开关编辑',
        params: {
          ...btn,
          ...row,
        },
      })
    },
    async deleteRow(row) {
      const USABLE = '01'
      if(row.functionStatus === USABLE) return this.$message.warning('启用状态不允许删除')
      await customHint('是否确认需要删除当前开关', '提示', '取消')
      await fetchRemoveFunction({functionId: row.functionId})
      this.$message.success('已删除')
      this.getList()
    },
    exportData() {
      const data = { request: { ...this.queryForm, tip: 'N' } }
      fetchExportFunctionSwitch(data)
    },
  },
  created() {
    console.log('xf-LaunchSetupList:created')
    this.getList()
    this.loadFunctionName()
  },
  activated() {
    console.log('xf-LaunchSetupList:activated')
    this.getList()
  },
}
</script>