<template>
  <div class="course-wrapper" v-loading="isListLoading">
    <div v-show="!isShowReportView">
      <template v-if="isNoEmpty">
        <div class="drop-container" ref="dropContainerRef">
          <div class="communicate-container" v-for="(subject, index) in subjectList" :key="subject.subjectId" :data-id="subject.subjectId">
            <!-- <i class="el-icon-rank drop drag-tag icon-drop"></i> -->
            <div class="drop drag-tag drop-icon-container">
              <img src="@/assets/svg/drop-icon.svg" alt="" />
            </div>
            <div class="top-bar">
              <p class="title">{{`交流${toChinesNum(index+1)}`}}</p>
              <p class="status" :class="{'online': subject.publishStatus === MIXINS_COMMUNICATE_ON, 'offline': subject.publishStatus === MIXINS_COMMUNICATE_OFF}">{{subject.publishStatusDesc}}</p>
            </div>
            <pre class="content">{{subject.subjectContent}}</pre>
            <div class="footer-bar">
              <div class="control-container">
                <template v-if="subject.publishStatus === MIXINS_COMMUNICATE_ON">
                  <el-button class="w-80 h-30" @click="handleOffLine(subject)">下架</el-button>
                </template>
                <template v-if="subject.publishStatus === MIXINS_COMMUNICATE_OFF">
                  <el-button class="w-80 h-30" @click="handleOnLine(subject)">发布</el-button>
                </template>
                <el-button class="w-80 h-30" @click="handleEdit(subject, index)">编辑</el-button>
                <el-button class="w-80 h-30" @click="handleReport(subject, index)">报表</el-button>
                <el-button class="w-80 h-30" @click="handleRemove(subject)">删除</el-button>
              </div>
              <div class="info-container">
                <span class="item">{{subject.updatedByName}} 发布于{{subject.updatedDate}}</span>
                <span class="item like">点赞 {{subject.likeCount}}</span>
                <span class="item comment">评论 {{subject.commentCount}}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="no_data">
          <img class="no-data-img" src="@/assets/images/no-data.png" alt="" />
          <p>暂未添加交流内容，请选择新增交流添加内容</p>
        </div>
      </template>
      
      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="add-button-style" @click="handleCreate">
          <i class="add-icon"></i> 新增交流
        </el-button>
      </div>
    </div>
    <!-- 创建/编辑弹窗 -->
    <MixinsAddCommunicate :title="editTitle" :show.sync="isShowAddView" :business-id="businessId" :subject-info="currentRowInfo.subject" @save="handleSaveAddCommunicate"></MixinsAddCommunicate>
    <MixinsCommunicateReport :show.sync="isShowReportView" :business-id="businessId" :subject-info="currentRowInfo.subject" @close="closeReport"></MixinsCommunicateReport>

  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from 'vue'
import { customHint, getLoadingStatus, toChinesNum } from '@/util/utils'
import { fetchDeleteCommunicateSubject, fetchListCommunicateSubject, fetchQueryWhiteList, fetchUpdateCommunicateSubjectSortNo, fetchUpOrDownCommunicateSubject } from '@/fetch/establish'
import { MIXINS_COMMUNICATE_OFF, MIXINS_COMMUNICATE_ON, MIXINS_SUBJECT_TYPE_CLASS } from '@/views/Establish/enum'
import { Message } from 'element-ui'
import Sortable from 'sortablejs'
import MixinsAddCommunicate from './MixinsAddCommunicate.vue'
import MixinsCommunicateReport from './MixinsCommunicateReport.vue'
import store from '@/store'


const props = defineProps({
  businessId: {
    type: String,
    required: true
  }
})

const isNoEmpty = ref(true)

const baseParams = {
  businessId: props.businessId,
  subjectType: MIXINS_SUBJECT_TYPE_CLASS
}

const subjectList = ref([])
const getList = async () => {
  const data = baseParams
  const list = await fetchListCommunicateSubject({ data })
  subjectList.value = list
  isNoEmpty.value = Boolean(subjectList.value.length)
  store.dispatch('establish/getMixinsCountAsync', props.businessId)
}
const query = () => {
  getList()
}
query()

const closeReport=()=>{
  console.log('close-report')
  isShowReportView.value = false
}
const isListLoading = computed(() => {
  return getLoadingStatus('LOADING_COMMUNICATE_SUBJECT_DETAIL') ||
  getLoadingStatus('LOADING_UPDATE_COMMUNICATE_SUBJECT_SORT_NO') ||
  getLoadingStatus('LOADING_UP_DOWN_COMMUNICATE_SUBJECT') ||
  getLoadingStatus('LOADING_DELETE_COMMUNICATE_SUBJECT') || 
  getLoadingStatus('LOADING_LIST_COMMUNICATE_SUBJECT')
})

const handleRemove = async (row) => {
  await customHint('学员发表的内容将全部删除，无法恢复，请确认！', '请确认', '取消')
  const data = {
    businessId: props.businessId,
    subjectId: row.subjectId,
    subjectType: MIXINS_SUBJECT_TYPE_CLASS
  }
  await fetchDeleteCommunicateSubject({ data })
  Message.success('已删除')
  query()
}

const handleOffLine = async (row) => {
  const data = {
    businessId: props.businessId,
    subjectId: row.subjectId,
    subjectType: MIXINS_SUBJECT_TYPE_CLASS,
    publishStatus: MIXINS_COMMUNICATE_OFF,
  }
  await fetchUpOrDownCommunicateSubject({data})
  Message.success('已下架')
  query()
}
const handleOnLine = async (row) => {
  const data = {
    businessId: props.businessId,
    subjectId: row.subjectId,
    subjectType: MIXINS_SUBJECT_TYPE_CLASS,
    publishStatus: MIXINS_COMMUNICATE_ON
  }
  await fetchUpOrDownCommunicateSubject({data})
  Message.success('已上架')
  query()
}

