<template>
  <div class="trainingProtocol">
    <div class="student-form p20 pt0">
      <el-form :model="studentInfo" ref="studentInfoRef">
        <div class="title mt10 mb10">
          <div class="title__menu"></div>
          轮岗信息
        </div>
        <div class="dfw">
          <el-form-item label="轮岗阶段" label-width="120px">
            <el-input :value="studentInfo.transferStage" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="轮岗岗位" label-width="120px">
            <el-input :value="studentInfo.transferPosition" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="轮岗岗位类型" label-width="120px">
            <el-input :value="studentInfo.transferPositionType" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="预计轮岗时间" label-width="120px">
            <el-input :value="studentInfo.transferExpectedDate" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="预计轮岗时长" label-width="120px">
            <el-input :value="studentInfo.transferExpectedTime" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="实际轮岗时间" label-width="120px">
            <el-input :value="studentInfo.transferActualDate" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="实际轮岗时长" label-width="120px">
            <el-input :value="studentInfo.transferActualTime" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="轮岗状态" label-width="120px">
            <el-input v-model="studentInfo.transferStatusName" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="下阶段安排" label-width="120px">
            <el-input v-model="studentInfo.nextPhaseArrange" class="sw-250" disabled></el-input>
          </el-form-item>
          <el-form-item label="导师" label-width="120px">
            <el-input v-model="studentInfo.mentor" class="sw-250" disabled></el-input>
          </el-form-item>
        </div>
        <el-collapse v-model="activeCollapseNames">
          <el-collapse-item name="ConfigurationModule">
            <div slot="title" class="title mt10 mb10">
              <div class="title__menu"></div>
              课程模块
            </div>
            <div v-for="(courseItem, index) in studentInfo.courseModuleList" :key="index">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="课程ID" label-width="70px" class="ml20 df">
                    <el-input v-model="courseItem.fosterProjectId" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="课程名称" label-width="70px" class="ml20 df">
                    <el-popover popper-class="p10" trigger="hover" :content="courseItem.fosterProjectName">
                      <el-input slot="reference" v-model="courseItem.fosterProjectName" disabled></el-input>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="11" class="df">
                  <el-form-item label="学习形式" class="ml20 df">
                    <el-select v-model="courseItem.fosterModality" disabled>
                      <el-option v-for="(item, subIndex) in FOSTER_MODULE_LIST" :key="subIndex" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="课程完成状态" class="ml20 df">
                    <el-input v-model="courseItem.completeStatusName" class="sw-150" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item
                    v-if="courseItem.fosterModality === PRACTICE_FILEUPLOAD"
                    :prop="`courseModuleList.${index}.auditStatus`"
                    :rules="{ required: true, message: `审核状态必填` }"
                    label="审核状态"
                    label-width="70px"
                    class="ml20 df"
                  >
                    <gc-select
                      k="label"
                      v="value"
                      class="padding-0 wfull"
                      :disabled="rowData.processType === 'view' || !showSubmitBtn"
                      v-model="courseItem.auditStatus"
                      :options="REVIEW_STATUS_OPTIONS"
                    ></gc-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item v-if="courseItem.fosterModality === PRACTICE_FILEUPLOAD" class="ml20 df">
                    <template #label>
                      <div @click="openUploadCase(courseItem)" class="aic">
                        <div class="instructor-icons__upload margin-0">
                          <i class="icons__upload__icon"></i>
                        </div>
                        <span class="active">上传文件</span>
                      </div>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <el-collapse-item name="PracticeModule">
            <div slot="title" class="title mt10 mb10">
              <div class="title__menu"></div>
              实践模块
            </div>
            <div v-for="(courseItem, index) in studentInfo.practiceModuleList" :key="index">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="活动ID" label-width="70px" class="ml20 df">
                    <el-input v-model="courseItem.fosterProjectId" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="活动名称" label-width="70px" class="ml20 df">
                    <el-popover popper-class="p10" trigger="hover" :content="courseItem.fosterProjectName">
                      <el-input slot="reference" v-model="courseItem.fosterProjectName" style="width: 90%" disabled></el-input>
                    </el-popover>
                    <el-popover popper-class="mr20" v-if="courseItem.fosterRequire">
                      <div style="padding: 10px; max-width: 700px">
                        <span
                          >活动量要求：<span>{{ courseItem.fosterRequire }}</span></span
                        >
                      </div>
                      <i slot="reference" class="el-icon-question foster-require ml10 active"></i>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="11" class="df">
                  <el-form-item label="实践形式" class="ml20 df">
                    <el-select v-model="courseItem.fosterModality" disabled>
                      <el-option v-for="(item, subIndex) in FOSTER_MODULE_LIST" :key="subIndex" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="实践完成状态" class="ml20 df">
                    <el-input v-model="courseItem.completeStatusName" class="sw-150" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item label="要求完成数量" label-width="90px" class="df">
                    <el-input v-model="courseItem.completeNum" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item
                    v-if="courseItem.fosterModality === PRACTICE_FILEUPLOAD"
                    :prop="`practiceModuleList.${index}.auditStatus`"
                    :rules="{ required: true, message: `审核状态必填` }"
                    label="审核状态"
                    label-width="70px"
                    class="ml20 df"
                  >
                    <gc-select
                      k="label"
                      v="value"
                      class="padding-0 wfull"
                      :disabled="rowData.processType === 'view' || !showSubmitBtn"
                      v-model="courseItem.auditStatus"
                      :options="REVIEW_STATUS_OPTIONS"
                    ></gc-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item v-if="courseItem.fosterModality === PRACTICE_FILEUPLOAD" class="ml20 df">
                    <template #label>
                      <div @click="openUploadCase(courseItem)" class="aic">
                        <div class="instructor-icons__upload margin-0">
                          <i class="icons__upload__icon"></i>
                        </div>
                        <span class="active">上传文件</span>
                      </div>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <el-collapse-item name="QualificationModule">
            <div slot="title" class="title mt10 mb10">
              <div class="title__menu"></div>
              资质模块
            </div>
            <div v-for="(courseItem, index) in studentInfo.qualificationModuleList" :key="index">
              <el-row>
                <el-col :span="5">
                  <el-form-item label="考试ID" label-width="70px" class="ml20 df">
                    <el-input v-model="courseItem.fosterProjectId" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="考试名称" label-width="70px" class="ml20 df">
                    <el-popover popper-class="p10" trigger="hover" :content="courseItem.fosterProjectName">
                      <el-input slot="reference" v-model="courseItem.fosterProjectName" style="width: 90%" disabled></el-input>
                    </el-popover>
                    <el-popover popper-class="mr20" v-if="courseItem.fosterRequire">
                      <div style="padding: 10px; max-width: 700px">
                        <span
                          >考试要求：<span>{{ courseItem.fosterRequire }}</span></span
                        >
                      </div>
                      <i slot="reference" class="el-icon-question foster-require ml10 active"></i>
                    </el-popover>
                  </el-form-item>
                </el-col>
                <el-col :span="11" class="df">
                  <el-form-item label="考试来源" class="ml20 df">
                    <el-select v-model="courseItem.fosterModality" disabled>
                      <el-option v-for="(item, subIndex) in FOSTER_MODULE_LIST" :key="subIndex" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="考试通过状态" class="ml20 df">
                    <el-input v-model="courseItem.completeStatusName" class="sw-150" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item v-if="courseItem.fosterModality !== PRACTICE_FILEUPLOAD" label="考试分数" label-width="70px" class="ml20 df">
                    <el-input v-model="courseItem.score" disabled></el-input>
                  </el-form-item>
                  <el-form-item
                    v-if="courseItem.fosterModality === PRACTICE_FILEUPLOAD"
                    :prop="`qualificationModuleList.${index}.auditStatus`"
                    :rules="{ required: true, message: `审核状态必填` }"
                    label="审核状态"
                    label-width="70px"
                    class="ml20 df"
                  >
                    <gc-select
                      k="label"
                      v="value"
                      class="padding-0 wfull"
                      :disabled="rowData.processType === 'view' || !showSubmitBtn"
                      v-model="courseItem.auditStatus"
                      :options="REVIEW_STATUS_OPTIONS"
                    ></gc-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item v-if="courseItem.fosterModality === PRACTICE_FILEUPLOAD" class="ml20 df">
                    <template #label>
                      <div @click="openUploadCase(courseItem)" class="aic">
                        <div class="instructor-icons__upload margin-0">
                          <i class="icons__upload__icon"></i>
                        </div>
                        <span class="active">上传文件</span>
                      </div>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button
        class="button-w80-h30"
        v-if="rowData.processType === 'edit' && showSubmitBtn"
        :loading="submitLoading"
        type="primary"
        @click="handleSubmit"
        >保存</el-button
      >
    </div>
    <UploadAndViewModel
      width="1000px"
      title="上传文件"
      :show="uploadCaseShow"
      :isPrview="rowData.type === 'view'"
      :originalList="uploadOriginalList"
      @update:show="closeUploadCase"
      @comfirm="comfirmUploadCase"
      ref="uploadModelRef"
    >
    </UploadAndViewModel>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { CopyObj, customHint } from '@/util/utils'
