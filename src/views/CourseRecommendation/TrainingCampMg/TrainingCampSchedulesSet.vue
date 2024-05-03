<template>
  <div class="schedule-wrapper">
    <div class="nav-container">
      <el-tabs
        v-model="activeSchedule"
        type="card"
        :editable="!disabled"
        :closable="!disabled"
        @edit="scheduleEditHandle"
        class="schedule-tabs"
        :class="{ 'disabled-style': disabled }"
      >
        <!-- @tab-remove="scheduleRemoveHandle" -->
        <template v-for="(item, index) in navSchedules">
          <el-tab-pane :key="item.uid" :label="`阶段${index + 1}`" :name="item.uid"></el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div class="data-info-wrapper" v-for="(formItem, index) in navSchedules" v-show="formItem.uid === activeSchedule" :key="formItem.uid">
      <el-form :model="secheduleDataInfo" v-if="secheduleDataInfo.datas[index]" ref="secheduleFormRef" label-width="100px" :disabled="disabled">
        <el-form-item label="阶段标题：" :prop="`datas[${index}].stageName`" :rules="{ required: true, message: '请输入阶段标题' }" class="form-item">
          <el-input
            v-model="secheduleDataInfo.datas[index].stageName"
            @change="updateSechduleSettingHandle(secheduleDataInfo.datas[index], null, true)"
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="起止日期：" :prop="`datas[${index}].timeRange`" :rules="timeRangeValidator()" class="form-item">
          <el-date-picker
            class="rms-daterange-picker input-width"
            v-model="secheduleDataInfo.datas[index].timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :clearable="false"
            @change="updateSechduleSettingHandle(secheduleDataInfo.datas[index], null, true)"
          >
          </el-date-picker>
        </el-form-item>
        <div class="drop-wrapper" ref="contentRef">
          <el-form-item
            v-for="(stageInfo, stageIndex) in formItem.stageSeriesList"
            :key="stageIndex"
            :data-id="formItem.stageSeriesList[stageIndex].uid"
          >
            <template #label>
              <p>
                <span v-show="!disabled" class="drop-icon drop">
                  <img src="@/assets/svg/drop.svg" alt="" />
                </span>
                内容：
              </p>
            </template>
            <div class="sechedule-info-wrapper">
              <div class="setting-wrapper">
                <div class="setting-items">
                  <!-- <div class="label">内容：</div> -->
                  <div class="content">
                    <!-- <SecheduleSetting class="setting-info" :value="{}" :data-info="formItem.stageSeriesList[stageIndex]"></SecheduleSetting> -->
                    <SecheduleSetting
                      class="setting-info"
                      :value="{}"
                      :time-range="navSchedules[index].timeRange"
                      :dataInfo="navSchedules[index].stageSeriesList[stageIndex]"
                      @input="updateSechduleSettingHandle($event, stageInfo)"
                      ref="secheduleSettingRef"
                      :disabled="disabled"
                      :ifNotShow="ifNotShow"
                    ></SecheduleSetting>
                    <div class="dfcc control-wrapper">
                      <i class="control-icon instructor-icons__del__icon" @click="removeSeriesItemHandle(stageInfo, stageIndex)" v-if="!disabled"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button class="dfcc add-button" @click="addScheduleHandle" v-if="!disabled">
            <span class="dfcc icons__add">
              <i class="icons__add__icon"></i>
              添加内容
            </span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
/**
 * TODO:
 * 定义props done
 * tabs - 可编辑/可删除 done
 * tabs默认选中项 done
 * 样式调整 done
 * 动态表单校验 done
 * 拖拽效果 done
 * 详情数据加载效果 done
 * 表单编辑的时候要更新map done
 * 与原有数据逻辑整合 done
 * 优化：sortable应该写入hooks
 */
import { computed, onMounted, reactive, ref, unref, nextTick, watch } from 'vue'
import { uuid, CopyObj, customHint, formatDate } from '@/util/utils'
import SecheduleSetting from './components/ScheduleSetting.vue'
import store from '@/store'
import { useTrainingHooks } from './hooks/useTrainingHooks'
import { Message } from 'element-ui'
import tagVue from '@/components/chunk/tag.vue'
const { initMap, updateMap, getDataMap, removeMap, clearMap, initSortableTarget } = useTrainingHooks()

