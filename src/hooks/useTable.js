import { reactive, ref, nextTick } from 'vue'
import { CopyObj, formatDate } from '@/util/utils'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
const { mergeReactive } = useBaseDataEvents()

export const useTable = (baseParams, tableRef) => {
  const baseTabelParams = {
    total: 0,
    currPage: 1,
    pageSize: 10
  }

  const queryParams = Object.assign({}, baseTabelParams, baseParams)

  const queryForm = reactive(CopyObj(queryParams))
  const tableList = ref([])

  const query = (callback) => {
    queryForm.currPage = 1
    callback && callback()
  }
  const reset = async (callback) => {
    tableRef && tableRef.value.resetFilters()
    await nextTick()
    mergeReactive({ origin: queryForm, target: CopyObj(queryParams) })
    callback && callback()
  }

  // 必填校验
  // blur,change,input
  const requiredHandle = (message, trigger = 'change') => ({
    required: true,
    trigger,
    message
  })

  // 表头过滤器
  const tableFilterSetting = (key, list, multiple = true) => {
    return {
      type: 'tablecolumnfilters',
      labelKey: key,
      radio: !multiple,
      list
    }
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
    queryForm,
    tableList,
    query,
    reset,
    tableFilterSetting,
    requiredHandle,
    dataRangeRules
  }
}
