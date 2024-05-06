<template>
  <div class="case-dialog">
    <gc-model
      :visible="isDialogShow"
      :show-close="false"
      @cancel="closeHandle"
      @comfirm="comfirmHandle"
      top="5vh"
      width="1200px"
      :title="title"
      auto-height
    >
      <div class="form-container">
        <el-form :model="queryForm" inline ref="formRef">
          <el-form-item>
            <gc-institution
              :orgUrl="APIAllTree"
              :leftShow="false"
              :default-show="defaultShow"
              @setDataFinish="orgIdsFinish"
              v-model="queryForm.orgIds"
              busiType="LS"
              placeholder="案例所属机构"
              ref="institutionRef"
            />
          </el-form-item>
          <el-form-item prop="caseInfo">
            <el-input
              v-model.trim="queryForm.caseInfo"
              placeholder="案例名称/ID"
            ></el-input>
          </el-form-item>
          <el-form-item prop="caseAuthor">
            <el-input
              v-model.trim="queryForm.caseAuthor"
              placeholder="案例制作人/分享人"
            ></el-input>
          </el-form-item>
          <el-form-item prop="uploadUser">
            <el-input style="width:150px;"
              v-model.trim="queryForm.uploadUser"
              placeholder="案例上传人(姓名/UM号)"
            ></el-input>
          </el-form-item>
          <el-form-item prop="caseType" style="margin-right: 20px;">
            <el-checkbox v-model="queryForm.isPerfect" true-label="Y" false-label="">仅优秀案例</el-checkbox>
          </el-form-item>
          <el-form-item>
            <div class="case-search-button">
              <el-button class="button-w80-h30" type="primary" @click="query">查询</el-button>
              <el-button class="button-w80-h30" @click="reset">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="case-list-container">
        <div
          class="case-item"
          :class="{ active: isCaseActive(item) }"
          v-for="(item,index) in caseList" :key="index"
          @click="caseItemSelectHandle(item)"
          title=""
        >
          <div class="item-img-container">
            <template v-if="item.caseType === 'mix'">
              <img
                src="~@/assets/images/case-introduce-play-mix.svg"
                alt=""
                class="item-type"
              />
            </template>
            <template v-if="item.caseType === 'voice'">
              <img
                src="~@/assets/images/case-introduce-play-music.svg"
                alt=""
                class="item-type"
              />
            </template>
            <template v-if="item.caseType === 'video'">
              <img
                src="~@/assets/images/case-introduce-play.svg"
                alt=""
                class="item-type"
              />
            </template>
            <template v-if="item.caseType === 'context'">
              <img
                src="~@/assets/images/case-introduce-play-photo.svg"
                alt=""
                class="item-type"
              />
            </template>
            <img :src="handleUdmpHref(item.thumbnail)" alt="" />
            <div class="item-footer">{{ secondToHour(item.caseDuration) }}</div>
          </div>
          <el-tooltip placement="top" :disabled="item.caseName.length <= 20">
            <div slot="content"> {{ item.caseName }} </div>
            <p class="item-name">{{ item.caseName }}</p>
          </el-tooltip>
        </div>
      </div>
      <gc-pagination
        :total="queryForm.total"
        :page-sizes="pageSizes"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="case-pagination between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </gc-model>
  </div>
</template>

<script>
import {
  sizeChange,
  currentChange,
  handleUdmpHref,
  secondToHour,
  resetObj,
  CopyObj
} from '@/util/utils.js'
import { fetchListToCase, fetchListCasePushBelongOrgs } from '@/fetch/caseCenter'
import { APIAllTree } from '@/fetch/public'

export default {
  name: 'CompSelectCaseDailog',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    defaultShow: {
      type: Boolean,
      default: false
    },
    selectedList: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ' '
    }
  },

  data() {
    return {
      fetchListCasePushBelongOrgs,
      APIAllTree,
      isDialogShow: false,
      caseList: [],
      queryForm: {
        caseInfo: '', // 案例信息
        caseAuthor: '', // 案例作者
        uploadUser: '', // 上传人
        orgIds: [],
        orgId: '',
        isPerfect: '', // 是否优秀案例（ Y：优秀案例, ''：所有案例 ）
        total: 0,
        pageSize: 14,
        currPage: 1
      },
      pageSizes: [14, 28],
      selectCaseList: [],
      sizeChange,
      currentChange,
      handleUdmpHref,
      secondToHour
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
        if (n) {
          this.reset()
          this.selectCaseList = CopyObj(this.selectedList)
        }
      },
      immediate: true
    }
  },

  components: {},

  computed: {},

  methods: {
    orgIdsFinish() {
      if(this.defaultShow) {
        this.query()
      }
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    reset () {
      resetObj(this.queryForm, {
        caseInfo: '', // 案例信息
        caseAuthor: '', // 案例作者
        uploadUser: '', // 上传人
        currPage: 1,
        pageSize: 14,
        orgIds: [],
        orgId: '',
        isPerfect: '',
        total: 0,
      })
      if(this.defaultShow) {
        this.$refs.institutionRef.createTreeData()
      } else {
        this.getList()
      }
    },
    isCaseActive(caseItem) {
      return Boolean(
        this.selectCaseList.find((item) => item.caseId === caseItem.caseId)
      )
    },
    async getList() {
      this.queryForm.orgId = this.queryForm.orgIds[1]
      let data = { ...this.queryForm, status: 'up' }
      let { list, total } = await fetchListToCase({ data })
      this.caseList = list
      this.queryForm.total = total
    },
    closeHandle() {
      this.resetData()
      this.$emit('update:show', false)
    },
    comfirmHandle() {
      this.$emit('save', CopyObj(this.selectCaseList))
      this.closeHandle()
    },
    caseItemSelectHandle(caseItem) {
      let itemIndex = this.selectCaseList.findIndex(
        (item) => item.caseId === caseItem.caseId
      )
      if (itemIndex > -1) {
        this.selectCaseList.splice(itemIndex, 1)
      } else {
        if (this.selectCaseList.length >= 20) {
          return this.$message.warning('最多可以加20个')
        }
        this.selectCaseList.push(caseItem)
      }
    },
    resetData() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.case-list-container {
  min-height: 50vh;
  display: flex;
  flex-wrap: wrap;

  .case-item {
    cursor: pointer;

    &.active {
      .item-img-container {
        border: 4px solid $themeColor;
      }
    }
  }

  $item-width: 120px;
  .item-img-container {
    width: $item-width;
    height: $item-width;
    border: 4px solid #fff;
    text-align: right;
    margin: 20px;
    margin-bottom: 10px;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.18) 0 4px 8px;
    border-radius: 8px;
    overflow: hidden;

    .item-type {
      width: 40px;
      height: 40px;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    .item-footer {
      $base-height: 24px;
      width: 100%;
      height: $base-height;
      line-height: $base-height;
      padding: 0 10px;
      color: #fff;
      background-image: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.24) 100%
      );
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }

  .item-name {
    width: $item-width;
    margin: 0 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.case-pagination {
  top: 0
}
</style>