<template>
  <!-- 成本中心 dialog -->
  <gc-model
    class="LaunchTrainingCourse__cost-center"
    title="成本中心"
    comfirmText="选择"
    cancelText=""
    :visible="costCenterVisible"
    @close="costCenterClose"
    width="900px"
    @comfirm="costCenterComfirm"
    :is-append="true"
  >
    <div class="df">
      <el-form inline @submit.native.prevent>
        <el-form-item class="first-item" label-width="58px" label="机构">
          <el-input
            placeholder="请输入机构名称/代码"
            v-model.trim="costCenterDialogForm.orgCode"
            :disabled="disabledFields.includes('orgCode')"
          ></el-input>
        </el-form-item>
        <el-form-item label="业务段">
          <el-input
            placeholder="请输入业务段名称/代码"
            v-model.trim="costCenterDialogForm.manageCenter"
            :disabled="disabledFields.includes('manageCenter')"
          ></el-input>
        </el-form-item>
        <el-form-item label="成本中心">
          <el-input
            placeholder="请输入成本中心名称/代码"
            v-model.trim="costCenterDialogForm.costCenter"
            :disabled="disabledFields.includes('costCenter')"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="LaunchTrainingCourse__cost-center__btns sw-150 fs0" style="padding-left: 15px">
        <el-button @click="costCenterClickQuery">查询</el-button>
        <el-button class="reset-btn" @click="costCenterReset">重置</el-button>
      </div>
    </div>
    <table-pagination
      class="table-radio"
      :radio="true"
      @select="selectionHandle"
      :queryForm="costCenterDialogForm"
      :list="costCenterList"
      :getList="costCenterQuery"
      :tableList="costCenterTable"
    >
    </table-pagination>
  </gc-model>
</template>

<script setup>
import { CopyObj } from '@/plugins/until'
import { Message } from 'element-ui'
import { computed, reactive, ref, watch } from 'vue'
import { fetchSelectFastCostCenter } from '@/fetch/reimbursement'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
const { mergeReactive } = useBaseDataEvents()
const emit = defineEmits(['save', 'cancel'])
const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  defaultSearch: {
    type: Object,
    default: () => {}
  },
  // 设置只读状态的字段
  disabledFields: {
    type: Array,
    default: () => []
  }
})

const costCenterVisible = computed(() => {
  return props.show
})

const baseFormData = {
  orgCode: '',
  manageCenter: '',
  costCenter: '',
  total: 0,
  currPage: 1,
  pageSize: 10
}
const costCenterDialogForm = reactive(CopyObj(baseFormData))

// 展开的时候按传入的默认查询项进行设值
watch(
  () => props.show,
  (n) => {
    if (!n) return
    if (Object.keys(props.defaultSearch).length) {
      mergeReactive({ origin: costCenterDialogForm, target: CopyObj(props.defaultSearch) })
    }
    costCenterTable.value = []
  },
  { immediate: true }
)

const costCenterList = [
  {
    width: '54',
    type: 'selection'
  },
  {
    label: '序号',
    type: 'index',
    value: '序号',
    width: '60'
  },
  {
    prop: 'costCenterCode',
    label: '代码',
    value: '代码'
  },
  {
    prop: 'costCenterName',
    label: '名称',
    value: '名称'
  }
]
const costCenterTable = ref([])
const selectedList = ref([])

const selectionHandle = (list) => {
  selectedList.value = list
}

const close = () => {
  emit('update:show', false)
}
const costCenterClose = () => {
  mergeReactive({ origin: costCenterDialogForm, target: baseFormData })
  close()
}
const costCenterComfirm = () => {
  emit('save', selectedList.value[0])
  close()
}
const costCenterClickQuery = () => {
  costCenterDialogForm.currPage = 1
  costCenterQuery()
}
const costCenterQuery = () => {
  if (!costCenterDialogForm.orgCode && !costCenterDialogForm.manageCenter && !costCenterDialogForm.costCenter) {
    return Message.warning('请填写查询参数')
  }
  fetchSelectFastCostCenter(costCenterDialogForm).then((res) => {
    const { list, total } = res || {}
    costCenterTable.value = list
    costCenterDialogForm.total = total
  })
}
const costCenterReset = () => {
  mergeReactive({origin: costCenterDialogForm, target: baseFormData})
  costCenterClickQuery()
}
</script>
<style lang='scss' scoped>
</style>