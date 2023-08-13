<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" ref="queryFormRef" inline >
        <el-form-item label="员工机构" prop="orgIds">
          <gc-institution 
            :org-url="APIAllTree" 
            v-model="queryForm.orgIds"
            @change="queryForm.orgName = $event"
            ref="institutionRef" />
        </el-form-item>
        <el-form-item label="员工信息">
          <el-input class="w200" placeholder="请输入姓名/UM号" v-model.trim="queryForm.umId" clearable />
        </el-form-item>
        <div class="buttons">
          <el-button @click="queryDataList()" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetDataList()" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-wapper" v-if="isEdit">
        <div class="menu-left">
        </div>
        <div class="menu-right">
          <div class="icons no-line df">
            <span class="icons__upload" @click="choiceStudentVisible = true"><i class="icons__add__icon"></i>新增学员</span>
            <span class="icons__upload" @click="exportDataList()"><i class="icons__upload__icon"></i>导出</span>
            <span class="icons__upload" @click="importStudentVisible = true"><i class="icons__upload__icon"></i>批量导入</span>
            <span class="icons__del" @click="clearDataList()"><i class="icons__del__icon"></i>清空</span>
          </div>
        </div>
      </div>
      <table-pagination
        :pageSizes="[5,10]"
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="queryDataListFormat"
        v-loading="getLoadingStatus('LOADING_STUDENT_ADJUST')"
        ref="tablePaginationRef">
        <el-table-column label="操作" min-width="86" fixed="right" v-if="isEdit">
          <template slot-scope="scope">
            <span class="active mr10" @click="deleteOneStudent(scope.row)">
              <el-tooltip content="删除" popper-class="icon-popper">
                <i class="operation__del"></i>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <InstructorBatchImport title="批量导入学员"
      :visible.sync="importStudentVisible"
      @change="studentImportChange"
      @templateDownload="downloadAdapter({ templateCode: 'TRAINING_COURSE_STUDENT_MANAGE' })"
      @comfirm="studentImportComfirm"
      @close="studentImportClose"
      :comfirm-loading="getLoadingStatus('LOADING_BATCH_CLASS_STUDENT')"
    >
      <div v-if="importStudentData && importStudentData.isUpload">
        <p style="margin-bottom: 5px;">
          {{ `上传结果：${importStudentData.successLength} 条数据导入成功，${importStudentData.failLength} 条数据导入失败`}}
        </p>
        <p v-for="error in importStudentData.fail" :key="error" class="error-color">{{ error }}</p>
      </div>
    </InstructorBatchImport>

    <gc-model title="选择新增学员" width="800px" :visible.sync="choiceStudentVisible" isAppend
      @close="choiceStudentCannel"
      @comfirm="choiceStudentComfirm">
      <div class="between">
        <div>
          <span>请输入学员（UM号）</span>
          <el-input class="w200 ml10" placeholder="请输入UM号" v-model.trim="addStudentSearchUmId" ref="searchUmidRef"
            @keydown.enter="handleAddStudent"
            clearable></el-input>
          <el-button type="primary" class="button-60-h30 ml20" @click="handleAddStudent" >查询</el-button>
        </div>
      </div>
      <gc-table
        class="general__table mt20 table-radio"
        ref="choiceStudenTableRef"
        :list="choiceStudenList"
        :stripe="false"
        :tableList="choiceStudenTableList"
        @selection-change="tableSelectionChange($refs, $event, 'choiceStudenTableRef')" />
      </gc-model>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, reactive, computed } from 'vue'
import { filterBusiType, customHint, tableSelectionChange, downloadAdapter } from '@/util/utils'
import { Message } from 'element-ui'
import { APIAllTree } from '@/fetch/public'
import { usePageList } from '@/hooks/usePageList'

import { 
  fetchListStudentAdjust, 
  fetchExportClassStudent,
  fetchBatchClassStudent,
  fetchDeleteStudent,
  fetchManagerCommit,
  fetchListEmployeeInfo 
  } from '@/fetch/establish'

const props = defineProps({
  classId: {
    type: String || Number,
    default: ''
  },
  operationType: {
    type: String,
    default: 'edit'
  }
})
const isEdit = computed(() => props.operationType === 'edit')
const baseQueryForm = {
  classId: '', // 培训班Id
  busiType: '', // 机构
  orgIds: [], // 机构
  orgId: '', // 机构id
  orgName: '',
  umId: '',
  pageSize: 5
}
const columnList = [
  { type: 'index', label: '序号', width: '64' },
  { label: '姓名', width: '120', prop: 'empName' },
  { label: 'UM号', width: '162', prop: 'umId' },
  { label: '条线', width: '108', prop: 'busiType', formatter: (row) => filterBusiType(row.busiType) },
  { label: '机构', width: '282', prop: 'orgName' },
  { label: '岗位', width: '318', prop: 'posts' }
]
const {
  getLoadingStatus,
  queryForm,
  dataList,
  queryDataListFormat,
  queryDataList,
  resetDataList,
  exportDataList,
  deleteDataList
} = usePageList({
  baseQueryForm,
  apiDataList: fetchListStudentAdjust,
  apiExportDataList: fetchExportClassStudent,
  queryFormFormat,
})

