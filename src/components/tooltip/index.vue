<template>
  <div class="gc-tooltip__wrapper">
    <el-tooltip
      v-if="isShow"
      class="item"
      effect="light"
      placement="bottom-start"
      :visible-arrow="false"
      popper-class="accountSearchPopper"
    >
      <div
        slot="content"
        :class="'gc-tooltip__wrapper__tooltip__content ' + popperClass"
      >
        {{ content }}
        <slot></slot>
      </div>
      <div :class="getClassName()">
        {{ content }}
        <slot></slot>
      </div>
    </el-tooltip>
    <div
      v-else
      class="gc-tooltip__wrapper__content"
      :style="{ maxHeight: height }"
      @resize="changeIsShow"
    >
      {{ content }}
      <slot></slot>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { isIE } from '../../util/utils'
export default {
  name: 'gc-tooltip',
  props: {
    length: {
      type: Number,
      default: 0
    },
    content: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    popperClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false,
      isHeight: true
    }
  },
methods: {
    changeIsShow() {
      const ele = this.$el.querySelector('.gc-tooltip__wrapper__content')
      if (!ele) return
      const { scrollWidth, scrollHeight } = ele
      const { clientWidth, clientHeight } = this.$el
      this.isShow = clientWidth !== scrollWidth || clientHeight !== scrollHeight
    },
    getClassName() {
      if (isIE()) {
        return 'gc-tooltip__wrapper__text1'
      } else {
        return this.length === 1
          ? 'gc-tooltip__wrapper__text1'
          : 'gc-tooltip__wrapper__text2'
      }
    }
  },
  updated() {
    this.changeIsShow()
  },
  mounted() {
    this.changeIsShow()
  }
}
</script>

<style lang="scss">
.gc-tooltip__wrapper {
  height: 100%;
  &__content {
    height: 100%;
    overflow: auto;
  }
  &__text2 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  &__text1 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    white-space: nowrap;
  }
}
.accountSearchPopper {
  max-width: 33%;
}
</style>
