<template>
  <div class="setting-box">
    <div class="setting-container">
      <div class="left-container">
				<el-tabs v-model="activeTab" class="tabPage">
					<el-tab-pane name="type" label="题型选择" :disabled="fixedTemplateUsing">
						<ul class="question-type-list">
							<li v-for="(type,i) in QUESTION_TYPES" :key="i" 
								@click="addQuestion(type, i)">
								<div class="question-type-item">
									<span class="icon">
										<img :src="typeIcons[i].iconSrc" />
									</span>
									<span class="text">{{type.label}}</span>
								</div>
							</li>
						</ul>
					</el-tab-pane>
					<el-tab-pane name="template" label="问卷模板">
						<div class="question-template-list">
							<el-form class="btn-list" :disabled="!canUserBtn">
								<el-button class="button-50-30" v-if="fixedTemplateUsing" @click="switchTemplateType(selectTemplateIndex)">重置</el-button>
								<el-button class="button-50-30" v-else @click="useTemplate(selectTemplateIndex)">使用</el-button>
								<el-button class="button-50-30" @click="previewTemplate(selectTemplateIndex)">预览</el-button>
								<el-button class="button-50-30" @click="renameVisible = true" :disabled="!canUserBtn || isFixedTemplate">命名</el-button>
								<el-button class="button-50-30" @click="deleteTemplate(selectTemplateIndex)" :disabled="!canUserBtn || isFixedTemplate">删除</el-button>
							</el-form>
							<ul>
								<li v-for="(temp,i) in questionTemplates" :key="i" @click="clickQuestionTemplate(i, temp)">
									<el-tooltip class="item" effect="light" :disabled="temp.templateName.length < 16" :content="temp.templateName" placement="right">
										<div slot="content" style="width:230px;">
											{{temp.templateName}}
										</div>
										<div class="question-template-item text-ellipsis" 
											:class="{
												active: selectTemplateIndex === i, 
												fixedTemplate: temp.templateType === TEMPLATE_TYPE_FIXED,
												disabledTemplate: temp.templateType === TEMPLATE_TYPE_CUSTOM && fixedTemplateUsing
											}">
												<span class="icon">
													<img src="@/assets/svg/template-icon.svg" class="mt-15"/>
												</span>
												<span>{{temp.templateName}}</span>
                        <el-popover v-if="temp.templateType === TEMPLATE_TYPE_FIXED" popper-class="mr20">
                          <div class="p10">此模板为系统固定模板，使用后问卷不再支持编辑，只能使用此模板的固定题目</div>
                          <i slot="reference" class="el-icon-question active ml10"></i>
                        </el-popover>
										</div>
									 </el-tooltip>
								</li>
							</ul>
						</div>
					</el-tab-pane>
      	</el-tabs>
      </div>
			<!-- 右边-题目区 -->
      <div class="right-container" ref="rightContainerRef">
				<div class="questionnaire-container">
          <div v-show="postData.templateType === TEMPLATE_TYPE_FIXED" class="tips mb10">当前选中为固定模板，不可编辑，题目多少与勾选的课程相关</div>
					<div class="questionnaire-header">
						<h3>
							<el-input 
								placeholder="标题"
								class="inputTitle" 
								v-model="postData.templateName" 
								show-word-limit 
								maxlength="50" 
								/>
						</h3>
						<p>
							<el-input 
								rows="3" 
								type="textarea" 
								class="inputDesc" 
								placeholder="添加问卷说明"
								show-word-limit 
								v-model="postData.templateDescribe" 
								maxlength="200" />
							<!-- {{templateDesc || '添加问卷说明'}} <el-button type="text" @click="openQuestionHeader">【 编辑 】</el-button> -->
						</p>
					</div>
					<div class="questionnaire-body">
						<question-list ref="questionListRef" 
							:customFirstIndex="customFirstIndex" 
							:data="questions" />
					</div>
				</div>
			</div>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="returnTrainingCourse()">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="confirmQuestion">确认</el-button>
      <el-button class="button-w80-h30" @click="previewQuestion()">预览</el-button>
      <el-button class="button-w80-h30" type="success" @click="saveTemplate" v-if="!fixedTemplateUsing">保存为模板</el-button>
    </div>
		<question-list-view
			:isOpen="isOpenPreview"
			:isAnonymous="postData.isAnonymous"
			:title="templateName"
			:desc="templateDescribe"
			:data="questionsView"
			@close="isOpenPreview = false"  />
		<gc-model
      title="模板重命名"
			width="650px"
      :visible="renameVisible"
      @close="renameVisible = false"
      @cancel="renameVisible = false"
      @comfirm="renameConfirm">	
			<el-form :model="selectTemplate" :rules="templateNameRules" ref="renameFormRef" inline>
				<el-form-item label="模板名称" prop="templateName">
					<el-input v-model="selectTemplate.templateName" class="w-494" maxlength="50" show-word-limit />
				</el-form-item>
			</el-form>
		</gc-model>
  </div>
