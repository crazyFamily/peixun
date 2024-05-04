<template>
  <div class="AddStudentRegistration">
    <div class="main-container">
      <el-form :model="baseInfoForm" :rules="baseInfoRules" ref="baseInfoFormRef" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="年度" prop="annual">
              <gc-select 
                :options="annualList" 
                v-model="baseInfoForm.annual" 
                @change="annualChangeHandle" 
                :clearable="false"
                placeholder="请选择年度" 
                class="w-200"/>
            </el-form-item>
            <el-form-item label="线上营类型" prop="onlineType">
              <gc-select :options="onlineTypeList" v-model="baseInfoForm.onlineType" class="w-200"/>
            </el-form-item>
            
          </el-col>
          <el-col :span="12">
            <el-form-item label="期次" prop="period">
              <gc-select 
                :options="recruitNumList" 
                v-model="baseInfoForm.period" 
                :clearable="false"
                placeholder="请选择期次" 
                class="w-200" />
            </el-form-item>
            <el-form-item label="类别" prop="type">
              <gc-select 
                :options="typeList" 
                v-model="baseInfoForm.type" 
                placeholder="请选择招聘类别"
                class="w-200" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="条线" prop="newBlgStripLine">
          <gc-select 
            :options="newBlgStripLineList" 
            v-model="baseInfoForm.newBlgStripLine"
            placeholder="请选择条线"
            class="w-full" />
        </el-form-item>
        <el-form-item label="UM号(姓名)" prop="umId">
          <el-input v-if="isEdit" v-model="baseInfoForm.umInfo" disabled />
          <gc-readonlyInput v-else style="margin-bottom: 0;">
            <span v-if="baseInfoForm.umId">{{baseInfoForm.umId}} ( {{baseInfoForm.umName}} )</span>
            <span v-else style="color: #bbb;">请选择学员</span>
            <template v-slot:end>
              <i class="page-input__search" @click="openSelectStudentDialog()" />
            </template>
          </gc-readonlyInput>
        </el-form-item>
        <el-form-item v-if="isZhAdmin"  label="机构" prop="orgId">
          <gc-select placeholder="选择学员后将会自动选择机构" 
            :options="orgList" filterable v-model="baseInfoForm.orgId" class="w-full" disabled />
        </el-form-item>
        <el-form-item v-else label="机构" prop="orgName">
          <el-input v-model="orgOneNode.orgName" disabled />
        </el-form-item>
        <el-form-item label="部门" prop="deptName">
          <el-input class="input-width" v-model="baseInfoForm.deptName" disabled></el-input> 
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-input class="input-width" v-model="baseInfoForm.positionName" disabled /> 
        </el-form-item>
        <el-form-item label="内外勤" prop="inLegworkDesc">
          <el-input class="input-width" v-model="baseInfoForm.inLegworkDesc" disabled /> 
        </el-form-item>
        <el-form-item label="职位主序列" prop="jobSeqIdDesc">
          <el-input class="input-width" v-model="baseInfoForm.jobSeqIdDesc" disabled /> 
        </el-form-item>
        <el-form-item label="能力层级" prop="capLevel">
          <el-input class="input-width" v-model="baseInfoForm.capLevel" disabled></el-input> 
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-input class="input-width" v-model="baseInfoForm.entryDate" disabled /> 
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="baseInfoForm.gender" disabled>
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="直线领导UM号" prop="lineLeaderUm">
              <el-input class="input-width" placeholder="请输入UM号" v-model="baseInfoForm.lineLeaderUm"></el-input> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input v-model="baseInfoForm.age" disabled></el-input> 
            </el-form-item>
            <el-form-item label="直线领导姓名" prop="lineLeaderName">
              <el-input class="input-width" v-model="baseInfoForm.lineLeaderName" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">关闭</el-button>
      <el-button class="button-w80-h30" type="primary" @click="saveHandle" :loading="savState === 1" :disabled="savState === 2">保存</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submitHandle" :loading="savState === 2" :disabled="savState === 1">提交</el-button>
    </div>
    <!-- 选择 带班老师 dialog -->
    <gc-model title="选择学员" :visible="selectStudentVisible" width="900px"
      @close="closeDialog"
      @cancel="closeDialog"
      @comfirm="selectComfirm">
      <div class="between mb10">
        <el-form :model="selectStudentForm" inline @submit.native.prevent style="width:400px; margin:unset;">
          <el-form-item label="学员UM号" class="mb0" prop="searchUmId">
            <el-input class="w200" placeholder="请输入UM号" v-model.trim="searchUmId" @keyup.enter.native="searchSelectStudent" />
            <span class="ml10" :style="{color: searchUmId && searchUmId.length < 2 ? 'red': '#999'}">(至少两个字符)</span>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button class="button-60" @click="searchSelectStudent">查询</el-button>
          <el-button class="button-60 button-blue" @click="resetSelectStudent">重置</el-button>
        </div>
      </div>
      <table-pagination
        :radio="true"
        :list="columnList"
        :tableList="dataList"
        :queryForm="selectStudentForm"
        :getList="getStudentList"
        v-loading="isLoading"
        ref="selectStudentTableRef"
        @selection-change="selectionHandle(selectStudentTableRef, $event)"
      />
    </gc-model>
  </div>
