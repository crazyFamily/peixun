<template>
  <div class="plan-management__plan">
    <el-card class="plan-package-state">
      <div class="wrap">
        <div class="title-box">
          <span>
            <span>计划状态：</span><span>{{ annualPackageInfo.applyStatusDesc }}</span>
          </span>
          <div class="control-wrapper">
            <span v-if="annualPackageInfo.applyStatus === TRAINING_STATUS_DOING" class="active" @click="exportPlan">年度计划下载</span>
            <span class="pl10 active" v-if="annualPackageInfo.applyStatus && annualPackageInfo.applyStatus !== TRAINING_STATUS_TODO" @click="viewApprovalChain">查看审批</span>
          </div>
        </div>
        <div class="info-wrapper">
          <template v-for="(item, index) in [annualPackageInfo?.classPlanStatistic || {}, annualPackageInfo?.noClassPlanStatistic || {}]">
            <div class="container" :key="index">
              <p class="info-title" v-if="index === 0"><span class="label">培训班计划</span></p>
              <p class="info-title" v-if="index === 1"><span class="label">非培训班计划</span></p>
              <div class="items">
                <p class="item">
                  <span class="value bigger">{{item?.totalPlan || '-'}}</span><span class="label">总项目数</span>
                </p>
                <p class="item line">
                  <span class="value">{{item?.executedPlan || '-'}}</span><span class="label">已执行项目数</span>
                </p>
                <p class="item">
                  <span class="value bigger">{{item?.totalTerm || '-'}}</span><span class="label">总期数</span>
                </p>
                <p class="item">
                  <span class="value">{{item?.executedTerm || '-'}}</span><span class="label">已执行期数</span>
                </p>
                <p class="item">
                  <span class="value">{{item?.outPlanTerm || '-'}}</span><span class="label">计划外期数</span>
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </el-card>
    <CkeckApprovalRecord :row="currentApprovalData"></CkeckApprovalRecord>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { TRAINING_STATUS_DOING, TRAINING_STATUS_TODO } from '@/views/Establish/enum'
import { fetchExportPlanInfo } from '@/fetch/planManagement'
import CkeckApprovalRecord from '@/components/chunk/CkeckApprovalRecord.vue'
import { useAnnual } from '../hooks/useAnnual'
import { CopyObj } from '@/plugins/until'
const { mergeReactive, clearReactive } = useBaseDataEvents()
const { getAnnualPackageInfo } = useAnnual()

const props = defineProps({
  dataInfo: {
    type: Object,
    required: true
  }
})

// 获取计划数据
const annualPackageInfo = reactive({})
watch(() => props.dataInfo, (n) => {
  clearReactive(annualPackageInfo)
  mergeReactive({ origin: annualPackageInfo, target: n })
})

// 下载计划
const exportPlan = () => {
  fetchExportPlanInfo({ planPackageId: annualPackageInfo?.planPackageId })
}

const currentApprovalData = ref({})
const viewApprovalChain = () => {
  currentApprovalData.value = CopyObj(getAnnualPackageInfo())
}

</script>
<script>
export default {
  name: 'AnnualBaseInfo'
}
</script>

<style lang='scss' scoped>
.info-wrapper {
  display: flex;
  margin: 20px;

  .container {
    flex: 1;
    padding-right: 2%;
  }

  .info-title {
    width: 100%;
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-bottom: 15px;

    .label {
      position: relative;
      background-color: unset;
      z-index: 1;
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 40%;
        background: $themeColor;
        opacity: 30%;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: -1;
      }
    }
  }

  .container:last-child {
    padding-right: 0;
    padding-left: 3%;

    .items::after{
      display: none;
    }
  }

  .items {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    position: relative;
    color: #333;
    &::after {
      content: '';
      display: block;
      width: 1px;
      height: 70px;
      background-color: #EAECF1;
      position: absolute;
      right: -5%;
      top: 50%;
      transform: translateY(-50%);
    }

    .item {
      position: relative;
    }

    .item.line::after {
      content: '';
      display: block;
      width: 1px;
      height: 30px;
      background-color: #EAECF1;
      position: absolute;
      right: -40%;
      top: 50%;
      transform: translateY(-50%);
    }

    .value {
      font-size: 20px;
      display: block;
      margin: 5px 0;
      font-weight: 400;
      &.bigger {
        font-size: 30px;
        font-weight: 500;
      }
    }

    .label {
      display: block;
      margin: 5px 0;
    }
  }
}
.plan-package-state {
  margin-top: -1px;
  .wrap {
    border: 1px solid #eaecf1;
    .title-box {
      display: flex;
      height: 40px;
      padding: 0 20px;
      background-color: #f7f8fa;
      color: #7d8292;
      line-height: 40px;
      justify-content: space-between;
    }
  }
}
</style>