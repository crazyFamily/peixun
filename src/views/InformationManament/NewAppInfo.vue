<template>
  <div class="full dfc bgf new-app-container">
    <el-form :model="queryForm" inline :rules="formRules" ref="formRef">
      <div>
        <el-form-item label="标题" label-width="140px" prop="title">
          <el-input
            class="w500 info-title"
            placeholder="标题"
            v-model="queryForm.title"
            :maxlength="maxTitleLen"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="封面" label-width="140px">
          <gc-upload
            ref="uploadRef"
            :list="coverIdUploadList"
            single
            v-model="coverIdAttachList"
          ></gc-upload>
          <p class="tintColor mt10">仅支持 jpg、png格式</p>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="内容" label-width="140px" prop="content">
          <gc-editor
            @change="editorChangeHandle"
            :content-text="detailContent"
          ></gc-editor>
        </el-form-item>
      </div>
      <div>
        <el-form-item label="附件" label-width="140px">
          <udmp-upload
            :size="50 * 1024 * 1024"
            :on-before="fileListChangeBefore"
            :on-sucess="fileListChange"
            :accept="uploadAcceptType"
          >
            <span class="ml10 tintColor">单个附件50M以内</span>
            <span class="ml10 tintColor"
              >仅支持{{ uploadFileTypes.join(', ') }}类型的附件</span
            >
          </udmp-upload>
          <div class="input-file-list">
            <div
              class="content"
              v-for="(item, index) in inputFileList"
              :key="index"
            >
              <el-tag
                class="tag-item"
                type="warning"
                closable
                :disable-transitions="false"
                @close="delFileHandle(item)"
              >
                {{ item.fileName }}
              </el-tag>
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div class="dfcc new-app-footer">
      <el-button class="button-w80-h30" @click="closePageHandle()"
        >取消</el-button
      >
      <el-button class="button-w80-h30" @click="saveDraft">存草稿</el-button>
      <el-button class="button-w80-h30" type="primary" @click="savePublish"
        >发布</el-button
      >
    </div>
  </div>
</template>

<script>
import gcEditor from '@/components/editor'
import { closeCurrPage, addAllowKeepAlive } from '@/util/utils'
import {
  fetchSaveOrUpdateRealInfo,
  fetchFindRealInfo
} from '@/fetch/informationManament'
import { handleUdmpHref } from '@/util/utils'
// 新建APP资讯
export default {
  name: 'NewAppInfo',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      queryForm: {
        title: '',
        content: '',
        type: 'app',
        status: '',
        attachList: []
      },
      editor: null,
      editorData: '',
      inputFileList: [],
      closeCurrPage,
      formRules: {
        title: [
          requiredHandle('请输入标题'),
          {
            validator: (rule, value, callback) => {
              if (value.length > this.maxTitleLen)
                return callback(
                  new Error(`标题最多可输入${this.maxTitleLen}个字符`)
                )
              return callback()
            }
          }
        ],
        content: [requiredHandle('请输入内容')]
      },
      coverIdUploadList: [],
      coverIdAttachList: [],
      editorContLen: 0,
      maxTitleLen: 50,
      maxContentLen: 200,
      detailContent: '',
      uploadFileTypes: ['pdf']
    }
  },

  components: {
    gcEditor
  },

  computed: {
    uploadAcceptType() {
      let types = this.uploadFileTypes.map((item) => `.${item}`)
      let result = types.reduce((curr, value) => {
        return curr.concat([value.toLowerCase(), value.toUpperCase()])
      }, [])
      return result.join(',')
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this._getDetailData()
    }
  },

  methods: {
    // 监听富文本组件回调
    editorChangeHandle(data) {
      this.queryForm.content = data.content
      this.editorContLen = data.len
    },
    // 拉取详情
    async _getDetailData() {
      let { attachList, content, title, id, coverId } = await fetchFindRealInfo(
        { id: this.$route.params.id }
      )
      this.queryForm = {
        id,
        title,
        content,
        attachList,
        type: 'app',
        status: ''
      }
      if (coverId) {
        this.coverIdAttachList = [
          {
            fileName: '图片',
            udmpId: coverId
          }
        ]
        this.coverIdUploadList = [
          {
            name: '图片',
            url: handleUdmpHref(coverId)
          }
        ]
      }
      this.inputFileList = attachList
      this.detailContent = content
    },
    // 发草稿
    saveDraft() {
      let condition = { ...this._formatParam(), status: 'draft' }
      this.sentInfo(condition)
    },
    // 发布
    savePublish() {
      this.$refs.formRef.validate(async (v) => {
        if (!v) return false
        let condition = { ...this._formatParam(), status: 'publish' }
        this.sentInfo(condition)
      })
    },
    // 处理发往后端的入参
    _formatParam() {
      let coverId = undefined
      if (this.coverIdAttachList.length) {
        coverId = this.coverIdAttachList[0].udmpId
      }
      let condition = {
        ...this.queryForm,
        coverId,
        attachList: this.inputFileList
      }
      return condition
    },
    // 发送
    async sentInfo(condition) {
      await fetchSaveOrUpdateRealInfo({ condition })
      this.$message.success('提交成功')
      this.closePageHandle()
    },
    closePageHandle() {
      closeCurrPage()
      // 跳回到资讯页面
      addAllowKeepAlive('/InformationManament')
      this.$router.push({ name: '资讯管理' })
    },
    fileListChangeBefore() {},
    fileListChange(data) {
      let { fileName, udmpId } = data[0]
      if (fileName && udmpId) {
        this.inputFileList.push({ fileName, udmpId })
      }
    },
    // 删除上传文件
    delFileHandle(file) {
      this.inputFileList = this.inputFileList.filter(
        (item) => item.udmpId !== file.udmpId
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import './publicStyles.scss';
.new-app-container {
  position: relative;
  box-sizing: border-box;
  padding: 40px 0 70px 0;
  min-height: 100%;
  height: auto;
}

.new-app-footer {
  width: 100%;
  height: 70px;
  position: absolute;
  left: 0;
  bottom: 0;
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.05);
}

.input-file-list {
  margin-top: 20px;

  .tag-item {
    margin-bottom: 10px;
  }

  :deep(.tag-item) {
    &.el-tag--warning {
      background-color: #f7f8fa;
      border: unset;
      color: initial;
    }
    &.el-tag--warning .el-tag__close {
      color: #aeb0b8;
    }

    &.el-tag--warning .el-tag__close:hover {
      background-color: unset;
    }
  }
}
</style>