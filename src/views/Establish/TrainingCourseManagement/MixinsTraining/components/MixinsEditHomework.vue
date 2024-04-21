<template>
  <div class="editor-wrapper"
    v-if="isShow"
    v-loading="isListLoading">
    <div class="home-container">
      <el-form class="base-info-form" :model="baseInfoForm" :rules="baseFormRules" ref="baseInfoFormRef">
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="作业名称" prop="assignmentTitle">
          <el-input
            class="content-style"
            v-model="baseInfoForm.assignmentTitle"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="作业说明" prop="assignmentContent">
          <gc-editor
            ref="editorRef"
            @change="editorChangeHandle"
            :content-text="detailContent"
            :allow-upload="false"
          ></gc-editor>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="附件" prop="picList">
          <div class="upload-container">
            <el-upload 
              drag
              action=""
              ref="uploadRef"
              class="hq-upload"
              :auto-upload="true"
              :http-request="handleUpload"
              list-type="picture-card"
              :accept="acceptFileType.join(',')"
              :before-upload="uploadInterceptor"
              :on-change="handleChange"
              :show-file-list="false"
              v-bind="$attrs">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">点击上传</div>
              <div slot="tip" class="el-upload__tip">支持扩展：{{acceptFileType.join(',')}}，且单个文件大小不超过500Mb</div>
            </el-upload>
          </div>
          <div class="drop-container" ref="dropContainerRef">
            <div class="attachement-container" v-for="(attach, index) in baseInfoForm.fileInformationList" :key="attach.udmpId" :data-id="attach.udmpId">
              <div class="drop attach-drag-tag drop-icon-container">
                <img class="m-r-10" src="@/assets/svg/drop-icon.svg" alt="" />
                <el-input readonly v-model="attach.name" style="width:100%;"></el-input>
              </div>
              <div class="footer-bar">
                <span class="size-info">文件大小：{{attach.fileSize}}</span>
                <span class="btn" v-if="isImage(attach.name) || isVideo(attach.name) || isAudio(attach.name) || isPreview(attach.name)" type="primary" @click="handleReview(attach)"><i class="el-icon-view"></i></span>
                <span class="btn ml10"  @click="handleRemove(index)"><i class="el-icon-delete"></i></span>
                <div class="control-container">
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="作业类型" prop="assignmentType">
          <div slot="label" class="aic">
            作业类型
            <el-tooltip placement="bottom" popper-class="whiteness" effect="light">
              <div slot="content" style="width: 300px">
                <p class="mt5">1、文字作业：学员只上传文字</p>
                <p class="mt5">2、图文/视频作业：学员上传文字+图片/视频，图片支持jpg、png格式，单张图片不超过5M；视频支持mp4、mov格式，单个视频不超过100M</p>
                <p class="mt5">3、文档作业：学员上传文字+文档，文档支持pdf，xls，xlsx，doc，docx，不超过50M</p>
                <p class="mt5">4、每次最多只能提交3个文件（图片、视频、文档合计）</p>
              </div>
              <i class="el-icon-warning active"></i>
            </el-tooltip>
          </div>
          <el-radio-group v-model="baseInfoForm.assignmentType">
            <el-radio :label="0">文字作业</el-radio>
            <el-radio :label="1">图文/视频作业</el-radio>
            <el-radio :label="2">文档作业</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="字数要求" prop="wordLimit">
          <div slot="label" class="aic">
            字数要求
            <el-tooltip placement="bottom" popper-class="whiteness" effect="light">
              <div slot="content" style="width: 300px">
                <p class="mt5">是：如果少于规定的字数，学员在移动端将无法提交</p>
                <p class="mt5">否：无字数要求，但文字类型作业必须输入文字才能提交</p>
              </div>
              <i class="el-icon-warning active"></i>
            </el-tooltip>
          </div>
          <div :class="{'info-content':baseInfoForm.wordLitmitFlag}">
            <el-switch v-model="baseInfoForm.wordLitmitFlag" class="m-r-10"
              active-color="#36B876" inactive-color="#e4e7ed"
              active-text="" inactive-text="" 
              :active-value="1" :inactive-value="0"
              @change="wordLimitFlagChange"
            ></el-switch>
            <div v-show="baseInfoForm.wordLitmitFlag==1">
              <span class="m-r-10">作业不少于</span>
              <el-input
                class="content-style"
                v-model="baseInfoForm.wordLimit"
                style="width: 160px"
                maxlength="4"
                ><template slot="append">字</template>
              </el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="提交截止时间" prop="deadlineFlag">
          <div :class="{'info-content':baseInfoForm.deadlineFlag}">
            <el-switch v-model="baseInfoForm.deadlineFlag" class="m-r-10"
              active-color="#36B876" inactive-color="#e4e7ed"
              active-text="" inactive-text="" 
              :active-value="1" :inactive-value="0"
              @change="deadlineFlagChange"
            ></el-switch>
            <el-date-picker
              v-if="baseInfoForm.deadlineFlag"
              type="datetime"
              class="w-160 clearable-data-pick m-r-10"
              placeholder="选择日期"
              v-model="baseInfoForm.deadline"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              popper-class="date-picker big-zindex"
              :disabled="baseInfoForm.deadlineFlag==0"
            >
            </el-date-picker>
            <span class="m-r-10" v-if="baseInfoForm.deadlineFlag">逾期能否提交</span>
            <el-switch v-if="baseInfoForm.deadlineFlag"
              v-model="baseInfoForm.allowDeadlineSubmit" 
              active-color="#36B876" inactive-color="#e4e7ed"
              active-text="" inactive-text="" 
              :active-value="1" :inactive-value="0"
              @change="exceedLimitFlagChange"
            ></el-switch>
          </div>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="查看他人作业" prop="allowOthersSee">
          <el-radio-group v-model="baseInfoForm.allowOthersSee">
            <el-radio :label="0">不允许查看</el-radio>
            <el-radio :label="1">提交后查看</el-radio>
            <el-radio :label="2">允许直接查看</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="允许重新提交作业" prop="allowRepeatSubmit">
          <div slot="label" class="aic">
            允许重新提交作业
            <el-tooltip placement="bottom" popper-class="whiteness" effect="light">
              <div slot="content" style="width: 300px">
                <p class="mt5">是：只要在截止时间内，用户可修改已提交的作业，重新提交</p>
                <p class="mt5">否：提交后不可再修改作业</p>
              </div>
              <i class="el-icon-warning active"></i>
            </el-tooltip>
          </div>
          <el-switch v-model="baseInfoForm.allowRepeatSubmit" 
            active-color="#36B876" inactive-color="#e4e7ed"
            active-text="" inactive-text="" 
            :active-value="1" :inactive-value="0"
            @change="resubmitFlagChange"
          ></el-switch>
        </el-form-item>
      </el-form>
      
      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" type="plain" @click="returnHomework"><i class="add-icon"></i>取消</el-button>
        <el-button class="button-w80-h30" type="primary" @click="submitHomework"><i class="add-icon"></i>确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import store from '@/store'
