<template>
  <div class="statementCentre">
    <el-card>
      <div
        class="item"
        v-for="(menuItems, i) in menuList"
        :key="menuItems.menuName"
        :class="{ mt20: i > 0 }"
      >
        <div class="title">
          <span class="title__menu"></span>
          {{ menuItems.menuName }}
          <span class="shallow">({{ menuItems.childMenus.length }})</span>
        </div>
        <div class="item-content df">
          <div
            class="item-menu"
            v-for="item in menuItems.childMenus"
            :key="item.menuName"
            @click="goPath(item.menuLink)"
          >
            {{ item.menuName }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addAllowKeepAlive } from '@/util/utils'
export default {
  name: 'TrainerManagement',
  data() {
    return {}
  },
  methods: {
    goPath(path) {
      addAllowKeepAlive(path)
      this.$router.push(path)
    }
  },
  computed: {
    menuList() {
      const menuId = '21200000002'
      const thirdLvlMenuList = this.$store.state.userInfo.thirdLvlMenuList || []
      const fourLvlMenuList = this.$store.state.userInfo.fourLvlMenuList || []
      const list = thirdLvlMenuList.filter((v) => v.prnMenuId === menuId)
      list.forEach((v) => {
        const childMenus = fourLvlMenuList.filter(
          (c) => c.prnMenuId === v.menuId
        )
        v.childMenus = childMenus
      })
      return list || []
    }
  }
}
</script>

<style lang="scss">
// @import '@/assets/commonScss/common-variate.scss';
.statementCentre {
  .item-content {
    padding: 0 0 30px 17px;
    border-bottom: 1px solid $line-color;

    .item-menu {
      margin: 20px 15px 0 0;
    }
  }
}
</style>