/**
 * UDMP相关的处理逻辑
 * 业务场景变更，上传文件由前端直接链接UDMP服务完成文件上传功能。
 * 基础步骤：
 * 1. 从后端获取上传必须的相关参数
 * 2. 判断文件大小，UDMP官方要求文件如果大于20M, 需要进行分片，分片大小要求小于等于4M
 * 3. 发起请求进行文件上传
 * 4. 进行文档确认，获取上传成功/失败状态
 *
 * 参考文档：http://wiki.pab.com.cn/pages/viewpage.action?pageId=1007948646
 */

// 由于UDMP要求不允许带cookie, 这里重新创建一个axios实例，用于处理UDMP上传
import { fetchUDMPDownload, fetchUDMPEnsureDoc, fetchUdmpReserve } from '@/fetch/public'
import axios from 'axios'
import { Message } from 'element-ui'
import { CopyObj, uuid } from './utils'
import { ref } from 'vue'
// UDMP对应域名写到环境变量去
const UDMP_HOST = process.env.VUE_APP_UDMP_SAVE_HOST
// 最大单文件阈值为20M, 超出这个大小，需要做文件片
const MAX_FILE_SIZE = 1024 * 1024 * 20
// 每个分片阈值为4M
const MAX_SPLIT_SIZE = 1024 * 1024 * 4
// 最大并发量，chrome同域最大并发量为6个请求，为了防止外部影响，这里做一次降级，同时并发5个请求
const MAX_CONCURRENCY_REQUEST = 5
const udmpInstance = axios.create({
  baseURL: '',
  withCredentials: false,
  timeout: 3 * 60 * 1000 // 文件设置超时时间三分钟
})

const isUploading = ref(false)

// 转码
const encode = function (str) {
  // 对字符串进行编码
  var encode = encodeURI(str)
  // 对编码的字符串转化base64
  var base64 = btoa(encode)
  return base64
}

/**
 * @description 文件内容信息集
 * fileInfosMap: Map<string, FileInfo>
 * interface FileInfo {
 *    fileUuid: string 现阶段用文件名(File.name)做id, 因为没有其他的业务字段可用
 *    file: File file文件对像
 *    status: pending|done|faild  对应待上传/成功/失败三种上传的状态
 *    uploadProgress: number 上传进度
 * }
 */
const fileInfosMap = new Map()

/**
 * @description 第一步需要先通过请求后端获取到对应的token
 * @param {*} files 待上传的文件
 * files: FileInfo<Array>
 * @param {*} options 预留属性，当前没有起作用
 * @param {*} bizdata 业务字段，要符合白名单, 参考 http://wiki.pab.com.cn/pages/viewpage.action?pageId=473437653
 */
const getUdmpToken = (files, options = {}) => {
  return new Promise((resolve, reject) => {
    let pages = []
    files.forEach((fileItem, i) => {
 // 由于当前无其他业务字段作为UDMP的bizdata对像的字段值，这里只能取uuid作为匹配的字段。
      // transaction_no: 这个业务字段是要匹配旧有逻辑，是必传的，值为待上传的文件名
      pages.push({ bizdata: { transaction_no: fileItem.fileUuid } })
    })
    const data = { pages, ...options }
    fetchUdmpReserve({data})
      .then(({ document, uptokens }) => {
        try {
          // 把返回数据拼到map中去
          document.pages.forEach((page, i) => {
            let item = fileInfosMap.get(page.bizdata.transaction_no)
            item.doc_id = document.doc_id
            item.token = uptokens[i]
            item.page_no = page.page_no
            item.key = `${document.doc_id}/${page.page_no}`
            item.fname = item.file.name
            updateFileInfo(page.bizdata.transaction_no, item)
          })
          return resolve()
        } catch (error) {
          console.error('失败了： ', error)
          return reject()
        }
      })
      .catch((e) => {
        console.error(e)
        return reject()
      })
  })
}

/**
 * @description 构建文件信息map
 * @param {*} files
 * files: FileInfo<Array>
 */
const createFilesMap = (files) => {
  // 重置
  fileInfosMap.clear()
  files.forEach((file) => {
    // 用name来当uuid用
    const fileUuid = file.file.name
    fileInfosMap.set(fileUuid, { fileUuid, ...file, status: 'pending', uploadProgress: 0 })
  })
}

