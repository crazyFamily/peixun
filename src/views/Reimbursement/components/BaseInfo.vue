<template>
  <div class="BaseInfo">
    <div class="BaseInfo__title margin-0">
      <div class="BaseInfo__title__left">
        <span class="BaseInfo__title__left__menu"></span>
        基本信息
      </div>
    </div>
    <div class="LaunchTrainingCourse__info-card__base-info2">
      <el-form label-width="100px" class="mt20 clearfix" :model="classesInfo">
        <el-col :span="8">
          <el-form-item label="经办人">
            <el-input v-model="classesInfo.operName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="收款供应商">
            <el-input v-model="supplierDesc" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机构">
            <el-input v-model="classesInfo.orgDesc" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="管理中心">
            <el-input v-model="classesInfo.manageCenterDesc" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成本中心">
            <el-input readonly class="page-input" :disabled="disabled" v-model="classesInfo.costCenterName">
              <i slot="suffix" class="page-input__search" @click="handleCostCenterVisible"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="立项编号">
            <el-input readonly class="page-input" :disabled="disabled" v-model="classesInfo.row.classId">
              <template slot="suffix">
                <el-popover
                  placement="bottom-end"
                  :visible-arrow="false"
                  min-width="200"
                  trigger="click"
                  popper-class="edit-wicket-popper"
                  :offset="11"
                >
                  <div class="edit-wicket-popper__wrapper">
                    <div class="edit-wicket-popper__wrapper__content">
                      <ul class="edit-wicket-popper__wrapper__content__items">
                        <li class="edit-wicket-popper__wrapper__content__items__item">
                          <div class="edit-wicket-popper__wrapper__content__items__item__left">立项编号</div>
                          <div class="edit-wicket-popper__wrapper__content__items__item__right">
                            {{ classesInfo.row.classId }}
                          </div>
                        </li>
                        <li class="edit-wicket-popper__wrapper__content__items__item">
                          <div class="edit-wicket-popper__wrapper__content__items__item__left">立项名称</div>
                          <div class="edit-wicket-popper__wrapper__content__items__item__right">
                            {{ classesInfo.row.className }}
                          </div>
                        </li>
                        <li class="edit-wicket-popper__wrapper__content__items__item">
                          <div class="edit-wicket-popper__wrapper__content__items__item__left">金额</div>
                          <div class="edit-wicket-popper__wrapper__content__items__item__right">{{ classesInfo.budgetTotalAmt }}</div>
                        </li>
                        <li class="edit-wicket-popper__wrapper__content__items__item">
                          <div class="edit-wicket-popper__wrapper__content__items__item__left">已使用金额</div>
                          <div class="edit-wicket-popper__wrapper__content__items__item__right">
                            {{ myRound(parseFloat(classesInfo.occupyTotalAmt) + parseFloat(classesInfo.payedTotalAmt), 2) }}
                          </div>
                        </li>
                        <li class="edit-wicket-popper__wrapper__content__items__item">
                          <div class="edit-wicket-popper__wrapper__content__items__item__left">
                            本次使用金额
                          </div>
                          <div class="edit-wicket-popper__wrapper__content__items__item__right">
                            <span>{{ totalFees.costBudgetAmtTotal - totalFees.accountsTotalPrice - totalFees.writeOffTotalPrice + '' }}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <i slot="reference" class="page-input__edit"></i>
                </el-popover>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="立项名称">
            <el-input disabled v-model="classesInfo.row.className"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同编号">
            <el-input
              readonly
              class="page-input LaunchTrainingCourse__info-card__base-info__contract-code"
              :disabled="disabled"
              v-model="classesInfo.contractCode"
            >
              <template slot="suffix">
                <i class="page-input__search" @click="handleContractSearchVisible"></i>
                <i class="page-input__line"></i>
                <el-popover
                  placement="bottom-end"
                  :visible-arrow="false"
                  min-width="902"
                  trigger="click"
                  popper-class="edit-wicket-popper-transverse"
                >
                  <div class="edit-wicket-popper-transverse" style="padding:10px;">
                    <table-pagination hidePagination :queryForm="{}" :list="contractCodeEditList" :tableList="contractCodeEditTable" :stripe="false">
                      <el-table-column min-width="102" label="本次付款金额">
                        <template slot-scope="scope">
                          <gc-input :disabled="disabled" @change="changeThisTimePayAmt" v-model.trim="scope.row.thisTimePayAmt"></gc-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" min-width="60">
                        <template slot-scope="scope">
                          <span class="active" @click="handleContractCodeEditTableDel(scope.$index)">删除</span>
                        </template>
                      </el-table-column>
                    </table-pagination>
                  </div>
                  <i slot="reference" class="page-input__edit"></i>
                </el-popover>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="合同名称">
            <el-input disabled v-model="classesInfo.contractName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="挂账金额">
            <el-input :value="Number(totalFees.accountsTotalPrice).toFixed(2)" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="核销金额">
            <el-input :value="Number(totalFees.writeOffTotalPrice).toFixed(2)" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需支付金额">
            <el-input :value="Number(totalFees.costBudgetAmtTotal - totalFees.accountsTotalPrice - totalFees.writeOffTotalPrice).toFixed(2)" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单据状态">
            <el-input disabled placeholder="" v-model="classesInfo.reimStatus"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提交日期">
            <el-input disabled v-model="classesInfo.reimSubmitDate" placeholder=""> </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审批状态">
            <el-input disabled v-model="classesInfo.applyStatus" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="说明">
            <el-input
              type="textarea"
              class="h-60"
              :disabled="disabled"
              maxlength="160"
              @change="changeRemark"
              show-word-limit
              resize="none"
              placeholder="请输入"
              v-model="classesInfo.remark"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
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
    >
      <div class="df">
        <el-form inline @submit.native.prevent>
          <el-form-item class="first-item" label-width="58px" label="机构">
            <el-input placeholder="请输入机构名称/代码" v-model.trim="costCenterDialogForm.orgCode"></el-input>
          </el-form-item>
          <el-form-item label="业务段">
            <el-input placeholder="请输入业务段名称/代码" v-model.trim="costCenterDialogForm.manageCenter"></el-input>
          </el-form-item>
          <el-form-item label="成本中心">
            <el-input placeholder="请输入成本中心名称/代码" v-model.trim="costCenterDialogForm.costCenter"></el-input>
          </el-form-item>
        </el-form>
        <div class="LaunchTrainingCourse__cost-center__btns sw-150 fs0" style="padding-left: 15px;">
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
    <!-- 合同查找 dislog -->
    <gc-model
      class="LaunchTrainingCourse__contract-search"
      :visible="contractSearchVisible"
      @close="handleContractSearchClose"
      @comfirm="contractSearcConfirm"
      ref="contractSearchDialog"
      width="1100px"
      cancelText=""
      comfirmText="选择"
      title="合同查找"
    >
      <el-form :inline="true" :model="contractSearchForm" @submit.native.prevent>
        <el-form-item class="first-item">
          <gc-input label="合同编号" v-model.trim="contractSearchForm.code"></gc-input>
        </el-form-item>
        <el-form-item>
          <gc-input label="合同名称" v-model.trim="contractSearchForm.name"></gc-input>
        </el-form-item>
        <div class="LaunchTrainingCourse__contract-search__btns">
          <el-button @click="handleContractSearchClickQuery">查询</el-button>
          <el-button class="reset-btn" @click="handleContractSearchReset">重置</el-button>
        </div>
      </el-form>
      <table-pagination
        hidePagination
        @select-all="selectionContractHandle"
        @select="selectionContractHandle"
        :queryForm="contractSearchForm"
        :vLoading="contractSearchDialogVLoading"
        ref="contractSearchTableRef"
        :list="contractSearchList"
        :tableList="contractSearchTable"
        :stripe="false"
      >
        <el-table-column min-width="102" label="本次付款金额">
          <template slot-scope="scope">
            <gc-input v-model.trim="scope.row.thisTimePayAmt"></gc-input>
          </template>
        </el-table-column>
      </table-pagination>
    </gc-model>
  </div>
