<template>
  <div class="case-push">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import CasePushList from './CasePushList.vue'
import AddCasePush from './AddCasePush.vue'
import { CopyObj } from '@/util/utils'
export default {
  name: 'CasePush',

  props: {},

  data() {
    return {
      currentRouter: '/CasePushList',
      list: []
    }
  },

  watch: {
    '$route.path'(n, o) {
      !this.list.length && (this.list = this._initList())
      let list = this.list
      if (!list.includes(o) && list.includes(n)) {
        this.$router.push(this.currentRouter)
      } else if (list.includes(this.$route.path)) {
        this.currentRouter = this.$route.path
      }
    }
  },

  components: {
    CasePushList,
    AddCasePush
  },

  computed: {},

  mounted() {},

  methods: {
    change(value) {
      this.currentRouter = value
    },
    _initList() {
      return CopyObj(
        this.$router.options.routes
          .find((item) => item.name === '案例推送')
          .children.map((item) => item.path)
      )
    }
  }
}
</script>
<style lang='scss' scoped>
.search-card__button {
  float: right;
  margin-bottom: 20px;
}

.search-card {
  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}
</style>
