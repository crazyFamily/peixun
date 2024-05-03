<template>
  <div>
    <el-tabs class="nav" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="立项信息" name="first">
        <PreviewEstablishProject  v-if="activeName === 'first' && projectApprovalData"  :params="projectApprovalData" :isShowReturn="false" />
      </el-tab-pane>
      <el-tab-pane label="培训通知" name="second">
        <TrainingNotice v-if="commcClassId && activeName === 'second'" :commcClassId="commcClassId"></TrainingNotice>
      </el-tab-pane>
      <el-tab-pane label="OMO培训" name="mixinsTraining">
        <template v-if="commcClassId">
          <MixinsTraining v-if="activeName === 'mixinsTraining'" :commcClassId="commcClassId"></MixinsTraining>
        </template>
      </el-tab-pane>
      <el-tab-pane label="课表管理" name="third">
        <div class="establish__trainingCourseManagement course-wrapper" style="background: #fff;">
          <div class="title">
            <div class="title__menu"></div>
            <span>课程表</span>
          </div>
          <div class="menu-right">
            <div class="icons df">
              <span class="icons__upload" @click="courseDown">
                <i class="icons__upload__icon"></i>
                导出
              </span>
            </div>
          </div>
          <gc-table
            drop
            row-key="customId"
            class="general__table mt20"
            ref="courseTableRef"
            :list="timetableList"
            :tableList="timetableListData"
          >
            <el-table-column label="日期" width="130">
              <template v-slot="scope">
                <el-date-picker
                  type="date"
                  class="w-full"
                  placeholder="选择日期"
                  v-model="scope.row.courseDate"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker big-zindex"
                  :disabled="scope.row.isEvaluate==='Y'"
                  @change="checkClassTime(scope.row)"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="250">
              <div slot-scope="scope" class="w-100 aic">
                <el-time-picker
                  v-model="scope.row.startTime"
                  :picker-options="{
                    selectableRange: scope.row.startTimer
                  }"
                  :clearable="false"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="
                    startTimeChange($event, scope.row), needHintChange(scope.row)
                  "
                  :disabled="scope.row.isEvaluate==='Y'"
                  placeholder="选择时间"
                >
                </el-time-picker>
                <span class="ml10 mr10"> 至 </span>
                <el-time-picker
                  v-model="scope.row.endTime"
                  :picker-options="{
                    selectableRange: scope.row.endTimer
                  }"
                  :clearable="false"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="
                    endTimeChange($event, scope.row), needHintChange(scope.row)
                  "
                  :disabled="scope.row.isEvaluate==='Y'"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </div>
            </el-table-column>
            <el-table-column label="课程来源" min-width="116">
              <span slot="header">
                课程来源
                <el-tooltip
                  effect="light"
                  popper-class="table-popper"
                  placement="top"
                  ><i class="el-icon-question active"></i>
                  <div class="tips-container" slot="content">
                    <p class="tips-content">
                      内部课程，只可选择内部课程库中的课程，讲师可选择
                      内部（银行）/内部（非银行）
                    </p>
                    <p class="tips-content">
                      外部课程，只可选择外部课程库中的课程，讲师由课程自动带出，且只能为
                      外部讲师
                    </p>
                    <p class="tips-content">
                      通用课程，只可选择通用课程库中的课程，课程无需评估；讲师可选择
                      内部（银行）/内部（非银行）/无讲师
                    </p>
                  </div>
                </el-tooltip>
              </span>
              <template v-slot="scope">
                <gc-select
                  :options="teachingMethodOptions"
                  v-model="scope.row.courseType"
                  :disabled="scope.row.isEvaluate==='Y'"
                  @change="teachingMethodChange(scope.row)"
                ></gc-select>
              </template>
            </el-table-column>
                  <el-table-column label="课程名称" min-width="184">
            <template v-slot="scope">
              <el-input
                v-show="!scope.row.courseType"
                disabled
                value="请先选择课程类型"
              ></el-input>
              <div class="df">
                <el-input
                  :readonly="scope.row.courseType !== ESTABLISH_COURSE_MAP.move"
                  class="l30"
                  v-show="
                    scope.row.courseType &&
                    scope.row.courseType === ESTABLISH_COURSE_MAP.bank
                  "
                  v-model="scope.row.courseName"
                  :disabled="scope.row.isEvaluate==='Y'"
                  @change="scope.row.courseId = ''"
                >
                  <i
                    slot="suffix"
                    class="page-input__search"
                    @click="openInternalCurriculum(scope.row)"
                  ></i>
                </el-input>
                <!-- <el-button
                  v-if="
                    scope.row.courseType && scope.row.courseType === ESTABLISH_COURSE_MAP.bank
                  "
                  class="button-60-h30 ml10 fs0"
                  type="primary"
                  @click="openSelectUniversalCourse(scope.row)"
                  >通用课程</el-button
                > -->
              </div>

              <gc-readonlyInput
                class="mb0"
                :disabled="scope.row.isEvaluate==='Y'"
                v-show="scope.row.courseType === ESTABLISH_COURSE_MAP.interior"
              >
                {{ scope.row.courseName }}
                <template v-slot:end>
                  <i
                    class="page-input__search"
                    @click="selectCourseType(scope.row)"
                  ></i>
                </template>
              </gc-readonlyInput>
              <gc-readonlyInput
                class="mb0"
                :disabled="scope.row.isEvaluate==='Y'"
                v-show="
                  scope.row.courseType === ESTABLISH_COURSE_MAP.commonCourse
                "
              >
                {{ scope.row.courseName }}
                <template v-slot:end>
                  <i
                    class="page-input__search"
                    @click="openSelectUniversalCourse(scope.row)"
                  ></i>
                </template>
              </gc-readonlyInput>
            </template>
          </el-table-column>
            <el-table-column label="讲师类型" min-width="116">
              <template v-slot="scope">
                <gc-select
                  :options="getTeacherCategoryOptions(scope.row.courseType)"
                  v-model="scope.row.teacherType"
                  :disabled="scope.row.isEvaluate==='Y'"
                  @change="teacherTypeChange(scope.row)"
                ></gc-select>
              </template>
            </el-table-column>
            <el-table-column label="讲师姓名" width="116">
              <!-- <template v-slot="scope">
                <gc-readonlyInput
                  class="mb0"
                  v-show="
                    scope.row.teacherType === enumMap.interiorBank ||
                    scope.row.teacherType === enumMap.sansLecturer
                  "
                >
                  {{ scope.row.teacherName }}
                  <template v-slot:end>
                    <i
                      class="page-input__search"
                      @click="openSelectTeacher(scope.row.teacherType, scope.row)"
                    ></i>
                  </template>
                </gc-readonlyInput>
                <el-input
                  v-show="scope.row.teacherType === enumMap.interiorNotBank"
                  v-model="scope.row.teacherName"
                  placeholder="请输入内容"
                  @change="checkClassTime(scope.row)"
                >
                </el-input>
                <span v-show="scope.row.teacherType === enumMap.notLecturer"
                  >无讲师</span
                >
              </template> -->
                        <template v-slot="scope">
              <gc-readonlyInput
                class="mb0"
                v-show="
                  (scope.row.teacherType === ESTABLISH_COURSE_MAP.interiorBank ||
                    scope.row.teacherType ===
                      ESTABLISH_COURSE_MAP.sansLecturer) &&
                  !scope.row.courseTeachInfo
                "
                :disabled="scope.row.isEvaluate==='Y'"
              >
                {{ scope.row.teacherName }}
                <template v-slot:end>
                  <i
                    class="page-input__search"
                    @click="openSelectTeacher(scope.row.teacherType, scope.row)"
                  ></i>
                </template>
              </gc-readonlyInput>
              <gc-select
                v-if="
                  scope.row.teacherType === ESTABLISH_COURSE_MAP.sansLecturer &&
                  scope.row.courseTeachInfo
                "
                :options="scope.row.courseTeachInfo"
                v-model="scope.row.renderTeacherName"
                :disabled="scope.row.isEvaluate==='Y'"
                @change="courseTeacherChangeHandle($event, scope.row)"
              >
              </gc-select>
              <el-input
                v-show="
                  scope.row.teacherType === ESTABLISH_COURSE_MAP.interiorNotBank
                "
                v-model="scope.row.teacherName"
                placeholder="请输入内容"
                :disabled="scope.row.isEvaluate==='Y'"
                @change="checkClassTime(scope.row)"
              >
              </el-input>
              <span
                v-show="
                  scope.row.teacherType === ESTABLISH_COURSE_MAP.notLecturer
                "
                >无讲师</span
              >
            </template>
            </el-table-column>
            <el-table-column label="操作" width="106" class-name="icons no-line">
              <template v-slot="scope">
                <span @click="delTimetableItem(scope.$index,scope.row)" :class="{'disabled': scope.row.isEvaluate==='Y'}" class="active mr8">
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i :class="{'operation__del': scope.row.isEvaluate!=='Y','operation__del-disabled': scope.row.isEvaluate==='Y'}"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </gc-table>
          <div class="btns">
            <div class="add" @click="addTimetable">新增</div>
            <div class="add" @click="batchImport">批量导入</div>
            <div class="add-internal" @click="jumpToAddInternalCurriculum">
              新增内部课程
            </div>
            <div class="add-external" @click="jumpToAddExternalCurriculum">
              新增外部课程
            </div>
          </div>
          <div class="title mt30">
            <div class="title__menu"></div>
            通关评审及带班老师信息
          </div>
          <div class="general__table mt20">
            <el-table :data="teacherTableList">
              <el-table-column label="姓名" min-width="148">
                <template v-slot="scope">
                  <gc-readonlyInput class="mb0 w140">
                    {{ scope.row.teacherName || '请选择讲师' }}
                    <template v-slot:end>
                      <i
                        class="page-input__search"
                        @click="openSelectTeacherDialog(scope.row)"
                      ></i>
                    </template>
                  </gc-readonlyInput>
                </template>
              </el-table-column>
              <el-table-column label="类型" min-width="120px">
                <template v-slot="scope">
                  <gc-select
                    v-model="scope.row.teacherType"
                    :options="teacherCategoryOptions"
                  ></gc-select>
                </template>
              </el-table-column>
              <el-table-column label="内容" min-width="180">
                <template v-slot="scope">
                  <div class="df">
                    <span style="width: 10px">
                      <i
                        class="necessary-before"
                        v-show="isNecessary(scope.row.teacherType)"
                      ></i>
                    </span>
                    <el-input
                      v-model.trim="scope.row.contentDesc"
                      :maxlength="20"
                    ></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="日期" min-width="346">
                <template v-slot="scope" class="aic">
                  <el-date-picker
                    type="date"
                    class="w-120"
                    placeholder="选择日期"
                    v-model="scope.row.tgDate1"
                    :clearable="false"
                    :picker-options="handleStartPickerOptions(scope.row, 'tgDate2')"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                  <span
                    class="ml10 mr10"
                    v-show="!isNecessary(scope.row.teacherType)"
                    >至</span
                  >
                  <el-date-picker
                    v-show="!isNecessary(scope.row.teacherType)"
                    type="date"
                    class="w-120"
                    placeholder="选择日期"
                    v-model="scope.row.tgDate2"
                    :clearable="false"
                    :picker-options="handleEndPickerOptions(scope.row, 'tgDate1')"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="时间" min-width="260">
                <div slot-scope="scope" class="w-100 aic">
                  <el-time-picker
                    v-model="scope.row.startTime"
                    :picker-options="{
                      selectableRange: scope.row.startTimer
                    }"
                    :clearable="false"
                    format="HH:mm"
                    value-format="HH:mm"
                    @change="startTimeChange($event, scope.row)"
                    placeholder="选择时间"
                  >
                  </el-time-picker>
                  <span class="ml10 mr10"> 至 </span>
                  <el-time-picker
                    v-model="scope.row.endTime"
                    :picker-options="{
                      selectableRange: scope.row.endTimer
                    }"
                    :clearable="false"
                    format="HH:mm"
                    value-format="HH:mm"
                    @change="endTimeChange($event, scope.row)"
                    placeholder="选择时间"
                  >
                  </el-time-picker>
                </div>
              </el-table-column>
              <el-table-column label="操作" min-width="68">
                <template v-slot="scope">
                  <span
                    class="active mr10"
                    @click="delTeacherTableItem(scope.$index)"
                  >
                    <el-tooltip content="删除" popper-class="icon-popper">
                      <i class="operation__del"></i>
                    </el-tooltip>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="btns">
            <div class="add" @click="addTeacherTableItem">新增</div>
            <div class="add" @click="teacherstableBatchAddVisible = true">批量导入带班老师</div>
          </div>
            <!-- 选择通用课程 dialog -->
          <gc-model
            :title="courseTitle"
            :visible="selectUniversalCourseVisible"
            width="800px"
            @close="
              selectUniversalCourseVisible = false
              resetSelectUniversalCourse()
            "
            @cancel="selectUniversalCourseVisible = false"
            @comfirm="selectUniversalCourseComfirm"
          >
            <div class="between mb10">
              <el-form
                :model="selectUniversalCourseForm"
                inline
                @submit.native.prevent
              >
                <el-form-item label="课程信息" class="mb0 mr20">
                  <el-input
                    class="w200"
                    placeholder="请输入课程名称"
                    v-model="selectUniversalCourseForm.courseInfo"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div class="btn">
                <el-button class="button-60" @click="querySelectUniversalCourse"
                  >查询</el-button
                >
                <el-button
                  class="button-60 button-blue"
                  @click="resetSelectUniversalCourse"
                  >重置</el-button
                >
              </div>
            </div>
            <gc-table
              class="general__table table-radio"
              :list="selectUniversalCourseList"
              :tableList="selectUniversalCourseTableList"
              ref="selectUniversalCourseTableRef"
              @selection-change="
                tableSelectionChange($refs, $event, 'selectUniversalCourseTableRef')
              "
            >
            </gc-table>
            <gc-pagination
              :total="selectUniversalCourseForm.total"
              :page-size="selectUniversalCourseForm.pageSize"
              :current-page="selectUniversalCourseForm.currPage"
              @sizeChange="
                sizeChange(
                  $event,
                  selectUniversalCourseForm,
                  getSelectUniversalCourse
                )
              "
              @currentChange="
                currentChange(
                  $event,
                  selectUniversalCourseForm,
                  getSelectUniversalCourse
                )
              "
            />
          </gc-model>
          <!-- 课表批量导入 dialog -->
          <InstructorBatchImport
            title="课表批量导入"
            :visible="timetableBatchAddVisible"
            @close="timetableBatchAddVisible = false, timetableTemplate = null, timetableBatchAdd = {}"
            @cancel="timetableBatchAddVisible = false"
            @change="timetableUpload"
            @comfirm="timetableUploadComfirm"
            @templateDownload=" templateDownload('/common/file/downloadModule', { fileCode: 'trainCourse' })"
          >
            <div v-if="timetableBatchAdd.title">
              <p>{{ timetableBatchAdd.title }}</p>
              <p v-for="error in timetableBatchAdd.errorList" :key="error.value" class="error-color">{{ error.value }}</p>
            </div>
          </InstructorBatchImport>
          <!-- 批量导入带班老师 dialog -->
          <InstructorBatchImport
            title="带班老师批量导入"
            :visible="teacherstableBatchAddVisible"
            @close="teacherstableBatchAddClose"
            @cancel="teacherstableBatchAddClose"
            @change="teacherstableUpload"
            @comfirm="teacherstableUploadComfirm"
            @templateDownload="downloadAdapter({ templateCode: 'CLASS_TG_TEACHER' })"
          >
            <div v-if="teacherstableBatchAdd && JSON.stringify(teacherstableBatchAdd) !== '{}'">
              <p>{{ `${teacherstableBatchAdd.successNum}条数据导入成功，${teacherstableBatchAdd.failNum}条数据导入失败` }}</p>
              <p v-for="error in teacherstableBatchAdd.errorTips" :key="error" class="error-color" >{{ error }}</p>
            </div>
          </InstructorBatchImport>
          <div class="btns_sumbit footer-fixed" :class="{'menu-collapse': asideCollapse}">
              <!-- <el-button class="button_timetable">取消</el-button> -->
              <el-button class="button_timetable " type="danger" @click="courseManagementComfirm">确认</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="学员管理" name="fourth">
        <StudentManagementIndex :classId="commcClassId" v-if="commcClassId && activeName === 'fourth'" ></StudentManagementIndex>
        <!-- <StudentManagement ></StudentManagement> -->
        <!-- <el-card>
          <div class="between">
            <div>
              <span>所属机构</span>
              <gc-institution class="ml10" style="top:10px;" orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" />
              <span class="ml20">学员信息</span>
              <el-input
                class="w200 ml10"
                placeholder="请输入姓名/UM号"
                v-model.trim="studentForm.umId"
                clearable
              ></el-input>
              <el-button
                type="primary"
                class="button-60-h30 ml20"
                @click="handleSearchStudent"
                >查询</el-button>
              <el-button
                class="button-60-h30 ml20"
                @click="reset"
                >重置</el-button>
            </div>
          </div>
          <div class="menu-right mt20">
            <div class="icons no-line df">
              <span class="icons__upload" @click="choiceStudentVisible = true">
                <i class="icons__add__icon"></i>
                新增学员
              </span>
              <span class="icons__upload" @click="handleStudentExport">
                <i class="icons__upload__icon"></i>
                导出
              </span>
              <span class="icons__upload" @click="importStudentVisible = true">
                  <i class="icons__upload__icon"></i>
                  批量导入
              </span>
              <span class="icons__del" @click="studentTableClear">
                <i class="icons__del__icon"></i>
                清空
              </span>
            </div>
          </div>
          <gc-table
            class="general__table mt20"
            ref="studentTableRef"
            :list="studentList"
            :stripe="false"
            :tableList="studentTableList"
          >
            <el-table-column label="操作" min-width="86">
              <template slot-scope="scope">
                <span class="active mr10" @click="delOneStudent(scope)">
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i class="operation__del"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="studentForm.total"
            :page-size="studentForm.pageSize"
            :current-page="studentForm.currPage"
            @sizeChange="sizeChange($event, studentForm, getStudentList)"
            @currentChange="currentChange($event, studentForm, getStudentList)"
          />
      <gc-model
        title="选择新增学员"
        :visible.sync="choiceStudentVisible"
        width="800px"
        isAppend
        @close="choiceStudentCannel"
        @comfirm="choiceStudentComfirm"
      >
       <div class="between">
            <div>
                <span>请输入学员（UM号）</span>
                <el-input class="w200 ml10" placeholder="请输入UM号" v-model.trim="addStudentSearchUmId" ref="searchUmidRef"
                  @keydown.enter="handleAddStudent"
                 clearable></el-input>
                <el-button type="primary" class="button-60-h30 ml20" @click="handleAddStudent" >查询</el-button>
            </div>
        </div>
        <gc-table
          class="general__table mt20 table-radio"
          ref="choiceStudenTableRef"
          :list="choiceStudenList"
          :stripe="false"
          :tableList="choiceStudenTableList"
          @selection-change="
            tableSelectionChange($refs, $event, 'choiceStudenTableRef')
          "
        >
        </gc-table>
      </gc-model>
        <InstructorBatchImport
          title="批量导入学员"
          :visible.sync="importStudentVisible"
          @change="studentImportChange"
          @templateDownload="downloadAdapter({ templateCode: 'TRAINING_COURSE_STUDENT_MANAGE' })"
          @comfirm="studentImportComfirm"
          @close="studentImportClose"
        >
          <div v-if="importStudentData && importStudentData.isUpload">
            <p style="margin-bottom: 5px;">
              {{ `上传结果：${importStudentData.successLength} 条数据导入成功，${importStudentData.failLength} 条数据导入失败`}}
            </p>
            <p v-for="error in importStudentData.fail" :key="error" class="error-color">{{ error }}</p>
          </div>
        </InstructorBatchImport>
        </el-card> -->

      </el-tab-pane>
      <el-tab-pane label="考勤管理" name="five">
        <AttendanceManagement v-if="activeName === 'five'" :params="AttendanceManagemenData" />
      </el-tab-pane>
      <el-tab-pane label="评估管理" name="six">
        <TrainingCourseAssessment v-if="activeName === 'six'" :params="TrainingCourseAssessmentData" />
      </el-tab-pane>
      <el-tab-pane label="积分管理" name="seven">
        <PointManagement :commcClassId="commcClassId"  v-if="commcClassId && activeName === 'seven'" ></PointManagement>
      </el-tab-pane>
      <el-tab-pane label="结训管理" name="eight">
        <InputAfterTraning v-if="activeName === 'eight'" :params="InputAfterTraningData"/>
      </el-tab-pane>
      <el-tab-pane label="文件归档" name="nine">
        <TrainingCoursePigeonhole v-if="activeName === 'nine'" :params="TrainingCoursePigeonholeData"/>
      </el-tab-pane>
    </el-tabs>
    <!-- 选择外部课程 dialog -->
    <gc-model
      title="选择外部课程"
      :visible="selectExternalCourseVisible"
      width="800px"
      @close="
        selectExternalCourseVisible = false
        resetSelectExternalCourse()
      "
      @cancel="selectExternalCourseVisible = false"
      @comfirm="selectExternalCourseComfirm"
    >
      <div class="between mb10">
        <el-form
          :model="selectExternalCourseForm"
          inline
          @submit.native.prevent
        >
          <el-form-item label="课程信息" class="mb0 mr20">
            <el-input
              class="w200"
              placeholder="请输入课程名称/讲师名称"
              v-model="selectExternalCourseForm.courseInfo"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商信息" class="mb0">
            <el-input
              class="w200"
              placeholder="请输入供应商名称"
              v-model="selectExternalCourseForm.supplyName"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button class="button-60" @click="querySelectExternalCourse"
            >查询</el-button
          >
          <el-button
            class="button-60 button-blue"
            @click="resetSelectExternalCourse"
            >重置</el-button
          >
        </div>
      </div>

      <gc-table
        class="general__table table-radio"
        :list="selectExternalCourseList"
        :tableList="selectExternalCourseTableList"
        ref="selectExternalCourseTableRef"
        @selection-change="
          tableSelectionChange($refs, $event, 'selectExternalCourseTableRef')
        "
      >
      </gc-table>
      <gc-pagination
        :total="selectExternalCourseForm.total"
        :page-size="selectExternalCourseForm.pageSize"
        :current-page="selectExternalCourseForm.currPage"
        @sizeChange="
          sizeChange($event, selectExternalCourseForm, getSelectExternalCourse)
        "
        @currentChange="
          currentChange(
            $event,
            selectExternalCourseForm,
            getSelectExternalCourse
          )
        "
      />
    </gc-model>

    <!-- 选择外部讲师 dialog -->
    <gc-model
      title="选择外部讲师"
      :visible="selectExternalLecturerVisible"
      width="800px"
      @close="selectExternalLecturerVisible = false"
      @cancel="selectExternalLecturerVisible = false"
      @comfirm="selectExternalLecturerComfirm"
    >
      <div class="between mb10">
        <el-form
          :model="selectExternalLecturerForm"
          inline
          @submit.native.prevent
        >
          <el-form-item label="讲师姓名" class="mb0 mr20">
            <el-input
              class="w200"
              placeholder="请输入讲师姓名"
              v-model="selectExternalLecturerForm.teacherName"
            ></el-input>
          </el-form-item>
          <el-form-item label="供应商名称" class="mb0">
            <el-input
              class="w200"
              placeholder="请输入供应商名称"
              v-model="selectExternalLecturerForm.supplyName"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button
            class="button-60"
            @click="querySelectExternalLecturerComfirm"
            >查询</el-button
          >
          <el-button
            class="button-60 button-blue"
            @click="resetSelectExternalLecturerComfirm"
            >重置</el-button
          >
        </div>
      </div>

      <gc-table
        class="general__table table-radio"
        ref="selectExternalLecturerTableRef"
        :list="selectExternalLecturerList"
        :tableList="selectExternalLecturerTableList"
        @selection-change="
          tableSelectionChange($refs, $event, 'selectExternalLecturerTableRef')
        "
      >
      </gc-table>
      <gc-pagination
        :total="selectExternalLecturerForm.total"
        :page-size="selectExternalLecturerForm.pageSize"
        :current-page="selectExternalLecturerForm.currPage"
        @sizeChange="
          sizeChange(
            $event,
            selectExternalLecturerForm,
            getSelectExternalLecturer
          )
        "
        @currentChange="
          currentChange(
            $event,
            selectExternalLecturerForm,
            getSelectExternalLecturer
          )
        "
      />
    </gc-model>

    <!-- 选择内部讲师 dialog -->
    <gc-model
      title="选择内部讲师"
      :visible="selectInteriorLecturerVisible"
      width="800px"
      @close="
        selectInteriorLecturerVisible = false
        resetInteriorLecturer()
      "
      @cancel="selectInteriorLecturerVisible = false"
      @comfirm="interiorLecturerComfirm"
    >
      <div class="between mb10">
        <el-form
          :model="selectInteriorLecturerForm"
          inline
          @submit.native.prevent
        >
          <el-form-item label="讲师姓名" class="mb0">
            <el-input
              class="w200"
              placeholder="请输入讲师姓名"
              v-model="selectInteriorLecturerForm.empName"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button class="button-60" @click="searchInteriorLecturer"
            >查询</el-button
          >
          <el-button
            class="button-60 button-blue"
            @click="resetInteriorLecturer"
            >重置</el-button
          >
        </div>
      </div>

      <gc-table
        class="general__table table-radio"
        :list="selectInteriorLecturerList"
        :tableList="selectInteriorLecturerTableList"
        ref="selectInteriorLecturerTableRef"
        @selection-change="
          tableSelectionChange($refs, $event, 'selectInteriorLecturerTableRef')
        "
      >
      </gc-table>
      <gc-pagination
        :total="selectInteriorLecturerForm.total"
        :page-size="selectInteriorLecturerForm.pageSize"
        :current-page="selectInteriorLecturerForm.currPage"
        @sizeChange="
          sizeChange($event, selectInteriorLecturerForm, getInteriorLecturer)
        "
        @currentChange="
          currentChange($event, selectInteriorLecturerForm, getInteriorLecturer)
        "
      />
    </gc-model>

    <!-- 选择 带班老师 dialog -->
    <gc-model
      title="选择带班老师"
      :visible="selectTeacherVisible"
      width="800px"
      @close="
        selectTeacherVisible = false
        resetSelectTeacher()
      "
      @cancel="selectTeacherVisible = false"
      @comfirm="selectTeacherComfirm"
    >
      <div class="between mb10">
        <el-form :model="selectTeacherForm" inline @submit.native.prevent>
          <el-form-item label="讲师姓名" class="mb0">
            <el-input
              class="w200"
              placeholder="请输入讲师姓名"
              v-model.trim="selectTeacherForm.empName"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button class="button-60" @click="searchSelectTeacher"
            >查询</el-button
          >
          <el-button class="button-60 button-blue" @click="resetSelectTeacher"
            >重置</el-button
          >
        </div>
      </div>

      <gc-table
        class="general__table table-radio"
        :list="selectTeacherList"
        :tableList="selectTeacherTableList"
        ref="selectTeacherTableRef"
        @selection-change="
          tableSelectionChange($refs, $event, 'selectTeacherTableRef')
        "
      >
      </gc-table>
      <gc-pagination
        :total="selectTeacherForm.total"
        :page-size="selectTeacherForm.pageSize"
        :current-page="selectTeacherForm.currPage"
        @sizeChange="sizeChange($event, selectTeacherForm, getSelectTeacher)"
        @currentChange="
          currentChange($event, selectTeacherForm, getSelectTeacher)
        "
      />
    </gc-model>
  </div>
