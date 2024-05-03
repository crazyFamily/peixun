<template>
  <div>
    <el-card class="search-card mt10">
      <el-form :model="queryForm" inline ref="querFormRef" label-width="90px">
        <el-form-item label="所属机构">
          <gc-institution
            v-model="queryForm.orgIds"
            :left-show="true"
            :default-show="false"
            ref="institutionRef"
          ></gc-institution>
        </el-form-item>
        <el-form-item label="课程信息">
          <el-input class="w-200" v-model.trim="queryForm.courseId" placeholder="课程ID/课程名称" clearable />
        </el-form-item>
        <el-form-item label="制作人/更新人">
          <el-input class="w-200" v-model.trim="queryForm.courseDevoloppersonUm" placeholder="姓名/UM号" />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            class="w-120 clearable-data-pick"
            v-model="queryForm.startDate"
            type="date"
            placeholder="开始时间"
            :clearable="true"
            :picker-options="startPickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span class="ml10 mr10">至</span>
          <el-date-picker
            class="w-120 clearable-data-pick"
            v-model="queryForm.endDate"
            type="date"
            placeholder="结束时间"
            :clearable="true"
            :picker-options="endPickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDataList()">查询</el-button>
          <el-button @click="resetDataList()">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="openImportForm" v-if="hasCourseModule">
          <i class="instructor-icons__add__icon"></i>
          导入知鸟课程
        </span>
        <span class="instructor-icons__del" @click="deleteHandle" v-if="hasCourseModule">
          <i class="instructor-icons__del__icon"></i>
          删除
        </span>
        <span class="instructor-icons__download" @click="exportDataList()">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="columnList"
        :tableList="dataList"
        :queryForm="queryForm"
        :getList="queryDataListFormat"
        @selection-change="selectDataList"
        v-loading="getLoadingStatus('LOADING_LIST_ZN_COURSE')"
        ref="tablePaginationRef">
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active mr10" @click="openUploadCase(scope.row)">上传课件</span>
              <span class="item active mr10" @click="openViewFile(scope.row, 'view')">查看课件</span>
              <span class="item active mr10" @click="openBaseForm(scope.row, 'view')" v-if="hasCourseModule">编辑</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 批量导入弹框 -->
    <ImportModel
      :show="importFormShow"
      :faildColumns="importFaildColumns"
      :importFetchFn="fetchImportZnCourse"
      :faildExportFetchFn="fetchExportFailZnCourse"
      @showChange="importFormShow = $event"
      templateCode="ZN_COURSE_ADD_BATCH"
      @comfirm="comfirmImportForm"
    ></ImportModel>
    <!-- 上传课件弹框 -->
    <UploadModel width="1000px" title="上传课件"
      :show="uploadCaseShow"
      :uploadParams="uploadParams"
      :originalList="uploadForm.znCoursewareList"
      @update:show="closeUploadCase"
      @comfirm="comfirmUploadCase"
      ref="uploadModelRef">
      <el-form :model="uploadForm" :rules="uploadFormRules" ref="uploadFormRef">
        <el-form-item label="是否开放下载" prop="allowDownloads">
          <gc-select 
            class="w-200" 
            :options="[{ value: 'Y', label: '是' }, { value: 'N', label: '否' }, ]" 
            v-model="uploadForm.allowDownloads"
          ></gc-select>
        </el-form-item>
      </el-form>
    </UploadModel>
    <!-- 查看课件弹框 -->
    <gc-model title="查看课件" :visible="viewFileShow" width="900px" top="5vh"
      cancelText=""
      comfirmText="关闭"
      @close="closeViewFile" 
      @comfirm="closeViewFile">
      <el-form :model="viewFileForm" ref="importFormRef">
        <el-form-item label="是否开放下载" prop="classId">
          <el-switch v-model="viewFileForm.allowDownloads" 
            active-color="#e4e7ed" inactive-color="#fd6720"
            active-text="否" inactive-text="是" 
            active-value="N" inactive-value="Y"
            disabled
          ></el-switch>
        </el-form-item>
      </el-form>
      <gc-table
        class="general__table"
        :list="viewFileColumnList"
        :tableList="viewFileForm.znCoursewareList">
       <el-table-column label="操作" width="105px" fixed="right" v-if="viewFileForm.allowDownloads === 'Y'">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active mr10" @click="handleDownloadFile(scope.row)">下载</span>
            </div>
          </template>
        </el-table-column>
      </gc-table>
    </gc-model>
    <!-- 编辑弹框 -->
    <gc-model title="编辑" :visible="baseFormShow" width="600px"
      :comfirmLoading="baseFormSubmiting"
      @close="baseFormShow = false" 
      @cancel="baseFormShow = false" 
      @comfirm="comfirmBaseForm">
      <el-form ref="baseFormRef" :model="baseForm" :rules="baseFormRules" label-width="120px">
        <el-form-item label="课程ID :">
          <span>{{baseForm.courseId}}</span>
        </el-form-item>
        <el-form-item label="课程名称 :" prop="applyReason">
          <span>{{baseForm.courseName}}</span>
        </el-form-item>
        <el-form-item label="制作人 :" prop="delayDate">
          <span>{{baseForm.courseDevoloppersonNameStr}}</span>
        </el-form-item>
        <el-form-item label="课件上传负责人 :" prop="courseUploadUm">
          <gc-select
            class="w-full"
            filterable
            remote
            placeholder="请输入UM号"
            v-model="baseForm.courseUploadUm"
            :options="umOptions"
            :remote-method="getUmInfo"
            :loading="umLoading"
          ></gc-select>
        </el-form-item>
      </el-form>
    </gc-model>
  </div>
