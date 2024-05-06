<template>
  <div class="trainer-management__new-trainer">
    <!-- 表单区域 -->
    <el-form
      class="content-form mt30"
      ref="queryFormRef"
      :model="queryForm"
      :rules="queryRules"
      label-width="100px"
    >
      <el-form-item label="培训师UM帐号/姓名" prop="umId">
        <el-autocomplete
          :disabled="state === 'edit'"
          class="w-full"
          value-key="empName"
          placeholder="请输入UM号/姓名"
          :trigger-on-focus="false"
          v-model="queryForm.empName"
          @select="handleUmSelect"
          :fetch-suggestions="trainerUmQuerySearch"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="评聘单位" prop="evaluateName">
        <el-input
          maxlength="30"
          show-word-limit
          placeholder="请输入评聘单位"
          v-model="queryForm.evaluateName"
        ></el-input>
      </el-form-item>
      <el-form-item label="培训师类型" prop="trainerType">
        <gc-select
          v-model="queryForm.trainerType"
          placeholder="请选择培训师类型"
          :options="trainerTypeOptions"
        >
        </gc-select>
      </el-form-item>
      <el-form-item label="授课领域一" prop="lecturesAreaFirst">
        <gc-select
          k="dataValue"
          v="dataEncode"
          v-model="queryForm.lecturesAreaFirst"
          placeholder="请选择授课领域"
          :options="lecturesAreaOptions"
          @change="lecturesAreaFirstChange"
        >
        </gc-select>
      </el-form-item>
      <el-form-item label="授课领域二">
        <gc-select
          k="dataValue"
          v="dataEncode"
          v-model="queryForm.lecturesAreaSec"
          placeholder="请选择授课领域"
          :options="filterLecturesAreaOptions"
        >
        </gc-select>
      </el-form-item>
      <el-form-item label="评聘年度" prop="evaluateYear">
        <gc-select
          class="p0"
          k="evaluateYearName"
          v="evaluateYearId"
          :options="evaluateYearOptions"
          v-model="queryForm.evaluateYear"
        >
        </gc-select>
      </el-form-item>
      <el-form-item label="说明">
        <el-input
          type="textarea"
          resize="none"
          class="h-90"
          maxlength="300"
          show-word-limit
          v-model="queryForm.remarks"
          placeholder="300字以内"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <div class="footer-box dfc">
      <el-button
        class="button-w80-h30"
        @click="closeCurrPageAndGoPath({ path: '/TrainerEvaluation' })"
        >返回</el-button
      >
      <el-button class="button-w80-h30" type="primary" @click="save"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  merge,
  CopyObj,
  resetObj,
  jsonHeaders,
  setPageTitle,
  closeCurrPage,
  closeCurrPageAndGoPath
} from '@/util/utils'
export default {
  name: 'NewTrainer',
  data() {
    return {
      // 工具函数
      closeCurrPage,
      closeCurrPageAndGoPath,
      // 表单
      queryForm: {
        id: '',
        umId: '',
        empName: '',
        evaluateName: '',
        trainerType: '',
        lecturesAreaFirst: '',
        lecturesAreaSec: '',
        evaluateYear: '',
        remarks: ''
      },
      // 验证规则
      queryRules: {
        umId: [
          {
            required: true,
            message: '请选择培训师'
          }
        ],
        evaluateName: [
          {
            required: true,
            message: '请输入评聘单位'
          }
        ],
        trainerType: [
          {
            required: true,
            message: '请选择培训师类型'
          }
        ],
        lecturesAreaFirst: [
          {
            required: true,
            message: '请选择授课领域一'
          }
        ],
        evaluateYear: [
          {
            required: true,
            message: '请选评聘年度'
          }
        ]
      },
      trainerTypeOptions: [
        {
          label: '菁英培训师(一级)',
          value: '03001001'
        },
        {
          label: '菁英培训师(二级)',
          value: '03001002'
        },
        {
          label: '菁英培训师(三级)',
          value: '03001003'
        },
        {
          label: '菁英培训师(四级)',
          value: '03001004'
        },
        {
          label: '菁英培训师(五级)',
          value: '03001005'
        }
      ],
      lecturesAreaOptions: [],
      evaluateYearOptions: [],
      // 页面状态
      state: '',
      stateMap: {
        add: '新增培训讲师',
        edit: '修改培训讲师'
      }
    }
  },
  methods: {
    // 培训师 远程搜索
    trainerUmQuerySearch(queryString, cb) {
      const data = { empName: queryString }
      this.$axios
        .post('/fn/user/listUserInfosContainLeaved', { data }, jsonHeaders)
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
    handleUmSelect(item) {
      this.queryForm.umId = item.umId
    },
    save() {
      this.$refs.queryFormRef.validate((valied) => {
        if (!valied) return
        const data = CopyObj(this.queryForm)
        this.$axios
          .post('/fn/trainer/eval/addOrUpdateTrainer', { data }, jsonHeaders)
          .then((res) => {
            const { code } = res.data
            if (code === 0) {
              this.$message.success(
                `${this.state === 'edit' ? '修改' : '新增'}成功`
              )
              closeCurrPageAndGoPath({
                path: '/TrainerEvaluation'
              })
            }
          })
      })
    },
    getLecturesAreaOptions() {
      this.$axios
        .post(
          '/fn/commons/dict/listDictsForSelector',
          {
            data: {
              dataCtgy: 'trainer_course_area'
            }
          },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.lecturesAreaOptions = data
          }
        })
    },
    getEvaluateYearOptions() {
      this.$axios
        .post('/fn/trainer/setting/listEvaluationYear', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.evaluateYearOptions = data
          }
        })
    },
    lecturesAreaFirstChange() {
      if (this.queryForm.lecturesAreaSec === this.queryForm.lecturesAreaFirst) {
        this.queryForm.lecturesAreaSec = ''
      }
    }
  },
  mounted() {
    this.getLecturesAreaOptions()
    this.getEvaluateYearOptions()
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      resetObj(this.queryForm)
      setPageTitle(this.stateMap[this.state])
      this.$wenEvent.$emit('getTiele')
    }
    if (params.umId) {
      params.evaluateYear = +params.evaluateYear
      merge(this.queryForm, params)
      this.lecturesAreaFirstChange()
    }
    if (!this.state) {
      closeCurrPageAndGoPath({ path: '/TrainerEvaluation' })
    }
  },
  computed: {
    filterLecturesAreaOptions() {
      return this.lecturesAreaOptions.filter(
        (v) => v.dataEncode !== this.queryForm.lecturesAreaFirst
      )
    }
  }
}
</script>

<style lang="scss">
.trainer-management__new-trainer {
  min-height: 100%;
  padding-top: 20px;
  background-color: #fff;
  .el-form {
    width: 670px;
    margin: auto;
  }
}
</style>