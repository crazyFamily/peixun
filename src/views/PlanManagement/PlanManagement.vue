<template>
  <div class="plan-management__plan-management">
    <div v-show="showIndex === 0">
      <el-card class="search-card">
        <el-form :model="queryForm" :inline="true">
          <el-form-item label="机构">
            <gc-institution ref="institutionRef" 
              v-model="queryForm.busiType" 
              :defaultShow="true"
              hasResetBlgStripLine
              @setDataFinish="orgSetDataFinishHandle"
              @change="orgNameChange" style="vertical-align: middle">
            </gc-institution>
            <!-- <el-checkbox class="ml10" v-model="queryForm.isGotSubBranch">含下属机构</el-checkbox> -->
          </el-form-item>
          <el-form-item label="年度" class="search-card__date">
            <el-date-picker
              v-model="queryForm.year"
              type="year"
              placeholder="选择年度"
              :clearable="false"
              value-format="yyyy"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="提交人">
            <el-input v-model="queryForm.submitBy" placeholder="请输入提交人"></el-input>
          </el-form-item>
          <el-form-item label="计划名称">
            <el-input v-model="queryForm.planPackageName" placeholder="请输入计划名称"></el-input>
          </el-form-item>
        </el-form>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
        </div>
      </el-card>
      <el-card class="tabs-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="年度计划" name="yearPlan">
            <div class="menu-right">
              <span class="instructor-icons__download" @click="exportHandle">
                <i class="instructor-icons__download__icon"></i>
                导出</span
              >
            </div>
            <gc-table
              ref="planManagementTableRef"
              class="general__table mt20 table-radio"
              :list="planManagementList"
              :tableList="planManagementTableList"
              @selection-change="tableSelectionChange($refs, $event, 'planManagementTableRef')"
            >
              <el-table-column label="计划名称" slot="planPackageName" prop="planPackageName" width="350">
                <template slot-scope="scope">
                  <el-link type="primary" @click="queryPlanDetails(scope.row)">{{ scope.row.planPackageName }}</el-link>
                </template>
              </el-table-column>
              <el-table-column width="100" prop="applyStatusDesc">
                <template slot="header">
                  <gc-tablecolumnfilters
                    label="状态"
                    ref="tablecolumnfilters"
                    className="table__screen__icon"
                    :list="expenseStatus"
                    confirmText="确定"
                    popperClass="circular"
                    @filter="yearPlanStatusFilter"
                    @reset="yearPlanStatusReset"
                    radio
                  >
                  </gc-tablecolumnfilters>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="140" fixed="right">
                <template v-slot:default="scope">
                  <!-- <span class="" @click="queryPlanDetails(scope.row)">
                    <el-tooltip content="查看" popper-class="icon-popper">
                      <i class="operation__check"></i>
                    </el-tooltip>
                  </span> -->
                  <span class="" @click="exportPlan(scope.row)" v-if="scope.row.applyStatus === '02002'">
                    <el-tooltip content="导出" popper-class="icon-popper">
                      <i class="operation__download"></i>
                    </el-tooltip>
                  </span>
                  <span
                    :class="{'ml20':scope.row.applyStatus === '02002'}"
                    @click="delPlan(scope.row)"
                    v-if="scope.row.applyStatus === '02000' || scope.row.applyStatus === '02004' || scope.row.applyStatus === '02003'"
                  >
                    <el-tooltip content="删除" popper-class="icon-popper">
                      <i class="operation__del"></i>
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
            </gc-table>
            <gc-pagination
              :total="total"
              layout="prev, pager, next,slot, sizes"
              prev-text=""
              next-text=""
              :page-sizes="[10, 20]"
              :page-size="queryForm.pageSize"
              :current-page="queryForm.currPage"
              @sizeChange="sizeChange($event, queryForm, getYearPlanList)"
              @currentChange="currentChange($event, queryForm, getYearPlanList)"
              class="between"
            >
              <span class="text">每页显示</span>
            </gc-pagination>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <div v-show="showIndex === 1" class="check-plain">
      <el-card class="back">
        <div class="menu-right margin-0">
          <el-button class="button-w80-h30" @click="showIndex = 0">返回</el-button>
        </div>
      </el-card>
      <Plain
        :dept="useDept"
        :readly="true"
        :data="planPackageData"
        :blgDeptName="blgDeptName"
        :blgStripLine="useBlgStripLine"
        @openApportionDetails="openApportionDetails"
      />
      <el-card class="approval-chain-card">
        <div class="df">
          <span class="label necessary-before">审批链</span>
          <el-input :value="auditUsersUm" disabled></el-input>
        </div>
      </el-card>
    </div>

    <!-- 分摊详情 dialog -->
    <ApportionDetailsDialog :data="apportionComponentData" ref="apportionDetailsDialog" />
  </div>
