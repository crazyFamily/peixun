<template>
  <div class="CaseCenter__addCase">
    <!-- 进度条 -->
    <gcSteps :active="active" :list="stepList"></gcSteps>

    <!-- 内容 -->
    <div class="content-box">
      <div v-show="active === 0" class="base-info">
        <el-form class="content-form" label-width="100px">
          <el-form-item label="案例名称" prop="caseName">
            <el-input :value="baseInfoForm.caseName"></el-input>
          </el-form-item>
          <el-form-item label="一句话简介" prop="briefIntroduction">
            <el-input :value="baseInfoForm.briefIntroduction"></el-input>
          </el-form-item>
          <el-form-item label="课程缩略图" prop="thumbnail">
            <div class="df">
              <gc-upload
                disabled
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
            <el-input :value="baseInfoForm.belongOrgStr"></el-input>
          </el-form-item>
          <el-form-item prop="shareStatus">
            <div slot="label" class="aic">共享设置
              <el-tooltip placement="bottom" popper-class="table-popper" effect="light">
                <div slot="content" style="width: 300px">
                  <p class="mt5">共享：其他管理员也可查看、推送此案例</p>
                  <p class="mt5">不共享：仅自己和上级机构管理员可查看、推送此案例</p>
                </div>
                <i class="el-icon-question active"></i>
              </el-tooltip>
            </div>
            <el-radio-group :value="baseInfoForm.shareStatus">
              <el-radio label="Y">共享</el-radio>
              <el-radio label="N">不共享</el-radio>
            </el-radio-group>
          </el-form-item>
         <!-- <select-person-item
            :isDetail="true"
            :crowdBatchId="baseInfoForm.crowdBatchId"
            :crowdOrgs="baseInfoForm.crowdOrgs" /> -->
          <set-crowd-item
            :isDetail="true"
            :crowdBatchId="baseInfoForm.crowdBatchId"
            :crowdOrgs="baseInfoForm.crowdOrgs" />
          <el-form-item label="制作人">
            <div
              class="df" :class="{ mb20: i < baseInfoForm.makePersonList.length - 1 }"
              v-for="(item, i) in baseInfoForm.makePersonList" :key="i" >
               <template v-if="item.isEx">
                <el-input class="w-120" v-model="item.umId" placeholder="UM号" />
                <el-input class="ml10" style="width:70px;" v-model="item.umName" placeholder="姓名" />
              </template>
              <el-input v-else class="w-200" :value="item.label" />
            </div>
          </el-form-item>
          <el-form-item label="分享人">
            <div
              class="df" :class="{ mb20: i < baseInfoForm.sharePersonList.length - 1 }"
              v-for="(item, i) in baseInfoForm.sharePersonList" :key="i" >
               <template v-if="item.isEx">
                <el-input class="w-120" v-model="item.umId" placeholder="UM号" />
                <el-input class="ml10" style="width:70px;" v-model="item.umName" placeholder="姓名" />
              </template>
              <el-input v-else class="w-200" :value="item.label" />
            </div>
          </el-form-item>
          <el-form-item label="案例分类" prop="businessLine">
            <gc-select class="w-200" :options="caseClassifyOptions" disabled :value="baseInfoForm.businessLine"></gc-select>
          </el-form-item>
          <el-form-item label="案例标签" prop="tagName">
            <CurriculumLabel
              ref="curriculumLabelRef"
              :courseTag="baseInfoForm.tagName"
              :tree="caseTagOptions"
              :isShowAdd="false"
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
                  :value="keyWord.value"
                  :maxlength="8"
                  placeholder="最多8个字符"
                >
                </el-input>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active === 1" class="case-content">
        <el-form
          class="content-form"
          ref="caseContentFormRef"
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
                <el-input class="w-250" :value="item.coursewareName"></el-input>
                <span class="case-type mr10">{{ item.typeStr }}</span>
                <el-select class="sw-90" v-if="isShowModule(item)" v-model="item.showModule" disabled>
                  <el-option v-for="(item, index) in CONTEXTSHOWMODULE" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span v-else class="sw-90"></span>
                <div class="case-time ml10">
                  <el-time-picker
                    disabled
                    class="w-100"
                    :value="item.time"
                    :clearable="false"
                    value-format="HH:mm:ss"
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
                  class="active ml10 w50"
                  @click="downloadCourseHandle(item)"
                  >下载</span
                >
                <!-- <span class="active">删除</span> -->
              </div>
            </div>
          </el-form-item>
          <el-form-item label="案例类型">
            <el-input class="w700" :value="caseContentForm.caseTypeStr"></el-input>
          </el-form-item>
          <el-form-item label="案例时长">
            <el-input class="w700" readonly :value="caseDuration"></el-input>
          </el-form-item>
          <el-form-item label="进度条控制" prop="progressControl">
            <el-radio-group :value="caseContentForm.progressControl">
              <el-radio label="allow"
                >允许用户拖动音频、视频课件的进度条
              </el-radio>
              <el-radio label="forbit" class="ml10">禁止拖动 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="已学规则" prop="studyRule">
            <el-radio-group :value="caseContentForm.studyRule">
              <el-radio label="all">全部课件已学，标记为已学 </el-radio>
              <el-radio label="one" class="ml70"
                >任意一个课件已学，标记为已学
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="section">
            <el-form-item label-width="0" class="mb0" prop="vStudyRule">
              <p>纯视频/纯音频课件</p>
              <el-radio-group :value="caseContentForm.vStudyRule">
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
              <p class="mb0">图文课件</p>
              <div class="df">
                <span>按照学习时间计算，至少学习 </span>
                <el-input
                  class="w-80 ml10 mr6"
                  :value="caseContentForm.cStudyDuration"
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

        <!-- 案例文稿 -->
        <CaseDraft
          :show.sync="isCaseDraftShow"
          :course-info="draftInfoRow"
          disabled
        ></CaseDraft>
     </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeCurrPage()"
        >取消</el-button
      >
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
    </div>
  </div>
