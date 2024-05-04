<template>
  <div class="AccountsInfo">
    <div class="LaunchTrainingCourse__info-card__reimbursement__accounts__title LaunchTrainingCourse__title vice-title">
      <div class="LaunchTrainingCourse__title__left-small">
        <div>.</div>
        挂账信息
      </div>
      <div v-show="!disabled" class="icons">
        <span class="icons__add" @click="addAccountsInfo"> <i class="icons__add__icon"></i>新增 </span>
        <span class="icons__del" @click="delAccountsInfo"> <i class="icons__del__icon"></i>删除 </span>
      </div>
    </div>
    <div class="LaunchTrainingCourse__info-card__reimbursement__accounts__content table__wrapper">
      <div class="width-fit">
        <el-table :span-method="arraySpanMethod" show-summary :summary-method="getSummaries" :data="accountsInfoTable" ref="accountsInfoTableRef">
          <el-table-column type="selection" min-width="54"> </el-table-column>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column label="挂账大类" min-width="160" prop="suspendMaxCategoryDesc">
            <template slot-scope="scope">
              <gc-input placeholder="" class="page-input" :disabled="disabled" v-model="scope.row.suspendMaxCategoryDesc">
                <i slot="suffix" class="page-input__search" @click="openAccountDialog(scope.row)"></i>
              </gc-input>
            </template>
          </el-table-column>
          <el-table-column label="挂账小类" min-width="300">
            <template slot-scope="scope">{{ scope.row.suspendMinCategoryDesc }}</template>
          </el-table-column>
          <el-table-column prop="amt" label="金额" min-width="146">
            <template slot-scope="scope">
              <gc-input :disabled="disabled" v-model="scope.row.amt" @blur="transformFloat(scope.row, 'amt')"> </gc-input>
            </template>
          </el-table-column>
          <el-table-column label="预算科目" min-width="180">
            <template slot-scope="scope">
              <el-input
                class="input-suffix-type"
                :disabled="disabled"
                readonly
                v-if="estimateHead(scope.row.accountingSubjectCd)"
                v-model="scope.row.subjectProjectDesc"
              >
                <i slot="suffix" class="page-input__search" @click="openProductDialog('subject', scope.row)"></i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="支付日期" min-width="190">
            <template slot-scope="scope">
              <el-date-picker
                class="LaunchTrainingCourse__date"
                :disabled="disabled"
                v-model="scope.row.payDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :clearable="false"
              >
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="项目" min-width="180">
            <template slot-scope="scope">
              <el-input class="input-suffix-type" :disabled="disabled" readonly v-model="scope.row.channelOrProjectDesc">
                <i slot="suffix" class="page-input__search" @click="openProductDialog('item', scope.row)"></i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="产品" min-width="180">
            <template slot-scope="scope">
              <el-input class="input-suffix-type" :disabled="disabled" readonly v-model="scope.row.productDesc">
                <i slot="suffix" class="page-input__search" @click="openProductDialog('product', scope.row)"></i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="订单号" min-width="180">
            <template slot-scope="scope">
              <el-input class="input-suffix-type" :disabled="disabled" readonly v-model="scope.row.orderNoDesc">
                <i slot="suffix" class="page-input__search" @click="openProductDialog('orderNumber', scope.row)"></i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="挂账事项" min-width="264">
            <template slot-scope="scope">
              <gc-input placeholder="" :disabled="disabled" v-model="scope.row.suspendMatters"></gc-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 挂账大小类 dialog -->
    <gc-model
      class="LaunchTrainingCourse__common-dialog LaunchTrainingCourse__account-size-category-dialog"
      cancelText=""
      confirmText="选择"
      title="挂账大小类"
      :visible="accountSizeVisible"
      width="800px"
      @close="accountClose"
      @comfirm="accountSizeComfirm"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item class="LaunchTrainingCourse__common-dialog__title__left__first">
              <gc-input label="大类" class="left" v-model="accountSizeForm.max"></gc-input>
            </el-form-item>
            <el-form-item>
              <gc-input label="小类" class="left" v-model="accountSizeForm.min"></gc-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="mr20">
          <el-button class="button-60" @click="accountSizeClickQuery">查询</el-button>
          <el-button class="button-60-blue-primary" @click="accountSizeReset">重置</el-button>
        </div>
      </div>
      <table-pagination
        class="table-radio mt20"
        :list="accountSizeList"
        :radio="true"
        :tableList="accountSizeTable"
        :queryForm="accountSizeForm"
        @select="selectionHandle"
        :getList="accountSizeQuery"
        ref="scoretablePagination"
        :pageSizes="[5, 10]"
      >
      </table-pagination>
    </gc-model>
    <!-- 科目参考，项目，产品，订单号公共弹窗 -->
    <ProductModel :show.sync="productVisible" :row="costRow" :orgSegment="classesInfo.orgSegment" :productType="productType" />
  </div>
</template>

