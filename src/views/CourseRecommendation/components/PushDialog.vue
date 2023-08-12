<template>
  <div>
    <gc-model
      v-loading.fullscreen.lock="fullscreenLoading"
      title="公共推送设置"
      width="800px"
      :visible.sync="showPushDialog"
      @comfirm="comfirmPush()"
      @cancel="cancelPush()"
      @close="cancelPush()"
    >
      <el-form ref="pushFormRef" :model="pushForm" @submit.native.prevent>
        <el-form-item v-if="hasPushNum" label="历史推送记录" class="ws dr-label" prop="pushSettingId">
          <el-button type="primary" @click="toPushRecord()">查看</el-button>
          <el-button type="primary" @click="pushUmToAi()" v-show="isShowAIPushButton">AI练推送</el-button>
          <span class="ml10 tintColor" v-show="isShowAIPushButton">新创建的任务请15分钟后再进行推送</span>
        </el-form-item>
        <el-form-item label="推送人员设置" class="ws dr-label" prop="pushMode">
          <el-input
            readonly
            class="push-mode el-select"
            placeholder="请选择"
            :value="PUSH_MODE[pushForm.pushMode]"
            @click.native="openPushPersonnel()"
          >
            <i class="el-icon-arrow-down el-input__icon" slot="suffix"></i>
          </el-input>
          <el-button type="primary" :disabled="!pushForm.pushSettingId" @click="openCheckPerson()">查看人员清单</el-button>
          <p v-show="pushForm.pushSettingId" class="push-num">
            已选人数：{{ pushPersonNum.totalNum }}人，推送成功人数：{{
              pushPersonNum.successNum
            }}人，推送失败人数：{{ pushPersonNum.failNum }}人。
          </p>
        </el-form-item>
        <el-form-item label="剔除规则" class="ws dr-label" prop="vacationType">
          <el-checkbox-group v-model="pushForm.vacationType">
            <el-checkbox label="6">长期病假</el-checkbox>
            <el-checkbox label="7">产假</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="提醒方式" class="ws dr-label" prop="notification"
          v-if="businessType !== PUSH_TYPE['course']"
        >
          <el-checkbox-group v-model="pushForm.notification">
            <el-checkbox label="EMAIL">邮件</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </gc-model>

    <!-- 查看人员清单 dialog -->
    <PushPeopleList
      ref="pushPeopleListRef"
      :pushSettingId="pushForm.pushSettingId"
      :businessType="businessType"
      @close="checkPersonListsClose"
    />

    <!-- 推送人员设置 dialog -->
    <PushPersonnel ref="pushPersonnelRef" @confirm="pushPersonnelConfirm" />
  </div>
</template>

<script setup>
import { watch, computed, reactive, ref } from 'vue'
import { Message } from 'element-ui'
import router from '@/router'
import { addAllowKeepAlive } from '@/util/utils'
import {
  fetchSavePushSetting,
  fetchUploadPushUsers,
  fetchSearchPushResult,
  fetchPushToUser,
  fetchIsShowAIPushButton,
  fetchPushUmToAi
} from '@/fetch/courseRecommendation'
import {
  PUSH_MODE,
  PUSH_WHITELIST,
  PUSH_ORGAN_POST,
  PUSH_TYPE,
} from '@/views/CourseRecommendation/enum'
import PushPeopleList from './CheckPersonelInventory'
import PushPersonnel from './PushPersonnel'

const props = defineProps({
  showPushDialog: {
    type: Boolean,
    default: false
  },
  pushInfo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])
const businessType = computed(() => props.pushInfo.businessType)
const businessId = computed(() => Number(props.pushInfo.businessId))
const hasPushNum = computed(() => props.pushInfo?.pushNum > 0)
// 打开推送记录页面
const toPushRecord = () => {
  if (!hasPushNum.value) return Message.warning('暂无历史推送记录')
  const params = {
    businessType: businessType.value,
    businessId: businessId.value
  }
  addAllowKeepAlive('/CRPushRecord')
  router.push({ name: '推送记录', params })
}

