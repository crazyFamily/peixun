<template>
  <div class="PermissionList">
    <el-card class="search-card">
      <el-form :model="queryForm" inline ref="querFormRef" label-width="80px">
        <el-form-item label="所属机构" prop="orgIds">
          <gc-institution
            v-model="queryForm.orgIds"
            :leftShow="true"
            :default-show="false"
            :fetchParams="{module: CLASS_MODULE }"
            @change="queryForm.orgName = $event"
            ref="institutionRef" />
        </el-form-item>
        <el-form-item label="业务模块" prop="scopeAuthority">
          <gc-select
            class="w-200"
            :options="channelTypes"
            v-model="queryForm.scopeAuthority"
          />
        </el-form-item>
        <el-form-item label="管理员信息">
          <el-input v-model.trim="queryForm.umId" placeholder="输入姓名/UM号" class="w-150" />
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDataList()">查询</el-button>
          <el-button @click="resetDataList()">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="openBaseForm()"><i class="instructor-icons__add__icon" />添加</span>
        <span class="instructor-icons__del" @click="deleteDataList()"><i class="instructor-icons__del__icon" />删除</span>
        <span class="instructor-icons__download" @click="exportDataList()"><i class="instructor-icons__download__icon" />导出</span>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        @selection-change="selectDataList"
        v-loading="getLoadingStatus('LOADING_MANAGEMENT')"
        ref="tablePagination">
        <el-table-column slot="isValid" prop="isValid" label="权限开关" width="100px">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.isValid" :key="scope.row.id"
              @change="isValidChange(scope.row, scope.$index, $event)"
              active-color="#e4e7ed" inactive-color="#fd6720"
              :active-text="PERMISSION_STATUS_OFF_LABEL" :inactive-text="PERMISSION_STATUS_ON_LABEL" 
              :active-value="PERMISSION_STATUS_OFF" :inactive-value="PERMISSION_STATUS_ON"
            /> -->
            <el-switch v-model="scope.row.isValid" :key="scope.row.id"
              @change="isValidChange(scope.row, scope.$index, $event)"
              active-color="#e4e7ed" inactive-color="#fd6720"
              :active-value="PERMISSION_STATUS_OFF" :inactive-value="PERMISSION_STATUS_ON"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="openBaseForm(scope.row)">编辑</span>
              <!-- <span class="item active ml10" @click="deleteHandle(scope.row)">删除</span> -->
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量新增弹框 -->
    <gc-model :title="baseFormTitle" :visible="baseFormShow" width="650px"
      @close="closeBaseForm" 
      @cancel="closeBaseForm" 
      @comfirm="comfirmBaseForm">
      <el-form ref="formRef" :model="baseInfoForm" :rules="baseInfoRules" label-width="100px" @submit.native.prevent>
        <el-form-item label="UM号/姓名" prop="umInfo" >
          <el-autocomplete v-if="isAdd"
            class="w-full"
            value-key="label"
            placeholder="请输入UM号/姓名"
            :trigger-on-focus="false"
            v-model="baseInfoForm.umInfo"
            :fetch-suggestions="querySearch"
            @select="personSelect($event)"
          />
          <el-input v-else v-model.trim="baseInfoForm.umInfo" disabled />
        </el-form-item>
        <el-form-item label="所属机构" prop="orgName">
          <el-input class="input-width" v-model="baseInfoForm.orgName" disabled></el-input> 
        </el-form-item>
        <el-form-item label="权限范围" prop="scopeAuthorityArr">
          <gc-select
            class="w-full"
            :multiple="true"
            :options="channelTypes"
            v-model="baseInfoForm.scopeAuthorityArr"
          />
        </el-form-item>
        <el-form-item label="权限开关" prop="isValid">
          <el-switch v-model="baseInfoForm.isValid" 
            key="isValid"
            active-color="#e4e7ed" inactive-color="#fd6720"
            :active-text="PERMISSION_STATUS_OFF_LABEL" :inactive-text="PERMISSION_STATUS_ON_LABEL" 
            :active-value="PERMISSION_STATUS_OFF" :inactive-value="PERMISSION_STATUS_ON"
          />
        </el-form-item>
        <el-form-item label="权限有效期" prop="effectiveDateState">
          <el-switch v-model="baseInfoForm.effectiveDateState" 
            key="effectiveDateState"
            active-color="#e4e7ed" inactive-color="#fd6720"
            :active-text="PERMISSION_STATUS_OFF_LABEL" :inactive-text="PERMISSION_STATUS_ON_LABEL" 
            :active-value="PERMISSION_STATUS_OFF" :inactive-value="PERMISSION_STATUS_ON"
          />
          <template v-if="baseInfoForm.effectiveDateState === 'Y'">
            <span class="ml10 mr10">截止到</span>
            <el-date-picker
              class="w-150"
              v-model="baseInfoForm.effectiveDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd" />
          </template>
        </el-form-item>
      </el-form>
    </gc-model>
  </div>
