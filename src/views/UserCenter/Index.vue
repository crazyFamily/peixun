<template>
  <div class="user-center-container">
    <el-tabs v-model="activeName" class="user-center-nav">
      <template v-for="(item, index) in navTypes">
        <el-tab-pane
          :key="index"
          :label="item.label"
          :name="item.value"
        ></el-tab-pane>
      </template>
    </el-tabs>
    <!-- 系统更新信息 -->
    <template v-if="activeName === 'systemlog'">
      <div class="systemlog-container" v-if="!isShowLog">
        <div class="list-container">
          <div
            class="log-list-container"
            v-for="(item, index) in logList"
            :key="index"
            @click="showLogHandle(item)"
          >
            <p class="log-title">{{ item.title }}</p>
            <p class="log-desc">{{ item.profile }}</p>
            <p class="log-time">{{ item.updatedDate }}</p>
          </div>
        </div>
        <div class="user-center-footer" v-show="logList.length">
          <gc-pagination
            :total="queryForm.total"
            :page-sizes="[10, 20]"
            :page-size="queryForm.pageSize"
            :current-page="queryForm.currPage"
            @sizeChange="sizeChange($event, queryForm, getList)"
            @currentChange="currentChange($event, queryForm, getList)"
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </div>
      </div>
      <div class="systemlog-container detail-container" v-else>
        <div class="between detail-topbar">
          <p class="detail-title">{{ currentLog.title }}</p>
          <el-button class="go-back" @click="logCloseHandle">返回</el-button>
        </div>
        <p class="desc">
          <span class="item author">{{ currentLog.updatedBy }}</span>
          <span class="item time">发布于 {{ currentLog.updatedDate }}</span>
          <span class="item views">浏览 {{ currentLog.browseNum }}</span>
        </p>
        <div class="detail-content w-e-text-container">
          <div class="w-e-text" v-html="currentLog.content"></div>
        </div>
        <div
          class="accessories"
          v-if="
            Array.isArray(currentLog.attachList) && currentLog.attachList.length
          "
        >
          <p class="acc-title">附件</p>
          <div
            class="acc-list"
            v-for="(item, index) in currentLog.attachList"
            :key="index"
          >
            <el-link class="acc-link">
              <a class="active" :href="handleUdmpHref(item.udmpId)">{{
                item.fileName
              }}</a>
            </el-link>
          </div>
        </div>
      </div>
    </template>
    <!-- 问题反馈 -->
    <template v-if="activeName === 'questions'">
      <div class="between-noc questions-container">
        <div class="questions-nav">
          <p
            class="item"
            :class="{ active: item.value === activeQuestionNav }"
            v-for="(item, index) in questionNav"
            @click="switchQuestionNavHandle(item)"
            :key="index"
          >
            {{ item.label }}
          </p>
        </div>
        <div class="dfc questions-content" v-show="!isShowQuestionList">
          <el-form
            :model="questionForm"
            inline
            ref="questionForm"
            :rules="questionFormRule"
            :disabled="isShowDetail"
          >
            <el-form-item label="模块名称" label-width="140px" prop="modelName">
              <el-input
                class="w500"
                placeholder="模块名称"
                v-model="questionForm.modelName"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label="问题反馈" label-width="140px" prop="feedback">
              <el-input
                class="w500 textarea"
                type="textarea"
                v-model="questionForm.feedback"
                placeholder="请详细描述您的问题"
                maxlength="500"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <el-form-item label="合理化建议" label-width="140px" prop="suggest">
              <el-input
                class="w500 textarea"
                type="textarea"
                v-model="questionForm.suggest"
                placeholder="请描述您的建议内容"
                maxlength="500"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <el-form-item
              label="上传截图"
              label-width="140px"
              v-show="
                !isShowDetail ||
                (Array.isArray(questionForm.attachList) &&
                  questionForm.attachList.length)
              "
            >
              <!-- <el-input type="textarea"> </el-input> -->
              <gc-upload
                :size="500 * 1024 * 1024"
                ref="uploadRef"
                :list="fileList"
                v-model="questionForm.attachList"
                :max="9"
                :disabled="isShowDetail"
                class="questions-upload"
              ></gc-upload>
              <p class="tintColor mt10">仅支持 jpg、png格式</p>
            </el-form-item>
          </el-form>
          <div class="dfcc questions-footer" v-show="!isShowDetail">
            <el-button class="button-w80-h30" @click="resetQuestionForm"
              >重置</el-button
            >
            <el-button
              class="button-w80-h30"
              type="primary"
              @click="sentQuestion"
              >提交</el-button
            >
          </div>
        </div>
        <div
          class="questions-content qusetions-list"
          v-show="isShowQuestionList"
        >
          <p
            class="between list-container"
            v-for="(item, index) in questionList"
            @click="showQuestionDetalHandle(item)"
          >
            <span class="content">{{ index + 1 }}. {{ item.modelName }}</span>
            <span class="time">{{ item.updatedDate }}</span>
          </p>
          <gc-pagination
            v-show="questionList.length"
            :total="questionParam.total"
            :page-sizes="[10, 20]"
            :page-size="questionParam.pageSize"
            :current-page="questionParam.currPage"
            @sizeChange="sizeChange($event, questionParam, getQuestionList)"
            @currentChange="
              currentChange($event, questionParam, getQuestionList)
            "
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import 'wangeditor/src/assets/style/common.less'
import 'wangeditor/src/assets/style/text.less'
import { sizeChange, currentChange, handleUdmpHref } from '@/util/utils.js'
import {
  fetchListRealInfo,
  fetchFindRealInfo
} from '@/fetch/informationManament'
import {
  fetchSaveFeedback,
  fetchListUserFeedBack,
  fetchFindFeedBack
} from '@/fetch/userCenter'
export default {
  name: 'UserCenter',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      activeName: 'systemlog',
      navTypes: [
        {
          label: '系统更新',
          value: 'systemlog'
        },
        {
          label: '问题反馈',
          value: 'questions'
        }
      ],
      logList: [],
      queryForm: {
        condition: {
          type: 'system',
          status: 'publish'
        },
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      currentLog: {},
      isShowLog: false,
      activeQuestionNav: 'create',
      questionParam: {
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      questionNav: [
        {
          label: '新建反馈',
          value: 'create'
        },
        {
          label: '反馈记录',
          value: 'list'
        }
      ],
      questionForm: {
        modelName: '',
        feedback: '',
        suggest: ''
      },
      questionFormRule: {
        modelName: [requiredHandle('请输入模块名称')],
        feedback: [requiredHandle('请输入问题反馈内容')],
        suggest: [requiredHandle('请输入合理化建议')]
      },
      questionList: [],
      currentQuestion: {},
      isShowQuestionList: false,
      isShowDetail: false,
      fileList: [],
      sizeChange,
      currentChange,
      handleUdmpHref,
      isGettingList: false
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.getList()
  },

  activated() {
    this.getList()
  },

  methods: {
    // 拉取数据
    async getList() {
      if (this.isGettingList) return
      try {
        this.isGettingList = true
        let data = this.queryForm
        let { list, total } = await fetchListRealInfo(data)
        this.queryForm.total = total
        this.logList = list
      } catch (error) {}
      this.isGettingList = false
    },
    // 显示日志详情
    showLogHandle(row) {
      this.isShowLog = true
      this._getLogDetail(row.id)
    },
    // 拉取详情
    async _getLogDetail(rowid) {
      let res = await fetchFindRealInfo({ id: rowid })
      this.currentLog = res
    },
    // 返回
    logCloseHandle() {
      this.isShowLog = false
      this.getList()
    },
    // 问题反馈
    sentQuestion() {
      this.$refs.questionForm.validate(async (v) => {
        if (!v) return
        let condition = this.questionForm
        await fetchSaveFeedback({ condition })
        this.$message.success('提交成功')
        this.resetQuestionForm()
      })
    },
    resetQuestionForm() {
      this.$refs.questionForm.resetFields()
      this.$refs.uploadRef.clear()
      this.fileList = []
    },
    // 菜单切换，需要做些重置的工作，并显示不同的数据
    switchQuestionNavHandle(item) {
      this.isShowDetail = false
      this.activeQuestionNav = item.value
      this.isShowQuestionList = item.value === 'list'
      if (this.isShowQuestionList) {
        this.questionParam.currPage = 1
        this.getQuestionList()
      } else {
        this.resetQuestionForm()
      }
    },
    // 拉取问题反馈列表
    async getQuestionList() {
      let { list, total } = await fetchListUserFeedBack(this.questionParam)
      this.questionList = list
      this.questionParam.total = total
    },
    // 拉取问题详情
    async showQuestionDetalHandle(row) {
      let res = await fetchFindFeedBack({ id: row.id })
      this.questionForm = res
      this.isShowDetail = true
      this.fileList = res.attachList.map((item) => ({
        url: handleUdmpHref(item.udmpId),
        name: item.fileName
      }))
      this.isShowQuestionList = false
    }
  }
}
</script>
<style lang="scss" scoped>
$base-padding: 20px;
$base-font-size: 12px;
$other-height: 60px + 30px;

@mixin content-height() {
  min-height: calc(100vh - #{$other-height} - 50px - 10px);
}

.user-center-container {
  width: 100%;
  min-height: calc(100vh - #{$other-height});
}
.user-center-nav,
.systemlog-container {
  background-color: #fff;
  :deep(.el-tabs__header) {
    margin-bottom: 0;
  }
}

.systemlog-container {
  margin-top: 10px;
  @include content-height();
}

.system-title {
  font-size: $base-font-size * 2;
  padding: $base-padding;
  padding-bottom: 0;
}

.log-list-container {
  $log-line: 22px;
  $log-weight: 400;
  padding: $base-padding;
  border-bottom: 1px solid $line-color;
  cursor: pointer;

  .log-title {
    font-size: $base-font-size + 2px;
    line-height: $log-line;
    font-weight: $log-weight + 100;
  }

  .log-desc {
    font-size: $base-font-size;
    line-height: $log-line;
    font-weight: $log-weight;
  }

  .log-time {
    color: #7d8292;
    font-weight: $log-weight;
  }

  &:last-child {
    border-bottom: 0;
  }
}

.detail-container {
  box-sizing: border-box;
  background: unset;
}

.detail-topbar {
  padding: $base-padding;
  background-color: #fff;
  .detail-title {
    font-size: $base-font-size * 2 + 6px;
  }
  .go-back {
    border: 1px solid $line-color;
    border-radius: 2px;
  }
}

.desc {
  padding: $base-padding;
  padding-top: 0;
  background-color: #fff;
  .item {
    color: $shallow;
    padding-right: $base-padding;
  }
}

.accessories {
  margin-top: 10px;
  padding: $base-padding;
  background-color: #fff;

  .acc-title {
    margin-bottom: 10px;
  }

  .acc-link {
    color: $themeColor;
  }
}

.user-center-footer {
  padding: $base-padding;
  padding-top: 0;
}

.questions-container {
  height: 100%;
  padding-top: 10px;
  @include content-height();
}

.questions-nav {
  width: 120px;
  background-color: #fff;
  @include content-height();
  padding: 10px 0;
  .item {
    text-align: center;
    padding: 10px;
    cursor: pointer;
  }

  .item.active {
    color: $themeColor;
    background-color: rgba($line-color, 0.3);
  }
}

.questions-content {
  $footer-height: 70px;

  flex: 1;
  margin-left: 10px;
  padding: $base-padding;
  padding-bottom: $footer-height;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  @include content-height();

  :deep(.el-form-item) {
    display: block;
  }

  &.qusetions-list {
    padding-bottom: $base-padding;
  }

  .questions-footer {
    width: 100%;
    height: $footer-height;
    position: absolute;
    left: 0;
    bottom: 0;
    -webkit-box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.05);
    box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.05);
  }
}

.detail-content {
  padding: $base-padding;
  background-color: #fff;

  :deep(h1) {
    font-size: initial;
  }
}

.acc-list {
  display: block;
  margin: 10px 0;
}

.list-container {
  padding: $base-padding 0;
  border-bottom: 1px solid $line-color;
  cursor: pointer;

  .content {
    display: inline-block;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .time {
    color: #7d8292;
  }
}

.el-input.w500,
.el-textarea.w500 {
}
.textarea {
  :deep(.el-textarea__inner) {
    color: #000;
    height: 90px;
  }
}

.questions-upload {
  :deep(.el-upload-list__item) {
    height: auto;
    width: auto;
    display: block;
    margin-bottom: 10px;
    border: 0;
  }

  :deep(.el-upload-list) {
    height: auto;
    display: block;
    // text-align: center;

    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>