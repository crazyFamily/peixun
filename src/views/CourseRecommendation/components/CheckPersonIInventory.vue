<template>
  <!-- 查看人员清单 dialog -->
  <gc-model
    title="查看人员清单"
    width="1200px"
    v-bind="$attrs"
    v-on="$listeners"
    @close="cancel"
    @cancel="checkPersonelInventoryVisible = false"
    :visible.sync="checkPersonelInventoryVisible"
  >
    <div class="menu-right">
      <el-button type="primary" class="button-w80-h30" @click="download"
        >导出</el-button
      >
      <el-button
        type="primary"
        class="button-w80-h30"
        @click="batchDel"
        v-if="!disabled"
        >删除</el-button
      >
    </div>
    <gc-table
      ref="tableRef"
      class="general__table"
      :list="checkPersonelInventoryList"
      :tableList="checkPersonelInventoryTableList"
    >
      <el-table-column width="90px" prop="isAllowPushDesc">
        <template slot="header">
          <gc-tablecolumnfilters
            label="状态"
            className="table__screen__icon"
            :list="statusOptions"
            confirmText="确定"
            popperClass="circular"
            @filter="filter"
            @reset="reset"
            radio
          >
          </gc-tablecolumnfilters>
        </template>
      </el-table-column>
      <el-table-column
        label="失败原因"
        width="120px"
        prop="reasonDesc"
      ></el-table-column>
      <el-table-column label="操作" width="100px" v-if="!disabled">
        <template slot-scope="scope">
          <span class="active" @click="delPerson(scope.row)">删除</span>
        </template>
      </el-table-column>
    </gc-table>
    <gc-pagination
      :total="total"
      :page-sizes="[5]"
      :page-size="queryForm.pageSize"
      :current-page="queryForm.currPage"
      @sizeChange="sizeChange($event, queryForm, getCheckPersonelInventoryList)"
      @currentChange="
        currentChange($event, queryForm, getCheckPersonelInventoryList)
      "
      class="between"
    />
  </gc-model>
</template>

<script>
import {
  CopyObj,
  hintFrame,
  sizeChange,
  currentChange
} from '../../../util/utils'
import {
  fetchListPushUserInfos,
  fetchDeleteBatchPushUser
} from '@/fetch/courseRecommendation'

export default {
  props: {
    pushSettingId: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      total: 0,
      // 请求数据
      queryForm: {
        tip: 'Y',
        isAllowPush: null,
        currPage: 1,
        pageSize: 5
      },
      // 状态下拉选项
      statusOptions: [
        {
          label: '成功',
          value: 'Y'
        },
        {
          label: '失败',
          value: 'N'
        }
      ],
      // 查看人员清单 dialog 字段数组
      checkPersonelInventoryList: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '人员姓名',
          prop: 'empName',
          width: '104'
        },
        {
          label: '人员UM',
          prop: 'umId',
          width: '120'
        },
        {
          label: '所属机构',
          prop: 'orgName',
          width: '160'
        },
        // {
        //     label: "所属团队",
        //     prop: "teamName",
        //     width: "160"
        // },
        {
          label: '岗位',
          prop: 'positionDesc',
          width: '120'
        }
      ],
      // 查看人员清单 dialog 数据数组
      checkPersonelInventoryTableList: [],
      // 查看人员清单 dialog 状态
      checkPersonelInventoryVisible: false,
      sizeChange,
      currentChange
    }
  },
  methods: {
    filter(list) {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 5
      this.queryForm.isAllowPush = list.list[0]
      this.getCheckPersonelInventoryList()
    },
    reset() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 5
      this.queryForm.isAllowPush = null
      this.getCheckPersonelInventoryList()
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 5
      this.getCheckPersonelInventoryList()
    },
    getCheckPersonelInventoryList() {
      const data = CopyObj(this.queryForm)
      data.pushSettingId = this.pushSettingId
      fetchListPushUserInfos({ data })
        .then((res) => {
          const { list, total } = res
          this.total = total
          this.checkPersonelInventoryTableList = list
          this.checkPersonelInventoryVisible = true
        })
    },
    // 删除一个人员
    delPerson(row) {
      hintFrame('确认删除该人员？').then(() => {
        this.deleteBatchPushUser([row.pushRecordId])
      })
    },
    // 批量删除
    batchDel() {
      const selection = this.$refs.tableRef.$children[0].selection
      if (!selection.length) return this.$message.warning('请先选择人员')
      hintFrame('确认删除这些人员？').then(() => {
        const ids = selection.map((v) => v.pushRecordId)
        this.deleteBatchPushUser(ids)
      })
    },
    deleteBatchPushUser(arr) {
      const data = {
        pushSettingId: this.pushSettingId,
        pushRecordIds: arr
      }
      fetchDeleteBatchPushUser(data)
        .then(() => {
          this.$message.success('删除成功')
          this.query()
        })
    },
    cancel() {
      this.total = 0
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 5
      this.checkPersonelInventoryTableList = []
      this.checkPersonelInventoryVisible = false
      this.$emit('cancel')
    },
    open() {
      this.getCheckPersonelInventoryList()
    },
    // 导出人员清单
    async download() {
      const data = CopyObj(this.queryForm)
      data.pushSettingId = this.pushSettingId
      data.tip = 'N'
      await fetchListPushUserInfos({ data }, true)
    }
  }
}
</script>

<style></style>
