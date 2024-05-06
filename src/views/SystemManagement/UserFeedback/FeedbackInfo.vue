<template>
  <div class="SystemManagement__FeedbackInfo">
    <div class="menu-right mr20">
      <el-button @click="backtrack" class="button-w80-h30">返回</el-button>
    </div>
    <!-- 内容 -->
    <div class="content-box">
      <el-form class="content-form" :model="baseInfoForm" label-width="100px">
        <el-form-item label="模块名称：">
          <div>{{ baseInfoForm.modelName }}</div>
        </el-form-item>
        <el-form-item label="问题反馈：">
          <el-input
            class="h-90"
            resize="none"
            type="textarea"
            :value="baseInfoForm.feedback"
          />
        </el-form-item>
        <el-form-item label="合理化建议：" class="pb20">
          <el-input
            class="h-90"
            resize="none"
            type="textarea"
            :value="baseInfoForm.suggest"
          />
          <div
            class="img-wrapper"
            v-for="attach in baseInfoForm.attachList"
            :key="attach.id"
          >
            <img :src="handleUdmpHref(attach.udmpId)" alt="" />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { handleUdmpHref, closeCurrPageAndGoPath } from '@/util/utils'
export default {
  name: 'FeedbackInfo',
  data() {
    return {
      baseInfoForm: {
        attachList: []
      },
      handleUdmpHref
    }
  },
  methods: {
    backtrack() {
      closeCurrPageAndGoPath('/UserFeedback')
    }
  },
  activated() {
    const params = this.$route.params
    if (params.id) {
      this.baseInfoForm = params
    }
  }
}
</script>
<style lang="scss">
.SystemManagement__FeedbackInfo {
  min-height: 100%;
  padding-top: 40px;
  background-color: #fff;
  .content-box {
    width: 700px;
    margin: 50px auto 60px;
    .img-wrapper {
      margin-top: 20px;
      img {
        width: auto;
        height: auto;
      }
    }
  }
}
</style>