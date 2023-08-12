<template>
  <div>
    <gc-model
      title="手工补录"
      width="1200px"
      :isShowFooter="isShowFooter"
      isAppend
      :visible.sync="supplementRecordVisible"
      @close="supplementRecordClose()"
      @cancel="supplementRecordClose()"
      @comfirm="supplementRecordComfirm()"
    >
      <el-tabs v-model="tabActive" @tab-click="tabClick">
        <div class="aic tab-search">
          <div>所属机构</div>
          <gc-institution class="ml10" v-model="queryForm.orgIds" :orgUrl="APIAllTree" busiType="LS" :left-show="false" />
          <div class="ml20">学员信息</div>
          <el-input class="w200 ml10" placeholder="请输入姓名/UM号" v-model.trim="queryForm.umOrName" clearable />
          <el-button type="primary" class="button-60-h30 ml20" @click="handleSearch()">查询</el-button>
          <el-button class="button-60-h30 ml20" @click="reset()">重置</el-button>
        </div>
        <el-row v-if="supplementRecordRow" class="row-times mb20">
          <el-col :span="6">
            <span>本次考勤日期： {{ supplementRecordRow.checkDate }} </span>
          </el-col>
          <el-col :span="6">
            <span>
              开始时间：
              <el-time-picker
                class="w-100"
                v-model="supplementRecordRow.startTime"
                value-format="HH:mm:ss"
                disabled
                popper-class="CaseCenter__addCase__case-time-pick"
              >
              </el-time-picker>
            </span>
          </el-col>
          <el-col :span="6">
            <span>
              结束时间：
              <el-time-picker
                class="w-100"
                v-model="supplementRecordRow.endTime"
                value-format="HH:mm:ss"
                disabled
                popper-class="CaseCenter__addCase__case-time-pick"
              >
              </el-time-picker
            ></span>
          </el-col>
        </el-row>
        <el-tab-pane label="未签到学员信息" name="notFinish">
          <div class="mb10"><span class="active" @click="openChoiceTime()">批量操作</span></div>
          <table-pagination
            :list="notFinishColumns"
            :tableList="notFinishList"
            :queryForm="queryNotFinishForm"
            :getList="getNotFinishList"
            @selection-change="selectionHandle"
          >
            <el-table-column label="补录签到时间" width="200" class-name="w-100">
              <template slot-scope="scope">
                <el-time-picker v-model="scope.row.checkTime" :clearable="false" value-format="HH:mm:ss" placeholder="选择时间"></el-time-picker>
              </template>
            </el-table-column>
          </table-pagination>
        </el-tab-pane>
        <el-tab-pane label="已签到学员信息" name="finish">
          <div class="mb10"><span class="active" @click="clearFinishRecord()">清空</span></div>
          <table-pagination :list="finishColumns" :tableList="finishList" :queryForm="queryFinishForm" :getList="getFinishList"></table-pagination>
        </el-tab-pane>
      </el-tabs>
    </gc-model>

    <gc-model title="批量修改选中学员的签到时间" width="550px" :visible.sync="choiceTimeVisible" isAppend @comfirm="batchTimeEdit()">
      <div class="mb20">
        <span class="ml30 mr30">签到时间</span>
        <el-time-picker v-model="choiceTime" :clearable="false" value-format="HH:mm:ss" placeholder="选择时间"> </el-time-picker>
      </div>
    </gc-model>
  </div>
</template>

<script>
export default {
  name: 'SupplementRecord'
}
</script>
<script setup>
import { watch, reactive, ref, computed } from 'vue'
import { Message } from 'element-ui'
import { hintFrame } from '@/util/utils'
import { APIAllTree } from '@/fetch/public'
import { fetchQueryAttendanceStudentPage, fetchAddBatchAttendanceRecord, fetchClearAttendanceRecord } from '@/fetch/courseRecommendation'

const props = defineProps({
  supplementRecordVisible: {
    type: Boolean,
    default: false
  },
  supplementRecordRow: {
    type: Object,
    default: () => {}
  }
})

const queryForm = reactive({
  attendanceId: null,
  orgIds: [],
  umOrName: ''
})

// 未签到
const notFinishColumns = [
  { type: 'selection', width: '54' },
  { type: 'index', label: '序号', width: '60' },
  { label: '学员姓名', prop: 'empName', width: '100' },
  { label: '学员UM号', prop: 'umId', width: '120' },
  { label: '所属机构', prop: 'orgName', width: '200' },
  { label: '签到日期', prop: 'checkDate', width: '120' }
]
const queryNotFinishForm = reactive({
  status: 1,
  currPage: 1,
  pageSize: 10,
  total: 0
})
const notFinishList = ref([])
const getNotFinishList = () => {
  queryNotFinishForm.attendanceId = queryForm.attendanceId
  queryNotFinishForm.orgId = queryForm.orgIds.length ? queryForm.orgIds.slice(-1)[0] : ''
  queryNotFinishForm.umOrName = queryForm.umOrName
  fetchQueryAttendanceStudentPage({ data: queryNotFinishForm })
    .then((res) => {
      notFinishList.value = res.list || []
      queryNotFinishForm.total = res.total
    })
    .catch((e) => console.log(e))
}

