<template>
  <div class="examp-wrapper" v-loading="isDataLoading">
    <!-- 显示列表 -->
    <el-card class="mt10" v-if="!isShowTip">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="applyHandle">
          <i class="instructor-icons__add__icon"></i>
          申请
        </span>
      </div>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column
          slot="empName"
          prop="empName"
          label="申请人姓名"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <div class="table-options-label" @click="openViewHandle(scope.row)">
              <span class="item active">{{ scope.row.empName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="105px">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="showEOAlogHandle(scope.row)"
                >审批记录</span
              >
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 显示图片 -->
    <el-card class="full-min-height dfcc" v-else>
      <!-- <div class="top-bar dfcc">
        <p class="tip">暂无申请记录</p>
        <el-button type="primary" @click="isShowTable = true">申请</el-button>
      </div> -->
      <div class="img-wrapper dfcc">
        <img src="@/assets/images/ignore-tip.png" alt="" />
      </div>
    </el-card>

    <!-- 底部按钮 -->
    <div class="footer-box dfcc" v-if="isShowTip">
      <p class="tip">暂无申请记录</p>
      <el-button
        class="button-w80-h30"
        type="primary"
        @click="isShowTable = true"
        >申请</el-button
      >
    </div>

    <!-- 创建/查看豁免 -->
    <ExampApply
      :data-info="activeRow"
      :disabled="isViewStatus"
      :show.sync="isDialogShow"
      @close="applyCloseHandle"
      @save="applySaveHandle"
      ref="exampApplyRef"
    />

    <!-- 查看 审批记录 -->
    <CkeckApprovalRecord :row="activeEoaRow" />
  </div>
</template>

<script>
import { fetchListRemit, fetchPersonApplyDetail, fetchVerificationStatus } from '@/fetch/sparkProject'
import { CopyObj } from '@/util/utils'
import ExampApply from './components/ExampApply.vue'
import { SPARK_APPLY_TYPE } from '@/util/constants'
import CkeckApprovalRecord from '@/components/chunk/CkeckApprovalRecord'
export default {
  name: 'ExampDelayApplication',

  props: {},

  data() {
    const applyTypeList = SPARK_APPLY_TYPE
    const tableFilterSetting = (key, list, multiple = false) => {
      return {
        type: 'tablecolumnfilters',
        labelKey: key,
        radio: !multiple,
        list
      }
    }
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      list: [
        { slot: 'empName' },
        // { label: '申请人姓名', prop: 'umId' },
        { label: '申请人UM', prop: 'umId' },
        { label: '机构', prop: 'orgName' },
        // { label: '岗位', prop: 'postDesc' },
        { label: '入职时间', prop: 'dateHire' },
        {
          label: '申请类型',
          prop: 'applyTypeDesc',
          ...tableFilterSetting('applyType', applyTypeList)
        },
        { label: '申请时间', prop: 'applyDate' },
        { label: '延期至', prop: 'applyTime' },
        { label: '审批状态', prop: 'applyStatusDesc' }
      ],
      isShowTable: false,
      isDialogShow: false,
      activeRow: {},
      isViewStatus: false,
      activeEoaRow: {},
      isDataLoading: false
    }
  },

  components: {
    ExampApply,
    CkeckApprovalRecord
  },

  computed: {
    isShowTip() {
      if (Boolean(this.tableList.length)) {
        return false
      }
      if (this.isDataLoading) {
        return false
      }
      return !this.isShowTable
    }
  },

  mounted() {
    this._query()
  },

  methods: {
    _query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    _formatParams(data) {
      let params = CopyObj(data)
      params.busiType = this.$store.state.userInfo.blgStripLine
      return params
    },
    async getList() {
      this.isDataLoading = true
      const data = this._formatParams(this.queryForm)
      fetchListRemit({ data })
        .then(({ list, total }) => {
          this.tableList = list
          this.queryForm.total = total
        })
        .finally(() => {
          // 设个延时，不会出现跳一下的问题
          setTimeout(() => {
            this.isDataLoading = false
          }, 200)
        })
    },
    closeHandle() {
      this.$refs.exampApplyRef.reset()
      this.isDialogShow = false
      this.activeRow = {}
      this.isViewStatus = false
    },
    async applyHandle() {
      await fetchVerificationStatus()
      this.isDialogShow = true
    },
    async openViewHandle(row) {
      let res = await fetchPersonApplyDetail({ id: row.id, umId: row.umId })
      this.activeRow = res
      this.isViewStatus = true
      this.applyHandle()
    },
    showEOAlogHandle(row) {
      this.activeEoaRow = CopyObj(row)
    },
    applyCloseHandle() {
      this.closeHandle()
    },
    applySaveHandle() {
      this._query()
    }
  }
}
</script>
<style lang='scss' scoped>
$base-margin: 20px;
.tip {
  margin-right: $base-margin;
}
</style>