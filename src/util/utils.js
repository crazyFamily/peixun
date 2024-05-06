import { MessageBox, Message } from 'element-ui'
import { CopyObj, formatDate, myRound } from '../plugins/until'
import { allowKeepAlive } from '../router'
import { _axios,twAxios } from '../plugins/axios'
import $store from '../store'
import { result, merge as _merge } from 'lodash'
import $ from 'jquery'
import router from '../router'
import { fetchDownTemplate } from '@/fetch/templateManament'
import { SERVER_BASEHOST } from '@/util/constants'
import { computed } from 'vue'

// 判断ie
export const isIE = () => {
  return window.ActiveXObject || 'ActiveXObject' in window
}

// el-date-picker 时间限制
export const pickerOptions = (that) => {
  const keys = Object.keys(that.queryForm)
  const startKeyList = [
    'submitDateStart',
    'dateStart',
    'startDate',
    'dateStartTime',
    'applyStart',
    'createStartDate',
    'examStart',
    'caseUpStartDate',
    'startTime'
  ]
  if (that?.startField) {
    startKeyList.push(that.startField)
  } 
  const startKey = startKeyList.find((v) => keys.includes(v))
  const endKeyList = [
    'submitDateEnd',
    'dateEnd',
    'endDate',
    'dateEndTime',
    'applyEnd',
    'createEndDate',
    'examEnd',
    'caseUpEndDate',
    'endTime'
  ]
  if (that?.endField) {
    endKeyList.push(that.endField)
  } 
  const endKey = endKeyList.find((v) => keys.includes(v))
  return {
    // el-date-picker 开始时间限制
    startPickerOptions: {
      disabledDate: (time) => {
        if (that.queryForm[endKey]) {
          return !(formatDate(time) <= that.queryForm[endKey])
        }
        return false
      }
    },
    // el-date-picker 结束时间限制
    endPickerOptions: {
      disabledDate: (time) => !(formatDate(time) >= that.queryForm[startKey])
    }
  }
}

// el-date-picker 大于等于今天时间
export const gtNow = {
  disabledDate: (time) => formatDate(time) < getCurrentTime()
}

// el-date-picker 开始时间限制
export const handleStartPickerOptions = (obj, endKey, year) => {
  if (year) {
    return {
      // el-date-picker 开始时间限制
      disabledDate: (time) => {
        if (obj[endKey]) {
          return !(
            formatDate(time).split('-')[0] === obj[endKey]?.split('-')[0]
          )
        }
        return false
      }
    }
  }
  return {
    // el-date-picker 开始时间限制
    disabledDate: (time) => {
      if (obj[endKey]) {
        return !(formatDate(time) <= obj[endKey])
      }
      return false
    }
  }
}

// el-date-picker 结束时间限制
export const handleEndPickerOptions = (obj, startKey, year) => {
  if (year) {
    return {
      // el-date-picker 结束时间限制
      disabledDate: (time) =>
        !(formatDate(time).split('-')[0] === obj[startKey]?.split('-')[0])
    }
  }
  return {
    // el-date-picker 结束时间限制
    disabledDate: (time) => !(formatDate(time) >= obj[startKey])
  }
}

// 查找路由name属性
export const searchRouterName = (route) => {
  const item = allowKeepAlive[route.path]
  return item ? item.routerName : 'Home'
}

// 将路由添加至 keep-alive 的include属性里
export const addAllowKeepAlive = (path) => {
  if (typeof path === 'string') {
    path = { path }
  }
  let item
  if (path.componentName) {
    Object.keys(allowKeepAlive).some((key) => {
      if (allowKeepAlive[key].componentName === path.componentName) {
        item = allowKeepAlive[key]
        return true
      }
    })
  } else {
    item = allowKeepAlive[path.path]
  }

  if (item) {
    const index = $store.getters.keepAliveComponents.findIndex(
      (result) => result.componentName === item.componentName
    )
    if (index !== -1) {
      $store.commit('changeIndex', index)
    } else {
      $store.commit('addKeepAlive', { ...path, ...item })
    }
  }
  return item?.routerName
}

// 获取标签页的index
export const getAllowKeepAliveIndex = (path) => {
  return $store.getters.keepAliveComponents.findIndex((v) => v.path === path)
}

// 弹框
export const message = (content) => {
  MessageBox.alert(content, '通知', {
    confirmButtonText: '知道了',
    customClass: `loginTimeout`
  })
}

// 页面变化
export function sizeChange(size, form, callback, args) {
  const key = 'pageSize' in form ? 'pageSize' : 'size'
  form[key] = size.pageSize
  if (!size.send) return
  if (args) {
    callback.apply(this, args)
  } else {
    callback.call(this)
  }
}

export function currentChange(curpage, form, callback, args) {
  const key = 'currPage' in form ? 'currPage' : 'page'
  form[key] = curpage.pageNum
  if (args) {
    callback.apply(this, args)
  } else {
    callback.call(this)
  }
}

// 请求头
export const jsonHeaders = {
  headers: { 'Content-Type': 'application/json; charset=UTF-8' }
}

export const downHeaders = {
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  },
  responseType: 'blob'
}

export const dataHeaders = {
  headers: { 'Content-Type': 'multipart/form-data' }
}

export const defaultHeaders = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

// 处理下载的Blob
export const handleBlob = (fileData, fileName) => {
  const fileRender = new FileReader()
  if (!fileName) {
    fileName = fileData.headers['content-disposition'].split(';').splice(-1)[0]
    if (fileName.indexOf('fileName') > -1) {
      fileName = fileName.split('fileName=')[1]
    } else {
      fileName = fileName.split('filename=')[1]
    }
    fileName = decodeURIComponent(escape(fileName))
    fileName = decodeURIComponent(fileName)
  }
  if (isIE()) {
    window.navigator.msSaveBlob(fileData.data, fileName)
    return
  }
  fileRender.onload = (e) => {
    downloadFileAsAlink(null, { fileName, fileRender })
  }
  fileRender.readAsDataURL(fileData.data)
}

