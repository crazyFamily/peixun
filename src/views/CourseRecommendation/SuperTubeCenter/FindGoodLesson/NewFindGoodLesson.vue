<template>
  <div class="course-recommendation__new-column">
    <gc-steps
      :active="active"
      :list="stepList"
      width="352px"
      total-width="900px"
    ></gc-steps>
    <div class="columnInfo" v-show="active === 0">
      <el-form
        label-width="60px"
        :model="columnInfoForm"
        :rules="columnInfoRules"
        class="item-mb30 dr-label-ws"
      >
        <el-form-item label="栏目名称">
          <el-input
            maxlength="20"
            show-word-limit
            placeholder="限制20个字"
            v-model="columnInfoForm.layoutName"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级栏目" v-if="state === 'edit'">
          <el-cascader
            class="w-full"
            v-model="columnInfoForm.prnLayoutId"
            :options="prnLayoutIdOptions"
            :props="{
              value: 'layoutId',
              label: 'layoutName',
              children: 'childs',
              checkStrictly: true
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="栏目负责人（3个）（一级）">
          <div
            class="df mb20"
            v-for="(item, i) in columnInfoForm.leaderUmList"
            :key="i"
          >
            <el-autocomplete
              class="f1"
              value-key="empName"
              placeholder="请输入UM号/姓名"
              :trigger-on-focus="false"
              v-model="columnInfoForm.leaderUmList[i]"
              :fetch-suggestions="querySearch"
            ></el-autocomplete>
            <el-button
              class="button-50-30 button-my-primary-plain ml10"
              @click="delLeaderUm(i)"
              >移除</el-button
            >
            <el-button
              class="button-50-30 button-my-primary-plain ml10"
              @click="addLeaderUm"
              >添加</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="栏目是否展示">
          <gc-select
            w1
            class="p0"
            :options="isShowOptions"
            v-model="columnInfoForm.isShow"
          ></gc-select>
        </el-form-item>
        <el-form-item label="栏目介绍">
          <el-input
            maxlength="30"
            show-word-limit
            placeholder="限制30个字"
            v-model="columnInfoForm.introduce"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="栏目图标"
          :required="columnInfoForm.prnLayoutId.length === 1"
        >
          <gc-upload
            :key="layoutId"
            :size="100"
            ref="gcUpload"
            v-model="columnInfoForm.coverList"
            :list="columnInfoForm.oldCoverList"
          ></gc-upload>
          <p class="tintColor l18 mt10">
            推荐比例1：1，支持 jpg、png格式，文件大小不超过100k
          </p>
        </el-form-item>
        <el-form-item label="页面样式（一级栏目）">
          <el-radio-group v-model="columnInfoForm.radio">
            <el-radio class="radio mr50" label="1">
              <div class="page-style"></div>
            </el-radio>
            <el-radio class="radio" label="2">
              <div class="page-style"></div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="curriculm-management" v-show="active === 1">
      <div class="menu-right icons">
        <span class="icons__add" @click="changeActive(1)">
          <i class="icons__add__icon"></i>
          新增课程</span
        >
        <span class="icons__del" @click="handleDel">
          <i class="icons__del__icon"></i>
          删除</span
        >
      </div>
      <gc-table
        ref="independentRef"
        :list="independentList"
        :tableList="independentTableList"
        class="general__table mb20 table-left"
      >
        <el-table-column label="操作" min-width="78px" class-name="td-pr0">
          <template slot-scope="scope">
            <el-tooltip
              placement="left"
              :visible-arrow="false"
              popper-class="bgf shadow-1"
            >
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="delItem(scope.row)">移出栏目</span>
                <!-- <span class="active">修改角标</span> -->
                <span
                  class="active"
                  v-if="scope.row.isTop === 'N'"
                  @click="
                    scope.row.isTop = 'Y'
                    scope.row.isTopName = '已置顶'
                  "
                  >置顶</span
                >
                <span
                  class="active"
                  v-else
                  @click="
                    scope.row.isTop = 'N'
                    scope.row.isTopName = '未置顶'
                  "
                  >取消置顶</span
                >
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </gc-table>

      <gc-pagination
        :total="independentForm.total"
        :page-sizes="[10, 20]"
        :page-size="independentForm.pageSize"
        :current-page="independentForm.currPage"
        @sizeChange="sizeChange($event, independentForm, noop)"
        @currentChange="currentChange($event, independentForm, noop)"
        class="between"
      />
    </div>

    <!-- 底部按钮 -->
    <div class="footer-box dfc mt60">
      <el-button class="button-w80-h30" @click="cancel">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="submit"
        >保存</el-button
      >
      <el-button class="button-w80-h30" v-if="active === 1" @click="active--"
        >上一步</el-button
      >
      <el-button class="button-w80-h30" v-if="active === 0" @click="active++"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  noop,
  merge,
  upMove,
  downMove,
  throttle,
  sizeChange,
  jsonHeaders,
  localPaging,
  currentChange,
  handleUdmpHref,
  fromValueGetLabel,
  getCurriculumTree,
  addAllowKeepAlive
} from '@/util/utils'
import $ from 'jquery'
import gcSteps from '../../components/gc-steps'
import gcUpload from '@/components/upload'
import TemplateImport from '../../components/TemplateImport.vue'
import { CopyObj, resetObj } from '../../../../util/utils'
export default {
  name: 'CRNewColumn',
  components: {
    gcSteps,
    gcUpload
  },
  inject: ['changeActive', 'refreshTree', 'parentParams'],
  data() {
    return {
      // 进度条索引
      active: 0,
      // 当前栏目id
      layoutId: '',
      // 节点类型
      rootType: '',
      // 进度条数据
      stepList: ['栏目信息', '栏目课程管理'],
      // 栏目信息表单
      columnInfoForm: {
        layoutName: '',
        prnLayoutId: [],
        leaderUmList: [''],
        isShow: '',
        introduce: '',
        coverList: [],
        oldCoverList: [],
        style: '',
        rootType: 2
      },
      // 栏目信息表单 验证规则
      columnInfoRules: {},
      // 上级栏目 下拉选项
      prnLayoutIdOptions: [],
      // 栏目是否展示 下拉选项
      isShowOptions: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      // 展示排序 下拉选项
      lowerSortRuleOptions: [
        {
          label: '综合排序',
          value: 'base'
        },
        {
          label: '按热度',
          value: 'hot'
        },
        {
          label: '按上架时间',
          value: 'time'
        },
        {
          label: '按难易程度',
          value: 'level'
        },
        {
          label: '未学过',
          value: 'unknown'
        }
      ],
      // 自主选课 表格字段数组
      independentList: [
        {
          type: 'selection'
        },
        {
          type: 'component',
          width: '166',
          label: '课程名称',
          ctx: (row) => {
            const that = this
            return {
              render(h) {
                return h(
                  'span',
                  {
                    class: 'active underline ellipsis',
                    on: {
                      click() {
                        that.preview(row)
                      }
                    }
                  },
                  row.courseName
                )
              }
            }
          }
        },
        {
          label: '课程角标',
          prop: 'cornerMark',
          width: '120'
        },
        {
          label: '课程标签',
          prop: 'courseTagName',
          width: '188'
        },
        {
          label: '授课讲师',
          prop: 'teacherName',
          width: '140'
        },
        {
          label: '课程难易程度',
          prop: 'difficultyLevel',
          width: '120'
        },
        {
          label: '是否置顶',
          prop: 'isTopName',
          width: '84'
        }
      ],
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
      // 自主选课 表格数据数组
      independentTableListBack: [],
      // 自主选课 查询 分页 form
      independentForm: {
        courseName: '',
        layoutId: undefined,
        keyword: '',
        courseTagIds: [],
        isTop: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      // 是否置顶下拉选项
      isTopOptions: [
        {
          label: '是',
          value: 'Y'
        },
        {
          label: '否',
          value: 'N'
        }
      ],
      // 分页工具函数
      sizeChange,
      currentChange,
      noop,
      // 页面状态
      state: ''
    }
  },
  methods: {
    // 获取父级分类
    getPrnLayoutIdOptions(layoutId) {
      this.$axios
        .post(
          '/fn/privatewealth/layout/findLayoutTree',
          { layoutId },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.handleVoidArr(data)
            this.prnLayoutIdOptions = data
          }
        })
    },
    // 处理空数组
    handleVoidArr(arr) {
      arr.forEach((v) => {
        if (!v.childs?.length) {
          Reflect.deleteProperty(v, 'childs')
        } else if (v.childs) {
          this.handleVoidArr(v.childs)
        }
      })
    },
    // 移除 栏目负责人
    delLeaderUm(index) {
      if (this.columnInfoForm.leaderUmList.length === 1) return
      this.columnInfoForm.leaderUmList.splice(index, 1)
    },
    // 添加 栏目负责人
    addLeaderUm() {
      if (this.columnInfoForm.leaderUmList.length >= 3) {
        return this.$message.warning('栏目负责人最多三个')
      }
      this.columnInfoForm.leaderUmList.push('')
    },
    // 栏目负责人 远程搜索
    querySearch(queryString, cb) {
      const data = { empName: queryString }
      this.$axios
        .post('/fn/user/listUserInfos', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.list.forEach((v) => {
              v.empName = `${v.empName}(${v.umId})`
            })
            cb(data.list)
          }
        })
    },
    // 查询按钮
    query(form, cb) {
      form.page = 1
      form.size = 10
      cb()
    },
    // 重置按钮
    reset(form, cb) {
      resetObj(form, { page: 1, size: 10 })
      cb()
    },
    // 取消级联选择框第一级的选择框
    handleCascader() {
      $('.cascader-no-first .el-cascader-menu:eq(0) .el-checkbox').css({
        display: 'none'
      })
    },
    // 确认添加课程事件
    acknowledgement(selectedList) {
      const ids = this.independentTableListBack.map((v) => v.courseId)
      selectedList.forEach((v) => {
        if (!ids.includes(v.courseId)) {
          this.$set(v, 'isTop', 'N')
          this.$set(v, 'isTopName', '未置顶')
          this.independentTableListBack.push(v)
        }
      })
    },
    // 删除课程事件
    delItem(row) {
      const index = this.independentTableListBack.findIndex(
        (v) => v.courseId === row.courseId
      )
      if (index > -1) {
        this.independentTableListBack.splice(index, 1)
      }
    },
    // 移除多个课程
    handleDel() {
      const selection = this.$refs.independentRef.$children[0].selection
      this.independentTableListBack = this.independentTableListBack.filter(
        (v) => !selection.includes(v)
      )
    },
    // 后台数据转化为本页合适的数据
    serveDataToWebData(data) {
      merge(this.columnInfoForm, data)
      if (!this.columnInfoForm.leaderUmList.length) {
        this.columnInfoForm.leaderUmList.push('')
      }
      if (data.picUdmp) {
        this.columnInfoForm.coverList = [{ udmpId: data.picUdmp, fileName: '' }]
        this.columnInfoForm.oldCoverList = [
          {
            url: handleUdmpHref(data.picUdmp),
            name: '',
            uid: data.picUdmp
          }
        ]
      }
      const addCourses = data.addCourses || []
      addCourses.forEach((v) => {
        v.isTopName = v.isTop === 'Y' ? '已置顶' : '未置顶'
      })
      this.independentTableListBack = addCourses
    },
    // 前端数据转化为后台数据
    webDataToServeData() {
      this.columnInfoForm.leaderUmList = [
        ...new Set(this.columnInfoForm.leaderUmList)
      ]
      const data = CopyObj(this.columnInfoForm)
      data.rootType = this.rootType
      if (this.layoutId) {
        data.layoutId = this.layoutId
      }
      if (!this.state) {
        data.prnLayoutId = this.prnLayoutId
      }
      if (data.coverList.length) {
        data.picUdmp = data.coverList[0].udmpId
      }
      Reflect.deleteProperty(data, 'coverList')
      Reflect.deleteProperty(data, 'oldCoverList')
      const addCourses = this.independentTableListBack.map((v) => {
        const { courseId, isTop, cornerMark, createdBy, createdDate } = v
        return { courseId, isTop, cornerMark, createdBy, createdDate }
      })
      data.addCourses = addCourses
      return data
    },
    submit() {
      const data = this.webDataToServeData()
      if (data.prnLayoutId.length === 1 && !data.picUdmp) {
        return this.$message.warning('一级栏目必须选择封面')
      }
      let url = '/fn/privatewealth/layout/addLayoutNodeInfo'
      if (this.state === 'edit') {
        url = '/fn/privatewealth/layout/updateLayoutNodeInfo'
      }
      return this.$axios.post(url, { data }, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.$message.success(
            `${this.state === 'edit' ? '修改' : '新增'}成功`
          )
          this.refreshTree()
          this.getPrnLayoutIdOptions(this.rootType)
        }
      })
    },
    cancel() {
      this.$router.push('/CRSuperTubeCenter')
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
    },
    // 清除表单数据和课程数据
    resetForm() {
      resetObj(this.columnInfoForm, { leaderUmList: [''] })
      this.$refs.gcUpload.clear()
      this.independentTableListBack = []
      this.active = 0
    }
  },
  mounted() {
    const params = this.$route.params
    this.rootType = params.rootType
    this.layoutId = params.layoutId
    this.prnLayoutId = params.prnLayoutId
    this.getPrnLayoutIdOptions(params.rootType)
    this.state = params.state
    if (this.state === 'edit') {
      this.serveDataToWebData(params)
    }
  },
  computed: {
    independentTableList() {
      const list = localPaging(
        this.independentTableListBack,
        this.independentForm
      )
      return list
    }
  },
  watch: {
    parentParams: {
      deep: true,
      handler(params) {
        this.resetForm()
        this.state = params.state
        this.layoutId = params.layoutId
        this.prnLayoutId = params.prnLayoutId
        if (this.state === 'edit') {
          this.$nextTick(() => {
            this.serveDataToWebData(params)
          })
        }
      }
    }
  },
  created() {
    this.submit = throttle(this.submit)
  }
}
</script>

