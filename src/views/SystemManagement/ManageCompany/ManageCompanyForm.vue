<template>
  <div class="ManageCompanyForm" :class="{'component-type': managementType === MANAGEMENT_TYPE_FL_ORG}">
    <div class="content-box">
      <el-form ref="formRef" :model="baseInfoForm" :rules="baseInfoRules" label-width="100px" @submit.native.prevent>
        <el-form-item label="状态" prop="managementStatus">
          <el-switch v-model="baseInfoForm.managementStatus" 
            active-color="#e4e7ed" inactive-color="#fd6720"
            :active-text="COMPANY_STATUS_OFF_LABEL" :inactive-text="COMPANY_STATUS_ON_LABEL" 
            :active-value="COMPANY_STATUS_OFF" :inactive-value="COMPANY_STATUS_ON"
            />
          <div class="msg-desc"> * 只有“启用”状态，才能编辑其他信息</div>
        </el-form-item>
        <template v-if="managementType === MANAGEMENT_TYPE_FL_ORG">
          <el-form-item label="架构ID" prop="managementId">
            <el-input :value="baseInfoForm.managementId" disabled class="w-200"/>
          </el-form-item>
          <el-form-item label="架构名称" prop="relatedOrgs">
            <gc-institution
              :orgUrl="APIAllTree"
              :leftShow="false"
              :default-show="false"
              v-model="baseInfoForm.targetOrgs"
              busiType="FL"
              @change="handleChangeTargetOrg"
              ref="institutionRef"
            ></gc-institution>
          </el-form-item>
          <el-form-item label="下属架构范围" prop="relatedOrgs">
            <!-- :showCount="true" LEAF_PRIORITY BRANCH_PRIORITY -->
            <DeptTreeSelect 
              :disabled="isDisabled"
              nodeLabelIsShowTX="onlyRoot"
              valueConsistsOf="BRANCH_PRIORITY"
              placeholder="请选择下属架构范围"
              @change="orgChangeHandle"
              v-model="baseInfoForm.relatedOrgs"
              :originalValue="baseInfoForm.originalOrgList"
              :auto-load-root-options="false"
              :disabledIdArr="disabledIdList"
              :excludeParentCodes="deptTreeParentsCodes"
            />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="管理单位ID" class="mr20" prop="managementId" v-if="isEdit">
            <el-input v-model.trim="baseInfoForm.managementId" disabled />
          </el-form-item>
          <el-form-item label="管理单位名称" class="mr20" prop="managementName">
            <el-input maxlength="100" v-model.trim="baseInfoForm.managementName" placeholder="请输入管理单位名称(100字符)" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="架构范围" prop="relatedOrgs">
            <!-- :showCount="true" LEAF_PRIORITY BRANCH_PRIORITY -->
            <DeptTreeSelect 
              :disabled="isDisabled"
              nodeLabelIsShowTX="onlyRoot"
              valueConsistsOf="BRANCH_PRIORITY"
              placeholder="请选择架构范围"
              @change="orgChangeHandle"
              v-model="baseInfoForm.relatedOrgs"
              :originalValue="baseInfoForm.originalOrgList"
              :auto-load-root-options="false"
              :disabledIdArr="disabledIdList"
            />
          </el-form-item>
          <template v-if="managementType !== MANAGEMENT_TYPE_FL_ORG">
            <el-form-item label="HRD名称" prop="showUmId">
                <el-dropdown trigger="click" ref="messageDrop" placement="bottom-start" style="width: 680px" @visible-change="visibleChange">
                    <div class="gc-approval-chain">
                        <el-input style="width: 680px" class="gc-approval-chain__input" placeholder="请输入姓名或UM号" v-model.trim="baseInfoForm.showUmId" @input="inputShowUmId">
                        </el-input>
                    </div>
                    <el-dropdown-menu slot="dropdown" style="width: 680px;" class="gc-approval-chain__drop-down">
                        <div v-show="loadingText" style="text-align: center;margin-top: 80px;color: #ccc;">{{loadingText}}</div>
                        <el-dropdown-item v-for="item in hintData" :key="item.umId" style="white-space: nowrap;overflow: hidden;-ms-text-overflow: ellipsis;text-overflow: ellipsis;" @click.native="handleDropDownCLick(item)">
                            <span class="name">{{ item.empName }}</span>
                            <span class="um">{{ item.umId }}</span>&nbsp;&nbsp;
                            <span class="org-name">{{ item.blgOrgName }}</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <!-- <div>{{baseInfoForm.relatedOrgs}}</div> 
      <div>{{baseInfoForm.originalOrgList}}</div> -->
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <template v-if="managementType === MANAGEMENT_TYPE_FL_ORG">
        <el-button class="button-w80-h30" @click="closeHandle">取消</el-button>
      </template>
      <template v-else>
        <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      </template>
      <el-button class="button-w80-h30" type="primary" :loading="saveLoading" @click="submitHandle">提交</el-button>
    </div>
    <gc-model title="提示" width="600px" :visible.sync="cannotUseOrgsShow"
      cancelText="取消"
      comfirmText="确认启用"
      @close="comfirmNo"
      @cancel="comfirmNo"
      @comfirm="comfirmYes">
      <div style="line-height: 24px;">
        <div class="mb10" style="font-size:13px;">本管理单位（{{baseInfoForm.managementName}}）原设置的"架构范围"节点或其父节点已被使用，启用此管理单位将删除这些“架构范围”节点，确认要启用“{{baseInfoForm.managementName}}”吗？</div>
        <div>已使用节点如下：</div>
        <div class="pl20">
          <div v-for="org in cannotUseOrgs" :key="org.orgId">{{org.orgName}}</div>
        </div>
      </div>
    </gc-model>
  </div>
