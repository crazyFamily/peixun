<template>
  <div>
    <el-card>
      <StepTopbar current-step="议题创建" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <div class="permission-container talents-container top-container mt10">
      <div class="main-box">
        <div class="main-container">
          <div class="title">
            <div class="title__menu"></div>
            基本信息
          </div>
          <div class="base-info-container">
            <el-button type="primary" @click="choseProjectHandle" :disabled="status === 'view'">选择潜才方案</el-button>
            <span class="tips">说明：请选择需要创建议题的潜才培养项目</span>
            <el-form class="base-info-form" :model="baseInfoForm" :rules="baseFormRules" ref="baseInfoFormRef" :disabled="status === 'view'" inline>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="方案ID" prop="customizePlanId">
                <el-input v-model="baseInfoForm.customizePlanId" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="项目ID" prop="projectId">
                <el-input v-model="baseInfoForm.projectId" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="项目名称" prop="projectName">
                <el-input v-model="baseInfoForm.projectName" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="项目类型" prop="projectType">
                <el-input v-model="baseInfoForm.projectTypeDesc" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="年度" prop="annual">
                <el-input v-model="baseInfoForm.annual" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="所属单位" prop="projectBlg">
                <el-input v-model="baseInfoForm.projectBlg" disabled></el-input>
              </el-form-item>
              <el-form-item class="base-info-item" :label-width="formLabelWidth" label="主办单位" prop="orgs">
                <gc-institution
                  class="talents-instituion"
                  :class="{ disabled: true }"
                  v-model="baseInfoForm.orgs"
                  ref="institutionRef"
                  busi-type="FL"
                  :left-show="false"
                  :fetchParams="{ showBusiType: 'FL' }"
                  disabled
                >
                </gc-institution>
              </el-form-item>
            </el-form>
          </div>
          <div class="title">
            <div class="title__menu"></div>
            议题信息
          </div>
          <div class="topic-info-container">
            <el-form style="width: 86%" :model="topicInfoForm" :rules="topicFormRules" ref="topicInfoFormRef" :disabled="status === 'view'">
              <el-form-item :label-width="formLabelWidth" label="导师" prop="teacher">
                <MockInputTag
                  :list="teamInfoForm.teacherList"
                  @remove="teacherTagRemoveHandle"
                  label="empName"
                  :disabled="status === 'view'"
                  width="220"
                  style="vertical-align: middle"
                ></MockInputTag>
                <el-button type="primary" @click="teacherShowHandle" :disabled="status === 'view' || !baseInfoForm.proId">添加</el-button>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="议题名称" prop="subjectName">
                <el-input maxlength="60" show-word-limit v-model="topicInfoForm.subjectName" @change="subjectNameChangeHandle"></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="5" >
                  <el-form-item :label-width="formLabelWidth" label="议题方向" prop="direction">
                    <gc-select 
                      v-model="topicInfoForm.direction" 
                      :options="subjectDirectionOptions " 
                      :clearable="false"
                      class="w-full subject-direction-select"
                    ></gc-select>
                  </el-form-item>
                </el-col>
                <el-col :span="19" v-if="subjectDirectionIsOther">
                  <el-form-item :label-width="formLabelWidth" label="其他说明" :prop="subjectDirectionIsOther ? 'directionIllustrate' : ''">
                    <el-input 
                      placeholder="如人才培养、团队管理等"
                      maxlength="10" 
                      show-word-limit 
                      v-model="topicInfoForm.directionIllustrate"
                      />
                  </el-form-item>
                </el-col>
              </el-row>
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
              <el-form-item :label-width="formLabelWidth" label="议题详情" prop="subjectDetail">
                <el-input
                  type="textarea"
                  resize="none"
                  rows="8"
                  maxlength="800"
                  show-word-limit
                  v-model="topicInfoForm.subjectDetail"
                  placeholder="突出当前业务痛点/发展方向/创新模式等"
                ></el-input>
              </el-form-item>
              <el-form-item class="plan-infomation-item" :label-width="formLabelWidth" label="附件" prop="fileList">
                <el-button type="primary" @click="uploadHandle" :disabled="status === 'view' || !baseInfoForm.proId">上传文件</el-button>
                <span class="tips">支持扩展名：{{ renderFileType }}, 每次上传附件大小限制在{{ uploadFileSize }}以内</span>
                <div class="file-container other-type">
                  <div class="file-content" :class="{ 'no-margin': index === 0 }" v-for="(item, index) in topicInfoForm.fileList" :key="index">
                    <el-tag :closable="status !== 'view'" @close="topicInfoForm.fileList.splice(index, 1)">
                      <span @click="handleDownloadFile(item.udmpId)" download class="active download-style">{{ item.fileName }}</span>
                    </el-tag>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="title">
            <div class="title__menu"></div>
            战队信息
          </div>
          <div class="team-info-container">
            <el-form
              class="base-info-form team-info-form"
              :model="teamInfoForm"
              :rules="teamFormRules"
              ref="teamInfoFormRef"
              :disabled="status === 'view'"
              inline
            >
              <el-form-item class="team-info-item" :label-width="formLabelWidth" label="战队名称" prop="teamName" :rules="{ required: selectedTeamList.length, message: '请输入战队名称' }">
                <el-input v-model="teamInfoForm.teamName" class="input-width"></el-input>
              </el-form-item>
              <el-form-item class="team-info-item" :label-width="formLabelWidth" label="战队长" prop="captain">
                <gc-select
                  v-model="captainName"
                  :clearable="true"
                  :options="captainOptionList"
                  @change="captainSelectedHandle"
                  k="renderName"
                  v="umId"
                  style="padding: 0"
                  class="input-width"
                ></gc-select>
              </el-form-item>
              <el-form-item class="team-info-item long-content" :label-width="formLabelWidth" label="战队成员" prop="team">
                <div class="input-container">
                  <gc-select
                    v-model="teamName"
                    filterable
                    remote
                    :remote-method="handleTeamSearch"
                    :options="teamOptionList"
                    :loading="isTeamLoading"
                    @change="teamSelectedHandle"
                    @visible-change="teamSelectVisibleHandle"
                    k="renderName"
                    v="umId"
                    style="padding: 0; display: inline-block; margin-right: 10px"
                    class="input-width"
                  ></gc-select>
                  <el-button type="primary" @click="isUploadTeamFile = true" :disabled="status === 'view' || !baseInfoForm.proId">批量添加</el-button>
                </div>
                <div class="team-member">
                  <el-scrollbar style="height: 100%">
                    <el-tag
                      :closable="status !== 'view'"
                      style="margin-right: 10px; margin-bottom: 10px"
                      v-for="(item, index) in selectedTeamList"
                      :key="index"
                      @close="teamMemberRemoveHandle(index)"
                      >{{ item.empName }}</el-tag
                    >
                  </el-scrollbar>
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

      <!-- 项目有多个的弹窗选择 -->
      <MultipleSelect :show.sync="isMultipleProject" :columns="mutileColumns" :tableList="multipleTableList" @save="mutileSelectComfirmHandle">
      </MultipleSelect>

      <!-- 上传文件的弹窗 -->
      <gc-model :visible.sync="isUploadFile" :isShowFooter="false" title="请选择上传文件">
        <UploadUdmp
          :accept="uploadFileType"
          @uploadFinish="uploadFinishHandle"
          :size="300"
          ref="headquarterUploadRef"
        ></UploadUdmp>
      </gc-model>

      <!-- 选择导师 -->
      <SelectUserDialog
        title="请选择导师"
        :show.sync="isTeacherDialogShow"
        :proId="baseInfoForm.proId"
        @save="teacherSaveHandle"
        :list="teamInfoForm.teacherList"
        :maxlen="3"
      ></SelectUserDialog>

      <!-- 批量添加战队成员 -->
      <TanlentsUpload
        :show.sync="isUploadTeamFile"
        :templateCode="'TANLENTS_TOPIC_TEAM'"
        :fetchFn="fetchQcSubjectTeam"
        :upload-params="baseInfoForm.id ? { proId: baseInfoForm.proId, id: baseInfoForm.id } : { proId: baseInfoForm.proId }"
        @comfirm="imortSuccessHandle"
      ></TanlentsUpload>
    </div>
  </div>
