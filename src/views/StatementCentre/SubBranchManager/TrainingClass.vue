<template>
  <div>
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="培训班举办年份" prop="year">
          <gc-select :options="yearOptions" v-model="queryForm.year" :clearable="false" class="w-150" />
        </el-form-item>
        <el-form-item label="培训班信息">
          <gc-input placeholder="培训班编号/培训班名称" v-model.trim="queryForm.className" />
        </el-form-item>

        <div class="buttons">
          <el-button @click="queryDataList" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetDataList" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <template v-if="hasBmAdmin || hasFhAdmin || hasSuperAdmin">
          <span class="instructor-icons__add" @click="openBaseForm"><i class="instructor-icons__add__icon"></i>新增</span>
          <span class="instructor-icons__download" @click="openImportForm"><i class="instructor-icons__upload__icon"></i>批量导入</span>
        </template>
        <span v-if="hasSuperAdmin" class="instructor-icons__del" @click="deleteDataList"><i class="instructor-icons__del__icon"></i>删除</span>
        <span class="instructor-icons__upload" @click="exportDataList"><i class="instructor-icons__download__icon"></i>导出</span>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        @selection-change="selectDataList"
        v-loading="getLoadingStatus('LOADING_BRANCH_CLASS')"
        ref="tablePagination"/>
    </el-card>
    <!-- 批量导入弹框 -->
    <ImportModel
      :show="importFormShow"
      :faildColumns="importFaildColumns"
      :importFetchFn="fetchImportBatchBranchClass"
      :faildExportFetchFn="fetchExportFailBranchClass"
      templateCode="SUB_BRANCH_MANAGER_ADD_BRACH"
      @showChange="importFormShow = $event"
      @comfirm="comfirmImportForm"
    />
    <!-- 批量新增弹框 -->
    <gc-model title="新增培训班" :visible="baseFormShow" width="500px"
      @close="baseFormShow = false" 
      @cancel="baseFormShow = false" 
      @comfirm="comfirmBaseForm">
      <el-form ref="trainingClassRef" :model="baseInfoForm" label-width="120px">
        <el-form-item label="培训班归属年度" prop="year"
          :rules="[{ required: true, message: `培训班归属年度不能为空`, trigger: 'blur' }]">
          <gc-select :options="yearOptions" v-model="baseInfoForm.year" :clearable="false" style="padding: 0;"/>
        </el-form-item>
        <el-form-item v-for="(item,i) in baseInfoForm.classList" :key="`class${i}`"
          label="培训班编号" :prop="`classList.${i}.classId`"
          :rules="classListRules(i)">
          <div>
            <el-input class="w-150" v-model="item.classId" placeholder="请输入" :ref="`classId${i}Ref`" />
            <el-button @click="classListChange('add', i)" class="button-my-primary-plain ml10" >添加</el-button>
            <el-button @click="classListChange('del', i)" class="button-my-primary-plain"
              v-show="baseInfoForm.classList.length > 1">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
    </gc-model>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import { 
  fetchQueryBranchClassPage, fetchExportBranchClassPage, 
  fetchCheckBranchClass, fetchBatchAddBranchClass,
  fetchImportBatchBranchClass, fetchDeleteBranchClass,
  fetchSaveImportBranchClass, fetchExportFailBranchClass
} from '@/fetch/statementCentre'
import { useSubBranchManager } from '../hooks/useSubBranchManager'
import ImportModel from '@/components/upload/ImportModel'
import { CopyObj, customHint, getLoadingStatus } from '@/util/utils'
import store from '@/store'
import { ROLE_CODE } from '@/util/constants'
import { Message } from 'element-ui'

// 是否有“超管”角色
const hasSuperAdmin = computed(() => store.state.userInfo.roleIds.includes(ROLE_CODE.SUPER_ADAMIN))
// 是否有“部门超管”角色
const hasBmAdmin = computed(() => store.state.userInfo.roleIds.includes(ROLE_CODE.SUPER_ADAMIN_BM))
// 是否有“分行超管”角色
const hasFhAdmin = computed(() => store.state.userInfo.roleIds.includes(ROLE_CODE.SUPER_ADAMIN_FH))

