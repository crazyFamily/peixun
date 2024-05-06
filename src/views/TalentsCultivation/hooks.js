import { TYPE_TOTAL, TYPE_HEADQUARTER, TYPE_LINE, TYPE_ORG } from '@/views/TalentsCultivation/enum'
import { onMounted, unref } from 'vue'
export function useTalentTrees({ treeData, treeOptions, lineList, orgList }) {
  const projectTypeEvents = (value) => {
    treeData.value = null
    switch (value) {
      case TYPE_TOTAL:
        treeOptions.value = [{ parentQcCode: null, qCCode: '', qCMsg: '全部' }]
        treeData.value = ''
        break
      case TYPE_HEADQUARTER:
        treeOptions.value = [{ parentQcCode: null, qCCode: 'headquarter', qCMsg: '总行' }]
        treeData.value = 'headquarter'
        break
      // 条线
      case TYPE_LINE:
        treeOptions.value = unref(lineList)
        break
      // 机构
      case TYPE_ORG:
        treeOptions.value = unref(orgList)
        break
    }
  }
  onMounted(() => {
    projectTypeEvents(TYPE_TOTAL)
  })
  return {
    projectTypeEvents
  }
}