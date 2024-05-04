<template>
  <gc-model title="费用分摊" :visible="isDialogShow" width="95%" @close="close" @cancel="cancel" @comfirm="save" :is-append="true">
    <div class="cost-wrapper">
      <div class="header-wrapper">
        <p class="tip active">
          注：当前报销明细行本次报销金额为{{ originRow.amt }}，不含税金额为{{ originRow.excludingTaxAmt }}，税额为{{ originRow.taxAmt }}
        </p>
        <div class="controle-wrapper" v-show="!disabled">
          <el-button @click="addAllocation">新增</el-button>
          <el-button @click="removeAllocation">删除</el-button>
        </div>
      </div>
      <table-pagination
        :list="columns"
        :tableList="costDatas"
        :queryForm="{}"
        :getList="() => {}"
        :hide-pagination="true"
        @selection-change="selectionHandle"
        ref="tablePagination"
      >
        <el-table-column :selectable="selectable" slot="selection" type="selection" min-width="54"> </el-table-column>
        <el-table-column width="180" label="成本中心" slot="costCenterName">
          <template slot-scope="scope">
            <gc-input placeholder="" class="page-input" v-model="scope.row.costCenterName" :disabled="disabled || scope.$index === 0">
              <i slot="suffix" class="page-input__search" @click="open(scope.row, scope.$index)"></i>
            </gc-input>
          </template>
        </el-table-column>
        <el-table-column width="100" label="含税金额" slot="amt">
          <template slot-scope="scope">
            <gc-input v-model="scope.row.amt" @blur="handleCostInfoTableAmtBlur(scope.row, scope.$index)" :disabled="disabled"></gc-input>
          </template>
        </el-table-column>
        <el-table-column label="项目" min-width="180">
          <template slot-scope="scope" v-if="!scope.row.type">
            <el-input :disabled="disabled" class="input-suffix-type" readonly v-model="scope.row.projectName">
              <i slot="suffix" class="page-input__search" @click="openProductDialog(TYPE_PROJECT, scope.row, scope.$index)"></i>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="产品" min-width="180">
          <template slot-scope="scope" v-if="!scope.row.type">
            <el-input :disabled="disabled" class="input-suffix-type" readonly v-model="scope.row.productName">
              <i slot="suffix" class="page-input__search" @click="openProductDialog(TYPE_PRODUCT, scope.row, scope.$index)"></i>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="订单号" min-width="180">
          <template slot-scope="scope" v-if="!scope.row.type">
            <el-input :disabled="disabled" class="input-suffix-type" readonly v-model="scope.row.kuOrderName">
              <i slot="suffix" class="page-input__search" @click="openProductDialog(TYPE_ORDER_NUMBER, scope.row, scope.$index)"></i>
            </el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column min-width="96" label="不含税金额" slot="excludingTaxAmt">
          <template slot-scope="scope">
            不含税金额
          </template>
        </el-table-column> -->
      </table-pagination>
      <div class="table-footer-wrapper">
        <p class="label">合计金额</p>
        <p class="total-amt">{{ calculateTotalInfo.amt }}</p>
        <p class="excluding-tax-amt">{{ calculateTotalInfo.excludingTaxAmt }}</p>
        <p class="tax-amt">{{ calculateTotalInfo.taxAmt }}</p>
      </div>
    </div>
    <CostCenter
      :show.sync="isCostCenterShow"
      :disabled-fields="['orgCode']"
      :default-search="costCenterDefaultSearch"
      @save="costCenterSaveHandle"
    ></CostCenter>

    <!-- 项目，产品，订单号公共弹窗 -->
    <ProductModel
      :show.sync="productVisible"
      :orgSegment="costRow.orgSegment"
      :row="costRow"
      :productType="productType"
      :is-append="true"
      @save="productSave"
    />
  </gc-model>
</template>

<script setup>
import { CopyObj, uuid } from '@/util/utils'
import store from '@/store'
import { computed, reactive, ref, set, watch } from 'vue'
import CostCenter from './CostCenter'
import ProductModel from './ProductModel'
import { TYPE_PROJECT, TYPE_PRODUCT, TYPE_ORDER_NUMBER } from '@/views/Reimbursement/enum'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { useReimbursement } from '@/views/Reimbursement/hooks/useReimbursement'
import { Message } from 'element-ui'
const { originTaxRate, originInvoices, getExcludingTaxAmt, getRowTax } = useReimbursement()
const { mergeReactive } = useBaseDataEvents()

