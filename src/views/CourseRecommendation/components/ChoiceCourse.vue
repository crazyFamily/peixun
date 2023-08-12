<template>
  <div class="course-recommendation__choice-topic">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="课程名称">
          <el-input v-model="queryForm.courseName" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="课程关键字">
          <el-input v-model="queryForm.keyword" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="授课讲师姓名">
          <el-input v-model="queryForm.teacherUm" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="课程系列">
          <el-cascader
            clearable
            class="w-200"
            v-model="queryForm.courseClassify"
            :options="courseClassifyOptions"
            :props="{ value: 'tagId', label: 'tagName' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="课程标签" label-width="70px">
          <el-cascader
            clearable
            class="w-200 h-30 max-120 mt1"
            @expand-change="handleCascader"
            @visible-change="handleCascader"
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
        <el-form-item>
          <gc-select
            label="课程难易程度"
            v-model="queryForm.difficultyLevel"
            :options="difficultyLevelOptions"
          ></gc-select>
        </el-form-item>
        <el-form-item>
          <el-form-item
            label="上架时间"
            class="search-card__date mr10"
            v-if="!hideTime"
          >
            <el-date-picker
              v-model="queryForm.dateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date" v-if="!hideTime">
            <el-date-picker
              v-model="queryForm.dateEnd"
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
    <div class="mt10 bgf">
      <div class="table-box">
        <p>
          已选课程：<span class="themeColor">{{ selectedCourse }}</span>
        </p>
        <gc-table
          class="general__table mt20"
          ref="tableRef"
          :list="list"
          row-key="courseId"
          :tableList="tableList"
          @selection-change="selectionChange"
        >
          <el-table-column label="是否包含练习" min-width="126">
            <template slot-scope="scope">
              <span class="active underline" v-if="scope.row.isContailTrain"
                >查看练习</span
              >
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="上架时间" min-width="162">
            <template slot-scope="scope">
              {{ scope.row.upTime | filterTime }}
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
      </div>

      <!-- 底部按钮 -->
      <div class="footer-box dfc mt40">
        <el-button class="button-w80-h30" @click="cancel">取消</el-button>
        <el-button
          :class="confirmClass"
          type="primary"
          @click="acknowledgement"
          >{{ confirmText }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  commonFilter,
  currentChange,
  getCurriculumTree,
  addAllowKeepAlive
} from '@/util/utils'
import $ from 'jquery'
import { handlePickerOptions } from '@/mixins/component'
import TemplateImport from './TemplateImport.vue'
export default {
  name: 'CRChoiceTopic',
  mixins: TemplateImport[handlePickerOptions],
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
    selected: null
  },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        courseName: '',
        keyword: '',
        teacherUm: '',
        courseClassify: [],
        courseTagIds: [],
        courdifficultyLevelseLevel: '',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: '',
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      total: 0,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {},
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
          label: '课程名称',
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
                      row.courseName
                    )
                  : h('span', { class: 'ellipsis' }, row.courseName)
              }
            }
          }
        },
        {
          label: '课程系列',
          prop: 'courseClassifyName',
          width: '134'
        },
        {
          label: '课程关键字',
          prop: 'keyword',
          width: '142'
        },
        {
          label: '课程标签',
          prop: 'courseTagName',
          width: '132',
          'show-overflow-tooltip': true
        },
        {
          label: '授课讲师',
          prop: 'teacherName',
          width: '132'
        },
        {
          label: '课程难易程度',
          prop: 'difficultyLevel',
          width: '128'
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
      selectedList: []
    }
  },
  methods: {
    // 处理表单数据
    handleData() {
      const data = CopyObj(this.queryForm)
      data.courseClassify = data.courseClassify.slice(-1)[0] || ''
      data.courseTagIds = data.courseTagIds.map((v) =>
        Array.isArray(v) ? v.slice(-1)[0] : v
      )
      data.upStartTime = data.dateStart
      data.upEndTime = data.dateEnd
      Reflect.deleteProperty(data, 'dateStart')
      Reflect.deleteProperty(data, 'dateEnd')
      return data
    },
    query() {
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
      this.$axios
        .post('/fn/privatewealth/project/choiceCourse', { data }, jsonHeaders)
        .then((res) => {
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
      getCurriculumTree(
        2,
        this.$store.state.userInfo.blgStripLine,
        1,
        '/fn/course/tag/selectCourseTagsForTk'
      ).then((data) => {
        this.tagOptions = data
      })
    },
    selectionChange(selection) {
      console.log(selection)
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
      this.$emit('acknowledgement', this.selectedList, 1)
    },
    // 取消级联选择框第一级的选择框
    handleCascader(arr) {
      // if (typeof arr === false) return
      if (!arr) return
      if (Array.isArray(arr) && arr.length > 1) return
      this.$nextTick(() => {
        $('.cascader-no-first').each((i, e) => {
          $(e)
            .find('.el-cascader-menu')
            .each((i, e) => {
              if (i < 2) {
                $(e).find('.el-checkbox').css({
                  display: 'none'
                })
              }
            })
        })
      })
    },
    // 跳转到预览界面
    preview(row) {
      const { courseId } = row
      const data = { courseId }
      this.$axios
        .post(
          '/fn/privatewealth/course/searchCourseByCourseId',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data: params } = res.data
          if (code === 0) {
            addAllowKeepAlive('/CRPreviewCourse')
            this.$router.push({
              name: '课程详情',
              params
            })
          }
        })
    }
  },
  mounted() {
    getCurriculumTree(
      1,
      this.$store.state.userInfo.blgStripLine,
      1,
      '/fn/course/tag/selectCourseTagsForTk'
    ).then((data) => {
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
