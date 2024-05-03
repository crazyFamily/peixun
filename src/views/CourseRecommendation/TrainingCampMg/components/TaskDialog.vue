<template>
  <div class="task_container task">
    <el-form :model="taskForm" :rules="taskRules" :disabled="disabled" ref="taskForm">
      <el-form-item label="作业名称" prop="title">
        <el-input v-model="taskForm.title" placeholder="请输入作业名称"></el-input>
      </el-form-item>
      <el-form-item label="作业说明" prop="taskName">
        <el-input
          v-model="taskForm.taskName"
          placeholder="请输入作业说明"
          maxlength="200"
          show-word-limit
          type="textarea"
          :rows="5"
          resize="none"
        ></el-input>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker
          v-model="taskForm.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"
          :picker-options="taskEndTimeRules"
        >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <section class="classes_fotter" style="text-align: center">
      <el-button :disabled="false" @click="$emit('cancel', 'task', '')">取消</el-button>
      <el-button type="primary" @click="confrim">确定</el-button>
    </section>
  </div>
</template>

<script>
import store from '@/store'
import { CopyObj, formatDate } from '@/util/utils'
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      taskForm: {
        title: '',
        taskName: '',
        endTime: ''
      },
      taskRules: {
        title: { required: true, message: '请输入作业名称', trigger: 'blur' },
        taskName: {
          required: true,
          message: '请输入作业说明',
          trigger: 'blur'
        },
        endTime: { required: true, message: '请选择结束时间', trigger: 'blur' }
      },
      // 作业结束时间不能超出整个训练营的时间
      taskEndTimeRules: {
        disabledDate: (time) => {
          return formatDate(time) < store.state?.trainingCamp?.startTime || formatDate(time) > store.state?.trainingCamp?.endTime
        }
      }
    }
  },
  methods: {
    // 为对原有逻辑不做过多破坏调整，这里提供一个外部组件调用的初始化方法进行处理
    initTaskData(dataInfo = {}) {
      if (!(dataInfo instanceof Object)) {
        throw Error('需要传入一个对象')
      }
      this.taskForm = CopyObj({ ...dataInfo, taskName: dataInfo.content })
    },
    confrim() {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          // this.$emit('cancel', 'task', this.taskForm)
          this.$emit('confirm', 'task', this.taskForm)
          this.taskForm = this.$options.data.call(this)['taskForm']
        } else {
          this.$message.warning('校验错误！')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor {
  width: 100%;
}
</style>