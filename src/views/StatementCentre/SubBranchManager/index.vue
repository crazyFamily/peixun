<template>
  <div class="SubBranchManager">
    <el-tabs v-model="activeName" class="ladderInstructorTab">
      <el-tab-pane label="支行长参训率" name="ParticipationRate">
        <ParticipationRate />
      </el-tab-pane>
      <el-tab-pane label="支行长参训明细" name="NameList">
        <NameList />
      </el-tab-pane>
      <el-tab-pane label="支行长培训班管理" name="TrainingClass">
        <TrainingClass />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'SubBranchManager'
}
</script>
<script setup>
import { ref, computed } from 'vue'
import ParticipationRate from './ParticipationRate'
import NameList from './NameList'
import TrainingClass from './TrainingClass'

const activeName = ref('ParticipationRate')

</script>
<style lang="scss" scoped>

:deep(.ladderInstructorTab>.el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>