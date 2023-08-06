import { fetchListPlanDict } from '@/fetch/public'
import { ref } from 'vue'

export const useGetPlanDictDatas = (queryForm) => {
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
    return datas.map((row) => ({ ...row, label: row.dataValue, value: row.dataEncode }))
  }

  /**
   * 获取计划相关字典表
   * @param {string} line 条线
   * @param {string} type 培训班/非培训班
   * @param {boolean} isOrginData 判断是否返回格式化后的数据，还是返回接口原有数据结构
   * @returns Promise
   */
  const getPlanDict = (line = 'LS', type = '01001', isOrginData = false) => {
    return new Promise((resolve) => {
      fetchListPlanDict({ line, type }).then((res) => {
        if (isOrginData) {
          channelTypes.value = res.channelTypes || []
          trainSeries.value = res.trainSeries || []
          trainTypes.value = res.trainTypes || []
        } else {
          channelTypes.value = formatLabelData(res.channelTypes || [])
          trainSeries.value = formatLabelData(res.trainSeries || [])
          trainTypes.value = formatLabelData(res.trainTypes || [])
        }
        resolve()
      })
    })
  }

  // 业务模化变更，过滤出关键岗位
  const channelTypeChange = (channelType) => {
    queryForm && (queryForm.keyJobs = '')
    if (!channelType) return (keyJobs.value = [])
    keyJobs.value = channelTypes.value.find((v) => v.dataEncode === channelType)?.childPlanDict
  }

  // 培训系列变更，过滤出子系列
  const trainSeriesChange = (trainSerie) => {
    queryForm && (queryForm.childSeries = '')
    if (!trainSerie) return (childSeries.value = [])
    childSeries.value = trainSeries.value.find((v) => v.dataEncode === trainSerie)?.childPlanDict
  }

  return { channelTypes, trainSeries, keyJobs, childSeries, getPlanDict, channelTypeChange, trainSeriesChange }
}
