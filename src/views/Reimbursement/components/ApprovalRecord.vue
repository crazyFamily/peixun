<template>
  <div class="ApprovalRecord">
      <div class="LaunchTrainingCourse__info-card__reimbursement__approval-record__title LaunchTrainingCourse__title vice-title">
          <div class="LaunchTrainingCourse__title__left-small">
              <div>.</div>审批记录
          </div>
      </div>
      <div class="LaunchTrainingCourse__info-card__reimbursement__approval-record__content LaunchTrainingCourse__content last-tr-no-border">
          <gc-table class="general__table"
              :stripe="false"
              :list="approvalRecordList"
              :tableList="approvalRecordTable"
          ></gc-table>
      </div>
  </div>
</template>

<script>

export default {
  name: 'ApprovalRecord',
  components: {},
  props: {
    approvalRecordTable: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 审批记录 table 字段数组
      approvalRecordList: [
        { label: '序号', width: '65', type: 'index', value: '序号' },
        { prop: 'approvedLink', label: '审批环节', value: '审批环节' },
        { prop: 'approvedName', label: '审批人', value: '审批人' },
        { prop: 'approvedTime', label: '审批时间', value: '审批时间' },
        { prop: 'approvedOpinion', label: '审批意见', value: '审批意见' }
      ],
      // 审批记录 table 数据数组
      // approvalRecordTable: [],
    }
  },
  methods: {},
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.ApprovalRecord {
  padding: 0 20px 20px;
}
</style>