</template>
<script>
export default {
  name: 'ManageCompanyForm'
}
</script>
<script setup>
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { ref, reactive, computed, onMounted, onActivated, nextTick, watch, set } from 'vue'
import { customHint, closeCurrPageAndGoPath, CopyObj } from '@/util/utils'
import { useRouter, useRoute } from '@/router'
import { COMPANY_STATUS_OPTIONS, 
  COMPANY_STATUS_ON, COMPANY_STATUS_OFF,
  COMPANY_STATUS_ON_LABEL, COMPANY_STATUS_OFF_LABEL, MANAGEMENT_TYPE_MANAGE, MANAGEMENT_TYPE_FL_ORG 
} from '../enum'
import { fetchSaveManagement } from '@/fetch/systemManagement'
import useDeptTreeSelect from '@/components/deptTreeSelect/hooks/useDeptTreeSelect'
import DeptTreeSelect from '@/components/deptTreeSelect/index'
import { APIAllTree, fetchUserInfos } from '@/fetch/public'

const props = defineProps({
  // type manageType = MANAGEMENT_TYPE_FL_ORG | MANAGEMENT_TYPE_MANAGE
  managementType: {
    type: String,
    default: MANAGEMENT_TYPE_MANAGE
  },
  disabledList: Array,
  formType: String,
  detailInfo: Object
})

const router = useRouter()
const stateOptions = COMPANY_STATUS_OPTIONS

const baseInfoForm = ref({
  managementId: '',
  managementName: '',
  managementStatus: '',
  relatedOrgs: [], // 试点架构, 用于显示在树组件中,如：['','','']
  originalOrgList: [], // 试点架构, 用于提交给后端
  showUmId: '',
  targetOrgs: []
})

const baseInfoRules = {
  managementStatus: [{ required: true, trigger: 'change', message: '请选择状态' }],
  managementName: [{ required: true, trigger: 'change', message: '请填写管理单位名称' }],
  relatedOrgs: [{ required: true, trigger: 'blur', validator: (rule, value, cb) => {
      if (!baseInfoForm.value?.relatedOrgs?.length) {
        return cb(new Error('请选择架构范围'))
      }
      cb()
    }
  }]
}

// 限制包含
const deptTreeParentsCodes = ref([])

// ============================ 表单信息 ============================
const formType = ref('add')
const isEdit = computed(() => formType.value === 'edit' )
const isDisabled = computed(() => baseInfoForm.value.managementStatus === COMPANY_STATUS_OFF )
const selectNodeList = ref([])
const disabledIdList = ref([]) // 已经关联过的机构列表
const disabledList = ref([]) // 已经关联过的机构列表
const orgChangeHandle = (v) => {
  // console.log(v)
  // const { selectIds, selectObjs } = v
  // selectNodeList.value = v.selectObjs.map(m => ({ orgId: m.orgId, orgName: m.orgName } ))
}

