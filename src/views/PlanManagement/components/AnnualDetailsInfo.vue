<template>
  <el-card class="annual-plan__tabs">
    <el-tabs v-model="activeName">
      <el-tab-pane label="培训班计划" name="trainingCoursePlan">
        <TrainingCoursePlan></TrainingCoursePlan>
      </el-tab-pane>
      <el-tab-pane label="非培训班计划" name="mistakeTrainingCoursePlan">
        <MistakeTrainingCoursePlan></MistakeTrainingCoursePlan>
      </el-tab-pane>
      <el-tab-pane label="被分配计划" name="annualDispense" v-if="isShowDispense">
        <AnnualDispensePLan></AnnualDispensePLan>
      </el-tab-pane>
      <!-- <el-tab-pane label="预留费用" name="reservedCost">
        <ReservedCost></ReservedCost>
      </el-tab-pane> -->
    </el-tabs>
  </el-card>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import TrainingCoursePlan from './TrainingCoursePlan.vue'
import MistakeTrainingCoursePlan from './MistakeTrainingCoursePlan.vue'
import AnnualDispensePLan from './AnnualDispensePLan.vue'
import store from '@/store'
import { LINE_LS } from '@/util/constants'
const activeName = ref('trainingCoursePlan')
// 只有零售显示分配的数据
const isShowDispense = computed(() => {
  const line = store.getters['planManagement/getCurrentTopSearchParams']?.busiType[0]
  return line === LINE_LS
})
</script>
<script>
export default {
  name: 'AnnualDetailsInfo'
}
</script>

<style lang='scss' scoped>
</style>
