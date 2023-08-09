<template>
  <div class="setting-box">
		<div class="setting-container">
			<div class="config-preview">
        <nine-menu-view showType="3" :data="{ iconSize, modules: nineMenus }" />
      </div>
			<div class="config-setting">
				<p class="title">属性设置</p>
        <el-form ref="formRef">
					<el-form-item>
            <span>展示样式 ：</span>
            <el-radio-group v-model="iconSize">
              <el-radio label="large">大图标</el-radio>
              <el-radio label="small" class="ml10">小图标</el-radio>
            </el-radio-group>
          </el-form-item>
					<el-form-item>
            <p> 内容设置 <span style="color:#b0b0b0;">(可拖动排序)</span> </p>
						<div>
							<transition-group>
								<div
                  class="menu-content-box"
                  v-for="(item,index) in nineMenus"
                  :key="item.iid"
                  :draggable="true"
                  @dragstart="dragstart(index)"
                  @dragenter="dragenter($event, index)"
                  @dragover="dragover($event, index)"
                >
                  <div class="menu-del" @click="deleteMenu(item, index)">
                    <span class="icon-del el-icon-error"></span>
                  </div>
                  <div class="menu-icon">
                    <template v-if="item.moduleImgId">
                      <img v-if="item.moduleImgId.indexOf('.') < 0" class="img-icon" :src="handleUdmpHref(item.moduleImgId)" />
                      <img v-else class="img-icon" :src="require('@/assets/nineMenuIcon/' + item.moduleImgId)" />
                    </template>
                    <span v-else class="img-icon empty"></span>
                    <!-- 图标上传中 -->
                    <span v-if="item.iconLoading" class="img-icon img-icon-loading">
                      <span class="el-icon-loading"></span>
                    </span>
                    <template v-else>
                      <span class="img-icon img-icon-hover">修改</span>
                      <ul class="img-icon-btns">
                        <li @click="openDefaultIconSource(index)">默认图标</li>
                        <li>
                          <gc-fileInput :size="200 * 1024" msgSizeLimit="200KB" accept=".jpg,.png" @change="iconImgUploadChange($event, item, index)" width="auto">
                            <span>自定义图标</span>
                          </gc-fileInput>
                        </li>
                      </ul>
                    </template>
                  </div>
                  <div class="menu-field">
                    <div>
                      <span>标题 ：</span>
                      <el-input style="width:270px;" v-model="item.moduleName" maxlength="4" show-word-limit></el-input>
                    </div>
                    <div>
                      <span>资源 ：</span>
                      <el-button type="text" @click="openSelectSource(index)">选择要跳转的资源</el-button>
                      <span v-if="item.relationId" class="el-icon-check" alt="已选择资源"></span>
                    </div>
                  </div>
                </div>
							</transition-group>
              <div class="add-menu-btn" @click="addMenu">
                  <span class="el-icon-plus"></span>
                </div>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="saveHandle">确认</el-button>
    </div>
		<select-source :needSelectImg="false" ref="selectSourceRef" @comfirm="selectSourceComfirm" />
		<SelectDefaultIcon ref="selectIconRef" @comfirm="selectDefaultIconComfirm" />
	</div>
</template>
<script setup>
import { ref, reactive, computed, watch, set } from 'vue'
import { uploadFile, handleUdmpHref, downloadAdapter, hintFrame, random, CopyObj } from '@/util/utils'
import NineMenuView from './NineMenuView.vue'
import SelectSource from './SelectSource'
import SelectDefaultIcon from './SelectDefaultIcon'
import { Message } from 'element-ui'

// ======= 参入数据 =======
const nineMenuData = ref({})

const emits = defineEmits(['change', 'save'])

const iconSize = ref('small')
const nineMenus = ref([])
// 选中菜单索引
const selectMenuIndex = ref(-1) 

