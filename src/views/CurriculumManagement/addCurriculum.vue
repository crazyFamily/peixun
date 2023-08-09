<template>
  <div class="curriculumManagement__addCurriculum">
    <el-card>
      <div class="base-info">
        <div class="title">
          <div class="title__menu"></div>
          基本信息
        </div>
        <div class="form-wrap mt20">
          <el-form
            ref="baseInfoFormRef"
            :model="baseInfoForm"
            label-width="72px"
            :rules="baseInfoFormRules"
          >
            <el-form-item label="课程名称" prop="courseName">
              <el-input
                placeholder="请输入"
                v-model="baseInfoForm.courseName"
                maxlength="30"
                show-word-limit
                :disabled="disabled"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="between">
                <el-form-item
                  prop="blgStripLine"
                  label="条线分类"
                  required
                  v-if="$store.state.userInfo.blgStripLine !== 'JF'"
                >
                  <el-select
                    class="w250"
                    v-model="baseInfoForm.blgStripLine"
                    @change="blgStripLineChange('baseInfoForm')"
                  >
                    <el-option
                      v-for="item in blgOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="部门" prop="blgOrg">
                  <el-select v-model="baseInfoForm.blgOrg" class="w250">
                    <el-option
                      v-for="item in blgOrgOptions"
                      :key="item.orgId"
                      :label="item.orgName"
                      :value="item.orgId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label-width="0">
              <div class="between">
                <el-form-item prop="teachType" label="课程类型" required>
                  <el-select class="w250" v-model="baseInfoForm.teachType">
                    <el-option
                      v-for="item in courseTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="课程时长" prop="courseDuration">
                  <el-input
                    style="width: 216px"
                    v-model="baseInfoForm.courseDuration"
                  ></el-input>
                  <span class="ml10">小时</span>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item
              label="移动授课类型"
              class="ws dr-label"
              prop="mTeachType"
              v-if="baseInfoForm.teachType === 'W'"
            >
              <gc-select
                class="padding-0"
                w1
                :options="mTeachTypeOptions"
                v-model="baseInfoForm.mTeachType"
              ></gc-select>
            </el-form-item>
            <el-form-item label="供应商参与">
              <el-col :span="11">
                <el-checkbox v-model="baseInfoForm.provAttend"></el-checkbox>
              </el-col>
              <el-col :span="6" class="ml13">
                阶梯课程
                <el-checkbox
                  class="ml10"
                  v-model="baseInfoForm.courseType"
                ></el-checkbox>
              </el-col>
            </el-form-item>
            <el-form-item
              label="课程分类"
              class="relative"
              required=""
              prop="courseClassify"
            >
              <gc-select
                v-if="$store.state.userInfo.blgStripLine === LINE_LS"
                class="p0 course-classify"
                :options="courseClassifyOptions"
                k="tagName"
                v="tagId"
                @change="changeCaseClassify($event, 'add')"
                v-model="baseInfoForm.courseClassify"
              ></gc-select>
              <CurriculumClassification
                v-else
                :blgStripLine="$store.state.userInfo.blgStripLine"
                v-model="baseInfoForm.courseClassify"
              />
            </el-form-item>
            <el-form-item label="课程标签" required="" prop="courseTag">
              <CurriculumLabel
                v-if="$store.state.userInfo.blgStripLine === LINE_LS"
                :tree="caseTagOptions"
                :courseTag="baseInfoForm.courseTag"
                @change="courseTagChange($event, 'baseInfoForm', 'baseInfoFormRef')"
              >
              </CurriculumLabel>
              <CurriculumLabel
                v-else
                :blgStripLine="$store.state.userInfo.blgStripLine"
                v-model="baseInfoForm.courseTag"
              />
            </el-form-item>
            <el-form-item label="适用对象" prop="courseApply">
              <el-input
                maxlength="30"
                show-word-limit
                v-model="baseInfoForm.courseApply"
              ></el-input>
            </el-form-item>
            <el-form-item label="课程简介" prop="courseIntro">
              <el-input
                type="textarea"
                resize="none"
                maxlength="1000"
                show-word-limit
                class="curriculumManagement__internalCurriculum__newAdd__textarea"
                v-model="baseInfoForm.courseIntro"
              ></el-input>
            </el-form-item>
            <el-form-item label="课程封面">
              <el-upload
                class="avatar-uploader"
                action="111"
                list-type="picture-card"
                :file-list="fileList"
                :before-upload="beforeAvatarUpload"
                :http-request="customRequest"
                :on-change="handleAvatarChange"
              >
                <div class="box">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="text">上传</div>
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="studyPersonInfo">
        <div class="title">
          <div class="title__menu"></div>
          研发人信息
        </div>
        <div class="menu-right icons mt20">
          <span class="icons__add" @click="addSelectPerson">
            <i class="icons__add__icon"></i>
            新增
          </span>
        </div>
        <div class="general__table">
          <el-table class="" :data="personInfoTableList">
            <el-table-column label="序号" width="64" type="index">
            </el-table-column>
            <el-table-column label="课程研发人" min-width="326">
              <template slot-scope="scope">
                <el-input class="page-input w150" v-model="scope.row.empName">
                  <i
                    slot="suffix"
                    class="page-input__search"
                    @click="openSearchPersonDialog(scope.row)"
                  ></i>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="部门" min-width="404" prop="blgOrgName">
            </el-table-column>
            <el-table-column label="所在比重（%）" min-width="270">
              <template slot-scope="scope">
                <el-input
                  class="w90"
                  v-model="scope.row.courseWeight"
                  @blur="checkCourseWeight($event, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="124">
              <template slot-scope="scope">
                <span class="mr20" @click="handleDelPerson(scope.$index)">
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i class="operation__del"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="coursewareUpload">
        <div class="title mb20">
          <div class="title__menu"></div>
          课件上传
        </div>
        <UploadData
          v-model="files"
          ref="uploadData"
          size="300M"
          url="/common/file/uploadNewFileForCustom"
          format=".xls,.doc,.pdf,.ppt,.docx,.xlsx,.pptx,.png,.gif,.jpg,.mp3,.mp4,.mov"
        />
      </div>
      <div class="buttons">
        <el-button class="button-w80-h30 mr20" @click="handleBack"
          >返回</el-button
        >
        <el-button class="button-w80-h30" type="primary" @click="addSubmit"
          >保存</el-button
        >
      </div>
    </el-card>

    <gc-model
      title="选择人员"
      :visible="selectPersonVisible"
      width="800px"
      @close="selectPersonClose"
      @comfirm="selectPersonComfirm"
      class="curriculumManagement__addCurriculum__select-person"
    >
      <div class="between">
        <div>
          <span class="mr20">研发人</span>
          <el-input class="" v-model="selectPersonForm.empName"></el-input>
        </div>

        <el-button
          class="button-60-blue-primary"
          @click="selectPersonDialogSearch"
          >查询</el-button
        >
      </div>
      <gc-table
        class="general__table table-radio"
        ref="selectPersonRef"
        :list="selectPersonList"
        v-loading="loadingTable"
        :tableList="selectPersonTableList"
        @selection-change="
          tableSelectionChange($refs, $event, 'selectPersonRef')
        "
      ></gc-table>
      <gc-pagination
        :total="selectPersonForm.total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[5]"
        :page-size="selectPersonForm.pageSize"
        :current-page="selectPersonForm.currPage"
        @sizeChange="sizeChange($event, selectPersonForm, getSelectPerson)"
        @currentChange="
          currentChange($event, selectPersonForm, getSelectPerson)
        "
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </gc-model>
  </div>
