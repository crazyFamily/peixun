<template>
  <div class="establish-inventory-wrapper">
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" inline>
        <el-form-item label="部门" class="first">
          <div class="df">
            <gc-institution v-model="queryForm.busiType" :fetchParams="{module: CLASS_MODULE }"> </gc-institution>
            <div class="checkbox-wrap ml10">
              <el-checkbox v-model="queryForm.isGotSubBranch"
                >含下属机构</el-checkbox
              >
            </div>
          </div>
        </el-form-item>
        <el-form-item label="培训班名称/编号">
          <el-input v-model="queryForm.className" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="UM号">
          <el-input v-model="queryForm.umId" class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="立项提交时间" class="search-card__date mr10 df">
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
          <el-form-item label="至" class="search-card__date r0 df">
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
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="download" type="primary">导出</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="box-card mt20">
      <table-pagination
        :list="tableColumns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
        v-loading="getLoadingStatus('LOADING_ITEM_LIST')"
      >
        <el-table-column
          min-width="120"
          slot="classTypeOne"
          prop="classTypeOneName"
        >
          <template slot="header">
            <gc-tablecolumnfilters
              label="项目分类"
              ref="classTypeOneFilter"
              className="table__screen__icon"
              :list="classTypeOneList"
              confirmText="确定"
              popperClass="circular m183"
              @change="classTypeOneChange"
              @filter="
                commonFilter(
                  $event,
                  queryForm,
                  'classTypeOne',
                  getList,
                  'filter'
                )
              "
              @reset="commonFilter($event, queryForm, 'classTypeOne', getList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          slot="classTypeTwo"
          prop="classTypeTwoName"
        >
          <template slot="header">
            <gc-tablecolumnfilters
              label="项目子分类"
              ref="classTypeTwoFilter"
              className="table__screen__icon"
              :list="classTypeTwoList"
              confirmText="确定"
              popperClass="circular m183"
              @filter="
                commonFilter(
                  $event,
                  queryForm,
                  'classTypeTwo',
                  getList,
                  'filter',
                  true
                )
              "
              @reset="
                commonFilter(
                  $event,
                  queryForm,
                  'classTypeTwo',
                  getList,
                  '',
                  true
                )
              "
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { CopyObj, commonFilter, getLoadingStatus } from '@/util/utils'
import { ref, watch } from 'vue'
import {
  fetchItemList,
  fetchExportItemList,
  fetchListClassType
} from '@/fetch/statementCentre'
import { TRAIN_SHAPE_OPTIONS, IF_CONFORMANCE_OPTIONS, CLASS_MODULE } from '../enum'
const startPickerOptions = ref({})
const endPickerOptions = ref({})
const classTypeOneList = ref([])
const classTypeTwoList = ref([])
const currClassTypeOne = ref('')
const classTypeOneFilter = ref(null)
const classTypeTwoFilter = ref(null)
let allAlassTypeTwoList = []

// 返回一个queryForm的实例对像
const getQueryFormInt = () => {
  return {
    busiType: [],
    orgId: '',
    // 开始日期  格式: yyyy-MM-dd
    dateStart: '',
    // 结束日期 格式: yyyy-MM-dd
    dateEnd: '',
    total: 0,
    currPage: 1,
    pageSize: 10,
    className: '',
    umId: '',
    // 选择子机构标识
    isGotSubBranch: false,
    classTypeOne: ''
  }
}

const queryForm = ref(getQueryFormInt())

// 封装备过滤设置
const tableFilterSetting = (key, list, multiple = false) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

const isFinishList = () => {
  return [
    { label: '是', value: 'Y' },
    { label: '否', value: 'N' }
  ]
}

// 定义并执行获取项目分类数据
const getClassTypeDatas = async () => {
  const { classTypeOneList: oneDataList, classTypeTwoList: towDataList } =
    await fetchListClassType()
  const _classTypeOneList = oneDataList.map((v) => ({
    label: v.dataValue,
    value: v.dataEncode
  }))
  classTypeOneList.value.push(..._classTypeOneList)
  allAlassTypeTwoList = towDataList
}
getClassTypeDatas()

