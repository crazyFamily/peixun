<template>
  <gc-model
    :visible="isDialogShow"
    :show-close="false"
    @cancel="closeHandle"
    @comfirm="comfirmHandle"
    top="5vh"
    width="1200px"
    title="选择资源"
    class="add-item-dialog"
  >
    <div class="form-container">
      <el-tabs
        v-model="activeName"
        class="nav-tab"
        @tab-click="navTabChangeHandle"
      >
        <el-tab-pane
          v-for="item in navTabInfo"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        ></el-tab-pane>
      </el-tabs>
      <div class="content-list-container">
        <div class="case-list-container" v-show="activeName === 'case'">
          <div class="form-container">
            <el-form :model="queryCaseForm" inline ref="caseFormRef">
              <el-form-item prop="caseInfo">
                <el-input
                  v-model="queryCaseForm.caseInfo"
                  placeholder="案例名称/ID"
                ></el-input>
              </el-form-item>
              <el-form-item prop="caseAuthor">
                <el-input
                  v-model="queryCaseForm.caseAuthor"
                  placeholder="案例制作人/分享人"
                ></el-input>
              </el-form-item>
              <el-form-item prop="caseAuthor">
                <gc-institution
                  v-model="queryCaseForm.orgIds"
                  busiType="LS"
                  :left-show="false"
                  :default-show="false"
                  ref="institutionRef"
                >
                </gc-institution>
              </el-form-item>
              <el-form-item>
                <div class="case-search-button">
                  <el-button type="primary" @click="queryCases">查询</el-button>
                  <!-- <el-button type="primary" @click="resetCases">重置</el-button> -->
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="list-content">
            <div
              class="item"
              v-for="item in caseDataList"
              :key="item.caseId"
              @click="selectCaseHandle(item)"
            >
              <!-- <div class="img-container"></div> -->
              <img
                class="item-img"
                :class="{ current: item.caseId === currentCase.caseId }"
                :src="item.thumbnailUrl"
                alt=""
              />
              <p class="title">{{ item.caseName }}</p>
            </div>
          </div>
          <gc-pagination
            :total="queryCaseForm.total"
            :page-sizes="pageSizes"
            :page-size="queryCaseForm.pageSize"
            :current-page="queryCaseForm.currPage"
            @sizeChange="sizeChange($event, queryCaseForm, getCaseDatas)"
            @currentChange="currentChange($event, queryCaseForm, getCaseDatas)"
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </div>
        <div class="special-list-container" v-show="activeName === 'special'">
          <div class="form-container">
            <el-form :model="querySpecialForm" inline ref="formRef">
              <el-form-item prop="searchText">
                <el-input
                  v-model="querySpecialForm.searchText"
                  placeholder="专题名称/创建人"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <div class="case-search-button">
                  <el-button type="primary" @click="querySpecials"
                    >查询</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </div>
          <div class="list-content">
            <div
              class="item"
              :class="{ current: currentZone.zoneId === item.zoneId }"
              v-for="item in specialDataList"
              @click="selectSpecialHandle(item)"
            >
             <img class="item-img" :src="item.zoneImgUrl" alt="" />
              <div class="title">
                <p class="line1">
                  <span>{{ item.zoneName }}</span>
                  <span>{{ item.caseNumber }}</span>
                </p>
                <p class="line2">
                  {{ item.createByName }} {{ item.createDate }}
                </p>
              </div>
            </div>
          </div>
          <gc-pagination
            :total="querySpecialForm.total"
            :page-sizes="specialPageSizes"
            :page-size="querySpecialForm.pageSize"
            :current-page="querySpecialForm.currPage"
            @sizeChange="sizeChange($event, querySpecialForm, getSpecialDatas)"
            @currentChange="
              currentChange($event, querySpecialForm, getSpecialDatas)
            "
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </div>
        <div class="link-list-container" v-show="activeName === 'link'">
          <el-form
            :model="queryLinkForm"
            :rules="linkFormRules"
            inline
            ref="linkFormRef"
          >
            <el-form-item class="link-item" label="是否启用跳转" prop="ifValid">
              <el-switch v-model="queryLinkForm.ifValid"> </el-switch>
            </el-form-item>
            <el-form-item class="link-item" label="标题" prop="moduleName">
              <el-input
                v-model="queryLinkForm.moduleName"
                placeholder="请输入标题内容"
                :maxlength="maxTitleLen"
                show-word-limit
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item class="link-item" label="地址" prop="relationId">
              <el-input
                v-model="queryLinkForm.relationId"
                placeholder="请输入链接地址"
                style="width: 400px"
              ></el-input>
            </el-form-item>
            <el-form-item class="link-item" label="图片" prop="moduleImgId">
              <gc-upload
                ref="uploadRef"
                :list="linkImgUploadList"
                single
                :accept="['jpg', 'png']"
                v-model="linkImgAttachList"
                :key="show"
              ></gc-upload>
              <p class="tintColor mt10">仅支持 jpg、png格式</p>
            </el-form-item>
          </el-form>
        </div>
      <edit-info
          :show.sync="isEditInfoShow"
          :item-info="currentItemInfo()"
          :suggest-size="suggestSize"
          @close="editInfoCloseHandle"
          ref="editInfoRef"
        ></edit-info>
      </div>
    </div>
  </gc-model>
