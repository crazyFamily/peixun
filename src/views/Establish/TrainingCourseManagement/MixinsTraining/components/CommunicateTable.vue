<template>
  <div class="course-wrapper">
      <el-form :model="queryForm" :inline="true">
    <div class="search-card  between"><el-form-item>
        <el-form-item label="评论内容">
          <el-input v-model="queryForm.commentContent" placeholder="请输入关键词"></el-input>
        </el-form-item><el-form-item></el-form-item>
        <el-form-item label="提交人">
          <el-input v-model="queryForm.createdBy" placeholder="请输入姓名/UM号"></el-input>
        </el-form-item>
        </el-form-item>
      <el-form-item>
        <el-button @click="reset" class="button-w80-h30">重置</el-button>
        <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
      </el-form-item>
      </div>
      </el-form>
      <div class="top-bar">
        <el-button class="button-w80-h30"  @click="batchShieldHandle">屏蔽</el-button>
        <el-button class="button-w80-h30"  @click="batchRestoreHandle">恢复</el-button>
        <el-button class="button-w80-h30"  @click="batchDeleteHandle">删除</el-button>
        <el-button class="button-w80-h30"  @click="exportHandle">导出</el-button>
      </div>
        <table-pagination
          :list="planManagementList"
          @sort-change="sortChange"
          :tableList="planManagementTableList"
          :queryForm="queryForm"
          :getList="getCommentList"
          :page-sizes="[10, 20,50]"
          v-loading="getLoading('LOADING_CASECENTER_MANAGE_LIST')"
          ref="tablePaginationRef"
        >
          <el-table-column :selectable="selectable" slot="selection" type="selection" min-width="54"> </el-table-column>
          <el-table-column label="评论回复数" slot="replyCount" prop="replyCount" sortable='custom' width="120">
            <template slot-scope="scope">
              <el-link type="primary" @click="queryReplyDetails(scope.row)">{{ scope.row.replyCount }}</el-link>
            </template>
          </el-table-column>
          <el-table-column slot="commentStatusStr" label="状态" width="80">
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
          <el-table-column label="操作" fixed="right" width="160">
            <template v-slot:default="scope">
              <span class="active mr10" @click="queryCommentDetails(scope.row)">
                详情
              </span>
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

    <!-- 查看评论详情 dialog -->
    <CommentDetailsDialog :show.sync="isShowCommentDetail" :businessId="String(subjectInfo.businessId)" :commentData="commentData"  ref="CommentDetailsDialog" />
    <!-- 查看评论回复 dialog -->
    <ReplyDetailsDialog :show.sync="isShowReplyDetail" :businessId="String(subjectInfo.businessId)" :subject-info="subjectInfo" :commentData="commentData" ref="ReplyDetailsDialog" />
  </div>
</template>

