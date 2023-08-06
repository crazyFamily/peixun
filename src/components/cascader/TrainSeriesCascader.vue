<template>
  <BaseCascader :options="trainSeriesOptions" v-model="trainSeriesDatas" :cascader-props="trainSeriesProps" :width="width" v-bind="$attrs" v-on="$listeners"></BaseCascader>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BaseCascader from './BaseCascader.vue'
import { useEstablish } from '@/views/Establish/hooks/useEstablish'
const { trainSeries, childSeries, getPlanDict } = useEstablish()
const emit = defineEmits(['input'])
const props = defineProps({
  value: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  line: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '150px'
  }
})
const trainSeriesDatas = ref([])
const trainSeriesProps = { value: 'dataEncode', label: 'dataValue' }

watch([() => props.type, () => props.line], ([type, line]) => {
  if(type && line) getPlanDict(line, type, true)
}, {immediate: true})

const trainSeriesOptions = computed(() => {
  return trainSeries.value.map(row => ({...row, children: row.childPlanDict}))
})

watch(() => props.value, n => {
  if(JSON.stringify(props.value) !== JSON.stringify(trainSeriesDatas.value)) {
    trainSeriesDatas.value = props.value
  }
})

watch(trainSeriesDatas, n => {
  console.log(n, '==>>> nnn');
  emit('input', n)
})
</script>
<script>
export default {
  name: "TrainSeriesCascader"
}
</script>

<style lang='scss' scoped>
</style>
