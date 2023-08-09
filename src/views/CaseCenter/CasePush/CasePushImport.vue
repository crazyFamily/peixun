<template>
  <div class="case-push-import">
    <div class="main-container">
      <el-card class="mt10">
        <div class="menu-right">
          <span class="instructor-icons__upload" @click="isImportShow = true">
            <i class="instructor-icons__upload__icon"></i>
            批量新增
          </span>
          <!-- <span class="instructor-icons__download" @click="exportHandle">
            <i class="instructor-icons__download__icon"></i>
            导出
          </span> -->
        </div>
        <table-pagination
          :list="list"
          :tableList="tableList"
          :queryForm="queryForm"
          :getList="getList"
          ref="tablePagination"
        >
          <el-table-column label="操作" min-width="90" fixed="right">
            <template slot-scope="scope">
              <span
                class="active"
                @click="exportHandle(scope.row)"
                v-if="[2, 3].includes(Number(scope.row.status))"
              >
                下载
              </span>
            </template>
          </el-table-column>
        </table-pagination>
      </el-card>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
    </div>
    <!-- 批量新增课程 dialog -->
    <InstructorBatchImport
      title="批量导入"
      :visible="isImportShow"
      @close="isImportShow = false"
      @cancel="isImportShow = false"
      @comfirm="importComfirm"
      @change="commonFileInputChange($event, imoprtFile, 'file')"
      @templateDownload="templateDownloadHandle"
    />
  </div>
</template>

<script>
import {
  commonFileInputChange,
  templateDownload,
  downloadAdapter,
  dataHeaders
} from '@/util/utils'
import {
  fetchCasePushImportList,
  fetchExportPushCaseFailUsersList
} from '@/fetch/caseCenter'
export default {
  name: 'CasePushImport',

  props: {},

  data() {
    return {
      uuid: '',
      imoprtFile: {},
      isImportShow: false,
      list: [
        { label: '序号', type: 'index' },
        { label: '操作人', prop: 'umName' },
        { label: '导入时间', prop: 'createdDateDesc' },
        { label: '状态', prop: 'statusDesc' }
     ],
      tableList: [],
      queryForm: {
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      commonFileInputChange,
      templateDownload
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    closeHandle() {
      this.$router.push({ name: '案例推送规则' })
    },
    importComfirm() {
      if (!this.imoprtFile.file) {
        return this.$message.warning('没有选择需要上传的文件')
      }
      let data = new FormData()
      Object.keys(this.imoprtFile).forEach((key) => {
        data.append(key, this.imoprtFile[key])
        data.append('batchId', this.uuid)
      })
      // await fetchImportHoliday(data)
      this.$axios
        .post('/common/caseCenter/batchImportCasePushUsers', data, dataHeaders)
        .then((res) => {
          if (Number(res.data.code) === 0) {
            this.$message.success('上传成功')
            this.isImportShow = false
            this.query()
          } else {
            this.$message.warning('上传失败，请重试')
          }
        })
    },
    async exportHandle(row) {
      let data = {
        batchId: this.uuid,
        id: row.id
      }
      await fetchExportPushCaseFailUsersList(data)
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    async getList() {
      let data = { ...this.queryForm, batchId: this.uuid }
      let { list, total } = await fetchCasePushImportList({ data })
      this.queryForm.total = total
      this.tableList = list
    },
    templateDownloadHandle() {
      downloadAdapter({ templateCode: 'CASE_PUSH_USER_INFO' })
    }
  },

  activated() {
    if (this.$route.params.uuid) {
      this.uuid = this.$route.params.uuid
      this.query()
    }
  }
}
</script>
<style lang='scss' scoped>
.main-container {
  background: #fff;
}
</style>
