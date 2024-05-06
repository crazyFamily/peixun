<template>
  <div>
    <gc-model
      :visible="isDialogShow"
      @close="closeHandle"
      @cancel="closeHandle"
      @comfirm="comfirmHandle"
      top="5vh"
      :width="width"
      :title="title"
      :isShowFooter="false"
    >
      <headquarter-upload
        :template-code="templateCode"
        :fetch-fn="fetchFn"
        :params="{ ...uploadParams, batchId: batchId }"
        :table-columns="uploadTableColumns"
        @faildExport="faildExportHandle"
        @uploadFinish="uploadFinishHandle"
        ref="headquarterUploadRef"
      ></headquarter-upload>
      <p class="space" style="height: 60px"></p>
      <div class="tanlents-upload-footer">
        <el-button class="item-button" @click="closeHandle">取消</el-button>
        <el-button class="item-button" type="primary" @click="comfirmHandle" :disabled="isHasFaildData">确定</el-button>
      </div>
    </gc-model>
  </div>
</template>

<script>
import HeadquarterUpload from '@/components/upload/HeadquarterUpload.vue'
import { fetchExportFailData } from '@/fetch/public'
import { uuid } from '@/util/utils'
export default {
  name: 'CompTanlentsUpload',

  props: {
    title: {
      type: String,
      default: ' '
    },
    show: {
      type: Boolean,
      default: false
    },
    templateCode: {
      type: String
    },
    fetchFn: {
      type: Function,
      required: true
    },
    uploadParams: {
      type: Object,
      default: () => {}
    },
    uploadTableColumns: {
      type: Array,
      default: () => [
        {
          label: '行数',
          prop: 'num'
        },
        {
          label: '失败原因',
          prop: 'failMsg'
        }
      ]
    },
    // 导出请求
    exportFetch: {
      type: Function,
      default: fetchExportFailData
    },
    // 导出失败列表是否采用后端返回的failBatchId
    exportFailBatchId: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '800px'
    },
  },

  data() {
    return {
      // uploadParams: {
      //   batchId: uuid()
      // },
      batchId: uuid(),
      // uploadTableColumns: [
      //   {
      //     label: '学员UM',
      //     prop: 'um'
      //   },
      //   {
      //     label: '学员姓名',
      //     prop: 'umName'
      //   },
      //   {
      //     label: '部门',
      //     prop: 'position'
      //   },
      //   {
      //     label: '失败原因',
      //     prop: 'failMsg'
      //   }
      // ],
      isDialogShow: false,
      isHasFaildData: false,
      sucessList: [],
      failBatchId: '',
      succBatchId: '',
    }
  },

  computed: {
    resultParams() {
      return {
        // ...this.uploadParams,
        // batchId: this.batchId
      }
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
      this.$emit('comfirm', this.sucessList, this.batchId, this.succBatchId)
      this.closeHandle()
    },
    async faildExportHandle() {
      // await fetchExportFailedUser({ batchId: this.batcshId })
      await this.exportFetch({ batchId: this.exportFailBatchId && this.failBatchId ? this.failBatchId : this.batchId })
    },
    uploadFinishHandle({ sucessList, errorList, succBatchId, failBatchId }) {
      this.isHasFaildData = Boolean(errorList.length)
      this.sucessList = sucessList
      this.succBatchId = succBatchId
      this.failBatchId = failBatchId
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