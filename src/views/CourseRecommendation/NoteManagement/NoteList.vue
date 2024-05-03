<template>
  <div class="note-list-wrapper">
    <el-card class="note-list-header">
      <el-form ref="form" :model="queryInfo" :inline="true">
        <el-form-item label="课程ID">
          <el-input class="w200" placeholder="请输入课程ID" v-model.trim="queryInfo.sbjId" @change="courseIdChange" clearable></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input class="w200" placeholder="请输入课程名称" v-model.trim="queryInfo.courseName" clearable></el-input>
        </el-form-item>
        <el-form-item label="评论关键字">
          <el-input class="w200" placeholder="请输入评论关键字" v-model.trim="queryInfo.keyWord" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <gc-select class="w-200" :options="STATUS_OPTIONS" v-model="queryInfo.status" @change="statusChange" k="label" v="value"></gc-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker class="rms-daterange-picker" v-model="queryInfo.dateRange" @change="dateChange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :clearable="false">
          </el-date-picker>
        </el-form-item>
        <div class="note-list-search-button">
          <el-button class="button-w80-h30" type="primary" @click="reQuery">查询</el-button>
          <el-button class="button-w80-h30" @click="reset">重置</el-button>
          <el-button class="button-w80-h30" type="primary" @click="exportNote">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="note-list-operation-button">
        <el-button type="text" @click="batchActivation">批量启用</el-button>
        <el-button type="text" @click="batchBlock">批量屏蔽</el-button>
      </div>
      <table-pagination ref="courseNoteTable" :list="NOTE_COLUMNS" :tableList="noteList" :getList="search" :queryForm="queryInfo" @select="select" @select-all="select" :pageSizes="[ 10, 20]">
        <el-table-column label="操作" width="140" prop="" fixed="right">
          <template slot-scope="scope">
            <span class="note-table-opera" @click="updateStatus(scope.row)">{{scope.row.status === 0 ? '屏蔽' : scope.row.status === 1 ? '启用' : ''}}</span>
            <span class="note-table-opera" @click="goPageDetail(scope.row)">详情</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 笔记详情 -->
    <!-- 23.10.12版本原笔记字段名称全部更新为评论字段 -->
    <NoteDetail ref="noteDetailRef" :isShowDetail.sync="isShowDetail" :id="noteInfo.id" :detailInfo="noteInfo.detail" @updateStatus="updateStatus"></NoteDetail>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from 'element-ui'
import { STATUS_OPTIONS, NOTE_COLUMNS } from '@/views/CourseRecommendation/enum'
import { addAllowKeepAlive, getCurrentTime, numerationBeforewardsDays } from '@/util/utils'
import {
  fetchCommentList,
  fetchCommentDetail,
  fetchExportComment,
  fetchProcessBatchKickOff,
  fetchProcessBatchShield
} from '@/fetch/courseRecommendation'
import NoteDetail from './NoteDetail'

// 搜索条件
let queryInfo = reactive({
  sbjId: null, // 课程ID
  courseName: '',
  keyWord: '',
  sbjType: 0, // 主题类型 0 课程 必传
  status: null, // 0 正常 1 屏蔽
  startTime: '', // 笔记创建的开始时间
  endTime: '', // 笔记创建的结束时间
  prnId: 0, // 父级ID 查询笔记 传入0 必传
  dateRange: [], // 笔记的时间范围
  currPage: 1,
  pageSize: 10,
  total: 0
})

// 重置搜索条件
const reset = () => {
  queryInfo.sbjId = null,
  queryInfo.courseName = '',
  queryInfo.keyWord = '',
  queryInfo.status = null,
  queryInfo.startTime = '',
  queryInfo.endTime = '',
  queryInfo.dateRange = [],
  queryInfo.currPage = 1
}

// 默认时间范围为最近一个月
const getDefaultDate = () => {
  let today = new Date()
  let startDate = numerationBeforewardsDays(today, 30)
  let endDate = getCurrentTime()
  queryInfo.dateRange.push(startDate, endDate)
  queryInfo.startTime = startDate
  queryInfo.endTime = endDate
  search()
}

const dateChange = (val) => {
  queryInfo.startTime = val[0]
  queryInfo.endTime = val[1]
}

// 清除id重置为null
const courseIdChange = () => {
  queryInfo.sbjId = queryInfo.sbjId.replace(/\D/g, '') // 课程id限制只输入数字
  if (!queryInfo.sbjId) queryInfo.sbjId = null
}

// 清除状态重置为null
const statusChange = (s) => {
  if (!s) queryInfo.status = null
}

let noteList = ref([]) // 笔记列表
// 获取列表数据
const search = async () => {
  const { dateRange, total, ...data } = queryInfo
  data.status = data.status && Number(data.status)
  const res = await fetchCommentList({ data })
  noteList.value = res.list || []
  queryInfo.total = res.total || 0
}

let ids = ref([]) // 批量开启/屏蔽 id
// 单个/多个选中
const select = (selection) => {
  ids.value = selection?.map(val => val.id)
}

const reQuery = () => {
  queryInfo.currPage = 1
  search()
}

let noteDetailRef = ref(null)
// 批量启用
const batchActivation = async (row) => {
  if (!ids.value?.length) return Message.error('请至少勾选一条评论')
  let data = { ids: ids.value }
  await fetchProcessBatchKickOff({ data })
  Message.success('操作成功')
  if (row.review) {
    noteDetailRef.value.reQuery() // 评论更新成功刷新评论列表
  } else {
    reQuery()  // 笔记更新刷新笔记列表
  }
}

// 批量屏蔽
const batchBlock = async (row) => {
  if (!ids.value?.length) return Message.error('请至少勾选一条评论')
  let data = { ids: ids.value }
  await fetchProcessBatchShield({ data })
  Message.success('操作成功')
  if (row.review) {
    noteDetailRef.value.reQuery()
  } else {
    reQuery()
  }
}

// 单个笔记/评论的启用/屏蔽
const updateStatus = (row) => {
  ids.value = []
  ids.value.push(row.id)
  if (row.status === 1) {
    batchActivation(row)
  } else if (row.status === 0) {
    batchBlock(row)
  }
}

// 导出
const exportNote = async () => {
  const { dateRange, total, pageSize, currPage, ...data } = queryInfo
  await fetchExportComment({ data })
  Message.success('导出成功')
}

let isShowDetail = ref(false) // 显示笔记详情
let noteInfo = reactive({
  id: null, // 笔记id
  detail: {} // 笔记详情
})
// 打开笔记详情
const goPageDetail = async (row) => {
  const res = await fetchCommentDetail({ ciId: row.id || '' })
  noteInfo.detail = res || {}
  noteInfo.id = row.id
  isShowDetail.value = true
}

onMounted(() => {
  getDefaultDate()
})
</script>

<style scoped>
.note-list-wrapper .el-form > .el-form-item {
  margin-right: 60px;
}
.note-list-wrapper .el-form > .el-form-item .gc-select {
  padding: 0;
}
.note-list-operation-button {
  margin-bottom: 10px;
  display: -webkit-box;
  justify-content: flex-end;
}
.note-list-operation-button .el-button {
  font-weight: 400;
}
.note-table-opera {
  margin-right: 15px;
  color: #fd6720;
  cursor: pointer;
}
.note-list-search-button {
  float: right;
}
:deep(.between) {
  justify-content: center;
}
:deep(.el-card__body) {
  padding-bottom: 0;
}
</style>