import { fetchListScOrg, fetchSelectCourseTagsForReview } from '@/fetch/courseRecommendation'
import { ref } from 'vue'
export function useBaseDatas() {
  const orgData = ref([])
  fetchListScOrg().then((data) => (orgData.value = data))

  const tagsData = ref([])
  const tagsMap = new Map()
  fetchSelectCourseTagsForReview({ data: { tagType: '2', blgStripLine: 'LS' } }).then((data) => {
    tagsData.value = data
    data.forEach((item) => {
      tagsMap.set(item.tagId, item)
    })
  })

  return {
    orgData,
    tagsData,
    tagsMap
  }
}
