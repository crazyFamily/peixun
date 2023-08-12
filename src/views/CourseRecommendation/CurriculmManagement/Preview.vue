<template>
  <div class="course-recommendation__new-course">
    <!-- 进度条 -->
    <gcSteps :active="active" :list="stepList"></gcSteps>

    <!-- 内容 -->
    <div class="content-box">
      <div v-show="active === 0" class="course-info">
        <el-form ref="courseInfoFormRef" label-width="90px">
          <el-form-item label="课程名称">
            <el-input :value="courseInfoForm.courseName" readonly></el-input>
          </el-form-item>
          <el-form-item label="h5页面别名" prop="h5Alias">
            <el-input :value="courseInfoForm.h5Alias" readonly></el-input>
          </el-form-item>
          <el-form-item label="课程属主部门" class="ws dr-label">
            <el-input :value="courseInfoForm.blgOrgName" readonly></el-input>
          </el-form-item>
          <el-form-item label="课程标签">
            <DisabledCurriculumLabel :value="courseInfoForm.courseTagList" />
          </el-form-item>
          <el-form-item label="课程系列" class="relative">
            <el-input :value="courseInfoForm.courseClassifyName" readonly></el-input>
          </el-form-item>
          <el-form-item label="课程关键词" class="ws dr-label">
            <el-input type="textarea" resize="none" class="h-90" readonly :value="courseInfoForm.keyword"></el-input>
            <p class="shallow">最多支持添加10个关键词，每个关键词限制10个字，关键词用“/”隔开，如：信托/资产提升</p>
          </el-form-item>
          <el-form-item label="适用对象">
            <el-input readonly :value="courseInfoForm.courseApply"></el-input>
          </el-form-item>
          <el-form-item label="课程难易程度" class="ws dr-label">
            <el-radio-group :value="courseInfoForm.difficultyLevel" class="dfi fdc">
              <el-radio label="1" class="mb20 mt8">初阶（应知应会基础类/工具物料运用类）</el-radio>
              <el-radio label="2" class="mb20">中阶（业务深度解析类/技能提升熟练运用类/案例分享类）</el-radio>
              <el-radio label="3">高阶（高手训练类或其他）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程上架时间" class="ws dr-label">
            <el-input readonly :value="filterTime(courseInfoForm.upTime)"></el-input>
          </el-form-item>
          <el-form-item label="课程计划下架时间" class="ws dr-label">
            <el-radio-group :value="courseInfoForm.planDownType" class="between wfull dfi">
              <el-radio label="1">季度有效</el-radio>
              <el-radio label="2">半年有效</el-radio>
              <el-radio label="3">年度有效</el-radio>
              <el-radio label="4">
                指定日期
                <el-input class="w-176 ml10" readonly :value="filterTime(courseInfoForm.planDownTime)"></el-input>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程研发人" class="ws dr-label">
            <el-input readonly :value="courseInfoForm.developerUm"></el-input>
          </el-form-item>
          <el-form-item label="转发/分享" class="ws dr-label">
            <el-radio-group :value="courseInfoForm.supportShare">
              <el-radio label="Y" class="mr60">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上架栏目" class="ws dr-label">
            <el-input readonly :value="courseInfoForm.layoutName.join('/')"></el-input>
          </el-form-item>
          <el-form-item label="栏目课程角标" class="ws dr-label">
            <el-input readonly :value="courseInfoForm.cornerMark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active === 1" class="course-upload-preview">
        <el-form ref="courseUploadPreviewFormRef" label-width="70px">
          <el-form-item label="课程封面">
            <el-radio-group :value="courseUploadPreviewForm.coverType">
              <el-radio :label="1" class="mr60">上传封面</el-radio>
              <el-radio :label="2">使用模版</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详情封面" prop="coverList">
            <div>
              <gc-upload
                :size="200"
                single
                disabled
                ref="courseUploadDetailCoverRef"
                :udmpId.sync="courseUploadPreviewForm.detailCoverUdmp"
                :fileName.sync="courseUploadPreviewForm.detailCoverName"
              ></gc-upload>
              <p class="tintColor">推荐比例16 ：9，支持 jpg、png格式，文件大小不超过200k</p>
            </div>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input type="textarea" resize="none" class="h-90" readonly :value="courseUploadPreviewForm.introduce"></el-input>
          </el-form-item>
          <el-form-item label="课程来源" class="ws dr-label">
            <el-input :value="fromValueGetLabel(sourceOptions, courseUploadPreviewForm.source)" readonly></el-input>
          </el-form-item>
          <el-form-item label="课程类型" v-if="courseUploadPreviewForm.source !== SOURCE_KD">
            <el-input :value="fromValueGetLabel(coursewareTypeOptions, courseUploadPreviewForm.coursewareType)" readonly></el-input>
          </el-form-item>
          <el-form-item label="课件上传" v-if="[SOURCE_TMS].includes(courseUploadPreviewForm.source)">
            <div class="mt-20">
              <div v-for="item in courseUploadPreviewForm.fileList" :key="item.udmpId">
                <el-input :value="item.fileName" class="w250 mt20 mr10" readonly></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="课程跳转链接" class="ws dr-label" prop="courseUrl" v-if="courseUploadPreviewForm.source === SOURCE_KD">
            <el-input placeholder="请输入链接地址" :value="courseUploadPreviewForm.courseUrl" />
          </el-form-item>
          <el-form-item label="课程时长">
            <el-input readonly :value="courseUploadPreviewForm.duration">
              <i slot="suffix" class="fontColor mr6">分钟</i>
            </el-input>
          </el-form-item>
          <el-form-item label="课程完成标准(完播率)" class="ws dr-label" v-if="courseUploadPreviewForm.source !== SOURCE_KD">
            <el-input :value="fromValueGetLabel(completePercentOptions, courseUploadPreviewForm.completePercent)" readonly></el-input>
          </el-form-item>
          <el-form-item label="第三方课程id" class="ws dr-label" v-if="[SOURCE_ZN, SOURCE_XC].includes(courseUploadPreviewForm.source)">
            <el-input :value="courseUploadPreviewForm.thirdCourseId" readonly></el-input>
          </el-form-item>
          <el-form-item label="关联考试">
            <div class="exam-wrapper">
              <el-input readonly placeholder="请选择一个考试" v-model="courseUploadPreviewForm.examName"></el-input>
            </div>
          </el-form-item>
          <div v-for="(make, i) in courseUploadPreviewForm.marketList" :key="i">
            <el-form-item label="关联营销物料名称" class="ws dr-label">
              <el-input readonly :value="make.marketName"> </el-input>
            </el-form-item>
            <el-form-item label="关联营销物料链接" class="ws dr-label">
              <el-input readonly :value="make.marketUrl"> </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div v-show="active === 2" class="lecturer-info">
        <div class="card">
          <div class="head">
            <span class="l1 mr10">讲师</span>
          </div>
          <div class="card-list" :style="{ height: cardListHeight }">
            <div class="df card-item" v-for="card in externalTeacherList" :key="card.teacherUm" :style="{ top: card.top + 'px' }">
              <LecturerCard :data="card" />
            </div>
          </div>
        </div>
      </div>
      <div v-show="active === 4" class="exercise-info">
        <el-form ref="exerciseInfoFormRef" :model="exerciseInfoForm" :rules="exerciseInfoRules" label-width="70px">
          <el-form-item label="课程练习">
            <el-switch v-model="exerciseInfoForm.value" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </el-form-item>
          <el-form-item label="题目配置">
            <el-radio-group v-model="courseUploadPreviewForm.radio">
              <el-radio :label="3" class="mr60">题目打乱</el-radio>
              <el-radio :label="6" class="mr60">选项打乱</el-radio>
              <el-radio :label="6">交卷后显示答案提示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出题方式">
            <el-radio-group v-model="courseUploadPreviewForm.radio">
              <el-radio :label="3" class="mr60">自主选题</el-radio>
              <el-radio :label="6">随机抽题 <span class="tintColor">（按课程标签匹配题库）</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="title mt40">
            <div class="title__menu"></div>
            题目信息
          </div>
          <div v-if="courseUploadPreviewForm.radio === 3">
            <p class="mt10 ml15">
              共90题，总分120分
              <span class="tintColor"> （单选题30题，共60分; 多选题30题，共60分; 判断题30题，共60分） </span>
            </p>
            <el-form-item label="每题分值" class="ml10 mt20">
              <div class="df">
                <div class="ml10">
                  <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
                    <template slot="prepend">单选题</template>
                  </el-input>
                  <span class="ml10">题/分</span>
                </div>
                <div class="ml80">
                  <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
                    <template slot="prepend">多选题</template>
                  </el-input>
                  <span class="ml10">题/分</span>
                </div>
                <div class="ml80">
                  <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
                    <template slot="prepend">判断题</template>
                  </el-input>
                  <span class="ml10">题/分</span>
                </div>
              </div>
            </el-form-item>
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
                <span class="icons__upload ml10">
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
            <p class="mt10">共10题，总分100分</p>
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
            <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
              <template slot="prepend">通过分数</template>
            </el-input>
            <span class="ml10">分</span>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active === 3" class="push-info">
        <el-form label-width="70px" ref="pushInfoFormRef">
          <el-form-item label="审批链" required>
            <el-input readonly :value="pushInfoForm.auditUsersName"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeCurrPage()">返回</el-button>
      <el-button class="button-w80-h30" v-show="active !== 0" @click="preStep">上一步</el-button>
      <el-button class="button-w80-h30" type="primary" v-show="active !== 3" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script setup>
