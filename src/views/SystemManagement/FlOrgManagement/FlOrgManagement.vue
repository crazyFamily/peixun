<template>
  <div class="org-management-wrapper">
    <el-card class="mt10">
      <div class="menu-wapper">
        <div class="menu-right">
          <span class="instructor-icons__add" @click="handleCreate">
            <i class="instructor-icons__add__icon"></i>
            添加
          </span>
          <span class="instructor-icons__refresh" @click="handleReload">
            <i class="instructor-icons__refresh__icon" style="width: 15px; height: 15px; background-size: 100% 100%;"></i>
            刷新
          </span>
        </div>
      </div>
      <table-pagination
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getDataList"
        v-loading="getLoadingStatus('LOADING_MANAGEMENT')"
        ref="tablePaginationRef">
        <el-table-column label="操作" width="105px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="handleEdit(scope.row)">编辑</span>
              <span class="item active ml10" @click="handleRemove(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <gc-model 
      :title="`${status === 'add'?'新增':'编辑'}机构树`" 
      :visible.sync="isEditorShow"
      :is-show-footer="false"
      auto-height
    >
      <ManageCompanyForm
        v-if="isEditorShow"
        :management-type="MANAGEMENT_TYPE_FL_ORG"
        @save="handleSave"
        @close="handleClose"
        :disabled-list="orgDisabledList"
        :form-type="status"
        :detail-info="selectedOrgRow"
      ></ManageCompanyForm>
    </gc-model>
  </div>
</template>
<script setup>
import { fetchDeleteManagementByManagementId, fetchFindManagementDetail, fetchFindOthersManagementOrgs, fetchListManagement } from '@/fetch/systemManagement';
import { useTable } from '@/hooks/useTable';
import { customHint, getLoadingStatus } from '@/util/utils';
import { onMounted, reactive, ref } from 'vue';
import ManageCompanyForm from '../ManageCompany/ManageCompanyForm.vue';
import { COMPANY_STATUS_OPTIONS, MANAGEMENT_TYPE_FL_ORG } from '../enum';
import { Message } from 'element-ui';

const baseParams = {
  managementType: MANAGEMENT_TYPE_FL_ORG,
  managementName: '',
  managementStatus: ''
}
const { queryForm, tableList, query, reset, tableFilterSetting } = useTable(baseParams)
const columns = [
  { label: '序号', type: 'index', fixed: true },
  { label: '架构ID', prop: 'managementId', type: 'setWidth', width: 100 },
  { label: '架构名称', prop: 'managementName', type: 'setWidth', width: 150 },
  { label: '下属架构范围', prop: 'allOrgName', width: '250px' },
  { label: '状态', prop: 'managementStatusDesc', type: 'setWidth', width: 80,
    ...tableFilterSetting('managementStatus', COMPANY_STATUS_OPTIONS, false)
  },
  // { label: '创建人', prop: 'createByStr' },
  // { label: '创建时间', prop: 'createByDate' },
  { label: '更新人', prop: 'updatedByStr', type: 'setWidth', width: 170 },
  { label: '更新时间', prop: 'updatedByDate', width: 110 }
]
const queryData = () => {
  query(getDataList)
}
onMounted(() => {
  queryData()
})
// type status = 'add' | 'edit'
const status = ref('add')
const orgDisabledList = ref([])
const selectedOrgRow = ref({})
const isEditorShow = ref(false)
const getDisabledDatas = async (row) => {
  // 获取当前已经关联过的机构
  const params = status.value === 'edit' ? { managementId: row.managementId, managementType: MANAGEMENT_TYPE_FL_ORG } : { managementType: MANAGEMENT_TYPE_FL_ORG }
  const res = await fetchFindOthersManagementOrgs(params)
  orgDisabledList.value = res
}
const handleCreate = async () => {
  status.value = 'add'
  await getDisabledDatas()
  isEditorShow.value = true
}

const handleEdit = async (row) => {
  status.value = 'edit'
  await getDisabledDatas(row)
  const res = await fetchFindManagementDetail({ managementId: row.managementId, managementType: MANAGEMENT_TYPE_FL_ORG })
  selectedOrgRow.value = res
  isEditorShow.value = true
}
const handleRemove = (row) => {
  customHint('是否确认删除当前数据', '提示', '关闭', false, '确认删除')
  .then(() => {
    fetchDeleteManagementByManagementId({
      managementType: MANAGEMENT_TYPE_FL_ORG,
      managementId: row.managementId
    }).then(res => {
      Message.success('删除成功')
      queryData()
    })
  })
}
const getDataList = async () => {
  const { total, list } = await fetchListManagement(queryForm)
  queryForm.total = total
  tableList.value = list
}
const tablePaginationRef = ref(null)
const handleReload = () => {
  status.value = 'add'
  tablePaginationRef.value?.resetFilters()
  reset(getDataList)
}


// const closeDialog = () => {
//   isEditorShow.value = false
// }
// const handleCancel = () => {
//   closeDialog()
// }
// const handleComfirm = () => {
//   closeDialog()
// }


const editorForm = reactive({
  relatedOrgs: [],
  childrenOrgs: [],
  managementStatus: "",
  originalOrgList: [],
})
const isDisabled = ref(false)
const editorFormRules = {}
const orgChangeHandle = () => {}

const selectedOrgInfo = ref({})
const handleChangeOrg = (value) => {
  selectedOrgInfo.value = value || {}
  console.log(value, '--->> ');
}
const handleSave = () => {
  isEditorShow.value = false
  handleReload()
}
const handleClose = () => {
  isEditorShow.value = false
}
</script>
<script>
export default {
  name: 'FlOrgManagement'
}
</script>
<style lang="scss" scoped>
.org-management-wrapper {
  :deep(.gc-model__dialog .el-dialog__body) {
    overflow: initial;
  }
}
</style>