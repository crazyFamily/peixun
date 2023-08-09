<template>
  <div class="report-wrapper">
    <div class="content-box p20">
      <el-tabs v-model="activeName" class="nav-tab" @tab-click="tabsChangeHandle">
        <el-tab-pane label="案例评分统计" name="statistics"></el-tab-pane>
        <el-tab-pane label="案例评分明细" name="detail"></el-tab-pane>
      </el-tabs>
      <el-form class="clearfix" :model="queryForm" inline>
        <el-form-item label="案例归属">
          <gc-institution v-model="queryForm.orgIds" :leftShow="false" busiType="LS" ref="institutionRef"> </gc-institution>
        </el-form-item>
        <el-form-item label="案例名称">
          <el-input v-model.trim="queryForm.caseInfo" placeholder="案例编号/名称"></el-input>
        </el-form-item>
        <el-form-item label="案例上架时间">
          <el-date-picker class="rms-daterange-picker" v-model="queryForm.daterange" type="daterange" placeholder="开始日期" :clearable="false" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="选择开始日期" end-placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="activeName === 'detail'" label="评分时间">
          <el-date-picker class="rms-daterange-picker" v-model="queryForm.evaDaterange" type="daterange" placeholder="开始日期" :clearable="false" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="选择开始日期" end-placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="activeName === 'detail'" label="评分人">
          <el-input v-model.trim="queryForm.evaUserInfo" placeholder="评分人姓名/UM号"></el-input>
        </el-form-item>
        <div class="buttons fr mb20">
          <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
      <div class="menu-right">
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination v-loading="loadingTable" :list="list" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="scoretablePagination"> </table-pagination>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc mt20">
      <el-button class="button-w80-h30" @click="canel">返回</el-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import { blgStripLineOptions, CopyObj, resetObj, filterObj } from '@/util/utils'
