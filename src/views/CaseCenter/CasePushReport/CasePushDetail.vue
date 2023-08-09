<template>
  <div>
    <el-card class="search-card">
      <el-form :model="queryForm" inline ref="querFormRef">
        <el-form-item label="状态" prop="qryType">
          <el-radio-group
            v-model="queryForm.qryType"
            class="rms-radio-group"
            @change="statusChangeHandle"
          >
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="finished">已完成</el-radio-button>
            <el-radio-button label="unFinish">未完成</el-radio-button>
          </el-radio-group>
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
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
    </div>
  </div>
</template>

<script>
import {
  fetchStudyUsersByCasePushData,
  fetchExportStudyUsersByCasePushData
} from '@/fetch/caseCenter'
export default {
  name: 'CasePushDetail',

  props: {
    detailData: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      list: [
        { label: '员工UM号', prop: 'umId' },
        { label: '员工姓名', prop: 'umName' },
        { label: '员工机构', prop: 'orgName' },
        { label: '案例完成状态', prop: 'finishStr' },
        { label: '完成时间', prop: 'finishDate' }
      ],
      queryForm: {
        casePushId: '',
        caseId: '',
        user: '',
        qryType: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      qryType: ''
    }
  },

  watch: {
    detailData: {
      handler(n) {
        if (Object.keys(n).length) {
          let { casePushId, caseId } = n
          this.queryForm.casePushId = casePushId
          this.queryForm.caseId = caseId
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
    async getList() {
      let data = this.queryForm
      let { total, list } = await fetchStudyUsersByCasePushData({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    reset() {
      this.$refs.querFormRef.resetFields()
      this.query()
    },
    async exportHandle() {
      let data = this.queryForm
      await fetchExportStudyUsersByCasePushData({ data })
    },
    closeHandle() {
      this.reset()
      this.$nextTick(() => {
        this.$emit('change', 'list')
      })
    },
    statusChangeHandle() {
      this.$nextTick(() => {
        this.query()
      })
    }
  },

  activated() {
    // this.query()
  }
}
</script>
<style lang='scss' scoped>
.rms-radio-group {
  :deep(.el-radio-button__inner) {
    font-size: 12px;
    font-weight: initial;
    padding: 8px 10px;
  }
}
</style>
