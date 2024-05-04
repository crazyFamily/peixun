<template>
  <div class="ReimbursedInfo">
    <div>
      <div class="ReimbursedInfo__title">
        <div class="ReimbursedInfo__title__left-small">
          <div>.</div>
          费用信息
        </div>
        <div v-show="!disabled" class="icons">
          <span class="icons__add" @click="reimbursementInfoVisible = true">
            <i class="icons__add__icon"></i>新增
          </span>
          <span class="icons__del" @click="handleDelReimbursementInfo">
            <i class="icons__del__icon"></i>删除
          </span>
        </div>
      </div>
      <div class="LaunchTrainingCourse__info-card__reimbursement__cost__content">
        <gc-table class="general__table" ref="costInfoTableRef" :stripe="false" :list="costInfoList" :tableList="costInfoTable" :span-method="costSpanMethod" :cell-class-name="costCellClassName" @selection-change="costInfoSelectionChange">
          <template>
            <el-table-column label="可报销金额" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.type">
                  {{ scope.row.costCanReimbursementTotal }}
                </span>
                <span v-else>
                  {{ myRound(
                              scope.row.budgetAmt -
                                (scope.row.payedAmt || 0) -
                                (scope.row.occupyAmt || 0),
                              2,
                              true
                            )
                          }}</span>
              </template>
            </el-table-column>
            <el-table-column label="本次报销金额" min-width="186">
              <template slot-scope="scope">
                <span v-if="scope.row.type"> {{ scope.row.costBudgetAmtTotal }} </span>
                <gc-input :disabled="disabled" v-else @blur="handleCostInfoTableAmtBlur(scope.row)" v-model="scope.row.amt"></gc-input>
              </template>
            </el-table-column>
            <el-table-column label="不含税金额" min-width="110">
              <template slot-scope="scope">
                <span v-if="scope.row.type"></span>
                <span v-if="disabled">{{ scope.row.excludingTaxAmt }}</span>
                <span v-else>{{ getExcludingTaxAmt(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="税额" min-width="110">
              <template slot-scope="scope">
                <span v-if="scope.row.type"></span>
                <span v-if="disabled">{{ scope.row.taxAmt }}</span>
                <span v-else>{{ getRowTax(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="预算科目" min-width="180">
              <template slot-scope="scope">
                <!--  -->
                <template v-if="estimateHead(scope.row.accountingSubjectCd)">
                  <el-input :disabled="disabled" class="input-suffix-type" readonly  v-model="scope.row.budgetProjectName">
                    <i slot="suffix" class="page-input__search" @click="openProductDialog('subject', scope.row)"></i>
                  </el-input>
                </template>
                <template v-else>
                  {{scope.row.budgetProjectName}}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="支付日期" min-width="140">
              <template slot-scope="scope">
                <el-date-picker :disabled="disabled" v-if="estimateHead(scope.row.accountingSubjectCd)" class="w-100" v-model="scope.row.payDate" type="date" placeholder="选择日期" :clearable="false" value-format="yyyy-MM-dd">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="项目" min-width="180">
              <template slot-scope="scope" v-if="!scope.row.type">
                <el-input :disabled="disabled" class="input-suffix-type" readonly v-model="scope.row.projectName">
                  <i slot="suffix" class="page-input__search" @click="openProductDialog('item', scope.row)"></i>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="产品" min-width="180">
              <template slot-scope="scope" v-if="!scope.row.type">
                <el-input :disabled="disabled" class="input-suffix-type" readonly v-model="scope.row.productName">
                  <i slot="suffix" class="page-input__search" @click="openProductDialog('product', scope.row)"></i>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="订单号" min-width="180">
              <template slot-scope="scope" v-if="!scope.row.type">
                <el-input :disabled="disabled" class="input-suffix-type" readonly v-model="scope.row.kuOrderName">
                  <i slot="suffix" class="page-input__search" @click="openProductDialog('orderNumber', scope.row)"></i>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="报销事项" min-width="198">
              <template slot-scope="scope">
                <gc-input :disabled="disabled" v-if="!scope.row.type" v-model="scope.row.remark"></gc-input>
              </template>
            </el-table-column>
            <el-table-column label="是否可抵扣" min-width="102">
              <template slot-scope="scope">
                <span v-if="!scope.row.type">
                  {{ scope.row.deductionFlag == 1 ? '是' : '否' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right" class-name="LaunchTrainingCourse__info-card__reimbursement__cost__content__const-operation">
              <template slot-scope="scope">
                <div class="df" v-if="!scope.row.type">
                  <span class="mr20" @click="costAllocationHandle(scope.row, scope.$index)">
                    <el-tooltip content="费用分摊 " popper-class="icon-popper">
                      <i class="operation__relationTicket cost-allocation-icon"></i>
                    </el-tooltip>
                  </span>
                  <span class="mr20" @click="handlerelationTicketVisible(scope.row)">
                    <el-tooltip content="关联专票" popper-class="icon-popper">
                      <i class="operation__relationTicket"></i>
                    </el-tooltip>
                    <i class="active__num" v-show="scope.row && scope.row.invoices && scope.row.invoices.length">
                      {{ scope.row.invoices && scope.row.invoices.length}}
                    </i>
                  </span>
                  <span class="mr20" v-if="scope.row.expenseType >= '000401' && scope.row.expenseType <= '000405'" @click="
                              openRelationTravelOrderDialog( scope.row, scope.$index )">
                    <el-tooltip content="关联差旅订单" popper-class="icon-popper">
                      <i class="operation__relationTravelOrder"></i>
                    </el-tooltip>
                    <i class="active__num" v-show="(scope.row.relationTravelOrderViceTable || []).length ">
                      {{ (scope.row.relationTravelOrderViceTable || []) .length }}
                    </i>
                  </span>
                  <span class="active" v-show="!disabled" @click="copyCostInfo(scope.row)">
                    <el-tooltip content="复制" popper-class="icon-popper">
                      <i class="operation__copy"></i>
                    </el-tooltip>
                  </span>
                </div>
              </template>
            </el-table-column>
          </template>
        </gc-table>
      </div>
    </div>

    <div class="LaunchTrainingCourse__info-card__reimbursement__payee">
      <div class="LaunchTrainingCourse__info-card__reimbursement__payee__title LaunchTrainingCourse__title vice-title">
        <div class="LaunchTrainingCourse__title__left-small">
          <div>.</div>
          收款人信息 
          <span class="tips red"> （请识别“收款人”是否为“关联交易”的关联方。如为关联方，请务必提前于智能关联交易系统发起关联交易审批。完成报销后请及时报送台帐）</span>
        </div>
        <div v-show="!disabled" class="icons">
          <span class="icons__add" @click="addReimbursementPayee">
            <i class="icons__add__icon"></i>
            新增
          </span>
          <span class="icons__del" @click="delReimbursementPayee">
            <i class="icons__del__icon"></i>
            删除
          </span>
        </div>
      </div>
      <div class="LaunchTrainingCourse__info-card__reimbursement__payee__content table__wrapper " ref="payeeTableWrapperRef">
        <!-- <div class="width-fit" style="min-width: 1751px;"> -->
        <div class="width-fit" style="min-width: unset;">
          <el-table class="payee-table padding-space" :span-method="arraySpanMethod" show-summary :summary-method="getSummaries" :data="payeeInfoTable" ref="payeeInfoTableRef">
            <el-table-column type="selection" width="54">
            </el-table-column>
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column label="供应商名称" min-width="205" class-name="LaunchTrainingCourse__info-card__reimbursement__payee__content__search">
              <template slot-scope="scope">
                <gc-input :disabled="disabled" v-model="scope.row.supplierName"><i slot="suffix" class="page-input__search" @click="openSupplierDialog('item', scope.row)"></i></gc-input>
                <span v-if="scope.row.isCrelParty === 'Y'" class="tips row-tip active"> （识别到此“收款人”可能为关联方，请务必确认您已完成关联交易签报申请）</span>
              </template>
            </el-table-column>
            <el-table-column label="供应商代码" min-width="100" prop="name">
              <template slot-scope="scope">
                {{ scope.row.supplierCode }}
              </template>
            </el-table-column>
            <el-table-column label="供应商地点" min-width="103" prop="address">
              <template slot-scope="scope">
                {{ scope.row.addrName }}
              </template>
            </el-table-column>
            <el-table-column label="业务实体" min-width="103" prop="date">
              <template slot-scope="scope">
                {{ scope.row.orgSegmentDesc }}
              </template>
            </el-table-column>
            <el-table-column label="开户名称" min-width="160">
              <template slot-scope="scope">
                {{ scope.row.reimSupplier.acctOpenName }}
              </template>
            </el-table-column>
            <el-table-column label="银行账号" min-width="160">
              <template slot-scope="scope">
                {{ scope.row.reimSupplier.accountInfo }}
              </template>
            </el-table-column>
            <el-table-column label="开户银行" min-width="160">
              <template slot-scope="scope">
                {{ scope.row.reimSupplier.acctOpenBranchInfo }}
              </template>
            </el-table-column>
            <el-table-column prop="payAmt" label="需支付金额" min-width="175">
              <template slot-scope="scope">
                <gc-input @blur="transformFloat(scope.row, 'payAmt')" :disabled="disabled" v-model="scope.row.payAmt"></gc-input>
              </template>
            </el-table-column>
            <template v-if="disabled">
              <el-table-column prop="payStatus" label="支付状态" min-width="175">
                <template slot-scope="scope">
                  {{ scope.row.payStatus }}
                </template>
              </el-table-column>
              <el-table-column prop="ofMsg" label="OF信息" min-width="175">
                <template slot-scope="scope">
                  {{ scope.row.ofMsg }}
                </template>
              </el-table-column>
              <el-table-column prop="actualPayAmount" label="实际支付金额" min-width="175">
                <template slot-scope="scope">
                  {{ scope.row.actualPayAmount }}
                </template>
              </el-table-column>
              <el-table-column prop="payTime" label="支付时间" min-width="175">
                <template slot-scope="scope">
                  {{ scope.row.payTime }}
                </template>
              </el-table-column>
              <el-table-column prop="repayFlag" label="是否重新支付" min-width="175">
                <template slot-scope="scope">
                  {{ scope.row.repayFlag }}
                </template>
              </el-table-column>
            </template>
            <el-table-column label="银行汇款用途" min-width="205">
              <template slot-scope="scope">
                <gc-input :disabled="disabled" v-model="scope.row.bankPaySummary"></gc-input>
              </template>
            </el-table-column>
            <el-table-column label="税收居民身份" min-width="106">
              <template slot-scope="scope">
                {{ scope.row.residentDescFlag }}
              </template>
            </el-table-column>
            <el-table-column label="是否与报账头供应商相同" min-width="160">
              <template slot-scope="scope">
                {{ getPrimaryFlag(scope.row, scope.$index) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 报销信息 dialog -->
    <gc-model class="LaunchTrainingCourse__reimbursement-info" title="报销信息" :visible="reimbursementInfoVisible" width="800px" @close="reimbursementInfoVisible = false" @cancel="
        ;(classesInfo.expenseDetails || []).forEach((v) => (v.checked = false))
        reimbursementInfoVisible = false
      " @comfirm="handleReimbursementInfoSelect">
      <div v-if="classesInfo.students">
        <div class="LaunchTrainingCourse__reimbursement-info__student__title LaunchTrainingCourse__title ">
          <div class="LaunchTrainingCourse__title__left">
            <div class="LaunchTrainingCourse__title__left__menu"></div>
            本次报销学员
          </div>
        </div>
        <div class="LaunchTrainingCourse__reimbursement-info__student__content">
          <div class=" LaunchTrainingCourse__reimbursement-info__student__content__select-all">
            <el-checkbox v-model="studentAllSekectState" @change="studentAllSekectStateChange">全选</el-checkbox>
          </div>
          <div class=" LaunchTrainingCourse__reimbursement-info__student__content__items">
            <div class="LaunchTrainingCourse__reimbursement-info__student__content__items__item" v-for="item in classesInfo.students" :key="item.stuName">
              <el-checkbox v-model="item.checked" @change="reimbursementStudentChange">{{ item.stuName }}</el-checkbox>
            </div>
          </div>
        </div>
      </div>

      <div class="LaunchTrainingCourse__reimbursement-info__mony__title LaunchTrainingCourse__title" :class="{ 'margin-0': !classesInfo.students }">
        <div class="LaunchTrainingCourse__title__left">
          <div class="LaunchTrainingCourse__title__left__menu"></div>
          本次报销费用
        </div>
      </div>
      <div class="LaunchTrainingCourse__reimbursement-info__money__content expense-table">
        <gc-table :list="currentReimbursementMoneyList" :tableList="classesInfo.expenseDetails" :stripe="false" :border="true" :span-method="costTypearraySpanMethod">
          <template>
            <el-table-column prop="expenseTypeDescMin" label="子类别" min-width="170">
              <template slot-scope="scope">{{ scope.row.expenseTypeDescMin || '一' }}</template>
            </el-table-column>
            <el-table-column prop="expenseTypeDescSmall" label="本次报销细项" min-width="200">
              <template slot-scope="scope">{{ scope.row.expenseTypeDescSmall || '一' }}</template>
            </el-table-column>
            <el-table-column prop="budgetAmt" label="立项金额（元）" min-width="120"></el-table-column>
            <el-table-column min-width="64" label="选择">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked"></el-checkbox>
              </template>
            </el-table-column>
          </template>
        </gc-table>
      </div>
    </gc-model>
    <!-- 项目，产品，订单号公共弹窗 -->
    <ProductModel :show.sync="productVisible" :orgSegment="classesInfo.orgSegment" :row="costRow" :productType="productType" />
    <!-- 供应商弹窗 -->
    <SupplierModel :show.sync="supplierVisible" :orgSegment="classesInfo.orgSegment" :row="costRow" />
    <!-- 关联差旅订单弹窗 -->
    <TravelModel :show.sync="travelVisible" @save="traveSaveHandle" :row="costRow" />
    <!-- 关联专票订单弹窗 -->
    <InvoicesModel :show.sync="invoicesVisible" :orgSegment="classesInfo.orgSegment" 
      :row="costRow" 
      :disabled="disabled"
      @comfirm="invoicesModelComfirm" />
    <!-- 费用分摊 -->
    <CostAllocationEditor :show.sync="isCostAllocationShow" :origin-row="costInfoTable[costSelectedIndex] || {}" v-model="costAllocationDatas" :disabled="disabled" @save="costAllocationSaveHandle"></CostAllocationEditor>
  </div>
</template>

<script>
import $ from 'jquery'
import { myRound } from '@/plugins/until'
import {
  handleUdmpHref,
  filterTime,
  CopyObj,
  myFloat,
  resetObj,
  jsonHeaders,
  transformFloat
} from '@/util/utils'
import summary from './summary'
import { fetchSelectReimCds, fetchSelectInvoice } from '@/fetch/reimbursement'
import { fetchFastSelectReimCds, fetchFastSelectInvoice } from '@/fetch/reimbursement'
import ProductModel from './ProductModel'
import SupplierModel from './SupplierModel'
import TravelModel from './TravelModel'
import InvoicesModel from './InvoicesModel'
import CostAllocationEditor from './CostAllocationEditor.vue'
import { useReimbursement } from '@/views/Reimbursement/hooks/useReimbursement'
const { getExcludingTaxAmt, getRowTax } = useReimbursement()
export default {
  name: 'ReimbursedInfo',
  components: {
    ProductModel,
    SupplierModel,
    TravelModel,
    InvoicesModel,
    CostAllocationEditor
  },
  mixins: [summary],
  props: {
    // 基本信息
    baseInfo: {
      type: Object,
      default: {}
    },
    costInfoTable: {
      type: Array,
      default: () => []
    },
    payeeInfoTable: {
      type: Array,
      default: () => []
    },
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      //  报账明细 费用信息 table 字段数组
      costInfoList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          width: '54',
          label: '序号',
          type: 'index',
          value: '序号'
        },
        {
          prop: 'feeMaxCategoryDesc',
          width: '80',
          label: '费用大类',
          value: '费用大类'
        },
        {
          prop: 'feeMinCategoryDesc',
          value: '费用小类',
          width: '200',
          label: '费用小类'
        },
        {
          prop: 'budgetAmt',
          width: '90',
          label: '立项金额',
          value: '立项金额',
          formatter: row => (row.type ? row.costBudgetAmtMoneyTotal : row.budgetAmt)
        },
        {
          prop: 'payedAmt',
          width: '90',
          label: '已付款金额',
          value: '已付款金额',
          formatter: row => (row.type ? row.costPayedAmtTotal : row.payedAmt)
        },
        {
          prop: 'occupyAmt',
          width: '90',
          label: '已占用金额',
          value: '已占用金额',
          formatter: row => (row.type ? row.costOccupyAmtTotal : row.occupyAmt)
        }
      ],
      //  报账明细 费用信息 table 数据数组
      // costInfoTable: [],
      //  报账明细 收款人信息 table 数据数组
      // payeeInfoTable: [],
      // 报销信息 dialog 状态
      reimbursementInfoVisible: false,
      filterTime,
      handleUdmpHref,
      myRound,
      myFloat,
      classesInfo: {},
      // 本次报销费用 table字段
      currentReimbursementMoneyList: [
        {
          prop: 'expenseTypeDescMax',
          label: '费用类别',
          value: '费用类别',
          width: '174'
        }
      ],
      // 报销学员全选状态
      studentAllSekectState: false,
      // 差旅订单类型 和 差旅订单数组映射
      travelOrderMaping: {
        酒店: 'hotelOrderTable',
        机票: 'airfareOrderTable',
        火车: 'trainOrderTable',
        用车: 'carOrderTable'
      },
      // 酒店订单 数据数组
      hotelOrderTable: [],
      // 机票订单 数据数组
      airfareOrderTable: [],
      // 火车订单 数据数组
      trainOrderTable: [],
      // 用车订单 数据数组
      carOrderTable: [],
      // 项目，产品，订单号 dialog状态
      productVisible: false,
      // 项目，产品，订单号 dialog状态
      productType: '',
      // 选中当前行 对象
      costRow: {},
      // 供应商 dialog状态
      supplierVisible: false,
      // 供应商 dialog状态
      supplierType: '',
      // 关联差旅订单 dialog状态
      travelVisible: false,
      // 关联专票 dialog状态
      invoicesVisible: false,
      // 判断是否显示分摊弹窗
      isCostAllocationShow: false,
      // 分摊数据列
      costAllocationDatas: [],
      // 被选择的费用明细行
      costSelectedIndex: -1,
      transformFloat
    }
  },
  methods: {
    // 专票确认事件
    invoicesModelComfirm (data) {
      this.$set(this.costRow, 'invoices', data)
      // 关联专票后重新刷新分摊数据
      this.refreshAllocationDatas(data)
      // 当前报销状态为04【已退回】，若存在重新上传的专票情况，则afterRepairFlag【是否后补专票】为“Y”
      if (this.classesInfo.reimStatusCode === '04') {
        // this.classesInfo.afterRepairFlag = 'Y'
        this.$emit('setAfterRepairFlag', 'Y')
      }
      
    },
    traveSaveHandle(data) {
      this.$set(this.costRow, 'relationTravelOrderViceTable', data)
      this.TravelOrderToInfo()
    },
    // 打开 供应商公共dialog
    openSupplierDialog(type, row) {
      if (this.disabled) return
      this.supplierType = type
      this.costRow = row
      this.supplierVisible = true
    },
    // 打开 项目，产品，订单号公共dialog
    openProductDialog(type, row) {
      if (this.disabled) return
      this.productType = type
      this.costRow = row
      this.productVisible = true
    },
    // 打开关联差旅订单dialog
    openRelationTravelOrderDialog(currentCostInfo, index) {
      this.costRow = currentCostInfo
      this.travelVisible = true
    },
    // 关联专票dislog的显示
    handlerelationTicketVisible(currentCostInfo) {
      this.costRow = currentCostInfo
      this.invoicesVisible = true
    },
    getPrimaryFlag (row, index) {
      let res = 'N'
      if (row.supplierCode && row.supplierName && index === 0) {
        res = 'Y'
      } 
      return res === 'Y' ? '是' : '否'
    },
    // 新增收款人信息
    addReimbursementPayee() {
      this.payeeInfoTable.push({
        orderNo: new Date().getTime(), // 用于删除
        supplierCode: '',
        supplierName: '',
        taxpayer: '',
        orgSegment: '',
        orgSegmentDesc: '',
        addrName: '',
        accountInfo: '',
        residentDescFlag: '',
        supplierTypeDesc: '',
        payAmt: '',
        bankPaySummary: '',
        primaryFlag: '', // 是否与报账头供应商相同
        payeeSiteName: '', // 地址层名称
        reimSupplier: {
          payeeType: '',
          payeeName: '',
          payeeCode: '',
          payeePlaceLayerNo: '',
          payeePlaceLayerName: '',
          acctOpenName: '',
          accountInfo: '',
          acctOpenBranchInfo: '',
          payAcctName: '',
          corOfSupplierNo: '',
          ofSupplierId: ''
        }
      })
    },
    // 删除收款人信息
    delReimbursementPayee() {
      const selection = this.$refs.payeeInfoTableRef.selection
      selection.forEach(sm => {
        if (sm.orderNo || sm.supplierCode) {
          const selectionIndex = this.payeeInfoTable.findIndex(m => m === sm)
          this.payeeInfoTable.splice(selectionIndex, 1)
        } 
      })
      this.$refs.payeeInfoTableRef.clearSelection()
    },
    // 复制一条费用信息
    copyCostInfo(row) {
      const len = this.costInfoTable.length
      this.costInfoTable.splice(len - 1, 0, CopyObj(row))
    },
    //报销信息 表格合并方法
    costTypearraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let n = 1
        if (
          row.expenseTypeDescMax !==
          (this.classesInfo.expenseDetails[rowIndex - 1] || {})
            .expenseTypeDescMax
        ) {
          this.classesInfo.expenseDetails.slice(rowIndex + 1).some(v => {
            if (row.expenseTypeDescMax === v.expenseTypeDescMax) {
              return !n++
            } else {
              return true
            }
          })
          return [n, 1]
        }
        return [0, 0]
      } else if (columnIndex === 1) {
        let n = 1
        if (
          row.feeMinCategoryDesc !==
          (this.classesInfo.expenseDetails[rowIndex - 1] || {})
            .feeMinCategoryDesc
        ) {
          this.classesInfo.expenseDetails.slice(rowIndex + 1).some(v => {
            if (
              row.feeMinCategoryDesc === v.feeMinCategoryDesc &&
              row.expenseTypeDescMax === v.expenseTypeDescMax
            ) {
              return !n++
            } else {
              return true
            }
          })
          return [n, 1]
        }
        return [0, 0]
      }
    },
    // 新增 费用信息 的处理事件
    handleReimbursementInfoSelect() {
      const newArr = (this.classesInfo.expenseDetails || []).filter(
        v => v.checked
      )
      const arr = []
      newArr.forEach(v => {
        const newV = CopyObj(v)
        newV.relationTicketViceTable = []
        const len = this.costInfoTable.length
        this.costInfoTable.splice(len - 1, 0, newV)
        arr.push(newV)
      })
      ;(this.classesInfo.expenseDetails || []).forEach(v =>
        this.$set(v, 'checked', false)
      )
      const categoryTypes = arr.map(v => ({
        maxCategoryCode: v.feeMaxCategory,
        minCategoryCode: v.feeMinCategory
      }))
      fetchFastSelectReimCds({ categoryTypes }).then(res => {
        res.forEach(v => {
          const item = arr.find(
            result =>
              result.feeMaxCategory === v.maxCategoryCode &&
              result.feeMinCategory === v.minCategoryCode
          )
          this.$set(item, 'accountingSubjectCd', v.accountingSubjectCd)
          this.$set(item, 'budgetProjectCode', v.budgetProjectCode)
          this.$set(item, 'budgetProjectName', v.budgetProjectName)
          this.$set(item, 'taxRate', v.taxRate)
        })
        this.reimbursementInfoVisible = false
      })
    },
    // 判断会计科目是否以105开头
    estimateHead(code) {
      if (code == null) return false
      return /^105/.test(code)
    },
    // 费用信息 表格单行 selection-change 事件
    costInfoSelectionChange(selection) {
      this.costInfoTable.forEach(v => (v.checked = true))
      selection.forEach(v => (v.checked = false))
    },
    // 费用信息添加合并行
    costAddSummary() {
      if (this.costInfoTable.find(v => v.type)) return
      this.costInfoTable.push({
        costBudgetAmtMoneyTotal: '',
        costPayedAmtTotal: '',
        costOccupyAmtTotal: '',
        costCanReimbursementTotal: '',
        costBudgetAmtTotal: '',
        type: 'total'
      })
    },
    // 删除 费用信息 的处理事件
    handleDelReimbursementInfo() {
      let selection = this.$refs.costInfoTableRef.getSelection()
      if (selection.length) {
        selection = selection.filter(v => v.type !== 'total')
      }
      selection.forEach(sm => {
        const selectionIndex = this.costInfoTable.findIndex(m => m === sm )
        this.costInfoTable.splice(selectionIndex, 1)
      })
      this.TravelOrderToInfo()
      this.$refs.costInfoTableRef.clearSelection()
    },
    // 关联差旅订单时 关联到差旅信息
    TravelOrderToInfo() {
      Object.keys(this.travelOrderMaping).forEach(v => {
        const tableName = this.travelOrderMaping[v]
        this[tableName] = []
      })
      this.costInfoTable.forEach(item => {
        const obj = item.relationTravelOrderViceTable || []
        obj.forEach(v => {
          const tableName = this.travelOrderMaping[v.caikuOrderType]
          this[tableName].push(v)
        })
      })
      this.$emit('orderDataChange', {
        hotelOrderTable: this.hotelOrderTable, // 酒店
        airfareOrderTable: this.airfareOrderTable, // 机票
        trainOrderTable: this.trainOrderTable, // 火车
        carOrderTable: this.carOrderTable, // 用车
      })
    },
    costCellClassName({ row, column, rowIndex, columnIndex }) {
      if (row.type && columnIndex === 0) {
        $('.merge-total__span').remove()
        $('.merge-total')
          .children()
          .show()
        this.$nextTick(() => {
          $('.merge-total')
            .children()
            .hide()
            .end()
            .append("<span class='merge-total__span'> 合 计 金 额 </span>")
        })
        return 'merge-total'
      }
    },
    // 报销信息 dialog 本次报销学员 全选事件
    studentAllSekectStateChange(newState) {
      this.classesInfo.students.forEach(item => (item.checked = newState))
    },
    // 报销信息 dialog 本次报销学员 学生单选事件
    reimbursementStudentChange(change) {
      this.studentAllSekectState = this.classesInfo.students.every(
        item => item.checked
      )
    },
    // 费用信息 表格 本次报销金额 失焦事件
    handleCostInfoTableAmtBlur(row) {
      row.amt = (myFloat(row.amt) || '') + ''
      const allMoney = (Number.parseFloat(this.classesInfo.budgetTotalAmt) || 0) - (Number.parseFloat(this.classesInfo.occupyTotalAmt) || 0)
      // 文本框中输入的“本次报销金额”的总和
      const inputAllMoney = this.costInfoTable
        .map(v => Number.parseFloat(v.amt))
        .reduce((prev, next) => prev + next, 0)
      // 计算：剩余可报销金额
      let canReimburseMoney
      if (this.classesInfo.row && (this.classesInfo.row.expenseType || this.classesInfo.row.ifShare) === 'Y') {
        canReimburseMoney = allMoney
      } else {
        canReimburseMoney = this.myRound( row.budgetAmt - (row.payedAmt || 0) - (row.occupyAmt || 0), 2 )
      }
      // 验证：本次报销金额 
      if (row.amt > canReimburseMoney) {
        this.messagebox('报销金额不可大于剩余可报销金额')
        row.amt = ''
      } else if (row.amt < 0) {
        this.messagebox('报销金额不可小于0')
        row.amt = ''
      } else if (inputAllMoney > allMoney) {
        this.messagebox(
          `报销总金额[${inputAllMoney}]元不可大于剩余可报销金额[${allMoney}]元`
        )
      } else {
        let amtList
        if ((this.classesInfo.row.expenseType || this.classesInfo.row.ifShare) === 'Y') {
          amtList = this.costInfoTable.map(v => Number.parseFloat(v.amt))
        } else {
          amtList = this.costInfoTable
            .filter(v => v.feeMinCategoryDesc === row.feeMinCategoryDesc)
            .map(v => Number.parseFloat(v.amt))
        }
        const amtTotal = amtList.reduce((prev, next) => prev + next, 0)
        if (amtTotal > canReimburseMoney) {
          this.messagebox(
            `报销金额[${amtTotal}]元不可大于剩余可报销金额[${canReimburseMoney}]元`
          )
          row.amt = ''
        }
      }
      if (this.judgeFloat(row.amt)) {
        row.amt = this.myRound(row.amt, 2)
      }
    },
    // 费用信息 立项金额, 已付款金额, 已占用金额, 合计公共函数
    costMoneyTotalCommon(property) {
      let sum = 0
      const newCostInfoTable = []
      this.costInfoTable.forEach(v => {
        if (
          !newCostInfoTable
            .map(val => val['feeMinCategoryDesc'])
            .includes(v['feeMinCategoryDesc'])
        ) {
          sum += (Number.parseFloat(v[property]) || 0) * 100
        }
      })
      sum = sum / 100
      return this.roundTwo(sum)
    },
    handleCostTotal(arr) {
      if (!arr || !arr.length) return
      const item = arr.slice(-1)[0]
      if (!item.type) return
      Object.keys(item).forEach(key => {
        if (key === 'type') return
        item[key] = this[key]
      })
    },
    // 费用信息 付款金额 公共函数
    costAmtTotalCommon(bool) {
      let sum = 0
      this.costInfoTable.forEach(v => {
        //判断专票还是普票
        let flag = v.tax == 0 && !(v.invoices || []).length
        if (bool) {
          flag = !flag
        }
        if (flag) {
          sum += (Number.parseFloat(v.amt) || 0) * 100
        }
      })
      sum = sum / 100
      return this.roundTwo(sum)
    },
    // 费用信息表格合并方法
    costSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.type && columnIndex === 0) {
        return {
          rowspan: 1,
          colspan: 2
        }
      } else if (row.type && columnIndex === 1) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }

      return {
        rowspan: 1,
        colspan: 1
      }
    },
    // 保留小数至两位
    roundTwo(sum) {
      return this.judgeFloat(sum)
        ? (Math.round(sum * 100) / 100).toFixed(2)
        : sum.toFixed(2)
    },
    // 判断小数是否大于两位
    judgeFloat(float) {
      float = (float + '').split('.')[1]
      return float ? float.length > 2 : false
    },
    // messsage 弹窗工具函数
    messagebox(content) {
      this.$alert(content, '通知', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout autoHeight`
      })
    },
    getExcludingTaxAmt(row){
      console.log(row, '===>>> row test');
      // 当关联了专票之后取专票里的税率，不含税金额=差额征税金额+（报销行金额-差额征税金额）/（1+专票税率），没有关联专票的时候税率取当前报销行的税率，
      let sum = 0
      if (row.invoices && row.invoices.length){
        let balanceTaxAmount = 0
        let taxRate = 0 
        sum = row.invoices.forEach(v=>{
          taxRate = v.taxRate
          balanceTaxAmount += Number.parseFloat(v.balanceTaxAmount || 0)
        })
        sum = balanceTaxAmount + (Number.parseFloat(row.amt || 0) - balanceTaxAmount)/(1 + Number.parseFloat(taxRate || 0) / 100)
      }else {
        sum =  Number.parseFloat(row.amt || 0) / (1 + Number.parseFloat(row.taxRate || 0) / 100) 
      }
      sum = sum.toFixed(2)
      row.excludingTaxAmt = sum
      return sum
    },
    // 含税金额计算规则
    getRowTax(row) {
      let sum = 0
      // 税额 = 本次报销金额 - 不含税金额
      sum = (Number.parseFloat(row.amt || 0) - row.excludingTaxAmt).toFixed(2)
      row.taxAmt = sum
      return sum
    },
    // 合计金额合并列
    arraySpanMethod() {
      this.objectSpanMethod('payeeInfoTableRef')
    },
    // 合计金额计算
    getSummaries(param) {
      return this.getNodeSummaries(param, '合 计 金 额', ['payAmt'])
    },
    _initData() {
      this.classesInfo = this.baseInfo
      if (this.classesInfo.details) {
        // this.costInfoTable = this.classesInfo.details
        // this.payeeInfoTable = this.classesInfo.suppliers
        // this.costAddSummary()
      }
    },
    costAllocationHandle(row, index) {
      if(!row.amt) return this.$message.warning("请先录入本次报销金额")
      this.costSelectedIndex = index
      if( row.splitInfo && row.splitInfo.length ) {
        this.costAllocationDatas = row.splitInfo
      } else {
        this.costAllocationDatas = [row]
      }
      this.isCostAllocationShow = true
    },
    refreshAllocationDatas(data) {
      this.costAllocationDatas = this.costAllocationDatas.map(row => {
        const resRow = {...row, invoices: data}
        return {
          ...resRow,
          // 重新计算不含税金额和税额
          excludingTaxAmt: getExcludingTaxAmt(resRow), 
          taxAmt: getRowTax(resRow)
        }
      })
    },
    costAllocationSaveHandle(datas) {
      this.costInfoTable[this.costSelectedIndex].splitInfo = datas
      this.costSelectedIndex = -1
      console.log(this.costInfoTable, '===>>>');
    },
    addeventListenerTableScroll() {
      const payeeFooterRef = this.$refs.payeeInfoTableRef.$refs.footerWrapper
      payeeFooterRef.addEventListener('scroll', () => {
        const scrollLeft = payeeFooterRef.scrollLeft
        this.$refs.payeeInfoTableRef.$refs.bodyWrapper.scrollLeft = scrollLeft
      })
    },
    removeEventListenerTableScroll() {
      const payeeFooterRef = this.$refs.payeeInfoTableRef.$refs.footerWrapper
      payeeFooterRef.emoveEventListener('scroll')
    }
  },
  computed: {
    // 费用信息 立项金额 合计
    costBudgetAmtMoneyTotal() {
      return (
        this.classesInfo.budgetTotalAmt ||
        this.costMoneyTotalCommon('budgetAmt')
      )
    },
    // 费用信息 已付款金额 合计
    costPayedAmtTotal() {
      return (
        this.classesInfo.payedTotalAmt || this.costMoneyTotalCommon('payedAmt')
      )
    },
    // 费用信息 已占用金额 合计
    costOccupyAmtTotal() {
      return (
        this.classesInfo.occupyTotalAmt ||
        this.costMoneyTotalCommon('occupyAmt')
      )
    },
    // 费用信息 可报销金额 合计
    costCanReimbursementTotal() {
      return this.roundTwo(
        this.costBudgetAmtMoneyTotal -
          this.costPayedAmtTotal -
          this.costOccupyAmtTotal
      )
    },
    // 费用信息 专票 付款金额
    costZAmtTotal() {
      return this.costAmtTotalCommon(true)
    },
    // 费用信息 普票 付款金额
    costPAmtTotal() {
      return this.costAmtTotalCommon()
    },
    // 费用信息 付款金额
    costBudgetAmtTotal() {
      const sum =
        ((this.costZAmtTotal || 0) * 100 + (this.costPAmtTotal || 0) * 100) /
        100
      return this.roundTwo(sum)
    }
  },
  watch: {
    baseInfo: {
      deep: true,
      handler(n) {
        this._initData()
      }
    },
    costInfoTable(n) {
      console.log(n, '===>>> costInfotable');
      this.handleCostTotal(n)
    },
    costBudgetAmtTotal() {
      setTimeout(() => {
        this.handleCostTotal(this.costInfoTable)
      }, 100)
    }
  },
  mounted() {
    this.addeventListenerTableScroll()
  },
  beforeDestory() {
    this.removeEventListenerTableScroll()
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
.ReimbursedInfo {
  padding: 0 20px ;
  &__title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
    &__left-small {
      display: flex;
      div {
        margin-right: 4px;
        line-height: 1;
        transform: scale(2);
        color: #7d8292;
      }
    }
  }
  :deep(.merge-total) {
    font-size: 12px;
    padding-left: 15px !important;
    background-color: #f9fafc;
  }
}

.cost-allocation-icon {
  background-image: url('~@/assets/svg/cost-allocation-icon.svg');
}

.payee-table {
  :deep(.el-table__body-wrapper) {
    overflow: hidden !important;
    z-index: 2 !important;
  }

  :deep(.el-table__footer-wrapper) {
    overflow-x: auto;
    border-top: 1px solid #f4f4f4;
  }
}

.expense-table {
  :deep(td:first-of-type .cell) {
    justify-content: flex-start;
  }
}

.tips {
  font-size: 12px;
}

.row-tip {
  color: #fd6720 !important;
  position: absolute;
  white-space: nowrap;
  z-index: 1;
}

.padding-space {
  :deep(.el-table__body-wrapper .el-table__row .cell) {
    padding: 15px 10px;
  }
}

.red {
  color: red;
}
</style>