import { fetchFindFosterPlanDetail, fetchAuditFileModality, fetchUploadFileModality } from '@/fetch/schoolRecruitmentManagement'
import { PRACTICE_FILEUPLOAD, REVIEW_STATUS_OPTIONS, FOSTER_MODULE_LIST, TEACHER } from '../../enum.js'
import UploadAndViewModel from './UploadAndViewModel.vue'
import { Message } from 'element-ui'
import store from '@/store'
const props = defineProps({
  rowData: {}
})
const activeCollapseNames = ref(['ConfigurationModule', 'PracticeModule', 'QualificationModule'])
const studentInfo = ref({
  courseModuleList: [],
  practiceModuleList: [],
  qualificationModuleList: []
})
const studentInfoRef = ref(null)
const showSubmitBtn = ref(true)
const getDetail = async () => {
  const { userCode, grade, transferStage, identity } = props.rowData
  const res = await fetchFindFosterPlanDetail({
    data: { userCode, grade, transferStage }
  })
  showSubmitBtn.value =
    res.courseModuleList?.some((v) => v.fosterModality === PRACTICE_FILEUPLOAD) ||
    res.practiceModuleList?.some((v) => v.fosterModality === PRACTICE_FILEUPLOAD) ||
    res.qualificationModuleList?.some((v) => v.fosterModality === PRACTICE_FILEUPLOAD)
  if(identity === TEACHER) {
    showSubmitBtn.value = showSubmitBtn.value && res.isSave === 'Y'
  }
  studentInfo.value = { ...res }
  nextTick(() => {
    studentInfoRef.value?.clearValidate()
  })
}
getDetail()
// ============================== 上传课件 ==============================
const uploadCaseShow = ref(false)
const uploadParams = ref({})
const uploadModelRef = ref(null)
const uploadOriginalList = ref([])
const uploadForm = ref([])
// 打开导入弹框
async function openUploadCase(row) {
  uploadOriginalList.value = CopyObj(row.fileInformationList) || []
  uploadParams.value = row
  uploadCaseShow.value = true
}
function uploadFormIsChange(newFileList) {
  if (newFileList.length !== uploadParams.value.fileInformationList.length) return true
  return newFileList.some((v, i) => v.udmpId !== uploadParams.value.fileInformationList[i].udmpId)
}
async function closeUploadCase(value, fileList) {
  const isChange = uploadFormIsChange(fileList)
  if (isChange) {
    await customHint('当前信息未保存，是否确认【取消】？', '提示', '取消')
    uploadCaseShow.value = false
  } else {
    uploadCaseShow.value = false
  }
  uploadParams.value = {}
  uploadModelRef.value.reset()
}
// 上传确认
async function comfirmUploadCase(fileList) {
  fetchUploadFileModality({
    data: {
      userCode: props.rowData.userCode,
      grade: props.rowData.grade,
      transferStage: props.rowData.transferStage,
      planId: studentInfo.value.planId,
      fosterModule: {
        proId: uploadParams.value.proId,
        fileInformationList: CopyObj(
          fileList.map((v) => ({
            // createdByName: v.uploadUser,
            // fileSize: v.sizes,
            // createdDate: v.uploadDate,
            udmpId: v.udmpId,
            fileName: v.fileName
          }))
        )
      }
    }
  }).then((res) => {
    Message.success('保存成功！')
    uploadCaseShow.value = false
    uploadModelRef.value.reset()
    refreshParentPage = true
    getDetail()
  })
}
// ------------------- 保存 -------------------
// 将本页数据格式化成后端需要的数据
const CurrentPageDataTobackgroundData = () => {
  const infoData = CopyObj(studentInfo.value)
  const fromData = {
    userCode: props.rowData.userCode,
    grade: props.rowData.grade,
    transferStage: props.rowData.transferStage,
    planId: studentInfo.value.planId,
    fosterModuleList: []
  }
  const getFosterModuleList = (moduleList) => {
    infoData[moduleList]?.forEach((v) => {
      if (v.fosterModality === PRACTICE_FILEUPLOAD) {
        fromData.fosterModuleList.push({
          proId: v.proId,
          auditStatus: v.auditStatus
        })
      }
    })
  }
  getFosterModuleList('courseModuleList')
  getFosterModuleList('practiceModuleList')
  getFosterModuleList('qualificationModuleList')
  return fromData
}
const submitLoading = ref(false)
// 是否要刷新上一页数据
let refreshParentPage = false
const handleSubmit = () => {
  studentInfoRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      CurrentPageDataTobackgroundData()
      fetchAuditFileModality({ data: CurrentPageDataTobackgroundData() })
        .then((res) => {
          Message.success('保存成功！')
          refreshParentPage = true
        })
        .finally(() => {
          submitLoading.value = false
        })
    }
  })
}
const closeHandle = () => {
  const data = { status: 'list' }
  if (refreshParentPage) {
    data.refreshData = true
  }
  store.dispatch('schoolRecruitmentManagement/changeRotationComp', data)
}
// 监听阶段数据切换
watch(
  () => props.rowData.transferStage,
  () => {
    getDetail()
  }
)
</script>
<script>
export default {
  name: 'TrainingProtocol'
}
</script>
<style lang="scss" scoped>
.trainingProtocol {
  height: calc(100% - 50px);
  background-color: #fff;
  position: relative;
  .student-form {
    flex: 1;
    min-height: calc(100% - 70px);
  }
  :deep(.el-row .df .el-form-item__content) {
    flex: 1;
    margin-left: 0 !important;
  }
  .foster-require {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
  }
}
</style>