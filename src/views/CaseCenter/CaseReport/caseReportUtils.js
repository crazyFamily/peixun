import { jsonHeaders } from '@/util/utils'
import { _axios } from '@/plugins/axios'
export const httpService = (url, params, options = {}, method = 'post') => {
  let headers = jsonHeaders
  if (options.headers) {
    headers = Object.assign({}, jsonHeaders, options.headers)
  }
  return new Promise((resolve, reject) => {
    _axios[method](url, params, headers).then(res => {
      if (options.allRes) {
        return resolve(res)
      }
      let { code, data } = res.data
      if (code === 0) {
        return resolve(data)
      }
      return reject({ code, data })
    })
  })
}
