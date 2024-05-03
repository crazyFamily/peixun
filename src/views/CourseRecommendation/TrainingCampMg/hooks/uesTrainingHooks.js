import { CopyObj, uuid } from '@/util/utils'
import Sortable from 'sortablejs'
import { nextTick } from 'vue'
import { TRAINING_SERIES_TYPE, TRAINING_COURSE } from '@/views/CourseRecommendation/enum'

export function useTrainingHooks() {
  const dataMap = new Map()
  const initMap = (datas, isReturnResult = true) => {
    CopyObj(datas).forEach((data) => {
      const uid = data.uid || uuid()
      dataMap.set(uid, { uid, ...data })
    })
    if (isReturnResult) return getDataMap()
  }
  const updateMap = (key, value, isReturnResult = true) => {
    dataMap.set(key, value)
    console.log(key, value, dataMap, '==>datamap')
    if (isReturnResult) return getDataMap()
  }
  const removeMap = (key, isReturnResult = true) => {
    dataMap.delete(key)
    if (isReturnResult) return getDataMap()
  }
  const clearMap = () => {
    dataMap.clear()
  }
  const getDataMap = (key) => {
    if (key) return dataMap.get(key)
    return Array.from(dataMap.values())
  }
  const initSortableTarget = async (target, onEndCallback) => {
    await nextTick()
    return new Sortable(target, {
      handle: '.drop',
      filter: '.filter',
      dataIdAttr: 'data-id',
      animation: 150,
      onEnd(event) {
        onEndCallback && onEndCallback()
      },
      onMove(event) {}
    })
  }

  // 计算训练营下所有内容的数量
  const typesCount = (stageDataInfo) => {
    // 系列数据列做递归处理
    const stageCountInfo = {}
    
    const formatBaseInfo = () => {
      const baseInfo = {}
      Object.keys(TRAINING_SERIES_TYPE).forEach((key) => {
        baseInfo[key] = {
          label: TRAINING_SERIES_TYPE[key],
          count: 0
        }
      })
      return baseInfo
    }
    const count = (dataList, dataMap) => {
      dataList.forEach((row) => {
        Object.keys(TRAINING_SERIES_TYPE).forEach((key) => {
          if (row.type === key) dataMap[key].count++
        })
        if (row.stageSeriesList && row.stageSeriesList.length) {
          count(row.stageSeriesList, dataMap)
        }
        if (row.courseList) {
          // 线下培训强行设置课程类型，后端无类型字段
          count( 
            row.courseList.map((course) => { return { ...course, type: TRAINING_COURSE } }),
            dataMap
          )
        }
      })
    }

    stageDataInfo.forEach((stage) => {
      stageCountInfo[stage.id] = formatBaseInfo()
      if (stage.stageSeriesList && stage.stageSeriesList.length) {
        count(stage.stageSeriesList, stageCountInfo[stage.id])
      }
    })

    return CopyObj(stageCountInfo)
  }

  return {
    dataMap,
    initMap,
    updateMap,
    getDataMap,
    removeMap,
    clearMap,
    initSortableTarget,
    typesCount
  }
}