<template>
  <div v-loading="isLoading">
    <el-card>
      <StepTopbar current-step="培养进展管理" :step-list="TALENT_STEP"></StepTopbar>
    </el-card>
    <div class="talents-container">
      <div class="main-container">
        <el-form :model="progressForm" :rules="progressFormRules" ref="progressFormRef" :disabled="status === 'view'">
          <el-row>
            <el-col :span="24">
              <el-form-item :label-width="formLabelWidth" label="潜才项目" prop="projects">
                <el-button type="primary" @click="handleChoseProject">选择潜才项目</el-button>
                <table-pagination
                  :list="mutileColumns()"
                  :tableList="progressForm.projects"
                  :hidePagination="true"
                  :queryForm="{}"
                  ref="tablePagination"
                  class="table-style mt10"
                >
                  <el-table-column label="操作" min-width="78">
                    <template slot-scope="scope">
                      <span class="active" @click="removeProject(scope.row)">删除</span>
                    </template>
                  </el-table-column>
                </table-pagination>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label-width="formLabelWidth" label="进展阶段" prop="stage">
                <el-date-picker
                  class="year-style month-style"
                  :editable="false"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  placeholder="进展阶段"
                  type="month"
                  v-model="progressForm.stage"
                  :clearable="false"
                  style="width: 120px"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="截止日期" prop="endDate">
                <el-date-picker
                  class="year-style month-style"
                  :editable="false"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  placeholder="截止日期"
                  type="date"
                  v-model="progressForm.endDate"
                  :clearable="false"
                  style="width: 120px"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="邮件抄送人" prop="topicProgress">
                <el-button type="primary" @click="handleEmailSelect">选择邮件抄送人</el-button>
                <table-pagination
                  row-key="umId"
                  drop
                  :list="emailUserColumns(false, true)"
                  :tableList="progressForm.copyUmList"
                  :hidePagination="true"
                  :queryForm="{}"
                  ref="tablePagination"
                  class="table-style mt10"
                >
                  <el-table-column slot="dropContainer" label="" min-width="40">
                    <template>
                      <i class="el-icon-rank drop"></i>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="60">
                    <template slot-scope="scope">
                      <span class="active" @click="removeEmailUser(scope.row)">删除</span>
                    </template>
                  </el-table-column>
                </table-pagination>
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

    <!-- 项目有多个的弹窗选择 -->
    <MultipleProjectSelect
      :show.sync="isMultipleProject"
      multiple
      :columns="mutileColumns(true)"
      width="1100px"
      :table-list.sync="multipleTableList"
      :search-project-params="{ tip: 'N' }"
      @save="handleMutileSelectComfirm"
    >
    </MultipleProjectSelect>

    <!-- 选择邮件抄送人弹窗 -->
    <SelectUserDialog
      title="选择邮件抄送人"
      :show.sync="isEmailSelectShow"
      @save="handleEmailSelectSave"
      :list="progressForm.copyUmList"
      :fetch-fn="fetchUserInfos"
      :dist-info="{ user: 'empName' }"
      :columns="emailUserColumns(true)"
      delay
    >
    </SelectUserDialog>
  </div>
</template>

<script setup>
import { PROJECT_STATUS, TALENT_STEP, TANLENTS_PROJECT_STATUS, TANLENTS_PROJECT_STATUS_TODO } from '../enum'
import StepTopbar from '../components/StepTopbar.vue'
import { computed, onActivated, onMounted, reactive, ref } from 'vue'
import { closeCurrPageAndGoPath, CopyObj, getLoadingStatus } from '@/util/utils'
import { useRoute } from '@/router'
import { Message } from 'element-ui'
import store from '@/store'
import { fetchAuthProjectList, fetchFosterProgressDetail, fetchSaveFosterProgress, fetchUpdateFosterProgress } from '@/fetch/tanlents'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { useTable } from '@/hooks/useTable'
import MultipleProjectSelect from '../components/MultipleProjectSelect.vue'
import SelectUserDialog from '../components/SelectUserDialog.vue'
import { fetchUserInfos } from '@/fetch/public'
import SearchParams from '@/views/TalentsCultivation/components/SearchParams.vue'
import { formatParamsByProjectType } from '../utils'

const { mergeReactive } = useBaseDataEvents()
const formLabelWidth = '100px'
const progressForm = reactive({
  projects: [],
  projectStatus: '',
  proIds: [],
  stage: '',
  endDate: '',
  copyUmList: []
})
const { requiredHandle } = useTable({})

