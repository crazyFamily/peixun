<template>
  <div class="dashboard-wrapper" :class="{ohide: isLoading}" v-loading="isLoading">
    <template v-if="!dashboardMonths.length">
      <div class="no_data">
        <img src="@/assets/images/no-data.png" alt="" />
        <p>暂无数据</p>
      </div>
    </template>
    <template v-else>
      <el-card class="topbar">
      <p class="status-tip">
        状态: 
        <template v-if="dataDashboardInfo.status === MONTHLY_DASHBOARD_STATUE_SUBMIT"><span class="green">已发布</span></template>
        <template v-else><span>未发布</span></template>
      </p>
      <div class="date-wrapper">
        <DateSwitch v-if="dashboardMonths.length" :months="dashboardMonths" @change="handleDateChange"></DateSwitch>
      </div>
      <div class="control-wrapper">
        <!-- 只有管理才有全权限，不然只能生成海报 -->
        <template v-if="isAdmin">
          <el-button class="item" :disabled="!isCanEdit" @click="setEditStatus">编辑</el-button>
          <template v-if="dataDashboardInfo.status === MONTHLY_DASHBOARD_STATUE_SUBMIT">
            <el-button class="item" :disabled="status === 'edit' || !isAdmin" @click="handleOffline">下架</el-button>
          </template>
          <template v-else>
            <el-button class="item" :disabled="status === 'edit'" @click="handleOnline">发布</el-button>
          </template>
        </template>
        <el-button class="item" :disabled="status === 'edit'" @click="handleExport">生成海报</el-button>
      </div>
    </el-card>
      <template v-if="status === 'edit'">
        <div class="main-wrapper edit">
          <div class="content-container">
            <div class="top-box">
              <div class="top-wrapper">
                <img class="dashboard-top-bg" src="@/assets/images/monthly-plan/top-bg.png" alt="" />
                <div class="info-container">
                  <el-input class="title-wrapper-input" v-model="editorDashboardInfo.title"></el-input>
                  <p class="date-wrapper">{{ dataDashboardInfo.planMonthName }}</p>
                </div>
                <div class="icon-wrapper">
                  <img class="icon-tip" src="@/assets/images/monthly-plan/monthly-plan-dashboard-calendar.png" alt="" />
                </div>
              </div>
            </div>
            <div style="padding: 0 20px;">
             <!-- 内容 -->
              <BaseWrapper hidden-title>
                <GcEditor @change="handleChangeContent" :content-text="editorContent" width="100%"></GcEditor>
              </BaseWrapper>

              <!-- 计划概述 -->
              <BaseWrapper :title.sync="editorDashboardInfo.overviewTitle" edit>
                <GcEditor @change="handleChangeOverview" :content-text="editorOverview" width="100%" style="margin-top: 20px"></GcEditor>
              </BaseWrapper>

              <!-- 培训计划概览 -->
              <BaseWrapper :title.sync="editorDashboardInfo.planTitleOne" edit>
                <PlanDescTable :tableList="dataDashboardInfo.branchPlans"></PlanDescTable>
              </BaseWrapper>

              <!-- 培训计划概览 -->
              <BaseWrapper :title.sync="editorDashboardInfo.planTitleTwo" edit>
                <PlanDescTable :tableList="dataDashboardInfo.nonBranchPlans"></PlanDescTable>
              </BaseWrapper>

              <!-- 说明 -->
              <BaseWrapper hidden-title>
                <GcEditor @change="handleChangeRemark" :content-text="editorRemark" width="100%"></GcEditor>
              </BaseWrapper>
            </div>
          </div>
        </div>
        <!-- 底部按钮 -->
        <div class="footer-box dfc">
          <el-button class="button-w80-h30" @click="handleCancel">取消</el-button>
          <el-button class="button-w80-h30" type="primary" @click="submit">保存</el-button>
        </div>
      </template>
      <template v-if="status === 'view'">
        <div class="main-wrapper" ref="viewDomRef" :class="{full: isExporting}">
          <div class="content-container">
            <div class="top-box">
              <div class="top-wrapper">
                <img class="dashboard-top-bg" src="@/assets/images/monthly-plan/top-bg.png" alt="" />
                <div class="info-container">
                  <p class="title-wrapper">{{ dataDashboardInfo.title }}</p>
                  <p class="date-wrapper">{{ dataDashboardInfo.planMonthName }}</p>
                </div>
              </div>
            </div>

            <div class="detail-wrapper">
            <BaseWrapper v-show="dataDashboardInfo.content">
                <EditorViewContainer>
                  <div class="content-wrapper" v-html="dataDashboardInfo.content"></div>
                </EditorViewContainer>
              </BaseWrapper>

              <!-- 计划概述 -->
              <BaseWrapper :title="dataDashboardInfo.overviewTitle" v-show="dataDashboardInfo.overview">
                <EditorViewContainer>
                  <div class="content-wrapper" v-html="dataDashboardInfo.overview"></div>
                </EditorViewContainer>
              </BaseWrapper>

              <!-- 培训计划概览 -->
              <BaseWrapper :title="dataDashboardInfo.planTitleOne">
                <PlanDescTable PlanDescTable :tableList="dataDashboardInfo.branchPlans"></PlanDescTable>
              </BaseWrapper>

              <!-- 培训计划概览 -->
              <BaseWrapper :title="dataDashboardInfo.planTitleTwo">
                <PlanDescTable PlanDescTable :tableList="dataDashboardInfo.nonBranchPlans"></PlanDescTable>
              </BaseWrapper>

              <!-- 说明 -->
              <BaseWrapper v-show="dataDashboardInfo.remark">
                <EditorViewContainer>
                  <div class="content-wrapper" v-html="dataDashboardInfo.remark"></div>
                </EditorViewContainer>
              </BaseWrapper>
            </div>

          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import 'wangeditor/src/assets/style/common.less'
