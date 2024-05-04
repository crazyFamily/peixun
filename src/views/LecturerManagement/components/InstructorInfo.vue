<template>
  <!-- 讲师信息dialog -->
  <gc-model
    title="讲师信息"
    :visible="instructorInfoVisible"
    :isShowFooter="false"
    width="1100px"
    @close="instructorInfoVisible = false"
    class="instructor-info LecturerManagement__common-dialog"
  >
    <div class="instructor-info__box LecturerManagement__common-dialog__box">
      <!-- 左侧用户信息 -->
      <div class="instructor-info__box__base" v-if="!flag">
        <ul class="instructor-info__box__base__user userinfo-items">
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
              <span>出生日期</span>
            </div>
            <div class="userinfo-items__item__right">
              {{ instructorPersonInfo.dateBirth }}
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
        </ul>
        <div class="instructor-info__box__base__integral">
          <div>
            <div class="instructor-info__box__base__integral__title">
              近三年积分情况
            </div>
            <div class="instructor-info__box__base__integral__items">
              <div class="instructor-info__box__base__integral__items__item">
                {{ instructorPersonInfo.beforeYear }}
              </div>
              <div class="instructor-info__box__base__integral__items__item">
                {{ instructorPersonInfo.yesterYear }}
              </div>
              <div class="instructor-info__box__base__integral__items__item">
                {{ instructorPersonInfo.thisYear }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 左侧用户信息 -->
      <div class="instructor-info__box__base" v-else>
        <ul class="instructor-info__box__base__user userinfo-items">
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
              <span>性</span>
              <span>别</span>
            </div>
            <div class="userinfo-items__item__right">
              {{ instructorPersonInfo.gender }}
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
              <span>PS</span>
              <span>岗位</span>
            </div>
            <div class="userinfo-items__item__right l22">
              {{ instructorPersonInfo.positionDesc }}
            </div>
          </li>

          <li class="userinfo-items__item">
            <div class="userinfo-items__item__left">
              <span>讲师类型</span>
            </div>
            <div class="userinfo-items__item__right">
              {{ instructorPersonInfo.description }}
            </div>
          </li>
          <li class="userinfo-items__item">
            <div class="userinfo-items__item__left">
              <span>讲师星级</span>
            </div>
            <div class="userinfo-items__item__right">
              {{ instructorPersonInfo.rankDesc }}
            </div>
          </li>
          <li class="userinfo-items__item">
            <div class="userinfo-items__item__left">
              <span>讲师积分</span>
            </div>
            <div class="userinfo-items__item__right">
              <div class="instructor-info__box__base__integral__items">
                <div class="instructor-info__box__base__integral__items__item">
                  {{ instructorPersonInfo.beforeYear }}
                </div>
                <div class="instructor-info__box__base__integral__items__item">
                  {{ instructorPersonInfo.yesterYear }}
                </div>
                <div
                  class="
                    instructor-info__box__base__integral__items__item
                    margin-0
                  "
                >
                  {{ instructorPersonInfo.thisYear }}
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div class="userinfo-items__item pl20">
          <div class="userinfo-items__item__left">
            <span>当年授课 满意度</span>
          </div>
          <div class="userinfo-items__item__right">
            <div
              class="
                instructor-info__box__base__integral__items__item
                instructor-info__box__base__teacher-score
              "
            >
              {{ instructorPersonInfo.teacherScore }}
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧 tabs 栏 -->
      <div class="instructor-info__box__tabs table-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="讲师授课记录" name="lectureRecord">
            <div
              class="instructor-info__box__tabs__lecture-record"
              v-if="activeName === 'lectureRecord'"
            >
              <gc-table
                :list="lectureRecordList"
                :tableList="lectureRecordTableList"
                class="general__table"
              ></gc-table>
              <gc-pagination
                :total="lectureRecordForm.total"
                layout="prev, pager, next,slot, sizes"
                prev-text=""
                next-text=""
                :page-sizes="[5]"
                :page-size="lectureRecordForm.pageSize"
                :current-page="lectureRecordForm.currPage"
                @sizeChange="
                  sizeChange(
                    $event,
                    lectureRecordForm,
                    instructorInfoCommonFun,
                    'TeaCourseList'
                  )
                "
                @currentChange="
                  currentChange(
                    $event,
                    lectureRecordForm,
                    instructorInfoCommonFun,
                    'TeaCourseList'
                  )
                "
              ></gc-pagination>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane
                        label="讲师授权记录"
                        name="authorizationRecord"
                    >
                        <div
                            class="instructor-info__box__tabs__authorization-record"
                            v-if="activeName === 'authorizationRecord'"
                        >
                            <gc-table
                                :list="authorizationRecordList"
                                :tableList="authorizationRecordTableList"
                                class="general__table"
                            ></gc-table>
                            <gc-pagination
                                :total="authorizationRecordForm.total"
                                layout="prev, pager, next,slot, sizes"
                                prev-text=""
                                next-text=""
                                :page-sizes="[5]"
                                :page-size="authorizationRecordForm.pageSize"
                                :current-page="authorizationRecordForm.currPage"
                                @sizeChange="
                                    sizeChange(
                                        $event,
                                        authorizationRecordForm,
                                        instructorInfoCommonFun,
                                        'TeaPowerList'
                                    )
                                "
                                @currentChange="
                                    currentChange(
                                        $event,
                                        authorizationRecordForm,
                                        instructorInfoCommonFun,
                                        'TeaPowerList'
                                    )
                                "
                            ></gc-pagination>
                        </div>
                    </el-tab-pane> -->
          <el-tab-pane
            label="讲师评聘记录"
            name="evaluationRecord"
            v-if="!flag"
          >
            <div
              class="
                instructor-info__box__tabs__evaluation-record
                super-long-table
              "
              v-if="activeName === 'evaluationRecord'"
            >
              <gc-table
                :list="evaluationRecordList"
                :tableList="evaluationRecordTableList"
                class="general__table"
              ></gc-table>
              <gc-pagination
                :total="evaluationRecordForm.total"
                layout="prev, pager, next,slot, sizes"
                prev-text=""
                next-text=""
                :page-sizes="[5]"
                :page-size="evaluationRecordForm.pageSize"
                :current-page="evaluationRecordForm.currPage"
                @sizeChange="
                  sizeChange(
                    $event,
                    evaluationRecordForm,
                    instructorInfoCommonFun,
                    'PromoteList'
                  )
                "
                @currentChange="
                  currentChange(
                    $event,
                    evaluationRecordForm,
                    instructorInfoCommonFun,
                    'PromoteList'
                  )
                "
              ></gc-pagination>
            </div>
          </el-tab-pane>
          <!-- <el-tab-pane
                        label="讲师奖惩记录"
                        name="rewardPunishmentRecord"
                        v-if="!flag"
                    >
                        <div
                            class="instructor-info__box__tabs__reward-punishment-record super-long-table"
                            v-if="activeName === 'rewardPunishmentRecord'"
                        >
                            <gc-table
                                :list="rewardPunishmentRecordList"
                                :tableList="rewardPunishmentRecordTableList"
                                class="general__table"
                            >
                                <el-table-column
                                    label="奖励情况"
                                    min-width="208"
                                >
                                    <template slot-scope="scope">
                                        <gc-tooltip height="34px">
                                            {{ scope.row.rwrdPnshInfo }}
                                        </gc-tooltip>
                                    </template>
                                </el-table-column>
                            </gc-table>
                            <gc-pagination
                                :total="rewardPunishmentRecordForm.total"
                                layout="prev, pager, next,slot, sizes"
                                prev-text=""
                                next-text=""
                                :page-sizes="[5]"
                                :page-size="rewardPunishmentRecordForm.pageSize"
                                :current-page="
                                    rewardPunishmentRecordForm.currPage
                                "
                                @sizeChange="
                                    sizeChange(
                                        $event,
                                        rewardPunishmentRecordForm,
                                        instructorInfoCommonFun,
                                        'RewAndPuList'
                                    )
                                "
                                @currentChange="
                                    currentChange(
                                        $event,
                                        rewardPunishmentRecordForm,
                                        instructorInfoCommonFun,
                                        'RewAndPuList'
                                    )
                                "
                            ></gc-pagination>
                        </div>
                    </el-tab-pane> -->
        </el-tabs>
      </div>
    </div>
  </gc-model>
</template>

<script>
import { sizeChange, currentChange, jsonHeaders } from '../../../util/utils'
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    flag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //  讲师信息 dialog 状态
      instructorInfoVisible: false,
      // 讲师个人信息
      instructorPersonInfo: {},
      // tabs 默认选中项
      activeName: 'lectureRecord',
      // 讲师授课记录 table 字段数组
      lectureRecordList: [
        {
          width: '229',
          label: '课程',
          prop: 'courseName'
        },
        {
          width: '210',
          label: '培训班',
          prop: 'className'
        },
        {
          width: '162',
          label: '授课时间',
          prop: 'courseDate'
        },
        {
          width: '95',
          label: '授课评分',
          prop: 'courseScore'
        }
      ],
      // 讲师授课记录 table 数据数组
      lectureRecordTableList: [],
      // 讲师授课记录 table 分页参数
      lectureRecordForm: {
        teacherUm: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      // 讲师授权记录 table 字段数组
      authorizationRecordList: [
        {
          width: '250',
          label: '课程',
          prop: 'courseName'
        },
        {
          width: '184',
          label: '授权时间',
          prop: 'authStartTime'
        },
        {
          width: '168',
          label: '授课次数',
          prop: 'courseTimes'
        },
        {
          width: '95',
          label: '授课评分',
          prop: 'courseScore'
        }
      ],
      // 讲师授权记录 table 数据数组
      authorizationRecordTableList: [],
      // 讲师授权记录 table 分页参数
      authorizationRecordForm: {
        teacherUm: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      // 讲师评聘记录 table 字段数组
      evaluationRecordList: [
        {
          width: '92',
          label: '姓名',
          prop: 'teacherName'
        },
        {
          width: '110',
          label: 'UM号',
          prop: 'teacherUm'
        },
        {
          width: '200',
          label: '所属机构',
          prop: 'orgName'
        },
        {
          width: '86',
          label: '变动时间',
          prop: 'rankdate'
        },
        {
          width: '100',
          label: '变动后星级',
          prop: 'oldRankDesc'
        },
        {
          width: '108',
          label: '变动前星级',
          prop: 'newRankDesc'
        }
      ],
      // 讲师评聘记录 table 数据数组
      evaluationRecordTableList: [],
      // 讲师评聘记录 table 分页参数
      evaluationRecordForm: {
        teacherUm: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      // 讲师奖惩记录 table 字段数组
      rewardPunishmentRecordList: [
        {
          width: '93',
          label: '姓名',
          prop: 'teacherName'
        },
        {
          width: '146',
          label: 'UM号',
          prop: 'teacherUm'
        },
        {
          width: '332',
          label: '所属机构',
          prop: 'ogrName'
        },
        {
          width: '119',
          label: '奖惩时间',
          prop: 'rwrdPnshTime'
        }
      ],
      // 讲师奖惩记录 table 数据数组
      rewardPunishmentRecordTableList: [],
      // 讲师奖惩记录 table 分页参数
      rewardPunishmentRecordForm: {
        teacherUm: '',
        currPage: 1,
        pageSize: 5,
        total: 0
      },
      // 讲师授课记录查询 讲师授权记录查询 讲师评聘记录查询 讲师奖惩记录查询 url映射对象
      instructorInfoMapping: {
        TeaCourseList: 'lectureRecord',
        TeaPowerList: 'authorizationRecord',
        PromoteList: 'evaluationRecord',
        RewAndPuList: 'rewardPunishmentRecord'
      },
      sizeChange,
      currentChange
    }
  },
  methods: {
    // 讲师授课记录查询 讲师授权记录查询 讲师评聘记录查询 讲师奖惩记录查询 公共函数
    instructorInfoCommonFun(key) {
      const url = `/fn/teacher/applyStar/select${key}`
      key = this.instructorInfoMapping[key]
      this.$axios.post(url, this[`${key}Form`], jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this[`${key}TableList`] = data.list
          this[`${key}Form`].total = Number.parseInt(data.total)
        }
      })
    },
    // 获取讲师个人信息
    getInstructorUserInfo(teacherUm) {
      this.$axios
        .post('/fn/teacher/info/selectTeacherInfo', { teacherUm }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instructorPersonInfo = data
          }
        })
    },
    // 查看讲师信息
    checkinstructorInfo(row) {
      const { teacherUm } = row
      this.getInstructorUserInfo(teacherUm, 'find')
      Object.keys(this.instructorInfoMapping).forEach((key) => {
        const value = this.instructorInfoMapping[key]
        this[`${value}Form`].teacherUm = teacherUm
      })
      Object.keys(this.instructorInfoMapping).forEach((key) => {
        this.instructorInfoCommonFun(key)
      })
      this.instructorInfoVisible = true
    }
  },
  watch: {
    row(newValue) {
      if (newValue.teacherUm) {
        this.checkinstructorInfo(newValue)
        this.activeName = 'lectureRecord'
      }
    }
  },
  created() {
    if (this.flag) {
      delete this.instructorInfoMapping.PromoteList
      delete this.instructorInfoMapping.RewAndPuList
    }
  }
}
</script>