</template>

<script>
import $ from 'jquery'
import { LINE_LS } from '@/util/constants'
import { APIListTags } from '@/fetch/caseCenter'
import UploadData from './components/UploadData.vue'
import CurriculumLabel from './components/CurriculumLabel.vue'
import CurriculumClassification from './components/CurriculumClassification.vue'
import {
  myRound,
  CopyObj,
  imgType,
  arrToTree,
  sizeChange,
  uploadFile,
  jsonHeaders,
  currentChange,
  handleUdmpHref,
  getBlgOrgOptions,
  getCurriculumTree,
  addAllowKeepAlive,
  tableSelectionChange,
  getBlgStripLineOptions
} from '../../util/utils'
export default {
  name: 'AddCurriculum',
  components: {
    UploadData,
    CurriculumLabel,
    CurriculumClassification
  },
  data() {
    return {
      //  培训班数据对象
      classObj: {},
      // 课程数据对象
      courseObj: {},
      // 基本信息表单
      baseInfoForm: {},
      // 基本信息保单 验证规则
      baseInfoFormRules: {
        courseName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入课程名称'
          }
        ],
        blgStripLine: [{ required: true, message: '请选择条线分类' }],
        blgOrg: [{ required: true, message: '请选择部门' }],
        teachType: [{ required: true, message: '请选择课程分类' }],
        mTeachType: [{ required: true, message: '请选移动授课类型' }],
        courseDuration: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写课程时长'
          },
          {
            validator(rule, value, callback) {
              if (!/^\d+((\.\d{1,1})?|(\.))$/.test(value)) {
                return callback(new Error())
              }
              return callback()
            },
            trigger: 'blur',
            message: '课时必须是大于等于0，支持填写小数点后一位'
          }
        ],
        courseClassify: [{ required: true, message: '请选择课程分类' }],
        courseTag: [{ required: true, message: '请选择课程标签' }],
        courseApply: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入适用对象'
          }
        ],
        courseIntro: [
          { required: true, trigger: 'blur', message: '请输入简介' }
        ]
      },
      // 条线 下拉选项
      blgOptions: [],
      // 部门下拉选项
      blgOrgOptions: [],
      // 研究人表格 数据 数组
      personInfoTableList: [],
      // 选择人员 dialog状态
      selectPersonVisible: false,
      // 选择人员 表单
      selectPersonForm: {
        total: 0,
        empName: '',
        currPage: 1,
        pageSize: 5
      },
      // 选择人员 表格 字段数组
      selectPersonList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '姓名',
          width: '134',
          prop: 'empName'
        },
        {
          label: 'UM号',
          width: '126',
          prop: 'umId'
        },
        {
          label: '部门',
          width: '350',
          prop: 'blgOrgName'
        }
      ],
      // 选择人员 表格 数据数组
      selectPersonTableList: [],
      // 课程类型选项
      courseTypeOptions: [
        {
          label: '面授',
          value: 'F'
        },
        {
          label: '微课',
          value: 'W'
        },
        {
          label: '典范案例',
          value: 'D'
        }
      ],
      // 移动授课类型 选项
      mTeachTypeOptions: [
        {
          label: '音频/视频/动画/游戏类',
          value: 'MV'
        },
        {
          label: '图文类',
          value: 'MC'
        }
      ],
      // 上传 封面图片 数组
      fileList: [],
      // 课件上传文件 数组
      files: [],
      // 当前页面是修改还是 新增
      pageState: '',
      // 表格 多选变单选工具函数
      tableSelectionChange,
      // 分页工具函数
      currentChange,
      sizeChange,
      loadingTable: false,
      // 课程分类 options
      courseClassifyOptions: [],
      LINE_LS,
      tagsList: [],
      caseTagOptions: []
    }
  },
  methods: {
    // 审批链确认事件
    approvalChainConfirm() {},
    // 图片上传 回掉
    handleAvatarChange(file, fileList) {
      if (fileList.length > 1) {
        this.fileList = fileList.slice(-1)
      } else if (fileList.length === 0) {
        this.baseInfoForm.courseCover = ''
      }
    },
    // 上传前的回掉事件
    beforeAvatarUpload(file) {
      const type = imgType.includes(file.type)
      const size = file.size / 1024 < 500
      if (!type) {
        this.$message.error('上传的文件类型只能是 jpg,png.jpeg')
        return false
      }
      if (!size) {
        this.$message.error('上传头像图片大小不能超过 500kb!')
        return false
      }
      return true
    },
    // 选择人员 dialog 查询函数
    selectPersonDialogSearch() {
      this.selectPersonForm.currPage = 1
      this.getSelectPerson()
    },
    // 获取选择人员数据
    getSelectPerson() {
      const data = CopyObj(this.selectPersonForm)
      Reflect.deleteProperty(data, 'row')
      this.loadingTable = true
      this.$axios
        .post('/fn/user/listUserInfos', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.selectPersonTableList = list
            this.selectPersonForm.total = total
          }
        }).finally(()=>{
          this.loadingTable = false
        })
    },
    handleBack() {
      const items = $(
        `.component-head__left__tags__item__content:contains(${this.$route.name})`
      )
      const item = Array.from(items).find(
        (v) => $(v).text().trim() === this.$route.name
      )
      if (item) {
        $(item).next().click()
      } else {
        addAllowKeepAlive('/CurriculumStorageManagement')
        this.$router.push({
          name: '课程入库管理'
        })
      }
    },
    // 选择条线select change 事件
    blgStripLineChange(formKey) {
      if (!this[formKey].blgStripLine) {
        this.blgOrgOptions = []
      }
      const data = {
        module: 'courseModule',
        busiType: this[formKey].blgStripLine
      }
      getBlgOrgOptions(data).then((res) => {
        this.blgOrgOptions = res
      })
    },
    // 自定义图片上传函数
    customRequest(item) {
      uploadFile({
        files: item.file,
        busiId: '',
        reimClass: ''
      }).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const index = this.files.findIndex(
            (v) => v.submodule === 'course_cover'
          )
          const { udmpId, fileName } = data[0]
          const item = {
            udmpId,
            fileName,
            submodule: 'course_cover'
          }
          if (index >= 0) {
            this.files[index] = item
          } else {
            this.files.push(item)
          }
        }
      })
    },
    // 新增课程提交事件
    addSubmit() {
      this.$refs.baseInfoFormRef.validate((valied) => {
        if (valied) {
          if (!this.checkCourseWeightTotal()) {
            return
          }
          let url, desc
          if (this.pageState === 'add') {
            url = '/fn/course/materials/addClassStore'
            desc = '新增'
          } else {
            url = '/fn/course/materials/updateClassStore'
            desc = '修改'
          }
          const courseMaterials = CopyObj(this.baseInfoForm)
          const developerList = CopyObj(this.personInfoTableList)
          const files = CopyObj(this.files)
          files.forEach((v) => {
            Reflect.deleteProperty(v, 'files')
          })
          courseMaterials.classId = this.classObj.classId
          courseMaterials.provAttend = courseMaterials.provAttend ? 'Y' : 'N'
          courseMaterials.courseType = courseMaterials.courseType
            ? '02001'
            : '02000'
          courseMaterials.developerList = developerList
          courseMaterials.files = files
          this.$axios
            .post(url, { courseMaterials }, jsonHeaders)
            .then((res) => {
              const { code, data } = res.data
              if (code === 0) {
                this.$message.success(`${desc}成功`)
                this.handleBack()
              }
            })
        } else {
          this.$message.warning('请检查基本信息')
        }
      })
    },
    // 重置所有数据
    reset() {
      this.baseInfoForm = {}
      this.selectPersonTableList = []
      this.$refs.uploadData?.reset()
    },
    // 编辑时将数据转换为本页适合的数据
    dataTransition() {
      const data = CopyObj(this.courseObj)
      data.developerList.forEach((v) => {
        v.empName = v.courseCreaterName
      })
      this.personInfoTableList = data.developerList
      data.files.forEach((v) => {
        v.files = { name: v.fileName }
      })
      this.files = data.files
      Reflect.deleteProperty(data, 'developerList')
      Reflect.deleteProperty(data, 'files')
      data.provAttend = data.provAttend === 'Y' ? true : false
      data.courseType = data.courseType === '02001' ? true : false
      const blgOrg = data.blgOrg
      const courseTag = data.courseTag
      const courseClassify = data.courseClassify
      data.blgOrg = ''
      data.courseTag = ''
      data.courseClassify = ''
      this.baseInfoForm = data
      this.blgStripLineChange('baseInfoForm')
      this.$nextTick(() => {
        this.baseInfoForm.blgOrg = blgOrg
        setTimeout(() => {
          this.baseInfoForm.courseTag = courseTag
          this.baseInfoForm.courseClassify = courseClassify
          this.caseTagOptions = this.courseClassifyOptions.find(v => v.tagId === this.baseInfoForm.courseClassify)?.children ||[]
        }, 0)
      })
      const courseCover = this.files.find((v) => v.submodule === 'course_cover')
      if (courseCover) {
        courseCover.url = handleUdmpHref(courseCover.udmpId)
        this.fileList.push(courseCover)
      }
    },
    // 选择人员确认事件
    selectPersonComfirm() {
      const selection = this.$refs.selectPersonRef.$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('请先选择人员')
      }
      const row = this.selectPersonForm.row
      this._.merge(row, selection[0])
      row.courseCreater = row.umId
      row.blgOrg = row.blgOrgId
      this.selectPersonVisible = false
    },
    // 新增研发人信息
    addSelectPerson() {
      this.personInfoTableList.push({
        empName: '',
        blgOrgName: '',
        courseWeight: ''
      })
    },
    // 打开搜索人员dialog
    openSearchPersonDialog(row) {
      this.selectPersonForm.row = row
      this.selectPersonVisible = true
    },
    // 删除一个研究人员信息
    handleDelPerson(index) {
      this.personInfoTableList.splice(index, 1)
    },
    // 获取课程详情
    getCourseDetails() {
      const data = { courseId: this.courseObj.courseId }
      this.$axios
        .post(
          '/fn/course/materials/findClassStoreDetail',
          { courseInfoRequest: data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this._.merge(this.courseObj, data)
            this.dataTransition()
          }
        })
    },
    // 检查 权重
    checkCourseWeight($event, row) {
      let value = $event.target.value
      if (value === '') return
      row.courseWeight = value = parseInt(value)
      if (!value || value % 1 !== 0 || value > 100) {
        this.$message.warning('权重必须是小于100的整数')
        row.courseWeight = ''
        return
      }
    },
    checkCourseWeightTotal() {
      if (this.personInfoTableList.length < 1) return true
      const provAttend = this.baseInfoForm.provAttend
      const sum = this.personInfoTableList.reduce(
        (a, b) => a + parseInt(b.courseWeight) || 0,
        0
      )
      if (provAttend) {
        if (sum < 100) {
          return true
        }
        this.$message.warning('供应商参与时，研发人权重之和要小于100')
        return false
      } else {
        if (sum === 100) {
          return true
        }
        this.$message.warning('供应商未参与时，研发人权重之和要等于100')
        return false
      }
    },
    selectPersonClose() {
      this.selectPersonVisible = false
      this.selectPersonForm = {
        total: 0,
        empName: '',
        currPage: 1,
        pageSize: 5
      }
      this.selectPersonTableList = []
    },
    // 课程标签组件 change事件
    courseTagChange(value, form, ref) {
      this[form].courseTag = value
      this.$refs[ref].validateField('courseTag')
    },
    changeCaseClassify(val, add) {
      let selectItem = this.courseClassifyOptions.find(item => item.value === val)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      this.baseInfoForm.courseTag = ''
      this.caseTagOptions = newArr
    }
  },
  mounted() {
    $('body').css({ overflow: 'hidden' })
    const params = this.$route.params
    if (!params?.row?.classId) {
      this.handleBack()
      return
    }
    this.classObj = params.row
    if (params.state === 'edit') {
      this.courseObj = params.course
    }
    this.pageState = params.state
    getBlgStripLineOptions('courseModule').then(async (res) => {
      this.blgOptions = res
    })
  },
  activated() {
    if (this.$store.state.userInfo.blgStripLine === 'JF') {
      this.baseInfoForm.blgStripLine = 'JF'
      this.blgStripLineChange('baseInfoForm')
    }
  },
  deactivated() {
    $('body').css({ overflow: '' })
  },
  destroyed() {
    $('body').css({ overflow: '' })
  },
  watch: {
    async pageState(n) {
      if (this.$store.state.userInfo.blgStripLine === this.LINE_LS) {
        // 零售获取课程分类及课程标签
        await getCurriculumTree(5, this.LINE_LS, 1, APIListTags).then(data => {
          this.courseClassifyOptions = data || []
        })
      }
      if (n === 'add') {
        this.reset()
        this.$nextTick(() => {
          this.$refs.baseInfoFormRef.clearValidate()
        })
      } else {
        this.getCourseDetails()
      }
    }
  },
  computed: {
    disabled() {
      return this.pageState === 'edit'
    }
  }
}
</script>