</template>
<script>
export default {
  name: 'AddStudentRegistration'
}
</script>
<script setup>
import { ref, reactive, computed, onMounted, onActivated, nextTick, set } from 'vue'
import { customHint, closeCurrPageAndGoPath, resetObj } from '@/util/utils'
import { fetchUserInfos } from '@/fetch/public'
import { 
  REGISTRATION_STATUS_OPTIONS, 
  REGISTRATION_STATUS_TODO, 
  REGISTRATION_STATUS_TODO_LABEL, 
  REGISTRATION_STATUS_DONE_LABEL,
  ONLINE_TYPE_OPTIONS,
  RECRUIT_TYPE_OPTIONS,
  BLGSTRIPLINE_OPTIONS
  } from '../enum'
import { fetchSaveOrUpdateRecruitUser, fetchListUserByUm, fetchFindLeaderInfoByUm } from '@/fetch/newPeopleTrainingManagement'
import { useRecruitQryParam } from '../hooks/useNewPeopleTraining'
import { useSelectUser } from '../hooks/useSelectUser'
import { useRouter, useRoute } from '@/router'
import { Message } from 'element-ui'
import store from '@/store'

const router = useRouter()
const onlineTypeList= ONLINE_TYPE_OPTIONS
const typeList = RECRUIT_TYPE_OPTIONS
const newBlgStripLineList = BLGSTRIPLINE_OPTIONS
const baseInfoFormRef = ref(null)
const baseInfoForm = ref({
  annual: '', // 年度
  period: '', // 期次 // recruitNum: '', // 期次
  onlineType: '', // 线上营类型
  orgId: '',
  umId: '', // 学员Um号
  umName: '', // 学员姓名
  umInfo: '', // 学员信息
  phoneNo: '', // 学员手机
  newBlgStripLine: '', // 条线
  capLevel:'', // 能力层级
  deptNo: '', // 部门
  position: '', // 岗位id
  entryDate: '', // 入职时间
  gender: '', // 性别：F,M
  age: '',
  type: '',
  lineLeaderInfo: '',
  lineLeaderUm: '',
  lineLeaderName: '',
  jobSeqIdDesc: '',
  inLegworkDesc: '',
})
const baseInfoRules = {
  annual: [{ required: true, trigger: 'change', message: '请选择年度' }],
  period: [{ required: true, trigger: 'change', message: '请选择期次' }],
  onlineType: [{ required: true, trigger: 'change', message: '请选择线上营类型' }],
  orgId: [{ required: true, trigger: 'change', message: '请选择机构' }],
  // orgName: [{ required: true, trigger: 'change', message: '请选择机构' }],
  newBlgStripLine: [{ required: true, trigger: 'change', message: '请选择条线' }],
  type: [{ required: true, trigger: 'change', message: '请选择招聘类别' }],
  umId: [{ required: true, trigger: 'blur', message: '请选择学员' }],
  lineLeaderUm: [
    { required: true, validator: async (rule, value, callback) => {
      if (value) {
        const res = await fetchFindLeaderInfoByUm({ umId: value })
        if (res?.umName) {
          set(baseInfoForm.value, 'lineLeaderName', res.umName)
        } else {
          callback(new Error('未找到此人，请重新输入UM号'))
        }
      } else {
        set(baseInfoForm.value, 'lineLeaderName', '')
        callback(new Error('请输入直线领导UM号'))
      }
    }, trigger: 'blur' }
  ]
}

const { 
  initRecruitQryParam,
  annualChangeHandle,
  orgList,
  annualList,
  recruitNumList,
  isZhAdmin,
  orgOneNode
 } = useRecruitQryParam(baseInfoForm.value)

const { 
  selectStudentVisible,
  selectStudentForm,
  searchUmId,
  columnList,
  dataList,
  isLoading,
  openSelectStudentDialog,
  closeDialog,
  getStudentList,
  searchSelectStudent,
  resetSelectStudent,
  selectionHandle,
  // selectStudentComfirm
} = useSelectUser(baseInfoForm.value)

