<template>
  <div class="student-recruitment">
    <el-card class="search-card mt10">
      <el-form :model="queryForm" :rules="queryFormRules" inline ref="querFormRef" label-width="50px">
        <el-form-item label="年度" prop="annual">
          <gc-select :options="annualList" v-model="queryForm.annual" @change="annualChangeHandle" :clearable="false" class="w-150" />
        </el-form-item>
        <el-form-item label="期次" prop="recruitNum">
          <gc-select :options="recruitNumList" v-model="queryForm.recruitNum" :clearable="false" class="w-150" />
        </el-form-item>
        <el-form-item label="机构" prop="orgIds">
           <DropdownZhOrg
            :style="{width: '250px'}"
            :search="true"
            :list="orgList"
            @change="orgIdChange"
            valueField="orgId"
            labelField='orgName'
            ref="dropdownTreeRef"
          ></DropdownZhOrg>
        </el-form-item>
        <el-form-item label="状态">
          <gc-select :options="statusList" v-model="queryForm.recruitState" class="w-150"></gc-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDatas">查询</el-button>
          <el-button @click="queryReset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span v-if="isZhAdmin" class="instructor-icons__add" @click="openCreateHandle">
          <i class="instructor-icons__add__icon"></i>
          新招募启动
        </span>
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :page-sizes="[10, 20, 100]"
        :getList="getList"
        @selection-change="selectionHandle"
        v-loading="getLoadingStatus('LOADING_LIST_RECRUIT')"
        ref="tablePagination"
      >
        <el-table-column slot="planFileName" prop="planFileName" label="方案附件" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <a :href="scope.row.planFileUrl" download class="active event-link">{{ scope.row.planFileName }}</a>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <gc-model :title="formTitle"
      :visible="formVisible"
      @close="formVisible = false"
      @cancel="formVisible = false"
      @comfirm="formComfirm">
      <el-form ref="studentRecruitmentRef" :rules="baseInfoFormRules" :model="baseInfoForm" label-width="100px" @submit.native.prevent>
        <el-form-item label="年度" prop="annual">
          <el-date-picker v-model="baseInfoForm.annual" type="year" :clearable="false" @change="formAnnualChangeHandle" value-format="yyyy"/>
          <!-- <el-input class="input-width" v-model="baseInfoForm.annual"></el-input> -->
        </el-form-item>
        <el-form-item label="期次" prop="recruitNum">
          <el-input-number v-model="baseInfoForm.recruitNum" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
        <el-form-item label="入职日期" prop="dateHireStart">
          <DateRange
            v-model="baseInfoForm"
            start-key="dateHireStart"
            end-key="dateHireEnd"
            popper-class="moreRecentLearning-picker"
            width="90px"
          ></DateRange>
        </el-form-item>
        
        <el-form-item label="截止时间" prop="cutoffDate">
          <el-date-picker
            v-model="baseInfoForm.cutoffDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间" 
            />
          <!-- <el-date-picker
            v-model="baseInfoForm.cutoffDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间" 
            /> -->
        </el-form-item>
        <el-form-item label="开营日期" prop="openDate">
          <el-date-picker
            class="rms-date-picker input-width"
            v-model="baseInfoForm.openDate"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择开营日期"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="邮件抄送人" prop="topicProgress">
          <el-button type="primary" @click="handleEmailSelect">选择邮件抄送人</el-button>
          <table-pagination
            row-key="umId"
            drop
            :list="emailUserColumns(false, true)"
            :tableList="baseInfoForm.copyUmList"
            :hidePagination="true"
            :queryForm="{}"
            ref="tablePagination"
            class="table-style mt10"
          >
            <el-table-column slot="dropContainer" label="" min-width="40">
              <template>
                <i class="el-icon-rank drop"></i>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <span class="active" @click="removeEmailUser(scope.row)">删除</span>
              </template>
            </el-table-column>
          </table-pagination>
        </el-form-item>
      </el-form>
    </gc-model>
    <SelectUserDialog
      title="选择邮件抄送人"
      :show.sync="isEmailSelectShow"
      @save="handleEmailSelectSave"
      :list="baseInfoForm.copyUmList"
      :fetch-fn="fetchUserInfos"
      :dist-info="{ user: 'empName' }"
      :columns="emailUserColumns(true)"
      delay
    >
    </SelectUserDialog>
  </div>
