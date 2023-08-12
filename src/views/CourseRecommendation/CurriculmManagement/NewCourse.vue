<template>
  <div class="course-recommendation__new-course">
    <!-- 进度条 -->
    <gcSteps :active="active" :list="stepList"></gcSteps>

    <!-- 内容 -->
    <div class="content-box">
      <div v-show="active === 0" class="course-info">
        <el-form ref="courseInfoFormRef" :model="courseInfoForm" :rules="courseInfoRules" label-width="90px">
          <el-form-item label="课程名称" prop="courseName">
            <el-input maxlength="35" show-word-limit placeholder="限制35字" v-model.trim="courseInfoForm.courseName"></el-input>
          </el-form-item>
          <el-form-item label="h5页面别名" prop="h5Alias">
            <el-input maxlength="35" show-word-limit placeholder="限制35字" v-model.trim="courseInfoForm.h5Alias"></el-input>
          </el-form-item>
          <el-form-item label="课程属主部门" class="ws dr-label" prop="blgOrg">
            <gc-select
              w1
              class="padding-0"
              k="orgName"
              v="orgId"
              :options="orgOptions"
              v-model="courseInfoForm.blgOrg"
              @change="changeBtnShow"
            ></gc-select>
          </el-form-item>
          <el-form-item label="课程标签" required="" prop="courseTag">
            <CurriculumLabel
              ref="curriculumLabelRef"
              url="/fn/course/tag/selectCourseTagsForTk"
              :maxValue="6"
              :blgStripLine="$store.state.userInfo.blgStripLine"
              v-model="courseInfoForm.courseTag"
            />
          </el-form-item>
          <el-form-item label="课程系列" class="relative" required="" prop="courseClassify">
            <CurriculumClassification
              ref="curriculumClassificationRef"
              url="/fn/course/tag/selectCourseTagsForTk"
              :blgStripLine="$store.state.userInfo.blgStripLine"
              v-model="courseInfoForm.courseClassify"
            />
          </el-form-item>
          <el-form-item label="课程关键词" prop="keyword" class="ws dr-label">
            <el-input type="textarea" resize="none" class="h-90" v-model="courseInfoForm.keyword"></el-input>
            <p class="shallow">最多支持添加10个关键词，每个关键词限制10个字，关键词用“/”隔开，如：信托/资产提升</p>
          </el-form-item>
          <el-form-item label="适用对象" prop="courseApply">
            <el-input maxlength="50" show-word-limit placeholder="限制50字" v-model="courseInfoForm.courseApply"></el-input>
          </el-form-item>
          <el-form-item label="课程难易程度" class="ws dr-label" prop="difficultyLevel">
            <el-radio-group v-model="courseInfoForm.difficultyLevel" class="dfi fdc">
              <el-radio label="1" class="mb20 mt8">初阶（应知应会基础类/工具物料运用类）</el-radio>
              <el-radio label="2" class="mb20">中阶（业务深度解析类/技能提升熟练运用类/案例分享类）</el-radio>
              <el-radio label="3">高阶（高手训练类或其他）</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程上架时间" class="ws dr-label" prop="upTime">
            <el-date-picker
              class="w-full"
              v-model="courseInfoForm.upTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
              :picker-options="gtNow"
              @change="changeBtnShow"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="课程计划下架时间" class="ws dr-label" prop="planDownType">
            <el-radio-group v-model="courseInfoForm.planDownType" class="between wfull dfi" @change="changeBtnShow">
              <el-radio label="1">季度有效</el-radio>
              <el-radio label="2">半年有效</el-radio>
              <el-radio label="3">年度有效</el-radio>
              <el-radio label="4">
                指定日期<el-date-picker
                  class="w-176 ml10"
                  v-model="courseInfoForm.planDownTime"
                  type="date"
                  :picker-options="gtNow"
                  placeholder="选择日期"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                  @change="changeBtnShow"
                >
                </el-date-picker>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程研发人" class="ws dr-label">
            <el-autocomplete
              class="w-full"
              value-key="empName"
              placeholder="请输入UM号/姓名"
              :trigger-on-focus="false"
              @select="handleDeveloperUmSelect"
              v-model="courseInfoForm.developerUm"
              :fetch-suggestions="developerUmQuerySearch"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="显示笔记" class="ws dr-label">
            <el-radio-group v-model="courseInfoForm.allowNote">
              <el-radio label="Y" class="mr60">是</el-radio>
              <el-radio label="N">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="转发/分享" class="ws dr-label" prop="supportShare">
            <el-radio-group v-model="courseInfoForm.supportShare">
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
              :contentArr="courseInfoForm.layoutName"
              :props="{ children: 'childs', label: 'layoutName' }"
              v-model="courseInfoForm.courseLayout"
            />
          </el-form-item>
          <el-form-item label="栏目课程角标" class="ws dr-label">
            <el-input maxlength="6" show-word-limit placeholder="限制6字" v-model="courseInfoForm.cornerMark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active === 1" class="course-upload-preview">
        <el-form ref="courseUploadPreviewFormRef" :model="courseUploadPreviewForm" :rules="courseUploadPreviewRules" label-width="70px">
          <el-form-item label="课程封面" required>
            <el-radio-group v-model="courseUploadPreviewForm.coverType">
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
                :udmpId.sync="courseUploadPreviewForm.detailCoverUdmp"
                :fileName.sync="courseUploadPreviewForm.detailCoverName"
              ></gc-upload>
              <p class="tintColor">推荐比例16 ：9，支持 jpg、png格式，文件大小不超过1M</p>
            </div>
          </el-form-item>
          <el-form-item label="课程简介" prop="introduce">
            <el-input
              type="textarea"
              resize="none"
              class="h-90"
              maxlength="500"
              show-word-limit
              v-model="courseUploadPreviewForm.introduce"
              placeholder="限制500字"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程详情">
            <div class="kecheng-Btn">
              <el-button @click="showEditor=!showEditor">文稿编辑<i class="el-icon--right" :class="showEditor?'el-icon-caret-bottom':'el-icon-caret-top'"></i></el-button>
              <el-button @click="showUploadImg=!showUploadImg">图片上传<i class="el-icon--right" :class="showUploadImg?'el-icon-caret-bottom':'el-icon-caret-top'"></i></el-button>
            </div>
            <gc-editor
              v-show="showEditor"
              @change="editorChangeHandle"
              :content-text="courseUploadPreviewForm.contentsDocuments"
            ></gc-editor>
          </el-form-item>
          <el-form-item label="课程重点" v-show="showUploadImg">
            <div class="pic-list">
              <div
                class="pic-item-container"
                v-for="(item, index) in courseUploadPreviewForm.keyPointsUrl"
                :key="index">
                <img
                 :src="handleUdmpHref(item.udmpId)"
                  alt=""
                  class="banner-item"
                />
                <div class="dfcc mask-container">
                  <i
                    class="mask-icon el-icon-edit-outline"
                    @click="showUpload(index, 'keyPointUpload')"
                  ></i>
                  <i
                    class="mask-icon el-icon-delete"
                    @click="removePics(index, courseUploadPreviewForm.keyPointsUrl)"
                  ></i>
                </div>
              </div>
              <gc-upload
                  v-if="(courseUploadPreviewForm.keyPointsUrl && courseUploadPreviewForm.keyPointsUrl.length < 5) || !courseUploadPreviewForm.keyPointsUrl"
                  ref="keyPointUpload"
                  :size="1024"
                  :show-file-list="false"
                  @input="handlePics(arguments, courseUploadPreviewForm.keyPointsUrl)"
              ></gc-upload>
            </div>
            <p class="tintColor">支持 jpg、png格式，文件大小不超过1M</p>
          </el-form-item>
          <el-form-item label="课程文稿" v-show="showUploadImg">
            <div class="pic-list">
              <div
                class="pic-item-container"
                v-for="(item, index) in courseUploadPreviewForm.documentsUrl"
                :key="index">
                <img
                 :src="handleUdmpHref(item.udmpId)"
                  alt=""
                  class="banner-item"
                />
                <div class="dfcc mask-container">
                  <i
                    class="mask-icon el-icon-edit-outline"
                    @click="showUpload(index, 'papersUpload')"
                  ></i>
                  <i
                    class="mask-icon el-icon-delete"
                    @click="removePics(index, courseUploadPreviewForm.documentsUrl)"
                  ></i>
                </div>
              </div>
              <gc-upload
                  v-if="(courseUploadPreviewForm.documentsUrl && courseUploadPreviewForm.documentsUrl.length < 10) || !courseUploadPreviewForm.documentsUrl"
                  ref="papersUpload"
                  :size="1024"
                  :show-file-list="false"
                  @input="handlePics(arguments, courseUploadPreviewForm.documentsUrl)"
              ></gc-upload>
            </div>
            <p class="tintColor">支持 jpg、png格式，文件大小不超过1M</p>
          </el-form-item>
          <el-form-item label="课程来源" class="ws dr-label" prop="source">
            <gc-select w1 class="padding-0" :options="sourceOptions" v-model="courseUploadPreviewForm.source" @change="changeBtnShow"></gc-select>
          </el-form-item>
          <el-form-item label="课程类型" prop="coursewareType" v-show="courseUploadPreviewForm.source !== SOURCE_KD">
            <gc-select
              w1
              class="padding-0"
              :options="coursewareTypeOptions"
              v-model="courseUploadPreviewForm.coursewareType"
              @change="changeBtnShow"
            ></gc-select>
          </el-form-item>
          <el-form-item label="课件上传" prop="fileList" v-if="[SOURCE_TMS].includes(courseUploadPreviewForm.source)">
            <process-input
              :accept="(fileListHintDict[courseUploadPreviewForm.coursewareType] || {}).accept"
              :on-before="fileListChangeBefore"
              :on-sucess="fileListChange"
            >
              <span class="ml10 tintColor">{{ (fileListHintDict[courseUploadPreviewForm.coursewareType] || {}).hint }}</span>
            </process-input>
            <div v-for="(item, i) in courseUploadPreviewForm.fileList" :key="item.udmpId">
              <el-input
                v-model="item.fileName"
                class="w250 mt20 mr10"
                value="平安银行教学课件.avi"
                placeholder="点击修改，不能为空，限制20字"
                @blur="fileNameBlur"
              ></el-input>
              <span class="active" @click="fileListDel(i), changeBtnShow">删除</span>
            </div>
          </el-form-item>
          <el-form-item label="课程跳转链接" class="ws dr-label" prop="courseUrl" v-if="courseUploadPreviewForm.source === SOURCE_KD">
            <el-input placeholder="请输入链接地址" v-model="courseUploadPreviewForm.courseUrl" />
          </el-form-item>
          <el-form-item label="课程时长" prop="duration">
            <el-input placeholder="请输入" v-model="courseUploadPreviewForm.duration">
              <i slot="suffix" class="fontColor mr6">分钟</i>
            </el-input>
          </el-form-item>
          <el-form-item label="课程完成标准(完播率)" class="ws dr-label" prop="completePercent" v-if="courseUploadPreviewForm.source !== SOURCE_KD">
            <gc-select w1 class="padding-0" :options="completePercentOptions" v-model="courseUploadPreviewForm.completePercent"></gc-select>
          </el-form-item>
          <el-form-item
            v-if="[SOURCE_ZN, SOURCE_XC].includes(courseUploadPreviewForm.source)"
            prop="thirdCourseId"
            label="第三方课程id"
            class="ws dr-label"
          >
            <el-input maxlength="32" show-word-limit v-model="courseUploadPreviewForm.thirdCourseId" placeholder="请输入第三方课程id"></el-input>
          </el-form-item>
          <el-form-item label="推荐课程">
            <el-button class="button-60-h30 button-my-primary-plain" @click="isShowRecommendModal=true">添加</el-button>
            <span class="ml10 tintColor">最多可添加五门课程</span>
            <div v-if="courseUploadPreviewForm.recommendedCourseList && courseUploadPreviewForm.recommendedCourseList.length">
              <div class="recommend-course-input" v-for="(item, index) in courseUploadPreviewForm.recommendedCourseList" :key="index">
                <el-input v-model="item.courseName" disabled></el-input>
                <span class="recommend-course-status">{{recommendCourseStatus[item.status]}}</span>
                <span class="recommend-course-delete" @click="delRecommendCourse(index)">删除</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="关联考试">
            <div class="exam-wrapper">
              <el-input readonly placeholder="请选择一个考试" v-model="courseUploadPreviewForm.examName"></el-input>
              <!-- <el-button class="exam-button" @click="isExamInfoShow = true">移除</el-button> -->
              <el-button class="button-50-30 button-my-primary-plain ml10" @click="removeExamHandle">移除</el-button>
              <el-button class="button-50-30 button-my-primary-plain ml10" @click="isExamInfoShow = true">添加</el-button>
              <!-- <el-button class="exam-button" @click="isExamInfoShow = true">请选择一个考试</el-button> -->
            </div>
          </el-form-item>
          <div v-for="(make, i) in courseUploadPreviewForm.marketList" :key="i" class="df">
            <div class="f1">
              <el-form-item label="关联营销物料名称" class="ws dr-label" prop="marketUrl">
                <el-input placeholder="请输入营销物料名称" v-model="make.marketName"> </el-input>
              </el-form-item>
              <el-form-item label="关联营销物料链接" class="ws dr-label" prop="marketUrl">
                <el-input placeholder="请输入链接地址" v-model="make.marketUrl"> </el-input>
              </el-form-item>
            </div>
            <div>
              <el-button class="button-50-30 button-my-primary-plain ml10" @click="delMake(i)">移除</el-button>
              <el-button class="button-50-30 button-my-primary-plain ml10" @click="addMake()">添加</el-button>
            </div>
          </div>
        </el-form>
      </div>
      <div v-show="active === 2" class="lecturer-info">
        <div class="card">
          <div class="head">
            <span class="l1 mr10">添加讲师</span>
            <el-button
              :disabled="externalTeacherList.length > 5"
              class="button-60-h30"
              @click="
                addLecturerVisible = true
                addLecturerQuery()
              "
              >添加</el-button
            >
          </div>
          <div class="card-list" :style="{ height: cardListHeight }">
            <div class="df card-item" v-for="card in externalTeacherList" :key="card.teacherUm" :style="{ top: card.top + 'px' }">
              <LecturerCard :data="card" @blur="handleCardBlur(card)" />
              <div class="mt10">
                <el-button v-if="card.i !== 0" class="button-50-28 button-my-primary-plain ml20" @click="upMove(card)">上移</el-button>
                <el-button v-if="card.i !== externalTeacherList.length - 1" @click="downMove(card)" class="button-50-28 button-my-primary-plain ml20"
                  >下移</el-button
                >
                <el-button class="button-50-28 button-my-primary-plain ml20" @click="delCard(card)">移除</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="active === 4" class="exercise-info">
        <el-form ref="exerciseInfoFormRef" :model="exerciseInfoForm" :rules="exerciseInfoRules" label-width="70px">
          <el-form-item label="课程练习">
            <el-switch v-model="exerciseInfoForm.value" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
          </el-form-item>
          <el-form-item label="题目配置">
            <el-radio-group v-model="courseUploadPreviewForm.radio">
              <el-radio :label="3" class="mr60">题目打乱</el-radio>
              <el-radio :label="6" class="mr60">选项打乱</el-radio>
              <el-radio :label="6">交卷后显示答案提示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出题方式">
            <el-radio-group v-model="courseUploadPreviewForm.radio">
              <el-radio :label="3" class="mr60">自主选题</el-radio>
              <el-radio :label="6">随机抽题 <span class="tintColor">（按课程标签匹配题库）</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="title mt40">
            <div class="title__menu"></div>
            题目信息
          </div>
          <div v-if="courseUploadPreviewForm.radio === 3">
            <p class="mt10 ml15">
              共90题，总分120分
              <span class="tintColor"> （单选题30题，共60分; 多选题30题，共60分; 判断题30题，共60分） </span>
            </p>
            <el-form-item label="每题分值" class="ml10 mt20">
              <div class="df">
                <div class="ml10">
                  <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
                    <template slot="prepend">单选题</template>
                  </el-input>
                  <span class="ml10">题/分</span>
                </div>
                <div class="ml80">
                  <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
                    <template slot="prepend">多选题</template>
                  </el-input>
                  <span class="ml10">题/分</span>
                </div>
                <div class="ml80">
                  <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
                    <template slot="prepend">判断题</template>
                  </el-input>
                  <span class="ml10">题/分</span>
                </div>
              </div>
            </el-form-item>
            <div class="between">
              <div class="aic">
                <gc-select class="w-200 mr6"></gc-select>
                <i class="icons-wraning mr20"></i>
                <gc-select class="w-200"></gc-select>
              </div>
              <div class="icons no-line">
                <span class="icons__choiceTopic" @click="openChoiceTopic">
                  <i class="icons__choiceTopic__icon"></i>
                  题库选题</span
                >
                <span class="icons__upload ml10">
                  <i class="icons__upload__icon"></i>
                  模版导入</span
                >
              </div>
            </div>

            <gc-table class="general__table" :list="independentTopicList" :tableList="independentTopicTableList">
              <el-table-column label="操作"></el-table-column>
            </gc-table>
          </div>
          <div v-else>
            <p class="mt10">共10题，总分100分</p>
            <gc-table class="general__table mt20" no-list :tableList="randomTopicTableList">
              <el-table-column label="题型"></el-table-column>
              <el-table-column label="抽题数量">
                <el-input class="w100"></el-input>
              </el-table-column>
              <el-table-column label="每题分值">
                <el-input class="w100"></el-input>
              </el-table-column>
              <el-table-column label="总分"> </el-table-column>
            </gc-table>
          </div>
          <div class="title mt30">
            <div class="title__menu"></div>
            分数线设置
          </div>
          <el-form-item label-width="0" class="fractional-line mt20">
            <el-input placeholder="请输入" v-model="exerciseInfoForm.input1">
              <template slot="prepend">通过分数</template>
            </el-input>
            <span class="ml10">分</span>
          </el-form-item>
        </el-form>
      </div>

      <div v-show="active === 3" class="push-info">
        <el-form label-width="70px" :model="pushInfoForm" :rules="pushInfoRules" ref="pushInfoFormRef">
          <el-form-item label="审批链" required>
            <ApprovalChain autoApproval chainType="4" @confirm="approvalChainConfirm" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeCurrPage()">取消</el-button>
      <el-button class="button-w80-h30" @click="savaDraft" v-if="!isApprovalProgress">保存草稿</el-button>
      <el-button class="button-w80-h30" v-show="active !== 0" @click="preStep">上一步</el-button>
      <el-button class="button-w80-h30" type="primary" v-show="active !== 3" @click="nextStep">下一步</el-button>
      <template v-if="active === 3">
        <el-button v-if="isApprovalProgress && !isNeedApproval" class="button-w100-h30" type="primary" @click="savaDraft">保存并更新</el-button>
        <el-button v-else class="button-w100-h30" type="primary" @click="openSelfExamination">保存并提交审批</el-button>
      </template>
    </div>

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
        <el-form ref="form" :model="addLecturerForm" :inline="true" @submit.native.prevent>
          <el-form-item label="讲师姓名" class="mb0 mr100">
            <el-input class="padding-0" v-model="addLecturerForm.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师UM" class="mb0">
            <el-input class="padding-0" v-model="addLecturerForm.teacherUm"></el-input>
          </el-form-item>
          <el-form-item label="" class="mb0">
            <gc-select label="是否为外部讲师" :options="isExternalOptions" v-model="addLecturerForm.isExternal" style="padding: 0"></gc-select>
          </el-form-item>
        </el-form>
        <div class="">
          <el-button @click="addLecturerQuery(true)" class="button-60 button-blue">查询</el-button>
          <el-button @click="addLecturerReset" class="button-60">重置</el-button>
        </div>
      </div>
      <div class="mt30">
        已选择：<span class="active-no-pointer">{{ addLecturerSelected }}人</span>
        <span class="tintColor"> （最多选5人） </span>
      </div>
      <gc-table
        class="general__table mt20 table-radio"
        ref="addLecturerRef"
        row-key="teacherUm"
        :list="addLecturerList"
        :tableList="addLecturerTableList"
        @selection-change="addLecturerSelectionChange"
      >
      </gc-table>
      <gc-pagination
        :total="addLecturerForm.total"
        :page-sizes="[5]"
        :page-size="addLecturerForm.pageSize"
        :current-page="addLecturerForm.currPage"
        @sizeChange="sizeChange($event, addLecturerForm, addLecturerQuery)"
        @currentChange="currentChange($event, addLecturerForm, addLecturerQuery)"
        class="between"
      />
    </gc-model>

    <!-- 模版导入 dialog -->
    <TemplateImport :visible.sync="topicTemplateImportVisible" />

    <!-- 合规自查申明 dialog -->
    <gc-model title="合规自查申明" width="800px" :visible.sync="selfExaminationVisible" @comfirm="selfExaminationComfirm">
      <div slot="prend">
        <el-checkbox v-model="selfExamination" class="prend">我已仔细阅读并将遵守以上规定</el-checkbox>
      </div>
      <p>该课程涉及产品/销售/营销活动已经风险合规评审/自查，不存在以下行为：</p>
      <p>1.虚假、欺诈、隐瞒或者引人误解的宣传；</p>
      <p>2.损害其他同业信誉；</p>
      <p>3.冒用、使用与他人相同或者相近的注册商标、字号、宣传册页，有可能使金融消费者混淆；</p>
      <p>4.对业绩或者产品收益等夸大宣传；</p>
      <p>5.利用金融管理部门对金融产品和服务的审核或者备案程序，误导金融消费者认为金融管理部门已对该金融产品和服务提供保证；</p>
      <p>6.对未按要求经金融管理部门核准或者备案的金融产品和服务进行预先宣传或者促销；</p>
      <p>7.非保本投资型金融产品营销内容使金融消费者误信能保证本金安全或者保证盈利；</p>
      <p>8.未通过足以引起金融消费者注意的文字、符号、字体等特别标识对限制金融消费者权利的事项进行说明；</p>
      <p>9.违反团体综合金融业务规范用语，比如：交叉销售、产销银、养销银、证销银、银行综拓业务、对公综拓业务等不规范用语。</p>
      <p>10.其他违反消费者权益保护相关法律法规和监管规定的行为。</p>
    </gc-model>

    <!-- 考试选择dialog -->
    <CourseCompExamInfo
      :show.sync="isExamInfoShow"
      :examInfo="selectedExamInfo"
      :examId="courseUploadPreviewForm.examId"
      @confirm="selectedExamHandle"
    ></CourseCompExamInfo>

    <!-- 推荐课程modal弹窗 -->
    <CourseSelectionModal
      :maxNum="5"
      :editCourseId="Number(courseId)"
      :columns="RECOMMEND_COLUMNS"
      :selectedList.sync="courseUploadPreviewForm.recommendedCourseList"
      :isShowModal.sync="isShowRecommendModal"></CourseSelectionModal>
  </div>
