<template>
  <gc-institution
    v-model="orgs"
    :busi-type="busiType"
    :left-show="false"
    :default-show="true"
    :immediate="false"
    v-bind="$attrs"
    v-on="$listeners"
    ref="institutionRef"
  >
  </gc-institution>
</template>

<script setup>
import { nextTick, reactive, ref, set, watch } from 'vue'
import { CopyObj } from '@/plugins/until'
/**
 * 背景：
 * 0330版本需要新增需求，机构树顶级节点不由后端返回数据，而根据场景指定
 * 由于测试时间紧张，无法改动全局组件institution，兼容方案为创建一个二次封装组件，以institution为底层，在其上进行功能扩展
 */

/**
 * interface TopNodeItem {
 *  createdBy: string|null,
 *  updatedBy: string|null,
 *  createdDate: Date|null,
 *  updatedDate: Date|null,
 *  orgId: string,  // 机构ID
 *  orgName: string, // 机构名
 *  blgStripLine: string, // 节点所在条线 注：这个值没有用到组件中
 *  lateFixNode: null,  // 未知
 *  allPrnNode: 'orgId|orgId|orgId',  // 从顶级节点开始到当前节点的orgId
 *  prnOrgId: null, // 未知
 *  orgLvl: null, // 未知
 *  pageSort: null, // 未知
 *  prnPageSort: null, // 未知
 *  ifFixNode: null, // 未知
 *  isChoose: null, // 未知
 *  isSpread: 'Y'|'N', // 是否有下级节点
 * }
 */

const props = defineProps({
  // 绑定数据
  value: {
    type: Array,
    required: true
  },
  // 树结构的顶级节点。数据结构必须匹配selectTree接口返回的数据结构
  topNode: {
    // TopNodeItem[]
    type: Array,
    required: true
  },
  // 请求条线
  busiType: {
    type: String,
    required: true
  },
  // 其他请求参
  fetchParams: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['input'])

const institutionRef = ref(null)
const orgs = ref([])
const fetchParams = reactive({ ...CopyObj(props.fetchParams) })
const formatNodeData = (datas) => {
  return CopyObj(datas).map((row) => ({
    ...row,
    leaf: row.isSpread === 'N'
  }))
}

watch(
  () => props.topNode,
  (n) => {
    if (!n || !n.length) return
    // 强写机构树组件的属性。这里的逻辑，会以topNode的条线作为最高优先级进行查询
    nextTick(() => {
      institutionRef.value && (institutionRef.value.noLineTreeData = formatNodeData(n))
    })
    if (!orgs.value.length) {
      orgs.value = CopyObj(n)
      nextTick(() => {
        institutionRef.value.setContentValue([props.topNode[0].orgName])
      })
    }
  },
  { immediate: true }
)

// 在底层机构树选择后，会把数据反馈到外部调用方
watch(orgs, (n) => {
  emit('input', CopyObj(n))
})

const setContentValue = (value) => {
  console.log(value, '==>> value');
  institutionRef.value.setContentValue([value])
}
defineExpose({ setContentValue })

</script>
<script>
export default {
  name: 'TopNodeInstitution'
}
</script>

<style lang='scss' scoped>
</style>
