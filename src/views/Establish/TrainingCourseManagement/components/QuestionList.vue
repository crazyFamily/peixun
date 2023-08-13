<template>
  <div class="question-container">
			<div class="question-item" :class="{'fixed-div': ques.isFixed }" v-for="(ques,i) in questions" :key="i" >
				<div class="question-view" :class="{'drag-view': !ques.isFixed, 'edit-view': ques.isEdit}">
					<div class="uneditable" v-if="ques.isFixed">
						<img src="@/assets/svg/uneditable.svg" alt="" />
					</div>
					<div class="question-content">
						<div class="question-title">
							<span v-show="ques.isRequired" class="must-start">*</span>
							<span>{{i+1}}</span>
							<span class="fenge">.</span>
							<span>{{ques.content}}</span>
							<span class="type">【{{getQuesType(ques, 'label')}}】</span>
						</div>
						<div class="question-select-container" :class="[getQuesType(ques)]">
							<!-- 填空题 -->
							<template v-if="ques.answerType === QUESTION_TYPES_INPUT">
								<div class="input-div"></div>
							</template>
							<!-- 评分题 -->
							<template v-else-if="ques.answerType === QUESTION_TYPES_START">
								<div class="question-select-item start-item" v-for="(item, ii) in 10" :key="ii">
									<span>{{ii+1}}</span>
								</div>
							</template>
							<!-- 单选题 / 多选题 -->
							<ul v-else class="question-select-item">
								<li v-for="(item, ii) in ques.options" :key="ii">
									<span>
										<span class="icon-check" :class="[`icon-${getQuesType(ques)}`]"></span>
									</span>
									<span>{{item.optionContent}}</span>
								</li>
							</ul>
						</div>
					</div>
					<div class="question-btns" v-if="!ques.isFixed">
						<el-button @click="editQuestion(i)">编辑</el-button>
						<el-button @click="copyQuestion(ques, i)">复制</el-button>
						<el-button @click="deleteQuestion(ques, i)">删除</el-button>
						<el-button @click="moveQuestion(i, 'up')" :disabled="i === customFirstIndex">上移</el-button>
						<el-button @click="moveQuestion(i, 'down')" :disabled="i === questions.length - 1">下移</el-button>
						<el-button @click="moveQuestion(i, 'first')" :disabled="i === customFirstIndex">最前</el-button>
						<el-button @click="moveQuestion(i, 'last')" :disabled="i === questions.length - 1">最后</el-button>
					</div>
				</div>

				<div class="question-edit" ref="questionEditRef" v-if="ques.isEdit && !ques.isFixed">
					<el-form ref="editQuestionFormRef" :model="questionCurr" :rules="ruleQuestion" label-width="0px" >
						<div class="form-container">
							<div class="form-left">
								<el-form-item prop="type">
									<gc-select style="padding: 0;"
										class="w-120"
										placeholder="请输入题目类型"
										:clearable="false"
										:options="typeOptions"
										@change="questionTypeChange($event, i)"
										v-model="questionCurr.answerType"/>
								</el-form-item>
								<el-form-item prop="type">
									<el-checkbox v-model="questionCurr.isRequired">
										必填
									</el-checkbox>
								</el-form-item>
							</div>
							<div class="form-right">
								<el-form-item prop="content">
									<el-input 
										v-model="questionCurr.content" 
										placeholder="请输入标题"
										maxlength="50" 
										show-word-limit
										@blur="setDefault('ques')"/>
								</el-form-item> 
								<template v-if="[QUESTION_TYPES_RADIO, QUESTION_TYPES_CHECKBOX].includes(questionCurr.answerType)">
									<el-form-item 
										v-for="(item,iSelect) in questionCurr.options" :key="iSelect"
											:prop="`options.${iSelect}.optionContent`"
											:rules="{ required: true, message: `选项${iSelect+1}不能为空`, trigger: 'blur' }">
											<el-input style="width:50%;margin-right:10px;"
												v-model="item.optionContent" 
												:placeholder="`选项${iSelect+1}`"
												maxlength="50" 
												show-word-limit 
												@blur="setDefault('option', iSelect)"/>
											<div style="display:inline-block;">
											<el-button type="success" icon="el-icon-plus" circle size="mini" @click="addSelectItem(i)"></el-button>
											<el-button type="danger" icon="el-icon-minus" circle size="mini" @click="delSelectItem(item, iSelect)"></el-button>
											<el-button type="warning" icon="el-icon-top" circle size="mini" 
												:disabled="iSelect === 0"
												@click="moveSelectItem(item, iSelect, -1)"></el-button>
											<el-button type="warning" icon="el-icon-bottom" circle size="mini" 
												:disabled="iSelect === questionCurr.options.length - 1"
												@click="moveSelectItem(item, iSelect, 1)"></el-button>
											</div>
									</el-form-item>
								</template>
							</div>
						</div>
						<div class="edit-footer">
							<el-button type="primary" @click="editConfirm(ques, i)">完成编辑</el-button>
							<input type="hide" class="focusHideInput" ref="focusHideEditRef"/>
						</div>
					</el-form>
				</div>
				<input type="hide" class="focusHideInput" ref="focusHideRef"/>
			</div>
	</div>
