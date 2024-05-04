<template>
  <el-card class="SparkProject__StudentManagement">
    <el-tabs v-model="activeName">
      <el-tab-pane label="权限管理" name="QXGL">
        <AuthorityManagement />
      </el-tab-pane>
      <el-tab-pane label="申请记录" name="SQJL">
        <ApplicationRecord />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import AuthorityManagement from './components/AuthorityManagement'
import ApplicationRecord from './components/ApplicationRecord'
export default {
  name: 'StudentManagement',
  components: {
    AuthorityManagement,
    ApplicationRecord
  },
  data() {
    return {
      activeName: 'QXGL'
    }
  }
}
</script>
<style lang="scss" scoped>
.SparkProject__StudentManagement {
}
</style>