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
            <div class="studentINfoTitle__status" v-if="this.courseObj.sendStatus == '1'">
              已发送
            </div>
          </div>
          <div class="studentINfoDate">
            <div class="studentINfoDate__tit">通知时间：</div>
            <div class="studentINfoDate_subTit">{{ this.courseObj.notifyTime }}</div>
          </div>
          <div class="studentINfoMode">
            <div class="studentINfoMode__title">通知方式：</div>
            <div class="studentINfoMode__subTit">
              <span v-if="this.courseObj.ifAppNotify === 'Y'">口袋银行家通知</span >
              <span v-if="this.courseObj.ifEmailNotify === 'Y'">邮件通知</span>
            </div>
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
            <!-- <div @click="openInvitation('invitation')" class="right__button">
              邀请函
            </div>
            <div @click="openInvitation('thanksLetter')" class="right__button">
              感谢函
            </div> -->
          </div>
        </div>
        <el-table :data="teacherList" stripe ref="teacherRef" class="teacherTable" style="width: 100%" >
          <!-- <el-table-column type="selection" width="50" :selectable="selectable"/> -->
          <el-table-column align="center" type="index" label="序号" width="50" >
              <!-- <template slot-scope="scope">
                  {{(pager.current -1) * pager.size + scope.$index + 1}}
              </template> -->
          </el-table-column>
          <el-table-column label="讲师姓名" width="110" prop="teacherName" />
          <el-table-column label="课程名称" min-width="200" prop="courseName" />
          <el-table-column label="授课时间" min-width="220">
            <template slot-scope="scope">
              <div> {{ scope.row.startDate + '–' + scope.row.endHour + ':' + scope.row.endtMin }} </div>
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
              <div> {{ scope.row.ifInviteMeet === '1' ? '是' : '否' }} </div>
            </template>
          </el-table-column>
          <el-table-column label="邀请函发送时间" min-width="180" prop="inviteSendDate" />
          <el-table-column label="感谢函" width="100">
            <template slot-scope="scope">
              <div class="td__invitation" :class="{ active: scope.row.isThanksMail === 'Y' }">
                <span v-if="scope.row.isThanksMail === 'Y'" style="cursor: pointer;" @click="openViewThankLetter('thanksLetter', scope.row)">已发送</span>
                <span v-else>未发送</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="感谢函发送时间" min-width="180" prop="grantSentDate" />
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
import ViewThankLetter from '../ViewThankLetter'
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

<style lang="scss" scoped>
.establish__TrainingNotice {
  .title__message {
    font-size: 14px;
  }
  .Student {
   .studentInfo {
      position: relative;
      width: 250px;
      height: 134px;
      margin: 20px 0 0 16px;
      border: 1px solid #eaecf1;
      border-radius: 5px;
      &:hover .item-mask {
        display: flex;
      }
      .studentINfoTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        background-color: #f7f8fa;
        padding: 0 5px 0 20px;
      }
      .studentINfoTitle__tit {
        font-size: 12px;
        color: #000000;
        letter-spacing: 0;
        font-weight: 400;
      }
      .studentINfoTitle__status {
        background: #fd6720;
        border-radius: 6.8px;
        font-size: 16px;
        padding: 6px 10px;
        color: #ffffff;
        text-align: center;
        font-weight: 400;
        transform: scale(0.5);
      }
      .studentINfoDate {
        display: flex;
        align-items: center;
        padding: 20px 20px 10px 20px;
      }
      .studentINfoMode {
        display: flex;
        align-items: center;
        padding: 10px 10px 20px 20px;
      }
      .studentINfoDate__tit,
      .studentINfoMode__title {
        opacity: 0.6;
        font-size: 12px;
        color: #000000;
        letter-spacing: 0;
        font-weight: 400;
      }
      .studentINfoDate_subTit {
        font-size: 12px;
        color: #000000;
        letter-spacing: 0;
        font-weight: 400;
      }
      .studentINfoMode__subTit {
        display: flex;
        span {
          font-size: 12px;
          margin-right: 10px;
          color: #ffc952;
          letter-spacing: 0;
          font-weight: 500;
        }
      }
      .item-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba($color: #000000, $alpha: 0.38);
        border-radius: 5px;
        &:hover {
          display: flex;
        }
      }
    }
  }
  .Teacher {
    margin-top: 30px;
    .teacherTable {
      margin-top: 10px;
    }
    .teacher__titles {
      display: flex;
      justify-content: space-between;
    }
    .teacher__right {
      display: flex;
      align-items: center;
    }
    .right__button {
      width: 80px;
      height: 30px;
      background: #ffffff;
      border: 1px solid #e0e1e3;
      border-radius: 2px;
      font-size: 12px;
      color: #424656;
      text-align: center;
      line-height: 30px;
      font-weight: 400;
      cursor: pointer;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
    .td__invitation {
      opacity: 0.4;
      font-size: 12px;
      color: #000000;
      font-weight: 400;
      &.active {
        color: #fd6720;
        opacity: 1;
      }
    }
  }
}
</style>
