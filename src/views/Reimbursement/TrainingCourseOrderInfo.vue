<template>
  <div class="LaunchTrainingCourse">
    <!-- 单据编号 卡片 -->
    <el-card class="LaunchTrainingCourse__number-card">
      <div class="LaunchTrainingCourse__number-card__left">
        <span class="LaunchTrainingCourse__number-card__left__title"
          >单据编号</span
        >
        <span>{{ classesInfo.row.reimIdFas }}</span>
      </div>
      <div class="LaunchTrainingCourse__number-card__right">
        <el-button @click="$router.back()">返回</el-button>
        <el-button @click="stamp" type="primary">打印</el-button>
      </div>
    </el-card>
    <el-card class="LaunchTrainingCourse__info-card">
      <!-- 基本信息 -->
      <div class="LaunchTrainingCourse__info-card__base-info">
        <div class="LaunchTrainingCourse__title margin-0">
          <div class="LaunchTrainingCourse__title__left">
            <span class="LaunchTrainingCourse__title__left__menu"></span>
            基本信息
          </div>
        </div>
        <el-form :inline="true" :model="classesInfo">
          <el-form-item>
            <gc-input
              label="经办人"
              v-model="classesInfo.operName"
              disabled
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="机构"
              v-model="classesInfo.orgDesc"
              disabled
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="管理中心"
              v-model="classesInfo.manageCenterDesc"
              disabled
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="成本中心"
              class="page-input"
              v-model="classesInfo.costCenterName"
              disabled
            >
              <i slot="suffix" class="page-input__search"></i>
            </gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="立项编号"
              class="page-input"
              v-model="classesInfo.row.classId"
              disabled
            >
              <template slot="suffix">
                <i class="page-input__edit"></i>
              </template>
            </gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="立项名称"
              disabled
              v-model="classesInfo.row.className"
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="合同编号"
              class="
                page-input
                LaunchTrainingCourse__info-card__base-info__contract-code
              "
              v-model="classesInfo.contractCode"
              disabled
            >
              <template slot="suffix">
                <i class="page-input__search"></i>
                <i class="page-input__line"></i>
                <i class="page-input__edit"></i>
              </template>
            </gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="合同名称"
              disabled
              v-model="classesInfo.contractName"
            ></gc-input>
          </el-form-item>
          <el-form-item class="">
            <div class="empty"></div>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="挂账金额"
              :value="accountsTotalPrice + ''"
              disabled
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="核销金额"
              :value="writeOffTotalPrice + ''"
              disabled
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="需支付金额"
              :value="
                costBudgetAmtTotal -
                accountsTotalPrice -
                writeOffTotalPrice +
                ''
              "
              disabled
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="单据状态"
              disabled
              placeholder=""
              v-model="classesInfo.reimStatus"
            ></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="提交日期"
              disabled
              placeholder=""
              v-model="classesInfo.reimSubmitDate"
            >
            </gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              label="审批状态"
              disabled
              placeholder=""
              v-model="classesInfo.applyStatus"
            ></gc-input>
          </el-form-item>
          <el-form-item label="说明" class="textarea">
            <el-input
              type="textarea"
              maxlength="490"
              show-word-limit
              resize="none"
              placeholder="请输入"
              v-model="classesInfo.remark"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 报销信息 -->
      <div class="LaunchTrainingCourse__info-card__reimbursement">
        <!-- 报销信息 标题  -->
        <div class="LaunchTrainingCourse__title">
          <div class="LaunchTrainingCourse__title__left">
            <span class="LaunchTrainingCourse__title__left__menu"></span>
            报销信息
          </div>
          <!-- <div class="icons">
                        <span
                            class="icons__all"
                            @click="scanImageVisible = true"
                        >
                            <i class="icons__all__icon"></i>
                            所有影像
                        </span>
                        <span class="icons__download">
                            <i class="icons__download__icon"></i>
                            下载影像
                        </span>
                    </div> -->
        </div>
        <!-- tabs组件 -->
        <el-tabs v-model="activeName">
          <!-- 报账明细 -->
          <el-tab-pane label="报账明细" name="reimbursedInfo">
            <div class="LaunchTrainingCourse__info-card__reimbursement__cost">
              <div
                class="
                  LaunchTrainingCourse__info-card__reimbursement__cost__title
                  LaunchTrainingCourse__title
                  vice-title
                "
              >
                <div class="LaunchTrainingCourse__title__left-small">
                  <div>.</div>
                  费用信息
                </div>
              </div>
              <div
                class="
                  LaunchTrainingCourse__info-card__reimbursement__cost__content
                "
              >
                <gc-table
                  class="general__table"
                  ref="costInfoTableRef"
                  :stripe="false"
                  :list="costInfoList"
                  :tableList="costInfoTable"
                  :span-method="costSpanMethod"
                  :cell-class-name="costCellClassName"
                >
                  <template>
                    <el-table-column label="可报销金额" min-width="100">
                      <template slot-scope="scope">
                        {{
                          myRound(
                            scope.row.budgetAmt -
                              (scope.row.payedAmt || 0) -
                              (scope.row.occupyAmt || 0),
                            2,
                            true
                          )
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column label="本次报销金额" min-width="186">
                      <template slot-scope="scope">
                        <gc-input v-model="scope.row.amt" disabled></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="预算科目" min-width="180">
                      <template slot-scope="scope">
                        <el-input
                          readonly
                          v-model="scope.row.budgetProjectName"
                          v-if="scope.row.budgetProjectName"
                        >
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="支付日期" min-width="140">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.payDate"
                          disabled
                          v-if="scope.row.budgetProjectName"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="项目" min-width="180">
                      <template slot-scope="scope" v-if="!scope.row.type">
                        <el-input
                          disabled
                          class="input-suffix-type"
                          :value="scope.row.projectName"
                        >
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="产品" min-width="180">
                      <template slot-scope="scope" v-if="!scope.row.type">
                        <el-input
                          disabled
                          class="input-suffix-type"
                          :value="scope.row.productName"
                        >
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="订单号" min-width="180">
                      <template slot-scope="scope" v-if="!scope.row.type">
                        <el-input
                          disabled
                          class="input-suffix-type"
                          :value="scope.row.kuOrderName"
                        >
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="报销事项" min-width="198">
                      <template slot-scope="scope">
                        <gc-input
                          v-model="scope.row.remark"
                          disabled
                        ></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="是否可抵扣" min-width="102">
                      <template slot-scope="scope">
                        {{ scope.row.deductionFlag == 1 ? '是' : '否' }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      fixed="right"
                      min-width="120"
                      class-name="LaunchTrainingCourse__info-card__reimbursement__cost__content__const-operation"
                    >
                      <template slot-scope="scope">
                        <span
                          class="mr20"
                          @click="
                            handlerelationTicketVisible(scope.row, scope.$index)
                          "
                        >
                          <el-tooltip
                            content="关联专票"
                            popper-class="icon-popper"
                          >
                            <i class="operation__relationTicket"></i>
                          </el-tooltip>
                          <i
                            class="active__num"
                            v-show="
                              (scope.row.relationTicketViceTable || []).length
                            "
                            >{{
                              (scope.row.relationTicketViceTable || []).length
                            }}</i
                          ></span
                        >
                        <span
                          v-if="
                            scope.row.expenseType >= '000401' &&
                            scope.row.expenseType <= '000405'
                          "
                          @click="
                            openRelationTravelOrderDialog(
                              scope.row,
                              scope.$index
                            )
                          "
                        >
                          <el-tooltip
                            content="关联差旅订单"
                            popper-class="icon-popper"
                          >
                            <i class="operation__relationTravelOrder"></i>
                          </el-tooltip>
                          <i
                            class="active__num"
                            v-show="
                              (scope.row.relationTravelOrderViceTable || [])
                                .length
                            "
                            >{{
                              (scope.row.relationTravelOrderViceTable || [])
                                .length
                            }}</i
                          >
                        </span>
                        <!-- <span
                          class="active ml20"
                          @click="openApportionConst(scope.row)"
                        >
                          <el-tooltip
                            content="费用分摊"
                            popper-class="icon-popper"
                          >
                            <i class="operation__apportionConst"></i>
                          </el-tooltip>
                        </span> -->
                      </template>
                    </el-table-column>
                  </template>
                </gc-table>
              </div>
            </div>
            <div class="LaunchTrainingCourse__info-card__reimbursement__payee">
              <div
                class="
                  LaunchTrainingCourse__info-card__reimbursement__payee__title
                  LaunchTrainingCourse__title
                  vice-title
                "
              >
                <div class="LaunchTrainingCourse__title__left-small">
                  <div>.</div>
                  收款人信息
                </div>
              </div>
              <div
                class="
                  LaunchTrainingCourse__info-card__reimbursement__payee__content
                  table__wrapper
                "
              >
                <div class="width-fit">
                  <el-table :data="payeeInfoTable" ref="payeeInfoTableRef">
                    <el-table-column type="selection" width="54">
                    </el-table-column>
                    <el-table-column
                      type="index"
                      label="序号"
                      width="60"
                    ></el-table-column>
                    <el-table-column
                      label="供应商名称"
                      min-width="205"
                      class-name="LaunchTrainingCourse__info-card__reimbursement__payee__content__search"
                    >
                      <template slot-scope="scope">
                        <gc-input v-model="scope.row.supplierName" disabled
                          ><i slot="suffix" class="page-input__search"></i
                        ></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="供应商代码"
                      min-width="100"
                      prop="name"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.supplierCode }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="供应商地点"
                      min-width="103"
                      prop="address"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.addrName }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="业务实体"
                      min-width="103"
                      prop="date"
                    >
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
                    <el-table-column label="支付金额" min-width="175">
                      <template slot-scope="scope">
                        <gc-input
                          v-model="scope.row.payAmt"
                          disabled
                        ></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="银行汇款用途" min-width="205">
                      <template slot-scope="scope">
                        <gc-input
                          v-model="scope.row.bankPaySummary"
                          disabled
                        ></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="税收居民身份" min-width="106">
                      <template slot-scope="scope">
                        {{ scope.row.residentDescFlag }}
                      </template>
                    </el-table-column>
                  </el-table>
                  <div
                    class="
                      LaunchTrainingCourse__info-card__reimbursement__payee__content__total
                      total
                      table__wrapper__botton-money
                    "
                  >
                    <div class="table__wrapper__botton-money__title">
                      合 计 金 额
                    </div>
                    <div
                      class="
                        LaunchTrainingCourse__info-card__reimbursement__payee__content__total__price
                      "
                    >
                      {{ payeePaymentMoney }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 挂账信息 -->
          <el-tab-pane
            label="挂账信息"
            name="accountsInfo"
            class="LaunchTrainingCourse__info-card__reimbursement__accounts"
          >
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__accounts__title
                LaunchTrainingCourse__title
                vice-title
              "
            >
              <div class="LaunchTrainingCourse__title__left-small">
                <div>.</div>
                挂账信息
              </div>
            </div>
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__accounts__content
                table__wrapper
              "
            >
              <div class="width-fit">
                <el-table :data="accountsInfoTable" ref="accountsInfoTableRef">
                  <el-table-column type="selection" min-width="54">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                  ></el-table-column>
                  <el-table-column
                    label="挂账大类"
                    min-width="160"
                    prop="maxCategoryName"
                  >
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        class="page-input"
                        v-model="scope.row.suspendMaxCategoryDesc"
                        disabled
                      >
                        <i slot="suffix" class="page-input__search"></i>
                      </gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="挂账小类" min-width="300">
                    <template slot-scope="scope">{{
                      scope.row.suspendMinCategoryDesc
                    }}</template>
                  </el-table-column>
                  <el-table-column label="金额" min-width="146">
                    <template slot-scope="scope">
                      <gc-input v-model="scope.row.amt" disabled> </gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="预算科目" min-width="180">
                    <template slot-scope="scope">
                      <el-input
                        readonly
                        v-model="scope.row.subjectProjectDesc"
                        v-if="scope.row.subjectProjectDesc"
                      >
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="支付日期" min-width="190">
                    <template slot-scope="scope">
                      <gc-input v-model="scope.row.payDate" disabled></gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="项目" min-width="180">
                    <template slot-scope="scope">
                      <el-input
                        disabled
                        class="input-suffix-type"
                        :value="scope.row.channelOrProjectDesc"
                      >
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="产品" min-width="180">
                    <template slot-scope="scope">
                      <el-input
                        disabled
                        class="input-suffix-type"
                        :value="scope.row.productDesc"
                      >
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="订单号" min-width="180">
                    <template slot-scope="scope">
                      <el-input
                        disabled
                        class="input-suffix-type"
                        :value="scope.row.orderNoDesc"
                      >
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="挂账事项" min-width="264">
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        v-model="scope.row.suspendMatters"
                        disabled
                      ></gc-input>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  class="
                    LaunchTrainingCourse__info-card__reimbursement__accounts__content__total
                    table__wrapper__botton-money
                    total
                  "
                >
                  <div
                    class="
                      LaunchTrainingCourse__info-card__reimbursement__accounts__content__total__title
                      table__wrapper__botton-money__title
                    "
                  >
                    合 计 金 额
                  </div>
                  <div
                    class="
                      LaunchTrainingCourse__info-card__reimbursement__accounts__content__total__price
                    "
                  >
                    {{ accountsTotalPrice }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 核销信息 -->
          <el-tab-pane
            label="核销信息"
            name="writeOffInfo"
            class="LaunchTrainingCourse__info-card__reimbursement__write-off"
          >
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__write-off__title
                LaunchTrainingCourse__title
                vice-title
              "
            >
              <div class="LaunchTrainingCourse__title__left-small">
                <div>.</div>
                核销信息
              </div>
            </div>
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__write-off__content
                table__wrapper
              "
            >
              <div class="width-fit">
                <el-table :data="writeOffInfoTable" ref="writeOffInfoTableRef">
                  <el-table-column type="selection" width="54">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    min-width="60"
                  ></el-table-column>
                  <el-table-column label="核销类型" min-width="205">
                    <gc-input
                      :value="
                        accountSearchForm.cancelBillType === '1'
                          ? '预付款'
                          : accountSearchForm.cancelBillType === '2'
                          ? '挂账'
                          : ''
                      "
                      disabled
                    ></gc-input>
                  </el-table-column>
                  <el-table-column label="挂账单号" min-width="205">
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        class="page-input"
                        v-model="scope.row.advancePayExpenseNo"
                        disabled
                      >
                        <i slot="suffix" class="page-input__search"></i>
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
                      <gc-input
                        placeholder=""
                        v-model="scope.row.desc"
                        disabled
                      >
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
                  <el-table-column label="本次核销金额" min-width="126">
                    <template slot-scope="scope"
                      ><gc-input
                        v-model="scope.row.thisTimeCancelAmt"
                        disabled
                      ></gc-input
                    ></template>
                  </el-table-column>
                </el-table>
                <div
                  class="
                    LaunchTrainingCourse__info-card__reimbursement__write-off__content__total
                    table__wrapper__botton-money
                    total
                  "
                >
                  <div
                    class="
                      LaunchTrainingCourse__info-card__reimbursement__write-off__content__total__title
                      table__wrapper__botton-money__title
                    "
                  >
                    合 计 金 额
                  </div>
                  <div
                    class="
                      LaunchTrainingCourse__info-card__reimbursement__write-off__content__total__price
                    "
                  >
                    {{ writeOffTotalPrice }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 差旅信息 -->
          <el-tab-pane
            label="差旅信息"
            name="travelInfo"
            class="LaunchTrainingCourse__info-card__reimbursement__travel"
          >
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__travel__title
                LaunchTrainingCourse__title
                vice-title
              "
            >
              <div class="LaunchTrainingCourse__title__left-small">
                <div>.</div>
                出差信息
              </div>
            </div>
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__travel__content
                table__wrapper
              "
            >
              <div class="width-fit">
                <el-table :data="travelInfoTable" ref="travelInfoTableRef">
                  <el-table-column type="selection" width="54">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                  ></el-table-column>
                  <el-table-column label="出差人" min-width="200">
                    <template slot-scope="scope">
                      {{ handleName(scope.row.tripPersons) }}
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                                        label="职级"
                                        min-width="200"
                                    >
                                        <template slot-scope="scope">
                                            {{ scope.row.jobLevelDesc }}
                                        </template>
                                    </el-table-column> -->
                  <el-table-column label="人数" min-width="80">
                    <template slot-scope="scope">
                      {{ scope.row.tripPersonNum }}
                    </template>
                  </el-table-column>
                  <el-table-column label="机票张数" min-width="80">
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        v-model="scope.row.planTicketNum"
                        disabled
                      >
                      </gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="其他交通票数" min-width="100">
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        disabled
                        :value="scope.row.otherTrafficNum"
                      >
                      </gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="出差开始日期" min-width="140">
                    <template slot-scope="scope">
                      <gc-input v-model="scope.row.tripStartDate" disabled />
                    </template>
                  </el-table-column>
                  <el-table-column label="出差结束日期" min-width="140">
                    <template slot-scope="scope">
                      <gc-input v-model="scope.row.tripEndDate" disabled />
                    </template>
                  </el-table-column>
                  <el-table-column label="出差天数" min-width="80">
                    <template slot-scope="scope">
                      {{
                        daysApart(
                          scope.row.tripEndDate,
                          scope.row.tripStartDate
                        ) + 1
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column label="出差地点" min-width="185">
                    <template slot-scope="scope">
                      <gc-input
                        disabled
                        v-model="scope.row.tripPlace"
                      ></gc-input>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  class="
                    LaunchTrainingCourse__info-card__reimbursement__travel__content__total
                    table__wrapper__botton-money
                    total
                  "
                >
                  <div
                    class="
                      LaunchTrainingCourse__info-card__reimbursement__travel__content__total__title
                      table__wrapper__botton-money__title
                    "
                  >
                    合 计
                  </div>
                  <div
                    class="
                      LaunchTrainingCourse__info-card__reimbursement__travel__content__total__price
                    "
                  >
                    {{ travelInfoNumTotal }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- 审批记录 -->
          <el-tab-pane
            label="审批记录"
            name="approvalRecord"
            class="
              LaunchTrainingCourse__info-card__reimbursement__approval-record
            "
          >
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__approval-record__title
                LaunchTrainingCourse__title
                vice-title
              "
            >
              <div class="LaunchTrainingCourse__title__left-small">
                <div>.</div>
                审批记录
              </div>
            </div>
            <div
              class="
                LaunchTrainingCourse__info-card__reimbursement__approval-record__content
                table__wrapper
                last-tr-no-border
              "
            >
              <gc-table
                :stripe="false"
                :list="approvalRecordList"
                :tableList="approvalRecordTable"
              ></gc-table>
            </div>
          </el-tab-pane>
          <!-- 咨询记录 -->
          <!-- <el-tab-pane
                        label="咨询记录"
                        name="consultationRecord"
                        class="LaunchTrainingCourse__info-card__reimbursement__consultation-record"
                    >
                        <div
                            class="LaunchTrainingCourse__info-card__reimbursement__consultation-record__title LaunchTrainingCourse__title vice-title"
                        >
                            <div
                                class="LaunchTrainingCourse__title__left-small"
                            >
                                <div>.</div>
                                咨询记录
                            </div>
                        </div>
                        <div
                            class="LaunchTrainingCourse__info-card__reimbursement__consultation-record__contant table__wrapper"
                            :class="{
                                'last-tr-no-border':
                                    consultationRecordTable.length
                            }"
                        >
                            <gc-table
                                :stripe="false"
                                :list="consultationRecordList"
                                :tableList="consultationRecordTable"
                            ></gc-table>
                        </div>
                    </el-tab-pane> -->
        </el-tabs>
      </div>
      <!-- 附件信息 -->
      <div
        class="LaunchTrainingCourse__info-card__enclosure"
        v-show="activeName === 'reimbursedInfo'"
      >
        <div class="LaunchTrainingCourse__title title">
          <div class="LaunchTrainingCourse__title__left">
            <span class="LaunchTrainingCourse__title__left__menu"></span>
            附件信息
          </div>
        </div>
        <div class="LaunchTrainingCourse__info-card__item-content">
          <gc-table
            :list="enclosureList"
            :tableList="enclosureTable"
            :stripe="false"
            ref="TrainingCourseOrderInfoEnclosureTableRef"
            class="general__table"
          >
            <template>
              <el-table-column label="附件名称">
                <template slot-scope="scope">
                  <a :href="handleUdmpHref(scope.row.udmpId)" class="active">{{
                    scope.row.fileName
                  }}</a>
                </template>
              </el-table-column>
              <el-table-column label="附件类型">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.submodule === 'e_invoice'
                      ? '电子发票'
                      : scope.row.submodule === 'attach'
                      ? '普通附件'
                      : ''
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="上传时间">
                <template slot-scope="scope">
                  {{ scope.row.createdDate | filterTime }}
                </template>
              </el-table-column>
              <el-table-column
                label="上传人"
                prop="createdBy"
              ></el-table-column>
            </template>
          </gc-table>
        </div>
      </div>
      <!-- 酒店， 机票， 火车， 用车订单信息 -->
      <div
        class="LaunchTrainingCourse__info-card__travel-orders"
        v-show="activeName === 'travelInfo'"
      >
        <!-- 酒店订单 -->
        <div class="LaunchTrainingCourse__info-card__travel-orders__hotel">
          <div class="LaunchTrainingCourse__title">
            <div class="LaunchTrainingCourse__title__left">
              <span class="LaunchTrainingCourse__title__left__menu"></span>
              酒店订单
            </div>
          </div>
          <div
            class="
              LaunchTrainingCourse__info-card__item-content
              LaunchTrainingCourse__info-card__travel-orders__hotel__content
              table__wrapper
            "
          >
            <gc-table
              :list="hotelOrderList"
              :tableList="hotelOrderTable"
              :stripe="false"
            ></gc-table>
          </div>
        </div>
        <!-- 机票订单 -->
        <div
          class="
            LaunchTrainingCourse__info-card__travel-orders__airfare
            super-long-table
          "
        >
          <div class="LaunchTrainingCourse__title">
            <div class="LaunchTrainingCourse__title__left">
              <span class="LaunchTrainingCourse__title__left__menu"></span>
              机票订单
            </div>
          </div>
          <div
            class="
              LaunchTrainingCourse__info-card__item-content
              LaunchTrainingCourse__info-card__travel-orders__airfare__content
              table__wrapper
            "
          >
            <gc-table
              :list="airfareOrderList"
              :tableList="airfareOrderTable"
              :stripe="false"
            ></gc-table>
          </div>
        </div>
        <!-- 火车订单 -->
        <div class="LaunchTrainingCourse__info-card__travel-orders__train">
          <div class="LaunchTrainingCourse__title">
            <div class="LaunchTrainingCourse__title__left">
              <span class="LaunchTrainingCourse__title__left__menu"></span>
              火车订单
            </div>
          </div>
          <div
            class="
              LaunchTrainingCourse__info-card__item-content
              LaunchTrainingCourse__info-card__travel-orders__train__content
              table__wrapper
            "
          >
            <gc-table
              :list="trainOrderList"
              :tableList="trainOrderTable"
              :stripe="false"
            ></gc-table>
          </div>
        </div>
        <!-- 用车订单 -->
        <div
          class="
            LaunchTrainingCourse__info-card__travel-orders__car
            super-long-table
          "
        >
          <div class="LaunchTrainingCourse__title">
            <div class="LaunchTrainingCourse__title__left">
              <span class="LaunchTrainingCourse__title__left__menu"></span>
              用车订单
            </div>
          </div>
          <div
            class="
              LaunchTrainingCourse__info-card__item-content
              LaunchTrainingCourse__info-card__travel-orders__car__content
              table__wrapper
            "
          >
            <gc-table
              :list="carOrderList"
              :tableList="carOrderTable"
              :stripe="false"
            ></gc-table>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 查看所有影像dialog -->
    <gc-model
      class="LaunchTrainingCourse__scan-image"
      title="影像"
      :visible="scanImageVisible"
      width="800px"
      :isShowFooter="false"
      @close="scanImageVisible = false"
    >
      <div class="LaunchTrainingCourse__scan-image__title">
        <i class="LaunchTrainingCourse__scan-image__title__enlarge"></i>
        <i class="LaunchTrainingCourse__scan-image__title__narrow"></i>
        <i class="LaunchTrainingCourse__scan-image__title__refresh"></i>
        <i class="LaunchTrainingCourse__scan-image__title__prev"></i>
        <i class="LaunchTrainingCourse__scan-image__title__next"></i>
        <i class="LaunchTrainingCourse__scan-image__title__level-flip"></i>
        <i class="LaunchTrainingCourse__scan-image__title__vertical-flip"></i>
      </div>
      <div class="LaunchTrainingCourse__scan-image__content">
        <video class="LaunchTrainingCourse__scan-image__content__video"></video>
      </div>
    </gc-model>

    <!-- 关联专票 dialog -->
    <gc-model
      class="LaunchTrainingCourse__common-dialog"
      title="关联专票"
      :visible="relationTicketVisible"
      width="1000px"
      @close="relationTicketVisible = false"
      @cancel="relationTicketVisible = false"
      @comfirm="relationTicketVisible = false"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <gc-input
            label="发票号码"
            class="left relation-ticket-form-input"
            v-model="relationTicketForm.invoiceNo"
            disabled
          ></gc-input>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button
            class="
              LaunchTrainingCourse__common-dialog__title__right__query
              button-60
            "
            >查询</el-button
          >
          <el-button
            class="
              LaunchTrainingCourse__common-dialog__title__right__reset
              button-60-blue-plain
            "
            >重置</el-button
          >
          <el-button
            class="
              LaunchTrainingCourse__common-dialog__title__right__relation
              button-60-blue-primary
            "
            >关联发票</el-button
          >
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content">
        <gc-table
          class="
            LaunchTrainingCourse__content
            last-tr-no-border
            LaunchTrainingCourse__common-dialog__content__table
            general__table
          "
          :list="relationTicketList"
          :tableList="relationTicketTable"
          :stripe="false"
          ref="relationTicketTableRef"
        ></gc-table>
        <gc-pagination
          :total="relationTicketForm.total"
          layout="prev, pager, next, slot, sizes"
          prev-text=""
          next-text=""
          :totalisShow="false"
          :page-sizes="[2, 4, 6]"
          :page-size="relationTicketForm.pageSize"
          :current-page="relationTicketForm.currPage"
          @sizeChange="relationTicketSizeChange"
          @currentChange="relationTicketPageChange"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </div>
      <div
        class="
          LaunchTrainingCourse__common-dialog__vice-title
          LaunchTrainingCourse__title
        "
      >
        <div class="LaunchTrainingCourse__title__left">
          <span class="LaunchTrainingCourse__title__left__menu"> </span>
          已关联
        </div>
        <div
          class="icons LaunchTrainingCourse__common-dialog__vice-title__right"
        >
          <el-button class="button-60-blue-primary">取消关联</el-button>
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__vice-content">
        <gc-table
          :list="relationTicketList"
          :tableList="relationTicketViceTable"
          class="
            LaunchTrainingCourse__content
            last-tr-no-border
            LaunchTrainingCourse__common-dialog__vice-content__table
            general__table
          "
          :stripe="false"
          ref="relationTicketViceTableRef"
        ></gc-table>
      </div>
    </gc-model>

    <!-- 关联差旅订单 -->
    <gc-model
      class="LaunchTrainingCourse__common-dialog"
      title="关联差旅订单"
      :visible="relationTravelOrderVisible"
      width="1000px"
      @close="relationTravelOrderVisible = false"
      @comfirm="relationTravelOrderVisible = false"
      @cancel="relationTravelOrderVisible = false"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item
              class="LaunchTrainingCourse__common-dialog__title__left__first"
              ><gc-input class="left" label="差旅订单号"></gc-input
            ></el-form-item>
            <el-form-item
              ><gc-input
                class="left"
                label="预定人"
                placeholder="请输入UM号"
              ></gc-input
            ></el-form-item>
          </el-form>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button class="button-60">查询</el-button>
          <el-button class="button-60-blue-plain">重置</el-button>
          <el-button class="button-60-blue-primary">关联订单</el-button>
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content">
        <gc-table
          class="general__table table-radio"
          ref="relationTravelOrderTableRef"
          :list="relationTravelOrderList"
          :tableList="relationTravelOrderTable"
          :stripe="false"
        >
          <template>
            <el-table-column label="起始时间" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.startTime.split(' ')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.endTime.split(' ')[0] }}
              </template>
            </el-table-column>
            <el-table-column label="是否大发票" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.isBig === 'Y' ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="大发票类型" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.bigType === '0' ? '普票' : '专票' }}
              </template>
            </el-table-column>
          </template>
        </gc-table>
      </div>
      <div
        class="
          LaunchTrainingCourse__common-dialog__vice-title
          LaunchTrainingCourse__title
        "
      >
        <div
          class="
            LaunchTrainingCourse__common-dialog__vice-title__left
            LaunchTrainingCourse__title__left
          "
        >
          <span class="LaunchTrainingCourse__title__left__menu"></span>
          已关联
        </div>
        <div class="LaunchTrainingCourse__common-dialog__vice-title__right">
          <el-button class="button-60-blue-primary">取消关联</el-button>
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__vice-content tabpane">
        <gc-table
          class="
            general__table
            LaunchTrainingCourse__common-dialog__vice-content__table
          "
          ref="relationTravelOrderViceTableRef"
          :list="relationTravelOrderList"
          :tableList="relationTravelOrderViceTable"
          :stripe="false"
        >
          <template>
            <el-table-column label="起始时间" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.startTime.split(' ')[0] }}
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.endTime.split(' ')[0] }}
              </template>
            </el-table-column>
            <el-table-column label="是否大发票" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.isBig === 'Y' ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="大发票类型" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.bigType === '0' ? '普票' : '专票' }}
              </template>
            </el-table-column>
          </template>
        </gc-table>
      </div>
    </gc-model>

    <!-- 费用分摊 dialog -->
    <gc-model
      title="费用分摊"
      :visible.sync="apportionConstVisible"
      width="1000px"
      comfirmText="关闭"
    >
      <div>
        <gc-table
          class="general__table"
          no-list
          ref="apportionConstRef"
          :tableList="apportionConstList"
        >
          <el-table-column
            label="管理中心"
            prop="manageCenterDesc"
          ></el-table-column>
          <el-table-column label="成本中心">
            <template slot-scope="scope">
              <el-input
                readonly
                class="page-input"
                v-model="scope.row.costCenterName"
              >
                <i slot="suffix" class="page-input__search"></i>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="含税金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.totalPriceTax"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="不含税金额">
            <template slot-scope="scope">
              <el-input v-model="scope.row.excludingTaxAmt"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="税额">
            <template slot-scope="scope">
              {{ myFloat(scope.row.totalPriceTax - scope.row.excludingTaxAmt) }}
            </template>
          </el-table-column>
        </gc-table>
      </div>
    </gc-model>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import { handleUdmpHref, myFloat } from '../../util/utils'
