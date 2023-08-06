<template>
  <div class="gc-AutoApproval">
    <!-- 选择内部讲师 dialog -->
    <gc-model
      width="1000px"
      title="自动审批链"
      class="gc-AutoApproval__model"
      :isAppend="isAppend"
      :visible="visible"
      @close="visible = false"
      @cancel="visible = false"
      @comfirm="visible = false"
    >
      <div class="top-box">
        <div>
          <span class="fz14">审批链设置</span>
          <span class="fz14 shallow">（重复审批人将自动合并）</span>
        </div>
        <gc-table
          class="general__table mt20"
          :list="list"
          :tableList="tableList"
        >
          <el-table-column label="审批人" min-width="388">
            <el-input class="w120"></el-input>
            <el-button class="button-60 ml20 button-blue">检查</el-button>
          </el-table-column>
          <el-table-column label="任务描述" min-width="162"></el-table-column>
        </gc-table>
      </div>

      <div class="bottom-box bottom-line mt20">
  <gc-table
          class="general__table"
          :stripe="false"
          :list="selectedList"
          :tableList="selectedTableList"
        >
        </gc-table>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { jsonHeaders } from '../../util/utils'
export default {
  props: {
    isAppend: {
      type: Boolean,
      default: false
    },
    chainType: {
      type: null
    },
    orgId: {
      type: null
    },
    lixiangCondition: {
      type: null
    }
  },
  data() {
    return {
      // dialog 状态
      visible: false,
      // 检查审批人表格字段 数组
      list: [
       {
          type: 'idnex',
          label: '序号',
          width: '64'
        },
        {
          label: '角色',
          width: '286'
        }
      ],
      // 检查审批人表格数据 数组
      tableList: [],
      // 已存在审批人表格字段 数组
      selectedList: [
        {
          type: '1',
          label: '角色',
          width: '110',
          prop: 'role'
        }
      ],
      // 已存在审批人表格数据 数组
      selectedTableList: [
        {
          role: '审批人'
        },
        {
          role: '任务描述'
        }
      ]
    }
  },
  methods: {
    open() {
  this.visible = true
      const data = {
        chainType: this.chainType,
        totalFee: this.totalFee,
        lecturerFee: this.lecturerFee,
        courseDevelopFee: this.courseDevelopFee
      }
      this.$axios
        .post('/fn/commons/eoa/listFixedChain', { data }, jsonHeaders)
        .then((res) => {
          let { code, data } = res.data
          if (code === 0) {
            data = data.fixedList
            data.forEach((v) => {
              v.edit = !v.chainEmpName
              v.text = '检查'
            })
            this.dataList = data
          }
        })
    }
  }
}
</script>

<style lang="scss">
.gc-AutoApproval__model {
  .el-dialog__body {
    padding: 20px 0 !important;
  }
  .top-box {
    padding: 20px;
    border-bottom: 1px solid #eaecf1;
  }
  .bottom-box {
    padding: 0 20px;
  }
}
</style>
