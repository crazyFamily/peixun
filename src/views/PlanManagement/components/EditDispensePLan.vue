<template>
  <div class="edit-box">
    <gc-model width="1200px" :visible="isDialogShow" @close="handleCancel" @cancel="handleCancel" @comfirm="handleSave" title="计划分配">
      <el-tabs v-model="activeName">
        <el-tab-pane label="分配计划" name="dispensePlanInfo"></el-tab-pane>
        <el-tab-pane label="已分配记录" name="dispensePlanLog"></el-tab-pane>
      </el-tabs>
      <div class="content-wrapper">
        <div class="dispense-info-wrapper" v-show="activeName === 'dispensePlanInfo'">
          <div class="info-wrapper">
            <p class="title-wrapper">
              <span>基本信息</span>
            </p>
            <div class="content">
              <p class="item name">机构名称： <span class="value">{{ dispenseInfo.blgDeptName }}</span></p>
              <p class="item">业务模块： <span class="value">{{ dispenseInfo.channelTypeDesc }}</span></p>
              <p class="item">项目类型：<span class="value">{{ dispenseInfo.trainSeriesDesc }}</span></p>
              <p class="item">总期数：<span class="value">{{ dispenseInfo.termNum }}</span></p>
              <p class="item name">项目名称：<span class="value">{{ dispenseInfo.className }}</span></p>
              <p class="item">关键岗位：<span class="value">{{ dispenseInfo.keyJobsDesc }}</span></p>
              <p class="item">子系列：<span class="value">{{ dispenseInfo.childSeriesDesc }}</span></p>
            </div>
          </div>
          <div class="edit-wrapper">
            <p class="title-wrapper">
              <span>计划分配</span>
              <span>
                <span class="label-item">已分配期数：{{ dispenseInfo.dispenseNum }}</span>
                <span class="label-item">剩余分配期数：{{ dispenseInfo.remainNum }}</span>
              </span>
            </p>
            <div class="content">
              <div class="empty-wrapper" v-show="!editDispenseFormData.datas.length">
                <el-button class="button-w80-h30" @click="addDispense"> 新增 </el-button>
              </div>
              <div class="content-edit-wrapper" v-show="editDispenseFormData.datas.length">
                <el-form inline :model="editDispenseFormData" ref="dispenseFormRef" :rules="formRules">
                  <template v-for="(item, index) in editDispenseFormData.datas">
                    <div class="form-item-wrapper">
                      <el-form-item label="分配单位" :prop="`datas.${index}.blgDept`" :rules="formRules.blgDept">
                        <gc-institution v-model="editDispenseFormData.datas[index].blgDept" :org-url="API_SELECT_FIXED_TREE" :fetch-params="{ busiType: blgLine }"></gc-institution>
                      </el-form-item>
                      <el-form-item label="分配期数" :prop="`datas.${index}.dispenseNum`" :rules="formRules.dispenseNum">
                        <el-input v-model="editDispenseFormData.datas[index].dispenseNum"></el-input>
                      </el-form-item>
                      <el-form-item label="">
                        <span class="active edit-buttons" @click="addDispense">新增</span>
                        <span class="active edit-buttons" @click="remoteDispense(index)">删除</span>
                      </el-form-item>
                    </div>
                  </template>
                </el-form>
              </div>
            </div>
          </div>
        </div>
        <!-- 已分配记录 -->
        <div class="dispense-log-wrapper" v-show="activeName === 'dispensePlanLog'">
          <div class="menu-right">
            <span class="instructor-icons__download" @click="exportLog">
              <i class="instructor-icons__download__icon"></i>
              导出
            </span>
          </div>
          <table-pagination :list="columns" :tableList="tableList" :page-sizes="[5, 10]"  :queryForm="queryForm" :getList="getList" auto-height ref="tablePaginationRef">
            <el-table-column label="操作" min-width="124">
              <template slot-scope="scope">
                <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
                  <div slot="content" class="tooltip__operation">
                    <span class="active" @click="editLogDispense(scope.row)">编辑</span>
                    <span class="active" @click="removeLogDispense(scope.row)">删除</span>
                  </div>
                  <el-button class="button-48-24">操作</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </table-pagination>
        </div>
      </div>
    </gc-model>
    <gc-model :visible="isDialogShowLog" @close="handleCloseLog()" @cancel="handleCancelLog" @comfirm="handleSaveLogEdit" title="编辑">
      <div class="edit-log-wrapper">
        <div class="edit-base-info">
          <p class="item">
            <span class="label">项目名称: </span><span class="value">{{dispenseInfo.className}}</span>
          </p>
          <p class="item">
            <span class="label">剩余分配期数: </span><span class="value">{{totalRemainNum - currentEditLogRow.dispenseNum}}</span>
          </p>
          <p class="item one-liner">
            <span class="label">分配单位: </span><span class="value">{{currentEditLogRow.blgDeptName}}</span>
          </p>
        </div>
        <el-form inline :model="currentEditLogRow" :rules="logFormRules" ref="dispenseLogFormRef" class="edit-form">
          <el-form-item label="分配期数: " prop="dispenseNum">
            <el-input v-model="currentEditLogRow.dispenseNum"></el-input>
          </el-form-item>
          <el-form-item label="已举办期数: ">{{currentEditLogRow.holdNum}}</el-form-item>
        </el-form>
      </div>
    </gc-model>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
