<template>
  <div class="hq-upload-box" v-loading="isUploading">
    <div class="upload-container">
      <el-upload
        class="hq-upload"
        drag
        :auto-upload="true"
        :http-request="uploadHandle"
        action=""
        :accept="resultAccept"
        :show-file-list="false"
        :before-upload="uploadInterceptor"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{hintTxt}}</div>
        <div v-if="extentionTxt" class="el-upload-extention__text">{{extentionTxt}}</div>
      </el-upload>
      <div class="buttons">
        <el-button v-if="templateCode" @click="downloadHandle">导入模板下载</el-button>
      </div>
    </div>
    <template v-if="statistics">
      <hr class="line" />
      <div class="result-container">
        <div class="progress-bar">
          <el-progress :percentage="resultPercentage"></el-progress>
        </div>
        <!-- <div class="progress-bar" v-show="isUploading">
          <el-progress :percentage="resultPercentage"></el-progress>
        </div> -->
        <div class="tips" v-show="isTipsShow">
          <slot name="tips">
            导入校验完成！此次校验成功了<span class="tip-value">{{ successList.length }}</span
            >条数据，校验失败<span class="tip-value">{{ failedList.length }}</span
            >条，具体请下载失败原因说明
          </slot>
        </div>
        <div class="menu-right" v-if="isTableShow">
          <span class="instructor-icons__download" @click="failResultExportHandle">
            <i class="instructor-icons__download__icon"></i>
            导出</span
          >
        </div>
        <table-pagination
          :list="tableColumns"
          :tableList="renderTableList"
          :queryForm="queryForm"
          :hide-pagination="true"
          ref="tablePagination"
          v-if="isTableShow"
        >
        </table-pagination>
      </div>
    </template>
  </div>
</template>

<script>
/**
  总行需求导入框模式
 */
// import { fetchBatchImportHeroTrails } from '@/fetch/caseCenter'
import { downloadAdapter } from '@/util/utils'

// 进度条最少会显示1000毫秒
const PROCESS_BAR_SHOW_TIME = 1000

export default {
  name: 'HeadquarterUpload',

  props: {
    hintTxt:{
      type:String,
      default:'将文件拖到此处，或点击上传'
    },
    extentionTxt:{
      type:String,
      default:''
    },
    templateCode: {
      type: String,
      default: ''
    },
    fetchFn: {
      type: Function
    },
    params: {
      type: Object
    },
    tableColumns: {
      type: Array,
      default: () => []
    },
    // 格式例：[jpg, png, pdf]
    accept: {
      type: Array,
      default: () => []
    },
    // 大小限制，单位MB
    size: {
      type: Number
    },
    // 是否进行数据统计，会影响UI显示和返回逻辑
    statistics: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      queryForm: { total: 0 },
      percentage: 0,
      resultPercentage: 0,
      isUploading: false,
      uploadFlag: false,
      isTipsShow: false,
      isUploadFetchFinish: false,
      isProgressFinish: false,
      successList: [],
      failedList: [],
      renderTableList: [],
      resultAccept: '',
      isIntercept: false,
      isLoading: false
    }
  },

  components: {},

  computed: {
    isTableShow() {
      return this.tableColumns.length
    }
  },

  watch: {
    accept: {
      handler(n) {
        if (!n.length) return ''
        this.resultAccept = n
          .map((item) => {
            return `.${item.toLowerCase()},.${item.toUpperCase()}`
          })
          .join(',')
      },
      immediate: true
    }
  },

  mounted() {},

  methods: {
    uploadInterceptor(file) {
      this.isIntercept = false
      if (this.size && file.size / 1024 / 1024 > this.size) {
        this.isIntercept = true
        return this.$message.warning(`文件大小限制在${this.size}m以内`)
      }
      return file
    },
    async uploadHandle({ file }) {
      if (!this.fetchFn) return
      if (this.isIntercept) return
      this.percentage = 0
      let data = this._formatData(file)
      this.isUploading = true
      this._setProgressFlag()
      await this.fetchFn(data, {
        onUploadProgress: ({ lengthComputable, loaded, total }) => {
          lengthComputable && (this.percentage = (loaded / total) * 100)
        }
      })
        .then((res) => {
          if (this.statistics) {
            if (res.succList && !res.sucessList) res.sucessList = res.succList
            if (res.failList && !res.errorList) res.errorList = res.failList
            let { sucessList = [], errorList = [], succBatchId, failBatchId } = res

            this._statisticsResultHandle(sucessList, errorList, succBatchId, failBatchId)
          } else {
            this._fileResultHandle(file, res, 'success')
          }
          this.isUploading = false
        })
        .catch((e) => {
          console.error(e)
          this.isUploading = false
          if (!this.statistics) this._fileResultHandle(file, 'failed')
        })
    },
    _formatData(file) {
      let data = new FormData()
      if (this.statistics) {
        data.append('file', file)
      } else {
        data.append('module', 'fosterSubject')
        data.append('submodule', 'attach')
        data.append('busiId', '')
        data.append('isSave', 'N')
        data.append('isReplace', 'N')
        data.append('files', file)
      }
      if (this.params) {
        Object.keys(this.params).forEach((item) => {
          data.append(item, this.params[item])
        })
      }
      return data
    },
    _statisticsResultHandle(sucessList, errorList, succBatchId, failBatchId) {
      this.isUploadFetchFinish = true
      this.successList = sucessList
      this.failedList = errorList
      this._uploadFinishHandle()
      this.$emit('uploadFinish', { sucessList, errorList, succBatchId, failBatchId })
    },
    _fileResultHandle(file, data, status) {
      this.$emit('uploadFinish', {
        file,
        data,
        status
      })
    },
    _setProgressFlag() {
      let timer = setTimeout(() => {
        this.isProgressFinish = true
        this._uploadFinishHandle()
        clearTimeout(timer)
      }, PROCESS_BAR_SHOW_TIME)
    },
    _uploadFinishHandle() {
      if (this.isUploadFetchFinish && this.isProgressFinish) {
        this.isUploading = false
        this.uploadFlag = true
        this.isTipsShow = true
        this.isProgressFinish = false
        this.isUploadFetchFinish = false
        this.renderTableList = this.failedList
        let res = (this.successList.length / (this.successList.length + this.failedList.length || 1)) * 100
        this.resultPercentage = Math.floor(res)
      }
    },
    downloadHandle() {
      downloadAdapter({ templateCode: this.templateCode })
    },
    failResultExportHandle() {
      this.$emit('faildExport')
    },
    reset() {
      for (let i in this.$data) {
        this.$data[i] = this.$options.data.call(this)[i]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$base-space: 10px;
$upload-width: 360px;

.upload-container {
  width: $upload-width;
  margin: 0 auto;
}

.buttons {
  display: flex;
  justify-content: flex-end;
}

.hq-upload {
  width: 100%;
  margin-bottom: $base-space;
}

.line {
  margin: $base-space 0;
  background: $line-color;
  border: 0;
  height: 1px;
}

.progress-bar,
.tips {
  margin-bottom: $base-space;
}

.result-container {
  min-height: 50px;
}

.menu-right {
  margin-bottom: $base-space;
}

.tip-value {
  color: $themeColor;
  font-weight: bolder;
  font-size: 14px;
  margin: 0 5px;
  display: inline-block;
}
.el-upload-extention__text{
  opacity: 0.3;
  font-size: 12px;
  color: #000000;
  line-height: 18px;
  font-weight: 400;
}
</style>