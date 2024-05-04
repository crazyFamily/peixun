<template>
  <el-tabs v-model="activeName" class="StatementCentre__OnlineStatistic">
    <el-tab-pane label="按案例统计" name="case">
      <Case />
    </el-tab-pane>
    <el-tab-pane label="按机构统计" name="organization">
      <Organization />
    </el-tab-pane>
    <el-tab-pane label="按人员统计" name="personnel">
      <Personnel />
    </el-tab-pane>
    <el-tab-pane label="按案例推送统计" name="casepush">
      <CasePush />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Case from './components/Case.vue'
import Organization from './components/Organization.vue'
import Personnel from './components/Personnel.vue'
import CasePush from './components/CasePush.vue'
export default {
  // 上线统计报表
  name: 'OnlineStatistic',

  components: {
    Case,
    Organization,
    Personnel,
    CasePush
  },

  props: {},

  data() {
    return {
      activeName: 'case'
    }
  }
}
</script>
<style lang="scss">
.StatementCentre__OnlineStatistic {
  .el-tabs__header {
    background-color: #fff;
    margin-bottom: -1px;
  }
}
</style>