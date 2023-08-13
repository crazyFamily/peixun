<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" ref="queryFormRef" inline >
        <el-form-item label="学员信息">
          <el-input class="w200" placeholder="请输入学员姓名/UM号" v-model.trim="queryForm.umId" clearable />
        </el-form-item>
        <div class="buttons">
          <el-button @click="queryDataList()" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetDataList(false)" class="button-w80-h30">重置</el-button>
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
            <span class="icons__upload" @click="openBaseForm('add')"><i class="icons__add__icon"></i>新增</span>
            <span class="icons__upload" @click="_openImportForm()"><i class="icons__upload__icon"></i>批量新增</span>
            <span class="icons__del" @click="deleteBatchStudent()"><i class="icons__del__icon"></i>删除</span>
            <span class="icons__upload" @click="exportDataList()"><i class="icons__upload__icon"></i>导出</span>
          </div>
        </div>
      </div>
      <table-pagination
        :pageSizes="[5,10]"
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="queryDataListFormat"
        @selection-change="selectDataList"
        v-loading="getLoadingStatus('LOADING_STUDENT_FOSTER_EVALUATE')"
        ref="tablePaginationRef">
        <el-table-column slot="actionDesc" label="关键行为" width="150">
          <template slot-scope="scope">
            <CellToolTip
              :data-info="scope.row.targetActions" 
              :columns="columnCellToolTip"
              cell-content="详情">
            </CellToolTip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active mr10" @click="openBaseForm('view', scope.row)">查看</span>
              <span v-if="isEdit" class="item active" @click="openBaseForm('edit', scope.row)">编辑</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量导入弹框 -->
    <ImportModel
      :show="importFormShow"
      :faildColumns="importFaildColumns"
      :uploadParams="uploadParams"
      :importFetchFn="fetchImportBatchStudentFosterEvaluate"
      :faildExportFetchFn="fetchExportFailFosterEvaluate"
      templateCode="STUDENT_FOSTER_EVALUATE_BRACH"
      @showChange="importFormShow = $event"
      @comfirm="_comfirmImportForm"
    ></ImportModel>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, reactive, computed } from 'vue'
import { filterBusiType, customHint, tableSelectionChange, CopyObj } from '@/util/utils'
import { Message } from 'element-ui'
import { fetchUserInfos } from '@/fetch/public'
import { usePageList } from '@/hooks/usePageList'
import { 
  fetchListStudentFosterEvaluate,
  fetchExportStudentFosterEvaluate,
  fetchDeleteStudentFosterEvaluate,
  fetchFindStudentFosterEvaluateById,
  fetchFindStudentFosterEvaluateAction,
  fetchImportBatchStudentFosterEvaluate,
  fetchBatchHandleStudentFosterEvaluate,
  fetchExportFailFosterEvaluate 
} from '@/fetch/establish'
import ImportModel from '@/components/upload/ImportModel'
import { useImportModel } from '@/components/upload/hooks/useImportModel'
import CellToolTip from '@/components/cellTooltip/index'
import { 
  TRAINING_TYPE_OPTIONS, 
  TRAINING_TYPE_OPTIONS_VALUES,
  TRAINING_TYPE_OPTIONS_ZS,
  TRAINING_TYPE_OPTIONS_ZL,
  TRAINING_TYPE_OPTIONS_ZY,
  TRAINING_TYPE_OPTIONS_YNSL,
  TRAINING_TYPE_OPTIONS_YNTX,
  TRAINING_TYPE_OPTIONS_YNJG,
  EVALUATION_TYPE_OPTIONS_WTX,
  EVALUATION_TYPE_OPTIONS 
} from '@/views/Establish/enum'
const emits = defineEmits(['pageChange'])
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
  umId: '', // 学员信息
  fosterType: [],
  pageSize: 5
}
const {
  tableFilterSetting,
  getLoadingStatus,
  queryForm,
  dataList,
  selectedList,
  selectDataList,
  queryDataListFormat,
  queryDataList,
  resetDataList,
  exportDataList,
  deleteDataList
} = usePageList({
  baseQueryForm,
  apiDataList: fetchListStudentFosterEvaluate,
  apiExportDataList: fetchExportStudentFosterEvaluate,
  queryFormFormat,
})

function queryFormFormat (params) {
  params.classId = props.classId
  return params
}