// 项目分类选项change事件
const classTypeOneChange = ({ list }) => {
  currClassTypeOne.value = list[0]
}

watch(currClassTypeOne, (n) => {
  const result = []
  classTypeTwoFilter.value.$reset()
  queryForm.value.classTypeTwo = []
  allAlassTypeTwoList.forEach((v) => {
    if (v.prnDataEncode === n) {
      result.push({
        label: v.dataValue,
        value: v.dataEncode
      })
    }
  })
  classTypeTwoList.value.splice(0, classTypeTwoList.value.length, ...result)
})

// 表格头设置
const tableColumns = ref([
  {
    label: '序号',
    type: 'index',
    width: '64'
  },
  {
    label: '项目名称',
    prop: 'className',
    width: '200'
  },
  {
    label: '项目编号',
    prop: 'classId',
    width: '120'
  },
  {
    label: '申请部门',
    prop: 'orgName',
    width: '240'
  },
  {
    label: '申请人UM号',
    prop: 'createdBy',
    width: '120'
  },
  {
    label: '申请人姓名',
    prop: 'createdByEmpName',
    width: '100'
  },
  {
    label: '条线',
    prop: 'busiType',
    width: '80'
  },
  {
    slot: 'classTypeOne'
  },
  {
    slot: 'classTypeTwo'
  },
  {
    label: '是否消保培训',
    prop: 'ifConformanceDesc',
    width: '120',
    ...tableFilterSetting('ifConformance', IF_CONFORMANCE_OPTIONS, false)
  },
  {
    label: '培训形式',
    prop: 'trainingModeDesc',
    width: '100',
    ...tableFilterSetting('trainingModes', TRAIN_SHAPE_OPTIONS, true)
  },
  {
    label: '立项提交时间',
    prop: 'createdDate',
    width: '140'
  },
  {
    label: '项目周期',
    prop: 'classStartEndTime',
    width: '200'
  },
  {
    label: '立项总金额',
    prop: 'totalFee',
    width: '100'
  },
  {
    label: '是否结训',
    prop: 'isFinish',
    width: '100',
    ...tableFilterSetting('isFinish', isFinishList()),
    formatter: (row) => {
      const map = { Y: '是', N: '否' }
      return map[row.isFinish] || '-'
    }
  },
  {
    label: '结训时间',
    prop: 'dateFinish',
    width: '150'
  },
  {
    label: '计划参加人数',
    prop: 'planNum',
    width: '100'
  },
  {
    label: '结训人数',
    prop: 'studentNum',
    width: '100'
  },
  {
    label: '培训班时长',
    prop: 'classTime',
    width: '100'
  }
])
// 表格列表数据
const tableList = ref([])
// loading标记
const isDataLoading = ref(false)

// 请求参数出口格式化
const _formatParams = (params) => {
  const data = CopyObj(params)
  const [busiType, orgId] = data.busiType
  ;[data.busiType, data.orgId] = [busiType, orgId]
  data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
  return data
}

// 查询
const query = () => {
  const { value: queryFormValue } = queryForm
  queryFormValue.currPage = 1
  getList()
}

// 重置
const reset = () => {
  Object.assign(queryForm.value, getQueryFormInt())
  classTypeOneFilter.value.$reset()
  classTypeTwoFilter.value.$reset()
  getList()
}

// 获取数据
const getList = async () => {
  isDataLoading.value = true
  const data = _formatParams(queryForm.value)
  fetchItemList({ data })
    .then(({ total, list }) => {
      queryForm.value.total = total
      tableList.value = list
    })
    .finally(() => {
      isDataLoading.value = false
    })
}

// 导出
const download = async () => {
  const data = _formatParams(queryForm.value)
  await fetchExportItemList({ data })
}

defineExpose({
  startPickerOptions,
  endPickerOptions,
  queryForm
})
</script>
<script>
import { pickerOptions } from '@/util/utils'
export default {
  name: 'EstablishProjectInventory',
  mounted() {
    const { startPickerOptions, endPickerOptions } = pickerOptions(this)
    this.startPickerOptions = startPickerOptions
    this.endPickerOptions = endPickerOptions
  }
}
</script>
<style lang='scss' scoped>
</style>