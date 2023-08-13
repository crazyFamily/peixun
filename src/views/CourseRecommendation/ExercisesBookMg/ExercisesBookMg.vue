<template>
  <div class="course-recommendation__project-management">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" class="grid-form" :model="queryForm" :rules="queryFormRules" :inline="true">
        <el-form-item label="题号">
          <el-input v-model="queryForm.sortNum" class="w200" clearable></el-input>
        </el-form-item>
        <el-form-item label="习题名称">
          <el-input v-model="queryForm.exerciseContent" clearable class="w200"></el-input>
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
        <el-form-item label="考察能力" prop="examineContent">
          <el-select v-model="queryForm.examineContent" placeholder="请选择" clearable>
            <el-option v-for="(item, index) in examineContentOptions" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="大类资产" prop="assetTagIds">
          <el-select multiple v-model="queryForm.assetTagIds" collapse-tags placeholder="请选择" style="width: 200px" clearable>
            <el-option v-for="(item, index) in searchAllAssetTag" :key="index + 'item'" :label="item.tagName" :value="item.tagId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="综合产品" prop="productTagIds">
          <el-select multiple value-key="label" v-model="queryForm.productTagIds" collapse-tags placeholder="请选择" style="width: 200px" clearable>
            <el-option v-for="(item, index) in searchAllProductTag" :key="index + 'item'" :label="item.tagName" :value="item.tagId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="time-grid-item">
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
          导入习题</span
        >
        <span class="icons__add" @click="exportHandle()">
          <i class="icons__upload__icon"></i>
          导出习题库</span
        >
        <span class="icons__del" @click="delCurriculum">
          <i class="icons__del__icon"></i>
          删除</span
        >
      </div>
      <gc-table class="general__table table-left" :list="list" :tableList="tableList" ref="curriculumTableRef">
        <el-table-column label="操作" min-width="78" prop="" fixed="right" class-name="td-pr0">
          <template slot-scope="scope">
            <el-tooltip placement="left" :visible-arrow="false" popper-class="bgf shadow-1">
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="openEditPage(scope.row)">编辑</span>
                <span class="active" @click="delSignleA(scope.row)">删除</span>
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
    <gc-model title="导入习题" width="800px" :visible.sync="importVisible" @comfirm="importExcel" custom-class="CourseRecommendation__PushPersonnel">
      <el-form ref="pushInfoFormRef" :model="pushInfoForm" label-width="70px" class="item-mb30" @submit.native.prevent>
        <div key="1">
          <el-form-item label="上传文件" class="mb10">
            <div class="df">
              <gc-fileInput btn-text="选择文件" @change="fileChange" />
              <div class="b926 ml20" @click="templateDownload('/common/file/downloadExerciseModule')">
                <span class="instructor-icons__download margin-0 gary-color">
                  <i class="instructor-icons__download__icon"></i>
                  模版下载
                </span>
              </div>
            </div>
          </el-form-item>
          <p class="mt10 aic tintColor">
            <i class="icons-wraning mr10"></i>
            需先下载模版，添加数据后再上传文件，请勿修改模版格式。
          </p>
          <el-form-item>
            <div class="doc-box mt20" v-for="(file, i) in pushInfoForm.files" :key="file.lastModified">
              <span>
                <i class="operation__doc mr10"></i>
                {{ file.name }}
                <i class="operation__close ml15" @click="delFile(i)"></i>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="题库" prop="orgId">
            <el-autocomplete
              v-model="pushInfoForm.ebPackageValue"
              value-key="exerciseProjectName"
              :fetch-suggestions="querySearchAsync"
              :debounce="1000"
              placeholder="请输入内容"
              @select="handleSelect"
              @clear="handleSelect"
              clearable
            ></el-autocomplete>
          </el-form-item>
        </div>
      </el-form>
    </gc-model>
    <gc-model
      title="编辑习题"
      width="800px"
      :visible.sync="editExerciseVisible"
      @comfirm="pushPersonelComfirm"
      custom-class="ExercisesBookMg__editExercise"
    >
      <el-form
        ref="exerciseFormRef"
        :rules="projectRules"
        :model="exerciseForm"
        label-width="100px"
        class="exercise-edit-outer item-mb3"
        @submit.native.prevent
      >
        <div key="1">
          <el-form-item label="题号" prop="sortNum">
            <el-input disabled v-model="exerciseForm.sortNum" clearable></el-input>
          </el-form-item>
          <el-form-item label="题形" prop="exerciseType">
            <el-select @change="exerciseTypeChange" v-model="exerciseForm.exerciseType" placeholder="请选择题形">
              <el-option v-for="(item, index) in exerciseTypeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目" prop="exerciseContent">
            <el-input v-model="exerciseForm.exerciseContent" clearable></el-input>
          </el-form-item>
          <template v-if="exerciseForm.exerciseType !== 'jc'">
            <el-form-item
              v-for="(item, index) in exerciseForm.exerciseOptions"
              :key="index"
              :label="'选项' + String.fromCharCode(65 + index)"
              prop="exerciseOptions"
            >
              <el-col :span="20"><el-input v-model="item.exerciseOption" clearable></el-input></el-col>
              <el-col :span="2" class="newAdd__right text-align-right">
                <span class="icons__del r0" @click.stop="delExercise(item, index)">
                  <i class="icons__del__icon"></i>
                </span>
              </el-col>
              <el-col :span="2" v-show="index == exerciseForm.exerciseOptions.length - 1" class="newAdd__right text-align-right">
                <span class="icons__add r0" @click.stop="addExercise">
                  <i class="icons__add__icon"></i>
                </span>
              </el-col>
            </el-form-item>
          </template>
          <el-form-item label="答案" prop="answers">
            <el-select :multiple="exerciseFormIsmultiple" value-key="label" v-model="exerciseForm.answers" placeholder="请选择">
              <el-option
                v-for="(item, index) in exerciseForm.exerciseOptions"
                :key="index + 'item'"
                :label="exerciseForm.exerciseType === 'jc' ? item.exerciseOption : String.fromCharCode(65 + index)"
                :value="item.optionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="题目解析" prop="exerciseAnalysis">
            <el-input v-model="exerciseForm.exerciseAnalysis" clearable type="textarea" maxlength="1000" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="是否底层资产" prop="ifBottomAsset">
            <el-select v-model="exerciseForm.ifBottomAsset" placeholder="请选择">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度" prop="difficultLevel">
            <el-select v-model="exerciseForm.difficultLevel" placeholder="请选择">
              <el-option v-for="(item, index) in difficultLevelOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考察能力" prop="examineContent">
            <el-select v-model="exerciseForm.examineContent" placeholder="请选择">
              <el-option v-for="(item, index) in examineContentOptions" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="大类资产" prop="assetTagIds">
            <el-select multiple v-model="exerciseForm.assetTagIds" placeholder="请选择">
              <el-option v-for="(item, index) in allAssetTag" :key="index + 'item'" :label="item.tagName" :value="item.tagId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="综合产品" prop="productTagIds">
            <el-select multiple value-key="label" v-model="exerciseForm.productTagIds" placeholder="请选择">
              <el-option v-for="(item, index) in allProductTag" :key="index + 'item'" :label="item.tagName" :value="item.tagId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出题人（UM号）" class="ws dr-label" prop="person">
            <UMSelect :form="exerciseForm" isEdit @UmSelect="handleUmSelect" />
          </el-form-item>
        </div>
      </el-form>
    </gc-model>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  dataHeaders,
  hintFrame,
  sizeChange,
  jsonHeaders,
  commonFilter,
  currentChange,
  addAllowKeepAlive,
  gtNow,
  templateDownload
} from '@/util/utils'
import { handlePickerOptions } from '@/mixins/component'
import { getOrg } from '../utils'
import gcTag from '@/components/chunk/tag'
import UMSelect from '../ExercisePackageMg/components/UMSelect.vue'
import {
  fetchSelectAssetTagAndProductTag,
  fetchSelectExerciseInfoListForProjectByPage,
  fetchExportExerciseInfoList
} from '@/fetch/courseRecommendation'
export default {
  name: 'CRExercisesBookMg',
  mixins: [handlePickerOptions],
  components: { gcTag, UMSelect },
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
        updatedBy: '',
        responsibleUm: '',
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
      orgOptions: [],
      total: 0,
      // 分页函数
      sizeChange,
      currentChange,
      // 表格筛选公共函数
      commonFilter,
      list: [
        {
          type: 'selection',
          width: '50'
        },
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
          width: '350',
          prop: 'exerciseContent'
        },
        {
          label: '习题包名称',
          width: '350',
          prop: 'exerciseProjectNameStr'
        },
        {
          label: '选项',
          width: '350',
          prop: 'exerciseOptionsStr'
        },
        {
          label: '答案',
          width: '350',
          prop: 'exerciseOptionsAnswerStr'
        },
        {
          label: '题目解析',
          width: '80',
          prop: 'exerciseAnalysis'
        },
        {
          label: '是否底层资产',
          width: '100',
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
          width: '130',
          prop: 'examineContent'
        },
        {
          label: '难度',
          width: '60',
          prop: 'difficultLevel',
          formatter: (row) => row.difficultLevel === 'ry' ? '容易' : row.difficultLevel === 'zd' ? '中等' : row.difficultLevel === 'kn' ? '困难' : row.difficultLevel ,
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
          width: '140',
          prop: 'createdBy'
        },
        {
          label: '创建人姓名',
          width: '80',
          prop: 'createdByName'
        },
        {
          label: '出题人（UM号）',
          width: '140',
          prop: 'responsibleUm'
        },
        {
          label: '创建时间',
          prop: 'createdDate',
          width: '160'
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
      // examineContent选项
      examineContentOptions: [
        {
          label: '底层资产',
          value: 'bottom'
        },
        {
          label: '市场',
          value: 'market'
        },
        {
          label: '产品',
          value: 'product'
        },
        {
          label: '其他',
          value: 'others'
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
      gtNow,
      importVisible: false,
      // 下载模版工具函数
      templateDownload,
      // 机构树数据
      exerciseProjectList: [],
      timeout: null,
      // 验证表单
      pushInfoForm: {
        ebPackageValue: '',
        files: [],
        importExerciseProjectId: ''
      },
      editExerciseVisible: false,
      exerciseFormIsmultiple: false,
      exerciseForm: {
        sortNum: '', // 题号
        exerciseType: 'sc', // 题形
        exerciseContent: '', // 习题内容
        exerciseOptions: [], // 习题选项
        assetTagIds: [], // 大类资产
        productTagIds: [], // 综合产品渗透率
        difficultLevel: '', // 难度
        exerciseAnalysis: '', // 题目解析
        ifBottomAsset: '', // 是否底层资产
        examineContent: '', // 相关内容
        person: '', // 题目负责人
        answers: []
      },
      responsible: {
        umId: '',
        umName: ''
      },
      allProductTag: [],
      allAssetTag: [],
      // 项目信息 form 验证规则
      projectRules: {
        sortNum: [{ required: true, trigger: 'blur', message: '习题号必填' }],
        exerciseType: [{ required: true, message: '请选择题型' }],
        exerciseContent: [{ required: true, message: '请填写题目' }],
        answers: [{ required: true, message: '请填选择答案' }],
        assetTagIds: [{ required: false, message: '请选择大类资产' }],
        difficultLevel: [{ required: true, message: '请选择难度' }],
        productTagIds: [{ required: false, message: '请选择综合产品标签' }],
        ifBottomAsset: [{ required: false, message: '请填是否为底层' }],
        examineContent: [{ required: false, message: '请选择考察能力' }]
      },
      // 查询条件中的大类资产列表
      searchAllAssetTag: [],
      // 查询条件中的综合产品列表
      searchAllProductTag: []
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
          }
        )
      })
    },
    add() {
      this.importVisible = true
      this.pushInfoForm.ebPackageValue = ''
      this.pushInfoForm.files = []
    },
    exportHandle() {
      fetchExportExerciseInfoList().catch(e => console.log(e))
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
    openEditPage(row) {
      console.log(619, row)
      this.editExerciseVisible = true
      this.getExerciseDetail(row.id)
    },
    umStr({ umId, umName }) {
      return `${umId}(${umName})`
    },
    // 查询习题详情
    getExerciseDetail(id) {
      const data = {
        id: id
      }
      this.$axios.post('/fn/privatewealth/exerciseinfo/selectExerciseInfoById', data, jsonHeaders).then((res) => {
        const { code, data } = res.data
        let _data = data
        if (code === 0) {
          this.exerciseForm.sortNum = _data.sortNum
          this.exerciseForm.exerciseType = _data.exerciseType
          if (_data.exerciseType === 'mc') {
            this.exerciseFormIsmultiple = true
            console.log(
              453,
              _data.exerciseOptions.map((v) => v.id)
            )
            this.exerciseForm.answers = _data.exerciseOptions.filter((v) => v.ifAnswer == 'Y').map((v) => v.optionId)
          } else {
            this.exerciseFormIsmultiple = false
            let _sl = _data.exerciseOptions.filter((v) => v.ifAnswer == 'Y')
            this.exerciseForm.answers = _sl.length ? _sl[0].optionId : ''
          }
          this.exerciseForm.exerciseContent = _data.exerciseContent
          this.exerciseForm.exerciseOptions = _data.exerciseOptions
          this.exerciseForm.assetTagIds = _data.assetTagIds.map((v) => v.tagId)
          this.exerciseForm.productTagIds = _data.productTagIds.map((v) => v.tagId)
          this.exerciseForm.difficultLevel = _data.difficultLevel
          this.exerciseForm.exerciseAnalysis = _data.exerciseAnalysis
          this.exerciseForm.ifBottomAsset = _data.ifBottomAsset
          this.exerciseForm.examineContent = _data.examineContent
          this.responsible = {
            umId: _data.responsibleUm,
            umName: _data.responsibleName
          }
          this.exerciseForm.person = this.umStr(this.responsible)
          this.allProductTag = _data.allProductTag
          this.allAssetTag = _data.allAssetTag
          console.log(469, this.exerciseForm)
        }
      })
    },
    addExercise() {
      console.log(1)
      let _o = {
        optionId: -this.exerciseForm.exerciseOptions.length - 1,
        exerciseOption: '',
        ifAnswer: 'N'
      }
      this.exerciseForm.exerciseOptions.push(_o)
    },
    delExercise(item, index) {
      if (this.exerciseForm.exerciseOptions.length < 2) {
        this.$message.error('至少有一个选项，不能删除')
        return
      }
      hintFrame(`确定删除：${item.exerciseOption}？, 删除后请重新设置答案`).then((res) => {
        this.exerciseForm.exerciseOptions.splice(index, 1)
        if (this.exerciseForm.exerciseType == 'mc') {
          this.exerciseForm.answers = []
        } else {
          this.exerciseForm.answers = ''
        }
      })
    },
    exerciseTypeChange(p) {
      this.exerciseFormIsmultiple = p === 'mc'
      if (p === 'mc') {
        this.exerciseForm.answers = []
      } else {
        this.exerciseForm.answers = ''
      }
      if (p == 'jc') {
        this.exerciseForm.exerciseOptions = [
          {
            optionId: -2,
            exerciseOption: '正确',
            ifAnswer: 'N'
          },
          {
            optionId: -1,
            exerciseOption: '错误',
            ifAnswer: 'N'
          }
        ]
      } else {
        // this.exerciseForm.exerciseOptions = [
        //   {
        //     optionId: 0,
        //     exerciseOption: '',
        //     ifAnswer: ''
        //   }
        // ]
      }
      console.log(471, p, this.exerciseForm.exerciseOptions)
    },
    // 批量删除
    delCurriculum() {
      const selection = this.$refs.curriculumTableRef.$children[0].selection
      let _n = selection.map((v) => v.exerciseContent)
      hintFrame(`确定删除：${_n.join(',')}？`).then((res) => {
        let _idS = selection.map((v) => v.id)
        console.log(428, _idS)
        this.deleteExerciseListF(_idS)
      })
      console.log(388, selection)
    },
    // 删除习题【批量】
    deleteExerciseListF(ids) {
      const data = { ids: ids }
      this.$axios.post('/fn/privatewealth/exerciseinfo/deleteExerciseInfoByIdList', data, jsonHeaders).then((res) => {
        const { code } = res.data
        if (code === 0) {
          this.$message.success('删除成功')
          this.getList()
        }
      })
    },
    delSignleA(row) {
      console.log(425, row)
      hintFrame(`确定删除：${row.exerciseContent}？`).then((res) => {
        const { id } = row
        this.deleteExerciseListF([id])
      })
    },
    fileChange($event) {
      this.pushInfoForm.files = [$event.target.files[0]]
    },
    importExcel() {
      console.log(616, dataHeaders)
      const data = new FormData()
      data.append('file', this.pushInfoForm.files[0])
      data.append('exerciseProjectId', this.pushInfoForm.importExerciseProjectId)
      this.$axios.post('/common/file/importExerciseInfo', data, dataHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          console.log(625, code, data)
          this.$message.success('导入成功')
          this.importVisible = false
          setTimeout(() => {
            this.query()
          }, 100)
        } else if (code === 4) {
          this.$confirm('导入习题失败，是否请查看失败明细？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'exercise-error-tips',
            type: 'warning'
          })
            .then(() => {
              templateDownload('/common/file/downloadExerciseErrorMsg', {
                taskId: data.taskId
              })
            })
            .catch(() => {
              console.log('已取消')
            })
        }
      })
    },
    // 修改习题
    pushPersonelComfirm() {
      this.validateProjectData().then((res) => {
        if (res) {
          return this.$message.warning(res)
        }
        console.log(562, this.exerciseForm, this.allAssetTag, this.allProductTag)
        let _exerciseForm = this.exerciseForm
        let _answers = _exerciseForm.answers
        let _exerciseOptions = []
        _exerciseForm.exerciseOptions.forEach((v) => {
          console.log(567, v)
          let _t = null
          if (_exerciseForm.exerciseType == 'mc') {
            _t = _answers.includes(v.optionId) ? 'Y' : 'N'
          } else {
            _t = _answers == v.optionId ? 'Y' : 'N'
          }
          _exerciseOptions.push({
            ifAnswer: _t,
            exerciseOption: v.exerciseOption
          })
        })
        let _assetTagIdsSelect = _exerciseForm.assetTagIds
        let _productTagIdsSelect = _exerciseForm.productTagIds
        let data = {
          id: _exerciseForm.sortNum,
          exerciseType: _exerciseForm.exerciseType,
          exerciseContent: _exerciseForm.exerciseContent,
          exerciseOptions: _exerciseOptions,
          assetTagIds: _assetTagIdsSelect,
          productTagIds: _productTagIdsSelect,
          difficultLevel: _exerciseForm.difficultLevel,
          exerciseAnalysis: _exerciseForm.exerciseAnalysis,
          ifBottomAsset: _exerciseForm.ifBottomAsset,
          examineContent: _exerciseForm.examineContent,
          responsibleUm: this.umStr(this.responsible) === _exerciseForm.person ? this.responsible.umId : _exerciseForm.person
        }
        console.log(605, data)
        this.$axios.post('/fn/privatewealth/exerciseinfo/updateExerciseInfo', { data }, jsonHeaders).then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('修改成功')
            this.editExerciseVisible = false
            this.getList()
          }
        })
        console.log('确定')
      })
    },
    // 验证项目数据
    validateProjectData() {
      console.log(11, this.exerciseForm)
      const errors = []
      this.$refs.exerciseFormRef.validate((valied) => {
        console.log(546, valied)
        errors[0] = valied ? 0 : '习题验证错误，请补充完整'
      })

      return new Promise((resolve, reject) => {
        this.$nextTick(() => resolve(errors.find((v) => v)))
      })
    },
    delFile(i) {
      this.pushInfoForm.files.splice(i, 1)
    },
    getExerciseProjectList(name, cb) {
      let data = {
        createStartDate: null,
        createEndDate: null,
        exerciseProjectName: name || '',
        sortNum: '',
        responsibleUmId: '',
        updatedBy: '',
        //当前页
        currPage: 1,
        //每页大小
        pageSize: 200
      }
      this.$axios.post('/fn/privatewealth/exerciseproject/selectExerciseProjectListByPage', { data }, jsonHeaders).then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          const { total, list } = data
          let _l = list || []
          cb(_l)
        }
      })
    },
    querySearchAsync(queryString, cb) {
      this.getExerciseProjectList(queryString, (list) => {
        cb(list)
      })
      console.log(645, queryString)
    },
    handleSelect(item) {
      this.pushInfoForm.importExerciseProjectId = (item && item.id) || ''
      console.log(750, item)
    },
    handleUmSelect(value) {
      console.log('UM', value)
    },
    emptyRightRateHandle(value) {
      if (value) {
        this.queryForm.minRightRate = ''
        this.queryForm.maxRightRate = ''
      }
    }
  },
  watch: {},
  mounted() {
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
    this.query()
  }
}
</script>

<style lang="scss" scoped>
// .grid-form {
//   display: grid;
//   grid-template-columns: repeat(6, 1fr);

//   :deep(.el-form-item) {
//     grid-area: auto/span 2;
//   }

//   .time-grid-item {
//     grid-area: auto/span 5;
//   }
// }
</style>

<style lang="scss">
.CourseRecommendation__PushPersonnel {
  .el-form {
    width: 670px;
    margin: auto;
  }
}
.ExercisesBookMg__editExercise {
  .exercise-edit-outer {
    .el-select {
      width: 100%;
    }
  }
  .text-align-right {
    text-align: right;
  }
  .el-form {
    width: 400px;
  }
}
.exercise-error-tips {
  .el-message-box__btns {
    .el-button:first-child {
      span {
        color: #7d8292;
      }
    }
  }
}
.el-message-box__container {
  max-height: 200px;
  overflow: auto;
}
</style>
