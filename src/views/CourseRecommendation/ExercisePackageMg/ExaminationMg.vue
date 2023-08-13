<template>
  <!--考试管理-->
  <div class="course-recommendation__examin-management">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="考试名称" prop="examName">
          <el-input v-model="queryForm.examName" class="w200" clearable></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="queryForm.keywords" clearable class="w200"></el-input>
        </el-form-item>
        <el-form-item label="考卷类型" prop="examType">
          <gc-select :options="examTypeOptions" v-model="queryForm.examType" clearable></gc-select>
        </el-form-item>
        <el-form-item label="创建人" prop="createdBy">
          <el-input v-model="queryForm.createdBy" clearable class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="考试开放时间" class="search-card__date mr10" prop="examStart">
            <el-date-picker
              v-model="queryForm.examStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date" prop="examEnd">
            <el-date-picker
              v-model="queryForm.examEnd"
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
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 数据表格 card -->
    <el-card class="mt10">
      <div class="menu-right no-line">
        <el-button @click="addExamin" type="primary">新增考试</el-button>
      </div>
      <gc-table class="general__table table-left overflow-first-child" :list="list" :tableList="tableList" ref="curriculumTableRef">
        <el-table-column label="推送次数" min-width="70" prop="courseNum" class-name="td-pr0">
          <template slot-scope="scope">
            <el-button v-if="scope.row.pushNum && scope.row.pushNum > 0" type="text" class="button-48-24" @click="toPushRecord(scope.row)">{{ scope.row.pushNum || '--' }}</el-button>
            <p v-else class="nodata-text">--</p>
          </template>
        </el-table-column>
        <el-table-column label="关联课程" min-width="70" prop="courseNum" class-name="td-pr0">
          <template slot-scope="scope">
            <el-button v-if="scope.row.courseNum && scope.row.courseNum > 0" type="text" class="button-48-24" @click="relatedCourse(scope.row)">{{ scope.row.courseNum || '--' }}</el-button>
            <p v-else class="nodata-text">--</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" prop="" class-name="td-pr0" fixed="right">
          <template slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="detailExamina(scope.row)">详情</span>
                <span class="active" @click="editExamina(scope.row)">修改</span>
                <span class="active" @click="delExamina(scope.row)">删除</span>
                <span class="active" @click="copyExamina(scope.row)">复制</span>
                <span class="active" @click="updateExamStatus(scope.row)" v-if="scope.row.status === '02001'">下架</span>
                <span class="active" @click="updateExamStatus(scope.row)" v-else>上架</span>
                <span class="active" @click="openPushDialog(scope.row)" v-if="validateStatusMap(scope.row, 'push')">推送</span>
                <span class="active" @click="toEaxmStatistics(scope.row)">考试统计</span>
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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

    <!-- 推送弹窗 -->
    <PushDialog :showPushDialog="showPushDialog" :pushInfo="pushInfo" @close="closePushDialog" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Message } from 'element-ui'
import router from '@/router'
import { addAllowKeepAlive } from '@/util/utils'
import {
  PUTAWAY,
  SOLDOUT,
  EOA_DRAFTS,
  EOA_WAITTING,
  EOA_DONE,
  EOA_BACK,
  EOA_WITHDRAW,
  QUIZZES,
  PUSH_TYPE,
} from '@/views/CourseRecommendation/enum'
import PushDialog from '../components/PushDialog'

// 操作相关状态属性
const validateStatusMap = (row, type) => {
  switch (type) {
    case 'push':
      return row.eoaStatus === EOA_DONE && row.status === PUTAWAY && row.examType !== QUIZZES
  }
  return true
}

