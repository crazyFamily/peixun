<template>
  <div>
    <gc-model
      title="导入习题"
      width="800px"
      :visible.sync="importVisible"
      @comfirm="importExcel"
      @close="$emit('close')"
      @cancel="$emit('cancel')"
      custom-class="CourseRecommendation__PushPersonnel"
    >
      <el-form
        ref="pushInfoFormRef"
        :model="pushInfoForm"
        label-width="70px"
        class="item-mb30"
        @submit.native.prevent
      >
        <div key="1">
          <el-form-item label="上传文件" class="mb10">
            <div class="df">
              <gc-fileInput btn-text="选择文件" @change="fileChange" />
              <div
                class="b926 ml20"
                @click="templateDownload('/common/file/downloadExerciseModule')"
              >
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
            <div
              class="doc-box mt20"
              v-for="(file, i) in pushInfoForm.files"
              :key="file.lastModified"
            >
              <span>
                <i class="operation__doc mr10"></i>
                {{ file.name }}
                <i class="operation__close ml15" @click="delFile(i)"></i>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="题库" prop="orgId" v-if="showExerciseSelect">
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
  </div>
</template>

<script>
import { dataHeaders, templateDownload } from '@/util/utils'

export default {
  name: 'ImportExercisesDialog',
  props: {
    exerciseId: String,
    showDialog: {
      type: Boolean,
      default: () => false
    },
    showExerciseSelect: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    importVisible() {
      return this.showDialog
    }
  },
  data() {
    return {
      // importVisible: false,
      // 验证表单
      pushInfoForm: {
        ebPackageValue: '',
        files: [],
        importExerciseProjectId: ''
      }
    }
  },
  methods: {
    templateDownload,
    fileChange($event) {
      this.pushInfoForm.files = [$event.target.files[0]]
    },
    importExcel() {
      const data = new FormData()
      data.append('file', this.pushInfoForm.files[0])
      data.append(
        'exerciseProjectId',
        this.pushInfoForm.importExerciseProjectId || `${this.exerciseId}`
      )
      this.$axios
        .post('/common/file/importExerciseInfo', data, dataHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            console.log(625, code, data)
            this.$message.success('导入成功')
            // this.importVisible = false
            this.$emit('importSuccess')
          } else if (code === 4) {
            this.$confirm('导入习题失败，是否请查看失败明细？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              customClass: 'loginTimeout',
              cancelButtonClass: 'cancel',
              showCancelButton: true
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
      this.$axios
        .post(
          '/fn/privatewealth/exerciseproject/selectExerciseProjectListByPage',
          { data },
          jsonHeaders
        )
        .then((res) => {
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
    },
    handleSelect(item) {
      this.pushInfoForm.importExerciseProjectId = (item && item.id) || ''
    },
    delFile(i) {
      this.pushInfoForm.files.splice(i, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