</template>

<script>
import { myRound } from '@/plugins/until'
import { CopyObj, resetObj } from '@/util/utils'
import { fetchSelectFastCostCenter, fetchSelectFastReimContract } from '@/fetch/reimbursement'
import store from '@/store'
export default {
  name: 'ReimbursementBaseInfo',
  props: {
    // 基本信息
    baseInfo: {
      type: Object,
      default: {}
    },
    // 费用合计
    totalFees: {
      type: Object,
      default: {
        costBudgetAmtTotal: 0,
        accountsTotalPrice: 0,
        writeOffTotalPrice: 0
      }
    },
    payeeInfoTable: {
      type: Array,
      default: () => []
    },
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      resetObj,
      // 培训班信息
      classesInfo: {
        row: {}
      },
      // 基本信息里的本次使用金额是否可编辑
      baseInfoThisAmountIsEdit: false,
      myRound,
      accountsTotalPrice: null,
      // 合同查找的 table 数据数组
      contractSearchTable: [],
      // 修改合同编号 table 字段组
      contractCodeEditList: [
        {
          prop: 'contractCode',
          label: '合同编号',
          value: '合同编号',
          width: '150'
        },
        {
          prop: 'contractName',
          label: '合同名称',
          value: '合同名称',
          width: '200'
        },
        {
          prop: 'payPhase',
          label: '付款阶段',
          value: '付款阶段',
          width: '100'
        },
        {
          prop: 'planPayAmt',
          label: '计划付款金额',
          value: '计划付款金额',
          width: '98'
        },
        {
          prop: 'payedAmt',
          label: '已付款金额',
          value: '已付款金额',
          width: '88'
        },
        {
          prop: 'occupyAmt',
          label: '已占用金额',
          value: '已占用金额',
          width: '88'
        },
        {
          prop: 'unPayAmt',
          label: '未付款金额',
          value: '未付款金额',
          width: '88'
        }
      ],
      // 查找成本中心的 dialog 状态
      costCenterVisible: false,
      // 查找成本中心的 table 字段数组
      costCenterList: [
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
      ],
      supplier: null,
      // 查找成本中心的 table 数据数组
      costCenterTable: [],
      // 查找成本中心的 dialog form表单
      costCenterDialogForm: {
        currPage: 1,
        pageSize: 10
      },
      //  报账明细 费用信息 table 数据数组
      costInfoTable: [],
      // 修改合同编号 table 数组
      contractCodeEditTable: [],
      // 合同查找的 dialog状态
      contractSearchVisible: false,
      // 合同查找的 dialog 中的form对象
      contractSearchForm: {
        orgCode: '',
        name: '',
        code: '',
        currPage: 1,
        pageSize: 4,
        total: 0
      },
      // 合同查找的 table 字段数组
      contractSearchList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          type: 'index',
          value: '序号',
          width: '54'
        },
        {
          prop: 'contractCode',
          label: '合同编号',
          value: '合同编号',
          width: '120'
        },
        {
          prop: 'contractName',
          label: '合同名称',
          value: '合同名称',
          width: '168'
        },
        {
          prop: 'payPhase',
          label: '付款阶段',
          value: '付款阶段',
          width: '140'
        },
        {
          prop: 'planPayAmt',
          label: '计划付款金额',
          value: '计划付款金额',
          width: '90'
        },
        {
          prop: 'payedAmt',
          label: '已付款金额',
          value: '已付款金额',
          width: '80'
        },
        {
          prop: 'unPayAmt',
          label: '未付款金额',
          value: '未付款金额',
          width: '80'
        },
        {
          prop: 'occupyAmt',
          label: '已占用金额',
          value: '已占用金额',
          width: '80'
        }
      ],
      // 合同查找的 dialog 中table v-loading 状态
      contractSearchDialogVLoading: false,
      selectionContractList: [],
      // 财智通报账单号
      reimIdFas: ''
    }
  },
  methods: {
    // 成本中心 dislog的关闭
    costCenterClose() {
      this.costCenterVisible = false
      this.costCenterTable = []
      this.costCenterDialogForm = this.$options.data.call(this).costCenterDialogForm
    },
    // 成本中心 dislog的显示
    handleCostCenterVisible() {
      if (this.disabled) return
      this.costCenterVisible = true
    },
    // 成本中心 查询事件
    costCenterClickQuery() {
      this.costCenterDialogForm.currPage = 1
      this.costCenterQuery()
    },
    // 成本中心 查询函数
    costCenterQuery(flag) {
      const data = CopyObj(this.costCenterDialogForm)
      if (!data.orgCode && !data.manageCenter && !data.costCenter) {
        return this.$message.warning('请填写查询参数')
      }
      fetchSelectFastCostCenter(data).then(res => {
        const { list, total } = res || {}
        this.costCenterTable = list
        this.costCenterDialogForm.total = total
      })
    },
    // 成本中心 重置 事件
    costCenterReset() {
      this.costCenterDialogForm = this.$options.data.call(this).costCenterDialogForm
    },
    // 成本中心 comfirm 事件
    costCenterComfirm() {
      const selection = this.supplier
      if (!selection) return
      const { orgSegment, orgDesc, manageCenterCode, manageCenterDesc, costCenterCode, costCenterName } = selection
      const resultData = {
        orgSegment,
        orgDesc,
        manageCenterCode,
        manageCenterDesc,
        costCenterCode,
        costCenterName
      }
      this.$emit('save', resultData)
      this.costCenterVisible = false
    },
    // 将查询得到的订单数据，转化符合本页面的数据格式
    _initData(data) {
      this.classesInfo = CopyObj(data)
      if (this.classesInfo.contracts) {
        this.contractCodeEditTable = this.classesInfo.contracts
        this.classesInfo.contractCode = this.contractCodeEditTable.map(v => v.contractCode).join(';')
        this.classesInfo.contractName = this.contractCodeEditTable.map(v => v.contractName).join(';')
      }
    },
    // 合同查找dislog的显示
    handleContractSearchVisible() {
      if (this.disabled) return
      this.contractSearchVisible = true
    },
    // 修改说明
    changeRemark() {
      this.$emit('save', { remark: this.classesInfo.remark })
    },
    // 修改合同金额
    changeThisTimePayAmt() {
      this.$emit('save', {
        contracts: this.contractCodeEditTable
      })
    },
    // 编辑 合同编号 表格的删除事件
    handleContractCodeEditTableDel(index) {
      if (this.disabled) return
      this.contractCodeEditTable.splice(index, 1)
      this.classesInfo.contractCode = this.contractCodeEditTable.map(v => v.contractCode).join(';')
      this.classesInfo.contractName = this.contractCodeEditTable.map(v => v.contractName).join(';')
      this.$emit('save', {
        contracts: this.contractCodeEditTable
      })
    },
    selectionHandle(list) {
      this.supplier = list[0] || {}
    },
    // 判断小数是否大于两位
    judgeFloat(float) {
      float = (float + '').split('.')[1]
      return float ? float.length > 2 : false
    },
    // 保留小数至两位
    roundTwo(sum) {
      return this.judgeFloat(sum) ? (Math.round(sum * 100) / 100).toFixed(2) : sum.toFixed(2)
    },
    // 合同查找中心的查询事件
    handleContractSearchClickQuery() {
      this.handleContractSearchQuery(true)
    },
    // 合同查找中心的查询函数
    handleContractSearchQuery(flag) {
      const { name, code } = this.contractSearchForm
      if (name === '' && code === '') {
        this.$alert('请填写合同编号或合同名称', '通知', {
          confirmButtonText: '知道了',
          customClass: `loginTimeout contract-search-messagebox`
        }).catch(err => err)
      } else {
        if (flag) {
          this.contractSearchDialogVLoading = true
        }
        this.contractSearchForm.orgCode = this.classesInfo.orgSegment
        fetchSelectFastReimContract(this.contractSearchForm)
          .then(res => {
            res.list.forEach(v => {
              if (v.occupyAmt.trim() === 'null') {
                v.occupyAmt = 0
              }
              if (v.unPayAmt.trim() === 'null') {
                v.unPayAmt = 0
              }
            })
            this.contractSearchTable = res.list
          })
          .finally(() => {
            this.contractSearchDialogVLoading = false
          })
      }
    },
    // 合同查找中心 dialog关闭事件
    handleContractSearchClose() {
      this.handleContractSearchReset()
      this.selectionContractList = []
      this.contractSearchVisible = false
      this.contractSearchTable = []
    },
    // 合同查找中心 合同选择事件
    contractSearcConfirm() {
      const selection = this.selectionContractList
      const ids = this.contractCodeEditTable.map(v => v.contractCode)
      selection.forEach(v => {
        if (!ids.includes(v.contractCode)) {
          this.contractCodeEditTable.push(CopyObj(v))
        }
      })
      this.classesInfo.contractCode = this.contractCodeEditTable.map(v => v.contractCode).join(';')
      this.classesInfo.contractName = this.contractCodeEditTable.map(v => v.contractName).join(';')
      this.$emit('save', {
        contracts: this.contractCodeEditTable
      })
      this.contractSearchVisible = false
    },
    // 合同查找中心的重置事件
    handleContractSearchReset() {
      this.contractSearchForm.code = ''
      this.contractSearchForm.name = ''
    },
    selectionContractHandle(list) {
      this.selectionContractList = list
    },
    openFileAttach(row) {
      window.open(row.attUrl)
    }
  },
  watch: {
    baseInfo: {
      deep: true,
      handler(n) {
        this._initData(this.baseInfo)
      }
    }
  },
  computed: {
    // 费用信息 付款金额
    costBudgetAmtTotal() {
      const sum = ((this.costZAmtTotal || 0) * 100 + (this.costPAmtTotal || 0) * 100) / 100
      return this.roundTwo(sum)
    },
    supplierDesc() {
      let { orgSegment, supplierCode = '', supplierName = '' } = this.classesInfo
      if(this.payeeInfoTable.length) {
        let supplier = this.payeeInfoTable[0]
        return `[${supplier.supplierCode}]${supplier.supplierName}|${orgSegment}`
      }
      if (supplierCode && supplierName && orgSegment) {
        return `[${supplierCode}]${supplierName}|${orgSegment}`
      }
      return ''
    }
  }
}
</script>
<style lang="scss" scoped>
.BaseInfo {
  &__title {
    &__left {
      font-size: 14px;
      font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC', 'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
      &__menu {
        display: inline-block;
        width: 3px;
        height: 10px;
        margin-right: 7px;
        background-color: #fd6720;
      }
    }
  }
}
</style>