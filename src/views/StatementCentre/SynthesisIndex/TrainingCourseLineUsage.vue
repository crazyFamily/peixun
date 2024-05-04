<template>
  <div class="StatementCentre__SynthesisIndex__OnlineRate">
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
        <el-form-item label="培训班编号">
          <el-input
            v-model.trim="queryForm.var1"
            placeholder="请输入培训班编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="班主任姓名/UM">
          <el-input
            v-model.trim="queryForm.var2"
            placeholder="请输入班主任姓名/UM"
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
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker
              class="w-120"
              v-model="queryForm.dateEnd"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30">查询</el-button>
          <el-button @click="reset" class="button-w80-h30" type="primary"
            >重置</el-button
          >
          <el-button @click="download" class="button-w80-h30" type="primary"
            >导出</el-button
          >
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <gc-table
        class="general__table table-left"
        :list="list"
        :tableList="tableList"
      >
      </gc-table>
      <gc-pagination
        class="between"
        :total="total"
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
      />
    </el-card>
  </div>
</template>

<script>
import {
  lastDay,
  CopyObj,
  resetObj,
  handleBlob,
  sizeChange,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
import { CLASS_MODULE } from '../enum'
export default {
  name: 'TrainingCourseLineUsage',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        busiType: [],
        isGotSubBranch: '',
        dateStart: '',
        dateEnd: '',
        var1: '',
        var2: '',
        currPage: 1,
        pageSize: 10
      },
      total: 0,
      list: [
        {
          type: 'index',
          label: '序号',
          width: 64
        },
        {
          label: '部门',
          width: '200',
          prop: 'orgName'
        },
        {
          label: '培训班编号',
          width: '120',
          prop: 'classId'
        },
        {
          label: '培训班名称',
          width: '120',
          prop: 'className'
        },
        {
          label: '班主任',
          width: '120',
          prop: 'createdByEmpName'
        },
        {
          label: '开始时间',
          width: '120',
          prop: 'dateStart'
        },
        {
          label: '结束时间',
          width: '120',
          prop: 'dateEnd'
        },
        {
          label: '是否结训',
          width: '120',
          prop: 'isFinish'
        },
        {
          label: '结训时间',
          width: '120',
          prop: 'dateFinish'
        },
        {
          label: '是否使用线上考勤',
          width: '140',
          prop: 'isOnlineCheck'
        },
        {
          label: '是否使用线上评估',
          width: '160',
          prop: 'isOnlineEstimate'
        },
        {
          label: '是否同时使用线上考勤及评估',
          width: '200',
          prop: 'isOnlineEstimateAndCheck'
        },
        {
          label: '面授培训班满意度',
          width: '160',
          prop: 'evaluationScore'
        }
      ],
      tableList: [],
      sizeChange,
      currentChange,
      CLASS_MODULE
    }
  },
  methods: {
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      data.dateEnd = lastDay(data.dateEnd)
      return data
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
      this.getList()
    },
    download() {
      const data = this.getQueryForm()
      data.tip = 'N'
      return this.$axios
        .post(
          '/fn/report/process/listOnlineUseRateDetail',
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
    getList() {
      const data = this.getQueryForm()
      data.tip = 'Y'
      return this.$axios
        .post(
          '/fn/report/process/listOnlineUseRateDetail',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
          }
        })
    }
  }
}
</script>

<style lang="scss"></style>