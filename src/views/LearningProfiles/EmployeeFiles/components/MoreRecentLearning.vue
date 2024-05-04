<template>
  <div class="moreRecentLearning">
    <div class="view">
      <div class="view-left">
        <p class="sum">
          <span class="number">{{ learningTotalInfo.totalCount }}</span
          >{{currentTabInfo.sumUnitTitle}}
        </p>
        <p class="preview">{{currentTabInfo.sumUnitDesc}}</p>
      </div>
      <div class="line"></div>
      <div class="view-right">
        <p class="sum">
          <span class="number">{{ learningTotalInfo.totalHour }}</span
          >{{currentTabInfo.hourUnitTitle}}
        </p>
        <p class="preview">{{currentTabInfo.hourUnitDesc}}</p>
      </div>
    </div>
    <div class="recent">
      <div v-if="list.length" class="recent-title">最近记录</div>
      <el-timeline>
        <el-timeline-item v-for="(item, index) in list" :key="index" :hide-timestamp="true" :timestamp="index + ''">
          <template #dot>
            <div class="circle-content">
              <div class="dot-icon"></div>
            </div>
          </template>
          <div class="time-line-content">
            <span class="training-name">{{ item.studyContent }}</span>
            <span class="training-time">{{ item.studyHour }}<span class="unit">小时</span></span>
          </div>
          <div class="org-info">
            <span class="date">{{ item.studyDate }}</span>
            <span class="org-name">{{ item.orgName }}</span>
          </div>
        </el-timeline-item>
        <el-timeline-item v-if="list.length" :hide-timestamp="true">
          <template #dot>
            <div class="circle-content">
              <div class="dot-icon"></div>
            </div>
          </template>
          <div class="time-line-content">
            <span @click="getMore" class="more">查看更多</span>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
    <gc-model :title="`${currentTabInfo.label}-查看更多`" :visible="isDialogShow" width="1200px" isAppend @close="handleClose" :isShowFooter="false">
      <div class="main-container">
        <el-form :model="queryForm" inline>
          <el-form-item label="学习内容">
            <el-input class="w200 mr20" placeholder="请输入关键词" v-model="queryForm.studyContent" @keyup.enter.native="queryData" />
          </el-form-item>
          <el-form-item label="学习时间">
            <DateRange
              v-model="queryForm"
              start-key="startMonth"
              end-key="endMonth"
              :start-options="dateRangeOptions"
              :end-options="dateRangeOptions"
              popper-class="moreRecentLearning-picker"
              width="90px"
              :defaultValue="defaultValue"
            ></DateRange>
          </el-form-item>
          <div class="fr">
            <el-button class="button-w80-h30" @click="queryData" type="primary">查询</el-button>
            <el-button class="button-w80-h30" @click="resetData">重置</el-button>
            <el-button class="button-w80-h30" @click="exportHandle">导出</el-button>
          </div>
        </el-form>
        <table-pagination
          :list="columns"
          :tableList="tableList"
          :queryForm="queryForm"
          :getList="getList"
          max-height="400"
          v-loading="getLoadingStatus('LOADING_LEARNING_MORE_RECENT')"
          ref="tablePaginationRef"
        >
        </table-pagination>
      </div>
    </gc-model>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { getLoadingStatus, CopyObj, filterObj, resetObj, formatDate } from '@/util/utils'
import DateRange from '@/components/dateRange/DateRange'
import { fetchListStudyRecord, fetchListStudyRecordExport } from '@/fetch/learningProfiles'
import { useTable } from '@/hooks/useTable'
const baseParams = {
  studyContent: '',
  startMonth: '',
  endMonth: '',
  currPage: 1,
  pageSize: 10,
  total: 0
}
const columns = [
  {
    label: '姓名',
    width: '80',
    type: 'setWidth',
    prop: 'empName'
  },
  {
    label: 'UM号',
    width: '100',
    type: 'setWidth',
    prop: 'umId'
  },
  {
    label: '员工机构',
    width: '160',
    prop: 'orgName'
  },
  {
    label: '类型',
    width: '80',
    type: 'setWidth',
    prop: 'studyType'
  },
  {
    label: '学习内容',
    width: '170',
    prop: 'studyContent'
  },
  {
    label: '学习时长（小时）',
    width: '120',
    type: 'setWidth',
    prop: 'studyHour'
  },
  {
    label: '学习时间',
    width: '160',
    type: 'setWidth',
    prop: 'studyDate'
  }
]
const { queryForm, tableList, query } = useTable(baseParams)
const dateRangeOptions = { 'value-format': 'yyyy-MM-dd', type: 'month' }

