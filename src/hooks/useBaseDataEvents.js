import { set } from 'vue'

export function useBaseDataEvents() {
  /**
   * @param origin 当前需要进行合并的对象
   * @param target 希望合并的目标对象
   */
  const mergeReactive = ({ origin, target }) => {
    Object.keys(target).forEach((key) => {
      set(origin, key, target[key])
    })
  }

  const clearReactive = (data) => {
    Object.keys(data).forEach((key) => {
      Reflect.deleteProperty(data, key)
    })
  }

  return { mergeReactive, clearReactive }
}
