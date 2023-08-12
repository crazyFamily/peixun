<template>
  <div>
    <gc-model
      title="编辑H5分享页面"
      width="850px"
      top="5vh"
      :visible="isShow"
      :show-close="false"
      :auto-height="true"
      @comfirm="save"
      @cancel="cancel"
    >
      <div class="h5-wrapper">
        <el-scrollbar style="height: 100%">
          <el-form ref="packH5FormRulesRef" :rules="packH5FormRules" :model="packH5Form" label-width="100px" @submit.native.prevent class="pack-h5">
            <el-form-item label="是否分享" prop="h5PageOpen">
              <el-radio-group v-model="packH5Form.h5PageOpen">
                <el-radio label="Y">开</el-radio>
                <el-radio label="N">关</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="背景选择" prop="backgroundImage">
              <gc-select
                style="padding: 0"
                :options="backgroundOptions"
                v-model="packH5Form.backgroundImage"
                :clearable="false"
                @change="backgroundStyleChangeHandle"
              ></gc-select>
            </el-form-item>
            <el-form-item label="页面标题" prop="mainTitle">
              <el-input v-model="packH5Form.mainTitle" clearable placeholder="输入主标题,可输入10个字" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="subTitle">
              <el-input v-model="packH5Form.subTitle" clearable placeholder="输入副标题,可输入30个字" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="封面替换" prop="backgroundUdmp">
              <div>
                <gc-upload single :size="3072" :udmpId.sync="packH5Form.backgroundUdmp" @input="topicImgUpdate"></gc-upload>
                <div class="tintColor">
                  <p>1.图片尺寸为（375*375px），可按比例调整尺寸</p>
                  <p>2.格式为jpg或png，图片小于3M</p>
                </div>
              </div>
            </el-form-item>
            <h3 class="pack-h5-title">特点描述:</h3>
            <el-form-item label="第一点" prop="mainFeatureOne">
              <el-input v-model="packH5Form.mainFeatureOne" clearable placeholder="输入标题,可输入16个字" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="" prop="subFeatureOne">
              <el-input v-model="packH5Form.subFeatureOne" clearable placeholder="输入标题,可输入20个字" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="第二点" prop="mainFeatureTwo">
              <el-input v-model="packH5Form.mainFeatureTwo" clearable placeholder="输入标题,可输入16个字" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="" prop="subFeatureTwo">
              <el-input v-model="packH5Form.subFeatureTwo" clearable placeholder="输入标题,可输入20个字" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="第三点" prop="mainFeatureThree">
              <el-input v-model="packH5Form.mainFeatureThree" clearable placeholder="输入标题,可输入16个字" maxlength="16"></el-input>
            </el-form-item>
            <el-form-item label="" prop="subFeatureThree">
              <el-input v-model="packH5Form.subFeatureThree" clearable placeholder="输入标题,可输入20个字" maxlength="20"></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div class="style-preview-wrapper">
          <!-- <p class="title">背景预览 <span class="sec-title">注：图中数据仅为模拟数据，真实数据以设置为准</span></p> -->
          <div class="preview-container">
            <el-scrollbar style="height: 100%">
              <!-- 第一个颜色是旧有风格，暂不做适配，仅显示个图片 -->
              <template v-if="packH5Form.backgroundImage === 'blue'">
                <img src="@/assets/images/courseRecommendation-h5-style1.png" alt="" />
              </template>
              <template v-else>
                <H5Preview
                  :type="type"
                  :card-title-bg="cardStyleInfo.titleBg"
                  :template-color="cardStyleInfo.templateBackground"
                  :header-text-color="cardStyleInfo.headerTextColor"
                  :main-title="packH5Form.mainTitle"
                  :sub-title="packH5Form.subTitle"
                  :topic-img="previewTopicImg"
                  :content-info="renderDataInfo"
                ></H5Preview>
              </template>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </gc-model>
  </div>
</template>

<script setup>
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents'
import { CopyObj } from '@/util/utils'
import { computed, reactive, ref, watch } from 'vue'
import H5Preview from './H5Preview.vue'
import { handleUdmpHref } from '@/util/utils'
import { H5_TEMPLATE_STYLE } from '@/views/CourseRecommendation/enum.js'
import { Message } from 'element-ui'
const { mergeReactive } = useBaseDataEvents()

/**
 * interface featureInfo {
 *  mainFeature: string, 特色主标题
 *  subFeature: string 特色副标题
 * }
 *
 * interface Course {
 *  courseId: Number,
 *  courseName: String,
 *  titleIndex: String,
 *  [propName: String]: unknown
 * }
 *
 * interface Subject {
 *  subjectId: Number,
 *  subjectName: String,
 *  titleIndex: String,
 *  children: Subject[],
 *  courseList: Course[],
 *  [propName: String]: unknown
 * }
 *
 * interface dataInfo {
 *  featureInfo: featureInfo[], 课程特色
 *  introduce: String 课程简介,
 *  isSubject: 'Y' | 'N',
 *  subjectList: Subject[]
 * }
 */

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  dataInfo: Object
})

