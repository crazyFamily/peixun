<template>
  <div class="StatementCentre__SynthesisIndex__ProjectCost">
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
          <el-form-item label="培训班结束时间" class="mr10">
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
          <el-form-item label="至">
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

        <!-- <el-form-item label="班主任姓名/UM">
                    <el-input placeholder="请输入班主任姓名/UM"></el-input>
                </el-form-item>
                <el-form-item label="培训项目名称/编号">
                    <el-input placeholder="请输入培训项目名称/编号"></el-input>
                </el-form-item> -->
        <el-form-item class="mr10">
          <el-form-item label="报销时间" label-width="60px" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.reimStart"
              type="date"
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
              v-model="queryForm.reimEnd"
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
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="download" class="button-w80-h30">导出</el-button>
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
  name: 'ProjectCost',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        busiType: [],
        isGotSubBranch: '',
        dateStart: '',
        dateEnd: '',
        reimStart: '',
        reimEnd: '',
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
          label: '项目编号',
          width: '100',
          prop: 'classId'
        },
        {
          label: '项目名称',
          width: '100',
          prop: 'className'
        },
        {
          label: '项目类型',
          width: '150',
          prop: 'projectType'
        },
        {
          label: '项目子类型',
          width: '110',
          prop: 'classTypeTwoName'
        },
        {
          label: '培训序列',
          width: '120',
          prop: 'trainSeriesName'
        },
        {
          label: '培训子序列',
          width: '120',
          prop: 'trainChildSeriesName'
        },
        {
          label: '业务模块名称',
          width: '120',
          prop: 'channelTypeName'
        },
        {
          label: '关键岗位名称',
          width: '130',
          prop: 'keyJobName'
        },
        {
          label: '项目负责人UM',
          width: '100',
          prop: 'createdBy'
        },
        {
          label: '项目负责人',
          width: '100',
          prop: 'createdByEmpName'
        },
        {
          label: '单位',
          width: '100',
          prop: 'blgOrgName'
        },
        {
          label: '部门',
          width: '100',
          prop: 'createdByOrgName'
        },
        {
          label: '费用来源',
          width: '100',
          prop: 'expenseType'
        },
        {
          label: '项目开始日期',
          width: '100',
          prop: 'dateStart'
        },
        {
          label: '项目结束日期',
          width: '100',
          prop: 'dateEnd'
        },
        {
          label: '立项总金额',
          width: '100',
          prop: 'totalFee'
        },
        {
          label: '实际报销总金额',
          width: '140',
          prop: 'usedTotalFee'
        },
        {
          label: '剩余总额度',
          width: '100',
          prop: 'leavedTotalFee'
        },
        {
          label: '餐杂费',
          width: '140',
          prop: 'var1'
        },
        {
          label: '场租及会务费费',
          width: '120',
          prop: 'var2'
        },
        {
          label: '外部课程研发费用',
          width: '140',
          prop: 'var3'
        },
        {
          label: '外部培训师课酬（含差旅）',
          width: '180',
          prop: 'var4'
        },
        {
          label: '资格认证费',
          width: '100',
          prop: 'var6'
        },
        {
          label: '平安大学培训费（移动）',
          width: '160',
          prop: 'var7'
        },
        {
          label: '平安大学培训费（面授）',
          width: '160',
          prop: 'var8'
        },
        // {
        //     label: "讲师课时费",
        //     width: "100",
        //     prop: "",
        // },
        // {
        //     label: "课程研发费用",
        //     width: "100",
        //     prop: "",
        // },
        {
          label: '机票-不含民航发展基金',
          width: '160',
          prop: 'var9'
        },
        {
          label: '机票-民航发展基金  ',
          width: '140',
          prop: 'var10'
        },
        {
          label: '火车票',
          width: '100',
          prop: 'var11'
        },
        {
          label: '公路/水路客票(有身份信息) ',
          width: '180',
          prop: 'var12'
        },
        {
          label: '培训差旅-其它',
          width: '120',
          prop: 'var13'
        },
        {
          label: '交通补助',
          width: '160',
          prop: 'var14'
        },
        {
          label: '住宿费',
          width: '100',
          prop: 'var15'
        },
        {
          label: '交通费（平安大学）',
          width: '140',
          prop: 'var16'
        },
        {
          label: '出差补助',
          width: '100',
          prop: 'var17'
        },
        {
          label: '其他费用',
          width: '100',
          prop: 'otherReward'
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
          '/fn/report/process/listProjectFeeDetail',
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
      if (!data.dateStart && !data.dateEnd) {
        return this.$message.warning('请选择培训班结束时间')
      }
      data.tip = 'Y'
      return this.$axios
        .post('/fn/report/process/listProjectFeeDetail', { data }, jsonHeaders)
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

<style lang="scss">
.StatementCentre__SynthesisIndex__ProjectCost {
  .search-form {
    width: 1056px;
    div.el-form-item {
      margin-right: 60px;
    }
  }
}
</style>