</template>

<script setup>
import {
  SOURCE_TMS,
  SOURCE_ZN,
  SOURCE_XC,
  SOURCE_KD,
  sourceOptions,
  coursewareTypeOptions,
  completePercentOptions,
  RECOMMEND_COLUMNS
} from '@/views/CourseRecommendation/enum'
defineExpose({
  SOURCE_KD
})
</script>
<script>
import $ from 'jquery'
import {
  merge,
  gtNow,
  CopyObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  setPageTitle,
  closeCurrPage,
  currentChange,
  handleUdmpHref,
  addAllowKeepAlive,
  closeCurrPageAndGoPath
} from '@/util/utils'
import { getOrg } from '../utils'
import gcUpload from '@/components/upload'
import TreeDropdown from '@/components/dropdown/TreeDropdown'
import LecturerCard from './components/LecturerCard'
import gcSteps from '../components/gc-steps'
import CurriculumLabel from '../../CurriculumManagement/components/CurriculumLabel.vue'
import CurriculumClassification from '../../CurriculumManagement/components/CurriculumClassification.vue'
import TemplateImport from '../components/TemplateImport'
import CourseCompExamInfo from './components/CourseCompExamInfo'
import CourseSelectionModal from './components/CourseSelectionModal'
import gcEditor from '@/views/CourseRecommendation/components/editor'

