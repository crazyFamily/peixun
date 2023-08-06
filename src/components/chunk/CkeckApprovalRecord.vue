<template>
  <!-- 查看 审批记录 -->
  <gc-model
    title="EOA审批记录"
    width="1200px"
    class="add-student"
    :visible.sync="approvalRecordVisible"
  >
    <div class="approval-record-box">
      <div class="title">审批链：{{ auditUsersum }}</div>
      <gc-table
        class="general__table mt20"
        ref="approvalRecordTableRef"
        :list="approvalRecordList"
        :tableList="approvalRecordTableList"
      >
      </gc-table>
    </div>
  </gc-model>
</template>

<script>
import { jsonHeaders } from '../../util/utils'
export default {
  props: ['row'],
  data() {
    return {
      // 审批链
      auditUsersum: '',
      // 查看审批记录 字段数组
      approvalRecordList: [
        {
          type: 'i',
          label: '序号',
          prop: 'orderNo'
        },
        {
          label: '处理人',
          width: '100',
          prop: 'empName'
        },
        {
          label: '处理意见',
          width: '300',
          prop: 'advice'
        },
        {
          label: '处理时间',
          width: '160',
          prop: 'approveDate'
        }
      ],
      // 查看审批记录 数据数组
      approvalRecordTableList: [],
      // 查看审批记录 dialog状态
      approvalRecordVisible: false
    }
  },
  methods: {
    // 打开审批记录dialog
    openApprovalRecord(row) {
      const { taskId } = row
      this.$axios
       .post('/fn/user/listEoaAdvice', { data: { taskId } }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { auditUsersum, eoaAdviceDTOList } = data
            this.approvalRecordTableList = eoaAdviceDTOList
            this.auditUsersum = auditUsersum
            this.approvalRecordVisible = true
          }
        })
    }
  },
  watch: {
    row(n) {
      if (n.taskId) {
        this.openApprovalRecord(n)
      }
    }
  }
}
</script>

<style></style>
