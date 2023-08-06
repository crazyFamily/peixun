<template>
  <div class="train-evaluation-form">
    <div class="content-box">
      <el-form class="mr20" ref="baseFormRef" :model="baseInfoForm" :rules="baseInfoFormRules" label-width="120px">
        <el-form-item label="计划期数" prop="planMonth" >
          <gc-select 
            :options="planMonthOptions" 
            v-model="baseInfoForm.planMonth" 
            :clearable="false" 
            :disabled="isEdit"
            class="w-150" />
        </el-form-item>
        <el-form-item label="举办机构" prop="orgId">
          <gc-select
            class="w-full"
            :options="orgOptions"
            v-model="baseInfoForm.orgId"
            :disabled="isView"
          ></gc-select>
        </el-form-item>
        <el-form-item label="培训班名称" prop="planClassName">
          <el-input 
            v-model="baseInfoForm.planClassName"
            show-word-limit
            maxlength="50" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训类型" prop="classType">
              <gc-select
                class="w-full"
                :options="TRAIN_TYPE_OPTIONS"
                v-model="baseInfoForm.classType"
                :disabled="isView"
              ></gc-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="举办形式" prop="trainingMode">
              <gc-select
                class="w-full"
                :options="TRAININGMODE"
                v-model="baseInfoForm.trainingMode"
                :disabled="isView"
              ></gc-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="培训对象" prop="attendObject">
          <el-input 
            v-model="baseInfoForm.attendObject" 
            show-word-limit
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="培训内容/主题" prop="trainingSubject">
          <el-input 
            v-model="baseInfoForm.trainingSubject" 
            show-word-limit
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="计划举办时间" prop="startDate">
        <DateRange
            v-model="baseInfoForm"
            start-key="startDate"
            end-key="endDate"
            :start-options="dateRangeOptions"
            :end-options="dateRangeOptions"
            width="90px"
          ></DateRange>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训天数" prop="trainingDays">
              <el-input v-model.trim="baseInfoForm.trainingDays" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划培训人数" prop="planNum">
              <el-input v-model.number="baseInfoForm.planNum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="是否包含分行学员" prop="hasBranch">
          <el-switch v-model="baseInfoForm.hasBranch" 
            active-color="#fd6720" inactive-color="#e4e7ed"
            active-text="是" inactive-text="否" 
            active-value="Y" inactive-value="N"
            @change="hasBranchChange"
          ></el-switch>
          <el-checkbox style="margin-left: 20px; vertical-align: middle;" v-show="hasBranchSelect" v-model="branchOrgSelectedAll" @change="handleChangeOrgSelectAll">全选</el-checkbox>
        </el-form-item>
        <el-form-item label=" " prop="branchOrgIds" v-show="hasBranchSelect">
          <gc-select
            class="w-full"
            multiple
            filterable
            :disabled="!hasBranchSelect"
            :options="branchOrgOptons"
            v-model="baseInfoForm.branchOrgIds"
          ></gc-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="handleClose()">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="handleSubmit()" v-if="!isView">保存</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, reactive, computed, set } from 'vue'
import { useMonthlyPlan } from '../hooks/useMonthlyPlan'

import { CopyObj } from '@/util/utils'
import { Message } from 'element-ui'
import { 
  TRAINING_TYPE_OPTIONS, 
  TRAINING_TYPE_OPTIONS_VALUES,
  TRAINING_TYPE_OPTIONS_ZS,
  TRAINING_TYPE_OPTIONS_ZL,
  TRAINING_TYPE_OPTIONS_ZY,
  TRAINING_TYPE_OPTIONS_YNSL,
  TRAINING_TYPE_OPTIONS_YNTX,
  TRAINING_TYPE_OPTIONS_YNJG,
  EVALUATION_TYPE_OPTIONS_WTX,
  EVALUATION_TYPE_OPTIONS 
} from '@/views/Establish/enum'
import { 
  fetchSelectAllBranchOrg,
  fetchSavePlanMonthDetail,
} from '@/fetch/planManagement'
import { TRAININGMODE, SUBMIT_STATUS_OPTIONS, yesOrNoMap, EXECUTE_STATUS_OPTIONS } from '@/util/constants'
import { TRAIN_TYPE_OPTIONS } from '../enum'
import DateRange from '@/components/dateRange/DateRange'

const branchOrgSelectedAll = ref(false)
const handleChangeOrgSelectAll = (value) => {
  if (value) {
    baseInfoForm.value.branchOrgIds = branchOrgOptons.value.map(row => row.value)
  } else {
    baseInfoForm.value.branchOrgIds = []
  }
}

