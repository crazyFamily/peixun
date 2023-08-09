<template>
  <div class="CaseCenter__addCase">
    <!-- 进度条 -->
    <gcSteps :active="active" :list="stepList"></gcSteps>

    <!-- 内容 -->
    <div class="content-box">
      <div v-show="active === 0" class="base-info">
        <el-form
          class="content-form"
          ref="baseInfoFormRef"
          :model="baseInfoForm"
          :rules="baseInfoRules"
          label-width="100px"
        >
          <el-form-item label="案例名称" prop="caseName">
            <el-input
              :maxlength="50"
              show-word-limit
              v-model="baseInfoForm.caseName"
            ></el-input>
          </el-form-item>
          <el-form-item label="一句话简介" prop="briefIntroduction">
            <el-input
              :maxlength="50"
              show-word-limit
              v-model="baseInfoForm.briefIntroduction"
            ></el-input>
          </el-form-item>
          <el-form-item label="案例缩略图" prop="thumbnail">
            <div class="df">
              <gc-upload
                single
                :size="200"
                :udmpId.sync="baseInfoForm.thumbnail"
              ></gc-upload>
              <div class="tintColor ml10">
                <p>1.建议图片尺寸为（200*200px），可按比例调整尺寸</p>
                <p>2.格式为jpg或png</p>
                <p>3.图片不能大于200KB</p>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="案例所属组织" prop="belongOrg">
            <!-- <el-cascader
              class="wfull belongOrg"
              clearable
              v-model="baseInfoForm.belongOrg"
              :options="belongOrgOptions"
              :props="{
                value: 'orgId',
                label: 'orgName',
                lazy: true,
                lazyLoad
              }"
              @visible-change="visibleChange"
            ></el-cascader> -->
            <gc-institution
             :orgUrl="fetchListCasePushBelongOrgs"
              :leftShow="false"
              :isbranch="true"
              :defaultShow="state === 'edit' && !orgIds.length"
              v-model="orgIds"
              busiType="LS"
              ref="institutionRef"
              width="400px"
              :allow-invented="false"
            ></gc-institution>
          </el-form-item>
          <el-form-item  prop="shareStatus">
            <div slot="label" class="aic">共享设置
              <el-tooltip placement="bottom" popper-class="table-popper" effect="light">
                <div slot="content" style="width: 300px">
                  <p class="mt5">共享：其他管理员也可查看、推送此案例</p>
                  <p class="mt5">不共享：仅自己和上级机构管理员可查看、推送此案例</p>
                </div>
                <i class="el-icon-question active"></i>
              </el-tooltip>
            </div>
            <el-radio-group v-model="baseInfoForm.shareStatus">
              <el-radio label="Y">共享</el-radio>
              <el-radio label="N">不共享</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- <select-person-item
            :importId="baseInfoForm.importId"
            :crowdBatchId="baseInfoForm.crowdBatchId"
            :crowdOrgs="baseInfoForm.crowdOrgs"
            @comfirm="comfirmSelectPerson"
            ref="selectPersonItemRef" /> -->
          <set-crowd-item
            :importId="baseInfoForm.importId"
            :crowdBatchId="baseInfoForm.crowdBatchId"
            :crowdOrgs="baseInfoForm.crowdOrgs"
            @comfirm="comfirmSetCrowd" />
          <el-form-item v-for="(item,i) in baseInfoForm.makePersonList" :key="`make${i}`"
            :prop="`makePersonList.${i}.umId`"
            :rules="{ required: true, message: `制作人${i+1}不能为空`, trigger: 'blur' }">
            <div slot="label" class="aic">
              <div v-if="i === 0">
                <span>制作人</span>
                <el-tooltip placement="bottom" popper-class="table-popper" effect="light">
                  <ul slot="content" style="line-height: 22px;">
                    <li class="mt5" style="list-style: inside;">录入行编人员时，可根据UM号、姓名进行检索，选择后自动填充姓名、UM号</li>
                    <li class="mt5" style="list-style: inside;">录入非行编人员时，UM号、姓名都需要手动输入，不能为空</li>
                  </ul>
                  <i class="el-icon-question active"></i>
                </el-tooltip>
             </div>
            </div>
            <div>
              <div class="df">
                <template v-if="item.isEx">
                  <el-input class="w-120" 
                    v-model="item.umId" 
                    placeholder="UM号" 
                    :ref="`makeumId${i}Ref`"
                    @blur="exPersonBlur('make', i, 'umId')"/>
                  <el-input class="ml10" 
                    style="width:70px;"
                    v-model="item.umName" 
                    placeholder="姓名" 
                    :ref="`makeumName${i}Ref`"
                    @blur="exPersonBlur('make', i, 'umName')"/>
                </template>
                <template v-else>
                  <el-autocomplete
                    class="w-200"
                    value-key="label"
                    placeholder="请输入UM号/姓名"
                    :trigger-on-focus="false"
                    v-model="item.label"
                    :fetch-suggestions="querySearch"
                    :ref="`makePersonSelect${i}Ref`"
                    @select="personSelect('make', i, $event)"
                  />
                </template>
                <el-button @click="deletePerson('make', i)" class="button-50-30 button-my-primary-plain ml10"
                  :disabled="baseInfoForm.makePersonList.length === 1" >移除</el-button>
                <el-button @click="addPerson('make', i)" class="button-100-30 button-my-primary-plain ml10" 
                  :disabled="baseInfoForm.makePersonList.length >= 3">添加行编</el-button>
                <el-button @click="addPerson('make', i, true)" class="button-100-30 button-my-primary-plain ml10" 
                  :disabled="baseInfoForm.makePersonList.length >= 3">添加外包</el-button>
                <p v-if="i === 0" class="ml10 tintColor">最多可添加3人</p>
              </div>
              <div class="shareUserList-msg" v-if="personPageData.makeMsgList[i]">
                <span>{{showPersonMsg('make', i)}}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item v-for="(item,i) in baseInfoForm.sharePersonList" :key="`share${i}`"
            :prop="`sharePersonList.${i}.umId`"
            :rules="{ required: true, message: `分享人${i+1}不能为空`, trigger: 'blur' }">
            <div slot="label" class="aic">
              <div v-if="i === 0">
                <span>分享人</span>
               <el-tooltip placement="bottom" popper-class="table-popper" effect="light">
                  <ul slot="content" style="line-height: 22px;">
                    <li class="mt5" style="list-style: inside;">录入行编人员时，可根据UM号、姓名进行检索，选择后自动填充姓名、UM号</li>
                    <li class="mt5" style="list-style: inside;">录入非行编人员时，UM号、姓名都需要手动输入，不能为空</li>
                  </ul>
                  <i class="el-icon-question active"></i>
                </el-tooltip>
              </div>
            </div>
            <div>
              <div class="df">
                <template v-if="item.isEx">
                  <el-input class="w-120" 
                    v-model="item.umId" 
                    placeholder="UM号" 
                    :ref="`shareumId${i}Ref`"
                    @blur="exPersonBlur('share', i, 'umId')"/>
                  <el-input class="ml10" 
                    style="width:70px;"
                    v-model="item.umName" 
                    placeholder="姓名" 
                    :ref="`shareumName${i}Ref`"
                    @blur="exPersonBlur('share', i, 'umName')"/>
                </template>
                <template v-else>
                  <el-autocomplete
                    class="w-200"
                    value-key="label"
                    placeholder="请输入UM号/姓名"
                    :trigger-on-focus="false"
                    v-model="item.label"
                    :fetch-suggestions="querySearch"
                    :ref="`sharePersonSelect${i}Ref`"
                    @select="personSelect('share', i, $event)"
                  />
                </template>
                <el-button @click="deletePerson('share', i)" class="button-50-30 button-my-primary-plain ml10"
                  :disabled="baseInfoForm.sharePersonList.length === 1" >移除</el-button>
                <el-button @click="addPerson('share', i)" class="button-100-30 button-my-primary-plain ml10" 
                  :disabled="baseInfoForm.sharePersonList.length >= 3">添加行编</el-button>
                <el-button @click="addPerson('share', i, true)" class="button-100-30 button-my-primary-plain ml10" 
                  :disabled="baseInfoForm.sharePersonList.length >= 3">添加外包</el-button>
                <p v-if="i === 0" class="ml10 tintColor">最多可添加3人</p>
              </div>
              <div class="shareUserList-msg" v-if="personPageData.shareMsgList[i]">
                <span>{{showPersonMsg('share', i)}}</span>
              </div>
           </div>
          </el-form-item>
          <el-form-item label="案例分类" prop="businessLine">
            <gc-select class="w-200" :options="caseClassifyOptions" @change="changeCaseClassify" v-model="baseInfoForm.businessLine"></gc-select>
          </el-form-item>
          <el-form-item label="案例标签" prop="tagName">
            <CurriculumLabel
              ref="curriculumLabelRef"
              :courseTag="baseInfoForm.tagName"
              :tree="caseTagOptions"
              @change="
                courseTagChange(
                  $event,
                  'baseInfoForm',
                  'baseInfoFormRef'
                )
              "
              :preced-rules="labelPrecedRules"
            >
            </CurriculumLabel>
          </el-form-item>
          <el-form-item label="案例关键字" prop="keyWords">
            <div class="df">
              <div
                v-for="(keyWord, i) in baseInfoForm.keyWords"
                :key="i"
                class="w-120 keyword"
                :class="{ ml10: i !== 0 }"
              >
                <el-input
                  ref="keyWord"
                  v-model.trim="keyWord.value"
                  :maxlength="8"
                  placeholder="最多8个字符"
                >
                  <i
                    slot="suffix"
                    class="icon__close"
                    @click="delKeyWord(i)"
                  ></i>
                </el-input>
              </div>

              <el-button
                @click="addKeyWord"
                class="button-50-30 button-my-primary-plain ml10 fs0"
                >添加</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active === 1" class="case-content">
        <el-form
          class="content-form"
          ref="caseContentFormRef"
          :model="caseContentForm"
          :rules="caseContentRules"
          label-width="100px"
        >
          <el-form-item label="案例内容" prop="coursewareList">
            <div class="hide">hide</div>
            <div class="case-items">
              <div
                class="case-item tintColor"
                v-for="(item, i) in caseContentForm.coursewareList"
                :key="i"
              >
                <span class="drag-tag"></span>
                <el-input
                  class="w-250"
                  v-model="item.coursewareName"
                ></el-input>
                <span class="case-type mr10">{{ item.typeStr }}</span>
                <el-select class="sw-90" v-if="isShowModule(item)" v-model="item.showModule">
                  <el-option v-for="(item, index) in CONTEXTSHOWMODULE" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span v-else class="sw-90"></span>
                <div class="case-time ml10">
                  <el-time-picker
                    class="w-100"
                    v-model="item.time"
                    :clearable="false"
                    value-format="HH:mm:ss"
                    :disabled="item.disabled"
                    popper-class="CaseCenter__addCase__case-time-pick"
                  >
                  </el-time-picker>
                </div>
                <span class="case-size">文件大小：{{ item.fileSize }}M</span>
                <span
                  class="active ml10"
                  @click="editCaseDraftHandle(item, i)"
                  v-if="item.type === 'voice'"
                  >文稿</span
                >
                <span
                  class="active ml10"
                  @click="caseContentForm.coursewareList.splice(i, 1)"
                  >删除</span
                >
              </div>
            </div>
          </el-form-item>
          <el-form-item label="上传内容">
            <process-input
              :accept="typeStr"
              :size="300 * 1024 * 1024"
              :on-before="handleBeforeUpload"
              :on-sucess="handleFileChange"
              :on-error="handleFileError"
              :fetch-param="{isReturnUrl: 'Y'}"
            >
              <span class="tintColor ml10">
                支持扩展名：{{ typeStr }}，最大300M
              </span>
            </process-input>
          </el-form-item>
          <el-form-item label="案例类型">
            <gc-select
              disabled
              class="no-icon w700"
              placeholder=""
              v-model="caseType"
              :options="caseTypeOptions"
            ></gc-select>
          </el-form-item>
          <el-form-item label="案例时长">
            <el-input class="w700" readonly v-model="caseDuration"></el-input>
          </el-form-item>
          <el-form-item label="进度条控制" prop="progressControl">
            <el-radio-group v-model="caseContentForm.progressControl">
              <el-radio label="allow"
                >允许用户拖动音频、视频课件的进度条
              </el-radio>
              <el-radio label="forbit" class="ml10">禁止拖动 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="已学规则" prop="studyRule">
            <el-radio-group v-model="caseContentForm.studyRule">
              <el-radio label="all">全部课件已学，标记为已学 </el-radio>
              <el-radio label="one" class="ml70"
                >任意一个课件已学，标记为已学
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="section">
            <el-form-item label-width="0" class="mb0" prop="vStudyRule">
              <span class="necessary-before"></span>
              <p>纯视频/纯音频课件</p>
              <el-radio-group v-model="caseContentForm.vStudyRule">
                <el-radio label="complete">学习完整内容，标记为已学 </el-radio>
                <el-radio label="click" class="ml70"
                  >点击学习，标记为已学
                </el-radio>
             </el-radio-group>
            </el-form-item>

            <el-form-item
              label-width="0"
              class="mb0 mt15"
              prop="cStudyDuration"
            >
              <span class="necessary-before"></span>
              <p class="mb0">图文课件</p>
              <div class="df">
                <span>按照学习时间计算，至少学习 </span>
                <el-input
                  class="w-80 ml10 mr6"
                  v-model.trim="caseContentForm.cStudyDuration"
                >
                  <span slot="suffix" class="fontColor">分钟</span>
                </el-input>
                <span>，标记为已学</span>
                <span class="tintColor ml10"
                  >（设定的学习完成的时长要求不能小于2分钟）</span
                >
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeCurrPage()"
        >取消</el-button
      >
      <!-- <el-button class="button-w80-h30" @click="save">保存</el-button> -->
      <el-button class="button-w80-h30" v-show="active !== 0" @click="preStep"
        >上一步</el-button
      >
      <el-button
        class="button-w80-h30"
        type="primary"
        v-show="active !== 1"
        @click="nextStep"
        >下一步</el-button
      >
      <el-button
        v-show="active === 1"
        class="button-w80-h30"
        type="primary"
        @click="submit"
        :loading="saveLoading"
        >提交</el-button
      >
    </div>

    <!-- 案例文稿 -->
    <CaseDraft
      :show.sync="isCaseDraftShow"
      :course-info="draftInfoRow"
      @save="draftSaveHandle"
    ></CaseDraft>
  </div>
