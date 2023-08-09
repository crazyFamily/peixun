<template>
  <!-- 九宫格 -->
  <div>
    <!-- {{iconSize}} -->
    <!-- {{showType}}-{{colSpan}}-{{nineMenus}} -->
    <!-- {{showMenu}} - {{nineMenuHoverType}} - {{nineMenuHover}} -->
    <!-- 首页预览 , 首页配置-预览,  菜单编辑-->
    <div v-if="(['1', '2.1'].includes(showType) && showMenu) || showType == '3'" 
      class="nine-menu-wrapper" :class="{'preview': showType === '3'}">
      <div class="menu-flex">
        <div class="menu-item" :class="[colSpan]" v-for="(menu,index) in nineMenus" :key="index">
          <div class="icon-box">
            <template v-if="menu.moduleImgId">
              <img v-if="menu.moduleImgId.indexOf('.') < 0" class="menu-icon" :src="handleUdmpHref(menu.moduleImgId)" />
              <img v-else class="menu-icon" :src="require('@/assets/nineMenuIcon/' + menu.moduleImgId)" />
            </template>
            <span v-else class="menu-icon"></span>
            <!-- <img v-if="menu.moduleImgId" class="menu-icon" :src="handleUdmpHref(menu.moduleImgId)" alt />
            <img v-else class="menu-icon" />  -->
          </div>
          <div>{{menu.moduleName}}</div>
        </div>
      </div>
      <div class="menu-empty" v-if="nineMenus.length <= 0">
        <span>暂无数据</span>
      </div>
    </div>
    <!-- 首页配置-编辑 2.2 -->
    <div v-if="showType == '2.2'" class="nine-menu-wrapper" 
      @mouseenter="nineMenuHover = true" 
      @mouseleave="nineMenuHover = false">
      <div class="menu-flex">
        <template v-if="showMenu">
          <div class="menu-item" :class="[colSpan]" v-for="(menu,index) in nineMenus" :key="index">
            <div class="icon-box">
              <template v-if="menu.moduleImgId">
                <img v-if="menu.moduleImgId.indexOf('.') < 0" class="menu-icon" :src="handleUdmpHref(menu.moduleImgId)" />
                <img v-else class="menu-icon" :src="require('@/assets/nineMenuIcon/' + menu.moduleImgId)" />
              </template>
              <!-- <img class="menu-icon" :src="handleUdmpHref(menu.moduleImgId)" alt /> -->
              <!-- <img class="menu-icon" /> -->
            </div>
            <div>{{menu.moduleName}}</div>
          </div>
        </template>
        <div v-else class="menu-item" :class="[colSpan]" >
          <div class="icon-box">
            <span class="menu-icon menu-add">+</span>
          </div>
          <div>添加入口</div>
        </div>
      </div>
      <item-hover :type="nineMenuHoverType" :show="nineMenuHover" @change="hoverClick" />
    </div>
  </div>
</template>
<script setup>
import CompItemHoverSetting from './CompItemHoverSetting.vue'
import { ref, reactive, computed } from 'vue'
import { handleUdmpHref } from '@/util/utils'

const itemHover = CompItemHoverSetting
// 初始化功能
const props = defineProps({
  /**
   * 1：home-preview，首页预览
   * 2.1：home-setting-preview，首页配置-预览
   * 2.2：home-setting-edit, 首页配置-编辑
   * 3：menu-edit，菜单编辑
   */
  showType: {
    type: String,
    // default: '1', // 1 , 2.1 , 2.2 ,3 
  },
  data: {
    type: Object,
    default: () => {}
  }
})

// ======================== 九格宫 ========================

// 确认显示4个，还是5个
const colSpan = computed(() => {
  // 大小图标
  const iconSize = props.data?.iconSize || 'small'
  return iconSize === 'small' ? 'col-5' : 'col-4'
})
// banner列表
const nineMenus = computed(() => props.data?.modules)

// 配置是否 九格宫
const showMenu = computed(() => props.data?.modules?.length && props.data?.columnShow == 'Y')

//  5：隐藏， 6：显示
const nineMenuHoverType = computed(() => props.data?.columnShow == 'Y' ? '5' : '6')

// 是否显示over
const nineMenuHover = ref(false)

const emits = defineEmits(['editSetting', 'swichPage', 'change'])

// 编辑/显示/隐藏
function hoverClick (type) {
  nineMenuHover.value = false
  emits('change', type)
}

</script>
<style lang="scss" scoped>

.nine-menu-wrapper {
  position: relative;
  background: rgb(248, 248, 248);
  // padding: 15px;
	&.preview {
		width: 350px;
		margin: 10px auto;
		padding: 1px;
		// border: 1px solid #d0d0d0;
		border-radius: 5px;
    box-shadow: 2px 2px 10px #d0d0d0;
	}
  .menu-flex {
    padding: 5px;
    border-radius: 5px;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    .menu-item {
      position: relative;
      text-align: center;
      .icon-box {
        padding: 5px;
        .menu-icon {
          width: 100%;
          height: 40px;
        }
        .menu-add {
          border-radius: 24px;
          line-height: 42px;
          display: inline-block;
          border: 1px #929090 dashed !important;
          vertical-align: middle;
          color: #929090;
        }
      }
    }
    .col-4 {
      width: calc(100% / 4);
    }
    .col-5 {
      width: calc(100% / 5);
    }
  }
  .menu-empty {
      padding: 20px;
      text-align: center;
      line-height: 50px;
      font-size: 18px;
      color: #ddd;
      background: #fff;
    }
}
</style>
