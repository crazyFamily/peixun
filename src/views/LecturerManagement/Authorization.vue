<template>
  <div class="LecturerManagement__Authorization">
    <!-- 搜索card -->
    <el-card class="search-card LecturerManagement__Authorization__search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item
          class="LecturerManagement__Authorization__search-card__select"
          v-if="$store.state.userInfo.blgStripLine !== 'JF'"
        >
          <gc-select
            label="条线分类"
            v-model="queryForm.blgStripLine"
            :orgOptions="orgOptions"
          >
          </gc-select>
        </el-form-item>
        <el-form-item class="">
          <gc-input label="课程名称" v-model="queryForm.courseName"></gc-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <!-- 内容card -->
    <el-card class="LecturerManagement__Authorization__content mt10">
      <div class="LecturerManagement__Authorization__content__menu menu-right">
        <div
          class="
            LecturerManagement__Authorization__content__menu__instructor-application
          "
          @click="instructorAuthorizationsAllImportVisible = true"
        >
          <span class="instructor-icons__download">
            <i class="instructor-icons__download__icon"></i>
            批量导入</span
          >
        </div>
      </div>
      <gc-table
        :list="instructorList"
        :tableList="instructorTableList"
        class="LecturerManagement__Authorization__content__table general__table"
      >
        <el-table-column label="课程名称">
          <template slot-scope="scope">
            <div class="active" @click="checkInstructor(scope.row)">
              {{ scope.row.courseName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已授权讲师数" prop="courseNum">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="">
              <span class="active" @click="goToChildrenPage(scope.row)"
                >授权讲师</span
              >
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
      :visible="checkCourseInfoVisible"
      :isShowFooter="false"
      width="500px"
      @close="checkCourseInfoVisible = false"
      class="LecturerManagement__Authorization__check-course-info"
    >
      <div class="LecturerManagement__Authorization__check-course-info__items">
        <!-- <div
                    class="LecturerManagement__Authorization__check-course-info__items__item"
                >
                    <div
                        class="LecturerManagement__Authorization__check-course-info__items__item__left"
                    >
                        课程编码
                    </div>
                    <div
                        class="LecturerManagement__Authorization__check-course-info__items__item__right"
                    >
                        {{ courseDetailInfo.courseCode }}
                    </div>
                </div> -->
        <div
          class="
            LecturerManagement__Authorization__check-course-info__items__item
          "
        >
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__left
            "
          >
            课程名称
          </div>
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__right
            "
          >
            {{ courseDetailInfo.courseName }}
          </div>
        </div>
        <div
          class="
            LecturerManagement__Authorization__check-course-info__items__item
          "
        >
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__left
            "
          >
            机构部门
          </div>
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__right
            "
          >
            {{ courseDetailInfo.orgName }}
          </div>
        </div>
        <div
          class="
            LecturerManagement__Authorization__check-course-info__items__item
          "
        >
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__left
            "
          >
            是否阶梯课程
          </div>
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__right
            "
          >
            <el-checkbox
              disabled
              :value="courseDetailInfo.courseType === '02001'"
            ></el-checkbox>
          </div>
        </div>
        <div
          class="
            LecturerManagement__Authorization__check-course-info__items__item
          "
        >
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__left
            "
          >
            课程适用对象
          </div>
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__right
            "
          >
            {{ courseDetailInfo.courseApply }}
          </div>
        </div>
        <div
          class="
            LecturerManagement__Authorization__check-course-info__items__item
          "
        >
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__left
              t10
            "
          >
            课程简介
          </div>
          <div
            class="
              LecturerManagement__Authorization__check-course-info__items__item__right
            "
          >
            <el-input
              type="textarea"
              show-word-limit
              resize="none"
              placeholder="请输入"
              :value="courseDetailInfo.courseIntro"
            ></el-input>
          </div>
        </div>
      </div>
    </gc-model>

    <!-- 讲师授权（多课程）批量导入 dialog -->
    <InstructorBatchImport
      title="讲师授权（多课程）批量导入"
      :visible="instructorAuthorizationsAllImportVisible"
      @close="
        instructorAuthorizationsAllImportVisible = false
        instructorAuthorizationsAllImportFile = {}
      "
      @cancel="instructorAuthorizationsAllImportVisible = false"
      @comfirm="instructorAuthorizationsAllImportComfirm"
      @change="inputChange"
      @templateDownload="templateDownload('/common/teacherImpower/moreCourse')"
    />
  </div>
</template>

<script>
import {
  message,
  sizeChange,
  currentChange,
  fileImportHint,
  addAllowKeepAlive,
  jsonHeaders,
  templateDownload,
  dataHeaders
} from '../../util/utils'
import { CopyObj } from '../../plugins/until'
export default {
  name: 'InstructorAuthorization',
  data() {
    return {
      // 分页总条数
      total: 0,
      // 查询表单
      queryForm: {
        // 是否零售  LS:零售   ，FL：非零
        busiType: '',
        // 课程名称
        courseName: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      // 级联选择框 options
      orgOptions: [
        {
          label: '零售',
          value: 'LS'
        },
        {
          label: '非零',
          value: 'FL'
        }
      ],
      // 讲师表格字段数组
      instructorList: [
        {
          type: 'index',
          label: '序号',
          width: '268'
        }
      ],
      // 讲师表格数据数组
      instructorTableList: [],
      // 课程详细信息
      courseDetailInfo: {},
      // pagesize 改变的回掉 公共 函数
      sizeChange,
      // 分页 的页码改变 回掉 公共 函数
      currentChange,
      // 讲师授权（多课程）批量导入 dialog 状态
      instructorAuthorizationsAllImportVisible: false,
      // 查看 课程信息 dialog 状态
      checkCourseInfoVisible: false,
      // 课程导入 文件存放对象
      instructorAuthorizationsAllImportFile: {},
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
      this.queryForm.busiType = ''
      this.queryForm.courseName = ''
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getInstructorList()
    },
    // 获取讲师 数据
    getInstructorList() {
      const data = CopyObj(this.queryForm)
      if (!data.busiType) {
        data.busiType = this.$store.state.userInfo.blgStripLine
      }
      this.$axios
        .post('/fn/teacher/impower/selectCourseList', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorTableList = data.list
            this.total = parseInt(data.total) || 0
          }
        })
    },
    // 跳转到授权子页面
    goToChildrenPage(row) {
      addAllowKeepAlive('/InstructorAuthorization')
      this.$router.push({ name: '授权课程讲师', params: row })
    },
    // 查看课程信息
    checkInstructor(row) {
      const { courseId, courseName, busiType } = row
      this.$axios
        .post(
          '/fn/course/commom/selectCourseDetail',
          { courseId, courseName, busiType },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.courseDetailInfo = data
          }
        })
      this.checkCourseInfoVisible = true
    },
    // 多课程批量导入 input change 事件
    inputChange($event) {
      this.instructorAuthorizationsAllImportFile = $event.target.files[0] || {}
    },
    //  多课程批量导入确认事件
    instructorAuthorizationsAllImportComfirm() {
      const data = new FormData()
      if (!this.instructorAuthorizationsAllImportFile.size) {
        return (this.instructorAuthorizationsAllImportVisible = false)
      }
      data.append('file', this.instructorAuthorizationsAllImportFile)
      this.$axios
        .post('/common/teacherImpower/uploadCourse', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            fileImportHint(data)
          }
        })
      this.instructorAuthorizationsAllImportVisible = false
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
    this.delayGetData()
  }
}
</script>

<style lang="scss">
.LecturerManagement {
  &__Authorization {
    &__search-card {
      &__select {
        &.LecturerManagement__Apply__search__select {
          margin-right: 100px !important;
        }
      }
    }
    &__content {
      th,
      td {
        &:first-child {
          .cell {
            padding-left: 15px;
            justify-content: flex-start;
          }
        }
      }
    }
    &__check-course-info {
      &__items {
        &__item {
          display: flex;
          margin-bottom: 20px;
          line-height: 18px;
          &:last-child {
            margin-bottom: 0;
          }
          &__left {
            width: 72px;
            margin-right: 15px;
            text-align: right;
            color: #7d8292;
            &.t10 {
              position: relative;
              top: 10px;
            }
          }
          &__right {
            flex: 1;
            textarea {
              width: 100%;
              height: 100px;
            }
          }
        }
      }
      textarea {
        padding: 10px;
      }
    }
  }
}
</style>