<template>
  <div class="evaluateResults">
    <div class="student-form p20 pt0">
      <el-form :model="studentInfo" :disabled="rowData.resultPageType === 'view'" label-width="290px" ref="studentInfoRef" :rules="studentInfoRules">
        <el-form-item label="个人意愿" prop="myselfChoice">
          <el-radio-group v-model="studentInfo.myselfChoice">
            <el-radio v-for="(item, index) in PERSONAL_WILLINGNESS_OPTIONS" :key="index" :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="合规表现：近6个月是否发生过合规处罚" prop="compliance">
          <el-radio-group v-model="studentInfo.compliance">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务投诉：近6个月是否存在总行认定的有效投诉" prop="serviceComplaint">
          <el-radio-group v-model="studentInfo.serviceComplaint">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考勤及请假">
          <el-input
            resize="none"
            class="h-60"
            type="textarea"
            maxlength="100"
            show-word-limit
            placeholder="请输入"
            v-model="studentInfo.attendance"
          ></el-input>
        </el-form-item>
        <el-form-item label="总评价" prop="evaluateResult">
          <el-radio-group v-model="studentInfo.evaluateResult">
            <el-radio :label="3">优秀</el-radio>
            <el-radio :label="2">良好</el-radio>
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="0">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="`${studentInfo.teamPrincipal || ''}考核意见`"
          :rules="{ required: true, message: `${studentInfo.teamPrincipal || ''}考核意见必填` }"
          prop="teamPrincipalEvaluate"
        >
          <el-input
            resize="none"
            class="h-90"
            type="textarea"
            maxlength="500"
            show-word-limit
            placeholder="请输入团队/支行负责人考核意见"
            v-model="studentInfo.teamPrincipalEvaluate"
          ></el-input>
        </el-form-item>
        <el-form-item label="考核人" prop="teamPrincipalUm">
          <el-autocomplete
            class="w-200"
            value-key="label"
            placeholder="请输入UM号/姓名"
            :trigger-on-focus="false"
            v-model="studentInfo.teamPrincipalUmAndName"
            :fetch-suggestions="querySearch"
            @select="handleTeamPrincipalUmSelect"
            @input="inputPrincipalUmName"
            @blur="handleBlurPrincipalUmName"
            ref="makePersonSelectRef"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item
          :label="`${studentInfo.adminDepartment || ''}考核意见`"
          :rules="{ required: true, message: `${studentInfo.adminDepartment || ''}考核意见必填` }"
          prop="adminDepartmentEvaluate"
        >
          <el-input
            resize="none"
            class="h-90"
            type="textarea"
            maxlength="500"
            show-word-limit
            placeholder="请输入管理部门考核意见"
            v-model="studentInfo.adminDepartmentEvaluate"
          ></el-input>
        </el-form-item>
        <el-form-item label="考核人" prop="adminDepartmentUm">
          <el-autocomplete
            class="w-200"
            value-key="label"
            placeholder="请输入UM号/姓名"
            :trigger-on-focus="false"
            v-model="studentInfo.adminDepartmentUmAndName"
            :fetch-suggestions="querySearch"
            @select="handleAdminDepartmentUmSelect"
            @input="inputDepartmentName"
            @blur="handleBlurDepartmentName"
            ref="makePersonSelectRef"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button class="button-w80-h30" v-if="rowData.resultPageType === 'edit'" :loading="submitLoading" type="primary" @click="handleSubmit"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { CopyObj } from '@/util/utils'
import { fetchFindFosterResultDetail, fetchSaveFosterResult } from '@/fetch/schoolRecruitmentManagement'
import { Message } from 'element-ui'
import { PERSONAL_WILLINGNESS_OPTIONS } from '../../enum'
import { fetchUserInfos } from '@/fetch/public'
import store from '@/store'
const props = defineProps({
  rowData: {}
})
// 获取导师评价详情数据
const studentInfo = ref({})
const studentInfoRef = ref(null)
const studentInfoRules = ref({
  myselfChoice: [{ required: true, message: '个人意愿必填' }],
  compliance: [{ required: true, message: '合规表现必填' }],
  serviceComplaint: [{ required: true, message: '服务投诉必填' }],
  evaluateResult: [{ required: true, message: '总评价必填' }],
  teamPrincipalUm: [{ required: true, message: '考核人必填' }],
  adminDepartmentUm: [{ required: true, message: '考核人必填' }]
})
// 后端数据转换为前端需要的
const serveToWeb = (data) => {
  data.teamPrincipalUmAndName = data.teamPrincipalUm ? `${data.teamPrincipalName}(${data.teamPrincipalUm})` : ''
  data.adminDepartmentUmAndName = data.adminDepartmentUm ? `${data.adminDepartmentName}(${data.adminDepartmentUm})` : ''
  studentInfo.value = data
}
// 获取培养结果详情
const getDetail = async () => {
  const res = await fetchFindFosterResultDetail({
    data: { userCode: props.rowData.userCode, grade: props.rowData.grade, transferStage: props.rowData.transferStage }
  })
  serveToWeb(res)
  nextTick(() => {
    studentInfoRef.value?.clearValidate()
  })
}
getDetail()
// 搜索姓名
const querySearch = (queryString, cb) => {
  const data = { empName: queryString }
  fetchUserInfos({ data }).then((resData) => {
    resData.list.forEach((v) => {
      v.label = `${v.empName}(${v.umId})`
    })
    cb(resData.list)
  })
}
const handleTeamPrincipalUmSelect = (item) => {
  studentInfo.value.teamPrincipalUm = item.umId
  studentInfo.value.teamPrincipalName = item.empName
  studentInfoRef.value?.validateField('teamPrincipalUm')
}
const inputPrincipalUmName = () => {
  studentInfo.value.teamPrincipalUm = ''
  studentInfo.value.teamPrincipalName = ''
}
const handleBlurPrincipalUmName = () => {
  if (!studentInfo.value.adminDepartmentUm) {
    studentInfo.value.teamPrincipalUmAndName = ''
  }
}
const handleAdminDepartmentUmSelect = (item) => {
  studentInfo.value.adminDepartmentUm = item.umId
  studentInfo.value.adminDepartmentName = item.empName
  studentInfoRef.value?.validateField('adminDepartmentUm')
}
const inputDepartmentName = () => {
  studentInfo.value.adminDepartmentUm = ''
  studentInfo.value.adminDepartmentName = ''
}
const handleBlurDepartmentName = () => {
  if (!studentInfo.value.adminDepartmentUm) {
    studentInfo.value.adminDepartmentUmAndName = ''
  }
}
// ------------------- 保存 -------------------
// 将本页数据格式化成后端需要的数据
const CurrentPageDataTobackgroundData = () => {
  const fromData = CopyObj(studentInfo.value)
  Reflect.deleteProperty(fromData, 'teamPrincipalUmAndName')
  Reflect.deleteProperty(fromData, 'adminDepartmentUmAndName')
  return fromData
}
const submitLoading = ref(false)
// 是否要刷新上一页数据
let refreshParentPage = false
const handleSubmit = () => {
  studentInfoRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      CurrentPageDataTobackgroundData()
      fetchSaveFosterResult({ data: CurrentPageDataTobackgroundData() })
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
  name: 'EvaluateResults'
}
</script>
<style lang="scss" scoped>
.evaluateResults {
  height: calc(100% - 50px);
  background-color: #fff;
  position: relative;
  .student-form {
    flex: 1;
    min-height: calc(100% - 70px);
    .recomment {
      :deep(.el-form-item__content) {
        flex: 1;
        margin-right: 20px;
      }
    }
  }
}
</style>