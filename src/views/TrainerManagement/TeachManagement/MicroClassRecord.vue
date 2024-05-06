<template>
  <div class="record-wrapper">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="课程作者部门">
          <div class="df">
            <gc-institution v-model="queryForm.orgId"></gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10" true-label="Y" false-label="N">包含子部门</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="课程ID/名称">
          <el-input v-model="queryForm.courseId"></el-input>
        </el-form-item>
        <el-form-item label="课程作者">
          <el-input v-model="queryForm.author"></el-input>
        </el-form-item>
        <el-form-item label="课程上传者">
          <el-input v-model="queryForm.uploadUM"></el-input>
        </el-form-item>
        <el-form-item label="课程来源">
          <gc-select v-model="queryForm.courseSource" :options="COURSE_SOURCE"></gc-select>
        </el-form-item>
        <el-form-item label="审核日期" class="mr10">
          <DateRange
            v-model="queryForm"
            start-key="auditDateStart"
            end-key="auditDateEnd"
            :start-options="dateRangeOptions"
            :end-options="dateRangeOptions"
            width="90px"
          ></DateRange>
        </el-form-item>
        <el-form-item label="上传日期" class="mr10">
          <DateRange
            v-model="queryForm"
            start-key="uploadDateStart"
            end-key="uploadDateEnd"
            :start-options="dateRangeOptions"
            :end-options="dateRangeOptions"
            width="90px"
          ></DateRange>
        </el-form-item>
        <div class="buttons">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetData" class="button-w80-h30">重置</el-button>
          <el-button @click="download" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <table-pagination :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePaginationRef"> </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import DateRange from '@/components/dateRange/DateRange'
import { reactive, ref } from 'vue'
import { useTable } from '@/hooks/useTable'
import { COURSE_SOURCE } from '../enum'
import { CopyObj } from '@/plugins/until'
import { fetchExportMicrocoursesList, fetchMicrocoursesList } from '@/fetch/trainerManagement'
import { Message } from 'element-ui'

const baseParams = {
  courseName: '',
  courseId: '',
  author: '',
  orgId: [],
  uploadUM: '',
  courseSource: '',
  auditDateStart: '',
  auditDateEnd: '',
  uploadDateStart: '',
  uploadDateEnd: '',
  isGotSubBranch: 'Y',
  total: 0,
  currPage: 1,
  pageSize: 10
}
const { queryForm, query, tableList, reset } = useTable(baseParams)
const dateRangeOptions = { 'value-format': 'yyyy-MM-dd', type: 'month' }

const formatParams = (params) => {
  const data = CopyObj(params)
  console.log(data.courseId, /^[a-zA-Z0-9]+$/.test(data.courseId));
  // if (!/[\da-zA-Z]+/.test(data.courseId)) {
  if (!/^[a-zA-Z0-9]+$/.test(data.courseId)) {
    data.courseName = data.courseId
    data.courseId = ''
  }
  data.orgId = data.orgId?.[1]
  return data
}

const columns = [
  {
    label: '序号',
    type: 'index',
    width: '64'
  },
  {
    label: '课程id',
    prop: 'courseId',
    width: '100'
  },
  {
    label: '课程名称',
    prop: 'courseName',
    width: '220'
  },
  {
    label: '课程来源',
    prop: 'courseSource',
    width: '100'
  },
  {
    label: '作者UM',
    prop: 'authorUM',
    width: '120'
  },
  {
    label: '作者姓名',
    prop: 'authorName',
    width: '120'
  },
  {
    label: '作者所在部门',
    prop: 'authorOrgName',
    width: '200'
  },
  {
    label: '作者总人数',
    prop: 'courseDevoloppersCnt',
    width: '100'
  },
  {
    label: '上传者UM',
    prop: 'uploadEmpUM',
    width: '120'
  },
  {
    label: '上传者姓名',
    prop: 'uploadEmpName',
    width: '120'
  },

  {
    label: '上传日期',
    prop: 'uploadTime',
    width: '150'
  },
  {
    label: '审核日期',
    prop: 'auditTime',
    width: '100'
  },
  {
    label: '同步时间',
    prop: 'syncTime',
    width: '150'
  },
  {
    label: '积分状态',
    prop: 'scoreStatus',
    width: '100'
  }
]

const getList = async () => {
  const data = formatParams(queryForm)
  if(!data.orgId) return Message.warning('请先选择课程作者部门')
  const {total, list} = await fetchMicrocoursesList({data})
  queryForm.total = total
  tableList.value = list
}

const queryData = () => {
  query(getList)
}

const resetData = () => {
  reset(getList)
}

const download = () => {
  const data = formatParams(queryForm)
  fetchExportMicrocoursesList({ data })
}
</script>
<script>
export default {
  name: 'MicroClassRecord'
}
</script>

<style lang="scss" scoped></style>