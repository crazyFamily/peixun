<template>
<div>
  <el-tabs v-model="currentName" @tab-click="changeTabs" class="statementCentre__newstafftrain">
    <el-tab-pane v-for="item in tabPanneList" :key="item.value" :label="item.label" :name="item.value">
    </el-tab-pane>
  </el-tabs>
  <component :is="currentRoute"></component>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import Coverage from './components/Coverage.vue'
import Detail from './components/Detail.vue'
import Config from './components/Config.vue'
import TrainingClass from './components/TrainingClass'
import store from '@/store'
const tabPanneList = ref([
  {
    label: '覆盖率查询',
    value: 'Coverage',
    component: Coverage
  },
  {
    label: '明细查询',
    value: 'Detail',
    component: Detail
  },
  {
    label: '培训班管理',
    value: 'TrainingClass',
    component: TrainingClass
  }
])
// 大零售超管可见
if(store.state.userInfo.roleIds.includes('10000')){
  tabPanneList.value.push({
    label: '机构对应关系配置',
    value: 'Config',
    component: Config
  })
}
const currentRoute = ref(Coverage)
const currentName = ref('Coverage')
const changeTabs = val => {
  currentName.value = val.name
  currentRoute.value = tabPanneList.value[val.index].component
}
</script>
<script>
export default {
  name: 'NewStaffTrain'
}
</script>
<style lang="scss" scoped>
.statementCentre__newstafftrain {
  :deep(.el-tabs__header) {
    background-color: #fff;
    margin-bottom: -1px;
  }
}
</style>