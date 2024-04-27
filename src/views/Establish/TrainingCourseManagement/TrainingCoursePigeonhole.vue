<template>
  <div class="establish__training-course-management__pigeonhole">
    <el-card>
      <div class="title">{{ className }}档案</div>
    </el-card>
    <el-card class="mt10">
      <p class="shallow l24">
        归档信息（可上传文件格式为：xls.doc.htm.pdf.ppt.mht.msg.rar.zip.txt.html.docx.xlsx.pptx.png.gif.jpg.jpeg.mp4.mp3.mov，文件大小≤5M）
      </p>
      <gc-table class="general__table mt15" :list="list" :tableList="tableList">
        <el-table-column width="164" label="操作">
          <template slot-scope="scope">
            <span
              class="active"
              v-if="scope.row.archiveType !== '04'"
              @click="openDialog(scope.row)"
              >查看</span
            >
            <div v-else class="aic">
              <template v-if="state!=='detail'">
                <span class="active"  @click="otherInformation = true">上传</span>
                <span class="line"></span>
              </template>
              <span class="cp" @click="openDialog(scope.row)">查看</span>
            </div>
          </template>
        </el-table-column>
      </gc-table>
    </el-card>

    <!-- 查看考勤 dialog -->
    <gc-model
      title="查看考勤"
      :visible="checkAttendance"
      width="1100px"
      @close="checkAttendance = false"
      @cancel="checkAttendance = false"
      @comfirm="checkAttendance = false"
    >
      <gc-table
        class="general__table mt15"
        :list="attendanceList"
        :tableList="attendanceTableList"
      >
        <el-table-column width="164" label="操作">
          <template slot-scope="scope">
            <span class="active" @click="openAttendanceInfo(scope.row)"
              >查看</span
            >
            <span class="active ml20" @click="downAttendance(scope.row)"
              >下载</span
            >
          </template>
        </el-table-column>
      </gc-table>
    </gc-model>

    <!-- 查看考勤明细 dialog -->
    <gc-model
      title="培训班考勤明细查看"
      :visible="attendanceInfo"
      width="1100px"
      @close="attendanceInfo = false"
      @cancel="attendanceInfo = false"
      @comfirm="attendanceInfo = false"
    >
      <gc-table
        class="general__table mt15"
        :list="attendanceInfoList"
        :tableList="attendanceInfoTableList"
      >
      </gc-table>
    </gc-model>

    <!-- 培训班评估 dialog -->
    <gc-model
      title="培训班评估"
      :visible="assessment"
      width="1100px"
      @close="
        assessment = false
        alreadyFiles = []
      "
      @cancel="assessment = false"
      @comfirm="assessment = false"
    >
      <div class="title">
        <div class="title__menu"></div>
        讲师信息
      </div>
      <gc-table
        class="general__table mt15"
        :list="assessmentList"
        :tableList="assessmentTableList"
      >
      </gc-table>
      <div class="title mt30">
        <div class="title__menu"></div>
        培训班信息
      </div>
      <gc-table
        class="general__table mt15"
        :list="trainingCourseList"
        :tableList="trainingCourseTableList"
      >
      </gc-table>
      <p class="active mt20" @click="exportResult">
        培训班及讲师意见及建议查看
      </p>
    </gc-model>

    <!-- 其他资料上传 dialog -->
    <gc-model
      title="其他资料上传"
      :visible="otherInformation"
      width="500px"
      @close="
        otherInformation = false
        files = []
      "
      @cancel="otherInformation = false"
      @comfirm="otherInformationComfirm"
    >
      <div class="df">
        <span class="shallow l26 mr20">选择文件</span>
        <gc-fileInput btn-text="上传文件" @change="fileChange" />
      </div>
      <div class="mt20 df" v-if="files.length">
        <span class="sw-48 tar shallow l26 mr20">已上传</span>
        <div class="items">
          <div class="item aic" v-for="(item, i) in files" :key="item.udmpId">
            <i class="operation__doc mr6"></i>
            <span class="mr30 name">{{ item.fileName }}</span>
            <i class="operation__del" @click="delItem(i)"></i>
          </div>
        </div>
      </div>
    </gc-model>

    <!-- 查看已上传资料 dialog -->
    <gc-model
      title="查看已上传资料"
      :visible="checkInformation"
      width="600px"
      cancelText=""
      comfirmText="关闭"
      @close="checkInformation = false"
      @cancel="checkInformation = false"
      @comfirm="checkInformation = false"
    >
      <div class="df checkInformation">
        <div class="left sw-100">文档</div>
        <div class="right">
          <a
            class="item active"
            v-for="file in alreadyFiles"
            :key="file.udmpId"
            :href="handleUdmpHref(file.udmpId)"
            :download="file.archiveName"
          >
            {{ file.archiveName }}
          </a>
        </div>
      </div>
    </gc-model>

    <!-- 课程安排表 dialog -->
    <gc-model
      title="课程安排表"
      :visible="courseTable"
      width="1100px"
      @close="courseTable = false"
      @cancel="courseTable = false"
      @comfirm="courseTable = false"
    >
      <div class="title">
        <div class="title__menu"></div>
        培训班课程信息
      </div>
      <div class="menu-right">
        <span
          class="instructor-icons__download"
          @click="exportHandle('/classFileFunc/downloadClassCourseByClassId')"
        >
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <gc-table
        class="general__table mt15"
        :list="courseList"
        :tableList="courseTableList"
      >
      </gc-table>
      <div class="title mt30">
        <div class="title__menu"></div>
        通关评审及带班老师信息
      </div>
      <gc-table
        class="general__table mt15"
        :list="teacherList"
        :tableList="teacherTableList"
      >
      </gc-table>
    </gc-model>

    <!-- 培训班学员信息 dialog -->
    <gc-model
      title="培训班学员信息"
      :visible="studentInfo"
      width="1100px"
      @close="studentInfo = false"
      @cancel="studentInfo = false"
      @comfirm="studentInfo = false"
    >
      <div class="menu-right">
        <span
          class="instructor-icons__download"
          @click="exportHandle('/fn/classes/manager/exportFileClassStudent')"
        >
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <gc-table
        class="general__table mt15"
        :list="studentList"
        :tableList="studentTableList"
      >
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[5, 10]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getStudentList)"
        @currentChange="currentChange($event, queryForm, getStudentList)"
        class="between"
      />
    </gc-model>

    <!-- 查看立项附件 dialog -->
    <gc-model
      title="查看立项附件"
      :visible.sync="checkEstabInformation"
      width="600px"
      cancelText=""
      comfirmText="关闭"
    >
      <div class="df checkInformation">
        <div class="left sw-100">文档</div>
        <div class="right">
          <a
            class="item active"
            v-for="file in EstabAlreadyFiles"
            :key="file.udmpId"
            :href="handleUdmpHref(file.udmpId)"
            :download="file.fileName"
          >
            {{ file.fileName }}
          </a>
        </div>
      </div>
    </gc-model>
  </div>
