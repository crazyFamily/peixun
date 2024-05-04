<template>
  <div class="StatementCentre__SynthesisIndex__OnlineRate">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="机构部门" class="">
          <div class="df">
            <gc-institution v-model="queryForm.busiType" :fetchParams="{module: CLASS_MODULE }"> </gc-institution>
          </div>
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
        <el-form-item class="r0">
          <el-checkbox v-model="queryForm.isShowSecondFH" class="ml10"
            >查看二级分行</el-checkbox
          >
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
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
        :total="queryForm.total"
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, (_) => _)"
        @currentChange="currentChange($event, queryForm, (_) => _)"
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
  localPaging,
  currentChange
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
import { CLASS_MODULE } from '../enum'
export default {
  name: 'OnlineRate',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        busiType: [],
        isGotSubBranch: 'N',
        isShowSecondFH: false,
        dateStart: '',
        dateEnd: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },

      list: [
        {
          type: 'index',
          label: '序号',
          width: 64
        },
        {
          label: '单位',
          width: '180',
          prop: 'orgName'
        },
        {
          label: '归属区域',
          prop: 'treeZoneName',
          width: '100'
        },
        {
          label: '结训培训班数',
          width: '100',
          prop: 'finishClassNum'
        },
        {
          label: '面授培训班平均满意度',
          width: '150',
          prop: 'satisfactionAvg'
        },
        {
          label: '线上评估培训班数',
          width: '130',
          prop: 'onlineEstimateNum'
        },
        {
          label: '线上评估使用率',
          width: '110',
          prop: 'onlineEstimateRate'
        },
        {
          label: '线上考勤培训班数',
          width: '125',
          prop: 'onlineCheckNum'
        },
        {
          label: '线上考勤使用率',
          width: '110',
          prop: 'onlineCheckRate'
        },
        {
          label: '线上评估及考勤培训班数',
          width: '160',
          prop: 'onlineEstimateAndCheckNum'
        },
        {
          label: '线上使用率',
          width: '90',
          prop: 'onlineEstimateAndCheckRate'
        }
      ],
      tableListBack: [],
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
      data.isShowSecondFH = data.isShowSecondFH ? 'Y' : 'N'
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
          '/fn/report/process/listOnlineUseRate',
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
        .post('/fn/report/process/listOnlineUseRate', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableListBack = list
          }
        })
    }
  },
  computed: {
    tableList() {
      const list = localPaging(this.tableListBack, this.queryForm)
      return list
    }
  }
}
</script>

<style lang="scss"></style>