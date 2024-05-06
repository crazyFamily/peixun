<template>
  <div v-loading="isLoading">
    <el-card>
      <StepTopbar current-step="培养进展管理" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <div class="talents-container">
      <div class="main-container">
        <el-form :model="progressForm" :rules="progressFormRules" ref="progressFormRef" :disabled="status === 'view'">
          <el-row>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="年度">
                <el-input v-model="progressForm.annual" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="项目ID">
                <el-input v-model="progressForm.projectId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="项目名称">
                <el-input v-model="progressForm.projectName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="所属单位">
                <el-input class="topic-input" v-model="progressForm.projectBlg" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="进展阶段">
                <el-input class="topic-input" v-model="progressForm.stageName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="项目类型">
                <el-input class="topic-input" v-model="progressForm.projectTypeDesc" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label-width="formLabelWidth" label="项目状态" prop="projectStatus">
                <gc-select class="select-style" v-model="progressForm.projectStatus" :options="TANLENTS_PROJECT_STATUS"></gc-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <template v-if="progressForm.projectStatus === TANLENTS_PROJECT_STATUS_TODO">
                <el-form-item :label-width="formLabelWidth" label="项目状态说明" prop="statusIntroduce">
                  <el-input
                    class="topic-input"
                    maxlength="200"
                    type="textarea"
                    resize="none"
                    :rows="3"
                    show-word-limit
                    v-model="progressForm.statusIntroduce"
                  ></el-input>
                </el-form-item>
              </template>
            <el-form-item :label-width="formLabelWidth" label="议题实践进展" prop="topicProgress">
              <el-input
                class="topic-input"
                maxlength="500"
                type="textarea"
                resize="none"
                :rows="5"
                placeholder="请按照“目前……下一步……模式 ”填写"
                show-word-limit
                v-model="progressForm.topicProgress"
              ></el-input>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="培养赋能进展" prop="fosterProgress">
              <el-input
                class="topic-input"
                maxlength="500"
                type="textarea"
                resize="none"
                :rows="5"
                placeholder="请按照“目前……下一步……模式 ”填写"
                show-word-limit
                v-model="progressForm.fosterProgress"
              ></el-input>
            </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="handleClose">关闭</el-button>
      <el-button class="button-w80-h30" type="primary" @click="handleSave" :disabled="status === 'view'">确定</el-button>
    </div>
  </div>
</template>

<script setup>
import { TALENT_STEP, TANLENTS_PROJECT_STATUS, TANLENTS_PROJECT_STATUS_TODO } from '../enum'
import StepTopbar from '../components/StepTopbar.vue'
import { computed, onActivated, onMounted, reactive, ref } from 'vue'
import { closeCurrPageAndGoPath, getLoadingStatus } from '@/util/utils'
import { useRoute } from '@/router'
import { Message } from 'element-ui'
import store from '@/store'
import { fetchFosterProgressDetail, fetchUpdateFosterProgress } from '@/fetch/tanlents'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { useTable } from '@/hooks/useTable'
const { mergeReactive } = useBaseDataEvents()
const formLabelWidth = '100px'
const longformLabelWidth = '95px'
const baseFormRules = {}
const progressForm = reactive({
  projectStatus: ''
})
const {requiredHandle} = useTable({})

const progressFormRules = computed(() => {
  return {
    projectStatus: [ requiredHandle('请选择项目状态') ],
    statusIntroduce: [ 
      {
        ...requiredHandle('请填写状态说明', 'blur'),
        required: progressForm.projectStatus === TANLENTS_PROJECT_STATUS_TODO
      },
    ],
    topicProgress: [ requiredHandle('请输入议题实践进展', 'blur') ],
    fosterProgress: [ requiredHandle('请输入培养赋能进展', 'blur') ]
  }
})

const progressFormRef = ref(null)
const handleSave = async () => {
  progressFormRef.value.validate(async v => {
    if(!v) return
    const data = progressForm
    await fetchUpdateFosterProgress({ data })
    Message.success('保存成功')
    // 设置待更新状态
    store.commit('updateQueue', '/TalentsProgress')
    handleClose()
  })
}
const handleClose = () => {
  closeCurrPageAndGoPath({ path: '/TalentsProgress' })
}

const getDataInfo = async (id) => {
  const res = await fetchFosterProgressDetail({id})
  mergeReactive({ origin: progressForm, target: res })
}

const isLoading = computed(() => {
  return getLoadingStatus('LOADING_TANLENTS_PROGRESS')
})

const status = ref('edit')
onActivated(() => {
  const id = useRoute().params.id
  if(id) {
    status.value = useRoute().params.status
    getDataInfo(id)
  }
})
</script>
<script>
export default {
  name: 'EditTalentsProgress'
}
</script>

<style lang="scss" scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.base-info-container {
  padding: 20px;
}

.base-info-item {
  width: 25%;
  margin-right: 0;
}

.one-line {
  width: 100%;
  :deep(.el-form-item) {
    width: 100%;
  }
  :deep(.el-form-item__content) {
    width: 86%;
  }
}

.main-container {
  width: 700px;
  margin: 0 auto;
  padding: 20px 0;
}

.select-style {
  padding: 0; 
  width:100%;
  :deep(.el-select) {
    width: 100%;
  }
}
</style>