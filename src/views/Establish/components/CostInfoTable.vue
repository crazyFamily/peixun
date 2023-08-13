<template>
  <div class="gc-costInfoTable">
    <gc-table
      class="mt20 cost-info"
      :noList="true"
      :border="true"
      :spanMethodColLen="4"
      :tableList="costInfoTableList"
      :span-method="costInfoSpanMethod"
      :row-class-name="rowClassName"
      :cell-style="cellStyle"
    >
      <el-table-column label="费用类别" min-width="200">
        <template v-slot="scope">
          <div class="label-wrapper">
            {{ scope.row.expenseTypeDesc }}<span v-if="scope.row.expenseType === MEALS_AND_MISCELLANEOUS" style="font-size: 12px;"><span style="color: red;">（区分食堂外部）</span></span>
            <el-tooltip
              effect="light"
              popper-class="table-popper"
              v-if="showHimt(scope.row, 1)"
              ><i class="el-icon-question active"></i>
              <Himt :row="scope.row" slot="content" state="1" />
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="子类别" min-width="220">
        <template v-slot="scope">
          {{ scope.row.childDesc }}
          <el-tooltip
            effect="light"
            popper-class="table-popper"
            v-if="showHimt(scope.row, 2)"
            ><i class="el-icon-question active"></i>
            <Himt :row="scope.row" slot="content" state="2" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column min-width="500" class-name="cost-info-table__col">
        <template slot-scope="scope">
          <div v-if="scope.row.expenseType !== '000202'">
            <template v-if="scope.row.unitExpenseShow">
              <el-input
                class="w90"
                v-model="scope.row.unitExpense"
                @blur="
                  checkPrice($event, scope.row, 'unitExpense', '价格')
                  $emit('isBeyond', scope.row)
                "
                :disabled="disabled"
              ></el-input>
              <span>元/次/人 x</span>
            </template>

            <template v-if="scope.row.unitNumShow">
              <el-input
                class="w90"
                v-model.number="scope.row.unitNum"
                @blur="
                  checkPersonNum($event, scope.row, 'unitNum')
                  $emit('isBeyond', scope.row)
                "
                :disabled="disabled"
              ></el-input>
              <span>人</span>
            </template>

            <template v-if="scope.row.dayNumShow">
              x
              <el-input
                class="w90"
                v-model="scope.row.dayNum"
                @blur="
                  checkDay($event, scope.row, 'dayNum')
                  $emit('isBeyond', scope.row)
                "
                :disabled="disabled"
              ></el-input>
              <span>天</span>
            </template>
          </div>
          <div v-else class="lecturerList">
            <div
              class="item"
              v-for="item in lecturerList"
              :key="item.teacherId"
            >
              <div class="name">{{ item.lecturerName }}的费用</div>
              <div class="price">
                <el-input
                  type="text"
                  v-model="item.expense"
                  class="mr10 w150"
                  @blur="
                    checkPrice($event, item, 'expense', '讲师费用'),
                      lecturerBlur(item)
                  "
                  :disabled="disabled"
                />
                元
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="费用" min-width="184">
        <template slot-scope="scope">
          <div class="df aic" v-if="isReadOnly(scope.row)">
            <gc-readonlyInput width="90" class="margin-0 mr10">
              {{ countTotal(scope.row) }}
            </gc-readonlyInput>
            元
          </div>
          <div class="df aic" v-else>
            <el-input
              v-model="scope.row.expense"
              class="mr10 w90"
              @blur="checkPrice($event, scope.row, 'expense', '费用')"
              :disabled="disabled"
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
          >总 计</el-table-column
        >
        <el-table-column min-width="905" class-name="input">
          <el-input disabled class="w150" :value="total"></el-input>
          元
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { CopyObj, myRound } from '../../../util/utils'
import Himt from './Himt'
import { MEALS_AND_MISCELLANEOUS } from '../enum'

