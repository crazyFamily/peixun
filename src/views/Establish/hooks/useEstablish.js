import { fetchUserOrgTree } from '@/fetch/public'
import { useGetPlanDictDatas } from '@/hooks/useGetPublicDatas'
import { busiTypes, ESTABLISH_COURSE_MAP } from '@/util/constants'
import { ref } from 'vue'
import { CopyObj } from '@/util/utils'
export const useEstablish = (queryForm) => {
  const { channelTypes, trainSeries, keyJobs, childSeries, getPlanDict, channelTypeChange, trainSeriesChange } = useGetPlanDictDatas(queryForm)

  const blgStripLineOptions = ref([])

  // 根据用户获取对应的条线信息
  const getBlgStripLineOptions = async () => {
    const res = await fetchUserOrgTree({ module: 'classModule' })
    busiTypes.forEach((busiTypRow) => {
      if (res.find((row) => row.busiType === busiTypRow.value)) {
        blgStripLineOptions.value.push(busiTypRow)
      }
    })
  }

  const handleProjectCategoryOptions = (data) => {
    const { classTypeOneList, classTypeTwoList } = data
    console.log(classTypeOneList, classTypeTwoList, '====>>>')
    // 培训班
    const p = classTypeOneList.find((v) => v.dataEncode === ESTABLISH_COURSE_MAP.interiorBank)
    // 非培训班
    const n = classTypeOneList.find((v) => v.dataEncode === ESTABLISH_COURSE_MAP.sansLecturer)
    const pChildren = []
    const nChildren = []
    p && (p.children = pChildren)
    n && (n.children = nChildren)
    classTypeTwoList.forEach((v) => {
      if (v.prnDataEncode === ESTABLISH_COURSE_MAP.interiorBank) {
        pChildren.push(v)
      } else if (v.prnDataEncode === ESTABLISH_COURSE_MAP.sansLecturer) {
        nChildren.push(v)
      }
    })
    console.log(classTypeOneList, '====>>>   classTypeOneList')
    return CopyObj(classTypeOneList)
  }

  return {
    blgStripLineOptions,
    channelTypes,
    trainSeries,
    keyJobs,
    childSeries,
    getPlanDict,
    channelTypeChange,
    trainSeriesChange,
    getBlgStripLineOptions,
    handleProjectCategoryOptions
  }
}
