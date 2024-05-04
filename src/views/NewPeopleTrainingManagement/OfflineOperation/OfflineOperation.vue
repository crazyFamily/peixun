<template>
  <div>
    <el-card class="search-card mt10">
      <el-form :model="queryForm" :rules="queryFormRules" inline ref="querFormRef" label-width="90px">
        <el-form-item label="年度" prop="annual">
          <gc-select :options="annualList" 
            v-model="queryForm.annual" 
            :clearable="false"
            class="w-200"
          ></gc-select>
        </el-form-item>
        <el-form-item label="机构" prop="orgIds">
          <DropdownZhOrg
            :style="{width: '250px'}"
            :search="true"
            :list="orgList"
            @change="queryForm.orgIds = $event"
            valueField="orgId"
            labelField='orgName'
            ref="dropdownTreeRef"
          ></DropdownZhOrg>
        </el-form-item>
        <el-form-item label="培训项目信息">
          <el-input class="w-200" v-model.trim="queryForm.classId" placeholder="请输入培训项目ID/名称" clearable />
        </el-form-item>
        <el-form-item label="入职年月">
          <el-date-picker
            class="w-120 clearable-data-pick"
            v-model="queryForm.entryDateStart"
            type="month"
            placeholder="开始月份"
            :clearable="true"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span class="ml10 mr10">至</span>
          <el-date-picker
            class="w-120 clearable-data-pick"
            v-model="queryForm.entryDateEnd"
            type="month"
            placeholder="结束月份"
            :clearable="true"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="学员信息">
          <el-input class="w-200" v-model.trim="queryForm.umId" placeholder="请输入学员姓名/UM号" />
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="_queryDataList()">查询</el-button>
          <el-button @click="_resetDataList()">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="handleShowImportInstructor">
          <i class="instructor-icons__add__icon"></i>
          导入学员评价
        </span>
        <span class="instructor-icons__upload" @click="openImportForm" v-if="isZhAdmin">
          <i class="instructor-icons__upload__icon"></i>
          导入线上营学员成绩
        </span>
        <span class="instructor-icons__edit" @click="openImportManage()" v-if="hasImportManageOper">
          <i class="instructor-icons__edit__icon"></i>
          导入管理
        </span>
        <span class="instructor-icons__add" @click="openReportingDelay()">
          <i class="instructor-icons__add__icon"></i>
          报备延期参训
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
        :page-sizes="[10, 20, 100]"
        @selection-change="selectDataList"
        v-loading="getLoadingStatus('LOADING_NEW_STAFF_TRAINING')"
        ref="tablePaginationRef">
         <el-table-column slot="actionDesc" label="关键行为" width="150">
          <template slot-scope="scope">
            <!-- 判断条件变更：叁训状态和模板导入状态都显示（evaIsClass 不为空） -->
            <CellToolTip
              :data-info="scope.row.actionList || []" 
              :columns="columnCellToolTip"
              :cell-content="scope.row.evaIsClass !=='' ? '详情' : ''">
              <!-- :cell-content="scope.row.classId ? '详情0' : ''"> -->
            </CellToolTip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="158px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active mr10" @click="gotoDetailPage(scope.row, 'view')">查看</span>
              <span v-if="scope.row.onlineStatus === NOT_PASS_ONLINE" class="item active mr10" @click="showUploadScoreModel(scope.row)">补考成绩上传</span>
              <span v-if="scope.row.onlineStatus === NOT_PASS_ONLINE && isZhAdmin && scope.row.picUdmpStr" class="item active" @click="showAuditingScoreModel(scope.row)">补考成绩审核</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量导入弹框 -->
    <ImportModel
      :show="importScoreFormShow"
      :faildColumns="importScoreFaildColumns"
      :importFetchFn="fetchImportBatchTrainingScore"
      :faildExportFetchFn="fetchExportFailTrainingScore"
      templateCode="TRAINING_MANAGE_SCORE_ADD_BATCH"
      @showChange="importScoreFormShow = $event"
      @comfirm="comfirmImportScoreForm"
    ></ImportModel>
    <!-- 导入学员评价 -->
    <gc-model title="导入学员评价" :visible="importFormShow" width="700px"
      @close="closeImportForm" 
      @cancel="closeImportForm" 
      @comfirm="comfirmImportForm">
      <el-tabs v-model="importActiveNavType" @tab-click="handleImportTypeChange">
        <el-tab-pane label="通过培训班导入" name="training"></el-tab-pane>
        <el-tab-pane label="通过模板导入" name="template"></el-tab-pane>
      </el-tabs>
      <div class="import-type-training-wrapper" v-show="importActiveNavType === 'training'">
        <p class="mb20 gray-desc">备注：请关联已结训的培训班ID，系统会自动导入该培训班中的学员评价</p>
        <el-form :model="importForm" :rules="importFormRules" inline ref="importFormRef">
          <el-form-item label="培训项目" prop="classId">
             <gc-select
                class="w-494"
                filterable
                remote
                placeholder="请输入培训班项目ID"
                v-model="importForm.classId"
                :options="classOptions"
                :remote-method="getCompleteOptions"
                :loading="classLoading"
              ></gc-select>
            <p class="red-desc"> ( * 仅支持关联已结训的培训班项目 )</p>
          </el-form-item>
        </el-form>
      </div>
    </gc-model>
    <!-- 通过模板导入学员 -->
    <!-- 批量导入弹框 -->
    <ImportModel
      :show="isShowTemplateImportDialog"
      :faildColumns="templateImportFaildColumns"
      :importFetchFn="fetchImportBatchTemplateEvaluate"
      :faildExportFetchFn="fetchExportFailTemplateEvaluate"
      templateCode="XR_TEMPLATE_EVALUATE"
      @showChange="isShowTemplateImportDialog = $event"
      @comfirm="templateImportComfirm"
    ></ImportModel>
    <!-- 导入管理弹框 -->
    <gc-model title="导入管理" :visible="importManageShow" width="700px" top="5vh"
      cancelText=""
      comfirmText="关闭"
      @close="closeImportManage" 
      @comfirm="importManageShow = false">
      <div class="between mb10">
        <div>
          <el-input class="w200 ml10" placeholder="培训项目ID或者名称" 
            v-model.trim="importManageForm.classId" 
            @keydown.enter="queryTrainList"
            clearable ref="searchUmidRef" />
          <el-button type="primary" class="button-60-h30 ml20" @click="getTrainList" >查询</el-button>
          <el-button class="button-60-h30 ml20" @click="resetTrainList">重置</el-button>
        </div>
      </div>
      <table-pagination
        :page-sizes="[5, 10, 20]"
        :list="importManageColumnList"
        :tableList="importManageDataList"
        :queryForm="importManageForm"
        :getList="getTrainList"
        v-loading="getLoadingStatus('LOADING_TRAINING_CLASS')"
        ref="importManageTableRef">
        <el-table-column label="操作" width="105px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active mr10" @click="deleteImportRow(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </gc-model>
    <!-- 报备延期参训 -->
    <gc-model title="报备延期参训" :visible="reportingDelayShow" width="800px"
      comfirmText="提交审批"
      :comfirmLoading="reportingDelaySubmiting"
      @close="reportingDelayShow = false" 
      @cancel="reportingDelayShow = false" 
      @comfirm="comfirmReportingDelay">
      <el-form ref="reportingDelayFormRef" :model="reportingDelayForm" :rules="reportingDelayRules" inline label-width="100px">
        <el-form-item label="延期参训学员" class="delay-user-form-item">
          <div>
            <span class="um-tag" v-for="(item,i) in selectedList" :key="i" >{{item.umName}} ({{item.umId}})</span>
          </div>
          <p>( 共{{selectedList.length}}人 )</p>
        </el-form-item>
        <el-form-item label="延期参训原因" prop="applyReason">
          <el-input 
            class="w-494"
            v-model="reportingDelayForm.applyReason"
            placeholder="请说明学员需要延期参训的原因"
            type="textarea" 
            rows="3" />
        </el-form-item>
        <el-form-item label="预计参训时间" prop="delayDate">
          <el-date-picker
            class="w-300"
            v-model="reportingDelayForm.delayDate" 
            type="date"
            placeholder="选择日期"
            :clearable="true"
            value-format="yyyy-MM-dd" />
          <span class="red-desc ml10">备注：审批通过后，学员参训的逾期日期会更新为此日期</span>
        </el-form-item>
        <el-form-item label="机构HRD" prop="hrdInfo">
          <el-autocomplete
            class="w-300"
            value-key="label"
            placeholder="请输入UM号"
            :trigger-on-focus="false"
            v-model="reportingDelayForm.hrdInfo"
            :fetch-suggestions="fetchAutoCompleteUser"
            @select="selectAutoCompleteUser($event)"
            ref="umInfoRef"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
    </gc-model>
    <!-- 上传补考成绩 -->
    <UploadScoreModel
      :show.sync="uploadScoreShow"
      :id="uploadScoreId"
      @comfirm="comfirmUploadScore"
      :title="uploadScoreTitle"
      :disabled="uploadScoreDisabled"
    ></UploadScoreModel>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, reactive, computed } from 'vue'
