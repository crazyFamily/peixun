<template>
  <TrainingCourseOrderInfo v-if="!isNewVersion" />
  <LaunchTrainingCourseNew disabled v-else />
</template>

<script>
import TrainingCourseOrderInfo from './TrainingCourseOrderInfo'
import LaunchTrainingCourseNew from './LaunchTrainingCourseNew'
export default {
  name: 'ViewReimbursement',
  components: {
    TrainingCourseOrderInfo,
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
    if (params.row) {
      this.isNewVersion = params.row.isFastReim === 'Y'
    }
  }
}
</script>
<style lang="scss" scoped>
.Reimbursement__ViewReimbursement {
}
</style>