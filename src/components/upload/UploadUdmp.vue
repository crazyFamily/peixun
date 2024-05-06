<template>
  <div class="hq-upload-box" v-loading="isUploading">
    <div :class="{'upload-container':isDrag}">
      <el-upload
        :drag="isDrag"
        :disabled="!canEdit"
        action=""
        class="hq-upload"
        :auto-upload="true"
        :http-request="udmpUpload"
        :on-change="udmpChange"
        :accept="resultAccept"
        :before-upload="uploadInterceptor"
        :multiple="multiple"
        :show-file-list="false"
      >
      <div v-if="isDrag">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或点击上传</div>
      </div>
      <div class="plain-upload-text" v-else :class="{'disabled':!canEdit}">
        <div class="gc-fileInput__content">
          <div class="instructor-icons__upload margin-0">
              <i class="instructor-icons__upload__icon"></i>
          </div>
          <span class="upload-btn">上传文件</span>
        </div>
        <span class="upload-tips">支持扩展名：{{accept.join(',')}}</span>
      </div>
      </el-upload>
    </div>
  </div>
</template>
<script setup>
import store from '@/store'
import { Message } from 'element-ui'
import { ref, reactive, nextTick, watch, computed } from 'vue'
import { uploadFile, getCurrentTime } from '@/util/utils'
import { UPLOAD_STATUS_SCZ, UPLOAD_STATUS_SCCG, UPLOAD_STATUS_YSC } from './emun'
import { uploadFileToUdmp, updateId as updateUdmpId, getUdmpFileInfo } from '@/util/udmp'
const emit = defineEmits('uploadFinish','uploadProgess')
const props = defineProps({
  // 格式例：[jpg, png, pdf]
  accept: {
    type: Array,
    default: () => []
  },
  // 大小限制，单位MB
  size: {
    type: Number
  },
  disableUpload: {
    type:Boolean,
    default: false
  },
  // 是否批量上传
  multiple: {
    type: Boolean,
    default: true
  },
  isDrag:{
    type:Boolean,
    default:true
  },
  canEdit:{
    type:Boolean,
    default:true
  }
})

// ============================ 上传文件列表 ============================
function addFile(arr, file, isNew = true) {
  const size = isNew ? file.size : file.fileSize
  const mbValue = 1024 * 1024
  const uploadUser = !isNew ? file.createdByName : `${store.state.userInfo.empName}(${store.state.userInfo.umId})`
  arr.push({
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
// ============================ 上传控件 ============================
const resultAccept = ref('')
watch(
  () => props.accept,
  (n) => {
    if (!n.length) return ''
    resultAccept.value = n.map((item) => `.${item.toLowerCase()},.${item.toUpperCase()}`).join(',')
  },
  { immediate: true }
)

const isIntercept = ref(false)
// 上传文件控制
function uploadInterceptor(file) {
  if(props.disableUpload){
    Message.warning(`提交作业附件不能超过3个！`)
    return
  }
  isIntercept.value = false
  if (props.size && file.size / 1024 / 1024 > props.size) {
    isIntercept.value = true
    return Message.warning(`文件大小限制在${props.size}m以内,“${file.name}”不能上传`)
  }
  return file
}

const currentFileUid = ref('')
function udmpUpload({ file }) {
  if (isIntercept.value) return
  const thisFile = fileDataList.value.find((m) => m.uid === file.uid)
  if(!thisFile)return;
  currentFileUid.value = file.uid
  uploadFileToUdmp([{ file }])
    .then((res) => {
      if (res.length) {
        const [fileData] = res
        thisFile.udmpId = fileData.doc_id
        thisFile.sizes = fileData.file.size
        thisFile.percentage = '上传成功'
        thisFile.uploadStatus = UPLOAD_STATUS_SCCG // 上传成功
        currentFileUid.value = ''
        emit('uploadFinish', {
            file,
            data: res,
            status: 'success'
        })
      }
    })
    .catch((err) => {
      console.log(err, '错误')
    })
}
function udmpChange(file,fileList){
  if(props.disableUpload){
    Message.warning(`提交作业附件不能超过3个！`)
    return
  }
  if(file.status=="ready"){
    addFile(fileDataList.value, file)
    
    emit('uploadReady', file,fileList)
  }
}
// 监听状态更新
watch(updateUdmpId, () => {
  const thisFile = fileDataList.value.find((m) => m.uid === currentFileUid.value)
  // 以当前逻辑并没有多个文件的场景，如有需求扩展再做修改
  if(thisFile) {
    thisFile.percentage = getUdmpFileInfo()?.[0].uploadProgress
    emit('uploadProgress', thisFile,thisFile.percentage)
  }
})

function reset() {
  fileDataList.value = []
}
defineExpose({
  reset
})
</script>
<script>
export default {
  name: 'UploadUdmp'
}
</script>
<style lang="scss" scoped>
$base-space: 10px;
$upload-width: 360px;
.upload-container {
  width: $upload-width;
  margin: 0 auto;
}
.hq-upload {
  width: 100%;
  margin-bottom: $base-space;
}

.tanlents-upload-footer {
  padding: 15px 24px !important;
  border-top: 1px solid #eaecf1;
  box-sizing: border-box;
  text-align: right;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;

  .item-button {
    padding: 0 10px;
    min-width: 80px;
    height: 30px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
  }
}
.gc-fileInput__content{
  width: 90px;
}
.upload-tips{
  font-size: 12px;
  color: #7D8292;
  line-height: 18px;
  font-weight: 400;
  margin-left: 10px;
}
.plain-upload-text{
  display: inline-flex;
  align-items: center;
}
.disabled{
  background: #f4f4f4;
  opacity: .4;
}
</style>