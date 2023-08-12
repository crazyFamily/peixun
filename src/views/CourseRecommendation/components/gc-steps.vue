<template>
  <div class="gc-steps" :style="{ width: totalWidth }">
    <div class="line"></div>
    <div
      class="gc-step-box"
      :style="{
        width: thisWidth,
        justifyContent: list.length === 1 ? 'center' : ''
      }"
    >
      <!-- 进度条 -->
      <div
        class="gc-step"
        v-for="(item, i) in list"
        :key="item"
        :class="{ 'active-step': active >= i }"
      >
        <i>{{ i + 1 }}</i>
        <span class="gc-step-title">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    totalWidth: {
      type: String,
      default: '1000px'
    },
    active: {
      type: Number,
      dedault: 0
    },
    list: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      thisWidth: ''
    }
  },
  mounted() {
    if (!this.width) {
      this.thisWidth = (this.list.length / (this.list.length + 2)) * 100 + '%'
    } else {
      this.thisWidth = this.width
    }
  }
}
</script>

<style lang="scss">
.gc-steps {
  position: relative;
  margin: auto;
  padding-bottom: 54px;

  .gc-step-box {
    display: flex;
    margin: auto;
    justify-content: space-between;
  }
  .gc-step {
    position: relative;
    border: 5px #efefef solid;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    background-color: #fff;
    i {
      font-size: 20px;
      color: #b2b2b2;
    }
    .gc-step-title {
      position: absolute;
      top: 54px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      font-size: 18px;
      color: #b2b2b2;
    }
  }
  .line {
    position: absolute;
    height: 4px;
    border: 2px;
    left: 0;
    right: 0;
    top: 20px;
    margin-top: -2px;
    background: #eaecf1;
  }
  .active-step {
    border-color: #ffffff;

    box-shadow: 0 2px 6px 2px rgba(245, 159, 124, 0.33);
    background-image: linear-gradient(53deg, #ff7f55 0%, #ffcc60 100%);
    i {
      color: #ffffff;
    }
    .gc-step-title {
      font-weight: 400;
      color: #000000;
    }
  }
}
</style>
