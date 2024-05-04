<template>
    <!-- 关联专票 dialog -->
    <gc-model class="LaunchTrainingCourse__common-dialog" title="关联专票" :visible="relationTicketVisible" width="1000px" @close="relationTicketClose" @cancel="relationTicketVisible = false" @comfirm="relationTicketComfirm">
        <el-form :model="relationTicketForm" inline>
            <el-form-item label="发票号码头" class="mr20">
                <el-input ref="relationTicketFormInput" class="relation-ticket-form-input" placeholder="" v-model.trim="relationTicketForm.invoiceNoSta"></el-input>
            </el-form-item>
            <el-form-item label="发票号码尾">
                <el-input placeholder="" v-model.trim="relationTicketForm.invoiceNoEnd"></el-input>
            </el-form-item>
            <div class="fr">
                <el-button class="LaunchTrainingCourse__common-dialog__title__right__query button-60" @click="relationTicketClickQuery">查询</el-button>
                <el-button class="LaunchTrainingCourse__common-dialog__title__right__reset button-60-blue-plain" @click="relationTicketReset">重置</el-button>
                <el-button class="LaunchTrainingCourse__common-dialog__title__right__relation button-60-blue-primary" @click="relationInvoice">关联发票</el-button>
            </div>
        </el-form>
        <table-pagination ref="relationTicketTableRef" @selection-change="selectionHandle" :getList="relationTicketQuery" :queryForm="relationTicketForm" :list="relationTicketList" :tableList="relationTicketTable" :stripe="false">
        </table-pagination>
        <div class="LaunchTrainingCourse__common-dialog__vice-title LaunchTrainingCourse__title">
            <div class="LaunchTrainingCourse__title__left">
                <span class="LaunchTrainingCourse__title__left__menu"> </span>
                已关联
            </div>
            <div class="icons LaunchTrainingCourse__common-dialog__vice-title__right">
                <el-button class="button-60-blue-primary" @click="unrelationInvoice">取消关联</el-button>
            </div>
        </div>
        <gc-table class="mt20 general__table" :list="relationTicketList" :span-method="arraySpanMethod" show-summary :summary-method="getSummaries" :tableList="relationTicketViceTable" :stripe="false" ref="relationTicketViceTableRef">
            <el-table-column label="差额征税金额" prop="balanceTaxAmount" min-width="120">
                <template slot-scope="scope">
                    <gc-input :disabled="disabled" @blur="handleCostInfoTableAmtBlur(scope.row)" v-model="scope.row.balanceTaxAmount"></gc-input>
                </template>
            </el-table-column>
        </gc-table>
        <div class="differ__tips mt20">差额征税填写说明：若关联差额征税专票，不含税金额进行更新，计算公式为：不含税金额=差额征税金额+（报销行金额-差额征税金额）/（1+专票税率）</div>
    </gc-model>
</template>

