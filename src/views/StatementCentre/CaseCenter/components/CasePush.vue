<template>
  <div class="StatementCentre__OnlineStatistic__Case">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="案例归属">
          <div class="df">
            <gc-institution v-model="queryForm.orgIds" 
              busiType="LS" :left-show="false" :default-show="true"
              :fetchParams="{ module: CASE_MODULE }"
              :otherParams="{ module: CASE_MODULE }"
              @setDataFinish="orgIdsFinish" ref="institutionRef">
            </gc-institution>
          </div>
        </el-form-item>
        <el-form-item>
          <el-form-item label="案例上架时间" class="mr10">
            <el-date-picker class="w-120" v-model="queryForm.upStartDate" type="month" placeholder="选择日期" :clearable="false" :picker-options="startPickerOptions" value-format="yyyy-MM-dd" popper-class="date-picker">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker class="w-120" v-model="queryForm.upEndDate" type="month" placeholder="选择日期" :clearable="false" :picker-options="endPickerOptions" value-format="yyyy-MM-dd" popper-class="date-picker">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="案例信息">
          <el-input v-model="queryForm.caseInfo" placeholder="案例编号/案例名称"></el-input>
        </el-form-item>
        <el-form-item label="上传人">
          <el-input v-model="queryForm.uploadUser" placeholder="姓名/UM号"></el-input>
        </el-form-item>
        <el-form-item label="案例分类">
          <gc-select class="w-200" :options="caseClassifyOptions" @change="changeCaseClassify" v-model="queryForm.businessLine"></gc-select>
        </el-form-item>
        <el-form-item label="案例标签">
          <el-cascader
            clearable
            :options="caseTagOptions"
            :props="cascaderProps"
            collapse-tags
            class="casepush-tags"
            @visible-change="setEmptyContent"
            v-model="queryForm.tagChildIds"
            ref="multipleCascaderRef"
          >
          </el-cascader>
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
      <table-pagination v-loading="getLoadingStatus('LOADING_CASE_PUSH_STATISTICS')" :list="list" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="scoretablePagination">
        <el-table-column slot="tagName" width="226px;" label="案例标签">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content" v-html="toBreak(scope.row.tagName)"></div>
              <div class="onLine" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{scope.row.tagName}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { resetObj, CopyObj, filterObj, getLoadingStatus, arrToTree } from '@/util/utils'
import { fetchListCasePush, fetchListCasePushExport, fetchListTags } from '@/fetch/caseCenter'
import { yesOrNoMap, LINE_LS } from '@/util/constants'
import { reactive, ref, nextTick, onMounted } from 'vue'
import { CASE_MODULE } from '../../enum'
import store from '@/store'
const startPickerOptions = {}
const endPickerOptions = {}
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
    type: 'tablecolumnfilters',
    label: '是否优秀案例',
    width: '120',
    prop: 'isPerfect',
    radio: true,
    labelKey: 'isPerfect',
    formatter: row => `${row.isPerfect === 'Y' ? '是' : '否'}`,
    list: yesOrNoMap
  },
  {
    label: '案例所属机构',
    prop: 'belongOrgStr',
    width: '160'
  },
  {
    label: '案例分类',
    prop: 'businessLineStr',
    width: '120',
  },
  {
    label: '案例标签',
    slot: 'tagName',
    width: '226'
  },
  {
    label: '上传人',
    prop: 'createdByName',
    width: '80'
  },
  {
    label: '上架时间',
    prop: 'firstUpTime',
    width: '120'
  },
  {
    label: '累计推送人数',
    prop: 'pushUserNum',
    width: '110'
  },
  {
    label: '学习人数',
    prop: 'learnedUserNum',
    width: '80'
  },
  {
    label: '完成人数',
    prop: 'finishUserNum',
    width: '80'
  },
  {
    label: '学习率',
    prop: 'learnedRate',
    width: '80'
  },
  {
    label: '完成率',
    prop: 'finishRate',
    width: '80'
  }
]
const tableList = ref([])
const queryForm = ref({
  currPage: 1,
  pageSize: 10,
  upStartDate: '',
  upEndDate: '',
  businessLine: '',
  tagChildIds: []
})

const _formatSendParams = params => {
  let data = filterObj(params)
  data.orgId = data.orgIds?.[1]
  data.tagChildIds = multipleCascaderRef.value.getCheckedNodes().map(v=>v.value)
  Reflect.deleteProperty(data, 'orgIds')
  return data
}
const getList = async () => {
  const data = _formatSendParams(queryForm.value)
  const { list, total } = await fetchListCasePush(data)
  tableList.value = list
  queryForm.value.total = total
}
const query = () => {
  queryForm.value.currPage = 1
  getList()
}
const tagsList = ref([])
const caseTagOptions = ref([])
const caseClassifyOptions = ref([])
const multipleCascaderRef = ref(null)
const blgStripLine = store.state.userInfo.blgStripLine || LINE_LS
const cascaderProps = { value: 'value', label: 'label', multiple: true }
const institutionRef = ref(null)
const scoretablePagination = ref(null)
const reset = () => {
  resetObj(queryForm.value, {
    currPage: 1,
    pageSize: 10,
    total: 0,
    upStartDate: '',
    upEndDate: ''
  })
  scoretablePagination.value.resetFilters()
  institutionRef.value.createTreeData()
  nextTick(() => {
    caseTagOptions.value = []
  })
}
const orgIdsFinish = () => {
  query()
}
// 导出
const exportHandle = () => {
  let data = _formatSendParams(queryForm.value)
  fetchListCasePushExport(data)
}
const changeCaseClassify = val => {
  let selectItem = caseClassifyOptions.value.find(item => item.value === val)
  let newArr = []
  if (selectItem) {
    newArr.push(selectItem)
    arrToTree(newArr, tagsList.value)
    newArr = newArr[0]?.children || []
  }
  // 重新渲染案例标签
  queryForm.tagChildIds = []
  nextTick(() => {
    caseTagOptions.value = newArr
  })
}
// 获取 案例分类、案例标签 下拉选项
const getAllFilter = async () => {
  const data = await fetchListTags({ data: { blgStripLine, tagType: 5 } })
  tagsList.value =
    data?.map(v => ({
      value: v.tagId,
      tagId: v.tagId,
      label: v.tagName,
      tagLevel: v.tagLevel,
      parentTagId: v.parentTagId
    })) || []
  caseClassifyOptions.value = tagsList.value.filter(v => v.tagLevel === '1')
}
const toBreak = (val) => {
  return val?.replace(/\n/g,'<br />')
}
// 设置数据为空时的方法
const setEmptyContent = n => {
  if (n) {
    nextTick(() => {
      const emptyEle = multipleCascaderRef.value.popperElm.querySelector('.el-cascader-menu__empty-text')
      if (emptyEle) {
        emptyEle.innerText = '请先选择分类'
      }
    })
  }
}
onMounted(() => {
  multipleCascaderRef.value.$el.querySelector('.el-input').style.width = '350px'
})
getAllFilter()
</script>
<style lang="scss" scoped>
.casepush-tags {
  :deep(.el-input__inner) {
    height: 30px !important;
  }
}
</style>