const pushFormRef = ref(null)
watch(() => props.showPushDialog, () => {
  pushFormRef.value?.resetFields()
  if (props?.showPushDialog && props?.pushInfo?.businessType === 'training') {
    getIsShowAIPushButton()
  }
})
// 推送信息 表单
const pushForm = reactive({
  pushSettingId: null,
  vacationType: ['6', '7'],
  notification: [],
  pushMode: '',
})
// 推送成功失败人数
const pushPersonNum = ref({
  successNum: 0,
  failNum: 0,
  totalNum: 0
})
// 获取推送成功人数失败人数
const getPersonNum = async () => {
  const id = pushForm.pushSettingId
  if (!id) return
  const data = { pushSettingId: id }
  const resData = await fetchSearchPushResult(data)
  pushPersonNum.value = resData
}
const checkPersonListsClose = () => {
  getPersonNum()
}

const pushPeopleListRef = ref(null)
// 查看人员清单
const openCheckPerson = () => {
  if (!pushForm.pushSettingId) {
    return Message.warning('请先配置推送人员')
  }
  pushPeopleListRef.value.open()
}

const pushPersonnelRef = ref(null)
// 推送人员设置
const openPushPersonnel = () => {
  pushPersonnelRef.value.open()
}
// 推送人员 确认事件
const pushPersonnelConfirm = async (form) => {
  try {
    if (form.pushMode === PUSH_ORGAN_POST) {
      Object.keys(form).forEach((key) => {
        if (Array.isArray(form[key])) {
          form[key] = form[key].join(',')
        }
      })
      const data = {
        businessType: businessType.value,
        businessId: businessId.value
      }
      Object.assign(data, form)
      delete data.files
      const resData = await fetchSavePushSetting({ data })
      pushForm.pushSettingId = resData
      pushForm.pushMode = form.pushMode
      pushPersonnelRef.value.close()
      getPersonNum()
    } else if (form.pushMode === PUSH_WHITELIST) {
      const data = new FormData()
      data.append('files', form.files[0])
      data.append('businessType', businessType.value)
      data.append('businessId', businessId.value)
      const resData = await fetchUploadPushUsers(data)
      pushForm.pushSettingId = resData
      pushForm.pushMode = form.pushMode
      pushPersonnelRef.value.close()
      getPersonNum()
    }
  } catch (e) {
    console.log('推送人员 确认事件', e)
  }
}

const fullscreenLoading = ref(false)
// 推送给用户
const comfirmPush = async () => {
  try {
    const id = pushForm.pushSettingId
    if (!id) return Message.warning('请设置推送人员')
    fullscreenLoading.value = true
    const data = {
      pushSettingId: id,
      vacationType: pushForm.vacationType.join(','),
      notification: pushForm.notification.join(','),
    }
    fetchPushToUser({ data })
      .then(() => {
        // 训练营推送白名单时，同时推送AI练
        if (props?.pushInfo?.businessType === 'training') {
          fullscreenLoading.value = true
          fetchPushUmToAi({ trainingId: props.pushInfo.id }).then(() => {
            Message.success('推送成功')
            emit('close', true)
          }).catch((err) => {
            Message.error('AI练推送失败，可点击AI练推送按钮再次推送')
          }).finally(() => fullscreenLoading.value = false)
        } else {
          Message.success('推送成功')
          emit('close', true)
        }
      })
      .catch((err) => {
        Message.error('推送失败')
      })
      .finally(() => fullscreenLoading.value = false)
  } catch (error) {
    console.error(error)
  }
}
// 取消推送
const cancelPush = () => {
  document.querySelector('.v-modal')?.remove()
  emit('close')
}

const isShowAIPushButton = ref(false)
// 查询是否显示AI练um号推送按钮
const getIsShowAIPushButton = async () => {
  isShowAIPushButton.value = await fetchIsShowAIPushButton({ trainingId: props.pushInfo.id })
}
// 推送AI练UM
const pushUmToAi = async () => {
  fullscreenLoading.value = true
  fetchPushUmToAi({ trainingId: props.pushInfo.id }).then(() => {
    Message.success('AI推送成功')
  }).catch((err) => {
    Message.error(err.msg)
  }).finally(() => fullscreenLoading.value = false)
}
</script>
<script>
export default {
  name: 'PushDialog'
}
</script>

<style lang="scss" scoped>
.el-form {
  .push-mode {
    margin-right: 20px;
    width: 350px;
  }
  .push-num {
    margin: 10px 80px;
  }
}
</style>
