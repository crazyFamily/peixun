<template>
  <div class="edit-item-container" v-show="show">
    <div class="top-bar">
      <p class="title">设置图片和标题</p>
      <i class="el-input__icon el-icon-close" @click="closeHandle"></i>
    </div>
    <el-form class="edit-form" :model="queryForm" inline ref="formRef">
      <el-form-item
        class="link-item"
        label="上传图片"
        label-width="70px"
        prop="testd"
      >
        <gc-upload
          class="item-img-upload"
          :class="{
            'size-type1': suggestSize === '590*260',
            'size-type2': suggestSize === '280*180',
            'size-type3': suggestSize === '212*160'
          }"
          ref="uploadRef"
          :list="imgUploadList"
          :size="uploadSize"
          single
          :accept="['jpg', 'png']"
          v-model="imgAttachList"
        ></gc-upload>
        <div class="tip-container">
          <p class="tintColor mt10">1.可使用资源的默认图片，也可自定义图片</p>
          <p class="tintColor mt10">2.自动上传的图片需在{{ uploadSize }}kb内</p>
          <p class="tintColor mt10">
            3.当前样式建议图片尺寸：{{ suggestSize }}
          </p>
        </div>
      </el-form-item>
      <el-form-item
        class="link-item"
        label="标题"
        label-width="70px"
        prop="moduleName"
      >
        <el-input
          v-model="queryForm.moduleName"
          placeholder="请输入标题内容"
          maxlength="50"
          show-word-limit
          style="width: 400px"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSpecialImg } from '@/util/utils'
export default {
  name: 'CompEditItemInfo',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    itemInfo: {
      type: Object,
      default: () => {}
    },
    suggestSize: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      queryForm: {
        moduleName: ''
      },
      imgUploadList: [],
      imgAttachList: [],
      uploadSize: 500
    }
  },

  watch: {
    itemInfo: {
      handler(n) {
        this._initData(n)
      }
    },
    imgAttachList: {
      handler(n) {
        if (n.length === 1 && !n[0].udmpId) {
          this.imgUploadList = []
          this.imgAttachList = []
        }
      }
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    _initData(data) {
      if (!Object.keys(data).length) return
      this.imgAttachList = [
        {
          fileName: '图片',
          udmpId: data.moduleImgId
        }
      ]
      this.imgUploadList = [
        {
          name: '图片',
          url: getSpecialImg(data.moduleImgId, 'href')
        }
      ]
      this.queryForm.moduleName = data.moduleName
    },
    closeHandle() {
      this.reset()
      this.$emit('update:show', false)
      this.$emit('close')
    },
    reset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.$refs.uploadRef.clear()
    },
    getInfoDatas() {
      return { ...this.queryForm, moduleImgId: this.imgAttachList[0].udmpId }
    }
  }
}
</script>
<style lang='scss' scoped>
.edit-item-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: rgb(#000, 0.8);
}
.link-item {
  display: block;
}

.top-bar {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #000;

  .el-icon-close {
    position: absolute;
    right: 15px;
    font-size: 20px;
    cursor: pointer;
  }
}

.edit-form {
  padding: 40px;
  box-sizing: border-box;
}
.link-item {
  :deep(.el-form-item__content) {
    display: inline-flex;
  }
  :deep(.el-form-item__label) {
    color: #fff !important;
  }
}

.tip-container {
  margin-left: 20px;
}

.tintColor {
  color: #fff;
}

.item-img-upload {
  :deep(.el-upload-list--picture-card .el-upload-list__item-actions) {
    display: none;
  }

  @mixin public-size-type($width) {
    // width: $width + 130px + 10px;
    // :deep(.gc-upload) {
    //   width: 100%;
    // }

    // :deep(.el-upload-list) {
    //   width: calc(100% - 130px - 10px);
    //   margin-right: 10px;
    // }

    :deep(.el-upload-list__item) {
      width: $width;
    }
  }

  &.size-type1 {
    @include public-size-type(260px);
  }
  &.size-type2 {
    @include public-size-type(202px);
  }
  &.size-type3 {
    @include public-size-type(172px);
  }
}
</style>
