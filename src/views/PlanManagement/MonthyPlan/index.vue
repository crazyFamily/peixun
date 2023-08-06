<template>
  <div class="SubBranchManager">
    <el-tabs v-model="activeName" class="ladderInstructorTab">
      <el-tab-pane label="机构计划统计" name="OrgPlan">
        <OrgPlan @reloadOptions="reloadOptions" ref="orgPlanRef" @pageChange="pageChange"></OrgPlan>
      </el-tab-pane>
      <el-tab-pane :label="formTypeLabel" name="PlanDetailRecord">
        <PlanDetailRecord 
          v-show="activeName === 'PlanDetailRecord' && activeNameSub === 'list'"  
          :activeName="activeName"
          :planMonth="planMonth"
          :orgIds="orgIds"
          @reloadPlanList="reloadPlanList"
          @pageChange="pageChange"
          ref="planDetailRecordRef">
        </PlanDetailRecord>

        <PlanDetailForm 
          v-show="activeName === 'PlanDetailRecord' && activeNameSub === 'form'"  
          :pageData="pageData"
          @pageChange="pageChange"
          ref="planDetailFormRef">
        </PlanDetailForm>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'MonthlyPlan'
}
</script>
<script setup>
import { ref, computed, onMounted, onActivated } from 'vue'
import OrgPlan from './OrgPlan'
import PlanDetailRecord from './PlanDetailRecord'
import PlanDetailForm from './PlanDetailForm'
import { useRouter, useRoute } from '@/router'

const activeName = ref('')
const activeNameSub = ref('list')
const activeNameSubFormType = ref('')
const reloadSubList = ref(false)

const formTypeMeta = {
  'view': '查看',
  'add': '添加',
  'edit': '编辑',
}
const formTypeLabel = computed(() => {
  if (activeNameSubFormType.value) {
    return `计划明细录入-${formTypeMeta[activeNameSubFormType.value] || ''}`
  } else {
    return '计划明细录入'
  }
})
const planMonth = ref('')
const orgIds = ref('')

const pageData = ref({})
const orgPlanRef = ref(null)
const planDetailRecordRef = ref(null)
const planDetailFormRef = ref(null)
function pageChange (data) {
  const { tabName, pageName, reload, formType = '', row } = data
  if (tabName === 'PlanDetailRecord') {
    activeName.value = tabName
    planMonth.value = row.planMonth
    orgIds.value = row.orgIds
  } else {
    activeNameSub.value = pageName
    activeNameSubFormType.value = formType
    if (pageName === 'form') {
      pageData.value = { formType, row }
    } else {
      reload && planDetailRecordRef.value._queryDataList()
    }
  }
}
// 重新加载选项
function reloadOptions (data) {
  if (data.reload) {
    planDetailRecordRef.value?.loadOptions()
    planDetailFormRef.value?.loadOptions()
  }
}
function reloadPlanList (data) {
  if (data.reload) {
    orgPlanRef.value?._queryDataList()
  }
}

onMounted(() => {
  const route = useRoute()
  const routeQuery = route.query
  if (routeQuery.planMonth) planMonth.value = routeQuery.planMonth
  if (routeQuery.orgIds) orgIds.value = routeQuery.orgIds
  if (routeQuery.tabName) {
    activeName.value = routeQuery.tabName 
  } else {
    activeName.value = 'OrgPlan'
  }
})

</script>
<style lang="scss" scoped>

:deep(.ladderInstructorTab>.el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>
