<template>
  <div class="curriculumManagement__internalCurriculum">
    <div class="curriculumManagement__internalCurriculum__wrapper" v-show="showIndex === 0">
      <el-card class="search-card">
        <el-form ref="form" :model="queryForm" :inline="true">
          <el-form-item class="institution-item" label="机构">
            <gc-institution v-model="queryForm.blgStripLine" :orgUrl="APIAllTree"> </gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch">含下属机构</el-checkbox>
          </el-form-item>
          <el-form-item>
            <gc-input label="课程信息" v-model="queryForm.courseInfo"></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input label="创建人" v-model="queryForm.umOrName" placeholder="请输入创建人姓名/UM号"></gc-input>
          </el-form-item>
          <el-form-item  label="课程分类">
            <gc-select
              v-if="blgStripLine === LINE_LS"
              class="w-200"
              :options="courseClassifyOptions"
              @change="changeCaseClassify($event)"
              v-model="queryForm.courseClassifyId"
            ></gc-select>
            <el-cascader
              v-else
              clearable
              v-model="queryForm.courseClassifyId"
              :options="courseClassifyOptions"
              :props="{ value: 'tagId', label: 'tagName' }"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="课程标签">
            <el-cascader
              clearable
              v-if="blgStripLine === LINE_LS"
              :options="tagOptions"
              :props="cascaderProps"
              collapse-tags
              @visible-change="setEmptyContent"
              v-model="queryForm.courseTagIds"
              ref="multipleCascaderRef"
            >
            </el-cascader>
            <el-select v-else multiple v-model="queryForm.courseTagIds" collapse-tags>
              <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <div class="search-card__button">
            <el-button @click="query" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form>
      </el-card>

      <el-card class="mt10">
        <div class="menu-right">
          <span class="instructor-icons__add" @click="openAddCurriculumt">
            <i class="instructor-icons__add__icon"></i>
            新增
          </span>
          <span class="instructor-icons__del" @click="delCurriculum">
            <i class="instructor-icons__del__icon"></i>
            删除
          </span>
          <span class="instructor-icons__upload" @click="addCurriculumVisible = true">
            <i class="instructor-icons__upload__icon"></i>
            批量新增
          </span>
          <span class="instructor-icons__download" @click="exportTable">
            <i class="instructor-icons__download__icon"></i>
            导出
          </span>
        </div>
        <gc-table class="general__table" ref="curriculumTableRef" v-loading="loadingTable" :list="curriculumList" :tableList="curriculumTableList">
          <template>
            <el-table-column min-width="170" label="课程" prop="courseName"></el-table-column>
            <el-table-column min-width="180" label="机构" prop="orgName"> </el-table-column>
            <el-table-column min-width="110">
              <template slot="header">
                <gc-tablecolumnfilters
                  label="是否通用课程"
                  ref="tablecolumnfilters"
                  className="table__screen__icon"
                  :list="[
                    { label: '是', value: 'Y' },
                    { label: '否', value: 'N' }
                  ]"
                  confirmText="确定"
                  popperClass="circular"
                  @filter="commonFilter($event, queryForm, 'isCommonCourse', getCurriculumList, 'filter')"
                  @reset="commonFilter($event, queryForm, 'isCommonCourse', getCurriculumList)"
                  radio
                >
                </gc-tablecolumnfilters>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.isCommonCourse === 'Y' ? '是' : scope.row.isCommonCourse === 'N' ? '否' : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="此课程授课次数" min-width="120" prop="lecturesNum">
              <template slot-scope="scope">
                <span class="active" @click="openCouseTeachNumber(scope.row)"> {{ scope.row.lecturesNum }} </span>
              </template>
            </el-table-column>
            <el-table-column label="授课评分" min-width="110" prop="courseScore"></el-table-column>
            <el-table-column label="课程分类" show-overflow-tooltip min-width="226" prop="courseClassifyName"></el-table-column>
            <el-table-column label="课程标签" min-width="212" class-name="coursetagname">
              <template slot-scope="scope">
                <div v-if="scope.row.courseTagNameList.length < 3">
                  <template v-for="(tag,index) in scope.row.courseTagNameList">
                    <span class="coursetagname__tag" :key="index" v-if="tag">
                      {{ tag }}
                    </span>
                  </template>
                </div>
                <span v-else v-for="tagIndex in 2" class="coursetagname__tag" :key="tagIndex">
                  {{ scope.row.courseTagNameList[tagIndex] }}
                </span>
                <el-tooltip v-if="scope.row.courseTagNameList.length >= 3" class="coursetagname" placement="bottom" popper-class="coursetagname " effect="light">
                  <div slot="content">
                    <template v-for="(tag,tagIndex) in scope.row.courseTagNameList">
                      <span class="coursetagname__tag" :key="tagIndex" v-if="tag">
                        {{ tag }}
                      </span>
                    </template>
                  </div>
                  <div>
                    <span class="coursetagname__tag circle">
                      +{{ scope.row.courseTagNameList.length - 2 }}
                    </span>
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="课程录入人" min-width="200" prop="createdByName"></el-table-column>
            <el-table-column min-width="100" label="课程录入日期" prop="createdByDate"></el-table-column>
            <el-table-column min-width="90" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
                  <div slot="content" class="tooltip__operation">
                    <span class="active" @click="openChangeCurriculum(scope.row, true)">查看</span>
                    <span class="active" @click="openChangeCurriculum(scope.row, false)">修改</span>
                  </div>

                  <el-button class="button-48-24">操作</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
        </gc-table>
        <gc-pagination
          :total="total"
          layout="prev, pager, next,slot, sizes"
          prev-text=""
          next-text=""
          :page-sizes="[10, 20]"
          :page-size="queryForm.pageSize"
          :current-page="queryForm.currPage"
          @sizeChange="sizeChange($event, queryForm, getCurriculumList)"
          @currentChange="currentChange($event, queryForm, getCurriculumList)"
          class="between"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </el-card>
    </div>
    <!-- 新增面授课程 -->
    <div v-show="showIndex === 1">
      <el-card class="curriculumManagement__internalCurriculum__newAdd">
        <el-form :disabled="disabled" ref="addNewCurriculumFormRef" :model="addNewCurriculumForm" label-width="70px" :rules="addNewCurriculumRules">
          <el-form-item label="课程名称" prop="courseName">
            <el-input placeholder="请输入" v-model="addNewCurriculumForm.courseName" :maxlength="33" :disabled="curriculumDisabled"></el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <el-col :span="10">
              <el-form-item prop="blgStripLine" label="条线分类" required v-if="$store.state.userInfo.blgStripLine !== 'JF'">
                <el-select v-model="addNewCurriculumForm.blgStripLine" @change="blgStripLineChange('addNewCurriculumForm')" :disabled="curriculumDisabled">
                  <el-option v-for="item in blgOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="hide" v-if="$store.state.userInfo.blgStripLine !== 'JF'">-</el-col>
            <el-col :span="13">
              <el-form-item label="部门" prop="blgOrg">
                <el-select v-if="!curriculumDisabled" v-model="addNewCurriculumForm.blgOrg">
                  <el-option v-for="item in blgOrgOptions" :key="item.orgId" :label="item.orgName" :value="item.orgId"> </el-option>
                </el-select>
                <el-select v-else v-model="addNewCurriculumForm.orgName" :disabled="curriculumDisabled"> </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label=" ">
            <el-col :span="6">
              全行通用课程
              <el-checkbox :disabled="!isSuper" class="ml10" v-model="addNewCurriculumForm.isCommonCourse"></el-checkbox>
            </el-col>
            <el-col :span="4">
              是否评估
              <el-checkbox :disabled="!isSuper" class="ml10" v-model="addNewCurriculumForm.isEvaluate"></el-checkbox>
            </el-col>
          </el-form-item>
          <el-form-item label="课程分类" class="relative" required="" prop="courseClassify">
            <gc-select
              v-if="blgStripLine === LINE_LS"
              class="p0"
              :disabled="disabled"
              :options="courseClassifyOptions"
              @change="changeCaseClassify($event, 'add')"
              v-model="addNewCurriculumForm.courseClassify"
            ></gc-select>
            <CurriculumClassification
              v-else
              :disabled="disabled"
              :blgStripLine="$store.state.userInfo.blgStripLine"
              v-model="addNewCurriculumForm.courseClassify"
            >
            </CurriculumClassification>
          </el-form-item>
          <el-form-item label="课程标签" required="" prop="courseTag">
            <CurriculumLabel
              v-if="blgStripLine === LINE_LS"
              :disabled="disabled"
              :tree="caseTagOptions"
              :courseTag="addNewCurriculumForm.courseTag"
              @change="courseTagChange($event, 'addNewCurriculumForm', 'addNewCurriculumFormRef')"
              :preced-rules="labelPrecedRules"
            >
            </CurriculumLabel>
            <CurriculumLabel
              v-else
              :blgStripLine="$store.state.userInfo.blgStripLine"
              :disabled="disabled"
              :courseTag="addNewCurriculumForm.courseTag"
              @change="courseTagChange($event, 'addNewCurriculumForm', 'addNewCurriculumFormRef')"
              :preced-rules="labelPrecedRules"
            >
            </CurriculumLabel>
          </el-form-item>
          <el-form-item label="适用对象" prop="courseApply">
            <el-input :maxlength="66" v-model="addNewCurriculumForm.courseApply"></el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="courseIntro">
            <el-input
              type="textarea"
              resize="none"
              :maxlength="1000"
              class="curriculumManagement__internalCurriculum__newAdd__textarea"
              v-model="addNewCurriculumForm.courseIntro"
            ></el-input>
          </el-form-item>
          <el-form-item label="课件上传">
            <UploadData :disabled="disabled" :showDownload="disabled || curriculumDisabled" v-model="addNewCurriculumForm.files" />
          </el-form-item>
        </el-form>
        <div class="curriculumManagement__internalCurriculum__newAdd__buttons">
          <el-button class="button-w80-h30" @click="handleBack">返回</el-button>
          <el-button :disabled="disabled" class="button-w80-h30" type="primary" @click="addCurriculumt('addNewCurriculumFormRef', 'addNewCurriculumForm', true)"
            >提交</el-button
          >
        </div>
      </el-card>
    </div>

    <!-- 批量新增课程 dialog -->
    <InstructorBatchImport
      title="批量新增课程"
      :visible="addCurriculumVisible"
      @close="addCurriculumVisible = false"
      @cancel="addCurriculumVisible = false"
      @comfirm="addCurriculumComfirm"
      @change="commonFileInputChange($event, addCurriculumtData, 'file')"
      @templateDownload="templateDownload('/common/file/download/internalCourse')"
    />
    <!-- 授课明细弹窗 -->
    <CouseTeachDetail 
      :show.sync="isShowCourseTeachDetail" 
      courseType="Internal" 
      :data-info="couseTeachRow" 
      :course-id="selectedCouseId || ''"></CouseTeachDetail>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  merge,
  CopyObj,
  resetObj,
  throttle,
  arrToTree,
  sizeChange,
  downHeaders,
  jsonHeaders,
  dataHeaders,
  commonFilter,
  closeCurrPage,
  currentChange,
  handleDownload,
  fileImportHint,
  templateDownload,
  blgStripLineMaping,
  blgStripLineOptions,
  commonFileInputChange,
  getBlgStripLineOptions,
  getCurriculumTree
} from '../../util/utils'
import { fetchListTags } from '@/fetch/caseCenter'
import UploadData from './components/UploadData.vue'
import CurriculumLabel from './components/CurriculumLabel.vue'
import CouseTeachDetail from './components/CouseTeachDetail.vue'
import CurriculumClassification from './components/CurriculumClassification.vue'
import { APIAllTree } from '@/fetch/public'
import { LINE_LS } from '@/util/constants'
import { fetchListEngagedCourseTag  } from '@/fetch/curriculumManagement'
export default {
  name: 'InternalCurriculumManagement',
  components: {
    CurriculumClassification,
    CurriculumLabel,
    UploadData,
    CouseTeachDetail
  },
  data() {
    return {
      // 显示哪个div
      showIndex: 0,
      // 课程数据总条数
      total: 0,
      // 搜索表单
      queryForm: {
        // 机构条线
        blgStripLine: [],
        // 机构id
        blgOrg: '',
        // 非必须, 课程信息
        courseInfo: '',
        // 课程类型
        courseType: '',
        // 创建人
        umOrName: '',
        isGotSubBranch: false,
        isCommonCourse: false,
        currPage: 1,
        pageSize: 10,
        courseClassifyId: [],
        courseTagIds: []
      },
      // pagesize 改变处理事件
      sizeChange,
      // 页码改变处理函数
      currentChange,
      // 课程表格字段
      curriculumList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          width: '54',
          label: '序号'
        }
      ],
      // 课程表格 数据数组
      curriculumTableList: [],
      // 类型分类 options
      courseTypeOptions: [
        {
          label: '阶梯课程',
          value: '02001'
        },
        {
          label: '非阶梯课程',
          value: '02000'
        }
      ],
      // 添加新课程的form表单
      addNewCurriculumForm: {
        // 机构条线
        blgStripLine: '',
        // 机构id
        blgOrg: '',
        // 课程名字
        courseName: '',
        // 02000:非阶梯课程:02001:阶梯课程
        courseType: '',
        // 课程适用对象
        courseApply: '',
        // 课程介绍
        courseIntro: '',
        // 课程分类id
        courseClassify: '',
        // 课程标签id;多个用逗号隔开
        courseTag: '',
        // Y:公共课程;N:非公共,默认为N
        isCommonCourse: '',
        // Y:需要评估;N:不需要评估,默认为Y
        isEvaluate: '',
        // 部门名称
        orgName: '',
        files: []
      },
      // 修改课程时 禁用表单
      disabled: false,
      // 修改课程的form表单
      changeCurriculumForm: {
        // 课程id
        courseId: '',
        // 机构条线
        blgStripLine: '',
        // 机构id
        blgOrg: '',
        // 课程名字
        courseName: '',
        // 02000:非阶梯课程:02001:阶梯课程
        courseType: '',
        // 课程适用对象
        courseApply: '',
        // 课程介绍
        courseIntro: ''
      },
      // 上传资料 form表单
      curriculumUploadDataForm: {
        // 课程id
        courseId: '',
        // 课程名称
        courseName: '',
        //  课程分类id;变动时填写,
        courseClassify: '',
        // 课程标签id,多个试,逗号隔开;变动时填写,
        courseTag: '',
        // 课程分类
        courseClassify: '',
        // 上传的文件数组
        files: [],
      },
      // 表单验证规则对象
      addNewCurriculumRules: {
        blgStripLine: [
          {
            required: true,
            message: '请选择课程分类',
            trigger: 'change'
          }
        ],
        blgOrg: [{ required: true, message: '请选择部门' }],
        courseName: [
          {
            required: true,
            message: '请输入课程名称',
            trigger: 'blur'
          }
        ],
        courseApply: [
          {
            required: true,
            message: '请输入适用对象',
            trigger: 'blur'
          }
        ],
        courseIntro: [{ required: true, message: '请输入简介', trigger: 'blur' }],

        courseClassify: [
          {
            required: true,
            message: '请选择课程分类',
            trigger: 'change'
          }
        ],
        courseTag: [{ required: true, message: '请添加标签' }]
      },
      // 上传资料form 验证规则
      curriculumUploadDataRules: {
        courseClassify: [
          {
            required: true,
            message: '请选择课程分类',
            trigger: 'change'
          }
        ],
        courseTag: [{ required: true, message: '请添加标签' }],
        files: [{ type: 'array', required: true, message: '请上传资料' }]
      },
      // 条线 options
      blgOptions: [],
      // 部门 options
      blgOrgOptions: [],
      commonFileInputChange,
      // 新增批量课程 dialog 状态
      addCurriculumVisible: false,
      // 新增批量课程文件存储对象
      addCurriculumtData: {},
      // 传递给 下载组件 的数据对象
      row: {},
      // 深拷贝函数
      CopyObj,
      templateDownload,
      commonFilter,
      state: '',
      APIAllTree,
      // 是否展开授课明细
      isShowCourseTeachDetail: false,
      // 授课内容
      couseTeachRow: {},
      // 选择的课程id
      selectedCouseId: null,
      // 课程名是否可被修改
      curriculumDisabled: false,
      // 课程分类 options
      courseClassifyOptions: [],
      // 选择标签的下拉框数据
      tagOptions: [],
      loadingTable: false,
      blgStripLine: this.$store.state.userInfo.blgStripLine,
      LINE_LS,
      tagsList: [],
      cascaderProps: { value: 'value', label: 'label', multiple: true },
      caseTagOptions: []
    }
  },
  methods: {
    // 课程查询事件
    query() {
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 课程搜索重置事件
    reset() {
      this.queryForm = this.$options.data.call(this).queryForm
      if (this.blgStripLine === this.LINE_LS) {
        this.$nextTick(() => {
          this.tagOptions = []
        })
      }
      this.getCurriculumList()
    },
    handleQueryForm() {
      const data = CopyObj(this.queryForm)
      if (data.blgStripLine.length > 0) {
        if (data.blgStripLine.length > 1) {
          data.orgId = data.blgStripLine.slice(-1)[0]
          data.blgStripLine = data.blgStripLine[0]
        } else {
          data.blgStripLine = data.blgStripLine[0]
          data.orgId = ''
        }
      } 
      else {
        data.blgStripLine = ''
      }
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      if (!data.isCommonCourse) {
        Reflect.deleteProperty(data, 'isCommonCourse')
      }
      data.searchFrom = 'courseModule'
      if (this.blgStripLine === this.LINE_LS) {
        data.courseClassifyId = Array.isArray(data.courseClassifyId) ? data.courseClassifyId[0] : data.courseClassifyId
        if(data.courseTagIds && data.courseTagIds.length) {
          // courseTagIds为空，可能getCheckedNodes不为空
          data.courseTagIds = this.$refs.multipleCascaderRef?.getCheckedNodes().map(v => v.value) || []
        }
      } else {
        data.courseClassifyId = data.courseClassifyId.slice(-1)[0] || ''
      }
      return data
    },
    // 获取课程数据
    getCurriculumList() {
      const data = this.handleQueryForm()
      this.loadingTable = true
      this.$axios.post('/fn/course/internal/searchInternalCourseList', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          data.list.forEach((v) => {
            v.createdDate = v.createdDate.split('T')[0]
          })
          this.curriculumTableList = data.list
          this.curriculumTableList.forEach(v=>{
            v.courseTagNameList = v.courseTagName?.split(';') || []
          })
          this.total = data.total
        }
      }).finally(()=>{
        this.loadingTable = false
      })
    },
    // 删除课程
    delCurriculum() {
      const selection = this.$refs.curriculumTableRef.$children[0].selection
      if (selection.length < 1) {
        return this.$nextTick(() => {
          this.$message.warning('请勾选课程')
        })
      }
      this.$alert('确定删除此课程？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const courseIdList = selection.map((v) => v.courseId)
            this.$axios.post('/fn/course/internal/deleteInternalCourseByCourseId', { courseIdList }, jsonHeaders).then((res) => {
              if (res.data.code === 0) {
                this.$message.success('删除成功')
              }
              this.getCurriculumList()
            })
          }
        })
        .catch((err) => err)
    },
    // 导出课程
    exportTable() {
      const data = this.handleQueryForm()
      this.$axios.post('/fn/course/internal/reportInternalCourseList', { data }, downHeaders).then(handleDownload)
    },
    // 课程类型 确定事件
    applyRankFilter(list) {
      this.queryForm.courseType = list.list[0]
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 课程类型 重置事件
    applyRankReset(list) {
      this.queryForm.courseType = ''
      this.queryForm.currPage = 1
      this.getCurriculumList()
    },
    // 等待用户信息加载完成再获取数据
    delayGetData() {
      setTimeout(() => {
        if (this.$store.state.userInfo.blgStripLine) {
          this.getCurriculumList()
          if (this.blgStripLine !== this.LINE_LS) {
            this.getAllTag()
          }
        } else {
          this.delayGetData()
        }
      }, 100)
    },
    // 查询 所有部门
    getBlgOrgOptions(form) {
      const { blgStripLine } = form
      if (!blgStripLine) {
        this.blgOrgOptions = []
        return
      }
      this.$axios.post('/fn/user/selectTree', { module: 'courseModule', busiType: blgStripLine }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { orgList } = data[0] || {}
          orgList.forEach((v) => {
            v.label = v.orgName
            v.value = v.orgId
            v.busiType = v.blgStripLine
          })
          this.blgOrgOptions = orgList
        }
      })
    },
    // 条线分类 change 事件
    blgStripLineChange(form) {
      this.getBlgOrgOptions(this[form])
    },
    // 打开新增课程界面
    openAddCurriculumt() {
      const blgStripLine = this.$store.state.userInfo.blgStripLine
      resetObj(this.addNewCurriculumForm)
      this.$nextTick(() => {
        this.$refs.addNewCurriculumFormRef.clearValidate()
      })
      if (blgStripLine === 'JF') {
        this.addNewCurriculumForm.blgStripLine = 'JF'
      }
      this.getBlgOrgOptions({ blgStripLine })
      this.disabled = false
      this.curriculumDisabled = false
      this.showIndex = 1
      this.addNewCurriculumForm.isEvaluate = true
    },
    // 新增 修改 课程课程公共函数
    addCurriculumt(ref, form, flag) {
      this.$refs[ref].validate((validated) => {
        if (validated) {
          const data = CopyObj(this[form])
          const blgStripLine = blgStripLineOptions.find((v) => v.label === data.blgStripLine)?.value
          if (blgStripLine) {
            data.blgStripLine = blgStripLine
          }
          data.courseType = data.courseType ? this.courseTypeOptions[0].value : this.courseTypeOptions[1].value
          if (flag) {
            data.isCommonCourse = data.isCommonCourse ? 'Y' : 'N'
            data.isEvaluate = data.isEvaluate ? 'Y' : 'N'
          }
          let url, msg
          if (this.curriculumDisabled) {
            url = '/fn/course/internal/updateCourseInfoById'
            msg = '修改'
          } else {
            url = '/fn/course/internal/addInternalCourse'
            msg = '新增'
          }
          this.$axios.post(url, { data }, jsonHeaders).then((res) => {
            const { code } = res.data
            if (code === 0) {
              if (this.state === 'course') {
                this.state = ''
                closeCurrPage(this.$route.name)
              } else {
                this.$message.success(`${msg}课程成功`)
                this.showIndex = 0
                this.getCurriculumList()
              }
            }
          })
        }
      })
    },
    // 打开修改课程界面
    openChangeCurriculum(row, disabled) {
      const { blgStripLine, courseId } = row
      this.getBlgOrgOptions({ blgStripLine })
      const form = this.addNewCurriculumForm
      form.courseId = courseId
      this.$axios.post('/fn/course/internal/searchCourseInfoById', { data: { blgStripLine, courseId } }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          resetObj(form)
          merge(form, data)
          form.courseType = data.courseType === this.courseTypeOptions[0].value ? true : false
          form.isCommonCourse = data.isCommonCourse === 'Y' ? true : false
          form.isEvaluate = data.isEvaluate === 'Y' ? true : false
          if (!disabled) {
            this.curriculumDisabled = true
          }
          this.disabled = disabled
          this.showIndex = 1
          if (this.blgStripLine === this.LINE_LS) {
            let selectItem = this.courseClassifyOptions.find(item => item.value === this.addNewCurriculumForm.courseClassify)
            if(!selectItem) {
              this.addNewCurriculumForm.courseClassify  = ''
            } else {
              let newArr = []
              newArr.push(selectItem)
              arrToTree(newArr, this.tagsList)
              newArr = newArr[0]?.children || []
              this.caseTagOptions = newArr
            }
          }
          this.$nextTick(() => {
            this.$refs.addNewCurriculumFormRef.clearValidate()
          })
        }
      })
    },
    // 上传界面确定事件
    uploadDataConfirm() {
      this.$refs.curriculumUploadDataFormRef.validate((valied) => {
        if (valied) {
          this.submit()
        }
      })
    },
    submit() {
      let data = CopyObj(this.curriculumUploadDataForm)
      const files = data.files
      delete data.files
      const courseInfo = data
      data = { courseInfo, files }
      return this.$axios.post('/fn/course/internal/sendCourseInfoToEoA', data, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.$message.success('上传成功')
          this.getCurriculumList()
          this.showIndex = 0
        }
      })
    },
    // 课程标签组件 change事件
    courseTagChange(value, form, ref) {
      this[form].courseTag = value
      this.$refs[ref].validateField('courseTag')
    },
    // 批量新增确定事件
    addCurriculumComfirm() {
      if (this.addCurriculumtData.file) {
        const data = new FormData()
        Object.keys(this.addCurriculumtData).forEach((key) => {
          data.append(key, this.addCurriculumtData[key])
        })
        this.$axios.post('/courseFileFunc/internal/batchImport', data, dataHeaders).then((res) => {
          if (res.data.code == 0) {
            this.$nextTick(() => {
              fileImportHint(res.data)
            })
          }
        })
      }
      this.addCurriculumVisible = false
    },
    // 返回 事件
    handleBack() {
      if (this.state !== 'course') {
        this.showIndex = 0
      } else {
        this.state = ''
        closeCurrPage(this.$route.name)
      }
    },
    // 更新日期显示
    updateDataRanderHandle(row) {
      if (!row.updatedByDate) return ''
      const createdBydate = row.createdByDate.split(' ')[0]
      const updatedByDate = row.updatedByDate.split(' ')[0]
      if (createdBydate === updatedByDate) return ''
      return updatedByDate
    },
    // 展开课程授课明细
    openCouseTeachNumber(row) {
      this.couseTeachRow = row
      this.selectedCouseId = row.courseId
      this.isShowCourseTeachDetail = true
    },
    // 获取使用过的标签
    async getAllTag() {
      const tagOptions = await fetchListEngagedCourseTag({
        data: {
          blgStripLine: this.blgStripLine
        }
      })
      tagOptions.forEach(v => {
        v.label = v.tagName
        v.value = v.tagId
      })
      this.tagOptions = tagOptions
    },
    // 课程标签组件 change事件
    courseTagIdsChange(value, form, ref) {
      this[form].courseTagIds = value
    },
    changeCaseClassify(val, add) {
      let selectItem = this.courseClassifyOptions.find(item => item.value === val)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      if (add) {
        this.addNewCurriculumForm.courseTag = ''
        this.caseTagOptions = newArr
      } else {
        this.queryForm.courseTagIds = []
        this.$nextTick(() => {
          this.tagOptions = newArr
        })
      }
    },
    labelPrecedRules() {
      if(!this.addNewCurriculumForm.courseClassify) {
        this.$message.warning('请先选择课程分类')
        return false
      }
      return true
    },
    // 设置数据为空时的方法
    setEmptyContent(n) {
      if (n) {
        this.$nextTick(() => {
          const emptyEle = this.$refs.multipleCascaderRef.popperElm.querySelector('.el-cascader-menu__empty-text')
          if (emptyEle) {
            emptyEle.innerText = '请先选择分类'
          }
        })
      }
    }
  },
  mounted() {
    // 初始设置用户的UM进行创建人查询
    this.queryForm.umOrName = this.$store.state.userInfo.umId
    this.delayGetData()
    getBlgStripLineOptions('courseModule').then(async (data) => {
      this.blgOptions = data
      switch(this.blgStripLine) {
        // 降序
        case this.LINE_LS:
          // 零售获取课程分类及课程标签
          const data = await fetchListTags({ data: { blgStripLine: this.blgStripLine, tagType: 5 } })
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
          this.$refs.multipleCascaderRef && (this.$refs.multipleCascaderRef.$el.querySelector('.el-input').style.width = '350px')
          break
        default:
          getCurriculumTree(1, this.$store.state.userInfo.blgStripLine).then((data) => {
            this.courseClassifyOptions = data
          })
      }
    })
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.openAddCurriculumt()
    }
  },
  created() {
    this.submit = throttle(this.submit)
  },
  computed: {
    isSuper() {
      let roleIds = this.$store.state.userInfo.roleIds
      roleIds = typeof roleIds === 'string' ? roleIds.split(',') : roleIds
      return roleIds?.includes('10000') || roleIds?.includes('11000')
    }
  }
}
</script>

