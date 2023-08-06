<template>
  <div class="f1">
    <div class="gc-newAdd__tag-box">
      <div class="newAdd__tag-box">
        <div class="newAdd__tag-box__wrapper">
          <span
            class="newAdd__tag-box__item ml10"
            v-for="item in value"
            :key="item.tagId"
            >{{ item.tagName }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style lang="scss" scoped>
.newAdd {
  &__tag-box {
    min-height: 30px;
    padding-top: 4px;
    margin-bottom: -10px;
    border-top: 1px solid #e0e1e3;
    overflow: hidden;
    &__wrapper {
      position: relative;
      display: flex;
      min-height: 35px;
      top: -10px;
      padding-bottom: 4px;
      flex-wrap: wrap;
      border: 1px solid #e0e1e3;
      border-top: none;
    }
    &__item {
      margin-top: 10px;
      padding: 2px 10px;
      height: 20px;
      background-color: #f7f8fa;
      color: #424656;
      border-radius: 2px;
      line-height: 17px;
    }
  }
}
</style>
