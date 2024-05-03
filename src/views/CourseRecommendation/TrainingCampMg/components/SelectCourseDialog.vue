<template>
  <div class="course_container course">
    <el-card class="box-card">
      <el-form :model="queryForm" ref="queryForm" class="form-container">
        <el-form-item label="课程名称：" prop="courseName">
          <el-input v-model="queryForm.courseName" placeholder="请输入课程名称"> </el-input>
        </el-form-item>
        <el-form-item label="课程关键字：" prop="keyword">
          <el-input placeholder="请输入课程关键字" v-model="queryForm.keyword"></el-input>
        </el-form-item>
        <el-form-item label="授课讲师：" prop="teacherUm">
          <el-input placeholder="请输入讲师姓名" v-model="queryForm.teacherUm"></el-input>
        </el-form-item>
        <el-form-item label="课程系列：" prop="courseClassify">
          <el-cascader
            clearable
            v-model="queryForm.courseClassify"
            :options="courseClassifyOptions"
            :props="{ value: 'tagId', label: 'tagName' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="课程标签：" prop="courseTagIds">
          <el-cascader
            clearable
            @visible-change="handleCascader"
            class="max-120"
            popper-class="cascader-no-first"
            v-model="queryForm.courseTagIds"
            :options="tagOptions"
            collapse-tags
            :props="{
              value: 'tagId',
              label: 'tagName',
              multiple: true,
              checkStrictly: true
            }"
          ></el-cascader>
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
import { getCurriculumTree, getTagDict, jsonHeaders, CopyObj } from '@/util/utils'
export default {
  name: 'TrainingSelectCourse',
  data() {
    return {
      queryForm: {
        blgOrg: '',
        courseName: '',
        courseClassify: [],
        source: '',
        courseTagIds: [],
        teacherUm: '',
        keyword: '',
        isFinanceCompliance: '',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: null,
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: null,
        difficultyLevel: '',
        coursewareType: '',
        status: '02001',
        eoaStatus: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 5,
        total: 0,
        upBy: '', // 上架人
        downBy: '' // 下架人
      },
      tableColumns: [
        { type: 'index', label: '序号' },
        { label: '课程名称', prop: 'courseName' },
        { label: '课程系列', prop: 'courseClassifyName' },
        {
          label: '课程标签',
          width: '166',
          prop: '',
          ctx: (row) =>
            row.courseTag
              ?.split(',')
              .map((v) => this.tagDict[v])
              .filter((_) => _)
              .join('、')
        },
        { label: '授课讲师', prop: 'teacherName' }
      ],
      tableList: [],

      // 课程系列 options
      courseClassifyOptions: [],
      // 选择标签的下拉框数据
      tagOptions: [],
      // 标签字典
      tagDict: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getCourseSeries()
      this.getAllTag()
      getTagDict(this)
      this.getList()
    },
    // 获取课程系列
    getCourseSeries() {
      getCurriculumTree(1, this.$store.state.userInfo.blgStripLine, 1, '/fn/course/tag/selectCourseTagsForTk').then((data) => {
        this.courseClassifyOptions = data
      })
    },
    // 获取使用过的标签
    getAllTag() {
      getCurriculumTree(2, this.$store.state.userInfo.blgStripLine, 1, '/fn/course/tag/selectCourseTagsForTk').then((data) => {
        this.tagOptions = data
      })
    },
    // 取消级联选择框第一级的选择框
    handleCascader() {
      $('.cascader-no-first .el-cascader-menu:eq(0) .el-checkbox').css({
        display: 'none'
      })
    },
    getList() {
      const data = this.handleData()
      this.$axios.post('/fn/privatewealth/course/listTkCourses', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { total, list } = data
          this.queryForm.total = total
          this.tableList = list
        }
      })
    },
    // 处理表单数据
    handleData() {
      const data = CopyObj(this.queryForm)
      data.courseClassify = data.courseClassify.slice(-1)[0] || ''
      data.courseTagIds = data.courseTagIds.map((v) => (Array.isArray(v) ? v.slice(-1)[0] : v))
      data.upTime = data.dateStart
      data.planDownTime = data.dateEnd
      Reflect.deleteProperty(data, 'dateStart')
      Reflect.deleteProperty(data, 'dateEnd')
      return data
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
      this.$emit('confirm', 'course', row)
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
        grid-column-start: 3;
        grid-column-end: 4;
        text-align: right;
      }
    }
  }
}
</style>