<template>
  <div>
    <div class="menu-right" v-if="!readly">
      <div>
        <span class="instructor-icons__add" @click="addTrainingCourse()">
          <i class="instructor-icons__add__icon"></i>
          新增</span
        >
      </div>
      <div>
        <span class="instructor-icons__del" @click="handleDel('trainingCourseTable', 'getTrainingCoursePlanList')">
          <i class="instructor-icons__del__icon"></i>
          删除</span
        >
      </div>
      <div>
        <span class="instructor-icons__download" @click="handleExport">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
    </div>
    <table-pagination
      :list="trainingCoursePlanList"
      :tableList="trainingCoursePlanTableList"
      :page-sizes="[5, 10]"
      :queryForm="trainingCoursePlanForm"
      :getList="getTrainingCoursePlanList"
      @selection-change="handleSelection"
      auto-height
      ref="tablePagination"
    >
      <!-- :showSummary="true"
      :summaryMethod="summaryTrainingCoursePlan" -->
      <el-table-column label="操作" min-width="124" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            placement="left"
           :visible-arrow="false"
            popper-class="bgf shadow-1"
          >
            <div slot="content" class="tooltip__operation">
              <span class="active" @click="handlecheckPlan(scope.row)">查看</span>
              <span class="active" v-if="!readly" @click="handleEdit(scope.row)">修改</span>
              <span class="active" v-if="renderDispenseButton(scope.row)" @click="handleDispense(scope.row)">分配</span>
            </div>
            <el-button class="button-48-24">操作</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </table-pagination>
    <!-- 查看培训班计划 dialog  -->
    <gc-model
      width="1200px"
      title="查看培训班计划"
      class="check-training-plan"
      :isShowFooter="false"
      :visible="checkTrainingPlanVisible"
      @close="checkTrainingPlanVisible = false"
    >
      <CheckPlan v-bind="{ ...checkPlanProps }"></CheckPlan>
    </gc-model>

    <!-- 计划分配 -->
    <EditDispensePLan :show.sync="isDispenseEditorShow" :id="currentRowId" @close="saveDispensePLan"></EditDispensePLan>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
import { fetchDeletePlan, fetchListPlanInfos, fetchReportPlanPackageClasses, fetchFindPlanInfoDetail } from '@/fetch/planManagement'
import { useAnnual } from '@/views/PlanManagement/hooks/useAnnual'
import { Message } from 'element-ui'
import { customHint } from '@/util/utils'
import store from '@/store'
import { useTable } from '@/hooks/useTable'
import { fetchListPlanDict } from '@/fetch/public'
import { LINE_LS, YES_STATUS } from '@/util/constants'
import { CLASS_TYPES_MAP, EOA_DONE, LADDER_TRAIN_TYPE, TRAINING_COURSE_TYPE } from '../enum'
import CheckPlan from './CheckPlan.vue'
import EditDispensePLan from './EditDispensePLan.vue'
const {
  getAnnualInfo,
  getAnnualPackageInfo,
  isForbidEdit,
  checkForbidStatus,
  handleSelection,
  deleteDatas,
  checkPackageFetched,
  summaryMethod
} = useAnnual()

const readly = ref(false)

const baseParams = {
  total: 0,
  currPage: 1,
  pageSize: 5,
  classify: 1,
  packageId: '',
  // 培训类型筛选
  classTypeList: []
}
const { tableFilterSetting } = useTable({ baseParams })
const trainingCoursePlanForm = reactive(CopyObj(baseParams))

// 培训类型过滤器选项
const trainTypeDescOptions = ref([])
fetchListPlanDict({ line: LINE_LS, type: TRAINING_COURSE_TYPE }).then((data) => {
  trainTypeDescOptions.value = data.trainTypes.map((row) => ({
    value: row.dataEncode,
    label: row.dataValue
  }))
})
const addTrainingCourse = () => {
  if (!checkPackageFetched()) return
  if (!checkForbidStatus()) return
  store.dispatch('planManagement/changeAnnualEditComp', { status: 'edit', classType: TRAINING_COURSE_TYPE })
}

const LADDER_COURSE_TYPE = '02001'

const BASE_COLUMNS = [
  {
    type: 'selection',
    width: '54'
  },
  {
    label: '所属部门',
    width: '200',
    prop: 'planDeptName'
  },
  {
    label: '项目名称',
    width: '250',
    prop: 'className'
  },
  {
    label: '培训类型',
    width: '104',
    prop: 'trainTypeDesc',
    ...tableFilterSetting('classTypeList', trainTypeDescOptions)
  },
  {
    label: '是否消保培训',
    prop: 'ifConformance',
    width: '100',
    formatter: row => row.ifConformance === YES_STATUS ? '是' : '否'
  },
  {
    label: '业务模块',
    width: '104',
    prop: 'channelTypeDesc'
  },
  {
    label: '关键岗位',
    width: '104',
    prop: 'keyJobsDesc'
  },
  {
    label: '培训系列',
    width: '104',
    prop: 'trainSeriesDesc'
  },
  {
    label: '子系列',
    width: '104',
    prop: 'childSeriesDesc'
  },
  {
    label: '总期数',
    width: '92',
    prop: 'termNum'
  },
  {
    label: '已分配期数',
    width: '92',
    prop: 'dispenseNum'
  },
  {
    label: '创建人',
    width: '92',
    prop: 'createdByName'
  },
  {
    label: '创建人所属部门',
    width: '200',
    prop: 'blgDeptName'
  }
]