</template>
<script>
import {
  random,
  CopyObj,
  resetObj,
  throttle,
  hintFrame,
  customHint,
  formatDate,
  sizeChange,
  jsonHeaders,
  dataHeaders,
  manyLineHint,
  currentChange,
  axiosDownload,
  filterBusiType,
  handleDownload,
  templateDownload,
  addAllowKeepAlive,
  tableSelectionChange,
  handleEndPickerOptions,
  handleStartPickerOptions,
  fetchUdmpCodeToDownload,
  downloadAdapter
} from '@/util/utils'
import { ESTABLISH_COURSE_MAP } from '@/util/constants'
import PointManagement from './components/PointManagement.vue'
import TrainingNotice from './components/TrainingNotice.vue'
import StudentManagement from './StudentManagement'
import PreviewEstablishProject from '@/views/Establish/EstablishManagement/PreviewEstablishProject.vue'
import AttendanceManagement from '@/views/Establish/TrainingCourseManagement/AttendanceManagement.vue'
import TrainingCourseAssessment from '@/views/Establish/TrainingCourseManagement/TrainingCourseAssessment.vue'
import InputAfterTraning from '@/views/Establish/TrainingCourseManagement/InputAfterTraning.vue'
import TrainingCoursePigeonhole from '@/views/Establish/TrainingCourseManagement/TrainingCoursePigeonhole.vue'
import {
  fetchQueryLadderCourse,
  fetchQueryOutsideLadderCourse,
  fetchBatchClassStudent,
  fetchQueryWhiteList
} from '@/fetch/establish'