const emits = defineEmits(['pageChange'])
const props = defineProps({
  pageData: {
    type: Object,
    default: () => {}
  }
})
const baseInfoData = {
  planMonth: '',
  orgId: '',
  startDate: '',
  endDate: '',
  hasBranch: 'N', // 是否包含分行学员 Y-是 N-否
  branchOrgIds: [], // 涉及分行I 数组
  branchOrgId: '', // 涉及分行ID，逗号分隔
}
const baseInfoForm = ref(CopyObj(baseInfoData))
const hasBranchSelect = computed(() => baseInfoForm.value.hasBranch === 'Y')
const dateRangeOptions = { 'value-format': 'yyyy-MM-dd', type: 'date' }
const baseInfoFormRules = reactive({
  planMonth: [{ required: true, message: '请选择计划期数', trigger: 'change' }],
  orgId: [{ required: true, message: '请选择举办机构', trigger: 'change' }],
  planClassName: [{ required: true, message: '请输入培训班名称', trigger: 'blur' }],
  classType: [{ required: true, message: '请选择培训类型', trigger: 'change' }],
  trainingMode: [{ required: true, message: '请选择举办形式', trigger: 'change' }],
  attendObject: [{ required: true, message: '请输入培训对象', trigger: 'blur' }],
  trainingSubject: [{ required: true, message: '请输入培训内容/主题', trigger: 'blur' }],
  startDate: [{ required: true, validator: (rule, value, callback) => {
    if (!baseInfoForm.value.startDate) {
      callback(new Error('请选择计划举办开始日期'))
    } else if (!baseInfoForm.value.endDate) {
      callback(new Error('请选择计划举办结束日期'))
    } else {
      callback()
    }
  } , trigger: 'change' }],
  trainingDays: [
    { required: true, message: '请输入培训天数', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        const reg = /^(\d+)([.](\d){0,2})?$/
        if (!reg.test(value)) {
          callback(new Error('培训天数必须为正数,可有两位小数'))
        } else if (parseInt(value) > 365) {
          callback(new Error('培训天数最大不能超过365天'))
        } else {
          callback()
        }
    }, trigger: 'blur' }
  ],
  planNum: [
    { required: true, message: '请输入计划培训人数', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        const reg = /^[1-9]\d*$/
        if (!reg.test(value)) {
          callback(new Error('计划培训人数必须大于0'))
        } else {
          callback()
        }
    }, trigger: 'blur' }
  ],
  hasBranch: [{ required: true, message: '请选择是否包含分行学员', trigger: 'change' }],
  branchOrgIds: [
    { required: hasBranchSelect.value, 
      validator: (rule, value, callback) => {
      if (hasBranchSelect.value && !value?.length) {
        callback(new Error('请选择涉及分行'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
})

const baseFormRef = ref(null)
const formType = ref('')
const isView = computed(() => formType.value === 'view')
const isEdit = computed(() => formType.value === 'edit')

const {
  isAdmin,
  dropdownOrgValue,
  planMonthOptions,
  orgOptions,
  orgIdChange,
  getOrgOptions,
  getPlanMonthOptions,
  setDefaultMonthOption
} = useMonthlyPlan({
  queryForm: baseInfoForm.value
})

// 获取分行选项
const branchOrgOptons = ref([])
async function getBranchOrgOptons () {
  const res = await fetchSelectAllBranchOrg()
  branchOrgOptons.value = res.map(m => {
    m.value = m.treeId
    m.label = m.treeName
    return m
  }) || []
}

watch(() => props.pageData, (newV) => {
  if (newV) {
    console.log('编辑数据', newV)
    formType.value = newV.formType
    if (formType.value === 'add') {
      baseInfoForm.value = CopyObj(baseInfoData)
    } else {
      baseInfoForm.value = CopyObj(newV.row)
    }
    nextTick(() => {
      // baseInfoForm.value.branchOrgIds = newV.rrow?.branchOrgId ? newV.rrow.branchOrgId.split(',') : []
      baseInfoForm.value.branchOrgIds = newV.row?.branchOrgId ? newV.row.branchOrgId.split(',') : []
      // set(newV.row, 'branchOrgIds', newV.row?.branchOrgId ? newV.row.branchOrgId.split(',') : [])
      // baseInfoForm.value.branchOrgIds = newV.row?.branchOrgId ? newV.row.branchOrgId.split(',') : []
      baseFormRef.value?.clearValidate()
    })
  } 
})

function hasBranchChange (value) {
  if (value === 'N') {
    baseInfoForm.value.branchOrgIds = []
    baseInfoForm.value.branchOrgId = ''
    branchOrgSelectedAll.value = false
  }
}

function handleClose (params) {
  branchOrgSelectedAll.value = false
  emits('pageChange', { pageName: 'list', ...params })
}

function handleSubmit () {
  console.log(baseInfoForm.value)
  baseFormRef.value.validate(async (valid) => {
    if (valid) {
      if (baseInfoForm.value.hasBranch === 'Y') {
        baseInfoForm.value.branchOrgId = baseInfoForm.value?.branchOrgIds?.join(',') || ''
      }
      const postData = baseInfoForm.value
      await fetchSavePlanMonthDetail(postData)
      handleClose({ reload: true })
      Message.success(isEdit.value ? '编辑成功！' : '新增成功！')
    }
  })
}

async function loadOptions () {
  await getPlanMonthOptions()
}

defineExpose({
  loadOptions
})

onMounted(() => {
  getPlanMonthOptions(false, null, true)
  getOrgOptions()
  getBranchOrgOptons()
})
</script>
<style lang="scss" scoped>
.train-evaluation-form {
  padding-top: 20px;
  background-color: #fff;
  .content-box {
    width: 800px;
    min-height: calc(100vh - 310px);
    margin: 20px auto 50px;
    .case-item .active {
      position: unset;
    }
  }
  .gc-select {
    padding: 0px;
  }
}
</style>