</template>
<script>
export default {
  name: 'CurriculumStorageManagementNew'
}
</script>
<script setup>
import { ref, onMounted, watch, nextTick, reactive, computed } from 'vue'
import { filterBusiType, customHint, tableSelectionChange, CopyObj, addAllowKeepAlive, downloadFileByAut, downloadFileAsAlink } from '@/util/utils'
import { Message } from 'element-ui'
import { usePageList } from '@/hooks/usePageList'
import store from '@/store'
import { ROLE_CODE } from '@/util/constants'
import ImportModel from '@/components/upload/ImportModel'
import UploadModel from '@/components/upload/UploadModel'
import { fetchUserInfos } from '@/fetch/public'
import {
  fetchListZnCourse,
  fetchExportZnCourse,
  fetchUpdateCourseUploader,
  fetchImportZnCourse,
  fetchHandleZnCourse,
  fetchExportFailZnCourse,
  fetchDeleteZnCourse,
  fetchSaveZnCourseware,
  fetchFindZnCourseware
} from '@/fetch/curriculumManagement'
import { COURSE_UPLOAD_STATUS_OPTIONS } from './enum'
import { useRouter, useRoute } from '@/router'
import { fileDownload } from '@/util/udmp'

const router = useRouter()

// 是否有“根节点的课程管理员”权限
const hasCourseModule = computed(() => store.state.userInfo.isHaveCourseModule === 'Y')

const baseQueryForm = {
  courseId: '', // 课程Id
  orgIds: [],
  blgStripLine: '',
  orgId: '', // 所属机构
  courseDevoloppersonUm: '', // 制作人/更新人
  startDate: '', // 创建时间
  endDate: ''
}

const {
  tableFilterSetting,
  getLoadingStatus,
  queryForm,
  dataList,
  tablePaginationRef,
  selectedList,
  selectDataList,
  queryDataListFormat,
  queryDataList,
  resetDataList,
  exportDataList,
  deleteDataList,
  dataRangeRules
} = usePageList({
  baseQueryForm,
  apiDataList: fetchListZnCourse,
  apiExportDataList: fetchExportZnCourse,
  queryFormFormat: (params) => {
    params.blgStripLine = params.orgIds.length ? params.orgIds[0]: ''
    params.orgId = params.orgIds.length ? params.orgIds[1]: ''
    return params
  }
})

const { startPickerOptions, endPickerOptions } = dataRangeRules('startDate', 'endDate')

