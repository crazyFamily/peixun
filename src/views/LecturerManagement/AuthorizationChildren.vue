<template>
  <div class="LecturerManagement__AuthorizationChildren">
    <!-- 搜索card -->
    <el-card
      class="search-card LecturerManagement__AuthorizationChildren__search-card"
    >
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item
          class="
            LecturerManagement__Apply__search__select
            LecturerManagement__AuthorizationChildren__search-card__select
          "
          label="计划部门"
        >
          <gc-institution v-model="queryForm.busiType"> </gc-institution>
          <el-checkbox v-model="queryForm.isGotSubBranch"
            >含下属机构</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <gc-input label="讲师姓名" v-model="queryForm.teacherUm"></gc-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="LecturerManagement__AuthorizationChildren__content mt10">
      <div
        class="LecturerManagement__AuthorizationChildren__content__menu menu"
      >
        <div
          class="
            LecturerManagement__AuthorizationChildren__content__menu__course-name
          "
        >
          课程名称： {{ courseInfo.courseName }}
        </div>
        <div class="df">
          <div
            class="
              LecturerManagement__AuthorizationChildren__content__menu__instructor-application
            "
            @click="
              courseInfoVisible = true
              courseInfoForm = {}
            "
          >
            <span class="instructor-icons__add">
              <i class="instructor-icons__add__icon"></i>
              新增</span
            >
          </div>
          <div
            class="
              LecturerManagement__AuthorizationChildren__content__menu__instructor-application
            "
            @click="instructorAuthorizationAllImportVisible = true"
          >
            <span class="instructor-icons__download">
              <i class="instructor-icons__download__icon"></i>
              批量导入</span
            >
          </div>
        </div>
      </div>
      <gc-table
        :list="instructorList"
        :tableList="instructorTableList"
        class="
          LecturerManagement__AuthorizationChildren__content__table
          general__table
        "
      >
        <el-table-column label="讲师姓名" min-width="100">
          <template slot-scope="scope">
            <span class="active" @click="row = CopyObj(scope.row)">
              {{ scope.row.teacherName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="归属机构"
          prop="orgName"
          min-width="300"
        ></el-table-column>
        <el-table-column
          label="授权开始时间"
          prop="grantDateStart"
          min-width="200"
        ></el-table-column>
        <el-table-column
          label="授权结束时间"
          prop="grantDateEnd"
          min-width="200"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="">
              <span
                v-if="scope.row.isValid === 'Y'"
                class="active"
                @click="cancelAuthorization(scope.row, 'N')"
                >取消授权</span
              >
              <!-- <span
                                v-else
                                class="active"
                                @click="authorizationFun(scope.row, 'Y')"
                                >授权</span
                            > -->
            </div>
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
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 课程信息 dialog -->
    <gc-model
      title="课程信息"
      :visible="courseInfoVisible"
      width="500px"
      @close="courseInfoVisible = false"
      class="LecturerManagement__AuthorizationChildren__course-info"
      @comfirm="courseInfoComfirm"
      @cancel="
        courseInfoForm = {}
        courseInfoVisible = false
      "
    >
      <el-form
        ref="form"
        :model="courseInfoForm"
        label-width="60px"
        @submit.native.prevent
      >
        <el-form-item label="UM号">
          <el-input
            v-model="courseInfoForm.teacherUm"
            placeholder="请输入UM号"
          ></el-input>
          <el-button @click="checkTeacherUm">检查</el-button>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="courseInfoForm.teacherName" disabled></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="courseInfoForm.orgName" disabled></el-input>
        </el-form-item>
        <el-form-item label="授权时间" class="search-card__date">
          <el-date-picker
            v-model="courseInfoForm.grantDate"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <div
            class="
              LecturerManagement__AuthorizationChildren__course-info__item-wraning
            "
          >
            <i class="icons__wraning"></i>
            实际授权时间
          </div>
        </el-form-item>
      </el-form>
    </gc-model>

    <!-- 讲师授权（单课程）批量导入 dialog -->
    <InstructorBatchImport
      title="讲师授权（单课程）批量导入"
      :visible="instructorAuthorizationAllImportVisible"
      @cancel="instructorAuthorizationAllImportVisible = false"
      @close="
        instructorAuthorizationAllImportVisible = false
        instructorAuthorizationAllImportFile = {}
      "
      @comfirm="instructorAuthorizationAllImportComfirm"
      @change="inputChange"
      @templateDownload="
        templateDownload('/common/teacherImpower/singleCourse')
      "
    />

    <!-- 讲师信息dialog -->
    <InstructorInfo :row="row" />
  </div>
</template>

<script>
import {
  CopyObj,
  message,
  sizeChange,
  currentChange,
  getCascaderOptions,
  jsonHeaders,
  fileImportHint,
  templateDownload,
  dataHeaders
} from '../../util/utils'
import { formatDate } from '../../plugins/until'
import InstructorInfo from './components/InstructorInfo'
export default {
  name: 'AuthorizationChildren',
  components: { InstructorInfo },
  data() {
    return {
      // 分页总条数
      total: 0,
      // 查询表单
      queryForm: {
        // 是否零售  LS:零售   ，FL：非零
        busiType: [],
        // 是否包含下属机构
        isGotSubBranch: '',
        // 课程名称
        teacherUm: '',
        // 课程类型
        courseType: '',
        // 课程id
        courseId: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      // pagesize 改变的回掉 公共 函数
      sizeChange,
      // 分页 的页码改变 回掉 公共 函数
      currentChange,
      // 讲师表格字段数组
      instructorList: [
        {
          type: 'index',
          label: '序号'
        }
      ],
      // 讲师表格数据数组
      instructorTableList: [],
      // 课程信息对象
      courseInfo: {},
      // 课程信息 dialog 状态
      courseInfoVisible: false,
      // 课程信息 form 表单
      courseInfoForm: {},
      // 讲师授权（单课程）批量导入 dialog 状态
      instructorAuthorizationAllImportVisible: false,
      // 讲师授权（单课程）批量导入 文件对象
      instructorAuthorizationAllImportFile: {},
      // 讲师信息数据
      row: {},
      CopyObj,
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
      this.queryForm.busiType = []
      this.queryForm.teacherUm = ''
      this.queryForm.courseName = ''
      this.queryForm.isGotSubBranch = false
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getInstructorList()
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
        .post(
          '/fn/teacher/impower/selectImpowerTeacherList',
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
    // 取消授权提示
    cancelAuthorization(row) {
      this.$alert('是否确定取消授权？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        cancelButtonClass: 'cancel-button',
        customClass: `loginTimeout`
      })
        .then((res) => {
          if (res === 'confirm') {
            this.authorizationFun(row, 'N')
          }
        })
        .catch((err) => err)
    },
    // 检查 um是否可用
    checkTeacherUm() {
      const { teacherUm } = this.courseInfoForm
      if (!teacherUm || !teacherUm.trim()) {
        return this.$message.warning('请输入um')
      }
      this.$axios
        .post(
          '/fn/teacher/impower/selectCheckIsValidTeacher',
          { teacherUm },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.teacherUm = data.teacherUm
            data.teacherName = data.teacherName
            this.courseInfoForm = data
          }
        })
    },
    // 授权 取消授权 函数
    authorizationFun(row, isValid) {
      const data = CopyObj(this.courseInfo)
      data.teacherUm = row.teacherUm
      data.isValid = isValid
      const messageText = isValid === 'N' ? '取消授权成功' : '授权成功'
      this.$axios
        .post('/fn/teacher/impower/modifyGrand', { data }, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success(messageText)
            this.getInstructorList()
          }
        })
    },
    // 新增讲师授权 确定事件
    courseInfoComfirm() {
      if (!this.courseInfoForm.orgId) {
        return this.$message.warning('讲师信息不合法')
      }
      const date = formatDate(new Date() + 3600000 * 24)
      if (this.courseInfoForm.grantDate > date) {
        return this.$message.warning('授权时间不能大于当前时间')
      }
      const data = CopyObj(this.courseInfoForm)
      data.courseId = this.courseInfo.courseId
      this.$axios
        .post('/fn/teacher/impower/addPowerTeacher', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.courseInfoVisible = false
            this.getInstructorList()
            this.$message.success('新增成功')
          }
        })
    },
    // 单课程批量导入 input change 事件
    inputChange($event) {
      this.instructorAuthorizationAllImportFile = $event.target.files[0] || {}
    },
    instructorAuthorizationAllImportComfirm() {
      const data = new FormData()
      if (!this.instructorAuthorizationAllImportFile.size) {
        return (this.instructorAuthorizationAllImportVisible = false)
      }
      data.append('file', this.instructorAuthorizationAllImportFile)
      data.append('courseId', this.courseInfo.courseId)
      data.append('courseName', this.courseInfo.courseName)
      this.$axios
        .post('/common/teacherImpower/uploadTeacher', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            fileImportHint(data)
            this.getInstructorList()
          }
        })
      this.instructorAuthorizationAllImportVisible = false
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
    this.courseInfo = this.$route.params
    if (!this.courseInfo.courseName) {
      this.$router.push('/InstructorAuthorization')
    } else {
      this.queryForm.courseType = this.courseInfo.courseType
      this.queryForm.courseId = this.courseInfo.courseId
      this.delayGetData()
    }
  }
}
</script>

<style lang="scss">
.LecturerManagement {
  &__AuthorizationChildren {
    &__search-card {
      &__select {
        &.LecturerManagement__Apply__search__select {
          margin-right: 100px !important;
        }
      }
    }
    &__content {
      &__menu {
        &__course-name {
          font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC',
            'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
        }
      }
    }
    .LecturerManagement__icons__add__icon {
      background-image: url('../../assets/svg/tianjiahui.svg');
    }
    &__course-info {
      &__item-wraning {
        display: flex;
        position: absolute;
        height: 18px;
        left: 0;
        top: 40px;
        align-items: center;
        color: #7d8292;
        .icons__wraning {
          top: 0;
          width: 17px;
        }
      }
      .el-form {
        .el-form-item__content {
          display: flex !important;
        }
        .el-button {
          width: 54px;
          height: 30px;
          margin-left: 10px;
          padding: 6px 0;
          text-align: center;
          border-color: #fd6720;
          flex-shrink: 0;
          span {
            color: #fd6720;
          }
        }
        .el-date-editor {
          width: 100% !important;
        }
      }
      .el-dialog__body {
        padding-bottom: 25px !important;
      }
    }
  }
}
</style>