</template>
<script>
export default {
  name: 'PermissionList'
}
</script>
<script setup>
import { ref, reactive, computed, watch, onMounted, onActivated, nextTick } from 'vue'
import { customHint, getLoadingStatus, CopyObj } from '@/util/utils'
import { 
  fetchListCoverageManage, fetchExportCoverageManage, 
  fetchDeleteCoverageManageByIds, fetchSaveCoverageManageInfo,
  } from '@/fetch/statementCentre'

import { PERMISSION_STATUS_OPTIONS, 
  PERMISSION_STATUS_ON, PERMISSION_STATUS_OFF,
  PERMISSION_STATUS_ON_LABEL, PERMISSION_STATUS_OFF_LABEL,
  CLASS_MODULE 
} from '../enum'
import { fetchUserInfos } from '@/fetch/public'
import { useLadderCoverage } from '../hooks/useLadderCoverage'
import { usePostCascader } from '../hooks/usePostCascader'
import { Message } from 'element-ui'

const props = defineProps({
  channelTypes: {
    type: Array,
    default: () => []
  }
})

const baseQueryForm = {
  orgIds: [],
  orgId: '',
  scopeAuthority: '',
  umId: '',
  currPage: 1,
  pageSize: 10,
  total: 0
}

const {
  tableFilterSetting,
  queryForm,
  dataList,
  fetchDataList,
  queryDataList,
  resetDataList,
  exportDataList,
} = useLadderCoverage({
  baseQueryForm,
  apiDataList: fetchListCoverageManage,
  apiExportDataList: fetchExportCoverageManage,
  queryFormFormat: _formatSendParams
})

const columnList = [
  { type: 'selection', fixed: true },
  { label: '序号', type: 'index', fixed: true },
  { label: '管理员姓名', prop: 'umName', type: 'setWidth', width: 100 },
  { label: '管理员UM号', prop: 'umId', type: 'setWidth', width: 150 },
  { label: '所属机构', prop: 'orgName', width: '200px' },
  { label: '权限范围(业务模块)', prop: 'scopeAuthorityDesc', type: 'setWidth', width: '200' },
  { label: '权限开关', prop: 'isValid', type: 'setWidth', width: '100', slot:'isValid', 
    ...tableFilterSetting('isValid', PERMISSION_STATUS_OPTIONS)
  },
  { label: '权限截止时间', prop: 'effectiveDate', width: 150 },
  { label: '权限更新时间', prop: 'updatedDate', width: 180 },
  { label: '操作人', prop: 'updatedByStr', width: 180 },
]

