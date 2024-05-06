<template>
  <div class="data-range-wrapper">
    <el-date-picker
      class="range-style"
      v-model="queryForm.entryDateStart"
      :picker-options="startPickerOptions"
      v-bind="startProps"
      :disabled="disabled"
      :popper-class="popperClass"
      :default-value="defaultValue"
      @change="handleDateRangeChange"
      :style="width ? `width: ${width};`: ''"
    >
    </el-date-picker>
    <span style="padding: 0 10px">至</span>
    <el-date-picker
      class="range-style"
      v-model="queryForm.entryDateEnd"
      :picker-options="endPickerOptions"
      v-bind="endProps"
      :disabled="disabled"
      :popper-class="popperClass"
      :default-value="defaultValue"
      @change="handleDateRangeChange"
      :style="width ? `width: ${width};`: ''"
    >
    </el-date-picker>
  </div>
</template>

<script setup>
import { useTable } from '@/hooks/useTable'
import { set, watch } from 'vue'
// 起始/结束时间框配置，同element的配置
const props = defineProps({
  value: {
    type: Object,
    default: () => ({startDate: '', endDate: ''})
  },
  startOptions: {
    type: Object,
    default: () => {}
  },
  endOptions: {
    type: Object,
    default: () => {}
  },
  // 支持自定义开始/结束的key-name
  startKey: {
    type: String,
    default: 'startDate'
  },
  endKey: {
    type: String,
    default: 'endDate'
  },
  // 提供统一两个时间框的宽样式, 默认样式为120px;
  width: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dataRangeDisableDate: {
    type: Function,
    default: () => {}
  },
  defaultValue: {
    default: () => {
      return new Date()
    }
  },
  popperClass: {
    type: String
  }
})

if(!props.value.hasOwnProperty([props.startKey])) {
  set(props.value, props.startKey, '')
}

if(!props.value.hasOwnProperty([props.endKey])) {
  set(props.value, props.endKey, '')
}

// 基础配置
const dataRangeBaseProps = {
  editable: false,
  size: 'mini',
  valueFormat: 'yyyy-MM-dd',
  clearable: false,
  align: 'center'
}

const startProps = {
  placeholder: '开始日期',
  ...dataRangeBaseProps,
  ...props.startOptions
}
const endProps = {
  placeholder: '结束日期',
  ...dataRangeBaseProps,
  ...props.endOptions
}

const baseParams = {
  entryDateStart: props.value[props.startKey] || '',
  entryDateEnd: props.value[props.endKey] || ''
}
const { queryForm, dataRangeRules, query, reset, requiredHandle } = useTable(baseParams)
const { startPickerOptions, endPickerOptions } = props.dataRangeDisableDate() || dataRangeRules('entryDateStart', 'entryDateEnd')

// 做重置操作
watch(() => [props.value[props.startKey], props.value[props.endKey]], ([startValue, endValue]) => {
  if (startValue !== queryForm.entryDateStart) {
    queryForm.entryDateStart = startValue || ''
  }
  if (endValue !== queryForm.entryDateEnd) {
    queryForm.entryDateEnd = endValue || ''
  }
})

// 组件切换的时候要广播出去
const emit = defineEmits(['change'])
// 这里利用JS的对像关系，直接修改传入的对像的属性
const handleDateRangeChange = () => {
  props.value[props.startKey] = queryForm.entryDateStart
  props.value[props.endKey] = queryForm.entryDateEnd
  emit('change', {[props.startKey]: queryForm.entryDateStart, [props.endKey]: queryForm.entryDateEnd})
}
</script>
<script>
export default {
  name: 'DateRange'
}
</script>

<style lang="scss" scoped>
.date-range-wrapper {
  display: inline-block;
}
.range-style {
  min-width: 120px;
}
</style>