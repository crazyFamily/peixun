<template>
  <div class="mixins-training-wrapper">
    <!-- 这个是在没有数据的时候才会出现 -->
    <template v-if="isShow">
      <div class="nav-wrapper">
        <div class="nav-item" @click="currentComponent = MixinsZNCourse">
          <img src="@/assets/images/mixinsTraining/course.svg" alt="" class="nav-icon" />
          <p class="label">知鸟课程</p>
        </div>
        <div class="nav-item" @click="currentComponent = MixinsZNLive">
          <img src="@/assets/images/mixinsTraining/live.svg" alt="" class="nav-icon" />
          <p class="label">知鸟直播</p>
        </div>
        <div class="nav-item" @click="currentComponent = MixinsZNExam">
          <img src="@/assets/images/mixinsTraining/exam.svg" alt="" class="nav-icon" />
          <p class="label">知鸟考试</p>
        </div>
        <div class="nav-item" @click="currentComponent = MixinsCase">
          <img src="@/assets/images/mixinsTraining/case.svg" alt="" class="nav-icon" />
          <p class="label">案例</p>
        </div>
        <!-- <div class="nav-item">
          <img src="" alt="" class="nav-icon" />
          <p class="label">作业</p>
        </div>
        <div class="nav-item">
          <img src="" alt="" class="nav-icon" />
          <p class="label">讨论</p>
        </div> -->
      </div>
      <div class="no_data">
        <img class="no-data-img" src="@/assets/images/no-data.png" alt="" />
        <p>暂未添加培训内容，请选择以上模块添加内容</p>
      </div>
    </template>
    <template v-else>
      <div class="main-wrapper">
        <div class="menu-wrapper">
          <p class="menu-item" :class="{active: currentComponent === MixinsZNCourse}" @click="currentComponent = MixinsZNCourse">知鸟课程 ({{ store.getters['establish/getMixinsTrainingCount']?.courseNum }})</p>
          <p class="menu-item" :class="{active: currentComponent === MixinsZNLive}" @click="currentComponent = MixinsZNLive">知鸟直播 ({{ store.getters['establish/getMixinsTrainingCount']?.liveNum }})</p>
          <p class="menu-item" :class="{active: currentComponent === MixinsZNExam}" @click="currentComponent = MixinsZNExam">知鸟考试 ({{ store.getters['establish/getMixinsTrainingCount']?.testNum }})</p>
          <p class="menu-item" :class="{active: currentComponent === MixinsCase}" @click="currentComponent = MixinsCase">案例 ({{ store.getters['establish/getMixinsTrainingCount']?.caseNum }})</p>
          <!-- <p class="menu-item">作业 (0)</p>
          <p class="menu-item">交流圈</p> -->
        </div>
        <div class="content-container">
          <components :is="currentComponent" :class-id="commcClassId"></components>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useTable } from '@/hooks/useTable'
import MixinsZNCourse from './components/MixinsZNCourse.vue'
import MixinsZNExam from './components/MixinsZNExam.vue'
import MixinsZNLive from './components/MixinsZNLive.vue'
import MixinsCase from './components/MixinsCase.vue'
import store from '@/store'
import { fetchSelectMixedTrainingNum } from '@/fetch/establish'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'

const props = defineProps({
  commcClassId: {
    type: String,
    required: true
  }
})

const isShow = computed(() => {
  return Number(store.getters['establish/getMixinsTrainingCount'].courseNum) === 0 &&
  Number(store.getters['establish/getMixinsTrainingCount'].liveNum) === 0 &&
  Number(store.getters['establish/getMixinsTrainingCount'].testNum) === 0 &&
  Number(store.getters['establish/getMixinsTrainingCount'].caseNum) === 0 && !currentComponent.value
})

const currentComponent = ref('')

onMounted(async () => {
  await store.dispatch('establish/getMixinsCountAsync', props.commcClassId)
  console.log(store.getters['establish/getMixinsTrainingCount'].courseNum)
  const list = [
    Number(store.getters['establish/getMixinsTrainingCount'].courseNum),
    Number(store.getters['establish/getMixinsTrainingCount'].liveNum),
    Number(store.getters['establish/getMixinsTrainingCount'].testNum),
    Number(store.getters['establish/getMixinsTrainingCount'].caseNum),
  ]
  if( list.some(row => row !== 0) ) currentComponent.value = MixinsZNCourse
})
</script>
<script>
export default {
  name: "MixinsTraining"
}
</script>
