<template>
  <div class="plan-management__plan">
    <!-- 计划 -->
    <AnnualBaseInfo :data-info="planPackageForm"></AnnualBaseInfo>
    <el-card class="annual-plan__tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane label="培训班计划" name="trainingCoursePlan">
          <div class="menu-right" v-if="!readly">
            <div>
              <span
                class="instructor-icons__add"
                @click="addTrainingCourse('01001')"
              >
                <i class="instructor-icons__add__icon"></i>
                新增</span
              >
            </div>
            <div>
              <span
                class="instructor-icons__del"
                @click="
                  handleDel('trainingCourseTable', 'getTrainingCoursePlanList')
                "
              >
                <i class="instructor-icons__del__icon"></i>
                删除</span
              >
            </div>
            <div>
              <span
                class="instructor-icons__download"
                @click="
                  handleExport(
                    '/fn/plan/annual/reportPlanPackageClasses',
                    {...$parent.handleQueryForm(), classTypeList: trainingCoursePlanForm.classTypeList || [] }
                  )
                "
              >
                <i class="instructor-icons__download__icon"></i>
                导出</span
              >
            </div>
          </div>
          <gc-table 
            class="general__table"
            ref="trainingCourseTable"
            :showSummary="true"
            :summaryMethod="summaryTrainingCoursePlan"
            :list="trainingCoursePlanList"
            :tableList="trainingCoursePlanTableList"
          >
            <template v-if="trainTypeDescOptions.length" v-slot:trainTypeDesc>
              <el-table-column min-width="110" prop="trainTypeDesc">
                <template slot="header">
                  <gc-tablecolumnfilters
                    label="培训类型"
                    ref="tablecolumnfilters"
                    className="table__screen__icon"
                    :list="trainTypeDescOptions"
                  confirmText="确定"
                    popperClass="circular m183"
                    @filter="trainTypeDescFilter"
                  >
                  </gc-tablecolumnfilters>
                </template>
              </el-table-column> 
            </template>
            <el-table-column label="操作" min-width="124" fixed="right">
              <div slot-scope="scope">
                <span class="mr20" @click="checkPlan(scope.row, '01001')">
                  <el-tooltip content="查看" popper-class="icon-popper">
                    <i class="operation__check"></i>
                  </el-tooltip>
                </span>
                <span
                  v-if="!readly"
                  class=""
                  @click="handleEdit('01001', scope.row)"
                >
                  <el-tooltip content="修改" popper-class="icon-popper">
                    <i class="operation__edit"></i>
                  </el-tooltip>
                </span>
              </div>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="trainingCoursePlanForm.total"
            layout="prev, pager, next,slot, sizes"
            prev-text=""
            next-text=""
            :page-sizes="[5, 10]"
            :page-size="trainingCoursePlanForm.pageSize"
            :current-page="trainingCoursePlanForm.currPage"
            @sizeChange="
              sizeChange(
                $event,
                trainingCoursePlanForm,
                getTrainingCoursePlanList
              )
            "
            @currentChange="
              currentChange(
                $event,
                trainingCoursePlanForm,
                getTrainingCoursePlanList
              )
            "
            class="between"
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </el-tab-pane>
        <el-tab-pane label="非培训班计划" name="mistakeTrainingCoursePlan">
          <div class="menu-right" v-if="!readly">
            <div>
              <span
               class="instructor-icons__add"
                @click="addTrainingCourse('01002')"
              >
                <i class="instructor-icons__add__icon"></i>
                新增</span
              >
            </div>
            <div>
              <span
                class="instructor-icons__del"
                @click="
                  handleDel(
                    'mistakeTrainingCourseTable',
                    'getMistakeTrainingCoursePlanList'
                  )
                "
              >
                <i class="instructor-icons__del__icon"></i>
                删除</span
              >
            </div>
            <div>
              <span
                class="instructor-icons__download"
                @click="
                  handleExport(
                    '/fn/plan/annual/reportPlanPackageNonClasses',
                    $parent.handleQueryForm()
                  )
                "
              >
                <i class="instructor-icons__download__icon"></i>
                导出</span
              >
            </div>
          </div>
          <gc-table
            class="general__table"
            ref="mistakeTrainingCourseTable"
            :showSummary="true"
            :summaryMethod="summaryMistakeTrainingCoursePlan"
            :list="mistakeTrainingCoursePlanList"
            :tableList="mistakeTrainingCoursePlanTableList"
          >
            <template v-if="unTrainTypeDescOptions.length" v-slot:trainTypeDesc>
              <el-table-column min-width="110" prop="trainTypeDesc">
                <template slot="header">
                  <gc-tablecolumnfilters
                    label="培训类型"
                    ref="tablecolumnfilters"
                    className="table__screen__icon"
                    :list="unTrainTypeDescOptions"
                    confirmText="确定"
                    popperClass="circular m183"
                    @filter="mistakeTrainTypeDescFilter"
                  >
                  </gc-tablecolumnfilters>
                </template>
              </el-table-column> 
            </template>
            <el-table-column label="操作" min-width="124" fixed="right">
              <template v-slot="scope">
                <div>
                  <span class="mr20" @click="checkPlan(scope.row, '01002')">
                    <el-tooltip content="查看" popper-class="icon-popper">
                      <i class="operation__check"></i>
                    </el-tooltip>
                  </span>
                  <span
                    v-if="!readly"
                    class=""
                    @click="handleEdit('01002', scope.row)"
                  >
                    <el-tooltip content="修改" popper-class="icon-popper">
                      <i class="operation__edit"></i>
                    </el-tooltip>
               </span>
                </div>
              </template>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="mistakeTrainingCoursePlanForm.total"
            layout="prev, pager, next,slot, sizes"
            prev-text=""
            next-text=""
            :page-sizes="[5, 10]"
            :page-size="mistakeTrainingCoursePlanForm.pageSize"
            :current-page="mistakeTrainingCoursePlanForm.currPage"
            @sizeChange="
              sizeChange(
                $event,
                mistakeTrainingCoursePlanForm,
                getMistakeTrainingCoursePlanList
              )
            "
            @currentChange="
              currentChange(
                $event,
                mistakeTrainingCoursePlanForm,
                getMistakeTrainingCoursePlanList
              )
            "
            class="between"
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </el-tab-pane>
        <!-- <el-tab-pane label="预留费用" name="reservedCost">
          <div class="menu-right" v-if="!readly">
            <div>
              <span class="instructor-icons__add" @click="addReservedCost">
                <i class="instructor-icons__add__icon"></i>
                新增</span
              >
            </div>
            <div>
              <span
                class="instructor-icons__del"
                @click="
                  handleDel('reservedCostTableRef', 'getReservedCostList')
                "
              >
                <i class="instructor-icons__del__icon"></i>
                删除</span
              >
            </div>
            <div>
              <span
                class="instructor-icons__download"
                @click="
                  handleExport(
                    '/fn/plan/annual/reportReverseFeePage',
                    $parent.handleQueryForm()
                )
                "
              >
                <i class="instructor-icons__download__icon"></i>
                导出</span
              >
            </div>
          </div>
          <gc-table
            class="general__table"
            ref="reservedCostTableRef"
            :showSummary="true"
            :summaryMethod="summaryReservedCost"
            :list="reservedCostList"
            :tableList="reservedCostTableList"
          >
            <el-table-column label="预留费用（元）" min-width="292" prop="unitExpense">
              <template slot-scope="scope">
                <span v-show="!scope.row.edit">{{
                  scope.row.unitTotalFee
                }}</span>
                <el-input
                  v-show="scope.row.edit"
                  class="w120"
                  v-model="scope.row.unitTotalFee"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="预留费用余额（元）"
              min-width="304"
              prop="unitTotalFee"
            ></el-table-column>
            <el-table-column label="备注" min-width="356">
              <template slot-scope="scope">
                <span v-show="!scope.row.edit">{{
                  scope.row.otherExpenseDescribe
                }}</span>
                <el-input
                  v-show="scope.row.edit"
                  v-model="scope.row.otherExpenseDescribe"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="124" fixed="right">
              <div slot-scope="scope" v-if="!readly">
                <span
                  class=""
                  v-show="!scope.row.edit"
                  @click="reservedCostEdit(scope.row)"
                >
                  <el-tooltip content="修改" popper-class="icon-popper">
                    <i class="operation__edit"></i>
                  </el-tooltip>
                </span>
                <span
                  class=""
                  v-show="scope.row.edit"
                @click="reservedCostEdit(scope.row)"
                >
                  <el-tooltip content="完成" popper-class="icon-popper">
                    <i class="operation__curriculumStorageAccomplish"></i>
                  </el-tooltip>
                </span>
              </div>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="reservedCostForm.total"
            layout="prev, pager, next,slot, sizes"
            prev-text=""
            next-text=""
            :page-sizes="[5, 10]"
            :page-size="reservedCostForm.pageSize"
            :current-page="reservedCostForm.currPage"
            @sizeChange="
              sizeChange($event, reservedCostForm, getReservedCostList)
            "
            @currentChange="
              currentChange($event, reservedCostForm, getReservedCostList)
            "
            class="between"
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </el-tab-pane> -->
      </el-tabs>
    </el-card>

    <!-- 查看培训班计划 dialog  -->
    <gc-model
      width="1200px"
      title="查看培训班计划"
      class="check-training-plan"
      :isShowFooter="false"
      :visible="checkTrainingPlanVisible"
      @close="checkTrainingPlanVisible = false"
    >
      <CheckPlan
        :data="planDetails"
        :classType="classType"
        :blgDeptName="blgDeptName"
        :blgStripLine="blgStripLine"
      />
    </gc-model>
  </div>
