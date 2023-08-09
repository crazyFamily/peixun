<template>
  <el-drawer
    :visible.sync="isSettingShow"
    :close-on-press-escape="false"
    :wrapper-closable="false"
    class="setting-drawer"
    size="85%"
  >
    <div class="setting-container">
      <div class="router-list">
        <el-scrollbar style="height: 100%">
          <div
            class="router-container"
            v-for="item in routerList"
            :key="item.menuId"
          >
            <div class="title">{{ item.menuName }}</div>
            <div class="menu-container">
              <div
                class="menu-item"
                v-for="menuItem in item.childMenus || []"
                :key="menuItem.menuId"
              >
                <el-checkbox
                  class="ml10"
                  v-model="menuItem.isChecked"
                  @change="menuSelectedHandle($event, menuItem, item)"
                  >{{ menuItem.menuName }}</el-checkbox
                >
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="select-router">
        <el-scrollbar style="height: 100%">
          <div class="title">
            常用（{{ selectMenuMap.size }}/{{ maxSelectCount }}）拖动可排序
          </div>
          <div class="select-list" ref="selectList">
            <div
              class="dfcc select-item drop"
              v-for="item in selectMenuMap.values()"
              :key="item.menuId"
              :data-id="item.menuId"
            >
              <i
                class="close-btn el-icon-error"
                @click="cancelSelectHandle(item)"
              ></i>
              <img
                class="router-icon"
                :src="require('@/assets/svg/' + item.icon)"
                alt=""
                v-if="item.icon"
              />
              <p class="router-name">{{ item.menuName }}</p>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="dfcc setting-footer">
      <el-button class="button-w80-h30" @click="settingCloseHandle"
        >取消</el-button
      >
      <el-button class="button-w80-h30" type="primary" @click="saveHandle"
        >保存</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import { CopyObj } from '@/util/utils'
