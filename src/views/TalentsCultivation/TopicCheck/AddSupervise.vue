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
              </div>
              <div class="layer-wrapper talents-line-input">
                <el-form-item :label-width="formLabelWidth" label="所属单位">
                  <el-input class="topic-input" maxlength="60" show-word-limit v-model="topicInfoForm.orgName"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="议题导师">
                  <MockInputTag :list="topicInfoForm.teacherList" label="empName" disabled width="260"></MockInputTag>
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
                      <a :href="handleUdmpHref(item.udmpId)" download class="active download-style">{{ item.fileName }}</a>
                    </el-tag>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <div class="topic-info-container">
              <el-form :model="dbInfoForm" ref="dbInfoFormRef" :rules="dbInfoFormRules()" :disabled="status === 'view'" :label-width="formLabelWidth">
                <el-form-item label="督办信息" prop="orgAndHeads">
                  <div class="headers-info-wrapper">
                    <div class="header-container" v-for="(orgHead, headIndex) in dbInfoForm.orgAndHeads" :key="headIndex">
                      <div class="info-wrapper">
                        <!-- 部门 -->
                        <gc-institution
                          class="org-style"
                          v-model="dbInfoForm.orgAndHeads[headIndex].orgs"
                          ref="institutionRef"
                          :left-show="false"
                          busi-type="FL"
                          :fetchParams="{ showBusiType: 'FL' }"
                          @change="(name, row) => handleChangeOrg(row, headIndex)"
                          placeholder="选择议题归属部门"
                        ></gc-institution>
                        <!-- 负责人 -->
                        <MockInputTag
                          :list="dbInfoForm.orgAndHeads[headIndex].orgHeads"
                          @remove="handleRemoveOrgHeadersMember($event, headIndex)"
                          label="empName"
                          :disabled="status === 'view'"
                          width="220"
                          style="vertical-align: middle"
                        ></MockInputTag>
                        <el-button class="add-button-style" type="primary" @click="handleAddOrgHeadersMember(headIndex)">添加议题归属部门责任人</el-button>
                      </div>
                      <div class="control-wrapper">
                        <el-button @click="handleRemoveOrgHeaders(headIndex)" class="button-50-30 button-my-primary-plain ml10 fs0">删除</el-button>
                      </div>
                    </div>
                    <el-button @click="handleAddOrgHeaders" :disabled="dbInfoForm.orgAndHeads.length >= 3" class="button-my-primary-plain fs0">添加议题归属部门及归属部门责任人</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="议题进展及后续计划" prop="evolveAndPlan">
                  <el-input type="textarea" maxlength="500" show-word-limit rows="5" resize="none" v-model="dbInfoForm.evolveAndPlan"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="closeHandle">关闭</el-button>
        <el-button class="button-w80-h30" type="primary" @click="saveHandle" :disabled="status === 'view'">提交</el-button>
      </div>
    </div>

    <!-- 选择导师 -->
    <SelectUserDialog
      title="请选择部门负责人"
      :show.sync="isOrgHeadsDialogShow"
      @save="handleSaveOrgHeads"
      :list="currentOrgHeadsList"
      :maxlen="2"
    ></SelectUserDialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onActivated, reactive, ref, set } from 'vue'
import { TALENT_STEP, UPLOAD_FILE_TYPE, TYPE_TEACHER } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
import MockInputTag from '../components/MockInputTag.vue'
import DeptTreeSelect from '@/components/deptTreeSelect/index'
import { handleUdmpHref, closeCurrPageAndGoPath, CopyObj } from '@/util/utils'
import { goToPage } from '@/views/TalentsCultivation/utils'
import { fetchFindSuperviseAndHandleDetail, fetchQcFosterSubjectDetail, fetchSaveQcFosterSubjectEvaluate, fetchSaveSuperviseAndHandle } from '@/fetch/tanlents'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { useRoute } from '@/router'
import { Message } from 'element-ui'
import store from '@/store'
import SelectUserDialog from '../components/SelectUserDialog.vue'
const { mergeReactive } = useBaseDataEvents()
// const status: 'edit'|'view'
const status = ref('edit')
const topicInfoForm = reactive({
  teacherList: [],
  fileList: []
})
const formLabelWidth = '140px'

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

// ------------------- 督办信息 -------------------

const queryForm = reactive({
  deptIds: []
})
const dbInfoFormRef = ref(null)
const institutionRef = ref([])
const dbInfoForm = reactive({
  jsDeptIds: [],
  // 部门负责人
  orgAndHeads: [{ orgs: [], orgHeads: [], orgInfo: {} }],
  jsDeptLeader: '', // 归属部门责任人
  evolveAndPlan: '' // 议题进展与后续计划
})
const dbInfoFormRules = () => {
  const requiredHandle = (message, trigger = 'blur') => ({
    required: true,
    trigger,
    message
  })
  return {
    jsDeptIds: [requiredHandle('请选择议题归属部门')],
    jsDeptLeader: [requiredHandle('请输入归属部门责任人UM号')],
    evolveAndPlan: [requiredHandle('请输入议题进展与后续计划')],
    orgAndHeads: [
      {
        validator: (rule, value, callback) => {
          if(
            !dbInfoForm.orgAndHeads.length || 
            // 任意heads为空
            dbInfoForm.orgAndHeads.some(row => !row.orgHeads.length) ||
            // 任意没有选部门
            dbInfoForm.orgAndHeads.some(row => !Object.keys(row.orgInfo).length)
          )
          {
            return callback(new Error('请选择归属部门及责任人'))
          }
          return callback()
        },
        trigger: 'blur',
        required: true
      }
    ]
  }
}