import { filterBusiType, customHint, tableSelectionChange, CopyObj, addAllowKeepAlive } from '@/util/utils'
import { Message } from 'element-ui'
import { usePageList } from '@/hooks/usePageList'
import { useTable } from '@/hooks/useTable'
import store from '@/store'
import { TRAINING_TYPE_OPTIONS } from '@/views/Establish/enum'
import { 
  OVERDUE_STATUS_OPTIONS, OVERDUE_STATUS_YYQ, 
  TRAINING_STATUS_OPTIONS, IS_LEAVED_OPTIONS,
  ONLINE_TG_STATUS_OPTIONS, ONLINE_TYPE_OPTIONS,
  RECRUIT_TYPE_OPTIONS,
  NOT_PASS_ONLINE,
  ONLINERESITSTATUS_OPTIONS
} from '../enum'
import { ROLE_CODE, yesOrNoMap } from '@/util/constants'
import UploadScoreModel from '../components/UploadScoreModel.vue'
import CellToolTip from '@/components/cellTooltip/index'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'
import ImportModel from '@/components/upload/ImportModel'
import { useRecruitQryParam } from '../hooks/useNewPeopleTraining'
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
  fetchExportFailTrainingScore,
  fetchSaveOnlineResitScore,
  fetchVerifyOnlineResitScore,
  fetchHandleTemplateEvaluate,
  fetchExportFailTemplateEvaluate,
  fetchImportBatchTemplateEvaluate
} from '@/fetch/newPeopleTrainingManagement'
import { useRouter, useRoute } from '@/router'
import { lastDay } from '@/util/utils'
import { ONLINE_TYPE_ZSZL, ONLINE_TYPE_ZY, SCHOOL_RERUITEMNT, SOCIAL_RERUITEMNT } from '@/views/PlanManagement/enum'
import { fetchCheckTrainingClass } from '@/fetch/tanlents'

