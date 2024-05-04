<template>
    <div class="StatementCentre__JudgesList">
        <!-- 搜索 card -->
        <el-card class="search-form-card">
            <el-form :model="judgesForm" inline>
                <el-form-item label="机构">
                    <div class="df">
                        <gc-institution v-model="judgesForm.orgIds"
                         busiType="LS" :left-show="false" 
                         :default-show="true" 
                         :fetchParams="{ module: CASE_MODULE }"
                         :otherParams="{ module: CASE_MODULE }"
                         @setDataFinish="orgIdsFinish" ref="institutionRef">
                        </gc-institution>
                    </div>
                </el-form-item>
                <el-form-item label="姓名/UM号">
                    <gc-input placeholder="请输入姓名/UM号" v-model.trim="judgesForm.umOrName"></gc-input>
                </el-form-item>
                <div class="buttons">
                    <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
                    <el-button @click="reset" class="button-w80-h30">重置</el-button>
                </div>
            </el-form>
        </el-card>

        <!-- 内容card -->
        <el-card class="mt10">
            <div class="menu-right">
                <span class="instructor-icons__add" @click="addJudge"><i class="instructor-icons__add__icon"></i>新增</span>
                <span class="instructor-icons__download" @click="heroImportVisible = true"><i class="instructor-icons__download__icon"></i>批量导入</span>
                <span class="instructor-icons__del" @click="removeHandle"><i class="instructor-icons__del__icon"></i>删除</span>
                <span class="instructor-icons__upload" @click="exportHandle"><i class="instructor-icons__upload__icon"></i>导出名单</span>
            </div>
            <table-pagination v-loading="getLoadingStatus('LOADING_JUDGES_EVA')" :list="list" :tableList="tableList" :queryForm="judgesForm" @selection-change="selectionHandle" :getList="getList" ref="tablePagination">
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <span class="active ml20" @click="scoreRecord(scope.row)">评分记录</span>
                    </template>
                </el-table-column>
            </table-pagination>
        </el-card>
        <!-- 新增评委 dialog -->
        <gc-model title="新增评委" :visible="addJudgesVisible" width="600px" isAppend @close="addJudgesClose" @cancel="addJudgesVisible = false" @comfirm="addJudgesComfirm">
            <el-form class="content-form" ref="addFormRef" :model="addForm" :rules="addRules" label-width="100px">
                <el-form-item label="UM号" prop="showUmId">
                    <el-dropdown trigger="click" ref="messageDrop" placement="bottom-start" style="width: 400px" @visible-change="visibleChange">
                        <div class="gc-approval-chain">
                            <el-input style="width: 400px" class="gc-approval-chain__input" placeholder="请输入姓名或UM号" v-model.trim="addForm.showUmId" @input="input">
                            </el-input>
                        </div>
                        <el-dropdown-menu slot="dropdown" style="width: 400px;" class="gc-approval-chain__drop-down">
                            <div v-show="loadingText" style="text-align: center;margin-top: 80px;color: #ccc;">{{loadingText}}</div>
                            <el-dropdown-item v-for="item in hintData" :key="item.umId" style="white-space: nowrap;overflow: hidden;-ms-text-overflow: ellipsis;text-overflow: ellipsis;" @click.native="handleDropDownCLick(item)">
                                <span class="name">{{ item.umName }}</span>
                                <span class="um">{{ item.umId }}</span>&nbsp;&nbsp;
                                <span class="org-name">{{ item.orgName }}</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-form-item label="所属机构" prop="orgName">
                    <el-input :disabled="true" v-model="addForm.orgName" style="width: 400px"></el-input>
                </el-form-item>
            </el-form>
        </gc-model>
        <!-- 导入英雄名单 -->
        <InstructorBatchImport title="批量导入评委" :visible.sync="heroImportVisible" @change="heroImportChange" @templateDownload="downloadAdapter({ templateCode: 'REPORT_JUDGES_USERS' })" @comfirm="heroImportComfirm" @close="heroImportClose">
            <div v-if="heroImportData.title">
                <p>
                    {{ heroImportData.title }}
                </p>
                <p v-for="error in heroImportData.failStrList" :key="error" class="error-color">
                    {{ error }}
                </p>
            </div>
        </InstructorBatchImport>
        <!-- 评分记录 dialog -->
        <gc-model :visible="scoreRecoredVisible" width="1200px" isAppend @close="scoreRecoredVisible = false" :isShowFooter="false">
            <div slot="title" class="tac wfull fz14"><span class="fl">评分记录</span>评委信息：{{queryForm.umName}}({{queryForm.um}})，{{queryForm.orgName}}</div>
            <el-form ref="queryFormRef" :model="queryForm" :rules="addRules" :inline="true">
                <el-form-item>
                    <el-form-item label="评价时间">
                        <el-date-picker v-model="queryForm.startDate" type="date" placeholder="选择日期" :clearable="false" :picker-options="startPickerOptions" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至" class="mr10">
                        <el-date-picker v-model="queryForm.endDate" type="date" placeholder="选择日期" :clearable="false" :picker-options="endPickerOptions" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <gc-input label="案例信息" placeholder="请输入案例ID/案例名称" v-model.trim="queryForm.caseInfo"></gc-input>
                </el-form-item>
                <div class="search-card__button m0">
                    <el-button @click="queryJudgesEva" type="primary">查询</el-button>
                    <el-button @click="resetJudgesEva">重置</el-button>
                    <el-button @click="exportHandleJudgesEva" class="button-w80-h30" type="primary">导出</el-button>
                </div>
            </el-form>
            <table-pagination v-loading="getLoadingStatus('LOADING_JUDGES_EVA')" :list="scoreRecordlist" :tableList="scoreRecordtableList" :queryForm="queryForm" :getList="queryJudgesEva" ref="scoretablePagination">
            </table-pagination>
        </gc-model>
    </div>
