<template>
<!-- valueConsistsOf="LEAF_PRIORITY" -->
   <treeselect
    class="dept-tree-select"
    v-model="treeData"
    :multiple="true"
    :options="options"
    :load-options="loadOptions"
    valueFormat="object"
    @input="changeHandle"
    @select="selectHandle"
    @deselect="deselectHandle"
    :beforeClearAll="handleClear"
    v-bind="$attrs"
    v-on="$listeners"
    ref="treeselectRef"
    v-loading="isLoadingTree"
  >
    <!-- 这里做自定义设置 -->
    <div slot="value-label" slot-scope="{ node }">
      <template v-if="node.raw.label">
        <template v-if="labelIsShowTX">
          <span v-if="['LS','FL'].includes(node.raw.id)">{{node.raw.label}}</span>
          <span v-else>{{busiTypeMap[node.raw[txField]]}}{{labelSeparator}}{{node.raw.orgName}}</span>
        </template>
        <span v-else>{{node.raw.label}}</span>
      </template>
      <template v-else>
        <span>{{node.raw.id}}</span>
      </template>
    </div>
  </treeselect>
</template>
<script setup>
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { ref, reactive, computed, onMounted, onActivated, nextTick } from 'vue'
// import { useDeptTreeSelect } from './hooks/useDeptTreeSelect'
import useDeptTreeSelect from './hooks/useDeptTreeSelect'
import { CopyObj } from '../../util/utils'
import { Message } from 'element-ui'

const emits = defineEmits(['change', 'input'])
// props 入参
const props = defineProps({
  // 要加载数据的条线参数（从外面传进来）
  busiTypeParams: { 
    type: Array,
    // default: () => [{ busiType: 'LS' }, { busiType: 'FL' }]
    default: () => [{ busiType: 'FL' }]
    // default: () => []
  },
  // 要禁用的节点
  disabledIdArr: {
    type: Array,
    default: () => []
    // default: () => ["S000018867", "S000014834", "S000003742", "S000013544", "S000021583", 'S000006948']
  },
  // <treeselect> 节点 label 对应的接口返回数据的字段
  idField: { 
    type: String,
    default: 'orgId'
  }, 
  // <treeselect> 节点 label 对应的接口返回数据的字段
  labelField: { 
    type: String,
    default: 'orgName'
  }, 
  // 叶子字段
  // <treeselect> 节点 children = null 对应的接口返回数据的字段
  leafField: { 
    type: String,
    default: 'isSpread'
  }, 
  // 接口返回数据的条线的字段
  txField: { 
    type: String,
    default: 'blgStripLine'
  }, 
  // label是否显示“条线值”
  labelIsShowTX: {
    type: Boolean,
    default: false
  },
  // label 中 条线与机构名的分隔符, 只有 labelIsShowTX = true 时有次
  // 当 nodeLabelSeparator 未设置时，则
  labelSeparator: {
    type: String,
    default: '/'
  },
  // 节点label中，用于“条线”与“节点名”的分隔符
  // 
  nodeLabelSeparator: {
    type: String,
    default: '/'
  },
  // 节点中的Label是否显示“条线”
  nodeLabelIsShowTX: {
    type: String,
    // default: 'all'         // 所有节点都显示“条线”
    // default: 'onlyRoot'    // 只有根节点显示“条线”
    default: '' // 不显示“条线”
  },
  // 当前值，选择树节点值
  value: {
    type: Array,
    default: () => []
  },
  /**
    原始值，编辑数据时，回显的数据
    数组对象必须包括如下字段：
    {
      busiType: m.blgStripLine,
      orgId: m.orgId,
      orgName: m.orgName,
      allPrnNode: m.allPrnNode || '', // 所以的节点路径，如 001｜001001｜001001001
    }
  */
  originalValue: {
    type: Array,
    // default: () => []
    default: () => []
  },
  // 是否在非全选的情况下，加上父级节点
  includesParents: {
    type: Boolean,
    default: true
  },
  // 不包含的父级节点。所选节点如果路径中带有目前父节点，则不允许被选上
  excludeParentCodes: Array
})
// const value = ref(null)
const { busiTypeMap, treeData, options, loadOptions, flatTreeMap, updateLog, removeLog, clearLog, getLogList, isLoadingTree, hasNextNextChildren, hasNextDisabledChildren, handleNextChildren } = useDeptTreeSelect(props)

const orgTreeMap = new Map()
const createOrgTreeMap = () => {
  const handleFlat = (datas) => {
    datas.forEach(row => {
      orgTreeMap.set(row.orgId, row)
      row.children && row.children.length && handleFlat(row.children)
    })
  }
  handleFlat(options.value)
  console.log(orgTreeMap, '====>>>> resultDatas');
}

