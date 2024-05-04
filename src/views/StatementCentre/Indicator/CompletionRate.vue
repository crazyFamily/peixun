<template>
  <div class="statementCentre__completion-rate">
    <el-card class="search-form-card">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="部门" class="first">
          <gc-institution v-model="queryForm.busiType" :fetchParams="{module: SPARK_MODULE }"> </gc-institution>
        </el-form-item>
        <el-form-item class="r0">
          <el-form-item label="入职时间" class="search-card__date mr10 df w58">
            <el-date-picker
              v-model="queryForm.dateStart"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date mr20 df">
            <el-date-picker
              v-model="queryForm.dateEnd"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="queryForm.isShowSecondFH" class="ml10">查看二级分行</el-checkbox>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="download" class="button-w80-h30" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10 card-box">
      <el-tabs v-model="activeName" @tab-click="query" v-loading="getLoadingStatus('LOADING_LIST_CLASS_TYPE')">
        <el-tab-pane label="阶段一" name="first">
          <gc-table class="general__table" :list="firstColumns" :tableList="tableList"> </gc-table>
          <gc-pagination
            :total="queryForm.total"
            :page-sizes="[10, 20]"
            :page-size="queryForm.pageSize"
            :current-page="queryForm.currPage"
            @sizeChange="sizeChange($event, queryForm, noop)"
            @currentChange="currentChange($event, queryForm, noop)"
          />
        </el-tab-pane>
        <el-tab-pane label="阶段二" name="second">
          <gc-table class="general__table" :list="secondColumns" :tableList="secondTableList"> </gc-table>
          <gc-pagination
            :total="queryForm.total"
            :page-sizes="[10, 20]"
            :page-size="queryForm.pageSize"
            :current-page="queryForm.currPage"
            @sizeChange="sizeChange($event, queryForm, noop)"
            @currentChange="currentChange($event, queryForm, noop)"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script setup>
import { noop, CopyObj, filterObj, sizeChange, handleBlob, jsonHeaders, localPaging, currentChange, getLoadingStatus } from '@/util/utils'
import { fetchListSparkStatistics,fetchExportSparkStatistics } from '@/fetch/statementCentre'
import { computed, onActivated, onMounted, reactive, ref, unref } from 'vue'
import { SPARK_MODULE } from '../enum'

// 数据初始化
const queryFormDataInt = () => {
  return {
    // 条线
    busiType: [],
    orgId: '',
    // 开始日期  格式: yyyy-MM-dd
    dateStart: '',
    // 结束日期 格式: yyyy-MM-dd
    dateEnd: '',
    // 选择子机构标识
    isGotSubBranch: 'N',
    isShowSecondFH: false,
    currPage: 1,
    pageSize: 10,
    total: 0
  }
}
const startPickerOptions = {}
const endPickerOptions = {}
const activeName = ref('first')
const map = {
  first: {
    url: '/fn/report/process/listSparkStatisticsStageOne',
    tabkeField: 'tableListBack'
  },
  second: {
    url: '/fn/report/process/listSparkStatisticsStageTwo',
    tabkeField: 'secondTableListBack'
  }
}
const firstColumns = [
  {
    label: '序号',
    type: 'index',
    width: '64'
  },
  {
    label: '部门',
    prop: 'orgName',
    width: '220'
  },
  {
    label: '归属区域',
    prop: 'treeZoneName',
    width: '100'
  },
  {
    label: '应完成人数',
    prop: 'totalStaffNum',
    width: '100'
  },
  {
    label: '零售业务课程完成人数',
    prop: 'retailBaseCompleteNum',
    width: '180'
  },
  {
    label: '零售业务课程完成率',
    prop: 'retailBaseCompleteRate',
    width: '160'
  },
  {
    label: '零售业务课程考试完成人数',
    prop: 'retailBasePassCompleteNum',
    width: '200'
  },
  {
    label: '零售业务课程考试合格率',
    prop: 'retailBasePassCompleteRate',
    width: '190'
  }
]
const secondColumns = [
  {
    label: '序号',
    type: 'index',
    width: '64'
  },
  {
    label: '部门',
    prop: 'orgName',
    width: '220'
  },
  {
    label: '归属区域',
    prop: 'treeZoneName',
    width: '100'
  },
  {
    label: '应完成人数',
    prop: 'totalStaffNum',
    width: '100'
  },
  {
    label: '运营学堂完成人数',
    prop: 'opClassCompleteNum',
    width: '160'
  },
  {
    label: '运营学堂完成率',
    prop: 'opClassCompleteRate',
    width: '160'
  },
  {
    label: '网点孵化参与人数',
    prop: 'wdfhEmpNum',
    width: '160'
  },
  {
    label: '网点孵化参与率',
    prop: 'wdfhEmpRate',
    width: '140'
  },
  {
    label: '网点孵化合格人数',
    prop: 'wdfhPassNum',
    width: '140'
  },
  {
    label: '网点孵化合格率',
    prop: 'wdfhPassRate',
    width: '140'
  }
]
const tableListBack = ref([])
const secondTableListBack = ref([])
const tableList = computed(() => {
  if (activeName.value !== 'first') return []
  const list = localPaging(tableListBack.value, queryForm.value)
  return list
})
const secondTableList = computed(() => {
  if (activeName.value !== 'second') return []
  const list = localPaging(secondTableListBack.value, queryForm.value)
  return list
})
const queryForm = ref(queryFormDataInt())
const reset = () => {
  queryForm.value = queryFormDataInt()
  query()
}
// 下载文件
const download = () => {
  const data = formatParams(unref(queryForm))
  const item = map[activeName.value]
  fetchExportSparkStatistics(item.url, { data })
}
const query = () => {
  queryForm.value.currPage = 1
  getList()
}
const getList = async () => {
  const item = map[activeName.value]
  const data = formatParams(unref(queryForm))
  const { list, total } = await fetchListSparkStatistics(item.url, { data })
  queryForm.value.total = total
  if (item.tabkeField === 'tableListBack') {
    tableListBack.value = list
  } else if (item.tabkeField === 'secondTableListBack') {
    secondTableListBack.value = list
  }
}
const formatParams = params => {
  const data = CopyObj(params)
  const [busiType, orgId] = data.busiType
  ;[data.busiType, data.orgId] = [busiType, orgId]
  data.isShowSecondFH = data.isShowSecondFH ? 'Y' : 'N'
  return filterObj(data)
}
</script>
<script>
export default {
  name: 'CompletionRate'
}
</script>

<style lang="scss" scoped>
.card-box {
  :deep(.el-card__body) {
    padding-top: 0;
  }
}
</style>