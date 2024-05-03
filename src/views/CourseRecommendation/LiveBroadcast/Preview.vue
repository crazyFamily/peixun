<template>
  <div class="course-recommendation__new-liveBroadcast">
    <!-- 进度条 -->
    <gcSteps :active="active" :list="stepList"></gcSteps>
    <!-- 内容 -->
    <div class="content-box">
      <div v-show="active === 0" class="course-info">
        <el-form
          ref="establishFormRef"
          :model="establishForm"
          :rules="establishRules"
          label-width="70px"
        >
          <el-form-item label="直播类型" prop="liveType">
            <el-radio-group :value="establishForm.liveType">
              <el-radio label="EXIST">已有系列直播</el-radio>
              <el-radio label="ONCE">非系列直播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="直播立项名称"
            class="ws dr-label"
            prop="liveProposalName"
            ref="liveProposalName"
          >
            <el-input
              v-if="establishForm.liveType !== 'EXIST'"
              :value="establishForm.liveProposalName"
            ></el-input>
            <el-cascader
              v-else
              class="w-full"
              :options="courseClassifyOptions"
              :props="{ value: 'tagId', label: 'tagName' }"
              :value="establishForm.liveProposalName"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="拟定开始日期" class="ws dr-label">
            <el-date-picker
              disabled
              class="w-full"
              :value="establishForm.planStartDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :picker-options="
                handleStartPickerOptions(establishForm, 'planEndDate')
              "
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="拟定结束日期"
            class="ws dr-label"
            prop="planEndDate"
          >
            <el-date-picker
              class="w-full"
              :disabled="establishDisabled"
              :value="establishForm.planEndDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              :picker-options="handleplanEndDate()"
            >
            </el-date-picker>
            <p class="aic">
              <i class="icons-wraning mr10"></i> 日期往后最长一年
            </p>
          </el-form-item>
          <el-form-item
            label="计划参加人数"
            class="ws dr-label"
            prop="planJoinNum"
          >
            <el-input
              :disabled="establishDisabled"
              :value="establishForm.planJoinNum"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="项目背景及成因"
            class="ws dr-label"
            prop="liveProposalIntroduce"
          >
            <el-input
              type="textarea"
              resize="none"
              class="h-90"
              maxlength="500"
              show-word-limit
              placeholder="限制500字"
              :disabled="establishDisabled"
              :value="establishForm.liveProposalIntroduce"
            ></el-input>

            <p class="mt15">
              如果涉及直播费用请联系管理员赖龙欢（LAILONGHUAN815）
            </p>
          </el-form-item>
          <el-form-item label="审批链" required>
            <ApprovalChain autoApproval chainType="4" />
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active === 1" class="course-info">
        <el-form
          ref="liveBroadcastFormRef"
          :model="liveBroadcastForm"
          :rules="liveBroadcastRules"
          label-width="70px"
        >
          <el-form-item label="直播名称">
            <el-input :value="liveBroadcastForm.liveName"></el-input>
          </el-form-item>
          <el-form-item label="直播源">
            <gc-select
              class="padding-0"
              :value="liveBroadcastForm.liveSource"
              :options="liveSourceList"
              :clearable="false"
              disabled
            ></gc-select>
            <el-radio-group
              :value="liveBroadcastForm.type"
              class="mt15"
              :disabled="liveBroadcastForm.liveSource === 'zn'"
            >
              <el-radio label="new">新增直播</el-radio>
              <el-radio label="relation">关联已有直播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="直播ID">
            <!-- 只有关联已有直播的时候才可以进行录入 -->
            <el-input
              :value="liveBroadcastForm.liveId"
              :disabled="liveBroadcastForm.type === 'new'"
            ></el-input>
          </el-form-item>
          <el-form-item label="机构部门" prop="orgName">
            <gc-select
              w1
              class="padding-0"
              k="orgName"
              v="orgId"
              :options="orgOptions"
              :value="liveBroadcastForm.orgId"
              disabled
            ></gc-select>
          </el-form-item>
          <el-form-item label="直播关键词" prop="keyword" class="ws dr-label">
            <el-input
              type="textarea"
              resize="none"
              class="h-90"
              :value="liveBroadcastForm.liveKeyword"
            ></el-input>
            <p class="shallow">
              最多支持添加10个关键词，每个关键词限制10个字，关键词用“/”隔开，如：信托/资产提升
            </p>
          </el-form-item>
          <el-form-item label="直播标签" required="" prop="liveTagId">
            <CurriculumLabel
              ref="curriculumLabelRef"
              url="/fn/course/tag/selectCourseTagsForTk"
              :maxValue="6"
              :blgStripLine="$store.state.userInfo.blgStripLine"
              :value="liveBroadcastForm.liveTagId"
              :isShowAdd="false"
            />
          </el-form-item>
          <el-form-item
            label="小橙业务分类"
            class="ws dr-label"
            prop="busiTypeTag"
            v-if="liveBroadcastForm.liveSource === 'xc'"
          >
            <el-input :value="liveBroadcastForm.busiTagStr"></el-input>
            <!-- <el-cascader
                            class="wfull busiTypeTag"
                            clearable
                            v-model="liveBroadcastForm.busiTypeTag"
                            :options="busiTypeTagOptions"
                            :props="{
                                value: 'customId',
                                label: 'tagName',
                            }"
                            ref="busiTypeTagRef"
                        ></el-cascader> -->
          </el-form-item>
          <el-form-item
            label="栏目分类"
            v-if="liveBroadcastForm.liveSource === 'xc'"
          >
            <el-input :value="liveBroadcastForm.layoutTagStr"></el-input>
            <!-- <el-cascader
                            class="wfull layoutTypeTag"
                            clearable
                            v-model="liveBroadcastForm.layoutTypeTag"
                            :options="layoutTypeTagOptions"
                            :props="{
                                value: 'customId',
                                label: 'tagName',
                            }"
                            ref="layoutTypeTagRef"
                        ></el-cascader> -->
          </el-form-item>
          <el-form-item label="主播">
            <!-- TODO: 主播名需要对接 -->
            <el-input
              class="w-full"
              value-key="empName"
              placeholder="请输入UM号/姓名"
              :trigger-on-focus="false"
              :value="liveBroadcastForm.liveUmInfo"
            ></el-input>
            <p>以主播UM号开立直播间，主播和授课讲师可为同一人</p>
          </el-form-item>
          <el-form-item label="授课讲师">
            <div
              class="df mb20"
              v-for="(item, i) in liveBroadcastForm.teacherUmList"
              :key="i"
            >
              <el-input
                class="f1"
                value-key="empName"
                placeholder="请输入UM号/姓名"
                :trigger-on-focus="false"
                :value="liveBroadcastForm.teacherUmList[i]"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="直播简介" prop="liveIntroduce">
            <el-input
              type="textarea"
              resize="none"
              class="h-90"
              maxlength="500"
              show-word-limit
              :value="liveBroadcastForm.liveIntroduce"
              placeholder="限制500字"
            ></el-input>
          </el-form-item>
          <el-form-item label="直播封面" required>
            <el-radio-group :value="liveBroadcastForm.coverType">
              <el-radio :label="1" class="mr60">上传封面</el-radio>
              <!-- <el-radio :label="2">使用模版</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详情封面" prop="coverList">
            <div>
              <gc-upload
                :size="200"
                single
                ref="courseUploadDetailCoverRef"
                :udmpId.sync="liveBroadcastForm.detailCoverUdmp"
                :fileName.sync="liveBroadcastForm.detailCoverName"
                disabled
              ></gc-upload>
              <p class="tintColor">
                推荐比例16 ：9，支持 jpg、png格式，文件大小不超过200k
              </p>
            </div>
          </el-form-item>
          <el-form-item label="直播开始日期" class="ws dr-label">
            <el-date-picker
              class="w-full"
              :value="liveBroadcastForm.liveStartDate"
              type="datetime"
              placeholder="选择日期时间"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="直播结束日期" class="ws dr-label">
            <el-date-picker
              class="w-full"
              :value="liveBroadcastForm.liveEndDate"
              type="datetime"
              placeholder="选择日期时间"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="课程时长">
            <el-input placeholder="请输入" :value="liveBroadcastForm.duration">
              <i slot="suffix" class="fontColor mr6">分钟</i>
            </el-input>
          </el-form-item>
          <el-form-item
            label="转发/分享"
            class="ws dr-label"
            prop="supportShare"
          >
            <el-radio-group :value="liveBroadcastForm.supportShare">
              <el-radio label="Y" class="mr60">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上架栏目" class="ws dr-label">
            <TreeDropdown
              multiple
              show-checkbox
              check-strictly
              :list="columnList"
              label="layoutName"
              node-key="layoutId"
              ref="layoutTreeDropdownRef"
              :contentArr="liveBroadcastForm.layoutName"
              :props="{ children: 'childs', label: 'layoutName' }"
              :value="liveBroadcastForm.liveLayout"
              customDropdownTreeClass="live-dropdown"
            />
          </el-form-item>
          <el-form-item label="直播课程角标" class="ws dr-label">
            <el-input
              maxlength="6"
              show-word-limit
              placeholder="限制6字"
              :value="liveBroadcastForm.layoutCornerMark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button
        class="button-w80-h30"
        @click="closeCurrPageAndGoPath({ path: '/CRLiveBroadcast' })"
        >取消</el-button
      >
      <el-button class="button-w80-h30" v-show="active !== 0" @click="preStep"
        >上一步</el-button
      >
      <el-button
        class="button-w80-h30"
        type="primary"
        v-show="active !== stepList.length - 1"
        @click="nextStep"
        >下一步</el-button
      >
    </div>

    <!-- 合规自查申明 dialog -->
    <gc-model
      title="合规自查申明"
      width="800px"
      :visible.sync="selfExaminationVisible"
      @comfirm="selfExaminationComfirm"
    >
      <div slot="prend">
        <el-checkbox :value="selfExamination" class="prend"
          >我已仔细阅读并将遵守以上规定</el-checkbox
        >
      </div>
      <p>该课程涉及产品/销售/营销活动已经风险合规评审/自查，不存在以下行为：</p>
      <p>1.虚假、欺诈、隐瞒或者引人误解的宣传；</p>
      <p>2.损害其他同业信誉；</p>
      <p>
        3.冒用、使用与他人相同或者相近的注册商标、字号、宣传册页，有可能使金融消费者混淆；
      </p>
      <p>4.对业绩或者产品收益等夸大宣传；</p>
      <p>
        5.利用金融管理部门对金融产品和服务的审核或者备案程序，误导金融消费者认为金融管理部门已对该金融产品和服务提供保证；
      </p>
      <p>
        6.对未按要求经金融管理部门核准或者备案的金融产品和服务进行预先宣传或者促销；
      </p>
      <p>
        7.非保本投资型金融产品营销内容使金融消费者误信能保证本金安全或者保证盈利；
      </p>
      <p>
        8.未通过足以引起金融消费者注意的文字、符号、字体等特别标识对限制金融消费者权利的事项进行说明；
      </p>
      <p>
        9.违反团体综合金融业务规范用语，比如：交叉销售、产销银、养销银、证销银、银行综拓业务、对公综拓业务等不规范用语。
      </p>
      <p>10.其他违反消费者权益保护相关法律法规和监管规定的行为。</p>
    </gc-model>

  </div>
