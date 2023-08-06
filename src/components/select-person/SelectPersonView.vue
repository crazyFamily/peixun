<template>
  <gc-model
		title="已导入人员信息"
		:visible="isOpen"
		top="7vh"
		width="800px"
		class="select-person-model"
		:class="{ height90vh: userTableListLength >= queryForm.pageSize }"
		comfirmText="确认删除"
		:isShowFooter="false"
		@close="closeDialog"
		@cancel="closeDialog"
		@comfirm="comfirmDilaog">
		<div class="main-container">
      <el-form inline ref="selectPersonRef" class="between-noc">
				<el-form-item>
					<template v-if="userTableListLength">
						<el-button v-if="!isDetail && userTableList.length" type="text" class="button-w60-h30" @click="deleteUser">删除</el-button>
						<el-button type="text" class="button-w60-h30" @click="exportUser">导出</el-button>
					</template>
				</el-form-item>
				<div>
					<el-form-item>
						<span class="mr10">人员</span>
						<el-input class="w150 mr20" 
							placeholder="请输入姓名/UM号" 
							v-model="queryForm.umIdOrName" 
							@keyup.enter.native="queryUserList"/>
					</el-form-item>
					<el-form-item>
						<el-button class="button-w80-h30" @click="queryUserList" type="primary">查询</el-button>
						<el-button class="button-w80-h30" @click="resetList">重置</el-button>
					</el-form-item>
				</div>
      </el-form>
			<table-pagination
				class="table-list"
				:pageSizes="[10, 20]"
				:list="userColumn"
				:tableList="userTableList"
				:queryForm="queryForm"
				:getList="getUserList"
				ref="tablePaginationRef" />
    </div>
	</gc-model>
</template>
<script setup>
import { customHint } from '@/util/utils'
import { ref, reactive, computed, watch, set, nextTick } from 'vue'
import { fetchFindCaseCrowdUmList, fetchFindColumneCrowdUmList } from '@/fetch/caseCenter'
import { Message } from 'element-ui'

const toDeleteRow = ref([])
const emits = defineEmits(['comfirm'])

const props = defineProps({
	type: {
		type: String,
		default: 'case'
	}
})

const loadFnMapping = {
	'case': fetchFindCaseCrowdUmList,
	'column': fetchFindColumneCrowdUmList
}

const loadFn = computed(() => {
	return loadFnMapping[props.type]
})

// 导出
async function exportUser () {
	queryForm.type = 'E'
	await loadFn.value({request: queryForm})
}
// 刷新
function resetList () {
	queryForm.umIdOrName = ''
	queryUserList()
}
// 查询用户
function queryUserList() {
	queryForm.currPage = 1
	getUserList()
}

const userColumn = computed(() => {
	const list = [
		{ label: '序号', type: 'index' },
		{ label: '姓名', prop: 'umName', width: '150' },
		{ label: 'UM号', prop: 'umId', width: '150' },
		{ label: '所属机构', prop: 'orgName', width: '350'  },
	]
	if (!isDetail.value) {
		list.unshift({ type: 'selection' })
	}
	return list
}) 

const userTableList = ref([])
const userTableListLength = computed(() => {
	return userTableList.value?.length || 0
})

const queryForm = reactive({
	type: 'C',
	crowdBatchId: '',
	umIdOrName: '',
	currPage: 1,
	pageSize: 10,
	total: 0
}) 
const tablePaginationRef = ref(null)
// type=“C”，是查询，type="E"或者空就是导出
async function getUserList() {
	queryForm.type = 'C'
	let data = { request: queryForm }
let { list, total } = await loadFn.value(data)
	// const umIdArr = toDeleteRow.value.map(m => m.umId)
	// const umNameArr = toDeleteRow.value.map(m => m.umName)
	userTableList.value = list
	queryForm.total = total
	nextTick(() => {
		userTableList.value?.forEach(m => {
			if (toDeleteRow.value?.map(m => m.umId)?.includes(m.umId)) {
				tablePaginationRef.value.getOriginTableRef().toggleRowSelection(m)
			}
		})
	})
}

// 删除用户
function deleteUser () {
	const rows = tablePaginationRef.value.getSelection()
	if (!rows?.length) {
		return Message.warning('请选择要删除的记录')
	}
	customHint('确认要删除此记录吗？').then(() => {
		toDeleteRow.value.push(...rows)
		const umIdArr = rows.map(m => m.umId) || [] 
		emits('comfirm', { objArr: rows, umIdArr})
		closeDialog()
	})
}

const isOpen = ref(false)
const isDetail = ref(false)
function openDialog (data) {
	isOpen.value = true
	isDetail.value = data.isDetail || false
	queryForm.crowdBatchId = data?.batchId || ''
	toDeleteRow.value = data?.deleteUserList || []
	queryUserList()
}

function closeDialog () {
	isOpen.value = false
}
function comfirmDilaog () {

// 	const rows = tablePaginationRef.value.getSelection()
// 	const umIdArr = rows?.map(m => m.umId) || []
// 	// console.log('临时删除用户', toDeleteRow.value, umIdArr)
// 	emits('comfirm', { objArr: rows, umIdArr})
// 	closeDialog()
}

defineExpose({
	openDialog
})

</script>

<style lang='scss' scoped>
.select-person-model {
	:deep(.gc-model__dialog) {
		height: auto;
		.el-dialog__body {
			max-height: calc(100% - 51px);
		}
	}
}
.height90vh {
	:deep(.gc-model__dialog) { 
		height: 640px !important;
	}
}


</style>