function queryFormFormat (params) {
  params.classId = props.classId
  params.busiType = params.orgIds?.[0]
  params.orgId = params.orgIds?.[1]
  return params
}

function clearDataList () {
  customHint('确定要清空学员吗？', '提示', '取消')
  .then(async () => {
    const params = { classId: props.classId, umId: -1 }
    await fetchDeleteStudent(params)
    queryDataList()
    Message.success('清空成功！')
  })
}

function deleteOneStudent (row) {
  customHint('确定要删除此学员吗？', '提示', '取消')
  .then(async () => {
    const params = { classId: props.classId, umId: row.umId }
    await fetchDeleteStudent(params)
    queryDataList()
    Message.success('删除成功！')
  })
}



// ============================== 导入 ==============================
const importStudentVisible = ref(false)
const importStudentData = ref({
        isUpload: false,
        fail: [],
        success: [],
        failLength: 0,
        successLength: 0
      }) 
// 批量导入文件对象
const batchChannelStudentFile = ref({})
// 批量导入Change事件
async function studentImportChange($event) {
  batchChannelStudentFile.value = $event.target.files[0]
  $event.target.value = ''
  nextTick(() => {
    if (!batchChannelStudentFile.value.name) {
      setImportStudentData()
    }
  })
}
// 批量导入积分提交
async function studentImportComfirm() {
  if (!batchChannelStudentFile.value.name) {
    return Message.warning('请选择文件后再提交')
  }
  if (batchChannelStudentFile.value) {
    const data = new FormData()
    data.append('file', batchChannelStudentFile.value)
    data.append('classId', props.classId)
    fetchBatchClassStudent(data).then((resData) => {
      setImportStudentData(resData)
      queryDataList()
      if (resData.fail?.length) {
        // manyLineHint(resData.fail)
      } else {
        importStudentVisible.value = false
        Message.success('批量导入成功')
      }
    })
  }
}
// 批量导入 关闭事件
function studentImportClose() {
  importStudentVisible.value = false
  batchChannelStudentFile.value = {}
  setImportStudentData()
}
function setImportStudentData (data) {
  if (data && data.success && data.fail) {
    importStudentData.value.isUpload = data.success.length || data.fail.length
    importStudentData.value.successLength = data.success.length
    importStudentData.value.failLength = data.fail.length
    importStudentData.value.success = data.success
    importStudentData.value.fail = data.fail
  } else {
    importStudentData.value = {
      isUpload: false,
      fail: [],
      success: [],
      failLength: 0,
      successLength: 0
    }
  }
}
// ============================== 选择学员添加 ==============================

// 选择新增学员dialog状态
const choiceStudentVisible = ref(false)
  // 选择新增学员dialog 表格字段数组
const choiceStudenList = ref([
  { type: 'selection' },
  { type: 'index', label: '序号', width: '64' },
  { label: '姓名', width: '120', prop: 'empName' },
  { label: 'UM号', width: '162', prop: 'umId' }
])
const choiceStudenTableList = ref([])
const choiceStudenTableRef = ref(null)
const addStudentSearchUmId = ref('')
// 选择新增学员 确认事件
function choiceStudentComfirm() {
  const selection = choiceStudenTableRef.value.$children[0].selection
  if (!selection.length) {
    choiceStudentVisible.value = false
    return
  }
  const data = { list: selection, classId: props.classId }
  fetchManagerCommit(data).then(resData => {
    Message.success('添加成功')
    choiceStudentVisible.value = false
    choiceStudenTableList.value = []
    addStudentSearchUmId.value = ''
    queryDataList()
  })
}

function choiceStudentCannel () {
  choiceStudentVisible.value = false
  choiceStudenTableList.value = []
  addStudentSearchUmId.value = ''
}

// 新增学员
const searchUmidRef = ref(null)
function handleAddStudent() {
  if (!addStudentSearchUmId.value) {
    Message.warning('新增学员时，请输入学员UM号(用于模糊查询)')
    searchUmidRef.value.focus()
    return
  }
  const data = {
    umId: addStudentSearchUmId.value.toUpperCase()
  }
  fetchListEmployeeInfo(data).then(resData => {
    if (resData?.length) {
      choiceStudenTableList.value = resData
    } else {
      Message.warning('未找到该学员')
    }
  })
}

// ============================== 初始化 ==============================
watch(() => props.classId, (newV) => {
  console.log("classId", newV)
  if (newV) {
    queryDataList()
  }
}, { immediate: true })

</script>
