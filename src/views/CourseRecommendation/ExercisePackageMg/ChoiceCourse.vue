<template>
  <div class="course-recommendation__curriculum-management">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="课程名称">
          <el-input
            class="w200"
            placeholder="请输入课程名称"
            v-model="queryForm.courseName"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程关键字">
          <el-input
            placeholder="请输入课程关键字"
            v-model="queryForm.keyword"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程标签">
          <el-cascader
            clearable
            @visible-change="handleCascader"
            class="w-200 max-120 mt1"
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
        <el-form-item label="授课讲师">
          <el-input
            class="w200"
            placeholder="请输入讲师姓名"
            v-model="queryForm.teacherUm"
          ></el-input>
        </el-form-item>
        <el-form-item class="mr20">
          <el-form-item label="上架时间" class="search-card__date mr10">
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
          <el-form-item label="至" class="search-card__date r0">
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

    <el-card class="mt10">
      <p style="margin:10px 0">
          已勾选{{currentSelectList.length}}门课程
      </p>
      <!-- 数据表格 card -->
        <gc-table
          class="general__table table-left"
          ref="tableRef"
          :list="list"
          row-key="courseId"
          :tableList="tableList"
           @selection-change="selectionChange"
        >
          <el-table-column min-width="122" prop="difficultyLevel">
            <template slot="header">
              <gc-tablecolumnfilters
                label="课程难易程度"
                className="table__screen__icon"
                :list="difficultEasyOptions"
                confirmText="确定"
                popperClass="circular"
                @filter="
                  commonFilter(
                    $event,
                    queryForm,
                    'difficultyLevel',
                    getList,
                    'filter'
                  )
                "
                @reset="
                  commonFilter($event, queryForm, 'difficultyLevel', getList)
                "
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>
          <el-table-column min-width="100" prop="coursewareType">
            <template slot="header">
              <gc-tablecolumnfilters
                label="课程类型"
                className="table__screen__icon"
                :list="courseTypeOptions"
                confirmText="确定"
                popperClass="circular"
                @filter="
                  commonFilter(
                    $event,
                    queryForm,
                    'coursewareType',
                    getList,
                    'filter'
                  )
                "
                @reset="
                  commonFilter($event, queryForm, 'coursewareType', getList)
                "
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>
          <el-table-column
            label="授课讲师"
            min-width="90"
            prop="teacherName"
            show-overflow-tooltip
          ></el-table-column>
          
          <el-table-column label="实际上架时间" min-width="104">
            <template slot-scope="scope">
              <!-- {{ scope.row.realUpTime | filterTime }} -->
              {{ scope.row.realUpTime }}
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
    <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="cancle">取消</el-button>
        <el-button @click="submit" type="primary">加入综合考试</el-button>
    </div>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  getTagDict,
  sizeChange,
  jsonHeaders,
  commonFilter,
  currentChange,
  getCurriculumTree
} from '@/util/utils'
import $ from 'jquery'
import { getOrg } from '../utils'
import { handlePickerOptions } from '@/mixins/component'
import gcTag from '@/components/chunk/tag'
export default {
  name: 'ChoiceCourse',
  components: { gcTag },
  mixins: [handlePickerOptions],
  props: {
    courseSelList: {
      type: Array
    }
  },
  data() {
    return {
      currentSelectList: [],
      // 查询用的表单
      queryForm: {
        courseName: '',
        courseTagIds: [],
        teacherUm: '',
        keyword: '',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: null,
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: null,
        difficultyLevel: '',
        coursewareType: '',
        status: '',
        eoaStatus: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        upBy: '', // 上架人
        downBy: '' // 下架人
      },
      // 部门下拉选项
      // 课程来源下拉选项
      total: 0,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {},
      // 分页函数
      sizeChange,
      currentChange,
      // 课程系列 options
      // 选择标签的下拉框数据
      tagOptions: [],
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          type: 'selection',
          width: '54',
          'reserve-selection': true
        },
        {
          type: 'component',
          label: '课程名称',
          width: '200',
          prop: '',
          'show-overflow-tooltip': false,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline',
                    on: {
                      click() {
                        that.preview(row)
                      }
                    }
                  },
                  row.courseName
                )
              }
            }
          }
        },
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
        }
      ],
      tableList: [],
      // 难易程度选项
      difficultEasyOptions: [
        {
          label: '高阶',
          value: '3'
        },
        {
          label: '中阶',
          value: '2'
        },
        {
          label: '低阶',
          value: '1'
        }
      ],
      // 课程类型 选项
      courseTypeOptions: [
        {
          label: '音频',
          value: 'yp'
        },
        {
          label: '视频',
          value: 'sp'
        },
        {
          label: '图文',
          value: 'tw'
        }
      ],
      // 课程状态 选项
      curriculumStatusOptions: [
        {
          label: '未上架',
          value: '02000'
        },
        {
          label: '已上架',
          value: '02001'
        },
        {
          label: '已下架',
          value: '02002'
        }
      ],
      tagDict: {},
    }
  },
  watch: {
    courseSelList: {
      handler(n) {
        if (n && n.length) {
          if (this.courseSelList && this.courseSelList.length) {
              this.$refs.tableRef.$children[0].clearSelection()
              this.$nextTick(() => {
                this.courseSelList.forEach(item => {
                  this.$refs.tableRef.$children[0].toggleRowSelection(item, true)
                })
              })
              // this.tableList.forEach(item => {
              //   let _currSel = this.courseSelList.find(o => o.courseId === item.courseId)
              //   if (_currSel) {
              //     this.$nextTick(() => {
              //       this.$refs.tableRef.$children[0].toggleRowSelection(item, true)
              //     })
              //   }
              // })
            }
        }
      }
    }
  },
  methods: {
    cancle() {
      this.$emit('cancleChoice')
    },
    submit() {
       this.$emit('acknowledgement', this.currentSelectList)
    },
    selectionChange(selection) {
      this.currentSelectList = selection
    },
    // 处理表单数据
    handleData() {
      const data = CopyObj(this.queryForm)
      // data.courseClassify = data.courseClassify.slice(-1)[0] || '' 
      data.courseTagIds = data.courseTagIds.map((v) =>
        Array.isArray(v) ? v.slice(-1)[0] : v
      )
      data.upTime = data.dateStart
      data.planDownTime = data.dateEnd
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
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10
      })
      this.queryForm.dateStart = null
      this.queryForm.dateEnd = null
      this.getList()
    },
    getList() {
      const data = this.handleData()
      data.status = '02001'
      this.$axios
        .post('/fn/privatewealth/course/listTkCourses', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
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
    
    // 取消级联选择框第一级的选择框
    handleCascader() {
      $('.cascader-no-first .el-cascader-menu:eq(0) .el-checkbox').css({
        display: 'none'
      })
    },
  },  
  mounted() {
    this.getAllTag()
    getTagDict(this)
    this.query()
  },
}
</script>

<style lang="scss"></style>
