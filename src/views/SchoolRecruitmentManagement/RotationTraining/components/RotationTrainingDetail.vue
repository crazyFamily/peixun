<template>
  <div class="schoolRecruitmentManagement__rotationTrainingDetail">
    <el-tabs v-model="currentName" @tab-click="changeTabs">
      <el-tab-pane v-for="item in tabPanneList" :key="item.value" :label="item.label" :name="item.value"> </el-tab-pane>
    </el-tabs>
    <component
      :is="currentRoute"
      :row-data="{
        userCode,
        type,
        grade,
        identity,
        transferStage: currentName
      }"
    ></component>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StudentFiles from './StudentFiles.vue'
import TransferStage from './TransferStage.vue'
import { fetchTransferTabsList } from '@/fetch/schoolRecruitmentManagement'
import store from '@/store'
const tabPanneList = ref([
  {
    label: '校招生档案',
    value: 'StudentFiles',
    component: StudentFiles
  }
])

const currentRoute = ref(StudentFiles)
const currentName = ref('StudentFiles')
const props = defineProps({
  userCode: {
    type: String
  },
  grade: {
    type: String
  },
  type: {
    type: String,
    required: true,
    defalut: 'view'
  },
  identity: {
    type: Number
  }
})
const rowData = ref({})
const changeTabs = (val) => {
  currentName.value = val.name
  currentRoute.value = tabPanneList.value[val.index].component
}
const getTransferStageList = async () => {
  const defaultTabPanne = {
    label: '校招生档案',
    value: 'StudentFiles',
    component: StudentFiles
  }
  const res = await fetchTransferTabsList({
    data: { userCode: props.userCode, grade: props.grade }
  })
  const transferStageList =
    res?.map((v) => ({
      label: v.transferStage,
      value: v.transferStage,
      component: TransferStage
    })) || []
  tabPanneList.value = [defaultTabPanne, ...transferStageList]
}
getTransferStageList()
</script>
<script>
export default {
  name: 'RotationTrainingDetail'
}
</script>
<style lang="scss" scoped>
.schoolRecruitmentManagement__rotationTrainingDetail {
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-tabs__header) {
    background-color: #fff;
    margin-bottom: 10px;
    padding-right: 20px;
  }
}
</style>