<style lang="scss" scoped>
.instructor-info {
  &__box {
    height: 504px;
    &__base {
      width: 322px;
      flex-shrink: 0;
      &__integral {
        padding-left: 25px;
        border-top: 1px dashed #eaecf1;

        &__title {
          margin: 20px 0;
          font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC',
            'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
        }
        &__items {
          display: flex;
          flex-wrap: wrap;
          &__item {
            display: flex;
            width: 100px;
            height: 30px;
            margin: 0 10px 20px 0;
            justify-content: center;
            align-items: center;
            background: #f7f8fa;
            border-radius: 2px;
          }
        }

        .userinfo-items__item {
          margin: 0;
        }
      }
      &__teacher-score {
        width: fit-content;
        padding: 0 20px;
        margin: 0;
      }
    }
    &__tabs {
      flex: 1;
      margin-top: 1px;
      border-left: 1px solid #eaecf1;
      &__evaluation-record,
      &__reward-punishment-record {
        width: 701px;
        overflow-x: auto;

        :deep(.el-table) {
          border: none;
        }
      }
      :deep(.el-tabs) {
        display: flex;
        height: 100%;
        flex-direction: column;
      }
      :deep(.el-tabs__content) {
        flex: 1;
        padding: 9px 26px 0 20px;
      }
      :deep(.gc-pagination) {
        position: absolute;
        bottom: 49px;
        right: 26px;
      }
    }
  }
}
</style>