</template>
<script>
export default {
	name: 'CustomQuestinnaire'
}
</script>
<script setup>
import { ref, reactive, onActivated, set, computed, onMounted } from 'vue'
import router from '@/router'
import { Message } from 'element-ui'
import gcEditor from '@/components/editor'
import QuestionList from "./components/QuestionList";
import QuestionListView from "./components/QuestionListView";
import {formatDate, addAllowKeepAlive, CopyObj, customHint } from '@/util/utils';
import { 
	fetchSaveCustomClassEva, 
	fetchListClassEvaPrivacyTemplate,
	fetchRenameClassEvaTemplate,
	fetchDeleteClassEvaTemplate,
	fetchPrivacyTemplateDetail
} from "@/fetch/establish";
import { QUESTION_TYPES, TEMPLATE_TYPE_CUSTOM, TEMPLATE_TYPE_FIXED } from "@/util/constants";

// 页面状态
const activeTab = ref('type')
const questions = ref([])
// 题目备份，当使用“学员旅程固定模板”时，使用此变量备份当前题目列表
const questionsBak = reactive({
	templateName: '',
	templateDescribe: '',
	list: []
}) 
const templateName = ref('')
const templateDescribe = ref('')
const questionsView = ref([])
const classId = ref('')
// ============ 左边-选题型区 ============
// 自定义问卷类型
const typeIcons = {
  // '2': { label: '主观题', value: 'input', iconClass: 'el-icon-notebook-2' },
  '2': { iconSrc: require('@/assets/svg/wj-input.svg') },
  '3': { iconSrc: require('@/assets/svg/wj-radio.svg') },
  '4': { iconSrc: require('@/assets/svg/wj-checkbox.svg') },
  '1': { iconSrc: require('@/assets/svg/wj-start.svg') }
}
// 添加题目
const questionListRef = ref(null)
function addQuestion(typeItem, code) {
	questionListRef.value?.addQuestion({...typeItem, code})
}

