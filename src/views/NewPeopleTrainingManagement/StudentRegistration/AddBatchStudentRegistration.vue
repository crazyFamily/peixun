<template>
  <div class="AddStudentRegistration">
    <div class="main-container">
      <el-form :model="baseInfoForm" :rules="baseInfoRules" ref="baseInfoFormRef" label-width="50px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="年度" prop="annual">
              <gc-select :options="annualList" v-model="baseInfoForm.annual" 
                @change="annualChangeHandle" 
                placeholder="请选择年度" 
                class="w-150"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="期次" prop="period">
            <gc-select :options="recruitNumList" v-model="baseInfoForm.period" placeholder="请选择期次" class="w-150"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item v-if="isZhAdmin"  label="机构" prop="orgId">
              <gc-select :options="orgList" filterable v-model="baseInfoForm.orgId" class="w-200"/>
            </el-form-item>
            <el-form-item v-else label="机构" prop="orgName">
              <el-input v-model="orgOneNode.orgName" disabled />
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
        <headquarter-upload
          template-code="STUDENT_REGIST_ADD_BRACH"
          :fetch-fn="fetchCheckImportUserBatch"
          :params="uploadParams"
          :table-columns="uploadTableColumns"
          @faildExport="faildExportHandle"
          @uploadFinish="uploadFinishHandle"
          ref="headquarterUploadRef"
        />
        </el-row>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">关闭</el-button>
      <el-button class="button-w80-h30" type="primary" @click="saveHandle" :loading="savState === 1" :disabled="savState === 2">保存</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submitHandle" :loading="savState === 2" :disabled="savState === 1">提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddStudentRegistration'
}
</script>
<script setup>
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import { closeCurrPageAndGoPath, uuid, customHint } from '@/util/utils'
import HeadquarterUpload from '@/components/upload/HeadquarterUpload.vue'
import { 
  fetchCheckImportUserBatch,
  fetchSaveOrCommitUserBatch,
  fetchExportFailUser
} from '@/fetch/newPeopleTrainingManagement'
import { useRecruitQryParam } from '../hooks/useNewPeopleTraining'
import { useRouter, useRoute } from '@/router'
import { Message } from 'element-ui'

const router = useRouter()
const baseInfoFormRef = ref(null)
const baseInfoForm = reactive({
  annual: '', // 年度
  period: '', // 期次 // recruitNum: '', // 期次
  // orgId: '',
  succBatchId: ''
})
const baseInfoRules = {
  annual: [{ required: true, trigger: 'blur', message: '请选择年度' }],
  period: [{ required: true, trigger: 'blur', message: '请选择期次' }],
  // orgId: [{ required: true, trigger: 'blur', message: '请选择机构' }],
}
const uploadParams = reactive({
  batchId: uuid(),
  tip: 'N'
})
// UM号、姓名、手机、类别、失败原因
const uploadTableColumns = ref([
  { label: 'UM号', prop: 'umId' },
  { label: '姓名', prop: 'umName' },
  // { label: '手机', prop: 'phoneNo' },
  { label: '类别', prop: 'type' },
  { label: '失败原因', prop: 'msg' }
])
const isHasFaildData = ref(false)
const successList = ref([])
const successBatchId = ref('')
const errorBatchId = ref('')
const faildExportHandle = async () => {
  await fetchExportFailUser({ failBatchId: errorBatchId.value })
}
function uploadFinishHandle({ sucessList, errorList, succBatchId, failBatchId }) {
  isHasFaildData.value = Boolean(errorList.length)
  successList.value = sucessList
  successBatchId.value = succBatchId
  errorBatchId.value = failBatchId
}

const { 
  initRecruitQryParam,
  annualChangeHandle,
  isZhAdmin,
  // orgList,
  annualList,
  recruitNumList,
  // orgOneNode
 } = useRecruitQryParam(baseInfoForm)

const closeHandle = (params) => {
  let { name } = router.getRoutes().find((item) => item.path === '/StudentRegistration')
  closeCurrPageAndGoPath({ path: useRoute().path })
  router.push({ name, params })
}
const savState = ref(0) // 0 编辑中；1 保存中；2 提交中；
function saveData (isCommit = 'N') {
  return new Promise(resolve => {
    baseInfoFormRef.value.validate(valid => {
      if (valid) {
        const handleFn = () => {
          savState.value = isCommit === 'N' ? 1 : 2
          baseInfoForm.isCommit = isCommit  // 提交标识：N-保存，Y-提交
          baseInfoForm.succBatchId = successBatchId.value
          console.log(baseInfoForm)
          // if (!isZhAdmin.value) {
          //   baseInfoForm.orgId = orgOneNode.value.orgId
          // }
          fetchSaveOrCommitUserBatch(baseInfoForm).then(res => {
            // closeHandle({ isCommit }) // 关闭
            resolve(res)
          }).finally(() => {
            savState.value = 0
          })
        }
        
        if (isCommit === 'Y') {
          customHint('已提交的学员信息不允许修改和删除，请确认是否提交？', '提示', '取消').then(() => {
            handleFn()
          })
        } else {
          handleFn()
        }
      }
    })
  })
}
// 保存
const saveHandle = () => {
  saveData('N').then(res => {
    Message.success('批量保存成功')
  })
}
// 提交
const submitHandle = () => {
  saveData('Y').then(res => {
    closeHandle({ isCommit: 'Y' }) // 关闭
    Message.success('批量提交成功')
  })
}

onMounted(async () => {
  const routeParams = useRoute().params
  console.log('routerPrams', routeParams)
  await initRecruitQryParam(true)
})
</script>

<style lang="scss" scoped>
.AddStudentRegistration {
  min-height: 100%;
  padding-top: 20px;
  background-color: #fff;

  :deep(.gc-select) {
      padding: 0;
    }

  .el-form {
    width: 670px;
    margin: auto;
  }
}
</style>