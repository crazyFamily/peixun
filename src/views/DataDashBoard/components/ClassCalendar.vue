<template>
  <!-- 日历 -->
  <div class="base-container calendar-wrapper">
    <div class="header-container">
      <span class="title">日历  <span class="sec-title">注：显示当日举办培训班数</span> </span>
      <el-date-picker
        popper-class="DataDashboard__date-picker__template-dark"
        class="year-style month-style"
        :editable="false"
        size="mini"
        value-format="yyyy-MM"
        type="month"
        v-model="calendarValue"
        :clearable="false"
        align="center"
        @change="handleChange"
      >
      </el-date-picker>
    </div>
    <div class="content-container chart-wrapper" v-loading="getLoadingStatus('LOADING_CLASS_CALENDAR')">
      <el-calendar class="calendar-style" v-model="calendarValue" :key="calendarId">
        <template slot="dateCell" slot-scope="{ date, data }">
          <!-- green-style yellow-style -->
          <div class="calendar-grid" :class="{ 'green-style': calendarMap.has(data.day) }" @click="switchDate(data)">
            <p class="timer">{{ data.day.split('-')[2] }}</p>
            <p class="number-label"> {{ calendarMap.get(data.day) }} </p>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script setup>
import { fetchClassCalendar } from '@/fetch/dataDashboard'
import { ref } from 'vue'
import { useDataDashboard } from '../hooks/useDataDashboard'
import { getLoadingStatus, uuid } from '@/util/utils'
const props = defineProps({
  orgs: {
    type: Array
  },
})

const { watchOrgsCallback } = useDataDashboard({props})
const currentYear = String(new Date().getFullYear())
const currentMonth = String(new Date().getMonth() + 1)
const calendarValue = ref(`${currentYear}-${currentMonth}`)
const calendarMap = ref(new Map())
const baseParams = {
  year: currentYear,
  month: currentMonth,
  orgId: props.orgs[props.orgs.length-1]
}
// 日历
const calendarId = ref(uuid())
const getClassCalendar = () => {
  fetchClassCalendar({data: baseParams}).then((res) => {
    calendarMap.value.clear()
    res.forEach((row) => {
      row.classNum && calendarMap.value.set(row.date, row.classNum)
    })
    calendarId.value = uuid()
  })
}
// getClassCalendar()

const handleChange = (value) => {
  baseParams.year = value?.split('-')[0] || currentYear
  baseParams.month = value?.split('-')[1] || currentMonth
  baseParams.orgId = props.orgs[props.orgs.length-1]
  getClassCalendar()
}
watchOrgsCallback(handleChange)

const switchDate = ({ day: date }) => {
  if(!date) return
  const [year, month, day] = date.split('-')
  if(year !== baseParams.year || month !== baseParams.month) {
    handleChange(date)
  }
}
</script> 
<script>
export default {
  name: 'ClassCalendar'
}
</script>

<style lang='scss' scoped>
@import '../stylesheets/public.scss';

.sec-title {
  font-size: 12px;
  opacity: 0.5;
  font-weight: normal;
  padding-left: 10px;
}

.month-style {
  width: 85px;
}

.calendar-wrapper {
  flex: 1;
  margin-bottom: 0;
}

.calendar-wrapper .content-container {
  padding: 5px;
}

.calendar-style {
  height: 100%;
  box-sizing: border-box;

  :deep(.el-calendar__header) {
    display: none;
  }

  :deep(.el-calendar__body) {
    height: 100%;
    padding: 0;
  }

  :deep(.el-calendar-table) {
    display: block;
    width: 100%;
    height: 100%;

    thead {
      width: 100%;
      height: 40px;
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: #213e8d;
      border-right: 1px dashed #4880d7;
    }

    thead th {
      color: #fff;
      border: 0;
      border-left: 1px dashed #4880d7;
      border-top: 1px dashed #4880d7;
    }

    tbody {
      width: 100%;
      height: calc(100% - 40px);
      display: flex;
      flex-direction: column;
      background: #1d276c;
      border-right: 1px dashed #4880d7;
    }

    tbody tr {
      flex: 1;
    }

    tbody .el-calendar-table__row {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(7, 1fr);

      .prev,
      .next {
        color: rgba(255, 255, 255, 0.4);
      }

      td {
        border: 0;
        border-left: 1px dashed #4880d7;
        border-top: 1px dashed #4880d7;
      }
    }

    tbody .el-calendar-table__row .current {
      color: #fff;
    }

    tbody .el-calendar-table__row .is-selected {
      background: unset;
    }

    tbody .el-calendar-table__row .is-today {
      background: rgba(136, 172, 188, 0.37);
    }

    .el-calendar-day {
      height: 100%;
      padding: 0;
      text-align: center;
    }

    .el-calendar-day:hover {
      cursor: pointer;
      background-color: unset;
    }
  }

  .calendar-grid {
    width: 100%;
    height: 100%;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .timer {
      // padding-top: 10px;
    }
    .number-label {
      font-size: 14px;
      height: 25px;
    }
  }

  .green-style {
    background: rgba(54, 248, 176, 0.22);

    .number-label {
      color: rgba(54, 248, 176, 1);
    }
  }

  .yellow-style {
    background: rgba(240, 222, 55, 0.23);
  }
}
</style>
