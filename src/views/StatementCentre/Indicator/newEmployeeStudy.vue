<template>
  <div
    class="statementCentre__liveBroadcastBaseInfo statementCentre__tutorAllowance"
  >
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="部门" class="first">
          <div class="df">
            <gc-institution v-model="queryForm.busiType" :fetchParams="{module: SPARK_MODULE }"> </gc-institution>
            <div class="checkbox-wrap ml10">
              <el-checkbox v-model="queryForm.isGotSubBranch"
                >含下属机构</el-checkbox
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="UM号">
          <el-input v-model="queryForm.umId" class="w200"></el-input>
        </el-form-item>
        <el-form-item class="mr20">
          <el-form-item label="入职时间" class="search-card__date mr10 df w58">
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

        <div class="search-card__button">
          <el-button @click="query">查询</el-button>
          <el-button @click="reset" type="primary">重置</el-button>
          <el-button @click="download" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10" v-loading="getLoadingStatus('LOADING_ORGSTAFF_LIST')">
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
import { SPARK_MODULE } from '../enum'
import { fetchOrgStaffList } from '@/fetch/statementCentre'

export default {
  name: 'NewEmployeeStudy',
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
          label: 'UM号',
          prop: 'umId',
          width: '160'
        },
        {
          label: '姓名',
          prop: 'empName',
          width: '100'
        },
        {
          label: '部门',
          prop: 'orgName',
          width: '200'
        },
        {
          label: '入职时间',
          prop: 'dateHire',
          width: '100'
        },
        {
          label: '零售业务课程完成时间',
          prop: 'retailBaseDate',
          width: '140'
        },
        {
          label: '零售业务课程考试完成时间',
          prop: 'retailBasePass',
          width: '180'
        },
        {
          label: '运营学堂推送时间',
          prop: 'sectionTime',
          width: '160'
        },
        {
          label: '运营学堂完成时间',
          prop: 'opClassDate',
          width: '140'
        },
        {
          label: '网点孵化进度',
          prop: 'wdfhProgress',
          width: '140'
        },
        {
          label: '网点孵化开始时间',
          prop: 'wdBeginTime',
          width: '140'
        },
        {
          label: '网点孵化结束时间',
          prop: 'wdEndTime',
          width: '140'
        },
        {
          label: '网点孵化总成绩',
          prop: 'wdFinalScore',
          width: '140'
        },
        {
          label: '网点孵化达标成绩',
          prop: 'wdfhGoalsScore',
          width: '140'
        }
      ],
      // 数据数组
      tableList: [],
      // 分页函数
      sizeChange,
      currentChange,
      getLoadingStatus,
      SPARK_MODULE
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
          '/fn/report/process/orgStaffList',
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
      const {total, list} = await fetchOrgStaffList({ data })
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