import 'wangeditor/src/assets/style/text.less'
import { computed, onMounted, onUnmounted, reactive, ref, nextTick } from 'vue'
import BaseWrapper from './components/BaseWrapper.vue'
import GcEditor from '@/components/editor'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import {
  MONTHLY_DASHBOARD_STATUE_SOLDOUT,
  MONTHLY_DASHBOARD_STATUE_SUBMIT,
  MONTHLY_DASHBOARD_STATUE_UNSUBMIT,
  MONTHLY_OFF_LINE,
  MONTHLY_ON_LINE
} from '../enum'
import DateSwitch from './components/DateSwitch.vue'
import {
  fetchSaveMonthPlanPoster,
  fetchSelectMonthPlanPoster,
  fetchSelectPlanMonthAndAuthority,
  fetchUpdatePlanPosterStatus
} from '@/fetch/planManagement'
import html2canvas from 'html2canvas'
import { CopyObj } from '@/plugins/until'
import { Message } from 'element-ui'
import { customHint, getLoadingStatus } from '@/util/utils'
import PlanDescTable from './components/PlanDescTable.vue'
import EditorViewContainer from '@/components/editor/EditorViewContainer.vue'

const { mergeReactive } = useBaseDataEvents()
const status = ref('view')
const isReleased = computed(() => true)
const backgroundRef = ref(null)
const backgroundOffsetHeight = ref(0)
const handleBgLoad = () => {}

const handleBgResize = () => {}

// 创建一个监听器
const ob = new ResizeObserver((entries) => {
  for (let entry of entries) {
    backgroundOffsetHeight.value = entry.target.offsetHeight * 0.37
  }
})

onMounted(() => {
  setTimeout(() => {
    backgroundRef.value && ob.observe(backgroundRef.value)
  }, 300)
})

onUnmounted(() => {
  backgroundRef.value && ob.unobserve(backgroundRef.value)
})

