
import {
  fetchSelectZhFixedOrg,
  fetchSelectPlanMonthAndAuthority,
} from '@/fetch/planManagement'
import { MONTHLY_ON_LINE } from '../enum'
import { ref, computed } from 'vue'
export function useMonthlyPlan ({ queryForm }) {
  const isAdmin = ref(false)
  const isOrgAdmin = ref(false)
  const planMonthOptions = ref([])

  const dropdownOrgValue = ref(null)
  const orgOptions = ref([])
  function orgIdChange(keys, nodes) {
    dropdownOrgValue.value = nodes
    queryForm.orgIds = keys
  }
  // 加载计划年月
  async function getPlanMonthOptions (isSetDefault, value, unRelease) {
    const res = await fetchSelectPlanMonthAndAuthority()
    let monthList = res.monthList?.map(m => {
      m.value = m.planMonth
      m.label = m.planMonthName
      return m
    }) || [] 
    if (unRelease) {
      monthList = monthList.filter(m => m.status !== MONTHLY_ON_LINE)
    }
    planMonthOptions.value = monthList
    isAdmin.value = res.isAdmin === 'Y'
    isOrgAdmin.value = res.isOrgAdmin === 'Y'
    if (isSetDefault) {
      setDefaultMonthOption(value)
    }
  }
  // 加载固定机构节点
  async function getOrgOptions (isIgnorePermission) {
    const resOrgList = await fetchSelectZhFixedOrg({
      authFlag: isIgnorePermission ? 'N' : 'Y'
    })
    orgOptions.value = resOrgList.map(m => {
      m.value = m.orgId
      m.label = m.orgName
      return m
    }) || []
    return orgOptions.value
  }
  
  // 设置查询条件“计划期数”默认值
const setDefaultMonthOption = (value) => {
  if (!queryForm) return
  const now = new Date()
  const currentMonth = value || `${now.getFullYear()}${((now.getMonth()+1)+'').padStart(2,'0')}`
  if (planMonthOptions.value?.some(m => m.value === currentMonth)) {
    queryForm.planMonth = currentMonth
  } else {
    queryForm.planMonth = planMonthOptions.value[0]?.value || ''
  }
  console.log('setDefaultMonthOption', queryForm.planMonth)
}

return {
  isAdmin,
  isOrgAdmin,
  dropdownOrgValue,
  planMonthOptions,
  orgOptions,
  orgIdChange,
  getOrgOptions,
  getPlanMonthOptions,
  setDefaultMonthOption
}
}