/**
 * @description 小于20M的文件，可以直接发送上传
 * @param fileUuid file.name
 */
 const immediateUpload = (fileUuid) => {
    return new Promise((resolve, reject) => {
      // 从fileInfos取值
      const fileInfo = fileInfosMap.get(fileUuid)
      const data = new FormData()
      data.append('file', fileInfo.file)
      data.append('token', fileInfo.token)
      data.append('key', `${fileInfo.doc_id}/${fileInfo.page_no}`)
      data.append('fname', fileInfo.fname)
      udmpInstance({
        url: UDMP_HOST,
        data,
        method: 'post',
        headers: {
          'content-type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          fileInfo.uploadProgress = Math.max((progressEvent.loaded / progressEvent.total) * 100, 100)
          // 在请求未完成前，最大量只到99
          if (fileInfo.uploadProgress >= 99) fileInfo.uploadProgress = 99
        }
      })
        .then(({ data }) => {
          fileInfo.status = 'done'
          fileInfo.uploadProgress = 100
          updateFileInfo(fileInfo.fileUuid, fileInfo)
          resolve(data)
        })
        .catch((err) => {
          fileInfo.status = 'faild'
          updateFileInfo(fileInfo.fileUuid, fileInfo)
          reject(err)
        })
    })
  }
  
  /**
   * @description 做一个异步方法用于等待文件读取完成
   * @param file: File
   * @return Promise
   */
  const waitFileLoaded = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = async function () {
        return resolve(reader)
      }
      reader.onerror = function () {
        Message.warning('文件读取失败')
        return reject()
      }
    })
  }

/**
 * @description 构建fileChunks数据集
 * @param {*} reader 
 * reader: FileReader
 * @param {*} file 
 * file: File
 * @param {*} config 用于存储一些配置信息
 * config: { token: string }
 * @returns fileChunks
 * fileChunks: fileChunk<Array>
 * interface fileChunk {
 *  hash: number 分片文件下标,
 *  token: string 文件token，来源于文件预约
 *  chunk: FileReader.result.slice 分片文件
 *  chunkSize: number 分片文件大小
 * }
 */
 const createFileChunks = (reader, file, config = {}) => {
    const fileChunks = []
    let index = 0
    for (let curr = 0; curr < file.size; curr += MAX_SPLIT_SIZE) {
      const fileChunk = reader.result.slice(curr, curr + MAX_SPLIT_SIZE)
      fileChunk &&
        fileChunks.push({
          hash: index++,
          token: config.token,
          size: file.size,
          chunk: fileChunk,
          chunkSize: fileChunk.byteLength
        })
    }
    return fileChunks
  }
  
  /**
   * @description 分片文件批量上传
   * @param {*} fileChunks 
   * fileChunks: fileChunk<Array>
   * @param {*} fileUuid 
   * @returns Promise.resolve(ctxInfos)
   * ctxInfos: string<Array> 分片文件上下文字符串，用于文件合成接口
   */
  const chunksFileUpload = (fileChunks, fileUuid) => {
    return new Promise(async (resolve, reject) => {
      // 切块文件分批上传
      let ctxInfos = []
      for (let i = 0; i < fileChunks.length; i += MAX_CONCURRENCY_REQUEST) {
        const chunksFileInfos = fileChunks.slice(i, i + MAX_CONCURRENCY_REQUEST)
        chunksFileInfos = chunksFileInfos.map((chunkItem) => {
          return udmpInstance({
            url: `${UDMP_HOST}/mkblk/${chunkItem.chunkSize}`,
            data: chunkItem.chunk,
            method: 'POST',
            headers: {
              Authorization: `UpToken ${chunkItem.token}`,
              'Content-Type': 'application/octet-stream'
            }
          })
        })
        const chunkCtxRes = await Promise.all(chunksFileInfos).catch(() => {
          Message.warning('文件分片上传失败')
          return reject()
        })
        if (!chunkCtxRes) return reject()
        ctxInfos = ctxInfos.concat(chunkCtxRes.map((v) => v.data.ctx))
        const fileInfo = fileInfosMap.get(fileUuid)
        fileInfo.uploadProgress = Math.min(Math.floor(((i + MAX_CONCURRENCY_REQUEST) / fileChunks.length) * 100), 100)
        if (fileInfo.uploadProgress >= 99) fileInfo.uploadProgress = 99
        updateFileInfo(fileInfo.fileUuid, fileInfo)
      }
      resolve(ctxInfos)
    })
  }
  
  /**
   * @description 进行文件合并
   * @param {*} ctxInfos 
   * @param {*} fileUuid 
   * @returns Promise.resolve(unknow)
 */
   const mergeChunksFile = (ctxInfos, fileUuid) => {
    const fileInfo = fileInfosMap.get(fileUuid)
    const { file, token, key, fname } = fileInfo
    return new Promise((resolve, reject) => {
      const mergeUrl = `${UDMP_HOST}/mkfile/${file.size}/key/${encode(key)}/fname/${encode(fname)}/mimeType/${encode('application/octet-stream')}`
      // 文件合并
      udmpInstance({
        url: mergeUrl,
        data: ctxInfos.join(','),
        method: 'POST',
        headers: {
          Authorization: `UpToken ${token}`,
          'Content-Type': 'text/plain'
        }
      })
        .then(async (res) => {
          fileInfo.status = 'done'
          fileInfo.uploadProgress = 100
          updateFileInfo(fileInfo.fileUuid, fileInfo)
          return resolve(res.data)
        })
        .catch((error) => {
          Message.error(error)
          return reject(error)
        })
    })
  }
  
  /**
   * @description 分片上传。应用于大于20M的文件进行上传，都需要进行分片处理，切割为4m/片
   * 请求接口拉接规则：url: 请求路径/分片大小, body: 分片文件
   *
   * @description 分片上传结束之后，需要执行文件合并动作
   * @param fileUuid file.name
   */
  const handleSplitFile = (fileUuid) => {
    return new Promise(async (resolve, reject) => {
      const fileInfo = fileInfosMap.get(fileUuid)
      try {
        const { file, token, key, fname } = fileInfo
        const reader = await waitFileLoaded(file)
        // 创建文件分片信息
        const fileChunks = createFileChunks(reader, file, { token })
        // 上传分片
        const ctxInfos = await chunksFileUpload(fileChunks, fileUuid)
        // 合并分片
        const result = await mergeChunksFile(ctxInfos, fileUuid)
        // 文档确认
        await checkFileUploadStatus(fileUuid)
        return resolve(result)
      } catch (error) {
        fileInfo.status = 'faild'
        updateFileInfo(fileInfo.fileUuid, fileInfo)
        return reject()
      }
    })
  }

