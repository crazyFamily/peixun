<template>
  <gc-model :title="title" :visible="isDialogShow" width="1100px" @close="closeHandle" @cancel="closeHandle" @comfirm="comfirmHandle">
    <div class="info-content">
      <div v-if="title === '补考成绩审核'" class="mb10">
        <el-form :model="scoreInfoForm" :rules="formRules" ref="formRef">
          <el-form-item label="审核状态：" label-width="100px" prop="onlineResitStatus">
            <el-radio-group v-model="scoreInfoForm.onlineResitStatus">
              <el-radio label="1">通过</el-radio>
              <el-radio label="0">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <el-scrollbar>
        <div class="banner-container">
          <div style="display: flex; flex-wrap: wrap" ref="fileDataListRef">
            <div class="dfcc banner-item-container drop" v-for="(item, index) in fileDataList" :key="item.udmpId" :data-id="item.udmpId">
              <img :src="handleUdmpHref(item.udmpId)" alt="" class="banner-item" />
              <div class="dfcc mask-container">
                <i class="mask-icon el-icon-full-screen" @click="showBigImg(index)"></i>
                <i v-if="!disabled" class="mask-icon el-icon-edit-outline" @click="showUploadHandle(item, index)"></i>
                <i v-if="!disabled" class="mask-icon el-icon-delete" @click="removeBanner(index)"></i>
              </div>
            </div>
            <div class="upload-container">
              <gc-upload
                ref="uploadRef"
                single
                :list="fileDataList"
                :class="{ 'hidden-box': fileDataList.length >= 5 || disabled }"
                :max="9999"
                :size="10000"
                :show-file-list="false"
                @input="uploadSuccessHandle"
              ></gc-upload>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div style="transform: scale(0); position: absolute">
      <gc-upload
        ref="singleUploadRef"
        single
        :list="fileDataList"
        :max="9999"
        :size="10000"
        :show-file-list="false"
        @input="editorSuccessHandle"
      ></gc-upload>
    </div>
    <image-viewer v-if="pictureVisible" ref="imgViewer" :on-close="closeViewer" :url-list="imageList" />
  </gc-model>
</template>
<script setup>
import { Message } from 'element-ui'
import ImageViewer from '@/components/image-viewer'
import { ref, reactive, nextTick, watch, onMounted, set } from 'vue'
import { handleUdmpHref } from '@/util/utils.js'
import { ONT_ONLINERESITSTATUS, PASS_ONLINERESITSTATUS } from '../enum'
import { fetchFindOnlineResitScore } from '@/fetch/newPeopleTrainingManagement'
import Sortable from 'sortablejs'
const isDialogShow = ref(false)
const props = defineProps({
  // 弹框是否显示
  show: {
    type: Boolean,
    default: false
  },
  id: {
    type: Number
  },
  title: {
    type: String,
    default: '上传补考成绩截图'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['showChange', 'comfirm', 'update:show'])
watch(
  () => props.show,
  (newV) => {
    isDialogShow.value = newV
    if (newV) {
      reset()
      _initSortable()
      _getList()
    }
  }
)
const closeHandle = () => {
  isDialogShow.value = false
  emits('update:show', false)
}
const scoreInfoForm = ref({
  onlineResitStatus: ''
})

const formRules = {
  onlineResitStatus: [{ required: true, message: '请选择审核状态' }]
}
const fileDataList = ref([])
const formRef = ref(null)
const comfirmHandle = () => {
  if (props.title === '补考成绩审核') {
    formRef.value.validate((valied) => {
      if (valied) {
        emits('comfirm', fileDataList.value, scoreInfoForm.value)
        emits('update:show', false)
      }
    })
  } else {
    emits('comfirm', fileDataList.value)
    emits('update:show', false)
  }
}

// --------------- 图片放大 ---------------
const pictureVisible = ref(false)
const prevOverflow = ref('')
const imgViewer = ref(null)
const imageList = ref([])
const showBigImg = (index) => {
  imageList.value = fileDataList.value.map((v) => {
    return handleUdmpHref(v.udmpId)
  })
  pictureVisible.value = true
  nextTick(() => {
    prevOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    imgViewer.value.setInitIndex(index || 0)
  })
}

const closeViewer = () => {
  document.body.style.overflow = prevOverflow.value
  pictureVisible.value = false
}

const removeBanner = (index) => {
  fileDataList.value.splice(index, 1)
}

let currentEditUdmpId = null
const singleUploadRef = ref(null)
const showUploadHandle = (item) => {
  currentEditUdmpId = item.udmpId
  singleUploadRef.value.$el.querySelector('.el-upload').click()
}

const editorSuccessHandle = (files) => {
  let item = fileDataList.value.find((v) => v.udmpId === currentEditUdmpId)
  Object.keys(files[files.length - 1] || {}).forEach((key) => {
    set(item, key, files[files.length - 1][key])
  })
  // item = files[files.length - 1]
  currentEditUdmpId = null
}
const uploadSuccessHandle = (files) => {
  if (files.length) {
    fileDataList.value.push(files[files.length - 1])
  }
}

const reset = () => {
  fileDataList.value = []
  scoreInfoForm.value.onlineResitStatus = ''
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

let sortableEl = null
const fileDataListRef = ref(null)
const _initSortable = () => {
  if (props.disabled) {
    sortableEl && sortableEl?.destroy()
    sortableEl = null
    return
  }
  nextTick(() => {
    sortableEl = new Sortable(fileDataListRef.value, {
      handle: '.drop',
      filter: '.filter',
      dataIdAttr: 'data-id',
      animation: 150,
      onEnd(event) {
        const list = fileDataList.value
        const { newIndex, oldIndex } = event
        const temp = [...fileDataList.value]
        const oldValue = temp.splice(oldIndex, 1)
        temp.splice(newIndex, 0, oldValue[0])
        fileDataList.value = []
        nextTick(() => {
          fileDataList.value = temp
        })
      },
      onMove(event) {}
    })
  })
}
const _getList = async () => {
  const res = await fetchFindOnlineResitScore({ data: { id: props.id } })
  fileDataList.value = res.picList || []
  const onlineList = [PASS_ONLINERESITSTATUS, ONT_ONLINERESITSTATUS]
  if (onlineList.includes(res.onlineResitStatus)) {
    scoreInfoForm.value.onlineResitStatus = res.onlineResitStatus
  }
}
</script>

<script>
export default {
  name: 'UploadScoreModel'
}
</script>
<style lang="scss" scoped>
.banner-container {
  margin-bottom: 7px;
  margin-right: 7px;
}
.banner-item-container {
  width: 130px;
  height: 130px;
  border-radius: 4px;
  border: 1px solid $line-color;
  position: relative;
  overflow: hidden;
  & + & {
    margin-left: 14px;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .mask-container {
    width: 100%;
    height: 100%;
    color: #fff;
    overflow: hidden;
    font-size: 24px;
    background-color: rgb(#000, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0);
    transition: 0.1s all;
  }

  &:hover .mask-container {
    transform: scale(1);
  }

  .mask-icon {
    margin: 0 5px;
    cursor: pointer;
  }
}
.hidden-box {
  display: none;
}
.upload-container {
  margin-left: 14px;
  :deep(.score-uploader-icon) {
    font-size: 28px;
    color: #bbb;
  }
}
</style>