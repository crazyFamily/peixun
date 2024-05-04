<template>
  <div>
    <LaunchTrainingCourse v-if="isNewVersion === 'N'" />
    <LaunchTrainingCourseNew v-if="isNewVersion === 'Y'" />
  </div>
</template>

<script>
import LaunchTrainingCourse from './LaunchTrainingCourse'
import LaunchTrainingCourseNew from './LaunchTrainingCourseNew'
export default {
  name: 'LaunchReimbursement',
  components: {
    LaunchTrainingCourse,
    LaunchTrainingCourseNew
  },
  data() {
    return {
      isNewVersion: false
    }
  },
  methods: {},
  activated() {
    const params = this.$route.params
    if (params.action === 'add') {
      this.isNewVersion = 'Y'
    } else if (params.action === 'edit') {
      this.isNewVersion = params.primary.isFastReim
    }
  }
}
</script>
<style lang="scss" scoped>
.Reimbursement__LaunchReimbursement {
}
</style>