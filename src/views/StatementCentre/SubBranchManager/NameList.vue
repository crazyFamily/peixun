<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="参训年份" prop="year">
          <gc-select :options="yearOptions" v-model="queryForm.year" :clearable="false" class="w-150" />
        </el-form-item>
        <el-form-item label="员工归属">
          <gc-institution
            v-model="queryForm.blgStripLine"
            :leftShow="false"
            :default-show="false"
            busiType="LS"
            :fetchParams="{ module: CLASS_MODULE }"
            :otherParams="{ module: CLASS_MODULE }"
            ref="institutionRef"
          />
        </el-form-item>
        <el-form-item>
          <el-form-item label="入岗时间">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateJobStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="至" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateJobEnd"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form-item>
        <el-form-item label="员工信息">
          <gc-input placeholder="员工编号/员工姓名" v-model.trim="queryForm.empName"></gc-input>
        </el-form-item>
        <div class="buttons">
          <el-button @click="queryDataList" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetDataList" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__upload" @click="exportDataList"><i class="instructor-icons__download__icon"></i>导出</span>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        v-loading="getLoadingStatus('LOADING_BRANCH_USERNAME')"
        ref="tablePagination"
      />
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { fetchQueryBranchUserPage, fetchExportBranchUserPage } from '@/fetch/statementCentre'
import { useSubBranchManager } from '../hooks/useSubBranchManager'
import { getLoadingStatus } from '@/util/utils'
import { CLASS_MODULE } from '../enum'

const baseQueryForm = {
  blgStripLine: [],
  blgOrgId: '', // 所属机构编号

  year: '', // 参训年份
  dateJobStart: '', // 入岗时间开始：yyyy-MM-dd
  dateJobEnd: '', // 入岗时间结束：yyyy-MM-dd
  empName: '',
  ifFinishHour: '',
  currPage: 1,
  pageSize: 10,
  total: 0,
}

const {
  tableFilterSetting,
  startPickerOptions,
  endPickerOptions,
  institutionRef,
  orgIdsFinish,
  queryForm,
  yearOptions,
  dataList,
  fetchDataList,
  queryDataList,
  resetDataList,
  exportDataList,
} = useSubBranchManager({
  baseQueryForm,
  apiDataList: fetchQueryBranchUserPage,
  apiExportDataList: fetchExportBranchUserPage
})

const ifFinishHourOptions = [
  { value: 'Y', label: '是' },
  { value: 'N', label: '否' },
]
// 列表相关数据
const columnList = [
  { width: '120', label: '员工UM号', prop: 'umId' },
  { width: '120', label: '员工姓名', prop: 'empName' },
  { width: '250', label: '机构', prop: 'blgOrgName' },
  { width: '250', label: '岗位', prop: 'postDesc' },
  { width: '120', label: '入岗时间', prop: 'dateJob' },
  { width: '120', label: '参训培训班编号', prop: 'classIds' },
  { width: '120', label: '参训总时长(小时)', prop: 'classHour' },
  { width: '120', label: '满足参训时长', prop: 'ifFinishHour', 
    ...tableFilterSetting('ifFinishHour', ifFinishHourOptions, false) 
  },
]

</script>