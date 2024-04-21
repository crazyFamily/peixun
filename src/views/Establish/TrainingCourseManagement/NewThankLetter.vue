<template>
  <div class="establish__training-course-management">
    <!-- 标题区域 -->
    <el-card>
      <div class="between">
        <p class="title">您将对 <span class="active">{{ resultSet.toName }}</span> 讲师发送讲师{{ queryForm.letterType === 'thanksLetter' ? '感谢函' : '邀请函' }}</p>
        <div class="buttons">
          <el-button @click="handleBack" class="button-w70-h30">返回</el-button>
          <el-button @click="handleSave" class="button-w70-h30" type="primary">保存</el-button>
          <el-button v-if="!pageInitParam.onlyShowBtn" @click="handleSend" class="button-w70-h30" type="primary">发送</el-button>
        </div>
      </div>
    </el-card>
    <!-- 讲师区域 -->
    <el-card class="mt10">
      <el-tabs v-model="resultSet.activeName" @tab-click="navTabChangeHandle">
        <el-tab-pane
          v-for="(lecturer, index) in resultSet.invitationImgs"
          :key="`${index}${lecturer.teacherNo}${index}`"
          :label="lecturer.teacherName"
          :name="`${index}${lecturer.teacherNo}${index}`"
        >
          <div class="lecturer">
            <div class="left">
              <el-form
                class="content-form mt30"
                label-width="70px"
                :model="resultSet"
              >
                <el-form-item label="收件人" prop="sjr1">
                  <el-input
                    maxlength="50"
                    show-word-limit
                    placeholder="请输入收件人"
                    v-model="resultSet.sjr1"
                    :disabled="true"
                  />
                </el-form-item>
                <el-form-item label="抄送">
                  <div v-for="(item, index) in resultSet.csrSet" :class="index === resultSet.csrSet.length - 1 ? '' : 'mb10'" :key="index" style="display:flex;">
                    <el-autocomplete
                      class="w-full w-full-reset-css"
                      value-key="umIdNamePost"
                      placeholder="请输入抄送人"
                      :trigger-on-focus="false"
                      v-model="resultSet[`csr${index + 1}`]"
                      @select="selItem => handleUmSelect(index + 1, 'csr', selItem)"
                      :fetch-suggestions="(queryString, cb) => getPerson('csr', resultSet[`csr${index + 1}`], cb)"
                    />
                    <span class="active ml20 mr20" @click="delCsr(index)">删除</span>
                    <span class="active" @click="addCsr()">新增</span>
                  </div>
                </el-form-item>
                <el-form-item label="主题" prop="emailSubject">
                  <el-input
                    maxlength="50"
                    show-word-limit
                    placeholder="请输入主题"
                    v-model="resultSet.emailSubject"
                  />
                </el-form-item>
                <el-form-item :label="pageInitParam[queryForm.letterType] === '2' ? '评估报告' : '会邀'" prop="emailInvite">
                  <el-radio v-model="resultSet.emailInvite" label="N">不发送</el-radio>
                  <el-radio v-model="resultSet.emailInvite" label="Y">发送</el-radio>
                  <div style="display: inline-block;">
                    <span class="custom-btn active" @click="preview">预览</span>
                  </div>
                </el-form-item>
                <el-form-item label="样式" prop="emailStyle">
                  <el-radio v-model="resultSet.emailStyle" label="1">系统模版</el-radio>
                  <el-radio v-model="resultSet.emailStyle" label="2">自定义</el-radio>
                </el-form-item>
                <el-form-item v-show="resultSet.emailStyle === '1'" label="模版" prop="emailTemplate">
                  <gc-select
                    class="p0"
                    placeholder="请选择模版"
                    :options="options.templateEnum"
                    v-model="resultSet.emailTemplate"
                    :clearable="false"
                  />
                </el-form-item>
                <el-form-item v-show="resultSet.emailStyle === '1'"  label="标题" prop="emailTitle">
                  <el-input
                    type="textarea"
                    :rows="3"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                    maxlength="50"
                    show-word-limit
                    placeholder="请输入标题"
                    v-model="resultSet.emailTitle"
                  />
                </el-form-item>
                <el-form-item v-show="resultSet.emailStyle === '1'"  label="内容" prop="emailContent">
                  <el-input
                    type="textarea"
                    :rows="5"
                    :autosize="{ minRows: 5, maxRows: 10 }"
                    maxlength="200"
                    show-word-limit
                    placeholder="请输入内容"
                    v-model="resultSet.emailContent"
                  />
                </el-form-item>
                <el-form-item v-show="resultSet.emailStyle === '2'" label="图片" prop="enclosure">
                  <div class="inifo-container">
                    <div class="info-content">
                      <div class="banner-container">
                        <div style="display: flex; flex-wrap: wrap">
                          <div v-if="resultSet.emailImg" class="dfcc banner-item-container drop">
                            <template>
                              <img class="banner-item" :src="handleUdmpHref(resultSet.emailImg)" alt="" />
                            </template>
                            <div class="dfcc mask-container">
                              <i class="mask-icon el-icon-edit-outline" @click="showImgUpload" />
                              <i class="mask-icon el-icon-full-screen" @click="viewVoucherHook({ udmpId: resultSet.emailImg })" />
                              <i class="mask-icon el-icon-download" @click="dlVoucherHook({ udmpId: resultSet.emailImg })" />
                            </div>
                          </div>
                          <div>
                            <div v-show="!resultSet.emailImg" class="upload-container">
                              <gc-upload
                                :imgType="['jpg', 'png', 'jpeg']"
                                :max="9999"
                                :size="10000"
                                :show-file-list="false"
                                @input="files => imgUploadSuccess(files)"
                              />
                              <gc-upload
                                :imgType="['jpg', 'png', 'jpeg']"
                                ref="imgEditUploadRef"
                                :max="9999"
                                :size="10000"
                                :show-file-list="false"
                                style="transform: scale(0);position:absolute;"
                                @input="files => imgUploadSuccess(files)"
                              />
                              <p class="tintColor mt10 txt-css-reset">注意：仅支持 jpg、png、jpeg 等格式，文件大小不超过 10M</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="附件" prop="emailAttaches">
                  <div class="inifo-container">
                    <div class="info-content">
                      <div class="banner-container">
                        <div style="display: flex; flex-wrap: wrap">
                          <div class="dfcc banner-item-container drop" v-for="(item, index) in voucherHook.list" :key="`${item.udmpId}${index}`" :data-id="`${item.udmpId}${index}`">
                            <template v-if="isImgHook(item)">
                              <img class="banner-item" :src="handleUdmpHref(item.udmpId)" alt="" />
                            </template>
                            <template v-else>
                              {{ item.fileName }}
                            </template>
                            <div class="dfcc mask-container">
                              <i class="mask-icon el-icon-edit-outline" @click="showUploadHook(index, resultSet.activeIndex)" />
                              <i v-if="isImgHook(item)" class="mask-icon el-icon-full-screen" @click="viewVoucherHook(item)" />
                              <i class="mask-icon el-icon-download" @click="dlVoucherHook(item)" />
                              <i class="mask-icon el-icon-delete" @click="removeVoucherHook(index, resultSet)" />
                            </div>
                          </div>
                          <div>
                            <div v-show="voucherHook.list.length < 3" class="upload-container">
                              <gc-upload
                                :imgType="pageInitParam.imgType"
                                :max="9999"
                                :size="10000"
                                :show-file-list="false"
                                @input="files => uploadSuccessHook(files, resultSet, filesSuccessCB)"
                              />
                              <gc-upload
                                :imgType="pageInitParam.imgType"
                                ref="editUploadRefHook"
                                :max="9999"
                                :size="10000"
                                :show-file-list="false"
                                style="transform: scale(0);position:absolute;"
                                @input="files => editUploadSuccessHook(files, resultSet, filesSuccessCB)"
                              />
                              <p class="tintColor mt10 txt-css-reset">注意：仅支持 jpg、png、jpeg、pdf、text、txt、zip、gzip、excel、word、xmind 等格式，文件大小不超过 10M</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
              <div class="footer-box">
                <el-button class="button-w80-h30" type="primary" style="margin-left:70px;" @click="reset">重置</el-button>
              </div>
            </div>
            <div v-show="resultSet.emailStyle !== '2'" class="right img">
              <img :src="getTpl(resultSet.emailTemplate, lecturer.emailInviteThankInfo.invitationUmdpId)" alt="" />
              <div class="sysTemplate" :class="`${queryForm.letterType} ${resultSet.emailTemplate}`">
                <div class="email-title">{{ resultSet.emailTitle }}</div>
                <div class="email-content">
                  <p>{{ resultSet.emailContent }}</p>
                  <p>{{ resultSet.emailContent2 }}</p>
                  <p>{{ resultSet.emailContent3 }}</p>
                  <p v-show="pageInitParam[queryForm.letterType] === '2'" class="email-content4" style="margin-top:8%;">培训班项目组</p>
                  <p class="email-content4">{{ resultSet.emailContent4 }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import $ from 'jquery'
import { ref, reactive, onMounted, onActivated } from 'vue'
import { Message } from 'element-ui'
import { useRouter, useRoute } from '@/router'
import store from '@/store'
import { handleUdmpHref, addAllowKeepAlive, customHint, hintFrame } from '@/util/utils'
import { fetchGenerateInvitation, fetchFindUmIdInfo, fetchSaveEmailInviteThankInfo, fetchSendInvitation, fetchExportEvaByTeacherNoAndCourse } from '@/fetch/establish'

import { useEditYBLecturerHooks } from '@/views/TrainerManagement/YBLecturerManagement/hooks/useEditYBLecturerHooks'
const { voucherHook, showUploadHook, isImgHook, viewVoucherHook, dlVoucherHook, removeVoucherHook, uploadSuccessHook, editUploadRefHook, editUploadSuccessHook } = useEditYBLecturerHooks()

// 页面初始化参数
const pageInitParam = reactive({
  stateMap: {
    invitation: '创建邀请函',
    thanksLetter: '创建感谢函',
    thanksLetterLook: '查看感谢函',
    invitationLook: '查看邀请函'
  },
  invitation: '1', // 邀请函
  thanksLetter: '2', // 感谢函
  state: '',
  onlyShowBtn: false,
  shouldShowInviteMeetBtn: false,
  weekMap: {
    day1: '周日',
    day2: '周一',
    day3: '周二',
    day4: '周三',
    day5: '周四',
    day6: '周五',
    day7: '周六',
  },
  imgType: ['jpg','jpeg','png','pdf','rtf','plain','zip','x-zip-compressed','x-gzip','gzip','msword','vnd.openxmlformats-officedocument.wordprocessingml.document','xls','vnd.ms-excel','vnd.openxmlformats-officedocument.spreadsheetml.sheet','vnd.ms-powerpoint','vnd.openxmlformats-officedocument.presentationml.presentation','xmind','vnd.xmind.workbook','wps-office.xls','wps-office.xlsx']
})
// 发送时所需参数，静态数据
const sendParam = reactive({
  classId: '',
  realManagerUmId: '',
  realManager: '',
  blgStripLine: '',
  letterType: '',
  toName: '',
  selectedIds: []
})

const options = reactive({
  templateEnum: [
    // { label: '模版一', value: 'sysTemplate1' },
    // { label: '模版二', value: 'sysTemplate2' },
    // { label: '模版三', value: 'sysTemplate3' },
    // { label: '模版四', value: 'sysTemplate4' },
    // { label: '模版五', value: 'sysTemplate5' },
    // { label: '模版六', value: 'sysTemplate6' },
    // { label: '模版七', value: 'sysTemplate7' },
    // { label: '模版八', value: 'sysTemplate8' },
    // { label: '模版九', value: 'sysTemplate9' },
    // { label: '模版十', value: 'sysTemplate10' }
  ]
})

const queryForm = reactive({
  classId: '',
  blgStripLine: '',
  letterType: '',
  courseList: ''
})
onActivated(() => {
  const params = useRoute().params
  if (params.state) {
    queryForm.classId = params.classId
    queryForm.blgStripLine = params.blgStripLine
    queryForm.letterType = params.type
    queryForm.courseList = params.courseList

    sendParam.classId = params.classId
    sendParam.blgStripLine = params.blgStripLine
    sendParam.letterType = params.type

    pageInitParam.state = params.state
    pageInitParam.onlyShowBtn = params.onlyShowBtn
    pageInitParam.shouldShowInviteMeetBtn = params.shouldShowInviteMeetBtn
    let letterType = params.type
    if (pageInitParam.onlyShowBtn) {
      letterType += 'Look'
    }
    // console.log('params.....', params)
    store.commit('setRouteTitle', pageInitParam.stateMap[letterType])
  }
  getList()
})

const resultSet = reactive({
  toName: '',
  invitationImgs: [], // 总数据
  activeName: '', // tab 活动数据
  activeIndex: '1', // tab 活动下标
  sjrSet: [], // 收件人
  sjr1: '',
  csrSet: [{ teacherName: '', teacherNo: '', teacherUm: '' }], // 抄送
  csr1: '', csr2: '', csr3: '', csr4: '', csr5: '', csr6: '', csr7: '', csr8: '', csr9: '', csr10: '',
  emailSubject: '', // 主题
  emailInvite: 'N', // 会邀
  emailStyle: '1', // 样式
  emailTemplate: 'sysTemplate1', // 模版
  emailTitle: '', // 标题
  emailContent: '', // 内容
  emailContent2: '',
  emailContent3: '',
  emailContent4: '',
  emailImg: '', // 自定义图片
  fileId: '',
  emailAttaches: [], // 附件
})
// 重置抄送人数据
const resetCsr = () => {
  resultSet.csrSet = []
  for (let i = 1; i < 11; i++) {
    resultSet[`csr${i}`] = ''
  }
}
// 获取内容
const getList = async () => {
  const { toName, realManagerUmId, realManager, selectedIds, invitationImgs, courseList } = await fetchGenerateInvitation({ data: queryForm })
  sendParam.toName = toName
  sendParam.realManagerUmId = realManagerUmId
  sendParam.realManager = realManager
  sendParam.selectedIds = selectedIds
  resultSet.toName = toName
  resultSet.invitationImgs = invitationImgs || []
  queryForm.courseList = courseList || queryForm.courseList
  resetCsr()
  currPersonData(0)
  handleUmSelect(1, 'sjr', invitationImgs[0].emailInviteThankInfo)
}

// 抄送人处理
const handleCsr = list => {
  if (list?.length > 0) {
    list.map((item, index) => handleUmSelect(index + 1, 'csr', { teacherName: item.teacherName, teacherUm: item.teacherUm || item.teacherNo }))
  } else {
    resultSet.csrSet = [{ teacherName: '', teacherNo: '', teacherUm: '' }]
  }
}
// 模版个数处理
const handleTpl = ids => {
  let idArr = ids.split(',')
  let arr = []
  idArr.map((item, index) => arr.push({ label: `模版 ${index + 1}`, value: `sysTemplate${index + 1}` }))
  options.templateEnum = arr
}
// 附件处理
const handleAttaches = eas => {
  const lenBool = eas?.length > 0
  voucherHook.list = lenBool ? eas : []
  resultSet.emailAttaches = lenBool ? eas : []
}

const currPersonData = index => {
  resultSet.activeIndex = index || '0'
  let info = resultSet.invitationImgs[index].emailInviteThankInfo || {}
  const { teacherNo, emailCcList, emailSubject, emailInvite, emailStyle, invitationUmdpId, emailTemplate, emailTitle, emailContent, emailContent2, emailContent3, emailContent4, emailImg, emailAttaches } = info
  resultSet.activeName = `${resultSet.activeIndex}${teacherNo}${resultSet.activeIndex}`
  handleCsr(emailCcList)
  resultSet.emailSubject = emailSubject || ''
  resultSet.emailInvite = emailInvite || 'N'
  resultSet.emailStyle = emailStyle || '1'
  handleTpl(invitationUmdpId)
  resultSet.emailTemplate = emailTemplate || 'sysTemplate1'
  resultSet.emailTitle = emailTitle || ''
  resultSet.emailContent = emailContent || ''
  resultSet.emailContent2 = emailContent2 || ''
  resultSet.emailContent3 = emailContent3 || ''
  resultSet.emailContent4 = emailContent4 || ''
  resultSet.emailImg = emailImg || ''
  handleAttaches(emailAttaches)
}

// 获取模版
const getTpl = (tpl, ids) => {
  // console.log('.....', tpl, ids)
  let idArr = ids.split(',')
  let idx = tpl.slice(11)
  return handleUdmpHref(idArr[idx - 1])
}

// 返回，原有逻辑
const backFn = () => {
  let letterType = queryForm.letterType
  if (pageInitParam.onlyShowBtn) {
    letterType += 'Look'
  }
  const items = $(`.component-head__left__tags__item__content:contains(${pageInitParam.stateMap[letterType]})`)
  const item = Array.from(items).find(v => $(v).text().trim() === pageInitParam.stateMap[letterType])
  if (item) {
    $(item).next().click()
  } else {
    addAllowKeepAlive('/TrainingCourseManagement')
    useRouter().push({ name: '培训班管理' })
  }
}
const handleBack = () => {
  hintFrame('当前内容未保存，是否确定返回？').then(() => {
    backFn()
  })
}
// 置换数据，进行同步
const makeDataSame = () => {
  let info = resultSet.invitationImgs[resultSet.activeIndex].emailInviteThankInfo || {}
  info.emailCcList = resultSet.csrSet.filter(item => (item.teacherName && (item.teacherNo || item.teacherUm)))
  info.emailSubject = resultSet.emailSubject
  info.emailInvite = resultSet.emailInvite
  info.emailStyle = resultSet.emailStyle
  info.emailTemplate = resultSet.emailTemplate
  info.emailTitle = resultSet.emailTitle
  info.emailContent = resultSet.emailContent
  info.emailImg = resultSet.emailImg
  info.emailAttaches = resultSet.emailAttaches
}
// 保存
const handleSave = async () => {
  makeDataSame()
  let data = []
  resultSet.invitationImgs.map(item => {
    item.emailInviteThankInfo.emailType = pageInitParam[queryForm.letterType]
    data.push(item.emailInviteThankInfo)
  })
  await fetchSaveEmailInviteThankInfo({ data })
  Message.success('保存成功')
}
// 发送
const handleSend = async () => {
  makeDataSame()
  let invitationImgs = []
  resultSet.invitationImgs.map(item => {
    item.emailInviteThankInfo.emailType = pageInitParam[queryForm.letterType]
    invitationImgs.push({
      emailInviteThankInfo: item.emailInviteThankInfo,
      isEvaluate: item.isEvaluate,
      isEvaluated: item.isEvaluated,
      courseOids: item.courseOids
    })
  })
  const data = { ...sendParam, invitationImgs }
  const { failCount, succCount, failContent } = await fetchSendInvitation({ data })
  if (failCount > 0) {
    const msg = `<div>${succCount} 条数据发送成功，${failCount} 条数据发送失败，原因如下：</div><div>${failContent}</div>`
    customHint(msg, '提示', '', false, '确定', '').then(() => {
      backFn()
    })
  } else {
    Message.success('发送成功')
    setTimeout(() => {
      backFn()
    }, 1500)
  }
}

// 人员切换
const navTabChangeHandle = ({ index }) => {
  makeDataSame()
  resetCsr()
  currPersonData(index)
  handleUmSelect(1, 'sjr', resultSet.invitationImgs[index].emailInviteThankInfo)
}

// 收件人搜索
const getPerson = (type, teacherNo, cb) => {
  fetchFindUmIdInfo({ data: { umOrName: teacherNo } }).then(res => {
    if (!res) return
    cb && cb(res)
  })
}

// 收件人搜索数据选择
const handleUmSelect = (idx, type, item) => {
  // console.log('idx, type, item.....', idx, type, item)
  const teacherName = item.teacherName
  const teacherUm = item.teacherUm || item.teacherNo
  const teacherNo = teacherUm

  // 抄送人去重处理
  let arr = type === 'csr' ? resultSet[`${type}Set`].filter(item => (item.teacherUm === teacherUm || item.teacherUm === teacherNo || item.teacherNo === teacherUm || item.teacherNo === teacherNo)) : []
  if (arr.length) {
    resultSet[`${type}${idx}`] = ''
    return Message.error('您已选择过该抄送人，请重新输入')
  }

  if (resultSet[`${type}${idx}`]) { // 替换
    let obj = resultSet[`${type}Set`][idx - 1]
    obj.teacherName = teacherName
    obj.teacherUm = teacherUm
    obj.teacherNo = teacherUm
  } else { // 新增
    resultSet[`${type}Set`].push({ teacherName, teacherUm, teacherNo })
  }
  resultSet[`${type}${idx}`] = (teacherName && teacherUm) ? `"${teacherName}" <${teacherUm}@pingan.com.cn>` : '' // 渲染
}
// 删除抄送人
const delCsr = index => {
  if (resultSet.csrSet.length === 1) {
    if (resultSet.csr1) {
      resultSet.csrSet[0] = { teacherName: '', teacherUm: '', teacherNo: '' }
      resultSet.csr1 = ''
      return Message.success('已清空该项')
    }
    return Message.error('无法删除，请正确操作！')
  }
  resultSet.csrSet.splice(index, 1)
  for (let i = 1; i < 11; i++) { // 提前清空抄送人数据
    resultSet[`csr${i}`] = ''
  }
  resultSet.csrSet.map((item, index) => {
    if (item.teacherName && (item.teacherUm || item.teacherNo)) {
      resultSet[`csr${index + 1}`] = `"${item.teacherName}" <${item.teacherUm || item.teacherNo}@pingan.com.cn>`
    }
  })
}
// 新增抄送人
const addCsr = () => {
  if (resultSet.csrSet.length === 10) {
    return Message.error('无法新增，已达到上限，最多10人！')
  }
  resultSet.csrSet.push({ teacherName: '', teacherNo: '', teacherUm: '' })
}

// 预览
const preview = async () => {
  if (pageInitParam[queryForm.letterType] === '2') { // 评估报告
    if (resultSet.emailInvite !== 'Y') {
      return Message.error('抱歉，评估报告只有选择发送方可进行预览')
    }
    let { classId, teacherNo, courseName, isEvaluate, isEvaluated, courseOid, className } = resultSet.invitationImgs[resultSet.activeIndex]
    if (isEvaluate !== 'Y' || isEvaluated !== 'Y') {
      return Message.error('未发起评估，没有生成评估报告，请先发起评估')
    }
    let data = { classId, teacherNo, courseName, isEvaluate, isEvaluated, courseOid, className }
    await fetchExportEvaByTeacherNoAndCourse({ data })
    return Message.success('下载成功')
  }
  // 会邀
  let sjr = resultSet.sjrSet[0] // 注意此处，括号会被识别为 html 标签，需要转义
  let obj = queryForm.courseList[resultSet.activeIndex]
  let content  = `
    <br /><div>收件人："${sjr.teacherName}" &#60;${sjr.teacherNo || sjr.teacherUm}@pingan.com.cn&#62;</div>
    <div>时<span style="opacity:0;">隐</span>间：${pageInitParam.weekMap[`day${obj.week}`]} ${obj.courseDate} ${obj.startHour}:${obj.startMin}-${obj.endHour}:${obj.endtMin}</div>
    <div>地<span style="opacity:0;">隐</span>点：${obj.trainAddress}</div>
    <div>正<span style="opacity:0;">隐</span>文：诚邀您在 ${obj.className} 培训班中进行授课</div>
  `
  customHint(content, '预览会邀', '', false, '关闭', '')
}

// 自定义图片上传处理
const imgEditUploadRef = ref(null)
const showImgUpload = () => {
  imgEditUploadRef.value[resultSet.activeIndex].uploadInstance().$el.querySelector('.el-upload').click()
}
const imgUploadSuccess = files => {
  const len = files.length
  if (len) {
    const file = files[len - 1]
    resultSet.emailImg = file.udmpId
    resultSet.invitationImgs[resultSet.activeIndex].emailInviteThankInfo.emailImg = file.udmpId
    // console.log('imgUploadSuccess.....', resultSet)
  }
}

// 附件上传成功后回调
const filesSuccessCB = () => {
  resultSet.emailAttaches = resultSet.fileId
  resultSet.invitationImgs[resultSet.activeIndex].emailInviteThankInfo.emailAttaches = resultSet.fileId
  // console.log('filesSuccessCB.....', resultSet)
}

const reset = () => {
  hintFrame('是否确定重置所有填写内容？').then(async () => {
    await getList()
    Message.success('重置成功')
  })
}
</script>
<script>
export default { name: 'NewThankLetter' }
</script>

<style lang="scss">
// @font-face {
//   font-family: 'panct-bold';
//   src: url('./../../../assets/fonts/PingAnNuanChengTi_bate21_Bold.ttf') format('truetype');
// }

// @font-face {
//   font-family: 'panct-light';
//   src: url('./../../../assets/fonts/PingAnNuanChengTi_bate21_Light.ttf') format('truetype');
// }

// @font-face {
//   font-family: 'panct-regular';
//   src: url('./../../../assets/fonts/PingAnNuanChengTi_bate21_Regular.ttf') format('truetype');
// }

.establish__training-course-management {
  .left-span {
    width: 48px;
    margin-right: 20px;
    color: $shallow;
  }
  .items {
    margin-left: 30px;
    .item {
      height: 26px;
      &:nth-child(n + 2) {
        margin-top: 16px;
      }
      .name {
        color: $title1Color;
        font-size: $fz14;
      }
    }
  }
  .lecturer {
    display: flex;
    .left {
      width: calc(100% - 650px);
      padding-right: 5%;
      // width: 100%;
      .w-full-reset-css {
        width: calc(100% - 90px) !important;
      }
    }
    .right.img {
      width: 650px;
      // display: none;
      position: relative;
      > img {
        width: 100%;
      }
      .sysTemplate {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        font-weight: bold;
        // font-family: serif;
        font-family: "cursive";
        // font-family: "Kai";
        // font-family: 'panct-bold';
        // font-family: 'panct-light';
        // font-family: 'panct-regular';
        .email-title {
          font-size: 2rem;
          text-align: center;
          position: absolute;
          width: 100%;
          top: 80px;
        }
        .email-content {
          // font-size: .8rem;
          font-size: 13px;
          color: #3d362c;
          position: absolute;
          width: calc(100% - 228px);
          margin: 0 114px;
          top: 242px;
          text-indent: 2em;
          line-height: 20px;
          text-align: justify;
          // font-weight: bold;
          .email-content4 {
            text-align: right;
          }
        }
        &.invitation {
          // .email-content {
          //   overflow: hidden;
          //   -webkit-line-clamp: 5;
          //   display: -webkit-box;
          //   -webkit-box-orient: vertical;
          // }
        }
        &.thanksLetter {}
        &.sysTemplate7, &.sysTemplate8 {
          .email-title {
            top: 172px;
          }
          .email-content {
            top: 332px;
          }
        }
      }
    }
  }
  .inviteMeet-checkbox {
    .el-checkbox__label {
      color: #fd6720;
    }
    .el-checkbox__inner {
      border-color: #fd6720;
    }
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      border-color: #dcdfe6;
    }
  }
}
// 解决图片放大时候没有滚动条的问题
.el-message-box.upload-file-error {
  height: 80% !important;
  .el-message-box__content {
    height: calc(100% - 98px);
    overflow-y: auto;
    padding-top: 10px;
  }
  .el-message-box__btns {
    padding-top: 18px;
  }
}
</style>

<style lang="scss" scoped>
@import './uploadVoucher.scss';

.el-tabs__content .el-tab-pane {
  overflow-x: auto;
}

.lecturer {
  .left {
    min-width: 500px;
  }
  .right.img {
    min-width: 650px;
  }
}

</style>
