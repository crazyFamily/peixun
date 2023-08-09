<template>
  <!-- <home-setting></home-setting> -->
  <div class="StudyCenter__HomePageSetting">
    <div class="default" v-show="active === 0">
      <div class="content">
        <div class="content-wrap">
          <div class="home-setting-top">
            <img src="@/assets/svg/home-setting-top.svg" alt="" />
          </div>
          <el-scrollbar style="height: 580px">
            <preview-edit showType="1" :dict="result"></preview-edit>
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
            <div class="home-setting-top">
              <img src="@/assets/svg/home-setting-top.svg" alt="" />
            </div>
            <el-scrollbar style="height: 580px">
              <preview-edit showType="2.1" :dict="result"></preview-edit>
            </el-scrollbar>
          </div>
        </div>
        <div class="change">
          <p class="title dfc">编辑</p>
          <div class="shadow-1">
            <!-- <img src="@/assets/images/home-setting-top.png" alt="" /> -->
            <img src="@/assets/svg/home-setting-top.svg" alt="" />
            <preview-edit
              showType="2.2" 
              :dict="result"
              @change="handleChange"
              @editBanner="editBanner"
              @editNineMenu="editNineMenu"
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
  hintFrame,
  CopyObj,
  random
} from '@/util/utils'
import EditModuleCustom from './EditModuleCustom'
import PreviewEdit from './ApreviewEdit.vue'
import { fetchFindCaseHomePage, fetchSaveOrUpdateCaseHome } from '@/fetch/caseCenter'
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
      type: 'studyCenter',
      typeMapping: {
        case: { type: 'case', typeName: '案例首页' },
        studyCenter: { type: 'studyCenter', typeName: '个人学习中心' },
      },
      active: 0,
      status: '1',
      result: {},
      handleUdmpHref,
      columnIndex: -1
    }
  },
  components: {
    'home-setting': EditModuleCustom,
    'preview-edit': PreviewEdit
  },
  methods: {
    // 获取首页数据
    getData() {
      // studyCenter, case
      const data = { type: 'studyCenter', status: this.status }
      fetchFindCaseHomePage(data).then(res => {
        const resData = {}
        if (!res.columnList) res.columnList = []
        if (res.columnList) {
          // banner 信息
          resData.bannerData = res.columnList.find(m => m.columnCategory === 'banner') || {
            columnCategory: 'banner',
            columnName: "banner图模块",
            columnNameShowStatus: '1',
            columnIntervalShow: '0',
            columnShow: 'Y',
            modules: []
          }
          // nine menu 九宫格菜单
          resData.nineMenuData = res.columnList.find(m => m.columnCategory === 'nine') || {
            columnCategory: 'nine',
            columnName: "九宫格模块",
            columnNameShowStatus: '1',
            columnIntervalShow: '0',
            columnShow: 'Y',
            iconSize: 'small',
            modules: []
          }
          // 栏目 - 普通
          // resData.columnList = res.columnList.filter(m => m.columnCategory === 'manual' )
          resData.columnList = res.columnList.filter(m => {
            // 功能栏目
            const exp1 = ['module'].includes(m.columnCategory) 
            // 常规栏目 且 有栏目内容
            const exp2 = ['manual'].includes(m.columnCategory) && m.modules?.length > 0
            return exp1 || exp2
          })
        }
        this.result = resData || {}
        console.log(this.result)
      })
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
    release (status) {
      const condiiton = {}
      // 基本信息
      condiiton.status = status
      condiiton.type = this.typeMapping[this.type].type
      condiiton.typeName = this.typeMapping[this.type].typeName
      // 处理banner
      condiiton.columnList = [ this.result.bannerData, this.result.nineMenuData ]
      // 处理模块
      if (this.result.columnList?.length) {
        const list = this.result.columnList.filter(m => m.modules?.length > 0)
        condiiton.columnList.push(...this.result.columnList)
      }
      const unColumnStyle = ['banner', 'nine']
      condiiton.columnList.forEach((v,i) => {
        // 当模块为“banner”和“九宫格”时，columnStyle 为空
        if (unColumnStyle.includes(v.columnCategory) && v.columnStyle == '') v.columnStyle = null
        // 当模块为“功能栏目”时，columnStyle 不能为“”
        if (v.columnCategory === 'module') v.columnStyle = '1'
        v.columnSequence = i
        v.modules?.forEach((vv,ii) => {
          vv.moduleSequence = ii
        })
      })
      fetchSaveOrUpdateCaseHome({ condiiton }).then(res => {
        this.$message.success(`${status === '1' ? '发布' : '保存草稿'}成功`)
          this.active = 0
          if (status === '1') {
            this.status = '1'
          }
          this.getData()
      })
    },
    cancel() {
      hintFrame('是否退出当前编辑页面？未保存的修改将会丢失').then(() => {
        this.active = 0
        this.getData()
      })
    },
    editBanner(type) {
      if (['show', 'hide'].includes(type)) {
        // 显示/隐藏
        const isShowBanner = type === 'show'
        this.$emit('save', { isShowBanner })
      } else {
        // 编辑
        // addAllowKeepAlive('/EditBanner')
        // this.result.status = this.status
        // this.$router.push({ name: '编辑banner', params: this.result.bannerData })

        const bannerData = CopyObj(this.result.bannerData)
        this.$emit('save', bannerData)
        this.$emit('change', 'editBanner')
      }
    },
    // 编辑九宫格
    editNineMenu (type) {
      if (['show', 'hide'].includes(type)) { // 显示/隐藏
        const isShowNineMenu = type === 'show' 
        this.$emit('save', { isShowNineMenu } )
      } else { // 编辑
        const nineMenuData = CopyObj(this.result.nineMenuData)
        nineMenuData.modules.forEach(m => {
          m.iid = random()
        })
        this.$emit('save', nineMenuData)
        this.$emit('change', 'editNineMenu')
      }
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
      if (newObj.hasOwnProperty('banners')) {
        this.result.bannerData.modules = newObj.banners
      } else if (newObj.hasOwnProperty('isShowBanner')) {
        this.result.bannerData.columnShow = newObj.isShowBanner ? 'Y' : 'N'
      } else if (newObj.hasOwnProperty('nineMenuData')) {
        this.result.nineMenuData = newObj.nineMenuData
      } else if (newObj.hasOwnProperty('isShowNineMenu')) {
        this.result.nineMenuData.columnShow = newObj.isShowNineMenu ? 'Y' : 'N'
      } else {
        // 常规栏目 / 功能栏目
        if (this.result.columnList.findIndex((v) => v === newObj) >= 0) return
        if (this.columnIndex >= 0) {
          this.$set(this.result.columnList, this.columnIndex, newObj)
        } else if (newObj?.modules?.length || newObj.columnCategory === 'module') {
          this.result.columnList.push(newObj)
        }
      }
    }
  },
  activated() {
    // const params = this.$route.params
    // if (params.banners && this.result?.bannerData?.modules) {
    //   this.result.bannerData.modules = params.banners
    //   Reflect.deleteProperty(params, 'banners')
    // }
  }
}
</script>
<style lang="scss" scoped>
.StudyCenter__HomePageSetting {
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
.home-setting-top {
  padding: 0 10px;
  margin-top: -80px;
}
</style>
