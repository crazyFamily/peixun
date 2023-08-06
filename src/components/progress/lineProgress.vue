<template>
  <div class="gc-lineProgress" @click="handleClick">
    <i class="gc-lineProgress__icon"></i>
    <div
      class="gc-lineProgress__filename shallow hover"
      :class="{ 'width-auto': status !== 'exception' }"
    >
      <gc-tooltip :length="1">
        {{ name }}
      </gc-tooltip>
    </div>
    <el-progress
      v-show="status === 'exception'"
      class="gc-lineProgress__progress"
      :percentage="percentage"
      :status="status"
    ></el-progress>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'gc-lineProgress',
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: 'exception'
    },
    name: {
      type: String
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
 methods: {
    handleClick($event) {
      const ele = $event.target
      if ($(ele).hasClass('el-icon-circle-close')) {
        this.$emit('del', this.index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gc-lineProgress {
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
    background: url('../../assets/svg/putongwendang.svg') no-repeat center;
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
  span.shallow {
    line-height: 12px;
  }
  :deep(.el-progress-bar__outer) {
    height: 3px !important;
  }
  :deep(.el-icon-circle-close) {
    color: #7d8292;
  }
  :deep(.el-progress-bar__inner) {
    background-color: #fd6720 !important;
  }
}
</style>