</template>

<script>
import {
  sum,
  CopyObj,
  percentage,
  sizeChange,
  jsonHeaders,
  handleExport,
  currentChange,
  handleDownload
} from '@/util/utils'
import { NOT_TRAINING_COURSE_TYPE } from '../enum'
import { fetchListPlanDict } from '@/fetch/public'
import { fetchCalPlanTotalInfo } from '@/fetch/planManagement'
import CheckPlan from './CheckPlan'
import { LINE_LS } from '@/util/constants'
import AnnualBaseInfo from './AnnualBaseInfo.vue'

export default {
  props: ['data', 'blgStripLine', 'dept', 'blgDeptName', 'readly'],
  components: { CheckPlan, AnnualBaseInfo },
  data() {
    return {
      // 分页工具函数
      sizeChange,
      currentChange,
      // 计划 form对象
      planPackageForm: {},
      // tabs 选中页
      activeName: 'trainingCoursePlan',

      // tabs 培训班计划 表格 分页对象
      trainingCoursePlanForm: {
        total: 0,
        currPage: 1,
        pageSize: 5,
        classify: 1,
        packageId: '',
        // 培训类型筛选
        classTypeList: []
      },
      // tabs 培训班计划 表格 字段数组
      trainingCoursePlanList: [
        {
          type: 'selection',
          width: '54'
        },
        // {
        //   type: 'index',
        //   label: '序号',
        //   width: '64'
        // },
        {
          label: '项目名称',
          width: '350',
          prop: 'className'
        },
        {
          label: '培训类型',
          width: '104',
          slot: 'trainTypeDesc',
          prop: 'trainTypeDesc'
        },
        {
          label: '是否消保培训',
          prop: 'ifConformanceDesc',
          width: '120',
       },
        {
          label: '业务模块',
          width: '104',
          prop: 'channelTypeDesc'
        },
        {
          label: '关键岗位',
          width: '104',
          prop: 'keyJobsDesc'
        },
        {
          label: '培训系列',
          width: '104',
          prop: 'trainSeriesDesc'
        },
        {
          label: '子系列',
          width: '104',
          prop: 'childSeriesDesc'
        },
        {
          label: '总期数',
          width: '92',
          prop: 'termNum'
        },
        {
          label: '创建人',
          width: '92',
          prop: 'createdByName'
        },
        {
          label: '部门',
          width: '200',
          prop: 'blgDeptName'
        }
      ],
      // tabs 培训班计划 表格 数据数组
      trainingCoursePlanTableList: [],
      // tabs 培训班计划 总期数 合计
      trainingCoursePlanTotalTerm: '',
      // tabs 培训班计划 总人数 合计
      trainingCoursePlanTotalStu: '',
      // tabs 培训班计划 总费用（元）合计
      trainingCoursePlanTotalFee: '',
      // tabs 培训班计划 “培训类型”字段 - 筛选选择项
      trainTypeDescOptions: [],

      // 非培训班-培训类型过滤器选项
      unTrainTypeDescOptions: [],
      // tabs 非培训班计划 表格 分页对象
      mistakeTrainingCoursePlanForm: {
        total: 0,
        currPage: 1,
        pageSize: 5,
        classify: 0,
        packageId: ''
      },
      // tabs 非培训班计划 表格 字段数组
      mistakeTrainingCoursePlanList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          label: '项目名称',
          width: '350',
          prop: 'className'
        },
        {
          label: '培训类型',
          width: '104',
          slot: 'trainTypeDesc',
          prop: 'trainTypeDesc'
        },
        {
          label: '是否消保培训',
          prop: 'ifConformanceDesc',
          width: '100',
       },
        {
          label: '总期数',
          width: '100',
          prop: 'termNum'
        },
        {
          label: '创建人',
          width: '126',
          prop: 'createdByName'
        },
        {
          label: '部门',
          width: '234',
          prop: 'blgDeptName'
        }
      ],
      // tabs 非培训班计划 表格 数据数组
      mistakeTrainingCoursePlanTableList: [],
      // tabs 非培训班计划 总期数 合计
      mistakeTrainingCoursePlanTotalTerm: '',
      // tabs 非培训班计划 总人数 合计
      mistakeTrainingCoursePlanTotalStu: '',
      // tabs 非培训班计划 总费用（元）合计
      mistakeTrainingCoursePlanTotalFee: '',

      // tabs 预留费用 表格 分页对象
      reservedCostForm: {
        total: 0,
        currPage: 1,
        pageSize: 5
      },
      // tabs 预留费用 表格 字段数组
      reservedCostList: [
        {
          type: 'selection',
          width: '54'
        },
      ],
      // tabs 预留费用 表格 数据数组
      reservedCostTableList: [],
      // tabs 预留费用 总期数 合计
      reservedCostTotalTerm: '',
      // tabs 预留费用 总人数 合计
      reservedCostTotalStu: '',
      // tabs 预留费用 总费用（元）合计
      reservedCostTotalFee: '',

      // 求百分比函数
      percentage,
      // 查看培训班计划 dialog
      checkTrainingPlanVisible: false,
      // 计划详情数据
      planDetails: {},
      // 培训班类型
      classType: '',
      // 求和函数
      sum,
      handleExport
    }
  },
  methods: {
    summaryMethod(param, tableName) {
    const { columns, data } = param, sums = []
      const meta = {
        'trainingCoursePlan': {
          termNum: 'trainingCoursePlanTotalTerm',
          studentTotal: 'trainingCoursePlanTotalStu',
          totalFee: 'trainingCoursePlanTotalFee'
        },
        'mistakeTrainingCoursePlan': {
          termNum: 'mistakeTrainingCoursePlanTotalTerm',
          studentTotal: 'mistakeTrainingCoursePlanTotalStu',
          totalFee: 'mistakeTrainingCoursePlanTotalFee'
        },
        'reservedCost': {
          unitExpense: 'reservedCostTotalFee',
          unitTotalFee: 'reservedCostTotalFee',
        },
      }

      columns.forEach((column, index) => {
        const { property } = column
        if (index === 0) {
          sums[index] = '总价';
          return;
        }
        if (Object.keys(meta[tableName]).includes(property)) {
          sums[index] = this[meta[tableName][property]]
          return
        }
      })
      return sums;
    },
    // 培训班计划
    summaryTrainingCoursePlan (param) {
      return this.summaryMethod(param, 'trainingCoursePlan')
    },
    // 非培训班计划
    summaryMistakeTrainingCoursePlan (param) {
      return this.summaryMethod(param, 'mistakeTrainingCoursePlan')
    },
    summaryReservedCost (param) {
      return this.summaryMethod(param, 'reservedCost')
    },
    // tabs 培训班计划 表格 数据获取
    getTrainingCoursePlanList() {
      const data = CopyObj(this.trainingCoursePlanForm)
      data.page = data.currPage
      data.size = data.pageSize
      this.$axios
        .post('/fn/plan/annual/listPlanInfos', data, jsonHeaders)
        .then(async (res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            list.forEach((v) => {
              v.studentTotal = v.termNum * v.studentNum
            })
            this.trainingCoursePlanTableList = list
            this.trainingCoursePlanForm.total = total
            await this.handleCalPlanTotalInfo('trainingCoursePlan')
          }
        })
    },
    // tabs 非培训班计划 表格 数据获取
    getMistakeTrainingCoursePlanList() {
      const data = CopyObj(this.mistakeTrainingCoursePlanForm)
      data.page = data.currPage
      data.size = data.pageSize
      this.$axios
        .post('/fn/plan/annual/listPlanInfos', data, jsonHeaders)
        .then(async (res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            list.forEach((v) => {
              v.studentTotal = v.termNum * v.studentNum
            })
            this.mistakeTrainingCoursePlanTableList = list
            this.mistakeTrainingCoursePlanForm.total = total
            await this.handleCalPlanTotalInfo('mistakeTrainingCoursePlan')
          }
        })
    },
    // tabs 预留费用 表格 数据获取
    getReservedCostList() {
      const data = CopyObj(this.reservedCostForm)
      data.page = data.currPage
      data.size = data.pageSize
      this.$axios
        .post('/fn/plan/annual/listReverseFee', data, jsonHeaders)
        .then(async (res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.reservedCostTableList = list
            this.reservedCostForm.total = total
            await this.handleCalPlanTotalInfo('reservedCost')

          }
        })
    },
    async handleCalPlanTotalInfo (tableName, totalData) {
      totalData = totalData || await fetchCalPlanTotalInfo({ packageId: this.trainingCoursePlanForm.packageId, classTypeList: this.trainingCoursePlanForm.classTypeList })
      // 培训班计划 - 总计
      if (['all', 'trainingCoursePlan'].includes(tableName)) {
        const trainingCoursePlanCal = totalData.find((v) => v.planClassType == 1) || {}
        this.trainingCoursePlanTotalTerm = trainingCoursePlanCal.totalTerm
        this.trainingCoursePlanTotalStu = trainingCoursePlanCal.totalStu
      this.trainingCoursePlanTotalFee = trainingCoursePlanCal.totalFee
      }
      // 非培训班计划 - 总计
      if (['all', 'mistakeTrainingCoursePlan'].includes(tableName)) {
        const mistakeTrainingCoursePlanCal = totalData.find((v) => v.planClassType == 0) || {}
        this.mistakeTrainingCoursePlanTotalTerm = mistakeTrainingCoursePlanCal.totalTerm
        this.mistakeTrainingCoursePlanTotalStu = mistakeTrainingCoursePlanCal.totalStu
        this.mistakeTrainingCoursePlanTotalFee = mistakeTrainingCoursePlanCal.totalFee
      }
      // 预留费用 - 总计
      if (['all', 'reservedCost'].includes(tableName)) {
        const reservedCostPlanCal = totalData.find((v) => v.planClassType == 2) || {}
        this.reservedCostTotalTerm = reservedCostPlanCal.totalTerm
        this.reservedCostTotalStu = reservedCostPlanCal.totalStu
        this.reservedCostTotalFee = reservedCostPlanCal.totalFee
      }
    },
    // 将传递的数据转化为符合 组件的数据
    dataTransition() {
      const data = CopyObj(this.data)
      // 计划信息
      this.planPackageForm = data.planPackage || {}
      // 计划总期数
      this.planPackageForm.totalAllTerm = data.totalAllTerm
      // 已执行期数
      this.planPackageForm.completionPlanSum = data.completionPlanSum
      // 计划外期数
      this.planPackageForm.outPlanSum = data.outPlanSum
      // 预计分摊人数
      this.planPackageForm.apportionStu = data.apportionStu
      // 分摊期数
      this.planPackageForm.apportionTerm = data.apportionTerm
      // 总预算
      this.planPackageForm.totalPlanAmt = data.totalPlanAmt
      // 已立项未报账金额
      this.planPackageForm.unPayedAmt = data.unPayedAmt
      // 报销流程中金额
      this.planPackageForm.occupyAmt = data.occupyAmt
      // 已支出金额
      this.planPackageForm.paidAmt = data.paidAmt

      // 培训班计划
      this.trainingCoursePlanForm.total = data.classesTotal
      data?.classes?.forEach((v) => {
        v.studentTotal = v.termNum * v.studentNum
      })
      this.trainingCoursePlanTableList = data.classes
      this.trainingCoursePlanForm.packageId = data?.planPackage?.planPackageId
      this.trainingCoursePlanForm.currPage = 1
      this.trainingCoursePlanForm.pageSize = 5

      // 非培训班计划
      this.mistakeTrainingCoursePlanForm.total = data.nonclassesTotal
      this.mistakeTrainingCoursePlanTableList = data.nonclasses
      data?.nonclasses?.forEach((v) => {
        v.studentTotal = v.termNum * v.studentNum
      })
      this.mistakeTrainingCoursePlanForm.packageId = data?.planPackage?.planPackageId
      this.mistakeTrainingCoursePlanForm.currPage = 1
      this.mistakeTrainingCoursePlanForm.pageSize = 5
      // 预留费用
      this.reservedCostForm.total = data.reverseFeeTotal
      data?.reverseFee?.forEach((v) => {
        v.edit = false
      })
      this.reservedCostTableList = data.reverseFee
      this.reservedCostForm.packageId = data?.planPackage?.planPackageId
      this.reservedCostForm.currPage = 1
      this.reservedCostForm.pageSize = 5

      if (data?.planCal) {
        this.handleCalPlanTotalInfo('all', data.planCal)
      }
    },
    // 点击编辑预留费用
    reservedCostEdit(row) {
      row.edit = !row.edit
      if (!row.edit) {
        this.$emit('reservedCostEdit', row)
      }
    },
    // 查看计划详情
    checkPlan(row, classType) {
      this.classType = classType
      const { annualPlanId } = row
      const data = {
        planId: annualPlanId,
        dept: this.dept,
        line: this.blgStripLine
      }
      this.$axios
        .post('/fn/plan/annual/findPlanInfoDetail', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.planDetails = data
          }
        })
      this.checkTrainingPlanVisible = true
    },
   openApportionDetails() {
      this.$emit('openApportionDetails')
    },
    // 培训类型筛选函数(重置函数)
    trainTypeDescFilter(list) {
      this.trainingCoursePlanForm.classTypeList = list.list
      this.trainingCoursePlanForm.currPage = 1
      this.getTrainingCoursePlanList()
    },
    // 培训类型筛选函数(重置函数)
    mistakeTrainTypeDescFilter(list) {
      this.mistakeTrainingCoursePlanForm.classTypeList = list.list
      this.mistakeTrainingCoursePlanForm.currPage = 1
      this.getMistakeTrainingCoursePlanList()
    },
    // 新增培训班点击事件
    addTrainingCourse(classType) {
      this.$emit('addTrainingCourse', classType)
    },
    // 新增 分摊 点击事件
    addReservedCost() {
      this.$emit('addReservedCost')
    },
    // 点击编辑按钮事件
    handleEdit(classType, row) {
      this.$emit('editTrainingCourse', classType, row)
    },
    // 点击删除按钮事件
    handleDel(ref, fun) {
      if (this.applyStatus) {
        return this.$message.warning('审批中，已通过的计划不能删除')
      }
      const selection = this.$refs[ref].$children[0].selection
      if (selection.length < 1) {
        return this.$nextTick(() => {
          this.$message.warning('请至少勾选一个')
        })
      }
      this.$alert('确定删除以下计划？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const planIdList = selection.map((v) => v.annualPlanId)
            this.$axios
              .post('/fn/plan/annual/deletePlan', { planIdList }, jsonHeaders)
              .then((res) => {
                if (res.data.code === 0) {
                  this.$message.success('删除成功')
                  this[fun]()
                }
              })
          }
        })
        .catch((err) => err)
    },
    // 导出计划
    exportPlan() {
      const { planPackageId } = this.planPackageForm
     this.$axios
        .get('/planupload/exportPlanInfo', {
          params: { planPackageId },
          responseType: 'blob'
        })
        .then(handleDownload)
    }
  },
  watch: {
    data() {
      this.dataTransition()
    }
  },
  computed: {
    applyStatus() {
      const statusList = ['02001', '02002']
      const applyStatus = this.data?.planPackage?.applyStatus
      return statusList.includes(applyStatus)
    }
  },
  mounted () {
    // 加载“培训类型”的筛选项
    fetchListPlanDict({line: 'LS', type: '01001' })
    .then(data => {
      const trainTypes = (data?.trainTypes) || []
      this.trainTypeDescOptions = trainTypes.map(m => {
        m.value = m.dataEncode
        m.label = m.dataValue
        return m
      })
    })
    .catch(() => {
      this.trainTypeDescOptions = [ 
        { "value": "02001", "label": "阶梯培训" }, 
        { "value": "02000", "label": "项目性培训" }, 
        { "value": "02002", "label": "大学专班" }, 
        // { "value": "02003", "label": "消保合规培训" } 
      ]
    })
    // 加载培训类型
    fetchListPlanDict({ line: LINE_LS, type: NOT_TRAINING_COURSE_TYPE })
    .then((data) => {
      this.unTrainTypeDescOptions = data.trainTypes.map((row) => ({
        value: row.dataEncode,
        label: row.dataValue
      }))
      console.log('非培训班-培训类型', this.unTrainTypeDescOptions)
    })
  }
}
</script>

<style lang="scss" scoped>
.plan-package-state {
  margin-top: -1px;
  .wrap {
    border: 1px solid #eaecf1;
    .title-box {
      display: flex;
      height: 40px;
      padding: 0 20px;
     background-color: #f7f8fa;
      color: #7d8292;
      line-height: 40px;
      justify-content: space-between;
    }
    .items {
      display: flex;
      padding: 20px 40px;
      justify-content: space-between;
      color: #424656;

      .item {
        display: flex;
        height: 120px;
        line-height: 40px;
        .right {
          min-width: 60px;
        }
      }
      .apportion-details {
        line-height: 18px;
        border-bottom: 1px solid #fd6720;
        color: #fd6720;
        cursor: pointer;
      }
    }
  }
}
.annual-plan__tabs {
  margin-top: -1px;
  border-top: 1px dashed #eaecf1;
  :deep(.el-card__body) {
    padding: 20px 0;
    .el-tabs__content {
      padding: 0 20px;
      .menu-right {
        padding-top: 5px;
      }
    }
  }
}
</style>
