<template>
  <div class="CaseCenter__CaseLabelManage">
    <el-card>
      <div class="between">
        <div class="fz14 shallow">{{ blgStripLineMaping[blgStripLine] }}</div>
        <el-button @click="saveSubmit" class="button-w80-h30" type="primary">保存</el-button>
      </div>
    </el-card>
    <el-card class="mt10">
      <div class="CaseCenter__CaseLabelManage__content">
        <LabelTree
          title="课程标签"
          :caseTags="true"
          @batchImport="importHandle"
          :dataList="curriculumManagement"
          :modificationPart="modificationPart"
          :blgStripLine="blgStripLine"
          tagType="5"
        />
      </div>
    </el-card>
    <!-- 批量添加 -->
    <ImportModel
      width="1000px"
      :show="isUploadShow"
      templateCode="COURSE_TAGS"
      :uploadParams="{ blgStripLine }"
      :importFetchFn="fetchTagBatchImport"
      :faildExportFetchFn="fetchExportFailList"
      :faildColumns="uploadTableColumns"
      @showChange="isUploadShow = $event"
      @comfirm="importSuccessHandle"
    ></ImportModel>
  </div>
</template>
<script setup>
import { merge, CopyObj, getCurriculumTree, arrToTree } from '@/util/utils'
import ImportModel from '@/components/upload/ImportModel.vue'
import LabelTree from '../../CurriculumManagement/components/LabelTree.vue'
import { APIListTags, fetchSaveTage, fetchTagBatchImport, fetchExportFailList, fetchSaveTagBatch } from '@/fetch/caseCenter'
import { ref, reactive, onMounted } from 'vue'
import store from '@/store'
import { Message } from 'element-ui'
const isUploadShow = ref(false)
// 课程分类数组
const curriculumManagement = ref([])
const uploadTableColumns = ref([
  {
    label: '一级',
    prop: 'field1'
  },
  {
    label: '二级',
    prop: 'field2'
  },
  {
    label: '三级',
    prop: 'field3'
  },
  {
    label: '四级',
    prop: 'field4'
  },
  {
    label: '五级',
    prop: 'field5'
  },
  {
    label: '失败原因',
    prop: 'msg',
    width: '200px'
  }
])
// 改动数据存放处
const modificationPart = ref({
  addList: [],
  sortList: [],
  updateList: [],
  deleteList: []
})
const blgStripLineMaping = reactive({
  FL: '非零',
  LS: '零售',
  JF: '金服'
})
const blgStripLine = ref('')
const importHandle = () => {
  isUploadShow.value = true
}
const importSuccessHandle = async ({successBatchId}) => {
  await fetchSaveTagBatch({ data: { batchId: successBatchId } })
  getData()
  Message.success('保存成功')
  isUploadShow.value = false
}
const getData = async () => {
  getCurriculumTree(5, store.state.userInfo.blgStripLine, 0, APIListTags).then(data => {
    curriculumManagement.value = data || []
  })
}
const initBl = () => {
  blgStripLine.value = store.state.userInfo.blgStripLine
  if (!blgStripLine.value) {
    return setTimeout(() => {
      initBl()
    }, 200)
  }
  getData()
}
const resetData = () => {
  return {
    addList: [],
    sortList: [],
    updateList: [],
    deleteList: []
  }
}
const saveSubmit = () => {
  const params = modificationPart.value
  if (params.addList.length > 0 || params.sortList.length > 0 || params.updateList.length > 0 || params.deleteList.length > 0 ) {
    fetchSaveTage({ data: { ...params, blgStripLine: blgStripLine.value } })
      .then(data => {
        Message.success('保存成功')
        getData()
        modificationPart.value = resetData()
      })
      .catch(() => {
        getData()
        modificationPart.value = resetData()
      })
  }
}
onMounted(() => {
  initBl()
})
</script>
<script>
export default {
  name: 'CaseLabelManage'
}
</script>
<style lang="scss" scoped>
.CaseCenter__CaseLabelManage {
  &__tabs {
    display: flex;
    .active-bar {
      width: 24px;
      bottom: -20px;
    }
    &__tab {
      font-size: 14px;
      cursor: default;
    }
  }
  &__content {
    position: relative;
    display: flex;
    .curriculumManagement__labelTree {
      flex: 1;
      &:last-child {
        padding-left: 40px;
      }
    }
    &::before {
      position: absolute;
      display: block;
      content: '';
      width: 0;
      left: 50%;
      top: 46px;
      bottom: 20px;
      border-left: 1px dashed #eaecf1;
    }
  }
}
</style>