</template>
<script setup>
import { ref, reactive, computed, watch, set, nextTick, onMounted } from 'vue'
import { CopyObj, hintFrame, uuid } from "@/util/utils";
import { 
	QUESTION_TYPES, 
	QUESTION_TYPES_START, 
	QUESTION_TYPES_INPUT,
	QUESTION_TYPES_RADIO,
	QUESTION_TYPES_CHECKBOX
} from "@/util/constants";
import { Message } from 'element-ui'
import Sortable from 'sortablejs'
import { getQuesType } from "../hooks/CustomQuestionnaire";

const props = defineProps({
  data: { // 题目（入参）
    type: Array,
    default: () => []
	},
	customFirstIndex: Number, // 第一道自定义题目索引
})
const emits = defineEmits(['confirm'])

const typeOptions = computed(() => {
	return Object.entries(QUESTION_TYPES).map(([key,val]) => {
		// { label: '评分题', value: '1' }
		return {
			value: key,
			label: val.label
		}
	})
})

// 题目列表（本地操作数据）
const questions = ref([])
// 题目表单
const questionCurr = ref({})
const ruleQuestion = {
	answerType: [ { required: true, trigger: 'blur', message: '请输入题目类型' } ],
	content: [ { required: true, trigger: 'blur', message: '请输入题目标题' } ],
}

const focusHideRef = ref(null)
const focusHideEditRef = ref(null)
// ======================= 编辑题目 =======================
function focusQuestionItem (i) {
	nextTick(() => {
		focusHideRef.value[i].focus()
	})
}
// 添加题目选项
function addSelectItem (i) {
	const index = questionCurr.value?.options.length
	questionCurr.value?.options?.push({
		optionContent: `选项${index+1}`,
	})
	focusQuestionItem(i)
}
// 删除题目选项
function delSelectItem (item, index) {
	if (questionCurr.value.options?.length <= 1) {
		return Message.warning('只有一条选项了，不能删除')
	}
  if (false) {
    hintFrame('确认删除题目选项吗？').then(() => {
      questionCurr.value?.options?.splice(index, 1)
    })
  } else {
    questionCurr.value?.options?.splice(index, 1)
  }
}
// 移动题目选项
function moveSelectItem(ques, i, num) {
	const other = i + num
	if (!questionCurr.value.options) return
	const item = questionCurr.value.options.splice(i, 1)
	questionCurr.value.options.splice(other, 0, item[0])
}

const editQuestionFormRef = ref(null)

