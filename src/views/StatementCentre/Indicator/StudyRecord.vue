<template>
  <div class="StatementCentre__SynthesisIndex__PerCapitaHour">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="机构部门" class="">
          <div class="df">
            <gc-institution v-model="queryForm.busiType" :fetchParams="{module: CLASS_MODULE }"> </gc-institution>

            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item label="UM号">
          <el-input v-model="queryForm.umId"></el-input>
        </el-form-item>
        <el-form-item label="学习类型">
          <gc-select
            :options="studyTypeListOptions"
            v-model="queryForm.studyType"
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
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
              :picker-options="
                handleStartPickerOptions(queryForm, 'dateEnd', true)
              "
            >
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="至">
                        <el-date-picker
                            class="w-120"
                            v-model="queryForm.dateEnd"
                            type="month"
                            placeholder="选择日期"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            popper-class="date-picker"
                            :picker-options="
                                handleEndPickerOptions(
                                    queryForm,
                                    'dateStart',
                                    true
                                )
                            "
                        >
                        </el-date-picker>
                    </el-form-item> -->
        </el-form-item>

        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="download" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10" v-loading="getLoadingStatus('LOADING_PERSONAL_STUDY_RECORD')">
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
  currentChange,
  handleEndPickerOptions,
  handleStartPickerOptions,
  getLoadingStatus
} from '@/util/utils'
import { fetchListPersonalStudyRecord } from '@/fetch/statementCentre'
import { CLASS_MODULE } from '../enum'
export default {
  name: 'StudyRecord',
  mixins: [],
  data() {
    return {
      queryForm: {
        busiType: [],
        isGotSubBranch: '',
        dateStart: '',
        dateEnd: '',
        umId: '',
        studyType: '1',
        currPage: 1,
        pageSize: 10
      },
      studyTypeListOptions: [
        {
          label: '培训班',
          value: '1'
        },
        {
          label: '课程学习',
          value: '2'
        },
        {
          label: '直播',
          value: '3'
        },
        {
          label: '考试',
          value: '4'
        },
        {
          label: '智能陪练（知鸟）',
          value: '5'
        },
        {
          label: 'AI练',
          value: '6'
        },
        {
          label: '运营学堂',
          value: '7'
        },
        {
          label: "TMS课程",
          value: "8",
        },
        {
          label: "案例中心",
          value: "10",
        }
      ],
      total: 0,

      list: [
        {
          label: '机构',
          width: '200',
          prop: 'orgName'
        },
        {
          label: 'UM号',
          width: '120',
          prop: 'umId'
        },
        {
          label: '姓名',
          width: '100',
          prop: 'empName'
        },
        {
          label: '岗位',
          width: '200',
          prop: 'postDesc'
        },
        {
          label: '学习内容',
          width: '200',
          prop: 'studyContent'
        },
        {
          label: '时长',
          width: '100',
          prop: 'studyHour'
        },
        {
          label: '培训类型',
          width: '100',
          prop: 'trainingType'
        },
        {
          label: '分类',
          width: '100',
          prop: 'classfiyName'
        },
        {
          label: '项目编号',
          width: '120',
          prop: 'projectNo'
        },
        {
          label: '开始时间',
          width: '100',
          prop: 'startDate'
        },
        {
          label: '结束时间',
          width: '100',
          prop: 'endDate'
        }
      ],
      tableList: [],
      sizeChange,
      currentChange,
      handleEndPickerOptions,
      handleStartPickerOptions,
      getLoadingStatus,
      CLASS_MODULE
    }
  },
  methods: {
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      data.dateEnd = data.dateStart
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
    download() {
      const data = this.getQueryForm()
      data.tip = 'N'
      this.$axios
        .post(
          '/fn/report/process/listPersonalStudyRecord',
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
      const { total, list } = await fetchListPersonalStudyRecord({ data })
      this.total = total
      this.tableList = list
    }
  }
}
</script>

<style></style>