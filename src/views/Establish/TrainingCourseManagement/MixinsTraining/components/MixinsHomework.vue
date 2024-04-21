<template>
  <div class="course-wrapper" v-loading="isListLoading">

    <span id="copyUrlBtn" ref="copyBtnRef" :data-clipboard-text="copingUrl" @click="copy" style="display: none;">复制</span>
    
    <div v-show="!isShowReportView && !isShowAddView">
      <template v-if="isNoEmpty">
        <div class="drop-container" ref="dropContainerRef">
          <div class="communicate-container" v-for="(assignment, index) in homeworkList" :key="assignment.assignmentId" :data-id="assignment.assignmentId">
            <!-- <i class="el-icon-rank drop drag-tag icon-drop"></i> -->
            <div class="drop drag-tag drop-icon-container">
              <img src="@/assets/svg/drop-icon.svg" alt="" />
            </div>
            <div class="top-bar">
              <p class="title">{{assignment.assignmentTitle}}</p>
              <div class="progress-info"><span class="item comment">提交进度 {{assignment.completionRate}}</span>
              <p class="status" :class="{'online': assignment.publishStatus === MIXINS_COMMUNICATE_ON, 'offline': assignment.publishStatus === MIXINS_COMMUNICATE_OFF}">{{assignment.publishStatusDesc}}</p>
              </div>
            </div>
            <pre class="content" v-html="$xss(assignment.assignmentContent)"></pre>
            <div class="footer-bar">
              <div class="control-container">
                <template v-if="assignment.publishStatus === MIXINS_COMMUNICATE_ON">
                  <el-button class="w-80 h-30" @click="handleOffLine(assignment)">下架</el-button>
                </template>
                <template v-if="assignment.publishStatus === MIXINS_COMMUNICATE_OFF">
                  <el-button class="w-80 h-30" @click="handleOnLine(assignment)">发布</el-button>
                </template>
                <el-button class="w-80 h-30" @click="handleEdit(assignment, index)">编辑</el-button>
                <el-button class="w-80 h-30" @click="handleReport(assignment, index)">报表</el-button>
                <el-button class="w-80 h-30" @click="handleRemove(assignment)">删除</el-button>
                <el-button class="w-80 h-30" @click="handleCopy(assignment)">复制地址</el-button>
              </div>
              <div class="info-container">
                <span class="item">作业类型：{{ assignment.assignmentTypeStr }}</span>
                <span class="item">{{assignment.publishName}} 发布于{{assignment.publishDate}}</span>
                <span class="item like">提交截止时间 {{assignment.deadline || '无'}}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="no_data">
          <img class="no-data-img" src="@/assets/images/no-data.png" alt="" />
          <p>暂未添加作业内容，请选择新增作业添加内容</p>
        </div>
      </template>
      
      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="add-button-style" @click="handleCreate">
          <i class="add-icon"></i> 新增作业
        </el-button>
      </div>
    </div>
    <!-- 创建/编辑弹窗 -->
    <MixinsEditHomework :show.sync="isShowAddView" :business-id="businessId" :assignment-info="currentRowInfo.assignment" @close="closeEdit"></MixinsEditHomework>
    <MixinsHomeworkReport :show.sync="isShowReportView" :business-id="businessId" :assignment-info="currentRowInfo.assignment" @close="closeReport"></MixinsHomeworkReport>
  </div>
</template>

<script setup>

import { computed, onMounted, reactive, ref } from 'vue'
import { customHint, getLoadingStatus, toChinesNum } from '@/util/utils'
import { deleteAssignment, listAssignment, updateAssignmentSortNo, updateAssignmentPublishStatus } from '@/fetch/establish'
import { MIXINS_COMMUNICATE_OFF, MIXINS_COMMUNICATE_ON, MIXINS_SUBJECT_TYPE_CLASS } from '@/views/Establish/enum'
import { Message } from 'element-ui'
import Sortable from 'sortablejs'
import MixinsEditHomework from './MixinsEditHomework.vue'
import MixinsHomeworkReport from './MixinsHomeworkReport.vue'
import store from '@/store'

import Clipboard from 'clipboard'

const props = defineProps({
  businessId: {
    type: String,
    required: true
  }
})

const isNoEmpty = ref(true)
const baseParams = {
  businessId: props.businessId,
  businessType: MIXINS_SUBJECT_TYPE_CLASS
}

const homeworkList = ref([])
const getList = async () => {
  const data = baseParams
  const list = await listAssignment({ data })
  list.forEach(item=>{
    if(item.assignmentType==0){
      item.assignmentTypeStr = '文字作业'
    }
    if(item.assignmentType==1){
      item.assignmentTypeStr = '图文/视频作业'
    }
    if(item.assignmentType==2){
      item.assignmentTypeStr = '文档作业'
    }
  })
  homeworkList.value = list
  isNoEmpty.value = Boolean(homeworkList.value.length)
  store.dispatch('establish/getMixinsCountAsync', props.businessId)
}
const query = () => {
  getList()
}
query()
const closeEdit=()=>{
  isShowAddView.value = false
  query()
}
const closeReport=()=>{
  isShowReportView.value = false
  query()
}
const isListLoading = computed(() => {
  return getLoadingStatus('LOADING_LIST_ASSIGNMENT')
})

