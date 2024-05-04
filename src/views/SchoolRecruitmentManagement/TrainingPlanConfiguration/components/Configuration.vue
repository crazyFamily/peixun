<template>
  <div class="schoolRecruitmentManagement__configuration">
    <div class="configuration-cont">
      <div class="main-wrapper mr10">
        <div class="menu-wrapper">
          <p
            v-for="(item, index) in versionList"
            :key="index"
            @click="changeVersionHandle(item, index)"
            :class="{ active: activeVersion.planId === item.planId }"
            class="menu-item"
          >
            {{ item.planStartDate }}
          </p>
          <p v-if="type === 'edit'" class="tac mt10">
            <el-button :class="{ 'focus-active': focusAddBtn }" class="button-item" @click="addVersionHandle">新增</el-button>
          </p>
        </div>
      </div>
      <div v-if="noData" class="fdc" style="width: 100%">
        <div class="no_data">
          <img class="no-data-img" src="@/assets/images/no-data.png" alt="" />
          <p>{{ type === 'edit' ? '暂未添加版本配置，请点击新增添加内容' : '暂未添加版本配置' }}</p>
        </div>
        <div class="footer-box dfc">
          <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
        </div>
      </div>
      <div v-else class="content-container">
        <el-form :disabled="!hasEdit" class="config-from p20" ref="configFromRef" :model="configFrom" :rules="configFromRules" label-width="120px">
          <div class="base-info dfw">
            <el-form-item label="轮岗岗位类型">
              <el-input class="sw-250" :value="configFrom.transferPositionType" disabled></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="planStartDate">
              <el-date-picker
                v-model="configFrom.planStartDate"
                class="sw-250"
                type="date"
                placeholder="选择日期"
                :picker-options="{}"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <div class="course-item">
              <el-form-item label="团队/支行负责人" label-width="120px" prop="teamPrincipal">
                <el-input v-model="configFrom.teamPrincipal" :disabled="false" class="sw-250" maxlength="20" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="管理部门" prop="adminDepartment">
                <el-input v-model="configFrom.adminDepartment" :disabled="false" class="sw-250" maxlength="20" show-word-limit></el-input>
              </el-form-item>
            </div>
          </div>
          <el-collapse v-model="activeCollapseNames">
            <el-collapse-item name="ConfigurationModule">
              <div slot="title" class="title mt10 mb10">
                <div class="title__menu"></div>
                课程模块
              </div>
              <ConfigurationModule
                :disable="type === 'view'"
                v-model="configFrom.courseModuleList"
                @clearValidateModule="clearValidateModule"
              ></ConfigurationModule>
            </el-collapse-item>
            <el-collapse-item name="PracticeModule">
              <div slot="title" class="title mt10 mb10">
                <div class="title__menu"></div>
                实践模块
              </div>
              <PracticeModule
                :disable="type === 'view'"
                v-model="configFrom.practiceModuleList"
                @clearValidateModule="clearValidateModule"
              ></PracticeModule>
            </el-collapse-item>
            <el-collapse-item name="QualificationModule">
              <div slot="title" class="title mt10 mb10">
                <div class="title__menu"></div>
                资质模块
              </div>
              <QualificationModule
                :disable="type === 'view'"
                v-model="configFrom.qualificationModuleList"
                @clearValidateModule="clearValidateModule"
              ></QualificationModule>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div class="footer-box dfc">
          <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
          <el-button class="button-w80-h30" v-if="hasEdit && !noData" :loading="submitLoading" type="primary" @click="handleSubmit">提交</el-button>
          <el-button class="button-w80-h30 button-blue" v-if="hasEdit && !noData" :loading="deleteLoading" @click="handleDelete">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, nextTick } from 'vue'
import { hintFrame, resetObj, CopyObj } from '@/util/utils.js'
import ConfigurationModule from './ConfigurationModule.vue'
import PracticeModule from './PracticeModule.vue'
import QualificationModule from './QualificationModule.vue'
import {
  fetchListConfigVersion,
  fetchFosterPlanConfigDetail,
  fetchSaveFosterPlanConfig,
  fetchDeleteFosterPlanConfig
} from '@/fetch/schoolRecruitmentManagement'
import { Message } from 'element-ui'
import store from '@/store'
const props = defineProps({
  transferPositionType: {
    type: String
  },
  type: {
    type: String,
    required: true,
    defalut: 'view'
  }
})

