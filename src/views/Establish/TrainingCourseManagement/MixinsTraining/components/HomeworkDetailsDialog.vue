<template>
  <gc-model
    width="940px"
    :visible="isDialogShow"
    :is-show-footer="false"
    @close="handleCancel"
    @cancel="handleCancel"
    :title="title"
    class="dialog-style"
  >
    <div class="add-communicate-wrapper">
      <div class="form-box">
        <el-form
            :model="baseInfoForm"
            class="form mt20"
            label-width="80px"
            ref="baseInfoFormRef"
        >
                <el-form-item label="提交人：">
                    <el-input v-model="coursePlanBaseInfo.commentName" disabled></el-input>
                </el-form-item>
                <el-form-item label="提交时间：">
                    <el-date-picker
                    type="datetime"
                        v-model="coursePlanBaseInfo.commentDate"
                        :clearable="false"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :disabled="true"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="文字内容：" class="textarea">
                    <el-input disabled 
                        type="textarea"
                        resize="none"
                        maxlength="500"
                        show-word-limit
                        v-model="coursePlanBaseInfo.commentContent"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="图文/视频：" v-if="coursePlanBaseInfo.assignmentType==1">
                    
                <div class="pic-wrapper">
                    <template v-for="(picItem, picIndex) in coursePlanBaseInfo.fileInformationList">
                    <div class="pic-container el-upload-list--picture-card" :style="`${picIndex===coursePlanBaseInfo.fileInformationList.length-1 ? 'margin-right:0;':''}`" :key="picIndex">
                      <img class="item" v-if="picItem && isImage(picItem.fileName)" :src="picItem.fileUrl" alt="">
                      <video class="item" v-if="picItem && isVideo(picItem.fileName)" :src="picItem.fileUrl" alt=""></video>
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePreview(picItem)"
                          >
                        <i v-if="isImage(picItem.fileName)" class="el-icon-zoom-in"></i>
                        <i v-if="isVideo(picItem.fileName)" class="el-icon-video-play"></i>
                      </span>
                      </span>
                    </div>
                </template></div>
                </el-form-item>
                <el-form-item label="文档：" v-if="coursePlanBaseInfo.assignmentType==2">
                <gc-table
                  class="general__table"
                  :list="planManagementList"
                  :tableList="coursePlanBaseInfo.fileInformationList"
                >
                <el-table-column label="文件大小" width="120">
                    <template v-slot:default="scope">
                      {{getRightFileSize(scope.row.fileSize)}}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" fixed="right" width="120">
                    <template v-slot:default="scope">
                      <span v-if="isPreview(scope.row.fileName)" class="active mr10" @click="handleReview(scope.row)">
                        预览
                      </span>
                      <span class="active mr10" @click="handleDownload(scope.row)">
                        下载
                      </span>
                    </template>
                  </el-table-column>
                </gc-table>
                </el-form-item>
        </el-form>
        </div>
    </div>
    <image-viewer
      v-show="pictureVisible"
      ref="imgViewer"
      :on-close="closeViewer"
      :url-list="imageList"
    />
  </gc-model>
</template>