import { UPLOAD_STATUS_SCZ, UPLOAD_STATUS_SCCG, UPLOAD_STATUS_YSC } from '@/components/upload/emun'
import UploadUdmp from '@/components/upload/UploadUdmp.vue'
import { uploadFileToUdmp, updateId as updateUdmpId, getUdmpFileInfo } from '@/util/udmp'
import { nextTick, reactive, ref, watch,computed,onMounted } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { CopyObj } from '@/plugins/until'
import { findAssignmentDetail, saveAssignment } from '@/fetch/establish'
import { MIXINS_SUBJECT_TYPE_CLASS } from '@/views/Establish/enum'
import { getLoadingStatus, handleUdmpHref,getCurrentTime,isImage,isVideo,isAudio,isPreview,throttle,getRightFileSize } from '@/util/utils'
import { Message } from 'element-ui'
import Sortable from 'sortablejs'
import gcEditor from '@/components/editor'

const emit = defineEmits('update:show', 'save', 'close')

const props = defineProps({
  businessId: {
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  },
  assignmentInfo: {type:Object, default:_=>{
    return {}
  }}
})
const { mergeReactive } = useBaseDataEvents()

const initData = async () => {
  if (props.businessId && props.assignmentInfo.assignmentId) {
    const data = {
      businessId: props.businessId,
      assignmentId: props.assignmentInfo.assignmentId,
      businessType: 'class'
    }
    const res = await findAssignmentDetail({ data })
    res.fileInformationList = res.fileInformationList.map(row => ({
      udmpId: row.udmpId,
      name: row.fileName,
      fileUrl:row.fileUrl,
      fileSize: getRightFileSize(row.fileSize),
      sizes: row.fileSize
    }))
    res.wordLitmitFlag = res.wordLimit>0?1:0
    res.deadlineFlag = !res.deadline?0:1
    // res.allowDeadlineSubmit = !res.deadline?0:1
    setTimeout(_=>{
      detailContent.value = res.assignmentContent
    },250)
    
    mergeReactive({ origin: baseInfoForm, target: res })
    initSortable(dropEndSortList)
  }
}

