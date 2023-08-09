<template>
  <gc-model
    title="课程授课明细"
    :visible="isDialogShow"
    width="1200px"
    class="course-teach-dialog"
    @close="close"
    :is-show-footer="false"
  >
    <div class="course-teach-wrapper">
      <el-card class="course-info-wrapper">
        <p class="item">课程名称：{{dataInfo.courseName}}</p>
        <p class="item" v-show="!courseType">供应商：{{dataInfo.supplyNames}}</p>
        <p class="item">授课次数：{{dataInfo.lecturesNum}}</p>
        <p class="item">授课平均评分：{{dataInfo.courseScore}}</p>
      </el-card>
      <el-card class="detail-info-wrapper">
        <!-- <p class="label">授课明细</p> -->
        <table-pagination
          :list="columns"
          :tableList="tableList"
          :queryForm="queryForm"
          :getList="getList"
          auto-height
          v-loading="loadingTable"
          ref="tablePagination"
        >
        </table-pagination>
      </el-card>
    </div>
  </gc-model>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useTable } from '@/hooks/useTable'
import { fetchListLecturesRecord, fetchListInternalRecord } from '@/fetch/curriculumManagement'
import { CopyObj } from '@/plugins/until'
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  courseId: {
    type: [String, Number],
    required: true
  },
  dataInfo: {
    type: Object,
    required: true
  },
  // 内部课程传参
  courseType: {
    type: String,
    default: ''
  }
})

const baseParams = {
  courseId: props.courseId
}

const { queryForm, tableList, query, reset, tableFilterSetting } = useTable(baseParams)

const columns = [
  { label: '讲师', prop: 'teacherName' },
  { label: '培训班名称', prop: 'className' },
  { label: '培训班编号', prop: 'classId' },
  { label: '授课评分', prop: 'courseScore' },
  { label: '授课日期', prop: 'courseDate' },
  { label: '授课时间', prop: 'courseTime' },
  { label: '班主任', prop: 'classAdviser' }
]
let loadingTable = ref(false)
const formatParams = (params) => {
  const resultParams = CopyObj(params)
  return resultParams
}

const getList = async () => {
  const data = formatParams(queryForm)
  loadingTable.value = true
  const { list, total } = props.courseType ? await fetchListInternalRecord({ data }).finally(()=>{
    loadingTable.value = false
  }) : await fetchListLecturesRecord({ data }).finally(()=>{
    loadingTable.value = false
  })
  tableList.value = list
  queryForm.total = total
}

const queryData = () => {
  query(getList)
}

const initData = () => {
  queryForm.courseId = props.courseId
  queryData()
}
watch(() => props.show, (n) => {
  n && initData()
}, { immediate: true })

const isDialogShow = computed(() => props.show)

const emit = defineEmits(['update:show'])
const close = () => {
  emit('update:show', false)
}
// const cancel = () => {}
// const save = () => {}
</script>
<script>
export default {
  name: 'CouseTeachDetail'
}
</script>
<style lang='scss' scoped>
.course-info-wrapper {
  margin-bottom: 10px;
  :deep(.el-card__body) {
    padding: 10px;
    display: grid;
    grid-template-rows: 50% 50%;
    grid-template-columns: 50% 50%;
  }

  .item {
    padding: 5px;
  }
}

.detail-info-wrapper {
  border: 0;

  .label {
    border: 1px solid #ebeef5;
    border-bottom: 0;
    padding: 10px 15px;
  }
  :deep(.el-card__body) {
    padding: 0px;
  }
}

.course-teach-dialog {
  :deep(.el-dialog__body) {
    max-height: calc(100% - 50px);
  }
}
</style>
