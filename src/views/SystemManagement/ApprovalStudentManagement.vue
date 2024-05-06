<template>
  <div class="systemManagement__approvalStudentManagement">
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="机构" class="first">
          <gc-institution v-model="queryForm.busiType"> </gc-institution>
        </el-form-item>
      </el-form>
      <div class="search-card__button">
        <el-button @click="query" type="primary">查询</el-button>
      </div>
    </el-card>
    <el-card class="mt10">
      <gc-table class="general__table" :list="list" :tableList="tableList">
        <el-table-column label="UM号" min-width="200">
          <div class="df" slot-scope="scope">
            <el-autocomplete
              class="w-200"
              value-key="empName"
              placeholder="请输入UM号/姓名"
              :trigger-on-focus="false"
              v-model.trim="scope.row.umId"
              :fetch-suggestions="querySearch"
            ></el-autocomplete>
            <el-button
              class="button-w80-h30"
              type="primary"
              @click="saveUmId(scope.row)"
              >保存</el-button
            >
          </div>
        </el-table-column>
      </gc-table>
    </el-card>
  </div>
</template>

<script>
import { CopyObj, personRe, querySearch, jsonHeaders } from '../../util/utils'
export default {
  name: 'ApprovalStudentManagement',
  data() {
    return {
      // 查询用的表单
      queryForm: {
        // 条线
        busiType: [],
        orgId: ''
      },
      total: 0,
      // 字段数组
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: '机构',
          prop: 'orgName',
          width: '100'
        },
        {
          label: '角色',
          prop: 'roleName',
          width: '100'
        }
      ],
      // 数据数组
      tableList: [],
      querySearch
    }
  },
  methods: {
    // 处理请求数据
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      ;[data.busiType, data.orgId] = data.busiType
      return data
    },
    // 查询
    query() {
      if (this.queryForm.busiType.length < 2) {
        return this.$message.warning('请先选择机构')
      }
      this.getList()
    },
    // 获取数据
    getList() {
      const data = this.getQueryForm()
      this.$axios
        .post('/fn/system/func/listEoaChainEmployee', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const result = data.employeeList || []
            result.forEach((v) => {
              if (v.umId) {
                v.umId = `${v.empName}(${v.umId})`
              }
            })
            this.tableList = result
          }
        })
    },
    // 清除umid
    clearUmId(row) {
      row.umId = ''
    },
    // 保存 umid
    saveUmId(row) {
      const { roleId, orgId, umId } = row
      const match = personRe.exec(umId)
      const data = { roleId, orgId, umId: match?.[2] || '' }
      this.$axios
        .post('/fn/system/func/modifyEoaChainEmployee', { data }, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('修改成功')
          }
        })
    }
  }
}
</script>

<style lang="scss"></style>