<template>
  <div class="LadderManagement__ScheduleManagmnet">
    <div v-show="showIndex === 0">
      <el-card class="search-card">
        <el-form ref="form" :model="queryForm" inline>
          <el-form-item label="所属机构">
            <gc-institution v-model="queryForm.orgIds" :busiType="$store.state.userInfo.blgStripLine" :left-show="false" :default-show="true" @setDataFinish="orgIdsFinish" ref="institutionRef">
            </gc-institution>
          </el-form-item>
          <el-form-item label="业务模块及关键岗位">
            <el-cascader style="width:200px;" popper-class="LadderManagement__ScheduleManagmnet__cascader" clearable v-model="queryForm.courseInfo" @change="channelTypesChange" :options="planOptions.channelTypes" :props="{
                label: 'dataValue',
                value: 'dataEncode',
                children: 'childPlanDict',
                checkStrictly: true
              }">
            </el-cascader>
          </el-form-item>
          <el-form-item label="培训系列及子系列">
            <el-cascader style="width:200px;" popper-class="LadderManagement__ScheduleManagmnet__cascader" clearable v-model="queryForm.trainingInfo" @change="trainingTypesChange" :options="planOptions.trainSeries" :props="{
                label: 'dataValue',
                value: 'dataEncode',
                children: 'childPlanDict',
                checkStrictly: true
              }">
            </el-cascader>
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
            <i class="instructor-icons__add__icon"></i>新增</span>
          <span class="instructor-icons__del" @click="handleDelete">
            <i class="instructor-icons__del__icon"></i>删除
          </span>
        </div>
        <table-pagination :list="dataList" :tableList="dataTableList" @selection-change="selectionHandle" :queryForm="queryForm" :getList="getLadderList" ref="tablePagination">
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <span class="active ml20" @click="openEditPage(scope.row)">编辑</span>
            </template>
          </el-table-column>
        </table-pagination>
      </el-card>
    </div>
    <!-- 新增 显示div -->
    <div v-show="showIndex === 1">
      <el-card class="LadderManagement__ScheduleManagmnet__add">
        <div class="form-wrap">
          <el-form :disabled="editDisable" ref="addFormRef" label-width="72px" :model="addForm" :rules="addFormRules">
            <el-form-item label="阶梯标准课表名称" style="margin-left:-50px;" label-width="122px" prop="scheduleTemplateName">
              <el-input v-model.trim="addForm.scheduleTemplateName" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="业务模块" required>
              <div class="between">
                <el-form-item prop="channelType">
                  <gc-select k="dataValue" v="dataEncode" class="padding-0 w-250" v-model="addForm.channelType" :options="planOptions.channelTypes" @change="channelTypeChange"></gc-select>
                </el-form-item>
                <el-form-item label="关键岗位" prop="keyJobs">
                  <gc-select k="dataValue" v="dataEncode" class="padding-0 w-250" v-model="addForm.keyJobs" :options="keyPositionOptions"></gc-select>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="培训系列" required>
              <div class="between">
                <el-form-item prop="trainSeries">
                  <gc-select k="dataValue" v="dataEncode" class="padding-0 w-250" v-model="addForm.trainSeries" :options="planOptions.trainSeries" @change="trainSeriesChange"></gc-select>
                </el-form-item>
                <el-form-item label="子系列" prop="childSeries">
                  <gc-select k="dataValue" v="dataEncode" class="padding-0 w-250" v-model="addForm.childSeries" :options="trainSeriesChildOptions"></gc-select>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="所属机构" required>
              <gc-institution :class="{'disable__institution': editDisable}" :disabled="editDisable" v-model="addForm.blgOrgs" :busiType="$store.state.userInfo.blgStripLine" :left-show="false" :default-show="false" @setDataFinish="orgIdsFinishAdd" ref="addInstitutionRef">
              </gc-institution>
            </el-form-item>
          </el-form>
        </div>
        <div class="train-table">
          <div class="train-table__title">培训课表</div>
          <gc-table drop row-key="customId" :list="addLadderList" :tableList="addLadderTableList" class="general__table">
            <el-table-column label="培训日程" min-width="180">
              <div slot-scope="scope" class="train-table__day">第
                <el-input-number v-model="scope.row.dayNum" controls-position="right" :min="1"></el-input-number>天
              </div>
            </el-table-column>
            <el-table-column label="时间" min-width="316">
              <div slot-scope="scope" class="train-table__time">
                <el-time-picker v-model="scope.row.startTime" :picker-options="{
                    selectableRange: scope.row.startTimer
                  }" :clearable="false" value-format="HH:mm" format="HH:mm" @change="startTimeChange($event, scope.row)" placeholder="选择时间">
                </el-time-picker>
                <span> 至 </span>
                <el-time-picker v-model="scope.row.endTime" :picker-options="{
                    selectableRange: scope.row.endTimer
                  }" :clearable="false" value-format="HH:mm" format="HH:mm" @change="endTimeChange($event, scope.row)" placeholder="选择时间">
                </el-time-picker>
              </div>
            </el-table-column>
            <el-table-column label="课程名称" min-width="296">
              <template slot-scope="scope">
                <div @click="handleSearch(scope.row)">
                  <el-input class="page-input" @focus="courseTypeFocus" v-model="scope.row.courseName">
                    <i slot="suffix" class="page-input__search"></i>
                  </el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="135" label="课程来源" prop="courseType"></el-table-column>
            <el-table-column label="操作" min-width="170">
              <template slot-scope="scope">
                <span class="active mr20" @click="addLadderTableDel(scope.$index)">
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
          <el-button @click="showIndex = 0" class="button-w80-h30">返回</el-button>
          <el-button class="button-w80-h30" type="primary" @click="handleAddLadder">确定</el-button>
        </div>
      </el-card>
    </div>
    <!-- 新增 显示div 选择课程 dialog -->
    <gc-model title="选择课程" width="1200px" cancelText="" comfirmText="选择" :visible="selectCurriculumVisible" @close="selectCurriculumVisible = false" @cancel="selectCurriculumVisible = false" @comfirm="selectCurriculumConfirm">
      <el-form v-model="internalCurriculumForm" inline>
        <el-form-item label="课程">
          <el-input style="width:200px;" placeholder="请输入课程名称/ID" v-model.trim="internalCurriculumForm.courseIdOrName">
          </el-input>
        </el-form-item>
        <el-form-item label="创建人" class="ml20">
          <el-input style="width:200px;" placeholder="请输入创建人姓名/UM号" v-model.trim="internalCurriculumForm.createByNameOrUm">
          </el-input>
        </el-form-item>
        <div class="fr">
          <el-button @click="getInternalCurriculumList" class="button-w80-h30" type="primary">查询</el-button>
        </div>
      </el-form>
      <gc-table class="table-radio" ref="choiceTableRef" :list="internalCurriculumList" :tableList="internalCurriculumTableList" @selection-change="tableSelectionChange($refs, $event, 'choiceTableRef')">
        <el-table-column width="110" prop="courseType">
          <template slot="header">
            <gc-tablecolumnfilters label="课程来源" className="table__screen__icon" :list="difCourseTypeList" confirmText="确定" popperClass="circular" @filter="
                commonFilter(
                  $event,
                  internalCurriculumForm,
                  'courseType',
                  getInternalCurriculumList,
                  'filter'
                )
              " @reset="
                commonFilter($event, internalCurriculumForm, 'courseType', getInternalCurriculumList)
              " radio>
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column width="110" prop="isUpload">
          <template slot="header">
            <gc-tablecolumnfilters label="课件上传" className="table__screen__icon" :list="difIsUploadList" confirmText="确定" popperClass="circular" @filter="
                commonFilter(
                  $event,
                  internalCurriculumForm,
                  'isUpload',
                  getInternalCurriculumList,
                  'filter'
                )
              " @reset="
                commonFilter($event, internalCurriculumForm, 'isUpload', getInternalCurriculumList)
              " radio>
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column width="120" label="创建时间" prop="createdDateStr"></el-table-column>
        <el-table-column width="146" label="创建人" prop="userName"></el-table-column>
        <el-table-column width="220" label="课程所属机构" prop="orgName"></el-table-column>
      </gc-table>
      <gc-pagination :total="internalCurriculumForm.total" :pageSizes="[10, 20]" :page-size="internalCurriculumForm.pageSize" :current-page="internalCurriculumForm.currPage" @sizeChange="
          sizeChange(
            $event,
            internalCurriculumForm,
            getInternalCurriculumList
          )
        " @currentChange="
          currentChange(
            $event,
            internalCurriculumForm,
            getInternalCurriculumList
          )
        " />
    </gc-model>
    <!-- 导入课表 -->
    <InstructorBatchImport title="批量导入课表" :visible.sync="batchAddCurriculumVisible" @change="heroImportChange" @templateDownload="downloadAdapter({ templateCode: 'LADDER_SCHEDULE_MANAGE' })" @comfirm="heroImportComfirm" @close="heroImportClose">
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
  random,
  CopyObj,
  resetObj,
  filterObj,
  sizeChange,
  commonFilter,
  currentChange,
  downloadAdapter,
  tableSelectionChange
} from '../../util/utils'
import {
  fetchListLadderCourse,
  fetchSaveLadderCourse,
  fetchUpdateSchedule,
  fetchListLadder,
  fetchDeleteLadders,
  fetchFindLadderDetail,
  fetchBatchLadders
} from '@/fetch/ladderManagement'
import { fetchListPlanDict } from '@/fetch/public'
export default {
  name: 'ScheduleManagmnet',
  data() {
    return {
      commonFilter,
      // 显示哪个页面
      showIndex: 0,
      // 查询表单休想
      queryForm: {
        // 条线
        blgStripLine: this.$store.state.userInfo.blgStripLine,
        // 业务模块
        channelType: '',
        // 关键岗位
        keyJobs: '',
        // 级联选择框 帮定值
        courseInfo: [],
        trainingInfo: [],
        currPage: 1,
        pageSize: 10
      },
      // 计划 所有 下拉选项
      planOptions: [],
      // 表格字段数组
      dataList: [
        {
          type: 'selection'
        },
        {
          width: '110',
          label: '业务模块',
          prop: 'channelTypeName'
        },
        {
          width: '130',
          label: '关键岗位',
          prop: 'keyJobsName'
        },
        {
          width: '110',
          label: '培训系列',
          prop: 'trainSeriesName'
        },
        {
          width: '130',
          label: '培训子系列',
          prop: 'childSeriesName'
        },
        {
          width: '226',
          label: '阶梯标准课表名称',
          prop: 'scheduleTemplateName'
        },
        {
          width: '120',
          label: '更新时间',
          prop: 'updatedDate'
        },
        {
          width: '146',
          label: '更新人',
          prop: 'updateName'
        }
      ],
      // 表格数据存放对象
      dataTableList: [],
      // 页面变化函数
      sizeChange,
      currentChange,
      // 新增课程 form 表单
      addForm: {
        blgOrg: '',
        blgStripLine: this.$store.state.userInfo.blgStripLine
      },
      // 新增课程 form 表单 验证规则
      addFormRules: {
        scheduleTemplateName: [
          {
            required: true,
            message: '请填写阶梯标准课表名称'
          }
        ],
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
            message: '请选择子系列',
            trigger: 'change'
          }
        ],
        blgOrgs: [
          {
            required: true,
            message: '请选择所属机构',
            trigger: 'change'
          }
        ]
      },
      // 新增课程 form 表单 关键岗位下拉选项
      keyPositionOptions: [],
      // 新增课程 form 表单 培训子系列下拉选项
      trainSeriesChildOptions: [],
      // 新增 div 培训课表 字段
      addLadderList: [
        {
          type: 'component',
          width: '64',
          'class-name': 'drop',
          ctx: row => ({
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
      // 新增 div 培训课表 内容
      addLadderTableList: [],
      // 新增 显示div 选择课程 dialog 显示状态
      selectCurriculumVisible: false,
      // 新增 显示div 标签页 当前显示页 name
      activeName: 'internalCurriculum',
      difCourseTypeList: [
        {
          label: '内部',
          value: '05002'
        },
        {
          label: '外部',
          value: '05003'
        }
      ],
      difIsUploadList: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
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
          width: '120',
          label: '课程ID',
          prop: 'courseId'
        },
        {
          label: '课程名称',
          width: '226',
          prop: 'courseName'
        }
      ],
      // 新增 显示div 标签页 内部课程表格 数组
      internalCurriculumTableList: [],
      // 新增 显示div 标签页 内部课程表格 查询表单
      internalCurriculumForm: {
        currPage: 1,
        pageSize: 10,
        isShow: 'Y'
      },
      // 批量导入课表 dialog状态
      batchAddCurriculumVisible: false,
      // SelectionChange 事件 table多选变单选
      tableSelectionChange,
      // 打开 选择课程时 row
      selectCurriculumCurrRow: {},
      tableSelectionRows: [],
      cacheOrgIds: [],
      cacheOrgIdsAdd: [],
      downloadAdapter,
      heroImportData: {
        title: '',
        failStrList: [],
        failUsers: [],
        succesCourses: []
      },
      editDisable: false
    }
  },
  methods: {
    heroImportComfirm() {
      const heroList = this.heroImportData.succesCourses
      if (heroList?.length) {
        heroList.forEach(v => {
          v.startTime = [
            v.startTime.slice(0, 2),
            v.startTime.slice(2),
            '00'
          ].join(':')
          v.endTime = [v.endTime.slice(0, 2), v.endTime.slice(2), '00'].join(
            ':'
          )
          v.customId = random()
        })
        this.addLadderTableList.push(...heroList)
        this.$message.success('批量导入成功')
      }
      this.batchAddCurriculumVisible = false
    },
    heroImportClose() {
      this.heroImportData = {}
      this.batchAddCurriculumVisible = false
    },
    heroImportChange($event) {
      const file = $event.target.files[0]
      if (!file.name) {
        this.heroImportData = {}
        return
      }
      const parms = new FormData()
      parms.append('file', file)
      fetchBatchLadders(parms).then(res => {
        this.heroImportData = res
      })
    },
    selectionHandle(list) {
      this.tableSelectionRows = list
    },
    // 查询函数
    query() {
      this.queryForm.currPage = 1
      this.getLadderList()
    },
    // 新增
    handleAdd() {
      this.addForm = this.$options.data.call(this).addForm
      this.editDisable = false
      this.$refs.addInstitutionRef.createTreeData()
      this.addLadderTableList = []
      this.showIndex = 1
      this.$nextTick(() => {
        this.$refs.addFormRef?.clearValidate()
      })
    },
    startTimeChange($event, row) {
      row.endTimer = `${$event}:00 - 23:59:59`
    },
    endTimeChange($event, row) {
      row.startTimer = `00:00:00 - ${$event}:00`
    },
    // 新增 显示div 标签页 内部课程表格 获取内部课程数据
    getInternalCurriculumList() {
      fetchListLadderCourse({ data: this.internalCurriculumForm }).then(res => {
        const { list, total } = res || {}
        this.internalCurriculumTableList = list
        this.internalCurriculumForm.total = total
      })
    },
    async getPlanOptions() {
      let data = await fetchListPlanDict({
        line: this.$store.state.userInfo.blgStripLine,
        type: '01001'
      })
      this.planOptions = data
    },
    // 新增课程 form 表单 业务模块 change 事件
    channelTypeChange() {
      this.$set(this.addForm, 'keyJobs', '')
      const data = this.planOptions.channelTypes.find(
        v => v.dataEncode === this.addForm.channelType
      )
      this.keyPositionOptions = data ? data.childPlanDict : []
    },
    // 新增课程 form 表单 培训系列 change 事件
    trainSeriesChange() {
      this.$set(this.addForm, 'childSeries', '')
      const data = this.planOptions.trainSeries.find(
        v => v.dataEncode === this.addForm.trainSeries
      )
      this.trainSeriesChildOptions = data ? data.childPlanDict : []
    },
    // 新增课程 页面 培训课表添加
    ladderListAppend() {
      this.addLadderTableList.push({
        dayNum: 1,
        startTimer: '00:00:00 - 23:59:59',
        endTimer: '00:00:00 - 23:59:59',
        startTime: '',
        endTime: '',
        courseType: '',
        customId: random()
      })
    },
    // 新增课程 页面 培训课表添加 课程名称 focus 事件
    courseTypeFocus($event) {
      $event.target.blur()
    },
    // 选择课程 确认事件
    selectCurriculumConfirm() {
      const selection = this.$refs.choiceTableRef.$children[0].selection
      if (selection.length < 1) {
        return this.$message.warning('选择内容为空')
      }
      this.$set(this.selectCurriculumCurrRow, 'courseId', selection[0].courseId)
      this.$set(
        this.selectCurriculumCurrRow,
        'courseName',
        selection[0].courseName
      )
      this.selectCurriculumCurrRow.courseType = selection[0].courseType
      this.addLadderTableList.forEach(v => {
        if (v.customId === this.internalCurriculumForm.customId) {
          this.$set(v, 'courseId', selection[0].courseId)
          this.$set(v, 'courseType', this.selectCurriculumCurrRow.courseType)
          this.$set(v, 'courseName', selection[0].courseName)
        }
      })
      this.selectCurriculumVisible = false
    },
    // 新增 培训课表 删除一个
    addLadderTableDel(index) {
      this.$confirm('确定删除此课程?', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      }).then(() => {
        this.addLadderTableList.splice(index, 1)
      })
    },
    // 验证课表数据
    verifyTimetable(courseList) {
      // 查找不符合条件的一项
      const flag = courseList.some((v, i) => {
        i++
        if (!v.startTime) {
          this.$message.warning(`课程表第${i}行开始时间必填`)
          return true
        }
        if (!v.endTime) {
          this.$message.warning(`课程表第${i}行结束时间必填`)
          return true
        }
        if (!v.courseName) {
          this.$message.warning(`课程表第${i}行课程名称必填`)
          return true
        }
        // 验证 相同日期的时间是否交叉
        const needVeriftTimeList = courseList.slice(0, i - 1).filter(n => {
          return n.dayNum === v.dayNum && n.courseId === v.courseId
        })
        if (!needVeriftTimeList) {
          return false
        }
        let index = needVeriftTimeList.findIndex(n => {
          return !(v.startTime >= n.endTime || v.endTime <= n.startTime)
        })
        if (index > -1) {
          index = courseList.findIndex(
            v => v.customId === needVeriftTimeList[index].customId
          )
          this.$message.warning(`课程表第${i}行时间和第${index + 1}行时间交叉`)
          return true
        }
      })
      // 没找到 不符合条件的
      if (!flag) {
        return true
      }
    },
    // 新增课程 确定事件
    handleAddLadder() {
      this.$refs.addFormRef.validate(async valied => {
        if (!valied) return
        const data = CopyObj(this.addForm)
        data.ladderCourseDTOList = CopyObj(this.addLadderTableList)
        data.ladderCourseDTOList.forEach((v, i) => {
          v.startTime = v.startTime
            .split(':')
            .slice(0, 2)
            .join('')
          v.endTime = v.endTime
            .split(':')
            .slice(0, 2)
            .join('')
          v.sortNum = i + 1
        })
        if (!this.verifyTimetable(data.ladderCourseDTOList)) {
          return
        }
        data.id ? await fetchUpdateSchedule({ data: this._formatSendParams(data) }) : await fetchSaveLadderCourse({ data: this._formatSendParams(data) })
        this.getLadderList()
        const desc = data.id ? '编辑' : '新增'
        this.$message.success(`${desc}课程成功`)
        this.showIndex = 0
      })
    },
    // 格式化发送数据
    _formatSendParams(params) {
      let data = filterObj(params)
      data.blgOrg = data.blgOrgs?.[1]
      data.orgId = data.orgIds?.[1]
      Reflect.deleteProperty(data, 'blgOrgs')
      Reflect.deleteProperty(data, 'orgIds')
      return data
    },
    // 打开编辑课程页面
    openEditPage(row) {
      fetchFindLadderDetail({
        id: row.id,
        blgStripLine: row.blgStripLine
      }).then(res => {
        this.dataTransition(res)
        this.showIndex = 1
      })
    },
    // 课程详情数据 转化为适合 编辑页面的数据
    dataTransition(data) {
      data.ladderCourseDTOList?.forEach(v => {
        v.startTime = [
          v.startTime.slice(0, 2),
          v.startTime.slice(2),
          '00'
        ].join(':')
        v.endTime = [v.endTime.slice(0, 2), v.endTime.slice(2), '00'].join(':')
        v.customId = random()
      })
      this.addLadderTableList = data.ladderCourseDTOList || []
      Reflect.deleteProperty(this.addForm, 'ladderCourseDTOList')
      const keyJobs = data.keyJobs
      data.keyJobs = ''
      const childSeries = data.childSeries
      data.childSeries = ''
      data.blgOrgs = [this.addForm.blgStripLine, data.blgOrg]
      this.addForm = data
      this.channelTypeChange()
      this.trainSeriesChange()
      this.editDisable = data.userIsSuperAdmin === 'Y' ? false : true
      this.$nextTick(() => {
        if (keyJobs !== '-1') {
          this.addForm.keyJobs = keyJobs
        }
        if (childSeries !== '-1') {
          this.addForm.childSeries = childSeries
        }
      })
      this.addForm.blgOrgs
      this.$refs.addInstitutionRef.content = [data.orgName]
    },
    handleSearch(row) {
      this.selectCurriculumVisible = true
      this.internalCurriculumForm = this.$options.data.call(
        this
      ).internalCurriculumForm
      this.getInternalCurriculumList()
      this.internalCurriculumForm.customId = row.customId
    },
    // 删除
    handleDelete() {
      if (this.tableSelectionRows.length < 1) {
        this.$message.warning('最少选择一行')
        return
      }
      this.$confirm('是否确定删除选中项', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: 'loginTimeout'
      }).then(() => {
        let scheduleTemplateIds = this.tableSelectionRows.map(item => item.id)
        fetchDeleteLadders({ scheduleTemplateIds }).then(res => {
          this.$message.success('删除成功')
          this.getLadderList()
        })
      })
    },
    orgIdsFinish() {
      this.cacheOrgIds = CopyObj(this.queryForm.orgIds)
      this.query()
    },
    orgIdsFinishAdd() {
      this.cacheOrgIdsAdd = CopyObj(this.addForm.blgOrgs)
    },
    // 重置函数
    reset() {
      resetObj(this.queryForm, {
        // 级联选择框 帮定值
        courseInfo: [],
        trainingInfo: [],
        currPage: 1,
        pageSize: 10,
        blgStripLine: this.$store.state.userInfo.blgStripLine,
        orgIds: this.cacheOrgIds
      })
      this.$refs.institutionRef.createTreeData()
    },
    // 获取数据函数
    getLadderList() {
      const data = CopyObj(this.queryForm)
      data.orgId = data.orgIds?.[1]
      Reflect.deleteProperty(data, 'orgIds')
      Reflect.deleteProperty(data, 'courseInfo')
      Reflect.deleteProperty(data, 'trainingInfo')
      fetchListLadder({ data: filterObj(data) }).then(res => {
        const { list, total } = res || {}
        this.dataTableList = list
        this.queryForm.total = total
      })
    },
    // 级联选择框 change 事件
    channelTypesChange(data) {
      ;[this.queryForm.channelType, this.queryForm.keyJobs] = data
    },
    // 级联选择框 change 事件
    trainingTypesChange(data) {
      ;[this.queryForm.trainSeries, this.queryForm.childSeries] = data
    }
  },
  mounted() {
    this.getPlanOptions()
  }
}
</script>
<style lang="scss">
.LadderManagement__ScheduleManagmnet {
  &__add {
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
      .gc-institution .input {
        width: 250px;
      }
      .disable__institution {
        background-color: #f7f8fa;
        span {
          color: #b4b6bc;
        }
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
            height: 14px;
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
        }
        .is-controls-right .el-input-number__decrease {
          line-height: 8px;
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
}
.LadderManagement__ScheduleManagmnet__cascader {
  .el-radio__inner {
    top: -18px;
    left: -19px;
    border-radius: 0;
    border: 0;
    width: 170px;
    height: 34px;
    background-color: transparent;
    cursor: pointer;
    box-sizing: border-box;
    position: absolute;
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: transparent;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border: 0 none;
  }
  .el-radio__input.is-checked .el-radio__inner::after {
    width: 0;
    height: 0;
    background-color: #fff;
  }
}
</style>