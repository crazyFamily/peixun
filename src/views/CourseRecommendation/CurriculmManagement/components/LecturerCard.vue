<template>
  <div class="course-recommendation__lecturer-card">
    <div class="head-img">
      <img :src="data.src" alt="" />
    </div>
    <div class="inf0">
      <div class="name title">{{ data.teacherName }}</div>
      <div class="synopsis">{{ data.introduce }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss">
.course-recommendation__lecturer-card {
  display: flex;
  padding: 20px;
  width: 400px;
  height: 180px;
  background-color: #fff;
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.11);
  border-radius: 20px;
  .head-img,
  .head-img img {
    width: 60px;
    height: 60px;

    border-radius: 50%;
  }
  .head-img {
    margin-right: 20px;
  }
  .name {
    margin-top: 10px;
  }
  .synopsis {
    width: 300px;
    height: 110px;
    margin-top: 10px;
    padding: 10px;
    background: #f8f8fc;
    overflow: auto;
  }
}
</style>
