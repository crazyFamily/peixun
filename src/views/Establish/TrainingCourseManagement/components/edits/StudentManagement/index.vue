<template>
  <div class="student-manager">
    <el-tabs v-model="activeName" class="listTab">
      <el-tab-pane label="学员名单" name="StudentList">
      </el-tab-pane>
      <el-tab-pane :label="formTypeLabel" name="TrainEvaluationList">
      </el-tab-pane>
    </el-tabs>
    <StudentList v-show="activeName === 'StudentList'" :classId="classId" :operationType="operationType"></StudentList> 
    <TrainEvaluationList 
      v-show="activeName === 'TrainEvaluationList' && evaluationType === 'list'"  
      :classId="classId" 
      :operationType="operationType" 
      @pageChange="pageChange"
      ref="trainEvaluationListRef">
    </TrainEvaluationList>
    <TrainEvaluationForm 
      v-show="activeName === 'TrainEvaluationList' && evaluationType === 'form'"  
      :pageData="pageData"
      :classId="classId" 
      :operationType="operationType" 
      @pageChange="pageChange">
    </TrainEvaluationForm>
  </div>
</template>
<script>
export default {
  name: 'StudentManager'
}
</script>
<script setup>
import { ref, computed } from 'vue'
import StudentList from './StudentList'
import TrainEvaluationList from './TrainEvaluationList'
import TrainEvaluationForm from './TrainEvaluationForm'

const props = defineProps({
  classId: String,
  operationType: {
    type: String,
    default: 'edit'
  }
})

const activeName = ref('StudentList')
const evaluationType = ref('list')
const evaluationFormType = ref('')
const reloadTrainEvaluationList = ref(false)
const formTypeMeta = {
  'view': '查看',
  'add': '新增',
  'edit': '编辑',
}
const formTypeLabel = computed(() => {
  if (evaluationFormType.value) {
    return `培养评价-${formTypeMeta[evaluationFormType.value] || ''}`
  } else {
    return '培养评价'
  }
})
const pageData = ref({})
const trainEvaluationListRef = ref(null)
function pageChange (data) {
  const { pageName, reload, formType = '', row } = data
  evaluationType.value = pageName
  evaluationFormType.value = formType
  if (pageName === 'form') {
    pageData.value = { formType, row }
  } else {
    reload && trainEvaluationListRef.value.queryDataList()
  }
}

</script>

<style lang="scss" scoped>
:deep(.listTab>.el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>
