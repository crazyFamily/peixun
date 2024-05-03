<template>
  <div class="course_container course">
    <el-card class="box-card">
      <el-form :model="queryForm" class="form-container" inline>
        <el-form-item label="剧本简化ID：">
          <el-input v-model.trim="queryForm.expansion" placeholder="请输入剧本简化ID"> </el-input>
        </el-form-item>
        <el-form-item class="self-item">
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="toReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card mt20">
      <table-pagination
        :list="tableColumns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        :pageSizes="[50,100]"
        ref="tablePagination"
      >
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button class="button-48-24" @click="addAITask(scope.row)">添加</el-button>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { fetchCheckPlaybookIdAndGetName } from '@/fetch/courseRecommendation'
import { CopyObj } from '@/util/utils'
import { useTable } from '@/hooks/useTable'
import { Message } from 'element-ui'

const expansion = ref('')
const baseParams = {
  currPage: 1,
  pageSize: 50,
  total: 0,
  expansion: '' // 剧本简化ID
}
const emits = defineEmits(['confirm'])
const { queryForm, tableList } = useTable(baseParams)
const tableColumns = [
      { type: 'index', label: '序号' },
      { label: '任务名称', prop: 'taskName' }
    ]
const getList = async () => {
    if (!queryForm.expansion){
      Message.warning('请输入剧本简化ID')
      return
    }
    try {
      tableList.value = (await fetchCheckPlaybookIdAndGetName({ expansion: queryForm.expansion })) || []
      queryForm.total = tableList.value.length
    } catch (err) {
      console.log(err)
    }
  }
const initTaskData =(dataInfo = {}) => {
    if (!(dataInfo instanceof Object)) {
      throw Error('需要传入一个对象')
    }
    let copyData = CopyObj(dataInfo)
    let expansion = copyData?.content?.split('_')[0]
    queryForm.expansion = expansion
    if (copyData.expansion) {
      getList()
    } else {
      // 重置数据
      tableList.value = []
      queryForm.total = 0
    }
  }

const addAITask = (row) => {
  Object.assign(row, {expansion: queryForm.expansion})
  emits('confirm', 'ai_exercise', row)
}
const toReset = () => {
  queryForm.expansion = ''
  tableList.value = []
  queryForm.total = 0
}
defineExpose({
  initTaskData
})
</script>
<script>
export default {
  name: 'SelectAiTaskDialog'
}
</script>