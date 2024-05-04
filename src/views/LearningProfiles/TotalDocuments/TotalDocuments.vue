<template>
  <div class="total-documents-wrapper">
    <div class="topbar-wrapper">
      <el-tabs v-model="searchType" class="tab-wrapper">
        <el-tab-pane label="员工查询" name="employee"></el-tab-pane>
        <el-tab-pane label="批量查询" name="batch"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="main-wrapper employee-wrapper" v-show="searchType === 'employee'">
      <div class="search-wrapper">
        <gc-select
          class="search-selected"
          filterable
          placeholder="请输入姓名/UM号查找"
          v-model="renderUmId"
          :options="umOptions"
          remote
          :remote-method="getUmInfo"
          k="label"
          v="umId"
          @change="handleSelected"
        ></gc-select>
      </div>
      <div class="tags-wrapper">
        <el-tabs
          v-model="currentTag"
          closable
          @tab-remove="removeTags"
          class="tab-wrapper employee-tabs"
        >
          <template v-for="item in employeeTags">
            <el-tab-pane
              :key="item.umId"
              :label="item.umName"
              :name="item.umId"
            ></el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <div class="info-wrapper">
        <template v-for="item in employeeTags">
          <div class="info-container" :key="item.umId" v-show="item.umId === currentTag">
            <EmployeeFiles :um-id="item.umId"></EmployeeFiles>
          </div>
        </template>
      </div>
    </div>
    <div class="main-wrapper batch-wrapper" v-show="searchType === 'batch'">
      <div class="search-wrapper">
        <el-form class="batch-form" :model="baseQueryForm" :rules="formRules" inline ref="querFormRef">
          <el-form-item label="员工机构" prop="org">
            <gc-institution
              :fetchParams="{ module: 'caseModule' }"
              v-model="baseQueryForm.orgIds"
              placeholder="请选择员工机构"
              ref="institutionRef"
            ></gc-institution>
          </el-form-item>
          <el-form-item label="学习内容" prop="studyContent" v-show="currentSearchType === 'details'">
            <gc-input v-model="baseQueryForm.studyContent" class="w-150" placeholder="请输入学习内容"></gc-input>
          </el-form-item>
          <el-form-item label="学习时间" prop="time">
            <!-- <gc-input v-model="baseQueryForm.time" class="w-150"></gc-input> -->
            <DateRange
              v-model="baseQueryForm"
              start-key="startDate"
              end-key="endDate"
              width="90px"
              :startOptions="{type: 'month', valueFormat: 'yyyy-MM'}"
              :endOptions="{type: 'month', valueFormat: 'yyyy-MM'}"
            ></DateRange>
          </el-form-item>
          <el-form-item label="名单查询" prop="users">
            <el-button @click="isSelectUserShow = true" type="primary">设置名单</el-button>
            <template v-if="baseQueryForm.users.length">
              <span style="padding-left: 10px;">已选择{{ baseQueryForm.users.length }}人</span>
            </template>
          </el-form-item>
          <div class="search-card__button">
            <el-button type="primary" @click="queryDataList()">查询</el-button>
            <el-button @click="resetDataList()">重置</el-button>
          </div>
        </el-form>
      </div>
      <div class="table-wrapper">
        <div class="table-topbar">
          <div class="types-wrapper">
            <el-tabs
              v-model="currentSearchType"
              type="card"
              class="tab-wrapper type-tags"
            >
              <template v-for="(item, index) in batchSearchTypeOptions">
                <el-tab-pane
                  :key="index"
                  :label="item.label"
                  :name="item.value"
                ></el-tab-pane>
              </template>
            </el-tabs>
          </div>
          <div class="controller-wrapper">
            <el-button class="button-item" @click="handleExport">导出</el-button>
          </div>
        </div>
        <div class="content-table-wrapper" v-show="currentSearchType === 'summary'">
          <table-pagination
            class="table-first-align-left"
            :list="summaryColumns"
            :tableList="summaryTableList"
            :queryForm="summaryQueryForm"
            :getList="getSummaryList"
             v-loading="getLoadingStatus('LIST_STUDY_RECORD_COLLECT')"
            ref="summaryTablePaginationRef"
          >
          </table-pagination>
        </div>
        <div class="content-table-wrapper" v-show="currentSearchType === 'details'">
          <table-pagination
            class="table-first-align-left"
            :list="detailsColumns"
            :tableList="detailsTableList"
            :queryForm="detailsQueryForm"
            :getList="getDetailsList"
            v-loading="getLoadingStatus('LOADING_LEARNING_MORE_RECENT')"
            ref="detailsTablePaginationRef"
          >
          </table-pagination>
        </div>
      </div>
    </div>
    <CompSelectCaseUser
      :show="isSelectUserShow"
      type="column"
      @close="closeSelectedUser"
      @save="saveSelectedUser"
      :custom-um-fetch="fetchCheckUmListForStudyRecord"
      hide-name-type
      only-frame
      ref="compSelectCaseUserRef"
    ></CompSelectCaseUser>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import EmployeeFiles from '../EmployeeFiles/EmployeeFiles.vue'
