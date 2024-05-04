<template>
  <div olabel="星级讲师区">
    <div class="LecturerManagement__Apply">
      <!-- 搜索card -->
      <div otitle="星级讲师-搜索">
        <el-card class="search-card LecturerManagement__Apply__search">
          <el-form ref="form" :model="queryForm" :inline="true">
            <el-form-item
              label="机构"
              class="LecturerManagement__Apply__search__select"
            >
              <gc-institution v-model="queryForm.busiType"> </gc-institution>
              <el-checkbox v-model="queryForm.isGotSubBranch"
                >含下属机构</el-checkbox
              >
            </el-form-item>
            <el-form-item label="申请时间" class="search-card__date mr10">
              <el-date-picker
                v-model="queryForm.dateStart"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                :picker-options="startPickerOptions"
                value-format="yyyy-MM-dd"
                popper-class="date-picker"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="至" class="search-card__date">
              <el-date-picker
                v-model="queryForm.dateEnd"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                :picker-options="endPickerOptions"
                value-format="yyyy-MM-dd"
                popper-class="date-picker"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <gc-input
                label="姓名"
                v-model="queryForm.teacherUm"
                placeholder="请输入姓名/UM号"
              ></gc-input>
            </el-form-item>
            <el-form-item
              label="积分年份"
              class="
                LecturerManagement__Apply__search__integral
                search-card__date
              "
            >
              <el-date-picker
                v-model="queryForm.year"
                type="year"
                placeholder="选择年份"
                :clearable="false"
                value-format="yyyy"
                popper-class="date-picker"
              >
              </el-date-picker>
            </el-form-item>
            <div class="search-card__button">
              <el-button @click="query" type="primary">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-form>
        </el-card>
      </div>
      <!-- 内容card -->
      <el-card class="LecturerManagement__Apply__content mt10">
        <div
          class="
            LecturerManagement__Apply__content__menu
            instructor-icons
            menu-right
          "
        >
          <div
            class="
              LecturerManagement__Apply__content__menu__instructor-application
            "
            @click="addInstructor"
          >
            <span class="instructor-icons__add">
              <i class="instructor-icons__add__icon"></i>
              讲师申请</span
            >
          </div>
          <div
            class="LecturerManagement__Apply__content__menu__batch-modification"
            @click="instructorApplyAllRemoveVisible = true"
          >
            <span class="instructor-icons__edit">
              <i class="instructor-icons__edit__icon"></i>
              批量修改</span
            >
          </div>
          <div
            class="LecturerManagement__Apply__content__menu__export"
            @click="handleExport"
          >
            <span class="instructor-icons__upload">
              <i class="instructor-icons__upload__icon"></i>
              导出</span
            >
          </div>
        </div>
        <gc-table
          :list="instructorList"
          :tableList="instructorTableList"
          class="LecturerManagement__Apply__content__table general__table"
        >
          <el-table-column min-width="92" label="姓名">
            <template slot-scope="scope">
              <span class="active" @click="row = CopyObj(scope.row)">{{
                scope.row.teacherName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="135" label="UM号" prop="teacherUm">
          </el-table-column>
          <el-table-column min-width="310" label="机构" prop="orgName">
          </el-table-column>
          <el-table-column min-width="300" label="岗位" prop="postDesc">
          </el-table-column>
          <el-table-column min-width="135" prop="rankDesc">
            <template slot="header">
              <gc-tablecolumnfilters
                label="讲师类型"
                ref="tablecolumnfiltersCate"
                className="table__screen__icon"
                :list="rankDescOptions"
                confirmText="确定"
                popperClass="circular m183"
                @filter="applyRankFilter"
                @reset="applyRankReset"
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>
          <el-table-column min-width="73" label="积分" prop="score">
          </el-table-column>
          <el-table-column min-width="95" prop="applyStatus">
            <template slot="header">
              <gc-tablecolumnfilters
                label="状态"
                ref="tablecolumnfilters"
                className="table__screen__icon"
                :list="expenseStatus"
                confirmText="确定"
                popperClass="circular"
                @filter="applyStatusFilter"
                @reset="applyStatusReset"
                radio
              >
              </gc-tablecolumnfilters>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="161">
            <template slot-scope="scope">
              <div class="">
                <span
                  class="active mr20"
                  @click="
                    commonOpenFun(scope.row, 'instructorApplyInfoVisible')
                  "
                >
                  <el-tooltip content="查看" popper-class="icon-popper">
                    <i class="operation__check"></i>
                  </el-tooltip>
                </span>
                <span
                  class="active mr20"
                  @click="
                    commonOpenFun(
                      scope.row,
                      'viaInstructorApplyInfoVisible',
                      'pass'
                    )
                  "
                >
                  <el-tooltip content="通过" popper-class="icon-popper">
                    <i class="operation__pass"></i>
                  </el-tooltip>
                </span>
                <span
                  class="active mr20"
                  @click="
                    commonOpenFun(
                      scope.row,
                      'returnInstructorApplyInfoVisible',
                      'back'
                    )
                  "
                >
                  <el-tooltip content="退回" popper-class="icon-popper">
                    <i class="operation__back"></i>
                  </el-tooltip>
                </span>
                <span class="active" @click="updateOpenFun(scope.row)">
                  <el-tooltip content="修改" popper-class="icon-popper">
                    <i class="operation__edit"></i>
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
          :page-sizes="[10, 20]"
          :page-size="queryForm.pageSize"
          :current-page="queryForm.currPage"
          @sizeChange="sizeChange($event, queryForm, getInstructorList)"
          @currentChange="currentChange($event, queryForm, getInstructorList)"
          class="between"
        >
          <span class="text">每页显示</span>
        </gc-pagination>
      </el-card>

      <!-- 讲师信息dialog -->
      <InstructorInfo :row="row" />

      <!-- 查看讲师申请信息 dialog -->
      <gc-model
        title="查看讲师申请信息"
        :visible="instructorApplyInfoVisible"
        :isShowFooter="false"
        width="1120px"
        @close="instructorApplyInfoVisible = false"
        class="
          LecturerManagement__Apply__instructor-apply-info
          LecturerManagement__common-dialog
        "
      >
        <div
          class="
            LecturerManagement__common-dialog__box
            LecturerManagement__Apply__instructor-apply-info__box
          "
        >
          <div
            class="LecturerManagement__Apply__instructor-apply-info__box__base"
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__base__title
              "
            >
              申请人基本信息
            </div>
            <ul
              class="
                LecturerManagement__Apply__instructor-info__box__base__user
                userinfo-items
              "
            >
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>姓</span>
                  <span>名</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>U</span>
                  <span>M</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherUm }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>PS</span>
                  <span>岗位</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.positionDesc }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>性</span>
                  <span>别</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.gender }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>入司时间</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.dateHire }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>部</span>
                  <span>门</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.orgName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>最高学历</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.eduDgr }}
                </div>
              </li>
            </ul>
          </div>
          <div
            class="
              LecturerManagement__Apply__instructor-apply-info__box__content
            "
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__title
              "
            >
              成为一星讲师申请说明
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__argument
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__title
                "
              >
                请您分享申请一星讲师的理由
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  v-model="instructorPersonInfo.selfEvaluation"
                  disabled
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__participation-course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__title
                "
              >
                您曾参与过哪些课程的授课
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  v-model="instructorPersonInfo.teacherExperience"
                  disabled
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__title
                "
              >
                您最擅长的课程有哪些
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  v-model="instructorPersonInfo.authorizationClass"
                  disabled
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div
          class="LecturerManagement__common-dialog"
          v-if="isShowApprovalInfo"
        >
          <div class="LecturerManagement__common-dialog__text">
            <div class="userinfo-items__item__left necessary">
              <span>意</span>
              <span>见</span>
            </div>
            <el-input
              type="textarea"
              show-word-limit
              resize="none"
              placeholder="请输入"
              disabled
              v-model="instructorPersonInfo.approvalInfo"
            ></el-input>
          </div>
        </div>
      </gc-model>

      <!-- 修改讲师申请信息 dialog -->
      <gc-model
        title="修改讲师申请信息"
        :visible="changeInstructorApplyInfoVisible"
        :isShowFooter="false"
        width="1120px"
        @close="changeInstructorApplyInfoVisible = false"
        class="
          LecturerManagement__Apply__instructor-apply-info
          LecturerManagement__common-dialog
          LecturerManagement__Apply__remove-instructor-apply-info
        "
      >
        <div
          class="
            LecturerManagement__common-dialog__box
            LecturerManagement__Apply__instructor-apply-info__box
            LecturerManagement__Apply__remove-instructor-apply-info__box
          "
        >
          <div
            class="LecturerManagement__Apply__instructor-apply-info__box__base"
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__base__title
              "
            >
              申请人基本信息
            </div>
            <ul
              class="
                LecturerManagement__Apply__instructor-info__box__base__user
                userinfo-items
              "
            >
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>姓</span>
                  <span>名</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>U</span>
                  <span>M</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherUm }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>PS</span>
                  <span>岗位</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.positionDesc }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>性</span>
                  <span>别</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.gender }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>入司时间</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.dateHire }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>部</span>
                  <span>门</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.orgName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>最高学历</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.eduDgr }}
                </div>
              </li>
            </ul>
          </div>
          <div
            class="
              LecturerManagement__Apply__instructor-apply-info__box__content
            "
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__title
              "
            >
              成为一星讲师申请说明
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__argument
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__title
                "
              >
                请您分享申请一星讲师的理由
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.selfEvaluation"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__participation-course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__title
                "
              >
                您曾参与过哪些课程的授课
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.teacherExperience"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__title
                "
              >
                您最擅长的课程有哪些
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.authorizationClass"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="LecturerManagement__common-dialog__btn">
          <el-button type="primary" @click="updateInstructorApplyInfoSubmit"
            >提交审批</el-button
          >
        </div>
      </gc-model>

      <!-- 通过讲师申请信息 dialog -->
      <gc-model
        title="通过讲师申请信息"
        :visible="viaInstructorApplyInfoVisible"
        :isShowFooter="false"
        width="1120px"
        @close="viaInstructorApplyInfoVisible = false"
        class="
          LecturerManagement__Apply__instructor-apply-info
          LecturerManagement__common-dialog
          LecturerManagement__Apply__via-instructor-apply-info
        "
      >
        <div
          class="
            LecturerManagement__common-dialog__box
            LecturerManagement__Apply__instructor-apply-info__box
            LecturerManagement__Apply__via-instructor-apply-info__box
          "
        >
          <div
            class="LecturerManagement__Apply__instructor-apply-info__box__base"
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__base__title
              "
            >
              申请人基本信息
            </div>
            <ul
              class="
                LecturerManagement__Apply__instructor-info__box__base__user
                userinfo-items
              "
            >
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>姓</span>
                  <span>名</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>U</span>
                  <span>M</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherUm }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>PS</span>
                  <span>岗位</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.positionDesc }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>性</span>
                  <span>别</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.gender }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>入司时间</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.dateHire }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>部</span>
                  <span>门</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.orgName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>最高学历</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.eduDgr }}
                </div>
              </li>
            </ul>
          </div>
          <div
            class="
              LecturerManagement__Apply__instructor-apply-info__box__content
            "
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__title
              "
            >
              成为一星讲师申请说明
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__argument
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__title
                "
              >
                请您分享申请一星讲师的理由
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.selfEvaluation"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__participation-course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__title
                "
              >
                您曾参与过哪些课程的授课
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.teacherExperience"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__title
                "
              >
                您最擅长的课程有哪些
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.authorizationClass"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="LecturerManagement__common-dialog">
          <div class="LecturerManagement__common-dialog__text">
            <div class="userinfo-items__item__left necessary">
              <span>意</span>
              <span>见</span>
            </div>
            <el-input
              type="textarea"
              show-word-limit
              resize="none"
              placeholder="请输入"
              maxlength="200"
              v-model="instructorPersonInfo.approvalInfo"
            ></el-input>
          </div>
          <div class="LecturerManagement__common-dialog__btn">
            <el-button type="primary" @click="approvalApplyInfoSubmit"
              >确认通过</el-button
            >
          </div>
        </div>
      </gc-model>

      <!-- 退回讲师申请信息 dialog -->
      <gc-model
        title="退回讲师申请信息"
        :visible="returnInstructorApplyInfoVisible"
        :isShowFooter="false"
        width="1120px"
        @close="returnInstructorApplyInfoVisible = false"
        class="
          LecturerManagement__Apply__instructor-apply-info
          LecturerManagement__common-dialog
          LecturerManagement__Apply__via-instructor-apply-info
        "
      >
        <div
          class="
            LecturerManagement__common-dialog__box
            LecturerManagement__Apply__instructor-apply-info__box
            LecturerManagement__Apply__via-instructor-apply-info__box
          "
        >
          <div
            class="LecturerManagement__Apply__instructor-apply-info__box__base"
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__base__title
              "
            >
              申请人基本信息
            </div>
            <ul
              class="
                LecturerManagement__Apply__instructor-info__box__base__user
                userinfo-items
              "
            >
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>姓</span>
                  <span>名</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>U</span>
                  <span>M</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherUm }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>PS</span>
                  <span>岗位</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.positionDesc }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>性</span>
                  <span>别</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.gender }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>入司时间</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.dateHire }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>部</span>
                  <span>门</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.orgName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>最高学历</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.eduDgr }}
                </div>
              </li>
            </ul>
          </div>
          <div
            class="
              LecturerManagement__Apply__instructor-apply-info__box__content
            "
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__title
              "
            >
              成为一星讲师申请说明
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__argument
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__title
                "
              >
                请您分享申请一星讲师的理由
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.selfEvaluation"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__participation-course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__title
                "
              >
                您曾参与过哪些课程的授课
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.teacherExperience"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__title
                "
              >
                您最擅长的课程有哪些
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.authorizationClass"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="LecturerManagement__common-dialog">
          <div class="LecturerManagement__common-dialog__text">
            <div class="userinfo-items__item__left necessary">
              <span>意</span>
              <span>见</span>
            </div>
            <el-input
              type="textarea"
              show-word-limit
              resize="none"
              placeholder="请输入"
              maxlength="200"
              v-model="instructorPersonInfo.approvalInfo"
            ></el-input>
          </div>
          <div class="LecturerManagement__common-dialog__btn">
            <el-button type="primary" @click="backInstructorApplyInfoSubmit"
              >确认退回</el-button
            >
          </div>
        </div>
      </gc-model>

      <!-- 申请讲师 dialog -->
      <gc-model
        title="申请讲师"
        :visible="applyInstructorVisible"
        :isShowFooter="false"
        width="1120px"
        @close="
          applyInstructorVisible = false
          applyInstructorDisabled = false
        "
        class="
          LecturerManagement__Apply__instructor-apply-info
          LecturerManagement__common-dialog
          LecturerManagement__Apply__remove-instructor-apply-info
        "
      >
        <div
          class="
            LecturerManagement__common-dialog__box
            LecturerManagement__Apply__instructor-apply-info__box
            LecturerManagement__Apply__remove-instructor-apply-info__box
          "
        >
          <div
            class="LecturerManagement__Apply__instructor-apply-info__box__base"
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__base__title
              "
            >
              申请人基本信息
            </div>
            <ul
              class="
                LecturerManagement__Apply__instructor-info__box__base__user
                userinfo-items
              "
            >
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>姓</span>
                  <span>名</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>U</span>
                  <span>M</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.teacherUm }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>PS</span>
                  <span>岗位</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.positionDesc }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>性</span>
                  <span>别</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.gender }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>入司时间</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.dateHire }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>部</span>
                  <span>门</span>
                </div>
                <div class="userinfo-items__item__right l22">
                  {{ instructorPersonInfo.orgName }}
                </div>
              </li>
              <li class="userinfo-items__item">
                <div class="userinfo-items__item__left">
                  <span>最高学历</span>
                </div>
                <div class="userinfo-items__item__right">
                  {{ instructorPersonInfo.eduDgr }}
                </div>
              </li>
            </ul>
          </div>
          <div
            class="
              LecturerManagement__Apply__instructor-apply-info__box__content
            "
          >
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__title
              "
            >
              成为一星讲师申请说明
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__argument
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__title
                  necessary
                "
              >
                请您分享申请一星讲师的理由
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__argument__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.selfEvaluation"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__participation-course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__title
                  necessary
                "
              >
                您曾参与过哪些课程的授课
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__participation-course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.teacherExperience"
                ></el-input>
              </div>
            </div>
            <div
              class="
                LecturerManagement__Apply__instructor-apply-info__box__content__course
              "
            >
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__title
                  necessary
                "
              >
                您最擅长的课程有哪些
              </div>
              <div
                class="
                  LecturerManagement__Apply__instructor-apply-info__box__content__course__text
                "
              >
                <el-input
                  type="textarea"
                  show-word-limit
                  resize="none"
                  placeholder="请输入"
                  maxlength="200"
                  v-model="instructorPersonInfo.authorizationClass"
                ></el-input>
              </div>
            </div>
          </div>
        </div>
        <div class="LecturerManagement__common-dialog__btn">
          <el-button
            type="primary"
            :disabled="applyInstructorDisabled"
            @click="addInstructorApplyInfoSubmit"
            >提交申请</el-button
          >
        </div>
      </gc-model>

      <!-- 讲师申请批量修改 dialog -->
      <InstructorBatchImport
        title="讲师申请批量修改"
        :visible="instructorApplyAllRemoveVisible"
        @cancel="instructorApplyAllRemoveVisible = false"
        @close="instructorApplyAllRemoveVisible = false"
        @comfirm="instructorApplyAllRemoveComfirm"
        @change="
          commonFileInputChange(
            $event,
            instructorApplyAllRemoveData,
            'fileData'
          )
        "
        @templateDownload="
          templateDownload('/common/teacherStat/starTeaTemplate')
        "
      />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import {
  formDownload,
  commonFileInputChange,
  jsonHeaders,
  downloadFile,
  handleBlob,
  message,
  dataHeaders,
  fileImportHint,
  templateDownload
} from '../../util/utils'
import { CopyObj } from '../../plugins/until'
import { handlePickerOptions } from '../../mixins/component'
import InstructorInfo from './components/InstructorInfo'
export default {
  name: 'InstructorApplication',
  components: { InstructorInfo },
  mixins: [handlePickerOptions],
  data() {
    return {
      // 分页总条数
      total: 0,
      // 查询表单
      queryForm: {
        // 是否零售  LS:零售   ，FL：非零
        busiType: [],
        // 机构id
        orgId: '',
        // 选择子机构标识
        isGotSubBranch: false,
        // 开始日期  格式: yyyy-MM-dd
        dateStart: '',
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: '',
        // 讲师umId
        teacherUm: '',
        //
        teacherName: '',
        // 讲师类型
        rank: '',
        // 申请状态，02000：未申请、02001：申请中、02002：已通过、02003：已退回
        status: '',
        // 年份
        year: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      // 限制日期起始选择
      startPickerOptions: {},
      // 限制日期结束选择
      endPickerOptions: {},
      // 讲师表格字段数组
      instructorList: [
        {
          type: 'index',
          width: '64',
          label: '序号'
        }
      ],
      // 讲师表格数据数组
      instructorTableList: [],
      // 讲师类型options
      rankDescOptions: [
        {
          label: '一星级培训师',
          value: '02002001'
        },
        {
          label: '二星级培训师',
          value: '02002002'
        },
        {
          label: '三星级培训师',
          value: '02002003'
        },
        {
          label: '四星级培训师',
          value: '02002004'
        },
        {
          label: '五星级培训师',
          value: '02002005'
        },
        {
          label: '六星级培训师',
          value: '02002006'
        },
        {
          label: '储备培训师',
          value: '02001001'
        },
        {
          label: '培训管理师',
          value: '02003001'
        },
        {
          label: '特聘培训师',
          value: '02004001'
        }
      ],
      // 讲师状态options
      expenseStatus: [
        {
          label: '未申请',
          value: '02000'
        },
        {
          label: '申请中',
          value: '02001'
        },
        {
          label: '已通过',
          value: '02002'
        },
        {
          label: '已退回',
          value: '02003'
        }
      ],
      // 讲师个人信息
      instructorPersonInfo: {},
      //  查看讲师申请信息 dialog 状态
      instructorApplyInfoVisible: false,
      //  修改讲师申请信息 dialog 状态
      changeInstructorApplyInfoVisible: false,
      //  通过讲师申请信息 dialog 状态
      viaInstructorApplyInfoVisible: false,
      //  退回讲师申请信息 dialog 状态
      returnInstructorApplyInfoVisible: false,
      // 申请讲师 dialog 状态
      applyInstructorVisible: false,
      // 申请讲师 button 禁用状态
      applyInstructorDisabled: false,
      // 讲师申请批量修改 dialog 状态
      instructorApplyAllRemoveVisible: false,
      // 讲师申请批量修改 dialog 数据存放对象
      instructorApplyAllRemoveData: {},
      // 讲师授课记录查询 讲师授权记录查询 讲师评聘记录查询 讲师奖惩记录查询 url映射对象
      instructorInfoMapping: {
        TeaCourseList: 'lectureRecord',
        TeaPowerList: 'authorizationRecord',
        PromoteList: 'evaluationRecord',
        RewAndPuList: 'rewardPunishmentRecord'
      },
      //
      commonFileInputChange,
      // 讲师个人信息 组件 传递的 row 对象
      row: {},
      CopyObj,
      // 当前操作对应的行数据
      currRowData: {},
      // 修改，退回，通过 秘钥
      msg: '',
      templateDownload,
      // 查看讲师申请信息 是否显示意见
      isShowApprovalInfo: false
    }
  },
  methods: {
    // 星级讲师申请 查询
    query() {
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 重置
    reset() {
      Object.keys(this.queryForm).forEach((key) => {
        this.queryForm[key] = ''
      })
      this.queryForm.busiType = []
      this.queryForm.status = ''
      this.queryForm.isGotSubBranch = false
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.queryForm.year = '2020'
      this.getInstructorList()
      this.$refs.tablecolumnfilters.$reset()
    },
    // pagesize 改变的回掉 公共 函数
    sizeChange(size, form, callback, args) {
      form.pageSize = size.pageSize
      if (args) {
        callback(args)
      } else {
        callback()
      }
    },
    // 分页 的页码改变 回掉 公共 函数
    currentChange(curpage, form, callback, args) {
      form.currPage = curpage.pageNum
      if (args) {
        callback(args)
      } else {
        callback()
      }
    },
    // 申请状态 确定事件
    applyStatusFilter(list) {
      this.queryForm.status = list.list[0]
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 申请状态 重置事件
    applyStatusReset(list) {
      this.queryForm.status = ''
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 讲师类型 确定事件
    applyRankFilter(list) {
      this.queryForm.rank = list.list[0]
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 讲师类型 重置事件
    applyRankReset(list) {
      this.queryForm.rank = ''
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 积分未达到提示
    prompt() {
      this.$alert('您本年度讲师积分未达到35分，请继续努力哦！', '提示', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout`
      })
    },
    // 处理queryForm
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      if (data.busiType.length > 0) {
        if (data.busiType.length > 1) {
          data.orgId = data.busiType.slice(-1)[0]
          data.busiType = data.busiType[0]
        } else {
          data.busiType = data.busiType[0]
          data.orgId = ''
        }
      } else {
        data.busiType = this.$store.state.userInfo.blgStripLine
      }
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      return data
    },
    // 获取讲师 数据
    getInstructorList() {
      const data = this.getQueryForm()
      this.$axios
        .post(
          '/fn/teacher/applyStar/selectStarTeacherList',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorTableList = data.list
            this.total = parseInt(data.total) || 0
          }
        })
    },
    // 获取讲师个人信息
    getInstructorUserInfo(teacherUm, tips) {
      this.instructorPersonInfo = {}
      this.$axios
        .post('/fn/teacher/info/selectTeacherInfo', { teacherUm }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorPersonInfo = {
              ...this.instructorPersonInfo,
              ...data
            }
          }
        })
      if (tips === 'add') {
        return
      }
      this.$axios
        .post(
          '/fn/teacher/applyStar/searchApplyReason',
          { teacherUm, year: this.queryForm.year },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorPersonInfo = {
              ...this.instructorPersonInfo,
              ...data
            }
          }
        })
    },
    // 通过讲师申请信息  提交按钮
    approvalApplyInfoSubmit() {
      const { teacherUm, approvalInfo } = this.instructorPersonInfo
      if (!approvalInfo.trim()) return this.$message.warning('意见不能为空')
      const data = { teacherUm, approvalInfo: approvalInfo.trim() }
      if (this.queryForm.year) {
        data.year = this.queryForm.year
      }
      this.$axios
        .post('/fn/teacher/applyStar/approvalTeacherApply', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('通过成功')
            this.getInstructorList()
          }
        })
      this.viaInstructorApplyInfoVisible = false
    },
    // 退回讲师申请信息 提交按钮
    backInstructorApplyInfoSubmit() {
      const { teacherUm, approvalInfo } = this.instructorPersonInfo
      if (!approvalInfo.trim()) return this.$message.warning('意见不能为空')
      const data = { teacherUm, approvalInfo: approvalInfo.trim() }
      if (this.queryForm.year) {
        data.year = this.queryForm.year
      }
      this.$axios
        .post('/fn/teacher/applyStar/backTeacherApply', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('退回成功')
            this.getInstructorList()
          }
        })
      this.returnInstructorApplyInfoVisible = false
    },
    // 验证 讲师textarea内容
    checkInstructorTextarea(data) {
      if (!data.selfEvaluation || !data.selfEvaluation.trim()) {
        this.$message.warning('申请一星讲师的理由不能为空')
        return
      } else if (!data.teacherExperience || !data.teacherExperience.trim()) {
        this.$message.warning('参与过哪些课程的授课不能为空')
        return
      } else if (!data.authorizationClass || !data.authorizationClass.trim()) {
        this.$message.warning('擅长的课程不能为空')
        return
      }
      return true
    },
    // 申请讲师 提交按钮事件
    addInstructorApplyInfoSubmit() {
      let data = CopyObj(this.instructorPersonInfo)
      const { orgId } = this.currRowData
      data = { ...data, orgId }
      if (!this.checkInstructorTextarea(data)) return
      this.$axios
        .post('/fn/teacher/applyStar/saveStarTeacher', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success(data.msg)
            this.getInstructorList()
            this.applyInstructorVisible = false
          }
        })
    },
    // 修改讲师申请信息
    updateInstructorApplyInfoSubmit() {
      let data = CopyObj(this.instructorPersonInfo)
      if (!this.checkInstructorTextarea(data)) return
      if (this.queryForm.year) {
        data.year = this.queryForm.year
      }
      this.$axios
        .post('/fn/teacher/applyStar/updateTeacherApply', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success(data.msg)
            this.getInstructorList()
          }
        })
      this.changeInstructorApplyInfoVisible = false
    },
    // 批量修改dialog comfirm 事件
    instructorApplyAllRemoveComfirm() {
      const data = new FormData()
      data.append('file', this.instructorApplyAllRemoveData.fileData)
      this.$axios
        .post('/common/teacherStar/batchModifyApplyStatus', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            fileImportHint(data)
          }
        })
      this.instructorApplyAllRemoveVisible = false
    },
    // 通过 退回 公共打开函数
    commonOpenFun(row, diaKey, tips) {
      if (row.status === '02002' || row.status === '02003') {
        this.isShowApprovalInfo = true
      } else {
        this.isShowApprovalInfo = false
      }
      const { teacherUm, year } = row
      const data = { teacherUm, tips, year }
      if (this.queryForm.year) {
        data.year = this.queryForm.year
      }
      if (tips) {
        this.$axios
          .post(
            '/fn/teacher/applyStar/checkStarTeacherStatus',
            data,
            jsonHeaders
          )
          .then((res) => {
            if (res.data.code === 0) {
              this.getInstructorUserInfo(row.teacherUm, 'find')
              this.currRowData = row
              this[diaKey] = true
            }
          })
      } else {
        this.getInstructorUserInfo(row.teacherUm, 'find')
        this.currRowData = row
        this[diaKey] = true
      }
    },
    // 修改打开函数
    updateOpenFun(row) {
      const { teacherUm } = row
      const data = { teacherUm }
      if (this.queryForm.year) {
        data.year = this.queryForm.year
      }
      this.$axios
        .post(
          '/fn/teacher/applyStar/checkUpdateApplyStarTeacher',
          data,
          jsonHeaders
        )
        .then((res) => {
          if (res.data.code === 0) {
            this.getInstructorUserInfo(row.teacherUm, 'find')
            this.currRowData = row
            this.changeInstructorApplyInfoVisible = true
          }
        })
    },
    // 导出 文件
    handleExport() {
      const keys = [
        'busiType',
        'teacherUm',
        'dateStart',
        'dateEnd',
        'applyStatus',
        'year',
        'isGotSubBranch',
        'orgId',
        'status',
        'rank'
      ]
      const data = this.getQueryForm()
      Object.keys(data).forEach((key) => {
        if (!keys.includes(key)) {
          delete data[key]
        }
      })
      data.exclusiveOrgIds = ''
      // formDownload("/teacher/applyStar/exportStatTeacherExcel", data);
      this.$axios
        .post(
          '/fn/teacher/applyStar/exportStatTeacherExcel',
          { data },
          {
            ...jsonHeaders,
            responseType: 'blob'
          }
        )
        .then((res) => {
          if (res.data.type === 'application/json') {
            const reader = new FileReader()
            const that = this
            reader.onload = function (event) {
              var content = reader.result //内容就在这里
              that.$message.warning(JSON.parse(content).msg)
            }
            reader.readAsText(res.data)
          } else {
            handleBlob(res, '星级讲师详情列表.xls')
          }
        })
    },
    // 打开 讲师申请 dialog
    addInstructor() {
      const teacherUm = this.$store.state.userInfo.umId
      this.$axios
        .post('/fn/teacher/applyStar/checkApplyStarTeacher', jsonHeaders)
        .then((res) => {
          if (res.data.code === 0) {
            this.getInstructorUserInfo(teacherUm, 'add')
            this.applyInstructorVisible = true
            this.msg = res.data.data.msg
          }
        })
    },
    // 等待用户信息加载完成再获取数据
    delayGetData() {
      setTimeout(() => {
        if (this.$store.state.userInfo.blgStripLine) {
          this.getInstructorList()
        } else {
          this.delayGetData()
        }
      }, 100)
    }
  },
  mounted() {
    this.queryForm.year = '2020'
    this.delayGetData()
  }
}
</script>

<style lang="scss">
.LecturerManagement {
  &__Apply {
    &__search {
      &__select {
        .el-form-item__content {
          display: flex;
          float: right;
        }
        .el-checkbox {
          display: flex;
          margin-left: 15px;
          align-items: center;
        }
        .el-input {
          width: 200px;
        }
      }
    }

    &__instructor-apply-info {
      &__box {
        height: 504px;
        &__base {
          width: 322px;
          flex-shrink: 0;
          &__title {
            padding: 23px 0 0 20px;
            font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC',
              'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
          }
          .userinfo-items {
            padding-top: 20px;
          }
        }
        &__content {
          flex: 1;
          padding: 0 20px;
          border-left: 1px solid #eaecf1;
          &__title {
            padding-top: 20px;
            font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC',
              'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
          }
          &__argument,
          &__participation-course,
          &__course {
            &__title {
              padding-top: 20px;
            }
            &__text {
              padding-top: 10px;
              textarea {
                height: 100px;
                padding: 10px 0 0 10px;
              }
            }
          }
        }
      }
      .LecturerManagement__common-dialog__text {
        padding-bottom: 20px;
        border-top: 1px dashed #eaecf1;
      }
    }
    &__remove-instructor-apply-info {
      &__box {
        border-bottom: 1px solid #eaecf1;
      }
    }
    &__via-instructor-apply-info {
      &__box {
        border-bottom: 1px dashed #eaecf1;
      }
      &__bottom {
        padding: 20px;
        background-color: #fff;
        &__text {
          display: flex;
          .userinfo-items__item__left {
            position: relative;
            top: 10px;
          }
          textarea {
            height: 100px;
          }
        }
      }
    }

    .el-table .el-table__empty-block {
      height: 300px !important;
      line-height: 300px !important;
    }
  }
  &__common-dialog {
    &__box {
      display: flex;
      background-color: #fff;
      box-shadow: 0 2px 5px 0 rgba($color: #bcbcbc, $alpha: 0.08);
    }
    .el-dialog__header {
      box-shadow: 0 4px 10px 0 rgba($color: #424656, $alpha: 0.08);
    }
    .el-dialog__body {
      padding: 15px !important;
      background-color: #f5f6fb;
    }
    &__btn {
      display: flex;
      padding: 20px 0;
      background-color: #fff;
      justify-content: center;
      .el-button {
        width: 80px;
        height: 30px;
        padding: 6px 0;
        text-align: center;
      }
    }

    &__text {
      padding: 20px 20px 0;
      display: flex;
      background-color: #fff;

      .userinfo-items__item__left {
        position: relative;
        top: 10px;
      }
    }
    textarea {
      height: 100px;
      padding: 10px;
    }
  }
}
.userinfo-items {
  padding: 23px 0 0 20px;
  &__item {
    display: flex;
    line-height: 17px;
    margin-bottom: 20px;
    &__left {
      display: flex;
      width: 48px;
      margin-right: 15px;
      justify-content: space-between;
      flex-shrink: 0;
      &.l30 {
        line-height: 30px;
      }
      &.t10 {
        position: relative;
        top: 10px;
      }
      &.t8 {
        position: relative;
        top: 8px;
      }
    }
    &__right {
      width: 224px;
      color: #7d8292;
      &.l22 {
        position: relative;
        bottom: 3px;
        line-height: 22px;
      }
      &.p6 {
        textarea {
          height: 50px !important;
          padding: 6px 10px;
        }
      }
    }
  }
}
</style>