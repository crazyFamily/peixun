<template>
  <page class="dashboard-wrapper" ref="dashboardWrapperRef" pageKey="P138791" page-title="数据大屏-培训指标">
    <div class="topbar-wrapper">
      <div class="item-wrapper orgs-wrapper">
        <gc-institution
          popper-class="DataDashboard__institution__template-dark"
          class="dashboard-orgs"
          v-model="orgs"
          :org-url="API_SELECT_FIXED_TREE"
          :fetch-params="{ busiType: 'LS' }"
          :defaultShow="true"
          ref="institutionRef"
        >
        </gc-institution>
      </div>
      <img class="top-title" src="~@/assets/images/dashboard-top-title.png" alt="" />
      <div class="item-wrapper full-screen-wrapper">
        <img class="full-screen-icon" src="~@/assets/svg/full-screen.svg" alt="" @click="fullScreen()" />
      </div>
    </div>
    <div class="body-wrapper" ref="bodyWrapperRef">
      <div class="left-wrapper">
        <!-- 基础数据 -->
        <ClassPlanInfo :orgs="orgs" :height="chartWrapperHeight" :style="`height: ${chartWrapperHeight + 35}px;`"></ClassPlanInfo>
        <!-- 日历 -->
        <ClassCalendar :orgs="orgs"></ClassCalendar>
      </div>
      <div class="right-wrapper" ref="rightWrapperRef">
        <!-- 培训项目数量 -->
        <ClassNum :orgs="orgs" :height="chartWrapperHeight"></ClassNum>
        <!-- 培训项目分布 -->
        <ClassDistribution :orgs="orgs" :height="chartWrapperHeight"></ClassDistribution>
        <!-- 人均学时 -->
        <AvgStudyInfo :orgs="orgs" :height="chartWrapperHeight"></AvgStudyInfo>
        <!-- 年度总学时 -->
        <TotalStudyInfo :orgs="orgs" :height="chartWrapperHeight"></TotalStudyInfo>
        <!-- 案例产出 -->
        <CaseInfo :orgs="orgs" :height="chartWrapperHeight"></CaseInfo>
        <!-- 案例学习 -->
        <CaseStudy :orgs="orgs" :height="chartWrapperHeight"></CaseStudy>
      </div>
    </div>
  </page>
</template>

<script setup>
import charts from '@/components/charts'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import store from '@/store'
import SelectSwitch from '@/components/select/SelectSwitch.vue'
import { APIAllTree, API_SELECT_FIXED_TREE } from '@/fetch/public'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import ClassNum from './components/ClassNum.vue'
import ClassDistribution from './components/ClassDistribution.vue'
import AvgStudyInfo from './components/AvgStudyInfo.vue'
import TotalStudyInfo from './components/TotalStudyInfo.vue'
import CaseInfo from './components/CaseInfo.vue'
import CaseStudy from './components/CaseStudy.vue'
import ClassPlanInfo from './components/ClassPlanInfo.vue'
import ClassCalendar from './components/ClassCalendar.vue'

const { mergeReactive } = useBaseDataEvents()
const currentYear = String(new Date().getFullYear())
const currentMonth = String(new Date().getMonth() + 1)
const planExecutionYear = ref(currentYear)
const calendarValue = ref(`${currentYear}-${currentMonth}`)
const orgs = ref(['LS', 'SD00000001'])

const classPlanInfo = reactive({})
const nonClassPlanInfo = reactive({})

// 切换全屏
const fullState = ref(false)
const switchFull = () => {
  if (document.fullscreenElement) {
    fullState.value = true
  } else {
    fullState.value = false
  }
  store.commit('app/updateFullScreenStatus', fullState.value)
  updateContainerHeight()
}
const fullScreen = () => {
  if (store.getters['app/getFullScreenStatus']) {
    const cfs = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || document.exitFullscreen
    cfs.call(document)
  } else {
    document.body.requestFullscreen()
  }
}

