<template>
  <div class="offline-operation-detail">
    <div class="content-box">
      <el-form ref="baseFormRef" v-if="baseInfoForm" :model="baseInfoForm" :rules="baseInfoFormRules" label-width="110px" :disabled="status === 'view'">
        <p class="info-title"><span class="fg"></span>基本信息</p>
        <el-row>
          <el-col :span="6">
            <el-form-item label="年度" prop="annual">
              <el-input class="input-width" v-model="baseInfoForm.annual" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目ID" prop="umId" >
              <el-input class="input-width" v-model="baseInfoForm.projectId" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目名称" prop="umName">
              <el-input class="input-width" v-model="baseInfoForm.projectName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="项目类型" prop="sexDesc" >
              <el-input class="input-width" v-model="baseInfoForm.projectTypeDesc" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="方案ID" prop="customizePlanId" >
              <el-input class="input-width" v-model="baseInfoForm.customizePlanId" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所属单位" prop="orgName">
              <el-input class="input-width" v-model="baseInfoForm.projectBlg" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主办单位" prop="blgStripLineName">
              <el-input class="input-width" v-model="baseInfoForm.orgName" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学员名称" prop="capLevel" >
              <el-input class="input-width" :value="`${baseInfoForm.umName}(${baseInfoForm.umId})`" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <p class="info-title"><span class="fg"></span>培养评价信息</p>
        <div>
          <el-row v-for="(type, i) in evaluationMapperByType" :key="i">
            <el-col :span="6">
              <el-form-item :label="type.label" :prop="type.field">
                <gc-select style="padding: 0;" :options="TALENTS_EVALUATION_TYPE_OPTIONS" v-model="baseInfoForm[type.field]"></gc-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item :label="`关键行为`" :prop="`${type.field}Action`">
                <el-input resize="none" type="textarea" rows="3"
                  v-model="baseInfoForm[type.field+'Action']" placeholder="客观记录反映学员特性的行为或事例"
                  class="h-90"
                  maxlength="100"
                  show-word-limit
                /> 
                </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="突出特征" prop="salientFeature">
            <el-input v-model="baseInfoForm.salientFeature" placeholder="字数限制在100以内" resize="none" type="textarea" rows="3" :maxlength="100" show-word-limit/>
          </el-form-item>
          <el-form-item label="其他信息" prop="otherInformation">
            <el-input v-model="baseInfoForm.otherInformation" resize="none" type="textarea" rows="3" />
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="行内评价人">
                <MockInputTag
                  width="350"
                  :list="baseInfoForm.internalEvaluatorList"
                  @remove="handleRemoveInternalEvaluator"
                  label="umName"
                  style="display: inline-block;"
                  :maxlen="5"
                  v-if="baseInfoForm.internalEvaluatorList"
                ></MockInputTag>
                <el-button
                  type="primary"
                  @click="handleAddInternalEvaluator"
                  :disabled="status === 'view'"
                  class="button-50-30"
                  >添加</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="行外评价人">
                <div class="ex-evaluator-wrapper" v-for="(row, index) in baseInfoForm.externalEvaluatorList">
                  <el-input class="input-width external-input-style" :key="index" v-model="baseInfoForm.externalEvaluatorList[index].umName" placeholder="请输入行外评价人姓名（组织）"/> 
                  <el-button @click="baseInfoForm.externalEvaluatorList.splice(index, 1)" class="button-50-30 button-my-primary-plain ml10 fs0">删除</el-button>
                </div>
                <el-button
                  type="primary"
                  @click="baseInfoForm.externalEvaluatorList.push({umName: ''})"
                  :disabled="status === 'view' || baseInfoForm.externalEvaluatorList.length >= 5"
                  >添加行外评价人</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- <div class="empty-wapper" v-show="!baseInfoForm.classId">
          暂无培养评价信息
        </div> -->
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="handleClose">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="handleSubmit" :disabled="status === 'view'">提交</el-button>
    </div>

    <!-- 选择行内评价人弹窗 -->
    <SelectUserDialog
      title="请选择顾问团"
      :show.sync="isAddInternalEvaluator"
      @save="handleSaveInternalEvaluator"
      :list="baseInfoForm.internalEvaluatorList"
      :maxlen="10"
    ></SelectUserDialog>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onActivated, nextTick, watch, set } from 'vue'
