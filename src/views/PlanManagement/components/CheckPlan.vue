<template>
  <div class="check-plain">
    <el-card class="form-card">
      <div class="title">
        <div class="title__menu"></div>
        基本信息
      </div>
      <div class="mt20">
        <div class="form-box" v-if="showTrainingCourse">
          <template v-if="blgStripLine !== 'FL'">
            <div class="ls-form-wrapper">
              <gc-readonlyInput label="所属部门">
                {{ coursePlanBaseInfo.planDeptName }}
              </gc-readonlyInput>
              <gc-readonlyInput label="计划科目"> 常规预算 </gc-readonlyInput>
              <gc-readonlyInput label="项目类型">
                {{ coursePlanBaseInfo.trainTypeDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="是否消保培训">
                {{ renderIfConformance }}
              </gc-readonlyInput>
              <gc-readonlyInput label="业务模块">
                {{ coursePlanBaseInfo.channelTypeDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="关键岗位">
                {{ coursePlanBaseInfo.keyJobsDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="项目名称"
                >{{ coursePlanBaseInfo.className }}
              </gc-readonlyInput>
              <gc-readonlyInput label="培训系列">
                {{ coursePlanBaseInfo.trainSeriesDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="子系列">
                {{ coursePlanBaseInfo.childSeriesDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="总期数">
                {{ coursePlanBaseInfo.termNum }}
              </gc-readonlyInput>
            </div>
          </template>
          <template v-else>
            <div class="ls-form-wrapper">
              <gc-readonlyInput label="所属部门">
                {{ coursePlanBaseInfo.planDeptName }}
              </gc-readonlyInput>
              <!-- <gc-readonlyInput label="计划科目"> 常规预算 </gc-readonlyInput> -->
              <gc-readonlyInput label="业务模块">
                {{ coursePlanBaseInfo.channelTypeDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="项目类型">
                {{ coursePlanBaseInfo.trainTypeDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="是否消保培训">
                {{ renderIfConformance }}
              </gc-readonlyInput>
              <gc-readonlyInput label="培训系列">
                {{ coursePlanBaseInfo.trainSeriesDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="子系列">
                {{ coursePlanBaseInfo.childSeriesDesc }}
              </gc-readonlyInput>
              <gc-readonlyInput label="关键岗位">
                {{ coursePlanBaseInfo.keyJobsDesc || coursePlanBaseInfo.keyJobs }}
              </gc-readonlyInput>
              <gc-readonlyInput label="项目名称"
                >{{ coursePlanBaseInfo.className }}
              </gc-readonlyInput>
              <gc-readonlyInput label="总期数">
                {{ coursePlanBaseInfo.termNum }}
              </gc-readonlyInput>
            </div>
          </template>
        </div>
        <div v-else class="form-box">
          <div class="ls-form-wrapper">
            <gc-readonlyInput label="所属部门">
              {{ coursePlanBaseInfo.planDeptName }}
            </gc-readonlyInput>
            <template v-if="blgStripLine === 'LS'">
              <gc-readonlyInput label="计划科目"> 常规预算 </gc-readonlyInput>
            </template>
            <gc-readonlyInput label="项目类型">
              {{ coursePlanBaseInfo.trainTypeDesc }}
            </gc-readonlyInput>
            <gc-readonlyInput label="是否消保培训">
              {{ renderIfConformance }}
            </gc-readonlyInput>
            <gc-readonlyInput label="项目名称">
              {{ coursePlanBaseInfo.className }}
            </gc-readonlyInput>
            <gc-readonlyInput label=" " class="block" style="visibility: hidden;"></gc-readonlyInput>
          </div>
        </div>
        <gc-readonlyInput label="备注" class="textarea">
          {{ coursePlanBaseInfo.remark }}
        </gc-readonlyInput>
      </div>
    </el-card>
    <!-- <el-card class="cost-info-card mt10">
      <div class="title">
        <div class="title__menu"></div>
        费用信息
      </div>
      <gc-table
        class="mt20"
        :border="true"
        :list="costInfoList"
        :spanMethodColLen="4"
        :tableList="costInfoTableList"
        :span-method="costInfoSpanMethod"
      >
        <el-table-column min-width="500" class-name="cost-info-table__col">
          <template slot-scope="scope">
            <template v-if="scope.row.unitExpenseShow">
              <gc-readonlyInput width="90" class="margin-0">
                {{ scope.row.unitExpense }}
              </gc-readonlyInput>
              <span>元/人/天 x</span>
            </template>

            <template v-if="scope.row.stuNumShow">
              <gc-readonlyInput width="90" class="margin-0">
                {{ scope.row.stuNum }}
              </gc-readonlyInput>
              <span>人</span>
            </template>

            <template v-if="scope.row.dayNumShow">
              x
              <gc-readonlyInput width="90" class="margin-0">
                {{ scope.row.dayNum }}
              </gc-readonlyInput>
              <span>天</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="费用"
          min-width="184"
          class-name="cost-info-table__col"
        >
          <template slot-scope="scope">
            <gc-readonlyInput width="90" class="margin-0">
              {{ scope.row.unitTotalFee }}
            </gc-readonlyInput>
            元
          </template>
        </el-table-column>
      </gc-table>
      <div class="table-box general__table">
        <el-table :show-header="false" :data="[{}]">
          <el-table-column min-width="200" class-name="total"
            >每 期 合 计</el-table-column
          >
          <el-table-column min-width="353" class-name="input">
            <gc-readonlyInput width="150" class="margin-0">
              {{ total }}
            </gc-readonlyInput>
            元
          </el-table-column>
          <el-table-column min-width="200" class-name="total bl"
            >总 计</el-table-column
          >
          <el-table-column min-width="352" class-name="input">
            <gc-readonlyInput width="150" class="margin-0">
              {{ costTotal }}
            </gc-readonlyInput>
            元
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-card class="apportion-unit mt10">
      <div class="title">
        <div class="title__menu"></div>
        分摊单位
      </div>
      <gc-table
        class="mt20 general__table"
        :list="apportionUnitList"
        :tableList="apportionUnitTableList"
      >
        <el-table-column label="分摊人数" min-width="374">
          <template slot-scope="scope">
            <div class="aic">
              <gc-readonlyInput class="mr10 margin-0" width="90"
                >{{ scope.row.apportionStuNum }}
              </gc-readonlyInput>
              人
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="124">
          <span class="active mr20">
            <el-tooltip content="删除" popper-class="icon-popper">
              <i class="operation__del"></i>
            </el-tooltip>
          </span>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="apportionTotal"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 20]"
        :page-size="apportionUnitForm.pageSize"
        :current-page="apportionUnitForm.currPage"
        @sizeChange="
          sizeChange($event, apportionUnitForm, getApportionUnitList)
        "
        @currentChange="
          currentChange($event, apportionUnitForm, getApportionUnitList)
        "
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card> -->
  </div>
</template>

<script>
import { yesOrNoMap } from '@/util/constants'
import {
  CopyObj,
  dataHeaders,
  jsonHeaders,
  downloadFile,
  openFileInput,
  myRound
} from '../../../util/utils'
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    dept: String,
    classType: String,
    blgDeptName: String,
    blgStripLine: String,
    selectOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 显示培训班 还是非培训班
      showTrainingCourse: true,
      // 新增培训班计划 基本信息表单
      coursePlanBaseInfo: {},
      // 新增培训班计划 基本信息表单 规则验证对象
      coursePlanBaseInfoRules: {
        trainType: [
          {
            required: true,
            message: '请选择项目类型',
            trigger: 'change'
          }
        ],
        channelType: [
          {
            required: true,
            message: '请选择业务模块',
            trigger: 'change'
          }
        ],
        keyJobs: [
          {
            required: true,
            message: '请选择关键岗位',
            trigger: 'change'
          }
        ],
        className: [
          {
            required: true,
            message: '请选择项目名称',
            trigger: 'change'
          }
        ],
        trainSeries: [
          {
            required: true,
            message: '请选择培训系列',
            trigger: 'change'
          }
        ],
        childSeries: [
          {
            required: true,
            message: '请选择培训子系列',
            trigger: 'change'
          }
        ],
        termNum: [
          {
            required: true,
            message: '请填写总期数',
            trigger: 'change'
          }
        ],
        dayNum: [
          {
            required: true,
            message: '请填写每期天数',
            trigger: 'change'
          }
        ],
        studentNum: [
          {
            required: true,
            message: '请填写每期培训人数',
            trigger: 'change'
          }
        ]
      },
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
      // 费用信息 表格 数据数组
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
        // {
        //     expenseType: "001002",
        //     expenseTypeDesc: "支付其他应付款-其他",
        //     childDesc: "出差补助",
        //     unitExpense: "",
        //     stuNum: "",
        //     dayNum: "",
        //     unitTotalFee: "",
        //     unitExpenseShow: false,
        //     stuNumShow: false,
        //     dayNumShow: false
        // },
        // {
        //     expenseType: "001003",
        //     expenseTypeDesc: "支付预提-其他",
        //     childDesc: "出差补助",
        //     unitExpense: "",
        //     stuNum: "",
        //     dayNum: "",
        //     unitTotalFee: "",
        //     unitExpenseShow: false,
        //     stuNumShow: false,
        //     dayNumShow: false
        // }
      ],
      // 分摊单位表格 字段数组
      apportionUnitList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '分摊单位',
          width: '430',
          prop: 'blgOrgName'
        }
      ],
      // 分摊单位表格 数据数组
      apportionUnitTableList: [],
      // 分摊单位 分页表单
      apportionUnitForm: {
        currPage: 1,
        pageSize: 10
      },
      // 分摊机构总计
      apportionTotal: 0,
      // 项目名称 下拉选项
      classNameOptions: [],
      // 点击长传文件input
      openFileInput,
      // 关键岗位下拉选项
      keyPositionOptions: [],
      // 培训子序列下拉选项
      trainSeriesChildOptions: []
    }
  },
  methods: {
    // 转换为 本页适合的数据
    dataTransition() {
      const data = this.data ? CopyObj(this.data) : {}
      console.log(data, '===>>> data');
      this.coursePlanBaseInfo = data.planInfoVo || {}
      this.coursePlanBaseInfo.blgDeptName = this.blgDeptName
      const costInfoTableList = this.defaultCostInfoTableList.map((v) => {
        const item = data.planExpenseList?.find(
          (k) => v.expenseType === k.expenseType
        )
        const result = item && this._.merge(CopyObj(v), item)
        return result
      })
      this.costInfoTableList = costInfoTableList.filter((v) => v)
      this.apportionUnitTableList = data.planApportionList || {}
      this.apportionTotal = data.apportionTotal || 0
    },
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
    // 分摊信息 获取分页数据
    getApportionUnitList() {
      const data = {
        planId: this.coursePlanBaseInfo.annualPlanId,
        line: this.blgStripLine,
        page: this.apportionUnitForm.currPage,
        size: this.apportionUnitForm.pageSize
      }
      this.$axios
        .post('/fn/plan/annual/listPlanDetailApportion', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.apportionTotal = parseInt(total)
            this.apportionUnitTableList = list
          }
        })
    },
    getClassNameOptions() {
      const channelType = this.coursePlanBaseInfo.channelType
      const keyJob = this.coursePlanBaseInfo.keyJobs
      if (!channelType || !keyJob) return
      const data = {
        line: this.blgStripLine,
        dept: this.dept,
        channelType,
        keyJob
      }
      this.$axios
        .post('/fn/plan/annual/listAssociatePlan', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.classNameOptions = data
          }
        })
    },
    // 新增计划 - 批量上传
    batchUploadChange($event) {
      const file = $event.target.files[0]
      const data = new FormData()
      data.append('line', this.blgStripLine)
      data.append('file', file)
      this.$axios
        .post('/planupload/apportionbranch', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { error } = data
            if (error.length < 1) {
              return this.$message.success('上传成功')
            }
            let errorContent = ''
            error.forEach((v) => {
              errorContent += `<p>${v.key}. ${v.value}</p>`
            })
            this.$message.alert(`${error.title} ${errorContent}`, '提示', {
              confirmButtonText: '知道了',
              customClass: 'file-import-error',
              dangerouslyUseHTMLString: true
            })
          }
        })
    },
    // 业务模块 change 事件
    channelTypeChange() {
      this.$set(this.coursePlanBaseInfo, 'keyJobs', '')
      const data = this.selectOptions.channelTypes.find(
        (v) => v.dataEncode === this.coursePlanBaseInfo.channelType
      )
      this.keyPositionOptions = data ? data.childPlanDict : []
    },
    // 培训系列 change 事件
    trainSeriesChange() {
      this.$set(this.coursePlanBaseInfo, 'childSeries', '')
      const data = this.selectOptions.trainSeries.find(
        (v) => v.dataEncode === this.coursePlanBaseInfo.trainSeries
      )
      this.trainSeriesChildOptions = data ? data.childPlanDict : []
    }
  },
  computed: {
    total() {
      const sum = this.costInfoTableList.reduce(
        (c, n) => c + (parseFloat(n.unitTotalFee) || 0),
        0
      )
      return myRound(sum, 2)
    },
    costTotal() {
      const sum = this.total * (this.coursePlanBaseInfo.termNum || 1)
      return myRound(sum, 2)
    },
    renderIfConformance() {
      return yesOrNoMap.find(row => row.value === this.coursePlanBaseInfo.ifConformance)?.label || ''
    }
  },
  watch: {
    data: {
      handler(n) {
        console.log(n, '==>> datan');
        this.dataTransition()
      },
      immediate: true
    },
    classType: {
      handler(n) {
        if (n === '01002') {
          this.showTrainingCourse = false
        } else if (n === '01001') {
          this.showTrainingCourse = true
        }
      },
      immediate: true
    },
    blgDeptName(n) {
      this.coursePlanBaseInfo.blgDeptName = n
    }
  }
}
</script>

<style lang="scss" scoped>
.form-card {
  .form-box {
    display: flex;
    justify-content: space-between;

    :deep(.gc-readonlyInput) {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      // &__input {
      //   width: 250px;
      // }
    }

    :deep(.gc-readonlyInput__input) {
      width: 250px;
    }
  }
  .textarea {
    margin-right: 10px;
    :deep(.gc-readonlyInput__input) {
      flex: 1;
      height: 100px;
    }
    :deep(.gc-readonlyInput__label) {
      width: 75px;
      text-align: right;
    }
  }
}
.cost-info-card {
  :deep(.total) {
    background-color: #f9fafc;
    .cell {
      padding: 0;
      text-align: center;
    }
  }
  :deep(.input) {
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      .gc-readonlyInput__input {
        margin-right: 10px;
      }
    }
  }
  :deep(.cost-info-table__col) {
    .cell {
      display: flex;
      align-items: center;
    }
    span {
      margin: 0 8px;
    }
  }
}
.apportion-unit {
  .icons {
    [class^='icons__'] {
      border-right: none;
    }
  }
}

.ls-form-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-right: 10px;

  :deep(.el-form-item) {
    width: 30%;
    min-width: 350px;
  }

  :deep(.gc-readonlyInput__label) {
    width: 75px;
    text-align: right;
  }

  .one-liner {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    :deep(.el-form-item) {
      width: 30%;
    }
  }

  .hide {
    display: none !important;
  }
}
</style>