const router = useRouter()

const _TRAINING_TYPE_OPTIONS = computed(() => TRAINING_TYPE_OPTIONS.filter(m => m.type === 'xxy'))

const baseQueryForm = {
  classId: '', // 培训班Id
  umId: '',
  annual: '', // 年度
  orgIds: [],
  type: '',
  fosterTypes: [],
  onlineStatusList: [],
  onlineResitStatusList: [],
  trainingStatus: '',
  overdueStatus: '',
  isLeaved: '',
  entryDateStart: '',
  entryDateEnd: ''
}

const queryFormRules = {
  annual: [{ required: true, trigger: 'change', message: '请选择年度' }],
}

const {
  tableFilterSetting,
  getLoadingStatus,
  queryForm,
  dataList,
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
  apiDataList: fetchListNewStaffTraining,
  apiExportDataList: fetchExportNewStaffTraining,
  queryFormFormat: (params) => {
    params.entryDateEnd = lastDay(params.entryDateEnd)
    return params
  }
})

const { startPickerOptions, endPickerOptions } = dataRangeRules('entryDateStart', 'entryDateEnd')

const columnList = [
  { type: 'selection', fixed: 'left'},
  // { type: 'index', label: '序号', width: '64', fixed: 'left' },
  { label: '年度', width: '60', prop: 'annual', fixed: 'left' },
  { label: '期次', width: '60', prop: 'recruitNum', fixed: 'left' },
  { label: '线上营类型', prop: 'onlineType', width: 120, fixed: 'left',
    ...tableFilterSetting('onlineTypes', ONLINE_TYPE_OPTIONS, true) },
  { label: '机构', width: '120', prop: 'orgName', fixed: 'left' },
  { label: '姓名', width: '80', prop: 'umName', fixed: 'left' },
  { label: 'UM号', width: '150', prop: 'umId' },
  { label: '条线', width: '120', prop: 'blgStripLineName' },
  { label: '能力层级', prop: 'capLevel', type: 'setWidth', width: 100 },
  { label: '部门', prop: 'deptName', type: 'setWidth', width: 250 },
  { label: '岗位', prop: 'positionName', type: 'setWidth', width: 250 },
  { label: '内外勤', prop: 'inLegworkDesc', width: 100 },
  { label: '职位主序列', prop: 'jobSeqIdDesc', width: 100 },
  { label: '入职时间', prop: 'entryDate', width: 100 },
  { label: '性别', prop: 'sexDesc', width: 60 },
  { label: '年龄', prop: 'age', width: 60 },
  { label: '类别', prop: 'typeDesc', width: 90, 
    ...tableFilterSetting('type', RECRUIT_TYPE_OPTIONS, false)
  },
  { label: '在职状态', prop: 'isLeavedName', width: 100,
    ...tableFilterSetting('isLeaved', IS_LEAVED_OPTIONS, false)
  },
  { label: '线上营成绩', prop: 'onlineScore', width: 100 },
  { label: '线上营通过状态', prop: 'onlineStatus', width: 120,
    ...tableFilterSetting('onlineStatusList', ONLINE_TG_STATUS_OPTIONS, true) },
  { label: '线上营补考状态', prop: 'onlineResitStatusDesc', width: 120,
    ...tableFilterSetting('onlineResitStatusList', ONLINERESITSTATUS_OPTIONS, true) },
  { label: '线上营学习情况点评', width: '200', prop: 'onlineStudyEva' },
  { label: '线上营团建表现点评', width: '200', prop: 'onlineLeagueConstructionEva' },
  { label: '线下营参训状态', prop: 'trainingStatusDesc', width: 120,
    ...tableFilterSetting('trainingStatus', TRAINING_STATUS_OPTIONS, false)
  },
  { label: '线下营参训日期', prop: 'trainingDate', width: 120 },
  { label: '线下营逾期状态', prop: 'overdueStatusDesc', width: 120,
    ...tableFilterSetting('overdueStatus', OVERDUE_STATUS_OPTIONS, false)
  },
  { label: '线下营逾期日期', prop: 'overdueDate', width: 120 },
  { label: '延期报备审批状态', prop: 'applyStatusName', width: 120 },
  { 
    label: '是否培训班', 
    prop: 'evaIsClassDesc', 
    width: 120,
    ...tableFilterSetting('evaIsClassList', yesOrNoMap)
  },
  { label: '培训项目ID', prop: 'classId', width: 100 },
  { label: '培训项目名称', prop: 'className', width: 100 },
  { label: '培养类型', prop: 'fosterTypeDesc', width: 100,
    ...tableFilterSetting('fosterTypes', _TRAINING_TYPE_OPTIONS.value)
  },
  { label: '大局观', width: '100', prop: 'overallView' },
  { label: '开创性', width: '100', prop: 'pioneer' },
  { label: '狼性', width: '100', prop: 'wolfNature' },
  { label: '创新力', width: '100', prop: 'innovation' },
  { label: '执行力', width: '100', prop: 'executivePower' },
  { label: '影响力', width: '100', prop: 'effect' },
  { label: '协同力', width: '100', prop: 'synergy' },
  { label: '学习力', width: '100', prop: 'learningAbility' },
  { label: '关键行为', slot: 'actionDesc' },
  { label: '突出特征', width: '200', prop: 'salientFeature' },
  { label: '其他信息', width: '200', prop: 'otherInformation' },
  { label: '更新人', width: '100', prop: 'updatedByName' },
  { label: '更新时间', width: '150', prop: 'updatedDate' },
]