<script>
import { hintFrame, resetObj, getLoadingStatus, commonFilter,handleDownload,handleExport } from '@/util/utils'
import { fetchListCommunicateComment,deleteCommunicateCommentByCommentIds,shieldCommunicateCommentByCommentIds} from '@/fetch/establish'
import CommentDetailsDialog from './CommentDetailsDialog'
import { COMMENT_STATUS_OPTIONS } from '@/views/Establish/enum'
import ReplyDetailsDialog from './ReplyDetailsDialog'
export default {
  name: 'CommunicateTable',
  components: {  
    CommentDetailsDialog,
    ReplyDetailsDialog 
  },
   props: {
     subjectInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      COMMENT_STATUS_OPTIONS:COMMENT_STATUS_OPTIONS,
      isShowCommentDetail:false,
      isShowReplyDetail:false,
      commentData:{},
      // 显示哪个 div
      showIndex: 0, // 0：列表页； 1：详情页面
      // 分页总条数
      total: 0,
      // 查询表单对象
      queryForm: {
        commentContent:'',
        createdBy:'',
        commentStatus:null,
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      // 计划管理 表格 字段数组
      planManagementList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type:'index',
          label: '序号',
          width: '54'
        },
        {
          width: '220',
          label: '一级评论内容',
          prop: 'commentContent'
        },
        {
          label: '提交时间',
          width: '120',
          prop: 'createdDate'
        },
        {
          label: '提交人',
          width: '120',
          prop: 'createdByStr'
        },
        {
          label: '状态',
          slot: 'commentStatusStr'
        },
        {
          slot: 'replyCount'
        },
        {
          label:'点赞数',
          sortable: 'custom',
          width: '80',
          prop: 'likeCount'
        },
      ],
      // 计划管理 表格 数据数组
      planManagementTableList: []
    }
  },
  methods: {
    commonFilter($event, form, key, cb, state, multiple){
      return commonFilter($event, form, key, cb, state, multiple)
    },
    selectable(row) {
      if (row.editStatus === 'N') {
        return false
      } else {
        return true
      }
    },
    getLoading(key, isSync = false){
      return getLoadingStatus(key, isSync)
    },
    sortChange ({order,prop})  {
      if (order === 'ascending') {
        if(prop=='replyCount'){
          this.queryForm.sortStatus = '0'
        }
        if(prop=='likeCount'){
          this.queryForm.sortStatus = '2'
        }
      } else if (order === 'descending') {
        this.queryForm.sortStatus = 'created_date_desc'
        if(prop=='replyCount'){
          this.queryForm.sortStatus = '1'
        }
        if(prop=='likeCount'){
          this.queryForm.sortStatus = '3'
        }
      } else {
        this.queryForm.sortStatus = ''
      }
      this.query()
    },
    // 查询
    query() {
      this.queryForm.currPage = 1;
      this.getCommentList()
    },
    reset(){
      resetObj(this.queryForm, {
        commentContent:'',
        createdBy:'',
        commentStatus:null,
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        total:0
      })
      this.query()
    },
    // 处理查询数据
    handleQueryForm(tip='Y') {
      const { currPage, pageSize, createdBy, commentContent,commentStatus,sortStatus } = this.queryForm
      const data = { currPage, pageSize, createdBy, commentContent,commentStatus,sortStatus }
      data.businessId = this.subjectInfo.businessId;
      data.subjectId = this.subjectInfo.subjectId;
      data.prnId = 0;
      data.subjectType='class'
      data.tip=tip
      data.replyUmId = ''
      delete data.updatedDate
      return data 
    },
    // 获取评论数据
    getCommentList() {
      const data = this.handleQueryForm()
      fetchListCommunicateComment({data}).then((res) => {
          const { list, total } = res
          list.forEach((v) => {
            v.submitDate = v.submitDate?.split(' ')[0]
          })
          this.planManagementTableList = list
          this.queryForm.total = total
      })
    },
    // 批量删除
    batchDeleteHandle() {
      const selection = this.$refs.tablePaginationRef.$children[0].$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('请先选择一条评论')
      }
      hintFrame('将同时删除此条评论及回复，无法恢复，请确认！').then((res) => {
        if (!res) return
        console.log(selection)
        const arr = []
        for(let i=0;i<selection.length;i++){
          const obj = selection[i]
          arr.push(obj.commentId)
        }
        this.deleteComment(arr)
      })
    },
    // 查询评论信息
    queryCommentDetails(row) {
      this.isShowCommentDetail = true;
      this.commentData = row
    },
    // 查询回复列表
    queryReplyDetails(row) {
      this.isShowReplyDetail = true;
      this.commentData = row
    },
    batchShieldHandle(){
      const selection = this.$refs.tablePaginationRef.$children[0].$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('请先选择一条评论')
      }
      console.log(selection)
      const arr = []
      for(let i=0;i<selection.length;i++){
        const obj = selection[i]
        arr.push(obj.commentId)
      }
      this.shieldComment(arr,1)
    },
    batchRestoreHandle(){
      const selection = this.$refs.tablePaginationRef.$children[0].$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('请先选择一条评论')
      }
      console.log(selection)
      const arr = []
      for(let i=0;i<selection.length;i++){
        const obj = selection[i]
        arr.push(obj.commentId)
      }
      this.shieldComment(arr,0)
    },
    shieldComment(arr,type){
      hintFrame(type==1?'确认屏蔽该评论吗？':'确认恢复该评论吗？').then((res) => {
        if (!res) return
      
        const data={}
        data.subjectId = this.subjectInfo.subjectId
        data.businessId = this.subjectInfo.businessId
        data.subjectType = 'class'
        data.commentIds=arr
        data.commentStatus=String(type)
        shieldCommunicateCommentByCommentIds({data}).then((res) => {
            this.$message.success(type==1?'屏蔽成功':'恢复成功')
            this.query()
        })
      })
    },
    delSingleComment(row) {
      hintFrame('将删除此条回复，无法恢复，请确认！').then((res) => {
        if (!res) return
        this.deleteComment([parseInt(row.commentId)])
      })
    },
    deleteComment(arr){
        const data={}
        data.subjectId = this.subjectInfo.subjectId
        data.businessId = this.subjectInfo.businessId
        data.subjectType = 'class'
        data.commentIds=arr
        deleteCommunicateCommentByCommentIds({data}).then((res) => {
            this.$message.success('删除成功')
            this.query()
        })
    },
    exportHandle() {
      const data = this.handleQueryForm('N')
      handleExport('/fn/communicate/listCommunicateComment', {data})
    }
  },
  mounted() {
    this.query()
  }
}
</script>

<style lang="scss" scoped>
  @import '@/views/Establish/TrainingCourseManagement/MixinsTraining/components/stylesheets/mixins-public.scss';
.course-wrapper{
  padding:0 20px;
  position: relative;
  // height: calc(100vh - 208px);
}
.plan-management__plan-management {
  .search-card {
    .el-cascader {
      width: 200px;
    }
  }
  .tabs-card {
    margin-top: -1px;
    .el-card__body {
      padding: 20px 0;

      .el-tabs__content {
        padding: 5px 20px 0;
      }
    }
  }
  .approval-chain-card {
    margin-top: -1px;
    padding: 10px 0;
    border-top: 1px dashed #eaecf1;
    .label {
      width: 48px;
      margin-right: 6px;
      line-height: 30px;
      &.necessary-before::before {
        top: 1px;
      }
    }
  }
  .check-training-plan {
    .el-dialog__body {
      background-color: #f5f6fb;
    }
  }
}
.search-card__button {
  float: left;
  margin-bottom: 20px;
}

.restore-color{
  color:#36B876;
}
.top-bar {
    padding: 0 0 20px 0;
}
.table__screen__icon {
    top: 6px;
}
:deep(.gc-pagination.between){
  height:50px;
}
</style>
