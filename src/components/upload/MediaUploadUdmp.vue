<template>
  <div class="hq-upload-box" v-loading="isUploading">
    <el-upload
        class="gc-upload"
        ref="upload"
        :accept="resultAccept"
        action=""
        :disabled="!canEdit"
        :auto-upload="true"
        list-type="picture-card"
        :file-list="fileList"
        :http-request="udmpUpload"
        :before-upload="uploadInterceptor"
        :on-change="handleChange"
        v-bind="$attrs"
        >
        <i v-if="canEdit" slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
        <img v-if="isImage(file.name)" class="el-upload-list__item-thumbnail"
            :src="file.url" alt=""
        >
        <video v-if="isVideo(file.name)" :src="file.url" muted="true" class="avatar video-avatar"></video>
        <span class="el-upload-list__item-actions">
            <span
                class="el-upload-list__item-preview"
                @click="handlePreview(file)"
                >
                <i v-if="isImage(file.name)" class="el-icon-zoom-in"></i>
                <i v-if="isVideo(file.name)" class="el-icon-video-play"></i>
            </span>
            <span
                v-if="canEdit"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
                >
                <i class="el-icon-error"></i>
            </span>
        </span>
        </div>
    </el-upload>
    
    <image-viewer
      v-show="pictureVisible"
      ref="imgViewer"
      :on-close="closeViewer"
      :url-list="imageList"
    />
  </div>
</template>
<script setup>
import ImageViewer from '@/components/image-viewer'
import store from '@/store'
import { Message } from 'element-ui'
import { ref, reactive, nextTick, watch, computed } from 'vue'
import { uploadFile, getCurrentTime,handleUdmpHref,isImage,isVideo } from '@/util/utils'
import { UPLOAD_STATUS_SCZ, UPLOAD_STATUS_SCCG, UPLOAD_STATUS_YSC } from './emun'
import { uploadFileToUdmp, updateId as updateUdmpId, getUdmpFileInfo } from '@/util/udmp'
const emit = defineEmits('uploadFinish','remove')
const props = defineProps({
  // 格式例：[jpg, png, pdf]
  accept: {
    type: Array,
    default: () => []
  },
  disableUpload: {
    type:Boolean,
    default: false
  },
  // 大小限制，单位MB
  size: {
    type: Number
  },
  // 是否批量上传
  multiple: {
    type: Boolean,
    default: true
  },
  canEdit:{
    type:Boolean,
    default:true
  }
})

// ============================ 预览文件列表 ============================
const fileList=ref([])
const pictureVisible = ref(false)
const prevOverflow = ref('')
const imgViewer = ref(null)
const imageList = ref([])
const closeViewer =()=>{
    document.body.style.overflow = prevOverflow.value;
    pictureVisible.value = false;
}
const handleShowPicture=(url)=>{
    pictureVisible.value = true;
    prevOverflow.value = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let index = 0
    for(let i=0;i<imageList.value.length;i++){
      const item = imageList.value[i]
      if(typeof(item)=='string'){
          if(item==url){index=i;break;}
        }else{
          if(item.url==url){index=i;break;}
        }
    }
    imgViewer.value.setInitIndex(index || 0);
}
const showBigImg=(udmpId)=>{
    const url = handleUdmpHref(udmpId)
    handleShowPicture(url)
}
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
function handlePreview(file){
    const fileInfo = fileDataList.value.find((m) => m.uid === file.uid)
    handleShowPicture(file.url)
}
function handleRemove(file){
  const index = fileList.value.findIndex(item=>item.uid==file.uid)
  if(index>-1){
    imageList.value.splice(index,1)
    fileList.value.splice(index,1)
    emit('remove', file)
  }
}
const isIntercept = ref(false)
// 上传文件控制
function uploadInterceptor(file) {
  if(props.disableUpload){
    Message.warning(`提交作业附件不能超过3个！`)
    return false
  }
  isIntercept.value = false
  if (props.size && file.size / 1024 / 1024 > props.size) {
    isIntercept.value = true
    return Message.warning(`文件大小限制在${props.size}Mb以内,“${file.name}”不能上传`)
  }
  return file
}

const currentFileUid = ref('')
function udmpUpload({ file }) {
  if (isIntercept.value) return
  addFile(fileDataList.value, file)
  const thisFile = fileDataList.value.find((m) => m.uid === file.uid)
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
            data: fileData,
            status: 'success'
        })
      }
    })
    .catch((err) => {
      console.log(err, '错误')
    })
}

const handleChange=(file,list)=>{
  if(isImage(file.name)){
    imageList.value.push(file.url)
  }
  if(isVideo(file.name)){
    imageList.value.push({type:'video',url:file.url})
  }
  fileList.value = list;
}
watch(
  () => props.canEdit,
  val=>{
    const ele = document.querySelector('.el-upload--picture-card')
  if(!val){
    ele.style.display = 'none'
  }else{
    ele.style.display = 'inline-block'
  }
})
// 监听状态更新
watch(updateUdmpId, () => {
  const thisFile = fileDataList.value.find((m) => m.uid === currentFileUid.value)
  // 以当前逻辑并没有多个文件的场景，如有需求扩展再做修改
  if(thisFile) thisFile.percentage = getUdmpFileInfo()?.[0].uploadProgress
})
function setFileList(list){
  list.forEach(item=>{
    item.url = item.fileUrl
    item.name = item.fileName
  })
  imageList.value = list.map(item=>{
    if(isVideo(item.fileName)){
      return {type:'video',url:item.fileUrl}
    }
    return item.fileUrl
  })
  handleChange({},list)
}
function reset() {
  fileDataList.value = []
}
defineExpose({
  reset,setFileList
})
</script>
<script>
export default {
  name: 'MediaUploadUdmp'
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
  margin-left: 20px;
}
.plain-upload-text{
  display: inline-flex;
  align-items: center;
}
:deep(.el-upload-list__item-delete){
  opacity: .7;
}
.el-icon-zoom-in {
  font-size: 35px;
  position: absolute;
  top: 50px;
  left: 57px;
}
.el-icon-video-play{
  font-size: 35px;
  position: absolute;
  top: 50px;
  left: 57px;
}
.el-icon-error{
  position: absolute;
  right: 5px;
  top: 5px;
  color:white;
}
.el-upload-list__item{
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>