<template>
  <div class="com-wrapper">
    <!-- banner -->
    <div class="relative" @mouseenter="bannerHover = true" @mouseleave="bannerHover = false">
      <!-- 编辑状态 -->
      <template v-if="edit">
        <!-- 显示banner -->
        <template v-if="isShowBanner">
          <el-carousel height="105px">
            <el-carousel-item v-for="(item,i) in dict.bannerData.modules" :key="i">
              <!-- <img :src="item.moduleImgUrl" alt /> -->
              <img :src="getSpecialImg(item.moduleImgId, 'href')" alt />
            </el-carousel-item>
          </el-carousel>
        </template>
        <!-- 不显示banner -->
        <div v-else class="banner-empty">
          <div class="empty-zw">
            <!-- <span>+ 添加轮播图</span> -->
            <span>轮播图</span>
          </div>
        </div>
        <item-hover :type="bannerHoverType" :show="bannerHover" @change="bannerHoverClick" />
      </template>
      <!-- 只读状态 -->
      <template v-else>
        <el-carousel v-if="isShowBanner" height="105px">
          <el-carousel-item v-for="(item,i) in dict.bannerData.modules" :key="i">
            <!-- <img :src="item.moduleImgUrl" alt /> -->
            <img :src="getSpecialImg(item.moduleImgId, 'href')" alt />
          </el-carousel-item>
        </el-carousel>
      </template>
    </div>

    <!-- 九宫格 -->
    <NineMenuView :data="dict.nineMenuData" :showType="showType" @change="nineMenuHoverClick" />

    <div
      class="com-box"
      :style="{
        marginTop: Number(column.columnIntervalShow) === 0 ? '20px' : 0
      }"
      v-for="(column, index) in dict.columnList"
      :key="column.columnId"
    >
      <div class="com-name">
        <span
          class="ellipsis"
          style="max-width: 250px"
         v-if="column.columnNameShowStatus != 1 && column.columnName"
        >{{ column.columnName }}</span>
        <span></span>
        <span class="com-more" v-if="column.more">更多</span>
      </div>
      <!-- 功能栏目 -->
      <template v-if="column.columnCategory === 'module'">
        <div v-if="column.columnCategoryValue === 'XBJH'">
          <div
            class="items function-XBJH"
            @mouseenter="handleEnterLeave(column, true)"
            @mouseleave="handleEnterLeave(column, false)"
          >
            <div class="item-wrapper" v-for="(module, j) in functionXbjhData" :key="j">
              <div class="item">
                <div class="item-img">
                  <img :src="module.moduleImgId" alt />
                </div>
                <div class="item-right">
                  <p class="ellipsis">{{ module.moduleName }}</p>
                </div>
              </div>
            </div>
            <item-hover
              type="3"
              v-if="edit"
              :show="column.hover"
              :isTop="index === 0"
              :isBottom="index === dict.columnList.length - 1"
              @change="handleChange($event, column, index)"
            ></item-hover>
          </div>
        </div>
        <div v-else>
          <div
            class="items"
            style="padding: 5px 0;"
            @mouseenter="handleEnterLeave(column, true)"
            @mouseleave="handleEnterLeave(column, false)"
          >
            <div class="item-wrapper" v-for="(v, j) in Number(column.columnContentShowRow)" :key="j">
              <div class="item">
                <div class="item-img" :class="['item-bg-'+column.columnCategoryValue]"></div>
              </div>
            </div>
            <item-hover
              type="3"
              v-if="edit"
              :show="column.hover"
              :isTop="index === 0"
              :isBottom="index === dict.columnList.length - 1"
              @change="handleChange($event, column, index)"
            ></item-hover>
          </div>
        </div>
      </template>
      <!-- 普通栏目 -->
      <template v-else>
        <template v-for="(style, i) in styleList">
          <div :class="style.styleName" v-if="column.columnStyle == i" :key="style.styleName">
            <el-scrollbar height="120px;" width="99%;" v-if="Number(column.columnStyle) === 4">
              <div style="min-width: 100%">
                <div
                  class="items"
                  @mouseenter="handleEnterLeave(column, true)"
                  @mouseleave="handleEnterLeave(column, false)"
                  :style="`width: ${handleWidth(column)}px;min-width: 100%`"
                  v-if="column.modules"
                >
                  <div class="item-wrapper" v-for="(module, j) in handleModules(column, style)" :key="j">
                    <div class="item">
                      <div class="item-img">
                        <img :src="getSpecialImg(module.moduleImgId, 'href')" alt />
                      </div>
                      <div class="item-right">
                        <p class="item-title ellipsis">{{ module.moduleName }}</p>
                      </div>
                    </div>
                  </div>
                  <item-hover
                    type="3"
                    v-if="edit"
                    :show="column.hover"
                    :isTop="index === 0"
                    :isBottom="index === dict.columnList.length - 1"
                    @change="handleChange($event, column, index)"
                  ></item-hover>
                </div>
              </div>
            </el-scrollbar>
            <template v-else>
              <div
                class="items"
                @mouseenter="handleEnterLeave(column, true)"
                @mouseleave="handleEnterLeave(column, false)"
                v-if="column.modules"
              >
                <div class="item-wrapper" v-for="(module, j) in handleModules(column, style)" :key="j">
                  <div class="item">
                    <div class="item-img">
                      <img :src="getSpecialImg(module.moduleImgId, 'href')" alt />
                    </div>
                    <div class="item-right">
                      <p class="item-title ellipsis">{{ module.moduleName }}</p>
                    </div>
                  </div>
                </div>
                <item-hover
                  type="3"
                  v-if="edit"
                  :show="column.hover"
                  :isTop="index === 0"
                  :isBottom="index === dict.columnList.length - 1"
                  @change="handleChange($event, column, index)"
                ></item-hover>
              </div>
            </template>
          </div>
        </template>
      </template>
    </div>
    <div class="com-button add-com" v-if="edit" @click="$emit('changeHandle')">
      <div class="button">添加模块</div>
    </div>
  </div>