</template>

<script>
// import store from '@/store'
// import { fetchUserOrgTree } from '@/fetch/public'
import { hintFrame, sizeChange, jsonHeaders, currentChange, tableSelectionChange, ApprovalChainTransitionStr, handleDownload } from '../../util/utils'
import Plain from './components/Plan'
import ApportionDetailsDialog from './components/ApportionDetailsDialog'
import { fetchExportPlanPackages } from '@/fetch/planManagement'
export default {
  name: 'PlanManagement',
  components: { Plain, ApportionDetailsDialog },
  data() {
    return {
      // 显示哪个 div
      showIndex: 0, // 0：列表页； 1：详情页面
      // 分页总条数
      total: 0,
      // 查询表单对象
      queryForm: {
        year: '',
        busiType: [],
        status: '',
        submitBy: '',
        planPackageName: '',
        isGotSubBranch: true,
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      // tabs 激活项
      activeName: 'yearPlan',
      // 计划管理 表格 字段数组
      planManagementList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          slot: 'planPackageName'
        },
        {
          width: '110',
          label: '提交时间',
          prop: 'submitDate'
        },
        {
          width: '110',
          label: '提交人',
          prop: 'submitByName'
        },
        {
          width: '228',
          label: '计划所属单位',
          prop: 'blgDeptName'
        }
      ],
      // 计划管理 表格 数据数组
      planManagementTableList: [],
      // 计划管理 表格 状态数据
      expenseStatus: [
        {
          label: '未提交',
          value: '02000'
        },
        {
          label: '审批中',
          value: '02001'
        },
        {
          label: '已通过',
          value: '02002'
        },
        {
          label: '已退回',
          value: '02003'
        },
        {
          label: '已撤回',
          value: '02004'
        }
      ],
      // 分页函数
      sizeChange,
      currentChange,
      // 表格变单选
      tableSelectionChange,
      // 查询时的条线
      useBlgStripLine: '',
      // 查询时的部门id
      useDept: '',
      // 查询时的年份
      useYear: '',
      // 选中的部门名字
      blgDeptName: '',
      // 计划 组件数据对象
      planPackageData: { planPackage: {} },
      // 审批链显示数据
      auditUsersUm: ''
    }
  },
  methods: {
    // 查询
    query() {
      if (this.queryForm.busiType.length < 2) {
        return this.$message.warning('请先选条线和机构')
      } else if (!this.queryForm.year) {
        return this.$message.warning('请先选年度')
      }
      this.queryForm.currPage = 1
      this.getYearPlanList()
    },
    // 处理查询数据
    handleQueryForm() {
      const { year, currPage: page, pageSize: size, status, submitBy, planPackageName } = this.queryForm
      const data = { year, page, size, status, submitBy, planPackageName }
      ;[data.line, data.dept] = this.queryForm.busiType
      this.useBlgStripLine = data.line
      this.useDept = data.dept
      this.useYear = data.year
      data.isGotSubBranch = this.queryForm.isGotSubBranch ? 'Y' : 'N'
      return { data }
    },
    // 年度计划表格 状态筛选
    yearPlanStatusFilter(list) {
      this.queryForm.status = list.list[0]
      this.getYearPlanList()
    },
    // 年度计划表格 状态重置
    yearPlanStatusReset(list) {
      this.queryForm.status = ''
      this.getYearPlanList()
    },
    // 获取年度计划数据
    getYearPlanList() {
      const data = this.handleQueryForm()
      this.$axios.post('/fn/plan/manage/listPlanPackages', data, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { list, total } = data
          list.forEach((v) => {
            v.submitDate = v.submitDate?.split(' ')[0]
          })
          this.planManagementTableList = list
          this.total = total
        }
      })
    },
    // 选择部门变化事件
    orgNameChange(v) {
      this.blgDeptName = v
    },
    // 查询计划信息
    queryPlanDetails(row) {
      const { planYear: year, blgStripLine: line, blgDept: dept } = row
      this.useBlgStripLine = line
      this.useDept = dept
      this.useYear = year
      const data = { year, line, dept }
      this.$axios.post('/fn/plan/annual/findPackageInfo', data, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.planPackageData = data
          this.showIndex = 1
          const auditUsersUm = this.planPackageData.planPackage.auditUsersum
          if (auditUsersUm) {
            this.auditUsersUm = auditUsersUm
          }
        }
      })
      this.getApprovalChain(row)
    },
    // 获取审批链 数据
    getApprovalChain(row) {
      const data = {
        chainType: 1,
        orgId: this.useDept,
        blgStripLine: row.blgStripLine
      }
      this.$axios.post('/fn/commons/eoa/listFixedChain', { data }, jsonHeaders).then((res) => {
        let { code, data } = res.data
        if (code === 0) {
          data = data?.fixedList || []
          const auditUsersUm = ApprovalChainTransitionStr(data)
          if (auditUsersUm.length) {
            this.auditUsersUm = auditUsersUm.join('')
          }
        }
      })
    },
    // 打开分摊详情
    openApportionDetails() {
      this.$refs.apportionDetailsDialog.open()
    },
    // 导出计划
    exportPlan(row) {
      const { planPackageId } = row
      this.$axios
        .get('/planupload/exportPlanInfo', {
          params: { planPackageId },
          responseType: 'blob'
        })
        .then(handleDownload)
    },
    delPlan(row) {
      hintFrame('确认删除该计划？').then((res) => {
        if (!res) return
        const { planYear: year, blgDept: dept, blgStripLine: line } = row
        this.$axios.post('/fn/plan/manage/deletePackageInfo', { year, dept, line }, jsonHeaders).then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('删除成功')
            this.query()
          }
        })
      })
    },
    async exportHandle() {
      const data = this.handleQueryForm()
      await fetchExportPlanPackages(data)
    },
    orgSetDataFinishHandle() {
      this.query()
    },
  },
  mounted() {
    this.$set(this.queryForm, 'year', new Date().getFullYear() + '')
    // const userInfo = store.getters['getUserInfo']

    // const params = { module: 'planModule', busiType: userInfo.blgStripLine }
    // fetchUserOrgTree(params).then((res) => {
    //   this.queryForm.busiType = [userInfo.blgStripLine, res[0].orgList[0].orgId]
    //   this.$refs.institutionRef.setContentValue([res[0].orgList[0].orgName])
    //   this.query()
    // })
  },
  computed: {
    apportionComponentData() {
      return {
        year: this.useYear,
        dept: this.useDept,
        line: this.useBlgStripLine
      }
    }
  }
}
</script>

<style lang="scss">
.plan-management__plan-management {
  .search-card {
    .el-cascader {
      width: 200px;
    }
  }
  .tabs-card {
    margin-top: -1px;
    .el-card__body {
      padding: 20px 0;

      .el-tabs__content {
        padding: 5px 20px 0;
      }
    }
  }
  .approval-chain-card {
    margin-top: -1px;
    padding: 10px 0;
    border-top: 1px dashed #eaecf1;
    .label {
      width: 48px;
      margin-right: 6px;
      line-height: 30px;
      &.necessary-before::before {
        top: 1px;
      }
    }
  }
  .check-training-plan {
    .el-dialog__body {
      background-color: #f5f6fb;
    }
  }
}
</style>