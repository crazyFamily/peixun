<template>
  <div>
    <div class="menu-right" v-if="!readly">
      <div>
        <span class="instructor-icons__add" @click="addTrainingCourse('01002')">
          <i class="instructor-icons__add__icon"></i>
          新增</span
        >
      </div>
      <div>
        <span class="instructor-icons__del" @click="handleDel()">
          <i class="instructor-icons__del__icon"></i>
          删除</span
        >
      </div>
      <div>
        <span class="instructor-icons__download" @click="handleExport()">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
    </div>
    <!-- :showSummary="true"
      :summaryMethod="summaryMistakeTrainingCoursePlan" -->
    <table-pagination
      :list="mistakeTrainingCoursePlanList"
      :tableList="mistakeTrainingCoursePlanTableList"
      :page-sizes="[5, 10]"
      :queryForm="mistakeTrainingCoursePlanForm"
      :getList="getMistakeTrainingCoursePlanList"
      @selection-change="handleSelection"
      auto-height
      ref="mistakeTrainingCourseTable"
    >
      <!-- :showSummary="true"
      :summaryMethod="summaryCoursePlan" -->
      <el-table-column label="操作" min-width="124" fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            placement="left"
            :visible-arrow="false"
            popper-class="bgf shadow-1"
          >
            <div slot="content" class="tooltip__operation">
              <span class="active" @click="handleCheckPlan(scope.row)">查看</span>
              <span class="active" @click="handleEdit(scope.row)">修改</span>
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
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
import { useAnnual } from '../hooks/useAnnual'
import { fetchFindPlanInfoDetail, fetchListPlanInfos, fetchReportPlanPackageNonClasses } from '@/fetch/planManagement'
import store from '@/store'
import { CLASS_TYPES_MAP, TRAINING_COURSE_TYPE, NOT_TRAINING_COURSE_TYPE } from '../enum'
import CheckPlan from './CheckPlan.vue'
import { LINE_LS, YES_STATUS } from '@/util/constants'
import { useTable } from '@/hooks/useTable'
import { fetchListPlanDict } from '@/fetch/public'
const {
  getAnnualInfo,
  getAnnualPackageInfo,
  isForbidEdit,
  checkForbidStatus,
  checkPackageFetched,
  handleSelection,
  deleteDatas,
  summaryMethod
} = useAnnual()
const readly = ref(false)
const addTrainingCourse = () => {
  if (!checkPackageFetched()) return
  if (!checkForbidStatus()) return
  store.dispatch('planManagement/changeAnnualEditComp', { status: 'edit', classType: NOT_TRAINING_COURSE_TYPE })
}
const baseParams = {
  total: 0,
  currPage: 1,
  pageSize: 5,
  classify: 0,
  packageId: ''
}
// 培训类型过滤器选项
const trainTypeDescOptions = ref([])
fetchListPlanDict({ line: LINE_LS, type: NOT_TRAINING_COURSE_TYPE }).then((data) => {
  trainTypeDescOptions.value = data.trainTypes.map((row) => ({
    value: row.dataEncode,
    label: row.dataValue
  }))
})
const { tableFilterSetting } = useTable({ baseParams })
const mistakeTrainingCoursePlanList = [
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
    label: '总期数',
    width: '100',
    prop: 'termNum'
  },
  // {
  //   label: '总人数',
  //   width: '100',
  //   prop: 'studentTotal',
  //   formatter: (row) => row.termNum * row.studentNum
  // },
  // {
  //   label: '总费用（元）',
  //   width: '162',
  //   prop: 'totalFee'
  // },
  {
    label: '创建人',
    width: '126',
    prop: 'createdByName'
  },
  {
    label: '创建人所属部门',
    width: '234',
    prop: 'blgDeptName'
  }
]
const mistakeTrainingCoursePlanForm = reactive(CopyObj(baseParams))
const mistakeTrainingCoursePlanTableList = ref([])
watch(
  () => store.getters['planManagement/getNnnualNonclasses'],
  (n) => {
    mistakeTrainingCoursePlanTableList.value = n
    mistakeTrainingCoursePlanForm.total = getAnnualInfo()?.nonclassesTotal
    mistakeTrainingCoursePlanForm.packageId = getAnnualPackageInfo()?.planPackageId
    mistakeTrainingCoursePlanForm.currPage = 1
  }
)

// 请求入参格式化
const formatParams = (params) => {
  const data = CopyObj(params)
  data.page = data.currPage
  data.size = data.pageSize
 return data
}

// 获取非培训班数据
const getMistakeTrainingCoursePlanList = async () => {
  const data = formatParams(mistakeTrainingCoursePlanForm)
  const { total, list } = await fetchListPlanInfos(data)
  mistakeTrainingCoursePlanTableList.value = list
  mistakeTrainingCoursePlanForm.total = total
  store.dispatch('planManagement/getTotalCountDatas')
}

// 删除
const handleDel = () => {
  if (!checkPackageFetched()) return
  if (!checkForbidStatus()) return
  deleteDatas(getMistakeTrainingCoursePlanList)
}

// 导出
const handleExport = () => {
  if (!checkPackageFetched()) return
  const packageInfo = getAnnualPackageInfo()
  const data = {
    year: packageInfo?.planYear,
    line: packageInfo?.blgStripLine,
    dept: packageInfo?.blgDept
  }
  fetchReportPlanPackageNonClasses(data)
}

// 培训班计划总计
const summaryCoursePlan = (param) => {
  return summaryMethod(param, 'mistakeTrainingCoursePlan', NOT_TRAINING_COURSE_TYPE)
}

const checkTrainingPlanVisible = ref(false)
const checkPlanProps = ref({
  data: {},
  classType: '',
  blgDeptName: '',
  blgStripLine: ''
})
const handleCheckPlan = async (row) => {
  const { annualPlanId } = row
  const params = {
    planId: annualPlanId,
    dept: getAnnualPackageInfo()?.blgDept,
    line: getAnnualPackageInfo()?.blgStripLine
  }
  const res = await fetchFindPlanInfoDetail(params)
  checkPlanProps.value = {
    data: res,
    classType: NOT_TRAINING_COURSE_TYPE,
    blgDeptName: getAnnualPackageInfo()?.blgDeptName,
    blgStripLine: getAnnualPackageInfo()?.blgStripLine
  }
  checkTrainingPlanVisible.value = true
}

const handleEdit = (row) => {
  if (!checkForbidStatus()) return
  store.dispatch('planManagement/changeAnnualEditComp', {
    status: 'edit',
    classType: NOT_TRAINING_COURSE_TYPE,
    planStatus: 'edit',
    annualPlanId: row.annualPlanId
  })
}
</script>
<script>
export default {
  name: 'MistakeTrainingCoursePlan'
}
</script>

<style lang='scss' scoped>
</style>
