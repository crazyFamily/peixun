<template>
  <div class="CaseCenter__CaseManagement">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="所属机构">
          <gc-institution
            :orgUrl="fetchListCasePushBelongOrgs"
            :leftShow="false"
            :default-show="false"
            v-model="queryForm.orgId"
            :isbranch="true"
            @setDataFinish="handleDefaultOrgsData"
            busiType="LS"
            ref="institutionRef"
          />
        </el-form-item>
        <el-form-item label="案例信息">
          <el-input v-model.trim="queryForm.caseInfo" placeholder="输入案例ID/名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="创建时间" class="mr10">
            <el-date-picker
              class="w-120"
              v-model="queryForm.startDate"
              type="date"
              placeholder="开始日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="r0">
            <el-date-picker
              class="w-120"
              v-model="queryForm.endDate"
              type="date"
              placeholder="结束日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="案例作者">
          <el-input v-model.trim="queryForm.caseAuthor" placeholder="输入制作人或分享人姓名/UM号"></el-input>
        </el-form-item>
        <el-form-item label="案例上传人">
          <el-input v-model.trim="queryForm.uploadUser" placeholder="输入上传人姓名/UM号"></el-input>
        </el-form-item>
        <el-form-item label="案例分类">
          <gc-select class="w-200" :options="caseClassifyOptions" @change="changeCaseClassify" v-model="queryForm.businessLine"></gc-select>
        </el-form-item>
        <el-form-item label="案例标签">
          <el-cascader
            clearable
            :options="caseTagOptions"
            :props="cascaderProps"
            @visible-change="setEmptyContent"
            collapse-tags
            v-model="queryForm.tagChildIds"
            ref="multipleCascaderRef"
          >
          </el-cascader>
        </el-form-item>
        <div class="buttons">
          <el-button @click="queryData" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="resetData" class="button-w80-h30">重置</el-button>
          <el-button @click="downCase" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="add">
          <i class="instructor-icons__add__icon"></i>
          新增</span
        >
        <span class="instructor-icons__upload" @click="upDownloadFrame('up')">
          <i class="instructor-icons__upload__icon"></i>
          批量上架</span
        >
        <span class="instructor-icons__download" @click="upDownloadFrame('down')">
          <i class="instructor-icons__download__icon"></i>
          批量下架</span
        >
        <span class="instructor-icons__del" @click="del">
          <i class="instructor-icons__del__icon"></i>
          删除</span
        >
      </div>
      <table-pagination
        :list="columns"
        @sort-change="sortChange"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        v-loading="getLoadingStatus('LOADING_CASECENTER_MANAGE_LIST')"
        ref="tablePaginationRef"
      >
        <el-table-column :selectable="selectable" slot="selection" type="selection" min-width="54"> </el-table-column>
        <el-table-column slot="tagName" width="226px;" label="案例标签">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content" v-html="toBreak(scope.row.tagName)"></div>
              <div class="onLine" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">{{ scope.row.tagName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="90" fixed="right">
          <template slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="openPreview(scope.row)">查看</span>
                <span class="active" v-if="scope.row.status === 'down' && scope.row.editStatus === 'Y'" @click="openEdit(scope.row)">编辑</span>
                <span v-if="scope.row.status === 'up' && scope.row.editStatus === 'Y'" class="active" @click="upOrDownFrame(scope.row, 'down')"
                  >下架</span
                >
                <span v-if="scope.row.status === 'down' && scope.row.editStatus === 'Y'" class="active" @click="upOrDownFrame(scope.row, 'up')"
                  >上架</span
                >
              <span class="active" @click="gotoCaseReport(scope.row)">报表</span>
                <span class="active" @click="openCode(scope.row)">二维码</span>
                <span class="active" @click="exportCourses(scope.row)">课件下载</span>
                <span v-if="isLSSuperAdmin" class="active" @click="updatePerfectStatus(scope.row)"
                  >{{ scope.row.isPerfect === 'Y' ? '取消' : '纳入' }}优秀案例</span
                >
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <gc-model width="500px" title="查看二维码" :isShowFooter="false" :visible.sync="codeVisible" @close="handleClose">
      <div class="relative">
        <div ref="ercode" class="dfc"></div>
        <img class="CaseCenter__CaseManagement__logo" src="~@/assets/images/bankA.png" alt="" />
      </div>

      <p class="fz20 tac mt20">请使用口袋银行家-学习中心扫码查看案例内容</p>
    </gc-model>
  </div>
