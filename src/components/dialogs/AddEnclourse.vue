<template>
  <!-- 添加附件 dislog -->
  <gc-model
    width="500px"
    title="添加附件"
    class="gc-addEnclosure"
    :visible="visible"
    @close="close"
    @cancel="visible = false"
    @comfirm="comfirm"
    :isAppend="appendToBody"
    :customClass="customClass"
  >
    <div class="gc-addEnclosure__box">
      <div class="btn-box">
        <div class="text mr10">上传附件</div>
        <el-button class="btn" @click="openUpload('addEnclosureFile')">
          <i class="icon"></i>
          上传文件
        </el-button>
        <input
          v-if="inputShow"
          type="file"
          id="addEnclosureFile"
          ref="addEnclosureFileRef"
          @change="change"
          accept=".xls,.doc,.htm,.ppt,.mht,.msg,.rar,.zip,.txt,.html,.docx,.xlsx,.pptx,.pdf,.png,.gif,.jpg,.jpeg"
        />
      </div>
      <div class="format mt10">
        <span class="fl"> 支持扩展名：</span>
        <span>
          .xls、.doc、.htm、.ppt、.mht、.msg、.rar、.zip、.txt、.html、.docx、.xlsx、.pptx、.png、.gif、.jpg、.jpeg、.pdf
        </span>
      </div>
      <div class="items">
 <div
          class="item"
          v-for="(item, i) in files"
          :key="item.file.lastModified"
        >
          <gc-lineProgress
            :index="i"
            :name="item.file.name"
            :percentage="item.progress"
            @del="delFile"
          />
        </div>
      </div>
    </div>
  </gc-model>
</template>

<script>
import { dataHeaders, uploadFile } from '../../util/utils'
export default {
  name: '',
  props: {
    appendToBody: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String
    },
    isReturnUrl: {
      type: Boolean, 
      default: false
    }
  },
  data() {
    return {
      files: [],
      visible: false,
     inputShow: true
    }
  },
  methods: {
    // 打开 dialog
    open() {
      this.visible = true
      this.reset()
    },
    // 关闭 dialog
    close() {
      this.visible = false
      this.temporaryFiles = []
    },
    // 打开上传文件框的公共函数
    openUpload(id) {
      this.inputShow = true
      this.$nextTick(() => {
        document.getElementById(id).click()
      })
    },
    // 添加附件 file表单 change事件
    change($event) {
      console.log(this.files)
      const file = $event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.$message('文件不能大于5M')
          return false
        }
        const item = { file, progress: 0 }
        uploadFile({
          files: item.file,
          busiId: '',
          reimClass: '',
          isReturnUrl: this.isReturnUrl ? 'Y' : 'N',
          headers: {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.lengthComputable) {
                item.progress =
                 (progressEvent.loaded / progressEvent.total) * 100 || 0
              }
            }
          }
        }).then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this._.merge(item, data[0])
          }
        })
        this.files.push(item)
      }
      this.inputShow = false
    },
    // 弹窗确定事件
    comfirm() {
      if (!this.files.length) {
        this.visible = false
        return
      }
      const files = this.files.map((v) => {
        const item = { ...v }
        Reflect.deleteProperty(item, 'file')
        return item
      })
      this.$emit('confirm', files)
      this.visible = false
    },
    // dialog文件删除
    delFile(index) {
      this.files.splice(index, 1)
    },
    // 重置上传的文件
    reset() {
      this.files = []
   }
  }
}
</script>

<style lang="scss" scoped>
.gc-addEnclosure {
  &__box {
    .btn-box {
      display: flex;
      align-items: center;
      .btn {
        width: 90px;
        height: 26px;
        padding: 6px 8px;
        span {
          font-size: 12px;
        }
        .icon {
          position: relative;
          display: inline-block;
          width: 15px;
          height: 15px;
          bottom: 1px;
          background: url('../../assets/svg/hrx-upload-icon.svg') no-repeat
            center;
          vertical-align: middle;
        }

        &:hover i {
          background-image: url('../../assets/svg/hrx-upload-icon copy.svg');
        }
        &:hover span {
          color: #fd6720;
        }
      }
    }
  }
}
</style>