// ============ 左边-模板区 ============
// 新增题型类型
const currQuestionTemplate = ref('')
const fixedTemplate = {
	isFixed: true,
	templateId: 1,
	templateName: '学员旅程视角模板',
	questions: []
}
// 选题列表信息
const questionTemplates = ref([])
const selectTemplate = ref({})
const selectTemplateIndex = ref(-1)
// 是否可以使用操作按钮
const canUserBtn = computed(() => selectTemplateIndex.value > -1)
// 是否是固定模板
// (templateType) 模板类型：3:自定义模版，4:学员旅程固定模板
const isFixedTemplate = computed(() => selectTemplate.value?.templateType === TEMPLATE_TYPE_FIXED)
// 学员旅程固定模板 是否 正在使用中
const fixedTemplateUsing = ref(false)
// 获取模板列表数据
async function getQuestionTemplateList () {
	const params = { data: { classId: classId.value } }
	const res = await fetchListClassEvaPrivacyTemplate(params)
	questionTemplates.value = res
	if (fixedTemplateUsing.value) {
		selectTemplateIndex.value = 0
		selectTemplate.value = questionTemplates.value[selectTemplateIndex.value]
	}
}
// 选择当前题型
function clickQuestionTemplate(key, item) {
	if (item.templateType === TEMPLATE_TYPE_CUSTOM && fixedTemplateUsing.value) return 
	selectTemplateIndex.value = key
	selectTemplate.value = CopyObj(item)
}
function getTemplateDetail () {
	const params = {data: {
		classId: classId.value,
		templateId: selectTemplate.value.templateId
	}}
	// 若为固定模板
	if (isFixedTemplate.value) {
		params.data.courses = postData.value.courses
		params.data.isEvaOrg = postData.value.isEvaOrg // 'Y' // 是否勾选培训组织 Y/N
		params.data.isEvaAll = postData.value.isEvaAll // 'Y' // 是否勾选培训整体 Y/N
		// params.data.isEvaOrg = 'Y'
		// params.data.isEvaAll = 'Y' 
	}
	return fetchPrivacyTemplateDetail(params)
}
function switchTemplateType () {
	set(postData.value, 'templateName', questionsBak.templateName)
	set(postData.value, 'templateDescribe', questionsBak.templateDescribe)
	set(postData.value, 'templateType', TEMPLATE_TYPE_CUSTOM)
	if (questionsBak.list?.length) {
		questions.value = questionsBak.list
	} else {
		questions.value = postData.value.questionsCustom	
	}
	fixedTemplateUsing.value = false
	selectTemplateIndex.value = -1
	selectTemplate.value = {}
}
async function useTemplate () {
	const resData = await getTemplateDetail()
	if (isFixedTemplate.value) { // 学员旅程视角评估模板
		// 备份
		questionsBak.templateName = postData.value.templateName
		questionsBak.templateDescribe = postData.value.templateDescribe
		questionsBak.list = CopyObj(questionListRef.value?.getData())
		// 设置新数据
		set(postData.value, 'templateName', resData.templateName)
		set(postData.value, 'templateDescribe', resData.templateDescribe)
		set(postData.value, 'templateType', TEMPLATE_TYPE_FIXED)
		questions.value = resData.routeTopics.map(m => ({...m, isFixed: true}))
		// 学员旅程固定模板 正在使用中
		fixedTemplateUsing.value = true
	} else { // 自定义模板
		let questionsList = []
		if (fixedTemplateUsing.value) { // 从“学员旅程视角评估模板”切换加“自定义模板”
			set(postData.value, 'templateName', questionsBak.templateName)
			set(postData.value, 'templateDescribe', questionsBak.templateDescribe)
			set(postData.value, 'templateType', TEMPLATE_TYPE_CUSTOM)
			questionsList = questionsBak.list
			questionsList.push(...resData.customTopics)
			questions.value = questionsList	
			fixedTemplateUsing.value = false
		} else {
			if (!postData.value.templateName) {
				set(postData.value, 'templateName', questionsBak.templateName || resData.templateName)
			}
			if (!postData.value.templateDescribe) {
				set(postData.value, 'templateDescribe', questionsBak.templateDescribe || resData.templateDescribe)
			}
			questionsList = questionListRef.value?.getData()
			questionsList.push(...resData.customTopics)
			questions.value = questionsList	
		}
	}
}
async function previewTemplate () {
	const resData = await getTemplateDetail()
	const previewData = {
		list: isFixedTemplate.value ? resData.routeTopics : resData.customTopics ,
		templateName: resData.templateName,
		templateDescribe: resData.templateDescribe,
	}
	previewQuestion(previewData)
}
// 重命名 / 保存重命名
const renameVisible = ref(false)
const templateNameForm = reactive({ templateName: '' })
const templateNameRules = { templateName: [ 
	{ required: true, message: '请输入模板名称', trigger: 'blur' },
	{ validator: (rule, value, callback) => {
		const templateArr = questionTemplates.value.filter(m => m.templateId !== selectTemplate.value.templateId)
		if (templateArr?.map(m => m.templateName)?.includes(value)) {
			callback(new Error('模板名称已存在，请重新输入！'))
		} else {
			callback()
		}
	}, trigger: 'blur'  }
] }
const renameFormRef = ref(null)
// 重命名【确认】保存
function renameConfirm () {
	renameFormRef.value.validate(async (valid) => {
		if (!valid) return
		const params = { templateId: selectTemplate.value.templateId, templateName: selectTemplate.value.templateName }
		await fetchRenameClassEvaTemplate(params)
		set(questionTemplates.value[selectTemplateIndex.value], 'templateName', selectTemplate.value.templateName)
		Message.success('重名称成功！')
		renameVisible.value = false
	})
}

