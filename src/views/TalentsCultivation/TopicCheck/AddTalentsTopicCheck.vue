<template>
  <div>
    <el-card>
      <StepTopbar current-step="议题终审" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <div class="permission-container talents-container top-container mt10">
      <div class="main-box">
        <div class="main-container">
          <div class="title">
            <div class="title__menu"></div>
            议题信息
          </div>
          <div class="topic-info-container">
            <el-form :model="topicInfoForm" ref="topicInfoFormRef" disabled inline>
              <div class="layer-wrapper talents-line-input">
                <el-form-item :label-width="formLabelWidth" label="议题名称">
                  <el-input class="topic-input" maxlength="60" show-word-limit v-model="topicInfoForm.subjectName"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="项目名称">
                  <el-input class="topic-input" maxlength="60" show-word-limit v-model="topicInfoForm.projectName"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="项目类型">
                  <el-input class="topic-input" maxlength="60" show-word-limit v-model="topicInfoForm.projectTypeDesc"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="方案ID">
                  <el-input class="topic-input" maxlength="60" show-word-limit v-model="topicInfoForm.customizePlanId"></el-input>
                </el-form-item>
              </div>
              <div class="layer-wrapper talents-line-input">
                <el-form-item :label-width="formLabelWidth" label="所属单位">
                  <el-input class="topic-input" maxlength="60" show-word-limit v-model="topicInfoForm.orgName"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="议题导师">
                  <MockInputTag :list="topicInfoForm.teacherList" label="empName" disabled width="240"></MockInputTag>
                </el-form-item>
              </div>
              <div class="layer-wrapper full-wrapper">
                <el-form-item :label-width="formLabelWidth" label="议题目标" prop="subjectTarget">
                  <el-input
                    type="textarea"
                    resize="none"
                    rows="3"
                    maxlength="120"
                    show-word-limit
                    v-model="topicInfoForm.subjectTarget"
                    placeholder="填写议题目标"
                  ></el-input>
                </el-form-item>
              </div>
              <div class="layer-wrapper full-wrapper">
                <el-form-item :label-width="formLabelWidth" label="议题详情" prop="subjectDetail">
                  <el-input
                    type="textarea"
                    resize="none"
                    rows="8"
                    maxlength="500"
                    show-word-limit
                    v-model="topicInfoForm.subjectDetail"
                    placeholder="突出当前业务痛点/发展方向/创新模式等"
                  ></el-input>
                </el-form-item>
              </div>
              <el-form-item
                class="plan-infomation-item"
                :label-width="formLabelWidth"
                label="附件"
                prop="fileList"
                v-if="topicInfoForm.fileList.length"
              >
                <div class="file-container other-type">
                  <div class="file-content" :class="{ 'no-margin': index === 0 }" v-for="(item, index) in topicInfoForm.fileList" :key="index">
                    <el-tag :closable="false">
                      <span @click="handleDownloadFile(item.udmpId)" download class="active download-style">{{ item.fileName }}</span>
                    </el-tag>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="title">
            <div class="title__menu"></div>
            终审信息
          </div>
          <div class="topic-info-container">
            <el-form :model="checkInfoForm" ref="checkInfoFormRef" :rules="checkInfoFormRules()" :disabled="status === 'view'">
              <el-form-item :label-width="formLabelWidth" label="终审结果" prop="evaluateResult">
                <el-input
                  type="textarea"
                  resize="none"
                  rows="5"
                  maxlength="500"
                  show-word-limit
                  v-model="checkInfoForm.evaluateResult"
                  placeholder="本阶段通过XX方法，在分行层面落实XX行动，加以激励政策。。。"
                ></el-input>
              </el-form-item>
              <el-form-item class="plan-infomation-item" :label-width="formLabelWidth" label="附件" prop="evaluateFileList">
                <el-button type="primary" @click="uploadHandle" :disabled="status === 'view'">上传文件</el-button>
                <span class="tips">支持扩展名：{{ renderFileType }}, 每次上传附件大小限制在{{ uploadFileSizeText }}以内</span>
                <div class="file-container other-type" style="margin-top: 10px">
                  <div
                    class="file-content"
                    :class="{ 'no-margin': index === 0 }"
                    v-for="(item, index) in checkInfoForm.evaluateFileList"
                    :key="index"
                  >
                    <el-tag :closable="status !== 'view'" @close="checkInfoForm.evaluateFileList.splice(index, 1)">
                      <span @click="handleDownloadFile(item.udmpId)" download class="active download-style">{{ item.fileName }}</span>
                    </el-tag>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="closeHandle">关闭</el-button>
        <el-button class="button-w80-h30" type="primary" @click="saveHandle" :disabled="status === 'view'">提交</el-button>
      </div>
    </div>
    <!-- 上传文件的弹窗 -->
    <gc-model :visible.sync="isUploadFile" :isShowFooter="false" title="请选择上传文件">
      <UploadUdmp
        :accept="uploadFileType"
        @uploadFinish="uploadFinishHandle"
        :size="uploadFileSize"
        ref="headquarterUploadRef"
      ></UploadUdmp>
    </gc-model>
  </div>
</template>

