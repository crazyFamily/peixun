<template>
  <keep-alive>
    <div>
      <el-tabs v-model="activeTab" class="tabPage" :class="{ hideTabHeader: !showTabHeader }">
        <el-tab-pane name="studyCenter" label="首页">
          <HomePageSetting @showTabHeader="changeShowTabHeader"></HomePageSetting>
        </el-tab-pane>
        <el-tab-pane name="case" label="案例中心">
          <HomePageSettingCase @showTabHeader="changeShowTabHeader"></HomePageSettingCase>
        </el-tab-pane>
      </el-tabs>
    </div>
  </keep-alive>
</template>
<script>
export default {
  name: 'HomePageSetting'
}
</script>
<script setup>
import { ref } from 'vue'
import HomePageSetting from './HomePageSetting'
import HomePageSettingCase from '../HomePageSettingCase/HomePageSetting'

const activeTab = ref('studyCenter')
const showTabHeader = ref(true)

function changeShowTabHeader (data) {
  showTabHeader.value = data.flag
}

</script>

<style lang="scss" scoped>
:deep(.tabPage > .el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;

  .el-tabs__nav {
    left: calc(100% / 2 - 100px);
  }
}
:deep(.hideTabHeader > .el-tabs__header) {
  display: none;
}
</style>
