<template>
  <div class="trainer-management__trainer-info">
    <el-card class="figure">
      <div class="head-img">
        <img :src="handleUdmpHref(courseInfoObj.headUdmp)" alt="" />
      </div>
      <div class="figure-info">
        <div class="base">
          <span class="name">{{ courseInfoObj.teacherName }}</span>
          <span class="um">{{ courseInfoObj.teacherUm }}</span>
          <span
            class="tag"
            v-for="item in (courseInfoObj.titleName || '').split(',')"
            :key="item"
            >{{ item }}</span
          >
        </div>
        <div class="org">
          <span>{{ courseInfoObj.orgName }}</span>
          <!-- <span>所属客群</span> -->
          <span>{{ courseInfoObj.postDesc }}</span>
        </div>
        <div class="goodAtAreas">
          <span>擅长领域：</span>
          <span>
            {{ (courseInfoObj.goodAtAreasName || '').split(',').join('、') }}
          </span>
        </div>
        <div class="introduce">
          <span>简介：</span>
          <span>{{ courseInfoObj.introduce }}</span>
        </div>
      </div>
    </el-card>
    <el-card class="content-box">
      <el-tabs v-model="activeName">
        <el-tab-pane name="course">
          <div slot="label" class="aic">
            教授课程
            <!-- <div class="dot16">
                            10
                        </div> -->
          </div>
          <gc-table
            class="general__table table-left"
            :list="courseList"
            :tableList="courseTableList"
          >
            <el-table-column label="课程状态" min-width="92">
              <template slot-scope="scope">
                <gc-tag size="mini">{{ scope.row.courseStatusName }}</gc-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="78" class-name="p0">
              <el-tooltip
                placement="left"
                :visible-arrow="false"
                popper-class="bgf shadow-1"
              >
                <div slot="content" class="tooltip__operation">
                  <span class="active">查看学员</span>
                  <span class="active">课程报表</span>
                </div>
                <el-button class="button-48-24">操作</el-button>
              </el-tooltip>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="courseForm.total"
            :page-sizes="[10, 20]"
            :page-size="courseForm.size"
            :current-page="courseForm.page"
            @sizeChange="sizeChange($event, courseForm, getCourseList)"
            @currentChange="currentChange($event, courseForm, getCourseList)"
            class="between"
          />
        </el-tab-pane>
        <el-tab-pane name="live">
          <div slot="label" class="aic">
            直播
            <!-- <div class="dot16">
                            10
                        </div> -->
          </div>
          <gc-table
            class="general__table table-left"
            :list="liveList"
            :tableList="liveTableList"
          >
            <el-table-column label="课程状态" min-width="92">
              <template slot-scope="scope">
                <gc-tag size="mini">{{ scope.row.liveStatus }}</gc-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="78" class-name="p0">
              <el-tooltip
                placement="left"
                :visible-arrow="false"
                popper-class="bgf shadow-1"
              >
                <div slot="content" class="tooltip__operation">
                  <span class="active">讲师邀请码</span>
                  <span class="active">学员邀请码</span>
                </div>
                <el-button class="button-48-24">操作</el-button>
              </el-tooltip>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="liveForm.total"
            :page-sizes="[10, 20]"
            :page-size="liveForm.size"
            :current-page="liveForm.page"
            @sizeChange="sizeChange($event, liveForm, getLiveList)"
            @currentChange="currentChange($event, liveForm, getLiveList)"
            class="between"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import gcTag from '@/components/chunk/tag'
