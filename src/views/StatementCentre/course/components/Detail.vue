<template>
  <div class="detail">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="员工机构">
          <div class="df">
            <gc-institution v-model="queryForm.orgIds" busiType="LS" 
              :fetchParams="{module: SPARK_MODULE }" 
              :otherParams="{module: SPARK_MODULE }"
              :left-show="false" ref="institutionRef"> </gc-institution>
          </div>
        </el-form-item>
        <el-form-item label="员工信息">
          <el-input class="w200" placeholder="输入姓名/UM号" v-model="queryForm.umOrName"></el-input>
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
        v-loading="getLoadingStatus('LOADING_NEWSTAFF_DETAIL')"
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
import { ref, reactive, nextTick, onMounted } from 'vue'
import { CopyObj, formatDate, getCurrentTime, getLoadingStatus } from '@/util/utils'
import { fetchListNewEmpTraining, fetchListNewEmpTrainingExport } from '@/fetch/statementCentre'
import { ISATTENDCLASS, SPARK_MODULE } from '../../enum'
import { useTable } from '@/hooks/useTable'
import { lastDay } from '@/util/utils'
// 查询用的表单
const baseParms = {
  orgId: '',
  orgIds: [],
  umOrName: '',
  isAttendClass: '',
  // 开始日期  格式: yyyy-MM-dd
  dateStart: new Date().getFullYear() + '-01',
  // 结束日期 格式: yyyy-MM-dd
  dateEnd: getCurrentTime(),
  //当前页
  currPage: 1,
  //每页大小
  pageSize: 10
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
const { tableList, reset, queryForm, tableFilterSetting } = useTable(baseParms)
const columns = [
  {
    label: '序号',
    type: 'index'
  },
  {
    label: '姓名',
    prop: 'umName',
    width: '110'
  },
  {
    label: 'UM号',
    prop: 'umId',
    width: '110'
  },
  {
    label: '所属机构',
    prop: 'orgName',
    width: '240'
  },
  {
    label: '岗位名称',
    prop: 'positionName',
    width: '220'
  },
  {
    label: '入司日期',
    prop: 'dateHire',
    width: '110'
  },
  {
    label: '参训状态',
    prop: 'attendClass',
    width: '110',
    ...tableFilterSetting('isAttendClass', ISATTENDCLASS, false)
  },
  {
    label: '参训培训班编号',
    prop: 'classId',
    width: '110'
  },
  {
    label: '参训培训班名称',
    prop: 'className',
    width: '172'
  },
  {
    label: '举办周期',
    prop: 'trainingDate',
    width: '196'
  },
  {
    label: '结训日期',
    prop: 'dateFinish',
    width: '110'
  }
]
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
  const { list, total } = await fetchListNewEmpTraining(data)
  tableList.value = list
  queryForm.total = total
}
const institutionRef = ref(null)
const tablePaginationRef = ref(null)
const resetData = async () => {
  institutionRef.value.createTreeData()
  tablePaginationRef.value.resetFilters()
  await nextTick()
  reset(getList)
}
const handleExport = () => {
  const data = getQueryForm()
  fetchListNewEmpTrainingExport(data)
}
onMounted(() => {
  getList()
})
</script>
<script>
export default {
  name: 'NewStaffTrainDetail'
}
</script>