// 已签到
const finishColumns = [
  { type: 'index', label: '序号', width: '60' },
  { label: '学员姓名', prop: 'empName', width: '100' },
  { label: '学员UM号', prop: 'umId', width: '120' },
  { label: '所属机构', prop: 'orgName', width: '200' },
  { label: '签到日期', prop: 'checkDate', width: '120' },
  { label: '签到时间', prop: 'checkTime', width: '120' }
]
const queryFinishForm = reactive({
  status: 2,
  currPage: 1,
  pageSize: 10,
  total: 0
})
const finishList = ref([])
const getFinishList = () => {
  queryFinishForm.attendanceId = queryForm.attendanceId
  queryFinishForm.orgId = queryForm.orgIds.length ? queryForm.orgIds.slice(-1)[0] : ''
  queryFinishForm.umOrName = queryForm.umOrName
  fetchQueryAttendanceStudentPage({ data: queryFinishForm })
    .then((res) => {
      finishList.value = res.list || []
      queryFinishForm.total = res.total
    })
    .catch((e) => console.log(e))
}

const tabActive = ref('notFinish')
watch(
  () => props.supplementRecordVisible,
  (newVal) => {
    tabActive.value = 'notFinish'
    queryForm.attendanceId = props.supplementRecordRow?.attendanceId
    resetQuery()
    queryFinishForm.currPage = 1
    queryFinishForm.pageSize = 10
    if (newVal) {
      getNotFinishList()
    }
  }
)
const isShowFooter = computed(() => tabActive.value !== 'finish')

const tabClick = (tab) => {
  queryForm.orgIds = []
  queryForm.umOrName = ''
  if (tab && tab.name === 'finish') {
    getFinishList()
  } else {
    getNotFinishList()
  }
}

// 搜索学员
const handleSearch = () => {
  if (tabActive.value === 'finish') {
    getFinishList()
  } else {
    getNotFinishList()
  }
}
const resetQuery = () => {
  queryForm.orgIds = []
  queryForm.umOrName = ''
  if (tabActive.value === 'finish') {
    queryFinishForm.currPage = 1
    queryFinishForm.pageSize = 10
  } else {
    queryNotFinishForm.currPage = 1
    queryNotFinishForm.pageSize = 10
  }
}
const reset = () => {
  resetQuery()
  handleSearch()
}

// 批量修改补录时间
const choiceTimeVisible = ref(false)
const choiceTime = ref('')
const selectId = ref([])
const selectionHandle = (list) => {
  selectId.value = list.map((v) => v.umId)
}
// 补录时间默认开始时间
const openChoiceTime = () => {
  if (selectId.value.length === 0) return Message.warning('请选择学员')
  choiceTimeVisible.value = true
  choiceTime.value = props.supplementRecordRow?.startTime || ''
}
const batchTimeEdit = () => {
  notFinishList.value.forEach((row) => {
    if (selectId.value.includes(row.umId)) {
      row.checkTime = choiceTime.value
    }
  })
  choiceTimeVisible.value = false
}

const emit = defineEmits(['close'])
const supplementRecordClose = () => {
  emit('close')
}
const supplementRecordComfirm = () => {
  const studentList = notFinishList.value
    .filter((v) => v.checkTime)
    .map((v) => ({
      umId: v.umId,
      checkTime: `${v.checkDate} ${v.checkTime}`
    }))
  const data = {
    attendanceId: queryForm.attendanceId,
    studentList
  }
  fetchAddBatchAttendanceRecord(data)
    .then(() => {
      Message.success('手工补录成功')
      emit('close', true)
    })
    .catch((e) => console.log(e))
}

// 清空学员打卡记录
const clearFinishRecord = () => {
  hintFrame('清空后将删除所有的学员签到信息,无法恢复,请谨慎操作！').then(() => {
    const data = { attendanceId: queryForm.attendanceId }
    fetchClearAttendanceRecord(data)
      .then(() => {
        Message.success('清空学员打卡记录')
        getFinishList()
      })
      .catch((e) => console.log(e))
  })
}
</script>

<style lang="scss" scoped>
.tab-search,
.row-times {
  margin-bottom: 15px;
  line-height: 30px;
}
</style>
