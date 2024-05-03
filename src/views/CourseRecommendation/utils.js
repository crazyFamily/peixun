import { jsonHeaders } from '@/util/utils'
import { _axios } from '@/plugins/axios'

// 获取私财机构
export const getOrg = () => {
  return _axios
    .post('/fn/commons/privatewealth/listScOrg', {}, jsonHeaders)
    .then(res => {
      const { code, data } = res.data
      if (code === 0) {
        return data
      }
    })
}

// axios的二次组装
export const axiosAssemble = (
  url,
  params = {},
  type = 'post',
  options = {}
) => {
  // 边界
  if (!['post', 'get'].includes(type)) {
    throw new Error('暂不支持的类型')
  }

  let axiosFn
  let headers = { ...jsonHeaders }
  if (type === 'post') {
    axiosFn = _axios.post
  }
  if (type === 'get') {
    axiosFn = _axios.get
  }

  options.headers && (headers = { ...headers, ...options.headers })

  return new Promise((resolve, reject) => {
    axiosFn(url, params, headers).then(res => {
      let { code, data } = res.data
      if (isNaN(code) || !data) {
        reject('返回数据结构不对，请检查数据结构')
      }
      if (code === 0) {
        resolve(data)
      } else {
        reject()
      }
    })
  })
}