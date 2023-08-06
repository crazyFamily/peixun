<template>
  <div class="gc-model">
    <el-dialog
      :visible.sync="thisVisible"
      :width="width"
      :modal-append-to-body="isAppend"
      :append-to-body="isAppend"
      :close-on-click-modal="false"
      :show-close="showClose"
      :custom-class="[customClass, 'gc-model__dialog'].join(' ')"
      @close="close"
      :top="top"
      ref="gcModel"
    >
      <slot name="title" slot="title">
        <span class="el-dialog__title">{{ title }} </span>
      </slot>
      <div class="content">
        <slot />
      </div>
      <span v-if="isShowFooter" slot="footer" class="footer between">
        <div>
          <slot name="prend"></slot>
        </div>

        <div>
          <el-button v-if="cancelText" @click="cancel">{{ cancelText }}</el-button>
          <el-button type="primary" @click="comfirm" :loading="comfirmLoading">{{ comfirmText }}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import component from '../../mixins/component.js'
export default {
  name: 'gc-model',
  mixins: [component],
  props: {
    isShowFooter: {
      type: Boolean,
      default: true
    },
    isAppend: {
      type: Boolean,
      default: false
    },
   customClass: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    top: {
      type: String,
      default: '15vh'
    },
    autoHeight: {
      type: Boolean,
      default: false
    },
    comfirmLoading: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      ele: null
    }
  },
  methods: {
    cancel() {
      if (this.$listeners.cancel) {
        this.emit('cancel', false)
      } else {
        this.emit('update:visible', false)
      }
    },
    close() {
      if (this.$listeners.close) {
        this.emit('close', false)
      } else {
        this.emit('update:visible', false)
      }
    },
    comfirm() {
      if (this.$listeners.comfirm) {
        this.emit('comfirm', false)
      } else {
        this.emit('update:visible', false)
      }
    },

    emit(...args) {
      this.$emit(...args)
    },
    adjustmentHeight() {
      const height = $(document.body).height()
     // dialog 高度超出页面高度80%时设置固定高度为页面的80%
      const ele = this.ele || (this.ele = $(this.$refs.gcModel.$el).find('.gc-model__dialog'))
      // 差值大于10px 再重新调整高度
      if (Math.abs(ele.height() - height * 0.8) > 10) {
        if (ele.height() >= height * 0.8) {
          ele.css({
            height: `${Math.round(height * 0.8)}px`
          })
        } else {
          ele.css({
            height: ''
          })
        }
      } else {
        // dialog高度大于内容高度并且dialog_body没有滚动条时取消之前设置的固定高度
        let heightTotal = 0
        let dialogBody = ele.find('.el-dialog__body')
        ele.children().each(function (i, v) {
          heightTotal += $(v).outerHeight(true)
        })
        if (ele.height() - heightTotal > 0 && dialogBody.prop('scrollHeight') - dialogBody.prop('clientHeight') <= 0) {
          ele.css({
            height: ''
          })
        }
      }
    },
    // 监测 el-dialog__body 高度
    observeDialogBody() {
      // 防止重复观测元素
      if (this.observer) return
      const target = $(this.$refs.gcModel.$el).find('.gc-model__dialog .el-dialog__body')[0]
      let recordHeight = 0
      let timer = null
      const config = { childList: true, subtree: true, attributes: true }
      const callback = () => {
        if ($(target).height() === recordHeight) return
        recordHeight = $(target).height()
        // 防止重复触发调整高度函数
        clearTimeout(timer)
        timer = setTimeout(() => {
          !this.autoHeight && this.adjustmentHeight()
        }, 100)
      }
      this.observer = new MutationObserver(callback)
      this.observer.observe(target, config)
    }
  },
  computed: {
    thisVisible: {
      get: function () {
        return this.visible
      },
      set: function () {
        return this.visible
      }
    }
  },
 watch: {
    thisVisible(n) {
      if (n) {
        this.$nextTick(() => {
          this.observeDialogBody()
        })
      }
    }
  },
  beforeDestroy() {
    this.observer?.disconnect()
  }
}
</script>

<style lang="scss" scoped></style>
