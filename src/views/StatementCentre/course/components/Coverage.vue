<template>
  <div class="statementCentre__newstafftrain">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="部门">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              busiType="LS"
              :left-show="false"
              :default-show="true"
              :fetchParams="{module: SPARK_MODULE }"
              :otherParams="{module: SPARK_MODULE }"
              @setDataFinish="orgIdsFinish"
              ref="institutionRef"
            >
            </gc-institution>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="queryForm.isShowSecondFH" true-label="Y" false-label="N">查看二级分行</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-form-item label="入司时间" class="search-card__date mr10 df w58">
            <el-date-picker
              v-model="queryForm.dateStart"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date mr20 df">
            <el-date-picker
              v-model="queryForm.dateEnd"
              type="month"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <div class="search-card__button mt20">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="resetData">重置</el-button>
          <el-button @click="handleExport" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <table-pagination
        v-loading="getLoadingStatus('LOADING_NEWSTAFF_COVERAGE')"
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePaginationRef"
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { CopyObj, formatDate, getCurrentTime, getLoadingStatus } from '@/util/utils'
import { fetchListOrgEmpTraining, fetchListOrgEmpTrainingExport } from '@/fetch/statementCentre'
import { useTable } from '@/hooks/useTable'
import { lastDay } from '@/util/utils'
import { SPARK_MODULE } from '../../enum'
const columns = [
  {
    label: '序号',
    type: 'index'
  },
  {
    label: '单位',
    prop: 'orgName',
    width: '240'
  },
  {
    label: '归属区域',
    prop: 'treeZoneName',
    width: '120'
  },
  {
    label: '入职人数',
    prop: 'inJobNum',
    width: '120'
  },
  {
    label: '信用卡入职人数',
    prop: 'xykNum',
    width: '120'
  },
  {
    label: '汽融入职人数',
    prop: 'qrNum',
    width: '120'
  },
  {
    label: '参训人数',
    prop: 'finishClassNum',
    width: '120'
  },
  {
    label: '信用卡参训人数',
    prop: 'xykNumFinish',
    width: '120'
  },
  {
    label: '汽融参训人数',
    prop: 'qrNumFinish',
    width: '120'
  },
  {
    label: '覆盖率',
    prop: 'classRate',
    width: '120'
  }
]
// 查询用的表单
const baseParms = {
  // 条线
  orgIds: [],
  orgId: '',
  // 开始日期  格式: yyyy-MM-dd
  dateStart: new Date().getFullYear() + '-01',
  // 结束日期 格式: yyyy-MM-dd
  dateEnd: getCurrentTime(),
  //当前页
  currPage: 1,
  //每页大小
  pageSize: 10,
  // 选择子机构标识
  isShowSecondFH: ''
}
// 日期限时
const startPickerOptions = {
  disabledDate: time => {
    return formatDate(time) <= '2023-01-01'
  }
}
const endPickerOptions = {
  disabledDate: time => !(formatDate(time) >= queryForm.dateStart)
}
const { tableList, reset, queryForm } = useTable(baseParms)
let cacheOrgIds = []
const orgIdsFinish = () => {
  cacheOrgIds = CopyObj(queryForm.orgIds)
  query()
}

// 处理请求数据
const getQueryForm = () => {
  const data = CopyObj(queryForm)
  data.orgId = data.orgIds?.[1]
  data.dateStart = data.dateStart ? data.dateStart + '-01' : ''
  data.dateEnd = lastDay(data.dateEnd)
  Reflect.deleteProperty(data, 'orgIds')
  return data
}
const query = () => {
  queryForm.currPage = 1
  getList()
}
const getList = async () => {
  const data = getQueryForm()
  const { list, total } = await fetchListOrgEmpTraining(data)
  tableList.value = list
  queryForm.total = total
}
const institutionRef = ref(null)
const resetData = async () => {
  await nextTick()
  reset()
  institutionRef.value.createTreeData()
}
const handleExport = () => {
  const data = getQueryForm()
  fetchListOrgEmpTrainingExport(data)
}
</script>
<script>
export default {
  name: 'NewStaffTrainCoverage'
}
</script>