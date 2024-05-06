<template>
  <div class="evaluation-wrapper">
    <el-form ref="evaluateInfoRef" :model="evaluateInfo" label-width="110px">
      <el-form-item label="年度" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="项目ID" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="项目类型" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="所属单位" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="主办单位" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="学员名称" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="大局观" prop="annual">
        <div class="df">
          <el-input :value="evaluateInfo.annual"></el-input>
          <div class="key-action">
            <span>大局观关键行为</span>
            <el-input :value="evaluateInfo.annual"></el-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="开创性" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="开创性关键行为" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="狼性" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="狼性关键行为" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="创新力" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
      <el-form-item label="创新力关键行为" prop="annual">
        <el-input :value="evaluateInfo.annual"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { onActivated, reactive, ref } from 'vue'
import { useRoute } from '@/router';
import { useBaseDataEvents } from '@/hooks/useBaseDataEvents';
const { mergeReactive } = useBaseDataEvents()


const evaluateInfo = reactive({})
const status = ref('edit')

onActivated(() => {
  console.log(useRoute().params);
  if(useRoute().params.row) {
    mergeReactive({origin: evaluateInfo, target: useRoute().params.row})
    status.value =  useRoute().params.formType
  }

})
</script>
<script>
export default {
  name: "AddTanlentsEvaluation"
}
</script>

<style lang='scss' scoped>
</style>