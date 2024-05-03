<template>
  <div class="editor-wrapper">
    <template v-if="!isNoEmpty">
    <p class="page-title">{{baseInfoForm.assignmentTitle}}</p>
    <p class="page-info"><span class="m-r-20">发布人：{{baseInfoForm.publishName}}</span><span>发布时间：{{baseInfoForm.publishDate}}</span></p>
    <p class="had_submit" v-if="baseInfoForm.publishStatus">已提交作业</p>
      <el-form
        :model="baseInfoForm"
        class="form mt20 mb20"
        label-width="100px"
        ref="baseInfoFormRef"
        :rules="formRules"
      >
      <div class="title">
        <div class="title__menu"></div>
        作业介绍
      </div>
        <el-form-item class="m-t-20" label="作业类型：">
            <span class="page-input">{{baseInfoForm.homeworkType}}</span>
        </el-form-item>
        <el-form-item
          label="字数要求："
          v-if="baseInfoForm.wordLimit"
          prop="worksNumRequired"
        >
          <span class="page-input">提交的文字内容不少于{{baseInfoForm.wordLimit}}字</span>
        </el-form-item>
        <el-form-item
          label="截止时间："
          v-if="baseInfoForm.deadline"
          prop="deadline"
        >
          <span class="page-input">{{baseInfoForm.deadline}}</span>
        </el-form-item>
        <div class="timetable">
            <div class="title">
                <div class="title__menu"></div>
                <span> 作业说明 </span>
            </div>
            <SectionBlock :init-height="84">
              <div v-html="$xss(baseInfoForm.assignmentContent)"></div>
            </SectionBlock>
        </div>
      <div class="accessory-info mt30">
        <div class="title">
          <div class="title__menu"></div>
          附件
        </div>
        <div class="case-items m-t-20">
            <div class="case-item tintColor"
                v-for="(item, i) in baseInfoForm.fileInformationList"
                @mouseenter="mouseenterHandle(item)"
                @mouseleave="mouseleaveHandle(item)"
                :key="i">
                <div class="case-type content">
                  <span :class="{'pdf':item.fileType=='pdf',
                                  'doc':item.fileType=='doc',
                                  'docx':item.fileType=='docx',
                                  'xls':item.fileType=='xls',
                                  'xlsx':item.fileType=='xlsx',
                                  'ppt':item.fileType=='ppt',
                                  'pptx':item.fileType=='pptx',
                                  'jpg':item.fileType=='jpg',
                                  'png':item.fileType=='png',
                                  'mp3':item.fileType=='mp3',
                                  'rar':item.fileType=='rar',
                                  'zip':item.fileType=='zip',
                                  'jpeg':item.fileType=='jpeg',
                                  'mp4':item.fileType=='mp4'
                              }"
                  >{{ item.typeStr }}</span>
                  <span class="m-r-20">{{item.fileName}}</span>
                  <span class="case-size">{{ getRightFileSize(item.fileSize) }}</span>
                </div>
                <div class="case-type" v-if="item.showAction">
                  <i class="el-icon-view icon-size m-r-20" v-if="isImage(item.fileName) || isVideo(item.fileName) || isAudio(item.fileName) || isPreview(item.fileName)"  @click="handleReview(item)"></i>
                  <i class="el-icon-download icon-size m-r-20" @click="handleDownload(item)"></i>
                </div>
            </div>
        </div>
      </div>
      <div class="accessory-info mt30">
        <div class="title">
          <div class="title__menu"></div>
          作业提交
        </div>
        <el-form-item label="文字内容" class="textarea m-t-20" prop="commentContent">
        <el-input
            :disabled="!canEditFlag || disabledSumbit"
            type="textarea"
            show-word-limit
            rows="8"
            class="input-text"
            v-model="baseInfoForm.commentContent"
          >
        </el-input>
        </el-form-item>
      </div>
        <el-form-item v-if="baseInfoForm.assignmentType==1" label="图片/视频" class="textarea m-t-20" prop="mediaList">
        <p class="upload-info">上传图片或视频 <span>{{baseInfoForm.mediaList.length}}/3</span></p>
        <div class="pic-wrapper">
          <MediaUploadUdmp
            :auto-submit="true"
            :can-edit="canEditFlag"
            :disableUpload='baseInfoForm.mediaList.length >= 3'
            :accept="['jpg', 'jpeg', 'png','mov','mp4']"
            @uploadFinish="handleMediaUploadSuccess"
            @remove="handleMediaRemove"
            :size="300"
            ref="mediaUploadRef"
          ></MediaUploadUdmp>
        </div>
        </el-form-item>
        <el-form-item v-if="baseInfoForm.assignmentType==2" label="附件" label-width="100px" prop="attchmentList" style="margin-top: 20px;">
          <div class="input-file-list">
            <p class="upload-info">上传文档 <span>{{baseInfoForm.attachmentList.length}}/3</span></p>
            <UploadUdmp
              :is-drag="false"
              :can-edit="canEditFlag || (!baseInfoForm.commentId && baseInfoForm.attachmentList.length<3)"
              :accept="uploadFileTypes"
              :disableUpload='baseInfoForm.attachmentList.length >= 3'
              @uploadFinish="uploadAttachmentFinishHandle"
              @uploadProgress="uploadAttachmentProgressHandle"
              @uploadReady="uploadAttachmentReadyHandle"
              :size="500"
              :multiple="false"
              ref="attachUploadRef"
            ></UploadUdmp>
            <div
              class="content case-item"
              v-for="(item, index) in baseInfoForm.attachmentList"
              :key="index"
              @mouseenter="mouseenterHandle(item)"
              @mouseleave="mouseleaveHandle(item)"
            >
              <div class="file-left">
                <div :class="{'pdf':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='pdf',
                              'doc':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='doc',
                              'docx':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='docx',
                              'xls':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='xls',
                              'xlsx':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='xlsx',
                              'ppt':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='ppt',
                              'pptx':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='pptx',
                              'jpg':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='jpg',
                              'png':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='png',
                              'mp3':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='mp3',
                              'rar':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='rar',
                              'zip':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='zip',
                              'jpeg':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='jpeg',
                              'mp4':item.name.substr(item.name.lastIndexOf('.')+1).toLowerCase()=='mp4'
                              }"></div>
                <div class="progress">
                  <div class="file-name">{{ item.name }}</div>
                  <el-progress style="width:1040px;" :percentage="item.percent" v-if="item.percent<100"></el-progress>
                </div>
              </div>
              <div class="case-type" v-show="item.showAction">
                <i class="el-icon-view icon-size m-r-20" v-if="isPreview(item.name)" @click="handleReview(item)"></i>
                <i class="el-icon-download icon-size m-r-20" @click="handleDownload(item)"></i>
                <i v-if="canEditFlag" class="el-icon-delete icon-size mr15" @click="handleDelete(item)"></i>
              </div>
            </div>

          </div>
        </el-form-item>
    </el-form>
    <image-viewer
      v-show="pictureVisible"
      ref="imgViewer"
      :on-close="closeViewer"
      :url-list="imageList"
    />
    <div class="place-holder"></div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button v-if="!baseInfoForm.commentId && baseInfoForm.allowSubmit==1" class="button-w80-h30" plain @click="saveDraft"><i class="add-icon"></i>保存草稿</el-button>
      <el-button v-if="baseInfoForm.commentId && (baseInfoForm.allowSubmit==1 ||baseInfoForm.allowSubmit==2) && canEditFlag" class="button-w80-h30" plain @click="cancelEdit"><i class="add-icon"></i>取消</el-button>
      <el-button v-if="baseInfoForm.commentId && (baseInfoForm.allowSubmit==1 ||baseInfoForm.allowSubmit==2) && !canEditFlag" class="button-w80-h30" type="primary" @click="beginEdit"><i class="add-icon"></i>修改作业</el-button>
      <el-button v-else type="primary" :loading="getLoading('LOADING_SAVE_ASSIGNMENT_COMMENT')" @click="submitHomework" :disabled="disabledSumbit"><i class="add-icon"></i>{{ submitTxt }}</el-button>
    </div>
    </template>
    <template v-else-if="finishResByMyself && isNoEmpty">
      <div class="no_data">
        <img class="no-data-img" src="@/assets/images/no-data.png" alt="" />
        <p>该作业已下架，或已删除！</p>
      </div>
    </template>
  </div>
