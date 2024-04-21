<template>
  <div class="StudentNotification">
    <el-card>
      <div class="StudentNotificationInfo">
        <el-form
          ref="queryFormRef"
          :rules="rules"
          :model="queryForm"
          label-width="90px"
          style="text-align: center"
          inline
        >
          <el-form-item label="通知名称" prop="notifyName">
            <el-input
              class="NameInput"
              placeholder="输入名称"
              :maxlength="50"
              v-model="queryForm.notifyName"
            ></el-input>
          </el-form-item>
          <el-form-item label="通知时间" required>
            <el-col :span="12">
              <el-form-item prop="notifyTimeDate">
                <el-date-picker
                  class="w-290"
                  v-model="queryForm.notifyTimeDate"
                  type="date"
                  :picker-options="pickerOptions"
                  placeholder="选择日期"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="notifyTimeTime">
                <el-time-picker
                  class="w-290"
                  :picker-options="{ selectableRange: timeMinTime }"
                  style="margin-left: 7px"
                  v-model="queryForm.notifyTimeTime"
                  placeholder="选择时分秒"
                  :clearable="false"
                  value-format="HH:mm:ss"
                  popper-class="time-picker"
                >
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="通知方式" class="modecheckBox">
            <el-col :span="24">
              <el-checkbox
                label="口袋银行家通知"
                v-model="queryForm.ifAppNotify"
                true-label="Y"
                false-label="N"
              ></el-checkbox>
              <el-checkbox
                label="邮件通知"
                v-model="queryForm.ifEmailNotify"
                true-label="Y"
                false-label="N"
              ></el-checkbox>
            </el-col>
          </el-form-item>
          <el-form-item
            label="APP消息内容"
            v-show="queryForm.ifAppNotify === 'Y'"
          >
            <el-input
              class="kdMessage"
              disabled
              v-model="queryForm.messageContent"
              type="textarea"
              prefix
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮件消息内容"
            v-show="queryForm.ifEmailNotify === 'Y'"
          >
            <div class="emailMessage" style="text-align: left">
              <div class="emailMessage__titles" v-show="queryForm.notifyName">
                <img :src="require('@/assets/svg/tongzhi.svg')" />
                <span>{{ queryForm.notifyName }}</span>
              </div>
              <div class="emailMessage__content">您好！</div>
              <div class="emailMessage__content content2">
                欢迎参加{{ queryForm.blgOrgName }}举办的“{{
                  queryForm.className
                }}”面授班，相关温馨提醒如下
              </div>
              <div class="emailMessage__name emailMessage__data">
                {{ queryForm.className }}
              </div>
              <div class="emailMessage__time emailMessage__data">
                {{ traingDate }}
              </div>
              <div class="emailMessage__address emailMessage__data">
                {{ queryForm.trainAddress }}
              </div>
              <div class="emailMessage__orgName">
                {{ queryForm.blgOrgName }}
              </div>
              <div class="emailMessage__orgTime">
                {{ queryForm.notifyTimeDate }}
              </div>
              <el-input
                class="emailMessage__input"
                v-model="queryForm.otherThings"
                type="textarea"
                :maxlength="200"
                placeholder="请输入..."
                prefix
              ></el-input>
              <div ref="ercode" class="emailMessage__qrcode"></div>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="footer-box dfc mt40">
      <el-button class="button-w80-h30" @click="cancell()">取消</el-button>
      <el-button
        class="button-w80-h30"
        type="primary"
        @click="submitForm('queryForm')"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { fetchInsertClassStudentNotify } from '@/fetch/establish'
