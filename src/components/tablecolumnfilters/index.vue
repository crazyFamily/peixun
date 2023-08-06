<template>
  <div class="gc-tablecolumnfilters">
    <el-popover
      :placement="placement"
      :width="width"
      v-model="visible"
      :popper-class="popperClass"
    >
      <div class="infinite-list">
        <div>
          <slot></slot>
        </div>

        <el-checkbox-group
          @change="change"
          v-model="checkList"
          :class="{ radio: radio }"
        >
          <div
            class="state-popover-item"
            v-for="(item, index) in list"
            :key="index"
          >
            <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
      <div class="state-popover-btns">
        <el-button type="text" @click="filter">{{ confirmText }}</el-button>
        <el-button type="text" @click="reset" style="float: right">{{
          resetText
        }}</el-button>
      </div>
      <span slot="reference" class="label">
        <span>{{ label }}</span
        ><i :class="className"></i>
      </span>
    </el-popover>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'gc-tablecolumnfilters',
  data() {
    return {
      visible: false,
      checkList: []
    }
  },

  props: {
    className: {
      type: String,
      default: 'el-icon-arrow-down'
    },
    list: {
      // 兼容vue2.7的动态数据类型
      type: [Array, Object],
      default: () => {
        return Array(10)
          .fill()
          .map((v, i) => {
            return {
              value: i,
              label: `label${i}`
            }
          })
      }
    },

    label: {
    type: String,
      default: 'xxx'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    width: {
      type: String,
      default: 'auto'
    },
    time: {
      type: Number,
      default: 0
    },
    confirmText: {
      type: String,
      default: '筛选'
    },
    resetText: {
      type: String,
      default: '重置'
    },
    popperClass: {
      type: String,
      default: ''
    },
    radio: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    time(n, o) {
      this.checkList = []
      this.visible = false
    }
  },
  methods: {
    filter() {
      const list = [...this.checkList]
      this.visible = false
      this.$emit('filter', { list })
      if (list.length) {
        $(this.$el).find('.table__screen__icon').addClass('active')
      }
    },
    change() {
      if (this.radio) {
        this.checkList = this.checkList.slice(-1)
      }
      const list = this.checkList
      this.$emit('change', { list })
    },
    reset() {
      this.checkList = []
      const list = []
      this.$emit('filter', { list })
      $(this.$el).find('.table__screen__icon.active').removeClass('active')
    },
    $reset() {
      this.checkList = []
      const list = []
      $(this.$el).find('.table__screen__icon.active').removeClass('active')
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
.gc-tablecolumnfilters {
  & :deep(.el-checkbox-group .item) {
    margin-top: 10px;
  }
}
.infinite-list {
  padding: 0 12px 12px;
  position: relative;
}
.state-popover-item {
  margin-top: 12px;
  .el-checkbox__label {
    position: relative;
    bottom: 1px;
  }
}
.state-popover-btns {
  padding: 0 12px;
  border-top: 1px solid #f1f2f4;
  .el-button {
    padding-left: 0;
    padding-right: 0;
  }
}

.edit-wicket-popper {
  height: 80px;
  left: 65px !important;
  z-index: 10 !important;

  &__wrapper {
    height: 100%;
    box-sizing: border-box;
    padding: 16px !important;
    // background-image: linear-gradient(
    //     to bottom,
    //     rgba(255, 255, 255, 0) 80%,
    //     #fff 100%
    // );
    box-shadow: 0 2px 10px 0px rgba(66, 70, 86, 0.01) !important;
    &__content {
      box-sizing: border-box;
      border: 1px solid #eaecf1;
      &__items {
        display: flex;
        height: 100%;
        &__item {
          display: flex;
          flex-grow: 1;
          height: 48px;
          border-right: 1px solid #eaecf1;
          &__left {
            display: flex;
            width: 88px;
            background-color: #f7f8fa;
            align-items: center;
            justify-content: center;
          }
          &__right {
            display: flex;
            width: 130px;
            padding-left: 20px;
            align-items: center;
            justify-content: space-between;
            &__edit-icon {
              width: 15px;
              height: 15px;
              margin-right: 9px;
              background: url('../../assets/svg/bianji.svg') no-repeat center;
            }
          }
          &:last-child {
            border: none;
          }
        }
      }
    }
  }
}
.edit-wicket-popper-transverse {
  left: 167px !important;
}
.circular {
  width: 102px;
  .radio {
    .el-checkbox__input {
      .el-checkbox__inner {
        border-radius: 50%;
        &::after {
          display: none;
        }
      }
      &.is-checked {
        .el-checkbox__inner {
          background-color: #fff;
          &::before {
            display: block;
            width: 8px;
            height: 8px;
            margin: 2px;
            content: '';
            border-radius: 50%;
            background-color: #fd6720;
          }
        }
      }
    }
  }

  &.m183 {
    width: auto;
    .infinite-list {
      max-width: 183px !important;
      max-height: 300px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  &.tac {
    text-align: center;
  }
}
.el-popper {
  span,
  div {
    font-size: 12px;
    font-family: 'PingFangSC-Regular', 'Roboto-Regular', 'PingFang SC',
      'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
  }
}
</style>
