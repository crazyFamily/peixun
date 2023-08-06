import axios from 'axios'
import FileSaver from 'file-saver'
//标签字符串校验，长度限制和特殊字符输入限制
export let testingText = (str, len, text) => {
  //用正则去掉字符串两边的空格
  str += ''
  str = str.replace(/(^\s*)|(\s*$)/g, '')
  //如果字符串长度过长，超过指定长度，返回-1
  if (str.length > len) {
    return -1
  }
  //如果字符串为空，返回-2
  if (str.length == 0 && text == undefined) {
    return -2
  }

  if (str.length == 0 && text == 'titel') {
    return -2
  }

  let reg = ''
  if (text == undefined) {
    reg = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5]+$')
  } else if (text == 'text') {
    return str
  } else if (text == 'titel') {
    return str
  }
  if (reg.test(str)) return str
  else return -3
}

export let logOtu4A = () => {
  if (process.env.VUE_APP_API_TYPE == 'prd') {
    console.log('非本地测试，跳出4A')
    window.location.href = process.env.VUE_APP_API + '/4a/logoutService'
  } else {
    console.log('地测试，不跳出4A')
  }
}

export let CopyObj = (dist) => {
  // 数据类型为引用数据类型
  const diffResult = (obj) => {
    if (typeof obj === 'object') {
      // 初始化返回结果, 需要注意处理null特列状态
      let result = obj === null ? null : Array.isArray(obj) ? [] : {}
      for (let key in obj) {
        // 避免相互引用出现死循环导致爆栈
        if (obj === obj[key]) {
          continue
        }
        // 处理文件对像
        if(obj[key] instanceof File) {
          const { name, type, lastModified } = obj[key]
          result[key] = new File([obj[key]], name, { type, lastModified })
          continue
        }
        if (obj.hasOwnProperty(key)) {
          // 递归调用
          result[key] = diffResult(obj[key])
        }
      }
      return result
    } else {
      // 基本数据类型，直接返回
      return obj
    }
  }

  return diffResult(dist)
  // return JSON.parse(JSON.stringify(dist))
}

export let TranslateTreeData = data => {
  let data2 = new Object()
  for (let i = 0; i < data.length; i++) {
    data[i].children = []
    data2[data[i].id] = data[i]
    data[i].father = null
  }
  let t = []
  for (let i = 0; i < data.length; i++) {
    if (data2[data[i].parentId] != undefined) {
      data2[data[i].parentId].children.push(data[i])
      data[i].father = -1
    } else {
      t.push(data[i])
    }
  }
  console.log(t)
  return t
}

export let downLoadDocument = function(
  url,
  params,
  fileName,
  callBack,
  errorBack,
  isMark = false
) {
  var that = this
  let form
  if (params.failList) {
    form = params
  } else {
    form = new FormData()
    for (var k in params) {
      form.append(k, params[k])
    }
  }

  let config = {
    url: url,
    params: {
      _nocache: String(new Date().getTime())
    },
    method: 'post',
    data: form,
    timeout: 1500000,
    responseType: 'blob',
    onDownloadProgress: progressEvent => {
      console.log('下载进度..', progressEvent)
    }
  }
  /* if(params.failList){
    config['content-type'] = 'application/json' 
  } */
  axios(config)
    .then(function(response) {
      console.log('下载接口的返回值' + response)
      if (response.data.type === 'application/json') {
        var fr = new FileReader()
        fr.readAsText(response.data)
        fr.onload = function(event) {
          var error = JSON.parse(event.srcElement.result)
          error = error.RSP_HEAD.ERROR[0]
          // 如果是下载的时候没有数据，改为提示信息
          if (error.code == 'RP009') {
            this.infoAlert(error.info)
          } else {
            this.errorAlert(error.info)
          }
          if (errorBack) {
            errorBack(error, response)
          }
        }
        return null
      }

      FileSaver.saveAs(response.data, fileName)
      if (callBack) {
        callBack(response.data, response)
      }
      console.log('download')
    })
    .catch(err => {
      errorBack(err)
    })
}

export let updateUrl = process.env.VUE_APP_API_UPDATE

export const formatDate = (time, empty) => {
  let date
  if (time) {
    if (parseInt(time) == time) {
      time = parseInt(time)
    }
    date = new Date(time)
    if (date == 'Invalid Date') return ''
  } else {
    if (empty) return ''
    date = new Date()
  }
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1 + '').padStart(2, '0')
  const D = (date.getDate() + '').padStart(2, '0')
  const h = (date.getHours() + '').padStart(2, '0')
  const m = (date.getMinutes() + '').padStart(2, '0')
  const s = (date.getSeconds() + '').padStart(2, '0')
  return `${Y}-${M}-${D}`
}

export const daysApart = (time1, time2) => {
  if (time1 && time2) {
    return Math.floor(new Date(time1) - new Date(time2)) / (24 * 3600 * 1000)
  }
  return 0
}

export const myRound = (target, length, flag) => {
  if (!target) return 0
  const num = length ? Math.pow(10, length) : 1
  const result = Math.round(target * num) / num
  if (flag && result === 0.0) {
    return '--'
  }
  return isNaN(result) ? 0 : result
}
