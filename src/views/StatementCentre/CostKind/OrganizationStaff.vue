<template>
  <div class="StatementCentre__OrganizationStaff">
    <!-- 搜索框 -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="机构部门">
          <div class="df">
            <gc-institution v-model="queryForm.busiType" :fetchParams="{module: CLASS_MODULE }"> </gc-institution>

            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item label="UM号">
          <el-input
            v-model.trim="queryForm.umId"
            placeholder="请输入UM号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="时间" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateStart"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateEnd"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item class="r0">
          <el-checkbox v-model="queryForm.isOutside" class="ml10"
            >只看外勤</el-checkbox
          >
        </el-form-item>

        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="download" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card class="mt10">
      <table-pagination
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
import {
  CopyObj,
  resetObj,
  jsonHeaders,
  downHeaders,
  handleDownload,
  handleEndPickerOptions,
  handleStartPickerOptions
} from '@/util/utils'
import { loadingMixin } from '@/mixins/component'
import { CLASS_MODULE } from '../enum'
export default {
  name: 'OrganizationStaff',
  mixins: [loadingMixin],
  data() {
    return {
      queryForm: {
        busiType: [],
        orgId: '',
        isGotSubBranch: false,
        dateStart: '',
        dateEnd: '',
        umId: '',
        tip: '',
        isOutside: '',
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      handleStartPickerOptions,
      handleEndPickerOptions,
      list: [
        {
          label: '序号',
          type: 'index',
          width: 64
        },
        {
          label: '机构',
          prop: 'orgName',
          width: '160px'
        },
        {
          label: 'UM号',
          prop: 'umId',
          width: '120px'
        },
        {
          label: '员工姓名',
          prop: 'empName',
          width: '120px'
        },
        {
          label: '岗位',
          prop: 'postDesc',
          width: '140px'
        },
        {
          label: '总时长',
          prop: 'totalHour',
          width: '120px'
        },
        {
          label: '培训班',
          prop: 'classHour',
          width: '120px'
        },
        {
          label: '课程学习',
          prop: 'znCourseHour',
          width: '120px'
        },
        {
          label: '直播',
          prop: 'zbHour',
          width: '120px'
        },
        {
          label: 'AI练',
          prop: 'aiHour',
          width: '120px'
        },
        {
          label: '智能陪练（知鸟）',
          prop: 'znplHour',
          width: '160px'
        },
        {
          label: '考试',
          prop: 'testHour',
          width: '120px'
        },
        {
          label: '运营学堂',
          prop: 'yyxtHour',
          width: '120px'
        },
        {
          label: "TMS课程",
          prop: "tmsHour",
          width: "140px",
        },
        {
          label: "案例中心",
          prop: "alHour",
          width: "140px",
        }
      ],
      tableList: [],
      CLASS_MODULE
    }
  },
  methods: {
    getData() {
      const data = CopyObj(this.queryForm)
      ;[data.busiType, data.orgId] = data.busiType
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      data.isOutside = data.isOutside ? 'Y' : 'N'
      return data
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    download() {
      const data = this.getData()
      const { dateStart, dateEnd } = data
      if (
        dateStart &&
        dateEnd &&
        dateStart.substring(0, 4) !== dateEnd.substring(0, 4)
      ) {
        return this.$message.warning('时间只能在同一年内')
      } else if (dateStart && dateEnd && dateStart > dateEnd) {
        return this.$message.warning('开始时间不能大于结束')
      }
      data.tip = 'N'
      return this.$axios
        .post(
          '/fn/report/process/listPersonalStudyStatistics',
          { data },
          downHeaders
        )
        .then(handleDownload)
    },
    getList() {
      const data = this.getData()
      const { dateStart, dateEnd } = data
      if (
        dateStart &&
        dateEnd &&
        dateStart.substring(0, 4) !== dateEnd.substring(0, 4)
      ) {
        return this.$message.warning('时间只能在同一年内')
      } else if (dateStart && dateEnd && dateStart > dateEnd) {
        return this.$message.warning('开始时间不能大于结束')
      }
      data.tip = 'Y'
      return this.$axios
        .post(
          '/fn/report/process/listPersonalStudyStatistics',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.queryForm.total = total
            this.tableList = list
          }
        })
    }
  }
}
</script>
<style lang="scss"></style>