// 初始化功能
const props = defineProps({
  value: {
    type: Array,
    required: true
  },
  dataInfo: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  },
  ifNotShow: {
    type: String,
    default: 'N'
  }
})
const activeSchedule = ref('')
const scheduleMap = new Map()
// 后续要进行变更赋值, 这里用 ref 更方便
const navSchedules = ref([])
const secheduleBaseInfo = () => {
  return {
    stageName: '',
    timeRange: [],
    stageSeriesList: []
  }
}
const secheduleDataInfo = reactive({
  datas: [secheduleBaseInfo()]
})
const trainingStageItem = () => ({
  type: 'series',
  uid: uuid()
})

const contentRef = ref(null)
let sortableEl = []
const initSortable = async () => {
  await nextTick()
  if (!contentRef.value) return
  sortableEl = []
  contentRef.value.forEach(async (itemRef) => {
    sortableEl.push(await initSortableTarget(itemRef))
  })
}

const formatData = (datas) => {
  const result = CopyObj(datas)
  // 组合时间格式
  result.forEach((item) => {
    item.uid = item.uid || uuid()
    if (item.startTime && item.endTime) {
      item.timeRange = [item.startTime, item.endTime]
    } else {
      item.timeRange = []
    }
  })

  // 过滤掉旧数据影响
  result.forEach((item) => {
    item.uid = item.uid || uuid()
    item.stageSeriesList = item.stageSeriesList.filter((stageItem) => ['series', 'class'].includes(stageItem.type))
    item.stageSeriesList = item.stageSeriesList.map((stageItem) => {
      stageItem.uid = stageItem.uid || uuid()
      return stageItem
    })
  })
  return result
}

const initData = (datas) => {
  clearMap()
  navSchedules.value = initMap(formatData(datas))
  activeSchedule.value = unref(navSchedules)[0].uid
  initSortable()
}

watch(
  () => store.state.trainingCamp.trainingStageList,
  (n) => {
    if (!n || !n.length) {
      n = [secheduleBaseInfo()]
    }
    initData(n)
  },
  { immediate: true }
)
watch(navSchedules, (n) => {
  secheduleDataInfo.datas = CopyObj(n)
})

const secheduleErrorTip = (tip) => {
  Message.warning(`课表设置错误：${tip}`)
}

// 数据输出 start
// 把数据内容组装成和容器一样的数组结构
const createDatasForContainer = (container, datas, key, isIncremental = false) => {
  let containerList = container.map(() => [])
  let containerIndex = 0
  datas.forEach((datsItem) => {
    // 增量使用push
    if (isIncremental) {
      containerList[containerIndex].push(datsItem)
    } else {
      containerList[containerIndex] = datsItem
    }
    if (containerList[containerIndex].length === container[containerIndex][key].length) {
      containerIndex++
    }
  })

  return containerList
}

// 处理排序结果
const getSortResultData = (datas) => {
  // TODO: 逻辑重复,需要优化  把formRef对象装入系列数组对像中
  // let refList = secheduleDataInfo.datas.map((item) => {
  //   return []
  // })

  // let secheduleDataInfoIndex = 0
  // sortableEl.forEach((settingItem) => {
  //   refList[secheduleDataInfoIndex] = settingItem.toArray()
  //   if (refList[secheduleDataInfoIndex].length === secheduleDataInfo.datas[secheduleDataInfoIndex].stageSeriesList.length) {
  //     secheduleDataInfoIndex++
  //   }
  // })

  const formatSettingDatas = sortableEl.map((item) => item.toArray())
  let refList = createDatasForContainer(secheduleDataInfo.datas, formatSettingDatas, 'stageSeriesList')

  refList = refList.map((item, index) => {
    const res = CopyObj(datas[index])
    res.stageSeriesList = []
    item.forEach((uidItem) => {
      res.stageSeriesList.push(datas[index].stageSeriesList.find((findItem) => findItem.uid === uidItem))
    })
    return res
  })

  return refList
}
// 结果数据处理
const getSecheduleInfo = () => {
  const resultData = CopyObj(secheduleDataInfo)
  resultData.datas = getSortResultData(resultData.datas)
  console.log(resultData, ' ====> result data')
  resultData.datas = resultData.datas.map((item) => {
    item.startTime = item.timeRange[0]
    item.endTime = item.timeRange[1]
    if (!item.stageSeriesList) return item
    item.stageSeriesList = item.stageSeriesList.filter((item) => ['class', 'series'].includes(item.type))
    return item
  })
  return resultData
}
// 抛出结果数据
const exportSecheduleInfo = () => {
  return new Promise(async (resolve, reject) => {
    if (await secheduleInfoValidator()) {
      return resolve(getSecheduleInfo())
    }
    reject()
  })
}
defineExpose({ getSecheduleInfo, exportSecheduleInfo })

