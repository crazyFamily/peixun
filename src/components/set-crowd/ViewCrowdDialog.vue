<template>
  <gc-model
		title="已导入人员信息"
		:visible="isOpen"
		top="7vh"
		width="800px"
		class="select-person-model"
    :comfirmText="isDetail ? '关闭': '确认'"
    :cancelText="isDetail ? '': '取消'"
    :showClose="false"
    @cancel="cancelOrg"
    @comfirm="comfirmOrg">
		<div class="main-container">
      <el-tabs v-model="activeTab" class="crowd-tabs">
        <el-tab-pane :label="`组织(${crowdOrgsShow.length})`" name="org">
          <div class="plr20">
            <span v-if="!isDetail" class="btn-clear-org" @click="clearOrgs">清空</span>
            <div class="org-list-view mtb10">
              <template v-if="crowdOrgsShow && crowdOrgsShow.length" >
                <el-tag class="mr10" type="info" v-for="(item,i) in crowdOrgsShow" :key="i" :closable="!isDetail" @close="removeCrowdOrg(item)">
                  <span>{{item.orgName}}</span>
                </el-tag>
              </template>
              <div v-else class="org-empty">
                暂无数据
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`人员(${allUmNum})`" name="user" style="padding-top: 6px;">
          <el-tabs class="user-tabs" v-model="activeUserTab" @tab-click="userTabClick" type="card">
            <el-tab-pane v-for="(tab,tabIndex) in activeUserTabArrShow" :key="tab.name" :name="tab.name">
              <span slot="label">
                {{`${tab.label}(${userData[tab.name].total})`}}
                <el-tooltip v-if="tab.name === 'unsave'" placement="top" popper-class="table-popper" effect="light">
                  <div slot="content">新增的员工需要在提交发布之后才生效</div>
                  <i class="el-icon-question active"></i>
                </el-tooltip>
              </span>
              <div class="plr20">
                <el-form inline ref="selectPersonRef" class="between-noc">
                  <el-form-item>
                    <template v-if="!isDetail" >
                      <el-button class="button-w80-h30" @click="deleteUser(tabIndex)">删除</el-button>
                      <el-button class="button-w80-h30" @click="exportUser" v-if="isSave" >导出</el-button>
                    </template>
                  </el-form-item>
                  <div>
                    <el-form-item>
                      <el-input class="w150" 
                        placeholder="请输入姓名/UM号" 
                        v-model="userData[tab.name].queryForm.umIdOrName" 
                        @keyup.enter.native="queryUserList">
                        <i slot="suffix" class="el-input__icon el-icon-search r0 fs0" @click.stop="queryUserList" />
                      </el-input>
                    </el-form-item>
         <el-form-item>
                      <el-button class="button-w60-h30" @click="resetList">重置</el-button>
                    </el-form-item>
                  </div>
                </el-form>
                <table-pagination
                  class="table-list"
                  :pageSizes="[10, 20]"
                  :list="userColumn"
                  :tableList="userData[tab.name].list"
                  :queryForm="userData[tab.name].queryForm"
                  :getList="getUserList"
                  :ref="`tablePaginationRef`" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
	</gc-model>
</template>
<script setup>
import { Message } from 'element-ui'
import { CopyObj, customHint } from '@/util/utils'
import { ref, reactive, computed, watch, set, nextTick } from 'vue'
import { 
  fetchListToCaseAddVisibleUsers,
  fetchListToColumnAddVisibleUsers, 
  fetchFindCaseCrowdUmList, 
  fetchFindColumneCrowdUmList,
  fetchDeleteCaseVisibleUser,
  fetchDeleteColumnVisibleUser,
  fetchDeleteCaseVisibleEffUser,
  fetchDeleteColumnVisibleEffUser
} from '@/fetch/caseCenter'

const emits = defineEmits(['comfirm', 'close'])
const props = defineProps({
	type: {
		type: String,
		default: 'case'
  },
  isDetail: Boolean
})
const activeTab = ref('org') // org, user
const importId = ref('')
const crowdBatchId = ref('')

