<template>
  <div class="curriculum-wrapper">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="课程名称">
          <el-input class="w200" placeholder="请输入课程名称" v-model="queryForm.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程关键字">
          <el-input placeholder="请输入课程关键字" v-model="queryForm.keyword"></el-input>
        </el-form-item>
        <el-form-item label="课程系列">
          <el-cascader
            clearable
            class="w-200"
            v-model="queryForm.courseClassify"
            :options="courseClassifyOptions"
            :props="{ value: 'tagId', label: 'tagName' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="课程标签">
          <el-cascader
            clearable
            @visible-change="handleCascader"
            class="w-200 max-120 mt1"
            popper-class="cascader-no-first"
            v-model="queryForm.courseTagIds"
            :options="tagOptions"
            collapse-tags
            :props="{
              value: 'tagId',
              label: 'tagName',
              multiple: true,
              checkStrictly: true
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="课程属主部门">
          <gc-select k="orgName" v="orgId" :options="orgOptions" v-model="queryForm.blgOrg"></gc-select>
        </el-form-item>
        <el-form-item label="课程来源">
          <gc-select :options="sourceOptions" v-model="queryForm.source"></gc-select>
        </el-form-item>
        <el-form-item label="授课讲师">
          <el-input class="w200" placeholder="请输入讲师姓名" v-model="queryForm.teacherUm"></el-input>
        </el-form-item>
        <el-form-item label="是否纳入理财合规课程">
          <gc-select :options="isFinanceComplianceOptions" v-model="queryForm.isFinanceCompliance"></gc-select>
        </el-form-item>
        <el-form-item label="上架人">
          <el-input class="w200" placeholder="请输入上架人姓名" v-model="queryForm.upBy"></el-input>
        </el-form-item>
        <el-form-item label="下架人">
          <el-input class="w200" placeholder="请输入下架人姓名" v-model="queryForm.downBy"></el-input>
        </el-form-item>
        <!-- <el-form-item class="mr20"> -->
        <el-form-item label="上架时间" class="search-card__date mr10">
          <el-date-picker
            class="rms-daterange-picker input-width"
            v-model="queryForm.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right icons no-line">
        <span class="icons__add" @click="addHandle">
          <i class="icons__add__icon"></i>
          新增课程</span
        >
        <span class="icons__upload ml10" @click="exportHandle">
          <i class="icons__upload__icon"></i>
          导出</span
        >
      </div>
      <table-pagination :list="columns" :tableList="tableList" :queryForm="queryForm" :getList="getList" ref="tablePaginationRef">
        <el-table-column slot="courseName" prop="courseName" label="课程名称" show-overflow-tooltip width="290">
          <template slot-scope="scope">
            <div class="active underline over-style" @click="gotoPreview(scope.row)">{{ scope.row.courseName }}</div>
          </template>
        </el-table-column>
        <el-table-column slot="courseTag" prop="courseTag" label="课程标签" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span class="active underline">{{ scope.row.courseTag }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="84" prop="" fixed="right">
          <template slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <template v-for="(item, index) in tableEditInfo">
                  <span class="active" :key="index" v-if="validateStatusMap(scope.row, item.value)" @click="item.handler(scope.row)">
                    {{ item.label }}
                  </span>
                </template>
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 查看 审批记录 -->
    <CkeckApprovalRecord :row="eoaStatusObj" />
    <!-- 推送弹窗 -->
    <PushDialog :showPushDialog="showPushDialog" :pushInfo="pushInfo" @close="closePushDialog" />
  </div>
</template>

<script setup>
import {
  EOA_DRAFTS,
  EOA_WAITTING,
  EOA_DONE,
  EOA_BACK,
  EOA_WITHDRAW,
  YES_STATUS,
  NO_STATUS,
  sourceOptions,
  yesOrNoMap as isFinanceComplianceOptions,
  difficultEasyOptions,
  courseTypeOptions,
  curriculumStatusOptions,
  approvalStatusOptions,
  yesOrNoMap,
  PUSH_TYPE
} from '@/views/CourseRecommendation/enum'
import { onActivated, onMounted, ref, unref } from 'vue'
import {
  APISelectCourseTagsForTk,
  fetchListTkCourses,
  fetchSearchCourseByCourseId,
  fetchDeleteTkCourseByCourseId,
  fetchCopyCourse,
  fetchModifyUplownStatus,
  fetchModifyFinanceCompliance,
  fetchExportCourseExcelByCondition
} from '@/fetch/courseRecommendation'
import store from '@/store'
import router from '@/router'
import { CopyObj, getCurriculumTree, addAllowKeepAlive, hintFrame } from '@/util/utils'
import { useBaseDatas } from '@/views/CourseRecommendation/hooks/useBaseDatas'
import { Message } from 'element-ui'
import CkeckApprovalRecord from '@/components/chunk/CkeckApprovalRecord'
import PushDialog from '../components/PushDialog'
const { orgData, tagsMap } = useBaseDatas()

// 数据初始化
const queryFormDataInt = () => {
  return {
    courseName: '',
    keyword: '',
    courseClassify: [],
    courseTagIds: [],
    blgOrg: '',
    source: '',
    teacherUm: '',
    isFinanceCompliance: '',
    upBy: '',
    downBy: '',
    daterange: [],
    difficultyLevel: '',
    coursewareType: '',
    status: '',
    eoaStatus: '',
    currPage: 1,
    pageSize: 10,
    total: 0
  }
}

const queryForm = ref(queryFormDataInt())
const tagOptions = ref([])
getCurriculumTree(2, store.state.userInfo.blgStripLine, 1, APISelectCourseTagsForTk).then((data) => {
  tagOptions.value = data
})
const courseClassifyOptions = ref([])
getCurriculumTree(1, store.state.userInfo.blgStripLine, 1, APISelectCourseTagsForTk).then((data) => {
  courseClassifyOptions.value = data
})
const orgOptions = orgData
const handleCascader = () => {}
const tableFilterSetting = (key, list, multiple = false) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}
const columns = [
  { slot: 'courseName' },
  { label: '课程id', width: '90', prop: 'courseId' },
  { label: '课程系列', width: '90', prop: 'courseClassifyName' },
  { label: '课程来源', width: '90', prop: 'source' },
  { label: '第三方课程id', width: '100', prop: 'thirdCourseId' },
  { label: '课程属主部门', width: '110', prop: 'blgOrgName' },
  { label: '适用对象', width: '90', prop: 'courseApply' },
  {
    label: '课程标签',
    prop: 'courseTag',
    formatter: (row) => {
      return row.courseTag
        ?.split(',')
        .map((v) => tagsMap.get(v)?.tagName || '-')
        .join(', ')
    }
  },
  {
    label: '是否纳入理财合规课程',
    width: '140',
    prop: 'isFinanceCompliance',
    formatter: (row) => yesOrNoMap.find((item) => item.value === row.isFinanceCompliance)?.label
  },
  {
    label: '课程难易程度',
    prop: 'difficultyLevel',
    width: '110',
    ...tableFilterSetting('difficultyLevel', difficultEasyOptions)
  },
  {
    label: '课程类型',
    prop: 'coursewareType',
    width: '90',
    ...tableFilterSetting('coursewareType', courseTypeOptions)
  },
  { label: '课程时长', prop: 'duration', width: '80' },
  { label: '授课讲师', prop: 'teacherName', width: '90' },
  { label: '课程研发人', prop: 'developerName', width: '90' },
  {
    label: '课程状态',
    prop: 'status',
    width: '90',
    formatter: (row) => row.statusName,
    ...tableFilterSetting('status', curriculumStatusOptions)
  },
  { label: '上架人', prop: 'upBy', width: '100' },
  { label: '实际上架时间', prop: 'realUpTime', width: '150' },
  { label: '下架人', prop: 'downBy', width: '100' },
  { label: '实际下架时间', prop: 'realDownTime', width: '150' },
  {
    label: '审批状态',
    prop: 'eoaStatus',
    width: '90',
    formatter: (row) => row.eoaStatusName,
    ...tableFilterSetting('eoaStatus', approvalStatusOptions)
  }
]
const tableList = ref([])

