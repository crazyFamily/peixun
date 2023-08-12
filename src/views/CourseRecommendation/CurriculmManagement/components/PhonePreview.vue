<template>
  <div class="course-recommendation__phone">
    <div class="head between">
      <span>效果预览</span>
      <span class="instructor-icons__refresh">
        <i class="instructor-icons__refresh__icon"></i>
      </span>
    </div>
    <div class="box mt20"></div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.course-recommendation {
  &__phone .box {
    width: 375px;
    height: 615px;
    background-color: #fff;
    box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.09);
    border-radius: 12px;
  }
}
</style>