<script>
import { CopyObj, resetObj, myFloat } from '@/util/utils'
import { fetchSelectInvoice } from '@/fetch/reimbursement'
import { fetchSelectFastInvoice } from '@/fetch/reimbursement'
import summary from './summary'
export default {
  name: 'InvoicesModel',
  mixins: [summary],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    // 报销单头部机构的代码
    orgSegment: {
      type: String,
      default: ''
    },
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      // 关联专票dialog里的 form表单
      relationTicketForm: {
        belongOrganCode: '',
        invoiceNoSta: '',
        invoiceNoEnd: '',
        currPage: 1,
        pageSize: 10
      },
      // 关联专票 dialog状态
      relationTicketVisible: false,
      // 关联专票 tabel字段数组
      relationTicketList: [
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
          prop: 'invoiceType',
          label: '发票类型',
          value: '发票类型',
          width: '120'
        },
        {
          prop: 'invoiceNo',
          label: '发票号码',
          value: '发票号码'
        },
        {
          prop: 'invoiceCode',
          label: '发票代码',
          value: '发票代码'
        },
        {
          prop: 'invoiceDetailBranchNo',
          label: '发票内容',
          value: '发票内容'
        },
        {
          prop: 'excludingTaxAmt',
          label: '不含税金额',
          value: '不含税金额'
        },
        {
          prop: 'tax',
          label: '税额',
          value: '税额'
        },
        {
          prop: 'taxRate',
          label: '税率',
          value: '税率'
        },
        {
          prop: 'totalPriceTax',
          label: '价税合计',
          value: '价税合计'
        }
      ],
      // 关联专票 tabel数据数组
      relationTicketTable: [],
      // 关联专票 副tabel字段数组 和 关联专票 tabel字段数组一样
      // 关联专票 副tabel数据数组
      relationTicketViceTable: [],
      // 关联专票选中未关联数组
      selectCodeList: [],
      // 关联专票选中已关联数组
      selectViceCodeList: [],
      // 报销单头部机构的代码
      orgCode: ''
    }
  },
  methods: {
    // 差额征税金额 失焦事件
    handleCostInfoTableAmtBlur(row) {
      row.balanceTaxAmount = (myFloat(row.balanceTaxAmount) || '') + ''
      const allAmtArr = this.relationTicketViceTable.filter(
        v => v.balanceTaxAmount
      )
      if (
        allAmtArr.length > 2 ||
        (allAmtArr.length && this.relationTicketViceTable.length > 1)
      ) {
        this.$message.warning('存在差额征税专票，当前报销行仅允许关联一行发票')
      }
    },
    // 勾选未关联发票数据
    selectionHandle(list) {
      this.selectCodeList = list
    },
    // 关联专票确定事件
    relationTicketComfirm() {
      if (this.disabled) {
        this.$emit('update:show', false)
        this.relationTicketReset()
        return
      }
      if (this.checkRelationTable()) {
        this.$emit('update:show', false)
        this.relationTicketReset()
        this.$emit('comfirm', this.relationTicketViceTable)
      }
    },
    // 校验表单填写的数据
    checkRelationTable() {
      const allAmtArr = this.relationTicketViceTable.filter(
        v => v.balanceTaxAmount
      )
      if (allAmtArr.length >= 2) {
        this.messagebox('存在差额征税专票，当前报销行仅允许关联一行发票')
        return
      } else if (allAmtArr.length) {
        // 将经办人录入的差额征税金额（大于0）放入下面的公式中：税额=（价税合计-差额征税金额）*税率/（1+税率），得到的计算“税额”与发票的“税额”进行比较，若税额差异在0.01范围内，则校验通过，若差异超过0.01，则报错“差额征税金额不正确”
        // 税额=（价税合计-差额征税金额）*税率/（1+税率）
        const tax =
          ((Number.parseFloat(
            this.relationTicketViceTable[0].totalPriceTax || 0
          ) -
            Number.parseFloat(
              this.relationTicketViceTable[0].balanceTaxAmount
            ) || 0) *
            Number.parseFloat(this.relationTicketViceTable[0].taxRate || 0)) /
          100 /
          (1 +
            Number.parseFloat(this.relationTicketViceTable[0].taxRate || 0) /
              100)
        if (
          Math.abs(
            tax - Number.parseFloat(this.relationTicketViceTable[0].tax || 0)
          ) > 0.01
        ) {
          this.messagebox('差额征税金额不正确')
          return
        }
        // 需要校验该报销行的报销金额必须等于所关联专票的价税合计
        if (
          Number(this.row.amt || 0).toFixed(2) !==
          Number(this.relationTicketViceTable[0].totalPriceTax || 0).toFixed(2)
        ) {
          this.messagebox('报销行的报销金额必须等于所关联专票的价税合计')
          return
        }
      } else {
        let sum = 0
        this.relationTicketViceTable.forEach(v => {
          sum += Number(v.totalPriceTax) || 0
        })
        if ((Number(this.row.amt || 0) > sum.toFixed(2)) && this.relationTicketViceTable.length) {
          this.messagebox('报销行金额必须小于等于所关联专票的价税合计')
          return
        }
      }
      return true
    },
    // 取消关联专票
    unrelationInvoice() {
      if (this.disabled) return
      const selectCode = this.$refs.relationTicketViceTableRef.$children[0]
        .selection
      this.relationTicketViceTable = this.relationTicketViceTable.filter(
        v => !selectCode.includes(v)
      )
      this.selectViceCodeList = []
      this.$refs.relationTicketViceTableRef.$children[0].clearSelection()
    },
    // 关联专票
    relationInvoice() {
      if (this.disabled) return
      let flag = false
      this.selectCodeList.forEach(v => {
        if (!this.relationTicketViceTable.length) {
          this.relationTicketViceTable.push(v)
        } else if (!this.relationTicketViceTable.includes(v)) {
          if (
            parseInt(v.taxRate) !==
            parseInt(this.relationTicketViceTable[0].taxRate)
          ) {
            flag = true
          } else {
            this.relationTicketViceTable.push(v)
          }
        }
      })
      if (flag) {
        this.messagebox('不能关联不同税率的专票')
      }
      this.$refs.relationTicketTableRef.$refs.tableRef.clearSelection()
    },
    // 查询可关联专票函数
    relationTicketQuery() {
      this.relationTicketForm.belongOrganCode = this.orgCode
      fetchSelectFastInvoice(this.relationTicketForm).then(res => {
        const { list, total } = res
        this.relationTicketTable = list
        this.relationTicketForm.total = total
      })
    },
    // 重置可关联专票
    relationTicketReset() {
      this.relationTicketForm = this.$options.data.call(this).relationTicketForm
      this.relationTicketTable = []
      this.selectCodeList = []
    },
    // 查询可关联专票
    relationTicketClickQuery() {
      if (
        this.relationTicketForm.invoiceNoSta ||
        this.relationTicketForm.invoiceNoEnd
      ) {
        this.relationTicketForm.currPage = 1
        this.relationTicketQuery()
      } else {
        this.$refs.relationTicketFormInput.focus()
      }
    },
    // 关联专票dialog 关闭事件
    relationTicketClose() {
      this.$emit('update:show', false)
      this.relationTicketReset()
      this.selectViceCodeList = []
      this.relationTicketViceTable = []
    },
    // messsage 弹窗工具函数
    messagebox(content) {
      this.$alert(content, '通知', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout autoHeight`
      })
    },
    // 合计金额合并列
    arraySpanMethod() {
      this.objectSpanMethod('relationTicketViceTableRef')
    },
    // 合计金额计算
    getSummaries(param) {
      return this.getNodeSummaries(param, '合 计 金 额', [
        'excludingTaxAmt',
        'tax',
        'totalPriceTax',
        'balanceTaxAmount'
      ])
    },
    _initData() {
      const arr = this.row.invoices
      this.relationTicketViceTable = arr ? CopyObj(arr) : []
    }
  },
  watch: {
    show: {
      handler(n) {
        this.relationTicketVisible = n
        this._initData()
      },
      immediate: true
    },
    orgSegment(n) {
      this.orgCode = n
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
.LaunchTrainingCourse__common-dialog .differ__tips {
  color: #fd6720;
}
</style>