<template>
  <div>
    <!-- 特色 -->
    <ContentCard title="课程特色" :title-bg="cardTitleBg">
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
    <ContentCard title="课程简介" :title-bg="cardTitleBg">
      <p style="padding: 10px">{{ contentInfo.introduce }}</p>
    </ContentCard>
    <!-- 内容 -->
    <ContentCard title="课程列表" :title-bg="cardTitleBg" class="course-type">
      <template #title>
        <p class="title">
          课程列表 <span class="sub-title">(共{{ contentInfo.subjectNum }}个主题，{{ contentInfo.courseNum }}课)</span>
        </p>
      </template>
      <el-scrollbar class="course-wrapper">
        <CourseBagItems :data-info="contentInfo.dataInfo || []" :is-subject="contentInfo.isSubject"></CourseBagItems>
      </el-scrollbar>
    </ContentCard>
  </div>
</template>

<script setup>
import ContentCard from './ContentCard.vue'
import CourseBagItems from './CourseBagItems'
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
</script>
<style lang='scss' scoped>
.course-wrapper {
  height: 500px;
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

.feature-wrapper {
  padding-left: 10px;
}
</style>
