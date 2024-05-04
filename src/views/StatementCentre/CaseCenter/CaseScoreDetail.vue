<template>
    <div class="StatementCentre__CaseScoreDetail">
        <!-- 搜索 card -->
        <el-card class="search-form-card">
            <el-form :model="queryForm" inline>
                <el-form-item label="案例所属机构">
                    <gc-institution :leftShow="false" :default-show="true"
                     v-model="queryForm.caseBlongOrgs" 
                     :fetchParams="{ module: CASE_MODULE }"
                     :otherParams="{ module: CASE_MODULE }"
                     @setDataFinish="caseBlongOrgsFinish" 
                     busiType="LS" ref="caseBlongRef">
                    </gc-institution>
                </el-form-item>
                <el-form-item label="评价人所属机构">
                    <div class="df">
                        <gc-institution v-model="queryForm.orgIds" busiType="LS"
                         :left-show="false" :default-show="false" 
                         :fetchParams="{ module: CASE_MODULE }"
                         :otherParams="{ module: CASE_MODULE }"
                         @setDataFinish="evaUserBlongOrgsFinish" ref="institutionRef">
                        </gc-institution>
                        <el-checkbox class="ml10" v-model="queryForm.onlyJudges" true-label="Y" false-label="N">只看评委</el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="案例信息">
                    <el-input v-model.trim="queryForm.caseInfo" placeholder="输入案例ID/案例名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-form-item label="案例上架时间" class="mr10">
                        <el-date-picker class="w-120" v-model="queryForm.caseUpStartDate" type="date" placeholder="开始日期" :clearable="false" :picker-options="startPickerOptions" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至" class="r0">
                        <el-date-picker class="w-120" v-model="queryForm.caseUpEndDate" type="date" placeholder="结束日期" :clearable="false" :picker-options="endPickerOptions" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item>
                    <el-form-item label="评价时间" class="mr10">
                        <el-date-picker class="w-120" v-model="queryForm.evaStartDate" type="date" placeholder="选择日期" :clearable="false" :picker-options="evaStartPickerOptions" value-format="yyyy-MM-dd" popper-class="date-picker">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="至" class="mr10">
                        <el-date-picker class="w-120" v-model="queryForm.evaEndDate" type="date" placeholder="选择日期" :clearable="false" :picker-options="evaEndPickerOptions" value-format="yyyy-MM-dd" popper-class="date-picker">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="评价人信息">
                    <el-input v-model.trim="queryForm.judgesInfo" placeholder="输入评价人姓名/UM号"></el-input>
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
                <el-popover @show="setHeader" transfer trigger="click" ref="popovercasescore">
                    <div class="mt12">
                        <div class="infinite-list">
                            <el-checkbox-group v-model="tabHeaderQueryForm">
                                <el-checkbox v-for="(item,index) in setTableHeader" :key="index" class="dfw ml10 state-popover-item" :label="item.prop">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="state-popover-btns">
                            <span @click="selectTabHeader" class="active fl StatementCentre__btn-text">确定</span>
                            <span @click="resetTabHeader" class="active fr StatementCentre__btn-text">重置</span>
                        </div>
                    </div>
                    <el-button slot="reference" class="button-w80-h30 mr10">表头设置</el-button>
                </el-popover>
                <el-button @click="exportHandle" class="button-w80-h30">导出</el-button>
            </div>
            <table-pagination v-loading="getLoadingStatus('LOADING_CASE_EVA_REPORT')" :list="tableOptions" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePagination">
            </table-pagination>
        </el-card>
    </div>
</template>

