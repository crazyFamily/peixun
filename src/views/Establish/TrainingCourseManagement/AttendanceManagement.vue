<template>
  <!-- 考勤管理 -->
  <div class="establish__attendanceManagement">
    <el-card>
      <div class="menu-right">
        <div class="icons no-line">
          <span class="icons__refresh" @click="initAttendanceData">
            <i class="icons__refresh__icon"></i>
            刷新
          </span>
          <span
            class="icons__attendance"
            @click="goToAttendance(courseManagerDTO)"
          >
            <i class="icons__attendance__icon"></i>
            开始考勤
          </span>
          <span class="icons__download" @click="openAttendanceBatchImport">
            <i class="icons__download__icon"></i>
            批量导入
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
              <span
                v-if="
                  scope.row.isContinueAttendance === 'Y' &&
                  scope.row.isFinish !== 'Y'
                "
                class="active mr20"
                @click="goAttendance(scope.row)"
              >
                <el-tooltip content="继续考勤" popper-class="icon-popper">
                  <i class="operation__attendance"></i>
                </el-tooltip>
              </span>
              <span
                class="active mr20"
                @click="openSupplementRecord(scope.row)"
              >
                <el-tooltip content="手工补录" popper-class="icon-popper">
                  <i class="operation__handworkRecord"></i>
                </el-tooltip>
              </span>
              <span
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
              </span>
              <span
                class="active mr20"
                @click="
                  templateDownload('/classFileFunc/downloadRecordByUuid', {
                    classId,
                    attendanceRecordUuid: scope.row.attendanceRecordUuid,
                    checkNum: scope.$index + 1 + ''
                  })
                "
              >
                <el-tooltip content="导出记录" popper-class="icon-popper">
                  <i class="operation__exportRecord"></i>
                </el-tooltip>
              </span>
              <span
                v-if="scope.row.isFinish !== 'Y'"
                class="active mr20"
                @click="accomplishAttendance(scope.row)"
              >
                <el-tooltip content="完成考勤" popper-class="icon-popper">
                  <i class="operation__accomplishAttendance"></i>
                </el-tooltip>
              </span>
              <span
                class="active"
                @click="delOneItemAttendance(scope.row, scope.$index)"
              >
                <el-tooltip content="删除" popper-class="icon-popper">
                  <i class="operation__del"></i>
                </el-tooltip>
              </span>
            </div>
            <span
              class="active"
              v-else
              @click="
                templateDownload('/classFileFunc/downloadRecordByUuid', {
                  classId,
                  attendanceRecordUuid: scope.row.attendanceRecordUuid,
                  checkNum: scope.$index + 1 + ''
                })
              "
            >
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

    <!-- 考勤批量导入dialog -->
    <gc-model
      title="考勤批量导入"
      width="1200px"
      isAppend
      :visible="attendanceBatchImportVisible"
      custom-class="establish__trainingCourseManagement__attendanceBatchImport"
      @close="attendanceBatchImportClose"
      @cancel="attendanceBatchImportVisible = false"
      @comfirm="attendanceBatchImportVisible = false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="第一次考勤" name="first">
          <div class="aic">
            <span class="mr30">考勤日期：{{ firstAttendanceObj.date }}</span>
            <div class="aic mr30">
              <span class="mr10">开始时间</span>
              <div class="w-100">
                <el-time-picker
                  v-model="firstAttendanceObj.startTime"
                  :disabled="firstAttendanceObj.startFlag"
                  :clearable="false"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="startTimeChange($event, firstAttendanceObj)"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </div>
            </div>
            <div class="aic">
              <span class="mr10">结束时间</span>
              <div class="w-100">
                <el-time-picker
                  v-model="firstAttendanceObj.endTime"
                  :clearable="false"
                  :disabled="firstAttendanceObj.endFlag"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="endTimeChange($event, firstAttendanceObj)"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </div>
            </div>
          </div>
          <div class="menu-right">
            <div class="icons no-line df">
              <span class="icons__upload">
                <gc-fileInput @change="attendanceUploadFile">
                  <i class="icons__upload__icon"></i>
                  上传导入文件
                </gc-fileInput>
              </span>
              <span
                class="icons__download"
                @click="
                  templateDownload('/common/file/downloadModule', {
                    fileCode: 'attendanceStudentModule'
                  })
                "
              >
                <i class="icons__download__icon"></i>
                导入模版下载
              </span>
            </div>
          </div>
          <gc-table
            class="general__table"
            :list="firstAttendanceList"
            :tableList="firstAttendanceObj.attendanceStudents"
          >
          </gc-table>
        </el-tab-pane>
        <el-tab-pane label="最后一次考勤" name="last">
          <div class="aic">
            <span class="mr30">考勤日期：{{ lastAttendanceObj.date }}</span>
            <div class="aic mr30">
              <span class="mr10">开始时间</span>
              <div class="w-100">
                <el-time-picker
                  v-model="lastAttendanceObj.startTime"
                  :clearable="false"
                  :disabled="lastAttendanceObj.startFlag"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="startTimeChange($event, lastAttendanceObj)"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </div>
            </div>
            <div class="aic">
              <span class="mr10">结束时间</span>
              <div class="w-100">
                <el-time-picker
                  v-model="lastAttendanceObj.endTime"
                  :clearable="false"
                  :disabled="lastAttendanceObj.endFlag"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="endTimeChange($event, lastAttendanceObj)"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </div>
            </div>
          </div>
          <div class="menu-right">
            <div class="icons no-line df">
              <span class="icons__upload">
                <gc-fileInput @change="attendanceUploadFile">
                  <i class="icons__upload__icon"></i>
                  上传导入文件
                </gc-fileInput>
              </span>
              <span
                class="icons__download"
                @click="
                  templateDownload('/common/file/downloadModule', {
                    fileCode: 'attendanceStudentModule'
                  })
                "
              >
                <i class="icons__download__icon"></i>
                导入模版下载
              </span>
            </div>
          </div>
          <gc-table
            class="general__table"
            :list="firstAttendanceList"
            :tableList="lastAttendanceObj.attendanceStudents"
          >
          </gc-table>
        </el-tab-pane>
      </el-tabs>
    </gc-model>

    <!-- 手工补录dialog -->
    <gc-model
      title="手工补录"
      width="1200px"
      :isShowFooter="componentShowFooters"
      isAppend
      :visible="supplementRecordVisible"
      custom-class="establish__trainingCourseManagement__supplementRecord"
      @close="supplementRecordClose"
      @cancel="supplementRecordVisible = false"
      @comfirm="supplementRecordComfirm"
    >
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <div class="between mb20">
        <div>
          <span>所属机构</span>
          <gc-institution class="ml10" style="top:10px;" orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" />
          <span class="ml20">学员信息</span>
          <el-input class="w200 ml10" placeholder="请输入姓名/UM号" v-model.trim="studentForm.umId" clearable />
          <el-button type="primary" class="button-60-h30 ml20" @click="handleSearchStudent">查询</el-button>
          <el-button class="button-60-h30 ml20" @click="reset">重置</el-button>
        </div>
      </div>
      <el-row v-if="supplementRecordRow" class="el_row_times mb20" style="left:0;text-align:inherit;">
        <el-col :span="6">
          <span>本次考勤日期: {{supplementRecordRow.createdDate}} </span>
        </el-col>
        <el-col :span="6">
          <span>开始时间:
            <el-time-picker
              class="w-100"
              v-model="supplementRecordRow.dateStartTime"
              :clearable="false"
              value-format="HH:mm:ss"
              :disabled="true"
              popper-class="CaseCenter__addCase__case-time-pick"
            >
            </el-time-picker>
          </span>
        </el-col>
        <el-col :span="6">
            <span>结束时间:
              <el-time-picker
                class="w-100"
                v-model="supplementRecordRow.dateEndTime"
                :clearable="false"
                value-format="HH:mm:ss"
                :disabled="true"
                popper-class="CaseCenter__addCase__case-time-pick"
              >
              </el-time-picker></span>
        </el-col>
      </el-row>
      <el-tab-pane label="未完成考勤学员信息" name="first">
          <span class="active mr10" @click="seeAndEdit">批量操作</span>
          <gc-table
            class="general__table mt20 table-left"
            noList
            :list="AttendanceListList"
            :tableList="unfinishedList"
            ref="selectTeacherTableRefAttend"
          >
            <el-table-column label="学员姓名" min-width="200">
              <template slot-scope="scope">
                  {{ scope.row.studentName }}
              </template>
            </el-table-column>
            <el-table-column label="学员UM号" min-width="200">
              <template slot-scope="scope">
                  {{ scope.row.umId }}
              </template>
            </el-table-column>
            <el-table-column label="所属机构" min-width="200" prop="orgName" show-overflow-tooltip />
            <el-table-column label="学员岗位" min-width="200" prop="postDesc" show-overflow-tooltip />
            <el-table-column label="签到日期" min-width="200" class-name="w-150">
              <template>
                {{supplementRecordRow && supplementRecordRow.createdDate}}
              </template>
            </el-table-column>
            <el-table-column label="补录签到时间" min-width="400" class-name="w-100">
              <template slot-scope="scope">
                <el-time-picker
                  v-model="scope.row.time"
                  :clearable="false"
                  value-format="HH:mm:ss"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </template>
            </el-table-column>
          </gc-table>
          <gc-pagination
            layout="prev, pager, next,slot, sizes"
            :total="nomanualSupplementaryForm.total"
            :page-sizes="[50, 100]"
            :page-size="nomanualSupplementaryForm.pageSize"
            :current-page="nomanualSupplementaryForm.currPage"
            @sizeChange="
              sizeChange(
                $event,
                nomanualSupplementaryForm,
                noAttendance
              )
            "
            @currentChange="
              currentChange(
                $event,
                nomanualSupplementaryForm,
                noAttendance
              )
            "
          />
        <gc-model
          title="批量新增"
          height="190px"
          width="600px"
          :visible.sync="choiceAddAll"
          isAppend
          @comfirm="choiceStudentComfirm"
        >
          <div class="delog_css">
            <p><span>批量补录选中学员的签到时间</span></p><br/><br/>
            <p><span>签到时间
              <el-time-picker
                v-model="selectTimes"
                :clearable="false"
                value-format="HH:mm:ss"
                @change="endTimeChangeAll($event)"
                placeholder="选择时间"
              >
              </el-time-picker>
            </span></p>
          </div>
        </gc-model>
      </el-tab-pane>
      <el-tab-pane label="已完成考勤学员信息" name="">
        <span class="active mr10" @click="clearAllDate">清空</span>
        <gc-table
          class="general__table mt20 table-left"
          noList
          :list="yesAttendanceListList"
          :tableList="yesfinishedList"
        >
          <el-table-column label="学员姓名" min-width="200">
            <template slot-scope="scope">
                {{ scope.row.studentName }}
            </template>
          </el-table-column>
          <el-table-column label="学员UM号" min-width="200">
            <template slot-scope="scope">
                {{ scope.row.umId }}
            </template>
          </el-table-column>
          <el-table-column label="所属机构" min-width="200" prop="orgName" show-overflow-tooltip />
          <el-table-column label="学员岗位" min-width="200" prop="postDesc" show-overflow-tooltip />
          <el-table-column label="签到日期" min-width="200" class-name="w-150">
            <template>
                {{supplementRecordRow && supplementRecordRow.createdDate}}
            </template>
          </el-table-column>
          <el-table-column label="签到时间" min-width="400" class-name="w-100">
            <template slot-scope="scope" v-if="scope.row.dateCheck">
                <!-- {{ scope.row.dateCheck | filterTimeLast }} -->
                <!-- {{scope.row.dateCheck && scope.row.dateCheck.split(' ')[1]}} -->
                {{scope.row.dateCheck}}
            </template>
          </el-table-column>
        </gc-table>
        <gc-pagination
          layout="prev, pager, next, slot, sizes"
          :total="yesmanualSupplementaryForm.total"
          :page-sizes="[10, 50, 100]"
          :page-size="yesmanualSupplementaryForm.pageSize"
          :current-page="yesmanualSupplementaryForm.currPage"
          @sizeChange="sizeChange($event, yesmanualSupplementaryForm, getAlreadyAttendance)"
          @currentChange="currentChange($event, yesmanualSupplementaryForm, getAlreadyAttendance)"
        />
      </el-tab-pane>
    </el-tabs>

    </gc-model>

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

    <!-- 手工补录选择学员dialog -->
    <gc-model
      title="选择学员"
      width="1200px"
      isAppend
      :visible="supplementRecordSelectStudentVisible"
      custom-class="establish__trainingCourseManagement__supplementRecordSelectStudent"
      @close="supplementRecordSelectStudentClose"
      @cancel="supplementRecordSelectStudentVisible = false"
      @comfirm="supplementRecordSelectStudentComfirm"
    >
      <div class="between mb10">
        <el-form
          :model="supplementRecordSelectStudentForm"
          inline
          @submit.native.prevent
        >
          <el-form-item label="UM号/姓名" class="mb0 mr20">
            <el-input
              class="w200"
              placeholder="请输入UM号/姓名"
              v-model="supplementRecordSelectStudentForm.empName"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button
            class="button-60"
            @click="querySupplementRecordSelectStudent"
            >查询</el-button
          >
          <el-button
            class="button-60 button-blue"
            @click="resetSupplementRecordSelectStudent"
            >重置</el-button
          >
        </div>
      </div>
      <gc-table
        class="general__table table-radio"
        ref="supplementRecordSelectStudentRef"
        :list="supplementRecordSelectStudentList"
        :tableList="supplementRecordSelectStudentTableList"
        @selection-change="
          tableSelectionChange(
            $refs,
            $event,
            'supplementRecordSelectStudentRef'
          )
        "
      >
      </gc-table>
      <gc-pagination
        :total="supplementRecordSelectStudentForm.total"
        :page-size="supplementRecordSelectStudentForm.pageSize"
        :current-page="supplementRecordSelectStudentForm.currPage"
        @sizeChange="
          sizeChange(
            $event,
            supplementRecordSelectStudentForm,
            getSupplementRecordSelectStudent
          )
        "
        @currentChange="
          currentChange(
            $event,
            supplementRecordSelectStudentForm,
            getSupplementRecordSelectStudent
          )
        "
      />
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
} from '../../../util/utils'
export default {
  name: 'AttendanceManagement',
  props: ['id', 'params'],
  data() {
    return {
      classId: '',
      // 考勤字段数组
      attendanceList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '考勤顺序',
          width: '100',
          ctx: (row, index) => {
            return "第" + Number(index+1) + "次"
          }
        },
        {
          label: '考勤日期',
          width: '120',
          prop: 'createdDate'
        },
        {
          label: '开始时间',
          width: '120',
          prop: 'dateStartTime'
        },
        {
          label: '结束时间',
          width: '120',
          prop: 'dateEndTime'
        },
        {
          label: '签到类型',
          width: '110',
          prop: 'isBatchDesc'
        },
        {
          label: '已签到人数',
          width: '120',
          prop: 'studentNum'
        },
        {
          label: '应签到人数',
          width: '120',
          prop: 'needAttendNum'
        },
        {
          label: '是否完成考勤',
          width: '110',
          prop: 'isFinish',
          ctx: (row) => (row.isFinish !== 'Y' ? '未完成' : '已完成')
        }
      ],
      // 考勤数据数组
      attendanceTableList: [],
      // 二维码dialog
      erCodeVisible: false,
      // 二维码图片链接
      erCodeSrc: '',
      // 手工补录 dialog 状态
      supplementRecordVisible: false,
      // 新增补录学员签到信息 数据数组
      addSupplementRecordList: [],
      // 未完成考勤学员信息 数据数组
      unfinishedList: [],
      // unfinishedListNew: [],
      // 已完成考勤学员信息，数据数组
      yesfinishedList:[],
      AttendanceListList:[
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
        yesAttendanceListList:[
        // {
        //   type: 'selection',
        //   width: '54'
        // },
        {
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
      blgOrgIds: [],
      // 参训学员 查询数据 form
      studentForm: {
          umId: '',
          currPage: 1,
          pageSize: 5,
          total: 0
      },
      // 手工补录 row
      supplementRecordRow: null,
      // 考勤批量导入 dialog 状态
      attendanceBatchImportVisible: false,
      // 考勤批量导入 tabs 分页激活项
      activeName: 'first',
      // 第一次考勤字段数组
      firstAttendanceList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '第几次考勤',
          width: '192',
          ctx: () => (this.activeName === 'first' ? '第一次' : '最后一次')
        },
        {
          label: '学员姓名',
          width: '180',
          prop: 'studentName'
        },
        {
          label: '学员UM号',
          width: '202',
          prop: 'umId'
        },
        {
          label: '签到时间',
          width: '260',
          prop: 'dateCheck'
        },
        {
          label: '考勤类型',
          width: '104',
          prop: 'isLateDesc'
        }
      ],
      // 第一次考勤数据 对象
      firstAttendanceObj: {},
      // 最后一次考勤数据 对象
      lastAttendanceObj: {},
      // 手工补录选择学员dialog
      supplementRecordSelectStudentVisible: false,
      // 手工补录选择学员 字段数组
      supplementRecordSelectStudentList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '学员姓名',
          width: '120',
          prop: 'empName'
        },
        {
          label: '学员UM号',
          width: '140',
          prop: 'umId'
        },
        {
          label: '所属机构',
          width: '300',
          prop: 'blgOrgName'
        }
      ],
      // 手工补录选择学员 数据数组
      supplementRecordSelectStudentTableList: [],
      // 手工补录选择学员 form 表单
      supplementRecordSelectStudentForm: {
        empName: '',
        currPage: 1,
        pageSize: 10,
        total: 0,
        row: null
      },
      nomanualSupplementaryForm: {
        empName: '',
        currPage: 1,
        pageSize: 50,
        total: 0,
        row: null
      },
      yesmanualSupplementaryForm: {
        empName: '',
        currPage: 1,
        pageSize: 10,
        total: 0,
        row: null
      },
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
      isShowFooters:true,
      isFetching: false
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
    // 日期选择限制
    startTimeChange($event, row) {
      row.endTimer = `${$event}:00 - 23:59:00`
    },
    endTimeChange($event, row) {
      row.startTimer = `00:00:00 - ${$event}:00`
    },
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
    getAttendanceList(data) {
      // const data = { classId: '2113980' }
      return this.$axios
        .post(
          '/fn/classes/manager/attendance/listAttendanceRecords',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.attendanceRecordList?.forEach((v) => {
              v.createdDate = v.dateStartTime.split(' ')[0]
              v.dateStartTime = v.dateStartTime.split(' ')[1]
              v.dateEndTime = v.dateEndTime?.split(' ')[1] || ''
            })
            this.attendanceTableList = data.attendanceRecordList || []
            return data
          }
        })
    },
    // 删除一项考勤
    delOneItemAttendance(row, index) {
      hintFrame('确认删除该考勤').then((state) => {
        const { classId, attendanceRecordUuid } = row
        const data = { classId, attendanceRecordUuid }
        this.$axios
          .post(
            '/fn/classes/manager/attendance/removeRecordByUuid',
            { data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.attendanceTableList.splice(index, 1)
              this.$message.success('删除成功')
              this.wins.forEach((v) => v.close())
              this.wins = []
            }
          })
      })
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
    // 完成考勤
    accomplishAttendance(row) {
      hintFrame('确认完成考勤').then((res) => {
        const { classId, attendanceRecordUuid } = row
        const data = { classId, attendanceRecordUuid, isFinish: 'Y' }
        this.$axios
          .post(
            '/fn/classes/manager/attendance/modifyIsFinishStatus',
            { data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.getAttendanceList({ classId })
              this.$message.success('操作成功')
              this.wins.forEach((v) => v.close())
              this.wins = []
            }
          })
      })
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
    // 打开手工补录 dialog
    openSupplementRecord(row) {
      this.commParmas = {
        classId:row && row.classId,
        attendanceRecordUuid:row.attendanceRecordUuid
      }
      this.supplementRecordVisible = true
      this.supplementRecordRow = row
      this.noAttendance()
      this.getAlreadyAttendance(this.commParmas)
    },
    // 新增一项 补录学员签到信息
    addSupplementRecordOneItem() {
      this.addSupplementRecordList.push({
        studentName: '',
        date: this.supplementRecordRow.createdDate,
        time: ''
      })
    },
    // 删除一项 补录学员签到信息
    delOneItemSupplementRecord(index) {
      this.addSupplementRecordList.splice(index, 1)
    },
    // 手工补录确认事件
    supplementRecordComfirm() {
      let flag
      const items = []
      const timer = this.supplementRecordRow.dateStartTime
      // 验证 新增补录学员签到信息 时间
      // this.addSupplementRecordList.some((v, i) => {
      //   if (v.time) {
      //     if (v.time < timer) {
      //       this.$message.warning(
      //         `新增补录学员签到信息第${i + 1}行时间不能小于${timer}`
      //       )
      //       return true
      //     } else if (v.umId) {
      //       v.dateCheck = `${v.date} ${v.time}`
      //       const { umId, dateCheck } = v
      //       items.push({ umId, dateCheck })
      //     }
      //   }
      // })
      if (flag) {
        return (this.supplementRecordVisible = false)
      }
      // 验证 未完成考勤学员信息 时间
      // this.unfinishedList.some((v, i) => {
      //   if (v.time) {
      //     if (v.time < timer) {
      //       this.$message.warning(
      //         `未完成考勤学员信息第${i + 1}行时间不能小于${timer}`
      //       )
      //       return true
      //     } else {
      //       v.dateCheck = `${v.dateCheck.split(' ')[0]} ${v.time}`
      //       const { umId, dateCheck } = v
      //       items.push({ umId, dateCheck })
      //     }
      //   }
      // })
      const time = new Date()
      // const list = this.unfinishedListNew.filter(m => m.time)
      const list = this.unfinishedList.filter(m => m.time)
      if (!list || list.length === 0) {
        return this.$message.warning('请选择对应的学员！')
      }
      // let newTime = time.getFullYear() + '-' + (time.getMonth()<10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1) + '-' + (time.getDate() < 10 ? '0' + time.getDate() : time.getDate())
      let newTime = this.supplementRecordRow.createdDate
      list.map((item) => {
        items.push({umId:item.umId, dateCheck:newTime + ' ' + item.time.substr(-8)})
      })
      console.log(items.length, '打印最新更改数据，，，6666', flag)
      if (flag) {
        return (this.supplementRecordVisible = false)
      }
      if (items.length) {
        const { classId, attendanceRecordUuid } = this.supplementRecordRow
        const data = {
          attendanceStudents: items,
          classId,
          attendanceRecordUuid
        }
        console.log(data, '打印最新更改数据，888888')
        if(this.isFetching) return
        this.isFetching = true
        this.$axios
          .post(
            '/fn/classes/manager/attendance/addAbsentStudents',
            { data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              console.log(res.data, '打印保存')
              this.supplementRecordVisible = false
            }
          })
          .finally(() => {
            this.isFetching = false
          })
      } else {
        return (this.supplementRecordVisible = false)
      }
    },
    // 手工补录 关闭 事件
    supplementRecordClose() {
      this.supplementRecordVisible = false
      this.addSupplementRecordList = []
      this.unfinishedList = []
      // this.unfinishedListNew = []
      this.getAttendanceList({ classId: this.classId })
    },
    // 打开 手工补录选择学员dialog
    openSupplementRecordSelectStudent(row) {
      this.supplementRecordSelectStudentVisible = true
      this.supplementRecordSelectStudentForm.row = row
    },
    // 获取学员数据
    getSupplementRecordSelectStudent() {
      const data = CopyObj(this.supplementRecordSelectStudentForm)
      if (!data.empName) {
        return this.$message.warning('请填写UM/姓名')
      }
      this.$axios
        .post('/fn/user/listUserInfos', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.supplementRecordSelectStudentTableList = list
            this.supplementRecordSelectStudentForm.total = total
          }
        })
    },
    // 查询学员
    querySupplementRecordSelectStudent() {
      this.supplementRecordSelectStudentForm.currPage = 1
      this.getSupplementRecordSelectStudent()
    },
    // 重置学员
    resetSupplementRecordSelectStudent() {
      this.supplementRecordSelectStudentForm.empName = ''
      this.supplementRecordSelectStudentForm.currPage = 1
      this.supplementRecordSelectStudentForm.total = 0
      this.supplementRecordSelectStudentTableList = []
    },
    // 手工选择学员补录确认事件
    supplementRecordSelectStudentComfirm() {
      const item =
        this.$refs.supplementRecordSelectStudentRef.$children[0].selection[0]
      if (!item) {
        return (this.supplementRecordSelectStudentVisible = false)
      }
      item.studentName = item.empName
      this._.merge(this.supplementRecordSelectStudentForm.row, item)
      this.supplementRecordSelectStudentVisible = false
    },
    // 手工选择学员补录 关闭 事件
    supplementRecordSelectStudentClose() {
      this.supplementRecordSelectStudentVisible = false
      this.resetSupplementRecordSelectStudent()
    },
    // 打开 导出记录
    openAttendanceBatchImport() {
      if (this.params && formatDate(new Date()) < this.params.dateStart) {
        return this.$message.warning('该培训班还未开始不能进行考勤')
      }
      this.attendanceBatchImportVisible = true
      this.getAttendanceRecord(1)
      this.getAttendanceRecord(2)
    },
    // 获取考勤详情数据
    getAttendanceRecord(checkNum, flag) {
      const { classId } = this.courseManagerDTO
      const data = { classId, checkNum }
      this.$axios
        .post(
          '/fn/classes/manager/attendance/findManualRecordByCheckNum',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const key =
              checkNum === 1 ? 'firstAttendanceObj' : 'lastAttendanceObj'
            if (!flag) {
              data.date =
                checkNum === 1
                  ? data.dateStart.split(' ')[0]
                  : data.dateEnd.split(' ')[0]
              data.startTime = data.dateStartTime?.split(' ')[1]
              data.endTime = data.dateEndTime?.split(' ')[1] || ''
            } else {
              data.date = this[key].date
              data.startTime = this[key].startTime
              data.endTime = this[key].endTime
            }
            data.startFlag = data.startTime ? true : false
            data.endFlag = data.endTime ? true : false
            this[key] = data
          }
        })
    },
    //未完成考勤学员查询
    noAttendance (data){
      const currPage = this.nomanualSupplementaryForm.currPage
      const pageSize = this.nomanualSupplementaryForm.pageSize
      const oldData = { classId:this.supplementRecordRow.classId, attendanceRecordUuid:this.supplementRecordRow.attendanceRecordUuid, currPage, pageSize }
      data = data ? data : oldData
      data.busiType =  this.blgOrgIds?.[0]
      data.orgId =  this.blgOrgIds?.[1]
      data.umId = this.studentForm.umId
      this.$axios
        .post(
          '/fn/classes/manager/attendance/findAbsentStudents',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const code = res.data && res.data.code
          const data = res.data && res.data.data && res.data.data.list
          this.nomanualSupplementaryForm.total =  res.data && res.data.data && res.data.data.total
          if (code === 0) {
            data.forEach((v) => {
              v.time = ''
              // this.unfinishedListNew.push(v)
            })
            this.unfinishedList = data
          }
          console.log('11', this.unfinishedList, '打印最新数据')
        })
    },
    // 获取已考勤学员
    getAlreadyAttendance (val) {
      const currPage = this.yesmanualSupplementaryForm.currPage
      const pageSize = this.yesmanualSupplementaryForm.pageSize
      const busiType = this.blgOrgIds?.[0]
      const orgId = this.blgOrgIds?.[1]
      const umId = this.studentForm.umId
      const data = {
        classId: val?.classId || this.commParmas.classId,
        attendanceRecordUuid: val?.attendanceRecordUuid || this.commParmas.attendanceRecordUuid,
        currPage, pageSize, busiType, orgId, umId
      }
      this.$axios.post('/fn/classes/manager/attendance/listCheckedOnStudent', { data }, jsonHeaders).then(res => {
        const code = res.data && res.data.code
        const data = res.data && res.data.data && res.data.data.list
        this.yesmanualSupplementaryForm.total =  res.data && res.data.data && res.data.data.total
        if (code === 0) {
          data.forEach((v) => {
            v.dateCheck = v.dateCheck.split(' ')[1]
          })
          this.yesfinishedList = data
        }
      })
    },
    // 考勤 批量导入上传文件
    attendanceUploadFile($event) {
      const file = $event.target.files[0]
      if (!file) {
        return
      }
      let item, checkNum
      if (this.activeName === 'first') {
        item = this.firstAttendanceObj
        checkNum = 1
      } else {
        item = this.lastAttendanceObj
        checkNum = 2
      }
      if (!item.startTime && !item.endTime) {
        return this.$message.warning('考勤开始和结束时间必填')
      }
      const data = new FormData()
      let dateStartTime = `${item.date} ${item.startTime}`
      if (dateStartTime.length < 17) {
        dateStartTime = `${dateStartTime}:00`
      }
      let dateEndTime = `${item.date} ${item.endTime}`
      if (dateEndTime.length < 17) {
        dateEndTime = `${dateEndTime}:00`
      }

      const { classId } = this.courseManagerDTO
      data.append('file', file)
      data.append('classId', classId)
      data.append('checkNum', checkNum)
      data.append('dateStartTime', dateStartTime)
      data.append('dateEndTime', dateEndTime)
      this.$axios
        .post('/classFileFunc/attendanceBatchImport', data, dataHeaders)
        .then((res) => {
          const { code, data,msg } = res.data
          if (code === 0) {
            this.getAttendanceRecord(checkNum, true)
            let errText = ''
            data && data.forEach((v) => {
              errText += `<p>${v}</p>`
            })
            if (errText) {
              this.$alert(`${errText}`, '提示', {
                confirmButtonText: '知道了',
                customClass: 'file-import-error',
                dangerouslyUseHTMLString: true
              })
            } else {
              this.$alert(msg, '提示', {
                confirmButtonText: '知道了',
                customClass: 'file-import-error',
                dangerouslyUseHTMLString: true
              })
            }
          } else {
            this.$alert(msg, '提示', {
              confirmButtonText: '知道了',
              customClass: 'file-import-error',
              dangerouslyUseHTMLString: true
            })
          }
        })
    },
    // 考勤批量导入关闭事件
    attendanceBatchImportClose() {
      this.attendanceBatchImportVisible = false
      this.getAttendanceList({ classId: this.classId })
    },
    // 获取培训班数据
    getClassInfo(classId) {
      const data = { classId }
      return this.$axios
        .post(
          '/fn/classes/manager/attendance/startToCheck',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            return data
          }
        })
    },
    // 跳转到开始考勤
    goToAttendance(row) {
      if (this.params && formatDate(new Date()) < this.params.dateStart) {
        return this.$message.warning('该培训班还未开始不能进行考勤')
      }
      const list = this.attendanceTableList.filter(
        (v) => v.isBatchDesc === '扫码考勤'
      )
      const checkNum = list.length ? +list.slice(-1)[0].checkNum + 1 : 1
      const { classId } = row
      this.getClassInfo(classId).then((res) => {
        if (res) {
          const { id, classId, attendanceRecordUuid, dateStartTime } = res
          const params = {
            data: {
              classId,
              attendanceRecordUuid,
              checkNum,
              type: '1',
              id
            },
            checkNum,
            dateStartTime
          }
          const win = window.open(
            `/#/StartAttendance?params=${JSON.stringify(params)}`,
            'StartAttendance'
          )
          win.__FLAG__ = true
          this.state = 'attendance'
          this.attendanceManagementVisible = false
          this.wins.push(win)
        }
      })
    },
    // 继续考勤
    goAttendance(row) {
      const {
        id,
        classId,
        attendanceRecordUuid,
        checkNum,
        createdDate,
        dateStartTime
      } = row
      const data = {
        classId,
        attendanceRecordUuid,
        checkNum,
        type: '1',
        id
      }
      const params = {
        data,
        checkNum,
        dateStartTime: `${createdDate} ${dateStartTime}`
      }
      const win = window.open(
        `/#/StartAttendance?params=${JSON.stringify(params)}`,
        'StartAttendance'
      )
      win.__FLAG__ = true
      this.state = 'attendance'
      this.attendanceManagementVisible = false
      this.wins.push(win)
    },
    timingTask() {
      this.timer = setTimeout(() => {
        this.initAttendanceData()
        this.timingTask()
      }, 10000)
    },
    handleClick(tab, event) {
      console.log(tab.index,'看看')
      this.blgOrgIds = []
      this.studentForm.umId = ''
      if (tab && tab.index === '1') {
        this.isShowFooters = false
        this.getAlreadyAttendance(this.commParmas)
      } else {
        this.isShowFooters = true
        this.noAttendance()
      }
      console.log(this.isShowFooters,'最新数据看看')
    },
    // 搜索学员
    handleSearchStudent () {
      if (this.isShowFooters) {
        this.noAttendance()
      } else {
        this.getAlreadyAttendance(this.commParmas)
      }
    },
    // 重置
    reset() {
      this.blgOrgIds = []
      this.studentForm.umId = ''
      this.studentForm.pageSize = 10
      this.studentForm.currPage = 1
      this.handleSearchStudent()
    },
    seeAndEdit(){
      const item = this.$refs.selectTeacherTableRefAttend.$children[0].selection
      if (!item || (item && item.length === 0)) {
        return this.$message.warning('请选择学员姓名')
      } else {
         console.log(item, '打印完整的数据9999999')
         this.choiceAddAll = true
         this.selectTimes = ''
         this.selectId = []
         item && item.forEach ((item) => {
           this.selectId.push(item.id)
         })
         console.log(this.selectId, '打印最新选中的id')
      }
    },
    // 删除已完成考勤数据
    clearAllDate() {
      const data = { classId:this.commParmas && this.commParmas.classId, attendanceRecordUuid:this.commParmas && this.commParmas.attendanceRecordUuid}
      hintFrame('清空后将删除所有的学员签到信息,无法恢复,请谨慎操作！')
        .then(() => {
        this.$axios
        .post(
          '/fn/classes/manager/attendance/removeFinishedRecordByUuid',
          { data },
          jsonHeaders
        )
        .then((res) => {
           this.nomanualSupplementaryForm.pageSize = 50
           this.nomanualSupplementaryForm.currPage = 1
           const data2 = { classId:this.commParmas && this.commParmas.classId, attendanceRecordUuid:this.commParmas && this.commParmas.attendanceRecordUuid, currPage:this.nomanualSupplementaryForm.currPage, pageSize:this.nomanualSupplementaryForm.pageSize }
           this.getAlreadyAttendance(data)
           this.noAttendance(data2)
          })
        })
        .catch((error) => {
          console.log('')
        })
    },
    choiceStudentComfirm() {
      // 手工补录 批量时间时间校验
      const time = new Date()
      // let newTime = time.getFullYear() + '-' + (time.getMonth()<10 ? '0' + time.getMonth() : time.getMonth()) + '-' + (time.getDay() < 10 ? '0' + time.getDay() : time.getDay())
      let newTime = this.supplementRecordRow.createdDate
       const changAll = this.timeTosec(this.selectTimes)
       const changAllStart = this.timeTosec(this.supplementRecordRow.dateStartTime)
       const changAllEnd = this.timeTosec(this.supplementRecordRow.dateEndTime)
       if (!((changAllEnd >= changAll && changAll >= changAllStart) && changAllStart && changAllEnd)) {
          return this.$message.warning('补录签到时间必须在考勤时间范围内')
        }
        this.unfinishedList.map((item) => {
         if(this.selectId && this.selectId.includes(item.id)){
          //  item.dateCheck = this.selectTimes
           item.time = this.selectTimes
         }
      })
      console.log('打印确认后数据1' ,this.selectTimes ,'打印确认后数据2')
      this.choiceAddAll = false
    },
    timeTosec(time){
      const hour = time.split(':')[0]
      const min = time.split(':')[1]
      const sec = time.split(':')[2]
      console.log(hour, min ,sec ,'测试时间')
      // const s = Number(hour*3600*60) + Number(min*3600) + Number(sec)
      const s = Number(hour*60*60) + Number(min*60) + Number(sec)
      return s*1000
    },
    endTimeChangeAll(env) {
       let changAllTime = env
       this.selectTimes = changAllTime
        console.log(this.selectTimes, '打印选择的最终时间')
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

<style lang="scss">
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
<style scoped>
  .el_row_times{
    width: 80%;
    left: 20%;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .delog_css p{
    text-align: center;
  }
</style>
