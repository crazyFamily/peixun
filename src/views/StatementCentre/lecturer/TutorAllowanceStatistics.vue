<template>
  <div class="statementCentre__tutorAllowance">
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="部门" class="first">
          <gc-institution v-model="queryForm.busiType" :fetchParams="{module: TEACHER_MODULE }"> </gc-institution>
          <div class="checkbox-wrap">
            <el-checkbox v-model="queryForm.isGotSubBranch"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item class="mr10">
          <el-form-item label="开始时间" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.dateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date r0">
            <el-date-picker
              v-model="queryForm.dateEnd"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="download" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10" v-loading="getLoadingStatus('LOADING_TUTORALLOWANCESTATISTICS')" >
      <gc-table class="general__table" :list="list" :tableList="tableList">
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  handleBlob,
  sizeChange,
  currentChange,
  CopyObj,
  jsonHeaders,
  resetObj,
  getLoadingStatus
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
import { TEACHER_MODULE } from '../enum'
import { fetchMentorAllowance } from '@/fetch/statementCentre'
export default {
  name: 'TutorAllowanceStatistics',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      // 查询用的表单
      queryForm: {
        // 条线
        busiType: [],
        orgId: '',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: '',
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        tip: 'Y',
        // 选择子机构标识
        isGotSubBranch: false
      },
      total: 0,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {},
      // 字段数组
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: 'um号',
          prop: 'umId',
          width: '110'
        },
        {
          label: '姓名',
          prop: 'empName',
          width: '120'
        },
        {
          label: '机构名称',
          prop: 'orgName',
          width: '200'
        },
        {
          label: '岗位',
          prop: 'posts',
          width: '200'
        },
        {
          label: '辅导人次',
          prop: 'teacheNum',
          width: '200'
        },
        {
          label: '辅导津贴',
          prop: 'teacheAllowances',
          width: '200'
        }
      ],
      // 数据数组
      tableList: [],
      // 分页函数
      sizeChange,
      currentChange,
      getLoadingStatus,
      TEACHER_MODULE
    }
  },
  methods: {
    // 处理请求数据
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      return data
    },
    // 查询
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    // 重置
    reset() {
      resetObj(this.queryForm)
      this.queryForm.tip = 'Y'
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    // 下载文件
    download() {
      const data = this.getQueryForm()
      data.tip = 'N'
      this.$axios
        .post(
          '/fn/report/teacher/mentorAllowance',
          { data },
          { ...jsonHeaders, responseType: 'blob' }
        )
        .then((res) => {
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
    },
    // 获取数据
    getList() {
      const data = this.getQueryForm()
      fetchMentorAllowance({ data }).then(({ total, list }) => {
        this.total = total
        this.tableList = list
      })
    }
  }
}
</script>

<style lang="scss"></style>