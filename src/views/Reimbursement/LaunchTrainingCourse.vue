<template>
  <div class="LaunchTrainingCourse">
    <!-- 单据编号 卡片 -->
    <el-card class="LaunchTrainingCourse__number-card">
      <div class="LaunchTrainingCourse__number-card__left">
        <span class="LaunchTrainingCourse__number-card__left__title"
          >单据编号</span
        >
        <span></span>
      </div>
      <div class="LaunchTrainingCourse__number-card__right">
        <el-button @click="$router.back()">返回</el-button>
        <el-button
          v-if="!saveDisabled || !isDisabled"
          class="LaunchTrainingCourse__number-card__right__query"
          @click="handleSave"
          >保存</el-button
        >
        <el-button
          v-else
          class="LaunchTrainingCourse__number-card__right__query-diasbled"
          type="info"
          plain
          disabled
          >保存</el-button
        >
        <el-button type="primary" @click="handleSubmit" :disabled="isDisabled"
          >提交</el-button
        >
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
              readonly
              label="成本中心"
              class="page-input"
              v-model="classesInfo.costCenterName"
            >
              <i
                slot="suffix"
                class="page-input__search"
                @click="handleCostCenterVisible"
              ></i>
            </gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input
              readonly
              label="立项编号"
              class="page-input"
              v-model="classesInfo.row.classId"
            >
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
                        <li
                          class="
                            edit-wicket-popper__wrapper__content__items__item
                          "
                        >
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__left
                            "
                          >
                            立项编号
                          </div>
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__right
                            "
                          >
                            {{ classesInfo.row.classId }}
                          </div>
                        </li>
                        <li
                          class="
                            edit-wicket-popper__wrapper__content__items__item
                          "
                        >
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__left
                            "
                          >
                            立项名称
                          </div>
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__right
                            "
                          >
                            {{ classesInfo.row.className }}
                          </div>
                        </li>
                        <li
                          class="
                            edit-wicket-popper__wrapper__content__items__item
                          "
                        >
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__left
                            "
                          >
                            金额
                          </div>
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__right
                            "
                          >
                            {{ classesInfo.budgetTotalAmt }}
                          </div>
                        </li>
                        <li
                          class="
                            edit-wicket-popper__wrapper__content__items__item
                          "
                        >
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__left
                            "
                          >
                            已使用金额
                          </div>
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__right
                            "
                          >
                            {{
                              myRound(
                                parseFloat(classesInfo.occupyTotalAmt) +
                                  parseFloat(classesInfo.payedTotalAmt),
                                2
                              )
                            }}
                          </div>
                        </li>
                        <li
                          class="
                            edit-wicket-popper__wrapper__content__items__item
                          "
                        >
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__left
                            "
                          >
                            本次使用金额
                          </div>
                          <div
                            class="
                              edit-wicket-popper__wrapper__content__items__item__right
                            "
                          >
                            <span v-show="!baseInfoThisAmountIsEdit">
                              {{
                                costBudgetAmtTotal -
                                accountsTotalPrice -
                                writeOffTotalPrice +
                                ''
                              }}
                            </span>
                            <!-- <el-input
                                                            class="mr20"
                                                            ref="baseInfoThisAmountRef"
                                                            v-show="
                                                                baseInfoThisAmountIsEdit
                                                            "
                                                            @blur="
                                                                baseInfoThisAmountIsEdit = false
                                                            "
                                                            v-model.number="
                                                                currentUsedMoney
                                                            "
                                                        ></el-input> -->

                            <!-- <i
                                                            @click="
                                                                baseInfoThisAmountIsEdit = true;
                                                                $nextTick(
                                                                    () => {
                                                                        $refs.baseInfoThisAmountRef.focus();
                                                                    }
                                                                );
                                                            "
                                                            v-show="
                                                                !baseInfoThisAmountIsEdit
                                                            "
                                                            class="edit-wicket-popper__wrapper__content__items__item__right__edit-icon"
                                                        ></i> -->
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <i slot="reference" class="page-input__edit"></i>
                </el-popover>
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
          <el-form-item
            style="width: calc((100% - 1px) / 3 * 2)"
            class="
              LaunchTrainingCourse__info-card__base-info__contract-code__item
            "
          >
            <gc-input
              readonly
              label="合同编号"
              class="
                page-input
                LaunchTrainingCourse__info-card__base-info__contract-code
              "
              v-model="classesInfo.contractCode"
            >
              <template slot="suffix">
                <i
                  class="page-input__search"
                  @click="handleContractSearchVisible"
                ></i>
                <i class="page-input__line"></i>
                <el-popover
                  placement="bottom-end"
                  :visible-arrow="false"
                  min-width="902"
                  trigger="click"
                  popper-class="edit-wicket-popper-transverse"
                >
                  <div class="edit-wicket-popper-transverse">
                    <gc-table
                      class="edit-wicket-popper-transverse__content"
                      :list="contractCodeEditList"
                      :tableList="contractCodeEditTable"
                      :stripe="false"
                    >
                      <template>
                        <el-table-column label="本次付款金额" min-width="102">
                          <template slot-scope="scope">
                            <gc-input
                              v-model.trim="scope.row.thisTimePayAmt"
                            ></gc-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="60">
                          <template slot-scope="scope">
                            <span
                              class="active"
                              @click="
                                handleContractCodeEditTableDel(scope.$index)
                              "
                              >删除</span
                            >
                          </template>
                        </el-table-column>
                      </template>
                    </gc-table>
                  </div>

                  <i slot="reference" class="page-input__edit"></i>
                </el-popover>
              </template>
            </gc-input>
          </el-form-item>
          <el-form-item
            class="LaunchTrainingCourse__info-card__base-info__right-item"
          >
            <gc-input
              label="合同名称"
              disabled
              v-model="classesInfo.contractName"
            ></gc-input>
          </el-form-item>
          <el-form-item style="width: 0">
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
            <gc-input label="单据状态" disabled placeholder=""></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input label="提交日期" disabled placeholder=""> </gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input label="审批状态" disabled placeholder=""></gc-input>
          </el-form-item>
          <el-form-item label="说明" class="textarea">
            <el-input
              type="textarea"
              maxlength="160"
              show-word-limit
              resize="none"
              placeholder="请输入"
              v-model="classesInfo.remark"
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
                <div class="icons">
                  <span
                    class="icons__add"
                    @click="reimbursementInfoVisible = true"
                  >
                    <i class="icons__add__icon"></i>
                    新增
                  </span>
                  <span class="icons__del" @click="handleDelReimbursementInfo">
                    <i class="icons__del__icon"></i>
                    删除
                  </span>
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
                  @selection-change="costInfoSelectionChange"
                >
                  <template>
                    <el-table-column label="可报销金额" min-width="100">
                      <template slot-scope="scope">
                        <span v-if="scope.row.type">
                          {{ scope.row.costCanReimbursementTotal }}
                        </span>
                        <span v-else>
                          {{
                            myRound(
                              scope.row.budgetAmt -
                                (scope.row.payedAmt || 0) -
                                (scope.row.occupyAmt || 0),
                              2,
                              true
                            )
                          }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column label="本次报销金额" min-width="186">
                      <template slot-scope="scope">
                        <span v-if="scope.row.type">
                          {{ scope.row.costBudgetAmtTotal }}
                        </span>
                        <gc-input
                          v-else
                          @blur="handleCostInfoTableAmtBlur(scope.row)"
                          v-model="scope.row.amt"
                        ></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="预算科目" min-width="180">
                      <template slot-scope="scope">
                        <el-input
                          class="input-suffix-type"
                          readonly
                          v-if="estimateHead(scope.row.accountingSubjectCd)"
                          v-model="scope.row.budgetProjectName"
                        >
                          <i
                            slot="suffix"
                            class="page-input__search"
                            @click="
                              subjectRow = scope.row
                              subjectVisible = true
                            "
                          ></i>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="支付日期" min-width="140">
                      <template slot-scope="scope">
                        <el-date-picker
                          v-if="estimateHead(scope.row.accountingSubjectCd)"
                          class="w-100"
                          v-model="scope.row.payDate"
                          type="date"
                          placeholder="选择日期"
                          :clearable="false"
                          value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column label="项目" min-width="180">
                      <template slot-scope="scope" v-if="!scope.row.type">
                        <el-input
                          class="input-suffix-type"
                          readonly
                          v-model="scope.row.projectName"
                        >
                          <i
                            slot="suffix"
                            class="page-input__search"
                            @click="openProductDialog('item', scope.row)"
                          ></i>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="产品" min-width="180">
                      <template slot-scope="scope" v-if="!scope.row.type">
                        <el-input
                          class="input-suffix-type"
                          readonly
                          v-model="scope.row.productName"
                        >
                          <i
                            slot="suffix"
                            class="page-input__search"
                            @click="openProductDialog('product', scope.row)"
                          ></i>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="订单号" min-width="180">
                      <template slot-scope="scope" v-if="!scope.row.type">
                        <el-input
                          class="input-suffix-type"
                          readonly
                          v-model="scope.row.kuOrderName"
                        >
                          <i
                            slot="suffix"
                            class="page-input__search"
                            @click="openProductDialog('orderNumber', scope.row)"
                          ></i>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="报销事项" min-width="198">
                      <template slot-scope="scope">
                        <gc-input
                          v-if="!scope.row.type"
                          v-model="scope.row.remark"
                        ></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="是否可抵扣" min-width="102">
                      <template slot-scope="scope">
                        <span v-if="!scope.row.type">
                          {{ scope.row.deductionFlag == 1 ? '是' : '否' }}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      min-width="120"
                      fixed="right"
                      class-name="LaunchTrainingCourse__info-card__reimbursement__cost__content__const-operation"
                    >
                      <template slot-scope="scope">
                        <div class="df" v-if="!scope.row.type">
                          <span
                            class="mr20"
                            @click="
                              handlerelationTicketVisible(
                                scope.row,
                                scope.$index
                              )
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
                              v-show="scope.row.relationTicketViceTable.length"
                              >{{ scope.row.relationTicketViceTable.length }}</i
                            ></span
                          >
                          <span
                            class="mr20"
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
                          <span class="active" @click="copyCostInfo(scope.row)">
                            <el-tooltip
                              content="复制"
                              popper-class="icon-popper"
                            >
                              <i class="operation__copy"></i>
                            </el-tooltip>
                          </span>
                          <!-- <span
                            class="active"
                            @click="openApportionConst(scope.row)"
                          >
                            <el-tooltip
                              content="费用分摊"
                              popper-class="icon-popper"
                            >
                              <i class="operation__apportionConst"></i>
                            </el-tooltip>
                          </span> -->
                        </div>
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
                <div class="icons">
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
                        <gc-input v-model="scope.row.supplierName"
                          ><i
                            slot="suffix"
                            class="page-input__search"
                            @click="
                              supplierSearchForm.index = scope.$index
                              supplierSearchVisible = true
                            "
                          ></i
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
                        <gc-input v-model.trim="scope.row.payAmt"></gc-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="银行汇款用途" min-width="205">
                      <template slot-scope="scope">
                        <gc-input v-model="scope.row.bankPaySummary"></gc-input>
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
              <div class="icons">
                <span class="icons__add" @click="addAccountsInfo">
                  <i class="icons__add__icon"></i>
                  新增
                </span>
                <span class="icons__del" @click="delAccountsInfo">
                  <i class="icons__del__icon"></i>
                  删除
                </span>
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
                    prop="suspendMaxCategoryDesc"
                  >
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        class="page-input"
                        v-model="scope.row.suspendMaxCategoryDesc"
                      >
                        <i
                          slot="suffix"
                          class="page-input__search"
                          @click="
                            accountSizeForm.index = scope.$index
                            accountSizeQuery()
                            accountSizeVisible = true
                          "
                        ></i>
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
                      <gc-input
                        v-model="scope.row.amt"
                        @blur="transformFloat(scope.row, 'amt')"
                      >
                      </gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="预算科目" min-width="180">
                    <template slot-scope="scope">
                      <el-input
                        class="input-suffix-type"
                        readonly
                        v-if="estimateHead(scope.row.accountingSubjectCd)"
                        v-model="scope.row.subjectProjectDesc"
                      >
                        <i
                          slot="suffix"
                          class="page-input__search"
                          @click="
                            subjectRow = scope.row
                            subjectVisible = true
                          "
                        ></i>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="支付日期" min-width="190">
                    <template slot-scope="scope">
                      <el-date-picker
                        class="LaunchTrainingCourse__date"
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
                      <el-input
                        class="input-suffix-type"
                        readonly
                        v-model="scope.row.channelOrProjectDesc"
                      >
                        <i
                          slot="suffix"
                          class="page-input__search"
                          @click="openProductDialog('item', scope.row)"
                        ></i>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="产品" min-width="180">
                    <template slot-scope="scope">
                      <el-input
                        class="input-suffix-type"
                        readonly
                        v-model="scope.row.productDesc"
                      >
                        <i
                          slot="suffix"
                          class="page-input__search"
                          @click="openProductDialog('product', scope.row)"
                        ></i>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="订单号" min-width="180">
                    <template slot-scope="scope">
                      <el-input
                        class="input-suffix-type"
                        readonly
                        v-model="scope.row.orderNoDesc"
                      >
                        <i
                          slot="suffix"
                          class="page-input__search"
                          @click="openProductDialog('orderNumber', scope.row)"
                        ></i>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="挂账事项" min-width="264">
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        v-model="scope.row.suspendMatters"
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
              <div class="icons">
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
                    width="54"
                  ></el-table-column>
                  <el-table-column label="核销类型" min-width="205">
                    <template slot-scope="scope">
                      <gc-select
                        placeholder="请选择"
                        :options="[
                          {
                            label: '预付款',
                            value: '1'
                          },
                          {
                            label: '挂账',
                            value: '2'
                          }
                        ]"
                        v-model="scope.row.cancelType"
                      ></gc-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="挂账单号" min-width="205">
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        class="page-input"
                        v-model="scope.row.advancePayExpenseNo"
                      >
                        <i
                          slot="suffix"
                          class="page-input__search"
                          @click="
                            handleAccountSearchDialogOpen(
                              scope.$index,
                              scope.row
                            )
                          "
                        ></i>
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
                      <gc-input placeholder="" v-model="scope.row.desc">
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
                        v-model.trim="scope.row.thisTimeCancelAmt"
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
              <div class="icons">
                <span class="icons__upload" @click="travelInfoImport = true">
                  <i class="icons__upload__icon"></i>
                  批量导入
                </span>
                <span
                  class="icons__add"
                  @click="travelInfoSelectStaffVisible = true"
                >
                  <i class="icons__add__icon"></i>
                  新增
                </span>
                <span class="icons__del" @click="delTravelInfoOneItem">
                  <i class="icons__del__icon"></i>
                  删除
                </span>
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
                      {{ scope.row.tripPersonName }}
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
                        v-model.trim="scope.row.planTicketNum"
                      >
                      </gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="其他交通票数" min-width="100">
                    <template slot-scope="scope">
                      <gc-input
                        placeholder=""
                        v-model.trim="scope.row.otherTrafficNum"
                      >
                      </gc-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="出差开始日期" min-width="140">
                    <template slot-scope="scope">
                      <el-date-picker
                        class="LaunchTrainingCourse__date"
                        v-model="scope.row.tripStartDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        :picker-options="{
                          disabledDate: startDisabledDate.bind(this, scope.row)
                        }"
                      >
                      </el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column label="出差结束日期" min-width="140">
                    <template slot-scope="scope">
                      <el-date-picker
                        class="LaunchTrainingCourse__date"
                        v-model="scope.row.tripEndDate"
                        type="date"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        :clearable="false"
                        :picker-options="{
                          disabledDate: endDisabledDate.bind(this, scope.row)
                        }"
                      >
                      </el-date-picker>
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
                      <el-cascader
                        clearable
                        v-model="scope.row.tripPlace"
                        :options="cityOptions"
                        :props="{
                          label: 'siteName',
                          value: 'siteNo'
                        }"
                        @change="handleCityChange"
                      ></el-cascader>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                                        label="操作"
                                        min-width="90"
                                    >
                                        <template slot-scope="scope">
                                            <span
                                                class="active"
                                                @click="
                                                    handleTravelInfoTableCopy(
                                                        scope.row
                                                    )
                                                "
                                                >复制</span
                                            >
                                        </template>
                                    </el-table-column> -->
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
          <!-- <el-tab-pane
                        label="审批记录"
                        name="approvalRecord"
                        class="LaunchTrainingCourse__info-card__reimbursement__approval-record"
                    >
                        <div
                            class="LaunchTrainingCourse__info-card__reimbursement__approval-record__title LaunchTrainingCourse__title vice-title"
                        >
                            <div
                                class="LaunchTrainingCourse__title__left-small"
                            >
                                <div>.</div>
                                审批记录
                            </div>
                        </div>
                        <div
                            class="LaunchTrainingCourse__info-card__reimbursement__approval-record__content LaunchTrainingCourse__content last-tr-no-border"
                        >
                            <gc-table
                                :stripe="false"
                                :list="approvalRecordList"
                                :tableList="approvalRecordTable"
                            ></gc-table>
                        </div>
                    </el-tab-pane> -->
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
                            <div class="icons">
                                <span class="icons__add">
                                    <i class="icons__add__icon"></i>
                                    新增
                                </span>
                                <span class="icons__del">
                                    <i class="icons__del__icon"></i>
                                    删除
                                </span>
                            </div>
                        </div>
                        <div
                            class="LaunchTrainingCourse__info-card__reimbursement__consultation-record__contant LaunchTrainingCourse__content"
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
        <div class="LaunchTrainingCourse__title">
          <div class="LaunchTrainingCourse__title__left title">
            <span class="LaunchTrainingCourse__title__left__menu"></span>
            附件信息
          </div>
          <div class="icons">
            <span class="icons__add" @click="addEnclosureVisible = true">
              <i class="icons__add__icon"></i>
              添加附件
            </span>
            <span
              class="icons__upload"
              @click="uploadElectronicsInvoice = true"
            >
              <i class="icons__upload__icon"></i>
              上传电子发票
            </span>
            <span class="icons__del" @click="delEnclosureOneItem">
              <i class="icons__del__icon"></i>
              删除
            </span>
          </div>
        </div>
        <div class="LaunchTrainingCourse__info-card__item-content">
          <gc-table
            :list="enclosureList"
            :tableList="enclosureTable"
            :stripe="false"
            ref="enclosureTableRef"
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
                  {{ handleTime(scope.row.createdDate) }}
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
            "
          >
            <gc-table
              :list="hotelOrderList"
              :tableList="hotelOrderTable"
              :stripe="false"
              class="general__table"
            ></gc-table>
          </div>
        </div>
        <!-- 机票订单 -->
        <div class="LaunchTrainingCourse__info-card__travel-orders__airfare">
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
              LaunchTrainingCourse__content
            "
          >
            <gc-table
              :list="airfareOrderList"
              :tableList="airfareOrderTable"
              :stripe="false"
              class="general__table"
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
            "
          >
            <gc-table
              :list="trainOrderList"
              :tableList="trainOrderTable"
              :stripe="false"
              class="general__table"
            ></gc-table>
          </div>
        </div>
        <!-- 用车订单 -->
        <div class="LaunchTrainingCourse__info-card__travel-orders__car">
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
            "
          >
            <gc-table
              :list="carOrderList"
              :tableList="carOrderTable"
              :stripe="false"
              class="general__table"
            ></gc-table>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 成本中心 dialog -->
    <gc-model
      class="LaunchTrainingCourse__cost-center"
      title="成本中心"
      comfirmText="选择"
      cancelText=""
      :visible="costCenterVisible"
      @close="
        costCenterVisible = false
        costCenterTable = []
        resetObj(costCenterDialogForm, { total: 0, pageSize: 10, currPage: 1 })
      "
      width="800px"
      @comfirm="costCenterComfirm"
    >
      <div class="df">
        <el-form inline @submit.native.prevent>
          <el-form-item class="first-item" label-width="58px" label="机构">
            <el-input
              placeholder="请输入机构名称/代码"
              v-model="costCenterDialogForm.orgCode"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务段">
            <el-input
              placeholder="请输入业务段名称/代码"
              v-model="costCenterDialogForm.manageCenter"
            ></el-input>
          </el-form-item>
          <el-form-item label="成本中心">
            <el-input
              placeholder="请输入成本中心名称/代码"
              v-model="costCenterDialogForm.costCenter"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="LaunchTrainingCourse__cost-center__btns sw-150 fs0">
          <el-button @click="costCenterClickQuery">查询</el-button>
          <el-button class="reset-btn" @click="costCenterReset">重置</el-button>
        </div>
      </div>

      <gc-table
        :list="costCenterList"
        :tableList="costCenterTable"
        :stripe="false"
        @selection-change="tableSelectionChange($event, 'costCenterTableRef')"
        ref="costCenterTableRef"
        class="general__table"
      ></gc-table>
      <gc-pagination
        :total="costCenterDialogForm.total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :totalisShow="false"
        :page-sizes="[10, 20]"
        :page-size="costCenterDialogForm.pageSize"
        :current-page="costCenterDialogForm.currPage"
        @sizeChange="costCenterSizeChange"
        @currentChange="costCenterPageChange"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
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
      <el-form
        :inline="true"
        :model="contractSearchForm"
        @submit.native.prevent
      >
        <el-form-item class="first-item">
          <gc-input
            label="合同编号"
            v-model.trim="contractSearchForm.code"
          ></gc-input>
        </el-form-item>
        <el-form-item>
          <gc-input
            label="合同名称"
            v-model.trim="contractSearchForm.name"
          ></gc-input>
        </el-form-item>
        <div class="LaunchTrainingCourse__contract-search__btns">
          <el-button @click="handleContractSearchClickQuery">查询</el-button>
          <el-button class="reset-btn" @click="handleContractSearchReset"
            >重置</el-button
          >
        </div>
      </el-form>
      <gc-table
        :list="contractSearchList"
        :tableList="contractSearchTable"
        :stripe="false"
        :vLoading="contractSearchDialogVLoading"
        ref="contractSearchTableRef"
        class="general__table"
      >
        <template>
          <el-table-column label="本次付款金额" min-width="102">
            <template slot-scope="scope">
              <gc-input v-model.trim="scope.row.thisTimePayAmt"></gc-input>
            </template>
          </el-table-column>
        </template>
      </gc-table>
      <!-- <gc-pagination
                :total="contractSearchForm.total"
                layout="prev, pager, next,slot, sizes"
                prev-text=""
                next-text=""
                :totalisShow="false"
                :page-sizes="[4]"
                :page-size="contractSearchForm.pageSize"
                :current-page="contractSearchForm.currPage"
                @currentChange="contractSearchDialogCurrentChange"
                @sizeChange="contractSearchDialogSizeChange"
            >
                <span class="text">每页显示</span>
            </gc-pagination> -->
    </gc-model>

    <!-- 添加附件 dislog -->
    <gc-model
      class="LaunchTrainingCourse__add-enclosure"
      title="添加附件"
      :visible="addEnclosureVisible"
      min-width="500px"
      @close="
        addEnclosureVisible = false
        addEnclosureFileList = []
      "
      @comfirm="addEnclosureComfirm"
      @cancel="addEnclosureVisible = false"
    >
      <div class="LaunchTrainingCourse__add-enclosure__title">
        <div class="LaunchTrainingCourse__add-enclosure__title__text">
          上传附件
        </div>

        <el-button
          class="LaunchTrainingCourse__add-enclosure__title__btn"
          @click="openUpload('addEnclosureFile')"
        >
          <i class="LaunchTrainingCourse__add-enclosure__title__btn__icon"></i>
          上传文件
        </el-button>
        <input
          v-if="inputShow"
          type="file"
          multiple
          id="addEnclosureFile"
          ref="addEnclosureFileRef"
          @change="addEnclosureFileChange"
          accept=".xls,.doc,.htm,.ppt,.mht,.msg,.rar,.zip,.txt,.html,.docx,.xlsx,.pptx,.pdf,.png,.gif,.jpg"
        />
      </div>
      <div class="LaunchTrainingCourse__add-enclosure__format">
        <span style="float: left"> 支持扩展名：</span>
        <span>
          .xls、.doc、.htm、.ppt、.mht、.msg、.rar、.zip、.txt、.html、.docx、.xlsx、.pptx、.png、.gif、.jpg、.pdf
        </span>
      </div>
      <div class="LaunchTrainingCourse__add-enclosure__items">
        <div
          class="LaunchTrainingCourse__add-enclosure__items__item"
          v-for="item in addEnclosureFileList"
          :key="item.lastModified"
        >
          <i class="LaunchTrainingCourse__add-enclosure__items__item__icon"></i>
          <div
            class="LaunchTrainingCourse__add-enclosure__items__item__filename"
          >
            <gc-tooltip :length="1">
              {{ item.name }}
            </gc-tooltip>
          </div>
          <el-progress
            class="LaunchTrainingCourse__add-enclosure__items__item__progress"
            :percentage="100"
            status="success"
          ></el-progress>
        </div>
      </div>
    </gc-model>

    <!-- 上传电子发票 dislog -->
    <gc-model
      class="LaunchTrainingCourse__upload-electronics-invoice"
      title="上传电子发票"
      :visible="uploadElectronicsInvoice"
      width="500px"
      @close="
        uploadElectronicsInvoice = false
        $refs.uploadElectronicsInvoiceFileInputRef.value = ''
        uploadElectronicsInvoiceFileList = []
      "
      @comfirm="uploadElectronicsInvoiceComfirm"
      @cancel="uploadElectronicsInvoice = false"
    >
      <div class="LaunchTrainingCourse__upload-electronics-invoice__title">
        <div
          class="LaunchTrainingCourse__upload-electronics-invoice__title__text"
        >
          上传附件
        </div>
        <el-button
          class="LaunchTrainingCourse__upload-electronics-invoice__title__btn"
          @click="openUpload('uploadElectronicsInvoiceFileInput')"
        >
          <i
            class="
              LaunchTrainingCourse__upload-electronics-invoice__title__btn__icon
            "
          ></i>
          上传文件
        </el-button>
        <input
          type="file"
          name=""
          ref="uploadElectronicsInvoiceFileInputRef"
          id="uploadElectronicsInvoiceFileInput"
          accept=".pdf,.ofd"
          @change="uploadElectronicsInvoiceFileInputChange"
        />
      </div>
      <div class="LaunchTrainingCourse__upload-electronics-invoice__format">
        电子发票只允许上传PDF,OFD类型文件
      </div>
      <div
        class="LaunchTrainingCourse__upload-electronics-invoice__items"
        v-for="item in uploadElectronicsInvoiceFileList"
        :key="item.lastModified"
      >
        <div
          class="LaunchTrainingCourse__upload-electronics-invoice__items__item"
        >
          <i
            class="
              LaunchTrainingCourse__upload-electronics-invoice__items__item__icon
            "
          ></i>
          <div
            class="
              LaunchTrainingCourse__upload-electronics-invoice__items__item__filename
            "
          >
            <gc-tooltip :length="1">
              {{ item.name }}
            </gc-tooltip>
          </div>
          <el-progress
            class="
              LaunchTrainingCourse__upload-electronics-invoice__items__item__progress
            "
            :percentage="100"
            status="success"
          ></el-progress>
        </div>
      </div>
    </gc-model>

    <!-- 新增-费用大小类 dislog -->
    <!-- <gc-model
            class="LaunchTrainingCourse__cost-type"
            title="费用大小类"
            :visible="costTypeVisible"
            width="800px"
            @close="costTypeVisible = false"
        >
            <gc-table
                :list="costTypeList"
                :tableList="costTypeTable"
                border
                :span-method="costTypearraySpanMethod"
            >
                <el-table-column prop="expenseTypeDescMin" label="子类别">
                    <template slot-scope="scope">{{
                        scope.row.expenseTypeDescMin || "一"
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="expenseTypeDescSmall"
                    label="本次报销细项（元）"
                >
                    <template slot-scope="scope">{{
                        scope.row.expenseTypeDescSmall || "一"
                    }}</template>
                </el-table-column>
                <el-table-column
                    prop="budgetAmt"
                    label="立项金额"
                ></el-table-column>
                <el-table-column min-width="64" label="选择">
                    <el-checkbox></el-checkbox>
                </el-table-column>
            </gc-table>
        </gc-model> -->

    <!-- 关联专票 dialog -->
    <gc-model
      class="LaunchTrainingCourse__common-dialog"
      title="关联专票"
      :visible="relationTicketVisible"
      width="1000px"
      @close="relationTicketClose"
      @cancel="relationTicketVisible = false"
      @comfirm="relationTicketVisible = false"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <gc-input
            label="发票号码"
            class="left relation-ticket-form-input"
            v-model.trim="relationTicketForm.invoiceNo"
          ></gc-input>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button
            class="
              LaunchTrainingCourse__common-dialog__title__right__query
              button-60
            "
            @click="relationTicketClickQuery"
            >查询</el-button
          >
          <el-button
            class="
              LaunchTrainingCourse__common-dialog__title__right__reset
              button-60-blue-plain
            "
            @click="relationTicketReset"
            >重置</el-button
          >
          <el-button
            class="
              LaunchTrainingCourse__common-dialog__title__right__relation
              button-60-blue-primary
            "
            @click="relationInvoice"
            >关联发票</el-button
          >
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content">
        <gc-table
          class="
            LaunchTrainingCourse__content
            LaunchTrainingCourse__relationTicketTable
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
          <el-button class="button-60-blue-primary" @click="unrelationInvoice"
            >取消关联</el-button
          >
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
      :visible="relationTravelOrderVisible"
      width="1200px"
      @close="relationTravelOrderClose"
      @comfirm="relationTravelOrderComfirm"
      @cancel="relationTravelOrderVisible = false"
    >
      <template slot="title">
        <span class="el-dialog__title mr20">关联差旅订单</span>
        <!-- <el-tooltip :visible-arrow="false" popper-class="bgf shadow-1"
                    ><i class="el-icon-question active"></i>
                    <div slot="content" class="fontColor l18">
                        当预订人与报销人不一致时，需要预订人在财智
                        <br />
                        云将订单授权给报销人，报销人才能查询到。
                    </div>
                </el-tooltip> -->
      </template>
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item
              class="LaunchTrainingCourse__common-dialog__title__left__first"
              ><gc-input
                class="left"
                label="差旅订单号"
                v-model.trim="relationTravelOrderForm.orderId"
              ></gc-input
            ></el-form-item>
            <el-form-item
              ><gc-input
                class="left"
                label="预定人"
                placeholder="请输入UM号"
                v-model.trim="relationTravelOrderForm.um"
              ></gc-input
            ></el-form-item>
          </el-form>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button class="button-60" @click="relationTravelOrderSearch"
            >查询</el-button
          >
          <el-button
            class="button-60-blue-plain"
            @click="relationTravelOrderReset"
            >重置</el-button
          >
          <el-button
            class="button-60-blue-primary"
            @click="relationTravelOrderStart"
            >关联订单</el-button
          >
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content">
        <gc-table
          class="
            general__table
            table-radio
            LaunchTrainingCourse__relationTravelOrderTable
          "
          ref="relationTravelOrderTableRef"
          :list="relationTravelOrderList"
          :tableList="relationTravelOrderTable"
          :stripe="false"
          @selection-change="
            tableSelectionChange($event, 'relationTravelOrderTableRef')
          "
        >
          <template>
            <el-table-column label="起始时间" min-width="90">
              <template slot-scope="scope">
                {{ formatDate(scope.row.startTime, true) }}
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="90">
              <template slot-scope="scope">
                {{ formatDate(scope.row.endTime, true) }}
              </template>
            </el-table-column>
            <el-table-column label="是否大发票" min-width="90">
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
        <!-- <gc-pagination
                    :total="100"
                    layout="prev, pager, next,slot, sizes"
                    prev-text=""
                    next-text=""
                    :totalisShow="false"
                >
                    <span class="text">每页显示</span>
                </gc-pagination> -->
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
          <el-button
            class="button-60-blue-primary"
            @click="relationTravelOrderCancel"
            >取消关联</el-button
          >
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
            <el-table-column label="起始时间" min-width="90">
              <template slot-scope="scope">
                {{ formatDate(scope.row.startTime, true) }}
              </template>
            </el-table-column>
            <el-table-column prop="endTime" label="结束时间" min-width="90">
              <template slot-scope="scope">
                {{ formatDate(scope.row.endTime, true) }}
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

    <!-- 查找供应商 -->
    <gc-model
      class="
        LaunchTrainingCourse__common-dialog
        LaunchTrainingCourse__supplier-search
        LaunchTrainingCourse__redio
      "
      title="供应商"
      ref="supplierSearchDialogRef"
      :visible="supplierSearchVisible"
      width="1000px"
      @close="supplierSearchClose"
      @cancel="supplierSearchVisible = false"
      @comfirm="supplierSearchComfirm"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <el-form :inline="true" @submit.native.prevent>
            <!-- <el-form-item
                            class="LaunchTrainingCourse__common-dialog__title__left__first"
                        >
                            <gc-input
                                label="供应商编号"
                                class="left"
                                v-model="supplierSearchForm.supplierCode"
                            ></gc-input>
                        </el-form-item> -->
            <el-form-item>
              <gc-input
                label="供应商名称"
                class="left"
                v-model.trim="supplierSearchForm.supplierName"
              ></gc-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button
            class="button-60-blue-plain"
            @click="supplierSearchClickQuery"
            >查询</el-button
          >
          <el-button class="button-60-blue-primary" @click="supplierSearchReset"
            >重置</el-button
          >
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content">
        <gc-table
          class="
            LaunchTrainingCourse__common-dialog__content__table
            scroll__table
          "
          :list="supplierSearchList"
          :tableList="supplierSearchTable"
          :stripe="false"
          :vLoading="supplierSearchDialogTableVLoading"
          ref="supplierSearchRef"
          @selection-change="tableSelectionChange($event, 'supplierSearchRef')"
        ></gc-table>
      </div>
      <gc-pagination
        :total="supplierSearchForm.total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :current-page="supplierSearchForm.currPage"
        :page-size="supplierSearchForm.pageSize"
        :page-sizes="[5, 10]"
        @sizeChange="supplierSearchDialogSizeChange"
        @currentChange="supplierSearchDialogCurrentChange"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </gc-model>

    <!-- 挂账大小类 dialog -->
    <gc-model
      class="
        LaunchTrainingCourse__common-dialog
        LaunchTrainingCourse__account-size-category-dialog
      "
      cancelText=""
      confirmText="选择"
      title="挂账大小类"
      :visible="accountSizeVisible"
      width="800px"
      @close="
        accountSizeVisible = false
        accountSizeTable = []
      "
      @comfirm="accountSizeComfirm"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <el-form :inline="true" @submit.native.prevent>
            <el-form-item
              class="LaunchTrainingCourse__common-dialog__title__left__first"
            >
              <gc-input
                label="大类"
                class="left"
                v-model="accountSizeForm.max"
              ></gc-input>
            </el-form-item>
            <el-form-item>
              <gc-input
                label="小类"
                class="left"
                v-model="accountSizeForm.min"
              ></gc-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button class="button-60" @click="accountSizeClickQuery"
            >查询</el-button
          >
          <el-button class="button-60-blue-primary" @click="accountSizeReset"
            >重置</el-button
          >
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content">
        <gc-table
          class="
            LaunchTrainingCourse__common-dialog__content__table
            general__table
            LaunchTrainingCourse__redio
          "
          :list="accountSizeList"
          :tableList="accountSizeTable"
          :stripe="false"
          :vLoading="accountSizeDialogTableVLoading"
          @selection-change="
            tableSelectionChange($event, 'accountSizeTableRef')
          "
          ref="accountSizeTableRef"
        >
        </gc-table>
        <gc-pagination
          :total="accountSizeForm.total"
          layout="prev, pager, next,slot, sizes"
          prev-text=""
          next-text=""
          :totalisShow="false"
          :current-page="accountSizeForm.currPage"
          :page-sizes="[5, 10]"
          :page-size="accountSizeForm.pageSize"
          @sizeChange="accountSizeSizeChange"
          @currentChange="accountSizePageChange"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </div>
    </gc-model>
    <!-- 挂账账单查询 dialog -->
    <gc-model
      class="LaunchTrainingCourse__common-dialog LaunchTrainingCourse__redio"
      cancelText=""
      confirmText="选择"
      title="挂账单查询"
      ref="accountSearchDialogRef"
      :visible="accountSearchVisible"
      width="800px"
      @close="
        handleNestingPopupAfterClose('accountSearchDialogRef')
        accountSearchReset()
        accountSearchVisible = false
        accountSearchTable = []
      "
      @comfirm="accountSearchComfirm"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <gc-input
            class="left"
            label="报账单号"
            v-model="accountSearchForm.expenseId"
          ></gc-input>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button
            class="button-60-blue-plain"
            @click="accountSearchClickQuery"
            >查询</el-button
          >
          <el-button class="button-60-blue-primary" @click="accountSearchReset"
            >重置</el-button
          >
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content tabpane">
        <gc-table
          class="LaunchTrainingCourse__content general__table"
          ref="accountSearchTableRef"
          :list="accountSearchList"
          :tableList="accountSearchTable"
          :stripe="false"
          :vLoading="accountSearchDialogTableVLoading"
          @selection-change="
            tableSelectionChange($event, 'accountSearchTableRef')
          "
        >
          <el-table-column label="挂账说明">
            <template slot-scope="scope">
              <gc-tooltip
                :content="scope.row.advancePayExpenseBranchDesc"
                :length="50"
              >
              </gc-tooltip>
            </template>
          </el-table-column>
        </gc-table>
        <gc-pagination
          :total="accountSearchForm.total"
          layout="prev, pager, next,slot, sizes"
          prev-text=""
          next-text=""
          :totalisShow="false"
          :page-sizes="[2, 4, 6]"
          :page-size="accountSearchForm.pageSize"
          :current-page="accountSearchForm.currPage"
          @sizeChange="accountSearchSizeChange"
          @currentChange="accountSearchPageChange"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </div>
    </gc-model>
    <!-- 差旅信息-选择人员 dialog状态 -->
    <gc-model
      class="LaunchTrainingCourse__common-dialog"
      cancelText=""
      confirmText="选择"
      title="选择人员"
      :visible="travelInfoSelectStaffVisible"
      width="800px"
      @close="
        travelInfoSelectStaffVisible = false
        travelInfoForm.name = ''
        travelInfoForm.total = 0
        travelInfoSelectStaffTable = []
      "
      @comfirm="travelInfoSelectStaffComfirm"
    >
      <div class="LaunchTrainingCourse__common-dialog__title">
        <div class="LaunchTrainingCourse__common-dialog__title__left">
          <gc-input
            class="left"
            label="出差人"
            placeholder="请输入姓名/UM号"
            v-model="travelInfoForm.name"
          ></gc-input>
        </div>
        <div class="LaunchTrainingCourse__common-dialog__title__right">
          <el-button
            class="button-60-blue-primary"
            @click="travelInfoFormClickQuery"
            >查询</el-button
          >
        </div>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__content tabpane">
        <gc-table
          class="
            LaunchTrainingCourse__content
            LaunchTrainingCourse__common-dialog__content__table
            general__table
          "
          ref="travelInfoSelectStaffTableRef"
          :list="travelInfoSelectStaffList"
          :tableList="travelInfoSelectStaffTable"
          :stripe="false"
          :vLoading="travelInfoSelectStaffDialogTableVLoading"
        >
        </gc-table>
        <gc-pagination
          :total="travelInfoForm.total"
          layout="prev, pager, next,slot, sizes"
          prev-text=""
          next-text=""
          :totalisShow="false"
          :page-sizes="[5, 10]"
          :page-size="travelInfoForm.size"
          :current-page="travelInfoForm.page"
          @sizeChange="travelInfoTableSizeChange"
          @currentChange="travelInfoTableCurrentChange"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </div>
    </gc-model>
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

    <!-- 报销信息 dialog -->
    <gc-model
      class="LaunchTrainingCourse__reimbursement-info"
      title="报销信息"
      :visible="reimbursementInfoVisible"
      width="800px"
      @close="reimbursementInfoVisible = false"
      @cancel="
        ;(classesInfo.expenseDetails || []).forEach((v) => (v.checked = false))
        reimbursementInfoVisible = false
      "
      @comfirm="handleReimbursementInfoSelect"
    >
      <div v-if="classesInfo.students">
        <div
          class="
            LaunchTrainingCourse__reimbursement-info__student__title
            LaunchTrainingCourse__title
          "
        >
          <div class="LaunchTrainingCourse__title__left">
            <div class="LaunchTrainingCourse__title__left__menu"></div>
            本次报销学员
          </div>
        </div>
        <div class="LaunchTrainingCourse__reimbursement-info__student__content">
          <div
            class="
              LaunchTrainingCourse__reimbursement-info__student__content__select-all
            "
          >
            <el-checkbox
              v-model="studentAllSekectState"
              @change="studentAllSekectStateChange"
              >全选</el-checkbox
            >
          </div>
          <div
            class="
              LaunchTrainingCourse__reimbursement-info__student__content__items
            "
          >
            <div
              class="
                LaunchTrainingCourse__reimbursement-info__student__content__items__item
              "
              v-for="item in classesInfo.students"
              :key="item.stuName"
            >
              <el-checkbox
                v-model="item.checked"
                @change="reimbursementStudentChange"
                >{{ item.stuName }}</el-checkbox
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="
          LaunchTrainingCourse__reimbursement-info__mony__title
          LaunchTrainingCourse__title
        "
        :class="{ 'margin-0': !classesInfo.students }"
      >
        <div class="LaunchTrainingCourse__title__left">
          <div class="LaunchTrainingCourse__title__left__menu"></div>
          本次报销费用
        </div>
      </div>
      <div class="LaunchTrainingCourse__reimbursement-info__money__content">
        <gc-table
          :list="currentReimbursementMoneyList"
          :tableList="classesInfo.expenseDetails"
          :stripe="false"
          :border="true"
          :span-method="costTypearraySpanMethod"
        >
          <template>
            <el-table-column
              prop="expenseTypeDescMin"
              label="子类别"
              min-width="170"
            >
              <template slot-scope="scope">{{
                scope.row.expenseTypeDescMin || '一'
              }}</template>
            </el-table-column>
            <el-table-column
              prop="expenseTypeDescSmall"
              label="本次报销细项"
              min-width="200"
            >
              <template slot-scope="scope">{{
                scope.row.expenseTypeDescSmall || '一'
              }}</template>
            </el-table-column>
            <el-table-column
              prop="budgetAmt"
              label="立项金额（元）"
              min-width="120"
            ></el-table-column>
            <el-table-column min-width="64" label="选择">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checked"></el-checkbox>
              </template>
            </el-table-column>
          </template>
        </gc-table>
      </div>
    </gc-model>

    <!-- 差旅信息批量导入dialog -->
    <InstructorBatchImport
      title="差旅信息批量导入"
      :visible.sync="travelInfoImport"
      @change="travelInfoImportChange"
      @templateDownload="
        templateDownload('/common/file/downloadModule', {
          fileCode: 'reimTripInfoModule'
        })
      "
      @comfirm="travelInfoImportComfirm"
      @close="travelInfoImportClose"
    >
      <div v-if="travelInfoImportData.importInfo">
        <p>
          {{ travelInfoImportData.importInfo }}
        </p>
        <p
          v-for="error in travelInfoImportData.errorList"
          :key="error"
          class="error-color"
        >
          {{ error }}
        </p>
      </div>
    </InstructorBatchImport>

    <!-- 费用分摊 dialog -->
    <gc-model
      title="费用分摊"
      :visible.sync="apportionConstVisible"
      width="1000px"
      comfirmText="保存"
      cancelText="关闭"
      @comfirm="apportionConstComfirm"
      @close="apportionConstClose"
    >
      <div>
        <div class="menu-right">
          <span class="active mr20" @click="addApportionConst">新增</span>
          <span class="active mr20" @click="delApportionConst">删除</span>
          <span class="active mr20">
            <gc-fileInput @change="apportionConstChange" width="auto">
              导入
            </gc-fileInput>
          </span>
          <span
            v-if="classesInfo.action !== 'add'"
            class="active mr20"
            @click="exportApportionConst"
            >导出</span
          >
          <span
            class="active"
            @click="
              downloadAdapter({
                templateCode: 'REIMBURSEMENT_APPORTIONCONST'
              })
            "
            >模板下载</span
          >
        </div>
        <div class="table-box general__table">
          <gc-table
            no-list
            ref="apportionConstRef"
            :tableList="apportionConstList"
          >
            <el-table-column type="selection" width="64"></el-table-column>
            <el-table-column
              width="180"
              label="管理中心"
              prop="manageCenterDesc"
            ></el-table-column>
            <el-table-column label="成本中心" width="180">
              <template slot-scope="scope">
                <el-input
                  readonly
                  class="page-input"
                  v-model="scope.row.costCenterName"
                >
                  <i
                    slot="suffix"
                    class="page-input__search"
                    @click="openCostCenter(scope.row)"
                  ></i>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="含税金额" width="180">
              <template slot-scope="scope">
                <el-input
                  @blur="transformFloat(scope.row, 'totalPriceTax')"
                  @change="
                    scope.row.tax = myFloat(
                      scope.row.totalPriceTax - scope.row.excludingTaxAmt
                    )
                  "
                  v-model.trim="scope.row.totalPriceTax"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="不含税金额" width="180">
              <template slot-scope="scope">
                <el-input
                  @blur="transformFloat(scope.row, 'excludingTaxAmt')"
                  @change="
                    scope.row.tax = myFloat(
                      scope.row.totalPriceTax - scope.row.excludingTaxAmt
                    )
                  "
                  v-model.trim="scope.row.excludingTaxAmt"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="税额">
              <template slot-scope="scope">
                {{ scope.row.tax }}
              </template>
            </el-table-column>
          </gc-table>
          <el-table :show-header="false" :data="[{}]">
            <el-table-column width="64"> 合计 </el-table-column>
            <el-table-column width="180"></el-table-column>
            <el-table-column width="180"></el-table-column>
            <el-table-column width="180">
              {{ sum(apportionConstList, 'totalPriceTax') }}
            </el-table-column>
            <el-table-column width="180">
              {{ sum(apportionConstList, 'excludingTaxAmt') }}
            </el-table-column>
            <el-table-column>
              {{ sum(apportionConstList, 'tax') }}
            </el-table-column>
          </el-table>
        </div>
        <gc-pagination
          :total="apportionConstForm.total"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="apportionConstForm.pageSize"
          :current-page="apportionConstForm.currPage"
          @sizeChange="sizeChange($event, apportionConstForm, (_) => _)"
          @currentChange="currentChange($event, apportionConstForm, (_) => _)"
          class="between"
        ></gc-pagination>
      </div>
    </gc-model>

    <!-- 科目参考查询dialog -->
    <gc-model
      title="科目参考"
      :visible.sync="subjectVisible"
      width="800px"
      comfirmText="选择"
      cancelText=""
      @comfirm="subjectComfirm"
      @close="subjectClose"
    >
      <div>
        <el-form inline>
          <el-form-item label="代码/名称" class="mr60">
            <el-input
              placeholder="请输入代码/名称"
              v-model="subjectQueryForm.item"
            ></el-input>
          </el-form-item>
          <el-button
            class="fr button-60"
            type="primary"
            @click="
              subjectQueryForm.currPage = 1
              subjectGetList()
            "
            >查询</el-button
          >
        </el-form>
        <table-pagination
          radio
          ref="subjectRef"
          :list="subjectList"
          :getList="subjectGetList"
          :queryForm="subjectQueryForm"
          :tableList="subjectTableList"
          :page-sizes="[5]"
        >
        </table-pagination>
      </div>
    </gc-model>

    <!-- 项目、产品、订单号 共用dialog -->
    <gc-model
      :title="productObj.title"
      :visible.sync="productVisible"
      width="800px"
      @comfirm="productComfirm"
      @close="productClose"
    >
      <div>
        <el-form inline>
          <el-form-item label="代码/名称" class="mr60">
            <el-input
              placeholder="请输入代码/名称"
              v-model="productQueryForm.item"
            ></el-input>
          </el-form-item>
          <el-button
            class="fr button-60"
            type="primary"
            @click="
              productQueryForm.currPage = 1
              productGetList()
            "
            >查询</el-button
          >
        </el-form>
        <table-pagination
          radio
          ref="productRef"
          :list="subjectList"
          :getList="productGetList"
          :queryForm="productQueryForm"
          :tableList="productObj.tableList"
          :page-sizes="[5]"
        >
        </table-pagination>
      </div>
    </gc-model>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import { CopyObj, formatDate, daysApart, myRound } from '../../plugins/until'
import {
  sum,
  resetObj,
  myFloat,
  sizeChange,
  customHint,
  dataHeaders,
  jsonHeaders,
  localPaging,
  currentChange,
  transformFloat,
  handleUdmpHref,
  templateDownload,
  downloadAdapter,
  closeCurrPageAndGoPath,
  handleDownload,
  downHeaders,
  hintFrame
} from '../../util/utils'
import { fetchDelFileByUdmpids } from '@/fetch/reimbursement'
export default {
  name: 'LaunchReimbursement',
  data() {
    return {
      //识别动作 [add, edit]
      action: this.$route.params.action,
      //  是否禁用提交按钮
      isDisabled: false,
      //  是否禁用保存按钮
      saveDisabled: false,
      // 培训班信息
      classesInfo: { row: {} },
      // 基本信息 classesInfo
      // 基本信息里的本次使用金额是否可编辑
      baseInfoThisAmountIsEdit: false,
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
          value: '立项金额',
          ctx: (row) => (row.type ? row.costBudgetAmtMoneyTotal : row.budgetAmt)
        },
        {
          prop: 'payedAmt',
          width: '90',
          label: '已付款金额',
          value: '已付款金额',
          ctx: (row) => (row.type ? row.costPayedAmtTotal : row.payedAmt)
        },
        {
          prop: 'occupyAmt',
          width: '90',
          label: '已占用金额',
          value: '已占用金额',
          ctx: (row) => (row.type ? row.costOccupyAmtTotal : row.occupyAmt)
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
      enclosureTable: [],
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
      // 关联专票dialog里的 form表单
      relationTicketForm: {
        belongOrganCode: '',
        invoiceNo: '',
        currPage: 1,
        pageSize: 2,
        total: 0
      },
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
      // 查找成本中心的 table 数据数组
      costCenterTable: [],
      // 查找成本中心的 dialog form表单
      costCenterDialogForm: {
        deptDesc: '',
        deptId: '',
        currPage: 1,
        pageSize: 10
      },
      // 合同查找的 dialog状态
      contractSearchVisible: false,
      // 合同查找的 dialog 中table v-loading 状态
      contractSearchDialogVLoading: false,
      // 合同查找的 dialog 中的form对象
      contractSearchForm: {
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
          prop: 'occupyAmt',
          label: '已占用金额',
          value: '已占用金额',
          width: '80'
        },
        {
          prop: 'unPayAmt',
          label: '未付款金额',
          value: '未付款金额',
          width: '80'
        }
      ],
      // 合同查找的 table 数据数组
      contractSearchTable: [],
      // 修改合同编号 table 字段组
      contractCodeEditList: [
        {
          prop: 'contractCode',
          label: '合同编号',
          value: '合同编号',
          width: '110'
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
      // 修改合同编号 table 数组
      contractCodeEditTable: [],
      // 查找供应商 dialog 状态
      supplierSearchVisible: false,
      // 查找供应商 table 字段数组
      supplierSearchList: [
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
          prop: 'supplierCode',
          label: '供应商编号',
          value: '供应商编号',
          width: '100'
        },
        {
          prop: 'supplierName',
          label: '供应商名称',
          value: '供应商名称',
          width: '200'
        },
        {
          prop: 'taxpayer',
          label: '纳税人名称',
          value: '纳税人名称',
          width: '200'
        },
        {
          prop: 'orgSegment',
          label: '机构',
          value: '机构',
          width: '85'
        },
        {
          prop: 'orgSegmentDesc',
          label: '业务实体',
          value: '业务实体',
          width: '103'
        },
        {
          prop: 'addrName',
          label: '地址名称',
          value: '地址名称',
          width: '103'
        },
        {
          prop: 'accountInfo',
          label: '银行账号',
          value: '银行账号',
          width: '160'
        },
        {
          prop: 'residentDescFlag',
          label: '税收居民身份',
          value: '税收居民身份',
          width: '100'
        },
        {
          prop: 'supplierTypeDesc',
          label: '供应商类型',
          value: '供应商类型',
          width: '100'
        }
      ],
      // 查找供应商 table 数据数组
      supplierSearchTable: [],
      // 查找供应商 table loading 状态
      supplierSearchDialogTableVLoading: false,
      // 查找供应商 dialog 里的form表单
      supplierSearchForm: {
        supplierCode: '',
        supplierName: '',
        orgCode: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
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
      // 挂账大小类 dialog form表单
      accountSizeForm: {
        max: '',
        min: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },

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
      // 添加附件的 dialog 状态
      addEnclosureVisible: false,
      // 添加附件的 dialog 文件数组
      addEnclosureFileList: [],
      // 上传电子发票的 dialog 状态
      uploadElectronicsInvoice: false,
      // 上传电子发票的 dialog 文件数组
      uploadElectronicsInvoiceFileList: [],
      // 挂账信息 table数据数组
      accountsInfoTable: [],
      // 新增-费用大小类型 dialog状态
      costTypeVisible: false,
      // 新增-费用大小类型 table 字段数组
      costTypeList: [
        {
          prop: 'expenseTypeDescMax',
          label: '费用类别',
          value: '费用类别'
        }
      ],
      // 新增-费用大小类型 table 数据数组
      costTypeTable: [
        {
          expenseTypeDescMax: '支付其他应付款-其他',
          expenseTypeDescMin: '出差补助',
          expenseTypeDescSmall: '',
          budgetAmt: '7500'
        },
        {
          expenseTypeDescMax: '支付预提-其他',
          expenseTypeDescMin: '出差补助',
          expenseTypeDescSmall: '',
          budgetAmt: '7500'
        }
      ],
      // 核销信息 table数据数组
      writeOffInfoTable: [],
      // 差旅信息 table数据数组
      travelInfoTable: [],
      // 关联差旅订单 dialog状态
      relationTravelOrderVisible: false,
      // 关联差旅订单 dialog form 对象
      relationTravelOrderForm: {
        // 费用小类编码
        code: '',
        // 预定人
        um: '',
        // 差旅订单号
        orderId: ''
      },
      // 关联差旅订单 table 字段数组
      relationTravelOrderList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          width: '54',
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
          width: '260'
        },
        {
          prop: 'amt',
          label: '金额',
          value: '金额',
          width: '80'
        },
        {
          prop: 'orderName',
          label: '预定人',
          value: '预定人',
          width: '90'
        },
        {
          prop: 'tripName',
          label: '出差人',
          value: '出差人',
          width: '90'
        }
      ],
      // 关联差旅订单 table 数据数组
      relationTravelOrderTable: [],
      // 关联差旅订单 副table 数据数组
      relationTravelOrderViceTable: [],
      // 差旅信息-选择人员 dialog状态
      travelInfoSelectStaffVisible: false,
      // 差旅信息 出差人 input 绑定变量
      travelInfoForm: {
        classId: '',
        name: '',
        page: 1,
        size: 5,
        total: 0
      },
      // 差旅信息-选择人员 table 字段数组
      travelInfoSelectStaffList: [
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
          prop: 'tripPersonName',
          label: '姓名',
          value: '姓名'
        },
        {
          prop: 'tripPersonUm',
          label: 'UM号',
          value: 'UM号'
        },
        {
          prop: 'idvPosPostName',
          label: '岗位',
          value: '岗位'
        }
      ],
      // 差旅信息-选择人员 table 数据数组
      travelInfoSelectStaffTable: [],
      // 差旅信息-选择人员 table loading 状态
      travelInfoSelectStaffDialogTableVLoading: false,
      // 差旅信息 出差信息 出差地点 级联选择框 options
      cityOptions: [],
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
          width: '127',
          ctx: (row) => formatDate(row.startTime, true)
        },
        {
          prop: 'caikuOrderId',
          label: '订单号',
          value: '订单号',
          width: '200'
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
      // 查看所有影像 dialog 状态
      scanImageVisible: false,
      // 报销信息 dialog 状态
      reimbursementInfoVisible: false,
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
      // 本次报销费用 table数据
      currentReimbursementMoneyTable: [
        // {
        //     expenseTypeDescMax: "支付其他应付款-其他",
        //     expenseTypeDescMin: "出差补助",
        //     expenseTypeDescSmall: "",
        //     budgetAmt: "7500",
        //     checked: false
        // },
        // {
        //     expenseTypeDescMax: "支付预提-其他",
        //     expenseTypeDescMin: "出差补助",
        //     expenseTypeDescSmall: "",
        //     budgetAmt: "7500",
        //     checked: false
        // }
      ],
      daysApart,
      myRound,
      // 差旅订单类型 和 差旅订单数组映射
      travelOrderMaping: {
        酒店: 'hotelOrderTable',
        机票: 'airfareOrderTable',
        火车: 'trainOrderTable',
        用车: 'carOrderTable'
      },
      // 立项编号 本次使用金额
      currentUsedMoney: '',
      inputShow: true,
      // 是否是挂载
      isMounted: false,
      handleUdmpHref,
      // 定时保存任务
      saveTimer: null,
      // 是否需要校验差旅信息
      isValidateTrips: true,
      // 时间格式化函数
      formatDate,
      transformFloat,
      templateDownload,
      // 差旅信息批量导入
      travelInfoImport: false,
      // 差旅信息批量导入数据对象
      travelInfoImportData: {},
      // 费用分摊dialog状态
      apportionConstVisible: false,
      // 分摊dialog的表格数据
      apportionConstListBack: [],
      // 分摊dialog 查询form
      apportionConstForm: {
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      // 分摊dialog的 当前费用信息行
      apportionConstObj: {},
      // 打开成本中心时分摊费用列数据
      apportionConstItem: {},
      sum,
      myFloat,
      downloadAdapter,
      // 科目参考dialog状态
      subjectVisible: false,
      // 科目参考 表格字段
      subjectList: [
        {
          type: 'selection'
        },
        {
          label: '代码',
          prop: 'assistCode'
        },
        {
          label: '名称',
          prop: 'assistDesc'
        }
      ],
      // 科目参考 数据
      subjectTableList: [],
      // 科目参考 查询对象
      subjectQueryForm: {
        type: 'SEGMENT5',
        currPage: 1,
        pageSize: 5,
        total: 0,
        item: ''
      },
      // 打开 科目参考dialog时的数据对象
      subjectRow: {},
      resetObj,
      sizeChange,
      currentChange,
      productVisible: false,
      productObj: {},
      productQueryForm: {
        currPage: 1,
        pageSize: 5,
        total: 0,
        item: ''
      },
      allProductObj: {
        item: {
          title: '项目',
          tableList: [],
          type: 'SEGMENT6',
          reim: {
            label: 'projectName',
            value: 'projectCode'
          },
          account: {
            label: 'channelOrProjectDesc',
            value: 'channelOrProject'
          }
        },
        product: {
          title: '产品',
          tableList: [],
          type: 'SEGMENT7',
          reim: {
            label: 'productName',
            value: 'productCode'
          },
          account: {
            label: 'productDesc',
            value: 'productName'
          }
        },
        orderNumber: {
          title: '订单号',
          tableList: [],
          type: 'SEGMENT9',
          reim: {
            label: 'kuOrderName',
            value: 'kuOrderNo'
          },
          account: {
            label: 'orderNoDesc',
            value: 'orderNo'
          }
        }
      }
    }
  },
  methods: {
    // 成本中心 dislog的显示
    handleCostCenterVisible() {
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
      if (this.apportionConstObj.feeMaxCategoryDesc) {
        data.orgCode = this.classesInfo.orgSegment
      }
      if (!data.orgCode && !data.manageCenter && !data.costCenter) {
        return this.$message.warning('请填写查询参数')
      }
      this.$axios
        .post('/fn/reim/init/selectCostCenter', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.costCenterTable = data.list
            this.costCenterDialogForm.total = data.total
          }
        })
    },
    // 成本中心 重置 事件
    costCenterReset() {
      this.costCenterDialogForm.currPage = 1
      this.costCenterDialogForm.pageSize = 10
      this.costCenterDialogForm.total = 0
      this.costCenterDialogForm.orgCode = ''
      this.costCenterDialogForm.manageCenter = ''
      this.costCenterDialogForm.costCenter = ''
    },
    // 成本中心dialog 分页的sizechange事件
    costCenterSizeChange(size) {
      this.costCenterDialogForm.pageSize = size.pageSize
      this.costCenterDialogForm.currPage = 1
      this.costCenterQuery()
    },
    // 成本中心dialog 分页的pagechange事件
    costCenterPageChange(page) {
      this.costCenterDialogForm.currPage = page.pageNum
      this.costCenterQuery()
    },
    // 成本中心 comfirm 事件
    costCenterComfirm() {
      const selection = this.$refs.costCenterTableRef.$children[0].selection[0]
      if (!selection) return
      const {
        orgSegment,
        orgDesc,
        manageCenterCode,
        manageCenterDesc,
        costCenterCode,
        costCenterName
      } = selection
      if (this.apportionConstObj.feeMaxCategoryDesc) {
        this.apportionConstItem.manageCenterCode = manageCenterCode
        this.apportionConstItem.manageCenterDesc = manageCenterDesc
        this.apportionConstItem.costCenterCode = costCenterCode
        this.apportionConstItem.costCenterName = costCenterName
      } else if (costCenterName) {
        this.classesInfo.orgSegment = orgSegment
        this.classesInfo.orgDesc = orgDesc
        this.classesInfo.manageCenterCode = manageCenterCode
        this.classesInfo.manageCenterDesc = manageCenterDesc
        this.classesInfo.costCenterCode = costCenterCode
        this.classesInfo.costCenterName = costCenterName
      }
      this.costCenterVisible = false
    },
    // SelectionChange 事件 table多选变单选
    tableSelectionChange(selection, ref) {
      if (selection.length > 1) {
        this.$refs[ref].$children[0].clearSelection()
        this.$refs[ref].$children[0].toggleRowSelection(selection.pop())
      }
    },
    // 合同查找dislog的显示
    handleContractSearchVisible() {
      this.contractSearchVisible = true
    },
    // 编辑 合同编号 表格的删除事件
    handleContractCodeEditTableDel(index) {
      this.contractCodeEditTable.splice(index, 1)
      this.classesInfo.contractCode = this.contractCodeEditTable
        .map((v) => v.contractCode)
        .join(';')
      this.classesInfo.contractName = this.contractCodeEditTable
        .map((v) => v.contractName)
        .join(';')
    },
    // 合同查找中心的查询事件
    handleContractSearchClickQuery() {
      this.handleContractSearchQuery(true)
    },
    // 合同查找中心的查询函数
    handleContractSearchQuery(flag) {
      const { name, code } = this.contractSearchForm
      if (name === '' && code === '') {
        this.handleNestingPopup(
          'contractSearchDialog',
          '请填写合同编号或合同名称',
          '通知',
          '知道了',
          'contract-search-messagebox'
        )
      } else {
        if (flag) {
          this.contractSearchDialogVLoading = true
        }
        this.$axios
          .post(
            '/fn/reim/init/selectReimContract',
            this.contractSearchForm,
            jsonHeaders
          )
          .then((res) => {
            this.contractSearchDialogVLoading = false
            const { code, data } = res.data
            if (code === 0) {
              data.forEach((v) => {
                if (v.occupyAmt.trim() === 'null') {
                  v.occupyAmt = 0
                }
                if (v.unPayAmt.trim() === 'null') {
                  v.unPayAmt = 0
                }
              })
              this.contractSearchTable = data
            }
          })
      }
    },
    // 合同查找中心的重置事件
    handleContractSearchReset() {
      this.contractSearchForm.code = ''
      this.contractSearchForm.name = ''
    },
    // 合同查找中心的 CurrentChange事件
    contractSearchDialogCurrentChange(page) {},
    // 合同查找中心的 SizeChange事件
    contractSearchDialogSizeChange(size) {},
    // 合同查找中心 合同选择事件
    contractSearcConfirm() {
      const selection = this.$refs.contractSearchTableRef.$children[0].selection
      const ids = this.contractCodeEditTable.map((v) => v.contractCode)
      selection.forEach((v) => {
        if (!ids.includes(v.contractCode)) {
          this.contractCodeEditTable.push(CopyObj(v))
        }
      })
      this.classesInfo.contractCode = this.contractCodeEditTable
        .map((v) => v.contractCode)
        .join(';')
      this.classesInfo.contractName = this.contractCodeEditTable
        .map((v) => v.contractName)
        .join(';')
      this.contractSearchVisible = false
    },
    // 合同查找中心 dialog关闭事件
    handleContractSearchClose() {
      this.handleContractSearchReset()
      this.$refs.contractSearchTableRef.$children[0].clearSelection()
      this.contractSearchVisible = false
      this.contractSearchTable = []
      this.handleNestingPopupAfterClose('contractSearchDialog')
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
    // 查询可关联专票
    relationTicketClickQuery() {
      if (this.relationTicketForm.invoiceNo) {
        this.relationTicketForm.currPage = 1
        this.relationTicketQuery()
      } else {
        $('.relation-ticket-form-input input').focus()
      }
    },
    // 查询可关联专票函数
    relationTicketQuery() {
      this.$axios
        .post(
          '/fn/reim/init/selectInvoice',
          this.relationTicketForm,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.relationTicketTable = data.list
            this.relationTicketForm.total = data.total
          }
        })
    },
    // 重置可关联专票
    relationTicketReset() {
      this.relationTicketForm.invoiceNo = ''
    },
    // 清除 关联专票 弹框数据
    relationTicketClear() {
      this.relationTicketForm.invoiceNo = ''
      this.relationTicketTable = []
      this.relationTicketForm.total = 0
      this.relationTicketForm.pageSize = 2
      this.relationTicketForm.currPage = 1
      this.relationTicketViceTable = []
    },
    // 关联专票
    relationInvoice() {
      let flag = false
      this.$refs.relationTicketTableRef.$children[0].selection.forEach((v) => {
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

      this.$refs.relationTicketTableRef.$children[0].clearSelection()
    },
    // 取消关联专票
    unrelationInvoice() {
      const selectCode =
        this.$refs.relationTicketViceTableRef.$children[0].selection
      this.relationTicketViceTable = this.relationTicketViceTable.filter(
        (v) => !selectCode.includes(v)
      )
      this.costInfoTable[
        this.relationTicketForm.index
      ].relationTicketViceTable = this.relationTicketViceTable
      this.$refs.relationTicketViceTableRef.$children[0].clearSelection()
    },
    // 关联专票dialog 分页的sizechange事件
    relationTicketSizeChange(size) {
      this.relationTicketForm.pageSize = size.pageSize
      this.relationTicketForm.currPage = 1
      this.relationTicketQuery()
    },
    // 关联专票dialog 分页的pagechange事件
    relationTicketPageChange(page) {
      this.relationTicketForm.currPage = page.pageNum
      this.relationTicketQuery()
    },
    // 关联专票dialog 关闭事件
    relationTicketClose() {
      this.relationTicketVisible = false
      this.relationTicketClear()
    },
    // 打开关联差旅订单dialog
    openRelationTravelOrderDialog(currentCostInfo, index) {
      const arr = currentCostInfo.relationTravelOrderViceTable
      this.relationTravelOrderViceTable = arr ? CopyObj(arr) : []
      this.relationTravelOrderForm.index = index
      this.relationTravelOrderForm.code = currentCostInfo.feeMinCategory
      this.relationTravelOrderVisible = true
    },
    // 查询可关联差旅订单函数
    relationTravelOrderSearch() {
      const { um, orderId } = this.relationTravelOrderForm
      this.$axios
        .post(
          '/fn/reim/init/selectReimTripOrders',
          this.relationTravelOrderForm,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.relationTravelOrderTable = data
          }
        })
    },
    // 重置可关联差旅订单
    relationTravelOrderReset() {
      this.relationTravelOrderForm.um = ''
      this.relationTravelOrderForm.orderId = ''
    },
    // 关联旅订单
    relationTravelOrderStart() {
      const selection =
        this.$refs.relationTravelOrderTableRef.$children[0].selection
      if (selection.length) {
        this.relationTravelOrderViceTable.splice(0)
        this.relationTravelOrderViceTable.push(selection[0])
      }
      this.$refs.relationTravelOrderTableRef.$children[0].clearSelection()
    },
    // 取消关联旅订单
    relationTravelOrderCancel() {
      const selectCode =
        this.$refs.relationTravelOrderViceTableRef.$children[0].selection
      this.relationTravelOrderViceTable =
        this.relationTravelOrderViceTable.filter((v) => !selectCode.includes(v))
      this.$refs.relationTravelOrderViceTableRef.$children[0].clearSelection()
    },
    // 关联差旅订单时 关联到差旅信息
    TravelOrderToInfo() {
      Object.keys(this.travelOrderMaping).forEach((v) => {
        const tableName = this.travelOrderMaping[v]
        this[tableName] = []
      })
      this.costInfoTable.forEach((item) => {
        const obj = item.relationTravelOrderViceTable || []
        obj.forEach((v) => {
          const tableName = this.travelOrderMaping[v.caikuOrderType]
          this[tableName].push(v)
        })
      })
    },

    // 关联差旅订单关闭事件
    relationTravelOrderClose() {
      this.relationTravelOrderVisible = false
      this.relationTravelOrderTable = []
      this.relationTravelOrderViceTable = []
      resetObj(this.relationTravelOrderForm)
    },

    // 关联差旅订单确定事件
    relationTravelOrderComfirm() {
      this.$set(
        this.costInfoTable[this.relationTravelOrderForm.index],
        'relationTravelOrderViceTable',
        this.relationTravelOrderViceTable
      )
      this.relationTravelOrderVisible = false
      this.TravelOrderToInfo()
    },
    // 复制一条费用信息
    copyCostInfo(row) {
      const len = this.costInfoTable.length
      this.costInfoTable.splice(len - 1, 0, CopyObj(row))
    },
    // 费用信息添加合并行
    costAddSummary() {
      if (this.costInfoTable.find((v) => v.type)) return
      this.costInfoTable.push({
        costBudgetAmtMoneyTotal: '',
        costPayedAmtTotal: '',
        costOccupyAmtTotal: '',
        costCanReimbursementTotal: '',
        costBudgetAmtTotal: '',
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
    },
    // 报销信息 dialog 本次报销学员 全选事件
    studentAllSekectStateChange(newState) {
      this.classesInfo.students.forEach((item) => (item.checked = newState))
    },
    // 报销信息 dialog 本次报销学员 学生单选事件
    reimbursementStudentChange(change) {
      this.studentAllSekectState = this.classesInfo.students.every(
        (item) => item.checked
      )
    },

    // 新增 费用信息 的处理事件
    handleReimbursementInfoSelect() {
      const newArr = (this.classesInfo.expenseDetails || []).filter(
        (v) => v.checked
      )
      const arr = []
      newArr.forEach((v) => {
        const newV = CopyObj(v)
        newV.relationTicketViceTable = []
        const len = this.costInfoTable.length
        this.costInfoTable.splice(len - 1, 0, newV)
        arr.push(newV)
      })
      ;(this.classesInfo.expenseDetails || []).forEach((v) =>
        this.$set(v, 'checked', false)
      )
      const categoryTypes = arr.map((v) => ({
        maxCategoryCode: v.feeMaxCategory,
        minCategoryCode: v.feeMinCategory
      }))
      this.$axios
        .post(
          '/fn/reim/init/selectReimAccountingSubjectCds',
          { categoryTypes },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => {
              const item = arr.find(
                (result) =>
                  result.feeMaxCategory === v.maxCategoryCode &&
                  result.feeMinCategory === v.minCategoryCode
              )
              this.$set(item, 'accountingSubjectCd', v.accountingSubjectCd)
              this.$set(item, 'budgetProjectCode', v.budgetProjectCode)
            })
          }
        })
      this.reimbursementInfoVisible = false
    },
    // 删除 费用信息 的处理事件
    handleDelReimbursementInfo() {
      this.costInfoTable = this.costInfoTable.filter((v) => v.checked || v.type)
      this.TravelOrderToInfo()
    },
    // 费用信息 表格单行 selection-change 事件
    costInfoSelectionChange(selection) {
      this.costInfoTable.forEach((v) => (v.checked = true))
      selection.forEach((v) => (v.checked = false))
    },
    // 费用信息 表格 本次报销金额 失焦事件
    handleCostInfoTableAmtBlur(row) {
      row.amt = (myFloat(row.amt) || '') + ''
      let canReimburseMoney
      const allMoney =
        (Number.parseFloat(this.classesInfo.budgetTotalAmt) || 0) -
        (Number.parseFloat(this.classesInfo.occupyTotalAmt) || 0)
      const inputAllMoney = this.costInfoTable
        .map((v) => Number.parseFloat(v.amt))
        .reduce((prev, next) => prev + next, 0)
      if (
        (this.classesInfo.row.expenseType || this.classesInfo.row.ifShare) ===
        'Y'
      ) {
        canReimburseMoney = allMoney
      } else {
        canReimburseMoney = this.myRound(
          row.budgetAmt - (row.payedAmt || 0) - (row.occupyAmt || 0),
          2
        )
      }

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
        if (
          (this.classesInfo.row.expenseType || this.classesInfo.row.ifShare) ===
          'Y'
        ) {
          amtList = this.costInfoTable.map((v) => Number.parseFloat(v.amt))
        } else {
          amtList = this.costInfoTable
            .filter((v) => v.feeMinCategoryDesc === row.feeMinCategoryDesc)
            .map((v) => Number.parseFloat(v.amt))
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
    //报销信息 表格合并方法
    costTypearraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let n = 1
        if (
          row.expenseTypeDescMax !==
          (this.classesInfo.expenseDetails[rowIndex - 1] || {})
            .expenseTypeDescMax
        ) {
          this.classesInfo.expenseDetails.slice(rowIndex + 1).some((v) => {
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
          this.classesInfo.expenseDetails.slice(rowIndex + 1).some((v) => {
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
      this.accountsInfoTable = this.accountsInfoTable.filter(
        (v) => !selection.includes(v)
      )
    },
    // 挂账大小类 dialog 查询事件
    accountSizeClickQuery(flag) {
      this.accountSizeForm.currPage = 1
      this.accountSizeDialogTableVLoading = true
      this.accountSizeQuery()
    },
    // 挂账大小类 dialog 查询函数
    accountSizeQuery() {
      this.$axios
        .post(
          '/fn/reim/init/selectSuspendType',
          this.accountSizeForm,
          jsonHeaders
        )
        .then((res) => {
          this.accountSizeDialogTableVLoading = false
          const { code, data } = res.data
          if (code === 0) {
            this.accountSizeTable = data.list
            this.accountSizeForm.total = data.total
          }
        })
    },
    // 挂账大小类 dialog 重置事件
    accountSizeReset() {
      this.accountSizeForm.max = ''
      this.accountSizeForm.min = ''
      this.accountSizeForm.currPage = 1
      this.accountSizeQuery()
    },
    // 挂账大小类 dialog SizeChange 事件
    accountSizeSizeChange(size) {
      this.accountSizeForm.pageSize = size.pageSize
      this.accountSizeForm.currPage = 1
      this.accountSizeQuery()
    },
    // 挂账大小类 dialog PageChange 事件
    accountSizePageChange(page) {
      this.accountSizeForm.currPage = page.pageNum
      this.accountSizeQuery()
    },
    // 挂账大小类 dialog comfirm事件
    accountSizeComfirm() {
      const select = this.$refs.accountSizeTableRef.$children[0].selection[0]
      const item = this.accountsInfoTable[this.accountSizeForm.index]
      if (select) {
        Object.keys(item).forEach((v) => {
          if (select[v]) {
            item[v] = select[v]
          }
        })
      }
      this.$refs.accountSizeTableRef.$children[0].clearSelection()
      this.accountSizeVisible = false
    },
    // 新增收款人信息
    addReimbursementPayee() {
      this.payeeInfoTable.push({
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
      this.payeeInfoTable = this.payeeInfoTable.filter(
        (v) => !selection.includes(v)
      )
    },
    // 供应商 dislog的查询事件
    supplierSearchClickQuery() {
      this.supplierSearchForm.currPage = 1
      this.supplierSearchQuery()
    },
    // 供应商 dislog的查询函数
    supplierSearchQuery() {
      this.supplierSearchDialogTableVLoading = true
      this.supplierSearchForm.orgCode = this.classesInfo.orgSegment
      this.$axios
        .post(
          '/fn/reim/init/selectReimSupplier',
          this.supplierSearchForm,
          jsonHeaders
        )
        .then((res) => {
          this.supplierSearchDialogTableVLoading = false
          const { code, data } = res.data
          if (code === 0) {
            this.supplierSearchTable = data.list
            this.supplierSearchForm.total = data.total
          }
        })
    },
    // 供应商 dislog的 重置 事件
    supplierSearchReset() {
      this.supplierSearchForm.supplierCode = ''
      this.supplierSearchForm.supplierName = ''
    },
    // 供应商 dislog的 SizeChange
    supplierSearchDialogSizeChange(size) {
      this.supplierSearchForm.pageSize = size.pageSize
      this.supplierSearchForm.currPage = 1
      this.supplierSearchQuery()
    },
    // 供应商 dislog的 PageChange
    supplierSearchDialogCurrentChange(page) {
      this.supplierSearchForm.currPage = page.pageNum
      this.supplierSearchQuery()
    },
    // 供应商 dislog的 关闭 事件
    supplierSearchClose() {
      this.supplierSearchReset()
      this.$refs.supplierSearchRef.$children[0].clearSelection()
      this.supplierSearchVisible = false
      this.supplierSearchTable = []
      this.supplierSearchForm.total = 0
      this.supplierSearchForm.currPage = 1
      this.supplierSearchForm.pageSize = 5
      this.handleNestingPopupAfterClose('supplierSearchDialogRef')
    },
    // 供应商 dislog的 选择 事件
    supplierSearchComfirm() {
      let item = this.payeeInfoTable[this.supplierSearchForm.index]
      let supplier = this.$refs.supplierSearchRef.$children[0].selection.pop()
      if (item && supplier) {
        delete supplier['payAmt']
        _.merge(item, supplier)
      }
      this.supplierSearchClose()
    },
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
        (v) => !selection.includes(v)
      )
    },
    // 挂账单dialog 打开
    handleAccountSearchDialogOpen(index, row) {
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
      this.$axios
        .post(
          '/fn/reim/init/selectReimCancel',
          this.accountSearchForm,
          jsonHeaders
        )
        .then((res) => {
          this.accountSearchDialogTableVLoading = false
          const { code, data } = res.data
          if (code === 0) {
            data.list.forEach((v) => {
              let cancelBillType
              if (this.accountSearchForm.cancelBillType === '1') {
                cancelBillType = '预付款'
              } else if (this.accountSearchForm.cancelBillType === '2') {
                cancelBillType = '挂账'
              }
              v.cancelBillType = cancelBillType
            })
            this.accountSearchTable = data.list
            this.accountSearchForm.total = data.total
          }
        })
    },
    // 挂账单 重置
    accountSearchReset() {
      this.accountSearchForm.expenseId = ''
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
    // 挂账单查询 dialog comfirm 事件
    accountSearchComfirm() {
      const selection =
        this.$refs.accountSearchTableRef.$children[0].selection[0]
      const item = this.writeOffInfoTable[this.accountSearchForm.index]
      if (selection) {
        delete selection['cancelType']
        delete selection['thisTimeCancelAmt']
        _.merge(item, selection)
      }
      this.accountSearchVisible = false
    },
    // 选择人员查询事件
    travelInfoFormClickQuery() {
      this.travelInfoForm.page = 1
      this.travelInfoSelectStaffDialogTableVLoading = true
      this.travelInfoFormQuery()
    },
    // 选择人员查询函数
    travelInfoFormQuery(flag) {
      this.travelInfoForm.classId = this.classesInfo.classId
      const data = CopyObj(this.travelInfoForm)
      data.name = data.name.toUpperCase()
      this.$axios
        .post('/fn/reim/init/selectReimTripPerson', data, jsonHeaders)
        .then((res) => {
          this.travelInfoSelectStaffDialogTableVLoading = false
          const { code, data } = res.data
          if (code === 0) {
            this.travelInfoSelectStaffTable = data.list
            this.travelInfoForm.total = data.total
          }
        })
    },
    // 选择人员 SizeChange事件
    travelInfoTableSizeChange(size) {
      this.travelInfoForm.size = size.pageSize
      this.travelInfoForm.page = 1
      this.travelInfoFormQuery()
    },
    // 选择人员 pageChange事件
    travelInfoTableCurrentChange(page) {
      this.travelInfoForm.page = page.pageNum
      this.travelInfoFormQuery()
    },
    // 选择人员 dialog comfirm事件
    travelInfoSelectStaffComfirm() {
      const selection =
        this.$refs.travelInfoSelectStaffTableRef.$children[0].selection
      const newSelection = selection.map((item) => {
        const data = {
          planTicketNum: '',
          tripEndDate: '',
          tripPlace: '',
          tripPlaceCode: '',
          tripStartDate: '',
          tripPersonName: item.tripPersonName
        }
        data.tripPersons = []
        data.tripPersonNum = 1
        data.tripPersons.push(item)
        return data
      })
      this.travelInfoTable = [...this.travelInfoTable, ...newSelection]
      this.$refs.travelInfoSelectStaffTableRef.$children[0].clearSelection()
      this.travelInfoSelectStaffVisible = false
    },
    // 获取城市信息
    getCityOptions() {
      return new Promise((resolve, reject) => {
        this.$axios.post('/fn/reim/init/selectReimCity').then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.cityOptions = data
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    // 出差信息 删除事件
    delTravelInfoOneItem() {
      const selection = this.$refs.travelInfoTableRef.selection
      this.travelInfoTable = this.travelInfoTable.filter(
        (v) => !selection.includes(v)
      )
    },
    // 差旅信息复制事件
    handleTravelInfoTableCopy(row) {
      this.travelInfoTable.push(CopyObj(row))
    },
    // 出差信息 出差地点 级联选择框 change事件
    handleCityChange() {},
    // 添加附件 file表单 change事件
    addEnclosureFileChange($event) {
      const files = $event.target.files
      Array.from(files).forEach((file, i) => {
        if (file) {
          if (file.size > 10 * 1024 * 1024) {
            this.$message('文件不能大于10M')
            return false
          }
          const extname = '.' + file.name.split('.').slice(-1)[0]
          const accept =
            '.xls,.doc,.htm,.ppt,.mht,.msg,.rar,.zip,.txt,.html,.docx,.xlsx,.pptx,.pdf,.png,.gif,.jpg'
          const extList = accept.split(',')
          if (!extList.includes(extname)) {
            this.$message.warning('文件类型错误')
            return false
          }
          this.addEnclosureFileList.splice(i, 0, file)
        }
      })

      this.inputShow = false
    },
    // 添加附件 dialog 确定事件
    addEnclosureComfirm() {
      if (!this.addEnclosureFileList.length) {
        this.addEnclosureVisible = false
        return
      }
      const data = new FormData()
      data.append('module', 'reim_init')
      data.append('submodule', 'attach')
      data.append('busiId', this.classesInfo.reimId || '')
      data.append('isSave', 'N')
      data.append('isReplace', 'N')
      this.addEnclosureFileList.forEach((file) => {
        data.append('files', file)
      })
      this.$axios
        .post('/common/file/uploadNewFile', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => {
              v.createdDate = v.createdDate.split('T')[0]
              this.enclosureTable.push(v)
            })
          }
        })
      this.addEnclosureVisible = false
    },
    // 附件信息删除 函数
    delEnclosureOneItem() {
      const selection = this.$refs.enclosureTableRef.$children[0].selection
      const udmpIds = selection.map((v) => v.udmpId)
      fetchDelFileByUdmpids({ udmpIds, busiId: this.classesInfo.reimId || '' }).then(res => {
        this.enclosureTable = this.enclosureTable.filter(
          (v) => !selection.includes(v)
        )
      })
    },
    // 上传电子发票 file表单 change事件
    uploadElectronicsInvoiceFileInputChange($event) {
      const file = $event.target.files[0]
      if (file) {
        const extname = file.name.split('.').slice(-1)[0]
        if (!['pdf', 'ofd'].includes(extname.toLowerCase())) {
          this.$message('电子发票只能上传pdf,ofd格式')
          return false
        }
        this.uploadElectronicsInvoiceFileList.push(file)
      }
    },
    // 上传电子发票  dialog 确定事件
    uploadElectronicsInvoiceComfirm() {
      if (!this.uploadElectronicsInvoiceFileList.length) {
        this.uploadElectronicsInvoice = false
        return
      }
      const data = new FormData()
      data.append('module', 'reim_init')
      data.append('submodule', 'e_invoice')
      data.append('busiId', this.classesInfo.reimId || '')
      data.append('isSave', 'N')
      data.append('isReplace', 'N')
      this.uploadElectronicsInvoiceFileList.forEach((file) => {
        data.append('files', file)
      })
      this.$axios
        .post('/common/file/uploadNewFile', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => {
              v.createdDate = v.createdDate.split('T')[0]
              this.enclosureTable.push(v)
            })
          }
        })
      this.uploadElectronicsInvoice = false
    },
    // 发起报销
    launchReimbursement() {
      this.isDisabled = true
      const data = {}
      if (this.contractCodeEditTable.length) {
        data.contracts = CopyObj(this.contractCodeEditTable)
        data.contracts.forEach((v, i) => (v.serialNo = i))
      }

      if (this.costInfoTable.length) {
        data.details = CopyObj(this.costInfoTable.slice(0, -1))
        const amtValidate = data.details.some((v) => !v.amt)
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
          v.classBudgetAmt = v.budgetAmt
          if (v.relationTicketViceTable) {
            v.invoices = v.relationTicketViceTable
            v.invoices.forEach((invoice, index) => {
              invoice.invoiceContent = ''
              invoice.reimBranchId = ''
              invoice.reimId = ''
              invoice.serialNo = index
            })
          }
          if (
            v.relationTravelOrderViceTable &&
            v.relationTravelOrderViceTable.length > 0
          ) {
            v.caikuOrder = v.relationTravelOrderViceTable.slice(-1)[0]
          }
          if (v.amt) {
            if (v.invoices.length) {
              v.excludingTaxAmt = myRound(
                (v.amt * (100 - v.invoices[0].taxRate)) / 100,
                2
              )
            } else {
              v.excludingTaxAmt = myRound((v.amt * (100 - v.tax)) / 100, 2)
            }
            v.taxAmt = myRound(v.amt - v.excludingTaxAmt, 2) + ''
            v.excludingTaxAmt = v.excludingTaxAmt + ''
          }
          v.reimId = ''
          v.reimBranchId = i + ''

          // 报销行分摊费用校验
        })
      } else {
        this.messagebox('不能缺少明细信息')
        this.isDisabled = false
        return
      }

      const reimDuePayAmt =
        this.costBudgetAmtTotal -
        this.accountsTotalPrice -
        this.writeOffTotalPrice

      // if (this.currentUsedMoney > reimDuePayAmt) {
      //     return this.messagebox(
      //         "关联立项本次付款金额总计不可大于需支付金额与挂账金额之和！"
      //     );
      // }

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
        ].forEach((v) => {
          data.primary[v] = this.classesInfo.row[v]
        })
        data.primary.reimTotalAmt = this.costBudgetAmtTotal || 0
        data.primary.reimDuePayAmt = reimDuePayAmt + ''
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

      const payeeInfoTable = this.payeeInfoTable.filter((v) => v.supplierCode)

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
        })
        data.primary.supplierAcctOpenName =
          data.primary.reimSupplier.acctOpenName
        data.primary.supplierId = data.primary.reimSupplier.ofSupplierId
      } else {
        this.messagebox('不能缺少供应商收款人信息')
        this.isDisabled = false
        return
      }

      if (this.payeePaymentMoney != reimDuePayAmt) {
        this.messagebox(
          '报账明细总计金额不能为0，且减去“挂账金额”再减去“核销金额”需与“需支付金额”一致！'
        )
        this.isDisabled = false
        return
      }

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

      if (this.writeOffInfoTable) {
        const dict = {
          1: '预付款',
          2: '挂账'
        }
        data.cancels = CopyObj(this.writeOffInfoTable)
        data.cancels.forEach((v) => {
          v.cancelTypeDesc = dict[v.cancelType]
          v.serialNo || (v.serialNo = '')
        })
        const flag = data.cancels.some((v) => {
          return !v.thisTimeCancelAmt
        })
        if (flag) {
          this.messagebox('必须填写本次核销金额')
          this.isDisabled = false
          return
        }
      }

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

        data.suspends.forEach((v) => {
          v.costCenterCode = data.primary.costCenterCode
          v.costCenterName = data.primary.costCenterName
          v.profitCenterCode = data.primary.manageCenterCode
          v.profitCenterDesc = data.primary.manageCenterDesc
        })
      }

      if (this.travelInfoTable) {
        data.trips = CopyObj(this.travelInfoTable)
        const flag1 = data.trips.some((v) => {
          return !v.planTicketNum
        })
        if (flag1) {
          this.messagebox('必须填写机票张数')
          this.isDisabled = false
          return
        }
        const flag2 = data.trips.some((v) => {
          return !v.otherTrafficNum
        })
        if (flag2) {
          this.messagebox('必须填写其他交通票数')
          this.isDisabled = false
          return
        }
        const flag3 = data.trips.some((v) => {
          return !v.tripStartDate
        })
        if (flag3) {
          this.messagebox('必须选择出差开始日期')
          this.isDisabled = false
          return
        }
        const flag4 = data.trips.some((v) => {
          return !v.tripEndDate
        })
        if (flag4) {
          this.messagebox('必须选择出差结束日期')
          this.isDisabled = false
          return
        }
        const flag5 = data.trips.some((v) => {
          return !v.tripPlace[1]
        })
        if (flag5) {
          this.messagebox('必须选择出差地点')
          this.isDisabled = false
          return
        }
        data.trips.forEach((v) => {
          const { tripPersonName, tripPersonUm, blgStripLine, blgDept } = v
          ;[v.tripPlaceCode, v.tripPlace] = v.tripPlace[1].split('_')
        })
      }

      if (this.classesInfo.reimId) {
        data.primary.reimId = this.classesInfo.reimId
      }
      // const caikuOrder = data.details
      //     .map(v => v.caikuOrder)
      //     .filter(v => v && v.caikuOrderId);
      // const trips = data.trips;
      // if (caikuOrder.length > 0) {
      //     // 查找重复项
      //     const repetition = [];
      //     const caikuOrderId = caikuOrder.map(v => v.caikuOrderId);
      //     caikuOrderId.forEach(v => {
      //         if (
      //             caikuOrderId.indexOf(v) !== caikuOrderId.lastIndexOf(v)
      //         ) {
      //             repetition.push(v);
      //         }
      //     });
      //     if (repetition.length > 0) {
      //         let errorContent = "";
      //         repetition.forEach(v => {
      //             errorContent += `<p>${v.caikuOrderId}</p>`;
      //         });
      //         this.$alert(
      //             `<p>差旅订单重复关联</p>${errorContent}`,
      //             "提示",
      //             {
      //                 confirmButtonText: "知道了",
      //                 customClass: "file-import-error",
      //                 dangerouslyUseHTMLString: true
      //             }
      //         );
      //         this.isDisabled = false;
      //         return;
      //     }
      //     const flag = caikuOrder.every(item => {
      //         let personStatus = false,
      //             timeStatus = false;
      //         trips.some(v => {
      //             if (v.tripPersonName === item.tripName) {
      //                 personStatus = true;
      //                 const startTime = item.startTime.split(" ")[0];
      //                 const endTime = item.endTime.split(" ")[0];
      //                 if (
      //                     startTime === v.tripStartDate &&
      //                     endTime === v.tripEndDate
      //                 ) {
      //                     timeStatus = true;
      //                 }
      //             }
      //             return personStatus && timeStatus;
      //         });
      //         if (!personStatus) {
      //             this.messagebox("出差人和差旅信息不一致");
      //             this.isDisabled = false;
      //             return false;
      //         }
      //         if (!timeStatus) {
      //             this.messagebox("差旅订单时间与出差时间不一致");
      //             this.isDisabled = false;
      //             return false;
      //         }
      //         return true;
      //     });
      //     if (!flag) return;
      // }

      // 判断费用信息是否含有 机票-不含民航发展基金 火车票 差旅-住宿费
      if (this.isValidateTrips && data.details) {
        const tripsFlag = data.details.some(
          (v) =>
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

      this.$axios
        .post('/fn/reim/init/insertReim', data, jsonHeaders)
        .then((res) => {
          const { code, msg, data } = res.data
          if (code === 0) {
            this.$message.success('报销成功')
            this.classesInfo.reimId = data.t
            closeCurrPageAndGoPath('/MyReimbursement')
          } else {
            this.$message.error(`报销失败 ${msg}`)
            this.isDisabled = false
            if (code == 20002) {
              this.classesInfo.reimId = data
            }
          }
        })
    },
    // 本页面的数据格式 转化为 符合 提交接口的 数据格式
    localDataToServeDate(data) {},
    // 将查询得到的订单数据，转化符合本页面的数据格式
    serveDateToLocalData(data) {
      if (data.attaches) {
        this.enclosureTable = data.attaches
      }
      if (data.cancels) {
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
        data.trips.forEach((item) => {
          item.tripPersonName = item.tripPersons[0].tripPersonName
        })
        this.travelInfoTable = data.trips
      }
    },
    // 清空本页面的数据
    clearCurrentData() {
      this.enclosureTable = []
      this.writeOffInfoTable = []
      this.costInfoTable = []
      this.payeeInfoTable = []
      this.contractCodeEditTable = []
      this.accountsInfoTable = []
      this.travelInfoTable = []
    },
    // 修改或新增报销信息的提交事件
    handleSubmit() {
      if (this.action === 'add' || this.action === 'edit') {
        this.launchReimbursement()
      } else {
        this.$router.back()
      }
    },
    // 保存报销订单
    handleSave(notShow) {
      const data = {}
      if (this.contractCodeEditTable.length) {
        data.contracts = CopyObj(this.contractCodeEditTable)
        data.contracts.forEach((v, i) => (v.serialNo = i))
      }

      if (this.costInfoTable.length) {
        data.details = CopyObj(this.costInfoTable.slice(0, -1))
        data.details.forEach((v, i) => {
          v.classBudgetAmt = v.budgetAmt
          if (v.relationTicketViceTable) {
            v.invoices = v.relationTicketViceTable
            v.invoices.forEach((invoice, index) => {
              invoice.invoiceContent = ''
              invoice.reimBranchId = ''
              invoice.reimId = ''
              invoice.serialNo = index
            })
          }
          if (
            v.relationTravelOrderViceTable &&
            v.relationTravelOrderViceTable.length > 0
          ) {
            v.caikuOrder = v.relationTravelOrderViceTable.slice(-1)[0]
          }
          if (v.amt) {
            if (v.invoices.length) {
              v.excludingTaxAmt = myRound(
                (v.amt * (100 - v.invoices[0].taxRate)) / 100,
                2
              )
            } else {
              v.excludingTaxAmt = myRound((v.amt * (100 - v.tax)) / 100, 2)
            }
            v.taxAmt = myRound(v.amt - v.excludingTaxAmt, 2) + ''
            v.excludingTaxAmt = v.excludingTaxAmt + ''
          }
          v.reimId = ''
          v.reimBranchId = i + ''
        })
      }

      const reimDuePayAmt =
        this.costBudgetAmtTotal -
        this.accountsTotalPrice -
        this.writeOffTotalPrice

      if (this.classesInfo.classId) {
        data.primary = CopyObj(this.classesInfo)
        data.primary.operate = '01'
        if (data.primary.action === 'edit') {
          data.primary.operate = '02'
        }
        data.primary.reimIdFas || (data.primary.reimIdFas = '')
        data.primary.reimOper = 'submit'
        ;[
          'classId',
          'className',
          'classAdviser',
          'classAdviserName',
          'reimDept',
          'reimId'
        ].forEach((v) => {
          data.primary[v] = this.classesInfo.row[v] || ''
        })
        data.primary.reimTotalAmt = this.costBudgetAmtTotal || 0
        data.primary.reimDuePayAmt = reimDuePayAmt + ''
        data.primary.suspendAmt = this.accountsTotalPrice + ''
        data.primary.cnclAmt = this.writeOffTotalPrice + ''

        data.primary.ifShare =
          this.classesInfo.row.ifShare || this.classesInfo.row.expenseType
      }

      const payeeInfoTable = this.payeeInfoTable.filter((v) => v.supplierCode)

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
        })
        data.primary.supplierAcctOpenName =
          data.primary.reimSupplier.acctOpenName
        data.primary.supplierId = data.primary.reimSupplier.ofSupplierId
      }

      if (this.enclosureTable) {
        data.attaches = CopyObj(this.enclosureTable)
        data.attaches.forEach((v) => {
          v.createdDate = v.createdDate.split('T')[0]
          delete v.updatedDate
        })
      }

      if (this.writeOffInfoTable) {
        const dict = {
          1: '预付款',
          2: '挂账'
        }
        data.cancels = CopyObj(this.writeOffInfoTable)
        data.cancels.forEach((v) => {
          v.cancelTypeDesc = dict[v.cancelType]
          v.serialNo || (v.serialNo = '')
        })
      }

      if (this.accountsInfoTable) {
        data.suspends = CopyObj(this.accountsInfoTable)
        data.suspends.forEach((v) => {
          v.costCenterCode = data.primary.costCenterCode
          v.costCenterName = data.primary.costCenterName
          v.profitCenterCode = data.primary.manageCenterCode
          v.profitCenterDesc = data.primary.manageCenterDesc
        })
      }

      if (this.travelInfoTable) {
        data.trips = CopyObj(this.travelInfoTable)
        data.trips.forEach((v) => {
          const { tripPersonName, tripPersonUm, blgStripLine, blgDept } = v
          if (v.tripPlace && v.tripPlace[1]) {
            ;[v.tripPlaceCode, v.tripPlace] = v.tripPlace[1].split('_')
          } else {
            v.tripPlace = ''
          }
        })
      }
      if (this.classesInfo.reimId) {
        data.primary.reimId = this.classesInfo.reimId
      }
      if (this.saveDisabled) return
      this.saveDisabled = true
      this.$axios
        .post('/fn/reim/init/insertReimForSave', data, jsonHeaders)
        .then((res) => {
          const { code, msg, data } = res.data
          if (code === 0) {
            if (notShow !== true) {
              this.$message.success('保存成功')
            }
            this.classesInfo.reimId = data.t
          }
          //  else {
          //     if (notShow !== true) {
          //         hintFrame(`${msg}`);
          //     }
          // }
        })
        .finally(() => {
          this.saveDisabled = false
        })
    },
    // 处理时间显示
    handleTime(createdDate) {
      if (createdDate.indexOf('T') > 0) {
        return createdDate.split('T')[0]
      } else {
        return createdDate.split(' ')[0]
      }
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
    //  解决嵌套弹窗的工具函数 之 dialog 关闭后的处理
    handleNestingPopupAfterClose(ref) {
      const parentNode = this.$refs[ref].$el
      const child = parentNode.querySelector('.v-modal')
      if (child) {
        parentNode.removeChild(child)
      }
    },
    // messsage 弹窗工具函数
    messagebox(content) {
      this.$alert(content, '通知', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout autoHeight`
      })
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
        let flag = v.tax == 0 && !(v.relationTicketViceTable || []).length
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
    // 限制开始日期不能小于结束日期
    startDisabledDate(row, time) {
      if (row.tripEndDate) {
        return !(formatDate(time) <= row.tripEndDate)
      }
      return false
    },
    // 限制结束日期不能小于开始日期
    endDisabledDate(row, time) {
      if (row.tripStartDate) {
        return !(formatDate(time) >= row.tripStartDate)
      }
      return false
    },
    getParentNode() {},
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
    // 打开上传文件框的公共函数
    openUpload(id) {
      this.inputShow = true
      this.$nextTick(() => {
        document.getElementById(id).click()
      })
    },
    // 根据城市 查找编号
    getCitySiteNo(name) {
      let data = []
      this.cityOptions.forEach((province) => {
        province.children.forEach((city) => {
          if (city.siteName === name && data.length === 0) {
            data.push(province.siteNo)
            data.push(city.siteNo)
          }
        })
      })
      return data
    },
    handleCostTotal(arr) {
      if (!arr || !arr.length) return
      const item = arr.slice(-1)[0]
      if (!item.type) return
      Object.keys(item).forEach((key) => {
        if (key === 'type') return
        item[key] = this[key]
      })
    },
    // 根据传入的数据添加费用信息 和 差旅信息
    addCost(results) {
      // const { details, students } = results;
      // details.forEach(v => {
      //     const newV = CopyObj(v);
      //     newV.relationTicketViceTable = [];
      //     const len = this.costInfoTable.length;
      //     this.costInfoTable.splice(len - 1, 0, newV);
      // });
      // const newSelection = students.map(item => {
      //     item.tripPersonName = item.studentName;
      //     item.tripPersonUm = item.umId;
      //     // item.blgStripLine = item.studentName;
      //     // item.blgDept = item.studentName;
      //     const data = {
      //         planTicketNum: "",
      //         tripEndDate: "",
      //         tripPlace: "",
      //         tripPlaceCode: "",
      //         tripStartDate: "",
      //         tripPersonName: item.tripPersonName
      //     };
      //     data.tripPersons = [];
      //     data.tripPersonNum = 1;
      //     data.tripPersons.push(item);
      //     return data;
      // });
      // this.travelInfoTable = [...this.travelInfoTable, ...newSelection];
    },
    // 定时保存任务
    createSaveTimer() {
      this.saveTimer = setTimeout(() => {
        this.handleSave(true)
        this.createSaveTimer()
      }, 300000)
    },
    // 差旅订单文件change事件
    travelInfoImportChange($event) {
      const file = $event.target.files[0]
      // 删除文件
      if (!file?.name) {
        this.travelInfoImportData = {}
      } else {
        //新增文件
        const data = new FormData()
        data.append('file', file)
        this.$axios
          .post('/common/reim/uploadTripInfoList', data, dataHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (parseInt(code) === 0) {
              this.travelInfoImportData = data
            }
          })
      }
    },
    // 差旅批量导入确认事件
    travelInfoImportComfirm() {
      const sucessList = this.travelInfoImportData.sucessList || []
      if (sucessList.length) {
        sucessList.forEach((v) => {
          const { blgDept, blgStripLine, tripPersonName, tripPersonUm } = v
          v.tripPersons = [
            { blgDept, blgStripLine, tripPersonName, tripPersonUm }
          ]
          v.tripPlace = this.getCitySiteNo(v.tripPlace)
          v.tripPersonNum = 1
        })
        this.travelInfoTable.push(...sucessList)
      }
      this.travelInfoImport = false
    },
    // 差旅批量导入关闭事件
    travelInfoImportClose() {
      this.travelInfoImportData = {}
      this.travelInfoImport = false
    },
    // 打开费用分摊
    openApportionConst(row) {
      if (row.amt === '') return this.$message.warning('请先填写本次报销金额')
      this.apportionConstObj = row
      if (row.splitInfo?.length) {
        this.apportionConstListBack = CopyObj(row.splitInfo)
      }
      this.apportionConstVisible = true
    },
    addApportionConst() {
      if (this.apportionConstListBack.length >= 20) {
        return this.$message.warning(
          '最多允许手工新增二十条，若查过二十条，请通过导入方式进行添加！'
        )
      }
      this.apportionConstListBack.push({
        manageCenterCode: '',
        manageCenterDesc: '',
        costCenterCode: '',
        costCenterName: '',
        totalPriceTax: '',
        excludingTaxAmt: '',
        tax: ''
      })
    },
    delApportionConst() {
      const selection = this.$refs.apportionConstRef.$refs.gcTable.selection
      if (!selection?.length) {
        return
      }
      this.apportionConstListBack = this.apportionConstListBack.filter(
        (v) => !selection.includes(v)
      )
    },
    // 打开成本中心
    openCostCenter(row) {
      this.apportionConstItem = row
      this.handleCostCenterVisible()
    },
    // dialog确认事件
    apportionConstComfirm() {
      if (!this.apportionConstListBack.length) {
        return
      }
      const flag = this.apportionConstListBack.some((v, i) => {
        if (!v.costCenterName) {
          this.$message.warning(`第${i + 1}条成本中心未选择`)
          return true
        }
        if (v.totalPriceTax === '') {
          this.$message.warning(`第${i + 1}条含税金额不能为空`)
          return true
        }
        if (v.excludingTaxAmt === '') {
          this.$message.warning(`第${i + 1}条不含税金额不能为空`)
          return true
        }
      })
      if (flag) return
      if (
        +this.apportionConstObj.amt !==
        sum(this.apportionConstListBack.map((v) => +v.totalPriceTax))
      ) {
        this.$message.warning('含税金额总计需与报销行的本次报销金额一致')
        return
      }
      this.apportionConstObj.splitInfo = this.apportionConstListBack
      this.apportionConstVisible = false
    },
    apportionConstClose() {
      this.apportionConstListBack = []
      this.apportionConstObj = {}
      this.apportionConstItem = {}
      this.apportionConstForm.total = 0
      this.apportionConstForm.currPage = 1
      this.apportionConstForm.pageSize = 10
      this.apportionConstVisible = false
    },
    apportionConstChange($event) {
      const file = $event.target.files[0]
      const data = new FormData()
      data.append('file', file)
      data.append('orgSegment', this.classesInfo.orgSegment)
      this.$axios
        .post(
          '/common/reim/uploadReimExpenseDivideDetailList',
          data,
          dataHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (parseInt(code) === 0) {
            const { sucessList, errorMsg } = data
            if (errorMsg) {
              hintFrame(errorMsg)
            } else {
              this.apportionConstListBack.push(...sucessList)
            }
          }
        })
    },
    // 费用分摊导出
    exportApportionConst() {
      const { reimBranchId } = this.apportionConstObj
      const data = { reimBranchId }
      this.$axios
        .post(
          '/fn/reim/self/exportReimExpenseDivideDetail',
          { data },
          downHeaders
        )
        .then(handleDownload)
    },
    // 科目参考dialog 确认事件
    subjectComfirm() {
      const selection = this.$refs.subjectRef.getSelection()
      if (selection.length) {
        const item = selection[0]
        if ('deductionFlag' in this.subjectRow) {
          this.$set(this.subjectRow, 'budgetProjectCode', item.assistCode)
          this.$set(this.subjectRow, 'budgetProjectName', item.assistDesc)
        } else {
          this.$set(this.subjectRow, 'subjectProject', item.assistCode)
          this.$set(this.subjectRow, 'subjectProjectDesc', item.assistDesc)
        }
      }
      this.subjectVisible = false
    },
    // 科目参考dialog 关闭事件
    subjectClose() {
      this.subjectQueryForm.item = ''
      this.subjectQueryForm.currPage = 1
      this.subjectQueryForm.pageSize = 5
      this.subjectQueryForm.total = 0
      this.subjectTableList = []
      this.subjectVisible = false
    },
    // 科目参考 查询和翻页函数
    subjectGetList() {
      this.$axios
        .post(
          '/fn/reim/init/selectReimAssist',
          this.subjectQueryForm,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.subjectQueryForm.total = total
            this.subjectTableList = list
          }
        })
    },
    // 判断会计科目是否以105开头
    estimateHead(code) {
      if (code == null) return false
      return /^105/.test(code)
    },
    // 项目，产品，订单号公共dialog 查询函数
    productGetList() {
      const data = CopyObj(this.productQueryForm)
      data.type = this.productObj.type
      this.$axios
        .post('/fn/reim/init/selectReimAssist', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.productQueryForm.total = total
            this.productObj.tableList = list
          }
        })
    },
    // 打开 项目，产品，订单号公共dialog
    openProductDialog(type, row) {
      this.productObj = this.allProductObj[type]
      this.productObj.row = row
      this.productVisible = true
    },
    productComfirm() {
      const item = this.$refs.productRef.getSelection()[0]
      if (item) {
        let page
        if ('deductionFlag' in this.productObj.row) {
          page = this.productObj.reim
        } else {
          page = this.productObj.account
        }
        this.$set(this.productObj.row, page.value, item.assistCode)
        this.$set(this.productObj.row, page.label, item.assistDesc)
      }
      this.productVisible = false
    },
    productClose() {
      this.productObj.tableList = []
      resetObj(this.productQueryForm, { currPage: 1, pageSize: 5, total: 0 })
      this.productVisible = false
    }
  },
  mounted() {
    const params = this.$route.params
    const { empName, deptName, deptno, umId, orgId } =
      this.$store.state.userInfo

    if (params.action === 'edit') {
      // params.primary.operUm = umId;
      // params.primary.operName = empName;
      // params.primary.orgId = orgId;
      // params.primary.operOrgCode = deptno;
      // params.primary.operOrgName = deptName;
      params.primary.row = params.row
      this.serveDateToLocalData(params)
      this.costAddSummary()
    } else {
      params.operUm = umId
      params.operName = empName
      params.orgId = orgId
      params.operOrgCode = deptno
      params.operOrgName = deptName
      if (params.classId) {
        params.expenseDetails.forEach((v) => (v.checked = false))
        params.expenseDetails.push(...this.currentReimbursementMoneyTable)
      }
      params.row || (params.row = {})
      this.classesInfo = params
      this.costAddSummary()
      this.addCost(params.results)
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
      [225, 113, 138, 225, 153, 139, 126],
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
    // 获取城市信息
    this.getCityOptions().then((res) => {
      if (params.action === 'edit') {
        params.trips.forEach((v) => {
          v.tripPlace = this.getCitySiteNo(v.tripPlace)
        })
      }
    })
    this.currentUsedMoney =
      this.costBudgetAmtTotal -
      this.accountsTotalPrice -
      this.writeOffTotalPrice +
      ''
    this.isMounted = true
    // 添加定时保存
    this.createSaveTimer()
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
      //let sum = 0;
      //const newCostInfoTable = [];
      //this.costInfoTable.forEach(v => {
      //   if (
      //       !newCostInfoTable
      //           .map(val => val["feeMinCategoryDesc"])
      //           .includes(v["feeMinCategoryDesc"])
      //  ) {
      //       sum +=
      //           (v.budgetAmt - (v.payedAmt || 0) - (v.occupyAmt || 0)) *
      //            100;
      //   }
      //});
      // sum = sum / 100;
      // return this.roundTwo(sum);
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
    // 费用信息 专票 不含税金额
    // costZNoTaxRateTotal() {
    //     return this.costNoTaxRateTotalCommon(true);
    // },
    // // 费用信息 普票 不含税金额
    // costPNoTaxRateTotal() {
    //     return this.costNoTaxRateTotalCommon();
    // },
    // // 费用信息 不含税金额
    // costPayedAmtTotal() {
    //     let sum =
    //         ((this.costZNoTaxRateTotal || 0) * 100 +
    //             (this.costPNoTaxRateTotal || 0) * 100) /
    //         100;
    //     return this.judgeFloat(sum) ? Math.round(sum, 2) : sum.toFixed(2);
    // },
    // // 费用信息 专票 税额
    // costZBudgetAmt() {
    //     const sum =
    //         ((this.costZAmtTotal || 0) * 100 -
    //             (this.costZNoTaxRateTotal || 0) * 100) /
    //         100;
    //     return sum.toFixed(2);
    // },
    // // 费用信息 普票 税额
    // costPTaxTotal() {
    //     const sum =
    //         ((this.costPAmtTotal || 0) * 100 -
    //             (this.costPNoTaxRateTotal || 0) * 100) /
    //         100;
    //     return sum.toFixed(2);
    // },
    // // 费用信息 税额
    // costCanReimbursementMoneyTotal() {
    //     const sum =
    //         ((this.costBudgetAmtTotal || 0) * 100 -
    //             (this.costPayedAmtTotal || 0) * 100) /
    //         100;
    //     return sum.toFixed(2);
    // },

    // 收款人信息 支付金额
    payeePaymentMoney() {
      let sum = 0
      this.payeeInfoTable.forEach((v) => {
        sum += Number.parseFloat(v.payAmt) || 0
      })
      return myFloat(sum)
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
      let sum = 0
      this.travelInfoTable.forEach((v) => {
        sum += Number.parseInt(v.tripPersonNum) || 0
      })
      return sum
    },
    apportionConstList() {
      const list = localPaging(
        this.apportionConstListBack,
        this.apportionConstForm
      )
      return list
    }
  },
  watch: {
    costInfoTable(n) {
      this.handleCostTotal(n)
    },
    costBudgetAmtTotal() {
      setTimeout(() => {
        this.handleCostTotal(this.costInfoTable)
      }, 100)
    }
  },
  activated() {
    if (this.isMounted) {
      this.isMounted = false
      return
    }
    // 获取城市信息
    this.getCityOptions().then((res) => {
      if (params.action === 'edit') {
        params.trips.forEach((v) => {
          v.tripPlace = this.getCitySiteNo(v.tripPlace)
        })
      }
    })
    const params = this.$route.params
    const { empName, deptName, deptno, umId, orgId } =
      this.$store.state.userInfo
    this.saveDisabled = false
    this.isDisabled = false

    if (params.action === 'edit') {
      // params.primary.operUm = umId;
      // params.primary.operName = empName;
      // params.primary.orgId = orgId;
      // params.primary.operOrgCode = deptno;
      // params.primary.operOrgName = deptName;
      params.primary.row = params.row
      this.serveDateToLocalData(params)
      this.costAddSummary()
    } else if (params.action === 'add') {
      params.operUm = umId
      params.operName = empName
      params.orgId = orgId
      params.operOrgCode = deptno
      params.operOrgName = deptName
      if (params.classId) {
        params.expenseDetails.forEach((v) => (v.checked = false))
        params.expenseDetails.push(...this.currentReimbursementMoneyTable)
      }
      params.row || (params.row = {})
      this.classesInfo = params
      this.clearCurrentData()
      this.costAddSummary()
      this.addCost(params.results)
    }
    this.currentUsedMoney =
      this.costBudgetAmtTotal -
      this.accountsTotalPrice -
      this.writeOffTotalPrice +
      ''
    // 添加定时保存
    this.createSaveTimer()
    // 重置是否需要校验差旅信息
    if (params.action) {
      this.isValidateTrips = true
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

<style lang="scss">
.LaunchTrainingCourse {
  height: max-content;
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

    &__right {
      float: right;
      &__query {
        border-color: #fd6720;
        span {
          color: #fd6720 !important;
        }
      }
      .el-button {
        height: 30px;
        width: 80px;
        margin-left: 20px;
        padding-top: 6px;
        padding-bottom: 6px;
        font-size: 12px;
      }
    }

    &.ie {
      position: fixed;
      width: calc(100% - 97px);
      left: 65px;
    }
  }
  &__info-card {
    margin-top: 10px;
    transition-duration: 0;

    &__base-info {
      &__contract-code {
        &__item {
          .el-form-item__content {
            width: 100%;
            .el-input {
              width: calc(100% - 92px - (50% - 350px) / 2) !important;
            }
          }
        }
        input {
          padding-right: 55px !important;
        }
      }
      &__right-item {
        display: inline-block !important;
        .el-form-item__content {
          float: right;
          margin-right: 10px;
        }
      }

      .el-form {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;
        margin-bottom: 0;
        .el-input {
          width: 250px;
          color: rgba($color: #000000, $alpha: 0.4);
        }
        .empty {
          width: 300px;
        }

        .el-form-item {
          width: calc((100% - 1px) / 3);
          margin-right: 0;
          .label {
            width: 82px;
          }
          &:nth-child(3n - 1) {
            display: flex;
            justify-content: center;
          }
          &:nth-child(3n) {
            .el-form-item__content {
              float: right;
              margin-right: 10px;
            }
          }
          &.textarea {
            display: flex;
            height: 100px;
            width: 100%;

            .el-form-item__label {
              position: relative;
              right: 10px;
              width: 82px;
              padding: 0;
              flex-shrink: 0;
            }
            .el-form-item__content {
              flex: 1;
              margin-right: 10px;
              textarea {
                height: 100px;
                padding: 5px 10px;
                font-size: 12px;
                color: rgba($color: #000000, $alpha: 0.4);
                border-radius: 2px;
              }

              .el-input__count {
                bottom: 5px;
                right: 15px;
                line-height: 18px;
                color: rgba($color: #000000, $alpha: 0.4);
              }
            }
          }
        }
      }
    }

    &__item-content {
      margin-left: 19px;
      margin-top: 20px;
    }

    &__reimbursement {
      &__cost,
      &__payee,
      &__accounts,
      &__travel,
      &__write-off {
        &__content {
          margin-bottom: 29px;
          &__const-operation {
            .cell {
              display: flex;
              span {
                display: inline-block;
              }
            }

            .active {
              color: #fd6720;
              cursor: pointer;
              &__num {
                position: relative;
                display: inline-block;
                min-width: 13px;
                height: 13px;
                left: -5px;
                top: -6px;
                border-radius: 50%;
                background-color: #f56c6c;
                color: #ffffff;
                line-height: 14px;
                text-align: center;
              }
            }
            .cell {
              overflow: visible;
            }
          }
          &__special-ticket,
          &__universal-ticket,
          &__total {
            &__project-approval {
              width: calc(109px + 100% / 1477 * 109 - 1591px / 1477 * 109);
              margin-left: 345px;
            }
            &__paid {
              width: calc(110px + 100% / 1477 * 110 - 1591px / 1477 * 110);
            }
            &__occupied {
              width: calc(110px + 100% / 1477 * 110 - 1591px / 1477 * 110);
            }
            &__can-reimbursement {
              width: calc(122px + 100% / 1477 * 122 - 1591px / 1477 * 122);
            }

            & > div:nth-child(n + 1) {
              padding: 0 10px 0 15px;
            }
          }
        }
      }
      &__payee__content {
        &__total__price {
          margin-left: 991px;
        }
        &__search {
          input {
            padding-right: 25px !important;
          }
        }
      }
      &__accounts__content {
        .width-fit {
          min-width: 1888px;
        }
        &__total__price {
          margin-left: 460px;
        }
      }
      &__write-off__content {
        &__total__price {
          margin-left: 1225px;
        }
      }
      &__travel__content {
        &__total__price {
          margin-left: 400px;
        }
      }
      &__approval-record,
      &__consultation-record {
        margin-bottom: 30px;
      }

      .el-tabs {
        margin-top: 19px;
        margin-left: 19px;
        border: 1px solid #eaecf1;

        .el-tabs__content {
          padding: 0 20px;
        }
        .gc-input .label {
          width: 0;
        }
      }
    }

    &__travel-orders {
      &__airfare,
      &__train,
      &__car {
        &__content {
          overflow-x: auto;
          overflow-y: hidden;
        }
      }
      tbody > tr:last-child {
        border-bottom: 0 !important;
      }
    }
  }
  &__cost-center,
  &__contract-search {
    .first-item {
      margin-right: 50px;
    }
    &__btns {
      float: right;
      .el-button {
        width: 60px;
        height: 26px;
        margin-top: 2px;
        padding: 5px 15px;
        font-size: 12px;
        font-family: 'PingFangSC-Regular', 'Roboto-Regular', 'PingFang SC',
          'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;

        &.reset-btn {
          margin-left: 15px;
          background-color: #36486b;
          border-color: #36486b;

          &:hover {
            background-color: #36486b !important;
            border-color: #36486b !important;
            box-shadow: 0 2px 5px 0 rgba($color: #000000, $alpha: 0.4);
          }

          span {
            color: #ffffff;
          }
        }
      }
    }
    .el-form {
      .gc-input {
        padding: 0;
        .label {
          width: auto;
          right: 0;
          font-size: 12px;
        }
        .el-input {
          width: 200px;
          left: 10px;
          font-size: 12px;
        }
      }
    }
  }

  &__cost-center,
  &__redio {
    thead tr th:first-child .cell label {
      display: none;
    }
  }

  &__add-enclosure,
  &__upload-electronics-invoice {
    &__title {
      position: relative;
      &__text {
        position: absolute;
        left: -68px;
        line-height: 26px;
      }
      &__btn {
        width: 90px;
        height: 26px;
        padding: 6px 8px;
        span {
          font-size: 12px;
        }

        &:hover i {
          background-image: url('../../assets/svg/hrx-upload-icon copy.svg');
        }
        &:hover span {
          color: #fd6720;
        }

        &__icon {
          position: relative;
          display: inline-block;
          width: 15px;
          height: 15px;
          bottom: 1px;
          background: url('../../assets/svg/hrx-upload-icon.svg') no-repeat
            center;
          vertical-align: middle;
        }
      }
    }

    &__format {
      margin-top: 13px;
      line-height: 18px;
    }

    &__items {
      &__item {
        display: flex;
        height: 20px;
        margin-top: 20px;
        align-items: center;

        &__icon {
          margin-right: 13px;
          width: 17px;
          height: 20px;
          vertical-align: middle;
          background: url('../../assets/svg/putongwendang.svg') no-repeat center;
        }
        &__filename {
          width: 200px;
          height: 18px;
          margin-right: 10px;
        }
        &__progress {
          flex: 1;
          margin-top: 2px;
        }
      }
    }

    .content {
      padding-left: 68px;

      .el-progress-bar__outer {
        height: 3px !important;
      }
      .el-icon-circle-close {
        color: #7d8292;
      }
      .el-progress-bar__inner {
        background-color: #fd6720;
      }
    }
  }

  &__common-dialog {
    &__title {
      display: flex;
      justify-content: space-between;
      &__left {
        &__first {
          margin-right: 50px !important;
        }
        .el-form-item {
          margin-bottom: 0;
        }
      }
      &__right {
        padding-top: 2px;
      }
    }
    &__content {
      margin-top: 20px;
    }
    &__vice-content {
      &__table {
        margin-top: 20px;
        margin-bottom: 0;
      }
    }
  }

  &__account-size-category-dialog {
    .el-table__empty-block::after {
      content: '\8be5\5927\5c0f\7c7b\4fe1\606f\6682\65e0\54a8\8be2\8bb0\5f55\ff01';
    }
  }

  // &__cost-type {
  //     th::before {
  //         display: none;
  //     }
  // }

  &__reimbursement-info {
    &__student {
      &__title {
        margin-top: 0 !important;
      }
      &__content {
        margin-top: 21px;
        border: 1px solid #eaecf1;
        &__select-all {
          height: 40px;
          padding-left: 19px;
          line-height: 40px;
          background-color: #f7f8fa;
        }

        &__items {
          display: flex;
          padding: 20px 20px 0 19px;

          &__item {
            width: calc(100% / 6);
            height: 17px;
            line-height: 17px;
            margin-bottom: 20px;
            text-align: center;

            &:nth-child(6n + 1) {
              text-align: left;
            }

            &:nth-child(6n) {
              text-align: right;
            }
          }
        }
      }
    }
    &__money {
      &__content {
        margin-top: 20px;
        th::before {
          display: none;
        }

        .el-table td {
          border-bottom: 1px solid #ebeef5 !important;
        }

        tbody tr:last-child {
          border-bottom: none;
        }
      }
    }
  }

  &__scan-image {
    &__title {
      display: flex;
      height: 20px;
      margin: 8px 0 25px;
      justify-content: space-between;
      i {
        width: 20px;
      }
      &__enlarge {
        background: url('../../assets/svg/fangda.svg') no-repeat center;
      }
      &__narrow {
        background: url('../../assets/svg/suoxiao.svg') no-repeat center;
      }
      &__refresh {
        background: url('../../assets/svg/zhongzhi.svg') no-repeat center;
      }
      &__prev {
        background: url('../../assets/svg/shunshizhenxuanzhuan.svg') no-repeat
          center;
      }
      &__next {
        background: url('../../assets/svg/nishizhenxuanzhuan.svg') no-repeat
          center;
      }
      &__level-flip {
        background: url('../../assets/svg/shuipingfanzhuan.svg') no-repeat
          center;
      }
      &__vertical-flip {
        background: url('../../assets/svg/chuizhifanzhuan.svg') no-repeat center;
      }
    }
    &__content {
      &__video {
        width: 100%;
        height: 336px;
        background-color: #fff;
      }
    }
    .content {
      padding: 30px 50px;
      background-color: rgba(#000000, 0.85);
    }
    .el-dialog__body {
      padding: 0 !important;
    }
  }

  &__title {
    display: flex;
    margin-top: 30px;
    justify-content: space-between;
    &__left {
      font-size: 14px;
      font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC',
        'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
      &__menu {
        display: inline-block;
        width: 3px;
        height: 10px;
        margin-right: 7px;
        background-color: #fd6720;
      }
    }
    &__left-small {
      display: flex;
      div {
        margin-right: 4px;
        line-height: 1;
        transform: scale(2);
        color: #7d8292;
      }
    }
    &.vice-title {
      margin-top: 0;
      padding-bottom: 20px;
    }
  }

  &__date {
    &.el-date-editor.el-input,
    &.el-date-editor.el-input__inner {
      width: 100%;
    }
    .el-input__prefix {
      display: none;
    }

    .el-input__suffix {
      display: flex;
      align-items: center;
      .el-input__suffix-inner {
        display: flex;
        i {
          width: 14px;
          height: 14px;
          margin-right: 5px;
          background: url('../../assets/svg/hrx-talent-pool-time.svg') no-repeat
            center;
        }
      }
    }
  }
  .merge-total {
    font-size: 12px;
    padding-left: 15px !important;
    background-color: #f9fafc;
  }

  &__relationTicketTable.general__table,
  &__relationTravelOrderTable.general__table {
    .el-table__empty-block {
      height: 100px !important;
    }
  }
}
.accountSearchPopper {
  padding: 0 !important;
  border: none !important;
  box-shadow: 0 2px 10px 0px rgba(66, 70, 86, 0.1) !important;
  background-color: #fff !important;
  & > div {
    padding: 10px;
    box-shadow: 0 2px 10px 0px rgba(66, 70, 86, 0.1) !important;
    color: #000000 !important;
  }
}
</style>