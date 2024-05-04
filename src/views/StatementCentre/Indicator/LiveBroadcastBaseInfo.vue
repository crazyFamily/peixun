<template>
  <div
    class="
      statementCentre__liveBroadcastBaseInfo statementCentre__tutorAllowance
    "
  >
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="部门" class="first">
          <div class="df">
            <gc-institution v-model="queryForm.busiType"> </gc-institution>
            <div class="checkbox-wrap ml10">
              <el-checkbox v-model="queryForm.isGotSubBranch"
                >含下属机构</el-checkbox
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="主播姓名/UM号">
          <el-input v-model="queryForm.umId" class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="时间" class="search-card__date mr10 df">
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
            label="直播类型"
            :options="options"
            v-model="queryForm.liveType"
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
    <el-card class="mt10" v-loading="getLoadingStatus('LOADING_BANK_ZB_DETAIL')">
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
import { fetchBankZBDetail } from '@/fetch/statementCentre'

export default {
  name: 'LiveBroadcastBaseInfo',
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
      options: [
        {
          label: '正式直播',
          value: 0
        },
        {
          label: '测试直播',
          value: 1
        }
      ],
      // 字段数组
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: '机构',
          prop: 'orgName',
          width: '220'
        },
        {
          label: '直播id',
          prop: 'liveId',
          width: '120'
        },
        {
          label: '直播名称',
          prop: 'liveName',
          width: '140'
        },
        {
          label: '主播um',
          prop: 'anchorUm',
          width: '120'
        },
        {
          label: '主播姓名',
          prop: 'anchorName',
          width: '120'
        },
        {
          label: '直播日期',
          prop: 'liveDate',
          width: '100'
        },
        {
          label: '开始时间',
          prop: 'startTime',
          width: '100'
        },
        {
          label: '结束时间',
          prop: 'endTime',
          width: '100'
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
          '/fn/report/process/bankZBDetail',
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
    async getList() {
      const data = this.getQueryForm()
      data.tip = 'Y'
      const { total, list } = await fetchBankZBDetail({ data })
      this.total = total
      this.tableList = list
    }
  }
}
</script>

<style lang="scss">
.statementCentre__liveBroadcastBaseInfo {
  .w58 {
    .el-form-item__label {
      width: 58px;
    }
  }
}
</style>