</template>

<script>
import { UPLOAD_STATUS_SCZ, UPLOAD_STATUS_SCCG, UPLOAD_STATUS_YSC } from '@/components/upload/emun'
import store from '@/store'
import {
  isImage,isVideo,isAudio,isPreview,
  sizeChange,
  currentChange,downloadFileAsAlink,
  handleUdmpHref,
  throttle,getRightFileSize,getLoadingStatus
} from '@/util/utils'
import { ESTABLISH_COURSE_MAP, busiTypes, yesOrNoMap, TRAININGMODE } from '@/util/constants'
import ImageViewer from '@/components/image-viewer'
import SectionBlock from '@/components/section-block'
import UploadUdmp from '@/components/upload/UploadUdmp.vue'
import MediaUploadUdmp from '@/components/upload/MediaUploadUdmp.vue'
import {fileDownload} from '@/util/udmp'
import {findAssignmentDetailForSubmit,findAssignmentCommentDetailByMyself,saveAssignmentComment} from '@/fetch/establish'
export default {
  name: 'TrainingHomework',
  components:{
      ImageViewer,SectionBlock,UploadUdmp,MediaUploadUdmp
  },
  props: {
    params: {
      type: Object | null,
      default: null
    },
    isShowReturn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      getRightFileSize,throttle,
      isImage,isVideo,isAudio,isPreview,handleUdmpHref,
      submitTxt:'提交作业',
      isNoEmpty:true,//是否空白作业
      finishResByMyself: false,
      pictureVisible:false,
      formRules: {
          commentContent: [{ required: true, trigger: 'blur', message: '请输入文字内容' }],
          mediaList: [{ required: true, trigger: 'blur', message: '请输入图文/视频内容' }],
          attachmentList: [{ required: true, trigger: 'blur', message: '请输入附件内容' }]
      },
      userInfo:{},
      disabledSumbit:false,
      // 基本信息表单
      baseInfoForm: {
        homeworkType:'',
        wordLimit:'',
        deadline:'',
        assignmentContent:'',
        commentContent:'',
        fileInformationList:[],
        mediaList:[],//图文/视频作业附件
        attachmentList:[]//文档作业附件
      },
      canEditFlag:true,//能否编辑
      bakData:{},//数据备份
      uploadFileTypes: ['doc','docx','pdf','ppt','pptx','xls','xlsx'],
      imageList:[],
      prevOverflow:'',
      assignmentId: this.$route.query.assignmentId, //作业ID
      businessId: this.$route.query.businessId, //业务id；培训班类型为classId
      businessType: this.$route.query.businessType, //业务类型:class培训班
    }
  },
  computed:{
    isUploading () {
      return this.baseInfoForm.attachmentList.some((m) => m.uploadStatus === UPLOAD_STATUS_SCZ)
    }
  },
  methods: {
    getLoading(key, isSync = false){
      return getLoadingStatus(key, isSync)
    },
    mouseenterHandle(obj) {
      this.$set(obj, 'showAction', true)
    },
    mouseleaveHandle(obj){
      this.$set(obj, 'showAction', false)
    },
    cancelEdit(){
      this.baseInfoForm = JSON.parse(this.bakData)
      // if(this.baseInfoForm.assignmentType == 2){
      //   this.$refs.attachUploadRef && this.$refs.attachUploadRef.setFileList(this.baseInfoForm.attachmentList)
      // }
      if(this.baseInfoForm.assignmentType == 1){
        this.$refs.mediaUploadRef && this.$refs.mediaUploadRef.setFileList(this.baseInfoForm.mediaList)
      }
      this.canEditFlag = false
    },
    beginEdit(){
      this.canEditFlag = true
    },
    saveDraft(){
      if(this.isUploading){
       this.$message.warning('文件正在上传!')
       return;
      }
      let fileList = []
      if(this.baseInfoForm.assignmentType==1){
        fileList = this.baseInfoForm.mediaList
      }
      if(this.baseInfoForm.assignmentType==2){
        fileList = this.baseInfoForm.attachmentList
      }
      //把上传的文件名重命名，方便下载
      fileList.forEach((item,index)=>{
        //const pos = item.name.lastIndexOf('.')
        //const prename = item.name.substr(0,pos)
        //const aftname = item.name.substr(pos)
        //item.fileName = this.userInfo.empName + '_'+ item.name
      })
      const data = {
        assignmentId:this.assignmentId,
        businessId:this.businessId,
        businessType:this.businessType,
        publishStatus:0,//提交作业发布状态0暂存，1已提交，2逾期提交
        fileInformationList:fileList,
        commentContent:this.baseInfoForm.commentContent
      }
      saveAssignmentComment({data}).then((res) => {
        this.$message.success('保存作业成功')
        setTimeout(_=>{
          location.reload()//页面刷新
        },500)
      })
    },
    submitHomework(){
      if(this.isUploading){
       this.$message.warning('文件正在上传!')
       return;
      }
      let fileList = []
      if(this.baseInfoForm.assignmentType==1){
        fileList = this.baseInfoForm.mediaList
      }
      if(this.baseInfoForm.assignmentType==2){
        fileList = this.baseInfoForm.attachmentList
        fileList.forEach(item=>{
          item.fileName = item.name
          item.sizes = item.size
        })
      }
      //把上传的文件名重命名，方便下载
      fileList.forEach((item,index)=>{
        const pos = item.fileName.lastIndexOf('.')
        const prename = item.fileName.substr(0,pos)
        const aftname = item.fileName.substr(pos)
        //item.fileName = prename + '_'+ index+aftname
        item.fileName = this.userInfo.empName + '_'+ prename + '_'+ index+aftname
      })
      const data = {
        assignmentId:this.assignmentId,
        businessId:this.businessId,
        businessType:this.businessType,
        publishStatus:1,//提交作业发布状态0暂存，1已提交，2逾期提交
        fileInformationList:fileList,
        commentContent:this.baseInfoForm.commentContent
      }
      saveAssignmentComment({data}).then((res) => {
        this.$message.success('提交作业成功')
        setTimeout(_=>{
          location.reload()//页面刷新
        },500)
      })
    },
    async handleReview(file){
      if(file.fileUrl){
        window.open(file.fileUrl,'_blank')
      }else{
        let blob = null
        let reader = new FileReader()
        let type = file.raw.type
        reader.onload = e=>{
          if(typeof e.target.result==='object'){
            blob = new Blob([e.target.result],{type})
          }else{
            blob = e.target.result
          }
          const url = URL.createObjectURL(blob)
          window.open(url,'_blank')
        }
        reader.readAsArrayBuffer(file.raw)
      }
    },
    handleDelete(file){
      const index = this.baseInfoForm.attachmentList.findIndex(item=>item.uid==file.uid)
      if(index>-1) this.baseInfoForm.attachmentList.splice(index,1)
    },
    async handleDownload(file){
      try {
        downloadFileAsAlink(await fileDownload(file.udmpId))
      } catch (error) {}
    },
    closeViewer (){
        document.body.style.overflow = this.prevOverflow;
        this.pictureVisible = false;
    },
    handleShowPicture(url){
        this.pictureVisible = true;
        this.prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const index = this.imageList.indexOf(url);
        this.$refs.imgViewer.setInitIndex(index || 0);
    },
    showBigImg(udmpId){
        const url = handleUdmpHref(udmpId)
        handleShowPicture(url)
    },
    handleMediaUploadSuccess ({data,file}) {
      this.baseInfoForm.mediaList.push({
        uid:file.uid,
        udmpId:data.doc_id,
        fileName:file.name,
        sizes:file.size
      })
    },
    handleMediaRemove(file){
      const index = this.baseInfoForm.mediaList.findIndex(item=>item.uid==file.uid)
      if(index>-1) this.baseInfoForm.mediaList.splice(index,1)
    },
    uploadAttachmentReadyHandle(file,fileList) {
      this.baseInfoForm.attachmentList.push(file)
      file.uploadStatus = UPLOAD_STATUS_SCZ
    },
    uploadAttachmentFinishHandle(file) {
      if (file.status !== 'success') return
      let { doc_id, fname } = file.data[0]
      let wat = this.baseInfoForm.attachmentList.find(item=>item.name == fname)
      if(wat){
        wat.udmpId= doc_id
        this.$set(wat,'percent',100)
        this.$set(wat,'status',file.status)
        this.$set(wat,'uploadStatus',UPLOAD_STATUS_YSC)
      }
      this._resetUploadData()
    },
    uploadAttachmentProgressHandle(file,percent){
      let wat = this.baseInfoForm.attachmentList.find(item=>item.name == file.fileName)
      if(wat) {
        this.$set(wat,'percent',percent)
      }
    },
    _resetUploadData() {
      this.uploadType = 'PLAN'
      this.isUploadFile = false
    },
    // 删除上传文件
    delFileHandle(file) {
      this.baseInfoForm.attachmentList = this.baseInfoForm.attachmentList.filter(
        (item) => item.udmpId !== file.udmpId
      )
    },
    getMySubmitAssignment(){
      const data = {
        assignmentId:this.assignmentId,
        businessId:this.businessId,
        businessType:this.businessType
      }
      findAssignmentCommentDetailByMyself({data}).then((res) => {

        this.isNoEmpty = false;
          this.baseInfoForm.commentContent = res.commentContent
          this.baseInfoForm.publishStatus = res.publishStatus
          this.baseInfoForm.commentId = res.commentId
          if(res.fileInformationList && res.fileInformationList.length) {
            res.fileInformationList.forEach(v => {
              v.sizes = v.fileSize
            })
          }
          if(res.assignmentType==1){
            this.baseInfoForm.mediaList = res.fileInformationList
            this.$refs.mediaUploadRef && this.$refs.mediaUploadRef.setFileList(this.baseInfoForm.mediaList)
          }
          if(res.assignmentType==2){
            this.baseInfoForm.attachmentList = res.fileInformationList
            this.baseInfoForm.attachmentList.forEach(item=>{
              item.name = item.fileName
              item.size = item.sizes
              item.percent = 100
            })
          }
          this.bakData = JSON.stringify(this.baseInfoForm)
          if(res.allowSubmit==0||res.allowSubmit==3){
            this.canEditFlag = false;//不可编辑
          }
          if(this.baseInfoForm.commentId && (this.baseInfoForm.allowSubmit==1 ||this.baseInfoForm.allowSubmit==2)){
            this.canEditFlag = false
          }

          if(this.baseInfoForm.commentId && (this.baseInfoForm.allowSubmit==0 || this.baseInfoForm.allowSubmit==3)) {this.disabledSumbit = true}
          else this.disabledSumbit = false

          if(this.baseInfoForm.allowRepeatSubmit==0 && this.baseInfoForm.commentId) this.submitTxt= '不允许重复提交'
          if(this.baseInfoForm.allowSubmit==3 && this.baseInfoForm.commentId) this.submitTxt= '逾期不可提交'
          if(this.baseInfoForm.allowSubmit==2) this.submitTxt= '重新提交作业'
      }).catch(err=>{
        this.isNoEmpty = true;
      }).finally(()=>{
        this.finishResByMyself = true
      })
    },
    getAssignment(){
      const data = {
        assignmentId:this.assignmentId,
        businessId:this.businessId,
        businessType:this.businessType
      }
      findAssignmentDetailForSubmit({data}).then((res) => {
        this.isNoEmpty = false;
          this.baseInfoForm = Object.assign(this.baseInfoForm,res)
          if(res.assignmentType==0){
            this.baseInfoForm.homeworkType = '文字作业'
          }
          if(res.assignmentType==1){
            this.baseInfoForm.homeworkType = '图文/视频作业'
            delete this.formRules.attachmentList
          }
          if(res.assignmentType==2){
            this.baseInfoForm.homeworkType = '文档作业'
            delete this.formRules.mediaList
          }
          if(res.allowDeadlineSubmit==0 && res.deadline){
            this.baseInfoForm.deadline+=' 逾期不可提交'
          }
      }).catch(err=>{
        this.isNoEmpty = true;
      })
    }
  },
  created(){
    store.state.app.isFullScreen = true;
    this.submitHomework = throttle(this.submitHomework)
    //获取用户登录信息
    this.userInfo = store.state.userInfo
  },
  mounted() {
    this.getAssignment()
    setTimeout(_=>{
      this.getMySubmitAssignment()
    },150)

    setTimeout(_=>{
      //获取用户登录信息
      this.userInfo = store.state.userInfo
    },1000)
  }
}
</script>