// table edit methods
const openChangePage = async (row) => {
  const data = { courseId: row.courseId }
  const params = await fetchSearchCourseByCourseId({ data })
  addAllowKeepAlive('/CRNewCourse')
  router.push({
    name: '新增课程',
    params: { ...params, state: 'edit' }
  })
}

const removeCourse = async (row) => {
  await hintFrame('是否确认删除？')
  const data = { courseIds: [row.courseId] }
  await fetchDeleteTkCourseByCourseId({ data })
  Message.success('删除成功')
  getList()
}

let isSenddingCopy = false
const copyCourse = async (row) => {
  if (isSenddingCopy) return
  isSenddingCopy = true
  const data = { courseId: row.courseId }
  fetchCopyCourse({ data })
    .then(() => {
      Message.success('复制成功')
      getList()
    })
    .finally(() => {
      isSenddingCopy = false
    })
}
const putawayHandle = async (row) => {
  const data = { courseId: row.courseId }
  await fetchModifyUplownStatus({ data, isUpCourse: YES_STATUS })
  Message.success('上架成功')
  getList()
}
const soldOutHandle = async (row) => {
  const data = { courseId: row.courseId }
  await fetchModifyUplownStatus({ data, isUpCourse: NO_STATUS })
  Message.success('下架成功')
  getList()
}

