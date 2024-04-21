<template>
  <div class="establish__start-attendance">
    <div class="cushion"></div>
    <h1 class="establish__start-attendance__title">
      <span>第{{ checkNum }}次考勤</span>
      <div class="full-btn">
        <el-tooltip content="Center Bottom">
          <img src="~@/assets/svg/quanping.svg" alt="" style="width: 24px; height: 24px;" @click="full"/>
          <!-- <span @click="full" style="display: block; width: 24px; height: 24px;">
          </span> -->
          <div slot="content">切换全屏</div>
        </el-tooltip>
      </div>
    </h1>
    <div class="time between aic">
      <div class="left">
        <span>考勤时间：{{ startDate }}</span>
        <span class="ml45">{{ startTime }} —</span>
        <span class="ellipse ml7">
          <el-input v-model="hour" @change="updateTime"></el-input>
        </span>
        <span class="colon">:</span>
        <span class="ellipse">
          <el-input v-model="minute" @change="updateTime"></el-input>
        </span>
        <span class="colon">:</span>
        <span class="ellipse">
          <el-input v-model="second" @change="updateTime"></el-input>
        </span>
      </div>
      <div class="right">
        <span class="student-icon"></span>
        <span>签到人数：{{ accomplishAttendance.length }}</span>
      </div>
    </div>
    <div class="content">
      <div class="er-code">
        <div class="er-code__title">考勤扫码</div>
        <img :src="erCodeSrc" alt="" />
        <p class="tac title fz20">请使用口袋银行家或知鸟扫码考勤</p>
      </div>
      <div class="accomplish-attendance">
        <div class="accomplish-attendance__title">
          <span class="icon"></span>
          <span class="text">完成考勤学员</span>
        </div>
        <div class="box">
          <!-- <ul class="items">
            <li class="items__title">
              <span class="left">序号</span>
              <span class="center">姓名</span>
              <span class="right attend-time">考勤时间</span>
            </li>
            <li v-for="(v, i) in foregoing" :key="v.umId">
              <span class="left">
                <i :class="classMaping[i]"></i>
              </span>
              <span class="center">{{ v.studentName }}</span>
              <span class="right attend-time">{{ v.dateCheck }}</span>
            </li> -->
            <ul class="items">
              <li class="items__title">
                <span class="left">序号</span>
                <span class="center">姓名</span>
                <span class="right attend-time">考勤时间</span>
              </li>
              <vue-seamless-scroll class="items__wraper" :data="accomplishAttendance">
                <li v-for="(v, i) in accomplishAttendance" :key="v.umId">
                  <span class="left" v-show="i<3">
                    <i :class="classMaping[i]"></i>
                  </span>
                  <span class="left" v-show="i>=3">
                    {{ i + 1 }}
                  </span>
                  <span class="center">{{ v.studentName }}</span>
                  <span class="right attend-time">{{ v.dateCheck }}</span>
                </li>
                <div class="space-block" style="height: 120px;"></div>
              </vue-seamless-scroll>
            </ul>
        </div>
      </div>
      <div class="unfinjshed-attendance">
        <div class="unfinjshed-attendance__title">
          <span class="icon"></span>
          <span class="text">未完成学员</span>
        </div>
        <div class="box">
          <ul class="items">
            <li class="items__title">
              <span class="left">序号</span>
              <span class="center">姓名</span>
            </li>
            <vue-seamless-scroll class="items__wraper" :data="unfinishedAttendance">
              <li v-for="(v, i) in unfinishedAttendance" :key="v.umId">
                <span class="left">{{ i + 1 }}</span>
                <span class="center">{{ v.studentName }}</span>
              </li>
              <div class="space-block" style="height: 120px;"></div>
            </vue-seamless-scroll>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jsonHeaders, formatDate } from '../../../util/utils'