import { useTable } from '@/hooks/useTable'
import {
  fetchAddDispensePlan,
  fetchDeleteDispensePlan,
  fetchDispensePlanDetail,
  fetchExportDispensePlanPage,
  fetchQueryDispensePlanPage,
  fetchUpdateDispensePlan
} from '@/fetch/planManagement'
import { customHint, debounce, renderName, throttle } from '@/util/utils'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { Message } from 'element-ui'
import { API_SELECT_FIXED_TREE } from '@/fetch/public'
import store from '@/store'
import { useAnnual } from '../hooks/useAnnual'
const { getAnnualPackageInfo } = useAnnual()
const { mergeReactive, clearReactive } = useBaseDataEvents()
const baseLogParams = {
  total: 0,
  currPage: 1,
  pageSize: 5
}
const { requiredHandle, queryForm } = useTable(baseLogParams)
const isDialogShow = ref(false)
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  id: {
    type: [Number, String],
    required: true
  }
})

const dispenseInfo = reactive({})

const getDetailInfo = async (id) => {
  if (!id) return
  const res = await fetchDispensePlanDetail({ annualPlanId: id })
  mergeReactive({ origin: dispenseInfo, target: res })
}
const resetData = () => {
  clearReactive(dispenseInfo)
  editDispenseFormData.datas = []
  activeName.value = 'dispensePlanInfo'
}

const blgLine = ref(undefined)
watch(
  () => props.show,
  (n) => {
    isDialogShow.value = n
    if (n) {
      getDetailInfo(props.id)
      queryLogData(props.id)
      blgLine.value = getAnnualPackageInfo().blgStripLine
      resetData()
    }
  },
  { immediate: true }
)

const activeName = ref('dispensePlanInfo')

const emit = defineEmits('update:show', 'save', 'close')
const dispenseFormRef = ref(null)
const handleClose = throttle(() => {
  // 由于element框架在这里触发了右上按钮和脚部的交互，这里会触发两次。用节流方法解决
  emit('update:show', false)
  emit('close')
})
const handleCancel = () => {
  handleClose()
}
const handleSave = () => {
  dispenseFormRef.value.validate(async (v) => {
    if (!v) return
    if (!editDispenseFormData.datas.length) {
      handleClose()
      emit('save')
    } else {
      const data = {
        annualPlanId: props.id,
        dispenseList: editDispenseFormData.datas.map((row) => ({ ...row, blgDept: row.blgDept[1] }))
      }
      await fetchAddDispensePlan(data)
      Message.success('保存成功')
      handleClose()
      emit('save')
    }
  })
}

const baseDispenseInfo = {
  blgDept: [],
  dispenseNum: ''
}
const editDispenseFormData = reactive({
  datas: [CopyObj(baseDispenseInfo)]
})
const editDispenseDatas = ref([])

const addDispense = () => {
  editDispenseFormData.datas.push(CopyObj(baseDispenseInfo))
}

const remoteDispense = (index) => {
  editDispenseFormData.datas.splice(index, 1)
}

const formRules = {
  dispenseNum: [
    requiredHandle('请输入分配期数'),
    {
      validator: (rule, value, callback) => {
        if (isNaN(value) || value.includes('.') || Number(value <= 0) || parseInt(value) !== Number(value)) return callback(new Error('请输入大于0的正整数'))
        // 校验已分配不可大于剩余分配
        let total = 0
        editDispenseFormData.datas.forEach((row) => {
          total += Number(row.dispenseNum)
        })
        if (total > Number(dispenseInfo.remainNum)) return callback(new Error(`不可大于剩余分配期数`))
        return callback()
      },
      blur: 'change'
    }
  ],
  blgDept: [
    requiredHandle('请选择分配单位'),
    {
      validator: (rule, value, callback) => {
        if (!value.length) return callback(new Error('请选择分配单位'))
        return callback()
      }
    }
  ]
}