import { hintFrame, jsonHeaders, closeCurrPage } from '@/util/utils'
export default {
  name: 'StudentNotification',
  data() {
    return {
      closeCurrPage,
      queryForm: {
        notifyName: '', //	通知名称	string
        notifyTime: '', // 通知时间	string
        notifyTimeTime: '', // 通知时间 时分秒 string
        ifAppNotify: 'N', // 口袋银行家APP通知方式	string
        ifEmailNotify: 'Y', //邮件通知方式	string
        notifyType: '1', //通知类型	string	1：学员通知 2：讲师通知
        sendStatus: '', //发送状态	string  只有已发送状态
        messageContent: '' //App消息内容	string	非必须
      },
      pickerOptions: {
        disabledDate(time) {
          if (time && time.getTime) {
            return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
          }
        }
      },
      rules: {
        notifyName: [
          {
            required: true,
            message: '请输入通知名称',
            trigger: 'blur'
          }
        ], //通知名称
        notifyTimeDate: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ], // 选择日期
        notifyTimeTime: [
          {
            type: 'string',
            required: true,
            message: '请选择时分秒',
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    timeMinTime() {
      let str = ''
      if (this.queryForm.notifyTimeDate) {
        const today = new Date()
        const date = today.toLocaleDateString()
        const notifyTimeDate = new Date(
          this.queryForm.notifyTimeDate
        ).toLocaleDateString()
        const isToday = date === notifyTimeDate
        if (isToday) {
          const time = this.formatTimes(today, 'hh:mm:ss')
          str += time
        } else {
          str += '00:00:00'
        }
      } else {
        str += '00:00:00'
      }
      str += '-23:59:59'
      return str
    },
    traingDate() {
      if (this.queryForm.dateStart && this.queryForm.dateEnd) {
        return `${this.queryForm.dateStart} - ${this.queryForm.dateEnd}`
      } else if (this.queryForm.dateStart) {
        return `${this.queryForm.dateStart}`
      } else {
        return ''
      }
    }
  },
  watch: {
    'queryForm.ifAppNotify': {
      handler(val) {
        let str = ''
        if (val === 'Y') {
          str = `亲爱的学员，${this.queryForm.className}将于${this.queryForm.dateStart}如期举办培训。\n请按时参训哦，期待您的加入！`
        } else {
          str = ''
        }
        this.queryForm.messageContent = str
      },
      immediate: true
    }
  },
  methods: {
    // 提交
    async submitForm() {
      hintFrame('确定发送此通知？').then(() => {
        this.$refs['queryFormRef'].validate(async (valid) => {
          if (valid) {
            const date = new Date(this.queryForm.notifyTimeDate)
            const arr = this.queryForm.notifyTimeTime.split(':')
            date.setHours(arr[0], arr[1], arr[2])
            const locationDate = this.formatTimes(date, 'yyyy-MM-dd hh:mm:ss')

            this.queryForm.notifyTime = locationDate
            const queryForm = JSON.parse(JSON.stringify(this.queryForm))
            delete queryForm.messageContent
            delete queryForm.emailContent
            await fetchInsertClassStudentNotify({data: queryForm})
            this.$message.success('保存成功')
            this.cancell()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    },
    cancell() {
      closeCurrPage()
    },
    formatTimes(dateTime, fmt) {
      const date = new Date(dateTime)
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    }
  },
  mounted() {
    const { params } = this.$route
    
    this.queryForm = Object.assign({}, this.queryForm, params)
    if(!this.queryForm.notifyId) {
      this.queryForm.ifEmailNotify = 'Y'
    } 
    let time = ''
    let date = ''
    if (this.queryForm.notifyTime) {
      time = this.formatTimes(this.queryForm.notifyTime, 'hh:mm:ss')
      date = this.formatTimes(this.queryForm.notifyTime, 'yyyy-MM-dd')
    }
    this.$set(this.queryForm, 'notifyTimeTime', time)
    this.$set(this.queryForm, 'notifyTimeDate', date)
    new QRCode(this.$refs.ercode, {
      text: this.queryForm.classQrCodeUrl,
      width: 110,
      height: 110,
      colorDark: '#000000',
      colorLight: '#ffffff'
    })
  }
}
</script>

<style lang="scss" scoped>
.StudentNotification {
  .StudentNotificationInfo {
    min-height: 450px;
    margin-top: 30px;
    .NameInput {
      width: 600px;
      height: 30px;
    }
    .modecheckBox {
      :deep(.el-form-item__content) {
        width: 600px;
        text-align: left;
      }
    }
    :deep(.el-form-item) {
      display: block;
    }
    .kdMessage {
      width: 600px;
      display: inline-block;
      :deep(textarea) {
        height: 60px;
        background: #f7f8fa;
        border: 1px solid #e0e1e3;
        border-radius: 2px;
        opacity: 0.6;
        color: #000;
        font-size: 12px;
        resize: none;
      }
    }
    .emailMessage {
      position: relative;
      display: inline-block;
      width: 600px;
      height: 930px;
      background: url('~@/assets/images/email_bill.png');
      background-repeat: no-repeat;
      background-size: 600px 930px;
    }
    :deep(.el-checkbox__label) {
      padding-left: 6px;
    }
    .emailMessage__titles {
      position: absolute;
      top: 122px;
      left: 36px;
      width: 527px;
      height: 65px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      img {
        width: 24px;
        height: 24px;
        margin-right: 3.5px;
      }
      span {
        font-family: PingFangSC-Medium, 'Roboto-Regular', 'PingFang SC',
          'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
        font-size: 20px;
        color: #583226;
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 700;
      }
    }
    .emailMessage__content {
      position: absolute;
      top: 244px;
      left: 105px;
      width: 430px;
      height: 22px;
      font-family: PingFangSC-Regular, 'Roboto-Regular', 'PingFang SC',
        'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
      font-size: 16px;
      color: #583226;
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
      &.content2 {
        top: 279px;
        line-height: 30px;
        height: auto;
        left: 70px;
        text-indent: 35px;
        width: 465px;
        display: -webkit-box;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: pre-line;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    }
    .emailMessage__data {
      position: absolute;
      left: 160px;
      width: 376px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #583226;
      letter-spacing: 0;
      line-height: 22px;
      font-weight: 400;
    }
   .emailMessage__name {
      top: 390px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .emailMessage__time {
      top: 433px;
    }
    .emailMessage__address {
      top: 476px;
    }
    .emailMessage__orgName,
    .emailMessage__orgTime {
      position: absolute;
      right: 15px;
      width: 386px;
      height: 35px;
      padding-left: 14px;
      padding-right: 14px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #583226;
      letter-spacing: 0;
      line-height: 35px;
      font-weight: 500;
      text-align: right;
    }
    .emailMessage__orgName {
      top: 805px;
      line-height: 20px;
    }
    .emailMessage__orgTime {
      top: 848px;
    }
    .emailMessage__input {
      position: absolute;
      top: 537px;
      left: 155px;
      width: 376px;
      :deep(textarea) {
        height: 157px;
        background: transparent;
        border: 0;
        font-size: 16px;
        color: #583226;
        resize: none;
      }
    }
    .emailMessage__qrcode {
      position: absolute;
      top: 776px;
      left: 74px;
    }
  }
}
</style>