const columnCellToolTip = [
  { label: '指标', prop: 'targetName', 'show-overflow-tooltip': false, type: 'setWidth', width: '100px' },
  { label: '关键行为', prop: 'action', 'show-overflow-tooltip': false },
]
const querFormRef = ref(null)
const dropdownTreeRef = ref(null)
function _queryDataList () {
  querFormRef.value.validate(valid => {
    if (valid) {
      queryDataList()
    }
  })
}
function _resetDataList () {
  querFormRef.value?.clearValidate()
  resetDataList(false)
  dropdownTreeRef.value?.setValue(queryForm.orgIds)
  tablePaginationRef.value.resetFilters()
}

const { 
  initRecruitQryParam,
  isZhAdmin,
  orgList,
  orgOneNode,
  annualList,
 } = useRecruitQryParam(queryForm)

// ============================== 进入详情 ============================== 
async function gotoDetailPage (row, type) {
  // 获取当前已经关联过的机构
  const res = await fetchNewStaffTrainingDetail({ id: row.id })
  // 跳转到表单页面
  addAllowKeepAlive('/OfflineOperationDetail')
  router.push({
    name: '查看学员培养评价',
    params: {
      formType: type,
      row: res
    }
  })
}
// ============================== 导入学员评价 ==============================
const importFormShow = ref(false)
const importForm = reactive({
  classId: '',
})
const importFormRules = {
  classId: [{ required: true, message: '请输入培训项目', trigger: 'change' }]
}

