<template>
  <div class="full">
    <el-card class="point-management-container full">
      <div class="item" v-for="menuItems in menuList" :key="menuItems.menuId">
        <div class="item-content df">
          <div class="item-menu" @click="goPath(menuItems.menuLink)">
            {{ menuItems.menuName }}
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addAllowKeepAlive } from '@/util/utils'
export default {
  name: 'PointManagement',

  props: {},

  data() {
    return {}
  },

  components: {},

  computed: {
    menuList() {
      let menuId = '21200000008'
      return this.$store.state.userInfo.thirdLvlMenuList.filter(
        (item) => item.prnMenuId === menuId
      )
    }
  },

  mounted() {},

  methods: {
    goPath(path) {
      addAllowKeepAlive(path)
      this.$router.push(path)
    }
  }
}
</script>
<style lang='scss' scoped>
.point-management-container :deep(.el-card__body) {
  display: flex;
  flex-wrap: wrap;

  .item {
    margin-right: 15px;
  }
}
</style>