<template>
  <gc-model title="选择人员" top="5vh" width="900px" class="set-crowd-dialog"
		:visible="isOpen"
		:showClose="false"
		@cancel="cancelDialog"
		@comfirm="comfirmDialog">
    <div class="between">
      <div class="left-container">
        <p class="title">员工库<span class="desc">(通过下面的条件检索您需要的人员)</span></p>
        <div class="body">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="组织" name="org">
              <div class="search-tab-panel tree-org">
                <div class="p10">
                  <el-input class="mlr10 w-280" placeholder="输入选择" v-model.trim="treeSearchValue" @keyup.enter.native="searchTreeNode">
                    <i slot="suffix" class="page-input__search mt8" @click="searchTreeNode" />
                  </el-input>
                  <el-button class="ml10" @click="searchTreeNode('reset')">重置</el-button>
                </div>
                <el-tree 
                  v-if="!isReset"
                  lazy 
                  show-checkbox
                  node-key="orgId"
                  :props="treeProps"
                  :load="loadNode"
                  :default-expanded-keys="defaultExpandedKeys"
                  :default-checked-keys="defaultCheckKeys"
                  :expand-on-click-node="false"
                  :check-on-click-node="true"
                  :filter-node-method="filterTreeNode"
                  ref="treeCrowdOrgsRef"
                  />
              </div>
            </el-tab-pane>
            <el-tab-pane label="人员" name="user">
              <div class="search-tab-panel plrb10">
                <el-radio-group v-model="userNavType" @change="userNavTypeChangeHandle">
                  <el-radio label="UM">UM号导入</el-radio>
                  <el-radio label="name">姓名搜索</el-radio>
                </el-radio-group>
                <div v-show="userNavType === 'UM'" class="mt10">
                  <div class="tips mb10">
                    <p>填写员工UM号，添加到右侧，每行一条</p>
                    <p>单次最多粘贴1000行，示例：</p>
                    <p>ZHANGSAN001</p>
                    <p>lishi002</p>
                  </div>
                  <div class="um-container">
                    <el-input v-model="umSet" type="textarea" rows="13"></el-input>
                    <p class="fail-tip" v-show="isFailTipShow">
                      以上UM号错误或者不存在
                    </p>
                  </div>
                </div>
           <div v-show="userNavType === 'name'" class="mt10">
                  <el-input v-model.trim="searchName">
                    <template slot="append">
                      <el-button type="primary" class="search-btn" @click="searchUmNameHandle">确定</el-button>
                    </template>
                  </el-input>
                  <div class="search-list-container">
                    <el-scrollbar style="height: 40vh">
                      <p class="um-name-item null-data" v-if="!searchUmNameList.length">暂无记录</p>
                      <p class="um-name-item" :class="{ active: item.active }"
                        v-for="(item, index) in searchUmNameList" :key="item.umId"
                        @click="selecteUmNameHandle(item, index)">
                        {{ item.umName }}({{ item.umId }})
                      </p>
                    </el-scrollbar>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="btn-container">
        <el-button class="mb10" @click="addHandle">添加 &gt;</el-button>
        <br/>
        <el-button class="ml0" @click="removeHandle">删除 &lt;</el-button>
      </div>
      <div class="right-container">
        <p class="title">已选人群</p>
        <div class="body">
          <div class="selected-orgs" v-if="selectedData.orgs && selectedData.orgs.length">
            <div class="title org-color">
              <span>
                <img src="@/assets/svg/crowd-orgs.svg" class="icon" />
              </span>
              <span>组织</span>
            </div>
            <el-checkbox-group v-model="selectedItem.orgs">
              <ul class="selected-list">
                <li v-for="org in selectedData.orgs" :key="org.orgId">
                  <el-checkbox :label="org.orgId">{{org.orgName}}</el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>
          </div>
          <div class="selected-users" v-if="selectedData.users && selectedData.users.length">
            <div class="title user-color">
              <img src="@/assets/svg/crowd-users.svg" class="icon" />
              <span>人员</span>
            </div>
            <el-checkbox-group v-model="selectedItem.users">
              <ul class="selected-list">
                <li v-for="user in selectedData.users" :key="user.umId">
                  <el-checkbox :label="user.umId">{{user.umName}}({{user.umId}})</el-checkbox>
                </li>
              </ul>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
  </gc-model>
