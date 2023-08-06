<template>
  <div class="date-wrapper">
    <el-button :disabled="currentMonthIndex>=months.length-1" class="control-button control-right" @click="switchNextMonth"> &lt; </el-button>
    <p class="label">{{currentMonth.planMonthName}}</p>
    <el-button :disabled="currentMonthIndex<=0" class="control-button control-left" @click="switchPrevMonth"> &gt; </el-button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
  const props = defineProps({
    months: {
      type: Array,
      required: true
    }
  })
  const currentMonth = ref({})
  const currentMonthIndex = ref(-1)

  onMounted(() => {
    currentMonth.value = props.months[0] || {}
    props.months[0] && (currentMonthIndex.value = 0)
  })

  const emit = defineEmits(['change'])

  const switchPrevMonth = () => {
    currentMonthIndex.value = currentMonthIndex.value - 1
    currentMonth.value = props.months[currentMonthIndex.value]
    emit('change', currentMonth.value)
  }

  const switchNextMonth = () => {
    currentMonthIndex.value = currentMonthIndex.value + 1
    currentMonth.value = props.months[currentMonthIndex.value]
    emit('change', currentMonth.value)
  }
</script>
<script>
export default {
  name: "DateSwitch"
}
</script>

<style lang='scss' scoped>
.date-wrapper {
  width: 120px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E0E1E3;
  border-radius: 2px;

  .control-button {
    width: 15px;
    height: 100%;
    display: inline-block;
    padding: 0;
    border: 0;
  }

  .label {
    margin: 0 10px;
    min-width: 65px;
    text-align: center;
  }
}
</style>