const evaluationMetaArr = [
  { field: 'overallView', label: '大局观', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZS, TRAINING_TYPE_OPTIONS_YNSL] },
  { field: 'pioneer', label: '开创性', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZS, TRAINING_TYPE_OPTIONS_YNSL] },
  { field: 'wolfNature', label: '狼性', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZL, TRAINING_TYPE_OPTIONS_YNTX] },
  { field: 'innovation', label: '创新力', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZL, TRAINING_TYPE_OPTIONS_ZY, TRAINING_TYPE_OPTIONS_YNTX, TRAINING_TYPE_OPTIONS_YNJG] },
  { field: 'executivePower', label: '执行力', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZY, TRAINING_TYPE_OPTIONS_YNJG] },
  { field: 'effect', label: '影响力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
  { field: 'synergy', label: '协同力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
  { field: 'learningAbility', label: '学习力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
]

const getEvaluationMeta = (type = 'field') => {
  const res = type === 'culumn' ? [] : {}
  evaluationMetaArr.forEach(item => {
    const actionField = item.field + 'Action'
    const actionLabel = item.label + '关键行为'
    if (type === 'field') { 
      // 表单字段
      res[item.field] = ''
      res[actionField] = ''
    } else if (type === 'rule') { 
      // 验证字段
      res[item.field] = [{ required: true, message: '请选择' + item.label, trigger: 'change' }]
      res[actionField] = [{ required: true, message: '请输入' + actionLabel, trigger: 'blur' }]
    } else { 
      // 列表字段
      res.push({ label: item.label, width: '100', prop: item.field + 'Desc' })
    } 
  })
  return res
}
const columnList = [
  { type: 'selection' },
  { type: 'index', label: '序号', width: '64' },
  { label: '姓名', width: '120', prop: 'umName' },
  { label: 'UM号', width: '162', prop: 'umId' },
  { label: '培养类型', width: '120', prop: 'fosterTypeDesc',
    ...tableFilterSetting('fosterType', TRAINING_TYPE_OPTIONS)
  },
  ... getEvaluationMeta('culumn'),
  { slot: 'actionDesc' },
  { label: '突出特征', width: '200', prop: 'salientFeature' },
  { label: '更新人', width: '150', prop: 'updatedByStr' },
  { label: '更新时间', width: '150', prop: 'updatedDate' },
]
const columnCellToolTip = [
  { label: '指标', prop: 'targetName', 'show-overflow-tooltip': false, type: 'setWidth', width: '100px' },
  { label: '关键行为', prop: 'action', 'show-overflow-tooltip': false },
]
function deleteBatchStudent () {
  if (!selectedList.value?.length) {
    return Message.warning('请至少选择一条记录')
  }
  customHint('确定要删除所选学员吗？', '提示', '取消')
  .then(async () => {
    const params = selectedList.value.map(m => ({ classId: m.classId, umId: m.umId }))
    await fetchDeleteStudentFosterEvaluate(params)
    queryDataList()
    Message.success('删除成功！')
  })
}

function deleteOneStudent (row) {
  customHint('确定要删除此学员吗？', '提示', '取消')
  .then(async () => {
    const ids = [ row.id ]
    await fetchDeleteStudentFosterEvaluate({ ids })
    queryDataList()
    Message.success('删除成功！')
  })
}

// ============================== 导入 ==============================
// 导入失败数据列表
const importFaildColumns = [
  { label: 'UM号', prop: 'umId', width: '120px' },
  { label: '学员姓名', prop: 'umName', width: '120px' },
  { label: '失败原因', prop: 'msg', width: '200px' }
]
const {
  importFormShow,
  openImportForm,
  comfirmImportForm
} = useImportModel({
  fetchSave: fetchBatchHandleStudentFosterEvaluate,
  queryDataList
})
const uploadParams = ref({})
function _openImportForm () {
  uploadParams.value = {
    classId: props.classId,
  }
  openImportForm()
}
function _comfirmImportForm (data) {
  data.classId = props.classId
  data.tip = 'Y'
  comfirmImportForm(data)
}
// ============================== 新增 ==============================

const baseBaseInfo = {
  classId: '',
  id: '',
  umId: '', // UM号
  umName: '', // 姓名
  umInfo: '',
  fosterType: '',
  ... getEvaluationMeta('field')
}
function openBaseForm (type, row) {
  if (type === 'add') { // 新增
    row = CopyObj(baseBaseInfo)
    row.classId = props.classId
  } else {
    row.umInfo = `${row.umName} (${row.umId})`
  }
  emits('pageChange', {
    pageName: 'form',
    formType: type,
    row 
  })
}
defineExpose({
  queryDataList
})
// ============================== 初始化 ==============================
watch(() => props.classId, (newV) => {
  console.log("classId", newV)
  if (newV) {
    queryDataList()
  }
}, { immediate: true })

</script>
