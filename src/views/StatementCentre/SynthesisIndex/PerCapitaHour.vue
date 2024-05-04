<template>
  <div class="StatementCentre__SynthesisIndex__PerCapitaHour">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="条线分类" class="">
          <gc-select
            class="p0"
            :options="businessLineOptions"
            v-model="queryForm.busiType"
          ></gc-select>
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
        <el-form-item class="r0">
          <el-checkbox v-model="queryForm.isOutside" class="ml10"
            >只看外勤</el-checkbox
          >
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
  divide,
  CopyObj,
  resetObj,
  handleBlob,
  sizeChange,
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
import { fetchUserOrgTree } from '@/fetch/public'
import { busiTypes } from '@/util/constants'
import { CLASS_MODULE } from '../enum'
export default {
  name: 'PerCapitaHour',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        busiType: '',
        dateStart: '',
        dateEnd: '',
        isOutside: '',
        isShowSecondFH: '',
        currPage: 1,
        pageSize: 10
      },
      total: 0,
      list: [
        {
          label: '机构',
          width: '200',
          prop: 'orgName'
        },
        {
          label: '归属区域',
          prop: 'treeZoneName',
          width: '100'
        },
        {
          label: '期初人数',
          width: '90',
          prop: 'empNumFirst'
        },
        {
          label: '期末人数',
          width: '90',
          prop: 'empNumLast'
        },
        {
          label: '平均人数',
          width: '90',
          prop: 'empNumAvg'
        },
        {
          label: '总学时',
          width: '100',
          prop: 'totalHour'
        },
        {
          label: '总人均学时',
          width: '100',
          prop: 'totalHourAvg'
        },
        {
          label: '面授总学时',
          width: '100',
          prop: 'faceHour'
        },
        {
          label: '面授人均时',
          width: '100',
          prop: 'faceHourAvg'
        },
        {
          label: '移动总学时',
          width: '100',
          prop: 'mobileHour'
        },
        {
          label: '移动人均学时',
          width: '110',
          prop: 'mobileHourAvg'
        },
        {
          label: '直播',
          width: '100',
          prop: 'znLiveHour'
        },
        {
          label: '直播人均学时',
          width: '110',
          prop: 'znLiveHourAvg'
        },
        {
          label: '考试',
          width: '60',
          prop: 'znTestHour'
        },
        {
          label: '考试人均学时',
          width: '140',
          prop: 'znTestHourAvg'
        },
        {
          label: '课程学习',
          width: '90',
          prop: 'znCourseHour'
        },
        {
          label: '课程学习人均学时',
          width: '160',
          prop: 'znCourseHourAvg'
        },
        {
          label: '智能陪练（知鸟）',
          width: '130',
          prop: 'znITrainHour'
        },
        {
          label: '智能陪练(知鸟)人均学时',
          width: '180',
          prop: 'znITrainHourAvg'
        },
        {
          label: 'AI练',
          width: '80',
          prop: 'aiTrainingHour'
        },
        {
          label: 'AI练人均学时',
          width: '160',
          prop: 'aiTrainingHourAvg'
        },
        {
          label: '运营学堂',
          width: '100',
          prop: 'morZnplHour'
        },
        {
          label: '运营学堂人均学时',
          width: '160',
          prop: 'morZnplHourAvg'
        },
        {
          label: "TMS课程",
          width: "140",
          prop: "tmsHour",
        },
        {
          label: "TMS课程人均学时",
          width: "160",
          prop: "tmsHourAvg",
        },
        // {
        //   label: "小橙直播",
        //   width: "140",
        //   prop: "xczbHour",
        // },
        // {
        //   label: "小橙直播人均学时",
        //   width: "160",
        //   prop: "xczbHourAvg",
        // },
        {
          label: "案例中心",
          width: "140",
          prop: "alHour",
        },
        {
          label: "案例中心人均学时",
          width: "160",
          prop: "alHourAvg",
        },
        // {
        //   label: "外部线上培训",
        //   width: "140",
        //   prop: "otHour",
        // },
        // {
        //   label: "外部线上培训人均学时",
        //   width: "160",
        //   prop: "otHourAvg",
        // }
      ],
      tableList: [],
      // 工具函数
      sizeChange,
      currentChange,
      divide,
      CLASS_MODULE,
      businessLineOptions: []
    }
  },
  methods: {
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      data.isOutside = data.isOutside ? 'Y' : 'N'
      data.isShowSecondFH = data.isShowSecondFH ? 'Y' : 'N'
      return data
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
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
    // 查询条线分类
    getBlgStripLineOptions() {
      fetchUserOrgTree({ module: CLASS_MODULE }).then((res) => {
        this.businessLineOptions = res.map((v) => ({
          value: v.busiType,
          label: busiTypes.find((row) => row.value === v.busiType)?.label
        }))
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
  },
  created() {
    this.getBlgStripLineOptions()
  }
}
</script>

<style></style>