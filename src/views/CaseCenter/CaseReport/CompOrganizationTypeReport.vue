<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="机构" class="">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              busiType="LS"
              :left-show="false"
              :default-show="true"
              @setDataFinish="orgIdsFinish"
              ref="institutionRef"
            >
            </gc-institution>
            <el-checkbox v-model="queryForm.isSubOrg" class="ml10"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <div class="menu-right">
        <span class="instructor-icons__add" @click="exportHandle">
          <i class="instructor-icons__add__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        class="table-left"
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import { resetObj, CopyObj, handleBlob } from '@/util/utils'
import { httpService } from './caseReportUtils'
export default {
  // 按机构统计
  name: 'CompOrganizationTypeReport',

  props: {
    caseId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
     list: [
        {
          label: '机构',
          prop: 'orgName'
        },
        {
          label: '累计习时长(分钟)',
          prop: 'convertAccumulateTime'
        },
        {
          label: '有效学习时长(分钟)',
          prop: 'convertTotalLearnTime'
        },
        {
          label: '学习人数',
          prop: 'totalLearnNum'
        },
        {
          label: '学习完成人数',
          prop: 'finishNum'
        }
      ],
      tableList: [],
      queryForm: {
        id: '',
        orgId: '',
        orgIds: [],
        currPage: 1,
        pageSize: 10,
        total: 0,
        isSubOrg: true
      },
      cacheOrgIds: []
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    orgIdsFinish() {
      this.queryForm.id = this.caseId
      this.cacheOrgIds = CopyObj(this.queryForm.orgIds)
      this.query()
    },
    // 执行查询
    query() {
      this.queryForm.currPage = 1
      this.queryForm.id = this.caseId
      this.getList()
    },
    // 表单重置
    reset() {
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10,
        total: 0,
        id: this.caseId,
        isSubOrg: true,
        orgIds: this.cacheOrgIds
      })
      this.$refs.tablePagination.resetFilters()
      this.$refs.institutionRef.createTreeData()
    },
    // 拉取数据
    getList() {
      let data = CopyObj(this.queryForm)
      data.orgId = data.orgIds?.[1]
      data.isSubOrg = data.isSubOrg ? 'Y' : 'N'
      httpService('/fn/caseCenter/case/orgCaseStatisticsReport', {
        data
      }).then((res) => {
        const { total, list } = res
        this.queryForm.total = total
        this.tableList = list
      })
    },
    // 导出
    exportHandle() {
      let data = CopyObj(this.queryForm)
      data.orgId = data.orgIds?.[1]
      data.isSubOrg = data.isSubOrg ? 'Y' : 'N'
      httpService(
        '/fn/caseCenter/case/exportOrgCaseStatisticsReport',
        { data },
        { headers: { responseType: 'blob' }, allRes: true }
      ).then((res) => {
        if (res.data.type === 'application/json') {
          const reader = new FileReader()
          const that = this
          reader.onload = function (event) {
            var content = reader.result //内容就在这里
            that.$message.error(JSON.parse(content).msg)
          }
          reader.readAsText(res.data)
        } else {
          handleBlob(res)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