</template>
<script setup>
import $ from 'jquery'
import { ref, reactive, computed, watch, set, nextTick } from 'vue'
import { 
  fetchListCaseManulUsers, 
  fetchListColumnManulUsers, 
  fetchInsertCaseManulVisibleUsers, 
  fetchInsertColumnManulVisibleUsers,
  fetchListCaseBelongOrgs,
  fetchListColumnBelongOrgs,
} from '@/fetch/caseCenter'
import { Message } from 'element-ui'
import { CopyObj, uuid } from '@/util/utils'

const isOpen = ref(false)
const activeTab = ref('org')
const importId = ref('')
const operateId = ref('')
const emits = defineEmits(['comfirm'])
const props = defineProps({
  type: {
    type: String,
    default: 'case'
  }
})

const fnMapping = {
  case: {
    fetchListBelongOrgs: fetchListCaseBelongOrgs,
    fetchInsertManulVisibleUsers: fetchInsertCaseManulVisibleUsers,
    fetchListManulUsers: fetchListCaseManulUsers
  },
  column: {
    fetchListBelongOrgs: fetchListColumnBelongOrgs,
    fetchInsertManulVisibleUsers: fetchInsertColumnManulVisibleUsers,
    fetchListManulUsers: fetchListColumnManulUsers
  }
}
const fetchInsertManulVisibleUsers = computed(() => fnMapping[props.type].fetchInsertManulVisibleUsers )
const fetchListManulVisibleUsers = computed(() => fnMapping[props.type].fetchListManulUsers )
const fetchListBelongOrgs = computed(() => fnMapping[props.type].fetchListBelongOrgs)

// 已选择信息
const selectedData = reactive({
  orgs: [],
  users: []
})
// 已选择信息
const selectedItem = reactive({
  orgs: [],
  users: []
})

// ============================ 选择组织 ============================
const isReset = ref(false)
const treeSearchValue = ref('')
const treeCrowdOrgsRef = ref(null)
const treeProps = { label: 'orgName', children: 'zones', isLeaf: 'leaf' }
const defaultExpandedKeys = ref([])
const defaultCheckKeys = ref([])

function handleDefaultExpandedKeys (data, resOrg) {
  if (data.length) {
    data = data.map((m) => {
      const allPrnNodeArr = m.allPrnNode?.split('|') || []
      allPrnNodeArr.pop()
      const res = {
        ...m,
        allPrnNodeArr
        // allPrnNodeArr: [...allPrnNodeArr] // 节点路径(不包括叶子节点) - 每渲染一节点少一节点
      }
      return res
    })
    const orgIdArr = []
    data.forEach(item => {
      orgIdArr.push(...item.allPrnNodeArr)
    })
    defaultExpandedKeys.value = [...new Set(orgIdArr)]
  } else {
    defaultExpandedKeys.value = resOrg.map(m => m.orgId)
  }
}

function handleCheckedNode (resOrg) {
  const checkedKeys = []
  resOrg.forEach(item => {
    if (defaultCheckKeys.value.includes(item.orgId)) {
      checkedKeys.push(item.orgId)
    }
  })
  const checkedKeysOld = treeCrowdOrgsRef.value.getCheckedKeys()
  treeCrowdOrgsRef.value.setCheckedKeys([]);
  nextTick(() => {
    const checkedKeysNew = [...checkedKeysOld, ...checkedKeys]
    treeCrowdOrgsRef.value.setCheckedKeys(checkedKeysNew)
  })
}
// 树组件 加载数据函数
async function loadNode(node, resolve) {
  console.log(node)
  const { data, level } = node
  if (level === 0) {
    const resOrg = await fetchListBelongOrgs.value()
    handleDefaultExpandedKeys(selectedData.orgs, resOrg)
    return resolve(resOrg)
  } else {
    const params = { orgId: data.orgId }
    const resOrg = await fetchListBelongOrgs.value(params)
    handleCheckedNode(resOrg)
    return resolve(resOrg)
  }
}
function searchTreeNode (flag) {
  if (flag === 'reset') {
    treeSearchValue.value = ''
  }
  const val = treeSearchValue.value
  treeCrowdOrgsRef.value.filter(val);
}
function filterTreeNode (value, data) {
  if (!value) return true;
  return data.orgName.indexOf(value) !== -1;
}
// ============================ 选择人员 ============================
const userNavType = ref('UM')
function userNavTypeChangeHandle () {
  // 重置左边【人员-按姓名搜索】
  searchName.value = ''
  searchUmNameList.value = []
}

