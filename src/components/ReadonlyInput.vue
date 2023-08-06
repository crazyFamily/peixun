<template>
  <div class="gc-readonlyInput">
    <div class="gc-readonlyInput__label" v-if="label">
      {{ label }}
    </div>
    <el-input v-if="value" readonly :value="value"></el-input>
    <div
      v-else
      class="gc-readonlyInput__input"
      :class="{'disabled': disabled}"
      :style="width ? { width: `${width}px` } : { flex: 1 }"
    >
      <slot>
        <span class="placeholder">{{ placeholder }}</span></slot
      >
      <div class="end" v-if="$slots.end">
        <slot name="end"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gc-readonlyInput',
  props: ['label', 'width', 'value', 'placeholder','disabled'],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.gc-readonlyInput {
  display: flex;
  margin-bottom: 20px;
  line-height: 30px;
  &__label {
    height: 30px;
    margin-right: 10px;
    flex-shrink: 0;
  }
  &__input {
    position: relative;
    height: 30px;
    padding-left: 10px;
    border: 1px solid #e0e1e3;
    border-radius: 2px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    .end {
      position: absolute;
      display: flex;
      top: 0;
      bottom: 0;
      right: 4px;
      justify-content: center;
      align-items: center;
    }
  }
  &.w140 {
    width: 140px;
  }
}
</style>
