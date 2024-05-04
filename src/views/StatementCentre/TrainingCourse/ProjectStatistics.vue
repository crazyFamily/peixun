<template>
  <div class="statementCentre__projectStatistics">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="部门">
          <div class="df">
            <gc-institution v-model="queryForm.busiType"> </gc-institution>
            <div class="checkbox-wrap ml10">
              <el-checkbox v-model="queryForm.isGotSubBranch"
                >含下属机构</el-checkbox
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-form-item label="立项提交时间" class="search-card__date mr10 df">
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
          <el-form-item label="至" class="search-card__date r0 df">
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
        <el-form-item>
          <gc-select
            label="项目分类"
            v-model="queryForm.planType"
            :options="planTypeOptions"
          >
          </gc-select>
        </el-form-item>
        <el-form-item class="hide">
          <gc-select
            label="项目状态"
            v-model="queryForm.planStatus"
            :options="planStatusOptions"
          >
          </gc-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="download" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容表格 -->
    <el-card class="mt10" v-loading="getLoadingStatus('LOADING_TRAIN_STATISTIC_LIST')" >
      <gc-table class="general__table" :list="list" :tableList="tableList">
      </gc-table>
      <gc-pagination
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
  currentChange,
  getLoadingStatus
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import { fetchTrainStatisticList } from '@/fetch/statementCentre'

export default {
  name: 'ProjectStatistics',
  mixins: [handlePickerOptions],
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
        // 项目状态
        planStatus: '',
        // 项目分类
        planType: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        tip: 'Y',
        // 选择子机构标识
        isGotSubBranch: false
      },
      total: 0,
      // 项目状态下拉选项
      planStatusOptions: [
        {
          label: '立项审批中',
          value: '1'
        },
        {
          label: '立项通过未结训',
          value: '2'
        },
        {
          label: '已结训',
          value: '3'
        }
      ],
      // 项目分类下拉选项
      planTypeOptions: [
        {
          label: '培训班项目',
          value: '01001'
        },
        {
          label: '非培训班项目',
          value: '01002'
        }
      ],
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
          label: '项目编号',
          prop: 'classId',
          width: '110'
        },
        {
          label: '立项时间',
          prop: 'createdDate',
          width: '110',
          ctx: (row) => row.createdDate.split(' ')[0]
        },
        {
          label: '单位',
          prop: 'orgName',
          width: '200'
        },
        {
          label: '培训项目名称',
          prop: 'className',
          width: '200'
        },
        {
          label: '项目状态',
          prop: 'classStatus',
          width: '90'
        },
        {
          label: '立项人',
          prop: 'createdByName',
          width: '110'
        },
        {
          label: '开始时间',
          prop: 'dateStart',
          width: '90'
        },
        {
          label: '结束时间',
          prop: 'dateEnd',
          width: '90'
        }
      ],
      // 数据数组
      tableList: [],
      // 分页函数
      sizeChange,
      currentChange,
      getLoadingStatus
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
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm)
      this.queryForm.tip = 'Y'
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    download() {
      const data = this.getQueryForm()
      data.tip = 'N'
      this.$axios
        .post(
          '/fn/report/class/trainStatisticList',
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
    async getList() {
      const data = this.getQueryForm()
      data.tip = 'Y'
      const {total, list} = await fetchTrainStatisticList({ data })
      this.total = total
      this.tableList = list
    }
  }
}
</script>

<style lang="scss">
.statementCentre__projectStatistics {
  .search-card {
    .el-card__body {
      display: flex;
      .el-form {
        flex: 1;
      }
    }
  }
}
</style>