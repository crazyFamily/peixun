<template>
  <gc-model title="选择考试" width="1200px" :visible.sync="isDialogShow" @comfirm="confirmHandle" @close="cancelHandle">
    <table-pagination
      :list="columns"
      :radio="true"
      :tableList="examList"
      :queryForm="examQueryParams"
      @select="selectionHandle"
      :getList="getExamInfos"
      ref="examTableRef"
      :pageSizes="[5, 10]"
    >
    </table-pagination>
  </gc-model>
</template>

<script setup>
import { watch, ref, reactive, nextTick } from 'vue'
import { fetchQueryExamInfoPage } from '@/fetch/courseRecommendation'
import { examTypeOptions, PUTAWAY, QUIZZES } from '@/views/CourseRecommendation/enum'
import { useTable } from '@/views/CourseRecommendation/hooks/useTable'
import { Message } from 'element-ui'
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  examInfo: {
    type: Object,
    required: true
  }
})

const { updateUnshowDatasMaps, getUnshowPageSelectedDatas, initDatasMap } = useTable({
  selectedList: props.examInfo.id ? [{ id: props.examInfo.id }] : []
})

const columns = [
  {
    type: 'selection'
  },
  {
    label: '考试名称',
    width: '70',
    prop: 'examName'
  },
  {
    label: '机构部门',
    width: '70',
    prop: 'blgOrgName'
  },
  {
    label: '考卷类型',
    width: '50',
    prop: 'examType',
    formatter: (row) => {
      return examTypeOptions.find((item) => item.value === Number(row.examType))?.label
    }
  },
  {
    label: '题目总数',
    width: '70',
    prop: 'exerciseNum'
  },
  {
    label: '创建人',
    width: '70',
    prop: 'createdBy'
  },
  {
    label: '最近修改时间',
    width: '70',
    prop: 'updatedDate'
  }
]
const examList = ref([])
const examQueryParams = reactive({
  examType: QUIZZES,
  status: PUTAWAY,
  total: 0,
  currPage: 1,
  pageSize: 10
})

const examTableRef = ref(null)
// 设置默认选中项
const setDefaultSelected = async () => {
  if (!selectedExam) return
  await nextTick()
  const tableRef = examTableRef.value.getOriginTableRef()
  examList.value.forEach((row) => {
    if (row.id === selectedExam.id) {
      tableRef.toggleRowSelection(row, true)
    }
  })
}
const getExamInfos = async () => {
  const { list, total } = await fetchQueryExamInfoPage({ data: examQueryParams })
  examQueryParams.total = total
  examList.value = list
  setDefaultSelected()
}

const queryExamInfos = () => {
  examQueryParams.currPage = 1
  getExamInfos()
}

/**
 * interface SelectedExam {
 *  id: Number
 *  [propName: string]: unset
 * }
 */
let selectedExam = null
const selectionHandle = (list, target) => {
  if (!list.length) return
  selectedExam = target
  updateUnshowDatasMaps([target])
}

const isDialogShow = ref(false)
watch(
  () => props.show,
  (n) => {
    isDialogShow.value = n
    if (props.examInfo.id) {
      selectedExam = props.examInfo
      initDatasMap([selectedExam])
    }
    n && queryExamInfos()
  },
  { immediate: true }
)

const emit = defineEmits(['confirm', 'cancel', 'update:show'])
const confirmHandle = () => {
  const resultData = selectedExam || getUnshowPageSelectedDatas()[0]
  if (!resultData) {
    return Message.warning('请最少选择一项')
  }
  emit('confirm', { examInfo: resultData })
  closeHandle()
}
const cancelHandle = () => {
  selectedExam = null
  emit('cancel', 'cancel')
  closeHandle()
}
const closeHandle = () => {
  emit('update:show', false)
}
</script>
<script>
export default {
  name: 'CourseCompExamInfo'
}
</script>
<style lang="scss" scoped></style>