const emit = defineEmits(['submit'])
// ------------------- 左侧版本处理 start -------------------
const baseConfigFrom = {
  transferPositionType: '',
  planStartDate: '',
  teamPrincipal: '',
  adminDepartment: '',
  courseModuleList: [],
  practiceModuleList: [],
  qualificationModuleList: []
}
const configFrom = ref(baseConfigFrom)
// 获取左侧版本列表数据
const versionList = ref([])
const activeVersion = ref({}) // 当前选中的版本
const noData = ref(false)
const getVersionList = async () => {
  const res = await fetchListConfigVersion({ data: { transferPositionType: props.transferPositionType } })
  versionList.value = res || []
  activeVersion.value = versionList.value[0] || {}
  if (!versionList.value[0]) {
    noData.value = true
  } else {
    getDetail()
  }
}
const changeVersionHandle = (item, index) => {
  if (props.type === 'edit') {
    hintFrame('是否切换版本内容？未保存的修改将会丢失').then(() => {
      activeVersion.value = { ...item }
      focusAddBtn.value = false
      getDetail()
    })
  } else {
    activeVersion.value = { ...item }
    getDetail()
  }
}
const focusAddBtn = ref(false)
const addVersionHandle = () => {
  noData.value = false
  if (planId.value) {
    hintFrame('是否切换版本内容？未保存的修改将会丢失').then(() => {
      activeVersion.value = {}
      focusAddBtn.value = true
      dataTransition(CopyObj(baseConfigFrom))
    })
  } else {
    activeVersion.value = {}
    focusAddBtn.value = true
    dataTransition(CopyObj(baseConfigFrom))
  }
}
const planId = computed(() => {
  return versionList.value.find((v) => v.planId === activeVersion.value.planId)?.planId
})
const hasEdit = computed(() => {
  return props.type !== 'view'
})
getVersionList()
// ------------------- 左侧版本处理 end -------------------
// ------------------- 右侧详情处理 start -------------------
const configFromRules = ref({
  planStartDate: [{ required: true, message: '请选择开始时间' }],
  teamPrincipal: [{ required: true, message: '请填写团队/支行负责人' }],
  adminDepartment: [{ required: true, message: '请填写管理部门' }]
})
const getDetail = async () => {
  const res = await fetchFosterPlanConfigDetail({
    data: { transferPositionType: props.transferPositionType, planId: planId.value }
  })
  dataTransition(res)
}
// 转换为 本页适合的数据
const dataTransition = (res) => {
  res.transferPositionType = res.transferPositionType || props.transferPositionType
  res.courseModuleList = res.courseModuleList || []
  res.practiceModuleList = res.practiceModuleList || []
  res.qualificationModuleList = res.qualificationModuleList || []
  res.courseModuleList.forEach((v) => {
    v.showCourseInfo = v.fosterProjectId
  })
  res.practiceModuleList.forEach((v) => {
    v.showCourseInfo = v.fosterProjectId
  })
  res.qualificationModuleList.forEach((v) => {
    v.showCourseInfo = v.fosterProjectId
  })
  configFrom.value = res
  nextTick(() => {
    configFromRef.value?.clearValidate()
  })
}
const clearValidateModule = (row) => {
  configFromRef.value?.clearValidate(row)
}
const activeCollapseNames = ref(['ConfigurationModule', 'PracticeModule', 'QualificationModule'])
// ------------------- 右侧详情处理 end -------------------
const closeHandle = () => {
  store.dispatch('schoolRecruitmentManagement/changeTrainingPlanComp', { status: 'list' })
  emit('submit')
}
const CurrentPageDataTobackgroundData = () => {
  let fromData = CopyObj(configFrom.value)
  return fromData
}
const submitLoading = ref(false)
const configFromRef = ref(null)
const handleSubmit = () => {
  configFromRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      fetchSaveFosterPlanConfig({ data: CurrentPageDataTobackgroundData() })
        .then((res) => {
          Message.success('提交成功！')
          focusAddBtn.value = false
          if (!planId.value) {
            getVersionList()
          }
          // store.dispatch('schoolRecruitmentManagement/changeTrainingPlanComp', { status: 'list' })
          // emit('submit')
        })
        .finally(() => {
          submitLoading.value = false
        })
    }
  })
}
const deleteLoading = ref(false)
const handleDelete = () => {
  // 删除：当前选中的版本planId，调接口删除；当前存在版本列表点击新增时的删除，默认选中第一个展示；没有版本列表展示添加内容
  hintFrame('是否确定删除？').then(() => {
    focusAddBtn.value = false
    if (planId.value) {
      deleteLoading.value = true
      fetchDeleteFosterPlanConfig({ data: { planId: planId.value } })
        .then((res) => {
          Message.success('删除成功！')
          getVersionList()
        })
        .finally(() => {
          deleteLoading.value = false
        })
    } else if (!versionList.value.length) {
      noData.value = true
    } else {
      Message.success('删除成功！')
      activeVersion.value = versionList.value[0] || {}
      getDetail()
    }
  })
}
</script>

<script>
export default {
  name: 'Configuration'
}
</script>
<style lang="scss" scoped>
.schoolRecruitmentManagement__configuration {
  display: flex;
  height: 100%;
  flex-direction: column;
  .configuration-cont {
    display: flex;
    flex: 1;
    overflow: hidden;
    .menu-wrapper {
      width: 150px;
      height: 100%;
      background-color: #fff;
      padding: 10px 0;
      overflow: auto;

      .menu-item {
        height: 30px;
        line-height: 30px;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        cursor: pointer;
        padding: 0 20px;
      }

      .menu-item.active {
        background: rgba(234, 236, 241, 0.3);
      }
      .button-item {
        min-width: 80px;
        height: 30px;
      }
      .focus-active {
        border-color: #fed1bc !important;
        background-color: #fff0e9 !important;
      }
    }
    .content-container {
      flex: 1;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      .config-from {
        flex: 1;
        overflow-y: auto;
        .course-item {
          display: flex;
          flex-wrap: wrap;
        }
      }
      .form-wrapper {
        display: flex;
        flex-wrap: wrap;
      }
      .sw-250 :deep(.el-input__inner) {
        padding-right: 48px !important;
      }
      :deep(.el-input__suffix) {
        right: 2px;
      }
    }
  }
}
</style>