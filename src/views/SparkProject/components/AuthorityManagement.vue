<template>
  <div class="AuthorityManagement">
    <el-form :model="queryForm" class="clearfix" inline>
      <el-form-item label="岗位" class="mr60">
        <gc-institution v-model="queryForm.orgIds" busiType="LS" :left-show="false" :default-show="true" @setDataFinish="orgIdsFinish" ref="institutionRef">
        </gc-institution>
      </el-form-item>
      <el-form-item label="姓名" class="mr60">
        <el-input v-model.trim="queryForm.umId" placeholder="输入姓名/UM号" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" class="mr60">
        <el-date-picker class="rms-daterange-picker" v-model="queryForm.daterange" type="daterange" :clearable="false" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="选择开始日期" end-placeholder="选择结束日期">
        </el-date-picker>
      </el-form-item>
      <div class="fr">
        <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
        <el-button @click="reset" class="button-w80-h30">重置</el-button>
      </div>
    </el-form>
    <div class="menu-right mt15">
      <span class="instructor-icons__upload" @click="exportTable"><i class="instructor-icons__download__icon"></i>导出</span>
    </div>
    <table-pagination v-loading="loadingTable" :list="list" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePagination">
      <el-table-column label="操作" width="130">
        <template slot-scope="scope">
          <span class="active" @click="checkApply(scope.row)">{{scope.row.isValid === 'N' ? '开启' : '关闭'}}</span>
        </template>
      </el-table-column>
    </table-pagination>
  </div>
</template>

<script>
import { CopyObj, filterObj, resetObj } from '@/util/utils'
import {
  fetchListPermissionManager,
  fetchAdjustApplyStatus,
  fetchExportPermissionManager
} from '@/fetch/sparkProject'
export default {
  name: 'AuthorityManagement',
  data() {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        busiType: this.$store.state.userInfo.blgStripLine || 'LS'
      },
      loadingTable: false,
      list: [
        {
          label: '姓名',
          prop: 'empName'
        },
        {
          label: 'UM号',
          prop: 'umId',
          width: '120'
        },
        {
          label: '机构',
          prop: 'orgName',
          width: '226'
        },
        {
          label: '入职时间',
          prop: 'dateHire',
          width: '120'
        },
        {
          label: '权限状态',
          prop: 'isValidDesc',
          type: 'tablecolumnfilters',
          labelKey: 'isValid',
          radio: true,
          list: [
            {
              label: '可申请',
              value: 'Y'
            },
            {
              label: '不可申请',
              value: 'N'
            }
          ]
        },
        {
          label: '操作人',
          prop: 'applyDateUserName',
          width: '160',
        },
        {
          label: '操作时间',
          prop: 'applyDate',
          width: '120'
        }
      ],
      tableList: [],
      queryOrgIds: []
    }
  },
  methods: {
    exportTable() {
      let data = this._formatSendParams(this.queryForm)
      data.dateStart = data.dateStart || ''
      data.dateEnd = data.dateEnd || ''
      fetchExportPermissionManager(data)
    },
    // 操作（申请权限）关闭开启
    checkApply(row) {
      const { umId, empName, isValid: isOpen } = row
      const data = { umId, empName, isOpen: isOpen === 'N' ? 'Y' : 'N' }
      fetchAdjustApplyStatus(data).then(res => {
        this.$message.success('操作成功')
        this.query()
      })
    },
    getList() {
      this.loadingTable = true
      let data = this._formatSendParams(this.queryForm)
      fetchListPermissionManager(data)
        .then(res => {
          const { list, total } = res || {}
          this.tableList = list
          this.queryForm.total = total
        })
        .finally(() => {
          this.loadingTable = false
        })
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10,
        busiType: this.$store.state.userInfo.blgStripLine || 'LS',
        orgIds: this.queryOrgIds
      })
      this.$refs.tablePagination.resetFilters()
      this.$refs.institutionRef.createTreeData()
    },
    orgIdsFinish(val) {
      this.queryOrgIds = CopyObj(this.queryForm.orgIds)
      this.getList()
    },
    // 格式化发送数据
    _formatSendParams(params) {
      params.dateStart = params.daterange?.[0]
      params.dateEnd = params.daterange?.[1]
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      Reflect.deleteProperty(data, 'orgIds')
      Reflect.deleteProperty(data, 'daterange')
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.AuthorityManagement {
  :deep(.el-form-item) {
    margin-bottom: 9px;
  }
}
</style>