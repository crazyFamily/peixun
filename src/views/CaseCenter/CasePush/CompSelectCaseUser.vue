<template>
  <div>
    <gc-model
      title="人员选择"
      :visible="isDialogShow"
      :show-close="false"
      @cancel="closeHandle"
      @comfirm="comfirmHandle"
      top="5vh"
      width="80%"
    >
      <div class="select-box">
        <p class="title">人员库（通过下面的条件检索您需要的人员）</p>
        <div class="select-container">
          <el-radio-group
            class="select-nav"
            v-model="navType"
            @change="navTypeChangeHandle"
          >
            <el-radio label="UM">UM号导入</el-radio>
            <el-radio label="name">姓名搜索</el-radio>
          </el-radio-group>
          <div class="content-container" v-show="navType === 'UM'">
            <div class="tips">
              <p>填写员工UM号，添加到右侧，每行一条</p>
              <p>单次最多粘贴1000行，示例：</p>
              <p>ZHANGSAN001</p>
              <p>lishi002</p>
            </div>
            <div class="um-container">
              <el-input v-model="umSet" type="textarea" rows="14"></el-input>
              <p class="fail-tip" v-show="isFailTipShow">
                以上UM号错误或者不存在
              </p>
            </div>
          </div>
          <div class="content-container" v-show="navType === 'name'">
            <el-input v-model="searchName">
              <template slot="append">
                <!-- <el-button type="primary">搜索</el-button> -->
                <el-button
                  type="primary"
                  class="search-btn"
                  @click="searchUmNameHandle"
                  >确定</el-button
                >
              </template>
            </el-input>
            <div class="search-list-container">
              <el-scrollbar style="height: 40vh">
                <p class="um-name-item null-data" v-if="!searchUmNameList.length">
                  暂无记录
                </p>
                <p
                  class="um-name-item"
                  :class="{
                    active: item.active
                  }"
                  v-for="(item, index) in searchUmNameList"
                  :key="item.umId"
                  @click="selecteUmNameHandle(item, index)"
                >
                  {{ item.umName }}({{ item.umId }})
                </p>
              </el-scrollbar>
            </div>
          </div>
        </div>
       <div class="dfcc control-container">
          <el-button class="item" @click="addUmHandle">添加 &gt;</el-button>
          <el-button class="item" @click="removeUmHandle">删除 &lt;</el-button>
        </div>
        <div class="search-result-container">
          <p class="tip">已选人群 0</p>
          <div class="list-container">
            <table-pagination
              class="user-table"
              :list="columns"
              :table-list="successUserList"
              :queryForm="{ total: 0 }"
              :hidePagination="true"
              @selection-change="selectionHandle"
              ref="caseTablePagination"
            ></table-pagination>
            <!-- <p class="list-item" v-for="item in 1000">{{ item }}</p> -->
          </div>
        </div>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { fetchInsertManulUsers, fetchListManulUsers } from '@/fetch/caseCenter'
