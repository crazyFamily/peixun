<template>
  <gc-model :width="width" top="5vh" :title="title"
    :visible="isDialogShow"
    :showClose="false"
    @comfirm="handleComfirm"
    :isShowFooter="false">
    <slot></slot>
    <div class="hq-upload-box" >
      <div class="upload-container">
        <el-upload drag action=""
          class="hq-upload"
          :auto-upload="true"
          :http-request="handleUpload"
          :accept="resultAccept"
          :before-upload="uploadInterceptor"
          :multiple="multiple"
          :show-file-list="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或点击上传</div>
        </el-upload>
      </div>
      <table-pagination
        :list="tableColumns"
        :tableList="fileDataList"
        :queryForm="queryForm"
        :hide-pagination="true"
        ref="tablePaginationRef">
        <el-table-column slot="percentage" label="上传进度" width="150px">
          <template slot-scope="scope">
            <el-progress v-if="scope.row.uploadStatus === UPLOAD_STATUS_SCZ" :percentage="scope.row.percentage"></el-progress>
            <span v-else-if="scope.row.uploadStatus === UPLOAD_STATUS_SCCG" style="color:green;">上传成功</span>
            <span v-else >已上传</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="60" fixed="right">
          <template slot-scope="scope">
            <span class="active" @click="deleteFile(scope.$index)">删除</span>
          </template>
        </el-table-column>
      </table-pagination>
    </div>
    <p class="space" style="height: 60px"></p>
    <div class="tanlents-upload-footer">
      <el-button class="item-button" @click="closeHandle">取消</el-button>
      <el-button class="item-button" @click="handleComfirm" :disabled="isUploading" type="primary">确定</el-button>
    </div>
  </gc-model>
</template>
<script setup>
import store from '@/store'
import { Message } from 'element-ui'
import { ref, reactive, nextTick, watch, computed } from 'vue'
import { uploadFile, getCurrentTime } from '@/util/utils'
import { fetchUploadNewFile, fetchUploadNewFileForCustom } from '@/fetch/public'
import { UPLOAD_STATUS_SCZ, UPLOAD_STATUS_SCCG, UPLOAD_STATUS_YSC } from './emun'
import { getUdmpToken, uploadFileToUdmp, updateId as updateUdmpId, getUdmpFileInfo } from '@/util/udmp'

