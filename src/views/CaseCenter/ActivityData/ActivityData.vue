<template>
  <div class="CaseCenter__ActivityData">
    <el-tabs v-model="activeName">
      <el-tab-pane label="活动排名" name="activity">
        <Activity />
      </el-tab-pane>
      <el-tab-pane label="中奖名单" name="winner">
        <Winner />
      </el-tab-pane>
      <el-tab-pane label="英雄名单" name="hero">
        <Hero />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Activity from './components/Activity.vue'
import Winner from './components/Winner.vue'
import Hero from './components/Hero.vue'
export default {
  name: 'ActivityData',
  components: {
    Hero,
    Winner,
    Activity
  },
  data() {
    return {
      activeName: 'activity'
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>