export default {
  components: { Himt },
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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 费用信息 数据数组
      costInfoTableList: [],
      // 费用信息 表格 数据 默认数组
      defaultCostInfoTableList: [
        {
          expenseType: '000101',
          expenseTypeDesc: '餐杂费',
          childDesc: '',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: true,
          unitNumShow: true,
          dayNumShow: true
        },
        {
          expenseType: '000501',
          expenseTypeDesc: '场租及会务费',
          childDesc: '',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: true,
          unitNumShow: true,
          dayNumShow: true
        },
        {
          expenseType: '000201',
          expenseTypeDesc: '外部培训费',
          childDesc: '外部课程研发费用',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000202',
          expenseTypeDesc: '外部培训费',
          childDesc: '外部培训师课酬（含差旅）',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000203',
          expenseTypeDesc: '外部培训费',
          childDesc: '外派培训费',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000204',
          expenseTypeDesc: '外部培训费',
          childDesc: '资格认证费',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000205',
          expenseTypeDesc: '外部培训费',
          childDesc: '平安大学培训费（移动）',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000206',
          expenseTypeDesc: '外部培训费',
          childDesc: '平安大学培训费(面授)',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000401',
          expenseTypeDesc: '差旅',
          childDesc: '交通费',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000404',
          expenseTypeDesc: '差旅',
          childDesc: '交通费（平安大学）',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: true,
          unitNumShow: true,
          dayNumShow: false
        },
        {
          expenseType: '000403',
          expenseTypeDesc: '差旅',
          childDesc: '住宿费',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: true,
          unitNumShow: true,
          dayNumShow: true
        },
        {
          expenseType: '000402',
          expenseTypeDesc: '差旅',
          childDesc: '交通补助',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        },
        {
          expenseType: '000405',
          expenseTypeDesc: '差旅',
          childDesc: '出差补助',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: true,
          unitNumShow: true,
          dayNumShow: true
        },
        {
          expenseType: '001001',
          expenseTypeDesc: '其他费用',
          childDesc: '',
          unitExpense: '',
          unitNum: '',
          dayNum: '',
          expense: '',
          unitExpenseShow: false,
          unitNumShow: false,
          dayNumShow: false
        }
      ],
      showHimtList: [
        '餐杂费',
        '场租及会务费',
        '交通费',
        '交通费（平安大学）',
        '住宿费',
        '交通补助',
        '出差补助'
      ],
      MEALS_AND_MISCELLANEOUS
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
      if (value >= 0) {
        row[key] = myRound(row[key], 2)
      } else {
        this.$message.warning(`${desc}必须大于0`)
        row[key] = ''
        $event.target.focus()
      }
    },
    lecturerBlur(item) {
      if (item.lecturerName === '外部讲师') {
        item.expense = ''
      }
    },
    // 费用信息 求积
    countTotal(row) {
      let sum = row.expense
      if (row.expenseType !== '000202') {
        const unitExpense = row.unitExpenseShow ? row.unitExpense || 0 : 1
        const unitNum = row.unitNumShow ? row.unitNum || 0 : 1
        const dayNum = row.dayNumShow ? row.dayNum || 0 : 1
        if (
          parseInt(unitExpense) === 0 &&
          parseInt(unitNum) === 0 &&
          (parseInt(dayNum) === 0 ||
            (!row.dayNumShow && parseInt(dayNum) === 1))
        ) {
        } else {
          sum = myRound(unitExpense * unitNum * dayNum, 2)
          this.$nextTick(() => {
            row.expense = sum
          })
        }
      } else {
        if (this.lecturerList.length) {
          const total = this.lecturerList.reduce(
            (a, b) => a + parseFloat(b.expense || 0) || 0,
            0
          )
          sum = myRound(total, 2)
          this.$nextTick(() => {
            row.expense = sum
          })
        }
      }
      return sum
    },
    getList() {
      return CopyObj(this.costInfoTableList)
    },
    isReadOnly(row) {
      return (
        row.dayNumShow ||
        row.unitNumShow ||
        row.unitExpenseShow ||
        row.expenseType === '000202'
      )
    },
    focus(e) {
      const value = e.target.value
      if (value == 0) {
        e.target.value = ''
      }
    },
    getTotal() {
      return this.total
    },
    showHimt(row, state) {
      if (state === 1) {
        return this.showHimtList.includes(row.expenseTypeDesc)
      } else {
        return this.showHimtList.includes(row.childDesc)
      }
    },
    // 将场租及会务费费用改为 200 或者160
    setCost(flag) {
      const item = this.costInfoTableList.find(
        (v) => v.expenseType === '000501'
      )
      item.unitExpense = flag ? '200' : '160'
      this.$nextTick(() => {
        this.$emit('isBeyond', item)
      })
    },
    rowClassName({ row, rowIndex }) {
      if (
        this.costInfoTableList[rowIndex].expenseTypeDesc !==
        this.costInfoTableList[rowIndex + 1]?.expenseTypeDesc
      ) {
        return 'buttom-border'
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 &&
        this.costInfoTableList[rowIndex].expenseTypeDesc !==
          this.costInfoTableList[rowIndex - 1]?.expenseTypeDesc &&
        this.costInfoTableList[rowIndex].expenseTypeDesc ===
          this.costInfoTableList[rowIndex + 1]?.expenseTypeDesc
      ) {
        return 'border-bottom: 1px solid #eaecf1 !important;'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      $(this.$el)
        .find('.lecturerList')
        .closest('.cell')
        .addClass('lecturerList-box')
      $(this.$el).on('focus', 'input', this.focus)
    })
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
        this.costInfoTableList.forEach((row) => {
          this.$emit('isBeyond', row)
        })
      }
    },
    costInfoTableList: {
      deep: true,
      handler() {
        this.$emit('listChange')
      }
    }
  },
  computed: {
    total() {
      const total = this.costInfoTableList.reduce(
        (c, n) => c + (parseFloat(n.expense) || 0),
        0
      )
      return myRound(total, 2)
    }
  },
  destroyed() {
    $(this.$el).off()
  }
}
</script>

<style lang="scss" scoped>
.cost-info {
  :deep(.el-table th::before) {
    display: none;
  }
  :deep(.cost-info-table__col) {
    padding: 0 !important;
    span {
      margin: 0 8px;
    }
    .lecturerList-box {
      padding: 0 !important;
      .item {
        display: flex;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #eaecf1;

        &:last-child {
          border-bottom: none;
        }
        .name {
          flex: 1;
          padding-left: 15px;
          border-right: 1px solid #eaecf1;
        }
        .price {
          flex: 1;
          padding-left: 15px;
        }
      }
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
  :deep(.buttom-border td) {
    border-bottom: 1px solid #eaecf1 !important;
  }
}
</style>
