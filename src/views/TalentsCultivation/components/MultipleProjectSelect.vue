<template>
  <!-- 有多个的弹窗选择 -->
  <gc-model :visible="isDialogShow" :isShowFooter="false" @close="closeHandle()" :width="width" title="请选择">
    <slot name="search">
      <SearchParams
        immediate
        default-max-annual
        :params="defaultSearchParams"
        @search="queryData"
        @reset="resetData"
        ref="searchParamsRef"
        style="margin-bottom: 10px"
      >
      </SearchParams>
    </slot>
    <table-pagination
      row-key="id"
      :list="mergeColumns"
      :tableList="tableList"
      :queryForm="projectSearchForm"
      :getList="getProjectDataList"
      @selection-change="selectionHandle"
      :radio="!multiple"
      ref="tablePagination"
      :key="tableKey"
    >
      <el-table-column :selectable="selectable" slot="selection" type="selection" :reserve-selection="multiple" min-width="54"> </el-table-column>
    </table-pagination>
    <p class="space" style="height: 40px"></p>
    <div class="tanlents-upload-footer">
      <el-button class="item-button" @click="closeHandle">取消</el-button>
      <el-button class="item-button" type="primary" @click="comfirmHandle" :disabled="!selectedList.length">确定</el-button>
    </div>
  </gc-model>
</template>

<script setup>
import SearchParams from '@/views/TalentsCultivation/components/SearchParams.vue'
import { formatParamsByProjectType } from '../utils'
import { fetchAuthProjectList } from '@/fetch/tanlents'
import { computed, reactive, ref, watch } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { Message } from 'element-ui'
import { CopyObj, uuid } from '@/util/utils'
import { PROJECT_STATUS_WAITING } from '../enum'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  searchProjectParams: {
    type: Object,
    default: () => ({ tip: 'Y' })
  },
  // tableList: {
  //   type: Array,
  //   required: true,
  //   default: () => []
  // },
  multiple: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '1100px'
  },
  disableWaiting: {
    type: Boolean, 
    default: false
  }
})

const isDialogShow = ref(false)
const selectedList = ref([])
const tableKey = ref(uuid())
const tableList = ref([])

const { mergeReactive } = useBaseDataEvents()
const emits = defineEmits(['save', 'update:show'])
const defaultSearchParams = ['annual', 'projectType', 'treeData','planStatus']
console.log(props.searchProjectParams, '===>>>');
const baseProjectParams = {
  annual: [],
  projectType: '',
  lineIds: [],
  organIds: [],
  currPage: 1,
  pageSize: 10,
  planStatus:[],
  ...props.searchProjectParams,
  // tip: 'Y'
}

const searchParamsRef = ref(null)
watch(
  () => props.show,
  (n) => {
    isDialogShow.value = n
    if (isDialogShow.value) {
      selectedList.value = []
      tableKey.value = uuid()
      searchParamsRef.value?.resetDatas()
    }
  }
)

const projectSearchForm = reactive({ ...baseProjectParams })
const orgData = ref([])
const queryData = (data, treeData) => {
  mergeReactive({ origin: projectSearchForm, target: data })
  treeData && (orgData.value = treeData)
  getProjectDataList()
}
const resetData = () => {}
const getProjectDataList = async () => {
  console.log('--getProjectDataList--->',projectSearchForm)
  const data = formatParamsByProjectType(projectSearchForm, orgData.value)
  const { total, list } = await fetchAuthProjectList({ data })
  if (!list.length) {
    Message.warning('没有查询到项目信息')
  }
  if(props.disableWaiting) {
    tableList.value = list.map(row => ({...row,  disabledSelect: row.status !== PROJECT_STATUS_WAITING}))
  } else {
    tableList.value = list
  }
  tableList.value.forEach((item,index)=>{
    item.seqNum = index+1;
  })
  projectSearchForm.total = total
  // emits('update:tableList', list)
}

const mergeColumns = computed(() => {
  const selectioInt = {
    type: 'selection',
    slot: 'selection'
  }
  const columns = CopyObj(props.columns.slice(1))
  if (props.columns[0]?.type === 'selection') columns.splice(0, 1, selectioInt)
  return columns
})

const selectable = (row) => {
  // 通过这个字段来进行是否禁用的状态识别
  return !row.disabledSelect
}
const selectionHandle = (list) => {
  selectedList.value = list
}
const comfirmHandle = () => {
  emits('save', CopyObj(props.multiple ? selectedList.value : selectedList.value[0]))
  closeHandle()
}
const closeHandle = () => {
  isDialogShow.value = false
  emits('update:show', false)
}
</script>

<script>
export default {
  name: 'MultipleProjectSelect',
}
</script>
<style lang="scss" scoped>
.tanlents-upload-footer {
  padding: 15px 24px !important;
  border-top: 1px solid #eaecf1;
  box-sizing: border-box;
  text-align: right;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;

  .item-button {
    padding: 0 10px;
    min-width: 80px;
    height: 30px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>