import {
  jsonHeaders,
  handleUdmpHref,
  sizeChange,
  currentChange
} from '../../../util/utils'
export default {
  name: 'CRBroadcastPreview',
  components: { gcTag },
  data() {
    return {
      // 讲师详情对象
      courseInfoObj: {},
      // establishInfo: {},
      // 激活的 tab页
      activeName: 'course',
      // 教授课程 表格字段数组
      courseList: [
        {
          type: 'component',
          label: '课程名称',
          width: '124',
          'show-overflow-tooltip': true,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  { class: 'active underline ellipsis' },
                  row.courseName
                )
              }
            }
          }
        },
        {
          label: '课程系列',
          prop: 'courseClassifyName',
          width: '108'
        },
        {
          label: '课程来源',
          prop: 'source',
          width: '106'
        },
        {
          label: '课程时长',
          prop: 'courseTime',
          width: '108'
        },
        {
          label: '课程学员',
          prop: 'studentCount',
          width: '102'
        },
        {
          label: '完成课程学员',
          prop: 'studentFinshCount',
          width: '126'
        },
        {
          label: '课程练习（题）',
          prop: 'courseTrain',
          width: '138'
        },
        {
          label: '完成练习学员',
          prop: 'fishTrainStudent',
          width: '126'
        },
        {
          label: '练习平均得分',
          prop: 'TrainAvgScore',
          width: '126'
        }
      ],
      // 教授课程 表格数据数组
      courseTableList: [],
      // 教授课程 分页表单
      courseForm: {
        page: 1,
        size: 10,
        total: 0
      },
      // 直播 表格字段数组
      liveList: [
        {
          type: 'component',
          label: '直播名称',
          width: '150',
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  { class: 'active underline ellipsis' },
                  row.liveName
                )
              }
            }
          }
        },
        {
          label: '直播标签',
          prop: 'liveTag',
          width: '132'
        },
        {
          label: '关联课程',
          prop: 'linkCourse',
          width: '126'
        },
        {
          label: '直播开始时间',
          prop: 'liveStartTime',
          width: '204'
        },
        {
          label: '直播结束时间',
          prop: 'liveEndTime',
          width: '102'
        },
        {
          label: '预约人数',
          prop: 'appointmentCount',
          width: '126'
        },
        {
          label: '观看人数',
          prop: 'watchCount',
          width: '126'
        }
      ],
      // 直播 表格数据数组
      liveTableList: [],
      // 直播 分页表单
      liveForm: {
        page: 1,
        size: 10,
        total: 0
      },
      handleUdmpHref,
      // 分页工具函数
      sizeChange,
      currentChange
    }
  },
  methods: {
    // 获取  教授课程 表格数据
    getCourseList() {
      this.courseForm.teacherUm = this.courseInfoObj.teacherUm
      this.$axios
        .post(
          '/fn/privatewealth/teacher/teacherCourse',
          this.courseForm,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            this.courseTableList = list
            this.courseForm.total = total
          }
        })
    },
    // 获取  直播 表格数据
    getLiveList() {
      // this.liveForm.teacherUm = this.courseInfoObj.teacherUm;
      // this.$axios
      //     .post(
      //         "/fn/privatewealth/teacher/teacherLive",
      //         this.liveForm,
      //         jsonHeaders
      //     )
      //     .then(res => {
      //         const { code, data } = res.data;
      //         if (code === 0) {
      //             const { total, list } = data;
      //             this.liveTableList = list;
      //             this.liveForm.total = total;
      //         }
      //     });
    }
  },
  activated() {
    const params = this.$route.params
    if (params.id) {
      this.id = params.id
      this.$nextTick(() => {
        this.backgroundDataToCurrentPageData(params)
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/commonScss/common-variate.scss';
.trainer-management__trainer-info {
  .figure {
    .el-card__body {
      display: flex;
    }

    .head-img,
    .head-img img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
    }
    .head-img {
      margin-right: 20px;
    }
    .figure-info {
      .base {
        display: flex;
        align-items: center;
        font-size: 16px;
        .um {
          margin: 0 10px;
          color: $tintColor6;
        }
        .tag {
          height: 22px;
          padding: 2px 8px 3px;
          margin-right: 10px;
          background-color: #f5faff;
          color: #2d91ff;
          border-radius: 10.5px;
          font-size: 12px;
        }
      }
      .org {
        margin-top: 6px;
        font-size: 14px;
        span {
          margin-right: 10px;
        }
      }
      .goodAtAreas {
        margin-top: 6px;
        font-size: 14px;
        color: $tintColor6;
      }
      .introduce {
        margin: 10px 0;
        color: $tintColor6;
      }
    }
  }
  .content-box {
    margin-top: 8px;
    .el-card__body {
      padding: 0;
    }
    .el-tabs__content {
      margin: 5px 15px 40px;
    }
    .p0 {
      .cell {
        padding-right: 0;
      }
    }
    .dot16 {
      margin-left: 8px;
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      color: #fff;
    }
  }
}
</style>
