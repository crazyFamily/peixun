<template>
  <el-card class="search-card mt10">
    <el-form :model="queryForm" inline ref="querFormRef">
      <el-form-item label="年度" prop="annual" v-if="params.includes('annual')">
        <gc-select :options="annualList" v-model="queryForm.annual"> </gc-select>
      </el-form-item>
      <el-form-item label="项目类型" prop="projectType" v-if="params.includes('projectType')">
        <gc-select :options="projectTypeList" v-model="queryForm.projectType" :clearable="false" @change="projectTypeChangeHandle"> </gc-select>
      </el-form-item>
      <el-form-item label="单位类型" prop="projectBlgType" v-if="params.includes('projectBlgType')">
        <gc-select :options="UNIT_TYPE_LIST" v-model="queryForm.projectBlgType" :clearable="false" @change="projectTypeChangeHandle"> </gc-select>
      </el-form-item>
      <el-form-item label="所属单位" v-if="params.includes('treeData')">
        <HeadquarterTree
          :tree-options="treeOptions"
          :normalizer="normalizer"
          class="tree-container"
          v-model="treeData"
          :disabled="isTreeDisabled"
        ></HeadquarterTree>
      </el-form-item>
      <el-form-item label="方案状态" prop="planStatus" v-if="params.includes('planStatus')">
        <gc-select :options="SCHEME_TYPE_LIST" :multiple="true" v-model="queryForm.planStatus" :clearable="false"> </gc-select>
      </el-form-item>
      <el-form-item label="主办单位" prop="deptIds" v-if="params.includes('deptIds')">
        <gc-institution v-model="queryForm.deptIds" ref="institutionRef" :left-show="false" busi-type="FL" :fetchParams="{ showBusiType: 'FL' }">
        </gc-institution>
      </el-form-item>
      <el-form-item label="项目信息" prop="projectInfo" v-if="params.includes('projectInfo')">
        <el-input v-model="queryForm.projectInfo" placeholder="请输入项目ID/项目名称"></el-input>
      </el-form-item>
      <el-form-item label="议题信息" prop="subjectInfo" v-if="params.includes('subjectInfo')">
        <el-input v-model="queryForm.subjectInfo" placeholder="请输入议题ID/议题名称"></el-input>
      </el-form-item>
      <el-form-item label="导师" prop="teacher" v-if="params.includes('teacher')">
        <el-input v-model="queryForm.teacher" placeholder="请输入导师姓名/UM"></el-input>
      </el-form-item>
      <el-form-item label="战队成员" prop="teamMember" v-if="params.includes('teamMember')">
        <el-input v-model="queryForm.teamMember" placeholder="请输入战队成员姓名/UM" style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="学员姓名/UM" prop="studentInfo" v-if="params.includes('studentInfo')">
        <el-input v-model="queryForm.studentInfo" placeholder="请输入学员姓名/UM" style="width: 160px"></el-input>
      </el-form-item>
      <el-form-item label="进展阶段" prop="stage" v-if="params.includes('stage')">
        <el-date-picker
          class="year-style month-style"
          :editable="false"
          size="mini"
          value-format="yyyyMM"
          placeholder="进展阶段"
          type="month"
          v-model="queryForm.stage"
          :clearable="false"
          align="center"
          style="width: 120px"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="反馈状态" prop="feedbackStatus" v-if="params.includes('feedbackStatus')">
        <gc-select v-model="queryForm.feedbackStatus" :options="FEEDBACK_OPTIONS" placeholder="请选择反馈状态" style="width: 160px"></gc-select>
      </el-form-item>
      <el-form-item label="方案提交状态" prop="status" v-if="params.includes('status')">
          <gc-select :options="PLAN_STATUS_OPTIONS" v-model="queryForm.status"> </gc-select>
        </el-form-item>
        <el-form-item label="学员录入状态" prop="isEnter" v-if="params.includes('isEnter')">
          <gc-select :options="ENTER_STATUS_OPTIONS" v-model="queryForm.isEnter"> </gc-select>
        </el-form-item>
      <div class="search-card__button">
        <el-button type="primary" @click="queryDatas">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { computed, onMounted, reactive, ref, unref, watch } from 'vue'
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import { useFormEvents } from '@/hooks/useFormEvents'
import { fetchQCSotreQryParam } from '@/fetch/tanlents'
import { formatTreeData } from '@/views/TalentsCultivation/utils'
import { useTalentTrees } from '@/views/TalentsCultivation/hooks'
import { TYPE_TOTAL, TYPE_HEADQUARTER, TYPE_LINE, TYPE_ORG, UNIT_TYPE_LIST,SCHEME_TYPE_LIST, FEEDBACK_OPTIONS, ENTER_STATUS_OPTIONS, PLAN_STATUS_OPTIONS } from '@/views/TalentsCultivation/enum'

