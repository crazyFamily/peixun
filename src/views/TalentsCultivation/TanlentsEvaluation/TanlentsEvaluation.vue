<template>
  <div>
    <el-card>
      <StepTopbar current-step="学员评价" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <el-card class="search-card mt10" style="overflow: initial;">
      <el-form :model="queryForm" :rules="queryFormRules" inline ref="querFormRef" label-width="90px">
       <el-form-item label="年度" prop="annual">
          <gc-select :options="annualList" v-model="queryForm.annual"> </gc-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <gc-select :options="projectTypeList" v-model="queryForm.projectType" :clearable="false" @change="projectTypeChangeHandle"> </gc-select>
        </el-form-item>
        <el-form-item label="所属单位">
          <headquarter-tree
            :tree-options="treeOptions"
            :normalizer="normalizer"
            class="tree-container"
            v-model="treeData"
            :disabled="queryForm.projectType === '0' || treeData === 'headquarter'"
          ></headquarter-tree>
        </el-form-item>
        <el-form-item label="主办单位" prop="deptIds">
          <gc-institution v-model="queryForm.deptIds" ref="institutionRef" :left-show="false" busi-type="FL" :fetchParams="{ showBusiType: 'FL' }">
          </gc-institution>
        </el-form-item>
        <el-form-item label="项目信息" prop="projectInfo">
          <el-input v-model="queryForm.projectInfo" placeholder="请输入项目ID/项目名称"></el-input>
        </el-form-item>
        <el-form-item label="学员信息" prop="projectInfo">
          <el-input v-model="queryForm.userInfo" placeholder="请输入UM/学员名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="评价提交状态" prop="isSubmit">
          <gc-select :options="statusList" v-model="queryForm.isSubmit"> </gc-select>
        </el-form-item> -->
        <div class="search-card__button">
          <el-button type="primary" @click="_queryDataList()">查询</el-button>
          <el-button @click="_resetDataList()">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__upload" @click="openImportForm">
          <i class="instructor-icons__upload__icon"></i>
          导入潜才培养学员评价
        </span>
        <span class="instructor-icons__download" @click="exportDataList()">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="queryDataListFormat"
        @selection-change="selectDataList"
        v-loading="getLoadingStatus('LOADING_NEW_STAFF_TRAINING')"
        ref="tablePaginationRef">
         <el-table-column slot="actionDesc" label="关键行为" width="150">
          <template slot-scope="scope">
            <CellToolTip
              :data-info="scope.row.targetActions || []" 
              :columns="columnCellToolTip"
              cell-content="详情">
            </CellToolTip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active mr10" @click="gotoDetailPage(scope.row, 'edit')">编辑</span>
              <span class="item active mr10" @click="gotoDetailPage(scope.row, 'view')">查看</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量导入弹框 -->
    <TanlentsUpload
      :show.sync="importScoreFormShow"
      templateCode="TANLENTS_STUDENT_EVALUATE"
      :fetchFn="fetchBatchImportQcPlanTeamsEvaluate"
      :upload-params="{tip: 'Y'}"
      @comfirm="comfirmImportScoreForm"
      :upload-table-columns="importScoreFaildColumns"
      :export-fetch="fetchExportFailedPlanTeamsEvaluate"
    ></TanlentsUpload>
  </div>
</template>
<script setup>
import StepTopbar from '../components/StepTopbar.vue'
import { ref, onMounted, watch, nextTick, reactive, computed, onActivated } from 'vue'
import { filterBusiType, customHint, tableSelectionChange, CopyObj, addAllowKeepAlive, renderName } from '@/util/utils'
import { Message } from 'element-ui'
import { usePageList } from '@/hooks/usePageList'
import { useTable } from '@/hooks/useTable'
import store from '@/store'
import { TRAINING_TYPE_OPTIONS } from '@/views/Establish/enum'
import { ROLE_CODE } from '@/util/constants'
import CellToolTip from '@/components/cellTooltip/index'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'
import ImportModel from '@/components/upload/ImportModel'
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import { useRecruitQryParam } from '@/views/NewPeopleTrainingManagement/hooks/useNewPeopleTraining'
import { fetchUserInfos } from '@/fetch/public'
import { 
  fetchListNewStaffTraining,
  fetchExportNewStaffTraining,
  fetchListTrainingClass,
  fetchDeleteTrainingClass,
  fetchAddTrainingClass,
  fetchNewStaffTrainingDetail,
  fetchListClassByClassId,
  fetchSaveNewStaffDelayApply,
  fetchListDelayApplyChain,
  fetchImportBatchTrainingScore,
  fetchHandleTrainingScore,
  fetchExportFailTrainingScore
} from '@/fetch/newPeopleTrainingManagement'
import { formatTreeData, projectTypeEvents, goToPage, formatParamsByProjectType } from '@/views/TalentsCultivation/utils'
import { 
  fetchQCSotreQryParam, 
  fetchQcFosterPlanList, 
  fetchExportQcFosterPlanList, 
  fetchListPlanTeamEvaluate,
  fetchExportListPlanTeamEvaluate,
  fetchBatchImportQcPlanTeamsEvaluate,
  fetchExportFailedPlanTeamsEvaluate,
  fetchHandleQcPlanTeamsEvaluate,
  fetchHandleQcStudentEvaluate
} from '@/fetch/tanlents'
import { useRouter, useRoute } from '@/router'
import { lastDay } from '@/util/utils'
import TanlentsUpload from '../components/TanlentsUpload.vue'
import { TALENT_STEP } from '../enum'

