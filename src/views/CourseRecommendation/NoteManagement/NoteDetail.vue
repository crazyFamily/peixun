<template>
  <!-- 23.10.12版本原笔记字段名称全部更新为评论字段 -->
  <gc-model title="评论详情" width="1100px" :visible.sync="isDialogShow" cancelText="关闭" :comfirmText="detailInfo.status === 0 ? '屏蔽' : detailInfo.status === 1 ? '启用': '确认'" @comfirm="changeNoteStatus" @cancel="closeModal" @close="closeModal">
    <div class="note-detail-wrapper">
      <div class="note-detail-form">
        <el-form ref="detailInfo" :model="detailInfo" label-width="90">
          <el-form-item label="评论内容：">
            <p>{{detailInfo.content}}</p>
          </el-form-item>
          <el-form-item label="图片：" v-if="detailInfo.listPic && detailInfo.listPic.length">
            <div class="note-detail-pic-list">
              <div class="pic-item-container" v-for="(pic, index) in detailInfo.listPic" :key="index">
                <el-image style="width: 100%; height: 100%;" :src="pic" :preview-src-list="detailInfo.listPic"></el-image>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="关联课程ID：">
            <p>{{detailInfo.sbjId}}</p>
          </el-form-item>
          <el-form-item label="所属课程：">
            <p class="note-detail-blgCourse" @click="goCourseDetail">{{detailInfo.courseName}}</p>
          </el-form-item>
          <el-form-item label="发布人：">
            <p>{{detailInfo.createdBy}}</p>
          </el-form-item>
          <el-form-item label="发布时间：">
            <p>{{detailInfo.createdDate}}</p>
          </el-form-item>
          <el-form-item label="评论状态：">
            <p>{{detailInfo.status === 0 ? '正常' : detailInfo.status === 1 ? '屏蔽' : ''}}</p>
          </el-form-item>
        </el-form>
        <template v-if="reviewList && reviewList.length">
          <p class="detail-review-title">回复列表：</p>
          <table-pagination ref="courseNoteTable" :list="NOTE_COMMENT_COLUMNS" :tableList="reviewList" :getList="getReviewList" :queryForm="queryReview" :pageSizes="[5, 10, 20]">
            <el-table-column label="操作" width="100" prop="" fixed="right">
              <template slot-scope="scope">
                <span class="note-detail-opera" @click="updateReviewStatus(scope.row)">{{scope.row.status === 0 ? '屏蔽' : scope.row.status === 1 ? '启用' : ''}}</span>
              </template>
            </el-table-column>
          </table-pagination>
        </template>
      </div>
    </div>
  </gc-model>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from '@/router'
import { addAllowKeepAlive } from '@/util/utils'
import { NOTE_COMMENT_COLUMNS } from '@/views/CourseRecommendation/enum'
import { fetchSearchCourseByCourseId, fetchCommentList } from '@/fetch/courseRecommendation'

// 评论查询条件
let queryReview = reactive({
  prnId: null, // 笔记id
  currPage: 1,
  pageSize: 10,
  total: 0
})
let reviewList = ref([])
// 获取评论列表
const getReviewList = async () => {
  const res = await fetchCommentList({ data: queryReview })
  reviewList.value = res.list || []
  queryReview.total = res.total || 0
}

const emit = defineEmits(['update:isShowDetail', 'updateStatus'])
// 关闭笔记详情
const closeModal = () => {
  // 重置评论列表
  queryReview.currPage = 1
  queryReview.pageSize = 10
  emit('update:isShowDetail', false)
}

const reQuery = () => {
  queryReview.currPage = 1
  getReviewList()
}

// 启用/屏蔽 笔记
const changeNoteStatus = () => {
  emit('updateStatus', { id: props.id, status: props.detailInfo?.status })
  closeModal()
}

// 启用/屏蔽 评论
const updateReviewStatus = (row) => {
  emit('updateStatus', { ...row, review: true })
}

const router = useRouter()
// 跳转课程详情
const goCourseDetail = async () => {
  let data = { courseId: props?.detailInfo?.sbjId }
  const params = await fetchSearchCourseByCourseId({ data })
  addAllowKeepAlive('/CRNewCourse')
  router.push({
    name: '新增课程',
    params: { ...params, state: 'edit' }
  })
}

const props = defineProps({
  detailInfo: {
    type: Object,
    default: () => { }
  },
  id: {
    type: Number,
    default: null
  },
  isShowDetail: {
    type: Boolean,
    default: false
  }
})
let isDialogShow = ref(false)
watch(
  () => [props.isShowDetail, props.id],
  ([newIsShow, newId]) => {
    isDialogShow.value = newIsShow
    if (newIsShow && newId) {
      queryReview.prnId = newId
      getReviewList()
    }
  })

defineExpose({
  reQuery
})
</script>

<style scoped>
.note-detail-wrapper {
  background-color: #fff;
}
.note-detail-form {
  margin: auto;
  padding: 20px 80px 10px 80px;
}
.note-detail-opera {
  margin-right: 10px;
  color: #fd6720;
  cursor: pointer;
}
.note-detail-pic-list {
  display: flex;
  flex-wrap: wrap;
}
.pic-item-container {
  width: 145px;
  height: 145px;
  border-radius: 6px;
  border: 1px solid #e0e1e3;
  position: relative;
  overflow: hidden;
  margin: 0 10px 10px 0;
}
.note-detail-blgCourse {
  cursor: pointer;
  color: #fd6720;
  text-decoration: underline;
}
.detail-review-title {
  margin-bottom: 22px;
}
:deep(td:first-of-type .cell) {
  padding: 0 16px;
  display: inline-block;  
}
</style>