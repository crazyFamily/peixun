<template>
  <div class="employeeFiles__employeeFiles">
    <BasicProfileInfo v-bind="{ ...basicInfo }" :um-id="currentUmId" @change="changeCurrentYear"></BasicProfileInfo>
    <PersonalOverview v-loading="isListLoadig" :um-id="currentUmId" v-show="!isEmpty" v-bind="{ ...personalInfo, currentYear: basicInfo.currentYear }"></PersonalOverview>
    <LearningAnalysis v-loading="isListLoadig" :um-id="currentUmId" v-show="!isEmpty" :currentYear="basicInfo.currentYear"></LearningAnalysis>
    <div v-show="!isEmpty" class="gray"></div>
    <div v-if="isEmpty" class="no_data">
      <img src="@/assets/images/no-data.png" alt="" />
      <p>暂无内容</p>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import store from '@/store'
import BasicProfileInfo from './components/BasicProfileInfo.vue'
import PersonalOverview from './components/PersonalOverview.vue'
import LearningAnalysis from './components/LearningAnalysis.vue'
import { fetchGetBasicInfo, fetchListRecordYear } from '@/fetch/learningProfiles'

const props = defineProps({
  umId: String,
  immediate: {
    type: Boolean,
    default: true
  }
})

const currentUmId = ref(props.umId || store.state.userInfo?.umId)

// 个人概览数据
const basicInfo = ref({
  yearList: [],
  currentYear: new Date().getFullYear + '',
  userInfo: {}
})
const personalInfo = ref({
  personalTotalInfo: {},
  personalPieInfo: {},
  personalRankInfo: {}
})
// 按UM查询学习记录年度列表
const getListRecordYear = async () => {
  const res = (await fetchListRecordYear({ data: { umId: currentUmId.value } })) || []
  basicInfo.value.yearList = res.map((v) => ({
    value: v + '',
    label: v + ''
  }))
  if (basicInfo.value.yearList.length) {
    basicInfo.value.currentYear = basicInfo.value.yearList[0].value
  }
  getBasicInfo()
}
const isEmpty = ref(false)
const isListLoadig = ref(false)
// 个人信息及个人概况
const getBasicInfo = async () => {
  isListLoadig.value = true
  const res = (await fetchGetBasicInfo({ data: { calYear: basicInfo.value.currentYear, umId: currentUmId.value } })) || {}
  isListLoadig.value = false
  basicInfo.value.userInfo = { ...res }
  personalInfo.value.personalTotalInfo = { ...res }
  isEmpty.value = personalInfo.value.personalTotalInfo.totalHour ? false : true
}
const changeCurrentYear = (val) => {
  basicInfo.value.currentYear = val
  getBasicInfo()
}

onMounted(() => {
  if(props.immediate) {
    getListRecordYear()
  }
})
</script>

<script>
export default {
  name: 'EmployeeFiles'
}
</script>
<style lang="scss" scoped>
.employeeFiles__employeeFiles {
  height: 100%;
  .no_data {
    height: fit-content;
    img {
      width: 200px;
    }
    p {
      margin-top: 12px;
    }
  }
  .gray {
    height: 28px;
  }
}
</style>