const dashboardMonths = ref([])
// 拉取月度信息
const isAdmin = ref(true)
const getMonthsInfo = async () => {
  const { monthList, isAdmin:admin } = await fetchSelectPlanMonthAndAuthority()
  isAdmin.value = admin === 'Y'
  // 普通用户只允许看已发布的看板
  if(isAdmin.value) {
    dashboardMonths.value = monthList
  } else {
    dashboardMonths.value = monthList.filter(row => row.status === MONTHLY_DASHBOARD_STATUE_SUBMIT)
  }
  if(!dashboardMonths.value.length) return
  initData(dashboardMonths.value[0] || {})
}
getMonthsInfo()

// 日期切换
const handleDateChange = (dateValue) => {
  initData(dateValue)
}

const baseParams = {
  planMonth: '',
  planMonthName: '',
  title: '大零售培训计划概览',
  content: '',
  overviewTitle: '计划概览',
  overview: '',
  planTitleOne: '培训计划概览（涉及分行参训）',
  branchPlans: [],
  planTitleTwo: '培训计划概览（不涉及分行参训）',
  nonBranchPlans: [],
  remark: '',
  status: MONTHLY_DASHBOARD_STATUE_UNSUBMIT
}
// 基础数据对像
const dataDashboardInfo = reactive(CopyObj(baseParams))

// 编辑数据对像
const editorDashboardInfo = reactive(CopyObj(baseParams))


const isCanEdit = computed(() => {
  if(!isAdmin.value) return false
  if(dataDashboardInfo.status === MONTHLY_DASHBOARD_STATUE_SUBMIT) return false
  if(status.value === 'edit') return false
  return true
})

// 获取看板数据
const getDetailInfo = async () => {
  const data = { planMonth: dataDashboardInfo.planMonth}
  const res = await fetchSelectMonthPlanPoster({ data })
  return res
}


const editorContent = ref(dataDashboardInfo.content)
const handleChangeContent = ({ content }) => {
  editorDashboardInfo.content = content
}

const editorOverview = ref(dataDashboardInfo.overview)
const handleChangeOverview = ({ content }) => {
  editorDashboardInfo.overview = content
}

const editorRemark = ref(dataDashboardInfo.remark)
const handleChangeRemark = ({ content }) => {
  editorDashboardInfo.remark = content
}

const initData = async (dateValue = {}) => {
  if (dateValue.planMonth && dateValue.planMonthName) {
    dataDashboardInfo.planMonth = dateValue.planMonth
    dataDashboardInfo.planMonthName = dateValue.planMonthName
    editorDashboardInfo.planMonth = dateValue.planMonth
    editorDashboardInfo.planMonthName = dateValue.planMonthName
  }
  const detailInfo = await getDetailInfo()
  mergeReactive({ origin: dataDashboardInfo, target: detailInfo })

  // null 是初始没被设置的值，用baseParams作替代
  Object.keys(dataDashboardInfo).forEach(key => {
    if(['planTitleOne', 'planTitleTwo'].includes(key)) {
      dataDashboardInfo[key] = dataDashboardInfo[key] === null ? `${dataDashboardInfo.planMonthName.split('年')[1]}${baseParams[key]}` : dataDashboardInfo[key]
    } else {
      dataDashboardInfo[key] = dataDashboardInfo[key] === null ? baseParams[key] : dataDashboardInfo[key]
    }
  }) 
  
  status.value = 'view'
}

const columns = [
  { label: '序号', type: 'index' },
  { slot: 'orgName' },
  { slot: 'classTypeName' },
  { slot: 'planClassName' },
  { slot: 'attendObject' },
  { slot: 'trainingModeDesc' },
  { slot: 'trainingDate' },
  { slot: 'executedStatus' }
]
const tableList = ref([])