</template>

<script>
import { fetchListTags, fetchListCasePushBelongOrgs } from '@/fetch/caseCenter'
import { LINE_LS } from '@/util/constants'
import { fetchUserInfos } from '@/fetch/public'
import $ from 'jquery'
import Sortable from 'sortablejs'
import {
  merge,
  myFloat,
  CopyObj,
  resetObj,
  arrToTree,
  customHint,
  jsonHeaders,
  secondToHour,
  setPageTitle,
  hourToSeconds,
  closeCurrPage,
  closeCurrPageAndGoPath,
  uuid
} from '@/util/utils'
import gcSteps from '@/views/CourseRecommendation/components/gc-steps'
import CaseDraft from './components/CaseDraft.vue'
import SelectPersonItem from '@/components/select-person/SelectPersonItem'
import SetCrowdItem from '@/components/set-crowd/SetCrowdItem'
import { CONTEXTSHOWMODULE } from '../enum.js'
import CurriculumLabel from '../../CurriculumManagement/components/CurriculumLabel.vue'

export default {
  name: 'NewCase',
  components: {
    gcSteps,
    CaseDraft,
    SetCrowdItem,
    SelectPersonItem,
    CurriculumLabel
  },
  data() {
    return {
      // 当前页面状态
      state: '',
      stateMap: {
        add: '新增案例',
        edit: '编辑案例'
      },
      active: 0,
      stepList: ['基本信息', '案例内容'],
      CONTEXTSHOWMODULE,
      baseInfoForm: {
        caseName: '',
        briefIntroduction: '',
        thumbnail: '',
        belongOrg: '',
        businessLine: '',
        shareStatus: 'Y',
        keyWords: [],
        producerList: [''],
        shareList: [''],
        importId: '', // 新添加人员的importId,提交给后端
        crowdOrgs: [],
       crowdBatchId: '', // 已导入人员的importId，用于已导入人员列表, 后端返回的
        deleteUserList: [],
        makePersonList: [{umId: '', umName: '', label: '', isEx: false}],
        sharePersonList: [{umId: '', umName: '', label: '', isEx: false}],
        tagName: ''
      },
      deleteUserObjList: [],
      personPageData: {
        msgMapping: {
          hb: '非行编人员，需要手动输入姓名和UM号',
          bt: '姓名和UM号都为必填项，请填写',
        },
        makeMsgList: [''],
        shareMsgList: [''],
      }, // 分享人页面属性
      orgIds: [],
      baseInfoRules: {
        caseName: [{ required: true, message: '请填写案例名称' }],
        briefIntroduction: [{ required: true, message: '请填写简介' }],
        thumbnail: [{ required: true, message: '请上传缩略图' }],
        // belongOrg: [{ required: true, message: '请选择案例所属组织' }],
        belongOrg: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!this.orgIds.length) {
                return callback(new Error('请选择案例所属组织'))
              }
              return callback()
            }
          }
        ],
        businessLine: [{ required: true, message: '请选择案例分类' }],
        tagName: [{ required: true, message: '请选择案例标签' }],
        keyWords: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value?.length) {
                return callback(new Error('请填写关键字'))
              }
              if (value.some((v) => !v.value)) {
                return callback(new Error('关键字不能为空'))
              }
              return callback()
            }
          }
        ],
        producerList: [{ required: true, message: '请添加制作人' }],
        shareList: [{ required: true, message: '请添加分享人' }]
      },
      caseContentForm: {
        caseType: '',
        caseDuration: '',
        progressControl: 'allow',
        studyRule: 'all',
        vStudyRule: 'complete',
        cStudyDuration: '2',
        coursewareList: []
      },
      caseContentRules: {
        coursewareList: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value?.length) {
                return callback(new Error('请上传案例内容'))
              }
              if (
              value.some((v) => v.typeStr === '图文' && v.time === '00:00:00')
              ) {
                return callback(new Error('图文时长不能为0'))
              }
              return callback()
            }
          }
        ],
        progressControl: [{ required: true, message: '请选择进度条控制' }],
        studyRule: [{ required: true, message: '请选择已学规则' }],
        vStudyRule: [{ required: true, message: '请选择已学规则' }],
        cStudyDuration: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!/^\d+$/.test(value) || (value < 2)) {
                return callback(new Error('请填写大于等于2的整数'))
              }
              return callback()
            }
          }
        ]
      },
      // 所属组织下拉选项
      belongOrgOptions: [],
      typeMap: {
        mp4: '视频',
        mov: '视频',
        mp3: '音频',
        m4a: '音频',
        // ppt: "图文",
        // pptx: "图文",
        pdf: '图文'
      },
      uploading: false,
      // 宽度百分比
      widthPercentage: '0%',
      caseTypeOptions: [
        {
          label: '视频',
          value: 'video'
        },
        {
          label: '音频',
          value: 'voice'
        },
        {
          label: '图文',
          value: 'context'
        },
        {
          label: '混合',
          value: 'mix'
        }
      ],
      isCaseDraftShow: false,
      draftInfoRow: {},
      editRow: null,
      closeCurrPage,
      saveLoading: false,
      uploadLoading: 0, // 文件上传状态, 0 未上传, 1 文件开始上传, 2 文件上传成功, 3 时长已更新
      fetchListCasePushBelongOrgs,
      caseClassifyOptions: [],
      caseTagOptions: [],
      tagsList: []
    }
  },
  methods: {
    // 是否显示横坚屏
    isShowModule (item) {
      return [this.typeMap.mp4, this.typeMap.pdf].includes(item.typeStr)
    },
    // 课程标签组件 change事件
    courseTagChange(value, form, ref) {
      this[form].tagName = value
      this.$refs[ref].validateField('tagName')
    },
    orgChangeHandle(orgName) {
      console.log(orgName, '---')
      // this.baseInfoForm.orgName = orgName
    },
    orgSetDataFinishHandle () {},
    // 选择人员确认
    comfirmSelectPerson (data) {
      console.log('选择人员确认', data)
      this.baseInfoForm.crowdOrgs = data.crowdOrgs || []
      if (data?.deleteUserList.length) {
        this.baseInfoForm.deleteUserList = data.deleteUserList
      }
    },
    comfirmSetCrowd (data) {
      console.log('选择人员确认', data)
      this.baseInfoForm.crowdOrgs = data.crowdOrgs || []
    },
    // 栏目负责人 远程搜索
    personSelect(type, i, item) {
      const typeField = `${type}PersonList`
      this.$set(this.baseInfoForm[typeField][i], 'umId', item.umId)
      this.$set(this.baseInfoForm[typeField][i], 'umName', item.empName)
      this.$set(this.baseInfoForm[typeField][i], 'label', `${item.empName}(${item.umId})`)
      this.$refs[`${type}PersonSelect${i}Ref`][0]?.focus()
    },
    exPersonBlur (type, i, field) {
      const typeField = `${type}PersonList`
      const msgField = `${type}MsgList`
      const fieldOther = field === 'umId' ? 'umName' : 'umId'
      const value  = this.baseInfoForm[typeField][i][field]
      const valueOther = this.baseInfoForm[typeField][i][fieldOther]
      if (value && valueOther) {
        this.$set(this.personPageData[msgField], i, '')
      } else if ((!value && valueOther) || (value && !valueOther)) {
        this.$set(this.personPageData[msgField], i, 'hb')
        const focusField = !value ? field : fieldOther
        this.$refs[`${type}${focusField}${i}Ref`][0]?.focus()
      }
   },
    // 删除分享人
    deletePerson (type, i) {
      // makePersonList, sharePersonList
      const typeField = `${type}PersonList`
      if (this.baseInfoForm[typeField].length > 1) {
        this.baseInfoForm[typeField].splice(i, 1)
      }
    },
    /**
     * 在页面中添加人员
     * type: 人员类型：make - 制作人；share - 分享人
     * i: 索引
     * isEx: 是否是外包，
     */
    addPerson (type, i, isEx = false) {
      const other = i + 1
      const typeField = `${type}PersonList`
      if (this.baseInfoForm[typeField].length < 3) {
        this.baseInfoForm[typeField].splice(other, 0, {
          umId: '',
          umName: '',
          label: '',
          isEx: isEx
        })
      }
    },
    // 显示验证消息
    showPersonMsg (type, i) {
      const typeField = `${type}MsgList`
      const msgType = this.personPageData[typeField][i]
      if (msgType) {
        return this.personPageData.msgMapping[msgType]
      }
      return ''
    },
    querySearch(queryString, cb) {
      const data = { empName: queryString }
      fetchUserInfos({ data }).then(resData => {
        resData.list.forEach((v) => {
          v.label = `${v.empName}(${v.umId})`
        })
        cb(resData.list)
      })
    },
    preStep() {
      this.active--
    },
    nextStep() {
      this.active++
    },
    // 添加一个关键字
    addKeyWord() {
      if (this.baseInfoForm.keyWords.length >= 5)
        return this.$message.warning('最多添加五个关键字')
      this.baseInfoForm.keyWords.push({ value: '' })
      this.$nextTick(() => {
        const ref = this.$refs.keyWord
        if (Array.isArray(ref) && ref.slice(-1)[0]) {
          ref.slice(-1)[0].focus()
        } else {
          ref.focus()
        }
      })
    },
    // 关键字删除事件
    delKeyWord(i) {
      this.baseInfoForm.keyWords.splice(i, 1)
    },
    // 提交成功后询问是否上架
    hintIsUp(id) {
      customHint('已提交，是否立即上架？', '提示', '暂不', true, '上架')
        .then(() => {
          const data = {
            caseIds: [id],
            status: 'up'
          }
          this.$axios
            .post(
              '/fn/caseCenter/case/caseUpOrDownStatus',
              { data },
              jsonHeaders
            )
            .then((res) => {
              const { code } = res.data
              if (code === 0) {
                closeCurrPageAndGoPath('/CaseManagement')
              }
            })
        })
        .catch(() => {
          closeCurrPageAndGoPath('/CaseManagement')
        })
    },
    // 获取所需组织下拉选项
    getBelongOrg() {
      this.$axios
        .post(
          '/fn/caseCenter/tag/selectOrgTagList',
          { busiType: 'LS' },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const list = data[0].orgList
            list.forEach((v) => {
              v.leaf = v.isSpread === 'N'
            })
            this.belongOrgOptions = list
          }
        })
    },
    // 所需组织懒加载
    lazyLoad(node, resolve) {
      const { value } = node
      if (!value) return
      this.$axios
        .post(
          '/fn/caseCenter/tag/selectOrgTagList',
          { busiType: 'LS', orgId: value },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const list = data[0].orgList
            list.forEach((v) => {
              v.leaf = v.isSpread === 'N'
            })
            resolve(list)
          }
        })
    },
    // 获取 案例分类 案例标签 下拉选项
    async getAllFilter() {
     const blgStripLine = this.$store.state.userInfo.blgStripLine || LINE_LS
      const data = await fetchListTags({ data: { blgStripLine, tagType: 5, module: 'case' } })
      this.tagsList =
        data?.map(v => ({
          value: v.tagId,
          tagId: v.tagId,
          label: v.tagName,
          tagName: v.tagName,
          tagLevel: v.tagLevel,
          parentTagId: v.parentTagId
        })) || []
      this.caseClassifyOptions = this.tagsList.filter(v => v.tagLevel === '1')
      let selectItem = this.caseClassifyOptions.find(item => item.value === this.baseInfoForm.businessLine)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      this.caseTagOptions = newArr
    },
    handleBeforeUpload () {
      this.uploadLoading = 1 // 开始上传
    },
    handleFileError () {
      this.uploadLoading = 0 // 上传失败, 重置上传状态为 0
    },
    // 处理文件上传
    handleFileChange(data, file) {
      const { name, size } = file
      const { udmpId, fileName: coursewareName, fileUrl } = data[0]
      // 文件后缀名转小写
      const fileSuffix = name.split('.').slice(-1)[0]?.toLowerCase()
      const typeStr = this.typeMap[fileSuffix]
      const type = this.caseTypeOptions.find((v) => v.label === typeStr).value
      const item = {
        type,
        udmpId,
        typeStr,
        fileUrl,
        fileSuffix,
        fileSize: myFloat(size / 1024 / 1024),
        time: '00:00:00',
        duration: 0,
        coursewareName,
        disabled: false
      }
      if (typeStr === '视频' || typeStr === '音频') {
        this.getDuration(file, item)
        item.disabled = true
      }
      if (typeStr === '图文' || typeStr === '视频') {
        item.showModule = 'H'
      }
      this.caseContentForm.coursewareList.push(item)
      this.uploadLoading = 2 // 上传成功
    },
    getDuration(file, item) {
      const video = document.createElement('video')
      const src = URL.createObjectURL(file)
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        item.duration = Math.floor(video.duration)
        item.time = secondToHour(item.duration)
        this.$nextTick(() => {
          URL.revokeObjectURL(src)
        })
      })
      video.addEventListener('error', (err) => {
        console.log(err)
        URL.revokeObjectURL(src)
      })
    },
    // 前端页面转换为符合后台的数据
    webToServe() {
      const data = {
        ...CopyObj(this.baseInfoForm),
        ...CopyObj(this.caseContentForm)
      }
      if (Array.isArray(this.orgIds)) {
        data.belongOrg = this.orgIds[this.orgIds.length - 1]
      }
      // data.belongOrg = data.belongOrg.slice(-1)[0]
      data.caseDuration = hourToSeconds(this.caseDuration)
      data.caseType = this.caseType
      let makeUser, makeUserName, shareUser, shareUserName
      makeUser = makeUserName = shareUser = shareUserName = ''
      const { makePersonList, sharePersonList, coursewareList } = data
      makePersonList.forEach((v) => {
        const { umId, umName } = v
        makeUserName && (makeUserName += ',')
        makeUser && (makeUser += ',')
        makeUserName += umName
        makeUser += umId
      })
      sharePersonList.forEach(v => {
        const { umId, umName } = v
        shareUserName && (shareUserName += ',')
        shareUser && (shareUser += ',')
        shareUserName += umName
        shareUser += umId
      })
      data.makeUser = makeUser
      data.makeUserName = makeUserName
      data.shareUser = shareUser
      data.shareUserName = shareUserName
      data.keyWords = data.keyWords.map((v) => v.value).join(',')
      Reflect.deleteProperty(data, 'producerList')
      Reflect.deleteProperty(data, 'shareList')
      coursewareList.forEach((v) => {
        v.duration = hourToSeconds(v.time)
      })
      data.id = this.id
      return data
    },
    // 后端数据转换为前端需要的
    async serveToWeb(data) {
      data.caseDuration = secondToHour(data.caseDuration)
      $('.belongOrg input').val(data.belongOrgStr)
      let { makePersonList, sharePersonList, coursewareList } = data
      data.makePersonList = makePersonList?.map(m => ({...m, isEx: m.outsourceStatus === 'Y', label: `${m.umName}(${m.umId})` })) || []
      data.sharePersonList = sharePersonList?.map(m => ({...m, isEx: m.outsourceStatus === 'Y', label: `${m.umName}(${m.umId})` })) || []

      coursewareList = coursewareList || []
      coursewareList.forEach((v) => {
        v.time = v.duration ? secondToHour(v.duration) : '00:00:00'
        if (v.typeStr !== '图文') {
          v.disabled = true
        }
      })
     if (data?.keyWords && typeof data.keyWords === 'string') {
        data.keyWords = data.keyWords.split(',').map((value) => ({ value }))
      }

      this.orgIds = [data.belongOrg]
      Reflect.deleteProperty(data, 'belongOrg')
      merge(this.baseInfoForm, data)
      merge(this.caseContentForm, data)

      this.baseInfoForm.belongOrgStr = data.belongOrgStr || this.baseInfoForm.belongOrgStr
      this.$refs.institutionRef.setContentValue([this.baseInfoForm.belongOrgStr])
    },
    // 保存
    save() {
      const flowStatus = '02000'
      const data = this.webToServe()
      data.flowStatus = flowStatus
      this.$axios
        .post('/fn/caseCenter/case/addCase', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('保存成功')
          }
        })
    },
    // 提交案例
    async submit() {
      try {
        await this.$refs.baseInfoFormRef.validate()
      } catch {
        this.active = 0
        return this.$message.warning('基本信息验证错误')
      }
      try {
        await this.$refs.caseContentFormRef.validate()
      } catch {
        this.active = 1
        return this.$message.warning('案例内容验证错误')
      }
      if (this.uploadLoading === 2) {
        return this.$message.warning('视频(音频)时长正在计算中，不能提交，请稍后再试')
      }
      const data = this.webToServe()
      let url
      if (this.state === 'add') {
        url = '/fn/caseCenter/case/addCase'
      } else {
        url = '/fn/caseCenter/case/updateCase'
      }
     this.saveLoading = true
      this.$axios.post(url, { data }, jsonHeaders)
      .then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.hintIsUp(data)
        }
      })
      .finally(() => {
        this.saveLoading = false
      })
    },
    // 重置表单数据
    resetForm() {
      this.active = 0
      resetObj(this.baseInfoForm, {
        businessLine: '',
        tagName: '',
        shareStatus: 'Y',
      })
      resetObj(this.caseContentForm, {
        progressControl: 'allow',
        studyRule: 'all',
        vStudyRule: 'complete'
      })
      this.baseInfoForm.producerList = ['']
      this.baseInfoForm.shareList = ['']
      this.baseInfoForm.makePersonList = [{umId: '', umName: '', label: '', isEx: false}]
      this.baseInfoForm.sharePersonList = [{umId: '', umName: '', label: '', isEx: false}]
      this.caseContentForm.cStudyDuration = '2'
      this.$nextTick(() => {
        this.$refs.baseInfoFormRef.clearValidate()
        this.$refs.caseContentFormRef.clearValidate()
      })
    },
    // 自动选中权限范围内，排在最前面的那一个根节点
    visibleChange(visible) {
      if (visible) {
        setTimeout(() => {
          const el = $('.el-cascader-panel li.el-cascader-node>span')
            .next('i')
            .parent()
           .eq(0)

          el.parents('.el-cascader-menu__wrap')[0].scrollTop = el
            .parent()
            .height()
          el.click()
        }, 100)
      }
    },
    editCaseDraftHandle(row, index) {
      this.draftInfoRow = {
        ...CopyObj(row),
        udmpUrl: row.udmpUrl || row.fileUrl,
        caseName: this.baseInfoForm.caseName
      }
      this.editRow = index
      this.isCaseDraftShow = true
    },
    draftSaveHandle(draftData) {
      this.$set(this.caseContentForm.coursewareList, this.editRow, {
        ...this.caseContentForm.coursewareList[this.editRow],
        ...draftData
      })
      this.editRow = null
    },
    changeCaseClassify(val) {
      let selectItem = this.caseClassifyOptions.find(item => item.value === val)
      let newArr = []
      if (selectItem) {
        newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      this.baseInfoForm.tagName = ''
      this.caseTagOptions = newArr
    },
    labelPrecedRules() {
      if(!this.baseInfoForm.businessLine) {
        this.$message.warning('请先选择案例分类')
        return false
      }
      return true
    }
  },
  computed: {
    // 案例时长
    caseDuration() {
      let h, m, s
      h = m = s = 0
      this.caseContentForm.coursewareList.forEach((item) => {
        const list = item.time.split(':')
        s += parseInt(list.pop()) || 0
        m += parseInt(list.pop()) || 0
        h += parseInt(list.pop()) || 0
      })
    m += Math.floor(s / 60)
      s = s % 60
      h += Math.floor(m / 60)
      m = m % 60
      return `${(h + '').padStart(2, '0')}:${(m + '').padStart(2, '0')}:${(
        s + ''
      ).padStart(2, '0')}`
    },
    // 案例类型
    caseType() {
      let set = new Set()
      this.caseContentForm.coursewareList.forEach((v) => {
        set.add(v.type)
      })
      set = [...set]
      if (set.length > 1) {
        return 'mix'
      } else if (set.length === 1) {
        return set[0]
      } else {
        return ''
      }
    },
    typeStr() {
      return Object.keys(this.typeMap)
        .map((v) => '.' + v)
        .join(',')
    }
  },
  watch: {
    caseDuration (newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.uploadLoading === 2) {
        // console.log('xf-date-3',new Date().getTime(), newVal, oldVal)
        this.uploadLoading = 3 // 时长已更新
      }
    }
  },
  mounted() {
    const items = this.$el.querySelector('.case-items')
    const form = this.caseContentForm
    new Sortable(items, {
      handle: '.drag-tag',
      animation: 150,
      onEnd(event) {
        const list = form.coursewareList
        const { newIndex, oldIndex } = event
        // 修改原本数组重的顺序
        ;[list[newIndex], list[oldIndex]] = [list[oldIndex], list[newIndex]]
      }
    })
    this.getBelongOrg()
    this.getAllFilter()
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.resetForm()
      this.state = params.state
      this.uploadLoading = 0
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.state === 'edit') {
      this.serveToWeb(params)
      this.id = params.id
    }
    this.baseInfoForm.importId = uuid()
    this.$refs.baseInfoFormRef.clearValidate()
    this.$refs.caseContentFormRef.clearValidate()
  }
}
</script>
<style lang="scss" scoped>
.shareUserList-msg {
  color: #f54e1e;
  position: absolute;
  background: #fff;
  z-index: 10;
  span {
    display: block;
    margin-top: -4px;
  }
}
.org-list-view {
  padding: 5px 10px;
  border: 1px #f0f0f0 solid;
  border-radius: 2px;
  :deep(.el-tag) {
    margin-top: 5px;
    margin-bottom: 5px;
  }
}
.CaseCenter__addCase {
  .content-box {
    width: 840px;
    .case-item .active {
      position: unset;
    }
  }
}
</style>
<style lang="scss" scoped>
.CaseCenter__addCase {
  padding-top: 40px;
  background-color: #fff;
  .content-box {
    margin: 50px auto 60px;
    .keyword {
      .el-input__suffix {
        right: 16px;
      }
      .icon__close {
        display: none;
      }
      &:hover {
        .icon__close {
          display: block;
          margin-left: -10px;
        }
      }
    }
    .w700 {
      max-width: 690px;
    }

    .case-item {
      position: relative;
      display: flex;
      justify-content: flex-start;
      margin-top: 20px;
      .drag-tag {
        position: absolute;
        width: 30px;
        height: 30px;
        top: 0;
        left: -30px;
        background: url('../../../assets/svg/tuodong.svg') center no-repeat;
      }
      .case-type {
        min-width: 70px;
        height: 30px;
        margin-left: 10px;
        padding: 0 10px;
        border: 1px solid #e0e1e3;
        border-radius: 2px;
        line-height: 28px;
        background: #f7f8fa;
     }
      .case-size {
        width: 105px;
        margin-left: 10px;
        white-space: nowrap;
      }
    }
    .uploading {
      position: inherit;
      display: flex;
      height: 30px;
      background: #d8d8d8;
      border-radius: 2px;
      justify-content: center;
      align-items: center;
      color: #fff;
      .bgc-tier {
        position: absolute;
        top: 0;
        left: 0;
        height: 30px;
        background-color: #00b046;
        border-radius: 2px;
      }
      .up-text {
        position: relative;
        z-index: 2;
      }
    }
    .section {
      position: relative;
      width: 610px;
      height: 164px;
      margin: -24px 0 0 90px;
      padding: 14px 0 0 10px;
      background: rgba($color: #d8d8d8, $alpha: 0.12);
      border-radius: 4px;

      > p {
        margin-bottom: 10px;
        line-height: 17px;
        color: $tintColor6;
      }
      .necessary-before {
        position: absolute;
        left: -20px;
        top: -12px;
      }
    }
  }
  &__case-time-pick {
    .el-time-spinner .el-time-spinner__wrapper:nth-child(1) {
      .el-scrollbar__view::before {
        content: '时';
        line-height: 85px;
        color: $shallow;
      }
    }
    .el-time-spinner .el-time-spinner__wrapper:nth-child(2) {
      .el-scrollbar__view::before {
        content: '分';
        line-height: 85px;
        color: $shallow;
      }
    }
    .el-time-spinner .el-time-spinner__wrapper:nth-child(3) {
      .el-scrollbar__view::before {
        content: '秒';
        line-height: 85px;
        color: $shallow;
      }
    }
  }
}
</style>
