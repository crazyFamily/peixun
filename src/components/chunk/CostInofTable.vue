<template>
  <div class="gc-costInfoTable">
    <gc-table
      class="mt20 cost-info"
      :border="true"
      :list="costInfoList"
      :spanMethodColLen="4"
      :tableList="costInfoTableList"
      :span-method="costInfoSpanMethod"
    >
      <el-table-column min-width="500" class-name="cost-info-table__col">
        <template slot-scope="scope">
          <div>
            <template v-if="scope.row.unitExpenseShow">
              <el-input
                class="w90"
                v-model="scope.row.unitExpense"
                :maxlength="5"
                @blur="checkPrice($event, scope.row, 'unitExpense', '价格')"
              ></el-input>
              <span>元/人/天 x</span>
            </template>

            <template v-if="scope.row.stuNumShow">
              <el-input
                class="w90"
                v-model.number="scope.row.stuNum"
                :maxlength="5"
                @blur="checkPersonNum($event, scope.row, 'stuNum')"
              ></el-input>
              <span>人</span>
            </template>

            <template v-if="scope.row.dayNumShow">
              x
              <el-input
                class="w90"
                :maxlength="5"
                v-model="scope.row.dayNum"
                @blur="checkDay($event, scope.row, 'dayNum')"
              ></el-input>
              <span>天</span>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="费用" min-width="184">
        <template slot-scope="scope">
          <div
            class="df aic"
            v-if="
              scope.row.dayNumShow ||
              scope.row.stuNumShow ||
              scope.row.unitExpenseShow
            "
          >
            <gc-readonlyInput width="90" class="margin-0 mr10">
              {{ countTotal(scope.row) }}
            </gc-readonlyInput>
            元
          </div>
          <div class="df aic" v-else>
            <el-input
              v-model="scope.row.unitTotalFee"
              class="mr10 w90"
              @blur="checkPrice($event, scope.row, 'unitTotalFee', '费用')"
            >
       </el-input>
            元
          </div>
        </template>
      </el-table-column>
    </gc-table>
    <div class="table-box general__table">
      <el-table :show-header="false" :data="[{}]">
        <el-table-column min-width="200" class-name="total"
          >每 期 合 计</el-table-column
        >
        <el-table-column min-width="353" class-name="input">
          <el-input disabled class="w150" :value="total"></el-input>
          元
        </el-table-column>
        <el-table-column min-width="200" class-name="total bl"
          >总 计</el-table-column
        >
        <el-table-column min-width="352" class-name="input">
          <el-input disabled class="w150" :value="costTotal"></el-input>
          元
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { CopyObj, myRound } from '../../util/utils'
export default {
  props: {
    list: {
      type: null
    },
    termNum: {
      type: null
    },
    lecturerList: {
      type: null,
      default: () => []
    }
  },
 data() {
    return {
      //  费用信息 表格 字段数组
      costInfoList: [
        {
          label: '费用类别',
          width: '200',
          prop: 'expenseTypeDesc'
        },
        {
          label: '子类别',
          width: '220',
          prop: 'childDesc'
        }
      ],
      // 费用信息 数据数组
      costInfoTableList: [],
      // 费用信息 表格 数据 默认数组
      defaultCostInfoTableList: [
        {
          expenseType: '000101',
          expenseTypeDesc: '餐杂费',
          childDesc: '',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: true,
          stuNumShow: true,
          dayNumShow: true
        },
        {
          expenseType: '000501',
          expenseTypeDesc: '场租及会务费',
          childDesc: '',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: true,
          stuNumShow: true,
          dayNumShow: true
        },
   {
          expenseType: '000201',
          expenseTypeDesc: '外部培训费',
          childDesc: '外部课程研发费用',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000202',
          expenseTypeDesc: '外部培训费',
          childDesc: '外部培训师课酬（含差旅）',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000203',
          expenseTypeDesc: '外部培训费',
          childDesc: '外派培训费',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000204',
          expenseTypeDesc: '外部培训费',
          childDesc: '资格认证费',
      unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000205',
          expenseTypeDesc: '外部培训费',
          childDesc: '平安大学培训费（移动）',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000206',
          expenseTypeDesc: '外部培训费',
          childDesc: '平安大学培训费(面授)',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000401',
          expenseTypeDesc: '差旅',
          childDesc: '交通费',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
       },
        {
          expenseType: '000402',
          expenseTypeDesc: '差旅',
          childDesc: '交通补助',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000403',
          expenseTypeDesc: '差旅',
          childDesc: '住宿费',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: true,
          stuNumShow: true,
          dayNumShow: true
        },
        {
          expenseType: '000404',
          expenseTypeDesc: '差旅',
          childDesc: '交通费（平安大学）',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: true,
          stuNumShow: true,
          dayNumShow: false
        },
        {
          expenseType: '000405',
          expenseTypeDesc: '差旅',
          childDesc: '出差补助',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: true,
          stuNumShow: true,
          dayNumShow: true
      },
        {
          expenseType: '001001',
          expenseTypeDesc: '其他费用',
          childDesc: '',
          unitExpense: '',
          stuNum: '',
          dayNum: '',
          unitTotalFee: '',
          unitExpenseShow: false,
          stuNumShow: false,
          dayNumShow: false
        }
      ]
    }
  },
  methods: {
    // 费用信息 表格合并方法
    costInfoSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let n = 1
        if (
          row.expenseTypeDesc !==
          (this.costInfoTableList[rowIndex - 1] || {}).expenseTypeDesc
        ) {
          this.costInfoTableList.slice(rowIndex + 1).some((v) => {
            if (row.expenseTypeDesc === v.expenseTypeDesc) {
              return !n++
            } else {
              return true
            }
          })
          return [n, 1]
        }
        return [0, 0]
      }
    },
    // 验证 天数
    checkDay($event, row, key) {
      const value = $event.target.value
      if (value === '') return
      if (value > 0 && value % 0.5 === 0) {
        this.$emit('checkDay', $event, row, key)
    return
      }
      this.$message.warning('天数必须大于零并且是0.5的倍数')
      row[key] = ''
      $event.target.focus()
    },
    // 验证 人数
    checkPersonNum($event, row, key) {
      const value = $event.target.value
      if (value === '') return
      if (value > 0 && value % 1 === 0) {
        return
      }
      this.$message.warning('人数必须大于1的整数')
      row[key] = ''
      $event.target.focus()
    },
    // 验证 价格, 费用
    checkPrice($event, row, key, desc) {
      const value = $event.target.value
      if (value === '') return
      if (value > 0) {
        row[key] = myRound(row[key], 2)
      } else {
        this.$message.warning(`${desc}必须大于0`)
        row[key] = ''
        $event.target.focus()
      }
    },
    // 费用信息 求积
    countTotal(row) {
      const unitExpense = row.unitExpenseShow ? row.unitExpense || 0 : 1
      const stuNum = row.stuNumShow ? row.stuNum || 0 : 1
      const dayNum = row.dayNumShow ? row.dayNum || 0 : 1
      if (
        parseInt(unitExpense) === 0 &&
        parseInt(stuNum) === 0 &&
        (parseInt(dayNum) === 0 || (!row.dayNumShow && parseInt(dayNum) === 1))
      ) {
        row.unitTotalFee = row.unitTotalFee
      } else {
     row.unitTotalFee = myRound(unitExpense * stuNum * dayNum, 2)
      }
      return row.unitTotalFee
    },
    getList() {
      return CopyObj(this.costInfoTableList)
    }
  },
  watch: {
    list: {
      immediate: true,
      handler(n) {
        if (n) {
          this.costInfoTableList = this.defaultCostInfoTableList.map((v) => {
            const item = n.find((k) => v.expenseType === k.expenseType)
            const result = item ? this._.merge(CopyObj(v), item) : CopyObj(v)
            return result
          })
        } else {
          this.costInfoTableList = CopyObj(this.defaultCostInfoTableList)
        }
      }
    }
  },
  computed: {
    total() {
      const total = this.costInfoTableList.reduce(
        (c, n) => c + (parseFloat(n.unitTotalFee) || 0),
        0
      )
      return myRound(total, 2)
    },
    costTotal() {
      const total = this.total * (this.termNum || 1)
      return myRound(total, 2)
    }
  }
}
</script>

<style lang="scss" scoped>
.cost-info {
  :deep(.el-table th::before) {
    display: none;
  }
  :deep(.cost-info-table__col) {
    span {
      margin: 0 8px;
    }
  }
  .total {
    background-color: #f9fafc;
    .cell {
      padding: 0;
      text-align: center;
    }
  }
  .input {
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-input {
        margin-right: 10px;
      }
    }
  }
}
</style>