const columnList = [
  { type: 'selection', fixed: 'left'},
  { label: '课程ID', width: '100', prop: 'courseId' },
  { label: '课程名称', width: '180', prop: 'courseName' },
  { label: '所属机构', width: '180', prop: 'orgName' },
  { label: '制作人', width: '180', prop: 'courseDevoloppersonNameStr' },
  { label: '创建时间', width: '150', prop: 'znCreatedDate' },
  { label: '更新时间', width: '150', prop: 'updatedDate' },
  { label: '更新人', width: '150', prop: 'updatedNameStr' },
  { label: '课程上传负责人', width: '150', prop: 'courseUploadUmNameStr' },
  { label: '课程上传状态', prop: 'courseUploadStatusStr', width: 120,
    ...tableFilterSetting('courseUploadStatus', COURSE_UPLOAD_STATUS_OPTIONS, false) },
]

// 批量删除（后端验证）
function deleteHandle () {
  if (!selectedList.value.length) {
    return Message.warning('请选择要删除的记录')
  }
  customHint('确认要删除所选记录吗？', '提示', '取消')
  .then(async () => {
    const ids = selectedList.value.map(m => String(m.id))
    const res = await fetchDeleteZnCourse(ids)
    Message.success('删除成功')
    queryDataList()
  })
}

// ============================== 导入知鸟课程 ==============================
const importFormShow = ref(false)
// 导入失败数据列表
const importFaildColumns = [
  { label: '课程Id', prop: 'courseId', width: '150px' },
  { label: '失败原因', prop: 'msg', width: '200px' }
]
// 打开导入弹框
function openImportForm () {
  importFormShow.value = true
}
// 导入确认
async function comfirmImportForm (data) {
  console.log(data)
  await fetchHandleZnCourse({ successList: data.successList, tip: 'Y' })
    importFormShow.value = false
    queryDataList()
    Message.success('导入成功！')
}
// ============================== 上传课件 ==============================
const uploadCaseShow = ref(false)
const uploadParams = ref({})
const uploadFormBase = {
  id: '',
  allowDownloads: '',
  znCoursewareList: []
}
const uploadForm = ref(CopyObj(uploadFormBase))
const uploadFormBak = ref({})
const uploadFormRules = {
  allowDownloads: [{ required: true, message: '请选择', trigger: 'change' }]
}
// 打开导入弹框
async function openUploadCase (row) {
  uploadParams.value = {
    module: 'fosterSubject',
    submodule: 'attach',
    courseId: row.courseId
  }
  if (row.courseUploadStatus === 'Y') {
    const res = await fetchFindZnCourseware({id: row.id, isSave: 'Y'})
    uploadForm.value = res
  } else {
    uploadForm.value.id = row.id
    uploadForm.value.allowDownloads = ''
    uploadForm.value.znCoursewareList = []
  }
  uploadFormBak.value = CopyObj(uploadForm.value)
  uploadCaseShow.value = true
  nextTick(() => {
    uploadFormRef.value?.clearValidate()
  })
}
const uploadModelRef = ref(null)
function uploadFormIsChange (newFileList) {
  if (uploadFormBak.value.allowDownloads !== uploadForm.value.allowDownloads) return true
  if (uploadFormBak.value?.znCoursewareList.length !== newFileList.length) return true
  for (let i = 0; i<newFileList.length; i++) {
    return uploadForm.value.znCoursewareList[i].udmpId !== newFileList[i].udmpId
  }
}
async function closeUploadCase (value, fileList) {
  const isChange = uploadFormIsChange(fileList)
  console.log('isChange', isChange)
  if (isChange) {
    await customHint('当前信息未保存，是否确认【取消】？', '提示', '取消' )
    uploadCaseShow.value = false
  } else {
    uploadCaseShow.value = false
  }
  uploadForm.value = CopyObj(uploadFormBase)
  uploadModelRef.value.reset()
}
// 上传确认
const uploadFormRef = ref(null)
function comfirmUploadCase (fileList) {
  uploadFormRef.value.validate(async (valid) => {
    if (!valid) return 
    const params = {
      id: uploadForm.value.id,
      allowDownloads: uploadForm.value.allowDownloads,
      znCoursewareList: fileList.map(m => ({
        udmpId: m.udmpId,
        fileName: m.fileName,
        sizes: m.sizes
      }))
    }
    await fetchSaveZnCourseware(params)
    uploadCaseShow.value = false
    uploadModelRef.value.reset()
    queryDataList()
    if (fileList?.length) {
      Message.success('课件上传成功！')
    } else {
      Message.success('保存成功！')
    }
  })
}
// ============================== 查看课件 ==============================
const allowDownloads = ref('')
const viewFileShow = ref(false)
const viewFileForm = ref({
  allowDownloads: '',
  znCoursewareList: []
})

