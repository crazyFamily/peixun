<template>
  <div class="course-recommendation__LiveBroadcast-management">
    <el-tabs v-model="activeName">
      <el-tab-pane label="直播查询" name="live">
        <!-- 搜索 card -->
        <el-card class="search-card live-search-container">
          <el-form ref="form" :model="queryForm" :inline="true">
            <el-form-item label="直播名称">
              <el-input
                class="w200"
                placeholder="请输入直播名称"
                v-model="queryForm.liveName"
              ></el-input>
            </el-form-item>
            <el-form-item label="系列名称">
              <el-input
                class="w200"
                placeholder="请输入系列名称"
                v-model="queryForm.liveProposalName"
              ></el-input>
            </el-form-item>
            <!-- TODO -->
            <el-form-item label="直播标签">
              <!-- <el-cascader clearable class="w-200" v-model="queryForm.liveTagIds"></el-cascader> -->
              <el-cascader
                clearable
                @visible-change="handleCascader"
                class="w-200 max-120 mt1"
                popper-class="cascader-no-first"
                v-model="queryForm.liveTagIds"
                :options="tagOptions"
                collapse-tags
                :props="{
                  value: 'tagId',
                  label: 'tagName',
                  multiple: true,
                  checkStrictly: true
                }"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <gc-select
                label="直播源"
                label-width="48px"
                v-model="queryForm.liveSource"
                :options="liveSourceOptions"
              >
              </gc-select>
            </el-form-item>
            <el-form-item>
              <gc-select
                k="orgName"
                v="orgId"
                label="所属机构"
                :options="orgOptions"
                v-model="queryForm.orgId"
              ></gc-select>
            </el-form-item>
            <el-form-item label="授课讲师">
              <el-input
                class="w200"
                placeholder="请输入讲师姓名"
                v-model="queryForm.teacherUmName"
              ></el-input>
            </el-form-item>
            <el-form-item class="">
              <gc-select
                label="直播状态"
                v-model="queryForm.liveStatus"
                :options="liveStatusOptions"
              ></gc-select>
            </el-form-item>
            <el-form-item label="上架人">
              <el-input
                class="w200"
                placeholder="请输入上架人姓名"
                v-model="queryForm.upBy"
              ></el-input>
            </el-form-item>
            <el-form-item label="下架人">
              <el-input
                class="w200"
                placeholder="请输入下架人姓名"
                v-model="queryForm.downBy"
              ></el-input>
            </el-form-item>
            <el-form-item label="是否纳入理财合规课程">
              <gc-select
                :options="isFinanceComplianceOptions"
                v-model="queryForm.isFinanceCompliance"
              ></gc-select>
            </el-form-item>
            <el-form-item class="mr20">
              <el-form-item
                label="开始时间"
                label-width="58px"
                class="search-card__date mr10"
              >
                <el-date-picker
                  v-model="queryForm.liveStartDate1"
                  type="datetime"
                  placeholder="选择日期时间"
                  :clearable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至" class="search-card__date r0">
                <el-date-picker
                  v-model="queryForm.liveStartDate2"
                  type="datetime"
                  placeholder="选择日期时间"
                  :clearable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <div class="search-card__button">
              <el-button @click="query" type="primary">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </div>
          </el-form>
        </el-card>

        <!-- 数据表格 card -->
        <el-card class="mt10">
          <div class="menu-right icons no-line">
            <span class="icons__add" @click="add">
              <i class="icons__add__icon"></i>
              新建直播</span
            >
            <span class="icons__upload ml10" @click="educe">
              <i class="icons__upload__icon"></i>
              导出</span
            >
          </div>
          <gc-table
            class="general__table table-left"
            :list="list"
            :tableList="tableList"
          >
            <el-table-column label="上架人" min-width="90">
              <template slot-scope="scope">
                {{ scope.row.upBy }}
              </template>
            </el-table-column>
            <el-table-column label="实际上架时间" min-width="104">
              <template slot-scope="scope">
                {{ scope.row.upTime }}
              </template>
            </el-table-column>
            <el-table-column label="下架人" min-width="90">
              <template slot-scope="scope">
                {{ scope.row.downBy }}
              </template>
            </el-table-column>
            <el-table-column label="实际下架时间" min-width="104">
              <template slot-scope="scope">
                {{ scope.row.downTime }}
              </template>
            </el-table-column>
            <el-table-column min-width="120" prop="liveStatus">
              <template slot="header">
                <gc-tablecolumnfilters
                  label="直播状态"
                  className="table__screen__icon"
                  :list="liveStatusOptions"
                  confirmText="确定"
                  @filter="
                    commonFilter(
                      $event,
                      queryForm,
                      'liveStatus',
                      getList,
                      'filter'
                    )
                  "
                  @reset="
                    commonFilter($event, queryForm, 'liveStatus', getList)
                  "
                  radio
                >
                </gc-tablecolumnfilters>
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              prop="status"
              :formatter="
                (row) => {
                  return row.shelveStatusName || ''
                }
              "
            >
              <template slot="header">
                <gc-tablecolumnfilters
                  label="是否上架"
                  className="table__screen__icon"
                  :list="livePutAwayStatusOptions"
                  confirmText="确定"
                  @filter="
                    commonFilter($event, queryForm, 'status', getList, 'filter')
                  "
                  @reset="commonFilter($event, queryForm, 'status', getList)"
                  radio
                >
                </gc-tablecolumnfilters>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="84" prop="" fixed="right">
              <template slot-scope="scope">
                <el-tooltip
                  placement="left"
                  :visible-arrow="false"
                  popper-class="bgf shadow-1"
                >
                  <div slot="content" class="tooltip__operation">
                    <span class="active" @click="openLiveEditPage(scope.row)"
                      >修改</span
                    >
                    <span class="active" @click="delLive(scope.row)">
                      删除
                    </span>
                    <span
                      v-if="scope.row.shelveStatus === '02001'"
                      class="active"
                      @click="livePutAwayHandle(scope.row, '02002')"
                    >
                      下架
                    </span>
                    <span
                      v-else
                      class="active"
                      @click="livePutAwayHandle(scope.row, '02001')"
                    >
                      上架
                    </span>
                    <span
                      v-if="scope.row.eoaStatus === EOA_DONE && scope.row.shelveStatus === PUTAWAY"
                      class="active"
                      @click="openPushDialog(scope.row)"
                    >推送</span>
                    <!-- <span
                                            v-if="scope.row.taskId"
                                            class="active"
                                            @click="checkEoaStatus(scope.row)"
                                            >查看审批记录</span
                                        > -->
                    <!-- TODO: 未对接 -->
                    <span
                      class="active"
                      @click="setFinanceComplianceHandle(scope.row)"
                      v-if="isSuperAdmin"
                    >
                      {{
                        scope.row.isFinanceCompliance === 'Y' ? '取消' : ''
                      }}纳入理财合规课程
                    </span>
                  </div>
                  <el-button class="button-48-24">操作</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="total"
            :page-sizes="[10, 20]"
            :page-size="queryForm.pageSize"
            :current-page="queryForm.currPage"
            @sizeChange="sizeChange($event, queryForm, getList)"
            @currentChange="currentChange($event, queryForm, getList)"
            class="between"
          />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="直播立项信息查询" name="liveEstablish">
        <!-- 搜索 card -->
        <el-card class="search-form-card">
          <el-form ref="form" :model="establishForm" :inline="true">
            <el-form-item label="直播系列名称">
              <el-input
                placeholder="请输入直播名称"
                v-model="establishForm.liveProposalName"
              ></el-input>
            </el-form-item>
            <el-form-item label="系列立项人">
              <el-input
                placeholder="请输入系列立项人"
                v-model="establishForm.proposalCreateBy"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-form-item
                label="系列立项时间"
                class="search-card__date w110 mr10"
              >
                <el-date-picker
                  v-model="establishForm.proposalStartDate"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :picker-options="
                    handleStartPickerOptions(establishForm, 'proposalEndDate')
                  "
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至" class="search-card__date w110 r0">
                <el-date-picker
                  v-model="establishForm.proposalEndDate"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :picker-options="
                    handleEndPickerOptions(establishForm, 'proposalStartDate')
                  "
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                >
                </el-date-picker>
              </el-form-item>
            </el-form-item>

            <el-form-item>
              <el-form-item
                label="拟定开始时间"
                class="search-card__date w110 mr10 df"
              >
                <el-date-picker
                  v-model="establishForm.planStartDate1"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :picker-options="
                    handleStartPickerOptions(establishForm, 'planStartDate2')
                  "
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至" class="search-card__date w110 r0 df">
                <el-date-picker
                  v-model="establishForm.planStartDate2"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :picker-options="
                    handleEndPickerOptions(establishForm, 'planStartDate1')
                  "
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                >
                </el-date-picker>
              </el-form-item>
            </el-form-item>

            <el-form-item>
              <el-form-item
                label="拟定结束时间"
                class="search-card__date w110 mr10 df"
              >
                <el-date-picker
                  v-model="establishForm.planEndDate1"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :picker-options="
                    handleStartPickerOptions(establishForm, 'planEndDate2')
                  "
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至" class="search-card__date w110 r0 df">
                <el-date-picker
                  v-model="establishForm.planEndDate2"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :picker-options="
                    handleEndPickerOptions(establishForm, 'planEndDate1')
                  "
                  value-format="yyyy-MM-dd"
                  popper-class="date-picker"
                >
                </el-date-picker>
              </el-form-item>
            </el-form-item>
            <el-form-item class="mr20" label="是否过期">
              <gc-select
                :options="expireOptions"
                v-model="establishForm.expire"
              ></gc-select>
            </el-form-item>
            <div class="search-card__button">
              <el-button @click="establishQuery" type="primary">查询</el-button>
              <el-button @click="establishReset">重置</el-button>
            </div>
          </el-form>
        </el-card>

        <!-- 数据表格 card -->
        <el-card class="mt10">
          <div class="menu-right icons no-line">
            <span class="icons__add" @click="add">
              <i class="icons__add__icon"></i>
              新建直播</span
            >
            <span class="icons__upload ml10" @click="educeEstablish">
              <i class="icons__upload__icon"></i>
              导出</span
            >
          </div>
          <gc-table
            class="general__table table-left"
            :list="establishList"
            :tableList="establishTableList"
          >
            <el-table-column label="操作" min-width="84" prop="" fixed="right">
              <template slot-scope="scope">
                <el-tooltip
                  placement="left"
                  :visible-arrow="false"
                  popper-class="bgf shadow-1"
                >
                  <div slot="content" class="tooltip__operation">
                    <span
                      v-if="
                        !(
                          ['02001', '02002'].includes(scope.row.eoaStatus) &&
                          scope.row.expire === 'N'
                        )
                      "
                      class="active"
                      @click="openChangePage(scope.row)"
                      >修改</span
                    >
                    <!-- <span
                                            class="active"
                                            v-if="
                                                !(
                                                    scope.row.proposalStatus ===
                                                        '审批通过' &&
                                                    scope.row.expire === 'N'
                                                )
                                            "
                                            @click="openChangePage(scope.row)"
                                            >修改</span
                                        > -->
                    <span
                      v-if="scope.row.taskId"
                      class="active"
                      @click="checkEoaStatus(scope.row)"
                      >查看审批记录</span
                    >
                    <!-- <span
                                            class="active"
                                            @click="delEstablishLive(scope.row)"
                                            >删除</span
                                        > -->
                  </div>
                  <el-button class="button-48-24">操作</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </gc-table>
          <gc-pagination
            :total="establishForm.total"
            :page-sizes="[10, 20]"
            :page-size="establishForm.pageSize"
            :current-page="establishForm.currPage"
            @sizeChange="sizeChange($event, establishForm, getEstablishList)"
            @currentChange="
              currentChange($event, establishForm, getEstablishList)
            "
            class="between"
          />
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 查看 审批记录 -->
    <CkeckApprovalRecord :row="eoaStatusObj" />
    <!-- 推送弹窗 -->
    <PushDialog :showPushDialog="showPushDialog" :pushInfo="pushInfo" @close="closePushDialog" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  PUTAWAY,
  SOLDOUT,
  EOA_DRAFTS,
  EOA_WAITTING,
  EOA_DONE,
  EOA_BACK,
  EOA_WITHDRAW,
  PUSH_TYPE,
} from '@/views/CourseRecommendation/enum'
import PushDialog from '../components/PushDialog'

