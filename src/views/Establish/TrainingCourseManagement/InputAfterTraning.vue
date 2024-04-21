<template>
  <div class="establish__inputAfterTraning">
    <!-- 搜索框 -->
    <el-card class="search-form-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <!-- <el-form-item label="输入知鸟考试编号">
          <el-input
            v-model="queryForm.testId"
            placeholder="请输入编号"
          ></el-input>
        </el-form-item> -->
        <el-form-item label="所属机构">
          <gc-institution orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" />
        </el-form-item>
        <el-form-item label="学员信息">
          <el-input
            v-model.trim="queryForm.umOrName"
            placeholder="请输入姓名/UM号"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button-60-h30" @click="query" type="primary">查询</el-button>
          <el-button class="button-60-h30" @click="reset">重置</el-button>
          <el-button class="button-60-h30" @click="download()">导出</el-button>
        </el-form-item>
        <!-- <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="download()" type="primary">导出</el-button>
        </div> -->
      </el-form>
    </el-card>
    <!-- 表格内容框 -->
    <el-card class="mt10"  style="margin-bottom: 35px">
      <div class="menu-right menu-right_tables">
        <span class="instructor-icons__download" @click="batchImportVisible = true" >
          <i class="instructor-icons__download__icon"></i>
          批量导入
        </span>
        <span class="instructor-icons__affirmTrain" @click="batchSetup" >
          <i class="instructor-icons__affirmTrain__icon"></i>
          批量设置
        </span>
        <span class="instructor-icons__affirmTrain" @click="trainingEndConditionSetup" >
          <i class="instructor-icons__affirmTrain__icon"></i>
          结训条件
        </span>
        <span class="instructor-icons__edit" @click="setTableEdit" >
          <i class="instructor-icons__edit__icon"></i>
          编辑全部
        </span>
      <!-- <gc-model
        title="批量设置"
        height="190px"
        width="600px"
        :visible.sync="false"
        isAppend
        @comfirm="batchSetup"
      >
      <div class="delog_css">
        <P><span>批量补录选中学员的签到时间</span></P><br/><br/>
        <P><span>签到时间
        </span></P>
      </div>
    </gc-model> -->
      </div>
      <gc-table :list="list" :tableList="tableList" class="general__table" ref="selectInputTableRef">
        <el-table-column label="考勤" prop="isAttendence" min-width="126">
           <template slot="header">
            <gc-tablecolumnfilters
              label="考勤"
              ref="classStatusNameRef"
              className="table__screen__icon"
              :list="trainingStateList"
              confirmText="确定"
              popperClass="circular"
              @filter="trainingStateFilter"
              @reset="trainingStateReset"
              radio
            />
          </template>
          <template slot-scope="scope">{{ jfRender('', scope.row) }}</template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in kqTableList"
          :key="`${item.checkNum}${index}`"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot="header"><span>{{ kqRender(item) }}</span></template>
          <template slot-scope="scope">{{ scope.row[`attendance${item.checkNum}`] }}</template>
        </el-table-column>
        <el-table-column
          v-for="item in jfTableList"
          :key="item.configValue"
          min-width="170"
          show-overflow-tooltip
        >
          <template slot="header">
            <gc-tablecolumnfilters
              v-if="item.configValue === 'isScoreOk'"
              :label="item.configName"
              ref="classStatusNameRef"
              className="table__screen__icon"
              :list="trainingStateList"
              confirmText="确定"
              popperClass="circular"
              @filter="integrationStateFilter"
              @reset="integrationStateReset"
              radio
            />
            <span v-else>{{ item.configName }}</span>
          </template>
          <template slot-scope="scope">{{ jfRender(item, scope.row) }}</template>
        </el-table-column>
        <el-table-column label="结训状态" min-width="114">
          <template slot="header">
            结训状态
            <el-tooltip effect="light" popper-class="table-popper" placement="top" >
              <i class="el-icon-question active"></i>
              <div class="tips-container" slot="content">
                <div>1、考勤、积分都合格学员参考状态为“结训”，不合格的学员参考状态为“未参加”，最终以提交的数据为准</div>
                <div>2、考勤或积分不合格的学员，无法被置为“结训”状态</div>
              </div>
            </el-tooltip>
            <gc-tablecolumnfilters
              label=""
              ref="classStatusNameRef"
              className="table__screen__icon"
              :list="selectAttendStateList"
              confirmText="确定"
              popperClass="circular"
              @filter="selectAttendStateFilter"
              @reset="selectAttendStateReset"
            />
          </template>
          <template slot-scope="scope">
            <gc-select v-if="isEditAll"
              class="w80"
              v-model="scope.row.isAttendClass"
              :options="stateOptions"
              @change="stateChange(scope.row)"
            ></gc-select>
            <span v-else>{{getIsAttendClassDesc(scope.row.isAttendClass)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="优秀学员" min-width="176">
          <template slot-scope="scope">
              <gc-select v-if="isEditAll"
                class="w80"
                v-model="scope.row.isExcellentStu"
                :options="studentsOptions"
                @change="excellentStuChange(scope.row)"
              ></gc-select>
              <span v-else>{{ scope.row.isExcellentStuDesc }}</span>
            </template>
        </el-table-column>
        <el-table-column label="当期荣誉" min-width="178">
          <template slot-scope="scope">
            <el-input  v-if="isEditAll"
            class="w150" 
            v-model="scope.row.rewardPunish" 
            @blur="rewardPunishBlur(scope.row)" />
            <span v-else>{{ scope.row.rewardPunish }}</span>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="[10, 50, 100]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      />
    </el-card>

    <div v-if="isEditAll" class="footer-box dfc fixed1" >
      <el-button class="button-w80-h30 mr20" @click="cannel()">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submit()" >提交</el-button>
    </div>

    <!-- 考勤补录 弹窗 -->
    <gc-model
      title="考勤补录"
      width="1200px"
      class="attendance-supplement"
      :visible="attendanceSupplementVisible"
      @close="attendanceSupplementVisible = false"
      @cancel="attendanceSupplementVisible = false"
      @comfirm="attendanceSupplementComfirm"
    >
      <el-form ref="form" :model="attendanceForm" @submit.native.prevent>
        <div class="between">
          <div class="left">
            <el-form-item label="本次考勤日期" class="df">
              <el-input
                disabled
                class="w200"
                v-model="attendanceForm.dateTime"
              ></el-input>
            </el-form-item>
            <el-form-item label="补录日期" class="mb10" label-width="84px">
              <el-input
                disabled
                class="w200"
                v-model="attendanceForm.dateTime"
              ></el-input>
            </el-form-item>
          </div>
          <div class="center">
            <el-form-item label="班级总人数" class="" label-width="96px">
              <el-input
                class="w200"
                disabled
                v-model="attendanceForm.studentNum"
              ></el-input>
            </el-form-item>
            <div class="date-time df">
              <el-form-item
                label="本次考勤时间段"
                class="search-card__date mr10 df mt0"
              >
                <el-time-picker
                  :disabled="!!attendanceForm.attendanceRecordUuid"
                  v-model="attendanceForm.dateStartTime"
                  :picker-options="{
                    selectableRange: attendanceForm.startTimer
                  }"
                  :clearable="false"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="startTimeChange($event, attendanceForm)"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </el-form-item>
              <el-form-item label="至" class="search-card__date df mt0">
                <el-time-picker
                  v-model="attendanceForm.dateEndTime"
                  :disabled="!!attendanceForm.attendanceRecordUuid"
                  :picker-options="{
                    selectableRange: attendanceForm.endTimer
                  }"
                  :clearable="false"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="endTimeChange($event, attendanceForm)"
                  placeholder="选择时间"
                >
                </el-time-picker>
              </el-form-item>
            </div>
          </div>
          <div class="right">
            <el-form-item class="" label="已考勤人数">
              <el-input
                disabled
                class="w200"
                v-model="attendanceForm.checkedStudentNum"
              ></el-input>
            </el-form-item>
            <el-form-item label="填写时间" label-width="72px">
              <el-time-picker
                class="w-200"
                v-model="attendanceForm.dateCheck"
                :clearable="false"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="选择时间"
              >
              </el-time-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </gc-model>

    <!-- 批量导入 弹窗 -->
    <gc-model
      title="批量导入"
      width="900px"
      class="batch-import"
      :visible="batchImportVisible"
      @close="batchImportClose"
      @cancel="batchImportVisible = false"
      @comfirm="batchImportComfirm"
    >
      <div class="aic">
        <span class="mr20">批量上传</span>
        <gc-fileInput @change="uploadData" />
        <div
          class="down-btn"
          @click="
            templateDownload('/common/file/downloadModule', {
              fileCode: 'afterTrainStudentModule'
            })
          "
        >
          <span class="instructor-icons__download margin-0">
            <i class="instructor-icons__download__icon"></i>
            模版下载
          </span>
        </div>
      </div>
      <div class="title mt30">
        <span class="title__menu"></span>
        学员表现批量导入结果
      </div>
      <gc-table
        class="general__table mt20 table-left"
        :list="batchImportList"
        :tableList="batchImportTableList"
      >
      </gc-table>
    </gc-model>
    <gc-model
        title="批量设置选中学员属性"
        height="190px"
        width="600px"
        @close="closeAll"
        :visible.sync="choiceAddAll"
        isAppend
        @comfirm="choiceStudentComfirm"
      >
        <div class="aic delog_css_input">
        <span class="mr20">结训状态</span>
        <gc-select
          class="w80"
          v-model="selectAttendClass"
          :options="stateOptions"
          @change="stateChangeAll($event)">
        </gc-select>
         </div>
        <div class="aic delog_css_input">
          <span class="mr20">优秀学员</span>
          <gc-select
            class="w80"
            v-model="selectisExcellentStu"
            :options="studentsOptions"
            @change="excellentStuChangeAll($event)">
          </gc-select>
         </div>
    </gc-model>
    <gc-model
      title="结训条件"
      width="500px"
      height="300px"
      @close="trainingEndConditionClose"
      :visible.sync="trainingEndCondition"
      custom-class="establish__trainingCourseManagement__attendanceBatchImport"
      isAppend
      @comfirm="trainingEndConditionComfirm"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="考勤条件" name="kqCondition">
          <ul v-if="kqList.length">
            <li class="mb20" style="display:flex;">
              <p class="mr10 kq-css-reset">注意:</p>
              <p style="line-height:22px;">设置是否满足考勤条件才可结训，多个条件时需同时满足</p style="line-height:22px;">
            </li>
            <li v-for="(item, index) in kqList" :key="item.id" class="mb10" style="display:flex;">
              <p class="mr10 kq-css-reset">{{ kqRender(item) }}</p>
              <el-checkbox v-model="item.kqChecked" :disabled="item.needChecked">必须合格</el-checkbox>
            </li>
          </ul>
          <p v-else>培训班暂未发起考勤</p>
        </el-tab-pane>
        <el-tab-pane label="积分条件" name="jfCondition">
          <ul v-if="jfList.length">
            <li class="mb20" style="display:flex;">
              <p class="mr10 kq-css-reset">注意:</p>
              <p style="line-height:22px;">设置是否满足积分条件才可结训，多个条件时需同时满足</p style="line-height:22px;">
            </li>
            <li v-for="(item, index) in jfList" :key="`${item.id}${index}`" class="mb10" style="display:flex;">
              <p class="mr10 jf-css-reset">{{ `${item.configName}:` }}</p>
              <gc-select
                class="p0 w-100 mr10"
                placeholder="无"
                :options="jfOptions"
                v-model="item.qualifiedSymbol"
              />
              <gc-input-number
                v-if="item.qualifiedSymbol"
                v-model="item.qualifiedScore"
                controls-position="right"
                :precision="1"
                :step="0.1"
                :min="1"
                :max="9999"
              />
            </li>
          </ul>
          <p v-else>培训班暂未添加积分项，请在积分管理中添加积分项</p>
        </el-tab-pane>
      </el-tabs>
    </gc-model>
  </div>
