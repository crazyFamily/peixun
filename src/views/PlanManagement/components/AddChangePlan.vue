<template>
  <div class="check-plain">
    <el-card class="form-card check-card-wrapper">
      <div class="title">
        <div class="title__menu"></div>
        基本信息
      </div>
      <el-form
        class="mt20"
        ref="coursePlanRef"
        :model="coursePlanBaseInfo"
        :rules="coursePlanBaseInfoRules"
      >
        <!-- 培训班的 -->
        <div v-if="showTrainingCourse">
          <!-- 这里是金服的 -->
          <div
            class="form-box"
            v-if="$store.state.userInfo.blgStripLine === 'JF'"
          >
            <div class="ls-form-wrapper">
              <el-form-item label="所属部门" class="org-item-style">
                <TopNodeInstitution :disabled="isRelationClass" v-model="coursePlanBaseInfo.topNodeOrgs" :busi-type="blgStripLine" :top-node="topNode" width="250px" ref="topNodeInstitutionRef"></TopNodeInstitution>
              </el-form-item>
              <el-form-item label="培训类型" prop="trainType">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="selectOptions.trainTypes"
                  v-model="coursePlanBaseInfo.trainType"
                  :disabled="isRelationClass"
                >
                </gc-select>
              </el-form-item>
              <el-form-item label="是否消保培训" prop="ifConformance">
                <gc-select
   class="padding-0"
                  :options="[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]"
                  v-model="coursePlanBaseInfo.ifConformance"
                  :disabled="isRelationClass"
                >
                </gc-select>
              </el-form-item>
              <el-form-item label="业务模块" prop="channelType">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="selectOptions.channelTypes"
                  v-model="coursePlanBaseInfo.channelType"
                  @change="channelTypeChange"
                  :disabled="isRelationClass"
                ></gc-select>
              </el-form-item>
              <el-form-item label="关键岗位">
                <el-input
                  v-model="coursePlanBaseInfo.keyJobs"
                  :disabled="isRelationClass"
                  maxlength="50"
                  show-word-limit
                  class="input-limit-style"
                >
                </el-input>
              </el-form-item>
              <template v-if="classTypeShowState">
                <el-form-item label="项目名称" prop="className">
                  <el-input v-model="coursePlanBaseInfo.className" :disabled="isRelationClass"></el-input>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="项目名称" prop="className">
                  <el-input
                    v-model="coursePlanBaseInfo.className"
                    :disabled="isRelationClass"
                  ></el-input>
                </el-form-item>
              </template>
 <el-form-item label="培训系列" prop="trainSeries">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="selectOptions.trainSeries"
                  v-model="coursePlanBaseInfo.trainSeries"
                  @change="trainSeriesChange"
                  :disabled="isRelationClass"
                ></gc-select>
              </el-form-item>
              <el-form-item label="子系列" prop="childSeries">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="trainSeriesChildOptions"
                  v-model="coursePlanBaseInfo.childSeries"
                  :disabled="isRelationClass"
                ></gc-select>
              </el-form-item>
              <el-form-item label="总期数" prop="termNum">
                <el-input v-model="coursePlanBaseInfo.termNum"></el-input>
              </el-form-item>
              <el-form-item label="" class="block"></el-form-item>
            </div>
          </div>
          <div class="form-box" v-else-if="blgStripLine === 'LS'">
            <div class="ls-form-wrapper">
              <el-form-item label="所属部门" class="org-item-style">
                <!-- <el-input
                  disabled
                  v-model="coursePlanBaseInfo.blgDeptName"
                ></el-input> -->
           <TopNodeInstitution :disabled="isRelationClass" v-model="coursePlanBaseInfo.topNodeOrgs" :busi-type="blgStripLine" :top-node="topNode" width="250px" ref="topNodeInstitutionRef"></TopNodeInstitution>
              </el-form-item>
              <el-form-item label="计划科目">
                <el-input disabled value="常规预算"></el-input>
              </el-form-item>
              <el-form-item label="培训类型" prop="trainType">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="selectOptions.trainTypes"
                  v-model="coursePlanBaseInfo.trainType"
                  :disabled="isRelationClass"
                >
                </gc-select>
              </el-form-item>
              <el-form-item label="是否消保培训" prop="ifConformance">
                <gc-select
                  class="padding-0"
                  :options="[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]"
                  v-model="coursePlanBaseInfo.ifConformance"
                  :disabled="isRelationClass"
                >
                </gc-select>
              </el-form-item>
              <template v-if="classTypeShowState">
                <el-form-item label="业务模块" prop="channelType">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="selectOptions.channelTypes"
                    v-model="coursePlanBaseInfo.channelType"
                    @change="channelTypeChange"
                    :disabled="isRelationClass"
                  ></gc-select>
                </el-form-item>
              </template>
              <template v-else>
           <el-form-item label="业务模块">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="selectOptions.channelTypes"
                    v-model="coursePlanBaseInfo.channelType"
                    @change="channelTypeChange"
                    :disabled="isRelationClass"
                  ></gc-select>
                </el-form-item>
              </template>
              <template v-if="classTypeShowState">
                <el-form-item label="关键岗位" prop="keyJobs">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="keyPositionOptions"
                    v-model="coursePlanBaseInfo.keyJobs"
                    :disabled="isRelationClass"
                    @change="keyJobsChange"
                  ></gc-select>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="关键岗位">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="keyPositionOptions"
                    v-model="coursePlanBaseInfo.keyJobs"
                    :disabled="isRelationClass"
                    @change="keyJobsChange"
                  ></gc-select>
                </el-form-item>
              </template>
      <template v-if="classTypeShowState">
                <el-form-item
                  label="项目名称"
                  prop="className"
                >
                  <el-input
                    v-model="coursePlanBaseInfo.className"
                    :disabled="isRelationClass"
                  ></el-input>
                  <!-- <gc-select
                    k="className"
                    v="classId"
                    class="padding-0"
                    :options="classNameOptions"
                    v-model="coursePlanBaseInfo.className"
                    @change="classChange"
                    :disabled="isChange"
                  >
                  </gc-select> -->
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="项目名称" prop="className">
                  <el-input
                    v-model="coursePlanBaseInfo.className"
                    :disabled="isRelationClass"
                  ></el-input>
                </el-form-item>
              </template>
              <el-form-item label="培训系列" prop="trainSeries">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="selectOptions.trainSeries"
                  v-model="coursePlanBaseInfo.trainSeries"
                  @change="trainSeriesChange"
                  :disabled="isRelationClass"
                ></gc-select>
              </el-form-item>
              <el-form-item
                label="子系列"
                prop="childSeries"
              >
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
            :options="trainSeriesChildOptions"
                  v-model="coursePlanBaseInfo.childSeries"
                  :disabled="isRelationClass"
                ></gc-select>
              </el-form-item>
              <div class="one-liner">
                <el-form-item label="总期数" prop="termNum">
                  <el-input
                    :maxlength="5"
                    v-model="coursePlanBaseInfo.termNum"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
          <!-- 非零的 -->
          <div class="form-box" v-else>
            <div class="ls-form-wrapper">
              <el-form-item label="所属部门" class="org-item-style">
                <TopNodeInstitution :disabled="isRelationClass" v-model="coursePlanBaseInfo.topNodeOrgs" :busi-type="blgStripLine" :top-node="topNode" width="250px" ref="topNodeInstitutionRef"></TopNodeInstitution>
              </el-form-item>
              <el-form-item label="业务模块" prop="channelType">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="selectOptions.channelTypes"
                  v-model="coursePlanBaseInfo.channelType"
                  :disabled="isRelationClass"
                ></gc-select>
              </el-form-item>
              <el-form-item label="培训类型" prop="trainType">
                <gc-select
                  k="dataValue"
                  v="dataEncode"
                  class="padding-0"
                  :options="selectOptions.trainTypes"
                  v-model="coursePlanBaseInfo.trainType"
                  :disabled="isRelationClass"
                  @change="FLChnage"
                >
                </gc-select>
              </el-form-item>
              <el-form-item label="是否消保培训" prop="ifConformance">
                <gc-select
                  class="padding-0"
            :options="[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]"
                  v-model="coursePlanBaseInfo.ifConformance"
                  :disabled="isRelationClass"
                >
                </gc-select>
              </el-form-item>
              <template v-if="isFLrequired">
                <el-form-item label="培训系列" prop="trainSeries">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="selectOptions.trainSeries"
                    v-model="coursePlanBaseInfo.trainSeries"
                    @change="trainSeriesChange"
                    :disabled="isRelationClass"
                  ></gc-select>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="培训系列">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="selectOptions.trainSeries"
                    v-model="coursePlanBaseInfo.trainSeries"
                    @change="trainSeriesChange"
                    :disabled="isRelationClass"
                  ></gc-select>
                </el-form-item>
              </template>
              
              <!-- <template v-if="classTypeShowState && !isFLladderType"> -->
              <template v-if="isFLrequired">
                <el-form-item label="子系列" prop="childSeries">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="trainSeriesChildOptions"
                    v-model="coursePlanBaseInfo.childSeries"
                    :disabled="isRelationClass"
                    @change="FLChildSeriesChange"
                  ></gc-select>
                </el-form-item>
          </template>
              <template v-else>
                <el-form-item label="子系列">
                  <gc-select
                    k="dataValue"
                    v="dataEncode"
                    class="padding-0"
                    :options="trainSeriesChildOptions"
                    v-model="coursePlanBaseInfo.childSeries"
                    :disabled="isRelationClass"
                  ></gc-select>
                </el-form-item>
              </template>
              <el-form-item label="关键岗位">
                  <el-input
                  v-model="coursePlanBaseInfo.keyJobs"
                  :disabled="isRelationClass"
                  maxlength="50"
                  show-word-limit
                  class="input-limit-style"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="项目名称" prop="className">
                <el-input
                  v-model="coursePlanBaseInfo.className"
                  :disabled="isRelationClass"
                ></el-input>
              </el-form-item>
              <!-- 占位用 -->
              <el-form-item label="" class="block"></el-form-item>

              <div class="one-liner">
                <el-form-item label="总期数" prop="termNum">
                  <el-input
                    :maxlength="5"
                    v-model="coursePlanBaseInfo.termNum"
                  ></el-input>
                </el-form-item>
              </div> 
            </div>
          </div>
        </div>
     <!-- 非培训班的 -->
        <div class="form-box" v-else>
          <div class="ls-form-wrapper">
            <el-form-item label="所属部门" class="org-item-style">
              <TopNodeInstitution :disabled="isRelationClass" v-model="coursePlanBaseInfo.topNodeOrgs" :busi-type="blgStripLine" :top-node="topNode" width="250px" ref="topNodeInstitutionRef"></TopNodeInstitution>
            </el-form-item>
            <template v-if="blgStripLine === 'LS'">
              <el-form-item label="计划科目">
                <el-input value="常规预算" disabled></el-input>
              </el-form-item>
            </template>
            <el-form-item label="培训类型" prop="trainType">
              <gc-select
                k="dataValue"
                v="dataEncode"
                class="padding-0"
                :options="selectOptions.trainTypes"
                v-model="coursePlanBaseInfo.trainType"
                :disabled="isRelationClass"
              >
              </gc-select>
            </el-form-item>
            <el-form-item label="是否消保培训" prop="ifConformance">
              <gc-select
                class="padding-0"
                :options="[{label: '是', value: 'Y'}, {label: '否', value: 'N'}]"
                v-model="coursePlanBaseInfo.ifConformance"
                :disabled="isRelationClass"
              >
              </gc-select>
            </el-form-item>
            <el-form-item label="项目名称" prop="className">
              <el-input
                v-model="coursePlanBaseInfo.className"
                :disabled="isRelationClass"
              ></el-input>
            </el-form-item>
            <el-form-item label="总期数" prop="termNum">
              <el-input
                :maxlength="5"
                v-model="coursePlanBaseInfo.termNum"
              ></el-input>
            </el-form-item>
            <!-- 占位用 -->
            <template v-if="blgStripLine !== 'LS'">
              <el-form-item label="" class="block"></el-form-item>
            </template>
          </div>
      </div>

        <el-form-item label="备注" label-width="100px" class="mr10 area-style">
          <el-input
            type="textarea"
            resize="none"
            maxlength="200"
            show-word-limit
            v-model="coursePlanBaseInfo.remark"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="changeToInfoStatus">返回</el-button>
      <el-button class="button-w80-h30 button-blue" @click="handleReset">重置</el-button>
      <el-button class="button-w80-h30" type="primary" @click="handlePlanBtnClick">确定</el-button>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {
  myRound,
  CopyObj,
  dataHeaders,
  jsonHeaders,
  downloadFile,
  openFileInput,
  downloadAdapter
} from '../../../util/utils'
import CostInfoTable from '../../../components/chunk/CostInfoTable'
import AddApportionUnit from '../../../components/chunk/AddApportionUnit'
import { LADDER_TRAIN_TYPE, PROJECT_TRAIN_TYPE, COLLEGE_TRAIN_TYPE, NOT_TRAINING_COURSE_TYPE } from '../enum'
import { LINE_FL, LINE_JF } from '@/util/constants'
import TopNodeInstitution from '@/components/tree/TopNodeInstitution.vue'
export default {
  components: {
    CostInfoTable,
    AddApportionUnit,
    TopNodeInstitution
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    dept: String,
    classType: String,
    blgDeptName: String,
    blgStripLine: String,
    selectOptions: {
      type: Object,
      default: () => ({})
   },
    pageState: String,
    currentOrg: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 显示培训班 还是非培训班
      showTrainingCourse: true,
      // 新增培训班计划 基本信息表单
      coursePlanBaseInfo: {
        topNodeOrgs: [],
      },
      // 新增培训班计划 基本信息表单 规则验证对象
      coursePlanBaseInfoRules: {
        trainType: [
          {
            required: true,
            message: '请选择培训类型',
            trigger: 'change'
          }
        ],
        channelType: [
          {
            required: true,
            message: '请选择业务模块',
            trigger: 'change'
          }
        ],
        keyJobs: [
          {
            required: true,
            message: '请选择关键岗位',
            trigger: 'change'
          }
        ],
        className: [
          {
            required: true,
            message: '请填写项目名称',
            trigger: 'change'
          }
          // {
          //   validator: (rule, value, callback) => {
          //     if (!value) {
          //       if (this.blgStripLine === 'FL' || !this.classTypeShowState) {
          //         return callback(new Error('请填写项目名称'))
          //       }
          //       if(this.coursePlanBaseInfo.trainType === LADDER_TRAIN_TYPE) {
          //         return callback(new Error('请填写项目名称'))
          //       }
          //       return callback(new Error('请填写项目名称'))
          //     }
          //     return callback()
          //   },
          //   trigger: 'change'
          // }
        ],
   trainSeries: [
          {
            required: true,
            message: '请选择培训系列',
            trigger: 'change'
          }
        ],
        childSeries: [
          {
            required: true,
            message: '请选择培训子系列',
            trigger: 'change'
          }
        ],
        termNum: [
          {
            required: true,
            message: '请填写总期数',
            trigger: 'blur'
          },
          {
            validator(rule, value, callback) {
              if (value > 0 && value % 1 === 0) {
                return callback()
              }
              return callback(new Error())
            },
            trigger: 'blur',
            message: '总期数必须是大于零的整数'
          }
        ],
        dayNum: [
          {
            required: true,
            message: '请填写每期天数',
            trigger: 'blur'
          },
          {
            validator(rule, value, callback) {
              if (value > 0 && value % 0.5 === 0) {
                return callback()
              }
              return callback(new Error())
            },
            trigger: 'blur',
            message: '天数必须大于零并且是0.5的倍数'
          }
        ],
        studentNum: [
          {
            required: true,
            message: '请填写每期培训人数',
            trigger: 'change'
          },
          {
            validator(rule, value, callback) {
              if (value > 0 && value % 1 === 0) {
                return callback()
              }
              return callback(new Error())
            },
            trigger: 'blur',
            message: '每期培训人数必须是大于零的整数'
          }
        ],
        ifConformance: [
          {
            required: true,
            message: '请选择是否为消保培训',
           trigger: 'change'
          },
        ]
      },
      // 分摊单位表格 字段数组
      apportionUnitList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        },
        {
          label: '分摊单位',
          width: '430',
          prop: 'blgOrgName'
        }
      ],
      // 分摊单位表格 数据数组
      apportionUnitTableList: [],
      // 分摊单位 分页表单
      apportionUnitForm: {
        currPage: 1,
        pageSize: 10
      },
      // 分摊机构总计
      apportionTotal: 0,
      // 项目名称 下拉选项
      classNameOptions: [],
      // 点击长传文件input
      openFileInput,
      // 关键岗位下拉选项
      keyPositionOptions: [],
      // 培训子序列下拉选项
      trainSeriesChildOptions: [],
      // 添加 零售 非零 金服分摊单位 树组件数据
      treeData: [],
      // 零售， 非零， 金服机构树映射
      treeMaping: {
        LS: {
          busiType: 'LS',
          label: '零售'
        },
        FL: {
          busiType: 'FL',
          label: '非零'
        },
        JF: {
          busiType: 'JF',
          label: '金服'
        }
      },
      apportionUnitFileState: true,
      // 传递给费用信息组件的数据
      costInfoTableData: null
    }
  },
  methods: {
    // 转换为 本页适合的数据
    dataTransition(state) {
      let data
      if (state === 'add') {
        data = {}
      } else {
        data = this.data ? CopyObj(this.data) : {}
      }
    let keyJobs, childSeries, className
      if (data.planInfoVo) {
        keyJobs = data.planInfoVo.keyJobs
        childSeries = data.planInfoVo.childSeries
        className = data.planInfoVo.className
        data.planInfoVo.keyJobs = ''
        data.planInfoVo.childSeries = ''
        data.planInfoVo.className = ''
      }
      const planInfoVo = data.planInfoVo || {}
      Object.keys(planInfoVo).forEach((v) => {
        if (planInfoVo[v] === '-1') {
          planInfoVo[v] = ''
        }
      })
      this.coursePlanBaseInfo = planInfoVo
      this.$nextTick(() => {
        this.channelTypeChange()
        this.trainSeriesChange()
        if (keyJobs !== '-1') {
          this.$set(this.coursePlanBaseInfo, 'keyJobs', keyJobs)
        }
        if (childSeries !== '-1') {
          this.$set(this.coursePlanBaseInfo, 'childSeries', childSeries)
        }

        this.$set(this.coursePlanBaseInfo, 'className', className)
      })
      this.coursePlanBaseInfo.blgDeptName = this.blgDeptName
      this.costInfoTableData = data.planExpenseList || []
      this.apportionUnitTableList = data.planApportionList || []
      this.apportionTotal = data.apportionTotal || 0
      this.$nextTick(() => {
        this.$refs.coursePlanRef?.clearValidate()
      })
    },
    getClassNameOptions() {
      const channelType = this.coursePlanBaseInfo.channelType
      const keyJob = this.coursePlanBaseInfo.keyJobs
      if (this.blgStripLine !== 'JF') {
        if (!channelType || !keyJob) return
      } else if (this.classType === '01002') {
        return
      }
      const data = {
        line: this.blgStripLine,
        dept: this.dept,
        channelType,
        keyJob
      }
      this.$axios
        .post('/fn/plan/annual/listAssociatePlan', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.classNameOptions = data
   }
        })
    },
    // 新增计划 - 批量上传
    batchUploadChange($event) {
      const file = $event.target.files[0]
      const data = new FormData()
      data.append('line', this.blgStripLine)
      data.append('file', file)
      this.$axios
        .post('/planupload/apportionbranch', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === '0') {
            const { success, error } = data
            success.forEach((v) => (v.blgStripLine = this.blgStripLine))
            if (success.length > 0) {
              this.apportionUnitTableList.push(...success)
            }
            if ((error?.errorList?.length || 0) < 1) {
              return this.$message.success('导入成功')
            }
            let errorContent = ''
            error.errorList.forEach((v) => {
              errorContent += `<p>第${v.key}行. ${v.value}</p>`
            })
            this.$alert(`${error.title} ${errorContent}`, '提示', {
              confirmButtonText: '知道了',
              customClass: 'file-import-error',
              dangerouslyUseHTMLString: true
            })
          }
        })
        .finally(() => {
          this.apportionUnitFileState = false
          this.$nextTick(() => {
            this.apportionUnitFileState = true
          })
        })
    },
    // 模板下载
    templateDownload() {
      // 映射表
      let map = {
        LS: 'PLAN_LS_SHARE',
        FL: 'PLAN_FL_SHARE',
        JF: 'PLAN_JF_SHARE'
      }
      downloadAdapter({ templateCode: map[this.blgStripLine] })
      // window.location = `/tms-new/api/common/file/download/annualPlanShare?line=${this.blgStripLine}`;
    },
    // 业务模块 change 事件
    channelTypeChange() {
      this.$set(this.coursePlanBaseInfo, 'keyJobs', '')
      const data = this.selectOptions.channelTypes?.find(
        (v) => v.dataEncode === this.coursePlanBaseInfo.channelType
      )
      this.keyPositionOptions = data ? data.childPlanDict : []
    },
    // 培训系列 change 事件
    trainSeriesChange() {
  this.$set(this.coursePlanBaseInfo, 'childSeries', '')
      const data = this.selectOptions?.trainSeries?.find(
        (v) => v.dataEncode === this.coursePlanBaseInfo.trainSeries
      )
      this.trainSeriesChildOptions = data ? data.childPlanDict : []
    },
    // 关键岗位change 事件
    keyJobsChange(val) {
      const obj = this.keyPositionOptions.find((v) => v.dataEncode === val)
      this.coursePlanBaseInfo.keyJobsDesc = obj.dataValue
    },
    // 双击添加 一个分摊项
    addApportionUnit(data) {
      this.apportionUnitTableList.push(...data)
    },
    // 重置 当前页面数据
    reset() {
      if (this.pageState === 'add') {
        this.dataTransition('add')
      } else {
        this.dataTransition()
      }
    },
    // 将当前页面的数据转化为符合新增接口的数据
    collectionData() {
      return new Promise((resolve, reject) => {
        this.$refs.coursePlanRef.validate((valied) => {
          console.log(valied, '---');
          if (valied) {
            const plan = CopyObj(this.coursePlanBaseInfo)
            plan.planDept = plan.topNodeOrgs?.[1]
            Reflect.deleteProperty(plan, 'topNodeOrgs')
            Reflect.deleteProperty(plan, 'blgDeptName')
            // const expense = this.$refs.costInfoTable.getList()
            const expense = []
            const apportion = CopyObj(this.apportionUnitTableList)
            const data = { plan, expense, apportion }
            resolve(data)
          } else {
            reject()
          }
        })
      })
    },
    // 新增提交事件
    addSubmit() {
      this.collectionData()
        .then((data) => {
          this.$emit('submit', data, this.pageState)
        })
        .catch((err) => {
          console.error(err);
          this.$emit('valiedFailing')
        })
    },
   // 删除一项分摊
    delOneItem(index) {
      this.apportionUnitTableList.splice(index, 1)
    },
    // 验证 天数
    checkDay($event, row, key) {
      const value = $event.target.value
      const dayNum = parseFloat(this.coursePlanBaseInfo.dayNum)
      if (dayNum && value > dayNum) {
        this.$message.warning('天数不能大于每期天数')
        row[key] = ''
        $event.target.focus()
      }
    },
    // 项目名称变化事件
    classChange(classId) {
      const classObj = this.classNameOptions.find((v) => v.classId === classId)
      this.coursePlanBaseInfo.classId = classObj.classId
      this.coursePlanBaseInfo.className = classObj.className

      this.$set(
        this.coursePlanBaseInfo,
        'trainSeries',
        classObj.trainSeries === '-1' ? '' : classObj.trainSeries
      )
      this.trainSeriesChange()
      this.$nextTick(() => {
        this.$set(
          this.coursePlanBaseInfo,
          'childSeries',
          classObj.childSeries === '-1' ? '' : classObj.childSeries
        )
      })
    },
    // 非零的培训类型change事件
    FLChnage() {
      if (!this.classTypeShowState) {
        this.$refs.coursePlanRef.clearValidate('trainSeries')
        this.$set(this.coursePlanBaseInfo, 'keyJobs', '')
        this.$set(this.coursePlanBaseInfo, 'trainSeries', '')
        this.$set(this.coursePlanBaseInfo, 'childSeries', '')
      }
    },
    FLChildSeriesChange() {
      // 非零/金服条线不需要特殊处理关键岗位
      if (this.isFLrequired) return
      if (this.classTypeShowState) {
        const item = this.trainSeriesChildOptions.find(
          (v) => v.dataEncode === this.coursePlanBaseInfo.childSeries
        )
        this.keyPositionOptions = item.childPlanDict
        this.$set(
          this.coursePlanBaseInfo,
          'keyJobs',
          item?.childPlanDict[0]?.dataEncode || ''
        )
      }
    },
  changeToInfoStatus() {
      this.$store.dispatch('planManagement/changeAnnualEditComp', {status: 'info'})
    },
    handleReset() {
      this.reset()
    },
    handlePlanBtnClick() {
      this.addSubmit()
    }
  },
  watch: {
    data: {
      handler(n) {
        this.dataTransition()
      },
      immediate: true
    },
    pageState: {
      handler(n) {
        if (n === 'add') this.dataTransition('add')
      },
      immediate: true
    },
    classType: {
      handler(n) {
        if (n === '01002') {
          this.showTrainingCourse = false
        } else if (n === '01001') {
          this.showTrainingCourse = true
        }
      },
      immediate: true
    },
    blgDeptName(n) {
      this.coursePlanBaseInfo.blgDeptName = n
    },
    'coursePlanBaseInfo.channelType': {
      handler(n) {
        this.$nextTick(() => {
          if (this.pageState !== 'add' || this.blgStripLine !== 'JF') {
            this.getClassNameOptions()
          }
        })
      }
    },
    'coursePlanBaseInfo.keyJobs': {
      handler(n) {
        this.$nextTick(() => {
          if (this.pageState !== 'add' || this.blgStripLine !== 'JF') {
            this.getClassNameOptions()
          }
        })
      }
    },
    classTypeShowState: {
      handler(n, o) {
        this.$set(this.coursePlanBaseInfo, 'className', '')
        if (!n) {
          this.$refs?.coursePlanRef?.clearValidate([
            'channelType',
            'keyJobs',
            'childSeries'
          ])
       }
      },
      immediate: true
    },
  },
  computed: {
    classTypeShowState() {
      // 是非零，并且培训类型为阶梯培训的情况下
      // if()
      return (
        !this.coursePlanBaseInfo.trainType ||
        this.coursePlanBaseInfo.trainType === LADDER_TRAIN_TYPE
        // this.coursePlanBaseInfo.trainType === LADDER_TRAIN_TYPE ||
        // this.coursePlanBaseInfo.trainType === PROJECT_TRAIN_TYPE ||
        // this.coursePlanBaseInfo.trainType === COLLEGE_TRAIN_TYPE
      )
    },
    isChange() {
      return this.pageState === 'edit'
    },
    // 是否已关联了计划
    isRelationClass() {
      return this.coursePlanBaseInfo.relationClassFlag === 'Y'
    },
    treeObj() {
      const blgStripLine =
        this.blgStripLine || this.$store.state.userInfo.blgStripLine
      return this.treeMaping[blgStripLine] || {}
    },
    isFLladderType() {
      if(this.blgStripLine === LINE_FL || this.blgStripLine === LINE_JF) {
        return this.coursePlanBaseInfo.trainType === LADDER_TRAIN_TYPE
      }
      return false
    },
    // 是否为项目性培训
    isProjectTrainType() {
      return this.coursePlanBaseInfo.trainType === PROJECT_TRAIN_TYPE
    },
    // 是否为大学专班
    isCollegeTrainType() {
      return this.coursePlanBaseInfo.trainType === COLLEGE_TRAIN_TYPE
    },
    // 非零需求，统一修改为必选
    isFLrequired() {
      if(this.blgStripLine === LINE_FL || this.blgStripLine === LINE_JF) return true
      return this.classTypeShowState
      // return (this.classTypeShowState || this.isProjectTrainType || this.isCollegeTrainType)
    },
    topNode() {
      return Object.keys(this.currentOrg).length ? [this.currentOrg] : []
    }
  },
  created() {
    Object.keys(this.treeMaping).forEach((k) => {
      const v = this.treeMaping[k]
      v.loadNode = this[v.busiType + 'loadNode']
    })
   if(this?.data?.planInfoVo?.planDept || Object.keys(this.currentOrg).length) {
      // 如果详情数据里有机构部门，那以详情机构为优先
      this.coursePlanBaseInfo.topNodeOrgs = [this.blgStripLine, this?.data?.planInfoVo?.planDept || this.currentOrg.orgId]
    }
  },
  mounted() {
    if(this?.data?.planInfoVo?.planDeptName) {
      this.$nextTick(() => {
        this.$refs.topNodeInstitutionRef.setContentValue([this?.data?.planInfoVo?.planDeptName])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.check-card-wrapper {
  min-height: calc(100vh - 160px);
}
.ls-form-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-right: 10px;

  :deep(.el-form-item) {
    width: 30%;
    min-width: 350px;
  }

  :deep(.el-form-item__label) {
    width: 100px;
  }

  .one-liner {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    :deep(.el-form-item) {
      width: 30%;
    }
  }

  .hide {
    display: none !important;
  }
}

.area-style {
  :deep(.el-form-item__label) {
    width: 100px;
  }
  :deep(.el-form-item__content) {
    width: calc(90%);
  }
}

.org-item-style {
  :deep(.el-form-item__content) {
    line-height: unset !important;
  }
}

.input-limit-style {
  :deep(.el-input__inner){
    padding-right: 50px !important;
  }
}
</style>

<style lang="scss">
.check-plain {
  .form-card {
    input {
      height: 30px !important;
    }
    .form-box {
      display: flex;
      justify-content: space-between;

      .el-form-item {
        display: flex;
        align-items: center;
        // justify-content: flex-end;

        .el-input {
          width: 250px;
        }
      }
    }
    .el-textarea {
      textarea {
        height: 100px;
      }
    }
  }
  .cost-info-card {
    .total {
      background-color: #f9fafc;
      .cell {
        padding: 0;
        text-align: center;
      }
    }
    .input {
      .cell {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-input {
          margin-right: 10px;
        }
      }
    }
    .cost-info-table__col {
      span {
        margin: 0 8px;
      }
    }
    .el-table th::before {
      display: none;
    }
  }
  .apportion-unit {
    .icons {
      [class^='icons__'] {
        border-right: none;
      }
    }
    .menu-right > span {
      position: relative;
    }
  }
}
.apportion-unit {
  &__tree-box {
    box-shadow: 0 4px 10px 0 rgba($color: #424656, $alpha: 0.08);
    .tree-wrap {
      min-width: 200px;
      min-height: 210px;
      max-width: 400px;
      max-height: 320px;
      overflow: auto;

      .el-tree {
        min-width: 100%;
        display: inline-block;

        .is-current {
          > .el-tree-node__content {
            background-color: #fff !important;
            color: #fff;
            .el-tree-node__label {
              background-color: #fd6720;
            }
            .el-tree-node__expand-icon.is-leaf {
              color: transparent !important;
            }
          }
        }
        .el-tree-node__content {
          height: 30px;
          padding-right: 15px;
          .el-tree-node__label {
            height: 20px;
            padding: 0 10px;
            line-height: 21px;
            border-radius: 1px;
          }
        }
        .el-tree-node__expand-icon {
          padding-right: 0;
        }
      }
    }
  }
}
</style>
