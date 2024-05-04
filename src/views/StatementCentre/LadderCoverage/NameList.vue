<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" :rules="queryFormRules" ref="queryFormRef" inline>
        <el-form-item label="岗位" prop="channelType">
          <el-cascader
            ref="cascaderArr"
            class="w-200"
            clearable
            v-model="queryForm.jobInfo"
            @change="channelTypesChange"
            :options="channelTypes"
            :props="cascaderProps" 
            placeholder="请选择要查询的岗位" 
          />
        </el-form-item>
        <el-form-item label="员工机构" prop="orgIds">
          <gc-institution
            v-model="queryForm.orgIds"
            :leftShow="false"
            :default-show="true"
            :org-url="APIAllTree" 
            :fetch-params="{ busiType: 'LS' }"
            @change="queryForm.orgName = $event"
            busiType="LS"
            ref="institutionRef"
          />
        </el-form-item>
        <el-form-item label="员工信息">
          <gc-input placeholder="员工编号/员工姓名" v-model.trim="queryForm.userInfo"></gc-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="入岗日期">
            <el-date-picker
              class="w-120"
              v-model="queryForm.startDate"
              type="date"
              placeholder="选择日期"
              :clearable="true"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="至" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endDate"
              type="date"
              placeholder="选择日期"
              :clearable="true"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form-item>
        <div class="buttons">
          <el-button @click="_queryDataList" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="_resetDataList" class="button-w80-h30">重置</el-button>
          <el-button v-show="showOperBtn" @click="_openImportForm" class="button-w80-h30" type="primary">批量导入</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10" v-show="queryForm.keyJobs">
      <div>
        <el-radio-group v-model="queryForm.trainType" size="small">
          <el-radio-button v-for="item in tabs" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="menu-wapper">
        <div class="menu-left">
          <div class="mt10" v-show="isSGTab">注：上岗培训为线上学习，所有入职员工均需参加，故上岗培训应参训名单根据人管系统信息自动匹配</div>
        </div>
        <div class="menu-right">
          <span v-show="showOperBtn" class="instructor-icons__add" @click="openBaseForm()"><i class="instructor-icons__add__icon"></i>新增</span>
          <span v-show="showOperBtn" class="instructor-icons__del" @click="deleteDataList"><i class="instructor-icons__del__icon"></i>删除</span>
          <span class="instructor-icons__upload" @click="exportDataList()"><i class="instructor-icons__download__icon"></i>导出</span>
        </div>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        @selection-change="selectDataList"
        v-loading="getLoadingStatus('LOADING_COVERAGE_USER')"
        ref="tablePaginationRef">
        <el-table-column label="操作" width="105px" fixed="right" v-if="showOperBtn">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="openBaseForm(scope.row)">编辑</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <div v-show="!queryForm.keyJobs" class="no_data">
      <img src="@/assets/images/no-data.png" alt="" />
      <p>请选择要查询的岗位</p>
    </div>
     <!-- 批量导入弹框 -->
    <ImportModel
      :show="importFormShow"
      :faildColumns="importFaildColumns"
      :uploadParams="uploadParams"
      :importFetchFn="fetchImportBatchLadderCoverUser"
      :faildExportFetchFn="fetchExportFailUser"
      templateCode="LADDER_COVERAGE_USER_ADD_BRACH"
      @showChange="importFormShow = $event"
      @comfirm="comfirmImportForm"
    />
    <!-- 批量新增弹框 -->
    <gc-model :title="baseFormTitle" :visible="baseFormShow" width="650px"
      @close="baseFormShow = false" 
      @cancel="baseFormShow = false" 
      @comfirm="comfirmBaseForm">
      <el-form ref="baseFormRef" :model="baseInfoForm" :rules="baseInfoFormRules" label-width="120px">
        <el-form-item label="当前关键岗位" prop="deptName">
          <span class="f-bold">{{pathLabels.join('/')}}</span>
        </el-form-item>
        <el-form-item label="当前培训类型" prop="deptName">
          <span class="f-bold">{{ baseInfoForm.trainLabel }}</span>
        </el-form-item>
        <el-form-item label="UM号/姓名" prop="umInfo" >
          <el-autocomplete
            class="w-full"
            value-key="label"
            placeholder="请输入UM号/姓名"
            :trigger-on-focus="false"
            v-model="baseInfoForm.umInfo"
            :fetch-suggestions="querySearch"
            @select="personSelect($event)"
            ref="umInfoRef"
          />
        </el-form-item>
        <el-form-item label="所属机构" prop="deptName">
          <el-input class="input-width" v-model="baseInfoForm.orgName" disabled></el-input> 
        </el-form-item>
        <el-form-item label="岗位名称" prop="position">
          <el-input class="input-width" v-model="baseInfoForm.postDesc" disabled /> 
        </el-form-item>
        <el-form-item label="在职状态" prop="position">
          <el-input class="input-width" v-model="baseInfoForm.leavedDesc" disabled /> 
        </el-form-item>
        <el-form-item label="入岗日期" prop="dateJob">
          <el-date-picker
            class="w-120"
            v-model="baseInfoForm.dateJob"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </el-form>
    </gc-model>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, nextTick, computed } from 'vue'
