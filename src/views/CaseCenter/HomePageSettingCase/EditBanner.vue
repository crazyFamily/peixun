<template>
  <div class="CaseCenter__editBanner">
    <el-tabs v-model="activeName">
      <el-tab-pane label="案例专题" name="case">
        <div class="items">
          <div class="add-item" @click="handleAdd">
            <i class="el-icon-plus gc-uploader-icon"></i>
          </div>
          <div class="item" v-for="(item, i) in banners" :key="item.id">
            <div class="img-wrapper">
              <div class="img">
                <img :src="item.udmpUrl" alt="" />
              </div>
              <div class="item-mask">
                <div @click="move(i, -1)" style="background-color: #b08831">
                  前移
                </div>
                <div @click="edit(item)">编辑</div>
                <div style="background-color: #f56c6c" @click="del(i)">
                  删除
                </div>
                <div @click="move(i, 1)">后移</div>
              </div>
            </div>

            <div class="item-content tintColor6">
              <div class="item-title">
                <span class="fz14 fontColor ellipsis zoneName">{{
                  item.zoneName || item.bannerName
                }}</span>
                <span>{{ item.caseNumber }}个</span>
              </div>
              <p class="mt5">
                <span class="mr20">{{ item.createByName }}</span>
                <span>{{ item.createDate || item.createdDate }}</span>
              </p>
            </div>
          </div>
          <div class="item hide" v-if="!banners.length">
            <div class="img-wrapper"></div>
            <div class="item-content tintColor6">
              <div class="item-title">
                <span class="fz14"></span>
                <span>个</span>
              </div>
              <p class="mt5">
                <span>个</span>
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="cancel">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submit"
        >确定</el-button
      >
    </div>

    <gc-model
      width="1200px"
      title="选择案例专题"
      :visible.sync="bannerVisible"
      @close="handleClose"
      @comfirm="handleComfirm"
    >
     <div class="between-noc">
        <el-radio-group v-model="queryForm.zoneType" size="small" @change="query">
          <el-radio-button label="case">普通专题</el-radio-button>
          <el-radio-button label="caseEva">评分专题</el-radio-button>
        </el-radio-group>
        <el-input class="w-250" v-model="queryForm.searchText" placeholder="专题名称/作者">
          <i slot="suffix" @click="query" class="page-input__search"></i>
        </el-input>
      </div>
      <div class="items select-banner">
        <div
          class="item"
          :class="{ activeItem: active === i }"
          v-for="(item, i) in list"
          :key="item.id"
          @click="active = i"
        >
          <div class="img-wrapper">
            <div class="img">
              <img :src="getSpecialImg(item.zoneImgUrl)" alt="" />
            </div>
          </div>
          <div class="item-content tintColor6">
            <div class="item-title">
              <span class="fz14 fontColor ellipsis sw-250">{{
                item.zoneName
              }}</span>
              <span>{{ item.caseNumber }}个</span>
            </div>
            <p class="mt5">
              <span class="mr20">{{ item.createByName }}</span>
              <span>{{ item.createDate }}</span>
            </p>
          </div>
        </div>
      </div>
      <gc-pagination
        class="between"
        :total="queryForm.total"
        :page-sizes="[6]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.page"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
      />
    </gc-model>
  </div>
</template>

