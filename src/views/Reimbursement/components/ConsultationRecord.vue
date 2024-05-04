<template>
  <div class="ConsultationRecord">
    <div class="LaunchTrainingCourse__info-card__reimbursement__consultation-record__title LaunchTrainingCourse__title vice-title">
        <div class="LaunchTrainingCourse__title__left-small">
          <div>.</div>
          咨询记录
        </div>
        <!-- <div class="icons">
            <span class="icons__add">
                <i class="icons__add__icon"></i> 新增
            </span>
            <span class="icons__del">
                <i class="icons__del__icon"></i> 删除
            </span>
        </div> -->
    </div>
    <div
        class="LaunchTrainingCourse__info-card__reimbursement__consultation-record__contant LaunchTrainingCourse__content"
        :class="{ 'last-tr-no-border': consultationRecordTable.length }">
        <gc-table class="general__table"
            :stripe="false"
            :list="consultationRecordList"
            :tableList="consultationRecordTable"
        ></gc-table>
    </div>

  </div>
</template>

<script>

export default {
  name: 'ConsultationRecord',
  components: {},
  props: {
    consultationRecordTable: { // 审批记录 table 数据数组
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 审批记录 table 字段数组
       // 审批记录 table 字段数组
      consultationRecordList: [
        { label: '序号', width: '60', type: 'index', value: '序号' },
        { 
          prop: 'consultantUm',
          label: '操作人',
          formatter: row => `${row.consultantUm || row.replierUm}`,
          value: '咨询人' },
        // { prop: 'consultantName', label: '咨询人', value: '咨询人' },
        // { prop: 'replierName', label: '被咨询人', value: '被咨询人' },
        { prop: 'consultTime', label: '咨询时间', value: '咨询时间', width: '160' },
        { prop: 'content', label: '咨询意见', value: '咨询意见', width: '300' },
        // { prop: 'revokeName', label: '撤回人', value: '撤回人' },
        { prop: 'revokeUm', label: '撤回人', value: '撤回人' },
        { prop: 'revokeTime', label: '撤回时间', value: '撤回时间', width: '160' }
      ],
    }
  },
  methods: {},
  mounted() {

  }
}
</script>
<style lang="scss" scoped>
.ConsultationRecord {
  padding: 0 20px 20px;
  .general__table {
    :deep(.cell.el-tooltip){
      white-space: inherit;
    }
  }
}
</style>