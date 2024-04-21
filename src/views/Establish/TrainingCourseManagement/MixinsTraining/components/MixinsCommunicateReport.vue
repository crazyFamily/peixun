<template>
  <div class="report-wrapper"
    v-if="isShow"
    v-loading="isListLoading">
    
    <div class="drop-container">
      <div v-loading="getLoadingStatus('LOADING_FIND_PACKAGEINFO') || getLoadingStatus('LOADING_PLAN_SUBMIT')">
        <div class="title content-title">
              <div class="title__menu"></div>
              交流数据
            </div>
        <CommunicateInfo ref="infoRef" :subject-info="subjectInfo"></CommunicateInfo>
        <div class="title content-title">
              <div class="title__menu"></div>
              评论详情
            </div>
        <CommunicateTable ref="tableRef" :subject-info="subjectInfo"></CommunicateTable>
      </div>
      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" type="primary" @click="returnCommunicate"><i class="add-icon"></i>返回</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import CommunicateInfo from './CommunicateInfo.vue'
import CommunicateTable from './CommunicateTable.vue'
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import store from '@/store'
import { CopyObj } from '@/plugins/until'
import { fetchAddPlan, fetchSubmitPlanPackage, fetchUpdatePlan } from '@/fetch/planManagement'
import { Message } from 'element-ui'
import { getLoadingStatus } from '@/util/utils'
const { mergeReactive } = useBaseDataEvents()

const editCompProps = ref({})
const status = ref('info')
const packageInfo = reactive({})

const isListLoading = computed(() => {
  return getLoadingStatus('LOADING_COMMUNICATE_SUBJECT_DETAIL') ||
  getLoadingStatus('LOADING_UPDATE_COMMUNICATE_SUBJECT_SORT_NO') ||
  getLoadingStatus('LOADING_UP_DOWN_COMMUNICATE_SUBJECT') ||
  getLoadingStatus('LOADING_DELETE_COMMUNICATE_SUBJECT') || 
  getLoadingStatus('LOADING_LIST_COMMUNICATE_SUBJECT')
})
const isShow = ref(false)
watch(
  () => props.show,
  (n) => {
    isShow.value = n
    if(!n) return
  }
)
const props = defineProps({
  subjectInfo: {
    type: Object,
    required: true
  },
  show:{
      type:Boolean,
      required:true
  }
})
store.commit('planManagement/resetAnnualDatas')
watch(
  () => store.getters['planManagement/getAnnualStatus'],
  (n) => {
    if (n === 'edit') {
      editCompProps.value = CopyObj(store.getters['planManagement/getCurrentEditCompProps'])
    }
    status.value = n
  }
)


const btnStatus = ref(true)

const emit = defineEmits(['close'])
// 返回
const returnCommunicate = () => {
  emit('close', true)
}

const changeToInfoStatus = () => {
  store.dispatch('planManagement/changeAnnualEditComp', {status: 'info'})
}

// 保存
const componentRef = ref(null)
const handlePlanBtnClick = () => {
  componentRef.value?.addSubmit()
}

</script>

<script>
export default {
  name: 'AnnualPlan'
}
</script>
<style lang='scss' scoped>
.report-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: absolute;
    top:0;
    padding:10px 20px;
  background-color: #fff;
}
.button-wrapper {
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.content-title{
  // width: 56px;
  height: 20px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #000000;
  font-weight: 500;
  margin:20px 10px;
}
.footer-box {
  bottom: -15px;
}
</style>
