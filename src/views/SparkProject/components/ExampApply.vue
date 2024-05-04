<template>
  <gc-model
    title="豁免/延期申请"
    :visible="isDialogShow"
    :show-close="false"
    @cancel="closeHandle"
    @comfirm="comfirmHandle"
    top="5vh"
    width="90%"
  >
    <div class="apply-form-wrapper">
      <el-form
        :model="instructorInfo"
        :rules="instructorInfoRules"
        label-width="70px"
        @submit.native.prevent
        ref="instructorInfoFormRef"
        :disabled="disabled"
      >
        <el-form-item label="申请类型" prop="applyType">
          <gc-select
            class="padding-0"
            :options="applyTypeOption"
            v-model="instructorInfo.applyType"
            @change="instructorCateChange"
            :clearable="false"
          ></gc-select>
        </el-form-item>
        <el-form-item
          label="延期至"
          class="mr10"
          prop="applyTime"
          :rules="[
            {
              required: instructorInfo.applyType === '1',
              message: '请选择延期时间'
            }
          ]"
          v-show="instructorInfo.applyType === '1'"
        >
          <el-date-picker
            v-model="instructorInfo.applyTime"
            type="date"
            placeholder="选择日期"
            :clearable="false"
            :picker-options="applyTimeOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="豁免原因"
          class="mr10"
          prop="remitReason"
          :rules="[
            {
              required: instructorInfo.applyType === '0',
              message: '请选择豁免原因'
            }
          ]"
          v-show="instructorInfo.applyType === '0'"
        >
          <gc-select
            class="padding-0 exemp-style"
            :options="remitReasonOptions"
            v-model="instructorInfo.remitReason"
            :clearable="false"
          ></gc-select>
        </el-form-item>
        <!-- <el-form-item
          label="其他原因"
          :rules="[
            {
              required: instructorInfo.remitReason === '2',
              message: '请输入原因'
            }
          ]"
          v-show="instructorInfo.remitReason === '2'"
        >
          <el-input
            type="textarea"
            show-word-limit
            resize="none"
            placeholder="请输入原因"
            v-model="instructorInfo.applyReason"
            maxlength="200"
            :rows="5"
          ></el-input>
        </el-form-item> -->
        <el-form-item
          label="申请原因"
          :rules="[
            {
              required: true,
              message: '请输入申请原因'
            }
          ]"
          prop="applyReason"
        >
          <el-input
            type="textarea"
            show-word-limit
            resize="none"
            placeholder="申请孵化豁免的条件是至少曾有一年以上某银行网点相关工作或学习经验，不符合豁免条件的需申请豁免的，请先线下与HR沟通后提交。"
            v-model="instructorInfo.applyReason"
            maxlength="200"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-button type="primary" @click="openUploadEnclourse">
            添加附件
          </el-button>
          <div class="file-container">
            <div
              class="file-content"
              v-for="(item, index) in uploadedFiles"
              :key="index"
            >
              <el-tag
                class="tag upload-files-style"
                :closable="!disabled"
                @close="uploadedFiles.splice(index, 1)"
              >
                <img src="~@/assets/svg/doc.svg" alt="" />
                <a
                  :href="item.udmpId ? handleUdmpHref(item.udmpId) : item.fileUrl"
                  download
                  class="active download-style"
                  >{{ item.fileName }}</a
                >
              </el-tag>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="审批流程" v-if="disabled">
          <el-input :value="instructorInfo.auditUsersUm" disabled></el-input>
        </el-form-item>
        <el-form-item label="审批流程" v-if="!disabled">
          <ExamApprovalPerson
            ref="examApprovalPersonRef"
            :fetch-params="examApprovalParams"
          ></ExamApprovalPerson>
        </el-form-item>
      </el-form>
      <!-- 上传附件 -->
      <AddEnclourse
        ref="addEnclourse"
        append-to-body
        @confirm="addEnclourseComfirm"
        is-return-url
        customClass="examp-apply-enclourse-dialog"
      />
    </div>
  </gc-model>
</template>

<script>
import { SPARK_APPLY_TYPE } from '@/util/constants'
import { CopyObj, formatDate, handleUdmpHref, validateDiffMonth } from '@/util/utils'
import ExamApprovalPerson from './ExamApprovalPerson.vue'
import AddEnclourse from '@/components/dialogs/AddEnclourse'
import { fetchListSparkApply } from '@/fetch/sparkProject'

