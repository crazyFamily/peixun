<template>
  <div class="train-evaluation-form">
    <div class="content-box">
      <el-form class="mr20" ref="baseFormRef" :model="baseInfoForm" :rules="baseInfoFormRules" label-width="120px">
        <el-row>
          <el-form-item label="UM号/姓名" prop="umId" >
            <el-input v-if="isEdit || isView" v-model="baseInfoForm.umInfo" disabled></el-input>
            <gc-select v-else
              class="w-full"
              filterable
              remote
              placeholder="请输入UM号"
              v-model="baseInfoForm.umId"
              :options="umOptions"
              :remote-method="getUmInfo"
              :loading="umLoading"
            ></gc-select>
          </el-form-item>
        </el-row>
        <el-form-item label="培养类型" prop="fosterType">
          <gc-select
            class="w-full"
            :options="TRAINING_TYPE_OPTIONS"
            v-model="baseInfoForm.fosterType"
            :disabled="isView"
          />
        </el-form-item>
        <div v-for="(type, i) in evaluationMapperByType" :key="i">
          <el-form-item :label="type.label" :prop="type.field">
            <gc-select
              class="w-full"
              :options="EVALUATION_TYPE_OPTIONS"
              v-model="baseInfoForm[type.field]"
              :disabled="isView"
            />
          </el-form-item>
          <el-form-item :label="`${type.label}关键行为`" :prop="isWTX(baseInfoForm[type.field]) ? '' : `${type.field}Action`">
            <el-input 
              type="textarea"
              rows="3"
              placeholder="字数限制在100以内"
              resize="none"
              :maxlength="100"
              show-word-limit
              v-model="baseInfoForm[`${type.field}Action`]" 
              :disabled="isView"
            /> 
          </el-form-item>
        </div>
        <el-form-item label="突出特征" prop="salientFeature">
          <el-input 
            class="input-width" 
            v-model="baseInfoForm.salientFeature" 
            maxlength="100" 
            type="textarea"
            rows="2"
            resize="none"
            :disabled="isView"
            show-word-limit />
        </el-form-item>
        <el-form-item label="其他信息" prop="otherInformation">
          <el-input 
            class="input-width" 
            v-model="baseInfoForm.otherInformation" 
            maxlength="100" 
            type="textarea"
            rows="2"
            :disabled="isView"
            show-word-limit />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="handleClose">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="handleSubmit" v-if="!isView">提交</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, reactive, computed } from 'vue'
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
  fetchListStudentAdjust, // 培训学员列表
  fetchSaveStudentFosterEvaluate,
} from '@/fetch/establish'

const emits = defineEmits(['pageChange'])
const props = defineProps({
  classId: {
    type: String || Number,
    default: ''
  },
  pageData: {
    type: Object,
    default: () => {}
  }
})
const evaluationMetaArr = [
  { field: 'overallView', label: '大局观', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZS, TRAINING_TYPE_OPTIONS_YNSL] },
  { field: 'pioneer', label: '开创性', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZS, TRAINING_TYPE_OPTIONS_YNSL] },
  { field: 'wolfNature', label: '狼性', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZL, TRAINING_TYPE_OPTIONS_YNTX] },
  { field: 'innovation', label: '创新力', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZL, TRAINING_TYPE_OPTIONS_ZY, TRAINING_TYPE_OPTIONS_YNTX, TRAINING_TYPE_OPTIONS_YNJG] },
  { field: 'executivePower', label: '执行力', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZY, TRAINING_TYPE_OPTIONS_YNJG] },
  { field: 'effect', label: '影响力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
  { field: 'synergy', label: '协同力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
  { field: 'learningAbility', label: '学习力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
]

const getEvaluationMeta = (type = 'field') => {
  const res = type === 'culumn' ? [] : {}
  evaluationMetaArr.forEach(item => {
    const actionField = item.field + 'Action'
    const actionLabel = item.label + '关键行为'
    if (type === 'field') { 
      // 表单字段
      res[item.field] = ''
      res[actionField] = ''
    } else if (type === 'rule') { 
      // 验证字段
      res[item.field] = [{ required: true, message: '请选择' + item.label, trigger: 'change' }]
      res[actionField] = [{ required: true, message: '请输入' + actionLabel, trigger: 'blur' }]
    } else { 
      // 列表字段
      res.push({ label: item.label, width: '100', prop: item.field + 'Desc' })
    } 
  })
  return res
}

function isWTX (value) {
  return value === EVALUATION_TYPE_OPTIONS_WTX
}

const baseInfoForm = ref({})

const evaluationMapperByType = computed(() => {
  const res = evaluationMetaArr.filter(m => baseInfoForm.value.fosterType && m.fosterTypeArr.includes(baseInfoForm.value.fosterType))
  return res
})

const baseInfoFormRules = reactive({
  umId: [{ required: true, message: '请输入UM号', trigger: 'change' }],
  fosterType: [{ required: true, message: '请输入培养类型', trigger: 'change' }],
  ... getEvaluationMeta('rule'),
  salientFeature: [{ required: true, message: '请输入突出特征', trigger: 'blur' }],
})

const baseFormRef = ref(null)
const formType = ref('')
const isView = computed(() => formType.value === 'view')
const isEdit = computed(() => formType.value === 'edit')

const umOptions = ref([])
const umLoading = ref(false)
function getUmInfo (value) {
  if (value !== '') {
    umLoading.value = true
    const data = { umId: value, classId: props.classId, pageSize: 100, currPage: 1 }
    fetchListStudentAdjust(data)
    .then(resData => {
      umLoading.value = false
      resData.list?.forEach((v) => {
        v.value = v.umId
        v.label = `${v.empName} ( ${v.umId} )`
      })
      umOptions.value = resData.list
    })
  } else {
    umOptions.value = [];
  }
}


function handleClose (params) {
  umOptions.value = []
  emits('pageChange', { pageName: 'list', ...params })
}

function handleSubmit () {
  baseFormRef.value.validate(async (valid) => {
    if (valid) {
      const postData = baseInfoForm.value
      if (!postData.id) {
        Reflect.deleteProperty(postData, 'id')
      }
      await fetchSaveStudentFosterEvaluate(postData)
      handleClose({ reload: true })
      Message.success(isEdit.value ? '编辑成功！' : '新增成功！')
    }
  })
}

function _initData (data) {
  formType.value = data.formType
  baseInfoForm.value = data.row
  if (isEdit.value || isView.value) {
    baseInfoForm.value.umInfo = `${data.row.umName} ( ${data.row.umId} )`
  }
  nextTick(() => {
    baseFormRef.value.clearValidate()
  })
}

watch(() => props.pageData, (newV) => {
  console.log("pageData", newV)
  if (newV) {
    _initData(CopyObj(newV))
  }
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