// 人员-按UM导入-相关字段
const umSet = ref('')
const isFailTipShow = ref(false)
const failUserList = ref([])
const failTimer = ref(null)
watch(() => failUserList.value, (n) => {
  if (n.length) {
    isFailTipShow.value = true
    failTimer.value && clearTimeout(failTimer.value)
    failTimer.value = setTimeout(() => {
      isFailTipShow.value = false
    }, 3000)
  }
})

// ================================= 人员-按姓名搜索 =================================
// 人员-按姓名搜索-相关字段
const searchName = ref('')
const searchUmNameList = ref([])
async function searchUmNameHandle() {
  searchUmNameList.value = await fetchListManulVisibleUsers.value({
    data: searchName.value
  })
}

// 人员-按姓名搜索-选择选项
function selecteUmNameHandle (item, index) {
  set(searchUmNameList.value, index, { ...item, active: !item.active })
}

function umExportHandle() {
  return new Promise(async (resolve, reject) => {
    let users = umSet.value
      .split(/\n/)
      .filter((item) => Boolean(item))
      .map((item) => ({
        importId: importId.value,
        operateId: operateId.value,
        umId: item
      }))
    const data = { type: 'add', users }
    const { successList, failList } = await fetchInsertManulVisibleUsers.value({ data })
    const concatlist = successList.filter(
      (item) => !Boolean(selectedData.users.find((tableItem) => tableItem.umId === item.umId))
    )
    selectedData.users = selectedData.users.concat(concatlist) 
    failUserList.value = failList
    resolve()
  })
}
function nameExportHandle() {
  return new Promise(async (resolve) => {
    let users = searchUmNameList.value
      .filter((item) => item.active)
      .map((item) => ({
        importId: importId.value,
        operateId: operateId.value,
        umId: item.umId
      }))
    let data = { type: 'add', users }
    let { successList, failList } = await fetchInsertManulVisibleUsers.value({ data })
    resolve({ successList, failList })
  })
}
// 添置
async function addUmHandle () {
  if (userNavType.value === 'UM') {
    await umExportHandle()
    umSet.value = failUserList.value.map((item) => item.umId).join('\n')
  }
 if (userNavType.value === 'name') {
    let fetchBack = await nameExportHandle()
    if (fetchBack.failList.length) {
      Message.error(
        `[${fetchBack.failList
          .map((item) => `${item.umId}`)
          .join(',')}] 以上UM号错误或者不存在`
      )
    }
    let concatlist = searchUmNameList.value
      .filter((item) => item.active)
      .filter((item) => {
        return !Boolean(
          selectedData.users.find((tableItem) => tableItem.umId === item.umId )
        )
      })
      .filter((item) => {
        return Boolean(
          fetchBack.successList.find((succItem) => succItem.umId === item.umId)
        )
      })
    selectedData.users = selectedData.users.concat(concatlist)
    searchUmNameList.value = searchUmNameList.value.map((item) => ({
      ...item,
      active: false
    }))
  }
}

// 过滤条件：当所有子集都被选的话，就命中父级节点，其下所有子集都被过滤
function getAllSelctedParentNode(store) {
  const checkedNodes = [];
  const traverse = function(node) {
    const childNodes = node.root ? node.root.childNodes : node.childNodes;
    childNodes.forEach(child => {
      if (child.checked) {
        checkedNodes.push(child.data);
      }
      if (child.indeterminate) {
        traverse(child);
      }
    });
  };
  traverse(store)
  return checkedNodes;
}
function addHandle () {
  if (activeTab.value === 'user') {
    addUmHandle()
  } else {
    selectedData.orgs = getAllSelctedParentNode(treeCrowdOrgsRef.value.store)
  }
}
// 删除“已选”
function removeHandle () {
    selectedData.users = selectedData.users.filter((item) => {
      return !selectedItem.users.find(
        (umId) => umId === item.umId
      )
    })
    selectedItem.users = []
    selectedData.orgs = selectedData.orgs.filter((item) => {
      return !selectedItem.orgs.find(
        (orgId) => orgId === item.orgId
      )
    })
    treeCrowdOrgsRef.value.setCheckedNodes(selectedData.orgs)
}

