<template>
  <div class="talents-progress">
    <el-card>
      <StepTopbar current-step="培养进展管理" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <SearchParams 
      immediate 
      default-max-annual
      :params="defaultSearchParams" 
      @search="queryData" 
      @reset="resetData" 
      ref="searchParamsRef"
    >
    </SearchParams>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" v-show="isCanCreateProgress" @click="handleCreate">
          <i class="instructor-icons__add__icon"></i>
          项目进展收集
        </span>
        <span class="instructor-icons__download" @click="handleExport">
          <i class="instructor-icons__add__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column label="操作" width="110" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="handleView(scope.row)">查看</span>
              <span class="item active" @click="handleEdit(scope.row)">反馈</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>    
  </div>
</template>

<script setup>
import { HEADQUARTER_ADMIN, PROJECT_STATUS, PROJECT_STATUS_WAITING, PROJECT_TYPE_OPTIONS, TALENT_STEP, TANLENTS_LINE_ADMIN, TANLENTS_ORG_ADMIN, TANLENTS_PROJECT_STATUS } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
import SearchParams from '@/views/TalentsCultivation/components/SearchParams.vue'
import { useTable } from '@/hooks/useTable'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { computed, onActivated, reactive, ref } from 'vue'
import { useRoute, useRouter } from '@/router'
import store from '@/store'
import { fetchAuthProjectList, fetchExportListFosterProgress, fetchListFosterProgress } from '@/fetch/tanlents'
import { Message } from 'element-ui'
import MultipleSelect from '../components/MultipleSelect.vue'
import { addAllowKeepAlive, CopyObj } from '@/util/utils'
import { formatParamsByProjectType } from '../utils'
const { mergeReactive } = useBaseDataEvents()
const defaultSearchParams = ['annual', 'projectType', 'treeData', 'projectInfo', 'stage', 'feedbackStatus']

// “机构潜才培养管理员/条线潜才培养管理员, 不可使用“项目进展收集”功能，“项目进展收集”按钮对其隐藏；
const isCanCreateProgress = ref(
  store.getters['getUserInfo'].roleIds.includes(HEADQUARTER_ADMIN)
)

const baseParams = {
  projectStatus: []
}
const { queryForm, tableList, query, reset, tableFilterSetting } = useTable(baseParams)

const columns = [
  { label: '年度', prop: 'annual' },
  { label: '项目ID', prop: 'projectId' },
  { label: '项目名称', prop: 'projectName', width: '200px' },
  { label: '项目类型', prop: 'projectTypeDesc', width: '130px' },
  { label: '所属单位', prop: 'projectBlg', width: '100px' },
  { label: '进展阶段', prop: 'stageName', width: '100px' },
  { label: '项目状态', prop: 'projectStatusDesc', width: '100px', ...tableFilterSetting('projectStatus', TANLENTS_PROJECT_STATUS) },
  { label: '项目状态说明', prop: 'statusIntroduce', width: '120px' },
  // { label: '项目状态', prop: 'statusIntroduce', ...tableFilterSetting('projectTypeList', PROJECT_TYPE_OPTIONS), width: '120px' },
  { label: '议题实践进展', prop: 'topicProgress', width: '120px' },
  { label: '培养赋能进展', prop: 'fosterProgress', width: '120px' },
  { label: '反馈状态', prop: 'feedbackStatusName' },
  { label: '截止日期', prop: 'endDate', width: '100px' },
  { label: '更新人', prop: 'updatedByStr', width: '150px' },
  { label: '更新时间', prop: 'updatedDate', width: '150px' }
]

const getList = async () => {
  // const data = CopyObj(queryForm)
  // data.annual = data.annual ? [data.annual] : []
  const data = formatParamsByProjectType(queryForm, orgData.value)
  const {total, list} = await fetchListFosterProgress({ data })
  queryForm.total = total
  tableList.value = list
}

const handleExport = () => {
  const data = formatParamsByProjectType(queryForm, orgData.value)
  fetchExportListFosterProgress({ data })
}

const orgData = ref([])
const queryData = (data, treeData) => {
  mergeReactive({origin: queryForm, target: data})
  treeData && (orgData.value = treeData)
  query(getList)
  store.commit('removeQueue', useRoute().path)
}
const resetData = () => {
  reset(getList)
}

const isShowAddProgressDialog = ref(false)

const handleCreate = () => {
  // isShowAddProgressDialog.value = true
  addAllowKeepAlive('/AddTalentsProgress')
  useRouter().push({name: '项目进展收集', params: { status: 'create' }})
}

const handleEdit = (row) => {
  addAllowKeepAlive('/EditTalentsProgress')
  useRouter().push({name: '培养进展详情', params: { id: row.id, status: 'eidt' }})
}

const handleView = (row) => {
  addAllowKeepAlive('/EditTalentsProgress')
  useRouter().push({name: '培养进展详情', params: { id: row.id, status: 'view' }})
}

const handleCancelDialog = () => {
  isShowAddProgressDialog.value = false
}
const handleComfirmDialog = () => {
  handleCancelDialog()
}

const projectForm = reactive({
  projects: []  
})

const searchParamsRef = ref(null)
onActivated(() => {
  if(store.getters.getRefreshQueue.find(row => row === useRoute().path)) {
    searchParamsRef.value.queryDatas()
  }
})

</script>
<script>
export default {
  name: "TalentsProgress"
}
</script>

<style lang='scss' scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.dialog-wrapper {
  :deep(.el-form-item, .el-form-item__content) {
    width: 100%;
  }
}
</style>