function deleteTemplate () {
	customHint('确认要删除此模板吗？', '提示', '取消')
	.then(async () => {
		const params = { templateId: selectTemplate.value.templateId }
		await fetchDeleteClassEvaTemplate(params)
		questionTemplates.value.splice(selectTemplateIndex.value, 1)
		selectTemplateIndex.value = -1
		selectTemplate.value = {}
	})	
}

// ======================== 底部按钮 ========================
// 【返回】 培训评估页
function returnTrainingCourse (params) {
	params = params || { opraType: 'return' }
	addAllowKeepAlive('/TrainingCourseSeeEdit')
	router.push({ name: '培训班编辑', params: { fromPage: 'CustomQuestionnaire', ...params } })
}
// 保存题目
function saveQuestion (otherData) {
	if (questionListRef.value?.hasEditRow()) {
		return Message.warning('有正在编辑的记录，请先完成编辑')
	}
	// 自定义问题
	const customTopics = questionListRef.value?.getData('submit')
	if (!customTopics.length) {
		return Message.warning('必须至少添加一道题目')
	}
	if (!postData.value.templateName) {
		return Message.warning('请填写标题')
	}
	if (!postData.value.templateDescribe) {
		return Message.warning('请填写说明')
	}
	postData.value.customTopics = customTopics
	postData.value = { ...postData.value, ...otherData }
	Reflect.deleteProperty(postData.value, 'questions')
	Reflect.deleteProperty(postData.value, 'fixedLength')
	console.log(postData.value)
	// 提交数据到接口
	return fetchSaveCustomClassEva({data: postData.value})
}
// 【确认】
function confirmQuestion () {
	if (![TEMPLATE_TYPE_CUSTOM, TEMPLATE_TYPE_FIXED].includes(postData.value.templateType)) {
		return Message.warning('模板类型不能为空')
	}
	if (postData.value.templateType === TEMPLATE_TYPE_CUSTOM) {
		if (questionListRef.value?.hasEditRow()) {
			return Message.warning('有正在编辑的记录，请先完成编辑')
		}
		// 自定义问题
		const customTopics = questionListRef.value?.getData('submit')
		if (!customTopics.length) {
			return Message.warning('必须至少添加一道题目')
		}
		if (!postData.value.templateName) {
			return Message.warning('请填写标题')
		}
		if (!postData.value.templateDescribe) {
			return Message.warning('请填写说明')
		}
		postData.value.customTopics = customTopics
	} else {
		postData.value.customTopics = []
	}
	postData.value.isTemplate = 'N'
	Reflect.deleteProperty(postData.value, 'questions')
	Reflect.deleteProperty(postData.value, 'fixedLength')
	console.log(postData.value)
	// 提交数据到接口
	fetchSaveCustomClassEva({data: postData.value})
	.then(resData => {
		if (resData) {
			Message.success('保存成功')
			resData.opraType = 'confirm',
			returnTrainingCourse(resData)
		}
	})
}
// 【预览】
const isOpenPreview = ref(false)
function previewQuestion (data) {
	questionsView.value = data?.list || questionListRef.value?.getData()
	templateName.value =  data?.templateName || postData.value.templateName
	templateDescribe.value = data?.templateDescribe || postData.value.templateDescribe
	isOpenPreview.value = true
}
// 【保存模板】
function saveTemplate () {
	saveQuestion({isTemplate: 'Y', templateType: TEMPLATE_TYPE_CUSTOM })
	.then(resData => {
		customHint('已将当前题目保存为问卷模板', '提示', '', false, '我知道了')
		getQuestionTemplateList()
		// questions.value = []
	})
}
// =========================== 初始化数据 ===========================
const postData = ref({})
const customFirstIndex = ref(null)
onMounted(() => {
	if (!questionTemplates.value.length) {
		getQuestionTemplateList()
	}
})
onActivated(() => {
	// 路由参数
	const params = router?.app?.$route?.params
	console.log('onActivated:router-params', params)
	// 有路由参数(表示从通过点击按钮进入页面的)，则重置数据
	if (Object.keys(params).length) {
		postData.value = CopyObj(params)
		// 当 模板类型 = 4:学员旅程固定模板,则打开“模板”Tab
		if (params.templateType === TEMPLATE_TYPE_FIXED) {
			fixedTemplateUsing.value = true
			activeTab.value = 'template'
		} else {
			fixedTemplateUsing.value = false
			activeTab.value = 'type'
			selectTemplateIndex.value = -1
			selectTemplate.value = {}
		}
		// 班级Id
		classId.value = params.classId || ''
		// 自定义题目第一题索引
		customFirstIndex.value = params.fixedLength
		// 题目列表
		questions.value = params.questions
		getQuestionTemplateList()
	} else {
		// 没有路由参数(表示从通过点击“Tab”进入页面的)
	}
})

