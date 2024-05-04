<template>
  <div class="LadderManagement__LadderInstructorAuthorization">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="讲师所属机构">
          <gc-institution :leftShow="false" :default-show="true" v-model="queryForm.orgIds" @setDataFinish="orgIdsFinish" :busiType="$store.state.userInfo.blgStripLine" ref="institutionRef">
          </gc-institution>
        </el-form-item>
        <el-form-item>
          <el-form-item label="讲师录入时间">
            <el-date-picker class="w-120" v-model="queryForm.startTime" type="date" placeholder="选择日期" :clearable="false" :picker-options="startPickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="mr10">
            <el-date-picker class="w-120" v-model="queryForm.endTime" type="date" placeholder="选择日期" :clearable="false" :picker-options="endPickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="讲师信息">
          <gc-input placeholder="请输入姓名/UM号" v-model.trim="queryForm.lecturerInfo"></gc-input>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary">查询</el-button>
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="add"><i class="instructor-icons__add__icon"></i>新增授权</span>
        <span class="instructor-icons__download" @click="heroImportVisible = true"><i class="instructor-icons__upload__icon"></i>批量授权</span>
        <span class="instructor-icons__del" @click="removeHandle"><i class="instructor-icons__del__icon"></i>删除讲师</span>
        <span class="instructor-icons__upload" @click="exportHandle"><i class="instructor-icons__download__icon"></i>导出表格</span>
        <span class="instructor-icons__upload" @click="exportHandleDetail"><i class="instructor-icons__download__icon"></i>导出授权明细</span>
      </div>
      <table-pagination :list="list" :tableList="tableList" @selection-change="selectionHandle" :queryForm="queryForm" :getList="getList" v-loading="tableLoading" ref="tablePagination">
        <el-table-column slot="teacherName" width="120px;" label="讲师姓名">
          <template slot-scope="scope">
            <span @click="showUmInfo(scope.row)" class="active">{{ scope.row.teacherName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <span class="active ml20" @click="openEdit(scope.row)">编辑</span>
            <span class="active ml20" v-if="scope.row.status==='0'" @click="freeze(scope.row,'冻结后，此讲师的所有授权将失效','确认冻结？')">冻结</span>
            <span class="active ml20" v-else @click="freeze(scope.row,'是否确定启用','提示')">启用</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 新增授权讲师 dialog -->
    <el-dialog :title="addModelTitle" :visible.sync="addVisible" width="1200px" @open="openAddModel">
      <div class="add_content">
        <div class="content_left">
          <el-form label-width="84px" ref="addFormRef" :model="addForm" :rules="addRules">
            <el-form-item label="UM号/姓名" prop="showUmId" :show-message="false">
              <el-dropdown trigger="click" ref="messageDrop" placement="bottom-start" style="width: 395px" @command="handleDropDownCLick" @visible-change="visibleChange">
                <div class="gc-approval-chain">
                  <el-input style="width: 395px" class="gc-approval-chain__input" placeholder="请输入姓名或UM号" v-model.trim="addForm.showUmId" @input="input">
                  </el-input>
                </div>
                <el-dropdown-menu slot="dropdown" style="width: 395px;" class="gc-approval-chain__drop-down">
                  <div v-show="loadingText" style="text-align: center;margin-top: 80px;color: #ccc;">{{loadingText}}</div>
                  <el-dropdown-item v-for="item in hintData" :key="item.teacherUm" :command="item" style="white-space: nowrap;overflow: hidden;-ms-text-overflow: ellipsis;text-overflow: ellipsis;">
                    <span>{{ item.teacherName }}</span>
                    <span>{{ item.teacherUm }}</span>&nbsp;&nbsp;
                    <span>{{ item.blgOrgName }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
            <el-form-item label="性别" prop="gender" :show-message="false">
              <el-input disabled v-model="addForm.gender" style="width: 395px"></el-input>
            </el-form-item>
            <el-form-item label="所属机构" prop="blgOrgName" :show-message="false">
              <el-input disabled v-model="addForm.blgOrgName" style="width: 395px"></el-input>
            </el-form-item>
            <el-form-item label="岗位" prop="postDesc" :show-message="false">
              <el-input disabled v-model="addForm.postDesc" style="width: 395px"></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input type="textarea" maxlength="500" resize="none" class="h-90" style="width: 395px;" v-model="addForm.teacherDesc"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="content_center"></div>
        <div class="content_right">
          <el-tabs v-model="activeName" @tab-click="navTabChangeHandle" class="nav-tab">
            <el-tab-pane label="新增授权" name="add">
              <el-form label-width="84px" ref="addCourseFormRef" :model="addCourseForm" :rules="addCourseRules">
                <el-form-item label="课程名称/ID">
                  <el-dropdown trigger="click" ref="messageCourseDrop" placement="bottom-start" style="width: 500px" @command="handleCourseCommand" @visible-change="visibleCourseChange">
                    <div class="gc-approval-chain">
                      <el-input style="width: 500px" class="gc-approval-chain__input" placeholder="请输入阶梯课程名称/ID进行查询" v-model.trim="addCourseForm.showCourseInfo" @input="inputCourseInfo">
                      </el-input>
                    </div>
                    <el-dropdown-menu slot="dropdown" style="width: 500px;" class="gc-approval-chain__drop-down">
                      <div v-show="loadingCourseText" style="text-align: center;margin-top: 80px;color: #ccc;">{{loadingCourseText}}</div>
                      <el-dropdown-item v-for="item in hintCourseData" :key="item.courseId" :command="item" style="white-space: nowrap;overflow: hidden;-ms-text-overflow: ellipsis;text-overflow: ellipsis;">
                        <span>{{ item.courseName }}</span>&nbsp;&nbsp;
                        <span>{{ item.courseId }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
                <div v-if="addCourseForm.courseId">
                  <el-form-item label="所属机构">
                    <el-input style="width:500px;" v-model="addCourseForm.orgName" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="课程来源">
                    <el-radio-group class="is-required-container" v-model="addCourseForm.courseMold" disabled>
                      <el-radio label="05002">内部</el-radio>
                      <el-radio label="05003">外部</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="适用对象" class="content_right__application">
                    <div v-for="(item,index) in addCourseForm.applicableTargetDTOList" :key="index" class="content_right__application__tag">
                      <el-input style="width:500px;" v-model="item.applicableTargetStr" disabled></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="课程标签">
                    <el-col style="width:500px;">
                      <div class="newAdd__tag-box">
                        <div class="newAdd__tag-box__wrapper">
                          <span class="newAdd__tag-box__item ml10" v-for="item in addCourseForm.ladderTagDTOList" :key="item.tagId">{{ item.tagName }}</span>
                        </div>
                      </div>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="课程介绍">
                    <el-input type="textarea" class="h-90" style="width: 500px;" resize="none" v-model="addCourseForm.courseDescribe" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="有效期" prop="authEndTime">
                    <el-date-picker class="w-120" v-model="addCourseForm.authStartTime" type="date" placeholder="选择日期" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                    <span class="mr10 ml10">至</span>
                    <el-date-picker class="w-120" v-model="addCourseForm.authEndTime" type="date" placeholder="选择日期" :clearable="false" :picker-options="gtNow" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </el-form-item>
                  <div class="tac">
                    <el-button class="button-w80-h30" @click="resetCourseInfo">重置</el-button>
                    <el-button class="button-w80-h30" type="primary" @click="submit">确认授权</el-button>
                  </div>
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="授权记录" name="report">
              <el-form class="ml10" :model="queryForm" inline>
                <el-form-item label="讲师所属机构">
                  <el-input style="width:300px;" placeholder="请输入课程名称/ID" v-model="addForm.courseInfo">
                    <i slot="suffix" class="page-input__search" @click="searchAddAuthorList"></i>
                  </el-input>
                </el-form-item>
              </el-form>
              <table-pagination style="width:650px;" height="350" class="ml10" :list="addAuthorList" :tableList="addAuthorTableList" :queryForm="addForm" :getList="queryAddAuthorList" ref="addAuthorListPagination">
                <el-table-column label="操作" width="90">
                  <template slot-scope="scope">
                    <span class="active" @click="addAuthorFreeze(scope.row)">取消授权</span>
                  </template>
                </el-table-column>
              </table-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 讲师信息 dialog -->
    <el-dialog title="讲师信息" :visible="umInfoVisible" width="1200px" isAppend @close="umInfoVisible = false" :isShowFooter="false">
      <div class="add_content">
        <div class="content_left">
          <el-form ref="showLadderFormRef" :model="umForm" label-width="84px">
            <el-form-item label="姓名">{{umForm.teacherName}}</el-form-item>
            <el-form-item label="UM">{{umForm.teacherUm}}</el-form-item>
            <el-form-item label="性别">{{umForm.gender}}</el-form-item>
            <el-form-item label="部门">{{umForm.blgOrgName}}</el-form-item>
            <el-form-item label="岗位">{{umForm.postDesc}}</el-form-item>
            <el-form-item label="授权课程数">{{umForm.authCount}}门</el-form-item>
            <el-form-item label="授课次数">{{umForm.kecturesCount}}次</el-form-item>
            <el-form-item label="讲师授课评分">{{umForm.score}}分</el-form-item>
            <el-form-item label="简介">
              <el-input type="textarea" maxlength="500" resize="none" class="h-90" style="width: 395px;" v-model="umForm.teacherDesc" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="content_center"></div>
        <div class="content_right">
          <el-tabs v-model="umInfoActiveName" class="nav-tab" @tab-click="umInfoChangeHandle">
            <el-tab-pane label="讲师授权记录" name="authorRecord">
              <el-form v-model="authorRecordForm" inline>
                <el-form-item label="课程信息">
                  <el-input style="width:300px;" class="inline-block" placeholder="请输入课程名称/ID" v-model="authorRecordForm.courseInfo">
                    <i slot="suffix" class="page-input__search" @click="searchAuthorRecord"></i>
                  </el-input>
                </el-form-item>
                <div class="fr mt10">
                  <span class="instructor-icons__upload" @click="exportAuthorRecordList"><i class="instructor-icons__download__icon"></i>导出表格</span>
                </div>
              </el-form>
              <table-pagination style="width:650px;" height="350" :list="authorRecordList" :tableList="authorRecordTableList" :queryForm="authorRecordForm" :getList="queryAuthorRecordList" ref="authorRecordPagination">
              </table-pagination>
            </el-tab-pane>
            <el-tab-pane label="讲师授课记录" name="teachingRechrd">
              <el-form v-model="teachingRechrdForm" inline>
                <el-form-item label="课程信息">
                  <el-input style="width:300px;" class="inline-block" placeholder="请输入课程名称/ID" v-model="teachingRechrdForm.courseInfo">
                    <i slot="suffix" class="page-input__search" @click="searchTeachingRechrd"></i>
                  </el-input>
                </el-form-item>
                <div class="fr mt10">
                  <span class="instructor-icons__upload" @click="exportTeachingRechrd"><i class="instructor-icons__download__icon"></i>导出表格</span>
                </div>
              </el-form>
              <table-pagination style="width:650px;" height="350" :list="teachingRechrdList" :tableList="teachingRechrdTableList" :queryForm="teachingRechrdForm" :getList="queryTeachingRechrd" ref="teachingRechrdPagination">
              </table-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 导入英雄名单 -->
    <InstructorBatchImport title="批量导入讲师" :visible.sync="heroImportVisible" @change="heroImportChange" @templateDownload="downloadAdapter({ templateCode: 'LADDER_LECTURER_INSTRUCTOR' })" @comfirm="heroImportComfirm" @close="heroImportClose">
      <div v-if="heroImportData.title">
        <p>
          {{ heroImportData.title }}
        </p>
        <p v-for="error in heroImportData.failStrList" :key="error" class="error-color">
          {{ error }}
        </p>
      </div>
    </InstructorBatchImport>
  </div>
</template>

<script>
import {
  fetchListUserByUmOrName,
  fetchListLadderLecturer,
  fetchListExportLadderLecturer,
  fetchUpdateLecturerStatus,
  fetchBatchCheckLecturers,
  fetchDeleteLecturerBatch,
  fetchBatchAddAuthLecturer,
  fetchListCourseByCourseInfo,
  fetchAddAuthLecturer,
  fetchListAuthRecord,
  fetchFindLecturerDetail,
  fetchDeleteAuth,
  fetchExportAllAuthRecord,
  fetchListGrantCourse,
  fetchExportListGrantCourse,
  fetchExportListAuthRecord
} from '@/fetch/ladderManagement'
import {
  gtNow,
  resetObj,
  filterObj,
  CopyObj,
  downloadAdapter,
  getCurrentTime
} from '@/util/utils'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  name: 'LadderInstructorAuthorization',
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      activeName: 'add',
      queryForm: {
        startTime: '',
        endTime: '',
        currPage: 1,
        pageSize: 10,
        total: 0,
        orgIds: []
      },
      list: [
        {
          type: 'selection'
        },
        { slot: 'teacherName', width: '146' },
        {
          width: '120',
          label: '讲师UM号',
          prop: 'teacherUm'
        },
        {
          width: '220',
          label: '讲师所在机构',
          prop: 'blgOrgName'
        },
        {
          width: '120',
          label: '录入时间',
          prop: 'createdDate'
        },
        {
          width: '146',
          label: '录入人',
          prop: 'createByName',
          formatter: row => `${row.createByName || ''}(${row.createdBy || ''})`
        },
        {
          width: '110',
          label: '授权课程数量',
          prop: 'authCount'
        }, 
        {
          width: '110',
          label: '授课次数',
          prop: 'kecturesCount'
        }, 
        {
          width: '110',
          label: '讲师评分',
          prop: 'score'
        }, 
        {
          width: '90',
          label: '讲师状态',
          prop: 'statusStr'
        }
      ],
      addAuthorTableList: [],
      addAuthorList: [
        {
          width: '230',
          label: '课程名称',
          prop: 'courseName'
        },
        {
          width: '120',
          label: '授权时间',
          prop: 'createdDate'
        },
        {
          width: '120',
          label: '授权开始日期',
          prop: 'authStartTime'
        },
        {
          width: '120',
          label: '授权截止日期',
          prop: 'authEndTime'
        },
        {
          width: '160',
          label: '操作人',
          prop: 'createdByName',
        },
        {
          width: '90',
          label: '授课次数',
          prop: 'kecturesCount'
        }
      ],
      tableLoading: false,
      tableList: [],
      tableSelectionRows: [],
      cacheOrgIds: [],
      addCourseForm: {
        authStartTime: getCurrentTime(),
        authEndTime: ''
      },
      addCourseRules: {
        authEndTime: [{ required: true, message: '请输入有效期' }]
      },
      addForm: {
        teacherDesc: '',
        currPage: 1,
        pageSize: 10
      },
      loadingCourseInfo: false,
      courseInfoList: [],
      addRules: {
        showUmId: [{ required: true }],
        gender: [{ required: true }],
        blgOrgName: [{ required: true }],
        postDesc: [{ required: true }]
      },
      addVisible: false,
      // 下拉提示防抖 定时器对象
      timer: null,
      courseTimer: null,
      loadingText: '',
      loadingCourseText: '',
      // 提示数据
      hintData: [],
      hintCourseData: [],
      heroImportVisible: false,
      downloadAdapter,
      heroImportData: {
        title: '',
        failStrList: [],
        failUsers: [],
        succeUsers: []
      },
      gtNow,
      umInfoVisible: false,
      umForm: {
        currPage: 1,
        pageSize: 10
      },
      umInfoActiveName: 'authorRecord',
      authorRecordForm: {
        currPage: 1,
        pageSize: 10
      },
      authorRecordList: [
        {
          width: '230',
          label: '课程名称',
          prop: 'courseName'
        },
        {
          width: '120',
          label: '授权时间',
          prop: 'createdDate'
        },
        {
          width: '120',
          label: '授权开始日期',
          prop: 'authStartTime'
        },
        {
          width: '120',
          label: '授权截止日期',
          prop: 'authEndTime'
        },
        {
          width: '160',
          label: '操作人',
          prop: 'createdByName',
        },
        {
          width: '90',
          label: '授课次数',
          prop: 'kecturesCount'
        }
      ],
      authorRecordTableList: [],
      teachingRechrdForm: {
        currPage: 1,
        pageSize: 10
      },
      teachingRechrdList: [
        {
          width: '226',
          label: '课程名称',
          prop: 'courseName'
        },
        {
          width: '120',
          label: '培训班编号',
          prop: 'classId'
        },
        {
          width: '226',
          label: '培训班名称',
          prop: 'className'
        },
        {
          width: '140',
          label: '授课日期',
          prop: 'kecturesDate'
        },
        {
          width: '90',
          label: '讲师评分',
          prop: 'teacherScore'
        }
      ],
      teachingRechrdTableList: [],
      addModelTitle: '新增授权讲师'
    }
  },
  methods: {
    openAddModel() {
      this.$refs.addFormRef?.clearValidate()
      this.$refs.addCourseFormRef?.clearValidate()
    },
    navTabChangeHandle() {
      if (this.activeName === 'report') {
        this.queryAddAuthorList()
      }
    },
    umInfoChangeHandle() {
      if (this.umInfoActiveName === 'teachingRechrd') {
        this.queryTeachingRechrd()
      }
    },
    addAuthorFreeze(row) {
      console.log('row', row)
      this.$alert(
        `是否确认取消<span style="color:#fec85d;">"${row.courseName}"</span>课程的授权`,
        '提示',
        {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout ladder_del_tip'
        }
      )
        .then(() => {
          fetchDeleteAuth({ id: row.id }).then(res => {
            if (res) {
              this.showMessage('操作成功', 'success')
              this.addForm.currPage = 1
              this.queryAddAuthorList()
              this.query()
            } else {
              this.$message.warning('操作失败')
            }
          })
        })
        .catch(() => {})
    },
    submit() {
      this.$refs.addCourseFormRef.validate(valied => {
        if (!valied) return
        if (!this.addForm.teacherUm) {
          this.$message.warning('请先填写讲师信息')
          return
        }
        let request = {
          teacherUm: this.addForm.teacherUm,
          blgOrg: this.addForm.blgOrg,
          courseId: this.addCourseForm.courseId,
          authStartTime: this.addCourseForm.authStartTime,
          authEndTime: this.addCourseForm.authEndTime,
          teacherDesc: this.addForm.teacherDesc
        }
        fetchAddAuthLecturer({ request: this._formatSendParams(request) }).then(
          res => {
            if (res) {
              this.$message.success('授权成功，已同步到授权记录中')
              this.resetCourseInfo()
              this.query()
            } else {
              this.$message.error('授权失败')
            }
          }
        )
      })
    },
    showUmInfo(row) {
      fetchFindLecturerDetail({ id: row.id }).then(res => {
        this._.merge(this.umForm, res)
        this.umInfoVisible = true
        this.umInfoActiveName = 'authorRecord'
        this.searchAuthorRecord()
      })
    },
    inputCourseInfo(val) {
      if (val) {
        this.$refs.messageCourseDrop.show()
        clearTimeout(this.timer)
        this.hintCourseData = []
        this.loadingCourseText = '加载中...'
        this.timer = setTimeout(() => {
          fetchListCourseByCourseInfo({
            info: val,
            teacherUm: this.addForm.teacherUm
          }).then(res => {
            if (this.addCourseForm.showCourseInfo) {
              this.hintCourseData = res || []
              console.log('this.hintCourseData', this.hintCourseData)
            }
            if (!this.hintCourseData.length) {
              this.loadingCourseText = '无数据'
            } else {
              this.loadingCourseText = ''
            }
          })
        }, 500)
      } else {
        this.hintCourseData = []
        this.addCourseForm = this.$options.data.call(this).addCourseForm
        this.loadingCourseText = ''
      }
    },
    handleCourseCommand(item) {
      this.addCourseForm.showCourseInfo = `${item.courseName}(${item.courseId})`
      this._.merge(this.addCourseForm, item)
    },
    input(val) {
      if (val) {
        this.$refs.messageDrop.show()
        clearTimeout(this.timer)
        this.hintData = []
        this.loadingText = '加载中...'
        this.timer = setTimeout(() => {
          fetchListUserByUmOrName({ umOrName: val }).then(res => {
            if (this.addForm.showUmId) {
              this.hintData = res || []
            }
            if (!this.hintData.length) {
              this.loadingText = '无数据'
            } else {
              this.loadingText = ''
            }
          })
        }, 500)
      } else {
        this.hintData = []
        this.addForm = this.$options.data.call(this).addForm
        this.loadingText = ''
      }
    },
    // 下拉框 点击事件
    handleDropDownCLick(item) {
      this.addForm.showUmId = `${item.teacherName}(${item.teacherUm})`
      this._.merge(this.addForm, item)
    },
    visibleCourseChange(bool) {
      if (!this.addCourseForm.showCourseInfo) {
        this.$refs.messageCourseDrop.hide()
      }
      if (!bool && !this.addCourseForm.courseId) {
        this.addCourseForm = this.$options.data.call(this).addCourseForm
      }
    },
    visibleChange(bool) {
      if (!this.addForm.showUmId) {
        this.$refs.messageDrop.hide()
      }
      if (!bool && !this.addForm.teacherUm) {
        this.addForm = this.$options.data.call(this).addForm
      }
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    freeze(row, title, tip) {
      this.$confirm(title, tip, {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      }).then(() => {
        fetchUpdateLecturerStatus({ id: row.id }).then(res => {
          if (res) {
            this.$message.success('操作成功')
            this.query()
          } else {
            this.$message.error('操作失败')
          }
        })
      })
    },
    add() {
      this.addVisible = true
      this.addModelTitle = '新增授权讲师'
      this.approvalValue = !this.approvalValue
      this.addForm = this.$options.data.call(this).addForm
      this.addCourseForm = this.$options.data.call(this).addCourseForm
      this.activeName = 'add'
    },
    openEdit(row) {
      this.addForm = this.$options.data.call(this).addForm
      this.addCourseForm = this.$options.data.call(this).addCourseForm
      this.addVisible = true
      this.addModelTitle = '编辑授权讲师'
      this._.merge(this.addForm, row)
      this.addForm.showUmId = `${row.teacherName}(${row.teacherUm})`
      this.activeName = 'report'
      this.queryAddAuthorList()
    },
    showMessage(tip = '', type = 'warning') {
      this.$message[type](tip)
    },
    // 删除操作
    async removeHandle() {
      if (!this._checkSelected()) return
      try {
        await this.removeTips()
        let ids = this.tableSelectionRows.map(item => item.id)
        let data = await fetchDeleteLecturerBatch({ ids })
        if (data) {
          this.showMessage('删除成功', 'success')
          this.getList()
        } else {
          this.$message.warning('删除失败')
        }
      } catch (error) {}
    },
    // 检测是否有选择了表
    _checkSelected() {
      !this.tableSelectionRows.length && this.showMessage('最少选择一行')
      return Boolean(this.tableSelectionRows.length)
    },
    selectionHandle(list) {
      this.tableSelectionRows = list
    },
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定删除选中项', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject()
          })
      })
    },
    // 格式化发送数据
    _formatSendParams(params) {
      let data = filterObj(params)
      data.orgId = data.orgIds?.[1]
      Reflect.deleteProperty(data, 'orgIds')
      return data
    },

    heroImportComfirm() {
      const heroList = this.heroImportData.succeUsers
      if (heroList?.length) {
        fetchBatchAddAuthLecturer({ request: heroList }).then(_ => {
          this.$message.success('批量导入成功')
          this.query()
        })
      }
      this.heroImportVisible = false
    },
    heroImportClose() {
      this.heroImportData = {}
      this.heroImportVisible = false
    },
    heroImportChange($event) {
      const file = $event.target.files[0]
      if (!file.name) {
        this.heroImportData = {}
        return
      }
      const parms = new FormData()
      parms.append('file', file)
      fetchBatchCheckLecturers(parms).then(res => {
        this.heroImportData = res
      })
    },
    reset() {
      resetObj(this.queryForm, {
        orgId: '',
        tip: 'list',
        startTime: '',
        endTime: '',
        lecturerInfo: '',
        currPage: 1,
        pageSize: 10,
        orgIds: this.cacheOrgIds
      })
      this.$refs.institutionRef.createTreeData()
      this.getList()
    },
    resetCourseInfo() {
      this.addCourseForm = this.$options.data.call(this).addCourseForm
      this.hintCourseData = []
      this.$refs.addCourseFormRef?.clearValidate()
    },
    getList() {
      this.tableLoading = true
      this.queryForm.tip = 'list'
      let data = this._formatSendParams(this.queryForm)
      fetchListLadderLecturer({ request: data })
      .then(res => {
        const { list, total } = res || {}
        this.tableList = list
        this.queryForm.total = total
      })
      .finally(() => {
        this.tableLoading = false
      })
    },
    orgIdsFinish() {
      this.cacheOrgIds = CopyObj(this.queryForm.orgIds)
      this.getList()
    },
    searchAddAuthorList() {
      this.addForm.currPage = 1
      this.queryAddAuthorList()
    },
    // 讲师-讲师授权列表
    queryAddAuthorList() {
      if (!this.addForm.teacherUm) {
        this.addAuthorTableList = []
        this.addForm.total = 0
        return
      }
      const request = {
        tip: 'list',
        teacherUm: this.addForm.teacherUm,
        courseInfo: this.addForm.courseInfo,
        currPage: this.addForm.currPage,
        pageSize: this.addForm.pageSize
      }
      fetchListAuthRecord({ request }).then(res => {
        const { list, total } = res || {}
        this.addAuthorTableList = list
        this.addForm.total = total
      })
    },
    searchAuthorRecord() {
      this.authorRecordForm.currPage = 1
      this.queryAuthorRecordList()
    },
    queryAuthorRecordList() {
      const request = {
        tip: 'list',
        teacherUm: this.umForm.teacherUm,
        courseInfo: this.authorRecordForm.courseInfo,
        currPage: this.authorRecordForm.currPage,
        pageSize: this.authorRecordForm.pageSize
      }
      fetchListAuthRecord({ request }).then(res => {
        const { list, total } = res || {}
        this.authorRecordTableList = list
        this.authorRecordForm.total = total
      })
    },
    searchTeachingRechrd() {
      this.teachingRechrdForm.currPage = 1
      this.queryTeachingRechrd()
    },
    queryTeachingRechrd() {
      const request = {
        tip: 'list',
        teacherUm: this.umForm.teacherUm,
        courseInfo: this.teachingRechrdForm.courseInfo,
        currPage: this.teachingRechrdForm.currPage,
        pageSize: this.teachingRechrdForm.pageSize
      }
      fetchListGrantCourse({ request }).then(res => {
        const { list, total } = res || {}
        this.teachingRechrdTableList = list
        this.teachingRechrdForm.total = total
      })
    },
    exportHandle() {
      let request = CopyObj(this.queryForm)
      request.tip = 'export'
      request = this._formatSendParams(request)
      fetchListExportLadderLecturer({ request })
    },
    exportHandleDetail() {
      let request = this._formatSendParams(this.queryForm)
      fetchExportAllAuthRecord({request})
    },
    exportAuthorRecordList() {
      const request = {
        tip: 'export',
        teacherUm: this.umForm.teacherUm,
        courseInfo: this.authorRecordForm.courseInfo,
        currPage: this.authorRecordForm.currPage,
        pageSize: this.authorRecordForm.pageSize
      }
      fetchExportListAuthRecord({ request })
    },
    exportTeachingRechrd() {
      const request = {
        tip: 'export',
        teacherUm: this.umForm.teacherUm,
        courseInfo: this.teachingRechrdForm.courseInfo,
        currPage: this.teachingRechrdForm.currPage,
        pageSize: this.teachingRechrdForm.pageSize
      }
      fetchExportListGrantCourse({ request })
    }
  }
}
</script>
<style lang="scss">
.LadderManagement__LadderInstructorAuthorization {
}
.newAdd {
  &__tag-box {
    min-height: 30px;
    padding-top: 4px;
    margin-bottom: -10px;
    border-top: 1px solid #e0e1e3;
    overflow: hidden;
    &__wrapper {
      position: relative;
      display: flex;
      min-height: 35px;
      top: -10px;
      padding-bottom: 4px;
      flex-wrap: wrap;
      border: 1px solid #e0e1e3;
      border-top: none;
    }
    &__item {
      margin-top: 10px;
      padding: 2px 10px;
      height: 20px;
      background-color: #f7f8fa;
      color: #424656;
      border-radius: 2px;
      line-height: 17px;
    }
  }
}
.add_content {
  display: -webkit-box;
}
.content_center {
  width: 1px;
  background-color: #dcdfe6;
  margin: 0 10px;
}
.content_right {
  margin-top: -20px;
  min-height: 519px;
  &__application {
    &__tag {
      margin-bottom: 10px;
    }
    &__tag:last-child {
      margin-bottom: 0px;
    }
  }
}
.ladder_del_tip.loginTimeout {
  height: auto !important;
}
</style>