</template>
<script>
export default {
  name: 'StudentRecruitment'
}
</script>
<script setup>
import { ref, reactive, onMounted, computed, onActivated, nextTick } from 'vue'
import { getLoadingStatus } from '@/util/utils'
import { 
  fetchListRecruit, 
  fetchExportRecruit,
  fetchSaveRecruit,
  } from '@/fetch/newPeopleTrainingManagement'
import { REGISTRATION_STATUS_OPTIONS } from '../enum'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'
import { useRecruitQryParam } from '../hooks/useNewPeopleTraining'
import { Message } from 'element-ui'
import SelectUserDialog from '../../TalentsCultivation/components/SelectUserDialog.vue'
import { fetchUserInfos } from '@/fetch/public'
import { CopyObj } from '@/util/utils'
import DateRange from '@/components/dateRange/DateRange.vue'
const queryForm = reactive({
  annual: '',
  recruitNum: '', // 期次
  orgIds: [],
  recruitState: '',
  currPage: 1,
  pageSize: 10,
  total: 0
})
const queryFormRules = {
  annual: [{ required: true, trigger: 'blur', message: '请选择年度' }],
  recruitNum: [{ required: true, trigger: 'blur', message: '请选择期次' }]
}
const { 
  initRecruitQryParam,
  annualChangeHandle,
  filterNodeMethod,
  isZhAdmin,
  orgList,
  orgOneNode,
  annualList,
  recruitNumList,
  recruitNumListAll,
  setNewYearData
 } = useRecruitQryParam(queryForm)

const statusList = REGISTRATION_STATUS_OPTIONS

// 加载服务器数据
async function loadSeverData (flag) {
  await initRecruitQryParam(flag)
  getList()
}

function orgIdChange(keys) {
  queryForm.orgIds = keys
}

const columnList = [
  { type: 'selection' },
  { label: '序号', type: 'index' },
  { label: '年度', prop: 'annual', type: 'setWidth', width: 70, formatter: row => `${row.annual}年` },
  { label: '期次', prop: 'recruitNum', type: 'setWidth', width: 70 },
  { label: '入职日期', prop: 'dateHireStart', width: 170, type: 'setWidth', formatter: row => row.dateHireStart?`${row.dateHireStart}~${row.dateHireEnd}`:''},
  { label: '机构', prop: 'orgName', type: 'setWidth', width: 190 },
  { label: '报名状态', prop: 'recruitStateDesc', type: 'setWidth', width: 80 },
  { label: '战神/战狼人数', prop: 'zlOrZsNum', width: 100 },
  { label: '战英人数', prop: 'zyNum', width: 80 },
  { label: '总人数', prop: 'totalNum', width: 80 },
  { label: '截止时间', prop: 'cutoffDate', width: 200 },
  { label: '开营时间', prop: 'openDate', width: 120 },
  { label: '更新人', prop: 'updatedByStr', width: 180 },
  { label: '更新时间', prop: 'updatedByDate', width: 150 },
]
const dataList = ref([])
const querFormRef = ref(null)
function queryDatas () {
  querFormRef.value.validate(valid => {
    if (valid) {
      queryForm.currPage = 1
      getList()
    }
  })
}
const dropdownTreeRef = ref(null)
// 查询重置：重置查询框为空值，只清空查询框，不查询
function queryReset () {
  querFormRef.value?.clearValidate()
  // 重置年度和期次(不使用默认值，也清空)
  // queryForm.annual = annualList.value[0].value
  // annualChangeHandle()

  queryForm.annual = ''
  queryForm.recruitNum = ''
  recruitNumList.value = []
  // 重置机构和状态
  queryForm.orgIds = []
  if (dropdownTreeRef.value) {
    dropdownTreeRef.value.setValue(queryForm.orgIds)
  }
  queryForm.recruitState = ''
  queryForm.currPage = 1
  queryForm.pageSize = 10
}
// 导出
async function exportHandle () {
  await fetchExportRecruit(queryForm)
}
const selectedList = ref([])
function selectionHandle (_list) {
  selectedList.value = _list
}
function getList () {
  fetchListRecruit(queryForm)
  .then(res => {
    dataList.value = res.list
    queryForm.total = res.total
  })
}