const isListLoading = computed(() => {
  return getLoadingStatus('LOADING_LIST_ASSIGNMENT') ||
  getLoadingStatus('LOADING_SAVE_ASSIGNMENT') ||
  getLoadingStatus('LOADING_FIND_ASSIGNMENT_DETAIL') ||
  getLoadingStatus('LOADING_UPDATE_ASSIGNMENT_SORT_NO') || 
  getLoadingStatus('LOADING_LIST_ASSIGNMENT_COMMENT')
})
const isCanSubmit = ref(false)
const uploadFinishHandle=({ sucessList, errorList, succBatchId, failBatchId })=> {
  isCanSubmit.value = Boolean(sucessList.length || succBatchId)
  console.log(sucessList)
  // successBatchId.value = succBatchId
  // errorBatchId.value = failBatchId
}
const acceptFileType = ref(['mp3','mp4','rar','zip','doc','docx','pdf','ppt','jpg','png','jpeg'])
const isIntercept = ref(false)
// 上传文件控制
function uploadInterceptor(file) {
  isIntercept.value = false
  if (file.size / 1024 / 1024 > 500) {
    isIntercept.value = true
    return Message.warning(`文件大小限制在500Mb以内,“${file.name}”不能上传`)
  }
  return file
}

const attachmentList=ref([])
function handleUpload({ file }) {
  udmpUpload({ file })
}
const handleChange=(file,fileList)=>{
  console.log(file.url)
  fileList.forEach(item=>{
    item.fileSize = getRightFileSize(item.size)
  })

  addFile(fileDataList.value, file)
  initSortable(dropEndSortList)
}
const currentFileUid = ref('')
const addFile = (arr, file, isNew = true) =>{
  const size = isNew ? file.size : file.fileSize
  const mbValue = 1024 * 1024
  const uploadUser = !isNew ? file.createdByName : `${store.state.userInfo.empName}(${store.state.userInfo.umId})`
  arr.push({
    url:file.url,
    uid: file.uid || file.udmpId,
    fileName: file.name || file.fileName,
    fileSize: size >= mbValue ? (size / 1024 / 1024).toFixed(1) + 'MB' : Math.round(size / 1024) + 'KB',
    uploadUser: uploadUser,
    uploadDate: !isNew ? file.createdDate : getCurrentTime(true),
    percentage: 0,
    uploadStatus: !isNew ? UPLOAD_STATUS_YSC : UPLOAD_STATUS_SCZ, // 0(上传中), 1 (上传成功), 2 (已上传)
    udmpId: !isNew ? file.udmpId : '',
    sizes: !isNew ? file.fileSize : 0,
    isNew
  })
}
const fileDataList = ref([])
const isUploading = computed(() => {
  return fileDataList.value.some((m) => m.uploadStatus === UPLOAD_STATUS_SCZ)
})
const udmpUpload = ({ file })=> {
  if (isIntercept.value) return
  currentFileUid.value = file.uid
  uploadFileToUdmp([{ file }])
  .then(res => {
    if (res.length) {
      const [fileData] = res
      currentFileUid.value = ''
      const uploadFile = fileDataList.value.find(m => m.uid === file.uid)
      uploadFile.udmpId = fileData.doc_id
      uploadFile.sizes = fileData.file.size
      uploadFile.name = fileData.file.name
      uploadFile.fileUrl = file.url
      uploadFile.uploadStatus = UPLOAD_STATUS_YSC
      baseInfoForm.fileInformationList.push(uploadFile)
    }
  }).catch(err => {
    console.log(err, '错误');
  })
}

