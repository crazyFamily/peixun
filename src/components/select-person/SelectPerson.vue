<template>
  <gc-model
		title="选择人员"
		:visible="isOpen"
		top="5vh"
		width="800px"
		class="select-person-model"
		:showClose="false"
		@cancel="cancelDialog"
		@comfirm="comfirmDialog">
		<div class="main-container">
      <el-form inline ref="selectPersonRef">
        <p class="rule-title"> {{orgTitle}} </p>
        <el-form-item class="block-item" prop="pushTarget" >
					<div class="flex-wraaper">
						<span class="item-label">组织</span>
						<DeptTreeSelect
							v-model="treeData"
							:onlyLS="true"
							:originalValue="treeDataOriginal"
							:loadFn="fetchListBelongOrgs"
							:getOrgListFn="(m) => m"
							labelType="orgName"
							placeholder="请选择组织"
							ref="deptTreeSelectRef"
						/>
						<!-- <DeptTreeSelect
							v-model="treeData"
							:originalValue="treeDataOriginal"
							labelType="orgName"
							placeholder="请选择组织"
						/> -->
					</div>
        </el-form-item>
        <el-form-item class="block-item" prop="orgId" >
					<span class="item-label" style="display:inline-block;">满足条件人数</span>
          <el-input class="w80 mr20" :value="userNumber"></el-input>
          <el-button class="button-w80-h30" @click="caculateHandle">计算</el-button>
          <el-button class="button-w80-h30" type="primary" @click="exportOrgHandle">导出名单</el-button>
        </el-form-item>
        <p class="rule-title mb0">
          {{personTitle}}
          <span class="color-red">({{personDesc}})</span>
        </p>
        <el-form-item class="block-item push-user-container" prop="pushTarget">
          <div class="buttons-container mt15">
            <el-button class="button-w80-h30" @click="openAddUser" :disabled="isDetail" >添加</el-button>
            <el-button class="button-w80-h30" @click="clearUserHandle()" :disabled="isDetail" >清空</el-button>
            <el-button class="button-w80-h30" @click="refreshHandle" >刷新</el-button>
          </div>
          <table-pagination
            class="table-list"
            :list="pushUserColumn"
            :tableList="pushUserTableList"
            :queryForm="pushUserQueryForm"
            :getList="getUserList"
            ref="tablePagination"
          >
            <el-table-column label="操作" min-width="90" fixed="right">
              <template slot-scope="scope">
                <span class="active" @click="removeUserRow(scope.row)" v-show="!isDetail" >移除</span >
              </template>
            </el-table-column>
          </table-pagination>
        </el-form-item>
      </el-form>
			<!-- 选择人员 -->
			<comp-select-case-user
				:type="type"
				:show="isSelectCaseUserShow"
				:uuid="importId"
				:operateId="operateId"
				@close="closeAddUser"
				@save="caseUserSaveHandle"
			/>
    </div>
	</gc-model>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { Message } from 'element-ui';
import { uuid, customHint } from '@/util/utils';
import { 
	fetchListToCaseAddVisibleUsers, 
	fetchDeleteCaseVisibleUser, 
	fetchCountCaseOrgUser, 
	fetchListCaseBelongOrgs,
	
	fetchListToColumnAddVisibleUsers, 
	fetchDeleteColumnVisibleUser, 
	fetchCountColumnOrgUser, 
	fetchListColumnBelongOrgs,
} from '@/fetch/caseCenter'
import DeptTreeSelect from './DeptTreeSelect'
import CompSelectCaseUser from './CompSelectCaseUser.vue'

const emits = defineEmits(['comfirm'])
const props = defineProps({
	type: {
		type: String,
		default: 'case'
	},
  orgTitle: {
    type: String,
    default: '可见组织'
	},
	personTitle: {
    type: String,
    default: '可见人员'
	},
	personDesc: {
    type: String,
    default: '一次导入不能超过15000人，不包括组织人数'
	},
})

