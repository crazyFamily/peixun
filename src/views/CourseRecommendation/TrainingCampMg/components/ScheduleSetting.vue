<template>
  <div class="sechedule-wrapper">
    <el-form :model="secheduleInfo" ref="secheduleInfoFormRef" :disabled="disabled">
      <el-form-item label=" ">
        <div class="header-info">
          <div class="arrow-wrapper">
            <i class="arrow-icon" :class="[{ 'el-icon-arrow-down': !isCollect, 'el-icon-arrow-up': isCollect }]" @click="isCollect = !isCollect"></i>
          </div>
          <gc-select
            class="select-style"
            v-model="secheduleInfo.type"
            @change="changeSecheduleTypeHandle"
            :options="secheduleHeaderTypeOptions"
            :clearable="false"
          >
          </gc-select>
          <!-- 系列输入内容 -->
          <template>
            <div class="wrapper-style series-wrapper" v-show="secheduleInfo.type === 'series'">
              <el-input
                v-model="secheduleInfo.content"
                @change="updateIputInfo(secheduleInfo.content, secheduleInfo, 'series')"
                placeholder="请输入系列标题（选填）"
                style="width: 245px"
              ></el-input>
            </div>
          </template>
          <!-- 线下培训输入内容 -->
          <template>
            <div class="wrapper-style class-wrapper" v-show="secheduleInfo.type === 'class'">
              <el-input
                v-model.trim="secheduleInfo.relationId"
                @change="searchClassInfoHandle"
                placeholder="请输入培训编码（请添加培训管理系统中已立项通过的8位数项目编号）"
              ></el-input>
            </div>
          </template>
        </div>
      </el-form-item>
      <div class="content-info-wrapper" v-show="!isCollect">
        <!-- 系列的内容可编辑 -->
        <template>
          <div class="content-container" ref="contentRef" v-show="secheduleInfo.type === 'series'">
            <el-form-item
              class="form-item-style content-items"
              v-for="(stageSeriesItem, stageIndex) in secheduleInfo.stageSeriesList"
              :key="stageSeriesItem.uid"
              :rules="validateSecheduleItem(stageIndex)"
              :prop="`stageSeriesList[${stageIndex}].content`"
              :data-id="stageSeriesItem.uid"
            >
              <div v-show="!disabled" class="dfcc drop-wrapper drop">
                <img src="@/assets/svg/drop.svg" alt="" />
              </div>
              <div class="edit-wrapper">
                <gc-select
                  class="select-style"
                  v-model="stageSeriesItem.type"
                  @change="changeItemTypeHandle($event, stageSeriesItem)"
                  :options="ifNotShow==='Y'?secheduleSeriesTypeOptionsY:secheduleSeriesTypeOptions"
                  :clearable="false"
                >
                </gc-select>
                <!-- 课程 -->
                <template>
                  <div class="edit-content-container course-edit-wrapper" v-show="stageSeriesItem.type === 'course'">
                    <div class="content-info">
                      <p class="info-item name" :class="{ disabled: disabled }">
                        <span class="text-info">
                          {{ stageSeriesItem.content }}
                        </span>
                      </p>
                    </div>
                    <el-button
                      class="select-button"
                      @click="showChoseDialogHandle(stageSeriesItem.type, stageIndex, stageSeriesItem)"
                      v-if="!disabled"
                      >请选择课程</el-button
                    >
                  </div>
                </template>
                <!-- 课程包 -->
                <template>
                  <div class="edit-content-container course-edit-wrapper" v-show="stageSeriesItem.type === 'project'">
                    <div class="content-info">
                      <p class="info-item name" :class="{ disabled: disabled }">
                        <span class="text-info">
                          {{ stageSeriesItem.content }}
                        </span>
                      </p>
                    </div>
                    <el-button
                      class="select-button"
                      @click="showChoseDialogHandle(stageSeriesItem.type, stageIndex, stageSeriesItem)"
                      v-if="!disabled"
                      >请选择课程包</el-button
                    >
                  </div>
                </template>
                <!-- 案例 -->
                <template>
                  <div class="edit-content-container course-edit-wrapper" v-show="stageSeriesItem.type === 'case'">
                    <div class="content-info">
                      <p class="info-item name" :class="{ disabled: disabled }">
                        <span class="text-info">
                          {{ stageSeriesItem.content }}
                        </span>
                      </p>
                    </div>
                    <el-button
                      class="select-button"
                      @click="showChoseDialogHandle(stageSeriesItem.type, stageIndex, stageSeriesItem)"
                      v-if="!disabled"
                      >请选择案例</el-button
                    >
                  </div>
                </template>
                <!-- 作业 -->
                <template>
                  <div class="edit-content-container task-edit-wrapper" v-show="stageSeriesItem.type === 'task'">
                    <div class="content-info">
                      <p class="info-item name" :class="{ disabled: disabled }">
                        <span class="text-info">
                          {{ stageSeriesItem.title }}
                        </span>
                      </p>
                    </div>
                    <el-button
                      class="select-button"
                      @click="showChoseDialogHandle(stageSeriesItem.type, stageIndex, stageSeriesItem)"
                      v-if="!disabled"
                      >编辑作业信息</el-button
                    >
                    <p class="task-view-button" @click="showChoseDialogHandle(stageSeriesItem.type, stageIndex, stageSeriesItem)" v-else>作业信息</p>
                  </div>
                </template>
                <!-- 考试 -->
                <template>
                  <div class="edit-content-container exam-edit-wrapper" v-show="stageSeriesItem.type === 'exam'">
                    <div class="content-info">
                      <gc-select
                        class="select-style"
                        v-model="stageSeriesItem.title"
                        @change="updateIputInfo(stageSeriesItem.title, stageSeriesItem, 'exam')"
                        :options="examTypeOptions"
                        :clearable="false"
                        style="margin-left: 10px"
                      >
                      </gc-select>
                      <p class="info-item name" :class="{ disabled: disabled }">
                        <span class="text-info">
                          {{ stageSeriesItem.content }}
                        </span>
                      </p>
                    </div>
                    <el-button
                      class="select-button"
                      @click="showChoseDialogHandle(stageSeriesItem.type, stageIndex, stageSeriesItem)"
                      v-if="!disabled"
                      >请选择</el-button
                    >
                  </div>
                </template>
                <!-- AI练 -->
                <template>
                  <div class="edit-content-container ai-edit-wrapper" v-show="stageSeriesItem.type === 'ai_exercise'">
                    <div class="content-info">
                      <p class="info-item name" :class="{ disabled: disabled }">
                        <span class="text-info">
                          {{ stageSeriesItem.content }}
                        </span>
                      </p>
                    </div>
                    <el-button
                      class="select-button"
                      @click="showChoseDialogHandle(stageSeriesItem.type, stageIndex, stageSeriesItem)"
                      v-if="!disabled"
                      >请选择任务</el-button
                    >
                  </div>
                </template>
              </div>
              <div class="dfcc control-wrapper">
                <i class="control-icon instructor-icons__del__icon" @click="removeSeriesItemHandle(stageSeriesItem, stageIndex)" v-if="!disabled"></i>
              </div>
            </el-form-item>
          </div>
        </template>
        <!-- 线下培训是纯显示课表 -->
        <template>
          <div class="content-container" v-show="secheduleInfo.type === 'class'">
            <el-form-item class="form-item-style content-items class-type" :rules="validateClassItem()" prop="courseList">
              <table-pagination
                :list="[
                  { label: '序号', type: 'index' },
                  { label: '课程名称', prop: 'courseName' }
                ]"
                :tableList="secheduleInfo.courseList"
                :queryForm="{}"
                :hide-pagination="true"
                style="width: 100%"
                ref="tablePagination"
              >
              </table-pagination>
            </el-form-item>
          </div>
        </template>
        <div class="control-button">
          <span class="icons__add active" @click="addSeriesItemHandle" v-if="!disabled && secheduleInfo.type === 'series'">
            <i class="icons__add__icon"></i>
            添加
          </span>
        </div>
      </div>
    </el-form>
    <gc-model class="dialog-style" :title="dislogTitle" :visible.sync="isDialogShow" show-close :is-show-footer="false" top="5vh" width="80%">
      <component :is="currentDialogType" :disabled="disabled" @confirm="comfirmHandle" @cancel="closeHandle" ref="dialogContentRef"></component>
    </gc-model>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, set as $set, watch, nextTick, unref } from 'vue'
