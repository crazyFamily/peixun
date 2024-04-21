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
            label-width="100px"
            ref="baseInfoFormRef"
        >
                <el-form-item label="提交人：">
                    <el-input v-model="coursePlanBaseInfo.createdByStr" disabled></el-input>
                </el-form-item>
                <el-form-item label="提交时间：">
                    <el-date-picker
                    type="datetime"
                        v-model="coursePlanBaseInfo.createdDate"
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
                <el-form-item label="图片：">
                    
                <div class="pic-wrapper">
                    <template v-for="(picItem, picIndex) in coursePlanBaseInfo.picList">
                    <div class="pic-container" :style="`${picIndex===baseInfoForm.picList.length-1 ? 'margin-right:0;':''}`" :key="picIndex">
                      <img class="item" v-if="picItem" :src="handleUdmpHref(picItem.udmpId)" alt="" @click="showBigImg(picItem.udmpId)">
                    </div>
                </template></div>
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
import ImageViewer from '@/components/image-viewer'
import { nextTick, reactive, ref, watch } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { CopyObj } from '@/plugins/until'
import { fetchCommunicateSubjectDetail, fetchSaveCommunicateSubject,fetchCommunicateCommentDetail } from '@/fetch/establish'
import { MIXINS_SUBJECT_TYPE_CLASS } from '@/views/Establish/enum'
import { getLoadingStatus, handleUdmpHref } from '@/util/utils'
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
const handleShowPicture=(url)=>{
  pictureVisible.value = true;
    
	prevOverflow.value = document.body.style.overflow;
	document.body.style.overflow = 'hidden';
    const index = imageList.value.indexOf(url);
	imgViewer.value.setInitIndex(index || 0);
}
const showBigImg=(udmpId)=>{
    const url = handleUdmpHref(udmpId)
    handleShowPicture(url)
}
const { mergeReactive } = useBaseDataEvents()
const coursePlanBaseInfo = ref( {})
const initData = async () => {
  if (props.businessId) {
    const data = {
      businessId: props.businessId,
      commentId:props.commentData.commentId,
      subjectId: props.commentData.subjectId,
      subjectType: MIXINS_SUBJECT_TYPE_CLASS
    }
    const res = await fetchCommunicateCommentDetail({ data })
    coursePlanBaseInfo.value = res;
    coursePlanBaseInfo.value.createdDate = new Date(res.createdDate)
    res.picList = res.picList.map(row => ({
      udmpId: row.udmpId,
      fileName: row.udmpId
    }))

    mergeReactive({ origin: baseInfoForm, target: res })
    imageList.value = CopyObj(res?.picList || [])?.map(row => {
      return handleUdmpHref(row.udmpId)
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
  subjectId: '',
  subjectContent: '',
  subjectType: MIXINS_SUBJECT_TYPE_CLASS,
  picList: []
}
const baseInfoForm = reactive(CopyObj(baseParams))

const imageList = ref([])
</script>
<script>
export default {
  name: 'CommentDetailDialog'
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

    .remove-icon {
      width: 18px;
      height: 18px;
      border-radius: 100%;
      line-height: 18px;
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
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
