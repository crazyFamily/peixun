<template>
  <div class="course-recommendation__choice-topic">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="课程包名称">
          <el-input v-model="queryForm.projectName" class="w200"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 数据表格 card -->
    <div class="mt10 bgf">
      <div class="table-box">
        <p>
          已选课程包：<span class="themeColor">{{ selectedCourse }}</span>
        </p>
        <gc-table
          class="general__table mt20"
          ref="tableRef"
          :list="list"
          row-key="projectId"
          :tableList="tableList"
          @selection-change="selectionChange"
        >
          <el-table-column label="关联课程" prop="linkCourse"> </el-table-column>
          <el-table-column label="综合考试题数" prop="examinationNum"> </el-table-column>
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
      </div>

      <!-- 底部按钮 -->
      <div class="footer-box dfc mt40">
        <el-button class="button-w80-h30" @click="cancel">取消</el-button>
        <el-button :class="confirmClass" type="primary" @click="acknowledgement">{{ confirmText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { CopyObj, resetObj, sizeChange, jsonHeaders, commonFilter, currentChange, getCurriculumTree, addAllowKeepAlive } from '@/util/utils'
import $ from 'jquery'
export default {
  name: 'CRChoiceCourseBag',
  props: {
    hideTime: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '加入课程练习'
    },
    confirmClass: {
      type: String,
      default: 'button-w90-h30'
    },
    type: null,
    canPrview: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        projectName: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      list: [
        {
          type: 'selection',
          'reserve-selection': true
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          type: 'component',
          label: '课程包名称',
          width: '146',
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return that.canPrview
                  ? h(
                      'span',
                      {
                        class: 'active underline ellipsis',
                        on: {
                          click() {
                            that.preview(row)
                          }
                        }
                      },
                      row.projectName
                    )
                  : h('span', { class: 'ellipsis' }, row.projectName)
              }
            }
          }
        },
        {
          label: '课程包属主部门',
          prop: 'blgOrgName',
          width: '120'
        },
        {
          label: '课程包负责人',
          prop: 'leaderName',
          width: '188'
        }
      ],
      tableList: [],
      // 课程系列 options
      courseClassifyOptions: [],
      // 选择标签的下拉框数据
      tagOptions: [],
      // 课程难易程度 下拉选项
      difficultyLevelOptions: [
        {
          label: '初阶',
          value: '1'
        },
        {
          label: '中阶',
          value: '2'
        },
        {
          label: '高阶',
          value: '3'
        }
      ],
      // 已选择的课程
      selectedCourse: 0,
      selectedList: [],
      layoutId: ''
    }
  },
  methods: {
    // 处理表单数据
    handleData() {
      const data = CopyObj(this.queryForm)
      data.status = '02000'
      if (this.layoutId) {
        data.layoutId = this.layoutId
      }
      return data
    },
    query(layoutId) {
      if (layoutId && typeof layoutId !== 'object') {
        this.layoutId = layoutId
      }
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
    },
    getList() {
      const data = this.handleData()
      if (this.type) {
        data.type = this.type
      }
      this.$axios.post('/fn/privatewealth/project/listToProject', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { total, list } = data
          list.forEach((v) => {
            v.courseId = parseInt(v.courseId)
          })
          this.total = total
          this.tableList = list
        }
      })
    },
    // 获取使用过的标签
    getAllTag() {
      getCurriculumTree(2, this.$store.state.userInfo.blgStripLine, 1, '/fn/course/tag/selectCourseTagsForTk').then((data) => {
        this.tagOptions = data
      })
    },
    selectionChange(selection) {
      this.selectedCourse = selection.length
      this.selectedList = selection
    },
    clear() {
      this.reset()
      this.tableList = []
      this.$nextTick(() => {
        this.$refs.tableRef.$children[0].clearSelection()
      })
    },
    // 取消
    cancel() {
      this.clear()
      this.$emit('cancel')
    },
    // 确认
    acknowledgement() {
      this.clear()
      this.$emit('acknowledgement', this.selectedList, 2)
    },
    // 跳转到预览界面
    preview(row) {
      const { projectId } = row
      const data = { projectId: projectId + '' }
      this.$axios.post('/fn/privatewealth/project/detailToProject', data, jsonHeaders).then((res) => {
        const { code, data: params } = res.data
        if (code === 0) {
          addAllowKeepAlive('/CRPreviewProject')
          this.$router.push({
            name: '课程包详情',
            params
          })
        }
      })
    }
  },
  mounted() {
    getCurriculumTree(1, this.$store.state.userInfo.blgStripLine, 1, '/fn/course/tag/selectCourseTagsForTk').then((data) => {
      this.courseClassifyOptions = data
    })
    this.getAllTag()
  },
  watch: {
    selected: {
      handler(n) {
        if (n && n.length) {
          this.$refs.tableRef.$children[0].clearSelection()
          this.$nextTick(() => {
            n.forEach((v) => {
              this.$refs.tableRef.$children[0].toggleRowSelection(v, true)
            })
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.course-recommendation__choice-topic {
  .table-box {
    padding: 20px;
  }
}
</style>