import { CopyObj, formatDate } from '@/plugins/until'
import { useTable } from '@/hooks/useTable'
import { fetchCheckUmListForStudyRecord, fetchListStudyRecord, fetchListStudyRecordCollect, fetchListStudyRecordCollectExport, fetchListStudyRecordExport, fetchListUsersContainLeaveForStudyRecord } from '@/fetch/learningProfiles'
import CompSelectCaseUser from '@/components/select-person/CompSelectCaseUser.vue'
import DateRange from '@/components/dateRange/DateRange.vue'
import { STUDYTYPES } from '../enum'
import { getLoadingStatus } from '@/util/utils'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { Message } from 'element-ui'
const { mergeReactive } = useBaseDataEvents()

const searchType = ref('employee')
const renderUmId = ref('')
const selectedUmid = ref('')
const umOptions = ref([])

const getUmInfo = async (value) => {
  if(!value) return
  const res = await fetchListUsersContainLeaveForStudyRecord({ data: { umName: value } }) || []
  umOptions.value = (res.list || []).map(row => {
    return {
      ...row,
      label: `${row.umName}（${row.umId}）`
    }
  })
}

const handleSelected = (v) => {
  selectedUmid.value = v
  if(!employeeTags.value.some(row => row.umId === v)) {
    const findItem = umOptions.value.find(row => row.umId === v)
    employeeTags.value.push(findItem)
  }
  currentTag.value = v
  nextTick(() => {
    renderUmId.value = ''
  })
}

const currentTag = ref('')
const employeeTags = ref([])
// 移除tags 
const removeTags = (v) => {
  let targetIndex = employeeTags.value.findIndex(row => row.umId === v)
  employeeTags.value.splice(targetIndex, 1)
  currentTag.value = employeeTags.value[Math.max(targetIndex - 1, 0)]?.umId || ''
}


const isSelectUserShow = ref(false)

const closeSelectedUser = () => {
  isSelectUserShow.value = false
}
const saveSelectedUser = (data) => {
  console.log(data, '---->>>');
  isSelectUserShow.value = false
  baseQueryForm.users = data.map(row => ({umId: row.umId}))
  nextTick(() => {
    queryDataList()
  })
}


// type currentSearchType = 'summary' | 'details' 
const currentSearchType = ref('summary')
const batchSearchTypeOptions = [
  {
    label: '汇总',
    value: 'summary'
  },
  {
    label: '明细',
    value: 'details'
  },
]

const baseQueryParams = {
  org: '',
  studyContent: '',
  time: '',
  orgIds: [],
  startDate: `${new Date().getFullYear()}-01`,
  endDate: `${new Date().getFullYear()}-12`,
  users: []
}
const baseQueryForm = reactive(CopyObj(baseQueryParams))
watch(baseQueryForm, () => {
  mergeReactive({ origin: summaryQueryForm, target: baseQueryForm })
  mergeReactive({ origin: detailsQueryForm, target: baseQueryForm })
})

// 表单规则
const formRules = {
  // org: [
  //   {
  //     validator: (rule, value, callback) => {
  //       if (!baseQueryForm.orgIds.length && !baseQueryForm.users.length) {
  //         return callback(new Error('请选择员工机构或者员工名单'))
  //       }
  //       return callback()
  //     }
  //   }
  // ],
  time: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!baseQueryForm.startDate || !baseQueryForm.endDate) {
          return callback(new Error('请选择学习时间'))
        }
        if(baseQueryForm.endDate.split('-')[0] - baseQueryForm.startDate.split('-')[0] > 0) {
          return callback(new Error('时间不能跨年'))
        }
        return callback()
      }
    }
  ]
}