import { useRouter, useRoute } from '@/router'
import { CopyObj, closeCurrPageAndGoPath, closeCurrPage } from '@/util/utils'
import { 
  TRAINING_TYPE_OPTIONS_ZS,
  TRAINING_TYPE_OPTIONS_ZL,
  TRAINING_TYPE_OPTIONS_ZY,
} from '@/views/Establish/enum'
import { PROJECT_TYPE_YNBYY_LINE, PROJECT_TYPE_YNBYY_ORG, PROJECT_TYPE_YNSL, TALENTS_EVALUATION_TYPE_OPTIONS, TALENTS_EVALUATION_TYPE_OPTIONS_WTX } from '../enum'
import MockInputTag from '../components/MockInputTag.vue'
import SelectUserDialog from '../components/SelectUserDialog.vue'
import { fetchSavePlanTeamsEvaluate } from '@/fetch/tanlents'
import { Message } from 'element-ui'
import store from '@/store'
const TRAINING_TYPE_OPTIONS_VALUES = [
  TRAINING_TYPE_OPTIONS_ZS, 
  TRAINING_TYPE_OPTIONS_ZL, 
  TRAINING_TYPE_OPTIONS_ZY
]

const status = ref('edit')

const router = useRouter()

// ============================== 查看详情 ==============================
const baseInfoForm = ref({
  internalEvaluatorList: [],
  externalEvaluatorList: []
})

