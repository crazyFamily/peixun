<template>
  <div class="establish__trainingCourse-assessment">
    <el-card class="tabs-card">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane name="assessment">
          <span slot="label" class="relative">
            发起评估
            <el-tooltip placement="bottom" popper-class="whiteness" effect="light">
              <div slot="content" style="width: 180px">
                <div class="fz14">评估发起后不能再次发起</div>
                <p class="mt5">
                  学员在“口袋银行家—个人学习中心”相关的培训班的评估模块，可查询已推送问卷
                </p>
                <p class="mt5">
                  培训班主任或带班老师可在评估记录中，下载已发起评估的问卷二维码
                </p>
              </div>
              <i class="hint"></i>
            </el-tooltip>
          </span>
          <div class="content-assessment">
            <div class="title">
              <span class="title__menu"></span>
              培训整体评估
            </div>
            <el-checkbox :disabled="true" v-model="trainAssessment" class="title1 mt20 mb10" >培训整体评估</el-checkbox>
            <div class="hint shallow h24 ml24">
              <p>
                注：1.培训整体评估需要在培训班结束后才可发起评估，并且要在培训班结束后一个月内完成评估，否则无法结训
              </p>
              <p class="td2e" v-if="$store.state.userInfo.blgStripLine === 'LS'">
                2.评估人数需占参训总人数50%及以上，才可结训
              </p>
            </div>
          </div>
          <div class="lecturer-assessment mt20">
            <div class="title"> <span class="title__menu"></span> 培训讲师评估 </div>
            <gc-table
              :list="assessmentList"
              :tableList="assessmentTableList"
              :spanMethod="assessmentSpanMethod"
              class="general__table mt10 mb10"
              :class="{ 'table-radio': !multipleSelectionIsShow }"
              ref="assessmentTableRef"
            ></gc-table>
            <div class="hint shallow h24 ml24">
              <p>
                注：1、培训讲师评估在上完该课程后即可发起评估，也可在训后一起评估；需要培训班结束后一个月内完成评估，否则无法结训
              </p>
              <p class="td2e" v-if="$store.state.userInfo.blgStripLine === 'LS'">
                2、评估人数需占参训总人数50%及以上，才可结训
              </p>
            </div>
          </div>
          <div class="questionnaire-category mt20">
            <div class="title"> <span class="title__menu"></span> 选择问卷类型 </div>
            <div class="radios mt20">
              <el-radio disabled v-model="questionnaireCategory" label="new_custom">标准版问卷</el-radio>
              <el-radio disabled v-model="questionnaireCategory" label="new_simple">简化版问卷</el-radio>
              <el-radio disabled v-if="isTemplate" v-model="questionnaireCategory" :label="questionnaireCategory">定制问卷</el-radio>
            </div>
          </div>
          <div class="questionnaire-category mt20">
            <div class="title">
              <span class="title__menu"></span>
              是否匿名提交
            </div>
            <div class="radios mt20">
              <el-radio-group v-model="questionnaireAnonymous" disabled>
                <el-radio label="N">不匿名</el-radio>
                <el-radio label="Y">
                  <span>匿名</span>
                  <el-tooltip placement="bottom" popper-class="whiteness" effect="light">
                    <div slot="content" style="line-height: 25px;" class="tooltip__anonymous">
                      <p>1. 选择匿名后，评估明细中的用户信息将被加密，只能看到评估内容</p>
                      <p>2. 当一个培训班有多个问卷时，只要其中一个选择了匿名，此培训班其他问卷也会匿名</p>
                    </div>
                    <i class="hint"></i>
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="buttons dfc mt50">
            <!-- <el-button class="button-w80-h30" @click="openQuestionnaire"
              >预览</el-button
            > -->
            <!-- <el-button
              :disabled="assessmentDisabled"
              class="button-w80-h30"
              type="primary"
              @click="initiateAssessment"
              >发起评估</el-button
            > -->
          </div>
        </el-tab-pane>
        <el-tab-pane label="评估记录" name="record">
          <div class="aic">
            <div class="title">
              <span class="title__menu"></span>
              已发起的评估
            </div>
            <span
              class="fzd shallow ml10"
              v-if="$store.state.userInfo.blgStripLine === 'LS'"
              >注：每条评估的人数占比均需达到50%及以上，才可结训</span
            >
          </div>
          <div class="menu-right mt20">
            <span class="instructor-icons__upload ml20" @click="exportResult">
              <i class="instructor-icons__upload__icon"></i>
              导出汇总结果
            </span>
          </div>
          <gc-table
            class="general__table"
            :list="alreadyAssessmentList"
            :tableList="alreadyAssessmentDataList"
          >
            <el-table-column
              label="评估内容"
              min-width="200"
              prop="evaCreatedName"
            >
              <template slot-scope="scope">
                <div class="df">
                  <span class="f1 ellipsis">{{ scope.row.evaTypeName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="发起人"
              min-width="100"
              prop="evaCreatedName"
            ></el-table-column>
            <el-table-column
              label="发起时间"
              min-width="100"
              prop="evaCreatedDateStr"
            ></el-table-column>
            <el-table-column label="评估情况" min-width="120">
              <template slot-scope="scope">
                <span>{{
                  `${scope.row.stuAnsweredTotal}/${scope.row.stuTotal}`
                }}</span>
                <span class="active ml10" @click="openCheckProgress(scope.row)"
                  >查看进度</span
                >
              </template>
            </el-table-column>
            <el-table-column label="评估占比" min-width="120">
              <template slot-scope="scope">
                <span>{{ scope.row.stuAnsweredPercent }}</span>
                <!-- <span class="active ml10" @click="emailHint(scope.row)" 
                  >邮件提醒</span
                > -->
              </template>
            </el-table-column>
            <el-table-column label="评估二维码" min-width="140">
              <template slot-scope="scope">
                <span class="active" @click="openErCode(scope.row)">查看</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="140">
              <template slot-scope="scope">
                <span class="active mr20" @click="exportResult(scope.row)">
                  <el-tooltip content="导出结果" popper-class="icon-popper">
                    <i class="operation__download"></i>
                  </el-tooltip>
                </span>
                <span class="active">
                  <el-tooltip content="查看问卷" popper-class="icon-popper">
                    <i class="operation__check" @click="checkQuestionnaire(scope.row)"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </gc-table>

          <div class="df">
            <div class="f1 mr30">
              <div class="title mt30 mb20">
                <span class="title__menu"></span>
                培训整体评分分布 &nbsp; &nbsp; &nbsp; &nbsp;
                <span class="active-default">
                  {{ this.trainingCourseAssessmentStats }}
                </span>
              </div>
              <div class="menu-right mt20">
                <!-- <div v-if="trainingCourseAssessmentStats !== '审批通过'">
                  <span class="instructor-icons__add" @click="openSupplement">
                    <i class="instructor-icons__add__icon"></i>
                    手工补录申请
                  </span>
                </div>
                <div v-else>已完成手工补录</div> -->
              </div>
              <gc-table
                no-list
                class="general__table table-left"
                :tableList="trainingCourseDataList"
              >
                <el-table-column label="评估内容" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.content }}
                    <el-tooltip v-if="scope.row.hint"
                      placement="bottom"
                      popper-class="whiteness"
                      effect="light"
                    >
                      <div slot="content" style="width: 180px">
                        <p class="mt5">
                          {{ scope.row.hint }}
                        </p>
                      </div>
                      <i class="el-icon-question active ml10"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  label="评分（十分制）"
                  prop="score"
                  min-width="100"
                ></el-table-column>
              </gc-table>
            </div>
            <div class="f1">
              <div class="title mt30 mb20">
                <span class="title__menu"></span>
                培训班整体得分分布
              </div>
              <div class="chart" ref="chart"></div>
            </div>
          </div>

          <div class="title mt30 mb20">
            <span class="title__menu"></span>
            讲师评估结果
          </div>
          <gc-table
            class="general__table table-left"
            :list="lecturerAssessmentList"
            :tableList="lecturerAssessmentDataList"
            :spanMethod="
              createSpanMethod(
                {
                  0: 'groupStr',
                  1: 'groupStr',
                  4: 'groupStr'
                },
                lecturerAssessmentDataList
              )
            "
          >
          </gc-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 发起评估后的 二维码dialog -->
    <gc-model
      title="二维码"
      width="298px"
      custom-class="establish__trainingCourse-assessment__er-code"
      :visible="afterErCodeVisible"
      :isShowFooter="false"
      @close="afterErCodeVisible = false"
      @cancel="afterErCodeVisible = false"
      @comfirm="afterErCodeVisible = false"
    >
      <img :src="afterErCodeSrc" alt="" />
      <p class="tac title fz16">请使用口袋银行家或知鸟扫码评估</p>
      <div class="dfc">
        <a
          :href="afterErCodeSrc"
          download="二维码.png"
          class="down-btn theme-bgc"
          >下载</a
        >
      </div>
    </gc-model>

    <!-- 标准问卷 dialog -->
    <gc-model
      :title="questionnaireTitle"
      width="1200px"
      custom-class="establish__trainingCourse-assessment__questionnaire"
      :visible="questionnaireVisible"
      @close="questionnaireVisible = false"
      @cancel="questionnaireVisible = false"
      @comfirm="questionnaireVisible = false"
    >
      <div class="gary-color fz14">
        <template v-for="(item, i) in previewData">
          <p
            v-if="item.answerType === '0'"
            class="title tac fz16"
            :key="item.content"
          >
            {{ item.content }}
          </p>
          <p v-else :key="i">
            <span class="tar w2ch">
              {{ item.index }}
            </span>
            .【{{ topicMap[item.answerType] }}】{{ item.content }}
          </p>
        </template>
      </div>
    </gc-model>

    <!-- 二维码dialog -->
    <gc-model
      title="评估二维码"
      width="298px"
      custom-class="establish__trainingCourse-assessment__er-code"
      :visible="erCodeVisible"
      :isShowFooter="false"
      @close="erCodeVisible = false"
      @cancel="erCodeVisible = false"
      @comfirm="erCodeVisible = false"
    >
      <img :src="erCodeSrc" alt="" />
      <p class="tac title fz16">请使用口袋银行家或知鸟扫码评估</p>
      <div class="dfc">
        <a
          :href="erCodeSrc"
          download="评估二维码.png"
          class="down-btn theme-bgc"
          >下载</a
        >
      </div>
    </gc-model>

    <!-- 查看进度 dialog -->
    <gc-model
      title="查看进度"
      width="1100px"
      custom-class="establish__trainingCourse-assessment__check-progress"
      :visible="checkProgressVisible"
      @close="checkProgressClose"
      @cancel="checkProgressVisible = false"
      @comfirm="checkProgressVisible = false"
    >
      <div class="menu-right icons">
        <span class="icons__upload active" @click="checkProgressExport">
          <i class="icons__upload__icon"></i>
          导出
        </span>
      </div>
      <gc-table
        class="general__table mt20"
        :list="checkProgressList"
        :tableList="checkProgressTableList"
      >
        <el-table-column min-width="218">
          <template slot="header">
            <gc-tablecolumnfilters
              label="完成情况"
              ref="tableColumnfiltersRef"
              className="table__screen__icon"
              :list="expensions"
              confirmText="确定"
              popperClass="circular tac"
              @filter="filter"
              @reset="reset"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            {{ scope.row.createdDate ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column
          label="完成时间"
          min-width="178"
          prop="createdDate"
        ></el-table-column>
      </gc-table>
    </gc-model>

    <!-- 手工补录申请 dialog -->
    <gc-model
      title="手工补录申请"
      width="1200px"
      comfirmText="发送审批"
      custom-class="establish__trainingCourse-assessment__handwork-upplement"
      :visible.sync="handworkSupplementVisible"
      @comfirm="handworkSupplementComfirm"
      @close="handworkSupplementClose"
    >
      <div class="cause df">
        <div class="cause-title necessary-before l1">培训班未使用评估原因</div>
        <div class="f1 ml10">
          <el-input
            type="textarea"
            class="cause-text"
            resize="none"
            v-model="supplementForm.unuseReason"
          ></el-input>
        </div>
      </div>
      <div
        class="title mt30"
        v-if="courseTableList.length && trainTableList.length"
      >
        <span class="title__menu"></span>
        填写培训班评估信息
      </div>
      <gc-table
        :list="courseList"
        :tableList="courseTableList"
        class="general__table mt20 table-left"
        v-if="courseTableList.length"
      >
        <el-table-column label="评分（十分制）" min-width="182">
          <template slot-scope="scope">
            <gc-input-number
              v-model="scope.row.teacherScore"
              :min="0"
              :max="10"
              :step="1"
            />
          </template>
        </el-table-column>
        <el-table-column label="意见与建议" min-width="354">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              class="h-60 mt10 mb10"
              resize="none"
              v-model="scope.row.courseAdvice"
            ></el-input>
          </template>
        </el-table-column>
      </gc-table>

      <gc-table
        :list="trainList"
        :tableList="trainTableList"
        class="general__table mt20 table-left"
        v-if="trainTableList.length"
      >
        <el-table-column label="评分（十分制）" min-width="404">
          <template slot-scope="scope">
            <gc-input-number
              v-model="scope.row[scope.row.score]"
              :min="0"
              :max="10"
              :step="1"
            />
          </template>
        </el-table-column>
        <el-table-column label="意见与建议" min-width="352">
          <template slot-scope="scope">
            <el-input
              type="textarea"
              resize="none"
              class="h-60 mt10 mb10"
              v-model="scope.row[scope.row.advice]"
            ></el-input>
          </template>
        </el-table-column>
      </gc-table>

      <div class="mt30 aic">
        <span class="necessary-before l1">审批链</span>
        <ApprovalChain
          class="f1 ml10"
          @confirm="approvalChainConfirm"
          ref="approvalChain"
        />
      </div>
    </gc-model>

    <!-- 单个评估详情 -->
    <gc-model
      title="培训讲师评估"
      width="800px"
      :visible.sync="assessmentInfoVisible"
    >
      <gc-table
        class="general__table mt20"
        :list="assessmentInfoList"
        :tableList="assessmentInfoTableList"
      >
      </gc-table>
    </gc-model>
    <question-list-view
      :questionnaireCategory="previewCustomData.questionnaireCategory"
      :isOpen="isOpenPreview"
      :isAnonymous="previewCustomData.isAnonymous"
      :title="previewCustomData.templateName" 
      :desc="previewCustomData.templateDescribe" 
      :data="previewCustomData.questions"
      @close="isOpenPreview = false" />
  </div>
</template>

<script>
import {
  CopyObj,
  myFloat,
  resetObj,
  throttle,
  hintFrame,
  handleBlob,
  jsonHeaders,
  formatDate,
  createSpanMethod
} from '@/util/utils'
import { 
  fetchFindClassEvaHistoryPreview
} from "@/fetch/establish";
import QuestionListView from "../QuestionListView"
import echarts from '@/plugins/echarts'
import { loadingMixin } from '@/mixins/component'
export default {
  name: 'TrainingCourseAssessment',
  mixins: [loadingMixin],
  components: { QuestionListView },
  props: {
    params: {
      type: Object | null,
      default: null
    }
  },
  data(vm) {
    return {
      // 培训班 id
      classId: '',
      // 培训班状态
      classStatus: '',
      activeName: 'assessment',
      // 评估数据
      questionnaireData: {},
      //  培训组织内容评估 是否可修改
      trainAssessmentState: false,
      //  培训组织内容评估
      trainAssessment: false,
      // 问卷类型
      questionnaireCategory: '',
      // 问卷标题
      questionnaireTitle: '',
      questionnaireAnonymous: 'N',
      // 发起评估 表格字段数组
      assessmentList: [
        // {
        //   type: 'selection',
        //   selectable: vm.assessmentSelectable
        // },
        {
          label: '授课日期',
          prop: 'courseDate',
          width: '120'
        },
        {
          label: '授课时间',
          prop: 'courseTime',
          width: '120'
        },
        {
          label: '课程名称',
          prop: 'courseName',
          width: '200'
        },
        {
          label: '讲师类型',
          prop: 'teacherTypeName',
          width: '120'
        },
        {
          label: '讲师名称',
          prop: 'teacherName',
          width: '120'
        }
      ],
      // 发起评估 数据字段数组
      assessmentTableList: [],
      // 标准问卷dialog 状态
      questionnaireVisible: false,
      // 预览数据 数组
      previewData: [],
      // 题目类型映射
      topicMap: {
        1: '评分题',
        2: '主观题'
      },
      // 发起评估后的二维码dialog 状态
      afterErCodeVisible: false,
      // 发起评估后的二维码dialog 链接
      afterErCodeSrc: '',
      // 评估记录 页面数据
      recordData: {},
      // 已发起评估 表格字段数组
      alreadyAssessmentList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
      // 已发起评估 表格数据数组
      alreadyAssessmentDataList: [],
      // 培训班评估字段数组
      // trainingCourseList: [],
      // 培训班评估数据数组
      trainingCourseDataList: [
        {
          content: '培训班满意度',
          score: '',
          hint: '培训班整体满意度=整体组织安排平均值*30%+整体课程质量平均值*40%+整体讲师质量平均值*30%'
        },
        {
          content: '培训整体评估',
          score: '',
          hint: ''
        },
        {
          content: '整体课程质量',
          score: '',
          hint: '课程内容质量的平均满意度=课程1评分+…+课程N评分/N'
        },
        {
          content: '整体讲师质量',
          score: '',
          hint: '讲师授课水平的平均满意度=讲师1评分+…+讲师N评分/N'
        }
      ],
      // 讲师评估字段数组
      lecturerAssessmentList: [
        {
          label: '课程名称',
          prop: 'courseName',
          width: '250'
        },
        {
          label: '讲师姓名',
          prop: 'teacherName',
          width: '100'
        },
        {
          label: '授课日期',
          prop: 'courseDate',
          width: '100'
        },
        {
          label: '授课时间',
          prop: 'courseTime',
          width: '100'
        },
        {
          label: '授课评分（十分制）',
          prop: 'teacherScore',
          width: '100'
        }
      ],
      // 讲师评估数据数组
      lecturerAssessmentDataList: [],
      // 查看评估详情 dialog 状态
      assessmentInfoVisible: false,
      // 查看评估详情 dialog 字段数组
      assessmentInfoList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '授课时间',
          prop: 'courseDate',
          width: '120'
        },
        {
          label: '课程名称',
          prop: 'courseName',
          width: '280'
        },
        {
          label: '讲师类型',
          prop: 'teacherTypeName',
          width: '120'
        },
        {
          label: '讲师名称',
          prop: 'teacherName',
          width: '120'
        }
      ],
      // 查看评估详情 dialog 数据数组
      assessmentInfoTableList: [],
      // 二维码弹窗dialog状态
      erCodeVisible: false,
      // 二维码图片 base64字符串
      erCodeSrc: '',
      // 查看进度 dialog 状态
      checkProgressVisible: false,
      // 查看进度 dialog 表格字段数组
      checkProgressList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          prop: 'empName',
          label: '姓名',
          width: '208'
        },
        {
          prop: 'umId',
          label: 'UM号',
          width: '240'
        }
      ],
      // 查看进度 dialog 表格数据数组
      checkProgressTableList: [],
      // 查看进度 dialog 表格数据数组 备份
      checkProgressTableListBack: [],
      // 查看进度 时那行row
      checkProgressRow: {},
      // 筛选完成情况 设置
      expensions: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
      // 手工补录申请 dialog 状态
      handworkSupplementVisible: false,
      // 手工补录申请 dialog 课程表格 字段数组
      courseList: [
        {
          label: '课程',
          prop: 'courseName',
          width: '150'
        },
        {
          label: '讲师',
          prop: 'teacherName',
          width: '140'
        },
        {
          label: '授课日期',
          prop: 'courseDate',
          width: '166'
        },
        {
          label: '授课时间',
          prop: 'courseTime',
          width: '146'
        }
      ],
      // 手工补录申请 dialog 课程表格 数据数组
      courseTableList: [],
      // 手工补录申请 dialog 培训表格 字段数组
      trainList: [
        {
          label: '培训整体',
          prop: 'title',
          width: '382'
        }
      ],
      // 手工补录申请 dialog 培训表格 数据数组
      trainTableList: [],
      trainTableListBack: [
        {
          title: '培训班整体',
          score: 'newAllScore',
          advice: 'newAllAdvice',
          contentScore: '',
          contentAdvice: ''
        },
        {
          title: '整体课程质量',
          score: 'newCourceScore',
          advice: 'newCourceAdvice',
          orgScore: '',
          orgAdvice: ''
        },
        {
          title: '整体讲师质量',
          score: 'newTeacherScore',
          advice: 'newTeacherAdvice',
          recommendScore: '',
          manageAdvice: ''
        }
      ],
      // 手工补录申请 dialog form 数据
      supplementForm: {
        // 培训班未使用评估原因
        unuseReason: '',
        // 审批人um
        auditUsers: '',
        // 审批人名称+um
        auditUsersum: '',
        // 审批人名称
        auditUsersname: ''
      },
      isAlreadyAponsor: false,
      dateEnd: '',
      // 培训班评估结果 状态
      trainingCourseAssessmentStats: '',
      // 工具函数
      createSpanMethod,
      // 发过邮件的评估
      evaIdDict: {},
      charData: {},
      previewCustomData: {},
      isOpenPreview: false
    }
  },
  methods: {
    // 查看培训班可评估项
    initData() {
      const data = { classId: this.classId }
      this.$axios
        .post('/fn/classes/manager/eva/findClassEvaluate', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.questionnaireData = data
            this.assessmentTableList = CopyObj(data.courses)
            const groupStrDict = {}
            this.assessmentTableList.forEach((v) => {
              const item = groupStrDict[v.groupStr]
              if (item) {
                item.courseId = [item.courseId, v.courseId].join(',')
              } else {
                groupStrDict[v.groupStr] = v
              }
            })
            this.trainAssessmentState = data.isEvaOrg === 'Y'
            // 选择问卷类型（默认问卷类型：定制问卷）
            this.questionnaireCategory = data.templateId || 'new_privacy'
            // 是否匿名
            this.questionnaireAnonymous = data.isAnonymity || 'N'
          }
        })
    },
    // 发起评估
    async initiateAssessment() {
      const isGt = await this.isGt()
      if (isGt) {
        return this.$message.warning('培训班超结训过30天，不能发起评估')
      }
      if (!this.findNotAssessment())
        return this.$message.warning('全部内容均已发起评估，请在评估记录中查看')
      const state = this.trainAssessment ? 'Y' : 'N'
      let courses = this.$refs.assessmentTableRef.$children[0].selection
      if (!this.trainAssessment && !courses.length) {
        return this.$message.warning('请选择评估问卷')
      }
      const dict = {}
      courses = courses.filter((v) => {
        if (dict[v.groupStr]) {
          return false
        } else {
          return (dict[v.groupStr] = true)
        }
      })
      const data = {
        classId: this.classId,
        templateId: this.questionnaireCategory,
        courses
      }
      if (this.trainAssessment) {
        const { isEvaOrg, isEvaContent, isEvaAll } = this.questionnaireData
        this._.merge(data, { isEvaOrg, isEvaContent, isEvaAll })
      }
      this.questionnaireTitle =
        this.questionnaireCategory === 'new_custom' ? '标准问卷' : '简化版问卷'
      return this.$axios
        .post('/fn/classes/manager/eva/addClassEva', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.trainAssessment = false
            this.afterErCodeVisible = true
            this.afterErCodeSrc = data
            this.initData()
          }
        })
    },
    // 判断培训班是否超过30天
    isGt() {
      const data = { classId: this.classId }
      return this.$axios
        .post('/fn/classes/manager/checkClassDateFinish', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            return data > 0
          }
        })
    },
    // 查找有没有未评估的
    findNotAssessment() {
      if (this.trainAssessmentState) return true
      const arr = []
      const map = {}
      this.assessmentTableList.forEach((v) => {
        if (!map[v.groupStr]) {
          arr.push(v)
        }
      })
      return !!arr.find((v) => v.isEva === 'Y')
    },
    // 打开预览
    openQuestionnaire() {
      // if (!this.findNotAssessment())
      //     return this.$message.warning(
      //         "全部内容均已发起评估，请在评估记录中查看"
      //     );
      const state = this.trainAssessment ? 'Y' : 'N'
      const courses = this.$refs.assessmentTableRef.$children[0].selection
      const data = {
        classId: this.classId,
        isEvaOrg: state,
        isEvaContent: state,
        isEvaAll: state,
        templateId: this.questionnaireCategory,
        courses
      }
      this.$axios
        .post(
          '/fn/classes/manager/eva/findClassEvaPreview',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.handleQuestionnaire(data)
          }
        })
    },
    tabClick(tab) {
      if (tab.name === 'record') {
        const data = { classId: this.classId }
        this.getList(data)
        this.getChartData()
      } else {
        this.initData()
      }
    },
    getList(data) {
      const p1 = this.$axios
        .post('/fn/classes/manager/eva/findClassEvaDetail', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { courses, newAllScore, newClassScore, newCourceScore, newTeacherScore } =
              data
            const arr = [newAllScore, newClassScore, newCourceScore, newTeacherScore]
            this.recordData = data
            this.lecturerAssessmentDataList = courses
            this.trainingCourseAssessmentStats = data.supplyStatus || ''
            this.trainingCourseDataList.forEach((v, i) => {
              v.score = arr[i]
            })
          }
        })
      const p2 = this.$axios
        .post('/fn/classes/manager/eva/findClassEvaList', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.alreadyAssessmentDataList = data || []
          }
        })
      return Promise.all([p1, p2])
    },
    // 查看评估详情
    openAssessmentInfo(row) {
      let { evaId } = row
      const data = { evaId, classId: this.classId }
      this.$axios
        .post('/fn/classes/manager/eva/listEvaSendDetail', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.assessmentInfoVisible = true
            this.assessmentInfoTableList = data.courses
          }
        })
    },
    // 邮件提醒
    emailHint(row) {
      const { evaId, classStatus } = row
      if (classStatus === '02003') {
        return this.$message.warning('已结训的班不能发起邮件提醒')
      }
      if (this.evaIdDict[evaId]) {
        return this.$message.warning(
          '该评估已发起过邮件提醒，如需再次发送邮件请关闭当前页面重新进入。'
        )
      }
      this.evaIdDict[evaId] = true
      hintFrame('确定邮件提醒未评估人吗？').then(() => {
        const { evaId } = row
        const data = {
          evaId,
          classId: this.classId
        }
        this.$axios
          .post('/fn/classes/manager/eva/addEvaStuMail', data, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success('发送邮件成功')
            }
          })
      })
    },
    // 撤回提示
    backHint(row) {
      hintFrame('撤回后，将会清除本次已评估内容').then(() => {
        const { evaId } = row
        const data = { evaId, classId: this.classId }
        this.$axios
          .post('/fn/classes/manager/eva/deleteSingleEva', data, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.tabClick({ name: 'record' })
            }
          })
      })
    },
    // 导出结果
    exportResult(row) {
      let { evaId } = row
      evaId = evaId || 'ALL'
      const data = { evaId, classId: this.classId }
      this.$axios
        .post('/classFileFunc/downloadClassSingleEva', data, {
          ...jsonHeaders,
          responseType: 'blob'
        })
        .then((res) => {
          handleBlob(res)
        })
    },
    // 打开二维码dialog
    openErCode(row) {
      this.erCodeVisible = true
      const { evaId } = row
      const data = {
        evaId,
        classId: this.classId,
        width: 250,
        height: 250
      }
      this.$axios
        .post(
          '/fn/classes/manager/eva/findSingleEvaQRCode',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.erCodeSrc = data
          }
        })
    },
    // 打开查看进度 dialog
    openCheckProgress(row) {
      this.checkProgressVisible = true
      this.checkProgressRow = row
      const { evaId } = row
      const data = { evaId, classId: this.classId }
      this.$axios
        .post('/fn/classes/manager/eva/listEvaAnswerStu', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.checkProgressTableList = data
            this.checkProgressTableListBack = data
          }
        })
    },
    // 打开查看问卷
    checkQuestionnaire(row) {
      const { classId, evaId, templateId, isAnonymity } = row
      fetchFindClassEvaHistoryPreview({ classId, evaId })
        .then(resData => {
          const templateArr = ['new_custom', 'new_simple']
          if (templateArr.includes(templateId)) {
            // 标准问卷,简化版问卷
            this.questionnaireTitle = templateArr.includes(templateId) ? '标准问卷' : '简化版问卷'
            this.handleQuestionnaire(resData)
          } else { 
            // 自定义问卷
            const questions = []
            if (resData.orgTopics) questions.push(...resData.orgTopics)
            resData.teacherTopics?.forEach(m => questions.push(...m))
            // 处理自定义题目
            resData.customTopics?.forEach(m => {
              // 处理选项排序
              m?.options?.sort((a, b) => Number(a.orderNo) - Number(b.orderNo))
              m.isRequired = Boolean(Number(m.isRequired)) 
            })
            if (resData.customTopics) questions.push(...resData.customTopics)
            this.previewCustomData = {
              questionnaireCategory: templateId,
              isAnonymous: isAnonymity,
              templateId: resData.templateId || '',
              templateName: resData.templateName || '',
              templateDescribe: resData.templateDescribe || '',
              questions
            }
            // 打开自定义问卷预览弹框
            this.isOpenPreview = true
          }
        })
    },
    handleQuestionnaire(data) {
      let results = []
      let i = 1
      ;['orgTopics', 'contentTopics', 'allTopics'].forEach((key) => {
        data[key]?.forEach((v) => {
          if (v.answerType !== '0') {
            v.index = i++
          } else {
            i = 1
          }
          results.push(v)
        })
      })
      data.teacherTopics?.forEach((item) => {
        if (Array.isArray(item)) {
          item.forEach((v) => {
            if (v.answerType !== '0') {
              v.index = i++
            } else {
              i = 1
            }
            results.push(v)
          })
        } else {
          if (item.answerType !== '0') {
            item.index = i++
          } else {
            i = 1
          }
          results.push(item)
        }
      })
      this.previewData = results
      this.questionnaireVisible = true
    },
    // 查看进度 dialog 表格 完成情况 筛选
    filter(list) {
      const state = list.list[0]
      if (state === '1') {
        this.checkProgressTableList = this.checkProgressTableListBack.filter(
          (v) => v.createdDate
        )
      } else {
        this.checkProgressTableList = this.checkProgressTableListBack.filter(
          (v) => !v.createdDate
        )
      }
    },
    // 查看进度 dialog 表格 完成情况 重置
    reset() {
      this.checkProgressTableList = this.checkProgressTableListBack
    },
    // 查看进度 dialog 导出
    checkProgressExport() {
      const { evaId } = this.checkProgressRow
      const data = { evaId, classId: this.classId }
      this.$axios
        .post('/classFileFunc/downloadClassSingleEvaStu', data, {
          ...jsonHeaders,
          responseType: 'blob'
        })
        .then((res) => {
          handleBlob(res)
        })
    },
    // 打开手工补录
    openSupplement() {
      if (this.trainingCourseAssessmentStats === '审批中') {
        return this.$message.warning('手动录入申请正在审批中！')
      } else if (this.trainingCourseAssessmentStats === '审批通过') {
        return this.$message.warning('审批已通过，请勿重复！')
      }
      const data = { classId: this.classId }
      this.$axios
        .post(
          '/fn/classes/manager/eva/findClassEvaluateSupply',
          data,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.handworkSupplementVisible = true
            const { courses, isNewAll, isNewCource, isNewTeacher } = data
            const list = CopyObj(this.trainTableListBack)
            if (isNewTeacher === 'N') {
              list.pop()
            }
            if (isNewCource === 'N') {
              list.splice(1, 1)
            }
            if (isNewAll === 'N') {
              list.splice(0, 1)
            }
            this.trainTableList = list
            this.courseTableList = courses
          }
        })
    },
    // 审批链确认事件
    approvalChainConfirm(data) {
      this._.merge(this.supplementForm, data)
    },
    // 手工补录确认事件
    handworkSupplementComfirm() {
      if (!this.supplementForm.unuseReason) {
        return this.$message.warning('请填写培训班未使用评估原因')
      }
      // 检查评分是否填写
      let flag
      flag = this.courseTableList.some((v, i) => {
        if (v.teacherScore === 0) {
          this.$message.warning(`训班评估信息第${i + 1}行评分未填写`)
          return true
        }
      })
      if (flag) return
      flag = this.trainTableList.some((v) => {
        if (v[v.score] === 0) {
          this.$message.warning(`${v.title}评分未填写`)
          return true
        }
      })
      if (flag) return
      if (!this.supplementForm.auditUsers) {
        return this.$message.warning('请选择审批链')
      }
      const data = CopyObj(this.supplementForm)
      this.trainTableList.forEach((v) => {
        data[v.score] = v[v.score]
        data[v.advice] = v[v.advice]
      })
      data.courses = this.courseTableList
      data.classId = this.classId
      return this.$axios
        .post(
          '/fn/classes/manager/eva/addClassEvaSupplyEoa',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.handworkSupplementVisible = false
            this.$message.success('补录成功')
            this.tabClick({ name: 'record' })
          }
        })
    },
    handworkSupplementClose() {
      resetObj(this.supplementForm)
      this.handworkSupplementVisible = false
    },
    // 培训讲师评估 表格合并发放
    assessmentSpanMethod({ row, column, rowIndex, columnIndex }) {
      const columns = [0, 3, 4, 5]
      if (columns.includes(columnIndex)) {
        let n = 1
        if (
          row.groupStr !==
          (this.assessmentTableList[rowIndex - 1] || {}).groupStr
        ) {
          this.assessmentTableList.slice(rowIndex + 1).some((v) => {
            if (row.groupStr === v.groupStr) {
              return !n++
            } else {
              return true
            }
          })
          return [n, 1]
        }
        return [0, 0]
      }
    },
    // 培训讲师评估 是否可以评估
    assessmentSelectable(row, index) {
      return row.isEva === 'Y'
    },
    // 重置数据
    resetData() {
      this.activeName = 'assessment'
      this.questionnaireData = {}
      this.assessmentTableList = []
      this.trainAssessment = false
      this.trainAssessmentState = false
      this.questionnaireCategory = ''
    },
    getChartData() {
      this.$axios
        .post(
          '/fn/classes/manager/eva/findEvaAll',
          { classId: this.classId },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.charData = data
            this.renderChart()
          }
        })
    },
    // 渲染图表
    renderChart() {
      const self = this
      const { total, zero, one, two, three, four } = this.charData || {}
      const data = [
        {
          name: '0-2分',
          value: zero
        },
        {
          name: '2-4分',
          value: one
        },
        {
          name: '4-6分',
          value: two
        },
        {
          name: '6-8分',
          value: three
        },
        {
          name: '8-10分',
          value: four
        }
      ]
      const chart = this.chart || (this.chart = echarts.init(this.$refs.chart))
      chart.setOption({
        legend: {
          orient: 'vertical',
          right: 20,
          bottom: 20,
          selectedMode: false,
          formatter(value) {
            const item = data.find((v) => v.name === value)
            return [
              `{text|${value}}`,
              `{line|}`,
              `{percentage|${(myFloat(item.value / total) * 100).toFixed()}%}`,
              `${item.value}人`
            ].join('')
          },
          textStyle: {
            rich: {
              text: {
                width: 40
              },
              line: {
                color: 'red',
                width: 0,
                height: 20,
                borderWidth: 1,
                borderColor: '#7d8292'
              },
              percentage: {
                width: 60,
                padding: [0, 0, 0, 20]
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['20%', '50%'],
            label: {
              position: 'center',
              formatter: `评分人数\n{personnel|${total}人}`,
              rich: {
                personnel: {
                  fontSize: 20,
                  height: 30
                }
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            data
          }
        ]
      })
    },
    checkProgressClose() {
      this.$refs.tableColumnfiltersRef.$reset()
      this.checkProgressVisible = false
    },
    doInitThing() {
      const params = this.params || this.$route.params
      if (params.id) {
        this.classId = params.id
        this.dateEnd = params.dateEnd
        this.resetData()
        this.initData()
      }
    }
  },
  computed: {
    isTemplate() {
      return (
        this.questionnaireCategory &&
        this.questionnaireCategory !== 'new_custom' &&
        this.questionnaireCategory !== 'new_simple'
      )
    },
    assessmentDisabled() {
      return this.isAlreadyAponsor || (this.params && formatDate(new Date()) < this.params.dateStart)
    },
    multipleSelectionIsShow() {
      return this.assessmentTableList.every((v) => v.isEva === 'Y')
    }
  },
  activated() {
    this.doInitThing();
  },
  created() {
    this.handworkSupplementComfirm = throttle(this.handworkSupplementComfirm)
    this.initiateAssessment = throttle(this.initiateAssessment)
    if(this.params) {
      this.doInitThing();
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.preview-model .el-dialog__body) {
  padding: 0px !important;
  padding-left: 0px !important;
}
.establish__trainingCourse-assessment {
  .tabs-card {
    .el-card__body {
      padding: 0;
    }
    .el-tabs__content {
      padding: 5px 20px 20px;
    }
    i.hint {
      position: absolute;
      top: 1px;
      right: -23px;
    }
    i.trainingCourseHint {
      position: absolute;
      top: 1px;
    }
    .chart {
      width: 400px;
      height: 192px;
      margin-top: 55px;
    }
  }
  &__questionnaire {
    .el-dialog__body {
      .content {
        min-height: 370px;
      }
    }
    .gary-color p {
      margin-top: 20px;
      span {
        display: inline-block;
      }
    }
  }
  &__er-code {
    img {
      width: 250px;
      height: 250px;
    }
    .el-dialog__footer {
      text-align: center;
    }
  }
  &__handwork-upplement {
    .cause {
      textarea {
        height: 180px;
      }
    }
  }
}
</style>