// ============================== 弹框 ==============================
const formVisible = ref(false)
const formStatus = ref('add')
const formTitle = computed(() => `${formStatus.value === 'add' ? '新招募启动' : '招募编辑'}`)
const baseInfoForm = reactive({
  annual: '',
  recruitNum: '',
  openDate: '',
  cutoffDate: '',
  copyUmList: [],
  dateHireStart: '',
  dateHireEnd: ''
})
const baseInfoFormRules = {
  annual: [{ required: true, trigger: 'blur', message: '请选择年度' }],
  recruitNum: [
    { required: true, trigger: 'blur', message: '请设置期次' },
    { validator: (rule, value, callback) => {
        const numberReg = /^[1-9]\d*$/ // 正整数
        if (numberReg.test(value)) {
          const recruitNumList = recruitNumListAll[baseInfoForm.annual].map(m => Number(m.xrCode))
          if (!recruitNumList.includes(value)) {
            return callback()
          } else {
            callback(new Error('该年度与期次已创建，不允许重复创建'))
          }
        } else {
          callback(new Error('请数入正整数'))
        }
      }
    }
  ],
  dateHireStart: [
    { required: true, trigger: 'blur', message: '请选择入职日期' },
    { validator: (rule, value, callback) => {
        if (!baseInfoForm.dateHireStart || !baseInfoForm.dateHireEnd) {
          return callback(new Error('请选择入职日期'))
        } 
        return callback()
      }
    }
  ],
  openDate: [{ required: true, trigger: 'blur', message: '请设置开营日期' }],
  cutoffDate: [{ required: true, trigger: 'blur', message: '请设置截止时间' }],
}

const studentRecruitmentRef = ref(null)
function openCreateHandle() {
  formVisible.value = true
  nextTick(() => {
    studentRecruitmentRef.value?.clearValidate()
  })
  baseInfoForm.annual = String(new Date().getFullYear())
  formAnnualChangeHandle(baseInfoForm.annual)
  baseInfoForm.openDate = ''
  baseInfoForm.cutoffDate = ''
  baseInfoForm.copyUmList = []
  baseInfoForm.dateHireStart = ''
  baseInfoForm.dateHireEnd = ''
  // baseInfoForm.cutoffDate = `${new Date().toLocaleDateString()}`
}
// 年度变化时，获取新的期次值
function formAnnualChangeHandle (year, qc) {
  setNewYearData(year)
  const recruitNumList = recruitNumListAll[year]
  const _recruitNum = Number(recruitNumList[0].xrCode) + 1
  baseInfoForm.recruitNum = _recruitNum
}
// 期次重复验证
function recruitNumRepeatValidate (qc) {
  const recruitNumList = recruitNumListAll[baseInfoForm.annual]
  return !recruitNumList.some(m => m.xrCode === qc)
}
// 表单确定
const formComfirm = () => {
  studentRecruitmentRef.value.validate(async valid => {
    if (valid) {
      let data = baseInfoForm
      data.cutoffDate = data.cutoffDate + ':00'
      data  = formatParams(data)
      await fetchSaveRecruit(data)
      formVisible.value = false
      Message.success('新招募启动成功！')
      loadSeverData()
    }
  })
}
const formatParams = (data) => {
  data = CopyObj(data)
  data.copyUmList = data.copyUmList.map((row) => row.umId)
  return data
}

const emailUserColumns = (haveSelection = false, haveDrop = false) => {
  const data = [
    {
      label: '姓名',
      prop: 'empName'
    },
    {
      label: 'UM号',
      prop: 'umId'
    },
    {
      label: '归属机构',
      prop: 'blgOrgName'
    }
  ]

  haveSelection && data.unshift({ type: 'selection', 'reserve-selection': true })
  haveDrop && data.unshift({ slot: 'dropContainer' })
  return data
}

const isEmailSelectShow = ref(false)

const handleEmailSelect = () => {
  isEmailSelectShow.value = true
}
const handleEmailSelectSave = (list) => {
  baseInfoForm.copyUmList = list
}
const removeEmailUser = (row) => {
  baseInfoForm.copyUmList = baseInfoForm.copyUmList.filter((proRow) => proRow.umId !== row.umId)
}
onMounted(() => {
  loadSeverData(true)
})
onActivated(() => {
  if (baseInfoForm.annual && baseInfoForm.recruitNum) {
    getList()
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-input-number__decrease), 
:deep(.el-input-number__increase) {
    height: 28px;
    margin-top: 4px;
    line-height: 28px;
}
</style>