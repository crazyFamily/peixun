<template>
  <div class="course-recommendation__new-project">
    <div class="gc-main">
      <!-- 进度条 -->
      <gc-steps :active="active" :list="stepList" width="728px"></gc-steps>
      <!-- 内容区域 -->
      <div class="content-box">
        <div class="project-info" v-show="active === 0">
          <el-form label-width="70px" class="item-mb30">
            <el-form-item
              prop="projectName"
              class="ws dr-label"
              label="课程包名称"
            >
              <el-input readonly :value="projectForm.projectName"></el-input>
            </el-form-item>
            <el-form-item
              label="课程包属主部门"
              class="ws dr-label"
              prop="blgOrg"
            >
              <el-input readonly :value="projectForm.blgOrgName"></el-input>
            </el-form-item>
            <el-form-item
              label="课程包负责人"
              class="ws dr-label"
              prop="leaderUm"
            >
              <el-input readonly :value="projectForm.leaderUm"></el-input>
            </el-form-item>
            <!-- <el-form-item label="项目封面" prop="coverList">
                            <gc-upload
                                v-model="projectForm.coverList"
                                :list="projectForm.oldCoverList"
                                disabled
                            ></gc-upload>
                            <p class="tintColor">
                                推荐比例4 ：3，支持
                                jpg、png格式，文件大小不超过200k
                            </p>
                        </el-form-item> -->
            <el-form-item
              label="课程包介绍"
              prop="introduce"
              class="ws dr-label"
            >
              <el-input
                type="textarea"
                resize="none"
                class="h-90"
                readonly
                :value="projectForm.introduce"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="转发/分享"
              class="ws dr-label"
              prop="supportShare"
            >
              <el-radio-group :value="projectForm.supportShare">
                <el-radio label="Y" class="mr60">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 学习截止时间 -->
            <el-form-item label="学习截止时间" class="mt30 mb0">
              <el-radio-group :value="studyDeadline">
                <div class="date-time mb10">
                  <el-radio label="dateTime">指定日期</el-radio>
                  <el-date-picker
                    class="w-196 ml10"
                    :value="studyDateTime"
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    popper-class="date-picker"
                  >
                  </el-date-picker>
                </div>
                <div class="continue-day">
                  <el-radio label="continueDay">完成期限</el-radio>
                  <el-input
                    class="w-196 ml10"
                    placeholder="请输入天数"
                    :value="studyContinueDay"
                  >
                    <template slot="suffix">天</template>
                  </el-input>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <!-- 课程信息 -->
        <div class="course-info" v-show="active === 1">
          <!-- 需求变更：增加按主题分类课程包 -->
          <el-tabs v-model="courseType">
            <el-tab-pane label="无主题选课" name="noTheme"></el-tab-pane>
            <el-tab-pane label="按主题选课" name="theme"></el-tab-pane>
          </el-tabs>
          <div class="no-theme-container" v-show="courseType === 'noTheme'">
            <div class="menu-right icons">
              <span
                class="icons__add"
                @click="
                  showPage = 2
                  $refs.choiceCourse.query()
                "
              >
                <i class="icons__add__icon"></i>
                新增课程</span
              >
            </div>
            <gc-table
              drop
              row-key="courseId"
              ref="courseInfoTableRef"
              class="general__table mt20"
              :list="courseInfoList"
              :tableList="courseInfoTableList"
            >
              <el-table-column label="操作" min-width="120">
                <template slot-scope="scope">
                  <span class="active pdl10">{{
                    courseInfoTableList[scope.$index].isTop === 'Y'
                      ? '已置顶'
                      : '未置顶'
                  }}</span>
                </template>
              </el-table-column>
            </gc-table>
          </div>
          <!-- 按主题选课 -->
          <div class="theme-container" v-show="courseType === 'theme'">
            <section class="theme-tree-warp">
              <aside class="theme-tree-aside">
                <!-- 主题tree -->
                <el-tree
                  ref="themeTreeRef"
                  :data="themeTreeData"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  highlight-current
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  @check="themeCheckHandle">
                  <div class="custom-tree-node" slot-scope="{ data }">
                    <div class="theme-name">{{ data.label }}</div>
                  </div>
                </el-tree>
              </aside>
              <section class="theme-tree-container">
                <div v-if="!themeCheckItem.id" class="empty-tips">请选择末级节点</div>
                <!-- 设置主题 -->
                <template v-else>
                  <div class="subject-name">当前节点：{{ themeCheckItem.label }}</div>
                  <el-card class="theme-info-list">
                    <!-- <div slot="header" class="clearfix">
                      <div class="theme-header-container">
                        <div class="theme-header-info">
                          <span>{{ themeCheckItem.label }}</span>
                        </div>
                      </div>
                    </div> -->
                    <table-pagination
                      drop
                      row-key="courseId"
                      ref="subjectCourseInfoTableRef"
                      class="general__table subject-table"
                      :list="courseInfoList"
                      :tableList="themeCheckItem.courseList"
                      :queryForm="{}"
                      :getList="() => {}"
                      :hide-pagination="true"
                    >
                      <el-table-column slot="courseName" prop="courseName" label="课程名称" show-overflow-tooltip width="150px">
                        <template slot-scope="scope">
                          <span class="active underline ellipsis" @click="preview(scope.row)">{{ scope.row.courseName }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" min-width="120" fixed="right">
                        <template slot-scope="scope">
                          <span>{{
                            themeCheckItem.courseList[scope.$index].isTop === 'Y' ? '已置顶' : '未置顶'
                          }}</span>
                        </template>
                      </el-table-column>
                    </table-pagination>
                  </el-card>
                </template>
              </section>
            </section>
          </div>
        </div>
        <div class="examination" v-show="active === 3">
          <el-form
            :model="examinationForm"
            :rules="examinationRules"
            label-width="70px"
            class="item-mb30"
            ref="examinationFormRef"
          >
            <el-form-item label="综合考试">
              <el-switch
                v-model="examinationForm.value"
                active-color="#13ce66"
                inactive-color="#ff4949"
                class="gc-switch"
              >
              </el-switch>
            </el-form-item>
            <el-form-item label="是否支持模拟练习" class="ws dr-label">
              <div class="aic h-30">
                <el-switch
                  v-model="examinationForm.value"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  class="gc-switch"
                >
                </el-switch>
                <i class="icons-wraning ml20"></i>
                <p class="tintColor6 ml10">打开后，学员可进行模拟练习</p>
              </div>
            </el-form-item>
            <el-form-item label="考试时长">
              <el-input placeholder="请输入正整数" class="w500">
                <i slot="suffix" class="fontColor mr6">分钟</i>
              </el-input>
            </el-form-item>
            <el-form-item label="尝试次数">
              <el-input placeholder="请输入正整数" class="w500">
                <i slot="suffix" class="fontColor mr6">次</i>
              </el-input>
            </el-form-item>
            <el-form-item label="题目配置">
              <el-radio-group v-model="examinationForm.radio">
                <el-radio :label="1" class="mr80">题目打乱</el-radio>
                <el-radio :label="2" class="mr80">选项打乱</el-radio>
                <el-radio :label="3" class="mr80">交卷后显示答案提示</el-radio>
                <el-radio :label="4" class="mr80"
                  >考试结束后显示答案提示</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出题方式">
              <el-radio-group v-model="examinationForm.radio">
                <el-radio :label="1" class="mr80">自主选题</el-radio>
                <el-radio :label="2" class="mr80"
                  >随机抽题
                  <span class="tintColor"
                    >（按课程标签匹配题库）</span
                  ></el-radio
                >
              </el-radio-group>
            </el-form-item>
            <div class="title">
              <span class="title__menu"></span>
              题目信息
            </div>
            <div v-if="examinationForm.radio === 1">
              <p class="mt10 ml15">
                共90题，总分120分
                <span class="tintColor">
                  （单选题30题，共60分; 多选题30题，共60分; 判断题30题，共60分）
                </span>
              </p>
              <div class="between">
                <div class="aic">
                  <gc-select class="w-200 mr6"></gc-select>
                  <i class="icons-wraning mr20"></i>
                  <gc-select class="w-200"></gc-select>
                </div>
                <div class="icons no-line">
                  <span class="icons__choiceTopic" @click="openChoiceTopic">
                    <i class="icons__choiceTopic__icon"></i>
                    题库选题</span
                  >
                  <span
                    class="icons__upload ml10"
                    @click="topicTemplateImportVisible = true"
                  >
                    <i class="icons__upload__icon"></i>
                    模版导入</span
                  >
                </div>
              </div>

              <gc-table
                class="general__table"
                :list="independentTopicList"
                :tableList="independentTopicTableList"
              >
                <el-table-column label="操作"></el-table-column>
              </gc-table>
            </div>
            <div v-else>
              <p class="mt10 ml15">共10题，总分100分</p>
              <gc-table
                class="general__table mt20"
                no-list
                :tableList="randomTopicTableList"
              >
                <el-table-column label="题型"></el-table-column>
                <el-table-column label="抽题数量">
                  <el-input class="w100"></el-input>
                </el-table-column>
                <el-table-column label="每题分值">
                  <el-input class="w100"></el-input>
                </el-table-column>
                <el-table-column label="总分"> </el-table-column>
              </gc-table>
            </div>
            <div class="title mt30">
              <div class="title__menu"></div>
              分数线设置
            </div>
            <el-form-item label-width="0" class="fractional-line mt20">
              <el-input placeholder="请输入" v-model="examinationForm.input1">
                <template slot="prepend">通过分数</template>
              </el-input>
              <span class="ml10">分</span>
            </el-form-item>
          </el-form>
        </div>
        <div class="project-info" v-show="active === 2">
          <el-form label-width="100px" class="item-mb30" ref="pushInfoFormRef">
            <el-form-item label="审批链" class="mt30 mb0" required>
              <el-input readonly :value="pushInfoForm.auditUsersName"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="cancel">返回</el-button>
        <el-button
          class="button-w80-h30 button-blue"
          v-show="active !== 0"
          @click="preStep"
          >上一步</el-button
        >
        <el-button
          class="button-w80-h30"
          type="primary"
          v-show="active !== 2"
          @click="nextStep"
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, set as $set } from 'vue'
import { Message } from 'element-ui'
import { CopyObj } from '@/util/utils'
const themeTreeRef = ref(null)

