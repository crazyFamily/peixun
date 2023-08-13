<template>
  <div class="establish__addEstablishProject">
    <el-card class="base-info">
      <div class="title">
        <div class="title__menu"></div>
        立项信息
      </div>
      <el-form
        :model="baseInfoForm"
        :rules="baseInfoRules"
        :disabled="baseInfoDisabled"
        class="form mt20"
        label-width="70px"
        ref="baseInfoFormRef"
      >
        <template v-if="baseInfoForm.classId">
          <el-form-item label="项目编号">
            <el-input v-model="baseInfoForm.classId" disabled></el-input>
          </el-form-item>
        </template>
        <el-form-item
          label="条线"
          prop="busiType"
          class="blgStripLine"
          v-if="blgStripLine !== 'JF'"
          key="busiType"
        >
          <el-input
            class="page-input"
            readonly
            @focus="openSelectLine"
            :value="baseInfoForm.busiType"
          >
            <i
              slot="suffix"
              class="page-input__search"
              @click="openSelectLine"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item label="项目分类" prop="classTypes">
          <el-cascader
            clearable
            class="w100"
            :options="projectCategoryOptions"
            :props="{ value: 'dataEncode', label: 'dataValue' }"
            @change="projectCategoryChange"
            v-model="baseInfoForm.classTypes"
          ></el-cascader>
          <p v-if="baseInfoForm.classTypes && baseInfoForm.classTypes.includes(CLASS_TYPE_KXYF)" class="error-color">*注：如知鸟课程不涉及费用，无需立项，直接通过来做课平台完成上架流程即可。</p>
        </el-form-item>
        <el-form-item label-width="0" class="if-conformance">
          <div class="between">
            <el-form-item class="inherit" label="是否消保培训" inline label-width="110px;" prop="ifConformance">
              <gc-select class="w-200" :options="yesOrNoMap" v-model="baseInfoForm.ifConformance"></gc-select>
            </el-form-item>
            <el-form-item label="培训形式" prop="trainingMode">
              <gc-select class="w-200" :options="TRAININGMODE" v-model="baseInfoForm.trainingMode"></gc-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="项目名称" prop="className">
          <el-input v-model="baseInfoForm.className"></el-input>
        </el-form-item>
        <el-form-item label="申请部门">
          <el-input disabled v-model="baseInfoForm.blgOrgName"></el-input>
        </el-form-item>
        <el-form-item label="拟定日期" required key="dateStart">
          <div class="df">
            <el-form-item class="search-card__date mr10" prop="dateStart">
              <el-date-picker
                v-model="baseInfoForm.dateStart"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                :picker-options="
                  isChangePage && changeState !== 2
                    ? {}
                    : handleStartPickerOptions(baseInfoForm, 'dateEnd')
                "
                value-format="yyyy-MM-dd"
                popper-class="date-picker"
                @input="dateStartChange"
              >
              </el-date-picker>
            </el-form-item>
            <span class="mr10">至</span>
            <el-form-item
              class="search-card__date"
              prop="dateEnd"
              label-width="0"
            >
              <el-date-picker
                v-model="baseInfoForm.dateEnd"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                :disabled="isChangePage && changeState !== 2"
                :picker-options="
                  handleEndPickerOptions(baseInfoForm, 'dateStart')
                "
                value-format="yyyy-MM-dd"
                popper-class="date-picker"
                @input="dateEndChange"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="关联计划" prop="annualPlanId">
          <gc-readonlyInput class="mb0" @click.native="handleOpenCorrelation">
            {{ baseInfoForm.annualPlanName }}
            <template v-slot:end>
              <i class="page-input__search"></i>
            </template>
          </gc-readonlyInput>
        </el-form-item>
        <el-form-item
          label="事后立项说明"
          required
          v-if="!baseInfoDisabled && isAfterExplain"
          class="afterExplain"
          maxlength="10"
          show-word-limit
          prop="afterExplain"
        >
          <el-input class="w100" v-model="baseInfoForm.afterExplain"></el-input>
        </el-form-item>
        <el-form
          :disabled="false"
          :model="baseInfoForm"
          :rules="baseInfoRules"
          v-if="baseInfoDisabled"
          label-width="70px"
          ref="afterExplainRef"
        >
          <el-form-item
            label="事后立项说明"
            required
            v-if="isAfterExplain"
            class="afterExplain"
            maxlength="10"
            show-word-limit
            prop="afterExplain"
          >
            <el-input
              class="w100"
              v-model="baseInfoForm.afterExplain"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form-item label="参与对象" required v-if="!isShowTrainingCost">
          <div class="between">
            <el-form-item prop="attendObject">
              <el-input
                class="w250"
                v-model="baseInfoForm.attendObject"
              ></el-input>
            </el-form-item>
            <div class="df">
              <span class="mr10 necessary-before l1 mr4">计划参加人数</span>
              <el-form-item label-width="0">
                  <!-- v-model.number="baseInfoForm.planNum" -->
                <el-input
                  class="w250"
                  :value="totalPlanNum()"
                  disabled
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="计划参加人数" v-else class="afterExplain">
          <el-form-item label-width="0">
              <!-- v-model.number="baseInfoForm.planNum" -->
            <el-input
              class="w250"
              :value="totalPlanNum()"
              disabled
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="df">
            <span class="necessary-before l1 mr10 mr4">
              职级分类
              <el-tooltip
                v-if="busiType"
                effect="light"
                popper-class="table-popper"
                ><i class="el-icon-question active"></i>
                <div slot="content" :style="{ width: '364px' }">
                  <gc-table
                    :list="[
                      {
                        label: '职级分类',
                        prop: 'cate',
                        width: '64'
                      },
                      {
                        label: '对应人群',
                        prop: 'state',
                        width: '300'
                      }
                    ]"
                    :tableList="rankCategory"
                  ></gc-table>
                </div>
              </el-tooltip>
            </span>
            <div class="between f1">
              <div class="df">
                <span class="mr10">{{ busiType ? 'A类' : '执委/高级' }}</span>
                <el-form-item label-width="0" prop="aNum">
                  <el-input class="w80" v-model.number="baseInfoForm.aNum">
                    <template v-slot:suffix>人</template>
                  </el-input>
                </el-form-item>
              </div>

              <div class="df">
                <span class="mr10">{{ busiType ? 'B类' : '中级' }}</span>
                <el-form-item label-width="0" class="df" prop="bNum">
                  <el-input class="w80" v-model.number="baseInfoForm.bNum">
                    <template v-slot:suffix>人</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="df" v-show="busiType">
                <span class="mr10">C类</span>
                <el-form-item label-width="0" class="df" prop="cNum">
                  <el-input class="w80" v-model.number="baseInfoForm.cNum">
                    <template v-slot:suffix>人</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="df" v-show="busiType">
                <span class="mr10">D类</span>
                <el-form-item label-width="0" class="df" prop="dNum">
                  <el-input class="w80" v-model.number="baseInfoForm.dNum">
                    <template v-slot:suffix>人</template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="df">
                <span class="mr10">{{ busiType ? 'E类' : '初级及以下' }}</span>
                <el-form-item label-width="0" class="df" prop="eNum">
                  <el-input class="w80" v-model.number="baseInfoForm.eNum">
                    <template v-slot:suffix>人</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="拟定地点" prop="citys" v-if="!isShowTrainingCost && !isOtraining">
          <el-cascader
            clearable
            class="w-250"
            :options="cityOptions"
            :props="{ value: 'addressId', label: 'addressName' }"
            v-model="baseInfoForm.citys"
            @change="cityChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="项目背景" class="textarea" prop="backgroundReason">
          <el-input
            type="textarea"
            resize="none"
            maxlength="500"
            show-word-limit
            v-model="baseInfoForm.backgroundReason"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div v-show="!isShowTrainingCost">
        <div v-show="!isOtraining" class="timetable">
          <div class="title">
            <div class="title__menu"></div>
            <span :class="isNeedVerifyTimetable ? 'necessary-before l1' : ''">
              课程表
            </span>
            <el-checkbox
              class="ml20"
              @click.native="isComputeHourClick"
              v-model="isComputeHour"
            >
              不计算闲时课时
            </el-checkbox>
            <el-tooltip effect="light"
              ><i class="el-icon-question active"></i>
              <div slot="content" :style="{ width: '200px' }">
                勾选后将不计算12:00-14:00、18:00-19:00的课时，任何情况下都不计算0:00-8:00的课时
              </div>
            </el-tooltip>
          </div>
          <gc-table
            drop
            row-key="customId"
            class="general__table mt20"
            :list="timetableList"
            :tableList="timetableListData"
          >
            <el-table-column label="日期" width="146">
              <template v-slot="scope">
                <el-date-picker
                  type="date"
                  class="w-120"
                  placeholder="选择日期"
                  v-model="scope.row.courseDate"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                  :disabled="scope.row.isEvaluate==='Y'"
                  @change="checkClassTime(scope.row)"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="254">
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
                    startTimeChange($event, scope.row),
                      needHintChange(scope.row)
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
            <el-table-column label="课程来源" min-width="136">
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
            <el-table-column label="课程名称" min-width="236">
              <template v-slot="scope">
                <el-input
                  v-show="!scope.row.courseType"
                  disabled
                  value="请先选择课程类型"
                ></el-input>
                <div class="df">
                  <el-input
                    :readonly="
                      scope.row.courseType !== ESTABLISH_COURSE_MAP.move
                    "
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
                </div>

                <gc-readonlyInput
                  class="mb0"
                  :disabled="scope.row.isEvaluate==='Y'"
                  v-show="
                    scope.row.courseType === ESTABLISH_COURSE_MAP.interior
                  "
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
            <el-table-column label="讲师类型" min-width="136">
              <template v-slot="scope">
                <gc-select
                  :options="getTeacherCategoryOptions(scope.row.courseType)"
                  v-model="scope.row.teacherType"
                  :disabled="scope.row.isEvaluate==='Y'"
                  @change="teacherTypeChange(scope.row)"
                ></gc-select>
              </template>
            </el-table-column>
            <el-table-column label="讲师" width="186">
              <template v-slot="scope">
                <gc-readonlyInput
                  class="mb0"
                  v-show="
                    (scope.row.teacherType ===
                      ESTABLISH_COURSE_MAP.interiorBank ||
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
                      @click="
                        openSelectTeacher(scope.row.teacherType, scope.row)
                      "
                    ></i>
                  </template>
                </gc-readonlyInput>
                <gc-select
                  v-if="
                    scope.row.teacherType ===
                      ESTABLISH_COURSE_MAP.sansLecturer &&
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
                    scope.row.teacherType ===
                    ESTABLISH_COURSE_MAP.interiorNotBank
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
            <el-table-column label="操作" width="76">
              <template v-slot="scope">
                <span
                  class="active mr10"
                  :class="{'disabled': scope.row.isEvaluate==='Y'}"
                  @click="delTimetableItem(scope.$index,scope.row)"
                >
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i :class="{'operation__del': scope.row.isEvaluate!=='Y','operation__del-disabled': scope.row.isEvaluate==='Y'}"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </gc-table>
          <div class="btns">
            <div class="add" @click="addTimetableItem">添加</div>
            <div class="add mr20" @click="batchImport">批量导入</div>

            <div class="add-internal" @click="jumpToAddInternalCurriculum">
              新增内部课程
            </div>
            <div class="add-external ml20" @click="jumpToAddExternalCurriculum">
              新增外部课程
            </div>
          </div>
        </div>
        <OtInfoTable v-model="onlineTrainingCourseList" :list="onlineTrainingCourseListRender" :baseInfoForm="{dateStart:baseInfoForm.dateStart,dateEnd:baseInfoForm.dateEnd}" v-if="isOtraining" ref="otInfoTable" />
        <div class="teacher-info mt30">
          <div class="title">
            <div class="title__menu"></div>
            <span :class="isNeedVerifyTeacherInfo ? 'necessary-before l1' : ''">
              通关评审及带班老师信息
            </span>
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
              <el-table-column label="类型" min-width="150px">
                <template v-slot="scope">
                  <gc-select
                    v-model="scope.row.teacherType"
                    :options="teacherCategoryOptions"
                  ></gc-select>
                </template>
              </el-table-column>
              <el-table-column label="内容" min-width="200">
                <template v-slot="scope">
                  <div class="df">
                    <span style="width: 10px">
                      <i
                        class="necessary-before"
                        v-show="isNecessary(scope.row.teacherType)"
                      ></i>
                    </span>
                    <el-input v-model.trim="scope.row.contentDesc"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="起止日期" min-width="376">
                <template v-slot="scope" class="aic">
                  <el-date-picker
                    type="date"
                    class="w-150"
                    placeholder="选择日期"
                    v-model="scope.row.tgDate1"
                    :clearable="false"
                    :picker-options="
                      handleStartPickerOptions(scope.row, 'tgDate2')
                    "
                    value-format="yyyy-MM-dd"
                    popper-class="date-picker"
                  >
                  </el-date-picker>
                  <span
                    class="ml10 mr10"
                    v-show="!isNecessary(scope.row.teacherType)"
                    >至</span
                  >
                  <el-date-picker
                    type="date"
                    class="w-150"
                    placeholder="选择日期"
                    v-model="scope.row.tgDate2"
                    v-show="!isNecessary(scope.row.teacherType)"
                    :clearable="false"
                    :picker-options="
                      handleEndPickerOptions(scope.row, 'tgDate1')
                    "
                    value-format="yyyy-MM-dd"
                    popper-class="date-picker"
                  >
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="起止时间" min-width="280">
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
              <el-table-column label="操作" min-width="78">
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
            <div class="add" @click="addTeacherTableItem">添加</div>
            <div class="add" @click="teacherstableBatchAddVisible = true">批量导入带班老师</div>
            <!-- <div class="batch-import">批量导入</div> -->
          </div>
        </div>
        <div class="cost-info mt30">
          <div class="title">
            <div class="title__menu"></div>
            费用信息
          </div>
          <CostInfoTable
            :list="costInfoList"
            ref="costInfoTable"
            :lecturerList="lecturerList"
            @isBeyond="isBeyond"
            @listChange="listChange"
          />
        </div>
        <div class="cost-beyond mt30" v-if="dinnerFeeDesc || placeFeeDesc">
          <div class="title">
            <div class="title__menu"></div>
            费用超出说明
          </div>
          <el-form
            class="mt20"
            label-width="160px"
            :model="baseInfoForm"
            :rules="baseInfoRules"
            ref="costBeyond"
          >
            <el-form-item
              v-if="dinnerFeeDesc"
              label="餐杂费超标说明"
              prop="dinnerFeeDesc"
            >
              <el-input
                type="textarea"
                resize="none"
                v-model="baseInfoForm.dinnerFeeDesc"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="场租及会务费超标说明"
              prop="placeFeeDesc"
              v-if="placeFeeDesc"
            >
              <el-input
                type="textarea"
                resize="none"
                v-model="baseInfoForm.placeFeeDesc"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="apportion-const mt50">
          <div class="title">
            <div class="title__menu"></div>
            费用分摊明细
          </div>
          <div class="menu-right icons no-line">
            <span class="icons__upload active instructor-icons__upload" @click="isCostBatchShow = true">
              <i class="icons__upload__icon"></i>
              批量上传
            </span>
            <AddApportionUnit
              url="/fn/user/selectFixedTree"
              @addApportionUnit="addApportionUnit"
              :otherParams="{isAll: 'Y'}"
              @handleNodeList="handleNodeList"
            />
            <span class="icons__del active" @click="delAllApportionConst">
              <i class="icons__del__icon"></i>
              清空
            </span>
          </div>
          <gc-table
            class="general__table"
            :list="apportionConstList"
            :tableList="portionApportionConstTableList"
            ref="apportionConstRef"
          >
            <el-table-column label="分摊培训餐杂费" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetCanZa"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="场租及会务费" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetChangZu"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="分摊外部培训费" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetWbpxf"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="分摊差旅" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetChaiLv"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="分摊其他费用" width="150px" prop="divideBudgetOther">
              <template v-slot="scope">
                <el-input class="w90 mr10" v-model="scope.row.divideBudgetOther"></el-input>元
              </template>
            </el-table-column>
            <el-table-column label="分摊说明" width="300px">
              <template v-slot="scope">
                <el-input type="textarea" v-model="scope.row.divideDesc" resize="none" rows="2" maxlength="100" show-word-limit></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="124">
              <template v-slot="scope">
                <span
                  class="active mr10"
                  @click="delApportionConstItem(scope.$index)"
                >
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i class="operation__del"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </gc-table>
          <div class="table-left general__table mt-1">
            <el-table :data="[{}]" :show-header="false">
              <el-table-column>
                分摊至辖下单位的费用预算总金额
                <el-input
                  class="w100 mlr5"
                  disabled
                  :value="apportionConstTotal"
                ></el-input>
                元由被分摊单位分别承担，从培训费中列支，其余费用由立项单位承担。
              </el-table-column>
            </el-table>
          </div>
          <gc-pagination
            :total="apportionConstForm.total"
            :page-size="apportionConstForm.pageSize"
            :current-page="apportionConstForm.currPage"
            @sizeChange="
              sizeChange($event, apportionConstForm, getApportionConst)
            "
            @currentChange="
              currentChange($event, apportionConstForm, getApportionConst)
            "
            class="between"
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </div>
        <div class="student mt30">
          <div class="title">
            <div class="title__menu"></div>
            参训学员
          </div>
          <div class="menu-right icons no-line mt20">
            <!-- <span class="icons__upload active">
              <gc-fileInput
                accept=".xls,.xlsx"
                @change="studentBatchUploadChange"
                width="auto"
              >
                <i class="icons__upload__icon"></i>
                批量上传
              </gc-fileInput>
            </span>
            <span
              class="icons__download active"
              @click="
                templateDownload('/common/file/downloadModule', {
                  fileCode: 'umId'
                })
              "
            >
              <i class="icons__download__icon"></i>
              模版下载
            </span> -->
            <span class="icons__upload active" @click="batchChannelPointVisible = true">
              <i class="icons__upload__icon"></i>
              批量导入
            </span>
            <span class="icons__add active" @click="openAddStudent">
              <i class="icons__add__icon"></i>
              新增
            </span>
            <span class="icons__del active" @click="delAllStudent">
              <i class="icons__del__icon"></i>
              清空
            </span>
          </div>
          <gc-table
            class="general__table mt20"
            ref="studentTableRef"
            :list="studentList"
            :tableList="portionStudentTableList"
          >
            <el-table-column label="操作" min-width="86">
              <template v-slot="scope">
                <span class="active mr10" @click="delOneStudent(scope.$index)">
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
            @sizeChange="sizeChange($event, studentForm, () => {})"
            @currentChange="currentChange($event, studentForm, () => {})"
            class="between"
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </div>
      </div>
      <div v-show="isShowTrainingCost">
        <div class="training-cost">
          <div class="title">
            <div class="title__menu"></div>
            培训费用明细表
          </div>
          <gc-table
            class="general__table mt20"
            :list="trainingCostList"
            :tableList="trainingCostListData"
          >
            <el-table-column label="费用明细描述" min-width="600px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remarkDesc"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="200px">
              <template slot-scope="scope">
                <div class="aic">
                  <el-input class="mr10" v-model="scope.row.expense"></el-input>
                  元
                </div>
              </template>
            </el-table-column>
          </gc-table>
        </div>
      </div>
      <div class="accessory-info mt30">
        <div class="title">
          <div class="title__menu"></div>
          附件信息
        </div>
        <div class="menu-right mt20">
          <gc-fileInput width="auto" @change="accessoryChange">
            <span class="icons__add active">
              <i class="icons__add__icon"></i>
              新增
            </span>
          </gc-fileInput>
          <span class="icons__del last active" @click="delAccessory">
            <i class="icons__del__icon"></i>
            删除
          </span>
        </div>
        <gc-table
          class="general__table mt20"
          ref="accessoryTableRef"
          :list="accessoryList"
          :tableList="accessoryTableList"
        >
          <el-table-column label="操作" min-width="124">
            <template v-slot="scope">
              <span class="active mr10" @click="delOneAccessory(scope.$index)">
                <el-tooltip content="删除" popper-class="icon-popper">
                  <i class="operation__del"></i>
                </el-tooltip>
              </span>
            </template>
          </el-table-column>
        </gc-table>
        <!-- <gc-pagination
                    :total="accessoryForm.total"
                    :page-size="accessoryForm.pageSize"
                    :current-page="accessoryForm.currPage"
                    @sizeChange="
                        sizeChange($event, accessoryForm, getAccessory)
                    "
                    @currentChange="
                        currentChange($event, accessoryForm, getAccessory)
                    "
                    class="between"
                >
                </gc-pagination> -->
      </div>
      <div class="mt30">
        <ApprovalChain
          :value="ApprovalChainValue"
          :autoApproval="autoApproval"
          :lixiangCondition="lixiangCondition"
          @genLixiangCondition="genLixiangCondition"
          @confirm="approvalChainConfirm"
          @openApproval="openApproval"
        />
      </div>
      <div class="btns dfc mt60">
        <el-button class="button-w80-h30 mr20" @click="back">返回</el-button>
        <template v-if="chnageShowState === 1">
          <el-button class="button-w80-h30" type="primary" @click="save"
            >更改立项</el-button
          >
        </template>
        <template v-else>
          <el-button v-if="saveShowState" class="button-w80-h30 button-blue mr20" @click="save"
            >保存</el-button
          >
          <el-button class="button-w80-h30" type="primary" @click="submit"
            >发送审批</el-button
          >
        </template>
      </div>
      <div class="dfc mt20" v-if="chnageShowState === 1">
        只更改时间将不再发起审批
      </div>
    </el-card>

    <!-- 选择条线 dialog -->
    <gc-model
      title="选择条线"
      :visible="selectLineVisible"
      width="800px"
      @close="selectLineVisible = false"
      @cancel="selectLineVisible = false"
      @comfirm="selectLineConfirm"
    >
      <el-tree
        :data="lineList"
        :props="{ label: 'lineName' }"
        :default-expanded-keys="lineKeys"
        show-checkbox
        node-key="lineCode"
        ref="lineTree"
      >
      </el-tree>
    </gc-model>

    <!-- 关联计划 dialog -->
    <gc-model
      title="关联计划"
      :visible="correlationVisible"
      width="1200px"
      class="correlation-plan"
      @close="correlationClose"
      @cancel="correlationVisible = false"
      @comfirm="correlationComfirm"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="计划内" name="internalPlan" class="internalPlan">
          <div class="between-noc mt5">
            <el-form :model="internalPlanForm" inline label-width="72px">
              <el-form-item label="项目名称">
                <el-input v-model.trim="internalPlanForm.annualPlanName"></el-input>
              </el-form-item>
              <el-form-item label="所属部门" class="org-style">
                <gc-institution v-model="internalPlanForm.orgs" :org-url="API_SELECT_ASSOCIATE_PLAN_TREE" :default-show="true" :left-show="true" @setDataFinish="orgSetDataFinish" ref="institutionRef"></gc-institution>
                <!-- <gc-institution class="ml10" style="top:10px;" orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" /> -->
                <el-checkbox v-model="internalPlanForm.isGotSubBranch" true-label="Y" false-label="N" class="ml10">含下属机构</el-checkbox>
              </el-form-item>
              <!-- 非培训班不需要这些条件 -->
              <template v-if="trainingCourse">
                <el-form-item label="培训系列及子系列" label-width="120px" style="width: 330px">
                  <TrainSeriesCascader v-model="internalPlanForm.trainSeries" :line="blgStripLine || ''" :type="baseInfoForm?.classTypes?.[0] || ''"></TrainSeriesCascader>
                </el-form-item>
                <el-form-item label="业务模块">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    :options="selectOptions.channelTypes"
                    v-model="internalPlanForm.channelType"
                    @change="channelTypeChange"
                  ></gc-select>
                </el-form-item>
                <el-form-item label="关键岗位">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    :options="internalKeyPositionOptions"
                    v-model="internalPlanForm.keyJobs"
                  ></gc-select>
                </el-form-item>
              </template>
            </el-form>
            <div class="df">
              <el-button class="button-60" @click="searchPlan">查询</el-button>
              <el-button class="button-60 button-blue" @click="resetPlan"
                >重置</el-button
              >
            </div>
          </div>
          <gc-table
            class="general__table table-radio"
            ref="internalPlanTableRef"
            :list="internalPlanList"
            :tableList="internalPlanTableList"
            @selection-change="
              tableSelectionChange($refs, $event, 'internalPlanTableRef')
            "
          >
          </gc-table>
          <gc-pagination
            :total="internalPlanForm.total"
            :page-size="internalPlanForm.pageSize"
            :current-page="internalPlanForm.currPage"
            @sizeChange="sizeChange($event, internalPlanForm, getPlanList)"
            @currentChange="
              currentChange($event, internalPlanForm, getPlanList)
            "
            class="between"
          />
        </el-tab-pane>
        <el-tab-pane
          label="计划外"
          name="externalPlan"
          class="internalPlan external-plan-wrapper"
          v-if="!isLadderCourse"
        >
          <div class="between-noc mt5">
            <el-form
              v-if="!trainingCourse"
              :model="externalPlanForm"
              :rules="externalPlanFormRule"
              inline
              label-width="72px"
              ref="externalPlanFormRef"
              @submit.native.prevent
            >
              <el-form-item label="计划类型">
                <gc-readonlyInput class="w-200">
                  {{
                    getProjectCateName(
                      (baseInfoForm.classTypes || [])[0],
                      projectCategoryOptions
                    )
                  }}
                </gc-readonlyInput>
              </el-form-item>
              <el-form-item label="培训类型">
                <gc-readonlyInput class="w-200">
                  {{
                    getProjectCateName(
                      (baseInfoForm.classTypes || [])[1],
                      projectCategoryOptions
                    )
                  }}
                </gc-readonlyInput>
              </el-form-item>
              <el-form-item label="计划名称">
                <gc-readonlyInput class="w-200"> 计划外项目 </gc-readonlyInput>
              </el-form-item>
            </el-form>

            <el-form
              v-else
              :model="externalPlanForm"
              :rules="externalPlanFormRule"
              @submit.native.prevent
              inline
              label-width="72px"
              ref="externalPlanFormRef"
            >
              <el-form-item label="计划类型">
                <gc-readonlyInput class="w-200">
                  {{
                    getProjectCateName(
                      (baseInfoForm.classTypes || [])[0],
                      projectCategoryOptions
                    )
                  }}
                </gc-readonlyInput>
              </el-form-item>
              <el-form-item label="培训类型">
                <gc-readonlyInput class="w-200">
                  {{
                    getProjectCateName(
                      (baseInfoForm.classTypes || [])[1],
                      projectCategoryOptions
                    )
                  }}
                </gc-readonlyInput>
              </el-form-item>
              <el-form-item label="计划名称">
                <gc-readonlyInput class="w-200"> 计划外项目 </gc-readonlyInput>
              </el-form-item>
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model.trim="externalPlanForm.projectName"></el-input>
              </el-form-item>
              <!-- <template v-if="blgStripLine !== 'JF'"> -->
              <template>
                <el-form-item label="业务模块" prop="channelType">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    :options="selectOptions.channelTypes"
                    v-model="externalPlanForm.channelType"
                    @change="channelTypeChange"
                  ></gc-select>
                </el-form-item>
                <!-- 零售还是以前的逻辑，非零/金服改为输入的形式，非必填 -->
                <template v-if="blgStripLine === LINE_LS">
                  <el-form-item
                    label="关键岗位"
                    :prop="ladderTraining ? 'keyJobs' : ''"
                  >
                    <gc-select
                      k="dataValue"
                      v="dataEncode"
                      :options="keyPositionOptions"
                      v-model="externalPlanForm.keyJobs"
                    ></gc-select>
                  </el-form-item>
                </template>
                <template v-else>
                  <el-form-item label="关键岗位">
                    <el-input
                      v-model="externalPlanForm.keyJobs"
                      placeholder="请输入关键岗位"
                      :maxlength="50"
                      show-word-limit
                      class="external-keyjobs-style"
                    ></el-input>
                  </el-form-item>
                </template>
                <el-form-item label="培训系列" prop="trainSeries">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    :options="selectOptions.trainSeries"
                    v-model="externalPlanForm.trainSeries"
                    @change="trainSeriesChange"
                  ></gc-select>
                </el-form-item>
                <el-form-item label="子系列" prop="childSeries">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    @change="FLChildSeriesChange"
                    :options="trainSeriesChildOptions"
                    v-model="externalPlanForm.childSeries"
                  ></gc-select>
                </el-form-item>
              </template>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </gc-model>

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

    <!-- 选择通用课程 dialog -->
    <!-- 通用课程， 内部课程共用 -->
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

    <!-- 批量导入 dialog -->
    <!-- <InstructorBatchImport
      title="批量导入学员"
      :visible.sync="importStudentVisible"
      @change="studentImportChange"
      @templateDownload="templateDownload('/common/file/downloadModule', { fileCode: 'umId' })"
      @comfirm="studentImportComfirm"
      @close="studentImportClose"
    >
      <div v-if="importStudentData && importStudentData.isUpload">
        <p style="margin-bottom: 5px;">
          {{ `上传结果：${importStudentData.successLength} 条数据导入成功，${importStudentData.failLength} 条数据导入失败`}}
        </p>
        <p v-for="error in importStudentData.fail" :key="error" class="error-color">{{ error }}</p>
      </div>
    </InstructorBatchImport> -->
    <!-- ..... -->
    <gc-model
      title="批量导入学员"
      :visible.sync="batchChannelPointVisible"
      width="500px"
      height="285px"
      isAppend
      @comfirm="batchChannelPointComfirm"
    >
      <InstructorBatchImport
        title="批量导入学员"
        :visible="batchChannelPointVisible"
        @close="batchChannelPointClose"
        @cancel="batchChannelPointClose"
        @comfirm="batchChannelPointComfirm"
        @change="batchChannelPointChange"
        @templateDownload="templateDownload('/common/file/downloadModule', { fileCode: 'umId' })"
      >
        <div v-if="failStrList && JSON.stringify(failStrList) !== '{}'">
          <p>{{ `${failStrList.successNum}条数据导入成功，${failStrList.failNum}条数据导入失败` }}</p>
          <p v-for="error in failStrList.errorTips" :key="error" class="error-color" >{{ error }}</p>
        </div>
      </InstructorBatchImport>
    </gc-model>

    <!-- 新增学员 dialog -->
    <gc-model
      title="新增学员"
      width="1200px"
      custom-class="add-student"
      :visible="addStudentVisible"
      @close="addStudentClose"
      @cancel="addStudentVisible = false"
      @comfirm="addStudentComfirm"
    >
      <div class="between plr20">
        <el-form :model="addStudentForm" inline @submit.native.prevent>
          <el-form-item label="UM号" class="mb0">
            <el-input
              class="w200"
              placeholder="请输入学员UM号"
              v-model.trim="addStudentForm.umId"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button class="button-60" @click="searchStudent">查询</el-button>
          <el-button class="button-60 button-blue" @click="resetStudent"
            >重置</el-button
          >
        </div>
      </div>

      <div class="student-box plr20">
        <div class="menu-right mt20">
          <span class="icons__add last active" @click="handleAddStudent">
            <i class="icons__add__icon"></i>
            添加
          </span>
        </div>

        <gc-table
          class="general__table mt20"
          ref="addStudentTableRef"
          :list="addStudentList"
          :tableList="addStudentTableList"
        >
        </gc-table>
        <!-- <gc-pagination
                    :total="addStudentForm.total"
                    :page-size="addStudentForm.pageSize"
                    :current-page="addStudentForm.currPage"
                    @sizeChange="sizeChange($event, addStudentForm, getStudent)"
                    @currentChange="
                        currentChange($event, addStudentForm, getStudent)
                    "
                /> -->
      </div>

      <div class="selected-table-box">
        <div class="between">
          <div>
            <span>已选择：</span>
            <span class="active-no-pointer"
              >{{ selectedStudentTableList.length }}人</span
            >
          </div>
          <div class="mb0">
            <span class="icons__del last active" @click="removeStudent">
              <i class="icons__del__icon"></i>
              移除
            </span>
          </div>
        </div>

        <gc-table
          class="general__table mt20"
          ref="selectedStudentTableRef"
          :list="selectedStudentList"
          :tableList="selectedStudentTableList"
        >
        </gc-table>
      </div>
    </gc-model>

    <!-- 课表批量导入 dialog -->
    <InstructorBatchImport
      title="课表批量导入"
      :visible="timetableBatchAddVisible"
      @close="timetableBatchAddVisible = false, timetableTemplate = null, timetableBatchAdd = {}"
      @cancel="timetableBatchAddVisible = false"
      @change="timetableUpload"
      @comfirm="timetableUploadComfirm"
      @templateDownload="templateDownload('/common/file/downloadModule', { fileCode: 'trainCourse' })"
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
    <!-- 费用批量导入弹窗 -->
    <ImportModel
      :show="isCostBatchShow"
      :faildColumns="importFaildColumns"
      :importFetchFn="fetchCourseImgUpload"
      :faildExportFetchFn="fetchExportFailShareFee"
      templateCode="ESTABLISH_COST_BATCH"
      @showChange="isCostBatchShow = $event"
      @comfirm="costBatchUploadChange"
    ></ImportModel>
  </div>
</template>

<script>
import $ from 'jquery'
import {
  merge,
  random,
  cached,
  CopyObj,
  myRound,
  resetObj,
  hintFrame,
  uploadFile,
  formatDate,
  sizeChange,
  customHint,
  localPaging,
  jsonHeaders,
  dataHeaders,
  manyLineHint,
  currentChange,
  filterBusiType,
  templateDownload,
  addAllowKeepAlive,
  tableSelectionChange,
  getBlgStripLineOptions,
  handleEndPickerOptions,
  handleStartPickerOptions,
  numerationAfterwardsDays,
  numerationTimeFateDifference,
  downloadAdapter,
  renderName
} from '../../../util/utils'

import { ESTABLISH_COURSE_MAP, busiTypes, LINE_MAP, yesOrNoMap, TRAININGMODE, LINE_LS } from '@/util/constants'
import { allowKeepAlive } from '../../../router'
import CostInfoTable from '../components/CostInfoTable'
import AddApportionUnit from '../../../components/chunk/AddApportionUnit'
import ApprovalChain from '../../../components/ApprovalChain'
import OtInfoTable from './components/OtInfoTable'
import {
  fetchQueryLadderCourse,
  fetchQueryOutsideLadderCourse,
  fetchBatchClassStudent,
  fetchListClassAssociatePlan,
  fetchExportFailShareFee
} from '@/fetch/establish'
import { API_SELECT_ASSOCIATE_PLAN_TREE, fetchCourseImgUpload } from '@/fetch/public'
import { IF_CONFORMANCE_OPTIONS } from '../enum'
import { YES_STATUS } from '@/views/CourseRecommendation/enum'
import TrainSeriesCascader from '@/components/cascader/TrainSeriesCascader.vue'
import { APIAllTree } from '@/fetch/public'
import { LADDER_COURSE_TYPE, CLASS_TYPE_KXYF } from '../enum'
import ImportModel from '@/components/upload/ImportModel.vue'
import { number } from 'echarts/core'
export default {
  name: 'AddEstablishProject',
  components: {
    CostInfoTable,
    AddApportionUnit,
    ApprovalChain,
    OtInfoTable,
    TrainSeriesCascader,
    ImportModel
  },
  data() {
    // 授课方式 讲师类型 枚举映射
    function validator(rule, value, callback) {
      if (Math.floor(value) !== value || !isFinite(value) || value < 0) {
        return callback(new Error())
      }
      callback()
    }
    return {
      CLASS_TYPE_KXYF,
      classId: '',
      commcClassId: '',
      // 当前页面是新增 还是修改 或者补充立项
      pageState: '',
      // 页面状态映射
      pageStateMaping: {
        add: '新增立项',
        edit: '修改立项',
        supplement: '补充立项',
        change: '更改立项'
      },
      // 上个页面传入的培训班信息
      classObj: {},
      // 当前条线
      blgStripLine: '',
      // 从立项信息带过来的机构（用户所在机构）
      deptno: '',
      // 基本信息表单
      baseInfoForm: {
        aNum: '',
        bNum: '',
        cNum: '',
        dNum: '',
        eNum: '',
      },
      // 基本信息表单 验证规则
      baseInfoRules: {
        busiType: [
          {
            required: true,
            message: '请选择条线'
          }
        ],
        classTypes: [
          {
            required: true,
            type: 'array',
            min: 2,
            message: '请选择项目分类'
          }
        ],
        ifConformance: [
          {
            required: true,
            message: '请选择是否消保培训'
          }
        ],
        trainingMode: [
          {
            required: true,
            message: '请选择培训形式'
          }
        ],
        className: [
          {
            required: true,
            message: '请填写项目名称',
            trigger: 'blur'
          }
        ],
        annualPlanId: [{ required: true, message: '请选择关联计划' }],
        dateStart: [{ required: true, message: '请选择开始时间' }],
        dateEnd: [{ required: true, message: '请选择结束时间' }],
        afterExplain: [
          {
            required: true,
            message: '请填写事后立项说明',
            trigger: 'blur'
          }
        ],
        attendObject: [
          {
            required: true,
            message: '请填写参与对象',
            trigger: 'blur'
          }
        ],
        // planNum: [
          // {
          //   required: true,
          //   message: '请填写计划参加人数',
          //   trigger: 'blur'
          // },
          // {
          //   validator,
          //   message: '计划参加人数必须是整数',
          //   trigger: 'blur'
          // }
        // ],
        aNum: [
          { required: true, message: '请填写A类', trigger: 'blur' },
          { validator, message: '请填写整数', trigger: 'blur' }
        ],
        bNum: [
          { required: true, message: '请填写B类', trigger: 'blur' },
          { validator, message: '请填写整数', trigger: 'blur' }
        ],
        cNum: [
          { required: true, message: '请填写C类', trigger: 'blur' },
          { validator, message: '请填写整数', trigger: 'blur' }
        ],
        dNum: [
          { required: true, message: '请填写D类', trigger: 'blur' },
          { validator, message: '请填写整数', trigger: 'blur' }
        ],
        eNum: [
          { required: true, message: '请填写E类', trigger: 'blur' },
          { validator, message: '请填写整数', trigger: 'blur' }
        ],
        citys: [
          {
            required: true,
            message: '请选择拟定地点',
            type: 'array',
            min: 2
          }
        ],
        backgroundReason: [
          {
            required: true,
            message: '请填写项目背景',
            trigger: 'blur'
          }
        ],
        dinnerFeeDesc: [
          {
            required: true,
            message: '请填写餐杂费超标说明',
            trigger: 'blur'
          }
        ],
        placeFeeDesc: [
          {
            required: true,
            message: '请填写场租及会务费费超标说明',
            trigger: 'blur'
          }
        ]
      },
      // 条线下拉选项
      blgStripLineOptions: [],
      // 项目分类级联选项
      projectCategoryOptions: [],
      // 关联计划 所有 下拉选项
      selectOptions: {},
      // 拟定地点 下拉框选项
      cityOptions: [],
      // 职级分类 说明数据数组
      rankCategory: [
        {
          cate: 'A',
          state: '总行行级领导'
        },
        {
          cate: 'B',
          state:
            '总行总监、分行行长、行业事业部总裁、其他事业部总裁、总行部门正职'
        },
        {
          cate: 'C',
          state: '总行部门、事业部、分行班子副职及其他高级人员'
        },
        {
          cate: 'D',
          state: '总行室正、副经理，分行/行业事业部部门正、副职，支行行长'
        },
        {
          cate: 'E',
          state: '其他人员'
        }
      ],
      // 课程表 是否计算闲时课时
      isComputeHour: false,
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
        {
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
      // 课程表 数据数组
      timetableListData: [],
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

      // 授课方式 下拉选项
      teachingMethodOptions: [
        { label: '内部课程', value: ESTABLISH_COURSE_MAP.bank },
        { label: '外部课程', value: ESTABLISH_COURSE_MAP.interior },
        { label: '通用课程', value: ESTABLISH_COURSE_MAP.commonCourse }
        // { label: '移动', value: ESTABLISH_COURSE_MAP.move }
      ],
      // 通用课程， 内部课程共用 title
      courseTitle: '选择通用课程',
      // 外部讲师课酬列表
      lecturerList: [],
      // 外部讲师课酬列表 备份
      lecturerListBack: '',
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
      // 费用信息 数据数组
      costInfoList: [],
      // 分摊费用 字段数组
      apportionConstList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '条线',
          prop: 'divideStripLine',
          ctx: (row) => {
            return busiTypes.find(v => row.divideStripLine === v.value)?.label
          }
        },
        {
          label: '分摊单位',
          width: '430',
          prop: 'divideOrgName'
        }
      ],
      // 分摊费用 数据数组
      apportionConstTableList: [],
      // 分摊费用请求表单
      apportionConstForm: {
        total: 0,
        currPage: 1,
        pageSize: 5
      },
      // 参训学员批量导入
      // importStudentVisible: false,
      // importStudentData: {
      //   isUpload: false,
      //   fail: [],
      //   success: [],
      //   failLength: 0,
      //   successLength: 0
      // },
      // // 批量导入文件对象
      // batchChannelStudentFile: {},
      // .....
      batchChannelPointVisible: false,
      failStrList: {},
      batchChannelPointFile: {},
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
          width: '192',
          prop: 'umId'
        },
        {
          label: '类型',
          width: '108',
          prop: 'blgStripLine',
          ctx: (row) => row.busiType || filterBusiType(row.blgStripLine)
        },
        {
          label: '部门',
          width: '312',
          prop: 'orgName'
        },
        {
          label: '岗位',
          width: '348',
          prop: 'pnbrDesc'
        }
      ],
      // 参训学员 数据数组
      studentTableList: [],
      // 参训学员 分页表单
      studentForm: {
        total: 0,
        currPage: 1,
        pageSize: 5
      },
      // 附件信息 字段数组
      accessoryList: [
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
          label: '附件名称',
          width: '748',
          prop: 'fileName'
        }
      ],
      // 附件信息 数据数组
      accessoryTableList: [],
      // 外部线上培训课表数据
      onlineTrainingCourseList: [],
      onlineTrainingCourseListRender: [],
      // 附件信息 分页表单
      accessoryForm: {},
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
      // 新增学员 dialog 状态
      addStudentVisible: false,
      // 新增学员 dialog 字段数组
      addStudentList: [
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
          label: '姓名',
          width: '74',
          prop: 'empName'
        },
        {
          label: 'UM号',
          width: '170',
          prop: 'umId'
        },
        {
          label: '类型',
          width: '92',
          prop: 'blgStripLine',
          ctx: (row) => filterBusiType(row.blgStripLine)
        },
        {
          label: '部门',
          width: '340',
          prop: 'blgOrgName'
        },
        {
          label: '岗位',
          width: '330',
          prop: 'postDesc'
        }
      ],
      // 新增学员 dialog 数据数组
      addStudentTableList: [],
      // 新增学员 dialog 分页表单
      addStudentForm: {},
      // 已选择学员 字段数组
      selectedStudentList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          label: '姓名',
          width: '74',
          prop: 'empName'
        },
        {
          label: 'UM号',
          width: '170',
          prop: 'umId'
        },
        {
          label: '类型',
          width: '92',
          prop: 'blgStripLine',
          ctx: (row) => filterBusiType(row.blgStripLine)
        },
        {
          label: '部门',
          width: '340',
          prop: 'blgOrgName'
        },
        {
          label: '岗位',
          width: '330',
          prop: 'postDesc'
        }
      ],
      // 已选择学员 数据数组
      selectedStudentTableList: [],
      // 限制日期组件 结束不能大于开始时间的工具函数
      handleStartPickerOptions,
      handleEndPickerOptions,
      // 防止重复提交变量
      flag: true,
      // 授课方式 讲师类型 枚举映射
      ESTABLISH_COURSE_MAP,
      // 表格单选工具函数
      tableSelectionChange,
      // 关联计划弹窗 dialog 状态
      correlationVisible: false,
      // 显示内部计划还是外部计划
      activeName: 'internalPlan',
      // 内部计划 form 表单
      internalPlanForm: {
        trainSeries: [],
        orgs: [],
        currPage: 1,
        pageSize: 5,
        isGotSubBranch: 'Y'
      },
      // 内部计划 form 验证规则
      internalPlanFormRule: {},
      // 外部计划 form 表单
      externalPlanForm: {},
      // 外部计划 form 验证规则
      externalPlanFormRule: {
        channelType: [
          {
            required: true,
            message: '请选择业务模块',
            trigger: 'change'
          }
        ],
        keyJobs: [
          {
            required: true,
            message: '请选择关键岗位',
            trigger: 'change'
          }
        ],
        trainSeries: [
          {
            required: true,
            message: '请选择培训系列',
            trigger: 'change'
          }
        ],
        childSeries: [
          {
            required: true,
            message: '请选择培训子系列',
            trigger: 'change'
          }
        ],
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'change'
          }
        ]
      },
      // 内部计划字段数组
      internalPlanList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '54'
        },
        {
          label: '年份',
          width: '80',
          prop: 'planYear'
        },
        {
          label: '条线',
          width: '100',
          prop: 'blgStripLine',
          formatter: row => LINE_MAP[row.blgStripLine]
        },
        {
          label: '计划单位',
          width: '200',
          prop: 'packageDeptName'
        },
        {
          label: '项目名称',
          width: '130',
          prop: 'className'
        },
        {
          label: '培训类型',
          width: '100',
          prop: 'trainTypeDesc'
        },
        {
          label: '是否消保培训',
          width: '130',
          prop: 'ifConformance',
          formatter: row => row.ifConformance === YES_STATUS ? '是':'否'
        },
        {
          label: '业务模块',
          width: '110',
          prop: 'channelTypeDesc'
        },
        {
          label: '关键岗位',
          width: '110',
          prop: 'keyJobsDesc'
        },
        {
          label: '培训系列及子系列',
          width: '150',
          prop: 'trainSeriesDesc',
          formatter: row => [row.trainSeriesDesc, row.childSeriesDesc].join('/')
        },
        {
          label: '创建人',
          width: '200',
          prop: 'createdBy',
          formatter: row => renderName(row.createdByName, row.createdBy)
        },
        {
          label: '创建人部门',
          width: '266',
          prop: 'blgDeptName'
        }
      ],
      // 内部计划数据数组
      internalPlanTableList: [],
      // 内部 关键岗位下拉选项
      internalKeyPositionOptions: [],
      // 内部 培训子系列 下拉选项
      internalTrainSeriesChildOptions: [],
      // 外部 关键岗位下拉选项
      keyPositionOptions: [],
      // 外部 培训子系列 下拉选项
      trainSeriesChildOptions: [],
      // 分页工具函数
      sizeChange,
      currentChange,
      // 审批链需要的数据
      lixiangCondition: {},
      // 条线数组
      lineList: [],
      // 选择条线dialog 状态
      selectLineVisible: false,
      // 默认展开的节点
      lineKeys: [],
      // 餐杂费 是否超标
      dinnerFeeDesc: false,
      // 场租及会务费 是否超标
      placeFeeDesc: false,
      // 培训费用明细表字段数组
      trainingCostList: [
        {
          label: '费用事项',
          width: '120',
          prop: 'costDesc'
        }
      ],
      // 培训费用明细表数据数组
      trainingCostListData: [
        {
          costDesc: '讲师课时费',
          expenseType: '001201',
          expense: 0,
          remarkDesc: ''
        },
        {
          costDesc: '课程研发费',
          expenseType: '000201',
          expense: 0,
          remarkDesc: ''
        }
      ],
      // 模版下载工具函数
      templateDownload,
      // 基本信息是否禁止修改
      baseInfoDisabled: false,
      // 更改立项页面用到的状态
      // 0 进入更改立项页面时的默认状态 1 只修改了时间的状态 2 修改了其他的状态
      changeState: 0,
      // 是否可以修改 changeState 的开关
      isChange: true,
      // 项目开始时间 更改立项用的
      changePageStartTime: '',
      // 回显审批链数据
      ApprovalChainValue: '',
      // 是否为阶梯课程模式
      isLadderCourse: false,
      outTeacherMap: new Map(),
      downloadAdapter,
      yesOrNoMap, // 是否消保培训选项
      TRAININGMODE, // 是否消保培训选项
      IF_CONFORMANCE_OPTIONS,
      LINE_LS,
      APIAllTree,
      // 批量导入费用弹窗显示控制
      isCostBatchShow: false,
      importFaildColumns: [
        { label: '分摊条线', prop: 'divideStripLineName', width: '150px' },
        { label: '分摊单位', prop: 'divideOrgName', width: '90px' },
        { label: '失败原因', prop: 'msg', width: '200px' }
      ],
      fetchExportFailShareFee,
      fetchCourseImgUpload,
      API_SELECT_ASSOCIATE_PLAN_TREE,
      // 北京：110000 上海：310000 广州：440100 深圳：440300 杭州：330100
      firstTierCity: ['110000','310000','440100','440300','330100']
    }
  },
  methods: {
    // 日期选择限制
    startTimeChange($event, row) {
      row.endTimer = `${$event}:00 - 23:59:00`
    },
    endTimeChange($event, row) {
      row.startTimer = `00:00:00 - ${$event}:00`
    },
    // 处理条线 数据树
    handleLineTree(arr) {
      const dict = {}
      arr.forEach((v) => {
        dict[v.lineCode] = v
        if (v.lineCode === '0') {
          return
        }
        if (!dict[v.prnLineCode].children) {
          dict[v.prnLineCode].children = []
        }
        dict[v.prnLineCode].children.push(v)
      })
      return [dict['0']]
    },
    // 后台返回的数据转换为适合本页的数据
    async dataTransition(data) {
      const {
        classTypeOne,
        classTypeTwo,
        addressProvince,
        addressCity,
        auditUsersUm
      } = data.classInfoDTO
      this.baseInfoForm = data.classInfoDTO
      this.isComputeHour =
        data.classInfoDTO.freeTimeOutside === 'Y' ? true : false
      this.projectCategoryOptions = this.handleProjectCategoryOptions(data)
      this.cityOptions = this.handleCityOptions(data)
      this.$set(
        this.baseInfoForm,
        'classTypes',
        [classTypeOne, classTypeTwo].filter((v) => v)
      )
      this.$set(
        this.baseInfoForm,
        'citys',
        [addressProvince, addressCity].filter((v) => v)
      )

      // 判断是否为阶梯课程
      this.isLadderCourse = this.baseInfoForm.classTypes[1] === '02001'

      let ladderTeacherList = []
      data?.courseList?.forEach((v) => {
        v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}`
        v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}`
        v.teacherTypeBack = v.teacherType
        v.teacherNoBack = v.teacherNo
        // 变更：如有通用课程标识，展示为通用课程
        v.courseType =
          v.isCommonCourse === 'Y'
            ? ESTABLISH_COURSE_MAP.commonCourse
            : v.courseType
        this.startTimeChange(v.startTime, v)
        this.endTimeChange(v.endTime, v)
        if (v.isLadder === '1') {
          ladderTeacherList.push(v)
        }
      })

      if (data.courseList) {
        let formatTeacherList = await this._inintOutTeacherList(
          ladderTeacherList
        )

        data.courseList = data.courseList.map((courseItem) => {
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

      this.timetableListData = data.courseList || []
      this.timetableListData.forEach((row) => {
        row.customId = random()
        this.checkClassTime(row)
      })
      this.lecturerList = data.lecturerList
      data?.tgTeacherList?.forEach((v) => {
        v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}`
        v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}`
        this.startTimeChange(v.startTime, v)
        this.endTimeChange(v.endTime, v)
      })
      this.teacherTableList = data.tgTeacherList || []
      this.costInfoList = data.expenseDetailList
      this.apportionConstTableList = data.divideList || []
      this.studentTableList = data.studentList || []
      this.accessoryTableList = data.fileList || []
      this.onlineTrainingCourseListRender = data.onlineTrainingCourseList || []
      this.lineList = this.handleLineTree(data.lineList)
      this.trainingCostListData.forEach((v) => {
        const item = (data.expenseDetailList || []).find(
          (n) => n.expenseType === v.expenseType
        )
        if (item) {
          merge(v, item)
        }
      })
      this.baseInfoForm.lineList = data.selectedLineList || []
      const text = this.baseInfoForm.lineList.map((v) => v.lineName).join('/')
      this.$set(this.baseInfoForm, 'busiType', text)
      this.$nextTick(() => {
        this.$refs.baseInfoFormRef.clearValidate()
      })
      if (this.isChangePage) {
        this.changePageStartTime = this.baseInfoForm.dateStart
      }
      if (auditUsersUm) {
        this.ApprovalChainValue = auditUsersUm
      }
    },
    // 本页数据转化为后台需要的数据
    reverseDataTransition() {
      const classInfoDTO = CopyObj(this.baseInfoForm)
      ;['planNum', 'aNum', 'bNum', 'cNum', 'dNum', 'eNum'].forEach((key) => {
        if ((classInfoDTO[key] + '').trim() === '') {
          classInfoDTO[key] = 0
        }
      })
      // 需求变更，计划人数不允许编辑，取所有类型的数值加总
      classInfoDTO.planNum = Number(classInfoDTO.aNum) + Number(classInfoDTO.bNum) + Number(classInfoDTO.cNum) + Number(classInfoDTO.dNum) + Number(classInfoDTO.eNum)
      ;[
        classInfoDTO.classTypeOne,
        classInfoDTO.classTypeTwo
      ] = classInfoDTO.classTypes
      ;[classInfoDTO.addressProvince, classInfoDTO.addressCity] =
        classInfoDTO.citys
      classInfoDTO.freeTimeOutside = this.isComputeHour ? 'Y' : 'N'
      const courseList = CopyObj(this.timetableListData)
      let ladderTeacherList = []
      courseList.forEach((v) => {
        if (v.startTime) {
          ;[v.startHour, v.startMin] = v.startTime.split(':')
        }
        if (v.endTime) {
          ;[v.endHour, v.endtMin] = v.endTime.split(':')
        }
        if (!v.courseId) {
          v.courseId = 'N'
        }

        // 变更：通用课程标识只做渲染用，转化到后端需要切回内部课程标识
        if (v.courseType === ESTABLISH_COURSE_MAP.commonCourse) {
          v.courseType = ESTABLISH_COURSE_MAP.bank
        }
      })
      const tgTeacherList = CopyObj(this.teacherTableList)
      tgTeacherList.forEach((v) => {
        if (v.startTime) {
          ;[v.startHour, v.startMin] = v.startTime.split(':')
        }
        if (v.endTime) {
          ;[v.endHour, v.endtMin] = v.endTime.split(':')
        }
      })
      const expenseDetailList = this.$refs.costInfoTable.getList()
      expenseDetailList.forEach((v) => {
        if (v.expense === '') {
          v.expense = 0
        }
      })
      const divideList = CopyObj(this.apportionConstTableList)
      const studentList = CopyObj(this.studentTableList)
      const lecturerList = CopyObj(this.lecturerList)
      const fileList = CopyObj(this.accessoryTableList)
      const onlineTrainingCourseList = CopyObj(this.onlineTrainingCourseList)
      const lineList = classInfoDTO.lineList
      Reflect.deleteProperty(classInfoDTO, 'lineList')
      if (this.isShowTrainingCost) {
        return {
          classInfoDTO,
          expenseDetailList: this.trainingCostListData,
          fileList,
          lineList,
          onlineTrainingCourseList
        }
      }
      return {
        classInfoDTO,
        courseList,
        tgTeacherList,
        expenseDetailList,
        divideList,
        studentList,
        lecturerList,
        fileList,
        lineList,
        onlineTrainingCourseList
      }
    },
    /*
     *   基本信息区域开始
     */
    // 处理项目分类 级联下拉选项
    handleProjectCategoryOptions(data) {
      const { classTypeOneList, classTypeTwoList } = data
      // 培训班
      const p = classTypeOneList.find(
        (v) => v.dataEncode === this.ESTABLISH_COURSE_MAP.interiorBank
      )
      // 非培训班
      const n = classTypeOneList.find(
        (v) => v.dataEncode === this.ESTABLISH_COURSE_MAP.sansLecturer
      )
      const pChildren = []
      const nChildren = []
      p.children = pChildren
      n.children = nChildren
      classTypeTwoList.forEach((v) => {
        if (v.prnDataEncode === this.ESTABLISH_COURSE_MAP.interiorBank) {
          pChildren.push(v)
        } else if (v.prnDataEncode === this.ESTABLISH_COURSE_MAP.sansLecturer) {
          nChildren.push(v)
        }
      })
      return classTypeOneList
    },
    // 根据项目分类编码获取项目分类名字
    getProjectCateName(id, arr) {
      for (let i = 0; i < arr.length; i++) {
        const v = arr[i]
        if (id === v.dataEncode) {
          return v.dataValue
        }
        if (!v.children) continue
        const name = this.getProjectCateName(id, v.children)
        if (name) {
          return name
        }
      }
    },
    // 处理拟定地点 级联下拉选项
    handleCityOptions(data) {
      const { addressList } = data
      const level1 = []
      const level2 = []
      addressList.forEach((v) => {
        if (v.addressLvl === 1) {
          level1.push(v)
        } else {
          level2.push(v)
        }
      })
      level2.forEach((v) => {
        const parent = level1.find((n) => v.prnAddressId === n.addressId)
        ;(parent.children || (parent.children = [])).push(v)
      })
      return level1
    },
    // 打开关联计划弹窗
    openCorrelation() {
      const { classTypes, dateStart, ifConformance } = this.baseInfoForm
      if(!classTypes?.length && !dateStart) {
        return this.$message.warning('请选择培训立项类型和项目起始日期')
      }
      if (!classTypes?.length) {
        return this.$message.warning('请选择培训立项类型！')
      }
      if (!dateStart) {
        return this.$message.warning('请选择项目起始日期')
      }
      if (!ifConformance) {
        return this.$message.warning('请选择是否消保培训类型')
      }
      // 需求变更：指定当前计划的条线为默认条线
      this.internalPlanForm.blgStripLine = this.internalPlanForm.blgStripLine || this.blgStripLine
      this.correlationVisible = true

      // projectName只有计划外有，直接赋值计划外
      this.$set(this.externalPlanForm, 'projectName', this.baseInfoForm.projectName)

      this.blgStripLineChange()
      // 需求变更，交由部门组件监听事件完成后触发查询(仅非零/金服)
      if(this.blgStripLine === LINE_LS) {
        this.searchPlan()
      } else {
        this.$refs.institutionRef?.createTreeData()
      }

      // 需求变更：非培训班不显示培训系列/关键岗位业务模块
      console.log(this.trainingCourse, '===>>>trainingCourse');
      if(!this.trainingCourse) {
        this.internalPlanList = this.internalPlanList.filter(row => {
          return !['channelTypeDesc', 'keyJobsDesc', 'trainSeriesDesc'].includes(row.prop)
        })
      }
    },
    // 条线 change 事件
    blgStripLineChange() {
      const type = this.baseInfoForm.classTypes[0]
      const form =
        this.activeName === 'internalPlan'
          ? this.internalPlanForm
          : this.externalPlanForm
      const line = form.blgStripLine || this.blgStripLineOptions[0].value
      this.getBaseInfoSelectOptions({ type, line })
    },
    // 项目分类change事件
    projectCategoryChange() {
      this.baseInfoForm.annualPlanId = ''
      this.baseInfoForm.annualPlanName = ''
      this.baseInfoForm.keyJobs = ''
      this.baseInfoForm.childSeries = ''
      this.baseInfoForm.trainSeries = ''
      this.baseInfoForm.planNum = ''

      // 判断是否为阶梯课程
      this.isLadderCourse = this.baseInfoForm.classTypes[1] === '02001'
      // 需求变更：切换分类清空课表，已发起过的培训班课表不允许删除
      this.timetableListData = this.timetableListData.filter(v => v.isEvaluate === 'Y')
      // 课表变更后外部培训师课酬也需重新计算
      const defaultLecturerList = this.lecturerList.filter(v => !v.teacherNo && !v.teacherId)
      this.lecturerList = this.lecturerList.filter(v => this.timetableListData.find(i => i.teacherNo === v.teacherNo))
      if (this.lecturerList.length === 0) {
        if (this.lecturerListBack) {
          this.lecturerList = [...this.lecturerListBack]
        } else {
          this.lecturerList = defaultLecturerList
        }
      }
    },
    // 查询 关联计划 下拉内容
    getBaseInfoSelectOptions(data) {
      this.$axios
      .post('/fn/plan/annual/listPlanDict', data, jsonHeaders)
      .then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.selectOptions = data
          // 若annualPlanId值为‘N’，则表示“计划外”，且需要回显表单数据
          if (this.baseInfoForm?.annualPlanId === 'N') {
            this.handleExternalPlanData()
          }
        }
      })
    },
    // 回显关联计划数据（计划内 / 计划外）
    handleExternalPlanData() {
      // 需求变理：非零/金服条线下，关键岗位不需要和其他字段耦合
      if(this.blgStripLine !== LINE_LS) {
        this.$set(this.externalPlanForm, 'keyJobs', this.baseInfoForm.keyJobs)
      }

      ['channelType','trainSeries'].forEach(key => {
        if (this.baseInfoForm[key] !== undefined) {
          this.$set(this.externalPlanForm, key, this.baseInfoForm[key])
          // this.externalPlanForm[key] = this.baseInfoForm[key]
          const selectKey = key === 'channelType' ? 'channelTypes' : key
          const parentItem = this.selectOptions[selectKey].find(m => m.dataEncode === this.baseInfoForm[key])
          if (parentItem?.childPlanDict) {
            if (key === 'channelType' && this.baseInfoForm.keyJobs) {
              this.$set(this.externalPlanForm, 'keyJobs', this.baseInfoForm['keyJobs'])
              // this.externalPlanForm.keyJobs = this.baseInfoForm.keyJobs
              this.keyPositionOptions = parentItem.childPlanDict
            }
            if (key === 'trainSeries' && this.baseInfoForm.childSeries) {
              this.$set(this.externalPlanForm, 'childSeries', this.baseInfoForm['childSeries'])
              // this.externalPlanForm.childSeries = this.baseInfoForm.childSeries
              this.trainSeriesChildOptions = parentItem.childPlanDict
            }
          }
        }
      })
    },
    // 业务模块 change 事件
    channelTypeChange() {
      const form =
        this.activeName === 'internalPlan'
          ? this.internalPlanForm
          : this.externalPlanForm
      this.$set(form, 'keyJobs', '')
      const data = this.selectOptions.channelTypes?.find(
        (v) => v.dataEncode === form.channelType
      )
      const options =
        this.activeName === 'internalPlan'
          ? 'internalKeyPositionOptions'
          : 'keyPositionOptions'
      this[options] = data ? data.childPlanDict : []
    },
    // 培训系列 change 事件
    trainSeriesChange() {
      const form =
        this.activeName === 'internalPlan'
          ? this.internalPlanForm
          : this.externalPlanForm
      this.$set(form, 'childSeries', '')
      const data = this.selectOptions?.trainSeries?.find(
        (v) => v.dataEncode === form.trainSeries
      )
      const options =
        this.activeName === 'internalPlan'
          ? 'internalTrainSeriesChildOptions'
          : 'trainSeriesChildOptions'
      this[options] = data ? data.childPlanDict : []
    },
    // 非零 子系列变化带出关键岗位
    FLChildSeriesChange() {
      if (this.ladderTraining) {
        const item = this.trainSeriesChildOptions.find(
          (v) => v.dataEncode === this.externalPlanForm.childSeries
        )
        if (!item.childPlanDict) return
        this.keyPositionOptions = item.childPlanDict
        this.$set(
          this.externalPlanForm,
          'keyJobs',
          item?.childPlanDict[0]?.dataEncode || ''
        )
      }
    },
    // 关联计划 dialog close 事件
    correlationClose() {
      this.externalPlanForm = {}
      this.internalPlanForm = this.$options.data.call(this)?.internalPlanForm
      this.internalPlanTableList = []
      this.activeName = 'internalPlan'
      this.correlationVisible = false
      this.$nextTick(() => {
        this.$refs.externalPlanFormRef &&
          this.$refs.externalPlanFormRef.clearValidate()
      })
    },
    // 关联计划 dialog 确认事件
    correlationComfirm() {
      // 关联计划后把课表置空，并且已发起过的培训班课表不允许删除
      this.timetableListData = this.timetableListData.filter(v => v.isEvaluate === 'Y')
      // 课表变更后外部培训师课酬也需重新计算
      const defaultLecturerList = this.lecturerList.filter(v => !v.teacherNo && !v.teacherId)
      this.lecturerList = this.lecturerList.filter(v => this.timetableListData.find(i => i.teacherNo === v.teacherNo))
      if (this.lecturerList.length === 0) {
        if (this.lecturerListBack) {
          this.lecturerList = [...this.lecturerListBack]
        } else {
          this.lecturerList = defaultLecturerList
        }
      }
      // 计划外
      if (this.activeName === 'externalPlan') {
        this.$refs.externalPlanFormRef.validate((valied) => {
          if (valied) {
            this.baseInfoForm.annualPlanId = 'N'
            this.baseInfoForm.annualPlanName = '计划外项目'
            const { keyJobs, childSeries, trainSeries } = this.externalPlanForm
            this.baseInfoForm.keyJobs = keyJobs
            this.baseInfoForm.childSeries = childSeries
            this.baseInfoForm.trainSeries = trainSeries

            const { planName, busiType, channelType, projectName } = this.externalPlanForm
            this.baseInfoForm.planName = planName
            this.baseInfoForm.projectName = projectName
            // this.baseInfoForm.busiType = busiType
            this.baseInfoForm.channelType = channelType

            this.correlationVisible = false
          } else {
            this.$message.warning('请填写必要信息')
          }
        })
      } else {
        // 计划内
        const selection =
          this.$refs.internalPlanTableRef.$children[0].selection[0]
        if (!selection) {
          // return (this.correlationVisible = false)
          return this.$message.warning('请选择一个关联计划')
        }
        this.baseInfoForm.annualPlanId = selection.annualPlanId
        this.baseInfoForm.annualPlanName = selection.annualPlanName
        const { channelType, keyJobs, childSeries, trainSeries, planStudentNum } = selection
        this.baseInfoForm.channelType = channelType
        this.baseInfoForm.keyJobs = keyJobs
        this.baseInfoForm.childSeries = childSeries
        this.baseInfoForm.trainSeries = trainSeries
        // this.baseInfoForm.planNum = parseInt(planStudentNum) || 0
        this.baseInfoForm.planNum = this.baseInfoForm.planNum || 0
        this.correlationVisible = false

        // 新增需求：如果是阶梯模式（只有计划内），进行数据请求并带出课表。只零售适用
        this.isLadderCourse && this.blgStripLine === LINE_LS && this._getLadderCourseDatas(selection)
      }
    },
    // 查询可关联计划
    searchPlan() {
      this.internalPlanForm.currPage = 1
      this.internalPlanForm.pageSize = 5
      this.getPlanList()
    },
    // 重置关联计划
    resetPlan() {
      resetObj(this.internalPlanForm)
      this.internalPlanForm.currPage = 1
      this.internalPlanForm.pageSize = 5
      this.internalPlanForm.total = 0
      this.internalPlanTableList = []
      this.internalPlanForm.trainSeries = []
      this.internalPlanForm.isGotSubBranch = 'Y'
      this.$refs?.institutionRef?.createTreeData()
    },
    // 获取关联计划数据
    getPlanList() {
      const data = CopyObj(this.internalPlanForm)
      data.planClassType = this.trainingCourse ? 1 : 0
      data.blgDept = this.baseInfoForm.blgOrg
      data.trainType = this.baseInfoForm.classTypes[1]
      data.blgStripLine = data.orgs[0] || data.blgStripLine || this.blgStripLine
      data.dateStart = this.baseInfoForm.dateStart
      data.planDept = this.internalPlanForm.orgs?.[1]
      data.page = data.currPage
      data.size = data.pageSize

      data.ifConformance = this.baseInfoForm.ifConformance

      Reflect.deleteProperty(data, 'orgs')

      console.log(data, '===>>> data');
      // 需求变更，针对合并后的培训系列级联数据结构做个拆分
      if(Array.isArray(data.trainSeries)) {
        [data.trainSeries, data.childSeries] = data.trainSeries
        console.log(data.trainSeries, data.childSeries);
      }
      fetchListClassAssociatePlan({data}).then(({list, total}) => {
        this.internalPlanForm.total = total
        this.internalPlanTableList = list
      })
    },
    // 打开选择条线 dialog
    openSelectLine() {
      this.selectLineVisible = true
      const nodes = this.$refs.lineTree?.getCheckedNodes()
      if (!nodes || !nodes.length) {
        const keys = this.baseInfoForm.lineList.map((v) => v.lineCode)
        if (keys.length) {
          this.$nextTick(() => {
            this.lineKeys = keys
            this.$refs.lineTree.setCheckedKeys(keys)
          })
        }
      }
    },
    // 选择条线确认事件
    selectLineConfirm() {
      this.selectLineVisible = false
      const nodes = this.$refs.lineTree.getCheckedNodes()
      this.baseInfoForm.lineList = nodes.map((v) => {
        const { lineCode, lineName, prnLineCode } = v
        return { lineCode, lineName, prnLineCode }
      })
      const text = this.baseInfoForm.lineList.map((v) => v.lineName).join('/')
      this.$set(this.baseInfoForm, 'busiType', text)
    },
    // 开始时间 change 事件
    dateStartChange() {
      if (this.isChangePage && this.changeState !== 2) {
        this.isChange = false
        if (this.changeState !== 1) {
          this.changeState = 1
        }
        const days = numerationTimeFateDifference(
          this.baseInfoForm.dateStart,
          this.changePageStartTime
        )
        this.baseInfoForm.dateEnd = numerationAfterwardsDays(
          this.baseInfoForm.dateEnd,
          days
        )
        this.timetableListData.forEach((v) => {
          v.courseDate = numerationAfterwardsDays(v.courseDate, days)
        })
        this.teacherTableList.forEach((v) => {
          v.tgDate1 = numerationAfterwardsDays(v.tgDate1, days)
          v.tgDate2 = numerationAfterwardsDays(v.tgDate2, days)
        })
        this.changePageStartTime = this.baseInfoForm.dateStart
        setTimeout(() => {
          this.isChange = true
        }, 0)
      }
    },
    // 结束时间 change 事件
    dateEndChange() {
      if (this.isChangePage && this.changeState !== 2) {
        this.isChange = false
        if (this.changeState !== 1) {
          this.changeState = 1
        }
        setTimeout(() => {
          this.isChange = true
        }, 0)
      }
    },
    // 选中城市发生变化事件
    cityChange(a, b) {
      this.$nextTick(() => {
        // console.log(this.baseInfoForm.citys, this.cityOptions, a, b, this.costInfoList, '==>>');
        /*
         * expenseType: '000101',
         * expenseTypeDesc: '餐杂费',
         * expenseType: '000501',
         * expenseTypeDesc: '场租及会务费',
         * expenseType: '000201',
         * expenseTypeDesc: '外部培训费',
         * expenseType: '000202',
         * expenseTypeDesc: '外部培训费',
         * expenseType: '000203',
         * expenseTypeDesc: '外部培训费',
         * expenseType: '000204',
         * expenseTypeDesc: '外部培训费',
         * expenseType: '000205',
         * expenseTypeDesc: '外部培训费',
         * expenseType: '000206',
         * expenseTypeDesc: '外部培训费',
         * expenseType: '000401',
         * expenseTypeDesc: '差旅',
         * expenseType: '000404',
         * expenseTypeDesc: '差旅',
         * expenseType: '000403',
         * expenseTypeDesc: '差旅',
         * expenseType: '000402',
         * expenseTypeDesc: '差旅',
         * expenseType: '000405',
         * expenseTypeDesc: '差旅',
         * expenseType: '001001',
         * expenseTypeDesc: '其他费用', 
        */
        // 如果是属于一线城市的话，餐杂费需要关联变化
        const copyCostInfo = CopyObj(this.costInfoList)
        if(this.cityIs) {
          copyCostInfo.forEach(row => {
            if(row.expenseType === '000101') {
              row.unitExpense = 250
            }
            if(row.expenseType === '000501') {
              row.unitExpense = 220
            }
          })
        } else {
          copyCostInfo.forEach(row => {
            if(row.expenseType === '000101') {
              row.unitExpense = 200
            }
            if(row.expenseType === '000501') {
              row.unitExpense = 180
            }
          })
        }
        this.costInfoList = copyCostInfo
        this.$refs.costInfoTable.setCost(this.cityIs)
      })
    },
    // 课表批量上传 模版上传事件
    timetableUpload($event) {
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
    timetableUploadComfirm() {
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
          } else {
            v.teacherNo = v.teacherUm
          }
        }
        v.teacherTypeBack = v.teacherType
        v.teacherNoBack = v.teacherNo
        v.customId = random()
        v.teacherNo = v.teacherNo || v.teacherId
        this.timetableListData.push(v)
        this.teacherChange(v)
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
    /**
     *  基本信息区域结束
     */

    /*
     *   课程表区域开始
     */
    // 是否计算闲时课时
    isComputeHourClick($event) {
      if (this.isComputeHour) {
        $event.preventDefault()
        this.$alert(
          `如果将勾选去掉，系统将自动认为您课程的全部时间均为授课时间，同时计算课酬。此操作存在合规风险，请谨慎操作，总分行也将对此类情况进行重点稽核。系统会计算全部时间。`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
            cancelButtonClass: 'cancel-button',
            customClass: `loginTimeout autoHeight`
          }
        )
          .then((valied) => {
            if (valied === 'confirm') {
              this.isComputeHour = false
            }
          })
          .catch((err) => err)
      }
    },
    // 课程表 添加一项
    addTimetableItem() {
      this.timetableListData.push({
        startTimer: '00:00:00 - 23:59:00',
        endTimer: '00:00:00 - 23:59:00',
        customId: random()
      })
    },
    // 批量导入课表
    batchImport() {
      this.timetableBatchAddVisible = true
    },
    // 删除课表一项
    delTimetableItem(index,row) {
      if (row.isEvaluate==='Y') return
      const item = this.timetableListData.splice(index, 1)
      this.removeLecturerList(item[0]?.teacherNo)
    },
    // 时间 change事件
    needHintChange(row) {
      row.notNeedHint = false
      this.checkClassTime(row)
    },
    // 打开搜索课程名dialog
    selectCourseType(row) {
      if (row.isEvaluate==='Y') return
      this.selectExternalCourseVisible = true
      this.selectExternalCourseForm.row = row
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
      this.teacherChange(row)
      this._relateExternalCourseToTeacher(row)
    },
    // 讲师类型变化事件
    teacherTypeChange(row) {
      this.teacherChange(row)
      this.$set(row, 'teacherName', '')
      row.teacherNo = ''
      if (row.teacherType === '01003') {
        row.conflict = []
      } else {
        this.checkClassTime(row)
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
      this.checkClassTime(row)
    },

    // 外部讲师 dialog 获取数据
    getSelectExternalLecturer() {
      const data = CopyObj(this.selectExternalLecturerForm)
      data.blgStripLine =
        this.baseInfoForm.blgStripLine ||
        this.$store.state.userInfo.blgStripLine
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
      this.teacherChange(row)
      this.checkClassTime(row)
    },

    // 获取选择外部课程数据
    getSelectExternalCourse() {
      const data = CopyObj(this.selectExternalCourseForm)
      data.blgStripLine =
        this.baseInfoForm.blgStripLine ||
        this.$store.state.userInfo.blgStripLine
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
      const item = this.$refs.selectExternalCourseTableRef.$children[0].selection[0]
      if (!item) {
        return
      }
      const { courseId, courseName, teacherName, teacherId, teacherType } = item
      const { row } = this.selectExternalCourseForm

      // 需求变更，需要把外部讲师的list给去掉
      this.$set(row, 'courseTeachInfo', null)
      this.$set(row, 'courseName', courseName)
      row.courseId = courseId
      this.$set(row, 'teacherType', teacherType)
      this.$set(row, 'teacherName', teacherName)
      row.teacherNo = teacherId
      this.teacherChange(row)
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
      // data.blgStripLine =
      //   this.baseInfoForm.blgStripLine ||
      //   this.$store.state.userInfo.blgStripLine
      // 需求变更：不做条线限制
      data.blgStripLine = ''
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

    // 添加一个外部酬薪
    addLecturerList(teacherNo, row) {
      let index = 0
      this.timetableListData.forEach((v) => {
        if ((v.teacherNo || v.teacherId) === teacherNo) {
          index++
        }
      })
      if (
        this.lecturerList.length === 1 &&
        this.lecturerList[0].lecturerName === '外部讲师'
      ) {
        !this.lecturerListBack && (this.lecturerListBack = this.lecturerList)
        this.lecturerList = []
      }
      if (index === 1) {
        const { teacherName } = row
        this.lecturerList.push({
          teacherName,
          teacherNo,
          lecturerName: teacherName,
          teacherId: teacherNo
        })
      }
    },
    // 删除一个外部酬薪
    removeLecturerList(teacherNoBack) {
      const flag = this.timetableListData.find(
        (v) => v.teacherNo === teacherNoBack
      )
      if (!flag) {
        const index = this.lecturerList.findIndex(
          (v) => v.teacherId === teacherNoBack
        )
        if (index > -1) {
          this.lecturerList.splice(index, 1)
          if (this.lecturerList.length === 0) {
            this.lecturerList = [...this.lecturerListBack]
          }
        }
      }
    },
    // 讲师变化事件
    teacherChange(row) {
      // 需求变更，需要把外部讲师的list给去掉
      this.$set(row, 'courseTeachInfo', null)

      const { teacherTypeBack, teacherNoBack, teacherType, teacherNo } = row
      if (
        teacherTypeBack === this.ESTABLISH_COURSE_MAP.sansLecturer &&
        teacherType === this.ESTABLISH_COURSE_MAP.sansLecturer
      ) {
        if (!teacherNoBack && teacherNo) {
          this.addLecturerList(teacherNo, row)
        } else if (teacherNoBack !== teacherNo) {
          this.removeLecturerList(teacherNoBack)
          this.addLecturerList(teacherNo, row)
        }
      } else if (
        teacherTypeBack === this.ESTABLISH_COURSE_MAP.sansLecturer &&
        teacherType !== teacherTypeBack
      ) {
        if (teacherNoBack) {
          this.removeLecturerList(teacherNoBack)
        }
      } else if (
        !teacherTypeBack &&
        teacherType === this.ESTABLISH_COURSE_MAP.sansLecturer
      ) {
        if (teacherNo) {
          this.addLecturerList(teacherNo, row)
        }
      }
      row.teacherTypeBack = row.teacherType
      row.teacherNoBack = row.teacherNo
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
    // 跳转到新增内部课程
    jumpToAddInternalCurriculum() {
      addAllowKeepAlive('/InternalCurriculumManagement')
      this.$router.push({
        name: '内部课程管理',
        params: { state: 'establish' }
      })
    },
    // 跳转到新增外部课程
    jumpToAddExternalCurriculum() {
      addAllowKeepAlive('/ExternalCurriculumManagement')
      this.$router.push({
        name: '外部课程管理',
        params: { state: 'establish' }
      })
    },
    /*
     *   课程表区域结束
     */

    /*
     *   通关评审及带班老师信息区域开始
     */
    addTeacherTableItem() {
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
    // 通关评审一行内容是否需要验证
    isNecessary(type) {
      return ['02002', '02003'].includes(type)
    },
    /*
     *   通关评审及带班老师信息区域结束
     */
    /*
     *   费用分摊明细区域开始
     */
    // 添加一项分摊信息
    addApportionUnit(nodeList) {
      nodeList.forEach((data) => {
        const {
          blgOrg: divideOrgId,
          blgStripLine: divideStripLine,
          blgOrgName: divideOrgName
        } = data
        const index = this.apportionConstTableList.findIndex(
          (n) =>
            n.divideOrgId === divideOrgId &&
            divideStripLine === n.divideStripLine
        )
        if (index === -1) {
          this.apportionConstTableList.push({
            divideOrgId,
            divideStripLine,
            divideOrgName
          })
        }
      })
    },
    // 处理分摊单位机构信息
    handleNodeList(items, node) {
      if (node.data.ifFixNode === 'Y') {
        items?.forEach((v) => {
          v.disabled = v.ifFixNode !== 'Y'
        })
      }
    },
    // 获取分摊费用信息
    getApportionConst() {},
    // 删除一个分摊信息
    delApportionConstItem(index) {
      const { currPage, pageSize } = this.apportionConstForm
      index = (currPage - 1) * pageSize + index
      this.apportionConstTableList.splice(index, 1)
    },
    // 验证分摊费用
    checkPrice($event, row, key) {
      let value = $event.target.value
      if (value === '') return
      value = parseFloat(value)
      if (isNaN(value)) {
        row[key] = ''
        $event.target.focus()
        return this.$message.warning(`分摊费用必须是数字`)
      }
      if (value >= 0) {
        row[key] = myRound(row[key], 2)
      } else {
        this.$message.warning(`分摊费用不能是负数`)
        row[key] = ''
        $event.target.focus()
      }
    },
    // 清空分摊费用
    delAllApportionConst() {
      this.$alert('确定清空列表？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      })
        .then((valied) => {
          if (valied === 'confirm') {
            this.apportionConstTableList = []
            this.apportionConstForm.total = 0
            this.apportionConstForm.currPage = 1
            this.apportionConstForm.pageSize = 5
          }
        })
        .catch((err) => err)
    },
    // 分摊费用批量上传事件
    costBatchUploadChange({successList}) {
      this.apportionConstTableList = this.apportionConstTableList.concat(CopyObj(successList))
      // const file = $event.target.files[0]
      // if (!file) return
      // const data = new FormData()
      // data.append('file', file)
      // this.$axios
      //   .post('/common/lixiang/shareFee', data, dataHeaders)
      //   .then((res) => {
      //     const { code, data } = res.data
      //     if (parseInt(code) === 0) {
      //       data.forEach((n) => {
      //         const index = this.apportionConstTableList.findIndex(
      //           (v) => v.divideOrgId === n.divideOrgId && v.divideStripLine === n.divideStripLine
      //         )
      //         if (index === -1) {
      //           this.apportionConstTableList.push(n)
      //         }
      //       })
      //     }
      //   })
    },
    /*
     *   费用分摊明细区域结束
     */
    /*
     *   参训学员区域开始
     */
    // 打开添加学员dialog
    openAddStudent() {
      this.addStudentVisible = true
    },
    // 查询学员
    searchStudent() {
      if (!this.addStudentForm.umId) {
        this.addStudentTableList = []
      } else {
        this.getStudent()
      }
    },
    // 重置学员
    resetStudent() {
      this.addStudentForm.umId = ''
      this.addStudentTableList = []
    },
    // 获取学员数据
    getStudent() {
      const data = CopyObj(this.addStudentForm)
      this.$axios
        .post('/fn/user/listEmployeeInfo', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            if (data && !data.length) this.$message.warning('未找到学员信息')
            this.addStudentTableList = data
          }
        })
    },
    // 添加学员
    handleAddStudent() {
      const selection = this.$refs.addStudentTableRef.$children[0].selection
      if (selection.length < 1) {
        return
      }
      const ids = this.selectedStudentTableList.map((v) => v.umId)
      selection.forEach((v) => {
        if (!ids.includes(v.umId)) {
          this.selectedStudentTableList.push(v)
        }
      })
      this.$refs.addStudentTableRef.$children[0].clearSelection()
    },
    // 移除学员
    removeStudent() {
      const selection =
        this.$refs.selectedStudentTableRef.$children[0].selection
      if (selection.length < 1) {
        return
      }
      this.selectedStudentTableList = this.selectedStudentTableList.filter(
        (v) => !selection.includes(v)
      )
    },
    // 添加学员dialog 关闭事件
    addStudentClose() {
      this.addStudentVisible = false
      this.resetStudent()
      this.selectedStudentTableList = []
    },
    // 添加学员dialog 确认事件
    addStudentComfirm() {
      const ids = this.studentTableList.map((v) => v.umId)
      this.selectedStudentTableList.forEach((v) => {
        if (!ids.includes(v.umId)) {
          const { blgStripLine, blgOrgName, postDesc } = v
          v.busiType = filterBusiType(blgStripLine)
          v.orgName = blgOrgName
          v.pnbrDesc = postDesc
          this.studentTableList.push(v)
        }
      })
      this.addStudentVisible = false
    },
    // 学员清空事件
    delAllStudent() {
      this.$alert('确定清空列表？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      })
        .then((valied) => {
          if (valied === 'confirm') {
            this.studentTableList = []
            this.studentForm.total = 0
            this.studentForm.currPage = 1
            this.studentForm.pageSize = 5
          }
        })
        .catch((err) => err)
    },
    // 学员删除事件
    delOneStudent(index) {
      const { currPage, pageSize } = this.studentForm
      index = (currPage - 1) * pageSize + index
      this.studentTableList.splice(index, 1)
    },
    // // 参训学员批量上传事件
    // studentBatchUploadChange($event) {
    //   const file = $event.target.files[0]
    //   if (!file) return
    //   const data = new FormData()
    //   data.append('file', file)
    //   this.$axios
    //     .post('/common/lixiang/batchClassUm', data, dataHeaders)
    //     .then((res) => {
    //       const { code, data } = res.data
    //       if (parseInt(code) === 0) {
    //         data.forEach((v) => {
    //           const index = this.studentTableList.findIndex(
    //             (n) => n.umId === v.umId
    //           )
    //           if (index === -1) {
    //             this.studentTableList.push(v)
    //           }
    //         })
    //       }
    //     })
    // },
    // // 批量导入Change事件
    // async studentImportChange ($event) {
    //   this.batchChannelStudentFile = $event.target.files[0]
    //   $event.target.value = ''
    //   this.$nextTick(() => {
    //     if (!this.batchChannelStudentFile.name) {
    //       this.setImportStudentData()
    //     }
    //   })
    // },
    // // 批量导入积分提交
    // async studentImportComfirm () {
    //   if (!this.batchChannelStudentFile.name) {
    //     return this.$message.warning('请选择文件后再提交')
    //   }
    //   if (this.batchChannelStudentFile) {
    //     const data = new FormData()
    //     data.append('file', this.batchChannelStudentFile)
    //     // data.append('classId', this.commcClassId || '2114784')
    //     this.$axios.post('/common/lixiang/batchClassUm', data, dataHeaders).then((res) => {
    //       const { code, data } = res.data
    //       console.log('code, data.....', code, data)
    //       if (parseInt(code) === 0) {
    //         data.forEach((v) => {
    //           const index = this.studentTableList.findIndex(
    //             (n) => n.umId === v.umId
    //           )
    //           if (index === -1) {
    //             this.studentTableList.push(v)
    //           }
    //         })
    //         // 
    //         this.$message.success('批量导入成功')
    //         this.importStudentVisible = false
    //       }
    //     })
    //     // fetchBatchClassStudent(data).then((resData) => {
    //     //   this.setImportStudentData(resData)
    //     //   this.handleSearchStudent()
    //     //   if (resData.fail?.length) {
    //     //     // manyLineHint(resData.fail)
    //     //   } else {
    //     //     this.importStudentVisible = false
    //     //     this.$message.success('批量导入成功')
    //     //   }
    //     // })
    //   }
    // },
    // // 批量导入 关闭事件
    // studentImportClose () {
    //   this.importStudentVisible = false
    //   this.batchChannelStudentFile = {}
    //   this.setImportStudentData()
    // },
    // setImportStudentData (data) {
    //   if (data && data.success && data.fail) {
    //     this.importStudentData.isUpload = data.success.length || data.fail.length
    //     this.importStudentData.successLength = data.success.length
    //     this.importStudentData.failLength = data.fail.length
    //     this.importStudentData.success = data.success
    //     this.importStudentData.fail = data.fail
    //   } else {
    //     this.importStudentData = {
    //       isUpload: false,
    //       fail: [],
    //       success: [],
    //       failLength: 0,
    //       successLength: 0
    //     }
    //   }
    // },
    async batchChannelPointComfirm () {
      if (!this.batchChannelPointFile.name) {
        return this.$message.warning('请选择文件后再提交')
      }
      this.failStrList.list.forEach((v) => {
        const index = this.studentTableList.findIndex(
          (n) => n.umId === v.umId
        )
        if (index === -1) {
          this.studentTableList.push(v)
        }
      })
      this.$message.success('批量上传参训学员成功')
      setTimeout(() => {
        this.batchChannelPointVisible = false
      }, 100)
      // if (this.batchChannelPointFile) {
      //   const data = new FormData()
      //   data.append('file', this.batchChannelPointFile)
      //   data.append('classId', this.commcClassId)
      //   // const dataList = await fetchUpLoadIntergrationTeamplate(data)
      //   const dataList = await this.$axios.post('/common/lixiang/batchClassUm', data, dataHeaders)
      //   this.failStrList = dataList
      //   if (+this.failStrList.errorTips === 0) {
      //     // data.forEach((v) => {
      //     //   const index = this.studentTableList.findIndex(
      //     //     (n) => n.umId === v.umId
      //     //   )
      //     //   if (index === -1) {
      //     //     this.studentTableList.push(v)
      //     //   }
      //     // })
      //     this.$message.success('批量上传参训学员成功')
      //     this.getList()
      //     this.batchChannelPointVisible = false
      //   }
      // }
    },
    batchChannelPointClose () {
      this.batchChannelPointVisible = false
      this.batchChannelPointFile = {}
      this.failStrList = {}
    },
    async batchChannelPointChange ($event) {
      this.batchChannelPointFile = $event.target.files[0]
      $event.target.value = ''
      // .....
      const data = new FormData()
      data.append('file', this.batchChannelPointFile)
      data.append('classId', this.commcClassId)
      const dataList = await this.$axios.post('/common/lixiang/batchClassUm', data, dataHeaders)
      if (String(dataList.data?.code) === '0') {
        this.failStrList = dataList.data?.data || {}
      }
    },
    /*
     *   参训学员区域结束
     */

    /*
     *   附件信息区域开始
     */
    accessoryChange($event) {
      const files = $event.target.files[0]
      if (!files) {
        return
      }
      uploadFile({ files, reimClass: 'class', busiId: '' }).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          if (data.length) {
            this.accessoryTableList.push(data[0])
          }
        }
      })
    },
    // 删除选中的附件
    delAccessory() {
      const selection = this.$refs.accessoryTableRef.$children[0].selection
      if (selection.length < 1) {
        return
      }
      this.accessoryTableList = this.accessoryTableList.filter(
        (v) => !selection.includes(v)
      )
    },
    // 删除一个附件
    delOneAccessory(index) {
      this.accessoryTableList.splice(index, 1)
    },
    /*
     *   附件信息区域结束
     */

    // 费用信息 变动事件
    listChange() {
      if (this.isChangePage && this.isChange && this.changeState !== 2) {
        this.changeState = 2
      }
    },
    // 费用是否超标
    isBeyond(row) {
      if (row.expenseType === '000101') {
        // 一线城市
        if(this.cityIs) {
          if (row.unitExpense > 250 && row.unitNum > 0 && row.dayNum > 0) {
            this.dinnerFeeDesc = true
          } else {
            this.dinnerFeeDesc = false
            this.baseInfoForm.dinnerFeeDesc = ''
          }
        } else {
          if (row.unitExpense > 200 && row.unitNum > 0 && row.dayNum > 0) {
            this.dinnerFeeDesc = true
          } else {
            this.dinnerFeeDesc = false
            this.baseInfoForm.dinnerFeeDesc = ''
          }
        }
      } else if (row.expenseType === '000501') {
        if (this.cityIs) {
          if (row.unitExpense > 220 && row.unitNum > 0 && row.dayNum > 0) {
            this.placeFeeDesc = true
          } else {
            this.placeFeeDesc = false
            this.baseInfoForm.placeFeeDesc = ''
          }
        } else {
          if (row.unitExpense > 180 && row.unitNum > 0 && row.dayNum > 0) {
            this.placeFeeDesc = true
          } else {
            this.placeFeeDesc = false
            this.baseInfoForm.placeFeeDesc = ''
          }
        }
      }
    },
    // 返回 页面
    back() {
      this.$alert('直接返回将清除已填写的信息，是否确定返回？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      })
        .then((valied) => {
          if (valied === 'confirm') {
            this.handleBack()
          }
        })
        .catch((err) => err)
    },
    // 返回到立项页面
    handleBack() {
      const items = $(
        `.component-head__left__tags__item__content:contains(${
          this.pageStateMaping[this.pageState]
        })`
      )
      const item = Array.from(items).find(
        (v) => $(v).text().trim() === this.pageStateMaping[this.pageState]
      )
      if (item) {
        $(item).next().click()
      } else {
        addAllowKeepAlive('/EstablishProject')
        this.$router.push({
          name: '培训项目立项'
        })
      }
    },
    // 初始化获取条线
    initLine() {
      getBlgStripLineOptions('classModule').then((res) => {
        this.blgStripLineOptions = res
      })
    },
    // 验证 职级分类总人数 和 计划总人数
    verifyPerson(data) {
      const { planNum, aNum, bNum, cNum, dNum, eNum } = data.classInfoDTO
      const totalNum = aNum + bNum + cNum + dNum + eNum
      if (planNum === totalNum) {
        return true
      } else {
        this.$message.warning('职级分类总人数需等于计划总人数')
      }
    },
    // 验证课表数据
    verifyTimetable(data) {
      const courseList = data.courseList
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
        } else if (v.courseDate < this.baseInfoForm.dateStart) {
          this.$message.warning(`课程表第${i}行日期不能小于拟定开始日期`)
          return true
        } else if (v.courseDate > this.baseInfoForm.dateEnd) {
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

      if (flag) {
        return false
      }

      // 验证是否计算闲时课时
      // 获取所有所有需要提示的
      // 培训班才需要提示
      if (this.trainingCourse) {
        const needHint = {}
        courseList.forEach((v, i) => {
          if (!this.isComputeHour) {
            if (
              !(
                v.endTime <= '12:00' ||
                v.startTime >= '19:00' ||
                (v.startTime >= '14:00' && v.endTime <= '18:00')
              ) &&
              !v.notNeedHint &&
              v.teacherType !== ESTABLISH_COURSE_MAP.notLecturer
            ) {
              needHint[i + 1] = v
            }
          }
        })
        const keys = Object.keys(needHint)
        if (keys.length) {
          this.$alert(
            `课程表第${keys.join(
              '、'
            )}行课程授课时间在12:00-14:00或18:00-19:00 时段将计算课酬，请再次确认是否正确。总行后续将对此项作为HR-C合规检查点`,
            '提示',
            {
              confirmButtonText: '确定',
              customClass: `loginTimeout autoHeight`
            }
          )
            .catch((err) => err)
            .finally(() => {
              keys.forEach((v) => {
                this.timetableListData[v - 1].notNeedHint = true
              })
            })
          return false
        }
      }

      // 没找到 不符合条件的
      if (!flag) {
        return true
      }
    },
    // 验证 通关评审及带班老师信息
    verifyTeacherInfo(data) {
      if (!data.tgTeacherList.length) {
        this.$message.warning('通关评审及带班老师信息是必填项')
        return false
      }

      const teacherFlag = data.tgTeacherList.some((v, i) => {
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
        } else if (v.tgDate1 < this.baseInfoForm.dateStart) {
          this.$message.warning(
            `通关评审及带班老师信息第${i}行开始日期不能小于拟定开始日期`
          )
          return true
        } else if (v.tgDate1 > this.baseInfoForm.dateEnd) {
          this.$message.warning(
            `通关评审及带班老师信息第${i}行开始日期不能大于拟定结束日期`
          )
          return true
        }
        if (!this.isNecessary(v.teacherType)) {
          if (!v.tgDate2) {
            this.$message.warning(`通关评审及带班老师信息第${i}行结束日期必填`)
            return true
          } else if (v.tgDate2 > this.baseInfoForm.dateEnd) {
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
        const needVeriftTimeList = data.tgTeacherList
          .slice(0, i - 1)
          .filter(
            (n) =>
              n.teacherNo === v.teacherNo && n.teacherType === v.teacherType
          )
        if (!needVeriftTimeList) {
          return false
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
            if (!(v.startTime > n.endTime || v.endTime < n.startTime)) {
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
    // 验证 费用分摊费用不能大于差旅总费用
    verifyCostInfo(data) {
      if (
        this.countDivideBudget('餐杂费', 'divideBudgetCanZa') &&
        this.countDivideBudget('场租及会务费', 'divideBudgetChangZu') &&
        this.countDivideBudget('外部培训费', 'divideBudgetWbpxf') &&
        this.countDivideBudget('差旅', 'divideBudgetChaiLv')
      ) {
        return true
      } else {
        return false
      }
    },
    // 校验分摊费用有效性
    verifyApportionConstData() {
      for (const key in this.apportionConstTableList) {
        const divideBudgetOther = this.apportionConstTableList?.[key]?.divideBudgetOther || 0
        if(isNaN(divideBudgetOther)) {
          this.$message.warning(`第${Number(key)+1}行其他费用分摊请输入数字`)
          return false
        }
        if(divideBudgetOther < 0) {
          this.$message.warning(`第${Number(key)+1}行其他费用分摊请输入大于0的数字`)
          return false
        }
      }
      return true
    },
    countDivideBudget(expenseTypeDesc,divideBudget){
      const costInfoList = this.$refs.costInfoTable.getList()
      const travelList = costInfoList.filter(
        (v) => v.expenseTypeDesc === expenseTypeDesc
      )
      const travelTotal = travelList.length
        ? travelList.reduce((a, b) => a + parseFloat(b.expense || 0), 0)
        : 0
      const apportionTotal = this.apportionConstTableList.length
        ? this.apportionConstTableList.reduce(
            (a, b) => a + parseFloat(b[divideBudget] || 0),
            0
          )
        : 0
      if ((apportionTotal.toFixed(2) - travelTotal.toFixed(2)) > 0) {
        this.$message.warning(`费用分摊明细${expenseTypeDesc}不能大于费用信息${expenseTypeDesc}总费用`)
        return false
      }
      return true
    },
    // 新增修改 验证提交
    submitCheck() {
      return new Promise((resolve, reject) => {
        const ref =
          this.pageState === 'supplement'
            ? 'afterExplainRef'
            : 'baseInfoFormRef'
        this.$refs[ref].validate((valied) => {
          if (!valied) {
            this.$message.warning('请先完善基本信息')
            return reject()
          }


          const data = this.reverseDataTransition()
          // 如果选择的阶梯课程并且选择了外部课程，需要拦截并提示
          if (data.classInfoDTO.annualPlanId === 'N' && data.classInfoDTO?.classTypes[1] === '02001') {
            this.$message.warning('选择了阶梯培训类型，就不能选择计划外')
            return reject()
          }
          
          // 验证 职级分类总人数 和 计划总人数
          // if (!this.verifyPerson(data)) {
          //   return reject()
          // }
          
          // 校验分摊费用有效性
          if (!this.verifyApportionConstData()) {
            return reject()
          }

          if (!this.isShowTrainingCost) {
            if (this.isNeedVerifyTimetable) {
              // 验证课表数据
              if (!this.verifyTimetable(data)) {
                return reject()
              }
            }

            if (this.isNeedVerifyTeacherInfo) {
              // 验证 通关评审及带班老师信息
              if (!this.verifyTeacherInfo(data)) {
                return reject()
              }
            }
            // 验证 费用分摊费用不能大于差旅总费用
            if (!this.verifyCostInfo(data)) {
              return reject()
            }
            if (this.isOtraining) {
              if (this.$refs.otInfoTable.verifyTimetable()) {
                return reject()
              }
            }
          }
          // 验证审批链
          if (!data.classInfoDTO.auditUsersUm) {
            this.$message.warning('请选择审批链')
            return reject()
          }

          // 成功回掉
          resolve(data)
        })
      })
    },
    // 新增修改 提交事件
    submit() {
      if (!this.flag) return
      this.flag = false
      this.submitCheck()
        .then(async (data) => {
          data.classId = data.classInfoDTO.classId
          if (this.pageState === 'supplement') {
            data.classId = ''
            data.classInfoDTO.className += '补充立项'
            data.classInfoDTO.classId = ''
          } else if (this.pageState === 'change') {
            data.classIdOld = data.classId
            // data.classId = "";
            // data.classInfoDTO.classId = "";
          }
          data.oprType = 'submit'
          if (data.divideList) {
            data.divideList.forEach(v=>{
              v.divideBudget = v.divideBudget || 0
              v.divideBudgetCanZa = v.divideBudgetCanZa || 0
              v.divideBudgetChaiLv = v.divideBudgetChaiLv || 0
              v.divideBudgetChangZu = v.divideBudgetChangZu || 0
              v.divideBudgetWbpxf = v.divideBudgetWbpxf || 0
              v.divideBudgetOther = v.divideBudgetOther || 0
            })
          }
          this.$axios
            .post('/fn/classes/lixiang/submitClass', { data }, jsonHeaders)
            .then((res) => {
              const { code, data } = res.data
              if (code === 0) {
                this.$message.success('发送成功')
                this.handleBack()
              }
            })
            .finally(() => {
              this.flag = true
            })
        })
        .catch((err) => {
          console.log(err);
          this.flag = true
        })
    },
    // 保存草稿
    save () {
      if (!this.flag) return
      const data = this.reverseDataTransition()
      if (data.classInfoDTO.annualPlanId === 'N' && data.classInfoDTO?.classTypes[1] === '02001') {
        return this.$message.warning('选择了阶梯培训类型，就不能选择计划外')
      }
      this.flag = false
      data.classId = data.classInfoDTO.classId
      if (this.pageState === 'change') {
        data.classIdOld = data.classId
      }
      data.oprType = 'draft'
      if (data.divideList) {
        data.divideList.forEach(v=>{
          v.divideBudget = v.divideBudget || 0
          v.divideBudgetCanZa = v.divideBudgetCanZa || 0
          v.divideBudgetChaiLv = v.divideBudgetChaiLv || 0
          v.divideBudgetChangZu = v.divideBudgetChangZu || 0
          v.divideBudgetWbpxf = v.divideBudgetWbpxf || 0
        })
      }
      this.$axios
        .post('/fn/classes/lixiang/addClass', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('保存成功')
            this.baseInfoForm.classId = data.classId
          }
        })
        .finally(() => {
          this.flag = true
        })
    },
    // 选择审批链确认事件
    approvalChainConfirm(data) {
      this._.merge(this.baseInfoForm, data)
    },
    getMinute(str) {
      if (!str) return 0
      const [hour, minute] = str.split(':')
      return hour * 60 + (minute - 0)
    },
    // 获取 请求审批链需要的数据
    genLixiangCondition() {
      const lecturerList = CopyObj(this.lecturerList)
      lecturerList.forEach((v) => {
        this.timetableListData.forEach((n) => {
          if (n.teacherNo === v.teacherId) {
            if (!v.lectureHours) {
              v.lectureHours = 0
            }
            const endMinute = this.getMinute(n.endTime)
            const startMinute = this.getMinute(n.startTime)
            v.lectureHours += endMinute - startMinute
          }
        })
        v.lectureHours = myRound(v.lectureHours / 60, 2)
        v.lecturerFee = v.expense
      })
      const budgetDivideList = this.apportionConstTableList.map(
        (v) => v.divideOrgId
      )
      const totalFee = this.$refs.costInfoTable?.getTotal() || '0'
      const expenseDetailList = this.$refs.costInfoTable?.getList()
      const courseDevelopFee = expenseDetailList
        ? (expenseDetailList.find((v) => v.childDesc === '外部课程研发费用')
            ?.expense || '0') + ''
        : '0'
      this.lixiangCondition = {
        lecturerList,
        budgetDivideList,
        totalFee,
        courseDevelopFee
      }
    },
    // 打开自动审批链 时做一些事情
    openApproval() {
      const hints = this.portionApportionConstTableList
        .filter((v) => !v.divideOrgId.trim())
        .map((v) => v.divideOrgName)
        .join('、')
      if (hints) {
        hintFrame(`机构${hints}不合法`)
      }
    },
    // 获取阶梯课程课表数据
    async _getLadderCourseDatas(row) {
      let { channelType, keyJobs, trainSeries, childSeries } = row
      let res = await fetchQueryLadderCourse({
        data: { channelType, keyJobs, trainSeries, childSeries }
      })
      // 已发起过的培训班课表不允许删除
      this.timetableListData = this.timetableListData.filter(v => v.isEvaluate === 'Y')
      this.timetableListData.push(...await this._inintOutTeacherList(res))
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
    },
    // 查外部讲师
    async _queryExternalTeacherList(courseIds) {
      if (!courseIds.length) return []
      return await fetchQueryOutsideLadderCourse({ courseIds })
    },
    //关联外部课程，讲师类型为外部讲师
    _relateExternalCourseToTeacher(row) {
      if (row.courseType === ESTABLISH_COURSE_MAP.interior) {
        row.teacherType = this.ESTABLISH_COURSE_MAP.sansLecturer
      }
    },
    // 外部讲师变更事件
    courseTeacherChangeHandle(value, row) {
      let teachersList = row.courseTeachInfo
      let teacherInfo = teachersList.find((item) => item.teacherId === value)
      Object.keys(teacherInfo).forEach((item) => {
        this.$set(row, item, teacherInfo[item])
      })
      this.checkClassTime(row)
    },
    // 机构部门查数完成后触发查询
    orgSetDataFinish() {
      this.searchPlan()
    },
    totalPlanNum () {
      return Number(this.baseInfoForm.aNum) + Number(this.baseInfoForm.bNum) + Number(this.baseInfoForm.cNum) + Number(this.baseInfoForm.dNum) + Number(this.baseInfoForm.eNum)
    }
  },
  watch: {
    baseInfoForm: {
      deep: true,
      handler() {
        if (this.isChangePage && this.isChange && this.changeState !== 2) {
          this.changeState = 2
        }
      }
    },
    timetableListData: {
      deep: true,
      handler() {
        if (this.isChangePage && this.isChange && this.changeState !== 2) {
          this.changeState = 2
        }
      }
    },
    teacherTableList: {
      deep: true,
      handler() {
        if (this.isChangePage && this.isChange && this.changeState !== 2) {
          this.changeState = 2
        }
      }
    },
    apportionConstTableList: {
      deep: true,
      handler() {
        if (this.isChangePage && this.isChange && this.changeState !== 2) {
          this.changeState = 2
        }
      }
    },
    studentTableList: {
      deep: true,
      handler() {
        if (this.isChangePage && this.isChange && this.changeState !== 2) {
          this.changeState = 2
        }
      }
    },
    lecturerList: {
      deep: true,
      handler() {
        if (this.isChangePage && this.isChange && this.changeState !== 2) {
          this.changeState = 2
        }
      }
    },
    accessoryTableList: {
      deep: true,
      handler() {
        if (this.isChangePage && this.isChange && this.changeState !== 2) {
          this.changeState = 2
        }
      }
    },
    isAfterExplain() {
      this.baseInfoForm.afterExplain = this.isAfterExplain ? this.baseInfoForm.afterExplain : ''
    }
  },
  computed: {
    isAfterExplain() {
      const time = this.baseInfoForm.dateStart
      return time && time < formatDate(+new Date())
    },
    // 项目分类是否是培训班
    trainingCourse() {
      return this.baseInfoForm.classTypes?.[0] === '01001'
    },
    // 是否是项目性培训
    itemTraining() {
      return (
        this.trainingCourse && this.baseInfoForm.classTypes?.[1] === '02000'
      )
    },
    // 是否是阶梯培训
    ladderTraining() {
      return (
        this.trainingCourse && this.baseInfoForm.classTypes?.[1] === '02001'
      )
    },
    // 是否是消保合规
    consumerProtection() {
      return (
        this.trainingCourse && this.baseInfoForm.classTypes?.[1] === '02003'
      )
    },
    // 是否是大学专班
    universitySpecialClass() {
      return (
        this.trainingCourse && this.baseInfoForm.classTypes?.[1] === '02002'
      )
    },
    // 是否是 内部讲师课时费 和 课程研发
    isShowTrainingCost() {
      return (
        !this.trainingCourse &&
        ['05003', '05006'].includes(this.baseInfoForm.classTypes?.[1])
      )
    },
    // 是否是 外部线上培训
    isOtraining() {
      return (
        !this.trainingCourse &&
        ['05013'].includes(this.baseInfoForm.classTypes?.[1])
      )
    },
    // 是否是 读书大会堂、外派培训、平安大学公开班
    isSomeOne() {
      return (
        !this.trainingCourse &&
        ['05001', '05004', '05012'].includes(this.baseInfoForm.classTypes?.[1])
      )
    },
    // 是否是 教师节活动、分摊差旅费、只鸟直播、智能通关、考试面授、考试网络、其他
    isSomeTwo() {
      return (
        !this.trainingCourse &&
        [
          '05002',
          '05005',
          '05008',
          '05009',
          '05010',
          '05011',
          '05007'
        ].includes(this.baseInfoForm.classTypes?.[1])
      )
    },
    // 是否需要验证课程表
    isNeedVerifyTimetable() {
      if (this.isSomeTwo || this.isOtraining) {
        return false
      }
      return true
    },
    // 是否需要验证通关评审
    isNeedVerifyTeacherInfo() {
      if (this.isSomeOne || this.isSomeTwo) {
        return false
      }
      return true
    },
    // 选择城市是否是北上广深杭
    cityIs() {
      return ['110000', '310000', '440100', '440300', '330100', '320100'].includes(
        this.baseInfoForm.citys?.[1]
      )
    },
    // 分页后的费用分摊明细
    portionApportionConstTableList() {
      const list = localPaging(
        this.apportionConstTableList,
        this.apportionConstForm
      )
      return list
    },
    // 分页后的学员列表
    portionStudentTableList() {
      if (this.studentTableList.length !== this.studentForm.total) {
        this.studentForm.total = this.studentTableList.length
      }
      let { currPage, pageSize, total } = this.studentForm
      let start = (currPage - 1) * pageSize
      if (start >= total) {
        currPage = Math.ceil(total / pageSize)
        currPage = currPage > 0 ? currPage : 1
        start = (currPage - 1) * pageSize
        this.studentForm.currPage = currPage
      }
      const end = Math.min(start + pageSize, total)
      return this.studentTableList.slice(start, end)
    },
    busiType() {
      return this.blgStripLine !== 'FL'
    },
    // 是否显示自动审批链
    autoApproval() {
      if (this.blgStripLine === 'LS' && this.trainingCourse) {
        return true
      }
      return false
    },
    // 关联计划函数
    handleOpenCorrelation() {
      return this.baseInfoDisabled ? () => {} : this.openCorrelation
    },
    // 是否是 更改立项页面
    isChangePage() {
      return this.pageState === 'change'
    },
    // 更改立项按钮是否显示
    chnageShowState() {
      return this.pageState === 'change' && this.changeState
    },
    // [保存]按钮是否显示
    saveShowState() {
      // 更改立项、补充立项时，不再展示保存按钮
      // change: 更改立项，supplement: 补充立项,
      return !['change', 'supplement'].includes(this.pageState)
    },
    // 分摊费用合计
    apportionConstTotal() {
      if (!this.apportionConstTableList.length) {
        return 0
      }
      const sum = this.apportionConstTableList.reduce(
        (total, item) =>
          total +
          parseFloat(item.divideBudgetCanZa || 0) +
          parseFloat(item.divideBudgetChangZu || 0) +
          parseFloat(item.divideBudgetWbpxf || 0) +
          parseFloat(item.divideBudgetChaiLv || 0) +
          parseFloat(item.divideBudgetOther || 0),
        0
      )
      return sum.toFixed(2)
    }
  },
  mounted() {
    const params = this.$route.params
    this.classId = params.classId
    this.commcClassId = params.classId
    if (!params.pageState) {
      this.handleBack()
      return
    }
    this.getBaseInfoSelectOptions = cached(this.getBaseInfoSelectOptions)
  },
  activated() {
    const params = this.$route.params
    if (params.pageState) {
      this.classObj = params
      this.pageState = params.pageState
      this.blgStripLine = params.blgStripLine
      this.deptno = params.deptno
      this.initLine()
      this.isChange = false
      this.dataTransition(CopyObj(params))
      setTimeout(() => {
        this.isChange = true
      }, 0)
      allowKeepAlive['/AddEstablishProject'].routerName =
        this.pageStateMaping[this.pageState]
      this.$wenEvent.$emit('getTiele')
      if (this.pageState === 'supplement') {
        this.baseInfoDisabled = true
      }
      if (this.pageState !== 'supplement') {
        this.baseInfoDisabled = false
      }
      if (
        this.pageState === 'change' &&
        this.baseInfoForm.dateStart <= formatDate(new Date())
      ) {
        this.changeState = 2
      }
    }
  },
  created() {
    this.getTeacherCategoryOptions = this.getTeacherCategoryOptions()
  }
}
</script>

<style lang="scss">
.establish__addEstablishProject {
  .gc-select .label {
    width: auto;
  }
  .base-info {
    .form {
      width: 670px;
      margin: 0 auto;

      .gc-select {
        padding: 0;

        .el-select {
          width: 250px;
        }
      }

      .w100 {
        width: 100%;
      }

      .afterExplain {
        .el-form-item__label {
          white-space: nowrap;
          display: flex;
          justify-content: flex-end;
        }
      }

      .search-card__date {
        margin-top: 0;
        .el-form-item__content {
          float: left;
        }
      }
      .textarea {
        textarea {
          height: 180px;
        }
      }

      .line-box {
        display: flex;
        height: 30px;
        justify-content: flex-end;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        i {
          width: 30px;
        }
      }
    }
  }
  .btns {
    display: flex;
    height: 30px;
    margin-top: 20px;
    padding: 0 10px;
    line-height: 30px;
    text-align: center;

    > div {
      flex: 1;
      border: 1px dashed #e2e3e6;
      border-radius: 2px;
      cursor: pointer;
      &:first-child {
        margin-right: 22px;
      }
    }
  }
  .cost-beyond {
    .el-form {
      width: 800px;
      textarea {
        height: 100px;
      }
    }
  }
  .correlation-plan {
    .el-dialog__body {
      padding: 0 0 20px 0 !important;
    }
    .el-tabs__content {
      padding: 0 20px 0;
    }
    .internalPlan {
      .center {
        margin: 0 80px 0 70px;
      }
    }
    .el-input {
      width: 200px;
    }
    .gc-select {
      padding: 0;
    }
  }
  .add-student {
    .selected-table-box {
      padding: 20px;
    }
  }
}
.table-popper {
  padding: 0px;
}
.line-box__drop {
  width: 600px;
}

.tips-container {
  padding: 10px;
  padding-left: 0;
}

.tips-content {
  position: relative;
  padding: 5px 0;
  padding-left: 15px;
  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background-color: #000;
    position: absolute;
    left: 5px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
<style lang="scss" scoped>
.if-conformance :deep(.el-form-item__label){
  width: inherit !important;
}
.if-conformance .inherit{
  display: inherit !important;
}
.org-style {
  :deep(.el-form-item__content) {
    display: inline-flex !important;
  }
}

.external-plan-wrapper {
  :deep(.gc-readonlyInput) {
    margin-bottom: 0;
  }
  :deep(.el-form-item) {
    width: 32%;
  }
}

.external-keyjobs-style {
  display: inline-block; 
  :deep(.el-input__inner) {
    padding-right: 50px !important;
  }
}
</style>
