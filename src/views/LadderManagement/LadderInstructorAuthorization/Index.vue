<template>
  <div class="LadderManagement__LadderInstructorAuthorization">
    <el-tabs v-model="activeName" class="ladderInstructorTab">
      <el-tab-pane label="讲师授权" name="authorization">
        <LadderInstructorAuthorization />
      </el-tab-pane>
      <el-tab-pane label="讲师授课明细" name="detail">
        <LadderCourseDetail />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'LadderInstructorAuthorization'
}
</script>
<script setup>
import { ref } from 'vue'
import LadderInstructorAuthorization from './LadderInstructorAuthorization'
import LadderCourseDetail from './LadderCourseDetail'

const activeName = ref('authorization')

</script>

<style lang="scss" scoped>

:deep(.ladderInstructorTab>.el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>