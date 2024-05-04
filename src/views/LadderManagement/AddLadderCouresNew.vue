<template>
  <div class="ladder-course-container">
    <div class="main-box">
      <div class="plan-infomation-container">
        <el-form
          class="plan-infomation-form"
          :model="ladderForm"
          :rules="ladderFormRules"
          ref="ladderFormRef"
        >
          <el-form-item
            :label-width="formLabelWidth"
            label="课程名称"
            prop="courseName"
          >
            <el-input
              maxlength="50"
              show-word-limit
              v-model="ladderForm.courseName"
              placeholder="请输入课程名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="所属机构"
            prop="blgOrgs"
          >
            <gc-institution
              v-model="ladderForm.blgOrgs"
              :default-show="true"
              :left-show="false"
              :busiType="$store.state.userInfo.blgStripLine"
              @change="orgChangeHandle"
              @setDataFinish="orgIdsFinish"
              ref="institutionRef"
            >
            </gc-institution>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="课程来源"
            prop="courseType"
          >
            <el-radio-group v-model="ladderForm.courseType">
              <el-radio label="05002">内部</el-radio>
              <el-radio label="05003">外部</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="适用对象"
            prop="applicableTargetDTOList"
          >
            <div
              class="applicable-target"
              v-for="(item, index) in ladderForm.applicableTargetDTOList"
            >
              <div class="list-container">
                <el-cascader
                  :options="options"
                  v-model="ladderForm.applicableTargetDTOList[index]"
                  :props="cascderProp"
                  class="ladder-cascader"
                  style="margin-bottom: 10px"
                ></el-cascader>
              </div>
              <div class="control-container">
                <span class="active" @click="addApplicableHandle">添加</span>
                <span
                  class="active"
                  v-if="index !== 0"
                  @click="ladderForm.applicableTargetDTOList.splice(index, 1)"
                  >删除</span
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="业务条线"
            prop="businessLine"
          >
            <gc-select
              v-if="$store.state.userInfo.blgStripLine === systemConfigParameters().defaultBusiType"
              class="p0 course-classify"
              :options="courseClassifyOptions"
              @change="changeCaseClassify($event)"
              v-model="ladderForm.businessLine"
            ></gc-select>
            <CurriculumClassification
              v-else
              :blgStripLine="$store.state.userInfo.blgStripLine"
              :tagType="3"
              v-model="ladderForm.businessLine"
            />
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="课程标签"
            prop="courseTag"
          >
            <CurriculumLabel
              v-if="$store.state.userInfo.blgStripLine === systemConfigParameters().defaultBusiType"
              :tree="caseTagOptions"
              ref="curriculumLabelRef"
              :courseTag="ladderForm.courseTag"
              @change="courseTagChange($event, 'ladderForm', 'ladderFormRef')"
              :preced-rules="labelPrecedRules"
            >
            </CurriculumLabel>
            <CurriculumLabel
              v-else
              ref="curriculumLabelRef"
              :blgStripLine="$store.state.userInfo.blgStripLine"
              :tagType="4"
              v-model="ladderForm.courseTag"
              :preced-rules="labelPrecedRules"
            />
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="课程介绍"
            prop="courseDescribe"
          >
            <el-input
              type="textarea"
              resize="none"
              class="h-90"
              maxlength="1000"
              show-word-limit
              v-model="ladderForm.courseDescribe"
              placeholder="简明扼要填写相关内容"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="上传课件"
            prop="fileInformationDTOList"
          >
            <udmp-upload
              :accept="typeStr"
              :size="300 * 1024 * 1024"
              :on-sucess="handleFileChange"
            >
              <span class="tintColor ml10">
                支持扩展名：{{ typeStr }}，最大300M
              </span>
            </udmp-upload>

            <div ref="fileCourseList">
              <div
                class="tintColor files-item"
                v-for="(item, i) in ladderForm.fileInformationDTOList"
                :key="i"
                :data-id="item.udmpId"
              >
                <span class="drag-tag"></span>
                <el-input class="w-250" v-model="item.fileName"></el-input>
                <span class="case-type">{{ item.typeStr }}</span>
                <span
                  class="active ml10"
                  @click="ladderForm.fileInformationDTOList.splice(i, 1)"
                  >删除</span
                >
                <span class="active ml10" @click="handleDownloadFile(item)">下载</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <ExternalTeacher
        v-model="teacherFormData"
        :list="teacherRenderList"
        v-show="ladderForm.courseType === '05003'"
        ref="externalTeacherRef"
      ></ExternalTeacher>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="saveHandle"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import CurriculumLabel from '@/views/CurriculumManagement/components/CurriculumLabel.vue'
