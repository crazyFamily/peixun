<template>
  <div class="studen-detail">
    <el-form :model="studenForm" ref="studentSearchForm" class="form-container">
      <el-form-item label="部门" prop="orgId">
        <el-col :span="20">
          <el-select
            v-model="studenForm.orgId"
            placeholder="请选择部门"
            clearable
            filterable
          >
            <el-option
              v-for="item in orgOptions"
              :key="item.key"
              :label="item.orgName"
              :value="item.orgId"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="人员" prop="umId">
        <el-col :span="20">
          <el-input v-model="studenForm.umId" placeholder="请输入UM或姓名">
          </el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button @click="toReset">重置</el-button>
      </el-form-item>
      <el-form-item label="得分">
        <el-col :span="9">
          <el-input
            v-model="studenForm.minScore"
            style="width: 100%"
            placeholder="请输入分数"
          ></el-input>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center">-</el-col>
        <el-col :span="9">
          <el-input
            v-model="studenForm.maxScore"
            style="width: 100%"
            placeholder="请输入分数"
          ></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <el-row class="mb20">
      <el-col :span="6" :offset="22">
        <el-button @click="deportExcel" :disabled="studentList.length === 0"
          >导出excel</el-button
        >
      </el-col>
    </el-row>
    <el-table
      ref="exampleTable"
      :data="studentList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        v-for="item in studentListTabHeader"
        :sortable="item.sortable"
        :key="item.label"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.width"
        show-overflow-tooltip
        :formatter="item.formatter"
      >
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-show="scope.row.examRecordId"
            @click.stop="exportExamRecordDetail(scope.row)"
            >详情下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <gc-pagination
      class="between"
      :total="total"
      layout="prev, pager, next,slot, sizes"
      prev-text=""
      next-text=""
      :page-sizes="[20, 40, 60, 80, 100]"
      :page-size="queryForm.size"
      :current-page="queryForm.page"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    >
      <span class="text">每页显示</span>
    </gc-pagination>
  </div>
</template>

<script>
import { jsonHeaders, handleBlob } from '@/util/utils'
import { getOrg } from '../utils'
import { exercisePackageHooks } from './hooks/exercisePackageHooks'
const { useCacheParams } = exercisePackageHooks()
export default {
  data() {
    return {
      params: {},
      total: 0,
      studentList: [],
      studenForm: {
        orgId: '',
        umId: '',
        maxScore: null,
        minScore: null
      },
      queryForm: {
        size: 20,
        page: 1
      },
      orgOptions: [],
      studentListTabHeader: [
        {
          label: 'UM号',
          prop: 'umId',
          width: '120'
        },
        {
          label: '姓名',
          prop: 'empName',
          width: '150'
        },
        {
          label: '部门',
          prop: 'blgOrgName',
          width: '250'
        },
        {
          label: '得分',
          prop: 'score',
          width: '150',
          sortable: true
        },
        {
          label: '考试状态',
          prop: 'examStatus',
          width: '150'
        },
        {
          label: '完成时间',
          prop: 'endTime',
          width: '150',
          sortable: true
        }
      ]
    }
  },
  activated() {
    const { params } = this.$route
    this.params = useCacheParams({ ...params }, this)
    if (this.params.examId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.getOptionLists()
      this.selectUserExamPage()
    },
    getOptionLists() {
      getOrg().then((res) => {
        console.log('getOptionLists', res)
        this.orgOptions = [...res]
      })
    },
    selectUserExamPage(tip = 'Y') {
      const { params, queryForm, studenForm } = this
      const { examId } = params
      let { maxScore, minScore } = studenForm
      if (maxScore && !isNaN(+maxScore)) {
        maxScore = +maxScore
      }
      if (minScore && !isNaN(+minScore)) {
        minScore = +minScore
      }
      this.$axios
        .post(
          '/fn/privatewealth/exam/selectUserExamPage',
          {
            data: {
              examId: +examId,
              ...queryForm,
              ...studenForm,
              tip,
              maxScore: !isNaN(maxScore) ? maxScore : null,
              minScore: !isNaN(minScore) ? minScore : null
            }
          },
          { ...jsonHeaders, responseType: tip === 'Y' ? '' : 'blob' }
        )
        .then((res) => {
          console.log('selectUserExamPage --> success', res.data)
          // 查询
          if (tip === 'Y') {
            this.selectTable(res)
          } else {
            // 导出
            handleBlob(res)
          }
        })
        .catch((err) => {
          console.log('selectUserExamPage --> err', err)
        })
    },
    selectTable(res) {
      const { code, data } = res.data
      if (code === 0) {
        this.studentList = [...data.list]
        this.total = data.total
      }
    },
    toSearch() {
      this.queryForm.page = 1
      this.selectUserExamPage()
    },
    toReset() {
      this.$refs['studentSearchForm'].resetFields()
      this.studenForm.maxScore = null
      this.studenForm.minScore = null
      this.selectUserExamPage()
    },
    deportExcel() {
      this.selectUserExamPage('N')
    },
    exportExamRecordDetail(row) {
      const { examRecordId } = row
      this.$axios
        .post(
          '/fn/privatewealth/exam/exportExamRecordDetail',
          { examRecordId },
          {
            ...jsonHeaders,
            responseType: 'blob'
          }
        )
        .then((res) => {
          handleBlob(res)
          this.$message.success('下载成功')
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    sizeChange(event) {
      console.log('sizeChange', event)
      this.queryForm.size = event.pageSize
      this.selectUserExamPage()
    },
    currentChange(event) {
      console.log('currentChange', event)
      this.queryForm.page = event.pageNum
      this.selectUserExamPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  & .el-select {
    width: 100%;
  }
}
</style>
