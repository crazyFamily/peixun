<template>
  <table-pagination
    :list="columns"
    :tableList="tableList"
    :hidePagination="true"
    :queryForm="{}"
    border
    :cell-class-name="hideRowBoder"
    :show-overflow-tooltip="false"
    ref="tablePaginationRef"
    class="table-style"
  >
    <el-table-column slot="orgName" prop="orgName" label="举办机构">
      <template slot-scope="scope">
        <div class="over-2-line">
          {{ scope.row.orgName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column slot="classTypeName" prop="classTypeName" label="培训班类型" width="170px">
      <template slot-scope="scope">
        <div class="over-2-line">
          {{ scope.row.classTypeName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column slot="planClassName" prop="planClassName" label="培训班名称">
      <template slot-scope="scope">
        <div class="over-2-line">
          {{ scope.row.planClassName }}
        </div>
      </template>
    </el-table-column>
    <el-table-column slot="attendObject" prop="attendObject" label="培训对象">
      <template slot-scope="scope">
        <div class="over-2-line">
          {{ scope.row.attendObject }}
        </div>
      </template>
    </el-table-column>
    <el-table-column slot="trainingModeDesc" prop="trainingModeDesc" label="举办形式" width="150px">
      <template slot-scope="scope">
        <div class="over-2-line">
          {{ scope.row.trainingModeDesc }}
        </div>
      </template>
    </el-table-column>
    <el-table-column slot="trainingDate" prop="trainingDate" label="举办时间">
      <template slot-scope="scope">
        <div class="over-2-line">
          {{ `${scope.row.startDate}至${scope.row.endDate}` }}
        </div>
      </template>
    </el-table-column>
    <el-table-column slot="executedStatus" prop="executedStatus" label="执行情况" width="100px">
      <template slot-scope="scope">
        <span v-if="scope.row.executedStatus === '已执行'" style="color: #00bdae">{{ scope.row.executedStatus }}</span>
        <span v-else>{{ scope.row.executedStatus }}</span>
      </template>
    </el-table-column>
  </table-pagination>
</template>

<script setup>
  const props = defineProps({
    columns: Array,
    tableList: Array
  })

  const columns = props.columns || [
  { label: '序号', type: 'index' },
  { slot: 'orgName' },
  { slot: 'classTypeName' },
  { slot: 'planClassName' },
  { slot: 'attendObject' },
  { slot: 'trainingModeDesc' },
  { slot: 'trainingDate' },
  { slot: 'executedStatus' }
]
const hideRowBoder = row => {
  return 'hide-boder'
}
</script>
<script>
export default {
  name: 'PlanDescTable'
}
</script>

<style lang="scss" scoped>
  .table-style {
    margin-top: 30px;
    :deep(thead th) {
      background-color: #f8dfb0 !important;
    }
    :deep(.cell) {
      color: #bd834b;
      font-size: 14px;
    }
    :deep(th:not(:first-child):before) {
      background: transparent;
    }

    :deep(.gc-table) {
      border: 1px solid transparent !important;
    }
    :deep(.el-table) {
      .hide-boder {
        border-right: 0 none;
      }
    }
  }

  .over-2-line {
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>