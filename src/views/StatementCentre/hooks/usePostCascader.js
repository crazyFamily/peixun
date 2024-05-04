import { ref, onMounted } from 'vue'
import { fetchListPlanDict } from '@/fetch/public'

export function usePostCascader ({
  queryForm,
  fetchParams
}) {
  // 岗位选项加载
  const cascaderProps = { label: 'dataValue', value: 'dataEncode', children: 'childPlanDict' }
  const channelTypes = ref([])
  const pathLabels = ref([])
  async function getPlanOptions() {
    const data = await fetchListPlanDict({
      line: 'LS',
      type: '01001',
      ...fetchParams
    })
    channelTypes.value = data?.channelTypes?.map(m => {
      return {
        ...m,
        label: m.dataValue,
        value: m.dataEncode,
      }
    }) || []
  }

  // 岗位-级联选择框 change 事件
  const cascaderArr = ref(null)
  function channelTypesChange(data) {
    ;[queryForm.value.channelType, queryForm.value.keyJobs] = data
    if (data.length) {
      queryForm.value.keyJobsName = cascaderArr.value.getCheckedNodes()?.[0].label
      pathLabels.value = cascaderArr.value.getCheckedNodes()?.[0].pathLabels
    } else {
      queryForm.value.keyJobsName = ''
    }
  }

  // onMounted(() => {
  //   // getPlanOptions()
  // })

  return {
    pathLabels,
    cascaderProps,
    channelTypes,
    cascaderArr,
    getPlanOptions,
    channelTypesChange
  }
}