export default {
  name: 'ExampApply',

  props: {
    dataInfo: {
      type: Object,
      default: {}
    },
    disabled: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      instructorInfo: {
        applyType: '0',
        applyTime: '',
        remitReason: '',
        applyReason: '',
        auditUsers: '',
        auditUsersUm: '',
        auditUsersName: ''
      },
      applyTypeOption: SPARK_APPLY_TYPE,
      applyTimeOptions: {
        disabledDate: (time) => {
          const todayTimestamp = new Date(
            new Date().toLocaleDateString()
          ).getTime()

          return (
            this._diffMonth(formatDate(new Date()), formatDate(time)) ||
            time.getTime() <= todayTimestamp
          )
        }
      },
      remitReasonOptions: [
        { label: '有一年以上银行一线工作经验', value: '1' },
        { label: '室经理、团队长、支行长等管理职能岗位', value: '2' },
        { label: '其他需豁免的情形', value: '3' }
      ],
      instructorInfoRules: {
        applyType: [requiredHandle('请选择申请类型')]
      },
      uploadedFiles: [],
      examApprovalParams: { chainType: '3', arg1: '0' },
      isDialogShow: false,
      isSendding: false,
      handleUdmpHref
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
        if (n) {
          console.log(this.dataInfo, 'dd')
          this._initData(this.dataInfo)
        }
      }
    }
  },

  components: {
    ExamApprovalPerson,
    AddEnclourse
  },

  mounted() {},

  methods: {
    _initData(n) {
      if (!Object.keys(n).length) return
      const data = CopyObj(n)
      this.instructorInfo = { ...this.instructorInfo, ...data }
      this.uploadedFiles = data.fileList
    },
    instructorCateChange(value) {
      this.examApprovalParams = { chainType: '3', arg1: value }
    },
    openUploadEnclourse() {
      this.$refs.addEnclourse.open()
    },
    addEnclourseComfirm(files) {
      this.uploadedFiles = files
    },
    _getApprovalData() {
      return this.$refs.examApprovalPersonRef.confirm()
    },

    _formatParams(data) {
      let res = CopyObj(data)
      if (res.applyType === '0') {
        Reflect.deleteProperty(res, 'applyTime')
      }
      return res
    },
    reset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    },
    closeHandle() {
      this.$emit('update:show', false)
      this.$emit('close')
      this.reset()
    },
    comfirmHandle() {
      this.$refs.instructorInfoFormRef.validate((v) => {
        if (!v) return
        !this.disabled && this._createApplyHandle()
        this.disabled && this.$emit('save') && this.closeHandle()
      })
    },

    async _createApplyHandle() {
      if (this.isSendding)
        return this.$message.warning('请求发送中，请勿重复操作')
      let approvalData = this._getApprovalData()
      if (!approvalData) return false
      this.isSendding = true
      let data = {
        data: {
          ...this._formatParams(this.instructorInfo),
          ...approvalData
        },
        file: this.uploadedFiles
      }
      this._exampApplySaveHandle(data)
        .then(() => {
          this.$emit('save')
          this.closeHandle()
        })
        .finally(() => {
          this.isSendding = false
        })
    },

    async _exampApplySaveHandle(params) {
      await fetchListSparkApply(params)
    },

    // 计算3个月的时间间隔
    _diffMonth(startTime, endTime) {
      return validateDiffMonth({ startTime, endTime, month: 3 })
    }
  }
}
</script>
<style lang='scss' scoped>
.exemp-style {
  :deep(.el-select) {
    width: 250px;
  }
}

.file-container {
  .file-content {
    margin: 10px 0;
    margin-right: 10px;
    display: inline-block;
  }
}

.upload-files-style {
  border: none;
  .download-style {
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000;
    margin-left: 5px;
    vertical-align: middle;
    display: inline-block;
  }

  :deep(.el-tag__close) {
    color: #aeb0b8;

    &:hover {
      background-color: $background-color;
    }
  }
}
</style>

<style lang="scss">
.examp-apply-enclourse-dialog {
  height: auto !important;
}
</style>