const viewFileColumnList = [
  { type: 'index', label: '序号' },
  { label: '文件名称', prop: 'fileName', width: '180px' },
  { label: '文件大小', prop: 'fileSize', width: '80px' },
  { label: '上传人', prop: 'createdByName', width: '150px' },
  { label: '上传时间', prop: 'createdDate', width: '150px' },
]

function openViewFile (row, type) {
  fetchFindZnCourseware({id: row.id, isSave: 'N'}).then(res => {
    const mbValue = 1024 * 1024
    res.znCoursewareList.forEach(item => {
      item.sizes = item.fileSize
      item.fileSize = item.sizes >= mbValue ? (item.sizes / mbValue).toFixed(1)+'MB' : Math.round(item.sizes / 1024 )+'KB'
    })
    viewFileForm.value = res
  })
  viewFileShow.value = true
}
function closeViewFile () {
  viewFileShow.value = false
}

// 下载文件
async function handleDownloadFile (row) {
  try {
    downloadFileAsAlink(await fileDownload(row.udmpId))
  } catch (error) {}
}

// ============================== 编辑记录 ==============================

const baseFormShow = ref(false)
const baseFormSubmiting = ref(false)
const baseFormBase = {
  id: '',
  courseId: '', // 课程ID
  courseName: '', // 课程名称
  courseDevoloppersonNameStr: '', // 制作人
  courseDevolopperson: [], // 制作人 - 数组
  courseUploadUm: '', // 课件上传负责人
}
const baseForm = ref(CopyObj(baseFormBase))
const baseFormRef = ref(null)
const baseFormRules = {
  courseUploadUm: [{ required: true, message: '请选择课件上传负责人', trigger: 'change' }]
}
function getCourseDevoloppersonArr ({ courseDevolopperson, courseDevoloppersonName }) {
  const res = []
  const umArr = courseDevolopperson.split(',')
  const nameArr = courseDevoloppersonName.split(',')
  umArr.forEach((um,i) => {
    res.push(`${nameArr[i]}(${um})`)
  })
  return [res, res.toString()]
}
function openBaseForm (row, type) {
  const [personArr, personStr] = getCourseDevoloppersonArr(row)
  baseForm.value = {
    id: row.id,
    courseId: row.courseId,
    courseName: row.courseName,
    courseDevoloppersonNameStr: personStr,
    courseDevolopperson: personArr,
    courseUploadUm: row.courseUploadUm,
  }
  getUmInfo(row.courseUploadUm)
  nextTick(() => {
    baseFormRef.value?.clearValidate()
    baseFormShow.value = true
  })
}

const umOptions = ref([])
const umLoading = ref(false)
function getUmInfo (value) {
  if (value !== '') {
    umLoading.value = true
    const data = { empName: value }
    fetchUserInfos({ data })
    .then(resData => {
      umLoading.value = false
      resData.list?.forEach((v) => {
        v.value = v.umId
        v.label = `${v.empName} (${v.umId}) -- ${v.blgOrgName}`
      })
      umOptions.value = resData.list
    })
  } else {
    umOptions.value = [];
  }
}

function comfirmBaseForm () {
  baseFormRef.value.validate(async valid => {
    if (valid) {
      baseFormSubmiting.value = true
      try { 
        const params = {
          id: baseForm.value.id,
          courseUploadUm: baseForm.value.courseUploadUm,
        }
        await fetchUpdateCourseUploader(params)
        baseFormShow.value = false
        queryDataList()
        baseFormSubmiting.value = false
      } catch (_) {
        baseFormSubmiting.value = false
      }
    }
  })
}

// ============================== 初始化 ==============================
onMounted(async () => {
  queryDataList()
})
</script>

<style lang="scss" scoped>
.gc-select {
  padding: 0px;
}

.delay-user-form-item {
  display: flex;
  margin-bottom: 10px;
  :deep(.el-form-item__content) {
    flex: 1;
  }
}
</style>