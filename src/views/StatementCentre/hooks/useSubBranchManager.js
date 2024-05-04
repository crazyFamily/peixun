import { ref, onMounted } from 'vue'
import { pickerOptions, resetObj, CopyObj } from '@/util/utils'

const tableFilterSetting = (key, list, multiple = false) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

export function useSubBranchManager ({
  baseQueryForm,
  apiDataList,
  apiExportDataList
}) {
  const queryForm = ref({ ...CopyObj(baseQueryForm) })
  const { startPickerOptions, endPickerOptions } = pickerOptions({ 
    queryForm: queryForm.value, 
    startField: 'dateJobStart',
    endField: 'dateJobEnd' 
  }) 

  // 当前年份
  const nowYear = new Date().getFullYear()
  // 获取参训年份下拉选项
  const getYearOptions = (minYear = 2021) => {
    const yearList = [] 
    for (let i = minYear; i <= nowYear; i++) {
      yearList.unshift({ value: i, label: `${i}年` })
    }
    return yearList
  }
  // 参训年份下拉选项
  const yearOptions = getYearOptions()
  // 参训年份 默认为 当前年份
  queryForm.value.year = nowYear

  const dataList = ref([])

  function getQueryForm() {
    const data = CopyObj(queryForm.value)
    if (Object.hasOwnProperty.call(data, 'blgStripLine')) {
      const [blgStripLine, blgOrgId] = data.blgStripLine
      ;[data.blgStripLine, data.blgOrgId] = [blgStripLine, blgOrgId]
    }
    if (Object.hasOwnProperty.call(data, 'isShowSecondFH')) {
      data.isShowSecondFH = data.isShowSecondFH ? 'Y' : 'N'
    }
    if (Object.hasOwnProperty.call(data, 'dateJobStart') && !data.dateJobStart) {
      Reflect.deleteProperty(data, 'dateJobStart')
    }
    if (Object.hasOwnProperty.call(data, 'dateJobEnd') && !data.dateJobEnd) {
      Reflect.deleteProperty(data, 'dateJobEnd')
    }
    return data
  }

  // 调用接口获取列表数据
  function fetchDataList () {
    const data = getQueryForm()
    apiDataList(data)
    .then(res => {
      const { list, total } = res || {}
      dataList.value = list
      queryForm.value.total = total
    })
  }

  // 查询
  const queryDataList = () => {
    queryForm.value.currPage = 1
    fetchDataList()
  }

  const institutionRef = ref(null)
  const cacheOrgIds = ref([])
  // 重置
  const resetDataList = () => {
    resetObj(queryForm.value, CopyObj(baseQueryForm))
    // 参训年份 默认为 当前年份
    queryForm.value.year = nowYear
    institutionRef.value?.createTreeData()
    queryDataList()
  }

  // 选择机构成功事件
  const orgIdsFinish = (data) => {
    console.log(data)
    cacheOrgIds.value = CopyObj(queryForm.value.orgIds)
    fetchDataList()
  }

  // 导出数据
  function exportDataList () {
    const data = getQueryForm()
    apiExportDataList(data)
  }

  onMounted(() => {
    queryDataList()
  })

  return {
    tableFilterSetting,
    startPickerOptions,
    endPickerOptions,
    institutionRef,
    orgIdsFinish,
    queryForm,
    yearOptions,
    dataList,
    fetchDataList,
    queryDataList,
    resetDataList,
    exportDataList,
  }
}