<template>
  <!-- <home-setting></home-setting> -->
  <div class="CaseCenter__HomePageSetting">
    <div class="default" v-show="active === 0">
      <div class="content">
        <div class="content-wrap">
          <el-scrollbar style="height: 580px">
            <preview-edit :dict="result"></preview-edit>
          </el-scrollbar>
        </div>
        <div class="buttons">
          <div class="b830 theme-color mt20" @click="active = 1">去编辑</div>
        </div>
      </div>
    </div>
    <div class="edit" v-show="active === 1">
      <div class="state">
        <div
          class="b728 mr-1"
          @click="toCurr"
          :class="status === '1' ? 'theme-color' : 'disabled-color'"
        >
          当前状态
        </div>
        <div
          class="b728"
          @click="toDraft"
          :class="status === '0' ? 'theme-color' : 'disabled-color'"
        >
          草稿状态
        </div>
      </div>
      <div class="edit-content">
        <div class="preview">
          <p class="title">预览</p>
          <div class="content-wrap">
            <el-scrollbar style="height: 580px">
              <preview-edit :dict="result"></preview-edit>
            </el-scrollbar>
          </div>
        </div>
        <div class="change">
          <p class="title dfc">编辑</p>
          <div class="shadow-1">
            <img src="@/assets/images/home-setting-top.png" alt="" />
            <preview-edit
              type="edit"
              :dict="result"
              @change="handleChange"
              @editBanner="editBanner"
              @changeHandle="changeHandle"
            ></preview-edit>
          </div>
        </div>
      </div>
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="cancel">取消</el-button>
        <el-button class="button-w80-h30" @click="release('0')"
          >存草稿</el-button
        >
        <el-button class="button-w80-h30" type="primary" @click="release('1')"
          >发布</el-button
        >
      </div>
    </div>
    <!-- <el-button @click="$emit('change', 'editSetting')">去添加</el-button> -->
  </div>
</template>

<script>
import {
  addAllowKeepAlive,
  jsonHeaders,
  handleUdmpHref,
  hintFrame
} from '@/util/utils'
import { DEFAULT_ZONE_IMG_URL_ID, DEFAULT_ZONE_IMG_URL } from '@/util/constants'
import AddHomePageSetting from './AddHomePageSetting'
import PreviewEdit from './ApreviewEdit.vue'
export default {
  name: 'HomePageSettingIndex',
  props: {
    moduleData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      active: 0,
      status: '1',
      result: {},
      handleUdmpHref,
      columnIndex: -1
    }
  },
  components: {
    'home-setting': AddHomePageSetting,
    'preview-edit': PreviewEdit
  },
  methods: {
    // 获取首页数据
    getData() {
      const data = { type: 'case', status: this.status }
      this.$axios
        .post('/fn/caseCenter/homePage/findCaseHomePage', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.banners.forEach(m => {
              if (!m.udmpId) {
                m.udmpId = DEFAULT_ZONE_IMG_URL_ID
                m.udmpUrl = DEFAULT_ZONE_IMG_URL
              }
            })
            data.columnList = data.columnList.filter(m => m.modules?.length)
            this.result = data || {}
          }
        })
    },
    editBanner() {
      addAllowKeepAlive('/EditBanner')
      this.result.status = this.status
      this.$router.push({ name: '编辑banner', params: this.result })
    },
    // 切换到草稿状态
    toDraft() {
      hintFrame('是否退出当前编辑页面？未保存的修改将会丢失').then(() => {
        this.status = '0'
      })
    },
    toCurr() {
      this.status = '1'
    },
    // 发布 或 存草稿
    release(status) {
      const condiiton = {}
      condiiton.columnList = this.result.columnList.filter(m => m.modules?.length) || []
      condiiton.status = status
      condiiton.type = 'case'
      condiiton.typeName = '案例中心首页'
      condiiton.banners = this.result.banners.map((v, sequence) => {
        const { bannerName, bannerRef, bannerRefType, udmpId } = v
        return {
          bannerName,
          bannerRef,
          bannerRefType,
          udmpId,
          sequence
        }
      })
      condiiton.columnList.forEach((v, i) => {
        v.columnSequence = i
      })
      this.$axios
        .post(
          '/fn/caseCenter/homePage/saveOrUpdateCaseHome',
          { condiiton },
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success(`${status === '1' ? '发布' : '保存草稿'}成功`)
            this.active = 0
            if (status === '1') {
              this.status = '1'
            }
            this.getData()
          }
        })
    },
    cancel() {
      hintFrame('是否退出当前编辑页面？未保存的修改将会丢失').then(() => {
        this.active = 0
        this.getData()
      })
    },
    handleChange(column) {
      this.columnIndex = this.result.columnList.findIndex((v) => v === column)
      this.$emit('save', { ...column })
      this.$emit('change', 'editSetting')
    },
    changeHandle() {
      this.columnIndex = -1
      this.$emit('save', {})
      this.$emit('change', 'editSetting')
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    active (n) {
      console.log('active = ', n)
      this.$emit('changeActive', n)
    },
    status(n, o) {
      this.getData()
    },
    moduleData(newObj) {
      if (this.result.columnList.findIndex((v) => v === newObj) >= 0) return
      if (this.columnIndex >= 0) {
        this.$set(this.result.columnList, this.columnIndex, newObj)
      } else if (newObj?.modules?.length) {
        this.result.columnList.push(newObj)
      }
    }
  },
  activated() {
    const params = this.$route.params
    if (params.banners) {
      this.result.banners = params.banners
      Reflect.deleteProperty(params, 'banners')
    }
  }
}
</script>
<style lang="scss" scoped>
.CaseCenter__HomePageSetting {
  padding: 30px;
  background-color: #fff;
  .content {
    width: 384px;
    position: relative;
    margin: auto;
    .buttons {
      position: absolute;
      top: 100px;
      right: -120px;
      margin-top: -20px;
      div {
        cursor: pointer;
      }
    }
  }
  .state {
    display: flex;
    .theme-color {
      position: relative;
      z-index: 1;
    }
  }
  .content-wrap {
    width: 350px;
    height: 710px;
    padding-top: 90px;
    background: url('~@/assets/svg/shouji.svg') no-repeat;
  }
  .edit-content {
    display: flex;
    margin-top: 20px;
    justify-content: center;

    .preview .title {
      width: 350px;
      margin-bottom: 17px;
      text-align: center;
    }
    .change {
      .title {
        margin-bottom: 17px;
      }
      .com-wrapper {
        box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.08);
      }
      .shadow-1 {
        > img {
          width: 330px;
        }
      }
    }
    .content-wrap {
      margin-right: 200px;
    }
  }
}
</style>
