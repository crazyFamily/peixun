<template>
  <div class="case-report-table">
    <el-card class="search-card">
      <div class="search-card__button">
        <el-button @click="exportHandle">导出</el-button>
      </div>
    </el-card>
    <el-card>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
        v-loading="isLoading"
      >
        <el-table-column slot="finishRate" label="推送完成率" width="255">
          <template slot-scope="scope">
            <div class="complete-container">
              <div class="chart-container">
                <div
                  class="finish-container"
                  :style="`width: ${scope.row.finishRate}%`"
                >
                  <span class="animate-rate"></span>
                </div>
                <div class="total-container"></div>
              </div>
              <p class="label">{{ scope.row.finishRate }}%</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <span class="active" @click="showDetailHandle(scope.row)"
              >查看</span
            >
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  fetchCasePushByCaseReportData,
  fetchExportCasePushByCaseReportData
} from '@/fetch/caseCenter'
import { CopyObj } from '@/util/utils'
export default {
  name: 'CompReportByCase',

  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },

  data() {
    return {
      queryForm: {
        id: this.id,
        currPage: 1,
        pageSize: 10,
       total: 0
      },
      list: [
        {
          label: '案例编号',
          prop: 'caseId',
          formatter: (row) => row.caseIdStr
        },
        { label: '案例名称', prop: 'caseName' },
        { label: '推送人数', prop: 'pushUserNum' },
        { label: '完成人数', prop: 'finishUserNum' },
        { label: '未完成人数', prop: 'unFinishUserNum' },
        { slot: 'finishRate' }
      ],
      tableList: [],
      isLoading: false
    }
  },

  watch: {
    id: {
      handler(n) {
        if (n) {
          this.queryForm.id = n
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
    getList() {
      if (!this.queryForm.id) return
      this.isLoading = true
      let data = CopyObj(this.queryForm)
      data.id = data.id.split('-')[0]
      if (data.id === null || data.id === 'null') return
      fetchCasePushByCaseReportData({ data })
        .then(({ total, list }) => {
          this.tableList = list
          this.queryForm.total = total
        })
        .finally(() => {
          this.isLoading = false
        })
      // let { total, list } = await fetchCasePushByCaseReportData({ data })
      // this.isLoading = false
    },
    reset() {
      this.tableList = []
    },
    async exportHandle() {
      let data = CopyObj(this.queryForm)
      data.id = data.id.split('-')[0]
      if (data.id === null || data.id === 'null') return
      await fetchExportCasePushByCaseReportData({ data })
    },
    showDetailHandle(row) {
      this.$emit('toDetail', {
        ...row,
        casePushId: this.queryForm.id.split('-')[0]
      })
    }
  },
  activated() {}
}
</script>
<style lang="scss" scoped>
.complete-container {
  display: flex;
  align-items: center;
}

.chart-container {
  width: 100px;
  height: 6px;
  border-radius: 5px;
  margin-right: 10px;
  margin-bottom: 2px;
  overflow: hidden;
  position: relative;
}

.total-container {
  width: 100%;
  height: 100%;
  background-color: #f3f3f5;
}

.finish-container {
  width: 0;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  .animate-rate {
    display: block;
    width: 100%;
    height: 100%;
    background-color: $themeColor;
    animation: finish-rate 0.5s;
  }
}

.search-card {
  :deep(.el-card__body) {
    display: flex;
    justify-content: flex-end;
  }
}

@keyframes finish-rate {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
