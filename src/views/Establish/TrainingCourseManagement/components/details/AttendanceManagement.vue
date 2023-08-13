<template>
  <!-- 考勤管理 -->
  <div class="establish__attendanceManagement">
    <el-card>
      <div class="menu-right">
        <div class="icons no-line">
          <span class="icons__refresh" @click="initAttendanceData">
            <i class="icons__refresh__icon"></i>刷新
          </span>
        </div>
      </div>
      <gc-table
        class="general__table mt20"
        :list="attendanceList"
        :tableList="attendanceTableList"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="操作" min-width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.classStatus !== '02003'">
              <!-- <span
                v-if="
                  scope.row.createdDate >= formatDate(new Date()) &&
                  scope.row.isFinish !== 'Y'
                "
                class="active mr20"
                @click="openERCode(scope.row)"
              >
                <el-tooltip content="二维码" popper-class="icon-popper">
                  <i class="operation__QRCode"></i>
                </el-tooltip>
              </span> -->
            </div>
            <span class="active" :class="{'mr20': scope.row.classStatus !== '02003'}"
              @click="
                templateDownload('/classFileFunc/downloadRecordByUuid', {
                  classId: classId,
                  attendanceRecordUuid: scope.row.attendanceRecordUuid,
                  checkNum: scope.$index + 1 + ''
                })
              ">
              <el-tooltip content="导出记录" popper-class="icon-popper">
                <i class="operation__exportRecord"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </gc-table>
      <div class="remark">
        <div class="left">备注</div>
        <div class="right">
          <p>
            <i class="dot"></i>
            培训班完成考勤规则：必须完成培训班第一次和最后一次签到
          </p>
          <p>
            <i class="dot"></i>
            第一次签到必须在培训班第一天完成，最后一次签到在培训班最后一天
          </p>
          <p>
            <i class="dot"></i>
            培训班时长在4个小时内可只完成一次考勤，超过4个小时，必须进行两次考勤
          </p>
        </div>
      </div>
    </el-card>

    <!-- 显示二维码的dialog -->
    <gc-model
      title="二维码"
      width="800px"
      isAppend
      :isShowFooter="false"
      :visible="erCodeVisible"
      custom-class="establish__trainingCourseManagement__attendanceManagement"
      @close="erCodeVisible = false"
      @cancel="erCodeVisible = false"
      @comfirm="erCodeVisible = false"
    >
      <div style="width: 300px; margin: auto">
        <img :src="erCodeSrc" alt="" />
        <p class="tac title fz24">请使用口袋银行家或知鸟扫码考勤</p>
      </div>
    </gc-model>

  </div>
</template>

<script>
import {
  CopyObj,
  hintFrame,
  formatDate,
  jsonHeaders,
  dataHeaders,
  templateDownload,
  addAllowKeepAlive,
  sizeChange,
  currentChange
} from '@/util/utils'
import { fetchListAttendanceRecords } from '@/fetch/trainingCourseManagement'
export default {
  name: 'AttendanceManagement',
  props: ['id', 'params'],
  data() {
    return {
      classId: '',
      // 考勤字段数组
      attendanceList: [
        // {
        //   type: 'selection',
        //   width: '54'
        // },
        {
          type: 'index', label: '考勤顺序', width: '100',
          ctx: (row, index) => "第" + Number(index+1) + "次"
        },
        { label: '考勤日期', width: '120', prop: 'createdDate' },
        { label: '开始时间', width: '120', prop: 'dateStartTime' },
        { label: '结束时间', width: '120', prop: 'dateEndTime' },
        { label: '签到类型', width: '110', prop: 'isBatchDesc' },
        { label: '已签到人数', width: '120', prop: 'studentNum' },
        { label: '应签到人数', width: '120', prop: 'needAttendNum' },
        { label: '是否完成考勤', width: '110', prop: 'isFinish',
          ctx: (row) => (row.isFinish !== 'Y' ? '未完成' : '已完成')
        }
      ],
      // 考勤数据数组
      attendanceTableList: [],
      // 二维码dialog
      erCodeVisible: false,
      // 二维码图片链接
      erCodeSrc: '',
      // 考勤批量导入 dialog 状态
      attendanceBatchImportVisible: false,
      // 考勤批量导入 tabs 分页激活项
      activeName: 'first',
      // 第一次考勤数据 对象
      firstAttendanceObj: {},
      // 最后一次考勤数据 对象
      lastAttendanceObj: {},
      //  培训班数据 考勤管理用的
      courseManagerDTO: {},
      // 事件格式化工具函数
      formatDate,
      // 下载工具函数
      templateDownload,
      // 定时器
      timer: null,
      // 存放打开的页面
      wins: [],
      sizeChange,
      currentChange,
      choiceAddAll: false,
      selectTimes:'',
      selectId:[],
      commParmas:{
        classId:'', 
        attendanceRecordUuid:''
      },
      isShowFooters:true
    }
  },
  filters: {
    filterTimeLast(val){
      if (!val) return
      val.split(' ')[1]
      return val
    }
  },
  computed: {
    componentShowFooters() {
      return this.isShowFooters
    }
  },
  methods: {
    // 初始化考勤数据
    initAttendanceData() {
      const data = { classId: this.classId }
      this.getAttendanceList(data).then((data) => {
        if (data) {
          this.courseManagerDTO = data.courseManagerDTO
          this.attendanceManagementVisible = true
        }
      })
    },
    // 获取考勤数据
    async getAttendanceList(data) {
      // const data = { classId: '2113980' }
      const res = await fetchListAttendanceRecords({data})
      res.attendanceRecordList?.forEach((v) => {
        v.createdDate = v.dateStartTime.split(' ')[0]
        v.dateStartTime = v.dateStartTime.split(' ')[1]
        v.dateEndTime = v.dateEndTime?.split(' ')[1] || ''
      })
      this.attendanceTableList = res.attendanceRecordList || []
      return res
    },
    // 为第一行和最后一行添加类名 用来高亮
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'table-hit-height'
      } else if (
        rowIndex === this.attendanceTableList.length - 1 &&
        this.courseManagerDTO.isFourHours !== 'Y'
      ) {
        return 'table-hit-height'
      }
      return ''
    },
    // 打开二维码dialog
    openERCode(row) {
      this.erCodeVisible = true
      const { classId, attendanceRecordUuid, checkNum, id } = row
      const data = {
        classId: classId,
        type: '1',
        checkNum,
        id,
        attendanceRecordUuid,
        width: '400',
        height: '400'
      }
      this.$axios
        .post(
          '/fn/classes/manager/attendance/showRrCodeForAttendance',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.erCodeSrc = data
          }
        })
    },
    timingTask() {
      this.timer = setTimeout(() => {
        this.initAttendanceData()
        this.timingTask()
      }, 10000)
    },
    doInitThing() {
      const params = this.params || this.$route.params
      if (params.id) {
        this.classId = params.id
        this.attendanceTableList = []
        this.initAttendanceData()
      }
      if (this.state === 'attendance') {
        this.getAttendanceList({ classId: this.classId })
      }
    }
  },
  mounted() {
    this.timingTask()
    if(this.params) {
      this.doInitThing();
    }
  },
  activated() {
    this.doInitThing();
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.establish__attendanceManagement {
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
      p {
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
}
</style>
