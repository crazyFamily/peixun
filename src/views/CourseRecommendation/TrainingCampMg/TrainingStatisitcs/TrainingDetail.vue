<template>
  <div class="detail-wrapper">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(row, index) in trainingStageDatas" :key="index" :name="String(row.id)" :label="`阶段-${row.stageName}`"></el-tab-pane>
    </el-tabs>

    <table-pagination
      :list="tableColumns"
      :tableList="trainingStageTableList"
      :queryForm="{}"
      :getList="() => {}"
      :hide-pagination="true"
      v-loading="isGettingDatas"
      table-class="general__table training-table"
      ref="tablePagination"
    >
      <el-table-column label="内容项目" slot="content" min-width="200">
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
      <el-table-column label="手工干预" min-width="90">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.isCompelFinish" @change="compeFinishChangeHandle(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
    </table-pagination>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="save">手工干预</el-button>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { fetchQueryTrainingUmDetail, fetchUpdateUmCompeteStatus } from '@/fetch/courseRecommendation'
import { useTrainingStatisHooks } from './hooks/useTrainingStatisHooks'
import { TRAINING_STAGE_SERIES_STATUS } from '@/util/constants'
import { customHint } from '@/util/utils'
import { Message } from 'element-ui'

const props = defineProps({
  trainingId: {
    type: [String, Number],
    required: true
  },
  umId: {
    type: [String, Number],
    required: true
  }
})

const tableColumns = [
  {
    slot: 'content'
  },
  {
    label: '完成时间',
    prop: 'finishDate'
  },
  {
    label: '时长',
    prop: 'totalDuration'
  },
  {
    label: '完成状态',
    prop: 'status',
    formatter: (row) => TRAINING_STAGE_SERIES_STATUS[row.status]
  }
]

const { trainingStageDatas, activeName, trainingStageTableList, getTableDatas } = useTrainingStatisHooks({}, props)

const emit = defineEmits(['change'])
const closeHandle = () => {
  emit('change', 'report')
}

// 设置默认勾选状态
const setDefaultStatus = (datas, parentId = null) => {
  datas.forEach((row) => {
    row.isCompelFinish = false
    parentId && (row.parentId = parentId)
    if (row.stageSeriesList && row.stageSeriesList.length) {
      setDefaultStatus(row.stageSeriesList, row.id)
    }
  })
}

const isGettingDatas = ref(false)
const getList = async () => {
  if (!props.trainingId) return
  isGettingDatas.value = true
  fetchQueryTrainingUmDetail({
    id: props.trainingId,
    umId: props.umId
  })
    .then(({ trainingStageList }) => {
      setDefaultStatus(trainingStageList)
      trainingStageDatas.value = trainingStageList
      activeName.value = String(trainingStageList[0].id)
    })
    .finally(() => {
      isGettingDatas.value = false
    })
}
getList()

watch(
  () => props.umId,
  () => {
    getList()
  }
)

const isSaving = ref(false)
const save = async () => {
  if (isSaving.value) return
  const selectedDatas = getTableDatas()
    .flat(1)
    .filter((item) => {
      return item.isCompelFinish === true
    })
  if (!selectedDatas.length) return Message.warning('请先选择需要手工干预的内容')
  await customHint('确认需要手动干预所选项吗？', '提示', '取消')
  const data = selectedDatas.map(({ id, type }) => ({ id, type }))
  console.log(data, '--->data')
  isSaving.value = true
  fetchUpdateUmCompeteStatus({
    trainingId: props.trainingId,
    umId: props.umId,
    data
  })
    .then(() => {
      Message.success('请求成功')
      getList()
    })
    .finally(() => {
      isSaving.value = false
    })
}

// 勾选手工干预逻辑，需要处理树级下的各子级状态
const compeFinishChangeHandle = (row) => {
  // 当所选为父节点的时候，子节点应该被全选
  trainingStageTableList.value.forEach((tableRow) => {
    if (tableRow.parentId === row.id) {
      tableRow.isCompelFinish = row.isCompelFinish
    }
  })
  // 当所选为子节点，判断是否所有子节点都被选择，是则父节点要被勾选，否则父节点不被勾选
  const parentRow = trainingStageTableList.value.find((tableRow) => tableRow.id === row.parentId)
  if (!parentRow) return
  const allSelectedStatus = trainingStageTableList.value
    .filter((tableRow) => tableRow.parentId === row.parentId)
    .every((tableRow) => tableRow.isCompelFinish === true)
  parentRow.isCompelFinish = allSelectedStatus
}
</script>
<script>
export default {
  name: 'TrainingDetail'
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
</style>