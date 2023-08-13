<template>
  <div class="TrainingNotice establish__TrainingNotice">
    <el-card>
      <div class="Student">
        <div class="studentTitle establish__TrainingNotice__studentTitle">
          <span class="title__menu"></span>
          <span class="title__message">学员通知</span>
        </div>
        <div class="studentInfo">
          <div class="studentINfoTitle">
            <div class="studentINfoTitle__tit">参训提醒</div>
            <div
              class="studentINfoTitle__status"
              v-if="this.courseObj.sendStatus == '1'"
            >
              已发送
            </div>
          </div>
          <div class="studentINfoDate">
            <div class="studentINfoDate__tit">通知时间：</div>
            <div class="studentINfoDate_subTit">
              {{ this.courseObj.notifyTime }}
            </div>
          </div>
          <div class="studentINfoMode">
            <div class="studentINfoMode__title">通知方式：</div>
            <div class="studentINfoMode__subTit">
              <span v-if="this.courseObj.ifAppNotify === 'Y'"
                >口袋银行家通知</span
              >
              <span v-if="this.courseObj.ifEmailNotify === 'Y'">邮件通知</span>
            </div>
          </div>
          <div class="item-mask">
            <el-button
              class="button-60-h30 button-orange mr20"
              @click="openStudentEdit()"
              >编辑</el-button
            >
          </div>
        </div>
      </div>
      <div class="Teacher">
        <div class="teacher__titles">
          <div class="teacher__left">
            <span class="title__menu"></span>
            <span class="title__message">讲师通知</span>
          </div>
          <div class="teacher__right">
            <div @click="openInvitation('invitation')" class="right__button">
              邀请函
            </div>
            <div @click="openInvitation('thanksLetter')" class="right__button">
              感谢函
            </div>
          </div>
        </div>
        <el-table
          :data="teacherList"
          stripe
          ref="teacherRef"
          class="teacherTable"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="50"
            :selectable="selectable"
          ></el-table-column>
          <el-table-column
            label="讲师姓名"
            width="110"
            prop="teacherName"
          ></el-table-column>
          <el-table-column
            label="课程名称"
            min-width="200"
            prop="courseName"
          ></el-table-column>
          <el-table-column label="授课时间" min-width="220">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.startDate +
                  '–' +
                  scope.row.endHour +
                  ':' +
                  scope.row.endtMin
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="邀请函" width="100">
            <template slot-scope="scope">
              <div class="td__invitation" :class="{ active: scope.row.isInvitationMail === 'Y' }">
                <span v-if="scope.row.isInvitationMail === 'Y'" style="cursor: pointer;" @click="openViewThankLetter('invitation', scope.row)">已发送</span>
                <span v-else>未发送</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="同步发送会邀" width="130">
            <template slot-scope="scope">
              <div>
                {{ scope.row.ifInviteMeet === '1' ? '是' : '否' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="邀请函发送时间"
            min-width="180"
            prop="inviteSendDate"
          ></el-table-column>
          <el-table-column label="感谢函" width="100">
            <template slot-scope="scope">
              <div class="td__invitation" :class="{ active: scope.row.isThanksMail === 'Y' }">
                <span v-if="scope.row.isThanksMail === 'Y'" style="cursor: pointer;" @click="openViewThankLetter('thanksLetter', scope.row)">已发送</span>
                <span v-else>未发送</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="感谢函发送时间"
            min-width="180"
            prop="grantSentDate"
          ></el-table-column>
        </el-table>
      </div>
    </el-card>
    <ViewThankLetter ref="viewThankLetterRef" />
  </div>
</template>

<script>
import { addAllowKeepAlive, jsonHeaders } from '@/util/utils'
import {
  fetchQueryLatestClassStudentNotify,
  fetchQueryCourseManagerList
} from '@/fetch/establish'
import ViewThankLetter from './ViewThankLetter'
export default {
  name: 'TrainingNotice',
  components: { ViewThankLetter },
  props: {
    commcClassId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 后台返回的课程数据对象
      courseObj: {},
      teacherList: [] // 讲师列表数据
    }
  },
  watch: {
    $route(route) {
      if (route.path === '/TrainingCourseSeeEdit') {
        this.initData()
      }
    }
  },
  methods: {
    initData() {
      this.getStudentList()
      this.getTeacherList()
    },
    // 打开学生通知编辑页面
    openStudentEdit() {
      addAllowKeepAlive('/StudentNotification')
      this.$router.push({ name: '通知编辑', params: this.courseObj })
    },
    async getTeacherList() {
      const params = { classId: this.commcClassId }
      const data = await fetchQueryCourseManagerList({ data: params})
      this.teacherList = data.courseList
    },
    async getStudentList() {
      const params = { classId: this.commcClassId }
      const data = await fetchQueryLatestClassStudentNotify({data: params});
      data.classId = data.classId || this.commcClassId
      this.courseObj = data
    },
    // 验证邀请函感谢函勾选数据
    verifyInvitationtable(courseList, type) {
      // 查找不符合条件的一项
      if (!courseList.length) {
        this.$message.warning(`尚未选择课程`)
        return
      }
      const flag = courseList.some((v, i) => {
        i++
        if (v[type] === 'Y') {
          this.teacherList.some((subv, subi) => {
            subi++
            if (v.id === subv.id) {
              this.$message.warning(
                `课程表第${subi}行已发送讲师${
                  type === 'isInvitationMail' ? '邀请' : '感谢'
                }函`
              )
              return true
            }
          })
          return true
        }
      })
      // 没找到 不符合条件的
      if (flag) {
        return
      } else {
        return courseList[0].classId
      }
    },
    // 跳转到邀请函,type:invitation-邀请函，thanksLetter-感谢函,row:当前选中的课程信息
    openInvitation(type) {
      const isMail = {
        invitation: 'isInvitationMail',
        thanksLetter: 'isThanksMail'
      }
      const selectList = this.$refs.teacherRef.selection
      const classId = this.verifyInvitationtable(selectList, isMail[type])
      if (!classId) {
        return
      }
      addAllowKeepAlive('/NewThankLetter')
      this.$router.push({
        name: '创建感谢函',
        params: {
          shouldShowInviteMeetBtn: true,
          state: 'course',
          type,
          courseList: selectList,
          blgStripLine:
            this.courseObj.blgStripLine ||
            this.$store.state.userInfo.blgStripLine, //  所属条线
          classId
        }
      })
    },
    // 查看已发送的 邀请函 和感谢函 2022-0707版本不需要查看功能
    lookInvitation(type, row) {
      const isMail = {
        invitation: 'isInvitationMail',
        thanksLetter: 'isThanksMail'
      }
      if(type === 'invitation' && row.isInvitationMail != 'Y') {
        return
      }
      if(type === 'thanksLetter' && row.isThanksMail != 'Y') {
        return
      }
      const selectList = [row]
      const classId = row.classId
      if (!classId) {
        return
      }
      addAllowKeepAlive('/NewThankLetter')
      this.$router.push({
        name: '创建感谢函',
        params: {
          shouldShowInviteMeetBtn: true,
          onlyShowBtn: true,
          state: 'course',
          type,
          courseList: selectList,
          blgStripLine:
            this.courseObj.blgStripLine ||
            this.$store.state.userInfo.blgStripLine, //  所属条线
          classId
        }
      })
    },
    selectable(row, index) {
      if (row.isInvitationMail === 'Y' && row.isThanksMail === 'Y') {
        return false
      } else {
        return true
      }
    },
    // 打开邀请函详情弹框,type:invitation-邀请函，thanksLetter-感谢函,row:当前选中的课程信息
    openViewThankLetter (type, row) {
      const params = {
        type,
        courseList: [row],
        blgStripLine:
          this.courseObj.blgStripLine ||
          this.$store.state.userInfo.blgStripLine, //  所属条线
        classId: row.classId,
      }
      this.$refs.viewThankLetterRef.open(params)
    }
  },
  created() {
    // this.commcClassId = '1112577'
    console.log('commcClassId:' + this.commcClassId)
    this.initData()
  },
  mounted() {}
}
</script>
