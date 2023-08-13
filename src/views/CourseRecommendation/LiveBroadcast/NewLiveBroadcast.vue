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
            <el-radio-group
              @input="handleLiveTypeInput"
              v-model="establishForm.liveType"
              @change="handleLiveTypeChange"
              :disabled="sourceType === 'live' || !checkApprovalStatus"
            >
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
              @blur="liveProposalNameBlur"
              v-if="establishForm.liveType !== 'EXIST'"
              v-model="establishForm.liveProposalName"
              :disabled="sourceType === 'live'"
            ></el-input>
            <el-cascader
              v-else
              clearable
              class="w-full"
              :options="courseClassifyOptions"
              :props="{ value: 'tagId', label: 'tagName' }"
              @change="seriesIsEstablish"
              v-model="establishForm.liveProposalName"
              :disabled="sourceType === 'live'"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="拟定开始日期" class="ws dr-label">
            <el-date-picker
              disabled
              class="w-full"
              v-model="establishForm.planStartDate"
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
              :disabled="establishDisabled || !checkApprovalStatus"
              v-model="establishForm.planEndDate"
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
              :disabled="establishDisabled || !checkApprovalStatus"
              v-model="establishForm.planJoinNum"
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
              :disabled="establishDisabled || !checkApprovalStatus"
              v-model="establishForm.liveProposalIntroduce"
            ></el-input>

            <p class="mt15">
              如果涉及直播费用请联系管理员赖龙欢（LAILONGHUAN815）
            </p>
          </el-form-item>
          <el-form-item label="审批链" required v-show="checkApprovalStatus">
            <ApprovalChain
              autoApproval
              chainType="6"
              @confirm="approvalChainConfirm"
            />
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
          <el-form-item label="直播名称" prop="liveName" required>
            <el-input v-model="liveBroadcastForm.liveName"></el-input>
          </el-form-item>
          <el-form-item label="直播源" required>
            <gc-select
              class="padding-0"
              v-model="liveBroadcastForm.liveSource"
              :options="liveSourceList"
              @change="liveSourceChangeHandle"
              :clearable="false"
              :disabled="[2, 3].includes(Number(liveBroadcastForm.liveStatus))"
            ></gc-select>
            <!-- 开播状态不允许编辑 -->
            <el-radio-group
              v-model="liveBroadcastForm.type"
              class="mt15"
              :disabled="
                liveBroadcastForm.liveSource === 'zn' ||
                [2, 3].includes(Number(liveBroadcastForm.liveStatus))
              "
            >
              <el-radio label="new">新增直播</el-radio>
              <el-radio label="relation">关联已有直播</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="直播ID"
            prop="liveId"
            :rules="[
              {
                required: liveBroadcastForm.type === 'relation',
                message: '请填写直播ID',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model="liveBroadcastForm.liveId"
              :disabled="
                liveBroadcastForm.type === 'new' ||
                [2, 3].includes(Number(liveBroadcastForm.liveStatus))
              "
              @blur="getXCLiveDatas"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="机构部门" prop="orgId" required>
            <gc-select
              w1
              class="padding-0"
              k="orgName"
              v="orgId"
              :options="orgOptions"
              v-model="liveBroadcastForm.orgId"
            ></gc-select>
          </el-form-item>
          <el-form-item
            label="直播关键词"
            prop="liveKeyword"
            class="ws dr-label"
            required
          >
            <el-input
              type="textarea"
              resize="none"
              class="h-90"
              v-model="liveBroadcastForm.liveKeyword"
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
              v-model="liveBroadcastForm.liveTagId"
            />
          </el-form-item>
          <el-form-item
            label="小橙业务分类"
            class="ws dr-label"
            prop="busiTypeTag"
            v-if="liveBroadcastForm.liveSource === 'xc'"
          >
            <el-cascader
              class="wfull busiTypeTag"
              clearable
              v-model="liveBroadcastForm.busiTypeTag"
              :options="busiTypeTagOptions"
              :props="{
                value: 'customId',
                label: 'tagName'
              }"
              ref="busiTypeTagRef"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="栏目分类"
            v-if="liveBroadcastForm.liveSource === 'xc'"
          >
            <el-cascader
              class="wfull layoutTypeTag"
              clearable
              v-model="liveBroadcastForm.layoutTypeTag"
              :options="layoutTypeTagOptions"
              :props="{
                value: 'customId',
                label: 'tagName'
              }"
              ref="layoutTypeTagRef"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="主播" required prop="liveUmInfo">
            <el-select
              class="w-full live-um-select"
              v-model="liveBroadcastForm.liveUmInfo"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="developerUmQuerySearch"
              :loading="loading"
            >
              <el-option
                v-for="item in liveUmOptions"
                :key="item.empno"
                :label="item.empName"
                :value="item.empName"
              >
              </el-option>
            </el-select>
            <p v-show="liveBroadcastForm.liveSource !== 'zn'">
              以主播UM号开立直播间，主播和授课讲师可为同一人。<span
                style="color: red"
                >发布直播后，主播不可修改。</span
              >
            </p>
          </el-form-item>
          <el-form-item
            label="授课讲师"
            class="necessary-before"
            prop="addLecturerSelectedList"
          >
            <el-button
              class="button-my-primary-plain ml10"
              @click="addLecturerHandle"
              >添加讲师</el-button
            >
            <gc-table
              class="general__table mt20 table-radio"
              row-key="teacherUm"
              ref="addLecturerSelectedRef"
              :list="addLecturerSelectedRowList"
              :tableList="addLecturerSelectedList"
              drop
              v-show="addLecturerSelectedList.length"
            >
              <el-table-column label="操作" min-width="84" prop="">
                <template slot-scope="scope">
                  <span class="active" @click="removeLecturerHandle(scope.row)"
                    >删除</span
                  >
                </template>
              </el-table-column>
            </gc-table>
          </el-form-item>
          <el-form-item label="直播简介" prop="liveIntroduce">
            <el-input
              type="textarea"
              resize="none"
              class="h-90"
              maxlength="500"
              show-word-limit
              v-model="liveBroadcastForm.liveIntroduce"
              placeholder="限制500字"
            ></el-input>
          </el-form-item>
          <el-form-item label="直播封面">
            <el-radio-group v-model="liveBroadcastForm.coverType">
              <el-radio :label="1" class="mr60">上传封面</el-radio>
              <!-- <el-radio :label="2">使用模版</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="详情封面" prop="detailCoverUdmp">
            <div>
              <gc-upload
                :size="1024"
                single
                ref="courseUploadDetailCoverRef"
                :udmpId.sync="liveBroadcastForm.detailCoverUdmp"
                :fileName.sync="liveBroadcastForm.detailCoverName"
              ></gc-upload>
              <p class="tintColor">
                推荐比例16 ：9，支持 jpg、png格式，文件大小不超过1M
              </p>
            </div>
          </el-form-item>
          <el-form-item
            label="直播开始日期"
            class="ws dr-label"
            prop="liveStartDate"
            required
          >
            <el-date-picker
              class="w-full"
              v-model="liveBroadcastForm.liveStartDate"
              type="datetime"
              placeholder="选择日期时间"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              :disabled="[2, 3].includes(Number(liveBroadcastForm.liveStatus))"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="直播结束日期"
            class="ws dr-label"
            prop="liveEndDate"
            required
          >
            <el-date-picker
              class="w-full"
              v-model="liveBroadcastForm.liveEndDate"
              type="datetime"
              placeholder="选择日期时间"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm"
              format="yyyy-MM-dd HH:mm"
              :picker-options="liveEndDateValidate()"
              :disabled="[2, 3].includes(Number(liveBroadcastForm.liveStatus))"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="课程时长"
            v-if="liveBroadcastForm.liveStatus === '3'"
          >
            <el-input placeholder="请输入" v-model="liveBroadcastForm.duration">
              <i slot="suffix" class="fontColor mr6">分钟</i>
            </el-input>
          </el-form-item>
          <el-form-item
            label="转发/分享"
            class="ws dr-label"
            prop="supportShare"
            required
          >
            <el-radio-group v-model="liveBroadcastForm.supportShare">
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
              v-model="liveBroadcastForm.liveLayout"
              customDropdownTreeClass="live-dropdown"
            />
          </el-form-item>
          <el-form-item label="直播课程角标" class="ws dr-label">
            <el-input
              maxlength="6"
              show-word-limit
              placeholder="限制6字"
              v-model="liveBroadcastForm.layoutCornerMark"
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
      <el-button class="button-w80-h30" @click="save">保存草稿</el-button>
      <el-button
        class="button-w100-h30"
        type="primary"
        @click="establishApproval"
        v-show="
          active === 0 && !isSuccessSeries && establishForm.liveType !== 'ONCE'
        "
        >仅立项发起审批</el-button
      >

      <el-button
        type="primary"
        class="button-w100-h30"
        @click="openSelfExamination"
        v-show="active === stepList.length - 1"
        >{{ isSuccessSeries ? '发布直播' : '保存并发起审批' }}</el-button
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
        <el-checkbox v-model="selfExamination" class="prend"
          >我已仔细阅读并将遵守以上规定</el-checkbox
        >
      </div>
      <p>该直播涉及产品/销售/营销活动已经风险合规评审/自查，不存在以下行为：</p>
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

    <!-- 添加讲师dialog -->
    <!-- 添加讲师 dislog -->
    <gc-model
      title="添加讲师"
      width="1200px"
      customClass="add-lecturer"
      :visible.sync="addLecturerVisible"
      @comfirm="addLecturerComfirm"
      @close="addLecturerClose"
    >
      <div class="between aic">
        <el-form
          ref="form"
          :model="addLecturerForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item label="讲师姓名" class="mb0 mr100">
            <el-input
              class="padding-0"
              v-model="addLecturerForm.teacherName"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师UM" class="mb0">
            <el-input
              class="padding-0"
              v-model="addLecturerForm.teacherUm"
            ></el-input>
          </el-form-item>
          <el-form-item label="" class="mb0">
            <gc-select
              label="是否为外部讲师"
              :options="isExternalOptions"
              v-model="addLecturerForm.isExternal"
              style="padding: 0"
            ></gc-select>
          </el-form-item>
        </el-form>
        <div class="">
          <el-button @click="searchLecturer" class="button-60 button-blue"
            >查询</el-button
          >
          <el-button @click="addLecturerReset" class="button-60"
            >重置</el-button
          >
        </div>
      </div>
      <div class="mt30">
        已选择：<span class="active-no-pointer"
          >{{ addLecturerSelectedCache.length }}人</span
        >
        <span class="tintColor"> （最多选5人） </span>
      </div>
      <gc-table
        class="general__table mt20 table-radio"
        ref="addLecturerRef"
        row-key="teacherUm"
        :list="addLecturerList"
        :tableList="addLecturerTableList"
        @select="addLecturerSelectionChange"
      >
      </gc-table>
      <gc-pagination
        :total="addLecturerForm.total"
        :page-sizes="[5]"
        :page-size="addLecturerForm.pageSize"
        :current-page="addLecturerForm.currPage"
        @sizeChange="sizeChange($event, addLecturerForm, addLecturerQuery)"
        @currentChange="
          currentChange($event, addLecturerForm, addLecturerQuery)
        "
        class="between"
      />
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
  getLableTree,
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
  name: 'CRNewLiveBroadcast',
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
        // 小橙业务分类
        busiTypeTag: [],
        // 小橙栏目分类
        layoutTypeTag: [],
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
        duration: null,
        // 是否支持转发分享；N：不支持；Y：支持
        supportShare: 'Y',
        // 上架栏目id
        layoutId: [],
        // 栏目直播角标
        layoutCornerMark: '',
        coverType: 1,
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
        liveName: [{ required: true, message: '请输入直播名称' }],
        detailCoverUdmp: [
          {
            required: true,
            message: '请上传详情封面'
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
        ],
        liveKeyword: [
          { required: true, message: '请输入直播关键词' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value.split('/').length > 10) {
                return callback(new Error('只能添加10个关键词'))
              }
              return callback()
            }
          }
        ],
        addLecturerSelectedList: [
          {
            validator: (rule, value, callback) => {
              if (!this.addLecturerSelectedList.length) {
                return callback(new Error('请选择授课讲师'))
              }
              return callback()
            }
          }
        ],
        liveTagId: [{ required: true, message: '请选择直播标签' }],
        busiTypeTag: [
          {
            required: true,
            type: 'array',
            message: '请选择小橙业务分类'
          }
        ],
        liveUmInfo: [{ required: true, message: '请选择主播' }],
        orgId: [{ required: true, message: '请选择机构部门' }],
        liveStartDate: [{ required: true, message: '请选择直播开始日期' }],
        liveEndDate: [
          { required: true, message: '请选择直播结束日期' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                new Date(value).getTime() <
                new Date(this.liveBroadcastForm.liveStartDate).getTime()
              ) {
                return callback(new Error('结束时间必须大于开始时间'))
              }
              // 新建小橙状态下，直播时间必须在两小时以内
              if (
                this.liveBroadcastForm.liveSource === 'xc' &&
                this.liveBroadcastForm.type === 'new'
              ) {
                let diffTime =
                  Date.parse(this.liveBroadcastForm.liveEndDate) -
                  Date.parse(this.liveBroadcastForm.liveStartDate)
                if (diffTime < 20 * 60 * 1000 || diffTime > 120 * 60 * 1000) {
                  return callback(
                    new Error('新建小橙直播，直播时间最少20分钟，最多120分钟')
                  )
                }
              }
              // 直播结束不需要进行这个校验
              // if (Number(this.liveBroadcastForm.liveStatus) !== 3 && new Date(value).getTime() < new Date().getTime()) {
              //     return callback(new Error("结束时间必须大于当前时间"))
              // }

              return callback()
            }
          }
        ]
      },
      // 小橙业务分类下啦选项
      busiTypeTagOptions: [],
      // 小橙栏目分类下啦选项
      layoutTypeTagOptions: [],
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
      isNeedApproval: null,
      eoaStatus: '',
      sourceType: '',
      // 是否为已审批通过且未过期的立项
      isSuccessSeries: false,
      // 是否已开播
      isLiveStart: false,
      // 时间限制工具函数
      handleEndPickerOptions,
      handleStartPickerOptions,
      // 添加讲师dialog 状态
      addLecturerVisible: false,
      // 添加讲师dialog form
      addLecturerForm: {
        teacherUm: '',
        teacherName: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      // 添加讲师dialog 字段数组
      addLecturerList: [
        {
          type: 'selection',
          'reserve-selection': true
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          prop: 'teacherName',
          label: '讲师姓名',
          width: '224'
        },
        {
          prop: 'teacherUm',
          label: '讲师UM',
          width: '240'
        },
        {
          prop: 'titleName',
          label: '讲师头衔',
          width: '224'
        },
        {
          label: '是否为外部讲师',
          prop: 'isExternal',
          width: '190',
          ctx: (row) => (row.isExternal === 'N' ? '否' : '是')
        },
        {
          prop: 'goodAtAreasName',
          label: '擅长领域',
          width: '202'
        }
      ],
      // 已选择讲师的表格项
      addLecturerSelectedRowList: [
        {
          type: 'component',
          width: '64',
          'class-name': 'drop',
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h('i', {
                  class: 'el-icon-rank'
                })
              }
            }
          }
        },
        {
          prop: 'teacherName',
          label: '讲师姓名',
          width: '190'
        },
        {
          prop: 'teacherUm',
          label: '讲师UM',
          width: '190'
        }
        // {
        //     prop: "titleName",
        //     label: "讲师头衔",
        //     width: "224"
        // },
        // {
        //     label: "是否为外部讲师",
        //     prop: "isExternal",
        //     width: "190",
        //     ctx: row => row.isExternal === 'N'?'否':'是'
        // },
        // {
        //     prop: "goodAtAreasName",
        //     label: "擅长领域",
        //     width: "202"
        // }
      ],
      // 添加讲师dialog 数据数组
      addLecturerTableList: [],
      // 添加讲师dialog 已选择人数
      addLecturerSelected: 0,
      // 已选讲师list
      addLecturerSelectedList: [],
      // 已选讲师缓存
      addLecturerSelectedCache: [],
      // 外部讲师选项
      isExternalOptions: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      // 最多选择讲师数量
      canSelectedLecturerNum: 5,
      // 主播下拉选择项
      liveUmOptions: [],
      // 主播下拉loading
      loading: false
    }
  },
  computed: {
    checkApprovalStatus() {
      return !this.isSuccessSeries
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
    liveStartDateValidate() {
      return {
        disabledDate: (time) => {
          return !(new Date(time).getTime() > new Date() - 24 * 60 * 60 * 1000)
        }
      }
    },
    // 直播结束时间校验
    liveEndDateValidate() {
      return {
        // el-date-picker 结束时间限制
        disabledDate: (time) => {
          return !(
            new Date(time).getTime() >
            new Date(this.liveBroadcastForm.liveStartDate).getTime() -
              24 * 60 * 60 * 1000
          )
        }
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
      // 如果有data，则取其id
      if (data) {
        this.establishForm.id = data.id
        // this.isNeedApproval = false
        // 判断是否为合规立项
        if (data.eoaStatus === '02002' && data.expire === 'N') {
          this.isSuccessSeries = true
        } else {
          this.isSuccessSeries = false
        }
      } else {
        this.establishForm.id = undefined
        // this.isNeedApproval = true
        this.isSuccessSeries = false
      }

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
      // this.establishDisabled = !!data;
      this.$refs.establishFormRef.clearValidate()
    },
    // 课程研发人 远程搜索
    developerUmQuerySearch(queryString, cb) {
      if (!queryString) {
        this.liveUmOptions = []
        return
      }
      let data = { empName: queryString }
      this.loading = true
      this.$axios
        .post('/fn/user/listUserInfos', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.list.forEach((v) => {
              v.empName = `${v.empName}(${v.umId})`
            })
            this.liveUmOptions = data.list
            // cb(data.list);
          }
        })
        .finally(() => {
          this.loading = false
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
    backgroundDataToCurrentPageData(data, isOnlyLiveData) {
      // 保存直播id
      this.liveId = data.liveId

      if (!isOnlyLiveData) {
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
      }

      // 处理直播数据
      let liveData = (data.liveList || [])[0]
      if (liveData) {
        liveData.liveUmInfo = `${liveData.liveUmName}(${liveData.liveUmId})`

        this.addLecturerSelectedList = liveData.teacherList || []

        // 处理上架栏目数据
        liveData.liveLayout =
          liveData.liveLayoutList?.map((v) => v.layoutId) || []
        liveData.layoutName =
          liveData.liveLayoutList?.map((v) => v.layoutName) || []

        // 处理 小橙业务类型数据
        const busiTypeTag = liveData.busiTypeTag
        // const busiTypeTag = liveData.busiTypeTag?.split(",");
        // const busiTagStr = liveData.busiTagStr?.split("/");
        // liveData.busiTypeTag = busiTypeTag?.map(v => ({
        //     tagId: v.tagId,
        //     tagName: v.tagName,
        // }));
        // liveData.busiTypeTag = liveData.busiTypeTag?.map(
        //     (v) => `${v.tagName}-${v.tagId}`
        // );
        liveData.busiTagStr = liveData.busiTagStr?.replace(/-/g, '/')
        // liveData.busiTagStr = liveData.busiTagStr?.replace(
        //     "\//\g",
        //     "-"
        // );
        liveData.busiTypeTag = busiTypeTag.reduce((prev, cur) => {
          prev.push(`${cur.tagName}-${cur.tagId}`)
          return prev
        }, [])
        $('.busiTypeTag input').val(liveData.busiTagStr)
        // 处理 小橙栏位类型数据
        const layoutTypeTag = liveData.layoutTypeTag
        // const layoutTypeTag = liveData.layoutTypeTag?.split(",");
        // const layoutTagStr = liveData.layoutTagStr?.split("/");
        // liveData.layoutTypeTag = layoutTypeTag.reduce((prev, cur) => {
        //     prev.push(`${cur.tagName}-${cur.tagId}`)
        //     return prev
        // }, [])
        liveData.layoutTagStr = liveData.layoutTagStr?.replace(/-/g, '/')
        liveData.layoutTypeTag = layoutTypeTag.reduce((prev, cur) => {
          prev.push(`${cur.tagName}-${cur.tagId}`)
          return prev
        }, [])
        $('.layoutTypeTag input').val(liveData.layoutTagStr)
        // liveData.layoutTypeTag = layoutTypeTag?.map((v, i) => ({
        //     tagId: v.tagId,
        //     tagName: v.tagName,
        // }));
        // liveData.layoutTypeTag = liveData.layoutTypeTag?.map(
        //     (v) => `${v.tagName}-${v.tagId}`
        // );
        this.liveBroadcastForm = liveData
      }
      this.eoaStatus = data.eoaStatus
    },
    // 当前数据转换为后台需要的数据
    CurrentPageDataTobackgroundData() {
      // 课程信息
      const establishForm = CopyObj(this.establishForm)
      const timeKeys = ['planEndDate', 'planJoinNum']
      timeKeys.forEach((key) => {
        establishForm[key] = establishForm[key] || null
      })

      if (this.liveBroadcastForm.liveStartDate) {
        this.liveBroadcastForm.liveStartDate =
          this.liveBroadcastForm.liveStartDate + ':00'
      }
      if (this.liveBroadcastForm.liveEndDate) {
        this.liveBroadcastForm.liveEndDate =
          this.liveBroadcastForm.liveEndDate + ':00'
      }

      if (establishForm.liveType === 'EXIST') {
        const tagId = establishForm.liveProposalName?.slice(-1)[0]
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
      liveBroadcastForm.liveTagStr = this.$refs.curriculumLabelRef
        .getArrayObject()
        .map((v) => {
          const id = []
          while (v) {
            if (v.tagName !== '私行财富') {
              id.unshift(v.tagName)
            }
            v = v.parent
          }
          return id.join('-')
        })
      liveBroadcastForm.liveTagStr = liveBroadcastForm.liveTagStr.join('$#$')
      console.log(liveBroadcastForm.liveTagStr, 'liveBroadcastForm.liveTagStr')
      // 处理 小橙业务类型数据
      console.log(liveBroadcastForm.busiTypeTag, ' ---- busitypegat ---')
      const busiTypeTag = liveBroadcastForm.busiTypeTag
      liveBroadcastForm.busiTagStr = busiTypeTag
        .reduce((prev, cur) => {
          prev.push(cur.split('-')[0])
          return prev
        }, [])
        .join('-')
      // 只传最后一级
      try {
        let arr = busiTypeTag[busiTypeTag.length - 1].split('-')
        liveBroadcastForm.busiTypeTag = [
          {
            tagId: arr[1],
            tagName: arr[0]
          }
        ]
      } catch (error) {
        liveBroadcastForm.busiTypeTag = []
      }
      // liveBroadcastForm.busiTypeTag = busiTypeTag.map(item => {
      //     let arr = item.split('-')
      //     return {
      //         tagId: arr[1],
      //         tagName: arr[0]
      //     }
      // })
      // liveBroadcastForm.busiTypeTag = busiTypeTag
      //     ?.map((v) => v.split("-")[1])
      //     .join(",");
      // liveBroadcastForm.busiTypeTag = busiTypeTag
      //     ?.map((v) => v.split("-")[0])
      //     .join("/");
      // 处理 小橙栏位类型数据
      const layoutTypeTag = liveBroadcastForm.layoutTypeTag
      liveBroadcastForm.layoutTagStr = layoutTypeTag
        .reduce((prev, cur) => {
          prev.push(cur.split('-')[0])
          return prev
        }, [])
        .join('-')
      // 只传最后一级
      try {
        let arr = layoutTypeTag[layoutTypeTag.length - 1].split('-')
        liveBroadcastForm.layoutTypeTag = [
          {
            tagId: arr[1],
            tagName: arr[0]
          }
        ]
      } catch (error) {
        liveBroadcastForm.layoutTypeTag = []
      }
      console.log(liveBroadcastForm, ' ---- liveBroadcastForm ---')

      // liveBroadcastForm.layoutTypeTag = layoutTypeTag.map(item => {
      //     let arr = item.split('-')
      //     return {
      //         tagId: arr[1],
      //         tagName: arr[0]
      //     }
      // })
      // 处理上架栏目数据
      // TODO: 需要处理反选
      const layoutNames = this.$refs.layoutTreeDropdownRef.content
      liveBroadcastForm.liveLayoutList = liveBroadcastForm.liveLayout.map(
        (v, i) => ({ layoutId: v, layoutName: layoutNames[i] })
      )

      // TODO: 这里的业务交互逻辑需要优化
      if (
        liveBroadcastForm.liveUmInfo &&
        liveBroadcastForm.liveUmInfo.includes('(') &&
        liveBroadcastForm.liveUmInfo.includes(')')
      ) {
        let liveId = liveBroadcastForm.liveUmInfo.split('(')[1].replace(')', '')
        let liveName = liveBroadcastForm.liveUmInfo.split('(')[0]
        // 由于前端交互为一对一，后端结构为一对多，所以需要采用这种格式
        liveBroadcastForm.liveUmId = liveId
        liveBroadcastForm.liveUmName = liveName
      }

      // 讲师数据
      liveBroadcastForm.teacherList = this.addLecturerSelectedList.map(
        (item, index) => ({
          ...item,
          pageSort: index,
          i: index
        })
      )

      // 如果时间为空，则需要把时间字段去除，否则后端报错
      if (!liveBroadcastForm.liveStartDate) {
        Reflect.deleteProperty(liveBroadcastForm, 'liveStartDate')
      }
      if (!liveBroadcastForm.liveEndDate) {
        Reflect.deleteProperty(liveBroadcastForm, 'liveEndDate')
      }
      liveBroadcastForm.duration = liveBroadcastForm.duration ? liveBroadcastForm.duration : null
      // 推送信息 放到 liveBroadcastForm 上
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

      this.active = 0
      // 课程id 重置
      this.courseId = ''
    },
    // 保存草稿
    save() {
      if (!this.liveBroadcastForm.liveName)
        return this.$message.warning('请输入直播名称')
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
    },
    // 仅立项审批
    establishApproval() {
      // TODO: 要和公用校验做整合
      let errorMsg = ''
      this.$refs.establishFormRef.validate((valied) => {
        if (!valied) {
          errorMsg = '立项信息验证错误'
        }
      })

      if (!this.establishForm.auditUsers && !this.isSuccessSeries) {
        errorMsg = '请填写审批链'
      }

      if (errorMsg) {
        return this.$message.warning(errorMsg)
      }

      const data = this.CurrentPageDataTobackgroundData()

      // 去掉livelist
      Reflect.deleteProperty(data, 'liveList')

      // 校验立项信息
      this.$axios
        .post('/fn/privatewealth/live/sendProposalEoa', { data }, jsonHeaders)
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
    // 验证直播数据
    // TODO: 分离立项和直播的校验方法
    validateLivedData(onlyEstablish) {
      const errors = []
      this.$refs.establishFormRef.validate((valied) => {
        errors[0] = valied ? 0 : '立项信息验证错误'
      })

      if (!this.establishForm.auditUsers && !this.isSuccessSeries) {
        errors[4] = '请填写审批链'
      }

      this.$refs.liveBroadcastFormRef.validate((valied) => {
        errors.push(valied ? 0 : '直播信息验证错误')
      })

      if (
        !this.liveBroadcastForm.liveUmInfo.includes('(') ||
        !this.liveBroadcastForm.liveUmInfo.includes(')')
      ) {
        errors.push('请正确选择主播')
      }

      // 校验讲师
      if (!this.addLecturerSelectedList.length) {
        errors.push('请选择讲师')
      }

      // 开播时间和结播时间必须为同一天
      console.log(
        this.liveBroadcastForm.liveStartDate,
        this.liveBroadcastForm.liveEndDate
      )
      if (
        this.liveBroadcastForm.liveStartDate.split(' ')[0] !==
        this.liveBroadcastForm.liveEndDate.split(' ')[0]
      ) {
        errors.push('开播时间和结播时间必须为同一天')
      }

      return new Promise((resolve, reject) => {
        this.$nextTick(() => resolve(errors.find((v) => v)))
      })
    },
    // 保存并提交EOA审批
    savaAndSubmit() {
      this.isSubmit = true
      const data = this.CurrentPageDataTobackgroundData()
      // 保存直播的话需要发type为1
      data.type = this.isSuccessSeries ? '1' : '2'

      this.$axios
        .post(
          '/fn/privatewealth/live/saveProposalLiveInfoAndSendEoa',
          { data },
          jsonHeaders
        )
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

      // TODO： 需要去掉
      // this.selfExaminationVisible = true;

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
      this.validateLivedData().then((res) => {
        if (res) {
          return this.$message.warning(res)
        }
        this.savaAndSubmit()
        this.selfExamination = false
        this.selfExaminationVisible = false
      })
    },
    liveSourceChangeHandle(value) {
      switch (value) {
        case 'zn':
          // 知鸟只能选择关联
          this.liveBroadcastForm.type = 'relation'
          break
      }
    },
    // 添加讲师查询重置
    addLecturerReset() {
      resetObj(this.addLecturerForm, { currPage: 1, pageSize: 5 })
      this.addLecturerQuery()
    },
    // 选择讲师dialog table 选项变化事件
    addLecturerSelectionChange(selection, row) {
      // 变更的时候，如果 row 不存在 selection里面，说明是取消勾选，把缓存中的对应项去掉，否则加入到缓存中
      if (
        !selection.find(
          (selectionItem) => selectionItem.teacherUm === row.teacherUm
        )
      ) {
        this.addLecturerSelectedCache = this.addLecturerSelectedCache.filter(
          (filterItem) => filterItem.teacherUm !== row.teacherUm
        )
      } else {
        if (
          this.addLecturerSelectedCache.length >= this.canSelectedLecturerNum
        ) {
          console.log('object')
          this.$refs.addLecturerRef.$refs.gcTable.toggleRowSelection(
            selection.pop(),
            false
          )
          this.$message.warning(
            `最多只能选择${this.canSelectedLecturerNum}名讲师`
          )
          return
        }
        this.addLecturerSelectedCache.push(row)
      }

      this.addLecturerSelected = this.addLecturerSelectedCache.length
    },
    // 选择讲师dialog 确认事件
    addLecturerComfirm() {
      // const selection = this.$refs.addLecturerRef.$children[0].selection;
      // this.addLecturerSelectedList = CopyObj(selection)
      this.addLecturerSelectedList = CopyObj(this.addLecturerSelectedCache)
      this.addLecturerVisible = false
      this.$refs.liveBroadcastFormRef.validateField('addLecturerSelectedList')
    },
    // 选择讲师dialog 关闭事件
    addLecturerClose() {
      resetObj(this.addLecturerForm, { pageSize: 5, currentPage: 1 })
      this.addLecturerSelected = 0
      this.addLecturerTableList = []
      this.addLecturerVisible = false
    },
    // 添加讲师，拉取讲师数据， 并展开dialog
    addLecturerHandle() {
      this.addLecturerVisible = true
      this.addLecturerSelected = this.addLecturerSelectedList.length
      // 展开弹窗的时候， 已选列表加入到缓存
      this.addLecturerSelectedCache = CopyObj(this.addLecturerSelectedList)
      this.addLecturerQuery()
    },
    // 拉取讲师数据
    addLecturerQuery(reset) {
      if (reset) {
        this.addLecturerForm.currPage = 1
        this.addLecturerForm.pageSize = 5
      }
      this.$axios
        .post(
          '/fn/privatewealth/teacher/teacherList',
          { data: this.addLecturerForm },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.addLecturerForm.total = total
            this.addLecturerTableList = list
            this.setLecturerDefaultSelected()
          }
        })
    },
    // 删除讲师
    removeLecturerHandle(row) {
      this.addLecturerSelectedList = this.addLecturerSelectedList.filter(
        (item) => item.teacherUm !== row.teacherUm
      )
    },
    // 设置讲师默认选中状态
    setLecturerDefaultSelected() {
      this.$nextTick(() => {
        this.addLecturerTableList.forEach((item) => {
          let status = !!this.addLecturerSelectedCache.find(
            (selectItem) => item.teacherUm === selectItem.teacherUm
          )
          this.$refs.addLecturerRef.$refs.gcTable.toggleRowSelection(
            item,
            status
          )
        })
      })
    },
    // 查询讲师
    searchLecturer() {
      this.addLecturerForm.currPage = 1
      this.addLecturerForm.pageSize = 5
      this.addLecturerQuery()
    },
    // 获取小橙分类分类数据
    getBusiTypeTagOptions() {
      const data = { tagType: 2, blgStripLine: 'LS', type: 2 }
      getLableTree(
        '/fn/course/tag/selectCourseTagsForTk',
        { data },
        2,
        (v) => (v.customId = `${v.tagName}-${v.tagId}`)
      ).then((data) => {
        this.busiTypeTagOptions = data
      })
    },
    // 获取小橙栏目分类数据
    getLayoutTypeTagOptions() {
      const data = { tagType: 2, blgStripLine: 'LS', type: 3 }
      getLableTree(
        '/fn/course/tag/selectCourseTagsForTk',
        { data },
        2,
        (v) => (v.customId = `${v.tagName}-${v.tagId}`)
      ).then((data) => {
        this.layoutTypeTagOptions = data
      })
    },
    // 关联小橙的时候，需要根据id去取小橙的信息
    getXCLiveDatas() {
      // 边界：新增直播id状态下不需要处理，编辑直播的时候不需要处理, 只有小橙的需要处理
      if (this.id) return
      if (
        this.liveBroadcastForm.type === 'new' ||
        [2, 3].includes(Number(this.liveBroadcastForm.liveStatus))
      )
        return
      if (this.liveBroadcastForm.liveSource === 'zn') return
      this.$axios
        .post(
          '/fn/privatewealth/liveinfo/getXiaoChengCourseInfoByTopicId',
          { liveId: this.liveBroadcastForm.liveId.trim() },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            console.log(data, this.liveBroadcastForm, '---')
            let arr = []
            if (
              !data.liveTagId &&
              data.liveTagList &&
              data.liveTagList.length
            ) {
              data.liveTagList.forEach((item) => {
                arr.push(item.tagId)
              })
              data.liveTagId = arr.join(',')
            }
            this.mergeLiveData(data)
          }
        })
    },
    // 合并直播数据
    mergeLiveData(data) {
      Object.keys(data).forEach((itemKeys) => {
        if (
          data[itemKeys] === '' ||
          data[itemKeys] === null ||
          data[itemKeys] === undefined ||
          (Array.isArray(data[itemKeys]) && !data[itemKeys].length)
        )
          return
        this.liveBroadcastForm[itemKeys] = data[itemKeys]
      })
      let liveData = { liveList: [CopyObj(this.liveBroadcastForm)] }
      this.backgroundDataToCurrentPageData(liveData, true)
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
    this.$nextTick(() => {
      if (!this.state) {
        closeCurrPageAndGoPath({
          path: '/CRLiveBroadcast'
        })
      }
    })
    this.getBusiTypeTagOptions()
    this.getLayoutTypeTagOptions()
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
      this.establishForm.id = params.id
      this.sourceType = params.sourceType
      this.isNeedApproval = null

      if (params.eoaStatus === '02002' && params.expire === 'N') {
        this.isSuccessSeries = true
      } else {
        this.isSuccessSeries = false
      }

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

.live-um-select :deep(.el-input__suffix) {
  display: none;
}
.necessary-before::before {
  top: 20px;
}
</style>