const progressFormRules = {
  stage: [requiredHandle('请选择进展时间', 'change')],
  endDate: [requiredHandle('请选择截止日期')],
  projects: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (!progressForm.projects.length) {
          return callback(new Error('请选择潜才项目'))
        }
        return callback()
      }
    }
  ]
}

const progressFormRef = ref(null)
const formatParams = (data) => {
  data = CopyObj(data)
  data.stage = `${data.stage.split('-')[0]}${data.stage.split('-')[1]}`
  data.proIds = data.projects.map((row) => row.id)
  data.copyUmList = data.copyUmList.map((row) => row.umId)
  return data
}
const handleSave = async () => {
  progressFormRef.value.validate(async (v) => {
    if (!v) return
    const data = formatParams(progressForm)
    await fetchSaveFosterProgress({ data })
    Message.success('保存成功')
    // 设置待更新状态
    store.commit('updateQueue', '/TalentsProgress')
    handleClose()
  })
}
const handleClose = () => {
  closeCurrPageAndGoPath({ path: '/TalentsProgress' })
}

const isLoading = computed(() => {
  return getLoadingStatus('LOADING_TANLENTS_PROGRESS_CREATE')
})

const status = ref('edit')

// 移除项目
const removeProject = (row) => {
  progressForm.projects = progressForm.projects.filter((proRow) => proRow.id !== row.id)

  arrangeSeq()
}

// -------------------------- 添加进展相关代码 --------------------------

const isMultipleProject = ref(false)
const multipleTableList = ref([])
const mutileColumns = (haveSelection) => {
  const data = [
    { label: '序号', prop: 'seqNum' },
    { label: '项目ID', prop: 'projectId' },
    { label: '项目名称', prop: 'projectName' },
    { label: '年度', prop: 'annual' },
    { label: '项目类型', prop: 'projectTypeDesc' },
    { label: '所属单位', prop: 'projectBlg' },
    { label: '方案状态', prop: 'status', formatter: (row) => PROJECT_STATUS[row.status] }
  ]
  haveSelection && data.unshift({ type: 'selection' })
  return data
}
const handleMutileSelectComfirm = (list) => {
  console.log('list:/>', list)
  progressForm.projects = progressForm.projects.concat(
    list.filter((row) => !Boolean(progressForm.projects.find((pRow) => pRow.projectId === row.projectId)))
  )

  arrangeSeq()
  isMultipleProject.value = false
  // 对单个字段进行校验
  progressFormRef.value.validateField('projects')
}

const arrangeSeq = () => {
  console.log('arrangeSeq:/>', progressForm.projects)
  progressForm.projects.forEach((item, index) => {
    item.seqNum = index + 1
  })
}
const searchParamsRef = ref(null)
const handleChoseProject = async () => {
  isMultipleProject.value = true
  // searchParamsRef.value.resetDatas()
  multipleTableList.value = []
}

const defaultSearchParams = ['annual', 'projectType', 'treeData']
const baseProjectParams = {
  annual: [],
  projectType: '',
  lineIds: [],
  organIds: [],
  currPage: 1,
  pageSize: 10,
  tip: 'Y'
}
const projectSearchForm = reactive({ ...baseProjectParams })
const orgData = ref([])
const queryData = (data, treeData) => {
  mergeReactive({ origin: projectSearchForm, target: data })
  treeData && (orgData.value = treeData)
  getProjectDataList()
}
const resetData = () => {}

const getProjectDataList = async () => {
  const data = formatParamsByProjectType(projectSearchForm, orgData.value)
  const { list } = await fetchAuthProjectList({ data })
  if (!list.length) {
    Message.warning('没有查询到项目信息')
  }
  multipleTableList.value = list
}

const emailUserColumns = (haveSelection = false, haveDrop = false) => {
  const data = [
    {
      label: '姓名',
      prop: 'empName'
    },
    {
      label: 'UM号',
      prop: 'umId'
    },
    {
      label: '归属机构',
      prop: 'blgOrgName'
    }
  ]

  haveSelection && data.unshift({ type: 'selection', 'reserve-selection': true })
  haveDrop && data.unshift({ slot: 'dropContainer' })
  return data
}

const isEmailSelectShow = ref(false)

const handleEmailSelect = () => {
  isEmailSelectShow.value = true
}
const handleEmailSelectSave = (list) => {
  progressForm.copyUmList = list
}
const removeEmailUser = (row) => {
  progressForm.copyUmList = progressForm.copyUmList.filter((proRow) => proRow.umId !== row.umId)
}
</script>
<script>
export default {
  name: 'AddTalentsProgress'
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
  width: 84%;
  margin: 0 auto;
  padding: 20px 0;
}
</style>