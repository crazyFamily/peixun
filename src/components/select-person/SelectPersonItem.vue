<template>
  <div :class="divClass" :style="divStyle">
    <el-form-item label="可见人群" :label-width="labelWidth">
      <div slot="label" class="aic">
        可见人群
        <el-tooltip placement="bottom" popper-class="table-popper" effect="light">
          <div slot="content" style="width: 300px">
            <p class="mt5">设置模块在移动端的可见性，如不设置则默认为全员课件</p>
          </div>
          <i class="el-icon-question active"></i>
        </el-tooltip>
      </div>
      <el-button v-if="!isDetail" class="button-my-primary-plain" @click="openSelectPersonDialog">设置</el-button>
      <el-button @click="openSelectPersonViewDialog" type="text" class="ml10">查看已导入人员</el-button>
      <div v-if="crowdOrgs && crowdOrgs.length" class="org-list-view mt10" :style="divOrgStyle">
        <el-tag class="mr10" v-for="(item,i) in crowdOrgs" :key="i" type="info">
          <span>{{item.orgName}}</span>
        </el-tag>
      </div>
    </el-form-item>
    <!-- 选择人员 -->
    <SelectPerson :type="type" ref="selectPersonRef" @comfirm="comfirmDialog" />
    <!-- 显示已导入人员 -->
    <SelectPersonView :type="type" ref="selectPersonViewRef" @comfirm="comfirmDialog" />
  </div>
</template>
<script setup>
import { ref, reactive, computed, watch, set, nextTick } from 'vue'
import SelectPerson from '@/components/select-person/SelectPerson'
import SelectPersonView from '@/components/select-person/SelectPersonView'

const props = defineProps({
  type: {
    type: String,
    default: 'case'
  },
  isDetail: Boolean,
  importId: String,
  crowdBatchId: String,
  crowdOrgs: {
    type: Array,
    default: () => []
  },
  labelWidth: String,
  divStyle: Object,
	divClass: Object,
	divOrgStyle: Object
})
const emits = defineEmits(['comfirm'])

const crowdOrgs = ref([])
const deleteUserObjList = ref([])
watch(
  () => props.crowdOrgs,
  n => {
    crowdOrgs.value = n
  },
  { immediate: true }
)

const selectPersonRef = ref(null)
const selectPersonViewRef = ref(null)

function openSelectPersonDialog() {
  const data = {
    importId: props.importId,
    crowdOrgs: crowdOrgs.value
  }
  selectPersonRef.value?.openDialog(data)
}

function openSelectPersonViewDialog() {
  const data = {
    isDetail: props.isDetail,
    batchId: props.crowdBatchId,
    deleteUserList: deleteUserObjList.value
  }
  selectPersonViewRef.value?.openDialog(data)
}

function comfirmDialog(data) {
  if (data.crowdOrgs) {
    crowdOrgs.value = data.crowdOrgs
  }
  if (data.objArr) {
    deleteUserObjList.value = data.objArr
  } else {
    deleteUserObjList.value = []
  }
  const params = {
    crowdOrgs: crowdOrgs.value,
    deleteUserList: deleteUserObjList.value.map(m => m.umId),
    deleteUserObjList: deleteUserObjList.value
  }
  emits('comfirm', params)
}
</script>
<style lang="scss" scoped>
.org-list-view {
  padding: 5px 10px;
  border: 1px #f0f0f0 solid;
  border-radius: 2px;
  :deep(.el-tag) {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
</style>