const currentSubjectId = ref()
const currentRowInfo = reactive({
  subject: {},
  index: -1
})

const handleEdit = async (row, index) => {
  currentSubjectId.value = row.subjectId
  currentRowInfo.subject = row
  currentRowInfo.index = index
  isShowAddView.value = true
}
const handleReport = async (row,index)=>{
  currentSubjectId.value = row.subjectId
  currentRowInfo.subject = row
  currentRowInfo.index = index
  isShowReportView.value = true;
}
const resetCurrentSubject = () => {
  currentRowInfo.subject = {}
  currentRowInfo.index = -1
}
const isShowAddView = ref(false)
const isShowReportView = ref(false)
const handleCreate = () => {
  resetCurrentSubject()
  console.log(currentRowInfo);
  currentSubjectId.value = ''
  isShowAddView.value = true
}


// 拖拽初始化
const dropContainerRef = ref(null)
let sortableInt = null
const initSortable = (onEndCallback) => {
  sortableInt = new Sortable(dropContainerRef.value, {
    handle: '.drag-tag',
    dataIdAttr: 'data-id',
    animation: 150,
    onEnd(event) {
      onEndCallback && onEndCallback(sortableInt.toArray())
    }
  })
}

// 拖拽结束，触发回调，原因数列根据返回的数列进行排弃调整
const dropEndSortList = (result) => {
  const subjectMap = subjectList.value.reduce((prevValue, currentVaue) => {
    prevValue[currentVaue.subjectId] = currentVaue
    return prevValue
  }, {})
  subjectList.value = result.map(row => subjectMap[row])
  saveSortResult()
}

// 保存排序结果
const saveSortResult = async () => {
  const data = subjectList.value.map((row, i) => ({
    businessId: props.businessId,
    subjectId: row.subjectId,
    subjectType: MIXINS_SUBJECT_TYPE_CLASS,
    sortNo: i
  }))
  await fetchUpdateCommunicateSubjectSortNo({data})
  query()
}

const emit = defineEmits(['change'])

const showTitle = (index) => {
  return `交流${toChinesNum(index+1)}`
}

const editTitle = computed(() => {
  if( currentRowInfo.index === -1 ) return '新增交流'
  return showTitle(currentRowInfo.index)
})

onMounted(() => {
  initSortable(dropEndSortList)
})

const handleSaveAddCommunicate = () => {
  query()
}

</script>
<script>
export default {
  name: "MixinsCommunicate"
}
</script>

<style lang='scss' scoped>
@import '@/views/Establish/TrainingCourseManagement/MixinsTraining/components/stylesheets/mixins-public.scss';
.course-wrapper {
  height: 100%;
  overflow-y: auto;
  position: relative;
}
.communicate-container {
  background: #fff;
  padding: 20px;
  padding-left: 30px;
  margin-bottom: 10px;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
  .icon-drop {
    padding: 5px;
    position: absolute;
    top: 0;
    left: 0px;
    cursor: pointer;
  }
  .top-bar {
    padding: 0;
    display: flex;
    justify-content: space-between;

    .status {
      padding: 5px 10px;
      height: 22px;
      line-height: 22px;
      display: inline-block;
      padding: 0 10px;
      border-radius: 2px;

      &.online {
        color: #12BA8D;
        background-color: #E9FBF3;
      }
      &.offline {
        color: #999999;
        background-color: #F5F5F5;
      }
    }
  }
  .title { 
    font-size: 16px;
    font-weight: 500;
  }
  .content {
    margin: 10px 0;
    text-align: justify;
    white-space: pre;
    font-size: 14px;
    opacity: 0.6;
    // white-space: nowrap; //不换行
    overflow: hidden; //隐藏溢出
    text-overflow: ellipsis; //省略号
    display: -webkit-box; //-webkit-box是兼容IOS和老版本Android浏览器的方式
    -webkit-line-clamp: 3; //限制行数
    -webkit-box-orient: vertical; //垂直方向排列
  }

  .footer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .info-container {
    .item {
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.4);
      padding: 0 10px;
    }
  }
}

.footer-box {
  bottom: 0;
}

.drop-icon-container {
  height: 100%;
  margin: 0 5px;
  padding: 25px 0;
  // display: flex;
  // align-items: center;
  position: absolute;
  left: 5px;
  top: 0;
  cursor: move;
}

.add-button-style {
  width: 120px;
  height: 36px;
  font-size: 14px !important;
  font-weight: unset;
  border-color: #fd6720 !important;
  background: #fff !important;
  color: #fd6720 !important;
  border-radius: 2px !important;
  
  .add-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    background-color: #FD6720;
    vertical-align: sub;
    position: relative;
  
    @mixin v-icon() {
      background-color: #fff;
      position: absolute;
      left: 0;
      right: 0;
      margin-left: auto;
      margin-right: auto;
      top: 50%;
      transform: translateY(-50%);
    }
  
    &::after {
      content: '';
      width: 50%;
      height: 2px;
      @include v-icon();
    }
    &::before {
      content: '';
      width: 2px;
      height: 50%;
      @include v-icon();
    }
  }
}

.no_data {
  height: calc(100vh - 226px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .no-data-img {
    margin-top: 0;
    width: 128px;
  }

  p {
    font-size: 14px;
    margin-top: 30px;
  }
}

</style>