/**
 * 需求变更：非全选状态下，结果数据需要包含其父级节点
 * 这里只需要遍历所有的结果数据，如果没有父级节点id，那就从flatTreeMap中把它取出来就可
 * map类型用于过滤重复的id
 */
// const formatParams = (dataInfo) => {
//   const parentRes = new Map()

//   const setParent = (row) => {
//     if(!row.prnOrgId) return
//     const parentNode = flatTreeMap.value.get(row.prnOrgId)
//     parentRes.set(row.prnOrgId, parentNode)
//     setParent(parentNode)
//   }

//   dataInfo.forEach(row => {
//     if(dataInfo.findIndex(findRow => findRow.orgId === row.prnOrgId) === -1) {
//       setParent(row)
//     }
//   })
//   return [...dataInfo, ...Array.from(parentRes.values())]
// }

const formatParams = () => {
  // 把treeData结果集，和log记录结果做个结合去重，就是最终结果数据
  // 如果treeData中，父级节点存在于log中，则不加入到结果集中
  const res = new Map()
  const logs = getLogList()
  treeData.value.forEach(node => {
    // 这里需要判断，log中的节点是否属于treeData中的上级节点至根节点，由于属性allPrnNode中还有父级信息，所以这里不需要重新做递归了
    const isHasParents = (childNode) => {
      let allPrnNode = []
      if(flatTreeMap.get(childNode.orgId)?.allPrnNode) {
        allPrnNode = flatTreeMap.get(childNode.orgId)?.allPrnNode.split('|')
      }
      for (const orgId of allPrnNode) {
        if(logs.findIndex(logNode => logNode.orgId === orgId) > -1) return true
      }
      return false
    }
    if(isHasParents(node)) return
    res.set(node.orgId, node)
  })
  logs.forEach(node => {
    if(res.get(node.orgId)) return
    res.set(node.orgId, node)
  })
  
  return Array.from(res.values())
}

function changeHandle(v) {
  // if(props.includesParents) {
  //   formatParams(v)
  // }
  // createOrgTreeMap()
  
  nextTick(() => { 
    if(props.excludeParentCodes && props.excludeParentCodes.length) {
      treeData.value = treeData.value.filter(row => {
        const currentTreeNodes = (row.allPrnNode || row.orgId).split("|")
        // console.log(
        //   currentTreeNodes, 
        //   props.excludeParentCodes,
        //   props.excludeParentCodes.every(parentRow => currentTreeNodes.includes(parentRow)),'-->> ccc');
        const result = currentTreeNodes.every(cRow => props.excludeParentCodes.includes(cRow))
        if(result) {
          deselectHandle({orgId: currentTreeNodes[currentTreeNodes.length-1]})
          Message.warning('不允许选择自身或者上级节点')
        }
        return !result
      })
    }

    emits('input', formatParams()) 
  })
  // "LS/S000010018", "LS/S000014928", "LS/S000008806"
  // emits('change', formatParams(v))
  
  // emits('change', {
  //   selectIds: v,
  //   selectObjs: vObj
  // })
}

// 选择节点事件
function selectHandle (v, a, b, c) {
  // 选择节点，把节点加入到log
  updateLog(v)
  // v => 这里的v是当前选择节点，可置于结果集中
  const treeDataOld = CopyObj(treeData.value) || []
  nextTick(() => {
    const resultDatas = handleNextChildren(v, resultDatas)
    treeData.value = [...treeDataOld, ...resultDatas]
  })
}

function deselectHandle (v) {
  removeLog(v.orgId)
  // 移除节点，把节点从log移除, 其父节点也需要从log移除, 所有下属子节点也需要移除
  // const childrenNodes = flatTreeMap.get(v.orgId)?.children
  // if(childrenNodes) {
  //   childrenNodes.forEach(childNode => {
  //     // 这里要走递归
  //     removeLog(v.orgId)
  //   })
  // }
}
// 清除log
const handleClear = () => {
  clearLog()
  return true
}
</script>
<style lang='scss' scoped>
.dept-tree-select {
  // width: 450px;
  :deep(.vue-treeselect__multi-value-item) {
    background-color: $themeColor;
    color: #fff;
  }
  :deep(.vue-treeselect__value-remove) {
    color: #fff;
  }
  :deep(.vue-treeselect__checkbox--checked) {
    background-color: $themeColor;
    border-color: $themeColor;
  }
  :deep(.vue-treeselect__label-container:hover
      .vue-treeselect__checkbox--unchecked) {
    border-color: $themeColor;
  }
}
</style>