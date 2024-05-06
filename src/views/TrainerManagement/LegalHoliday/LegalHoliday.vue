<template>
  <div class="legal-holiday">
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="年度">
          <el-date-picker
            v-model="queryForm.paramYear"
            placeholder="选择日期"
            :clearable="true"
            type="year"
            popper-class="date-picker"
            value-format="yyyy"
          >
          </el-date-picker>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="isBatchImportShow = true">
          <i class="instructor-icons__add__icon"></i>
          导入
        </span>
        <span class="instructor-icons__add" @click="exportHandle">
          <i class="instructor-icons__add__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        class="table-left"
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <div class="buttons">
              <span class="active" @click="editHandle(scope.row)">编辑</span>
              <span class="active" @click="removeHandle(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <!-- 课表批量导入 dialog -->
    <InstructorBatchImport
      title="法定节假日批量导入"
      :visible="isBatchImportShow"
      @close="batchImortCloseHandle"
      @cancel="isBatchImportShow = false"
      @change="commonFileInputChange($event, timeFile, 'file')"
      @comfirm="timetableUploadComfirm"
      @templateDownload="templateDownloadHandle"
    >
    </InstructorBatchImport>
    <!-- 编辑弹窗 -->
    <gc-model
      title="编辑非工作日期"
      :visible.sync="isEditShow"
      width="800px"
      @comfirm="editComfirmHandle"
    >
      <el-date-picker
        v-model="currentTime"
        type="date"
        placeholder="选择日期"
        :clearable="false"
        value-format="yyyy-MM-dd"
        :picker-options="expireTimeOption"
        disabled
      >
      </el-date-picker>
      <div class="remark-container">
        <el-input
          type="textarea"
          v-model="editRemark"
          :rows="3"
          placeholder="请输入备注"
        ></el-input>
      </div>
    </gc-model>
  </div>
</template>

<script>
import {
  fetchGetHoliday,
  fetchDeleteHoliday,
  fetchUpdateHoliadyDays,
  fetchExportHoliday,
  fetchImportHoliday
} from '@/fetch/legalHoliday'
import {
  downloadAdapter,
  formatDate,
  commonFileInputChange,
  dataHeaders
} from '@/util/utils'
export default {
  name: 'LegalHoliday',

  props: {},

  data() {
    return {
      list: [
        {
          label: '非工作日期',
          prop: 'holidayDay'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      tableList: [],
      queryForm: {
        paramYear: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      isBatchImportShow: false,
      isEditShow: false,
      currentTime: '',
      editRemark: '',
      timeFile: {},
      commonFileInputChange,
      expireTimeOption: {
        disabledDate: (time) => {
          let getYear = (t) => {
            if (!t) return ''
            return t.split('-')[0]
          }
          return getYear(formatDate(time)) !== getYear(this.currentTime)
        }
      }
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.query()
  },

  methods: {
    async getList() {
      let data = this.queryForm
      let { list, total } = await fetchGetHoliday({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    async removeHandle(row) {
      try {
        await this.removeTips()
        await fetchDeleteHoliday({ days: row.holidayDay })
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {}
    },
    async exportHandle() {
      let data = this.queryForm
      await fetchExportHoliday({ data })
    },
    timetableUpload($event) {
      this.timeFile = $event.target.files[0]
    },
    async timetableUploadComfirm() {
      if (!this.timeFile.file) {
        return this.$message.warning('没有选择需要上传的文件')
      }
      let data = new FormData()
      Object.keys(this.timeFile).forEach((key) => {
        data.append(key, this.timeFile[key])
      })
      try {
        await fetchImportHoliday(data)
        this.$message.success('上传成功')
        this.isBatchImportShow = false
        this.query()
      } catch (e) {
        this.$message.warning('上传失败，请重试')
      }

      // this.$axios
      //   .post('/common/trainer/batchImportHolidays', data, dataHeaders)
      //   .then((res) => {
      //     if (Number(res.data.code) === 0) {
      //       this.$message.success('上传成功')
      //       this.isBatchImportShow = false
      //       this.query()
      //     } else {
      //       this.$message.warning('上传失败，请重试')
      //     }
      //   })
    },
    templateDownloadHandle() {
      downloadAdapter({ templateCode: 'LEGAL_HOLIDAY' })
    },
    batchImortCloseHandle() {
      this.timeFile = {}
      this.isBatchImportShow = false
    },
    editHandle({ holidayDay, remark }) {
      this.currentTime = holidayDay
      this.editRemark = remark
      this.isEditShow = true
    },
    async editComfirmHandle() {
      if (this.editRemark && this.editRemark.length > 30) {
        return this.$message.warning(
          `最多只能输入30个字符, 当前字数：${this.editRemark.length}`
        )
      }
      await fetchUpdateHoliadyDays({
        holidayDay: this.currentTime,
        remark: this.editRemark
      })
      this.$message.success('修改成功')
      this.isEditShow = false
      this.getList()
    },
    // 删除操作的二次提示
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定删除选中项', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject('')
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.buttons .active {
  display: inline-block;
  margin-right: 10px;
}

.remark-container {
  margin-top: 20px;
}
</style>