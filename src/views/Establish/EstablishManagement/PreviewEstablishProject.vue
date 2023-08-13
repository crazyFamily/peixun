<template>
  <div class="establish__addEstablishProject lixiang">
    <el-card class="base-info">
      <div class="title">
        <div class="title__menu"></div>
        立项信息
      </div>
      <el-form
        :model="baseInfoForm"
        :disabled="disabled"
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
        >
          <el-input class="page-input" :value="baseInfoForm.busiType">
            <i slot="suffix" class="page-input__search"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="项目分类" prop="classTypes">
          <el-cascader
            class="wfull"
            :options="projectCategoryOptions"
            :props="{ value: 'dataEncode', label: 'dataValue' }"
            v-model="baseInfoForm.classTypes"
          ></el-cascader>
          <p v-if="baseInfoForm.classTypes?.includes(CLASS_TYPE_KXYF)" class="error-color">*注：如知鸟课程不涉及费用，无需立项，直接通过来做课平台完成上架流程即可。</p>
        </el-form-item>
        <el-form-item label-width="0" class="if-conformance">
          <div class="between">
            <el-form-item class="inherit" label="是否消保培训" inline label-width="110px;" prop="ifConformance">
              <gc-select class="w-200 p0" :options="yesOrNoMap" v-model="baseInfoForm.ifConformance"></gc-select>
            </el-form-item>
            <el-form-item label="培训形式" prop="trainingMode">
              <gc-select class="w-200 p0" :options="TRAININGMODE" v-model="baseInfoForm.trainingMode"></gc-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="项目名称" prop="className">
          <el-input v-model="baseInfoForm.className"></el-input>
        </el-form-item>
        <el-form-item label="申请部门">
          <el-input v-model="baseInfoForm.blgOrgName"></el-input>
        </el-form-item>
        <el-form-item label="拟定日期">
          <div class="df">
            <el-form-item class="search-card__date mr10" prop="dateStart">
              <el-date-picker
                v-model="baseInfoForm.dateStart"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                value-format="yyyy-MM-dd"
                popper-class="date-picker"
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
                value-format="yyyy-MM-dd"
                popper-class="date-picker"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="关联计划" prop="annualPlanId">
          <!-- <el-input class="page-input" :value="baseInfoForm.annualPlanName" @click.native="handleOpenCorrelation">
            <i slot="suffix" class="page-input__search" v-if="baseInfoForm.annualPlanName"></i>
          </el-input> -->
          <gc-readonlyInput class="mb0" @click.native="handleOpenCorrelation">
            {{ baseInfoForm.annualPlanName }}
            <template v-slot:end v-if="baseInfoForm.annualPlanName">
              <i class="page-input__search"></i>
            </template>
          </gc-readonlyInput>
        </el-form-item>
        <el-form-item
          label="事后立项说明"
          v-if="baseInfoForm.afterExplain"
          class="afterExplain"
          maxlength="10"
          show-word-limit
        >
          <el-input class="w100" v-model="baseInfoForm.afterExplain"></el-input>
        </el-form-item>
        <el-form-item label="参与对象" v-if="!isShowTrainingCost">
          <div class="between">
            <el-form-item prop="attendObject">
              <el-input
                class="w250"
                v-model="baseInfoForm.attendObject"
              ></el-input>
            </el-form-item>
            <div class="df">
              <span class="mr10 mr4">计划参加人数</span>
              <el-form-item label-width="0" prop="planNum">
                <el-input
                  class="w250"
                  v-model.number="baseInfoForm.planNum"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="计划参加人数" v-else class="afterExplain">
          <el-form-item label-width="0" prop="planNum">
            <el-input
              class="w250"
              v-model.number="baseInfoForm.planNum"
            ></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="df">
            <span class="l1 mr10 mr4">
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
            class="w-250"
            :options="cityOptions"
            :props="{ value: 'addressId', label: 'addressName' }"
            v-model="baseInfoForm.citys"
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
            <span> 课程表 </span>
            <el-checkbox
              class="ml20"
              @click.native="isComputeHourClick"
              v-model="isComputeHour"
              :disabled="disabled"
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
            class="general__table mt20"
            :list="timetableList"
            :tableList="timetableListData"
          >
            <el-table-column label="日期" width="186">
              <template v-slot="scope">
                <el-date-picker
                  type="date"
                  class="w-150"
                  placeholder="选择日期"
                  v-model="scope.row.courseDate"
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                  :disabled="disabled"
                >
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="266">
              <div slot-scope="scope" class="w-100 aic">
                <el-time-picker
                  v-model="scope.row.startTime"
                  :picker-options="{
                    selectableRange: scope.row.startTimer
                  }"
                  :clearable="false"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="选择时间"
                  ref="timetablePicker"
                  :disabled="disabled"
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
                  placeholder="选择时间"
                  :disabled="disabled"
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
                  :disabled="disabled"
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
                    v-show="
                      scope.row.courseType &&
                      scope.row.courseType !== ESTABLISH_COURSE_MAP.interior
                    "
                    v-model="scope.row.courseName"
                    :disabled="disabled"
                  >
                  </el-input>
                  <!-- <el-button
                    v-if="
                      scope.row.courseType &&
                      scope.row.courseType === ESTABLISH_COURSE_MAP.bank
                    "
                    class="button-w70-h30 ml10 fs0"
                    type="primary"
                    >通用课程</el-button
                  > -->
                </div>

                <gc-readonlyInput
                  class="mb0"
                  v-show="scope.row.courseType === ESTABLISH_COURSE_MAP.interior"
                >
                  {{ scope.row.courseName }}
                  <template v-slot:end>
                    <i class="page-input__search"></i>
                  </template>
                </gc-readonlyInput>
              </template>
            </el-table-column>
            <el-table-column label="讲师类型" min-width="136">
              <template v-slot="scope">
                <gc-select
                  :options="getTeacherCategoryOptions(scope.row.courseType)"
                  v-model="scope.row.teacherType"
                  :disabled="disabled"
                ></gc-select>
              </template>
            </el-table-column>
            <el-table-column label="讲师" width="186">
              <template v-slot="scope">
                <gc-readonlyInput
                  class="mb0"
                  v-show="
                    scope.row.teacherType === ESTABLISH_COURSE_MAP.interiorBank ||
                    scope.row.teacherType === ESTABLISH_COURSE_MAP.sansLecturer
                  "
                >
                  {{ scope.row.teacherName }}
                  <template v-slot:end>
                    <i class="page-input__search"></i>
                  </template>
                </gc-readonlyInput>
                <el-input
                  v-show="scope.row.teacherType === ESTABLISH_COURSE_MAP.interiorNotBank"
                  v-model="scope.row.teacherName"
                  placeholder="请输入内容"
                  :disabled="disabled"
                >
                </el-input>
                <span v-show="scope.row.teacherType === ESTABLISH_COURSE_MAP.notLecturer"
                  >无讲师</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="76">
              <span class="active mr10">
                <el-tooltip content="删除" popper-class="icon-popper">
                  <i class="operation__del"></i>
                </el-tooltip>
              </span>
            </el-table-column>
          </gc-table>
        </div>
        <OtInfoTable disabled :list="onlineTrainingCourseListRender" :baseInfoForm="{dateStart:baseInfoForm.dateStart,dateEnd:baseInfoForm.dateEnd}" v-if="isOtraining" ref="otInfoTable" />
        <div class="teacher-info mt30">
          <div class="title">
            <div class="title__menu"></div>
            <span> 通关评审及带班老师信息 </span>
          </div>
          <div class="general__table mt20">
            <el-table :data="teacherTableList">
              <el-table-column label="姓名" min-width="148">
                <template v-slot="scope">
                  <gc-readonlyInput class="mb0 w140">
                    {{ scope.row.teacherName }}
                    <template v-slot:end>
                      <i class="page-input__search"></i>
                    </template>
                  </gc-readonlyInput>
                </template>
              </el-table-column>
              <el-table-column label="类型" min-width="150px">
                <template v-slot="scope">
                  <gc-select
                    v-model="scope.row.teacherType"
                    :options="teacherCategoryOptions"
                    :disabled="disabled"
                  ></gc-select>
                </template>
              </el-table-column>
              <el-table-column label="内容" min-width="200">
                <template v-slot="scope">
                  <el-input
                    v-model.trim="scope.row.contentDesc"
                    :disabled="disabled"
                  ></el-input>
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
                    value-format="yyyy-MM-dd"
                    popper-class="date-picker"
                    :disabled="disabled"
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
                    class="w-150"
                    placeholder="选择日期"
                    v-model="scope.row.tgDate2"
                    :clearable="false"
                    value-format="yyyy-MM-dd"
                    popper-class="date-picker"
                    :disabled="disabled"
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
                    placeholder="选择时间"
                    :disabled="disabled"
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
                    placeholder="选择时间"
                    :disabled="disabled"
                  >
                  </el-time-picker>
                </div>
              </el-table-column>
              <el-table-column label="操作" min-width="78">
                <span class="active mr10">
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i class="operation__del"></i>
                  </el-tooltip>
                </span>
              </el-table-column>
            </el-table>
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
            :disabled="disabled"
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
                :disabled="disabled"
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
                :disabled="disabled"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="apportion-const mt50">
          <div class="title">
            <div class="title__menu"></div>
            费用分摊明细
          </div>
          <gc-table
            class="general__table mt20"
            :list="apportionConstList"
            :tableList="portionApportionConstTableList"
          >
            <el-table-column label="分摊餐杂费" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetCanZa"
                  :disabled="disabled"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="分摊场租及会务费" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetChangZu"
                  :disabled="disabled"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="分摊外部培训费" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetWbpxf"
                  :disabled="disabled"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="分摊差旅" min-width="150px">
              <template v-slot="scope">
                <el-input
                  class="w90 mr10"
                  v-model.number="scope.row.divideBudgetChaiLv"
                  :disabled="disabled"
                ></el-input>
                元
              </template>
            </el-table-column>
            <el-table-column label="分摊其他费用" width="150px" prop="divideBudgetOther">
              <template v-slot="scope">
                <el-input class="w90 mr10" :disabled="disabled" v-model="scope.row.divideBudgetOther"></el-input>元
              </template>
            </el-table-column>
            <el-table-column label="分摊说明" width="300px">
              <template v-slot="scope">
                <el-input type="textarea" v-model="scope.row.divideDesc" :disabled="disabled" resize="none" rows="2" maxlength="100" show-word-limit></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="124">
              <span class="active mr10">
                <el-tooltip content="删除" popper-class="icon-popper">
                  <i class="operation__del"></i>
                </el-tooltip>
              </span>
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
          <gc-table
            class="general__table mt20"
            ref="studentTableRef"
            :list="studentList"
            :tableList="portionStudentTableList"
          >
            <el-table-column label="操作" min-width="86">
              <span class="active mr10">
                <el-tooltip content="删除" popper-class="icon-popper">
                  <i class="operation__del"></i>
                </el-tooltip>
              </span>
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
                <el-input
                  v-model="scope.row.remarkDesc"
                  :disabled="disabled"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="金额" width="200px">
              <template slot-scope="scope">
                <div class="aic">
                  <el-input
                    class="mr10"
                    v-model="scope.row.expense"
                    :disabled="disabled"
                  ></el-input>
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
        <gc-table
          class="general__table mt20"
          ref="accessoryTableRef"
          :list="accessoryList"
          :tableList="accessoryTableList"
        >
          <el-table-column label="操作" min-width="124">
            <span class="active mr10">
              <el-tooltip content="删除" popper-class="icon-popper">
                <i class="operation__del"></i>
              </el-tooltip>
            </span>
          </el-table-column>
        </gc-table>
      </div>
      <div class="mt30">
        <gc-readonlyInput label="审批链" :value="baseInfoForm.auditUsersUm">
        </gc-readonlyInput>
      </div>
      <div class="btns dfc mt60" v-if="isShowReturn">
        <el-button class="button-w80-h30 mr20" @click="handleBack"
          >返回</el-button
        >
      </div>
    </el-card>
    <!-- 关联计划 弹框 -->
    <CorrelationPlanDetailModel 
      :pageState="'detail'"
      :visible="correlationVisible"
      :baseInfoForm="baseInfoForm"
      :projectCategoryOptions="projectCategoryOptions"
      @close="handleCloseCorrelation" />
  </div>
