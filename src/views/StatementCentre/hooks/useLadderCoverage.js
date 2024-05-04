import { ref, onMounted, defineEmits, watch } from 'vue'
import { pickerOptions, resetObj, CopyObj, isObj, formatDate } from '@/util/utils'

const tableFilterSetting = (key, list, multiple = false) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

export function useLadderCoverage ({
  baseQueryForm,
  apiDataList,
  apiExportDataList,
  queryFormFormat,
  dataListFormat,
  startField,
  endField,
}) {

  const queryForm = ref({ ...CopyObj(baseQueryForm) })

  // 搜索框规则
  const queryFormRules = {
    channelType: [{ required: true, message: '请选择岗位', trigger: 'change' }],
    orgIds: [{ required: true, trigger: 'blur', validator: (rule, value, cb) => {
        if (!value.length) {
          return cb(new Error('请选择机构'))
        }
        cb()
      }
    }],
    endDate: [{ required: true, message: '请选择结束月份', trigger: 'blur' }],
  }
 
  // 时间区间规则, 取queryFrom的属性对像，开始时间 <= 结束时间
  const dataRangeRules = (startKey, endKey) => {
    return {
      startPickerOptions: {
        disabledDate: (time) => {
          if (queryForm.value[endKey]) {
            return !(formatDate(time) <= queryForm.value[endKey])
          }
          return false
        }
      },
      // el-date-picker 结束时间限制
      endPickerOptions: {
        disabledDate: (time) => {
          if (queryForm.value[startKey]) {
            return !(formatDate(time) >= queryForm.value[startKey])
          }
          return false
        }
      }
    }
  }
  const { startPickerOptions, endPickerOptions } = dataRangeRules(startField, endField)

  function setDefaultDate () {
    // 当前年份
    const nowYear = new Date().getFullYear()
    const nowMonth = new Date().getMonth()+1

    // 参训年份 默认为 当前年份
    if (Object.hasOwnProperty.call(queryForm.value, startField)) {
      queryForm.value[startField] = `${nowYear}-01-01`
    }
    if (Object.hasOwnProperty.call(queryForm.value, endField)) {
      queryForm.value[endField] = `${nowYear}-${nowMonth < 10 ? '0'+nowMonth : nowMonth}-01`
    }
  }

  const dataList = ref([])
  // 调用接口获取列表数据
  function fetchDataList (params) {
    params = params || queryForm.value
    const data = queryFormFormat ? queryFormFormat(params) : params
    apiDataList(data)
    .then(res => {
      const { list, total } = isObj(res.list) ? res.list : ( res || [] )
      dataList.value = dataListFormat ? dataListFormat(list) : list
      queryForm.value.total = total
    })
  }

  // 查询
  const queryDataList = (params) => {
    params = params || queryForm.value
    params.currPage = 1
    fetchDataList(params)
  }

  const institutionRef = ref(null)
  // 重置
  const resetDataList = (params) => {
    params = params || queryForm.value
    resetObj(params, CopyObj(baseQueryForm))
    institutionRef.value?.createTreeData()
    queryDataList()
  }

  // 导出数据
  function exportDataList (params) {
    params = params || queryForm.value
    const data = queryFormFormat ? queryFormFormat(params) : params
    apiExportDataList(data)
  }

  // const emits = defineEmits(['activeTabChange'])
  // const props = defineProps({
  //   activeTab: String,
  //   tabs: {
  //     type: Array,
  //     default: () => []
  //   }
  // })

  // watch(() => props.activeTab, (newV) => {
  //   queryForm.value.trainType = newV
  // }, { immediate: true })
  
  // watch(() => queryForm.value.trainType, async (newV, oldV) => {
  //   emits('activeTabChange', newV)
  // })

  onMounted(() => {
    // queryDataList()
  })

  return {
    // props,
    tableFilterSetting,
    dataRangeRules,
    startPickerOptions,
    endPickerOptions,
    institutionRef,
    queryForm,
    queryFormRules,
    dataList,
    fetchDataList,
    queryDataList,
    resetDataList,
    exportDataList,
    setDefaultDate
  }
}