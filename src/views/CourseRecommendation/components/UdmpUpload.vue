<template>
  <div class="process-input">
    <div class="df" v-show="!uploading">
      <gc-fileInput
        width="70px"
        height="30px"
        btnText="上传"
        v-bind="$attrs"
        @change="handleFileChange"
      ></gc-fileInput>
      <slot></slot>
    </div>
    <div v-show="uploading" class="uploading">
      <div class="bgc-tier" :style="{ width: widthPercentage }"></div>
      <span class="up-text">
        <span>上传中</span><span class="ml7">{{ widthPercentage }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getUdmpToken, uploadFileToUdmp, updateId as updateUdmpId, getUdmpFileInfo } from '@/util/udmp'

const props = defineProps({
  fetchUrl: {
    type: String,
    default: ''
  },
  fetchFn: {
    type: Function
  },
  fetchParam: {
    type: Object
  },
  onBefore: {
    type: Function,
    default: () => {}
  },
  onSucess: {
    type: Function,
    default: () => {}
  },
  onError: {
    type: Function,
    default: () => {}
  }
})
const uploading = ref(false)
const widthPercentage = ref('0%')

watch(updateUdmpId, () => {
  // 以当前逻辑并没有多个文件的场景，如有需求扩展再做修改
  widthPercentage.value = (getUdmpFileInfo()?.[0]?.uploadProgress || 0) + '%'
  console.log('=========:' + widthPercentage.value)
})
function handleFileChange($event) {
  // 文件上传前回掉
  const flag = props.onBefore($event)
  if (flag === false) return
  uploading.value = true
  const file = $event.target.files[0]
  widthPercentage.value = '0%'
  uploadFileToUdmp([{ file }])
  .then(res => {
    if (res.length) {
      const [fileData] = res
      let resFile = [{
        udmpId: fileData.doc_id,
        fileName: fileData.file.name,
        sizes:  fileData.file.size,
        sortNum: 1
      }]
      props.onSucess(resFile, file)
    }
  }).catch(err => {
    console.log(err, '错误');
  }).finally(() => {
    // 避免小文件一下子上传成功，延迟500ms，显示上传100%进度条
    setTimeout(() => {
      uploading.value = false
    }, 500)
  })
}
</script>

<style lang="scss">
.process-input {
  .uploading {
    position: inherit;
    display: flex;
    height: 30px;
    background: #d8d8d8;
    border-radius: 2px;
    justify-content: center;
    align-items: center;
    color: #fff;
    .bgc-tier {
      position: absolute;
      top: 0;
      left: 0;
      height: 30px;
      background-color: #00b046;
      border-radius: 2px;
    }
    .up-text {
      position: relative;
      z-index: 2;
    }
  }
}
</style>