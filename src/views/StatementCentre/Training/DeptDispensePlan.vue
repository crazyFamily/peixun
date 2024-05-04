<template>
  <div class="plan-assignment">
    <el-tabs v-model="activeName" @tab-click="changeTabs" class="nav">
      <template v-for="(item, index) in tabPaneList">
        <el-tab-pane :key="index" :label="item.label" :name="item.value"></el-tab-pane>
      </template>
    </el-tabs>
    <component :is="activeRoute"></component>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Assignment from './components/Assignment.vue'
import IsAssigned from './components/IsAssigned.vue'
const tabPaneList = [
  {
    label: '我是分配方',
    value: 'Assignment',
    component: Assignment
  },
  {
    label: '我是被分配方',
    value: 'IsAssigned',
    component: IsAssigned
  }
]
const activeName = ref('Assignment')
const activeRoute = ref(Assignment)
const changeTabs = (val) => {
  activeName.value = val.name
  activeRoute.value = tabPaneList[val.index].component
}
</script>
<script>
export default {
  name: 'DeptDispensePlan'
}
</script>
<style lang="scss" scoped>
.plan-assignment {
  height: 100%;
  .nav {
    background-color: #fff;
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
}
</style>