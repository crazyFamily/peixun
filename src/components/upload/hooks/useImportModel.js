
import { ref } from 'vue'
import { Message } from 'element-ui'
export function useImportModel({
  fetchSave,
  queryDataList,
}) {
  const importFormShow = ref(false)
  // 打开导入弹框
  function openImportForm () {
    importFormShow.value = true
  }
  // 导入确认
  async function comfirmImportForm (data) {
    await fetchSave(data)
      importFormShow.value = false
      queryDataList()
      Message.success('导入成功！')
  }

  return {
    importFormShow,
    openImportForm,
    comfirmImportForm
  }
}