<style lang="scss">
.curriculumManagement__internalCurriculum {
  .el-input__inner {
    height: 30px !important;
  }
  &__newAdd {
    padding: 10px 0;
    .el-form {
      width: 666px;
      margin: 0 auto;
      > .el-form-item {
        margin-bottom: 30px;
      }
    }

    .el-select {
      width: 100%;
    }
    &__textarea textarea {
      height: 182px;
    }
    &__buttons {
      width: 180px;
      margin: 0 auto;
    }

    &__tag-box {
      min-height: 30px;
      padding-top: 4px;
      border-top: 1px solid #e0e1e3;
      overflow: hidden;
      &__wrapper {
        position: relative;
        display: flex;
        top: -10px;
        padding-bottom: 4px;
        flex-wrap: wrap;
        border: 1px solid #e0e1e3;
        border-top: none;
      }
      &__item {
        margin-top: 10px;
        padding: 2px 10px;
        height: 20px;
        background-color: #f7f8fa;
        color: #424656;
        border-radius: 2px;
        line-height: 17px;
      }
    }
  }
  &__curriculumInfo {
    &__items {
      &__item {
        display: flex;
        margin-bottom: 30px;
        &__left {
          width: 55px;
          margin-right: 20px;
          color: #24002c;
        }
        &__right {
          flex: 1;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .el-dialog__body {
      padding: 30px 24px !important;
    }
  }
  &__uploadData .change-position {
    .el-form-item__error {
      position: absolute;
      left: 0;
      top: 27px;
      text-align: right;
    }
  }
}
</style>
<style lang="scss" scoped>
.coursetagname {
  .coursetagname__tag {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    color: #909399;
    line-height: 22px;
    padding: 0 8px;
    margin: 10px 0px 0 10px;
    background: #f4f4f5;
  }
  .circle {
    border-radius: 11px;
    padding: 0 4px;
  }
}
.curriculumManagement__internalCurriculum :deep(td.coursetagname .cell) {
  margin: -10px 0 0 -10px;
}
</style>
