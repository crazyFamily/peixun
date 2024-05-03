import { CopyObj } from '@/util/utils'
import { ref, watch } from 'vue'
import { getOrg } from '@/views/CourseRecommendation/utils'

export function useTrainingStatisHooks(queryFormOptions, props) {
  const orgOptions = ref([])

  const getOrgListHandle = () => {
    getOrg().then((res) => {
      orgOptions.value = res
    })
  }

  // 返回一个queryForm的实例对像
  const getQueryFormInt = () => {
    return CopyObj(queryFormOptions)
  }
  const queryForm = ref(getQueryFormInt())
  const tableList = ref([])

  const reset = (cb) => {
    Object.assign(queryForm.value, getQueryFormInt())
    cb && cb()
  }

  // 递归拉平树级数据
  const flatStageList = (stageSeriesList, level) => {
    let flatData = []
    stageSeriesList.forEach((stageRow) => {
      flatData.push({ ...stageRow, level })
      if (stageRow.stageSeriesList && stageRow.stageSeriesList.length) {
        flatData = flatData.concat(
          flatStageList(stageRow.stageSeriesList, level + 1)
        )
      }
    })
    return flatData
  }

  // 创建一个表格map, 表格的数据可以从里面获取
  const tableDataMap = new Map()
  const trainingStageDatas = ref([])
  const activeName = ref('')
  const trainingStageTableList = ref([])

  // 设置表格map
  const setTableMap = (datas) => {
    datas.forEach((row) => {
      if (!row.stageSeriesList) return
      tableDataMap.set(String(row.id), flatStageList(row.stageSeriesList, 0))
    })
  }

  // 根据name获取对应的数据，如果不传，则返回整个list
  const getTableDatas = (name) => {
    if (!name) return Array.from(tableDataMap.values())
    return tableDataMap.get(String(name)) || []
  }

  watch(trainingStageDatas, (n) => {
    setTableMap(n)
    trainingStageTableList.value = getTableDatas(String(activeName.value))
  })

  watch(activeName, (n) => {
    trainingStageTableList.value = getTableDatas(String(n))
  })

  return {
    getOrgListHandle,
    orgOptions,
    queryForm,
    tableList,
    reset,
    trainingStageDatas,
    activeName,
    trainingStageTableList,
    flatStageList,
    setTableMap,
    getTableDatas,
    tableDataMap
  }
}