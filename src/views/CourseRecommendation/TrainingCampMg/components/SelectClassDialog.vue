<template>
  <div class="class_container classes">
    <section class="classes_content mb20">
      <p>培训编码(请添加培训管理系统中已立项通过的8位数项目编号)：</p>
      <el-input v-model="classId" placeholder="请输入培训编码"></el-input>
    </section>
    <section class="classes_fotter" style="text-align: center">
      <el-button size="small" @click="$emit('cancel', 'class', '')"
        >取消</el-button
      >
      <el-button type="primary" size="small" @click="confirm">确定</el-button>
    </section>
  </div>
</template>

<script>
import { queryClassInfo } from '@/fetch/courseRecommendation'
export default {
  data() {
    return {
      classId: ''
    }
  },
  methods: {
    async confirm() {
      const { classId } = this
      try {
        const res = await queryClassInfo({ classId })
        if (res) {
          this.$emit('cancel', 'class', {
            id: res.classId,
            className: res.className,
            courseList: res.courseList,
            applyName: res.applyName,
            applyUmId: res.applyUmId,
          })
        } else {
          this.$message.warning('培训编码无效或没有该培训信息的权限')
        }
      } catch (error) {
        this.$message.warning('培训编码无效或没有该培训信息的权限')
      }
    }
  }
}
</script>

<style></style>