// 状态
const statusList = [
  { label: '待提交', value: 'N' },
  { label: '已提交', value: 'Y' }
]

const router = useRouter()

const _TRAINING_TYPE_OPTIONS = computed(() => TRAINING_TYPE_OPTIONS.filter(m => m.type === 'xxy'))

const baseQueryForm = {
  annual: '',
  projectInfo: '',
  projectType: '0',
  isSubmit: '',
  lineIds: [],
  orgIds: [],
  empInfo: '',
  deptIds: [],
  status: '',
  userInfo: ''
  // 组件关系，空数据必须为null，否则会有UI显示问题
}
const treeData = ref(null)

const queryFormRules = {
  annual: [{ required: true, trigger: 'change', message: '请选择年度' }],
}

const {
  tableFilterSetting,
  getLoadingStatus,
  queryForm,
  dataList,
  fetchDataList,
  tablePaginationRef,
  selectedList,
  selectDataList,
  queryDataListFormat,
  queryDataList,
  resetDataList,
  exportDataList,
  deleteDataList,
  dataRangeRules
} = usePageList({
  baseQueryForm,
  apiDataList: fetchListPlanTeamEvaluate,
  apiExportDataList: fetchExportListPlanTeamEvaluate,
  queryFormFormat: (params) => {
    params = formatParamsByProjectType(params, treeData.value)
    params.entryDateEnd = lastDay(params.entryDateEnd)
    return {data: params}
  }
})

const columnList = [
  { type: 'selection', fixed: 'left'},
  { label: '年度', width: '60', prop: 'annual', fixed: 'left' },
  { label: '项目ID', width: '80', prop: 'projectId' },
  { label: '项目名称', width: '200', prop: 'projectName' },
  { label: '项目类型', width: '120', prop: 'projectTypeDesc' },
  { label: '方案ID', width: '90', prop: 'customizePlanId' },
  { label: '所属单位', width: '100' , prop: 'projectBlg'},
  { label: '主办单位', width: '150' , prop: 'orgName'},
  { label: '学员名称', width: '150' , prop: 'umNameStr', formatter: (row) => `${row.umName}(${row.umId})`},
  { label: '大局观', width: '100', prop: 'overallViewDesc' },
  { label: '开创性', width: '100', prop: 'pioneerDesc' },
  { label: '狼性', width: '100', prop: 'wolfNatureDesc' },
  { label: '创新力', width: '100', prop: 'innovationDesc' },
  { label: '执行力', width: '100', prop: 'executivePowerDesc' },
  { label: '影响力', width: '100', prop: 'effectDesc' },
  { label: '协同力', width: '100', prop: 'synergyDesc' },
  { label: '学习力', width: '100', prop: 'learningAbilityDesc' },
  { label: '关键行为', slot: 'actionDesc' },
  { label: '突出特征', width: '200', prop: 'salientFeature' },
  { label: '评价提交状态', prop: 'isSubmit', width: 120, formatter: (row) => {
      if(row.isSubmit === 'Y') return '已提交'
      return '待提交'
    }, ...tableFilterSetting('isSubmit', statusList, false)
  },
  { label: '更新人', width: '150', prop: 'updatedByName', formatter: row => renderName(row.updatedByName, row.updatedBy)},
  { label: '更新时间', width: '150', prop: 'updatedDate' },
]

const columnCellToolTip = [
  { label: '指标', prop: 'targetName', 'show-overflow-tooltip': false, type: 'setWidth', width: '100px' },
  { label: '关键行为', prop: 'action', 'show-overflow-tooltip': false },
]

// const getList = async () => {
//   let data = formatParamsByProjectType(queryForm, treeData.value)
//   let { list, total } = await fetchListPlanTeamEvaluate({ data })
//   console.log(list, total);
//   // this.tableList = list
//   // this.queryForm.total = total
// }