import { CopyObj, formatDate, daysApart, myRound } from '../../plugins/until'
export default {
  name: 'TrainingCourseOrderInfo',
  data() {
    return {
      //识别动作 [add, edit]
      action: this.$route.params.action,
      // 培训班信息
      classesInfo: { row: {} },
      // 基本信息 classesInfo
      // el-tabs 的索引默认只想报账明细
      activeName: 'reimbursedInfo',
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
          width: '160',
          label: '费用小类'
        },
        {
          prop: 'budgetAmt',
          width: '90',
          label: '立项金额',
          value: '立项金额'
        },
        {
          prop: 'payedAmt',
          width: '90',
          label: '已付款金额',
          value: '已付款金额'
        },
        {
          prop: 'occupyAmt',
          width: '90',
          label: '已占用金额',
          value: '已占用金额'
        }
      ],
      //  报账明细 费用信息 table 数据数组
      costInfoTable: [],
      //  报账明细 收款人信息 table 数据数组
      payeeInfoTable: [],
      //  附件信息 table 字段数组
      enclosureList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          width: '60',
          type: 'index',
          value: '序号'
        }
      ],
      //  附件信息 table 数据数组
      enclosureTable: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      // 挂账信息 table数据数组
      accountsInfoTable: [],
      // 核销信息 table数据数组
      writeOffInfoTable: [],
      // 差旅信息 table数据数组
      travelInfoTable: [],
      // 酒店订单 字段数组
      hotelOrderList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          type: 'index',
          value: '序号',
          width: '64'
        },
        {
          prop: 'tripName',
          label: '入住人',
          value: '入住人'
        },
        {
          prop: 'amt',
          label: '金额',
          value: '金额'
        },
        // {
        //     prop: "inCity",
        //     label: "城市",
        //     value: "城市"
        // },
        {
          prop: 'startTime',
          label: '入住时间',
          value: '入住时间'
        },
        {
          prop: 'endTime',
          label: '离店时间',
          value: '离店时间'
        },
        {
          prop: 'caikuOrderId',
          label: '订单号',
          value: '订单号'
        }
      ],
      // 酒店订单 数据数组
      hotelOrderTable: [],
      // 机票订单 字段数组
      airfareOrderList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          type: 'index',
          value: '序号',
          width: '79'
        },
        {
          prop: 'tripName',
          label: '乘车人',
          value: '乘车人',
          width: '91'
        },
        {
          prop: 'amt',
          label: '金额',
          value: '金额',
          width: '79'
        },
        // {
        //     prop: "boardCity",
        //     label: "出发城市",
        //     value: "出发城市",
        //     width: "103"
        // },
        // {
        //     prop: "offCity",
        //     label: "到达城市",
        //     value: "到达城市",
        //     width: "103"
        // },
        {
          prop: 'startTime',
          label: '起飞时间',
          value: '起飞时间',
          width: '103'
        },
        {
          prop: 'cabinLevel',
          label: '仓等',
          value: '仓等',
          width: '79'
        },
        {
          prop: 'caikuOrderId',
          label: '订单号',
          value: '订单号',
          width: '91'
        }
      ],
      // 机票订单 数据数组
      airfareOrderTable: [],
      // 火车订单 字段数组
      trainOrderList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          type: 'index',
          value: '序号',
          width: '79'
        },
        {
          prop: 'tripName',
          label: '乘客姓名',
          value: '乘客姓名',
          width: '103'
        },
        {
          prop: 'amt',
          label: '金额',
          value: '金额',
          width: '79'
        },
        // {
        //     prop: "name",
        //     label: "出发站名",
        //     value: "出发站名",
        //     width: "103"
        // },
        // {
        //     prop: "name",
        //     label: "到达站名",
        //     value: "到达站名",
        //     width: "103"
        // },
        {
          prop: 'startTime',
          label: '开始出发时间',
          value: '开始出发时间',
          width: '127'
        },
        {
          prop: 'caikuOrderId',
          label: '订单号',
          value: '订单号',
          width: '91'
        }
      ],
      // 火车订单 数据数组
      trainOrderTable: [],
      // 用车订单 字段数组
      carOrderList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          type: 'index',
          value: '序号',
          width: '64'
        },
        {
          prop: 'tripName',
          label: '用车人姓名',
          value: '用车人姓名',
          width: '115'
        },
        {
          prop: 'amt',
          label: '金额',
          value: '金额',
          width: '79'
        },
        // {
        //     prop: "name",
        //     label: "起始地",
        //     value: "起始地",
        //     width: "91"
        // },
        // {
        //     prop: "name",
        //     label: "目的地",
        //     value: "目的地",
        //     width: "91"
        // },
        {
          prop: 'startTime',
          label: '开始用车时间',
          value: '开始用车时间',
          width: '127'
        },
        {
          prop: 'caikuOrderId',
          label: '订单号',
          value: '订单号',
          width: '91'
        }
      ],
      // 用车订单 数据数组
      carOrderTable: [],
      // 审批记录 table 字段数组
      approvalRecordList: [
        {
          label: '序号',
          width: '65',
          type: 'index',
          value: '序号'
        },
        {
          prop: 'approvedLink',
          label: '审批环节',
          value: '审批环节'
        },
        {
          prop: 'approvedName',
          label: '审批人',
          value: '审批人'
        },
        {
          prop: 'approvedTime',
          label: '审批时间',
          value: '审批时间'
        },
        {
          prop: 'approvedOpinion',
          label: '审批意见',
          value: '审批意见'
        }
      ],
      // 审批记录 table 数据数组
      approvalRecordTable: [],
      // 审批记录 table 字段数组
      consultationRecordList: [
        {
          label: '序号',
          width: '60',
          type: 'index',
          value: '序号'
        },
        {
          prop: 'date',
          label: '办理人',
          value: '办理人'
        },
        {
          prop: 'date',
          label: '咨询人',
          value: '咨询人'
        },
        {
          prop: 'name',
          label: '咨询意见',
          value: '咨询意见',
          width: '300'
        },
        {
          prop: 'name',
          label: '咨询时间',
          value: '咨询时间',
          width: '160'
        },
        {
          prop: 'name',
          label: '附件',
          value: '附件'
        },
        {
          prop: 'name',
          label: '撤回人',
          value: '撤回人'
        },
        {
          prop: 'name',
          label: '撤回时间',
          value: '撤回时间',
          width: '160'
        }
      ],
      // 审批记录 table 数据数组
      consultationRecordTable: [],
      // 报销学员全选状态
      studentAllSekectState: false,
      // 本次报销费用 table字段
      currentReimbursementMoneyList: [
        {
          prop: 'expenseTypeDescMax',
          label: '费用类别',
          value: '费用类别',
          width: '174'
        }
      ],
      daysApart,
      // 挂账单查询 dialog form表单
      accountSearchForm: {
        cancelBillType: '',
        supplierCode: '',
        vendorSiteId: '',
        expenseId: '',
        currPage: 1,
        pageSize: 2
      },
      // 查看所有影像 dialog 状态
      scanImageVisible: false,
      // 关联专票 dialog 状态
      relationTicketVisible: false,
      relationTicketForm: {},
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
      // 关联专票 副tabel数据数组
      relationTicketViceTable: [],
      // 关联差旅订单 table 字段数组
      relationTravelOrderList: [
        {
          label: '序号',
          width: '64',
          type: 'index',
          value: '序号'
        },
        {
          prop: 'caikuOrderType',
          label: '差旅订单类型',
          value: '差旅订单类型',
          width: '100'
        },
        {
          prop: 'caikuOrderId',
          label: '差旅订单号',
          value: '差旅订单号',
          width: '150'
        },
        {
          prop: 'amt',
          label: '金额',
          value: '金额',
          width: '100'
        },
        {
          prop: 'orderName',
          label: '预定人',
          value: '预定人',
          width: '100'
        },
        {
          prop: 'tripName',
          label: '出差人',
          value: '出差人',
          width: '100'
        }
      ],
      // 关联差旅订单 table 数据数组
      relationTravelOrderTable: [],
      // 关联差旅订单 副table 数据数组
      relationTravelOrderViceTable: [],
      // 关联差旅订单 dialog状态
      relationTravelOrderVisible: false,
      // 四舍五入
      myRound,
      // 差旅订单类型 和 差旅订单数组映射
      travelOrderMaping: {
        酒店: 'hotelOrderTable',
        机票: 'airfareOrderTable',
        火车: 'trainOrderTable',
        用车: 'carOrderTable'
      },
      handleUdmpHref,
      // 费用分摊dialog状态
      apportionConstVisible: false,
      // 分摊dialog的表格数据
      apportionConstList: [],
      myFloat
    }
  },
  methods: {
    // 跳转到打印界面
    stamp() {
      const { empno: userId, umId: umcode } = this.$store.state.userInfo
      const expenseId = this.classesInfo.reimIdFas
      let url
      if (process.env.VUE_APP_API_TYPE === 'prd') {
        url = `http://fast-bank.pab.com.cn/printReimbursement?`
      } else {
        url = `http://29.12.43.205:7001/printReimbursement?`
      }
      url += `userid=${userId}&umcode=${umcode}&expenseId=${expenseId}&menuid=2257&resource=PX`
      window.open(url)
    },
    // 关联专票dislog的显示
    handlerelationTicketVisible(currentCostInfo, index) {
      this.relationTicketForm.belongOrganCode = this.classesInfo.orgSegment
      this.relationTicketViceTable =
        currentCostInfo.relationTicketViceTable ||
        (currentCostInfo.relationTicketViceTable = [])
      this.relationTicketForm.index = index
      this.relationTicketVisible = true
    },
    // 关联专票dialog 分页的sizechange事件
    relationTicketSizeChange(size) {
      this.relationTicketForm.pageSize = size.pageSize
      this.relationTicketQuery()
    },
    // 关联专票dialog 分页的pagechange事件
    relationTicketPageChange(page) {
      this.relationTicketForm.currPage = page.pageNum
      this.relationTicketQuery()
    },
    // 打开关联差旅订单dialog
    openRelationTravelOrderDialog(currentCostInfo, index) {
      const arr = currentCostInfo.relationTravelOrderViceTable
      this.relationTravelOrderViceTable = arr ? CopyObj(arr) : []
      this.relationTravelOrderVisible = true
    },
    // 处理差旅信息人员名称
    handleName(tripPersons) {
      return tripPersons.map((v) => v.tripPersonName).join(',')
    },
    // 将查询得到的订单数据，转化符合本页面的数据格式
    serveDateToLocalData(data) {
      if (data.attaches) {
        this.enclosureTable = data.attaches
      }
      if (data.cancels) {
        const dict = {
          1: '预付款',
          2: '挂账'
        }
        data.cancels.forEach((v) => {
          v.cancelBillType = v.cancelTypeDesc
        })
        this.writeOffInfoTable = data.cancels
      }

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
        caikuOrderList.forEach((v) => {
          v.startTime = v.startTime.split(' ')[0]
          this[this.travelOrderMaping[v.caikuOrderType]].push(v)
        })
        this.costInfoTable = data.details
      }
      if (data.primary) {
        this.classesInfo = data.primary
      }
      if (data.contracts) {
        this.contractCodeEditTable = data.contracts
        this.classesInfo.contractCode = this.contractCodeEditTable
          .map((v) => v.contractCode)
          .join(';')
        this.classesInfo.contractName = this.contractCodeEditTable
          .map((v) => v.contractName)
          .join(';')
      }
      if (data.suppliers) {
        data.suppliers.forEach((v, i) => {
          v.bankPaySummary = v.reimSupplier.bankPaySummary
        })
        data.primary.payeePlaceLayerNo = data.primary.placeLayerId
        this.payeeInfoTable = data.suppliers
      }
      if (data.suspends) {
        this.accountsInfoTable = data.suspends
      }
      if (data.trips) {
        this.travelInfoTable = data.trips
      }
      if (data.approved) {
        this.approvalRecordTable = data.approved
      }
    },
    // 费用信息 立项金额, 已付款金额, 已占用金额, 合计公共函数
    costMoneyTotalCommon(property) {
      let sum = 0
      const newCostInfoTable = []
      this.costInfoTable.forEach((v) => {
        if (
          !newCostInfoTable
            .map((val) => val['feeMinCategoryDesc'])
            .includes(v['feeMinCategoryDesc'])
        ) {
          sum += (Number.parseFloat(v[property]) || 0) * 100
        }
      })
      sum = sum / 100
      return this.roundTwo(sum)
    },
    // 费用信息 付款金额 公共函数
    costAmtTotalCommon(bool) {
      let sum = 0
      this.costInfoTable.forEach((v) => {
        //判断专票还是普票
        let flag = v.tax == 0 && (v.invoices || []).length
        if (bool) {
          flag = !flag
        }
        if (flag) {
          sum += (Number.parseFloat(v.amt) || 0) * 100
        }
      })
      sum = sum / 100
      return this.judgeFloat(sum)
        ? (Math.round(sum * 100) / 100).toFixed(2)
        : sum.toFixed(2)
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
    // 改变 合计金额 的左边距 使之适配大屏幕
    adaptationWidth(arr1, ref, arr2, classNameList, width) {
      let addWidths = 0
      let increment = this.$refs[ref].$el.clientWidth - (width || 1591)
      if (increment < 0) {
        $(this.$refs[ref].$el)
          .closest('.el-tabs__content > .el-tab-pane')
          .css({ display: 'block' })
        increment = this.$refs[ref].$el.clientWidth - (width || 1591)
        $(this.$refs[ref].$el)
          .closest('.el-tabs__content > .el-tab-pane')
          .css({ display: 'none' })
      }
      const totalMinWidth = arr1.reduce((prev, next) => prev + next, 0)
      const flexWidthPerPixel = increment / totalMinWidth
      arr1.forEach((columnWidth, i) => {
        if (i === 0) {
          return
        }
        addWidths += Math.floor(columnWidth * flexWidthPerPixel)
      })
      const firstWidth = arr1[0] + increment - addWidths
      const marginLeft =
        firstWidth +
        arr2.reduce(
          (prev, next) => prev + next + Math.floor(next * flexWidthPerPixel),
          0
        ) +
        'px'
      classNameList.forEach((className) => {
        document.querySelector(className).style.marginLeft = marginLeft
      })
    },
    // 打开费用分摊
    openApportionConst(row) {
      if (row.splitInfo?.length) {
        this.apportionConstList = row.splitInfo
      }
      this.apportionConstVisible = true
    },
    // 费用信息添加合并行
    costAddSummary() {
      if (this.costInfoTable.find((v) => v.type)) return
      this.costInfoTable.push({
        costBudgetAmtMoneyTotal: this.costBudgetAmtMoneyTotal,
        costPayedAmtTotal: this.costPayedAmtTotal,
        costOccupyAmtTotal: this.costOccupyAmtTotal,
        costCanReimbursementTotal: this.costCanReimbursementTotal,
        costBudgetAmtTotal: this.costBudgetAmtTotal,
        type: 'total'
      })
    },
    costCellClassName({ row, column, rowIndex, columnIndex }) {
      if (row.type && columnIndex === 0) {
        $('.merge-total__span').remove()
        $('.merge-total').children().show()
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
    }
  },
  mounted() {
    const params = this.$route.params

    if (params.action === 'check') {
      params.primary.row = params.row
      this.serveDateToLocalData(params)
      this.costAddSummary()
    }

    this.adaptationWidth(
      [205, 100, 103, 103, 160, 160, 160, 175, 205, 106],
      'payeeInfoTableRef',
      [100, 103, 103, 160, 160, 160],
      [
        '.LaunchTrainingCourse__info-card__reimbursement__payee__content__total__price'
      ]
    )
    this.adaptationWidth(
      [160, 304, 146, 180, 180, 180, 180, 191, 265],
      'accountsInfoTableRef',
      [304],
      [
        '.LaunchTrainingCourse__info-card__reimbursement__accounts__content__total__price'
      ],
      1888
    )
    this.adaptationWidth(
      [232, 225, 113, 138, 225, 153, 139, 126, 138],
      'writeOffInfoTableRef',
      [225, 113, 138, 225, 153, 139],
      [
        '.LaunchTrainingCourse__info-card__reimbursement__write-off__content__total__price'
      ]
    )
    this.adaptationWidth(
      [299, 117, 117, 146, 205, 205, 117, 271],
      'travelInfoTableRef',
      [],
      [
        '.LaunchTrainingCourse__info-card__reimbursement__travel__content__total__price'
      ]
    )
    this.$nextTick(() => {
      const width =
        this.$refs.TrainingCourseOrderInfoEnclosureTableRef.$el.querySelector(
          '.el-table__header-wrapper'
        ).clientWidth + 'px'
      this.$refs.TrainingCourseOrderInfoEnclosureTableRef.$el.querySelector(
        '.el-table__header'
      ).style.width = width
      this.$refs.TrainingCourseOrderInfoEnclosureTableRef.$el.querySelector(
        '.el-table__body'
      ).style.width = width
    })
    this.isMounted = true
  },
  activated() {
    if (this.isMounted) {
      this.isMounted = false
      return
    }
    const params = this.$route.params

    if (params.action === 'check') {
      params.primary.row = params.row
      this.serveDateToLocalData(params)
      this.costAddSummary()
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
    },

    // 收款人信息 支付金额
    payeePaymentMoney() {
      let sum = 0
      this.payeeInfoTable.forEach((v) => {
        sum += Number.parseFloat(v.payAmt) || 0
      })
      return sum
    },
    // 挂账信息金额
    accountsTotalPrice() {
      let sum = 0
      this.accountsInfoTable.forEach((v) => {
        sum += Number.parseFloat(v.amt) || 0
      })
      return sum
    },
    // 核销信息 本次核销金额 总数
    writeOffTotalPrice() {
      let sum = 0
      this.writeOffInfoTable.forEach((v) => {
        sum += Number.parseFloat(v.thisTimeCancelAmt) || 0
      })
      return sum
    },
    // 出差信息 人数总计
    travelInfoNumTotal() {
      return this.travelInfoTable.length
    }
  }
}
</script>

<style></style>