<template>
  <div class="ManageCompanyIndex">
    <el-card class="search-card mt10">
      <el-form :model="queryForm" inline ref="querFormRef" label-width="100px">
        <el-form-item label="管理单位名称">
          <el-input v-model.trim="queryForm.managementName" placeholder="请输入管理单位名称" class="w-200" />
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDataList">查询</el-button>
          <el-button @click="resetDataList">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-wapper">
        <div class="menu-left" style="color:red;">* 删除管理单位会影响历史数据的展示，若需要失效管理单位，但是不影响历史数据的展示，可修改管理单位的状态为“不启用”</div>
        <div class="menu-right">
          <span class="instructor-icons__add" @click="openAddHandle()">
            <i class="instructor-icons__add__icon"></i>
            添加
          </span>
          <span class="instructor-icons__download" @click="exportDataList">
            <i class="instructor-icons__download__icon"></i>
            导出
          </span>
          <span class="instructor-icons__download" @click="validateDataList">
            <i class="instructor-icons__download__icon"></i>
            校验
          </span>
        </div>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="fetchDataList"
        v-loading="getLoadingStatus('LOADING_MANAGEMENT')"
        ref="tablePagination">
        <el-table-column label="操作" width="105px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="openEditHandle(scope.row)">编辑</span>
              <span class="item active ml10" @click="deleteHandle(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <gc-model title="存在机构暂未关联上管理单位，机构列表如下：" :visible="unRelatedOrgsVisible" width="1000px" top="5vh"
      class="un-relatedorgs-model"
      cancelText=""
      comfirmText="知道了"
      @close="unRelatedOrgsClose" 
      @cancel="unRelatedOrgsClose" 
      @comfirm="unRelatedOrgsClose">
      <div class="unRelatedOrgs-container">
        <div class="unRelatedOrgs-search">
          <el-input placeholder="输入关键字进行搜索" v-model="queryFormNoManage.orgName" @keyup.enter.native="queryUnRelatedOrgs" :max="200" style="width:80%;" class="mb10 mr10" clearable />
          <el-button @click="queryUnRelatedOrgs" type="primary" class="w-80">查询</el-button>
          <el-button @click="exportUnRelatedOrgs" class="w-80">导出</el-button>
        </div>
        <div class="unRelatedOrgs-list" v-infinite-scroll="loadUnRelatedOrgs" 
          :infinite-scroll-disabled="unRelatedOrgsDisabled">
          <div v-for="(org,i) in unRelatedOrgs" :key="i" class="unRelatedOrgs-item" >{{org.orgName}}</div>
          <div class="msg-show">
            <p v-if="unRelatedOrgsLoading">加载中...</p>
            <p v-if="unRelatedOrgsNoMore">没有更多了</p>
          </div>
        </div>
      </div>
    </gc-model>
  </div>
</template>
<script>
export default {
  name: 'ManageCompanyIndex'
}
</script>
<script setup>
import { ref, reactive, computed, watch, onMounted, onActivated } from 'vue'
import { addAllowKeepAlive, handleExport, customHint, getLoadingStatus, CopyObj } from '@/util/utils'
import { useRouter, useRoute } from '@/router'
import { COMPANY_STATUS_OPTIONS, MANAGEMENT_TYPE_MANAGE } from '../enum'
import { 
  fetchListManagement, fetchExportManagement, 
  fetchDeleteManagementByManagementId, fetchFindManagementDetail,
  fetchFindOthersManagementOrgs, 
  fetchFindNoManagementOrgs, fetchExportNoManagementOrgs
} from '@/fetch/systemManagement'
import { Message } from 'element-ui'

const router = useRouter()
const queryForm = reactive({
  managementType: MANAGEMENT_TYPE_MANAGE,
  managementName: '',
  currPage: 1,
  pageSize: 10,
  total: 0
})

const tableFilterSetting = (key, list, multiple = false) => {
  return {
    type: 'tablecolumnfilters',
    labelKey: key,
    radio: !multiple,
    list
  }
}

const columnList = [
  { type: 'selection', fixed: true },
  { label: '序号', type: 'index', fixed: true },
  { label: '管理单位ID', prop: 'managementId', type: 'setWidth', width: 100 },
  { label: '管理单位名称', prop: 'managementName', type: 'setWidth', width: 150 },
  { label: '架构范围', prop: 'allOrgName', width: '250px' },
  { label: '状态', prop: 'managementStatusDesc', type: 'setWidth', width: 80,
    ...tableFilterSetting('managementStatus', COMPANY_STATUS_OPTIONS)
  },
  { label: 'HRD名称', prop: 'hrdNameStr', width: 150 },
  { label: '更新人', prop: 'updatedByStr', width: 150 },
  { label: '更新时间', prop: 'updatedByDate', width: 150 },
]

const dataList = ref([])

const queryDataList = () => {
  queryForm.currPage = 1
  fetchDataList()
}
const resetDataList = () => {
  queryForm.managementName = ''
  queryDataList()
}

