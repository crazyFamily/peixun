<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="案例归属" class="">
          <div class="df">
            <gc-institution
              v-model="queryForm.orgIds"
              busiType="LS"
              :left-show="false"
              :default-show="true"
              :fetchParams="{ module: CASE_MODULE }"
              :otherParams="{ module: CASE_MODULE }"
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
          <el-checkbox v-model="queryForm.isOutside" true-label="Y" false-label="N">只看外勤</el-checkbox>
        </el-form-item>
        <el-form-item label="案例上架时间">
          <el-date-picker
            class="w-120"
            v-model="queryForm.dateStart"
            type="month"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="{}"
            value-format="yyyy-MM"
            popper-class="date-picker"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学习有效期">
          <gc-select :options="studyValidNumOptions" v-model="queryForm.studyValidNum" :clearable="false"> </gc-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="exportHandle">
          <i class="instructor-icons__add__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        class="table-left"
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        v-loading="getLoadingStatus('LOADING_CASE_UP_STATISTICS')"
        ref="tablePaginationRef"
      >
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// 按机构统计
import { resetObj, CopyObj, filterObj, getLoadingStatus } from '@/util/utils'
import { fetchUpStatisticsList, fetchUpStatisticsListExport } from '@/fetch/caseCenter'
import { ZONE_OPTIONS, CASE_MODULE } from '../../enum'
let tableFilterSetting = (key, list, multiple = false) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}
const columns = [
  {
    label: '机构',
    prop: 'orgName',
    width: '150'
  },
  {
    label: '归属区域',
    prop: 'blgZoneName',
    width: '100',
    ...tableFilterSetting('blZones', ZONE_OPTIONS, true)
  },
  {
    label: '平均人数',
    prop: 'empAvg'
  },
  {
    label: '上架案例数',
    prop: 'upAlNum'
  },
  {
    label: '学习人数（去重）',
    prop: 'studyNum',
    width: '120'
  },
  {
    label: '学习完成人数（去重）',
    prop: 'studyFinishNum',
    width: '140'
  },
  {
    label: '学习完成率',
    prop: 'doneRate'
  },
  {
    label: '优秀案例数',
    prop: 'perfectAlNum'
  },
  {
    label: '学习人数（去重）',
    prop: 'perfectAlstudyNum',
    width: '120'
  },
  {
    label: '学习完成人数（去重）',
    prop: 'perfectAlstudyFinishNum',
    width: '140'
  },
  {
    label: '学习完成率',
    prop: 'perfectDoneRate'
  },
  {
    label: '优秀案例平均分',
    prop: 'perfectScore',
    width: '120'
  }
]
const baseParams = {
  orgIds: [],
  orgId: '',
  dateStart: '',
  pageSize: 10,
  studyValidNum: '2',
  isOutside: 'Y'
}
const queryForm = reactive(CopyObj(baseParams))
const tableList = ref([])
let cacheOrgIds = []
const studyValidNumOptions = [
  {
    value: '1',
    label: '一个月'
  },
  {
    value: '2',
    label: '两个月'
  },
  {
    value: '3',
    label: '三个月'
  },
  {
    value: '4',
    label: '四个月'
  },
  {
    value: '5',
    label: '五个月'
  },
  {
    value: '6',
    label: '六个月'
  }
]
const orgIdsFinish = () => {
  cacheOrgIds = CopyObj(queryForm.orgIds)
  query()
}
const query = () => {
  queryForm.currPage = 1
  getList()
}
const tablePaginationRef = ref(null)
const institutionRef = ref(null)
const reset = async () => {
  resetObj(queryForm, {
    currPage: 1,
    pageSize: 10,
    total: 0,
    orgIds: cacheOrgIds,
    dateStart: currentDate,
    studyValidNum: '2'
  })
  tablePaginationRef.value.resetFilters()
  institutionRef.value.createTreeData()
}
// 格式化发送数据
const _formatSendParams = params => {
  let data = filterObj(params)
  data.orgId = data.orgIds?.[1]
  return data
}
// 拉取数据
const getList = () => {
  let data = _formatSendParams(queryForm)
  fetchUpStatisticsList(data).then(res => {
    const { total, list } = res
    queryForm.total = total
    tableList.value = list
  })
}
// 导出
const exportHandle = () => {
  let data = _formatSendParams(queryForm)
  fetchUpStatisticsListExport(data)
}
let currentDate = ''
onMounted(() => {
  let currentTime = new Date()
  currentDate = `${currentTime.getFullYear()}-${currentTime.getMonth() + 1 < 10 ? '0' + (currentTime.getMonth() + 1) : currentTime.getMonth() + 1}`
  queryForm.dateStart = currentDate
})
</script>
<style lang="scss" scoped></style>