<template>
  <div class="course-bag-wrapper" :class="{ ml0: isLv2andMaxLv3 }">
    <!-- 有主题 -->
    <template v-if="isSubject">
      <div v-for="subject in coursDataInfo" :key="subject.subjectId">
        <div class="top-bar" @click="arrowItem(subject.subjectId)">
          <p class="subject-title" :class="{ 'level0-title': subject.level === 0 }">
            <i v-if="subject.isRoot" class="el-icon-star-on" style="color: #ff7214"></i>
            {{ subject.titleIndex }} {{ subject.subjectName }}
          </p>
          <!-- 预留千位的空间 -->
          <span class="course-number">共{{ subject.courseNum }}门课</span>
          <i :class="showItems.includes(subject.subjectId) ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
        </div>
        <div v-show="showItems.includes(subject.subjectId)">
          <template v-if="subject.maxLevel >= 2 && subject.isRoot">
            <el-scrollbar class="topic-wrapper">
              <span
                class="topic-item"
                :class="{ active: topicMap[subject.subjectId]?.subjectId === topic.subjectId }"
                v-for="topic in subject.children"
                :key="topic.subjectId"
                @click="selectTopic(topic, subject)"
              >
                {{ topic.subjectName }}
              </span>
            </el-scrollbar>
            <template v-if="topicMap[subject.subjectId]">
              <CourseBagItems :dataInfo="topicMap[subject.subjectId].children" :isSubject="isSubject"></CourseBagItems>
            </template>
          </template>
          <template v-else>
            <template v-if="subject.children && subject.children.length">
              <CourseBagItems :dataInfo="subject.children" :isSubject="isSubject"></CourseBagItems>
            </template>
            <template v-else>
              <div class="course-wrapper" v-for="course in subject.courseList" :key="course.courseId">
                <p class="course-name">{{ course.titleIndex }} {{ course.courseName }}</p>
                <span class="link-button">去学习</span>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
    <!-- 无主题 -->
    <template v-else>
      <div class="course-wrapper" v-for="course in coursDataInfo" :key="course.courseId">
        <p class="course-name">{{ course.courseName }}</p>
        <span class="link-button">去学习</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, set, watch } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { CopyObj } from '@/util/utils'
import CourseInfoVue from '@/views/LadderManagement/compontes/CourseInfo.vue'
const { mergeReactive } = useBaseDataEvents()
const props = defineProps({
  dataInfo: {
    type: Array,
    required: true
  },
  isSubject: Boolean
})

const topicMap = reactive({})
const selectTopic = (topic, parent) => {
  console.log(topic, parent, '===>>>')
  set(topicMap, parent.subjectId, topic)
}

const showItems = ref([])
const coursDataInfo = ref([])
const isLv2 = ref(false)
const isMaxLv3 = ref(false)
watch(
  () => props.dataInfo,
  () => {
    coursDataInfo.value = CopyObj(props.dataInfo)
    coursDataInfo.value.forEach((course) => {
      // 没有下级则说明不是树或者为最后结点，不需要做后续操作
      if (!course.children) return
      // 防重复
      !showItems.value.includes(course.subjectId) && showItems.value.push(course.subjectId)
      if (course.maxLevel >= 2 && course.children && course.children.length) {
        selectTopic(course.children[0], course)
        isMaxLv3.value = true
      }
      isLv2.value = course.level === 2
    })
  },
  { immediate: true }
)

const isLv2andMaxLv3 = computed(() => {
  return isLv2.value && isMaxLv3.value
})

// 控制是否收起
const arrowItem = (id) => {
  const index = showItems.value.findIndex((item) => item === id)
  if (index > -1) {
    showItems.value.splice(index, 1)
  } else {
    showItems.value.push(id)
  }
}

const countMaxLevel = (datas, level = 0) => {
  data.forEach((data) => {
    data.level = level
    data.maxLevel = Math.max(data.maxLevel || 0, level)
    if (data.children) {
      countMaxLevel(datas.children, level + 1)
    } else {
    }
  })
}

const bagsMap = new Map()
const formatData = (datas) => {
  // 以一级主题为目标设置map
  datas.forEach((data) => {
    bagsMap.set(data.subjectId, data)
  })
  countMaxLevel(data)
}
</script>
<script>
export default {
  name: 'CourseBagItems'
}
</script>
<style lang='scss' scoped>
.course-bag-wrapper {
  margin-left: 10px;
  font-size: 12px;
  // padding: 0 10px;
  padding-right: 0;
}

.topic-wrapper {
  height: 50px;
  border-bottom: 1px solid $line-color;
  padding: 10px 0;

  :deep(.el-scrollbar__wrap .el-scrollbar__view) {
    white-space: nowrap;
    display: inline-block;
  }

  .topic-item {
    padding: 5px 10px;
    margin: 0 5px;
    background: rgba(0, 0, 0, 0.08);
    display: inline-block;
    border-radius: 16px;
    cursor: pointer;
  }

  .topic-item.active {
    color: #ff4800;
    background: rgb(#ff4800, 0.08);
    border-radius: 16px;
  }

  .topic-item:first-child {
    margin-left: 0;
  }
}

.top-bar {
  display: grid;
  grid-template-columns: auto 75px 12px;
  align-items: center;
  margin: 10px 0;
  padding: 10px 0;
  padding-right: 10px;
  border-bottom: 1px solid $line-color;
  box-sizing: border-box;

  margin: 0;
  &:last-child {
    // padding-bottom: 0;
  }
}

.course-number {
  text-align: right;
  padding: 0 5px;
}

.subject-title {
  width: 100%;
  font-size: 14px;
  // white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  cursor: pointer;

  &.level0-title {
    font-size: 16px;
  }
}

.ml0 {
  margin-left: 0;
}

.course-wrapper {
  // max-height: 50px;
  padding: 10px;
  font-size: 14px;
  border-bottom: 1px solid $line-color;
  display: grid;
  grid-template-columns: auto 56px;
  align-items: center;

  .course-name {
    padding-right: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}

.link-button {
  font-size: 12px;
  display: inline-block;
  padding: 3px 10px;
  color: #fff;
  background-color: #ff4800;
  border-radius: 12px;
  cursor: pointer;
}
</style>
