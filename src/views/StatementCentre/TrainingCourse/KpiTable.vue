<template>
  <div class="StatementCentre__SynthesisIndex__PerCapitaHour">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="机构部门">
          <div class="df">
            <gc-institution v-model="queryForm.busiType"> </gc-institution>

            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-form-item label="时间" class="mr10">
            <el-date-picker
              class="w-120"
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
          <el-form-item label="至" class="mr100">
            <el-date-picker
              class="w-120"
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
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30">查询</el-button>
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
  CopyObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  name: 'PerCapitaHour',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        busiType: [],
        isGotSubBranch: '',
        dateStart: '',
        dateEnd: '',
        currPage: 1,
        pageSize: 10
      },
      total: 0,
      list: [
        {
          label: '单位',
          width: '200',
          prop: ''
        },
        {
          label: '面授培训平均满意度',
          width: '160',
          prop: ''
        },
        {
          label: '人均学时',
          width: '90',
          prop: ''
        },
        {
          label: 'AI使用率',
          width: '90',
          prop: ''
        },
        {
          label: '总学时',
          width: '80',
          prop: ''
        },
        {
          label: '总人均学时',
          width: '100',
          prop: ''
        },
        {
          label: 'AI使用率',
          width: '100',
          prop: ''
        },
        {
          label: '知鸟必修课完成率',
          width: '160',
          prop: ''
        },
        {
          label: '新员工入职线上课程完成率',
          width: '200',
          prop: ''
        },
        {
          label: '培训管理线上化率',
          width: '140',
          prop: ''
        },
        {
          label: '培训费用执行率',
          width: '120',
          prop: ''
        }
      ],
      tableList: []
    }
  },
  methods: {
    query() {},
    download() {},
    getList() {}
  }
}
</script>

<style></style>