<script>
import { commonFilter, CopyObj, formatDate, filterObj, getLoadingStatus } from '@/util/utils'
import {
  fetchCaseTagInfoList,
  fetchListCaseEvaReport,
  fetchExportListCaseEvaReport
} from '@/fetch/statementCentre'
import { fetchListTags } from '@/fetch/caseCenter'
import { CASE_MODULE } from '../enum'
export default {
  name: 'CaseScoreDetail',
  data() {
    return {
      commonFilter,
      queryForm: {
        caseBlongOrg: '',
        evaUserBlongOrg: '',
        onlyJudges: 'Y',
        tip: 'list',
        caseInfo: '',
        caseUpStartDate: '',
        caseUpEndDate: '',
        evaStartDate: '',
        evaEndDate: '',
        judgesInfo: '',
        headList: [],
        currPage: 1,
        pageSize: 10
      },
      tabHeaderQueryForm: [
        'caseBelongOrgStr',
        'businessLineStr',
        'firstUpTime',
        'umName',
        'umId',
        'orgName',
        'elementScore',
        'contentScore',
        'enlightScore',
        'fabricationScore',
        'score',
        'npsScore',
        'comment',
        'createdDate'
      ],
      tableOptions: [],
      tableList: [],
      setTableHeader: [],
      // 原始表格
      rawDataTableOptions: [
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
          type: 'tablecolumnfilters',
          label: '业务条线',
          prop: 'businessLineStr',
          width: '146',
          labelKey: 'businessLine',
          list: []
        },
        {
          width: '140',
          label: '案例上架时间',
          prop: 'firstUpTime'
        },
        {
          width: '146',
          label: '评价人姓名',
          prop: 'umName'
        },
        {
          width: '120',
          label: '评价人UM号',
          prop: 'umId'
        },
        {
          width: '200',
          label: '评价人所属机构',
          prop: 'orgName'
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
      startPickerOptions: {
        disabledDate: time => {
          if (this.queryForm.caseUpEndDate) {
            return !(formatDate(time) <= this.queryForm.caseUpEndDate)
          }
          return false
        }
      },
      endPickerOptions: {
        disabledDate: time =>
          !(formatDate(time) >= this.queryForm.caseUpStartDate)
      },
      evaStartPickerOptions: {
        disabledDate: time => {
          if (this.queryForm.evaEndDate) {
            return !(formatDate(time) <= this.queryForm.evaEndDate)
          }
          return false
        }
      },
      evaEndPickerOptions: {
        disabledDate: time => !(formatDate(time) >= this.queryForm.evaStartDate)
      },
      caseBlongOrgs: [],
      getLoadingStatus,
      CASE_MODULE
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    selectTabHeader() {
      let noSelectList = []
      this.setTableHeader.forEach(v => {
        if (!this.tabHeaderQueryForm.includes(v.prop)) {
          noSelectList.push(v.prop)
        }
      })
      this.tableOptions = this.rawDataTableOptions.filter(v => {
        return !noSelectList.includes(v.prop)
      })
      this.$refs.popovercasescore.doClose()
    },
    resetTabHeader() {
      this.tableOptions = [...this.rawDataTableOptions]
      this.tabHeaderQueryForm = this.$options.data.call(this).tabHeaderQueryForm
      this.$refs.popovercasescore.doClose()
    },
    // 重置事件
    reset() {
      this.queryForm = this.$options.data.call(this).queryForm
      this.queryForm.caseBlongOrgs = this.caseBlongOrgs
      this.queryForm.evaUserBlongOrgs = this.evaUserBlongOrgs
      this.resetTabHeader()
      this.$refs.tablePagination.resetFilters()
      this.$refs.caseBlongRef.createTreeData()
      this.$refs.institutionRef.createTreeData()
    },
    getList() {
      this.queryForm.tip = 'list'
      let data = this._formatSendParams(this.queryForm)
      fetchListCaseEvaReport({ request: data }).then(res => {
        const { list, total } = res || {}
        this.tableList = list
        this.queryForm.total = total
      })
    },
    setHeader() {
      this.tabHeaderQueryForm = []
      this.tableOptions.forEach(v => {
        let hasPropList = this.setTableHeader.filter(t => {
          return t.prop === v.prop
        })
        if (hasPropList.length) {
          this.tabHeaderQueryForm.push(v.prop)
        }
      })
    },
    // 获取 业务条线 业务类型 客群 下拉选项
    async getAllFilter() {
      let data = await fetchListTags({ data: { blgStripLine: this.$store.state.userInfo.blgStripLine, tagType: 5 } })
      data  = data.filter(v => v.tagLevel === '1')
      data.forEach(v => {
        v.label = v.tagName
        v.value = v.id
      })
      this.rawDataTableOptions.forEach(v => {
        if (v.labelKey === 'businessLine') {
          v.list.push(...data)
        }
      })
      this.setTableHeader = this.rawDataTableOptions.filter(v => {
        return [
          'caseBelongOrgStr',
          'businessLineStr',
          'firstUpTime',
          'umName',
          'umId',
          'orgName',
          'elementScore',
          'contentScore',
          'enlightScore',
          'fabricationScore',
          'npsScore',
          'score',
          'comment',
          'createdDate'
        ].includes(v.prop)
      })
      this.tableOptions = [...this.rawDataTableOptions]
    },
    caseBlongOrgsFinish() {
      this.caseBlongOrgs = CopyObj(this.queryForm.caseBlongOrgs)
      this.getList()
    },
    evaUserBlongOrgsFinish() {
      this.evaUserBlongOrgs = CopyObj(this.queryForm.evaUserBlongOrgs)
      this.getList()
    },
    exportHandle() {
      this.queryForm.tip = 'export'
      this.queryForm.headList = this.tabHeaderQueryForm
      let data = this._formatSendParams(this.queryForm)
      fetchExportListCaseEvaReport({ request: data })
    },
    // 格式化发送数据
    _formatSendParams(params) {
      let data = filterObj(params)
      data.caseBlongOrg = data.caseBlongOrgs?.[1]
      data.evaUserBlongOrg = data.orgIds?.[1]
      Reflect.deleteProperty(data, 'caseBlongOrgs')
      Reflect.deleteProperty(data, 'orgIds')
      return data
    }
  },
  created() {
    this.getAllFilter()
  }
}
</script>
<style lang="scss">
.StatementCentre__CaseScoreDetail {
  .mt12 {
    margin-top: 12px !important;
  }
}
.StatementCentre__btn-text {
  padding: 8px 0;
}
</style>