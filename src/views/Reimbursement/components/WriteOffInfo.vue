<template>
  <div class="WriteOffInfo">
    <div class="LaunchTrainingCourse__info-card__reimbursement__write-off__title LaunchTrainingCourse__title vice-title">
      <div class="LaunchTrainingCourse__title__left-small">
        <div>.</div>
        核销信息
      </div>
      <div v-show="!disabled" class="icons">
        <span class="icons__add" @click="addWriteOffInfoTableOneItem">
          <i class="icons__add__icon"></i>
          新增
        </span>
        <span class="icons__del" @click="delWriteOffInfoTableOneItem">
          <i class="icons__del__icon"></i>
          删除
        </span>
      </div>
    </div>
    <div class="LaunchTrainingCourse__info-card__reimbursement__write-off__content table__wrapper">
      <div class="width-fit">
        <el-table :span-method="arraySpanMethod" show-summary :summary-method="getSummaries" :data="writeOffInfoTable" ref="writeOffInfoTableRef">
          <el-table-column type="selection" width="54">
          </el-table-column>
          <el-table-column type="index" label="序号" width="54"></el-table-column>
          <el-table-column label="核销类型" min-width="205">
            <template slot-scope="scope">
              <gc-select :disabled="disabled" placeholder="请选择" :options="[{
                            label: '预付款',
                            value: '1'
                          },
                          {
                            label: '挂账',
                            value: '2'
                          }]" v-model="scope.row.cancelType"></gc-select>
            </template>
          </el-table-column>
          <el-table-column label="挂账单号" min-width="205">
            <template slot-scope="scope">
              <gc-input placeholder="" class="page-input" :disabled="disabled" v-model="scope.row.advancePayExpenseNo">
                <i slot="suffix" class="page-input__search" @click="handleAccountSearchDialogOpen(
                              scope.$index,
                              scope.row
                            )
                          "></i>
              </gc-input>
            </template>
          </el-table-column>
          <el-table-column label="挂账金额" min-width="103">
            <template slot-scope="scope">{{
                      scope.row.advancePayTotalAmt
                    }}</template>
          </el-table-column>
          <el-table-column label="挂账时间" min-width="126">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column label="挂账说明" min-width="205">
            <template slot-scope="scope">
              <gc-input :disabled="disabled" placeholder="" v-model="scope.row.desc">
              </gc-input>
            </template>
          </el-table-column>
          <el-table-column label="历史已核销金额" min-width="139">
            <template slot-scope="scope">{{
                      scope.row.canceledAmt
                    }}</template>
          </el-table-column>
          <el-table-column label="核销占用金额" min-width="127">
            <template slot-scope="scope">{{
                      scope.row.occupiedAmt
                    }}</template>
          </el-table-column>
          <el-table-column label="可核销金额" min-width="115">
            <template slot-scope="scope">{{
                      scope.row.noCancelAmt
                    }}</template>
          </el-table-column>
          <el-table-column prop="thisTimeCancelAmt" label="本次核销金额" min-width="126">
            <template slot-scope="scope">
              <gc-input @blur="transformFloat(scope.row, 'thisTimeCancelAmt')" :disabled="disabled" v-model="scope.row.thisTimeCancelAmt"></gc-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 挂账账单查询 dialog -->
    <gc-model class="LaunchTrainingCourse__common-dialog LaunchTrainingCourse__redio" cancelText="" confirmText="选择" title="挂账单查询" ref="accountSearchDialogRef" :visible="accountSearchVisible" width="800px" @close="
        handleNestingPopupAfterClose('accountSearchDialogRef')
        accountSearchReset()
        accountSearchVisible = false
        accountSearchTable = []
      " @comfirm="accountSearchComfirm">
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <gc-input class="left" label="报账单号" v-model="accountSearchForm.expenseId"></gc-input>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button class="button-60-blue-plain" @click="accountSearchClickQuery">查询</el-button>
          <el-button class="button-60-blue-primary" @click="accountSearchReset">重置</el-button>
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content tabpane">
        <gc-table class="LaunchTrainingCourse__content general__table" ref="accountSearchTableRef" :list="accountSearchList" :tableList="accountSearchTable" :stripe="false" :vLoading="accountSearchDialogTableVLoading" @selection-change="
            tableSelectionChange($event, 'accountSearchTableRef')
          ">
          <el-table-column label="挂账说明">
            <template slot-scope="scope">
              <gc-tooltip :content="scope.row.advancePayExpenseBranchDesc" :length="50">
              </gc-tooltip>
            </template>
          </el-table-column>
        </gc-table>
        <gc-pagination :total="accountSearchForm.total" layout="prev, pager, next,slot, sizes" prev-text="" next-text="" :totalisShow="false" :page-sizes="[2, 4, 6]" :page-size="accountSearchForm.pageSize" :current-page="accountSearchForm.currPage" @sizeChange="accountSearchSizeChange" @currentChange="accountSearchPageChange">
          <span class="text">每页显示</span>
        </gc-pagination>
      </div>
    </gc-model>
  </div>