</template>

<script>
import $ from 'jquery'
import {
  merge,
  gtNow,
  CopyObj,
  resetObj,
  throttle,
  hintFrame,
  delayCall,
  formatDate,
  uploadFile,
  sizeChange,
  dataHeaders,
  jsonHeaders,
  setPageTitle,
  commonFilter,
  closeCurrPage,
  currentChange,
  deepSearchVal,
  handleUdmpHref,
  getCurriculumTree,
  addAllowKeepAlive,
  closeCurrPageAndGoPath,
  handleEndPickerOptions,
  handleStartPickerOptions,
  numerationAfterwardsDays
} from '@/util/utils'
import { getOrg } from '../utils'
import gcUpload from '@/components/upload'
import TreeDropdown from '@/components/dropdown/TreeDropdown'
import LecturerCard from '../CurriculmManagement/components/LecturerCard'
import gcSteps from '../components/gc-steps'
import CurriculumLabel from '../../CurriculumManagement/components/CurriculumLabel.vue'
import CurriculumClassification from '../../CurriculumManagement/components/CurriculumClassification.vue'
import TemplateImport from '../components/TemplateImport'
export default {
  name: 'CRPreviewLive',
  components: {
    gcSteps,
    gcUpload,
    LecturerCard,
    TreeDropdown,
    TemplateImport,
    CurriculumLabel,
    CurriculumClassification,
  },
  data(vm) {
    return {
      active: 0,
      stepList: ['立项信息', '直播信息'],
      // 部门下拉选项
      orgOptions: [],
      // 直播名称备份
      liveNameBack: '',
      // 课程信息 表单
      establishForm: {
        liveType: 'EXIST',
        liveProposalName: '',
        planStartDate: '',
        planEndDate: '',
        planJoinNum: '',
        liveProposalIntroduce: ''
      },
      // 课程系列下拉选项
      courseClassifyOptions: [],
      // 立项信息是否可更改
      establishDisabled: false,
      // 课程信息 验证规则
      establishRules: {
        liveType: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择直播类型'
          }
        ],
        liveProposalName: [
          {
            trigger: 'blur',
            required: true,
            validator: (rule, value, callback) => {
              if (!value || !String(value).trim()) {
                let msg
                if (this.establishForm.liveType === 'EXIST') {
                  msg = '请选择系列'
                } else {
                  msg = '请选输入直播名称'
                }
                return callback(new Error(msg))
              }
              return callback()
            }
          }
        ],
        planEndDate: [{ required: true, message: '请选择拟定结束日期' }],
        planJoinNum: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') return callback()
              const re = /^\d+$/
              if (!re.test(value)) return callback(new Error('必须输入数字'))
              if (value < 1) return callback(new Error('必须大于0'))
              return callback()
            }
          }
        ],
        liveProposalIntroduce: [
          { required: true, message: '请填写项目背景及成因' }
        ]
      },
      // 课程信息 上架栏目 数据对象
      columnList: [],
      // 课程上传预览 表单
      liveBroadcastForm: {
        // 直播名称
        liveName: '',
        // 直播源  xc-小橙 zn-知鸟
        liveSource: 'xc',
        // 类别   (xc new-新增直播 relation-关联) 知鸟-null
        type: 'new',
        // 机构id
        orgId: '',
        // 机构部门
        orgName: '',
        // 直播id
        liveId: '',
        // 直播关键字
        liveKeyword: '',
        // 直播标签id
        liveTagId: '',
        // 直播标签名
        liveTag: '',
        // 主播umId
        liveUmInfo: '',
        // 主播名
        liveUmName: '',
        // 授课讲师um
        teacherUmId: '',
        // 授课讲师名称
        teacherUmName: '',
        // 直播简介
        liveIntroduce: '',
        // 直播封面udmp地址
        coverUdmp: '',
        // 直播封面文件名
        coverName: '',
        // 直播详情封面udmp
        detailCoverUdmp: '',
        // 直播详情封面名字
        detailCoverName: '',
        // 直播开始时间
        liveStartDate: '',
        // 直播结束时间
        liveEndDate: '',
        // 课程时长
        duration: '',
        // 是否支持转发分享；N：不支持；Y：支持
        supportShare: '',
        // 上架栏目id
        layoutId: [],
        // 栏目直播角标
        layoutCornerMark: '',
        // 讲师列表
        teacherUmList: [''],
        coverType: 1,
        coverList: [],
        oldCoverList: [],
        layoutName: [],
        liveLayout: []
      },
      // 课程难易程度 下拉选项
      liveSourceList: [
        {
          label: '小橙',
          value: 'xc'
        },
        {
          label: '知鸟',
          value: 'zn'
        }
      ],
      // 课程上传预览 验证规则
      liveBroadcastRules: {
        coverList: [
          {
            required: true,
            message: '请上传课程封面'
          }
        ],
        introduce: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写课程简介'
          }
        ],
        coursewareType: [
          {
            required: true,
            message: '请选择课程类型'
          }
        ],
        source: [
          {
            required: true,
            message: '请选择课程来源'
          }
        ],
        fileList: [
          {
            required: true,
            type: 'array',
            message: '请填上传课件'
          }
        ],
        duration: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写课程时长'
          },
          {
            type: 'number',
            trigger: 'blur',
            message: '课程时长应是数字'
          }
        ],
        thirdCourseId: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写第三方课程id'
          }
        ],
        completePercent: [
          {
            required: true,
            message: '请选择课程完成标准'
          }
        ]
      },
      // 合规自查申明 dialog 状态
      selfExaminationVisible: false,
      // 合规自查申明 同意框
      selfExamination: false,
      // 页面状态
      state: '',
      stateMap: {
        add: '新增直播',
        edit: '修改直播'
      },
      // 关闭当前页面工具函数
      closeCurrPageAndGoPath,
      gtNow,
      // 分页工具函数
      currentChange,
      sizeChange,
      // 放重复提交
      isSubmit: false,
      // 是否可以修改 是否需要重新发起审批 的状态
      isChange: false,
      // 是否需要重新发起审批
      isNeedApproval: false,
      eoaStatus: '',
      // 时间限制工具函数
      handleEndPickerOptions,
      handleStartPickerOptions
    }
  },
  methods: {
    // 拟定结束日期 限制
    handleplanEndDate() {
      return {
        // el-date-picker 结束时间限制
        disabledDate: (time) =>
          !(
            formatDate(time) >= this.establishForm.planStartDate &&
            formatDate(time) <=
              this.establishForm.planStartDate.replace(/\d{4}/, (v) => +v + 1)
          )
      }
    },
    handleLiveTypeInput(val) {
      if (val === 'ONCE') {
        this.establishForm.liveProposalName = ''
      }
    },
    // 直播类型 change 事件
    handleLiveTypeChange() {
      this.$refs.liveProposalName.resetField()
      this.establishForm.planStartDate = formatDate(new Date())
      this.establishDisabled = false
    },
    // 判断改系列是否已立项
    seriesIsEstablish(tagId) {
      if (!tagId) return
      tagId = tagId.slice(-1)[0]
      this.$refs.liveProposalName.clearValidate()
      const liveProposalName = (
        deepSearchVal(this.courseClassifyOptions, tagId, {
          valueKey: 'tagId'
        }) || {}
      ).tagName
      const data = { liveProposalName }
      this.$axios
        .post(
          '/fn/privatewealth/live/selectApprovedLiveProposalByProposalName',
          data,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.handleEstablishInfo(data)
          }
        })
    },
    // 处理直播立项名称修改事件
    liveProposalNameBlur() {
      const value = this.establishForm.liveProposalName
      if (!value || value === this.liveNameBack) return
      this.$axios
        .post(
          '/fn/privatewealth/live/selectApprovedLiveProposalByProposalName',
          { liveProposalName: this.establishForm.liveProposalName },
          jsonHeaders
        )
        .then((res) => {
          const { data } = res.data
          this.liveNameBack = value
          if (data) {
            hintFrame('该系列已存在，是否填系列信息？').then((_) => {
              this.handleEstablishInfo(data)
            })
          }
        })
    },
    // 处理立项信息
    handleEstablishInfo(data) {
      const keys = [
        'planStartDate',
        'planEndDate',
        'planJoinNum',
        'liveProposalIntroduce'
      ]
      keys.forEach((key) => {
        this.establishForm[key] = data?.[key] || ''
      })
      this.establishForm.planStartDate =
        data?.planStartDate || formatDate(new Date())
      this.establishDisabled = !!data
      this.$refs.establishFormRef.clearValidate()
    },
    // 课程研发人 远程搜索
    developerUmQuerySearch(queryString, cb) {
      const data = { empName: queryString }
      this.$axios
        .post('/fn/user/listUserInfos', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.list.forEach((v) => {
              v.empName = `${v.empName}(${v.umId})`
            })
            cb(data.list)
          }
        })
    },
    // 课程研发人select事件
    handleDeveloperUmSelect(item) {
      // this.establishForm.developerUm = item.empno;
    },
    // 获取上架栏目下拉选项
    getColumnList() {
      this.$axios
        .post('/fn/privatewealth/layout/findLayoutTree', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const results = data.filter((v) => v.layoutId === 2)
            this.handleColumnList(results)
            this.columnList = results
          }
        })
    },
    // 不是最后一层的禁用
    handleColumnList(arr) {
      arr.forEach((v) => {
        if (v.childs?.length) {
          v.disabled = true
          this.handleColumnList(v.childs)
        }
      })
    },
    // 移除 授课讲师
    delLeaderUm(index) {
      if (this.liveBroadcastForm.teacherUmList.length === 1) return
      this.liveBroadcastForm.teacherUmList.splice(index, 1)
    },
    // 添加 授课讲师
    addLeaderUm() {
      if (this.liveBroadcastForm.teacherUmList.length >= 3) {
        return this.$message.warning('授课讲师最多三个')
      }
      this.liveBroadcastForm.teacherUmList.push('')
    },
    // 授课讲师 远程搜索
    querySearch(queryString, cb) {
      const data = { empName: queryString }
      this.$axios
        .post('/fn/user/listUserInfos', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.list.forEach((v) => {
              v.empName = `${v.empName}(${v.umId})`
            })
            cb(data.list)
          }
        })
    },
    nextStep() {
      this.active++
    },
    preStep() {
      this.active--
    },
    // 审批链确认事件
    approvalChainConfirm(data) {
      this._.merge(this.establishForm, data)
    },
    // 递归查找系列id
    deepSearchId(id, arr) {
      let res
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item.children) {
          res = this.deepSearchId(id, item.children)
          if (res) {
            res.unshift(item.tagId)
            return res
          }
        }
        if (item.tagId === id) {
          return [id]
        }
      }
      return res
    },
    // 后台数据转换为前端需要的数据
    backgroundDataToCurrentPageData(data) {
      // 立项信息 数据处理
      if (data.liveType === 'EXIST') {
        delayCall(
          () => {
            this.establishForm.liveProposalName = this.deepSearchId(
              data.tagId,
              this.courseClassifyOptions
            )
          },
          () => this.courseClassifyOptions?.length
        )
      }
      merge(this.establishForm, data)

      // 处理直播数据
      let liveData = (data.liveList || [])[0]
      if (liveData) {
        liveData.liveUmInfo = `${liveData.liveUmName}(${liveData.liveUmId})`
        liveData.teacherUmList = liveData.teacherList?.map(
          (item) => `${item.teacherName}(${item.teacherUm})`
        )
        if (!liveData.teacherUmList) liveData.teacherUmList = ['']
        // 处理上架栏目数据
        liveData.liveLayout =
          liveData.liveLayoutList?.map((v) => v.layoutId) || []
        liveData.layoutName =
          liveData.liveLayoutList?.map((v) => v.layoutName) || []
        liveData.coverType = liveData.coverUdmp ? 1 : 2
        // 处理直播标签
        liveData.coverList = [
          {
            udmpId: liveData.coverUdmp,
            fileName: liveData.coverName
          }
        ]
        liveData.oldCoverList = [
          {
            url: handleUdmpHref(liveData.coverUdmp),
            name: liveData.coverName,
            uid: liveData.coverUdmp
          }
        ]

        // 处理 小橙业务类型数据
        // const busiTypeTag = liveData.busiTypeTag;
        // liveData.busiTypeTag = busiTypeTag.reduce((prev, cur) => {
        //     prev.push(`${cur.tagName}-${cur.tagId}`)
        //     return prev
        // }, [])
        // $(".busiTypeTag input").val(liveData.busiTagStr)
        // // 处理 小橙栏位类型数据
        // const layoutTypeTag = liveData.layoutTypeTag;
        // liveData.layoutTypeTag = layoutTypeTag.reduce((prev, cur) => {
        //     prev.push(`${cur.tagName}-${cur.tagId}`)
        //     return prev
        // }, [])
        // $(".layoutTypeTag input").val(liveData.layoutTagStr)

        this.liveBroadcastForm = liveData
      }

      // this.eoaStatus = data.eoaStatus;
    },
    // 当前数据转换为后台需要的数据
    CurrentPageDataTobackgroundData() {
      // 课程信息
      const establishForm = CopyObj(this.establishForm)
      const timeKeys = ['planEndDate', 'planJoinNum']
      timeKeys.forEach((key) => {
        establishForm[key] = establishForm[key] || null
      })
      if (establishForm.liveType === 'EXIST') {
        const tagId = establishForm.liveProposalName.slice(-1)[0]
        const item =
          deepSearchVal(this.courseClassifyOptions, tagId, {
            valueKey: 'tagId'
          }) || {}
        establishForm.tagId = tagId
        establishForm.liveProposalName = item.tagName
      }
      const data = { ...establishForm }
      if (this.courseId) {
        data.courseId = this.courseId
      }

      //  处理直播数据
      const liveBroadcastForm = CopyObj(this.liveBroadcastForm)

      // 处理上架栏目数据
      // TODO: 需要处理反选
      const layoutNames = this.$refs.layoutTreeDropdownRef.content
      liveBroadcastForm.liveLayoutList = liveBroadcastForm.liveLayout.map(
        (v, i) => ({ layoutId: v, layoutName: layoutNames[i] })
      )

      const { coverList } = liveBroadcastForm
      if (coverList.length) {
        liveBroadcastForm.coverUdmp = coverList[0].udmpId
        liveBroadcastForm.coverName = coverList[0].fileName
      }

      if (liveBroadcastForm.liveUmInfo) {
        let liveId = liveBroadcastForm.liveUmInfo.split('(')[1].replace(')', '')
        let liveName = liveBroadcastForm.liveUmInfo.split('(')[0]
        // 由于前端交互为一对一，后端结构为一对多，所以需要采用这种格式
        liveBroadcastForm.liveUmId = liveId
        liveBroadcastForm.liveUmName = liveName
      }

      // 处理讲师数据
      liveBroadcastForm.teacherList = liveBroadcastForm.teacherUmList.map(
        (item) => {
          if (!item) return
          let teacherUm = item.split('(')[1].replace(')', '')
          let teacherName = item.split('(')[0]
          return {
            teacherUm: teacherUm,
            teacherName: teacherName
          }
        }
      )

      data.liveList = [liveBroadcastForm]
      console.log(data, '---- result data ----')
      return data
    },
    // 清除表单数据
    resetFormData() {
      // 立项信息重置
      this.$refs.establishFormRef.resetFields()
      this.establishForm.planStartDate = formatDate(new Date())
      this.$refs.curriculumLabelRef.reset()
      this.$refs.layoutTreeDropdownRef.clear()
      // 直播信息重置
      this.$refs.liveBroadcastFormRef.resetFields()
      this.$refs.courseUploadPreviewUploadRef.clear()

      this.active = 0
      // 课程id 推送记录id重置
      this.courseId = ''
    },
    // 保存草稿
    save() {
      // TODO: 可删
      this.CurrentPageDataTobackgroundData()

      this.validateLivedData().then((err) => {
        if (err) {
          return this.$message.warning(err)
        }
        const data = this.CurrentPageDataTobackgroundData()
        // addProposalAndLiveInfo
        // let url = "/fn/privatewealth/live/addLiveProposal";
        let url = '/fn/privatewealth/live/addProposalAndLiveInfo'
        if (this.id) {
          data.id = this.id
        }
        if (this.state === 'edit') {
          // TODO： 编辑还未对接
          // url = "/fn/privatewealth/live/updateLiveProposal";
        }
        this.$axios.post(url, { data }, jsonHeaders).then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('保存成功')
            closeCurrPageAndGoPath({ path: '/CRLiveBroadcast' })
          }
        })
      })
    },
    // 仅立项审批
    establishApproval() {},
    // 验证直播数据
    validateLivedData() {
      const errors = []
      this.$refs.establishFormRef.validate((valied) => {
        errors[0] = valied ? 0 : '立项信息验证错误'
      })
      // if (!this.pushInfoForm.auditUsers) {
      //     errors[4] = "请填写审批链";
      // }

      return new Promise((resolve, reject) => {
        this.$nextTick(() => resolve(errors.find((v) => v)))
      })
    },
    // 保存并提交
    savaAndSubmit() {
      this.isSubmit = true
      const data = this.CurrentPageDataTobackgroundData()
      this.$axios
        .post('/fn/privatewealth/course/saveAndSendEoa', { data }, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('提交成功')
            closeCurrPageAndGoPath({
              path: '/CRLiveBroadcast'
            })
          }
        })
        .finally(() => {
          this.isSubmit = false
        })
    },
    // 打开合规自查dialog
    openSelfExamination() {
      if (this.isSubmit) return this.$message.warning('请勿重复提交')
      this.validateLivedData().then((res) => {
        if (res) {
          return this.$message.warning(res)
        }
        this.selfExaminationVisible = true
      })
    },
    // 合规自查确认事件
    selfExaminationComfirm() {
      if (!this.selfExamination) {
        return this.$message.warning('请阅读并同意以上约定')
      }
      this.savaAndSubmit()
      this.selfExamination = false
      this.selfExaminationVisible = false
    },
    liveSourceChangeHandle(value) {
      switch (value) {
        case 'zn':
          // 知鸟只能选择关联
          this.liveBroadcastForm.type = 'relation'
          break
      }
    }
  },
  mounted() {
    getOrg().then((res) => {
      this.orgOptions = res
    })
    this.getColumnList()
    getCurriculumTree(
      1,
      this.$store.state.userInfo.blgStripLine,
      1,
      '/fn/course/tag/selectCourseTagsForTk'
    ).then((data) => {
      this.courseClassifyOptions = data
    })
  },
  activated() {
    this.isChange = false
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.resetFormData()
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.id) {
      this.id = params.id
      this.$nextTick(() => {
        this.backgroundDataToCurrentPageData(params)
      })
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/commonScss/common-variate.scss';
.course-recommendation__new-liveBroadcast {
  padding-top: 20px;
  background-color: #fff;
  .content-box {
    margin: 60px auto 20px;
    .el-form-item {
      margin-bottom: 30px;
    }
    .course-info {
      width: 670px;
      margin: auto;
    }
  }

  .mt8 {
    margin-top: 8px;
  }
  .mr6 {
    margin-right: 6px;
  }

  .el-switch {
    width: 24px;
    height: 14px;
    .el-switch__core {
      height: 14px;
      &::after {
        width: 12px;
        height: 12px;
        top: 0;
        left: 0;
      }
    }
    &.is-checked .el-switch__core::after {
      margin-left: 10px;
    }
  }

  .prend {
    .el-checkbox__label {
      font-size: 14px !important;
      color: $tintColor6;
    }
  }
}

.live-dropdown {
  min-width: 670px;
}
</style>
<style lang="scss" scoped>
.checkbox {
  position: relative;
  width: 161px;
  height: 158px;
  .el-checkbox__input {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .el-checkbox__inner {
    border-radius: 50%;
    background-color: #e0e1e3;
  }

  .cover-template {
    position: absolute;
    width: 161px;
    height: 158px;
    left: 0;
    top: 0;
    background: #f5f5f5;
    border-radius: 6px;
    border: 2px solid #f5f5f5;
  }

  &.is-checked {
    .el-checkbox__inner {
      background-color: #fd6720;
    }
    .cover-template {
      border-color: #fd6720;
    }
  }
}
</style>