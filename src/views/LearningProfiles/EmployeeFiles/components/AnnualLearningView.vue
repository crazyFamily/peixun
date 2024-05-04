<template>
  <div class="annualLearningView">
    <div class="title">年度参训情况</div>
    <ul class="statistics">
      <li v-for="(item, index) in trainingInfoList" :key="index" class="year-info" :class="{ use: item.totalCount }">
        <p class="year">{{ YEARMAPING[index] }}月</p>
        <p v-if="item.totalCount" class="partic-sum unit">
          <span class="number">{{ item.totalCount }}</span
          >{{sumUnitTitle}}
        </p>
        <p v-if="item.totalHour" class="partic-duration">
          <span class="number">{{ item.totalHour }}</span
          >小时
        </p>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { YEARMAPING } from '../../enum'
const props = defineProps({
  trainingInfoList: [],
  sumUnitTitle: ''
})
</script>

<script>
export default {
  name: 'AnnualLearningView'
}
</script>
<style lang="scss" scoped>
.annualLearningView {
  background-color: #fff;
  // margin-left: 92px;
  width: 400px;
  // min-width: 380px;
  // width: 388px;
  min-width: 400px;
  .title {
    margin-bottom: 24px;
    font-family: 'PingFangSC-Medium', arial;
    font-size: 14px;
    color: #000000;
    line-height: 20px;
    font-weight: 500;
  }
  .statistics {
    display: flex;
    flex-wrap: wrap;
    .year-info {
      width: 100px;
      height: 80px;
      background: #f5f6fb;
      padding: 10px;
      border: 1px solid #fff;
      &.use {
        background-color: rgba(253, 103, 32, 0.1);
      }
      &:hover {
        border: 1px solid #fd6720;
        cursor: pointer;
      }
      .year {
        font-family: 'PingFangSC-Regular', arial;
        line-height: 20px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.6);
        text-align: right;
        font-weight: 400;
      }
      .partic-duration {
        white-space: nowrap;
        color: #000;
        margin-top: 2px;
      }
      .number {
        font-family: 'DINAlternate-Bold', arial;
        font-size: 18px;
        line-height: 18px;
        color: #fd6720;
        text-align: right;
        font-weight: 700;
        margin-right: 4px;
      }
      .unit {
        font-family: 'PingFangSC-Regular', arial;
        font-size: 12px;
        color: #000;
        font-weight: 400;
      }
    }
  }
}
</style>