const baseQueryForm = {
  year: '', // 参训年份
  className: '', // 培训班信息
  currPage: 1,
  pageSize: 10,
  total: 0,
}

const {
  queryForm,
  yearOptions,
  dataList,
  fetchDataList,
  queryDataList,
  resetDataList,
  exportDataList,
} = useSubBranchManager({
  baseQueryForm,
  apiDataList: fetchQueryBranchClassPage,
  apiExportDataList: fetchExportBranchClassPage
})

// 列表相关数据
const columnList = [
  { type: 'selection' },
  { width: '100', label: '培训班编号', prop: 'classId' },
  { width: '160', label: '培训班名称', prop: 'className' },
  { width: '200', label: '班主任', prop: 'realManager' },
  { width: '220', label: '举办单位', prop: 'blgOrgName' },
  { width: '120', label: '举办开始日期', prop: 'dateStart' },
  { width: '120', label: '举办结束日期', prop: 'dateEnd' },
  { width: '120', label: '培训班时长(小时)', prop: 'classHour' },
]

const selectedList = ref([])
function selectDataList (data) {
  selectedList.value = data
}

// 删除
function deleteDataList () {
  if (selectedList.value?.length) {
    customHint('删除后将重新统计参训率和参训人员明细', '确认要删除此培训班？', '取消').then(async res => {
      const classIds = selectedList.value.map(m => m.classId)
      const resDel = await fetchDeleteBranchClass({ classIds })
      queryDataList()
      Message.success('删除成功！')
    })
  } else {
    Message.warning('请选择要删除的培训班')
  }
}

// ============================== 导入 ==============================
const importFormShow = ref(false)
// 导入失败数据列表
const importFaildColumns = [
  { label: '培训班编号', prop: 'classId', width: '150px' },
  { label: '培训班归属年份', prop: 'branchYear', width: '90px' },
  { label: '失败原因', prop: 'msg', width: '200px' }
]
// 打开导入弹框
function openImportForm () {
  importFormShow.value = true
}
// 导入确认
async function comfirmImportForm (data) {
  console.log(data)
  await fetchSaveImportBranchClass({ successBatchId: data.successBatchId })
    importFormShow.value = false
    queryDataList()
    Message.success('新增成功！')
}

// ============================== 新增 ==============================
const baseFormShow = ref(false)
const baseInfoForm = reactive({
  year: '',
  classList: [{
    classId: ''
  }]
})
function classListRules (i) {
  return [
    { required: true, message: `培训班编号${i+1}不能为空`, trigger: 'blur' },
    { trigger: 'blur', validator: async (rule, value, cb) => {
      try {
        await fetchCheckBranchClass({ classId: value })
      } catch (err) {
        cb(new Error(err?.msg || ''))
      }
    }}
  ]
}

const trainingClassRef = ref(null)

function openBaseForm () {
  baseFormShow.value = true
  baseInfoForm.year = new Date().getFullYear()
  baseInfoForm.classList = [{ classId: '' }]
  trainingClassRef.value?.clearValidate()
}

function comfirmBaseForm () {
  trainingClassRef.value.validate(async (valid) => {
    if (valid) {
      const postData = {
        year: baseInfoForm.year,
        classIdList: baseInfoForm.classList.map(m => m.classId)
      }
      await fetchBatchAddBranchClass(postData)
      baseFormShow.value = false
      queryDataList()
      Message.success('新增成功！')
    }
  })
}
// 培训班新增：编号添加/删除
function classListChange (type, i) {
  if (type === 'add') {
    baseInfoForm.classList.push({ classId: '' })
  } else {
    baseInfoForm.classList.splice(i, 1)
  }
}

</script>