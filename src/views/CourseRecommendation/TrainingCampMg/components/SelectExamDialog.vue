<template>
  <div class="exam_container exam">
    <el-card class="box-card">
      <el-form :model="queryForm" ref="queryForm" class="form-container">
        <el-form-item label="考试名称：" prop="examName">
          <el-input v-model="queryForm.examName" clearable placeholder="请输入考试名称"> </el-input>
        </el-form-item>
        <el-form-item label="考卷类型：" prop="examType">
          <el-select v-model="queryForm.examType" clearable>
            <el-option v-for="item in examTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option
          ></el-select>
        </el-form-item>
        <el-form-item label="创建人：" prop="createdBy">
          <el-input v-model="queryForm.createdBy" clearable placeholder="请输入创建人"> </el-input>
        </el-form-item>
        <el-form-item label="创建时间：" class="search-card__date" prop="createdDate">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            placeholder="选择日期"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changCreatedDate"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="self-item">
          <el-button type="primary" @click="toSearch">查询</el-button>
          <el-button @click="toReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card mt20">
      <table-pagination
        :list="tableColumns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        :pageSizes="[5, 10]"
        ref="tablePagination"
      >
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button class="button-48-24" @click="addExam(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import { jsonHeaders } from '@/util/utils'
export default {
  data() {
    return {
      // 查询用的表单
      queryForm: {
        examName: '',
        keywords: '',
        examType: '',
        createdBy: '',
        dateRange: null,
        examStart: '',
        examEnd: '',
        total: 0,
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 5
      },
      tableColumns: [
        {
          label: '考试名称',
          width: '70',
          prop: 'examName'
        },
        {
          label: '机构部门',
          width: '70',
          prop: 'blgOrgName'
        },
        {
          label: '考卷类型',
          width: '50',
          prop: 'examType',
          ctx: (row) => {
            let _l = this.examTypeOptions.filter((v) => v.value == row.examType)
            let _w = _l.length ? _l[0].label : '--'
            return _w || '--'
          }
        },
        {
          label: '题目总数',
          width: '70',
          prop: 'exerciseNum'
        },
        {
          label: '创建人',
          width: '70',
          prop: 'createdBy'
        },
        {
          label: '最近修改时间',
          width: '70',
          prop: 'updatedDate'
        }
      ],
      tableList: [],
      examTypeOptions: [
        {
          label: '月考',
          value: 1
        },
        {
          label: '综合考',
          value: 2
        },
        {
          label: '周考',
          value: 3
        }
      ]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let data = this.queryForm
      data.examType = data.examType || null
      data.status = '02001'
      this.$axios.post('/fn/privatewealth/exam/queryExamInfoPage', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { total, list } = data
          this.queryForm.total = total
          this.tableList = list
        }
      })
    },
    changCreatedDate(event) {
      this.queryForm.examStart = (event && event[0]) || null
      this.queryForm.examEnd = (event && event[1]) || null
    },
    toSearch() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    toReset() {
      this.$refs['queryForm'].resetFields()
      this.queryForm.dateRange = null
      this.queryForm.examStart = null
      this.queryForm.examEnd = null
      this.getList()
    },
    addExam(row) {
      // this.$emit('cancel', 'exam', row)
      this.$emit('confirm', 'exam', row)
      console.log('addExam', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.exam_container {
  & .form-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: flex-end;
    & .el-form-item {
      margin-right: 30px;
      margin-bottom: 0;
      & .el-select,
      .el-date-editor {
        width: 100%;
      }
      &.self-item {
        grid-column-start: 3;
        grid-column-end: 4;
        text-align: right;
      }
    }
  }
}
</style>