const fnMapping = {
	case: {
		fetchListVisibleUsers: fetchListToCaseAddVisibleUsers,
		fetchDeleteVisibleUser: fetchDeleteCaseVisibleUser, 
		fetchCountOrgUser: fetchCountCaseOrgUser, 
		fetchListBelongOrgs: fetchListCaseBelongOrgs,
	},
	column: {
		fetchListVisibleUsers: fetchListToColumnAddVisibleUsers,
		fetchDeleteVisibleUser: fetchDeleteColumnVisibleUser, 
		fetchCountOrgUser: fetchCountColumnOrgUser, 
		fetchListBelongOrgs: fetchListColumnBelongOrgs,
	}
}

const fetchListVisibleUsers = computed(() => fnMapping[props.type].fetchListVisibleUsers)
const fetchDeleteVisibleUser = computed(() => fnMapping[props.type].fetchDeleteVisibleUser)
const fetchCountOrgUser = computed(() => fnMapping[props.type].fetchCountOrgUser)
const fetchListBelongOrgs = computed(() => fnMapping[props.type].fetchListBelongOrgs)


// =========================== 组件树 ===========================
const treeOptions = ref(null)
const treeData = ref(null)
const treeDataOriginal = ref([])

// =========================== 计算：满足条件人数 ===========================
const userNumber = ref('')
async function caculateHandle () {
	if (_checkOrgSelected()) {
		userNumber.value = await fetchCountOrgUser.value({
			// orgIds: treeData.value.join(','),
			orgIds: treeData.value,
			type: 'C'
		})
	}
}
async function exportOrgHandle () {
	if (_checkOrgSelected()) {
		await fetchCountOrgUser.value({ 
			// orgIds: treeData.value.join(','),
			orgIds: treeData.value,
			type: 'E'
		})
	}
}

function _checkOrgSelected() {
	if (!treeData.value || !treeData.value.length) {
		Message.warning('请先选择机构')
		return false
	}
	return true
}

// =========================== 可见人员 ===========================
const isSelectCaseUserShow = ref(false)
const importId = ref('')
const operateId = ref('')
const isDetail = ref(false)
// 打开选择人员弹框
function openAddUser () {
	isSelectCaseUserShow.value = true
}
// 关闭选择人员弹框
function closeAddUser () {
	isSelectCaseUserShow.value = false
}
// 确认-选择人员弹框
function caseUserSaveHandle(data) {
	console.log(data)
	getUserList()
}

// 清空已选人员
async function clearUserHandle (operateId) {
	try {
		if (operateId) { // 清空本次添加用户
			const data = { importId: importId.value, operateId, type: 'batch' }
			await fetchDeleteCaseVisibleUser.value({ data })
		} else { // 清空所有添加用户
			await removeTips()
			const data = { importId: importId.value, type: 'batch' }
			await fetchDeleteVisibleUser.value({ data })
			getUserList()
		}
	} catch {}
}
// 删除操作的二次提示
function removeTips() {
	return new Promise((resolve, reject) => {
		customHint('是否确定清空', '提示', '取消')
		.then(() => resolve())
		.catch(() => reject())
	})
}
// 删除单个用户
async function removeUserRow(row) {
	const data = {
		type: 'one',
		umId: row.umId,
		importId: importId.value,
	}
	await fetchDeleteVisibleUser.value({ data })
	getUserList()
}
// 刷新
function refreshHandle () {
	queryUserList()
	Message.success('已刷新')
}
// 查询用户
function queryUserList(flag) {
	pushUserQueryForm.currPage = 1
	getUserList(flag)
}
const pushUserColumn = [
	{ label: '序号', type: 'index' },
	{ label: 'UM号', prop: 'umId' },
	{ label: '姓名', prop: 'umName' }
]
const pushUserTableList = ref([])
const pushUserQueryForm = reactive({
	currPage: 1,
	pageSize: 10,
	total: 0
}) 
async function getUserList(flag) {
	let data = {
		importId: importId.value,
		...pushUserQueryForm
	}
	let { list, total } = await fetchListVisibleUsers.value({ data })
	pushUserTableList.value = list

	// 弹框第一次打开时，记录用户列表“上次”查询的总记录数
	if (flag === 'first') {
		pushUserTableListTotal.value = pushUserQueryForm.total
	}

	// 用户列表“本次”查询的总记录数
	pushUserQueryForm.total = total

}

