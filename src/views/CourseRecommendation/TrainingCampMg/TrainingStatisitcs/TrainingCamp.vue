<template>
  <div class="training-camp-wrapper">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(row, index) in trainingStageDatas" :key="index" :name="String(row.id)" :label="`阶段-${row.stageName}`"></el-tab-pane>
    </el-tabs>
    <div class="control-wrapper">
      <el-button @click="exportHandle">数据导出</el-button>
    </div>
    <table-pagination
      :list="tableColumns"
      :tableList="trainingStageTableList"
      :queryForm="{}"
      :getList="() => {}"
      :hide-pagination="true"
      table-class="general__table training-table"
      ref="tablePagination"
    >
      <el-table-column label="内容项目" slot="content">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 'task'" :style="`padding-left: ${scope.row.level * 24}px`">{{ `作业-${scope.row.title}` }}</span>
          <span v-else-if="scope.row.type === 'exam'" :style="`padding-left: ${scope.row.level * 24}px`">{{
            `考试-${scope.row.title}-${scope.row.content}`
          }}</span>
          <span v-else :style="`padding-left: ${scope.row.level * 24}px`">{{
            scope.row.stageName || `${scope.row.title}-${scope.row.content}`
          }}</span>
        </template>
      </el-table-column>
    </table-pagination>
  </div>
</template>

<script setup>
import { useTrainingStatisHooks } from './hooks/useTrainingStatisHooks'
import { fetchQueryTrainingStatistical, fetchExportTrainingStageStatistic } from '@/fetch/courseRecommendation'
import { watch } from 'vue'

const props = defineProps({
  trainingId: {
    type: [String, Number],
    required: true
  }
})

const tableColumns = [
  {
    slot: 'content'
  },
  {
    label: '完成人数',
    prop: 'completedNum'
  },
  {
    label: '未完成人数',
    prop: 'notCompletedNum'
  }
]

const { trainingStageDatas, activeName, trainingStageTableList } = useTrainingStatisHooks(
  {
    total: 0,
    currPage: 1,
    pageSize: 10
  },
  props
)

const getList = async () => {
  if (!props.trainingId) return
  const { trainingStageList } = await fetchQueryTrainingStatistical({
    id: props.trainingId
  })

  if (!trainingStageList) return
  trainingStageDatas.value = trainingStageList
  activeName.value = String(trainingStageList[0].id)
}
getList()

watch(
  () => props.trainingId,
  () => {
    getList()
  }
)

const exportHandle = async () => {
  await fetchExportTrainingStageStatistic({ stageId: Number(activeName.value) })
}
</script>
<script>
export default {
  name: 'TrainingCamp'
}
</script>
<style lang='scss' scoped>
:deep(.training-table) {
  th:first-of-type .cell {
    justify-content: initial;
    padding: 0 10px;
  }

  td:first-of-type .cell {
    justify-content: initial;
    padding: 0 10px;
  }
}
.control-wrapper {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>