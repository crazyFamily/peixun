<template>
  <div class="course-recommendation__new-column">
    <gc-steps
      :active="active"
      :list="stepList"
      width="352px"
      total-width="900px"
    ></gc-steps>
    <div class="columnInfo" v-show="active === 0">
      <el-form
        label-width="60px"
        :model="columnInfoForm"
        :rules="columnInfoRules"
        class="item-mb30 dr-label-ws"
      >
        <el-form-item label="栏目名称">
          <el-input
            maxlength="20"
            show-word-limit
            placeholder="限制20个字"
            v-model="columnInfoForm.layoutName"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级栏目">
          <gc-select
            disabled
            class="w-full p0"
            v-model="columnInfoForm.prnLayoutId"
            :options="prnLayoutIdOptions"
          ></gc-select>
        </el-form-item>
        <el-form-item label="栏目是否展示">
          <gc-select
            w1
            class="p0"
            :options="isShowOptions"
            v-model="columnInfoForm.isShow"
          ></gc-select>
        </el-form-item>
        <el-form-item label="栏目介绍">
          <el-input
            maxlength="30"
            show-word-limit
            placeholder="限制30个字"
            v-model="columnInfoForm.introduce"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="curriculm-management" v-show="active === 1">
      <!-- 我的必修（每月主打必修） -->
      <template v-if="this.layoutTag.indexOf(columnInfo.layoutTag) === -1">
        <template>
            <h2 class="s-h2">必修课程</h2>
            <div class="menu-right icons mt8">
            <span
              class="icons__add"
              @click="changeActive(1, independentTableListBack)"
            >
              <i class="icons__add__icon"></i>
              新增课程</span
            >
            <span class="icons__del" @click="handleDel">
              <i class="icons__del__icon"></i>
              删除</span
            >
          </div>
          <gc-table
            ref="independentRef"
            :list="independentList"
            :tableList="independentTableList"
            class="general__table mb20 table-left"
          >
            <el-table-column label="操作" min-width="78px" class-name="td-pr0">
              <template slot-scope="scope">
                <el-tooltip
                  placement="left"
                  :visible-arrow="false"
                  popper-class="bgf shadow-1"
                >
                  <div slot="content" class="tooltip__operation">
                    <span class="active" @click="delColumn(scope.row)"
                      >移出栏目</span
                    >
                  </div>
                  <el-button class="button-48-24">操作</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </gc-table>

          <gc-pagination
            :total="independentForm.total"
            :page-sizes="[5]"
            :page-size="independentForm.pageSize"
            :current-page="independentForm.currPage"
            @sizeChange="sizeChange($event, independentForm, (_) => _)"
            @currentChange="currentChange($event, independentForm, (_) => _)"
            class="between"
          />
        </template>
        <template>
          <h2 class="s-h2">必修直播</h2>
            <div class="menu-right icons mt8">
              <span
                class="icons__add"
                @click="changeActive(3, liveIndependentTableListBack)"
              >
                <i class="icons__add__icon"></i>
                新增直播</span
              >
              <span class="icons__del" @click="handleDelLive">
                <i class="icons__del__icon"></i>
                删除</span
              >
          </div>
          <gc-table
            ref="independentLiveRef"
            :list="independentLive"
            :tableList="liveIndependentTableList"
            class="general__table mb20 table-left"
          >
            <el-table-column label="操作" min-width="78px" class-name="td-pr0">
              <template slot-scope="scope">
                <el-tooltip
                  placement="left"
                  :visible-arrow="false"
                  popper-class="bgf shadow-1"
                >
                  <div slot="content" class="tooltip__operation">
                    <span class="active" @click="delColumnLive(scope.row)"
                      >移出栏目</span
                    >
                  </div>
                  <el-button class="button-48-24">操作</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </gc-table>

          <gc-pagination
            :total="liveIndependentForm.total"
            :page-sizes="[5]"
            :page-size="liveIndependentForm.pageSize"
            :current-page="liveIndependentForm.currPage"
            @sizeChange="sizeChange($event, liveIndependentForm, (_) => _)"
            @currentChange="currentChange($event, liveIndependentForm, (_) => _)"
            class="between"
          />
        </template>
      </template>
      <template v-else>
        <el-tabs v-model="activeName">
          <el-tab-pane label="课程" name="course">
            <div class="menu-right icons mt8">
              <span
                class="icons__add"
                @click="changeActive(1, independentTableListBack)"
              >
                <i class="icons__add__icon"></i>
                新增课程</span
              >
              <span class="icons__del" @click="handleDel">
                <i class="icons__del__icon"></i>
                删除</span
              >
            </div>
            <gc-table
              ref="independentRef"
              :list="independentList"
              :tableList="independentTableList"
              class="general__table mb20 table-left"
            >
              <el-table-column
                label="操作"
                min-width="78px"
                class-name="td-pr0"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    placement="left"
                    :visible-arrow="false"
                    popper-class="bgf shadow-1"
                  >
                    <div slot="content" class="tooltip__operation">
                      <span class="active" @click="delColumn(scope.row)"
                        >移出栏目</span
                      >
                    </div>
                    <el-button class="button-48-24">操作</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </gc-table>

            <gc-pagination
              :total="independentForm.total"
              :page-sizes="[10, 20]"
              :page-size="independentForm.pageSize"
              :current-page="independentForm.currPage"
              @sizeChange="sizeChange($event, independentForm, (_) => _)"
              @currentChange="currentChange($event, independentForm, (_) => _)"
              class="between"
            />
          </el-tab-pane>
          <el-tab-pane label="课程包" name="courseBag">
            <div class="menu-right icons mt8">
              <span
                class="icons__add"
                @click="
                  changeActive(
                    2,
                    courseBagTableListBack,
                    columnInfoForm.layoutId
                  )
                "
              >
                <i class="icons__add__icon"></i>
                新增课程包</span
              >
              <span class="icons__del" @click="handleDelBag">
                <i class="icons__del__icon"></i>
                删除</span
              >
            </div>
            <gc-table
              ref="courseBagRef"
              :list="courseBagList"
              :tableList="courseBagTableList"
              class="general__table mb20 table-left"
            >
              <el-table-column
                label="操作"
                min-width="78px"
                class-name="td-pr0"
              >
                <template slot-scope="scope">
                  <el-tooltip
                    placement="left"
                    :visible-arrow="false"
                    popper-class="bgf shadow-1"
                  >
                    <div slot="content" class="tooltip__operation">
                      <span class="active" @click="delColumnBag(scope.row)"
                        >移出栏目</span
                      >
                    </div>
                    <el-button class="button-48-24">操作</el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </gc-table>

            <gc-pagination
              :total="courseBagForm.total"
              :page-sizes="[10, 20]"
              :page-size="courseBagForm.pageSize"
              :current-page="courseBagForm.currPage"
              @sizeChange="sizeChange($event, courseBagForm, (_) => _)"
              @currentChange="currentChange($event, courseBagForm, (_) => _)"
              class="between"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc mt60">
      <el-button class="button-w80-h30" @click="cancel">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="chnageSubmit"
        >保存</el-button
      >
      <el-button class="button-w80-h30" v-if="active === 1" @click="active--"
        >上一步</el-button
      >
      <el-button class="button-w80-h30" v-if="active === 0" @click="active++"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  merge,
  upMove,
  downMove,
  throttle,
  sizeChange,
  jsonHeaders,
  localPaging,
  currentChange,
  addAllowKeepAlive
} from '@/util/utils'
import gcSteps from '../../components/gc-steps'
import gcUpload from '@/components/upload'
import ChoiceCourse from '../../components/ChoiceCourse'
import { CopyObj } from '../../../../util/utils'
export default {
  name: 'CRNewExclusiveRecommendation',
  components: {
    gcSteps,
    gcUpload,
    ChoiceCourse
  },
  props: ['columnInfo'],
  inject: ['changeActive', 'refreshTree'],
  data() {
    return {
      activeName: 'course',
      // 显示哪个页面
      showPage: 0,
      // 进度条索引
      active: 0,
      // 进度条数据
      stepList: ['栏目信息', '栏目课程管理'],
      // 栏目信息表单
      columnInfoForm: {
        layoutName: '',
        prnLayoutId: 1,
        isShow: '',
        introduce: '',
        layoutId: null,
        rootType: 1,
        lowerType: 'course'
      },
      // 栏目信息表单 验证规则
      columnInfoRules: {},
      // 上级栏目 下拉选项
      prnLayoutIdOptions: [
        {
          label: '专属推荐',
          value: 1
        }
      ],
      // 栏目是否展示 下拉选项
      isShowOptions: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      // 自主选课 查询 分页 form
      independentForm: {
        total: 0,
        currPage: 1,
        pageSize: 5
      },
      // 自主选直播 查询 分页 form
      liveIndependentForm: {
        total: 0,
        currPage: 1,
        pageSize: 5
      },
      // 自主选课 表格字段数组
      independentList: [
        {
          type: 'selection'
        },
        {
          label: '课程名称',
          prop: 'courseName',
          width: '166'
        },
        // {
        //   type: 'component',
        //   width: '166',
        //   label: '课程名称',
        //   ctx: (row) => {
        //     const that = this
        //     return {
        //       render(h) {
        //         return h(
        //           'span',
        //           {
        //             class: 'active underline ellipsis',
        //             on: {
        //               click() {
        //                 that.preview(row)
        //               }
        //             }
        //           },
        //           row.courseName
        //         )
        //       }
        //     }
        //   }
        // },
        {
          label: '课程角标',
          prop: 'cornerMark',
          width: '120'
        },
        {
          label: '课程标签',
          prop: 'courseTagName',
          width: '188'
        },
        {
          label: '授课讲师',
          prop: 'teacherName',
          width: '140'
        },
        {
          label: '课程难易程度',
          prop: 'difficultyLevel',
          width: '120'
        }
        // {
        //     label: "是否置顶",
        //     prop: "isTopName",
        //     width: "84"
        // }
      ],
      // 自主选直播 表格字段数组
      independentLive: [
        {
          type: 'selection'
        },
        {
          label: '直播名称',
          prop: 'liveName',
          width: '120'
        },
        {
          label: '直播标签',
          prop: 'liveTagName',
          width: '188'
        },
        {
          label: '授课讲师',
          prop: 'teacherName',
          width: '140'
        }
        // {
        //     label: "是否置顶",
        //     prop: "isTopName",
        //     width: "84"
        // }
      ],
      // 自主选课 表格数据数组
      independentTableListBack: [],
      // 自主直播 表格数据数组
      liveIndependentTableListBack: [],
      // 课程包 查询 分页 form
      courseBagForm: {
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      // 课程包 表格字段数组
      courseBagList: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          label: '序号',
          width: '64',
          index: (index) =>
            (this.courseBagForm.currPage - 1) * this.courseBagForm.pageSize +
            index +
            1
        },
        {
          type: 'component',
          width: '166',
          label: '课程包名称',
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline ellipsis',
                    on: {
                      click() {
                        that.previewBag(row)
                      }
                    }
                  },
                  row.projectName
                )
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
      // 课程包 表格数据数组
      courseBagTableListBack: [],
      // 分页工具函数
      sizeChange,
      currentChange,
      layoutTag: ['STAGE', 'ABILITY', 'MANAGE']
    }
  },
  methods: {
    // 获取自主选课数据
    getIndependentList() {},
    serveDataToWebData(data) {
      console.log(432, data)
      data.prnLayoutId = 1
      merge(this.columnInfoForm, data)
      this.independentTableListBack = data.addCourses || []
      this.liveIndependentTableListBack = data.addLives || []
      this.courseBagTableListBack = data.addProjects || []
      console.log(504, 'liveIndependentTableListBack', this.liveIndependentTableListBack)
    },
    webDataToServeData() {
      const data = CopyObj(this.columnInfoForm)
      data.prnLayoutId = [1]
      const addCourses = this.independentTableListBack.map((v) => {
        const { courseId, isTop, cornerMark, createdBy, createdDate } = v
        return { courseId, isTop, cornerMark, createdBy, createdDate }
      })
      const addProjects = this.courseBagTableListBack.map((v, i) => {
        const { projectId, projectName } = v
        return { projectId, projectName, pageSort: i }
      })
      const addLives = this.liveIndependentTableListBack.map((v) => {
        const { liveId } = v
        return { liveId }
      })
      console.log(535, 'addLives', addLives)
      data.addCourses = addCourses
      data.addProjects = addProjects
      data.addLives = addLives
      return data
    },
    // 处理空数组
    handleVoidArr(arr) {
      arr.forEach((v) => {
        if (!v.childs?.length) {
          Reflect.deleteProperty(v, 'childs')
        } else if (v.childs) {
          this.handleVoidArr(v.childs)
        }
      })
    },
    // 确认添加课程事件
    acknowledgement(selectedList, num) {
      console.log(547, 'NewExclusiveRecommendation', selectedList, num)
      let ids
      if (num === 1) {
        ids = this.independentTableListBack.map((v) => v.courseId + '')
        selectedList.forEach((v) => {
          if (!ids.includes(v.courseId + '')) {
            this.independentTableListBack.push(v)
          }
        })
      } else if (num === 2) {
        ids = this.courseBagTableListBack.map((v) => v.projectId + '')
        selectedList.forEach((v) => {
          if (!ids.includes(v.projectId + '')) {
            this.courseBagTableListBack.unshift(v)
          }
        })
      } else if (num === 3) {
        ids = this.liveIndependentTableListBack.map((v) => v.liveId + '')
        selectedList.forEach((v) => {
          if (!ids.includes(v.liveId + '')) {
            this.liveIndependentTableListBack.unshift(v)
          }
        })
        console.log(571, this.liveIndependentTableListBack)
      }
    },
    // 修改栏目信息
    chnageSubmit() {
      const data = this.webDataToServeData()
      return this.$axios
        .post(
          '/fn/privatewealth/layout/updateLayoutNodeInfo',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('修改成功')
            this.refreshTree()
          }
        })
    },
    cancel() {
      this.$router.push('/CRSuperTubeCenter')
    },
    // 课程移除栏目
    delColumn(row) {
      const index = this.independentTableListBack.findIndex(
        (v) => v.courseId === row.courseId
      )
      if (index > -1) {
        this.independentTableListBack.splice(index, 1)
      }
    },
    // 直播移除栏位
    delColumnLive(row) {
      const index = this.liveIndependentTableListBack.findIndex(
        (v) => v.liveId === row.liveId
      )
      if (index > -1) {
        this.liveIndependentTableListBack.splice(index, 1)
      }
    },
    // 课程包移除栏目
    delColumnBag(row) {
      const index = this.courseBagTableListBack.findIndex(
        (v) => v.projectId === row.projectId
      )
      if (index > -1) {
        this.courseBagTableListBack.splice(index, 1)
      }
    },
    // 移除多个课程
    handleDel() {
      const selection = this.$refs.independentRef.$children[0].selection
      this.independentTableListBack = this.independentTableListBack.filter(
        (v) => !selection.includes(v)
      )
    },
    // 移除多个直播
    handleDelLive() {
      const selection = this.$refs.independentLiveRef.$children[0].selection
      console.log(630, selection)
      this.liveIndependentTableListBack = this.liveIndependentTableListBack.filter(
        (v) => !selection.includes(v)
      )
    },
    // 移除多个课程包
    handleDelBag() {
      const selection = this.$refs.courseBagRef.$children[0].selection
      this.courseBagTableListBack = this.courseBagTableListBack.filter(
        (v) => !selection.includes(v)
      )
    },
    // 跳转到课程预览界面
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
    },
    // 跳转到课程包预览界面
    previewBag(row) {
      const { projectId } = row
      const data = { projectId: projectId + '' }
      this.$axios
        .post('/fn/privatewealth/project/detailToProject', data, jsonHeaders)
        .then((res) => {
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
  watch: {
    columnInfo: {
      immediate: true,
      handler(data) {
        if (!data) return
        console.log(578, data)
        this.serveDataToWebData(data)
        this.active = 0
      }
    }
  },
  computed: {
    independentTableList() {
      const list = localPaging(
        this.independentTableListBack,
        this.independentForm
      )
      console.log(591, list, this.independentTableListBack)
      return list
    },
    liveIndependentTableList() {
      const list = localPaging(
        this.liveIndependentTableListBack,
        this.liveIndependentForm
      )
      console.log(6667, list, this.liveIndependentTableListBack)
      return list
    },
    courseBagTableList() {
      const list = localPaging(this.courseBagTableListBack, this.courseBagForm)
      return list
    }
  },
  created() {
    this.chnageSubmit = throttle(this.chnageSubmit)
  }
}
</script>

<style lang="scss" scoped>
.course-recommendation__new-column {
  background-color: #fff;
  .columnInfo {
    margin-top: 60px;
    .el-form {
      width: 660px;
      margin: auto;
    }
    .items {
      margin-top: 26px;
    }
  }
  .curriculm-management {
    margin-top: 60px;
    padding: 0 20px 0 16px;
  }
}
.s-h2 {
  font-size: 16px;
  margin: 30px 0 10px 0;
}
</style>