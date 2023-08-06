<template>
  <el-cascader
    clearable
    :options="options"
    :props="cascaderProps"
    collapse-tags
    @change="handleChange"
    v-model="cascaderData"
    ref="baseCascaderRef"
    :style="`width:${width}`"
  ></el-cascader>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
const props = defineProps({
  value: {
    type: Array,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  cascaderProps: {
    type: Object,
    default: () => {}
  },
  width: {
    type: String,
    default: 'auto'
  }
})

const cascaderData = ref([])
watch(() => props.value, n => {
  if(JSON.stringify(cascaderData.value) !== JSON.stringify(props.value)) cascaderData.value = n
})
const emit = defineEmits(['input'])
watch(cascaderData, n => {
  emit('input', CopyObj(n))
})

const handleChange = () => {}
</script>
<script>
export default {
  name: "BaseCascader"
}
</script>

<style lang='scss' scoped>
</style>
