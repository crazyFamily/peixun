<template>
  <div class="CurriculumManagement__LadderManagenebt">
    <!-- 首页显示内容 -->
    <div v-show="showIndex === 0">
      <!-- 搜索 框 -->
      <el-card class="search-card">
        <el-form ref="form" :model="queryForm" :inline="true">
          <el-form-item class="institution-item" label="条线分类">
            <gc-select
              class="padding-0"
              :options="blgStripLineOptions"
              v-model="queryForm.blgStripLine"
            ></gc-select>
          </el-form-item>
          <el-form-item label="业务模块及关键岗位">
            <el-cascader
              clearable
              v-model="queryForm.courseInfo"
              @change="channelTypesChange"
              :options="planOptions.channelTypes"
              :props="{
                label: 'dataValue',
                value: 'dataEncode',
                children: 'childPlanDict'
              }"
            ></el-cascader>
          </el-form-item>
          <div class="search-card__button">
            <el-button @click="query" type="primary">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-form>
      </el-card>

      <!-- 表格 内容 和分页 -->
      <el-card class="mt10">
        <div class="menu-right">
          <span class="instructor-icons__add" @click="handleAdd">
            <i class="instructor-icons__add__icon"></i>
            新增
          </span>
          <span class="instructor-icons__del" @click="handleDelete">
            <i class="instructor-icons__del__icon"></i>
            删除
          </span>
          <span
            class="instructor-icons__download"
            @click="
              handleExport(
                '/fn/course/template/reportClassTemplateList',
                getData()
              )
            "
          >
            <i class="instructor-icons__download__icon"></i>
            导出</span
          >
        </div>
        <gc-table
          :list="dataList"
          v-loading="loadingTable"
          :tableList="dataTableList"
          class="general__table"
          ref="LadderManagenebtTable"
        >
          <el-table-column label="培训名称" min-width="350">
            <span class="active" @click="showIndex = 2" slot-scope="scope">{{
              scope.row.classTypeName
            }}</span>
          </el-table-column>
          <el-table-column
            label="业务模块"
            min-width="140"
            prop="channelTypeName"
          ></el-table-column>
          <el-table-column
            label="关键岗位"
            min-width="140"
            prop="keyJobsName"
          ></el-table-column>
          <el-table-column
            label="培训系列"
            min-width="110"
            prop="trainSeriesName"
          ></el-table-column>
          <el-table-column
            label="子系列"
            min-width="90"
            prop="childSeriesName"
          ></el-table-column>
          <el-table-column
            label="录入人"
            min-width="140"
            prop="createdBy"
          ></el-table-column>
          <el-table-column label="操作" min-width="130">
            <template slot-scope="scope">
              <div class="">
                <span class="active mr20" @click="openEditPage(scope.row)">
                  <el-tooltip content="编辑" popper-class="icon-popper">
                    <i class="operation__edit"></i>
                  </el-tooltip>
                </span>
                <span class="active ml10 mr20">
                  <el-tooltip content="培训动态" popper-class="icon-popper">
                    <i class="operation__trainingTrends"></i>
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
        </gc-table>
        <gc-pagination
          :total="total"
          layout="prev, pager, next,slot, sizes"
          prev-text=""
          next-text=""
          :page-sizes="[10, 15]"
          :page-size="queryForm.pageSize"
          :current-page="queryForm.currPage"
          @sizeChange="sizeChange($event, queryForm, getLadderList)"
          @currentChange="currentChange($event, queryForm, getLadderList)"
          class="between"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </el-card>
    </div>

    <!-- 新增 显示div -->
    <div v-show="showIndex === 1">
      <el-card class="CurriculumManagement__LadderManagenebt__add">
        <div class="form-wrap">
          <el-form
            ref="addForm"
            label-width="72px"
            :model="addForm"
            :rules="addFormRules"
          >
            <el-form-item label="培训名称" prop="classTypeName">
              <el-input v-model="addForm.classTypeName"></el-input>
            </el-form-item>
            <el-form-item label="业务模块" required>
              <div class="between">
                <el-form-item prop="channelType">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0 w-250"
                    v-model="addForm.channelType"
                    :options="planOptions.channelTypes"
                    @change="channelTypeChange"
                  ></gc-select>
                </el-form-item>
                <el-form-item label="关键岗位" prop="keyJobs" v-if="!isJF">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0 w-250"
                    v-model="addForm.keyJobs"
                    :options="keyPositionOptions"
                  ></gc-select>
                </el-form-item>
                <el-form-item label="关键岗位" v-else>
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0 w-250"
                    v-model="addForm.keyJobs"
                    :options="keyPositionOptions"
                  ></gc-select>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="培训系列" required>
              <div class="between" v-if="!isJF">
                <el-form-item prop="trainSeries">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0 w-250"
                    v-model="addForm.trainSeries"
                    :options="planOptions.trainSeries"
                    @change="trainSeriesChange"
                  ></gc-select>
                </el-form-item>
                <el-form-item label="子序列" prop="childSeries">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0 w-250"
                    v-model="addForm.childSeries"
                    :options="trainSeriesChildOptions"
                  ></gc-select>
                </el-form-item>
              </div>
              <div class="between" v-else>
                <el-form-item>
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0 w-250"
                    v-model="addForm.trainSeries"
                    :options="planOptions.trainSeries"
                    @change="trainSeriesChange"
                  ></gc-select>
                </el-form-item>
                <el-form-item label="子序列">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0 w-250"
                    v-model="addForm.childSeries"
                    :options="trainSeriesChildOptions"
                  ></gc-select>
                </el-form-item>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="train-table">
          <div class="train-table__title">培训课表</div>
          <gc-table
            :list="addLadderList"
            :tableList="addLadderTableList"
            class="general__table"
          >
            <el-table-column label="日期" min-width="180">
              <div slot-scope="scope" class="train-table__day">
                第
                <el-input-number
                  v-model="scope.row.nDay"
                  controls-position="right"
                  :min="1"
                ></el-input-number>
                天
              </div>
            </el-table-column>
            <el-table-column label="时间" min-width="316">
              <div slot-scope="scope" class="train-table__time">
                <el-time-picker
                  v-model="scope.row.startTime"
                  :picker-options="{
                    selectableRange: scope.row.startTimer
                  }"
                  :clearable="false"
                  value-format="HH:mm:ss"
                  @change="startTimeChange($event, scope.row)"
                  placeholder="选择时间"
                >
                </el-time-picker>
                <span> 至 </span>
                <el-time-picker
                  v-model="scope.row.endTime"
                  :picker-options="{
                    selectableRange: scope.row.endTimer
                  }"
                  :clearable="false"
                  value-format="HH:mm:ss"
                  @change="endTimeChange($event, scope.row)"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </div>
            </el-table-column>
            <el-table-column
              label="课程类型"
              min-width="172"
              class-name="curriculum-category"
            >
              <template slot-scope="scope">
                <gc-select
                  v-model="scope.row.courseType"
                  :options="curriculumOptions"
                  @change="curriculumCategoryChange($event, scope.row)"
                >
                </gc-select>
              </template>
            </el-table-column>
            <el-table-column
              label="课程名称"
              min-width="296"
              class-name="curriculum-name"
            >
              <template slot-scope="scope">
                <div v-show="scope.row.courseType">
                  <el-input
                    v-show="scope.row.courseType === '05002'"
                    class="page-input"
                    @focus="courseTypeFocus"
                    v-model="scope.row.courseName"
                  >
                    <i
                      slot="suffix"
                      class="page-input__search"
                      @click="handleSearch($event, scope.row)"
                    ></i>
                  </el-input>
                  <el-input
                    v-show="scope.row.courseType === '05001'"
                    v-model="scope.row.courseName"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="170">
              <template slot-scope="scope">
                <span class="active mr20" @click="handleUpload(scope.row)">
                  <el-tooltip content="录入资料" popper-class="icon-popper">
                    <i class="operation__checkData"></i>
                  </el-tooltip>
                </span>
                <span class="active mr20" @click="handleDown(scope.row)">
                  <el-tooltip content="下载" popper-class="icon-popper">
                    <i class="operation__download"></i>
                  </el-tooltip>
                </span>
                <span
                  class="active mr20"
                  @click="addLadderTableDel(scope.$index)"
                >
                  <el-tooltip content="删除" popper-class="icon-popper">
                    <i class="operation__del"></i>
                  </el-tooltip>
                </span>
              </template>
            </el-table-column>
          </gc-table>
        </div>
        <div class="operation">
          <div class="add" @click="ladderListAppend">添加</div>
          <div class="batch-import" @click="batchAddCurriculumVisible = true">
            批量导入
          </div>
        </div>
        <div class="buttons">
          <el-button @click="showIndex = 0" class="button-w80-h30"
            >返回</el-button
          >
          <el-button
            class="button-w80-h30"
            type="primary"
            @click="handleAddLadder"
            >确定</el-button
          >
        </div>
      </el-card>
    </div>

    <!-- 培训动态子页面 -->
    <div class="training-trends" v-show="showIndex === 2">
      <el-card>
        <div class="search-card aic between">
          <div class="curriculum-title">培训名称：综拓团队长提升培训</div>
          <div class="search-card__button">
            <el-button @click="showIndex = 0">返回</el-button>
            <el-button type="primary">确定</el-button>
          </div>
        </div>
      </el-card>
      <el-card class="content" v-show="childrenShowIndex === 0">
        <el-tabs v-model="trainingTrendsActiveName" @tab-click="tabsClick">
          <el-tab-pane
            label="培训动态"
            name="training-trends"
            class="training-trends-children"
          >
            <div class="search-card between">
              <el-form :inline="true">
                <el-form-item label="日期" class="search-card__date mr10">
                  <el-date-picker
                    v-model="trainingTrendsForm.dateStart"
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                    :picker-options="trainingTrendsStartPickerOptions"
                    value-format="yyyy-MM-dd"
                    popper-class="date-picker"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="至" class="search-card__date">
                  <el-date-picker
                    v-model="trainingTrendsForm.dateEnd"
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                    :picker-options="trainingTrendsEndPickerOptions"
                    value-format="yyyy-MM-dd"
                    popper-class="date-picker"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form>
              <div class="buttons">
                <el-button class="button-60">查询</el-button>
                <el-button class="button-60-blue-primary">重置</el-button>
              </div>
            </div>
            <div class="back-row"></div>
            <div class="coverage-state">
              <div class="chart-box">
                <div class="box-title between">
                  <div class="title">
                    <span class="title__menu"></span>
                    覆盖率
                  </div>
                  <span class="instructor-icons__download">
                    <i class="instructor-icons__download__icon"></i>
                    导出明细
                  </span>
                </div>
                <div class="char">
                  <el-progress
                    type="circle"
                    color="#FFE060"
                    :width="170"
                    :stroke-width="14"
                    :percentage="10"
                  ></el-progress>
                </div>
                <div class="explain">
                  <div class="incumbent-num aic">
                    <div class="square orange"></div>
                    入职人数
                    <span>50</span>
                  </div>
                  <div class="coverage-person-num aic">
                    <div class="square yellow"></div>
                    覆盖人数
                    <span>40</span>
                  </div>
                </div>
              </div>
              <div class="back-col"></div>
              <div class="table-box">
                <div class="table-box__title between">
                  <div class="title">
                    <div class="title__menu"></div>
                    覆盖情况
                  </div>
                  <span class="instructor-icons__download">
                    <i class="instructor-icons__download__icon"></i>
                    导出明细
                  </span>
                </div>
                <div class="table-wrap general__table mt20">
                  <el-table
                    :data="coverageStateTableList"
                    style="width: 100%"
                    :default-sort="{
                      prop: 'date',
                      order: 'descending'
                    }"
                  >
                    <el-table-column
                      label="排名"
                      width="64"
                      type="index"
                    ></el-table-column>
                    <el-table-column
                      label="片区"
                      min-width="162"
                    ></el-table-column>
                    <el-table-column
                      label="分行"
                      min-width="162"
                    ></el-table-column>
                    <el-table-column
                      label="入职人数"
                      min-width="162"
                    ></el-table-column>
                    <el-table-column
                      label="覆盖人数"
                      min-width="162"
                    ></el-table-column>
                    <el-table-column
                      label="覆盖率"
                      min-width="138"
                      prop="date"
                      sortable
                    ></el-table-column>
                  </el-table>
                </div>

                <gc-pagination
                  :total="total"
                  layout="prev, pager, next,slot, sizes"
                  prev-text=""
                  next-text=""
                  :page-sizes="[10, 15]"
                  :page-size="queryForm.pageSize"
                  :current-page="queryForm.currPage"
                  @sizeChange="sizeChange($event, queryForm, getLadderList)"
                  @currentChange="
                    currentChange($event, queryForm, getLadderList)
                  "
                  class="between"
                >
                  <span class="text">每页显示</span>
                </gc-pagination>
              </div>
            </div>
            <div class="back-row"></div>
            <div class="change-chart">
              <div class="change-chart__title">
                <div class="title">
                  <div class="title__menu"></div>
                  变化趋势
                </div>
              </div>
              <div class="change-chart__screen between mt20">
                <div class="left df">
                  <div class="aic">
                    <div class="square orange"></div>
                    入职人数
                  </div>
                  <div class="aic">
                    <div class="square yellow"></div>
                    覆盖人数
                  </div>
                </div>
                <div class="right aic">
                  <div class="select select-box">
                    <div class="month">按月度</div>
                    <div class="quarter selected">按季度</div>
                  </div>
                  <div class="year aic">
                    <span class="mr10">选择年份</span>
                    <el-date-picker
                      v-model="trainingTrendsForm.dateStart"
                      type="year"
                      placeholder="选择年份"
                      :clearable="false"
                      value-format="yyyy"
                      popper-class="date-picker"
                    >
                    </el-date-picker>
                  </div>
                </div>
              </div>
              <div class="chart" id="trainingTrendsChart"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="机构举办情况"
            name="holding-condition"
            class="holding-condition"
          >
            <div class="wrap">
              <div class="search-card between">
                <el-form :inline="true">
                  <el-form-item label="培训班名称">
                    <el-input></el-input>
                  </el-form-item>
                  <el-form-item label="举办时间" class="search-card__date mr10">
                    <el-date-picker
                      v-model="holdingConditionForm.dateStart"
                      type="date"
                      placeholder="选择日期"
                      :clearable="false"
                      :picker-options="holdingConditionStartPickerOptions"
                      value-format="yyyy-MM-dd"
                      popper-class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="至" class="search-card__date">
                    <el-date-picker
                      v-model="holdingConditionForm.dateEnd"
                      type="date"
                      placeholder="选择日期"
                      :clearable="false"
                      :picker-options="holdingConditionEndPickerOptions"
                      value-format="yyyy-MM-dd"
                      popper-class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-form>
                <div class="buttons">
                  <el-button class="button-60">查询</el-button>
                  <el-button class="button-60-blue-primary">重置</el-button>
                </div>
              </div>
              <div class="menu-right">
                <span class="instructor-icons__upload">
                  导出
                  <i class="instructor-icons__upload__icon"></i>
                </span>
              </div>
              <gc-table
                :list="holdingConditionList"
                :tableList="holdingConditionTableList"
                class="general__table"
              >
                <el-table-column label="操作" min-width="180">
                  <span class="mr20" @click="checkClassScheduleVisible = true">
                    <el-tooltip content="查看课表" popper-class="icon-popper">
                      <i class="operation__check"></i>
                    </el-tooltip>
                  </span>
                  <span class="mr20" @click="childrenShowIndex = 1">
                    <el-tooltip content="数据分析" popper-class="icon-popper">
                      <i class="operation__dataAnalysis"></i>
                    </el-tooltip>
                  </span>
                </el-table-column>
              </gc-table>
              <gc-pagination
                :total="total"
                layout="prev, pager, next,slot, sizes"
                prev-text=""
                next-text=""
                :page-sizes="[10, 15]"
                :page-size="queryForm.pageSize"
                :current-page="queryForm.currPage"
                :totalisShow="false"
                @sizeChange="sizeChange($event, queryForm, getLadderList)"
                @currentChange="currentChange($event, queryForm, getLadderList)"
              >
                <span class="text">每页显示</span>
              </gc-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="机构计划动向"
            name="planning-trend"
            class="planning-trend"
          >
            <div class="wrap">
              <div class="search-card between">
                <el-form :inline="true">
                  <el-form-item label="培训班名称">
                    <el-input></el-input>
                  </el-form-item>
                  <el-form-item label="举办时间" class="search-card__date mr10">
                    <el-date-picker
                      v-model="planningTrendForm.dateStart"
                      type="date"
                      placeholder="选择日期"
                      :clearable="false"
                      :picker-options="planningTrendStartPickerOptions"
                      value-format="yyyy-MM-dd"
                      popper-class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="至" class="search-card__date">
                    <el-date-picker
                      v-model="planningTrendForm.dateEnd"
                      type="date"
                      placeholder="选择日期"
                      :clearable="false"
                      :picker-options="planningTrendEndPickerOptions"
                      value-format="yyyy-MM-dd"
                      popper-class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-form>
                <div class="buttons">
                  <el-button class="button-60">查询</el-button>
                  <el-button class="button-60-blue-primary">重置</el-button>
                </div>
              </div>
              <div class="menu-right">
                <span class="instructor-icons__upload">
                  导出
                  <i class="instructor-icons__upload__icon"></i>
                </span>
              </div>
              <gc-table
                :list="planningTrendList"
                :tableList="planningTrendTableList"
                class="general__table"
              >
                <el-table-column label="操作" min-width="124">
                  <span class="mr20">
                    <el-tooltip content="查看课表" popper-class="icon-popper">
                      <i class="operation__check"></i>
                    </el-tooltip>
                  </span>
                </el-table-column>
              </gc-table>
              <gc-pagination
                :total="total"
                layout="prev, pager, next,slot, sizes"
                prev-text=""
                next-text=""
                :page-sizes="[10, 15]"
                :page-size="queryForm.pageSize"
                :current-page="queryForm.currPage"
                :totalisShow="false"
                @sizeChange="sizeChange($event, queryForm, getLadderList)"
                @currentChange="currentChange($event, queryForm, getLadderList)"
              >
                <span class="text">每页显示</span>
              </gc-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <div v-show="childrenShowIndex === 1" class="data-analysis">
        <el-card class="head-info-card">
          <div class="head-info">
            <div>
              <div class="wrap">
                <p class="shallow">岗位总数</p>
                <p class="title">北京分行综拓团队长提升培训</p>
              </div>
            </div>
            <div>
              <div class="wrap">
                <p class="shallow">举办单位</p>
                <p class="title">平安银行北京分行</p>
              </div>
            </div>
            <div>
              <div class="wrap">
                <p class="shallow">举办时间</p>
                <p class="title">2019.07.10-2019.07.15</p>
              </div>
            </div>
            <div>
              <div class="wrap">
                <p class="shallow">覆盖人数</p>
                <p class="active-default">40人</p>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="chart-box-card">
          <div class="chart-box">
            <div class="title">
              <div class="title__menu"></div>
              绩效指标变化趋势
            </div>
            <div class="screen between">
              <div class="explain df">
                <div class="aic">
                  <div class="square blue"></div>
                  中收
                </div>
                <div class="aic">
                  <div class="square green"></div>
                  保费
                </div>
                <div class="aic">
                  <div class="square yellow"></div>
                  件数
                </div>
              </div>
              <div class="condition">
                <div class="select-box">
                  <div>按月度</div>
                  <div class="selected">按季度</div>
                </div>
                <div class="aic ml20">
                  <span class="mr10">时间段</span>
                  <el-input class="w128"></el-input>
                </div>
                <div class="aic ml40">
                  <span>班级成员</span>
                  <div class="select-box ml10 mr10">
                    <div>全体</div>
                    <div class="selected">单一</div>
                  </div>
                  <div class="search-person-box">
                    <el-input class="w148 page-input">
                      <i
                        slot="suffix"
                        class="page-input__search"
                        @click="searchPerson"
                      ></i>
                    </el-input>
                    <div
                      class="search-person-page"
                      v-show="!searchPersonPageHide"
                    >
                      <div class="search-box between">
                        <el-input placeholder="请输入姓名或UM号搜索"></el-input>
                        <el-button class="button-60">查询</el-button>
                      </div>
                      <gc-table
                        class="general__table"
                        :list="searchPersonList"
                        :tableList="searchPersonTableList"
                      ></gc-table>
                    </div>
                  </div>
                </div>
                <div class="aic ml40">
                  <span class="mr10">选择年份</span>
                  <div class="input-wrap">
                    <el-date-picker
                      v-model="trainingTrendsForm.dateStart"
                      type="date"
                      placeholder="选择年份"
                      :clearable="false"
                      :picker-options="trainingTrendsStartPickerOptions"
                      value-format="yyyy"
                      popper-class="date-picker"
                    >
                    </el-date-picker>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart" id="dataAnalysisChart"></div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新增 显示div 选择课程 dialog -->
    <gc-model
      title="选择课程"
      width="800px"
      class="select-curriculum"
      cancelText=""
      comfirmText="选择"
      :visible="selectCurriculumVisible"
      @close="selectCurriculumVisible = false"
      @cancel="selectCurriculumVisible = false"
      @comfirm="selectCurriculumConfirm"
    >
      <el-tabs v-model="activeName" @tab-click="selectCurriculumTabClick">
        <el-tab-pane label="内部课程" name="internalCurriculum">
          <div class="search between">
            <div class="input aic">
              <span class="mr10">课程</span>
              <el-input
                class="w200"
                v-model="internalCurriculumForm.courseInfo"
              ></el-input>
            </div>
            <el-button class="button-60" @click="internalCurriculumSearch"
              >查询</el-button
            >
          </div>
          <gc-table
            class="general__table mt20 table-radio"
            ref="internalCurriculumTableRef"
            :list="internalCurriculumList"
            :tableList="internalCurriculumTableList"
            @selection-change="
              tableSelectionChange($refs, $event, 'internalCurriculumTableRef')
            "
          >
            <el-table-column min-width="124" prop="courseTypeName">
              <template slot="header">
                <gc-tablecolumnfilters
                  label="课程类型"
                  ref="curriculumCategoryFilters"
                  className="table__screen__icon"
                  :list="curriculumCategoryStatus"
                  confirmText="确定"
                  popperClass="circular"
                  @filter="curriculumFilter($event, 'courseType')"
                  @reset="curriculumFiltersReset('courseType')"
                  radio
                >
                </gc-tablecolumnfilters>
              </template>
            </el-table-column>
            <el-table-column min-width="148">
              <template slot="header">
                <gc-tablecolumnfilters
                  label="是否通用课程"
                  ref="isUniversalFilters"
                  className="table__screen__icon"
                  :list="isUniversalStatus"
                  confirmText="确定"
                  popperClass="circular"
                  @filter="curriculumFilter($event, 'isCommonCourse')"
                  @reset="curriculumFiltersReset('isCommonCourse')"
                  radio
                >
                </gc-tablecolumnfilters>
              </template>
              <template slot-scope="scope">
                {{ scope.row.isCommonCourse === 'Y' ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column min-width="138">
              <template slot="header">
                <gc-tablecolumnfilters
                  label="是否评估"
                  ref="isAssessmentFilters"
                  className="table__screen__icon"
                  :list="isAssessmentStatus"
                  confirmText="确定"
                  popperClass="circular"
                  @filter="curriculumFilter($event, 'isEvaluate')"
                  @reset="curriculumFiltersReset('isEvaluate')"
                  radio
                >
                </gc-tablecolumnfilters>
              </template>
              <template slot-scope="scope">
                {{ scope.row.isEvaluate === 'Y' ? '是' : '否' }}
              </template>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="internalCurriculumForm.total"
            layout="prev, pager, next,slot, sizes"
            prev-text=""
            next-text=""
            :page-sizes="[5]"
            :page-size="internalCurriculumForm.pageSize"
            :current-page="internalCurriculumForm.currPage"
            @sizeChange="
              sizeChange(
                $event,
                internalCurriculumForm,
                getInternalCurriculumList
              )
            "
            @currentChange="
              currentChange(
                $event,
                internalCurriculumForm,
                getInternalCurriculumList
              )
            "
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </el-tab-pane>
        <el-tab-pane
          label="外部课程"
          name="externalCurriculum"
          class="external-curriculum"
        >
          <div class="search between">
            <el-form
              :inline="true"
              class="external-curriculum__form"
              @submit.native.prevent
            >
              <el-form-item>
                <span class="mr10">课程信息</span>
                <el-input
                  class="w200"
                  v-model="externalCurriculumForm.courseName"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <span class="mr10">供应商信息</span>
                <el-input
                  class="w200"
                  v-model="externalCurriculumForm.supplyName"
                ></el-input>
              </el-form-item>
            </el-form>
            <el-button class="button-60" @click="externalCurriculumSearch"
              >查询</el-button
            >
          </div>
          <gc-table
            class="general__table mt20 table-radio"
            ref="externalCurriculumTableRef"
            :list="externalCurriculumList"
            v-loading="loadingTableExternal"
            :tableList="externalCurriculumTableList"
            @selection-change="
              tableSelectionChange($refs, $event, 'externalCurriculumTableRef')
            "
          >
          </gc-table>
          <gc-pagination
            :total="externalCurriculumForm.total"
            layout="prev, pager, next,slot, sizes"
            prev-text=""
            next-text=""
            :page-sizes="[5]"
            :page-size="externalCurriculumForm.pageSize"
            :current-page="externalCurriculumForm.currPage"
            @sizeChange="
              sizeChange(
                $event,
                externalCurriculumForm,
                getExternalCurriculumList
              )
            "
            @currentChange="
              currentChange(
                $event,
                externalCurriculumForm,
                getExternalCurriculumList
              )
            "
          >
            <span class="text">每页显示</span>
          </gc-pagination>
        </el-tab-pane>
      </el-tabs>
    </gc-model>

    <!-- 录入资料 dialog -->
    <gc-model
      title="录入资料"
      :visible="uploadDataVisible"
      width="648px"
      @close="uploadDataVisible = false"
      @cancel="uploadDataVisible = false"
      @comfirm="uploadDataComfirm"
    >
      <UploadData ref="uploadDataRef" v-model="uploadDataList" />
    </gc-model>

    <!-- 下载资料 dialog -->
    <DownloadData :row="row" :isIntroduction="true" />

    <!-- 批量导入 课表 dialog -->
    <InstructorBatchImport
      title="批量导入课表"
      :visible="batchAddCurriculumVisible"
      @close="batchAddCurriculumVisible = false"
      @cancel="batchAddCurriculumVisible = false"
      @comfirm="batchImportComfirm"
      @change="batchImportChange"
      @templateDownload="
        templateDownload('/common/file/downloadModule', {
          fileCode: 'courseTepalteModule'
        })
      "
    />

    <!-- 培训动态 机构举办情况 子页面 查看课表弹窗 -->
    <gc-model
      title="查看课表"
      :visible="checkClassScheduleVisible"
      width="1200px"
      @close="checkClassScheduleVisible = false"
      @cancel="checkClassScheduleVisible = false"
      @comfirm="checkClassScheduleVisible = false"
    >
      <gc-table
        :list="checkClassScheduleList"
        :tableList="checkClassScheduleTableList"
        class="general__table"
      ></gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 15]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        :totalisShow="false"
        @sizeChange="sizeChange($event, queryForm, getLadderList)"
        @currentChange="currentChange($event, queryForm, getLadderList)"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </gc-model>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  delayCall,
  sizeChange,
  jsonHeaders,
  dataHeaders,
  handleExport,
  currentChange,
  templateDownload,
  tableSelectionChange,
  getBlgStripLineOptions
} from '../../util/utils'
import $ from 'jquery'
import echarts from '@/plugins/echarts'
import UploadData from './components/UploadData.vue'
import DownloadData from './components/DownloadData.vue'
export default {
  name: 'LadderManagenebt',
  components: {
    UploadData,
    DownloadData
  },
  data() {
    return {
      // 显示哪个页面
      showIndex: 0,
      // 培训动态子页面 显示哪个页面
      childrenShowIndex: 0,
      // 数据总条数
      total: 0,
      // 查询表单休想
      queryForm: {
        // 条线
        blgStripLine: '',
        // 业务模块
        channelType: '',
        // 关键岗位
        keyJobs: '',
        // 级联选择框 帮定值
        courseInfo: [],
        currPage: 1,
        pageSize: 10
      },
      // 条线分类 下拉选项
      blgStripLineOptions: [],
      // 计划 所有 下拉选项
      planOptions: [],
      // 表格字段数组
      dataList: [
        {
          type: 'selection',
          width: '64'
        },
        {
          type: 'index',
          width: '64',
          label: '序号'
        }
      ],
      // 表格数据存放对象
      dataTableList: [],
      // 页面变化函数
      sizeChange,
      currentChange,
      // 新增课程 form 表单
      addForm: {},
      // 新增课程 form 表单 验证规则
      addFormRules: {
        classTypeName: [
          {
            required: true,
            message: '请填写培训名称',
            trigger: 'blur'
          }
        ],
        channelType: [
          {
            required: true,
            message: '请选择业务类型',
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
            message: '请选择子序列',
            trigger: 'change'
          }
        ]
      },
      // 新增课程 form 表单 关键岗位下拉选项
      keyPositionOptions: [],
      // 新增课程 form 表单 培训子序列下拉选项
      trainSeriesChildOptions: [],
      // 新增 div 培训课表 字段
      addLadderList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
      // 新增 div 培训课表 内容
      addLadderTableList: [],
      // 新增 div 培训课表 默认 数据 对象
      ladderTableItem: {
        nDay: 1,
        startTimer: '00:00:00 - 23:59:59',
        endTimer: '00:00:00 - 23:59:59',
        startTime: '',
        endTime: '',
        courseMold: ''
      },
      // 新增 显示div 选择课程 dialog 显示状态
      selectCurriculumVisible: false,
      // 新增 显示div 标签页 当前显示页 name
      activeName: 'internalCurriculum',
      // 新增 显示div 标签页 内部课程表格 字段
      internalCurriculumList: [
        {
          type: 'selection',
          width: '64'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '课程名称',
          width: '180',
          prop: 'courseName'
        }
      ],
      // 新增 显示div 标签页 内部课程表格 数组
      internalCurriculumTableList: [],
      // 新增 显示div 标签页 内部课程表格 课程类型 选项
      curriculumCategoryStatus: [
        {
          label: '阶梯',
          value: '02001'
        },
        {
          label: '非阶梯',
          value: '02000'
        }
      ],
      // 新增 显示div 标签页 内部课程表格 是否通用课程 选项
      isUniversalStatus: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      // 新增 显示div 标签页 内部课程表格 是否评估 选项
      isAssessmentStatus: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      // 新增 显示div 标签页 内部课程表格 查询表单
      internalCurriculumForm: {
        total: 0,
        currPage: 1,
        pageSize: 5,
        courseInfo: '',
        blgStripLine: '',
        courseType: '',
        isCommonCourse: '',
        isEvaluate: ''
      },
      // 新增 显示div 标签页 外部课程表格 字段
      externalCurriculumList: [
        {
          type: 'selection',
          width: '64'
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '课程名称',
          width: '180',
          prop: 'courseName'
        },
        {
          label: '讲师',
          width: '120',
          prop: 'teacherNames'
        },
        {
          label: '供应商',
          width: '284',
          prop: 'supplyNames'
        }
      ],
      // 新增 显示div 标签页 外部课程表格 数组
      externalCurriculumTableList: [],
      // 新增 显示div 标签页 外部课程表格 查询表单
      externalCurriculumForm: {
        total: 0,
        currPage: 1,
        pageSize: 5,
        blgStripLine: '',
        courseName: '',
        supplyName: ''
      },
      // 录入资料dialog 状态
      uploadDataVisible: false,
      // 录入资料dialog 上传文件存放处
      uploadDataList: [],
      //
      row: {},
      CopyObj,
      // 批量导入课表 dialog状态
      batchAddCurriculumVisible: false,
      // 动态培训子页面 tabs 激活页面
      trainingTrendsActiveName: 'training-trends',
      // 动态培训子页面 tabs 之 培训动态表单
      trainingTrendsForm: {},
      trainingTrendsStartPickerOptions: {},
      trainingTrendsEndPickerOptions: {},
      // 动态培训子页面 tabs 之 机构举办情况表单
      holdingConditionForm: {},
      holdingConditionStartPickerOptions: {},
      holdingConditionEndPickerOptions: {},
      // 动态培训子页面 tabs 之 机构计划动向表单
      planningTrendForm: {},
      planningTrendStartPickerOptions: {},
      planningTrendEndPickerOptions: {},
      // 动态培训子页面 覆盖率表格 数组
      coverageStateTableList: [],
      // 机构举办情况 表格 字段数组
      holdingConditionList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '培训班名称',
          width: '250'
        },
        {
          label: '举办单位',
          width: '170'
        },
        {
          label: '举办时间',
          width: '200'
        },
        {
          label: '计划覆盖人数',
          width: '126'
        },
        {
          label: '实际覆盖人数',
          width: '126'
        },
        {
          label: '培训班评估',
          width: '114'
        }
      ],
      // 机构举办情况 表格 数据 数组
      holdingConditionTableList: [],
      // 机构举办情况 查看课表 dialog状态
      checkClassScheduleVisible: false,
      // 机构举办情况 查看课表dialog 表格字段数组
      checkClassScheduleList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '日期',
          width: '146'
        },
        {
          label: '时间',
          width: '178'
        },
        {
          label: '课程名称',
          width: '226'
        },
        {
          label: '课程类型',
          width: '154'
        },
        {
          label: '讲师类型',
          width: '154'
        },
        {
          label: '讲师姓名/工号',
          width: '212'
        }
      ],
      // 机构举办情况 查看课表dialog 表格数据数组
      checkClassScheduleTableList: [],
      // 机构计划动向 表格 字段 数组
      planningTrendList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '培训班名称',
          width: '314'
        },
        {
          label: '举办单位',
          width: '240'
        },
        {
          label: '计划举办时间',
          width: '280'
        },
        {
          label: '计划覆盖人数',
          width: '216'
        }
      ],
      // 机构计划动向 表格 数据 数组
      planningTrendTableList: [],
      // 动态培训图表对象
      trainingTrendsChart: null,
      // 数据分析页面 查询人员 弹出页 是否隐藏
      searchPersonPageHide: true,
      // 数据分析页面 查询人员 表格 字段数组
      searchPersonList: [
        {
          type: 'index',
          label: '序号',
          width: '50'
        },
        {
          label: '姓名',
          width: '76'
        },
        {
          label: 'UM',
          width: '152'
        }
      ],
      // 数据分析页面 查询人员 表格 数据数组
      searchPersonTableList: [],
      // 查询当前 用户 可选条线
      getBlgStripLineOptions,
      curriculumOptions: [
        {
          label: '面授',
          value: '05002'
        },
        {
          label: '移动',
          value: '05001'
        }
      ],
      // SelectionChange 事件 table多选变单选
      tableSelectionChange,
      // 打开 选择课程时 row
      selectCurriculumCurrRow: {},
      // 新增页面 处于新增还是编辑状态
      addPageState: '',
      // 新增页面 批量导入课表文件对象
      batchImportFiles: {},
      templateDownload,
      handleExport,
      loadingTable: false,
      loadingTableExternal: false
    }
  },
  methods: {
    // 查询函数
    query() {
      this.queryForm.currPage = 1
      this.getLadderList()
    },
    // 重置函数
    reset() {
      resetObj(this.queryForm)
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getLadderList()
    },
    // 级联选择框 change 事件
    channelTypesChange(data) {
      ;[this.queryForm.channelType, this.queryForm.keyJobs] = data
    },
    getData() {
      const data = CopyObj(this.queryForm)
      Reflect.deleteProperty(data, 'courseInfo')
      if (!data.blgStripLine) {
        data.blgStripLine = this.$store.state.userInfo.blgStripLine
      }
      return { data }
    },
    // 获取数据函数
    getLadderList() {
      const data = this.getData()
      this.loadingTable = true
      this.$axios
        .post('/fn/course/template/listClassTemplate', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.dataTableList = list
            this.total = total
          }
        }).finally(()=>{
          this.loadingTable = false
        })
    },
    // 新增
    handleAdd() {
      this.addForm = {}
      this.addLadderTableList = []
      this.showIndex = 1
      this.addPageState = 'add'
      this.$nextTick(() => {
        this.$refs.addForm?.clearValidate()
      })
    },
    // 删除
    handleDelete() {
      const selections = this.$refs.LadderManagenebtTable.$children[0].selection
      if (selections.length < 1) {
        return this.$nextTick(() => {
          this.$message.warning('请勾选课程')
        })
      }
      this.$alert('确定删除此课程？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const classTypeList = selections.map((v) => v.classType)
            this.$axios
              .post(
                'fn/course/template/deleteCourseInfoByClassType',
                { classTypeList },
                jsonHeaders
              )
              .then((res) => {
                const { code, data } = res.data
                if (code === 0) {
                  this.$message.success('删除成功')
                  this.getLadderList()
                }
              })
          }
        })
        .catch((err) => err)
    },
    startTimeChange($event, row) {
      row.endTimer = `${$event} - 23:59:59`
    },
    endTimeChange($event, row) {
      row.startTimer = `00:00:00 - ${$event}`
    },
    handleTrainTableDel() {
      this.$alert('确定删除此课程？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const courseIdList = selections.map((v) => v.courseId)
          }
        })
        .catch((err) => err)
    },
    //  新增 显示div 标签页 内部课程表格 筛选 分类公共函数
    curriculumFilter(list, key) {
      this.internalCurriculumForm[key] = list.list[0]
      this.internalCurriculumForm.currPage = 1
      this.getInternalCurriculumList()
    },
    //  新增 显示div 标签页 内部课程表格 重置 分类公共函数
    curriculumFiltersReset(key) {
      this.internalCurriculumForm[key] = ''
      this.internalCurriculumForm.currPage = 1
      this.getInternalCurriculumList()
    },
    // 新增 显示div 标签页 内部课程表格 获取内部课程数据
    getInternalCurriculumList() {
      this.internalCurriculumForm.blgStripLine =
        this.queryForm.blgStripLine || this.$store.state.userInfo.blgStripLine
      const data = CopyObj(this.internalCurriculumForm)

      this.$axios
        .post(
          '/fn/course/internal/searchInternalCourseList',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.internalCurriculumForm.total = total
            this.internalCurriculumTableList = list
          }
        })
    },
    // 新增 显示div 标签页 外部课程表格 获取内部课程数据
    getExternalCurriculumList() {
      this.externalCurriculumForm.blgStripLine =
        this.queryForm.blgStripLine || this.$store.state.userInfo.blgStripLine
      this.loadingTableExternal = true
      this.$axios
        .post(
          '/fn/course/external/listCourseInfo',
          { data: this.externalCurriculumForm },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.externalCurriculumForm.total = total
            this.externalCurriculumTableList = list
          }
        }).finally(()=>{
          this.loadingTableExternal = false
        })
    },
    // 录入资料弹出框 确认事件
    uploadDataComfirm() {
      this.selectCurriculumCurrRow.files = this.uploadDataList
      this.uploadDataVisible = false
    },
    // 处理 时间 限制
    handleTimeLimit(form, startKey, endKey) {
      return {
        // el-date-picker 开始时间限制
        startPickerOptions: {
          disabledDate: (time) => {
            if (form[endKey]) {
              return !(formatDate(time) <= form[endKey])
            }
            return false
          }
        },
        // el-date-picker 结束时间限制
        endPickerOptions: {
          disabledDate: (time) => !(formatDate(time) >= form[startKey])
        }
      }
    },
    // 处理 培训动态 时间限制
    handleTrainingTrends() {
      const { startPickerOptions, endPickerOptions } = this.handleTimeLimit(
        this.trainingTrendsForm,
        '',
        ''
      )
      this.trainingTrendsStartPickerOptions = startPickerOptions
      this.trainingTrendsEndPickerOptions = endPickerOptions
    },
    // 处理 机构举办情况 时间限制
    handleHoldingCondition() {
      const { startPickerOptions, endPickerOptions } = this.handleTimeLimit(
        this.holdingConditionForm,
        '',
        ''
      )
      this.holdingConditionStartPickerOptions = startPickerOptions
      this.holdingConditionEndPickerOptions = endPickerOptions
    },
    // 处理 机构计划动向 时间限制
    handlePlanningTrend() {
      const { startPickerOptions, endPickerOptions } = this.handleTimeLimit(
        this.planningTrendForm,
        '',
        ''
      )
      this.planningTrendStartPickerOptions = startPickerOptions
      this.planningTrendEndPickerOptions = endPickerOptions
    },
    // 标签分页切换事件
    tabsClick($event) {},
    // 等待地图 dom 加载出来 再设置地图
    delayLoadChart() {
      const trainingTrendsChartDom = document.getElementById(
        'trainingTrendsChart'
      )
      if (trainingTrendsChartDom.clientWidth === 0) {
        setTimeout(() => {
          this.delayLoadChart()
        }, 100)
      } else {
        this.trainingTrendsChart = echarts.init(trainingTrendsChartDom)
        this.trainingTrendsChart.setOption({
          grid: {
            left: 36,
            top: 20,
            bottom: 28,
            right: 10
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'none'
            },
            className: 'training-trends-chart-tooltip-wrap',
            formatter(params) {
              return `
                            <div class="training-trends-chart-tooltip">
                            <div class="title-box">2020年01月</div>
                            <div class="content">
                                <div class="item">
                                    <div class="square orange"></div>
                                    <div>覆盖人数：500</div>
                                </div>
                                <div class="item">
                                    <div class="square yellow"></div>
                                    <div>覆盖人数：300</div>
                                </div>
                                <div class="item last">
                                    <div>覆盖率：60%</div>
                                </div>
                            </div>
                        </div>
                        `
            }
          },
          xAxis: {
            type: 'category',
            data: [
              '01月',
              '02月',
              '03月',
              '04月',
              '05月',
              '06月',
              '07月',
              '08月',
              '09月',
              '10月',
              '11月',
              '12月'
            ],
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 10
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              show: true
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            axisLabel: {
              margin: 15
            }
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130, 160, 180, 140, 100, 90],
              type: 'bar',
              itemStyle: {
                color: '#FD6720'
              },
              barWidth: 20,
              tooltip: {
                position: 'inside'
              }
            },
            {
              data: [100, 150, 200, 100, 120, 150, 140, 180, 240, 110, 120, 90],
              type: 'bar',
              itemStyle: {
                color: '#FFE060'
              },
              barWidth: 20,
              barGap: '0',
              tooltip: {
                position: 'inside'
              }
            }
          ]
        })
      }
    },
    // 加载 数据分析 图标
    loadDataAnalysisChart() {
      const dataAnalysisChartDom = document.getElementById('dataAnalysisChart')
      if (dataAnalysisChartDom.clientWidth === 0) {
        return setTimeout(() => {
          this.loadDataAnalysisChart()
        }, 100)
      }
      this.dataAnalysisChart = echarts.init(dataAnalysisChartDom)
      this.dataAnalysisChart.setOption({
        grid: {
          left: 0,
          right: 10,
          top: 30,
          bottom: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          className: 'data-analysis-chart-tooltip-wrap',
          axisPointer: {
            lineStyle: {
              type: 'solid'
            }
          },
          formatter(params) {
            return `
                            <div class="data-analysis-chart-tooltip">
                            <div class="title-box">2020年03月</div>
                            <div class="content">
                                <div class="item">
                                    <div class="square blue"></div>
                                    <div>中收：320w</div>
                                </div>
                                <div class="item">
                                    <div class="square green"></div>
                                    <div>保费：150w</div>
                                </div>
                                <div class="item">
                                    <div class="square yellow"></div>
                                    <div>件数：6</div>
                                </div>
                            </div>
                        </div>
                        `
          }
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: [
            '01月',
            '02月',
            '03月',
            '04月',
            '05月',
            '06月',
            '07月',
            '08月',
            '09月',
            '10月',
            '11月',
            '12月'
          ]
        },
        yAxis: [
          {
            type: 'value',
            name: '中收/保费（万元）',
            nameTextStyle: {
              fontSize: 10,
              align: 'center',
              padding: [0, 0, 0, 26]
            },
            axisLine: {
              show: true
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          {
            type: 'category',
            name: '件数（件）',
            nameTextStyle: {
              fontSize: 10,
              align: 'center',
              padding: [0, 26, 0, 0]
            },
            axisLine: {
              show: true
            },
            axisTick: {
              show: false
            },
            data: [-20, -15, -10, -5, 0, 5, 10, 15, 20]
          }
        ],
        series: [
          {
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              color: '#4A90E2'
            },
            lineStyle: {
              width: 4
            },
            data: [120, 132, 101, 134, 90, 230, 210, 132, 101, 134, 90, 230]
          },
          {
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              color: '#00B046'
            },
            lineStyle: {
              width: 4
            },
            data: [220, 182, 191, 234, 290, 330, 310, 220, 182, 191, 234, 290]
          },
          {
            type: 'line',
            symbolSize: 10,
            itemStyle: {
              color: '#FFC952'
            },
            lineStyle: {
              width: 4
            },
            data: [320, 332, 301, 334, 390, 330, 320, 301, 334, 390, 330, 320]
          }
        ]
      })
    },
    // 打开搜索人员 小页面
    searchPerson() {
      this.searchPersonPageHide = false
    },
    closeSearchPersonPage(e) {
      const ele = $(e.target).closest('.search-person-box')
      if (ele.length === 0) {
        this.searchPersonPageHide = true
      }
    },
    // 获取 计划所有下拉选项
    getPlanOptions() {
      const data = {
        line:
          this.queryForm.blgStripLine ||
          this.$store.state.userInfo.blgStripLine,
        type: '01001'
      }
      this.$axios
        .post('/fn/plan/annual/listPlanDict', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.planOptions = data
          }
        })
    },
    // 新增课程 form 表单 业务模块 change 事件
    channelTypeChange() {
      this.$set(this.addForm, 'keyJobs', '')
      const data = this.planOptions.channelTypes.find(
        (v) => v.dataEncode === this.addForm.channelType
      )
      this.keyPositionOptions = data ? data.childPlanDict : []
    },
    // 新增课程 form 表单 培训系列 change 事件
    trainSeriesChange() {
      this.$set(this.addForm, 'childSeries', '')
      const data = this.planOptions.trainSeries.find(
        (v) => v.dataEncode === this.addForm.trainSeries
      )
      this.trainSeriesChildOptions = data ? data.childPlanDict : []
    },
    // 新增课程 页面 培训课表添加
    ladderListAppend() {
      this.addLadderTableList.push(CopyObj(this.ladderTableItem))
    },
    // 新增课程 页面 培训课表添加 课程名称 focus 事件
    courseTypeFocus($event) {
      $event.target.blur()
    },
    // 内部课程查询函数
    internalCurriculumSearch() {
      this.internalCurriculumForm.currPage = 1
      this.getInternalCurriculumList()
    },
    // 外部课程查询函数
    externalCurriculumSearch() {
      this.externalCurriculumForm.currPage = 1
      this.getExternalCurriculumList()
    },
    // 选择课程 确认事件
    selectCurriculumConfirm() {
      let table
      if (this.activeName === 'internalCurriculum') {
        table = this.$refs.internalCurriculumTableRef
      } else {
        table = this.$refs.externalCurriculumTableRef
      }
      const selection = table.$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('选择内容为空')
      }
      this.$set(this.selectCurriculumCurrRow, 'courseId', selection[0].courseId)
      this.$set(
        this.selectCurriculumCurrRow,
        'courseName',
        selection[0].courseName
      )
      this.selectCurriculumCurrRow.courseMold =
        this.activeName === 'internalCurriculum' ? '内部' : '外部'
      this.selectCurriculumVisible = false
    },
    // 选择课程dialog 切换不同课程 的tabs点击事件
    selectCurriculumTabClick(tab) {
      let table
      if (tab.label === '外部课程') {
        table = this.$refs.internalCurriculumTableRef
      } else {
        table = this.$refs.externalCurriculumTableRef
      }
      table.$children[0].clearSelection()
    },
    // 课程类型 change 事件
    curriculumCategoryChange(e, row) {
      this.$set(row, 'courseName', '')
      if (e === '05002') {
        row.courseId = ''
        row.courseMold = ''
      } else {
        row.courseId = 'N'
        row.courseMold = '移动'
      }
    },
    // 新增 培训课表 删除一个
    addLadderTableDel(index) {
      this.addLadderTableList.splice(index, 1)
    },
    // 新增课程 确定事件
    handleAddLadder() {
      const data = CopyObj(this.addForm)
      data.templateCourseList = CopyObj(this.addLadderTableList)
      data.templateCourseList.forEach((v) => {
        v.startTime = v.startTime.split(':').slice(0, 2).join('')
        v.endTime = v.endTime.split(':').slice(0, 2).join('')
      })
      let url, desc
      if (this.addPageState === 'add') {
        url = '/fn/course/template/addClassTemplateInfo'
        desc = '新增'
      } else {
        url = '/fn/course/template/updateClassTemplateInfo'
        desc = '编辑'
      }
      const index = data.templateCourseList.findIndex(
        (v) => !v.courseMold && v.courseType === '05002'
      )
      if (index >= 0) {
        this.$message.error(
          `第${index + 1}行${
            data.templateCourseList[index].courseName || '课程名称'
          }未检查`
        )
        $('.train-table .el-table__body-wrapper tr')
          .eq(index)
          .children('td')
          .eq(4)
          .find('.cell input')
          .css({ 'border-color': '#f54e1e' })
        return
      }
      const notAccordantTime = data.templateCourseList.findIndex(
        (v) => v.endTime < v.startTime
      )
      if (notAccordantTime >= 0) {
        this.$message.warning(
          `第${notAccordantTime + 1}行结束时间不能大于开始时间`
        )
        return
      }
      const voidCourseName = data.templateCourseList.findIndex(
        (v) => !v.courseName
      )
      if (voidCourseName >= 0) {
        return this.$message.warning(
          `第${voidCourseName + 1}行课程名称不能为空`
        )
      }
      this.$axios.post(url, { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.getLadderList()
          this.$message.success(`${desc}课程成功`)
          this.showIndex = 0
        }
      })
    },
    // 打开编辑课程页面
    openEditPage({ blgStripLine, id }) {
      blgStripLine = blgStripLine || this.queryForm.blgStripLine
      const data = { blgStripLine, id }
      this.$axios
        .post(
          '/fn/course/template/findClassTemplateDetail',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.dataTransition(data)
            this.showIndex = 1
            this.addPageState = 'edit'
          }
        })
    },
    // 课程详情数据 转化为适合 编辑页面的数据
    dataTransition(data) {
      data.templateCourseList.forEach((v) => {
        v.startTime = [
          v.startTime.slice(0, 2),
          v.startTime.slice(2),
          '00'
        ].join(':')
        v.endTime = [v.endTime.slice(0, 2), v.endTime.slice(2), '00'].join(':')
      })
      this.addLadderTableList = data.templateCourseList
      Reflect.deleteProperty(this.addForm, 'templateCourseList')
      const keyJobs = data.keyJobs
      data.keyJobs = ''
      const childSeries = data.childSeries
      data.childSeries = ''
      this.addForm = data
      this.channelTypeChange()
      this.trainSeriesChange()
      this.$nextTick(() => {
        if (keyJobs !== '-1') {
          this.addForm.keyJobs = keyJobs
        }
        if (childSeries !== '-1') {
          this.addForm.childSeries = childSeries
        }
      })
    },
    // 新增页面 批量导入课表 上传组件 comfirm 事件
    batchImportComfirm() {
      const data = new FormData()
      data.append('file', this.batchImportFiles)
      this.$axios
        .post('/courseFileFunc/template/batchImport', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.forEach((v) => {
              v.startTime = [
                v.startTime.slice(0, 2),
                v.startTime.slice(2),
                '00'
              ].join(':')
              v.endTime = [
                v.endTime.slice(0, 2),
                v.endTime.slice(2),
                '00'
              ].join(':')
            })
            this.addLadderTableList.push(...data)
            this.batchAddCurriculumVisible = false
          }
        })
    },
    // 新增页面 批量导入课表 上传组件 change 事件
    batchImportChange($event) {
      this.batchImportFiles = $event.target.files[0]
    },
    // 新增页面 打开上传 资料dialog
    handleUpload(row) {
      if (this.selectCurriculumCurrRow !== row) {
        this.selectCurriculumCurrRow = row
        this.$refs.uploadDataRef?.reset()
      }
      this.uploadDataVisible = true
    },
    handleSearch($event, row) {
      $($event.target)
        .closest('.page-input')
        .find('input')
        .css({ 'border-color': '' })
      this.selectCurriculumCurrRow = row
      this.selectCurriculumVisible = true
      this.internalCurriculumTableList = []
      resetObj(this.internalCurriculumForm)
      this.internalCurriculumForm.total = 0
      this.internalCurriculumForm.currPage = 1
      this.internalCurriculumForm.pageSize = 5
      this.externalCurriculumTableList = []
      resetObj(this.externalCurriculumForm)
      this.externalCurriculumForm.total = 0
      this.externalCurriculumForm.currPage = 1
      this.externalCurriculumForm.pageSize = 5
      if (!row.courseMold && row.courseName) {
        this.internalCurriculumForm.courseInfo = row.courseName
        this.externalCurriculumForm.courseName = row.courseName
      }
    },
    handleDown(row) {
      this.row = CopyObj(row)
      this.selectCurriculumCurrRow = row
    }
  },
  mounted() {
    // 给document 绑定事件 来关闭 打开搜索人员 小页面
    $(document).bind('click', this.closeSearchPersonPage)
    // 查询当前用户可选条线
    getBlgStripLineOptions('courseModule').then((res) => {
      this.blgStripLineOptions = res
    })
    delayCall(
      this.getPlanOptions,
      () => this.$store.state.userInfo.blgStripLine
    )
    delayCall(
      () => {
        if (!this.queryForm.blgStripLine) {
          this.queryForm.blgStripLine = this.$store.state.userInfo.blgStripLine
        }
        this.getLadderList()
      },
      () => this.$store.state.userInfo.blgStripLine
    )
  },
  beforeDestroy() {
    // 给document 解绑事件
    $(document).off('click', this.closeSearchPersonPage)
  },
  created() {
    this.handleTrainingTrends()
    this.handleHoldingCondition()
    this.handlePlanningTrend()
  },
  watch: {
    showIndex(n) {
      if (n === 2 && this.trainingTrendsChart === null) {
        this.delayLoadChart()
      }
    },
    childrenShowIndex(newValue) {
      if (newValue === 1) {
        this.loadDataAnalysisChart()
      }
    },
    showIndex(n, o) {
      if (n === 0 && o === 1) {
        this.batchImportFiles = {}
      }
    }
  },
  computed: {
    isJF() {
      return this.$store.state.userInfo.blgStripLine === 'JF'
    }
  }
}
</script>

