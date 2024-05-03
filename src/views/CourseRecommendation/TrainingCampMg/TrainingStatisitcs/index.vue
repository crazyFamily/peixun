<template>
  <div class="training-camp_container">
    <template v-if="status !== 'detail'">
      <div class="top-bar">
        <p class="title">数据统计</p>
        <div class="nav">
          <span class="nav-item" :class="{ active: activeName === 'training' }" @click="activeName = 'training'"> 训练营维度 </span>
          <span class="nav-item" :class="{ active: activeName === 'student' }" @click="activeName = 'student'"> 学员维度 </span>
        </div>
      </div>
      <div class="base-info">
        <span class="info-item">训练营名称：{{ trainingInfo.trainingName }}</span>
        <span class="info-item">已完成人数：{{ trainingInfo.completeNum }}/{{ trainingInfo.studentNum }}人</span>
      </div>

      <div class="container-wrapper">
        <TrainingCamp :training-id="trainingId" v-show="activeName === 'training'"></TrainingCamp>
        <TraineeLatitude
          :training-id="trainingId"
          :training-stage-list="trainingStageList"
          @change="detailChangeHandle"
          v-show="activeName === 'student'"
        ></TraineeLatitude>
      </div>
    </template>
    <template v-else>
      <div class="top-bar">
        <p class="title">数据统计</p>
      </div>
      <div class="base-info">
        <span class="info-item">学员名称: {{ studentName }}（{{ studentUm }}）</span>
      </div>
      <div class="container-wrapper">
        <TrainingDetail :training-id="trainingId" :um-id="studentUm" @change="detailChangeHandle"></TrainingDetail>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onActivated, ref } from 'vue'
import TrainingCamp from './TrainingCamp'
import TraineeLatitude from './TraineeLatitude'
import TrainingDetail from './TrainingDetail'
import router from '@/router'
const activeName = ref('training')
const trainingId = ref('')
const trainingStageList = ref([])
const trainingInfo = ref({})
const status = ref('report')
const studentUm = ref('')
const studentName = ref('')
const detailChangeHandle = (value, row) => {
  status.value = value
  if (value === 'detail') {
    studentUm.value = row.umId
    studentName.value = row.empName
  }
}
onActivated(() => {
  const params = router?.app?.$route?.params
  if (params && params.id) {
    trainingId.value = params.id
    status.value = 'report'
    activeName.value = 'training'
  }
  params && params.trainingStageList && (trainingStageList.value = params.trainingStageList)
  params && params.trainingInfo && (trainingInfo.value = params.trainingInfo)
})
</script>
<script>
export default {
  name: 'CRTrainingCampStatistics'
}
</script>

<style lang="scss" scoped>
.training-camp_container {
  background: #fff;
  padding: 20px;
  font-size: 14px;
  & .h1 {
    font-size: 16px;
  }
  & .el-tabs__content {
    font-size: 16px;
  }
}

.top-bar {
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: auto 190px;
  place-items: baseline;

  .title {
    font-size: 16px;
  }
}

.nav {
  width: 188px;
  height: 32px;
  display: grid;
  grid-template-rows: repeat(1, 1fr);
  grid-template-columns: repeat(2, 1fr);

  .nav-item {
    border: 1px solid $line-color-2;
    display: grid;
    place-items: center;
    border-right: 0;
    cursor: pointer;

    &:first-child {
      border-radius: 5px 0 0 5px;
    }
    &:last-child {
      border-radius: 0 5px 5px 0;
      border-right: 1px solid $line-color-2;
    }

    &.active {
      border: 1px solid $themeColor;
      color: $themeColor;
    }
  }
}

.base-info {
  margin: 20px 0;

  .info-item {
    display: inline-block;
    margin-right: 55px;
  }
}
</style>