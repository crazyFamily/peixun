<template>
  <!-- 选择顾问团的弹窗 -->
  <gc-model :visible="isDialogShow" :show-close="false" @comfirm="confirmHandle" @cancel="closeHandle" :title="title">
    <el-form :model="queryForm" inline ref="formRef">
      <el-form-item label="姓名/UM账号" prop="empInfo">
        <el-input v-model="queryForm.user" placeholder="请输入姓名/UM"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dataQuery">查询</el-button>
      </el-form-item>
    </el-form>
    <table-pagination
      row-key="umId"
      :list="columns"
      :tableList="tableList"
      :queryForm="queryForm"
      :getList="getDatas"
      @selection-change="selectionHandle"
      ref="tablePagination"
    ></table-pagination>
  </gc-model>
</template>

<script>
import { fetchQryUsers } from '@/fetch/tanlents'
import { CopyObj } from '@/util/utils'
export default {
  name: 'SelectUserDialog',

  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String
    },
    proId: {
      type: [Number, String]
    },
    list: {
      type: Array,
      default: () => []
    },
    maxlen: {
      type: Number
    },
    fetchFn: {
      type: Function, 
      default: fetchQryUsers
    },
    fetchParams: {
      type: Object,
      default: () => {}
    },
    // 印射关系，用于处理不同接口字段兼容问题
    distInfo: {
      type: Object,
      default: () => ({})
    },
    columns: {
      type: Array,
      default: () => ([
        {
          type: 'selection',
          'reserve-selection': true
        },
        {
          label: '姓名',
          prop: 'empName'
        },
        {
          label: 'UM账号',
          prop: 'umId'
        },
        {
          label: '岗位',
          prop: 'pnbrDesc'
        }
      ])
    },
    delay: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isDialogShow: false,
      tableList: [],
      queryForm: {
        user: '',
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      selectedList: [],
      // 标记
      signList: [],
      renderList: []
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
        this.$nextTick(() => {
          if (n) {
            this.reset()
            !this.delay && this.dataQuery()
          }
        })
      }
    },
    list: {
      async handler(n) {
        this.renderList = CopyObj(n)
      }
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    reset() {
      this.queryForm = this.$options.data.call(this).queryForm
      this.tableList = []
    },
    dataQuery() {
      this.queryForm.currPage = 1
      this.getDatas()
    },
    handleDistInfo(data) {
      data = CopyObj(data)
      if(Object.keys(this.distInfo).length) {
        Object.keys(this.distInfo).forEach(key => {
          data[this.distInfo[key]] = data[key]
        })
      }
      return data
    },
    async getDatas() {
      let data = this.handleDistInfo(this.queryForm)
      let res = {}
      if(this.fetchParams) {
        res = await this.fetchFn( { data: {...data, ...this.fetchParams} } )
      } else {
        res = await this.fetchFn({
          data: { ...data, type: 'tms', proId: this.proId }
        })
      }
      // let { total, list } = await this.fetchFn( this.fetchParams || {
      //   data: { ...data, type: 'tms', proId: this.proId }
      // })
      this.tableList = res.list
      this.queryForm.total = res.total
      this._setAdvisersDatasSelected()
    },
    selectionHandle(list) {
      // 去重
      this.selectedList = list
    },
    confirmHandle() {
      /**
       * 结果数据根据标记数据进行判断
       * 标记数据与传入的list数据交集为表格数据中没出现过的，可以直接推入结果数据
       */

      let unshowTableList = this.list.filter((listItem) => {
        return !this.signList.some((item) => item.umId === listItem.umId)
      })
      let mergeData = [...unshowTableList, ...this.selectedList]
      let umIdSet = new Set()
      let resultData = mergeData.filter(mergeItem => {
        if(!umIdSet.has(mergeItem.umId)){
          umIdSet.add(mergeItem.umId)
          return true
        }
        return false
      })
      
      if (this.maxlen && resultData.length > this.maxlen) return this.$message.warning(`不能超过${this.maxlen}条`)

      this.$emit('save', resultData.map(row => ({...row, umName: row.umName || row.empName})))
      this.closeHandle()
    },
    closeHandle() {
      this.$refs.tablePagination.clearSelection()
      this.$emit('update:show', false)
    },
    _setAdvisersDatasSelected() {
      if (!this.$refs.tablePagination) return
      let tableRef = this.$refs.tablePagination.getOriginTableRef()
      this.signList = []
      this.tableList.forEach((row) => {
        if (this.renderList.some((item) => item.umId === row.umId)) {
          tableRef.toggleRowSelection(row, true)
          this.signList.push(row)
          // let itemIndex = this.renderList.findIndex((item) => item.umId === row.umId)
          // this.renderList.splice(itemIndex, 1) // bugfix this.renderList.splice 用户点击取消之后打开弹窗之前勾选的不会再次勾选上
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>