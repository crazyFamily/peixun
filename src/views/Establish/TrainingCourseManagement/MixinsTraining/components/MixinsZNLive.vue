<template>
  <div class="course-wrapper" v-loading="isListLoadig">
    <div class="tips">
      <p class="item">1. 知鸟直播数据同步到培训系统的时效是T+1日，添加知鸟直播只能查询到截至前一天创建的知鸟直播</p>
      <p class="item">2. 只可添加正式直播，测试类型的直播无法搜索到</p>
    </div>
    <div class="content-container">
      <div class="top-bar">
        <el-button class="button-item" @click="handleCreate">添加</el-button>
        <el-button class="button-item" @click="handleDelete()">删除</el-button>
        <!-- <el-button class="button-item" @click="handleExport()">导出完成明细</el-button> -->
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
          <el-table-column label="操作" min-width="90" fixed="right">
            <template slot-scope="scope">
              <span class="active" @click="handleDetail(scope.row)">直播数据</span>
            </template>
          </el-table-column>
        </table-pagination>
      </div>
    </div>

    <gc-model
      title="直播数据"
      :visible="isFinisDetailShow"
      top="7vh"
      width="1000px"
      :showClose="true"
      :is-show-footer="false"
      @close="isFinisDetailShow = false"
    >
      <div class="detail-wrapper">
        <div class="tips">
          <p class="item">知鸟直播数据T+1日从知鸟同步到培训管理系统，如需查询其他数据或直播明细数据请到知鸟平台查询</p>
        </div>
        <div class="live-info-container">
          <div class="container" v-for="(info, i) in liveDetailInfo" :key="i">
            <p class="topbar">
              <span class="topbar-icon-wrapper">
                <img :src="info.icon" alt="" class="topbar-icon" />
              </span>
              {{info.label}}
            </p>
            <p class="info">{{info.value}}</p>
          </div>
        </div>
      </div>
    </gc-model>

    <gc-model
      title="添加知鸟直播"
      :visible="isCreateLiveShow"
      top="7vh"
      width="800px"
      :showClose="false"
      @comfirm="handleSaveCreate"
      @cancel="handleCancelCreate"
      :comfirm-loading="getLoadingStatus('LOADING_SAVE_MIXED_TRAINING')"
    >
      <div class="detail-wrapper" v-loading="getLoadingStatus('LOADING_SELECT_ZNCOURSE_LIST')">
        <div class="top-bar" style="padding: 0">
          <el-form :model="liveQueryForm" inline ref="courseFormRef">
            <el-form-item label="直播信息">
              <el-input v-model="liveQueryForm.liveInfo" placeholder="请输入直播ID/名称"></el-input>
            </el-form-item>
            <el-form-item label="直播创建人">
              <el-input v-model="liveQueryForm.developPerson" placeholder="请输入姓名/UM号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button-item" @click="handleSearchLive">查询</el-button>
              <el-button class="button-item" @click="handleRestLive">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <table-pagination
          :list="liveColumns"
          :tableList="liveTableList"
          :queryForm="liveQueryForm"
          :getList="getLiveList"
          @selection-change="handleCreateLiveSelected"
          row-key="courseId"
          ref="liveTablePaginationRef"
          class="mixins-training-create-table"
        ></table-pagination>
      </div>
    </gc-model>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useTable } from '@/hooks/useTable'
import {
  FINISH_CONDITION_OPTIONS,
  IS_FINISH_CONDITION,
  IS_NOT_FINISH_CONDITION,
  MIXINS_TRAINING_TYPE_COURSE,
  MIXINS_TRAINING_TYPE_LIVE,
  MIXINS_ZN_COURSE_WARE_OPTIONS,
  MIXINS_ZN_LIVE_STATUS_OPTIONS
} from '@/views/Establish/enum'
import {
  fetchExportSelectMixedTrainingPage,
  fetchExportTrainingCompleteDetail,
  fetchSaveMixedTraining,
  fetchSelectMixedTrainingPage,
  fetchSelectZnCourseList,
  fetchSelectZnLiveDetail,
  fetchSelectZnLiveList,
  fetchTrainingCompleteDetail,
  fetchUpdateFinishCondition,
  fetchUpdateTrainingSortNo
} from '@/fetch/establish'
import { CopyObj, getLoadingStatus } from '@/util/utils'
import { Message } from 'element-ui'
import { useMixinsTraining } from '../hooks/useMixinsTraining'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
const { mergeReactive } = useBaseDataEvents()

const props = defineProps({
  classId: {
    type: String,
    required: true
  }
})

const isListLoadig = computed(() => {
  return (
    getLoadingStatus('LOADING_SELECT_MIXED_TRAINING_PAGE')
  )
})

const baseParams = {
  trainingType: MIXINS_TRAINING_TYPE_LIVE,
  classId: props.classId,
  isFinishCondition: ''
}

const {
  queryForm,
  query,
  tableList,
  tableFilterSetting,
  queryDatas,
  handleExport,
  handleDelete,
  // handleDetail,
  // getDetailList,
  detailTableList,
  handleExportDetails,
  detailQueryForm,
  // handleCreate,
  handleUpdateFinishCondition,
  handleSelected,
  handleDropEnd,
  getList,
  isFinisDetailShow,
  filterSpace,
  validateMultipleSelected,
  // isCreateCourseShow
} = useMixinsTraining(props, baseParams, {})