// 拖拽初始化
const dropContainerRef = ref(null)
let sortableInt = null
const initSortable = (onEndCallback) => {
  sortableInt = new Sortable(dropContainerRef.value, {
    handle: '.attach-drag-tag',
    dataIdAttr: 'data-id',
    animation: 150,
    onEnd(event) {
      onEndCallback && onEndCallback(sortableInt.toArray())
    }
  })
}

// 拖拽结束，触发回调，原因数列根据返回的数列进行排弃调整
const dropEndSortList = (result) => {
  const subjectMap = baseInfoForm.fileInformationList.reduce((prevValue, currentVaue) => {
    prevValue[currentVaue.udmpId] = currentVaue
    return prevValue
  }, {})
  baseInfoForm.fileInformationList = result.map(row => subjectMap[row])
  saveSortResult()
}

// 保存排序结果
const saveSortResult = async () => {
  baseInfoForm.fileInformationList.map((row, i) => ({
    businessId: props.businessId,
    udmpId: row.udmpId,
    subjectType: MIXINS_SUBJECT_TYPE_CLASS,
    sortNo: i
  }))
}
const editorRef = ref(null)
const uploadRef = ref(null)
const baseInfoFormRef = ref(null)
const resetData = async () => {
  await nextTick()
  detailContent.value = ''
  editorRef.value.enable()
  uploadRef.value.clearFiles()
  mergeReactive({ origin: baseInfoForm, target: baseParams })
  baseInfoForm.fileInformationList = []
  baseInfoFormRef.value.clearValidate()
}

const isShow = ref(false)
watch(
  () => props.show,
  async (n) => {
    isShow.value = n
    if(!n) {
      editorRef.value.disable()
      return
    }
    await resetData()
    initData()
  }
)


const editorContLen=ref(0)
const detailContent=ref('')
// 监听富文本组件回调
const editorChangeHandle = (data)=> {
  baseInfoForm.assignmentContent = data.content
  editorContLen.value = data.len
}
// --------------- 弹窗处理 ---------------
const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

const handleCancel = () => {
  handleClose()
}

// 去空格
const filterSpace = (value) => {
  return value.replace(/(^\s+)|(\s+$)/g, '')
}
const handleSave = () => {
  baseInfoForm.assignmentId = baseInfoForm.assignmentId || undefined
  baseInfoFormRef.value.validate(async (v) => {
    if (!v) return
    await saveAssignment({ data: {...baseInfoForm, assignmentContent: filterSpace(baseInfoForm.assignmentContent) }, })
    Message.success(props.businessId && props.assignmentInfo.assignmentId ? '修改成功' : '添加成功')
    handleClose()
    emit('save')
  })
}

const formLabelWidth = '140px'
const baseParams = {
  assignmentId:'',
  businessId: props.businessId,
  businessType:'class',//业务类型
  assignmentTitle:'',//作业名称
  assignmentContent:'',//作业说明
  assignmentType:0,//作业类型:0文字作业，1图文/视频作业，2文档作业
  wordLimit:0,//最少字数要求
  deadline:null,//提交截止日期
  allowDeadlineSubmit:0,//逾期能否提交:0否，1是
  deadlineFlag:0,
  wordLitmitFlag:false,
  fileInformationList:[],//附件
  allowRepeatSubmit: 0,//是否允许重新提交作业:0不允许，1允许
  allowOthersSee:0//是否允许查看他人作业:0不允许查看，1提交作业后查看，2允许直接查看
}
const baseInfoForm = reactive(CopyObj(baseParams))

const baseFormRules = {
  assignmentTitle: {
    required: true,
    trigger: 'change',
    message: '请输入作业名称'
  },
  assignmentContent: {
    required: true,
    trigger: 'change',
    message: '请输入作业说明'
  }
}

