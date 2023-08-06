<template>
  <div
    class="gc-fileInput"
    @click="$refs.fileInputComponent.click()"
    :style="{ width }"
  >
    <div class="gc-fileInput__content" v-if="isSHow" :style="{ height }">
      <div class="instructor-icons__upload margin-0">
        <i class="instructor-icons__upload__icon"></i>
      </div>
      {{ btnText }}
    </div>
    <slot v-else></slot>
    <input
      type="file"
      name=""
      ref="fileInputComponent"
      @change="change"
      :accept="accept"
      v-if="show"
    />
  </div>
</template>

<script>
export default {
  name: 'gc-fileInput',
  props: {
    accept: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: Infinity
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
  height: {
      type: String,
      default: '26px'
    },
    btnText: {
      type: String,
      default: '上传文件'
    },
    msgSizeLimit: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: true
    }
  },
  methods: {
    change($event) {
      let err
      const file = $event.target.files[0]
      const extname = '.' + file.name.split('.').slice(-1)[0]?.toLowerCase()
      const type = this.accept.split(',').map((v) => v.toLowerCase())
      if (this.accept && !type.includes(extname)) {
        err = true
        return this.$message.warning('上传文件类型错误')
      }
     if (file.size > this.size) {
        err = true
        if (this.msgSizeLimit) {
          return this.$message.warning(`上传文件大小不能超过 ${this.msgSizeLimit}!`)
        } else {
          let unit, size
          if (file.size / 1024 / 1024 > 1) {
            unit = 'MB'
            size = this.size / 1024 / 1024
          } else {
            unit = 'kb'
            size = this.size
          }
          return this.$message.warning(`上传文件大小不能超过 ${size}${unit}!`)
        }
      }
      if (!err) {
        this.$emit('change', $event)
      }
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    }
  },
  computed: {
    isSHow() {
      return !this.$slots?.default?.length
    }
  }
}
</script>

<style lang="scss">
.gc-fileInput {
  width: 90px;
  &__content {
    display: flex;
    border: 1px solid #e2e3e6;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    cursor: pointer;
    color: #424656;

    .instructor-icons__upload__icon {
      top: 0;
    }
  }
}
</style>