import { 
  fetchListCoverUser, 
  fetchExportCoverUser,
  fetchDeleteCoverUser,
  fetchImportBatchLadderCoverUser,
  fetchExportFailUser,
  fetchSaveCoverUserByIdBatch,
  fetchFindCoverUser,
  fetchSaveOrUpdateCoverUser,
  fetchFindScopeAuthority 
} from '@/fetch/statementCentre'
import { useLadderCoverage } from '../hooks/useLadderCoverage'
import { usePostCascader } from '../hooks/usePostCascader'
import { getLoadingStatus, CopyObj, customHint } from '@/util/utils'
import ImportModel from '@/components/upload/ImportModel'
import { useImportModel } from '@/components/upload/hooks/useImportModel'
import { fetchUserInfos, APIAllTree } from '@/fetch/public'
import { USER_LEAVED_OPTIONS, USER_REQUIRE_OPTIONS, LADDER_COVERAGE_TABS_SG } from '../enum'
import { Message } from 'element-ui'

const scopeAuthorityArr = ref([])
const baseQueryForm = {
  jobInfo: [],
  channelType: '',
  keyJobs: '',
  keyJobsName: '',

  orgIds: [],
  orgId: '',
  orgName: '',

  startDate: '', // 入岗日期开始：yyyy-MM-dd
  endDate: '', // 入岗日期结束：yyyy-MM-dd

  userInfo: '',
  leaved: '',
  require: '',
  trainType: LADDER_COVERAGE_TABS_SG,
  currPage: 1,
  pageSize: 10,
  total: 0,
}
const {
  tableFilterSetting,
  startPickerOptions,
  endPickerOptions,
  institutionRef,
  orgIdsFinish,
  queryForm,
  dataList,
  fetchDataList,
  queryDataList,
  resetDataList,
  exportDataList,
} = useLadderCoverage({
  baseQueryForm,
  apiDataList: fetchListCoverUser,
  apiExportDataList: fetchExportCoverUser,
  queryFormFormat: _formatSendParams,
  startField: 'startDate',
  endField: 'endDate',
})

// 搜索框规则
const queryFormRules = {
  channelType: [{ required: true, message: '请选择岗位', trigger: 'change' }],
}
watch(() => queryForm.value.keyJobs, (newV) => {
  if (newV) {
    queryDataList()
  }
})

// ========================= 搜索框 =========================
const emits = defineEmits(['update:activeTab'])
const props = defineProps({
  activeTab: String,
  activeTabOne: String,
  tabs: {
    type: Array,
    default: () => []
  },
  channelTypes: {
    type: Array,
    default: () => []
  }
})
watch(() => props.activeTabOne, async (newV) => {
  console.log('watch-activeTabOne', newV)
  if (newV === 'NameList') {
    const res = await fetchFindScopeAuthority()
    if (res.scopeAuthority) {
      scopeAuthorityArr.value = res?.scopeAuthority?.split(',') || []
    } else {
      scopeAuthorityArr.value = []
    }
  }
}, { immediate: true })

watch(() => queryForm.value.trainType, async (newV, oldV) => {
  emits('update:activeTab', newV)

  queryDataList()
})