const emit = defineEmits(['save', 'cancel', 'input'])
const props = defineProps({
  show: {
    type: Boolean,
    required: false
  },
  value: {
    type: Array,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 进行分摊的明细行
  originRow: {
    type: Object,
    required: true
  }
})

const baseInfo = store.getters['reimbursed/getBaseInfo']
console.log(baseInfo, '===>>> baseInfo');
const costDatas = ref([])

const mergeBaseInfo = () => {
  // 机构/管理中心/成本中心
  const { orgDesc, orgSegment, manageCenterDesc, manageCenterCode, costCenterName, costCenterCode } = store.getters['reimbursed/getBaseInfo']
  
  costDatas.value = costDatas.value.map((row) => {
    return {
      orgDesc,
      orgSegment,
      manageCenterDesc,
      manageCenterCode,
      costCenterName,
      costCenterCode,
      uuid: uuid(),
      ...row
    }
  })

  console.log(costDatas.value)
}

const selectable = (row, index) => {
  if (props.disabled) return false
  return index !== 0
}

// 报销的基础信息。包含税额的等基础计算关联逻辑
const baseAllocationData = reactive({})

const createBaseAllocationData = (data) => {
  mergeReactive({
    origin: baseAllocationData,
    target: {
      ...data,
      costCenterName: data.costCenterName || props.originRow.costCenterName || baseInfo.costCenterName,
      amt: '',
      excludingTaxAmt: '',
      taxAmt: '',
      projectName: '',
      productName: '',
      kuOrderName: ''
    }
  })
}

watch(
  () => props.show,
  (n) => {
    if (!n) return
    console.log(props.value, props.originRow, '===>>> ori')
    originTaxRate.value = props.originRow.taxRate
    originInvoices.value = props.originRow.invoices
    costDatas.value = CopyObj(props.value).map((row) => {
      row.amt = row.amt || row.totalPriceTax
      row.excludingTaxAmt = getExcludingTaxAmt(CopyObj(row))
      row.taxAmt = getRowTax(CopyObj(row))
      console.log(row, '==+>>>');
      // row.taxAmt = getRowTax(CopyObj(row))
      return row
    })
    mergeBaseInfo()
    createBaseAllocationData(CopyObj(costDatas.value[0]))
  },
  { immediate: true }
)

const isDialogShow = computed(() => {
  return props.show
})

const columns = [
  {
    type: 'selection',
    slot: 'selection'
  },
  {
    label: '管理中心',
    type: 'setWidth',
    width: '150',
    prop: 'manageCenterDesc'
  },
  {
    label: '成本中心',
    slot: 'costCenterName'
  },
  {
    label: '含税金额',
    slot: 'amt'
  },
  {
    label: '不含税金额',
    type: 'setWidth',
    width: '100',
    prop: 'excludingTaxAmt'
  },
  {
    label: '税额',
    type: 'setWidth',
    width: '100',
    prop: 'taxAmt'
  },
  {
    label: '项目',
    slot: 'projectName'
  },
  {
    label: '产品',
    slot: 'productName'
  },
  {
    label: '订单号',
    slot: 'kuOrderName'
  }
]

const close = () => {
  emit('update:show', false)
}
const cancel = () => {
  emit('cancel')
  close()
}

const formatParams = (datas) => {
  let res = CopyObj(datas)
  res = res.map((row) => {
    return {
      ...row,
      totalPriceTax: row.amt,
      tax: row.tax || row.taxRate
    }
  })
  return res
}

const validatorData = () => {
  let totalAmt = 0
  let validatorCostCenterCode = true
  costDatas.value.forEach((row) => {
    if (!row.costCenterCode || !row.costCenterName) validatorCostCenterCode = false
    totalAmt += Number(row.amt)
  })

  console.log(costDatas.value, '====>>. validator')

  if (!validatorCostCenterCode) {
    Message.warning('成本中心必须填写')
    return false
  }

  if (Number(totalAmt.toFixed(2)) !== Number(props.originRow.amt)) {
    Message.warning('分摊的总金额必须等于当前报销明细的总额')
    return false
  }

  return true
}

const save = () => {
  if (!validatorData()) return
  emit('input', formatParams(costDatas.value))
  emit('save', formatParams(costDatas.value))
  close()
}

// const costCenterDefaultSearch = { orgCode: orgDesc, manageCenter: manageCenterDesc }
const costCenterDefaultSearch = reactive({ orgCode: '', manageCenter: '' })
const isCostCenterShow = ref(false)
const selectedRowIndex = ref(-1)
const open = (row, index) => {
  console.log(row, index)
  if(index === 0) return
  selectedRowIndex.value = index
  isCostCenterShow.value = true
  mergeReactive({ origin: costCenterDefaultSearch, target: { orgCode: row.orgDesc } })
  console.log(costCenterDefaultSearch, '===>> cc')
}

const costCenterSaveHandle = (row) => {
  if (selectedRowIndex.value === -1) return
  set(costDatas.value, selectedRowIndex.value, Object.assign({}, costDatas.value[selectedRowIndex.value], row))
  console.log(row, costDatas.value, '====>>> row')
}

const handleCostInfoTableAmtBlur = (row, index) => {
  console.log(row, '===??>>row')
  set(costDatas.value[index], 'excludingTaxAmt', getExcludingTaxAmt(CopyObj(row)))
  set(costDatas.value[index], 'taxAmt', getRowTax(CopyObj(row)))
}

const selectedList = ref([])
const selectionHandle = (list) => {
  selectedList.value = list
}

// 新增一条分摊信息
const addAllocation = () => {
  console.log(baseAllocationData, '===>>>>')
  const targetData = { ...CopyObj(baseAllocationData), uuid: uuid() }
  targetData.projectName = props.originRow.projectName
  targetData.projectCode = props.originRow.projectCode
  targetData.productName = props.originRow.productName
  targetData.productCode = props.originRow.productCode
  targetData.kuOrderName = props.originRow.kuOrderName
  targetData.kuOrderCode = props.originRow.kuOrderCode
  costDatas.value.push(targetData)
}

// 删除报销信息
const removeAllocation = () => {
  if(!selectedList.value.length) return Message.warning('请选择一条分摊信息')
  const cacheArr = []
  costDatas.value.forEach((row) => {
    if (selectedList.value.findIndex((findItem) => findItem.uuid === row.uuid) === -1) {
      cacheArr.push(row)
    }
  })
  costDatas.value = cacheArr
}

// 小数的计算有溢出风险， 做个格式化控制
const formatDecimals = (number) => {
  console.log(number, Number(number).toFixed(2))
  if (!number) return 0
  return Number(number).toFixed(2)
}

// 计算总计金额
const calculateTotalInfo = computed(() => {
  let amt = 0,
    excludingTaxAmt = 0,
    taxAmt = 0
  costDatas.value.forEach((row) => {
    amt = formatDecimals(Number(amt) + Number(row.amt))
    excludingTaxAmt = formatDecimals(Number(excludingTaxAmt) + Number(row.excludingTaxAmt))
    taxAmt = formatDecimals(Number(taxAmt) + Number(row.taxAmt))
  })
  return { amt, excludingTaxAmt, taxAmt }
})

// 打开 项目，产品，订单号公共dialog
const productVisible = ref(false)
const productType = ref('')
const costRow = ref({})
const productEditIndex = ref(-1)
const openProductDialog = (type, row, index) => {
  if (props.disabled) return
  productType.value = type
  costRow.value = CopyObj(row)
  productVisible.value = true
  productEditIndex.value = index
}
// 弹窗保存处理
const productSave = (data) => {
  if (productEditIndex === -1) return
  console.log(costDatas.value, productEditIndex.value, data, '===data')
  let formatData = {}
  switch (productType.value) {
    case TYPE_PROJECT:
      formatData.projectCode = data.assistCode
      formatData.projectName = data.assistDesc
      break
    case TYPE_PRODUCT:
      formatData.productCode = data.assistCode
      formatData.productName = data.assistDesc
      break
    case TYPE_ORDER_NUMBER:
      formatData.kuOrderNo = data.assistCode
      formatData.kuOrderName = data.assistDesc
      break
  }
  set(costDatas.value, productEditIndex.value, Object.assign({}, costDatas.value[productEditIndex.value], formatData))
}
</script>
<style lang='scss' scoped>
.header-wrapper {
  display: grid;
  grid-template-columns: 80% 20%;
  align-items: center;
  margin-bottom: 10px;
  .controle-wrapper {
    text-align: right;
  }
}
.table-footer-wrapper {
  height: 40px;
  padding: 10px;
  background-color: #f7f8fa;
  border: 1px solid #ebeef5;
  border-top: 0;
  display: grid;
  grid-template-columns: 54px+150px+180px 100px 100px 100px auto;
  align-items: center;
}
</style>