const getSuperviseInfo = async (id) => {
  const res = await fetchFindSuperviseAndHandleDetail({ id })
  dbInfoForm.orgAndHeads = res.orgAndHeads.map((row, index) => {
    return {
      orgs: [row.orgId], 
      orgHeads: row.heads.map(headRow => ({umId: headRow.umId, umName: headRow.umName, empName: headRow.umName})),
      orgInfo: {orgId: row.orgId, orgName: row.orgName}
    }
  })
  dbInfoForm.evolveAndPlan = res.evolveAndPlan

  nextTick(() => {
    dbInfoForm.orgAndHeads.forEach((row, index) => {
      institutionRef.value[index].setContentValue([row.orgInfo.orgName])
    })
  })
}

const isOrgHeadsDialogShow = ref(false)
// 当前部门负责人列表
const currentOrgHeadsList = ref([])
// 添加部门负责人信息
const handleAddOrgHeaders = () => {
  dbInfoForm.orgAndHeads.push({ orgs: [], orgHeads: [], orgInfo: {} })
}

// 添加部门负责人成员
const currentOrgHeadIndex = ref(-1)
const handleAddOrgHeadersMember = (index) => {
  isOrgHeadsDialogShow.value = true
  currentOrgHeadIndex.value = index
  currentOrgHeadsList.value = dbInfoForm.orgAndHeads[index].orgHeads
}

// 移除部门负责人成员
const handleRemoveOrgHeadersMember = (rmIndex, rowIndex) => {
  dbInfoForm.orgAndHeads[rowIndex].orgHeads.splice(rmIndex, 1)
}

// 移除部门负责人
const handleRemoveOrgHeaders = (index) => {
  dbInfoForm.orgAndHeads.splice(index, 1)
}

// 选择部门负责人成员确认操作
const handleSaveOrgHeads = (list) => {
  dbInfoForm.orgAndHeads[currentOrgHeadIndex.value].orgHeads = list
  currentOrgHeadIndex.value = -1
}

// 部门切换
const handleChangeOrg = (row, index) => {
  dbInfoForm.orgAndHeads[index].orgInfo = row
}

// ------------------- 关闭/提交 -------------------
const closeHandle = () => {
  const path = '/TalentsTopicCheck'
  closeCurrPageAndGoPath({ path })
}

const formatParams = (params) => {
  const data = CopyObj(params)
  console.log(topicInfoForm, params, '===>>> topicInfoForm')
  data.id = topicInfoForm.id
  data.orgAndHeads = data.orgAndHeads.map((row) => {
    return {
      orgId: row.orgInfo.orgId,
      orgName: row.orgInfo.orgName,
      heads: row.orgHeads.map((head) => ({ umId: head.umId, umName: head.empName }))
    }
  })
  return data
}
const isSaveing = ref(false)
const saveHandle = () => {
  if (isSaveing.value) return Message.warning('数据请求中，请勿重复发起')
  const data = formatParams(dbInfoForm)
  dbInfoFormRef.value.validate(async v => {
    if(!v) return
    await fetchSaveSuperviseAndHandle({ data })
    Message.success('提交成功')
    closeHandle()
  })
  

  // if (status === 'edit') {
  //   checkInfoFormRef.value.validate((v) => {
  //     if (!v) return
  //     isSaveing.value = true
  //     const data = { ...checkInfoForm }
  //     fetchSaveQcFosterSubjectEvaluate({ data })
  //       .then(() => {
  //         // 设置待更新状态
  //         store.commit('updateQueue', '/TalentsTopicCheck')
  //         Message.success('提交成功')
  //         closeHandle()
  //       })
  //       .finally(() => {
  //         isSaveing.value = false
  //       })
  //   })
  // } else if (status === 'edit_db') {
  //   dbInfoFormRef.value.validate((v) => {
  //     if (!v) return
  //     isSaveing.value = true
  //     const data = { ...dbInfoForm }
  //     fetchSaveQcFosterSubjectEvaluate({ data })
  //       .then(() => {
  //         // 设置待更新状态
  //         store.commit('updateQueue', '/TalentsTopicCheck')
  //         Message.success('提交成功')
  //         closeHandle()
  //       })
  //       .finally(() => {
  //         isSaveing.value = false
  //       })
  //   })
  // }
}

const _initData = async (dataId) => {
  const res = await fetchQcFosterSubjectDetail({ id: dataId, isEvaluate: 'Y' })
  res.evaluateFileList = res.evaluateFileList || []
  res.fileList = res.fileList || []

  const { id, subjectDetail, subjectId, subjectName, orgName, projectName, subjectTarget, fileList, evaluateFileList, evaluateResult } = res
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
      fileList
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
  
  await getSuperviseInfo(res.id)
}

onActivated(async () => {
  const route = useRoute()
  if (route.params.type) {
    status.value = route.params.type
  }
  if (route.params.id) {
    await _initData(route.params.id)
    await nextTick()
    checkInfoFormRef.value?.clearValidate()
    dbInfoFormRef.value?.clearValidate()
  }
})
</script>
<script>
export default {
  name: 'AddSupervise'
}
</script>

<style lang="scss" scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.main-container {
  width: 800px;

  :deep(.el-form) {
    margin: 0 auto;
  }

  .talents-line-input {
    :deep(.el-form-item) {
      margin-right: 0;
    }
    :deep(.el-form-item__content) {
      margin-right: 0;
      width: 260px;
    }
  }
}

.full-wrapper {
  :deep(.el-form-item) {
    width: 100%;
  }

  :deep(.el-form-item__content) {
    width: calc(100% - 140px);
  }
}

.file-content {
  margin-bottom: 10px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  .org-style {
    vertical-align: middle;
    margin-right: 10px;
  }
}

.add-button-style {
  vertical-align: middle;
}
</style>