</template>

<script>
import {
  fetchSaveJudges,
  fetchSaveJudgesBatch,
  fetchListJudges,
  fetchExportListJudges,
  fetchDeleteJudges,
  fetchBatchCheckJudges,
  fetchListJudgesEva,
  fetchExportListJudgesEva,
  fetchListCaseEvaUser
} from '@/fetch/statementCentre'
import { downloadAdapter, resetObj, filterObj, CopyObj, getLoadingStatus } from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
import { CASE_MODULE } from '../enum'
export default {
  name: 'JudgesList',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      judgesForm: {
        orgId: '',
        tip: 'list',
        isGotSubBranch: '',
        umOrName: '',
        currPage: 1,
        pageSize: 10
      },
      // 表格字段数组
      list: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          width: '54',
          label: '序号'
        },
        {
          width: '146',
          label: '评委姓名',
          prop: 'umName'
        },
        {
          width: '120',
          label: '评委UM号',
          prop: 'umId'
        },
        {
          width: '220',
          label: '所属机构',
          prop: 'orgName'
        },
        {
          width: '90',
          label: '评价总数',
          prop: 'evaTotal'
        },
        {
          width: '120',
          label: '添加日期',
          prop: 'createdDate'
        },
        {
          width: '146',
          label: '添加人',
          prop: 'createByName',
          formatter: row => `${row.createByName || ''}(${row.createdBy || ''})`
        }
      ],
      scoreRecordlist: [
        {
          width: '100',
          label: '案例ID',
          prop: 'caseNumber'
        },
        {
          width: '200',
          label: '案例名称',
          prop: 'caseName'
        },
        {
          width: '200',
          label: '案例所属机构',
          prop: 'caseBelongOrgStr'
        },
        {
          width: '90',
          label: '场景典型',
          prop: 'contentScore'
        },
        {
          width: '90',
          label: '挑战充分',
          prop: 'elementScore'
        },
        {
          width: '90',
          label: '案例撰写',
          prop: 'fabricationScore'
        },
        {
          width: '90',
          label: '干法有效',
          prop: 'enlightScore'
        },
        {
          width: '90',
          label: '推荐指数',
          prop: 'npsScore'
        },
        {
          width: '90',
          label: '综合得分',
          prop: 'score'
        },
        {
          width: '240',
          label: '评价内容',
          prop: 'comment'
        },
        {
          width: '140',
          label: '评价时间',
          prop: 'createdDate'
        }
      ],
      scoreRecordtableList: [],
      tableList: [],
      // 新增评委 状态
      addJudgesVisible: false,
      scoreRecoredVisible: false,
      tableSelectionRows: [],
      addForm: {
        umId: '',
        orgName: ''
      },
      addRules: {
        showUmId: [{ required: true, message: '请填写姓名UM号' }],
        orgName: [{ required: true, message: '请填写所属机构' }]
      },
      heroImportVisible: false,
      downloadAdapter,
      heroImportData: {
        title: '',
        failStrList: [],
        failUsers: [],
        succeUsers: []
      },
      queryForm: {
        startDate: '',
        endDate: '',
        um: '',
        umName: '',
        orgName: '',
        tip: 'list',
        caseInfo: '',
        currPage: 1,
        pageSize: 10
      },
      approvalValue: false,
      cacheOrgIds: [],
      // 提示数据
      hintData: [],
      // 下拉提示防抖 定时器对象
      timer: null,
      loadingText: '',
      getLoadingStatus,
      CASE_MODULE
    }
  },
  methods: {
    input(val) {
      if (val) {
        this.$refs.messageDrop.show()
        clearTimeout(this.timer)
        this.hintData = []
        this.loadingText = '加载中...'
        this.timer = setTimeout(() => {
          fetchListCaseEvaUser({ umOrName: val }).then(res => {
            if (this.addForm.showUmId) {
              this.hintData = res.list || []
            }
            if (!this.hintData.length) {
              this.loadingText = '无数据'
            } else {
              this.loadingText = ''
            }
          })
        }, 500)
      } else {
        this.hintData = []
        this.loadingText = ''
      }
    },
    // 下拉框 点击事件
    handleDropDownCLick(item) {
      if (item.isSaved === 'Y') {
        this.$message.error('评委已存在，请勿重复添加！')
        return
      }
      this.addForm.showUmId = `${item.umName}(${item.umId})`
      this._.merge(this.addForm, item)
    },
    visibleChange() {
      if (!this.addForm.showUmId) {
        this.$refs.messageDrop.hide()
      }
    },
    orgIdsFinish() {
      this.cacheOrgIds = CopyObj(this.judgesForm.orgIds)
      this.query()
    },
    heroImportComfirm() {
      const heroList = this.heroImportData.succeUsers
      if (heroList?.length) {
        fetchSaveJudgesBatch({ data: heroList }).then(_ => {
          this.$message.success('批量导入成功')
          this.query()
        })
      }
      this.heroImportVisible = false
    },
    heroImportClose() {
      this.heroImportData = {}
      this.heroImportVisible = false
    },
    heroImportChange($event) {
      const file = $event.target.files[0]
      if (!file.name) {
        this.heroImportData = {}
        return
      }
      const parms = new FormData()
      parms.append('file', file)
      fetchBatchCheckJudges(parms).then(res => {
        this.heroImportData = res
      })
    },
    query() {
      this.judgesForm.currPage = 1
      this.getList()
    },
    addJudge() {
      resetObj(this.addForm)
      this.addJudgesVisible = true
      this.hintData = []
      this.approvalValue = !this.approvalValue
      this.addForm = this.$options.data.call(this).addForm
      this.$refs.addFormRef?.clearValidate()
    },
    reset() {
      resetObj(this.judgesForm, {
        orgId: '',
        tip: 'list',
        isGotSubBranch: '',
        umOrName: '',
        currPage: 1,
        pageSize: 10,
        orgIds: this.cacheOrgIds
      })
      this.$refs.institutionRef.createTreeData()
    },
    resetJudgesEva() {
      this.queryForm.startDate = ''
      this.queryForm.endDate = ''
      this.queryForm.caseInfo = ''
      this.$refs.scoretablePagination.resetFilters()
      this.queryJudgesEva()
    },
    getList() {
      this.judgesForm.tip = 'list'
      let data = this._formatSendParams(this.judgesForm)
      fetchListJudges({ request: data }).then(res => {
        const { list, total } = res || {}
        this.tableList = list
        this.judgesForm.total = total
      })
    },
    queryJudgesEva() {
      this.getListJudgesEva()
    },
    getListJudgesEva() {
      this.queryForm.tip = 'list'
      fetchListJudgesEva({ request: filterObj(this.queryForm) }).then(res => {
        const { list, total } = res || {}
        this.scoreRecordtableList = list
        this.queryForm.total = total
      })
    },
    exportHandle() {
      this.judgesForm.tip = 'export'
      let data = this._formatSendParams(this.judgesForm)
      fetchExportListJudges({ request: data })
    },
    scoreRecord(row) {
      this.queryForm = this.$options.data.call(this).queryForm
      this.scoreRecordtableList = []
      this.scoreRecoredVisible = true
      this.queryForm.um = row.umId
      this.queryForm.umName = row.umName
      this.queryForm.orgName = row.orgName
      this.queryJudgesEva()
    },
    exportHandleJudgesEva() {
      this.queryForm.tip = 'export'
      fetchExportListJudgesEva({ request: filterObj(this.queryForm) })
    },
    async addJudgesComfirm() {
      let that = this
      this.$refs.addFormRef.validate(async function(valied) {
        if (!valied) return
        let data = await fetchSaveJudges({ data: that.addForm })
        if (data) {
          that.$message.success('添加成功')
          that.addJudgesClose()
          that.query()
        } else {
          that.$message.error('添加失败')
        }
      })
    },
    addJudgesClose() {
      this.approvalValue = !this.approvalValue
      this.addForm = this.$options.data.call(this).addForm
      this.$refs.addFormRef?.clearValidate()
      this.addJudgesVisible = false
      //   this.$refs.institution.clear()
    },
    selectionHandle(list) {
      this.tableSelectionRows = list
    },
    // 检测是否有选择了表
    _checkSelected() {
      !this.tableSelectionRows.length && this.showMessage('最少选择一行')
      return Boolean(this.tableSelectionRows.length)
    },
    showMessage(tip = '', type = 'warning') {
      this.$message[type](tip)
    },
    // 删除操作
    async removeHandle() {
      if (!this._checkSelected()) return
      try {
        await this.removeTips()
        let ids = this.tableSelectionRows.map(item => item.id)
        await fetchDeleteJudges({ ids })
        this.showMessage('删除成功', 'success')
        this.getList()
      } catch (error) {}
    },
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定删除选中项', '提示', {
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
    // 格式化发送数据
    _formatSendParams(params) {
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      Reflect.deleteProperty(data, 'orgIds')
      return data
    }
  }
}
</script>
<style lang="scss">
.StatementCentre__JudgesList {
  .gc-approval-chain {
    &__input {
      input {
        padding-right: 30px !important;
      }
      .el-input__suffix {
        line-height: 30px;
      }
    }
    &__drop-down {
      height: 200px;
      overflow: auto;
    }
  }
}
</style>