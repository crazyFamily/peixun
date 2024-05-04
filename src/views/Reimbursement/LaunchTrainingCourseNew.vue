<template>
  <div class="Reimbursement__LaunchTrainingCourseNew">
    <!-- 单据编号 卡片 -->
    <el-card class="LaunchTrainingCourse__number-card">
      <div class="LaunchTrainingCourse__number-card__left">
        <span class="LaunchTrainingCourseNew__number-card__left__title"
          >单据编号</span
        >
        <span>{{ classesInfo.row.reimIdFas }}</span>
      </div>
      <div v-if="disabled" class="fr">
        <el-button @click="$router.back()">返回</el-button>
        <el-button @click="stamp('3')" type="primary">打印粘贴页</el-button>
      </div>
      <div v-else class="fr">
        <el-button @click="$router.back()">返回</el-button>
        <el-button
          class="LaunchTrainingCourse__number-card__right__query"
          :loading="saveLoading"
          @click="handleSave"
        >保存</el-button>
        <el-button type="primary" @click="handleSubmit" 
          :loading="submitLoading"
          >提交</el-button>
      </div>
    </el-card>

    <el-card class="mt10">
      <!-- 基本信息 -->
      <BaseInfo
        :baseInfo="classesInfo"
        :totalFees="{
          costBudgetAmtTotal: this.costBudgetAmtTotal,
          accountsTotalPrice: this.accountsTotalPrice,
          writeOffTotalPrice: this.writeOffTotalPrice
        }"
        :disabled="disabled"
        :payeeInfoTable="payeeInfoTable"
        @save="classesInfoSaveHandle"
      />
      <div class="LaunchTrainingCourse__title margin-0">
        <div class="LaunchTrainingCourse__title__left">
          <span class="LaunchTrainingCourse__title__left__menu"></span>
          报销信息
        </div>
      </div>
      <div class="LaunchTrainingCourseNew__info-card">
        <el-tabs v-model="tabActive" @tab-click="navTabChangeHandle" class="nav-tab">
          <el-tab-pane
            v-for="(item, i) in REIMBURSE_DETAILS_TABS"
            :key="i"
            :label="item.label"
            :name="item.name"
          >
          </el-tab-pane>
            <!-- 报账明细 -->
            <ReimbursedInfo
              :baseInfo="classesInfo"
              v-show="tabActive === 'BZMX'"
              :disabled="disabled"
              :costInfoTable="costInfoTable"
              :payeeInfoTable="payeeInfoTable"
              @orderDataChange="orderDataChange"
              @setAfterRepairFlag="setAfterRepairFlag"
            />
            <!-- 挂账信息 -->
            <AccountsInfo
              :classesInfo="classesInfo"
              :disabled="disabled"
              :suspends="classesInfo.suspends"
              @save="suspendsSaveHandle"
              v-show="tabActive === 'GZXX'"
            />
            <!-- 核销信息 -->
            <WriteOffInfo
              :classesInfo="classesInfo"
              :disabled="disabled"
              :cancels="classesInfo.cancels"
              :payeeInfoTable="payeeInfoTable"
              @save="cancelsSaveHandle"
              v-show="tabActive === 'HXXX'"
            />
            <!-- 差旅信息 -->
            <TravelInfo
              v-show="tabActive === 'CLXX'"
              :disabled="disabled"
              :baseInfo="classesInfo"
              :tableData="classesInfo.trips"
              :cityOptions="cityOptions"
              @save="travelSaveHandle"
              ref="travelInfoRef"
            />
            <!-- 审批记录 -->
            <ApprovalRecord
              v-show="tabActive === 'SPJL'"
              :approvalRecordTable="approvalRecordTable"
              ref="approvalRecordRef"
            />
            <!-- 咨询记录 -->
            <ConsultationRecord
              v-show="tabActive === 'ZXJL'"
              :consultationRecordTable="consultationRecordTable"
              ref="consultationRecordRef"
            />
            <div v-show="tabActive === 'YXXX'">
              <!-- 影像信息 -->
              <el-table :data="attachTableList">
                <el-table-column align="center" label="影像文件名称">
                  <template slot-scope="scope">
                    <span class="active" @click="openFileAttach(scope.row)">{{ scope.row.attName || scope.row.attUrl }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </el-tabs>
      </div>
      <Attach
        :attaches="classesInfo.attaches"
        @save="attachesSaveHandle"
        :disabled="disabled"
        :baseInfobusiId="classesInfo.reimId || classesInfo.row.reimId"
        v-show="tabActive === 'BZMX'"
      />
      <!-- 酒店， 机票， 火车， 用车订单信息 -->
      <TravelInfoOther
        v-show="tabActive === 'CLXX'"
        :hotelOrderTable="hotelOrderTable"
        :airfareOrderTable="airfareOrderTable"
        :trainOrderTable="trainOrderTable"
        :carOrderTable="carOrderTable"
      />
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import BaseInfo from './components/BaseInfo'
import ReimbursedInfo from './components/ReimbursedInfo'
import AccountsInfo from './components/AccountsInfo'
import WriteOffInfo from './components/WriteOffInfo'
import TravelInfo from './components/TravelInfo'
import TravelInfoOther from './components/TravelInfoOther'
import ApprovalRecord from './components/ApprovalRecord'
import ConsultationRecord from './components/ConsultationRecord'
import Attach from './components/Attach'
import { REIMBURSE_DETAILS_TABS } from '@/util/constants'
import {
  CopyObj,
  myFloat,
  customHint,
  closeCurrPageAndGoPath
} from '@/util/utils'
import { myRound } from '@/plugins/until'

import {
  fetchSelectFastReimSupplier,
  insertFastReimForSave,
  insertFastReim,
  fetchSelectFastReimCity, // 城市
  fetchPrintFastReim,
  fetchFastReimVideo
} from '@/fetch/reimbursement'
import store from '@/store'
export default {
  name: 'LaunchTrainingCourseNew',
  props: {
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BaseInfo,
    ReimbursedInfo,
    AccountsInfo,
    WriteOffInfo,
    TravelInfo,
    TravelInfoOther,
    ApprovalRecord,
    ConsultationRecord,
    Attach
  },
  data() {
    return {
      routeParams: {},
      // 识别动作 [add, edit]
      action: this.$route.params.action,
      // 页面状态信息
      pageActionMaping: {
        add: '发起预付款'
      },
      // 是否禁用提交按钮
      isDisabled: false,
      // 保存进行中（点击【提交】时，发送前为 true, 请求响应后为 false）
      saveLoading: false,
      submitLoading: false,
      // 是否需要校验差旅信息
      isValidateTrips: true,
      // [报销信息] 的 Tab 数组
      REIMBURSE_DETAILS_TABS: this.disabled
        ? REIMBURSE_DETAILS_TABS
        : REIMBURSE_DETAILS_TABS.filter(v => !['SPJL','ZXXX','YXXX'].includes(v.name)),
      // 影像数据
      attachTableList: [],
      // 当前激活的[报销信息]Tab
      tabActive: 'BZMX',
      // 明细Tabs（页面显示的Tabs）
      detailTabs: [],

      // 基本信息（ 培训班信息 ）
      classesInfo: { row: {} },
      // 基本信息 修改合同编号 table 数组
      contractCodeEditTable: [],

      // 报账明细 费用信息 table 数据数组
      costInfoTable: [],
      // 报账明细 收款人信息 table 数据数组
      payeeInfoTable: [],
      // 附件信息 table 数据数组
      enclosureTable: [],
      // 挂账信息 table 数据数组
      accountsInfoTable: [],
      // 核销信息 table 数据数组
      writeOffInfoTable: [],

      // 差旅信息
      travelInfoTable: [],
      // 差旅信息 - 地址
      cityOptions: [],
      // 酒店订单 数据数组
      hotelOrderTable: [],
      // 机票订单 数据数组
      airfareOrderTable: [],
      // 火车订单 数据数组
      trainOrderTable: [],
      // 用车订单 数据数组
      carOrderTable: [],

      // 审批记录
      approvalRecordTable: [],
      // 咨询记录
      consultationRecordTable: [],

      // 定时保存任务
      saveTimer: null,
      // 是否是挂载
      isMounted: false,
      // 差旅订单类型 和 差旅订单数组映射
      travelOrderMaping: {
        酒店: 'hotelOrderTable',
        机票: 'airfareOrderTable',
        火车: 'trainOrderTable',
        用车: 'carOrderTable'
      },
    }
  },
  methods: {
    openFileAttach(row) {
      window.open(row.attUrl)
    },
    stamp(type) {
      if (this.classesInfo.reimStatusCode === 'T02') return this.$message.warning('此报销单未提交成功，无法打印')
      fetchPrintFastReim({
        request: {
          sourceFlag: 'PX',
          billType: type,
          reimId: this.classesInfo.reimId,
          reimIdFas: this.classesInfo.reimIdFas
        }
      })
        .then(res => {
          if(res){
            window.open(res)
          }
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
    // 判断小数是否大于两位
    judgeFloat(float) {
      float = (float + '').split('.')[1]
      return float ? float.length > 2 : false
    },
    // 保留小数至两位
    roundTwo(sum) {
      return this.judgeFloat(sum)
        ? (Math.round(sum * 100) / 100).toFixed(2)
        : sum.toFixed(2)
    },
    // messsage 弹窗工具函数
    messagebox(content) {
      this.$alert(content, '通知', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout autoHeight`
      })
    },
    // 基本信息更新
    classesInfoSaveHandle(data) {
      Object.assign(this.classesInfo,this.classesInfo,data)
      store.commit('reimbursed/updateBaseInfo', this.classesInfo)
    },
    // 挂账信息更新
    suspendsSaveHandle(data) {
      this.accountsInfoTable = CopyObj(data)
    },
    // 核销信息更新
    cancelsSaveHandle(data) {
      this.writeOffInfoTable = CopyObj(data)
    },
    travelSaveHandle(data) {
      this.travelInfoTable = CopyObj(data)
      // console.log('travelInfoTable', this.travelInfoTable)
    },
    // 附件信息更新
    attachesSaveHandle(data) {
      this.enclosureTable = CopyObj(data)
      // this.classesInfo.attaches = data
    },
    // 差旅订单更新
    orderDataChange(data) {
      if (data) {
        this.hotelOrderTable = data.hotelOrderTable || []
        this.airfareOrderTable = data.airfareOrderTable || []
        this.trainOrderTable = data.trainOrderTable || []
        this.carOrderTable = data.carOrderTable || []
      }
    },
    // 设置
    setAfterRepairFlag (value) {
      this.classesInfo.afterRepairFlag = value
    },
    navTabChangeHandle() {},

    // 根据城市 查找编号
    getCitySiteNo(name) {
      let data = []
      this.cityOptions.forEach(province => {
        province.children.forEach(city => {
          if (city.siteName === name && data.length === 0) {
            data.push(province.siteNo)
            data.push(city.siteNo)
          }
        })
      })
      return data
    },
    // 获取城市信息
    getCityOptions() {
      // this.cityOptions = data
      return new Promise((resolve, reject) => {
        try {
          fetchSelectFastReimCity().then(data => {
            this.cityOptions = data
            resolve()
          })
        } catch (e) {
          reject()
        }
      })
    },
    // 判断会计科目是否以105开头
    estimateHead(code) {
      if (code == null) return false
      return /^105/.test(code)
    },
    // 保存报销订单
    // notShow: 是否提示“保存成功”，当被定时任务自动保存时，则不显示“保存成功”
    handleSave(notShow) {
      const data = {}
      // 基本信息
      if (this.classesInfo.classId) {
        data.primary = CopyObj(this.classesInfo)
        data.primary.operate = '01'
        if (data.primary.action === 'edit') {
          data.primary.operate = '02'
        }
        data.primary.reimIdFas || (data.primary.reimIdFas = '')
        data.primary.reimOper = 'submit'
        const fieldArr = [
          'classId',
          'className',
          'classAdviser',
          'classAdviserName',
          'reimDept',
          'reimId'
        ]
        fieldArr.forEach(v => {
          data.primary[v] = this.classesInfo.row[v] || ''
        })

        data.primary.reimTotalAmt = this.costBudgetAmtTotal || 0
        data.primary.reimDuePayAmt = this.reimDuePayAmt + ''
        data.primary.suspendAmt = this.accountsTotalPrice + ''
        data.primary.cnclAmt = this.writeOffTotalPrice + ''
        data.primary.ifShare = this.classesInfo.row.ifShare || this.classesInfo.row.expenseType
      }

      const reimId = this.classesInfo.reimId || this.classesInfo.row.reimId
      if (reimId) {
        data.primary.reimId = reimId
      }

      // 基本信息 - 合同信息
      if (this.classesInfo.contracts.length) {
        data.contracts = CopyObj(this.classesInfo.contracts)
        data.contracts.forEach((v, i) => (v.serialNo = i))
      }

      // 费用信息
      if (this.costInfoTable.length) {
        data.details = CopyObj(this.costInfoTable.slice(0, -1))
        data.details.forEach((v, i) => {
          v.rowIndex = i + 1
          v.classBudgetAmt = v.budgetAmt
          if (v.invoices) {
            v.invoices = v.invoices
            v.invoices.forEach((invoice, index) => {
              invoice.invoiceContent = ''
              invoice.reimBranchId = ''
              invoice.reimId = ''
              invoice.serialNo = index
            })
          }
          v.caikuOrder = v.relationTravelOrderViceTable?.[0] || null
          v.reimId = ''
          v.reimBranchId = i + ''
        })
      }

      // 收款人信息
      const payeeInfoTable = this.payeeInfoTable.filter(v => v.supplierCode)
      if (payeeInfoTable.length) {
        const orgSegment = data.primary.orgSegment
        _.merge(data.primary, payeeInfoTable[0])
        data.primary.orgSegment = orgSegment
        data.primary.placeLayerId = payeeInfoTable[0].reimSupplier.payeePlaceLayerNo
        data.suppliers = CopyObj(payeeInfoTable)
        data.suppliers.forEach((v, i) => {
          delete v.reimSupplier['payAmt']
          delete v.reimSupplier['bankPaySummary']
          _.merge(v, v.reimSupplier)
          v.serialNo = i
          // 设置：是否与报账头供应商相同
          // let primaryFlag = 'N'
          // if (i === 0 && this.classesInfo.supplierCode === v.payeeCode && this.classesInfo.supplierName === v.payeeName) {
          //     primaryFlag = 'Y'
          // }
          v.primaryFlag = i === 0 ? 'Y' : 'N'
        })
        data.primary.supplierAcctOpenName = data.primary.reimSupplier.acctOpenName
        data.primary.supplierId = data.primary.reimSupplier.ofSupplierId
      }

      // 附件信息
      if (this.enclosureTable) {
        data.attaches = CopyObj(this.enclosureTable)
        data.attaches.forEach(v => {
          v.createdDate = v.createdDate.split('T')[0]
          delete v.updatedDate
        })
      }

      // 核销信息
      if (this.writeOffInfoTable) {
        const dict = {
          1: '预付款',
          2: '挂账'
        }
        data.cancels = CopyObj(this.writeOffInfoTable)
        data.cancels.forEach(v => {
          v.cancelTypeDesc = dict[v.cancelType]
          v.serialNo || (v.serialNo = '')
        })
      }

      if (this.accountsInfoTable) {
        data.suspends = CopyObj(this.accountsInfoTable)
        data.suspends.forEach(v => {
          v.costCenterCode = data.primary.costCenterCode
          v.costCenterName = data.primary.costCenterName
          v.profitCenterCode = data.primary.manageCenterCode
          v.profitCenterDesc = data.primary.manageCenterDesc
        })
      }

      // 差旅信息
      if (this.travelInfoTable) {
        data.trips = CopyObj(this.travelInfoTable)
        data.trips.forEach(v => {
          const { tripPersonName, tripPersonUm, blgStripLine, blgDept } = v
          if (v.tripPlace && v.tripPlace[1]) {
            ;[v.tripPlaceCode, v.tripPlace] = v.tripPlace[1].split('_')
          } else {
            v.tripPlace = ''
          }
        })
      }

      console.log('提交数据', data)
      // 发送【保存】请求
      this.saveLoading = true
      insertFastReimForSave(data)
        .then(data => {
          if (notShow !== true) {
            this.$message.success('保存成功')
          }
          this.classesInfo.reimId = data.t
        })
        .finally(() => {
          this.saveLoading = false
        })
    },

    // 修改或新增报销信息的提交事件
    handleSubmit() {
      if (['add', 'edit'].includes(this.action)) {
        this.launchReimbursement()
      } else {
        this.$router.back()
      }
    },

    // 发起报销
    launchReimbursement() {
      this.isDisabled = true
      const data = {}
      // 基本信息
      if (this.classesInfo.classId) {
        data.primary = CopyObj(this.classesInfo)
        data.primary.operate = '01'
        data.primary.reimId = ''
        data.primary.reimIdFas || (data.primary.reimIdFas = '')
        data.primary.reimOper = 'submit'
        ;[
          'classId',
          'className',
          'classAdviser',
          'classAdviserName',
          'reimDept'
        ].forEach(v => {
          data.primary[v] = this.classesInfo.row[v]
        })
        data.primary.reimTotalAmt = this.costBudgetAmtTotal || 0
        data.primary.reimDuePayAmt = this.reimDuePayAmt + ''
        data.primary.suspendAmt = this.accountsTotalPrice + ''
        data.primary.cnclAmt = this.writeOffTotalPrice + ''

        data.primary.ifShare =
          this.classesInfo.row.ifShare || this.classesInfo.row.expenseType
        data.primary.line = this.classesInfo.line
      } else {
        this.messagebox('不能缺少基本信息')
        this.isDisabled = false
        return
      }

      const reimId = this.classesInfo.reimId || this.classesInfo.row.reimId
      if (reimId) {
        data.primary.reimId = reimId
      }

      // 合同信息
      if (this.classesInfo.contracts.length) {
        data.contracts = CopyObj(this.classesInfo.contracts)
        data.contracts.forEach((v, i) => (v.serialNo = i))
      }

      // 验证费用信息
      if (this.costInfoTable.length) {
        data.details = CopyObj(this.costInfoTable.slice(0, -1))
        // 报销金额必填 验证
        const amtValidate = data.details.some(v => !v.amt)
        if (amtValidate) {
          this.messagebox('每条费用信息的报销金额必填')
          this.isDisabled = false
          return
        }
        // 报销行 会计科目 验证
        const subjectVisible = data.details.some((v, i) => {
          if (this.estimateHead(v.accountingSubjectCd)) {
            if (!v.budgetProjectName) {
              this.messagebox(`费用信息第${i + 1}行预算科目未选择`)
              return true
            }
            if (!v.payDate) {
              this.messagebox(`费用信息第${i + 1}行支付日期未选择`)
              return true
            }
          }
        })
        if (subjectVisible) {
          this.isDisabled = false
          return
        }

        data.details.forEach((v, i) => {
          v.rowIndex = i + 1
          v.classBudgetAmt = v.budgetAmt
          if (v.invoices) {
            v.invoices = v.invoices
            v.invoices.forEach((invoice, index) => {
              invoice.invoiceContent = ''
              invoice.reimBranchId = ''
              invoice.reimId = ''
              invoice.serialNo = index
            })
          }
          v.caikuOrder = v.relationTravelOrderViceTable?.[0] || null
          v.reimId = ''
          v.reimBranchId = i + ''
        })
      } else {
        this.messagebox('不能缺少明细信息')
        this.isDisabled = false
        return
      }

      // 收款人信息
      const payeeInfoTable = this.payeeInfoTable.filter(v => v.supplierCode)
      if (payeeInfoTable.length) {
        const orgSegment = data.primary.orgSegment
        _.merge(data.primary, payeeInfoTable[0])
        data.primary.orgSegment = orgSegment
        data.primary.placeLayerId =
          payeeInfoTable[0].reimSupplier.payeePlaceLayerNo
        data.suppliers = CopyObj(payeeInfoTable)
        data.suppliers.forEach((v, i) => {
          delete v.reimSupplier['payAmt']
          delete v.reimSupplier['bankPaySummary']
          _.merge(v, v.reimSupplier)
          v.serialNo = i
          v.primaryFlag = i === 0 ? 'Y' : 'N'
        })
        data.primary.supplierAcctOpenName =
          data.primary.reimSupplier.acctOpenName
        data.primary.supplierId = data.primary.reimSupplier.ofSupplierId
      } else {
        this.messagebox('不能缺少供应商收款人信息')
        this.isDisabled = false
        return
      }
      if (
        this.costBudgetAmtTotal == 0 ||
        this.payeePaymentMoney != this.reimDuePayAmt
      ) {
        console.groupCollapsed(
          `报销单提交/金额验证/未通过：${this.classesInfo.row.className}`
        )
        console.log(
          `验证规则：报账明细总计金额不能为0，且减去“挂账金额”再减去“核销金额”需与“需支付金额”一致！`
        )
        console.log(`规则1：报账总金额不能为0`)
        console.log(
          `规则1验证：报账总金额 = ${this.costBudgetAmtTotal}，验证结果:`,
          this.costBudgetAmtTotal != 0
        )
        console.log(
          `规则2：收款人支付金额 = 本次报账需支付金额 = 报账总金额 - 挂账金额 - 核销金额`
        )
        console.log(`规则2验证：收款人支付金额 = ${this.payeePaymentMoney}`)
        console.log(
          `规则2验证：本次报账需支付金额 = ${this.reimDuePayAmt} = ${this.costBudgetAmtTotal} - ${this.accountsTotalPrice} - ${this.writeOffTotalPrice}`
        )
        console.log(
          `规则2验证：验证结果:`,
          this.payeePaymentMoney == this.reimDuePayAmt
        )
        console.groupEnd()
        this.messagebox(
          `报账明细总计金额不能为0，且减去“挂账金额”再减去“核销金额”需与“需支付金额”一致！`
        )
        this.isDisabled = false
        return
      }

      // 附件信息
      if (this.enclosureTable) {
        data.attaches = CopyObj(this.enclosureTable)
        data.attaches.forEach((v, i) => {
          if (v.createdDate.indexOf('T') > 0) {
            v.createdDate = v.createdDate.split('T')[0]
          } else {
            v.createdDate = v.createdDate.split(' ')[0]
          }
          v.sortNum = i
          delete v.updatedDate
        })
      }

      // 挂账信息
      if (this.accountsInfoTable) {
        data.suspends = CopyObj(this.accountsInfoTable)

        // 报销行 会计科目 验证
        const subjectVisible = data.suspends.some((v, i) => {
          if (this.estimateHead(v.accountingSubjectCd)) {
            if (!v.subjectProjectDesc) {
              this.messagebox(`挂帐信息第${i + 1}行预算科目未选择`)
              return true
            }
            if (!v.payDate) {
              this.messagebox(`挂帐信息第${i + 1}行支付日期未选择`)
              return true
            }
          }
        })

        if (subjectVisible) {
          this.isDisabled = false
          return
        }

        data.suspends.forEach(v => {
          v.costCenterCode = data.primary.costCenterCode
          v.costCenterName = data.primary.costCenterName
          v.profitCenterCode = data.primary.manageCenterCode
          v.profitCenterDesc = data.primary.manageCenterDesc
        })
      }

      // 核销信息
      if (this.writeOffInfoTable) {
        const dict = {
          1: '预付款',
          2: '挂账'
        }
        data.cancels = CopyObj(this.writeOffInfoTable)
        data.cancels.forEach(v => {
          v.cancelTypeDesc = dict[v.cancelType]
          v.serialNo || (v.serialNo = '')
        })
        const flag = data.cancels.some(v => {
          return !v.thisTimeCancelAmt
        })
        if (flag) {
          this.messagebox('必须填写本次核销金额')
          this.isDisabled = false
          return
        }
      }

      // 差旅信息
      if (this.travelInfoTable) {
        data.trips = CopyObj(this.travelInfoTable)
        const flag1 = data.trips.some(v => {
          return !v.planTicketNum
        })
        if (flag1) {
          this.messagebox('必须填写机票张数')
          this.isDisabled = false
          return
        }
        const flag2 = data.trips.some(v => {
          return !v.otherTrafficNum
        })
        if (flag2) {
          this.messagebox('必须填写其他交通票数')
          this.isDisabled = false
          return
        }
        const flag3 = data.trips.some(v => {
          return !v.tripStartDate
        })
        if (flag3) {
          this.messagebox('必须选择出差开始日期')
          this.isDisabled = false
          return
        }
        const flag4 = data.trips.some(v => {
          return !v.tripEndDate
        })
        if (flag4) {
          this.messagebox('必须选择出差结束日期')
          this.isDisabled = false
          return
        }
        const flag5 = data.trips.some(v => {
          return !v.tripPlace[1]
        })
        if (flag5) {
          this.messagebox('必须选择出差地点')
          this.isDisabled = false
          return
        }
        data.trips.forEach(v => {
          const { tripPersonName, tripPersonUm, blgStripLine, blgDept } = v
          ;[v.tripPlaceCode, v.tripPlace] = v.tripPlace[1].split('_')
        })
      }

      // 判断费用信息是否含有 机票-不含民航发展基金 火车票 差旅-住宿费
      if (this.isValidateTrips && data.details) {
        const tripsFlag = data.details.some(
          v =>
            v.feeMinCategory === '16271' ||
            v.feeMinCategory === '16273' ||
            v.feeMinCategory === '05010'
        )
        if (tripsFlag && !data.trips?.length) {
          this.isValidateTrips = false
          this.isDisabled = false
          return customHint(
            '请填写差旅信息',
            undefined,
            undefined,
            undefined,
            '我知道了'
          )
        }
      }
      this.submitLoading = true
      insertFastReim(data)
        .then(resData => {
          this.$message.success('报销成功')
          closeCurrPageAndGoPath('/MyReimbursement')
        })
        .catch(resData =>{
          if (resData.msg && resData.msg.split('失败单号：+')[1]) {
            this.classesInfo.reimId = resData.msg.split('失败单号：+')[1]
          }
        })
        .finally(res => {
          this.submitLoading = false
        })
    },
    async getDefaultSupplier(routeParams) {
      /** 
      supplierAcctOpenName: string 非必须 首位供应商开户名称	
      supplierCode: string	非必须 首位供应商编码	
      supplierId: string 非必须 首位供应商id	
      supplierName: string 非必须 首位供应商名称
      supplierDesc: [supplierCode]supplierName|orgSegment (显示)
      orgSegment: string 非必须 机构段编码
      operUm: string 非必须 经办人um
      */
      // let { orgSegment, operUm, supplierCode = '', supplierName = '', } = this.classesInfo
      let {
        orgSegment,
        operUm,
        supplierCode = '',
        supplierName = ''
      } = routeParams
      if (routeParams.action == 'add') {
        const params = { umId: operUm, orgCode: orgSegment }
        try{
          const { list } = await fetchSelectFastReimSupplier(params)
          if (list?.length) {
            return list[0]
          }
        } catch (e) {
          return {
            supplierCode,
            supplierName,
            supplierStr,
            reimSupplier: { 
              ofSupplierId: routeParams.supplierId, 
              acctOpenBranchInfo: routeParams.supplierAcctOpenName 
            }
          }
        }
      }
    },

    // 定时保存任务
    createSaveTimer() {
      this.saveTimer = setTimeout(() => {
        this.handleSave(true)
        this.createSaveTimer()
      }, 1000 * 300) // 5分种 = 1000 * 60 * 5
    },
    // 清空本页面的数据
    clearCurrentData() {
      this.enclosureTable = []
      this.writeOffInfoTable = []
      this.costInfoTable = []
      this.payeeInfoTable = []
      this.accountsInfoTable = []
      this.travelInfoTable = []
      this.classesInfo.contracts = []
      this.classesInfo.attaches = []
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
    // 将查询得到的订单数据，转化符合本页面的数据格式
    serveDateToLocalData(data) {
      if (data.primary) {
        // afterRepairFlag【是否后补专票】为“Y”，否则“N”
        if (!data.primary.afterRepairFlag) {
          data.primary.afterRepairFlag = 'N'
        }
        // 当单据状态 == 04 【已退回】时，修改时将原报销单号作为报账头信息的入参expenseId
        const reimId = data.primary.reimId || data.primary.row.reimId
        if ((data.primary.reimStatusCode === '04' || data.primary.reimStatusCode === 'T02') && reimId) {
          data.primary.reimId = reimId
          data.primary.expenseId = reimId
        }
        this.classesInfo = data.primary
      }
      // 费用信息
      if (data.details) {
        data.details.forEach((v, i) => {
          v.budgetAmt = v.classBudgetAmt
          if (v.invoices) {
            v.relationTicketViceTable = v.invoices
          }
          if (v.caikuOrder) {
            v.relationTravelOrderViceTable = [v.caikuOrder]
          }
        })
        const caikuOrderList = data.details
          .map((v) => v.caikuOrder)
          .filter((v) => v && v.caikuOrderId)
        this.hotelOrderTable = []
        this.airfareOrderTable = []
        this.trainOrderTable = []
        this.carOrderTable = []
        caikuOrderList.forEach((v) => {
          v.startTime = v.startTime.split(' ')[0]
          this[this.travelOrderMaping[v.caikuOrderType]].push(v)
        })
        // this.classesInfo.details = data.details
        this.costInfoTable = data.details
      }
      // 核销列表信息
      this.classesInfo.cancels = data.cancels || []
      // 合同列表信息
      this.classesInfo.contracts = data.contracts || []
      // 附件列表信息
      this.classesInfo.attaches = data.attaches || []
      // 供应商收款人信息
      if (data.suppliers) {
        data.suppliers.forEach((v, i) => {
          v.bankPaySummary = v.reimSupplier.bankPaySummary
        })
        data.primary.payeePlaceLayerNo = data.primary.placeLayerId
        this.payeeInfoTable = data.suppliers
        this.classesInfo.suppliers = data.suppliers
      }
      // 挂账信息
      this.classesInfo.suspends = data.suspends || []
      // 差旅信息
      if (data.trips) {
        data.trips.forEach(item => {
          item.tripPersonName = item.tripPersons[0].tripPersonName
        })
      }
      this.classesInfo.trips = data.trips || []
      // 审批信息
      if (data.approved) {
        this.approvalRecordTable = data.approved || []
      }
      // 咨询记录
      if (data.consultInfos) {
        this.consultationRecordTable = data.consultInfos || []
      }
      if (this.classesInfo.reimIdFas) {
        fetchFastReimVideo({
          request: {
            reimId: this.classesInfo.reimId,
            reimIdFas: this.classesInfo.reimIdFas
          }
        }).then(res => {
          this.attachTableList = res || []
        })
      }
    },
    // 初始化Data数据
    async _initData(params) {
      this.classesInfo.details = []
      this.classesInfo.suspends = []
      this.classesInfo.cancels = []
      const { action } = params
      const {
        empName,
        deptName,
        deptno,
        umId,
        orgId
      } = this.$store.state.userInfo

      // 根据“页面类型”设置要显示的Tab
      if (params.action === 'check') {
        this.isDisabled = true
        this.detailTabs = [...this.REIMBURSE_DETAILS_TABS]
      } else {
        // 重置一些页面状态
        this.saveLoading = false
        this.isDisabled = false
        // 当不是查看报销单页面时，则不显示“审批记录”Tab
        this.detailTabs = this.REIMBURSE_DETAILS_TABS.filter(
          m => m.name !== 'SPJL'
        )
      }

      // 获取城市信息
      await this.getCityOptions()
      if (params.action === 'edit') {
        params.trips.forEach(v => {
          v.tripPlace = this.getCitySiteNo(v.tripPlace)
        })
      }
      // 设置当前页面数据
      if (['add'].includes(action)) {
        // 设置默认：经办人，机构
        params.operUm = umId
        params.operName = empName
        params.orgId = orgId
        params.operOrgCode = deptno
        params.operOrgName = deptName
        // 设置默认供应商
        const defaultSupplier = await this.getDefaultSupplier(params)
        if (defaultSupplier) {
          params.supplierId = defaultSupplier.reimSupplier.ofSupplierId
          params.supplierCode = defaultSupplier.supplierCode
          params.supplierName = defaultSupplier.supplierName
          params.supplierStr = defaultSupplier.supplierStr
          params.supplierAcctOpenName = defaultSupplier.reimSupplier.acctOpenBranchInfo
          params.defaultSupplier = defaultSupplier
          // params.supplierDefaultDesc = `[${params.supplierCode}]${params.supplierName}|${params.orgSegment}`
        }

        if (params.classId) {
          params.expenseDetails.forEach(v => (v.checked = false))
          // params.expenseDetails.push(...this.currentReimbursementMoneyTable)
        }
        if (!params.afterRepairFlag) {
          params.afterRepairFlag = 'N'
        }
        if (!params.row) {
          params.row = {}
        }
        this.classesInfo = params
        store.commit('reimbursed/updateBaseInfo', this.classesInfo)
        this.clearCurrentData()
      } else {
        params.primary.row = params.row
        this.serveDateToLocalData(params)
      }

      // 设置当前激活Tab
      this.tabActive = 'BZMX'

      // 基本信息：添加合计行
      this.costAddSummary()

      if (!this.disabled) {
        // 添加定时保存
        this.createSaveTimer()
      }
      // 重置是否需要校验差旅信息
      this.isValidateTrips = true

      // 把数据存入vuex
      store.commit('reimbursed/updateBaseInfo', this.classesInfo)
    }
  },
  mounted() {
    const params = this.$route.params
    if(params.action === 'add'){
      this._initData(params)
    } else {
      params.primary.row = params.row
      this._initData(params)
    }
    this.isMounted = true
  },
  activated() {
    // 1、当 this.$route.params 有数据时，则表示从路由跳转过来的，此时可以用于初化data数据
    // 2、当 this.$route.params = {} 时，则表示点击Tab来打开页面的，此时不应该设置data数据
    // console.log('xf-LaunchTrainingCourse2:activated', this.$route.params)
    const params = this.$route.params
    // 当先打开2.0的报销再修改1.0的报销时会进入activated
    if (params.primary?.isFastReim === 'N') return
    if (this.isMounted && !params.action) {
      this.isMounted = false
      return
    }
    if (params && Object.keys(params).length) {
      // 设置data数据
      this.routeParams = CopyObj(params)
      console.log('从路由跳转过来的,需要重置data数据', this.action)
      this._initData(params)
    } else {
      console.log('点击Tab来打开页面的,不需要重置data数据', this.action)
    }
  },
  computed: {
    // 费用信息 付款金额
    costBudgetAmtTotal() {
      // 费用信息 专票 付款金额
      const costZAmtTotal = this.costAmtTotalCommon(true)
      // 费用信息 普票 付款金额
      const costPAmtTotal = this.costAmtTotalCommon()
      // 总金额
      const sum =
        ((costZAmtTotal || 0) * 100 + (costPAmtTotal || 0) * 100) / 100
      return this.roundTwo(sum)
    },
    // 挂账信息金额
    accountsTotalPrice() {
      let sum = 0
      this.accountsInfoTable.forEach(v => {
        sum += Number.parseFloat(v.amt) || 0
      })
      return sum
    },
    // 核销信息 本次核销金额 总数
    writeOffTotalPrice() {
      let sum = 0
      this.writeOffInfoTable.forEach(v => {
        sum += Number.parseFloat(v.thisTimeCancelAmt) || 0
      })
      return sum
    },
    // 需支付金额 =（ 付款金额 - 挂账总金额 - 核销总金额 ）= 收款人支付金额
    reimDuePayAmt() {
      return (
        this.costBudgetAmtTotal -
        this.accountsTotalPrice -
        this.writeOffTotalPrice
      )
    },
    // 收款人信息 支付金额
    payeePaymentMoney() {
      let sum = 0
      this.payeeInfoTable.forEach(v => {
        sum += Number.parseFloat(v.payAmt) || 0
      })
      return myFloat(sum)
    }
  },
  deactivated() {
    // 清除定时任务
    clearTimeout(this.saveTimer)
  },
  destroyed() {
    // 清除定时任务
    clearTimeout(this.saveTimer)
  }
}
</script>
<style lang="scss" scoped>
.Reimbursement__LaunchTrainingCourseNew {
  .LaunchTrainingCourse {
    &__number-card {
      height: 80px;
      position: sticky;
      top: -15px;
      z-index: 11;
      transition-duration: 0;
      &__left {
        float: left;
        line-height: 40px;
        font-size: 14px;
        &__title {
          margin-right: 20px;
        }
      }
      .fr .el-button {
        width: 80px;
      }
    }
  }
  .LaunchTrainingCourseNew__info-card {
    margin-top: 19px;
    margin-left: 19px;
    border: 1px solid #eaecf1;
    &__ditail {
      padding: 0 20px;
    }
  }
}
</style>