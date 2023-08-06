<template>
  <div>
    <!-- 分摊详情 dialog -->
    <gc-model
      title="查看分摊详情"
      :visible="apportionDetailsVisible"
      :isShowFooter="false"
      width="1000px"
      @close="apportionDetailsClose"
    >
      <div class="menu-right">
        <span class="instructor-icons__upload" @click="apportionDetailsExport">
          <i class="instructor-icons__upload__icon"></i>
          导出</span
        >
      </div>
      <gc-table
        class="general__table"
        show-summary
        :list="apportionDetailsList"
        :tableList="apportionDetailsTableList"
        :summary-method="getSummaries"
      >
      </gc-table>
      <gc-pagination
        :total="apportionDetailsForm.total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[5, 10]"
        :page-size="apportionDetailsForm.pageSize"
        :current-page="apportionDetailsForm.currPage"
        @sizeChange="
          sizeChange($event, apportionDetailsForm, getApportionDetailsList)
        "
        @currentChange="
          currentChange($event, apportionDetailsForm, getApportionDetailsList)
        "
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </gc-model>
  </div>
</template>

<script>
import {
  sizeChange,
  jsonHeaders,
  currentChange,
  CopyObj
} from '../../../util/utils'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    dept: String,
    year: String,
    blgStripLine: String
  },
  data() {
    return {
      // 分摊详情 dialog
      apportionDetailsVisible: false,
      // 分摊详情 dialog 表格 字段数组
      apportionDetailsList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '项目名称',
          width: '242',
          prop: 'className'
        },
        {
          label: '部门',
          width: '200',
          prop: 'blgDeptName'
        },
        {
          label: '期数',
          width: '50',
          prop: 'terms'
        },
        {
          label: '每期分摊人数',
          width: '108',
          prop: 'stu'
        },
        {
          label: '总分摊人数',
          width: '106',
          prop: 'stuTotal'
        },
        {
          label: '备注',
          width: '124',
          prop: 'remark'
        }
      ],
      // 分摊详情 dialog 表格 数据数组
      apportionDetailsTableList: [],
      // 分摊详情 dialog 分页 表单
      apportionDetailsForm: {
        total: 0,
        currPage: 1,
        pageSize: 5
      }
    }
  },
  methods: {
    // 打开 查看分摊详情 dialog
    open() {
      this.$nextTick(() => {
        this.getApportionDetailsList()
        this.apportionDetailsVisible = true
      })
    },
    // 分摊详情导出
    apportionDetailsExport() {
      const { year, line, dept } = this.data
      const data = { year, line, dept }
      let params = ''
      Object.keys(data).forEach((v) => {
        params += '&' + [v, data[v]].join('=')
      })
     const url = `/tms-new/api/planupload/downloadApportion?${params.slice(1)}`
      window.location = url
    },
    // 查看分摊详情 dialog 表格 合计函数
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (index > 2 && index <= 5) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    // 分摊详情 dialog 表格 数据获取
    getApportionDetailsList() {
      const data = this.data
      data.page = this.apportionDetailsForm.currPage
      data.size = this.apportionDetailsForm.pageSize
      this.$axios
        .post('/fn/plan/annual/listPackageApportions', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            list.forEach((v) => {
              v.stuTotal = v.terms * v.stu
            })
            this.apportionDetailsTableList = list
            this.apportionDetailsForm.total = total
          }
        })
    },
    apportionDetailsClose() {
      this.apportionDetailsVisible = false
      this.apportionDetailsForm.currPage = 1
      this.apportionDetailsForm.pageSize = 5
      this.apportionDetailsForm.total = 0
      this.apportionDetailsTableList = []
    }
  }
}
</script>

<style></style>
