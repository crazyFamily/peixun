<template>
  <gc-model :title="title" :visible="visible" width="1000px" cancelText="" comfirmText="关闭" class="view-thank-letter"
      @close="close" @comfirm="close">
    <!-- 邮件区域 -->
    <el-card class="mt10">
      <div class="aic mt5">
        <span class="left-span">邮件名称</span>
        <span>{{ emailTitle }}</span>
      </div>
      <div v-if="queryForm.letterType === 'invitation'" class="aic mt20">
        <span class="left-span"></span>
        <el-checkbox class="inviteMeet-checkbox" v-model="ifInviteMeet" :disabled="true" true-label="1" false-label="0"
          >是否发送outlook会议邀请</el-checkbox>
        <!-- <div style="color: #b4b6bc;margin-left: 10px;" v-if="shouldShowTip">(当前时间已超过课程开始时间，无法再发送会议邀请！)</div> -->
      </div>
      <div v-if="queryForm.letterType === 'thanksLetter'" class="aic mt20">
        <span class="left-span"></span>
        <el-checkbox class="inviteMeet-checkbox" v-model="sendReport" :disabled="true" true-label="Y" false-label="N"
          >是否发送评估报告</el-checkbox>
      </div>
      <!-- 这里，后端接口无法返回数据，所以不显示 -->
      <!-- <div class="df mt20">
        <span class="left-span l30 tar">附件</span>
        <div class="items">
          <div class="item aic" v-for="(item, i) in accessory" :key="i">
            <i class="operation__doc mr6"></i>
            <span class="mr30 name">{{ item.fileName }}</span>
          </div>
        </div>
      </div> -->
    </el-card>

    <!-- 讲师区域 -->
    <el-card class="mt10">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="lecturer in invitationImgs" :key="lecturer.invitationUmdpId"
          :label="lecturer.teacherName" 
          :name="lecturer.invitationUmdpId">
          <div class="img">
            <img :src="lecturer.invitationUmdpImg" alt="" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </gc-model>
</template>

<script>
import { fetchGenerateInvitation } from '@/fetch/establish'
export default {
  name: 'ViewThankLetter',
  data() {
    return {
      visible: false,
      title: '',
      titleMap: {
        thanksLetterLook: '查看感谢函',
        invitationLook: '查看邀请函'
      },
      accessory: [], // 附件信息 数据数组
      activeName: '', // 激活的讲师名
      invitationImgs: [], //预览图片对象集合
      queryForm: {
        classId: '', // 培训班编号
        blgStripLine: '', // 所属条线
        letterType: 'invitation', // 类型：邀请函-invitation,感谢函-thanksLetter
        realManager: '',
        realManagerUmId: '',
        courseList: [] //  已选课程
      },
      emailTitle: '', //邮件名称
      ifInviteMeet: '0',
      sendReport: false,
    }
  },
  methods: {
    // 获取内容
    async getList() {
      const data = await fetchGenerateInvitation({ data: this.queryForm })
      this.emailTitle = data?.emailTitle || ''
      this.invitationImgs = data?.invitationImgs || []
      this.activeName = this.invitationImgs[0]?.invitationUmdpId || ''
    },
    close () {
      this.emailTitle = ''
      this.accessory = []
      this.invitationImgs = []
      this.visible = false
    },
    open (params) {
      // console.log('xf-params', params)
      this.queryForm.classId = params.classId
      this.queryForm.blgStripLine = params.blgStripLine
      this.queryForm.letterType = params.type
      this.queryForm.courseList = params.courseList
      if (params?.courseList?.length) {
        const course = params?.courseList[0]
        this.ifInviteMeet = course.ifInviteMeet
        this.sendReport = course.isSendReport
      }
      this.title = this.titleMap[this.queryForm.letterType + 'Look']
      this.getList()
      this.visible = true
    }
  },
  mounted() {
    this.activeName = this.invitationImgs[0]?.invitationUmdpId || ''
  },
}
</script>
