<template>
  <div class="tanlents-plan">
    <el-card>
      <StepTopbar current-step="方案创建" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <SearchParams immediate :params="defaultSearchParams" @search="queryData" @reset="resetData" ref="searchParamsRef"> </SearchParams>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="handleOpenCreate">
          <i class="instructor-icons__add__icon"></i>
          添加方案
        </span>
        <span class="instructor-icons__download" @click="handleExport">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        @selection-change="handleSelection"
        ref="tablePagination"
      >
        <el-table-column slot="planFileName" prop="planFileName" label="方案附件" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <a :href="scope.row.planFileUrl" download class="active event-link">{{ scope.row.planFileName }}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="90" fixed="right">
          <template slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <span class="item active" @click="handleView(scope.row)">查看</span>
                <span class="item active" @click="handleEdit(scope.row)">编辑</span>
                <span class="item active" @click="handleRemove(scope.row)">删除</span>
                <span class="item active" v-if="scope.row.status === PROJECT_STATUS_DONE" @click="handleOpenStudent(scope.row)">录入学员</span>
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { PROJECT_STATUS_DONE, TALENT_STEP } from '@/views/TalentsCultivation/enum'
import SearchParams from '@/views/TalentsCultivation/components/SearchParams.vue'
import StepTopbar from '../components/StepTopbar.vue'
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import TMSOrgTree from '@/components/tree/TMSOrgTree.vue'
import { formatTreeData, projectTypeEvents, goToPage, formatParamsByProjectType } from '@/views/TalentsCultivation/utils'
import { fetchQCSotreQryParam, fetchQcFosterPlanList, fetchExportQcFosterPlanList, fetchDeleteQcFosterPlan } from '@/fetch/tanlents'
import store from '@/store'
import { computed, onActivated, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from '@/router'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { useTable } from '@/hooks/useTable'
import { customHint } from '@/util/utils'
import { Message } from 'element-ui'
const defaultSearchParams = ['annual', 'projectType', 'treeData', 'deptIds', 'projectInfo', 'status', 'isEnter']
const { mergeReactive } = useBaseDataEvents()

const baseParams = {
  annual: '',
  projectInfo: '',
  projectType: '',
  isEnter: '',
  lineIds: [],
  orgIds: [],
  empInfo: '',
  deptIds: [],
  isEnter: '',
  currPage: 1,
  pageSize: 10,
  total: 0
}

const { queryForm, tableList, query, reset, tableFilterSetting } = useTable(baseParams)

const columns = [
  {
    type: 'selection'
  },
  {
    label: '年度',
    prop: 'annual',
    type: 'setWidth',
    width: 70,
    formatter: (row) => `${row.annual}年`
  },
  {
    label: '项目ID',
    prop: 'projectId',
    type: 'setWidth',
    width: 70
  },
  {
    label: '项目名称',
    prop: 'projectName',
    type: 'setWidth',
    width: 190
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
    width: 100
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
    type: 'setWidth'
  },
  {
    label: '培养方案概要',
    prop: 'outline',
    width: 150
  },
  { slot: 'planFileName' },
  // {
  //   label: '方案附件',
  //   prop: 'planFileName'
  // },
  {
    label: '方案提交状态',
    prop: 'status',
    type: 'setWidth',
    width: 105,
    formatter: (row) => `${Number(row.status) === 0 ? '待提交' : '已提交'}`
  },
  {
    label: '学员录入状态',
    prop: 'isEnterStr',
    type: 'setWidth',
    width: 105
  }
]

// 树级下拉
const treeOptions = ref([{ parentQcCode: null, qCCode: '', qCMsg: '全部' }])
const selectedList = ref([])

const searchParamsRef = ref(null)
onActivated(() => {
  if (store.getters.getRefreshQueue.find((row) => row === useRoute().path)) {
    searchParamsRef.value.queryDatas()
  }
})

const orgData = ref([])
const queryData = (data, treeData) => {
  mergeReactive({ origin: queryForm, target: data })
  treeData && (orgData.value = treeData)
  query(getList)
  store.commit('removeQueue', useRoute().path)
}

const resetData = () => {
  reset(getList)
}

const getList = async () => {
  let data = formatParamsByProjectType(queryForm, orgData.value)
  data.status = data.status?.[0] || ''
  let { list, total } = await fetchQcFosterPlanList({ data })
  tableList.value = list
  queryForm.total = total
}

const querFormRef = ref(null)
const institutionRef = ref(null)

const handleSelection = (list) => {
  selectedList.value = list
}
const handleExport = async () => {
  let data
  if (selectedList.value.length) {
    data = { planIds: selectedList.value.map((item) => item.planId) }
  } else {
    data = formatParamsByProjectType(queryForm, orgData.value)
  }
  await fetchExportQcFosterPlanList({ data })
}
const handleView = (row) => {
  goToPage('/AddTalentsCultivationPlan', useRouter(), {
    type: 'view',
    id: row.planId
  })
}
const handleEdit = (row) => {
  goToPage('/AddTalentsCultivationPlan', useRouter(), {
    type: 'edit',
    id: row.planId
  })
}
// 删除
const handleRemove = async (row) => {  
  await customHint('是否确认删除当前方案？', '提示', '取消')
  const data = {planIds: [row.planId]}
  await fetchDeleteQcFosterPlan({ data })
  Message.success('已删除')
  query(getList)
}

const handleOpenStudent = (row) => {
  goToPage('/AddTalentsStudent', useRouter(), {
    type: 'edit',
    id: row.planId
  })
}
const handleOpenCreate = () => {
  goToPage('/AddTalentsCultivationPlan', useRouter(), { type: 'create' })
}
</script>
<script>
export default {
  name: 'TalentsCultivationPlan'
}
</script>
<style lang="scss" scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.form-item-df {
  :deep(.el-form-item__content) {
    display: inline-flex;
    align-items: center;
  }
}

.long-content {
  :deep(.el-form-item__content) {
    max-width: calc(100% - 180px);
  }
}
</style>