</template>

<script>
import {
  CopyObj,
  handleBlob,
  uploadFile,
  sizeChange,
  jsonHeaders,
  manyLineHint,
  currentChange,
  handleUdmpHref,
  downHeaders,
  handleDownload,
  templateDownload
} from '@/util/utils'
import { ESTABLISH_COURSE_MAP } from '@/util/constants'
export default {
  name: 'TrainingCoursePigeonhole',
  props: {
    params: {
      type: Object | null,
      default: null
    },
    state: String
  },
  data() {
    return {
      // 培训班id
      classId: '',
      // 培训班名称
      className: '',
      // 归档字段数组
      list: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '资料名称',
          prop: 'desc'
        }
      ],
      // 归档数据数组
      tableList: [],
      // 查看考勤 dialog状态
      checkAttendance: false,
      // 查看考勤表格字段数组
      attendanceList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '类型',
          width: '126',
          prop: 'isBatchDesc'
        },
        {
          label: '考勤日期',
          width: '168',
          prop: 'createdDate'
        },
        {
          label: '开始时间',
          width: '144',
          prop: 'dateStartTime'
        },
        {
          label: '结束时间',
          width: '144',
          prop: 'dateEndTime'
        },
        {
          label: '签到人数',
          width: '146',
          prop: 'studentNum'
        }
      ],
      // 查看考勤表格数据数组
      attendanceTableList: [],
      // 考勤明细 dialog 状态
      attendanceInfo: false,
      // 考勤明细 表格字段数组
      attendanceInfoList: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: '类型',
          width: '120',
          prop: 'isHandRecordDesc'
        },
        {
          label: '第几次考勤',
          width: '100',
          prop: 'checkNum'
        },
        {
          label: '学员姓名',
          width: '120',
          prop: 'studentName'
        },
        {
          label: 'UM号',
          width: '140',
          prop: 'umId'
        },
        {
          label: '签到日期',
          width: '100',
          prop: 'dateCheck'
        },
        {
          label: '考勤类型',
          width: '100',
          prop: 'isLateDesc'
        }
      ],
      // 考勤明细 表格数据数组
      attendanceInfoTableList: [],
      // 培训班评估 dialog状态
      assessment: false,
      // 培训班评估表格字段数组
      assessmentList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '课程名称',
          prop: 'courseName',
          width: '200'
        },
        {
          label: '讲师姓名',
          prop: 'teacherName',
          width: '120'
        },
        {
          label: '授课日期',
          prop: 'courseDate',
          width: '120'
        },
        {
          label: '授课时间',
          prop: 'courseTime',
          width: '120'
        },
        {
          label: '授课评分（十分制）',
          prop: 'teacherScore',
          width: '140'
        }
      ],
      // 培训班评估表格数据数组
      assessmentTableList: [],
      // 培训班信息表格字段数组
      trainingCourseList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '评估内容',
          prop: 'content',
          width: '400'
        },
        {
          label: '评分（十分制）',
          prop: 'score',
          width: '400'
        }
      ],
      // 培训班信息表格数据数组
      trainingCourseTableList: [
        {
          content: '培训班整体',
          score: ''
        },
        {
          content: '整体课程质量',
          score: ''
        },
        {
          content: '整体讲师质量',
          score: ''
        }
      ],
      // 其他资料上传 dialog状态
      otherInformation: false,
      // 其他资料上传 文件列表
      files: [],
      // 查看已上传资料 dialog状态
      checkInformation: false,
      // 已有的文件列表
      alreadyFiles: [],
      // 课程安排表 dialog状态
      courseTable: false,
      // 培训班课程表格字段数组
      courseList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '开始时间',
          prop: 'startDate',
          width: '120'
        },
        {
          label: '结束时间',
          prop: 'endDate',
          width: '120'
        },
        {
          label: '课程来源',
          prop: 'courseType',
          width: '120'
        },
        {
          label: '课程名称',
          prop: 'courseName',
          width: '120'
        },
        {
          label: '讲师类型',
          prop: 'teacherType',
          width: '120'
        },
        {
          label: '讲师名称',
          prop: 'teacherName',
          width: '140'
        }
      ],
      // 培训班课程表格数据数组
      courseTableList: [],
      // 培训班带班老师表格字段数组
      teacherList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '姓名',
          prop: 'teacherName',
          width: '120'
        },
        {
          label: 'UM号',
          prop: 'teacherNo',
          width: '120'
        },
        {
          label: '类型',
          prop: 'teacherType',
          width: '120'
        },
        {
          label: '开始时间',
          prop: 'tgDate1',
          width: '120'
        },
        {
          label: '结束时间',
          prop: 'tgDate2',
          width: '120'
        }
      ],
      // 培训班带班老师表格数据数组
      teacherTableList: [],
      // 培训班学员信息 dialog
      studentInfo: false,
      // 培训班学员信息 表格字段数组
      studentList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '学员姓名',
          prop: 'studentName',
          width: '120'
        },
        {
          label: 'UM号',
          prop: 'umId',
          width: '120'
        },
        {
          label: '部门',
          prop: 'orgName',
          width: '120'
        },
        {
          label: '考勤',
          width: '120',
          prop: 'isAttendence',
          ctx: row => row.isAttendence === 'Y' ? '合格' : '不合格'
        },
        {
          label: '总得分',
          prop: 'score',
          width: '120',
          ctx: row => this.handleNum(row.score)
        },
        {
          label: '总排名',
          prop: 'scoreRank',
          width: '120'
        },
        {
          label: '当期荣誉',
          prop: 'rewardPunish',
          width: '120'
        },
        {
          label: '结训',
          prop: 'isAttendClass',
          width: '120',
          ctx: (row) => this.stateOptions[row.isAttendClass]
        }
      ],
      // 培训班学员信息 表格数据数组
      studentTableList: [],
      // 附件信息表格
      EstabAlreadyFiles: [],
      // 分页表单
      queryForm: {
        currPage: 1,
        pageSize: 5
      },
      total: 0,
      // 分页工具函数
      sizeChange,
      currentChange,
      // 处理udmp链接函数
      handleUdmpHref,
      dialogMaping: {
        '02': () => {
          this.checkAttendance = true
          this.getAttendanceList()
        },
        '03': () => {
          this.assessment = true
          this.getAssessmentList()
        },
        '04': () => {
          this.getAlreadyFiles()
          this.checkInformation = true
        },
        '05': () => {
          this.courseTable = true
          this.getCourseList()
        },
        '06': () => {
          this.studentInfo = true
          this.queryForm.currPage = 1
          this.pageSize = 5
          this.getStudentList()
        },
        '08': () => {
          this.checkEstabInformation = true
          this.getEstablishFileList()
        }
      },
      // 课程类型映射
      courseMaping: {
        [ESTABLISH_COURSE_MAP.bank]: '内部课程',
        [ESTABLISH_COURSE_MAP.interior]: '外部课程',
        [ESTABLISH_COURSE_MAP.move]: '移动',
        [ESTABLISH_COURSE_MAP.commonCourse]: '通用课程'
      },

      // 讲师类型映射
      teacherMaping: {
        [ESTABLISH_COURSE_MAP.interiorBank]: '内部(银行)',
        [ESTABLISH_COURSE_MAP.interiorNotBank]: '内部(非银行)',
        [ESTABLISH_COURSE_MAP.sansLecturer]: '外部讲师',
        [ESTABLISH_COURSE_MAP.notLecturer]: '无讲师'
      },
      // 带班老师类型
      teacherCategoryOptions: {
        '02001': '带班',
        '02002': '通关评审',
        '02003': '行动学习'
      },
      // 结训状态类型
      stateOptions: {
        3: '结训',
        2: '不及格',
        1: '未参加'
      },
      checkEstabInformation: false
    }
  },
  methods: {
    // 获取归档表格数据信息
    getList() {
      const data = { classId: this.classId }
      this.$axios
        .post('/fn/archive/listArchiveTypes', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.tableList = data
          }
        })
    },
    // 打开对应的dialog
    openDialog(row) {
      const fun = this.dialogMaping[row.archiveType]
      fun && fun()
    },
    // 获取考勤记录
    getAttendanceList() {
      const data = { classId: this.classId }
      this.$axios
        .post(
          '/fn/classes/manager/attendance/listAttendanceRecords',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.attendanceTableList = data.attendanceRecordList || []
          }
        })
    },
    // 打开考勤明细
    openAttendanceInfo(row) {
      const { classId, attendanceRecordUuid } = row
      const data = { classId, attendanceRecordUuid }
      this.$axios
        .post(
          '/fn/classes/manager/attendance/findAttendanceInfoByUuid',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const students = data.attendanceStudents
            data.checkNum = `第${data.checkNum}次`
            Reflect.deleteProperty(data, 'attendanceStudents')
            this.attendanceInfoTableList = students.map((v) =>
              Object.assign(v, data)
            )
            this.attendanceInfo = true
          }
        })
    },
    // 获取评估数据
    getAssessmentList() {
      const data = { classId: this.classId }
      this.$axios
        .post('/fn/classes/manager/eva/findClassEvaDetail', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { courses, newAllScore, newCourceScore, newTeacherScore } =
              data
            const arr = [newAllScore, newCourceScore, newTeacherScore]
            this.assessmentTableList = courses
            this.trainingCourseTableList.forEach((v, i) => {
              v.score = arr[i]
            })
          }
        })
    },
    // 培训班及讲师意见及建议查看 资料下载
    exportResult() {
      const data = { evaId: 'ALL', classId: this.classId }
      this.$axios
        .post('/classFileFunc/downloadClassSingleEva', data, {
          ...jsonHeaders,
          responseType: 'blob'
        })
        .then((res) => {
          handleBlob(res)
        })
    },
    // 选中文件 事件
    fileChange($event) {
      const files = $event.target.files[0]
      const data = { files, reimClass: '', busiId: '' }
      uploadFile(data).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.files.push(...data)
        }
      })
    },
    // 删除一个文件
    delItem(i) {
      this.files.splice(i, 1)
    },
    // 上传文件确认事件
    async otherInformationComfirm() {
      const classArchiveInfoDTOs = this.files.map((v) => {
        const { id, udmpId, fileName: archiveName } = v
        return { id, udmpId, archiveName }
      })
      const alreadyList = await this.getAlreadyFiles()
      if (alreadyList?.length) {
        classArchiveInfoDTOs.push(...alreadyList)
      }
      const data = {
        classId: this.classId,
        archiveType: '04',
        classArchiveInfoDTOs
      }
      this.$axios
        .post('/fn/archive/saveArchiveFiles', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.otherInformation = false
          }
        })
    },
    // 获取已有的文件列表
    getAlreadyFiles() {
      const data = { classId: this.classId, archiveType: '04' }
      return this.$axios
        .post('/fn/archive/listFilesByArchiveType', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.alreadyFiles = data
            return data
          }
        })
    },
    // 获取培训班课表信息
    getCourseList() {
      const data = { classId: this.classId }
      this.$axios
        .post(
          '/fn/classes/manager/course/findCourseManagerInfo',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { courseList, tgTeacherList } = data
            courseList?.forEach((v) => {
              if (v.isCommonCourse === 'Y') {
                v.courseType =
                  this.courseMaping[ESTABLISH_COURSE_MAP.commonCourse]
              } else {
                v.courseType = this.courseMaping[v.courseType]
              }
              v.teacherType = this.teacherMaping[v.teacherType]
            })
            tgTeacherList?.forEach((v) => {
              v.teacherType = this.teacherCategoryOptions[v.teacherType]
              v.tgDate1 = `${v.tgDate1} ${v.startHour}:${v.startMin}:00`
              v.tgDate2 = `${v.tgDate2 || v.tgDate1?.split(' ')[0]} ${
                v.endHour
              }:${v.endtMin}:00`
            })
            this.courseTableList = courseList
            this.teacherTableList = tgTeacherList
          }
        })
    },
    // 小数点处理
    handleNum (val) {
      if (val === '' || String(val) === 'undefined' || String(val) === 'null' || val === '-') {
        return val
      }
      return parseFloat(val).toFixed(1)
    },
    // 获取培训班学员信息
    getStudentList() {
      const data = CopyObj(this.queryForm)
      data.classId = this.classId
      this.$axios
        .post(
          '/fn/classes/manager/afterTrain/listStudentInfos',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data.RESULT_STUDENTS
            this.total = total
            this.studentTableList = list
          }
        })
    },
    // 获取 立项附件
    getEstablishFileList() {
      this.$axios
        .post(
          '/fn/classes/manager/listClassManagerFiles',
          { classId: this.classId },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.EstabAlreadyFiles = data
          }
        })
    },
    // 学员导出
    exportHandle(url) {
      this.$axios
        .post(url, { classId: this.classId }, downHeaders)
        .then(handleDownload)
    },
    downAttendance(row) {
      const { attendanceRecordUuid } = row
      templateDownload('/classFileFunc/downloadRecordByUuid', {
        classId: this.classId,
        attendanceRecordUuid
      })
    },
    doInitThing() {
      const params = this.params || this.$route.params
      if (params.className) {
        this.className = params.className
        this.classId = params.id
        this.getList()
      }
    }
  },
  mounted() {
    if(this.params) {
      this.doInitThing();
    }
  },
  activated() {
    this.doInitThing();
  }
}
</script>

<style lang="scss">
.establish__training-course-management__pigeonhole {
  .line {
    width: 1px;
    height: 20px;
    margin: 0 15px;
    background-color: #eaecf1;
  }
  .items {
    .item {
      height: 26px;
      &:nth-child(n + 2) {
        margin-top: 16px;
      }
      .name {
        color: $title1Color;
        font-size: $fz14;
      }
    }
  }
  .checkInformation {
    border: 1px solid #eaecf1;

    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #eaecf1;
    }
    .right {
      flex: 1;
      .item {
        display: block;
        padding-left: 20px;
        line-height: 30px;
        border-bottom: 1px solid #eaecf1;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
}
</style>