function fetchDataList () {
  fetchListManagement(queryForm)
  .then(res => {
    dataList.value = res.list
    queryForm.total = res.total
  })
}
// 新增
async function openAddHandle(type = 'add', row) {
  // 获取当前已经关联过的机构
  const params = type === 'edit' ? { managementId: row.managementId, managementType: MANAGEMENT_TYPE_MANAGE } : { managementType: MANAGEMENT_TYPE_MANAGE }
  const res = await fetchFindOthersManagementOrgs(params)
  // 跳转到表单页面
  addAllowKeepAlive('/ManageCompanyForm')
  router.push({
    name: '新增管理单位',
    params: {
      formType: type,
      disabledList: res || [],
      row
    }
  })
}
// 编辑
async function openEditHandle (row) {
  const res = await fetchFindManagementDetail({managementId: row.managementId, managementType: MANAGEMENT_TYPE_MANAGE})
  openAddHandle('edit', res) 
}
// 单个删除
function deleteHandle (row) {
  customHint('若该管理单位已被应用，删除会影响历史数据的展示，请谨慎删除，若希望失效该管理单位又不影响历史数据的展示，可修改该管理单位的状态为“不启用”', '提示', '关闭', false, '确认删除')
  .then(() => {
    fetchDeleteManagementByManagementId({
      managementType: MANAGEMENT_TYPE_MANAGE,
      managementId: row.managementId
    }).then(res => {
      Message.success('删除成功')
      queryDataList()
    })
  })
}

// 导出
async function exportDataList () {
  await fetchExportManagement(queryForm)
}

// ======================== 未关联机构 ========================
// 验证
const unRelatedOrgsVisible = ref(false)
// 当前显示的 未关联机构
const unRelatedOrgs = ref([]) 
// 所有未关联机构
const unRelatedOrgsAll = ref([]) 
// 数据加载中
const unRelatedOrgsLoading = ref(false)
// 没有更多内容
const unRelatedOrgsNoMore = computed(() => queryFormNoManage.total <= queryFormNoManage.loadTotal)
// 是否禁用滚动
const unRelatedOrgsDisabled = computed(() => unRelatedOrgsLoading.value || unRelatedOrgsNoMore.value )

// // 未关联机构查询关键词
// const unRelateedSearchValue = ref('')
// watch(unRelateedSearchValue, (newV, oldV) => {
//   // 执行filter时，会执行 el-tree 组件 绑定的 filterNodeMethod 方法,即 _filterFn 
//   unRelatedOrgs.value = unRelatedOrgsAll.value.filter(m => m.orgName.includes(newV) )
// })

const queryFormNoManage = reactive({
  managementType: MANAGEMENT_TYPE_MANAGE,
  orgName: '',
  currPage: 0,
  pageSize: 100,
  total: 0,
  loadTotal: 0
})
function unRelatedOrgsClose () {
  unRelatedOrgsVisible.value = false
  unRelatedOrgs.value = []
  queryFormNoManage.orgName = ''
  queryFormNoManage.currPage = 0
}
function queryUnRelatedOrgs () {
  queryFormNoManage.currPage = 0
  loadUnRelatedOrgs(true)
}
// 加载未关联机构
async function loadUnRelatedOrgs (isReload) {
  unRelatedOrgsLoading.value = true
  queryFormNoManage.currPage ++
  const res = await fetchFindNoManagementOrgs(queryFormNoManage)
  if (res?.list.length) {
    queryFormNoManage.total = res.total
    if (isReload) {
      queryFormNoManage.loadTotal = res?.list.length
      unRelatedOrgsAll.value = res.list.map(m => ({ orgName: m }))
    } else {
      queryFormNoManage.loadTotal += res?.list.length
      unRelatedOrgsAll.value.push(...res.list.map(m => ({ orgName: m })))
    }
    unRelatedOrgs.value = CopyObj(unRelatedOrgsAll.value)
    unRelatedOrgsLoading.value = false
    return true
  } else {
    return false
  }
}

// 导出未关联机构
async function exportUnRelatedOrgs () {
  await fetchExportNoManagementOrgs(queryFormNoManage)
}

// 验证未关联机构
async function validateDataList () {
  const hasRow = await loadUnRelatedOrgs(queryFormNoManage)
  if (hasRow) {
    unRelatedOrgsVisible.value = true
    // unRelateedSearchValue.value = ''
    queryFormNoManage.orgName = ''
  } else {
    Message.success('当前所有机构均关联至管理单位')
  }
}


// ======================== 初始化 ========================

const isMounted = ref(false)
// 初始化数据
const initData = () => {
  const routeParams = useRoute().params
  queryDataList()
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
</script>
<style lang="less" scoped>
.menu-wapper {
  display: flex; 
  justify-content: space-between;
}
.un-relatedorgs-model {
  :deep(.el-dialog) { margin-bottom: 5vh; }
  :deep(.el-dialog__body) { padding: 0 5px 0 0 !important; overflow: hidden; }
  :deep(.el-dialog__footer .footer) { justify-content: center !important; }
}
.unRelatedOrgs-container {
  .unRelatedOrgs-search {
    padding: 15px 15px 0;
    border-bottom: 1px solid #d8d8d8;
    box-shadow: 0 4px 8px rgb(0 0 0 / 18%);
  }
  .unRelatedOrgs-list {
    position: relative;
    top: 8px;
    padding: 5px 15px 10px 15px;
    // max-height: calc(90vh - 180px);
    max-height: calc(90vh - 250px);
    line-height: 25px;
    white-space: nowrap;
    overflow: scroll;
    &::-webkit-scrollbar {
      width: 4px;
      height: 8px;
    }
  }
  .unRelatedOrgs-item {
    &:hover {
      background: #f0f0f0;
    }
  }
  .msg-show {
    text-align: center;
    line-height: 30px;
    background: #f0f0f0;
  }
}
</style>