// const setDefaultActive = (index) => {
//   if (unref(navSchedules).length === 1) {
//     activeSchedule.value = unref(navSchedules)[0].uid
//   } else {
//     activeSchedule.value = unref(navSchedules)[index].uid
//   }
// }

// 阶段增删操作处理  --- start ---
const scheduleEditHandle = (uid, action) => {
  const MAX_LENGTH = 6
  const MIN_LENGTH = 1
  switch (action) {
    case 'add':
      if (navSchedules.value.length >= MAX_LENGTH) return Message.warning(`最多设置${MAX_LENGTH}个阶段`)
      addStageHandle()
      initSortable()
      break
    case 'remove':
      if (navSchedules.value.length === MIN_LENGTH) return Message.warning(`最少要有${MIN_LENGTH}个阶段`)
      scheduleRemoveHandle(uid)
      initSortable()
      break
  }
}
const findCurrentUid = (uid, targetDatas) => {
  /**
   * 1. 找到uid对应的下标
   * 2. 判断有无下标+1，有则取这个，无则取下标-1
   */
  const index = targetDatas.findIndex((row) => row.uid === uid)
  if (targetDatas[index + 1]) return targetDatas[index + 1].uid
  return targetDatas[index - 1].uid
}
const scheduleRemoveHandle = (uid) => {
  activeSchedule.value = findCurrentUid(uid, unref(navSchedules))
  navSchedules.value = removeMap(uid)
}
const addStageHandle = () => {
  const uid = uuid()
  navSchedules.value = updateMap(uid, { uid, ...secheduleBaseInfo() })
  activeSchedule.value = unref(navSchedules)[unref(navSchedules).length - 1].uid
}

// 内容增删操作处理  --- start ---
const addScheduleHandle = () => {
  const dataInfo = getDataMap(activeSchedule.value)
  dataInfo.stageSeriesList.push(trainingStageItem())
  navSchedules.value = updateMap(activeSchedule.value, dataInfo)
}
const removeSeriesItemHandle = async (row, index) => {
  await customHint('是否确认要删除所选项？', '提示', '取消')
  const currentInfo = getDataMap(activeSchedule.value)
  currentInfo.stageSeriesList = currentInfo.stageSeriesList.filter((item) => item.uid !== row.uid)
  navSchedules.value = updateMap(activeSchedule.value, currentInfo)
}
const updateSechduleSettingHandle = (data, row, immediate = false) => {
  const activeData = getDataMap(activeSchedule.value)
  if (immediate) {
    navSchedules.value = updateMap(activeSchedule.value, Object.assign(activeData, data))
    return
  }
  activeData.stageSeriesList &&
    (activeData.stageSeriesList = activeData.stageSeriesList.map((item) => {
      if (item.uid === data.uid) {
        return { ...item, ...data }
      }
      return item
    }))
  navSchedules.value = updateMap(activeSchedule.value, activeData)
}

