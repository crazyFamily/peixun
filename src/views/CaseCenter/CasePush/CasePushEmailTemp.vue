<template>
  <div class="emial-temp">
    <div class="main-container">
      <el-row class="mb20">
        <el-col :span="6">
          <div>app提醒：<el-switch class="ml20 mr20" :disabled="isDetail" v-model="queryForm.appRemind" active-value="Y" inactive-value="N"></el-switch></div>
        </el-col>
        <el-col :span="18">
          <el-input type="textarea" maxlength="100" show-word-limit rows="3" :value="queryForm.appContent" disabled></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div>邮件提醒：<el-switch class="ml20 mr20" :disabled="isDetail" v-model="queryForm.emailRemind" active-value="Y" inactive-value="N"></el-switch></div>
        </el-col>
        <el-col :span="18">
          <p class="line-first info-style">xxx您好：</p>
          <el-input type="textarea" maxlength="200" show-word-limit rows="5" v-model="queryForm.emailContent" :disabled="isDetail"></el-input>
          <p class="info-style mt20">推送信息：</p>
          <table-pagination
            class="case-table"
            :list="columns"
            :tableList="tableList"
            :hidePagination="true"
            :queryForm="{ total: 0 }"
            ref="caseTablePagination"
          ></table-pagination>
          <div class="copyright-container">
            <div class="qrcode-container">
              <img class="qrcode-img" src="@/assets/images/qrcode.png" alt="" />
              <p>口袋银行家学习中心扫码可直接学习</p>
            </div>
            <div class="copyright">
              <p class="item info-style">所属机构：{{ _baseInfo.orgName }}</p>
              <p class="item info-style">推送时间：以实际推送时间为准</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="handleClose">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="handleConfirm">确定</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onActivated } from 'vue'
import { merge, resetObj } from '@/util/utils'
import { useRouter, useRoute } from '@/router'
import store from '@/store'
const router = useRouter()
const route = useRoute()
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
const columns = [
  { label: '序号', type: 'index' },
  { label: '是否必修', prop: 'isRequired' },
  { label: '案例名称', prop: 'caseName' },
  { label: '完成期限', prop: 'finishDate' }
]
const _baseInfo = ref({})
const tableList = ref([])
const queryForm = reactive({
  appRemind: '',
  emailRemind: '',
  appContent: '',
  caseRemindType: '',
  emailContent: ''
})
const isDetail = ref(false)
const handleConfirm = () => {
  let impendRemindType = ''
  if (queryForm.appRemind === 'Y' && queryForm.emailRemind === 'Y') {
    impendRemindType = 'ae'
  } else if (queryForm.appRemind === 'Y') {
    impendRemindType = 'app'
  } else if (queryForm.emailRemind === 'Y') {
    impendRemindType = 'email'
  }
  handleClose({
    emailContent: queryForm.emailContent,
    impendRemindType,
    caseRemindType: queryForm.caseRemindType
  })
}
const handleClose = params => {
  resetObj(queryForm)
  router.push({ name: '新增案例推送', params })
}
onActivated(() => {
  const remindInfo = store.getters['caseCenter/getRemindInfo']
  // 临期提醒方式 app-移动端推送 email-邮件推送 ae-移动端和邮件两种方式都推送
  switch (remindInfo.baseInfo?.impendRemindType) {
    case 'app':
      queryForm.appRemind = 'Y'
      queryForm.emailRemind = 'N'
      break
    case 'email':
      queryForm.appRemind = 'N'
      queryForm.emailRemind = 'Y'
      break
    case 'ae':
      queryForm.appRemind = 'Y'
      queryForm.emailRemind = 'Y'
      break
    default:
      queryForm.appRemind = 'N'
      queryForm.emailRemind = 'N'
  }
  const { baseInfo, caseList } = remindInfo
  merge(queryForm, baseInfo)
  caseList && (tableList.value = caseList)
  remindInfo.isDetail !== undefined && (isDetail.value = remindInfo.isDetail)
  if (caseList && baseInfo) {
    _baseInfo.value = baseInfo
    tableList.value = caseList.map(item => {
      let res = { ...item }
      res.isRequired = baseInfo.isRequired === 'Y' ? '必修' : '选修'
      res.finishDate = baseInfo.isRequired === 'Y' && baseInfo.finishDate || ''
      return res
    })
  }
})
</script>
<script>
export default {
  name: 'CasePushEmailTemp'
}
</script>
<style lang="scss" scoped>
.emial-temp {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.main-container {
  width: 60%;
  min-height: calc(100% - 45px);
  padding: 20px 0;
  margin: 0 auto;
}
.info-style {
  font-size: 16px;
  margin-bottom: 20px;
}

.qrcode-img {
  width: 190px;
  height: 190px;
}

.copyright-container {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.copyright {
  .item {
    width: 100%;
    text-align: right;
  }
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-end;
}
</style>