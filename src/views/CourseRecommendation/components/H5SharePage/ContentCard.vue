<template>
  <section class="card-wrapper">
    <div class="card-content-wrapper">
      <div class="title-backgrond">
        <img v-if="titleBg" class="title-img" :src="titleBg" alt="" />
      </div>
      <!-- TODO: 具名插槽 -->
      <slot name="title">
        <p class="title">{{ title }}</p>
      </slot>
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  titleBg: {
    type: String
  }
})
</script>
<style lang='scss' scoped>
.card-wrapper {
  position: relative;
  margin: 40px 0;
}

.title {
  font-size: 18px;
  font-weight: normal;
  color: #fff;
  height: 30px;
  color: #fff;
  text-align: center;
  position: relative;
  z-index: 9;
  margin-bottom: 10px;
}

.card-content-wrapper {
  background-color: #fff;
  border-radius: 12px;
  min-height: 100px;
  padding-bottom: 10px;
}

.title-backgrond {
  width: calc(100% - 15px);
  position: absolute;
  top: -7px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  .title-img {
    width: 100%;
  }
}

.content-wrapper {
  padding: 0 10px;
  font-size: 14px !important;
}
</style>
