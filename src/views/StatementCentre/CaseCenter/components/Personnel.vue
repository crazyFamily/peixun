<template>
  <div class="StatementCentre__OnlineStatistic__Personnel">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="员工归属" class="">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              busiType="LS"
              :left-show="false"
              :default-show="true"
              :fetchParams="{ module: CASE_MODULE }"
              :otherParams="{ module: CASE_MODULE }"
              @setDataFinish="orgIdsFinish"
              ref="institutionRef"
            >
            </gc-institution>
          </div>
        </el-form-item>
        <el-form-item label="学习时间">
          <time-chunk v-model="queryForm.date"></time-chunk>
        </el-form-item>
        <el-form-item label="员工信息">
          <el-input
            v-model="queryForm.employeeInfo"
            placeholder="员工姓名/员工编号"
          ></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="exportHandle">
          <i class="instructor-icons__add__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        class="table-left"
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
        v-loading="getLoadingStatus('LOADING_CASE_EMPLOYEE_STATISTICS')"
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
// 按机构统计
import {
  jsonHeaders,
  resetObj,
  handleBlob,
  CopyObj,
  filterObj,
  getLoadingStatus
} from '@/util/utils'
import { fetchCaseEmployeeStatisticsList } from '@/fetch/statementCentre'
import { CASE_MODULE } from '../../enum'
export default {
  props: {},

  data() {
    return {
      list: [
        {
          label: '员工UM号',
          prop: 'umId',
          width: '150'
        },
        {
          label: '员工姓名',
          prop: 'umName',
          width: '150'
        },
        {
          label: '员工机构',
          prop: 'orgName',
          width: '160'
        },
        {
          label: '学习案例数',
          prop: 'studyCaseNum',
          width: '100'
        },
        {
          label: '完成案例数',
          prop: 'finishCaseNum',
          width: '100'
        },
        {
          label: '有效学习时长(单位：分钟)',
          width: '160',
          prop: 'convertEffectTime'
        },
        {
          label: '累计学习时长(单位：分钟)',
          width: '160',
          prop: 'convertCumulativeTime'
        }
      ],
      tableList: [],
      queryForm: {
        orgIds: [],
        date: {},
        currPage: 1,
        pageSize: 10
      },
      cacheOrgIds: [],
      getLoadingStatus,
      CASE_MODULE
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    orgIdsFinish() {
      this.queryForm.id = this.caseId
      this.cacheOrgIds = CopyObj(this.queryForm.orgIds)
      this.query()
    },
    // 执行查询
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 表单重置
    reset() {
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10,
        total: 0,
        id: this.caseId,
        orgIds: this.cacheOrgIds
      })
      this.$refs.tablePagination.resetFilters()
      this.$refs.institutionRef.createTreeData()
    },
    // 格式化发送数据
    _formatSendParams(params) {
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      const { start, end } = data.date || {}
      data.startDate = start
      data.endDate = end
      Reflect.deleteProperty(data, 'orgIds')
      Reflect.deleteProperty(data, 'date')
      return data
    },
    // 拉取数据
    async getList() {
      let data = this._formatSendParams(this.queryForm)
      data.tip = 'Y'
      const { total, list } = await fetchCaseEmployeeStatisticsList({ data })
      this.queryForm.total = total
      this.tableList = list
    },
    // 导出
    exportHandle() {
      let data = this._formatSendParams(this.queryForm)
      data.tip = 'N'
      this.$axios
        .post(
          '/fn/report/case/caseEmployeeStatisticsList',
          { data },
          { ...jsonHeaders, responseType: 'blob' }
        )
        .then((res) => {
          if (res.data.type === 'application/json') {
            const reader = new FileReader()
            const that = this
            reader.onload = function (event) {
              var content = reader.result //内容就在这里
              that.$message.error(JSON.parse(content).msg)
            }
            reader.readAsText(res.data)
          } else {
            handleBlob(res)
          }
        })
    }
  }
}
</script>
<style lang="scss"></style>