// 重置数据
function resetData () {
  // 重置左边【人员-按UM导入】
  umSet.value = ''
  // 重置左边【人员-按姓名搜索】
  searchName.value = ''
  searchUmNameList.value = []
  // 重置右边已选数据
  selectedData.orgs = []
  selectedData.users = []
  selectedItem.orgs = []
  selectedItem.users = []
  defaultCheckKeys.value = []
  defaultExpandedKeys.value = []
  isReset.value = true
}

function cancelDialog () {
  isOpen.value = false
  resetData()
}

function openDialog (data) {
  isOpen.value = data.isOpen
  importId.value = data.importId || uuid()
  selectedData.orgs = data.crowdOrgs || []
  selectedItem.orgs = data.crowdOrgs || []
  defaultCheckKeys.value = data.crowdOrgs?.map(m => m.orgId) || []
  if (defaultCheckKeys.value?.length === 1 && defaultCheckKeys.value[0] === 'SD00000001') {
    defaultExpandedKeys = defaultCheckKeys.value
  }
 // 设置临时id
  operateId.value = uuid()
  isReset.value = false
}
async function comfirmDialog () {
  const { orgs, users } = selectedData
  const fnSuceess = () => {
    Message.success('添加成功')
    emits('comfirm', { fromPage:'SetCrowdDialog', data: CopyObj({orgs, users}) } )
    cancelDialog()
  }
  if (selectedData.users?.length) {
    const data = {
      type: 'confirm',
      users: selectedData.users.map((item) => ({
        ...item,
        importId: importId.value,
        operateId: operateId.value,
      }))
    }
    await fetchInsertManulVisibleUsers.value({ data })
    fnSuceess()
  } else {
    fnSuceess()
  }
}

defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped>
:deep(.el-tabs__header) {
  margin-bottom: 5px;
  height: 40px;
  .el-tabs__item {
    height: 40px !important;
    line-height: 40px !important;
  }
}
.user-color {
  color: #fd6720 !important;
}
.org-color {
  color: rgb(64, 158, 255) !important;
}
.left-container {
  .search-tab-panel {
    height: 360px;
  }
}

.left-container, .right-container {
  flex: 1;
  .title {
    font-size: 13px;
    font-weight: 100;
    margin-bottom: 5px;
    color: #555;
    .desc {
      margin-left: 5px;
      color: #777;
    }
  }
  .body {
    border: 1px solid #ddd;
    height: 410px;
    overflow: auto;
    // height: calc(85vh - 150px);
  }
 .selected-orgs, .selected-users {
    padding: 0 8px;
    .title {
      line-height: 30px;
      border-bottom: 1px solid #f0f0f0;
      .icon {
        width: 16px;
        margin-right: 5px;
        margin-top: -3px;
      }
    }
    .selected-list {
      line-height: 22px;
    }
  }
}
.tree-org {
  height: 350px;
  width: 370px;
  overflow: auto;
}
.btn-container {
  width: 100px;
  text-align: center;
}
.tips {
  color: $color9;
  margin-bottom: 10px;
}

.um-container {
  position: relative;
  :deep(.el-textarea__inner) {
    resize: none;
  }
  .fail-tip {
    $base-height: 30px;
    width: 100%;
    height: $base-height;
    line-height: $base-height;
    padding: 10px;
    box-sizing: border-box;
    color: $themeColor;
    position: absolute;
    bottom: 10px;
  }
}

.search-btn {
  background-color: $themeColor !important;
  color: #ffffff !important;
}
.search-list-container {
  // margin-top: 20px;
  position: relative;
}
.um-name-item {
  $base-height: 40px;
  height: $base-height;
  line-height: $base-height;
  border: 1px solid $line-color;
  border-top: 0;
  padding: 0 20px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:first-child {
    border-top: 1px solid $line-color;
  }

  &.active {
    color: #fff;
    background-color: rgb($themeColor, 0.5);
  }

  &.null-data {
    height: 310px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
