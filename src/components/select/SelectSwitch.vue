<template>
  <div class="switch-wrapper">
    <div class="active-wrapper" :class="{'active-wrapper-left': currentType === dataInfo[0].value, 'active-wrapper-right': currentType === dataInfo[1].value}"></div>
    <template v-for="(item, k) in dataInfo">
      <p class="item" :key="k" :class="{active: currentType === item.value}" @click="handleSwitch(item)">
        {{item.label}}
      </p>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['input', 'change'])
const props = defineProps({
  value: {
    type: String,
    required: true
  },
  dataInfo: {
    type: Array,
    required: true
  }
})


const currentType = ref(props.dataInfo[0].value)

const handleSwitch = (item) => {
  currentType.value = item.value
  emit('input', item.value)
  emit('change', item.value, item)
}
</script>
<script>
export default {
  name: "SelectSwitch"
}
</script>

<style lang='scss' scoped>
.switch-wrapper {
  width: 90px;
  height: 20px;
  // padding: 0 10px;
  border: 0.63px solid rgba(57,175,255,1);
 border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .item {
    flex: 1;
    text-align: center;
    position: relative;
    cursor: pointer;
    z-index: 1;
  }
  
  .item.active {
    color: #fff;
  }

  .active-wrapper {
    width: 50%;
    height: 100%;
    transform: scaleX(-1);
    background-image: linear-gradient(90deg, #61D5FF 0%, #2191DD 100%);
    border-radius: 8px;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 0;
    transition: all 0.1s;
  }

  .active-wrapper-left {
    left: 0;
  }
  
  .active-wrapper-right {
    left: 50%;
  }
}
</style>
