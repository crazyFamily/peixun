<template>
  <div class="course-wrapper" v-loading="isListLoading">
    <div class="tips">
      <p class="item">1. 知鸟课程数据同步到培训系统的时效是T+1日，添加知鸟课程时只能查询到截止前一天上传到知鸟平台的课程</p>
      <p class="item">2. 查询或导出课程完成明细时，完成情况的数据也是截止到前一天完成的数据</p>
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
        >
        </table-pagination>
      </div>
    </gc-model>
    
    <gc-model
    title="添加知鸟课程"
		:visible="isCreateCourseShow"
		top="7vh"
    width="800px"
    :showClose="false"
    @comfirm="handleSaveCreate"
    @cancel="handleCancelCreate"
    :comfirm-loading="getLoadingStatus('LOADING_SAVE_MIXED_TRAINING')"
    >
      <div class="detail-wrapper" v-loading="getLoadingStatus('LOADING_SELECT_ZNCOURSE_LIST')">
        <div class="top-bar" style="padding: 0;">
          <el-form :model="courseQueryForm" inline ref="courseFormRef">
            <el-form-item label="课程信息">
              <el-input v-model="courseQueryForm.courseInfo" placeholder="请输入课程ID/名称"></el-input>
            </el-form-item>
            <el-form-item label="课程制作人">
              <el-input v-model="courseQueryForm.developPerson" placeholder="请输入姓名/UM号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button-item" @click="handleSearchCourse">查询</el-button>
              <el-button class="button-item" @click="handleRestCourse">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <table-pagination
          class="mixins-training-create-table"
          :list="courseColumns"
          :tableList="courseTableList"
          :queryForm="courseQueryForm"
          :getList="getCourseList"
          @selection-change="handleCreateCourseSelected"
          row-key="courseId"
          ref="courseTablePaginationRef"
        ></table-pagination>
      </div>
    </gc-model>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTable } from '@/hooks/useTable'
import { FINISH_CONDITION_OPTIONS, IS_FINISH_CONDITION, IS_NOT_FINISH_CONDITION, MIXINS_TRAINING_TYPE_COURSE, MIXINS_ZN_COURSE_COMPLETE_OPTIONS, MIXINS_ZN_COURSE_WARE_OPTIONS } from '@/views/Establish/enum'
import { fetchExportSelectMixedTrainingPage, fetchExportTrainingCompleteDetail, fetchSaveMixedTraining, fetchSelectMixedTrainingPage, fetchSelectZnCourseList, fetchTrainingCompleteDetail, fetchUpdateFinishCondition, fetchUpdateTrainingSortNo } from '@/fetch/establish'
import { commonFilter, CopyObj, getLoadingStatus } from '@/util/utils'
import { Message } from 'element-ui'
import { useMixinsTraining } from '../hooks/useMixinsTraining'
import store from '@/store'

const props = defineProps({
  classId: {
    type: String,
    required: true
  }
})

const isListLoading = computed(() => {
  return getLoadingStatus('LOADING_SELECT_MIXED_TRAINING_PAGE') ||
  getLoadingStatus('LOADING_UPDATE_FINISH_CONDITION') ||
  getLoadingStatus('LOADING_EXPORT_COMPLETE_DETAIL') ||
  getLoadingStatus('LOADING_UPDATE_TRAINING_SORT_NO')
})

const baseParams = {
  trainingType: MIXINS_TRAINING_TYPE_COURSE,
  classId: props.classId,
  isFinishCondition: ''
}

const baseDetailParams = {
  completeStatus: '',
  trainingType: MIXINS_TRAINING_TYPE_COURSE
}

const detailTablePaginationRef = ref(null)
const {
  queryForm,
  query,
  tableList,
  tableFilterSetting,
  queryDatas,
  handleExport,
  handleDetail,
  handleDelete,
  detailQueryForm,
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
  validateMultipleSelected,
  // isCreateCourseShow
} = useMixinsTraining(props, baseParams, baseDetailParams, detailTablePaginationRef)

const columns = [
  {
    type: 'selection',
  },
  { slot: 'dropContainer' },
  {
    prop: 'trainingId',
    label: '知鸟课程ID',
  },
  {
    prop: 'trainingName',
    label: '知鸟课程名称'
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

const isCreateCourseShow = ref(false)
const courseTablePaginationRef = ref(null)
const handleCreate = () => {
  isCreateCourseShow.value = true
  courseTablePaginationRef.value?.clearSelection()
  // queryCourse(getCourseList)
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
    ...tableFilterSetting('completeStatus', MIXINS_ZN_COURSE_COMPLETE_OPTIONS, false)
  },
  {
    prop: 'completeTime',
    label: '完成时间'
  }
]

// ------------- 新增知鸟课程表格 -------------
const baseCourseParams = {
  courseInfo: '',
  developPerson: '',
  coursewareTypes: []
}
const { queryForm: courseQueryForm, query: queryCourse, reset: resetCourse, tableList: courseTableList, tableFilterSetting: courseTableFilter } = useTable(baseCourseParams)
const courseColumns = [
  {
    type: 'selection',
    'reserve-selection': true
  },
  {
    prop: 'courseId',
    label: '课程ID',
    type: 'setWidth',
    width: '100px'
  },
  {
    prop: 'courseName',
    label: '课程名称'
  },
  {
    prop: 'developPerson',
    label: '制作人'
  },
  {
    prop: 'coursewareType',
    label: '课件类型',
    formatter: row => MIXINS_ZN_COURSE_WARE_OPTIONS.find(findRow => findRow.value === row.coursewareType)?.label || '-',
    ...courseTableFilter('coursewareTypes', MIXINS_ZN_COURSE_WARE_OPTIONS)
  },
  {
    prop: 'duration',
    label: '课程时长(时:分:秒)'
  },
]

const getCourseList = async () => {
  const data = CopyObj(courseQueryForm)
  data.courseInfo = filterSpace(data.courseInfo)
  data.developPerson = filterSpace(data.developPerson)

  if(!data.courseInfo && !data.developPerson) return Message.warning('请输入知鸟课程信息查询')

  const {list, total} = await fetchSelectZnCourseList({data})
  courseTableList.value = list
  courseQueryForm.total = total
}
const handleSaveCreate = async () => {
  if(!validateMultipleSelected(createCourseSelectedList.value)) return
  const data = {
    trainingType: MIXINS_TRAINING_TYPE_COURSE,
    classId: props.classId,
    trainingIds: createCourseSelectedList.value.map(row => row.courseId)
  }
  await fetchSaveMixedTraining({ data })
  handleCloseCreateDialog()
  queryDatas()
}
const handleCancelCreate = () => {
  handleCloseCreateDialog()
}

const handleReset = () => {
  courseTableList.value = []
  courseTablePaginationRef.value?.resetFilters()
  resetCourse()
}

const handleCloseCreateDialog = () => {
  isCreateCourseShow.value = false
  handleReset()
} 

const handleRestCourse = () => {
  handleReset()
  // resetCourse(getCourseList)
}
const handleSearchCourse = () => {
  queryCourse(getCourseList)
}

const createCourseSelectedList = ref([])
const handleCreateCourseSelected = (list) => {
  createCourseSelectedList.value = list
}


</script>
<script>
export default {
  name: "MixinsZNCourse"
}
</script>