// 题目类型改变
function questionTypeChange (value, i) {
	questionCurr.answerType = value
	questionCurr.value.content = `这是${getQuesType(questionCurr.value, 'label')}`
	if ([QUESTION_TYPES_RADIO, QUESTION_TYPES_CHECKBOX].includes(value)) {
		// 设置题目标题
		set(questionCurr.value, 'options', [
			{ orderNo: '1', optionContent: '选项1' },
			{ orderNo: '2', optionContent: '选项2' },
		])
	}
	focusQuestionItem(i)
}
// 设置默认值
function setDefault (type, index) {
	if (type === 'ques') {
		!questionCurr.value.content && (questionCurr.value.content = `这是${getQuesType(questionCurr.value, 'label')}`)
	} else {
		!questionCurr.value.options[index].optionContent && (questionCurr.value.options[index].optionContent = `选项${index+1}`)
	}
}
// 添加题目
function addQuestion (typeItem) {
	const editIndex = questions.value.findIndex(m => m.isEdit) 
	if (editIndex > -1) { // 
		set(questions.value[editIndex], 'isEdit', false )
	}
	const ques = {
		isEdit: false,
		isFixed: false,
		answerType: typeItem.code,
		content: `这是${typeItem.label}`, // 题目标题
		isRequired: true, // 是否必答：1是/0否
	}
	if ([QUESTION_TYPES_RADIO, QUESTION_TYPES_CHECKBOX].includes(typeItem.code)) {
		ques.options = [
			{ orderNo: '1', optionContent: '选项1' },
			{ orderNo: '2', optionContent: '选项2' },
		]
	}
	questions.value.push(ques)
	// 聚焦题目
	focusQuestionItem(questions.value.length - 1)
}

// 编辑题目
const questionEditRef = ref(null)
function editQuestion (i) {
	const editIndex = questions.value.findIndex(m => m.isEdit) 
	if (editIndex < 0) {
		// 开始编辑
		set(questions.value[i], 'isEdit', true )
		questionCurr.value = questions.value[i]

		console.log(questionEditRef)
		// 移动滚动条
	} else if ( editIndex === i ) {
		// 保存重命名
		// set(questions.value[i], 'isEdit', false )
	} else {
		// 选保存，另一题目再编辑
		set(questions.value[editIndex], 'isEdit', false )
		set(questions.value[i], 'isEdit', true )
		questionCurr.value = questions.value[i]
	}
	// 聚焦题目
	focusQuestionItem(i)
}
// 复得题目
function copyQuestion (item, i) {
	const newItem = CopyObj(item)
	const other = i + 1
	questions.value.splice(other, 0, newItem)
	Message.success('复制成功')
	// 聚焦题目
	focusQuestionItem(other)
}
// 删除题目
function deleteQuestion (item, i) {
	hintFrame('确认删除题目吗？').then(() => {
		questions.value?.splice(i, 1)
	})
}
// 移动题目
function moveQuestion (i, flag) {
	try {
		const numMapper = {
			'up': i - 1,
			'down': i + 1,
			'first': props.customFirstIndex,
			'last': questions.value.length -1
		}
		const other = numMapper[flag]
		if (!questions.value[other]) return
		const item = questions.value.splice(i, 1)
		questions.value.splice(other, 0, item[0])
		Message.success('移动成功')
	} catch (e) {
		Message.success('移动失败')
	}
	
}

// 完成编辑
function editConfirm (item, index) {
	if (editQuestionFormRef?.value?.length) {
		editQuestionFormRef?.value[0].validate(succ => {
			if (!succ) return
			set(questions.value[index], 'isEdit', false )
		})
	}
}

// 初始化数据
watch(
	() => props.data,
	(n, o) => {
		console.log('==> QuestionList:watch:data', n)
		questions.value = CopyObj(n)
	}, 
	{ immediate: true }
)

