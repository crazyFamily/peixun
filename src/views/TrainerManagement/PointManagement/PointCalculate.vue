<template>
  <div class="pointCalculate">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="评聘年度">
          <gc-select
            k="evaluateYearName"
            v="evaluateYearId"
            :options="yearsList"
            v-model="queryForm.evaluateYearId"
          >
          </gc-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="calculateHandle" type="primary"
            >手工计算</el-button
          >
          <el-button @click="refresh">刷新</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
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
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  fetchListEvaluationYear,
  fetchCalculateTrainersPoints,
  fetchCalPointsList,
  fetchExportCalPointsList
} from '@/fetch/pointManagement'
import { formatDate } from '@/util/utils'
import { _axios } from '@/plugins/axios'
export default {
  name: 'PointCalculate',

  props: {},

  data() {
    return {
      list: [
        {
          type: 'index',
          label: '序号',
          width: '75'
        },
        {
          label: '批次号',
          prop: 'batchNum',
          width: '110'
        },
        {
          label: '评聘年度',
          prop: 'evaluateYearName',
          width: '130'
        },
        {
          label: '计算开始时间',
          prop: 'startTime',
          width: '130'
        },
        {
          label: '计算结束时间',
          prop: 'endTime',
          width: '130'
        },
        {
          label: '计算状态',
          prop: 'calStatus'
        },
        {
          label: '执行人',
          prop: 'operator'
        },
        {
          label: '执行结果',
          prop: 'calResult'
        }
      ],
      tableList: [],
      queryForm: {
        evaluateYearId: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      yearsList: [{ label: 1, value: 0 }]
    }
  },

  components: {},

  computed: {},

  async mounted() {
    await this.getYearList()
    this.getList()
  },

  methods: {
    getYearList() {
      return new Promise(async (resolve) => {
        let res = await fetchListEvaluationYear()
        this.yearsList = res
        let year = formatDate(new Date()).split('-')[0]
        let findItem = this.yearsList.find(
          (item) => String(item.evaluateYearId) === year
        )
        this.queryForm.evaluateYearId = findItem
          ? String(findItem.evaluateYearId)
          : ''
        resolve()
      })
    },
    async getList() {
      let data = { ...this.queryForm, tip: 'Y' }
      let res = await fetchCalPointsList({ data })
      this.tableList = res.list
      this.queryForm.total = res.total
    },
    async calculateHandle() {
      if (!this.queryForm.evaluateYearId) {
        return this.$message.warning('必须要选则一个评聘年度')
      }
      await fetchCalculateTrainersPoints({
        evaluateYearId: String(this.queryForm.evaluateYearId)
      })
      this.$message.success('发送成功')

      // 数据重置后再请求
      let cacheYear = this.queryForm.evaluateYearId
      this.queryForm = this.$options.data.call(this).queryForm
      this.queryForm.evaluateYearId = cacheYear
      this.refresh()
    },
    async exportHandle() {
      let data = { ...this.queryForm, tip: 'N' }
      await fetchExportCalPointsList({ data })
    },
    refresh() {
      this.queryForm.currPage = 1
      this.getList()
    }
  }
}
</script>
<style lang='scss' scoped>
</style>