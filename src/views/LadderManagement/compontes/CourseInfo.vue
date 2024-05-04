<template>
  <div class="LadderManagement__CourseInfo">
    <el-dialog title="课程详情" :visible="isDialogShow" width="1200px" isAppend @close="closeHandle" :isShowFooter="false">
      <el-tabs v-model="tabActive" class="nav-tab">
        <el-tab-pane label="课程信息" name="courseDetail">
          <el-form class="courseDetail__form" label-width="84px" ref="courseDetailFormRef" :model="courseDetailForm" :rules="courseDetailRules">
            <el-form-item label="课程名称" prop="courseName">
              <el-input style="width:600px;" v-model="courseDetailForm.courseName" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属机构" prop="orgName" :show-message="false">
              <el-input style="width:600px;" v-model="courseDetailForm.orgName" disabled></el-input>
            </el-form-item>
            <el-form-item label="课程来源" prop="courseType">
              <el-radio-group class="is-required-container" v-model="courseDetailForm.courseType" disabled>
                <el-radio label="05002">内部</el-radio>
                <el-radio label="05003">外部</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="适用对象" class="content_right__application" prop="applicableTargetDTOList">
              <div v-for="(item,index) in courseDetailForm.applicableTargetDTOList" :key="index" class="content_right__application__tag">
                <el-cascader :options="options" :value="[item.channelType,item.keyJobs,item.trainSeries, item.childSeries].filter(v=>v)" :props="cascderProp" disabled style="margin-bottom: 10px;width:600px;"></el-cascader>
              </div>
            </el-form-item>
            <el-form-item label="业务条线" prop="businessLine">
              <gc-select
                v-if="$store.state.userInfo.blgStripLine === systemConfigParameters().defaultBusiType"
                disabled
                class="p0 course-classify"
                style="width: 600px"
                :options="courseClassifyOptions"
                v-model="courseDetailForm.businessLine"
              ></gc-select>
              <CurriculumClassification
                v-else
                :tagType="3"
                style="width:600px;"
                :disabled="true"
                :blgStripLine="$store.state.userInfo.blgStripLine"
                v-model="courseDetailForm.businessLine"
              >
              </CurriculumClassification>
            </el-form-item>
            <el-form-item label="课程标签" prop="courseTag">
              <CurriculumLabel
                v-if="$store.state.userInfo.blgStripLine === systemConfigParameters().defaultBusiType"
                :tree="caseTagOptions"
                style="width: 600px"
                disabled
                :courseTag="courseDetailForm.courseTag"
              >
              </CurriculumLabel>
              <CurriculumLabel
                :tagType="4"
                v-else
                :blgStripLine="$store.state.userInfo.blgStripLine"
                v-model="courseDetailForm.courseTag"
                disabled="true"
              ></CurriculumLabel>
            </el-form-item>
            <el-form-item label="课程介绍">
              <el-input type="textarea" class="h-90" style="width: 600px;" resize="none" v-model="courseDetailForm.courseDescribe" disabled></el-input>
            </el-form-item>
            <el-form-item label="课件">
              <div class="case-items">
                <div class="case-item tintColor" v-for="(item, i) in courseDetailForm.fileInformationDTOList" :key="i">
                  <el-input style="width:450px;" :value="item.fileName" disabled></el-input>
                  <!-- <span class="case-size ml10">文件大小：{{ item.fileSize }}M</span> -->
                  <span class="active ml10 w50" @click="handleDownloadFile(item)">下载</span>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <ExternalTeacher v-if="courseDetailForm.courseType === '05003'" :value="externalTeacherValue" :list="courseDetailForm.ladderExternalTeacherDTOList" disabled />
        </el-tab-pane>
        <el-tab-pane label="授权信息" name="authorRecord">
          <el-form v-model="authorRecordForm" inline>
            <el-form-item label="讲师信息">
              <el-input style="width:300px;" class="inline-block" placeholder="请输入讲师姓名/UM号" v-model.trim="authorRecordForm.teacherUm">
              </el-input>
            </el-form-item>
            <div class="buttons fr">
              <el-button @click="searchAuthorRecord" class="button-w80-h30" type="primary">查询</el-button>
              <el-button @click="resetAuthorRecord" class="button-w80-h30">重置</el-button>
            </div>
          </el-form>
          <div class="menu-right">
            <span class="instructor-icons__upload" @click="exportAuthorRecordList"><i class="instructor-icons__download__icon"></i>导出表格</span>
          </div>
          <table-pagination :list="authorRecordList" :tableList="authorRecordTableList" :queryForm="authorRecordForm" :getList="queryAuthorRecordList" ref="authorRecordPagination">
          </table-pagination>
        </el-tab-pane>
        <el-tab-pane label="使用情况" name="useInfo">
          <el-form v-model="useInfoForm" inline>
            <el-form-item>
              <el-form-item label="举办日期">
                <el-date-picker class="w-120" v-model="useInfoForm.dateStart" type="date" placeholder="选择日期" :clearable="false" :picker-options="startPickerOptions" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至" class="mr10">
                <el-date-picker class="w-120" v-model="useInfoForm.dateEnd" type="date" placeholder="选择日期" :clearable="false" :picker-options="endPickerOptions" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item label="培训班信息" class="ml30">
              <el-input style="width:300px;" class="inline-block" placeholder="请输入培训班编号/名称" v-model.trim="useInfoForm.classInfo">
              </el-input>
            </el-form-item>
            <div class="buttons fr">
              <el-button @click="searchUseInfo" class="button-w80-h30" type="primary">查询</el-button>
              <el-button @click="resetuseInfo" class="button-w80-h30">重置</el-button>
            </div>
          </el-form>
          <div class="menu-right">
            <span class="instructor-icons__upload" @click="exportuseInfo"><i class="instructor-icons__download__icon"></i>导出表格</span>
          </div>
          <table-pagination :list="useInfoList" :tableList="useInfoTableList" :queryForm="useInfoForm" :getList="queryuseInfoList" ref="userInfoPagination">
          </table-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFileAsAlink, formatDate, filterObj, resetObj, arrToTree, systemConfigParameters } from '@/util/utils'
