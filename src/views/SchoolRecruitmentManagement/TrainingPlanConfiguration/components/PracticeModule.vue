<template>
  <div class="module-info">
    <span class="ml20 active" v-if="!disable" @click="addCourseItemHandle">添加</span>
    <div class="course-item" v-for="(courseItem, index) in courseList" :key="index">
      <el-form-item
        label="实践形式"
        label-width="120px"
        :prop="`practiceModuleList.${index}.fosterModality`"
        :rules="{ required: true, message: `实践形式必填` }"
      >
        <gc-select
          k="label"
          v="value"
          @change="selectStudyTypeHandle($event, courseItem, index)"
          class="padding-0 w-250"
          :disabled="disable"
          v-model="courseItem.fosterModality"
          :options="PRACTICE_FORMAT_OPTIONS"
        ></gc-select>
      </el-form-item>
      <el-form-item
        label="活动ID"
        label-width="120px"
        :prop="`practiceModuleList.${index}.fosterProjectId`"
        :rules="{ required: courseItem.fosterModality !== PRACTICE_FILEUPLOAD, message: `活动ID必填` }"
      >
        <el-dropdown
          trigger="click"
          ref="messageCourseDrop"
          placement="bottom-start"
          style="width: 250px"
          @command="handleCourseCommand($event, courseItem, index)"
          @visible-change="visibleCourseChange($event, courseItem, index)"
        >
          <div class="gc-approval-chain">
            <el-input
              style="width: 250px"
              class="gc-approval-chain__input"
              placeholder="请输入活动ID进行查询"
              v-model.trim="courseItem.showCourseInfo"
              :disabled="disable || courseItem.fosterModality === PRACTICE_FILEUPLOAD"
              @input="inputCourseInfo($event, courseItem, index)"
              @focus="focusCourseInfo($event, courseItem, '实践形式')"
            >
            </el-input>
          </div>
          <el-dropdown-menu slot="dropdown" style="width: 250px" class="gc-approval-chain__drop-down">
            <div v-show="loadingCourseText" style="text-align: center; margin-top: 80px; color: #ccc">{{ loadingCourseText }}</div>
            <el-dropdown-item
              v-for="item in hintCourseData"
              :key="item.courseId"
              :command="item"
              style="white-space: nowrap; overflow: hidden; -ms-text-overflow: ellipsis; text-overflow: ellipsis"
            >
              <span>{{ item.fosterProjectId }}</span
              >&nbsp;&nbsp;
              <span>{{ item.fosterProjectName }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item
        label="活动名称"
        label-width="120px"
        :prop="`practiceModuleList.${index}.fosterProjectName`"
        :rules="{ required: courseItem.fosterModality === PRACTICE_FILEUPLOAD, message: `活动名称必填` }"
      >
        <el-input
          v-model="courseItem.fosterProjectName"
          :disabled="disable || courseItem.fosterModality !== PRACTICE_FILEUPLOAD"
          class="sw-250"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动量要求">
        <el-input
          resize="none"
          class="h-110"
          style="width: 620px"
          type="textarea"
          maxlength="200"
          show-word-limit
          placeholder="活动要求"
          v-model="courseItem.fosterRequire"
        ></el-input>
      </el-form-item>
      <el-form-item label="要求完成数量" label-width="120px">
        <el-input v-model="courseItem.completeNum" class="sw-250" maxlength="20" show-word-limit></el-input>
        <span class="ml20 active" v-if="!disable" @click="delUserHandle(index)">删除</span>
      </el-form-item>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { PRACTICE_FORMAT_OPTIONS, PRACTICE_FILEUPLOAD } from '../../enum.js'
import { fetchFindFosterProject } from '@/fetch/schoolRecruitmentManagement'
import { useModuleConfiguration } from '../hooks/useModuleConfiguration.js'
const emit = defineEmits(['clearValidateModule'])
const props = defineProps({
  disable: {
    type: Boolean,
    defalut: false
  },
  value: {
    type: Array,
    defalut: []
  }
})
const { courseList, handleCourseCommand, addCourseItemHandle, delUserHandle, focusCourseInfo } = useModuleConfiguration()
watch(
  () => props.value,
  (n) => {
    courseList.value = n
  },
  {
    immediate: true
  }
)
const selectStudyTypeHandle = (val, courseItem, index) => {
  // 修改学习形式需要清空课程数据
  if (courseItem.showCourseInfo) {
    courseItem.showCourseInfo = ''
    courseItem.fosterProjectId = ''
    courseItem.fosterProjectName = ''
  }
  emit('clearValidateModule', `practiceModuleList.${index}.fosterProjectId`)
  emit('clearValidateModule', `practiceModuleList.${index}.fosterProjectName`)
}

const hintCourseData = ref([])

const messageCourseDrop = ref(null)
const visibleCourseChange = (bool, courseItem, index) => {
  if (props.disable || !courseItem.showCourseInfo) {
    messageCourseDrop.value[index].hide()
  }
  if (!bool && !courseItem.fosterProjectId) {
    courseItem.fosterProjectId = ''
    courseItem.fosterProjectName = ''
  }
}
let timer = null
const loadingCourseText = ref('')
const inputCourseInfo = (val, courseItem, index) => {
  if (courseItem.fosterModality && val) {
    messageCourseDrop.value[index].show()
    courseItem.fosterProjectId = ''
    clearTimeout(timer)
    hintCourseData.value = []
    loadingCourseText.value = '加载中...'
    timer = setTimeout(() => {
      fetchFindFosterProject({
        data: {
          fosterModality: courseItem.fosterModality,
          fosterProjectId: val
        }
      }).then((res) => {
        if (courseItem.showCourseInfo) {
          hintCourseData.value = res.list || []
        }
        if (!hintCourseData.value.length) {
          loadingCourseText.value = '无数据'
        } else {
          loadingCourseText.value = ''
        }
      })
    }, 500)
  } else {
    hintCourseData.value = []
    courseItem.fosterProjectId = ''
    courseItem.fosterProjectName = ''
    loadingCourseText.value = ''
  }
}
</script>
<script>
export default {
  name: 'PracticeModule'
}
</script>
<style lang="scss" scoped>
.course-item {
  display: flex;
  flex-wrap: wrap;
  .h-110 {
    height: 110px !important;
    :deep(textarea) {
      height: 110px !important;
    }
  }
}
</style>