const querFormRef = ref(null)
const queryDataList = () => {
  querFormRef.value.validate(v => {
    if(!v) return
    querySummary(getSummaryList)
    queryDetails(getDetailsList)
  })
}
// onMounted(() => {
//   queryDataList()
// })

const compSelectCaseUserRef = ref(null)
const detailsTablePaginationRef = ref(null)
const resetDataList = () => {
  compSelectCaseUserRef.value?._resetData()
  detailsTablePaginationRef.value?.resetFilters()
  querFormRef.value?.clearValidate()
  mergeReactive({origin: baseQueryForm, target: CopyObj(baseQueryParams)})
  summaryTableList.value = []
  detailsTableList.value = []
  resetSummary()
  resetDetails()
}

const formatParams = (data) => {
  const params = CopyObj(data)
  params.blgStripLine = params.orgIds[0]
  params.orgId = params.orgIds[1]
  params.startMonth = detailsQueryForm.startDate.replace('-', '')
  params.endMonth = detailsQueryForm.endDate.replace('-', '')

  Reflect.deleteProperty(params, 'orgIds')
  Reflect.deleteProperty(params, 'endDate')
  Reflect.deleteProperty(params, 'startDate')
  Reflect.deleteProperty(params, 'time')
  return params
}

const { queryForm: summaryQueryForm, query: querySummary, reset: resetSummary, tableList: summaryTableList } = useTable(baseQueryParams)

// 提交前校验
const validateParams = (params) => {
  if (!params.orgId && !params.users.length) {
    Message.closeAll()
    Message.warning('机构、名单不能都为空，请输入查询范围')
    return false
  }
  return true
}

const summaryColumns = [
  { label: 'UM号', prop: 'umId', type: 'setWidth', width: '140' },
  { label: '姓名', prop: 'empName', type: 'setWidth', width: '90' },
  { label: '员工机构', prop: 'orgName', type: 'setWidth', width: '200' },
  { label: '学习总时长(小时)', width: '120px', type: 'setWidth', prop: 'studyHour' },
  { label: '培训班数', prop: 'classStudyCount' },
  { label: '课程数', prop: 'courseStudyCount' },
  { label: '直播数', prop: 'liveStudyCount' },
  { label: '考试数', prop: 'examStudyCount' },
  { label: '案例数', prop: 'caseStudyCount' },
  { label: 'AI练数', prop: 'aiTrainStudyCount' },
  { label: '其他', prop: 'otherStudyCount' },
]

const getSummaryList = async () => {
  const params = formatParams(summaryQueryForm)
  if(!validateParams(params)) return
  Reflect.deleteProperty(params, 'studyContent') 
  const {total, list} = await fetchListStudyRecordCollect({ data: params })
  summaryQueryForm.total = total
  summaryTableList.value = list
}

const { queryForm: detailsQueryForm, query: queryDetails, reset: resetDetails, tableList: detailsTableList, tableFilterSetting: detailsTableFilter } = useTable(baseQueryParams)

const detailsColumns = [
  {
    label: 'UM号',
    width: '140',
    type: 'setWidth',
    prop: 'umId'
  },
  {
    label: '姓名',
    width: '110',
    type: 'setWidth',
    prop: 'empName'
  },
  {
    label: '员工机构',
    width: '160',
    prop: 'orgName'
  },
  {
    label: '类型',
    width: '100',
    type: 'setWidth',
    prop: 'studyType',
    ...detailsTableFilter('studyTypeList', STUDYTYPES.map(row => ({...row, value: row.studyType})), true)
  },
  {
    label: '学习内容',
    width: '170',
    prop: 'studyContent'
  },
  {
    label: '学习时长(小时)',
    width: '120',
    type: 'setWidth',
    prop: 'studyHour'
  },
  {
    label: '学习时间',
    width: '120',
    prop: 'studyDate'
  }
]

