<template>
  <div class="com-wrapper">
    <div
      class="relative"
      @mouseenter="handleEnterLeave(dict, true)"
      @mouseleave="handleEnterLeave(dict, false)"
    >
      <el-carousel height="105px">
        <el-carousel-item v-for="item in dict.banners" :key="item.id">
          <img :src="getSpecialImg(item.udmpUrl)" alt="" />
        </el-carousel-item>
      </el-carousel>
      <item-hover
        type="2"
        v-if="edit"
        :show="dict.hover"
        @change="$set(dict, 'hover', false), $emit('editBanner')"
      ></item-hover>
    </div>
    <img src="@/assets/images/home-setting-nav.png" alt="" />
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
        >
          {{ column.columnName }}
        </span>
        <span></span>
        <span class="com-more" v-if="column.more">更多</span>
      </div>
      <template v-for="(style, i) in styleList">
        <div
          :class="style.styleName"
          v-if="column.columnStyle == i"
          :key="style.styleName"
        >
          <el-scrollbar
            height="120px;"
            width="99%;"
            v-if="Number(column.columnStyle) === 4"
          >
            <div style="min-width: 100%">
              <div
                class="items"
                @mouseenter="handleEnterLeave(column, true)"
                @mouseleave="handleEnterLeave(column, false)"
                :style="`width: ${handleWidth(column)}px;min-width: 100%`"
                v-if="column.modules"
              >
                <div
                  class="item-wrapper"
                  v-for="(module, j) in handleModules(column, style)"
                  :key="j"
                >
                 <div class="item">
                    <div class="item-img">
                      <img :src="getSpecialImg(module.moduleImgId, 'href')" alt="" />
                    </div>
                    <div class="item-right">
                      <p class="item-title ellipsis">
                        {{ module.moduleName }}
                      </p>
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
              <div
                class="item-wrapper"
                v-for="(module, j) in handleModules(column, style)"
                :key="j"
              >
                <div class="item">
                  <div class="item-img">
                    <img :src="getSpecialImg(module.moduleImgId, 'href')" alt="" />
                  </div>
                  <div class="item-right">
                    <p class="item-title ellipsis">
                      {{ module.moduleName }}
                    </p>
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
    </div>
    <div class="com-button add-com" v-if="edit" @click="$emit('changeHandle')">
      <div class="button">添加模块</div>
    </div>
  </div>
</template>

<script>
import { getSpecialImg } from '@/util/utils'
import CompItemHoverSetting from './CompItemHoverSetting.vue'
export default {
  props: {
    type: {
      type: String,
      default: 'readOnly'
    },
    dict: {
      type: Object,
      default: () => ({ banners: [], columnList: [] })
    }
  },
  components: {
    'item-hover': CompItemHoverSetting
  },
  data() {
    return {
      getSpecialImg,
      styleList: [
        {
          styleName: 'first',
          rowNums: 1
        },
        {
          styleName: 'second',
          rowNums: 1
        },
        {
          styleName: 'third',
          rowNums: 2
        },
        {
          styleName: 'fourth',
          rowNums: 3
        },
        {
          styleName: 'fifth',
          rowNums: 1
        }
      ]
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
    }
  },
  computed: {
    edit() {
      return this.type === 'edit'
    }
  }
}
</script>

<style lang="scss" scoped>
.com-wrapper {
  width: 330px;
  margin: auto;
  .com-box {
    margin: auto;
  }

  :deep(.el-carousel) {
    padding: 15px;
    background-color: rgb(248, 248, 248);
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
