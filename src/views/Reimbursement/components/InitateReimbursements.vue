<template>
  <!-- 发起报销前的dialog dialog -->
  <gc-model
    width="1180px"
    title="发起报销"
    :visible.sync="visible"
    custom-class="Reimbursement__InitiateReimbursements"
    @comfirm="comfirm"
    @close="close"
  >
    <div class="student">
      <div class="items" :style="{ height }">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <span class="line-20"></span>
        <el-checkbox-group
          v-model="checkedStudent"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="student in students"
            class="item"
            :label="student.umId"
            :key="student.studentName"
          >
            {{ student.studentName }}（{{ student.umId }}）</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div class="button" @click="handleHeight">
        <span>全部</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
    </div>
    <gc-table
      noList
      border
      :show-summary="true"
      class="mt15 border-table"
      :tableList="tableList"
      :summary-method="summaryMethod"
    >
      <el-table-column
        label="费用类别"
        prop="expenseTypeDescMax"
        min-width="120"
      ></el-table-column>
      <el-table-column label="子类别" min-width="180" class-name="item-column">
        <template slot-scope="scope">
          <div
            class="item-df"
            :style="{ flex: item.children.length }"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            {{ item.expenseTypeDescMin }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="立项金额"
        min-width="100"
        prop="budgetAmt"
        class-name="item-column"
      >
        <template slot-scope="scope">
          <div
            class="item-df"
            :style="{ flex: item.children.length }"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            {{ sum(item.children, 'budgetAmt') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="已付款金额"
        min-width="120"
        prop="payedAmt"
        class-name="item-column"
      >
        <template slot-scope="scope">
          <div
            class="item-df"
            :style="{ flex: item.children.length }"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            {{ sum(item.children, 'payedAmt') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="已占用金额"
        min-width="120"
        prop="occupyAmt"
        class-name="item-column"
      >
        <template slot-scope="scope">
          <div
            class="item-df"
            :style="{ flex: item.children.length }"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            {{ sum(item.children, 'occupyAmt') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="可报销金额"
        min-width="120"
        prop="costCanReimbursementTotal"
        class-name="item-column"
      >
        <template slot-scope="scope">
          <div
            class="item-df"
            :style="{ flex: item.children.length }"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            {{ myFloat(item.budgetAmt - item.payedAmt - item.occupyAmt) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="本次报销金额"
        min-width="120"
        prop="amt"
        class-name="item-column"
      >
        <template slot-scope="scope">
          <div
            class="item-df"
            :style="{ flex: item.children.length }"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            {{ sum(item.children, 'amt') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="本次报销金额细项"
        min-width="322"
        class-name="item-column"
      >
        <template slot-scope="scope">
          <div
            class="item-no-height"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            <div
              class="item fend pr20"
              v-for="(itemChildren, m) in item.children"
              :key="`${i}-${m}`"
            >
              {{ itemChildren.expenseTypeDescSmall }}
              <el-input
                class="w-90 ml10"
                @blur="handleCostInfoTableAmtBlur(itemChildren)"
                v-model.trim="itemChildren.amt"
              ></el-input>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="120" class-name="item-column">
        <template slot-scope="scope">
          <div
            class="item-no-height"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            <div
              class="item"
              v-for="(itemChildren, m) in item.children"
              :key="`${i}-${m}`"
            >
              <el-input
                class="w-90 mr10"
                maxlength="20"
                v-model="itemChildren.remark"
              ></el-input>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" class-name="item-column">
        <template slot-scope="scope">
          <div
            class="item-no-height"
            v-for="(item, i) in scope.row.children"
            :key="i"
          >
            <div
              class="item"
              v-for="(itemChildren, m) in item.children"
              :key="`${i}-${m}`"
            >
              <span
                class="active"
                @click="addOneItem(itemChildren, item.children, m)"
                >添加</span
              >
              <span
                class="active ml20"
                v-if="itemChildren.isDel"
                @click="item.children.splice(m, 1)"
                >删除</span
              >
            </div>
          </div>
        </template>
      </el-table-column>
    </gc-table>
  </gc-model>
</template>

<script>
import { sum, CopyObj, myFloat, jsonHeaders } from '../../../util/utils'
export default {
  props: ['classesInfo'],
  data() {
    return {
      // dialog 状态
      visible: false,
      // 学员列表
      students: [],
      // 全选状态
      checkAll: false,
      // 半选中状态
      isIndeterminate: false,
      // 选中的学员
      checkedStudent: [],
      // 数据列表
      tableList: [],
      // 求和工具函数
      sum,
      myFloat,
      // 高度 显示单行用的
      height: '30px'
    }
  },
  methods: {
    open() {
      this.visible = true
      this.$nextTick(() => {
        const list = this.classesInfo.expenseDetails
        this.tableList = this.arrayToNested(list)
        this.getStudentList(this.classesInfo.classId)
      })
    },
    /**
     * 将一层的数组转换为嵌套的数据方便表格显示
     * @param {Array} arr
     * @returns {Array}
     */
    arrayToNested(arr) {
      const result = []
      let last = {}
      let lastChildren
      arr.forEach((item) => {
        item.amt = ''
        item.remark = ''
        item.isDel = false
        if (item.expenseTypeDescMax === last.expenseTypeDescMax) {
          lastChildren = last.children?.slice(-1)[0] || {}
          if (item.expenseTypeDescMin === lastChildren.expenseTypeDescMin) {
            lastChildren.children.push(CopyObj(item))
          } else {
            item.children = [CopyObj(item)]
            Reflect.deleteProperty(item, '__ob__')
            last.children.push(item)
          }
        } else {
          const obj = CopyObj(item)
          obj.children = [CopyObj(obj)]
          const data = {
            expenseTypeDescMax: item.expenseTypeDescMax,
            children: [obj]
          }
          result.push(data)
          last = data
        }
      })
      return result
    },
    // 获取培训班学员信息
    getStudentList(classId) {
      this.$axios
        .post(
          '/fn/classes/manager/afterTrain/listStudentInfos',
          { data: { classId } },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data.RESULT_STUDENTS
            this.students = list
          }
        })
    },
    // 全选按钮change事件
    handleCheckAllChange(val) {
      this.checkedStudent = val ? students.map((v) => v.umId) : []
      this.isIndeterminate = false
    },
    // 单个学生选中change事件
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.students.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.students.length
    },
    handleHeight() {
      if (this.height) {
        this.height = ''
      } else {
        this.height = '30px'
      }
    },
    // 表格合计方法
    summaryMethod(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        } else if (index >= 2 && index <= 6) {
          if (data.length) {
            sums[index] = this[column.property]
          }
        }
      })
      return sums
    },
    // 确认事件
    comfirm() {
      const details = []
      this.tableList.forEach((v) => {
        v.children.forEach((v) => {
          v.children.forEach((v) => {
            if (v.amt > 0) {
              details.push(v)
            }
          })
        })
      })
      const students = this.students.filter((student) =>
        this.checkedStudent.includes(student.umId)
      )
      this.visible = false
      this.$emit('comfirm', { details, students })
    },
    // 清空组件数据 关闭 dialog
    close() {
      this.visible = false
      this.students = []
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedStudent = []
      this.tableList = []
      this.height = '30px'
    },
    addOneItem(item, children, index) {
      const obj = CopyObj(item)
      item.isDel = true
      children.splice(index, 0, obj)
    },
    // 费用信息 表格 本次报销金额 失焦事件
    handleCostInfoTableAmtBlur(row) {
      let canReimburseMoney
      const allMoney =
        (Number.parseFloat(this.classesInfo.budgetTotalAmt) || 0) -
        (Number.parseFloat(this.classesInfo.occupyTotalAmt) || 0)
      const inputAllMoney = sum(this.dataList, 'amt')
      if (
        (this.classesInfo.row.expenseType || this.classesInfo.row.ifShare) ===
        'Y'
      ) {
        canReimburseMoney = allMoney
      } else {
        canReimburseMoney = this.myFloat(
          row.budgetAmt - (row.payedAmt || 0) - (row.occupyAmt || 0)
        )
      }

      if (row.amt > canReimburseMoney) {
        this.$message.warning('报销金额不可大于剩余可报销金额')
        row.amt = ''
      } else if (row.amt < 0) {
        this.$message.warning('报销金额不可小于0')
        row.amt = ''
      } else if (inputAllMoney > allMoney) {
        this.$message.warning(
          `报销总金额[${inputAllMoney}]元不可大于剩余可报销金额[${allMoney}]元`
        )
      } else {
        let amtList
        if (
          (this.classesInfo.row.expenseType || this.classesInfo.row.ifShare) ===
          'Y'
        ) {
          amtList = this.dataList.map((v) => Number.parseFloat(v.amt))
        } else {
          amtList = this.dataList
            .filter((v) => v.feeMinCategoryDesc === row.feeMinCategoryDesc)
            .map((v) => Number.parseFloat(v.amt))
        }
        const amtTotal = sum(amtList)
        if (amtTotal > canReimburseMoney) {
          this.$message.warning(
            `报销金额[${amtTotal}]元不可大于剩余可报销金额[${canReimburseMoney}]元`
          )
          row.amt = ''
        }
      }

      row.amt = this.myFloat(row.amt)
    }
  },
  computed: {
    dataList() {
      const results = []
      this.tableList.forEach((v) => {
        v.children.forEach((v) => {
          v.children.forEach((v) => {
            results.push(v)
          })
        })
      })
      return results
    },
    // 立项金额
    budgetAmt() {
      return sum(this.dataList, 'budgetAmt')
    },
    // 已付款金额
    payedAmt() {
      return this.classesInfo.payedTotalAmt || sum(this.dataList, 'payedAmt')
    },
    // 已占用金额
    occupyAmt() {
      return this.classesInfo.occupyTotalAmt || sum(this.dataList, 'occupyAmt')
    },
    // 可报销金额
    costCanReimbursementTotal() {
      return this.budgetAmt - this.payedAmt - this.occupyAmt
    },
    // 本次报销金额
    amt() {
      return sum(this.dataList, 'amt')
    }
  }
}
</script>

<style lang="scss">
.Reimbursement__InitiateReimbursements {
  .student {
    display: flex;
    overflow: hidden;
    .items {
      display: flex;
      flex: 1;
      .line-20 {
        margin: 5px 20px 0 19px;
      }
      .item {
        margin-right: 30px;
      }
      label {
        display: flex;
        height: 30px;
        align-items: center;
      }
    }
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
    }
    .button {
      width: 60px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #e0e1e3;
      cursor: pointer;
    }
  }
}
</style>