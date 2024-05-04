import { fetchListClassProjectType } from '@/fetch/establish'
import { fetchListPlanDict } from '@/fetch/public'
import { reactive, ref } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
const { mergeReactive } = useBaseDataEvents()
export const useReport = () => {
  const typesDatas = reactive({})
  const classTypeOneList = ref([])
  const classTypeTwoList = ref([])
  // 培训类型
  const trainTypes = ref([])
  // 业务模块
  const channelTypes = ref([])
  // 关键岗位
  const keyJobs = ref([])
  // 培训系列
  const trainSeries = ref([])
  // 子系列
  const childSeries = ref([])
  // 条线列
  const lines = ref([])

  const formatLabelData = (datas) => {
    return datas?.map((row) => ({ ...row, label: row.dataValue, value: row.dataEncode })) || []
  }

  // 获取类型数据列
  const getClassTypesDatas = (classType) => {
    return new Promise((resolve) => {
      fetchListClassProjectType({ classType: classType }).then((classDatas) => {
        mergeReactive({ origin: typesDatas, target: classDatas })
        classTypeOneList.value = formatLabelData(classDatas.classTypeOneList)
        classTypeTwoList.value = formatLabelData(classDatas.classTypeTwoList)
        resolve()
      })
    })
  }

  // 获取所有的子系列集
  const getAllChildSeries = (datas) => {
    const resList = datas.reduce((pre, crr) => {
      // 格式化后子系列的label需要转化为: 父级label-子系列label
      return pre.concat(formatLabelData(crr.childPlanDict).map((item) => ({ ...item, label: `${crr.dataValue}-${item.label}` })))
    }, [])
    return resList
  }

  // 获取计划相关字典表
  const getPlanDict = (line = 'LS', type = '01001') => {
    return new Promise((resolve) => {
      fetchListPlanDict({ line, type }).then((res) => {
        channelTypes.value = formatLabelData(res.channelTypes)
        trainSeries.value = formatLabelData(res.trainSeries)
        trainTypes.value = formatLabelData(res.trainTypes)
        childSeries.value = getAllChildSeries(trainSeries.value)
        resolve()
      })
    })
  }

  return {
    getClassTypesDatas,
    typesDatas,
    classTypeOneList,
    classTypeTwoList,
    getPlanDict,
    trainTypes,
    channelTypes,
    trainSeries,
    childSeries,
    lines
  }
}