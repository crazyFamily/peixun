<template>
  <div class="preivew-wrapper" :style="`background: ${templateColor}`">
    <div class="header" :style="`${headerTextColor ? `color: ${headerTextColor};` : ''}`">
      <img src="@/assets/images/logo-bank-top.svg" alt="" class="logo" />
      <p class="fir-title">{{ renderMainTitle }}</p>
      <p class="sec-title">{{ rednerSubTitle }}</p>
    </div>
    <div class="topic-img">
      <img class="img-style" v-if="rednerTopicImg" :src="rednerTopicImg" alt="" />
    </div>
    <div class="content-wrapper">
      <template v-if="type === 'courseBag'">
        <CourseBagShareContent v-bind="props"></CourseBagShareContent>
      </template>
      <template v-if="type === 'training'">
        <TraingShareContent v-bind="props"></TraingShareContent>
      </template>
    </div>
    <div class="footer">
      <img src="@/assets/images/logo-bank-bottom.svg" alt="" class="logo" />
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import ContentCard from './ContentCard.vue'
import TraingShareContent from './TraingShareContent'
import CourseBagShareContent from './CourseBagShareContent'
const props = defineProps({
  templateColor: {
    type: String,
    default: '#444B8A'
  },
  mainTitle: {
    type: String,
    required: true
  },
  subTitle: {
    type: String,
    required: true
  },
  contentInfo: {
    type: Object,
    required: true
  },
  // 头图
  topicImg: String,
  cardTitleBg: String,
  // header的文字颜色
  headerTextColor: String,
  // TODO: 类型限制值
  type: {
    type: String,
    required: true
  }
})

const orderIcon = {
  0: require('@/assets/images/h5-course-icon1.svg'),
  1: require('@/assets/images/h5-course-icon2.svg'),
  2: require('@/assets/images/h5-course-icon3.png')
}

const renderMainTitle = computed(() => {
  if (props.mainTitle) return props.mainTitle
  return '请设置页面主标题'
})
const rednerSubTitle = computed(() => {
  if (props.subTitle) return props.subTitle
  return '请设置页面副标题'
})
const rednerTopicImg = computed(() => {
  if (props.topicImg) return props.topicImg
  return ''
})
watch(
  () => props.topicImg,
  (n) => {
    console.log(n)
  },
  { immediate: true }
)
</script>
<style lang='scss' scoped>
.preivew-wrapper {
  position: relative;
}

.content-wrapper {
  padding: 0 20px;
}

.header {
  margin-bottom: 15px;
  position: absolute;
  color: #fff;

  .logo {
    margin-bottom: 20px;
  }
}

.fir-title {
  font-size: 32px;
  color: inherit;
  text-align: center;
  margin-bottom: 10px;
}

.sec-title {
  opacity: 0.8;
  font-size: 16px;
  color: inherit;
  text-align: center;
  margin-bottom: 20px;
}

.topic-img {
  min-height: 200px;
  text-align: center;

  .img-style {
    max-width: 100%;
  }
}

.sub-title {
  font-size: 12px;
}

.course-wrapper {
  height: 500px;
}

.course-type {
  :deep(.content-wrapper) {
    padding: 0;
  }
}
</style>
