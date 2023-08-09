<template>
  <el-drawer
    :visible.sync="isShow"
    :close-on-press-escape="false"
    :wrapper-closable="false"
    size="75%"
  >
    <div class="case-draft-container">
      <el-scrollbar class="main-box">
        <div class="main-container">
          <el-form
            class="base-info-form"
            :model="baseInfoForm"
            :disabled="disabled"
            ref="baseInfoFormRef"
          >
            <el-form-item
              class="base-info-item"
              :label-width="formLabelWidth"
              label="案例名称"
              prop="caseName"
            >
              <el-input :value="baseInfoForm.caseName" disabled></el-input>
            </el-form-item>
            <el-form-item
              class="base-info-item"
              :label-width="formLabelWidth"
              label="课件名称"
              prop="courseName"
            >
              <el-input
                :value="baseInfoForm.coursewareName"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              class="base-info-item"
              :label-width="formLabelWidth"
              label="文稿类型"
              prop="txtType"
            >
              <el-radio-group
                v-model="baseInfoForm.txtType"
                class="radio-group"
              >
                <p class="radio-item">
                  <el-radio :label="CASE_DRAFT_TYPE.ai" class="radio-control"
                    >AI文稿</el-radio
                  >
                  <span class="tips"
                    >系统自动将语音翻译成文稿，移动端播放时，正在播放的文字可自动高亮标识</span
                  >
                </p>
                <p class="radio-item">
                  <el-radio :label="CASE_DRAFT_TYPE.txt" class="radio-control"
                    >手动文稿</el-radio
                  >
                  <span class="tips"
                    >请将内容复制到编辑框，编辑完成后提交即可，此模式不支持播放时文字自动高亮标识
                  </span>
                </p>
              </el-radio-group>
              <!-- AI文稿控件 -->
              <div
               class="type-controls ai-controls"
                v-show="baseInfoForm.txtType === CASE_DRAFT_TYPE.ai"
              >
                <AmsPlayer
                  :url="
                    baseInfoForm.udmpUrl || handleUdmpHref(baseInfoForm.udmpId)
                  "
                  :title="baseInfoForm.coursewareName"
                  :pic="require('@/assets/images/player-bj.png')"
                  style="flex: 1"
                ></AmsPlayer>
                <el-button
                  @click="voiceToTextHandle"
                  type="primary"
                  v-show="!baseInfoForm.orderNo"
                  :disabled="disabled"
                  >开始转译</el-button
                >
                <el-button
                  type="primary"
                  v-show="baseInfoForm.orderNo && !aiTextList.length"
                  disabled
                >
                  <img src="@/assets/svg/rotate.svg" alt="" />
                  转译中...
                </el-button>
                <el-button
                  type="primary"
                  v-show="baseInfoForm.orderNo && aiTextList.length"
                  disabled
                >
                  转译完成
                </el-button>
                <el-button
                  @click="getAIresultHandle"
                  :disabled="Boolean(aiTextList.length)"
                  >查询结果</el-button
                >
                <el-button @click="reset" :disabled="disabled">重置</el-button>
              </div>
            </el-form-item>
            <el-form-item
              prop="AIContent"
              v-show="
                baseInfoForm.txtType === CASE_DRAFT_TYPE.ai && aiTextList.length
              "
              :label-width="formLabelWidth"
              label="识别内容"
            >
              <div class="ai-text-wrapper" v-show="!isAITextDone">
                <div class="ai-text-container">
                  <template v-for="(item, index) in aiTextList">
                    <div class="ai-text-list" :key="index">
                      <span class="label-time">{{
                        item.startTime | formatSecond
                      }}</span>
                      <el-input
                        v-model="aiTextList[index]['speechText']"
                      ></el-input>
                    </div>
                  </template>
                </div>
                <el-button
                  @click="finishTextEditHandle"
                  style="height: 30px; margin-left: 15px"
                  >完成编辑</el-button
                >
              </div>
              <div class="ai-text-wrapper" v-show="isAITextDone">
                <div class="ai-text-container">
                  <el-input
                    type="textarea"
                    :rows="15"
                    resize="none"
                    :value="aiResultText"
                    disabled
                  ></el-input>
                </div>
                <el-button
                  class="control-button active"
                  @click="setTextEditHandle"
                  style="height: 30px"
                  v-if="!disabled"
                  >编辑</el-button
                >
              </div>
            </el-form-item>
            <el-form-item
              prop="txtContent"
              v-show="baseInfoForm.txtType === CASE_DRAFT_TYPE.txt"
              :label-width="formLabelWidth"
              label=" "
            >
              <AmsPlayer
                v-if="baseInfoForm.udmpUrl"
                :url="baseInfoForm.udmpUrl"
                :title="baseInfoForm.coursewareName"
                :pic="require('@/assets/images/player-bj.png')"
                style="flex: 1"
              ></AmsPlayer>
              <GcEditor
                @change="editorChangeHandle"
                :content-text="detailContent"
                width="100%"
                v-if="!disabled"
              ></GcEditor>
              <div class="draft-wrapper w-e-text-container" v-if="disabled">
                <div
                  class="ai-paper__paragraph w-e-text"
                  ref="textDrafContent"
                  v-html="detailContent"
                ></div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="footer-box dfc">
        <el-button
          class="button-w80-h30"
          @click="closeHandle(disabled ? null : 'isNeedTips')"
          >取消</el-button
        >
        <el-button
          class="button-w80-h30"
          type="primary"
          @click="saveHandle"
          :disabled="disabled"
          >提交</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>

