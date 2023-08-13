<template>
  <div class="course-wrapper" v-loading="isListLoadig">
    <div class="tips">
      <p class="item">1. 知鸟考试数据同步到培训系统的时效是T+1日，添加知鸟考试时需提前一天在知鸟系统完成考试推送，第二天再到此处配置考试</p>
      <p class="item">2. 查询或导出考试完成明细时，完成情况的数据也是截止到前一天完成的数据</p>
    </div>
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
    
    <gc-model
    title="添加知鸟考试"
		:visible="isCreateExamShow"
		top="7vh"
    width="800px"
    :showClose="false"
    @comfirm="handleSaveCreate"
    @cancel="handleCancelCreate"
    :comfirm-loading="getLoadingStatus('LOADING_SAVE_MIXED_TRAINING')"
    >
      <div class="detail-wrapper" v-loading="getLoadingStatus('LOADING_SELECT_ZNCOURSE_LIST')">
        <div class="top-bar" style="padding: 0;">
          <el-form :model="examQueryForm" inline ref="courseFormRef">
            <el-form-item label="考试信息">
              <el-input v-model="examQueryForm.testInfo" placeholder="请输入考试ID/名称"></el-input>
            </el-form-item>
            <el-form-item label="考试创建人">
              <el-input v-model="examQueryForm.developPerson" placeholder="请输入姓名/UM号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button-item" @click="handleSearchExam">查询</el-button>
              <el-button class="button-item" @click="handleRestExam">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <table-pagination
          :list="examColumns"
          :tableList="examTableList"
          :queryForm="examQueryForm"
          :getList="getExamList"
          @selection-change="handleCreateExamSelected"
          row-key="courseId"
          ref="examTablePaginationRef"
          class="mixins-training-create-table"
        ></table-pagination>
      </div>
    </gc-model>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTable } from '@/hooks/useTable'
import { FINISH_CONDITION_OPTIONS, IS_FINISH_CONDITION, IS_NOT_FINISH_CONDITION, MIXINS_TRAINING_TYPE_EXAM, MIXINS_ZN_COURSE_WARE_OPTIONS, MIXINS_ZN_EXAM_COMPLETE_OPTIONS } from '@/views/Establish/enum'
import { fetchExportSelectMixedTrainingPage, fetchExportTrainingCompleteDetail, fetchSaveMixedTraining, fetchSelectMixedTrainingPage, fetchSelectZnCourseList, fetchSelectZnTestList, fetchTrainingCompleteDetail, fetchUpdateFinishCondition, fetchUpdateTrainingSortNo } from '@/fetch/establish'
import { commonFilter, CopyObj, getLoadingStatus } from '@/util/utils'
import { Message } from 'element-ui'
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
  trainingType: MIXINS_TRAINING_TYPE_EXAM,
  classId: props.classId,
  isFinishCondition: ''
}

const baseDetailParams = {
  completeStatus: '',
  trainingType: MIXINS_TRAINING_TYPE_EXAM
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
  detailQueryForm,
  handleDetail,
  getDetailList,
  detailTableList,
  handleExportDetails,
  // handleCreate,
  handleUpdateFinishCondition,
  handleSelected,
  handleDropEnd,
  getList,
  isFinisDetailShow,
  filterSpace,
  validateMultipleSelected
  // isCreateCourseShow
} = useMixinsTraining(props, baseParams, baseDetailParams, detailTablePaginationRef)

const columns = [
  {
    type: 'selection',
  },
  { slot: 'dropContainer' },
  {
    prop: 'trainingId',
    label: '知鸟考试ID'
  },
  {
    prop: 'trainingName',
    label: '知鸟考试名称'
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

const examTablePaginationRef = ref(null)
const handleCreate = () => {
  isCreateExamShow.value = true
  examTablePaginationRef.value?.clearSelection()
  // queryExam(getExamList)
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
    ...tableFilterSetting('completeStatus', MIXINS_ZN_EXAM_COMPLETE_OPTIONS, false)
  },
  {
    prop: 'score',
    label: '考试成绩'
  },
  {
    prop: 'completeTime',
    label: '完成时间'
  }
]

// ------------- 新增知鸟课程表格 -------------
const isCreateExamShow = ref(false)
const baseExamParams = {
  testInfo: '',
  developPerson: '',
  coursewareType: []
}
const { queryForm: examQueryForm, query: queryExam, reset: resetExam, tableList: examTableList, tableFilterSetting: examTableFilter } = useTable(baseExamParams)
const examColumns = [
  {
    type: 'selection',
    'reserve-selection': true
  },
  {
    prop: 'testId',
    label: '知鸟考试ID',
    type: 'setWidth',
    width: '90px'
  },
  {
    prop: 'testName',
    label: '知鸟考试名称'
  },
  {
    prop: 'developPerson',
    label: '考试创建人'
  },
  {
    prop: 'startTime',
    label: '创建时间'
  },
]
const getExamList = async () => {
  const data = CopyObj(examQueryForm)
  data.testInfo = filterSpace(data.testInfo)
  data.developPerson = filterSpace(data.developPerson)

  if(!data.testInfo && !data.developPerson) return Message.warning('请输入知鸟直播信息查询')

  const {list, total} = await fetchSelectZnTestList({data})
  examTableList.value = list
  examQueryForm.total = total
}
const handleSaveCreate = async () => {
  if(!validateMultipleSelected(createExamSelectedList.value)) return 
  const data = {
    trainingType: MIXINS_TRAINING_TYPE_EXAM,
    classId: props.classId,
    trainingIds: createExamSelectedList.value.map(row => row.testId)
  }
  await fetchSaveMixedTraining({ data })
  handleCloseCreateDialog()
  queryDatas()
}
const handleCancelCreate = () => {
  handleCloseCreateDialog()
}

const handleReset = () => {
  examTableList.value = []
  examTablePaginationRef.value?.resetFilters()
  resetExam()
}

const handleCloseCreateDialog = () => {
  isCreateExamShow.value = false
  handleReset()
} 

const handleRestExam = () => {
  handleReset()
  // resetExam(getExamList)
}
const handleSearchExam = () => {
  queryExam(getExamList)
}

const createExamSelectedList = ref([])
const handleCreateExamSelected = (list) => {
  createExamSelectedList.value = list
}


</script>
<script>
export default {
  name: "MixinsZNExam"
}
</script>
