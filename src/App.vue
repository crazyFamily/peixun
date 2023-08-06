<template>
  <div id="app" class="frame-wrapper app" v-show="!FLAG || isShow">
    <span id="copyLocationButton" ref="copyBtn" :data-clipboard-text="location" @click="copy" style="display: none;">复制</span>
    <el-container v-if="noFullScreen">
      <el-aside width="auto">
        <Aside />
      </el-aside>
      <el-container>
        <el-header>
          <TopNav v-if="!isError" />
        </el-header>
        <el-main>
          <keep-alive :include="keepAliveComponents">
            <router-view />
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
    <el-container v-else class="full-screen">
      <router-view />
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { hintFrame, customHint, formatLocationQuery } from '@/util/utils'
import TopNav from '@/components/TopNav'
import Aside from '@/components/Aside'
import Clipboard from 'clipboard'
import store from './store'

export default {
  name: 'Home',
  components: {
    TopNav,
    Aside
  },
  data() {
    return {
      isError: false,
      noFullScreen: true,
      FLAG: window.__FLAG__,
      isShow: false,
      location: window.location.href,
    }
  },
  mounted() {
    // 设置标题
    document.title = '培训系统'
    const UA = window.navigator.userAgent.toLowerCase()
    const isIE = /msie|trident/.test(UA)
    const isEdge = UA.indexOf('edge/') > 0
    
    if (isIE || isEdge) {
 // hintFrame('本系统已不支持IE浏览器，请使用谷歌浏览器')
      customHint('本系统已不支持IE浏览器，请使用谷歌浏览器', '提示', '', false, '复制链接')
      .then(() => {
        this.$refs.copyBtn.click()
      })
    }
  },
  beforeMount() {
    // 需求变更，需要加入一个标识作为区分
    const query = formatLocationQuery()
    if (query.keep) return
    if (window.__FLAG__) return
    if (process.env.VUE_APP_LOCAL === '1') return
    this.$router.replace('/')
  },
  created() {
    this.$wenEvent.$on('fullScreen', (state) => {
      this.noFullScreen = state
    })
    this.$wenEvent.$on('show', () => {
      this.isShow = true
    })
  },
  watch: {
    $route(to, from) {
 this.isError = to.path.indexOf('error') >= 0
      if (!this.isError) this.isError = from.path.indexOf('error') >= 0
    },
    '$store.state.app.isFullScreen': {
      handler(n) {
        this.noFullScreen = !n
      },
      immediate: true
    }
  },
  computed: {
    keepAliveComponents() {
      return this.$store.getters.keepAliveComponents.map((v) => v.componentName)
    },
  },
  methods: {
    copy() {
      const clipboard = new Clipboard('#copyLocationButton')
      clipboard.on('success', e => {
        this.$message.success('复制成功')
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        this.$message.warning('复制失败')
        clipboard.destroy()
      })
    },
  }
}
</script>
<style lang="scss">
@import './assets/commonScss/common.scss';
.tutor-allowance-popper {
  background-color: #233545 !important;
  .tutor-allowance-items {
    color: #7d8292;
    line-height: 30px;
    cursor: pointer;
  }
}
.full-screen {
  height: 100%;
  .establish__start-attendance {
    width: 100%;
  }
}
.el-header {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 20;
}
.el-aside {
  background: #233545;
  overflow: visible !important;
}
.el-main {
  height: calc(100vh - 60px);
}
.el-loading-spinner {
  .el-loading-text {
    margin-top: 14px;
    padding-left: 6px;
    font-size: 16px !important;
  }
}
</style>
