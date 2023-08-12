<template>
  <!-- 考勤管理 -->
  <div class="attendance-management">
    <el-card>
      <div class="menu-right">
        <div class="icons no-line">
          <span class="icons__refresh" @click="getList()">
            <i class="icons__refresh__icon"></i>
            刷新
          </span>
          <span class="icons__attendance" @click="saveAttendance()">
            <i class="icons__attendance__icon"></i>
            开始考勤
          </span>
        </div>
      </div>
      <table-pagination :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList">
        <el-table-column label="操作" min-width="240">
          <template slot-scope="scope">
            <template v-for="(item, index) in tableEditInfo">
              <span
                v-if="validateStatusMap(scope.row, item.value)"
                :key="index"
                :class="['active', { mr20: tableEditInfo.length - 1 > index }]"
                @click="item.handler(scope.row)"
              >
                <el-tooltip :content="item.label" popper-class="icon-popper">
                  <i :class="`operation__${item.icon}`"></i>
                </el-tooltip>
              </span>
            </template>
          </template>
        </el-table-column>
      </table-pagination>
      <!-- <div class="remark">
        <div class="left">备注</div>
        <div class="right">
          <p class="remark-item">
            <i class="dot"></i>
            培训班完成考勤规则：必须完成培训班第一次和最后一次签到
          </p>
          <p class="remark-item">
            <i class="dot"></i>
            第一次签到必须在培训班第一天完成，最后一次签到在培训班最后一天
          </p>
          <p class="remark-item">
            <i class="dot"></i>
            培训班时长在4个小时内可只完成一次考勤，超过4个小时，必须进行两次考勤
          </p>
        </div>
      </div> -->
    </el-card>

    <gc-model
      v-loading.fullscreen.lock="fullscreenLoading"
      title="签到二维码"
      width="800px"
      :visible="qrCodeVisible"
      :isShowFooter="false"
      @close="qrCodeVisible = false"
    >
      <div class="tac">
        <img :src="qrCodeSrc" alt="" />
        <p class="title fz24">请使用口袋银行家扫码签到</p>
      </div>
    </gc-model>

    <supplementRecord :supplementRecordVisible="supplementRecordVisible" :supplementRecordRow="supplementRecordRow" @close="closeSupplementRecord" />
  </div>
</template>

<script>
export default {
  name: 'CRAttendanceManagement'
}
</script>
<script setup>
import { reactive, ref, onActivated, onBeforeUnmount } from 'vue'
import { Message } from 'element-ui'
import { useRoute } from '@/router'
import { CopyObj, hintFrame } from '@/util/utils'
import {
  fetchQueryAttendancePage,
  fetchSaveAttendanceInfo,
  fetchGetAttendanceQrCode,
  fetchFinishAttendance,
  fetchDeleteAttendance,
  fetchExportAttendanceStudent
} from '@/fetch/courseRecommendation'
import supplementRecord from './components/SupplementRecord'

const columns = [
  { type: 'selection', width: '54' },
  { label: '考勤顺序', prop: 'checkNumText', width: '100' },
  { label: '考勤日期', prop: 'checkDate', width: '120' },
  { label: '开始时间', prop: 'startTime', width: '120' },
  { label: '结束时间', prop: 'endTime', width: '120' },
  { label: '已签到人数', prop: 'attendanceNum', width: '120' },
  { label: '应签到人数', prop: 'studentNum', width: '120' },
  { label: '是否完成考勤', prop: 'statusText', width: '110' }
]
const tableList = ref([])
const queryForm = reactive({
  businessType: '',
  businessId: null,
  currPage: 1,
  pageSize: 10,
  total: 0
})
const getList = () => {
  if (!queryForm.businessId || !queryForm.businessType) {
    tableList.value = []
    queryForm.total = 0
    return
  }
  fetchQueryAttendancePage({ data: queryForm })
    .then((res) => {
      tableList.value =
        res.list?.map((item) => ({
          ...item,
          checkNumText: `第${item.checkNum}次`,
          statusText: item.status === 2 ? '已完成' : '未完成'
        })) || []
      queryForm.total = res.total
    })
    .catch((e) => console.log(e))
}
const routerParams = ref({})
const query = () => {
  const router = useRoute()
  if (router.params && Object.keys(router.params).length) {
    routerParams.value = router.params
  }
  const { businessId, businessType } = routerParams.value
  queryForm.businessId = businessId
  queryForm.businessType = businessType
  getList()
}
const timer = ref(null)
const timingTask = () => {
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    getList()
    timingTask()
  }, 10000)
}
onActivated(() => {
  query()
  timingTask()
})
onBeforeUnmount(() => {
  clearTimeout(timer.value)
})