export default {
  name: 'StartAttendance',
  data() {
    return {
      // 请求对象
      result: {},
      // 第几次考勤
      checkNum: '',
      // 二维码链接
      erCodeSrc: '',
      // 完成考勤的学员
      accomplishAttendance: [],
      // 未完成考勤的学员
      unfinishedAttendance: [],
      classMaping: {
        0: 'one',
        1: 'two',
        2: 'three'
      },
      // 定时器编号
      timer: null,
      // 开始日期
      startDate: '',
      // 开始时间
      startTime: '',
      // 小时
      hour: '',
      // 分钟
      minute: '',
      // 秒
      second: '',
      fullState: false
    }
  },
  methods: {
    // 获取二维码数据
    getErCode() {
      const data = { ...this.result, width: '600', height: '600' }
      this.$axios.post('/fn/classes/manager/attendance/showRrCodeForAttendance', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.erCodeSrc = data
        }
      })
    },
    // 获取已考勤学员
    getAlreadyAttendance() {
      const data = this.result
      this.$axios.post('/fn/classes/manager/attendance/listCheckedOnStudentWhenAttendance', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          data.forEach((v) => {
            v.dateCheck = v.dateCheck.split(' ')[1]
          })
          this.accomplishAttendance = data
        }
      })
    },
    // 获取未考勤学员
    getUnfinishedAttendance() {
      const data = this.result
      this.$axios.post('/fn/classes/manager/attendance/findAbsentStudentsWhenAttendance', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.unfinishedAttendance = data
        }
      })
    },
    // 初始化获取数据
    initData() {
      // this.getErCode()
      this.getAlreadyAttendance()
      this.getUnfinishedAttendance()
    },
    // 更新考勤时间
    updateTime() {
      if (!this.hour || !this.minute || !this.second) {
        return
      }
      let dateEndTime = `${this.hour}:${this.minute}:${this.second}`
      dateEndTime = `${this.startDate} ${dateEndTime}`
      const data = { ...this.result, dateEndTime }
      this.$axios.post('/fn/classes/manager/attendance/modifyAttendanceDateEndtime', { data }, jsonHeaders)
    },
    destoryUpdateTime() {
      if (this.hour && this.minute && this.second) {
        return
      }
      const date = new Date()
      const h = (date.getHours() + '').padStart(2, '0')
      const m = (date.getMinutes() + '').padStart(2, '0')
      const s = (date.getSeconds() + '').padStart(2, '0')
      let dateEndTime = `${h}:${m}:${s}`
      if (date - new Date(`${formatDate()} ${this.startTime}`) < 5000) return
      dateEndTime = `${this.startDate} ${dateEndTime}`
      const data = { ...this.result, dateEndTime }
      this.$axios.post('/fn/classes/manager/attendance/modifyAttendanceDateEndtime', { data }, jsonHeaders)
    },
    full() {
      if (this.fullState) {
        document.exitFullscreen()
      } else {
        document.body.requestFullscreen()
      }
    },
    // 切换全屏
    switchFull(e) {
      if (document.fullscreenElement) {
        this.fullState = true
      } else {
        this.fullState = false
      }
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.initData()
    }, 5000)
    let params
    if (this.$route.query) {
      params = JSON.parse(this.$route.query.params)
      this.$wenEvent.$emit('fullScreen', false)
      this.$wenEvent.$emit('show')
    }
    params = params || this.$route.params
    if (params.data) {
      this.result = params.data
      this.checkNum = params.checkNum
      ;[this.startDate, this.startTime] = params.dateStartTime.split(' ')
      this.getErCode()
      this.initData()
    }
    document.addEventListener('fullscreenchange', this.switchFull)
  },
  computed: {
    foregoing() {
      return this.accomplishAttendance.slice(0, 3)
    },
    posterior() {
      return this.accomplishAttendance.slice(3)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.destoryUpdateTime()
    document.removeEventListener('fullscreenchange', this.switchFull)
  }
}
</script>

