<template>
  <div class="components__time-series dfc">
    <div :class="{'active-select': activeIndex===0}" class="time-item first" @click="$refs.monthPicker.focus()">
      按月
      <el-date-picker v-model="monthValue" @change="handleMonthValue" :clearable="false" value-format="yyyy-MM" ref="monthPicker" type="monthrange" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份">
      </el-date-picker>
    </div>
    <div class="time-item other" :class="{'active-select': activeIndex===1}" @click="$refs.quarter.show()">
      按季度
      <custom-picker type="quarter" ref="quarter" v-model="quarterValue" @change="handleQuarterValue"></custom-picker>
    </div>
    <div class="time-item other" :class="{'active-select': activeIndex===2}" @click="$refs.halfYear.show()">
      按半年
      <custom-picker type="half-year" ref="halfYear" v-model="halfYearValue" @change="handleHalfYearValue"></custom-picker>
    </div>
    <div class="time-item last" :class="{'active-select': activeIndex===3}" @click="$refs.yearPicker.focus()">
      按年
      <el-date-picker type="year" ref="yearPicker" v-model="yearValue" :clearable="false" value-format="yyyy" popper-class="date-picker" @change="handleYearValue">
      </el-date-picker>
    </div>
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>

<script>
import { lastDay } from '@/util/utils'
import { quarterMap, halfYearMap } from './util'
import customPicker from './custom-picker.vue'
export default {
  name: 'time-chunk',
  components: {
    customPicker
  },
  props: {
    value: null
  },
  data() {
    return {
      monthValue: '',
      yearValue: '',
      quarterValue: '',
      halfYearValue: '',
      thisValue: {},
      content: '',
      activeIndex: 0
    }
  },
  methods: {
    handleMonthValue() {
      this.yearValue = ''
      this.quarterValue = ''
      this.halfYearValue = ''
      const start = `${this.monthValue[0]}-01`
      const end = lastDay(this.monthValue[1])
      this.thisValue = { start, end }
      this.activeIndex = 0
    },
 handleQuarterValue() {
      this.monthValue = ''
      this.yearValue = ''
      this.halfYearValue = ''
      const [year, quarter] = this.quarterValue.split('年')
      const obj = quarterMap.find(v => v.label === quarter)?.value
      if (!obj) return {}
      this.thisValue = {
        start: `${year}-${obj.start}`,
        end: `${year}-${obj.end}`
      }
      this.activeIndex = 1
    },
    handleHalfYearValue() {
      this.monthValue = ''
      this.yearValue = ''
      this.quarterValue = ''
      const [year, halfYear] = this.halfYearValue
        .replace(/年/, '###')
        .split('###')
      const obj = halfYearMap.find(v => v.label === halfYear)?.value
      if (!obj) return {}
      this.thisValue = {
        start: `${year}-${obj.start}`,
        end: `${year}-${obj.end}`
      }
      this.activeIndex = 2
    },
    handleYearValue() {
      this.monthValue = ''
      this.quarterValue = ''
      this.halfYearValue = ''
      const start = `${this.yearValue}-01-01`
      const end = lastDay(`${this.yearValue}-12-01`)
      this.thisValue = { start, end }
      this.activeIndex = 3
    },
    _initData() {
      this.monthValue = ''
      this.yearValue = ''
      this.quarterValue = ''
      this.halfYearValue = ''
      let { start, end } = { ...this.value }
      this.thisValue.start = start
      this.thisValue.end = end
      if (!start && !end) {
        this.content = ''
        this.activeIndex = null
        return
      }
      let startTimeArr = start.split('-')
      let endTimeArr = end.split('-')
      if (
        startTimeArr[0] === endTimeArr[0] &&
        startTimeArr[1] === endTimeArr[1]
      ) {
        this.activeIndex = 0
      }
      this.content =
        startTimeArr[0] +
        '年' +
        startTimeArr[1] +
        '月-' +
        endTimeArr[0] +
        '年' +
        endTimeArr[1] +
        '月'
    }
  },
  created() {
    this._initData()
  },
  watch: {
    thisValue(n) {
      this.$emit('input', n)
      let startTimeArr = this.thisValue.start.split('-')
      let endTimeArr = this.thisValue.end.split('-')
      this.content =
        startTimeArr[0] +
        '年' +
        startTimeArr[1] +
        '月-' +
        endTimeArr[0] +
        '年' +
        endTimeArr[1] +
        '月'
    },
    value(n) {
      this._initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.components__time-series {
  position: relative;
  .time-item {
    padding: 0 15px;
    position: relative;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    cursor: pointer;
  }
  .first {
    border-left: 1px solid #e4e7ed;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
  }
  .first.active-select {
    margin-right: -1px;
  }
  .last {
    border-right: 1px solid #e4e7ed;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }
  .last.active-select {
    margin-left: -1px;
  }
  .other.active-select {
    margin-left: -1px;
  }
  .el-date-editor {
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .content {
    width: 150px;
    margin-left: 10px;
    flex-shrink: 0;
    color: #fec85d;
  }
  .active-select {
    border: 1px solid #fec85d;
    border-color: #fec85d !important;
  }
}
</style>
