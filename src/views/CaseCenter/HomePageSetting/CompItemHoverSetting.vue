<template>
  <div class="hover-container" :class="{ type1: type === '2', type3: ['3','4','5','6'].includes(type) }" v-show="show">
    <template v-if="type === '1'">
      <el-button
        class="button-item button-orange"
        :class="{ 'disabled-style': isTop }"
        @click="currentTypeHandle('front')"
      >前移</el-button>
      <el-button class="button-item button-orange" @click="currentTypeHandle('edit')">编辑</el-button>
      <el-button class="button-item button-pink" @click="currentTypeHandle('remove')">删除</el-button>
      <el-button
        class="button-item button-orange"
        @click="currentTypeHandle('back')"
        :class="{ 'disabled-style': isBottom }"
      >后移</el-button>
    </template>
    <template v-else-if="type === '2'">
      <el-button class="button-item button-orange" @click="currentTypeHandle('edit')">编辑</el-button>
    </template>
    <template v-else-if="type === '3'">
      <div class="hover-wrap">
        <el-button class="button-item button-orange" @click="currentTypeHandle('start')">移到最前</el-button>
        <el-button
          class="button-item button-orange"
          :class="{ 'disabled-style': isTop }"
          @click="currentTypeHandle('front')"
        >前移</el-button>
        <el-button class="button-item button-orange" @click="currentTypeHandle('edit')">编辑</el-button>
        <el-button class="button-item button-pink" @click="currentTypeHandle('remove')">删除</el-button>
        <el-button
          class="button-item button-orange"
          :class="{ 'disabled-style': isBottom }"
          @click="currentTypeHandle('back')"
        >后移</el-button>
        <el-button class="button-item button-orange" @click="currentTypeHandle('end')">移到最后</el-button>
      </div>
    </template>
    <template v-else-if="type === '4'">
      <el-button class="button-item button-orange" @click="currentTypeHandle('edit')">编辑</el-button>
      <el-button class="button-item button-pink" @click="currentTypeHandle('remove')">删除</el-button>
    </template>
     <template v-else-if="type === '5'">
      <el-button class="button-item button-orange" @click="currentTypeHandle('edit')">编辑</el-button>
      <el-button class="button-item button-pink" @click="currentTypeHandle('hide')">隐藏</el-button>
    </template>
    <template v-else-if="type === '6'">
      <el-button class="button-item button-orange" @click="currentTypeHandle('edit')">编辑</el-button>
      <el-button class="button-item button-pink" @click="currentTypeHandle('show')">显示</el-button>
    </template>
    <template v-else-if="type === '7'">
      <el-button class="button-pink icon-plus" icon="" @click="currentTypeHandle('remove')">删除</el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'CompItemHoverSetting',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '1'
    },
    isTop: {
      type: Boolean,
      default: false
    },
    isBottom: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    currentTypeHandle(type) {
      if (this.isTop && type === 'front') return
      if (this.isBottom && type === 'back') return
      this.$emit('change', type)
    }
  }
}
</script>
<style lang="scss" scoped>
.hover-container {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: rgb(#000000, 0.3);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  border: 3px solid #fff;
  &.type1 {
    justify-content: center;
  }
  &.type3 {
    .hover-wrap {
      height: 100%;
      max-height: 200px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
    }
    .button-item {
      max-width: 80px;
    }
  }
}

.button-item {
  width: calc(50% - 6px);
  max-width: 44px;
  margin: 3px !important;
  padding: 8px;
}

.disabled-style {
  background-color: #b08831 !important;
  border: 1px solid #b08831 !important;
  cursor: not-allowed;
  &:hover {
    background-color: #b08831 !important;
    border: 1px solid #b08831 !important;
  }
}
</style>