import { ROUTER_ICON } from '@/util/constants'
import Sortable from 'sortablejs'
import { fetchModifyEmployeeCustomMenu } from '@/fetch/home'
// 常用模块
export default {
  name: 'CompCustomLink',

  props: {
    show: {
      type: Boolean,
      required: true
    },
    menuList: {
      type: Array,
      default: []
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isSettingShow = n
        if (n) {
          this._initSortable()
          let { menuInfoList } = this.formatRouteList()
          this.routerList = menuInfoList || this.routerList
          this._formatMenuList(this.menuList)
        }
      },
      immediate: true
    }
  },

  data() {
    return {
      isSettingShow: false,
      routerList: [],
      maxSelectCount: 8,
      selectMenuMap: new Map(),
      sortableEl: null
    }
  },

  components: {},

  computed: {},

  mounted() {
    // let { menuInfoList } = this.formatRouteList()
    // this.routerList = menuInfoList || this.routerList
  },

  methods: {
    _initSortable() {
      if (!this.isSettingShow || this.sortableEl) return
      this.$nextTick(() => {
        let selectList = this.$refs.selectList
        this.sortableEl = new Sortable(selectList, {
          handle: '.drop',
          filter: '.filter',
          // dataIdAttr: 'data-id',
          animation: 150,
          onEnd(event) {},
          onMove(event) {}
        })
      })
    },
    settingCloseHandle() {
      // this.$data = this.$options.data.call(this)
      for (let key in this.$data) {
        this.$data[key] = this.$options.data.call(this)[key]
      }
      this.$emit('update:show', false)
      this.$emit('close')
    },
    _formatMenuList(list) {
      this.selectMenuMap
      list.forEach((item) => {
        item.icon = 'shouye-baobiaozhongxin.svg'
        this.selectMenuMap.set(item.menuId, item)
        this._setMenuStatus(item, true)
      })
    },
    formatRouteList() {
      let { fourLvlMenuList, menuInfoList, thirdLvlMenuList } = CopyObj(
        this.$store.state.userInfo
      )
      // 需要特殊处理 如果菜单是一级菜单，则自动处理为同名二级菜单
      menuInfoList = menuInfoList.map((item) => {
        // 初始化
        !Array.isArray(item.childMenus) && (item.childMenus = [])
        // 进入二级进行层级找寻
        let chirdMap = new Map()
        item.childMenus.forEach((childItem) => {
          let chirdItems = this._findLvLeafItem(childItem.menuId, {
            fourLvlMenuList,
            menuInfoList,
            thirdLvlMenuList
          })
          chirdItems.length && chirdMap.set(childItem.menuId, chirdItems)
        })
        chirdMap.forEach((mapItem, id) => {
          // 把childMenus中的menuId与id匹配的移除，再插入mapItem
          let itemIndex = item.childMenus.findIndex(
            (childItem) => childItem.menuId === id
          )
          item.childMenus.splice(itemIndex, 1, ...mapItem)
        })

        if (!item.childMenus.length) {
          return {
            ...item,
            childMenus: [item]
          }
        }
        return item
      })

      return { fourLvlMenuList, menuInfoList, thirdLvlMenuList }
    },
    // 根据第二级的id去第三级菜单找到对应第三级，再遍历第三级菜单去找第四级，如果找到第四级菜，则返回第四级子菜单，否则返回第三级
    _findLvLeafItem(id, menuMap) {
      let thirdList = []
      let fourList = []
      let thirdItems = menuMap.thirdLvlMenuList.filter(
        (item) => item.prnMenuId === id
      )
      if (thirdItems.length) {
        thirdList = thirdItems
        thirdItems.forEach((thirdItem) => {
          let fourItems = menuMap.fourLvlMenuList.filter(
            (item) => item.prnMenuId === thirdItem.menuId
          )
          fourItems.length && (fourList = fourList.concat(fourItems))
        })
      }
      if (fourList.length) {
        return fourList
      }
      return thirdList
    },
    menuSelectedHandle(value, item, parentItem) {
      if (!value && this.selectMenuMap.size === 1) {
        item.isChecked = true
        return this.$message.warning(`最少要保留一个`)
      }
      if (value && this.selectMenuMap.size >= this.maxSelectCount) {
        item.isChecked = false
        return this.$message.warning(`最多只能选择${this.maxSelectCount}个`)
      }
      let routeIcon =
        ROUTER_ICON.find((item) => item.label === parentItem.menuName) || {}
      item.icon = routeIcon.icon
      if (value) {
        this.selectMenuMap.set(item.menuId, item)
      } else {
        this.selectMenuMap.delete(item.menuId)
      }
    },
    async saveHandle() {
      try {
        await this.saveTips()
        let sortList = this.sortableEl.toArray()
        let resultList = []
        sortList.forEach((item, index) => {
          let { menuId, icon } = this.selectMenuMap.get(item)
          resultList.push({ menuId, pageSort: index, icon })
        })
        await fetchModifyEmployeeCustomMenu({ menus: resultList })
        this.$message.success('保存成功')
        this.settingCloseHandle()
      } catch (error) {}
    },
    // 保存操作的二次提示
    saveTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定设置选中项', '提示', {
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
    cancelSelectHandle(item) {
      if (this.selectMenuMap.size === 1) {
        return this.$message.warning(`最少要保留一条`)
      }
      this.selectMenuMap.delete(item.menuId)
      this._setMenuStatus(item, false)
    },
    _setMenuStatus(item, status) {
      this.routerList.forEach((routerItem, routerIndex) => {
        routerItem.childMenus.forEach((menuItem, menuIndex) => {
          if (menuItem.menuId === item.menuId) {
            menuItem.isChecked = true
            this.$set(this.routerList[routerIndex].childMenus, menuIndex, {
              ...menuItem,
              isChecked: status
            })
          }
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.setting-drawer {
  :deep(.el-drawer__header) {
    display: none;
  }
}

$main-padding: 15px;
$footer-height: 60px;
$count: $footer-height + ($main-padding * 2);
.setting-container {
  height: calc(100vh - #{$footer-height});
  padding: $main-padding;
  background-color: $background-color;
  box-sizing: border-box;
  display: flex;
}

%router-title {
  font-family: inherit;
  position: relative;
  padding-left: 10px;
  &::before {
    content: '';
    width: 2px;
    height: 10px;
    display: block;
    background-color: $themeColor;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
.router-list {
  height: calc(100vh - #{$count});
  padding: 20px;
  padding-right: 10px;
  flex: 1;
  background-color: #fff;
  box-sizing: border-box;

  .title {
    @extend %router-title;
  }

  .menu-container {
    display: flex;
    flex-wrap: wrap;
    margin: 5px 0;
  }

  .menu-item {
    width: 33.33%;
    margin: 5px 0;
  }
}

.select-router {
  width: 500px;
  height: calc(100vh - #{$count});
  padding: 20px;
  padding-right: 10px;
  margin-left: 10px;
  background-color: #fff;
  box-sizing: border-box;
  .title {
    @extend %router-title;
  }

  .select-list {
    // padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
  }

  .select-item {
    width: 115px;
    height: 115px;
    flex-direction: column;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0 2px 10px 4px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    position: relative;

    .router-icon {
      width: 45%;
      margin-bottom: 10px;
    }

    .router-name {
      width: 85%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
    }

    .close-btn {
      color: rgb(#000, 0.1);
      font-size: 20px;
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
    }
  }
}

.setting-footer {
  height: 60px;
  padding: 0 20px;
  justify-content: flex-end;
}
</style>