const trainingCoursePlanList = computed(() => {
  // 非零售条线，去掉 已分配期数 字段
  if(store.getters['planManagement/getCurrentTopSearchParams']?.busiType[0] !== LINE_LS) {
    return BASE_COLUMNS.filter(row => row.prop !== 'dispenseNum')
  }
  return BASE_COLUMNS
})

const trainingCoursePlanTableList = ref([])
watch(
  () => store.getters['planManagement/getAnnualClasses'],
  (n) => {
    trainingCoursePlanTableList.value = n
   trainingCoursePlanForm.total = getAnnualInfo()?.classesTotal
    trainingCoursePlanForm.packageId = getAnnualPackageInfo()?.planPackageId
    trainingCoursePlanForm.currPage = 1
  }
)

// 请求入参格式化
const formatParams = (params) => {
  const data = CopyObj(params)
  data.page = data.currPage
  data.size = data.pageSize
  return data
}

// 获取培训班数据
const getTrainingCoursePlanList = async () => {
  const data = formatParams(trainingCoursePlanForm)
  const { total, list } = await fetchListPlanInfos(data)
  list.forEach((v) => {
    v.studentTotal = v.termNum * v.studentNum
  })
  trainingCoursePlanTableList.value = list
  trainingCoursePlanForm.total = total
  store.dispatch('planManagement/getTotalCountDatas', trainingCoursePlanForm.classTypeList)
}

// 删除
const handleDel = () => {
  if (!checkPackageFetched()) return
  if (!checkForbidStatus()) return
  deleteDatas(getTrainingCoursePlanList)
}

// 导出
const handleExport = () => {
  if (!checkPackageFetched()) return
  const packageInfo = getAnnualPackageInfo()
  const data = {
    year: packageInfo?.planYear,
    line: packageInfo?.blgStripLine,
    dept: packageInfo?.blgDept,
    classTypeList: trainingCoursePlanForm.classTypeList || []
  }
  fetchReportPlanPackageClasses(data)
}

// 培训班计划总计
const summaryTrainingCoursePlan = (param) => {
  return summaryMethod(param, 'trainingCoursePlan', TRAINING_COURSE_TYPE)
}

const checkTrainingPlanVisible = ref(false)
const checkPlanProps = ref({
  data: {},
  classType: '',
  blgDeptName: '',
  blgStripLine: ''
})
const handlecheckPlan = async (row) => {
  const { annualPlanId } = row
  const params = {
    planId: annualPlanId,
    dept: getAnnualPackageInfo()?.blgDept,
    line: getAnnualPackageInfo()?.blgStripLine
 }
  const res = await fetchFindPlanInfoDetail(params)
  checkPlanProps.value = {
    data: res,
    classType: TRAINING_COURSE_TYPE,
    blgDeptName: getAnnualPackageInfo()?.blgDeptName,
    blgStripLine: getAnnualPackageInfo()?.blgStripLine
  }
  checkTrainingPlanVisible.value = true
}

// 编辑操作逻辑
const handleEdit = (row) => {
  if (!checkForbidStatus()) return
  store.dispatch('planManagement/changeAnnualEditComp', {
    status: 'edit',
    classType: TRAINING_COURSE_TYPE,
    planStatus: 'edit',
    annualPlanId: row.annualPlanId
  })
}


const isDispenseEditorShow = ref(false)
const currentRowId = ref('')

// 分配按钮显示逻辑
const renderDispenseButton = (row) => {
  // 只有零售有分配的需求
  if(store.getters['planManagement/getCurrentTopSearchParams']?.busiType[0] !== LINE_LS) return false
  if(row.trainType !== LADDER_TRAIN_TYPE) return false
  if(getAnnualPackageInfo()?.applyStatus !== EOA_DONE) return false
  if(readly.value) return false
  return true
}

// 操作分配
const handleDispense = (row) => {
  currentRowId.value = row.annualPlanId || ''
  isDispenseEditorShow.value = true
}

// 分配保存
const saveDispensePLan = () => {
  const data = CopyObj(store.getters['planManagement/getCurrentTopSearchParams'])
  ;[data.line, data.dept] = data.busiType
  Reflect.deleteProperty(data, 'busiType')
  store.dispatch('planManagement/getAnnualPlanInfo', data)
}
</script>
<script>
export default {
  name: 'TrainingCoursePlan'
}
</script>

<style lang='scss' scoped>
</style>