// =============================== 组织Tab ===============================
const crowdOrgs = ref([])
const crowdOrgsShow = computed(() => crowdOrgs.value.filter(m => m.isShow))
const crowdOrgsUnShow = computed(() => crowdOrgs.value.filter(m => !m.isShow))
function clearOrgs () {
  crowdOrgs.value.forEach(item => {
    set(item, 'isShow', false)
  })
}
// 组织Tab-组织tag关闭
function removeCrowdOrg (item) {
  set(item, 'isShow', false)
}
// 组织Tab-取消
function cancelOrg () {
  crowdOrgs.value.forEach(item => {
    set(item, 'isShow', true)
  })
  closeDialog()
}
// 组织Tab-确认
function comfirmOrg () {
  if (props.isDetail) {
    cancelOrg()
  } else {
    const data = { orgs: crowdOrgsShow.value }
    emits('comfirm', { fromPage:'ViewCrowdDialog', data: CopyObj(data) } )
    closeDialog()
  }
}

// =============================== 人员Tab ===============================
const activeUserTab = ref('save') // save, unsave
const activeUserTabArr = [
  { label: '已保存', name: 'save' },
  { label: '未保存', name: 'unsave' },
]
const activeUserTabArrShow = computed(() => props.isDetail ? [activeUserTabArr[0]] : activeUserTabArr)
const isSave = computed(() => activeUserTab.value === 'save' )
const allUmNum = computed(() => userData.save.total + userData.unsave.total)

const fnMapping = {
	case: {
    userList: fetchFindCaseCrowdUmList,
		fetchListVisibleUsers: fetchListToCaseAddVisibleUsers,
    fetchDeleteVisibleUser: fetchDeleteCaseVisibleUser, 
    fetchDeleteVisibleEffUser: fetchDeleteCaseVisibleEffUser
	},
	column: {
    userList: fetchFindColumneCrowdUmList,
		fetchListVisibleUsers: fetchListToColumnAddVisibleUsers,
    fetchDeleteVisibleUser: fetchDeleteColumnVisibleUser, 
    fetchDeleteVisibleEffUser: fetchDeleteColumnVisibleEffUser
	}
}

const loadFn = computed(() => fnMapping[props.type].userList )
const fetchListVisibleUsers = computed(() => fnMapping[props.type].fetchListVisibleUsers )
const fetchDeleteVisibleUser = computed(() => fnMapping[props.type].fetchDeleteVisibleUser )
const fetchDeleteVisibleSavedUser = computed(() => fnMapping[props.type].fetchDeleteVisibleEffUser )

const userColumn = computed(() => {
	const list = [
		{ label: '序号', type: 'index' },
		{ label: '姓名', prop: 'umName', width: '150' },
		{ label: 'UM号', prop: 'umId', width: '200' },
		{ label: '所属机构', prop: 'orgName', width: '350'  },
	]
	if (!props.isDetail) {
		list.unshift({ type: 'selection' })
	}
	return list
}) 