import {
  SOURCE_TMS,
  SOURCE_ZN,
  SOURCE_XC,
  SOURCE_KD,
  sourceOptions,
  coursewareTypeOptions,
  completePercentOptions,
} from '@/views/CourseRecommendation/enum'
</script>
<script>
import $ from 'jquery'
import { merge, filterTime, sizeChange, jsonHeaders, closeCurrPage, currentChange, handleUdmpHref, fromValueGetLabel } from '@/util/utils'
import { getOrg } from '../utils'
import gcUpload from '@/components/upload'
import LecturerCard from './components/LecturerCard'
import gcSteps from '../components/gc-steps'
import DisabledCurriculumLabel from '@/components/chunk/DisabledCurriculumLabel'
export default {
  name: 'CRPreviewCourse',
  components: {
    gcSteps,
    gcUpload,
    LecturerCard,
    DisabledCurriculumLabel,
  },
  data() {
    return {
      active: 0,
      stepList: ['课程信息', '课程上传与预览', '讲师信息', '审批'],
      // 课程信息 表单
      courseInfoForm: {
        courseName: '',
        h5Alias: '',
        blgOrgName: '',
        courseTagList: [],
        courseClassifyName: '',
        required: '',
        keyword: '',
        courseApply: '',
        difficultyLevel: '',
        upTime: null,
        planDownType: '',
        planDownTime: null,
        developerName: '',
        developerUm: '',
        supportShare: '',
        courseLayout: [],
        layoutName: [],
        cornerMark: ''
      },
      upTimeOptions: {},
      // 课程信息 上架栏目 数据对象
      columnList: [],
      // 课程上传预览 表单
      courseUploadPreviewForm: {
        coverType: 1,
        coverList: '',
        oldCoverList: [],
        detailCoverUdmp: '',
        detailCoverName: '',
        introduce: '',
        coursewareType: '',
        thirdCourseId: '',
        fileList: [],
        duration: 0,
        completePercent: 0,
        source: '',
        marketList: [
          {
            marketName: '',
            marketUrl: ''
          }
        ],
        examId: null,
        examName: '',
        courseUrl: ''
      },
      // 课件上传 提示 dict
      fileListHintDict: {
        yp: {
          hint: '限制大小20M，音频支持格式：.mp3、.wav',
          accept: '.mp3,.wav',
          size: 200 * 1024 * 1024
        },
        sp: {
          hint: '限制大小300M，视频支持格式：.mp4',
          accept: '.mp4',
          size: 300 * 1024 * 1024
        },
        tw: {
          hint: '限制大小20M，图文支持格式：.pdf',
          accept: '.pdf',
          size: 20 * 1024 * 1024
        }
      },
      // 卡片数据列表
      externalTeacherList: [],

      // 练习信息 form
      exerciseInfoForm: {},
      // 练习信息 form rules
      exerciseInfoRules: {},
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
      // 随机选题 数据数组
      randomTopicTableList: [],
      // 题目模版导入dialog 状态
      topicTemplateImportVisible: false,
      // 推送信息 form
      pushInfoForm: {},
      // 合规自查申明 dialog 状态
      selfExaminationVisible: false,
      // 页面状态
      state: '',
      stateMap: {
        add: '新增课程',
        edit: '修改课程'
      },
      // 培训班id
      courseId: '',
      // 关闭当前页面工具函数
      closeCurrPage,
      // 分页工具函数
      currentChange,
      sizeChange,
      // 工具函数
      fromValueGetLabel,
      // 时间处理函数
      filterTime
    }
  },
  methods: {
    // 获取上架栏目下拉选项
    getColumnList() {
      this.$axios.post('/fn/privatewealth/layout/findLayoutTree', {}, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.columnList = data
        }
      })
    },
    handleCardTop(cardList) {
      cardList.forEach((v, i) => {
        v.i = i
        v.top = (180 + 10) * i + (i + 1) * 20
      })
    },
    nextStep() {
      this.active++
    },
    preStep() {
      this.active--
    },
    // 后台数据转换为前端需要的数据
    backgroundDataToCurrentPageData(data) {
      // 课程信息 数据处理
      merge(this.courseInfoForm, data)
      if (this.courseInfoForm.developerUm && this.courseInfoForm.developerName) {
        this.courseInfoForm.developerUm = `${this.courseInfoForm.developerName}(${this.courseInfoForm.developerUm})`
      }
      this.courseInfoForm.courseLayout = data.courseLayoutList?.map((v) => v.layoutId) || []
      this.courseInfoForm.layoutName = data.courseLayoutList?.map((v) => v.layoutName) || []
      // 课程上传与预览 数据处理
      if (!data.marketList?.length) {
        data.marketList = undefined
      }
      merge(this.courseUploadPreviewForm, data)
      console.log(this.courseUploadPreviewForm, data, '====>')
      this.courseUploadPreviewForm.coverList = [
        {
          udmpId: data.coverUdmp,
          fileName: data.coverName
        }
      ]
      this.courseUploadPreviewForm.oldCoverList = [
        {
          url: handleUdmpHref(data.coverUdmp),
          name: data.coverName,
          uid: data.coverUdmp
        }
      ]
      this.courseUploadPreviewForm.fileList = data.files.filter((v) => v.submodule === 'course_file')
      this.courseUploadPreviewForm.fileList.forEach((v) => {
        v.fileNameBack = v.fileName
      })
      // 讲师信息 数据处理
      data.externalTeacherList.forEach((v) => {
        v.src = handleUdmpHref(v.headUdmp)
      })
      this.handleCardTop(data.externalTeacherList)
      this.externalTeacherList = data.externalTeacherList
      // 推送信息 数据处理
      merge(this.pushInfoForm, data)
      this.pushInfoForm.isPush = this.pushInfoForm.isPush === 'Y'
      this.eoaStatus = data.eoaStatus
    },
    // 清除表单数据
    resetFormData() {
      this.$refs.courseInfoFormRef.resetFields()
      this.$refs.curriculumLabelRef.reset()
      this.$refs.curriculumClassificationRef.$reset()
      this.$refs.courseUploadPreviewFormRef.resetFields()
      this.courseUploadPreviewForm.coverList = []
      this.courseUploadPreviewForm.oldCoverList = []
      this.externalTeacherList = []
      this.$refs.exerciseInfoFormRef.resetFields()
      this.$refs.pushInfoFormRef.resetFields()
    },
  },
  mounted() {
    getOrg().then((res) => {
      this.orgOptions = res
    })
    this.getColumnList()
  },
  activated() {
    console.log(777, this.$route.params)
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.resetFormData()
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.courseId) {
      this.courseId = params.courseId
      this.backgroundDataToCurrentPageData(params)
    }
  },
  computed: {
    cardListHeight() {
      return this.externalTeacherList.length * 210 - 10 + 'px'
    }
  }
}
</script>
<style lang="scss" scoped>
.course-recommendation__new-course {
  padding-top: 20px;
  background-color: #fff;
  .content-box {
    margin: 60px auto 20px;
    .el-form-item {
      margin-bottom: 30px;
    }
    .course-info,
    .course-upload-preview,
    .lecturer-info,
    .push-info {
      width: 670px;
      margin: auto;
    }
  }
}
</style>