const renderDataInfo = computed(() => {
  const featureInfo = []
  // if (packH5Form.mainFeatureOne)
    featureInfo.push({
      mainFeature: packH5Form.mainFeatureOne,
      subFeature: packH5Form.subFeatureOne
    })
  // if (packH5Form.mainFeatureTwo)
    featureInfo.push({
      mainFeature: packH5Form.mainFeatureTwo,
      subFeature: packH5Form.subFeatureTwo
    })
  // if (packH5Form.mainFeatureThree)
    featureInfo.push({
      mainFeature: packH5Form.mainFeatureThree,
      subFeature: packH5Form.subFeatureThree
    })
  console.log(props.dataInfo, '====>>>> datainfo')

  if (props.type === 'courseBag') {
    // 处理有主题课程包
    let subjectNum = 0
    let courseNum = 0
    let dataInfo = []
    let isSubject
    if (props.dataInfo.subjectList && props.dataInfo.subjectList.length) {
      subjectNum = props.dataInfo.subjectList.length
      dataInfo = props.dataInfo.subjectList
    }

    // 处理无主题课程包
    if (!props.dataInfo.subjectList) {
      dataInfo = props.dataInfo.courseList
    }
    isSubject = props.dataInfo.isSubject === 'Y'
    courseNum = props.dataInfo.courseNum

    console.log(featureInfo, '===>>>')

    return {
      featureInfo,
      introduce: props.dataInfo.introduce,
      subjectNum,
      courseNum,
      isSubject,
      dataInfo
    }
  }

  if (props.type === 'training') {
    let dataInfo = {}
    dataInfo = props.dataInfo
    console.log(props.dataInfo, '====>>> props.dataInfo')
    return {
      featureInfo,
      introduce: props.dataInfo.introduce,
      dataInfo
    }
  }
})

const isShow = ref(false)
watch(
  () => props.show,
  (n) => {
    isShow.value = n
    if(!n) return
    mergeReactive({ origin: packH5Form, target: props.dataInfo })
  },
  { immediate: true }
)

const orginFormData = {
  backgroundImage: 'skyBlue',
  mainTitle: '',
  subTitle: '',
  backgroundUdmp: '',
  mainFeatureOne: '',
  subFeatureOne: '',
  mainFeatureTwo: '',
  subFeatureTwo: '',
  mainFeatureThree: '',
  subFeatureThree: '',
  h5PageOpen: 'Y'
}

const packH5Form = reactive(CopyObj(orginFormData))
const packH5FormRules = {
  h5PageOpen: [{ required: true, message: '请选择是否分享' }],
  mainTitle: [{ required: true, message: '请填写主标题' }],
  subTitle: [{ required: true, message: '请填写副标题' }]
}
const backgroundOptions = ref([])
if (props.type === 'courseBag') {
  backgroundOptions.value = H5_TEMPLATE_STYLE
}
if (props.type === 'training') {
  backgroundOptions.value = H5_TEMPLATE_STYLE.filter((row) => row.value !== 'blue')
}

const updateId = ref(0)

const topicImgUpdate = () => {}

const backgroundStyleChangeHandle = (value) => {
  updateId.value++
}

// 如果没有背景图，就显示默认的背景图
const topicUpdate = ref(0)

const cardStyleInfo = computed(() => {
  updateId.value++
  return backgroundOptions.value.find((item) => item.value === packH5Form.backgroundImage) || {}
})

const previewTopicImg = computed(() => {
  topicUpdate.value++
  if (packH5Form.backgroundUdmp) return handleUdmpHref(packH5Form.backgroundUdmp)
  return cardStyleInfo.value.defaultTopicBg
})

const emit = defineEmits(['save', 'cancel', 'update:show'])
const packH5FormRulesRef = ref(null)
const save = () => {
  packH5FormRulesRef.value.validate((valied) => {
    if (!valied) {
      Message.warning('请补充必填信息')
      return
    }
    const resultData = {
      relationId: packH5Form.id,
      // 课程包传project，训练营传training
      busType: props.type === 'courseBag' ? 'project' : 'training',
      // 是否开启H5页面：Y是，N否
      h5PageOpen: packH5Form.h5PageOpen,
      // 页面主标题
      mainTitle: packH5Form.mainTitle,
      // 页面副标题
      subTitle: packH5Form.subTitle,
      // 特点1主标题
      mainFeatureOne: packH5Form.mainFeatureOne,
      // 特点1副标题
      subFeatureOne: packH5Form.subFeatureOne,
      // 特点2主标题
      mainFeatureTwo: packH5Form.mainFeatureTwo,
      // 特点2副标题
      subFeatureTwo: packH5Form.subFeatureTwo,
      // 特点3主标题
      mainFeatureThree: packH5Form.mainFeatureThree,
      // 特点3副标题
      subFeatureThree: packH5Form.subFeatureThree,
      // 背景风格
      backgroundImage: packH5Form.backgroundImage,
      // 背景图udmp
      backgroundUdmp: packH5Form.backgroundUdmp
    }
    emit('save', resultData)
    close()
  })
}
const cancel = () => {
  emit('cancel')
  close()
}
const close = () => {
  // 数据重置
  mergeReactive({ origin: packH5Form, target: orginFormData })
  emit('update:show', false)
}
</script>
<style lang='scss' scoped>
.pack-h5 {
  // padding-right: 30px;
  width: 410px;
  height: 100%;
  position: relative;

  &::after {
    content: '';
    width: 1px;
    height: 100%;
    background-color: $line-color;
    display: block;
    position: absolute;
    right: -20px;
    top: 0;
  }
}
.pack-h5-url span {
  display: inline-block;
}
.pack-h5-title,
.pack-h5-url span {
  width: 100px;
  font-weight: bolder;
  text-align: right;
  margin-bottom: 10px;
}

$wrapper-height: 550px;
.h5-wrapper {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto 360px;
  height: $wrapper-height;
}
.style-preview-wrapper {
  height: $wrapper-height;
  padding-left: 10px;
  .title {
    margin-bottom: 10px;
  }
  .sec-title {
    font-size: 12px;
    opacity: 0.4;
    margin-left: 5px;
    font-family: initial;
  }
  .preview-container {
    width: 350px;
    height: 100%;
    border-radius: 10px;
    background-color: #ddd;
    overflow: hidden;
  }
}
</style>
