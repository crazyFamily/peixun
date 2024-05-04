import { ref, reactive, onMounted, computed, set } from 'vue'
import { fetchListUserByUm } from '@/fetch/newPeopleTrainingManagement'

export function useSelectUser (formData) {

  const isLoading = ref(false)
  const selectStudentVisible = ref(false)
  const searchUmId = ref('')
  const selectStudentForm = reactive({
    umId: '',
    currPage: 1,
    pageSize: 10,
    total: 0
  })
  const columnList = [
    { type: 'selection' },
    { label: '序号', type: 'index',  formatter: row => `${row.$index}` },
    { label: '姓名', prop: 'umName', type: 'setWidth', width: 80 },
    { label: 'UM号', prop: 'umId', type: 'setWidth', width: 150 },
    { label: '性别', prop: 'gender', width: 60 },
    { label: '部门', prop: 'deptName', type: 'setWidth', width: 270 },
    { label: '管理单位', prop: 'managementName', type: 'setWidth', width: 180 },
  ]
  const dataList = ref([])
  const dataListAll = ref([])
  const selectedList = ref([])

  // 打开选择 带班讲师 dialog
  function openSelectStudentDialog() {
    selectStudentVisible.value = true
  }
  function searchSelectStudent () {
    if (searchUmId.value.length < 2 || searchUmId.value === selectStudentForm.umId) return
    selectStudentForm.umId = searchUmId.value
    selectStudentForm.currPage = 1
    getStudentList()
  }
  function closeDialog () {
    selectStudentVisible.value = false
    selectStudentForm.currPage = 1
    searchUmId.value = ''
    selectStudentForm.umId = ''
    selectStudentForm.total = 0
    dataListAll.value = []
    dataList.value = []
  }
  function resetSelectStudent () {
    selectStudentForm.currPage = 1
    selectStudentForm.umId = ''
    getStudentList()
  }
  function getStudentList () {
    isLoading.value = true
      fetchListUserByUm(selectStudentForm)
      .then(resData => {
        selectStudentForm.total = resData.total
        dataList.value = resData.list
        isLoading.value = false
      }).catch(() => {
        isLoading.value = false
      })
  }
  function selectionHandle (ref, _list) {
    selectedList.value = ref.getSelection()
  }

  return {
    selectStudentVisible,
    searchUmId,
    selectStudentForm,
    columnList,
    dataList,
    isLoading,
    openSelectStudentDialog,
    closeDialog,
    getStudentList,
    searchSelectStudent,
    resetSelectStudent,
    selectionHandle,
  }
}