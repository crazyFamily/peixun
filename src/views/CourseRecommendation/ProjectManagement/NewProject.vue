<template>
  <div class="course-recommendation__new-project">
    <div v-show="showPage === 0" class="gc-main">
      <!-- 进度条 -->
      <gc-steps :active="active" :list="stepList" width="728px"></gc-steps>
      <!-- 内容区域 -->
      <div class="content-box">
        <!-- 课程包信息 -->
        <div class="project-info" v-show="active === 0">
          <el-form :model="projectForm" :rules="projectRules" label-width="70px" class="item-mb30" ref="projectFormRef">
            <el-form-item prop="projectName" class="ws dr-label" label="课程包名称">
              <el-input maxlength="30" show-word-limit placeholder="限制30字" v-model="projectForm.projectName"></el-input>
            </el-form-item>
            <el-form-item label="课程包属主部门" class="ws dr-label" prop="blgOrg">
              <gc-select w1 class="p0" k="orgName" v="orgId" :options="orgOptions" v-model="projectForm.blgOrg"></gc-select>
            </el-form-item>
            <el-form-item label="课程包负责人" class="ws dr-label" prop="leaderUm">
              <el-autocomplete
                class="w-full"
                value-key="empName"
                placeholder="请输入UM号"
                :trigger-on-focus="false"
                @select="handleLeaderUmSelect"
                v-model.trim="projectForm.leaderUm"
                :fetch-suggestions="leaderUmQuerySearch"
              ></el-autocomplete>
            </el-form-item>
            <!-- <el-form-item label="项目封面" prop="coverList">
                            <gc-upload
                                :size="200"
                                v-model="projectForm.coverList"
                                :list="projectForm.oldCoverList"
                            ></gc-upload>
                            <p class="tintColor">
                                推荐比例4 ：3，支持
                                jpg、png格式，文件大小不超过200k
                            </p>
                        </el-form-item> -->
            <el-form-item label="课程包介绍" class="ws dr-label" prop="introduce">
              <el-input type="textarea" resize="none" class="h-90" maxlength="500" show-word-limit v-model.trim="projectForm.introduce"></el-input>
            </el-form-item>
            <el-form-item label="转发/分享" class="ws dr-label" prop="supportShare">
              <el-radio-group v-model="projectForm.supportShare">
                <el-radio label="Y" class="mr60">是</el-radio>
                <el-radio label="N">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 学习截止时间 -->
            <el-form-item label="学习截止时间" class="mt30 mb0">
              <el-radio-group v-model="studyDeadline" @change="studyDeadlineTypeChangeHandle">
                <div class="date-time mb10">
                  <el-radio label="dateTime">指定日期</el-radio>
                  <el-date-picker
                    class="w-196 ml10"
                    v-model="studyDateTime"
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    :disabled="studyDeadline !== 'dateTime'"
                  >
                  </el-date-picker>
                </div>
                <div class="continue-day input-suffix-type">
                  <el-radio label="continueDay">完成期限</el-radio>
                  <el-input
                    class="w-196 ml10"
                    placeholder="请输入天数"
                    :disabled="studyDeadline !== 'continueDay'"
                    v-model="studyContinueDay"
                    @blur="continueDayBlurHandle"
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
            <table-pagination
              drop
              row-key="courseId"
              ref="courseInfoTableRef"
              class="general__table mt20 course-table"
              :list="courseInfoList"
              :tableList="courseInfoTableList"
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
                  <span class="active" @click="courseInfoDel(scope.$index)">移除</span>
                  <span class="active pdl10" @click="setListTop(scope.$index, $event)">{{
                    courseInfoTableList[scope.$index].isTop === 'Y' ? '取消置顶' : '置顶'
                  }}</span>
                </template>
              </el-table-column>
            </table-pagination>
          </div>
          <!-- 按主题选课 -->
          <div class="theme-container" v-show="courseType === 'theme'">
            <section class="theme-tree-warp">
              <aside class="theme-tree-aside">
                <div class="control-footer">
                  <span class="icons__add" @click="addThemeHandle">
                    <i class="icons__add__icon"></i>
                    添加主题
                  </span>
                  <!-- <span class="icons__add set-time-box">
                    <el-checkbox class="checkbox" v-model="existFinish">是否设置主题完成期限</el-checkbox>
                  </span> -->
                </div>
                <!-- 主题tree -->
                <el-tree
                  ref="themeTreeRef"
                  :data="themeTreeData"
                  show-checkbox
                  node-key="id"
                  draggable
                  default-expand-all
                  highlight-current
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  :allow-drop="allowDrop"
                  @check="themeCheckHandle"
                  @node-drag-end="dragAppend">
                  <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="theme-name">{{ data.label || '请输入主题名称' }}</div>
                    <div class="theme-options">
                      <i class="el-icon-edit-outline" @click="treeEditItem(data)"></i>
                      <i v-if="node.level < 4" class="el-icon-circle-plus-outline" @click="themeAppend(data)"></i>
                      <i class="el-icon-remove-outline" @click="themeRemove(node, data)"></i>
                    </div>
                  </div>
                </el-tree>
              </aside>
              <section class="theme-tree-container">
                <div v-if="!themeCheckItem.id" class="empty-tips">请选择末级节点</div>
                <!-- 设置主题 -->
                <template v-else>
                  <div class="subject-name">当前节点：{{ themeCheckItem.label || '请输入主题名称' }}</div>
                  <el-card class="theme-info-list">
                    <div slot="header" class="clearfix">
                      <div class="theme-header-container">
                        <div class="theme-header-info">
                          <!-- <el-input placeholder="天" class="w150 ml20" v-model.number="subjectList[index].finishDay" v-show="existFinish">
                            <span slot="prepend">完成期限</span>
                          </el-input> -->
                          <span class="icons__add" @click="themeAddCourseHandle(themeCheckItem.id)">
                            <i class="icons__add__icon"></i>
                            新增课程
                          </span>
                        </div>
                      </div>
                    </div>
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
                          <span class="active" @click="courseInfoDel(scope.$index, themeCheckItem.courseList)">移除</span>
                          <span class="active pdl10" @click="setListTop(scope.$index, $event, themeCheckItem.courseList)">{{
                            themeCheckItem.courseList[scope.$index].isTop === 'Y' ? '取消置顶' : '置顶'
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
        <!-- 考试信息 冗余代码 -->
        <div class="examination" v-show="active === 3">
          <el-form :model="examinationForm" :rules="examinationRules" label-width="70px" class="item-mb30" ref="examinationFormRef">
            <el-form-item label="综合考试">
              <el-switch v-model="examinationForm.value" active-color="#13ce66" inactive-color="#ff4949" class="gc-switch"> </el-switch>
            </el-form-item>
            <el-form-item label="是否支持模拟练习" class="ws dr-label">
              <div class="aic h-30">
                <el-switch v-model="examinationForm.value" active-color="#13ce66" inactive-color="#ff4949" class="gc-switch"> </el-switch>
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
                <el-radio :label="4" class="mr80">考试结束后显示答案提示</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出题方式">
              <el-radio-group v-model="examinationForm.radio">
                <el-radio :label="1" class="mr80">自主选题</el-radio>
                <el-radio :label="2" class="mr80">随机抽题 <span class="tintColor">（按课程标签匹配题库）</span></el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="title">
              <span class="title__menu"></span>
              题目信息
            </div>
            <div v-if="examinationForm.radio === 1">
              <p class="mt10 ml15">
                共90题，总分120分
                <span class="tintColor"> （单选题30题，共60分; 多选题30题，共60分; 判断题30题，共60分） </span>
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
                  <span class="icons__upload ml10" @click="topicTemplateImportVisible = true">
                    <i class="icons__upload__icon"></i>
                    模版导入</span
                  >
                </div>
              </div>

              <gc-table class="general__table" :list="independentTopicList" :tableList="independentTopicTableList">
                <el-table-column label="操作"></el-table-column>
              </gc-table>
            </div>
            <div v-else>
              <p class="mt10 ml15">共10题，总分100分</p>
              <gc-table class="general__table mt20" no-list :tableList="randomTopicTableList">
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
        <!-- 审批 -->
        <div class="project-info" v-show="active === 2">
          <el-form :model="pushInfoForm" :rules="pushInfoRules" label-width="100px" class="item-mb30" ref="pushInfoFormRef">
            <el-form-item label="审批链" class="mt30 mb0" required>
              <ApprovalChain autoApproval chainType="5" @confirm="approvalChainConfirm" />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="cancel">取消</el-button>
        <el-button class="button-w80-h30" @click="save(0)" v-if="!isApprovalProgress">保存草稿</el-button>
        <el-button class="button-w80-h30 button-blue" v-show="active !== 0" @click="preStep">上一步</el-button>
        <el-button class="button-w80-h30" type="primary" v-show="active !== 2" @click="nextStep">下一步</el-button>
        <template v-if="active === 2">
          <el-button v-if="isApprovalProgress && !isNeedApproval" class="button-w100-h30" type="primary" @click="save(1)">保存并更新</el-button>
          <el-button v-else class="button-w100-h30" type="primary" @click="submit">保存并提交审批</el-button>
        </template>
      </div>
    </div>

    <!-- 题库选题 页 -->
    <div v-show="showPage === 1">
      <ChoiceTopic @cancel="showPage = 0" />
    </div>

    <!-- 选择课程页 -->
    <div v-show="showPage === 2">
      <ChoiceCourse
        ref="choiceCourse"
        :canPrview="false"
        confirmText="添加至课程包"
        @cancel="choiceCourseCancel"
        @acknowledgement="choiceCourseAcknowledgement"
      />
    </div>

    <!-- 模版导入 dialog -->
    <TemplateImport :visible.sync="topicTemplateImportVisible" />

    <!-- 按主题选课tree -->
    <el-dialog
      title="编辑主题"
      :visible.sync="themeEditVisible"
      :close-on-click-modal="false"
      @close="themeEditClose"
      width="550px">
      <el-form ref="form" :model="themeEditForm" label-width="60px">
        <el-form-item label="主题名称" prop="subjectName">
          <el-input v-model="themeEditForm.subjectName" placeholder="请输入名称" clearable maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="themeEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="themeEditConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { nextTick, reactive, ref, set as $set } from 'vue'
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

// 增删
const addThemeHandle = () => {
  themeTreeData.value.push({
    ...CopyObj(themeDefaultItem),
    id: ++treeId
  })
}
const themeAppend = (data) => {
  themeResetChecked()
  if (data.courseList?.length) return Message.warning('此节点存在课程，不能新增节点')
  const newChild = { ...CopyObj(themeDefaultItem), id: ++treeId }
  if (!data.children) {
    $set(data, 'children', [])
  }
  data.children.push(newChild)
}
const dragAppend = (node, dropNode, dropType, ev) => {
  // console.log('node', node)
  // console.log('dropNode', dropNode)
  // console.log('dropType', dropType)
  // console.log('ev', ev)
  if (dropNode && dropType === 'none') Message.warning('此节点存在课程，不能拖入节点')
}
const allowDrop = (draggingNode, dropNode, type) => {
  // console.log('draggingNode', draggingNode)
  // console.log('dropNode', dropNode.data.courseList.length)
  if (dropNode.data.courseList.length === 0) {
    return true
  } 
  // console.log('type', type)
}
const themeRemove = (node, data) => {
  themeResetChecked()
  const parent = node.parent
  const children = parent.data.children || parent.data
  const index = children.findIndex(d => d.id === data.id)
  children.splice(index, 1)
}

// 修改tree
const themeEditVisible = ref(false)
const themeEditForm = reactive({
  subjectName: ''
})
const themeSelectItem = ref({})
const treeEditItem = (data) => {
  themeSelectItem.value = data
  const rowData = CopyObj(data)
  themeEditForm.subjectName = rowData.label
  themeEditVisible.value = true
}
const themeEditConfirm = () => {
  const label = themeEditForm.subjectName.trim()
  if (!label) {
    Message.error('请输入名称')
    return
  }
  Object.assign(themeSelectItem.value, { label })
  themeEditVisible.value = false
}
const themeEditClose = () => {
  themeSelectItem.value = {}
  themeEditForm.subjectName = null
}

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
      setSubjectTableFilter()
    }
  }
}
// 置顶的课程设置表格的filter类名
const setSubjectTableFilter = () => {
  nextTick(() => {
    const domCourseTrList = document.querySelector('.subject-table tbody').querySelectorAll('tr')
    const courseList = themeCheckItem.value?.courseList || []
    courseList.some((courseItem, courseIndex) => {
      if (courseItem.isTop === 'Y') {
        domCourseTrList[courseIndex].querySelectorAll('td')[0].className += ' filter'
        return true
      }
    })
  })
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
const treeDataToSubjectList = () => {
  const arr = CopyObj(themeTreeData.value)
  arr.forEach(item => format(item))
  return arr

  function format(item) {
    item.subjectName = item.label
    item?.children?.forEach(child => format(child))
  }
}
const treeDataToCourseList = () => {
  let list = []
  const arr = CopyObj(themeTreeData.value)
  arr.forEach(item => format(item))
  return list

  function format(item) {
    if (item?.courseList?.length) {
      list = [...list, ...item.courseList]
    }
    item?.children?.forEach(child => format(child))
  }
}

defineExpose({
  themeTreeData,
  themeCheckItem,
  subjectListToTreeData,
  treeDataToSubjectList,
  treeDataToCourseList
})
</script>
<script>
import {
  merge,
  CopyObj,
  throttle,
  setPageTitle,
  closeCurrPage,
  handleUdmpHref,
  addAllowKeepAlive,
  closeCurrPageAndGoPath,
  gtNow
} from '@/util/utils'
import $ from 'jquery'
import { getOrg } from '../utils'
import gcSteps from '../components/gc-steps'
import gcUpload from '@/components/upload'
import TreeDropdown from '@/components/dropdown/TreeDropdown'
import ChoiceTopic from '../components/ChoiceTopic'
import ChoiceCourse from '../components/ChoiceCourse'
import TemplateImport from '../components/TemplateImport'
import { fetchUserInfos } from '@/fetch/public'
import {
  fetchSaveProjectDraft,
  fetchSearchCourseByCourseId
} from '@/fetch/courseRecommendation'
export default {
  name: 'CRNewProject',
  components: {
    gcSteps,
    gcUpload,
    TreeDropdown,
    ChoiceTopic,
    ChoiceCourse,
    TemplateImport
  },
  directives: {
    drop: {
      inserted: (el, { value }, vnode) => {
        const that = vnode.context
        const { i } = value
        el.style.left = i * 215 + 'px'
        el.value = value
        el.onmousedown = function (e) {
          value.x = e.offsetX
          value.left = el.style.left
          value.distanceX = $(el.parentNode).offset().left
          that.moveFlag = true
          el.style.zIndex = 2
        }
        el.onmousemove = function (e) {
          if (!that.moveFlag) return
          const distanceX = e.pageX - value.distanceX
          if (e.offsetY < 0 || e.offsetY > 44 || distanceX < 0 || distanceX > 630) {
            return (that.moveFlag = false)
          }
          el.style.left = Math.max(Math.min(distanceX - value.x, 430), 0) + 'px'
        }
        el.onmouseleave = (e) => {
          if (!that.moveFlag) return
          that.moveFlag = false
          el.style.left = value.left
        }
        el.onmouseup = function (e) {
          if (!that.moveFlag) return
          that.moveFlag = false
          el.style.zIndex = 1
          for (let i = 0; i < el.parentNode.children.length; i++) {
            const ele = el.parentNode.children[i]
            if (ele === el) continue
            if (Math.abs(parseInt(ele.style.left) - parseInt(el.style.left)) < el.clientWidth / 2) {
              el.style.left = ele.style.left
              ele.style.left = value.left
              ;[value.i, ele.value.i] = [ele.value.i, value.i]
              return
            }
          }
          el.style.left = value.left
        }
      }
    }
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
        blgOrg: '',
        leaderUm: '',
        coverList: [],
        oldCoverList: [],
        introduce: '',
        supportShare: ''
      },
      // 项目信息 form 验证规则
      projectRules: {
        projectName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入课程包名称'
          }
        ],
        blgOrg: [{ required: true, message: '请选择课程包属主部门' }],
        leaderUm: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入课程包负责人'
          }
        ],
        coverList: [
          {
            required: true,
            type: 'array',
            message: '请上传课程封面'
          }
        ],
        introduce: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入课程包介绍'
          }
        ],
        supportShare: [
          {
            required: true,
            message: '请选择转发/分享'
          }
        ]
      },
      // 部门下拉选项
      orgOptions: [],
      // 课程信息 表格 字段数组
      courseInfoList: [
        {
          width: '64',
          'class-name': 'drop',
          formatter: () => <i class="el-icon-rank drop"></i>
        },
        {
          type: 'index',
          label: '序号',
          width: '64',
          'class-name': 'table-index'
        },
        { slot: 'courseName' },
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
          width: '132'
        },
        {
          label: '上架时间',
          prop: 'upTime',
          width: '100',
          formatter: (row) => row?.upTime?.split(' ')[0]
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
      pushInfoForm: {
        studyDeadline: ''
      },
      // 推送信息 表单 验证规则
      pushInfoRules: {},
      // 是否要跟随鼠标移动
      moveFlag: false,
      courseList: [],
      // 页面状态
      state: '',
      stateMap: {
        add: '新增课程包',
        edit: '修改课程包',
        copy: '复制课程包'
      },
      // 是否可以修改 是否需要重新发起审批 的状态
      isChange: false,
      // 是否需要重新发起审批
      isNeedApproval: false,
      eoaStatus: '',
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
      // 当前添加课程的主题下标
      currentThemeIndex: null,
      // 主题是否设置学习时间
      existFinish: false,
      // 推送历史状态
      pushHistoryStatus: null,
      gtNow
    }
  },
  methods: {
    nextStep() {
      if (this.verifyInfo()) this.active++
    },
    preStep() {
      this.active--
    },
    // 项目负责人远程搜索
    async leaderUmQuerySearch(queryString, cb) {
      const data = { empName: queryString }
      const { list } = await fetchUserInfos({ data })
      cb(list.map((item) => ({ ...item, empName: `${item.empName}(${item.umId})` })))
    },
    handleLeaderUmSelect() {},
    openChoiceTopic() {
      this.showPage = 1
    },
    handleCourseList() {
      for (let i = 0; i < 3; i++) {
        this.courseList.push({
          name: '课程名称' + i,
          i
        })
      }
    },
    // 选择课程取消事件
    choiceCourseCancel() {
      this.showPage = 0
    },
    // 选择课程确认事件
    choiceCourseAcknowledgement(list) {
      this.showPage = 0
      let ids

      if (this.courseType === 'theme') {
        list = this.filterListData(list)
        ids = this.themeCheckItem.courseList.map((v) => v.courseId)
      } else {
        ids = this.courseInfoTableList.map((v) => v.courseId)
      }

      list.forEach((v) => {
        if (!ids.includes(v.courseId)) {
          // 需求变更：课程初始添加进来，默认为非置顶状态
          let data = { ...v, isTop: 'N' }
          // 需求变更: 当前标签切换到主题的时候，需要根据当前活动的主题列表进行添加
          if (this.courseType === 'noTheme') {
            this.courseInfoTableList.push(data)
          }
          if (this.courseType === 'theme') {
            this.themeCheckItem.courseList.push(data)
          }
          //
          this.changeBtnShow()
        }
      })
    },
    // 过滤重复数据
    filterListData(list) {
      // 只有在主题选课类型下才需要进行过滤
      if (this.courseType === 'theme') {
        let repeatList = []
        let courseList = this.treeDataToCourseList()
        list = list.filter((item) => {
          let res = courseList.find((findItem) => findItem.courseId === item.courseId)
          res && repeatList.push(item.courseName)
          return !Boolean(res)
        })
        repeatList.length && this.$message.warning(`其他主题已存在重复的课程：${repeatList.join(', ')}，已被自动去除`)
        return list
      }
    },
    // 移除一个课程
    async courseInfoDel(index, target = this.courseInfoTableList) {
      await this.delTips()
      target.splice(index, 1)
      this.changeBtnShow()
    },
    // 前端数据转化为符合后台的
    beforeToAfter() {
      // 课程包信息 参数转换
      const projectForm = CopyObj(this.projectForm)
      projectForm.coverUdmp = projectForm.coverList?.[0]?.udmpId
      projectForm.coverFileName = projectForm.coverList?.[0]?.fileName
      if (projectForm.leaderUm.match(/\((\w+)\)/)) {
        projectForm.leaderUm = projectForm.leaderUm.match(/\((\w+)\)/)[1]
      }
      Reflect.deleteProperty(projectForm, 'coverList')
      Reflect.deleteProperty(projectForm, 'oldCoverList')
      const courseList = this.courseInfoTableList
      const pushInfoForm = CopyObj(this.pushInfoForm)


      // 取学习时间
      if (this.studyDeadline === 'dateTime') {
        pushInfoForm.studyDeadlineType = 'T'
        pushInfoForm.studyDeadline = this.studyDateTime || undefined
        // 另外一个不需要传
        pushInfoForm.studyDays = undefined
      }
      if (this.studyDeadline === 'continueDay') {
        pushInfoForm.studyDeadlineType = 'D'
        // 后端接收为Number类型
        pushInfoForm.studyDays = Number(this.studyContinueDay)
        // 另外一个不需要传
        pushInfoForm.studyDeadline = undefined
      }
      // 多级主题
      let subjectList = this.treeDataToSubjectList()
      // subjectList = subjectList.map((item) => {
      //   item.courseList = item.courseInfoTableList
      //   Reflect.deleteProperty(item, 'courseInfoTableList')
      //   if (this.existFinish === false) {
      //     Reflect.deleteProperty(item, 'finishDay')
      //   }
      //   return item
      // })

      const data = { ...projectForm, ...pushInfoForm }

      if (this.courseType === 'noTheme') {
        data.isSubject = 'N'
        data.courseList = courseList
      }

      if (this.courseType === 'theme') {
        data.isSubject = 'Y'
        data.subjectList = subjectList
        data.existFinish = this.existFinish === true ? 'Y' : 'N'
      }

      if (this.projectId) {
        data.projectId = this.projectId
      }
      return data
    },
    // 后端数据转化为符合前端的
    afterToBefore(data) {
      this.pushHistoryStatus = data.pushHistoryStatus
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
      let tableList = data.courseList || []
      // 兼容置顶状态，做个转化
      this.courseInfoTableList = tableList.map((item) => ({
        ...item,
        isTop: !item.isTop ? 'N' : item.isTop
      }))

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

      // 设置表格的filter类名
      this.setTableDataFilter()

      this.state === 'copy' && this._formatCopyData()
    },
    // 格式化数据，使输入数据符合复制功能的结构
    _formatCopyData() {
      console.log(this.$data, '===>')
      this.eoaStatus = ''
      this.projectId = null
      this.projectForm.projectName = `复制-${this.projectForm.projectName}`
      this.pushHistoryStatus = null
      // this.projectForm.projectName = ''
      // this.projectForm.blgOrg = ''
      // this.projectForm.leaderUm = ''
      // this.projectForm.supportShare = ''
    },
    // 验证项目数据
    validateProjectData() {
      const errors = []
      this.$refs.projectFormRef.validate((valied) => {
        errors[0] = valied ? 0 : '课程包信息验证错误'
      })
      // errors[1] = this.externalTeacherList.length ? 0 : "讲师信息必填";
      // this.$refs.examinationFormRef.validate(valied => {
      //     errors[2] = valied ? 0 : "综合考试验证错误";
      // });
      if (!this.pushInfoForm.auditUsers) {
        errors[3] = '请填写审批链'
      }

      let resultData = this.beforeToAfter()
      // 校验学习期限要为整数
      if (resultData.studyDeadlineType === 'D' && parseInt(resultData.studyDays) !== resultData.studyDays) {
        errors.push('学习期限要输入整数')
      }

      return new Promise((resolve, reject) => {
        this.$nextTick(() => resolve(errors.find((v) => v)))
      })
    },
    // 保存草稿
    async save(jump) {
      const data = this.beforeToAfter()
      // 校验学习期限要为整数
      if (data.studyDeadlineType === 'D' && parseInt(data.studyDays) !== data.studyDays) {
        this.$message.warning('学习期限要输入整数')
        return
      }
      data.eoaStatus = this.eoaStatus
      data.isSendEoa = jump ? 'Y' : 'N'
      const { projectId } = await fetchSaveProjectDraft({ data })
      console.log(projectId, '====>')
      this.$message.success('保存成功')
      this.projectId = projectId
      if (jump) {
        closeCurrPageAndGoPath({
          path: '/CRProjectManagement'
        })
      }
    },
    // 提交
    submit() {
      this.validateProjectData().then(async (res) => {
        if (res) {
          return this.$message.warning(res)
        }
        const data = this.beforeToAfter()
        data.isSendEoa = 'Y'
        await fetchSaveProjectDraft({ data })
        this.$message.success('提交成功')
        closeCurrPageAndGoPath({
          path: '/CRProjectManagement'
        })
      })
    },
    // 取消
    cancel() {
      closeCurrPage()
    },
    // 重置所有表单
    resetFormData() {
      this.$refs.projectFormRef.resetFields()
      this.$refs.examinationFormRef.resetFields()
      // 推送信息重置
      this.$refs.pushInfoFormRef.resetFields()
      this.courseInfoTableList = []
      this.active = 0
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
    // 审批链确认事件
    approvalChainConfirm(data) {
      this._.merge(this.pushInfoForm, data)
    },
    // 判断是否要 重新发起审批
    changeBtnShow() {
      if (this.isChange) {
        this.isNeedApproval = true
      }
    },
    /**
     * 置顶功能
     * 处理逻辑：判断当前操作项是否已为置顶状态，如是，取消置顶状态，如否，设置为置顶状态
     * 置顶逻辑：
     * 置顶项需要上移至列表第一项
     * 添加.filter类名，用于拖拽组件过滤
     * 取消置顶逻辑：
     * 取消后下移到非置顶项的第一行
     * 取消.filter类名，开放拖拽
     * 需要触发重新发起审核判断
     * @param index Number 当前需要处理的项在数据列的下标
     * @param event Object 对应$event
     * @param target 需要操作的数据列，默认为courseInfoTableList
     */
    async setListTop(index, event, target = this.courseInfoTableList) {
      let _this = this
      function tipAction() {
        return new Promise((resolve, reject) => {
          let tip = ''
          if (target[index].isTop === 'N') {
            tip = '是否确定置顶当前课程'
          }
          if (target[index].isTop === 'Y') {
            tip = '是否将当前课程取消置顶'
          }
          _this
            .$alert(tip, '提示', {
              confirmButtonText: '确定',
              showCancelButton: true,
              cancelButtonClass: 'cancel',
              customClass: `loginTimeout`
            })
            .then(() => {
              resolve()
            })
            .catch(() => {
              reject()
            })
        })
      }

      // 查父级节点
      function findParent(node, targetName) {
        // 边界
        if (node.nodeName === targetName) {
          return node
        }
        if (!node.parentElement) {
          return node
        }
        return findParent(node.parentElement, targetName)
      }

      await tipAction()

      // 设置置顶
      if (target[index].isTop === 'N') {
        let item = target.splice(index, 1)[0]
        item.isTop = 'Y'
        // 插入数据
        target.splice(0, 0, item)
        let findNode = findParent(event.target, 'TR')
        // 第一个单元格设置类名.filter
        findNode.querySelectorAll('td')[0].className += ' filter'
        // 数据顺序结构已变更，会影响到下面的判断，这里逻辑执行完后要做返回操作
        return
      }
      // 取消置顶
      if (target[index].isTop === 'Y') {
        // 取出数据
        let item = target.splice(index, 1)[0]
        item.isTop = 'N'
        // 查出非置顶的index
        let findisntTopIndex = target.findIndex((listItem) => listItem.isTop === 'N')
        // 插入数据
        target.splice(findisntTopIndex, 0, item)
        let findNode = findParent(event.target, 'TR')
        // 第一个单元格去除类名.filter
        findNode.querySelectorAll('td')[0].className = findNode.querySelectorAll('td')[0].className.replace(' filter', '')
        return
      }

      this.changeBtnShow()
    },
    // 学习截止时间切换
    studyDeadlineTypeChangeHandle() {
      // 不是当前状态的输入框的值，被清空
      if (this.studyDeadline === 'continueDay') {
        this.studyDateTime = ''
      }
      if (this.studyDeadline === 'dateTime') {
        this.studyContinueDay = ''
      }
    },
    // 学习天数输入框，清除非数字
    continueDayBlurHandle() {
      this.studyContinueDay = this.studyContinueDay.trim().replace(/^\D*/, '')
    },
    // 主题添加课程
    themeAddCourseHandle(index) {
      this.showPage = 2
      this.$refs.choiceCourse.query()
      this.currentThemeIndex = index
    },
    // 校验信息正确性
    verifyInfo() {
      // 主题状态下需要主题列表内时间必填
      if (this.active === 1 && this.courseType === 'theme' && this.existFinish) {
        for (let item of this.subjectList) {
          if (!item.finishDay) {
            this.$message.warning('需要录入主题最后期限, 且不得小于0')
            return false
          }
        }
      }
      return true
    },
    // 设置表格的filter类名
    setTableDataFilter() {
      this.$nextTick(() => {
        if (this.courseType === 'noTheme') {
          let domCourseList = document.querySelector('.course-table').querySelector('tbody').querySelectorAll('tr')
          this.courseInfoTableList.forEach((courseItem, courseIndex) => {
            if (courseItem.isTop === 'Y') {
              domCourseList[courseIndex].querySelectorAll('td')[0].className += ' filter'
            }
          })
        }
      })
    },
    // 课程/课包移除二次确认
    delTips(tip = '是否确认删除主题') {
      return new Promise((resolve, reject) => {
        this.$alert(tip, '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: `loginTimeout`
        })
          .then(() => {
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    }
  },
  mounted() {
    this.handleCourseList()
    getOrg().then((res) => {
      this.orgOptions = res
    })
  },
  activated() {
    this.isChange = false
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
      if (this.eoaStatus === '02002') {
        this.isChange = true
      }
    }
  },
  created() {
    this.submit = throttle(this.submit)
  },
  computed: {
    isApprovalProgress() {
      return this.eoaStatus === '02002'
    }
  }
}
</script>

<style lang="scss">
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
</style>
<style lang="scss" scoped>
.pdl10 {
  padding-left: 10px;
}

.theme-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-info-list {
  :deep(.gc-table.general__table) {
    margin-top: 0 !important;
  }
}

.set-time-box {
  padding-left: 0;
}

.general__table {
  border: 0;
}

.theme-tree-warp {
  display: flex;
  .theme-tree-aside {
    .control-footer {
      margin-bottom: 10px;
      width: 250px;
    }
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
        margin-right: 8px;
      }
      .el-checkbox .el-checkbox__inner {
        display: none;
      }
    }
  }
  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .theme-name {
    width: 120px;
    line-height: 1.8;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .theme-options {
    display: flex;
    .el-icon-edit-outline,
    .el-icon-circle-plus-outline,
    .el-icon-remove-outline {
      flex: 1;
      margin-left: 10px;
      font-size: 18px;
      color: #fd6720;
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