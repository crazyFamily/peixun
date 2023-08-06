<template>
  <div class="info-container">
    <div class="info-base-wrapper" :class="{pt10: hiddenTitle}">
      <div class="info-title-box" v-if="!hiddenTitle">
        <div class="info-title-wrapper" :class="{border: edit}" v-if="title || edit">
          <!-- <span class="info-left"><img class="title-icon" src="@/assets/images/monthly-plan/monthly-plan-title-left.svg" alt="" /></span> -->
          <div class="content-wrapper">
            <template v-if="edit">
              <el-input class="title-wrapper-input" v-model="inputTitle" @change="handleTitleChange"></el-input>
            </template>
            <template v-else>
              <p class="info-title">{{title}}</p>
            </template>
          </div>
          <!-- <span class="info-right"><img class="title-icon" src="@/assets/images/monthly-plan/monthly-plan-title-right.svg" alt="" /></span> -->
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
  const props = defineProps({ 
    title: String,
    hiddenTitle: Boolean,
    edit: Boolean,
    info: Object
  })
  const inputTitle = ref(props.title || '')

  watch(() => props.title, (n) => {
    inputTitle.value = n
  })
  
  const emit = defineEmits(['update:title'])
  const handleTitleChange = (value) => {
    emit('update:title', value)
  }
</script>
<script>
export default {
  name: 'BaseWrapper'
}
</script>

<style lang="scss" scoped>
.info-container {
    // padding: 40px;
  }

  .info-base-wrapper {
    width: 100%;
    min-height: 200px;
    background: rgba(255,255,255,0.78);
    border: 4px solid #FFFFFF;
    border-radius: 20px;
    padding: 14px;
    padding-top: 0;
    margin-bottom: 20px;

    .pt10 {
      padding-top: 20px;
    }
  }

  .info-title-box {
    min-height: 40px;
    text-align: center;
  }

  .info-title-wrapper {
    display: inline-flex;
    &.border {
      border: 2px dashed #6E6E6E;
    }

    .title-icon {
      max-width: unset;
      max-height: 100%;
    }
  }

  @mixin base-title() {
    position: relative;
    color: #fff;
    font-size: 40px;
    background: url('~@/assets/images/monthly-plan/monthly-plan-title-bg.svg');
  }

  .info-title {
    @include base-title();
    display: flex;
    align-items: center;
    z-index: 1;
  }

  .title-wrapper-input {
    :deep(.el-input__inner) {
      @include base-title();
      border: 0;
      height: 70px;
      border-radius: 0 !important;
    }
  }

  .content-wrapper {
    min-height: 70px;
    display: flex;
    position: relative;
    margin: 0 44px;
    &::before {
      content: '';
      width: 100px;
      height: 70px;
      display: block;
      position: absolute;
      left: -44px;
      top: 0;
      background: url(~@/assets/images/monthly-plan/monthly-plan-title-left.svg) no-repeat;
    }
    &::after {
      content: '';
      width: 100px;
      height: 70px;
      display: block;
      position: absolute;
      right: -44px;
      top: 0;
      background: url(~@/assets/images/monthly-plan/monthly-plan-title-right.svg) no-repeat right;
    }
  }
</style>
