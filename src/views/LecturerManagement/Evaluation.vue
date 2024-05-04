<template>
  <div class="LecturerManagement__Apply LecturerManagement__Evaluation">
    <!-- 搜索card -->
    <el-card
      class="
        search-card
        LecturerManagement__Evaluation__search LecturerManagement__Apply__search
      "
    >
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="机构">
          <div class="df">
            <gc-institution v-model="queryForm.busiType"> </gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch" class="ml10"
              >含下属机构</el-checkbox
            >
          </div>
        </el-form-item>
        <el-form-item>
          <gc-select
            label="讲师类型"
            :options="instructorCateOptions"
            v-model="queryForm.teacherType"
            @change="instructorCateChange"
          ></gc-select>
        </el-form-item>
        <el-form-item>
          <gc-select
            label="讲师星级"
            :options="instructorLevelOptions"
            v-model="queryForm.rank"
            :disabled="instructorLevelDisable"
            placeholder="请选择"
          ></gc-select>
        </el-form-item>
        <el-form-item>
          <el-form-item class="search-card__w48 status mr10">
            <el-select v-model="dateStatus" @change="statusChange">
              <el-option label="年份" value="1"></el-option>
              <el-option label="时间段" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="search-card__date mr10"
            v-show="dateStatus === '2'"
          >
            <el-date-picker
              v-model="queryForm.dateStartTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="至"
            class="search-card__date end"
            v-show="dateStatus === '2'"
          >
            <el-date-picker
              v-model="queryForm.dateEndTime"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            class="search-card__w48 w200"
            v-show="dateStatus === '1'"
          >
            <el-date-picker
              v-model="queryForm.year"
              type="year"
              placeholder="选择年份"
              :clearable="false"
              value-format="yyyy"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>

        <el-form-item>
          <el-form-item
            class="LecturerManagement__Evaluation__search__integral__start"
          >
            <gc-input
              label="讲师积分"
              v-model="queryForm.startScore"
            ></gc-input>
          </el-form-item>
          <el-form-item
            class="LecturerManagement__Evaluation__search__integral__end"
          >
            <gc-input label="至" v-model="queryForm.endScore"></gc-input>
          </el-form-item>
        </el-form-item>
        <el-form-item class="search-card__w48">
          <div class="search-card__w48__label">
            <span>姓</span><span>名</span>
          </div>
          <gc-input
            v-model="queryForm.teacherUm"
            placeholder="请输入姓名/UM号"
          ></gc-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
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
            instructor-icons__edit
          "
        >
          <gc-tablecolumnfilters
            ref="batchOperationRef"
            className="instructor-icons__edit__icon LecturerManagement__evaluation__instructor-application"
            :list="expenseStatus"
            confirmText="确定"
            popperClass="circular"
            @filter="batchOperationConfirm"
            @reset="batchOperationReset"
            radio
          >
          </gc-tablecolumnfilters>
        </div>
        <div
          class="LecturerManagement__Apply__content__menu__batch-modification"
          @click="evaluationResultVisible = true"
        >
          <span class="instructor-icons__download">
            <i class="instructor-icons__download__icon"></i>
            评聘结果批量导入</span
          >
        </div>
        <div
          class="LecturerManagement__Apply__content__menu__export"
          @click="addInstructorVisible = true"
        >
          <span class="instructor-icons__download">
            <i class="instructor-icons__download__icon"></i>
            新增讲师批量导入</span
          >
        </div>
      </div>
      <gc-table
        :list="instructorList"
        :tableList="instructorTableList"
        ref="instructorTableRef"
        class="general__table"
      >
        <el-table-column label="讲师姓名" min-width="100">
          <template slot-scope="scope">
            <div class="active" @click="row = CopyObj(scope.row)">
              {{ scope.row.teacherName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="UM号"
          min-width="136"
          prop="teacherUm"
        ></el-table-column>
        <el-table-column
          label="归属机构"
          min-width="321"
          prop="orgName"
        ></el-table-column>
        <!-- <el-table-column
                    label="统计期积分"
                    min-width="86"
                    prop="score"
                ></el-table-column> -->
        <el-table-column
          label="授课积分"
          min-width="76"
          prop="courseScore"
        ></el-table-column>
        <!-- <el-table-column
                    label="非授课积分"
                    min-width="86"
                    prop="manageClassScore"
                ></el-table-column> -->
        <!-- <el-table-column
                    label="授课积分占比"
                    min-width="100"
                    prop=""
                ></el-table-column> -->
        <el-table-column
          label="上一年积分"
          min-width="86"
          prop="oldCourseScore"
        ></el-table-column>
        <el-table-column
          label="当前级别"
          min-width="114"
          prop="newRankDesc"
        ></el-table-column>
        <el-table-column
          label="上一次级别"
          min-width="126"
          prop="oldRankDesc"
        ></el-table-column>
        <el-table-column min-width="140">
          <template slot="header">
            <gc-tablecolumnfilters
              label="讲师状态"
              ref="statusRef"
              className="table__screen__icon"
              :list="instructorStatusOptions"
              :radio="true"
              confirmText="确定"
              popperClass="circular"
              @filter="statusFilter"
              @reset="statusReset"
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            {{ scope.row.isValid }}
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getInstructorList)"
        @currentChange="currentChange($event, queryForm, getInstructorList)"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 讲师信息dialog -->
    <InstructorInfo :row="row" :flag="true" />

    <!-- 评聘结果批量导入 dialog -->
    <InstructorBatchImport
      title="评聘结果批量导入"
      :visible="evaluationResultVisible"
      @close="evaluationResultVisible = false"
      @cancel="evaluationResultVisible = false"
      @comfirm="
        evaluationResultComfirm(
          '/common/teacherRank/uploadResult',
          'evaluationResultVisible'
        )
      "
      @change="commonFileInputChange($event, evaluationResultData, 'fileData')"
      @templateDownload="templateDownload('/common/teacherRank/adjustRank')"
    />

    <!-- 新增讲师批量导入 dialog -->
    <InstructorBatchImport
      title="新增讲师批量导入"
      :visible="addInstructorVisible"
      @close="addInstructorVisible = false"
      @cancel="addInstructorVisible = false"
      @comfirm="
        evaluationResultComfirm(
          '/common/teacherRank/uploadTeacher',
          'addInstructorVisible'
        )
      "
      @change="commonFileInputChange($event, evaluationResultData, 'fileData')"
      @templateDownload="templateDownload('/common/teacherRank/addTeacher')"
    />
  </div>
</template>

<script>
import {
  message,
  sizeChange,
  currentChange,
  getCascaderOptions,
  jsonHeaders,
  fileImportHint,
  commonFileInputChange,
  dataHeaders,
  templateDownload
} from '../../util/utils'
import { CopyObj } from '../../plugins/until'
import { handlePickerOptions } from '../../mixins/component'
import InstructorInfo from './components/InstructorInfo'
export default {
  name: 'InstructorEvaluation',
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
        // 机构名称
        orgName: '',
        // 是否包含下属机构
        isGotSubBranch: false,
        // 讲师类型
        teacherType: '',
        // 讲师星级
        rank: '',
        // 开始积分
        startScore: '',
        // 结束积分
        endScore: '',
        // 起始日期
        dateStartTime: '',
        // 结束日期
        dateEndTime: '',
        // 讲师um号
        teacherUm: '',
        // 讲师名字
        teacherName: '',
        // 积分年限
        year: '',
        // 讲师状态 Y:可以、N:停用
        status: [],
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      dateStatus: '1',
      // pagesize 改变的回掉 公共 函数
      sizeChange,
      // 分页 的页码改变 回掉 公共 函数
      currentChange,
      // 讲师类型 下拉框 options
      instructorCateOptions: [
        {
          label: '请选择',
          value: ''
        },
        {
          label: '储备培训师',
          value: '02001'
        },
        {
          label: '星级培训师',
          value: '02002'
        },
        {
          label: '培训管理师',
          value: '02003'
        },
        {
          label: '特聘培训师',
          value: '02004'
        }
      ],
      // 讲师星级 下拉框 options
      instructorLevelOptions: [
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
        }
      ],
      // 限制日期起始选择
      startPickerOptions: {},
      // 限制日期结束选择
      endPickerOptions: {},
      // 讲师信息
      instructorPersonInfo: {},
      // 讲师表格字段数组
      instructorList: [
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
      // 讲师表格数据数组
      instructorTableList: [],
      // 批量操作状态 options
      expenseStatus: [
        {
          label: '冻结',
          value: 'N'
        },
        {
          label: '解冻',
          value: 'Y'
        },
        {
          label: '升级',
          value: 'up'
        },
        {
          label: '降级',
          value: 'down'
        },
        {
          label: '维持',
          value: 'keep'
        },
        {
          label: '降储备',
          value: 'stockPlie'
        }
      ],
      // 讲师状态 options
      instructorStatusOptions: [
        {
          label: '可用',
          value: 'Y'
        },
        {
          label: '冻结',
          value: 'N'
        }
      ],
      // 评聘结果批量导入 dialog 状态
      evaluationResultVisible: false,
      // 新增讲师批量导入 dialog 状态
      addInstructorVisible: false,
      // 讲师个人信息 组件 传递的 row 对象
      row: {},
      CopyObj,
      commonFileInputChange,
      // 评聘结果批量导入 dialog 数据存放对象
      evaluationResultData: {},
      // 讲师星级是否禁用
      instructorLevelDisable: true,
      templateDownload
    }
  },
  methods: {
    // 查询
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
      this.queryForm.status = []
      this.queryForm.isGotSubBranch = false
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getInstructorList()
      this.$refs.batchOperationRef.$reset()
      this.$refs.statusRef.$reset()
    },
    // 获取讲师 数据
    getInstructorList() {
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
      this.$axios
        .post('/fn/teacher/rank/selectTeacherRankList', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorTableList = data.list
            this.total = parseInt(data.total) || 0
          }
        })
    },
    // 讲师状态 确定事件
    statusFilter(list) {
      this.queryForm.status = list.list
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 讲师状态 重置事件
    statusReset(list) {
      this.queryForm.status = []
      this.queryForm.currPage = 1
      this.getInstructorList()
    },
    // 批量操作确认事件
    batchOperationConfirm(list) {
      const operationType = list.list[0]
      if (!operationType) return
      const teacherUm =
        this.$refs.instructorTableRef.$children[0].selection.map(
          (v) => v.teacherUm
        )
      if (teacherUm.length < 1) return this.$message.warning('未选择人员')
      this.$axios
        .post(
          '/fn/teacher/rank/updateTeacherRank',
          { teacherUm, operationType },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            fileImportHint(data)
            this.getInstructorList()
          }
        })
    },
    // 批量操作取消事件
    batchOperationReset() {},
    // 积分未达到提示
    prompt() {
      this.$alert('您本年度讲师积分未达到35分，请继续努力哦！', '提示', {
        confirmButtonText: '知道了',
        customClass: `loginTimeout`
      })
    },
    // 获取讲师个人信息
    getInstructorUserInfo(teacherUm) {
      this.$axios
        .post(
          '/fn/teacher/applyStar/selectPersonInfo',
          { teacherUm },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorPersonInfo = data
          }
        })
    },
    // 评聘结果 新增讲师 批量导入 确定事件 公共函数
    evaluationResultComfirm(url, key) {
      const data = new FormData()
      data.append('file', this.evaluationResultData.fileData)
      this.$axios.post(url, data, dataHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          fileImportHint(data)
        }
      })
      this[key] = false
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
    },
    // 讲师类型select change事件
    instructorCateChange(data) {
      if (data === '02002') {
        this.instructorLevelDisable = false
        this.queryForm.rank = '02002001'
      } else {
        this.instructorLevelDisable = true
        this.queryForm.rank = null
      }
    },
    statusChange(value) {
      if (value === '1') {
        this.queryForm.dateStartTime = ''
        this.queryForm.dateEndTime = ''
      } else {
        this.queryForm.year = ''
      }
    }
  },
  mounted() {
    this.delayGetData()
  }
}
</script>

