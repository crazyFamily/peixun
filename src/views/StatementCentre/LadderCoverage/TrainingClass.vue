<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" :rules="queryFormRules" ref="queryFormRef" inline>
        <el-form-item label="岗位" prop="channelType">
          <el-cascader
            ref="cascaderArr"
            class="w-200"
            clearable
            v-model="queryForm.jobInfo"
            @change="channelTypesChange"
            :options="channelTypes"
            :props="cascaderProps" 
          />
        </el-form-item>
        <el-form-item label="培训班信息">
          <gc-input placeholder="培训班编号/培训班名称" v-model.trim="queryForm.classId" clearable></gc-input>
        </el-form-item>
        <div class="buttons">
          <el-button @click="_queryDataList" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="_resetDataList" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10" v-show="queryForm.keyJobs">
      <div class="menu-wapper">
        <div class="menu-left">
          <el-radio-group v-model="queryForm.trainType" size="small">
            <el-radio-button v-for="item in tabs" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
          </el-radio-group>
        </div>
        <div class="menu-right">
          <span class="instructor-icons__upload" @click="_exportDataList"><i class="instructor-icons__download__icon"></i>导出</span>
        </div>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        v-loading="getLoadingStatus('LOADING_HELD_CLASS')"
        ref="tablePagination"
      />
    </el-card>
    <div v-show="!queryForm.keyJobs" class="no_data">
      <img src="@/assets/images/no-data.png" alt="" />
      <p>请选择要查询的岗位</p>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { fetchListHeldClass, fetchExportHeldClass } from '@/fetch/statementCentre'
import { useLadderCoverage } from '../hooks/useLadderCoverage'
import { usePostCascader } from '../hooks/usePostCascader'
import { getLoadingStatus, resetObj, CopyObj } from '@/util/utils'
import { LADDER_COVERAGE_TABS_JYZ } from '../enum'

const baseQueryForm = {
  jobInfo: [],
  channelType: '',
  keyJobs: '',
  keyJobsName: '',

  classId: '',
  trainType: LADDER_COVERAGE_TABS_JYZ, // 培训类型：xr：加油站；ts：提升培训；yx：研修培训
  currPage: 1,
  pageSize: 10,
  total: 0,
}

const {
  tableFilterSetting,
  queryForm,
  // queryFormRules,
  dataList,
  fetchDataList,
  queryDataList,
  resetDataList,
  exportDataList,
} = useLadderCoverage({
  baseQueryForm,
  apiDataList: fetchListHeldClass,
  apiExportDataList: fetchExportHeldClass,
  queryFormFormat: _formatSendParams
})
// 搜索框规则
const queryFormRules = {
  channelType: [{ required: true, message: '请选择岗位', trigger: 'change' }],
}
watch(() => queryForm.value.keyJobs, (newV) => {
  if (newV) {
    queryDataList()
  }
})
// ========================= Tab切换 =========================
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
// watch(() => props.activeTab, (newV) => {
//   queryForm.value.trainType = newV
// }, { immediate: true })

watch(() => queryForm.value.trainType, async (newV, oldV) => {
  emits('update:activeTab', newV)
  queryDataList()
})


// ========================= 搜索框 =========================

// 格式化发送数据
function _formatSendParams(params) {
  const data = CopyObj(params)
  data.orgId = data.orgIds?.[1]
  Reflect.deleteProperty(data, 'orgIds')
  Reflect.deleteProperty(data, 'jobInfo')
  return data
}

// 岗位选择框 - 相关变量
const {
  cascaderProps,
  // channelTypes,
  cascaderArr,
  channelTypesChange
} = usePostCascader({ 
  queryForm,
  fetchParams: { isLadder:"Y" } 
})

// 列表相关数据
const columnList = [
  { width: '120', label: '培训班编号', prop: 'classId' },
  { width: '180', label: '培训班名称', prop: 'className' },
  { width: '200', label: '班主任', prop: 'realManager' },
  { width: '250', label: '举办单位', prop: 'orgName' },
  { width: '200', label: '关联计划', prop: 'annualPlanName' },
  { width: '120', label: '计划业务模块', prop: 'channelTypeDesc' },
  { width: '180', label: '计划关键岗位', prop: 'keyJobsDesc' },
  { width: '180', label: '举办周期', prop: 'duration' },
  { width: '120', label: '结训日期', prop: 'dateFinish' }
]

const queryFormRef = ref(null)
function _queryDataList () {
  queryFormRef.value.validate(valid => {
    if (valid) {
      queryDataList()
    }
  })
}
// 
function _resetDataList () {
  queryForm.value.classId = ''
  queryForm.value.jobInfo = []
  queryForm.value.channelType = ''
  queryForm.value.keyJobs = '' 
  queryForm.value.keyJobsName = ''
  queryFormRef.value.clearValidate()
}
function _exportDataList () {
   queryFormRef.value.validate(valid => {
    if (valid) {
      exportDataList()
    }
  })
}


</script>
<style lang="less" scoped>
.menu-wapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .menu-right {
    margin-bottom: 0;
    margin-top: 10px;
    margin-right: 5px;
  }
}
</style>