// 通过创建a标签触发下载
export const downloadFileAsAlink = (href, opt = {}) => {
  const a = document.createElement('a')
  a.style.position = 'absolute'
  a.style.top = '-99999px'
  a.style.zIndex = -9999
  a.download = opt.fileName || true
  a.href = href || opt.fileRender.result
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// 表单下载
export const formDownload = (url, data) => {
  const form = $('<form>')
  form.attr('style', 'display:none')
  form.attr('method', 'post')
  form.attr('action', `${SERVER_BASEHOST || ''}${url}`)
  Object.keys(data).forEach((key) => {
    const value = data[key]
    const input = $('<input>')
    input.attr('type', 'hidden')
    input.attr('name', key)
    input.attr('value', value)
    form.append(input)
  })
  $('body').append(form) //将表单放置在web中
  form.submit()
  form.remove()
}
//下载后改名
export const downloadFileByName = (url,fileName)=>{
  return twAxios
    .get(url, {
      responseType: 'blob'
    })
    .then((fileData) => {
      handleBlob(fileData, fileName)
    })
    .catch((err) => {
      console.log(err)
    })
}
// get请求下载
export const downloadFile = (udmpId, fileName) => {
  if (isIE()) {
    return new Promise((resolve, reject) => {
      try {
        const url = handleUdmpHref(udmpId)
        window.location = url
        resolve()
      } catch {
        reject('下载失败')
      }
    })
  }

  return _axios
    .get(handleCommonDownHref(), {
      params: { udmpId },
      responseType: 'blob'
    })
    .then((fileData) => {
      handleBlob(fileData, fileName)
    })
    .catch((err) => {
      console.log(err)
    })
}

// get请求下载
export const downloadFileByAut = (params, fileName) => {
  if (isIE()) {
    return new Promise((resolve, reject) => {
      try {
        const url = handleUdmpHref(udmpId)
        window.location = url
        resolve()
      } catch {
        reject('下载失败')
      }
    })
  }

  return _axios
    .get(handleUdmpDownLoadFileExByAut(), {
      params,
      responseType: 'blob'
    })
    .then((fileData) => {
      handleBlob(fileData, fileName)
    })
    .catch((err) => {
      console.log(err)
    })
}

// 模板下载
export const templateDownload = (url, data) => {
  formDownload(url, data || {})
}

// 封装axios下载
export const axiosDownload = (url, data, fileName) => {
  return _axios
    .post(url, data, {
      ...jsonHeaders,
      responseType: 'blob'
    })
    .then((fileData) => {
      handleBlob(fileData, fileName)
    })
    .catch((err) => {
      console.log(err)
    })
}

// 本地下载
export const localDownload = (file, a) => {
  if (a && a.nodeType) {
    oldLocalDownload(file, a)
  } else {
    newLocalDownload(file)
  }
}

// 本地下载 新的方式
export const newLocalDownload = (file) => {
  if (isIE()) {
    window.navigator.msSaveBlob(file, file.name)
    e.preventDefault()
  } else {
    const fileRender = new FileReader()
    fileRender.onload = (e) => {
      const a = document.createElement('a')
      a.href = fileRender.result
      a.click()
    }
    fileRender.readAsDataURL(file)
  }
}

// 本地下载 旧的方式
export const oldLocalDownload = (file, a) => {
  if (isIE()) {
    a.onclick = function (e) {
      window.navigator.msSaveBlob(file, file.name)
      e.preventDefault()
    }
  } else {
    const fileRender = new FileReader()
    fileRender.onload = (e) => {
      a.href = fileRender.result
    }
    fileRender.readAsDataURL(file)
  }
}

// 处理下载的内容
export const handleDownload = (res, fileName) => {
  if (res.data.type === 'application/json') {
    const reader = new FileReader()
    reader.onload = function (event) {
      const content = reader.result //内容就在这里
      Message.error(JSON.parse(content).msg)
    }
    reader.readAsText(res.data)
  } else {
    handleBlob(res)
  }
}

// 处理导出文件
export const handleExport = (url, data, fileName) => {
  return _axios
    .post(url, data, downHeaders)
    .then((res) => {
      handleDownload(res, fileName)
    })
    .catch((err) => {
      console.log(err)
    })
}

// 封装下载请求data
export const generalUploadData = (obj) => {
  let { reimClass, classId, busiId, isSave, isReplace, files, isReturnUrl } = obj
  reimClass = reimClass === undefined ? 'reim_class' : reimClass
  busiId = busiId === undefined ? 'exam' : busiId
  const data = new FormData()
  data.append('files', files)
  data.append('busiId', busiId)
  data.append('module', reimClass)
  data.append('submodule', classId || '')
  data.append('isSave', isSave || 'N')
  data.append('isReplace', isReplace || 'N')
  isReturnUrl && data.append('isReturnUrl', isReturnUrl)
  return data
}

// 上传文件
export const uploadFile = (obj) => {
  const data = generalUploadData(obj)
  const url = obj.url || '/common/file/uploadNewFile'
  const headers = obj.headers ? { ...dataHeaders, ...obj.headers } : dataHeaders
  return _axios.post(url, data, headers)
}

// 打开input
export const openFileInput = (id) => {
  document.getElementById(id).click()
}
// 文件上传change函数
export const commonFileInputChange = ($event, obj, key, callback) => {
  obj[key] = $event.target.files[0] || {}
  callback && callback()
}
// 文件导入提示
export const fileImportHint = (data) => {
  if (data.data) {
    data = data.data
  }
  if (!data.errorList || !data.errorList.length) {
    return Message.success(data.title || data.msg || '操作成功')
  }
  let errorContent = '',
    value = ''
  data.errorList.forEach((v) => {
    if (isObj(v)) {
      value = v.value
    } else {
      value = v
    }
    if (value) {
      errorContent += `<p>${value}</p>`
    }
  })

  MessageBox.alert(
    `${data.title ? `<p>${data.title}</p>` : ''} ${errorContent}`,
    '提示',
    {
      confirmButtonText: '知道了',
      customClass: 'file-import-error',
      dangerouslyUseHTMLString: true
    }
  )
  setTimeout(() => {
    $('.file-import-error')
      .parent()
      .css({ zIndex: '9999' })
      .next('.v-modal')
      .css({ zIndex: '9998' })
  }, 0)
}

// 多行提示
export const manyLineHint = (arr, title) => {
  let errorContent = ''
  if (title) {
    errorContent += `<p>${title}</p>`
  }
  arr.forEach((v) => {
    errorContent += `<p>${v}</p>`
  })
  MessageBox.alert(`${errorContent}`, '提示', {
    confirmButtonText: '知道了',
    customClass: 'file-import-error',
    dangerouslyUseHTMLString: true
  })
  setTimeout(() => {
    $('.file-import-error')
      .parent()
      .css({ zIndex: '3001' })
      .next('.v-modal')
      .css({ zIndex: '3000' })
  }, 0)
}

/**
 * 自定义提示
 * 补充注释说明：
 * @param hint String 提示的内空
 * @param title String 提示的标题
 * @param cancel String 弹窗的取消文本，如果为空不显示取消按钮
 * @param flag Boolean 为true则返回错误信息
 * @param confirm String 确认按钮的文本
 * @param customClass String 自定义类名
 */
export const customHint = (
  hint,
  title = '提示',
  cancel,
  flag,
  confirm = '确定',
  customClass = ''
) => {
  return new Promise((resolve, reject) => {
    MessageBox.alert(`${hint}`, title, {
      confirmButtonText: confirm,
      customClass: `loginTimeout autoHeight ${customClass}`,
      cancelButtonClass: 'cancel',
      dangerouslyUseHTMLString: true,
      showCancelButton: !!cancel,
      cancelButtonText: cancel
    })
      .then((valied) => {
        if (valied === 'confirm') {
          return resolve(true)
        }
        reject()
      })
      .catch((err) => flag && reject())
    setTimeout(() => {
      $('.loginTimeout.autoHeight')
        .parent()
        .css({ zIndex: '9999' })
        .next('.v-modal')
        .css({ zIndex: '9998' })
    }, 0)
  })
}
// 删除提示
export const hintFrame = (msg, flag, title = '提示') => {
  return new Promise((resolve, reject) => {
    MessageBox.alert(msg, title, {
      confirmButtonText: '确定',
      showCancelButton: true,
      cancelButtonClass: 'cancel',
      customClass: 'loginTimeout autoHeight'
    })
      .then((valied) => {
        if (valied === 'confirm') {
          return resolve(true)
        }
        reject()
      })
      .catch((err) => flag && reject())
    setTimeout(() => {
      $('.loginTimeout.autoHeight')
        .parent()
        .css({ zIndex: '9999' })
        .next('.v-modal')
        .css({ zIndex: '9998' })
    }, 0)
  })
}
// 数组转换成树
export const arrToTree = (arr, data, callback = noop) => {
  arr.forEach((v) => {
    const children = data.filter(
      (child) =>
        child.tagLevel == parseInt(v.tagLevel) + 1 &&
        child.parentTagId == v.tagId
    )
    callback(v, children)
    if (children.length > 0) {
      v.children = children
      arrToTree(children, data, callback)
    }
  })
}
// 获取标签树
export const getCurriculumTree = (
  tagType,
  blgStripLine,
  tagLevel,
  url,
  disabled
) => {
  tagLevel = tagLevel === undefined ? 1 : tagLevel
  url = url || '/fn/course/tag/selectCourseTagList'
  return _axios
    .post(url, { data: { tagType, blgStripLine } }, jsonHeaders)
    .then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        const tree = data.filter((v) => v.tagLevel == tagLevel)
        arrToTree(
          tree,
          data,
          (item, children) =>
            children.length > 0 && disabled && (item.disabled = true)
        )
        return tree
      }
    })
}
// 获取标签树封装
export const getLableTree = (url, data, tagLevel, callback) => {
  return _axios.post(url, data, jsonHeaders).then((res) => {
    const { code, data } = res.data
    if (code === 0) {
      const tree = data.filter((v) => v.tagLevel == tagLevel)
      arrToTree(tree, data, callback)
      return tree
    }
  })
}
// 重置对象里的字段
export const resetObj = (obj, settings) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
    } else if (isObj(obj[key])) {
      obj[key] = {}
    } else if (isArray(obj[key])) {
      obj[key] = []
    } else if (typeof obj[key] === 'boolean') {
      obj[key] = false
    } else if (typeof obj[key] === 'number') {
      obj[key] = 0
    } else {
      obj[key] = ''
    }
  })
  if (settings) {
    _merge(obj, settings)
  }
}
// 合并对象
export const merge = (to, from) => {
  Object.keys(to).forEach((key) => {
    if (from[key]) {
      to[key] = from[key]
    }
  })
}
// 获取当前时间
export const getCurrentTime = (hasTime) => {
  const date = new Date()
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')
  if (hasTime) {
    const h = (date.getHours() + '').padStart(2, '0')
    const M = (date.getMinutes() + '').padStart(2, '0')
    const s = (date.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${h}:${M}:${s}`
  }
  return `${y}-${m}-${d}`
}
// 判断是否是对象
export const isObj = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
// 是否数组
export const isArray = (arr) => {
  return Array.isArray(arr)
}
// 判断对象差异
export const differenceSet = (arr1, arr2, callback1, callback2) => {
  if (isObj(arr1)) {
    arr1 = Object.keys(arr1)
  } else if (!isArray(arr1)) {
    return new Error('参数必须是对象或者数组')
  }
  if (isObj(arr2)) {
    arr2 = Object.keys(arr2)
  } else if (!isArray(arr2)) {
    return new Error('参数必须是对象或者数组')
  }
  const diffArr = [],
    dict = {}
  arr1.forEach((v) => {
    callback1 && (v = callback1(v))
    if (dict[v]) {
      dict[v]++
    } else {
      dict[v] = 1
    }
  })
  arr2.forEach((v) => {
    callback2 && (v = callback2(v))
    if (dict[v]) {
      dict[v]++
    } else {
      dict[v] = 1
    }
  })
  return Object.keys(dict).filter((v) => dict[v] === 1)
}
// 条线
export const blgStripLineMaping = {
  FL: '非零',
  LS: '零售',
  JF: '金服',
  CX: '橙信'
}
// 条线
export const blgStripLineOptions = [
  {
    label: '零售',
    value: 'LS'
  },
  {
    label: '非零',
    value: 'FL'
  },
  {
    label: '金服',
    value: 'JF'
  },
  {
    label: '橙信',
    value: 'CX'
  }
]
// 获取条线中文名
export const filterBusiType = (busiType) => {
  return blgStripLineMaping[busiType]
}
// 两数相除并保留指定小数
export const percentage = (num1, num2, len) => {
  const result = (num1 * 100) / num2
  return myRound(result, len || 2)
}
// 数组求和
export const sum = (arr, key) => {
  if (!arr) {
    return 0
  } else if (arr.length < 2) {
    const item = arr[0]
    const val = item ? (isObj(item) ? item[key] : item) : 0
    return myFloat(val)
  }
  return arr.reduce((v, m) => {
    v = isObj(v) ? v[key] : v
    m = isObj(m) ? m[key] : m
    return myRound(myFloat(v) + myFloat(m), 2)
  })
}
// 小数转换
export const myFloat = (num) => {
  return myRound(parseFloat(num), 2)
}

// 查询条线分类
export const getBlgStripLineOptions = (module) => {
  return new Promise((resolve, reject) => {
    _axios
      .post('/fn/user/selectTree', { module }, jsonHeaders)
      .then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          data.forEach((v) => {
            v.value = v.busiType
            if (v.busiType === 'LS') {
              v.label = '零售'
            } else if (v.busiType === 'FL') {
              v.label = '非零'
            } else if (v.busiType === 'JF') {
              v.label = '金服'
            } else if(v.busiType === 'CX') {
              v.label = '橙信'
            }
          })
          resolve(data)
        }
      })
      .catch((err) => reject(err))
  })
}

// 查询 所有部门
export const getBlgOrgOptions = (data) => {
  return new Promise(function (resolve, reject) {
    _axios
      .post('/fn/user/selectTree', data, jsonHeaders)
      .then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { orgList } = data[0] || {}
          orgList.forEach((v) => {
            v.label = v.orgName
            v.value = v.orgId
            v.busiType = v.blgStripLine
          })
          resolve(orgList)
        } else {
          reject(data)
        }
      })
      .then((err) => {
        reject(err)
      })
  })
}

const conditionCallMap = {
  login() {
    return $store.state.userInfo.umId
  }
}

// 延迟调用
export const delayCall = (fn, conditionCall) => {
  if (typeof conditionCall === 'string') {
    conditionCall = conditionCallMap[conditionCall]
  }
  setTimeout(() => {
    if (conditionCall()) {
      fn()
    } else {
      delayCall(fn, conditionCall)
    }
  }, 100)
}

// SelectionChange 事件 table多选变单选
export const tableSelectionChange = ($refs, selection, ref) => {
  if (selection.length > 1) {
    $refs[ref].$children[0].clearSelection()
    $refs[ref].$children[0].toggleRowSelection(selection.pop())
  }
}

// 审批链数组转换为 只有um号的 字符串
export const ApprovalChainTransition = (data) => {
  if (!data) return []
  const first = data[0]
  const auditUsers = []
  data.forEach((v, i) => {
    auditUsers.push(v.approveFlag)
    auditUsers.push(v.chainUmId)
  })
  return auditUsers.slice(1)
}

// 审批链数组转换为 只有name的 字符串
export const ApprovalChainTransitionName = (data) => {
  if (!data) return []
  const auditUsersName = []
  data.forEach((v, i) => {
    auditUsersName.push(v.approveFlag)
    auditUsersName.push(v.chainEmpName)
  })
  return auditUsersName.slice(1)
}

// 审批链数组转换为 带名字的 字符串
export const ApprovalChainTransitionStr = (data) => {
  if (!data) return []
  const auditUsersUm = []
  data.forEach((v, i) => {
    auditUsersUm.push(v.approveFlag)
    auditUsersUm.push(`${v.chainEmpName}(${v.chainUmId})`)
  })
  return auditUsersUm.slice(1)
}

export const imgType = ['image/jpeg', 'image/jpg', 'image/png']
// 缓存函数
export const cached = (fn) => {
  const data = {}
  return function (arg) {
    arg = JSON.stringify(arg)
    const con = data[arg]
    return con || (data[arg] = fn(JSON.parse(arg)))
  }
}

// 本地分页用的
export const localPaging = (list, form) => {
  if (list.length !== form.total) {
    form.total = list.length
  }
  let { currPage, pageSize, total } = form
  let start = (currPage - 1) * pageSize
  if (start >= total) {
    currPage = Math.ceil(total / pageSize)
    currPage = currPage > 0 ? currPage : 1
    start = (currPage - 1) * pageSize
    form.currPage = currPage
  }
  const end = Math.min(start + pageSize, total)
  return list.slice(start, end)
}
// 课程表讲师和课程类型
export const enumMap = {
  // 银行面授
  bank: '05002',
  // 外部面授
  interior: '05003',
  // 移动
  move: '05001',
  // 内部（银行）
  interiorBank: '01001',
  // 内部（非银行）
  interiorNotBank: '01000',
  // 外部讲师
  sansLecturer: '01002',
  // 无讲师
  notLecturer: '01003'
}

// 关闭当前页面
export const closeCurrPage = (name) => {
  
  if (!name) {
    const path = router.history.current.path
    name = allowKeepAlive[path].routerName
  }
  const title = $store.getters.keepAliveComponents.find((item) => item.routerName === name)?.title
  name = title || name
  const items = $(
    `.component-head__left__tags__item__content:contains(${name})`
  )
  const item = Array.from(items).find((v) => $(v).text().trim() === name)
  if (item) {
    setTimeout(() => {
      $(item).next().click()
    })
  }
}

// 判断某个 页面是否已打开
export const pageIsOpen = (name) => {
  const items = $(
    `.component-head__left__tags__item__content:contains(${name})`
  )
  const item = Array.from(items).find((v) => $(v).text().trim() === name)
  return !!item
}

// 关闭当前页面 并跳转到指定页面
export const closeCurrPageAndGoPath = (obj) => {
  if (typeof obj === 'string') {
    obj = { path: obj }
  }
  const { curr, path, params } = obj
  closeCurrPage(curr)
  // if (pageIsOpen(path)) return;
  name = addAllowKeepAlive(path)
  router.push({ name, params })
}

// 设置当前页面标题
export const setPageTitle = (name) => {
  const path = router.history.current.path
  allowKeepAlive[path].routerName = name
}

// 计算日期相差天数
export const numerationTimeFateDifference = (time1, time2) => {
  const seconds = new Date(time1) - new Date(time2)
  return Math.floor(seconds / 1000 / 60 / 60 / 24)
}

// 计算几天后的日期
export const numerationAfterwardsDays = (time1, days) => {
  const seconds = +new Date(time1) + days * 24 * 60 * 60 * 1000
  return formatDate(seconds)
}
// 计算几天前的日期
export const numerationBeforewardsDays = (time1, days) => {
  const seconds = +new Date(time1) - days * 24 * 60 * 60 * 1000
  return formatDate(seconds)
}

// 返回月份最后一天
export const lastDay = (time) => {
  if (!time) return ''
  const [year, month, day] = time.split('-')
  return [year, month, new Date(year, month, 0).getDate()].join('-')
}

// 防重复提交
export const throttle = (fn) => {
  let flag = false
  return function () {
    if (flag) return
    flag = true
    const result = fn.apply(this, arguments)
    if (result && typeof result.finally === 'function') {
      result.finally(() => {
        setTimeout(() => {
          flag = false
        }, 500)
      })
    } else {
      setTimeout(() => {
        flag = false
      }, 500)
    }
  }
}
//显示正确的文件大小
export const getRightFileSize = size=>{
  return size >= 1024*1024 ?  (size / 1024 / 1024 ).toFixed(2) + 'MB' :  Math.round(size / 1024 ) + 'KB'
}
// 开始时间变化
export const startTimeChange = ($event, row) => {
  $event = $event || '00:00:00'
  $event = $event.padEnd(8, ':00')
  row.endTimer = `${$event} - 23:59:59`
}
// 结束时间变化
export const endTimeChange = ($event, row, key) => {
  $event = $event || '23:59:59'
  $event = $event.padEnd(8, ':00')
  row.startTimer = `00:00:00 - ${$event}`
}
// tablecolumnfilters 组件过滤用的
export const commonFilter = ($event, form, key, cb, state, multiple) => {
  if (state === 'filter') {
    if (multiple) {
      form[key] = $event.list
    } else {
      form[key] = $event.list[0]
    }
  } else {
    form[key] = ''
  }
  if ('page' in form) {
    form.page = 1
  } else {
    form.currPage = 1
  }
  cb()
}

// 表格属性纵向合并方法 创建工具 暂不支持横向合并
export const createSpanMethod = (columnsMap, tableList) => {
  return function spanMethod({ row, column, rowIndex, columnIndex }) {
    if (columnsMap[columnIndex]) {
      let n = 1
      const key = columnsMap[columnIndex]
      if (row[key] !== (tableList[rowIndex - 1] || {})[key]) {
        tableList.slice(rowIndex + 1).some((v) => {
          if (row[key] === v[key]) {
            return !n++
          } else {
            return true
          }
        })
        return [n, 1]
      }
      return [0, 0]
    }
  }
}
// 获取标签map
export const getTagDict = (that) => {
  _axios
    .post(
      '/fn/course/tag/selectCourseTagsForReview',
      {
        data: {
          tagType: '2',
          blgStripLine: 'LS'
        }
      },
      jsonHeaders
    )
    .then((res) => {
      const { code, data } = res.data
      if (code === 0) {
        data.forEach((v) => {
          that.tagDict[v.tagId] = v.tagName
        })
      }
    })
}

// 卡片上移
export const upMove = (list, curr) => {
  const pre = list.find((v) => v.i === curr.i - 1)
  if (!curr || !pre) return
  ;[curr.top, pre.top, curr.i, pre.i] = [pre.top, curr.top, pre.i, curr.i]
}
// 卡片下移
export const downMove = (list, curr) => {
  const next = list.find((v) => v.i === curr.i + 1)
  if (!curr || !next) return
  ;[curr.top, next.top, curr.i, next.i] = [next.top, curr.top, next.i, curr.i]
}
// 疯转udmpid链接
export const handleCommonDownHref = () => {
  let str = ''
  if (process.env.VUE_APP_API_TYPE !== 'local') {
    // str = _axios.defaults.baseURL
    str = SERVER_BASEHOST
  }
  return `${str}/common/file/udmpDownLoadFileEx`
}

// 疯转udmpid链接
export const handleUdmpDownLoadFileExByAut = () => {
  let str = ''
  if (process.env.VUE_APP_API_TYPE !== 'local') {
    str = SERVER_BASEHOST
  }
  return `${str}/common/file/udmpDownLoadFileExByAut`
}

// 处理所有的udmp链接
export const handleUdmpHref = (udmp) => {
  // let str = _axios.defaults.baseurl
  let str = SERVER_BASEHOST
  // if (process.env.VUE_APP_API_TYPE !== "local") {
  //     str = _axios.defaults.baseURL;
  // }
  return `${str}/common/file/udmpDownLoadFileEx?udmpId=${udmp}`
}
// 根据value查找label
export const fromValueGetLabel = (options, value, props) => {
  const labelKey = props?.label || 'label'
  const valueKey = props?.value || 'value'
  const rtnKey = props?.rtnKey
  const result = options.find((v) => v[valueKey] === value)
  return rtnKey === false ? result : result?.[labelKey]
}

// 递归的查找值
export const deepSearchVal = (
  arr,
  value,
  { labelKey = 'label', valueKey = 'value', children = 'children' } = {
    labelKey: 'label',
    valueKey: 'value',
    children: 'children'
  }
) => {
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (item[valueKey] === value) return item
    if (!item[children]?.length) continue
    item = deepSearchVal(item[children], value, {
      labelKey,
      valueKey,
      children
    })
    if (item) return item
  }
}

// 处理时间
export const filterTime = (time) => {
  if (!time) return
  time = time.split('T')[0]
  time = time.split(' ')[0]
  return time
}
// 添加遮罩层
export const appendloading = (fn) => {
  return function (...args) {
    this.loading = this.$loading({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.6)'
    })
    $('.el-loading-spinner .el-icon-loading').replaceWith(`
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div ></div>
            </div>
        `)
    const p = fn.apply(this, args)
    if (p instanceof Promise) {
      p.finally(() => {
        this.loading.close()
      })
    } else {
      this.$nextTick(() => {
        this.loading.close()
      })
    }
  }
}
// 空函数
export const noop = (_) => _

// 两数相处并保留两位小数
export const divide = (num1, num2) => {
  if (parseFloat(num2) === 0) return 0
  return myRound(num1 / num2, 2)
}

// 秒转为 HH:MM:SS
export const secondToHour = (second) => {
  const s = second % 60
  const m = Math.floor(second / 60) % 60
  const h = Math.floor(second / 60 / 60)

  return `${(h + '').padStart(2, '0')}:${(m + '').padStart(2, '0')}:${(
    s + ''
  ).padStart(2, '0')}`
}

// HH:MM:SS 转为 秒
export const hourToSeconds = (hour) => {
  if (!hour) return 0
  let h, m, s
  h = m = s = 0
  const list = hour.split(':')
  s += parseInt(list.pop()) || 0
  m += parseInt(list.pop()) || 0
  h += parseInt(list.pop()) || 0
  return Math.floor(h * 3600 + m * 60 + s)
}
/**
 * 去掉对象中的空字符串
 * @param {Object} obj
 */
export const filterObj = (obj) => {
  obj = CopyObj(obj)
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string' && obj[key].trim() === '') {
      Reflect.deleteProperty(obj, key)
    }
  })
  return obj
}

// 根据 Y N 返回是否
export const YNMap = (str) => {
  return str === 'Y' ? '是' : str === 'N' ? '否' : str
}

// UM/姓名 远程搜索
export const querySearch = (queryString, cb) => {
  queryString = queryString?.trim()
  const data = { empName: queryString }
  _axios.post('/fn/user/listUserInfos', { data }, jsonHeaders).then((res) => {
    const { code, data } = res.data
    if (code === 0) {
      data.list.forEach((v) => {
        v.empName = `${v.empName}(${v.umId})`
      })
      cb(data.list)
    }
  })
}

// 匹配 宁贵町(ZHAOSHIYONG001) 形式的正则
export const personRe = /^([\u4e00-\u9fa5]+)\(([a-zA-Z0-9]+)\)$/
// 生成随机数
export const random = () => Date.now() + Math.floor(Math.random(1) * 100000)
// input 失焦转小数
export const transformFloat = (form, key) => {
  form[key] = myFloat(form[key]) + ''
}
// input 失焦转小数 不能小于0
export const transformFloatGt = (form, key) => {
  let num = form[key]
  num = myFloat(form[key]) || 0
  if (num < 0) num = 0
  form[key] = num + ''
}
/**
 * 对封装的_axios方法再做二次包装
 * 当后端返回code为0时认为是正确的返回，返回data数据
 * 否则认为失败，返回code和失败信息
 * 提供options对象，对于扩展内容可根据optins进行扩展添加逻辑
 * @param url String required 请求路径
 * @param params Object default:{} 入参
 * @param options Object default:{} 配置项
 * @param options: {
 *  header: {} 设置header，如果含有responseType字段，会被处理为下载模式
 *  allRes: boolean 设置为true的时候，会返回所有的接口数据，而不仅仅是data
 *  baseURL: url 如果有指定请求域的话，就不走默认域
 *  loading: string 指定需要显示loading的keyName
 * }
 * @param method String default:post 请示方法
 * @return Promise.resolve() | Promise.reject()
 */
export const httpServe = (url, params = {}, options = {}, method = 'post') => {
  // 边界
  if (!url || typeof url !== 'string') {
    throw new Error('路径是必传值, 且必须是字符串')
  }
  let isDownType = false
  let headers = jsonHeaders
  if (options.headers) {
    headers = Object.assign({}, jsonHeaders, options.headers)
    isDownType = Boolean(options.headers.responseType)
  }

  /**
   * 扩展1: 增加对于上传文件的进度监听，通过参数传入配置项进行判断
   * 扩展2: 由于要匹配不同域的请求，取消axios的baseUrl设置，通过拼接url的方式确定发送请求
   * bugfix: 需要对SERVER_BASEHOST进行判断，如果为/则不设置baseUrl, 走proxy-server
   */
  _axios.defaults.baseURL = ''
  url = options.baseURL ? `${options.baseURL + url}` : SERVER_BASEHOST !== '/' ? `${SERVER_BASEHOST + url}` : url
  /**
   * TODO: 这里可以通过loading状态进行拦截多次重复请求，影响范围较大，需要和产品确认是否进行功能开放
   * if (options.loading && getLoadingStatus(options.loading)) {
   *    console.warn('请求正在进行中，不进行二次请求')
   *    return Promise.reject()
   *  }
   * */
  if (options.loading) {
    // 设置VUEX
    $store.commit('app/updateLoadingStatus', { key: options.loading, status: true })
  }
  return new Promise((resolve, reject) => {
    _axios[method](url, params, { ...options, ...headers })
      .then((res) => {
        if (options.allRes) {
          return resolve(res)
        }
        if (isDownType) {
          if (res.data.type === 'application/json') {
            const reader = new FileReader()
            reader.onload = function (event) {
              var content = reader.result //内容就在这里
              if (Number(content.code) !== 0) {
                Message.error(JSON.parse(content).msg)
                return reject({ code: content.code, data: content.data })
              }
            }
            reader.readAsText(res.data)
          } else {
            handleBlob(res)
          }
          return
        }
        let { code, data, msg } = res.data
        if (Number(code) === 0) {
          return resolve(data)
        }
        return reject({ code, data, msg })
      })
      .finally(() => {
        options.loading && $store.commit('app/updateLoadingStatus', { key: options.loading, status: false })
      })
  })
}

export const fetchUdmpCodeToDownload = async (param) => {
  let res = await fetchDownTemplate(param)
  if (!res) {
    return Message.warning('没找到对应模板，请先配置模板')
  }
  const url = handleUdmpHref(res)
  window.location = url
}

/**
 * 文件下载适配器
 * 通过options参数判断，如果有指定的方法，则走指定的下载，否则走默认下载
 * 默认通过code查询到udmpid，再通过udmpid去进行文件下载
 */
export const downloadAdapter = (param = {}, opts = {}) => {
  if (opts.handler) {
    return window[handler](...param)
  }
  fetchUdmpCodeToDownload(param)
}

/**
 * 在研发环境下，需要将proxyConfig里的值与基础配置进行合并
 * 这里以proxyConfig['/']对象的unsetHost属性作为判断条件，如果为true, 则不从proxyConfig['/']中获取host
 * 避免多人研发下请求路径被反复替换 注：仅允许在研发环境下进行匹配
 * @param base Object default: {} 需要合并的基础对像
 * @return Object 返回匹配环境的不同路径映射表
 */
export const mergeHostHandle = (base = {}) => {
  // 边界
  if (base.constructor !== Object) {
    throw Error('类型错误: 参数需要是一个对象')
  }
  // 这个操作只允许在loacl模式下执行
  if (process.env.VUE_APP_API_TYPE !== 'local') {
    return `${window.location.origin}/tms-new/api`
  }
  let proxyConfigData = {}
  try {
    let { BASE_URL_HOST } = require('../../proxyConfig.js')
    BASE_URL_HOST && (proxyConfigData = BASE_URL_HOST)
    console.log('----代理配置导入成功----')
  } catch (error) {
    console.log(error, '----代理配置导入失败----')
  }

  let host = base.local
  if (proxyConfigData['target'] && !proxyConfigData.unsetHost) {
    host = proxyConfigData.target
  }
  base.local = host
  return host
}

export const uuid = () => {
  return 'xxxxxxxxxxxxyxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 校验两个时间是否在月份间隔内
 * @param interface options {
 *  startTime: 'yyyy-MM-dd',
 *  endTime: 'yyyy-MM-dd',
 *  month: number,
 * }
 *
 * @return boolean
 */
export const validateDiffMonth = (options) => {
  const { startTime, endTime, month } = options
  function diffMouth(value) {
    var d = new Date(value)
    // 因为getMonth()获取的月份的值只能在0~11之间所以我们在进行setMonth()之前先给其减一
    d.setMonth(d.getMonth() + month)
    var yy1 = d.getFullYear()
    var mm1 = d.getMonth() + 1
    var dd1 = d.getDate()
    if (mm1 < 10) {
      mm1 = '0' + mm1
    }
    if (dd1 < 10) {
      dd1 = '0' + dd1
    }
    return `${yy1}-${mm1}-${dd1}`
  }
  const diffData = diffMouth(startTime)
  return endTime.replace(/-/g, '') > diffData.replace(/-/g, '') > 0
}

export function getH5Url (pathSub) {
  // 案例专题：https://test-b-fat.pingan.com.cn/bsd/ams-rlm-tms-case-center/index.html#/special?zoneId=65
  // 知鸟专题：https://test-b-dev.pingan.com.cn/bsd/brmsd-ac-training-study-h5/aladdin/index.html#/CourseZone?id=11
  const baseUrl = process.env.VUE_APP_H5_URL
  const paramUrl = `${baseUrl}${pathSub}`
  // const params = `{"businessNo":"STUDY","data":{"url":"${paramUrl}"}}`
  // const h5Url = 'https://b.pingan.com.cn/iclientstore/aikemarket/html/banka/zhida/jump.html?jumpParam=' + encodeURIComponent(params)
  // return h5Url
  return paramUrl
}

export function copyH5Url (pathSub) {
  const h5Url = getH5Url(pathSub) 
  const inputDom = document.createElement('input')
  inputDom.setAttribute('value', h5Url)
  document.body.appendChild(inputDom)
  inputDom.select()
  document.execCommand('copy')
  document.body.removeChild(inputDom)
}

// 名称显示
export function renderName(name, umId) {
  if (!name && !umId) return ''
  if (name && umId) return `${name}(${umId})`
  if (name) return name
  if (umId) return umId
}

export { CopyObj, myRound, formatDate }

// img/default-special.40c7b5d5.png
export function getZoneImg (moduleImgId, flag, regDefault) {
  // const regDefault = new RegExp('^img/default-special.[0-9a-zA-Z]+.png$')
  if (moduleImgId) {
    return flag === 'href' && !regDefault.test(moduleImgId)  ? handleUdmpHref(moduleImgId) : moduleImgId
  } else {
    return require('@/assets/images/default-special.png')
  }
}
export function getSpecialImg (moduleImgId, flag) {
  const regDefault = new RegExp('^img/default-special.[0-9a-zA-Z]+.png$')
  return getZoneImg(moduleImgId, flag, regDefault)
}

// 格式化路径的query对像，用于在router之前
export function formatLocationQuery() {
  const hashValue = window.location.hash.split('?')
  if (!Array.isArray(hashValue) || !hashValue[1]) return {}
  const queryList = hashValue[1].split('&')
  const query = {}
  queryList.forEach((item) => {
    const itemList = item.split('=')
    query[itemList[0]] = itemList[1]
  })
  return query
}

/**
 * 根据key值获取loading状态
 * @params key: string 传入一个keyName
 * @params isSync: boolean 区分是否返回一个computed对像，为false则返回getters获取的值
 * @return Computed 返回一个computed对象，用于方便监听变更
 */
export function getLoadingStatus(key, isSync = false) {
  if(!key) throw new Error('没有检测到key值，key为必传')
  if (!isSync) return $store.getters['app/getLoadingFlags'](key)
  return computed(() => $store.getters['app/getLoadingFlags'](key))
}

/**
 * 防抖，一个时间段内只执行一次，重新触发会刷新延时时间
 * @param {function} fn 回调函数
 * @param {number} wait 延时时间，单位ms
 * @returns function
 */
export function debounce(fn, wait) {
  let timer = null
  return function() {
    if(timer) window.clearTimeout(timer)
    timer = window.setTimeout(fn, wait)
  }
}

/**
*
* @param {Number} H 色相 [0,360)
* @param {Number} S 饱和度 [0,1]
* @param {Number} L 亮度 [0,1]
* @param {Boolean} stringMode 是否返回字符串模式
*/
export function HSL2RGB(H = 0, S = 0, L = 0, stringMode = false) {
  const C = (1 - Math.abs(2 * L - 1)) * S
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1))
  const m = L - C / 2
  const vRGB = []
  if (H >= 0 && H < 60) {
  vRGB.push(C, X, 0)
  } else if (H >= 60 && H < 120) {
  vRGB.push(X, C, 0)
  } else if (H >= 120 && H < 180) {
  vRGB.push(0, C, X)
  } else if (H >= 180 && H < 240) {
  vRGB.push(0, X, C)
  } else if (H >= 240 && H < 300) {
  vRGB.push(X, 0, C)
  } else if (H >= 300 && H < 360) {
  vRGB.push(C, 0, X)
  }
  const [vR, vG, vB] = vRGB
  const R = Math.min(Math.floor(255 * (vR + m)), 255)
  const G = Math.min(Math.floor(255 * (vG + m)), 255)
  const B = Math.min(Math.floor(255 * (vB + m)), 255)

  if (stringMode) {
  return `rgb(${R},${G},${B})`
  }

  return { R, G, B }
}

export function optionsToObj (options, keyField = 'value') {
  if (!Array.isArray(options)) return null
  const resObj = {}
  options.forEach(m => {
    const label = m.label || m.text
    if (keyField === 'value') {
      resObj[m.value] = label
    } else {
      resObj[label] = m.value
    }
  })
  return resObj
}

/**
 * 数字转成汉字
 * TODO: 待优化
 * @params num === 要转换的数字
 * @return 汉字
 * */
export function toChinesNum(num) {
  /**
   * 获取中文
   * @param num
   * @returns {*}
   */
  var chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  var chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
  var chnUnitChar = ['', '十', '百', '千']
  function SectionToChinese(section) {
    var ori = section
    var strIns = ''
    var chnStr = ''
    var unitPos = 0
    var zero = true
    while (section > 0) {
      var v = section % 10
      if (v === 0) {
        if (!zero) {
          zero = true
          chnStr = chnNumChar[v] + chnStr
        }
      } else {
        zero = false
        strIns = chnNumChar[v]
        strIns += chnUnitChar[unitPos]
        chnStr = strIns + chnStr
      }
      unitPos++
      section = Math.floor(section / 10)
    }
    if (ori < 20) {
      chnStr = chnStr.replace('一十', '十')
    }
    return chnStr
  }

  var unitPos = 0
  var strIns = '',
    chnStr = ''
  var needZero = false

  if (num === 0) {
    return JsUlits.chnNumChar[0]
  }

  while (num > 0) {
    var section = num % 10000
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr
    }
    strIns = SectionToChinese(section)
    strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0]
    chnStr = strIns + chnStr
    needZero = section < 1000 && section > 0
    num = Math.floor(num / 10000)
    unitPos++
  }
  return chnStr
}


export const isEdge = function() {
  return navigator.userAgent.indexOf('Edge') > -1;
};

export const isFirefox = function() {
  return !!window.navigator.userAgent.match(/firefox/i);
};

export function rafThrottle(fn) {
  let locked = false;
  return function(...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(_ => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

export const isAudio = (path) => {
  return /\.(opus|flac|webm|weba|wav|ogg|m4a|mp3|oga|mid|amr|aiff|wma|au|aac)/.test(path && path.toLowerCase());
};

export const isVideo = (path) => {
  return /\.(mp4|avi|wmv|mpg|mpeg|mov|rm|ram|swf|flv)/.test(path && path.toLowerCase());
};

export const isImage = (path) => {
  return /\.(xbm|tif|pjp|svgz|jpg|jpeg|ico|tiff|gif|svg|jfif|webp|png|bmp|pjpeg|avif)/.test(path && path.toLowerCase());
};

export const isPreview = (path)=>{
  return /\.(pdf|png)/.test(path && path.toLowerCase());
}
/**
 * 判断当前系统是培训还是橙信系统设置对应参数
 */
export const systemConfigParameters = () => {
  const PAbank = {
    headLogo: require('@/assets/images/head-pa-bank-logo.png'),
    busiTypeMap: {
      LS: '零售',
      FL: '非零',
      JF: '金服'
    },
    busiTypeList: [{ busiType: 'LS' }, { busiType: 'FL' }, { busiType: 'JF' }],
    rootList: ['LS', 'FL'],
    defaultBusiType: 'LS'
  }
  const CX = {
    headLogo: require('@/assets/svg/head-CX-logo.svg'),
    busiTypeMap: {
      CX: '橙信'
    },
    busiTypeList: [{ busiType: 'CX' }],
    rootList: ['CX'],
    defaultBusiType: 'CX'
  }
  let systemName = process.env.VUE_APP_SYSTEM_CONFIG || 'PAbank'
  const systemConfig = {
    PAbank,
    CX
  }
  return systemConfig[systemName]
}