import { CopyObj, customHint, uuid, formatDate } from '@/util/utils'
import SelectClassDialog from './SelectClassDialog.vue'
import SelectExamDialog from './SelectExamDialog.vue'
import SelectCaseDialog from './SelectCaseDialog.vue'
import SelectCourseDialog from './SelectCourseDialog.vue'
import SelectCourseBagDialog from './SelectCourseBagDialog.vue'
import TaskDialog from './TaskDialog.vue'
import SelectAiTaskDialog from './SelectAiTaskDialog.vue'
import { queryClassInfo } from '@/fetch/courseRecommendation'
import { useTrainingHooks } from '../hooks/useTrainingHooks'
const { dataMap, initMap, updateMap, getDataMap, removeMap, clearMap, initSortableTarget } = useTrainingHooks()

/**
 * TODO: code optimize
 */

// 初始化功能
const props = defineProps({
  value: {
    type: Object,
    required: true
  },
  dataInfo: {
    type: Object
  },
  timeRange: Array,
  disabled: {
    type: Boolean,
    default: false
  },
  ifNotShow: {
    type: String,
    default: 'N'
  }
})
const emit = defineEmits(['input'])

const seriesTypeInfoMap = {
  course: {
    component: SelectCourseDialog,
    componentTitle: '请选择课程'
  },
  project: {
    component: SelectCourseBagDialog,
    componentTitle: '请选择课程包'
  },
  case: {
    component: SelectCaseDialog,
    componentTitle: '请选择案例'
  },
  exam: {
    component: SelectExamDialog,
    componentTitle: '请选择考试'
  },
  task: {
    component: TaskDialog,
    componentTitle: '编辑作业'
  },
  ai_exercise: {
    component: SelectAiTaskDialog,
    componentTitle: '请选择任务'
  }
}
const serieItemObj = () => ({
  uid: uuid(),
  type: 'course',
  content: ''
})
const secheduleInfo = reactive({
  type: 'series',
  title: '系列',
  content: '',
  relationId: '',
  courseList: [],
  stageSeriesList: [serieItemObj()]
})
const secheduleHeaderTypeOptions = [
  {
    label: '系列',
    value: 'series'
  },
  {
    label: '线下培训',
    value: 'class'
  }
]
const secheduleSeriesTypeOptions = [
  {
    label: '课程',
    value: 'course'
  },
  {
    label: '作业',
    value: 'task'
  },
  {
    label: '考试',
    value: 'exam'
  },
  {
    label: 'AI练',
    value: 'ai_exercise'
  }
]
const secheduleSeriesTypeOptionsY = [
  {
    label: '课程',
    value: 'course'
  },
  {
    label: '作业',
    value: 'task'
  },
  {
    label: '考试',
    value: 'exam'
  },
  {
    label: 'AI练',
    value: 'ai_exercise'
  },
  {
    label: '课程包',
    value: 'project'
  },
  {
    label: '案例',
    value: 'case'
  }
]
const examTypeOptions = [
  {
    label: '考试',
    value: 'exam'
  },
  {
    label: '训前测',
    value: 'preTest'
  },
  {
    label: '训中测',
    value: 'inTest'
  },
  {
    label: '训后考',
    value: 'sufExam'
  }
]
const isCollect = ref(false)
const contentRef = ref(null)
let sortableEl
const initSortable = async () => {
  if (!contentRef.value) return
  sortableEl = await initSortableTarget(unref(contentRef), () => {
    emit('input', getExportInfo())
  })
}

