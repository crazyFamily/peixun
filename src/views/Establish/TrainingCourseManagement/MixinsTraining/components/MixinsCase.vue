<template>
  <div class="course-wrapper" v-loading="isListLoadig">
    <div class="content-container">
      <div class="top-bar">
        <el-button class="button-item" @click="handleCreate">添加</el-button>
        <!-- <el-button class="button-item" @click="handleUpdateFinishCondition(IS_FINISH_CONDITION)">结训：是</el-button>
        <el-button class="button-item" @click="handleUpdateFinishCondition(IS_NOT_FINISH_CONDITION)">结训：否</el-button> -->
        <!-- <el-button class="button-item">设置积分</el-button> -->
        <el-button class="button-item" @click="handleDelete()">删除</el-button>
        <el-button class="button-item" @click="handleExport()">导出完成明细</el-button>
      </div>
      <div class="content">
        <table-pagination
          :list="columns"
          row-key="trainingId"
          drop
          :tableList="tableList"
          :queryForm="queryForm"
          :getList="getList"
          :page-sizes="[10, 50, 100]"
          @selection-change="handleSelected"
          @dropEnd="handleDropEnd"
          ref="tablePaginationRef"
          class="mixins-table"
        >
          <el-table-column slot="dropContainer" label="" width="40">
            <template>
              <i class="el-icon-rank drop"></i>
            </template>
          </el-table-column>
          <!-- <el-table-column slot="isFinishCondition" label="是否结训条件" width="150px">
            <template slot="header">
              <div class="column-header">
                <span>
                  是否结训条件
                  <el-tooltip
                    effect="light"
                    popper-class="table-popper"
                    placement="top"
                    ><i class="el-icon-question active"></i>
                    <p slot="content">是否结训条件设置为“是”时，学员必须要完成此课程，才能在结训管理中将学员设置为“结训”状态</p>
                  </el-tooltip>
                </span>
                <gc-tablecolumnfilters
                  label=" "
                  className="table__screen__icon"
                  popperClass="circular"
                  :list="FINISH_CONDITION_OPTIONS"
                  confirmText="确定"
                  radio
                  @filter="commonFilter($event, queryForm, 'isFinishCondition', getList,'filter')"
                  @reset="commonFilter($event, queryForm, 'isFinishCondition', getList)"
                >
                </gc-tablecolumnfilters>
              </div>
            </template>
            <template slot-scope="scope">
              {{ FINISH_CONDITION_OPTIONS.find(v => scope.row.isFinishCondition === v.value )?.label || '-' }}
            </template>
          </el-table-column> -->

          <el-table-column label="操作" min-width="90" fixed="right">
            <template slot-scope="scope">
              <span class="active" @click="handleDetail(scope.row)">完成明细</span>
            </template>
          </el-table-column>
        </table-pagination>
      </div>
    </div>

    <gc-model
    title="完成情况明细"
		:visible="isFinisDetailShow"
		top="7vh"
    width="800px"
    :showClose="true"
    :is-show-footer="false"
    @close="isFinisDetailShow = false"
    >
      <div class="detail-wrapper" v-loading="getLoadingStatus('LOADING_TRAINING_COMPLETE_DETAIL')">
        <div class="top-bar flex-end" style="padding: 0; padding-bottom: 20px;">
          <el-button class="button-item" @click="handleExportDetails">导出</el-button>
        </div>
        <table-pagination
          :list="detailColumns"
          :tableList="detailTableList"
          :queryForm="detailQueryForm"
          :getList="getDetailList"
          ref="detailTablePaginationRef"
        ></table-pagination>
      </div>
    </gc-model>

    <!-- 新增案例 -->
    <CompSelectCaseDailog :show.sync="isCreateCaseShow" :selected-list="[]" @save="handleSaveCreate"></CompSelectCaseDailog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useTable } from '@/hooks/useTable'