</template>
<script setup>
import { TALENT_STEP, UPLOAD_FILE_TYPE } from '@/views/TalentsCultivation/enum'
import StepTopbar from '../components/StepTopbar.vue'
defineExpose({ UPLOAD_FILE_TYPE })
</script>
<script>
import UploadUdmp from '@/components/upload/UploadUdmp.vue'
import { fileDownload } from '@/util/udmp'
import {
  fetchAddOrEditQcFosterSubject,
  fetchQcFosterSubjectDetail,
  fetchQryUsers,
  fetchQcFosterPlans,
  fetchQcSubjectTeam
} from '@/fetch/tanlents'
import MultipleSelect from '../components/MultipleSelect.vue'
import MockInputTag from '../components/MockInputTag.vue'
import TanlentsUpload from '../components/TanlentsUpload.vue'
import { closeCurrPageAndGoPath, downloadFileAsAlink, customHint } from '@/util/utils'
import { goToPage } from '@/views/TalentsCultivation/utils'
import SelectUserDialog from '../components/SelectUserDialog.vue'
import { PROJECT_STATUS, PROJECT_STATUS_DONE, SUBJECT_DIRECTION_OPTIONS, SUBJECT_DIRECTION_QT } from '@/views/TalentsCultivation/enum'
import { Message } from 'element-ui'
import store from '@/store'