<style lang="scss" scoped>
.establish__start-attendance {
  .content {
    display: flex;
  }

  .er-code,
  .accomplish-attendance,
  .unfinjshed-attendance {
    flex: 1;
    margin: 0 2vw;
    font-size: 24px;
  }

  .accomplish-attendance,
  .unfinjshed-attendance {
    height: 100%;

    .box {
      height: calc(100% - 55px);
    }

    .box .items {
      height: 100%;
    }

    .box .items .items__wraper {
      height: calc(100% - 60px) !important;
    }
  }

  // .accomplish-attendance {
  //   .box .items .items__wraper {
  //     height: calc(100% - 240px) !important;
  //   }
  // }

  .accomplish-attendance__title,
  .unfinjshed-attendance__title {
    height: 30px;
  }

  .box .items .items__title span {
    font-size: 24px !important;

    &:first-child {
      width: 50px !important;
    }
  }

  .attend-time {
    width: 100px !important;
  }

  .box .items .items__wraper li {
    height: 60px !important;

    &:first-child {
      border-top: 1px solid #f0f0f0;
    }

    .center {
      display: inline-block;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .accomplish-attendance .box .items .items__wraper li {
    .center {
      width: calc(100% - 170px);
    }
  }

  .er-code {
    img {
      width: 90% !important;
      height: auto !important;
    }
  }

  .content .accomplish-attendance .box .items li,
  .establish__start-attendance .content .unfinjshed-attendance .box .items li {
    height: 60px;
  }

  .content .accomplish-attendance .box .items li .left,
  .establish__start-attendance .content .unfinjshed-attendance .box .items li .left {
    width: 50px !important;
    font-size: 24px !important;
  }
}

.unfinjshed-attendance .box .items li .left {
  width: 50px !important;
  font-size: 24px !important;
}

.establish__start-attendance .content .accomplish-attendance .box .items i {
  width: 30px;
  height: 30px;
  // margin: auto;
  background-size: 30px auto;
}

.establish__start-attendance .content .accomplish-attendance__title {
  font-size: 24px !important;
}

.establish__start-attendance .content .er-code__title {
  font-size: 24px !important;
}

.establish__start-attendance .content .unfinjshed-attendance__title {
  font-size: 24px !important;
}

.establish__start-attendance .content .accomplish-attendance .box .items li,
.establish__start-attendance .content .unfinjshed-attendance .box .items li {
  height: 60px !important;
}

// .establish__start-attendance .content .box .items__wraper {
//   height: 50vh !important;
// }
</style>

<style lang="scss">
.establish__start-attendance {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px;
  background: url('../../../assets/images/bj.png') no-repeat;
  background-size: 100% 100%;

  .cushion {
    flex: 1;
    max-height: 60px;
  }

  &__title {
    position: relative;
    color: #ffffff;
    font-size: 40px;
    font-weight: 500;
    text-align: center;

    .full-btn {
      position: absolute;
      width: 24px;
      height: 24px;
      top: 50%;
      right: 0;
      margin-top: -24px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .time {
    margin-top: 16px;
    height: 40px;
    font-size: 24px;
    .left {
      display: flex;
      align-items: center;
      color: #ffffff;
    }
    .right {
      display: flex;
      color: #944210;
      .student-icon {
        width: 32px;
        height: 28px;
        margin-right: 10px;
        background: url('../../../assets/svg/qiandaorenshu.svg');
      }
    }
  }
  .content {
    display: flex;
    // flex: 4;
    height: 80vh;
    justify-content: space-between;
    margin-top: 28px;
    padding-bottom: 6%;
    .er-code,
    .accomplish-attendance,
    .unfinjshed-attendance {
      width: 356px;
      padding-top: 20px;
      border-radius: 17px;
      background-color: #fff;
      box-shadow: 0 2px 12px 8px rgba(201, 97, 43, 0.1);
    }

    .er-code {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      &__title {
        font-size: 20px;
        color: #333333;
      }
      img {
        width: 298px;
        height: 293px;
      }
    }
    .accomplish-attendance,
    .unfinjshed-attendance {
      &__title {
        display: flex;
        margin-bottom: 20px;
        font-size: 20px;
        color: #ff6734;
        justify-content: center;
        align-items: center;

        .icon {
          width: 24px;
          height: 24px;
          margin-right: 10px;
          background-image: url('../../../assets/svg/kaishikaoqin-wancheng.svg');
        }
      }
      .box {
        padding: 0 20px;
        .items {
          &__title {
            font: 14px 'PingFangSC-Medium';
            color: #1e1e1e;
            background-color: #f3f4fa;
            border: none;
          }
          &__wraper {
            height: 150px;
            overflow: hidden;
          }
          li {
            display: flex;
            height: 50px;
            padding: 0 30px 0 16px;
            align-items: center;
            text-align: center;
            border-bottom: 1px solid #f0f0f0;
            color: #1e1e1e;

            .left {
              width: 28px;
              font: 500 14px 'Roboto-MediumItalic';
            }
            .center {
              flex: 1;
            }
            .right {
              width: 56px;
            }
          }
          .one,
          .two,
          .three {
            display: flex;
            width: 18px;
            height: 28px;
            margin: auto;
            background: url('../../../assets/svg/diyi.svg') center/22px no-repeat;
          }
          .two {
            background-image: url('../../../assets/svg/dier.svg');
          }
          .three {
            background-image: url('../../../assets/svg/disan.svg');
          }
        }
      }
    }
    .unfinjshed-attendance {
      &__title {
        color: #749ae9;
        .icon {
          background-image: url('../../../assets/svg/weiwancheng.svg');
        }
      }
      .box .items {
        &__wraper {
          height: 300px;
        }
      }
    }
  }

  .ellipse {
    display: flex;
    width: 72px;
    height: 40px;
    border-radius: 20px;
    background-color: #fff;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    .el-input {
      width: 50px;
    }
    .el-input__inner {
      border: none;
      outline: none;
      color: #000000;
      font-size: 24px;
    }
  }
  .colon {
    margin: 0 10px;
    line-height: 33px;
  }
}
</style>
