<template>
  <div>
    <!-- 特色 -->
    <ContentCard title="训练营特色" :title-bg="cardTitleBg">
      <ul>
        <li class="feature-row" v-for="(v, i) in contentInfo.featureInfo" :key="i">
          <div class="icon-wrapper">
            <img class="img-style" :src="orderIcon[i]" alt="" />
          </div>
          <div class="feature-wrapper">
            <h3 class="main-feature" v-if="v.mainFeature">{{ v.mainFeature }}</h3>
            <p class="sub-feature" v-if="v.subFeature">{{ v.subFeature }}</p>
          </div>
        </li>
      </ul>
    </ContentCard>

    <!-- 简介 -->
    <ContentCard title="训练营简介" :title-bg="cardTitleBg">
      <!-- <p style="padding: 10px">{{ contentInfo.introduce }}</p> -->
      <p class="introduce-title">
        <img class="title-icon" src="@/assets/svg/training-content.svg" />
        内容
      </p>
      <p class="introduce-content">
        {{ contentInfo.introduce }}
      </p>
      <p class="introduce-title">
        <img class="title-icon" src="@/assets/svg/training-time.svg" />
        时间
      </p>
      <p class="introduce-content">{{ rednerStartTime }} - {{ rednerEndTime }}</p>
      <p class="introduce-title"><img class="title-icon" src="@/assets/svg/training-humen.svg" />班主任</p>
      <div class="introduce-content">
        <template v-for="teacher in contentInfo.dataInfo.classAdviserUmList">
          <p class="introduce-list-item" :key="teacher.umId">{{ teacher.umName }} ({{ teacher.umId }})</p>
        </template>
      </div>
    </ContentCard>
    <!-- 内容 -->
    <ContentCard title="课程列表" :title-bg="cardTitleBg" class="course-type" :class="[{ 'training-type': type === 'training' }]">
      <template #title>
        <p class="title">课程列表</p>
      </template>
      <el-scrollbar class="course-wrapper">
        <TrainigItems :data-info="contentInfo.dataInfo.trainingStageList || []"></TrainigItems>
      </el-scrollbar>
    </ContentCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ContentCard from './ContentCard.vue'
import TrainigItems from './TrainigItems.vue'
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

const rednerStartTime = computed(() => {
  return props.contentInfo?.dataInfo?.startTime.replace(/-/g, '/')
})
const rednerEndTime = computed(() => {
  return props.contentInfo?.dataInfo?.endTime.replace(/-/g, '/')
})
</script>
<style lang='scss' scoped>
.introduce-title {
  font-size: 16px;
  padding-bottom: 5px;
  border-bottom: 1px solid $line-color;
}
.introduce-content {
  padding: 5px;
  padding-left: 20px;
  margin-bottom: 20px;
}

.introduce-list-item {
  height: 30px;
  line-height: 30px;
}

.introduce-title {
  display: flex;
  align-items: center;
  .title-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
}

.course-wrapper {
  height: 500px;
}

.training-type {
  :deep(.content-wrapper) {
    padding: 0;
  }
}

.icon-wrapper {
  $base-width: 30px;
  width: $base-width;
  height: $base-width;
  .img-style {
    width: 100%;
    height: 100%;
  }
}

.feature-wrapper {
  padding-left: 15px;
}

.feature-row {
  padding: 5px 0;
  display: grid;
  grid-template-columns: 30px auto;
  align-items: center;
  border-bottom: 1px dashed $line-color;

  &:last-child {
    border-bottom: unset;
  }

  .main-feature {
    font-size: 16px;
  }
  .sub-feature {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.4);
  }
}
</style>
