<template>
  <div class="schoolRecruitmentManagement__rotationTraining">
    <RotationTrainingList v-show="currentComputent === 'RotationTrainingList'" ref="rotationTrainingListRef"></RotationTrainingList>
    <template v-if="currentComputent === 'RotationTrainingDetail'">
      <RotationTrainingDetail v-bind="{ ...editCompProps }" @submit="submitDetail" ref="detailRef"></RotationTrainingDetail>
    </template>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import RotationTrainingList from './components/RotationTrainingList.vue'
import RotationTrainingDetail from './components/RotationTrainingDetail.vue'
import store from '@/store'
import { CopyObj } from '@/util/utils'
const status = ref('list')
/**
 * interface editCompProps {
 *   id: string 当前需要编辑的id
 * }
 */
const editCompProps = ref({})
watch(
  () => store.getters['schoolRecruitmentManagement/getRotationStatus'],
  (n) => {
    if (n === 'detail') {
      editCompProps.value = CopyObj(store.getters['schoolRecruitmentManagement/getRotationCompProps'])
    }
    status.value = n
  }
)
const currentComputent = computed(() => {
  if (status.value === 'list') {
    // 在详情页回到列表页需要回复初始状态
    store.dispatch('schoolRecruitmentManagement/changeRotationComp', { status: 'list' })
    return 'RotationTrainingList'
  }
  if (status.value === 'detail') return 'RotationTrainingDetail'
})
const rotationTrainingListRef = ref(null)
const submitDetail = () => {
  rotationTrainingListRef.value.queryData()
}
</script>

<script>
export default {
  name: 'RotationTraining'
}
</script>
<style lang="scss" scoped>
.schoolRecruitmentManagement__rotationTraining {
  height: 100%;
}
</style>