import {
  fetchFindCourseDetail,
  fetchListGrantLecturerInfo,
  fetchExportGrantLecturerInfo,
  fetchListGrantClassInfo,
  fetchExportGrantClassInfo
} from '@/fetch/laddercourses'
import { fetchListPlanDict } from '@/fetch/public'
import ExternalTeacher from './ExternalTeacher'
import { fetchListTags } from '@/fetch/caseCenter'
import CurriculumLabel from '@/views/CurriculumManagement/components/CurriculumLabel.vue'
import CurriculumClassification from '../../CurriculumManagement/components/CurriculumClassification.vue'
import { fileDownload } from '@/util/udmp'
export default {
  name: 'CourseInfo',
  components: {
    CurriculumLabel,
    ExternalTeacher,
    CurriculumClassification
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    course: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      options: [],
      cascderProp: {
        value: 'dataEncode',
        label: 'dataValue',
        children: 'childPlanDict',
        checkStrictly: true
      },
      externalTeacherValue: [],
      isDialogShow: false,
      courseDetailForm: {},
      tabActive: 'courseDetail',
      // 表单验证规则对象
      courseDetailRules: {
        courseName: [{ required: true }],
        orgName: [{ required: true }],
        courseType: [{ required: true }],
        applicableTargetDTOList: [{ required: true }],
        courseTag: [{ required: true }],
        businessLine: [{ required: true }]
      },
      useInfoForm: {
        dateStart: '',
        dateEnd: '',
        courseId: this.course.courseId,
        blgStripLine: this.course.blgStripLine
      },
      authorRecordForm: {
        currPage: 1,
        pageSize: 10,
        courseInfo: this.course.courseId
      },
      authorRecordTableList: [],
      useInfoTableList: [],
      authorRecordList: [
        {
          width: '226',
          label: '课程名称',
          prop: 'courseName'
        },
        {
          width: '120',
          label: '授权讲师',
          prop: 'teacherNameAndUm'
        },
        {
          width: '220',
          label: '授权讲师所在机构',
          prop: 'blgOrgName'
        },
        {
          width: '120',
          label: '授权时间',
          prop: 'createdDate'
        },
        {
          width: '120',
          label: '授权开始日期',
          prop: 'authStartTime'
        },
        {
          width: '120',
          label: '授权截止日期',
          prop: 'authEndTime'
        },
        {
          width: '160',
          label: '操作人',
          prop: 'createdByName'
        }
      ],
      useInfoList: [
        {
          width: '120',
          label: '培训班编号',
          prop: 'classId'
        },
        {
          width: '226',
          label: '培训班名称',
          prop: 'className'
        },
        {
          width: '226',
          label: '举办单位',
          prop: 'orgName'
        },
        {
          width: '180',
          label: '举办日期',
          prop: 'holdTime'
        },
        {
          width: '160',
          label: '讲师',
          prop: 'teacherName'
        },
        {
          width: '120',
          label: '课程评分',
          prop: 'classScore',
          type: 'tablecolumnfilters',
          labelKey: 'scoreList',
          list: [
            {
              label: '0-8.0',
              value: '0-8.0'
            },
            {
              label: '8.0-8.6',
              value: '8.0-8.6'
            },
            {
              label: '8.6-9.2',
              value: '8.6-9.2'
            },
            {
              label: '9.2-9.8',
              value: '9.2-9.8'
            },
            {
              label: '9.8-10',
              value: '9.8-10'
            }
          ]
        },
        {
          width: '90',
          label: '评分人数',
          prop: 'evaluateNumber'
        }
      ],
      startPickerOptions: {
        disabledDate: time => {
          if (this.useInfoForm.dateEnd) {
            return !(formatDate(time) <= this.useInfoForm.dateEnd)
          }
          return false
        }
      },
      endPickerOptions: {
        disabledDate: time => !(formatDate(time) >= this.useInfoForm.dateStart)
      },
      tagsList: [],
      courseClassifyOptions: [],
      caseTagOptions: [],
      systemConfigParameters
    }
  },
  methods: {
    closeHandle() {
      this.$emit('update:show', false)
    },
    dataQuery() {
      this.tabActive = 'courseDetail'
      this.resetAuthorRecord()
      this.resetuseInfo()
      fetchFindCourseDetail({
        data: {
          courseId: this.course.courseId,
          module: this.course.module
        }
      }).then(res => {
        this.courseDetailForm = res
        if (this.$store.state.userInfo.blgStripLine === systemConfigParameters().defaultBusiType) {
          this.initCourseTag()
        }
      })
    },
    exportuseInfo() {
      this.useInfoForm.tip = 'course'
      fetchExportGrantClassInfo({ request: filterObj(this.useInfoForm) })
    },
    exportAuthorRecordList() {
      this.authorRecordForm.tip = 'course'
      fetchExportGrantLecturerInfo({ request: this.authorRecordForm })
    },
    queryAuthorRecordList() {
      this.authorRecordForm.tip = 'list'
      fetchListGrantLecturerInfo({ request: this.authorRecordForm }).then(
        res => {
          const { list, total } = res || {}
          this.authorRecordTableList = list
          this.authorRecordForm.total = total
        }
      )
    },
    queryuseInfoList() {
      this.useInfoForm.tip = 'list'
      fetchListGrantClassInfo({ request: filterObj(this.useInfoForm) }).then(
        res => {
          const { list, total } = res || {}
          this.useInfoTableList = list
          this.useInfoForm.total = total
        }
      )
    },
    resetuseInfo() {
      resetObj(this.useInfoForm,{
        dateStart: '',
        dateEnd: '',
        courseId: this.course.courseId,
        blgStripLine: this.course.blgStripLine,
      })
      this.$refs.userInfoPagination?.resetFilters()
      this.searchUseInfo()
    },
    resetAuthorRecord() {
      this.authorRecordForm = this.$options.data.call(this).authorRecordForm
      this.searchAuthorRecord()
    },
    searchUseInfo() {
      this.authorRecordForm.currPage = 1
      this.queryuseInfoList()
    },
    searchAuthorRecord() {
      this.authorRecordForm.currPage = 1
      this.queryAuthorRecordList()
    },
    async handleDownloadFile(row) {
      try {
        downloadFileAsAlink(await fileDownload(row.udmpId))
      } catch (error) {}
    },
    async _initcaData() {
      let { trainSeries, keyJobs } = await fetchListPlanDict({
        line: this.$store.state.userInfo.blgStripLine,
        type: '01001'
      })
      keyJobs = keyJobs.map(item => {
        item.childPlanDict = trainSeries
        return item
      })
      this.options = keyJobs
      if (this.$store.state.userInfo.blgStripLine === systemConfigParameters().defaultBusiType) {
        this.getAllFilter()
      }
    },
    // 获取 业务条线、课程标签 下拉选项
    async getAllFilter() {
      const data = await fetchListTags({ data: { blgStripLine: this.$store.state.userInfo.blgStripLine, tagType: 5 } })
      this.tagsList =
        data?.map(v => ({
          value: v.tagId,
          tagId: v.tagId,
          label: v.tagName,
          tagName: v.tagName,
          tagLevel: v.tagLevel,
          parentTagId: v.parentTagId
        })) || []
      this.courseClassifyOptions = this.tagsList.filter(v => v.tagLevel === '1')
    },
    initCourseTag() {
      let selectItem = this.courseClassifyOptions.find(item => item.value === this.courseDetailForm.businessLine)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      } else {
        this.courseDetailForm.businessLine = ''
      }
      this.caseTagOptions = newArr
    }
  },
  mounted() {
    this._initcaData()
  },
  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
        if (n) this.dataQuery()
      }
    }
  }
}
</script>
<style lang="scss">
.LadderManagement__CourseInfo {
}
.courseDetail__form {
  width: 700px;
  margin: 0 auto;
}

.case-item {
  position: relative;
  display: flex;
  margin-top: 20px;
}
.case-items .case-item:first-child {
  margin-top: 0px;
}
</style>
<style lang="scss" scoped>
.course-classify :deep(.el-select),
.course-classify :deep(.el-input) {
  width: 100% !important;
}
</style>