// 关闭
const emit = defineEmits(['close', 'save'])
const closeHandle = (params) => {
  if(props.managementType === MANAGEMENT_TYPE_FL_ORG) {
    return emit('close')
  }
  isMounted.value = false
  let { name } = router.getRoutes().find((item) => item.path === '/ManageCompany')
  closeCurrPageAndGoPath({ path: useRoute().path })
  router.push({ name, params })
}
// 提交
const saveLoading = ref(false)
const formRef = ref(null)
const submitHandle = () => {
  formRef.value.validate(valid => {
    if (valid) {
      saveLoading.value = true
      const postData = {
        id: baseInfoForm.value.id,
        managementType: props.managementType,
        managementId: baseInfoForm.value.managementId,
        managementName: baseInfoForm.value.managementName,
        managementStatus: baseInfoForm.value.managementStatus,
        hrdUm: baseInfoForm.value.hrdUm,
        relatedOrgs: baseInfoForm.value.relatedOrgs?.map(m => ({orgId: m.orgId, orgName: m.orgName})) || []
      }
      console.log('post-提交数据', postData)

      fetchSaveManagement(postData)
      .then(res => {
        Message.success('提交成功！')
        if(props.managementType === MANAGEMENT_TYPE_FL_ORG) {
          emit('save')
        }
        closeHandle()
      }).finally(() => {
        saveLoading.value = false
      })
    }
  })
}
// 处理 TreeSelect 组件的 Value
function handleTreeSelectValue (_data) {
  return _data.map(m => {
      m.id = m.orgId
      m.label = m.orgName
      return m
    })
}
// 处理 TreeSelect 组件的 OriginalValue
// 返回对象必须包括以下3个属性：blgStripLine, orgId, orgId
function handleTreeSelectOriginalValue (_data) {
  return _data.map(m => ({
    busiType: m.blgStripLine,
    orgId: m.orgId,
    orgName: m.orgName,
    allPrnNode: m.allPrnNode || '', // 所以的节点路径，如 001｜001001｜001001001
  }))
}
const messageDrop = ref(null)
const visibleChange = () => {
  if(!baseInfoForm.value.showUmId) {
    messageDrop.value.hide()
  }
}
let umIdTimer = null
const hintData = ref([]) 
const loadingText = ref('')
const inputShowUmId = (val) => {
  if (val) {
    messageDrop.value.show()
    clearTimeout(umIdTimer)
    hintData.value = []
    loadingText.value = '加载中...'
    umIdTimer = setTimeout(() => {
      fetchUserInfos({data: { empName: val }}).then(res => {
        if (baseInfoForm.value.showUmId) {
          hintData.value = res.list || []
        }
        if (!hintData.value.length) {
          loadingText.value = '无数据'
        } else {
          loadingText.value = ''
        }
      })
    }, 500)
  } else {
    console.log('jojgo')
    hintData.value = []
    loadingText.value = ''
    baseInfoForm.value.hrdUm = ''
  }
}
// 下拉框 点击事件
const handleDropDownCLick = (item) => {
  baseInfoForm.value.showUmId = `${item.empName}(${item.umId})`
  baseInfoForm.value.hrdUm = item.umId
}
// ============================ 启用时，确认框 ============================

const cannotUseOrgsShow = ref(false) // 启用时，是否显示确认框
const cannotUseOrgs = ref([]) // 启用时，已被使用的节点，用于在确认框中显示
const canUseOrgs = ref([]) // 启用时，未被使用的节点，架构范围中保留的节点
const comfirmNo = () => { // 确认框-取消
  cannotUseOrgsShow.value = false
  set(baseInfoForm.value, 'managementStatus', COMPANY_STATUS_OFF)
}
const comfirmYes = () => { // 确认框-确定
  cannotUseOrgsShow.value = false
  set(baseInfoForm.value, 'relatedOrgs', CopyObj(canUseOrgs.value))
  nextTick(() => {
    set(baseInfoForm.value, 'managementStatus', COMPANY_STATUS_ON)
  })
}
watch(() => baseInfoForm.value.managementStatus, (newV, oldV) => {
  if (newV === COMPANY_STATUS_ON && oldV === COMPANY_STATUS_OFF ) {
    // console.log('启用此管理单位', baseInfoForm.value.relatedOrgs)
    // console.log('已使用机构Id', disabledIdList.value)
    // console.log('当前管理单位关联机构Id', baseInfoForm.value.relatedOrgs.map(m => m.orgId))
    canUseOrgs.value = []
    cannotUseOrgs.value = []
    // 遍历“架构范围”节点，判断是否被使用，已被使用则会删除
    baseInfoForm.value.relatedOrgs?.forEach((m, i) => {
      const allPrnNodeArr = m.allPrnNode.split('|')
      let node
      do {
        node = allPrnNodeArr.shift() // ["D000014230", "S000012696", "S000018610"]
        if (!disabledIdList.value.includes(node)) {
          if (allPrnNodeArr.length === 0) { // 2,1,0，只有到叶子节点，还是没有被使用，才会被保留
            if (!canUseOrgs.value.some(org => org.orgId === m.orgId)) { // 可使用的节点去重
              canUseOrgs.value.push(m)
            }
          }
        } else {
          node = false
          cannotUseOrgs.value.push(m)
        }
      } while (node) 
    })
    if (cannotUseOrgs.value.length) {
      cannotUseOrgsShow.value = true
    }
  }
})

