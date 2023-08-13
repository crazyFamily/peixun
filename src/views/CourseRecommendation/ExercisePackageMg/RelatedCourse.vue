<template>
  <div class="course-recommendation__project-management">
    <gc-table
      drop
      class="general__table mt20 course-table cus-table-sty"
      :list="lists"
      :tableList="tableList"
    >
    </gc-table>
  </div>
</template>

<script>
import {
  jsonHeaders,
  closeCurrPage
} from '@/util/utils'
export default {
  name: 'CRRElatedCourse',
  data() {
    return {
      tableList: [],
      lists: [
        {
          type: 'index',
          label: '序号',
          width: '64',
          'class-name': 'table-index'
        },
        {
          label: '课程id',
          prop: 'courseId'
        },
        {
          label: '课程名称',
          prop: 'courseName'
        },
        {
          label: '课程标签',
          prop: 'courseTag'
        },
        {
          label: '关键字',
          prop: 'keyword'
        },
        {
          label: '上架时间',
          prop: 'realUpTime'
        }
      ],

    }
  },
  methods: {
    queryLists() {
      let data = {
        examId: this.examId
      }
      this.$axios
      .post(
        '/fn/privatewealth/exam/listCourseByExamId',
        { ...data },
        jsonHeaders
      )
      .then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.tableList = data || []
        }
      })
    }
  },
  mounted() {
    let { id } = this.$route.params
    if (id) {
      this.examId = id
    }
    this.queryLists()
    // console.log(this.examId, 888)
  },
  activated() {
    console.log(82, this.$route.params)
  },
}
</script>