const props = defineProps({
  list: [],
  learningTotalInfo: {},
  currentYear: {
    type: String,
    default: ''
  },
  currentTabInfo: {
    type: Object,
    default: {}
  },
  umId: {
    type: String,
    required: true
  },
})
// 年份选择器处理
const defaultValue = ref(new Date())
watch(
  () => props.currentYear,
  (n) => {
    defaultValue.value = new Date(n ? n + '/01/01' : new Date())
  }
)
const isDialogShow = ref(false)
const getMore = () => {
  defaultValue.value = new Date(props.currentYear ? props.currentYear + '/01/01' : new Date())
  isDialogShow.value = true
  queryData()
}
const handleClose = () => {
  resetObj(queryForm, baseParams)
  isDialogShow.value = false
}
// 格式化发送数据
const _formatSendParams = (params) => {
  const data = CopyObj(params)
  data.calYear = props.currentYear
  data.studyTypeList = [props.currentTabInfo.studyType]
  data.startMonth = data.startMonth?.replace('-', '').slice(0, 6)
  data.endMonth = data.endMonth?.replace('-', '').slice(0, 6)
  return filterObj(data)
}
// 查询事件
const queryData = () => {
  query(getList)
}
const resetData = async () => {
  resetObj(queryForm, baseParams)
  queryData()
}
const getList = async () => {
  const data = _formatSendParams(queryForm)
  const { total, list } = await fetchListStudyRecord({ data: {...data, umId: props.umId} })
  queryForm.total = total
  tableList.value = list
}
const exportHandle = async () => {
  const data = _formatSendParams(queryForm)
  await fetchListStudyRecordExport({ data: {...data, umId: props.umId} })
}
</script>

<script>
export default {
  name: 'MoreRecentLearning'
}
</script>
<style lang="scss" scoped>
.moreRecentLearning {
  margin-left: 30px;
  // width: 270px;
  width: 316px;
  margin: 26px 82px 32px 24px;
  margin-top: 0;
  .view {
    display: flex;
    justify-content: space-between;
    width: 270px;
    margin-bottom: 40px;
    .sum {
      font-family: 'PingFangSC-Regular', arial;
      font-size: 14px;
      color: #666666;
      font-weight: 400;
      .number {
        font-size: 30px;
        color: #000000;
        font-weight: 700;
        line-height: 37px;
        margin-right: 6px;
      }
    }
    .line {
      width: 1px;
      background-color: #dcdfe6;
      margin: 0 10px;
    }
    .preview {
      font-family: 'PingFangSC-Regular', arial;
      font-size: 16px;
      line-height: 20px;
      margin-top: 6px;
      color: #666666;
      line-height: 20px;
      font-weight: 400;
    }
  }
  .recent {
    .recent-title {
      font-family: 'PingFangSC-Medium', arial;
      font-size: 14px;
      line-height: 20px;
      color: #000000;
      font-weight: 500;
      margin-bottom: 28px;
    }
    :deep(.el-timeline-item) {
      padding-bottom: 11px;
    }
    .dot-icon {
      width: 8px;
      height: 8px;
      margin-left: 1px;
      border: 2px solid rgba(253, 103, 32, 1);
      background-color: #fff;
      border-radius: 50%;
    }
    .time-line-content {
      display: flex;
      margin-bottom: 6px;
      .training-name {
        font-family: 'PingFangSC-Regular', arial;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
        color: #000000;
        line-height: 14px;
        font-weight: 400;
      }
      .training-time {
        font-family: 'PingFangSC-Regular', arial;
        white-space: nowrap;
        margin-left: 16px;
        line-height: 14px;
        font-size: 14px;
        color: #000000;
        font-weight: 400;
        .unit {
          margin-left: 6px;
        }
      }
      .more {
        font-family: 'PingFangSC-Medium', arial;
        font-size: 12px;
        color: #fd6720;
        line-height: 14px;
        font-weight: 500;
        cursor: pointer;
      }
    }
    .org-info {
      display: flex;
      .date {
        width: 125px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: 'PingFangSC-Regular', arial;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 22px;
        font-weight: 400;
        margin-right: 11px;
      }
      .org-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: 'PingFangSC-Regular', arial;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
        line-height: 22px;
        font-weight: 400;
      }
    }
  }
}
.learning-picker {
  // :deep(.el-date-picker__prev-btn) {
  // display: none;
  background-color: pink;
  :deep(.el-date-picker__prev-btn) {
    background-color: red;
  }
}
:deep(.el-table th:first-of-type .cell) {
  padding-left: 15px;
  display: initial;
}
:deep(.el-table th:not(:first-child):before) {
  position: initial;
}
:deep(.el-table td:first-of-type .cell) {
  padding-left: 15px;
  display: initial;
}
</style>
<style lang="scss">
.moreRecentLearning-picker {
  .el-date-picker__prev-btn,
  .el-date-picker__next-btn {
    display: none;
  }
}
</style>