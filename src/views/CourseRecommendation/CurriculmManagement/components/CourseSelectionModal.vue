<template>
  <gc-model title="选择课程" width="1000px" :visible.sync="isDialogShow" :isShowFooter="isShowFooter" @comfirm="confirmHandle" @close="closeModal">
    <div class="header" v-if="isShowHeader">
      <el-form ref="form" :inline="true" :model="searchInfo">
        <el-form-item label="课程名称" v-if="searchCondition.isShowCourseName">
          <el-input class="w150" v-model="searchInfo.courseName" clearable></el-input>
        </el-form-item>
        <el-form-item label="课程系列" v-if="searchCondition.isShowCourseClassify">
          <el-cascader class="w150" v-model="searchInfo.courseClassify" :options="courseClassifyOptions" :props="{ value: 'tagId', label: 'tagName' }" @change="classifyChange" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="课程属主部门" v-if="searchCondition.isShowBlgOrg">
          <gc-select v-model="searchInfo.blgOrg" :options="orgOptions" k="orgName" v="orgId" clearable></gc-select>
        </el-form-item>
      </el-form>
      <div class="search-button">
        <el-button class="button-w80-h30" type="primary" @click="setPageAndSearch">查询</el-button>
        <el-button class="button-w80-h30" @click="reset">重置</el-button>
      </div>
    </div>
    <table-pagination ref="recommendTable" :list="columns" :tableList="courseList" :getList="search" :queryForm="searchInfo" @select="singleSelect" @select-all="selectAll" :pageSizes="[5, 10]">
    </table-pagination>
  </gc-model>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, watch } from 'vue'
import { fetchListTkCourses, APISelectCourseTagsForTk } from '@/fetch/courseRecommendation'
import { getCurriculumTree } from '@/util/utils'
import { getOrg } from '../../utils'
import { COURSE_STATUS } from '@/views/CourseRecommendation/enum'
import { Message } from 'element-ui'

const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false
  },
  isShowHeader: {
    type: Boolean,
    default: true
  },
  searchCondition: {
    type: Object,
    default: () => ({
      isShowCourseName: true,
      isShowCourseClassify: true,
      isShowBlgOrg: true,
    })
  },
  selectedList: {
    type: Array,
    default: []
  },
  maxNum: {
    type: Number,
    required: false
  },
  isShowFooter: {
    type: Boolean,
    default: true
  },
  columns: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    default: COURSE_STATUS['VALID'] // 上架状态: 已上架
  },
  // 表格内是否显示复选框
  isSelectionTable: {
    type: Boolean,
    default: true
  },
  // 当前编辑的课程
  editCourseId: {
    type: Number,
    default: 0
  }
})

// 搜索条件
let searchInfo = reactive({
  courseName: '',
  courseClassify: '',
  blgOrg: '',
  status: props.status,
  currPage: 1,
  pageSize: 10,
  total: 0,
})

// 清空搜索条件
const clear = () => {
  searchInfo.courseName = ''
  searchInfo.courseClassify = ''
  searchInfo.blgOrg = ''
  searchInfo.currPage = 1
}

// 课程部门属主
let orgOptions = ref([])
getOrg().then((res) => {
  orgOptions.value = res
})

// 获取课程系列
let courseClassifyOptions = ref([])
// tagType	1:课程分类; 2:课程标签,  blgStripLine 可以固定为:LS(零售), tagLevel 标签层级	
getCurriculumTree(1, 'LS', 1, APISelectCourseTagsForTk).then((res) => {
  courseClassifyOptions.value = res
})

// 处理课程系列提交数据
const classifyChange = (val) => {
  searchInfo.courseClassify = (val.length && val[1]) || ''
}

// 获取课程列表
let courseList = ref([])
const search = async () => {
  const { list, total } = await fetchListTkCourses({ data: searchInfo })
  courseList.value = list || []
  searchInfo.total = total || 0
  handleDefaultSelectedInfo() // pageSizeChange重置选中项
}

// 每次搜索查询重置页码
const setPageAndSearch = () => {
  searchInfo.currPage = 1
  search()
}

// 重置搜索条件和列表
const reset = () => {
  clear()
  search()
}

let selectedInfo = ref([])
// 单个选择
const singleSelect = (selection, target) => {
  let ids = selection.map(val => val.courseId)
  // 新增
  if (ids.includes(target.courseId)) {
    selectedInfo.value.push(target)
    if (maxWarningMsg(selectedInfo.value)) return
    unselectableMsg([target])
  } else {
    // 取消
    let list = selectedInfo.value
    selectedInfo.value = list.filter(val => val.courseId !== target.courseId)

  }
}

// 全选
const selectAll = (selection) => {
  // 取消全选
  if (!selection.length) {
    courseList.value.forEach((val, index) => {
      selectedInfo.value.forEach((item, idx) => {
        if (val.courseId === item.courseId) {
          selectedInfo.value.splice(idx, 1)
        }
      })
    })
    console.log("取消全选--------------", selectedInfo.value)
  } else {
    // 新增全选
    selectedInfo.value.map(val => {
      selection.map(item => {
        if (val.courseId === item.courseId) {
          item.isExisted = true
        }
      })
    })
    selection.map(item => {
      if (!item.isExisted) {
        selectedInfo.value.push(item)
      }
    })
    maxWarningMsg(selectedInfo.value)
    console.log("新增全选--------------", selectedInfo.value)
  }
}

// 已选中的推荐课程
let recommendTable = ref(null)
const handleDefaultSelectedInfo = () => {
  if (!selectedInfo.value.length || !props.isShowModal) return
  nextTick(() => {
    const tableRef = recommendTable.value.getOriginTableRef() // 获取table DOM元素
    courseList.value.map(row => {
      selectedInfo.value.map(select => {
        if (row.courseId === select.courseId) {
          tableRef.toggleRowSelection(row, true)
        }
      })
    })
  })
}

const emit = defineEmits(['update:isShowModal', 'update:selectedList'])
// 关闭弹框
const closeModal = () => {
  const tableRef = recommendTable.value.getOriginTableRef()
  tableRef.clearSelection() // 清空选项
  emit('update:isShowModal', false)
  reset()
}

// 确认
const confirmHandle = () => {
  if (maxWarningMsg(selectedInfo.value)) return
  if (unselectableMsg(selectedInfo.value)) return
  if (props.isSelectionTable && !selectedInfo.value.length) {
    return Message.warning('请最少选择一门课程')
  }
  emit('update:selectedList', selectedInfo.value)
  closeModal()
}

const maxWarningMsg = (list) => {
  if (props.maxNum && list.length > props.maxNum) {
    return Message.warning(`最多可选择${props.maxNum}门课程`)
  }
}

const unselectableMsg = (list) => {
  if (!props.editCourseId) return
  let id = list.filter(val => val.courseId == props.editCourseId)
  if (id.length) {
    return Message.warning(`不可选择当前课程 ${id[0].courseName}`)
  }
}

const isDialogShow = ref(false)
watch(
  [() => props.isShowModal, () => props.selectedList],
  ([newModal, newList]) => {
    isDialogShow.value = newModal
    selectedInfo.value = JSON.parse(JSON.stringify(newList))
    if (newModal) {
      handleDefaultSelectedInfo() // 更新默认选中项
    }
  })

onMounted(() => {
  search()
})
</script>
<script>
export default {
  name: 'CourseSelectionModal'
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  .el-form {
    width: 100%;
    .gc-select {
      padding: 0;
    }
  }
  .search-button {
    display: flex;
  }
}
</style>
