import { reactive, ref, nextTick } from 'vue'
import { CopyObj, getLoadingStatus, isObj, formatDate } from '@/util/utils'
// import { useTable } from '@/hooks/useTable'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
const { mergeReactive } = useBaseDataEvents()

// 表头过滤器
const tableFilterSetting = (key, list, multiple = true) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

export const usePageList = ({
  baseQueryForm,
  apiDataList,
  apiExportDataList,
  queryFormFormat,
  dataListFormat
}) => {

  const baseTabelParams = {
    total: 0,
    currPage: 1,
    pageSize: 10
  }

  const queryParams = Object.assign({}, baseTabelParams, baseQueryForm)
  const queryForm = reactive(CopyObj(queryParams))

  const dataList = ref([])
  const selectedList = ref([])
  const tablePaginationRef = ref(null)

  // 列表选择行
  function selectDataList (data) {
    selectedList.value = data
  }

  // // 调用接口获取列表数据
  // function fetchDataList (params) {
  //   params = params || queryForm
  //   const data = queryFormFormat ? queryFormFormat(params) : params
  //   if (params) {
  //     apiDataList(data)
  //     .then(res => {
  //       const { list, total } = isObj(res.list) ? res.list : ( res || [] )
  //       dataList.value = dataListFormat ? dataListFormat(list) : list
  //       queryForm.total = total
  //     })
  //   }
  // }

  // 获取数据（调用接口）
  function getDataList (params) {
    apiDataList(params)
    .then(res => {
      const { list, total } = isObj(res.list) ? res.list : ( res || [] )
      dataList.value = dataListFormat ? dataListFormat(list) : list
      queryForm.total = total
    })
  }

  // 列表查询（格式化查询参数）
  // 此方法将绑定到<table-pagination></table-pagination>组件的“getList”属性中
  // 当列表中点击 上一页、下一页、切换页码、更换每页条数 时触发的事件
  function queryDataListFormat (params = queryForm) {
    params = queryFormFormat ? queryFormFormat(params) : params
    if (params) {
      getDataList(params)
    }
  }

  // 列表查询
  // 搜索栏中的【查询】按钮事件
  const queryDataList = () => {
    queryForm.currPage = 1
    queryDataListFormat()
  }

  const institutionRef = ref(null)
  // 重置
  const resetDataList = async (isReload = true) => {
    tablePaginationRef.value?.resetFilters()
    institutionRef.value?.createTreeData()
    await nextTick()
    mergeReactive({ origin: queryForm, target: CopyObj(queryParams) })
    if (isReload) {
      queryDataList()
    }
  }

  // 导出数据
  function exportDataList (params) {
    params = params || queryForm
    const data = queryFormFormat ? queryFormFormat(params) : params
    apiExportDataList(data)
  }

  function deleteDataList (row) {
    
  }

  function deleteBatchDataList () {
    
  }

  // 时间区间规则, 取queryFrom的属性对像，开始时间 <= 结束时间
  const dataRangeRules = (startKey, endKey) => {
    return {
      startPickerOptions: {
        disabledDate: (time) => {
          if (queryForm[endKey]) {
            return !(formatDate(time) <= queryForm[endKey])
          }
          return false
        }
      },
      // el-date-picker 结束时间限制
      endPickerOptions: {
        disabledDate: (time) => {
          if (queryForm[startKey]) {
            return !(formatDate(time) >= queryForm[startKey])
          }
          return false
        }
      }
    }
  }

  return {
    getLoadingStatus,
    queryForm,
    institutionRef,

    dataList,
    selectedList,
    selectDataList,
    tablePaginationRef,
    tableFilterSetting,
    // fetchDataList,
    queryDataList,
    queryDataListFormat,
    resetDataList,
    exportDataList,
    deleteDataList,
    deleteBatchDataList,
    dataRangeRules
  }
}
