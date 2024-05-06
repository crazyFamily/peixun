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
        class="table-style"
      >
        <el-table-column slot="meritEvaluate" prop="meritEvaluate" label="优势" header-align="center">
          <template slot-scope="scope">
            <el-input type="textarea" resize="none" :rows="5" :value="scope.row.meritEvaluate" readonly placeholder="暂无评价信息"></el-input>
          </template>
        </el-table-column>
        <el-table-column slot="weaknessEvaluate" prop="weaknessEvaluate" label="不足" header-align="center">
          <template slot-scope="scope">
            <el-input type="textarea" resize="none" :rows="5" :value="scope.row.weaknessEvaluate" readonly placeholder="暂无评价信息"></el-input>
          </template>
        </el-table-column>
      </table-pagination>
    </div>
    <span class="active">针对{{ umName }}评价内容</span>
  </el-tooltip>
</template>

<script setup>
const props = defineProps({
  dataInfo: {
    type: Array,
    required: true
  },
  evaluatorTypeName: {
    type: String,
    required: true
  },
  umName: {
    type: String,
    required: true
  }
})

const columns = [
  {
    label: props.evaluatorTypeName,
    prop: 'evaluatorName',
    type: 'setWidth',
    width: '100px'
  },
  {
    // label: '优势',
    // prop: 'meritEvaluate',
    // 'show-overflow-tooltip': false,
    slot: 'meritEvaluate',
    width: '350px'
  },
  {
    // label: '不足',
    // prop: 'weaknessEvaluate',
    // 'show-overflow-tooltip': false
    slot: 'weaknessEvaluate',
    width: '350px'
  }
]
const tableList = []
</script>
<style lang='scss' scoped>
.table-style {
  width: 800px;
  :deep(.el-table .cell.el-tooltip) {
    // white-space: pre-line;
  }
}
</style>