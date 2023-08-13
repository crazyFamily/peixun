import { CopyObj } from '@/util/utils'
import { ESTABLISH_COURSE_MAP } from '@/util/constants'
export const useEstablish = () => {
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
  return { handleProjectCategoryOptions }
}
