<template>
  <div class="gc-setApprovalPerson__dialog-box">
    <div class="table-wrap">
      <el-table :data="[{}]" border :show-header="false">
        <el-table-column width="100">审批链设置</el-table-column>
        <el-table-column min-width="200"
          >（重复审批人将自动合并）</el-table-column
        >
      </el-table>
    </div>
    <gc-table :list="fieldList" :tableList="dataList" border>
      <el-table-column label="角色" min-width="160">
        <template slot-scope="scope">
          <span
            :class="scope.row.isRequired === 'Y' ? 'necessary-before l1' : ''"
          >
            {{ scope.row.chainRoleName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" min-width="200" prop="chainEmpName">
      </el-table-column>
      <el-table-column min-width="260">
        <div slot-scope="scope" v-if="scope.row.edit">
          <el-input
            class="w120 mr20"
            v-model.trim="scope.row.chainUmId"
            @input="input(scope.row)"
          ></el-input>
          <el-button
            class="button-60-h30"
            type="primary"
            @click="checkUM(scope.row)"
            >{{ scope.row.text }}</el-button
          >
        </div>
        <div slot-scope="scope" v-else>
          {{ scope.row.chainUmId }}
        </div>
      </el-table-column>
      <el-table-column
        label="任务描述"
        min-width="200"
        prop="chainDesc"
      ></el-table-column>
    </gc-table>

    <gc-table
      class="mt30"
      :list="fieldList"
      :tableList="divideTableList"
      border
      v-if="divideTableList.length"
    >
      <el-table-column label="分摊机构" min-width="200">
        <template slot-scope="scope">
          <span>
            {{ scope.row.divideOrgName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" min-width="200" prop="chainEmpName">
      </el-table-column>
      <el-table-column min-width="220">
        <div slot-scope="scope" v-if="scope.row.edit">
          <el-input
            class="w120 mr20"
            v-model.trim="scope.row.chainUmId"
            @input="input(scope.row)"
          ></el-input>
          <el-button
            class="button-60-h30"
            type="primary"
            @click="checkUM(scope.row)"
            >{{ scope.row.text }}</el-button
          >
        </div>
        <div slot-scope="scope" v-else>
          {{ scope.row.chainUmId }}
        </div>
      </el-table-column>
      <el-table-column
        label="任务描述"
        min-width="200"
        prop="chainDesc"
      ></el-table-column>
    </gc-table>
  </div>
</template>


<script>
import {
  hintFrame,
  jsonHeaders,
  ApprovalChainTransitionStr,
  ApprovalChainTransition,
  ApprovalChainTransitionName,
  CopyObj
} from '@/util/utils'
import {
  fetchListFixedChain,
  fetChcheckUmIdIsValid
} from '@/fetch/sparkProject'
export default {
  name: 'ExamApprovalPerson',
  props: {
    chainType: {
      type: null,
      default: '3'
    },
    orgId: {
      type: null
    },
    lixiangCondition: {
      type: null
    },
    isAppend: {
      type: null
    },
    showInput: {
      type: null,
      default: 'true'
    },
    insertList: {
      type: Array,
      default: () => []
    },
    insertLocation: {
      type: Number | String
    },
    fetchParams: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    fetchParams: {
      handler(n) {
        if (Object.keys(n)) {
          this._getEoaFixedChain()
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      visible: false,
      // 配置审批链 dialog 字段数组
      fieldList: [
        {
          type: 'index',
          label: '序号',
          width: '100'
        }
      ],
      // 配置审批链 dialog 数据数组
      dataList: [],
      value: '',
      // 立项 分摊 的一些数据
      divideTableList: []
    }
  },
  methods: {
    async _getEoaFixedChain() {
      let data = await fetchListFixedChain({ data: { ...this.fetchParams } })
      if (data.divideList) {
        data.divideList.forEach((v) => {
          v.chainEmpName = v.chainEmpName?.trim()
          v.edit = !v.chainEmpName
          v.text = '检查'
        })
        this.divideTableList = data.divideList
      }
      data = data.fixedList
      data.forEach((v) => {
        v.chainEmpName = v.chainEmpName?.trim()
        v.edit = !v.chainEmpName
        v.text = '检查'
      })
      const { insertList, insertLocation } = this
      if (insertList.length > 0 && insertLocation) {
        let res = []
        const index = data.findIndex((i) => i.chainRoleName === insertLocation)
        if (index > -1) {
          res = [
            ...data.filter((v, i) => i < index),
            ...insertList,
            ...data.filter((v, i) => i >= index)
          ]
          data = res.map((item, i) => {
            return { ...item, pageSort: i + 1 }
          })
        }
      }
      this.dataList = data
      this.visible = true
    },
    // 检查 um 号
    async checkUM(row) {
      const { chainUmId: umId } = row
      if (!umId) {
        this._alertTip('请填写 um 号')
        return
      }
      let data = await fetChcheckUmIdIsValid({ umId })
      row.chainEmpName = data.empName
      row.chainResultUm = data.umId
      row.text = '已检查'
    },
    input(row) {
      if (row.text === '已检查') {
        row.text === '检查'
      }
    },
    _alertTip(msg) {
      this.$alert(msg, '提示', {
        confirmButtonText: '确定',
        customClass: `loginTimeout`
      })
    },
    confirm() {
      const notCheck = this.dataList
        .concat(this.divideTableList)
        .find((v) => v.isRequired === 'Y' && !v.chainResultUm && v.edit)
      if (notCheck) {
        this._alertTip(
          `${notCheck.chainRoleName || notCheck.divideOrgName} 未检查`
        )
        return false
      }
      const data = this.dataList.filter((v) => v.chainResultUm || !v.edit)
      const set = data.filter((v) => v.chainUmId && v.chainEmpName)
      const divideTableList = CopyObj(this.divideTableList).filter(
        (v) => v.chainResultUm || !v.edit
      )
      if (divideTableList.length) {
        divideTableList[0].approveFlag = '→'
      }
      divideTableList.forEach((v) => {
        if (v.chainEmpName && v.chainUmId) {
          set.push(v)
        }
      })
      for (let i = set.length - 1; i >= 0; i--) {
        const val = set[i]
        if (
          val.edit &&
          set.findIndex((v) => v.chainUmId === val.chainUmId && !v.edit) > -1
        ) {
          set.splice(i, 1)
          return
        }
        const index = set.findIndex((v) => v.chainUmId === val.chainUmId)
        if (index > -1 && index < i) {
          set.splice(i, 1)
        }
      }
      const auditUsers = ApprovalChainTransition(set)
      const auditUsersUm = ApprovalChainTransitionStr(set)
      const auditUsersName = ApprovalChainTransitionName(set)

      this.$emit('confirm', {
        auditUsers: auditUsers.join(''),
        auditUsersUm: auditUsersUm.join(''),
        auditUsersName: auditUsersName.join('')
      })

      this.value = auditUsersUm.join('')
      this.visible = false

      return {
        auditUsers: auditUsers.join(''),
        auditUsersUm: auditUsersUm.join(''),
        auditUsersName: auditUsersName.join('')
      }
    },
    reset() {
      this.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.gc-setApprovalPerson {
  .input-box {
    height: 30px;
    .input {
      flex: 1;
      padding: 0 10px;
      border: 1px solid #e0e1e3;

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    :deep(.el-button) {
      margin: 0 20px;
    }
  }
  &__dialog-box {
    .table-wrap {
      margin-bottom: -1px;
    }
    :deep(.gc-table) {
      th::before {
        display: none;
      }
    }
    .items {
      margin-top: 30px;
    }
  }
}
</style>