<template>
  <div class="gc-table">
    <el-table
      v-if="list.length || noList"
      v-loading="vLoading"
      :border="border"
      :stripe="stripe"
      :data="tableList"
      :span-method="spanMethod"
      @selection-change="change"
      v-bind="$attrs"
      v-on="$listeners"
      ref="gcTable"
    >
      <template v-for="(item, index) in list">
        <slot :name="item.slot" v-if="item.slot"></slot>
        <Column
          v-else
          :item="item"
          ref="customColumn"
          :key="item.value || index"
        />
      </template>

      <template slot="empty">
        <div class="noData"></div>
      </template>

      <slot></slot>
    </el-table>
  </div>
</template>

<script>
import $ from 'jquery'
import Sortable from 'sortablejs'
import Column from './column'
export default {
  name: 'gc-table',
  components: {
    Column
  },
  data() {
    return {
      attrObj: {}
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    noList: {
      type: Boolean,
      default: false
    },
    tableList: {
      type: Array
    },
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    spanMethod: {
      type: Function,
      default: () => {}
    },
    vLoading: {
      type: Boolean,
      default: false
    },
    spanMethodColLen: {
      type: Number,
      default: 5
    },
    drop: {
      type: Boolean,
      default: false
    },
 queryForm: {
      type: Object
    },
    getList: {
      type: Function
    },
    tableHeight: {
      type: String
    }
  },
  methods: {
    change(rows) {
      this.$emit('selection-change', rows)
    },
    handleClick(data) {},
    resetFilters() {
      this.$refs.gcTable.clearSort()
      const customColumnRefs = this.$refs.customColumn
      customColumnRefs.forEach((item) => {
        item.$refs.tablecolumnfilters?.$reset()
      })
    },
    getSelection() {
      return this.$refs.gcTable.selection
    },
    clearSelection() {
      this.$refs.gcTable.clearSelection()
    },
    getTableRef() {
      return this.$refs.gcTable
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.spanMethod.length !== 0) {
        const trArr = this.$el.querySelectorAll('tr')
        const newTrArr = [...trArr].filter(
          (v) => v.querySelectorAll('td').length < this.spanMethodColLen
        )
        newTrArr.forEach((v) => {
          if (v.querySelector('td .cell')) {
            v.querySelector('td .cell').style.justifyContent = 'flex-start'
            v.querySelector('td .cell').style.paddingLeft = '15px'
          }
        })
      }
      if (this.drop) {
   const tbody = $(this.$el).find('tbody')[0]
        const that = this
        const sortable = new Sortable(tbody, {
          handle: '.drop',
          filter: '.filter',
          animation: 150,
          onEnd(event) {
            const { newIndex, oldIndex } = event
            console.log(newIndex, oldIndex);
            // 修改原本数组重的顺序
            const item = that.tableList.splice(oldIndex, 1)[0]
            that.tableList.splice(newIndex, 0, item)
            console.log(that.tableList);
            // 拖拽结束后广播数据
            that.$emit('dropEnd', that.tableList)
          },
          onMove(event) {
            // dragged是当前拖拽项，related是经过的项
            let { dragged, related } = event
            // 当经过项中是有需要过滤的项的话，停止拖拽
            if (
              related.querySelectorAll('td')[0].className.includes('filter')
            ) {
              return false
            }
          }
        })
      }
    })
  },
  watch: {
    tableList(n) {
      this.$nextTick(() => {
        if (this.spanMethod.length !== 0) {
          const trArr = this.$el.querySelectorAll('tr')
          const newTrArr = [...trArr].filter(
            (v) => v.querySelectorAll('td').length < this.spanMethodColLen
          )
          newTrArr.forEach((v) => {
            if (v.querySelector('td .cell')) {
              v.querySelector('td .cell').style.justifyContent = 'flex-start'
              v.querySelector('td .cell').style.paddingLeft = '15px'
            }
          })
        }
      })
    },
    list(n) {
      if (n?.length) {
        n.forEach((v) => {
          v.queryForm = this.queryForm
          v.getList = this.getList
        })
      }
    }
  },
  created() {
    this.list.forEach((v) => {
      v.queryForm = this.queryForm
      v.getList = this.getList
    })
  }
}
</script>

<style></style>
