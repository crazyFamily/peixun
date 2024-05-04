<template>
  <div class="offline-operation-detail">
    <div class="content-box">
      <el-form ref="baseFormRef" v-if="baseInfoForm" :model="baseInfoForm" label-width="110px">
        <p class="info-title"><span class="fg"></span>学员信息</p>
        <el-row>
          <el-col :span="6">
            <el-form-item label="UM号" prop="umId" >
              <el-input class="input-width" v-model="baseInfoForm.umId" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名" prop="umName">
              <el-input class="input-width" v-model="baseInfoForm.umName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="sexDesc" >
              <el-input class="input-width" v-model="baseInfoForm.sexDesc" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄" prop="age" >
              <el-input class="input-width" v-model="baseInfoForm.age" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="在职状态" prop="isLeavedName" >
              <el-input class="input-width" v-model="baseInfoForm.isLeavedName" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入职时间" prop="entryDate" >
              <el-input class="input-width" v-model="baseInfoForm.entryDate" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="能力层级" prop="capLevel" >
              <el-input class="input-width" v-model="baseInfoForm.capLevel" disabled /> 
            </el-form-item>
          </el-col>
           <el-col :span="6">
            <el-form-item label="类型" prop="typeDesc" >
              <el-input class="input-width" v-model="baseInfoForm.typeDesc" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机构" prop="orgName">
              <el-input class="input-width" v-model="baseInfoForm.orgName" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="条线" prop="blgStripLineName">
              <el-input class="input-width" v-model="baseInfoForm.blgStripLineName" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="gender" >
              <el-input class="input-width" v-model="baseInfoForm.deptName" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位" prop="positionName" >
              <el-input class="input-width" v-model="baseInfoForm.positionName" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="12">
            <el-form-item label="内外勤" prop="inLegworkDesc" >
              <el-input class="input-width" v-model="baseInfoForm.inLegworkDesc" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位主序列" prop="jobSeqIdDesc" >
              <el-input class="input-width" v-model="baseInfoForm.jobSeqIdDesc" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <p class="info-title"><span class="fg"></span>参训信息</p>
        <el-row class="mb10">
          <el-col :span="6">
            <el-form-item label="年度" prop="annual">
              <el-input class="input-width w-150" v-model="baseInfoForm.annual" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="期次" prop="recruitNum">
              <el-input class="input-width w-150" v-model="baseInfoForm.recruitNum" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <p class="info-title"><span class="fg"></span>线上营培养</p>
        <el-row>
          <el-col :span="6">
            <el-form-item label="线上营类型" prop="onlineType">
              <el-input class="input-width" v-model="baseInfoForm.onlineType" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线上营成绩" prop="onlineScore">
              <el-input class="input-width" v-model="baseInfoForm.onlineScore" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线上营通过状态" prop="onlineStatus">
              <el-input class="input-width" v-model="baseInfoForm.onlineStatus" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线上营补考状态" prop="onlineResitStatusDesc">
              <el-input class="input-width" v-model="baseInfoForm.onlineResitStatusDesc" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item class="online-comment" v-if="baseInfoForm.onlineTypeCode === ONLINE_TYPE_OPTIONS[0].value" label="线上营学习情况点评" prop="onlineStudyEva">
            <el-input v-model="baseInfoForm.onlineStudyEva" resize="none" type="textarea" rows="3" disabled />
          </el-form-item>
        </el-row>
        <el-row class="mb10">
          <el-form-item class="online-comment" v-if="baseInfoForm.onlineTypeCode === ONLINE_TYPE_OPTIONS[0].value" label="线上营团建表现点评" prop="onlineLeagueConstructionEva">
            <el-input v-model="baseInfoForm.onlineLeagueConstructionEva" resize="none" type="textarea" rows="3" disabled />
          </el-form-item>
        </el-row>
        <p class="info-title"><span class="fg"></span>线下营培养</p>
        <el-row>
          <el-col :span="6">
            <el-form-item label="线下营参训状态" prop="trainingStatusDesc">
              <el-input class="input-width" v-model="baseInfoForm.trainingStatusDesc" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线下营参训日期" prop="trainingDate">
              <el-input class="input-width" v-model="baseInfoForm.trainingDate" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线下营逾期状态" prop="overdueStatusDesc">
              <el-input class="input-width" v-model="baseInfoForm.overdueStatusDesc" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="线下营逾期时间" prop="overdueDate">
              <el-input class="input-width" v-model="baseInfoForm.overdueDate" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="培训项目ID" prop="trainingStatusDesc">
              <el-input class="input-width" v-model="baseInfoForm.classId" disabled /> 
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="培训项目名称" prop="trainingDate">
              <el-input class="input-width" v-model="baseInfoForm.className" disabled /> 
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="baseInfoForm.evaIsClass === 'N'">
          <el-col> 
            <el-form-item label="培训项目内容" prop="projectContent">
              <el-input type="textarea" :rows="3" :value="baseInfoForm.projectContent" disabled resize="none" /> 
            </el-form-item>
          </el-col>
        </el-row>

        <div v-show="baseInfoForm.evaIsClass !== ''">
        <!-- <div v-show="baseInfoForm.classId"> -->
          <el-form-item label="培养类型" prop="fosterTypeDesc">
            <el-input class="input-width w-150" v-model="baseInfoForm.fosterTypeDesc" disabled /> 
          </el-form-item>
          <el-row v-for="(type, i) in evaluationMapperByType" :key="i">
            <el-col :span="6">
              <el-form-item :label="type.label">
                <el-input class="input-width" v-model="baseInfoForm[type.field]" disabled /> 
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item :label="`关键行为`">
                <el-input resize="none" type="textarea" rows="3" disabled
                  v-model="baseInfoForm[type.field+'Action']" /> 
                </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="突出特征" prop="salientFeature">
            <el-input v-model="baseInfoForm.salientFeature" resize="none" type="textarea" rows="3" disabled />
          </el-form-item>
          <el-form-item label="其他信息" prop="otherInformation">
            <el-input v-model="baseInfoForm.otherInformation" resize="none" type="textarea" rows="3" disabled />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="更新人" prop="updatedByName">
                <el-input class="input-width" v-model="baseInfoForm.updatedByName" disabled /> 
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新时间" prop="updatedDate">
                <el-input class="input-width" v-model="baseInfoForm.updatedDate" disabled /> 
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, onActivated, nextTick, watch, set } from 'vue'
import { useRouter, useRoute } from '@/router'
import { CopyObj, closeCurrPageAndGoPath } from '@/util/utils'
import { 
  TRAINING_TYPE_OPTIONS_ZS,
  TRAINING_TYPE_OPTIONS_ZL,
  TRAINING_TYPE_OPTIONS_ZY,
} from '@/views/Establish/enum'
import { ONLINE_TYPE_OPTIONS } from '../enum'
const TRAINING_TYPE_OPTIONS_VALUES = [
  TRAINING_TYPE_OPTIONS_ZS, 
  TRAINING_TYPE_OPTIONS_ZL, 
  TRAINING_TYPE_OPTIONS_ZY
]
const router = useRouter()