</template>

<script>
import {
  resetObj,
  filterObj,
  hintFrame,
  sizeChange,
  dataHeaders,
  jsonHeaders,
  manyLineHint,
  closeCurrPage,
  currentChange,
  endTimeChange,
  startTimeChange,
  templateDownload
} from '@/util/utils'
import {
  fetchListAttendanceRecords,
  fetchQueryIntergrationConfiguration,
  fetchExportListStudentInfos,
  fetchClassAttendanceConditionSet,
  fetchClassIntegrationConditionSet
} from '@/fetch/trainingCourseManagement'

export default {
  name: 'InputAfterTraning',
  props: {
    params: {
      type: Object | null,
      default: null
    }
  },
  data() {
    return {
      // 培训班id
      classId: '',
      blgOrgIds: [],
      queryForm: {
        testId: '',
        umOrName: '',
        currPage: 1,
        pageSize: 10
      },
      // 结训状态 下拉选项
      stateOptions: [
        { label: '结训',  value: '3' },
        { label: '不及格', value: '2' },
        { label: '未参加',  value: '1' }
      ],
      // 优秀学员 下拉选项
      studentsOptions: [
        {
          label: '是',
          value: '1'
        },
        {
          label: '否',
          value: '0'
        }
      ],
      total: 0,
      // 表格字段数组
      list: [
        {
          type: 'selection',
          width: '54'
        },
        {
          width: '110',
          label: '姓名',
          prop: 'studentName'
        },
        {
          width: '130',
          label: 'UM',
          prop: 'umId'
        },
        {
          width: '72',
          label: '类型',
          prop: 'blgStripLine'
        }
      ],
      // 表格内容数组
      tableList: [],
      tableListEdit: [], // 被编辑的记录
      // 表格内容中的考勤
      kqTableList: [],
      // 表格内容中的积分
      jfTableList: [],
      // 考勤补录 dialog 状态
      attendanceSupplementVisible: false,
      // 考勤补录用到的表单
      attendanceForm: {
        // 本次考勤日期, 补录日期
        dateTime: '',
        // 班级总人数
        studentNum: '',
        // 开始时间
        dateStartTime: '',
        // 结束时间
        dateEndTime: '',
        // 已考勤人数
        checkedStudentNum: '',
        // 填写时间
        dateCheck: '',
        endTimer: '00:00:00 - 23:59:59',
        startTimer: '00:00:00 - 23:59:59'
      },
      // 批量导入 dialog 状态
      batchImportVisible: false,
      // 批量导入表格 字段数组
      batchImportList: [
        {
          label: 'UM号',
          prop: 'umId',
          width: '150'
        },
        {
          label: '结训',
          prop: 'isAttendClassDesc',
          width: '70'
        },
        {
          label: '优秀学员',
          prop: 'isExcellentStuDesc',
          width: '70'
        },
        {
          label: '当期荣誉',
          prop: 'rewardPunish',
          width: '200'
        }
      ],
      // 批量导入表格 数据数组
      batchImportTableList: [],
      // 限制时间组件选择的工具函数
      endTimeChange,
      startTimeChange,
      // 下载模版工具函数
      templateDownload,
      // 关闭当前页面工具函数
      closeCurrPage,
      // 分页工具函数
      sizeChange,
      currentChange,
      isShowFirstAttendance: true,
      trainingStateList: [
        { value: 'Y', label: '合格' },
        { value: 'N', label: '不合格' }
      ],
      selectId:[],
      choiceAddAll: false,
      selectAttendClass :'', // 结训状态
      // 结训条件
      trainingEndCondition: false,
      // 结训条件 tabs 分页激活项
      activeName: 'kqCondition',
      // 考勤条件列表
      kqList: [],
      // 积分条件列表
      jfList: [],
      jfOptions: [
        { label: '大于', value: '1' },
        { label: '大于等于', value: '2' }
      ],
      selectAttendStateList: [
        { value: '3', label: '结训' },
        { value: '2', label: '不及格' },
        { value: '1', label: '未参加' }
      ],
      isExcellentStuDesc:'',
      selectisExcellentStu :'', // 优秀学员
      isEditAll: false
    }
  },
  methods: {
    getIsAttendClassDesc (value) {
      const item = this.stateOptions.find(m => m.value === value)
      return item?.label || ''
    },
    setListEditDefaultValue (list) {
      if (!this.isEditAll) return
      list.forEach((m) => {
        // 考勤和积分合格时，且结训状态为空时，自动填充为“结训”
        if (!m.isAttendClass) {
          if (m.isAttendence === 'Y' && m.isIntegration === 'Y') {
            m.isAttendClass = '3'
          } else {
            m.isAttendClass = '1'
          }
        } else {
          // 结训状态非空，考勤合格（此时积分必定合格）时，结训状态修改为“结训”
          if (m.isAttendence === 'Y' && m.isIntegration === 'Y') {
            m.isAttendClass = '3'
          }
        }
        this.pushTableListEdit(m)
      })
    },
    setTableEdit () {
      this.isEditAll = true
      this.tableListEdit = []
      this.setListEditDefaultValue(this.tableList)
    },
    // 追加编辑记录
    pushTableListEdit (row) {
      this.$nextTick(() => {
        const rowIndex = this.tableListEdit.findIndex(m => m.umId === row.umId)
        if (rowIndex > -1) {
          this.tableListEdit.splice(rowIndex, 1, {...row})
        } else {
          this.tableListEdit.push({...row})
        }
        // console.log('xf-tableListEdit', this.tableListEdit)
      })
    },
    // 查询
    query () {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 重置
    reset () {
      this.blgOrgIds = []
      this.queryForm.umOrName = ''
      resetObj(this.queryForm)
      this.queryForm.pageSize = 10
      this.queryForm.currPage = 1
      this.queryForm.classId = this.classId
      this.getList()
    },
    // 同步知鸟编号
    synchronization() {
      const classId = this.classId
      const { testId } = this.queryForm
      if (!testId) return
      const data = { classId, testId }
      this.$axios
        .post(
          '/fn/classes/manager/afterTrain/modifyScoreByTestId',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('同步成功')
            this.query()
          }
        })
    },
    // 获取内容
    getList () {
      // let data = filterObj(this.queryForm)
      console.log(this.queryForm, '打印过滤后入参')
      const data = {
        currPage: this.queryForm.currPage,
        pageSize: this.queryForm.pageSize,
        classId: this.queryForm.classId,
        isChecked: this.queryForm.isChecked || '',
        isAttendence: this.queryForm.isAttendence || '',
        isIntegration: this.queryForm.isIntegration || '',
        isAttendClass: this.queryForm.isAttendClass || [],
        busiType: this.blgOrgIds?.[0],
        orgId: this.blgOrgIds?.[1]
      }
      if (this.queryForm.umOrName) {
        data.umOrName = this.queryForm.umOrName
      }
      this.$axios
        .post(
          '/fn/classes/manager/afterTrain/listStudentInfos',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data.RESULT_STUDENTS
            this.isShowFirstAttendance = data.RESULT_CLASS_INFO.isFourHours !== 'Y'
            this.tableListEdit = []
            this.setListEditDefaultValue(list)
            this.total = total
            this.kqTableList = data.RESULT_ATTENDANCE || []
            this.kqTotal = data.RESULT_ATTENDANCE.total
            this.jfTableList = data.RESULT_INTEGRATION || []
            this.tableList = list
          }
        })
    },
    // 筛选考勤
    trainingStateFilter (list) {
      list = list.list
      this.queryForm.currPage = 1
      this.queryForm.isAttendence = list.length === 1 ? list[0] : ''
      this.getList()
    },
    // 重置培训班状态、考勤
    trainingStateReset () {
      this.queryForm.currPage = 1
      this.queryForm.isAttendence = ''
      this.getList()
    },
    // 筛选积分
    integrationStateFilter (list) {
      list = list.list
      this.queryForm.currPage = 1
      this.queryForm.isIntegration = list.length === 1 ? list[0] : ''
      this.getList()
    },
    // 重置培训班状态、积分
    integrationStateReset () {
      this.queryForm.currPage = 1
      this.queryForm.isIntegration = ''
      this.getList()
    },
    // 筛选结训状态
    selectAttendStateFilter (list) {
      this.queryForm.currPage = 1
      this.queryForm.isAttendClass = list.list
      this.getList()
    },
    // 重置培训班状态、结训状态
    selectAttendStateReset () {
      this.queryForm.currPage = 1
      this.queryForm.isAttendClass = []
      this.getList()
    },
    // 结训状态change事件
    stateChange (row) {
      if (row.isChecked === 'N' && row.isAttendClass === '3') {
        this.$nextTick(() => {
          row.isAttendClass = ''
        })
        this.$message.warning('考勤不合格的学员不能结训')
      }
      this.pushTableListEdit(row)
    },
    // 优秀学员事件
    excellentStuChange(row) {
      if (row.isChecked === 'N' && row.isExcellentStu === '1') {
        this.$nextTick(() => {
          row.isExcellentStu = ''
        })
        this.$message.warning('考勤不合格的学员不能为优秀学员')
      } else {
        row.isExcellentStuDesc = row.isExcellentStu === '1'?'是':'否'
      }
      this.pushTableListEdit(row)
    },
    rewardPunishBlur(row) {
      this.pushTableListEdit(row)
    },
    excellentStuChangeAll(el){
      console.log(el, '批量设置优秀学员')
      this.selectisExcellentStu = el
      this.isExcellentStuDesc = +el === 1 ? '是' : '否'
    },
    stateChangeAll(el){
      console.log(el, '批量设置结训状态')
      this.selectAttendClass = el
    },
    // 打开考勤补录
    openAttendanceSupplement(row, checkNum) {
      const data = { classId: this.classId }
      this.$axios
        .post(
          '/fn/classes/manager/afterTrain/findClassAttendanceInfos',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const attendance =
              data.attendanceRecords.find((v) => v.checkNum == checkNum) || {}
            if (checkNum == '1') {
              this.attendanceForm.dateTime = (
                attendance.dateStartTime || data.dateStart
              ).split(' ')[0]
            } else {
              this.attendanceForm.dateTime = (
                attendance.dateEndTime || data.dateEnd
              ).split(' ')[0]
            }
            this.attendanceForm.studentNum = data.studentNum
            this.attendanceForm.dateStartTime = (attendance.dateStartTime || '')
              .split(' ')
              .slice(-1)[0]
            this.attendanceForm.dateEndTime = (attendance.dateEndTime || '')
              .split(' ')
              .slice(-1)[0]
            this.attendanceForm.checkedStudentNum = attendance.checkedStudentNum
            this.attendanceForm.checkNum = checkNum
            this.attendanceForm.attendanceRecordUuid =
              attendance.attendanceRecordUuid
            this.attendanceForm.row = row
            this.attendanceForm.dateCheck = data.dateCheck || ''

            startTimeChange(
              this.attendanceForm.dateStartTime,
              this.attendanceForm
            )
            endTimeChange(this.attendanceForm.dateEndTime, this.attendanceForm)
            this.attendanceSupplementVisible = true
          }
        })
    },
    // 考勤补录确认事件
    attendanceSupplementComfirm() {
      let {
        dateTime,
        checkNum,
        dateStartTime,
        dateEndTime,
        dateCheck,
        attendanceRecordUuid,
        row
      } = this.attendanceForm
      if (!dateStartTime || !dateEndTime || !dateCheck) {
        return this.$message.warning('请选择本次考勤时间段和填写时间')
      }
      dateStartTime = dateStartTime.padEnd(8, ':00')
      dateEndTime = dateEndTime.padEnd(8, ':00')
      dateCheck = dateCheck.padEnd(8, ':00')
      if (dateCheck < dateStartTime) {
        return this.$message.warning('签到时间不能早于开始时间')
      }
      dateStartTime = dateTime + ' ' + dateStartTime
      dateEndTime = dateTime + ' ' + dateEndTime
      dateCheck = dateTime + ' ' + dateCheck
      attendanceRecordUuid = attendanceRecordUuid || ''
      const classId = this.classId
      const isBatch = attendanceRecordUuid ? 'N' : 'Y'
      const { umId } = row
      const newRow = { umId, dateCheck }
      const attendanceStudents = [newRow]
      const data = {
        classId,
        checkNum,
        dateStartTime,
        dateEndTime,
        dateCheck,
        attendanceRecordUuid,
        isBatch,
        attendanceStudents
      }
      this.$axios
        .post(
          '/fn/classes/manager/afterTrain/addAbsentStudentForAfterTrain',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.attendanceSupplementVisible = false
            this.getList()
            this.$message.success('操作成功')
          }
        })
    },
    // 批量导入dialog 上传文件
    uploadData($event) {
      const file = $event.target.files[0]
      const data = new FormData()
      data.append('file', file)
      data.append('classId', this.classId)
      this.$axios
        .post('/classFileFunc/classStudentsBatchImport', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { errorTips, RESULT_STUDENTS: studentList } = data
            this.batchImportTableList = studentList
            if (errorTips.length) {
              manyLineHint(errorTips)
            }
          }
        })
    },
    // 导出
    download () {
      let params = {
        classId: this.classId,
        fileCode: 'afterTrainStudentModule',
        busiType: this.blgOrgIds?.[0],
        orgId: this.blgOrgIds?.[1],
        umOrName: this.queryForm.umOrName || '',
        isChecked: this.queryForm.isChecked || '',
        isAttendence: this.queryForm.isAttendence || '',
        isIntegration: this.queryForm.isIntegration || '',
        isAttendClass: this.queryForm.isAttendClass || []
      }
      fetchExportListStudentInfos({ data: params })
    },
    // 批量导入dialog 确认事件
    batchImportComfirm() {
      this.submit(this.batchImportTableList).then((state) => {
        if (state) {
          this.batchImportVisible = false
          this.query()
        }
      })
    },
    // 批量导入dialog 关闭事件
    batchImportClose() {
      this.batchImportVisible = false
      this.batchImportTableList = []
    },
    batchSetup () {
      console.log(this.$refs.selectInputTableRef.$children[0].selection,'dadede')
      const item = this.$refs.selectInputTableRef.$children[0].selection
      if (!item || (item && item.length === 0)) {
        return this.$message.warning('请选择学员姓名')
      } else {
         console.log(item, '打印选中的完整的数据结训管理列表')
         this.choiceAddAll = true
         this.selectId = []
         item && item.forEach ((item) => {
          this.selectId.push(item.umId)
         })
      }
    },
    choiceStudentComfirm () {
      const list = this.$refs.selectInputTableRef.$children[0].selection
      let allShow = true
      let title = []
      list.map((item, index) => {
        if (item.isChecked === 'N' && (+this.selectisExcellentStu === 1 || +this.selectAttendClass === 3)) {
          allShow = false
          title.push("第" + `${index + 1}` + "行未完成考勤,不能选择优秀员工为是或结训状态不能选择结训！")
        } else {
          item.isAttendClass = this.selectAttendClass  // 结训状态
          item.isExcellentStu = this.selectisExcellentStu // 优秀学员
          item.isExcellentStuDesc = this.isExcellentStuDesc
        }
      })

      if (!allShow) {
        return manyLineHint(title)
      }
      // 批量设置后提交后端校验
      this.submit(list)
      console.log(list, '打印确认后数据')
      this.choiceAddAll = false
    },
    // 取消
    cannel () {
      this.isEditAll = false
      this.tableListEdit = []
      this.query()
    },
    // 保存学员信息
    submit (list) {
      // list = list || this.$refs.selectInputTableRef.$children[0].selection
      list = list || this.tableListEdit
      if (!list || list.length === 0) {
        return this.$message.warning('没有要提交的数据！')
      }
      const data = { classInfo: { classId: this.classId }, studentInfos:list }
      return this.$axios
        .post(
          '/fn/classes/manager/afterTrain/saveStudentInfos',
          data,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            if (data.length) {
              manyLineHint(data)
            } else {
              this.$message.success('操作成功')
              this.selectAttendClass = ''  // 结训状态
              this.selectisExcellentStu = '' // 优秀学员
              this.isExcellentStuDesc = ''
            }
            this.isEditAll = false
            this.getList()
            return true
          }
        })
    },
    closeAll () {
      this.selectAttendClass = ''  // 结训状态
      this.selectisExcellentStu = '' // 优秀学员
      this.isExcellentStuDesc = ''
      this.choiceAddAll = false
    },
    // 处理考勤积分数据
    handleKqJf (kqRes, jfRes) {
      // 考勤数据处理
      let kqList = kqRes.attendanceRecordList || []
      if (kqList.length > 0) {
        kqList.map(item => {
          item.kqChecked = item.qualifiedCondition === 'Y'
        })
        kqList[0].kqChecked = true
        kqList[0].needChecked = true
        if (kqRes.isFourHours === 'N') {
          kqList[kqList.length - 1].kqChecked = true
          kqList[kqList.length - 1].needChecked = true
        }
      }
      this.kqList = kqList
      // 积分数据处理
      let jfList = jfRes || []
      if (jfList.length > 0) {
        let arr = jfList.filter(item => item.configValue === 'totalScore')
        if (arr.length === 0) {
          jfList.unshift({ id: '', classId: this.classId, configName: '总得分',  configValue: 'totalScore', qualifiedScore: 1 })
        }
      }
      this.jfList = jfList
    },
    // 结训条件打开按钮
    async trainingEndConditionSetup () {
      // 考勤数据请求
      let kqRes = await fetchListAttendanceRecords({ data: { classId: this.classId } })
      // 积分数据请求
      let jfRes = await fetchQueryIntergrationConfiguration({ data: { classId: this.classId } })
      // 处理考勤积分数据
      this.handleKqJf(kqRes, jfRes)
      this.activeName = 'kqCondition'
      // 打开弹框
      setTimeout(() => {
        this.trainingEndCondition = true
      }, 100)
    },
    // 结训条件关闭
    trainingEndConditionClose () {
      this.trainingEndCondition = false
    },
    // 结训条件确认按钮
    async trainingEndConditionComfirm () {
      // 考情数据保存
      if (this.activeName === 'kqCondition' && this.kqList.length > 0) {
        let list = this.kqList.filter(item => item.kqChecked)
        await fetchClassAttendanceConditionSet({ list })
        await this.getList()
      }
      // 积分数据保存
      if (this.activeName === 'jfCondition' && this.jfList.length > 0) {
        let list = this.jfList.filter(item => item.qualifiedSymbol)
        await fetchClassIntegrationConditionSet({ list, classId: this.classId })
        await this.getList()
      }
      setTimeout(() => {
        this.trainingEndCondition = false
      }, 500)
    },
    // 考勤文字渲染
    kqRender (item) {
      return item.isLastKQ === 'Y' ? '最后一次考勤' : `第 ${item.checkNum} 次考勤`
    },
    // 小数点处理
    handleNum (val) {
      if (val === '' || String(val) === 'undefined' || String(val) === 'null' || val === '-') {
        return val
      }
      return parseFloat(val).toFixed(1)
    },
    // 积分文字渲染
    jfRender (item, row) {
      // 考勤
      if (!item) {
        if (row.isAttendence) {
          return row.isAttendence === 'Y' ? '合格' : '不合格'
        }
        return row.isAttendence
      }
      // 积分
      if (item.configValue === 'isScoreOk') {
        if (row.isIntegration) {
          return row.isIntegration === 'Y' ? '合格' : '不合格'
        }
        return row.isIntegration
      }
      // 总得分
      if (item.configValue === 'totalScore') {
        return this.handleNum(row.score)
      }
      return this.handleNum(row[item.configValue])
    },
    doInitThing() {
      const params =  this.params || this.$route.params
      if (params.id) {
        this.classId = params.id
        this.queryForm.classId = params.id
        this.query()
      } else if (this.classId) {
        this.query()
      }
    }
  },
  mounted() {
    if(this.params) {
      this.doInitThing();
    }
  },
  activated() {
    this.doInitThing();
  }
}
</script>

<style lang="scss" scoped>
.establish__inputAfterTraning {
  .attendance-supplement {
    .el-dialog__body {
      height: 279px;
    }
  }
}
.menu-right_tables{
 float: left;
 margin-left:0px;
 margin-top: 30px;
}
.delog_css_input{
  text-align: center;
  width:300px;
  margin: auto;
}
.fixed1 {
  position: fixed;
  width: 100%;
  left: 5px;
  bottom: 0px;
  padding: 10px 0;
}
                   
.tips-container {
  line-height: 20px;
  color: #888;
  padding: 0 10px;
}

.kq-css-reset {
  width: 100px;
  line-height: 22px;
  text-align: right;
}
.jf-css-reset {
  width: 100px;
  line-height: 30px;
  text-align: right;
}
</style>