</template>

<script>
import { fetchFindUpCaseList, fetchFindZoneList } from '@/fetch/homeSetting'
import {
  sizeChange,
  currentChange,
  CopyObj,
  handleUdmpHref
} from '@/util/utils'
import CompEditItemInfo from './CompEditItemInfo.vue'
export default {
  name: 'CompAddItems',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    suggestSize: {
      type: String,
      default: ''
    },
    itemInfo: {
      type: Object,
      default: () => {}
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
        n && this._getDatas()
        this.$nextTick(() => {
          n && this.$refs.linkFormRef.clearValidate()
        })
      },
      immediate: true
    },
    itemInfo: {
      handler(n) {
        if (Object.keys(n).length) {
          switch (n.moduleType) {
            case '1':
              this.activeName = 'case'
              break
            case '0':
              this.activeName = 'special'
              this.querySpecials()
              break
            case '2':
              this.activeName = 'link'
              this._initLinkData(n)
              break
          }
          if (this.activeName === 'link') return
          this.currentCase = { ...CopyObj(n), relationId: n.relationId || n.id }
          this.currentZone = {
            ...CopyObj(n),
            relationId: n.relationId || n.zoneId
          }
          this.isEditInfoShow = true
        }
      }
      // immediate: true
    }
  },

  data() {
    const CASE_PAGE_SIZE = 14
    const SPECIAL_PAGE_SIZE = 6
    return {
      isDialogShow: false,
      activeName: 'case',
      pageSizes: [CASE_PAGE_SIZE, CASE_PAGE_SIZE * 2],
      queryCaseForm: {
        caseInfo: '',
        caseAuthor: '',
        // businessLine: [],
        total: 10,
        pageSize: CASE_PAGE_SIZE,
        currPage: 0
      },
      caseDataList: [],
      querySpecialForm: {
        searchText: '',
        total: 10,
        pageSize: SPECIAL_PAGE_SIZE,
        currPage: 0
      },
      specialPageSizes: [SPECIAL_PAGE_SIZE, SPECIAL_PAGE_SIZE * 2],
      specialDataList: [],
      queryLinkForm: {
        ifValid: true,
        moduleName: '',
        relationId: ''
      },
      linkFormRules: {
        moduleName: [
          { required: true, trigger: 'blur', message: '请输入标题' }
        ],
        relationId: [
          { required: true, trigger: 'blur', message: '请输入地址' }
        ],
        moduleImgId: [
          {
            validator: (rule, value, callback) => {
              if (
                this.activeName === 'link' &&
                !this.linkImgAttachList.length
              ) {
                return callback(new Error('请上传图片'))
              }
              return callback()
            }
          }
        ]
      },
      linkImgUploadList: [],
      linkImgAttachList: [],
      navTabInfo: [
        { label: '案例', name: 'case', value: '0' },
        { label: '专题', name: 'special', value: '1' },
        { label: '链接地址', name: 'link', value: '2' }
      ],
     // 选择的案例
      currentCase: {},
      // 选择的专题
      currentZone: {},
      isEditInfoShow: false,
      maxTitleLen: 50
    }
  },

  components: {
    'edit-info': CompEditItemInfo
  },

  computed: {},

  mounted() {},

  methods: {
    currentItemInfo() {
      if (this.activeName === 'case') {
        return {
          ...CopyObj(this.currentCase),
          moduleName: this.currentCase.moduleName || this.currentCase.caseName,
          moduleImgId:
            this.currentCase.moduleImgId || this.currentCase.thumbnail
        }
      }
      if (this.activeName === 'special')
        return {
          ...CopyObj(this.currentZone),
          moduleName: this.currentZone.moduleName || this.currentZone.zoneName,
          moduleImgId:
            this.currentZone.moduleImgId || this.currentZone.zoneImgUrlId
        }
      return {}
    },
    _getDatas() {
      this.queryCases()
    },
    // 获取案例数据
    queryCases() {
      this.queryCaseForm.currPage = 1
      this.getCaseDatas()
    },
    resetCases() {},
    // 发起案例查询请求
    async getCaseDatas() {
      let data = { ...this.queryCaseForm, status: 'up' }
      let { total, list } = await fetchFindUpCaseList({ data })
      this.queryCaseForm.total = total
      this.caseDataList = list
    },
    // 获取专题数据
    querySpecials() {
      this.querySpecialForm.currPage = 1
      this.getSpecialDatas()
    },
    // 发起专题查询请求
    async getSpecialDatas() {
      let { total, list } = await fetchFindZoneList(this.querySpecialForm)
      this.querySpecialForm.total = total
      this.specialDataList = list
    },
    resetData() {
      this.$refs.editInfoRef.reset()
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    },
    /**
     * 点击确认操作
     * 1. 如果有展开编辑内容弹窗的情况下，需要做标题长度校验
     * 2. 需要针对当前tab做已选内容校验
     * 3. 数据需要加上当前的moduleType
     */
    async comfirmHandle() {
      let resultData = {
        moduleName: '',
        moduleImgId: '',
        moduleSequence: '',
        moduleType: '',
        relationId: '',
        ifValid: 'Y'
      }

      let editItemInfo = {}

      if (this.isEditInfoShow) {
        editItemInfo = this.$refs.editInfoRef.getInfoDatas()
        if (editItemInfo.moduleName.length > this.maxTitleLen) {
          return this.$message.warning(`标题不能大于${this.maxTitleLen}个字符`)
        }
      }

      if (this.activeName === 'case') {
        if (!Object.keys(this.currentCase).length) {
          return this.$message.warning('请选择案例')
        }
        resultData = {
          ...resultData,
          ...this.currentCase,
          moduleImgId: this.currentCase.thumbnail,
          moduleName: this.currentCase.caseName,
          ...editItemInfo,
          relationId: this.currentCase.id || this.currentCase.relationId,
          moduleType: '1'
        }
      }
      if (this.activeName === 'special') {
        if (!Object.keys(this.currentZone).length) {
          return this.$message.warning('请选择专题')
        }
        resultData = {
          ...resultData,
          ...this.currentZone,
          moduleImgId: this.currentZone.zoneImgUrlId,
          moduleName: this.currentZone.zoneName,
          ...editItemInfo,
          relationId: this.currentZone.zoneId || this.currentZone.relationId,
          moduleType: '0'
        }
      }
      if (this.activeName === 'link') {
        resultData = await this.validateLinkForm(resultData)
        resultData.moduleType = '2'
      }
      console.log('选择资源确认信息',resultData)
      this.$emit('comfirm', { ...resultData })

      this.closeHandle()
    },
    // H5的表单校验
    validateLinkForm(resultData) {
      return new Promise((resolve, reject) => {
        this.$refs.linkFormRef.validate((v) => {
          if (!v) return reject(false)
          let res = {
            ...resultData,
            ...this.queryLinkForm,
            moduleImgId: this.linkImgAttachList[0].udmpId,
            ifValid: this.queryLinkForm.ifValid ? 'Y' : 'N',
            moduleType: '2'
          }
          return resolve(res)
        })
      })
    },
    closeHandle() {
      this.resetData()
      this.$emit('update:show', false)
    },
    // 选择案例
    selectCaseHandle(row) {
      this.isEditInfoShow = true
      this.currentCase = row
    },
    // 选择专题
    selectSpecialHandle(row) {
      this.isEditInfoShow = true
      this.currentZone = row
    },
    navTabChangeHandle() {
      this.isEditInfoShow = false
      this.currentCase = {}
      this.currentZone = {}
      if (this.activeName === 'case') {
        this.queryCases()
      }

      if (this.activeName === 'special') {
        this.$refs.linkFormRef.clearValidate()
        this.querySpecials()
      }
    },
    _initLinkData(data) {
      this.queryLinkForm = data
      this.queryLinkForm.ifValid = data.ifValid === 'Y'
      this.linkImgAttachList = [
        {
          fileName: '图片',
          udmpId: data.moduleImgId
        }
      ]
      this.linkImgUploadList = [
        {
          name: '图片',
          url: handleUdmpHref(data.moduleImgId)
        }
      ]
    },
    // 浮窗关闭的时候，这里需要把已选状态清空
    editInfoCloseHandle() {
      if (this.activeName === 'case') {
        this.currentCase = {}
      }

      if (this.activeName === 'special') {
        this.currentZone = {}
      }
    },
    sizeChange,
    currentChange
  }
}
</script>
<style lang='scss' scoped>
.link-item {
  display: block;
}

.list-content {
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

.case-list-container {
}
.special-list-container {
  .item {
    width: 340px;
    height: 165px;
    box-shadow: rgb(#000, 0.2) 0 4px 8px;

    &.current {
      border: 3px solid $themeColor;
    }

    .item-img {
      width: 100%;
      height: calc(100% - 50px);
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

.content-list-container {
  position: relative;
}
</style>