<style lang="scss">
.curriculumManagement__addCurriculum {
  .base-info {
    .form-wrap {
      display: flex;
      justify-content: center;
      .el-form {
        width: 670px;
      }
    }
    .w250 {
      width: 250px;
    }
    .ml13 {
      margin-left: 13px;
    }
    .avatar-uploader {
      .el-upload {
        width: 130px;
        height: 130px;
        border: 1px solid #e0e1e3;
      }
      .el-upload-list__item {
        width: 130px;
        height: 130px;
      }
    }
    .box {
      display: flex !important;
      width: 130px;
      height: 130px;

      flex-direction: column !important;
      .avatar-uploader-icon {
        margin-top: 48px;
        font-size: 28px;
        color: #e0e1e3;
      }
      .text {
        display: inline-block;
        width: 130px;
        height: 20px;
        margin-top: 20px;
        line-height: 20px;
        color: rgba($color: #424656, $alpha: 0.4);
      }
    }
  }
  .studyPersonInfo {
    margin-top: 30px;
  }
  .coursewareUpload {
    margin-top: 30px;
  }

  &__select-person {
    .el-input {
      width: 200px;
    }
    .general__table {
      margin-top: 13px;
    }
  }

  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}
</style>
<style lang="scss" scoped>
.course-classify :deep(.el-select),
.course-classify :deep(.el-input) {
  width: 100% !important;
}
</style>
