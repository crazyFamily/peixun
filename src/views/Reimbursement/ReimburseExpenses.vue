<template>
  <div class="Reimbursement__ReimburseExpenses">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="机构部门">
          <div class="df">
            <gc-institution v-model="queryForm.line" :fetchParams="{module: CLASS_MODULE }"> </gc-institution>
          </div>
        </el-form-item>
        <el-form-item label="班主任">
          <el-input
            v-model.trim="queryForm.classManagerUM"
            placeholder="请输入班主任姓名/UM号"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目信息">
          <el-input
            v-model.trim="queryForm.classId"
            placeholder="请输入项目名称或编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="报销人">
          <el-input
            v-model.trim="queryForm.umOrName"
            placeholder="请输入报销人"
          ></el-input>
        </el-form-item>
        <el-form-item label="报销单号">
          <el-input
            v-model.trim="queryForm.reimIdFas"
            placeholder="请输入报销单号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="记账日期" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.apAccountDateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="handleStartPickerOptions(queryForm, 'apAccountDateStart')"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="至"
            class="My__search-card__date search-card__date"
          >
            <el-date-picker
              v-model="queryForm.apAccountDateEnd"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="handleEndPickerOptions(queryForm, 'apAccountDateEnd')"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item class="mr10">
          <el-form-item label="报帐日期">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="handleStartPickerOptions(queryForm, 'dateEnd')"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateEnd"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="handleEndPickerOptions(queryForm, 'dateStart')"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span
          class="instructor-icons__download"
          @click="
            handleExport('/fn/reim/org/reportListOrgReim', {
              data: handleQueryForm()
            })
          "
        >
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <gc-table noList class="general__table" :tableList="tableList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="项目名称" min-width="200">
          <template slot-scope="scope">
            <span class="active" @click="openPreview(scope.row)">{{
              scope.row.className
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目编号" min-width="120" prop="classId">
        </el-table-column>
        <el-table-column min-width="120">
          <template slot="header">
            <gc-tablecolumnfilters
              label="项目类型"
              className="table__screen__icon"
              confirmText="确定"
              popperClass="circular m183"
              :list="classTypeOptions"
              @filter="
                commonFilter(
                  $event,
                  queryForm,
                  'classTypeOne',
                  getList,
                  'filter'
                )
              "
              @reset="commonFilter($event, queryForm, 'classTypeOne', getList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            {{ scope.row.classTypeOne === '1' ? '培训班项目' : '非培训班项目' }}
          </template>
        </el-table-column>
        <el-table-column
          label="班主任"
          min-width="100"
          prop="classAdviserName"
        />
        <el-table-column min-width="100">
          <template slot="header">
            <gc-tablecolumnfilters
              label="费用类型"
              className="table__screen__icon"
              confirmText="确定"
              popperClass="circular m183"
              :list="shareOptions"
              @filter="
                commonFilter($event, queryForm, 'ifShare', getList, 'filter')
              "
              @reset="commonFilter($event, queryForm, 'ifShare', getList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            {{ scope.row.ifShare === 'Y' ? '分摊费用' : '举办费用' }}
          </template>
        </el-table-column>
        <el-table-column
          label="立项金额"
          min-width="100"
          prop="classBudgetTotalAmt"
        />
        <el-table-column
          label="已占用金额"
          min-width="100"
          prop="occupyTotalAmt"
        />
        <el-table-column label="报销人" min-width="100" prop="operName" />
        <el-table-column label="报销单号" min-width="200">
          <template slot-scope="scope">
            <span
              class="active"
              @click="checkTrainingCourseOrderInfo(scope.row)"
              >{{ scope.row.reimIdFas }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="记账日期" min-width="100">
          <template slot-scope="scope">
            {{scope.row.apAccountDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="报销金额"
          min-width="100"
          prop="reimDuePayAmt"
        />
        <el-table-column
          label="实际报销金额"
          min-width="120"
          prop="payedTotalAmt"
        />
        <el-table-column
          label="报帐日期"
          min-width="100"
          prop="reimSubmitDateFormat"
        />
        <el-table-column min-width="120">
          <template slot="header">
            <gc-tablecolumnfilters
              label="报销状态"
              className="table__screen__icon"
              confirmText="确定"
              popperClass="circular m183"
              :list="statusOptions"
              @filter="
                commonFilter($event, queryForm, 'status', getList, 'filter')
              "
              @reset="commonFilter($event, queryForm, 'status', getList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            {{
              (deepSearchVal(statusOptions, scope.row.reimStatusCode) || {})
                .label
            }}
            <el-popover popper-class="mr20" :key="randomKey" v-if="scope.row.reimStatusCode === 'T02' || scope.row.reimStatusCode === RETURNED">
              <div style="padding: 10px;max-width: 700px;">
                <span v-if="scope.row.failInfo">失败原因：<span style="color:#df3c51">{{scope.row.failInfo}}</span></span>
                <div v-else style="position: relative;min-height: 50px;" class="el-loading-mask">
                  <div class="el-loading-spinner">
                    <svg viewBox="25 25 50 50" class="circular">
                      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                    </svg>
                  </div>
                </div>
              </div>
              <i slot="reference" :ref="'popoverIcon-'+ scope.row.reimId" @click="getFailInfo(scope.row)" class="el-icon-question active"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right">
          <template slot-scope="scope">
            <span class="active" @click="openCostInfo(scope.row)">查看</span>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.page"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
      />
    </el-card>

    <!-- 机构报销费用详情 弹窗 -->
    <gc-model
      title="机构报销费用详情"
      width="1000px"
      :visible.sync="costInfoVisible"
    >
      <div class="df mb20">
        <span class="mr40 w-300">
          项目名称：
          <span>{{ projectName }}</span>
        </span>
        <span> 班主任：{{ headTeacher }} </span>
      </div>
      <gc-table
        class="general__table table-left"
        :list="costInfoList"
        :tableList="costInfoTableList"
      ></gc-table>
    </gc-model>
  </div>
</template>

<script>
import {
  filterObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  handleExport,
  commonFilter,
  deepSearchVal,
  currentChange,
  addAllowKeepAlive,
  handleEndPickerOptions,
  handleStartPickerOptions
} from '@/util/utils'
import { loadingMixin } from '@/mixins/component'
import { fetchFindFailReason } from '@/fetch/reimbursement'
import { CLASS_MODULE, RETURNED } from './enum'
export default {
  name: 'ReimburseExpenses',
  mixins: [loadingMixin],
  data() {
    return {
      // 查询表单
      queryForm: {
        line: [],
        orgId: '',
        classTypeOne: '',
        ifShare: '',
        classId: '',
        className: '',
        classManager: '',
        classManagerUM: '',
        umOrName: '',
        reimIdFas: '',
        status: '',
        page: 1,
        size: 10,
        apAccountDateStart: '',
        apAccountDateEnd: ''
      },
      total: 0,
      // 项目类型下拉选项
      classTypeOptions: [
        {
          label: '培训班项目',
          value: '1'
        },
        {
          label: '非培训班项目',
          value: '2'
        }
      ],
      // 费用类型下拉选项
      shareOptions: [
        {
          label: '举办费用',
          value: 'N'
        },
        {
          label: '分摊费用',
          value: 'Y'
        }
      ],
      // 报销状态下拉选项
      statusOptions: [],
      // 日期限时 用的
      handleEndPickerOptions,
      handleStartPickerOptions,
      // 表格数据列表
      tableList: [],
      //  分页工具函数
      sizeChange,
      currentChange,
      // 费用详情 dialog 状态
      costInfoVisible: false,
      // 项目名称
      projectName: '',
      // 班主任
      headTeacher: '',
      // 费用详情表格字段列表
      costInfoList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '报销人',
          width: '120',
          prop: 'operName'
        },
        {
          label: '报销类型',
          width: '120',
          prop: 'expenseTypeDesc'
        },
        {
          label: '立项金额（元）',
          width: '110',
          prop: 'classBudgetAmt'
        },
        {
          label: '报销金额（元）',
          width: '110',
          prop: 'amt'
        },
        {
          label: '已付金额（元）',
          width: '100',
          prop: 'reimLineFinalAmt'
        },
        {
          label: '报销状态',
          width: '100',
          prop: 'reimStatus'
        }
      ],
      // 费用详情表格数据列表
      costInfoTableList: [],
      // 工具函数
      commonFilter,
      deepSearchVal,
      handleExport,
      randomKey: Math.random(),
      CLASS_MODULE,
      RETURNED
    }
  },
  methods: {
    getFailInfo(row){
      if (row.failInfo) return
      fetchFindFailReason({
        reimId: row.reimId,
        reimIdFas: row.reimIdFas,
      }).then(res => {
        row.failInfo = res || (row.reimStatusCode === this.RETURNED ? '人为操作退回/撤回，无失败原因' : '未查询到失败原因')
        this.randomKey = Math.random()
        this.$nextTick(() => {
          this.$refs['popoverIcon-'+ row.reimId].dispatchEvent(new MouseEvent('click'));
        })
      })
    },
    handleQueryForm() {
      const data = filterObj(this.queryForm)
      const [line, orgId] = data.line
      ;[data.line, data.orgId] = [line, orgId]
      const re = /^[\da-zA-Z]+$/
      const num = /^\d+$/
      if (!num.test(data.classId)) {
        data.className = data.classId
        data.classId = ''
      }
      if (!re.test(data.classManagerUM)) {
        data.classManager = data.classManagerUM
        data.classManagerUM = ''
      }
      if (!data.line) {
        data.line = this.$store.state.userInfo.blgStripLine
      }
      return data
    },
    // 查询按钮
    query() {
      this.queryForm.page = 1
      this.queryForm.size = 10
      this.getList()
    },
    // 重置按钮
    reset() {
      resetObj(this.queryForm, { page: 1, size: 10 })
      this.getList()
    },
    // 获取数据
    getList() {
      const data = this.handleQueryForm()
      const { line, orgId } = data
      if (!line || !orgId) return this.$message.warning('请先选择机构和条线')
      return this.$axios
        .post('/fn/reim/org/listOrgReim', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
          }
        })
    },
    // 获取培训班状态列表
    getExpenseStatus() {
      this.$axios.post('/fn/reim/self/selectReimDicts').then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const options = data.map((v) => ({
            label: v.dataValue,
            value: v.dataEncode
          }))
          this.statusOptions.push(...options)
        }
      })
    },
    // 查看报销单信息
    checkTrainingCourseOrderInfo(row) {
      const { reimId, reimIdFas, ifShare, classId, reimDept, line } = row
      const data1 = {
        reimIdFas
      }
      const data2 = { ifShare, classId, remiDept: reimDept, line }
      // 判断是1.0还是2.0接口
      if (row.isFastReim === 'Y') {
        var p1 = this.$axios.post(
          '/fn/reim/selfFast/selectFastReimInfoByFas',
          data1,
          jsonHeaders
        )
        var p2 = this.$axios.post(
          '/fn/reim/initFast/selectFastClassesInfo',
          data2,
          jsonHeaders
        )
      } else {
        p1 = this.$axios.post(
          '/fn/reim/self/selectReimInfoByFas',
          data1,
          jsonHeaders
        )
        p2 = this.$axios.post(
          '/fn/reim/init/selectClassesInfo',
          data2,
          jsonHeaders
        )
      }
      Promise.all([p1, p2]).then(([res1, res2]) => {
        const { code: code1, data: data1 } = res1.data
        const { code: code2, data: data2 } = res2.data
        if (code1 === 0 && code2 === 0) {
          data1.action = 'check'
          data1.row = row
          const { budgetTotalAmt, payedTotalAmt, occupyTotalAmt } = data2
          data1.primary.budgetTotalAmt = budgetTotalAmt
          data1.primary.payedTotalAmt = payedTotalAmt
          data1.primary.occupyTotalAmt = occupyTotalAmt
          // bugfix，selectFastClassesInfo返回的已付款金额及占用金额才是实时值
          data1?.details.forEach(v => {
            const payementInfo = data2.expenseDetails.find(m => m.expenseType === v.expenseType) || {}
            v.payedAmt = payementInfo.payedAmt || v.payedAmt
            v.occupyAmt = payementInfo.occupyAmt || v.occupyAmt
          })
          addAllowKeepAlive('/ViewReimbursement')
          this.$router.push({ name: '查看报销', params: data1 })
        }
      })
    },
    // 获取立项数据
    getEstablishProject(classId) {
      return this.$axios
        .post('/fn/classes/lixiang/showClass', { classId }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            return data
          }
        })
    },
    // 跳转到预览页面
    async openPreview(row) {
      const { classId, line } = row
      let data
      try {
        data = await this.getEstablishProject(classId)
      } catch {}
      if (!data) return
      data.blgStripLine = line
      addAllowKeepAlive('/PreviewEstablishProject')
      this.$router.push({
        name: '查看立项',
        params: { ...data }
      })
    },
    // 打开费用信息弹窗
    openCostInfo(row) {
      const { reimId, className, classAdviserName, operName, reimStatusCode } =
        row
      const reimStatus = this.deepSearchVal(
        this.statusOptions,
        reimStatusCode
      ).label
      const data = { reimId }
      this.$axios
        .post('/fn/reim/org/findOrgReimFeeDetail', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.projectName = className
            this.headTeacher = classAdviserName
            data.forEach((v) => {
              v.operName = operName
              v.reimStatus = reimStatus
            })
            this.costInfoTableList = data
            this.costInfoVisible = true
          }
        })
    }
  },
  mounted() {
    this.getExpenseStatus()
  }
}
</script>

<style lang="scss"></style>