/**
 * @description 更新文件map信息
 * @param {*} id 
 * id: string 也就是fileUuid
 * @param {*} info 
 * info: FileInfo
 */
// updateId用于提供外部进行watch
const updateId = ref(0)
const updateFileInfo = (id, info) => {
  fileInfosMap.set(id, CopyObj(info))
  ++updateId.value
}

/**
 * @description 文档确认
 * @param {*} fileUuid 
 * @returns Promise.resolve(unknow)
 */
const checkFileUploadStatus = (fileUuid) => {
  return new Promise((resolve, reject) => {
    const fileInfo = fileInfosMap.get(fileUuid)
    const { doc_id } = fileInfo
    // status: 'successful|failed'
    const data = { docId: doc_id, status: 'successful' }
    fetchUDMPEnsureDoc({data})
      .then((res) => {
        if (res.pages.length) {
          return resolve(res)
        }
        Message.warning('上传失败')
        return reject()
      })
      .catch((error) => {
        Message.error(error)
        return reject()
      })
  })
}

/**
 * @description 总入口，通过调用这个方法来关联后面所有的UDMP流程
 * @param {*} files 待上传的文件
 * files: FileInfo<Array>
 * @param {*} options 预留属性，当前没有起作用
 * @param {*} bizdata 业务字段，要符合白名单, 参考 http://wiki.pab.com.cn/pages/viewpage.action?pageId=473437653
 */
const uploadFileToUdmp = (files, options = {}) => {
  return new Promise(async (resolve, reject) => {
    // 设置loading状态
    isUploading.value = true
    try {
      createFilesMap(files)
      const fileInfos = Array.from(fileInfosMap.values())
      await getUdmpToken(fileInfos, options)
      // 遍历文件，进行大小文件分流处理
      for (let index = 0; index < fileInfos.length; index++) {
        if (fileInfos[index].file.size < MAX_FILE_SIZE) {
          await immediateUpload(fileInfos[index].fileUuid)
        } else {
          await handleSplitFile(fileInfos[index].fileUuid)
        }
      }
      isUploading.value = false
      return resolve(Array.from(fileInfosMap.values()))
    } catch (error) {
      isUploading.value = false
      return reject(error)
    }
  })
}

/**
 * @description 文档下载
 * @param {*} doc_id
 * doc_id: string 也就是UDMP-id
 * @returns Promise.resolve(string|array)
 * 如果接口返回的只有一条，则直接返回下载链，否则透传接口返回信息
 */
 const fileDownload = (doc_id) => {
    return new Promise((resolve, reject) => {
      const data = { docId: doc_id, fileNameKey: 'transaction_no' }
      fetchUDMPDownload({data})
        .then((res) => {
          const result = res.pages.map((row) => row.download_url)
          if (result.length === 1) return resolve(result[0])
          return resolve(res)
        })
        .catch((error) => {
          Message.error(error)
          return reject()
        })
    })
  }
  
  // 抛出文件信息
  const getUdmpFileInfo = () => {
    return CopyObj(Array.from(fileInfosMap.values()))
  }
  
  export { getUdmpToken, uploadFileToUdmp, fileDownload, isUploading, updateId, getUdmpFileInfo }
        