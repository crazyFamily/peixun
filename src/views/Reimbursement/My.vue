<template>
  <div class="My" v-loading="getLoadingStatus('LOADING_CASECENTER_MANAGE_LIST')">
    <el-card class="My__search-card search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item>
          <gc-input
            label="项目编号"
            v-model.trim="queryForm.classId"
          ></gc-input>
        </el-form-item>
        <el-form-item>
          <gc-input
            label="项目名称"
            v-model.trim="queryForm.className"
          ></gc-input>
        </el-form-item>
        <el-form-item>
          <gc-input
            label="培训班主任"
            v-model.trim="queryForm.classAdviser"
          ></gc-input>
        </el-form-item>

        <el-form-item>
          <gc-input
            label="报账单号"
            v-model.trim="queryForm.reimIdFas"
          ></gc-input>
        </el-form-item>

        <el-form-item>
          <el-form-item label="记账日期" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.apAccountDateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
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
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>

        <el-form-item>
          <el-form-item label="报账日期" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.submitDateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
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
              v-model="queryForm.submitDateEnd"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        
        <div class="My__search-card__button search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card class="My__table-card mt10">
      <div class="menu-right">
        <span
          class="instructor-icons__download"
          @click="
            handleExport('/fn/reim/self/exportSelectMyReimburseList', getData())
          "
        >
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <gc-table
        :tableList="tableList"
        :list="list"
        :stripe="false"
        :vLoading="tableVLoading"
        class="general__table"
      >
        <template>
          <el-table-column min-width="200" label="报账单号">
            <template slot-scope="scope">
              <span
                class="active"
                @click="checkTrainingCourseOrderInfo(scope.row)"
              >
                {{ scope.row.reimIdFas }}
              </span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" label="记账日期">
            <template slot-scope="scope">
                {{ scope.row.apAccountDate }}
            </template>
          </el-table-column>

          <el-table-column min-width="80" label="报销金额" prop="reimTotalAmt">
          </el-table-column>

          <el-table-column
            min-width="94"
            label="实际报销金额"
            prop="payedTotalAmt"
          >
          </el-table-column>

          <el-table-column
            min-width="86"
            label="培训班主任"
            prop="classAdviserName"
          >
          </el-table-column>

          <el-table-column min-width="110" label="报账日期">
            <template slot-scope="scope">
              {{ scope.row.expenseDate.split(' ')[0] }}
            </template>
          </el-table-column>

          <el-table-column min-width="90">
            <template slot="header">
              <gc-tablecolumnfilters
                label="报销状态"
                className="table__screen__icon"
                :list="expenseStatus"
                confirmText="确定"
                popperClass="circular m183"
                @filter="costTypeFilter"
                @reset="costTypeReset"
                ref="tablecolumnfiltersOne"
                radio
              >
              </gc-tablecolumnfilters>
            </template>
            <template slot-scope="scope">
              {{ scope.row.reimStatusName }}
              <el-popover popper-class="mr20" :key="randomKey" v-if="scope.row.dataFunc === '3' && (scope.row.reimStatus === 'T02' || scope.row.reimStatus === RETURNED)">
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
          <el-table-column label="操作" min-width="90">
            <template slot-scope="scope">
              <el-tooltip
                placement="left"
                :visible-arrow="false"
                popper-class="bgf shadow-1"
              >
                <div slot="content" class="tooltip__operation">
                  <template
                    v-if="scope.row.dataFunc == 3 || scope.row.dataFunc == 2"
                  >
                    <span
                      class="active"
                      @click="goEditReimbursementInfoPage(scope.row)"
                    >
                      修改
                    </span>
                    <span
                      class="active"
                      v-if="scope.row.dataFunc == 3"
                      @click="delReimbursementInfo(scope.row)"
                    >
                      删除
                    </span>
                  </template>
                  <span
                    v-if="scope.row.reimStatus === '02'"
                    class="active"
                    @click="withdrawReim(scope.row)"
                    >撤回</span
                  >
                </div>
                <el-button class="button-48-24">操作</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </template>
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { CopyObj, formatDate } from '../../plugins/until'
import { jsonHeaders, handleExport, addAllowKeepAlive, getLoadingStatus } from '../../util/utils'
import {fetchMyReimburseList,fetchSelectReimDicts,fetchDeleteFastReimburseInfo,fetchFindFailReason, fetchSelectFastClassesInfo } from '@/fetch/reimbursement'
import { ISSHARE, RETURNED } from './enum'
export default {
  name: 'MyReimbursement',
  data() {
    return {
      // 参数对象
      queryForm: {
        //登录UM号
        umId: '',
        //财务报账单号
        // reimIdFas: '',
        //项目编号
        classId: '',
        //项目名称
        className: '',
        //培训班主任
        applyName: '',
        // 报账单号
        reimIdFas: '',
        //项目日期--开始日期, 格式: yyyy-MM-dd
        submitDateStart: '',
        //项目日期--结束日期, 格式: yyyy-MM-dd
        submitDateEnd: '',
        //培训班主任/UM
        classAdviser: '',
        //培训班状态
        reimStatus: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        apAccountDateStart: '',
        apAccountDateEnd: ''
      },
      //总条数
      total: 0,
      //培训班 table字段列表
      list: [
        {
          type: 'index',
          width: '54',
          label: '序号'
        },
        {
          prop: 'className',
          value: '项目名称',
          label: '项目名称',
          width: '160'
        },
        {
          prop: 'classId',
          value: '项目编号',
          width: '80',
          label: '项目编号'
        }
      ],
      //培训班数据列表
      tableList: [],
      //培训班数据列表 加载状态
      tableVLoading: false,
      //报销状态
      expenseStatus: [],
      // 开始事件限制
      startPickerOptions: {
        disabledDate: (time) => {
          if (this.queryForm.submitDateEnd) {
            return !(formatDate(time) <= this.queryForm.submitDateEnd)
          }
          return false
        }
      },
      //结束时间限制
      endPickerOptions: {
        disabledDate: (time) =>
          !(formatDate(time) >= this.queryForm.submitDateStart)
      },
      handleExport,
      randomKey: Math.random(),
      getLoadingStatus,
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
        row.failInfo = res || (row.reimStatus === this.RETURNED ? '人为操作退回/撤回，无失败原因' : '未查询到失败原因')
        this.randomKey = Math.random()
        this.$nextTick(() => {
          this.$refs['popoverIcon-'+ row.reimId].dispatchEvent(new MouseEvent('click'));
        })
      })
    },
    loginTimeout() {
      this.$alert('当前会话已超时，请重新登录！', '通知', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout`
      })
    },
    goPath(path) {
      this.$router.push({ path })
    },
    getData() {
      let data = CopyObj(this.queryForm)
      data.umId = this.$store.state.userInfo.umId
      Object.keys(data).forEach((e) => {
        if (!data[e]) {
          delete data[e]
        }
      })
      return { data }
    },
    //获取我的报销列表
    getTableList() {
      const data = this.getData()
      fetchMyReimburseList(data).then(res => {
        const { list, total } = res || {}
        this.tableList = list
        this.total = total
      })
      .finally(() => {
        this.tableVLoading = false
      })
    },
    // 获取培训班列表
    query() {
      this.queryForm.currPage = 1
      this.tableVLoading = true
      this.getTableList()
    },
    // 重置查询参数
    reset() {
      Object.keys(this.queryForm).forEach((e) => {
        this.queryForm[e] = ''
      })
      this.queryForm.classType = 1
      this.queryForm.pageSize = 10
      this.queryForm.currPage = 1
      this.getTableList()
      this.$refs.tablecolumnfiltersOne.$reset()
    },
    // 分页 的页码改变 回掉函数
    currentChange(page) {
      this.queryForm.currPage = page.pageNum
      this.getTableList()
    },
    // pagesize 改变的回掉函数
    sizeChange(pagesize) {
      this.queryForm.pageSize = pagesize.pageSize
      this.getTableList()
    },
    // 筛选 费用类型
    costTypeFilter(list) {
      this.queryForm.currPage = 1
      this.queryForm.reimStatus = list.list.join(';')
      this.getTableList()
    },
    //重置费用类型
    costTypeReset() {
      this.queryForm.currPage = 1
      this.queryForm.expenseType = ''
      this.getTableList()
    },
    // 筛选 培训班状态
    trainingStateFilter(list) {
      this.queryForm.currPage = 1
      this.queryForm.classStatus = list
      this.getTableList()
    },
    //重置培训班状态
    trainingStateReset() {
      this.queryForm.currPage = 1
      this.queryForm.classStatus = ''
      this.getTableList()
    },
    // 获取报销信息并跳转到编辑报销界面
    goEditReimbursementInfoPage(row) {
      const { reimId, reimIdFas, ifShare, classId, reimDept } = row
      const line = row.line === '零售' ? 'LS' : 'FL'
      const data1 = {
        reimId,
        reimIdFas
      }
      const data2 = { ifShare, classId, remiDept: reimDept, line }
      // 判断是发起1.0还是2.0接口
      if(row.isFastReim === 'Y') {
        var p1 = this.$axios.post(
          '/fn/reim/selfFast/selectFastReimInfoForUpdate',
          data1,
          jsonHeaders
        )
        // var p2 = this.$axios.post(
        //   '/fn/reim/initFast/selectFastClassesInfo',
        //   data2,
        //   jsonHeaders
        // )
        var p2 = fetchSelectFastClassesInfo(data2)
      } else {
        p1 = this.$axios.post(
          '/fn/reim/self/selectReimInfoForUpdate',
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
        const { payedTotalAmt, occupyTotalAmt } = data2
        if (code1 === 0 && code2 === 0) {
          data1.action = 'edit'
          data1.row = row
          _.merge(data2, data1.primary)
          data1.primary = data2
          // bugfix，ifShare为Y代表的是费用分摊，报账明细的单条数据已付款金额及已占用金额都一直是0，所以要根据selectFastClassesInfo的数据展示
          if(ifShare === ISSHARE) {
            data1.primary.payedTotalAmt = payedTotalAmt
            data1.primary.occupyTotalAmt = occupyTotalAmt
          }
          // bugfix，selectFastClassesInfo返回的已付款金额及占用金额才是实时值
          data1?.details.forEach(v => {
            const payementInfo = data2.expenseDetails.find(m => m.expenseType === v.expenseType) || {}
            v.payedAmt = payementInfo.payedAmt || v.payedAmt
            v.occupyAmt = payementInfo.occupyAmt || v.occupyAmt
          })
          addAllowKeepAlive('/LaunchReimbursement')
          data1.line = line
          this.$router.push({ name: '发起报销', params: data1 })
        }
      })
    },
    // 删除一条报销信息
    delReimbursementInfo(row) {
      const data = { reimId: row.reimId }
      if(row.isFastReim === 'Y') {
        fetchDeleteFastReimburseInfo(data).then(res => {
          this.getTableList()
          this.$message.success('删除成功')
        })
        return
      }
      this.$axios
        .post('/fn/reim/self/deleteReimburseInfo', data, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.getTableList()
            this.$message.success('删除成功')
          }
        })
    },
    // 撤回报销单
    withdrawReim(row) {
      const { reimId } = row
      this.$axios
        .post(row.isFastReim === 'Y' ? '/fn/reim/selfFast/withdrawFastReim' : '/fn/reim/self/withdrawReim', { reimId }, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message('撤销成功')
            this.getTableList()
          }
        })
    },
    // 查看报销单信息
    checkTrainingCourseOrderInfo(row) {
      const { reimId, reimIdFas, ifShare, classId, reimDept } = row
      const line = row.line === '零售' ? 'LS' : 'FL'
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
        // var p2 = this.$axios.post(
        //   '/fn/reim/initFast/selectFastClassesInfo',
        //   data2,
        //   jsonHeaders
        // )
        var p2 = fetchSelectFastClassesInfo(data2)
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
    // 获取报销状态列表
    getExpenseStatus() {
      fetchSelectReimDicts({}).then(res => {
        const options = res?.map((v) => ({
          label: v.dataValue,
          value: v.dataEncode
        }))
        this.expenseStatus.push(...options)
      })
    },
    initTableList() {
      if (this.$store.state.userInfo.umId) {
        this.getTableList()
      } else {
        setTimeout(this.initTableList, 100)
      }
    }
  },
  mounted() {
    this.$el.querySelector('.el-table__empty-block').style.opacity = 0
    this.tableVLoading = true
    this.initTableList()
    this.getExpenseStatus()
  },
  activated() {
    this.initTableList()
  }
}
</script>

<style lang="less" scoped>
.search-card {
  :deep(.el-form-item) {
    margin-right: 30px;
  }
}
</style>

<style lang="scss">
body {
  :deep(.popover-cont) {
    padding: 10px;
    max-width: 700px;
    min-height: 50px;
  }
}
</style>