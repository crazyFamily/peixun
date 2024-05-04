<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="讲师所属机构">
          <gc-institution
            :leftShow="false"
            :default-show="true"
            v-model="queryForm.orgIds"
            @setDataFinish="orgIdsFinish"
            :busiType="$store.state.userInfo.blgStripLine"
            ref="institutionRef"
          ></gc-institution>
        </el-form-item>
        <el-form-item label="讲师信息">
          <gc-input placeholder="请输入姓名/UM号" v-model.trim="queryForm.lecturerInfo"></gc-input>
        </el-form-item>
        <el-form-item label="课程信息">
          <gc-input placeholder="请输入课程名称/编号" v-model.trim="queryForm.courseInfo"></gc-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="授课日期">
            <el-date-picker
              class="w-120"
              v-model="queryForm.startTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="至" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form-item>

        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="exportHandle" class="button-w80-h30" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        v-loading="tableLoading"
        ref="tablePagination"
      />
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { pickerOptions, resetObj, filterObj, CopyObj } from '@/util/utils'
import { fetchFindLecturerDetail, fetchListGrantCourseDetail, fetchExportListGrantCourseDetail } from '@/fetch/ladderManagement'

let cacheOrgIds = ref([])
const institutionRef = ref(null)
const queryForm = ref({
  orgId: '', // 讲师所属机构
  orgName: '', // 机构名称
  lecturerInfo: '', // 讲师姓名或um
  courseInfo: '', // 课程名称或ID
  startTime: '', // 授课日期-开始时间
  endTime: '', // 授课日期-结束时间
  currPage: 1,
  pageSize: 10,
  total: 0,
  orgIds: []
})
// 列表相关数据
const list = [
  // { type: 'selection' },
  // { slot: 'teacherName', width: '146' },
  { width: '120', label: '讲师姓名', prop: 'teacherName' },
  { width: '120', label: '讲师UM号', prop: 'teacherUm' },
  { width: '220', label: '讲师所在机构', prop: 'orgName' },
  { width: '120', label: '讲师岗位', prop: 'postDesc' },
  { width: '120', label: '授课课程名称', prop: 'courseName' },
  { width: '110', label: '授课课程编号', prop: 'courseId' },
  { width: '110', label: '培训班名称', prop: 'className' },
  { width: '110', label: '培训班编号', prop: 'classId' },
  { width: '110', label: '授课日期', prop: 'courseDate' },
  { width: '110', label: '授课评分', prop: 'lectureScore' }
]
const tableList = ref([])
const orgIdsFinish = () => {
  cacheOrgIds.value = CopyObj(queryForm.value.orgIds)
  getList()
}
const { startPickerOptions, endPickerOptions } = pickerOptions({ queryForm: queryForm.value })
// 查询
const query = () => {
  queryForm.value.currPage = 1
  getList()
}
// 重置
const reset = () => {
  resetObj(queryForm.value, {
    tip: 'list',
    orgId: '',
    startTime: '',
    endTime: '',
    lecturerInfo: '',
    courseInfo: '', // 课程名称或ID
    currPage: 1,
    pageSize: 10,
    orgIds: cacheOrgIds
  })
  institutionRef.value.createTreeData()
  // getList()
}
// 格式化发送数据
const _formatSendParams = params => {
  let data = filterObj(params)
  data.orgId = data.orgIds?.[1]
  Reflect.deleteProperty(data, 'orgIds')
  return data
}
// 导出数据
const exportHandle = () => {
  queryForm.value.tip = 'N'
  const data = _formatSendParams(queryForm.value)
  fetchExportListGrantCourseDetail({ request: data })
}
// 获取列表数据
const tableLoading = ref(false)
const getList = () => {
  tableLoading.value = true
  queryForm.value.tip = 'Y'
  let data = _formatSendParams(queryForm.value)
  fetchListGrantCourseDetail({ request: data })
  .then(res => {
    const { list, total } = res || {}
    tableList.value = list
    queryForm.value.total = total
  })
  .finally(() => {
    tableLoading.value = false
  })
}
</script>