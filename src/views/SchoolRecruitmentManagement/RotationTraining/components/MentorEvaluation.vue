<template>
  <div class="mentorEvaluation">
    <div class="student-form p20 pt0">
      <el-form :model="studentInfo" :disabled="rowData.evaluationPageType === 'view' || !showSubmitBtn" ref="studentInfoFromRef" inline>
        <el-form-item
          v-for="(item, index) in studentInfo.evaTargetList"
          :key="index"
          :label="`${item.targetContent}:`"
          class="eva-form-item"
          label-width="130px"
          :prop="`evaTargetList.${index}.targetAnswer`"
          :rules="{ required: true, message: `${item.targetContent}必填` }"
        >
          <el-row ref="evaRowRef">
            <el-radio-group class="wfull" v-model="item.targetAnswer">
              <el-col v-for="(item, subIndex) in item.targetOptionList" :key="subIndex" :span="6">
                <el-card ref="evaCardRef" :parentIndex="index" class="mr20" shadow="hover">
                  <el-radio class="eva-radio" :label="item.orderNo">
                    {{ item.optionContent }}
                  </el-radio>
                </el-card>
              </el-col>
            </el-radio-group>
          </el-row>
        </el-form-item>
        <el-form-item
          class="recomment dfi"
          prop="teacherEvaluate"
          :rules="{ required: true, message: `导师考核意见必填` }"
          label-width="120px"
          label="导师考核意见 :"
        >
          <el-input
            resize="none"
            class="h-90"
            type="textarea"
            maxlength="500"
            show-word-limit
            placeholder="请输入导师考核意见"
            v-model="studentInfo.teacherEvaluate"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button
        class="button-w80-h30"
        v-if="rowData.evaluationPageType === 'edit' && showSubmitBtn"
        :loading="submitLoading"
        type="primary"
        @click="handleSubmit"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { CopyObj } from '@/util/utils'
import { fetchFindTeacherEvaluateDetail, fetchSaveTeacherEvaluate } from '@/fetch/schoolRecruitmentManagement'
import { Message } from 'element-ui'
import { TEACHER } from '../../enum.js'
import store from '@/store'
const props = defineProps({
  rowData: {}
})
// 获取导师评价详情数据
const studentInfo = ref({})
const evaRowRef = ref(null)
const evaCardRef = ref(null)
const studentInfoFromRef = ref(null)
const showSubmitBtn = ref(true)
const getDetail = async () => {
  const { userCode, grade, transferStage, identity } = props.rowData
  const res = await fetchFindTeacherEvaluateDetail({
    data: { userCode, grade, transferStage }
  })
  studentInfo.value = res
  if (identity === TEACHER) {
    showSubmitBtn.value = res.isSave === 'Y'
  }
  nextTick(() => {
    // 设置每个卡片高度保持一致
    evaCardRef.value?.forEach((v) => {
      v.$el.style.height = evaRowRef.value[v.$el.getAttribute('parentIndex')].$el.clientHeight + 'px'
    })
    studentInfoFromRef.value?.clearValidate()
  })
}
getDetail()
// ------------------- 保存 -------------------
// 将本页数据格式化成后端需要的数据
const CurrentPageDataTobackgroundData = () => {
  const fromData = CopyObj(studentInfo.value)
  return fromData
}
const submitLoading = ref(false)
// 是否要刷新上一页数据
let refreshParentPage = false
const handleSubmit = () => {
  studentInfoFromRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      CurrentPageDataTobackgroundData()
      fetchSaveTeacherEvaluate({ data: CurrentPageDataTobackgroundData() })
        .then((res) => {
          Message.success('保存成功！')
          refreshParentPage = true
        })
        .finally(() => {
          submitLoading.value = false
        })
    }
  })
}
const closeHandle = () => {
  const data = { status: 'list' }
  if (refreshParentPage) {
    data.refreshData = true
  }
  store.dispatch('schoolRecruitmentManagement/changeRotationComp', data)
}
// 监听阶段数据切换
watch(
  () => props.rowData.transferStage,
  () => {
    getDetail()
  }
)
</script>
<script>
export default {
  name: 'MentorEvaluation'
}
</script>
<style lang="scss" scoped>
.mentorEvaluation {
  height: calc(100% - 50px);
  background-color: #fff;
  position: relative;
  .student-form {
    flex: 1;
    min-height: calc(100% - 70px);
    padding-right: 0 !important;
    .eva-form-item {
      display: flex;
      :deep(.el-form-item__content) {
        flex: 1;
      }
      :deep(.el-card__body) {
        padding: 0;
      }
      .eva-radio {
        white-space: inherit !important;
        padding: 20px;
        display: flex;
        align-items: center;
        :deep(.el-radio__label) {
          line-height: 18px;
        }
      }
    }
    .recomment {
      :deep(.el-form-item__content) {
        flex: 1;
        margin-right: 20px;
      }
    }
  }
}
</style>