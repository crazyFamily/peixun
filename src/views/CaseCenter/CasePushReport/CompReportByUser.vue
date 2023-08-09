<template>
  <div>
    <el-card class="search-card">
      <el-form :model="queryForm" inline ref="querFormRef">
        <el-form-item label="完成时间" prop="daterange">
          <el-date-picker
            class="rms-daterange-picker"
            v-model="queryForm.daterange"
            type="daterange"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="案例名称" prop="caseInfo">
          <el-input
            v-model="queryForm.caseInfo"
            placeholder="案例编码/案例名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工" prop="user">
          <el-input v-model="queryForm.user" placeholder="姓名/UM号"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="exportHandle">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="event-list mt10">
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      ></table-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  fetchStudyUsersRelaByCasePushData,
  fetchExportStudyUsersRelaByCasePushData
} from '@/fetch/caseCenter'
import { CopyObj } from '@/util/utils'
export default {
  name: 'CompReportByUser',

  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },

  data() {
    return {
      queryForm: {
        casePushId: '',
        user: '',
        caseInfo: '',
        // startDate: '',
        // endDate: '',
       daterange: [],
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      list: [
        { label: '员工UM号', prop: 'umId' },
        { label: '员工姓名', prop: 'umName' },
        { label: '员工机构', prop: 'orgName' },
        { label: '案例名称', prop: 'caseName' },
        { label: '案例完成状态', prop: 'finishStr' },
        { label: '完成时间', prop: 'finishDate' }
      ],
      tableList: []
    }
  },

  watch: {
    id: {
      handler(n) {
        if (n) {
          this.queryForm.casePushId = n
          this.query()
        }
      },
      immediate: true
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    _formatParams(params) {
      let data = CopyObj(params)
      data.casePushId = data.casePushId.split('-')[0]
      if (data.daterange.length) {
        ;[data.startDate, data.endDate] = data.daterange
      } else {
        Reflect.deleteProperty(data, 'startDate')
        Reflect.deleteProperty(data, 'endDate')
      }
      return data
    },
    async getList() {
      if (!this.queryForm.casePushId) return
      let data = this._formatParams(this.queryForm)
      if (data.casePushId === null || data.casePushId === 'null') return
      let { total, list } = await fetchStudyUsersRelaByCasePushData({ data })
      this.queryForm.total = total
      this.tableList = list
    },
    reset() {
      this.$refs.querFormRef.resetFields()
      this.query()
    },
    async exportHandle() {
      let data = this._formatParams(this.queryForm)
      await fetchExportStudyUsersRelaByCasePushData({ data })
    },
    selectionHandle() {}
  }
}
</script>
<style lang='scss' scoped>
.rms-daterange-picker {
  width: 300px;
}

.search-card {
  :deep(.el-form-item) {
    margin-right: 30px;
  }
}
</style>
