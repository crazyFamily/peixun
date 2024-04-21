<template>
  <div class="report-wrapper" v-show="show">
    <div class="home-container">
      <div class="home-top-info">
        <div class="homework-info">
          <div class="homework-name">{{assignmentInfo.assignmentTitle}}</div>
          <div class="homework-other">已提交：{{submitted}}人   未提交：{{ notSubmitted }}人</div>
        </div>
          <el-form :model="queryForm" :inline="true"><div class="search-card  between">
            <el-form-item label="提交人">
              <el-input v-model="queryForm.publishUm" placeholder="请输入姓名/UM号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="reset" class="button-w80-h30">重置</el-button>
              <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
            </el-form-item></div>
          </el-form>
        <div class="top-bar">
          <el-button v-if="assignmentInfo.assignmentType!=0" :loading="getLoading('LOADING_FETCH_UDMP_DOWNLOAD')" class="button-w80-h30"  @click="batchDownloadHandle">下载作业</el-button>
          <el-button class="button-w80-h30"  @click="exportHandle">导出列表</el-button>
        </div>
      </div>
      <table-pagination
        v-if="show"
        :list="planManagementList"
        @sort-change="sortChange"
        :tableList="planManagementTableList"
        :queryForm="queryForm"
        :getList="getCommentList"
        :page-sizes="[10,20,50]"
        v-loading="getLoading('LOADING_CASECENTER_MANAGE_LIST')"
        ref="tablePaginationRef"
      >
        <el-table-column :selectable="selectable" slot="selection" type="selection" min-width="54"> </el-table-column>
        
        <el-table-column slot="publishStatusDesc" label="作业状态" width="80">
            <template slot="header">
                <gc-tablecolumnfilters
                  ref="tablecolumnfilters"
                  label="状态"
                  className="table__screen__icon"
                  popperClass="circular"
                  :list="ASSIGMENT_SUBMIT_STATUS_OPTIONS"
                  confirmText="确定"
                  @filter="commonFilter($event, queryForm, 'publishStatusList', getCommentList,'filter',true)"
                  @reset="commonFilter($event, queryForm, 'publishStatusList', getCommentList)"
                >
                </gc-tablecolumnfilters>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.publishStatusDesc }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="130">
          <template v-slot:default="scope">
            <span v-if="scope.row.commentId" class="active mr10" @click="queryCommentDetails(scope.row)">
              详情
            </span>
            <span v-if="scope.row.commentId" class="active mr10" @click="delSingleComment(scope.row)">
              删除
            </span>
          </template>
        </el-table-column>
      </table-pagination>

    <!-- 查看评论详情 dialog -->
    <HomeworkDetailsDialog :show.sync="isShowCommentDetail" :businessId="String(assignmentInfo.businessId)" :commentData="commentData" :assignmentInfo="assignmentInfo"  ref="HomeworkDetailsDialog" />
    
  </div>
  <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" type="primary" @click="returnHomework"><i class="add-icon"></i>返回</el-button>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import {fileDownload} from '@/util/udmp'