const chartWrapperHeight = ref(0)
const institutionRef = ref(null)
onMounted(() => {
  document.addEventListener('fullscreenchange', switchFull)
  updateContainerHeight()
  institutionRef.value.setContentValue(['零售', '总行大零售'])
})

const calendarMap = ref(new Map())

const rightWrapperRef = ref(null)
const updateContainerHeight = () => {
  // 全屏设置为宏任务，设置200ms延时用于等待dom刷新
  setTimeout(() => {
    chartWrapperHeight.value = Math.floor((rightWrapperRef?.value?.offsetHeight - 10) / 3) - 10 - 30 - 5
  }, 200)
}

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', switchFull)
})
</script>
<script>
export default {
  name: 'DataDashboard'
}
</script>

<style lang="scss" scoped>
@import './stylesheets/public.scss';

.dashboard-wrapper {
  width: 100%;
  height: 100%;
  min-height: 700px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  color: #74c6fe;
  background: url('~@/assets/images/dashboard-bg.svg') repeat;
}

.topbar-wrapper {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  text-align: center;
  background: url('~@/assets/images/dashboard-top-bg.png') repeat-x;
  background-size: auto 100%;
  position: relative;
  display: flex;
  justify-content: space-between;

  .item-wrapper {
    width: 200px;
  }

  .item-wrapper.full-screen-wrapper {
    text-align: right;
  }

  .top-title {
    height: 100%;
  }

  .full-screen-icon {
    width: 24px;
    height: 24px;
    margin-top: 5px;
    cursor: pointer;
  }

  .orgs-wrapper {
    margin-top: 5px;
  }

  .dashboard-orgs {
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.3);
    cursor: pointer;

    :deep(.input) {
      height: 22px;
      line-height: 22px;
      background: #1f3b89;
      border: 1px solid #39afff;
      border-radius: 1481px;
      color: rgba(57, 175, 255, 1);
      text-align: left;
    }

    :deep(.hint) {
      color: rgba(57, 175, 255, 1);
    }

    :deep(.input i) {
      height: 22px;
      position: relative;
    }

    :deep(.el-icon-arrow-down::before) {
      background: unset;
      @include allowStyle();
    }
  }
}

.body-wrapper {
  display: flex;
  flex-flow: row wrap;
  height: calc(100% - 50px);
}

.left-wrapper,
.right-wrapper {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
}

.right-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
}

.left-wrapper {
  display: flex;
  flex-direction: column;
  padding-right: 0;
}
</style>

<style lang="scss">
// 这里由于弹窗是生成在body上，所以需要使用到全局样式，样式名使用BEM类型
.DataDashboard__date-picker__template-dark {
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);

  .popper__arrow {
    top: -7px !important;
  }

  .el-year-table td .cell {
    color: #fff;
  }

  .el-date-picker__header-label {
    color: #fff;
  }

  .el-picker-panel__icon-btn {
    color: #fff;
  }

  .el-date-picker__header--bordered {
    border-bottom: 1px dashed rgba(72, 128, 215, 0.5);
  }
}

.DataDashboard__institution__template-dark {
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);

  .blgStripLine {
    border-right: 1px dashed rgba(72, 128, 215, 0.5);
  }

  .el-tree {
    background-color: transparent;
    color: #fff;
  }

  .el-tree-node__content:hover {
    background: #1f3b89;
  }

  .el-tree-node, .is-current, .is-focusable {
    .el-tree-node__content {
      background-color: transparent !important;
    }
  }

  .tree-wrap .is-current > .el-tree-node__content {
    background-color: transparent !important;
  }

  .el-tree-node.is-current.is-current > .el-tree-node__content .custom-tree-node {
    background-color: transparent !important;
    color: rgba(57, 175, 255, 1) !important;
  }

  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content .el-tree-node__expand-icon {
    color: rgba(57, 175, 255, 1) !important;
  }

  .blgStripLine .item.active {
    color: rgba(57, 175, 255, 1);
  }

  .blgStripLine .item.active i {
    color: rgba(57, 175, 255, 1) !important;
  }
}
</style>
