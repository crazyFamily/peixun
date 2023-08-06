<template>
  <div ref="dropdownZhOrgRef">
    <el-dropdown
      class="gc-dropdown-tree"
      trigger="click"
      placement="bottom-start"
      @visible-change="visibleChange"
    >
      <el-tooltip placement="top" effect="light" :disabled="checkNodes.length < 2">
        <div slot="content">
          <div class="tipTags"> 
            <el-tag v-for="(node,i) in checkNodes" :key="i" closable
              type="info" class="mr10" size="mini" @close="handleCloseTag(i)">{{node.orgName}}</el-tag>
            <el-tag type="danger" size="mini" closable @close="handleCloseAllTag">清空</el-tag>
          </div>
        </div>
        <el-input :placeholder="placeholder" readonly :value="checkLabel" />
      </el-tooltip>

      <el-dropdown-menu slot="dropdown" class="gc-dropdown-tree__dropdown-box" :style="{ width: width || inputWidth, height }">
        <el-input v-if="search" placeholder="请输入" v-model.trim="searchValue" :max="200" class="w210 mt10 mlr15" clearable />
        <div class="tree-wrap">
          <el-tree
            ref="treeRef"
            v-bind="$attrs"
            v-on="$listeners"
            :data="list"
            :props="_treeProps"
            :node-key="valueField"
            :show-checkbox="checkBox"
            :filter-node-method="_filterFn"
            :check-on-click-node="checkOnClickNode"
            @check-change="checkChange"
          ></el-tree>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'

const emits = defineEmits(['input', 'change'])
const props = defineProps({
  list: { // 下拉机构数据列表
    type: Array
  },
  height: { // 下拉浮窗的高度
    type: String,
    default: '256px'
  },
  placeholder: { // 值为空时的提示值
    type: String,
    default: '请选择'
  },
  treeProps: { // 配置选项，具体看下表
    type: Object,
    default: () => ({})
  },
  checkOnClickNode: {
    type: Boolean,
    default: true
  },
  checkBox: {
    type: Boolean,
    default: true
  },
  search: Boolean, // 下拉列表中，是否显示查询框
  valueField: String, // 节点对象的value字段, 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
  labelField: String, // 节点对象的label字段
  inputWidth: { // 下拉框的宽部
    type: String,
    default: '250px'
  }, 
  showCheckbox: Boolean, // 
  filterFn: Function
})
// el-tree 组件的 props 属性
const _treeProps = computed(() => {
  return props.treeProps || { label: props.labelField }
})
// ------------------------- 节点过滤 -------------------------
// 下拉树查询
const searchValue = ref('')
watch(searchValue, (newV, oldV) => {
  // 执行filter时，会执行 el-tree 组件 绑定的 filterNodeMethod 方法,即 _filterFn 
  treeRef.value.filter(newV)
})
// 树节点搜索方法
function filterNodeMethod(value, data, node) {
  if (!value || !value.trim()) return true
  return data[props.labelField].includes(value)
}
const _filterFn = computed(() => {
  return props.filterFn || filterNodeMethod
})

const dropdownVisible = ref(false)
function visibleChange(visible) {
  dropdownVisible.value = visible
}

const treeRef = ref(null)
const width = ref('')

const activeObj = ref({}) // 最后选择的节点
const checkNodes = ref([]) // 已选择的节点
const checkLabel = ref('') // 已选择的节点的label字符串

function handleCloseTag (i) {
  checkNodes.value.splice(i, 1)
  treeRef.value.setCheckedNodes(checkNodes.value)
}
function handleCloseAllTag () {
  treeRef.value.setCheckedNodes([])
}
// 多选时，选择每个节点都会触发
function checkChange(item) {
  activeObj.value = item
  const nodes = treeRef.value.getCheckedNodes()
  const checkKeys = setCheckNodes(nodes)
  emits('change', checkKeys, nodes)
}
// 每次选择节点时，都会触发
function setCheckNodes (nodes) {
  checkNodes.value = nodes
  const checkKeys = nodes.map((v) => v[props.valueField])
  const label = nodes.map((v) => v[props.labelField]) .join(',')
  checkLabel.value = label.length > 200 ? label.slice(0, 200) + '...' : label
  return checkKeys
}

// 设置组件值，提供到组件外使用
function setValue (nodes) {
  setCheckNodes(nodes)
  treeRef.value.setCheckedNodes(nodes)
}

defineExpose({
  setValue
})

const dropdownZhOrgRef = ref(null)
onMounted(() => {
  if (!props.search) {
    width.value = dropdownZhOrgRef.value.querySelector('.input').offsetWidth + 'px'
  } else {
    width.value = dropdownZhOrgRef.value.querySelector('.el-input').offsetWidth + 'px'
  }
})
</script>

<style lang="scss" scoped>
.gc-dropdown-tree {
  width: 100%;
  .tipTags { max-width: 300px; }
  .input {
    display: flex;
    width: 100%;
    height: 30px;
    padding-left: 10px;
    font-size: 12px;
    line-height: 30px;
    border: 1px solid #e0e1e3;
    color: #000000;
    justify-content: space-between;
    i {
      float: right;
      height: 30px;
      margin-right: 10px;
      line-height: 30px;
    }
  }
 &__dropdown-box {
    position: absolute;
    padding: 0 !important;
    margin: 2px 0 0 0 !important;
    overflow: auto;
    min-width: 250px;
    .tree-wrap {
      width: 100%;
      padding-top: 10px;
      overflow: auto;

      .el-tree { min-width: 100%; display: inline-block; }
      .el-tree-node__content { height: 30px; padding-right: 15px; }
    }
    .popper__arrow { display: none !important; }
  }
}
</style>
