<template>
  <div class="course-recommendation__project-management">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :rules="queryFormRules" :inline="true">
        <el-form-item label="题号">
          <el-input v-model="queryForm.sortNum" class="w200" clearable></el-input>
        </el-form-item>
        <el-form-item label="习题名称">
          <el-input v-model="queryForm.exerciseContent" clearable class="w200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item label="创建时间" class="search-card__date mr10">
            <el-date-picker
              v-model="queryForm.createStartDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="startPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="至" class="search-card__date">
            <el-date-picker
              v-model="queryForm.createEndDate"
              type="date"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="endPickerOptions"
              value-format="yyyy-MM-dd"
              popper-class="date-picker"
            >
            </el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="题型">
          <gc-select :options="exerciseTypeOptions" v-model="queryForm.exerciseType" clearable></gc-select>
        </el-form-item>
        <el-form-item label="难度">
          <gc-select :options="difficultLevelOptions" v-model="queryForm.difficultLevel" clearable></gc-select>
        </el-form-item>
        <el-form-item label="创建人UM">
          <el-input v-model="queryForm.updatedBy" class="w200" clearable></el-input>
        </el-form-item>
        <el-form-item label="题目负责人UM">
          <el-input v-model="queryForm.responsibleUm" class="w200" clearable></el-input>
        </el-form-item>
        <el-form-item label="正确率" prop="errorRate">
          <el-input v-model.trim="queryForm.minRightRate" class="w100" clearable :disabled="queryForm.emptyRightRate"></el-input> -
          <el-input v-model.trim="queryForm.maxRightRate" class="w100" clearable :disabled="queryForm.emptyRightRate"></el-input>
          <el-checkbox v-model="queryForm.emptyRightRate" style="margin-left: 10px" @change="emptyRightRateHandle">是否选择空值</el-checkbox>
        </el-form-item>
        <el-form-item label="考察能力" prop="examineContent" style="padding-left: 10px">
          <el-select v-model="queryForm.examineContent" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in examineContentOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="大类资产" prop="assetTagIds">
          <el-select class="select-style" multiple v-model="queryForm.assetTagIds" collapse-tags placeholder="请选择" clearable>
            <el-option v-for="(item, index) in searchAllAssetTag" :key="index + 'item'" :label="item.tagName" :value="item.tagId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="综合产品" prop="productTagIds">
          <el-select class="select-style" multiple value-key="label" v-model="queryForm.productTagIds" collapse-tags placeholder="请选择" clearable>
            <el-option v-for="(item, index) in searchAllProductTag" :key="index + 'item'" :label="item.tagName" :value="item.tagId"></el-option>
          </el-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 数据表格 card -->
    <el-card class="mt10">
      <div class="menu-right icons no-line" v-if="pageSource !== 'exam' && state != 'preview'">
        <span class="icons__add" @click="chooseExercise"> <i class="icons__add__icon"></i> 选择库内习题</span>
        <span class="icons__add" @click="() => (this.importDialogVisible = true)"> <i class="icons__add__icon"></i> 新增习题</span>
      </div>
      <gc-table class="general__table table-left" :list="list" :tableList="tableList" ref="curriculumTableRef">
        <el-table-column label="操作" min-width="78" prop="" class-name="td-pr0" v-if="pageSource !== 'exam'">
          <template slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation"><span class="active" @click="del(scope.row)">删除</span></div>
              <el-button :disabled="state == 'preview'" class="button-48-24">操作</el-button>
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

      <el-dialog title="添加习题" :visible.sync="addDialogVisible" width="70%">
        <CRExercisePackageAdd
          :exerciseId="exerciseId"
          :isEdit="!!this.$route.params.id"
          @addExerciseSuccess="handleAddExerciseSuccess"
          @cancel="addDialogVisible = false"
        />
      </el-dialog>

      <ImportExercisesDialog
        :showDialog="importDialogVisible"
        :exerciseId="`${exerciseId}`"
        :source="source"
        @close="() => (this.importDialogVisible = false)"
        @cancel="() => (this.importDialogVisible = false)"
        @importSuccess="
          () => {
            query()
            importDialogVisible = false
          }
        "
      />
    </el-card>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  hintFrame,
  sizeChange,
  jsonHeaders,
  commonFilter,
  currentChange,
  addAllowKeepAlive,
  gtNow,
  templateDownload,
  setPageTitle
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import { getOrg } from '../utils'
import gcTag from '@/components/chunk/tag'
import CRExercisePackageAdd from './ExercisePackageAdd.vue'
import ImportExercisesDialog from '../ExercisesBookMg/ImportExercisesDialog.vue'
import { fetchSelectAssetTagAndProductTag, fetchSelectExerciseListInProjectByPage } from '@/fetch/courseRecommendation'
import { examineContentOptions } from '@/views/CourseRecommendation/enum'
export const SOURCE = {
  ExPackage: 'ExercisePackageMg'
}
export default {
  name: 'CRExercisePackageDetail',
  props: {
    source: String,
    exerciseId: {
      type: Number,
      default: () => null
    }
  },
  mixins: [handlePickerOptions],
  components: { gcTag, CRExercisePackageAdd, ImportExercisesDialog },
  data() {
    return {
      addDialogVisible: false,
      importDialogVisible: false,
      // 查询用的表单
      queryForm: {
        sortNum: '',
        exerciseContent: '',
        exerciseType: '',
        difficultLevel: '',
        createStartDate: null,
        createEndDate: null,
        // 确定率
        minRightRate: '',
        maxRightRate: '',
        emptyRightRate: false,
        // 大类资产
        assetTagIds: [],
        // 综合产品
        productTagIds: [],
        examineContent: '',
        searchAllAssetTag: '',
        searchAllProductTag: '',
        updatedBy: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 10
      },
      queryFormRules: {
        errorRate: [
          {
            validator: (rule, value, callback) => {
              const validatorNumber = (v) => {
                // 校验是否为数字
                if (isNaN(v)) return false
                // 校验是否大于0
                if (v < 0) return false
                return true
              }
              const ERROR_TIP = '必须要输入大于0的数字'
              if (this.queryForm.minRightRate && !validatorNumber(this.queryForm.minRightRate)) return callback(new Error(ERROR_TIP))
              if (this.queryForm.maxRightRate && !validatorNumber(this.queryForm.maxRightRate)) return callback(new Error(ERROR_TIP))
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      exerciseProjectId: '',
      // 部门下拉选项
      orgOptions: [],
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          label: '题号',
          width: '80',
          prop: 'sortNum'
        },
        {
          label: '题型',
          width: '70',
          prop: 'exerciseType',
          formatter: (row) => row.exerciseType === 'sc' ? '单选题' : row.exerciseType === 'mc' ? '多选题' : row.exerciseType === 'jc' ? '判断题' : row.exerciseType,
        },
        {
          label: '习题名称',
          width: '100',
          prop: 'exerciseContent'
        },
        {
          label: '习题包名称',
          width: '100',
          prop: 'exerciseProjectName'
        },
        {
          label: '选项',
          width: '150',
          prop: 'exerciseOptionsStr'
        },
        {
          label: '答案',
          width: '100',
          prop: 'exerciseOptionsAnswerStr'
        },
        {
          label: '题目解析',
          width: '120',
          prop: 'exerciseAnalysis'
        },
        {
          label: '正确率',
          width: '80',
          prop: 'rightRate',
          formatter: (row) => (row.rightRate === null ? '-' : row.rightRate)
        },
        {
          label: '是否底层资产',
          width: '100',
          prop: 'ifBottomAsset',
        },
        {
          label: '相关内容/考察能力',
          width: '130',
          prop: 'examineContent'
        },
        {
          label: '难度',
          width: '60',
          prop: 'difficultLevel',
          formatter: (row) => row.difficultLevel === 'ry' ? '容易' : row.difficultLevel === 'zd' ? '中等' : row.difficultLevel === 'kn' ? '困难' : row.difficultLevel,
        },
        {
          label: '大类资产',
          width: '100',
          prop: 'assetTagStr'
        },
        {
          label: '综合产品分类',
          width: '100',
          prop: 'productTagStr'
        },
        {
          label: '创建人UM',
          width: '100',
          prop: 'createdBy'
        },
        {
          label: '出题人（UM号）',
          width: '120',
          prop: 'responsibleUm'
        },
        {
          label: '创建时间',
          width: '100',
          prop: 'createdDate'
        }
      ],
      tableList: [],
      // 难易程度选项
      difficultLevelOptions: [
        {
          label: '困难',
          value: 'kn'
        },
        {
          label: '中等',
          value: 'zd'
        },
        {
          label: '容易',
          value: 'ry'
        }
      ],
      // 课程类型 选项
      exerciseTypeOptions: [
        {
          label: '单选',
          value: 'sc'
        },
        {
          label: '多选',
          value: 'mc'
        },
        {
          label: '判断',
          value: 'jc'
        }
      ],
      // 课程状态 选项
      curriculumStatusOptions: [],
      // 审批状态 选项
      approvalStatusOptions: [],
      // 综推时间类型
      middleValidType: 'defaultTime',
      // 综推时间期限
      middleValidParams: {
        projectId: '',
        pushMiddleValidDays: '',
        pushMiddleValidDate: '',
        pushValidType: 'D'
      },
      isMiddleValidShow: false,
      isSuperAdmin: false,
      // 邮件频率发送入参
      meilSendTimerParams: {
        noticePeriod: '3'
      },
      // 邮件频率弹窗显示
      isMelSendShow: false,
      gtNow,
      // importVisible: false,
      // 下载模版工具函数
      templateDownload,

      // 机构树数据
      exerciseProjectList: [],
      timeout: null,
      // 验证表单
      pushInfoForm: {
        ebPackageValue: '',
        files: []
      },
      editExerciseVisible: false,
      exerciseForm: {},
      pageSource: '',
      state: null,
      // 查询条件中的大类资产列表
      searchAllAssetTag: [],
      // 查询条件中的综合产品列表
      searchAllProductTag: [],
      examineContentOptions
    }
  },
  watch: {
    exerciseId: {
      immediate: true,
      handler(value) {
        this.exerciseId = value || this.$route.params.id
        this.query()
      }
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
    },
    getList() {
      this.$refs.form?.validate((v) => {
        if (!v) return
        console.log(562, this.$route.params)
        let data = this.queryForm
        data.exerciseProjectId = this.exerciseId || this.exerciseProjectId || null
        data.createStartDate = data.createStartDate ? data.createStartDate : null
        data.createEndDate = data.createEndDate ? data.createEndDate : null
        if (!data.exerciseProjectId) return
        fetchSelectExerciseListInProjectByPage({ data: { ...data, emptyRightRate: data.emptyRightRate === true ? 'Y' : 'N' } }).then(
          ({ total, list }) => {
            this.total = total
            this.tableList = list
          }
        )
      })
    },
    handleAddExerciseSuccess() {
      this.addDialogVisible = false
      this.reset()
      this.getList()
    },
    // 跳转到预览界面
    preview(row) {
      console.log(357, row)
      let { id } = row
      const params = {
        state: 'edit',
        id
      }
      addAllowKeepAlive('/CRNewExercisePackage')
      this.$router.push({
        name: '新增习题包',
        params
      })
    },
    // 打开修改项目界面
    openEditPage(row) {},
    // 删除课程
    delCurriculum() {
      const selection = this.$refs.curriculumTableRef.$children[0].selection
      console.log(388, selection)
    },
    del(row) {
      console.log(425, row)
      hintFrame(`确定删除习题：${row.exerciseContent}？`).then((res) => {
        const { id } = row
        this.deleteProjectExerciseF(id)
      })
    },
    // 设置综推时间 根据pushValidType进行状态设置，pushValidType为D且值为0是默认综推时间
    ExercisePackageDetail(row) {
      console.log('习题')
    },
    chooseExercise() {
      const params = {
        state: 'edit',
        exerciseProjectId: this.exerciseProjectId,
        exerciseProjectName: this.exerciseProjectName
      }

      if (this.source === SOURCE.ExPackage) {
        return (this.addDialogVisible = true)
      }

      addAllowKeepAlive('/CRExercisePackageAdd')
      this.$router.push({
        name: '添加习题',
        params
      })
    },
    // 删除习题包下面的习题
    deleteProjectExerciseF(id) {
      const data = {
        id: this.exerciseId || this.exerciseProjectId,
        exerciseInfoIds: [id]
      }
      this.$axios.post('/fn/privatewealth/exerciseproject/deleteExerciseByProjectIdAndExerciseIds', data, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    // 删除习题
    deleteExerciseInfoByIdF(id) {
      const data = { id }
      this.$axios.post('/fn/privatewealth/exerciseinfo/deleteExerciseInfoById', data, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    // 推送人员确认事件
    pushPersonelComfirm() {
      this.$refs.pushInfoFormRef.validate((valied) => {
        if (valied) {
          console.log(111, valied)
        }
      })
      console.log(560, this.pushInfoForm)
      console.log('确定')
    },
    fileChange($event) {
      this.pushInfoForm.files = [$event.target.files[0]]
    },
    delFile(i) {
      this.pushInfoForm.files.splice(i, 1)
    },
    // 树节点搜索方法
    filterNodeMethod(value, data, node) {
      if (!value || !value.trim()) return true
      return data.orgName.includes(value)
    },
    orgIdChange(keys) {
      this.pushInfoForm.orgId = keys
    },
    arrToTree(arr, data) {
      arr.forEach((v) => {
        const children = data.filter((child) => child.parentOrgId == v.orgId)
        if (children.length > 0) {
          v.children = children
          this.arrToTree(children, data)
        }
      })
    },
    handleSelect(item) {
      console.log(item)
    },
    emptyRightRateHandle(value) {
      if (value) {
        this.queryForm.minRightRate = ''
        this.queryForm.maxRightRate = ''
      }
    }
  },
  mounted() {
    const { state } = this.$route.params
    this.state = state
    this.isSuperAdmin = this.$store.state.userInfo.roleIds.includes('50001')
    this.query()
    getOrg().then((res) => {
      this.orgOptions = res
    })
    fetchSelectAssetTagAndProductTag().then((res) => {
      const { allAssetTag, allProductTag } = res
      this.searchAllAssetTag = allAssetTag
      this.searchAllProductTag = allProductTag
    })
  },
  activated() {
    // console.log(785, this.$route.params)
    let { exerciseProjectName, exerciseProjectId, pageSource } = this.$route.params
    this.pageSource = pageSource
    if (exerciseProjectName || exerciseProjectId) {
      this.exerciseProjectId = this.$route.params.exerciseProjectId
      this.exerciseProjectName = exerciseProjectName
      setPageTitle(`习题包：${exerciseProjectName}`)
      this.$wenEvent.$emit('getTiele')
    }
    this.getList()
    console.log(399, this.$route.params)
  }
}
</script>

<style lang="scss" scoped>
.select-style {
  width: 200px;
  :deep(.el-input__inner) {
    height: auto !important;
  }
}
</style>

<style lang="scss">
.CourseRecommendation__PushPersonnel {
  .el-form {
    width: 670px;
    margin: auto;
  }
}
.ExercisesBookMg__editExercise {
  .el-form {
    width: 300px;
  }
}
</style>
