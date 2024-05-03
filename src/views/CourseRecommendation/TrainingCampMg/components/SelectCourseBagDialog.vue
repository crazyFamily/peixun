<template>
  <div class="course_container course">
    <el-card class="box-card">
      <el-form :model="queryForm" ref="queryForm" class="form-container">
        <el-form-item label="课程包名称：" prop="projectName">
          <el-input v-model="queryForm.projectName" placeholder="请输入课程名称"> </el-input>
        </el-form-item>
        <el-form-item label="课程包属主部门" prop="blgOrg">
           <el-cascader
            clearable
            v-model="queryForm.blgOrg"
            :options="orgOptions"
            :props="{ value: 'orgId', label: 'orgName' }"
          ></el-cascader>
          <!-- <gc-select k="orgName" v="orgId" :options="orgOptions" v-model="queryForm.blgOrg"></gc-select> -->
        </el-form-item>
        <el-form-item label="课程包负责人：" prop="leaderUm">
          <el-input v-model="queryForm.leaderUm"></el-input>
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
            <el-button class="button-48-24" @click="addCourse(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import { getOrg } from '../../utils'
import { getCurriculumTree, getTagDict, jsonHeaders, CopyObj } from '@/util/utils'
import { fetchListToProject } from '@/fetch/courseRecommendation'
export default {
  name: 'TrainingSelectCourse',
  data() {
    return {
      // 查询用的表单
      queryForm: {
        // 项目名称
        projectName: '',
        blgOrg: '',
        leaderUm: '',
        courseName: '',
        eoaStatus: '02002',
        status: '02000',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      tableColumns: [
        { type: 'index', label: '序号' },
        { label: '课程包名称', prop: 'projectName' },
        { label: '课程包属主部门', prop: 'blgOrgName' },
        { label: '课程包负责人',prop: 'leaderName'},
        { label: '关联课程', prop: 'linkCourse' },
        { label: '综合考试题数', prop: 'examinationNum' }
      ],
      tableList: [],
      // 部门下拉选项
      orgOptions: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      getOrg().then((res) => {
        this.orgOptions = res
      })
    },
    async getList() {
      const data = this.queryForm
      if (data.blgOrg) {
        data.blgOrg = data.blgOrg.join()
      }
      const { total, list } = await fetchListToProject({ data })
      this.queryForm.total = total
      this.tableList = list
    },
    toSearch() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    toReset() {
      this.$refs['queryForm'].resetFields()
      this.getList()
    },
    addCourse(row) {
      // this.$emit('cancel', 'course', row)
      this.$emit('confirm', 'project', row)
      // console.log('addCourse', row)
    }
  }
}
</script>

<style lang="scss" scoped>
.course_container {
  & .form-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: flex-end;
    & .el-form-item {
      margin-right: 30px;
      margin-bottom: 0;
      & .el-cascader {
        width: 100%;
      }
      &.self-item {
        margin-top: 20px;
        grid-column-start: 3;
        grid-column-end: 4;
        text-align: right;
      }
    }
  }
}
</style>