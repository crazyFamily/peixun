<template>
  <div class="case-event">
    <el-card class="search-card">
      <el-form :model="queryForm" inline ref="querFormRef">
        <el-form-item label="所属片区" prop="areaName">
          <!-- <gc-select
            :options="areaList"
            v-model="queryForm.areaName"
            k="orgName"
            v="orgName"
          >
          </gc-select> -->
          <el-input
            v-model="queryForm.areaName"
            placeholder="输入案例英雄所属片区"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属一级分行/分中心"
          prop="subBranchName"
          class="sub-branch-item"
        >
          <!-- <gc-select
            :options="branchList"
            v-model="queryForm.subBranchName"
            k="orgName"
            v="orgName"
          >
          </gc-select> -->
          <el-input
            v-model="queryForm.subBranchName"
            placeholder="输入案例英雄所属一级分行/分中心"
          ></el-input>
        </el-form-item>
        <el-form-item label="案例信息" prop="trailInfo">
          <el-input
            v-model="queryForm.trailInfo"
            placeholder="输入案例ID/名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="案例英雄" prop="shareUser">
          <el-input
            v-model="queryForm.shareUser"
            placeholder="输入案例英雄姓名/UM号"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-form-item label="创建人" prop="createdUser">
          <el-input
            v-model="queryForm.createdUser"
            placeholder="输入创建人姓名/UM号"
          ></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="exportHandle">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="event-list mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="createHandle('create')">
          <i class="instructor-icons__add__icon"></i>
          新增
        </span>
        <span
          class="instructor-icons__putaway"
          @click="controlHandles(selectedItems, 'pushaway')"
        >
          <i class="instructor-icons__putaway__icon"></i>
          批量上架
        </span>
        <span
          class="instructor-icons__pulloff"
          @click="controlHandles(selectedItems, 'pullout')"
        >
          <i class="instructor-icons__pulloff__icon"></i>
          批量下架
        </span>
        <span
          class="instructor-icons__download"
          @click="isBatchImportShow = true"
        >
          <i class="instructor-icons__download__icon"></i>
          批量导入
        </span>
        <span
          class="instructor-icons__del"
          @click="controlHandles(selectedItems, 'remove')"
        >
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
        ref="tablePagination"
      >
        <el-table-column label="操作" min-width="90" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              placement="left"
              :visible-arrow="false"
              popper-class="bgf shadow-1"
            >
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="createHandle('view', scope.row)"
                  >查看</span
                >
                <span class="active" @click="createHandle('edit', scope.row)"
                  >编辑</span
                >
                <span
                  class="active"
                  @click="controlHandles(scope.row, 'pushaway')"
                  >上架</span
                >
                <span
                  class="active"
                  @click="controlHandles(scope.row, 'pullout')"
                  >下架</span
                >
                <span
                  class="active"
                  @click="controlHandles(scope.row, 'remove')"
                  v-if="scope.row.status === 'down'"
                  >删除</span
                >
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
      <!-- 批量导入案例活动 -->
      <InstructorBatchImport
        title="批量导入案例活动"
        :visible.sync="isBatchImportShow"
        @change="importChangeHandle($event)"
        @templateDownload="tempDownLoadHandle"
        @comfirm="importComfirmHandle"
        @close="importCloseHandle"
        ref="imortRef"
      >
        <p>{{ importInfo }}</p>
        <div class="err-tips" v-for="item in errorList">
          <p>{{ item }}</p>
        </div>
      </InstructorBatchImport>
    </el-card>
  </div>
</template>

