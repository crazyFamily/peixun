<template>
  <div class="case-push">
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="所属机构">
          <gc-institution
            :orgUrl="fetchListCasePushBelongOrgs"
            :leftShow="false"
            :default-show="true" 
            v-model="blgOrgIds"
            :isbranch="true"
            @setDataFinish="handleDefaultOrgsData"
            busiType="LS"
            ref="institutionRef"
          />
        </el-form-item>
        <el-form-item label="推送名称">
          <el-input
            v-model="queryForm.casePushName"
            placeholder="输入推送名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="推送时间">
          <el-date-picker
            class="rms-daterange-picker"
            v-model="startDaterange"
            type="daterange"
            placeholder="开始日期"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="exportHandle">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="createHandle">
          <i class="instructor-icons__add__icon"></i>
          新增推送
        </span>
        <span class="instructor-icons__del" @click="removeHandle">
          <i class="instructor-icons__del__icon"></i>
          删除
        </span>
      </div>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        @selection-change="selectionHandle"
        @sort-change="tableSortHandle"
        ref="tablePagination"
      >
        <el-table-column label="操作" min-width="90" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              placement="left"
              :visible-arrow="false"
              popper-class="bgf shadow-1"
            >
              <!-- 0-草稿,1-推送中,2-待推送,4-推送完成,5-撤回 -->
              <div slot="content" class="tooltip__operation">
                <span
                  class="active"
                  @click="showDetailHandle(scope.row)"
                  v-if="[0, 1, 2, 4, 5].includes(Number(scope.row.status))"
                  >查看</span
                >
                <span
                  class="active"
                  @click="editInfoHandle(scope.row)"
                  v-if="[0].includes(Number(scope.row.status))"
                  >修改</span
                >
                <span
                  class="active"
                  @click="copyInfoHandle(scope.row)"
                  v-if="[1, 2, 4, 5].includes(Number(scope.row.status))"
                  >复制</span
                >
                <!-- <span class="active">提醒</span> -->
                <!-- <span class="active">报表</span> -->
                <span
                  class="active"
                  @click="rebackHandle(scope.row)"
                  v-if="[2, 4].includes(Number(scope.row.status))"
                  >撤回</span
                >
                <span class="active" @click="enterReportHandle(scope.row)"
                  >报表</span
                >
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  fetchSelectOrgTagList,
  fetchListToPushCase,
  fetchExportPushCaseList,
  fetchBatchDeletePushCase,
  fetchUpdatePushCaseStatus,
  fetchListCasePushBelongOrgs
} from '@/fetch/caseCenter'
import { CopyObj, resetObj } from '@/util/utils'
export default {
  name: 'CasePushList',

  props: {},

  data() {
    let tableFilterSetting = (key, list, multiple = false) => {
      return {
        type: 'tablecolumnfilters',
        labelKey: key,
        radio: !multiple,
        list
      }
    }
    let casePushTypes = [
      { label: '立即推送', value: '0' },
      { label: '定时推送', value: '1' }
    ]
    let caseTaskStatuses = [
      { label: '必修', value: 'Y' },
      { label: '选修', value: 'N' }
    ]
    let caseStatuses = [
      { label: '保存中', value: '0' },
      { label: '推送中', value: '1' },
      { label: '待推送', value: '2' },
      { label: '完成推送', value: '4' },
      { label: '撤回', value: '5' }
    ]
    return {
      queryForm: {
        pushType: '',
        isRequired: '',
        statusList: [],
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      list: [
        { type: 'selection' },
        {
          prop: 'casePushName',
          label: '案例推送名称',
          width: '150',
        },
        {
          prop: 'pushTypeDesc',
          label: '推送方式',
          width: '100',
          ...tableFilterSetting('pushType', casePushTypes)
        },
        {
          prop: 'isRequiredDesc',
          label: '任务属性',
          width: '90',
          ...tableFilterSetting('isRequired', caseTaskStatuses)
        },
        {
          prop: 'statusDesc',
          label: '状态',
          ...tableFilterSetting('statusList', caseStatuses, true)
        },
        {
          prop: 'belongOrgDesc',
          label: '所属机构',
          width: '220',
        },
        {
          prop: 'pushUserName',
          label: '推送人',
          width: '180',
          formatter: (row) => `${row.pushUserName}(${row.pushUser})`
        },
        {
          prop: 'pushTimeDesc',
          label: '推送时间',
          sortable: 'custom',
          width: '150'
        },
        {
          prop: 'pushCaseNum',
          label: '推送案例数',
          width: '100'
        },
        {
          prop: 'pushUserNum',
          label: '推送人数',
          width: '100'
        },
        {
          prop: 'learnedUserNum',
          label: '学习人数',
          width: '100'
        },
        {
          prop: 'finishUserNum',
          label: '完成人数',
          width: '100'
        },
        {
          prop: 'learnedRate',
          label: '学习率',
          width: '100'
        },
        {
          prop: 'finishRate',
          label: '完成率',
          width: '100'
        }
      ],
      tableList: [],
      tableSelectionRowss: [],
      blgOrgIds: [],
      originOrgIds: [],
      startDaterange: [],
      fetchSelectOrgTagList,
      fetchListCasePushBelongOrgs
    }
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    // 所属机构回显（默认获取当前权限机构）
    // 1、<gc-institution></gc-institution> 组件刚渲染时会执行
    // 2、执行 this.$refs.institutionRef.createTreeData() 时，会执行
    handleDefaultOrgsData (org) {
      const { orgId, orgName } = org
      // 保存下来，重置时使用
      this.blgOrgIds = ['LS', orgId]
      this.query()
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    async getList() {
      let data = this._formatParams(this.queryForm)
      let { list, total } = await fetchListToPushCase({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    _formatParams(data) {
      let params = CopyObj(data)
      params.belongOrg = this.blgOrgIds?.[1]
      params.startDate = this.startDaterange?.[0]
      params.endDate = this.startDaterange?.[1]
      return params
    },
    reset() {
      this.blgOrgIds = []
      this.startDaterange = []

      resetObj(this.queryForm, {
        pushType: '',
        isRequired: '',
        statusList: [],
        currPage: 1,
        pageSize: 10,
        total: 0
      })
      this.$refs.institutionRef.createTreeData()
      this.$refs.tablePagination.resetFilters()
      // this.query()
    },
    createHandle() {
      this.$router.push({ name: '新增案例推送', params: { isReset: true } })
    },
    // 删除操作
    async removeHandle() {
      if (!this._checkSelected()) return
      try {
        await this.removeTips()
        let ids = this.tableSelectionRowss.map((item) => item.id)
        await fetchBatchDeletePushCase({ data: ids })
        this._showMessage('删除成功', 'success')
        this.getList()
      } catch (error) {}
    },
    // 删除操作的二次提示
    removeTips(tips) {
      return new Promise((resolve, reject) => {
        this.$confirm(tips || '是否确定删除选中项', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject()
          })
      })
    },
    // 检测是否有选择了表
    _checkSelected() {
      !this.tableSelectionRowss.length && this._showMessage('最少选择一行')
      return Boolean(this.tableSelectionRowss.length)
    },
    _showMessage(tip = '', type = 'warning') {
      this.$message[type](tip)
    },
    // 表格选择回调
    selectionHandle(list) {
      this.tableSelectionRowss = list
    },
    tableSortHandle({ prop, order }) {
      console.log(prop, order, '---')
      let isUp
      switch (order) {
        case 'ascending':
          isUp = 'Y'
          break
        case 'descending':
          isUp = 'N'
          break
        case null:
          isUp = undefined
          break
      }
      if (prop === 'pushTimeDesc') {
        this.queryForm.isUp = isUp
        this.getList()
      }
    },
    async exportHandle() {
      let data = this._formatParams(this.queryForm)
      await fetchExportPushCaseList({ data })
    },
    editInfoHandle(row) {
      this.$router.push({
        name: '新增案例推送',
        params: { id: row.id, isDetail: false }
      })
    },
    copyInfoHandle(row) {
      this.$router.push({
        name: '新增案例推送',
        params: { id: row.id, isDetail: false, isCopy: true }
      })
    },
    showDetailHandle(row) {
      this.$router.push({
        name: '新增案例推送',
        params: { id: row.id, isDetail: true }
      })
    },
    async rebackHandle(row) {
      try {
        await this.removeTips('是否确定撤回')
        await fetchUpdatePushCaseStatus({ data: row.id })
        this.$message.success('已撤回')
        this.query()
      } catch (error) {}
    },
    // 进入报表
    enterReportHandle(row) {
      this.$router.push({
        name: '案例推送报表',
        params: { id: row.id, casePushName: row.casePushName, isNew: true }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === '新增案例推送') {
      next((vm) => {
        vm.query()
      })
    } else {
      next()
    }
  }
}
</script>
<style lang='scss' scoped>
.search-card__button {
  float: right;
  margin-bottom: 20px;
}

.search-card {
  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}

.rms-daterange-picker {
  height: 30px;
  :deep(.el-range-separator) {
    line-height: 24px;
  }

  :deep(.el-range-editor.el-input__inner) {
    font-size: 12px;
  }

  :deep(.el-range-editor .el-range-input) {
    font-size: 12px;
  }
}
</style>