// type importActiveNavType = 'training' | 'template'
const importActiveNavType = ref('training')
const isShowTemplateImportDialog = ref(false)
const handleImportTypeChange = ({ name: type }) => {
  if(type === 'template') {
    isShowTemplateImportDialog.value = true
  }
}
const templateImportComfirm = async (data) => {
  // 关闭导入窗口
  isShowTemplateImportDialog.value = false
  await fetchHandleTemplateEvaluate({ successList: data.successList, tip: 'Y' })
  Message.success('导入成功')
  // 关闭导入学员评价窗口
  closeImportForm()
}

const templateImportFaildColumns = ref([
  { type: 'index', label: '序号' }, 
  { label: 'UM', prop: 'umId' },
  { label: '失败原因', prop: 'msg' }
])


const classOptions = ref([])
const classLoading = ref(false)
function getCompleteOptions (value) {
  if (value !== '') {
    classLoading.value = true
    const data = { classId: value }
    fetchListClassByClassId(data)
    .then(resData => {
      classLoading.value = false
      resData.forEach((v) => {
        v.value = v.classId
        v.label = `${v.classId}(${v.className})`
      })
      classOptions.value = resData
    })
  } else {
    classOptions.value = [];
  }
}
const closeImportForm = () => {
  importFormShow.value = false
  importForm.classId = ''
  classOptions.value = []
  nextTick(() => {
    importFormRef.value.clearValidate()
  })
}


// 检查是否有学员重复导入的情况
const validateMultiStutend = (repeatUms) => {
  return new Promise((resolve, reject) => {
    customHint(`${repeatUms.map(row => `${row.umName}(${row.umId})`).join(', ')}已导入学员评价，请确认是保留原来的学员评价还是覆盖原来的学员评价`, '提示', '保留原评价', true, '覆盖原评价').then(res => {
      return resolve('comfirm')
    }).catch(res => {
      return resolve('cancel')
    })
  })
}

const importFormRef = ref(null)
const comfirmImportForm = () => {
  importFormRef.value?.validate(async valid => {
    if (valid) {
      const params = { classId: importForm.classId }
      // 第一次是查询重复UM
      const { repeatUms} = await fetchCheckTrainingClass(params)
      let selectResult = ''
      if (repeatUms && repeatUms.length) {
        selectResult = await validateMultiStutend(repeatUms)  
      }
      // 第二次才是正式提交数据
      const total = await fetchAddTrainingClass({...params, tip: selectResult === 'comfirm'?'Y':'N'})
      _queryDataList()
      closeImportForm()
      Message.success(`保存成功，共导入 ${total} 位学员的培养评价记录`)
    }
  })
}

