<template>
  <div class="coverage-rate-org-page">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <div class="mt10">
        <el-radio-group v-model="queryForm.trainType" size="small">
          <el-radio-button v-for="tab in tabs" :key="tab.value" :label="tab.value">{{tab.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-form :model="queryForm" :rules="queryFormRules" ref="queryFormRef" inline>
        <el-form-item label="岗位" prop="channelType">
          <el-cascader
            ref="cascaderArr"
            style="width:200px;"
            clearable
            v-model="queryForm.jobInfo"
            @change="channelTypesChange"
            :options="channelTypes"
            :props="cascaderProps" 
          />
        </el-form-item>
        <el-form-item label="机构" prop="orgIds">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              :leftShow="false"
              :default-show="true"
              :org-url="APIAllTree" 
              :fetch-params="{ busiType: 'LS' }"
              @change="queryForm.orgName = $event"
              busiType="LS"
              ref="institutionRef"
            />
            <el-checkbox v-model="queryForm.isShowSecondFH" class="ml10">查看二级分行</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item>
          <el-form-item label="入岗时间">
            <el-date-picker
              class="w-120 clearable-data-pick"
              v-model="queryForm.startDate"
              type="month"
              placeholder="开始月份"
              :clearable="true"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <span>至</span>
          <el-form-item label=" " class="mr10 end-date-item" prop="endDate">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endDate"
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
    <el-card class="mt10" v-show="isSearchData">
      <div class="menu-right">
        <span class="instructor-icons__upload" @click="_exportDataList"><i class="instructor-icons__download__icon"></i>导出</span>
        <!-- <span class="instructor-icons__upload" @click="openExportForm"><i class="instructor-icons__download__icon"></i>导出明细</span> -->
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        :cell-class-name="hideRowBoder"
        :header-cell-class-name="hideRowBoder"
        v-loading="getLoadingStatus('LOADING_LADDER_COVERBYORG')"
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
      </table-pagination>
    </el-card>
    <div v-show="!isSearchData" class="no_data">
      <img src="@/assets/images/no-data.png" alt="" />
      <p>请选择要查询的岗位</p>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { fetchListLadderCoverSituationByOrg, fetchExportLadderCoverSituationByOrg } from '@/fetch/statementCentre'
import { LADDER_COVERAGE_TABS } from '@/util/constants'
import { useLadderCoverage } from '../hooks/useLadderCoverage'
import { usePostCascader } from '../hooks/usePostCascader'
import { getLoadingStatus, CopyObj } from '@/util/utils'
import { APIAllTree } from '@/fetch/public'
import { Message } from 'element-ui'

const baseQueryForm = {
  jobInfo: [],
  channelType: '',
  keyJobs: '',
  keyJobsName: '',

  // blgStripLine: 'LS',
  orgIds: [],
  orgId: '',
  orgName: '',
  
  startDate: '', // 入岗开始时间
  endDate: '', // 入岗结束时间

  isShowSecondFH: false, // 查看二级分行
  trainType: '',
  currPage: 1,
  pageSize: 10,
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
  apiDataList: fetchListLadderCoverSituationByOrg,
  apiExportDataList: fetchExportLadderCoverSituationByOrg,
  queryFormFormat: _formatSendParams,
  startField: 'startDate',
  endField: 'endDate',
})
const isSearchData = ref(false)
// ========================= 搜索框 =========================

const emits = defineEmits(['update:activeTab'])
const props = defineProps({
  activeTab: String,
  tabs: {
    type: Array,
    default: () => []
  },
  channelTypes: {
    type: Array,
    default: () => []
  }
})
watch(() => props.activeTab, (newV) => {
  queryForm.value.trainType = newV
}, { immediate: true })

watch(() => queryForm.value.trainType, async (newV, oldV) => {
  emits('update:activeTab', newV)
})

// 搜索框规则
const queryFormRules = {
  channelType: [{ required: true, message: '请选择岗位', trigger: 'change' }],
  orgIds: [{ required: true, trigger: 'blur', validator: (rule, value, cb) => {
      console.log(value)
      if (!value.length) {
        return cb(new Error('请选择机构'))
      }
      cb()
    }
  }],
  endDate: [{ required: true, message: '请选择结束月份', trigger: 'blur' }],
}

// 岗位选择框 - 相关变量
const {
  cascaderProps,
  cascaderArr,
  channelTypesChange
} = usePostCascader({
  queryForm,
  fetchParams: { isLadder:"Y" }
})

// ========================= 列表表格 =========================

// 列表相关数据
const columnList = [
  { label: '单位', prop: 'lateFixNodeName', width: '226' },
  { label: '归属区域', prop: 'treeZoneName', width: '100' }
]

const headerList = [
  { label: '入岗人数', prop: 'JobNum', width: '90' },
  { label: '参训人数', prop: 'CultivateNum', width: '90' },
  { label: '覆盖率', prop: 'CoverRateStr', width: '80' }
]


function hideRowBoder(row) {
  if (['JobNum', 'CultivateNum'].includes(row.column.property)) {
    return 'hide-boder'
  }
}

const queryFormRef = ref(null)
function _queryDataList () {
  queryFormRef.value.validate(valid => {
    if (valid) {
      if (!isSearchData.value) {
        isSearchData.value = true
      }
      queryDataList()
    }
  })
}

// 格式化发送数据
function _formatSendParams(params) {
  const data = CopyObj(params)
  data.orgId = data.orgIds?.[1]
  data.isShowSecondFH = data.isShowSecondFH ? 'Y' : 'N'
  Reflect.deleteProperty(data, 'orgIds')
  Reflect.deleteProperty(data, 'jobInfo')
  if (Object.hasOwnProperty.call(data, 'startDate') && !data.startDate) {
    Reflect.deleteProperty(data, 'startDate')
  }
  if (Object.hasOwnProperty.call(data, 'endDate') && !data.endDate) {
    Reflect.deleteProperty(data, 'endDate')
  }
  return data
}

function _resetDataList () {
  isSearchData.value = false
  queryForm.value.jobInfo = []
  queryForm.value.channelType = ''
  queryForm.value.keyJobs = ''
  queryForm.value.keyJobsName = ''
  queryForm.value.userInfo = ''
  queryForm.value.orgIds = []
  queryForm.value.orgId = ''
  queryForm.value.orgName = ''
  queryForm.value.isShowSecondFH = 'N'
  setDefaultDate()
  queryFormRef.value.clearValidate()
  dataList.value = []
}

function _exportDataList () {
  queryFormRef.value.validate(valid => {
    if (valid) {
      exportDataList()
    }
  })
}

// ========================= 初始化 =========================
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
<style lang="less" scoped>
.coverage-rate-org-page {
  :deep(.el-table th:first-of-type .cell) {
    justify-content: left;
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
    justify-content: left;
  }
  :deep(.block) {
    display: block;
  }
}

.start-time {
  :deep(.el-icon-circle-close) {
    background: unset !important;
  }
}

</style>