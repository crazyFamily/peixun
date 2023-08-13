<template>
 <el-dialog title="预览"
	top="5vh"
	width="375px"
	class="preview-model"
	:visible="isOpen"
	@close="close">
	<div class="preview-container">
		<div class="close-btn" @click="close">
			<span class="icon-del el-icon-error"></span>
		</div>
		<img src="@/assets/svg/question-view-top.svg" alt="" class="phone-top" />
		<p v-if="isAnonymous === 'Y'" class="anonymouns-msg">此问卷为匿名问卷，您的个人信息将被加密</p>
		<div class="questionnaire-container">
			<div class="questionnaire-header">
				<h3 v-if="!isCustomOrSimple && title">{{title || 'XXXX'}}</h3>
				<!-- <h3>{{title || 'XXXX'}}培训班调研问卷</h3> -->
				<p v-if="!isCustomOrSimple && desc">{{desc || '添加问卷说明'}}</p>
			</div>
			<div class="questionnaire-body">
				<div class="question-container">
					<div class="question-item" v-for="(ques,i) in data" :key="i">
						<div class="question-view">
							<div class="question-title">
								<span v-show="ques.isRequired" class="must-start">*</span>
								<span>{{i+1}}</span>
								<span class="fenge">.</span>
								<span>{{ques.content}}</span>
								<span class="type">【{{getQuesType(ques, 'label')}}】</span>
							</div>
							<div class="question-select-container" :class="[getQuesType(ques)]">
								<!-- <template v-else-if="ques.type === 'start'">
									<div class="question-select-item" v-for="(item, ii) in ques.startNumber" :key="ii">
										<span class="el-icon-star-off"></span>
									</div>
								</template> -->
								
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
					</div>
					<div class="question-footer">
						<el-button disabled>保存</el-button>
						<el-button disabled type="primary">提交</el-button>
					</div>
				</div>
			</div>
		</div>
	</div>
 </el-dialog>
</template>
<script setup>
import { ref, reactive, watch, set, computed } from 'vue'
import { CopyObj, hintFrame, uuid } from "@/util/utils"
import { Message } from 'element-ui'
import { QUESTION_TYPES, QUESTION_TYPES_START, QUESTION_TYPES_INPUT } from "@/util/constants"
import { getQuesType } from "../hooks/CustomQuestionnaire"

const props = defineProps({
	questionnaireCategory: String,
	isOpen: Boolean,
	title: String,
	desc: String,
	isAnonymous: String,
  data: { // 题目（入参）
    type: Array,
    default: () => []
  }
})

// 题目列表（本地操作数据）
const questions = ref([])
const isCustomOrSimple = computed(() => {
	return ['new_custom', 'new_simple', 'custom'].includes(props.questionnaireCategory)
})

watch(() => props.data,
	(n, o) => {
		questions.value = CopyObj(n)
}, { immediate: true })

const emits = defineEmits(['close'])
function close() {
	emits('close', false)
}

</script>
<style lang="scss" scoped>
.preview-container{
	position: relative;
}
.close-btn {
    position: absolute;
    z-index: 2;
    right: -10px;
    top: -10px;
		width: 23px;
		height: 24px;
		border-radius: 12px;
		background: #f0f0f0;
    cursor: pointer;
    .icon-del {
      font-size: 24px;
      color: #444;
    }
  }
.preview-model {
  :deep(.el-dialog) {
    margin-bottom: 5vh;
  }
  :deep(.el-dialog__header) {
    display: none;
  }
  :deep(.el-dialog__body) {
    padding: 0px !important;
    padding-left: 0px !important;
  }
}
.anonymouns-msg {
	text-align: center;
	padding: 3px;
	color: #F8199E;
	background: #FEDEF1;
}
.phone-top {
	width: 375px;
}
.questionnaire-container {
	background: #f0f0f0;
	margin: 0px auto 20px;
	width: 375px;
	max-height: calc(90vh - 88px);
	overflow: auto;
	.questionnaire-header {
		background: #fff;
		padding: 10px 15px 5px;
		// border-bottom: 1px dashed #ddd;
		h3 {
			font-size: 18px;
			text-align: center;
			color: #555;
		}
		h4 {
			font-size: 16px;
			text-align: center;
			color: #555;
			margin-bottom: 8px;
		}
		p {
			color: #888;
			min-height: 30px;
			line-height: 22px;
			padding: 5px 0;
		}
	}
	.question-container {
		.question-item {
			background: #fff;
			margin-top: 10px;
			padding: 15px 15px 10px;
			// &:hover {
			// 	background: #f0f0f0;
			// }
			.question-view {
				.question-title {
					font-size: 14px;
					font-weight: 500;
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
						margin-right: 0px;
					}
					.type {
						font-size: 12px;
						color: #555;
					}
				}
				.question-select-container {
					&.start {
						display: flex;
						color: goldenrod;
						// .question-select-item {
						// }
						.start-item {
							margin: 8px 4px 10px;
							background: #E5E5E5;
							color: #fff;
							height: 28px;
							width: 28px;
							text-align: center;
							border-radius: 3px;
							font-size: 16px;
							line-height: 28px;
							&:hover {
								background: orange;
							}
						}
					}
					&.radio, &.checkbox {
						.question-select-item {
							li {
								line-height: 24px;
								font-size: 12px;
								display: flex;
								.icon-check {
									cursor: not-allowed;
									display: inline-block;
									width: 13px;
									height: 13px;
									border: 1px solid #ddd;
									margin: 6px 7px 0 0;
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
						color: #ccc;
						padding: 5px ;
					}
				}
				.question-btns {
					display: none;
					text-align: right;
					margin-top: 8px;
					margin-bottom: -8px;
					button {
						margin-left: 5px !important;
					}
				}
			}
		}
		.question-footer {
			background: #fff;
			margin-top: 10px;
			text-align: center;
			padding: 10px 10px 20px;
			button {
				width: 40%;
				font-size: 16px !important;
				line-height: 22px;
				border-radius: 20px !important;
			}
		}
	}
}


</style>
