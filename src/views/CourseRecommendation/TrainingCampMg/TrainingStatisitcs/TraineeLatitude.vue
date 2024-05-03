<template>
  <div class="training-tab-content">
    <!-- 阻止全局minix添加样式r0的影响 --- start --- -->
    <el-card class="search-card" v-show="false"><el-form></el-form></el-card>
    <!-- 阻止全局minix添加样式r0的影响 --- end --- -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="部门" prop="orgId">
          <gc-institution v-model="queryForm.orgIds" :orgUrl="APIAllTree" busiType="LS" :left-show="false" ref="institutionRef">
          </gc-institution>
        </el-form-item>
        <el-form-item label="学员" prop="umId">
          <el-input v-model.trim="queryForm.umId" placeholder="请输入UM或姓名"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="reset(getList)">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <table-pagination :list="tableColumns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePagination">
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <span class="active" @click="$emit('change', 'detail', scope.row)">详情</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, watch, unref } from 'vue'
import { useTrainingStatisHooks } from './hooks/useTrainingStatisHooks'
import { fetchQueryTrainingUmStatistical } from '@/fetch/courseRecommendation'
import { APIAllTree } from '@/fetch/public'
import { TRAINING_STAGE_SERIES_STATUS } from '@/util/constants'
import { CopyObj } from '@/util/utils'

const props = defineProps({
  trainingId: {
    type: [String, Number],
    required: true
  },
  trainingStageList: {
    type: Array,
    required: true
  }
})

const { getOrgListHandle, queryForm, tableList, reset } = useTrainingStatisHooks(
  {
    umId: '',
    orgIds: [],
    orgId: '',
    total: 0,
    currPage: 1,
    pageSize: 10
  },
  props
)

const originColumns = () => {
  return [
    {
      label: 'UM号',
      prop: 'umId'
    },
    {
      label: '姓名',
      prop: 'empName'
    },
    {
      label: '部门',
      prop: 'blgOrgName'
    }
  ]
}

const tableColumns = ref(originColumns())

// stageName_id的格式组装成表头对象的prop
const mergeColumns = (datas) => {
  return originColumns().concat(
    datas.map((item) => ({
      label: item.stageName,
      prop: `${item.id}`,
      formatter: (row) => {
        const findRes = row.stageSeriesList.find((findItem) => findItem.stageId === item.id)
        if (!findRes) return ''
        return TRAINING_STAGE_SERIES_STATUS[findRes.completeFlag]
      }
    }))
  )
}

const formatParams = (params) => {
  const data = CopyObj(params)
  data.trainingId = props.trainingId
  data.orgId = data.orgIds.length ? data.orgIds.slice(-1)[0] : ''
  Reflect.deleteProperty(data, 'orgIds')
  return data
}

const getList = async () => {
  if (!props.trainingId) return
  const data = formatParams(unref(queryForm))
  const { list, total } = await fetchQueryTrainingUmStatistical({ data })
  queryForm.value.total = total
  tableList.value = list
  tableColumns.value = mergeColumns(props.trainingStageList)
}

const query = () => {
  queryForm.value.currPage = 1
  getList()
}

watch(
  () => props.trainingId,
  () => {
    getList()
  }
)

getOrgListHandle()
getList()
</script>
<script>
export default {
  name: 'TraineeLatitude'
}
</script>
<style lang='scss' scoped>
:deep(.org-select-style) {
  width: 300px;
  .el-input {
    width: 100% !important;
  }
}
</style>