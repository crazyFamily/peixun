<template>
  <div class="schoolRecruitmentManagement__rotationTraining">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="届别">
          <el-cascader
            class="sw-180"
            clearable
            :options="gradesOptions"
            :props="cascaderProps"
            collapse-tags
            v-model="queryForm.grades"
            ref="multipleCascaderRef"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="机构" prop="managementIds">
          <DropdownZhOrg
            :style="{ width: '250px' }"
            :search="true"
            :list="orgList"
            @change="queryForm.managementIds = $event"
            valueField="orgId"
            labelField="orgName"
            ref="dropdownTreeRef"
          ></DropdownZhOrg>
        </el-form-item>
        <el-form-item label="入职年月">
          <DateRange
            v-model="queryForm"
            start-key="onboardDateStart"
            end-key="onboardDateEnd"
            :start-options="dateRangeOptions"
            :end-options="dateRangeOptions"
            width="90px"
          ></DateRange>
        </el-form-item>
        <el-form-item label="校招生信息">
          <gc-input placeholder="请输入校招生姓名/UM号" v-model.trim="queryForm.userCode" />
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetData" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
        <span
          class="instructor-icons__upload"
          @click="openImportForm"
          v-if="identity === FL_SUPER_ADMIN_OR_NEW_USER || identity === ORG_NEW_USER_ADMIN_VALUE"
        >
          <i class="instructor-icons__upload__icon"></i>
          录入评价结果
        </span>
      </div>
      <table-pagination
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        v-loading="getLoadingStatus('LOADING_ROTATION_TRAINING_LIST')"
        ref="tablePaginationRef"
      >
        <el-table-column slot="userName" label="姓名" width="120px">
          <template slot-scope="scope">
            <span class="active ellipsis" @click="handleView(scope.row)">{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="handleView(scope.row)">查看</span>
              <span class="item ml20 active" @click="handleEdit(scope.row)">编辑</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量添加 -->
    <TanlentsUpload
      width="1000px"
      :show.sync="isUploadShow"
      exportFailBatchId
      templateCode="ROTATION_TRAINING_LIST"
      :fetchFn="fetchImportBatchFosterResult"
      :export-fetch="fetchExportFailFosterResult"
      :uploadTableColumns="uploadTableColumns"
      @comfirm="importSuccessHandle"
    ></TanlentsUpload>
  </div>
</template>
<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import DropdownZhOrg from '@/components/dropdown/DropdownZhOrg'
import DateRange from '@/components/dateRange/DateRange'
import { useTable } from '@/hooks/useTable'
import { filterObj, CopyObj, getLoadingStatus, resetObj } from '@/util/utils'
import {
  fetchListStudentAdmissionInfo,
  fetchListStudentAdmissionInfoExport,
  fetchAdmissionQryParam,
  fetchImportBatchFosterResult,
  fetchSaveBatchFosterResult,
  fetchExportFailFosterResult
} from '@/fetch/schoolRecruitmentManagement'
import {
  ORG_NEW_USER_ADMIN_VALUE,
  TRANSFER_STATUS_LIST_OPTIONS,
  TEACHER_EVA_STATUS_OPTIONS,
  FOSTER_RES_STATUS_OPTIONS,
  FL_SUPER_ADMIN_OR_NEW_USER
} from '../../enum.js'
import TanlentsUpload from '@/views/TalentsCultivation/components/TanlentsUpload.vue'
import store from '@/store'
import { Message } from 'element-ui'
const baseParams = {
  currPage: 1,
  pageSize: 10,
  total: 0,
  grades: [],
  managementIds: [],
  onboardDateStart: '',
  onboardDateEnd: '',
  userCode: '',
  teacherEvaStatus: '',
  fosterResStatus: ''
}
const dateRangeOptions = { 'value-format': 'yyyy-MM-dd', type: 'month' }
const { queryForm, tableList, query, reset, tableFilterSetting } = useTable(baseParams)
const transferPositionTypeOptions = ref([])
const columns = [
  {
    label: '届别',
    width: '100',
    prop: 'grade'
  },
  {
    slot: 'userName'
  },
  {
    label: 'UM号',
    width: '120',
    prop: 'userCode'
  },
  {
    label: '正式入职日期',
    width: '140',
    prop: 'onboardDate'
  },
  {
    label: '入职单位',
    width: '200',
    prop: 'onboardOrg'
  },
  {
    label: '入职部门',
    width: '230',
    prop: 'onboardDeptName'
  },
  {
    label: '入职岗位',
    width: '230',
    prop: 'onboardPosition'
  },
  {
    label: '入职条线大类',
    width: '120',
    prop: 'onboardLine'
  },
  {
    label: '入职条线小类',
    width: '120',
    prop: 'onboardSubLine'
  },
  {
    label: '入职职级',
    width: '110',
    prop: 'onboardLevel'
  },
  {
    label: '最新轮岗阶段',
    width: '120',
    prop: 'transferStage'
  },
  {
    label: '最新轮岗岗位类型',
    width: '120',
    prop: 'transferPositionType',
    ...tableFilterSetting('transferPositionTypeList', transferPositionTypeOptions, true)
  },
  {
    label: '最新轮岗状态',
    width: '110',
    prop: 'transferStatusName',
    ...tableFilterSetting('transferStatusList', TRANSFER_STATUS_LIST_OPTIONS, true)
  },
  {
    label: '最新导师评价状态',
    width: '140',
    prop: 'teacherEvaStatusName',
    ...tableFilterSetting('teacherEvaStatus', TEACHER_EVA_STATUS_OPTIONS, false)
  },
  {
    label: '最新导师评价时间',
    width: '146',
    prop: 'teacherEvaDate'
  },
  {
    label: '最新培养结果录入状态',
    width: '155',
    prop: 'fosterResStatusName',
    ...tableFilterSetting('fosterResStatus', FOSTER_RES_STATUS_OPTIONS, false)
  },
  {
    label: '最新培养结果录入时间',
    width: '146',
    prop: 'fosterResDate'
  }
]
const dropdownTreeRef = ref(null)
const orgList = ref([])
const gradesOptions = ref([])
const identity = ref(null)
const cascaderProps = { value: 'value', label: 'label', multiple: true }
// 获取查询条件的机构列表、当前用户的身份、届别
const getAdmissionQryParam = async (callback) => {
  const res = await fetchAdmissionQryParam()
  identity.value = res.identity
  orgList.value =
    res.orgs?.map((m) => ({
      orgId: m.xrCode,
      orgName: m.xrMsg,
      value: m.xrCode,
      label: m.xrMsg,
      parentOrgId: m.parentXrCode,
      orgLevel: 1
    })) || []
  gradesOptions.value =
    res.grades?.map((m) => ({
      value: m,
      label: m
    })) || []
  transferPositionTypeOptions.value =
    res.transferPositionTypeList?.map((m) => ({
      value: m,
      label: m
    })) || []
  if (gradesOptions.value[0]) {
    queryForm.grades = [gradesOptions.value[0].value]
  }
  await nextTick()
  if (res.identity === ORG_NEW_USER_ADMIN_VALUE && orgList.value[0]) {
    // setValue需要nextTick之后才能正确设置值，设置完值之后需要nextTick后才能获取到对应的值
    dropdownTreeRef.value?.setValue([orgList.value[0]])
    await nextTick()
  }
  callback && callback()
}
// 查询事件
const queryData = () => {
  query(getList)
}
const tablePaginationRef = ref(null)
// 重置事件
const resetData = async () => {
  resetObj(queryForm, baseParams)
  queryForm.managementIds = []
  dropdownTreeRef.value?.setValue(queryForm.managementIds)
  tablePaginationRef.value.resetFilters()
  await nextTick()
  queryData()
}
const multipleCascaderRef = ref(null)
// 格式化发送数据
const _formatSendParams = (params) => {
  const data = filterObj(CopyObj(params))
  data.grades = multipleCascaderRef.value?.getCheckedNodes().map((v) => v.value)
  return data
}
const getList = async () => {
  const data = _formatSendParams(queryForm)
  const { total, list } = await fetchListStudentAdmissionInfo({ data })
  queryForm.total = total
  tableList.value = list
}
const handleView = async (row) => {
  store.dispatch('schoolRecruitmentManagement/changeRotationComp', { status: 'detail', type: 'view', identity: identity.value, ...row })
}
const handleEdit = (row) => {
  store.dispatch('schoolRecruitmentManagement/changeRotationComp', { status: 'detail', type: 'edit', identity: identity.value, ...row })
}
const exportHandle = () => {
  const data = _formatSendParams(queryForm)
  fetchListStudentAdmissionInfoExport({ data })
}
// 监听当从编辑页返回时刷新数据
watch(
  () => store.getters['schoolRecruitmentManagement/getRotationCompProps'],
  (n) => {
    if (n.refreshData) {
      getList()
    }
  }
)
// ------------------- 导入评价结果开始 -------------------
const isUploadShow = ref(false)
const openImportForm = () => {
  isUploadShow.value = true
}
const importSuccessHandle = async (successList, batchId, succBatchId) => {
  if (succBatchId) {
    await fetchSaveBatchFosterResult({ batchId: succBatchId })
    getList()
    Message.success('保存成功')
  }
  isUploadShow.value = false
}
const uploadTableColumns = ref([
  { label: '届别', prop: 'grade' },
  { label: 'UM号', prop: 'userCode' },
  { label: '轮岗阶段', prop: 'transferStage' },
  { label: '失败原因', prop: 'msg', width: 200 }
])
// ------------------- 导入评价结果结束 -------------------
onMounted(() => {
  getAdmissionQryParam(queryData)
})
defineExpose({ queryData })
</script>

<script>
export default {
  name: 'RotationTraining'
}
</script>
<style lang="scss" scoped>
.schoolRecruitmentManagement__rotationTraining {
  :deep(.el-table th:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
  :deep(.el-table th:not(:first-child):before) {
    position: initial;
  }
  :deep(.el-table td:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
}
</style>