// 获取题目列表
function getData (flag) {
	if (flag === 'submit') {
		const submitData = questions.value
			.filter(m => !m.isEdit && !m.isFixed)
			.map((m, index) => {
				const res = {
					orderNo: index + 1,
					content: m.content,
					answerType: m.answerType,
					isRequired: Number(m.isRequired),
				}
				if (m.contentId) res.contentId = m.contentId
				if (m.options) res.options = m.options.map((m,i) => {
					return {
						optionContent: m.optionContent,
						orderNo: i + 1
					}
				})
				return res
			})
		return submitData
	} else {
		const questionsComp = questions.value.filter(m => !m.isEdit)
		questionsComp.forEach(m => {
			Reflect.deleteProperty(m, 'iid')
			Reflect.deleteProperty(m, 'isEdit')
		})
		return questionsComp
	}
}
// 是否有正在编辑的题目
function hasEditRow () {
	return questions.value.some(m => m.isEdit)
}
// 挂载时生命周期
onMounted(() => {
	const items = document.querySelector('.question-container')
	new Sortable(items, {
		handle: '.drag-view',    
		filter: '.filter',  
		animation: 150,
		onEnd(event) {
			const list = questions.value
			const { newIndex, oldIndex } = event
			console.log('拖动参数-oldIndex', oldIndex)
			console.log('拖动参数-newIndex', newIndex)
			
			const temp = [ ...questions.value ]
			const oldValue = temp.splice(oldIndex, 1)
			temp.splice(newIndex, 0, oldValue[0])
			questions.value = []
			nextTick(() => {
				questions.value = temp
			})
		},
		onMove(event) {
			// dragged是当前拖拽项，related是经过的项
			let { dragged, related } = event
			console.log(related.className)
			// 当经过项中是有需要过滤的项的话，停止拖拽
			if (
				related.className.includes('fixed-div')
			) {
				return false
			}
		},
	})
})

defineExpose({
	hasEditRow,
	addQuestion, // 添加题目
	getData // 获取题目列表
})
</script>
<style lang="scss" scoped>
.question-container {

	.question-item {
		margin-top: 10px;
		border: 1px solid #EBEBEB;
		position: relative;
		&:not(.fixed-div):hover {
			border: 1px solid #ccc;
			box-shadow: 1px 1px 8px #ccc;
			.question-view:not(.edit-view) {
				.question-btns {
					margin-top: -10px;
					display: block;
				}
			}
		}
		.drag-view {
			cursor: move;
		}
		.question-view {
			background: #fff;
			position: relative;
			.uneditable {
				position: absolute;
				width: 58px;
				right: 0;
				top: 0;
			}
			.question-content {
				padding: 20px;
			}
			.question-title {
				font-size: 14px;
				font-weight: 500;
				font-weight: bold;
				margin-bottom: 8px;
				.must-start {
					font-size: 14px;
					color: red;
					font-weight: bold;
					margin-left: -10px;
					margin-right: 3px;
				}
				.fenge {
					margin-left: 2px;
					margin-right: 4px;
				}
				.type {
					font-size: 14px;
					color: #000;
					opacity: 0.4;
					font-weight: 400;
				}
			}
			.question-select-container {
				&.start {
					display: flex;
					color: goldenrod;
					.start-item {
						margin: 6px 4px 0px;
						background: #E5E5E5;
						color: #fff;
						height: 28px;
						width: 28px;
						text-align: center;
						border-radius: 3px;
						font-size: 16px;
						line-height: 28px;
					}
				}
				&.radio, &.checkbox {
					.question-select-item {
						li {
							line-height: 24px;
							font-size: 12px;
							display: flex;
							.icon-check {
								display: inline-block;
								width: 14px;
								height: 14px;
								border: 1px solid #ddd;
								margin: 5px 7px 0 0;
							}
							.icon-radio {
								border-radius: 7px;
							}
						}
					}
				}
				.input-div {
					height: 100px;
					background: #F9F9F9;
					border: 1px solid #f0f0f0;
				}
			}
			.question-btns {
				display: none;
				text-align: right;
				margin-top: 8px;
				background: #F8F8F8;
				padding: 8px 10px;
				button {
					margin-left: 5px !important;
				}
			}
		}
		.question-edit {
			border-top: 1px solid #ddd;
			background: #fff;
			.form-container {
				display: flex;
				margin: 20px 24px 0;
				.el-form-item {
					margin-bottom: 18px;
				}
				.form-left {
					width: 120px;
				}
				.form-right {
					flex: 1;
					padding-left: 10px;
					.el-button {
						margin-left: 10px !important;
						// float: right;
					}
				}
			}
			.edit-footer {
				padding: 0 20px 20px;
				.el-button {
					width: 100%;
				}
			}
		}
		.focusHideInput {
			height: 0px;
			position:absolute;
			left: 0px;
			bottom: 0px;
		}
	}
}
</style>
