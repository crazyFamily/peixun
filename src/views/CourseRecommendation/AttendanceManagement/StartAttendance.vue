<template>
  <div class="establish__start-attendance">
    <div class="cushion"></div>
    <h1 class="establish__start-attendance__title">
      <span>第{{ searchParams.checkNum }}次考勤</span>
      <div class="full-btn">
        <el-tooltip content="Center Bottom">
          <img src="~@/assets/svg/quanping.svg" alt="" style="width: 24px; height: 24px;" @click="fullScreen()" />
          <div slot="content">切换全屏</div>
        </el-tooltip>
      </div>
    </h1>
    <div class="time between aic">
      <div class="left">
        <span>考勤时间：{{ searchParams.checkDate }}</span>
        <span class="ml45">{{ searchParams.startTime }} -</span>
        <span class="input-time ml7">
          <el-input v-model="hour" maxlength="2"></el-input>
        </span>
        <span class="colon">:</span>
        <span class="input-time">
          <el-input v-model="minute" maxlength="2"></el-input>
        </span>
      </div>
      <div class="right">
        <span class="student-icon"></span>
        <span>签到人数：{{ searchParams.total }}</span>
      </div>
    </div>
    <div class="content">
      <div class="er-code">
        <div class="er-code__title">考勤扫码</div>
        <img :src="qrCodeSrc" alt="" />
        <p class="tac title fz20">请使用口袋银行家扫码签到</p>
      </div>
      <div class="accomplish-attendance">
        <div class="accomplish-attendance__title">
          <span class="icon"></span>
          <span class="text">已签到学员</span>
        </div>
        <div class="box">
          <ul class="items">
            <li class="items__title">
              <span class="left">序号</span>
              <span class="center">姓名</span>
              <span class="right attend-time">签到时间</span>
            </li>
            <vue-seamless-scroll class="items__wraper" :data="finishList">
              <li v-for="(v, i) in finishList" :key="v.umId">
                <span class="left" v-show="i < 3">
                  <i :class="classMaping[i]"></i>
                </span>
                <span class="left" v-show="i >= 3">
                  {{ i + 1 }}
                </span>
                <span class="center">{{ v.empName || v.umId }}</span>
                <span class="right attend-time">{{ v.checkTime }}</span>
              </li>
              <div class="space-block" style="height: 120px;"></div>
            </vue-seamless-scroll>
          </ul>
        </div>
      </div>
      <div class="unfinjshed-attendance">
        <div class="unfinjshed-attendance__title">
          <span class="icon"></span>
          <span class="text">未签到学员</span>
        </div>
        <div class="box">
          <ul class="items">
            <li class="items__title">
              <span class="left">序号</span>
              <span class="center">姓名</span>
            </li>
            <vue-seamless-scroll class="items__wraper" :data="notFinishList">
              <li v-for="(v, i) in notFinishList" :key="v.umId">
                <span class="left">{{ i + 1 }}</span>
                <span class="center">{{ v.empName || v.umId }}</span>
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
export default {
  name: 'CRStartAttendance',
  mounted() {
    if (this.$route.query) {
      // 阻止页面跳转首页，并且全页面显示
      this.$wenEvent.$emit('fullScreen', false)
      this.$wenEvent.$emit('show')
    }
  }
}
</script>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from '@/router'
import {
  fetchGetAttendanceQrCode,
  fetchQueryAttendanceStudentPage
} from '@/fetch/courseRecommendation'

const hour = ref('')
const minute = ref('')

const searchParams = ref({
  // attendanceId: null,
  // checkNum: '',
  // checkDate: '',
  // startTime: '',
  total: 0
})

const classMaping = {
  0: 'one',
  1: 'two',
  2: 'three'
}
const finishList = ref([])
const getFinishList = () => {
  const data = {
    attendanceId: searchParams.value.attendanceId,
    status: 2
  }
  fetchQueryAttendanceStudentPage({ data }).then(res => {
    finishList.value = res.list || []
    searchParams.value.total = res.total
  })
  .catch(e => console.log(e))
}
const notFinishList = ref([])
const getNotFinishList = () => {
  const data = {
    attendanceId: searchParams.value.attendanceId,
    status: 1
  }
  fetchQueryAttendanceStudentPage({ data }).then(res => {
    notFinishList.value = res.list || []
  })
  .catch(e => console.log(e))
}

// 显示二维码
const qrCodeSrc = ref(null)
const getQRCode = async () => {
  const data = {
    attendanceId: searchParams.value.attendanceId,
    width: 400,
    height: 400
  }
  qrCodeSrc.value = await fetchGetAttendanceQrCode({ data })
}

const timer = ref(null)
const timingTask = ({immediate} = {immediate: true}) => {

  const handler = () => {
    getFinishList()
    getNotFinishList()
  }

  immediate && handler()

  timer.value = setInterval(() => {
    handler()
  }, 5000)
}

// 切换全屏
const fullState = ref(false)
const switchFull = () => {
  if (document.fullscreenElement) {
    fullState.value = true
  } else {
    fullState.value = false
  }
}
const fullScreen = () => {
  if (fullState.value) {
    document.exitFullscreen()
  } else {
    document.body.requestFullscreen()
  }
}

onMounted(() => {
  const router = useRoute()
  const params = router.query.params
  if (!params) return
  Object.assign(searchParams.value, JSON.parse(params))
  getQRCode()
  timingTask()
  document.addEventListener('fullscreenchange', switchFull)
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
  document.removeEventListener('fullscreenchange', switchFull)
})
</script>

<style lang="scss" scoped>
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
    .input-time {
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
        font-size: 22px !important;
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
  .content {
    display: flex;
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

</style>
