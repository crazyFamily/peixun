<template>
  <div class="CaseCenter__specialManage">
    <!-- 内容 -->
    <el-card>
      <div class="page-nav">
        <el-radio-group v-model="activeTab" size="small">
          <el-radio-button label="general">普通专题</el-radio-button>
          <el-radio-button label="score">评分专题</el-radio-button>
        </el-radio-group>
      </div>
      <div class="page-list">
        <SpecialList :specialType="activeTab" @changeComp="changeComp" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import SpecialList from './SpecialList'
import { ref, watch, reactive } from 'vue'
const props = defineProps({
  compData: {
    type: Object,
    default: {} // general, score
  }
})
const activeTab = ref('general')
watch(
  () => props.compData,
  n => {
    activeTab.value = props.compData.activeTab || 'general'
  },
  { immediate: true }
)
// 注册事件
const emits = defineEmits(['changeComp'])
const changeComp = params => {
  emits('changeComp', params)
}
</script>
<script>
export default {
  name: 'SpecialManageList'
}
</script>
<style lang="scss" scoped>
.CaseCenter__specialManage {
  .page-list {
    margin-top: 15px;
  }
}
</style>
