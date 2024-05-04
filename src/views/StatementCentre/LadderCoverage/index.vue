<template>
  <div class="SubBranchManager">
    <el-tabs v-model="activeTabOne" class="ladderInstructorTab">

      <el-tab-pane label="覆盖率查询" name="CoverageRate">
        <CoverageRateOrg :tabs="tabs" 
          v-show="activeTabTwo === LADDER_COVERAGE_TABS_RATE_JG" 
          :channelTypes="channelTypes"
          :activeTab.sync="activeTabTwo" />

        <CoverageRatePost :tabs="tabs" 
          v-show="activeTabTwo === LADDER_COVERAGE_TABS_RATE_GW" 
          :activeTab.sync="activeTabTwo" />
      </el-tab-pane>

      <el-tab-pane label="名单管理" name="NameList">
        <!-- <NameList v-for="tab in tabs" :key="tab.value"
          :tabs="tabs"  
          :channelTypes="channelTypes"
          v-show="tab.value === activeTabTwo" 
          :activeTab.sync="activeTabTwo" /> -->
        <NameList 
          :tabs="tabs"  
          :channelTypes="channelTypes"
          :activeTabOne="activeTabOne"
          :activeTab.sync="activeTabTwo" />
      </el-tab-pane>

      <el-tab-pane label="已举办培训班" name="TrainingClass">
        <!-- <TrainingClass v-for="tab in tabs" :key="tab.value" 
          :tabs="tabs" 
          :channelTypes="channelTypes"
          v-show="tab.value === activeTabTwo" 
          :activeTab.sync="activeTabTwo" /> -->

        <TrainingClass
          :tabs="tabs" 
          :channelTypes="channelTypes"
          :activeTab.sync="activeTabTwo" />
      </el-tab-pane>

      <el-tab-pane label="权限管理" name="Permission" v-if="isLSSuperAdmin" >
        <PermissionList :channelTypes="channelTypes" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'LadderCoverage',
}
</script>
<script setup>
import store from '@/store'
import { reactive, ref, onMounted, nextTick, computed } from 'vue'
import { 
  SUPER_ADAMIN_ROLE_CODE,
  LADDER_COVERAGE_TABS_NEW, LADDER_COVERAGE_TABS_SG, LADDER_COVERAGE_TABS_JYZ,
  LADDER_COVERAGE_TABS_RATE, LADDER_COVERAGE_TABS_RATE_JG, LADDER_COVERAGE_TABS_RATE_GW
} from '../enum'
import { usePostCascader } from '../hooks/usePostCascader'
import CoverageRateOrg from './CoverageRateOrg'
import CoverageRatePost from './CoverageRatePost'
import NameList from './NameList'
import TrainingClass from './TrainingClass'
import PermissionList from './PermissionList'

// 是否为 超管
const isLSSuperAdmin = computed(() => store.state.userInfo.roleIds.includes(SUPER_ADAMIN_ROLE_CODE))

const tabsData = reactive({
  CoverageRate: {
    active: LADDER_COVERAGE_TABS_RATE_JG,
    tabs: LADDER_COVERAGE_TABS_RATE,
  },
  NameList: {
    active: LADDER_COVERAGE_TABS_SG,
    tabs: LADDER_COVERAGE_TABS_NEW,
  },
  TrainingClass: {
    active: LADDER_COVERAGE_TABS_JYZ,
    tabs: LADDER_COVERAGE_TABS_NEW.slice(1),
  },
})

// 一级当前Tab
const activeTabOne = ref('CoverageRate')

// 二级当前Tab
const activeTabTwo = computed({
  get: () => tabsData[activeTabOne.value]?.active || '',
  set: (value) => {
    if (tabsData[activeTabOne.value]) {
      tabsData[activeTabOne.value].active = value
    }
  }
})

const tabs = computed(() => tabsData[activeTabOne.value]?.tabs || [] )

// ====================== 初始化 ======================
// 岗位选择框 - 相关变量
const { channelTypes, getPlanOptions } = usePostCascader({ fetchParams: { isLadder:"Y" } })
onMounted(() => {
  getPlanOptions()
})
</script>
<style lang="scss" scoped>

:deep(.ladderInstructorTab>.el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>