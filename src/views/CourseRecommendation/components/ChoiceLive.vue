<template>
  <div class="course-recommendation__choice-topic">
    <!-- 搜索 card -->
    <el-card class="search-card">
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
    <div class="mt10 bgf">
      <div class="table-box">
        <p>
          已选课程：<span class="themeColor">{{ selectedCourse }}</span>
        </p>
        <gc-table
          class="general__table mt20"
          ref="tableRef"
          :list="list"
          row-key="liveId"
          :tableList="tableList"
          @selection-change="selectionChange"
        >
          <el-table-column label="是否包含练习" min-width="126">
            <template slot-scope="scope">
              <span class="active underline" v-if="scope.row.isContailTrain"
                >查看练习</span
              >
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="上架时间" min-width="162">
            <template slot-scope="scope">
              {{ scope.row.upTime | filterTime }}
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
      </div>

      <!-- 底部按钮 -->
      <div class="footer-box dfc mt40">
        <el-button class="button-w80-h30" @click="cancel">取消</el-button>
        <el-button
          :class="confirmClass"
          type="primary"
          @click="acknowledgement"
          >{{ confirmText }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  commonFilter,
  currentChange,
  getCurriculumTree,
  addAllowKeepAlive
} from '@/util/utils'
import { LIVE } from '@/util/constants'
import $ from 'jquery'
import { getOrg } from '../utils'
import { handlePickerOptions } from '@/mixins/component'
import TemplateImport from './TemplateImport.vue'
export default {
  name: 'CRChoiceTopic',
  mixins: TemplateImport[handlePickerOptions],
  props: {
    hideTime: {
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: '加入课程练习'
    },
    confirmClass: {
      type: String,
      default: 'button-w90-h30'
    },
    type: null,
    canPrview: {
      type: Boolean,
      default: true
    },
    selected: null
  },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        liveName: '',
        liveProposalName: '',
        liveTagIds: [],
        liveSource: '',
        orgId: '',
        teacherUmName: '',
        isFinanceCompliance: '',
        // 开始日期  格式: yyyy-MM-dd
        liveStartDate1: '',
        // 结束日期 格式: yyyy-MM-dd
        liveStartDate2: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      // 部门下拉选项
      orgOptions: [],
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
      ],
      total: 0,
      // 日期限时 用的
      startPickerOptions: {},
      endPickerOptions: {},
      // 分页函数
      sizeChange,
      currentChange,
      list: [
        {
          type: 'selection',
          'reserve-selection': true
        },
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '直播名称',
          prop: 'liveName',
          width: '146'
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
      // 课程系列 options
      courseClassifyOptions: [],
      // 选择标签的下拉框数据
      tagOptions: [],
      // 课程难易程度 下拉选项
      difficultyLevelOptions: [
        {
          label: '初阶',
          value: '1'
        },
        {
          label: '中阶',
          value: '2'
        },
        {
          label: '高阶',
          value: '3'
        }
      ],
      // 已选择的课程
      selectedCourse: 0,
      selectedList: []
    }
  },
  methods: {
    // 处理表单数据
    handleData() {
      const data = CopyObj(this.queryForm)
      console.log(265, data)
      data.courseTagIds = data.liveTagIds.map((v) =>
        Array.isArray(v) ? v.slice(-1)[0] : v
      )
      if (!data.liveStartDate1) data.liveStartDate1 = null
      if (!data.liveStartDate2) data.liveStartDate2 = null
      if (data.liveTagIds.length) data.liveTagIds = data.liveTagIds[0]
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
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
    },
    getList() {
      const data = this.handleData()
      // if (this.type) {
      //   data.type = this.type
      // }
      this.$axios
        .post(
          '/fn/privatewealth/liveinfo/selectLiveInfoListByPage',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const { total, list } = data
            list.forEach((v) => {
              v.liveId = parseInt(v.id)
            })
            this.total = total
            this.tableList = list
          }
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
    selectionChange(selection) {
      this.selectedCourse = selection.length
      this.selectedList = selection
    },
    clear() {
      this.reset()
      this.tableList = []
      this.$nextTick(() => {
        this.$refs.tableRef.$children[0].clearSelection()
      })
    },
    // 取消
    cancel() {
      this.clear()
      this.$emit('cancel')
    },
    // 确认
    acknowledgement() {
      this.clear()
      console.log(354, this.selectedList)
      this.$emit('acknowledgement', this.selectedList, 3)
    },
    // 取消级联选择框第一级的选择框
    handleCascader(arr) {
      // TODO: 需要回归校验
      if (!arr) return
      if (Array.isArray(arr) && arr.length > 1) return
      this.$nextTick(() => {
        $('.cascader-no-first').each((i, e) => {
          $(e)
            .find('.el-cascader-menu')
            .each((i, e) => {
              if (i < 2) {
                $(e).find('.el-checkbox').css({
                  display: 'none'
                })
              }
            })
        })
      })
    },
    // 跳转到预览界面
    preview(row) {
      const { courseId } = row
      const data = { courseId }
      this.$axios
        .post(
          '/fn/privatewealth/course/searchCourseByCourseId',
          { data },
          jsonHeaders
        )
        .then((res) => {
          const { code, data: params } = res.data
          if (code === 0) {
            addAllowKeepAlive('/CRPreviewCourse')
            this.$router.push({
              name: '课程详情',
              params
            })
          }
        })
    }
  },
  mounted() {
    getCurriculumTree(
      1,
      this.$store.state.userInfo.blgStripLine,
      1,
      '/fn/course/tag/selectCourseTagsForTk'
    ).then((data) => {
      this.courseClassifyOptions = data
    })
    this.getAllTag()
    getOrg().then((res) => {
      this.orgOptions = res
    })
  },
  watch: {
    selected: {
      handler(n) {
        if (n && n.length) {
          this.$refs.tableRef.$children[0].clearSelection()
          this.$nextTick(() => {
            n.forEach((v) => {
              this.$refs.tableRef.$children[0].toggleRowSelection(v, true)
            })
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.course-recommendation__choice-topic {
  .table-box {
    padding: 20px;
  }
}
</style>
