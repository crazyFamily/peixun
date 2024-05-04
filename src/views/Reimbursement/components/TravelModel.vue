<template>
  <!-- 关联差旅订单 -->
  <gc-model title="关联差旅订单" class="LaunchTrainingCourse__common-dialog" :visible="relationTravelOrderVisible" width="1200px" @close="relationTravelOrderClose" @comfirm="relationTravelOrderComfirm" @cancel="relationTravelOrderVisible = false">
    <div class="LaunchTrainingCourse__common-dialog__title">
      <div class="LaunchTrainingCourse__common-dialog__title__left">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item class="LaunchTrainingCourse__common-dialog__title__left__first">
            <gc-input class="left" label="差旅订单号" v-model.trim="relationTravelOrderForm.orderId"></gc-input>
          </el-form-item>
          <el-form-item>
            <gc-input class="left" label="预定人" placeholder="请输入UM号" v-model.trim="relationTravelOrderForm.um"></gc-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__title__right">
        <el-button class="button-60" @click="relationTravelOrderSearch">查询</el-button>
        <el-button class="button-60-blue-plain" @click="relationTravelOrderReset">重置</el-button>
        <el-button class="button-60-blue-primary" @click="relationTravelOrderStart">关联订单</el-button>
      </div>
    </div>
    <table-pagination ref="travelOrderTableRef" class="mt20 table-radio" :radio="true" :vLoading="travelListVLoading" :getList="getList" @select="selectionNotHandle" :queryForm="relationTravelOrderForm" :list="relationTravelOrderList" :tableList="relationTravelOrderTable">
    </table-pagination>
    <div class="LaunchTrainingCourse__common-dialog__vice-title LaunchTrainingCourse__title">
      <div class="LaunchTrainingCourse__common-dialog__vice-title__left LaunchTrainingCourse__title__left">
        <span class="LaunchTrainingCourse__title__left__menu"></span>
        已关联
      </div>
      <div class="LaunchTrainingCourse__common-dialog__vice-title__right">
        <el-button class="button-60-blue-primary" @click="relationTravelOrderCancel">取消关联</el-button>
      </div>
    </div>
    <table-pagination class="mt20 table-radio" :radio="true" :hidePagination="true" @select="selectionHandle" :queryForm="{}" :list="relationTravelOrderList" :tableList="relationTravelOrderViceTable" :stripe="false">
    </table-pagination>
  </gc-model>
</template>

<script>
import { CopyObj } from '@/util/utils'
import { formatDate } from '../../../plugins/until'
import { fetchSelectFastReimTripOrders } from '@/fetch/reimbursement'
export default {
  name: 'TravelModel',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      // 关联差旅订单 dialog状态
      relationTravelOrderVisible: false,
      // 关联差旅订单 table 字段数组
      relationTravelOrderList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          width: '54',
          type: 'index'
        },
        {
          prop: 'caikuOrderType',
          label: '差旅订单类型',
          width: '100'
        },
        {
          prop: 'caikuOrderId',
          label: '差旅订单号',
          width: '260'
        },
        {
          prop: 'amt',
          label: '金额',
          width: '80'
        },
        {
          prop: 'orderName',
          label: '预定人',
          width: '90'
        },
        {
          prop: 'tripName',
          label: '出差人',
          width: '90'
        },
        {
          width: '90',
          label: '起始时间',
          prop: 'startTime',
          formatter: row => `${this.formatDate(row.startTime, true)}`
        },
        {
          width: '90',
          label: '结束时间',
          prop: 'endTime',
          formatter: row => `${this.formatDate(row.endTime, true)}`
        },
        {
          width: '100',
          label: '是否大发票',
          prop: 'isBig',
          formatter: row => `${row.isBig === 'Y' ? '是' : '否'}`
        },
        {
          width: '100',
          label: '大发票类型',
          prop: 'bigType',
          formatter: row => `${row.bigType === '0' ? '普票' : '专票'}`
        }
      ],
      // 关联差旅订单 table 数据数组
      relationTravelOrderTable: [],
      // 关联差旅订单 副table 数据数组
      relationTravelOrderViceTable: [],
      // 关联差旅订单 dialog form 对象
      relationTravelOrderForm: {
        // 费用小类编码
        code: '',
        // 预定人
        um: '',
        // 差旅订单号
        orderId: '',
        currPage: 1,
        pageSize: 10
      },
      // 时间格式化函数
      formatDate,
      // 已关联差旅订单勾选的数据
      selectCodeList: [],
      // 未关联差旅订单勾选的数据
      selectNotist: [],
      // 查找差旅订单 table loading 状态
      travelListVLoading: false
    }
  },
  methods: {
    // 勾选已关联差旅订单数据
    selectionHandle(list) {
      this.selectCodeList = list
    },
    // 勾选未关联差旅订单数据
    selectionNotHandle(list) {
      this.selectNotist = list
    },
    // 关联旅订单
    relationTravelOrderStart() {
      const selection = this.selectNotist
      if (selection.length) {
        this.relationTravelOrderViceTable.splice(0)
        this.relationTravelOrderViceTable.push(selection[0])
      }
      this.selectNotist = []
      this.$refs.travelOrderTableRef.$refs.tableRef.clearSelection()
    },
    // 重置可关联差旅订单
    relationTravelOrderReset() {
      this.relationTravelOrderForm = this.$options.data.call(this).relationTravelOrderForm
      this.getList()
    },
    // 搜索可关联差旅订单函数
    relationTravelOrderSearch() {
      this.relationTravelOrderForm.currPage = 1
      this.getList()
    },
    getList() {
      const { um, orderId } = this.relationTravelOrderForm
      this.relationTravelOrderForm.code = this.row.feeMinCategory
      this.travelListVLoading = true
      fetchSelectFastReimTripOrders(this.relationTravelOrderForm)
        .then(res => {
          const { list, total } = res
          this.relationTravelOrderTable = list
          this.relationTravelOrderForm.total = total
        })
        .finally(() => {
          this.travelListVLoading = false
        })
    },
    // 关联差旅订单确定事件
    relationTravelOrderComfirm() {
      if (this.disabled) {
        this.$emit('update:show', false)
        this.relationTravelOrderReset()
        return
      }
      this.$emit('update:show', false)
      this.$emit('save',this.relationTravelOrderViceTable)
    },

    // 关联差旅订单关闭事件
    relationTravelOrderClose() {
      this.$emit('update:show', false)
      this.relationTravelOrderTable = []
      this.selectCodeList = []
      this.selectNotist = []
      this.relationTravelOrderViceTable = []
      this.relationTravelOrderForm = this.$options.data.call(this).relationTravelOrderForm
    },
    // 取消关联旅订单
    relationTravelOrderCancel() {
      const selectCode = this.selectCodeList
      this.relationTravelOrderViceTable = this.relationTravelOrderViceTable.filter(
        v => !selectCode.includes(v)
      )
      this.selectCodeList = []
    },
    _initData() {
      const arr = this.row.relationTravelOrderViceTable
      this.relationTravelOrderViceTable = arr ? CopyObj(arr) : []
      this.relationTravelOrderForm.code = this.row.feeMinCategory
    }
  },
  watch: {
    show: {
      handler(n) {
        this.relationTravelOrderVisible = n
        this._initData()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.TravelModel {
}
</style>