<script setup>
import store from '@/store'
import ImageViewer from '@/components/image-viewer'
import { nextTick, reactive, ref, watch } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { CopyObj } from '@/plugins/until'
import {fileDownload} from '@/util/udmp'
import { findAssignmentCommentDetailByCommentId } from '@/fetch/establish'
import { MIXINS_SUBJECT_TYPE_CLASS } from '@/views/Establish/enum'
import { getLoadingStatus, handleUdmpHref,isVideo,isImage,isPreview,downloadFileAsAlink,downloadFile,downloadFileByName,getRightFileSize } from '@/util/utils'
import { Message } from 'element-ui'

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
  commentData : [Object, null, undefined],
  assignmentInfo : [Object, null, undefined],
  subjectTitle: String,
  title: {type:String,default:'查看详情'}
})
const pictureVisible = ref(false)
const prevOverflow = ref('')
const closeViewer = ()=>{
    document.body.style.overflow = prevOverflow.value;
    pictureVisible.value = false;
}
const imgViewer = ref(null)
const handleShowPicture=(file)=>{
  pictureVisible.value = true;
    
	prevOverflow.value = document.body.style.overflow;
	document.body.style.overflow = 'hidden';
  let index=-1
  if(isImage(file.fileName)) index = imageList.value.indexOf(file.fileUrl);
  if(isVideo(file.fileName)){
    index = imageList.value.findIndex(item=>item.url==file.fileUrl)
  }
	console.log(file,imageList.value)
  imgViewer.value.setInitIndex(index || 0);
}
const handlePreview=(file)=>{
  handleShowPicture(file)
}
const { mergeReactive } = useBaseDataEvents()
const coursePlanBaseInfo = ref( {})
const initData = async () => {
  if (props.businessId) {
    const data = {
      businessId: props.businessId,
      commentId:props.commentData.commentId,
      assignmentId: props.assignmentInfo.assignmentId,
      businessType: MIXINS_SUBJECT_TYPE_CLASS
    }
    const res = await findAssignmentCommentDetailByCommentId({ data })
    coursePlanBaseInfo.value = res;

    mergeReactive({ origin: baseInfoForm, target: res })
    imageList.value = CopyObj(res?.fileInformationList || [])?.map(row => {
      if(isVideo(row.fileName)) return {type:'video',url:row.fileUrl}
      return row.fileUrl
    })
  }
}

const resetData = async () => {
  await nextTick()
  imageList.value = []
  mergeReactive({ origin: baseInfoForm, target: baseParams })
  coursePlanBaseInfo.value={}
}

const isDialogShow = ref(false)
watch(
  () => props.show,
  async (n) => {
    isDialogShow.value = n
    if (n) {
      await resetData()
      initData()
    }
  }
)

const planManagementList= ref([
        {
          type: 'index',
          label:'序号',
          width: '64'
        },
        {
          label: '文件名称',
          prop:'fileName'
        },
        {
          label: '文件格式',
          prop: 'fileType',
          width: '32'
        }
      ])
const handleDownload= (file)=>{
  const fileName = store.state.userInfo.empName+'_'+file.fileName
  try {
    fileDownload(file.udmpId).then(res=>{
      downloadFileByName(res,fileName)
    })
  } catch (error) {
    console.log(error)
  }
  // downloadFile(file.udmpId,fileName)
}
const handleReview=(file)=>{
  window.open(file.fileUrl,'_blank')
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

const formLabelWidth = '70px'
const baseParams = {
  businessId: props.businessId,
  assignmentId: '',
  subjectContent: '',
  businessType: MIXINS_SUBJECT_TYPE_CLASS,
  fileInformationList: []
}
const baseInfoForm = reactive(CopyObj(baseParams))

const imageList = ref([])
</script>
<script>
export default {
  name: 'HomeworkDetailDialog'
}
</script>

<style lang='scss' scoped>
.add-communicate-wrapper {
  height: 100%;
  background: #fff;
  box-sizing: border-box;
}

.upload-style.gc-uploader {
  height: 123px;
  overflow: hidden;

  :deep(.el-upload-list) {
    height: 123px;
  }

  :deep(.el-upload-list__item) {
    width: 123px;
    height: 123px;
    margin-right: 16px;

    &:last-child {
      margin-right: 0;
    }
  }

  :deep(.el-upload) {
    width: 123px;
    height: 123px;

    .box {
      width: 123px;
      height: 123px;
    }
  }
}

.hidden-box {
  display: none;
}

.has-content {
  margin-left: 14px;
}

.content-style {
  width: 100%;
  :deep(.el-textarea__inner) {
    word-break: break-all;
    text-align: justify;
  }
}

.pic-wrapper {
  display: flex;
  .pic-container {
    width: 123px;
    height: 123px;
    background: #EEEEEE;
    border-radius: 2px;
    margin-right: 16px;
    overflow: hidden;
    border: 1px solid #eee;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    i {
      font-size: 28px;
      position: absolute;
      top: 47px;
      left: 47px;
    }
  }
}

:deep(.textarea) {
    textarea {
        height: 130px;
    }
}
:deep(.el-form) {
    textarea {
        height: 130px;
    }
}
:deep(.el-textarea) {
    height: 130px;
}
:deep(.el-date-editor){
  width:100%
}
</style>