import { CopyObj } from '@/plugins/until'
export default {
  name: 'CompSelectCaseUser',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    uuid: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      navType: 'UM',
      isDialogShow: false,
      umSet: '',
      searchName: '',
      searchList: [],
      isShowSearchNull: false,
      columns: [
        { type: 'selection' },
        {
          prop: 'umName',
          label: '姓名',
          formatter: (row) => `${row.umName}(${row.umId})`
        }
      ],
      successUserList: [],
      failUserList: [],
      selectedList: [],
      searchUmNameList: [],
      isFailTipShow: false,
      failTimer: null
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
      },
      immediate: true
    },
    failUserList(n) {
      if (n.length) {
        this.isFailTipShow = true
        this.failTimer && clearTimeout(this.failTimer)
        this.failTimer = setTimeout(() => {
          this.isFailTipShow = false
        }, 3000)
      }
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    closeHandle() {
      this._resetData()
      this.$emit('update:show', false)
    },
    _resetData() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    },
    async comfirmHandle() {
      let data = {
        type: 'confirm',
        users: this.successUserList.map((item) => ({
          ...item,
          batchId: this.uuid
        }))
      }
      await fetchInsertManulUsers({ data })
      this.$message.success('保存成功')
      this.$emit('save', CopyObj(this.successUserList))
      this.closeHandle()
    },
    async addUmHandle() {
      if (this.navType === 'UM') {
        await this.umExportHandle()
        this.umSet = this.failUserList.map((item) => item.umId).join('\n')
      }
      if (this.navType === 'name') {
        let fetchBack = await this.nameExportHandle()
        if (fetchBack.failList.length) {
          this.$message.error(
            `[${fetchBack.failList
              .map((item) => `${item.umId}`)
              .join(',')}] 以上UM号错误或者不存在`
          )
        }
        let concatlist = this.searchUmNameList
          .filter((item) => item.active)
          .filter((item) => {
            return !Boolean(
              this.successUserList.find(
                (tableItem) => tableItem.umId === item.umId
              )
            )
          })
          .filter((item) => {
            return Boolean(
              fetchBack.successList.find(
                (succItem) => succItem.umId === item.umId
              )
            )
          })
        this.successUserList = this.successUserList.concat(concatlist)

        this.searchUmNameList = this.searchUmNameList.map((item) => ({
          ...item,
          active: false
        }))
      }
    },
    removeUmHandle() {
      this.successUserList = this.successUserList.filter((item) => {
        return !this.selectedList.find(
          (selectedItem) => selectedItem.umId === item.umId
        )
      })
      this.selectedList = []
    },
    umExportHandle() {
      return new Promise(async (resolve, reject) => {
        // this.umSet.replace(/\n/g, ',')
        let users = this.umSet
          .split(/\n/)
          .filter((item) => Boolean(item))
          .map((item) => ({
            batchId: this.uuid,
            umId: item
          }))
        let data = {
          type: 'add',
          users
        }
        let { successList, failList } = await fetchInsertManulUsers({ data })
        this.successUserList = this.successUserList.concat(
          successList.filter(
            (item) =>
              !Boolean(
                this.successUserList.find(
                  (tableItem) => tableItem.umId === item.umId
                )
              )
          )
        )
        this.failUserList = failList
        resolve()
      })
    },
    nameExportHandle() {
      return new Promise(async (resolve) => {
        let users = this.searchUmNameList
          .filter((item) => item.active)
          .map((item) => ({
            batchId: this.uuid,
            umId: item.umId
          }))
        let data = {
          type: 'add',
          users
        }
        let { successList, failList } = await fetchInsertManulUsers({ data })

        resolve({ successList, failList })
      })
    },
    selectionHandle(list) {
      this.selectedList = list
    },
    async searchUmNameHandle() {
      this.selecteUmNameList = []
      this.searchUmNameList = await fetchListManulUsers({
        data: this.searchName
      })
    },
    selecteUmNameHandle(item, index) {
      this.$set(this.searchUmNameList, index, { ...item, active: !item.active })
      // let itemIndex = this.selecteUmNameList.findIndex(
      //   (selectItem) => selectItem.umId === item.umId
      // )
      // if (itemIndex > -1) {
      //   this.selecteUmNameList.splice(itemIndex, 1)
      //   this.successUserList = this.successUserList.filter(
      //     (succItem) => !Boolean(succItem.umId === item.umId)
      //   )
      // } else {
      //   this.selecteUmNameList.push(item)
      //   this.successUserList = this.successUserList.concat(
      //     this.selecteUmNameList
      //   )
      // }
    },
    navTypeChangeHandle() {
      this.searchUmNameList = []
      this.searchName = ''
    }
  }
}
</script>
<style lang='scss' scoped>
.select-nav {
  margin: 10px 0;
}
.tips {
  color: $color9;
  margin-bottom: 10px;
}

.select-box {
  display: flex;
  flex-wrap: wrap;
  height: 400px;

  .title {
    width: 100%;
  }

  .control-container {
    width: 150px;
    flex-direction: column;

    .item {
      margin-left: 0 !important;
      margin-bottom: 20px;
    }
  }

  .select-container {
    flex: 1;
    height: calc(100% - 30px);
  }

  .search-result-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    .tip {
      height: 30px;
      line-height: 30px;
    }

    .list-container {
      flex: 1 0 1px;
      overflow-y: auto;
      border: 1px solid $line-color;
    }

    .list-item {
      $item-height: 30px;
      height: $item-height;
      padding: 0 10px;
      line-height: $item-height;
      border-bottom: 1px solid $line-color;
      cursor: pointer;

      &.active {
        background-color: $themeColor;
        color: #ffffff;
      }
    }
  }
}

.search-btn {
  background-color: $themeColor !important;
  color: #ffffff !important;
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

.user-table {
  height: 100%;
  // min-height: 100%;
  :deep(.gc-table) {
    min-height: 100%;
  }
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