// ============================== 导入学员成绩 ==============================
const importScoreFormShow = ref(false)
// 导入失败数据列表
const importScoreFaildColumns = [
  { label: 'UM号', prop: 'umId', width: '150px' },
  { label: '成绩', prop: 'onlineScore', width: '90px' },
  { label: '通过状态', prop: 'onlineStatus', width: '90px' },
  { label: '失败原因', prop: 'msg', width: '200px' }
]
// 打开导入学习评价弹窗
const handleShowImportInstructor = () => {
  importFormShow.value = true
  importActiveNavType.value = 'training'
}
// 打开导入弹框
function openImportForm () {
  importScoreFormShow.value = true
}
// 导入确认
async function comfirmImportScoreForm (data) {
  console.log(data)
  await fetchHandleTrainingScore({ successList: data.successList, tip: 'Y' })
    importFormShow.value = false
    queryDataList()
    Message.success('新增成功！')
}
// ============================== 导入管理 ==============================
// 是否为 超管
const isLSSuperAdmin = computed(() => store.state.userInfo.roleIds?.includes(ROLE_CODE.SUPER_ADAMIN) || false)
// 是否显示“导入管理”
// const hasImportManageOper = computed(() => isZhAdmin.value || isLSSuperAdmin.value )
const hasImportManageOper = computed(() => isZhAdmin.value || isLSSuperAdmin.value )
const importManageShow = ref(false)
const importManageForm = reactive({
  classId: '',
  currPage: 1,
  pageSize: 5,
  total: 0
})
const importManageColumnList = [
  { type: 'index', label: '序号' },
  { label: '培训项目ID', prop: 'classId', width: '100px' },
  { label: '培训项目名称', prop: 'className', width: '350px' },
]
const importManageDataList = ref([])

function openImportManage (row, type) {
  importManageDataList.value = []
  importManageShow.value = true
  queryTrainList()
}
function closeImportManage () {
  importManageShow.value = false
  _queryDataList()
}
function queryTrainList () {
  importManageForm.currPage = 1
  getTrainList()
}
// 获取导入记录
function getTrainList () {
  fetchListTrainingClass(importManageForm)
  .then(resData => {
    importManageForm.total = resData.total
    importManageDataList.value = resData.list
  })
}
function resetTrainList () {
  importManageForm.classId = ''
  queryTrainList()
}
// 删除记录
async function deleteImportRow (row) {
  customHint('确定要删除该培训班吗？', '提示', '取消')
  .then(async () => {
    const params = { classId: row.classId }
    await fetchDeleteTrainingClass(params)
    getTrainList()
    Message.success('删除成功！')
  })
}

// ============================== 报备延期参训 ==============================

