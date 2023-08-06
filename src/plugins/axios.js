'use strict'

import Vue from 'vue'
import axios from 'axios'
import { message } from 'element-ui'
import { SERVER_BASEHOST } from '@/util/constants'
import { vueInt } from '@/main.js'

// Full config:  http://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // baseURL: process.env.VUE_APP_API,
  baseURL: SERVER_BASEHOST,
  timeout: 60 * 10000, // Timeout
  withCredentials: true // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {

    if (process.env.VUE_APP_API_TYPE === 'local') {
      let ticketInfo = {}
      try {
        ticketInfo = require('../../serve/sessionTicket/ticket')
        document.cookie = `sessionTick=${ticketInfo.ticket}`
      } catch (e) {}
    }

    if (!config.baseURL) config.baseURL = SERVER_BASEHOST
    // Do something before request is sent
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

function trainingCourseReleaseFunction(errMessage, response) {
  // const responseURL = response.request.responseURL;
  // if (
  //     responseURL &&
  //     responseURL.indexOf("/init/selectClassesInfo") &&
  //     errMessage === "该项目立项没有分配预算,不能发起报销"
  // ) {
  //     return true;
  // }
  return false
}

const releaseList = [trainingCourseReleaseFunction]

const greenLightUrlList = ['/system/roleApply/checkRoleApplyByUm']

function isGreenLight(contentType) {
  const headers = ['application/octet-stream', 'application/vnd.ms-excel']
  const content = (contentType || 'pppp').split(';')[0]
  return headers.includes(content)
}

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    if (isGreenLight(response.headers['content-type'])) {
      return response
    }
    if (response.data.code == 0) {
      return response
    }
    if (response.data.code == 1) {
      message.error(response.data.msg || '系统错误')
      return response
    }
    if (response.data.code == 4 && response.data.data?.taskId) {
      return response
    }
    if (response.data.code == '500001') {
      location.href = '/#/error'
    } else {
      if (
        response.data &&
        typeof response.data === 'object' &&
        'size' in response.data
      ) {
        return response
      }
      let errMessage =
        response.data.responseMsg ||
        response.data.errmsg ||
        response.data.msg ||
        '系统错误'
      const state = releaseList.some((fun) => fun(errMessage, response))
      if (!state) {
        try {
          if (errMessage.includes('<br/>')) {
            const e = errMessage.split('<br/>')
            const h = vueInt.$createElement
            const res = e.map((item) => h('p', null, item))
            message({ type: 'error', message: h('div', null, res) })
          } else {
            message({ type: 'error', message: errMessage })
          }
        } catch (error) {
          console.log(error, 'error')
          message.error(errMessage)
        }
      }
      return response
    }

    return
    // Do something with response data
  },
  function (error) {
    if (process.env.VUE_APP_API_TYPE == 'dev') {
      if (error.response)
        message.error('请求失败，请求错误码：' + error.response.status)
      else message.error('请求失败，后台错误')
    }

    if (error.response && error.response.status === 401) {
      var loc = error.response.data.data.Location
      //baseUrl为接入应用后台地址
      console.log(config.baseURL + loc)

      // 这里的操作只能在local环境下执行
      if (process.env.VUE_APP_API_TYPE === 'local') {
        // 判断是否 94版本以上
        const isChrome94 = Number(navigator.userAgent.match(/Chrome\/([\d.]+)/g)[0].match(/\d+/g)[0]) > 94
        // 由于谷歌浏览器在94版本以上，无法通过第三方写入cookie，只能通过手动写入，所以这里的跳转就没有意义了。
        if(isChrome94) return
      }

      location.href = config.baseURL + loc
      // Do something with request error
      // Do something with response error
    }

    return Promise.reject(error)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export { _axios }

export default Plugin