</template>

<script>
import $ from 'jquery'
import { CopyObj, myFloat, transformFloat } from '@/util/utils'
import summary from './summary'
import { fetchSelectFastReimCancel } from '@/fetch/reimbursement'
export default {
  name: 'WriteOffInfo',
  mixins: [summary],
  props: {
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    },
    // 核销信息 原始数据数组
    cancels: {
      type: Array,
      default: () => []
    },
    payeeInfoTable: {
      type: Array,
      default: () => []
    },
    classesInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 核销信息 table数据数组
      writeOffInfoTable: [],
      // 挂账单查询 dialog状态
      accountSearchVisible: false,
      // 挂账单查询 dialog form表单
      accountSearchForm: {
        cancelBillType: '',
        supplierCode: '',
        vendorSiteId: '',
        expenseId: '',
        currPage: 1,
        pageSize: 2
      },
      // 挂账单查询 table 字段数组
      accountSearchList: [
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
          prop: 'cancelBillType',
          label: '挂账类型',
          value: '挂账类型'
        },
        {
          prop: 'advancePayExpenseNo',
          label: '挂账单号',
          value: '挂账单号'
        },
        {
          prop: 'advancePayTotalAmt',
          label: '挂账金额',
          value: '挂账金额'
        },
        {
          prop: 'noCancelAmt',
          label: '可核销金额',
          value: '可核销金额'
        }
      ],
      // 挂账单查询 table 数据数组
      accountSearchTable: [],
      // 挂账单查询 table loading状态
      accountSearchDialogTableVLoading: false,
      transformFloat
    }
  },
  methods: {
    // 核销信息 新增事件
    addWriteOffInfoTableOneItem() {
      this.writeOffInfoTable.push({
        advancePayTotalAmt: '',
        advancePayExpenseNo: '',
        advancePayExpenseBranchDesc: '',
        noCancelAmt: '',
        advancePayExpenseBranchId: ''
      })
    },
    // 核销信息 删除事件
    delWriteOffInfoTableOneItem() {
      const selection = this.$refs.writeOffInfoTableRef.selection
      this.writeOffInfoTable = this.writeOffInfoTable.filter(
        v => !selection.includes(v)
      )
    },
    // 挂账单dialog 打开
    handleAccountSearchDialogOpen(index, row) {
      if (this.disabled) return
      this.accountSearchForm.cancelBillType = row.cancelType
      if (!this.accountSearchForm.cancelBillType) {
        return this.$alert('请先选择核销类型', '通知', {
          confirmButtonText: '知道了',
          customClass: `loginTimeout`
        })
      }
      this.accountSearchForm.index = index
      this.accountSearchVisible = true
    },
    //  解决嵌套弹窗的工具函数 之 dialog 关闭后的处理
    handleNestingPopupAfterClose(ref) {
      const parentNode = this.$refs[ref].$el
      const child = parentNode.querySelector('.v-modal')
      if (child) {
        parentNode.removeChild(child)
      }
    },
    // 挂账单 重置
    accountSearchReset() {
      this.accountSearchForm.expenseId = ''
    },
    // 挂账单查询 dialog comfirm 事件
    accountSearchComfirm() {
      const selection = this.$refs.accountSearchTableRef.$children[0]
        .selection[0]
      const item = this.writeOffInfoTable[this.accountSearchForm.index]
      if (selection) {
        delete selection['cancelType']
        delete selection['thisTimeCancelAmt']
        _.merge(item, selection)
      }
      this.accountSearchVisible = false
    },
    // 挂账单 查询 事件
    accountSearchClickQuery() {
      this.accountSearchForm.currPage = 1
      this.accountSearchQuery(true)
    },
    // 挂账单 查询函数
    accountSearchQuery(flag) {
      const { supplierCode } = this.payeeInfoTable[0] || {}
      const { payeePlaceLayerNo: vendorSiteId } =
        (this.payeeInfoTable[0] || {}).reimSupplier || {}
      if (!(supplierCode && vendorSiteId)) {
        return this.handleNestingPopup(
          'accountSearchDialogRef',
          '请先选择供应商信息',
          '通知',
          '知道了',
          'account-search-dialog-message'
        )
      }
      if (flag) {
        this.accountSearchDialogTableVLoading = true
      }
      this.accountSearchForm.supplierCode = supplierCode
      this.accountSearchForm.vendorSiteId = vendorSiteId
      this.accountSearchForm.orgCode = this.classesInfo.orgSegment
      
      fetchSelectFastReimCancel(this.accountSearchForm).then(res => {
        this.accountSearchDialogTableVLoading = false
        const { list, total } = res
        list.forEach(v => {
          let cancelBillType
          if (this.accountSearchForm.cancelBillType === '1') {
            cancelBillType = '预付款'
          } else if (this.accountSearchForm.cancelBillType === '2') {
            cancelBillType = '挂账'
          }
          v.cancelBillType = cancelBillType
        })
        this.accountSearchTable = list
        this.accountSearchForm.total = total
      })
    },
    // 挂账单查询 dialog sizechange 事件
    accountSearchSizeChange(size) {
      this.accountSearchForm.pageSize = size.pageSize
      this.accountSearchForm.currPage = 1
      this.accountSearchQuery()
    },
    // 挂账单查询 dialog pagechange 事件
    accountSearchPageChange(page) {
      this.accountSearchForm.currPage = page.pageNum
      this.accountSearchQuery()
    },
    // SelectionChange 事件 table多选变单选
    tableSelectionChange(selection, ref) {
      if (selection.length > 1) {
        this.$refs[ref].$children[0].clearSelection()
        this.$refs[ref].$children[0].toggleRowSelection(selection.pop())
      }
    },
    // 合计金额合并列
    arraySpanMethod() {
      this.objectSpanMethod('writeOffInfoTableRef')
    },
    // 合计金额计算
    getSummaries(param) {
      return this.getNodeSummaries(param, '合 计 金 额', ['thisTimeCancelAmt'])
    },
    //  解决嵌套弹窗的工具函数
    handleNestingPopup(ref, context, title, confirmButtonText, className) {
      let vmodal = this.$refs[ref].$el.querySelector('.v-modal').cloneNode(true)
      this.$alert(context, title, {
        confirmButtonText: confirmButtonText,
        customClass: `loginTimeout ${className}`,
        callback: () => {
          document.body.removeChild(
            document.querySelector(`.${className}`).parentNode.nextSibling
          )
          if (!this.$refs[ref].$el.querySelector('.v-modal')) {
            this.$refs[ref].$el.appendChild(vmodal)
          }
        }
      })
    },
    _initData() {
      this.writeOffInfoTable = CopyObj(this.cancels)
    }
  },
  mounted() {},
  watch: {
    cancels: {
      deep: true,
      handler(n) {
        this._initData()
      }
    },
    writeOffInfoTable: {
      deep: true,
      handler(n) {
        this.$emit('save', this.writeOffInfoTable)
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
.WriteOffInfo {
  padding: 0 20px;
}
</style>