// 设置默认值，主要用于编辑状态
const setEditDefaultInfo = (planMonth, planMonthName) => {
  const [year, month] = planMonthName.replace('年', '-').replace('月', '').split('-')
  const defaultInfo = {
    title: '大零售培训计划概览',
    overviewTitle: '计划概览',
    planTitleOne: `${month}月培训计划概览（涉及分行参训）`,
    planTitleTwo: `${month}月培训计划概览（涉及分行参训）`,
    content: `<p><b>大零售各单位：</b></p><p>&nbsp; &nbsp; &nbsp; 为及时同步培训信息、更有效地利用培训咨询、促进总分协同联动，根据${year}年大零售培训计划月度检视工作安排，现公示${month}月培训班计划<br/></p>`,
    overview: `<p><b>${month - 1 <= 0 ? 12 : month - 1}月计划检视</b>：总行&amp;片区${month - 1 <= 0 ? 12 : month - 1}月培训班计划......</p><p><b>${month}月计划计划</b>：总行&amp;片区${month}月培训班计划......</p>`,
    remark: `<p>说明：</p><p>&nbsp; &nbsp; &nbsp; &nbsp; 请输入内容，如删除所有内容，发布后将不显示此段文字<br/></p><p><br/></p><p><br/></p><p data-we-empty-p="" style="text-align:right;">总行零售训战</p><p data-we-empty-p="" style="text-align:right;">xxxx年xx月xx日</p>`
  }

  Object.keys(defaultInfo).forEach(key => {
    editorDashboardInfo[key] = editorDashboardInfo[key] || defaultInfo[key]
  })
  editorContent.value = editorDashboardInfo.content
  editorOverview.value = editorDashboardInfo.overview
  editorRemark.value = editorDashboardInfo.remark
}

const setEditStatus = () => {
  status.value = 'edit'
  nextTick(() => {
    mergeReactive({origin: editorDashboardInfo, target: dataDashboardInfo})
    // 设置默认值
    setEditDefaultInfo(dataDashboardInfo.planMonth, dataDashboardInfo.planMonthName)
  })
}

// 必填校验
const validatorSubmit = () => {
  if(!editorDashboardInfo.title) { 
    Message.warning('请填写标题') 
    return false
  }
  if(!editorDashboardInfo.overviewTitle) { 
    Message.warning('请填写计划概览标题') 
    return false
  }
  if(!editorDashboardInfo.overview) { 
    Message.warning('请填写计划概览内容') 
    return false
  }
  if(!editorDashboardInfo.planTitleOne) { 
    Message.warning('请填写标题') 
    return false
  }
  if(!editorDashboardInfo.planTitleTwo) { 
    Message.warning('请填写标题') 
    return false
  }
  return true
}

const submit = async () => {
  if(!validatorSubmit()) return
  mergeReactive({ origin: dataDashboardInfo, target: editorDashboardInfo })
  await fetchSaveMonthPlanPoster({ data: editorDashboardInfo })
  Message.success('保存成功')
  restData()
  initData()
}

const handleCancel = () => {
  status.value = 'view'
  restData()
}

// 置空富文本的内同，避免同文本无法触发watch
const restData = () => {
  editorContent.value = ''
  editorOverview.value = ''
  editorRemark.value = ''
}

// 发布
const handleOnline = async () => {
  customHint('是否确认发布看板', '提示', '取消')
  .then(async () => {
    const data = { planMonth: dataDashboardInfo.planMonth, status: MONTHLY_ON_LINE }
    await fetchUpdatePlanPosterStatus({ data })
    Message.success('发布成功')
    initData()
  })

}

// 下架
const handleOffline = async () => {
  const data = { planMonth: dataDashboardInfo.planMonth, status: MONTHLY_OFF_LINE }
  await fetchUpdatePlanPosterStatus({ data })
  Message.success('已下架')
  initData()
}

const isLoading = computed(() => {
  return isExporting.value || getLoadingStatus('LOADING_SELECT_MONTH_POSTER') || getLoadingStatus('LOADING_SELECT_PLAN_MONTH') || getLoadingStatus('LOADING_UPDATE_PLAN_POSTER')
})

// 生成海报
const viewDomRef = ref(null)
const isExporting = ref(false)
const handleExport = () => {
  isExporting.value = true
  setTimeout(() => {
    html2canvas(viewDomRef.value, {
      width: viewDomRef.value.offsetWidth,
      height: Math.max(viewDomRef.value.offsetHeight, viewDomRef.value.scrollHeight)
    }).then(function (canvas) {
      downloadImg(canvas.toDataURL('image/png'))
      isExporting.value = false
    })
  }, 300)
}

