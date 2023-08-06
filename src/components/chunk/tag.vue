<template>
  <el-tag v-bind="$attrs" v-on="$listeners" class="gc-tag" :class="classObj">
    <slot></slot>
  </el-tag>
</template>

<script>
export default {
  props: ['no-border'],
  data(vm) {
    return {
      classObj: {
        'no-border': vm.noBorder
      }
    }
  }
}
</script>

<style lang="scss">
.gc-tag {
  &.no-border {
    &.el-tag {
      border: none;
    }
    &.el-tag--mini {
      line-height: 20px;
    }
  }
}
</style>
