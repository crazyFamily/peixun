<template>
  <div class="TrainingCourse">
    <el-card class="search-card">
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
          <el-form-item label="项目日期" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.startTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="startPickerOptions"
              :clearable="false"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date">
            <el-date-picker
              v-model="queryForm.endTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :picker-options="endPickerOptions"
              :clearable="false"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="!isJF">
          <gc-select
            label="条线"
            :options="lineOptions"
            :clearable="false"
            v-model="queryForm.line"
          ></gc-select>
        </el-form-item>
        <div class="TrainingCourse__search-card__button search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card class="mt10">
      <div class="menu-right">
        <span
          class="instructor-icons__download"
          @click="
            handleExport(
              '/fn/reim/classes/exportSelectReimClassesList',
              getData()
            )
          "
        >
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <gc-table
        :tableList="tableList"
        :list="list"
        :vLoading="tableVLoading"
        class="general__table"
      >
        <template>
          <el-table-column min-width="90" prop="expenseName">
            <template slot="header">
              <gc-tablecolumnfilters
                label="费用类型"
                ref="costTypeRef"
                className="table__screen__icon"
                :list="moneyStateList"
                confirmText="确定"
                popperClass="circular"
                @filter="costTypeFilter"
                @reset="costTypeReset"
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>
          <el-table-column
            label="条线"
            width="60"
            prop="line"
          ></el-table-column>
          <el-table-column
            label="申请部门"
            min-width="170"
            prop="reimDeptName"
          ></el-table-column>
          <el-table-column min-width="70">
            <template slot="header">
              <gc-tablecolumnfilters
                label="状态"
                ref="trainingStateRef"
                className="table__screen__icon"
                :list="trainingStateList"
                radio
                confirmText="确定"
                popperClass="circular"
                @filter="trainingStateFilter"
                @reset="trainingStateReset"
              >
              </gc-tablecolumnfilters>
            </template>
            <template slot-scope="scope">
              {{ scope.row.classStatusName }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <div class="TrainingCourse__table-card">
                <span
                  class="mr20"
                  @click="
                    launchReimbursement(
                      scope.row,
                      fetchInitSelectClassesInfo
                    )
                  "
                >
                  <el-tooltip content="发起报销" popper-class="icon-popper">
                    <i
                      :class="
                        scope.row.classStatusName === '已结训'
                          ? 'operation__Reimbursement'
                          : 'operation__Reimbursement-disabled'
                      "
                    ></i>
                  </el-tooltip>
                </span>
                <span
                  class="TrainingCourse__table-card__operation__two"
                  @click="
                    launchReimbursement(
                      scope.row,
                      fetchSelectAdvancePay
                    )
                  "
                >
                  <el-tooltip content="发起预付款" popper-class="icon-popper">
                    <i
                      :class="
                        scope.row.expenseName === '举办费用'
                          ? 'operation__advance'
                          : 'operation__advance-disabled'
                      "
                    ></i>
                  </el-tooltip>
                </span>
              </div>
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
        @currentChange="currentChange"
        @sizeChange="sizeChange"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <InitiateReimbursements
      ref="initiate"
      :classesInfo="classesInfo"
      @comfirm="initiateComfirm"
    />
  </div>
</template>

<script>
import { CopyObj, formatDate } from '../../plugins/until'
import {
  addAllowKeepAlive,
  jsonHeaders,
  customHint,
  handleExport
} from '../../util/utils'
import { 
  fetchSelectAdvancePay,
  fetchSelectFastAdvancePay,
  API_SELECT_FAST_CLASSES_INFO,
  fetchInitSelectClassesInfo } from '@/fetch/reimbursement'
import InitiateReimbursements from './components/InitiateReimbursements'
export default {
  name: 'TrainingCourse',
  components: {
    InitiateReimbursements
  },
  data() {
    return {
      // 参数对象
      queryForm: {
        //培训班类型; 1: 培训班 2:非培训班
        classType: '01001',
        //项目编号
        classId: '',
        //项目名称
        className: '',
        //班主任(UM号或中文名)
        classAdviser: '',
        //项目日期--开始日期, 格式: yyyy-MM-dd
        startTime: '',
        //项目日期--结束日期, 格式: yyyy-MM-dd
        endTime: '',
        //费用类型
        expenseType: '',
        //培训班状态
        classStatus: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        line: ''
      },
      //总条数
      total: 0,
      //培训班数据列表
      tableList: [],
      //培训班数据列表 加载状态
      tableVLoading: false,
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
          width: '170'
        },
        {
          prop: 'classId',
          value: '项目编号',
          width: '80',
          label: '项目编号'
        },
        {
          prop: 'classTime',
          value: '项目时间',
          width: '159',
          label: '项目时间'
        },
        {
          prop: 'classAdviserName',
          value: '班主任',
          width: '70',
          label: '班主任'
        }
      ],
      //费用类型
      moneyStateList: [
        {
          value: 'N',
          label: '举办费用'
        },
        {
          value: 'Y',
          label: '分摊费用'
        }
      ],
      //培训班状态
      trainingStateList: [
        {
          value: '02003',
          label: '已结训'
        },
        {
          value: '02002',
          label: '进行中'
        }
      ],
      // 开始事件限制
      startPickerOptions: {
        disabledDate: (time) => {
          if (this.queryForm.endTime) {
            return !(formatDate(time) <= this.queryForm.endTime)
          }
          return false
        }
      },
      //结束时间限制
      endPickerOptions: {
        disabledDate: (time) => !(formatDate(time) >= this.queryForm.startTime)
      },
      lineOptions: [
        {
          label: '零售',
          value: 'LS'
        },
        {
          label: '非零',
          value: 'FL'
        }
      ],
      // InitiateReimbursements 组件所需的数据
      classesInfo: {},
      handleExport,
      fetchSelectAdvancePay,
      fetchSelectFastAdvancePay,
      API_SELECT_FAST_CLASSES_INFO,
      fetchInitSelectClassesInfo
    }
  },
  methods: {
    // 超时登出
    loginTimeout() {
      this.$alert('当前会话已超时，请重新登录！', '通知', {
        confirmButtonText: '知道了',
        customClass: 'loginTimeout'
      })
    },
    //跳转
    goPath(path) {
      this.$router.push({ path })
    },
    getData() {
      let data = CopyObj(this.queryForm)
      data.line = data.line || this.$store.state.userInfo.blgStripLine
      Object.keys(data).forEach((e) => {
        if (!data[e]) {
          delete data[e]
        }
      })
      return { data }
    },
    //获取培训班列表
    getTableList() {
      const data = this.getData()
      this.$axios
        .post('/fn/reim/classes/selectReimClassesList', data, jsonHeaders)
        .then((res) => {
          this.tableVLoading = false
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.tableList = list
            this.total = total
          }
        })
    },
    // 获取培训班列表
    query() {
      this.queryForm.currPage = 1
      this.getTableList()
    },
    // 重置查询参数
    reset() {
      Object.keys(this.queryForm).forEach((e) => (this.queryForm[e] = ''))
      this.queryForm.classType = '01001'
      this.queryForm.line = this.$store.state.userInfo.blgStripLine
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getTableList()
      this.$refs.costTypeRef.$set()
      this.$refs.trainingStateRef.$set()
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
      list = list.list
      this.queryForm.currPage = 1
      this.queryForm.expenseType = list.length === 1 ? list[0] : ''
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
      list = list.list
      this.queryForm.currPage = 1
      this.queryForm.classStatus = list.length === 1 ? list[0] : ''
      this.getTableList()
    },
    //重置培训班状态
    trainingStateReset() {
      this.queryForm.currPage = 1
      this.queryForm.classStatus = ''
      this.getTableList()
    },
    //  发起报销处理函数
    launchReimbursement(row, url) {
      if (
        row.classStatusName !== '已结训' &&
        url === this.fetchInitSelectClassesInfo
      ) {
        return
      } else if (
        row.expenseName !== '举办费用' &&
        url === this.fetchSelectAdvancePay
      ) {
        return
      }
      // 判断是发起1.0还是2.0接口
      if(url === this.fetchInitSelectClassesInfo){
        url = this.API_SELECT_FAST_CLASSES_INFO
      } else if (url === this.fetchSelectAdvancePay) {
        url = this.fetchSelectFastAdvancePay
      }
      const {
        classId,
        expenseType,
        className,
        classAdviser,
        classAdviserName,
        reimDept,
        reimDeptName
      } = row
      customHint(
        `当前选择的申请部门：<span style="color: #fd6720">${reimDeptName}</span>
                    <br>请确认是否选择正确，避免报销被驳回！`,
        '请确认申请部门',
        '取消'
      ).then(() => {
        const line = row.line === '零售' ? 'LS' : 'FL'
        this.$axios
          .post(
            url,
            {
              classId,
              ifShare: expenseType,
              remiDept: reimDept,
              line
            },
            jsonHeaders
          )
          .then((res) => {
            const { code, data, msg } = res.data
            if (code === 0) {
              data.row = row
              data.action = 'add'
              data.ifShare = expenseType
              data.reimClassType = '1'
              if (url === this.API_SELECT_FAST_CLASSES_INFO) {
                data.reimType = 'PT'
              } else {
                data.reimType = 'YFK'
              }
              data.classAdviser = classAdviser
              data.classAdviserName = classAdviserName
              data.className = className
              if (row.expenseName === '举办费用') {
                data.expenseDetails = data.expenseDetails.filter(
                  (v) => v.budgetAmt > 0
                )
              }
              addAllowKeepAlive('/LaunchReimbursement')
              data.line = line
              this.$router.push({
                name: '发起报销',
                params: data
              })
              return
            } else if (code === 1003) {
              this.$alert('该立项预算金额为零，不可以发起报销', '通知', {
                confirmButtonText: '知道了',
                customClass: 'loginTimeout'
              })
            }
          })
      })
    },
    initiateComfirm(results) {
      this?.delay(results)
    }
  },
  mounted() {
    // this.$el.querySelector(".el-table__empty-block").style.opacity = 0;
    // this.tableVLoading = true;

    const classId = this.$route.query.classId
    this.queryForm.line = this.$store.state.userInfo.blgStripLine
    if (classId) {
      this.queryForm.classId = classId
      this.query()
    }
  },
  computed: {
    isJF() {
      return this.$store.state.userInfo.blgStripLine === 'JF'
    }
  }
}
</script>

<style lang="scss"></style>