// 格式化发送数据
function _formatSendParams(params) {
  const data = CopyObj(params)
  data.orgId = data.orgIds?.[1]
  Reflect.deleteProperty(data, 'orgName')
  Reflect.deleteProperty(data, 'orgIds')
  Reflect.deleteProperty(data, 'jobInfo')
  if (Object.hasOwnProperty.call(data, 'startDate') && !data.startDate) {
    Reflect.deleteProperty(data, 'startDate')
  }
  if (Object.hasOwnProperty.call(data, 'endDate') && !data.endDate) {
    Reflect.deleteProperty(data, 'endDate')
  }
  return data
}

// 岗位选择框 - 相关变量
const {
  pathLabels,
  cascaderProps,
  // channelTypes,
  cascaderArr,
  channelTypesChange
} = usePostCascader({
  queryForm,
  fetchParams: { isLadder:"Y" }
})

// 列表相关数据
const ggColumnList = [
  { type: 'selection' },
  { width: '120', label: 'UM号', prop: 'umId' },
  { width: '120', label: '姓名', prop: 'empName' },
  { width: '250', label: '所属机构', prop: 'orgName' },
  { width: '250', label: '岗位名称', prop: 'postDesc' },
  { width: '120', label: '入岗日期', prop: 'dateJob' },
  { width: '120', label: '在职状态', prop: 'isLeavedDesc',
    ...tableFilterSetting('leaved', USER_LEAVED_OPTIONS, false) 
  },
  { width: '120', label: '参训状态', prop: 'requireDesc',
    ...tableFilterSetting('require', USER_REQUIRE_OPTIONS, false) 
  },
]

const sgColumnList = [
  { width: '120', label: '人管岗位名称', prop: 'pmsJobName' },
  { width: '150', label: '人管渠道号_人员类型', prop: 'channelIdUserType' },
]
const qtColumnList = [
  { width: '120', label: '参训培训班编号', prop: 'classId' },
  { width: '120', label: '参训培训班名称', prop: 'className' },
  { width: '120', label: '名单操作人', prop: 'operName' },
  { width: '120', label: '名单操作时间', prop: 'operTime' },
]
const columnList = computed(() => {
  if (queryForm.value.trainType === LADDER_COVERAGE_TABS_SG) {
    return [...ggColumnList, ...sgColumnList]
  } else {
    return [...ggColumnList, ...qtColumnList]
  }
})

// 是否为上岗Tab
const isSGTab = computed(() => {
  return queryForm.value.trainType === LADDER_COVERAGE_TABS_SG 
})
// 是否显示操作按钮
const showOperBtn = computed(() => {
  return !isSGTab.value && scopeAuthorityArr.value.includes(queryForm.value.channelType)
})

const queryFormRef = ref(null)
const tablePaginationRef = ref(null)
function _queryDataList () {
  console.log('查询条件：', queryForm.value)
  queryFormRef.value.validate(valid => {
    if (valid) {
      queryDataList()
    }
  })
}
function _resetDataList () {
  queryForm.value.jobInfo = []
  queryForm.value.keyJobs = ''
  queryForm.value.keyJobsName = ''
  queryForm.value.userInfo = ''
  queryForm.value.orgIds = []
  queryForm.value.orgId = ''
  queryForm.value.orgName = ''
  queryForm.value.startDate = ''
  queryForm.value.endDate = ''
  queryForm.value.leaved = ''
  queryForm.value.require = ''
  institutionRef.value.createTreeData()
  tablePaginationRef.value.resetFilters()
  queryFormRef.value.clearValidate()
}
const selectedList = ref([])
function selectDataList (data) {
  selectedList.value = data
}
// 删除
function deleteDataList () {
  if (selectedList.value?.length) {
    customHint('确认要删除此记录吗？', '提示', '关闭', false, '确认删除')
    .then(async res => {
      const umIdList = selectedList.value.map(m => m.umId)
      const params = {
        umIdList,
        trainType: queryForm.value.trainType,
        keyJobs: queryForm.value.keyJobs
      }
      const resDel = await fetchDeleteCoverUser(params)
      queryDataList()
      Message.success('删除成功！')
    })
  } else {
    Message.warning('请选择要删除的记录')
  }
}

