import store from '@/store'
import { CopyObj, customHint } from '@/util/utils'
import { Message } from 'element-ui'
import { computed, reactive, ref, watch } from 'vue'
import { APPLY_EOA_DOING, APPLY_EOA_DONE, CLASS_TYPES_MAP, NOT_TRAINING_COURSE_TYPE, TRAINING_COURSE_TYPE } from '../enum'
import { fetchCalPlanTotalInfo, fetchDeletePlan } from '@/fetch/planManagement'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { set } from 'lodash'
const { mergeReactive } = useBaseDataEvents()

export function useAnnual() {
  const getAnnualInfo = () => store.getters['planManagement/getAnnualInfo']
  const getAnnualPackageInfo = () => store.getters['planManagement/getAnnualPackageInfo']

  // 是否禁止编辑
  const isForbidEdit = computed(() => {
    return [APPLY_EOA_DOING, APPLY_EOA_DONE].includes(getAnnualPackageInfo()?.applyStatus)
  })

  // 检查禁止状态
  const checkForbidStatus = () => {
    if (isForbidEdit.value) {
      Message.warning('审批中或已通过的计划不允许操作')
      return false
    }
    return true
  }

  // 检查计划是否有被查询
  const checkPackageFetched = () => {
    if (!Object.keys(getAnnualPackageInfo()).length) {
      Message.warning('请先选择计划单位')
      return false
    }
    return true
  }

  const selectionList = ref([])
  const handleSelection = (list) => {
    selectionList.value = list
  }

  // 删除数据
  const deleteDatas = (callback) => {
    if (!selectionList.value.length) {
      return Message.warning('请至少选择一条数据')
    }
    customHint(`确定删除以下计划？`, '提示', '取消').then(async () => {
      const planIdList = selectionList.value.map((item) => item.annualPlanId)
      await fetchDeletePlan({ planIdList })
      Message.success('删除成功')
      callback && callback()
    })
  }

  const totalDatas = reactive({
    [CLASS_TYPES_MAP[TRAINING_COURSE_TYPE]]: {},
    [CLASS_TYPES_MAP[NOT_TRAINING_COURSE_TYPE]]: {}
  })

  // 总计计算逻辑
  const summaryMethod = (param, tableName, courseType) => {
    const { columns, data } = param, sums = []
    columns.forEach(async (column, index) => {
      if (!getAnnualInfo()?.planCal) return
      const { property } = column
      if (index === 0) {
        sums[index] = '总计'
        return
      }

      const { totalTerm, totalStu, totalFee } = store.getters['planManagement/getAnnaulTotalPlanCount'][courseType]
      
      if (property === 'termNum') {
        sums[index] = totalTerm
      }
      if (property === 'studentTotal') {
        sums[index] = totalStu
      }
      if (property === 'totalFee') {
        sums[index] = totalFee
      }

      if( property === 'unitExpense') {
        sums[index] = totalFee
      }
      if (property === 'unitTotalFee') {
        sums[index] = totalFee
      }
    })
    return sums
  }

  return {
    getAnnualInfo,
    getAnnualPackageInfo,
    // annualPackageInfo,
    isForbidEdit,
    checkForbidStatus,
    checkPackageFetched,
    deleteDatas,
    handleSelection,
    summaryMethod
  }
}