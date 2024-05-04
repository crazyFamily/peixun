<template>
  <div class="LadderManagement__LadderInstructorAuthorization">
    <el-tabs v-model="activeName" class="ladderCourseRecordTab">
      <el-tab-pane label="讲师授课评价" name="score">
        <LadderCourseScore />
      </el-tab-pane>
      <el-tab-pane label="讲师授课明细" name="detail">
        <LadderCourseDetail />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'LadderCourseRecord'
}
</script>
<script setup name="LadderCourseRecord">
import { ref } from 'vue'
import LadderCourseScore from './LadderCourseScore'
import LadderCourseDetail from './LadderCourseDetail'

const activeName = ref('score')

</script>

<style lang="scss" scoped>
:deep(.ladderCourseRecordTab>.el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>