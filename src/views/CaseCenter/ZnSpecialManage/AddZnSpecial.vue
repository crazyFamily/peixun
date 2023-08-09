<template>
  <div class="CaseCenter__addZnSpecial">
    <!-- form 内容 -->
    <div class="content-box">
      <el-form ref="formRef" class="content-form" :model="queryForm" :rules="queryFormRule" label-width="48px">
        <el-form-item label="专题名称" prop="zoneName">
          <el-input maxlength="50" show-word-limit placeholder="请输入" v-model="queryForm.zoneName"></el-input>
        </el-form-item>
        <el-form-item label="专题简介" prop="desc">
          <el-input
            class="h-90"
            resize="none"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入"
            v-model="queryForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传海报" prop="zoneImgUrlId">
          <div class="df">
            <gc-upload single :size="500" width="345" height="110" :udmpId.sync="queryForm.zoneImgUrlId"></gc-upload>
            <div class="tintColor ml10">
              <p>1.建议图片尺寸为（345*110px），可按比例调整尺寸</p>
              <p>2.格式为jpg或png</p>
              <p>3.图片不能大于500KB</p>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="知鸟课程" required>
          <div>
            <el-button type="text" @click="addCourse">新增</el-button>
            <el-button type="text" @click="openImport = true">批量导入</el-button>
            <template v-if="!courseListIsEdit">
              <el-button type="text" @click="editAll">编辑全部</el-button>
            </template>
            <template v-else>
              <el-button type="text" @click="editAllCanel">取消</el-button>
              <el-button type="text btn-save" @click="editAllSave">保存</el-button>
            </template>
          </div>
          <table-pagination
            drop
            row-key="iid"
            :list="courseColumn"
            :tableList="courseList"
            :queryForm="courseQuery"
            :getList="noop"
            ref="tablePaginationRef"
            tableClass="general__table table-left"
            hidePagination
            class="special-table-container"
          >
            <el-table-column label="" min-width="40">
              <template>
                <i class="el-icon-rank drop"></i>
              </template>
            </el-table-column>
            <el-table-column min-width="40" label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程ID" min-width="100">
              <template slot-scope="scope">
                <el-input ref="znCourseIdRef" v-if="courseListIsEdit || scope.row.isEdit" v-model="scope.row.znCourseId" placeholder="请输入课程Id,必填" maxlength="20" />
                <span v-else>{{ scope.row.znCourseId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程名称(100字以内)" min-width="100">
              <span slot="header">
                课程名称<span style="color:#999;"> (100字以内) </span>
              </span>
              <template slot-scope="scope">
                <el-input ref="znCourseNameRef" v-if="courseListIsEdit || scope.row.isEdit" v-model="scope.row.znCourseName" placeholder="请输入课程名称,必填" maxlength="100" />
                <span v-else>{{ scope.row.znCourseName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="课程简介(200字以内)" min-width="100">
              <span slot="header">
                课程简介<span style="color:#999;"> (200字以内) </span>
              </span>
              <template slot-scope="scope">
                <el-input ref="znCourseDescRef" v-if="courseListIsEdit || scope.row.isEdit" v-model="scope.row.znCourseDesc" placeholder="请输入课程简介,必填" maxlength="200" />
                <span v-else>{{ scope.row.znCourseDesc }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120">
              <span slot="header">
                    操作
                    <el-tooltip effect="light" popper-class="table-popper" placement="top" >
                      <i class="el-icon-question active"></i>
                      <div class="tips-container" slot="content">
                          <p class="tips-content">
                          1、图片建议尺寸为：345*110px, 可按比例调整
                          </p>
                          <p class="tips-content">
                          2、图片支持JPG、NPG格式，不大于200KB
                          </p>
                      </div>
                    </el-tooltip>
              </span>
              <template slot-scope="scope">
                <el-button type="text" @click="delCourse(scope)">删除</el-button>
                <span class="active" style="display: inline-block;">
                  <gc-fileInput :size="200 * 1024" msgSizeLimit="200KB" accept=".jpg,.png" @change="courseImgUploadChange($event, scope)" width="auto">
                    <el-button type="text" :loading="scope.row.isLoading">上传封面</el-button>
                  </gc-fileInput>
                </span>
                <span v-if="scope.row.isEdit" class="active" @click="saveCourseRow(scope)" style="margin-left: 10px;">保存</span>

                <el-button type="text" v-if="scope.row.udmpId" @click="openCourseImgDialog(scope.row)">
                  <img src="@/assets/images/file-icon.svg" />
                </el-button>
              </template>
            </el-table-column>
          </table-pagination>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="canel">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submit" :loading="submitLoading">确定</el-button>
    </div>
    <!-- 批量导入dialog -->
    <InstructorBatchImport
      title="知鸟课程专题-课程批量上传"
      :visible.sync="openImport"
      @change="importChange"
      @templateDownload="downloadAdapter({ templateCode: 'ZN_SPECIAL_COURSE_MANAGE' })"
      @comfirm="importComfirm"
      @close="importClose"
    >
      <div v-if="importData.title">
        <p>{{importData.title}}</p>
        <p v-for="error in importData.failStrList" :key="error" class="error-color">{{ error }}</p>
      </div>
    </InstructorBatchImport>
  <el-dialog title="课程封面预览" :visible.sync="isOpenCourseImg">
    <el-image style="border:1px solid #d0d0d0;" :src="courseImgUrl" lazy></el-image>
  </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddZnSpecial'
}
</script>
<script setup>
import { ref, reactive, computed, watch, onMounted, onActivated, nextTick } from 'vue'
import { fetchSaveOrUpdateZnZone, fetchBatchCheckZnCourse } from '@/fetch/caseCenter'
import { uploadFile, handleUdmpHref, downloadAdapter, hintFrame, uuid } from '@/util/utils'
import { noop, CopyObj } from '@/util/utils'
import { Message } from 'element-ui'
import { fetchCourseImgUpload } from '@/fetch/public'

// 表单原始数据
const originForm = {
  zoneId: '',
  zoneName: '',
  zoneImgUrlId: '',
  desc: '',
  znCourseList: []
}
const formRef = ref(null)
let queryForm = reactive(originForm)
const queryFormRule = reactive({
  zoneName: [{ required: true, message: '请填写专题名称' }],
  desc: [{ required: true, message: '请填写简介' }]
})
// 课程列表
const courseList = ref([])

const props = defineProps({
  compData: {
    type: Object,
    default: () => {}
  }
})
// 监听
watch(
  () => props.compData,
  n => {
    // console.log('watch:compData', n, n.zoneId)
    // _initData(n)
    if (n.zoneId) {
      _initData(n)
    } 
    else {
      _initData({
        zoneId: '',
        zoneName: '',
        zoneImgUrlId: '',
        desc: '',
        znCourseList: []
      })
      // _initData(n)
      nextTick(() => {
        formRef.value.clearValidate()
      })
    }
  },
  {
    // deep: true,
    immediate: true
  }
)

function _initData(compData) {
  queryForm.zoneId = compData.zoneId
  queryForm.zoneName = compData.zoneName
  queryForm.zoneImgUrlId = compData.zoneImgUrlId
  queryForm.desc = compData.desc
  // 课程列表
  queryForm.znCourseList = compData.znCourseList

  if (compData?.znCourseList) {
    courseList.value = CopyObj(
      compData.znCourseList.map(m => {
        m.isLoading = false // 是否在上传中
        m.iid = uuid()
        return m
      }) || []
    )
  }
  console.log(queryForm)
}

// 注册事件
const emits = defineEmits(['changeComp'])
// 取消

function canel() {
  emits('changeComp', { flag: 'list', data: {} })
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
// 提交
const submitLoading = ref(false)
function submit() {
  formRef.value.validate((valid) => {
    if (!valid) return
    // 添加记录时，不需要提供 zoneId 字段
    if (!queryForm.zoneId) {
      Reflect.deleteProperty(queryForm, 'zoneId')
    }
    submitLoading.value = true
    queryForm.znCourseList = courseList.value
    fetchSaveOrUpdateZnZone({ condition: queryForm }).then(res => {
      // 返回列表页面
      formRef.value.clearValidate()
      emits('changeComp', { flag: 'list', data: {} })
    }).finally(e => {
      submitLoading.value = false
    })
  })
}

// ====================== 课程 ======================
// 课程列表状态
const courseListIsEdit = ref(false)
const courseColumn = [
  { slot: 'dropContainer' },
  // { slot: 'dropContainer' },
  // { label: '序号', type: 'index', width: '60' }
]

const courseQuery = reactive({
  total: 0,
  currPage: 1,
  pageSize: 10
})
// 添加课程
function addCourse() {
  if (courseList.value.some(m => m.isEdit)) {
    Message.warning('有记录未保存，不能添加新记录！')
    return
  }
  courseList.value.push({
    isLoading: false,
    isEdit: true,
    iid: uuid()
  })
}
// 删除单个课程
function delCourse(scope) {
  if (scope.row.znCourseId) {
    hintFrame('确认要删除此记录吗？').then(() => {
      courseList.value.splice(scope.$index, 1)
    })
  } else {
    courseList.value.splice(scope.$index, 1)
  }
}
// 保存记录
const msgMapping = {
  'znCourseId': '请输入课程编号！',
  'znCourseName': '请输入课程名称！',
  'znCourseDesc': '请输入课程简介！',
}
const znCourseIdRef = ref(null)
const znCourseNameRef = ref(null)
const znCourseDescRef = ref(null)
function saveCourseRow(scope) {
  const { row } = scope

  if (row) {
    let validFieldNum = 0
    for (let field in msgMapping) {
      if (!row[field]) {
        validFieldNum ++
        Message.warning(msgMapping[field])
        // 聚
        if (field === 'znCourseId') znCourseIdRef.value.focus()
        else if (field === 'znCourseName') znCourseNameRef.value.focus()
        else if (field === 'znCourseDesc') znCourseDescRef.value.focus()
        break
      }
    }
    if (validFieldNum === 0) {
      courseList.value[scope.$index].isEdit = false
    }
  }
}
// 编辑全部
let courseListBak = []
function editAll() {
  courseListIsEdit.value = true
  courseListBak = CopyObj(courseList.value)
}

// 编辑全部 - 取消
function editAllCanel() {
  courseListIsEdit.value = false
  courseList.value = courseListBak
  console.log(courseList.value)
}
// 编辑全部 - 保存
function editAllSave() {
  // 验证必填
  let validFieldNum = 0
  for (let i in courseList.value) {
    const row = courseList.value[i]
    for (let field in msgMapping) {
      if (!row[field]) {
        validFieldNum ++
        Message.warning(msgMapping[field])
        // 聚
        // if (field === 'znCourseId') znCourseIdRef.value.focus()
        // else if (field === 'znCourseName') znCourseNameRef.value.focus()
        // else if (field === 'znCourseDesc') znCourseDescRef.value.focus()
        break
      }
    }
    if (validFieldNum > 0) {
      break
    }
  }
  if (validFieldNum === 0) {
    courseListIsEdit.value = false
  }
  console.log(courseList.value)
}
const isOpenCourseImg = ref(false)
const courseImgUrl = ref('')
function openCourseImgDialog (row) {
  courseImgUrl.value =handleUdmpHref(row.udmpId)
  isOpenCourseImg.value = true
}

// ====================== 课程 ：批量导入 ======================
// 选择文件
const openImport = ref(false)
const importData = ref({})
const importState = ref(0) // 0: 未上传，1：上传中，2：已上传
const importComfirmBtnText = computed(() => {
  return importState == 1 ? '上传中' : '确认'
})
function importChange($event) {
  importState.value = 1
  const file = $event.target.files[0]
  // 删除文件
  if (!file?.name) {
    importData.value = {}
  } else {
    //新增文件
    const data = new FormData()
    data.append('file', file)
    fetchBatchCheckZnCourse(data).then(resData => {
      importData.value = resData
    })
    .finally(() => {
      importState.value = 2
    })
  }
}
// 导入确认
function importComfirm() {
  const sucessList = importData.value.succeList || []
  if (sucessList.length) {
    const sList = sucessList.map(m => {
      return {
        iid: uuid(),
        isLoading: false,
        isEdit: false,
        znCourseId: m.znCourseId,
        znCourseName: m.znCourseName,
        znCourseDesc: m.znCourseDesc
      }
    })
    courseList.value.push(...sList)
    console.log(courseList.value)
  }
  openImport.value = false

}
function importClose() {
  importData.value = {}
  openImport.value = false
}
// 上传封面
function courseImgUploadChange($event, scope) {
  const file = $event.target.files[0]
  if (!file) return

  const rowIndex = scope.$index
  const row = scope.row
  courseList.value[rowIndex].isLoading = true

  uploadFile({ files: file })
    .then(res => {
      const { code, data } = res.data
      if (code === 0) {
        courseList.value[rowIndex].udmpId = data[0].udmpId
      }
    })
    .finally(() => {
      courseList.value[rowIndex].isLoading = false
    })
}
</script>

<style lang="scss" scoped>
.CaseCenter__addZnSpecial {
  padding-top: 40px;
  background-color: #fff;
  .content-form {
    width: 648px;
    margin: 0 auto 60px;
    .table-pagination {
      position: relative;
      width: 800px;
      left: -58px;
      margin-top: 20px;
    }
  }

  .el-input__suffix {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .special-table-container {
    :deep(.el-table__body-wrapper) {
      max-height: 520px;
      overflow-y: auto;
    }
  }
  .tips-container {
    line-height: 20px;
    color: #888;
    padding: 0 10px;
  }
  .btn-save {
    margin-left:-10px !important;
  }
}
</style>
