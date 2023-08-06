<template>
  <div
    class="gc-uploader"
    :class="{
      'cancel-add': disabled,
      [`w-${width}`]: true,
      [`h-${height}`]: true
    }"
  >
    <el-upload
      class="gc-upload"
      ref="upload"
      :accept="resultAccept"
      action="111"
      list-type="picture-card"
      :file-list="fileList"
      :http-request="customRequest"
      :on-remove="handleAvatarRemove"
      :before-upload="beforeAvatarUpload"
      :on-change="handleChange"
      :disabled="disabled"
      :multiple="!single"
      v-bind="$attrs"
    >
      <div class="box">
        <i class="el-icon-plus gc-uploader-icon"></i>
        <div class="text">上传</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { uploadFile, handleUdmpHref } from '@/util/utils'
export default {
  name: 'gc-upload',
  props: {
    imgType: {
      type: Array,
      default: () => ['jpg', 'png', 'jpeg']
    },
    size: {
      type: Number,
      default: 500
    },
    max: {
      type: Number,
      default: 1
    },
    list: {
      type: Array,
      default: () => []
    },
    single: {
      type: Boolean,
      default: false
    },
    udmpId: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
  accept: {
      type: Array,
      default: () => []
    },
    // 上传接口是否返回fileUrl字段
    isReturnUrl: {
      type: Boolean,
      default: false
    },
    customUrl: String
  },
  computed: {
    resultAccept() {
      if (this.accept.length) {
        return this.accept
          .map((item) => {
            return `.${item.toLowerCase()},.${item.toUpperCase()}`
          })
          .join(',')
      }
      return ''
    }
  },
  data() {
    return {
      // 上传 封面图片 数组
      fileList: [],
      files: [],
      showSet: true,
      // 文件类型
      filesType: {
        'jpg': 'jpg',
        'jpeg': 'jpeg',
        'png': 'png',

        'pdf': 'pdf',

        'xmind': 'xmind', // Mac系统下
        'vnd.xmind.workbook': 'xmind', // window系统下

        'rtf': 'text、txt', // Mac系统下
        'plain': 'text、txt',

        'zip': 'zip', // Mac系统下
        'x-zip-compressed': 'zip', // window系统下
        'x-gzip': 'gzip', // Mac系统下
        'gzip': 'gzip', // window系统下

        'msword': 'doc',
        'vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',

        'xls': 'xls', // Mac系统下
        'vnd.ms-excel': 'xls', // window系统下
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'wps-office.xls': 'xls', // 国产系统下
        'wps-office.xlsx': 'xlsx', // 国产系统下

        'vnd.ms-powerpoint': 'ppt',
        'vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      }
    }
  },
  methods: {
    // 上传前的回掉事件
    beforeAvatarUpload(file) {
      console.log('file.........', file)
      let fileType = file.type.split('/')[1]
      let type = null
      if (fileType) {
      type = this.imgType.includes(fileType)
      } else {
        const fileNameSplit = file.name.split('.')
        fileType = fileNameSplit[fileNameSplit.length - 1]
        for (var key in this.filesType) {
          if (this.filesType[key] === fileType) {
            type = this.imgType.includes(key)
            break
          }
        }
      }
      
      if (!type) {
        let typeOnly = [] // 仅支持的类型
        this.imgType.map(item => {
          let data = this.filesType[item]
          if (data && !typeOnly.includes(data)) {
            typeOnly.push(data)
          }
        })
        this.$message.warning(`仅支持 ${typeOnly.join('、')} 类型`)
        console.log('.....', `仅支持 ${typeOnly.join('、')} 类型`)
        return false
      }

      const size = file.size / 1024 < this.size
      if (!size) {
        console.log('max')
        this.$message.warning(`上传图片大小不能超过 ${this.size}kb!`)
        return false
      }
      return true
    },
    // 自定义图片上传函数
    customRequest(item) {
      const uploadParams = {
        files: item.file,
        busiId: '',
        reimClass: '',
        isReturnUrl: this.isReturnUrl ? 'Y' : 'N'
      }
      this.customUrl && (uploadParams.url = this.customUrl)
      uploadFile(uploadParams).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { udmpId, fileName } = data[0]
          const obj = {
            udmpId,
            fileName,
            type: item.file.type
          }
          this.files.push(obj)
          if (this.files.length > this.max) {
            this.files = this.files.slice(-this.max)
          }
          this.$emit('input', this.files, this.fileList.concat(this.files))
          this.showSet = false
          this.$emit('update:udmpId', udmpId)
          this.$emit('update:fileName', fileName)
          this.$nextTick(() => {
            this.showSet = true
          })
        }
      })
    },
    // 图片上传 回掉
    handleChange(file, fileList) {
      this.$nextTick(() => {
        if (fileList.length > this.max) {
          fileList.shift()
          fileList.pop()
          setTimeout(() => {
            fileList.push(file)
          }, 1000)
        }
      })
    },
 // 图片删除 回掉
    handleAvatarRemove(file, fileList) {
      if (fileList.length === 0) {
        this.clear()
      }
    },
    clear() {
      console.log('触发clear')
      this.fileList = []
      this.files = []
      this.$emit('input', this.files)
      this.$emit('update:udmpId', '')
      this.$emit('update:fileName', '')
    },
    uploadInstance() {
      return this.$refs.upload
    }
  },
  watch: {
    list: {
      immediate: true,
      handler(n) {
        if (n?.length) {
          this.fileList = this.list
        }
      }
    },
    udmpId: {
      immediate: true,
      handler(n, o) {
        if (n && this.single && this.showSet) {
          if (!this.fileList.length) {
            this.fileList.push({
              udmpId: '',
              fileName: '',
              url: ''
            })
          }
          this.fileList[0].udmpId = n
          this.fileList[0].url = handleUdmpHref(n)
        } else if (this.single && o && n === '') {
          this.clear()
        }
      }
    },
    fileName: {
      immediate: true,
      handler(n) {
        if (n && this.single && this.udmpId && this.showSet) {
          this.$nextTick(() => {
            this.fileList[0].fileName = n
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/commonScss/common-variate.scss';
.gc-uploader {
  .el-upload {
    width: 130px;
    height: 130px;
    border: none;
    .box {
      position: relative;
      line-height: 128px;
      background-color: #fff;
      border: 1px solid #e0e1e3;
      border-radius: 2px;
      .text {
        position: absolute;
        width: calc(100% - 2px);
        top: 50%;
        left: 0;
        margin-top: 20px;
        text-align: center;
        line-height: 18px;
        color: $tintColor;
      }
    }
  }
  .el-upload-list {
    height: 130px;
    display: inline-block;
  }
  .el-upload-list__item {
    width: 130px;
    height: 130px;
    margin: 0 10px 0 0;
  }
  .el-upload--picture-card i {
    color: $line-color-2;
  }

  &.cancel-add {
    .el-upload--picture-card {
      display: none;
    }
  }
  &.w-345 {
    .el-upload-list__item {
      width: 345px;
    }
  }
  &.h-110 {
    .el-upload {
      width: 110px;
      height: 110px;
      .box {
        line-height: 108px;
      }
    }
    .el-upload-list__item {
      height: 110px;
    }
  }
}
</style>
