<template>
  <div>
    <div v-show="active === 1" class="full dfc bgf add-container">
      <el-scrollbar
        style="height: calc(100% - 70px); width: 100%; padding-bottom: 70px"
      >
        <div class="form-container">
          <el-form
            ref="addForm"
            :model="formData"
            :rules="formRules"
            label-width="100px"
          >
            <el-form-item
              label="培训师UM帐号"
              class="ws dr-label"
              prop="trainersUm"
            >
              <!-- <el-input v-model="formData.umId"></el-input> -->
              <el-select
                :disabled="isEditStatus"
                class="w-full"
                remote
                value-key="umId"
                placeholder="请输入UM号"
                v-model="empInfo"
                :remote-method="trainerUmQuerySearch"
                filterable
                reserve-keyword
                @input="trainerUmSelectHandle"
              >
                <el-option
                  v-for="item in trainerUms"
                  :key="item.umId"
                  :label="item.labelName"
                  :value="item.umId"
                >
                </el-option>
              </el-select>
              <!-- <el-autocomplete
              class="w-full"
              value-key="empName"
              placeholder="请输入UM号/姓名"
              :trigger-on-focus="false"
              v-model="empInfo"
              :fetch-suggestions="trainerUmQuerySearch"
            ></el-autocomplete> -->
              <!-- <el-autocomplete
                :disabled="isEditStatus"
                class="w-full"
                value-key="empId"
                placeholder="请输入UM号"
                :trigger-on-focus="false"
                v-model="formData.empId"
                @select="trainerUmSelectHandle"
                :fetch-suggestions="trainerUmQuerySearch"
            ></el-autocomplete> -->
            </el-form-item>
            <el-form-item label="培训师姓名" class="ws dr-label" prop="empName">
              <el-input v-model="formData.empName" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="授课类型"
              class="ws dr-label"
              prop="trainingType"
            >
              <gc-select
                class="p0"
                :options="trainerTypes"
                v-model="formData.trainingType"
                @change="clearData"
              >
              </gc-select>
            </el-form-item>
            <el-form-item
              label="收入/支出"
              class="ws dr-label w-120"
              prop="pointsIncome"
            >
              <gc-select
                class="p0"
                :options="pointsIncomes"
                v-model="formData.pointsIncome"
              >
              </gc-select>
            </el-form-item>
            <el-form-item
              label="积分原因"
              class="ws dr-label w-494"
              prop="remark"
            >
              <el-input
                v-model="formData.remark"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item
              label="积分值"
              class="ws dr-label w-120"
              prop="totalPoints"
            >
              <el-input
                v-model="formData.totalPoints"
                @blur="handlePoints"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="积分日期"
              class="ws dr-label"
              prop="pointsDate"
            >
              <el-date-picker
                class="w-120"
                v-model="formData.pointsDate"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="评聘年度" prop="evaluateYearId">
              <gc-select
                class="p0 w-120"
                K="evaluateYearId"
                v="evaluateYearId"
                :options="yearIds"
                v-model="formData.evaluateYearId"
              >
              </gc-select>
            </el-form-item>
            <el-form-item label="授课ID" class="ws dr-label" prop="courseId">
              <el-input v-model="formData.courseId">
                <i
                  slot="suffix"
                  @click="queryCourse"
                  class="page-input__search"
                ></i>
              </el-input>
            </el-form-item>
            <el-form-item
              label="授课名称"
              class="ws dr-label"
              prop="courseName"
            >
              <el-input v-model="formData.courseName" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="授课开始时间"
              class="ws dr-label"
              prop="startTime"
            >
              <el-input v-model="formData.startTime" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="授课结束时间"
              class="ws dr-label"
              prop="endTime"
            >
              <el-input v-model="formData.endTime" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="授课时长"
              class="ws dr-label"
              prop="totalDuration"
            >
              <el-input v-model="formData.totalDuration" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="课程上架日期"
              class="ws dr-label"
              prop="createdDate"
            >
              <el-input v-model="formData.microsUploadTime" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="记账时间"
              class="ws dr-label"
              prop="accountDate"
            >
              <el-date-picker
                class="w-200"
                v-model="formData.accountDate"
                type="datetime"
                placeholder="选择日期"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="dfcc new-app-footer">
        <el-button class="button-w80-h30" @click="closePageHandle()"
          >取消</el-button
        >
        <el-button class="button-w80-h30" type="primary" @click="nextStep"
          >下一步</el-button
        >
      </div>
    </div>
    <div v-show="active === 2" class="full dfc bgf add-container pb70">
      <div class="form-container-next">
        <el-form
          ref="nextAddForm"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="请示事项" prop="taskTitle">
            <el-input
              v-model="formData.taskTitle"
              placeholder="【培训师管理平台】有关补录XX等多人积分的事宜请示"
            ></el-input>
          </el-form-item>
          <el-form-item label="请示内容" prop="taskDesc">
            <el-input
              class="h-90"
              type="textarea"
              placeholder="请输入具体内容，字数控制在500字以内"
              resize="none"
              maxlength="500"
              show-word-limit
              v-model="formData.taskDesc"
            ></el-input>
          </el-form-item>
          <el-form-item label="审批链" style="width: calc(100% + 240px)">
            <approval-chain
              :value="approvalChainValue"
              chainType="5"
              @confirm="approvalChainConfirm"
            ></approval-chain>
          </el-form-item>
          <el-form-item label="附件内容">
            <a
              class="active"
              :href="nextFormData.fileUrl"
              :download="nextFormData.fileName"
            >
              {{ nextFormData.fileName }}
            </a>
          </el-form-item>
        </el-form>
        <div class="dfcc new-app-footer">
          <el-button class="button-w80-h30" type="primary" @click="saveHandle"
            >发起审批</el-button
          >
          <el-button class="button-w80-h30" @click="active = 1">返回</el-button>
        </div>
      </div>
    </div>

    <!-- 评聘年度 dialog -->
    <!-- <gc-model
      title="选择评聘年度"
      width="600px"
      :visible.sync="selectYearVisible"
      @comfirm="selectYearConfirm"
    >
      <gc-table
        no-list
        :tableList="yearTableList"
        ref="yearTableRef"
        class="general__table table-radio"
        @selection-change="tableSelectionChange($refs, $event, 'yearTableRef')"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column
          label="评聘年度"
          prop="evaluateYearId"
        ></el-table-column>
      </gc-table>
    </gc-model> -->

    <!-- 授课信息 dialog -->
    <gc-model
      title="选择课程"
      width="1000px"
      :visible.sync="selectCourseVisible"
      @comfirm="selectCourseConfirm"
    >
      <gc-table
        :list="courseList"
        :tableList="courseTableList"
        ref="courseTableRef"
        class="general__table table-radio"
        @selection-change="
          tableSelectionChange($refs, $event, 'courseTableRef')
        "
      >
      </gc-table>
    </gc-model>
  </div>