export default {
  name: 'CRNewCourse',
  components: {
    gcSteps,
    gcUpload,
    LecturerCard,
    TreeDropdown,
    TemplateImport,
    CurriculumLabel,
    CurriculumClassification,
    CourseCompExamInfo,
    CourseSelectionModal,
    gcEditor
  },
  data() {
    return {
      active: 0,
      stepList: ['课程信息', '课程上传与预览', '讲师信息', '审批'],
      // 部门下拉选项
      orgOptions: [],
      // 课程名称备份
      courseNameBack: '',
      // 课程名称验证是否通过
      courseNameValied: false,
      // 课程信息 表单
      courseInfoForm: {
        courseName: '',
        h5Alias: '',
        blgOrg: '',
        courseTag: '',
        courseClassify: '',
        keyword: '',
        courseApply: '',
        difficultyLevel: '',
        upTime: null,
        planDownType: '',
        planDownTime: null,
        developerName: '',
        developerUm: '',
        supportShare: '',
        allowNote: 'N', // 是否展示笔记
        courseLayout: [],
        layoutName: [],
        // developerUm: '',
        cornerMark: ''
      },
      upTimeOptions: {},
      // 课程信息 验证规则
      courseInfoRules: {
        courseName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入课程名称'
          },
          {
            validator: (rule, value, callback) => {
              if (value === this.courseNameBack) return callback()
              this.courseNameBack = value
              this.courseNameValied = false
              this.$axios.post('/fn/privatewealth/course/checkRepeatTkCourseName', { data: { courseName: value } }, jsonHeaders).then((res) => {
                if (res.data.data) {
                  return callback(new Error())
                }
                this.courseNameValied = true
                return callback()
              })
            },
            trigger: 'blur',
            message: '课程名称已存在，请更换'
          }
        ],
        blgOrg: [{ required: true, message: '请选择课程属主部门' }],
        courseTag: [{ required: true, message: '请选择课程标签' }],
        courseClassify: [{ required: true, message: '请选择' }],
        keyword: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback()
              value = value.split('/')
              if (value.length > 10) return callback(new Error('课程关键词最多10个'))
              if (value.some((v) => v.length > 10)) {
                return callback(new Error('每个关键词长度不能大于10'))
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        courseApply: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写适用对象'
          }
        ],
        difficultyLevel: [
          {
            required: true,
            message: '请选择课程难易程度'
          }
        ],
        upTime: [
          {
            required: true,
            message: '请选择课程上架时间'
          }
        ],
        planDownType: [
          {
            required: true,
            message: '请选择课程计划下架时间'
          }
        ],
        developerUm: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写课程研发人'
          }
        ],
        supportShare: [
          {
            required: true,
            message: '请选是否支持分享'
          }
        ]
      },
      // 课程信息 上架栏目 数据对象
      columnList: [],
      // 课程上传预览 表单
      courseUploadPreviewForm: {
        coverType: 1,
        detailCoverUdmp: '',
        detailCoverName: '',
        contentsDocuments: '', // 课程详情
        keyPointsUdmp: '', // 课程重点udmp
        documentsUdmp: '', // 课程文稿udmp
        documentsUrl: [], // 课程文稿url
        keyPointsUrl: [], // 课程重点url
        recommendedCourseList: [], // 推荐课程info
        recommendedCourses:'', // 推荐课程id
        introduce: '',
        coursewareType: '',
        thirdCourseId: '',
        fileList: [],
        duration: 0,
        completePercent: 80,
        source: '',
        marketList: [
          {
            marketName: '',
            marketUrl: ''
          }
        ],
        examId: null,
        examName: '',
        courseUrl: ''
      },
      currEditIndex: '', // 编辑当前文稿/课程重点
      isShowRecommendModal: false, // 推荐课程弹窗
      recommendCourseStatus: {
        '02000': '未上架',
        '02001': '已上架',
        '02002': '已下架',
      },
      // 课程上传预览 验证规则
      courseUploadPreviewRules: {
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
            trigger: 'blur',
            message: '课程时长应是有效的数字',
            validator: (rule, value, callback) => {
              if (!isNaN(value) && value > 0) {
                return callback()
              }
              return callback(new Error())
            }
          },
          {
            trigger: 'blur',
            message: '课程来源是口袋银行时，课程时长最多30分钟',
            validator: (rule, value, callback) => {
              const num = parseFloat(value)
              const isKd = this.courseUploadPreviewForm.source === SOURCE_KD
              if (isKd && num > 30) {
                return callback(new Error())
              }
              return callback()
            }
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
        courseUrl: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入链接地址'
          },
          {
            trigger: 'blur',
            message: '链接地址开头必须是http://或者https://',
            validator: (rule, value, callback) => {
              const link = value.trim().toLowerCase()
              if (new RegExp('^https?://').test(link)) {
                return callback()
              }
              return callback(new Error())
            }
          },
          {
            trigger: 'blur',
            message: '请输入平安域名 *.pingan.com.cn',
            validator: (rule, value, callback) => {
              const link = value.trim().toLowerCase()
              if (new RegExp('^https?://').test(link)) {
              }
              const domain = 'pingan.com.cn'
              const reg = new RegExp(`^https?://[^/]+.${domain}/`)
              if (reg.test(link)) {
                return callback()
              }
              return callback(new Error())
            }
          }
        ]
      },
      // 课件上传 提示 dict
      fileListHintDict: {
        yp: {
          hint: '限制大小20M，音频支持格式：.MP3、.Wav、.Ogg',
          accept: '.MP3,.Wav,.Ogg',
          size: 200 * 1024 * 1024
        },
        sp: {
          hint: '限制大小300M，视频支持格式：.MP4、.WebM、.Ogg',
          accept: '.MP4,.WebM,.Ogg',
          size: 300 * 1024 * 1024
        },
        tw: {
          hint: '限制大小20M，图文支持格式：.pdf',
          accept: '.pdf',
          size: 20 * 1024 * 1024
        }
      },
      // 卡片数据列表
      externalTeacherList: [],
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
      // 添加讲师dialog 数据数组
      addLecturerTableList: [],
      // // 添加讲师dialog 已选择人数
      addLecturerSelected: 0,
      // 练习信息 form
      exerciseInfoForm: {},
      // 练习信息 form rules
      exerciseInfoRules: {},
      // 自主选题 字段数组
      independentTopicList: [
        {
          type: 'index',
          label: '序号',
          width: ''
        },
        {
          label: '题型',
          width: '',
          prop: ''
        },
        {
          label: '题目',
          width: '',
          prop: ''
        },
        {
          label: '选项',
          width: '',
          prop: ''
        },
        {
          label: '标签',
          width: '',
          prop: ''
        },
        {
          label: '难度',
          width: '',
          prop: ''
        }
      ],
      // 自主选题 数据数组
      independentTopicTableList: [],
      // 随机选题 数据数组
      randomTopicTableList: [],
      // 题目模版导入dialog 状态
      topicTemplateImportVisible: false,
      // 推送信息 form
      pushInfoForm: {},
      // 推送信息 form rules
      pushInfoRules: {},
      // 合规自查申明 dialog 状态
      selfExaminationVisible: false,
      // 合规自查申明 同意框
      selfExamination: false,
      // 页面状态
      state: '',
      stateMap: {
        add: '新增课程',
        edit: '修改课程'
      },
      // 培训班id
      courseId: '',
      // 关闭当前页面工具函数
      closeCurrPage,
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
      // 是否选择关联考试
      isExamInfoShow: false,
      // 课程内容字段展示
      showUploadImg: false,
      showEditor: true
    }
  },
  watch: {
    'courseUploadPreviewForm.source': {
      handler(val) {
        if (val === this.SOURCE_KD) {
          this.courseUploadPreviewForm.coursewareType = 'sp'
        }
      }
    }
  },
  methods: {
    // 课程研发人 远程搜索
    developerUmQuerySearch(queryString, cb) {
      const data = { empName: queryString }
      this.$axios.post('/fn/user/listUserInfos', { data }, jsonHeaders).then((res) => {
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
      // this.courseInfoForm.developerUm = item.empno;
    },
    // 获取上架栏目下拉选项
    getColumnList() {
      this.$axios.post('/fn/privatewealth/layout/findLayoutTree', {}, jsonHeaders).then((res) => {
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
    fileListChangeBefore($event) {
      const file = $event.target.files[0]
      const obj = this.fileListHintDict[this.courseUploadPreviewForm.coursewareType]
      if (!obj) {
        this.$message.warning('请先选择课程类型')
        return false
      }
      if (file.size > obj.size) {
        this.$message.warning('文件超出最大限制')
        return false
      }
    },
    // 课程上传与预览 课件上传 change事件
    fileListChange(data) {
      this.courseUploadPreviewForm.fileList.push(data[0])
      this.changeBtnShow()
    },
    // 课程上传与预览 课件删除
    fileListDel(i) {
      this.courseUploadPreviewForm.fileList.splice(i, 1)
    },
    // 文件名input失焦事件
    fileNameBlur(item) {
      const { fileNameBack, fileName, udmpId } = item
      if (fileNameBack !== fileName) {
        const data = { udmpId, fileName }
        this.$axios.post('/common/file/modifyFileName', data, jsonHeaders)
      }
    },
    // 删除一个物料
    delMake(i) {
      if (this.courseUploadPreviewForm.marketList.length < 2) return
      this.courseUploadPreviewForm.marketList.splice(i, 1)
    },
    // 添加一个物料
    addMake() {
      this.courseUploadPreviewForm.marketList.push({
        marketName: '',
        marketUrl: ''
      })
    },
    upMove(curr) {
      const pre = this.externalTeacherList.find((v) => v.i === curr.i - 1)
      ;[curr.top, pre.top, curr.i, pre.i] = [pre.top, curr.top, pre.i, curr.i]
    },
    downMove(curr) {
      const next = this.externalTeacherList.find((v) => v.i === curr.i + 1)
      ;[curr.top, next.top, curr.i, next.i] = [next.top, curr.top, next.i, curr.i]
    },
    // 删除 card
    delCard(card) {
      const index = this.externalTeacherList.indexOf(card)
      this.externalTeacherList.splice(index, 1)
      this.handleCardTop(this.externalTeacherList)
    },
    handleCardTop(cardList) {
      cardList.forEach((v, i) => {
        v.i = i
        v.top = (180 + 10) * i + (i + 1) * 20
      })
    },
    // 添加讲师查询函数
    addLecturerQuery(reset) {
      if (reset) {
        this.addLecturerForm.currPage = 1
        this.addLecturerForm.pageSize = 5
      }
      this.$axios.post('/fn/privatewealth/teacher/teacherList', { data: this.addLecturerForm }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { list, total } = data
          this.addLecturerForm.total = total
          this.addLecturerTableList = list
        }
      })
    },
    // 添加讲师查询重置
    addLecturerReset() {
      resetObj(this.addLecturerForm, { currPage: 1, pageSize: 5 })
      this.addLecturerQuery()
    },
    // 选择讲师dialog table 选项变化事件
    addLecturerSelectionChange(selection) {
      if (selection.length > this.canSelectedLecturerNum) {
        this.$refs.addLecturerRef.$children[0].toggleRowSelection(selection.shift(), false)
      }
      this.addLecturerSelected = selection.length
    },
    // 选择讲师dialog 确认事件
    addLecturerComfirm() {
      const selection = this.$refs.addLecturerRef.$children[0].selection
      const ids = this.externalTeacherList.map((v) => v.teacherUm)
      selection.forEach((v) => {
        if (!ids.includes(v.teacherUm) && this.externalTeacherList.length < 5) {
          v.i = this.externalTeacherList.length
          v.top = (180 + 10) * v.i + (v.i + 1) * 20
          v.src = handleUdmpHref(v.headUdmp)
          this.externalTeacherList.push({ ...v })
        }
      })
      this.addLecturerVisible = false
    },
    // 选择讲师dialog 关闭事件
    addLecturerClose() {
      resetObj(this.addLecturerForm, { pageSize: 5, currentPage: 1 })
      this.addLecturerSelected = 0
      this.addLecturerTableList = []
      this.addLecturerVisible = false
    },
    nextStep() {
      this.active++
    },
    preStep() {
      this.active--
    },
    // 失焦修改讲师简介
    handleCardBlur(card) {
      if (card.introduceBack !== card.introduce) {
        const { teacherUm, introduce } = card
        const data = { teacherUm, introduce }
        this.$axios.post('/fn/privatewealth/teacher/mofiyTeacherIntro', data, jsonHeaders)
      }
    },
    // 打开选择题目
    openChoiceTopic() {
      const params = {}
      addAllowKeepAlive('/CRChoiceTopic')
      this.$router.push({
        name: '题库选题',
        params
      })
    },
    // 审批链确认事件
    approvalChainConfirm(data) {
      this._.merge(this.pushInfoForm, data)
    },
    // 后台数据转换为前端需要的数据
    backgroundDataToCurrentPageData(data) {
      // 课程信息 数据处理
      merge(this.courseInfoForm, data)
      this.courseNameBack = this.courseInfoForm.courseNameBack
      this.courseNameValied = true
      if (this.courseInfoForm.developerUm && this.courseInfoForm.developerName) {
        this.courseInfoForm.developerUm = `${this.courseInfoForm.developerName}(${this.courseInfoForm.developerUm})`
      }
      this.courseInfoForm.courseLayout = data.courseLayoutList?.map((v) => v.layoutId) || []
      this.courseInfoForm.layoutName = data.courseLayoutList?.map((v) => v.layoutName) || []
      // 课程上传与预览 数据处理
      if (!data.marketList?.length) {
        data.marketList = undefined
      }
      merge(this.courseUploadPreviewForm, data)
      this.courseUploadPreviewForm.fileList = data.files.filter((v) => v.submodule === 'course_file')
      this.courseUploadPreviewForm.fileList.forEach((v) => {
        v.fileNameBack = v.fileName
      })
      const { documentsUdmp, keyPointsUdmp } = this.courseUploadPreviewForm
      this.courseUploadPreviewForm.documentsUrl = this.handleReceiveData(documentsUdmp)
      this.courseUploadPreviewForm.keyPointsUrl = this.handleReceiveData(keyPointsUdmp)
      // 讲师信息 数据处理
      data.externalTeacherList.forEach((v) => {
        v.src = handleUdmpHref(v.headUdmp)
        v.introduceBack = v.introduce
      })
      this.handleCardTop(data.externalTeacherList)
      this.externalTeacherList = data.externalTeacherList
      // 推送信息 数据处理
      merge(this.pushInfoForm, data)
      this.eoaStatus = data.eoaStatus
    },
    // 当前数据转换为后台需要的数据
    CurrentPageDataTobackgroundData() {
      // 课程信息
      const courseInfoForm = CopyObj(this.courseInfoForm)
      if (courseInfoForm.developerUm.match(/\((\w+)\)/)) {
        courseInfoForm.developerName = courseInfoForm.developerUm.split('(')[0]
        courseInfoForm.developerUm = courseInfoForm.developerUm.match(/\((\w+)\)/)[1]
      }
      const layoutNames = this.$refs.layoutTreeDropdownRef.content
      courseInfoForm.courseLayoutList = courseInfoForm.courseLayout.map((v, i) => ({ layoutId: v, layoutName: layoutNames[i] }))
      Reflect.deleteProperty(courseInfoForm, 'layoutName')
      Reflect.deleteProperty(courseInfoForm, 'courseLayout')
      // 课程上传与预览
      const courseUploadPreviewFormInfo = CopyObj(this.courseUploadPreviewForm)
      const { fileList,documentsUrl,keyPointsUrl,recommendedCourseList, ...courseUploadPreviewForm } = courseUploadPreviewFormInfo
      fileList.forEach((v) => {
        v.submodule = 'course_file'
      })
      const files = [...fileList]
      let coverUdmp, coverName
      let documents = this.handleSubmitData(documentsUrl, 'udmpId')
      let keyPoints = this.handleSubmitData(keyPointsUrl, 'udmpId')
      let recommendedCourses = this.handleSubmitData(recommendedCourseList, 'courseId')
      Object.defineProperties(courseUploadPreviewForm, 
      { 
        documentsUdmp: {value: documents},
        keyPointsUdmp: {value: keyPoints},
        recommendedCourses: {value: recommendedCourses}
      })
      // 推送信息
      const pushInfoForm = CopyObj(this.pushInfoForm)
      Object.keys(pushInfoForm).forEach((key) => {
        if (Array.isArray(pushInfoForm[key])) {
          pushInfoForm[key] = pushInfoForm[key].join(',')
        }
      })
      const data = {
        ...courseInfoForm,
        ...courseUploadPreviewForm,
        externalTeacherList: this.externalTeacherList,
        files,
        coverUdmp,
        coverName,
        ...pushInfoForm
      }
      // 讲师信息
      data.externalTeacherList.forEach((v) => {
        v.pageSort = v.i
      })
      if (this.courseId) {
        data.courseId = this.courseId
      }
      return data
    },
    // 清除表单数据
    resetFormData() {
      // 课程信息重置
      this.$refs.courseInfoFormRef.resetFields()
      this.$refs.curriculumLabelRef.reset()
      this.$refs.curriculumClassificationRef.$reset()
      this.$refs.layoutTreeDropdownRef.clear()
      this.courseInfoForm.planDownTime = null
      this.courseInfoForm.cornerMark = ''
      // 课件上传与预览重置
      this.$refs.courseUploadPreviewFormRef.resetFields()
      resetObj(this.courseUploadPreviewForm, {
        coverType: 1,
        marketList: [
          {
            marketName: '',
            marketUrl: ''
          }
        ],
        completePercent: 80
      })
      // 讲师信息重置
      this.externalTeacherList = []
      this.$refs.exerciseInfoFormRef.resetFields()
      this.$refs.pushInfoFormRef.resetFields()
      this.active = 0
      // 课程id 推送记录id重置
      this.courseId = ''
    },
    // 保存草稿
    savaDraft() {
      const data = this.CurrentPageDataTobackgroundData()
      if (!data.courseName) {
        return this.$message.warning('请填写课程名字')
      }
      this.$axios.post('/fn/privatewealth/course/savePwCourse', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.$message.success('保存成功')
          this.courseId = data.courseId
        }
      })
    },
    // 验证课程数据
    validateCourseData() {
      const errors = []
      this.$refs.courseInfoFormRef.validate((valied) => {
        errors[0] = valied ? 0 : '课程信息验证错误'
      })
      this.$refs.courseUploadPreviewFormRef.validate((valied) => {
        errors[1] = valied ? 0 : '课程上传与预览验证错误'
      })
      this.$refs.exerciseInfoFormRef.validate((valied) => {
        errors[3] = valied ? 0 : '练习信息验证错误'
      })
      if (!this.pushInfoForm.auditUsers) {
        errors[4] = '请填写审批链'
      }
      // 讲师信息非必填
      errors[2] = 0
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
              path: '/CRCurriculumManagement'
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
      this.validateCourseData().then((res) => {
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
    // 判断是否要 重新发起审批
    changeBtnShow() {
      if (this.isChange) {
        this.isNeedApproval = true
      }
    },
    // 选择考试操作
    selectedExamHandle({ examInfo }) {
      console.log(examInfo, '---->')
      const { id, examName } = examInfo
      this.courseUploadPreviewForm.examId = id
      this.courseUploadPreviewForm.examName = examName
    },
    // 移除考试
    removeExamHandle() {
      this.courseUploadPreviewForm.examId = null
      this.courseUploadPreviewForm.examName = ''
    },
    // 添加课程文稿/课程重点-触发upload
    showUpload(index, refName) {
      this.currEditIndex = index
      this.$refs[refName]
        .uploadInstance()
        .$el.querySelector('.el-upload')
        .click()
    },
    // 删除课程重点/课程文稿
    removePics(index, arr) {
      arr.splice(index, 1)
    },
    // 上传课程重点/课程文稿
    handlePics(arg, arr) {
      const files = arg[0] // 上传的图片信息
      if (this.currEditIndex !== '') { // 编辑更换图片
         this.$set(arr, this.currEditIndex, files[files.length - 1])
         this.currEditIndex = ''
      } else if (files.length) { // 新增
        this.$set(arr, arr.length, files[files.length - 1])
      }
    },
     // 监听富文本组件回调
    editorChangeHandle(data) {
      this.courseUploadPreviewForm.contentsDocuments = data.content
      // this.editorContLen = data.len
      console.log(this.courseUploadPreviewForm.contentsDocuments)
      console.log(data)
    },
    // 处理文稿, 重点, 推荐课程的提交格式
    handleSubmitData(arr, attribute) {
      if (arr && !arr.length) return '';
      let newArr = arr.map(val => {
         return val[attribute]
       })
      return newArr.join(',')
    },
    // 处理返回的文稿/重点的数据格式
    handleReceiveData(str) {
      if (!str) return []
      let finalData = []
      let newData = str.split(',')
      finalData = newData.map( val => {
          return { udmpId: val }
        })
     return finalData  
    },
    // 删除推荐课程
    delRecommendCourse(idx) {
      this.courseUploadPreviewForm.recommendedCourseList.splice(idx, 1)
    },
  },
  mounted() {
    getOrg().then((res) => {
      this.orgOptions = res
    })
    this.getColumnList()
  },
  activated() {
    console.log(1111, this.$route.params)
    this.isChange = false
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.resetFormData()
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.courseId) {
      this.courseId = params.courseId
      this.$nextTick(() => {
        this.backgroundDataToCurrentPageData(params)
        if (this.eoaStatus === '02002') {
          this.isChange = true
        }
      })
    }
  },
  computed: {
    cardListHeight() {
      return this.externalTeacherList.length * 210 - 10 + 'px'
    },
    isApprovalProgress() {
      return this.eoaStatus === '02002'
    },
    selectedExamInfo() {
      if (!this.courseUploadPreviewForm.examId) return {}
      return {
        id: this.courseUploadPreviewForm.examId,
        examName: this.courseUploadPreviewForm.examName
      }
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/commonScss/common-variate.scss';
.course-recommendation__new-course {
  padding-top: 20px;
  background-color: #fff;
  .content-box {
    margin: 60px auto 20px;
    .el-form-item {
      margin-bottom: 30px;
    }
    .course-info,
    .push-info {
      width: 670px;
      margin: auto;
    }
    .course-upload-preview {
      width: 570px;
      margin: auto;
      display: flex;
      .el-form {
        width: 570px;
        margin-right: 60px;
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
      }
      .el-input-group__prepend {
        width: 80px;
      }
    }
    .lecturer-info {
      width: 670px;
      margin: auto;
      display: flex;
      .card {
        width: 625px;
      }
      .card-list {
        position: relative;
        .card-item {
          position: absolute;
          left: 0;
          transition: top 1s;
        }
      }
    }
    .exercise-info {
      width: 1000px;
      margin: auto;
      .el-input-group--prepend {
        width: 140px;
        .el-input-group__prepend {
          width: 60px;
          padding: 0 10px;
        }
      }
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
</style>
<style lang="scss" scoped>
.exam-wrapper {
  display: grid;
  grid-template-columns: auto 60px 60px;
  .exam-button {
    margin-left: 10px !important;
  }
}

.pic-list {
  display: flex;
  flex-wrap: wrap;
}

.kecheng-Btn {
  padding-bottom: 10px;
}

.pic-item-container {
  width: 130px;
  height: 130px;
  border-radius: 6px;
  border: 1px solid $line-color;
  position: relative;
  overflow: hidden;
  margin: 0 10px 10px 0;
  .mask-container {
    width: 100%;
    height: 100%;
    color: #fff;
    overflow: hidden;
    font-size: 24px;
    background-color: rgb(#000, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    transform: scale(0);
    transition: 0.1s all;
  }

  &:hover .mask-container {
    transform: scale(1);
  }

  .mask-icon {
    margin: 0 5px;
    cursor: pointer;
  }
}
.recommend-course-input {
  display: flex;
  align-items: center;
  padding-top: 10px;
  .el-input{
    width: 80%;
  }
  .recommend-course-delete {
    padding-left: 15px;
    color: #fd6720;
    cursor: pointer;
  }
  .recommend-course-status {
    margin-left: 10px;
    color: #b4b6bc
  }
}

</style>
