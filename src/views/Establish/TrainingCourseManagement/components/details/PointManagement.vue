<template>
  <div class="PointManagement">
    <!-- 头部输入框及按钮 -->
    <el-card class="PointCard">
      <div class="PointManagementMenu mb20">
        <div class="PointLeft">
          <div class="between mb20">
            <div>
              <span>所属机构</span>
              <gc-institution class="ml10" style="top:10px;" orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" />
              <span class="ml20">学员信息</span>
              <el-input
                class="w200 ml10"
                placeholder="请输入姓名/UM号"
                v-model.trim="queryForm.umId"
                clearable
              ></el-input>
              <el-button
                type="primary"
                class="button-60-h30 ml20"
                @click="query"
                >查询</el-button
              >
              <el-button
                class="button-60-h30 ml20"
                @click="reset"
                >重置</el-button
              >
            </div>
          </div>
        </div>
        <div class="PointRight mt10" style="text-align:right;">
          <el-button class="button-w80-h30" @click="download()">导出</el-button>
        </div>
      </div>
      <!-- 积分管理表格区域 -->
      <div class="PointManagementTable">
        <table-pagination
          :list="list"
          :tableList="tableList"
          :queryForm="queryForm"
          :getList="getList"
          :page-sizes="pageSizes"
          ref="tableRef"
          style="margin-bottom: 55px"
        >
          <el-table-column prop="classContactScore" slot="classContactScore" label="课堂互动" width="150">
            <template slot-scope="scope">
              <span>{{ handleNum(scope.row.classContactScore) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-for="item in classIntegrationConfigDTOS" :key="item.configValue"
            :prop="item.configValue"
            :label="item.configName"
            width="150"
            >
            <template slot-scope="scope">
              <span>{{ handleNum(scope.row[item.configValue]) }}</span>
            </template>
          </el-table-column>
        </table-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { templateDownload } from '@/util/utils'
import { fetchQueryStudentIntergration } from '@/fetch/pointManagement'
export default {
  name: 'PointManagement',
  props: {
    commcClassId: {
      type: String,
      default: ''
    },
    params: {
      type: Object | null,
      default: null
    }
  },
  data() {
    return {
      // 表格字段数组
      list: [
        { label: '序号', width: '64', type: 'index', 
          ctx: (row, index) => (this.queryForm.currPage -1) * this.queryForm.pageSize + index + 1 
        },
        { label: '姓名', prop: 'name', width: '120px', 
          ctx: (row) => row.name ? row.name.substring(0,row.name.indexOf('(')) : ''
        },
        { label: 'UM号', prop: 'umId', width: '160px' },
        { label: '所属机构', prop: 'orgName', width: '300px' },
        { label: '总排名', prop: 'rank', width: '100px' },
        { label: '总得分', prop: 'score', width: '100px', ctx: row => this.handleNum(row.score) },
        { label: '知鸟考试', prop: 'znScore', width: '100px' },
        { slot: 'classContactScore' },
        { slot: 'extendIntegration1' },
        { slot: 'extendIntegration2' },
        { slot: 'extendIntegration3' },
        { slot: 'extendIntegration4' },
        { slot: 'extendIntegration5' }
      ],
      // 自定义积分数组
      classIntegrationConfigDTOS: [],
      // 表格内容数组
      tableList: [],
      pageSizes: [5, 10, 50, 100],
      blgOrgIds: [],
      queryForm: {
        umId: '', // UM号或者姓名
        total: 0,
        currPage: 1,
        pageSize: 50
      },
    }
  },
  watch: {
    tableList: {
      handler(list) {
        this.editList = []
        list.forEach((item) => {
          this.editList.push({
            classId: item.classId,
            umId: item.umId,
            score: item.score,
            znScore: item.znScore,
            classContactScore: item.classContactScore,
            extendIntegration1: item.extendIntegration1,
            extendIntegration2: item.extendIntegration2,
            extendIntegration3: item.extendIntegration3,
            extendIntegration4: item.extendIntegration4,
            extendIntegration5: item.extendIntegration5
          })
        })
      },
      deep: true
    },
    $route: {
      handler: function (val, oldVal) {
        if (
          val &&
          val.path === '/TrainingCourseSeeEdit' &&
          oldVal &&
          oldVal.path === '/TrainingCourseManagement' &&
          JSON.stringify(this.$route.params) !== '{}'
        ) {
          this.queryForm.currPage = 1
          this.queryForm.pageSize = 50
          this.getList()
        }
      },
      deep: true
    }
  },
  methods: {
    // 查询
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 重置
    reset() {
      this.blgOrgIds = []
      this.queryForm.umId = ''
      this.queryForm.pageSize = 50
      this.queryForm.currPage = 1
      this.getList()
    },
    // 导出
    async download() {
      const classId = this.commcClassId
      const searchWord = this.queryForm.umId
      const busiType = this.blgOrgIds?.[0] || ''
      const orgId = this.blgOrgIds?.[1] || ''
      // await templateDownload(
      //   '/common/file/download/exportClassStudentIntergrationList',
      //   { classId: classId, searchWord: searchWord, busiType, orgId}
      // )
      await templateDownload(
        '/common/file/download/exportClassStudentIntergrationList',
        { classId, searchWord, busiType, orgId }
      )
    },
    // 获取内容
    async getList() {
      const classId = this.commcClassId
      const searchWord = this.queryForm.umId
      const currPage = this.queryForm.currPage
      const pageSize = this.queryForm.pageSize
      const busiType =  this.blgOrgIds?.[0]
      const orgId =  this.blgOrgIds?.[1]
      const data = { classId, currPage, pageSize, searchWord, busiType, orgId }
      const { classIntegrationConfigDTOS, pageResp } = await fetchQueryStudentIntergration({ data })
      // 后端没返回该字段数据或者为null 列表数据 展示为0
      pageResp.list.forEach((item) => {
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            if (!item[key] || item[key] === null) {
              item[key] = 0
            }
          }
        }
      })
      this.tableList = pageResp.list
      this.classIntegrationConfigDTOS = classIntegrationConfigDTOS
      this.queryForm.total = pageResp.total
      this.queryForm.pageSize = pageResp.size
      this.queryForm.currPage = pageResp.page
    },
    // 小数点处理
    handleNum (val) {
      if (val === '' || String(val) === 'undefined' || String(val) === 'null' || val === '-') {
        return val
      }
      return parseFloat(val).toFixed(1)
    }
  },
  created() {
   this.getList()
  }
}
</script>
<style lang="less" scoped>
.PointManagement {
  .PointManagementMenu {
    height: 18px;
    display: flex;
    .PointLeft {
      flex: 1;
    }
    .PointRight {
      width: 200px;
      .PointInput {
        width: 200px;
      }
    }
  }
  .PointManagementTable {
    padding-top: 35px;
  }
  .gc-span {
    padding-left: 30px;
  }
}
</style>
