<template>
  <div v-loading="getLoadingStatus('LOADING_FIND_PACKAGEINFO') || getLoadingStatus('LOADING_PLAN_SUBMIT')">
    <AnnualPlanInfo v-show="currentComputent === 'AnnualPlanInfo'" ref="annualPlanInfoRef"></AnnualPlanInfo>
    <template v-if="currentComputent === 'AddChangePlan'">
      <AddChangePlan v-bind="{ ...editCompProps }" @submit="submitEditPlan" ref="componentRef"></AddChangePlan>
    </template>

    <div class="button-wrapper" v-show="status === 'info'">
      <el-button :disabled="!btnStatus" class="button-w80-h30" type="primary" @click="submitPlan">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import AnnualPlanInfo from './components/AnnualPlanInfo.vue'
import AddChangePlan from './components/AddChangePlan.vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import store from '@/store'
import { CopyObj } from '@/plugins/until'
import { useAnnual } from './hooks/useAnnual'
import { fetchAddPlan, fetchSubmitPlanPackage, fetchUpdatePlan } from '@/fetch/planManagement'
import { Message } from 'element-ui'
import { CLASS_TYPES_MAP } from './enum'
import { getLoadingStatus } from '@/util/utils'
const { mergeReactive } = useBaseDataEvents()
const { getAnnualPackageInfo, checkPackageFetched, checkForbidStatus } = useAnnual()
/**
 * interface editCompProps {
 *   dept: string 机构代码
 *   pageState: 'info|edit' 页面状态
 *   data: Object 编辑状态拉取回来计划明细数据
 *   classType: string 项目类型
 *   selectOptions: Array 下拉选择项
 *   blgDeptName: string 机构名称
 *   blgStripLine: string 条线
 * }
 */

const editCompProps = ref({})
const status = ref('info')
const packageInfo = reactive({})

store.commit('planManagement/resetAnnualDatas')
watch(
  () => store.getters['planManagement/getAnnualStatus'],
  (n) => {
    if (n === 'edit') {
      editCompProps.value = CopyObj(store.getters['planManagement/getCurrentEditCompProps'])
    }
    status.value = n
  }
)

const currentComputent = computed(() => {
  if (status.value === 'edit') return 'AddChangePlan'
  if (status.value === 'info') return 'AnnualPlanInfo'
})

const btnStatus = ref(true)

// 校验审批链数据合法性
const validateApproval = () => {
  const approvalData = store.getters['planManagement/getAnnaulApprovalData']
  if(!approvalData.chain.auditUsers) {
    Message.warning('请先检查审批人')
    return false
  }
  if(approvalData.chain.auditUsers.split(';').some(v => v === '')) {
    Message.warning('请先检查审批人')
    return false
  }
  if(!approvalData.remark) {
    Message.warning('请填写备注')
    return false
  }
  return true
}

// 提交整个计划
const submitPlan = async () => {
  if(!checkPackageFetched()) return
  if(!checkForbidStatus()) return
  if(!validateApproval()) return
  const packageId = getAnnualPackageInfo()?.planPackageId || ''
  // 审批链
  const approvalData = store.getters['planManagement/getAnnaulApprovalData']
  const { auditUsers: user, auditUsersUm: userUm, auditUsersName: userName } = approvalData.chain
  const remark = approvalData.remark
  // 附件信息
  const files = store.getters['planManagement/getAccessoryFiles']
  const data = { user, userUm, userName, packageId, remark, files }
  await fetchSubmitPlanPackage({ data })
  Message.success('提交成功')
  annualPlanInfoRef.value.query()
  console.log(store.getters['planManagement/getAnnaulApprovalData']);
}


const annualPlanInfoRef = ref(null)
// 编辑组件提交逻辑
const submitEditPlan = async (data, state) => {
  const params = CopyObj(data)
  const plan = {
    planPackageId: getAnnualPackageInfo()?.planPackageId || '',
    planClassType: CLASS_TYPES_MAP[editCompProps.value.classType],
    packageYear: getAnnualPackageInfo().planYear || editCompProps.value.year,
    packageDept: getAnnualPackageInfo().blgDept || editCompProps.value.dept,
    packageLine: getAnnualPackageInfo().blgStripLine || editCompProps.value.blgStripLine
  }
  mergeReactive({origin: params.plan, target: plan})
  params.apportion.forEach((v) => (v.planYear = getAnnualPackageInfo().planYear))
  if(state === 'create') {
    await fetchAddPlan(params)
    Message.success('添加成功')
    store.dispatch('planManagement/changeAnnualEditComp', {status: 'info'})
  }

  if(state === 'edit') {
    await fetchUpdatePlan(params)
    Message.success('修改成功')
    store.dispatch('planManagement/changeAnnualEditComp', {status: 'info'})
  }
  annualPlanInfoRef.value.query()
}

const changeToInfoStatus = () => {
  store.dispatch('planManagement/changeAnnualEditComp', {status: 'info'})
}

// 保存
const componentRef = ref(null)
const handlePlanBtnClick = () => {
  componentRef.value?.addSubmit()
}

</script>

<script>
export default {
  name: 'AnnualPlan'
}
</script>
<style lang='scss' scoped>
.button-wrapper {
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>