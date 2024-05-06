<template>
  <div class="TrainerManagement">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline class="search-form">
        <el-form-item label="标题">
          <el-input v-model="queryForm.mailTitle"></el-input>
        </el-form-item>
        <el-form-item label="发送状态">
          <gc-select
            :options="mailStatusOptions"
            v-model="queryForm.mailStatus"
          ></gc-select>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="icons menu-right">
        <span class="icons__del" @click="handleDel">
          <i class="icons__del__icon"></i>
          删除
        </span>
      </div>
      <gc-table
        class="general__table"
        ref="tableRef"
        :list="list"
        :tableList="tableList"
      >
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[10, 20, 100]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      />
    </el-card>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  hintFrame,
  handleBlob,
  sizeChange,
  formatDate,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
export default {
  name: 'EmailManagement',
  mixins: [handlePickerOptions],
  data() {
    return {
      // 查询用的表单
      queryForm: {
        mailTitle: '',
        blgLine: '',
        mailStatus: '',
        mailBody: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      total: 0,
      mailStatusOptions: [
        {
          label: '不发送',
          value: '0'
        },
        {
          label: '待发送',
          value: '1'
        },
        {
          label: '发送成功',
          value: '2'
        },
        {
          label: '发送失败',
          value: '3'
        }
      ],
      // 字段数组
      list: [
        {
          type: 'selection'
        },
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: '接收人',
          prop: 'mailTo',
          width: '140'
        },
        {
          label: '标题',
          prop: 'mailTitle',
          width: '120'
        },
        // {
        //     label: "内容",
        //     prop: "mailBody	",
        //     width: "120"
        // },
        {
          label: '内容数据',
          prop: 'mailBodyData',
          width: '120'
        },
        {
          label: '条线',
          prop: 'blgLine',
          width: '60'
        },
        {
          label: '发送状态',
          prop: 'mailStatus',
          width: '80'
        },
        {
          label: '发送时间',
          prop: 'mailSendTime',
          width: '100'
        },
        {
          label: '更新时间',
          prop: 'updatedDate',
          width: '100'
        }
      ],
      // 数据数组
      tableList: [],
      // 分页函数
      sizeChange,
      currentChange
    }
  },
  methods: {
    // 处理请求数据
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      data.blgLine = this.$store.state.userInfo.blgStripLine
      return data
    },
    // 查询
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    // 重置
    reset() {
      resetObj(this.queryForm)
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    // 获取数据
    getList() {
      const data = this.getQueryForm()
      this.$axios
        .post('/fn/system/mail/listMails', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
          }
        })
    },
    handleDel() {
      const selection = this.$refs.tableRef.$children[0].selection
      if (selection.length < 1) return
      hintFrame('确认删除这些邮件？').then((res) => {
        const ids = selection.map((v) => v.id)
        const data = { ids }
        this.$axios
          .post('/fn/system/mail/removeMails', { data }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.query()
              this.$message.success('删除成功')
            }
          })
      })
    }
  }
}
</script>

<style lang="scss"></style>