<script setup>
import { computed, nextTick, onActivated, reactive, ref } from 'vue'
import { TALENT_STEP, UPLOAD_FILE_TYPE, TYPE_TEACHER } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
import MockInputTag from '../components/MockInputTag.vue'
import UploadUdmp from '@/components/upload/UploadUdmp.vue'
import { closeCurrPageAndGoPath, downloadFileAsAlink } from '@/util/utils'
import { goToPage } from '@/views/TalentsCultivation/utils'
import { fetchQcFosterSubjectDetail, fetchSaveQcFosterSubjectEvaluate } from '@/fetch/tanlents'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { fileDownload } from '@/util/udmp'
import { useRoute } from '@/router'
import { Message } from 'element-ui'
import store from '@/store'
const { mergeReactive } = useBaseDataEvents()
// const status: 'edit'|'view'
const status = ref('edit')
const topicInfoForm = reactive({
  teacherList: [],
  fileList: []
})
const checkInfoFormRef = ref(null)
const checkInfoForm = reactive({
  evaluateResult: '',
  evaluateFileList: []
})
const checkInfoFormRules = () => {
  const requiredHandle = (message, trigger = 'blur') => ({
    required: true,
    trigger,
    message
  })
  return {
    evaluateResult: [requiredHandle('请输入终审结果')]
  }
}
const formLabelWidth = '100px'

const uploadParams = {}
const uploadFileType = UPLOAD_FILE_TYPE
const renderFileType = computed(() => {
  return uploadFileType.map((item) => `.${item}`).join(' ')
})
const uploadFileSize = 300
const uploadFileSizeText = `${uploadFileSize}m`
const isUploadFile = ref(false)
const uploadHandle = () => {
  isUploadFile.value = true
}
const uploadFinishHandle = (result) => {
  if (result.status !== 'success') return
  const { doc_id, fname } = result.data[0]
  checkInfoForm.evaluateFileList.push({ udmpId: doc_id, fileName: fname, submodule: 'fosterSubject', module: 'fosterSubject' })
  isUploadFile.value = false
}

// 下载文件
async function handleDownloadFile (udmpId) {
  try {
    downloadFileAsAlink(await fileDownload(udmpId))
  } catch (error) {}
}
const closeHandle = () => {
  const path = '/TalentsTopicCheck'
  closeCurrPageAndGoPath({ path })
}
const isSaveing = ref(false)
const saveHandle = () => {
  if (isSaveing.value) return Message.warning('数据请求中，请勿重复发起')
  checkInfoFormRef.value.validate((v) => {
    if (!v) return
    isSaveing.value = true
    const data = { ...checkInfoForm }
    fetchSaveQcFosterSubjectEvaluate({ data })
      .then(() => {
        // 设置待更新状态
        store.commit('updateQueue', '/TalentsTopicCheck')
        Message.success('提交成功')
        closeHandle()
      })
      .finally(() => {
        isSaveing.value = false
      })
  })
}

const _formatTeamDatas = () => {}
const _initData = async (dataId) => {
  const res = await fetchQcFosterSubjectDetail({ id: dataId, isEvaluate: 'Y' })
  res.evaluateFileList = res.evaluateFileList || []
  res.fileList = res.fileList || []

  const { id, subjectDetail, subjectId, subjectName, orgName, projectName, subjectTarget, fileList, evaluateFileList, evaluateResult, customizePlanId, projectTypeDesc } = res
  mergeReactive({
    origin: topicInfoForm,
    target: {
      id,
      orgName,
      projectName,
      subjectDetail,
      subjectId,
      subjectName,
      subjectTarget,
      fileList,
      customizePlanId, 
      projectTypeDesc
    }
  })
  mergeReactive({
    origin: checkInfoForm,
    target: {
      id,
      evaluateFileList,
      evaluateResult
    }
  })

  topicInfoForm.teacherList = res.teamMembers
    .filter((item) => Number(item.isType) === TYPE_TEACHER)
    .map((item) => ({ ...item, empName: item.umName }))
  // topicInfoForm = {
  //   ...this.topicInfoForm,
  //   subjectDetail: res.subjectDetail,
  //   subjectId: res.subjectId,
  //   subjectName: res.subjectName,
  //   subjectTarget: res.subjectTarget,
  //   fileList: res.fileList
  // }

  // this.teamInfoForm = {
  //   ...this.teamInfoForm,
  //   teamName: res.teamName
  // }
  // this._formatTeamDatas(res.teamMembers)
  // this.teamSearchHandle()
}

onActivated(async () => {
  const route = useRoute()
  if (route.params.type) {
    status.value = route.params.type
  }
  if (route.params.id) {
    await _initData(route.params.id)
    await nextTick()
    checkInfoFormRef.value.clearValidate()
  }
})
</script>
<script>
export default {
  name: 'AddTalentsTopicCheck'
}
</script>

<style lang='scss' scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.main-container {
  width: 680px;

  :deep(.el-form) {
    margin: 0 auto;
  }

  .talents-line-input {
    :deep(.el-form-item) {
      margin-right: 0;
    }
    :deep(.el-form-item__content) {
      margin-right: 0;
      width: 240px;
    }
  }
}

.full-wrapper {
  :deep(.el-form-item) {
    width: 100%;
  }

  :deep(.el-form-item__content) {
    width: calc(100% - 100px);
  }
}

.file-content {
  margin-bottom: 10px;
}
</style>