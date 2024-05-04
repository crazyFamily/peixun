<template>
  <div class="student-recruitment">
    <el-card class="search-card mt10">
      <el-form :model="queryForm" :rules="queryFormRules" inline ref="querFormRef" label-width="70px">
        <el-form-item label="年度" prop="annual">
          <gc-select :options="annualList" 
            v-model="queryForm.annual" 
            @change="annualChangeHandle" 
            :clearable="false"
            class="w-150" />
        </el-form-item>
        <el-form-item label="期次" prop="period">
          <gc-select 
            :options="recruitNumList" 
            v-model="queryForm.period" 
            :clearable="false"
            class="w-150" />
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
        <el-form-item label="学员信息" prop="status">
          <el-input v-model.trim="queryForm.userInfo" placeholder="请输入学员姓名/UM号" />
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDatas">查询</el-button>
          <el-button @click="queryReset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="openAddBatchHandle">
          <i class="instructor-icons__add__icon"></i>
          批量添加
        </span>
        <span class="instructor-icons__add" @click="openAddHandle()">
          <i class="instructor-icons__add__icon"></i>
          添加
        </span>
        <span class="instructor-icons__del" @click="deleteHandle">
          <i class="instructor-icons__del__icon"></i>
          删除
        </span>
        <span class="instructor-icons__submit" @click="submitHandle">
          <i class="instructor-icons__submit__icon"></i>
          提交
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
        :getList="getList"
          :page-sizes="[10, 20,100]"
        @selection-change="selectionHandle"
        v-loading="getLoadingStatus('LOADING_LIST_RECRUIT_USER')"
        ref="tablePaginationRef">
        <el-table-column slot="planFileName" prop="planFileName" label="方案附件" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <a :href="scope.row.planFileUrl" download class="active event-link">{{ scope.row.planFileName }}</a>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span v-if="isZhAdmin || (!isZhAdmin && scope.row.status === SUBMIT_STATUS_TODO )" class="item active" @click="openEditHandle(scope.row)">编辑</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'StudentRegistration'
}
</script>
<script setup>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { addAllowKeepAlive, customHint, getLoadingStatus } from '@/util/utils'
import { 
  fetchListRecruitUser, 
  fetchExportRecruitUser,
  fetchSubmitRecruitUser,
  fetchDeleteRecruitUserBatch,
  fetchSaveOrCommitUserByIdBatch,
  fetchFindRecruitUserDetail
  } from '@/fetch/newPeopleTrainingManagement'
import { 
  SUBMIT_STATUS_OPTIONS, 
  SUBMIT_STATUS_TODO, 
  ONLINE_TYPE_OPTIONS,
  RECRUIT_TYPE_OPTIONS,
  BLGSTRIPLINE_OPTIONS,
  } from '../enum'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'
import { useRecruitQryParam } from '../hooks/useNewPeopleTraining'
import router from '@/router'
import { Message } from 'element-ui'
import { useRouter, useRoute } from '@/router'

const queryForm = reactive({
  annual: '',
  period: '', // 期次
  orgIds: [],
  userInfo: '',
  currPage: 1,
  pageSize: 10,
  status: [],
  onlineTypes: [],
  total: 0
})

const queryFormRules = {
  annual: [{ required: true, trigger: 'blur', message: '请选择年度' }],
  period: [{ required: true, trigger: 'blur', message: '请选择期次' }]
}

const dropdownOrgValue = ref(null)
const { 
  initRecruitQryParam,
  annualChangeHandle,
  filterNodeMethod,
  isZhAdmin,
  orgList,
  orgOneNode,
  annualList,
  recruitNumList,
  getOptionsObj
 } = useRecruitQryParam(queryForm)
 
const onlineTypeList= ONLINE_TYPE_OPTIONS
const onlineTypeListMapping = reactive(getOptionsObj(ONLINE_TYPE_OPTIONS))
const typeMapping = reactive(getOptionsObj(RECRUIT_TYPE_OPTIONS))
const newBlgStripLineMapping = reactive(getOptionsObj(BLGSTRIPLINE_OPTIONS))
const statusList = SUBMIT_STATUS_OPTIONS
const statusListMapping = getOptionsObj(SUBMIT_STATUS_OPTIONS)


// 加载服务器数据
async function loadSeverData (flag) {
  // 处理查询条件中的3个查询数据
  await initRecruitQryParam(flag)
  // 加载列表数据
  getList()
}

function orgIdChange(keys, nodes) {
  dropdownOrgValue.value = nodes
  queryForm.orgIds = keys
}

const tableFilterSetting = (key, list, multiple = false) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

