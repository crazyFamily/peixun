<template>
  <div class="learningAnalysis">
    <div class="nav">
      <div class="fg">
        <img src="@/assets/svg/line.svg" alt="" />
      </div>
      <div class="title">学习分析</div>
    </div>
    <div class="entry">
      <el-tabs v-model="currentName" class="entry-tabs" @tab-click="changeTabs">
        <el-tab-pane v-for="(item, index) in tabPanneList" :key="index" :label="item.label" :name="item.value">
          <div slot="label">
            {{ item.label }}
            <el-tooltip v-if="item.value === TRAINING_CLASS" effect="light"
              ><i class="el-icon-question active"></i>
              <div slot="content">注：由班主任操作结训后的培训班才会纳入统计</div>
            </el-tooltip>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-button type="primary" class="export-detial" @click="handleExport">导出全部明细</el-button>
    </div>
    <div class="content" :class="{'empty-content': emptyContent}">
      <template v-if="!emptyContent">
        <MoreRecentLearning
          v-loading="isListLoadig"
          v-bind="{
            list: recordList,
            learningTotalInfo,
            currentYear,
            currentTabInfo
          }"
          :um-id="umId"
        ></MoreRecentLearning>
        <AnnualLearningView
          v-loading="isListLoadig"
          :trainingInfoList="trainingInfoList"
          :sumUnitTitle="currentTabInfo.sumUnitTitle"
          :um-id="umId"
        ></AnnualLearningView>
        <div class="word-cloud-wrapper"></div>
        <!-- <div class="word-cloud-wrapper">
          <div class="content-title">课程关键词</div>
          <div class="content-container chart-wrapper" style="width: 100%;">
            <Charts
              chart-type="wordCloud"
              :chart-data="[
                { dataLabel: '测试数据'+Date.now(), value: 10 },
                { dataLabel: '测试数据'+Date.now(), value: 1 },
                { dataLabel: '测试数据'+Date.now(), value: 2 },
                { dataLabel: '测试数据'+Date.now(), value: 10 },
                { dataLabel: '测试数据'+Date.now(), value: 50 },
                { dataLabel: '测试数据'+Date.now(), value: 19 },
                { dataLabel: '测试数据'+Date.now(), value: 10 },
                { dataLabel: '测试数据'+Date.now(), value: 10 },
                { dataLabel: '测试数据'+Date.now(), value: 10 },
                { dataLabel: '测试数据'+Date.now(), value: 10 },
              ]"
              :colors="wordCloudColors"
              ref="wordCloudRef"
            ></Charts>
          </div>
        </div> -->
      </template>
      <div v-else class="no_data">
        <img src="@/assets/images/no-data.png" alt="" />
        <p>暂无内容</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import Charts from '@/components/charts/index.vue'
import MoreRecentLearning from './MoreRecentLearning.vue'
import AnnualLearningView from './AnnualLearningView.vue'
import { STUDYTYPES as tabPanneList, TRAINING_CLASS } from '../../enum'
import { fetchListTrainingInfo, fetchListStudyRecord, fetchListStudyRecordExport } from '@/fetch/learningProfiles'
import { YEARMAPING } from '../../enum'
import store from '@/store'
const props = defineProps({
  umId: {
    type: String,
    required: true
  },
  currentYear: {
    type: String,
    default: ''
  }
})
const currentName = ref(tabPanneList[0].value)
const currentTabInfo = ref(tabPanneList[0])
const changeTabs = (val) => {
  currentTabInfo.value = tabPanneList.find((v) => v.value === val.name)
  getListStudyRecord()
  getListTrainingInfo()
}
const reverse = ref(true)
const recordList = ref([])
const emptyContent = ref(false)
const isListLoadig = ref(false)
const getListStudyRecord = async () => {
  isListLoadig.value = true
  const res = await fetchListStudyRecord({
    data: { umId: props.umId, calYear: props.currentYear, studyTypeList: [currentTabInfo.value.studyType], currPage: 1, pageSize: 10 }
  })
  isListLoadig.value = false
  emptyContent.value = res && res.list && res.list.length ? false : true
  recordList.value = res?.list.slice(0, 3) || []
}
const learningTotalInfo = ref({})
const trainingInfoList = ref([])
watch(
  () => props.currentYear,
  () => {
    getListStudyRecord()
    getListTrainingInfo()
  }
)
// 获取年度参训情况
const getListTrainingInfo = async () => {
  const res = await fetchListTrainingInfo({
    data: { calYear: props.currentYear, studyType: currentTabInfo.value.studyType, umId: props.umId }
  })
  const { totalCount, totalHour } = res || {}
  learningTotalInfo.value = {
    totalCount,
    totalHour
  }
  trainingInfoList.value = YEARMAPING.map((v, i) => {
    const { totalCount = 0, totalHour = 0 } =
      res?.trainingInfoList?.find((m) => m.calMonth?.split('-')[1] === (i + 1).toString().padStart(2, '0')) || {}
    return {
      totalCount,
      totalHour
    }
  })
}