const downloadImg = (href) => {
  const a = document.createElement('a')
  a.setAttribute('download', `${dataDashboardInfo.planMonthName}大零售培训计划概览`)
  a.href = href
  a.click()
}
</script>
<script>
export default {
  name: 'MonthlyPlanDashboard'
}
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'pingan-nuancheng';
  src: url('../../../assets/fonts/PingAnNuanChengTi_bate21_Regular.woff') format('woff');
  font-weight: normal;
  font-display: 'auto';
  font-style: normal;
}
.dashboard-wrapper {
  min-width: 1290px;
  height: 100%;
  color: #4a4a4a;

  &.ohide {
    overflow: hidden;
  }
  
  .title-wrapper {
    height: 130px;
    font-family: 'pingan-nuancheng', 'PingFang SC', 'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
    font-size: 84px;
    color: #d1825e;
    display: flex;
    // align-items: center;
    overflow: hidden;
    margin-top: 10px;
  }

  .title-wrapper-input {
    :deep(.el-input__inner) {
      height: auto;
      font-size: 84px;
      color: #d1825e;
      background: transparent;
      border: 2px dashed #6e6e6e;
      font-family: 'pingan-nuancheng', 'PingFang SC', 'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
    }
  }

  .topbar {
    height: 50px;
    :deep(.el-card__body) {
      height: 100%;
      padding: 10px 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .topbar .control-wrapper {
    .item {
      width: 80px;
    }
  }

  .green {
    color: #00bdae;
  }

  .main-wrapper {
    background-color: #FCF1DD;
    // padding: 15px 35px;
    position: relative;
    margin-top: 10px;
    height: calc(100% - 65px);
    overflow-y: auto;

    &.full {
      height: auto;
    }

    &.edit {
      height: calc(100% - 65px - 70px);
    }

    .background {
      width: 100%;
      position: absolute;
      top: -15vh;
      left: 0;
      z-index: 0;
    }

    .content-container {
      width: 100%;
      position: relative;
      z-index: 1;
      background-color: #F0DCB6;
      .dashboard-logo {
        width: 100%;
        margin: 30px 0;
      }
     .top-box {
        margin-bottom: 20px;
      }
    }
  }

  .top-wrapper {
    display: flex;
    justify-content: space-between;
    position: relative;

    .info-container {
      max-width: 60%;
      position: absolute;
      width: 75%;
      top: 25%;
      left: 2%;
    }

    .icon-wrapper {
      width: 20%;
      max-width: 300px;
      margin-top: 20px;
      margin-right: 5%;
      margin-bottom: 25px;
    }

    .icon-tip {
      width: 100%;
    }

    .date-wrapper {
      width: 255px;
      margin-top: 2%;
      transform: translateX(10px);
      padding: 5px 0;
      font-size: 40px;
      color: #fff;
      background: #e6a485;
      border-radius: 30px;
      text-align: center;
    }
  }

  .message-title {
    font-size: 32px;
    color: #a72b19;
  }
  .info-message {
    font-size: 24px;
    margin-top: 18px;
  }

  .table-style {
    margin-top: 30px;
    :deep(thead th) {
      background-color: #f8dfb0 !important;
    }
    :deep(.cell) {
      color: #bd834b;
      font-size: 14px;
    }
    :deep(th:not(:first-child):before) {
      background: transparent;
    }

    :deep(.gc-table) {
      border: 1px solid transparent !important;
    }
  }

  .content-wrapper {
    font-size: 16px;
  }
}

.dashboard-footer {
  width: 320px;
  text-align: center;
  margin: 0 auto;
  font-size: 24px;
  color: #BA8169;
  font-weight: 400;
  .copyright {
    margin-bottom: 10px;
  }
}

.over-2-line {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.w-e-text-container {
  background-color: transparent;
}

.detail-wrapper {
  padding: 10px 20px;
  padding-top: 0;
}
</style>
