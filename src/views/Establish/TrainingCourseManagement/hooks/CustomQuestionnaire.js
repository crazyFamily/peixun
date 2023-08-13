
import { QUESTION_TYPES } from "@/util/constants";
export function getQuesType (ques, field = 'code') {
	const type = QUESTION_TYPES[ques.answerType]
	return field === 'code' ? type?.code : type?.label
}
