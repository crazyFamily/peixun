<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="参训年份" prop="year">
          <gc-select 
            :options="yearOptions" 
            v-model="queryForm.year" 
            :clearable="false"
            class="w-150" />
        </el-form-item>
        <el-form-item label="机构">
          <div class="df">
            <gc-institution
              v-model="queryForm.blgStripLine"
              :leftShow="false"
              :default-show="false"
              busiType="LS"
              :fetchParams="{module: CLASS_MODULE }"
              :otherParams="{module: CLASS_MODULE }"
              ref="institutionRef"
            />
            <el-checkbox v-model="queryForm.isShowSecondFH" class="ml10">查看二级分行</el-checkbox>
          </div>
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
        v-loading="getLoadingStatus('LOADING_BRANCH_RATE')"
        ref="tablePagination"
      />
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { fetchQueryBranchRatePage, fetchExportBranchRatePage } from '@/fetch/statementCentre'
import { ZONE_OPTIONS, CLASS_MODULE } from '../enum'
import { useSubBranchManager } from '../hooks/useSubBranchManager'
import { getLoadingStatus } from '@/util/utils'

const baseQueryForm = {
  blgStripLine: [],
  blgOrgId: '', // 所属机构编号
  
  year: '', // 参训年份
  dateJobStart: '', // 入岗开始时间
  dateJobEnd: '', // 入岗结束时间
  isShowSecondFH: false, // 查看二级分行
  treeZone: [], // 所属区域列表
  currPage: 1,
  pageSize: 10,
  total: 0,
}

const zoneList = ZONE_OPTIONS

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
  apiDataList: fetchQueryBranchRatePage,
  apiExportDataList: fetchExportBranchRatePage
})

// 列表相关数据
const columnList = [
  { width: '220', label: '机构', prop: 'blgOrgName', fixed: 'left' },
  { width: '120', label: '所属区域', prop: 'treeZoneName',
    ...tableFilterSetting('treeZone', zoneList, true)},
  { width: '120', label: '在职人数', prop: 'inJobNum' },
  { width: '120', label: '参训人数', prop: 'finishClassNum' },
  { width: '120', label: '参训率', prop: 'classRate' },
]

</script>