// ============================ 初始化数据 ============================
const isMounted = ref(false)
const institutionRef = ref(null)
const initData = () => {
  let routeParams = {}
  console.log(props.managementType, '--->> props.managementType');
  if(props.managementType === MANAGEMENT_TYPE_FL_ORG) {
    routeParams = {
      formType: props.formType,
      disabledList: props.disabledList,
      row: props.detailInfo
    }
    formType.value = routeParams.formType
    disabledList.value = routeParams.disabledList || []
    console.log(disabledList, '---->> disabledList');
  } else {
    routeParams = useRoute().params
    formType.value = routeParams.formType
    disabledList.value = routeParams.disabledList || []
  }

  disabledIdList.value = routeParams.disabledList?.map(m => m.orgId) || []
  if (formType.value === 'add') { // 新增
    baseInfoForm.value = {
      showUmId: ''
    }
    baseInfoForm.value.managementStatus = COMPANY_STATUS_ON
    baseInfoForm.value.originalOrgList = handleTreeSelectOriginalValue(CopyObj(disabledList.value))
    nextTick(() => {
      formRef.value.clearValidate()
    })
  } else if (formType.value === 'edit') { // 编辑
    const relatedOrgs = CopyObj(routeParams.row.relatedOrgs) || []
    console.log(routeParams, '---->> routeParams.row');
    routeParams.row.originalOrgList = handleTreeSelectOriginalValue([...relatedOrgs, ...CopyObj(disabledList.value)])
    routeParams.row.relatedOrgs = handleTreeSelectValue(relatedOrgs)
    routeParams.row.showUmId = routeParams.row.hrdNameStr
    baseInfoForm.value = routeParams.row
    
    if(props.managementType === MANAGEMENT_TYPE_FL_ORG) {
      baseInfoForm.value.targetOrgs = ['FL', baseInfoForm.value.managementId]
      institutionRef.value.content = [baseInfoForm.value.managementName]
    }

    if(props.managementType !== MANAGEMENT_TYPE_FL_ORG) {
      store.commit('setRouteTitle', '编辑管理单位')
    }
    // console.log('回显节点', relatedOrgs.map(m => m.orgName))
  }
  // console.log('已使用节点', disabledList.value?.map(m => m.orgName))
  // console.log(routeParams)
}
onMounted(() => {
  initData()
  isMounted.value = true
})
onActivated(() => {
  if (!isMounted.value) {
    initData()
  }
})

// 20240327需求：新加非零机构树管理，与管理机构管理功能做统合
const selectedOrgInfo = ref({})
const handleChangeTargetOrg = (name, row) => {
  baseInfoForm.value.managementId = (row || {}).orgId
  baseInfoForm.value.managementName = (row || {}).orgName
  console.log(row, '--->> row');
  deptTreeParentsCodes.value = (row.allPrnNode || row.orgId).split('|')
}
</script>
<style lang="scss" scoped>
.ManageCompanyForm {
  padding-top: 40px;
  background-color: #fff;
  .content-box {
    width: 800px;
    min-height: calc(100vh - 310px);

    margin: 50px auto 60px;
    .case-item .active {
      position: unset;
    }
  }
  :deep(.gc-select) {
    padding: 0;
    .el-select {
      width: 100%;
    }
  }
  .msg-desc {
    color: #777;
    // color: #f54e1e;
    display: inline-block;
    margin-left: 10px;
    position: relative;
    top: 2px;
  }
}

.component-type {
  padding-top: 0;
  padding-bottom: 10px;
  
  .content-box {
    width: 100%;
    margin: 0 auto;
  }
  
  .footer-box {
    position: relative;
    justify-content: flex-end;
    box-shadow: unset;
    bottom: 0;
    padding: 0;
  }
}

.target-org-tree {
  :deep(.vue-treeselect__menu-container) {
    z-index: 99999 !important;
  }
}
</style>