const columns = [
  {
    type: 'selection'
  },
  { slot: 'dropContainer' },
  {
    prop: 'trainingId',
    label: '知鸟直播ID'
  },
  {
    prop: 'trainingName',
    label: '知鸟直播名称'
  },
  {
    prop: 'liveStatusDesc',
    label: '直播状态',
    type: 'setWidth',
    width: 100
  },
  {
    prop: 'startTime',
    label: '直播开始时间'
  },
  {
    prop: 'createdBy',
    label: '添加人'
  }
]

const handleDetail = (row) => {
  isFinisDetailShow.value = true
  detailQueryForm.id = row.id
  detailQueryForm.liveId = row.trainingId
  getDetailList()
}

const liveTablePaginationRef = ref(null)
const handleCreate = () => {
  isCreateLiveShow.value = true
  liveTablePaginationRef.value?.clearSelection()
  // queryLive(getLiveList)
}


// 拉取明细数据
const liveDetailInfo = ref([
  {
    label: '直播时长',
    prop: 'duration',
    icon: require('@/assets/svg/mixins-training/icon-time.svg'),
    value: 0
  },
  {
    label: '直播观看人次',
    prop: 'browseSum',
    icon: require('@/assets/svg/mixins-training/icon-review.svg'),
    value: 0
  },
  {
    label: '同时在线峰值',
    prop: 'onlineMax',
    icon: require('@/assets/svg/mixins-training/icon-online.svg'),
    value: 0
  },
  {
    label: '总观众人数',
    prop: 'totalUserNum',
    icon: require('@/assets/svg/mixins-training/icon-total-user.svg'),
    value: 0
  },
  {
    label: '直播观众人数',
    prop: 'liveUserNum',
    icon: require('@/assets/svg/mixins-training/icon-view.svg'),
    value: 0
  },
  {
    label: '回看观众人数',
    prop: 'replayUserNum',
    icon: require('@/assets/svg/mixins-training/icon-review.svg'),
    value: 0
  },
  {
    label: '点赞数',
    prop: 'upSum',
    icon: require('@/assets/svg/mixins-training/icon-like.svg'),
    value: 0
  },
  {
    label: '用户评分',
    prop: 'avgRating',
    icon: require('@/assets/svg/mixins-training/icon-score.svg'),
    value: 0
  }
])
const getDetailList = async () => {
  const data = detailQueryForm
  const res = await fetchSelectZnLiveDetail({ data })
  Object.keys(res).forEach(key => {
    liveDetailInfo.value.find(row => row.prop === key) && (liveDetailInfo.value.find(row => row.prop === key).value = res[key])
  })
}

// ------------- 新增知鸟课程表格 -------------
const isCreateLiveShow = ref(false)
const baseLiveParams = {
  liveInfo: '',
  developPerson: '',
  coursewareType: [],
  liveStatus: ''
}
const {
  queryForm: liveQueryForm,
  query: queryLive,
  reset: resetLive,
  tableList: liveTableList,
  tableFilterSetting: liveTableFilter
} = useTable(baseLiveParams)
const liveColumns = [
  {
    type: 'selection',
    'reserve-selection': true
  },
  {
    prop: 'liveId',
    label: '直播ID',
    type: 'setWidth',
    width: 80
  },
  {
    prop: 'liveName',
    label: '直播名称',
  },
  {
    prop: 'liveStatusDesc',
    label: '直播状态',
    type: 'setWidth',
    width: 100,
    ...liveTableFilter('liveStatus', MIXINS_ZN_LIVE_STATUS_OPTIONS, false)
  },
  {
    prop: 'developPerson',
    label: '直播创建人'
  },
  {
    prop: 'startTime',
    label: '直播开始时间'
  }
]
const getLiveList = async () => {
  const data = CopyObj(liveQueryForm)
  data.liveInfo = filterSpace(data.liveInfo)
  data.developPerson = filterSpace(data.developPerson)

  if(!data.liveInfo && !data.developPerson) return Message.warning('请输入知鸟直播信息查询')

  const { list, total } = await fetchSelectZnLiveList({ data })
  liveTableList.value = list
  liveQueryForm.total = total
}
const handleSaveCreate = async () => {
  if(!validateMultipleSelected(createLiveSelectedList.value)) return 
  const data = {
    trainingType: MIXINS_TRAINING_TYPE_LIVE,
    classId: props.classId,
    trainingIds: createLiveSelectedList.value.map((row) => row.liveId)
  }
  await fetchSaveMixedTraining({ data })
  handleCloseCreateDialog()
  queryDatas()
}
const handleCancelCreate = () => {
  handleCloseCreateDialog()
}

const handleReset = () => {
  liveTableList.value = []
  liveTablePaginationRef.value?.resetFilters()
  resetLive()
}


const handleCloseCreateDialog = () => {
  isCreateLiveShow.value = false
  handleReset()
}

const handleRestLive = () => {
  handleReset()
  // resetLive(getLiveList)
}
const handleSearchLive = () => {
  queryLive(getLiveList)
}

const createLiveSelectedList = ref([])
const handleCreateLiveSelected = (list) => {
  createLiveSelectedList.value = list
}
</script>

<script>
export default {
  name: 'MixinsZNLive'
}
</script>