<style lang="scss">
.lixiang .base-info .form  {
    // width: 670px;
    margin: 0 auto;
}
</style>
<style scoped lang="scss">
.if-conformance :deep(.el-form-item__label){
  width: inherit !important;
}
.if-conformance .inherit{
  display: inherit !important;
}
.m-t-20{
    margin-top: 20px;
}
.m-tb-20{
    margin-top: -30px;
}
.df{
    align-items: center;
}
.case-item{
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width:1098px;
    height: 44px;
    padding-left: 20px;
}
.case-item:hover{
    background: #f7f8fa;
}
.content{
  display: flex;
  justify-content: space-between;
  // width:1055px;
}
.case-type {
    display: flex;
    align-items: center;
    // background: #f7f8fa;
    opacity: 0.8;
    font-size: 14px;
    color: #000000;
    letter-spacing: 0.23px;
    font-weight: 400;
}

.pdf{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_pdf_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.doc{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_doc_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.docx{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_docx_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.ppt{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_ppt_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.pptx{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_pptx_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.xls{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_xls_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.xlsx{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_xlsx_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.jpeg{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_jpeg_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.png{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_png_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.mp3{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_mp3_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.rar{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_rar_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.zip{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_zip_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.mp4{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_mp4_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}
.jpg{
  width: 20px;
  height: 25px;
  background: url('../../../../src/assets/svg/app_jpg_icon.svg') center no-repeat;
  background-size: auto 100%;
  margin-right: 10px;
}

.opration-attach{
    .preview{
        background: url('../../../../src/assets/images/web_black_preview_icon.svg') center no-repeat;
    }
    .download{
        background: url('../../../../src/assets/images/web_black_download_icon.svg') center no-repeat;
    }
}
.m-r-20{
    margin-right: 20px;
}
.icon-size{
    display: flex;
    align-items: center;
    width: 20px;
    height: 25px;
    &:hover{
      color: #FF4800;
      cursor: pointer;
      font-weight: 900;
    }
}
.assignment-describe{
  font-size: 14px;
  margin-left: 30px;
  // width: 1100px;
}

:deep(table){
  margin: 5px;
    border: 1px solid #EAECF1;
    td{
        padding: 5px;
        border: 1px solid #EAECF1;
        border-width: 0 1px 1px 0;
    }
    tr{
        padding: 5px 0;
        border: 1px solid #EAECF1;
        border-width: 0 1px 1px 0;
    }
    th{ text-align: left;
        padding: 5px;
        border: 1px solid #EAECF1;
        border-width: 0 1px 1px 0;
        background: #f6f6f6;
    }
}
.page-title{
  font-size: 20px;
  color: #000000;
  line-height: 22px;
  font-weight: 600;
  text-align: center;
}
.page-info{
  opacity: 0.39;
  font-size: 12px;
  color: #000000;
  line-height: 18px;
  font-weight: 400;
  text-align: center;
  margin-top:20px;
}
.file-left{
  display: flex;
  line-height: 24px;
}
.editor-wrapper{
  width: 100%;
  background: #fff;
  padding: 30px 280px;
}
.had_submit{
  position: relative;
  text-align: center;
  font-size: 16px;
  color: #000000;
  line-height: 22px;
  font-weight: 400;
  margin: 25px;
}
.had_submit::before{
  position: absolute;
  left: calc(50% - 70px);
  content:'';
  width: 24px;
  height: 24px;
  display: inline-block;
  background: url('~@/assets/svg/web_hint_win_icon.svg') center no-repeat;
  background-size: 100%;
}
.upload-info{
  font-size: 12px;
  color: #000000;
  margin-bottom: 10px;
  span{
    color: #b4b6bc;
    letter-spacing: 0.23px;
    font-weight: 400;
    font-size: 12px;
  }
}
.el-form-item {
  margin-bottom: 10px;
}
:deep(.el-form-item__label),
:deep(.el-form-item__content){
  line-height: 20px!important;
}
.page-input{
  margin-left: -10px;
}
.title{
  margin: 20px 0;
}
.footer-box{
  position: fixed;
    width: 100%;
    left: 0;
    bottom: 0px;
}
.place-holder{
  height: 100px;
}
.input-text{
  font-size: 14px!important;
}
</style>