<template>
  <div>
    <el-card>
      <StepTopbar current-step="议题终审" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <SearchParams :params="defaultSearchParams" @search="query" @reset="reset" :immediate="false" ref="searchParamsRef"></SearchParams>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePaginationRef" v-loading="loadingFlag">
        <el-table-column slot="subjectName" prop="subjectName" label="议题名称" width="230" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="active" @click="openViewTopicHandle(scope.row)">{{ scope.row.subjectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <!-- <span class="item active" @click="openViewHandle(scope.row)">查看</span> -->
              <span class="item active" @click="openEditHandle(scope.row)">终审</span>
              <span class="item active" @click="openEditDbHandle(scope.row)">督办</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { TALENT_STEP, EVALUATE_STATUS_WAITING, EVALUATE_STATUS_DONE, EVALUATE_STATUS, } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
import SearchParams from '../components/SearchParams.vue'
import { computed, onActivated, onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from '@/router'
import { formatParamsByProjectType, goToPage } from '@/views/TalentsCultivation/utils'
import { fetchQcFosterSubjectList, fetchExportQcFosterSubjectList } from '@/fetch/tanlents'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { YES_STATUS } from '@/util/constants'
import { getLoadingStatus } from '@/util/utils'
import { DB_STATUS_OPTIONS } from '../enum'
import store from '@/store'

const loadingFlag = getLoadingStatus('LOADING_TALENTS_SUBJECT_LIST')

const PAGE_STATUS_VIEW = 'view'
const PAGE_STATUS_EDIT = 'edit'
const PAGE_STATUS_EDIT_DB = 'edit_db'
const EDIT_TOPICCHECK_PATH = '/AddTalentsTopicCheck'
const EDIT_TOPIC_PATH = '/AddTalentsTopic'
const EDIT_TOPIC_SUPERVISE = '/AddSupervise'

const router = useRouter()
const route = useRoute()
const { mergeReactive } = useBaseDataEvents()
const defaultSearchParams = ['annual', 'projectType', 'treeData', 'deptIds', 'projectInfo', 'subjectInfo']

const tableFilterSetting = (key, list, multiple = true) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}
const statusOptions = [
  {
    label: EVALUATE_STATUS[EVALUATE_STATUS_WAITING],
    value: EVALUATE_STATUS_WAITING,
  },
  {
    label: EVALUATE_STATUS[EVALUATE_STATUS_DONE],
    value: EVALUATE_STATUS_DONE,
  },
]
const columns = [
  {
    label: '年度',
    prop: 'annual',
    type: 'setWidth',
    width: 70,
    formatter: (row) => `${row.annual}年`
  },
  {
    label: '议题ID',
    prop: 'subjectId',
    type: 'setWidth',
    width: 80
  },
  {
    slot: 'subjectName'
  },
  {
    label: '项目ID',
    prop: 'projectId',
    type: 'setWidth',
    width: 80
  },
  {
    label: '项目名称',
    prop: 'projectName',
    width: '200'
  },
  {
    label: '项目类型',
    prop: 'projectTypeDesc',
    type: 'setWidth',
    width: 120
  },
  {
    label: '方案ID',
    prop: 'customizePlanId',
    type: 'setWidth',
    width: 90
  },
  {
    label: '所属单位',
    prop: 'projectBlg',
    type: 'setWidth',
    width: 100
  },
  {
    label: '主办单位',
    prop: 'orgName',
    type: 'setWidth',
    width: 150
  },
  {
    label: '导师',
    prop: 'projectBlg',
    formatter: (row) => {
      return row.teamMembers
        .filter((item) => Number(item.isType) === 0)
        .map((item) => item.umName)
        .join('|')
    },
    type: 'setWidth',
    width: 150
  },
  {
    label: '督办状态',  
    prop: 'isSuperviseStr',
    width: 100,
    ...tableFilterSetting('isSupervise', DB_STATUS_OPTIONS, false)
  },
  {
    label: '终审状态',
    prop: 'evaluateStatusStr',
    width: 100,
    ...tableFilterSetting('evaluateStatus', statusOptions, true)
  }
]
const tableList = ref([])
const queryForm = reactive({
  currPage: 1,
  pageSize: 10,
  total: 0,
  isEvaluate: 'Y'
})
const orgData = ref('')

const getList = async () => {
  const data = formatParamsByProjectType(queryForm, orgData.value)
  // data.isEvaluate = ['']
  const { list, total } = await fetchQcFosterSubjectList({ data })
  tableList.value = list
  queryForm.total = total
}

const searchParamsRef = ref(null)
const query = (params, treeData) => {
  mergeReactive({ origin: queryForm, target: params })
  queryForm.currPage = 1
  treeData && (orgData.value = treeData)
  if(!treeData) orgData.value = []
  getList()
  store.commit('removeQueue', route.path)
}

const tablePaginationRef = ref(null)
const reset = (params, treeData) => {
  tablePaginationRef.value.resetFilters()
  query(params, treeData)
}

onMounted(() => {
  searchParamsRef.value.queryDatas()
})

onActivated(() => {
  if (store.getters.getRefreshQueue.find((row) => row === route.path)) {
    searchParamsRef.value.queryDatas()
  }
})

const exportHandle = async () => {
  const data = formatParamsByProjectType(queryForm, orgData.value)
  await fetchExportQcFosterSubjectList({ data })
}

const openViewTopicHandle = (row) => {
  goToPage(EDIT_TOPIC_PATH, router, {
    type: PAGE_STATUS_VIEW,
    id: row.id
  })
}

const openViewHandle = (row) => {
  goToPage(EDIT_TOPICCHECK_PATH, router, {
    type: PAGE_STATUS_VIEW,
    id: row.id
  })
}

const openEditHandle = (row) => {
  goToPage(EDIT_TOPICCHECK_PATH, router, {
    type: PAGE_STATUS_EDIT,
    id: row.id
  })
}

const openEditDbHandle = (row) => {
  goToPage(EDIT_TOPIC_SUPERVISE, router, {
    type: PAGE_STATUS_EDIT_DB,
    id: row.id
  })
}
</script>
<script>
export default {
  name: 'TalentsTopicCheck'
}
</script>
<style lang='scss' scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
</style>