<style lang="scss">
.LecturerManagement {
  &__Evaluation {
    &__search {
      &__integral {
        &__start,
        &__end {
          .el-input {
            width: 84px !important;
          }
        }
        &__start {
          margin-right: 10px !important;
        }
      }
      .LecturerManagement__Apply__search__select.search-card__w48 {
        margin-right: 93px !important;
        .el-form-item__content {
          float: unset;
        }
      }
      .el-form-item.w200 {
        .el-date-editor {
          width: 200px;
        }
      }
      .status {
        width: 72px;
      }
      .search-card__date.end {
        margin-right: 36px;
      }
    }

    .LecturerManagement__Apply__content__table {
      overflow-x: auto;
      border: 1px solid #eaecf1;
      .el-table {
        border: none;
      }
    }

    .LecturerManagement__Apply__instructor-info__box__base__integral__items__item {
      margin-right: 10px !important;
      &:nth-child(2n) {
        margin-right: 0 !important;
      }
      &:last-child {
        margin-bottom: 0;
      }
      &.w61 {
        width: 61px;
      }
    }

    .LecturerManagement__Apply__content__menu__instructor-application
      .el-popover__reference
      span {
      display: none;
    }

    .instructor-icons__edit {
      margin-right: 40px;
    }

    .instructor-icons__edit__icon {
      display: flex;
      width: 68px;
      padding-left: 20px;
      text-align: right;
      align-items: center;
      background-position: left center;
      &::after {
        content: '批量操作';
      }
    }
  }
}
</style>