// 树级下拉
const treeOptions = ref([{ parentQcCode: null, qCCode: '', qCMsg: '全部' }])
const normalizer = (node) => {
  return {
    id: node.qCCode,
    label: node.qCMsg,
    children: node.subLine
  }
}

const projectTypeChangeHandle = (value) => {
  treeData.value = null
  switch (value) {
    case '0':
      treeOptions.value = [{ parentQcCode: null, qCCode: '', qCMsg: '全部' }]
      treeData.value = ''
      break
    case '28001':
      treeOptions.value = [{ parentQcCode: null, qCCode: 'headquarter', qCMsg: '总行' }]
      treeData.value = 'headquarter'
      break
    // 条线
    case '28002':
      treeOptions.value = lineList.value
      break
    // 机构
    case '28003':
      treeOptions.value = orgList.value
      break
  }
}

const querFormRef = ref(null)
const dropdownTreeRef = ref(null)
function _queryDataList () {
  querFormRef.value.validate(valid => {
    if (valid) {
      queryDataList()
    }
  })
  store.commit('removeQueue', useRoute().path)
}
async function _resetDataList () {
  await resetDataList(false)
  querFormRef.value?.clearValidate()
  treeData.value = ''
  queryForm.projectType = '0'
  queryForm.annual = annualList.value[annualList.value.length - 1]?.value || ''
  dropdownTreeRef.value?.setValue(queryForm.orgIds)
  _queryDataList()
}

// 获取查询条件的下拉列表
const annualList = ref([])
const roleList = ref([])
const projectTypeList = ref([])
const orgList = ref([])
const lineList = ref([])
async function _getSeachDatas() {
  let data = {}
  let { annual, projectType, orgs, lines, role } = await fetchQCSotreQryParam({ data })
  annualList.value = annual.map((item) => ({
    label: `${item.qCCode}年`,
    value: item.qCCode
  }))

  // 数据格式化处理
  roleList.value = role.map((item) => ({
    label: item.qCMsg,
    value: item.qCCode
  }))
  projectTypeList.value = projectType.map((item) => ({
    label: item.qCMsg,
    value: item.qCCode
  }))
  orgList.value = formatTreeData(orgs)
  lineList.value = formatTreeData(lines)
  queryForm.projectType = projectTypeList.value[0].value
  projectTypeChangeHandle(queryForm.projectType)
  queryForm.annual = annualList.value[annualList.value.length - 1]?.value || ''
}

// ============================== 进入详情 ============================== 
async function gotoDetailPage (row, type) {
  // 跳转到表单页面
  addAllowKeepAlive('/TanlentsEvaluationDetail')
  router.push({
    name: '潜才学员评价详情',
    params: {
      formType: type,
      row: row
    }
  })
}

// ============================== 导入学员成绩 ==============================
const importScoreFormShow = ref(false)
// 导入失败数据列表
const importScoreFaildColumns = [
  { label: 'UM号', prop: 'umId', width: '150px' },
  { label: '姓名', prop: 'umName', width: '150px' },
  { label: '项目ID', prop: 'projectId', width: '90px' },
  { label: '失败原因', prop: 'msg', width: '200px' }
]
// 打开导入弹框
function openImportForm () {
  importScoreFormShow.value = true
}
// 导入确认
async function comfirmImportScoreForm (successList, batchId) {
  console.log(successList, batchId)
  await fetchHandleQcPlanTeamsEvaluate({ sucessList: successList, batchId })
  queryDataList()
  Message.success('新增成功！')
}

// ============================== 初始化 ==============================
onMounted(async () => {
  treeData.value = ''
  await _getSeachDatas()
  await _queryDataList()
})

onActivated(() => {
  if(store.getters.getRefreshQueue.find(row => row === useRoute().path)) {
    _queryDataList()
  }
})
</script>

<style lang="scss" scoped>
.gc-select {
  padding: 0px;
}
.info-wrapper {
  display: flex;
  flex-flow: wrap;

  .el-form-item {
    min-width: 286px;
  }
  .info-left, .info-right {
    flex: 1;
  }
}
.gray-desc {
  color: #999;
}
.red-desc {
  color: red;
}
.um-tag {
  border: 1px solid #d0d0d0;
  padding: 3px 5px;
  background: #f0f0f0;
  border-radius: 2px;
  margin: 2px;
  white-space: nowrap;
}
.delay-user-form-item {
  display: flex;
  margin-bottom: 10px;
  :deep(.el-form-item__content) {
    flex: 1;
  }
}
</style>