const selectStudentTableRef = ref(null)
function selectComfirm () {
    const items = selectStudentTableRef.value.getSelection()
    if (!items?.length) {
      Message.warning('请选择学员')
      return
    }
    const item = items[0]
    if (!item.managementId) {
      Message.warning('当前学员所在“机构”还未关联到“管理单位”，请先设置关联的“管理单位”')
      return
    }
    baseInfoForm.value.umId = item.umId
    baseInfoForm.value.umName = item.umName
    baseInfoForm.value.deptNo = item.deptNo
    baseInfoForm.value.deptName = item.deptName
    baseInfoForm.value.position = item.position
    baseInfoForm.value.positionName = item.positionName
    baseInfoForm.value.capLevel = item.capLevel
    baseInfoForm.value.entryDate = item.entryDate
    baseInfoForm.value.gender = item.gender
    baseInfoForm.value.birthdate = item.birthdate
    baseInfoForm.value.age = item.age
    baseInfoForm.value.inLegworkDesc = item.inLegworkDesc
    baseInfoForm.value.jobSeqIdDesc = item.jobSeqIdDesc
    // 设置管理单位
    if (item.managementId) {
      if (isZhAdmin.value) {
        baseInfoForm.value.orgId = item.managementId
      } else {
        orgOneNode.value.orgId = item.managementId
        orgOneNode.value.orgName = item.managementName
      }
    }
    selectStudentVisible.value = false
  }

const savState = ref(0) // 0 编辑中；1 保存中；2 提交中；
// 关闭
const closeHandle = (params) => {
  let { name } = router.getRoutes().find((item) => item.path === '/StudentRegistration')
  closeCurrPageAndGoPath({ path: useRoute().path })
  router.push({ name, params })
}
const saveData = (isCommit = 'N') => {
  return new Promise(resolve => {
    baseInfoFormRef.value.validate(valid => {
      if (valid) {
        const handleFn = () => {
          savState.value = isCommit === 'N' ? 1 : 2
          baseInfoForm.value.isCommit = isCommit  // 提交标识：N-保存，Y-提交
          Reflect.deleteProperty(baseInfoForm.value, 'lineLeaderInfo')
          console.log(baseInfoForm.value)
          if (!isZhAdmin.value) {
            baseInfoForm.value.orgId = orgOneNode.value.orgId
          }
          fetchSaveOrUpdateRecruitUser(baseInfoForm.value).then(res => {
            // closeHandle({ isCommit }) // 关闭
            baseInfoForm.value.umInfo = `${baseInfoForm.value.umId} (${baseInfoForm.value.umName})`
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
const formType = ref('add')
const isEdit = computed(() => formType.value === 'edit')
const pageTitleMap = {
  add: '添加学员页面',
  edit: '编辑学员页面'
}
const setPageTitle = (value = 'add') => {
  formType.value = value
  store.commit('setRouteTitle', pageTitleMap[formType.value])
}

const _initData = async (routeParams) => {
  if (!routeParams.formType) return
  await initRecruitQryParam(true)
  if (routeParams.formType === 'edit') {
    baseInfoForm.value = routeParams.row
    baseInfoForm.value.umInfo = `${baseInfoForm.value.umId} (${baseInfoForm.value.umName})`
  } else if (routeParams.formType === 'add') {
    resetObj(baseInfoForm.value)
    baseInfoForm.value.annual = annualList.value[0].value
    baseInfoForm.value.period = recruitNumList.value[0].value
    nextTick(() => {
      baseInfoFormRef.value.clearValidate()
    })

  }
  setPageTitle(routeParams.formType)
}
// 保存
const saveHandle = () => {
  saveData('N').then(res => {
    console.log(res)
    if (!baseInfoForm.id) {
      baseInfoForm.value.id = res
      setPageTitle('edit')
    }
    Message.success('保存成功')
  })
}
// 提交
const submitHandle = () => {
  saveData('Y').then(res => {
    console.log(res)
    closeHandle({ isCommit: 'Y' }) // 关闭
    Message.success('提交成功')
  })
}

onMounted(() => {
  const routeParams = useRoute().params
  console.log('onMounted-routerPrams', routeParams)
  _initData(routeParams)
})
onActivated(() => {
  const routeParams = useRoute().params
  console.log('onActivated-routerPrams', routeParams)
  _initData(routeParams)
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
  .phoneNo-desc {
    line-height: 30px;
    color: #f54e1e;
    margin-bottom: -4px;
    margin-top: 2px;
    font-size: 22px;
    zoom: 0.5;
  }
}
</style>