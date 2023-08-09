<template>
  <div class="CaseCenter__editBanner">
    <div style="min-height: calc(100vh - 160px) ;">
      <el-tabs v-model="activeName">
        <el-tab-pane label="Banner管理" name="case">
          <div class="items">
            <template v-for="(item, i) in bannerList" >
              <div v-if="item.moduleImgId" class="item" :key="item.iid">
                <div class="img-wrapper">
                  <div class="img">
                    <img :src="getSpecialImg(item.moduleImgId, 'href')" alt />
                  </div>
                  <div class="item-mask">
                    <div v-if="i > 0" @click="move(i, -1)" style="background-color: #b08831">前移</div>
                    <div @click="edit(item, i)">编辑</div>
                    <div v-if="banners.length > 1" style="background-color: #f56c6c" @click="del(i)">删除</div>
                    <div v-if="i < banners.length - 1" @click="move(i, 1)">后移</div>
                  </div>
                </div>
              </div>
              <div v-else class="add-item" @click="add" :key="i">
                <i class="el-icon-plus gc-uploader-icon"></i>
              </div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="cancel">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submit">确认</el-button>
    </div>
    <select-source suggestSize='670*212' ref="selectSourceRef" @comfirm="saveComfirm"></select-source>
  </div>
</template>

<script>
import { CopyObj, getSpecialImg, closeCurrPage, uuid} from '@/util/utils'
import SelectSource from './SelectSource'
export default {
  name: 'EditBanner',
  components: { SelectSource },
  props: {
    moduleData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    moduleData: {
      // deep: true,
      immediate: true,
      handler (newVal) {
        if (newVal?.modules) {
         newVal.modules.forEach(m => m.iid = uuid())
          this.banners = CopyObj(newVal.modules)
        }
      }
    }
  },
  data() {
    return {
      getSpecialImg,
      activeName: 'case',
      banners: [],
      editItemIndex: -1,
      isShowTab: true
    }
  },
  computed: {
    bannerList () {

      let list = CopyObj(this.banners), length = this.banners.length

      if (length > 5 ) {
        list = list.slice(0,5)
      } else if (length < 5) {
        for (let i = 0; i < 5 - length; i++) {
          list.push({})
        }
      }
      console.log(list)
      return list
    }
  },
  methods: {
    // 添加banner事件
    add () {
      // 重置选中记录及索引
      this.editItemIndex = -1
      this.$refs.selectSourceRef.open()
    },
    // 移动banner
    move (i, num) {
      const other = i + num
      if (!this.banners[other]) return
      const item = this.banners.splice(i, 1)
      this.banners.splice(other, 0, item[0])
    },
    // 删除
    del (i) {
      this.banners.splice(i, 1)
    },
    // 编辑
    edit (item, index) {
      const editItem = CopyObj(item)
      this.editItemIndex = index
      this.$refs.selectSourceRef.open(editItem)
    },
    saveComfirm(data) {
      if ( !data.iid ) data.iid = uuid()
      if (this.editItemIndex > -1) {
        this.banners.splice(this.editItemIndex, 1, data)
      } else {
        this.banners.push(data)
      }
    },
    // 返回主页面
    cancel() {
      this.$emit('save', { banners: this.moduleData.modules } )
      this.$emit('change', 'settingIndex')
    },
   // 保存数据
    submit() {
      // 前置判断
      if (!this.banners.length) return Message.warning('还未添加任何内容')
      this.$emit('save', { banners: this.banners } )
      this.$emit('change', 'settingIndex')
    }
  },
  activated() {

  }
}
</script>
<style lang="scss" scoped>
.CaseCenter__editBanner {
  background-color: #fff;
  .el-tab-pane {
    margin-top: -15px;
    padding-bottom: 20px;
  }

  .items {
    display: flex;
    flex-wrap: wrap;
    .item,
    .add-item {
      width: calc((100% - 100px) / 3);
      margin-top: 30px;
      flex-wrap: wrap;
      margin-left: 30px;
      border: 4px solid #ffffff;
      box-shadow: 0 4px 8px rgba($color: #000000, $alpha: 0.18);
    }
    .add-item {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f6f7f7;
      min-height: 145px;
      cursor: pointer;
      i {
        font-size: 60px;
        font-weight: 100;
        color: #d2d2d2;
      }
    }
    .item {
      .img-wrapper {
        position: relative;
        width: 100%;
        height: 0px;
        overflow: hidden;
        padding-bottom: calc(100% * 133 / 390 + 0px);
        &:hover .item-mask {
          display: flex;
        }
      }
      .img,
      .item-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba($color: #000000, $alpha: 0.31);
        &:hover {
          display: flex;
        }
      }
      .img {
        display: block;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .item-content {
        padding: 8px 15px 0;
        .zoneName {
          width: calc(100% - 30px);
        }
      }
      .item-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    & > div:nth-child(3n + 1) {
      margin-left: 20px !important;
    }
  }
  .item-mask > div {
    display: flex;
    width: 60px;
    height: 30px;
    color: #fff;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    background-color: #eeb435;
    cursor: pointer;
    &:nth-child(n + 1) {
      margin-left: 20px;
    }
    &:first-child {
      border-radius: 6px 2px 2px 6px;
    }
    &:last-child {
      border-radius: 2px 6px 6px 2px;
    }
  }
  .el-input__suffix {
    display: flex;
    align-items: center;
  }
  .activeItem {
    border-color: $themeColor !important;
  }
  .select-banner.items {
    .item,
    .add-item {
      width: calc((100% - 60px) / 3);
    }
    & > div:nth-child(3n + 1) {
      margin-left: 0 !important;
    }
  }
}
</style>