const reportingDelayShow = ref(false)
const reportingDelaySubmiting = ref(false)
const reportingDelayTitle = '报备延期参训'
const reportingDelayFormBase = {
  umInfos: [],
  umIds: '', // 延期参训学员
  applyReason: '', // 延期参训原因
  delayDate: '', // 预计参训日期
  hrdInfo: '',
  hrdUm: '', // 机构HRD
  hrdUmName: ''
}
const reportingDelayForm = ref(CopyObj(reportingDelayFormBase))
const reportingDelayFormRef = ref(null)
const reportingDelayRules = {
  applyReason: [{ required: true, message: '请说明学员需要延期参训的原因', trigger: 'blur' }],
  delayDate: [{ required: true, message: '请选择预计参训日期', trigger: 'change' }],
  hrdInfo: [{ required: true, message: '请选择您所属机构的人力资源经理(HRD)', trigger: 'change' }]
}
function openReportingDelay (row, type) {
  if (!selectedList.value.length) {
    return Message.warning('请至少选择一条记录')
  }
  if (selectedList.value.some(m => m.overdueStatus === OVERDUE_STATUS_YYQ)) {
    return Message.warning('已逾期学员不允许报备延期参训')
  }

  // 过滤条件: 战神/战狼类型， 或者战英并且为校招的类型
  const noAllowList = selectedList.value.filter(row => row.onlineTypeCode === ONLINE_TYPE_ZSZL || (row.onlineTypeCode === ONLINE_TYPE_ZY && row.type === SCHOOL_RERUITEMNT))
  if(noAllowList.length) {
    return Message.warning(`战神/战狼学员及战英校招学员无需报备延期参训: ${noAllowList.map(row => `${row.umName}(${row.umId})`).join(', ')}`)
  }
  
  reportingDelayShow.value = true
  reportingDelayForm.value = CopyObj(reportingDelayFormBase)
  nextTick(() => {
    reportingDelayFormRef.value?.clearValidate()
  })
}
const fetchAutoCompleteUser = (queryString, cb) => {
  const data = { empName: queryString }
  fetchUserInfos({ data }).then(resData => {
    resData.list.forEach((v) => {
      v.label = `${v.empName} (${v.umId})`
    })
    cb(resData.list)
  })
}
const selectAutoCompleteUser = (v) => {
  reportingDelayForm.value.hrdUm = v.umId
  reportingDelayForm.value.hrdUmName = v.empName
  reportingDelayForm.value.hrdInfo = `${v.empName} (${v.umId})`
}
function comfirmReportingDelay () {
  reportingDelayFormRef.value.validate(async valid => {
    if (valid) {
      reportingDelaySubmiting.value = true
      try { 
        const applyChainList = await fetchListDelayApplyChain({ hrdUm: reportingDelayForm.value.hrdUm })
        if (applyChainList.length) {
          const applyChainListArr = applyChainList.map((m, i) => {
            if (i === 0) {
              return `${m.chainEmpName} (${m.chainUmId})`
            } else {
              return ` ${m.approveFlag} ${m.chainEmpName} (${m.chainUmId})`
            }
          })
          const applyChainListStr = applyChainListArr.join('')
          await customHint(`审批链：${applyChainListStr}`, '提示', '取消', true, '确定审批')
          const params = {
            umIds: selectedList.value.map(m => m.umId),
            applyReason: reportingDelayForm.value.applyReason,
            delayDate: reportingDelayForm.value.delayDate,
            hrdUm: reportingDelayForm.value.hrdUm
          }
          await fetchSaveNewStaffDelayApply(params)
          reportingDelayShow.value = false
          _queryDataList()
        }
        reportingDelaySubmiting.value = false
      } catch (_) {
        reportingDelaySubmiting.value = false
      }
    }
  })
}
// ============================== 导入学员成绩 ==============================
const uploadScoreShow = ref(false)
const uploadScoreId = ref(0)
const uploadScoreModelType = ref('')
const uploadScoreTitle = ref('')
const uploadScoreDisabled = ref(false)
const showUploadScoreModel = (row) => {
  uploadScoreId.value = row.id
  uploadScoreModelType.value = 'upload'
  uploadScoreDisabled.value = false
  uploadScoreTitle.value = '上传补考成绩截图'
  uploadScoreShow.value = true
}
const showAuditingScoreModel = (row) => {
  uploadScoreId.value = row.id
  uploadScoreModelType.value = 'auditing'
  uploadScoreTitle.value = '补考成绩审核'
  uploadScoreDisabled.value = true
  uploadScoreShow.value = true
}
const comfirmUploadScore = async (fileDataList, scoreInfoForm) => {
  if(uploadScoreTitle.value === '补考成绩审核') {
    await fetchVerifyOnlineResitScore({data: {id: uploadScoreId.value , onlineResitStatus: scoreInfoForm.onlineResitStatus}})
    Message.success('操作成功！')
    _queryDataList()
  } else {
    await fetchSaveOnlineResitScore({data: {id: uploadScoreId.value , picList: fileDataList} })
    Message.success('上传成功！')
    _queryDataList()
  }
}
// ============================== 初始化 ==============================
onMounted(async () => {
  await initRecruitQryParam(true)
  _queryDataList()
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