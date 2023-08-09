<template>
  <div class="curriculumManagement__uploadData" @click="handleClick">
    <div v-if="!disabled" class="aic">
      <gc-fileInput
        class="mr10"
        @change="change"
        :accept="format"
        :size="handleSize()"
      ></gc-fileInput>
      <span class="shallow"
        >可上传文件格式：{{ format }}，文件大小≤{{ size }}</span
      >
    </div>
    <div class="curriculumManagement__uploadData__box mt20">
      <div class="curriculumManagement__uploadData__box__title">
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': uploadDataMenuIndex === 0,
            hover: uploadDataMenuIndex !== 0
          }"
          @click="uploadDataMenuIndex = 0"
        >
          课件 {{ courseNum }}
        </div>
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': uploadDataMenuIndex === 1,
            hover: uploadDataMenuIndex !== 1
          }"
          @click="uploadDataMenuIndex = 1"
        >
          讲师手册 {{ teacherNum }}
        </div>
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': uploadDataMenuIndex === 2,
            hover: uploadDataMenuIndex !== 2
          }"
          @click="uploadDataMenuIndex = 2"
        >
          学员手册 {{ studentNum }}
        </div>
        <div
          class="curriculumManagement__uploadData__box__title__menu"
          :class="{
            'active-default': uploadDataMenuIndex === 3,
            hover: uploadDataMenuIndex !== 3
          }"
          @click="uploadDataMenuIndex = 3"
        >
          其他 {{ otherNum }}
        </div>
      </div>
      <div
        class="curriculumManagement__uploadData__box__items ml20"
        v-if="filesItem.length > 0"
      >
        <div
          class="curriculumManagement__uploadData__box__items__item"
          v-for="item in filesItem"
          :key="item.id"
          :data-id="item.id"
        >
          <i
            class="curriculumManagement__uploadData__box__items__item__icon"
          ></i>
          <div
            class="curriculumManagement__uploadData__box__items__item__filename"
            :class="{
              f1: item.status !== 'exception'
            }"
          >
            <gc-tooltip :length="1" v-if="item.status === 'exception'">
              {{ item.fileName }}
            </gc-tooltip>
            <span v-else>
              {{ item.fileName }}
            </span>
          </div>
          <el-progress
            v-show="item.status === 'exception'"
            class="curriculumManagement__uploadData__box__items__item__progress"
            :percentage="item.percentage"
            :status="item.status"
          ></el-progress>
          <span v-if="showDownload" class="icons mr20">
            <span class="icons__del" @click="download(item)">
              <i class="icons__download__icon"></i>
              下载
            </span>
          </span>
          <span v-if="!disabled" class="icons mr20" v-show="item.status !== 'exception'">
            <span class="icons__del" @click="handleDel(item)">
              <i class="icons__del__icon"></i>
              删除
            </span>
          </span>
        </div>
      </div>
      <div class="curriculumManagement__uploadData__box__empty shallow" v-else>
        暂无附件
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { dataHeaders, downloadFile, generalUploadData } from '../../../util/utils'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    format: {
      type: String,
      default:
        '.xls,.doc,.htm,.pdf,.ppt,.mht,.msg,.rar,.zip,.txt,.html,.docx,.xlsx,.pptx,.png,.jpg,.jpeg'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showDownload: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '5M'
    },
    url: {
      type: String,
      default: '/common/file/uploadNewFile'
    }
  },
  data() {
    return {
      // 上传资料 dialog 选项索引
      uploadDataMenuIndex: 0,
      submoduleMaping: {
        0: 'course_file',
        1: 'teacher_file',
        2: 'student_file',
        3: 'other_file'
      },
      files: []
    }
  },
  methods: {
    change($event) {
      const files = $event.target.files[0]
      if (!files) return
      if (files.size > this.handleSize())
        return this.$message.warning(`上传文件大小不能超过 ${this.size}`)
      const item = {
        files,
        submodule: this.submoduleMaping[this.uploadDataMenuIndex],
        percentage: 0,
        status: 'exception',
        id: +new Date()
      }
      this.files.push(item)
      const data = generalUploadData({
        files,
        reimClass: '',
        busiId: ''
      })
      this.$axios
        .post(this.url, data, {
          ...dataHeaders,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              item.percentage =
                (progressEvent.loaded / progressEvent.total) * 100 || 0
            }
          }
        })
        .then((res) => {
          let { code, data } = res.data
          if (code === 0) {
            data = data[0]
            item.status = 'success'
            item.fileName = item.files.name
            item.udmpId = data.udmpId
            item.sizes = data.sizes
            item.createdBy = data.createdBy
            const files = this.files.map((v) => {
              const { udmpId, fileName, submodule, sizes, createdBy } = v
              return {
                udmpId,
                fileName,
                submodule,
                sizes,
                createdBy
              }
            })
            this.$emit('input', files)
          }
        })
    },
    reset() {
      this.files = []
      this.uploadDataMenuIndex = 0
    },
    handleClick($event) {
      const ele = $event.target
      if ($(ele).hasClass('el-icon-circle-close')) {
        const id = $(ele)
          .closest('.curriculumManagement__uploadData__box__items__item')
          .attr('data-id')
        const index = this.files.findIndex((v) => id == v.id)
        this.files.splice(index, 1)
        const files = this.files.map((v) => {
          const { udmpId, fileName, submodule } = v
          return { udmpId, fileName, submodule }
        })
        this.$emit('input', files)
      }
    },
    handleDel(item) {
      const index = this.files.indexOf(item)
      this.files.splice(index, 1)
      this.$emit('input', this.files)
    },
    handleSize() {
      let [size, unit] = this.size.split(/(?=[a-zA-Z])/)
      size = parseInt(size) || 0
      if (unit) {
        unit = unit.toLowerCase()
      } else {
        return size
      }
      if (unit === 'm' || unit === 'mb') {
        return size * 1024 * 1024
      } else if (unit === 'k' || unit === 'kb') {
        return size * 1024
      }
      return size
    },
    // 下载文件
    download(item) {
      const { udmpId, fileName } = item
      downloadFile(udmpId, fileName).catch((err) => {
        this.$message.error(err)
      })
    }
  },
  computed: {
    courseNum() {
      return this.files.filter((v) => v.submodule === 'course_file').length
    },
    teacherNum() {
      return this.files.filter((v) => v.submodule === 'teacher_file').length
    },
    studentNum() {
      return this.files.filter((v) => v.submodule === 'student_file').length
    },
    otherNum() {
      return this.files.filter((v) => v.submodule === 'other_file').length
    },
    filesItem() {
      return this.files.filter(
        (v) => v.submodule === this.submoduleMaping[this.uploadDataMenuIndex]
      )
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (n) {
        if (n) {
          this.files = n
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.curriculumManagement__uploadData {
  width: 100%;
  span.shallow {
    line-height: 12px;
    word-break: break-all;
  }
  &__box {
    padding-bottom: 20px;
    border: 1px solid #eaecf1;
    &__title {
      display: flex;
      height: 40px;
      background: #f7f8fa;
      color: #7d8292;
      &__menu {
        flex: 1;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        &:nth-child(n + 2) {
          position: relative;
          &::after {
            display: block;
            content: '';
            position: absolute;
            width: 1px;
            height: 14px;
            left: 0;
            top: 13px;
            background-color: #eaecf1;
          }
        }
      }
    }
    &__items {
      &__item {
        display: flex;
        height: 20px;
        margin-top: 20px;
        align-items: center;
        line-height: 18px;

        &__icon {
          margin-right: 13px;
          width: 17px;
          height: 20px;
          vertical-align: middle;
          background: url('../../../assets/svg/putongwendang.svg') no-repeat
            center;
        }
        &__filename {
          width: 60px;
          height: 18px;
          margin-right: 10px;
        }
        &__progress {
          flex: 1;
          margin-top: 2px;
        }
      }
    }
    :deep(.el-progress-bar__outer) {
      height: 3px !important;
    }
    :deep(.el-icon-circle-close) {
      color: #7d8292;
    }
    :deep(.el-progress-bar__inner) {
      background-color: #fd6720;
    }

    &__empty {
      height: 120px;
      text-align: center;
      line-height: 140px;
    }
  }
}
</style>
