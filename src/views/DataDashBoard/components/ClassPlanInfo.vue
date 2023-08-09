<template>
  <!-- 基础数据 -->
  <div class="base-container plan-execution-wrapper">
    <div class="header-container">
      <span class="title">培训计划执行</span>
      <el-date-picker
        popper-class="DataDashboard__date-picker__template-dark"
        class="year-style"
        :editable="false"
        size="mini"
        v-model="planExecutionYear"
        type="year"
        :clearable="false"
        align="center"
        value-format="yyyy"
        @change="handleChange"
      >
      </el-date-picker>
    </div>
    <div class="content-container chart-wrapper" v-loading="getLoadingStatus('LOADING_STATISTIC_PLAN_INFO')">
      <div class="item-container">
        <p class="item-label">培训班计划总数</p>
        <p class="item-value">{{ classPlanInfo.totalTerm || 0 }}</p>
      </div>
      <div class="item-container">
        <p class="item-label">培训班计划已执行期数</p>
        <p class="item-value">{{ classPlanInfo.executedTerm || 0 }}</p>
      </div>
      <div class="item-container chart-view">
        <div class="item-content">
          <p class="item-label">执行率</p>
          <p class="item-value">{{ classPlanInfo.executedTermRate || 0 }}<span class="persent">%</span></p>
        </div>
        <div class="item-chart" :class="{'collapse': isCollapse}">
          <el-progress
            class="progress-style"
            type="circle"
            :percentage="Number(classPlanInfo.executedTermRate || 0)"
            :width="progressWidth"
            :stroke-width="10"
            :show-text="false"
            :color="BASE_CLASS_COLOR"
          >
          </el-progress>
        </div>
      </div>
      <div class="item-container">
        <p class="item-label">非培训班计划总数</p>
        <p class="item-value green">{{ nonClassPlanInfo.totalTerm || 0 }}</p>
      </div>
      <div class="item-container">
        <p class="item-label">非培训班计划已执行期数</p>
        <p class="item-value green">{{ nonClassPlanInfo.executedTerm || 0 }}</p>
      </div>
      <div class="item-container chart-view">
        <div class="item-content">
          <p class="item-label">执行率</p>
          <p class="item-value">{{ nonClassPlanInfo.executedTermRate || 0 }}<span class="persent">%</span></p>
        </div>
        <div class="item-chart" :class="{'collapse': isCollapse}">
          <el-progress
            class="progress-style green"
            type="circle"
            :percentage="Number(nonClassPlanInfo.executedTermRate || 0)"
            :width="progressWidth"
            :stroke-width="10"
            :show-text="false"
            :color="BASE_NON_CLASS_COLOR"
          >
          </el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { BASE_CLASS_COLOR, BASE_NON_CLASS_COLOR } from '../enum'
import { fetchStatisticPlanInfo } from '@/fetch/dataDashboard'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { useDataDashboard } from '../hooks/useDataDashboard'
import { getLoadingStatus } from '@/util/utils'
import store from '@/store'
const props = defineProps({
  orgs: {
    type: Array
  },
  height: { type: Number }
})
const { mergeReactive } = useBaseDataEvents()
const { watchOrgsCallback } = useDataDashboard({props})
const currentYear = String(new Date().getFullYear())
const planExecutionYear = ref(currentYear)

const classPlanInfo = reactive({})
const nonClassPlanInfo = reactive({})

const progressWidth = computed(() => {
  // 环大小设置为显示空间的80%
  return Number(((props.height - 10) /2 - 10) * 0.8)
})

const baseParams = {
  year: planExecutionYear.value,
  orgId: props.orgs[props.orgs.length-1]
}
// 计划统计
const getStatisticPlanInfo = () => {
  fetchStatisticPlanInfo({data: baseParams}).then((res) => {
    const { classPlan, nonClassPlan } = res
    mergeReactive({ origin: classPlanInfo, target: classPlan })
    mergeReactive({ origin: nonClassPlanInfo, target: nonClassPlan })
  })
}
// getStatisticPlanInfo()

const handleChange = () => {
  baseParams.year = planExecutionYear.value
  baseParams.orgId = props.orgs[props.orgs.length - 1]
  getStatisticPlanInfo()
}
watchOrgsCallback(handleChange)

const isCollapse = ref(false)
watch(() => store.getters['app/getAsideCollapse'], n => {
  isCollapse.value = n
}, {immediate: true})
</script>
<script>
export default {
  name: 'DataDashboardClassPlanInfo'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';
.plan-execution-wrapper {
  .content-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 5px;
  }

  .item-container {
    margin: 5px;
    padding: 0 6%;
    background: rgba(66, 82, 148, 0.43);
    box-shadow: 0px -1px 0px 0px rgba(46, 85, 163, 1);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .item-container.chart-view {
    flex-direction: initial;
    justify-content: flex-start;
    align-items: center;
  }

  .item-label {
    color: #fff;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .item-value {
    margin: 5px 0;
    font-size: 20px;
    font-weight: 500;
  }

  .persent {
    font-size: 16px;
  }

  .item-value.green {
    color: #36f8b0;
  }

  .item-content {
    width: 50%;
  }

  .item-chart {
    width: 50%;
    display: flex;
    align-items: center;
    // margin-left: 8%;
    &.collapse {
      // margin-left: 15%;
    }
  }

}

.progress-style {
  :deep(.el-progress__text) {
    margin-left: 0 !important;
  }

  :deep(.el-progress-circle__track) {
    stroke: #234c8f;
  }

  &.green {
    :deep(.el-progress-circle__track) {
      stroke: #235d7c;
    }
  }
}

</style>
