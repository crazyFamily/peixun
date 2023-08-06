<template>
  <div class="annual-wrapper">
    <el-card class="search-card">
      <el-form :rules="formRules" :model="queryForm" :inline="true" ref="queryFormRef">
        <el-form-item label="计划单位" class="first" prop="busiType">
          <gc-institution v-model="queryForm.busiType" :level="1" :defaultShow="true" @change="changeBlgDeptName"> </gc-institution>
        </el-form-item>
        <el-form-item label="年度" class="search-card__date" prop="year">
          <el-date-picker
            v-model="queryForm.year"
            type="year"
            placeholder="选择年度"
            :clearable="false"
            value-format="yyyy"
            popper-class="date-picker"
            @change="changeYear"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <!-- <el-button @click="query">查询</el-button> -->
          <el-button type="primary" class="button-w100-h30" @click="openBatchAdd">计划批量上传</el-button>
          <el-button class="button-w100-h30" @click="planFallbak">年度计划撤回</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 计划 -->
    <AnnualBaseInfo :data-info="store.getters['planManagement/getAnnualPackageInfo']"></AnnualBaseInfo>
    <!-- 计划明细 -->
    <AnnualDetailsInfo></AnnualDetailsInfo>
    <!-- 附件 -->
    <AnnualAccessoryFiles></AnnualAccessoryFiles>
    <!-- 审批链 -->
    <AnnualApproval ref="annualApprovalRef"></AnnualApproval>
    <!-- 批量导入 -->
    <InstructorBatchImport
      title="批量导入计划"
      :visible="batchAddPlanVisible"
      @close="batchAddClose"
      @cancel="batchAddPlanVisible = false"
      @comfirm="batchAddComfirm"
      @change="batchAddChange"
      @templateDownload="batchAddTemplateDownload"
    ></InstructorBatchImport>
    <!-- 错误提示弹窗 -->
    <ErrotHint :errorList="errorList" :dataTransition="errorDataTransition" />
  </div>
</template>

<script setup>
import { nextTick, reactive, ref } from 'vue'
import { CopyObj } from '@/plugins/until'
import { useTable } from '@/hooks/useTable'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import store from '@/store'
import AnnualBaseInfo from './AnnualBaseInfo.vue'
import AnnualDetailsInfo from './AnnualDetailsInfo.vue'
import { useAnnual } from '../hooks/useAnnual'
import { fetchBatchplan, fetchWithdrawPlanPackage } from '@/fetch/planManagement'
import AnnualAccessoryFiles from './AnnualAccessoryFiles.vue'
import AnnualApproval from './AnnualApproval.vue'
import InstructorBatchImport from '@/components/dialogs/InstructorBatchImport.vue'
import { fetchCheckZone } from '@/fetch/templateManament'
import { LINE_LS } from '@/util/constants'
import { downloadAdapter, getLoadingStatus } from '@/util/utils'
import { APPLY_EOA_DOING, APPLY_EOA_DONE, PLAN_LINE_MAP } from '../enum'
import ErrotHint from '@/components/dialogs/ErrotHint.vue'
import { Message } from 'element-ui'
const { getAnnualPackageInfo, checkPackageFetched, checkForbidStatus } = useAnnual()
const { mergeReactive } = useBaseDataEvents()

const baseParams = {
  busiType: [],
  blgDeptName: '',
  // 默认当前年度
  year: String(new Date().getFullYear())
}

const queryForm = reactive(CopyObj(baseParams))

const { requiredHandle } = useTable()

const formRules = {
  busiType: [
    requiredHandle('请选择计划单位'),
    {
      validator: (rule, value, callback) => {
        if(value.length < 2) {
          return callback(new Error('请选择计划单位'))
        }
        return callback()
      }
    }
  ],
  year: [requiredHandle('请选择年度')]
}

const queryFormRef = ref(null)
const formatParams = (params) => {
  const data = CopyObj(params)
  ;[data.line, data.dept] = data.busiType
  Reflect.deleteProperty(data, 'busiType')
  return data
}

const planPackageData = reactive({})
const accessoryTableList = ref([])
const annualApprovalRef = ref(null)
const query = () => {
  queryFormRef.value.validate(async (v) => {
    if (!v) return
    const data = formatParams(queryForm)
    await store.dispatch('planManagement/getAnnualPlanInfo', data)
  })
}
defineExpose({ query })

const changeBlgDeptName = (name, orgInfo) => {
  queryForm.blgDeptName = name
  store.commit('planManagement/updateSearchParams', { ...queryForm, currentOrg: orgInfo })
  query()
}

const changeYear = (v) => {
  store.commit('planManagement/updateSearchParams', queryForm)
  query()
}

// 计划批量上传
const batchAddPlanVisible = ref(false)
const batchAddPlanFile = ref({})
const openBatchAdd = () => {
  if (!checkPackageFetched()) return
  if (!checkForbidStatus()) return 
  batchAddPlanVisible.value = true
}
const batchAddClose = () => {
  batchAddPlanVisible.value = false
}

const errorList = ref([])
const errorDataTransition = (data) => {
  const list = []
  Object.keys(data).forEach((k) => {
    const v = data[k]
    v.data = v.fail
    Reflect.deleteProperty(v, 'fail')
    v.data.forEach((v) => {
      v.key = parseInt(v.key) + 1
      v.value = v.value.replace(/\s*第\d+行\s*/, '')
    })
    list.push(v)
  })
  return list
}

const isBatching = ref(false)
const batchAddComfirm = () => {
  if(isBatching.value) return Message.warning('文件上传中，请稍候')

  if (!batchAddPlanFile.value.size) {
    batchAddPlanVisible.value = false
    return
  }

  const params = store.getters['planManagement/getCurrentTopSearchParams']
  const [line, dept] = params.busiType
  const data = new FormData()
  data.append('file', batchAddPlanFile.value)
  data.append('line', line)
  data.append('dept', dept)
  data.append('year', params.year)
  isBatching.value = true
  fetchBatchplan(data).then((res) => {
    errorList.value = res
    batchAddPlanVisible.value = false
    query()
    Message.success('提交成功')
  })
  .finally(() => {
    isBatching.value = false
  })
}
const batchAddChange = ($event) => {
  batchAddPlanFile.value = $event.target.files[0]
}
const batchAddTemplateDownload = async () => {
  if (!checkPackageFetched()) return
  const params = store.getters['planManagement/getCurrentTopSearchParams']
  let [line, dept] = params.busiType
  line === LINE_LS && (line = await fetchCheckZone({ line, dept }))
  console.log(line, PLAN_LINE_MAP, '-->>');
  downloadAdapter({ templateCode: PLAN_LINE_MAP[line] })
}

// 计划撤回
const planFallbak = async () => {
  if (!checkPackageFetched()) return
  // if (!checkForbidStatus()) return
  if(![APPLY_EOA_DOING, APPLY_EOA_DONE].includes(getAnnualPackageInfo().applyStatus)) return Message.warning('仅允许撤回“审批中”或者“已通过”的计划')
  const data = {
    year: getAnnualPackageInfo().planYear,
    line: getAnnualPackageInfo().blgStripLine,
    dept: getAnnualPackageInfo().blgDept
 }
  await fetchWithdrawPlanPackage(data)
  Message.success('撤回成功')
  query()
}

const emit = defineEmits(['change'])
const changeStatus = () => {
  emit('change', 'edit')
}
</script>

<script>
export default {
  name: 'AnnualPlanInfo'
}
</script>
<style lang="scss" scoped>
.loading-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: red;
  z-index: 99;
}
</style>
