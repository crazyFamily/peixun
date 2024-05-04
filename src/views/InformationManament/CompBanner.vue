<template>
  <div class="inifo-container">
    <div class="info-nav">
      <template v-for="item in appInfoNav">
        <p
          class="nav-item"
          :class="{ active: currentNav === item.value }"
          :key="item.value"
          @click="switchNavHandle(item.value)"
        >
          {{ item.label }}
        </p>
      </template>
    </div>
    <div class="info-content">
      <el-scrollbar style="height: calc(100% - 70px)">
        <div class="banner-container">
          <div style="display: flex; flex-wrap: wrap" ref="bannerList">
            <div
              class="dfcc banner-item-container drop"
              v-for="(item, index) in bannerList"
              :key="item.udmpId"
              :data-id="item.udmpId"
            >
              <img
                :src="handleUdmpHref(item.udmpId)"
                alt=""
                class="banner-item"
              />
              <div class="dfcc mask-container">
                <i
                  class="mask-icon el-icon-edit-outline"
                  @click="showUploadHandle(index)"
                ></i>
                <i
                  class="mask-icon el-icon-delete"
                  @click="removeBanner(index)"
                ></i>
              </div>
            </div>
            <div class="upload-container">
              <gc-upload
                ref="uploadRef"
                :list="bannerUploadList"
                :value="bannerList"
                :max="9999"
                :size="10000"
                :show-file-list="false"
                @input="uploadSuccessHandle"
              ></gc-upload>
              <p class="tintColor mt10">
                仅支持 jpg、png、jpeg 格式
                <span v-if="currentNav === 'studyCenter'"
                  >推荐尺寸：375 * 152</span
                >
                <span v-if="currentNav === 'pc'">推荐尺寸：1000 * 350</span>
              </p>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="dfcc info-footer">
        <el-button class="button-w80-h30" type="primary" @click="saveHandle"
          >发布</el-button
        >
      </div>
    </div>
    <gc-upload
      class="single-upload"
      ref="singleUploadRef"
      v-model="editBanner"
      :size="10000"
      :show-file-list="false"
      single
      @input="editBannerUploadSuccessHandle"
      style="transform: scale(0); position: absolute"
    ></gc-upload>
  </div>
</template>

<script>
import { handleUdmpHref } from '@/util/utils'
import Sortable from 'sortablejs'
import {
  fetchSaveHomePageBanner,
  fetchListHomePageBanner
} from '@/fetch/informationManament'
export default {
  name: 'CompBanner',

  props: {},

  data() {
    return {
      currentNav: 'pc',
      appInfoNav: [
        // {
        //   label: '移动端banner',
        //   value: 'studyCenter'
        // },
        {
          label: 'PC端banner',
          value: 'pc'
        }
      ],
      bannerUploadList: [],
      bannerList: [],
      editBanner: [],
      queryForm: {},
      currentEditIndex: null,
      sortableEl: null,
      handleUdmpHref
    }
  },

  components: {},

  computed: {},

  mounted() {
    this._initSortable()
    this._getList()
  },

  methods: {
    _initSortable() {
      this.$nextTick(() => {
        let bannerList = this.$refs.bannerList
        this.sortableEl = new Sortable(bannerList, {
          handle: '.drop',
          filter: '.filter',
          dataIdAttr: 'data-id',
          animation: 150,
          onEnd(event) {},
          onMove(event) {}
        })
      })
    },
    async _getList() {
      let res = await fetchListHomePageBanner({ type: this.currentNav })
      this.bannerUploadList = res.map((item) => ({
        url: handleUdmpHref(item.udmpId),
        name: item.udmpId,
        udmpId: item.udmpId,
        fileName: item.udmpId
      }))
      this.bannerList = res.map((item) => ({
        udmpId: item.udmpId,
        fileName: item.udmpId
      }))
    },
    // 菜单切换，重新查询
    async switchNavHandle(value) {
      // 切换提示
      try {
        await this.switchNavTip()
        this._resetData()
        this.currentNav = value
        this._initSortable()
        this._getList()
      } catch (error) {}
    },
    switchNavTip() {
      return new Promise((resolve, reject) => {
        this.$confirm('没发布直接切换不会保存数据，是否确认离开', '提示', {
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
    },
    uploadSuccessHandle(files) {
      this.bannerList = [...this.bannerList, files[files.length - 1]]
    },
    async saveHandle() {
      console.log(this.bannerList)
      // let banners = this.bannerList.map((item, index) => ({
      //     udmpId: item.udmpId,
      //     sequence: index
      // }))
      let sortList = this.sortableEl.toArray()
      sortList.pop()
      let banners = sortList.map((item, index) => ({
        udmpId: item,
        sequence: index
      }))
      let params = {
        banners,
        type: this.currentNav
      }
      await fetchSaveHomePageBanner(params)
      this.$message.success('发布成功')
      this._getList()
    },
    editBannerUploadSuccessHandle(files) {
      console.log(files, '---fffiels')
      this.bannerList.splice(this.currentEditIndex, 1, files[0])
    },
    // 触发upload
    showUploadHandle(index) {
      this.currentEditIndex = index
      this.$refs.singleUploadRef
        .uploadInstance()
        .$el.querySelector('.el-upload')
        .click()
    },
    removeBanner(index) {
      console.log(this.$refs.singleUploadRef.uploadInstance())
      // return
      this.bannerList.splice(index, 1)
      // this.bannerUploadList = this.bannerList.map(item => ({
      //     url: handleUdmpHref(item.udmpId),
      //     name: item.udmpId,
      //     udmpId: item.udmpId,
      //     fileName: item.udmpId
      // }))
    },
    _resetData() {
      for (let key in this.$data) {
        this.$data[key] = this.$options.data.call(this)[key]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './publicStyles.scss';

.banner-container {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
}

.banner-item-container {
  width: 300px;
  height: 300px / 2.68;
  border-radius: 6px;
  border: 1px solid $line-color;
  position: relative;
  overflow: hidden;
  margin: 10px;
  .mask-container {
    width: 100%;
    height: 100%;
    color: #fff;
    overflow: hidden;
    font-size: 24px;
    background-color: rgb(#000, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0);
    transition: 0.1s all;
  }

  &:hover .mask-container {
    transform: scale(1);
  }

  .mask-icon {
    margin: 0 5px;
    cursor: pointer;
  }
}

.upload-container {
  margin: 10px;
  width: 300px;
  height: 300px / 2.68;
}

:deep(.upload-container) {
  .el-upload {
    width: 300px;
    height: 300px / 2.68;
    line-height: initial;
  }

  .el-upload .box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-icon-plus {
    display: inline-block;
    margin-bottom: 20px;
  }

  .text {
    top: 60%;
  }
}

// .banner-item {
//     margin-right: 10px;
// }
</style>