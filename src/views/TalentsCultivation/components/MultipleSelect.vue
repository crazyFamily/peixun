<template>
  <!-- 有多个的弹窗选择 -->
  <gc-model :visible="isDialogShow" :isShowFooter="false" @close="closeHandle()" title="请选择">
    <table-pagination
      :list="mergeColumns"
      :tableList="tableList"
      :queryForm="{}"
      @selection-change="selectionHandle"
      radio
      hidePagination
      ref="tablePagination"
    >
      <el-table-column :selectable="selectable" slot="selection" type="selection" min-width="54"> </el-table-column>
    </table-pagination>
    <p style="padding-top: 10px">共{{ tableList.length }}条数据</p>
    <p class="space" style="height: 40px"></p>
    <div class="tanlents-upload-footer">
      <el-button class="item-button" @click="closeHandle">取消</el-button>
      <el-button class="item-button" type="primary" @click="comfirmHandle" :disabled="!selectedList.length">确定</el-button>
    </div>
  </gc-model>
</template>

<script>
import { CopyObj } from '@/util/utils'
export default {
  name: 'Select',

  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    tableList: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
      }
    }
  },

  data() {
    return {
      isDialogShow: false,
      selectedList: []
    }
  },

  components: {},

  computed: {
    mergeColumns() {
      const selectioInt = {
        type: 'selection',
        slot: 'selection'
      }
      const columns = CopyObj(this.columns)
      if(this.columns[0]?.type === 'selection') columns.splice(0, 1, selectioInt)
      console.log(columns, '===>>>');
      return columns
    }
  },

  mounted() {},

  methods: {
    selectable(row) {
      // 通过这个字段来进行是否禁用的状态识别
      return !row.disabledSelect
    },
    selectionHandle(list) {
      this.selectedList = list
    },
    comfirmHandle() {
      this.$emit('save', CopyObj(this.selectedList[0]))
      this.closeHandle()
    },
    closeHandle() {
      this.isDialogShow = false
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang='scss' scoped>
.tanlents-upload-footer {
  padding: 15px 24px !important;
  border-top: 1px solid #eaecf1;
  box-sizing: border-box;
  text-align: right;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;

  .item-button {
    padding: 0 10px;
    min-width: 80px;
    height: 30px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>