export default {
  name: 'AddTalentsTopic',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      baseInfoForm: {
        subjectName: '',
        orgs: [],
        teamList: []
      },
      topicInfoForm: {
        subjectName: '',
        subjectTarget: '',
        subjectDetail: '',
        direction: '', // 议题方向
        directionIllustrate: '',
        fileList: []
      },
      subjectDirectionOptions: SUBJECT_DIRECTION_OPTIONS,
      baseFormRules: {},
      topicFormRules: {
        subjectName: [requiredHandle('请输入议题名称')],
        subjectTarget: [requiredHandle('请输入议题目标')],
        subjectDetail: [requiredHandle('请输入议题详情')],
        direction: [requiredHandle('请选择议题方向')],
        directionIllustrate: [requiredHandle('请输入议题方向其他说明')],
      },
      teamFormRules: {},
      status: 'create',
      formLabelWidth: '100px',
      uploadFileType: UPLOAD_FILE_TYPE,
      uploadFileSize: '300m',
      isMultipleProject: false,
      mutileColumns: [
        {
          type: 'selection'
        },
        {
          label: '项目ID',
          prop: 'projectId'
        },
        {
          label: '项目名称',
          prop: 'projectName'
        },
        {
          label: '年度',
          prop: 'annual'
        },
        {
          label: '项目类型',
          prop: 'projectTypeDesc'
        },
        {
          label: '方案ID',
          prop: 'customizePlanId',
          width: '100px'
        },
        {
          label: '所属单位',
          prop: 'orgName'
        },
        {
          label: '方案状态',
          formatter: row => PROJECT_STATUS[row.status]
        }
      ],
      multipleTableList: [],
      isUploadFile: false,
      uploadParams: {},
      uploadType: 'PLAN',
      planUploadFile: {},
      teamInfoForm: {
        teamName: '',
        teacherList: [],
        teamList: []
      },
      // captainOptionList: [],
      userQueryForm: {
        total: 0,
        currPage: 1,
        pageSize: 50
      },
      captainName: '',
      captainInfo: {},
      isCaptainLoading: false,
      teamOptionList: [],
      isTeamLoading: false,
      teamName: '',
      selectedTeamList: [],
      isTeacherDialogShow: false,
      isSaveing: false,
      isUploadTeamFile: false,
      fetchQcSubjectTeam,
      fileDownload,
      downloadFileAsAlink
    }
  },

  components: {
    UploadUdmp,
    MultipleSelect,
    MockInputTag,
    SelectUserDialog,
    TanlentsUpload
  },

  computed: {
    renderFileType() {
      return this.uploadFileType.map((item) => `.${item}`).join(' ')
    },
    captainOptionList() {
      let res = []
      this.selectedTeamList.forEach((item) => {
        if (res.find((findItem) => findItem.umId === item.umId)) {
          return
        }
        res.push({ ...item, renderName: item.umName || item.empName })
      })
      return res
    },
    subjectDirectionIsOther () {
      return this.topicInfoForm.direction === SUBJECT_DIRECTION_QT
    }
  },

  mounted() {},

  methods: {
    // 下载文件
    async handleDownloadFile (udmpId) {
      try {
        this.downloadFileAsAlink(await this.fileDownload(udmpId))
      } catch (error) {}
    },
    async _initData() {
      this.status = this.$route.params.type || this.status
      if (this.$route.params.id) {
        let res = await fetchQcFosterSubjectDetail({
          id: this.$route.params.id
        })
        this.baseInfoForm = {
          ...this.baseInfoForm,
          ...this._formatRanderData({
            id: res.id,
            annual: res.annual,
            lineGroupId: res.lineGroupId,
            lineName: res.lineName,
            orgId: res.orgId,
            orgName: res.orgName,
            organId: res.organId,
            organName: res.organName,
            customizePlanId: res.customizePlanId,
            planId: res.planId,
            proId: res.proId,
            projectId: res.projectId,
            projectName: res.projectName,
            projectType: res.projectType,
            projectTypeDesc: res.projectTypeDesc,
            projectBlg: res.projectBlg,
          })
        }
        this.topicInfoForm = {
          ...this.topicInfoForm,
          subjectDetail: res.subjectDetail,
          subjectId: res.subjectId,
          subjectName: res.subjectName,
          subjectTarget: res.subjectTarget,
          fileList: res.fileList,
          direction: res.direction,
          directionIllustrate: res.directionIllustrate
        }
        this.teamInfoForm = {
          ...this.teamInfoForm,
          teamName: res.teamName
        }
        this._formatTeamDatas(res.teamMembers)
        // this.handleTeamSearch()
      }

      // 不能从缓存取，会导致页签切换后会被重置
      if (this.$route.params.planData && this.$route.params.type === 'create') {
        this.baseInfoForm = {
          ...this.baseInfoForm,
          ...this._formatRanderData(this.$route.params.planData)
        }
      }
      if (!this.$route.params.planData && this.$route.params.type === 'create') {
        this._resetData()
        this.$nextTick(() => {
          this.$refs.baseInfoFormRef.clearValidate()
          this.$refs.topicInfoFormRef.clearValidate()
          this.$refs.teamInfoFormRef.clearValidate()
        })
      }
    },
    _formatTeamDatas(data, excludeTeacher = false, isImport = false) {
      if (!data.empName) data.empName = data.umName
      if (!data.umName) data.umName = data.empName
      let capdata = data.find((item) => Number(item.isType) === 2)
      capdata &&
        (this.captainInfo = {
          umId: capdata.umId,
          umName: capdata.umName,
          empName: capdata.umName
        })
      console.log(this.captainInfo, data, '---')
      this.captainName = this.captainInfo.umName
      if (isImport) {
        let resultList = []
        const cacheArr = data.map((item) => ({
          ...item,
          empName: item.umName
        }))
        cacheArr.forEach(item => {
          if(this.selectedTeamList.find(row => row.umId === item.umId)) return
          resultList.push(item)
        })
        this.selectedTeamList = this.selectedTeamList.concat(resultList)
      } else {
        this.selectedTeamList = data
          .filter((item) => [1].includes(Number(item.isType)))
          // .filter((item) => Number(item.isType) === 1)
          .map((item) => ({
            ...item,
            empName: item.umName
          }))
      }
      // .filter((item) => Number(item.isType) === 1)
      // this.captainOptionList = this.selectedTeamList.map((item) => ({
      //   ...item,
      //   renderName: item.umName
      // }))
      if (excludeTeacher) return
      this.teamInfoForm.teacherList = data.filter((item) => Number(item.isType) === 0).map((item) => ({ ...item, empName: item.umName }))
    },
    _formatParams() {
      let params = {
        ...this.baseInfoForm,
        ...this.topicInfoForm,
        ...this.teamInfoForm
      }
      console.log(params.teacherList, this.selectedTeamList)
      // 类型:0-导师，1-队员，2-战队长
      params.teamList = params.teacherList
        .map((item) => ({
          umId: item.umId,
          umName: item.empName,
          isType: '0'
        }))
        .concat(
          this.selectedTeamList.map((item) => ({
            umId: item.umId,
            umName: item.empName,
            isType: '1'
          }))
        )

      // 需求变更：战队长改为非必填，这里如果没有的话，没必要加入到结果去
      if (this.captainInfo.umId && (this.captainInfo.empName || this.captainInfo.umName)) {
        params.teamList = params.teamList.concat([
          {
            umId: this.captainInfo.umId,
            umName: this.captainInfo.empName,
            isType: '2'
          }
        ])
      }

      params.oprType = params.id ? 'edit' : 'add'

      params.orgId = params.orgs[params.orgs.length - 1]
      Reflect.deleteProperty(params, 'orgs')
      Reflect.deleteProperty(params, 'teacherList')
      return params
    },
    // 校验保存信息
    _validateSaveInfo() {
      let validator = true
      if (!this.baseInfoForm.projectId) {
        this.$message.warning('请先选择潜才项目')
        return false
      }
      this.$refs.baseInfoFormRef.validate((v) => {
        if (!v) validator = false
      })
      this.$refs.topicInfoFormRef.validate((v) => {
        if (!v) validator = false
      })
      this.$refs.teamInfoFormRef.validate((v) => {
        if (!v) validator = false
      })
      return validator
    },
    async saveHandle() {
      if (!this._validateSaveInfo()) return
      if (this.isSaveing) return
      let data = this._formatParams()
      await fetchAddOrEditQcFosterSubject({ data })
      this.$message.success('保存成功')
      // 设置待更新状态
      store.commit('updateQueue', '/TanlentsTopicManagement')
      this.closeHandle()
    },
    closeHandle() {
      // let { name } = this.$router.getRoutes().find((item) => item.path === '/TanlentsTopicManagement')
      closeCurrPageAndGoPath({ path: this.$route.path })
      // this.$router.push({ name })
    },
    _resetData() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    },
    selectionHandle() {},
    userComfirmHandle() {},
    faildExportHandle() {},
    uploadFinishHandle(result) {
      if (result.status !== 'success') return
      let { doc_id, fname } = result.data[0]
      this.topicInfoForm.fileList.push({ udmpId: doc_id, fileName: fname })
      this._resetUploadData()
    },
    _resetUploadData() {
      this.uploadType = 'PLAN'
      this.isUploadFile = false
    },
    async choseProjectHandle() {
      let { list } = await fetchQcFosterPlans()
      if (!list.length) {
        await customHint('由于您未创建任何培养方案记录，导致查询结果为空。点击确定去创建培养方案记录', '提示', '取消')
        return goToPage('/AddTalentsCultivationPlan', this.$router, { type: 'create' })
        // return this.$message.warning('没有查询到方案信息')
      }
      if (list.length === 1) {
        this._mergeBaseInfoHandle(list[0])
        this.handleTeamSearch()
      }
      if (list.length > 1) {
        this.isMultipleProject = true
        this.multipleTableList = list.map(row => ({...row, disabledSelect: row.status !== PROJECT_STATUS_DONE}))
      }
    },
    mutileSelectComfirmHandle(data) {
      this._mergeBaseInfoHandle(data)
      // this.handleTeamSearch()
    },
    async teacherTagRemoveHandle(index) {
      // if(this.status === 'edit') {
      //   await customHint('删除导师会同步删除该导师对学员的评价，请确认是否删除导师', '提示', '取消')
      // }
      this.teamInfoForm.teacherList.splice(index, 1)
    },
    _mergeBaseInfoHandle(data) {
      this.baseInfoForm = Object.assign({}, this.baseInfoForm, this._formatRanderData(data))
    },
    _formatRanderData(data) {
      data.orgs = [data.orgId]

      // 如果有null的，清掉它
      Object.keys(data).forEach((key) => {
        if (data[key] === null) Reflect.deleteProperty(data, key)
      })

      this.$refs.institutionRef.content = [data.orgName]
      return data
    },
    captainSelectedHandle(value) {
      if (!value) {
        this.captainInfo = {}
      } else {
        this.captainInfo = this.captainOptionList.find((item) => item.umId === value)
      }
    },
    async handleTeamSearch(value) {
      // if (!this.baseInfoForm.projectId) {
      //   this.$message.warning('请先选择潜才项目')
      //   return false
      // }
      this.isTeamLoading = true
      try {
        this.teamOptionList = (await this._getUserDatas(value)).filter((item) => {
          return !this.selectedTeamList.some((selectedItem) => selectedItem.umId === item.umId)
        })
      } finally {
        this.isTeamLoading = false
      }
    },
    teamSelectedHandle(value) {
      if (!value) return
      let selectedItemIndex = this.teamOptionList.findIndex((item) => item.umId === value)
      let selectedItem = this.teamOptionList.splice(selectedItemIndex, 1)[0]
      this.selectedTeamList.push(selectedItem)
      this.$nextTick(() => {
        this.teamName = ''
      })
    },
    async _getUserDatas(value) {
      let data = this.userQueryForm
      let { list } = await fetchQryUsers({
        data: {
          ...data,
          user: value,
          type: 'qc',
          // proId: this.baseInfoForm.proId
        }
      })
      return list.map((item) => ({
        ...item,
        renderName: `${item.empName}(${item.umId})`
      }))
    },
    teamMemberRemoveHandle(index) {
      this.selectedTeamList.splice(index, 1)
    },
    teacherShowHandle() {
      this.isTeacherDialogShow = true
    },
    async getAdvisersDatas() {
      let data = this.advisersQueryForm
      let { total, list } = await fetchQryUsers({
        data: { ...data, type: 'qc', proId: this.baseInfoForm.proId }
      })
      this.advisersTableList = list
      this.advisersQueryForm.total = total
    },
    teacherSaveHandle(list) {
      this.teamInfoForm.teacherList = list
    },
    imortSuccessHandle(list) {
      this._formatTeamDatas(list, true, true)
    },
    async uploadHandle() {
      try {
        await this.uploadTips()
        this.isUploadFile = true
      } catch {}
    },
    // 上传操作的二次提示
    uploadTips() {
      return new Promise((resolve, reject) => {
        if (!['28002', '28003'].includes(this.baseInfoForm.projectType)) return resolve()
        let tips
        if (this.baseInfoForm.projectType === '28002') {
          tips = '所选议题是否经条线长审核同意'
        }
        if (this.baseInfoForm.projectType === '28003') {
          tips = '所选议题是否经机构行领导审核同意'
        }
        this.$confirm('请您确认！', tips, {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout topic-tips-style'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject()
          })
      })
    },
    subjectNameChangeHandle(value) {
      this.$nextTick(() => {
        this.teamInfoForm.teamName = value
      })
    },
    teamSelectVisibleHandle(status) {
      // 展开的时候做一层过滤
      if(!status || !this.teamOptionList.length) return
      const resultList = []
      this.teamOptionList.forEach(item => {
        // if(this.selectedTeamList.find(row => row.umId.toLocaleUpperCase() === item.umId.toLocaleUpperCase())) return
        if(this.selectedTeamList.find(row => row.umId === item.umId)) return
        resultList.push(item)
      })
      this.teamOptionList = resultList
    }
  },
  activated() {
    this._initData()
  }
}
</script>
<style lang='scss' scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.talents-container.top-container {
  .base-info-item {
    width: 30%;
  }
}

.file-content {
  margin-top: 15px;
}

.team-member {
  width: 300px;
  height: 150px;
  border: 1px solid $line-color-2;
  margin-top: 15px;
  padding: 15px;
}

.team-info-item {
  width: 49%;
}

.input-width {
  width: 220px;
  :deep(.el-select) {
    width: 100%;
  }
}

.download-style {
  text-decoration: underline;
}
.form-item-df {
  :deep(.el-form-item__content) {
    display: inline-flex;
    align-items: center;
  }
}

.long-content {
  :deep(.el-form-item__content) {
    max-width: calc(100% - 180px);
  }
}

.talents-instituion.disabled {
  background-color: #f7f8fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
  :deep(.input) {
    color: #b4b6bc;
  }
}
</style>
<style lang="scss">
.topic-tips-style {
  .el-message-box__message p {
    color: $themeColor;
  }
}
.subject-direction-select {
  padding: 0 !important;
}
</style>