<template>
  <div class="establish__inputAfterTraning">
    <!-- 搜索框 -->
    <el-card class="search-form-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="所属机构">
          <gc-institution orgUrl="/fn/user/selectAllTree" v-model="blgOrgIds" />
        </el-form-item>
        <el-form-item label="学员信息">
          <el-input v-model.trim="queryForm.umOrName" placeholder="请输入姓名/UM号" />
        </el-form-item>
        <el-form-item>
          <el-button class="button-60-h30" @click="query" type="primary">查询</el-button>
          <el-button class="button-60-h30" @click="reset">重置</el-button>
          <el-button class="button-60-h30" @click="download()">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格内容框 -->
    <el-card class="mt10"  style="margin-bottom: 35px">
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
            <span>{{getIsAttendClassDesc(scope.row.isAttendClass)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="优秀学员" min-width="176" prop="isExcellentStuDesc" />
        <el-table-column label="当期荣誉" min-width="178" prop="rewardPunish" />
      </gc-table>
      <gc-pagination
        :total="total"
        :page-sizes="pageSizes"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getList)"
        @currentChange="currentChange($event, queryForm, getList)"
        class="between"
      />
    </el-card>
  </div>
</template>

<script>
import { resetObj, sizeChange, currentChange, templateDownload } from '@/util/utils'
import { fetchListStudentInfos, fetchExportListStudentInfos } from '@/fetch/trainingCourseManagement'

export default {
  name: 'InputAfterTraning',
  props: {
    params: {
      type: Object | null,
      default: null
    }
  },
  data() {
    const indexCtx = (row, index) => {
      return (this.queryForm.currPage -1) * this.queryForm.pageSize + index + 1
    }
    return {
      classId: '', // 培训班id
      pageSizes: [5, 10, 50, 100],
      blgOrgIds: [],
      queryForm: {
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
      // 表格字段数组
      list: [
        { label: '序号', width: '64', type: 'index', ctx: indexCtx },
        { width: '110', label: '姓名', prop: 'studentName' },
        { width: '130', label: 'UM', prop: 'umId' },
        { width: '72', label: '类型', prop: 'blgStripLine' }
      ],
      total: 0,
      tableList: [], // 表格内容数组
      // 表格内容中的考勤
      kqTableList: [],
      // 表格内容中的积分
      jfTableList: [],
      // 分页工具函数
      sizeChange,
      currentChange,
      isShowFirstAttendance: true,
      trainingStateList: [
        { value: 'Y', label: '合格' },
        { value: 'N', label: '不合格' }
      ],
      selectAttendStateList: [
        { value: '3', label: '结训' },
        { value: '2', label: '不及格' },
        { value: '1', label: '未参加' }
      ]
    }
  },
  methods: {
    getIsAttendClassDesc (value, row) {
      const item = this.stateOptions.find(m => m.value === value)
      return item?.label || ''
    },
    // 查询
    query () {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 重置
    reset () {
      this.blgOrgIds = []
      resetObj(this.queryForm)
      this.queryForm.pageSize = 10
      this.queryForm.currPage = 1
      this.queryForm.classId = this.classId
      this.getList()
    },
    // 获取内容
    getList () {
      console.log(this.queryForm, '打印过滤后入参')
      const data = {
        ... this.queryForm,
        busiType: this.blgOrgIds?.[0],
        orgId: this.blgOrgIds?.[1],
        isChecked: this.queryForm.isChecked || '',
        isAttendence: this.queryForm.isAttendence || '',
        isIntegration: this.queryForm.isIntegration || '',
        isAttendClass: this.queryForm.isAttendClass || [],
      }
      fetchListStudentInfos(data).then(data => {
        const { list, total } = data.RESULT_STUDENTS
        this.isShowFirstAttendance = data.RESULT_CLASS_INFO.isFourHours !== 'Y'
        this.total = total
        this.kqTableList = data.RESULT_ATTENDANCE || []
        this.kqTotal = data.RESULT_ATTENDANCE.total
        this.jfTableList = data.RESULT_INTEGRATION || []
        this.tableList = list
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
    // 导出
    download () {
      let params = {
        classId: this.classId,
        fileCode: 'afterTrainStudentModule',
        busiType: this.blgOrgIds?.[0],
        orgId: this.blgOrgIds?.[1],
        isChecked: this.queryForm.isChecked || '',
        isAttendence: this.queryForm.isAttendence || '',
        isIntegration: this.queryForm.isIntegration || '',
        isAttendClass: this.queryForm.isAttendClass || []
      }
      fetchExportListStudentInfos({ data: params })
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
<style scoped>
.tips-container {
  line-height: 20px;
  color: #888;
  padding: 0 10px;
}
</style>
