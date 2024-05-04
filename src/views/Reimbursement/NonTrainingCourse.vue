<template>
  <div class="NonTrainingCourse">
    <el-card class="NonTrainingCourse__search-card search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item>
          <gc-input
            label="项目编号"
            v-model.trim="queryForm.classId"
          ></gc-input>
        </el-form-item>
        <el-form-item>
          <gc-input
            label="项目名称"
            v-model.trim="queryForm.className"
          ></gc-input>
        </el-form-item>
        <el-form-item>
          <gc-input
            label="培训班主任"
            v-model.trim="queryForm.classAdviser"
          ></gc-input>
        </el-form-item>

        <el-form-item>
          <el-form-item label="项目日期" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.startTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :picker-options="startPickerOptions"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date">
            <el-date-picker
              v-model="queryForm.endTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :picker-options="endPickerOptions"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item v-if="!isJF">
          <gc-select
            label="条线"
            :options="lineOptions"
            :clearable="false"
            v-model="queryForm.line"
          ></gc-select>
        </el-form-item>
        <div class="NonTrainingCourse__search-card__button search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card class="NonTrainingCourse__table-card mt10">
      <div class="menu-right">
        <span
          class="instructor-icons__download"
          @click="
            handleExport(
              '/fn/reim/classes/exportSelectReimClassesList',
              getData()
            )
          "
        >
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <gc-table
        :tableList="tableList"
        :list="list"
        :stripe="false"
        class="general__table"
      >
        <template>
          <el-table-column min-width="110" prop="classTypeTwoName">
            <template slot="header">
              <gc-tablecolumnfilters
                label="培训班类型"
                ref="costTypeRef"
                className="table__screen__icon"
                :list="classesTypeList"
                confirmText="确定"
                popperClass="circular m183"
                @filter="costTypeFilter($event, 'classTypeTwo')"
                @reset="costTypeReset('classTypeTwo')"
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>

          <el-table-column
            min-width="159"
            prop="classTime"
            label="项目时间"
          ></el-table-column>
          <el-table-column
            min-width="90"
            prop="classAdviserName"
            label="培训班主任"
          ></el-table-column>
          <el-table-column min-width="90" prop="expenseName">
            <template slot="header">
              <gc-tablecolumnfilters
                label="费用类型"
                ref="expenseNameRef"
                className="table__screen__icon"
                :list="moneyStateList"
                confirmText="确定"
                popperClass="circular"
                @filter="costTypeFilter($event, 'expenseType')"
                @reset="costTypeReset('expenseType')"
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>
          <el-table-column
            label="条线"
            width="60"
            prop="line"
          ></el-table-column>
          <el-table-column
            label="申请部门"
            min-width="200"
            prop="reimDeptName"
          ></el-table-column>
          <el-table-column min-width="104" prop="classStatusName">
            <template slot="header">
              <gc-tablecolumnfilters
                label="培训班状态"
                ref="classStatusNameRef"
                className="table__screen__icon"
                :list="trainingStateList"
                confirmText="确定"
                popperClass="circular"
                @filter="trainingStateFilter"
                @reset="trainingStateReset"
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80" fixed="right">
            <template slot-scope="scope">
              <div class="NonTrainingCourse__table-card__operation">
                <span
                  class="mr20"
                  @click="
                    launchReimbursement(
                      scope.row,
                      fetchInitSelectClassesInfo
                    )
                  "
                >
                  <el-tooltip content="发起报销" popper-class="icon-popper">
                    <i
                      :class="
                        scope.row.classStatusName === '已结训'
                          ? 'operation__Reimbursement'
                          : 'operation__Reimbursement-disabled'
                      "
                    ></i>
                  </el-tooltip>
                </span>
                <span
                  @click="
                    launchReimbursement(
                      scope.row,
                      fetchSelectAdvancePay
                    )
                  "
                >
                  <el-tooltip content="发起预付款" popper-class="icon-popper">
                    <i
                      :class="
                        scope.row.expenseName === '举办费用'
                          ? 'operation__advance'
                          : 'operation__advance-disabled'
                      "
                    ></i>
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" min-width="140">
            <template slot-scope="scope">
              <div
                class="NonTrainingCourse__table-card__operation"
                v-if="scope.row.expenseType === 'N'"
              >
                <span
                  class="NonTrainingCourse__table-card__operation__item active"
                  @click="item.action(scope.row, item.tagContent)"
                  v-for="item in getOperationList(scope.row)"
                  :key="item.name"
                >
                  <el-tooltip
                    :content="item.tagContent"
                    popper-class="icon-popper"
                  >
                    <i :class="item.className"></i>
                  </el-tooltip>
                </span>
              </div>
            </template>
          </el-table-column>
        </template>
      </gc-table>

      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getTableList)"
        @currentChange="currentChange($event, queryForm, getTableList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 录入资料 dialog -->
    <gc-model
      title="录入资料查看"
      :visible="dataSeeVisible"
      width="500px"
      @close="
        dataSeeVisible = false
        inputDirectSeedingData = {}
      "
      :isShowFooter="false"
    >
      <div class="NonTrainingCourse__enclosure">
        <div class="NonTrainingCourse__enclosure__title">
          <span class="NonTrainingCourse__enclosure__title__menu"></span>
          立项附件
        </div>
        <div class="NonTrainingCourse__enclosure__content">
          <ul class="NonTrainingCourse__enclosure__content__items">
            <li
              class="NonTrainingCourse__enclosure__content__items__item"
              v-for="item in inputDirectSeedingData.setup"
              :key="item.udmpId"
            >
              <!-- <div
                                class="NonTrainingCourse__enclosure__content__items__item__left"
                            >
                                录入学员
                            </div> -->
              <div
                class="
                  NonTrainingCourse__enclosure__content__items__item__right
                "
              >
                <div
                  class="
                    NonTrainingCourse__enclosure__content__items__item__right__left
                  "
                >
                  <i
                    class="
                      NonTrainingCourse__enclosure__content__items__item__right__left__text-icon
                    "
                  ></i>
                  {{ item.fileName }}
                </div>
                <i
                  class="
                    NonTrainingCourse__enclosure__content__items__item__right__down-icon
                  "
                  @click="handleDownloadFile(item)"
                ></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="NonTrainingCourse__input-data">
        <div class="NonTrainingCourse__input-data__title">
          <span class="NonTrainingCourse__input-data__title__menu"></span>
          {{
            row.classTypeTwo === '05010'
              ? '考试文件信息'
              : inputDataMaping[row.classTypeTwo] || '录入资料'
          }}
        </div>
        <div class="NonTrainingCourse__input-data__content">
          <div
            v-if="inputDataMaping[row.classTypeTwo]"
            class="NonTrainingCourse__input-data__content__reimliveno"
          >
            <div
              class="
                NonTrainingCourse__input-data__content__reimliveno__left
                NonTrainingCourse__input-data__content__items__item__left
              "
            >
              {{ inputDataMaping[row.classTypeTwo] }}
            </div>
            <div
              class="NonTrainingCourse__input-data__content__reimliveno__right"
            >
              <ul class="NonTrainingCourse__input-data__content__items">
                <li
                  class="NonTrainingCourse__input-data__content__items__item"
                  v-for="item in inputDirectSeedingData.reimLiveNo"
                  :key="item"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <ul v-else class="NonTrainingCourse__input-data__content__items">
            <li
              v-if="
                row.classTypeOpr && row.classTypeOpr.indexOf('UPLOAD_STU') > -1
              "
              class="NonTrainingCourse__input-data__content__items__item"
            >
              <div
                class="
                  NonTrainingCourse__input-data__content__items__item__left
                "
              >
                学员信息
              </div>
              <div
                class="
                  NonTrainingCourse__input-data__content__items__item__right
                "
              >
                <div
                  class="
                    NonTrainingCourse__input-data__content__items__item__right__left
                  "
                >
                  <i
                    class="
                      NonTrainingCourse__input-data__content__items__item__right__left__text-icon
                    "
                  ></i>
                  学员导出
                </div>
                <i
                  class="
                    NonTrainingCourse__input-data__content__items__item__right__down-icon
                  "
                  @click="downloadStudent"
                ></i>
              </div>
            </li>

            <li
              class="NonTrainingCourse__input-data__content__items__item"
              v-for="item in inputDirectSeedingData.upload"
              :key="item.udmpId"
            >
              <div
                class="
                  NonTrainingCourse__input-data__content__items__item__left
                "
              >
                {{ uploadOptions[item.busiId] }}
              </div>
              <div
                class="
                  NonTrainingCourse__input-data__content__items__item__right
                "
              >
                <div
                  class="
                    NonTrainingCourse__input-data__content__items__item__right__left
                  "
                >
                  <i
                    class="
                      NonTrainingCourse__input-data__content__items__item__right__left__text-icon
                    "
                  ></i>
                  {{ item.fileName }}
                </div>
                <i
                  class="
                    NonTrainingCourse__input-data__content__items__item__right__down-icon
                  "
                  @click="handleDownloadFile(item)"
                ></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </gc-model>

    <!-- 录入知鸟直播号 dialog -->
    <gc-model
      :title="dataSeeTitle"
      :visible="inputDirectSeedingVisible"
      width="500px"
      @close="inputDirectSeedingVisible = false"
      class="NonTrainingCourse__input-direct-seeding"
      @cancel="inputDirectSeedingVisible = false"
      @comfirm="inputDirectSeedingConfirm"
    >
      <el-table
        class="NonTrainingCourse__input-direct-seeding__table general__table"
        :data="inputDirectSeedingTable"
      >
        <el-table-column :label="dataSeeTitle" width="278" prop="date">
          <template slot-scope="scope">
            <div v-show="scope.row.edit">
              <el-input v-model="scope.row.code"></el-input>
            </div>
            <div v-show="!scope.row.edit">{{ scope.row.code }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-show="scope.row.edit">
              <span
                class="active mr20"
                @click="checkReimLive(scope.row, scope.$index)"
                >保存</span
              >
              <span class="active" @click="cancelItem(scope.row, scope.$index)"
                >取消</span
              >
            </div>
            <div v-show="!scope.row.edit">
              <span class="active mr20" @click="scope.row.edit = true"
                >编辑</span
              >
              <span class="active" @click="delOneItem(scope.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="NonTrainingCourse__input-direct-seeding__add-item"
        @click="addItem"
      >
        添加
      </div>
    </gc-model>

    <!-- 录入学员dialog -->
    <gc-model
      title="录入学员"
      :visible="inputStudentVisible"
      width="800px"
      @close="inputStudentClose"
      class="NonTrainingCourse__input-student"
      @cancel="inputStudentVisible = false"
      @comfirm="inputStudentComfirm"
    >
      <div class="NonTrainingCourse__input-student__title icons">
        <span class="icons__add" @click="openAddStudentVisibleDialog">
          <i class="icons__add__icon"></i>
          添加学员
        </span>
        <span class="icons__del" @click="fakeDel">
          <i class="icons__del__icon"></i>
          全部删除
        </span>
      </div>
      <div class="NonTrainingCourse__input-student__content">
        <gc-table
          :list="inputStudentList"
          :tableList="inputStudentTable"
          :stripe="false"
          :vLoading="tableVLoading"
          class="general__table"
        >
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="active" @click="delStudent(scope.row)">删除</span>
            </template>
          </el-table-column>
        </gc-table>
        <gc-pagination
          :total="inputStudentForm.total"
          layout="prev, pager, next,slot, sizes"
          prev-text=""
          next-text=""
          :page-sizes="[10]"
          :page-size="inputStudentForm.pageSize"
          :current-page="inputStudentForm.currPage"
          @sizeChange="
            sizeChange($event, inputStudentForm, getInputStudentTableList)
          "
          @currentChange="
            currentChange($event, inputStudentForm, getInputStudentTableList)
          "
        ></gc-pagination>
      </div>
    </gc-model>

    <!-- 添加学员 dialog -->
    <gc-model
      title="添加学员"
      :visible="addStudentVisible"
      width="800px"
      @close="handleAddStudentCancel"
      class="NonTrainingCourse__add-student"
      @cancel="addStudentVisible = false"
      @comfirm="handleAddStudentConfirm"
    >
      <div class="NonTrainingCourse__add-student__title">
        <div class="NonTrainingCourse__add-student__title__left">人员库</div>
        <div class="NonTrainingCourse__add-student__title__right">人员库</div>
      </div>
      <div class="NonTrainingCourse__add-student__content">
        <div class="NonTrainingCourse__add-student__content__source">
          <el-input
            type="textarea"
            placeholder="请输入员工UM号，一行一条"
            v-model="addStudentInfo.textarea"
          />
          <div
            class="NonTrainingCourse__add-student__content__source__error"
            v-show="addStudentInfo.isShow"
          >
            <i
              class="
                NonTrainingCourse__add-student__content__source__error__icon
                el-icon-warning
              "
            ></i>
            以上编号错误或不存在
          </div>
        </div>

        <div class="NonTrainingCourse__add-student__content__buttons">
          <div
            class="NonTrainingCourse__add-student__content__buttons__add"
            @click="handleAddStudent"
          >
            添加
            <i class="el-icon-arrow-right"></i>
          </div>
          <div
            class="NonTrainingCourse__add-student__content__buttons__del"
            @click="fakeDelStudent"
          >
            <i class="el-icon-arrow-left"></i>
            删除
          </div>
        </div>
        <div class="NonTrainingCourse__add-student__content__destination">
          <div
            class="NonTrainingCourse__add-student__content__destination__items"
          >
            <div
              class="
                NonTrainingCourse__add-student__content__destination__items__item
              "
              :class="{
                'active-no-pointer': addStudentInfo.selectedList.includes(item)
              }"
              v-for="item in addStudentInfo.studentList"
              :key="item.umId"
              @click="handleStudentClick(item)"
            >
              {{ item.empName }}（{{ item.umId }}）
            </div>
          </div>
        </div>
      </div>
    </gc-model>

    <!-- 上传文件dialog -->
    <gc-model
      title="上传文件"
      :visible="uploadFileVisible"
      width="500px"
      @close="
        uploadFileVisible = false
        commonUploadFileInfo = {}
      "
      class="NonTrainingCourse__upload-file"
      @cancel="uploadFileVisible = false"
      @comfirm="uploadFileComfirm"
    >
      <div class="NonTrainingCourse__upload-file__title icons">
        <span class="icons__download" @click="commonTemplateDownload('advice')">
          <i class="icons__download__icon"></i>
          建议书模版下载
        </span>
        <span class="icons__download" @click="commonTemplateDownload('plan')">
          <i class="icons__download__icon"></i>
          培训书模版下载
        </span>
      </div>
      <div class="NonTrainingCourse__upload-file__content">
        <ul class="NonTrainingCourse__upload-file__content__items">
          <li class="NonTrainingCourse__upload-file__content__items__item">
            <div
              class="NonTrainingCourse__upload-file__content__items__item__left"
            >
              合理化建议书
            </div>
            <div
              class="
                NonTrainingCourse__upload-file__content__items__item__right
                icons
              "
            >
              <div
                v-show="!!uploadFileTemplateInfo.advice.name"
                class="
                  NonTrainingCourse__upload-file__content__items__item__right__box
                "
              >
                <a
                  class="
                    NonTrainingCourse__upload-file__content__items__item__right__href
                    ellipsis
                  "
                  id="NonTrainingCourse-upload-file-download-tag"
                  :download="uploadFileTemplateInfo.advice.name"
                  href=""
                >
                  {{ uploadFileTemplateInfo.advice.name }}
                </a>
                <span
                  class="icons__upload"
                  @click="openFileInput('NonTrainingCourse-upload-file')"
                >
                  <i class="icons__upload__icon"></i>
                </span>
              </div>

              <span
                class="icons__upload"
                @click="openFileInput('NonTrainingCourse-upload-file')"
                v-show="!uploadFileTemplateInfo.advice.name"
              >
                <i class="icons__upload__icon"></i>
                上传文件
              </span>
            </div>
            <input
              type="file"
              id="NonTrainingCourse-upload-file"
              accept=".doc,.docx"
              @change="
                commonHandleFileInputChange(
                  $event,
                  'NonTrainingCourse-upload-file-download-tag',
                  'advice'
                )
              "
            />
          </li>
          <li class="NonTrainingCourse__upload-file__content__items__item">
            <div
              class="NonTrainingCourse__upload-file__content__items__item__left"
            >
              转培训班计划
            </div>

            <div
              class="
                NonTrainingCourse__upload-file__content__items__item__right
                icons
              "
            >
              <div
                v-show="uploadFileTemplateInfo.plan.name"
                class="
                  NonTrainingCourse__upload-file__content__items__item__right__box
                "
              >
                <a
                  class="
                    NonTrainingCourse__upload-file__content__items__item__right__href
                    ellipsis
                  "
                  id="NonTrainingCourse-upload-file-download-tag-plan"
                  :download="uploadFileTemplateInfo.plan.name"
                  href=""
                >
                  {{ uploadFileTemplateInfo.plan.name }}
                </a>
                <span
                  class="icons__upload"
                  @click="openFileInput('NonTrainingCourse-upload-file-plan')"
                >
                  <i class="icons__upload__icon"></i>
                </span>
              </div>

              <span
                class="icons__upload"
                @click="openFileInput('NonTrainingCourse-upload-file-plan')"
                v-show="!uploadFileTemplateInfo.plan.name"
              >
                <i class="icons__upload__icon"></i>
                上传文件
              </span>
            </div>
            <input
              type="file"
              id="NonTrainingCourse-upload-file-plan"
              accept=".doc,.docx"
              @change="
                commonHandleFileInputChange(
                  $event,
                  'NonTrainingCourse-upload-file-download-tag-plan',
                  'plan'
                )
              "
            />
          </li>
        </ul>
      </div>
    </gc-model>

    <!-- 上传知鸟课程上架EOA签报dialog -->
    <gc-model title="上传知鸟课程上架EOA签报" width="500px" class="zn-eoa-upload-file"
      :visible="uploadFileZnEOAVisible"
      @close="uploadFileZnEOAVisible = false"
      @cancel="uploadFileZnEOAVisible = false"
      @comfirm="uploadZnEoaComfirm">
      <ul>
        <li>
          <div class="left">知鸟课程上架EOA签报 </div>
          <div class="right icons">
            <div v-show="!!uploadFileTemplateInfo.znEoa.name" class="right-box">
              <el-tooltip placement="top" popper-class="table-popper">
                <div slot="content" style="width: 300px">
                  <p class="mt5">{{ uploadFileTemplateInfo.znEoa.name }}</p>
                </div>
                <a class="right-href ellipsis" id="zn-eoa-input-file-download-tag"
                  :download="uploadFileTemplateInfo.znEoa.name" href="">
                  {{ uploadFileTemplateInfo.znEoa.name }}
                </a>
              </el-tooltip>
              <span class="icons__upload" @click="openFileInput('zn-eoa-input-file')">
                <i class="icons__upload__icon"></i>
              </span>
            </div>

            <span class="icons__upload" @click="openFileInput('zn-eoa-input-file')" v-show="!uploadFileTemplateInfo.znEoa.name" >
              <i class="icons__upload__icon"></i>
              上传文件
            </span>
          </div>
          <input type="file" id="zn-eoa-input-file"
            @change="commonHandleFileInputChange($event, 'zn-eoa-input-file-download-tag', 'znEoa' )"
          />
        </li>
      </ul>
    </gc-model>

    <!-- 上传考试文件信息 dialog -->
    <gc-model
      title="上传考试文件信息"
      :visible="uploadExaminationFileVisible"
      width="500px"
      @close="uploadExaminationFileVisible = false"
      class="NonTrainingCourse__upload-file"
      @cancel="
        uploadExaminationFileVisible = false
        commonUploadFileInfo = {}
      "
      @comfirm="uploadExaminationComfirm"
    >
      <div
        class="NonTrainingCourse__upload-file__title icons"
        @click="openFileInput('NonTrainingCourse-upload-file-examination')"
      >
        <input
          type="file"
          id="NonTrainingCourse-upload-file-examination"
          @change="
            commonHandleFileInputChange(
              $event,
              'NonTrainingCourse-examination-file-download-tag'
            )
          "
          accept=".xlsx"
        />
        <span class="icons__upload">
          <i class="icons__upload__icon"></i>
          上传文件
        </span>
      </div>
      <div class="NonTrainingCourse__upload-file__content">
        <ul class="NonTrainingCourse__upload-file__content__items">
          <li class="NonTrainingCourse__upload-file__content__items__item">
            <div
              class="NonTrainingCourse__upload-file__content__items__item__left"
            >
              考试文件信息
            </div>
            <div
              class="
                NonTrainingCourse__upload-file__content__items__item__right
                icons
              "
            >
              <a
                :download="commonUploadFileInfo.name"
                href=""
                class="active"
                id="NonTrainingCourse-examination-file-download-tag"
                >{{ commonUploadFileInfo.name }}</a
              >
            </div>
          </li>
        </ul>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { CopyObj, formatDate } from '../../plugins/until'
