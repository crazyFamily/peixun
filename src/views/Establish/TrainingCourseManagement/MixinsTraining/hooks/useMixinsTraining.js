import { fetchDeleteBatchClassTraining, fetchExportCompleteDetail, fetchExportSelectMixedTrainingPage, fetchExportTrainingCompleteDetail, fetchSelectMixedTrainingPage, fetchTrainingCompleteDetail, fetchUpdateFinishCondition, fetchUpdateTrainingSortNo } from "@/fetch/establish"
import { useTable } from "@/hooks/useTable"
import store from "@/store"
import { CopyObj, customHint } from "@/util/utils"
import { Message } from "element-ui"
import { onMounted, ref } from "vue"

export const useMixinsTraining = (props, baseParams = {}, detailBaseForm = {}, detailTablePaginationRef = null) => {
  // 去空格
  const filterSpace = (value) => {
    return value.replace(/(^\s*)|(\s*$)/g, '')
  }

  const { queryForm, query, tableList, tableFilterSetting } = useTable(baseParams)
  const sortNoList = ref([])

  const getList = async () => {
    sortNoList.value = []
    const data = queryForm
    const { list, total } = await fetchSelectMixedTrainingPage({ data })
    queryForm.total = total
    tableList.value = list
    sortNoList.value = list.map((row) => row.sortNo)
    // const countInfo = store.getters['establish/getMixinsTrainingCount']
    // store.commit('establish/updateMininsTrainingCount', { ...countInfo, [baseParams.trainingType]: total })
    store.dispatch('establish/getMixinsCountAsync', props.classId)
  }

  const queryDatas = () => {
    query(getList)
  }
  const handleExport = () => {
    const data = queryForm
    fetchExportCompleteDetail({ data })
    // fetchExportSelectMixedTrainingPage({ data })
  }
  // 校验是否有选择数据
  const validateMultipleSelected = (list) => {
    if (!list || !list.length) {
      Message.warning('请至少选择一条数据')
      return false
    }
    return true
  }

  // 批量删除
  const handleDelete = async () => {
    if (!validateMultipleSelected(selectedList.value)) return
    await customHint('确认需要删除所选数据吗', '提示', '取消')
    const data = { ids: selectedList.value.map((row) => row.id) }
    await fetchDeleteBatchClassTraining(data)
    Message.success('已删除')
    queryDatas()
  }

  // 拉取明细数据
  const detailTableList = ref([])
  const { queryForm: detailQueryForm, reset: detailReset } = useTable(detailBaseForm)
  const getDetailList = async () => {
    const data = { ...detailQueryForm, classId: props.classId }
    const { list, total } = await fetchTrainingCompleteDetail({ data })
    detailQueryForm.total = total
    detailTableList.value = list
  }

  const isFinisDetailShow = ref(false)
  const handleDetail = async (row) => {
    isFinisDetailShow.value = true
    detailTablePaginationRef?.value?.resetFilters()
    detailQueryForm.trainingId = row.trainingId
    detailQueryForm.id = row.id
    detailReset(getDetailList)
    console.log(detailQueryForm, '====>>. detailQueryForm')
    // query(getDetailList)
}

const isCreateCourseShow = ref(false)
const courseTablePaginationRef = ref(null)
const handleCreate = () => {
  isCreateCourseShow.value = true
  courseTablePaginationRef.value?.clearSelection()
  queryCourse(getCourseList)
}

const tablePaginationRef = ref(null)
const handleUpdateFinishCondition = async (status) => {
  if (!validateMultipleSelected(selectedList.value)) return
  const data = selectedList.value.map((row) => ({ id: row.id, isFinishCondition: status }))
  await fetchUpdateFinishCondition({ data })
  Message.success('设置成功')
  tablePaginationRef.value?.clearSelection()
  getList()
}

const selectedList = ref([])
const handleSelected = (list) => {
  selectedList.value = list
}

const handleExportDetails = async () => {
  const data = { ...detailQueryForm, classId: props.classId }
  await fetchExportTrainingCompleteDetail({ data })
}

const handleDropEnd = async () => {
  const data = tableList.value.map((row, index) => {
    return {
      id: row.id,
      sortNo: sortNoList.value[index]
    }
  })
  await fetchUpdateTrainingSortNo({ data })
  await getList()
}

onMounted(() => {
  queryDatas()
})
return {
  queryForm,
  query,
  tableList,
  tableFilterSetting,
  queryDatas,
  handleExport,
  handleDetail,
  handleCreate,
  handleDelete,
  handleUpdateFinishCondition,
  handleSelected,
  handleDropEnd,
  getList,
  isFinisDetailShow,
  isCreateCourseShow,
  detailTableList,
  getDetailList,
  detailQueryForm,
  handleExportDetails,
  filterSpace,
  validateMultipleSelected
}
}
