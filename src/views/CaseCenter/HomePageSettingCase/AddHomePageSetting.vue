<template>
  <div class="setting-box">
    <div class="setting-container">
      <div class="layout-type">
      
        <p class="title">模块样式</p>
        <ul class="types-container">
          <li
            class="item"
            v-for="(item, index) in typesInfo"
            :key="index"
            @click="navChangeHandle(item, index)"
          >
            <img
              class="item-img"
              :class="{ active: item.value === activeType }"
              :src="item.img"
              alt=""
            />
            <p class="label">{{ item.label }}</p>
          </li>
        </ul>
      </div>
      <div class="render-container"
        :class="{
          'data-null': !itemsInfo.length,
          'short-height': itemsInfo.length && activeType === '4',
          'short-height-no-title':
            itemsInfo.length &&
            activeType === '4' &&
            configForm.columnNameShowStatus === '1'
        }"
      >
        <p
          class="title"
          v-show="
            itemsInfo.length && Number(configForm.columnNameShowStatus) === 0
          "
        >
          {{ configForm.columnName }}
        </p>
        <el-scrollbar
          :style="
            Number(configForm.columnNameShowStatus) === 0
              ? `height: calc(100% - 114px)`
              : activeType === '4'
              ? `height: 150px`
              : `height: calc(100% - 114px + 54px)`
          "
          :class="{ 'hiden-vertical': activeType === '4' }"
          ref="settingScrollbar"
        >
          <div
            class="item-list-container"
            :class="{
              'left-right': activeType === '0',
              'top-bottom1': activeType === '1',
              'top-bottom2': activeType === '2',
              'top-bottom3': activeType === '3',
              'top-bottom4': activeType === '4'
            }"
            :style="
              activeType === '4' && itemsInfo.length > 2
                ? `width: ${(110 + 20) * itemsInfo.length}px`
                : ''
            "
          >
            <div
              class="item"
              v-for="(item, index) in itemsInfo"
              :key="index"
              @mouseover="item.isHoverShow = true"
              @mouseout="item.isHoverShow = false"
            >
              <img
                class="item-img"
                :src="getSpecialImg(item.moduleImgId, 'href')"
                alt=""
              />
              <p class="name">{{ item.moduleName }}</p>
              <item-hover
                @change="itemHoverChangeHandle($event, index)"
                :show.sync="item.isHoverShow"
                :is-top="index === 0"
                :is-bottom="index === itemsInfo.length - 1"
              ></item-hover>
            </div>
          </div>
        </el-scrollbar>
        <el-button
          class="add-item-button"
          type="primary"
          @click="addItemInfoHandle"
          >添加</el-button
        >
      </div>
      <div class="config-setting">
        <p class="title">属性设置</p>
        <el-form class="content-form" :model="configForm" ref="formRef" >
          <el-form-item label="模块名称: " label-width="90px" prop="columnName">
            <el-radio-group v-model="configForm.columnNameShowStatus">
              <el-radio label="0">显示</el-radio>
              <el-radio label="1" class="ml10">隐藏</el-radio>
            </el-radio-group>
            <el-input ref="columnNameRef"
              v-model="configForm.columnName"
              placeholder="请输入模块名称"
              :disabled="Number(configForm.columnNameShowStatus) === 1"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item
            label="空白间隔: "
            label-width="90px"
            prop="columnIntervalShow"
          >
            <el-radio-group v-model="configForm.columnIntervalShow">
              <el-radio label="0">显示</el-radio>
              <el-radio label="1" class="ml10">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="展示行数: "
            label-width="90px"
            prop="columnContentShowRow"
          >
            <el-radio-group
              v-model="configForm.columnContentShowRowRadio"
              class="mt10"
            >
              <el-radio label="-1">全部展示</el-radio>
              <el-radio label="show" class="mt10"
                >展示
                <!-- <el-input
                  v-model="configForm.columnContentShowRow"
                  style="width: 50px"
                ></el-input> -->
                <el-input-number
                  v-model="configForm.columnContentShowRow"
                  :controls="false"
                  :min="1"
                  style="width: 50px"
                ></el-input-number>
                {{ activeType === '4' ? '列' : '行' }}, 其余展示为更多</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <!-- <select-person-item
            type="column"
            :divStyle="{marginLeft:'25px'}"
            :divOrgStyle="{marginLeft:'-70px', padding: '0', border: '0'}"
            :importId="configForm.importId"
            :crowdBatchId="configForm.crowdBatchId"
            :crowdOrgs="configForm.crowdOrgs"
            labelWidth="70px"
            @comfirm="comfirmSelectPerson"
            ref="selectPersonItemRef" /> -->
          <set-crowd-item
            type="column"
            :divStyle="{marginLeft:'15px'}"
            :importId="configForm.importId"
            :crowdBatchId="configForm.crowdBatchId"
            :crowdOrgs="configForm.crowdOrgs"
            labelWidth="75px"
            @comfirm="comfirmSetCrowd"
            ref="setCrowdItemRef" />
        </el-form>
      </div>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="saveHandle"
        >确认</el-button
      >
    </div>
    <add-items
      :show.sync="isAddItemsShow"
      :item-info="addItemInfo"
      @comfirm="addItemsComfirmHandle"
      :suggest-size="suggestSize[activeType]"
    ></add-items>
  </div>
