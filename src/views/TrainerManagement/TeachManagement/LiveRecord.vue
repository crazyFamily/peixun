<template>
  <div class="TrainerManagement">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="主讲人部门">
          <div class="df">
            <gc-institution v-model="queryForm.orgId"></gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10" true-label="Y" false-label="N">包含子部门</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="直播ID">
          <el-input v-model="queryForm.liveId"></el-input>
        </el-form-item>
        <el-form-item label="直播名称">
          <el-input v-model="queryForm.liveName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="主讲人UM">
          <el-input v-model="queryForm.leaderUm"></el-input>
        </el-form-item>
        <el-form-item label="主讲人姓名">
          <el-input v-model="queryForm.leaderName"></el-input>
        </el-form-item> -->
        <el-form-item label="主讲人信息">
          <el-input v-model="queryForm.leaderInfo" placeholder="请输入主讲人UM/姓名"></el-input>
        </el-form-item>
        <el-form-item class="mr10">
          <el-form-item label="直播日期">
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
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="download" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <gc-table class="general__table" :list="list" :tableList="tableList">
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
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
  formatDate,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import { Message } from 'element-ui'
export default {
  name: 'LiveRecord',
  mixins: [handlePickerOptions],
  data() {
    return {
      // 查询用的表单
      queryForm: {
        liveId: '',
        liveName: '',
        leaderUm: '',
        leaderName: '',
        // 主讲人信息
        leaderInfo: '',
        // 主讲人部门
        orgId: '',
        isGotSubBranch: 'Y',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: '',
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        tip: 'Y'
      },
      total: 0,
      // 字段数组
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: '直播ID',
          prop: 'liveId',
          width: '80'
        },
        {
          label: '直播名称',
          prop: 'liveName',
          width: '120'
        },
        {
          label: '主讲人UM',
          prop: 'leaderUm',
          width: '120'
        },
        {
          label: '主讲人姓名',
          prop: 'leaderName',
          width: '110'
        },
        {
          label: '主讲人所在部门',
          prop: 'leaderOrgName',
          width: '200'
        },
        {
          label: '主讲时长（分钟）',
          prop: 'learnTime',
          width: '120'
        },
        {
          label: '直播开始时间',
          prop: 'startTime',
          width: '160'
        },
        {
          label: '直播结束时间',
          prop: 'finishTime',
          width: '160'
        },
        {
          label: '同步时间',
          prop: 'syncTime',
          width: '160'
        },
        {
          label: '积分状态',
          prop: 'scoreStatus',
          width: '100'
        }
        // {
        //     label: "总积分",
        //     prop: "totalPoints",
        //     width: "120",
        // },
      ],
      // 数据数组
      tableList: [],
      // 分页函数
      sizeChange,
      currentChange,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {}
    }
  },
  methods: {
    // 处理请求数据
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      data.orgId = data.orgId?.[1]
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
          '/fn/trainer/eval/liveRecordList',
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
      if(!data.orgId) return Message.warning('请先选择主讲人部门')
      data.tip = 'Y'
      this.$axios
        .post('/fn/trainer/eval/liveRecordList', { data }, jsonHeaders)
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