const baseInfoFormRules = computed(() => {
  if(status.value === 'view') return {}
  return {
    overallView: [
      { required: true, message: '请选择大局观', trigger: 'change' }
    ],
    overallViewAction: [
      {
        required: baseInfoForm.value.overallView !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    pioneer: [
      { required: true, message: '请选择开创性', trigger: 'change' }
    ],
    pioneerAction: [
      {
        required: baseInfoForm.value.pioneer !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    wolfNature: [
      { required: true, message: '请选择狼性', trigger: 'change' }
    ],
    wolfNatureAction: [
      {
        required: baseInfoForm.value.wolfNature !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    innovation: [
      { required: true, message: '请选择创新力', trigger: 'change' }
    ],
    innovationAction: [
      {
        required: baseInfoForm.value.innovation !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    executivePower: [
      { required: true, message: '请选择执行力', trigger: 'change' }
    ],
    executivePowerAction: [
      {
        required: baseInfoForm.value.executivePower !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    effect: [
      { required: true, message: '请选择影响力', trigger: 'change' }
    ],
    effectAction: [
      {
        required: baseInfoForm.value.effect !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    synergy: [
      { required: true, message: '请选择协同力', trigger: 'change' }
    ],
    synergyAction: [
      {
        required: baseInfoForm.value.synergy !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    learningAbility: [
      { required: true, message: '请选择学习力', trigger: 'change' }
    ],
    learningAbilityAction: [
      {
        required: baseInfoForm.value.learningAbility !== TALENTS_EVALUATION_TYPE_OPTIONS_WTX,
        message: '请填写关键行为',
        trigger: 'change'
      }
    ],
    salientFeature: [
      { required: true, message: '请填写突出特征', trigger: 'change' }
    ],
    // internalEvaluatorList: [
    //   {
    //     validator: (rule, value, callback) => {
    //       if(!(baseInfoForm?.value?.internalEvaluatorList?.length) && !(baseInfoForm?.value?.externalEvaluatorList?.length)) {
    //         return callback(new Error('行内评价人和行外评价人至少需要有一项'))
    //       }
    //       return callback()
    //     }
    //   }
    // ],
    // externalEvaluatorList: [
    //   {
    //     validator: (rule, value, callback) => {
    //       if(!(baseInfoForm?.value?.internalEvaluatorList?.length) && !(baseInfoForm?.value?.externalEvaluatorList?.length)) {
    //         return callback(new Error('行内评价人和行外评价人至少需要有一项'))
    //       }
    //       return callback()
    //     }
    //   }
    // ]
  }
})


const evaluationMetaArr = [
  { field: 'overallView', label: '大局观', projectTypeArr: [PROJECT_TYPE_YNSL] },
  { field: 'pioneer', label: '开创性', projectTypeArr: [PROJECT_TYPE_YNSL] },
  { field: 'wolfNature', label: '狼性', projectTypeArr: [PROJECT_TYPE_YNBYY_LINE] },
  { field: 'innovation', label: '创新力', projectTypeArr: [PROJECT_TYPE_YNBYY_LINE, PROJECT_TYPE_YNBYY_ORG] },
  { field: 'executivePower', label: '执行力', projectTypeArr: [PROJECT_TYPE_YNBYY_ORG] },
  { field: 'effect', label: '影响力', projectTypeArr: [] },
  { field: 'synergy', label: '协同力', projectTypeArr: [] },
  { field: 'learningAbility', label: '学习力', projectTypeArr: [] },
]
const evaluationMapperByType = computed(() => {
  const res = evaluationMetaArr.filter(m => {
    if(baseInfoForm.value.projectType) {
      if(!m.projectTypeArr.length) return true
      return m.projectTypeArr.includes(baseInfoForm.value.projectType)
    }
    return false
  })
  return res
})


const isAddInternalEvaluator = ref(false)

// 移除行内评价人
const handleRemoveInternalEvaluator = (index) => {
  if(status.value === 'view') return
  baseInfoForm.value.internalEvaluatorList.splice(index, 1)
}

// 添加行内评价人
const handleAddInternalEvaluator = () => {
  isAddInternalEvaluator.value = true
}

// 确认添加行内评价人
const handleSaveInternalEvaluator = (list) => {
  baseInfoForm.value.internalEvaluatorList = CopyObj(list)
}

// 提交
const baseFormRef = ref(null)
const handleSubmit = async () => {
  baseFormRef.value.validate(async v => {
    if(!v) return

    if(!(baseInfoForm?.value?.internalEvaluatorList?.length) && !(baseInfoForm?.value?.externalEvaluatorList?.length)) {
      return Message.warning('行内评价人和行外评价人至少需要有一项')
    }

    await fetchSavePlanTeamsEvaluate({data: baseInfoForm.value})
    store.commit('updateQueue', '/TanlentsEvaluation')
    Message.success('提交成功')
    handleClose()
  })
}

// 关闭
const handleClose = (params) => {
  isMounted.value = false
  closeCurrPageAndGoPath('/TanlentsEvaluation')
}
// ============================ 初始化数据 ============================
const isMounted = ref(false)
function isNewData () {
  const { row } = useRoute().params
  return isMounted.value && !!row && baseInfoForm.value?.id !== row?.id
}
function initData() {
  const routeParams = useRoute().params
  routeParams.row.internalEvaluatorList = routeParams.row.internalEvaluatorList || []
  routeParams.row.externalEvaluatorList = routeParams.row.externalEvaluatorList || []
  baseInfoForm.value = CopyObj(routeParams.row)
  status.value = routeParams.formType
  
  nextTick(() => {
    baseFormRef.value?.clearValidate()
  })
}
onMounted(() => {
  initData()
  isMounted.value = true
})
onActivated(() => {
  if (!isMounted.value || isNewData()) {
    initData()
  }
})
</script>
<style lang="scss" scoped>
.offline-operation-detail {
  padding-top: 20px;
  background-color: #fff;
  .content-box {
    width: 1000px;
    min-height: calc(100vh - 310px);
    margin: 20px auto 50px;
    .case-item .active {
      position: unset;
    }
  }
  .info-title {
    margin-top: -10px;
    margin-bottom: 15px;
    font-size: 14px;
    font-family: "PingFangSC-Medium", "Roboto-Regular", "PingFang SC", "Droid Sans", "HelveticaNeue", "Helvetica Neue", arial, sans-serif;
    .fg {
      display: inline-block;
      width: 3px;
      height: 10px;
      margin-right: 7px;
      background-color: #fd6720;
    }
  }
  .empty-wapper {
    font-size: 20px;
    color: #d0d0d0;
    padding: 40px;
    text-align: center;
  }
}

.ex-evaluator-wrapper {
  margin-bottom: 10px;
  display: flex;
}

.external-input-style {
  :deep(.el-input__inner) {
    width: 350px;
  }
}
</style>