// 数据校验
const secheduleFormRef = ref(null)
const secheduleSettingRef = ref(null)
const timeRangeValidator = () => {
  return [
    {
      required: true,
      message: '请选择始止日期',
      trigger: ['blur', 'change']
    },
    {
      validator: (rule, value, callback) => {
        if (typeof value === 'string') {
          value = [value, value]
        }
        if (formatDate(value[0]) < store.state?.trainingCamp?.startTime || formatDate(value[1]) > store.state?.trainingCamp?.endTime) {
          return callback(new Error('系列的开始结束时间不能超出整个训练营的时间'))
        }

        let cachePrevTime = ''
        for (let i = 0, j = secheduleDataInfo.datas.length; i < j; i++) {
          if (!secheduleDataInfo.datas[i].timeRange || !secheduleDataInfo.datas[i].timeRange.length) continue
          if (i === 0) continue
          const currentTime = formatDate(secheduleDataInfo.datas[i].timeRange[0])
          cachePrevTime = formatDate(secheduleDataInfo.datas[i - 1].timeRange[1])
          if (currentTime <= cachePrevTime) return callback(new Error('系列时间存在交叉'))
        }
        return callback()
      }
    }
  ]
}
const secheduleInfoValidator = async () => {
  if (!validatorHasSeriesItems()) return false
  if (!validatorSeriesFormRef()) return false
  if (!(await validatorSeriesSettingFormRef())) return false
  return true
}
// 校验1: 所有阶段必须设置有系列或者线下培训
const validatorHasSeriesItems = () => {
  const result = true
  let index = 0
  for (let item of secheduleDataInfo.datas) {
    if (!item.stageSeriesList || item.stageSeriesList.length === 0) {
      secheduleErrorTip(`阶段${index + 1}没有设置内容`)
      return false
    }
    // 由于旧数据影响，返回数据中会存在course等干扰类型，这里只判断class和series
    if (!item.stageSeriesList.some((row) => ['class', 'series'].includes(row.type))) {
      secheduleErrorTip(`阶段${index + 1}最少需要设置一个系列或者线下培训`)
      return false
    }
    index++
  }
  return result
}
// 校验2: 必须符合每个阶段的表单校验
const validatorSeriesFormRef = () => {
  let result = true
  secheduleFormRef.value.forEach((formRef, index) => {
    formRef.validate((v) => {
      if (!v) {
        result = false
        secheduleErrorTip(`阶段${index + 1} 填写信息有误`)
      }
    })
  })
  return result
}
// 校验3: 每个系列或者线下课程需要符合表单校验
const validatorSeriesSettingFormRef = async () => {
  // 把formRef对象装入系列数组对像中
  // const refList = secheduleDataInfo.datas.map((item) => {
  //   return []
  // })

  // let secheduleDataInfoIndex = 0
  // secheduleSettingRef.value.forEach((settingItem) => {
  //   refList[secheduleDataInfoIndex].push(settingItem)
  //   if (refList[secheduleDataInfoIndex].length === secheduleDataInfo.datas[secheduleDataInfoIndex].stageSeriesList.length) {
  //     secheduleDataInfoIndex++
  //   }
  // })

  const refList = createDatasForContainer(secheduleDataInfo.datas, secheduleSettingRef.value, 'stageSeriesList', true)

  // 遍历列表分别执行表单校验
  for (let i = 0, j = refList.length; i < j; i++) {
    for (let x = 0, y = refList[i].length; x < y; x++) {
      const target = refList[i]
      console.log(target[x].validateForm())
      const validateRes = await target[x].validateForm()
      if (!validateRes) {
        secheduleErrorTip(`阶段${i + 1} 内容填有误`)
        return false
      }
    }
  }
  return true
}
</script>
<script>
export default {
  name: 'TrainingCampScheduleSet'
}
</script>
<style lang='scss' scoped>
.icon-add-style {
  border-right: unset;
}

.add-button {
  width: 550px;
  height: 35px;
  color: $themeColor !important;
  border: 1px dashed #dcdfe6;
  margin: 20px 0;

  .icons__add {
    height: auto;
    border-right: unset;
  }
}

.sechedule-info-wrapper {
  padding-top: 0;
}

.setting-items {
  .label {
    width: 100px;
    text-align: right;
    padding-right: 12px;
  }

  .content {
    flex: 1;
    display: flex;
  }
  .setting-info {
    flex: 1;
  }
  .control-wrapper {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    position: relative;
  }
}

.schedule-tabs {
  $base-height: 40px;
  :deep(.el-tabs__header) {
    height: $base-height;
  }
  :deep(.el-tabs__item) {
    height: $base-height !important;
    line-height: $base-height !important;
  }
  :deep(.el-tabs__new-tab) {
    margin: 10px;
  }
}

.data-info-wrapper {
  width: 670px;
  margin: 0 auto;
}

.drop-icon {
  display: inline-block;
  margin-right: 5px;
  cursor: pointer;
}
</style>