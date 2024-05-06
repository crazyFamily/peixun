<template>
  <div class="component-head">
    <div class="component-head__left">
      <div
        class="component-head__left__default"
        :class="{ active: $store.state.activeIndex === -1 }"
        @click="gopath('/')"
      >
        首页
      </div>
      <div v-show="isShow">
        <i
          class="el-icon-arrow-down component-head__left__icon__left"
          @click="left"
        ></i>
      </div>

      <div class="component-head__left__wraper">
        <ul class="component-head__left__tags">
          <li
            class="component-head__left__tags__item"
            :class="{ active: index === $store.state.activeIndex }"
            v-for="(item, index) in $store.getters.keepAliveComponents"
            :key="item.componentName"
            @click="gopath(item, index)"
          >
            <div class="component-head__left__tags__item__content">
              {{ item.title || searchRouterName(item) }}
            </div>
            <i
              class="component-head__left__tags__item__close"
              @click.stop="del(item, index)"
            ></i>
          </li>
        </ul>
      </div>
      <div v-show="isShow">
        <i
          class="el-icon-arrow-down component-head__left__icon__right"
          @click="right"
        ></i>
      </div>
    </div>
    <div class="component-head__right">
      <!-- <ul class="component-head-func hide">
                <li class="component-head-func__item">
                    <i class="component-head-func__i-message"></i>
                    <p class="component-head-func__name">我的消息</p>
                </li>
            </ul> -->
      <el-tooltip placement="left">
        <p slot="content">用户中心</p>
        <img
          src="../assets/images/user-center.svg"
          alt="用户中心"
          class="user-center-icon"
          @click="userCenterHandle"
        />
      </el-tooltip>
      <div class="component-head-pic">
        <!-- <el-dropdown class="gc-dropdown">
                    <span class="el-dropdown-link">
                        <template v-if="$slots.label">
                            <slot name="label"></slot>
                        </template>
                        <template v-else>
                            {{ label }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </template>
                    </span>
                    <el-dropdown-menu size="large" slot="dropdown" :class="dropClass">
                        <div class="slot">
                            <slot />
                        </div>
                        <div>
                            <el-dropdown-item
                                v-for="item in options"
                                :value="tem.id"
                                :key="item.id"
                                :icon="item.icon"
                                >{{ item[labelName] }}</el-dropdown-item
                            >
                        </div>
                    </el-dropdown-menu>
                </el-dropdown> -->
        <gc-dropdown :options="dropdownMenu" @command="menuCommandHandle">
          <template #label>
            <div class="between">
              <img
                src="../assets/images/staff-male.png"
                alt="头像"
                style="cursor: inherit"
                class="user-icon"
              />
              <p class="component-head-pic__username component-head-pic__name">
                {{ userName }}
              </p>
            </div>
          </template>
        </gc-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { SERVER_BASEHOST } from '@/util/constants'
import $ from 'jquery'
import {
  searchRouterName,
  getAllowKeepAliveIndex,
  addAllowKeepAlive
} from '../util/utils'
export default {
  name: 'TopNav',
  data() {
    return {
      // 用户名
      userName: '',
      title: '首页',
      breadcrumb: [],
      searchRouterName,
      isShow: false,
      dropdownMenu: [
        {
          id: 'logout',
          labelName: '退出'
        }
      ]
    }
  },
  mounted() {
    // 获取用户名
    this.getUsername()
    this.$wenEvent.$on('getTiele', () => {
      this.$forceUpdate()
    })
  },
  methods: {
    // 退出登录
    logout() {
      // window.location.href = process.env.VUE_APP_API + '/4a/logoutService'
      window.location.href = SERVER_BASEHOST + '/4a/logoutService'
    },
    // 获取用户名
    getUsername() {
      this.$axios.post('/fn/user/selectLoginUserInfo').then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.userName = data.empName
          const systemIndex = data.menuInfoList.findIndex(
            (v) => v.menuId === '20500000000'
          )
          if (
            systemIndex > -1 &&
            data.menuInfoList[systemIndex].childMenus.length < 1
          ) {
            data.menuInfoList.splice(systemIndex, 1)
          }

          // AI练需要跳转三方页面
          let AIRouter = data.menuInfoList.find(
            (item) => item.menuId === '20800000000'
          )
          AIRouter &&
            (AIRouter.thirdPartyUrl =
              'http://training.pab.com.cn/training-web/index.html')
          this.$store.commit('setUserInfo', data)
        }
      })
    },
    // 消息提示
    message() {
      this.$message.warning('功能暂未开放')
    },
    //跳转用户管理页面
    goUserManage() {
      this.$router.push({
        path: '/External?code=' + this.UserID
      })
    },
    JumpPermisson() {
      this.$router.push({
        path: '/permission'
      })
    },
    // 标签栏左移
    left() {
      const translateX = this.getTranslateX()
      if (translateX >= -200) {
        this.setTranslateX(0)
      } else {
        this.setTranslateX(translateX + 200)
      }
    },
    // 标签栏右移
    right() {
      const translateX = this.getTranslateX()
      const maxTranslateX =
        $('.component-head__left__tags').width() -
        $('.component-head__left__wraper').width()
      if (maxTranslateX + translateX <= 200) {
        return this.setTranslateX(-maxTranslateX)
      }
      this.setTranslateX(translateX - 200)
    },
    // 获取translateX的距离
    getTranslateX() {
      const translateXStr = $('.component-head__left__tags')[0].style.transform
      if (!translateXStr) return 0
      let translateX
      return (translateX = translateXStr.match(/translateX\((-?\d+)/))
        ? parseInt(translateX[1])
        : 0
    },
    // 设置translateX的距离
    setTranslateX(distance) {
      $('.component-head__left__tags').css({
        transform: `translateX(${distance}px)`
      })
    },
    gopath(item, index) {
      if (item == null) return
      this.$router.push({ path: item.customPath || item.path || item })
    },
    del(item, index) {
      this.$store.commit(
        'delKeepAlive',
        this.$store.getters.keepAliveComponents[index]
      )
      const translateX = this.getTranslateX()
      const viewWidth = $('.component-head__left__wraper').width()
      const tagsWidth = $('.component-head__left__tags').width()
      if (this.isShow && viewWidth > tagsWidth + translateX) {
        this.setTranslateX(-tagsWidth + viewWidth)
      } else if (!this.isShow && translateX != 0) {
        this.setTranslateX(0)
      }
      if (index > this.$store.state.activeIndex) return
      if (index < this.$store.state.activeIndex) {
        return this.$store.commit(
          'changeIndex',
          this.$store.state.activeIndex - 1
        )
      }
      index = this.$store.state.activeIndex
      const left = this.$store.getters.keepAliveComponents[index - 1]
      const right = this.$store.getters.keepAliveComponents[index]
      const path = left ? left : right ? right : ''
      this.$router.push((path && (path.customPath || path.path)) || '/')
    },
    // 下拉菜单点击
    menuCommandHandle(type, command) {
      if (type === 'logout') {
        this.logout()
        return
      }
    },
    // 进入用户中心
    userCenterHandle() {
      addAllowKeepAlive('/UserCenter')
      this.$router.push({ name: '用户中心' })
    }
  },
  watch: {
    '$route.path': function (n) {
      let index
      index = getAllowKeepAliveIndex(n)
      if (this.$route.matched.length > 1) {
        index = getAllowKeepAliveIndex(this.$route.matched[0].path)
      }
      this.$store.commit('changeIndex', index)
      if (this.isShow) {
        this.$nextTick(() => {
          const translateX = -this.getTranslateX()
          const viewWidth = $('.component-head__left__wraper').width()
          const tagsWidth = $('.component-head__left__tags').width()
          const maxDistance = tagsWidth - viewWidth
          const tagWidthList = $('.component-head__left__tags > li')
            .map(function () {
              return $(this).width()
            })
            .toArray()
          const endDistance = viewWidth + translateX
          let startIndex, endIndex
          tagWidthList.reduce((pre, next, i) => {
            if (translateX == 0) {
              startIndex = 0
            } else if (pre > translateX && !startIndex) {
              startIndex = i
            }
            if (endDistance === tagsWidth) {
              endIndex = tagWidthList.length - 1
            } else if (pre < endDistance) endIndex = i

            return pre + next
          }, 0)
          if (index >= endIndex) {
            if (index === tagWidthList.length - 1) {
              this.setTranslateX(-maxDistance)
            } else {
              this.setTranslateX(
                -tagWidthList
                  .slice(endIndex, index)
                  .reduce((pre, next) => pre + next, 0) - translateX
              )
            }
          } else if (index <= startIndex) {
            if (index === 0) {
              this.setTranslateX(0)
            } else {
              this.setTranslateX(
                -translateX +
                  tagWidthList
                    .slice(index, startIndex)
                    .reduce((pre, next) => pre + next, 0)
              )
            }
          }
        })
      }
    },
    '$store.state.keepAliveComponents': function () {
      this.$nextTick(() => {
        this.isShow =
          $('.component-head__left__tags').width() -
            $('.component-head__left__wraper').width() >
          0
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hrx-home-title {
  font-family: PingFangSC-Regular, 'Roboto-Regular', 'PingFang SC', 'Droid Sans',
    'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
  font-size: 14px;
  color: #212145;
  letter-spacing: 0.58px;
}

.component-head {
  height: 60px;
  box-shadow: 0 2px 5px 0 rgba(188, 188, 188, 0.08);
  padding: 0 40px 0 15px;
  // width: calc(100% - 50px);
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  -webkit-align-items: center;
  align-items: center;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
  background: #fff;
}

.component-head__left {
  display: flex;
  max-width: calc(100% - 286px);
  color: #7d8292;
  align-items: center;
  padding-right: 20px;
  &__default {
    width: 50px;
    height: 14px;
    padding-right: 20px;
    font-size: 14px;
    line-height: 15px;
    flex-shrink: 0;
    border-right: 1px solid #eaecf1;
    cursor: pointer;
  }

  &__wraper {
    overflow: hidden;
  }

  &__tags {
    display: flex;
    width: max-content;
    transition: transform 0.5s;
    &__item {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      cursor: pointer;
      &:not(.active):hover &__content {
        color: #000000;
      }
      &__content {
        padding: 10px 0 10px 20px;
        font-size: 14px;
        flex-shrink: 0;
      }
      &__close {
        flex-shrink: 0;
        position: relative;
        width: 30px;
        height: 22px;
        top: 1px;
        padding: 4px 8px;
        margin-right: 10px;
        background: url('../assets/svg/guanbi copy.svg') no-repeat center;
        cursor: pointer;
      }
      &:first-child {
        &::before {
          display: none;
        }
      }
      &::before {
        display: inline-block;
        content: '';
        width: 1px;
        height: 14px;
        background-color: #eaecf1;
      }
      &.active {
        .component-head__left__tags__item__close {
          background-image: url('../assets/svg/guanbi-jihuo.svg');
        }
      }
    }
  }

  &__icon {
    &__left {
      width: 34px;
      padding: 10px 0 10px 20px;
      &::before {
        transform: rotate(90deg);
      }
      cursor: pointer;
    }
    &__right {
      width: 44px;
      padding: 10px 20px 10px 10px;
      &::before {
        transform: rotate(-90deg);
      }
      cursor: pointer;
    }
  }

  .el-breadcrumb__item:first-child {
    :deep(.el-breadcrumb__inner) {
      color: #212145;
      font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC',
        'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
    }
  }
  .el-breadcrumb__item:nth-child(n + 1) {
    :deep(.el-breadcrumb__inner) {
      color: #212145;
      font-family: 'PingFangSC-Regular', 'Roboto-Regular', 'PingFang SC',
        'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
    }
  }
}

.component-head__right {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  -webkit-align-items: center;
  align-items: center;
  width: 286px;
}

.component-head-func {
  position: relative;
  z-index: 1;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  -webkit-align-items: center;
  align-items: center;
  padding-right: 8px;
}

.component-head-func:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  margin: auto;
  z-index: 1;
  display: block;
  height: 12px;
  width: 0;
  border-right: 1px solid #eaecf1;
}

.component-head-func__item {
  position: relative;
  z-index: 1;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  -webkit-align-items: center;
  align-items: center;
  padding: 0 12px;
}

.component-head-func__item:after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: auto;
  margin: auto;
  z-index: 1;
  display: block;
  height: 12px;
  width: 0;
  border-right: 1px solid #eaecf1;
}

.component-head-func__item:last-child:after {
  display: none;
}

.component-head-func__i-vitae {
  display: block;
  margin-right: 4px;
  width: 18px;
  height: 18px;
  background: url(../assets/svg/head-func-vitae.svg) center center no-repeat;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  cursor: pointer;
}

.component-head-func__i-favorite {
  display: block;
  margin-right: 4px;
  width: 18px;
  height: 18px;
  background: url(../assets/svg/head-func-favorite.svg) center center no-repeat;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  cursor: pointer;
}

.component-head-func__i-message {
  display: block;
  margin-right: 4px;
  width: 18px;
  height: 18px;
  background: url(../assets/svg/head-func-message.svg) center center no-repeat;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  cursor: pointer;
}

.component-head-func__i-role {
  display: block;
  margin-right: 4px;
  width: 18px;
  height: 18px;
  background: url(../assets/svg/head-func-role.svg) center center no-repeat;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  cursor: pointer;
}

.component-head-func__i-permission {
  display: block;
  margin-right: 4px;
  width: 18px;
  height: 18px;
  background: url(../assets/svg/head-func-permission.svg) center center
    no-repeat;
  -moz-background-size: 100% 100%;
  -o-background-size: 100% 100%;
  -webkit-background-size: 100% 100%;
  background-size: 100% 100%;
  cursor: pointer;
}

.component-head-func__name {
  font-size: 14px;
  line-height: 18px;
  cursor: pointer;
}

.component-head-func__name:hover {
  color: #fd6720;
}

.component-head-pic {
  position: relative;
  z-index: 1;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
  -webkit-align-items: center;
  align-items: center;
  margin-left: 20px;
}

.user-center-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.component-head-pic > img,
.user-icon {
  overflow: hidden;
  position: relative;
  z-index: 1;
  display: block;
  width: 32px;
  height: 32px;
  border: 1px solid #eaecf1;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}

.component-head-pic__name {
  margin-left: 8px;
  max-width: 100px;
  font-size: 14px;
  line-height: 18px;
  overflow: hidden;
  white-space: nowrap;
  -ms-text-overflow: ellipsis;
  text-overflow: ellipsis;
  cursor: pointer;
}

.component-head-pic__username {
  width: 60px;
}

.component-head-pic__name:hover {
  color: #fd6720;
}
.el-breadcrumb__item:first-child {
  font-weight: bold;
}
</style>