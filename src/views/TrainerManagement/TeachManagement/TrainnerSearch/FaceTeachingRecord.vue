<template>
  <div class="TrainerManagement">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="部门">
          <div class="df">
            <gc-institution
              v-model="queryForm.busiType"
              @change="busiTypeChange"
            >
            </gc-institution>

            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"
              >包含子部门</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item label="评聘年度">
          <gc-select
            class="p0"
            k="evaluateYearName"
            v="evaluateYearId"
            :options="evaluateYearOptions"
            v-model="queryForm.evaluateYear"
          >
          </gc-select>
        </el-form-item>
        <el-form-item label="培训师类型">
          <gc-select
            :options="trainerOptions"
            v-model="queryForm.trainerType"
          ></gc-select>
        </el-form-item>
        <el-form-item label="授课领域">
          <gc-select
            class="p0"
            k="dataValue"
            v="dataEncode"
            v-model="queryForm.lecturesArea"
            placeholder="请选择授课领域"
            :options="lecturesAreaOptions"
          >
          </gc-select>
        </el-form-item>
        <el-form-item label="培训师UM号/姓名">
          <el-input v-model.trim="queryForm.teacherUm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="授课日期" class="mr10">
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
          <el-form-item label="至" label-width="22px">
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

        <el-form-item label="在职状态">
          <gc-select
            v-model="queryForm.isLeaved"
            :options="isLeavedOptions"
          ></gc-select>
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
  jsonHeaders,
  currentChange
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
export default {
  name: 'FaceTeachingRecordS',
  mixins: [handlePickerOptions],
  data() {
    return {
      // 查询用的表单
      queryForm: {
        // 条线
        busiType: '',
        orgId: '',
        // 选择子机构标识
        isGotSubBranch: false,
        teacherUm: '',
        evaluateYear: '',
        trainerType: '',
        lecturesArea: '',
        isLeaved: '',
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
      isLeavedOptions: [
        {
          label: '在职',
          value: 'N'
        },
        {
          label: '离司',
          value: 'Y'
        }
      ],
      total: 0,
      // 评聘年度下拉选项
      evaluateYearOptions: [],
      // 培训师类型下拉选项
      trainerOptions: [
        {
          label: '菁英培训师(一级)',
          value: '03001001'
        },
        {
          label: '菁英培训师(二级)',
          value: '03001002'
        },
        {
          label: '菁英培训师(三级)',
          value: '03001003'
        },
        {
          label: '菁英培训师(四级)',
          value: '03001004'
        },
        {
          label: '菁英培训师(五级)',
          value: '03001005'
        }
      ],
      // 授课领域下拉选项
      lecturesAreaOptions: [],
      // 字段数组
      list: [
        {
          label: '序号',
          type: 'index',
          width: '64'
        },
        {
          label: '培训师UM账号',
          prop: 'teacherUm',
          width: '120'
        },
        {
          label: '培训师姓名',
          prop: 'teacherName',
          width: '120'
        },
        {
          label: '所在部门',
          prop: 'teacherOrgName',
          width: '180'
        },
        {
          label: '所在岗位',
          prop: 'postDesc',
          width: '180'
        },
        {
          label: '培训师类型',
          prop: 'trainersTypeName',
          width: '180'
        },
        {
          label: '授课领域一',
          prop: 'lecturesAreaFirstName',
          width: '180'
        },
        {
          label: '授课领域二',
          prop: 'lecturesAreaSecName',
          width: '180'
        },
        {
          label: '评聘年度',
          prop: 'evaluateYear',
          width: '180'
        },
        {
          label: '在职状态',
          prop: 'isLeaved',
          width: '100'
        },
        {
          label: '培训班编号',
          prop: 'classId',
          width: '120'
        },
        {
          label: '培训班名称',
          prop: 'className',
          width: '120'
        },
        {
          label: '举办部门',
          prop: 'orgName',
          width: '120'
        },
        {
          label: '授课名称',
          prop: 'courseName',
          width: '100'
        },
        // {
        //     label: "授课类型",
        //     prop: "teacherTypeDesc",
        //     width: "100",
        // },
        {
          label: '授课日期',
          prop: 'courseDate',
          width: '100'
        },
        {
          label: '开始时间',
          prop: 'dateStart',
          width: '100'
        },
        {
          label: '结束时间',
          prop: 'dateEnd',
          width: '100'
        },
        {
          label: '授课时长(分钟)',
          prop: 'teachFaceTime',
          width: '120'
        },
        {
          label: '结训日期',
          prop: 'trainedDate',
          width: '120'
        },
        {
          label: '积分状态',
          prop: 'scoreStatus',
          width: '100'
        }
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
      resetObj(this.queryForm, { evaluateYear: '' })
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
          '/fn/trainer/eval/faceToFaceListByTrainers',
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
      if (!data.orgId) return this.$message.warning('请先选择机构和条线')
      data.tip = 'Y'
      this.$axios
        .post(
          '/fn/trainer/eval/faceToFaceListByTrainers',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.total = total
            this.tableList = list
          }
        })
    },
    busiTypeChange(orgName) {
      if (orgName) {
        this.queryForm.isGotSubBranch = true
      }
    },
    getEvaluateYearOptions() {
      this.$axios
        .post('/fn/trainer/setting/listEvaluationYear', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.evaluateYearOptions = data
            this.queryForm.evaluateYear = data.slice(-1)[0]?.evaluateYearId
          }
        })
    },
    getLecturesAreaOptions() {
      this.$axios
        .post(
          '/fn/commons/dict/listDictsForSelector',
          {
            data: {
              dataCtgy: 'trainer_course_area'
            }
          },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.lecturesAreaOptions = data
          }
        })
    }
  },
  mounted() {
    this.getEvaluateYearOptions()
    this.getLecturesAreaOptions()
  }
}
</script>

<style lang="scss">
.TrainerManagement {
  .search-form {
    min-width: 1056px;
    max-width: 1500px;
    width: auto;
    > .el-form-item {
      width: 426px;
      margin-right: 74px;
    }
  }
  .fwrap-end-1 {
    min-width: 180px;
  }
}
</style>