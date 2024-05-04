<template>
  <div class="schoolRecruitmentManagement__schemeList">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="轮岗岗位类型">
          <gc-input placeholder="请输入轮岗岗位类型" v-model.trim="queryForm.transferPositionType" />
        </el-form-item>
        <div class="buttons">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <table-pagination
        :list="columns"
        :tableList="tableList"
        :queryForm="{ total: 0 }"
        :hidePagination="true"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column label="操作" width="110" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="handleView(scope.row)">查看</span>
              <span class="item ml20 active" @click="handleEdit(scope.row)">编辑</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { fetchListFosterPlanConfig } from '@/fetch/schoolRecruitmentManagement'
import { useTable } from '@/hooks/useTable'
import store from '@/store'
const baseParams = {
  transferPositionType: '',
  currPage: 1,
  pageSize: 10,
  total: 0
}
const columns = [
  {
    label: '轮岗岗位类型',
    width: '100',
    prop: 'transferPositionType'
  },
  {
    label: '最新版本开始日期',
    width: '100',
    prop: 'planStartDate'
  },
  {
    label: '更新人',
    width: '100',
    prop: 'updatedByStr'
  },
  {
    label: '更新时间',
    width: '100',
    prop: 'updatedDate'
  }
]
const { queryForm, tableList, query, reset } = useTable(baseParams)
const handleView = async (row) => {
  store.dispatch('schoolRecruitmentManagement/changeTrainingPlanComp', { status: 'config', type: 'view', ...row })
}
const handleEdit = (row) => {
  store.dispatch('schoolRecruitmentManagement/changeTrainingPlanComp', { status: 'config', type: 'edit', ...row })
}
const getList = async () => {
  const res = await fetchListFosterPlanConfig({ data:queryForm })
  tableList.value = res
}
// 查询事件
const queryData = () => {
  query(getList)
}
queryData()
defineExpose({ queryData })
</script>

<script>
export default {
  name: 'SchemeList'
}
</script>
<style lang="scss" scoped>
.schoolRecruitmentManagement__schemeList {
  :deep(.el-table th:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
  :deep(.el-table th:not(:first-child):before) {
    position: initial;
  }
  :deep(.el-table td:first-of-type .cell) {
    padding-left: 15px;
    display: initial;
  }
}
</style>