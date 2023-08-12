<template>
  <div class="course-recommendation__examin-management">
    <div v-show="showPage === 0" class="gc-main">
      <!-- 进度条 -->
      <gcSteps :active="active" :list="stepList"></gcSteps>

      <div class="content-box">
        <div v-show="active === 0" class="course-info">
          <el-form ref="examinaInfoFrom" :model="examinaInfo" :rules="examinaInfoRules" label-width="70px">
            <el-form-item label="考试名称" prop="examName">
              <el-input maxlength="30" show-word-limit placeholder="限制30字" :disabled="isDetails" v-model.trim="examinaInfo.examName"></el-input>
            </el-form-item>
            <el-form-item label="机构部门" prop="blgOrgId">
              <gc-select
                w1
                class="padding-0"
                k="orgName"
                v="orgId"
                :disabled="isDetails"
                :options="orgOptions"
                v-model="examinaInfo.blgOrgId"
              ></gc-select>
            </el-form-item>
            <el-form-item label="考卷分类" prop="examType">
              <gc-select
                w1
                class="padding-0"
                :options="examTypeOptions"
                :disabled="isDetails"
                v-model="examinaInfo.examType"
                @change="examTypeChangeHandle"
              ></gc-select>
            </el-form-item>
            <el-form-item label="考试关键词" prop="keywords" class="ws dr-label">
              <el-input
                type="textarea"
                resize="none"
                class="h-90"
                placeholder="请输入关键词"
                v-model="examinaInfo.keywords"
                :disabled="isDetails"
              ></el-input>
              <p class="shallow">最多支持添加10个关键词，每个关键词限制10个字，关键词用“/”隔开，如：信托/资产提升</p>
            </el-form-item>
            <el-form-item label="考试简介" prop="introduce" class="ws dr-label">
              <el-input
                type="textarea"
                resize="none"
                class="h-90"
                placeholder="限制500字"
                maxlength="500"
                v-model="examinaInfo.introduce"
                :disabled="isDetails"
              ></el-input>
            </el-form-item>
            <el-form-item label="关联课程" prop="courseIds" class="ws dr-label">
              <!-- 需求变更：随堂考无需关联课程 -->
              <el-button type="primary" :disabled="isDetails || isQuizzes" @click="showPage = 2">选择课程</el-button>
              <div v-if="examinaInfo.courseIds.length">
                <div class="coure-tag-box" v-for="(item, index) in examinaInfo.courseIds" :key="index">
                  <span>{{ item.courseName }}</span>
                  <i class="el-icon-close" v-if="!isDetails" @click="delCourseIds(index)"></i>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="active === 1" calss="course-info">
          <el-form ref="topicInfoFrom" :model="topicInfo" :rules="topicInfoRules" label-width="70px">
            <el-form-item label="  " label-width="40px" prop="examExerciseType" class="ws dr-label">
              <el-radio-group
                v-model="topicInfo.examExerciseType"
                @change="toggleTitle"
                :disabled="isDetails || disabledFiledArr.includes('examExerciseType')"
              >
                <el-radio label="exerciseProject">添加习题包</el-radio>
                <el-radio label="exercise">添加习题</el-radio>
              </el-radio-group>
              <div v-if="isShowButton">
                <el-button type="primary" :disabled="isDetails" @click="addExampleType">{{
                  currentTitleType === 'exerciseProject' ? '添加关联' : '选择题目'
                }}</el-button>
              </div>
            </el-form-item>
          </el-form>
          <el-card class="search-card" style="border: 0; margin-top: -20px; margin-left: 14 px">
            <el-form ref="form" :inline="true" v-if="currentTitleType === 'exercise'">
              <el-form-item label="题型">
                <gc-select :options="exerciseTypeOptions" v-model="toppicParams.exerciseType" clearable></gc-select>
              </el-form-item>
              <el-form-item label="题目">
                <el-input v-model="toppicParams.exerciseContent" clearable></el-input>
              </el-form-item>
              <el-form-item label="难度">
                <gc-select :options="difficultLevelOptions" v-model="toppicParams.difficultLevel" clearable></gc-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchToppic">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <AddedPackageList
            v-if="currentTitleType === 'exerciseProject'"
            :tableData="exerciseProjectList"
            :isDetails="isDetails"
            :isShowButton="isShowButton"
            :jcNum="jcNumProject"
            :scNum="scNumProject"
            :mcNum="mcNumProject"
            @delExerciseProject="delExerciseProject"
          ></AddedPackageList>
          <gc-table
            v-if="currentTitleType === 'exercise'"
            drop
            row-key="id"
            ref="courseInfoTableRef"
            class="general__table mt20 course-table cus-table-sty"
            :list="examinaInfoList"
            :tableList="examinaInfoTableList"
          >
            <el-table-column label="操作" min-width="60" v-if="isShowButton">
              <template slot-scope="scope">
                <span class="active" :disabled="isDetails" @click="delExaminaList(scope)">移除</span>
              </template>
            </el-table-column>
          </gc-table>
        </div>

        <div v-show="active === 2" class="course-info">
          <el-form ref="rulesSetingFrom" :model="rulesSeting" :rules="rulesSetingRules" label-width="70px">
            <el-form-item label="题目设置" class="ws dr-label">
              <el-checkbox v-model="rulesSeting.upsetExerciseFlag" :disabled="isDetails" label="Y">题目打乱</el-checkbox>
              <el-checkbox v-model="rulesSeting.upsetAnswerFlag" :disabled="isDetails" label="N">选项打乱</el-checkbox>
            </el-form-item>
            <el-form-item label="错题解析" class="ws dr-label">
              <el-radio v-model="rulesSeting.errorAnalysisType" :label="1" :disabled="isDetails">不可看</el-radio>
              <el-radio v-model="rulesSeting.errorAnalysisType" :label="2" :disabled="isDetails">交卷后显示答案</el-radio>
              <el-radio v-model="rulesSeting.errorAnalysisType" :label="3" :disabled="isDetails || isQuizzes">考试开放时间结束后显示答案</el-radio>
            </el-form-item>
            <el-form-item label="出题方式" prop="exerciseMethod" class="ws dr-label" v-if="currentTitleType === 'exercise'">
              <el-radio-group
                v-model="rulesSeting.exerciseMethod"
                :disabled="isDetails || disabledFiledArr.includes('exerciseMethod')"
                @change="exerciseMethodChange"
              >
                <el-radio :label="1">全部题目</el-radio>
                <el-radio :label="2">随机抽题</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="题目数量设置" label-width="85" class="ws dr-label" v-else></el-form-item>
            <gc-table class="general__table mt20 cus-tab-sty" :list="list" :tableList="rulesSeting.exerciseSettingList">
              <el-table-column label="抽题数量" class-name="td-pr0">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'exerciseSettingList.' + scope.$index + '.quantity'"
                    :rules="[
                      ...quantityRule,
                      {
                        validator: (rule, value, callback) => {
                          validateQuantityRuleMax(rule, value, callback, scope.$index)
                        },
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-input :disabled="rulesSeting.exerciseMethod == 1 || isDetails" v-model.number="scope.row.quantity" maxlength="10"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="每题分值" class-name="td-pr0">
                <template slot-scope="scope">
                  <el-form-item :prop="'exerciseSettingList.' + scope.$index + '.exerciseScore'" :rules="exerciseScoreRule">
                    <el-input
                      v-model.number="scope.row.exerciseScore"
                      maxlength="10"
                      :disabled="isDetails || disabledFiledArr.includes('exerciseSettingList')"
                    ></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="总分" class-name="td-pr0">
                <template slot-scope="scope">
                  {{ scope.row.exerciseScore && scope.row.quantity ? parseFloat(scope.row.exerciseScore * scope.row.quantity) : '--' }}
                </template>
              </el-table-column>
            </gc-table>
            <p style="margin: 10px 0; display: flex; justify-content: space-between">
              <span
                >共{{ getSelExaminaInfo().total }}题 | 单选题 {{ getSelExaminaInfo()._singelChoice.length }}题, 多选题
                {{ getSelExaminaInfo()._multipleChoice.length }}题, 判断题 {{ getSelExaminaInfo()._judgeChoice.length }}题</span
              >
              <span>汇总:{{ getGrossScore(rulesSeting.exerciseSettingList) }}分</span>
            </p>
            <el-form-item label="分数线设置" style="margin-bottom: 0" class="ws dr-label"></el-form-item>
            <el-form-item label="及格分数" prop="passScore" class="ws dr-label">
              <el-input
                v-model.number="rulesSeting.passScore"
                maxlength="10"
                :disabled="isDetails || disabledFiledArr.includes('passScore')"
              ></el-input>
            </el-form-item>
            <!-- 需求变更: 随堂考不需要其他设置 -->
            <template v-if="!isQuizzes">
              <!-- <template> -->
              <el-form-item label="其他设置" style="margin-bottom: 0" class="ws dr-label"></el-form-item>
              <el-form-item label="是否支持模拟练习" class="ws dr-label">
                <el-switch v-model="rulesSeting.simulateFlag" @change="changSimulateFlag" :disabled="isDetails"></el-switch>
              </el-form-item>
              <el-form-item label="正式考试开放时间" prop="examTime" class="ws dr-label">
                <!-- 需求变更，放开开始时间的限制，由用户自由控制 :picker-options="gtNow" -->
                <el-date-picker
                  v-model="rulesSeting.examTime"
                  type="datetimerange"
                  align="center"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :disabled="isDetails"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="模拟考试开放时间" v-if="rulesSeting.simulateFlag && rulesSeting.examTime" prop="simulateTimer" class="ws dr-label">
                <el-date-picker
                  v-model="rulesSeting.simulateTimer"
                  type="datetimerange"
                  align="center"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptionsDate"
                  :disabled="isDetails"
                  :default-time="['00:00:00', '00:00:00']"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="考试时长" prop="examDuration" class="ws dr-label">
                <el-input v-model.number="rulesSeting.examDuration" style="width: 350px" :disabled="isDetails">
                  <i slot="suffix">分钟</i>
                </el-input>
              </el-form-item>
              <el-form-item label="尝试次数" prop="examNumber" class="ws dr-label">
                <el-input v-model.number="rulesSeting.examNumber" :disabled="isDetails" style="width: 350px">
                  <i slot="suffix">次</i>
                </el-input>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="cancle">取消</el-button>
        <el-button class="button-w80-h30" @click="submitSave('Y')" v-if="!isDetails && active === 2">保存草稿</el-button>
        <!-- <el-button class="button-w80-h30" @click="submitSave('N')" v-show="active !== 2" v-if="!isDetails">提交</el-button> -->
        <el-button class="button-w80-h30" @click="preStep" v-if="active !== 0">上一步</el-button>
        <el-button class="button-w80-h30" type="primary" @click="submitSave('N')" v-if="!isDetails && active === 2">提交</el-button>
        <el-button class="button-w80-h30" type="primary" v-if="active !== 2" @click="nextStep">下一步</el-button>
      </div>
    </div>

    <div v-show="showPage === 1">
      <ChoiceExercises @cancleChoice="cancleChoice" @acknowledgement="choiceExamin"></ChoiceExercises>
    </div>

    <div v-show="showPage === 2">
      <ChoiceCourse :courseSelList="examinaInfo.courseIds" @cancleChoice="cancleChoice" @acknowledgement="choiceCourse"></ChoiceCourse>
    </div>

    <div v-if="examplePackageDialog">
      <el-dialog
        title="习题包列表"
        :visible.sync="examplePackageDialog"
        width="80%"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <ExamplePackageList
          @selectionPackage="selectionPackage"
          @cancel="examplePackageDialog = false"
          :exerciseProjectIds="topicInfo.exerciseProjectIds"
          :exerciseProjectList="exerciseProjectList"
        ></ExamplePackageList>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import gcSteps from './../../CourseRecommendation/components/gc-steps.vue'
import { getOrg } from './../../CourseRecommendation/utils'
import ChoiceExercises from './ChoiceExercises.vue'
import ChoiceCourse from './ChoiceCourse.vue'
import ExamplePackageList from '../components/examplePackageList.vue'
import AddedPackageList from '../components/addedPackageList.vue'
import { resetObj, jsonHeaders, closeCurrPage, setPageTitle, CopyObj, gtNow } from '@/util/utils'
import { QUIZZES } from '@/views/CourseRecommendation/enum'

export default {
  name: 'CRExaminationAdd',
  components: {
    gcSteps,
    ChoiceExercises,
    ChoiceCourse,
    ExamplePackageList,
    AddedPackageList
  },
  data() {
    let validateQuantityRuleMax = (rule, value, callback, index) => {
      if (value && parseFloat(value) > parseFloat(this.rulesSeting.exerciseSettingList[index].len)) {
        callback(new Error('不能大于总题数'))
      } else {
        callback()
      }
      callback()
    }
    return {
      pickerOptionsDate: {
        disabledDate: (time) => {
          return time.getTime() > new Date(this.rulesSeting.examTime[1]).valueOf()
        }
      },
      gtNow,
      showPage: 0,
      active: 0,
      stepList: ['考试信息', '题目设置', '规则设置'],
      examinaInfo: {
        id: '',
        examName: '',
        blgOrgId: '',
        examType: '',
        keywords: '',
        introduce: '',
        courseIds: []
      },
      examinaInfoRules: {
        examName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入考试名称'
          },
          {
            max: 30,
            trigger: 'blur',
            message: '考试名称最大支持30字'
          }
        ],
        blgOrgId: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择报审部门'
          }
        ],
        examType: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择考卷类型'
          }
        ],
        keywords: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入考试关键词'
          },
          {
            validator: (rule, value, callback) => {
              if (!value) return callback()
              value = value.split('/')
              if (value.length > 10) return callback(new Error('考试关键词最多10个'))
              if (value.some((v) => v.length > 10)) {
                return callback(new Error('每个关键词长度不能大于10'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      // 部门下拉选项
      orgOptions: [],
      examTypeOptions: [
        {
          label: '月考',
          value: 1
        },
        {
          label: '综合考',
          value: 2
        },
        {
          label: '周考',
          value: 3
        },
        {
          label: '随堂考',
          value: 4
        }
      ],
      // 考题设置
      topicInfo: {
        exerciseSortType: '',
        exerciseSort: 1,
        exerciseIds: '',
        examExerciseType: 'exerciseProject',
        exerciseProjectIds: []
      },
      exerciseProjectList: [], // 已添加习题包列表
      exerciseProjectListMirror: [],
      topicInfoRules: {
        examExerciseType: [
          {
            required: true,
            trigger: 'blur',
            message: '请设置题目'
          }
        ]
      },
      exerciseSortTypeOption: [
        {
          value: 1,
          label: '按题型正序排列'
        }
      ],
      exerciseSortOption: [
        {
          value: 1,
          label: '单选-多选-判断'
        },
        {
          value: 2,
          label: '多选-单选-判断'
        },
        {
          value: 3,
          label: '判断-单选-多选'
        }
      ],
      toppicParams: {
        exerciseType: '',
        exerciseContent: '',
        difficultLevel: ''
      },
      examinaInfoList: [
        {
          type: 'component',
          width: '64',
          'class-name': 'drop',
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h('i', {
                  class: 'el-icon-rank'
                })
              }
            }
          }
        },
        {
          type: 'index',
          label: '序号',
          width: '60',
          'class-name': 'table-index'
        },
        {
          label: '题型',
          width: '70',
          prop: 'exerciseType',
          formatter: (row) => row.exerciseType === 'sc' ? '单选题' : row.exerciseType === 'mc' ? '多选题' : row.exerciseType === 'jc' ? '判断题' : row.exerciseType,
        },
        {
          label: '题目',
          width: '150',
          prop: 'exerciseContent'
        },
        {
          label: '选项',
          width: '150',
          prop: 'exerciseOptionsStr'
        },
        {
          label: '答案',
          width: '100',
          prop: 'answer'
        },
        {
          label: '标签',
          width: '100',
          prop: 'exerciseProjectNameStr'
        },
        {
          label: '难度',
          width: '60',
          prop: 'difficultLevel',
          formatter: (row) => row.difficultLevel === 'ry' ? '容易' : row.difficultLevel === 'zd' ? '中等' : row.difficultLevel === 'kn' ? '困难' : row.difficultLevel,
        }
      ],
      // 难易程度选项
      difficultLevelOptions: [
        {
          label: '困难',
          value: 'kn'
        },
        {
          label: '中等',
          value: 'zd'
        },
        {
          label: '容易',
          value: 'ry'
        }
      ],
      exerciseTypeOptions: [
        {
          label: '单选',
          value: 'sc'
        },
        {
          label: '多选',
          value: 'mc'
        },
        {
          label: '判断',
          value: 'jc'
        }
      ],
      examinaInfoTableList: [],
      examinaInfoTableListMirror: [],
      examinaInfoTableListCopy: [],
      rulesSeting: {
        upsetExerciseFlag: false,
        upsetAnswerFlag: false,
        errorAnalysisType: 1,
        exerciseMethod: 2,
        exerciseSettingList: [],
        passScore: '',
        simulateFlag: true,
        simulateStart: '',
        simulateEnd: '',
        examStart: '',
        examEnd: '',
        examDuration: '',
        examNumber: '',
        simulateTimer: '',
        examTime: ''
      },
      rulesSetingRules: {
        exerciseMethod: [
          {
            required: true,
            trigger: 'change',
            message: '请选择出题方式'
          }
        ],
        passScore: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入及格分数'
          },
          {
            validator: (rule, value, callback) => {
              if (!value || this.totalGrade === 0) return callback()
              if (parseFloat(value) <= 0) {
                return callback(new Error(`及格分数不能小于0`))
              }
              if (parseFloat(value) > this.totalGrade) {
                return callback(new Error(`及格分数不能超总分${this.totalGrade}`))
              }
              return callback()
            },
            trigger: 'blur'
          }
        ],
        simulateTimer: [
          {
            required: true,
            trigger: 'change',
            message: '请选择模拟考时间'
          }
        ],
        examTime: [
          {
            required: true,
            trigger: 'change',
            message: '请选择正式考时间'
          }
        ],
        examDuration: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入考试时长'
          }
        ],
        examNumber: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入尝试次数'
          }
        ]
      },
      list: [
        {
          label: '题型',
          prop: 'exerciseType',
          ctx: (row) => {
            return `${row.exerciseName}(共${row.len}题)`
          }
        }
      ],
      quantityRule: [{ required: true, message: '不能为空', trigger: 'blur' }],
      exerciseScoreRule: [{ required: true, message: '不能为空', trigger: 'blur' }],
      validateQuantityRuleMax,
      isCopy: false,
      isDetails: false,
      currentTitleType: 'exerciseProject',
      examplePackageDialog: false,
      disabledFiledArr: [],
      jcNumProject: 0,
      scNumProject: 0,
      mcNumProject: 0,
      isShowButton: true  // 是否显示添加/修改习题按钮
    }
  },
  mounted() {
    this._getOrgDatas()
  },
  activated() {
    let { id, examName, status, pushNum, examStatus, disabledFiledArr = [] } = this.$route.params
    console.log('router ->>', this.$route.params)
    if (id && status) {
      this.examinaInfo.id = id
      if (status === 'details') {
        this.isDetails = true
        this.isCopy = false
        setPageTitle(`详情:${examName}`)
      } else if (status === 'edit') {
        this.isCopy = false
        this.isDetails = false
        this.disabledFiledArr = [...disabledFiledArr]
        setPageTitle(`编辑：${examName}`)
      } else if (status === 'copy') {
        this.isCopy = true
        this.isDetails = false
        setPageTitle(`复制：${examName}`)
      }
      this.queryExamDetail(id)
    } else if (status === 'add') {
      this.isCopy = false
      this.isDetails = false
      setPageTitle(`新增考试`)
      this.reset()
    }
    // 已上架已推送的情况下不可修改习题，查看详情不可修改习题
    if (status === 'details') {
      this.isShowButton = false
    } else if (status === 'edit' && examStatus === '02001' && pushNum > 0) {
      this.isShowButton = false
    }
    this.$wenEvent.$emit('getTiele')
  },
  computed: {
    totalGrade() {
      let _exerciseSettingList = this.rulesSeting.exerciseSettingList
      let total = 0
      _exerciseSettingList.forEach((o) => {
        if (o.exerciseScore && o.quantity) {
          total += o.quantity * o.exerciseScore
        }
      })
      return total
    },
    isQuizzes() {
      return this.examinaInfo.examType === QUIZZES
    }
  },
  methods: {
    queryExamDetail(id) {
      this.$axios.post('/fn/privatewealth/exam/queryExamDetail', { examId: id }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.examinaInfo = {
            id: id,
            examName: data.examName,
            blgOrgId: data.blgOrgId,
            examType: data.examType,
            keywords: data.keywords,
            introduce: data.introduce,
            courseIds: data.courseList
          }
          let tempTopicInfo = {}
          //习题
          if (data.examExerciseType === 'exercise') {
            this.examinaInfoTableList = data.exerciseList || []
            this.examinaInfoTableListMirror = this.examinaInfoTableListCopy = CopyObj(this.examinaInfoTableList)
            tempTopicInfo = {
              examExerciseType: 'exercise',
              exerciseIds: this.examinaInfoTableListCopy.map((o) => {
                return o.id
              }),
              exerciseProjectIds: []
            }
            this.sortExercise()
          } else {
            // 习题包
            this.exerciseProjectList = data.exerciseProjectList || []
            this.setExerciseUnique(this.exerciseProjectList)
            this.exerciseProjectListMirror = this.examinaInfoTableListCopy = CopyObj(this.exerciseProjectList)
            tempTopicInfo = {
              examExerciseType: 'exerciseProject',
              exerciseProjectIds: this.examinaInfoTableListCopy.map((o) => {
                return o.id
              }),
              exerciseIds: ''
            }
          }
          this.topicInfo = Object.assign(
            {
              exerciseSortType: 1,
              exerciseSort: data.exerciseSort
            },
            tempTopicInfo
          )
          this.currentTitleType = data.examExerciseType
          let _simulateTimer = data.simulateStart && data.simulateEnd ? [data.simulateStart, data.simulateEnd] : ''
          let _examTime = data.examStart && data.examEnd ? [data.examStart, data.examEnd] : ''
          let _exerciseSettingList = this.getExerciseSetingList()
          _exerciseSettingList.forEach((item) => {
            let _c = data.exerciseSettingList.find((o) => o.exerciseType === item.exerciseType)
            if (_c) {
              Object.assign(item, _c)
            }
          })
          this.rulesSeting = {
            upsetExerciseFlag: data.upsetExerciseFlag === 'Y',
            upsetAnswerFlag: data.upsetAnswerFlag === 'Y',
            errorAnalysisType: data.errorAnalysisType || '',
            exerciseMethod: data.exerciseMethod || 2,
            exerciseSettingList: _exerciseSettingList,
            passScore: data.passScore || '',
            simulateFlag: data.simulateFlag === 'Y',
            simulateStart: '',
            simulateEnd: '',
            examStart: '',
            examEnd: '',
            examDuration: data.examDuration || '',
            examNumber: data.examNumber || '',
            simulateTimer: _simulateTimer,
            examTime: _examTime
          }
        }
      })
    },
    delExaminaList(scope) {
      if (this.isDetails) return false
      this.examinaInfoTableList.splice(scope.$index, 1)
      for (let i = 0; i < this.examinaInfoTableListCopy.length; i++) {
        if (this.examinaInfoTableListCopy[i].id === scope.row.id) {
          this.examinaInfoTableListCopy.splice(i, 1)
          break
        }
      }
      this.topicInfo.exerciseIds = this.examinaInfoTableListCopy.map((o) => {
        return o.id
      })
      // 考试未推送 进行修改
      if (this.disabledFiledArr.length === 0) {
        this.rulesSeting.exerciseSettingList = this.getExerciseSetingList()
        if (this.rulesSeting.exerciseMethod) {
          this.rulesSeting.exerciseSettingList.forEach((o) => {
            o.quantity = o.len
          })
        }
      } else {
        // 获取题型数量
        this.resetSettingList()
      }
    },
    // 区分不同 选题类型
    getSelExaminaInfo() {
      const { currentTitleType, examinaInfoTableListCopy } = this
      let _singelChoice = [],
        _multipleChoice = [],
        _judgeChoice = []
      if (currentTitleType === 'exercise') {
        _singelChoice = examinaInfoTableListCopy.filter((o) => o.exerciseType === '单选题' || o.exerciseType === 'sc')
        _multipleChoice = examinaInfoTableListCopy.filter((o) => o.exerciseType === '多选题' || o.exerciseType === 'mc')
        _judgeChoice = examinaInfoTableListCopy.filter((o) => o.exerciseType === '判断题' || o.exerciseType === 'jc')
      }
      if (currentTitleType === 'exerciseProject') {
        _singelChoice = new Array(this.scNumProject).fill('')
        _multipleChoice = new Array(this.mcNumProject).fill('')
        _judgeChoice = new Array(this.jcNumProject).fill('')
      }
      return {
        _singelChoice,
        _multipleChoice,
        _judgeChoice,
        total: _singelChoice.length + _multipleChoice.length + _judgeChoice.length
      }
    },

    sortExercise() {
      let type = this.topicInfo.exerciseSort
      if (!type) return
      let _getSelExaminaInfo = this.getSelExaminaInfo()
      let _singelChoice = _getSelExaminaInfo._singelChoice
      let _multipleChoice = _getSelExaminaInfo._multipleChoice
      let _judgeChoice = _getSelExaminaInfo._judgeChoice
      let _sortList = []
      if (type === 1) {
        _sortList = [..._singelChoice, ..._multipleChoice, ..._judgeChoice]
      }
      if (type === 2) {
        _sortList = [..._multipleChoice, ..._singelChoice, ..._judgeChoice]
      }
      if (type === 3) {
        _sortList = [..._judgeChoice, ..._singelChoice, ..._multipleChoice]
      }
      this.examinaInfoTableList = _sortList
    },
    searchToppic() {
      let _examinaInfoTableListCopy = JSON.parse(JSON.stringify(this.examinaInfoTableListCopy))
      this.examinaInfoTableList = this.filterFn(this.toppicParams, _examinaInfoTableListCopy)
    },
    filterFn(condition, data) {
      return data.filter((item) => {
        return Object.keys(condition).every((key) => {
          return item[key].includes(condition[key])
        })
      })
    },
    // 正式考试时间覆盖模拟考试时间
    // examTimeChange(v) {
    //   if (v && v.length && this.rulesSeting.simulateFlag) {
    //     this.rulesSeting.simulateTimer = v
    //   }
    // },
    changSimulateFlag(flag) {
      if (!flag) {
        this.rulesSeting.simulateTimer = null
      }
    },
    cancle() {
      closeCurrPage()
    },
    exerciseMethodChange(v) {
      if (v === 1) {
        this.rulesSeting.exerciseSettingList.forEach((o) => {
          o.quantity = o.len
        })
      }
    },
    validateProjectData() {
      const errors = []
      this.$refs.examinaInfoFrom.validate((valied) => {
        errors[0] = valied ? 0 : '考试信息验证错误'
      })

      this.$refs.topicInfoFrom.validate((valied) => {
        errors[1] = valied ? 0 : '题目设置校验错误'
      })

      this.$refs.rulesSetingFrom.validate((valied) => {
        errors[2] = valied ? 0 : '规则设置验证错误'
      })
      return new Promise((resolve, reject) => {
        this.$nextTick(() => resolve(errors.find((v) => v)))
      })
    },
    submitSave(ifDraft) {
      this.validateProjectData().then((res) => {
        if (res) return this.$message.warning(res)
        let data = this.buildParams()
        this.$axios.post('/fn/privatewealth/exam/saveExamInfo', { data, ifDraft }, jsonHeaders).then((res) => {
          const { code } = res.data
          if (code === 0) {
            if (this.isDetails) {
              this.$message.success(ifDraft === 'N' ? '修改考试成功' : '草稿保存成功')
            } else {
              this.$message.success(ifDraft === 'N' ? '新增考试成功' : '草稿保存成功')
            }
            closeCurrPage()
          }
        })
      })
    },
    buildParams() {
      let params = {
        ...this.examinaInfo,
        ...this.topicInfo,
        ...this.rulesSeting
      }
      // 习题包 exerciseProject 习题 exercise
      if (this.currentTitleType === 'exerciseProject') {
        params.examExerciseType = 'exerciseProject'
        // 习题列表置空
        params.exerciseIds = []
        delete params.exerciseMethod
      } else {
        params.examExerciseType = 'exercise'
        // 习题包列表置空
        params.exerciseProjectIds = []
        // 习题排序有调整
        params.exerciseIds = this.examinaInfoTableList.map(o => o.id)
      }
      params.courseIds = this.examinaInfo.courseIds.map((o) => o.courseId)
      params.upsetExerciseFlag = this.rulesSeting.upsetExerciseFlag ? 'Y' : 'N'
      params.upsetAnswerFlag = this.rulesSeting.upsetAnswerFlag ? 'Y' : 'N'
      params.simulateStart = this.rulesSeting.simulateTimer && this.rulesSeting.simulateTimer.length ? this.rulesSeting.simulateTimer[0] : null
      params.simulateEnd = this.rulesSeting.simulateTimer && this.rulesSeting.simulateTimer.length ? this.rulesSeting.simulateTimer[1] : null
      params.examStart = this.rulesSeting.examTime && this.rulesSeting.examTime.length ? this.rulesSeting.examTime[0] : null
      params.examEnd = this.rulesSeting.examTime && this.rulesSeting.examTime.length ? this.rulesSeting.examTime[1] : null
      params.id = this.examinaInfo.id || null
      params.errorAnalysisType = this.rulesSeting.errorAnalysisType || null
      params.simulateFlag = this.rulesSeting.simulateFlag ? 'Y' : 'N'
      if (this.isCopy) params.id = null
      return params
    },
    // 习题 -> 加入综合考试
    choiceExamin(v) {
      this.examinaInfoTableList.push(...v)
      // 去重
      const exerciseMap = new Map()
      this.examinaInfoTableList = this.examinaInfoTableList?.filter(item => {
        return !exerciseMap.has(item.id) && exerciseMap.set(item.id, 1)
      })
      this.examinaInfoTableListMirror = this.examinaInfoTableListCopy = CopyObj(this.examinaInfoTableList)
      this.topicInfo.exerciseIds = this.examinaInfoTableListCopy.map((o) => {
        return o.id
      })
      this.sortExercise()
      this.showPage = 0
      // 考试未推送 进行修改
      if (this.disabledFiledArr.length === 0) {
        this.rulesSeting.exerciseSettingList = this.getExerciseSetingList()
        if (this.rulesSeting.exerciseMethod) {
          this.rulesSeting.exerciseSettingList.forEach((o) => {
            o.quantity = o.len
          })
        }
      } else {
        // 获取题型数量
        this.resetSettingList()
      }
    },
    choiceCourse(v) {
      this.examinaInfo.courseIds = v
      this.showPage = 0
    },
    delCourseIds(index) {
      if (this.isDetails) return false
      this.examinaInfo.courseIds.splice(index, 1)
    },
    cancleChoice() {
      this.showPage = 0
    },
    // 处理 rulesSeting.exerciseSettingList
    getExerciseSetingList() {
      let _getSelExaminaInfo = this.getSelExaminaInfo()
      let _singelChoice = _getSelExaminaInfo._singelChoice.length
      let _multipleChoice = _getSelExaminaInfo._multipleChoice.length
      let _judgeChoice = _getSelExaminaInfo._judgeChoice.length
      let _exerciseSettingList = []
      if (_singelChoice > 0) {
        _exerciseSettingList.push({
          exerciseType: 'sc',
          exerciseName: '单选题',
          quantity: '',
          quanexerciseScoretity: '',
          total: '',
          len: _singelChoice
        })
      }
      if (_multipleChoice > 0) {
        _exerciseSettingList.push({
          exerciseType: 'mc',
          exerciseName: '多选题',
          quantity: '',
          quanexerciseScoretity: '',
          total: '',
          len: _multipleChoice
        })
      }
      if (_judgeChoice > 0) {
        _exerciseSettingList.push({
          exerciseType: 'jc',
          exerciseName: '判断题',
          quantity: '',
          quanexerciseScoretity: '',
          total: '',
          len: _judgeChoice
        })
      }
      return _exerciseSettingList
    },
    toggleTitle(name) {
      if (name === 'exerciseProject') {
        this.currentTitleType = 'exerciseProject'
        this.selectionPackage(this.exerciseProjectListMirror)
      } else {
        this.currentTitleType = 'exercise'
        this.choiceExamin(this.examinaInfoTableListMirror)
      }
    },
    addExampleType() {
      const { currentTitleType } = this
      if (currentTitleType === 'exerciseProject') {
        this.examplePackageDialog = true
      }
      if (currentTitleType === 'exercise') {
        this.showPage = 1
      }
    },
    // 习题包 -> 加入综合考试
    selectionPackage(selected) {
      this.setExerciseUnique(selected)
      this.exerciseProjectList = [...selected]
      this.exerciseProjectListMirror = this.examinaInfoTableListCopy = CopyObj(selected)
      this.topicInfo.exerciseProjectIds = selected.map(({ id }) => id)
      this.examplePackageDialog = false
      // 考试未推送 进行修改
      if (this.disabledFiledArr.length === 0) {
        this.rulesSeting.exerciseSettingList = this.getExerciseSetingList()
        if (this.rulesSeting.exerciseMethod) {
          this.rulesSeting.exerciseSettingList.forEach((o) => {
            o.quantity = o.len
          })
        }
      } else {
        // 获取题型数量
        this.resetSettingList()
      }
    },
    delExerciseProject(row) {
      if (this.isDetails) return false
      this.exerciseProjectList = this.exerciseProjectList.filter((item) => item.id !== row.id)
      this.setExerciseUnique(this.exerciseProjectList)
      this.examinaInfoTableListCopy = CopyObj(this.exerciseProjectList)
      this.topicInfo.exerciseProjectIds = this.exerciseProjectList.map(({ id }) => id)
      // 考试未推送 进行修改
      if (this.disabledFiledArr.length === 0) {
        this.rulesSeting.exerciseSettingList = this.getExerciseSetingList()
        if (this.rulesSeting.exerciseMethod) {
          this.rulesSeting.exerciseSettingList.forEach((o) => {
            o.quantity = o.len
          })
        }
      } else {
        // 获取题型数量
        this.resetSettingList()
      }
    },
    resetSettingList() {
      const { _singelChoice, _multipleChoice, _judgeChoice } = this.getSelExaminaInfo()
      if (this.rulesSeting.exerciseMethod) {
        this.rulesSeting.exerciseSettingList.forEach((o) => {
          o.quantity = o.len
          if (o.exerciseType === 'sc') {
            o.len = _singelChoice.length
          }
          if (o.exerciseType === 'jc') {
            o.len = _judgeChoice.length
          }
          if (o.exerciseType === 'mc') {
            o.len = _multipleChoice.length
          }
          console.log('o', o)
        })
      }
    },
    // 去重后统计数量
    setExerciseUnique(list) {
      if (list.length === 0) return
      this.scNumProject = this.mcNumProject = this.jcNumProject = 0
      // 注： 这里的过滤是无效的
      let idArray = list
        .map((item) => item.exerciseList)
        .filter((item) => item)
        .flat(1)
      // 不影响原有逻辑上重新对数据进行处理
      idArray = this._filterIdArray(idArray)
      const res = this._.uniqWith(idArray, this._.isEqual)
      console.log('idArray', res, idArray, list)
      res.forEach((item) => {
        if (item.exerciseType === 'sc') {
          this.scNumProject += 1
        }
        if (item.exerciseType === 'mc') {
          this.mcNumProject += 1
        }
        if (item.exerciseType === 'jc') {
          this.jcNumProject += 1
        }
      })
    },
    _filterIdArray(datas) {
      let resultDatas = new Map()
      datas.forEach((data) => {
        resultDatas.set(data.id, data)
      })
      return Array.from(resultDatas.values())
    },
    getGrossScore(list) {
      const res = list.reduce((pre, curr) => {
        pre += (curr.quantity || 0) * (curr.exerciseScore || 0)
        return pre
      }, 0)
      return res
    },
    handleClose() {
      this.examplePackageDialog = false
    },
    nextStep() {
      const { active, isDetails } = this
      if (isDetails) {
        this.active++
      } else {
        if (active === 0) {
          this.$refs.examinaInfoFrom.validate((valied) => {
            if (valied) {
              this.active++
            } else {
              this.$message.warning('考试信息验证错误')
            }
          })
        } else {
          this.$refs.topicInfoFrom.validate((valied) => {
            if (valied) {
              this.active++
            } else {
              this.$message.warning('题目设置校验错误')
            }
          })
        }
      }
      this.resetToppicParams()
    },
    preStep() {
      this.active--
      this.resetToppicParams()
    },
    // 清空 题目设置-习题查询
    resetToppicParams() {
      if (this.topicInfo.examExerciseType === 'exercise') {
        this.toppicParams = {
          exerciseType: '',
          exerciseContent: '',
          difficultLevel: ''
        }
        this.searchToppic()
      }
    },
    _getOrgDatas() {
      getOrg().then((res) => {
        this.orgOptions = res
      })
    },
    reset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.$nextTick(() => {
        this.$refs.examinaInfoFrom.clearValidate()
      })
      this._getOrgDatas()
    },
    examTypeChangeHandle(value) {
      if (value === QUIZZES) {
        this.examinaInfo.courseIds = []
        this.rulesSeting.errorAnalysisType = 1
        this.rulesSeting.simulateFlag = false
        this.rulesSeting.examTime = []
        this.rulesSeting.simulateTimer = []
        this.rulesSeting.examDuration = null
        this.rulesSeting.examNumber = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.course-recommendation__examin-management {
  background: #fff;
  .content-box {
    margin: 60px auto 20px;
    .course-info {
      width: 670px;
      margin: auto;
    }
  }
  .coure-tag-box {
    line-height: 20px;
    background: #b2b2b2;
    margin-top: 5px;
    padding: 0 5px;
    overflow: hidden;
    i {
      float: right;
      margin-top: 5px;
      cursor: pointer;
    }
  }
  .cus-sty {
    display: flex;
    .gc-select {
      padding: 0;
    }
  }
  .cus-tab-sty {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

:deep() {
  .el-date-editor .el-range-separator {
    line-height: 22px;
  }
  .cus-tab-sty {
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .cus-table-sty .el-table__cell {
    .cell.el-tooltip {
      span {
        margin-bottom: 15px;
      }
    }
  }
  .flex-item {
    .el-form-item__content {
      display: flex;
    }
    .arrow {
      margin: 0 10px;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
}
</style>
