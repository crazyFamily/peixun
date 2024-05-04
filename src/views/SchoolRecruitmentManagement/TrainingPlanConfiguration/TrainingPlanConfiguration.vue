<template>
  <div class="schoolRecruitmentManagement__trainingPlanConfiguration">
    <SchemeList v-show="currentComputent === 'SchemeList'" ref="schemeListRef"></SchemeList>
    <template v-if="currentComputent === 'Configuration'">
      <Configuration v-bind="{ ...editCompProps }" @submit="submitConfiguration" ref="configurationRef"></Configuration>
    </template>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import SchemeList from './components/SchemeList.vue'
import Configuration from './components/Configuration.vue'
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
  () => store.getters['schoolRecruitmentManagement/getTrainingPlanStatus'],
  (n) => {
    if (n === 'config') {
      editCompProps.value = CopyObj(store.getters['schoolRecruitmentManagement/getCurrentEditCompProps'])
    }
    status.value = n
  }
)
const currentComputent = computed(() => {
  if (status.value === 'list') {
    // 在详情页回到列表页需要回复初始状态
    store.dispatch('schoolRecruitmentManagement/changeTrainingPlanComp', { status: 'list' })
    return 'SchemeList'
  }
  if (status.value === 'config') return 'Configuration'
})
const schemeListRef = ref(null)
const submitConfiguration = () => {
  schemeListRef.value.queryData()
}
</script>

<script>
export default {
  name: 'TrainingPlanConfiguration'
}
</script>
<style lang="scss" scoped>
.schoolRecruitmentManagement__trainingPlanConfiguration {
  height: 100%;
}
</style>