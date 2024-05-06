<template>
  <div>
    <gc-model
      :visible="isDialogShow"
      @close="closeHandle"
      @cancel="closeHandle"
      @comfirm="comfirmHandle"
      top="5vh"
      width="800px"
      title=" "
      :isShowFooter="false"
    >
      <headquarter-upload
        template-code="TANLENTS_USER_INFO"
        :fetch-fn="fetchBatchImportAuthUsers"
        :params="uploadParams"
        :table-columns="uploadTableColumns"
        @faildExport="faildExportHandle"
        @uploadFinish="uploadFinishHandle"
        ref="headquarterUploadRef"
      ></headquarter-upload>
      <p class="space" style="height: 60px"></p>
      <div class="tanlents-upload-footer">
        <el-button class="item-button" @click="closeHandle">取消</el-button>
        <el-button
          class="item-button"
          type="primary"
          @click="comfirmHandle"
          :disabled="isHasFaildData"
          >确定</el-button
        >
      </div>
    </gc-model>
  </div>
</template>

<script>
import HeadquarterUpload from '@/components/upload/HeadquarterUpload.vue'
import {
  fetchBatchImportAuthUsers,
  fetchExportFailedUser
} from '@/fetch/tanlents'
import { uuid } from '@/util/utils'
export default {
  name: 'CompTanlentsUpload',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      uploadParams: {
        batchId: uuid(),
        tip: 'N'
      },
      uploadTableColumns: [
        {
          label: '学员UM',
          prop: 'um'
        },
        {
          label: '学员姓名',
          prop: 'umName'
        },
        // {
        //   label: '部门',
        //   prop: 'position'
        // },
        {
          label: '失败原因',
          prop: 'failMsg'
        }
      ],
      isDialogShow: false,
      isHasFaildData: false,
      sucessList: [],
      fetchBatchImportAuthUsers
    }
  },

  watch: {
    show: {
      handler(n) {
        this.isDialogShow = n
      },
      immediate: true
    }
  },

  components: {
    HeadquarterUpload
  },

  computed: {},

  mounted() {},

  methods: {
    reset() {
      this.$refs.headquarterUploadRef.reset()
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    },
    closeHandle() {
      this.reset()
      this.$emit('update:show', false)
    },
    comfirmHandle() {
      this.$emit('comfirm', this.sucessList, this.uploadParams.batchId)
      this.closeHandle()
    },
    async faildExportHandle() {
      await fetchExportFailedUser({ batchId: this.uploadParams.batchId })
    },
    uploadFinishHandle({ sucessList, errorList }) {
      this.isHasFaildData = Boolean(errorList.length)
      this.sucessList = sucessList
    }
  }
}
</script>
<style lang="scss" scoped>
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