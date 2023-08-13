<template>
  <div class="plan-wrapper">
    <div class="between-noc mt5 search-wrapper">
      <el-form :model="internalPlanForm" inline label-width="72px">
        <el-form-item label="项目名称">
          <el-input v-model.trim="internalPlanForm.annualPlanName"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" class="org-style">
          <gc-institution v-model="internalPlanForm.orgs" :org-url="API_SELECT_ASSOCIATE_PLAN_TREE" :default-show="true" :left-show="true" @setDataFinish="orgSetDataFinish" ref="institutionRef"></gc-institution>
          <el-checkbox v-model="internalPlanForm.isGotSubBranch" true-label="Y" false-label="N" class="ml10">含下属机构</el-checkbox>
        </el-form-item>
        <template v-if="trainingCourse">
          <el-form-item label="培训系列及子系列" label-width="120px">
            <TrainSeriesCascader v-model="internalPlanForm.trainSeries" :line="blgStripLine || ''" :type="establishInfo?.classTypeOne || ''"></TrainSeriesCascader>
          </el-form-item>
          <el-form-item label="业务模块">
            <gc-select
              k="dataValue"
              v="dataEncode"
              :options="channelTypes"
              v-model="internalPlanForm.channelType"
              @change="channelTypeChange"
            ></gc-select>
          </el-form-item>
          <el-form-item label="关键岗位">
            <gc-select k="dataValue" v="dataEncode" :options="internalKeyPositionOptions" v-model="internalPlanForm.keyJobs"></gc-select>
          </el-form-item>
        </template>
      </el-form>
      <div class="df">
        <el-button class="button-60" @click="search">查询</el-button>
        <el-button class="button-60 button-blue" @click="reset">重置</el-button>
      </div>
    </div>
    <table-pagination :list="columns" :page-sizes="[5, 10]" :tableList="tableList" :getList="getPlanList" :queryForm="internalPlanForm" auto-height radio @selection-change="selectionHandle" ref="tablePagination"> </table-pagination>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { CopyObj, getBlgStripLineOptions, renderName } from '@/util/utils'
import { LINE_LS, LINE_MAP, YES_STATUS } from '@/util/constants'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { IF_CONFORMANCE_OPTIONS, LADDER_COURSE_TYPE, TRAINING_COURSE_TYPE } from '@/views/Establish/enum'
import { fetchListClassAssociatePlan } from '@/fetch/establish'
import TrainSeriesCascader from '@/components/cascader/TrainSeriesCascader.vue'
import { APIAllTree, API_SELECT_ASSOCIATE_PLAN_TREE } from '@/fetch/public'
const { mergeReactive } = useBaseDataEvents()
const emit = defineEmits(['changeLine', 'select'])
const channelTypes = ref([])
const trainSeries = ref([])
const trainTypes = ref([])
const props = defineProps({
  classTypes: {
    type: Object,
    required: true
  },
  classTypeOne: String,
  blgStripLine: String,
  establishInfo: {
    type: Object,
    required: true
  }
})

watch(() => props.classTypes, n => {
  console.log(n, props.establishInfo, '===>>>');
  channelTypes.value = n.channelTypes || []
  trainSeries.value = n.trainSeries || []
  trainTypes.value = n.trainTypes || []
}, {immediate: true})
const baseFormInt = () => ({
  annualPlanName: '',
  // 条线
  blgStripLine: props.establishInfo.blgStripLine || 'LS',
  // 业务模块
  channelType: '',
  // 关键岗位
  keyJobs: '',
  // 培训系列
  trainSeries: [],
  // 子系列
  childSeries: '',
  orgs: [],
  dateStart: props.establishInfo.dateStart,
  isGotSubBranch: 'Y',
  currPage: 1,
  pageSize: 5,
  total: 0
})
const internalPlanForm = reactive(baseFormInt())

const selectOptions = ref({
  channelTypes: [],
  trainSeries: [],
})
const blgStripLineOptions = ref([])
const internalKeyPositionOptions = ref([])
const internalTrainSeriesChildOptions = ref([])

const getLineDataInfos = async () => {
  blgStripLineOptions.value = await getBlgStripLineOptions('classModule')
}
getLineDataInfos()

// 条线切换
const blgStripLineChange = () => {
  internalPlanForm.channelType = ''
  internalPlanForm.trainSeries = ''
  internalPlanForm.keyJobs = ''
  internalPlanForm.childSeries = ''
  emit('changeLine', internalPlanForm.blgStripLine)
}

