<template>
  <div>
    <el-tabs v-model="activeTab" class="tabModulePage">
      <el-tab-pane v-if="tabs.includes('manual')" name="manual" label="手工配置">
        <EditModuleCustom :moduleData="props.moduleData" @change="changeHandle" @save="saveHandle" />
      </el-tab-pane>
      <el-tab-pane v-if="tabs.includes('module')" name="module" label="功能模块">
        <EditModuleFunction :moduleData="props.moduleData" @change="changeHandle" @save="saveHandle" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onActivated, computed } from 'vue'
import EditModuleCustom from './EditModuleCustom'
import EditModuleFunction from './EditModuleFunction'

const activeTab = ref('')
const props = defineProps({
  moduleData: {
    type: Object,
    default: () => {}
  }
})
const emits = defineEmits(['change', 'save'])
// let moduleData = reactive({})
function changeHandle(data) {
  // activeTab.value = 'coustom'
  emits('change', data)
}
function saveHandle(data) {
  emits('save', data)
}
const tabs = ref([])

onMounted(() => {
  // console.log('onMounted', props.moduleData)
})

onActivated(() => {
  if (props.moduleData.columnCategory === undefined) {
    tabs.value = ['manual', 'module']
    activeTab.value = 'manual'
  } else {
    tabs.value = [props.moduleData.columnCategory]
    activeTab.value = props.moduleData.columnCategory
  }
  // console.log('onMounted', props.moduleData)
})
</script>


<style lang="scss" scoped>
:deep(.tabModulePage > .el-tabs__header) {
  margin-bottom: -1px;
  background-color: #fff;
}
</style>