</template>

<script>
import CompAddItems from './CompAddItems.vue'
import CompItemHoverSetting from './CompItemHoverSetting.vue'
import { CopyObj, getSpecialImg, uuid } from '@/util/utils'
import SelectPersonItem from '@/components/select-person/SelectPersonItem'
import SetCrowdItem from '@/components/set-crowd/SetCrowdItem'
export default {
  name: 'AddHomePageSetting',

  props: {
    moduleData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      configForm: {
        importId: '',
        crowdBatchId: '',
        crowdOrgs: [],
        columnName: '',
        columnNameShowStatus: '0',
        columnIntervalShow: '0',
        columnContentShowRowRadio: '-1',
        columnContentShowRow: '1'
      },
      typesInfo: [
        {
          img: require('@/assets/images/layout1.svg'),
          label: '左图右文',
          value: '0'
        },
        {
          img: require('@/assets/images/layout2.svg'),
          label: '上图下文：一列',
          value: '1'
        },
        {
          img: require('@/assets/images/layout3.svg'),
          label: '上图下文：两列',
          value: '2'
        },
        {
          img: require('@/assets/images/layout4.svg'),
          label: '上图下文：三列',
          value: '3'
        },
        {
          img: require('@/assets/images/layout5.svg'),
          label: '上图下文：滑动',
          value: '4',
          type: 'swiper'
        }
      ],
      activeType: '0',
      isAddItemsShow: false,
      itemsInfo: [],
      isHoverShow: false,
      suggestSize: {
        0: '180*180',
        1: '590*260',
        2: '280*180',
        3: '160*160',
        4: '212*160'
      },
      addItemInfo: {},
      addItemInfoIndex: -1,
      getSpecialImg
    }
  },

  components: {
    'add-items': CompAddItems,
    'item-hover': CompItemHoverSetting,
    SetCrowdItem,
    // SelectPersonItem
  },

  computed: {},

  mounted() {},

  watch: {
    moduleData: {
      handler(n) {
        if (Object.keys(n).length) {
          console.log('编辑模块', n)
          this._initDatas(n)
        } else {
          console.log('添加模块', n)
          this.configForm.importId = uuid()
          console.log('添加模块', this.configForm)
        }
      },
      immediate: true
    }
  },

  methods: {
    // 数据初始化
    _initDatas(data) {
      let {
        columnId,
        columnName,
        columnNameShowStatus,
        columnIntervalShow,
        columnContentShowRow,
        columnStyle,
        crowdBatchId,
        crowdOrgs,
        importId,
        modules
      } = data
      this.configForm.columnId = columnId
      this.configForm.columnName = columnName
      this.configForm.columnNameShowStatus = columnNameShowStatus
      this.configForm.columnIntervalShow = columnIntervalShow
      this.configForm.importId = importId || uuid()
      this.configForm.crowdBatchId = crowdBatchId
      this.configForm.crowdOrgs = crowdOrgs
      // 由于后端接收的状态为-1为展示全部， 这里需要根据-1状态进行下初始处理
      if (columnContentShowRow === '-1') {
        this.configForm.columnContentShowRowRadio = '-1'
        this.configForm.columnContentShowRow = '1'
      } else {
        this.configForm.columnContentShowRowRadio = 'show'
        this.configForm.columnContentShowRow = columnContentShowRow
      }
      this.activeType = columnStyle
      this.itemsInfo = CopyObj(modules).map((item) => ({
        ...item,
        isHoverShow: false
      }))
    },
    reset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
      this.configForm.crowdOrgs = []
      this.configForm.deleteUserList = []
    },
    closeHandle() {
      this.reset()
      this.$emit('change', 'settingIndex')
    },
    saveHandle() {
      // 前置判断
      if (!this.itemsInfo.length)
        return this.$message.warning('还未添加任何内容')
      if (
        this.configForm.columnContentShowRow !== '-1' &&
        parseInt(this.configForm.columnContentShowRow) !==
          Number(this.configForm.columnContentShowRow)
      ) {
        return this.$message.warning('行/列数要输入正整数')
      }
      if (this.configForm.columnNameShowStatus === '0' && !this.configForm.columnName) {
        this.$refs.columnNameRef?.focus()
        return this.$message.warning('请输入模块名称')
      }
      this.$emit('save', {
        ...this.configForm,
        // 出口这里也需要针对行进行一些处理
        columnContentShowRow:
          this.configForm.columnContentShowRowRadio === '-1'
            ? this.configForm.columnContentShowRowRadio
            : this.configForm.columnContentShowRow,
        columnStyle: this.activeType,
        modules: this.itemsInfo.map((item, index) => ({
          moduleSequence: String(index),
          moduleName: item.moduleName,
          moduleImgId: item.moduleImgId,
          moduleType: item.moduleType,
          relationId: item.relationId,
          ifValid: item.ifValid
        }))
      })
      this.closeHandle()
    },
    // 数据列的移动增删改处理
    itemHoverChangeHandle(type, index) {
      this.itemsInfo[index].isHoverShow = false
      switch (type) {
        case 'front':
          if (index !== 0) {
            this.itemsInfo[index] = this.itemsInfo.splice(
              index - 1,
              1,
              this.itemsInfo[index]
            )[0]
          }
          break
        case 'edit':
          this.addItemInfo = CopyObj(this.itemsInfo[index])
          this.addItemInfoIndex = index
          this.isAddItemsShow = true
          break
        case 'remove':
          this.itemsInfo.splice(index, 1)
          break
        case 'back':
          if (index !== this.itemsInfo.length - 1) {
            this.itemsInfo[index] = this.itemsInfo.splice(
              index + 1,
              1,
              this.itemsInfo[index]
            )[0]
          }
          break
      }
      this.updateScrollbar()
    },
    navChangeHandle(item) {
      this.activeType = item.value
      this.updateScrollbar()
    },
    // 更新滚动条
    updateScrollbar() {
      this.$nextTick(() => {
        this.$refs.settingScrollbar.update()
      })
    },
    // 弹窗确认，返回选择的数据
    addItemsComfirmHandle(data) {
      data.isHoverShow = false
      if (this.addItemInfoIndex > -1) {
        this.$set(this.itemsInfo, this.addItemInfoIndex, CopyObj(data))
      } else {
        this.itemsInfo.push(data)
      }
      this.addItemInfo = {}
      this.addItemInfoIndex = -1
      this.updateScrollbar()
    },
    // 打开添加内容弹窗
    addItemInfoHandle() {
      this.addItemInfoIndex = -1
      this.isAddItemsShow = true
      // this.addItemInfo = {}
    },
    // 选择人员确认
    comfirmSelectPerson (data) {
      console.log('选择人员确认', data)
      this.configForm.crowdOrgs = data.crowdOrgs || []
      if (data?.deleteUserList.length) {
        this.configForm.deleteUserList = data.deleteUserList
      }
    },
    comfirmSetCrowd (data) {
      console.log('选择人员确认', data)
      this.configForm.crowdOrgs = data.crowdOrgs || []
    },
  }
}
</script>
<style lang='scss' scoped>
.setting-box {
  width: 100%;
  min-height: calc(100% - 70px);
  background: #fff;
}