const initData = (datas) => {
  clearMap()
  secheduleInfo.stageSeriesList = initMap(datas)
}

onMounted(() => {
  initSortable()
})

watch(
  () => props.dataInfo,
  (n) => {
    if (Object.keys(n).length) {
      if (!['class', 'series'].includes(n.type)) return
      Object.keys(n).forEach((item) => {
        secheduleInfo[item] = n[item]
      })
      if (!n.stageSeriesList) n.stageSeriesList = []
      initData(CopyObj(n.stageSeriesList))
      initSortable()
    }
  },
  {
    immediate: true
  }
)

// 数据输出
const getExportInfo = () => {
  if (!sortableEl) return
  const sortList = sortableEl.toArray()
  // resultInfo.stageSeriesList = sortList.map((uid) => resultInfo.stageSeriesList.find((findItem) => findItem.uid === uid))
  initData(sortList.map((item) => getDataMap(item)))
  const resultInfo = CopyObj(secheduleInfo)
  console.log(resultInfo, '==== >resulut info')
  return resultInfo
}

// 课表内容增删处理
const addSeriesItemHandle = () => {
  const data = serieItemObj()
  secheduleInfo.stageSeriesList = updateMap(data.uid, data)
}
const removeSeriesItemHandle = async (row, index) => {
  await customHint('是否确认要删除所选项？', '提示', '取消')
  secheduleInfo.stageSeriesList = removeMap(row.uid)
  emit('input', CopyObj(secheduleInfo))
}

