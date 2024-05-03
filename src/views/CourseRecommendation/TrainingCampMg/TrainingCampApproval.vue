<template>
  <div class="approval_container mt20 mb20" :class="{ operate: isForbid }">
    <el-form ref="addForm" label-width="100px">
      <el-form-item
        label="审批链："
        prop="auditUsersUm"
        style="width: calc(70% + 240px)"
      >
        <approval-chain
          :insertList="insertList"
          insertLocation="私财培训支持团队经理"
          chainType="5"
          autoApproval
          @confirm="approvalChainConfirm"
        ></approval-chain>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ApprovalChain from '@/components/ApprovalChain'
import store from '@/store'
import { SET_APPROVAL_INFO } from '@/store/trainingCamp'
import { mapState } from 'vuex'
export default {
  components: {
    ApprovalChain
  },
  props: {
    isDetails: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      approvalChainValue: ''
    }
  },
  computed: {
    isForbid() {
      const { isDetails, operateStatus, eoaStatus } = this
      return isDetails || (operateStatus === 'modify' && eoaStatus === '02002')
    },
    ...mapState({
      operateStatus: (state) => state.trainingCamp.operateStatus,
      eoaStatus: (state) => state.trainingCamp.eoaStatus,
      auditUsersUm: (state) => state.trainingCamp.auditUsersUm,
      classInfoDTOList: (state) => state.trainingCamp.classInfoDTOList
    }),
    insertList() {
      const { classInfoDTOList } = this
      if (classInfoDTOList === null) {
        return []
      }
      const res = classInfoDTOList.map((item) => {
        return {
          chainRoleName: '培训班负责人',
          approveFlag: '→',
          chainDesc: '顺序审批',
          isRequired: 'Y',
          edit: false,
          chainUmId: item.applyUmId,
          chainEmpName: item.applyName
        }
      })
      return res
    }
  },
  watch: {
    auditUsersUm: {
      handler(val) {
        console.log('auditUsersUm', Boolean(val), val)
        if (val) {
          this.approvalChainValue = val
        }
      },
      immediate: true
    }
  },
  methods: {
    approvalChainConfirm(data) {
      console.log('approvalChainConfirm', data)
      store.commit(SET_APPROVAL_INFO, data)
    },
    validator() {
      return {
        result: true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.approval_container {
  padding: 4% 20%;
  &.operate {
    pointer-events: none;
  }
}
</style>