const handleRemove = (index) => {
  baseInfoForm.fileInformationList.splice(index, 1)
}
const handleReview = (attach,index)=>{
  window.open(attach.fileUrl||attach.url,'_blank')
}
const deadlineFlagChange = (value) => {
  if (value === 0) {
    baseInfoForm.deadline = null
  }
}
const wordLimitFlagChange = (value) => {
  if (value === 0) {
    baseInfoForm.wordLimit = 0
  }
}
const exceedLimitFlagChange = (value) => {
  if (value === 0) {
    baseInfoForm.exceedLimit = 0
  }
}
const resubmitFlagChange = (value) => {
  if (value === 0) {
    baseInfoForm.exceedLimit = 0
  }
}
const returnHomework = _=>{
  emit('close', true)
}
const submitHomework = throttle(()=> {
  if(!isUploading.value) {
    baseInfoForm.fileInformationList.forEach(item=>{
      item.fileName = item.name,
      delete item.fileSize
    })
    handleSave()
  }else{
    Message.info('文件上传中，请稍候')
  }
})

onMounted(() => {
  //
})
</script>
<script>
export default {
  name: 'MixinsEditHomework'
}
</script>
<style lang='scss' scoped>
.footer-box {
  bottom: -30px;
}

.editor-wrapper {
  // width: 99%;
  height: 100%;
  overflow-y: auto;
  // position: absolute;
  top:0;
  background-color: #fff;
  display: flex;
  justify-content: center;
  padding:30px 0;
}

.button-wrapper {
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-title{
  // width: 56px;
  height: 20px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  font-weight: 500;
  margin:20px 10px;
}

.aic{
  justify-content: flex-end;
}
.info-content{
  display: inline-flex;
  align-items: center;
}
:deep(.el-upload__text){
  opacity: 0.6;
  font-size: 12px;
  color: #000000;
  line-height: 18px;
  font-weight: 400;
  margin-top: -5px;
}
:deep(.el-upload) {
    width: 100%;
}
:deep(.el-upload-dragger){
  width: 100%;
  height:130px;
  background-color: #F7F8FA;
}

.attachement-container {
  background: #fff;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  position: relative;
  &:first-child {
    margin-top: 2px;
  }
  &:last-child {
    margin-bottom: 0;
  }
  .icon-drop {
    padding: 5px;
    position: absolute;
    top: 0;
    left: 0px;
    cursor: pointer;
  }
  
  .drop-icon-container {
    display: flex;
    align-items: center;
    flex: 1;
    cursor: move;
  }
  .footer-bar {
    display: flex;
    margin-left: 10px;
    width: 195px;
    justify-content: space-between;
    align-items: center;
    .size-info { 
      flex: 1;
      font-size: 12px;
      color: rgba(0,0,0,0.60);
      font-weight: 400;
      margin-left: 10px;
    }
    .btn {
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      font-weight: 400;
      cursor: pointer;
      &:hover {
        color: #FD6720;
      }
    }
  }

  .info-container {
    .item {
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.4);
      padding: 0 10px;
    }
  }
}
.m-r-10{
  margin-right: 10px;
}
.el-upload__tip{
  font-size: 12px;
  text-align: center;
  position:absolute;
  top:85px;
  left:30%;
  color:#000;
  opacity: .3;
}
:deep(.el-icon-upload){
  margin-top:15px;
}
:deep(.el-upload--picture-card){
  border: none;
  background: none;
  cursor:auto;
}
:deep(.editor-container){
  width: 100%!important;
}
.home-container{
  width: 100%;
  .base-info-form {
    padding-right: 30px;
  }
}
.mt5{
  font-size: 12px;
  // color: #fff;
  letter-spacing: 0;
  line-height: 18px;
  font-weight: 400;
}
.active{
  margin-left: 2px;
  color:#FFC952;
}
:deep(.el-tooltip__popper.is-light).table-popper{
  box-shadow: 0px 0px 10px 0px rgba(66,70,86,0.18)!important;
  border: none!important;
}
</style>