import store from '@/store'
import { fetchListEvaZoneCase, fetchListEvaZoneCaseExport, fetchListEvaZoneCaseDetail, fetchListEvaZoneCaseDetailExport, fetchListTags } from '@/fetch/caseCenter'
const list = [
  {
    label: '案例编号',
    prop: 'caseId',
    width: '100'
  },
  {
    label: '案例名称',
    prop: 'caseName',
    width: '160'
  },
  {
    label: '案例所属',
    prop: 'belongOrgStr',
    width: '160'
  },
  {
    type: 'tablecolumnfilters',
    label: '业务条线',
    prop: 'businessLineStr',
    width: '120',
    labelKey: 'businessLine',
    list: []
  },
  { label: '案例上架时间', prop: 'firstUpTimeStr', width: '120' },
  { label: '评分人数', prop: 'evaCount', width: '110' },
  { label: '综合评分', prop: 'totalScore', width: '110' },
  { label: '维度：符合战略', prop: 'strategyScore', width: '110' },
  { label: '维度：场景典型', prop: 'scenarioScore', width: '110' },
  { label: '维度：挑战充分', prop: 'challengeScore', width: '110' },
  { label: '维度：案例撰写', prop: 'caseScore', width: '110' },
  { label: '维度：干法有效', prop: 'wayScore', width: '110' }
]
const activeName = ref('statistics')
const tabsChangeHandle = () => {
  const statisticsList = [{ label: '评分人数', prop: 'evaCount', width: '110' }]
  const detailList = [
    { label: '评价人姓名', prop: 'evaUmName', width: '110' },
    { label: '评价人UM号', prop: 'evaUm', width: '110' },
    { label: '评分时间', prop: 'evaDate', width: '120' }
  ]
  if (activeName.value === 'statistics') {
    list.forEach((v, i) => {
      if (v.prop === 'evaUmName') {
        list.splice(i, detailList.length)
        statisticsList.forEach((s, si) => {
          list.splice(i + si, 0, s)
        })
      }
    })
 } else {
    list.forEach((v, i) => {
      if (v.prop === 'evaCount') {
        list.splice(i, statisticsList.length)
        detailList.forEach((s, si) => {
          list.splice(i + si, 0, s)
        })
      }
    })
  }
  reset()
}
const queryForm = reactive({
  zoneId: '',
  currPage: 1,
  daterange: [],
  pageSize: 10,
  total: 0,
  caseInfo: '',
  upStartDate: '',
  upEndDate: ''
})
// 格式化查询入参
const formatParams = data => {
  data.upStartDate = data.daterange?.[0]
  data.upEndDate = data.daterange?.[1]
  data.evaStartDate = data.evaDaterange?.[0]
  data.evaEndDate = data.evaDaterange?.[1]
  const params = CopyObj(data)
  params.orgId = params.orgIds?.[1]
  Reflect.deleteProperty(params, 'daterange')
  Reflect.deleteProperty(params, 'evaDaterange')
  Reflect.deleteProperty(params, 'orgIds')
  Reflect.deleteProperty(params, 'total')
  if (activeName.value === 'statistics') {
    Reflect.deleteProperty(params, 'evaUserInfo')
    Reflect.deleteProperty(params, 'evaStartDate')
    Reflect.deleteProperty(params, 'evaEndDate')
  }
  params.currPage = params.currPage
  return filterObj(params)
}
const tableList = ref([])
const loadingTable = ref(false)
const getList = async () => {
  loadingTable.value = true
  const data = formatParams(queryForm)
  data.type = 'C'
  const { list, total } =
    activeName.value === 'statistics'
      ? await fetchListEvaZoneCase({ data }).finally(() => {
          loadingTable.value = false
        })
      : await fetchListEvaZoneCaseDetail({ data }).finally(() => {
          loadingTable.value = false
        })
  tableList.value = list
  queryForm.total = total
}
const query = () => {
  queryForm.currPage = 1
  getList()
}
const institutionRef = ref(null)
const scoretablePagination = ref(null)
const reset = () => {
  let zoneId = queryForm.zoneId
  resetObj(queryForm, {
    currPage: 1,
    zoneId,
    daterange: [],
    pageSize: 10,
    total: 0,
    caseInfo: '',
    upStartDate: '',
    upEndDate: ''
  })
  institutionRef.value?.createTreeData()
  scoretablePagination.value?.resetFilters()
  getList()
}
const exportHandle = async () => {
  let data = formatParams(queryForm)
  data.type = 'E'
  activeName.value === 'statistics' ? await fetchListEvaZoneCaseExport({ data }) : await fetchListEvaZoneCaseDetailExport({ data })
}
// 注册事件
const emits = defineEmits(['changeComp'])
function canel() {
  emits('changeComp', { flag: 'list', data: { activeTab: 'score' } })
}
const props = defineProps({
  compData: {
    type: Object,
    default: () => {}
  }
})
// 监听
watch(
  () => props.compData,
  n => {
    _initData(n)
  },
  {
    immediate: true
  }
)
function _initData(compData) {
  activeName.value = 'statistics'
  queryForm.zoneId = compData.zoneId
  tabsChangeHandle()
}
// 获取 业务条线 下拉选项
const getAllFilter = async () => {
  const data = await fetchListTags({ data: { blgStripLine: store.state.userInfo.blgStripLine, tagType: 5 } })
  const tagsList =
    data?.map(v => ({
      value: v.tagId,
      tagId: v.tagId,
      label: v.tagName,
      tagName: v.tagName,
      tagLevel: v.tagLevel,
      parentTagId: v.parentTagId
    })) || []
  list.forEach(v => {
    if (v.labelKey === 'businessLine') {
      v.list.push(...tagsList.filter(v => v.tagLevel === '1'))
    }
  })
}
getAllFilter()
</script>
<script>
export default {
  name: 'ScoringReport'
}
</script>
<style lang="scss" scoped>
.report-wrapper {
  background-color: #fff;
}
.rms-daterange-picker {
  width: 300px;
}
</style>