// 推送
const showPushDialog = ref(false)
const pushInfo = ref({})
const pushType = PUSH_TYPE['live']
const openPushDialog = (row) => {
  showPushDialog.value = true
  pushInfo.value = {
    ...row,
    businessId: row.id,
    businessType: pushType
  }
}
defineExpose({ showPushDialog })
</script>
<script>
import {
  CopyObj,
  resetObj,
  hintFrame,
  handleBlob,
  getTagDict,
  sizeChange,
  dataHeaders,
  jsonHeaders,
  commonFilter,
  currentChange,
  fileImportHint,
  templateDownload,
  addAllowKeepAlive,
  handleEndPickerOptions,
  handleStartPickerOptions,
  getCurriculumTree
} from '@/util/utils'
import $ from 'jquery'
import { getOrg } from '../utils'
import { handlePickerOptions } from '@/mixins/component'
import gcTag from '@/components/chunk/tag'
import CkeckApprovalRecord from '@/components/chunk/CkeckApprovalRecord'
import { LIVE } from '@/util/constants'
export default {
  name: 'CRLiveBroadcast',
  components: { gcTag, CkeckApprovalRecord },
  mixins: [handlePickerOptions],
  data() {
    return {
      activeName: 'live',
      // 查询用的表单
      queryForm: {
        // 直播名称
        liveName: '',
        // 系列名称
        liveProposalName: '',
        // 直播标签
        liveTagIds: [],
        // 直播源
        liveSource: '',
        // 所属机构
        orgId: '',
        // 授课讲师
        teacherUmName: '',
        // 直播状态
        liveStatus: '',
        // 是否纳入理财合规课程
        isFinanceCompliance: '',
        // 上架时间
        liveStartDate1: '',
        liveStartDate2: '',
        blgOrg: '',
        courseName: '',
        courseClassify: [],
        source: '',
        courseTagIds: [],
        teacherUm: '',
        keyword: '',
        // 开始日期  格式: yyyy-MM-dd
        dateStart: null,
        // 结束日期 格式: yyyy-MM-dd
        dateEnd: null,
        difficultyLevel: '',
        coursewareType: '',
        status: '',
        eoaStatus: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10,
        downBy: '',
        upBy: ''
      },
      // 部门下拉选项
      orgOptions: [],
      // 课程来源下拉选项
      sourceOptions: [
        {
          label: '培训系统',
          value: 'tms'
        },
        {
          label: '知鸟',
          value: 'zn'
        },
        {
          label: '小橙',
          value: 'xc'
        }
      ],
      total: 0,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {},
      // 分页函数
      sizeChange,
      currentChange,
      // 选择标签的下拉框数据
      tagOptions: [],
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          type: 'component',
          label: '直播名称',
          width: '200',
          prop: '',
          'show-overflow-tooltip': false,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline',
                    on: {
                      click() {
                        that.preview(row)
                      }
                    }
                  },
                  row.liveName
                )
              }
            }
          }
        },
        {
          label: '直播源',
          width: '90',
          prop: 'liveSource',
          ctx: (row) => {
            let sourceMap = { xc: '小橙', zn: '知鸟' }
            return sourceMap[row.liveSource] || row.liveSource
          }
        },
        {
          label: '直播类型',
          width: '90',
          prop: 'liveType',
          ctx: (row) => LIVE.LIVE_TYPE[row.liveType] || row.liveType
        },
        {
          label: '所属机构',
          width: '90',
          prop: 'orgName'
        },
        {
          label: '主播',
          width: '100',
          prop: 'liveUmName'
        },
        {
          label: '授课讲师',
          width: '110',
          prop: 'teacherUmName'
        },
        {
          label: '直播标签',
          width: '90',
          prop: 'liveTag'
        },
        {
          label: '系列名称',
          width: '166',
          prop: 'liveProposalName'
        },
        {
          label: '开始时间',
          width: '150',
          prop: 'liveStartDate'
        },
        {
          label: '结束时间',
          width: '150',
          prop: 'liveEndDate'
        },
        {
          label: '理财合规课程',
          width: '120',
          prop: 'isFinanceCompliance',
          ctx: (row) => {
            let renderList = { Y: '是', N: '否' }
            return renderList[row.isFinanceCompliance]
          }
        },
        {
          label: '审批状态',
          width: '90',
          prop: 'eoaStatusName'
        }
      ],
      tableList: [],
      // 审批状态 选项
      approvalStatusOptions: [
        {
          label: '草稿中',
          value: '02000'
        },
        {
          label: '审批中',
          value: '02001'
        },
        {
          label: '已通过',
          value: '02002'
        },
        {
          label: '已退回',
          value: '02003'
        },
        {
          label: '已撤回',
          value: '02004'
        }
      ],
      // 直播状态 选项
      liveStatusOptions: [
        {
          label: '未开播',
          value: '1'
        },
        {
          label: '直播中',
          value: '2'
        },
        {
          label: '已结束',
          value: '3'
        }
      ],
      // 上下架状态 选项
      livePutAwayStatusOptions: [
        {
          label: '上架',
          value: '02001'
        },
        {
          label: '下架',
          value: '02002'
        }
      ],
      tagDict: {},
      eoaStatusObj: {},
      // 直播立项信息表单
      establishForm: {
        liveProposalName: '',
        proposalCreateBy: '',
        proposalStartDate: '',
        proposalEndDate: '',
        planStartDate1: '',
        planStartDate2: '',
        planEndDate1: '',
        planEndDate2: '',
        expire: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      // 是否过期 下拉选项
      expireOptions: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      establishList: [
        {
          type: 'component',
          label: '系列名称',
          width: '200',
          prop: '',
          'show-overflow-tooltip': false,
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline',
                    on: {
                      click() {
                        // that.preview(row, 'broadcast');
                        that.broadcastPreview(row)
                      }
                    }
                  },
                  row.liveProposalName
                )
              }
            }
          }
        },
        {
          label: '系列直播数',
          width: '90',
          prop: 'liveNum'
        },
        {
          label: '系列立项人',
          width: '90',
          prop: 'proposalCreateBy'
        },
        {
          label: '系列立项时间',
          width: '90',
          prop: 'proposalDate'
        },
        {
          label: '拟定开始时间',
          width: '90',
          prop: 'planStartDate'
        },
        {
          label: '拟定结束时间',
          width: '90',
          prop: 'planEndDate'
        },
        {
          label: '是否过期',
          width: '90',
          prop: 'expire',
          ctx: (row) => (row.expire === 'Y' ? '是' : '否')
        },
        {
          label: '系列立项状态',
          width: '90',
          prop: 'eoaStatusName'
        },
        {
          label: 'EOA签报号',
          width: '90',
          prop: 'eoaSerial'
        }
      ],
      establishTableList: [],
      // 工具函数
      templateDownload,
      handleEndPickerOptions,
      handleStartPickerOptions,
      // 是否纳入理财合规课程 下拉选项
      isFinanceComplianceOptions: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      isSuperAdmin: false,
      // 直播源选项
      liveSourceOptions: [
        {
          label: '知鸟',
          value: 'zn'
        },
        {
          label: '小橙',
          value: 'xc'
        }
      ]
    }
  },
  methods: {
    // 处理表单数据
    handleData() {
      const data = CopyObj(this.queryForm)
      // 处理直播标签
      // TODO: 要做UI优化
      data.liveTagIds = data.liveTagIds.reduce((pre, item) => {
        pre.push(item[item.length - 1])
        return pre
      }, [])

      data.courseClassify = data.courseClassify.slice(-1)[0] || ''
      data.courseTagIds = data.courseTagIds.map((v) =>
        Array.isArray(v) ? v.slice(-1)[0] : v
      )

      if (!data.liveStartDate1) data.liveStartDate1 = null
      if (!data.liveStartDate2) data.liveStartDate2 = null

      data.upTime = data.dateStart
      data.planDownTime = data.dateEnd
      Reflect.deleteProperty(data, 'dateStart')
      Reflect.deleteProperty(data, 'dateEnd')
      return data
    },
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, {
        currPage: 1,
        pageSize: 10
      })
      this.queryForm.dateStart = null
      this.queryForm.dateEnd = null
      // 重复不需要重新发起请求
      // this.getList();
    },
    getList() {
      let data = this.handleData()
      this.$axios
        .post(
          '/fn/privatewealth/liveinfo/selectLiveInfoListByPage',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            // list.forEach(item => {
            //     item.status = '02001'
            // })
            this.total = total
            this.tableList = list
          }
        })
    },
    add() {
      const params = { state: 'add' }
      addAllowKeepAlive('/CRNewLiveBroadcast')
      this.$router.push({
        name: '新增直播',
        params
      })
    },
    educe() {
      const data = this.handleData()
      this.$axios
        .post(
          '/fn/privatewealth/liveinfo/exportLiveInfoList',
          { data },
          { ...jsonHeaders, responseType: 'blob' }
        )
        .then((res) => {
          if (res.data.type === 'application/json') {
            const reader = new FileReader()
            const that = this
            reader.onload = function (event) {
              var content = reader.result //内容就在这里
              that.$message.error(JSON.parse(content).msg)
            }
            reader.readAsText(res.data)
          } else {
            handleBlob(res)
          }
        })
    },
    // 打开立项修改页面
    openChangePage(row) {
      this.getLiveAndBroadcastData(row.id)
    },
    // 获取立项以及直播数据
    getLiveAndBroadcastData(broadcastId, liveId, type) {
      // TODO： 需要做优化，立项直播数据应合并到一个接口
      this.$axios
        .post(
          '/fn/privatewealth/live/detailLiveProposalById',
          { id: broadcastId },
          jsonHeaders
        )
        .then((broadcastRes) => {
          broadcastRes = broadcastRes.data
          let broadcastCode = broadcastRes.code
          let broadcastParams = broadcastRes.data
          if (broadcastCode !== 0) return

          if (liveId) {
            // 直播请求
            let liveApi = this.$axios
              .post(
                '/fn/privatewealth/liveinfo/detailLiveInfoById',
                { id: liveId },
                jsonHeaders
              )
              .then((liveRes) => {
                liveRes = liveRes.data
                let liveCode = liveRes.code
                let liveParams = liveRes.data
                if (liveCode !== 0) return

                let params = {
                  ...broadcastParams,
                  liveList: [liveParams]
                }

                if (type === 'preview') {
                  let name = addAllowKeepAlive('/CRPreviewLive')
                  console.log(name, '--- name')
                  this.$router.push({
                    name,
                    params
                  })
                } else {
                  params.state = 'edit'
                  params.sourceType = 'live'
                  console.log(params, ' --- params ---')
                  addAllowKeepAlive('/CRNewLiveBroadcast')
                  this.$router.push({
                    name: '新增直播',
                    params
                  })
                }
              })
          } else {
            let params = { ...broadcastParams }
            if (type === 'preview') {
              addAllowKeepAlive('/CRSeriesInfo')
              this.$router.push({
                name: '系列详情',
                params
              })
              // addAllowKeepAlive("/CRPreviewLive");
              // this.$router.push({
              //     name: "直播详情",
              //     params
              // })
            } else {
              params.state = 'edit'
              addAllowKeepAlive('/CRNewLiveBroadcast')
              this.$router.push({
                name: '新增直播',
                params
              })
            }
          }
        })
    },
    // 打开直播编辑
    openLiveEditPage(row) {
      this.getLiveAndBroadcastData(row.proposalId, row.id)
    },
    // 删除直播
    delLive(row) {
      hintFrame('是否确认删除？').then((res) => {
        const data = { id: row.id }
        this.$axios
          .post(
            '/fn/privatewealth/liveinfo/deleteLiveInfoById',
            data,
            jsonHeaders
          )
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
      })
    },
    // 复制课程
    copyCourse(row) {
      const { courseId } = row
      const data = { courseId }
      this.$axios
        .post('/fn/privatewealth/course/copyCourse', { data }, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('复制成功')
            this.getList()
          }
        })
    },
    // 查看审批状态
    checkEoaStatus(row) {
      const { taskId } = row
      this.eoaStatusObj = { taskId }
    },
    // 取消级联选择框第一级的选择框
    handleCascader() {
      $('.cascader-no-first .el-cascader-menu:eq(0) .el-checkbox').css({
        display: 'none'
      })
    },
    // 跳转到预览界面
    preview(row, type) {
      if (type === 'broadcast') {
        this.getLiveAndBroadcastData(row.id, '', 'preview')
      } else {
        this.getLiveAndBroadcastData(row.proposalId, row.id, 'preview')
      }
      // const { courseId } = row;
      // const data = { courseId };
      // this.$axios
      //     .post(
      //         "/fn/privatewealth/course/searchCourseByCourseId",
      //         { data },
      //         jsonHeaders
      //     )
      //     .then(res => {
      //         const { code, data: params } = res.data;
      //         if (code === 0) {
      //             addAllowKeepAlive("/CRPreviewCourse");
      //             this.$router.push({
      //                 name: "直播详情",
      //                 params
      //             });
      //         }
      //     });
    },
    // 白名单上传
    whiteListUpload($event) {
      const file = $event.target.files[0]
      const data = new FormData()
      data.append('file', file)
      this.$axios
        .post('/common/course/importWhiteList', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (parseInt(code) === 0) {
            fileImportHint(data)
          }
        })
    },

    /**
     * 直播立项信息查询区域
     */
    // 处理表单数据
    handleEstablishData() {
      const data = CopyObj(this.establishForm)
      const keys = [
        'proposalStartDate',
        'proposalEndDate',
        'planStartDate1',
        'planStartDate2',
        'planEndDate1',
        'planEndDate2'
      ]
      Object.keys(data).forEach((key) => {
        if (keys.includes(key) && !data[key]) {
          data[key] = null
        }
      })
      return data
    },
    establishQuery() {
      this.establishForm.currPage = 1
      this.establishForm.pageSize = 10
      this.getEstablishList()
    },
    establishReset() {
      resetObj(this.establishForm, { currPage: 1, pageSize: 10 })
      this.getEstablishList()
    },
    getEstablishList() {
      const data = this.handleEstablishData()
      this.$axios
        .post(
          '/fn/privatewealth/live/selectLiveProposalListByPage',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { list, total } = data
            this.establishForm.total = total
            this.establishTableList = list
          }
        })
    },
    // 导出数据
    educeEstablish() {
      const data = this.handleEstablishData()
      this.$axios
        .post(
          '/fn/privatewealth/live/exportLiveProposalList',
          { data },
          { ...jsonHeaders, responseType: 'blob' }
        )
        .then((res) => {
          if (res.data.type === 'application/json') {
            const reader = new FileReader()
            const that = this
            reader.onload = function (event) {
              var content = reader.result //内容就在这里
              that.$message.error(JSON.parse(content).msg)
            }
            reader.readAsText(res.data)
          } else {
            handleBlob(res)
          }
        })
    },
    // 删除立项直播
    delEstablishLive(row) {
      hintFrame('是否确认删除？').then((res) => {
        const { id } = row
        const data = { id }
        this.$axios
          .post('/fn/privatewealth/live/deleteLiveProposal', data, jsonHeaders)
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.$message.success('删除成功')
              this.getEstablishList()
            }
          })
      })
    },
    // 设置理财合规操作
    setFinanceComplianceHandle(row) {
      hintFrame(
        `是否${row.isFinanceCompliance === 'Y' ? '取消' : ''}纳入理财合规课程`
      ).then(() => {
        const data = {
          id: row.id,
          isFinanceCompliance: row.isFinanceCompliance == 'N' ? 'Y' : 'N'
        }
        this.$axios
          .post(
            '/fn/privatewealth/liveinfo/modifyFinanceCompliance',
            data,
            jsonHeaders
          )
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
      })
    },
    // 获取使用过的标签
    getAllTag() {
      getCurriculumTree(
        2,
        this.$store.state.userInfo.blgStripLine,
        1,
        '/fn/course/tag/selectCourseTagsForTk'
      ).then((data) => {
        this.tagOptions = data
      })
    },
    // 立项详情
    broadcastPreview(row) {
      addAllowKeepAlive('/CRSeriesInfo')
      this.$router.push({
        name: '系列详情',
        params: row
      })
    },
    // 上下架操作
    livePutAwayHandle(row, status) {
      console.log(row)
      let data = {
        id: Number(row.id),
        status: String(status)
      }
      this.$axios
        .post('/fn/privatewealth/liveinfo/updateLiveStatus', data, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success(`${status === '02001' ? '上架' : '下架'}成功`)
          }
          // 刷新数据
          this.query()
        })
    },
    // 关闭推送弹窗
    closePushDialog(flag) {
      this.showPushDialog = false
      if (flag) this.getList()
    },
  },
  mounted() {
    this.isSuperAdmin = this.$store.state.userInfo.roleIds.includes('50001')
    getTagDict(this)
    getOrg().then((res) => {
      this.orgOptions = res
    })
    this.getAllTag()
    // 执行查询
    this.query()
    this.establishQuery()
  },
  activated() {
    // 执行查询
    this.query()
    this.establishQuery()
  }
}
</script>

<style lang="scss">
.course-recommendation__LiveBroadcast-management {
  .el-tabs__header {
    background-color: #fff;
  }
}
</style>
