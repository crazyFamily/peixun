<template>
  <gc-model
    width="940px"
    :visible="isDialogShow"
    @close="handleCancel"
    @cancel="handleCancel"
    @comfirm="handleSave"
    :comfirm-loading="getLoadingStatus('LOADING_SAVE_COMMUNICATE_SUBJECT')"
    :title="title"
    ref="baseInfoFormRef"
    class="dialog-style"
  >
    <div class="add-communicate-wrapper">
      <p class="title">{{ subjectTitle }}</p>
      <el-form class="base-info-form" :model="baseInfoForm" :rules="baseFormRules" ref="baseInfoFormRef">
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="交流主题" prop="subjectContent">
          <el-input
            class="content-style"
            v-model="baseInfoForm.subjectContent"
            type="textarea"
            resize="none"
            maxlength="500"
            show-word-limit
            :rows="8"
          ></el-input>
        </el-form-item>
        <el-form-item class="base-info-item" :label-width="formLabelWidth" label="图片" prop="picList">
          <div class="upload-container">
            <div class="pic-wrapper">
              <template v-for="(picItem, picIndex) in baseInfoForm.picList">
                <div class="pic-container" :style="`${picIndex===baseInfoForm.picList.length-1 ? 'margin-right:0;':''}`" :key="picIndex">
                  <img class="item" v-if="picItem" :src="handleUdmpHref(picItem.udmpId)" alt="">
                  <span class="remove-icon" @click="handleRemovePic(picIndex)">
                    <img src="@/assets/svg/icon-delete.svg" alt="" />
                  </span>
                </div>
              </template>
              <gc-upload
                class="upload-style"
                :class="{'hidden-box': baseInfoForm.picList.length >= 6, 'has-content': baseInfoForm.picList.length>0}"
                ref="uploadRef"
                :list="imageList"
                :value="baseInfoForm.picList"
                :max="9999"
                :size="10000"
                :show-file-list="false"
                @input="handleUploadSuccess"
                :accept="['jpg', 'jpeg', 'png']"
              ></gc-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </gc-model>
</template>

<script setup>
import { nextTick, reactive, ref, watch } from 'vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { CopyObj } from '@/plugins/until'
import { fetchCommunicateSubjectDetail, fetchSaveCommunicateSubject } from '@/fetch/establish'
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
  subjectInfo: [Object, null, undefined],
  subjectTitle: String,
  title: String
})

const { mergeReactive } = useBaseDataEvents()

const initData = async () => {
  if (props.businessId && props.subjectInfo.subjectId) {
    const data = {
      businessId: props.businessId,
      subjectId: props.subjectInfo.subjectId,
      subjectType: MIXINS_SUBJECT_TYPE_CLASS
    }
    const res = await fetchCommunicateSubjectDetail({ data })
    res.picList = res.picList.map(row => ({
      udmpId: row.udmpId,
      fileName: row.udmpId
    }))

    Reflect.deleteProperty(res, 'updatedDate')
    mergeReactive({ origin: baseInfoForm, target: res })
    imageList.value = CopyObj(res?.picList || [])?.map(row => {
      return {
        url: handleUdmpHref(row.udmpId),
        name: row.udmpId,
        udmpId: row.udmpId,
        fileName: row.udmpId
      }
    })
  }
}

const uploadRef = ref(null)
const baseInfoFormRef = ref(null)
const resetData = async () => {
  await nextTick()
  imageList.value = []
  uploadRef.value.clear()
  mergeReactive({ origin: baseInfoForm, target: baseParams })
  baseInfoFormRef.value.clearValidate()
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
const handleSave = () => {
  baseInfoForm.subjectId = baseInfoForm.subjectId || undefined
  baseInfoFormRef.value.validate(async (v) => {
    if (!v) return
    await fetchSaveCommunicateSubject({ data: {...baseInfoForm, subjectContent: filterSpace(baseInfoForm.subjectContent) }, })
    Message.success(props.businessId && props.subjectInfo.subjectId ? '修改成功' : '添加成功')
    handleClose()
    emit('save')
  })
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

const baseFormRules = {
  subjectContent: {
    required: true,
    trigger: 'change',
    message: '请输入主题'
  }
}
const imageList = ref([])
const handleUploadSuccess = (uploadList) => {
  // console.log(uploadList, baseInfoForm.picList);
  // if(uploadList.length + baseInfoForm.picList.length <= 6) {
  //   baseInfoForm.picList = [...baseInfoForm.picList, uploadList[uploadList.length - 1]]
  // } else {
  //   Message.warning('不能超过6张')
  //   baseInfoForm.picList = CopyObj(baseInfoForm.picList)
  // }
  baseInfoForm.picList = [...baseInfoForm.picList, uploadList[uploadList.length - 1]]
}
const handleRemovePic = (index) => {
  baseInfoForm.picList.splice(index, 1)
}
</script>
<script>
export default {
  name: 'MixinsAddCommunicate'
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

// .dialog-style {
//   :deep(.el-dialog__body) {
//     padding: 20px !important;
//   }
// }

</style>
