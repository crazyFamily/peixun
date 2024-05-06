<template>
  <div class="TrainerManagement">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="部门">
          <div class="df">
            <gc-institution v-model="queryForm.busiType"> </gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10">包含子部门</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="评聘年度">
          <gc-select class="p0" k="evaluateYearName" v="evaluateYearId" :options="evaluateYearOptions" v-model="queryForm.evaluateYear"> </gc-select>
        </el-form-item>
        <el-form-item label="培训师类型">
          <gc-select :options="TRAINER_TYPES" v-model="queryForm.trainerType"></gc-select>
        </el-form-item>
        <el-form-item label="授课领域">
          <gc-select
            class="p0"
            k="dataValue"
            v="dataEncode"
            v-model="queryForm.lecturesArea"
            placeholder="请选择授课领域"
            :options="lecturesAreaOptions"
          >
          </gc-select>
        </el-form-item>
        <el-form-item label="培训师UM号/姓名">
          <el-input v-model.trim="queryForm.teacherUm"></el-input>
        </el-form-item>
        <el-form-item label="直播日期">
          <el-form-item>
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateStart"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :picker-options="startPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateEnd"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :picker-options="endPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="在职状态">
          <gc-select v-model="queryForm.isLeaved" :options="LEAVE_STATUS"></gc-select>
        </el-form-item>

        <div class="buttons">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetData" class="button-w80-h30">重置</el-button>
          <!-- <el-button @click="download" class="button-w80-h30">导出</el-button> -->
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="download">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <table-pagination :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePaginationRef"> </table-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'LiveRecordS',
}
</script>

<script setup>
import { useTable } from '@/hooks/useTable'
import { CopyObj } from '@/util/utils'
import { fetchLiveRecordListByTrainers, fetchExportLiveRecordListByTrainers, fetchListDictsForSelector } from '@/fetch/trainerManagement'
import { fetchListEvaluationYear } from '@/fetch/pointManagement'
import { TRAINER_TYPES, LEAVE_STATUS } from '@/views/TrainerManagement/enum'
import { ref } from 'vue'
import { Message } from 'element-ui'

const baseParams = {
  // 条线
  busiType: '',
  orgId: '',
  // 选择子机构标识
  isGotSubBranch: true,
  evaluateYear: '',
  trainerType: '',
  lecturesArea: '',
  teacherUm: '',
  isLeaved: '',
  // 开始日期  格式: yyyy-MM-dd
  dateStart: '',
  // 结束日期 格式: yyyy-MM-dd
  dateEnd: '',
  //当前页
  currPage: 1,
  //每页大小
  pageSize: 10,
  tip: 'Y'
}
const { queryForm, tableList, query, reset, tableFilterSetting, dataRangeRules } = useTable(baseParams)

const { startPickerOptions, endPickerOptions } = dataRangeRules('dateStart', 'dateEnd')

const columns = [
  {
    label: '序号',
    type: 'index',
    width: '64'
  },
  {
    label: '培训师UM账号',
    prop: 'leaderUm',
    width: '120'
  },
  {
    label: '培训师姓名',
    prop: 'leaderName',
    width: '120'
  },
  {
    label: '所在部门',
    prop: 'teacherOrgName',
    width: '180'
  },
  {
    label: '所在岗位',
    prop: 'postDesc',
    width: '180'
  },
  {
    label: '培训师类型',
    prop: 'trainersTypeName',
    width: '180'
  },
  {
    label: '授课领域一',
    prop: 'lecturesAreaFirstName',
    width: '180'
  },
  {
    label: '授课领域二',
    prop: 'lecturesAreaSecName',
    width: '180'
  },
  {
    label: '评聘年度',
    prop: 'evaluateYear',
    width: '180'
  },
  {
    label: '在职状态',
    prop: 'isLeaved',
    width: '100'
  },

  {
    label: '直播ID',
    prop: 'liveId',
    width: '80'
  },
  {
    label: '直播名称',
    prop: 'liveName',
    width: '120'
  },
  {
    label: '主讲时长（分钟）',
    prop: 'learnTime',
    width: '120'
  },
  {
    label: '直播开始时间',
    prop: 'startTime',
    width: '160'
  },
  {
    label: '直播结束时间',
    prop: 'finishTime',
    width: '160'
  },
  {
    label: '积分状态',
    prop: 'scoreStatus',
    width: '100'
  }
]

// 获取年度数据
const evaluateYearOptions = ref([])
const getEvaluateYearOptions = async () => {
  const list = await fetchListEvaluationYear()
  evaluateYearOptions.value = list
  queryForm.evaluateYear = list.slice(-1)[0]?.evaluateYearId
}
getEvaluateYearOptions()

// 获取授课领域
const lecturesAreaOptions = ref([])
const getLecturesAreaOptions = async () => {
  const data = { dataCtgy: 'trainer_course_area' }
  const list = await fetchListDictsForSelector({ data })
  lecturesAreaOptions.value = list
}
getLecturesAreaOptions()

const formatParams = (params) => {
  const data = CopyObj(params)
  data.busiType = params.busiType[0]
  data.orgId = params.busiType[1]
  data.isGotSubBranch = params.isGotSubBranch ? 'Y' : 'N'
  return data
}
const getList = async () => {
  if(!queryForm.busiType.length) return Message.warning('请先选择机构和条线')
  const data = formatParams(queryForm)
  const {list, total} = await fetchLiveRecordListByTrainers({ data })
  tableList.value = list
  queryForm.total = total
}

const queryData = () => {
  query(getList)
}

const resetData = () => {
  // tableList.value = []
  reset()
}

const download = async () => {
  if(!queryForm.busiType.length) return Message.warning('请先选择机构和条线')
  const data = formatParams(queryForm)
  await fetchExportLiveRecordListByTrainers({ data })
}
</script>