// 格式化发送数据
function _formatSendParams(params) {
  const data = CopyObj(params)
  data.orgId = data.orgIds?.[1]
  Reflect.deleteProperty(data, 'orgIds')
  return data
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
      const ids = selectedList.value.map(m => m.id)
      const resDel = await fetchDeleteCoverageManageByIds({ ids })
      queryDataList()
      Message.success('删除成功！')
    })
  } else {
    Message.warning('请选择要删除的记录')
  }
}
// 列表中开启或关闭
function isValidChange (row, i, value) {
  const operText = value === PERMISSION_STATUS_ON ? '开启' : '关闭'
  const oldValue = value === PERMISSION_STATUS_ON ? PERMISSION_STATUS_OFF : PERMISSION_STATUS_ON
  dataList.value[i].isValid = oldValue 
  customHint(`确认要将此管理员的权限${operText}吗？`, '提示', '关闭', false, '确认')
    .then(async res => {
      const postData = {
        tip: 'N',
        id: row.id,
        umId: row.umId,
        scopeAuthority: row.scopeAuthorityArr?.toString() || '',
        isValid: value,
        effectiveDate: value === 'Y' ? row.effectiveDate : ''
      }
      console.log('post-提交数据', postData)
      await fetchSaveCoverageManageInfo(postData)
      Message.success(`${operText}成功！` )
      // dataList.value[i].isValid = value 
      queryDataList()
    })
}
// ============================== 新增 ==============================
const formRef = ref(null)
const isAdd = ref(false) // 是否是新增
const baseFormTitle = ref('')
const baseFormShow = ref(false)
const baseFormData = {
  id: '',
  umInfo: '',
  umId: '',
  umName: '',
  orgId: '',
  orgName: '',
  scopeAuthorityArr: [], // 条线
  scopeAuthority: '',
  isValid: PERMISSION_STATUS_ON,
  effectiveDateState: PERMISSION_STATUS_OFF,
  effectiveDate: '',
}
const baseInfoForm = ref(CopyObj(baseFormData))

const baseInfoRules = {
  umInfo: [{ required: true, trigger: 'change', message: '请选择管理员' }],
  orgName: [{ required: true, trigger: 'change', message: '请填写管理单位名称' }],
  scopeAuthorityArr: [{ required: true, trigger: 'blur', validator: (rule, value, cb) => {
      if (!value?.length) {
        return cb(new Error('请选择权限范围'))
      }
      cb()
    }
  }]
}

function querySearch(queryString, cb) {
  const data = { empName: queryString }
  fetchUserInfos({ data }).then(resData => {
    resData.list.forEach((v) => {
      v.label = `${v.empName}(${v.umId}) ${v.blgOrgName}`
    })
    cb(resData.list)
  })
}
function personSelect (v) {
  baseInfoForm.value.umInfo = `${v.empName}(${v.umId})`
  baseInfoForm.value.umId = v.umId
  baseInfoForm.value.orgId = v.blgOrgId
  baseInfoForm.value.orgName = v.blgOrgName
}

function openBaseForm (row) {
  isAdd.value = row ? false : true
  baseFormShow.value = true
  if (isAdd.value) {
    baseFormTitle.value = '新增管理员'
  } else {
    baseFormTitle.value = '编辑管理员'
    nextTick(() => {
      baseInfoForm.value.id = row.id
      baseInfoForm.value.umId = row.umId
      baseInfoForm.value.umInfo = `${row.umName}(${row.umId})`
      baseInfoForm.value.orgId = row.orgId
      baseInfoForm.value.orgName = row.orgName
      baseInfoForm.value.scopeAuthorityArr = row.scopeAuthority?.split(',') || []
      baseInfoForm.value.isValid = row.isValid
      baseInfoForm.value.effectiveDate = row.effectiveDate
      baseInfoForm.value.effectiveDateState = row.effectiveDate ? 'Y' : 'N'
    })
  }
}
function closeBaseForm () {
  baseFormShow.value = false
  baseInfoForm.value = CopyObj(baseFormData) 
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}
// 提交
function comfirmBaseForm () {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const postData = {
        tip: 'Y',
        umId: baseInfoForm.value.umId,
        scopeAuthority: baseInfoForm.value.scopeAuthorityArr?.toString() || '',
        isValid: baseInfoForm.value.isValid
      }
      if (baseInfoForm.value.id) {
        postData.id = baseInfoForm.value.id
      }
      if (baseInfoForm.value.effectiveDate) {
        postData.effectiveDate = baseInfoForm.value.effectiveDate
      }
      if (baseInfoForm.value.effectiveDateState === 'N') {
        postData.effectiveDate = ''
      }
      console.log('post-提交数据', postData)
      fetchSaveCoverageManageInfo(postData).then(res => {
        Message.success('保存成功！')
        closeBaseForm()
        queryDataList()
      })
    }
  })
}

</script>
<style lang="less" scoped>
.gc-select {
  padding: 0;
}
</style>