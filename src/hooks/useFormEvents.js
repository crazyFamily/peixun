import { CopyObj } from '@/util/utils'
import { reactive } from 'vue'

export function useFormEvents(params) {
  const formDataInt = () => CopyObj(params)
  const formData = reactive(formDataInt())
  const resetFields = () => {
    const defaultData = formDataInt()
    Object.keys(defaultData).forEach((key) => {
      formData[key] = defaultData[key]
    })
  }
  return {
    formData,
    resetFields
  }
}
