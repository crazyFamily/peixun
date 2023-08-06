<template>
  <div>
    <gc-model :width="width" top="5vh" :title="title"
      :visible="isDialogShow"
      @close="closeHandle"
      @cancel="closeHandle"
      @comfirm="comfirmHandle"
      :isShowFooter="false">
      <headquarter-upload
        :template-code="templateCode"
        :fetch-fn="importFetchFn"
        :params="uploadParams"
        :table-columns="faildColumns"
        @faildExport="faildExportHandle"
        @uploadFinish="uploadFinishHandle"
        v-bind="$attrs"
        ref="headquarterUploadRef" />
      <p class="space" style="height: 60px"></p>
      <div class="tanlents-upload-footer">
        <el-button class="item-button" @click="closeHandle">取消</el-button>
        <el-button class="item-button" @click="comfirmHandle" :disabled="!isCanSubmit" type="primary">确定</el-button>
      </div>
    </gc-model>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onActivated, nextTick, watch, set } from 'vue'
import HeadquarterUpload from '@/components/upload/HeadquarterUpload.vue'
import { uuid } from '@/util/utils'
const props = defineProps({
  // 弹框是否显示
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '批量导入'
  },
  // 下载模板编码
  templateCode: {
    type: String,
    require: true
  },
  // 导入接口
  importFetchFn: {
    type: Function,
    require: true
  },
  uploadParams: {
    type: Object,
    default: () => {}
  },
  // 失败列数据
  faildColumns: {
    type: Array,
    default: () => []
  },
  // 失败列表导出接口
  faildExportFetchFn: {
    type: Function,
    default: () => {}
  },
  width: {
    type: String,
    default: '800px'
  }
})
const isDialogShow = ref(false)
const isCanSubmit = ref(false)
const successList = ref([])
const successBatchId = ref('')
const errorBatchId = ref('')

watch(() => props.show, (newV) => {
  isDialogShow.value = newV
}, { immediate: true })

const emits = defineEmits(['showChange','comfirm'])
const uploadParams = reactive({ batchId: uuid(), tip: 'N' })
watch(() => props.uploadParams, (newV) => {
  Object.keys(newV).forEach(key => {
    set(uploadParams, key, newV[key])
  })
})

function uploadFinishHandle({ sucessList, errorList, succBatchId, failBatchId }) {
  isCanSubmit.value = Boolean(sucessList.length || succBatchId)
  successList.value = sucessList
  successBatchId.value = succBatchId
  errorBatchId.value = failBatchId
}
const headquarterUploadRef = ref(null)
function reset() {
  headquarterUploadRef.value.reset()
  successBatchId.value = ''
  errorBatchId.value = ''
  successList.value = []
  isCanSubmit.value = false
}
function closeHandle() {
  reset()
  emits('showChange', false)
}
function comfirmHandle() {
  emits('comfirm', {
    successList: successList.value,
    successBatchId: successBatchId.value
  })
  closeHandle()
}

async function faildExportHandle() {
  const params = {
    batchId: errorBatchId.value,
    failBatchId: errorBatchId.value
  }
  await props.faildExportFetchFn(params)
}

</script>

<style lang="scss" scoped>
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
