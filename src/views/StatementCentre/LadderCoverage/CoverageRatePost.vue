<template>
  <div class="coverage-rate-post-page">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <div class="mt10">
        <el-radio-group v-model="_activeTab" size="small">
          <el-radio-button v-for="tab in tabs" :key="tab.value" :label="tab.value">{{tab.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-form :model="queryForm" :rules="queryFormRules" ref="queryFormRef" inline>
        <el-form-item label="机构" prop="orgIds">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              :leftShow="false"
              :default-show="true"
              :org-url="API_SELECT_FIXED_TREE" 
              :fetch-params="{ busiType: 'LS' }"
              @change="queryForm.orgName = $event"
              @setDataFinish="handleDefaultOrgsData"
              busiType="LS"
              ref="institutionRef"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-form-item label="入岗时间">
            <el-date-picker
              class="w-120 clearable-data-pick"
              v-model="queryForm.dateJobStart"
              type="month"
              placeholder="开始月份"
              :clearable="true"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <span>至</span>
          <el-form-item label=" " class="mr10 end-date-item" prop="dateJobEnd">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateJobEnd"
              type="month"
              placeholder="结束月份(必填)"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form-item>

        <div class="buttons">
          <el-button @click="_queryDataList" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="_resetDataList" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__upload" @click="exportDataList()"><i class="instructor-icons__download__icon"></i>导出</span>
      </div>
      <gc-table
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        :cell-class-name="hideRowBoder"
        :header-cell-class-name="hideRowBoder"
        :span-method="objectSpanMethod"
        v-loading="getLoadingStatus('LOADING_LADDER_COVERBYJOB')"
        ref="tablePagination">
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
      </gc-table>
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { fetchListPlanDict } from '@/fetch/public'
// import { fetchListLadderCoverByJob, fetchVariationTrend, fetchExportLadderCoverByJob, fetchExportTrainDetails } from '@/fetch/ladderManagement'
import { fetchListLadderCoverByJob, fetchExportLadderCoverByJob } from '@/fetch/statementCentre'
import { LADDER_COVERAGE_TABS } from '@/util/constants'
import { useLadderCoverage } from '../hooks/useLadderCoverage'
import { getLoadingStatus, CopyObj } from '@/util/utils'
import { Message, MessageBox } from 'element-ui'
import { API_SELECT_FIXED_TREE } from '@/fetch/public'
import { useTable } from '@/hooks/useTable'

const baseQueryForm = {
  blgStripLine: 'LS',
  orgId: '',
  dateJobStart: '', // 入岗开始时间
  dateJobEnd: '', // 入岗结束时间

  currPage: 1,
  pageSize: 1000, // 18
  total: 0,
}

const {
  setDefaultDate,
  tableFilterSetting,
  startPickerOptions,
  endPickerOptions,
  institutionRef,
  queryForm,
  dataList,
  fetchDataList,
  queryDataList,
  resetDataList,
  exportDataList,
} = useLadderCoverage({
  baseQueryForm,
  apiDataList: fetchListLadderCoverByJob,
  apiExportDataList: fetchExportLadderCoverByJob,
  queryFormFormat: _formatSendParams,
  dataListFormat: _dataListFormat,
  startField: 'dateJobStart',
  endField: 'dateJobEnd',
})

// ========================= Tab切换 =========================
const emits = defineEmits(['update:activeTab'])
const _activeTab = ref('')
const props = defineProps({
  activeTab: String,
  tabs: {
    type: Array,
    default: () => []
  }
})
watch(() => props.activeTab, (newV) => {
  _activeTab.value = newV
}, { immediate: true })

watch(() => _activeTab.value, async (newV, oldV) => {
  emits('update:activeTab', newV)
  if (!dataList.value?.length) {
    queryDataList()
  }
})

// ========================= 搜索框 =========================

// 搜索框规则
const queryFormRules = {
  orgIds: [{ required: true, trigger: 'blur', validator: (rule, value, cb) => {
      if (!value?.length) {
        return cb(new Error('请选择机构'))
      }
      cb()
    }
  }],
  dateJobEnd: [{ required: true, message: '请选择结束月份', trigger: 'blur' }],
}
const handleDefaultOrgsData = org => {
  const { orgId, orgName } = org
  queryForm.value.orgIds = ['LS', orgId]
  _queryDataList()
}
// ========================= 搜索数据 =========================
const queryFormRef = ref(null)
function _queryDataList () {
  queryFormRef.value.validate(valid => {
    if (valid) {
      queryDataList()
    }
  })
}
function _resetDataList () {
  // 重置入岗时间
  setDefaultDate()
  // 清空表单验证
  queryFormRef.value.clearValidate()
  // 重置机构
  institutionRef.value.createTreeData()
}
// 格式化发送数据
function _formatSendParams(params) {
  const data = CopyObj(params)
  data.orgId = data.orgIds?.[1]
  Reflect.deleteProperty(data, 'orgIds')
  if (Object.hasOwnProperty.call(data, 'dateJobStart') && !data.dateJobStart) {
    Reflect.deleteProperty(data, 'dateJobStart')
  }
  if (Object.hasOwnProperty.call(data, 'dateJobEnd') && !data.dateJobEnd) {
    Reflect.deleteProperty(data, 'dateJobEnd')
  }
  return data
}


// 列表数据渲染前格式处理
const rowSpanMapping = reactive({})
function _dataListFormat (data) {
  const channelTypeList =[...new Set(data.filter(m => m.channelType).map(m => m.channelType ))]
  channelTypeList.forEach(channelType => {
    rowSpanMapping[channelType] = { count: 0, spanIndex: 0 }
  })

  data.forEach((row, i) => {
    rowSpanMapping[row.channelType].count ++
  })

  Object.keys(rowSpanMapping).forEach((channelType, i) => {
    if (i > 0) {
      const { count, spanIndex } = rowSpanMapping[channelTypeList[i -1]]
      rowSpanMapping[channelType].spanIndex = count + spanIndex
    }
  })
  return data
}

// ========================= 列表表格渲染 =========================

// 列表相关数据
const columnList = [
  { width: '150', label: '业务条线', prop: 'channelTypeDesc' },
  { width: '220', label: '关键岗位', prop: 'keyJobsDesc', align: 'center' },
]
// 合并主列
const headerList = [
  { label: '入岗人数', prop: 'JobNum', width: '90' },
  { label: '参训人数', prop: 'CultivateNum', width: '90' },
  { label: '覆盖率', prop: 'CoverRateStr', width: '80' }
]

// 
function hideRowBoder(row) {
  if (['JobNum', 'CultivateNum'].includes(row.column.property)) {
    return 'hide-boder'
  }
}
// 行合并
function objectSpanMethod({ row, column, rowIndex, columnIndex }) {
  if (columnIndex === 0) {
    const rowSpan = rowSpanMapping[row.channelType]
    if ( rowIndex === rowSpan?.spanIndex ) {
      return {
        rowspan: rowSpan.count,
        colspan: 1
      };
    } else {
      return {
        rowspan: 0,
        colspan: 0
      };
    }
  }
}

onMounted(() => {
  setDefaultDate()
})

</script>
<style lang="less" scoped>
.end-date-item {
  margin-left: -5px;
  :deep(.el-form-item__label){
    position: relative;
    left: 12px;
  }
}
</style>