<script>
import 'wangeditor/src/assets/style/common.less'
import 'wangeditor/src/assets/style/text.less'
import GcEditor from '@/components/editor'
import AmsPlayer from '@/components/player'
import { CASE_DRAFT_TYPE } from '@/util/constants'
import {
  fetchVoiceToText,
  fetchFindVoiceToTextList,
  fetchUploadCaseCourseTxt
} from '@/fetch/caseCenter'
import { CopyObj, handleUdmpHref, customHint } from '@/util/utils'
export default {
  name: 'CaseDraft',

  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    courseInfo: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    show: {
      handler(n) {
        if (n) {
          this._initData()
        }
      },
      immediate: true
    }
  },

  filters: {
    formatSecond(value) {
      let mm = value % 3600
      let h = Math.floor(value / 3600)
      let m = Math.floor(mm / 60)
      let s = Math.floor(value % 60)
      return `${h}:${m}:${s}`
    }
  },

  data() {
    return {
      status: 'create',
      baseInfoForm: {
        orderNo: null,
        caseName: '',
        coursewareName: '',
        txtType: CASE_DRAFT_TYPE.ai,
        udmpUrl: '',
        txtContent: ''
      },
      formLabelWidth: '100px',
      detailContent: ' ',
      aiTextList: [],
      isAITextDone: true,
      CASE_DRAFT_TYPE,
      isSendingVoice: false,
      fetchUploadCaseCourseTxt,
      handleUdmpHref
    }
  },

  components: { GcEditor, AmsPlayer },

  computed: {
    aiResultText() {
      return this.aiTextList.map((item) => item.speechText).join('\r\n')
    },
    isShow() {
      return this.show
    }
  },

  mounted() {},

  methods: {
    _initData() {
      this.baseInfoForm = {
        ...this.baseInfoForm,
        ...CopyObj(this.courseInfo),
        txtType: this.courseInfo.txtType || CASE_DRAFT_TYPE.ai
      }

      // 处理富文本回显
      this.$nextTick(() => {
        this.detailContent = this.baseInfoForm.txtContent
      })

      // 接口返回的txtList会有为null类型的可能
      this.aiTextList = this.baseInfoForm.txtList || []
      this.isAITextDone = this._validatorAiTextDone()
    },
    // 校验是否已经转译完成
    _validatorAiTextDone() {
      if (
        this.baseInfoForm.txtType === CASE_DRAFT_TYPE.ai &&
        this.baseInfoForm.txtList &&
        this.baseInfoForm.txtList.length
      ) {
        return true
      }
      return false
    },
    _formatParams(data) {
      let res = CopyObj(data)
      if (res.txtType === CASE_DRAFT_TYPE.txt) {
        res.orderNo = null
      }
      return res
    },
    async closeHandle(isNeedTips = false) {
      isNeedTips &&
        (await customHint(
          '取消将不会保存当前修改内容，请确认！',
          '提示',
          '取消'
        ))
      this.closeReset()
      this.$emit('update:show', false)
    },
    saveHandle() {
      this.$emit('save', {
       ...this._formatParams(this.baseInfoForm),
        txtList: this.aiTextList
      })
      this.closeHandle()
    },
    editorChangeHandle({ content }) {
      this.baseInfoForm.txtContent = content
    },
    voiceToTextHandle() {
      // 获取ID
      if (this.isSendingVoice) return
      this.isSendingVoice = true
      const { udmpId, coursewareName, fileSuffix } = this.courseInfo
      const request = {
        udmpId,
        fileName: coursewareName,
        fileSuffix
      }
      fetchVoiceToText({ request })
        .then((res) => {
          this.baseInfoForm.orderNo = res
          this.$message.success('语音正在转译中...')
        })
        .finally(() => {
          this.isSendingVoice = false
        })
    },
    finishTextEditHandle() {
      this.isAITextDone = true
    },
    setTextEditHandle() {
      this.isAITextDone = false
    },
    // 手动查询AI转译结果
    async getAIresultHandle() {
      if (!this.baseInfoForm.orderNo)
        return this.$message.warning('请先进行转译')
      const request = {
        orderNo: this.baseInfoForm.orderNo,
        udmpId: this.courseInfo.udmpId
      }
      this.aiTextList = await fetchFindVoiceToTextList({ request })
      if (!this.aiTextList.length) return this.$message.warning('资源转译中...')
    },
    async reset() {
      await customHint('重置将会清空已转译出的内容，请谨慎操作', '提示', '取消')
      this.closeReset()
      this.baseInfoForm.caseName = this.courseInfo.caseName
      this.baseInfoForm.coursewareName = this.courseInfo.coursewareName
      this.baseInfoForm.udmpUrl = this.courseInfo.udmpUrl
    },
    closeReset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    }
  }
}
</script>
<style lang='scss' scoped>
$base-margin: 20px;
$label-color: rgb(#000, 0.4);
.case-draft-container {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  box-sizing: border-box;
}

.main-box {
  height: calc(100vh - 130px);
}

.main-container {
  width: 85%;
  margin: 0 auto;
}

.type-controls {
  margin-top: $base-margin;
}

.ai-controls {
  display: flex;
  align-items: center;

  .trange-button {
    width: 60px;
    margin-left: $base-margin;
  }
}

.radio-group {
  width: 100%;
}

.radio-item {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 10px 0;

  .radio-control {
    width: 60px;
  }

  .tips {
    font-size: 12px;
    color: $label-color;
  }
}

.ai-text-wrapper {
  display: flex;

  .ai-text-container {
    flex: 1;
  }
  .control-button {
    width: 60px;
    margin-left: $base-margin;
  }
}

.ai-text-list {
  margin-bottom: $base-margin;
  display: flex;
  .label-time {
    width: 60px;
    color: $label-color;
  }
}

.process-input-container {
  :deep(.uploading) {
    position: relative;
  }
}

.draft-wrapper {
  border: 1px solid $line-color-2;
}
</style>
