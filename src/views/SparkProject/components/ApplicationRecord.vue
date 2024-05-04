<template>
  <div class="ApplicationRecord">
    <el-form :model="queryForm" class="clearfix" inline>
      <el-form-item label="岗位" class="mr60">
        <gc-institution v-model="queryForm.orgIds" busiType="LS" :left-show="false" :default-show="true" @setDataFinish="orgIdsFinish" ref="institutionRef">
        </gc-institution>
      </el-form-item>
      <el-form-item label="申请人" class="mr60">
        <el-input v-model.trim="queryForm.umId" placeholder="输入姓名/UM号" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="申请时间" class="mr60">
        <el-date-picker class="rms-daterange-picker" v-model="queryForm.applyDate" type="daterange" :clearable="false" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="选择开始日期" end-placeholder="选择结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入职时间" class="mr60">
        <el-date-picker class="rms-daterange-picker" v-model="queryForm.onboardingDate" type="daterange" :clearable="false" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="选择开始日期" end-placeholder="选择结束日期">
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
      <el-table-column label="申请人姓名" slot="empName">
        <template slot-scope="scope">
          <span class="active" @click="checkInfo(scope.row)">{{ scope.row.empName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <span class="active" @click="showEOAlogHandle(scope.row)">审批记录</span>
        </template>
      </el-table-column>
    </table-pagination>
    <!-- 查看申请弹框 -->
    <gc-model title="豁免/延期申请" width="1120px" class="postpone-dialog" :visible="checkRoleVisible" :isAppend="true" @close="checkRoleVisible = false" :isShowFooter="false">
      <el-form :model="checkInstructorInfo" label-width="70px" @submit.native.prevent>
        <el-form-item label="申请类型">
          <gc-select class="padding-0" disabled :options="applyTypeOption" :value="checkInstructorInfo.applyType"></gc-select>
        </el-form-item>
        <el-form-item label="延期至" class="search-card__date mr10" v-if="checkInstructorInfo.applyType === '1'">
          <el-date-picker disabled v-model="checkInstructorInfo.applyTime" type="date" placeholder="选择日期" :clearable="false" value-format="yyyy-MM-dd" popper-class="">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请原因">
          <el-input disabled class="postpone-dialog__textAreaIn" type="textarea" show-word-limit resize="none" placeholder="在此输入特殊情况说明，豁免条件是至少曾具有一年以上某银行网点运营工作或学习经验" :value="checkInstructorInfo.applyReason" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-tag class="enclosure" :hit="false" @click="checkVisible = true">
            查看附件
          </el-tag>
        </el-form-item>
        <el-form-item label="审批流程">
          <el-input disabled v-model="checkInstructorInfo.auditUsersUm"></el-input>
        </el-form-item>
      </el-form>
    </gc-model>
    <!-- 查看下载附件 dislog -->
    <gc-model width="500px" title="查看附件" :isAppend="true" :visible="checkVisible" @close="checkVisible = false" :isShowFooter="false">
      <div>
        <div class="between-noc" v-for="(item, i) in checkInstructorInfo.fileList" :key="i" style="line-height: 20px;">
          <span>{{ item.fileName }}</span>
          <span class="icons" @click="downloadFile(item.udmpId, item.fileName)">
            <span class="icons__download">
              <i class="icons__download__icon"></i>
            </span>
          </span>
        </div>
      </div>
    </gc-model>
     <!-- 查看 审批记录 -->
    <CkeckApprovalRecord :row="activeEoaRow" />
  </div>
</template>
<script>
import { CopyObj, filterObj, resetObj, downloadFile } from '@/util/utils'
import {
  fetchExportByRemit,
  fetchPersonApplyDetail,
  fetchListUserByUmOrName
} from '@/fetch/sparkProject'
import { SPARK_APPLY_STATUS, SPARK_APPLY_TYPE } from '@/util/constants'
import CkeckApprovalRecord from '@/components/chunk/CkeckApprovalRecord'
export default {
  name: 'ApplicationRecord',
  components: {
    CkeckApprovalRecord
  },
  data() {
    return {
      queryForm: {
        currPage: 1,
        pageSize: 10,
        busiType: this.$store.state.userInfo.blgStripLine || 'LS'
      },
      loadingTable: false,
      list: [
        { slot: 'empName' },
        {
          label: '申请人UM号',
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
          label: '申请类型',
          prop: 'applyTypeDesc',
          type: 'tablecolumnfilters',
          labelKey: 'applyType',
          radio: true,
          list: SPARK_APPLY_TYPE
        },
        {
          label: '申请时间',
          prop: 'applyDate',
          width: '120'
        },
        {
          label: '延期至',
          prop: 'applyTime',
          width: '120'
        },
        {
          label: '审批状态',
          prop: 'applyStatusDesc',
          type: 'tablecolumnfilters',
          labelKey: 'applyStatus',
          radio: true,
          list: SPARK_APPLY_STATUS
        }
      ],
      tableList: [],
      queryOrgIds: [],
      checkRoleVisible: false,
      checkInstructorInfo: {},
      checkVisible: false,
      downloadFile,
      applyTypeOption: SPARK_APPLY_TYPE,
      activeEoaRow: {}
    }
  },
  methods: {
    showEOAlogHandle(row) {
      this.activeEoaRow = CopyObj(row)
    },
    checkInfo(row) {
      const { umId, id } = row
      const data = { umId, id }
      fetchPersonApplyDetail(data).then(res => {
        this.checkRoleVisible = true
        this.checkInstructorInfo = res
      })
    },
    exportTable() {
      let data = this._formatSendParams(this.queryForm)
      data.dateStart = data.dateStart || ''
      data.dateEnd = data.dateEnd || ''
      data.startTime = data.startTime || ''
      data.endTime = data.endTime || ''
      fetchExportByRemit(data)
    },
    // 操作（申请权限）关闭开启
    checkApply(row) {
      this.checkRoleVisible = true
    },
    getList() {
      let data = this._formatSendParams(this.queryForm)
      fetchListUserByUmOrName(data).then(res => {
        const { list, total } = res || {}
        this.tableList = list
        this.queryForm.total = total
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
      params.dateStart = params.applyDate?.[0]
      params.dateEnd = params.applyDate?.[1]
      params.startTime = params.onboardingDate?.[0]
      params.endTime = params.onboardingDate?.[1]
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      data.tips = this.tabActive
      Reflect.deleteProperty(data, 'orgIds')
      Reflect.deleteProperty(data, 'applyDate')
      Reflect.deleteProperty(data, 'onboardingDate')
      return data
    }
  }
}
</script>
<style lang="scss" scoped>
.ApplicationRecord {
  :deep(.el-form-item) {
    margin-bottom: 9px;
  }
}
</style>