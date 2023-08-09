<template>
  <div class="setting-box">
    <div class="setting-container">
      <div class="function-list">
        <div class="layout-type">
          <p class="title">功能列表</p>
          <ul class="types-container">
            <li class="item" v-for="(item, index) in functionInfo" :key="index" @click="navChangeHandle(item)">
              <img class="item-img" :class="{ active: item.value == activeType }" :src="item.img" alt />
              <p class="label">{{ item.label }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="config-setting">
        <p class="title">属性设置</p>

        <el-form :model="configForm" ref="formRef">
          <div>
            <el-form-item label="模块名称: " label-width="90px" prop="columnName">
              <el-radio-group v-model="configForm.columnNameShowStatus">
                <el-radio label="0">显示</el-radio>
                <el-radio label="1" class="ml10">隐藏</el-radio>
              </el-radio-group>
              <el-input
                :disabled="configForm.columnNameShowStatus == 1"
                v-model="configForm.columnName"
                placeholder="请输入模块名称"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            <el-form-item v-if="isShowContentShowRow" label="展示行数: " label-width="90px" prop="columnContentShowRow">
              <div style="margin-top: -5px;">
                <span>展示</span>&nbsp;
                <el-input-number
                  v-model="configForm.columnContentShowRow"
                  :controls="false"
                  :min="1"
                  :max="10"
                  style="width: 50px"
                ></el-input-number>
                {{ activeType === '4' ? '列' : '行' }}, 其余展示为更多
                <span style="color:#c0c0c0;">(最多可填写10行)</span>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="saveHandle">确认</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onActivated, onMounted, nextTick } from 'vue'
import { CopyObj } from '@/util/utils'
import { Message } from 'element-ui'
const props = defineProps({
  moduleData: {
    type: Object,
    default: () => {}
  }
})
const originConfigForm = {
  columnCategory: 'module',
  columnCategoryValue: '',
  columnName: '',
  columnIntervalShow: '0', // 空白间隔
  columnNameShowStatus: '0', // 是否显示
  columnContentShowRow: 1 // 显示行数
}

// columnCategory为modul时，必填；XBJH-学霸计划，ZX-资讯，ZNZB-知鸟直播，ZNBXK-知鸟必修课
const functionInfo = [
  { label: '学霸计划', value: 'XBJH', img: require('@/assets/images/func-xb.svg') },
  { label: '资讯', value: 'ZX', img: require('@/assets/images/func-zx.svg') },
  { label: '知鸟直播', value: 'ZNZB', img: require('@/assets/images/func-znzb.svg') },
  { label: '知鸟必修课', value: 'ZNBXK', img: require('@/assets/images/func-znkc.svg') }
]
const activeType = ref('')
function navChangeHandle(item, index) {
  activeType.value = item.value
  configForm.columnCategoryValue = item.value
  configForm.columnName = item.label
  configForm.columnContentShowRow = 1 // 显示行数
  configForm.columnNameShowStatus = '0' // 显示行数
}
// 属性设置
const configForm = reactive(CopyObj(originConfigForm))

const isShowContentShowRow = computed(() => {
  return activeType.value !== 'XBJH'
})

const emits = defineEmits(['change', 'save'])
function closeHandle() {
  emits('change', 'settingIndex')
}
function saveHandle() {
  // 前置判断
  if (isShowContentShowRow && parseInt(configForm.columnContentShowRow) !== Number(configForm.columnContentShowRow)) 
    return Message.warning('行/列数要输入正整数')
  emits('save', configForm)
  closeHandle()
}

// 初始化数据
function _initData () {
  // 编辑
  if (props.moduleData?.columnCategory) {
    const editData = props.moduleData
    const func = functionInfo.find(m => m.value === editData.columnCategoryValue)
    if (func) {
      navChangeHandle(func)
    }
    // 回显数据
    nextTick(() => {
      configForm.columnName = editData.columnName
      configForm.columnNameShowStatus = editData.columnNameShowStatus
      configForm.columnContentShowRow = editData.columnContentShowRow
    })
  } else { // 新增
    navChangeHandle(functionInfo[0])
  }
}
onMounted(() => {
  console.log('onMounted', props.moduleData)
  _initData()
})
onActivated(() => {
  _initData()
  console.log('onActivated', props.moduleData, props.moduleData.columnCategory)
})
</script>

<style lang="scss" scoped>
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
  justify-content: center;

  .title {
    margin: 15px;
    height: 24px;
  }
}

.layout-type {
  width: 400px;
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
// .setting-container {
//   display: flex;

//   .function-list {
//   }
//   .function-setting {
//   }
// }
</style>
