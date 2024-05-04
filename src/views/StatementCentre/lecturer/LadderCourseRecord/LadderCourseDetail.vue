<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="讲师所属机构">
          <gc-institution v-model="queryForm.orgIds" :fetchParams="{module: TEACHER_MODULE }"></gc-institution>
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
              v-model="queryForm.dateStart"
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
              v-model="queryForm.dateEnd"
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
        v-loading="getLoadingStatus('LOADING_LECTURER_EVALUATE_DETAIL_LIST')"
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      />
    </el-card>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { pickerOptions, resetObj, filterObj, CopyObj, getLoadingStatus } from '@/util/utils'
import { 
  fetchFindLecturerDetail, 
  fetchLecturerEvaluateDetailList,
  fetchExportLecturerEvaluateDetailList,
} from '@/fetch/ladderManagement'
import { TEACHER_MODULE } from '../../enum'

const queryForm = reactive({
  orgId: '', // 讲师所属机构
  orgName: '', // 机构名称
  lecturerInfo: '', // 讲师姓名或um
  courseInfo: '', // 课程名称或ID
  dateStart: '', // 授课日期-开始时间
  dateEnd: '', // 授课日期-结束时间
  currPage: 1,
  pageSize: 10,
  total: 0,
  orgIds: []
})
// 列表相关数据
const list = [
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

const { startPickerOptions, endPickerOptions } = pickerOptions({ queryForm: queryForm })
// 查询
const query = () => {
  queryForm.currPage = 1
  getList()
}
// 重置
const reset = () => {
  resetObj(queryForm, {
    tip: 'list',
    orgId: '',
    dateStart: '',
    dateEnd: '',
    lecturerInfo: '',
    courseInfo: '', // 课程名称或ID
    currPage: 1,
    pageSize: 10,
    orgIds: []
  })
  getList()
}
// 格式化发送数据
const _formatSendParams = params => {
  let data = filterObj(params)
  const [busiType, orgId] = data.orgIds
  ;[data.busiType, data.orgId] = [busiType, orgId]
  Reflect.deleteProperty(data, 'orgIds')
  return data
}
// 导出数据
const exportHandle = () => {
  queryForm.tip = 'N'
  const data = _formatSendParams(queryForm)
  fetchExportLecturerEvaluateDetailList({ data })
}
// 获取列表数据
const tableLoading = ref(false)
const getList = () => {
  tableLoading.value = true
  queryForm.tip = 'Y'
  let data = _formatSendParams(queryForm)
  fetchLecturerEvaluateDetailList({ data })
  .then(res => {
    const { list, total } = res || {}
    tableList.value = list
    queryForm.total = total
  })
  .finally(() => {
    tableLoading.value = false
  })
}
</script>