// 推送
const showPushDialog = ref(false)
const pushInfo = ref({})
const pushType = PUSH_TYPE['course']
const openPushDialog = (row) => {
  showPushDialog.value = true
  pushInfo.value = {
    ...row,
    businessId: row.courseId,
    businessType: pushType
  }
}
const closePushDialog = (flag) => {
  showPushDialog.value = false
  if (flag) getList()
}

const eoaStatusObj = ref({})
const checkEoaStatus = (row) => {
  const { taskId } = row
  eoaStatusObj.value = { taskId }
}
const setFinanceComplianceHandle = async (row) => {
  await hintFrame(`确定纳入理财合规课程?`)
  const { courseId } = row
  const data = { courseId, isFinanceCompliance: YES_STATUS }
  await fetchModifyFinanceCompliance(data)
  Message.success('操作成功')
  getList()
}
const cancelFinanceCompliance = async (row) => {
  await hintFrame(`确定取消理财合规课程?`)
  const { courseId } = row
  const data = { courseId, isFinanceCompliance: NO_STATUS }
  await fetchModifyFinanceCompliance(data)
  Message.success('已取消')
  getList()
}
// 操作相关数据map
const tableEditInfo = [
  { label: '修改', value: 'edit', handler: openChangePage },
  { label: '删除', value: 'remove', handler: removeCourse },
  { label: '复制课程', value: 'copy', handler: copyCourse },
  { label: '上架', value: 'putaway', handler: putawayHandle },
  { label: '下架', value: 'soldOut', handler: soldOutHandle },
  { label: '推送', value: 'push', handler: openPushDialog },
  { label: '查看审批记录', value: 'checkEoaStatus', handler: checkEoaStatus },
  { label: '纳入理财合规课程', value: 'setFinanceCompliance', handler: setFinanceComplianceHandle },
  { label: '取消纳入理财合规课程', value: 'cacelFinanceCompliance', handler: cancelFinanceCompliance }
]

// 操作相关状态属性
const validateStatusMap = (row, type) => {
  switch (type) {
    case 'edit':
    case 'remove':
      return row.eoaStatus !== EOA_WAITTING
    case 'putaway':
      return (
        (row.eoaStatus !== EOA_WAITTING && row.eoaStatus !== EOA_DONE && row.eoaStatus !== EOA_BACK) ||
        (row.eoaStatus === EOA_DONE && row.status === EOA_DONE)
      )
    case 'soldOut':
      return row.eoaStatus !== EOA_WAITTING && row.eoaStatus !== EOA_BACK && row.status === EOA_WAITTING
    case 'push':
      return row.eoaStatus === EOA_DONE && row.status === EOA_WAITTING
    case 'copy':
      return true
    case 'checkEoaStatus':
      return row.taskId
    case 'setFinanceCompliance':
      return row.isFinanceCompliance === NO_STATUS
    case 'cacelFinanceCompliance':
      return row.isFinanceCompliance === YES_STATUS
  }
}

const _formatParams = (params) => {
  const data = CopyObj(params)
  data.courseClassify = data.courseClassify.slice(-1)[0] || ''
  data.courseTagIds = data.courseTagIds.map((v) => (Array.isArray(v) ? v.slice(-1)[0] : v))
  data.upTime = data.daterange[0]
  data.planDownTime = data.daterange[1]
  Reflect.deleteProperty(data, 'daterange')
  console.log(data, '====>')
  return data
}
const getList = async () => {
  const data = _formatParams(unref(queryForm))
  const { list, total } = await fetchListTkCourses({ data })
  queryForm.value.total = total
  tableList.value = list
}

const query = () => {
  queryForm.value.currPage = 1
  getList()
}
// onMounted(() => {
//   query()
// })
onActivated(() => {
  query()
})
const reset = () => {
  queryForm.value = queryFormDataInt()
  query()
}
const addHandle = () => {
  addAllowKeepAlive('/CRNewCourse')
  router.push({ name: '新增课程', params: { state: 'add' } })
}
const exportHandle = async () => {
  const data = _formatParams(unref(queryForm))
  await fetchExportCourseExcelByCondition({ data })
}
const gotoPreview = async (row) => {
  const data = { courseId: row.courseId }
  const params = await fetchSearchCourseByCourseId({ data })
  addAllowKeepAlive('/CRPreviewCourse')
  router.push({ name: '课程详情', params })
}
</script>
<script>
export default {
  name: 'CRCurriculumManagement'
}
</script>
<style lang="scss" scoped>
.over-style {
  width: 100%;
  padding: 0 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