import CurriculumClassification from '../CurriculumManagement/components/CurriculumClassification.vue'
import ExternalTeacher from './compontes/ExternalTeacher.vue'
import {
  CopyObj,
  arrToTree,
  formatDate,
  myFloat,
  closeCurrPageAndGoPath,
  downloadFileAsAlink,
  systemConfigParameters
} from '@/util/utils'
import {
  fetchAddLadderCourse,
  fetchFindLadderCourseByCourseId,
  fetchUpdateLadderCourse
} from '@/fetch/ladderManagement'
import Sortable from 'sortablejs'
import { fetchListPlanDict } from '@/fetch/public'
import { fetchListTags } from '@/fetch/caseCenter'
import { fileDownload } from '@/util/udmp'
export default {
  name: 'AddLadderCourses',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      cascderProp: {
        value: 'dataEncode',
        label: 'dataValue',
        children: 'childPlanDict'
      },
      resultData: [],
      options: [],
      ladderForm: {
        courseName: '',
        courseDescribe: '',
        courseType: '',
        blgOrgs: [],
        applicableTargetDTOList: [[]],
        fileInformationDTOList: [],
        ladderExternalTeacherDTOList: [],
        courseTag: '',
        courseValidatorDate: [formatDate(new Date()), formatDate(new Date())],
        courseType: '05002',
        orgName: '',
        businessLine: ''
        // courseCreatedTime: formatDate(new Date()),
        // courseEndTime: ''
      },
      ladderFormRules: {
        courseName: [requiredHandle('请输入课程名称')],
        blgOrgs: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value?.length) {
                return callback(new Error('请选择机构'))
              }
              return callback()
            }
          }
        ],
        courseType: [requiredHandle('请输入课程来源')],
        businessLine: [requiredHandle('请选择业务条线')],
        applicableTargetDTOList: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.length < 1 || value[0].length < 1) {
                return callback(new Error('请选择适用对象'))
              }

              let validate = true
              value.forEach((item) => {
                if (!item || !Object.keys(item).length) {
                  validate = false
                }
              })

              if (!validate) {
                return callback(new Error('请选择适用对象'))
              }

              return callback()
            }
          }
        ],
        courseTag: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.length < 1 || !Object.keys(value[0]).length) {
                return callback(new Error('请选择课程标签'))
              }
              return callback()
            }
          }
        ],
        courseDescribe: [requiredHandle('请输入课程介绍')]
        // fileInformationDTOList: [
        //   {
        //     required: true,
        //     validator: (rule, value, callback) => {
        //       if (!value.length) {
        //         return callback(new Error('请上传课件'))
        //       }
        //       return callback()
        //     }
        //   }
        // ]
        // courseEndTime: [requiredHandle('请选择结束时间')]
      },
      formLabelWidth: '100px',
      typeStr: '.mp3,.mp4,.rar,.zip,.doc,.docx,.pdf,.ppt,.jpg',
      teacherFormData: [],
      teacherRenderList: [],
      daterangOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().valueOf() - 3600 * 1000 * 24
        }
      },
      sortableEl: null,
      status: 'create',
      applicableRanderList: [],
      courseTagRenderData: '',
      isSaveing: false,
      // 课程分类 options
      courseClassifyOptions: [],
      tagsList: [],
      caseTagOptions: [],
      systemConfigParameters
    }
  },

  components: {
    CurriculumLabel,
    ExternalTeacher,
    CurriculumClassification
  },

  computed: {},

  mounted() {
    this._initcaData()
  },

  methods: {
    async _initcaData() {
      let { trainSeries, keyJobs } = await fetchListPlanDict({
        line: this.$store.state.userInfo.blgStripLine,
        type: '01001'
      })
      keyJobs = keyJobs.map((item) => {
        item.childPlanDict = trainSeries
        return item
      })
      this.options = keyJobs
    },
    async _initData() {
      this.status = this.$route.params.type || this.status
      if (this.$route.params.courseId) {
        let data = {
          courseId: this.$route.params.courseId,
          // 写死
          module: 'ladderCourseModule'
        }
        let res = await fetchFindLadderCourseByCourseId({ data })

        this.ladderForm.courseId = res.courseId
        this.ladderForm.id = res.is
        this.ladderForm.blgOrgs = [res.blgOrg]
        this.$refs.institutionRef.content = [res.orgName]
        this.ladderForm.orgName = res.orgName

        if (res.applicableTargetDTOList) {
          res.applicableTargetDTOList.forEach((item, index) => {
            this.$set(this.ladderForm.applicableTargetDTOList, index, [
              item.keyJobs,
              item.trainSeries,
              item.childSeries
            ])
          })
        }
        this.ladderForm.fileInformationDTOList = res.fileInformationDTOList
        this.teacherRenderList = res.ladderExternalTeacherDTOList
        this.ladderForm.courseTag = res.courseTag

        // this.ladderForm.courseValidatorDate = [
        //   res.courseCreatedTime,
        //   res.courseEndTime
        // ]
        this.ladderForm.courseName = res.courseName
        this.ladderForm.courseDescribe = res.courseDescribe
        this.ladderForm.courseType = res.courseType
        this.ladderForm.courseCreatedTime = res.courseCreatedTime
        this.ladderForm.courseEndTime = res.courseEndTime
        this.ladderForm.businessLine = res.businessLine
        this.courseTagRenderData = res.courseTag

        this._initSortable()
      }

      // 不能直接取缓存，否则页签切换会有问题
      if (this.$route.params.type === 'create') {
        this._resetData()
        this.$nextTick(() => {
          this.$refs.ladderFormRef.clearValidate()
        })
        this._initcaData()
      }
      if (this.$store.state.userInfo.blgStripLine === systemConfigParameters().defaultBusiType) {
        this.getAllFilter()
      }
    },
    _initSortable() {
      let fileCourseList = this.$refs.fileCourseList
      this.sortableEl = new Sortable(fileCourseList, {
        handle: '.drag-tag',
        animation: 150,
        onEnd(event) {}
      })
    },
    closeHandle() {
      let { name } = this.$router
        .getRoutes()
        .find((item) => item.path === '/LadderCourses')
      closeCurrPageAndGoPath({ path: this.$route.path })
      this.$router.push({ name: name, params: { state: 'update' } })
    },
    _formatParams(data) {
      let params = CopyObj(data)
      params.blgOrg = params.blgOrgs[params.blgOrgs.length - 1]

      params.ladderExternalTeacherDTOList = this.teacherFormData

      let resultFileList
      if (this.sortableEl) {
        let sortList = this.sortableEl.toArray()

        resultFileList = sortList.map((item) =>
          params.fileInformationDTOList.find(
            (findItem) => findItem.udmpId === item
          )
        )
      } else {
        resultFileList = params.fileInformationDTOList
      }

      params.fileInformationDTOList = resultFileList.map((item, index) => {
        return {
          fileName: item.fileName,
          udmpId: item.udmpId,
          // 写死
          module: 'ladderCourseModule',
          sortNum: String(index)
          // sizes: String(item.fileSize)
        }
      })

      params.applicableTargetDTOList = params.applicableTargetDTOList.map(
        (item) => {
          return {
            keyJobs: item[0],
            trainSeries: item[1],
            childSeries: item[2]
          }
        }
      )

      if (params.courseType === '05002') {
        Reflect.deleteProperty(params, 'ladderExternalTeacherDTOList')
      }

      Reflect.deleteProperty(params, 'courseValidatorDate')
      Reflect.deleteProperty(params, 'blgOrgs')
      return params
    },
    saveHandle() {
      if (this.isSaveing) return
      this.isSaveing = true
      this.$refs.ladderFormRef.validate(async (v) => {
        if (!v) {
          this.isSaveing = false
          return
        }

        let data = this._formatParams(this.ladderForm)

        if (
          data.courseType === '05003' &&
          !this.$refs.externalTeacherRef.validateForm()
        ) {
          this.isSaveing = false
          return
        }

        try {
          if (this.status === 'edit') {
            await fetchUpdateLadderCourse({ data })
          } else {
            await fetchAddLadderCourse({ data })
          }
          this.isSaveing = false
          this.$message.success('添加成功')
          this.closeHandle()
        } catch {
          this.isSaveing = false
        }
      })
    },
    async handleDownloadFile (row) {
      try {
        downloadFileAsAlink(await fileDownload(row.udmpId))
      } catch (error) {}
    },
    // 处理文件上传
    handleFileChange(data, file) {
      const { name, size } = file
      const { udmpId, fileName: coursewareName } = data[0]
      // 文件后缀名转小写
      const fileSuffix = name.split('.').slice(-1)[0]?.toLowerCase()
      // const typeStr = this.typeMap[fileSuffix]
      // const type = this.caseTypeOptions.find((v) => v.label === typeStr).value
      const item = {
        // type,
        udmpId,
        // typeStr,
        fileSuffix,
        fileSize: myFloat(size / 1024 / 1024),
        time: '00:00:00',
        duration: 0,
        coursewareName,
        disabled: false
      }
      this.ladderForm.fileInformationDTOList.push({
        ...item,
        fileName: item.coursewareName
      })

      this.$nextTick(() => {
        this._initSortable()
      })
    },

    addApplicableHandle() {
      this.ladderForm.applicableTargetDTOList.push([])
    },
    orgChangeHandle(orgName) {
      this.ladderForm.orgName = orgName
    },
    _resetData() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.$refs.curriculumLabelRef.reset()
    },
    orgIdsFinish() {},
    // 课程标签组件 change事件
    courseTagChange(value, form, ref) {
      this[form].courseTag = value
      this.$refs[ref].validateField('courseTag')
    },
    changeCaseClassify(val) {
      let selectItem = this.courseClassifyOptions.find(item => item.value === val)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      this.ladderForm.courseTag = ''
      this.caseTagOptions = newArr
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
      this.initCourseTag()
    },
    initCourseTag() {
      let selectItem = this.courseClassifyOptions.find(item => item.value === this.ladderForm.businessLine)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      } else {
        this.ladderForm.businessLine = ''
        this.ladderForm.courseTag = ''
      }
      this.caseTagOptions = newArr
    },
    labelPrecedRules() {
      if(!this.ladderForm.businessLine) {
        this.$message.warning('请先选择业务条线')
        return false
      }
      return true
    }
  },
  activated() {
    this._initData()
  }
}
</script>
<style lang="scss" scoped>
.ladder-course-container {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
}

.plan-infomation-container {
  width: 700px;
  margin: 0 auto;
}

.applicable-target {
  display: flex;

  .control-container {
    margin-left: 5px;
    .active {
      display: inline-block;
      margin: 0 5px;
    }
  }
}

.files-item {
  display: flex;
  margin-top: 10px;
}

.drag-tag {
  width: 30px;
  height: 30px;
  top: 0;
  left: -30px;
  background: url('~@/assets/svg/tuodong.svg') center no-repeat;
}

.list-container {
  width: 80%;
}
.ladder-cascader {
  width: 100%;
}
.course-classify :deep(.el-select),
.course-classify :deep(.el-input) {
  width: 100% !important;
}
</style>