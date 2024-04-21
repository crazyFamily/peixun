<template>
  <gc-model
    width="1200px"
    :visible="isReplyDialogShow"
    @close="handleCancel"
    @cancel="handleCancel"
    :is-show-footer="false"
    title="查看评论回复"
    class="dialog-style"
  >
    <div class="add-communicate-wrapper">
        <div class="search-card">
          <el-form :model="queryForm" :inline="true">
            <el-form-item label="回复内容">
              <el-input v-model="queryForm.commentContent" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item label="回复人">
              <el-input v-model="queryForm.createdBy" placeholder="请输入姓名/UM号"></el-input>
            </el-form-item>
            <el-form-item label="被回复人">
              <el-input v-model="queryForm.replyUmId" placeholder="请输入姓名/UM号"></el-input>
            </el-form-item>
          <el-form-item>
            <el-button @click="reset" class="button-w80-h30">重置</el-button>
            <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
          </el-form-item>
          </el-form>
        </div>

        <div>
          <div class="menu-left">
              <el-button class="button-w80-h30"  @click="batchShieldHandle">
                屏蔽</el-button
              >
              <el-button class="button-w80-h30"  @click="batchRestoreHandle">
                恢复</el-button
              >
              <el-button class="button-w80-h30"  @click="batchDeleteHandle">
                删除
              </el-button>
              <el-button class="button-w80-h30"  @click="exportHandle">
                导出</el-button
              >
            </div>
          <table-pagination
              :list="planManagementList"
              @sort-change="sortChange"
              :tableList="planManagementTableList"
              :queryForm="queryForm"
              :getList="getCommentList"
              :page-sizes="[10, 20, 50]"
              v-loading="getLoadingStatus('LOADING_CASECENTER_MANAGE_LIST')"
              ref="tablePaginationRef"
            >
            
              <el-table-column :selectable="selectable" slot="selection" type="selection" min-width="54"> </el-table-column>
              <el-table-column slot="commentStatusStr" label="状态" width="120">
                <template slot="header">
                  <div class="column-header">
                    <span>状态</span>
                    <gc-tablecolumnfilters
                      label=" "
                      className="table__screen__icon"
                      popperClass="circular"
                      :list="COMMENT_STATUS_OPTIONS"
                      confirmText="确定"
                      radio
                      @filter="commonFilter($event, queryForm, 'commentStatus', getCommentList,'filter')"
                      @reset="commonFilter($event, queryForm, 'commentStatus', getCommentList)"
                    >
                    </gc-tablecolumnfilters>
                  </div>
                </template>
                <template slot-scope="scope">
                  <span>{{ scope.row.commentStatusStr }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="240" fixed="right">
                <template v-slot:default="scope">
                  <span class="active mr10" v-if="scope.row.commentStatus==0" @click="shieldComment([scope.row.commentId],1)">
                    屏蔽
                  </span>
                  <span class="active mr10 restore-color" v-if="scope.row.commentStatus==1" @click="shieldComment([scope.row.commentId],0)">
                    恢复
                  </span>
                  <span class="active mr10" @click="delSingleComment(scope.row)">
                    删除
                  </span>
              </template>
            </el-table-column>
            </table-pagination>
        </div>
    </div>
  </gc-model>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { ESTABLISH_COURSE_MAP } from '@/util/constants'
import {fetchListCommunicateComment,shieldCommunicateCommentByCommentIds,deleteCommunicateCommentByCommentIds} from '@/fetch/establish'

import { getLoadingStatus,commonFilter,resetObj,hintFrame,handleExport } from '@/util/utils'
import { Message } from 'element-ui'
import { COMMENT_STATUS_OPTIONS } from '@/views/Establish/enum'

const emit = defineEmits('update:show', 'save', 'close')

const props = defineProps({
  businessId: {
    type: String,
    required: true
  },
  subjectInfo: {
    type: Object,
    required: true
  },
    commentData:{
      type:Object,
      default:()=>{return {}}
    },
    show: {
      type: Boolean,
      required: true
    },
    state: String
  })
const tablePaginationRef = ref(null)
const planManagementTableList=ref([])
const queryForm = ref({
  commentContent: '',
  commentStatus:null,
  createdBy:'',
  currPage: 1,
  replyUmId:'',
  pageSize: 10,
  total: 0
})
const planManagementList= ref([{
          type: 'selection',
          width: '54'
        },
        {
          type:'index',
          label: '序号',
          width: '54'
        },
        {
          label: '回复人',
          prop: 'createdByStr',
          width: '100'
        },
        {
          label: '被回复人',
          prop: 'replyUmStr',
          width: '100'
        },
        {
          width: '220',
          label: '回复内容',
          prop: 'commentContent'
        },
        {
          label: '提交时间',
          prop: 'createdDate',
          width: '150'
        },
        {
          label: '状态',
          slot: 'commentStatusStr'
        },
        {
          label:'点赞数',
          sortable:'custom',
          prop: 'likeCount'
        },
      ])
const isReplyDialogShow = ref(false)
watch(
  () => props.show,
  async (n) => {
    isReplyDialogShow.value = n
    if (n) {
      reset()
    }
  }
)
const sortChange= ({ order })=>  {
      if (order === 'ascending') {
        queryForm.value.sortStatus = '2'
      } else if (order === 'descending') {
        queryForm.value.sortStatus = '3'
      } else {
        queryForm.value.sortStatus = ''
      }
      getCommentList()
    }
const selectable=(row)=> {
      if (row.editStatus === 'N') {
        return false
      } else {
        return true
      }
    }
const batchShieldHandle=()=>{
      const selection = tablePaginationRef.value.$children[0].$children[0].selection
      if (selection.length < 1) {
        return Message.warning('请先选择一条评论')
      }
      console.log(selection)
      const arr = []
      for(let i=0;i<selection.length;i++){
        const obj = selection[i]
        arr.push(obj.commentId)
      }
      shieldComment(arr,1)
    }
const batchRestoreHandle=()=>{
      const selection = tablePaginationRef.value.$children[0].$children[0].selection
      if (selection.length < 1) {
        return Message.warning('请先选择一条评论')
      }
      console.log(selection)
      const arr = []
      for(let i=0;i<selection.length;i++){
        const obj = selection[i]
        arr.push(obj.commentId)
      }
      shieldComment(arr,0)
    }
const shieldComment=(arr,type)=>{
      hintFrame(type==1?'确认屏蔽该评论吗？':'确认恢复该评论吗？').then((res) => {
        if (!res) return
      
        const data={}
        data.subjectId = props.subjectInfo.subjectId
        data.businessId = props.subjectInfo.businessId
        data.subjectType = 'class'
        data.commentIds=arr
        data.commentStatus=String(type)
        shieldCommunicateCommentByCommentIds({data}).then((res) => {
            Message.success(type==1?'屏蔽成功':'恢复成功')
            query()
        })
      })
    }
const delSingleComment=(row)=> {
      hintFrame('将删除此条回复，无法恢复，请确认！').then((res) => {
        if (!res) return
        deleteComment([parseInt(row.commentId)])
      })
    }
const batchDeleteHandle=()=> {// 批量删除
      const selection = tablePaginationRef.value.$children[0].$children[0].selection
      if (selection.length < 1) {
        return Message.warning('请先选择一条评论')
      }
      hintFrame('将同时删除此条评论及回复，无法恢复，请确认！').then((res) => {
        if (!res) return
        console.log(selection)
        const arr = []
        for(let i=0;i<selection.length;i++){
          const obj = selection[i]
          arr.push(obj.commentId)
        }
        deleteComment(arr)
      })
    }
const deleteComment=(arr)=>{
        const data={}
        data.subjectId = props.subjectInfo.subjectId
        data.businessId = props.subjectInfo.businessId
        data.subjectType = 'class'
        data.commentIds=arr
        deleteCommunicateCommentByCommentIds({data}).then((res) => {
            Message.success('删除成功')
            query()
        })
    }
// 重置
const reset=()=> {
  resetObj(queryForm.value, {
    commentContent:'',
    createdBy:'',
    commentStatus:null,
    //当前页
    currPage: 1,
    //每页大小
    pageSize: 10,
    total:0
  })
  getCommentList()
}
// 处理查询数据
const handleQueryForm=(tip='Y')=> {
  const { currPage, pageSize, createdBy, commentContent,commentStatus,replyUmId,sortStatus } = queryForm.value
  const data = { currPage, pageSize, createdBy, commentContent,commentStatus,replyUmId,sortStatus }
  data.businessId = props.businessId;
  data.subjectId = props.commentData.subjectId;
  data.prnId = props.commentData.commentId;
  data.subjectType='class'
  data.tip=tip
  delete data.updatedDate
  return data 
}

// 获取评论数据
const getCommentList=()=> {
  const data = handleQueryForm()
    console.log('handleQueryForm:/>',data)
  fetchListCommunicateComment({data}).then((res) => {
      const { list, total } = res
      list.forEach((v) => {
        v.submitDate = v.submitDate?.split(' ')[0]
      })
      planManagementTableList.value = list
      queryForm.value.total = total
  })
}

// --------------- 弹窗处理 ---------------
const handleClose = () => {
  emit('update:show', false)
  emit('close')
}

const handleCancel = () => {
  handleClose()
}
const exportHandle=()=> {
  const data = handleQueryForm('N')
  handleExport('/fn/communicate/listCommunicateComment', {data})
}
const initData=() => {
  if (props.businessId) {
    query()
  }
}
const query=()=>{
  queryForm.value.currPage = 1;
  getCommentList()
}

</script>
<script>
export default {
  name: 'ReplayDetailDialog'
}
</script>

<style lang="scss" scoped>
  @import '@/views/Establish/TrainingCourseManagement/MixinsTraining/components/stylesheets/mixins-public.scss';
.menu-left{
  display:inline-flex;
  margin: 20px 0;
}

.restore-color{
  color:#36B876;
}
:deep(.table__screen__icon) {
    top: 3px;
}
</style>
