<template>
  <el-cascader
    clearable
    :options="projectCategoryOptions"
    :props="cascaderProps"
    collapse-tags
    @change="projectCategoryChange"
    v-model="cascaderData"
    ref="multipleCascaderRef"
    :style="`width:${width}`"
  ></el-cascader>
</template>
<script setup>
import { ref, watch } from 'vue'
import { fetchListClassType } from '@/fetch/statementCentre'
import { fetchListClassProjectType } from '@/fetch/establish'
import { useEstablish } from '@/views/Establish/EstablishManagement/hooks/useEstablish'
import { CopyObj } from '@/plugins/until'
import { 
  PLAN_TRAINING_COURSE_TYPE, PLAN_NOT_TRAINING_COURSE_TYPE, 
  TRAINING_COURSE_TYPE, NOT_TRAINING_COURSE_TYPE 
} from '@/util/constants'

const { handleProjectCategoryOptions } = useEstablish()

const props = defineProps({
  value: {
    type: [],
    required: true
  },
  classType: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'project' // project, plan
  },
  width: {
    type: String,
    default: '350px'
  }
})

// 处理计划分类选项
const handlePlanCategoryOptions = (data) => {
  const codeMapping = {
    [TRAINING_COURSE_TYPE]: PLAN_TRAINING_COURSE_TYPE,
    [NOT_TRAINING_COURSE_TYPE]: PLAN_NOT_TRAINING_COURSE_TYPE 
  }
  data.forEach(m => {
    if (m.dataEncode && codeMapping[m.dataEncode]) {
      m.dataEncode = codeMapping[m.dataEncode]
      m.dataValue = m.dataValue.replace('项目','计划')
    }
  })
  return data 
}

const emit = defineEmits('input')
const cascaderData = ref([])
const formatParams = (params) => {
  return params.reduce((preValue, curValue) => {
    const data = {
      classTypeOne: curValue[0] || '',
      classTypeTwo: curValue[1] || ''
    }
    preValue.push(data)
    return preValue
  }, [])
}

watch(cascaderData, () => {
  emit('input', formatParams(cascaderData.value))
})

const reset = () => {
  cascaderData.value = []
}
defineExpose({ reset })

const cascaderProps = { value: 'dataEncode', label: 'dataValue', multiple: true }

const projectCategoryOptions = ref([])
fetchListClassProjectType({classType: props.classType}).then((classDatas) => {
  const resOptions = handleProjectCategoryOptions(classDatas)
  projectCategoryOptions.value = props.type === 'plan' ? handlePlanCategoryOptions(resOptions) : resOptions 
})

const multipleCascaderRef = ref(null)
// 项目分类change事件
const projectCategoryChange = () => {}
</script>