import { 
  fetchSelectAdvancePay,
  fetchSelectFastAdvancePay,
  API_SELECT_FAST_CLASSES_INFO,
  fetchInitSelectClassesInfo,
  fetchSelectUploadFileInfo
} from '@/fetch/reimbursement'
import {
  isIE,
  jsonHeaders,
  message,
  customHint,
  downloadFile,
  sizeChange,
  handleExport,
  currentChange,
  uploadFile,
  openFileInput,
  localDownload,
  handleUdmpHref,
  downloadFileAsAlink,
  addAllowKeepAlive
} from '../../util/utils'
import { fileDownload } from '@/util/udmp'
import $ from 'jquery'
export default {
  name: 'NonTrainingCourse',
  data() {
    return {
      // 录入资料查看 dialog 状态
      dataSeeVisible: false,
      // 参数对象
      queryForm: {
        //培训班类型; 1: 培训班 2:非培训班
        classType: '01002',
        //项目编号
        classId: '',
        //项目名称
        className: '',
        //班主任(UM号或中文名)
        classAdviser: '',
        //项目日期--开始日期, 格式: yyyy-MM-dd
        startTime: '',
        //项目日期--结束日期, 格式: yyyy-MM-dd
        endTime: '',
        //费用类型
        expenseType: '',
        //培训班状态
        classStatus: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        line: ''
      },
      //总条数
      total: 0,
      //培训班数据列表
      tableList: [],
      //培训班数据列表 加载状态
      tableVLoading: false,
      //培训班 table字段列表
      list: [
        {
          type: 'index',
          width: '64',
          label: '序号'
        },
        {
          prop: 'className',
          value: '项目名称',
          label: '项目名称',
          width: '200'
        },
        {
          prop: 'classId',
          value: '项目编号',
          width: '103',
          label: '项目编号'
        }
      ],
      // 培训班 类型
      classesTypeList: [],
      //费用类型
      moneyStateList: [
        {
          value: 'N',
          label: '举办费用'
        },
        {
          value: 'Y',
          label: '分摊费用'
        }
      ],
      //培训班状态
      trainingStateList: [
        {
          value: '02003',
          label: '已结训'
        },
        {
          value: '02002',
          label: '进行中'
        }
      ],
      // 开始事件限制
      startPickerOptions: {
        disabledDate: (time) => {
          if (this.queryForm.endTime) {
            return !(formatDate(time) <= this.queryForm.endTime)
          }
          return false
        }
      },
      //结束时间限制
      endPickerOptions: {
        disabledDate: (time) => !(formatDate(time) >= this.queryForm.startTime)
      },
      // 录入知鸟直播号 dialog 状态
      inputDirectSeedingVisible: false,
      // 录入知鸟直播号 dialog 立项附件 录入资料
      inputDirectSeedingData: {},
      // 录入知鸟直播号 table数据数组
      inputDirectSeedingTable: [],
      // 上传文件 dialog 状态
      uploadFileVisible: false,
      // 上传文件 dialog 模版下载存储对象
      uploadFileTemplateInfo: {
        advice: {},
        plan: {},
        znEoa: {}
      },
      // 知鸟课程EOA dialog 状态
      uploadFileZnEOAVisible: false,
      // 录入学员 dialog 状态
      inputStudentVisible: false,
      // 录入学员 table字段列表
      inputStudentList: [
        {
          label: '姓名',
          width: '272',
          value: '姓名',
          prop: 'empName'
        },
        {
          prop: 'umId',
          label: 'UM号',
          value: 'UM号',
          width: '360'
        }
      ],
      // 录入学员 table 数据列表
      inputStudentTable: [],
      // 录入学员 dialog form
      inputStudentForm: {
        classId: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      // 添加学员 dialog 状态
      addStudentVisible: false,
      // 添加学员 数据信息
      addStudentInfo: {
        textarea: '',
        studentList: [],
        selectedList: [],
        isShow: false
      },
      // 操作 映射 对象
      operationMaping: { before: [], after: [] },
      // 二级分类 options
      uploadOptions: {
        advice: '建议书',
        plan: '计划书',
        exam: '考试信息'
      },
      // pagesize 改变的回掉 公共 函数
      sizeChange,
      // 分页 的页码改变 回掉 公共 函数
      currentChange,
      openFileInput,
      // 上传考试文件信息 dialog 状态
      uploadExaminationFileVisible: false,
      // 上传考试文件信息 上传文件 公共 file 对象
      commonUploadFileInfo: {},
      // 是否需要刷新
      isRefresh: false,
      // 录入只鸟直播dialog title
      dataSeeTitle: '录入知鸟直播号',
      // 录入资料小标题映射
      inputDataMaping: {
        '05008': '知鸟直播号',
        '05011': '知鸟考试编号',
        '05009': '智能通关编号'
      },
      // 当前操作行 的数据对象
      row: {},
      lineOptions: [
        {
          label: '零售',
          value: 'LS'
        },
        {
          label: '非零',
          value: 'FL'
        }
      ],
      handleExport,
      fetchSelectAdvancePay,
      fetchSelectFastAdvancePay,
      API_SELECT_FAST_CLASSES_INFO,
      fetchInitSelectClassesInfo
    }
  },
  methods: {
    //跳转
    goPath(path) {
      this.$router.push({ path })
    },
    getData() {
      let data = CopyObj(this.queryForm)
      data.line = data.line || this.$store.state.userInfo.blgStripLine || 'LS'
      Object.keys(data).forEach((e) => {
        if (!data[e]) {
          delete data[e]
        }
      })
      data = { data }
      return data
    },
    //获取培训班列表
    getTableList() {
      const data = this.getData()
      this.$axios
        .post('/fn/reim/classes/selectReimClassesList', data, jsonHeaders)
        .then((res) => {
          this.tableVLoading = false
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.tableList = list
            this.total = total
          }
        })
        .finally(() => {
          this.isRefresh = false
        })
    },
    // 获取培训班列表
    query() {
      this.queryForm.currPage = 1
      this.getTableList()
    },
    // 重置查询参数
    reset() {
      Object.keys(this.queryForm).forEach((e) => (this.queryForm[e] = ''))
      this.queryForm.line = this.$store.state.userInfo.blgStripLine
      this.queryForm.classType = '01002'
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getTableList()
      this.$refs.costTypeRef.$set()
      this.$refs.expenseNameRef.$set()
      this.$refs.classStatusNameRef.$set()
    },
    // 筛选 费用类型
    costTypeFilter(list, key) {
      list = list.list
      this.queryForm.currPage = 1
      this.queryForm[key] = list.length === 1 ? list[0] : ''
      this.getTableList()
    },
    //重置费用类型
    costTypeReset(key) {
      this.queryForm.currPage = 1
      this.queryForm[key] = ''
      this.getTableList()
    },
    // 筛选 培训班状态
    trainingStateFilter(list) {
      list = list.list
      this.queryForm.currPage = 1
      this.queryForm.classStatus = list.length === 1 ? list[0] : ''
      this.getTableList()
    },
    //重置培训班状态
    trainingStateReset() {
      this.queryForm.currPage = 1
      this.queryForm.classStatus = ''
      this.getTableList()
    },
    // 录入知鸟直播号 dialog 添加item触发事件
    addItem() {
      this.inputDirectSeedingTable.unshift({
        code: '',
        codeBeek: '',
        edit: true
      })
    },
    // 录入智能通关编号 录入知鸟直播 录入知鸟考试编号 公共函数
    reimLiveCommon(row, title) {
      const { classId } = row
      this.reimLiveCommon.classId = classId
      this.inputDirectSeedingTable = []
      this.$axios
        .post('/fn/reim/classes/selectReimLiveNo', { classId }, jsonHeaders)
        .then((res) => {
          let { code, data } = res.data
          if (code === 0) {
            data = data.map((v) => ({
              code: v,
              codeBeek: v,
              edit: false
            }))
            this.inputDirectSeedingTable = data
          }
        })
      this.dataSeeTitle = title
      this.inputDirectSeedingVisible = true
    },
    // 获取已添加的学员
    getInputStudentTableList() {
      const data = CopyObj(this.inputStudentForm)
      delete data.row
      this.$axios
        .post('/fn/reim/classes/selectStuByClassId', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.inputStudentTable = data.list
            this.inputStudentForm.total = data.total
          }
        })
    },
    // 打开录入学员
    openInputStudentDialog(row) {
      const { classId, classTypeTwo } = row
      this.inputStudentForm.classId = classId
      this.inputStudentForm.classTypeTwo = classTypeTwo
      this.inputStudentForm.row = row
      if (this.handleAddStudentConfirm.promise) {
        this.handleAddStudentConfirm.promise.finally(() => {
          this.getInputStudentTableList()
        })
      } else {
        this.getInputStudentTableList()
      }
      this.inputStudentVisible = true
    },
    // 生成动作映射
    genderOperationMaping() {
      this.operationMaping = {
        before: [
          {
            name: 'UPLOAD_STU',
            tagContent: '录入学员',
            action: this.openInputStudentDialog,
            className: 'operation__student'
          },
          {
            name: 'UPLOAD_MISSION_NUM',
            tagContent: '录入智能通关编号',
            action: this.reimLiveCommon,
            className: 'operation__mockingbird'
          },
          {
            name: 'UPLOAD_ZHINIAO_LIVE',
            tagContent: '录入知鸟直播号',
            action: this.reimLiveCommon,
            className: 'operation__mockingbird'
          },
          {
            name: 'UPLOAD_ZHINIAO_EXAM',
            tagContent: '录入知鸟考试编号',
            action: this.reimLiveCommon,
            className: 'operation__mockingbird'
          },
          {
            name: 'UPLOAD_EXAM_FILE',
            tagContent: '上传考试文件信息',
            action: (row) => {
              const { classId } = row
              this.commonUploadFileInfo = { name: '' }
              this.$axios
                .post(
                  '/fn/reim/classes/selectUploadFileInfo',
                  { classId },
                  jsonHeaders
                )
                .then((res) => {
                  const { code, data } = res.data
                  if (code === 0) {
                    const item = data.upload.find((v) => v.busiId === 'exam')
                    if (!item) return
                    this.commonUploadFileInfo.name = item.fileName
                    $('#NonTrainingCourse-examination-file-download-tag').href =
                      handleUdmpHref(item.udmpId)
                  }
                })
              this.uploadExaminationComfirm.classId = classId
              this.uploadExaminationFileVisible = true
            },
            className: 'operation__uploadData'
          },
          {
            name: 'UPLOAD_FILE',
            tagContent: '上传文件',
            action: (row) => {
              const { classId } = row
              this.uploadFileTemplateInfo.classId = classId
              this.$axios
                .post(
                  '/fn/reim/classes/selectUploadFileInfo',
                  { classId },
                  jsonHeaders
                )
                .then((res) => {
                  const { code, data } = res.data
                  if (code === 0) {
                    this.uploadFileTemplateInfo.template = data.template
                    data.upload.forEach((item) => {
                      if (item.busiId === 'advice') {
                        this.uploadFileTemplateInfo.advice.name = item.fileName
                        $('#NonTrainingCourse-upload-file-download-tag').href =
                          handleUdmpHref(item.udmpId)
                      } else if (item.busiId === 'plan') {
                        this.uploadFileTemplateInfo.plan.name = item.fileName
                        $(
                          '#NonTrainingCourse-upload-file-download-tag-plan'
                        ).href = handleUdmpHref(item.udmpId)
                      }
                    })
                  }
                })
              this.uploadFileTemplateInfo.plan = { name: '' }
              this.uploadFileTemplateInfo.advice = { name: '' }
              this.uploadFileVisible = true
            },
            className: 'operation__uploadData'
          },
          {
            name: 'UPLOAD_ZHINIAO_EOA',
            tagContent: '上传知鸟课程上架EOA签报',
            action: (row) => {
              const { classId } = row
              this.uploadFileTemplateInfo.classId = classId
              fetchSelectUploadFileInfo({ classId })
              .then(data => {
                this.uploadFileTemplateInfo.template = data.template
                data.upload.forEach((item) => {
                  if (item.busiId === 'znEoa') {
                    this.uploadFileTemplateInfo.znEoa.name = item.fileName
                    $('#zn-eoa-input-file-download-tag').href = handleUdmpHref(item.udmpId)
                  } 
                })
              })
              this.uploadFileTemplateInfo.znEoa = { name: '' }
              this.uploadFileZnEOAVisible = true
            },
            className: 'operation__uploadData'
          },
          {
            name: 'COMPLETE',
            tagContent: '完成',
            action: (row) => {
              const { classId } = row
              this.$axios
                .post(
                  '/fn/reim/classes/updateNonClassStatus',
                  {
                    classId,
                    line:
                      this.queryForm.line ||
                      this.$store.state.userInfo.blgStripLine
                  },
                  jsonHeaders
                )
                .then((res) => {
                  if (res.data.code === 0) {
                    this.getTableList()
                  }
                })
            },
            className: 'operation__accomplish'
          }
        ],
        after: [
          {
            name: 'UPLOAD_MISSION_NUM',
            tagContent: '录入智能通关编号',
            action: this.reimLiveCommon,
            className: 'operation__mockingbird'
          },
          {
            name: 'UPLOAD_ZHINIAO_LIVE',
            tagContent: '录入知鸟直播号',
            action: this.reimLiveCommon,
            className: 'operation__mockingbird'
          },
          {
            name: 'UPLOAD_ZHINIAO_EXAM',
            tagContent: '录入知鸟考试编号',
            action: this.reimLiveCommon,
            className: 'operation__mockingbird'
          },
          {
            name: 'UPLOAD_INFO_CHECK',
            tagContent: '录入资料查看',
            action: (row) => {
              const { classId } = row
              this.downloadStudent.classId = classId
              this.row = row
              this.$axios
                .post(
                  '/fn/reim/classes/selectUploadFileInfo',
                  { classId },
                  jsonHeaders
                )
                .then((res) => {
                  const { code, data } = res.data
                  if (code === 0) {
                    this.inputDirectSeedingData = {
                      ...data,
                      ...this.inputDirectSeedingData
                    }
                  }
                })
              this.$axios
                .post(
                  '/fn/reim/classes/selectReimLiveNo',
                  { classId },
                  jsonHeaders
                )
                .then((res) => {
                  const { code, data } = res.data
                  if (code === 0) {
                    this.$set(this.inputDirectSeedingData, 'reimLiveNo', data)
                  }
                })
              this.dataSeeVisible = true
            },
            className: 'operation__checkData'
          }
        ]
      }
    },
    // 根据 name 查找对象
    searchObj(name, state) {
      return this.operationMaping[state].find((v) => name === v.name)
    },
    // 获得动作列表
    getOperationList(row) {
      const state = row.classStatus === '02002' ? 'before' : 'after'
      const classTypeOpr = JSON.parse(row.classTypeOpr)
      const list = classTypeOpr[state]
        .map((v) => this.searchObj(v, state))
        .filter((v) => v)
      return list
    },
    // 录入学员 dialog comfirm 事件
    inputStudentComfirm() {
      if (this.inputStudentForm.callback) {
        this.inputStudentForm.flag = true
        this.inputStudentForm.callback().then((res) => {
          if (res) {
            this.getTableList()
          } else if (this.isRefresh) {
            this.getTableList()
          }
        })
      }
      this.inputStudentVisible = false
    },
    // 录入学员 dialog 关闭 事件
    inputStudentClose() {
      if (!this.inputStudentForm.flag && this.isRefresh) {
        this.getTableList()
      }
      this.inputStudentForm.callback && (this.inputStudentForm.callback = null)
      delete this.inputStudentForm.flag
      this.inputStudentVisible = false
    },
    // 验证只鸟直播号
    checkReimLive(row, index) {
      // 只有只鸟直播才需要较验
      if (this.dataSeeTitle !== '录入知鸟直播号') {
        const item = this.inputDirectSeedingTable[index]
        item.edit = false
        item.codeBeek = item.code
        return
      }
      const { code: liveNo } = row
      const classId = this.reimLiveCommon.classId
      this.$axios
        .post(
          '/fn/reim/classes/checkReimLiveNo',
          { liveNo, classId },
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            const item = this.inputDirectSeedingTable[index]
            item.edit = false
            item.codeBeek = item.code
          }
        })
    },
    // 录入只鸟 dialog 确定事件
    inputDirectSeedingConfirm() {
      const classId = this.reimLiveCommon.classId

      const noVerify = this.inputDirectSeedingTable.filter((v) => v.edit)
      if (noVerify.length > 0) {
        return this.$message.warning('请保存所有项')
      }
      const list = this.inputDirectSeedingTable
        .map((v) => {
          if (v.code && v.code === v.codeBeek) return v.code
        })
        .filter((v) => v !== undefined)
      this.$axios
        .post(
          '/fn/reim/classes/insertReimLiveNo',
          { classId, list },
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.inputDirectSeedingVisible = false
            this.getTableList()
          }
        })
    },
    // 下载学员
    downloadStudent() {
      const classId = this.downloadStudent.classId
      const url = `/tms-new/api/reim_export/stu/${classId}`
      if (isIE()) {
        window.location = url
        return
      }
      const a = document.createElement('a')
      $(a).css({ position: 'absolute', top: '-99999px', zIndex: -9999 })
      a.href = url
      a.click()
      $(a).remove()
    },
    async handleDownloadFile(row) {
      try {
        downloadFileAsAlink(await fileDownload(row.udmpId))
      } catch (error) {}
    },
    // 学员假删除
    fakeDel() {
      this.inputStudentForm.callback = this.delStudent
      this.inputStudentTable = []
      this.inputStudentForm.currPage = 1
      this.inputStudentForm.total = 0
    },
    // 删除学员
    delStudent(row) {
      let data = {}
      const { classId } = this.inputStudentForm
      if (row && row.umId) {
        this.isRefresh = true
        data = { classId, deleteAll: 'N', list: [row.umId] }
      } else {
        data = { classId, deleteAll: 'Y' }
      }
      return this.$axios
        .post('/fn/reim/classes/deleteNonClassStu', data, jsonHeaders)
        .then((res) => {
          if (res.data.code === 0) {
            if (row && row.umId) {
              this.inputStudentForm.currPage = 1
              this.getInputStudentTableList()
            } else {
              this.inputStudentTable = []
            }
            this.inputStudentForm.total = 0
            return true
          }
        })
    },
    // 打开添加学员dialog
    openAddStudentVisibleDialog() {
      this.inputStudentVisible = false
      this.$nextTick(() => {
        this.addStudentVisible = true
      })
    },
    // 添加人员
    handleAddStudent() {
      const { classId } = this.inputStudentForm
      const str = this.addStudentInfo.textarea.trim()
      const newLineChar =
        str.match(/[(\r\n)\r\n]+/) && str.match(/[(\r\n)\r\n]+/)[0]
      const list = str.split(/[(\r\n)\r\n]+/)
      this.$axios
        .post(
          '/fn/reim/classes/checkNonClassStu',
          { classId, list },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const umIdArr = this.addStudentInfo.studentList.map((v) => v.umId)

            this.addStudentInfo.studentList = [
              ...this.addStudentInfo.studentList,
              ...data.valid.filter((v) => !umIdArr.includes(v.umId))
            ]
            this.addStudentInfo.textarea = data.invalid.join(
              newLineChar || '\n'
            )
            if (data.invalid.length) {
              this.addStudentInfo.isShow = true
            } else {
              this.addStudentInfo.isShow = false
            }
            if (data.repeat.length) {
              this.$message('存在重复UM')
            }
          }
        })
    },
    // 删除已添加人员
    handleDelStudent(row) {
      const list = this.addStudentInfo.selectedList
      const { classId } = this.inputStudentForm
      this.$axios
        .post('/fn/reim/classes/deleteNonClassStu', {
          list,
          deleteAll: 'N',
          classId
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.addStudentInfo.studentList =
              this.addStudentInfo.studentList.filter((v) => !list.includes(v))
          }
        })
    },
    // 假删除已添加的学员
    fakeDelStudent() {
      const umIds = this.addStudentInfo.selectedList.map((v) => v.umId)
      this.addStudentInfo.studentList = this.addStudentInfo.studentList.filter(
        (v) => !umIds.includes(v.umId)
      )
    },
    // 点击选中人员
    handleStudentClick(item) {
      const index = this.addStudentInfo.selectedList.findIndex(
        (v) => v.umId === item.umId
      )
      if (index > -1) {
        this.addStudentInfo.selectedList.splice(index, 1)
      } else {
        this.addStudentInfo.selectedList.push(item)
      }
    },
    // 添加学员dialog 取消的处理事件
    handleAddStudentCancel() {
      this.addStudentInfo.textarea = ''
      this.addStudentInfo.selectedList = []
      this.addStudentInfo.studentList = []
      this.addStudentInfo.isShow = false
      this.addStudentVisible = false
      this.$nextTick(() => {
        this.openInputStudentDialog(this.inputStudentForm.row)
      })
    },
    // 添加学员dialog 确定 的处理事件
    handleAddStudentConfirm() {
      const { classId, classTypeTwo } = this.inputStudentForm
      const list = this.addStudentInfo.studentList
      this.handleAddStudentConfirm.promise = this.$axios
        .post(
          '/fn/reim/classes/insertNonClassStu',
          { classId, classTypeTwo, list },
          jsonHeaders
        )
        .then((res) => {
          if (res.data.code === 0 && list.length > 0) {
            this.isRefresh = true
          }
        })
      this.addStudentVisible = false
    },
    // 上传考试信息dialog 上传文件dialog file input change 公共事件函数
    commonHandleFileInputChange($event, id, key) {
      this.commonUploadFileInfo = $event.target.files[0] || {}
      localDownload(this.commonUploadFileInfo, document.getElementById(id))
      if (key) {
        this.uploadFileTemplateInfo[key] = this.commonUploadFileInfo
      }
    },
    // 上传考试信息dialog 确定事件
    uploadExaminationComfirm() {
      if (!this.commonUploadFileInfo.size) {
        return (this.uploadExaminationFileVisible = false)
      }
      const classId = this.uploadExaminationComfirm.classId
      uploadFile({
        classId,
        files: this.commonUploadFileInfo,
        isSave: 'Y'
      }).then((res) => {
        message('上传成功')
        this.getTableList()
      })
      this.uploadExaminationFileVisible = false
    },
    // 模版下载公共函数
    commonTemplateDownload(key) {
      const item = this.uploadFileTemplateInfo.template.find(
        (v) => v.busiId === key
      )
      const { udmpId, fileName } = item
      downloadFile(udmpId, fileName + '.doc')
    },
    // 上传考试信息dialog 确定事件
    uploadZnEoaComfirm() {
      const classId = this.uploadFileTemplateInfo.classId
      if (this.uploadFileTemplateInfo.znEoa.name && this.uploadFileTemplateInfo.znEoa.size) {
        uploadFile({
          classId,
          busiId: 'znEoa',
          files: this.uploadFileTemplateInfo.znEoa,
          isSave: 'Y'
        }).then((res) => {
          message('上传成功')
          this.getTableList()
        })
      }
      this.uploadFileZnEOAVisible = false
    },
    // 上传文件dialog 确定事件
    uploadFileComfirm() {
      delete this.uploadFileComfirm.flag
      const classId = this.uploadFileTemplateInfo.classId
      if (
        this.uploadFileTemplateInfo.advice.name &&
        this.uploadFileTemplateInfo.advice.size
      ) {
        uploadFile({
          classId,
          busiId: 'advice',
          files: this.uploadFileTemplateInfo.advice,
          isSave: 'Y'
        }).then((res) => {
          if (!this.uploadFileComfirm.flag) {
            this.uploadFileComfirm.flag = true
            this.getTableList()
            this.$message.success('上传成功')
          }
        })
      }
      if (
        this.uploadFileTemplateInfo.plan.name &&
        this.uploadFileTemplateInfo.plan.size
      ) {
        uploadFile({
          classId,
          busiId: 'plan',
          files: this.uploadFileTemplateInfo.plan,
          isSave: 'Y'
        }).then((res) => {
          if (!this.uploadFileComfirm.flag) {
            this.uploadFileComfirm.flag = true
            this.getTableList()
            this.$message.success('上传成功')
          }
        })
      }
      this.uploadFileVisible = false
    },
    //  发起报销处理函数
    launchReimbursement(row, url) {
      if (
        row.classStatusName !== '已结训' &&
        url === this.fetchInitSelectClassesInfo
      ) {
        return
      } else if (
        row.expenseName !== '举办费用' &&
        url === this.fetchSelectAdvancePay
      ) {
        return
      }
      // 判断是发起1.0还是2.0接口
      if(url === this.fetchInitSelectClassesInfo){
        url = this.API_SELECT_FAST_CLASSES_INFO
      } else if (url === this.fetchSelectAdvancePay) {
        url = this.fetchSelectFastAdvancePay
      }
      const {
        classId,
        expenseType,
        className,
        classAdviser,
        classAdviserName,
        reimDept,
        reimDeptName
      } = row
      customHint(
        `当前选择的申请部门：<span style="color: #fd6720">${reimDeptName}</span>
                    <br>请确认是否选择正确，避免报销被驳回！`,
        '请确认申请部门',
        '取消'
      ).then(() => {
        const line = row.line === '零售' ? 'LS' : 'FL'
        this.$axios
          .post(
            url,
            {
              classId,
              ifShare: expenseType,
              remiDept: reimDept,
              line
            },
            jsonHeaders
          )
          .then((res) => {
            const { code, data, msg } = res.data
            if (code === 0) {
              data.action = 'add'
              data.ifShare = expenseType
              data.reimClassType = '2'
              if (url === this.fetchInitSelectClassesInfo || url === this.API_SELECT_FAST_CLASSES_INFO) {
                data.reimType = 'PT'
              } else {
                data.reimType = 'YFK'
              }
              data.classAdviser = classAdviser
              data.classAdviserName = classAdviserName
              data.className = className
              data.row = row
              if (row.expenseName === '举办费用') {
                data.expenseDetails = data.expenseDetails.filter(
                  (v) => v.budgetAmt > 0
                )
              }
              addAllowKeepAlive('/LaunchReimbursement')
              data.line = line
              this.$router.push({
                name: '发起报销',
                params: data
              })
            } else if (code === 1003) {
              this.$alert('该立项预算金额为零，不可以发起报销', '通知', {
                confirmButtonText: '知道了',
                customClass: 'loginTimeout'
              })
            }
          })
      })
    },
    // 查询培训班状态
    getClassesType() {
      this.$axios.post('/fn/reim/classes/selectNonClassesType').then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          data.forEach((v) => {
            v.label = v.dataValue
            v.value = v.dataEncode
          })
          this.classesTypeList.push(...data)
        }
      })
    },
    // 删除只鸟直播号
    delOneItem(index) {
      if (this.inputDirectSeedingTable.length < 2) {
        return this.$message.warning('至少保留一个')
      }
      this.inputDirectSeedingTable.splice(index, 1)
    },
    cancelItem(row, index) {
      row.code = row.codeBeek
      row.edit = false
      if (row.code === '') {
        this.inputDirectSeedingTable.splice(index, 1)
      }
    }
  },
  created() {
    this.genderOperationMaping()
    this.getClassesType()
  },
  mounted() {
    // this.$el.querySelector(".el-table__empty-block").style.opacity = 0;
    // this.tableVLoading = true;

    const classId = this.$route.query.classId
    this.queryForm.line = this.$store.state.userInfo.blgStripLine
    if (classId) {
      this.queryForm.classId = classId
      this.query()
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
.NonTrainingCourse {
  &__table-card {
    .el-table .el-table__header-wrapper {
      overflow: hidden;
    }
    .el-table {
      th:last-child {
        &::before {
          display: none;
        }
      }
    }
  }

  &__table-card__operation {
    display: flex;
    .active {
      margin-right: 15px;
      color: #fd6720;
      cursor: pointer;
    }
    & > span {
      margin-right: 15px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &__enclosure,
  &__input-data {
    &__title {
      margin-bottom: 16px;
      font-size: 14px;
      &__menu {
        display: inline-block;
        width: 3px;
        height: 10px;
        margin-right: 11px;
        background-color: #fd6720;
      }
    }
    &__content {
      box-sizing: border-box;
      border: 1px solid #eaecf1;
      &__items {
        display: flex;
        flex-direction: column;
        &__item {
          display: flex;
          flex-grow: 1;
          height: 48px;
          border-bottom: 1px solid #eaecf1;
          &__left {
            width: 140px;
            padding-left: 20px;
            background-color: #f7f8fa;
            line-height: 48px;
          }
          &__right {
            display: flex;
            flex: 1;
            padding: 0 20px 0 30px;
            align-items: center;
            justify-content: space-between;

            &__left {
              &__text-icon {
                display: inline-block;
                width: 17px;
                height: 20px;
                margin-right: 11px;
                vertical-align: middle;
                background: url('../../assets/svg/putongwendang.svg') no-repeat
                  center;
              }
            }
            &__down-icon {
              width: 14px;
              height: 15px;
              background: url('../../assets/svg/xiazaiyingxiang.svg') no-repeat
                center;
              cursor: pointer;
            }
          }
          &:last-child {
            border-bottom: 0;
          }
        }
      }
    }
  }
  &__input-data__title {
    margin-top: 31px;
  }
  &__input-data__content {
    &__reimliveno {
      display: flex;
      &__left {
        display: flex;
        align-items: center;
      }
      &__right {
        flex: 1;
        li {
          padding-left: 20px;
          height: 48px;
          line-height: 48px;
        }
      }
    }
  }
  &__input-direct-seeding {
    &__table {
      border: 1px solid #eaecf1;
      td:first-of-type .cell,
      th:first-of-type .cell {
        margin-left: 20px;
        justify-content: flex-start;
      }
      .el-input {
        width: 200px;
      }
    }
    &__add-item {
      margin-top: 10px;
      border: 1px dashed #e2e3e6;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }
  }
  &__upload-file {
    &__content {
      margin-top: 20px;
      &__items {
        border: 1px solid #eaecf1;
        &__item {
          display: flex;
          height: 50px;
          border-bottom: 1px solid #eaecf1;
          line-height: 50px;
          &__left {
            width: 140px;
            text-align: center;
            background-color: #f7f8fa;
          }
          &__right {
            flex: 1;
            height: 50px;
            padding-left: 30px;
            &__box {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .icons__upload {
                position: relative;
                border-right: none;
                margin-right: 20px;
                &__icon {
                  position: absolute;
                  top: 0;
                  left: 0;
                }
              }
            }

            &__href {
              max-width: 200px;
              color: #4a90e2;
            }
          }
          &:last-child {
            border-bottom: 0 !important;
          }
        }
      }
    }
  }
  &__input-student {
    &__content {
      margin-top: 20px;
      .gc-table {
        td:first-of-type .cell,
        th:first-of-type .cell {
          margin-left: 20px;
          justify-content: flex-start;
        }
        .el-table__empty-block {
          &::after {
            content: '暂无记录';
          }
        }
      }
    }
  }
  &__add-student {
    &__title {
      margin-bottom: 15px;
      display: flex;
      &__right {
        margin-left: 400px;
      }
    }
    &__content {
      display: flex;
      height: 316px;
      &__source,
      &__destination {
        width: 316px;
        border: 1px solid #e2e3e6;
      }
      &__source {
        display: flex;
        padding: 10px;
        flex-direction: column;
        .el-textarea {
          flex: 1;
          textarea {
            height: 100%;
            padding: 0;
            border: none;
            resize: none;
            font-size: 12px;
            color: rgba($color: #000000, $alpha: 0.4);
          }
        }

        &__error {
          height: 16px;
          margin-bottom: 8px;
          &__icon {
            position: relative;
            top: 1px;
            font-size: 16px;
            color: #f56c6c;
          }
        }
      }
      &__buttons {
        width: 120px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &__add,
        &__del {
          position: relative;
          display: flex;
          width: 80px;
          height: 30px;
          padding: 6px 31px 6px 23px;
          border: 1px solid #e2e3e6;
          justify-content: space-between;
          i {
            position: absolute;
            line-height: 18px;
          }
          cursor: pointer;
        }
        &__add {
          margin-bottom: 30px;
          i {
            right: 17px;
            top: 7px;
          }
        }
        &__del {
          padding: 6px 22px 6px 32px;
          i {
            left: 19px;
            top: 6px;
          }
        }
      }
      &__destination {
        overflow-y: auto;
        &__items {
          &__item {
            height: 30px;
            padding: 6px 0 6px 10px;

            &:hover {
              background-color: rgba(234, 236, 241, 0.3);
            }
            cursor: default;
          }
        }
      }
    }
  }
}
.zn-eoa-upload-file {
  ul {
    border: 1px solid #eaecf1;
    li {
      display: flex;
      height: 50px;
      line-height: 50px;
      .left {
        width: 140px;
        text-align: center;
        background-color: #f7f8fa;
      }
      .right {
        flex: 1;
        height: 50px;
        padding-left: 30px;
      }
      .right-box {
        width: 100%;
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        align-items: center;
      }
      .right-href { max-width: 200px; color: #4a90e2; }
    }
  }
}
</style>