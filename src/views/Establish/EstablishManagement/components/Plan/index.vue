<template>
  <gc-model
    title="关联计划"
    :visible="isDialogShow"
    width="1200px"
    class="correlation-plan"
    @close="close"
    @cancel="cancel"
    @comfirm="save"
  >
    <el-tabs v-model="activeName">
      <template v-for="tab in planTabs">
        <el-tab-pane :label="tab.label" :name="tab.name" class="internalPlan"></el-tab-pane>
      </template>
    </el-tabs>
    <template v-if="isDialogShow">
      <InternalPlan :class-types="classTypes" :establish-info="props.dataInfo" :class-type="props.dataInfo.classTypeOne" :blg-strip-line="props.dataInfo.blgStripLine" @changeLine="changeLine" @select="internalPlanSelected" v-show="activeName === 'internalPlan'"></InternalPlan>
      <ExternalPlan v-show="activeName === 'externalPlan'"></ExternalPlan>
    </template>
  </gc-model>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import InternalPlan from './InternalPlan.vue'
import ExternalPlan from './ExternalPlan.vue'
import { fetchListPlanDict } from '@/fetch/public'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { Message } from 'element-ui'
const { mergeReactive, clearReactive } = useBaseDataEvents()
const activeName = ref('internalPlan')
const planInfos = [
  {
    name: 'internalPlan',
    label: '计划内'
  },
  // {
  //   name: 'externalPlan',
  //   label: '计划外'
  // },
]
const planTabs = computed(() => {
  return planInfos
})
const emit = defineEmits(['save', 'cancel'])
const props = defineProps({
  show: {
    type: Boolean,
    required: false
  },
  dataInfo: {
    type: Object,
    required: true
  },
  autoClose: {
    type: Boolean,
    default: true
  }
})
const isDialogShow = computed(() => {
  return props.show
})

// 获取项目分类数据
const classTypes = ref({})
const getClassTypes = async (line) => {
  console.log(props.dataInfo, '===>>> datainfo');
  const data = {
    line: line || props.dataInfo.blgStripLine || 'LS', 
    type: props.dataInfo.classTypeOne || '01001'
  }
  const res = await fetchListPlanDict(data)
  return res
}

const setClassTypes = async(line) => {
  classTypes.value = await getClassTypes(line)
}

const selectedPlan = reactive({})
watch(() => props.show, n => {
  if(n) {
    clearReactive(selectedPlan)
    setClassTypes()
  }
}, {immediate: true} )
const internalPlanSelected = (row) => {
  mergeReactive({origin: selectedPlan, target: row})
}

const close = () => {
  emit('update:show', false)
}
const cancel = () => {
  emit('cancel')
  close()
}
const save = () => {
  if(!selectedPlan.annualPlanId) return Message.warning('请选择一条计划')
  emit('save', selectedPlan)
  props.autoClose && close()
}

defineExpose({close})

const changeLine = (line) => {
  setClassTypes(line)
}

</script>
<script>
export default {
  name: 'EstablishPlan'
}
</script>
<style lang='scss' scoped>
</style>