// 拉明细数据
const getDetailsList = async () => {
  const params = formatParams(detailsQueryForm)
  if(!validateParams(params)) return
  const {total, list} = await fetchListStudyRecord({ data: params })
  detailsQueryForm.total = total
  detailsTableList.value = list
}

const handleExport = () => {
  querFormRef.value.validate(v => {
    if(!v) return
    // 'summary' | 'details' 
    if(currentSearchType.value === 'summary') {
      const summaryParams = formatParams(summaryQueryForm)
      if(!validateParams(summaryParams)) return
      Reflect.deleteProperty(summaryParams, 'studyContent')
      fetchListStudyRecordCollectExport({data: summaryParams})
    }
    if(currentSearchType.value === 'details') {
      const detailsParams = formatParams(detailsQueryForm)
      if(!validateParams(detailsParams)) return
      fetchListStudyRecordExport({data: detailsParams})
    }
  })
}

</script>
<script>
export default {
  components: { CompSelectCaseUser },
  // 员工档案
  name: "TotalDocuments"
}
</script>

<style lang='scss' scoped>

.tab-wrapper {
  :deep(.el-tabs__header) {
    margin-bottom: 0;
    border-bottom: 1px solid transparent;
  }
}

.topbar-wrapper {
  margin-bottom: 10px;
  background-color: #fff;
}

.main-wrapper {
  .search-wrapper {
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
  }

  .search-selected {
    $base-height: 40px;
    width: 400px;
    height: $base-height;
    padding: 0;
    :deep(.el-select) {
      width: 100%;
      height: $base-height;
    }
    :deep(.el-input__inner) {
      height: $base-height;
      line-height: $base-height;
    }

    :deep(.el-input__suffix) {
      background: url('../../../assets/svg/hrx-tal-pool-search.svg') no-repeat center;
      vertical-align: middle;
    }

    :deep(.el-input__icon) {
      &::before {
        display: none !important;
      }
      &::after {
        display: none !important;
      }
    }
  }

  .tags-wrapper {
    background-color: #fff;
  }

  .employee-tabs {
    :deep(.el-tabs__header) {
      padding-right: 20px;
    }
    :deep(.el-tabs__item) {
      position: relative;

      &::after {
        content: '';
        display: block;
        width: 1px;
        height: 15px;
        background-color: rgba($color: #000000, $alpha: 0.2);
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
    :deep(.el-tabs__active-bar) {
      display: none;
    }
    :deep(.el-icon-arrow-left) {
      margin-top: 19px;
      color: #7d8292 !important;
    }
    :deep(.el-icon-arrow-right) {
      margin-top: 19px;
      color: #7d8292 !important;
    }
  }

  .info-wrapper {
    margin-top: 10px;
  }
}

.batch-wrapper {
  .search-wrapper {
    // min-height: 110px;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    // flex-wrap: wrap;
    // :deep(.batch-form) {
    //   display: flex;
    // }
    .batch-form {
      overflow: hidden;
    }
    :deep(.batch-form .el-form-item) {
      // margin-bottom: 0;
      margin-right: 30px;
      // display: inline-flex;
      // align-items: center;

      .el-form-item__content {
        // display: inline-flex;  
        line-height: normal;
      }
    }
  }
  .table-wrapper {
    padding: 20px;
    background-color: #fff;
    margin-top: 10px;
  }

  .type-tags {
    $base-height: 28px;
    padding-bottom: 20px;
    :deep(.el-tabs__header) {
      height: $base-height;
      padding-left: 0 !important;
      .el-tabs__nav {
        border: 0 !important;
      }
    }
    :deep(.el-tabs__item) {
      height: $base-height !important;
      line-height: $base-height !important;
      font-size: 12px;
      border: 1px solid #e4e7ed;
      background-color: #F7F8FA;

      &.is-active {
        background-color: #fff;
        border: 1px solid $themeColor;
      }
    }
  }

  .table-topbar {
    display: flex;
    justify-content: space-between;

    .controller-wrapper {
      .button-item {
        width: 89px;
        height: 30px;

        &:focus {
          background-color: #fff;
          border: 1px solid #dcdfe6;
        }
      }
    }
  }
}

.search-card__button {
  margin-top: 0;
  margin-bottom: 20px;
}

</style>