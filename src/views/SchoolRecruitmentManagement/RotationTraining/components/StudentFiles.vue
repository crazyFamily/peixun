<template>
  <div class="studentFiles">
    <div class="student-form p20">
      <el-form :model="studentInfo" disabled inline label-width="120px">
        <el-form-item label="届别">
          <el-input :value="studentInfo.grade" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input :value="studentInfo.userName" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="UM号">
          <el-input :value="studentInfo.userCode" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="正式入职日期">
          <el-date-picker class="sw-250" v-model="studentInfo.onboardDate" type="date" :picker-options="{}" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入职单位">
          <el-input v-model="studentInfo.onboardOrg" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="入职部门">
          <el-input v-model="studentInfo.onboardDeptName" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="入职岗位">
          <el-input v-model="studentInfo.onboardPosition" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="入职条线大类">
          <el-input v-model="studentInfo.onboardLine" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="入职条线小类">
          <el-input v-model="studentInfo.onboardSubLine" class="sw-250"></el-input>
        </el-form-item>
        <el-form-item label="入职职级">
          <el-input v-model="studentInfo.onboardLevel" class="sw-250"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fetchStudentAdmissionRecord } from '@/fetch/schoolRecruitmentManagement'
import store from '@/store'
const props = defineProps({
  rowData: {}
})
const studentInfo = ref({})
const getDetail = async () => {
  const res = await fetchStudentAdmissionRecord({
    data: { userCode: props.rowData.userCode,grade: props.rowData.grade }
  })
  studentInfo.value = { ...res }
}
getDetail()
const closeHandle = () => {
  store.dispatch('schoolRecruitmentManagement/changeRotationComp', { status: 'list' })
}
</script>
<script>
export default {
  name: 'StudentFiles'
}
</script>
<style lang="scss" scoped>
.studentFiles {
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .student-form {
    flex: 1;
  }
}
</style>