const updateIputInfo = (value, row, type) => {
  if (type === 'exam') {
    currentEditRow.value = row
    updateSeriesInfo({ title: value, content: row.content, relationId: row.relationId })
  }
  if (type === 'series') {
    emit('input', CopyObj(secheduleInfo))
  }
}

const changeSecheduleTypeHandle = () => {
  const titleMap = {
    class: '线下培训',
    series: '系列'
  }
  secheduleInfo.title = titleMap[secheduleInfo.type]
  emit('input', CopyObj(secheduleInfo))
}

const changeItemTypeHandle = (value, row) => {
  currentEditRow.value = row
  updateSeriesInfo({ title: '', content: '', relationId: '', endTime: '' })
}

// 线下培训查询
const searchClassInfoHandle = async () => {
  const { courseList } = (await queryClassInfo({ classId: secheduleInfo.relationId })) || { courseList: [] }
  secheduleInfo.courseList = courseList
  secheduleInfo.stageSeriesList = []
  emit('input', CopyObj(secheduleInfo))
}

// 弹窗逻辑处理
const isDialogShow = ref(false)
const dislogTitle = ref('')
const closeHandle = () => {
  isDialogShow.value = false
  currentEditRow.value = null
}

const currentEditRow = ref(null)
const secheduleInfoFormRef = ref(null)
const updateSeriesInfo = (data) => {
  secheduleInfo.stageSeriesList = updateMap(currentEditRow.value.uid, { ...currentEditRow.value, ...data })
  secheduleInfoFormRef.value.validate()
  emit('input', CopyObj(secheduleInfo))
}
const comfirmHandle = (type, data) => {
  switch (type) {
    case 'course':
      updateSeriesInfo({ content: data.courseName, relationId: data.courseId, title: '课程', endTime: null })
      break
    case 'task':
      updateSeriesInfo({ content: data.taskName, title: data.title, endTime: data.endTime })
      break
    case 'exam':
      updateSeriesInfo({ content: data.examName, relationId: data.id, endTime: null })
      break
    case 'ai_exercise':
      updateSeriesInfo({ content: data.expansion + '_' + data.taskName, relationId: data.taskId, expansion: data.expansion, endTime: null })
      break
    case 'project':
      updateSeriesInfo({ content: data.projectName, relationId: data.projectId, title: '课程包', endTime: null })
      break
    case 'case':
      updateSeriesInfo({ content: data.courseName, relationId: data.courseId, title: '案例', endTime: null })
      break
  }
  isDialogShow.value = false
}
const currentDialogType = ref(SelectClassDialog)
const dialogContentRef = ref(null)
const showChoseDialogHandle = async (type, index, row) => {
  initDialogComponent(type)
  isDialogShow.value = true
  currentEditRow.value = row
  if (type === 'task') {
    await nextTick()
    dialogContentRef.value.initTaskData(row)
  }
  if (type === 'ai_exercise') {
    await nextTick()
    dialogContentRef.value.initTaskData(row)
  }
}

const initDialogComponent = (type) => {
  currentDialogType.value = seriesTypeInfoMap[type].component
  dislogTitle.value = seriesTypeInfoMap[type].componentTitle
}

// 表单校验
const validateForm = () => {
  return new Promise((resolve) => {
    secheduleInfoFormRef.value.validate((v) => {
      resolve(v)
    })
  })
}
defineExpose({ validateForm })

