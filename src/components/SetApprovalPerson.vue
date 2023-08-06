<template>
  <div class="gc-setApprovalPerson">
    <div class="df input-box" v-if="showInput">
      <div class="input">{{ value }}</div>
      <el-button class="button-w80-h30" type="primary" @click="openDialog"
        >设置审批人</el-button
      >
    </div>

    <!-- 配置审批链 dialog -->
    <gc-model
      width="1000px"
      title="配置审批链"
      cancelText="关闭"
      comfirmText="提交"
      :visible="visible"
      :isAppend="true"
      @close="visible = false"
      @cancel="visible = false"
      @comfirm="confirm"
    >
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
          <el-table-column label="角色" min-width="200">
            <template slot-scope="scope">
              <span
                :class="
                  scope.row.isRequired === 'Y' ? 'necessary-before l1' : ''
                "
              >
                {{ scope.row.chainRoleName }}
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
    </gc-model>
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
} from '../util/utils'
export default {
  props: {
    chainType: {
      type: null
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
    // 打开 配置审批链 dialog
    openDialog() {
      this.$emit('genLixiangCondition')
      this.$nextTick(() => {
        const data = {
          chainType: this.chainType,
      orgId: this.orgId,
          lixiangCondition: this.lixiangCondition
        }
        this.$emit('beforeRequest', data)
        if (data.request === false) return
        this.$axios
          .post('/fn/commons/eoa/listFixedChain', { data }, jsonHeaders)
          .then((res) => {
            let { code, data } = res.data
            if (code === 0) {
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
                const index = data.findIndex(
                  (i) => i.chainRoleName === insertLocation
                )
                console.log('listFixedChain', index)
                if (index > -1) {
                  res = [
                    ...data.filter((v, i) => i < index),
                    ...insertList,
                    ...data.filter((v, i) => i >= index)
                  ]
                  data = res.map((item, i) => {
                    return { ...item, pageSort: i + 1 }
                  })
                  console.log('listFixedChain', data)
                }
              }
              this.dataList = data
              this.visible = true
            }
          })
      })
    },
    // 检查 um 号
    checkUM(row) {
      const { chainUmId: umId } = row
      if (!umId) {
        this.$alert(`   请填写 um 号`, '提示', {
          confirmButtonText: '确定',
          customClass: `loginTimeout`
        })
        return
      }
      this.$axios
        .post('/fn/user/checkUmIdIsValid', { umId }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { empName } = data
            row.chainEmpName = empName
            row.text = '已检查'
          }
        })
  },
    input(row) {
      if (row.text === '已检查') {
        row.text === '检查'
      }
    },
    confirm() {
      const notCheck = this.dataList
        .concat(this.divideTableList)
        .find((v) => v.isRequired === 'Y' && v.text === '检查' && v.edit)
      if (notCheck) {
        return this.$alert(
          `${notCheck.chainRoleName || notCheck.divideOrgName} 未检查`,
          '提示',
          {
            confirmButtonText: '确定',
            customClass: `loginTimeout`
          }
        )
      }
      const data = this.dataList.filter((v) => v.text === '已检查' || !v.edit)
      const set = data.filter((v) => v.chainUmId && v.chainEmpName)
      const divideTableList = CopyObj(this.divideTableList).filter(
        (v) => v.text === '已检查' || !v.edit
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
