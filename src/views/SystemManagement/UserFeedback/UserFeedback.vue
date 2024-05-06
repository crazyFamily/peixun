<template>
  <div class="SystemManagement__UserFeedback">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="用户姓名/UM">
          <el-input
            placeholder="请输入用户姓名/UM"
            v-model="queryForm.umOrName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="反馈时间" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.startDate"
              type="date"
              placeholder="开始日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endDate"
              type="date"
              placeholder="结束日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
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

    <!-- 内容card -->
    <el-card class="mt10">
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="active" @click="openInfo(scope.row)">查看</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  filterObj,
  resetObj,
  addAllowKeepAlive,
  jsonHeaders
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  name: 'UserFeedback',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        umOrName: '',
        startDate: '',
        endDate: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      list: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '用户姓名',
          prop: 'empName'
        },
        {
          label: '用户UM号',
          prop: 'umId'
        },
        {
          label: '用户所属机构',
          prop: 'orgName'
        },
        {
          label: '反馈时间',
          prop: 'createdDate'
        }
      ],
      tableList: []
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10, total: 0 })
      this.getList()
    },
    getList() {
      const condition = filterObj(this.queryForm)
      const { currPage, pageSize } = condition
      this.$axios
        .post(
          '/fn/homeOperate/zx/listFeedBack',
          { condition, currPage, pageSize },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.tableList = list
            this.queryForm.total = total
          }
        })
    },
    openInfo(row) {
      const { id } = row
      this.$axios
        .post('/fn/homeOperate/zx/findFeedBack', { id }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            addAllowKeepAlive('/FeedbackInfo')
            this.$router.push({
              name: '用户反馈/查看详情',
              params: data
            })
          }
        })
    }
  },
  activated() {
    this.query()
  }
}
</script>
<style lang="scss"></style>