const columnList = [
  { type: 'selection', fixed: true },
  { label: '序号', type: 'index', fixed: true },
  { label: '年度', prop: 'annual', type: 'setWidth', width: 70, 
    formatter: row => `${row.annual}年` },
  { label: '期次', prop: 'period', type: 'setWidth', width: 70 },
  { label: '线上营类型', prop: 'onlineType', type: 'setWidth', width: 100,
    formatter: row => onlineTypeListMapping[row.onlineType] || '',
    ...tableFilterSetting('onlineTypes', onlineTypeList, true)},
  { label: '机构', prop: 'orgName', type: 'setWidth', width: 150, },
  { label: '姓名', prop: 'umName', type: 'setWidth', width: 100 },
  { label: 'UM号', prop: 'umId', type: 'setWidth', width: 160 },
  // { label: '手机号', prop: 'phoneNo', type: 'setWidth', width: 150 },
  { label: '条线', prop: 'newBlgStripLine', type: 'setWidth', width: 100,
    formatter: row => newBlgStripLineMapping[row.newBlgStripLine] || '' },
  { label: '部门', prop: 'deptName', type: 'setWidth', width: 250 },
  { label: '岗位', prop: 'positionName', type: 'setWidth', width: 250 },
  { label: '内外勤', prop: 'inLegworkDesc', width: 100 },
  { label: '职位主序列', prop: 'jobSeqIdDesc', width: 100 },
  { label: '能力层级', prop: 'capLevel', type: 'setWidth', width: 100 },
  { label: '入职时间', prop: 'entryDate', width: 100 },
  { label: '性别', prop: 'gender', width: 100 },
  { label: '年龄', prop: 'age', width: 100 },
  { label: '类别', prop: 'type', width: 100,
    formatter: row => typeMapping[row.type] || '' },
  { label: '直线领导', prop: 'lineLeaderName', width: 180, 
    formatter: row => `${row.lineLeaderName}(${row.lineLeaderUm})` },
  { label: '更新人', prop: 'updatedByName', width: 180,
    formatter: row => `${row.updatedByName}(${row.updatedBy})` },
  { label: '状态', prop: 'status', type: 'setWidth', width: 80,
    formatter: row => statusListMapping[row.status] || '',
    ...tableFilterSetting('status', statusList, true)
  },
]

const dataList = ref([])
const querFormRef = ref(null)
const tablePaginationRef = ref(null)
function queryDatas () {
  querFormRef.value.validate(valid => {
    if (valid) {
      queryForm.currPage = 1
      getList()
    }
  })
}

// 查询重置：重置查询框为空值，只清空查询框，不查询
const dropdownTreeRef = ref(null)
function queryReset () {
  querFormRef.value?.clearValidate()
  // 重置年度和期次(不使用默认值，也清空)
  // queryForm.annual = annualList.value[0].value
  // annualChangeHandle()

  queryForm.annual = ''
  queryForm.period = ''
  recruitNumList.value = []
  // 重置机构和状态
  queryForm.orgIds = []
  if (dropdownTreeRef.value) {
    dropdownTreeRef.value.setValue(queryForm.orgIds)
  }
  queryForm.userInfo = ''
  queryForm.status = []
  queryForm.onlineTypes = []
  queryForm.currPage = 1
  queryForm.pageSize = 10
  tablePaginationRef.value.resetFilters()
}
// 导出
async function exportHandle () {
  await fetchExportRecruitUser(queryForm)
}
const selectedList = ref([])
function selectionHandle (_list) {
  selectedList.value = _list
}

function getList () {
  fetchListRecruitUser(queryForm)
  .then(res => {
    dataList.value = res.list
    queryForm.total = res.total
  })
}

function openAddHandle(type = 'add', row) {
  addAllowKeepAlive('/AddStudentRegistration')
  router.push({
    name: '添加/编辑学员',
    params: {
      formType: type,
      row
    }
  })
}

async function openEditHandle (row) {
  const res = await fetchFindRecruitUserDetail({id: row.id})
  openAddHandle('edit', res) 
}

// 批量删除（后端验证）
function deleteHandle () {
  customHint('确认要删除所选记录吗？', '提示', '取消')
  .then(async () => {
    const ids = selectedList.value.map(m => String(m.id))
    const res = await fetchDeleteRecruitUserBatch(ids)
    Message.success('删除成功')
    queryDatas()
  })
}

async function submitHandle () {
  if (selectedList.value?.length) {
    customHint('已提交的学员信息不允许修改和删除，请确认是否提交？', '提示', '取消')
    .then(async () => {
      const ids = selectedList.value.map(m => String(m.id))
      await fetchSaveOrCommitUserByIdBatch({ids})
      Message.success('提交成功')
      queryDatas()
    })
  } else { 
    // 未选择学员提交
    // XX年XX期XX机构无学员报名，请确认是否提交
    if (!queryForm.orgIds?.length) {
      if (orgList.value?.length === 1) {
        // 若提交用户的管理机构只有一个，则默认填入
        // queryForm.orgIds = [orgList.value[0].orgId]
        dropdownOrgValue.value = orgList.value
      } else {
        return Message.warning('若无学员报名，请先选择机构再提交，否则请至少选择一条学员记录进行提交')
      }
    }
    const orgNames = dropdownOrgValue.value.map(m => m.label)
    const orgNamesStr = orgNames.join() || ''
    const commitOrgs = dropdownOrgValue.value.map(m => ({ xrCode: m.value, xrMsg: m.label }))
    await customHint(`${queryForm.annual}年${queryForm.period}期"${orgNamesStr}"机构无学员报名，请确认是否提交？`, '提示', '取消')
    const params = { annual: queryForm.annual, period: queryForm.period, commitOrgs }
    await fetchSaveOrCommitUserByIdBatch(params)
    Message.success(`提交成功`)
  }
}

function openAddBatchHandle() {
  addAllowKeepAlive('/AddBatchStudentRegistration')
  router.push({
    name: '批量添加学员',
    params: {
      formType: 'add'
    }
  })
}

onMounted(() => {
  console.log('onMounted')
  loadSeverData(true)
})

onActivated(() => {
  const routeParams = useRoute().params
  console.log('onActivated','routerPrams', routeParams)
  if (queryForm.annual && queryForm.period) {
    getList()
  }
})
</script>