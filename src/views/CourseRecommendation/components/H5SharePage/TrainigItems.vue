<template>
  <div class="training-wrapper">
    <template v-for="(stage, stageIndex) in dataInfo">
      <div class="stage-wrapper" :key="stage.id">
        <div class="stage-info-wrapper">
          <p class="stage-title">
            <span class="stage-label">阶段{{ stageIndex + 1 }}</span> {{ stage.stageName }}
          </p>
          <p class="stage-time">{{ formatTime(stage.startTime) }} - {{ formatTime(stage.endTime) }}</p>
          <div class="type-box">
            <template v-for="(countRow, countRowIndex) in reanderTypesCount(stage.id)">
              <span class="type-wrapper" v-show="countRow.count !== 0" :key="stage.id + countRowIndex">
                <span>{{ countRow.label }}</span>
                <span class="type-count">{{ countRow.count }}</span>
              </span>
            </template>
          </div>
          <!-- <i class="arrow-icon" :class="[{ 'el-icon-arrow-down': !isCollect, 'el-icon-arrow-up': isCollect }]" @click="isCollect = !isCollect"></i> -->
          <i
            class="arrow-icon"
            :class="[{ 'el-icon-arrow-down': !showItems.includes(stage.id), 'el-icon-arrow-up': showItems.includes(stage.id) }]"
            @click="arrowStageHandle(stage.id)"
          ></i>
        </div>
        <div class="stage-content-wrapper" v-show="showItems.includes(stage.id)">
          <template v-for="series in stage.stageSeriesList">
            <div v-if="series.type === TRAINING_SERIES" :key="series.id">
              <div class="series-wrapper">
                <p class="series-title" v-if="series.content">{{ series.title }} · {{ series.content }}</p>
              </div>
              <div class="series-content-wrapper">
                <template v-for="row in series.stageSeriesList">
                  <div class="content-wrapper" :key="row.id">
                    <span class="content-label">{{ TRAINING_SERIES_TYPE[row.type] }}</span>
                    {{ row.content }}
                    <i
                      class="arrow-icon"
                      :class="[{ 'el-icon-arrow-down': !showItems.includes(stage.id), 'el-icon-arrow-up': showItems.includes(stage.id) }]"
                    ></i>
                  </div>
                </template>
              </div>
            </div>
            <template v-if="series.type === TRAINING_CLASS">
              <div v-for="(classCourse, classIndex) in series.courseList" :key="classCourse.classId">
                <div class="series-wrapper">
                  <p class="series-title">第{{ classIndex+1 }}天 · {{ classCourse.courseDate }}</p>
                </div>
                <div class="series-content-wrapper">
                  <div class="content-wrapper">
                    <span class="content-label">课程</span>
                    {{ classCourse.courseName }}
                    <i
                      class="arrow-icon"
                      :class="[{ 'el-icon-arrow-down': !showItems.includes(stage.id), 'el-icon-arrow-up': showItems.includes(stage.id) }]"
                    ></i>
                  </div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useTrainingHooks } from '@/views/CourseRecommendation/TrainingCampMg/hooks/useTrainingHooks'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { TRAINING_SERIES, TRAINING_CLASS, TRAINING_SERIES_TYPE } from '@/views/CourseRecommendation/enum'
const { mergeReactive } = useBaseDataEvents()
const { typesCount } = useTrainingHooks()

const props = defineProps({
  dataInfo: {
    type: Array,
    required: true
  }
})

const showItems = ref([])
const typesCountInfo = reactive({})

watch(
  () => props.dataInfo,
  (n) => {
    n.forEach((stage) => {
      showItems.value.push(stage.id)
    })
    console.log(typesCount(n))
    mergeReactive({ origin: typesCountInfo, target: typesCount(n) })
  },
  { immediate: true }
)

const reanderTypesCount = (id) => {
  return Object.values(typesCountInfo[id])
}

const arrowStageHandle = (id) => {
  const index = showItems.value.findIndex((item) => item === id)
  if (index > -1) {
    showItems.value.splice(index, 1)
  } else {
    showItems.value.push(id)
  }
}

const formatTime = (time) => {
  return time.split(' ')[0].replace(/-/g, '/')
}

// TODO: 后端提供数据
</script>
<style lang='scss' scoped>
.stage-wrapper {
  margin-bottom: 20px;
}
.stage-info-wrapper {
  margin: 0 10px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
  position: relative;

  .arrow-icon {
    $base-width: 12px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    position: absolute;
    right: 10px;
    top: calc(50% - 12px);
    cursor: pointer;

    &::before {
      content: '' !important;
      width: 24px;
      height: 24px;
      display: inline-block;
      background: url('~@/assets/svg/jiantou.svg') center no-repeat;
      background-size: 100%;
    }

    &.el-icon-arrow-up {
      transform: rotate(180deg);
    }
  }
}

.stage-content-wrapper {
  margin-left: 10px;
  -moz-user-select: none;
  user-select: none;
}

.stage-label {
  padding: 2px 6px;
  margin-right: 3px;
  margin-left: -4px;
  font-size: 11px;
  color: #fff;
  border-radius: 4px;
  background-color: #ff4800;
  display: inline-block;
  vertical-align: middle;
}

.stage-title {
  font-size: 16px;
  display: flex;
}

.stage-time {
  opacity: 0.4;
  font-size: 12px;
  color: #000000;
  text-align: justify;
  line-height: 16px;
  padding: 5px 0;
  padding-top: 10px;
}

.series-title {
  font-size: 14px;
  line-height: 24px;
  padding: 10px 0;
  border-bottom: 1px solid $line-color;
  cursor: pointer;
}

.series-content-wrapper {
  padding-left: 10px;
  position: relative;

  .content-wrapper {
    padding: 10px !important;
    padding-right: 30px !important;
    min-height: 40px;
    font-size: 14px;
    // line-height: 40px;
    border-bottom: 1px solid $line-color;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;

    .arrow-icon {
      width: 16px;
      height: 16px;
      line-height: 16px;
      position: absolute;
      right: 10px;
      top: calc(50% - 8px);
      cursor: pointer;
      transform: rotate(-90deg);

      &::before {
        content: '' !important;
        width: 16px;
        height: 16px;
        display: inline-block;
        background: url('~@/assets/svg/jiantou.svg') center no-repeat;
        background-size: 100%;
      }
    }
  }

  .content-label {
    min-width: 30px;
    height: 24px;
    line-height: 24px;
    margin-right: 10px;
    border: 1px solid #b38954;
    border-radius: 4px;
    color: #b38954;
    font-size: 12px;
    display: inline-block;
    text-align: center;
  }
}

.type-wrapper {
  display: inline-block;
  opacity: 0.6;
  font-size: 12px;
  color: #000000;
  text-align: justify;
  line-height: 16px;
  margin-right: 15px;

  .type-count {
    width: 14px;
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    color: #fff;
    display: inline-block;
    opacity: 0.16;
    background: #000000;
    border-radius: 100%;
    text-align: center;
    margin-left: 5px;
  }
}
</style>
