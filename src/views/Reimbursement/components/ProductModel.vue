<template>
  <!-- 项目、产品、订单号 共用dialog -->
  <gc-model :title="productObj.title" :visible.sync="productVisible" width="800px" @comfirm="productComfirm" @close="productClose" :is-append="isAppend">
    <div>
      <el-form inline>
        <el-form-item label="代码/名称" class="mr60">
          <el-input placeholder="请输入代码/名称" v-model="productQueryForm.item"></el-input>
        </el-form-item>
        <el-button class="fr button-60" type="primary" @click="
              productQueryForm.currPage = 1
              productGetList()
            ">查询</el-button>
      </el-form>
      <table-pagination radio class="table-radio" ref="productRef" :list="subjectList" :getList="productGetList" :queryForm="productQueryForm" :tableList="productObj.tableList" :page-sizes="[5]">
      </table-pagination>
    </div>
  </gc-model>
</template>

<script>
import { CopyObj, resetObj } from '@/util/utils'
import { fetchSelectFastReimAssist } from '@/fetch/reimbursement'
export default {
  name: 'TravelInfo',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    productType: {
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => {}
    },
    // 报销单头部机构的代码
    orgSegment: {
      type: String,
      default: ''
    },
    isAppend: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productVisible: false,
      productObj: {},
      productQueryForm: {
        currPage: 1,
        pageSize: 5,
        total: 0,
        item: ''
      },
      allProductObj: {
        subject: {
          title: '科目参考',
          tableList: [],
          type: 'SEGMENT5',
          reim: {
            label: 'budgetProjectName',
            value: 'budgetProjectCode'
          },
          account: {
            label: 'subjectProjectDesc',
            value: 'subjectProject'
          }
        },
        item: {
          title: '项目',
          tableList: [],
          type: 'SEGMENT6',
          reim: {
            label: 'projectName',
            value: 'projectCode'
          },
          account: {
            label: 'channelOrProjectDesc',
            value: 'channelOrProject'
          }
        },
        product: {
          title: '产品',
          tableList: [],
          type: 'SEGMENT7',
          reim: {
            label: 'productName',
            value: 'productCode'
          },
          account: {
            label: 'productDesc',
            value: 'productName'
          }
        },
        orderNumber: {
          title: '订单号',
          tableList: [],
          type: 'SEGMENT9',
          reim: {
            label: 'kuOrderName',
            value: 'kuOrderNo'
          },
          account: {
            label: 'orderNoDesc',
            value: 'orderNo'
          }
        }
      },
      // 科目参考 表格字段
      subjectList: [
        {
          type: 'selection'
        },
        {
          label: '代码',
          prop: 'assistCode'
        },
        {
          label: '名称',
          prop: 'assistDesc'
        }
      ]
    }
  },
  methods: {
    productComfirm() {
      const item = this.$refs.productRef.getSelection()[0]
      if (item) {
        let page
        if ('deductionFlag' in this.productObj.row) {
          page = this.productObj.reim
        } else {
          page = this.productObj.account
        }
        console.log('page',page)
        this.$set(this.row, page.value, item.assistCode)
        this.$set(this.row, page.label, item.assistDesc)
        this.$emit('save', item)
      }
      this.$emit('update:show', false)
    },
    productClose() {
      this.productObj.tableList = []
      resetObj(this.productQueryForm, { currPage: 1, pageSize: 5, total: 0 })
      this.$emit('update:show', false)
    },
    // 项目，产品，订单号公共dialog 查询函数
    productGetList() {
      const data = CopyObj(this.productQueryForm)
      data.type = this.productObj.type
      // 查询订单号或科目参考时，入参segment1	【机构代码】为必传
      if (data.type === 'SEGMENT9' || data.type === 'SEGMENT5') {
        data.segment1 = this.orgSegment
      }
      if (data.type === 'SEGMENT5') {
        data.expenseType = this.row.expenseType
      }
      fetchSelectFastReimAssist(data)
      .then(data => {
        const { total, list } = data
        this.productQueryForm.total = total
        this.productObj.tableList = list
      })
    },
    _initData() {
      this.productObj = this.allProductObj[this.productType || 'item']
      this.productObj.row = this.row
    }
  },
  watch: {
    show: {
      handler(n) {
        this.productVisible = n
        this._initData()
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
.TravelInfo {
}
</style>