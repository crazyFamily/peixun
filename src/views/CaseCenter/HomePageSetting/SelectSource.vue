<template>
  <gc-model
    title="选择资源"
    width="1150px"
    top="5vh"
    class="add-item-dialog"
    :visible="isOpen"
    :show-close="false"
    @cancel="close"
    @comfirm="comfirm"
  >
    <div class="form-container">
      <el-tabs v-model="activeName" class="nav-tab" @tab-click="tabSwitch">
        <el-tab-pane v-for="item in navTabInfo" :key="item.name" :label="item.label" :name="item.name" />
      </el-tabs>
      <div class="content-list-container">
        <!-- Tab: 功能模块 -->
        <div class="function-list-container" v-show="activeName === 'function'">
          <div class="list-content">
            <div @click="handleSelectItem({index:index, row:fun})" 
              class="fun-item" :class="{active: selectItemIndex == index}" v-for="(fun,index) in functionDataList" :key="fun.code">
              <div class="content">
                <div class="fun-icon">
                  <img :src="fun.iconUrl" />
                </div>
                <div>
                  <div class="fun-name">{{fun.label}}</div>
                  <div class="fun-desc">{{fun.desc}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Tab: 链接地址 -->
        <div class="link-list-container" v-show="activeName === 'link'">
          <el-form :model="queryLinkForm" :rules="linkFormRules" label-width="100px" inline ref="linkFormRef">
            <el-form-item class="link-item" label="是否启用跳转" prop="ifValid">
              <el-switch v-model="queryLinkForm.ifValid"></el-switch>
            </el-form-item>
            <el-form-item class="link-item" label="标题" prop="moduleName">
              <el-input
                v-model="queryLinkForm.moduleName"
                placeholder="请输入标题内容，非必填"
                :maxlength="maxTitleLen"
                show-word-limit
                style="width: 500px"
              ></el-input>
            </el-form-item>
            <el-form-item class="link-item" label="地址" prop="relationId">
              <el-input v-model.trim="queryLinkForm.relationId" placeholder="请输入链接地址" style="width: 500px"></el-input>
            </el-form-item>
            <el-form-item class="link-item" label="图片" prop="moduleImgId">
              <span class="red-start">*</span>
              <gc-upload
                ref="uploadRef"
                :list="linkImgUploadList"
                single
                :accept="['jpg', 'png']"
                v-model="linkImgAttachList"
                :key="isOpen"
              ></gc-upload>
              <div class="tintColor">
                <p> 1、图片建议尺寸为：345*110px, 可按比例调整 </p>
                <p> 2、图片支持JPG、NPG格式，不大于500KB </p>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- Tab: 知鸟课程专题 -->
        <div class="special-list-container" v-show="activeName === 'znSpecial'">
          <div class="form-container">
            <el-form :model="queryZnSpecialForm" inline ref="formRef">
              <el-form-item prop="searchText">
                <el-input v-model="queryZnSpecialForm.request.zoneName" placeholder="专题名称"></el-input>
              </el-form-item>
              <el-form-item prop="searchText">
                <el-input v-model="queryZnSpecialForm.request.umOrName" placeholder="创建人um或姓名"></el-input>
              </el-form-item>
              <el-form-item>
                <div class="case-search-button">
                  <el-button type="primary" @click="queryZnSpecials">查询</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="list-content">
            <list-pagination
              :pageSizes="[6,12]"
              :data="znSpecialDataList"
              :queryForm="queryZnSpecialForm"
              :getList="getZnSpecialDatas"
              :selectItemIndex="selectItemIndex"
              @selectItem="handleSelectItem"
              v-slot="slotProps"
              ref="listPagination"
            >
              <div>
                <img class="item-img" :src="slotProps.item.zoneImgUrl" alt />
                <div class="title">
                  <p class="line1">
                    <span>{{ slotProps.item.zoneName }}</span>
                    <span>{{ slotProps.item.znCourseNumber }}</span>
                  </p>
                  <p class="line2">{{ slotProps.item.createByName }} {{ slotProps.item.createDate }}</p>
                </div>
              </div>
            </list-pagination>
          </div>
        </div>
        <!-- Tab: 案例专题 -->
        <div class="special-list-container" v-show="activeName === 'caseSpecial'">
          <div class="form-container">
            <el-form :model="querySpecialForm" inline ref="formRef">
              <div class="between-noc">
                <div>
                  <el-form-item prop="zoneType">
                    <el-radio-group v-model="querySpecialForm.zoneType" size="small" @change="querySpecials">
                      <el-radio-button label="case">普通专题</el-radio-button>
                      <el-radio-button label="caseEva">评分专题</el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item prop="searchText">
                    <el-input v-model="querySpecialForm.searchText" placeholder="专题名称/创建人"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <div class="case-search-button">
                      <el-button type="primary" @click="querySpecials">查询</el-button>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div class="list-content">
            <list-pagination
              :pageSizes="[6,12]"
              :data="specialDataList"
              :queryForm="querySpecialForm"
              :getList="getSpecialDatas"
              :selectItemIndex="selectItemIndex"
              @selectItem="handleSelectItem"
              v-slot="slotProps"
              ref="listPagination">
              <div>
                <img class="item-img" :src="slotProps.item.zoneImgUrl" alt />
                <div class="title">
                  <p class="line1">
                    <span>{{ slotProps.item.zoneName }}</span>
                    <span>{{ slotProps.item.caseNumber }}</span>
                  </p>
                  <p class="line2">{{ slotProps.item.createByName }} {{ slotProps.item.createDate }}</p>
                </div>
              </div>
            </list-pagination>
          </div>
        </div>
        <!-- Tab: 案例 -->
        <div class="case-list-container" v-show="activeName === 'case'">
          <div class="form-container">
            <el-form :model="queryCaseForm" inline ref="caseFormRef">
              <el-form-item prop="caseInfo">
                <el-input v-model="queryCaseForm.caseInfo" placeholder="案例名称/ID"></el-input>
              </el-form-item>
              <el-form-item prop="caseAuthor">
                <el-input v-model="queryCaseForm.caseAuthor" placeholder="案例制作人/分享人"></el-input>
              </el-form-item>
              <el-form-item prop="caseAuthor">
                <gc-institution v-model="queryCaseForm.orgIds" />
                <!-- <gc-institution
                  v-model="queryCaseForm.orgIds"
                  busiType="LS"
                  :left-show="false"
                  :default-show="false"
                  ref="institutionRef"
                ></gc-institution>-->
              </el-form-item>
              <el-form-item>
                <div class="case-search-button">
                  <el-button type="primary" @click="queryCases">查询</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="list-content">
            <list-pagination
              :pageSizes="[14, 28]"
              :data="caseDataList"
              :queryForm="queryCaseForm"
              :getList="getCaseDatas"
              :selectItemIndex="selectItemIndex"
              @selectItem="handleSelectItem"
              ref="listPagination"
            />
          </div>
        </div>
        <comp-edit-item-info
          v-if="needSelectImg"
          :show.sync="isOpenSelectItem"
          :item-info="selectItem"
          :suggest-size="suggestSize"
          @close="closeSelectItem"
          ref="editInfoRef"
        />
      </div>
    </div>
  </gc-model>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { fetchFindUpCaseList, fetchFindZoneList } from '@/fetch/homeSetting'
import { fetchFindZnZoneList } from '@/fetch/caseCenter'
import { CopyObj, getSpecialImg, noop } from '@/util/utils'
import CompEditItemInfo from './CompEditItemInfo.vue'
import ListPagination from './ListPagination'
import { Message } from 'element-ui'

const CASE_PAGE_SIZE = 14
const SPECIAL_PAGE_SIZE = 6

// 是否显示选择图片组件
const isOpenSelectItem = ref(false),
  // 当前选中行
  selectItem = ref({}), 
  // 当前选中索引
  selectItemIndex = ref(-1)

const props = defineProps({
  needSelectImg: { // 是否需要选择图片
    type: Boolean,
    default: true
  },
  suggestSize: { // 
    type: String,
    default: ''
  }
})

// -------------------------------- 打开/关闭 弹框 --------------------------------
const activeNameMapping = {
  '0' : 'caseSpecial', // 案例专题
  '1' : 'case', // 案例
  '2' : 'link', // 链接
  '3' : 'function', // 功能
  '4' : 'znSpecial', // 知鸟专题
}
const linkFormRef = ref(null)
const isOpen = ref(false)
function open(data) {
  // 打开弹框
  isOpen.value = true
  if (linkFormRef.value) {
    linkFormRef.value.clearValidate()
  }
  // 编辑时回显数据
  if (data) {
    activeName.value = activeNameMapping[data.moduleType]
    // 编辑时，链接Tab不显示选择图片层,但表单要回显数据
    if (activeName.value === 'link') {
      isOpenSelectItem.value = false
      Object.keys(data).forEach(key => {
        queryLinkForm[key] = data[key]
      })
      queryLinkForm.ifValid = data.ifValid === 'Y'
      // 图片上传回显
      linkImgAttachList.value = [ { fileName: '图片', udmpId: data.moduleImgId } ]
      linkImgUploadList.value = [ { name: '图片', url: getSpecialImg(data.moduleImgId, 'href') } ]
    } else {
      isOpenSelectItem.value = true
      selectItem.value = data
    }
    console.log('选择资源：回显数据：', data, data.moduleType, selectItemIndex.value)
  } 
  // 新增时初始化数据
  else {
    activeName.value = 'function' // 新增时打开“功能”Tab
    isOpenSelectItem.value = false
    selectItem.value = {}
  }
}

function close() {
  // 链接Tab重置
  queryLinkForm.ifValid = true
  queryLinkForm.moduleName = ''
  queryLinkForm.relationId = ''
  linkImgUploadList.value = []
  linkImgAttachList.value = []
  // 关闭弹框
  editInfoRef.value?.reset()
  selectItem.value = {}
  // 重置选中信息
  selectItemIndex.value = -1
  isOpenSelectItem.value = false
  isOpen.value = false
}

// H5的表单校验
function validateLinkForm(resultData) {
  return new Promise((resolve, reject) => {
    linkFormRef.value.validate(v => {
      if (!v) return resolve(false)
      let res = {
        ...resultData,
        ...queryLinkForm,
        moduleImgId: linkImgAttachList.value[0]?.udmpId || '',
        ifValid: queryLinkForm.ifValid ? 'Y' : 'N',
        moduleType: '2'
      }
      return resolve(res)
    })
  })
}

// 选择确认
const emits = defineEmits(['comfirm'])
const editInfoRef = ref(null)
async function comfirm () {
  let resultData = {
    ifValid: 'Y',
    moduleName: '',
    moduleImgId: '',
    moduleSequence: '',
    moduleType: '',
    relationId: '',
  }
  let editItemInfo = {}
  if (props.needSelectImg && isOpenSelectItem.value) {
    editItemInfo = editInfoRef.value.getInfoDatas()
    if (!editItemInfo) {
      return Message.warning(`请选择图片`)
    }
    const validLength = activeName.value === 'link' ? maxlength : 50 
    if (editItemInfo.moduleName.length > validLength) {
      return Message.warning(`标题不能大于${validLength}个字符`)
    }
  }
  const selectItemV = selectItem.value
  switch (activeName.value) {
    case 'function':
      if (!Object.keys(selectItemV).length) {
        return Message.warning('请选择功能')
      }
      resultData = {
        ...resultData,
        moduleImgId: selectItemV.thumbnail,
        moduleName: selectItemV.caseName,
        ...editItemInfo,
        relationId: selectItemV.code || selectItemV.relationId,
        moduleType: '3',
      }
      break
    case 'case': // 案例
      if (!Object.keys(selectItemV).length) {
        return Message.warning('请选择案例')
      }
      resultData = {
        ...resultData,
        ...selectItemV,
        moduleImgId: selectItemV.thumbnail,
        moduleName: selectItemV.caseName,
        ...editItemInfo,
        relationId: selectItemV.id || selectItemV.relationId,
        moduleType: '1'
      }
      break
    case 'znSpecial': // 知鸟案例专题
      if (!Object.keys(selectItemV).length) {
        return Message.warning('请选择专题')
      }
      resultData = {
        ...resultData,
        ...selectItemV,
        moduleImgId: selectItemV.zoneImgUrlId,
        moduleName: selectItemV.zoneName,
        ...editItemInfo,
        relationId: selectItemV.zoneId || selectItemV.relationId,
        moduleType: '4'
      }
      break
    case 'caseSpecial': // 案例专题
      if (!Object.keys(selectItemV).length) {
        return Message.warning('请选择专题')
      }
      resultData = {
        ...resultData,
        ...selectItemV,
        moduleImgId: selectItemV.zoneImgUrlId,
        moduleName: selectItemV.zoneName,
        ...editItemInfo,
        relationId: selectItemV.zoneId || selectItemV.relationId,
        moduleType: '0'
      }
      break
    case 'link':
      resultData = await validateLinkForm(resultData)
      if (!resultData) return
      resultData.moduleType = '2'
  }
  emits('comfirm', { ...resultData })
  close()
}

defineExpose({
  open
})

// -------------------------------- Tabs --------------------------------
const moduleType = '' // 模块类型:0案例专题,1案例,2链接,3功能模块,4知鸟课程专题
// 专题ID,案例ID,链接,功能模块标识（AIZNPL-AI智能陪练,XHJH-星火计划,ZNKCLB-知鸟课程列表,ZNZBLB-知鸟直播列表,ZNKSLB-知鸟考试列表,ZNWJLB-知鸟问卷列表）,知鸟课程专题ID
const relationId = '' 
const navTabInfo = [
  { label: '功能模块', name: 'function', value: '0' },
  { label: '链接地址', name: 'link', value: '1' },
  { label: '知鸟课程专题', name: 'znSpecial', value: '2' },
  { label: '案例专题', name: 'caseSpecial', value: '3' },
  { label: '案例', name: 'case', value: '4' }
]
const activeName = ref('function')
watch(
  activeName,
  n => {
    switch (n) {
      // case 'function': // 功能模块
      //   getFunctionDatas()
      //   break
      case 'case': // 案例
        getCaseDatas()
        break
      case 'caseSpecial': //  案例专题
        getSpecialDatas()
        break
      case 'znSpecial': // 专鸟课程专题专题
        getZnSpecialDatas()
        break
    }
  },
  { immediate: true }
)

// -------------------- Tab : 功能模块 --------------------
// 功能数据
// AIZNPL-AI智能陪练,XHJH-星火计划,ZNKCLB-知鸟课程列表,ZNZBLB-知鸟直播列表,ZNKSLB-知鸟考试列表,ZNWJLB-知鸟问卷列表
const functionDataList = [
  { id: 1, code: 'AIZNPL', label: 'AI智能陪练', desc: 'AI练，开口练', iconUrl: require('@/assets/svg/fun-aiznpn.svg') },
  { id: 2, code: 'XHJH', label: '星火计划', desc: '新员工培训', iconUrl: require('@/assets/svg/fun-xinghuo.svg') },
  { id: 3, code: 'ZNKCLB', label: '知鸟课程列表', desc: '知鸟推送给用户的课程列表页面', iconUrl: require('@/assets/svg/fun-znkclb.svg') },
  { id: 4, code: 'ZNZBLB', label: '知鸟直播列表', desc: '知鸟直播列表页面', iconUrl: require('@/assets/svg/fun-znzblb.svg') },
  { id: 5, code: 'ZNKSLB', label: '知鸟考试列表', desc: '知鸟推送给用户的考试列表页面', iconUrl: require('@/assets/svg/fun-znkslb.svg') },
  { id: 6, code: 'ZNWJLB', label: '知鸟问卷列表', desc: '知鸟推送给用户的问卷列表页面', iconUrl: require('@/assets/svg/fun-znwjlb.svg') },
]
// // 发起专题查询请求
// async function getFunctionDatas() {
//   let { total, list } = await fetchFindZoneList(queryFunctionForm)
//   queryFunctionForm.total = total
//   functionDataList.value = list
// }
// // 查询案例列表
// function queryFunction() {
//   queryFunctionForm.currPage = 1
//   getFunctionDatas()
// }

// -------------------- Tab : 链接地址 --------------------
const maxTitleLen = 20
const queryLinkForm = reactive({
  ifValid: true,
  moduleName: '',
  relationId: ''
})
const linkFormRules = reactive({
  ifValid: [{ required: true }],
  // moduleName: [{ required: true, trigger: 'blur', message: '请输入标题' }],
  relationId: [{ required: true, trigger: 'blur', message: '请输入地址' }],
  moduleImgId: [
    // { required: true, trigger: 'blur', message: '请上传图片' },
    {
      validator: (rule, value, callback) => {
        if (activeName.value === 'link' && !linkImgAttachList.value.length) {
          return callback(new Error('请上传图片'))
        }
        return callback()
      }
    }
  ]
})
const linkImgUploadList = ref([])
const linkImgAttachList = ref([])

// -------------------- Tab : 知鸟课程专题 --------------------
const queryZnSpecialForm = reactive({
  total: 10,
  page: 0,
  pageSize: SPECIAL_PAGE_SIZE,
  request: {
    zoneName: '',
    umOrName: ''
  }
})
const znSpecialDataList = ref([]) // 案例列表数据
// 发起专题查询请求
async function getZnSpecialDatas() {
  const { total, list } = await fetchFindZnZoneList(queryZnSpecialForm)
  queryZnSpecialForm.total = total
  list.forEach(m => {
    if (!m.zoneImgUrl) {
      m.zoneImgUrl = getSpecialImg()
      m.zoneImgUrlId = getSpecialImg()
    }
  })
  znSpecialDataList.value = list
}
// 查询案例列表
function queryZnSpecials() {
  queryZnSpecialForm.page = 1
  getZnSpecialDatas()
}

// -------------------- Tab : 案例专题 --------------------
const querySpecialForm = reactive({
  total: 0,
  currPage: 0,
  pageSize: SPECIAL_PAGE_SIZE,
  zoneType: 'case',
  searchText: ''
})
const specialDataList = ref([]) // 案例列表数据
// 发起专题查询请求
async function getSpecialDatas() {
  const { total, list } = await fetchFindZoneList(querySpecialForm)
  querySpecialForm.total = total
  list.forEach(m => {
    if (!m.zoneImgUrl) {
      m.zoneImgUrl = getSpecialImg()
      m.zoneImgUrlId = getSpecialImg()
    }
  })
  specialDataList.value = list
}
// 查询案例列表
function querySpecials() {
  querySpecialForm.currPage = 1
  getSpecialDatas()
}

// -------------------- Tab : 案例 --------------------
const queryCaseForm = reactive({
  total: 14,
  currPage: 0,
  pageSize: CASE_PAGE_SIZE,
  caseInfo: '',
  caseAuthor: '',
  orgIds: []
})
const caseDataList = ref([]) // 案例列表数据
// 获取案例列表
async function getCaseDatas() {
  const data = { ...queryCaseForm, status: 'up' }
  const { total, list } = await fetchFindUpCaseList({ data })
  queryCaseForm.total = total
  caseDataList.value = list
}
// 查询案例列表
function queryCases() {
  queryCaseForm.currPage = 1
  getCaseDatas()
}

// -------------------- 选择项目 --------------------

function handleSelectItem (data) {
  console.log(activeName.value, data)
  let { index, row } = data
  row = CopyObj(row)
  switch (activeName.value) {
    case 'function': 
      row.moduleName  = row.label
      break
    case 'case':
      ;(row.moduleName = row.moduleName || row.caseName), (row.moduleImgId = row.moduleImgId || row.thumbnail)
      break
    case 'caseSpecial':
    case 'znSpecial':
      ;(row.moduleName = row.moduleName || row.zoneName), (row.moduleImgId = row.moduleImgId || row.zoneImgUrlId)
      break
  }

  selectItem.value = row
  selectItemIndex.value = index
  isOpenSelectItem.value = true
}
// 切换Tab
function tabSwitch () {
  selectItem.value = {}
  selectItemIndex.value = -1
  isOpenSelectItem.value = false
  editInfoRef.value?.reset()
}
function closeSelectItem() {
  selectItem.value = {}
}
</script>

<style lang='scss' scoped>
:deep(.el-dialog) {
  height: 663px !important;
}
:deep(.el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  height: calc(663px - 100px);
}
.upload-container {
  width: 500px;
  display: flex;
  justify-content: space-between;
}
.link-item {
  display: block;
}
.list-content {
  margin-top: -15px;
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 128px;
    margin: 10px;
    border: 3px solid transparent;
    cursor: pointer;
  }

  .item-img {
    width: 120px;
    height: 120px;
    border: 4px solid #fff;
    box-shadow: rgb(#000, 0.2) 0 4px 8px;

    &.current {
      border: 3px solid $themeColor;
    }
  }

  .title {
    margin-top: 10px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.content-list-container {
  position: relative;
  min-height: 400px;
}
.active {
  border: 1px solid #aaa !important;
  box-shadow:0 0 10px #aaa !important;
}
.function-list-container {
  .list-content {
    display: flex;
    
    .fun-item {
      width: 340px;
      margin: 10px;
      background: #fff;
      box-shadow: rgb(#000, 0.2) 0 4px 8px;
      padding: 5px;
      .content {
        background: #F6F7F7;
        height: 90px;
        display: flex;
        padding: 17px 20px;
        line-height: 30px;
        .fun-icon {
          background: #fff;
          border-radius: 30px;
          width: 60px;
          text-align: center;
          line-height: 55px;
          margin-right: 20px;
        }
        .fun-name {
          margin-top:5px;
          font-size: 14px;
          color: #000000;
          line-height: 18px;
          font-weight: 500;
        }
        .fun-desc {
          margin-top:12px;
          font-size: 12px;
          color: rgba(0,0,0,0.60);
          line-height: 18px;
          font-weight: 400;
        }
      }
      &:hover {
        // background: #F6F7F7;
        .content {
          background: #f0f0f0;
        }
      }
    }
  }
}
.link-list-container {
  margin: 10px auto;
}
.special-list-container {
  :deep(.item) {
    width: 340px;
    height: 175px;
    box-shadow: rgb(#000, 0.2) 0 4px 8px;

    &.current {
      border: 3px solid $themeColor;
    }

    .item-img {
      width: 100%;
      // height: calc(100% - 50px);
      box-shadow: none;
    }

    .title {
      height: 50px;
      padding: 0 5px;
      margin-top: 5px;
    }

    .line1 {
      display: flex;
      justify-content: space-between;
    }

    .line2 {
      margin-top: 3px;
      font-family: initial;
      font-size: 12px;
    }
  }
}
.case-list-container {
}
.red-start {
  position: absolute;
  left: -45px;
  color: red;
}
</style>
