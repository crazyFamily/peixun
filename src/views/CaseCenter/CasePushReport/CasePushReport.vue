<template>
  <keep-alive>
    <component
      :is="currentComp"
      @change="changeToDetail"
      :detail-data="detailData"
    ></component>
  </keep-alive>
</template>

<script>
import CasePushIndex from './CasePushIndex'
import CasePushDetail from './CasePushDetail'
export default {
  name: 'CasePushReport',

  props: {},

  data() {
    return {
      currentComp: 'CasePushIndex',
      detailData: {}
    }
  },

  components: {
    CasePushIndex,
    CasePushDetail
  },

  computed: {},

  mounted() {},

  methods: {
    changeToDetail(type, row) {
      if (type === 'detail') {
        this.currentComp = 'CasePushDetail'
        this.detailData = row
      }
      if (type === 'list') {
        this.currentComp = 'CasePushIndex'
      }
    }
  },
  activated() {
    if (this.$route.params.isNew) {
      this.currentComp = 'CasePushIndex'
    }
  }
  // beforeRouteEnter(t, f, next) {
  //   if (f.path === '/CasePushList') {
  //     next((vm) => {
  //       console.log(vm.$vnode.componentInstance.$destroy, ' --- vm.$vnode')
  //       vm.$vnode.componentInstance.$destroy()
  //     })
  //   } else {
  //     next()
  //   }
  // }
}
</script>
<style lang='scss' scoped>
</style>
