<template>
  <div class="learningOverview">
    <div class="card-first dii">
      <div class="study-time">
        <p class="study-title">总学习天数</p>
        <p>
          <span class="study-number">{{ personalTotalInfo.totalDay }}</span
          ><span class="time">天</span>
        </p>
      </div>
    </div>
    <div class="card-second dii">
      <div class="study-time">
        <p class="study-title">全行排名</p>
        <p>
          <span class="study-number">{{ personalTotalInfo.totalRank }}</span>
        </p>
      </div>
    </div>
    <div class="card-third dii">
      <div class="study-time">
        <p class="study-title">总学习时长</p>
        <p>
          <span class="study-number">
            {{ personalTotalInfo.totalHour }}
          </span>
          <br v-if="personalTotalInfo.totalHour >= 10000"/>
          <span class="time">小时</span>
        </p>
      </div>
    </div>
    <div class="card-fourth dii">
      <div class="study-time">
        <p class="online-hours-tip">线上学时</p>
        <p>
          <span class="online-hours-number">{{ personalTotalInfo.onLineHour }}</span
          ><span class="online-hours-itme">小时</span>
        </p>
        <p class="online-hours-tip face">面授学时(培训班)</p>
        <p>
          <span class="online-hours-number">{{ personalTotalInfo.faceHour }}</span
          ><span class="online-hours-itme">小时</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  personalTotalInfo: {
    type: Object,
    default: {}
  }
})
</script>

<script>
export default {
  name: 'LearningOverview'
}
</script>
<style lang="scss" scoped>
.learningOverview {
  width: 316px;
  min-width: 316px;
  display: flex;
  flex-wrap: wrap;
  margin: 26px 82px 32px 24px;
  .study-time {
    width: 150px;
    height: 90px;
    padding-top: 16px;
    padding-left: 16px;
    background-image: linear-gradient(-45deg, #ff865f 0%, #ffa169 100%);
    border-radius: 4px;
  }
  .study-title {
    margin-bottom: 4px;
    font-family: 'PingFangSC-Medium', arial;
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
  }
  .study-number {
    font-family: 'DINAlternate-Bold', arial;
    font-size: 30px;
    color: #ffffff;
    letter-spacing: -0.46px;
    font-weight: 700;
    margin-right: 6px;
  }
  .time {
    font-family: 'PingFangSC-Medium', arial;
    font-size: 14px;
    color: #ffffff;
    font-weight: 500;
  }
  .card-first {
    margin-right: 16px;
    margin-bottom: 16px;
  }
  .card-third {
    .study-time {
      background-image: linear-gradient(136deg, #ff9e69 0%, #ff8040 100%);
      height: 130px;
      border-radius: 4px 0 0 4px;
      .study-title {
        margin-top: 17px;
      }
    }
  }
  .card-fourth {
    .study-time {
      background-image: none;
      background-color:  rgba(253,103,32,0.10);
      height: 130px;
      width: 166px;
      border-radius: 0 4px 4px 0;
      .online-hours-tip {
        font-family: 'PingFangSC-Medium', arial;
        font-size: 14px;
        color: rgba(15, 15, 15, 0.6);
        font-weight: 500;
        margin-bottom: 5px;
      }
      .face {
        margin-bottom: 3px;
        margin-top: 11px;
      }
      .online-hours-number {
        font-family: 'DINAlternate-Bold', arial;
        font-size: 20px;
        color: #fd6720;
        font-weight: 700;
      }
      .online-hours-itme {
        font-family: 'PingFangSC-Medium', arial;
        font-size: 14px;
        margin-left: 4px;
        color: rgba(15, 15, 15, 0.6);
        letter-spacing: -0.22px;
        font-weight: 500;
      }
    }
  }
}
</style>