</template>

<script>
import $ from 'jquery'
import {
  merge,
  cached,
  CopyObj,
  myRound,
  formatDate,
  sizeChange,
  localPaging,
  currentChange,
  filterBusiType,
  addAllowKeepAlive,
  getBlgStripLineOptions
} from '../../../util/utils'
import { allowKeepAlive } from '../../../router'
import CostInfoTable from '../components/CostInfoTable'
import CorrelationPlanDetailModel from '../components/CorrelationPlanDetailModel'
import { ESTABLISH_COURSE_MAP, busiTypes, yesOrNoMap, TRAININGMODE } from '@/util/constants'
import OtInfoTable from './components/OtInfoTable'
import { CLASS_TYPE_KXYF } from '../enum'
export default {
  name: 'PreviewEstablishProject',
  props: {
    params: {
      type: Object | null,
      default: null
    },
    isShowReturn: {
      type: Boolean,
      default: true
    }
  },
  components: {
    CostInfoTable,
    CorrelationPlanDetailModel,
    OtInfoTable
  },
  data() {
    // 授课方式 讲师类型 枚举映射
    // const ESTABLISH_COURSE_MAP = {
    //   // 银行面授
    //   bank: '05002',
    //   // 外部面授
    //   interior: '05003',
    //   // 移动
    //   move: '05001',
    //   // 内部（银行）
    //   interiorBank: '01001',
    //   // 内部（非银行）
    //   interiorNotBank: '01000',
    //   // 外部讲师
    //   sansLecturer: '01002',
    //   // 无讲师
    //   notLecturer: '01003'
    // }
    return {
      CLASS_TYPE_KXYF,
      // 当前页面是新增还是修改
      pageState: '',
      // 上个页面传入的培训班信息
      classObj: {},
      // 当前条线
      blgStripLine: '',
      // 基本信息表单
      baseInfoForm: {},
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
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
      // 课程表 数据数组
      timetableListData: [],
      // 授课方式 下拉选项
      teachingMethodOptions: [
        { label: '内部课程', value: ESTABLISH_COURSE_MAP.bank },
        { label: '外部课程', value: ESTABLISH_COURSE_MAP.interior },
        { label: '通用课程', value: ESTABLISH_COURSE_MAP.commonCourse },
        // 优化需求：历史数据的立项查看，移动课程来源或者内部课程无讲师也正常展示给用户
        { label: '移动', value: ESTABLISH_COURSE_MAP.move }
      ],
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
      onlineTrainingCourseListRender: [],
      // 附件信息 分页表单
      accessoryForm: {},
      // 授课方式 讲师类型 枚举映射
      ESTABLISH_COURSE_MAP,
      // 分页工具函数
      sizeChange,
      currentChange,
      // 条线数组
      lineList: [],
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
      disabled: true,
      // 关联计划弹窗 dialog 状态
      correlationVisible: false,
      yesOrNoMap, // 是否消保培训选项
      TRAININGMODE, // 是否消保培训选项
    }
  },
  methods: {
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
    dataTransition(data) {
      const {
        classTypeOne,
        classTypeTwo,
        addressProvince,
        addressCity
      } = data.classInfoDTO
      this.baseInfoForm = data.classInfoDTO
      this.isComputeHour = data.classInfoDTO.freeTimeOutside === 'Y' ? true : false
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
      data?.courseList?.forEach((v) => {
        v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}:00`
        v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}:00`
        v.teacherTypeBack = v.teacherType
        v.teacherNoBack = v.teacherNo
        // 变更：如有通用课程标识，展示为通用课程
        v.courseType =
          v.isCommonCourse === 'Y'
            ? ESTABLISH_COURSE_MAP.commonCourse
            : v.courseType
      })
      this.timetableListData = data.courseList || []
      this.lecturerList = data.lecturerList
      data?.tgTeacherList?.forEach((v) => {
        v.startTime = `${v.startHour || '00'}:${v.startMin || '00'}:00`
        v.endTime = `${v.endHour || '00'}:${v.endtMin || '00'}:00`
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
    },

    /*
     *   基本信息区域开始
     */
    // 处理项目分类 级联下拉选项
    handleProjectCategoryOptions(data) {
      const { classTypeOneList, classTypeTwoList } = data
      // 培训班
      const p = classTypeOneList.find(
        (v) => v.dataEncode === ESTABLISH_COURSE_MAP.interiorBank
      )
      // 非培训班
      const n = classTypeOneList.find(
        (v) => v.dataEncode === ESTABLISH_COURSE_MAP.sansLecturer
      )
      const pChildren = []
      const nChildren = []
      p.children = pChildren
      n.children = nChildren
      classTypeTwoList.forEach((v) => {
        if (v.prnDataEncode === ESTABLISH_COURSE_MAP.interiorBank) {
          pChildren.push(v)
        } else if (v.prnDataEncode === ESTABLISH_COURSE_MAP.sansLecturer) {
          nChildren.push(v)
        }
      })
      return classTypeOneList
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

    // 根据不同的授课方式返回不同的授课类型选项
    getTeacherCategoryOptions() {
      const interiorOne = {
        label: '内部（银行）',
        value: ESTABLISH_COURSE_MAP.interiorBank
      }
      const interiorTwo = {
        label: '内部（非银行）',
        value: ESTABLISH_COURSE_MAP.interiorNotBank
      }
      const sans = {
        label: '外部讲师',
        value: ESTABLISH_COURSE_MAP.sansLecturer
      }
      const none = { label: '无讲师', value: ESTABLISH_COURSE_MAP.notLecturer }
      return (type) => {
        switch (type) {
          case ESTABLISH_COURSE_MAP.bank:
            return [interiorOne, interiorTwo, none]
          case ESTABLISH_COURSE_MAP.interior:
            return [sans, none]
          case ESTABLISH_COURSE_MAP.commonCourse:
            return [interiorOne, interiorTwo, none]
          case ESTABLISH_COURSE_MAP.move:
            return [interiorOne, interiorTwo, sans, none]
          default:
            return []
        }
      }
    },
    // 通关评审一行内容是否需要验证
    isNecessary(type) {
      return ['02002', '02003'].includes(type)
    },
    /*
     *   附件信息区域结束
     */

    // 费用是否超标
    isBeyond(row) {
      if (row.expenseType === '000101') {
        if (row.unitExpense > 250 && row.unitNum > 0 && row.dayNum > 0) {
          this.dinnerFeeDesc = true
        } else {
          this.dinnerFeeDesc = false
        }
      } else if (row.expenseType === '000501') {
        if (this.cityIs) {
          if (row.unitExpense > 200 && row.unitNum > 0 && row.dayNum > 0) {
            this.placeFeeDesc = true
          } else {
            this.placeFeeDesc = false
          }
        } else {
          if (row.unitExpense > 160 && row.unitNum > 0 && row.dayNum > 0) {
            this.placeFeeDesc = true
          } else {
            this.placeFeeDesc = false
          }
        }
      }
    },
    // 返回到立项页面
    handleBack() {
      const items = $(
        `.component-head__left__tags__item__content:contains(${
          this.pageState === 'add' ? '新增立项' : '修改立项'
        })`
      )
      const item = Array.from(items).find(
        (v) =>
          $(v).text().trim() ===
          (this.pageState === 'add' ? '新增立项' : '修改立项')
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

    getMinute(str) {
      if (!str) return 0
      const [hour, minute] = str.split(':')
      return hour * 60 + (minute - 0)
    },
    handleOpenCorrelation() {
      // console.log(this.baseInfoForm.annualPlanId, this.baseInfoForm.annualPlanName)
      if (this.baseInfoForm.annualPlanName) {
        this.correlationVisible = true
      }
    },
    handleCloseCorrelation() {
      this.correlationVisible = false
    },
    doInitThing() {
      const params = this.params  || this.$route.params
      if (params) {
        this.classObj = params
        this.blgStripLine = params.blgStripLine
        this.dataTransition(CopyObj(params))
      }
    }
  },
  computed: {
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
    }
  },
  watch: {
    params: {
      handler: function (val, oldVal) {
        const params = this.params || this.$route.params
        this.getBaseInfoSelectOptions = cached(this.getBaseInfoSelectOptions)
        if(params) {
          this.doInitThing();
        }
      },
      deep: true
    }
  },
  mounted() {
    const params = this.params || this.$route.params
    this.getBaseInfoSelectOptions = cached(this.getBaseInfoSelectOptions)
    if(this.params) {
      this.doInitThing();
    }
  },
  activated() {
    this.doInitThing();
  },
  created() {
    this.getTeacherCategoryOptions = this.getTeacherCategoryOptions()
  }
}
</script>

<style lang="scss">
.lixiang .base-info .form  {
    width: 670px;
    margin: 0 auto;
}
</style>
<style scoped>
.if-conformance :deep(.el-form-item__label){
  width: inherit !important;
}
.if-conformance .inherit{
  display: inherit !important;
}
</style>
