<template>
  <el-scrollbar :class="scrollClass">
    <keep-alive>
        <component
          :is="currentRoute"
          @change="changeHandle"
          @save="saveHandle"
          @changeActive="changeActive"
          :module-data="moduleData"
        ></component>
    </keep-alive>
  </el-scrollbar>
</template>

<script>
import { CopyObj } from '@/util/utils'
import AddHomePageSetting from './AddHomePageSetting'
import HomePageSettingIndex from './HomePageSettingIndex'
export default {
  name: 'HomePageSetting',

  props: {},

  data() {
    return {
      currentRoute: 'HomePageSettingIndex',
      moduleData: {},
      homePageActive: 0
    }
  },

  components: {
    AddHomePageSetting,
    HomePageSettingIndex
  },

  computed: {
    scrollClass () {
      return `pageScrollHeight${this.homePageActive}`
    }
  },

  mounted() {},

  methods: {
    changeHandle(type) {
      if (type === 'editSetting') this.currentRoute = 'AddHomePageSetting'
      if (type === 'settingIndex') this.currentRoute = 'HomePageSettingIndex'
      if (['editSetting', 'editBanner', 'editNineMenu'].includes(type)) {
        this.$emit('showTabHeader', { flag: false } )
      } else {
        this.$emit('showTabHeader', { flag: this.homePageActive === 0 } )
      }
    },
    saveHandle(moduleData) {
      this.moduleData = CopyObj(moduleData)
    },
    changeActive (n) {
      console.log('active = ', n)
      this.homePageActive = n
      this.$emit('showTabHeader', { flag: n === 0 } )
    }
  }
}
</script>
<style lang="scss" scoped>
.pageScrollHeight0 {
  height: calc(100vh - 90px - 50px);
}
.pageScrollHeight1 {
  height: calc(100vh - 90px);
}
</style>
