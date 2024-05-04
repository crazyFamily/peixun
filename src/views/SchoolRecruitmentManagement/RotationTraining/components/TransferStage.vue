<template>
  <div class="transferStage">
    <el-tabs v-model="currentName" @tab-click="changeTabs">
      <el-tab-pane v-for="(item, index) in tabPanneList" :key="index" :label="item.label" :name="item.value"> </el-tab-pane>
    </el-tabs>
    <component
      :is="currentRoute"
      :row-data="{
        ...rowData,
        processType,
        evaluationPageType,
        resultPageType
      }"
    ></component>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TrainingProtocol from './TrainingProtocol.vue'
import MentorEvaluation from './MentorEvaluation.vue'
import EvaluateResults from './EvaluateResults.vue'
import { FL_SUPER_ADMIN_OR_NEW_USER, ORG_NEW_USER_ADMIN_VALUE, TEACHER } from '../../enum'
const props = defineProps({
  rowData: {}
})
let defaultPanneList = [
  { label: '培养方案', value: 'trainingProtocol', component: TrainingProtocol },
  { label: '导师评价', value: 'teacherEvaluation', component: MentorEvaluation },
  { label: '培养结果', value: 'evaluateResults', component: EvaluateResults }
]

// 功能权限 当前用户身份：4非零超管或总行新人培养管理员、3机构新人培养管理员、2导师、1校招生、0其他
// 培养方案查询&文件上传 非零超管、总行新人培养管理员、机构新人培养管理员、导师、校招生
// 培训方案文件审核 非零超管、总行新人培养管理员、导师
// 当前登录人是导师时再判断isSave，展示保存按钮，可能第一阶段能保存，第二阶段不能保存
const processType = ref('view')
if (props.rowData.identity === FL_SUPER_ADMIN_OR_NEW_USER || props.rowData.identity === TEACHER) {
  processType.value = props.rowData.type
}
// 导师评价编辑 非零超管、总行新人培养管理员、导师
// 导师评价查询 非零超管、总行新人培养管理员、机构新人培养管理员、导师
const evaluationPageType = ref('')
if (props.rowData.identity === FL_SUPER_ADMIN_OR_NEW_USER || props.rowData.identity === TEACHER) {
  evaluationPageType.value = props.rowData.type
} else {
  evaluationPageType.value = 'view'
  if (props.rowData.identity !== ORG_NEW_USER_ADMIN_VALUE) {
    defaultPanneList = defaultPanneList.filter((v) => v.value !== 'teacherEvaluation')
  }
}
const resultPageType = ref('')
// 培养结果编辑 非零超管、总行新人培养管理员、机构新人培养管理员
// 培养结果查询 非零超管、总行新人培养管理员、机构新人培养管理员、导师
if (props.rowData.identity === FL_SUPER_ADMIN_OR_NEW_USER || props.rowData.identity === ORG_NEW_USER_ADMIN_VALUE) {
  resultPageType.value = props.rowData.type
} else {
  resultPageType.value = 'view'
  if (props.rowData.identity !== TEACHER) {
    defaultPanneList = defaultPanneList.filter((v) => v.value !== 'evaluateResults')
  }
}

const tabPanneList = ref(defaultPanneList)
const currentRoute = ref(TrainingProtocol)
const currentName = ref('trainingProtocol')
const changeTabs = (val) => {
  currentName.value = val.name
  currentRoute.value = tabPanneList.value[val.index].component
}
</script>
<script>
export default {
  name: 'TransferStage'
}
</script>
<style lang="scss" scoped>
.transferStage {
  flex: 1;
  background-color: #fff;
  :deep(.el-tabs__content) {
    overflow: inherit;
  }
}
</style>