// 开始考勤
const winsArr = ref([])
const saveAttendance = () => {
  const data = {
    businessId: queryForm.businessId,
    businessType: queryForm.businessType
  }
  fetchSaveAttendanceInfo({ data })
    .then((res) => {
      openStartAttendance(res)
      getList()
    })
    .catch((e) => console.log(e))
}
// 打开考勤页面
const openStartAttendance = (row) => {
  const params = {
    attendanceId: row.attendanceId,
    checkNum: row.checkNum,
    checkDate: row.checkDate,
    startTime: row.startTime?.substring(0, 5)
  }
  const url = `/#/CRStartAttendance?params=${encodeURIComponent(JSON.stringify(params))}`
  const win = window.open(url, 'CRStartAttendance')
  win.__FLAG__ = true
  winsArr.value.push(win)
}
const closeStartAttendance = () => {
  winsArr.value.forEach((v) => v.close())
  winsArr.value = []
}
// 完成考勤
const finishAttendance = (row) => {
  hintFrame('确认完成该考勤？').then(() => {
    const data = { attendanceId: row.attendanceId }
    fetchFinishAttendance(data)
      .then(() => {
        Message.success('操作成功')
        getList()
        closeStartAttendance()
      })
      .catch((e) => console.log(e))
  })
}
// 删除考勤
const deleteAttendance = (row) => {
  hintFrame('确认删除该考勤？').then(() => {
    const data = { attendanceId: row.attendanceId }
    fetchDeleteAttendance(data)
      .then(() => {
        Message.success('删除成功')
        getList()
        closeStartAttendance()
      })
      .catch((e) => console.log(e))
  })
}
// 导出考勤
const exportHandle = (row) => {
  const data = { attendanceId: row.attendanceId }
  fetchExportAttendanceStudent(data).catch((e) => console.log(e))
}

// 显示二维码
const qrCodeVisible = ref(false)
const fullscreenLoading = ref(false)
const qrCodeSrc = ref(null)
const openQRCode = async (row) => {
  qrCodeSrc.value = ''
  const data = {
    attendanceId: row.attendanceId,
    width: 400,
    height: 400
  }
  fullscreenLoading.value = true
  qrCodeSrc.value = await fetchGetAttendanceQrCode({ data })
  qrCodeVisible.value = true
  fullscreenLoading.value = false
}

// 手工补录
const supplementRecordVisible = ref(false)
const supplementRecordRow = ref(null)
const openSupplementRecord = (row) => {
  supplementRecordVisible.value = true
  supplementRecordRow.value = CopyObj(row)
}
const closeSupplementRecord = (flag) => {
  supplementRecordVisible.value = false
  if (flag) getList()
}

// 操作相关数据map
const tableEditInfo = [
  { label: '继续考勤', value: 'keep', icon: 'attendance', handler: openStartAttendance },
  { label: '手工补录', value: 'supplement', icon: 'handworkRecord', handler: openSupplementRecord },
  { label: '二维码', value: 'qrCode', icon: 'QRCode', handler: openQRCode },
  { label: '导出记录', value: 'export', icon: 'exportRecord', handler: exportHandle },
  { label: '完成考勤', value: 'finish', icon: 'accomplishAttendance', handler: finishAttendance },
  { label: '删除', value: 'delete', icon: 'del', handler: deleteAttendance }
]
// 操作相关状态属性
const validateStatusMap = (row, type) => {
  switch (type) {
    case 'keep':
    case 'qrCode':
    case 'finish':
      return row.status !== 2
  }
  return true
}
</script>

<style lang="scss" scoped>
.attendance-management {
  .remark {
    display: flex;
    margin-top: 30px;
    color: #7d8292;
    line-height: 18px;
    .left {
      margin-left: 15px;
    }
    .right {
      margin-left: 20px;
    }
    .remark-item {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
      &:last-child {
        margin-bottom: 0;
      }
      i {
        margin-right: 8px;
      }
    }
  }
}
</style>