import StudentManagementIndex from './components/edits/StudentManagement/index'
import MixinsTraining from './MixinsTraining/MixinsTraining.vue'

export default {
    name: 'TrainingCourseSeeEdit',
    components:{
      PointManagement,
      TrainingNotice,
      PreviewEstablishProject,
      AttendanceManagement,
      TrainingCourseAssessment,
      InputAfterTraning,
      TrainingCoursePigeonhole,
      StudentManagement,
      StudentManagementIndex,
      MixinsTraining
    },
    data(vm) {
      return {
        activeName: 'first',
        queryForm: {
        // 培训班编号
        classId: '',
        // 培训班名称
        className: '',
        // 培训班状态
        classStatus: '',
        // 培训班班主任UM号/姓名
        realManager: '',
        // 选择子机构标识
        isGotSubBranch: false,
        busiType: '',
        dateStart: '',
        dateEnd: '',

        currPage: 1,
        pageSize: 10
      },
      // 培训班状态下拉数组
      classStatusOptions: [],
      // 当前操作的培训班id
      classId: '',
      // 选择时间 限制对象
      startPickerOptions: {},
      endPickerOptions: {},
      // 表格字段数组
      list: [
        {
          type: 'selection',
          width: '50'
        },
        {
          type: 'index',
          width: '50',
          label: '序号'
        },
        {
          width: '178',
          label: '培训班名称',
          prop: 'className'
        },
        {
          width: '80',
          label: '项目编号',
          prop: 'classId'
        },
        {
          width: '80',
          label: '班主任',
          prop: 'realManager'
        },
        {
          width: '140',
          label: '举办单位',
          prop: 'orgName'
        },
        {
          width: '86',
          label: '创建日期',
          prop: 'createdDate',
          ctx: (row) => row.createdDate.split(' ')[0]
        },
        {
          width: '86',
          label: '开始日期',
          prop: 'dateStart'
        },
        {
          width: '86',
          label: '结束日期',
          prop: 'dateEnd'
        },
        {
          width: '80',
          label: '培训班状态',
          prop: 'classStatusDesc'
        },
        {
          width: '84',
          label: '是否解冻',
          prop: 'isFreezeDesc'
        },
        {
          width: '84',
          label: '操作',
          prop: 'isFreezeDesc'
        }
      ],
      // 表格内容数组
      tableList: [],
      // 分页数据总条数
      total: 0,
      // 分页工具函数
      sizeChange,
      currentChange,
      // 日期工具函数
      formatDate,
      // 课程管理 状态
      courseManagementVisible: false,
      // 授课方式 下拉选项
      teachingMethodOptions: [
        { label: '内部课程', value: ESTABLISH_COURSE_MAP.bank },
        { label: '外部课程', value: ESTABLISH_COURSE_MAP.interior },
        { label: '通用课程', value: ESTABLISH_COURSE_MAP.commonCourse }
        // { label: '移动', value: ESTABLISH_COURSE_MAP.move }
      ],
      // 后台返回的课程数据对象
      courseObj: {},
      // 课程表 表格字段数组
      timetableList: [
        {
          type: 'component',
          width: '64',
          'class-name': 'drop',
          ctx: (row) => ({
            render(h) {
              return h('i', {
                class: 'el-icon-rank'
              })
            }
          })
        },
        // {
        //   type: 'selection',
        //   selectable: vm.assessmentSelectable
        // },
        {
          type: 'index',
          label: '序号',
          width: '48'
        }
      ],
      // 课程表 数据数组
      timetableListData: [],
      // 通用课程， 内部课程共用 title
      courseTitle: '选择通用课程',
      // 通关评审及带班老师信息 表格数据数组
      teacherTableList: [],
      // 通关评审及带班老师信息 讲师类型下拉选项
      teacherCategoryOptions: [
        {
          label: '带班',
          value: '02001'
        },
        {
          label: '通关评审',
          value: '02002'
        },
        {
          label: '行动学习',
          value: '02003'
        }
      ],

      // 课程表 批量上传 dialog 状态
      timetableBatchAddVisible: false,
      // 课程表 批量上传 数据
      timetableBatchAdd: {},
      // 课表批量上传文件对象
      timetableTemplate: null,

      // 课表管理 带班老师 批量上传
      teacherstableBatchAddVisible: false,
      teacherstableTemplate: {},
      teacherstableBatchAdd: {},

      // 调整学员 状态
      adjustStudentVisible: false,
      // 导入学员
      importStudentVisible: false,
      importStudentData: {
        isUpload: false,
        fail: [],
        success: [],
        failLength: 0,
        successLength: 0
      },
      // 批量导入文件对象
      batchChannelStudentFile: {},
      // 参训学员 字段数组
      studentList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '姓名',
          width: '120',
          prop: 'empName'
        },
        {
          label: 'UM号',
          width: '162',
          prop: 'umId'
        },
        {
          label: '条线',
          width: '108',
          prop: 'busiType',
          ctx: (row) => filterBusiType(row.busiType)
        },
        {
          label: '机构',
          width: '282',
          prop: 'orgName'
        },
        {
          label: '岗位',
          width: '318',
          prop: 'posts'
        }
      ],
      // 参训学员 数据数组
      studentTableList: [],
      // 选择新增学员dialog 表格数据数组
      choiceStudenTableList: [],
      blgOrgIds: [],
      // 参训学员 查询数据 form
      studentForm: {
        umId: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      addStudentSearchUmId: '',
      // 选择新增学员dialog状态
      choiceStudentVisible: false,
      // 选择新增学员dialog 表格字段数组
      choiceStudenList: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '姓名',
          width: '120',
          prop: 'empName'
        },
        {
          label: 'UM号',
          width: '162',
          prop: 'umId'
        }
      ],
      // 表格单选工具函数
      tableSelectionChange,
      // 课程， 讲师类型映射
      ESTABLISH_COURSE_MAP,
      // 选择外部课程 dialog 状态
      selectExternalCourseVisible: false,
      // 选择外部课程 dialog 字段数组
      selectExternalCourseList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '课程名称',
          width: '236',
          prop: 'courseName'
        },
        {
          label: '讲师',
          width: '96',
          prop: 'teacherName'
        },
        {
          label: '供应商',
          width: '240',
          prop: 'supplyName'
        }
      ],
      // 选择外部课程 dialog 数据数组
      selectExternalCourseTableList: [],
      // 选择外部课程 dialog 分页表单
      selectExternalCourseForm: {
        blgStripLine: '',
        // 课程信息: 课程名字或讲师名字
        courseInfo: '',
        // 供应商名字
        supplyName: '',
        currPage: 1,
        pageSize: 5,
        total: 0,
        row: null
      },
      // 选择通用课程 dialog 状态
      selectUniversalCourseVisible: false,
      // 选择通用课程 dialog 字段数组
      selectUniversalCourseList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '课程名称',
          width: '470',
          prop: 'courseName'
        },
        {
          label: '是否评估',
          width: '102',
          prop: 'isEvaluate',
          ctx: (row) =>
            row.isEvaluate === 'Y'
              ? '是'
              : row.isEvaluate === 'N'
              ? '否'
              : row.isEvaluate
        }
      ],
      // 选择通用课程 dialog 数据数组
      selectUniversalCourseTableList: [],
      // 选择通用课程 dialog 分页表单
      selectUniversalCourseForm: {
        blgStripLine: '',
        // 课程信息: 课程名字或讲师名字
        courseInfo: '',
        // 供应商名字
        supplyName: '',
        currPage: 1,
        pageSize: 5,
        total: 0,
        row: null
      },
      // 选择外部讲师 dialog 状态
      selectExternalLecturerVisible: false,
      // 选择外部讲师 dialog 字段数组
      selectExternalLecturerList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          label: '讲师姓名',
          width: '126',
          prop: 'teacherName'
        },
        {
          label: '性别',
          width: '120',
          prop: 'teacherSex'
        },
        {
          label: '电话',
          width: '180',
          prop: 'teacherPhone'
        },
        {
          label: '供应商名称',
          width: '230',
          prop: 'supplyName'
        }
      ],
      // 选择外部讲师 dialog 数据数组
      selectExternalLecturerTableList: [],
      // 选择外部讲师 dialog 分页表单
      selectExternalLecturerForm: {
        blgStripLine: '',
        // 讲师名字
        teacherName: '',
        // supplyName
        supplyName: '',
        currPage: 1,
        pageSize: 5,
        total: 0,
        row: null
      },
      // 选择内部讲师 dialog 状态
      selectInteriorLecturerVisible: false,
      // 选择内部讲师 dialog 字段数组
      selectInteriorLecturerList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          label: '讲师姓名',
          width: '160',
          prop: 'empName'
        },
        {
          label: 'UM号',
          width: '240',
          prop: 'umId'
        },
        {
          label: '归属机构',
          width: '290',
          prop: 'blgOrgName'
        }
      ],
      // 选择内部讲师 dialog 数据数组
      selectInteriorLecturerTableList: [],
      // 选择内部讲师 dialog 分页表单
      selectInteriorLecturerForm: {
        empName: '',
        currPage: 1,
        pageSize: 5,
        total: 0,
        row: null
      },
      // 通关评审及带班老师信息 选择老师dialog 状态
      selectTeacherVisible: false,
      // 通关评审及带班老师信息 选择老师dialog 请求表单
      selectTeacherForm: {
        empName: '',
        currPage: 1,
        pageSize: 5,
        total: 0,
        row: null
      },
      // 通关评审及带班老师信息 选择老师dialog 字段数组
      selectTeacherList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          label: '讲师姓名',
          width: '126',
          prop: 'empName'
        },
        {
          label: 'UM号',
          width: '120',
          prop: 'umId'
        },
        {
          label: '机构',
          width: '410',
          prop: 'blgOrgName'
        }
      ],
      // 通关评审及带班老师信息 选择老师dialog 数据数组
      selectTeacherTableList: [],
      tabType:  '',
      // 限制日期选择工具函数
      handleStartPickerOptions,
      handleEndPickerOptions,
      // 当前操作的行
      row: {},
      // 下载模版工具函数
      templateDownload,
      // 新增课程用到的
      state: '',
      commcClassId:'',
      projectApprovalData: null,
      AttendanceManagemenData: null,
      TrainingCourseAssessmentData: null,
      InputAfterTraningData: null,
      TrainingCoursePigeonholeData: null,
      downloadAdapter,
      isShowMixinsTraining: false
      }
    },
    created() {
     this.getTeacherCategoryOptions = this.getTeacherCategoryOptions()
     this.init()
    },
    computed: {
      asideCollapse () {
        return this.$store.state.asideCollapse
      }
    },
    watch: {
      '$route': {
        handler: function (val, oldVal) {
          if (val && val.path === '/TrainingCourseSeeEdit' && oldVal && oldVal.path === '/TrainingCourseManagement'&& JSON.stringify(this.$route.params) !== '{}') {
            this.classId = this.$route.params.classId
            this.courseObj = this.$route.params
            this.commcClassId = this.$route.params.classId
            this.handleClick()
            console.log(this.tabType, '13421421')
            if (this.$route.params?.activeName) {
              this.activeName = this.$route.params.activeName
            }
            this.projectApproval()
          }
        },
        deep: true
      }
    },
    methods: {
     async init(){
        const getparams = await this.$route.params
        this.courseObj = getparams
        this.commcClassId = getparams.classId
        if (this.$route.params?.activeName) {
          this.activeName = this.$route.params.activeName
        }
        this.projectApproval()
      },
      handleClick(tab, event) {
        this.tabType = tab ? tab.index :this.tabType
        const tabName = tab?.name || 'first'
       switch (tabName) {
        case 'first':
          this.projectApproval()
          break
        case 'second':
          break
        case 'third':
          this.openCourseManagemen()
          break
        case 'fourth':
          this.openAdjustStudent()
          break
        case 'five':
          this.openAttendanceManagement()
          break
        case 'six':
          this.openAssessment()
          break
        case 'eight':
          this.openInputAfterTraning()
          break
        case 'nine':
          this.openPigeonhole()
        }
      },
      handleQueryForm() {
        const data = CopyObj(this.queryForm)
        ;[data.busiType, data.orgId] = data.busiType || []
        data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
        return data
      },
      // 日期选择限制
      startTimeChange($event, row) {
        row.endTimer = `${$event}:00 - 23:59:00`
      },
      endTimeChange($event, row) {
        row.startTimer = `00:00:00 - ${$event}:00`
      },
      // 查询
      query() {
        this.queryForm.currPage = 1
        this.queryForm.pageSize = 10
        this.getList()
      },
      // 重置
      reset() {
        // resetObj(this.queryForm)
        // this.queryForm.pageSize = 10
        // this.queryForm.currPage = 1
        // this.queryForm.isGotSubBranch = false
        // this.getList()
        this.blgOrgIds = []
        this.studentForm.umId = ''
        this.handleSearchStudent()
      },
      // 导出
      download() {
        const data = this.handleQueryForm()
        this.$axios
          .post(
            '/fn/classes/manager/exportClassList',
            { data },
            { ...jsonHeaders, responseType: 'blob' }
          )
          .then(handleDownload)
      },
      // 获取内容
      getList() {
        const data = this.handleQueryForm()
        this.$axios
          .post('/fn/classes/manager/listClassManager', { data }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              const { list, total } = data
              this.tableList = list
              this.total = total
            }
          })
      },
      getClassStatusOptions() {
        this.$axios.post('/fn/classes/manager/listClassStatus').then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.classStatusOptions = data.map((v) => {
              const { classStatusDesc: label, classStatus: value } = v
              return { label, value }
            })
          }
        })
      },
      // 导出课表
      courseDown() {
        const { classId } = this.courseObj
        this.$axios
          .post(
            '/classFileFunc/downloadClassCourseByClassId',
            { classId },
            { ...jsonHeaders, responseType: 'blob' }
          )
          .then(handleDownload)
      },
      // 通关评审一行内容是否需要验证
      isNecessary(type) {
        return ['02002', '02003'].includes(type)
      },
      // 新增课程表
      addTimetable() {
        this.timetableListData.push({
          startTimer: '00:00:00 - 23:59:00',
          endTimer: '00:00:00 - 23:59:00',
          disabled: true,
          customId: random()
        })
      },
      // 批量导入课表
      batchImport() {
        this.timetableBatchAddVisible = true
      },
      // 验证邀请函感谢函勾选数据
      verifyInvitationtable(courseList, type) {
        // 查找不符合条件的一项
        if (!courseList.length) {
          this.$message.warning(`尚未选择课程`)
          return
        }
        const flag = courseList.some((v, i) => {
          i++
          if (v[type] === 'Y') {
            this.timetableListData.some((subv, subi) => {
              subi++
              if (v.id === subv.id) {
                this.$message.warning(
                  `课程表第${subi}行已发送讲师${
                    type === 'isInvitationMail' ? '邀请' : '感谢'
                  }函`
                )
                return true
              }
            })
            return true
          }
        })
        // 没找到 不符合条件的
        if (flag) {
          return
        } else {
          return courseList[0].classId
        }
      },
      // // 设置课程表勾选框是否禁用
      // assessmentSelectable(row, index) {
      //   return row.disabled !== true
      // },
      // 时间 change事件
      needHintChange(row) {
        row.notNeedHint = false
        console.log('needHintChange');
        this.checkClassTime(row)
      },
      // 删除课表一项
      delTimetableItem(index, row) {
        if (row.isEvaluate==='Y') return
        this.timetableListData.splice(index, 1)
      },
      // 根据不同的授课方式返回不同的授课类型选项
      getTeacherCategoryOptions() {
        const interiorOne = {
          label: '内部(银行)',
          value: this.ESTABLISH_COURSE_MAP.interiorBank
        }
        const interiorTwo = {
          label: '内部(非银行)',
          value: this.ESTABLISH_COURSE_MAP.interiorNotBank
        }
        const sans = {
          label: '外部讲师',
          value: this.ESTABLISH_COURSE_MAP.sansLecturer
        }
        const none = {
          label: '无讲师',
          value: this.ESTABLISH_COURSE_MAP.notLecturer
        }
        return (type) => {
          switch (type) {
            case this.ESTABLISH_COURSE_MAP.bank:
              return [interiorOne, interiorTwo]
            case this.ESTABLISH_COURSE_MAP.interior:
              return [sans]
            case this.ESTABLISH_COURSE_MAP.commonCourse:
              return [interiorOne, interiorTwo, none]
            case this.ESTABLISH_COURSE_MAP.move:
              return [interiorOne, interiorTwo, sans, none]
            default:
              return []
          }
        }
      },
      // 授课方式change事件
      teachingMethodChange(row) {
        const options = this.getTeacherCategoryOptions(row.courseType)
        const flag = options.find((v) => v.value === row.teacherType)
        this.$set(row, 'courseName', '')
        row.courseId = ''
        this.$set(row, 'teacherName', '')
        row.teacherNo = ''
        if (!flag) {
          this.$set(row, 'teacherType', '')
        }
      },
      // 打开搜索课程名dialog
      selectCourseType(row) {
        if (row.isEvaluate==='Y') return
        this.selectExternalCourseVisible = true
        this.selectExternalCourseForm.row = row
      },
      // 讲师类型变化事件
      teacherTypeChange(row) {
        console.log('teacherTypeChange');
        this.$set(row, 'teacherName', '')
        row.teacherNo = ''
        if (row.teacherType === '01003') {
          row.conflict = []
        } else {
          this.checkClassTime(row)
        }
      },
      // 检查讲师上课时间是否冲突
      checkClassTime(row) {
        const { startTime, endTime, teacherNo, teacherType, courseDate, id } = row
        if (!startTime || !endTime) return
        const [startHour, startMin] = startTime.split(':')
        const [endHour, endtMin] = endTime.split(':')
        if (
          startHour &&
          startMin &&
          endHour &&
          endtMin &&
          teacherNo &&
          teacherNo !== 'N' &&
          teacherType &&
          courseDate
        ) {
          const data = {
            id,
            startHour,
            startMin,
            endHour,
            endtMin,
            teacherNo,
            teacherType,
            courseDate
          }
          this.$axios
            .post(
              '/fn/classes/lixiang/checkTeacherTimeConflict',
              { data },
              jsonHeaders
            )
            .then((res) => {
              const { code, data } = res.data
              if (code === 0) {
                row.conflict = data
              }
            })
        } else {
          return
        }
      },
      // 打开选择讲师 dialog
      openSelectTeacher(type, row) {
        if (row.isEvaluate==='Y') return
        if (type === this.ESTABLISH_COURSE_MAP.interiorBank) {
          this.selectInteriorLecturerVisible = true
          this.selectInteriorLecturerForm.row = row
        } else if (type === this.ESTABLISH_COURSE_MAP.sansLecturer) {
          if (row.courseType === this.ESTABLISH_COURSE_MAP.interior) {
            return this.$message.warning('请重新选择课程，将会自动带出讲师！')
          }
          this.selectExternalLecturerVisible = true
          this.selectExternalLecturerForm.row = row
        }
      },
      // 选择内部讲师 获取数据函数
      getInteriorLecturer() {
        const data = this.selectInteriorLecturerForm
        this.$axios
          .post('/fn/user/listUserInfos', { data }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              const { list, total } = data
              this.selectInteriorLecturerTableList = list
              this.selectInteriorLecturerForm.total = total
            }
          })
      },
      // 选择内部讲师查询函数
      searchInteriorLecturer() {
        this.selectInteriorLecturerForm.currPage = 1
        this.selectInteriorLecturerForm.pageSize = 5
        this.getInteriorLecturer()
      },
      // 重置内部讲师查函数
      resetInteriorLecturer() {
        this.selectInteriorLecturerForm.empName = ''
        this.selectInteriorLecturerForm.currPage = 1
        this.selectInteriorLecturerForm.pageSize = 5
        this.selectInteriorLecturerForm.total = 0
        this.selectInteriorLecturerTableList = []
      },
      // 内部讲师 dialog 确认事件
      interiorLecturerComfirm() {
        this.selectInteriorLecturerVisible = false
        const item =
          this.$refs.selectInteriorLecturerTableRef.$children[0].selection[0]
        if (!item) {
          return
        }
        const row = this.selectInteriorLecturerForm.row
        this.$set(row, 'teacherName', item.empName)
        row.teacherNo = item.umId
        console.log('interiorLecturerComfirm');
        this.checkClassTime(row)
      },
      // 外部讲师 dialog 获取数据
      getSelectExternalLecturer() {
        const data = CopyObj(this.selectExternalLecturerForm)
        data.blgStripLine =
          this.courseObj.blgStripLine || this.$store.state.userInfo.blgStripLine
        this.$axios
          .post(
            '/fn/course/external/listCourseInfosForClass',
            { data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              const { list, total } = data
              this.selectExternalLecturerTableList = list
              this.selectExternalLecturerForm.total = total
            }
          })
      },
      // 外部讲师 dialog 查询函数
      querySelectExternalLecturerComfirm() {
        this.selectExternalLecturerForm.currPage = 1
        this.selectExternalLecturerForm.pageSize = 5
        this.getSelectExternalLecturer()
      },
      // 外部讲师 dialog 重置函数
      resetSelectExternalLecturerComfirm() {
        resetObj(this.selectExternalLecturerForm)
        this.selectExternalLecturerForm.currPage = 1
        this.selectExternalLecturerForm.pageSize = 5
        this.selectExternalLecturerForm.total = 0
        this.selectExternalLecturerTableList = []
      },
      // 外部讲师 dialog 确认事件
      selectExternalLecturerComfirm() {
        this.selectExternalLecturerVisible = false
        const item =
          this.$refs.selectExternalLecturerTableRef.$children[0].selection[0]
        if (!item) {
          return
        }
        const { teacherName, teacherId } = item
        const { row } = this.selectExternalLecturerForm
        this.$set(row, 'teacherName', teacherName)
        row.teacherNo = teacherId
        console.log('selectExternalLecturerComfirm');
        this.checkClassTime(row)
      },
      // 获取选择外部课程数据
      getSelectExternalCourse() {
        const data = CopyObj(this.selectExternalCourseForm)
        data.blgStripLine =
          this.courseObj.blgStripLine || this.$store.state.userInfo.blgStripLine
        this.$axios
          .post(
            '/fn/course/external/listCourseInfosForClass',
            { data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              const { list, total } = data
              this.selectExternalCourseTableList = list
              this.selectExternalCourseForm.total = total
            }
          })
      },
      // 查询外部课程
      querySelectExternalCourse() {
        this.selectExternalCourseForm.currPage = 1
        this.selectExternalCourseForm.pageSize = 5
        this.getSelectExternalCourse()
      },
      // 重置外部课程
      resetSelectExternalCourse() {
        resetObj(this.selectExternalCourseForm)
        this.selectExternalCourseForm.currPage = 1
        this.selectExternalCourseForm.pageSize = 5
        this.selectExternalCourseForm.total = 0
        this.selectExternalCourseTableList = []
      },
      // 选择外部课程 确认事件
      selectExternalCourseComfirm() {
        this.selectExternalCourseVisible = false
        const item =
          this.$refs.selectExternalCourseTableRef.$children[0].selection[0]
        if (!item) {
          return
        }
        const { courseId, courseName, teacherName, teacherId, teacherType } = item
        const { row } = this.selectExternalCourseForm
        this.$set(row, 'courseName', courseName)
        row.courseId = courseId
        this.$set(row, 'teacherType', teacherType)
        this.$set(row, 'teacherName', teacherName)
        row.teacherNo = teacherId
        console.log('selectExternalCourseComfirm');
        this.checkClassTime(row)
      },
      // 打开通用课程dialog
      openSelectUniversalCourse(row) {
        if (row.isEvaluate==='Y') return
        this.courseTitle = '选择通用课程'
        this.selectUniversalCourseVisible = true
        this.selectUniversalCourseForm.row = row
        this.querySelectUniversalCourse()
      },
      // 获取选择通用课程数据
      getSelectUniversalCourse() {
        const data = CopyObj(this.selectUniversalCourseForm)
        data.blgStripLine =
          this.courseObj.blgStripLine || this.$store.state.userInfo.blgStripLine
        let url = '/fn/course/internal/listCommonCourseForClass'
        if (this.courseTitle === '选择内部课程') {
          url = '/fn/course/internal/searchInternalCourseList'
          data.isCommonCourse = 'N'
        }
        data.searchFrom = 'classModule'
        this.$axios.post(url, { data }, jsonHeaders).then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.selectUniversalCourseTableList = list
            this.selectUniversalCourseForm.total = total
          }
        })
      },
      // 查询通用课程
      querySelectUniversalCourse() {
        this.selectUniversalCourseForm.currPage = 1
        this.selectUniversalCourseForm.pageSize = 5
        this.getSelectUniversalCourse()
      },
      // 重置通用课程
      resetSelectUniversalCourse() {
        resetObj(this.selectUniversalCourseForm)
        this.selectUniversalCourseForm.currPage = 1
        this.selectUniversalCourseForm.pageSize = 5
        this.selectUniversalCourseForm.total = 0
        this.selectUniversalCourseTableList = []
      },
      // 选择通用课程 确认事件
      selectUniversalCourseComfirm() {
        this.selectUniversalCourseVisible = false
        const item =
          this.$refs.selectUniversalCourseTableRef.$children[0].selection[0]
        if (!item) {
          return
        }
        const { courseId, courseName, teacherName, teacherId, teacherType } = item
        const { row } = this.selectUniversalCourseForm
        this.$set(row, 'courseName', courseName)
        row.courseId = courseId
      },
      // 打开内部课程dialog
      openInternalCurriculum(row) {
        if (row.isEvaluate==='Y') return
        this.courseTitle = '选择内部课程'
        this.selectUniversalCourseForm.row = row
        this.selectUniversalCourseVisible = true
        this.querySelectUniversalCourse()
      },
      addTeacherTableItem () {
        this.teacherTableList.push({
          startTimer: '00:00:00 - 23:59:00',
          endTimer: '00:00:00 - 23:59:00'
        })
      },
      // 删除 一项 通关评审及带班老师
      delTeacherTableItem(index) {
        this.teacherTableList.splice(index, 1)
      },
      // 打开选择 带班讲师 dialog
      openSelectTeacherDialog(row) {
        this.selectTeacherVisible = true
        this.selectTeacherForm.row = row
      },
      // 查询 带班讲师信息
      searchSelectTeacher() {
        this.selectTeacherForm.currPage = 1
        this.getSelectTeacher()
      },
      // 重置 带班讲师信息
      resetSelectTeacher() {
        this.selectTeacherForm.empName = ''
        this.selectTeacherForm.currPage = 1
        this.selectTeacherForm.pageSize = 5
        this.selectTeacherForm.total = 0
        this.selectTeacherTableList = []
      },
      // 获取带班讲师数据
      getSelectTeacher() {
        if (!this.selectTeacherForm.empName) {
          return this.$message.warning('请先输入讲师姓名')
        }
        const data = CopyObj(this.selectTeacherForm)
        this.$axios
          .post('/fn/user/listUserInfos', { data }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              const { list, total } = data
              this.selectTeacherForm.total = total
              this.selectTeacherTableList = list
            }
          })
      },
      // 选择带班讲师 dialog 确认事件
      selectTeacherComfirm() {
        const item = this.$refs.selectTeacherTableRef.$children[0].selection[0]
        if (!item) {
          this.selectTeacherVisible = false
          return
        }
        const row = this.selectTeacherForm.row
        this.$set(row, 'teacherName', item.empName)
        row.teacherNo = item.umId
        this.selectTeacherVisible = false
      },
      // 验证课表数据
      verifyTimetable(courseList) {
        if (courseList.length < 1) {
          this.$message.warning('课表是必填项')
          return
        }
        // 查找不符合条件的一项
        const flag = courseList.some((v, i) => {
          i++
          if (!v.courseDate) {
            this.$message.warning(`课程表第${i}行日期必填`)
            return true
          } else if (v.courseDate < this.courseObj.dateStart) {
            this.$message.warning(`课程表第${i}行日期不能小于拟定开始日期`)
            return true
          } else if (v.courseDate > this.courseObj.dateEnd) {
            this.$message.warning(`课程表第${i}行日期不能大于拟定结束日期`)
            return true
          }
          if (!v.startTime) {
            this.$message.warning(`课程表第${i}行开始时间必填`)
            return true
          }
          if (!v.endTime) {
            this.$message.warning(`课程表第${i}行结束时间必填`)
            return true
          }
          if (!v.courseType) {
            this.$message.warning(`课程表第${i}行课程来源必选`)
            return true
          }
          if (!v.courseName) {
            this.$message.warning(`课程表第${i}行课程名称必填`)
            return true
          }
          if (!v.teacherType) {
            this.$message.warning(`课程表第${i}行讲师类型必填`)
            return true
          }
          // 优化需求，原本的授课方式有
          // 银行面授05002：讲师类型：内部银行01001，内部非银行01000，无讲师01003
          // 外部面授05003：讲师类型：外部讲师01002，无讲师01003
          // 移动05001：讲师类型：内部银行01001，内部非银行01000，外部讲师01002，无讲师01003
          // 更改后的课程来源
          // 内部课程05002：讲师类型：内部银行01001，内部非银行01000
          // 外部课程05003：讲师类型：外部讲师01002
          // 通用课程commonCourse：讲师类型：内部银行01001，内部非银行01000，无讲师01003
          // 进行培训班立项复制功能时需要重新剔除旧的数据
          if (v.courseType === '05001') {
            this.$message.warning(`课程表第${i}行课程来源请重新选择`)
            return true
          }
          if ((v.courseType === '05002' && v.courseType === '01003') || (v.courseType === '05003' && v.courseType === '01003')) {
            this.$message.warning(`课程表第${i}行讲师类型请重新选择`)
            return true
          }
          if (
            v.teacherType !== this.ESTABLISH_COURSE_MAP.notLecturer &&
            !v.teacherName
          ) {
            this.$message.warning(`课程表第${i}行讲师必填`)
            return true
          }
          // 判断是否需要提示 讲师上课时间是否冲突
          if (v.conflict?.length) {
            const item = v.conflict[0]
            customHint(
              `课程表第${i}行冲突<p class="em2">
                          ${item.teacherName}老师在${item.className}培训班${item.startDate}至${item.endDate}时间进行授课，请勿重复录入。</p>`
            )
            return true
          }
          // 验证 相同日期的时间是否交叉
          const needVeriftTimeList = courseList
            .slice(0, i - 1)
            .filter((n) => n.courseDate === v.courseDate)
          if (!needVeriftTimeList) {
            return false
          }
          let index = needVeriftTimeList.findIndex((n) => {
            return !(v.startTime >= n.endTime || v.endTime <= n.startTime)
          })
          if (index > -1) {
            index = courseList.findIndex((v) => v === needVeriftTimeList[index])
            this.$message.warning(`课程表第${i}行时间和第${index + 1}行时间交叉`)
            return true
          }
        })
        // 没找到 不符合条件的
        if (!flag) {
          return true
        }
      },
      // 验证 通关评审及带班老师信息
      verifyTeacherInfo(tgTeacherList) {
        const teacherFlag = tgTeacherList.some((v, i) => {
          i++
          if (!v.teacherName) {
            this.$message.warning(`通关评审及带班老师信息第${i}行讲师姓名必填`)
            return true
          }
          if (this.isNecessary(v.teacherType) && !v.contentDesc) {
            this.$message.warning(`通关评审及带班老师信息第${i}行内容必填`)
            return true
          }
          if (!v.tgDate1) {
            this.$message.warning(`通关评审及带班老师信息第${i}行开始日期必填`)
            return true
          } else if (v.tgDate1 < this.courseObj.dateStart) {
            this.$message.warning(
              `通关评审及带班老师信息第${i}行开始日期不能小于拟定开始日期`
            )
            return true
          } else if (v.tgDate1 > this.courseObj.dateEnd) {
            this.$message.warning(
              `通关评审及带班老师信息第${i}行开始日期不能大于拟定结束日期`
            )
            return true
          }
          if (!this.isNecessary(v.teacherType)) {
            if (!v.tgDate2) {
              this.$message.warning(`通关评审及带班老师信息第${i}行结束日期必填`)
              return true
            } else if (v.tgDate2 > this.courseObj.dateEnd) {
              this.$message.warning(
                `通关评审及带班老师信息第${i}行结束日期不能大于拟定结束日期`
              )
              return true
            }
          }
          if (!v.startTime) {
            this.$message.warning(`通关评审及带班老师信息第${i}行开始时间必选`)
            return true
          }
          if (!v.endTime) {
            this.$message.warning(`通关评审及带班老师信息第${i}行结束时间必填`)
            return true
          }
          if (!v.teacherType) {
            this.$message.warning(`通关评审及带班老师信息第${i}行讲师类型必填`)
            return true
          }

          // 验证 相同讲师 相同类型 日期，时间是否交叉
          const needVeriftTimeList = tgTeacherList
            .slice(0, i - 1)
            .filter(
              (n) =>
                n.teacherNo === v.teacherNo && n.teacherType === v.teacherType
            )
          if (!needVeriftTimeList) {
            return true
          }
          const flag = needVeriftTimeList.some((n, m) => {
            let state
            // 时间是否交叉或者相等
            if (!this.isNecessary(v.teacherType)) {
              state = !(v.tgDate1 >= n.tgDate2 || v.tgDate2 <= n.tgDate1)
            } else {
              state = v.tgDate1 === n.tgDate1
            }
            if (state) {
              if (!(v.startTime >= n.endTime || v.endTime <= n.startTime)) {
                this.$message.warning(
                  `通关评审及带班老师信息第${i}行时间和第${m + 1}行时间交叉`
                )
                return true
              }
            }
          })
          if (flag) {
            return true
          }
        })

        if (!teacherFlag) {
          return true
        }
      },
      // 课表批量上传 模版上传事件
      timetableUpload ($event) {
        const file = $event.target.files[0]
        this.timetableTemplate = file
        if (!file.name) {
          this.timetableBatchAdd = {}
          return
        }
        const data = new FormData()
        data.append('file', this.timetableTemplate)
        this.$axios
          .post('/common/lixiang/uploadCourse', data, dataHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (parseInt(code) === 0) {
              this.timetableBatchAdd = data
            }
          })
      },
      // 课程表批量上传确认事件
      timetableUploadComfirm () {
        this.timetableBatchAdd.succList.forEach((v) => {
          v.startTime = v.startTime ? `${v.startTime}:00` : '00:00:00'
          v.endTime = v.endTime ? `${v.endTime}:00` : '00:00:00'
          if (v.courseTypeDesc) {
            v.courseType = this.teachingMethodOptions.find(
              (n) => n.label === v.courseTypeDesc
            )?.value
            if (!v.courseType) {
              v.courseType = ''
              v.courseTypeDesc = ''
            }
          }
          if (v.teacherTypeDesc) {
            const options = this.getTeacherCategoryOptions(v.courseType)
            v.teacherType = options.find(
              (n) => n.label === v.teacherTypeDesc
            )?.value
            if (!v.teacherType) {
              v.teacherType = ''
              v.teacherTypeDesc = ''
            }
          }
          v.teacherTypeBack = v.teacherType
          v.teacherNoBack = v.teacherNo
          v.teacherNo = v.teacherUm
          v.customId = random()
          this.timetableListData.push(v)
          this.checkClassTime(v)
        })
        this.timetableBatchAddVisible = false
      },
      // 批量导入带班老师、关闭
      teacherstableBatchAddClose () {
        this.teacherstableBatchAddVisible = false
        this.teacherstableTemplate = {}
        this.teacherstableBatchAdd = {}
      },
      // 批量导入带班老师、上传
      async teacherstableUpload ($event) {
        this.teacherstableTemplate = $event.target.files[0]
        $event.target.value = ''
        const data = new FormData()
        data.append('file', this.teacherstableTemplate)
        data.append('classId', this.commcClassId)
        const dataList = await this.$axios.post('/common/classes/lixiang/importBatchDbTeacherFile', data, dataHeaders)
        if (String(dataList.data?.code) === '0') {
          this.teacherstableBatchAdd = dataList.data?.data || {}
        }
      },
      // 批量导入带班老师、确认
      teacherstableUploadComfirm () {
        if (!this.teacherstableTemplate.name) {
          return this.$message.warning('请选择文件后再提交')
        }
        this.teacherstableBatchAdd.list.forEach((v) => {
          v.startTimer = '00:00:00 - 23:59:00'
          v.endTimer = '00:00:00 - 23:59:00'
          v.tgDate1 = v.startDate
          v.tgDate2 = v.endDate
        })
        this.teacherTableList = [...this.teacherTableList, ...this.teacherstableBatchAdd.list]
        this.$message.success('批量上传成功')
        setTimeout(() => {
          this.teacherstableBatchAddVisible = false
        }, 100)
      },
      // 课程dialog 提交事件
      async courseManagementComfirm () {
        if (!this.verifyTimetable(this.timetableListData)) {
          return
        }
        if (!this.verifyTeacherInfo(this.teacherTableList)) {
          return
        }
        const courseList = this.timetableListData
        const tgTeacherList = this.teacherTableList
        const {
          classId,
          className,
          classStatus,
          blgOrg,
          blgStripLine,
          dateStart,
          dateEnd,
          applyStatus,
          isFreeze
        } = this.courseObj
        const data = {
          courseList,
          tgTeacherList,
          classId,
          className,
          classStatus,
          blgOrg,
          blgStripLine,
          dateStart,
          dateEnd,
          applyStatus,
          isFreeze
        }
        data.courseList.forEach((v) => {
          v.classId = classId
          if (v.startTime) {
            ;[v.startHour, v.startMin] = v.startTime.split(':')
          }
          if (v.endTime) {
            ;[v.endHour, v.endtMin] = v.endTime.split(':')
          }
          if (!v.courseId) {
            v.courseId = 'N'
          }
          v.courseType =
            v.courseType === ESTABLISH_COURSE_MAP.commonCourse
              ? ESTABLISH_COURSE_MAP.bank
              : v.courseType
        })
        data.tgTeacherList.forEach((v) => {
          v.classId = classId
          if (v.startTime) {
            ;[v.startHour, v.startMin] = v.startTime.split(':')
          }
          if (v.endTime) {
            ;[v.endHour, v.endtMin] = v.endTime.split(':')
          }
        })
        this.$axios
          .post(
            '/fn/classes/manager/course/saveCourseManagerInfo',
            { data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success('保存成功')
              this.courseManagementVisible = false
            }
          })
      },
      // 批量上传事件
      batchUploadCourse($event) {
        const file = $event.target?.files?.[0]
        if (!file) {
          return
        }
        const data = new FormData()
        data.append('file', file)
        this.$axios
          .post('/common/lixiang/uploadCourse', data, dataHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (parseInt(code) === 0) {
              data.forEach((v) => {
                v.startTime = v.startTime ? `${v.startTime}:00` : '00:00:00'
                v.endTime = v.endTime ? `${v.endTime}:00` : '00:00:00'
                if (v.courseTypeDesc) {
                  v.courseType = this.teachingMethodOptions.find(
                    (n) => n.label === v.courseTypeDesc
                  )?.value
                  if (!v.courseType) {
                    v.courseType = ''
                    v.courseTypeDesc = ''
                  }
                }
                if (v.teacherTypeDesc) {
                  const options = this.getTeacherCategoryOptions(v.courseType)
                  v.teacherType = options.find(
                    (n) => n.label === v.teacherTypeDesc
                  )?.value
                  if (!v.teacherType) {
                    v.teacherType = ''
                    v.teacherTypeDesc = ''
                  }
                }
                v.customId = random()
                this.timetableListData.push(v)
              })
            }
          })
      },
      // 跳转到新增内部课程
      jumpToAddInternalCurriculum() {
        this.state = 'course'

        addAllowKeepAlive('/InternalCurriculumManagement')
        this.$router.push({
          name: '内部课程管理',
          params: { state: 'course' }
        })
        this.courseManagementVisible = false
      },
      // 跳转到新增外部课程
      jumpToAddExternalCurriculum() {
        this.state = 'course'
        addAllowKeepAlive('/ExternalCurriculumManagement')
        this.$router.push({
          name: '外部课程管理',
          params: { state: 'course' }
        })
        this.courseManagementVisible = false
      },
      // 打开 调整学员 dialog
      openAdjustStudent() {
        const item = this.courseObj
        if (!item) {
          return this.$message.warning('请先选择培训班')
        }
        const { classId, classStatus } = item
        // if (!["02002"].includes(classStatus)) {
        //     return this.$message.warning("进行中的培训班才能调整学员");
        // }
        console.log(item, 'item')
        this.classId = classId
        this.getStudentList()
      },
      // 查询学员
      getStudentList (flag) {
        const data = CopyObj(this.studentForm)
        flag && (data.umId = '')
        if (!data.umId) {
          Reflect.deleteProperty(data, 'umId')
        } else {
          data.umId = data.umId.toUpperCase()
        }
        data.classId = this.classId
        this.$axios
          .post('/fn/classes/manager/listStudentAdjust', data, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              const { list, total } = data
              this.studentTableList = list
              this.studentForm.total = total
              this.adjustStudentVisible = true
            }
          })
      },
      // 新增学员
      handleAddStudent() {
        if (!this.addStudentSearchUmId) {
          this.$message.warning('新增学员时，请输入学员UM号(用于模糊查询)')
          this.$refs.searchUmidRef.focus()
          return
        }
        const data = {
          umId: this.addStudentSearchUmId.toUpperCase()
        }
        this.$axios
          .post('/fn/user/listEmployeeInfo', { data }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              if (data.length) {
                this.choiceStudenTableList = data
                // this.choiceStudentVisible = true
              } else {
                this.$message.warning('未找到该学员')
              }
            }
          })
      },
      // 搜索学员
      handleSearchStudent() {
        this.studentForm.busiType =  this.blgOrgIds?.[0]
        this.studentForm.orgId =  this.blgOrgIds?.[1]
        this.studentForm.currPage = 1
        this.studentForm.pageSize = 5
        this.getStudentList()
      },
      // 学员导出
      handleStudentExport() {
        const data = {
          classId: this.classId,
          busiType: this.blgOrgIds?.[0] || '',
          orgId: this.blgOrgIds?.[1] || '',
          umId: this.studentForm.umId
        }
        axiosDownload(
          '/fn/classes/manager/exportClassStudent',
          data,
          '培训班学员导出.xls'
        )
      },
      // 批量导入Change事件
      async studentImportChange($event) {
        this.batchChannelStudentFile = $event.target.files[0]
        $event.target.value = ''
        this.$nextTick(() => {
          if (!this.batchChannelStudentFile.name) {
            this.setImportStudentData()
          }
        })
      },
      // 批量导入积分提交
      async studentImportComfirm() {
        if (!this.batchChannelStudentFile.name) {
          return this.$message.warning('请选择文件后再提交')
        }
        if (this.batchChannelStudentFile) {
          const data = new FormData()
          data.append('file', this.batchChannelStudentFile)
          data.append('classId', this.commcClassId)
          fetchBatchClassStudent(data).then((resData) => {
            this.setImportStudentData(resData)
            this.handleSearchStudent()
            if (resData.fail?.length) {
              // manyLineHint(resData.fail)
            } else {
              this.importStudentVisible = false
              this.$message.success('批量导入成功')
            }
          })
        }
      },
      // 批量导入 关闭事件
      studentImportClose() {
        this.importStudentVisible = false
        this.batchChannelStudentFile = {}
        this.setImportStudentData()
      },
      setImportStudentData (data) {
        if (data && data.success && data.fail) {
          this.importStudentData.isUpload = data.success.length || data.fail.length
          this.importStudentData.successLength = data.success.length
          this.importStudentData.failLength = data.fail.length
          this.importStudentData.success = data.success
          this.importStudentData.fail = data.fail
        } else {
          this.importStudentData = {
            isUpload: false,
            fail: [],
            success: [],
            failLength: 0,
            successLength: 0
          }
        }
      },
      // 删除一个学员
      delOneStudent(scope) {
        let index, umId
        if (scope) {
          index = scope.$index
          ;({ umId } = scope.row)
          hintFrame('确定要删除该学员').then(() => {
            this.delStudent(umId)
          })
        } else {
          umId = -1
          this.delStudent(umId)
        }
      },
      // 删除学员 共用方法
      delStudent(umId) {
        const data = { classId: this.classId, umId }
        this.$axios
          .post('/fn/classes/manager/deleteStudent', data, jsonHeaders)
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.getStudentList()
            }
          })
      },
      // 学员清空事件
      studentTableClear() {
        hintFrame('确定要清空学员').then(() => {
          this.delOneStudent()
        })
      },
     // 学员表格点击事件
     studentRowClick(row, column, event) {},
     // 调整学员确认事件
      adjustStudentComfirm() {
        this.adjustStudentVisible = false
      },
     // 调整学员 关闭
      adjustStudenClose() {
        this.adjustStudentVisible = false
        this.studentForm.umId = ''
        this.studentTableList = []
      },
     // 选择新增学员 确认事件
      choiceStudentComfirm() {
        const selection = this.$refs.choiceStudenTableRef.$children[0].selection
        if (!selection.length) {
          this.choiceStudentVisible = false
          return
        }
        const data = { list: selection, classId: this.classId }
        this.$axios
          .post('/fn/classes/manager/managerCommit', data, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success('添加成功')
              this.choiceStudentVisible = false
              this.choiceStudenTableList = []
              this.addStudentSearchUmId = ''
              this.getStudentList()
            }
          })
      },
      choiceStudentCannel () {
        this.choiceStudentVisible = false
        this.choiceStudenTableList = []
        this.addStudentSearchUmId = ''
      },
      // 确认结训
      finishTrainNormalClass() {
        const item = this.$refs.tableRef.$children[0].selection[0]
        if (!item) {
          return this.$message.warning('请先选择培训班')
        }
        const { classId, classStatus, apply_status } = item
        if (apply_status === '02003') {
          return this.$message.warning('已结训培训班不可操作！')
        }
        const data = { classId, isCheckFinishOnly: 'Y' }
        this.$axios
          .post(
            '/fn/classes/manager/finishTrainNormalClass',
            { data },
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              let msg
              if (data.errorMsgs?.length) {
                return manyLineHint(data.errorMsgs)
              } else if (data.halfEvaluateTip) {
                msg = data.halfEvaluateTip
              } else {
                msg = '确认结训'
              }
              hintFrame(msg).then((res) => {
                const data = { classId, isCheckFinishOnly: '' }
                this.$axios
                  .post(
                    '/fn/classes/manager/finishTrainNormalClass',
                    { data },
                    jsonHeaders
                  )
                  .then((res) => {
                    const { code, data } = res.data
                    if (code === 0) {
                      this.$message.success('操作成功')
                      this.getList()
                    }
                  })
              })
            }
          })
      },
      // 打开 课程管理 dialog
      openCourseManagemen() {
        const item = this.courseObj
        if (!item) {
          return this.$message.warning('请先选择培训班')
        }
        this.row = item
        const data = { classId: item.classId }
        this.courseManagementVisible = true
        this.$axios
          .post(
            '/fn/classes/manager/course/findCourseManagerInfo',
            { data },
            jsonHeaders
          )
          .then(async (res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.courseObj = data
              let { courseList, tgTeacherList } = data

              // 需求变更：过滤出阶梯课程，并查询外部讲师，获取list
              // let ladderCourse = courseList
              //   .filter((item) => item.isLadder === '1')
              //   .map((item) => item.courseId)
              // let teacherList = await this._queryExternalTeacherList(ladderCourse)
              let ladderTeacherList = []
              courseList?.forEach((v) => {
                v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}`

                v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}`
                this.startTimeChange(v.startTime, v)
                this.endTimeChange(v.endTime, v)
                // v.disabled = v.teacherType !== '01001' ? true : false
                v.courseNameBack = v.courseName
                v.courseTypeBack = v.courseType
                v.teacherTypeBack = v.teacherType
                v.teacherNoBack = v.teacherNo
                v.courseType =
                  v.isCommonCourse === 'Y'
                    ? ESTABLISH_COURSE_MAP.commonCourse
                    : v.courseType

                if (v.isLadder === '1') {
                  ladderTeacherList.push(v)
                }
                // let courseTeachInfo = teacherList.find(
                //   (findItem) => findItem.courseId === v.courseId
                // ).teacherInfo
                // v.courseTeachInfo = courseTeachInfo.map((infoItem) => ({
                //   ...infoItem,
                //   label: infoItem.teacherName,
                //   value: infoItem.teacherId
                // }))
              })

              if (courseList) {
                let formatTeacherList = await this._inintOutTeacherList(
                  ladderTeacherList
                )
                courseList = courseList.map((courseItem) => {
                  let findFormatItem = CopyObj(formatTeacherList).find(
                    (findItem) => findItem.courseId === courseItem.courseId
                  )
                  if (!findFormatItem) return courseItem
                  return {
                    ...courseItem,
                    courseTeachInfo: findFormatItem.courseTeachInfo,
                    renderTeacherName: courseItem.teacherNo
                  }
                })
              }

              tgTeacherList?.forEach((v) => {
                v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}`
                v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}`
                this.startTimeChange(v.startTime, v)
                this.endTimeChange(v.endTime, v)
              })
              this.timetableListData = CopyObj(courseList)
              this.timetableListData.forEach((row) => {
                row.customId = random()
                console.log('openCourseManagemen');
                this.checkClassTime(row)
              })
              this.teacherTableList = CopyObj(tgTeacherList)
            }
          })},
        // 跳转到 立项信息
        async projectApproval() {
          const item = this.courseObj
          const classId = item && item.classId
          let data
          try {
            data = await this.getEstablishProject(
              classId,
              '/fn/classes/lixiang/showClass'
            )
          } catch {}
          if (!data) return
          data.blgStripLine = item.blgStripLine
          const c = { ...data }
          console.log(c, '打印最新的数据9999999');
          this.projectApprovalData = { ...data }
        },
        // 获取立项数据
        getEstablishProject(classId, url) {
          url = url || '/fn/classes/lixiang/initClass'
          return this.$axios.post(url, { classId }, jsonHeaders).then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              return data
            }
          })
        },
        // 跳转到 考勤管理
        openAttendanceManagement() {
          const item = this.courseObj
          const { classId, classStatus, dateStart } = item
          const params = { id: classId, dateStart }
          this.AttendanceManagemenData = params
          if (!['02002', '02003'].includes(classStatus)) {
            return this.$message.warning('未通过审批不能进行考勤管理')
          }
          if (formatDate(new Date()) < dateStart) {
            return this.$message.warning('该培训班还未开始不能进行考勤')
          }
        },
        // 跳转到 培训班评估
        openAssessment() {
          const item = this.courseObj
          if (!item) {
            return this.$message.warning('请先选择培训班')
          }
          const { classId, classStatus, dateStart, dateEnd, applyStatus } = item
          const params = { id: classId, dateEnd, applyStatus, dateStart }
          this.TrainingCourseAssessmentData = params;
          if (formatDate(new Date()) < dateStart) {
            return this.$message.warning('该培训班还未开始不能进行评估')
          }
        },
        // 跳转到 训后录入
        openInputAfterTraning() {
          const item = this.courseObj
          if (!item) {
            return this.$message.warning('请先选择培训班')
          }
          const { classId, classStatus, dateStart } = item
          // if (!["02002"].includes(classStatus)) {
          //     return this.$message.warning("进行中的培训班才能训后录入");
          // }
          const params = { id: classId }
          // addAllowKeepAlive('/InputAfterTraning')
          // this.$router.push({
          //   name: '训后录入',
          //   params
          // })
          this.InputAfterTraningData = params;
        },
        // 跳转到归档
        openPigeonhole() {
          const item = this.courseObj
          if (!item) {
            return this.$message.warning('请先选择培训班')
          }
          const { classId, className, dateStart, applyStatus } = item
          if ('02002' !== applyStatus) {
            return this.$message.warning('未审批通过的培训班不能归档')
          }
          const params = { id: classId, className }
          // addAllowKeepAlive('/TrainingCoursePigeonhole')
          // this.$router.push({
          //   name: '培训班归档',
          //   params
          // })
          this.TrainingCoursePigeonholeData = params;
        },
        // 查外部讲师
        async _queryExternalTeacherList(courseIds) {
          if (!courseIds.length) return []
          return await fetchQueryOutsideLadderCourse({ courseIds })
        },
        // 外部讲师变更事件
        courseTeacherChangeHandle(value, row) {
          let teachersList = row.courseTeachInfo
          let teacherInfo = teachersList.find((item) => item.teacherId === value)
          Object.keys(teacherInfo).forEach((item) => {
            this.$set(row, item, teacherInfo[item])
          })
        },

      async _inintOutTeacherList(data) {
        let res = CopyObj(data)
        let teachlist = await this._queryExternalTeacherList(
          res.map((item) => item.courseId)
        )
        if (!teachlist.length) return res
        res.forEach((item) => {
          let courseTeachInfo = teachlist.find(
            (findItem) => findItem.courseId === item.courseId
          )
          if (!courseTeachInfo) return
          item.courseTeachInfo = courseTeachInfo.teacherInfo.map((infoItem) => ({
            ...infoItem,
            label: infoItem.teacherName,
            value: infoItem.teacherId
          }))
          item.renderTeacherName = item.teacherNo
        })
        return res
      }
  }
}
</script>
<style lang="scss">
.establish__trainingCourseManagement {
  margin-bottom: 55px;
  .btns {
    display: flex;
    height: 30px;
    margin-top: 20px;
    justify-content: space-between;

    div {
      flex: 1;
      margin-left: 20px;
      border: 1px dashed #e2e3e6;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  &__courseManagement {
    .icons span {
      border-right: none;
      margin-right: 5px;
    }
    .btns {
      display: flex;
      height: 30px;
      margin-top: 20px;
      justify-content: space-between;

      div {
        flex: 1;
        margin-left: 20px;
        border: 1px dashed #e2e3e6;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
  &__attendanceManagement {
    .remark {
      display: flex;
      margin-top: 30px;
      color: #7d8292;
      line-height: 18px;
      .left {
        margin-left: 15px;
      }
      .right {
        margin-left: 20px;
        p {
          display: flex;
          margin-bottom: 12px;
          align-items: center;
          &:last-child {
            margin-bottom: 0;
          }
          i {
            margin-right: 8px;
          }
        }
      }
    }
  }
  &__attendanceBatchImport {
    .el-dialog__body {
      padding: 0 0 20px 0 !important;
      .el-tabs__content {
        padding: 0 20px;
      }
    }
  }
  .btns_sumbit {
    // height: 30px;
    margin-top: 20px;
    text-align: center;
      .button_timetable{
         width: 80px;
         height: 30px;
         padding: 0px 10px;
         background: #FD6720;
      }
  }

}
.delog_css p{
  height: 40px;
  line-height: 40px;
}
.footer-fixed {
  // position: fixed;
  // width: 100%;
  // left: 5px;
  // bottom: 0px;
  // padding: 10px 0;
  // width: calc(100% - 178px);


  position: fixed;
  bottom: 0;
  padding: 10px;
  background:#f5f6fb;
  z-index: 4;
  box-shadow: 0 -4px 10px 0 rgb(0 0 0 / 7%);
  width: calc(100% - 215px);
}
.menu-collapse {
  width: calc(100% - 101px);
  // width: calc(100% - 64px);
}
</style>
<style lang="scss" scoped>
.nav {
  :deep(.el-tabs__header) {
    background-color: #fff;
    margin-bottom: 10px;
  }
}
.btns_sumbit {
  background-color: #fff;
  width: calc(100% - 210px);
}
.course-wrapper {
  min-height: calc(100vh - 150px);
  margin-bottom: 0;
  padding-bottom: 55px;
}
</style>