<template>
  <el-input-number
    class="custom-input-number"
    controls-position="right"
    v-bind="$attrs"
    v-on="$listeners"
    step-strictly
  ></el-input-number>
</template>

<script>
export default {
  name: 'gc-input-number'
}
</script>

<style lang="scss">
.custom-input-number.el-input-number {
  width: 80px;
  height: 30px;
  line-height: 30px;
  .el-input {
    height: 30px;
    line-height: 30px;
    input {
      padding-right: 28px !important;
      font-size: 12px;
      font-family: 'PingFangSC-Regular', 'Roboto-Regular', 'PingFang SC',
        'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
      text-align: left;
    }
  }
  > span {
    width: 28px;
    border: none !important;
    background: #fff;
    line-height: 8px !important;

    i {
      margin-top: 5px;
      width: 8px;
      height: 8px;
      line-height: 30px;
      background: url('../../assets/svg/shang.svg') no-repeat center;
      background-size: 8px;
      &::before {
        display: none;
      }
    }
    &:nth-child(1) {
      i {
        margin-top: 0;
        margin-bottom: 5px;
        background-image: url('../../assets/svg/xia.svg');
        &::before {
          display: none;
        }
      }
    }
  }
}
</style>
