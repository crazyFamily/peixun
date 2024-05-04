<template>
  <div class="personalOverview">
    <div class="nav">
      <div class="fg">
        <img src="@/assets/svg/line.svg" alt="" />
      </div>
      <div class="title">个人概览</div>
    </div>
    <div class="content">
      <LearningOverview :um-id="umId" :personalTotalInfo="personalTotalInfo"></LearningOverview>
      <LearningPie :um-id="umId" :currentYear="currentYear" :totalHour="personalTotalInfo.totalHour"></LearningPie>
      <LearningRanking :um-id="umId" :currentYear="currentYear"></LearningRanking>
    </div>
  </div>
</template>
<script setup>
import { watch } from 'vue'
import LearningOverview from './LearningOverview.vue'
import LearningPie from './LearningPie.vue'
import LearningRanking from './LearningRanking.vue'
const props = defineProps({
  personalTotalInfo: {},
  currentYear: {
    type: String,
    default: ''
  },
  personalRankInfo: {},
  umId: {
    type: String,
    required: true
  },
})
watch(
  () => props.personalTotalInfo,
  (n) => {
    // console.log('personalTotalInfo',props.personalTotalInfo)
  }
)
</script>

<script>
export default {
  name: 'PersonalOverview'
}
</script>
<style lang="scss" scoped>
.personalOverview {
  background-color: #fff;
  margin-top: 9px;
  overflow-y: auto;
  box-shadow: 0px 2px 5px 0px rgba(188, 188, 188, 0.08);
  border-radius: 2px;
  padding-top: 19px;
  .nav {
    margin-left: 24px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    .title {
      font-family: 'PingFangSC-Medium', arial;
      font-size: 18px;
      margin-left: 8px;
      color: #000000;
      font-weight: 500;
    }
  }
  .content {
    display: grid;
    flex-wrap: nowrap;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>