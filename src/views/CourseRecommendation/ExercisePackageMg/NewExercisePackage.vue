<template>
  <div class="course-recommendation__new-project">
    <div class="gc-main">
      <gcSteps :active="active" :list="stepList"></gcSteps>
      <!-- 内容区域 -->
      <div class="content-box">
        <div class="project-info" v-show="active === BASE_INFO">
          <el-form
            :model="projectForm"
            :rules="projectRules"
            label-width="70px"
            class="item-mb30"
            ref="projectFormRef"
          >
            <el-form-item
              prop="exerciseProjectName"
              class="ws dr-label"
              label="习题包名称"
            >
              <el-input
                maxlength="20"
                show-word-limit
                :readonly="isEdit"
                :disabled="isEdit"
                placeholder="限制20字"
                v-model="projectForm.exerciseProjectName"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="习题包属主部门"
              class="ws dr-label"
              prop="orgId"
            >
              <gc-select
                w1
                class="p0"
                k="orgName"
                v="orgId"
                :readonly="isEdit"
                :disabled="isEdit"
                :options="orgOptions"
                v-model="projectForm.orgId"
              ></gc-select>
            </el-form-item>
            <el-form-item
              label="习题包负责人"
              class="ws dr-label"
              prop="person"
            >
              <el-autocomplete
                class="w-full"
                value-key="personCom"
                placeholder="请输入UM号"
                :trigger-on-focus="false"
                @select="handleLeaderUmSelect"
                v-model.trim="projectForm.person"
                :fetch-suggestions="leaderUmQuerySearch"
                :readonly="isEdit"
                :disabled="isEdit"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item
              label="习题包描述"
              class="ws dr-label"
              prop="description"
            >
              <el-input
                type="textarea"
                resize="none"
                class="h-90"
                maxlength="100"
                show-word-limit
                v-model.trim="projectForm.description"
                :readonly="isEdit"
                :disabled="isEdit"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="subject-form">
          <CRExercisePackageDetail
            v-show="active === SUBJECT_IMPORT"
            :exerciseId="exerciseId"
            :source="ExPackage"
          />
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="footer-box dfc">
        <el-button class="button-w80-h30" @click="cancel">取消</el-button>
        <el-button
          v-if="active === SUBJECT_IMPORT"
          class="button-w80-h30"
          @click="active -= 1"
          >上一步</el-button
        >
        <el-button
          v-if="active === BASE_INFO"
          class="button-w80-h30"
          @click="active += 1"
          >下一步</el-button
        >
        <el-button
          type="primary"
          v-if="!isEdit"
          class="button-w80-h30"
          @click="submit"
          >保存提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  resetObj,
  throttle,
  jsonHeaders,
  setPageTitle,
  closeCurrPage,
  closeCurrPageAndGoPath,
  addAllowKeepAlive
} from '@/util/utils'
import gcSteps from './../../CourseRecommendation/components/gc-steps.vue'
import CRExercisePackageDetail, { SOURCE } from './ExercisePackageDetail.vue'
import { getOrg } from '../utils'
import {
  preSaveExerciseProject,
  deleteExerciseProjectById
} from '@/fetch/courseRecommendation'
const BASE_INFO = 0
const SUBJECT_IMPORT = 1
export default {
  name: 'CRNewExercisePackage',
  components: { gcSteps, CRExercisePackageDetail },
  data() {
    return {
      ExPackage: SOURCE.ExPackage,
      BASE_INFO,
      SUBJECT_IMPORT,
      active: BASE_INFO,
      stepList: ['基本信息', '题目导入'],
      // 项目信息 form
      projectForm: {
        exerciseProjectName: '',
        orgId: '',
        person: '',
        responsibleUmId: '',
        responsibleUmName: '',
        description: ''
      },
      isEdit: false,
      // 项目信息 form 验证规则
      projectRules: {
        exerciseProjectName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入习题包名称'
          }
        ],
        orgId: [{ required: true, message: '请选择习题包属主部门' }],
        person: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入习题包负责人'
          }
        ]
      },
      // 部门下拉选项
      orgOptions: [],
      exerciseId: null,
      operateType: 'add'
    }
  },
  methods: {
    // 项目负责人远程搜索
    leaderUmQuerySearch(queryString, cb) {
      const data = { empName: queryString, busiType: 'LS' }
      this.$axios
        .post('/fn/user/listUserInfos', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            data.list.forEach((v) => {
              v.personCom = `${v.empName}(${v.umId})`
            })
            cb(data.list)
          }
        })
    },
    handleLeaderUmSelect(p) {
      console.log(888, p)
      this.projectForm.responsibleUmId = p.umId
      this.projectForm.responsibleUmName = p.empName
    },
    handleCourseList() {
      for (let i = 0; i < 3; i++) {
        this.courseList.push({
          name: '课程名称' + i,
          i
        })
      }
    },
    // 验证项目数据
    validateProjectData() {
      console.log(11)
      const errors = []
      this.$refs.projectFormRef.validate((valied) => {
        console.log(546, valied)
        errors[0] = valied ? 0 : '习题包信息验证错误，请补充完整'
      })

      return new Promise((resolve, reject) => {
        this.$nextTick(() => resolve(errors.find((v) => v)))
      })
    },
    addExamine() {
      return new Promise((resolve, reject) => {
        const { state } = this.$route.params
        if (state === 'add') {
          this.$confirm('是否需要马上新建考卷?', '提示', {
            confirmButtonText: '需要',
            showCancelButton: true,
            cancelButtonText: '暂时不需要',
            cancelButtonClass: 'cancel',
            customClass: `loginTimeout`
          })
            .then(() => {
              resolve(true)
            })
            .catch(() => {
              resolve(false)
            })
        } else {
          resolve(false)
        }
      })
    },
    // 提交
    submit() {
      console.log(1)
      console.log(186, this.projectForm)
      this.validateProjectData().then(async (res) => {
        if (res) {
          return this.$message.warning(res)
        }

        const AddExamine = await this.addExamine()
        let {
          description,
          exerciseProjectName,
          orgId,
          responsibleUmId,
          responsibleUmName
        } = this.projectForm
        let data = {
          exerciseProjectName,
          orgId,
          description,
          responsibleUmId,
          responsibleUmName
        }
        let _api = '/fn/privatewealth/exerciseproject/addExerciseProject'
        if (['edit', 'preAdd'].includes(this.operateType)) {
          data.id = this.exerciseId
          _api = '/fn/privatewealth/exerciseproject/updateExerciseProject'
        }
        console.log(190, data)
        return this.$axios.post(_api, { data }, jsonHeaders).then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('提交成功')
            if (AddExamine) {
              closeCurrPageAndGoPath({
                path: '/CRExaminationAdd'
              })
            } else {
              closeCurrPageAndGoPath({
                path: '/CRExercisePackageMg'
              })
            }
          }
        })
      })
    },
    // 取消
    cancel() {
      if (this.operateType === 'add') {
        // 删除预创建
        deleteExerciseProjectById({ id: this.exerciseId }).then((result) => {
          // 回退到列表
        })
      }
      closeCurrPage()
    },
    // 重置所有表单
    resetFormData() {
      this.$refs.projectFormRef.resetFields()
    },
    createNewExercisePackages() {
      preSaveExerciseProject()
        .then((exerciseId) => {
          this.exerciseId = exerciseId
          this.operateType = 'preAdd'
        })
        .catch((e) => {
          this.$message.error('创建习题服务异常，请重试')
        })
    }
  },
  mounted() {
    console.log(this.$route.params, '-------')
    getOrg().then((res) => {
      this.orgOptions = res
    })
    const { state } = this.$route.params
    state === 'add' && this.createNewExercisePackages()
  },
  activated() {
    console.log(238, this.$route.params)
    this.isChange = false
    const { state, id } = this.$route.params
    this.operateType = state
    if (state == 'edit' || state == 'preview') {
      this.exerciseId = id
      const data = {
        id: id
      }
      this.$axios
        .post(
          '/fn/privatewealth/exerciseproject/selectExerciseProjectById',
          data,
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            console.log(196, data)
            this.projectForm = {
              exerciseProjectName: data.exerciseProjectName,
              orgId: data.orgId,
              person: `${data.responsibleUmName}(${data.responsibleUmId})`,
              responsibleUmId: data.responsibleUmId,
              responsibleUmName: data.responsibleUmName,
              description: data.description
            }
          }
        })
      this.isEdit = state == 'preview' ? true : false
      setPageTitle('习题包详情')
      this.$wenEvent.$emit('getTiele')
    } else {
      setPageTitle('新增习题包')
      this.isEdit = false
      this.$wenEvent.$emit('getTiele')
      this.resetFormData()
    }
  },
  created() {
    this.submit = throttle(this.submit)
  },
  computed: {}
}
</script>