const userData = reactive({
  save: {
    queryForm: {
      type: 'C',
      crowdBatchId: crowdBatchId.value,
      umIdOrName: '',
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    total: 0,
    list: []
  },
  unsave: {
    queryForm: {
      importId: importId.value,
      umIdOrName: '',
      currPage: 1,
      pageSize: 10,
      total: 0
    },
    total: 0,
    list: []
  }
})

const userSaveTableList = ref([])
const userSaveTableListLength = computed(() => userTableList.value?.length || 0 )

const tablePaginationRef = ref(null)
// type=“C”，是查询，type="E"或者空就是导出
async function getUserList() {
  const queryForm = userData[activeUserTab.value].queryForm
  queryForm.crowdBatchId = crowdBatchId.value
  queryForm.importId = importId.value
  queryForm.type = 'C'
  const data = isSave.value ? { request: queryForm } : { data : queryForm }
  const { list, total } = isSave.value ?  await loadFn.value(data) : await fetchListVisibleUsers.value(data)
  userData[activeUserTab.value].list = list
  userData[activeUserTab.value].queryForm.total = total
}
// 导出
async function exportUser () {
  const queryForm = userData[activeUserTab.value].queryForm
  queryForm.type = 'E'
  if (isSave.value) {
    await loadFn.value({ request: queryForm }) 
  } else {
    await fetchListVisibleUsers.value({ data : queryForm })
  }
}
// 刷新
function resetList () {
  const queryForm = userData[activeUserTab.value].queryForm
	queryForm.umIdOrName = ''
	queryUserList()
}
function userTabClick (tab, event) {
  const { index, name } = tab
  queryUserList()
}
// 查询用户
function queryUserList () {
  userData[activeUserTab.value].queryForm.currPage = 1
	getUserList()
}
// 删除用户
function deleteUser (tabIndex) {
	const rows = tablePaginationRef.value[tabIndex].getSelection()
	if (!rows?.length) {
		return Message.warning('请选择要删除的记录')
  }
  if (isSave.value) {
    customHint('此操作将会直接在库中删除，确认要删除此记录吗？', '提示', '取消')
    .then(() => {
      const data = {
        umList: rows?.map(m => m.umId) || [],
        crowdBatchId: crowdBatchId.value,
      }
      fetchDeleteVisibleSavedUser.value({ data }).then(res => {
        queryUserList()
        userData.save.total = userData.save.total - rows.length
        Message.success('删除成功！')
      })
    })
  } else {
    const data = {
      type: 'batch',
     umList: rows?.map(m => m.umId) || [],
      importId: importId.value,
    }
    fetchDeleteVisibleUser.value({ data }).then(res => {
      queryUserList()
      userData.unsave.total = userData.unsave.total - rows.length
    })
  }
}

const isOpen = ref(false)
// const isDetail = ref(false)
function openDialog (data) {
	isOpen.value = true
  // isDetail.value = data.isDetail || false
  importId.value = data.importId
  crowdBatchId.value = data.crowdBatchId
  crowdOrgs.value = data.crowdOrgs?.map(m => ({...m, isShow: true})) || []
  userData.save.total = data.effUmNum
  userData.unsave.total = data.tempUmNum
	queryUserList()
}
function resetData () {
  activeTab.value = 'org'
  activeUserTab.value = 'save'
  userData.save.queryForm.umIdOrName = ''
  userData.save.queryForm.total = 0
  userData.unsave.queryForm.umIdOrName = ''
  userData.unsave.queryForm.total = 0
}
function closeDialog () {
  if (isOpen.value) {
    isOpen.value = false
    resetData()
    emits('close')
  }
}

defineExpose({
	openDialog
})

</script>
<style lang='scss' scoped>

:deep(.el-dialog__body) {
  overflow: auto;
  padding: 0px 0px 10px 0 !important;
  .el-form-item {
    margin-top: 5px;
    margin-bottom: 10px;
  }
  .crowd-tabs {
    .el-tabs__header {
      margin-bottom: 5px;
      height: 40px;
      .el-tabs__item {
        height: 40px !important;
        line-height: 40px !important;
      }
    }
  }
  .user-tabs {
    .el-tabs__header {
      margin-bottom: 5px;
      height: 32px;
      .el-tabs__nav {
        border: 0px;
        .el-tabs__item {
          margin-right: 10px;
          background: #F7F8FA;
          border: 1px solid #EAECF1;
          border-radius: 4px 4px 0 0;
          height: 32px !important;
          line-height: 32px !important;
        }
        .is-active {
          background: #fff;
          border-bottom: 0;
        }
      }
    }
  }
}

.main-container {
  min-height: 450px;
}

.select-person-model {
	:deep(.gc-model__dialog) {
		height: auto;
	}
}
.height90vh {
	:deep(.gc-model__dialog) { 
		height: 640px !important;
	}
}
.btn-clear-org {
  color: $themeColor;
  margin-top: 10px;
  margin-left: 10px;
  cursor: pointer;
  display: inline-block;
}
.org-list-view {
  padding: 5px 10px;
  border: 1px #f0f0f0 solid;
  border-radius: 2px;
  min-height: 340px;
  
  :deep(.el-tag) {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.org-empty {
  font-size: 20px;
  font-weight: bold;
  color: #ccc;
  text-align: center;
  margin-top: 150px;
}

</style>