const props = defineProps({
  moduleData: {
    type: Object,
    default: () => {}
  }
})
watch(
  () => props.moduleData,
  (newVal, oldVal) => {
    console.log(newVal)
    if (newVal) {
      iconSize.value = newVal.iconSize
      nineMenus.value = CopyObj(newVal.modules) 

		  nineMenuData.value = CopyObj(newVal)
    }
  },
  { immediate: true }
)

// 添加菜单
function addMenu() {
  if ( nineMenus.value.length >= 10 ) {
    Message.warning('最多只能添加10个')
    return
  } 
  const menu = {
    iid: random(),
    moduleName: '',
    moduleImgId: '',
    moduleImgUrl: '',
  }
  nineMenus.value.push(menu)
}
// 删除菜单
function deleteMenu (item, index) {
  console.log(item)
  if (item.moduleSequence) {
    hintFrame('此记录已保存在数据库中，确认在删除此记录吗？').then(() => {
      nineMenus.value.splice(index, 1)
    })
  } else {
    nineMenus.value.splice(index, 1)
  }
}

// ========================== 选择默认图片 ==========================
// 选择默认图片ref
const selectIconRef = ref(null)
function openDefaultIconSource (index) {
  selectMenuIndex.value = index
	selectIconRef.value.open()
}
// 选择默认icon确认
function selectDefaultIconComfirm (data) {
  const index = selectMenuIndex.value
  set(nineMenus.value[index], 'moduleImgId', data.fileName )
  set(nineMenus.value[index], 'moduleImgUrl', data.fileName )
}
// 上传自定义图标
function iconImgUploadChange($event, row, rowIndex) {
  const file = $event.target.files[0]
  if (!file) return

  set(row, 'iconLoading', true)
  uploadFile({ files: file })
    .then(res => {
      const { code, data } = res.data
      if (code === 0) {
				const udmpId = data[0].udmpId
        nineMenus.value[rowIndex].moduleImgId = udmpId
        nineMenus.value[rowIndex].moduleImgUrl = handleUdmpHref(udmpId)
      }
    })
    .finally(() => {
      set(row, 'iconLoading', false)
    })
}

// ========================== 选择资源 ==========================
// 选择资源
const selectSourceRef = ref(null)
function openSelectSource (index) {
	selectMenuIndex.value = index
	selectSourceRef.value.open()
}
// 选择资源确认
function selectSourceComfirm (data) {
  Reflect.deleteProperty(data, 'iid')
  Reflect.deleteProperty(data, 'moduleName')
  Reflect.deleteProperty(data, 'moduleImgId')
  Reflect.deleteProperty(data, 'moduleImgUrl')
  const index = selectMenuIndex.value
  Object.keys(data).forEach(key => {
    set(nineMenus.value[index], key, data[key] )
  })
	console.log('选择资源/原始数据', data)
	console.log('选择资源/合并后', nineMenus.value[index])
}

// ======================== 返回/保存 ========================
// 返回主页面
function closeHandle() {
  emits('save', { nineMenuData: nineMenuData.value } )
  emits('change', 'settingIndex')
}
// 保存数据
function saveHandle() {
  // 前置判断
  if (!nineMenus.value.length) return Message.warning('还未添加任何内容')
  if (!nineMenus.value.every(m => m.moduleName)) return Message.warning('还有项目未填写标题')
  if (!nineMenus.value.every(m => m.relationId)) return Message.warning('还有项目未选择资源')
  if (!nineMenus.value.every(m => m.moduleImgId)) return Message.warning('还有项目未上传图标')
  // 提交的数据
  nineMenuData.value.iconSize = iconSize.value
  nineMenuData.value.modules = nineMenus.value
  emits('save', { nineMenuData: nineMenuData.value } )
  emits('change', 'settingIndex')
}

