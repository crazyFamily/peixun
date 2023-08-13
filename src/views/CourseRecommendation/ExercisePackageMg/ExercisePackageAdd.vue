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
        <el-form-item label="题目负责人">
          <el-input v-model="queryForm.responsibleUm" class="w200" clearable></el-input>
        </el-form-item>
        <el-form-item label="正确率" prop="errorRate">
          <el-input v-model.trim="queryForm.minRightRate" class="w100" clearable :disabled="queryForm.emptyRightRate"></el-input> -
          <el-input v-model.trim="queryForm.maxRightRate" class="w100" clearable :disabled="queryForm.emptyRightRate"></el-input>
          <el-checkbox v-model="queryForm.emptyRightRate" style="margin-left: 10px" @change="emptyRightRateHandle">是否选择空值</el-checkbox>
        </el-form-item>
        <el-form-item label="考察能力" prop="examineContent">
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
      <div class="menu-right no-line">
        <span
          >已选择题目：{{
            ($refs.curriculumTableRef && $refs.curriculumTableRef.$children && $refs.curriculumTableRef.$children[0].selection.length) || 0
          }}</span
        >
      </div>
      <gc-table class="general__table table-left" :list="list" :tableList="tableList" ref="curriculumTableRef"> </gc-table>
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
    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="cancel">取消</el-button>
      <el-button class="button-w120-h30" type="primary" @click="addExerciseToProject">添加习题到习题包</el-button>
    </div>
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
  closeCurrPage,
  closeCurrPageAndGoPath,
  setPageTitle
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import { getOrg } from '../utils'
import gcTag from '@/components/chunk/tag'
import { examineContentOptions } from '@/views/CourseRecommendation/enum'
import { fetchSelectAssetTagAndProductTag, fetchSelectExerciseInfoListForProjectByPage } from '@/fetch/courseRecommendation'
export default {
  name: 'CRExercisePackageAdd',
  props: {
    exerciseId: Number
  },
  mixins: [handlePickerOptions],
  components: { gcTag },
  data() {
    return {
      // 查询用的表单
      queryForm: {
        sortNum: '',
        exerciseContent: '',
        exerciseType: '',
        difficultLevel: '',
        createStartDate: null,
        createEndDate: null,
        exerciseProjectName: '',
        // 确定率
        minRightRate: '',
        maxRightRate: '',
        emptyRightRate: false,
        // 大类资产
        assetTagIds: [],
        // 综合产品
        productTagIds: [],
        // 考察能力
        examineContent: '',
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
      // 部门下拉选项
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          type: 'selection',
          width: '54'
        },
        {
          label: '题号',
          width: '70',
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
          width: '120',
          prop: 'exerciseProjectNameStr'
        },
        {
          label: '选项',
          width: '100',
          prop: 'exerciseOptionsStr'
        },
        {
          label: '答案',
          width: '80',
          prop: 'exerciseOptionsAnswerStr'
        },
        {
          label: '题目解析',
          width: '100',
          prop: 'exerciseAnalysis'
        },
        {
          label: '是否底层资产',
          width: '60',
          prop: 'ifBottomAsset',
        },
        {
          label: '正确率',
          width: '80',
          prop: 'rightRate',
          formatter: (row) => (row.rightRate === null ? '-' : row.rightRate)
        },
        {
          label: '相关内容/考察能力',
          width: '100',
          prop: 'examineContent'
        },
        {
          label: '难度',
          width: '60',
          prop: 'assetTagStr',
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
          label: '创建人',
          width: '100',
          prop: 'createdByName'
        },
        {
          label: '题目负责人UM',
          width: '100',
          prop: 'responsibleUm'
        },
        {
          label: '创建时间',
          width: '80',
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
      // 邮件频率弹窗显示
      gtNow,
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
      exerciseForm: {},
      exerciseProjectId: '',
      searchAllAssetTag: [],
      searchAllProductTag: [],
      examineContentOptions
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
      this.$refs.form.validate((v) => {
        if (!v) return
        let data = this.queryForm
        data.createStartDate = data.createStartDate ? data.createStartDate : null
        data.createEndDate = data.createEndDate ? data.createEndDate : null
        fetchSelectExerciseInfoListForProjectByPage({ data: { ...data, emptyRightRate: data.emptyRightRate === true ? 'Y' : 'N' } }).then(
          ({ total, list }) => {
            this.total = total
            this.tableList = list
            setTimeout(() => {
              list.forEach((v) => {
                if (this.exerciseProjectId && v.exerciseProjectIdStr && v.exerciseProjectIdStr.indexOf(this.exerciseProjectId) > -1) {
                  console.log(3688888, v)
                  this.$refs.curriculumTableRef.$children[0].toggleRowSelection(v)
                }
              })
            }, 0)
          }
        )
      })
    },
    // 添加到习题对的包
    addExerciseToProject() {
      const selection = this.$refs.curriculumTableRef.$children[0].selection
      console.log(388, selection)
      if (selection.length < 1) {
        return this.$nextTick(() => {
          this.$message.warning('请勾选课程')
        })
      }
      let _exerciseInfoIds = selection.map((o) => parseInt(o.sortNum))
      console.log(_exerciseInfoIds, 384)
      let data = {
        exerciseProjectId: this.exerciseProjectId,
        exerciseInfoIds: _exerciseInfoIds
      }
      this.$axios.post('/fn/privatewealth/exerciseinfo/addExerciseInfoListToExerciseProject', data, jsonHeaders).then((res) => {
        if (res.data.code === 0) {
          this.$message.success('添加习题成功')
          if (this.exerciseId) {
            return this.$emit('addExerciseSuccess')
          }
          closeCurrPage()
        }
      })
    },
    // 取消
    cancel() {
      this.addDialogVisible = false
      if (this.exerciseId) {
        return this.$emit('cancel')
      }
      closeCurrPage()
    },
    emptyRightRateHandle(value) {
      if (value) {
        this.queryForm.minRightRate = ''
        this.queryForm.maxRightRate = ''
      }
    }
  },
  mounted() {
    if (this.exerciseId) {
      this.exerciseProjectId = this.exerciseId
      this.query()
    }
    fetchSelectAssetTagAndProductTag().then((res) => {
      const { allAssetTag, allProductTag } = res
      this.searchAllAssetTag = allAssetTag
      this.searchAllProductTag = allProductTag
    })
  },
  activated() {
    let { exerciseProjectName, exerciseProjectId } = this.$route.params
    if (exerciseProjectName || exerciseProjectId) {
      this.exerciseProjectId = this.$route.params.exerciseProjectId
      setPageTitle(`习题包添加习题：${exerciseProjectName}`)
      this.$wenEvent.$emit('getTiele')
    }
    this.query()
  },
  watch: {}
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
.date-picker {
  z-index: 2800 !important;
}
</style>