const defaultProps = reactive({
  children: 'children',
  label: 'label'
})
const themeDefaultItem = {
  id: null,
  label: '',
  children: [],
  courseList: []
}
const themeTreeData = ref([])
let treeId = 0

// 对树节点进行筛选时执行的方法
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}

const themeCheckItem = ref({})
const themeResetChecked = () => {
  themeTreeRef.value.setCheckedKeys([])
  themeCheckItem.value = {}
}

const themeCheckHandle = (node, checkedNodes) => {
  themeCheckItem.value = {}
  // 设置目前勾选的节点，使用此方法必须设置 node-key 属性
  if (checkedNodes.checkedKeys.length > 0) {
    if (node.children?.length) {
      Message.warning('只能选择最后一级节点')
      themeResetChecked()
    } else {
      themeTreeRef.value.setCheckedKeys([node.id])
      themeCheckItem.value = themeTreeRef.value.getNode(node.id)?.data
    }
  }
}

// 格式转换
const subjectListToTreeData = (arr) => {
  arr.forEach(item => format(item))
  themeTreeData.value = arr

  function format(item) {
    item.id = ++treeId
    item.label = item.subjectName
    item?.children?.forEach(child => format(child))
  }
}

defineExpose({
  themeTreeData,
  themeCheckItem,
  subjectListToTreeData
})
</script>
<script>
import {
  merge,
  closeCurrPage,
  handleUdmpHref
} from '@/util/utils'
import $ from 'jquery'
import gcSteps from '../components/gc-steps'
import gcUpload from '@/components/upload'
export default {
  name: 'CRPreviewProject',
  components: {
    gcSteps,
    gcUpload,
  },
  data() {
    return {
      showPage: 0,
      // 步骤条索引
      active: 0,
      // 步骤条数据列表
      stepList: ['课程包信息', '课程信息', '审批'],
      // 项目信息 form
      projectForm: {
        projectName: '',
        blgOrgName: '',
        leaderUm: '',
        coverList: [],
        oldCoverList: [],
        introduce: '',
        supportShare: ''
      },
      // 课程信息 表格 字段数组
      courseInfoList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          type: 'component',
          label: '课程名称',
          width: '146',
          'show-overflow-tooltip': true,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline ellipsis'
                  },
                  row.courseName
                )
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
          width: '120'
        },
        {
          label: '课程难易程度',
          prop: 'difficultyLevel',
          width: '120'
        }
      ],
      // 课程信息 表格 数据数组
      courseInfoTableList: [],
      // 综合考试 表单
      examinationForm: {},
      // 综合考试 表单 验证规则
      examinationRules: {},
      // 自主选题 字段数组
      independentTopicList: [
        {
          type: 'index',
          label: '序号',
          width: ''
        },
        {
          label: '题型',
          width: '',
          prop: ''
        },
        {
          label: '题目',
          width: '',
          prop: ''
        },
        {
          label: '选项',
          width: '',
          prop: ''
        },
        {
          label: '答案',
          width: '',
          prop: ''
        },
        {
          label: '标签',
          width: '',
          prop: ''
        },
        {
          label: '难度',
          width: '',
          prop: ''
        }
      ],
      // 自主选题 数据数组
      independentTopicTableList: [],
      // 随机抽题 数据数组
      randomTopicTableList: [],
      // 题目模版导入dialog 状态
      topicTemplateImportVisible: false,
      // 推送信息 表单
      pushInfoForm: {},
      // 是否要跟随鼠标移动
      moveFlag: false,
      courseList: [],
      // 页面状态
      state: '',
      stateMap: {
        add: '新增课程包',
        edit: '修改课程包'
      },
      // 学习截止时间
      studyDeadline: 'dateTime',
      // 学习截止时间点
      studyDateTime: '',
      // 学习截止持续时间
      studyContinueDay: '',
      // 选课的类型分主题和无主题
      courseType: 'noTheme',
      // 主题列表
      subjectList: [],
      // 主题列表的内容对象
      subjectListContent: {
        subjectName: '',
        finishDay: '',
        courseInfoTableList: []
      },
      // 当前添加课程的主题下标
      currentThemeIndex: null,
      // 主题是否设置学习时间
      existFinish: false
    }
  },
  methods: {
    nextStep() {
      this.active++
    },
    preStep() {
      this.active--
    },
    handleCourseList() {
      for (let i = 0; i < 3; i++) {
        this.courseList.push({
          name: '课程名称' + i,
          i
        })
      }
    },
    // 后端数据转化为符合前端的
    afterToBefore(data) {
      merge(this.projectForm, data)
      this.projectForm.leaderUm = `${data.leaderName}(${data.leaderUm})`
      if (data.coverUdmp.trim()) {
        this.projectForm.coverList = [
          {
            fileName: data.coverFileName,
            udmpId: data.coverUdmp
          }
        ]
        this.projectForm.oldCoverList = [
          {
            url: handleUdmpHref(data.coverUdmp),
            name: data.coverFileName,
            uid: data.coverUdmp
          }
        ]
      }
      this.courseInfoTableList = data.courseList || []

      // 添回主题数据
      if (data.subjectList) {
        this.subjectListToTreeData(data.subjectList)
        // this.subjectList = data.subjectList.map((item) => {
        //   item.courseInfoTableList = item.courseList
        //   Reflect.deleteProperty(item, 'courseList')
        //   return item
        // })
      }

      // 设置显示主题或无主题的tab项
      this.courseType = data.isSubject === 'Y' ? 'theme' : 'noTheme'

      // 推送信息 数据处理
      merge(this.pushInfoForm, data)
      this.eoaStatus = data.eoaStatus

      this.existFinish = data.existFinish === 'Y'

      // 从后端获取数据转换回前端渲染结构
      if (data.studyDeadline && !data.studyDays) {
        this.studyDeadline = 'dateTime'
        this.studyDateTime = data.studyDeadline
      }

      // 设置学习时长类型选择关系
      if (data.studyDeadlineType === 'T') {
        this.studyDeadline = 'dateTime'
        this.studyDateTime = data.studyDeadline
      }

      if (data.studyDeadlineType === 'D') {
        this.studyDeadline = 'continueDay'
        this.studyContinueDay = data.studyDays
      }
    },
    // 取消
    cancel() {
      closeCurrPage()
    },
    // 重置所有表单
    resetFormData() {
      this.$refs.projectFormRef.resetFields()
      this.$refs.examinationFormRef.resetFields()
      this.$refs.pushInfoFormRef.resetFields()
      this.courseInfoTableList = []
    },
    // 跳转到预览界面
    async preview(row) {
      const { courseId } = row
      const data = { courseId }
      const params = await fetchSearchCourseByCourseId({ data })
      addAllowKeepAlive('/CRPreviewCourse')
      this.$router.push({
        name: '课程详情',
        params
      })
    },
  },
  mounted() {
    this.handleCourseList()
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.resetFormData()
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.projectId) {
      this.projectId = params.projectId
      this.afterToBefore(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.pdl10 {
  padding-left: 10px;
}
.theme-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.continue-day {
  :deep(.el-input__suffix) {
    display: flex;
    align-items: center;
    margin-right: 5px;
  }

  :deep(.el-input--suffix .el-input__inner) {
    padding-right: 25px !important;
  }
}
.course-recommendation__new-project {
  .gc-main {
    padding-top: 40px;
    background-color: #fff;
    .content-box {
      margin: 60px 0;
      .project-info {
        .el-form {
          width: 670px;
          margin: auto;
        }
      }
      .course-info {
        padding: 0 20px;
      }
      .examination {
        width: 1000px;
        margin: auto;
      }
    }
  }
}
.theme-tree-warp {
  display: flex;
  .theme-tree-aside {
    width: 250px;
  }
  :deep(.theme-tree-aside) {
    // 只能单选样式
    .el-tree-node__content label.el-checkbox {
      // display: none;
      margin-right: 0;
    }
    .el-tree-node__children label.el-checkbox {
      display: inline-block;
      margin-right: 0;
    }
    .el-tree-node {
      .is-leaf + .el-checkbox .el-checkbox__inner {
        display: inline-block;
        margin-right: 6px;
      }
      .el-checkbox .el-checkbox__inner {
        display: none;
      }
    }
  }
  .custom-tree-node {
    display: flex;
  }
  .theme-name {
    width: 155px;
    line-height: 1.8;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .theme-options {
    .el-button {
      padding-top: 4px;
      padding-bottom: 4px;
      border: 1px solid #eee;
    }
    .el-button + .el-button {
      margin-left: 15px !important;
    }
  }

  .theme-tree-container {
    flex: 1;
    margin-left: 20px;
    min-height: 500px;
    .empty-tips {
      line-height: 120px;
      text-align: center;
      border: 1px solid #eee;
    }
    .subject-name {
      padding: 15px 20px;
      border: 1px solid #ebeef5;
      border-bottom-width: 0;
      background-color: #fff;
    }
  }
}
</style>