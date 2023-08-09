<template>
  <div class="curriculumManagement__labelManagement">
    <el-card>
      <div class="between">
        <div
          class="curriculumManagement__labelManagement__tabs relative shallow"
        >
          <div class="curriculumManagement__labelManagement__tabs__tab ml20">
            {{ blgStripLineMaping[blgStripLine] }}
          </div>
        </div>
        <div class="curriculumManagement__labelManagement__btns">
          <el-button class="button-w80-h30" type="primary" @click="saveSubmit"
            >保存</el-button
          >
        </div>
      </div>
    </el-card>
    <el-card class="mt10">
      <div class="curriculumManagement__labelManagement__content">
        <LabelTree
          title="课程分类"
          @batchImport="batchImport(1, blgStripLine)"
          :dataList="curriculumManagement"
          :modificationPart="modificationPart"
          :blgStripLine="blgStripLine"
          tagType="1"
        />

        <LabelTree
          title="课程标签"
          @batchImport="batchImport(2, blgStripLine)"
          :dataList="curriculumLabel"
          :modificationPart="modificationPart"
          :blgStripLine="blgStripLine"
          tagType="2"
        />
      </div>
      <div class="curriculumManagement__labelManagement__content mt10">
        <!-- <LabelTree
          title="业务条线"
          @batchImport="batchImport(3, blgStripLine)"
          :dataList="ladderLines"
          :modificationPart="modificationPart"
          :blgStripLine="blgStripLine"
          tagType="3"
        />
        <LabelTree
          title="阶梯课程标签"
          @batchImport="batchImport(4, blgStripLine)"
          :dataList="ladderTags"
          :modificationPart="modificationPart"
          :blgStripLine="blgStripLine"
          tagType="4"
        /> -->
      </div>
    </el-card>

    <InstructorBatchImport
      :title="title"
      :visible="curriculumCategorieyVisible"
      @close="curriculumCategorieyClose"
      @cancel="curriculumCategorieyVisible = false"
      @comfirm="curriculumCategorieyComfirm"
      @change="commonFileInputChange($event, curriculumtCategorieyData, 'file')"
      @templateDownload="templateDownload('/common/file/download/tagCourse')"
    />
  </div>
</template>

<script>
import {
  merge,
  CopyObj,
  jsonHeaders,
  dataHeaders,
  downloadFile,
  tagFileImportHint,
  getCurriculumTree,
  commonFileInputChange,
  fileImportHint,
  templateDownload
} from '../../util/utils'
import LabelTree from './components/LabelTree'
import InstructorBatchImport from '../../components/dialogs/InstructorBatchImport.vue'
export default {
  name: 'CurriculuLabelManagement',
  components: { LabelTree, InstructorBatchImport },
  data() {
    return {
      // 课程分类批量导入 dialog 状态
      curriculumCategorieyVisible: false,
      // 课程分类批量导入 文件存储对象
      curriculumtCategorieyData: {},
      // 课程分类数组
      curriculumManagement: [],
      // 课程标签数组
      curriculumLabel: [],
      // 业务条线数组
      ladderLines: [],
      // 阶梯课程标签数组
      ladderTags: [],
      // 改动数据存放处
      modificationPart: {
        addList: [],
        sortList: [],
        updateList: [],
        deleteList: []
      },
      nodeObj: {
        // 标签id
        tagId: '',
        // 标签名字
        tagName: '',
        // 父标签id
        parentTagId: '',
        // 知识库id
        syncId: '',
        // 知识库父级id
        parentSyncId: '',
        // 1:课程分类,2:标签
        tagType: '',
        // 条线
        blgStripLine: '',
        // 标签层级,根标签为0
        tagLevel: ''
      },
      commonFileInputChange,
      templateDownload,
      blgStripLineMaping: {
        FL: '非零',
        LS: '零售',
        JF: '金服'
      },
      blgStripLine: '',
      title: ''
    }
  },
  methods: {
    batchImport(tagType, blgStripLine) {
      this.curriculumCategorieyVisible = true
      this.curriculumtCategorieyData.tagType = tagType
      this.curriculumtCategorieyData.blgStripLine = blgStripLine
      this.title = tagType == '1' ? '课程分类批量导入' : '课程标签批量导入'
    },
    getData() {
      getCurriculumTree(1, this.blgStripLine, 0).then((res) => {
        this.curriculumManagement = res
      })
      getCurriculumTree(2, this.blgStripLine, 0).then((res) => {
        this.curriculumLabel = res
      })
      getCurriculumTree(3, this.blgStripLine, 0).then((res) => {
        this.ladderLines = res
      })
      getCurriculumTree(4, this.blgStripLine, 0).then((res) => {
        this.ladderTags = res
      })
    },
    initBl() {
      this.blgStripLine = this.$store.state.userInfo.blgStripLine
      if (!this.blgStripLine) {
        return setTimeout(() => {
          this.initBl()
        }, 200)
      }
      this.getData()
    },
    // 保存所有操作
    saveSubmit() {
      const data = this.modificationPart
      if (
        data.addList.length > 0 ||
        data.sortList.length > 0 ||
        data.updateList.length > 0 ||
        data.deleteList.length > 0
      ) {
        this.$axios
          .post(
            '/fn/course/tag/saveCourseTagInfo',
            {
              data: {
                ...data,
                blgStripLine: this.blgStripLine
              }
            },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              if (data.Classify.status == 0) {
                this.$message.success('保存成功')
              } else {
                this.$message.info(data.Classify.message)
              }
            }
            this.getData()
            this.modificationPart = this.resetData()
          })
      }
    },
    resetData() {
      return {
        addList: [],
        sortList: [],
        updateList: [],
        deleteList: []
      }
    },
    // 批量上传 确认事件
    curriculumCategorieyComfirm() {
      if (this.curriculumtCategorieyData.file) {
        const data = new FormData()
        Object.keys(this.curriculumtCategorieyData).forEach((key) => {
          data.append(key, this.curriculumtCategorieyData[key])
        })
        this.$axios
          .post('/courseFileFunc/tag/courseTagBatchImport', data, dataHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              fileImportHint(data)
              this.getData()
            }
          })
      }
      this.curriculumCategorieyVisible = false
    },
    // 批量上传 关闭事件
    curriculumCategorieyClose() {
      Object.keys(this.curriculumtCategorieyData).forEach((key) => {
        this.curriculumtCategorieyData[key] = ''
      })
      this.curriculumCategorieyVisible = false
    }
  },
  mounted() {
    this.initBl()
  }
}
</script>

<style lang="scss">
.curriculumManagement__labelManagement {
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
