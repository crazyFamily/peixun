import { ref } from 'vue'
import { Message } from 'element-ui'
export const useModuleConfiguration = () => {
  const courseList = ref([])
  const baseModuleItem = { fosterProjectName: '', fosterProjectId: '', showCourseInfo: '', fosterModality: '', fosterRequire: '', completeNum: '' }
  const handleCourseCommand = (item, courseItem, index) => {
    courseItem.showCourseInfo = item.fosterProjectId
    courseItem.fosterProjectId = item.fosterProjectId
    courseItem.fosterProjectName = item.fosterProjectName
  }
  const focusCourseInfo = (val, courseItem, typeStr) => {
    if (typeof courseItem.fosterModality !== 'number') {
      Message.warning(`请先选择${typeStr}`)
    }
  }
  // 添加课程
  const addCourseItemHandle = () => {
    courseList.value.push({ ...baseModuleItem })
  }
  // 删除课程
  const delUserHandle = (index) => {
    courseList.value.splice(index, 1)
  }
  return {
    courseList,
    handleCourseCommand,
    focusCourseInfo,
    addCourseItemHandle,
    delUserHandle
  }
}