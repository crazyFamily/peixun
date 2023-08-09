<template>
  <div class="home">
    <div class="section">
      <div class="banner df">
        <el-carousel>
          <el-carousel-item v-for="(item, index) in imgUrls" :key="index">
            <img :src="item" alt="" />
          </el-carousel-item>
        </el-carousel>
        <div class="recommend ml10">
          <div class="com-title title">重点推荐</div>
          <el-scrollbar style="height: calc(18vw - 50px)">
            <div class="items">
              <div
                class="item between"
                v-for="(item, index) in recommendList"
                :key="index"
                @click="openDialog(item)"
              >
                <div class="content aic">
                  <span class="dot4 mr10"></span>
                  <span>{{ item.title }}</span>
                </div>
                <div class="time tintColor">
                  {{ item.updatedDate }}
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="com-title title">
        <span class="title-label">常用模块</span>
        <span class="title-setting" @click="customLinkShow = true">设置</span>
      </div>
      <div class="items">
        <div
          class="item"
          v-for="item in moduleList"
          :key="item.menuId"
          @click="moduleLinkHandle(item)"
        >
          <div class="icon">
            <template v-if="item.icon">
              <img :src="require('@/assets/svg/' + item.icon)" alt="" />
            </template>
          </div>
          <div class="cxt">{{ item.menuName }}</div>
        </div>
      </div>
    </div>

    <!-- 检查审批人 dialog -->
    <gc-model
      :title="activeObj.isUpdateInfo ? '系统更新' : '重点推荐'"
      :visible.sync="visible"
      :show-close="false"
      width="800px"
      cancelText=""
      comfirmText="关闭"
    >
      <div class="home-dialog__frame-box">
        <el-scrollbar style="height: 50vh">
          <div class="box-title">
            {{ activeObj.title }}
          </div>
          <p class="tintColor tac">
            {{ activeObj.updateByName }} 发布于 {{ activeObj.updatedDate }} 浏览
            {{ activeObj.browseNum || 0 }}
          </p>
          <div class="fz16 mt10 w-e-text-container">
            <div class="w-e-text" v-html="activeObj.content"></div>
          </div>
          <div
            class="mt20"
            v-if="
              Array.isArray(activeObj.attachList) && activeObj.attachList.length
            "
          >
            <!-- <p>文件下载{{ activeObj.attachList.length }}</p> -->
            <p class="attach-title">附件</p>
            <div
              class="mt10"
              v-for="(item, key) in activeObj.attachList"
              :key="key"
            >
              <!-- <span>附件{{ key + 1 }}：</span> -->
              <a class="active" :href="item.fileUrl">
                {{ item.fileName }}
              </a>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </gc-model>
    <!-- 系统更新dialog -->
    <gc-model
      class="system-dialog"
      :visible.sync="systemDialog"
      :show-close="false"
      cancelText=""
      comfirmText="我知道了"
    >
      <template slot="title">
        <img
          class="header-img"
          src="@/assets/images/system-update.png"
          alt=""
        />
      </template>
      <!-- <template slot="title">
        <span class="el-dialog__title mr20">关联差旅订单</span>
      </template> -->
      <div class="system-dialog-container">
        <div class="home-dialog__frame-box content-container">
          <div class="box-title">
            {{ activeObj.title }}
          </div>
          <p class="tintColor tac">
            {{ activeObj.updateByName }} 发布于 {{ activeObj.updatedDate }} 浏览
            {{ activeObj.browseNum || 0 }}
          </p>
          <div class="fz16 mt10 w-e-text-container">
            <div class="w-e-text" v-html="activeObj.content"></div>
          </div>
          <div
            class="mt20"
            v-if="
              Array.isArray(activeObj.attachList) && activeObj.attachList.length
            "
          >
            <!-- <p>文件下载{{ activeObj.attachList.length }}</p> -->
            <p class="attach-title">附件</p>
            <div
              class="mt10"
              v-for="(item, key) in activeObj.attachList"
              :key="key"
            >
              <!-- <span>附件{{ key + 1 }}：</span> -->
              <a class="active" :href="item.fileUrl">
                {{ item.fileName }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <template slot="prend">
        <span class="close-tip">收起后还可以在右上角用户中心找到我哦！</span>
      </template>
      <!-- <template slot="footer">
        <div class="dfcc footer-container">
          <el-button
            class="button-w80-h30"
            type="primary"
            @click="systemDialog = false"
            >关闭</el-button
          >
          <span class="close-tip">收起后还可以在右上角用户中心找到我哦！</span>
        </div>
      </template> -->
    </gc-model>
    <comp-custom-link
      :show.sync="customLinkShow"
      :menu-list="moduleList"
      @close="customLinkCloseHandle"
    ></comp-custom-link>
  </div>
</template>
<script>
import 'wangeditor/src/assets/style/common.less'
import 'wangeditor/src/assets/style/text.less'
import { delayCall, addAllowKeepAlive, handleUdmpHref } from '../../util/utils'
import {
  fetchListRealInfo,
  fetchFindRealInfo
} from '@/fetch/informationManament'
import {
  fetchFindUserLastSystemUpdate,
  fetchSaveUserLastSystemUpdate,
  fetchAddRealInfoBrowseNum
} from '@/fetch/userCenter'
import CompCustomLink from './CompCustomLink.vue'
import { fetchListUserCustomMenu, fetchListHomePageBanner } from '@/fetch/home'
import { ROUTER_ICON } from '@/util/constants'
export default {
  name: '',
  data() {
    return {
      imgUrls: [],
      // 重点推荐数组
      recommendList: [],
      currentInfo: {},
      // 重点推荐标题
      title: '',
      // 重点推荐 dialog 状态
      visible: false,
      activeObj: {
        content: [],
        fileList: []
      },
      // 下载链接工具函数
      handleUdmpHref,
      iconMap: {
        报表中心: require('../../assets/svg/shouye-baobiaozhongxin.svg'),
        报销中心: require('../../assets/svg/shouye-baoxiaozhongxin.svg'),
        讲师管理: require('../../assets/svg/shouye-jiangshiguanli.svg'),
        课程管理: require('../../assets/svg/shouye-kechengguanli.svg'),
        培训计划管理: require('../../assets/svg/shouye-peixunjihuaguanli.svg'),
        培训项目管理: require('../../assets/svg/shouye-peixunxiangmuguanli.svg'),
        系统管理: require('../../assets/svg/shouye-xitongguanli.svg'),
        星火计划: require('../../assets/svg/shouye-xinghuojihua.svg'),
        培训师管理: require('../../assets/svg/peixunshi-yuan.svg'),
        私行财富学习管理: require('../../assets/svg/sicai-yuan.svg'),
        案例中心: require('../../assets/svg/anlizhongxin3.svg'),
        首页运营: require('../../assets/svg/anlizhongxin3.svg'),
        阶梯培训管理: require('../../assets/svg/jietipeixunguanli1.svg')
      },
      moduleList: [],
      // 查询资讯入参
      pcInfoParams: {
        condition: {
          type: 'home',
          status: 'publish'
        },
        currPage: 1,
        pageSize: 999,
        total: 0
      },
      customLinkShow: false,
      systemDialog: false
    }
  },
  components: {
    CompCustomLink
  },
  methods: {
    gopath(path) {
      addAllowKeepAlive(path)
      this.$router.push({
        path
      })
    },
    async openDialog(item, needFetch = true) {
      let res = item
      needFetch && (res = await fetchFindRealInfo({ id: item.id }))
      item.id && (await fetchAddRealInfoBrowseNum({ id: item.id }))
      this.activeObj = res
      this.visible = true
    },
    async opepSystemDialog(res) {
      res.id && (await fetchAddRealInfoBrowseNum({ id: res.id }))
      this.activeObj = res
      this.systemDialog = true
    },
    getEnvUdmpId(udmp) {
      return udmp[process.env.VUE_APP_API_TYPE]
    },
    async getModuleList() {
      let { icon } = ROUTER_ICON.find((item) => item.label === '报销中心')
      let commonMenuIconMap = {
        20620000000: icon,
        20630000000: icon,
        20640000000: icon
      }

      let res = await fetchListUserCustomMenu()
      res.forEach((item) => {
        item.icon = commonMenuIconMap[item.menuId] || item.icon
        if (item.menuId === '20800000000') {
          item.thirdPartyUrl =
            'httt://training.pab.com.cn/training-web/index.html'
        }
      })
      this.moduleList = res
    },
    // 获取重点推荐数据
    async getPCInfoData() {
      let { list } = await fetchListRealInfo(this.pcInfoParams)
      this.recommendList = list
    },
    // 判断是否有最近更新
    async checkUpdateInfo() {
      let res = await fetchFindUserLastSystemUpdate()
      if (res) {
        res.isUpdateInfo = true
        // this.openDialog(res, false)
        this.opepSystemDialog(res)
        await fetchSaveUserLastSystemUpdate({ id: res.id })
      }
    },
    // 常用模块配置弹窗关闭
    customLinkCloseHandle() {
      this.getModuleList()
    },
    async getBannerList() {
      let res = await fetchListHomePageBanner({ type: 'pc' })
      this.imgUrls = res.map((item) => item.udmpUrl)
    },
    moduleLinkHandle(item) {
      console.log(item, '---item')
      if (item.thirdPartyUrl) {
        window.open(item.thirdPartyUrl)
        return
      }
      this.gopath(item.menuLink)
    }
  },
  mounted() {
    const stats = {
      '/TrainingCourseManagement': (params) => {
        const { path, name, query } = params
        addAllowKeepAlive(path)
        this.$router.push({ name, query })
      },
      '/StartAttendance': (params) => {
        const { path, name, query } = params
        addAllowKeepAlive(path)
        const _params = JSON.parse(query.params)
        _params.state = 'fullScreen'
        this.$router.push({ name, params: _params })
        this.$wenEvent.$emit('fullScreen', false)
      }
    }
    const params = this.$route.params
    if (params.path) {
      const stat = stats[params.path]
      delayCall(
        () => {
          stat && stat(params)
        },
        () => this.$store.state.userInfo.umId
      )
    }
    delayCall(() => {
      this.getModuleList()
      this.getPCInfoData()
      this.checkUpdateInfo()
      this.getBannerList()
    }, 'login')
  }
}
</script>

<style lang="scss">
.home {
  .section {
    flex: 1;
    .banner {
      width: 100%;
      .el-carousel {
        width: 48vw;
        height: 18vw;
        flex-shrink: 0;
        .el-carousel__container {
          height: 18vw;
        }
        img {
          width: 48vw;
          height: 18vw;
          border-radius: 6px;
        }
      }
      .recommend {
        height: 18vw;
        flex: 1;
        background: #ffffff;
        border-radius: 6px;
        box-shadow: 0 2px 5px 0 rgba(188, 188, 188, 0.08);
        .items {
          padding: 1px 20px 17px;
          .item {
            margin-top: 16px;
            cursor: pointer;
          }
          .content {
            flex: 1;
            padding-right: 10px;
          }
          .time {
            width: 110px;
          }
        }
      }
    }
  }
  .aside {
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0 2px 5px 0 rgba(188, 188, 188, 0.08);
    .items {
      display: flex;
      min-height: 200px;
      padding: 10px 0;
      box-sizing: border-box;
      flex-wrap: wrap;
      overflow: hidden;
      .item {
        display: flex;
        width: 200px;
        margin: 10px 0;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        flex-shrink: 0;
        cursor: pointer;
        .icon {
          margin-bottom: 14px;
          img {
            width: 50px;
            height: 50px;
          }
        }
        .cxt {
          font-size: 14px;
        }
      }
    }
  }

  .com-title {
    display: flex;
    height: 50px;
    padding-left: 20px;
    align-items: center;
    justify-content: space-between;
    background: #f7f8fa;
    border-radius: 6px 6px 1px 1px;

    .title-setting {
      color: $shallow;
      margin-right: 20px;
      padding-right: 10px;
      font-family: initial;
      position: relative;
      cursor: pointer;

      &::after {
        content: '';
        width: 6px;
        height: 6px;
        display: block;
        border-right: 1px solid $shallow;
        border-top: 1px solid $shallow;
        position: absolute;
        right: 0;
        top: 50%;
        transform: rotate(45deg) translateY(-50%);
      }
    }
  }
}
.home-dialog__frame-box {
  .box-title {
    font-size: 20px;
    color: #fd6720;
    text-align: center;
  }
}

.attach-title {
  padding-left: 8px;
  position: relative;
  &::before {
    content: '';
    width: 4px;
    height: 100%;
    background-color: $themeColor;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>
<style lang="scss" scoped>
.system-dialog {
  :deep(.el-dialog__header) {
    height: auto;
    padding: 0 !important;
    background: #fff;
  }
  .header-img {
    width: 100%;
  }
  :deep(.el-dialog__body) {
    max-height: 100%;
    padding: 0 !important;
    // overflow: hidden;
    // overflow-y: auto;
  }

  :deep(.el-dialog__footer .footer) {
    display: flex;
    justify-content: center;
    flex-direction: row-reverse;
  }
}

.system-dialog-container {
  // height: 550px;
  // height: 50vh;
  display: flex;
  flex-direction: column;
  position: relative;

  .content-container {
    padding: 0 15px;
    // height: 354px;
    // flex: 1;
    // padding-bottom: 60px;
  }
}

.footer-container {
  // background-color: #fff;
  // padding: 15px;
  // width: 100%;
  // height: 60px;
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // z-index: 90;
}

.close-tip {
  padding-left: 20px;
  font-size: 12px;
  color: rgb(#2d2d2d, 0.6);
}
</style>
