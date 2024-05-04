<template>
  <el-card class="approval-chain-card canceDisabledColor">
    <el-form :model="approvalChainForm" label-width="60px" v-show="isForbidEdit">
      <el-form-item label="审批链" prop="approvalValue">
        <el-input disabled v-model="planPackageData.auditUsersum"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input
          disabled
          type="textarea"
          class="textarea"
          placeholder="请对本单位年度培训计划进行说明（此段说明也会作为计划审批签报的正文）"
          v-model="approvalChainForm.remark"
          maxlength="1000"
          show-word-limit
          resize="none"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <el-form :model="approvalChainForm" label-width="60px" ref="approvalChainFormRef" v-show="!isForbidEdit" :rules="approvalChainFormRules">
      <el-form-item label="审批链" required>
        <ApprovalChain v-model="approvalChainForm.approvalValue" @confirm="approvalChainCardConfirm" ref="approvalChainRef" />
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input
          type="textarea"
          class="textarea"
          placeholder="请对本单位年度培训计划进行说明（此段说明也会作为计划审批签报的正文）"
          v-model="approvalChainForm.remark"
          maxlength="1000"
          show-word-limit
          resize="none"
          @input="handleRemarkChage"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
// 审批链组件
import { nextTick, reactive, ref, watch } from 'vue'
import ApprovalChain from '@/components/ApprovalChain.vue'
import store from '@/store'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { fetchListFixedChain } from '@/fetch/public'
import { ApprovalChainTransition, ApprovalChainTransitionStr, CopyObj } from '@/util/utils'
import { useAnnual } from '../hooks/useAnnual'
import { Message } from 'element-ui'
const { getAnnualPackageInfo, isForbidEdit } = useAnnual()
const { mergeReactive } = useBaseDataEvents()
const approvalChainForm = reactive({
  auditUsers: '',
  auditUsersUm: '',
  approvalValue: '',
  remark: ''
})

const planPackageData = reactive({})
const approvalChainFormRules = ref({
  remark: [{
    required: true,
    trigger: 'blur',
    message: '请填写备注'
  }]
})
// 获取计划数据
const annualPackageInfo = reactive({})
const approvalChainFormRef = ref(null)
watch(
  () => store.getters['planManagement/getAnnualPackageInfo'],
  (n) => {
    const approvalData = { chain: { auditUsers: '', auditUsersUm: '', approvalValue: '' }, remark: '' }
    approvalChainForm.remark = approvalData.remark = n?.remark
    store.commit('planManagement/updateApprovalData', approvalData)
    approvalChainForm.approvalValue = ''
    console.log(approvalData, '===>>> approvalData');
    mergeReactive({ origin: planPackageData, target: n || {}})
    getApprovalChain(n.blgDept)
    nextTick(() => {
      approvalChainFormRef.value?.clearValidate()
    })
  }
)

const getApprovalChain = async (blgDept) => {
  const { blgStripLine, taskId } = getAnnualPackageInfo()
  console.log({blgDept, taskId});
  // 需要兼容未进行数据查询的时候
  const data = { chainType: 1, orgId: blgDept, blgStripLine, taskId }
  const res = await fetchListFixedChain({ data })
  if(!res) return
  const auditUsers = ApprovalChainTransition(res.fixedList)
  const auditUsersUm = ApprovalChainTransitionStr(res.fixedList)
  if(auditUsers.length) {
    approvalChainForm.approvalValue = auditUsers.join('')
  }
  if(auditUsersUm.length) {
    approvalChainForm.auditUsersUm = auditUsers.join('')
  }
}

const approvalChainCardConfirm = (data) => {
  const approvalData = CopyObj(store.getters['planManagement/getAnnaulApprovalData'])
  approvalData.chain = data
  store.commit('planManagement/updateApprovalData', approvalData)
}

const handleRemarkChage = (data) => {
  const approvalData = CopyObj(store.getters['planManagement/getAnnaulApprovalData'])
  approvalData.remark = data.trim()
  store.commit('planManagement/updateApprovalData', approvalData)
}

</script>
<script>
export default {
  name: 'AnnualApproval'
}
</script>

<style lang='scss' scoped>
  .approval-chain-card {
    margin-top: -1px;
    border-top: 1px dashed #eaecf1;
    :deep(.textarea) {
      textarea {
        height: 180px;
      }
    }
    .button {
      display: flex;
      margin: 60px 0 10px;
      justify-content: center;
    }
  }
</style>