</template>

<script>
import { getSpecialImg } from '@/util/utils'
import CompItemHoverSetting from './CompItemHoverSetting.vue'
import NineMenuView from './NineMenuView.vue'
export default {
  props: {
    showType: {
      type: String,
      default: '2.2'
    },
    // type: {
    //   type: String,
    //   default: 'readOnly'
    // },
    // dict: {
    //   type: Object,
    //   default: () => ({ banners: [], columnList: [] })
    // }
    dict: {
      type: Object,
      default: () => ({
        bannerData: {},
        nineMenuData: {},
        columnList: []
      })
    }
  },
  components: {
    'item-hover': CompItemHoverSetting,
    NineMenuView
  },
  data() {
    return {
      getSpecialImg,
      styleList: [
        { styleName: 'first', rowNums: 1 },
        { styleName: 'second', rowNums: 1 },
        { styleName: 'third', rowNums: 2 },
        { styleName: 'fourth', rowNums: 3 },
        { styleName: 'fifth', rowNums: 1 }
      ],
     functionXbjhData: [
        { id: 1, moduleName: '精品课程', moduleImgId: require('@/assets/svg/xb-jpkc.svg') },
        { id: 2, moduleName: '智慧拼图', moduleImgId: require('@/assets/svg/xb-zhpt.svg') },
        { id: 3, moduleName: 'PK达人', moduleImgId: require('@/assets/svg/xb-pkdr.svg') },
        { id: 4, moduleName: '金币兑换', moduleImgId: require('@/assets/svg/xb-jbdh.svg') },
        { id: 5, moduleName: '论坛', moduleImgId: require('@/assets/svg/xb-lt.svg') }
      ],
      functionItemImg: {
        ZX: require('@/assets/images/func-zx.svg'), // 资讯
        ZNZB: require('@/assets/images/func-znzb.svg'), // 知鸟直播
        ZNBXK: require('@/assets/images/func-znzb.svg') // 知鸟必修课
      },
      bannerHover: false
    }
  },
  methods: {
    handleChange(type, column, index) {
      const columns = this.dict.columnList
      let item
      switch (type) {
        case 'start':
          item = columns.splice(index, 1)
          columns.unshift(...item)
          break
        case 'front':
          item = columns.splice(index, 1)
          columns.splice(index - 1, 0, ...item)
          break
        case 'edit':
          this.$set(column, 'hover', false)
          this.$emit('change', column)
          break
        case 'remove':
          columns.splice(index, 1)
          break
        case 'back':
          item = columns.splice(index, 1)
          columns.splice(index + 1, 0, ...item)
          break
        case 'end':
          item = columns.splice(index, 1)
          columns.push(...item)
          break
        default:
          break
      }
    },
    handleEnterLeave(obj, flag) {
      if (!this.edit) return
      this.$set(obj, 'hover', flag)
    },
    handleWidth(column) {
      if (Number(column.columnContentShowRow) === -1) {
        return column.modules.length
      }
      return Number(column.columnContentShowRow)
    },
   handleModules(column, { rowNums }) {
      let end
      if (Number(column.columnContentShowRow) === -1) {
        end = column.modules.length
      } else {
        end = rowNums * Number(column.columnContentShowRow)
      }
      const result = column.modules.slice(0, end)
      if (column.modules.length > result.length) {
        this.$set(column, 'more', true)
      } else {
        this.$set(column, 'more', false)
      }
      return result
    },
    // 编辑/显示/隐藏
    bannerHoverClick(type) {
      this.bannerHover = false
      this.$emit('editBanner', type)
    },
    // 编辑/显示/隐藏
    nineMenuHoverClick(type) {
      this.$emit('editNineMenu', type)
    },
  },
  computed: {
    edit() {
      return this.showType === '2.2'
      // return this.type === 'edit'
    },
    isShowBanner() {
      return this.dict.bannerData?.modules?.length && this.dict.bannerData?.columnShow === 'Y'
    },
    bannerHoverType() {
      return this.dict.bannerData?.columnShow === 'Y' ? '5' : '6'
    }
  }
}
</script>