</template>

<script>
import {
  merge,
  resetObj,
  secondToHour,
  arrToTree,
  closeCurrPage,
  downloadFile,
  CopyObj
} from '@/util/utils'
import { LINE_LS } from '@/util/constants'
import { fetchListTags } from '@/fetch/caseCenter'
import gcSteps from '@/views/CourseRecommendation/components/gc-steps'
import CaseDraft from './components/CaseDraft.vue'
import SelectPersonItem from '@/components/select-person/SelectPersonItem'
import SetCrowdItem from '@/components/set-crowd/SetCrowdItem'
import { CONTEXTSHOWMODULE } from '../enum.js'
import CurriculumLabel from '../../CurriculumManagement/components/CurriculumLabel.vue'

export default {
  name: 'CasePreview',
  components: {
    gcSteps,
    CaseDraft,
    SetCrowdItem,
    CurriculumLabel,
    SelectPersonItem
  },
  data() {
    return {
      active: 0,
      stepList: ['基本信息', '案例内容'],
      CONTEXTSHOWMODULE,
      baseInfoForm: {
        caseName: '',
        shareStatus: '',
        briefIntroduction: '',
        thumbnail: '',
        belongOrgStr: '',
        businessLine: '',
        tagName: '',
        keyWords: '',
        crowdOrgs: [],
        crowdBatchId: '', // 已导入人员的importId，用于已导入人员列表, 后端返回的
        makePersonList: [{umId: '', umName: '', label: '', isEx: false}],
        sharePersonList: [{umId: '', umName: '', label: '', isEx: false}]
      },
      caseContentForm: {
        caseTypeStr: '',
        caseDuration: '',
        progressControl: '',
        studyRule: '',
        vStudyRule: '',
        cStudyDuration: '0',
        coursewareList: []
      },
      isCaseDraftShow: false,
      draftInfoRow: {},
      editRow: null,
      closeCurrPage,
      typeMap: {
        mp4: '视频',
        mov: '视频',
        mp3: '音频',
        m4a: '音频',
        pdf: '图文'
      },
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
    preStep() {
      this.active--
    },
    nextStep() {
      this.active++
    },
    // 后端数据转换为前端需要的
    async serveToWeb(data) {
      data.caseDuration = secondToHour(data.caseDuration)

      let { makePersonList, sharePersonList, coursewareList } = data
      data.makePersonList = makePersonList?.map(m => ({...m, isEx: m.outsourceStatus === 'Y', label: `${m.umName}(${m.umId})` })) || []
      data.sharePersonList = sharePersonList?.map(m => ({...m, isEx: m.outsourceStatus === 'Y', label: `${m.umName}(${m.umId})` })) || []

      coursewareList = coursewareList || []
      coursewareList.forEach((v) => {
        v.time = v.duration ? secondToHour(v.duration) : '00:00:00'
      })
      if (data?.keyWords && typeof data.keyWords === 'string') {
        data.keyWords = data.keyWords.split(',').map((value) => ({ value }))
      }
      merge(this.baseInfoForm, data)
      merge(this.caseContentForm, data)
    },
    // 重置表单数据
    resetForm() {
      this.active = 0
      resetObj(this.baseInfoForm)
      resetObj(this.caseContentForm)
      this.caseContentForm.cStudyDuration = '0'
    },
    downloadCourseHandle(item) {
      downloadFile(item.udmpId)
    },
    editCaseDraftHandle(row, index) {
      this.draftInfoRow = {
        ...CopyObj(row),
        caseName: this.baseInfoForm.caseName
      }
      this.editRow = index
      this.isCaseDraftShow = true
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
      if(!selectItem) {
        this.baseInfoForm.businessLine = ''
      }
      let newArr = []
      if (selectItem) {
       newArr.push(selectItem)
        arrToTree(newArr, this.tagsList)
        newArr = newArr[0]?.children || []
      }
      this.caseTagOptions = newArr
    },
  },
  computed: {
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
    }
  },
  activated() {
    const params = this.$route.params
    console.log(params, '1111')
    if (params.id) {
      this.resetForm()
      this.serveToWeb(params)
      this.getAllFilter()
    }
  }
}
</script>
<style lang="scss" scoped>
.CaseCenter__addCase {
  .content-box {
    .case-item .active {
      position: unset;
    }
  }
}
</style>
<style lang="scss" scoped>
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
  padding-top: 40px;
  background-color: #fff;
  .content-box {
    width: 840px;
    margin: 50px auto 60px;
    .w700 {
      max-width: 690px;
    }
    .case-item {
      position: relative;
      display: flex;
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
        width: 100px;
        margin-left: 20px;
      }
      .active {
        position: unset;
        width: 24px;
        height: 30px;
        top: 0;
        right: -16px;
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
}
</style>