<script>
import { CopyObj } from '@/util/utils'
import { transformFloat } from '@/util/utils'
import { fetchSelectFastSuspendType } from '@/fetch/reimbursement'
import ProductModel from './ProductModel'
import summary from './summary'
export default {
  name: 'AccountsInfo',
  mixins: [summary],
  props: {
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    },
    // 挂账信息 原始数据数组
    suspends: {
      type: Array,
      default: () => []
    },
    classesInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ProductModel
  },
  data() {
    return {
      transformFloat,
      // 挂账信息 table数据数组
      accountsInfoTable: [],
      // 挂账大小类 dialog状态
      accountSizeVisible: false,
      // 挂账大小类 table 字段数组
      accountSizeList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          width: '60',
          type: 'index',
          value: '序号'
        },
        {
          prop: 'suspendMaxCategory',
          label: '大类代码',
          value: '大类代码'
        },
        {
          prop: 'suspendMaxCategoryDesc',
          label: '大类名称',
          value: '大类名称'
        },
        {
          prop: 'suspendMinCategory',
          label: '小类代码',
          value: '小类代码'
        },
        {
          prop: 'suspendMinCategoryDesc',
          label: '小类名称',
          value: '小类名称',
          width: '150'
        },
        {
          prop: 'accountingSubjectCd',
          label: '会计科目代码',
          value: '会计科目代码',
          width: '150'
        }
      ],
      // 挂账大小类 table 数据数组
      accountSizeTable: [],
      // 挂账大小类 table 数据数组 loading 状态
      accountSizeDialogTableVLoading: false,
      // 选中的挂账大小类数组
      selectCodeList: [],
      // 挂账大小类 dialog form表单
      accountSizeForm: {
        max: '',
        min: '',
        currPage: 1,
        pageSize: 5
      },
      // 项目，产品，订单号 dialog状态
      productVisible: false,
      // 项目，产品，订单号 dialog状态
      productType: '',
      // 项目，产品，订单号 对象
      costRow: {}
    }
  },
  methods: {
    // 关闭挂账大小类
    accountClose() {
      this.accountSizeForm = this.$options.data.call(this).accountSizeForm
      this.accountSizeVisible = false
    },
    // 勾选挂账大小类数组
    selectionHandle(list) {
      this.selectCodeList = list
    },
    // 新增挂账信息
    addAccountsInfo() {
      this.accountsInfoTable.push({
        suspendMaxCategory: '',
        suspendMaxCategoryDesc: '',
        suspendMinCategory: '',
        suspendMinCategoryDesc: '',
        amt: '',
        payDate: '',
        suspendMatters: '',
        accountingSubjectCd: ''
      })
    },
    // 删除挂账信息
    delAccountsInfo() {
      const selection = this.$refs.accountsInfoTableRef.selection
      this.accountsInfoTable = this.accountsInfoTable.filter(v => !selection.includes(v))
    },
    // 挂账大小类 dialog 查询函数
    accountSizeQuery() {
      this.accountSizeDialogTableVLoading = true
      fetchSelectFastSuspendType(this.accountSizeForm)
        .then(res => {
          const { list, total } = res
          this.accountSizeTable = list
          this.accountSizeForm.total = total
        })
        .finally(() => {
          this.accountSizeDialogTableVLoading = false
        })
    },
    // 判断会计科目是否以105开头
    estimateHead(code) {
      if (code === null) return false
      return /^105/.test(code)
    },
    // 打开 挂账大小类dialog
    openAccountDialog(row) {
      if (this.disabled) return
      this.costRow = row
      this.accountSizeQuery()
      this.accountSizeVisible = true
    },
    // 打开 项目，产品，订单号公共dialog
    openProductDialog(type, row) {
      if (this.disabled) return
      this.productType = type
      this.costRow = row
      if (type === 'subject') this.costRow.expenseType = row.suspendMinCategory
      this.productVisible = true
    },
    // 挂账大小类 dialog comfirm事件
    accountSizeComfirm() {
      if (this.selectCodeList.length) {
        const select = this.selectCodeList[0]
        Object.keys(this.costRow).forEach(v => {
          if (select[v]) {
            this.costRow[v] = select[v]
          }
        })
      }
      this.accountSizeVisible = false
    },
    // 挂账大小类 dialog 查询事件
    accountSizeClickQuery(flag) {
      this.accountSizeForm.currPage = 1
      this.accountSizeQuery()
    },
    // 挂账大小类 dialog 重置事件
    accountSizeReset() {
      this.accountSizeForm = this.$options.data.call(this).accountSizeForm
      this.accountSizeQuery()
    },
    // 合计金额合并列
    arraySpanMethod() {
      this.objectSpanMethod('accountsInfoTableRef')
    },
    // 合计金额计算
    getSummaries(param) {
      return this.getNodeSummaries(param, '合 计 金 额', ['amt'])
    },
    _initData() {
      this.accountsInfoTable = CopyObj(this.suspends)
    }
  },
  mounted() {},
  watch: {
    suspends: {
      deep: true,
      handler(n) {
        this._initData()
      }
    },
    accountsInfoTable: {
      deep: true,
      handler(n) {
        this.$emit('save', this.accountsInfoTable)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-table__footer-wrapper td.el-table__cell) {
  border-top: 0 none;
}
:deep(.el-table__footer-wrapper tbody td) {
  background-color: #fff !important;
}
:deep(.el-table__footer-wrapper tbody .cell) {
  color: #7d8292;
}
:deep(.el-table__footer-wrapper tbody td[colspan='2']) {
  background-color: #f9fafc !important;
}
.AccountsInfo {
  padding: 0 20px;
}
</style>