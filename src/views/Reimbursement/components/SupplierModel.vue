<template>
  <!-- 查找供应商 共用dialog -->
  <gc-model class="LaunchTrainingCourse__common-dialogLaunchTrainingCourse__supplier-search LaunchTrainingCourse__redio" title="供应商" ref="supplierSearchDialogRef" :visible="supplierSearchVisible" width="1000px" @close="supplierSearchClose" @cancel="supplierSearchVisible = false" @comfirm="supplierSearchComfirm">
    <div class="LaunchTrainingCourse__common-dialog__title">
      <div class="LaunchTrainingCourse__common-dialog__title__left">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <gc-input label="供应商名称" class="left" v-model.trim="supplierSearchForm.supplierName"></gc-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="LaunchTrainingCourse__common-dialog__title__right">
        <el-button class="button-60-blue-plain" @click="supplierSearchClickQuery">查询</el-button>
        <el-button class="button-60-blue-primary" @click="supplierSearchReset">重置</el-button>
      </div>
    </div>
    <table-pagination class="mt20 table-radio" :radio="true" @select="selectionHandle" :vLoading="supplierSearchDialogTableVLoading" :queryForm="supplierSearchForm" :list="supplierSearchList" :getList="supplierSearchQuery" :tableList="supplierSearchTable" :pageSizes="[5, 10]">
    </table-pagination>
  </gc-model>
</template>

<script>
import { CopyObj } from '@/util/utils'
import { fetchSelectFastReimSupplier } from '@/fetch/reimbursement'
export default {
  name: 'TravelInfo',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    },
    // 报销单头部机构的代码
    orgSegment: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 查找供应商 dialog 状态
      supplierSearchVisible: false,
      // 查找供应商 table 字段数组
      supplierSearchList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          type: 'index',
          value: '序号',
          width: '79'
        },
        {
          prop: 'supplierCode',
          label: '供应商编号',
          value: '供应商编号',
          width: '100'
        },
        {
          prop: 'supplierName',
          label: '供应商名称',
          value: '供应商名称',
          width: '200'
        },
        {
          prop: 'taxpayer',
          label: '纳税人名称',
          value: '纳税人名称',
          width: '200'
        },
        {
          prop: 'orgSegment',
          label: '机构',
          value: '机构',
          width: '85'
        },
        {
          prop: 'orgSegmentDesc',
          label: '业务实体',
          value: '业务实体',
          width: '103'
        },
        {
          prop: 'addrName',
          label: '地址名称',
          value: '地址名称',
          width: '103'
        },
        {
          prop: 'accountInfo',
          label: '银行账号',
          value: '银行账号',
          width: '160'
        },
        {
          prop: 'residentDescFlag',
          label: '税收居民身份',
          value: '税收居民身份',
          width: '100'
        },
        {
          prop: 'supplierTypeDesc',
          label: '供应商类型',
          value: '供应商类型',
          width: '100'
        }
      ],
      // 查找供应商 table 数据数组
      supplierSearchTable: [],
      // 查找供应商 table loading 状态
      supplierSearchDialogTableVLoading: false,
      // 查找供应商 dialog 里的form表单
      supplierSearchForm: {
        supplierCode: '',
        supplierName: '',
        orgCode: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      // 当前勾选中的数据
      selectCodeList: [],
      // 当前选中的收款人信息
      supplierObj: {},
      // 报销单头部机构的代码
      orgCode: ''
    }
  },
  methods: {
    // 勾选数据
    selectionHandle(list) {
      this.selectCodeList = list
    },
    // 供应商 dislog的查询事件
    supplierSearchClickQuery() {
      this.supplierSearchForm.currPage = 1
      this.supplierSearchQuery()
    },
    // 供应商 dislog的查询函数
    supplierSearchQuery() {
      this.supplierSearchDialogTableVLoading = true
      this.supplierSearchForm.orgCode = this.orgCode
      fetchSelectFastReimSupplier(this.supplierSearchForm)
        .then(res => {
          const { total, list } = res
          list.forEach(m => {
            m.payeeSiteName = m.addrName
          })
          this.supplierSearchForm.total = total
          this.supplierSearchTable = list
        })
        .finally(() => {
          this.supplierSearchDialogTableVLoading = false
        })
    },
    // 供应商 dislog的 重置 事件
    supplierSearchReset() {
      this.supplierSearchForm = this.$options.data.call(this).supplierSearchForm
      this.selectCodeList = []
      this.supplierSearchQuery()
    },
    // 供应商 dislog的 关闭 事件
    supplierSearchClose() {
      this.supplierSearchForm = this.$options.data.call(this).supplierSearchForm
      this.selectCodeList = []
      this.supplierSearchTable = []
      this.$emit('update:show', false)
    },
    // 供应商 dislog的 选择 事件
    supplierSearchComfirm() {
      let item = this.supplierObj
      let supplier = this.selectCodeList.pop()
      if (item && supplier) {
        delete supplier['payAmt']
        this._.merge(item, supplier)
      }
      this.supplierSearchClose()
    },
    _initData() {
      this.supplierObj = this.row
    }
  },
  watch: {
    show: {
      handler(n) {
        this.supplierSearchVisible = n
        this._initData()
      },
      immediate: true
    },
    orgSegment(n) {
      this.orgCode = n
    }
  }
}
</script>
<style lang="scss" scoped>
.SupplierModel {
}
</style>