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

<script>
import { uploadFile } from '@/util/utils'
export default {
  name: 'processInput',
  props: {
    fetchUrl: String,
    fetchFn: Function,
    fetchParam: Object,
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
  },
  data() {
    return {
      uploading: false,
      // 宽度百分比
      widthPercentage: '0%'
    }
  },
  methods: {
  // 处理文件上传
    handleFileChange($event) {
      // 文件上传前回掉
      const flag = this.onBefore($event)
      if (flag === false) return
      if (!this.fetchFn) {
        this.uploading = true
        const file = $event.target.files[0]
        let params = {
          files: file,
          busiId: '',
          reimClass: '',
          url: '/common/file/uploadNewFileForCustom',
          headers: {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.lengthComputable) {
                const percentage =
                  (progressEvent.loaded / progressEvent.total) * 100 || 0
                this.widthPercentage = Math.round(percentage) + '%'
              }
            }
          }
        }
        this.fetchUrl && (params.url = this.fetchUrl)
        params = { ...params, ...this.fetchParam }

        uploadFile(params)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              // 文件上传成功回掉
              this.onSucess(data, file)
            }
          })
          .catch(err => {
            console.log('PrecessInput:onError', err)
            this.onError(err)
          })
          .finally(() => {
            this.uploading = false
          })
      } else {
        this.uploading = true
        this.fetchFn(
          {},
          {
            onUploadProgress: ({ lengthComputable, loaded, total }) => {
              if (lengthComputable) {
                const percentage = (loaded / total) * 100 || 0
                this.widthPercentage = Math.round(percentage) + '%'
              }
            }
          }
        )
          .then((res) => {
            // 文件上传成功回掉
            this.onSucess(res, $event.target.files[0])
          })
          .finally(() => {
            this.uploading = false
          })
      }
    }
  }
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