<style lang="scss">
.course-recommendation__new-project {
  .gc-main {
    padding-top: 40px;
    background-color: #fff;
    .content-box {
      margin: 40px 0;
      .project-info {
        .el-form {
          width: 670px;
          margin: auto;
        }
      }
      // .course-info {
      //     padding: 0 20px;
      // }
      // .examination {
      //     width: 1000px;
      //     margin: auto;
      // }
      // .push-info {
      //     width: 670px;
      //     margin: auto;
      //     .course-schedule-box {
      //         .course-schedule-card {
      //             margin-top: 20px;
      //             padding: 20px;
      //             background: rgba($color: #d8d8d8, $alpha: 0.1);
      //             border-radius: 4px;
      //             .course-list {
      //                 position: relative;
      //                 margin-top: 20px;
      //                 height: 44px;
      //                 .course {
      //                     position: absolute;
      //                     display: flex;
      //                     width: 200px;
      //                     height: 44px;
      //                     top: 0;
      //                     padding: 0 12px 0 8px;
      //                     background-color: #fff;
      //                     border-radius: 4px;
      //                     align-items: center;
      //                     box-shadow: 0 2px 10px 0
      //                         rgba($color: #000000, $alpha: 0.1);
      //                     .icon {
      //                         display: flex;
      //                         width: 28px;
      //                         height: 28px;
      //                         margin-right: 6px;
      //                         border-radius: 50%;
      //                         background: rgba(
      //                             $color: #d8d8d8,
      //                             $alpha: 0.29
      //                         );
      //                         flex-shrink: 0;
      //                         justify-content: center;
      //                         align-items: center;
      //                         pointer-events: none;
      //                         i {
      //                             pointer-events: none;
      //                         }
      //                     }
      //                     .course-name {
      //                         flex: 1;
      //                         user-select: none;
      //                         pointer-events: none;
      //                     }
      //                 }
      //             }
      //         }
      //     }
      // }
    }
  }
}
</style>
<style lang="scss" scoped>
// .pdl10 {
//     padding-left: 10px;
// }

.theme-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.theme-info-list {
  :deep(.gc-table.general__table) {
    margin-top: 0 !important;
  }
}

.set-time-box {
  padding-left: 0;
}
.subject-form {
  padding: 20px 10%;
  :deep(.search-card .el-form .el-form-item) {
    margin-right: 30px;
  }
}
</style>