import { hintFrame, resetObj, getLoadingStatus, commonFilter,handleDownload,handleExport,downloadFileByName } from '@/util/utils'
import { listAssignmentComment,deleteAssignmentComment} from '@/fetch/establish'
import HomeworkDetailsDialog from './HomeworkDetailsDialog'
import { ASSIGMENT_SUBMIT_STATUS_OPTIONS } from '@/views/Establish/enum'
export default {
  name: 'HomeReport',
  components: {  
    HomeworkDetailsDialog
  },
   props: {
     assignmentInfo: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      ASSIGMENT_SUBMIT_STATUS_OPTIONS,
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
        publishUm:'',
        publishStatusList:[],//发布状态 null全部 0暂存，1已提交，2逾期提交
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
          label: '姓名',
          prop:'umName'
        },
        {
          label: 'UM号',
          prop: 'umId'
        },
        {
          label: '作业状态',
          slot: 'publishStatusDesc'
        },
        {
          label: '提交时间',
          width: '120',
          prop: 'commentDate'
        },
        {
          label: '作业文字内容',
          width: '320',
          prop: 'commentContent'
        },
        {
          label:'提交文件数',
          width: '110',
          prop: 'fileNum'
        },
      ],
      // 计划管理 表格 数据数组
      planManagementTableList: []
    }
  },
  watch: {
    show(val) {
      if(val) {
        this.queryForm= {//重置数据
          commentContent:'',
          publishUm:'',
          publishStatusList:[],//发布状态 null全部 0暂存，1已提交，2逾期提交
          currPage: 1,
          pageSize: 10,
          total: 0
        }
        this.getCommentList()
      }
    }
  },
  computed:{
    completionRate(){
      if(!this.assignmentInfo.completionRate) return ''
      return this.assignmentInfo.completionRate.split('/')
    },
    submitted(){
      if(!this.assignmentInfo.completionRate) return ''
      return this.completionRate[0]
    },
    notSubmitted(){
      if(!this.assignmentInfo.completionRate) return ''
      return this.completionRate[1]
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1;
      this.getCommentList()
    },
    reset(){
      resetObj(this.queryForm,{//重置数据
          commentContent:'',
          publishUm:'',
          publishStatusList:[],//发布状态 null全部 0暂存，1已提交，2逾期提交
          currPage: 1,
          pageSize: 10,
          total: 0
        })
      this.$refs.tablecolumnfilters.$reset()
      this.query()
    },
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
    },
    // 处理查询数据
    handleQueryForm(tip='Y') {
      const { currPage, pageSize, publishUm, commentContent,publishStatusList,sortStatus } = this.queryForm
      const data = { currPage, pageSize, publishUm, commentContent,publishStatusList,sortStatus }
      data.businessId = this.assignmentInfo.businessId;
      data.assignmentId = this.assignmentInfo.assignmentId;
      data.businessType='class'
      data.tip=tip
      delete data.updatedDate
      return data 
    },
    // 获取评论数据
    getCommentList() {
      const data = this.handleQueryForm()
      listAssignmentComment({data}).then((res) => {
          const { list, total } = res
          list.forEach((v) => {
            v.submitDate = v.submitDate?.split(' ')[0]
          })
          this.planManagementTableList = list
          this.queryForm.total = total
      })
    },
    // 批量下载
    batchDownloadHandle() {
      const selection = this.$refs.tablePaginationRef.$children[0].$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('请先选择一条学员的作业')
      }
      const notCustom = selection.every((v) => v.fileNum === '-')
      if (notCustom) {
        return this.$message.warning('勾选的学员未提交文件')
      }
      for(let i=0;i<selection.length;i++){
        const obj = selection[i]
        // debugger
        if(obj.commentId){
          const fileList = obj.fileInformationList
          for(let j=0;j<fileList.length;j++){
            const file= fileList[j]
            this.handleDownload(file)
          }
        }
      }
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
    delSingleComment(row) {
      hintFrame('学员已提交的作业删除后无法恢复，请确认！').then((res) => {
        if (!res) return
        this.deleteComment(parseInt(row.commentId))
      })
    },
    deleteComment(commentId){
      const data={}
      data.assignmentId = this.assignmentInfo.assignmentId
      data.businessId = this.assignmentInfo.businessId
      data.businessType = 'class'
      data.commentId=commentId
      deleteAssignmentComment({data}).then((res) => {
        this.$message.success('删除成功')
        this.getCommentList()
      })
    },
    handleDownload(file){
      // const fileName = store.state.userInfo.empName+'_'+file.fileName
      const fileName = file.fileName
      try {
        fileDownload(file.udmpId).then(res=>{
          downloadFileByName(res,fileName)
        })
      } catch (error) {
        console.log(error)
      }
    },
    exportHandle() {
      const data = this.handleQueryForm('N')
      handleExport('/fn/assignment/listAssignmentComment', {data})
    },
    returnHomework(){
      this.$refs.tablePaginationRef.resetFilters()
      this.$emit('close', true)
    }
  },
  mounted() {
    // 
  }
}
</script>

<style lang="scss" scoped>
  @import '@/views/Establish/TrainingCourseManagement/MixinsTraining/components/stylesheets/mixins-public.scss';

.report-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  // position: absolute;
  top:0;
}
.home-container{
  padding:30px 20px;
  background-color: #fff;
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
  display: inline;
    padding: 0 0 20px 0;
}
.table__screen__icon {
    top: 6px;
}
:deep(.gc-pagination.between){
  height:50px;
}
.home-top-info{
  display: flex;
  justify-content: space-between;
  .homework-info{
    display: block;
  }
  .homework-name{
    font-size: 16px;
    color: #000000;
    line-height: 18px;
    font-weight: 500;
  }
  .homework-other{
    display: flex;
    opacity: 0.61;
    font-size: 12px;
    color: #000000;
    line-height: 18px;
    font-weight: 400;
    margin-top: 6px;
  }
}
.footer-box {
  // position: absolute;
  // width: 100%;
  bottom: 0px;
}
// :deep(.el-tooltip){
//   width: 1050px!important;
// }
</style>