const emits = defineEmits(['update:show','comfirm'])
const props = defineProps({
  // ------------------ 弹框入参 ------------------
  show: { // 弹框是否显示
    type: Boolean,
    default: false
  },
  title: { // 弹框标题
    type: String,
    default: '文件上传'
  },
  width: { // 弹框宽度
    type: String,
    default: '900px'
  },
  // ------------------ 上传控件入参 ------------------
  fetchFn: {
    type: Function
  },
  params: {
    type: Object
  },
  // 格式例：[jpg, png, pdf]
  accept: {
    type: Array,
    default: () => []
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
  // ------------------ 文件列表相关入参 ------------------
  originalList: { // 回显文件列表
    type: Array,
    default: () => []
  },
  useUdmp: {
    type: Boolean,
    default: false
  }
})
const isDialogShow = ref(false)
watch(() => props.show, (newV) => {
  isDialogShow.value = newV
}, { immediate: true })

function closeHandle() {
  emits('update:show', false, fileDataList.value)
}
function handleComfirm() {
  const successList = fileDataList.value.filter(m => m.uploadStatus !== 0 )
  emits('comfirm', successList)
}

// ============================ 上传文件列表 ============================
function addFile (arr, file, isNew = true) {
  const size = isNew ? file.size : file.fileSize
  const mbValue = 1024 * 1024
  const uploadUser = !isNew ? file.createdByName : `${store.state.userInfo.empName}(${store.state.userInfo.umId})`
  arr.push({
    uid: file.uid || file.udmpId,
    fileName: file.name || file.fileName,
    fileSize: size >= mbValue ?  (size / 1024 / 1024 ).toFixed(1) + 'MB' :  Math.round(size / 1024 ) + 'KB',
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
  return fileDataList.value.some(m => m.uploadStatus === UPLOAD_STATUS_SCZ)
})
watch(() => props.originalList, (newVal) => {
  if (Array.isArray(newVal)) {
    const res = []
    newVal.forEach(item => {
      addFile(res, item, false)
    })
    fileDataList.value = res
  }
})
// 文件列表
const queryForm = reactive({ total: 0 })
const tableColumns = [
  { label: '序号', type: 'index' },
  { label: '文件名称', prop: 'fileName', width: '200px' },
  { label: '文件大小', prop: 'fileSize', width: '80px' },
  { label: '上传人', prop: 'uploadUser', width: '160px'  },
  { label: '上传时间', prop: 'uploadDate', width: '150px' },
  { label: '上传进度', prop: 'percentage', slot: 'percentage' },
]
// 删除文件
function deleteFile (index) {
  fileDataList.value.splice(index, 1)
}

// ============================ 上传控件 ============================
const resultAccept = ref('')
watch(() => props.accept, (n) => {
  if (!n.length) return ''
  resultAccept.value = n.map((item) => `.${item.toLowerCase()},.${item.toUpperCase()}`).join(',')
}, { immediate: true })

const isIntercept = ref(false)
function _formatData(file) {
  let data = new FormData()
  data.append('isSave', 'N')
  data.append('isReplace', 'N')
  data.append('files', file)
  if (props.params) {
    Object.keys(props.params).forEach((item) => {
      data.append(item, props.params[item])
    })
  }
  return data
}
// 上传文件控制
function uploadInterceptor(file) {
  isIntercept.value = false
  if (props.size && file.size / 1024 / 1024 > props.size) {
    isIntercept.value = true
    return Message.warning(`文件大小限制在${props.size}m以内,“${file.name}”不能上传`)
  }
  return file
}

function handleUpload({ file }) {
  // 做逻辑分流，如果设置了使用UDMP，则走UDMP上传逻辑
  if(props.useUdmp) {
    udmpUpload({ file })
  } else {
    orginUpload({ file })
  }
}

const currentFileUid = ref('')
function udmpUpload({ file }) {
  if (isIntercept.value) return
  addFile(fileDataList.value, file)
  const thisFile = fileDataList.value.find(m => m.uid === file.uid)
  currentFileUid.value = file.uid
  uploadFileToUdmp([{ file }])
  .then(res => {
    if (res.length) {
      const [fileData] = res
      thisFile.udmpId = fileData.doc_id
      thisFile.sizes = fileData.file.size
      thisFile.percentage = '上传成功'
      thisFile.uploadStatus = UPLOAD_STATUS_SCCG // 上传成功
      currentFileUid.value = ''
    }
  }).catch(err => {
    console.log(err, '错误');
  })
}

// 监听状态更新
if(props.useUdmp) {
  watch(updateUdmpId, () => {
    const thisFile = fileDataList.value.find(m => m.uid === currentFileUid.value)
    // 以当前逻辑并没有多个文件的场景，如有需求扩展再做修改
    thisFile.percentage = getUdmpFileInfo()?.[0].uploadProgress
  })
}

function orginUpload({ file }) {
  if (isIntercept.value) return
  addFile(fileDataList.value, file)
  const data = _formatData(file)
  const thisFile = fileDataList.value.find(m => m.uid === file.uid)
  fetchUploadNewFileForCustom(data, {
    onUploadProgress: (obj) => {
      const { lengthComputable, loaded, total } = obj
      const percentage = Math.floor((loaded / total) * 100)
      // console.log(lengthComputable, loaded, total, percentage)
      if (lengthComputable && thisFile && percentage < 100) {
        thisFile.percentage = percentage
      }
    }
  })
  .then(res => {
    if (res.length) {
      const [fileData] = res
      thisFile.udmpId = fileData.udmpId
      thisFile.sizes = fileData.sizes
      thisFile.percentage = '上传成功'
      thisFile.uploadStatus = UPLOAD_STATUS_SCCG // 上传成功
    }
  })
}

function reset () {
  fileDataList.value = []
}
defineExpose({
  reset
})
</script>
<style lang="scss" scoped>
$base-space: 10px;
$upload-width: 360px;
.upload-container { width: $upload-width; margin: 0 auto; }
.hq-upload { width: 100%; margin-bottom: $base-space; }

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
</style>