<style lang="scss">
.course-recommendation__new-column {
  background-color: #fff;
  .columnInfo {
    margin-top: 60px;
    .el-form {
      width: 660px;
      margin: auto;
    }
    .items {
      margin-top: 26px;
    }
  }
  .curriculm-management {
    margin-top: 60px;
    .el-tabs__content {
      .form-box {
        margin: 25px 0 30px;
      }
    }
  }
  .radio {
    position: relative;
    width: 130px;
    height: 200px;
    border: 1px solid #e0e1e3;
    border-radius: 2px;
    &.is-checked {
      border-color: #fe7535;
    }
    .el-radio__input {
      position: absolute;
      left: 6px;
      top: 6px;
    }
    .page-style {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
  }
  .items {
    position: relative;
    .item {
      display: flex;
      width: 360px;
      height: 44px;
      padding: 0 10px;
      border-radius: 4px;
      box-shadow: 0 2px 10px 0 rgba($color: #000000, $alpha: 0.1);
      justify-content: center;
      align-items: center;
      transition: top 0.5s;
      .title-icon {
        display: flex;
        width: 28px;
        height: 28px;
        margin-right: 10px;
        border-radius: 50%;
        background-color: rgba(#d8d8d8, 0.29);
        justify-content: center;
        align-items: center;
      }
    }
    .item-move {
      position: absolute;
      left: 0;
    }
  }
}
</style>