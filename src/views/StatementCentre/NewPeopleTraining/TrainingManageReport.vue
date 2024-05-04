<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" :rules="queryFormRules" inline ref="queryFormRef">
        <el-form-item>
          <el-form-item label="入职年月" prop="entryDateStart">
            <el-date-picker
              class="w-120"
              v-model="queryForm.entryDateStart"
              type="month"
              placeholder="开始月份"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="mr10 form-item-data-end" prop="entryDateEnd" >
            <el-date-picker
              class="w-120"
              v-model="queryForm.entryDateEnd"
              type="month"
              placeholder="结束月份"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
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
        <span class="instructor-icons__upload" @click="_exportDataList"><i class="instructor-icons__download__icon"></i>导出</span>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="queryDataListFormat"
          :page-sizes="[10, 20,100]"
        v-loading="getLoadingStatus('LOADING_TRAINING_RATE_REPORT')"
        ref="tablePaginationRef"
      ></table-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'TrainingManageReport'
}
</script>
<script setup>
import { reactive, ref, nextTick, onMounted } from 'vue'
import { usePageList } from '@/hooks/usePageList'
import { 
  fetchListXrTrainingRateReport,
  fetchExportXrTrainingRateReport,
} from '@/fetch/newPeopleTrainingManagement'

const baseQueryForm = {
  entryDateStart: '', // 入岗时间开始：yyyy-MM-dd
  entryDateEnd: '', // 入岗时间结束：yyyy-MM-dd
}

const {
  tableFilterSetting,
  getLoadingStatus,
  queryForm,
  dataList,
  tablePaginationRef,
  selectedList,
  selectDataList,
  queryDataListFormat,
  queryDataList,
  resetDataList,
  exportDataList,
  dataRangeRules
} = usePageList({
  baseQueryForm,
  apiDataList: fetchListXrTrainingRateReport,
  apiExportDataList: fetchExportXrTrainingRateReport,
})
const queryFormRef = ref(null)
const queryFormRules = {
  entryDateStart: [{ required: true, trigger: 'change', message: '请选择开始月份' }],
  entryDateEnd: [{ required: true, trigger: 'change', message: '请选择结束月份' }]
}

const { startPickerOptions, endPickerOptions } = dataRangeRules('entryDateStart', 'entryDateEnd')

const columnList = [
  { type: 'index', label: '序号'},
  { label: '机构', prop: 'orgName' },
  { label: '报名人数', prop: 'userNum' },
  { label: '线上营通过人数', prop: 'passNum' },
  { label: '线上营通过率', prop: 'passCompleteRate' },
  { label: '线下营参训人数', prop: 'attendNum' },
  { label: '线下营覆盖率', prop: 'attendCompleteRate' },
]

function setDefaultDate () {
  // 当前日期
  const nowDate = new Date()

  // 需求变更：要求为当前月-2
  const nowYear = nowDate.getFullYear()
  const nowMonth = nowDate.getMonth() + 1
  let upMonth = nowMonth - 2
  if(upMonth <= 0) upMonth = nowMonth

  queryForm.entryDateStart = `${nowYear}-01-01`
  if (upMonth < 1) { // 当前月份是一月份, 即 upMonth = 0
    queryForm.entryDateEnd = `${nowYear}-01-31`
  } else {
    const upMonthLastDate = [4,6,9,11].includes(upMonth) ? '30' : upMonth === 2 ? '28' : '31' 
    queryForm.entryDateEnd = `${nowYear}-${upMonth.toString().padStart(2,'0')}-${upMonthLastDate}`
  }
}

function _queryDataList () {
  queryFormRef.value.validate(valid => {
    if (valid) {
      queryDataList()
    }
  })
}
function _exportDataList () {
  queryFormRef.value.validate(valid => {
    if (valid) {
      exportDataList()
    }
  })
}
function _resetDataList () {
  setDefaultDate()
  dataList.value = []
  nextTick(() => {
    queryFormRef.value.clearValidate()
  })
}
onMounted(() => {
  setDefaultDate()
  _queryDataList()
})
</script>

<style lang="scss" scoped>
.form-item-data-end {
  :deep(.el-form-item__label:before) {
    display: none
  }
}
</style>