// ============================== 导入 ==============================

// 导入失败数据列表
const importFaildColumns = [
  { label: '管理员UM号', prop: 'umId', width: '120px' },
  { label: '培训类型', prop: 'trainTypeDesc', width: '150px' },
  { label: '入岗时间', prop: 'dateJob', width: '150px' },
  { label: '失败原因', prop: 'msg', width: '200px' }
]
const {
  importFormShow,
  openImportForm,
  comfirmImportForm
} = useImportModel({
  fetchSave: fetchSaveCoverUserByIdBatch,
  queryDataList
})
const uploadParams = ref({})
function _openImportForm () {
  if (!queryForm.value.keyJobs) {
    return Message.warning('请选择岗位')
  }
  const params = {
    trainType: queryForm.value.trainType,
    keyJobs: queryForm.value.keyJobs
  }
  uploadParams.value = params
  openImportForm()
}

// ============================== 新增 ==============================
const baseFormShow = ref(false)
const baseFormTitle = ref('')
const baseBaseInfo = {
  id: '',
  keyJobsName: '',
  keyJobsNamePath: '',
  umId: '',
  umName: '',
  umInfo: '',
  orgId: '',
  orgName: '',
  postId: '',
  postDesc: '', // 岗位名称
  leaved: '',
  leavedDesc: '',
  dateJob: '' // 入岗状态
}
const baseInfoForm = ref(CopyObj(baseBaseInfo))
const baseInfoFormRules = {
  umInfo: [{ required: true, message: '请选择入人员', trigger: 'change' }],
  dateJob: [{ required: true, message: '请选择入岗日期', trigger: 'blur' }]
}

const baseFormRef = ref(null)

function openBaseForm (row) {
  queryFormRef.value.validate(valid => {
    if (valid) {
      if (row) { // 编辑
        baseFormTitle.value = '编辑应参训名单'
        baseInfoForm.value.dateJob = row.dateJob
        personSelect(row)
      } else { // 新增
        baseFormTitle.value = '新增应参训名单'
        baseInfoForm.value = CopyObj(baseBaseInfo)
      }
      baseFormShow.value = true
      const trainTypeObj = props.tabs.find(m => m.value === queryForm.value.trainType)
      baseInfoForm.value.trainLabel = trainTypeObj.label
      nextTick(() => {
        baseFormRef.value?.clearValidate()
      })
    }
  })
}
const umInfoRef = ref(null)
function comfirmBaseForm () {
  baseFormRef.value.validate(async (valid) => {
    if (valid) {
      if (!baseInfoForm.value.umId){
        umInfoRef.value.focus()
        return Message.warning('请输入正确的UM号')
      } 
      const postData = {
        keyJobs: queryForm.value.keyJobs,
        trainType: queryForm.value.trainType,
        umId: baseInfoForm.value.umId,
        dateJob: baseInfoForm.value.dateJob,
      }
      if (baseInfoForm.value.id) {
        postData.id = baseInfoForm.value.id
      }
      await fetchSaveOrUpdateCoverUser(postData)
      baseFormShow.value = false
      queryDataList()
      Message.success('新增成功！')
    }
  })
}

function querySearch(queryString, cb) {
  const data = { empName: queryString, busiType: 'LS' }
  fetchUserInfos({ data }).then(resData => {
    resData.list.forEach((v) => {
      v.label = `${v.empName}(${v.umId})`
    })
    cb(resData.list)
  })
}

function personSelect (v) {
  baseInfoForm.value.umInfo = `${v.empName}(${v.umId})`
  baseInfoForm.value.umId = v.umId
  baseInfoForm.value.orgName = v.blgOrgName || v.orgName || ''
  baseInfoForm.value.postDesc = v.postDesc
  baseInfoForm.value.leavedDesc = v.leaved === 'Y' || v.isLeaved === 'Y' ? '离职': '在职'
}

</script>
<style lang="less" scoped>
.f-bold {
  font-weight: bold;
}
.menu-wapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .menu-right {
    margin-bottom: 0;
    margin-top: 10px;
    margin-right: 5px;
  }
}
.empty-wapper {
  padding: 180px;
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #bbb;
}

</style>