// ======================== 菜单排序拖动 ========================
// 拖动项目索引，目标项目索引，定时器
let dragIndex, enterIndex, timeout
function dragstart(index) {
  console.log('start index ===>>> ', index)
  dragIndex = index
}
// dragenter 和 dragover 事件的默认行为是拒绝接受任何被拖放的元素。
// 因此，我们要在这两个拖放事件中使用`preventDefault`来阻止浏览器的默认行为
function dragenter(e, index) {
  e.preventDefault()
  enterIndex = index
  if (timeout !== null) {
    clearTimeout(timeout)
  }
  // 拖拽事件的防抖
  timeout = setTimeout(() => {
    if (dragIndex !== index) {
      const source = nineMenus.value[dragIndex]
      nineMenus.value.splice(dragIndex, 1)
      nineMenus.value.splice(index, 0, source)
      // 排序变化后目标对象的索引变成源对象的索引
      dragIndex = index
    }
  }, 100)
}

function dragover(e, index) {
  e.preventDefault()
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
  // padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  min-height: calc(100vh - 160px);
  min-width: 1000px;
  .title {
    margin-bottom: 15px;
    height: 24px;
  }
}
.config-preview {
  flex: 2;
  margin: 0px auto;
  background: #F9F9F9;
  padding: 50px

}
.config-setting {
  flex: 1;
  // width: 300px;
  padding: 50px
}

.menu-content-box {
  // transition: 0.3s;
  position: relative;
  transition: transform 0.3s;
  display: flex;
  padding: 10px;
  border: 1px solid #d0d0d0;
  width: 400px;
  margin-bottom: 10px;
  .menu-del {
    display: none;
    position: absolute;
    z-index: 2;
    right: -10px;
    top: -10px;
    cursor: pointer;
    .icon-del {
      font-size: 20px;
      color: red;
    }
  }
  &:hover {
    cursor: move;
    // box-shadow:2px 2px 10px #ddd;
    box-shadow:0 0 10px #aaa;
    // hover时，显示删除按钮
    .menu-del {
      display: block;
    }
  }
  .menu-icon {
    width: 60px;
    padding: 5px 10px 5px 0px;
    position: relative;
		// margin-top: -5px;
    // margin-left: -5px;
    
    .img-icon {
      text-align: center;
      line-height: 40px;
      color: #d9d9d9;
      display: inline-block;
      border-radius: 25px;
      width: 50px;
      height: 50px;
    }
    .empty {
      background: #d9d9d9;
      border: 1px solid;
    }

		.img-icon-hover {
			position: absolute;
			left: 0;
			z-index: 2;
      opacity: 0;
      color: #fff;
      cursor: pointer;
			line-height: 50px;
		}
    .img-icon-loading {
      position: absolute;
			left: 0;
			z-index: 3;
      opacity: 0.5;
      color: #fff;
      cursor: pointer;
			line-height: 50px;
      background: #d0d0d0;
      color: green;
      font-size: 20px;
      font-weight: bold;
    }
    .img-icon-btns {
      display: none;
      position: absolute;
      top: 50px;
      left: -8px;
      width: 80px;
      background: #fff;
      text-align: center;
      // border: 1px solid #d0d0d0;
      z-index: 2;
      box-shadow: rgb(#000, 0.5) 0 6px 10px;
      line-height: 25px;
      border-radius: 5px;
      cursor: pointer;
      li:hover {
        // border-radius: 5px;
        background: #fd6720;
        color: #fff;
      }
    }
    &:hover {
      .img-icon-hover {
			  opacity: 1;
        background: #999898;
      }
      .img-icon-btns {
        display: block;
      }
    }
  }
  .menu-field {
    flex: 1;
    .el-icon-check {
      font-size: 15px;
      color: green;
      cursor: pointer;
      font-weight: bold;
    }
  }
}
.add-menu-btn {
    line-height: 90px;
    width:400px;
    height:82px;
    text-align: center;
    border: 1px solid #d0d0d0;
    color: #D2D2D2;
    &:hover {
      border: 1px solid red;
    }
    span {
      font-size:28px;
    }
  }
</style>