const columns = [
  { label: '序号', type: 'index' },
  { label: '分配单位', prop: 'blgDeptName' },
  { label: '分配期数', prop: 'dispenseNum' },
  { label: '分配时间', prop: 'updatedDate' },
  { label: '分配人', prop: 'updatedBy', formatter: (row) => renderName(row.updatedByName, row.updatedBy) },
  { label: '已举办期数', prop: 'holdNum' }
]
const tableList = ref([])
const queryLogData = (id) => {
  if (!id) return
  queryForm.currPage = 1
  queryForm.annualPlanId = id
  getList()
}
const getList = async () => {
  const data = queryForm
  const { total, list } = await fetchQueryDispensePlanPage({ data })
  tableList.value = list
  queryForm.total = total
}
const exportLog = () => {
  const data = queryForm
  fetchExportDispensePlanPage({ data })
}

const removeLogDispense = async (row) => {
  await customHint('是否确实取消此计划分配？', '提示', '取消', true, '确认')
  await fetchDeleteDispensePlan({ id: row.id })
  Message.success('删除成功')
  getDetailInfo(props.id)
  queryLogData(props.id)
}

const logFormRules = {
  dispenseNum: [
    requiredHandle('请输入分配期数'),
    {
      validator: (rule, value, callback) => {
        if (isNaN(value) || value.includes('.') || Number(value <= 0) || parseInt(value) !== Number(value)) return callback(new Error('请输入大于0的正整数'))
        // if (isNaN(value) < currentEditLogRow.value.holdNum) return callback(new Error('分配期数不可小于已举办期数, 请重新填写'))
        if (totalRemainNum.value - currentEditLogRow.value.dispenseNum < 0) return callback(new Error(`剩余期数不足，请重新填写`))
        return callback()
      },
      blur: 'change'
    }
  ]
}

const dispenseLogFormRef = ref(null)
const currentEditLogRow = ref({ dispenseNum: '' })
const isDialogShowLog = ref(false)
const handleCloseLog = () => {
  isDialogShowLog.value = false
}
const handleCancelLog = () => {
  handleCloseLog()
}
const handleSaveLogEdit = async () => {
  dispenseLogFormRef.value.validate(async v => {
    if(!v) return
    const data = {
      id: currentEditLogRow.value.id,
      dispenseNum: currentEditLogRow.value.dispenseNum
    }
    await fetchUpdateDispensePlan({ data })
    Message.success('提交成功')
    getDetailInfo(props.id)
    queryLogData(props.id)
    isDialogShowLog.value = false
  })
}
const totalRemainNum = ref(0)
const editLogDispense = (row) => {
  console.log(row, '==>> row')
  currentEditLogRow.value = CopyObj(row)
  totalRemainNum.value = Number(currentEditLogRow.value.dispenseNum) + Number(dispenseInfo.remainNum)
  isDialogShowLog.value = true
}
</script>
<script>
export default {
  name: 'EditDispensePLan'
}
</script>

<style lang='scss' scoped>
.dispense-info-wrapper {
  .info-wrapper {
    border: 1px solid #eaecf1;
    .content {
      padding: 10px 25px;
      display: flex;
      flex-wrap: wrap;
    }

    .item {
      color: #999;
      width: 23.33%;
      padding-right: 10px;
      box-sizing: border-box;
      margin: 20px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item.name {
      width: 30%;
    }
    .value {
      color: #666;
    }
  }

  .edit-wrapper {
    border: 1px solid #eaecf1;
    margin-top: 20px;
    .content {
      min-height: 70px;
    }
  }
}

.title-wrapper {
  height: 40px;
  padding: 10px;
  font-weight: unset;
  color: #7d8292;
  background-color: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-wrapper {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-item-wrapper {
  display: flex;
  justify-content: space-between;
  width: 55%;
  min-width: 700px;
  margin: 10px auto;
  margin-bottom: 0;

  :deep(.el-form-item) {
    margin-bottom: 10px;
  }
  :deep(.el-form-item__content) {
    height: 30px;
  }
}

.content-edit-wrapper {
  padding: 10px 0;
}

.edit-buttons {
  padding: 0 10px;
}

.label-item {
  padding-left: 20px;
}

.name-over-style {
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  // max-width: 70%;

  :deep(.el-form-item__content) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 79%;
  }
}

.one-liner {
  :deep(.el-form-item) {
    width: 100%;
  }
}

.edit-base-info {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 30px;
    margin-bottom: 22px;

    .label {
      padding-right: 12px;
      color: #999;
    }

    &:first-child {
      margin-right: 25px;
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .one-liner {
    width: 100%;
  }
}

.edit-form {
  :deep(.el-form-item__label) {
    color: #999 !important;
  }
}
</style>