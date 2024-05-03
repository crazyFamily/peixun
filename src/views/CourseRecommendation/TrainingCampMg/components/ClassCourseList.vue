<template>
  <div class="class-course-list_continer">
    <ul class="mb10" :style="{ 'padding-left': paddingLeft }">
      <li v-for="(course, index) in list" :key="index">
        <span>课程{{ index + 1 }}:{{ course.courseName }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    paddingLeft: String
  }
}
</script>

<style lang="scss" scoped>
.class-course-list_continer {
  & ul {
    font-size: 16px;
  }
}
</style>