</script>
<style lang='scss' scoped>
.text-ellipsis {
  overflow: hidden; // 超出部分隐藏
  text-overflow: ellipsis; // /* 超出部分显示省略号 */
  white-space: nowrap;/*规定段落中的文本不进行换行 */
  // width: 250px;/*需要配合宽度来使用*/
  // border: 1px solid red;
  // font-size: 30px;
}
:deep(.el-tabs__item.is-disabled){
	opacity: 0.3;
	cursor:not-allowed;
}
.setting-box {
  width: 100%;
  min-height: calc(100% - 70px);
}

.setting-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  min-height: calc(100vh - 160px);
  .left-container {
    width: 280px;
		margin-right: 10px;
		margin-bottom: 10px;
		background: #fff;
		p.title {
			font-size: 16px;
			text-align: center;
			margin-top: 20px;
			margin-bottom: 10px;
			color: #555;
		}
    ul.question-type-list {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			font-size: 14px;
			padding: 5px 20px;
			li {
				text-align: center;
				width: 100%;
				border: 1px solid #EAECF1;
				margin-bottom: 20px;
				&:hover {
					border: 1px solid #FD6720;
					.question-type-item {
						color: #FD6720;
					}
				}
				.question-type-item {
					cursor: pointer;
					display: inline-block;
					color: #666;
					padding: 4px 20px;
					margin: 5px 0;
					border-radius: 10px;
					span.icon {
						img {
							margin-top: -3px;
							margin-right: 5px;
						}
					}

				}
			}
    }
		.question-template-list {
			padding: 0 21px;
			overflow: auto;
    	height: calc(100vh - 235px);
			.btn-list {
				display: flex;
				justify-content: space-between;
				margin-bottom: 14px;
				button {
					margin-left: 0px !important;
				}
				:deep(.el-button.is-disabled) {
					background: #EFF2F7;
					&:hover {
						background: #EFF2F7 !important;
					}
				}
			}
      ul {
        width: 100%;
        font-size: 12px;
        li {
					margin-bottom: 14px;
          .question-template-item {
						border-radius: 2px;
						box-shadow: 1px 1px 8px #dfdfdf;
						line-height: 44px;
            cursor: pointer;
						color: #444;
						border: 1px solid #fff;
						padding-right: 5px;
            span.icon {
							display: inline-block;
							vertical-align: middle;
							margin-right: 5px;
							margin-left: 10px;
							background: #f5f5f5;
							width: 28px;
							height: 28px;
							border-radius: 14px;
						}
						&.active {
							border: 1px solid #FD6720 !important;
						}
						&.fixedTemplate {
							background: #ddd;
							box-shadow: unset;
							border: 1px solid #ddd; 
						}
						&.disabledTemplate {
							opacity: 0.3;
							cursor: not-allowed;
						}
          }
					.question-template-btns {
						display: none;
						padding: 5px;
						border-bottom: 1px solid #ddd;
					}
					
        }
      }
    }
		:deep(.el-tabs__nav) {
			margin-left: 45px;
			.el-tabs__item {
				color: #7D8292;
			}
		}
  }
  .right-container {
    flex: 1;
		padding: 20px;
		overflow: auto;
		height: calc(100vh - 170px);
    margin-bottom: 10px;
  	background: #fff;
		.questionnaire-container {
      .tips {
        background-color: #feaa63;
        text-align: center;
        line-height: 18px;
        color:#0000008c;
      }
			.questionnaire-header {
				.inputTitle {
					:deep(input) {
						height: 60px;
						font-size: 20px;
						color: #000000;
						text-align: center;
						font-weight: 500;
						margin-bottom: 10px;
					}
				}
				.inputDesc {
					:deep(input) {
						font-size: 14px;
						color: #000000;
						font-weight: 400;
						margin-bottom: 10px;
						line-height: 25px;
					}
				}
			}
		}
  }
}
</style>
