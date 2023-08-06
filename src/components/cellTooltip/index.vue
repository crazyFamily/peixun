<template>
  <el-tooltip effect="light" placement="top">
    <div slot="content">
      <table-pagination
        :list="columns"
        :tableList="dataInfo"
        :hidePagination="true"
        :queryForm="{}"
        :show-overflow-tooltip="false"
        ref="tablePagination"
        class="table-style">
        <el-table-column v-for="(col,i) in columnsSlot" :key="i" :prop="col.field" :label="col.label" header-align="center">
          <template slot-scope="scope">
            <p :style="inputStyle">{{scope.row[col.prop]}}</p>
            <!-- <el-input type="textarea" :key="i" resize="none" :rows="2" :value="scope.row[col.prop]" readonly placeholder="暂无信息" /> -->
          </template>
        </el-table-column>
      </table-pagination>
    </div>
    <span class="active">{{cellContent}}</span>
  </el-tooltip>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
  dataInfo: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    default: () => []
 },
  cellContent: {
    type: String,
    required: true
  },
  inputStyle: {
    type: Object,
    default: () => {}
  }
})

const columnsSlot = computed(() => {
  return props.columns?.filter(m => m.slot) || []
})

const tableList = []
</script>
<style lang='scss' scoped>
.table-style {
  width: 600px;
}
</style>
