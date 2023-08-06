<template>
  <!-- 批量上传 dialog -->
  <gc-model
    :title="title"
    :visible="visible"
    width="500px"
    @close="handleClose"
    @cancel="cancel"
    @comfirm="comfirm"
    :comfirm-loading="comfirmLoading"
    class="instructor-batch-import"
  >
    <div class="instructor-batch-import__upload">
      <div class="instructor-batch-import__upload__left">批量上传</div>
      <div class="instructor-batch-import__upload__right">
        <div
          class="instructor-batch-import__upload__right__btn"
          @click="openFileInput('lecturerManagement-apply-batch-modification')"
        >
          <div class="instructor-icons__upload margin-0">
            <i class="instructor-icons__upload__icon"></i>
          </div>

          上传文件
        </div>
        <input
          type="file"
          name=""
          ref="InstructorBatchImportInput"
          id="lecturerManagement-apply-batch-modification"
          @change="change"
          accept=".xls,.xlsx"
       />
        <div
          class="instructor-batch-import__upload__right__btn"
          @click="templateDownload"
        >
          <span class="instructor-icons__download margin-0">
            <i class="instructor-icons__download__icon"></i>
            模版下载
          </span>
        </div>
      </div>
    </div>
    <div class="files ml68">
      <div
        class="mt20 between icons"
        v-for="(file, i) in files"
        :key="file.lastModified"
      >
        <div class="left aic">
          <i class="operation__doc"></i>
          <div class="f1 ml10 active" @click="download($event, file)">
            {{ file.name }}
          </div>
        </div>
        <span class="right icons__del" @click="del(i)">
          <i class="icons__del__icon"></i>
        </span>
      </div>
    </div>
    <div
      v-if="$slots.default && $slots.default.length"
   class="instructor-batch-import__info"
    >
      <div class="instructor-batch-import__info__left hide">注意事项</div>
      <div class="instructor-batch-import__info__right">
        <slot></slot>
      </div>
    </div>
    <div class="instructor-batch-import__info" v-else>
      <div class="instructor-batch-import__info__left">注意事项</div>
      <div class="instructor-batch-import__info__right">
        <div class="instructor-batch-import__info__right__item">
          请删除下载模板中的示例数据
        </div>
        <div class="instructor-batch-import__info__right__item">
          请将下载模板中的数据填写完整后导入
        </div>
        <div class="instructor-batch-import__info__right__item">
          请不要对下载的模板列进行删除
        </div>
      </div>
    </div>
  </gc-model>
</template>

<script>
import { openFileInput, localDownload } from '../../util/utils'
export default {
  name: 'InstructorBatchImport',
  props: ['visible', 'title', 'comfirmLoading'],
  data() {
    return {
      openFileInput,
      files: []
    }
  },
  methods: {
    handleClose() {
      this.$refs.InstructorBatchImportInput.value = ''
      this.files = []
      if (this.$listeners.close) {
        this.$emit('close', false)
      } else {
        this.$emit('update:visible', false)
      }
    },
    cancel() {
      if (this.$listeners.cancel) {
        this.$emit('cancel', false)
      } else {
        this.$emit('update:visible', false)
      }
    },
    comfirm() {
      if (this.$listeners.comfirm) {
        this.$emit('comfirm', false)
      } else {
        this.$emit('update:visible', false)
      }
    },
    templateDownload() {
      this.$emit('templateDownload')
    },
    change($event) {
      if ($event.target.files[0]) {
        this.$message.success({
          message: `已选择 ${$event.target.files[0].name}`,
          duration: 1000
        })
        this.files = [$event.target.files[0]]
      }
      this.$emit('change', $event)
   },
    download($event, file) {
      localDownload(file, $event.target, this.download)
    },
    del(i) {
      this.files.splice(i, 1)
      this.$emit('change', { target: { files: [{}] } })
      this.$refs.InstructorBatchImportInput.value = ''
    }
  }
}
</script>

<style lang="scss">
.instructor-batch-import {
  &__upload {
    display: flex;
    height: 26px;
    &__left {
      line-height: 26px;
      color: #7d8292;
      flex-shrink: 0;
    }
    &__right {
      display: flex;
      &__btn {
        display: flex;
        width: 90px;
        height: 26px;
        margin-left: 20px;
        border: 1px solid #e2e3e6;
        justify-content: center;
        align-items: center;
        border-radius: 2px;
        cursor: pointer;
      }
    }
  }
  &__info {
    display: flex;
    margin-top: 20px;
    line-height: 18px;
    color: #7d8292;
   &__left {
      margin-right: 20px;
    }
    &__right {
      &__item {
        display: flex;
        height: 18px;
        align-items: center;
        margin-bottom: 12px;
        &::before {
          content: '';
          width: 3px;
          height: 3px;
          margin-right: 8px;
          border-radius: 50%;
          background-color: #7d8292;
        }
        &:last-child {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
