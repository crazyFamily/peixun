<template>
  <div class="gc-errotHint">
    <gc-model
      title="提示"
      width="600px"
      :visible="visible"
      :isAppend="true"
      @close="visible = false"
      @cancel="visible = false"
      @comfirm="visible = false"
    >
      <div class="gc-errotHint__box">
        <div v-for="item in list" :key="item.title" class="item">
          <p class="gc-errotHint__box__title">{{ item.title }}</p>
          <div class="general__table mt10">
            <el-table :data="item.data">
              <el-table-column label="行号" width="54" prop="key">
              </el-table-column>
              <el-table-column label="错误信息" prop="value"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </gc-model>
  </div>
</template>

<script>
export default {
  props: ['errorList', 'dataTransition'],
  data() {
    return {
      visible: false,
      list: []
    }
  },
  watch: {
    errorList(n) {
      if (n) {
        this.list = this.dataTransition(this.errorList)
        this.visible = true
      }
    }
  }
}
</script>

<style lang="scss">
.gc-errotHint {
  &__box {
    .item {
      margin-top: 10px;
      &:first-child {
        margin-top: 0;
      }
    }
    &__title {
      font-size: 20px;
      text-align: center;
    }
  }
}
</style>