</template>

<script>
import {
  merge,
  closeCurrPage,
  addAllowKeepAlive,
  CopyObj,
  myFloat,
  tableSelectionChange
} from '@/util/utils'
import ApprovalChain from '@/components/ApprovalChain'
import { fetchUserInfos } from '@/fetch/public'
import {
  fetchAddTrainersPoints,
  fetchYearList,
  fetchTrainingCourseInfo,
  fetchPointsFileInfo
} from '@/fetch/pointManagement'
export default {
  name: 'AddPointRecord',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      active: 1,
      empInfo: '',
      formData: {
        trainersUm: '',
        empName: '',
        trainingType: '',
        pointsIncome: '',
        remark: '',
        totalPoints: '',
        pointsDate: '',
        courseId: '',
        courseName: '',
        startTime: '',
        endTime: '',
        accountDate: '',
        totalDuration: '',
        evaluateYearId: '',
        taskTitle: '',
        taskDesc: '',
        trainingId: '',
        microsUploadTime: ''
      },
      formRules: {
        trainersUm: [requiredHandle('请输入培训师UM')],
        trainingType: [requiredHandle('请选择课程类型')],
        pointsIncome: [requiredHandle('请选择收入/支出')],
        remark: [requiredHandle('请输入积分原因')],
        totalPoints: [requiredHandle('请输入积分值')],
        pointsDate: [requiredHandle('请输入积分日期')],
        courseId: [requiredHandle('请输入授课ID')],
        accountDate: [requiredHandle('请输入记账时间')],
        evaluateYearId: [requiredHandle('请选择评聘年度', 'change')],
        taskTitle: [requiredHandle('请填写请示事项')],
        taskDesc: [requiredHandle('请填写请示内容')]
      },
      trainerTypes: [
        { label: '面授', value: '1' },
        { label: '直播', value: '2' },
        { label: '微课', value: '3' },
        { label: '其它', value: '4' }
      ],
      pointsIncomes: [
        { label: '收入', value: '1' },
        { label: '支出', value: '2' }
      ],
      // 回显审批链数据
      approvalChainValue: '',
      isEditStatus: false,
      trainerUms: [],
      // 选择评聘年度dialog状态
      selectYearVisible: false,
      tableSelectionChange,
      yearTableList: [],
      // 选择课程dialog状态
      selectCourseVisible: false,
      courseTableList: [],
      courseList: [
        { type: 'selection' },
        { type: 'index', label: '序号' },
        { label: '授课Id', prop: 'courseId' },
        { label: '授课名称', prop: 'courseName' },
        { label: '授课开始时间', prop: 'startTime' },
        { label: '授课结束时间', prop: 'endTime' },
        { label: '授课时长（分钟）', prop: 'totalDuration' }
      ],
      yearIds: [],
      fetchPointsFileInfo,
      nextFormData: {},
      flag: false
    }
  },

  components: {
    ApprovalChain
  },

  computed: {},

  mounted() {
    // this.$route.params.umId && this._getDetailData(this.$route.params);
  },

  methods: {
    _formatParams(params) {
      let data = CopyObj(params)
      if (data.trainerType !== '4') {
        Reflect.deleteProperty(data, 'pointsDate')
      }
      return data
    },
    _getDetailData(data) {
      this.formData = CopyObj(data)
    },
    closePageHandle() {
      closeCurrPage()
      // 跳回到资讯页面
      addAllowKeepAlive('/PointRecord')
      this.$router.push({ name: '积分补录' })
    },
    saveHandle() {
      return this.$refs.nextAddForm.validate(async (v) => {
        if (!v) return false
        if (!this.formData.auditUsersUm) {
          return this.$message.warning('请配置审批链')
        }
        if (this.flag) return
        let data = this.formData
        try {
          this.flag = true
          await fetchAddTrainersPoints({ data })
          this.$message.success('新增成功')
          this.closePageHandle()
        } finally {
          this.flag = false
        }
      })
    },
    // 是否显示自动审批链
    autoApproval() {
      return false
    },
    // 获取 请求审批链需要的数据
    genLixiangCondition() {
      console.log('object')
      // const lecturerList = CopyObj(this.lecturerList);
      // lecturerList.forEach((v) => {
      //   this.timetableListData.forEach((n) => {
      //     if (n.teacherNo === v.teacherId) {
      //       if (!v.lectureHours) {
      //         v.lectureHours = 0;
      //       }
      //       const endMinute = this.getMinute(n.endTime);
      //       const startMinute = this.getMinute(n.startTime);
      //       v.lectureHours += endMinute - startMinute;
      //     }
      //   });
      //   v.lectureHours = myRound(v.lectureHours / 60, 2);
      //   v.lecturerFee = v.expense;
      // });
      // const budgetDivideList = this.apportionConstTableList.map(
      //   (v) => v.divideOrgId
      // );
      // const totalFee = this.$refs.costInfoTable?.getTotal() || "0";
      // const expenseDetailList = this.$refs.costInfoTable?.getList();
      // const courseDevelopFee = expenseDetailList
      //   ? (expenseDetailList.find((v) => v.childDesc === "外部课程研发费用")
      //       ?.expense || "0") + ""
      //   : "0";
      // this.lixiangCondition = {
      //   lecturerList,
      //   budgetDivideList,
      //   totalFee,
      //   courseDevelopFee,
      // };
    },
    // 打开自动审批链 时做一些事情
    openApproval() {
      // const hints = this.portionApportionConstTableList
      //   .filter((v) => !v.divideOrgId.trim())
      //   .map((v) => v.divideOrgName)
      //   .join("、");
      // if (hints) {
      //   hintFrame(`机构${hints}不合法`);
      // }
    },
    // 选择审批链确认事件
    approvalChainConfirm(data) {
      // this.approvalChainValue = data.auditUsersUm
      this._.merge(this.formData, data)
    },
    umIdSelectHandle() {},
    // async trainerUmQuerySearch(queryString){
    //   if (!queryString) {
    //     this.trainerUms = []
    //     return
    //   }
    //   const data = { empName: queryString, pageSize: '20' };
    //   let res = await fetchUserInfos({ data })
    //   this.trainerUms = res.list
    // },
    // 栏目负责人 远程搜索
    async trainerUmQuerySearch(queryString, cb) {
      if (!queryString) {
        this.trainerUms = []
        return
      }
      const data = { empName: queryString, pageSize: '20' }
      let res = await fetchUserInfos({ data })
      this.trainerUms = res.list.map((item) => {
        return {
          ...item,
          labelName: `${item.empName}(${item.umId})`
        }
      })
      // cb(this.trainerUms)
    },
    trainerUmSelectHandle(value) {
      if (!value) return
      const um = this.trainerUms.find((item) => item.umId === value)?.umId
      this.formData.empName = this.trainerUms.find(
        (item) => item.umId === value
      )?.empName
      if (this.formData.trainersUm !== um) {
        this.formData.trainersUm = um
        this.clearData()
      }
    },
    // 查询评聘年度
    async queryYear() {
      this.yearIds = (await fetchYearList()) || []
    },
    // selectYearConfirm() {
    //   const selection = this.$refs.yearTableRef.getSelection()
    //   if (selection?.length) {
    //     this.formData.evaluateYearId = selection[0].evaluateYearId
    //   }
    //   this.selectYearVisible = false
    // },
    async queryCourse() {
      const data = {
        trainersUm: this.formData.trainersUm,
        trainingType: this.formData.trainingType,
        evaluateYearId: this.formData.evaluateYearId,
        courseId: this.formData.courseId
      }
      let courses
      try {
        courses = await fetchTrainingCourseInfo({ data })
      } catch {}
      if (!courses) return
      if (courses?.length === 1) {
        const item = courses[0]
        merge(this.formData, item)
      } else if (courses?.length > 1) {
        this.courseTableList = courses
        this.selectCourseVisible = true
      } else {
        this.$message.warning('没有该课程信息')
      }
    },
    selectCourseConfirm() {
      const selection = this.$refs.courseTableRef.getSelection()
      if (selection?.length) {
        merge(this.formData, selection[0])
      }
      this.selectCourseVisible = false
    },
    nextStep() {
      this.$refs.addForm.validate((valied) => {
        if (!valied) return this.$message.warning('请完善基本信息')
        fetchPointsFileInfo({ data: this.formData }).then((data) => {
          this.nextFormData = data
          this.approvalChainValue = data.auditUsers
          this.formData.udmpId = data.udmpId
          this.active = 2
        })
      })
    },
    clearData() {
      this.formData.courseId = ''
      this.formData.courseName = ''
      this.formData.startTime = ''
      this.formData.endTime = ''
      this.formData.totalDuration = ''
      this.formData.microsUploadTime = ''
    },
    handlePoints() {
      if (this.formData.totalPoints === '') return
      this.formData.totalPoints = myFloat(this.formData.totalPoints)
      if (this.formData.totalPoints > 10000) {
        this.formData.totalPoints = 10000
      } else if (this.formData.totalPoints < -10000) {
        this.formData.totalPoints = -10000
      }
    }
  },

  activated() {
    this.queryYear()
    this.isEditStatus = Boolean(this.$route.params.umId)
    if (this.isEditStatus) {
      this._getDetailData(this.$route.params)
    }
  }
}
</script>
<style lang="scss" scoped>
.add-container {
  min-height: 100%;
  flex-wrap: wrap;
  position: relative;
  padding: 20px;
}
.form-container {
  width: 300px;
  margin: 0 auto;
  .el-form {
    position: relative;
    left: -100px;
  }
}
.form-container-next {
  widows: 60%;
  margin: 0 auto;
}

.new-app-footer {
  width: 100%;
  height: 70px;
  position: absolute;
  left: 0;
  bottom: 0;
  box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.05);
}
</style>