const handleRemove = async (row) => {
  await customHint('学员已提交的作业将全部删除，无法恢复，请确认！', '请确认', '取消')
  const data = {
    businessId: props.businessId,
    assignmentId: String(row.assignmentId),
    businessType: MIXINS_SUBJECT_TYPE_CLASS
  }
  await deleteAssignment({ data })
  Message.success('已删除')
  query()
}

//复制的地址
const copingUrl = ref('')
const copyBtnRef = ref(null)
const handleCopy = hw=>{//选择复制的作业
  copingUrl.value = window.location.origin+'/#/TrainingHomework?keep=true&assignmentId='+hw.assignmentId+'&businessId='+props.businessId+'&businessType='+MIXINS_SUBJECT_TYPE_CLASS
  setTimeout(_=>{
    copyBtnRef.value.click()
  },200)
}

const copy = _=> {
  const clipboard = new Clipboard('#copyUrlBtn')
  clipboard.on('success', e => {
    Message.success('复制成功')
    clipboard.destroy()
  })
  clipboard.on('error', e => {
    Message.warning('复制失败')
    clipboard.destroy()
  })
}
const handleOffLine = async (row) => {
  const data = {
    businessId: props.businessId,
    assignmentId: row.assignmentId,
    businessType: MIXINS_SUBJECT_TYPE_CLASS,
    publishStatus: MIXINS_COMMUNICATE_OFF,
  }
  await updateAssignmentPublishStatus({data})
  Message.success('已下架')
  query()
}
const handleOnLine = async (row) => {
  const data = {
    businessId: props.businessId,
    assignmentId: row.assignmentId,
    businessType: MIXINS_SUBJECT_TYPE_CLASS,
    publishStatus: MIXINS_COMMUNICATE_ON
  }
  await updateAssignmentPublishStatus({data})
  Message.success('已上架')
  query()
}

const currentSubjectId = ref()
const currentRowInfo = reactive({
  assignment: {},
  index: -1
})

const handleEdit = async (row, index) => {
  currentSubjectId.value = row.assignmentId
  currentRowInfo.assignment = row
  currentRowInfo.index = index
  isShowAddView.value = true
}
const handleReport = async (row,index)=>{
  currentSubjectId.value = row.assignmentId
  currentRowInfo.assignment = row
  currentRowInfo.index = index
  isShowReportView.value = true;
}
const resetCurrentSubject = () => {
  currentRowInfo.assignment = {}
  currentRowInfo.index = -1
}
const isShowAddView = ref(false)
const isShowReportView = ref(false)
const handleCreate = () => {
  resetCurrentSubject()
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
  const subjectMap = homeworkList.value.reduce((prevValue, currentVaue) => {
    prevValue[currentVaue.assignmentId] = currentVaue
    return prevValue
  }, {})
  homeworkList.value = result.map(row => subjectMap[row])
  saveSortResult()
}

// 保存排序结果
const saveSortResult = async () => {
  const data = homeworkList.value.map((row, i) => ({
    businessId: props.businessId,
    assignmentId: row.assignmentId,
    businessType: MIXINS_SUBJECT_TYPE_CLASS,
    sortNo: i
  }))
  await updateAssignmentSortNo({data})
  query()
}

const emit = defineEmits(['change'])

const showTitle = (index) => {
  return `作业${toChinesNum(index+1)}`
}

const editTitle = computed(() => {
  if( currentRowInfo.index === -1 ) return '新增作业'
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
  name: "MixinsHomework"
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
    font-size: 14px;
    line-height: 22px;
    opacity: 0.6;
    display: -webkit-box; //-webkit-box是兼容IOS和老版本Android浏览器的方式
    -webkit-line-clamp: 3; //限制行数
    overflow: hidden; //隐藏溢出
    text-overflow: ellipsis; //省略号
    -webkit-box-orient: vertical; //垂直方向排列
    white-space: normal;
    -ms-text-overflow: unset;
    text-overflow: unset;
    max-height: 70px;
  }

  .footer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .info-container {
    display: flex;
    .item {
      font-size: 12px;
      color: rgba(0,0,0,0.4);
      padding: 0 10px;
      font-weight: 400;
    }
  }
}

.footer-box {
  bottom: 0px;
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
.videoPlayer {
  height: 300px;
  width: 500px;
  margin: 0 auto;
}
.progress-info{
  .item {
    font-size: 12px;
    color: rgba(0,0,0,0.4);
    padding: 0 10px;
    font-weight: 400;
  }
  span{
    margin-right: 10px;
  }
}
.control-container{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