// 业务模块切换
const channelTypeChange = () => {
  const data = channelTypes.value.find(row => row.dataEncode === internalPlanForm.channelType)
  internalKeyPositionOptions.value = data?.childPlanDict || []
  internalPlanForm.keyJobs = ''
}

// 培训系列切换
const trainSeriesChange = () => {
  const data = trainSeries.value.find(row => row.dataEncode === internalPlanForm.trainSeries)
  internalTrainSeriesChildOptions.value = data?.childPlanDict || []
  internalPlanForm.childSeries = ''
}

const trainingCourse = computed(() => {
  return props?.establishInfo?.classTypeOne === TRAINING_COURSE_TYPE
})

const formatParms = (info) => {
  const data = CopyObj(info)
  console.log(info, props, props.establishInfo.classTypeOne, '===>> format data');
  data.planClassType = props.establishInfo.classTypeOne === TRAINING_COURSE_TYPE ? 1 : 0
  data.blgDept = props.establishInfo.orgId
  data.trainType = props.establishInfo.classTypeTwo || ''
  // data.trainType = props.establishInfo.classTypeOne || TRAINING_COURSE_TYPE
  data.blgStripLine = data.orgs[0] || data.blgStripLine || props.establishInfo.blgStripLine || 'LS'
  data.page = data.currPage
  data.size = data.pageSize

  data.ifConformance = props.establishInfo.ifConformance
  console.log(internalPlanForm.orgs, '===>> orgs');
  data.planDept = internalPlanForm.orgs?.[1]
  Reflect.deleteProperty(data, 'orgs')

  // 需求变更，针对合并后的培训系列级联数据结构做个拆分
  if(Array.isArray(data.trainSeries)) {
    [data.trainSeries, data.childSeries] = data.trainSeries
    console.log(data.trainSeries, data.childSeries);
  }
  return data
}

const getPlanList = async () => {
  const data = formatParms(internalPlanForm)
  const {list, total} = await fetchListClassAssociatePlan({data})
  internalPlanForm.total = total
  tableList.value = list
}

const search = () => {
  internalPlanForm.currPage = 1
  getPlanList()
}
(props.blgStripLine === LINE_LS) && search()

const orgSetDataFinish = ({ orgId }) => {
  search()
}

const institutionRef = ref(null)
const reset = () => {
  mergeReactive({origin: internalPlanForm, target: baseFormInt()})
  institutionRef?.value?.createTreeData()
  // search()
}

// 表格配置
// 内部计划字段数组
const columns = ref([
  {
    type: 'selection',
    width: '54'
  },
  {
    type: 'index',
    label: '序号',
    width: '54'
  },
  {
    label: '年份',
    width: '80',
    prop: 'planYear'
  },
  {
    label: '条线',
    width: '100',
    prop: 'blgStripLine',
    formatter: (row) => LINE_MAP[row.blgStripLine]
  },
  {
    label: '计划单位',
    width: '200',
    prop: 'packageDeptName'
  },
  {
    label: '项目名称',
    width: '130',
    prop: 'className'
  },
  {
    label: '培训类型',
    width: '100',
    prop: 'trainTypeDesc'
  },  
  {
    label: '是否消保培训',
    width: '130',
    prop: 'ifConformance',
    formatter: row => row.ifConformance === YES_STATUS ? '是':'否'
  },
  {
    label: '业务模块',
    width: '110',
    prop: 'channelTypeDesc'
  },
  {
    label: '关键岗位',
    width: '110',
    prop: 'keyJobsDesc'
  },
  {
    label: '培训系列及子系列',
    width: '150',
    prop: 'trainSeriesDesc',
    formatter: row => [row.trainSeriesDesc, row.childSeriesDesc].join('/')
  },
  {
    label: '创建人',
    width: '200',
    formatter: row => renderName(row.createdByName, row.createdBy)
  },
  {
    label: '创建人部门',
    width: '266',
    prop: 'blgDeptName'
  }
])

onMounted(() => {
  if(!trainingCourse.value) {
    columns.value = columns.value.filter(row => {
      return  !['channelTypeDesc', 'keyJobsDesc', 'trainSeriesDesc'].includes(row.prop)
    })
  }
})

const tableList = ref([])

// 选择行
const selectionHandle = (list) => {
  emit('select', list[0])
}
</script>
<style lang='scss' scoped>
.search-wrapper {
  :deep(.gc-select) {
    padding: 0;
  }
}
.org-style {
  :deep(.el-form-item__content) {
    display: inline-flex !important;
  }
}
</style>
