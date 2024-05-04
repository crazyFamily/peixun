<template>
  <div class="StatementCentre__SynthesisIndex__PersonCost">
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
          <el-form-item label="培训班时间" class="mr10">
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

        <el-form-item label="班主任姓名/UM">
          <el-input placeholder="请输入班主任姓名/UM"></el-input>
        </el-form-item>
        <el-form-item label="培训项目名称/编号">
          <el-input placeholder="请输入培训项目名称/编号"></el-input>
        </el-form-item>
        <el-form-item class="mr10">
          <el-form-item label="报销时间" label-width="60px" class="mr10">
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
          <el-form-item label="至">
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
  handleBlob,
  sizeChange,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  name: 'PersonCost',
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
          type: 'index',
          label: '序号',
          width: 64
        },
        {
          label: '姓名',
          width: '100',
          prop: ''
        },
        {
          label: 'UM',
          width: '100',
          prop: ''
        },
        {
          label: '单位',
          width: '100',
          prop: ''
        },

        {
          label: '部门',
          width: '100',
          prop: ''
        },
        {
          label: '项目编号',
          width: '150',
          prop: ''
        },
        {
          label: '项目名称',
          width: '110',
          prop: ''
        },
        {
          label: '项目类型',
          width: '120',
          prop: ''
        },
        {
          label: '项目子类型',
          width: '120',
          prop: ''
        },
        {
          label: '培训序列',
          width: '120',
          prop: ''
        },
        {
          label: '培训子序列',
          width: '130',
          prop: ''
        },
        {
          label: '业务模块名称',
          width: '100',
          prop: ''
        },
        {
          label: '关键岗位名称',
          width: '100',
          prop: ''
        },
        {
          label: '项目负责人UM',
          width: '100',
          prop: ''
        },
        {
          label: '项目负责人',
          width: '100',
          prop: ''
        },
        {
          label: '项目开始日期',
          width: '100',
          prop: ''
        },
        {
          label: '项目结束日期',
          width: '100',
          prop: ''
        },
        {
          label: '费用支出总额',
          width: '100',
          prop: ''
        },
        {
          label: '餐杂费',
          width: '100',
          prop: ''
        },
        {
          label: '场租及会务费费',
          width: '100',
          prop: ''
        },
        {
          label: '外部课程研发费用',
          width: '100',
          prop: ''
        },
        {
          label: '外部培训师课酬（含差旅）',
          width: '100',
          prop: ''
        },
        {
          label: '资格认证费',
          width: '100',
          prop: ''
        },
        {
          label: '平安大学培训费（移动）',
          width: '100',
          prop: ''
        },
        {
          label: '平安大学培训费（面授）',
          width: '100',
          prop: ''
        },
        {
          label: '讲师课时费',
          width: '100',
          prop: ''
        },
        {
          label: '课程研发费用',
          width: '100',
          prop: ''
        },
        {
          label: '其他费用',
          width: '100',
          prop: ''
        },
        {
          label: '机票-不含民航发展基金',
          width: '100',
          prop: ''
        },
        {
          label: '机票-民航发展基金  ',
          width: '100',
          prop: ''
        },
        {
          label: '火车票',
          width: '100',
          prop: ''
        },
        {
          label: '公路/水路客票(有身份信息) ',
          width: '100',
          prop: ''
        },
        {
          label: '培训差旅-其它',
          width: '100',
          prop: ''
        },
        {
          label: '交通补助',
          width: '100',
          prop: ''
        },
        {
          label: '住宿费',
          width: '100',
          prop: ''
        },
        {
          label: '交通费（平安大学）',
          width: '100',
          prop: ''
        },
        {
          label: '出差补助',
          width: '100',
          prop: ''
        }
      ],
      tableList: [],
      sizeChange,
      currentChange
    }
  },
  methods: {
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      const [busiType, orgId] = data.busiType
      ;[data.busiType, data.orgId] = [busiType, orgId]
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
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
          '/fn/report/process/listOrgStudyRecord',
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
        .post('/fn/report/process/listOrgStudyRecord', { data }, jsonHeaders)
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