// ============================== 查看详情 ==============================
const baseInfoForm = ref({})
const evaluationMetaArr = [
  { field: 'overallView', label: '大局观', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZS] },
  { field: 'pioneer', label: '开创性', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZS] },
  { field: 'wolfNature', label: '狼性', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZL] },
  { field: 'innovation', label: '创新力', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZL, TRAINING_TYPE_OPTIONS_ZY] },
  { field: 'executivePower', label: '执行力', fosterTypeArr: [TRAINING_TYPE_OPTIONS_ZY] },
  { field: 'effect', label: '影响力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
  { field: 'synergy', label: '协同力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
  { field: 'learningAbility', label: '学习力', fosterTypeArr: TRAINING_TYPE_OPTIONS_VALUES },
]
const evaluationMapperByType = computed(() => {
  const res = evaluationMetaArr.filter(m => baseInfoForm.value.fosterType && m.fosterTypeArr.includes(baseInfoForm.value.fosterType))
  return res
})

// 关闭
const closeHandle = (params) => {
  isMounted.value = false
  let { name } = router.getRoutes().find((item) => item.path === '/OfflineOperation')
  closeCurrPageAndGoPath({ path: useRoute().path })
  router.push({ name, params })
}
// ============================ 初始化数据 ============================
const isMounted = ref(false)
function isNewData () {
  const { row } = useRoute().params
  return isMounted.value && !!row && baseInfoForm.value?.id !== row?.id
}
function initData() {
  const routeParams = useRoute().params
  console.log('initData', routeParams.row)
  baseInfoForm.value = routeParams.row
}
onMounted(() => {
  console.log('onMounted')
  initData()
  isMounted.value = true
})
onActivated(() => {
  console.log('onActivated')
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
  .online-comment {
    :deep(label) {
      width: 120px !important;
      margin-left: -10px;
    }
  }
}
</style>