<style lang="scss" scoped>
.com-wrapper {
  width: 330px;
  margin: auto;

  .banner-empty {
    padding: 15px;
    .empty-zw {
      height: 105px;
      border: 2px dashed #ddd;
      border-radius: 5px;
      text-align: center;
      line-height: 100px;
      font-size: 18px;
      color: #d0d0d0;
   }
  }

  .com-box {
    margin: auto;
  }

  :deep(.el-carousel) {
    padding: 15px;
    img {
      border-radius: 4px;
    }
  }
  :deep(.el-carousel__indicators) {
    width: fit-content;
    margin-bottom: 10px;
  }

  .com-name {
    display: flex;
    padding: 15px 15px 0;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }
  .com-more {
    font-size: 12px;
    color: #fd6720;
  }
  .com-button {
    .button {
      display: flex;
      width: 300px;
      margin: auto;
      height: 30px;
      justify-content: center;
      align-items: center;
      background-color: #fd6720;
      color: #fff;
      cursor: pointer;
    }
  }
  .item-title {
    font-size: 16px;
    font-weight: 500;
  }

  .items {
    position: relative;
  }
  .function-XBJH {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    .item-img {
      // background: #f0f0f0;
      padding: 5px;
      border-radius: 10px;
    }
    .item-right {
      text-align: center;
      line-height: 30px;
    }
  }
  .item-bg-ZX {
    background-image: url('../../../assets/images/func-zx.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: -15px;
    height: 70px;
  }
  .item-bg-ZNZB {
    background-image: url('../../../assets/images/func-znzb.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: -15px;
    height: 105px;
  }
  .item-bg-ZNBXK {
    background-image: url('../../../assets/images/func-znkc.svg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: -15px;
    height: 70px;
  }

  :deep(.hover-container) {
    border: none;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .first {
    .items {
      .item {
        display: flex;
        height: 112px;
        padding: 11px 15px;
      }
      .item-img {
        width: 90px;
        margin-right: 14px;
        flex-shrink: 0;
      }
      .item-right {
        width: 193px;
        height: 64px;
        margin-top: 12px;
      }
      .item-content {
        margin-top: 10px;
        color: rgba($color: #000000, $alpha: 0.6);
      }
    }

    .com-button {
      padding: 9px 0 18px;
    }
  }

  .second {
    .items {
      .item {
        padding: 0 15px;
      }
      .item-img {
        height: 130px;
        margin-top: 15px;
      }
      .item-title {
        margin-top: 10px;
        font-weight: 400;
      }
    }
    .com-button {
      padding: 15px 0 20px;
    }
  }
  .third {
    .items {
      display: flex;
      flex-wrap: wrap;
      .item-wrapper {
        width: 50%;
        height: 133px;
        padding: 6px 10px;
        &:nth-child(2n - 1) {
          padding-left: 15px;
        }
       &:nth-child(2n) {
          padding-right: 15px;
        }
      }
      .item-img {
        height: 90px;
      }
      .item-title {
        margin-top: 10px;
        font-weight: 400;
      }
    }
    .com-button {
      padding: 20px 0;
    }
  }
  .fourth {
    .items {
      display: flex;
      flex-wrap: wrap;
      .item-wrapper {
        width: 110px;
        height: 123px;
        padding: 10px 15px;
      }
      .item-img {
        height: 80px;
      }
      .item-title {
        margin-top: 8px;
        font-weight: 400;
      }
    }
    .com-button {
      padding: 20px 0;
    }
  }
  .fifth {
    padding-bottom: 10px;
    .items {
      display: flex;
      height: 120px;
      position: relative;
      .item-wrapper {
        width: 136px;
        height: 120px;
        padding: 10px 15px 0;
        flex-shrink: 0;
      }
      .item-img {
        height: 80px;
      }
      .item-title {
        margin-top: 8px;
        font-weight: 400;
      }
      :deep(.hover-container) {
        justify-content: center;
      }
    }
    .com-button {
      padding: 20px 0;
    }
    :deep(.el-scrollbar__wrap) {
      overflow-x: auto;
      height: 127px;
    }
    :deep(.el-scrollbar__wrap .el-scrollbar__view) {
      display: flex;
    }
    :deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb) {
      background-color: #fff;
    }
  }

  .add-com {
    padding: 10px 0 20px;
  }
}
</style>