.setting-container {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  .title {
    margin: 15px;
    height: 24px;
  }
}

.layout-type {
  width: 350px;
}

.render-container {
  width: 345px;
  // flex: 1;
  height: 425px;
  box-shadow: rgb(#000, 0.2) 0 4px 8px;
  &.data-null {
    height: 60px;
  }
  &.short-height {
    height: 265px;
  }
  &.short-height-no-title {
    height: 210px;
  }
}

.config-setting {
  width: 400px;
  // flex: 1;
}

.add-item-button {
  width: calc(100% - 30px);
  height: 30px;
  margin: 15px;
}

.types-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding-right: 20px;

  .item {
    width: 165px;
    margin-bottom: 40px;
    cursor: pointer;
  }

  .item-img {
    width: 100%;
    padding: 10px;
    border: 1px solid transparent;
    &.active {
      border: 1px solid $themeColor;
    }
  }

  .label {
    margin-top: 5px;
    text-align: center;
  }
}

.item-list-container {
  margin: 0 7px;
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 100%;
    padding: 7px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    transition: width 0.5s;
    position: relative;
  }
  .name {
    margin: 15px;
    font-size: 16px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-img {
    width: 100%;
    background-color: #ddd;
    transition: width 0.5s;
  }
}

.left-right {
  .item-img {
    width: 90px;
    height: 90px;
  }
  .name {
    max-width: 195px;
  }
}

.top-bottom1 {
  .item-img {
    // width: 100%;
    height: 130px;
  }
}

.top-bottom2 {
  .item {
    width: 50%;
  }
  .item-img {
    // width: 140px;
    height: 90px;
  }
}

.top-bottom3 {
  .item {
    width: 33%;
  }
  .item-img {
    // width: 80px;
    height: 80px;
  }
}

.top-bottom4 {
  .item {
    width: 110px;
    margin-right: 20px;
  }
  .item-img {
    width: 105px;
    height: 80px;
  }
}

.swiper {
  width: 100%;
  height: 150px;

  .item-img-container {
    height: calc(100% - 52px);
    .item-img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.swiper-slide {
  padding: 10px;
  box-sizing: border-box;

  .item-img {
    width: 100%;
    background-color: #ddd;
  }

  .name {
    margin: 15px;
    font-size: 16px;
    font-weight: 500;
  }
}

.hiden-vertical {
  :deep(.el-scrollbar__wrap) {
    overflow: hidden;
  }
  :deep(.is-vertical) {
    display: none;
  }
}
</style>