import { FINISH_CONDITION_OPTIONS, IS_FINISH_CONDITION, IS_NOT_FINISH_CONDITION, MIXINS_TRAINING_TYPE_CASE, MIXINS_TRAINING_TYPE_COURSE, MIXINS_ZN_CASE_COMPLETE_OPTIONS, MIXINS_ZN_COURSE_WARE_OPTIONS } from '@/views/Establish/enum'
import { fetchExportSelectMixedTrainingPage, fetchExportTrainingCompleteDetail, fetchSaveMixedTraining, fetchSelectMixedTrainingPage, fetchSelectZnCourseList, fetchTrainingCompleteDetail, fetchUpdateFinishCondition, fetchUpdateTrainingSortNo } from '@/fetch/establish'
import { commonFilter, getLoadingStatus } from '@/util/utils'
import { Message } from 'element-ui'
import CompSelectCaseDailog from '@/components/case/CompSelectCaseDailog.vue'
import { useMixinsTraining } from '../hooks/useMixinsTraining'


const props = defineProps({
  classId: {
    type: String,
    required: true
  }
})

const isListLoadig = computed(() => {
  return getLoadingStatus('LOADING_SELECT_MIXED_TRAINING_PAGE') ||
  getLoadingStatus('LOADING_UPDATE_FINISH_CONDITION') ||
  getLoadingStatus('LOADING_EXPORT_COMPLETE_DETAIL') ||
  getLoadingStatus('LOADING_UPDATE_TRAINING_SORT_NO')
})

const baseParams = {
  trainingType: MIXINS_TRAINING_TYPE_CASE,
  classId: props.classId,
  isFinishCondition: ''
}

const baseDetailParams = {
  completeStatus: '',
  trainingType: MIXINS_TRAINING_TYPE_CASE,
  classId: props.classId,
}

const detailTablePaginationRef = ref(null)
const {
  queryForm,
  query,
  tableList,
  tableFilterSetting,
  queryDatas,
  handleExport,
  handleDelete,
  handleDetail,
  handleUpdateFinishCondition,
  handleSelected,
  handleDropEnd,
  getList,
  isFinisDetailShow,
  detailQueryForm,
  getDetailList,
  detailTableList,
  handleExportDetails,
} = useMixinsTraining(props, baseParams, baseDetailParams, detailTablePaginationRef)

const columns = [
  {
    type: 'selection',
  },
  { 
    slot: 'dropContainer',
  },
  {
    prop: 'trainingId',
    label: '案例ID'
  },
  {
    prop: 'trainingName',
    label: '案例名称'
  },
  {
    slot: 'isFinishCondition'
  },
  {
    prop: 'completeNum',
    label: '本班完成人数',
    formatter:(row) => `${row.completeNum}/${row.studentNum}`
  },
  {
    prop: 'createdBy',
    label: '添加人'
  }
]

const handleCreate = () => {
  isCreateCaseShow.value = true
  // getCourseList()
}

// ------------- 明细表格 -------------
const detailColumns = [
  {
    type: 'index',
    label: '序号'
  },
  {
    prop: 'empName',
    label: '姓名'
  },
  {
    prop: 'umId',
    label: 'UM号'
  },
  {
    prop: 'completeStatusDesc',
    label: '完成状态',
    ...tableFilterSetting('completeStatus', MIXINS_ZN_CASE_COMPLETE_OPTIONS, false)
  },
  {
    prop: 'completeTime',
    label: '完成时间'
  }
]

// ------------- 新增知鸟课程表格 -------------
const isCreateCaseShow = ref(false)
const courseQueryForm = reactive({})
const getCourseList = async () => {
  const data = courseQueryForm
  const {list, total} = await fetchSelectZnCourseList({data})
  courseTableList.value = list
  courseQueryForm.total = total
}
const handleSaveCreate = async (list) => {
  const data = {
    trainingType: MIXINS_TRAINING_TYPE_CASE,
    classId: props.classId,
    trainingIds: list.map(row => row.caseId)
  }
  await fetchSaveMixedTraining({ data })
  handleCloseCreateDialog()
  queryDatas()
}
const handleCancelCreate = () => {
  handleCloseCreateDialog()
}
const handleCloseCreateDialog = () => {
  isCreateCaseShow.value = false
} 

</script>
<script>
export default {
  name: "MixinsCase"
}
</script>

<style lang="scss" scoped>
  @import '@/views/Establish/TrainingCourseManagement/MixinsTraining/components/stylesheets/mixins-public.scss';
  .content-container {
    height: calc(100vh - 150px);
  }
</style>