const validateSecheduleItem = (index) => {
  return {
    trigger: 'change',
    validator: (rule, value, callback) => {
      if (secheduleInfo.type === 'series') {
        const row = secheduleInfo.stageSeriesList[index]
        switch (row.type) {
          case 'course':
            if (!row.content || !row.relationId) callback(new Error('请选择一个课程'))
            callback()
            break
          case 'task':
            if (!row.content || !row.title || !row.endTime) callback(new Error('请完善作业信息'))
            if (props.timeRange[0] && formatDate(row.endTime) < formatDate(props.timeRange[0])) {
              callback(new Error('作业时间不可小于阶段的开始时间'))
            }
            if (props.timeRange[1] && formatDate(row.endTime) > formatDate(props.timeRange[1])) {
              callback(new Error('作业时间不可超出阶段的结束时间'))
            }
            callback()
            break
          case 'exam':
            if (!row.content || !row.relationId) callback(new Error('请选择一个考试'))
            if (!row.title) callback(new Error('请输入考试标题'))
            callback()
            break
          case 'ai_exercise':
            if (!row.relationId) callback(new Error('请输入AI练ID'))
            callback()
            break
          case 'project':
            if (!row.content || !row.relationId) callback(new Error('请选择一个课程包'))
            callback()
            break
          case 'case':
            if (!row.content || !row.relationId) callback(new Error('请选择一个案例'))
            callback()
            break
        }
      }
      if (secheduleInfo.type === 'class') {
        callback()
      }
    }
  }
}

const validateClassItem = () => {
  return {
    trigger: 'change',
    validator: (rule, value, callback) => {
      if (secheduleInfo.type === 'class' && !secheduleInfo.courseList.length) return callback(new Error('请录入线下培训课程'))
      callback()
    }
  }
}
</script>
<script>
export default {
  name: 'TrainingSecheduleSetting'
}
</script>
<style lang='scss' scoped>
.sechedule-wrapper {
  padding: 15px;
  background-color: #f3f4f8;
}

.header-info {
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 10px;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background-color: #dcdfe6;
    position: absolute;
    bottom: 0;
  }
}

.wrapper-style {
  width: 80%;
  margin-left: 10px;
}

.content-container {
  margin-top: 10px;
}

.control-button {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.content-items {
  display: flex;
  align-items: center;

  .drop-wrapper,
  .control-wrapper {
    width: 20px;
    height: 20px;
    position: relative;
    cursor: pointer;
  }
  .control-icon {
    position: relative;
  }
  .edit-wrapper {
    flex: 1;
    display: flex;
    margin-right: 10px;
  }
}

.edit-content-container {
  flex: 1;
  display: flex;
  height: 30px;
  // padding: 15px 0;
  .content-info {
    height: 100%;
    flex: 1;
    display: flex;
  }

  .info-item {
    margin: 0 5px;
    padding-left: 10px;
    line-height: 30px;
    border: 1px solid #dcdfe6;
    background-color: #fff;
    flex: 1;
    &:first-child {
      margin-left: 10px;
    }
    &:last-child {
      margin-right: 10px;
    }

    &.name {
      width: 0;
    }

    .text-info {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .info-item.disabled {
    background: #f3f4f8;
    color: #b4b6bc;
  }

  .exam-edit-style {
    width: 150px;
    border: unset;
    padding-left: 0;
    flex: unset;
  }

  .info-item.time {
    flex: unset;
    width: 200px;
  }

  .ai-input {
    margin: 0 10px;
  }
  .el-input {
    width: 68%;
  }
}

.select-style {
  width: 100px;
  padding: 0;

  :deep(.el-select) {
    width: 100px;
  }
}

.select-button {
  width: 100px;
}

.arrow-wrapper {
  width: 20px;
  .arrow-icon {
    transform: scale(1.3);
    cursor: pointer;
  }
}

.dialog-style {
  :deep(.gc-model__dialog) {
    height: auto !important;
  }
}

.form-item-style {
  flex: 1;
  margin-bottom: 20px;

  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
    flex: 1;
  }

  :deep(.el-form-item__error) {
    transform: translateX(180px);
  }
}

.class-type {
  :deep(.el-form-item__error) {
    transform: translateX(0);
  }
}

.task-view-button {
  background: #fff;
  padding: 0 10px;
  height: 100%;
  border: 1px solid #ddd;
  margin-right: 10px;
  margin-left: 5px;
  cursor: pointer;
}
</style>