<script>
import {
  filterObj,
  sizeChange,
  currentChange,
  getSpecialImg,
  jsonHeaders,
  closeCurrPage
} from '@/util/utils'
import { DEFAULT_ZONE_IMG_URL_ID, DEFAULT_ZONE_IMG_URL } from '@/util/constants';
export default {
  name: 'EditBanner',
  data() {
    return {
      status: '',
      activeName: 'case',
      result: {},
      banners: [],
      getSpecialImg,
      bannerVisible: false,
      queryForm: {
        total: 0,
        page: 1,
        pageSize: 6,
        zoneType: 'case',
        searchText: ''
      },
      sizeChange,
      currentChange,
      list: [],
      active: '',
      editItem: '',
      closeCurrPage
    }
  },
  methods: {
    // 添加banner事件
    handleAdd() {
      if (this.banners.length >= 6) {
        return this.$message.warning('最多添加6个')
      }
      this.bannerVisible = true
      this.getList()
    },
    // 移动banner
    move(i, num) {
      const other = i + num
      if (!this.banners[other]) return
      const item = this.banners.splice(i, 1)
      this.banners.splice(other, 0, item[0])
    },
    // 删除
    del(i) {
      if (this.banners.length <= 1) {
        return this.$message.warning('最少保留一个')
      }
      this.banners.splice(i, 1)
    },
    // 编辑
    edit(item) {
      this.editItem = item
      this.bannerVisible = true
      this.getList()
    },
    // dialog关闭
    handleClose() {
      this.active = ''
      this.editItem = ''
      this.bannerVisible = false
    },
    handleComfirm() {
      const item = this.list[this.active]
      if (!item) return (this.bannerVisible = false)
      const ids = this.banners.map((v) => v.zoneId)
      // 防止重复添加
      if (ids.includes(item.zoneId) && !this.editItem)
        return (this.bannerVisible = false)
      item.bannerRefType = 'zone'
      item.bannerRef = item.zoneId
      item.udmpUrl = item.zoneImgUrl
      item.udmpId = item.zoneImgUrlId
      item.bannerName = item.zoneName
      if (this.editItem) {
        const index = this.banners.indexOf(this.editItem)
        this.banners.splice(index, 1, item)
      } else {
        this.banners.push(item)
      }
      this.bannerVisible = false
    },
    query() {
      this.queryForm.page = 1
      this.getList()
    },
    // 查询专题
    getList() {
      const data = filterObj(this.queryForm)
      this.$axios
        .post('/fn/caseCenter/zoneManager/listZone', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.queryForm.total = total
            list.forEach(m => {
              if (!m.zoneImgUrl) {
                m.zoneImgUrl = getSpecialImg()
                m.zoneImgUrlId = getSpecialImg()
              }
            })
            this.list = list
          }
        })
    },
    // 确定
    submit() {
      closeCurrPage()
      this.$router.push({
        name: '首页设置',
        params: { banners: this.banners }
      })
    },
    cancel() {
      closeCurrPage()
      this.$router.push({
        name: '首页设置'
      })
    },
    _initData () {
      const params = this.$route.params
      if (params.homeId) {
        this.result = params
        params.banners.forEach(m => {
        if (!m.udmpUrl) {
          m.udmpUrl = getSpecialImg()
          m.udmpId = getSpecialImg()
        }
      })
        this.banners = params.banners
        this.status = params.status
      }
    }
  },
  mounted () {
    console.log('mounted')
    this._initData()
  },
  activated() {
    console.log('activated')
    this._initData()
  }
}
</script>
<style lang="scss" scoped>
.CaseCenter__editBanner {
  background-color: #fff;
  .el-tab-pane {
    margin-top: -15px;
    padding-bottom: 20px;
  }
  .page-input__search {
    margin-top: 6px;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
    .item,
    .add-item {
      width: calc((100% - 100px) / 3);
      margin-top: 30px;
      flex-wrap: wrap;
      margin-left: 30px;
      border: 4px solid #ffffff;
      box-shadow: 0 4px 8px rgba($color: #000000, $alpha: 0.18);
    }
    .add-item {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f6f7f7;
      cursor: pointer;
      i {
        font-size: 60px;
        font-weight: 100;
        color: #d2d2d2;
      }
    }
    .item {
      .img-wrapper {
        position: relative;
        width: 100%;
        height: 0px;
        overflow: hidden;
        padding-bottom: calc(100% * 133 / 390 + 0px);
        &:hover .item-mask {
          display: flex;
        }
      }
      .img,
      .item-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba($color: #000000, $alpha: 0.31);
        &:hover {
          display: flex;
        }
      }
      .img {
        display: block;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .item-content {
        padding: 8px 15px 0;
        .zoneName {
          width: calc(100% - 30px);
        }
      }
      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    & > div:nth-child(3n + 1) {
      margin-left: 20px !important;
    }
  }
  .item-mask > div {
    display: flex;
    width: 60px;
    height: 30px;
    color: #fff;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    background-color: #eeb435;
    cursor: pointer;
    &:nth-child(n + 1) {
      margin-left: 20px;
    }
    &:first-child {
      border-radius: 6px 2px 2px 6px;
    }
    &:last-child {
      border-radius: 2px 6px 6px 2px;
    }
  }
  .el-input__suffix {
    display: flex;
    align-items: center;
  }
  .activeItem {
    border-color: $themeColor !important;
  }
  .select-banner.items {
    .item,
    .add-item {
      width: calc((100% - 60px) / 3);
    }
    & > div:nth-child(3n + 1) {
      margin-left: 0 !important;
    }
  }
}
</style>