const wordCloudRef = ref(null)
// 更新图表
watch(
  () => store.getters['app/getAsideCollapse'],
  (n) => {
    wordCloudRef.value?.updateChart()
  }
)

// TODO: 把返回数据由大小到拆分10份，以#000的透明度从100%-10%进行顺序递减
const wordCloudColors = ({ value }) => {
  return 'red'
}

const handleExport = () => {
  const data = {
    // org: '',
    // time: '',
    // orgIds: [],
    // startMonth: `${props.currentYear}01`,
    // endMonth: `${props.currentYear}12`,
    // users: [{ umId: props.umId }],
    calYear: props.currentYear,
    umId: props.umId,
  }
  fetchListStudyRecordExport({ data })
}
</script>

<script>
export default {
  name: 'LearningAnalysis'
}
</script>
<style lang="scss" scoped>
.learningAnalysis {
  background-color: #fff;
  margin-top: 9px;
  overflow-y: auto;
  box-shadow: 0px 2px 5px 0px rgba(188, 188, 188, 0.08);
  border-radius: 2px;
  padding-top: 19px;
  .nav {
    margin-left: 24px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    .title {
      font-family: 'PingFangSC-Medium', arial;
      font-size: 18px;
      margin-left: 8px;
      color: #000000;
      font-weight: 500;
    }
  }
  .entry {
    display: flex;
    margin: 4px 22px 4px 30px;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 5px 0px rgba(188, 188, 188, 0.08);
    .entry-tabs {
      flex: 1;
      :deep(.el-tabs__header) {
        margin: 0;
        padding-left: 0 !important;
        border-bottom: 0 none;
      }
    }
    .export-detial {
      width: timelinepx;
      height: 30px;
    }
  }
  .content {
    // display: flex;
    flex-wrap: nowrap;
    padding-top: 30px;
    margin-bottom: 30px;
    display: grid;
    flex-wrap: nowrap;
    grid-template-columns: repeat(3, 1fr);

    &.empty-content {
      display: flex;
      justify-content: center;
    }

    .content-title {
      margin-bottom: 24px;
      font-family: 'PingFangSC-Medium', arial;
      font-size: 14px;
      color: #000000;
      line-height: 20px;
      font-weight: 500;
    }
    .no_data {
      margin-bottom: 10px;
      img {
        margin-top: 0;
        width: 200px;
      }
      p {
        margin-top: 12px;
      }
    }
  }

  .word-cloud-wrapper {
    flex: 1;
    // min-width: 359px;
    // width: 359px; 
    // margin-right: 30px;
    min-width: 389px;
    background-color: #fff;
    margin-left: 83px;
    height: 262px;
  }
  .word-cloud-wrapper .chart-wrapper {
    height: calc(100% - 44px);
    overflow: hidden;
    background: #F5F6FB;
    border-radius: 2px;
  }
}
</style>