// 推送
const showPushDialog = ref(false)
const pushInfo = ref({})
const pushType = PUSH_TYPE['exam']
const openPushDialog = (row) => {
  showPushDialog.value = true
  pushInfo.value = {
    ...row,
    businessId: row.id,
    businessType: pushType
  }
}
const toPushRecord = (row) => {
  if (row.pushNum > 0) {
    const params = {
      businessType: pushType,
      businessId: row.id
    }
    addAllowKeepAlive('/CRPushRecord')
    router.push({ name: '推送记录', params })
  } else {
    Message.warning('暂无历史推送记录')
  }
}
defineExpose({ showPushDialog })
</script>
<script>
import {
  hintFrame,
  sizeChange,
  jsonHeaders,
  commonFilter,
  currentChange,
  addAllowKeepAlive,
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import gcTag from '@/components/chunk/tag'
import DropdownTree from '@/components/dropdown/DropdownTree'
import { examTypeOptions, QUIZZES } from '@/views/CourseRecommendation/enum'

export default {
  name: 'CRExercisePackageAdd',
  mixins: [handlePickerOptions],
  components: { gcTag, DropdownTree },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        examName: '',
        keywords: '',
        examType: '',
        createdBy: '',
        examStart: '',
        examEnd: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      // 部门下拉选项
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      // 表格筛选公共函数
      commonFilter,
      statusOption: {
        '02000': '未上架',
        '02001': '已上架',
        '02002': '已下架'
      },
      eoaStatusOption: {
        '02000': '未提交',
        '02001': '审批中',
        '02002': '已通过',
        '02003': '已退回',
        '02004': '已撤回'
      },
      list: [
        {
          label: '考试名称',
          width: '350',
          prop: 'examName'
        },
        {
          label: '机构部门',
          width: '150',
          prop: 'blgOrgName'
        },
        {
          label: '考卷类型',
          width: '80',
          prop: 'examType',
          ctx: (row) => {
            let _l = this.examTypeOptions.filter((v) => v.value == row.examType)
            let _w = _l.length ? _l[0].label : '--'
            return _w || '--'
          }
        },
        {
          label: '开始时间',
          width: '150',
          prop: 'examStart'
        },
        {
          label: '题目总数',
          width: '68',
          prop: 'exerciseNum'
        },
        {
          label: '创建人',
          width: '150',
          prop: 'createdBy'
        },
        {
          label: '最近修改时间',
          width: '150',
          prop: 'updatedDate'
        },
        {
          label: '状态',
          width: '70',
          prop: 'status',
          ctx: (row) => {
            let _s = this.statusOption[row.status]
            return _s || '--'
          }
        },
        {
          label: '审批状态',
          width: '70',
          prop: 'eoaStatus',
          ctx: (row) => {
            let _s = this.eoaStatusOption[row.eoaStatus]
            return _s || '--'
          }
        }
      ],
      tableList: [],
      examTypeOptions: examTypeOptions,
      QUIZZES
    }
  },
  methods: {
    // 删除考试
    delExamina(row) {
      hintFrame(`确定删除：${row.examName}？`).then((res) => {
        const data = {
          examId: row.id
        }
        this.$axios.post('/fn/privatewealth/exam/deleteExamInfo', data, jsonHeaders).then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      })
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      this.$refs['form'].resetFields()
      this.query()
    },
    getList() {
      let data = this.queryForm
      data.examType = data.examType || null
      this.$axios.post('/fn/privatewealth/exam/queryExamInfoPage', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { total, list } = data
          this.total = total
          this.tableList = list
        }
      })
    },
    // 关联考试
    relatedCourse(row) {
      if (!row.id) return
      addAllowKeepAlive('/CRRelatedCourse')
      this.$router.push({
        name: '关联课程',
        params: {
          id: row.id
        }
      })
    },
    // 新增考试
    addExamin() {
      addAllowKeepAlive('/CRExaminationAdd')
      this.$router.push({
        name: '新增考试',
        params: {
          status: 'add'
        }
      })
    },
    // 详情
    detailExamina(item) {
      addAllowKeepAlive('/CRExaminationAdd')
      this.$router.push({
        name: '新增考试',
        params: {
          id: item.id,
          examName: item.examName,
          status: 'details'
        }
      })
    },
    // 编辑
    editExamina(item) {
      addAllowKeepAlive('/CRExaminationAdd')
      const disabledFiledArr = item.pushNum > 0 ? ['passScore', 'exerciseSettingList', 'exerciseMethod', 'examExerciseType'] : []
      this.$router.push({
        name: '新增考试',
        params: {
          id: item.id,
          examName: item.examName,
          status: 'edit',
          pushNum: item.pushNum,
          examStatus: item.status,
          disabledFiledArr
        }
      })
    },
    // 复制
    copyExamina(item) {
      addAllowKeepAlive('/CRExaminationAdd')
      this.$router.push({
        name: '新增考试',
        params: {
          id: item.id,
          examName: item.examName,
          status: 'copy'
        }
      })
    },
    // 上下架
    updateExamStatus(row) {
      let data = {
        id: row.id,
        status: row.status === '02001' ? '02002' : '02001'
      }
      this.$axios.post('/fn/privatewealth/exam/updateExamStatus', { ...data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.query()
          this.$message.success(row.status === '02001' ? row.examName + '下架成功' : row.examName + '上架成功')
        }
      })
    },
    // 考试统计
    toEaxmStatistics(item) {
      const { examName, id } = item
      addAllowKeepAlive('/CRExaminationStatistics')
      this.$router.push({
        name: '考试统计',
        params: {
          examId: id,
          examName
        }
      })
    },
    // 关闭推送弹窗
    closePushDialog(flag) {
      this.showPushDialog = false
      if (flag) this.getList()
    },
  },
  mounted() {
    this.query()
  },
  activated() {
    this.query()
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.overflow-first-child {
  :deep(.el-table td:first-of-type .cell) {
    display: block;
  }
}
</style>

<style lang="scss">
.course-recommendation__examin-management {
  .el-button.examin-btn {
    margin-left: 0 !important;
  }
  .cus-dialog {
    .el-dialog {
      width: 800px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.course-recommendation__examin-management {
  .gc-table .nodata-text {
    width: 48px;
    text-align: center;
  }
}
</style>