// =========================== 选择人员 ===========================

const isOpen = ref(false)
// 本次添加人员数
const pushUserTableListTotal = ref(0)
// 重置数据
function resetData () {

}
// 打开弹框
function openDialog (data) {
	isOpen.value = true
	// 设置临时id
	importId.value = data.importId || uuid()
	operateId.value = uuid()

	// 设置树节点
	treeDataOriginal.value = data.crowdOrgs || []
	if (treeDataOriginal.value.length) {
		// 设置树节点值数组
		treeData.value = treeDataOriginal.value.map(m => m.orgId)
	} else {
		treeData.value = []
	}
	// 加载用户列表
	queryUserList('first')
}
// 关闭
const deptTreeSelectRef = ref(null)
function closeDialog () {
	isOpen.value = false
	userNumber.value = ''
	// deptTreeSelectRef.value.clearData()
}
// 取消
function cancelDialog () {
	// 当开始的用户数量 小于 最后的用户数量时，则清空本次添加的人员
	if (pushUserTableListTotal.value < pushUserTableList.value?.length) {
		clearUserHandle(operateId.value)
	}
	closeDialog()
}
function comfirmDialog () {
	const crowdOrgs = deptTreeSelectRef.value.getOrgData()
	emits('comfirm', { crowdOrgs })
	closeDialog()
}

defineExpose({
	openDialog
})

</script>

<style lang='scss' scoped>
// :deep(.select-person-model .el-dialog) {
// 	height: 650px !important;
// }

// .select-person-model{
// 	.el-dialog__wrapper {
// 		:deep(.el-dialog) {
// 		// margin-bottom: 5vh;
// 			height: 650px !important;
// 		}
// 		:deep(.el-dialog__header) {
// 			// display: none;
// 		}
// 		:deep(.el-dialog__body) {
// 			padding: 0px !important;
// 			padding-bottom: 0px !important;
// 		}
// 		:deep(.el-form-item) {
// 			margin-bottom: 15px;
// 		}
// 	}
// }

.flex-wraaper {
	display: flex;
}
.item-label {
	width: 80px;
	text-align: right;
	margin-right: 10px;
}
.main-container {
  background-color: #fff;
	// padding: 0 20px;
}

.rule-title {
  // margin: 10px 0;
  font-size: 14px;
  padding-left: 10px;
  margin-bottom: 10px;
  // margin-top: 20px;
  position: relative;

  &::before {
    content: '';
    width: 3px;
    height: 10px;
    background-color: $themeColor;
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .color-red {
    font-size: 12px;
    color: #e02020;
  }

  .color-gray {
    font-size: 12px;
    color: $color9;
  }
}

.block-item {
  display: block;

  &.push-user-container {
    :deep(.el-form-item__content) {
      width: 100%;
    }
  }
}

.w80 {
  width: 80px;
}

.table-list {
  width: 100%;
  margin-top: 15px;
}

.case-org-tree {
  width: 450px;
}

:deep(.case-org-tree){
  .vue-treeselect__multi-value-item {
    background-color: $themeColor;
    color: #fff;
  }
  .vue-treeselect__value-remove {
    color: #fff;
  }
  .vue-treeselect__checkbox--checked {
    background-color: $themeColor;
    border-color: $themeColor;
  }
  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
    border-color: $themeColor;
  }
}
</style>
