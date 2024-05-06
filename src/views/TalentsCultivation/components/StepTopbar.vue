<template>
  <el-steps :active="active" finish-status="finish" align-center class="talents-step">
    <el-step v-for="(name, index) in stepList" :key="index" :title="name"></el-step>
  </el-steps>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentStep: {
    type: String,
    required: true
  },
  stepList: {
    type: Array,
    required: true
  }
})
const active = computed(() => {
  const { stepList, currentStep } = props
  const index = stepList.findIndex((item) => item === currentStep)
  return index
})
</script>
<style lang='scss' scoped>
.talents-step {
  $baseIconWidth: 10px;

  :deep(.el-step__head) {
    min-height: 18px;
  }

  :deep(.el-step__icon-inner) {
    display: none;
  }

  :deep(.el-step__icon) {
    width: $baseIconWidth;
    height: $baseIconWidth;
  }

  :deep(.el-step__title.is-process) {
    color: $themeColor;
  }

  :deep(.el-step__icon.is-text) {
    background-color: #b4b6bc;
  }
  :deep(.is-finish .el-step__icon.is-text) {
    background-color: $themeColor;
  }
  :deep(.is-process .el-step__icon) {
    width: $baseIconWidth + 4;
    height: $baseIconWidth + 4;

    &.is-text {
      background-color: $themeColor;
      border-color: $themeColor;
    }
  }

  :deep(.el-step.is-horizontal .el-step__line) {
    top: 7px;
  }

  :deep(.is-finish .el-step__line) {
    background-color: $themeColor;
  }

  :deep(.el-step__title) {
    font-size: 12px;
    line-height: 24px;
  }
}
</style>