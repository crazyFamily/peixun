<template>
  <div class="table-pagination">
    <gc-table
      :list="list"
      :tableList="tableList"
      ref="tableRef"
      :class="tableClass"
      v-bind="$attrs"
      v-on="$listeners"
      :queryForm="queryForm"
      :getList="getList"
      @selection-change="
        radio ? tableSelectionChange($refs, $event, 'tableRef') : noop
      "
    >
      <slot v-for="slot in slots" :name="slot" :slot="slot"></slot>
      <slot></slot>
    </gc-table>
    <gc-pagination
      :total="queryForm.total"
      :page-sizes="pageSizes"
      :page-size="queryForm.pageSize"
      :current-page="queryForm.currPage"
      @sizeChange="sizeChange($event, queryForm, getList)"
      @currentChange="currentChange($event, queryForm, getList)"
      :class="paginationClass"
      v-show="!hidePagination"
    >
      <span class="text">每页显示</span>
    </gc-pagination>
  </div>
</template>

<script>
import {
  noop,
  sizeChange,
  currentChange,
  tableSelectionChange
} from '@/util/utils.js'
export default {
  inheritAttrs: false,
  name: 'table-pagination',
  props: {
    tableClass: {
      type: String,
      default: 'general__table'
    },
    paginationClass: {
      type: String,
      default: 'between'
    },
    list: {
      type: Array
    },
    tableList: {
      type: Array
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20]
    },
    queryForm: {
      type: Object
    },
    getList: {
      type: Function
    },
    radio: {
      type: Boolean,
      default: false
    },
    hidePagination: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 工具函数
      noop,
      sizeChange,
      currentChange,
      tableSelectionChange
    }
  },
  methods: {
    resetFilters() {
      this.$refs.tableRef.resetFilters()
    },
    getSelection() {
      return this.$refs.tableRef.getSelection()
    },
    clearSelection() {
      this.$refs.tableRef.clearSelection()
    },
    getOriginTableRef() {
      return this.$refs.tableRef.$refs.gcTable
    }
  },
  computed: {
    slots() {
      return Object.keys(this.$slots).filter((v) => v !== 'default')
    }
  }
}
</script>

<style></style>