</template>
<script setup>
import { ref, nextTick, onMounted, onActivated } from 'vue'
import QRCode from 'qrcodejs2'
import {
  fetchListCasePushBelongOrgs,
  fetchListToCase,
  fetchRemoveCase,
  fetchListTags,
  fetchUpOrDownStatus,
  fetchExportCaseInfoList,
  fetchUpdatePerfect,
  fetchDetailCase
} from '@/fetch/caseCenter'
import { LINE_LS } from '@/util/constants'
import { yesOrNoMap } from '@/util/constants'
import { useTable } from '@/hooks/useTable'
import { useRouter } from '@/router'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { hintFrame, filterObj, addAllowKeepAlive, downloadFile, getLoadingStatus, arrToTree, resetObj } from '@/util/utils'
const router = useRouter()
const baseParams = {
  currPage: 1,
  pageSize: 10,
  total: 0,
  orgId: '', // 所属机构
  startDate: '',
  endDate: '',
  uploadUser: '',
  caseInfo: '',
  caseAuthor: '',
  isPerfect: '',
  businessLine: '',
  tagChildIds: [],
  caseType: '',
  status: ''
}
const { queryForm, tableList, query, reset, dataRangeRules, tableFilterSetting } = useTable(baseParams)
const { startPickerOptions, endPickerOptions } = dataRangeRules('dateStart', 'dateEnd')
const columns = ref([
  {
    type: 'selection',
    slot: 'selection'
  },
  {
    type: 'index',
    label: '序号'
  },
  {
    label: '案例ID',
    width: '100',
    prop: 'caseId'
  },
  {
    label: '案例名称',
    width: '200',
    prop: 'caseName'
  },
  {
    label: '是否优秀案例',
    width: '120',
    prop: 'isPerfect',
    formatter: row => `${row.isPerfect === 'Y' ? '是' : '否'}`,
    ...tableFilterSetting('isPerfect', yesOrNoMap, false)
  },
  {
    label: '案例所属机构',
    width: '200',
    prop: 'belongOrgStr'
  },
  {
    label: '案例分类',
    prop: 'businessLineStr',
    width: '120'
  },
  {
    slot: 'tagName',
    width: '226'
  },
  {
    label: '案例类型',
    prop: 'caseTypeStr',
    width: '120',
    ...tableFilterSetting(
      'caseType',
      [
        {
          label: '视频',
          value: 'video'
        },
        {
          label: '音频',
          value: 'voice'
        },
        {
          label: '图文',
          value: 'context'
        },
        {
          label: '混合',
          value: 'mix'
        }
      ],
      false
    )
  },
  {
    label: '分享人',
    width: '100',
    prop: 'shareUserName'
  },
  {
    label: '制作人',
    width: '100',
    prop: 'makeUserName'
  },
  {
    label: '上传人',
    width: '200',
    prop: '',
    formatter: row => `${row.createdByName}/${row.createdBy}`
  },
  {
    label: '创建时间',
    width: '140',
    sortable: 'custom',
    prop: 'createdDateStr'
  },
  {
    label: '更新时间',
    width: '140',
    prop: 'updatedDateStr'
  },
  {
    label: '状态',
    prop: 'statusStr',
    width: '80',
    ...tableFilterSetting(
      'status',
      [
        {
          label: '上架',
          value: 'up'
        },
        {
          label: '下架',
          value: 'down'
        }
      ],
      false
    )
  },
  {
    label: '首次上架时间',
    width: '150',
    prop: 'firstUpTimeStr'
  }
])
// 查看二维码 dialog状态
const codeVisible = ref(false)
const isLSSuperAdmin = ref(false)
const institutionRef = ref(null)
const tagsList = ref([])
const caseTagOptions = ref([])
const caseClassifyOptions = ref([])
const multipleCascaderRef = ref(null)
const blgStripLine = store.state.userInfo.blgStripLine || LINE_LS
const cascaderProps = { value: 'value', label: 'label', multiple: true }
const tablePaginationRef = ref(null)
const ercode = ref(null)
// 重置事件
const resetData = async () => {
  institutionRef.value.createTreeData()
  tablePaginationRef.value.resetFilters()
  resetObj(queryForm, baseParams)
  await nextTick()
  getList()
  caseTagOptions.value = []
}
let blgOrgIds = []
// 所属机构回显（默认获取当前权限机构）
// 1、<gc-institution></gc-institution> 组件刚渲染时会执行
// 2、执行 institutionRef.value.createTreeData() 时，会执行
const handleDefaultOrgsData = org => {
  const { orgId, orgName } = org
  blgOrgIds = ['LS', orgId]
  query(getList)
}
// 查询事件
const queryData = () => {
  query(getList)
}
// 格式化发送数据
const _formatSendParams = params => {
  const data = filterObj(params)
  data.orgId = data.orgId?.[1]
  data.tagChildIds = multipleCascaderRef.value.getCheckedNodes().map(v => v.value)
  return data
}
const getList = async () => {
  const data = _formatSendParams(queryForm)
  const { total, list } = await fetchListToCase({ data })
  queryForm.total = total
  tableList.value = list
}
const add = () => {
  const params = { state: 'add' }
  addAllowKeepAlive('/NewCase')
  router.push({ name: '新增案例', params })
}
const del = () => {
  const selection = tablePaginationRef.value.$refs.tableRef.$children[0].selection
  if (!selection.length) return Message.warning('请先选择案例')
  hintFrame('确定删除课程？').then(() => {
    const caseIds = selection.map(v => v.id)
    const data = { caseIds }
    fetchRemoveCase({ data }).then(res => {
      Message.success('删除成功')
      queryData()
    })
  })
}
const selectable = row => {
  if (row.editStatus === 'N') {
    return false
  } else {
    return true
  }
}
const changeCaseClassify = val => {
  let selectItem = caseClassifyOptions.value.find(item => item.value === val)
  let newArr = []
  if (selectItem) {
    newArr.push(selectItem)
    arrToTree(newArr, tagsList.value)
    newArr = newArr[0]?.children || []
  }
  // 重新渲染案例标签
  queryForm.tagChildIds = []
  nextTick(() => {
    caseTagOptions.value = newArr
  })
}
// 获取 案例分类、案例标签 下拉选项
const getAllFilter = async () => {
  const data = await fetchListTags({ data: { blgStripLine, tagType: 5, module: 'case' } })
  tagsList.value =
    data?.map(v => ({
      value: v.tagId,
      tagId: v.tagId,
      label: v.tagName,
      tagLevel: v.tagLevel,
      parentTagId: v.parentTagId
    })) || []
  caseClassifyOptions.value = tagsList.value.filter(v => v.tagLevel === '1')
}
const toBreak = val => {
  return val?.replace(/\n/g, '<br />')
}
// 批量上下架
const upDownloadFrame = status => {
  const selection = tablePaginationRef.value.$refs.tableRef.$children[0].selection
  if (!selection.length) {
    return Message.warning('请先选择案例')
  }
  const caseIds = selection.map(v => v.id)
  const data = {
    caseIds,
    status
  }
  fetchUpOrDownStatus({ data }).then(res => {
    Message.success('操作成功')
    queryData()
  })
}
// 获取案例详情
const getCaseInfo = data => {
  return new Promise((resolve, reject) => {
    fetchDetailCase({ data }).then(res => {
      return resolve(res)
    })
  })
}
// 打开修改案例页面
const openEdit = row => {
  const { id } = row
  getCaseInfo(id).then(data => {
    data.state = 'edit'
    addAllowKeepAlive('/NewCase')
    router.push({ name: '新增案例', params: data })
  })
}
// 打开预览页面
const openPreview = row => {
  const { id } = row
  getCaseInfo(id).then(data => {
    addAllowKeepAlive('/casePreview')
    router.push({ name: '查看案例', params: data })
  })
}
// 案例下架
const upOrDownFrame = (row, status) => {
  const { id } = row
  const data = {
    caseIds: [id],
    status
  }
  fetchUpOrDownStatus({ data }).then(res => {
    Message.success(status === 'up' ? '上架成功' : '下架成功')
    queryData()
  })
}
// 导出案例
const downCase = () => {
  const data = _formatSendParams(queryForm)
  fetchExportCaseInfoList({ data })
}
// 生成二维码
const openCode = row => {
  const { id } = row
  codeVisible.value = true
  const text = `${process.env.VUE_APP_WEB}#/case-detail?caseId=${id}`
  nextTick(() => {
    new QRCode(ercode.value, {
      text,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff'
    })
  })
}
// 二次提示
const _downloadCourseTip = list => {
  return new Promise((resolve, reject) => {
    MessageBox.confirm(`此案例共有${list.length}个课件，是否确认下载？`, '提示', {
      confirmButtonText: '确定',
      showCancelButton: true,
      cancelButtonClass: 'cancel',
      customClass: 'loginTimeout'
    })
      .then(() => {
        return resolve()
      })
      .catch(() => {
        return reject()
      })
  })
}
// 课件下载
const exportCourses = async row => {
  // TODO: 接口对接
  try {
    await _downloadCourseTip(row.coursewareList)
    for (let i = 0; i < row.coursewareList.length; i++) {
      downloadFile(row.coursewareList[i].udmpId)
    }
  } catch (error) {}
}
// 弹框关闭后清除二维码
const handleClose = () => {
  ercode.value.innerHTML = ''
  codeVisible.value = false
}
// 跳转到案例报表
const gotoCaseReport = ({ id } = {}) => {
  addAllowKeepAlive('/caseReport')
  const params = { id: id }
  router.push({ name: '案例报表', params })
}
// 更新案例优秀案例状态
const updatePerfectStatus = row => {
  const { id } = row
  const data = id
  fetchUpdatePerfect({ data }).then(res => {
    Message.success('操作成功')
    queryData()
  })
}
const sortChange = ({ order }) => {
  if (order === 'ascending') {
    queryForm.order = 'created_date_asc'
  } else if (order === 'descending') {
    queryForm.order = 'created_date_desc'
  } else {
    queryForm.order = ''
  }
  queryData()
}
// 设置数据为空时的方法
const setEmptyContent = n => {
  if (n) {
    nextTick(() => {
      const emptyEle = multipleCascaderRef.value.popperElm.querySelector('.el-cascader-menu__empty-text')
      if (emptyEle) {
        emptyEle.innerText = '请先选择分类'
      }
    })
  }
}
// 大零售超管可见纳入优秀案例
isLSSuperAdmin.value = store.state.userInfo.roleIds.includes('10000')
onMounted(() => {
 getAllFilter()
  multipleCascaderRef.value.$el.querySelector('.el-input').style.width = '350px'
})
onActivated(() => {
  queryData()
})
</script>
<script>
export default {
  name: 'CaseManagement'
}
</script>
<style lang="scss" scoped>
.CaseCenter__CaseManagement__logo {
  position: absolute;
  width: 40px;
  height: 40px;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
}
</style>