<script>
import {
  fetchListHeroAreaOrg,
  fetchExportHeroTrailList,
  fetchListToHeroTrail,
  fetchBatchUpdateTrailStatus,
  fetchBatchDeleteHeroTrail,
  fetchBatchImportHeroTrails
} from '@/fetch/caseCenter'
import { downloadAdapter, commonFileInputChange } from '@/util/utils'
export default {
  name: 'CaseEventManage',

  props: {},

  data() {
    let statusList = [
      { label: '上架', value: 'up' },
      { label: '下架', value: 'down' }
    ]
    let tableFilterSetting = (key, list, multiple = false) => {
      return {
        type: 'tablecolumnfilters',
        labelKey: key,
        radio: !multiple,
        list
      }
    }
    return {
      queryForm: {
        areaName: '',
        subBranchName: '',
        trailInfo: '',
        shareUser: '',
        createdUser: '',
        status: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      areaList: [],
      branchList: [],
      blgOrgIds: [],
      list: [
        { type: 'selection' },
        { type: 'index', label: '序号' },
        { prop: 'trailId', label: '案例ID', width: '100' },
        { prop: 'trailName', label: '案例名称' },
        {
          prop: 'umName',
          label: '案例英雄',
          formatter: (row) => `${row.umName}(${row.umId})`
        },
        { prop: 'sourceStr', label: '上传路径' },
        { prop: 'areaName', label: '所属片区' },
        { prop: 'subBranchName', label: '所属一级分行/分中心' },
        { prop: 'position', label: '岗位' },
        {
          prop: 'createdByName',
          label: '创建人',
          formatter: (row) => `${row.createdByName}(${row.createdBy})`
        },
        { prop: 'createdDateStr', label: '创建时间', width: '140' },
        { prop: 'updatedDateStr', label: '更新时间', width: '140' },
        {
          prop: 'status',
          label: '状态',
          formatter: (row) => row.statusStr,
          ...tableFilterSetting('status', statusList)
        }
      ],
      tableList: [],
      selectedItems: [],
      startDaterange: [],
      isBatchImportShow: false,
      fileData: {},
      errorList: [],
      importInfo: '',
      commonFileInputChange
    }
  },

  components: {},

  computed: {},

  mounted() {
    this._getAreaInfo()
  },

  methods: {
    async _getAreaInfo() {
      let { areaList, branchList } = await fetchListHeroAreaOrg()
      this.areaList = areaList
      this.branchList = branchList
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    async exportHandle() {
      let data = { ...this.queryForm }
      ;[data.startDate, data.endDate] = this.startDaterange || []
      await fetchExportHeroTrailList({ data })
    },
    reset() {
      this.startDaterange = []
      // this.queryForm = this.$options.data.call(this).queryForm
      this.$refs.querFormRef.resetFields()
      this.queryForm.status = ''
      this.$refs.tablePagination.resetFilters()
      this.query()
    },
    async getList() {
      let data = { ...this.queryForm }
      ;[data.startDate, data.endDate] = this.startDaterange || []
      let { list, total } = await fetchListToHeroTrail({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    createHandle(type = 'create', row = {}) {
      this.$emit('change', 'AddCaseEvent', type, row)
    },
    selectionHandle(list) {
      this.selectedItems = list
    },
    tipsHandle(msg) {
      return new Promise((resolve, reject) => {
        this.$confirm(msg, '提示', {
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
    controlHandles(data, type) {
      if (Array.isArray(data) && !this._checkSelection()) return
      if (!Array.isArray(data)) data = [data]
      switch (type) {
        case 'pullout':
          this._sentPullout(data)
          break
        case 'pushaway':
          this._sentPushaway(data)
          break
        case 'remove':
          this._sentRemove(data)
      }
    },
    async _sentPushaway(param) {
      await fetchBatchUpdateTrailStatus({
        ids: param.map((item) => item.id),
        status: 'up'
      })
      this.$message.success('提交成功')
      this.getList()
    },
    async _sentPullout(param) {
      try {
        await this.tipsHandle('确定要下架?')
        await fetchBatchUpdateTrailStatus({
          ids: param.map((item) => item.id),
          status: 'down'
        })
        this.$message.success('已下架')
      } catch {}
      this.getList()
    },
    async _sentRemove(param) {
      try {
        await this.tipsHandle('确定要删除当前项?')
        await fetchBatchDeleteHeroTrail({ ids: param.map((item) => item.id) })
        this.$message.success('删除成功')
      } catch {}
      this.getList()
    },
    _checkSelection() {
      let flag = Boolean(this.selectedItems.length)
      if (!flag) this.$message.warning('最少需要选择一项')
      return flag
    },
    importChangeHandle(e) {
      commonFileInputChange(e, this.fileData, 'file')
    },
    async importComfirmHandle() {
      if (!this.fileData.file) return this.$message.warning('请先上传附件')
      try {
        this.errorList = []
        this.importInfo = ''
        const data = new FormData()
        Object.keys(this.fileData).forEach((key) => {
          data.append(key, this.fileData[key])
        })
        let { errorList, importInfo } = await fetchBatchImportHeroTrails(data)
        this.errorList = errorList
        console.log(this.errorList)
        this.importInfo = importInfo
        this.$refs.imortRef.del(0)
        this.fileData = {}
        if (!errorList.length) {
          this.$message.success('导入成功')
          this.importCloseHandle()
        }
      } catch (error) {
        console.log(error, 'eee')
      }
    },
    importCloseHandle() {
      this.errorList = []
      this.importInfo = ''
      this.isBatchImportShow = false
      this.query()
    },
    tempDownLoadHandle() {
      downloadAdapter({ templateCode: 'CASE_EVENT' })
    }
  },
  activated() {
    this.query()
  }
}
</script>
<style lang='scss' scoped>
.rms-daterange-picker {
  :deep(.el-range-separator) {
    line-height: 24px;
  }
}

.err-tips {
  margin: 10px 0;
  color: #f54e1e;
}

.sub-branch-item {
  :deep(.el-form-item__content) {
    width: 220px;
  }
}
</style>
