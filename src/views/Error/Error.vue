<template>
  <div class="Error">
    <h1>非系统用户</h1>
    <h2>您好，您所登录账号在培训管理系统中不存在</h2>
    <h2>{{ time }}秒后登出</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 5,
      timer: null
    }
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.time--
      if (this.time == 0) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~')
        window.location.href = process.env.VUE_APP_API + '/4a/logoutService'
        clearInterval(this.timer)
      }
    }, 1000)
  }
}
</script>

<style scoped>
.Error {
  text-align: center;
  width: 80vw;
  height: 15vw;
  margin-left: 10vw;
  background: #ffffff;
  border-radius: 10px;
  margin-top: 10vw;
}
h1 {
  padding-top: 2vw;
  font-size: 5vw;
  color: #a21020;
}
h2 {
  font-size: 2vw;
  color: #aaaaaa;
}
button {
  width: 10vw;
  height: 3vw;
  border-radius: 10px;
  background: #fd6720;
  color: #fff;
  font-size: 1.5vw;
  line-height: 3vw;
}
</style>