<style lang="scss">
.CurriculumManagement__LadderManagenebt {
  &__add {
    .el-card__body {
      padding: 30px 0;
    }

    .form-wrap {
      border-bottom: 1px dashed #eaecf1;
      input {
        height: 30px !important;
      }
    }
    .el-form {
      width: 666px;
      margin: auto;
      > .el-form-item {
        margin: 0 0 30px 0;
      }
      .w250 {
        width: 250px;
      }
    }
    .train-table {
      padding: 0 30px;
      &__title {
        padding: 30px 0 20px;
      }
      &__day {
        display: flex;
        align-items: center;
        .el-input-number {
          width: 60px;
          margin: 0 10px;
          line-height: 28px;
          border: 1px solid #e0e1e3;
          background-color: #fff;
          border-radius: 2px;
          > span {
            width: 20px;
            border: none;
            background-color: #fff;
          }
          .el-input {
            width: 40px;

            input {
              height: 28px;
              border: none;
            }
          }
          .el-icon-arrow-down::before {
            content: '\e6df' !important;
            background: none;
            width: auto;
            height: auto;
            line-height: inherit;
          }
          .el-input-number__increase {
            top: 3px;
          }
          .el-input-number__decrease {
            bottom: 3px;
          }
        }
      }
      &__time {
        display: flex;
        align-items: center;
        .el-input {
          width: 100px;
        }
        > span {
          margin: 0 10px;
        }
      }
      .curriculum-category {
        input {
          width: 100px;
        }
      }
      .curriculum-name {
        .el-input {
          width: 200px;
        }
      }
    }
    .operation {
      display: flex;
      padding: 20px 30px 60px;
      justify-content: space-between;
      div {
        width: 602px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border: 1px dashed #e2e3e6;
        cursor: pointer;
      }
    }
    .buttons {
      display: flex;
      justify-content: center;
    }
  }
  .select-curriculum {
    .el-dialog__body {
      padding: 0 0 20px !important;
    }
    .el-tab-pane {
      padding: 5px 20px 20px;
    }
    .external-curriculum {
      &__form {
        .el-form-item {
          margin: 0;
          &:first-child {
            margin-right: 60px;
          }
        }
      }
    }
  }
  .training-trends {
    .curriculum-title {
      padding: 6px 0;
    }
    .content {
      margin-top: 2px;
      .el-card__body {
        padding: 0;
      }
      .search-card {
        margin: 5px 0 20px;
        padding: 0 20px;
        &__date {
          margin-top: 0;
        }
      }
      .el-tabs__content {
        overflow: visible;
      }
      .back-row {
        position: relative;
        height: 10px;
        overflow: visible;
        &::before {
          display: block;
          position: absolute;
          content: '';
          top: 0;
          bottom: 0;
          left: -20px;
          right: -20px;
          background-color: #f5f6fb;
        }
      }
      .training-trends-children {
        .coverage-state {
          height: 410px;
          display: flex;
          .chart-box {
            width: 310px;
            padding: 20px 26px 0 20px;
            .char {
              display: flex;
              margin: 60px 0;
              justify-content: center;
              align-items: center;

              svg path {
                &:first-child {
                  stroke: #fd6720;
                }
              }
              .el-progress__text {
                margin: 0 !important;
                font-size: 40px !important;
                color: #000000;
              }
            }
            .explain {
              display: flex;
              justify-content: center;
              .incumbent-num {
                margin-right: 38px;
              }
              span {
                margin-left: 6px;
              }
              .square {
                margin-right: 4px;
              }
            }
          }
          .back-col {
            width: 10px;
            background-color: #f5f6fb;
          }
          .table-box {
            flex: 1;
            padding: 20px;
          }
        }
        .change-chart {
          padding: 20px;

          &__screen {
            .left {
              .square {
                margin-right: 10px;
              }
              > div:first-child {
                margin-right: 40px;
              }
            }
            .right {
              .select {
                margin-right: 40px;
              }
            }
            .el-date-editor {
              width: 150px;
            }
          }
          .chart {
            width: 100%;
            height: 300px;
          }
        }
      }
      .wrap {
        padding: 0 20px 20px;
        .search-card {
          padding: 0;
        }
      }
    }
    .data-analysis {
      margin-top: 8px;
      .head-info {
        display: flex;
        > div {
          position: relative;
          flex: 1;
          display: flex;
          padding: 30px 0;
          justify-content: center;

          &:nth-child(n + 2) {
            &::before {
              display: block;
              position: absolute;
              content: '';
              width: 1px;
              top: 30px;
              bottom: 30px;
              left: 0;
              background-color: #eaecf1;
            }
          }
        }
        .title {
          margin-top: 6px;
          color: #424656;
        }
      }
      .chart-box-card {
        margin-top: 8px;
      }
      .chart-box {
        .screen {
          margin-top: 25px;
          .square {
            margin-right: 10px;
          }
          .explain {
            > div {
              margin-right: 40px;
            }
          }
          .condition {
            display: flex;
            .input-wrap {
              .el-input {
                width: 150px;
              }
            }
          }
        }
        .chart {
          width: 100%;
          height: 600px;
          margin-top: 20px;
        }

        .search-person-box {
          position: relative;
          .search-person-page {
            position: absolute;
            width: 320px;
            max-height: 374px;
            top: 45px;
            left: 0;
            padding: 18px 16px 20px 20px;
            background-color: #fff;
            z-index: 1;
            box-shadow: 0 2px 10px 0 rgba($color: #424656, $alpha: 0.24);
            overflow: auto;
            .el-input {
              width: 190px;
            }
            .general__table {
              margin-top: 14px;
            }
          }
        }
      }
      .data-analysis-chart-tooltip-wrap {
        width: 120px;
        height: 146px;
        padding: 0 !important;
        .data-analysis-chart-tooltip {
          .title-box {
            height: 40px;
            border-bottom: 1px solid #f1f2f4;
            font-size: 14px;
            color: #424656;
            padding-left: 10px;
            line-height: 40px;
          }
          .content {
            padding-left: 10px;
            .item {
              display: flex;
              align-items: center;
              margin-top: 10px;
              font-size: 12px;
              color: #424656;
              .square {
                margin-right: 6px;
              }
            }
          }
        }
      }
    }

    .training-trends-chart-tooltip-wrap {
      width: 132px;
      height: 150px;
      padding: 0 !important;
      border-color: #fff !important;
      .training-trends-chart-tooltip {
        .title-box {
          height: 40px;
          border-bottom: 1px solid #f1f2f4;
          font-size: 14px;
          color: #424656;
          padding-left: 10px;
          line-height: 40px;
        }
        .content {
          padding-left: 10px;
          .item {
            display: flex;
            align-items: center;
            margin-top: 10px;
            font-size: 12px;
            color: #424656;
            .square {
              margin-right: 6px;
            }
          }
        }
      }
      .last {
        margin-left: 24px;
      }
    }
  }
  .square {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  .orange {
    background-color: #fd6720;
  }
  .yellow {
    background-color: #ffe060;
  }
  .blue {
    background-color: #4a90e2;
  }
  .green {
    background-color: #00b046;
  }
  .select-box {
    display: flex;
    align-items: center;
    div {
      width: 60px;
      height: 28px;
      border: 1px solid #eaecf1;
      background-color: #f7f8fa;
      color: #7d8292;
      text-align: center;
      line-height: 28px;

      &.selected {
        z-index: 1;
        border-color: #fd6720;
        color: #fd6720;
        background-color: #fff;
      }

      &:first-child {
        border-radius: 2px 0 0 2px;
      }
      &:last-child {
        margin-left: -1px;
        border-radius: 0 2px 2px 0;
      }
    }
  }
}
</style>
