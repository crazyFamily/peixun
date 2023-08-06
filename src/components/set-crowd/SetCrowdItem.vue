<template>
  <div :class="divClass" :style="divStyle">
    <el-form-item label="可见人群" :label-width="labelWidth">
      <div slot="label" class="aic">
        可见人群
        <el-tooltip placement="bottom" popper-class="table-popper" effect="light">
          <div slot="content" style="width: 300px">
            <p class="mt5">设置{{type === 'case' ? '案例': '模块'}}在移动端的可见性，如不设置则默认为全员可见</p>
          </div>
          <i class="el-icon-question active"></i>
        </el-tooltip>
      </div>
      <el-button v-if="!isDetail" class="button-my-primary-plain mr10" @click="openSetDialog">设置</el-button>
      <div class="btn-view" @click="openViewDialog">
        已添加<span class="orange">{{(crowdOrgs && crowdOrgs.length) || 0}}</span>个组织，<span class="orange">{{allUmNum}}</span>个员工<span class="orange">详情</span>
      </div>
    </el-form-item>
    <!-- 选择人员 -->
    <SetCrowdDialog :type="type" ref="setCrowdDialogRef" @comfirm="comfirmDialog" />
    <ViewCrowdDialog 
      :type="type" 
      :isDetail="isDetail"
      ref="viewCrowdDialogRef" 
      @close="colseDialog" 
      @comfirm="comfirmDialog" />
  </div>
</template>
<script setup>
import { ref, reactive, computed, watch, set, onMounted, onActivated } from 'vue'
import { fetchFindCaseVisibleCount, fetchFindColumnVisibleCount } from '@/fetch/caseCenter'
import SetCrowdDialog from '@/components/set-crowd/SetCrowdDialog'
import ViewCrowdDialog from '@/components/set-crowd/ViewCrowdDialog'

const emits = defineEmits(['comfirm'])
const props = defineProps({
  type: {
    type: String,
    default: 'case'
  },
  isDetail: Boolean,
  importId: String,
  crowdBatchId: String,
  crowdOrgs: Array,
  labelWidth: String,
  divStyle: Object,
	divClass: Object,
})
const fnMapping = {
  case: {
  fetchFindVisibleCount: fetchFindCaseVisibleCount
  },
  column: {
    fetchFindVisibleCount: fetchFindColumnVisibleCount
  }
}
const fetchFindVisibleCount = computed(() => fnMapping[props.type].fetchFindVisibleCount)
const allUmNum = ref(0) // 员工数
const orgNum = ref(0) // 组织数
const effUmNum = ref(0) // 已保存um数量
const tempUmNum = ref(0) // 未保存um数量
async function getCrowdCount () {
  const params = {
    data: {
      crowdBatchId: props.crowdBatchId,
      importId: props.importId
    }
  }
  const res = await fetchFindVisibleCount.value(params)
  allUmNum.value = res.allUmNum
  effUmNum.value = res.effUmNum
  tempUmNum.value = res.tempUmNum
  // orgNum.value = crowdOrgsLength || res.orgNum
}
const crowdOrgs = ref([])
watch(
  () => props.crowdOrgs,
  n => {
    crowdOrgs.value = n
  },
  { immediate: true }
)
watch(() => props.crowdBatchId, () => {
  // 案例管理的编辑页面中，会触发下面getCrowdCount方法
  getCrowdCount()
})

const setCrowdDialogRef = ref(null)
const viewCrowdDialogRef = ref(null)
function openSetDialog () {
  setCrowdDialogRef.value.openDialog({
    isOpen: true,
    importId: props.importId,
    crowdOrgs: crowdOrgs.value,
  })
}

function openViewDialog () {
  viewCrowdDialogRef.value.openDialog({
    isOpen: true,
    importId: props.importId,
    crowdBatchId: props.crowdBatchId,
    crowdOrgs: crowdOrgs.value,
    allUmNum: allUmNum.value,
    effUmNum: effUmNum.value,
    tempUmNum: tempUmNum.value
  })
}
function colseDialog () {
  getCrowdCount()
}
function comfirmDialog(setParams) {
  const { fromPage, data } = setParams
  crowdOrgs.value = data.orgs
  emits('comfirm', {
    crowdOrgs: crowdOrgs.value,
  })
  getCrowdCount()
}
onMounted(() => {
  // 首页设置中的“首页”、“案例中心”页面中，会触发下面getCrowdCount方法
  if (props.crowdBatchId) {
    getCrowdCount()
  }
})
onActivated(() => {
  // 首页设置中的“首页”、“案例中心”页面中，会触发下面getCrowdCount方法
  if (props.crowdBatchId) {
    getCrowdCount()
  } else {
    // 不存在 crowdBatchId 值，则表示没有设置过人员，都为0
    allUmNum.value = 0
    effUmNum.value = 0
    tempUmNum.value = 0
  }
})
</script>
<style lang="scss" scoped>
.orange {
  color: #fd6720;
}
.btn-view {
  cursor: pointer;
  display: inline-block;
}
</style>