const props = defineProps({
  params: {
    type: Array,
    default: () => []
  },
  immediate: {
    type: Boolean,
    default: true
  },
  defaultMaxAnnual: Boolean,
  searchParams: { 
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['search', 'reset', 'getSearchOptions'])
const { formData, resetFields } = useFormEvents({
  annual: '',
  projectBlgType: '',
  projectType: '',
  deptIds: [],
  projectInfo: '',
  subjectInfo: '',
  studentInfo: '',
  teacher: '',
  teamMember: '',
  evaluateStatus: [],
  stage: '',
  feedbackStatus: '',
  status: '',
  isEnter: '',
  pageSize: 10,
  total: 0,
  currPage: 1
})
const queryForm = formData
const queryDatas = () => {
  let resutTreeData
  if(props.params.includes('projectBlgType')) {
    resutTreeData = [TYPE_TOTAL, TYPE_HEADQUARTER].includes(queryForm.projectBlgType) ? null : unref(treeData)
  } else {
    resutTreeData = [TYPE_TOTAL, TYPE_HEADQUARTER].includes(queryForm.projectType) ? null : unref(treeData)
  }
  // 如果为null，直接为空数组
  resutTreeData = resutTreeData || []
  // const resutTreeData = [TYPE_TOTAL, TYPE_HEADQUARTER].includes(queryForm.projectType) ? null : unref(treeData)
  emit('search', queryForm, resutTreeData)
}

const reset = () => {
  resetFields()
  treeData.value = null
  queryForm.projectBlgType = projectTypeList?.[0]?.value
  queryForm.projectType = projectTypeList?.[0]?.value
  projectTypeEvents(projectTypeList?.[0]?.value)

  emit('reset', queryForm, unref(treeData))
}

const resetDatas = () => {
  reset()
}

defineExpose({ queryDatas, resetDatas })

const annualList = ref([])
const projectTypeList = ref([])
const roleList = ref([])
const orgList = ref([])
const lineList = ref([])
const stageList = ref([])
const treeOptions = ref([])
const normalizer = (node) => {
  return {
    id: node.qCCode,
    label: node.qCMsg,
    children: node.subLine
  }
}

const treeData = ref(null)
const updateId = ref(0)

/** 
 * 需求扩展，增加一单位类型，交互与项目类型完全一样。当前单位类型与项目类型是互斥关系，在判断里加入两个类型的区分
*/
const isTreeDisabled = computed(() => {
  if(queryForm.projectType && queryForm.projectType !== TYPE_TOTAL) {
    return treeData.value === 'headquarter'
  }

  if(queryForm.projectBlgType && queryForm.projectBlgType !== TYPE_TOTAL) {
    return treeData.value === 'headquarter'
  }
  return true
})

const { projectTypeEvents } = useTalentTrees({ treeData, treeOptions, lineList, orgList })
const projectTypeChangeHandle = (value) => {
  updateId.value ++
  projectTypeEvents(value)
  console.log(treeData, value, '===>>> treeData')
}
const schemeStatusChangeHandle = (value)=>{
  console.log(value, '===>>> treeData')
}
onMounted(async () => {
  const { annual, projectType, orgs, lines, role, stages } = await fetchQCSotreQryParam({
    data: {...props.searchParams}
  })
  annualList.value = annual.map((item) => ({
    label: `${item.qCCode}年`,
    value: item.qCCode
  }))

  // 数据格式化处理
  roleList.value = role.map((item) => ({
    label: item.qCMsg,
    value: item.qCCode
  }))
  projectTypeList.value = projectType.map((item) => ({
    label: item.qCMsg,
    value: item.qCCode
  }))
  stageList.value = (stages || []).map(item => ({
    label: item.qCMsg,
    value: item.qCCode
  }))
  orgList.value = formatTreeData(orgs)
  lineList.value = formatTreeData(lines)

  // 默认值取数据返回的第一条
  if(projectTypeList.value?.length) {
    queryForm.projectType = projectTypeList.value?.[0]?.value
    console.log(queryForm.projectType);
    projectTypeChangeHandle(queryForm.projectType)
  } else {
    queryForm.projectType = ''
  }
  
  if(props.defaultMaxAnnual) {
    queryForm.annual = annualList.value[annualList.value.length - 1]?.value
  }

  props.immediate && queryDatas()
})
</script>
<style lang='scss' scoped>
.search-card {
  overflow: unset;
}
</style>