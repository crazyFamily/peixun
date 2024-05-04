<template>
  <div class="Attach">
    <div class="Attach__title mt20">
      <div class="Attach__title__left title">
        <span class="Attach__title__left__menu"></span>
        附件信息
      </div>
      <div class="icons" v-show="!disabled">
        <span class="icons__add" @click="addEnclosureVisible = true">
          <i class="icons__add__icon"></i>
          添加附件
        </span>
        <span class="icons__upload" @click="openElectronicsInvoice('e_invoice')">
          <i class="icons__upload__icon"></i>
          上传电子普票
        </span>
        <span class="icons__upload" @click="openElectronicsInvoice('spe_invoice')">
          <i class="icons__upload__icon"></i>
          上传电子专票
        </span>
        <span class="icons__del" @click="delEnclosureOneItem">
          <i class="icons__del__icon"></i>
          删除
        </span>
      </div>
    </div>
    <gc-table :list="enclosureList" :tableList="enclosureTable" :stripe="false" ref="enclosureTableRef" class="general__table mt20">
      <template>
        <el-table-column label="附件名称">
          <template slot-scope="scope">
            <span class="active" @click="handleDownloadFile(scope.row)">{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="附件类型">
          <template slot-scope="scope">
            <span>{{ handleSubmodule(scope.row.submodule) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间">
          <template slot-scope="scope">
            {{ handleTime(scope.row.createdDate) }}
          </template>
        </el-table-column>
        <el-table-column label="上传人" prop="createdBy"></el-table-column>
      </template>
    </gc-table>
    <!-- 添加附件 dislog -->
    <gc-model
      class="LaunchTrainingCourse__add-enclosure"
      title="添加附件"
      :visible="addEnclosureVisible"
      min-width="500px"
      @close="
        addEnclosureVisible = false
        addEnclosureFileList = []
      "
      @comfirm="addEnclosureComfirm"
      @cancel="addEnclosureVisible = false"
    >
      <div class="LaunchTrainingCourse__add-enclosure__title">
        <div class="LaunchTrainingCourse__add-enclosure__title__text">
          上传附件
        </div>

        <el-button class="LaunchTrainingCourse__add-enclosure__title__btn" @click="openUpload('addEnclosureFile')">
          <i class="LaunchTrainingCourse__add-enclosure__title__btn__icon"></i>
          上传文件
        </el-button>
        <input
          v-if="inputShow"
          type="file"
          id="addEnclosureFile"
          ref="addEnclosureFileRef"
          @change="addEnclosureFileChange"
          :accept="acceptStr"
        />
      </div>
      <div class="LaunchTrainingCourse__add-enclosure__format">
        <span style="float: left"> 支持扩展名：</span>
        <span>
          .xls,.doc,.jpg,.png,.htm,.bmp,.tif,.ppt,.pdf,.gif,.mht,.mpp,.msg,.rtf,.rar,.zip,.7z.001,.7z.002,.txt,.log,.html,.docx,.xlsx,.pptx,.ofd,.eml
        </span>
      </div>
      <div class="LaunchTrainingCourse__add-enclosure__items">
        <div class="LaunchTrainingCourse__add-enclosure__items__item" v-for="item in addEnclosureFileList" :key="item.lastModified">
          <i class="LaunchTrainingCourse__add-enclosure__items__item__icon"></i>
          <div class="LaunchTrainingCourse__add-enclosure__items__item__filename">
            <gc-tooltip :length="1">
              {{ item.name }}
            </gc-tooltip>
          </div>
          <el-progress class="LaunchTrainingCourse__add-enclosure__items__item__progress" :percentage="100" status="success"></el-progress>
        </div>
      </div>
    </gc-model>

    <!-- 上传电子普票 dislog -->
    <gc-model
      class="LaunchTrainingCourse__upload-electronics-invoice"
      :title="'上传'+(invoiceType=== 'e_invoice'?'电子普票':'电子专票')"
      :visible="uploadElectronicsInvoice"
      width="500px"
      @close="
        uploadElectronicsInvoice = false
        $refs.uploadElectronicsInvoiceFileInputRef.value = ''
        uploadElectronicsInvoiceFileList = []
      "
      @comfirm="uploadElectronicsInvoiceComfirm"
      @cancel="uploadElectronicsInvoice = false"
    >
      <div class="LaunchTrainingCourse__upload-electronics-invoice__title">
        <div class="LaunchTrainingCourse__upload-electronics-invoice__title__text">
          上传附件
        </div>
        <el-button class="LaunchTrainingCourse__upload-electronics-invoice__title__btn" @click="openUpload('uploadElectronicsInvoiceFileInput')">
          <i
            class="
              LaunchTrainingCourse__upload-electronics-invoice__title__btn__icon
            "
          ></i>
          上传文件
        </el-button>
        <input
          type="file"
          name=""
          ref="uploadElectronicsInvoiceFileInputRef"
          id="uploadElectronicsInvoiceFileInput"
          accept=".pdf,.ofd"
          @change="uploadElectronicsInvoiceFileInputChange"
        />
      </div>
      <div class="LaunchTrainingCourse__upload-electronics-invoice__format">
        {{invoiceType==='e_invoice'?'电子普票':'电子专票'}}只允许上传PDF,OFD类型文件
      </div>
      <div class="LaunchTrainingCourse__upload-electronics-invoice__items" v-for="item in uploadElectronicsInvoiceFileList" :key="item.lastModified">
        <div class="LaunchTrainingCourse__upload-electronics-invoice__items__item">
          <i
            class="
              LaunchTrainingCourse__upload-electronics-invoice__items__item__icon
            "
          ></i>
          <div
            class="
              LaunchTrainingCourse__upload-electronics-invoice__items__item__filename
            "
          >
            <gc-tooltip :length="1">
              {{ item.name }}
            </gc-tooltip>
          </div>
          <el-progress
            class="
              LaunchTrainingCourse__upload-electronics-invoice__items__item__progress
            "
            :percentage="100"
            status="success"
          ></el-progress>
        </div>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { CopyObj, getCurrentTime, downloadFileAsAlink } from '@/util/utils'
import { fetchDelFileByUdmpids } from '@/fetch/reimbursement'
import { uploadFileToUdmp, fileDownload } from '@/util/udmp'
export default {
  name: 'Attach',
  props: {
    // 是否查看
    disabled: {
      type: Boolean,
      default: false
    },
    // 附件信息
    attaches: {
      type: Array,
      default: () => []
    },
    // 基本信息
    baseInfobusiId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 添加附件的 dialog 状态
      addEnclosureVisible: false,
      // 上传电子普票的 dialog 状态
      uploadElectronicsInvoice: false,
      //  附件信息 table 字段数组
      enclosureList: [
        {
          width: '54',
          type: 'selection'
        },
        {
          label: '序号',
          width: '60',
          type: 'index',
          value: '序号'
        }
      ],
      //  附件信息 table 数据数组
      enclosureTable: [],
      // 添加附件的 dialog 文件数组
      addEnclosureFileList: [],
      inputShow: true,
      // 上传电子普票的 dialog 文件数组
      uploadElectronicsInvoiceFileList: [],
      // 允许上传的文件类型
      acceptStr:
        '.xls,.doc,.jpg,.png,.htm,.bmp,.tif,.ppt,.pdf,.gif,.mht,.mpp,.msg,.rtf,.rar,.zip,.7z,.001,.002,.txt,.log,.html,.docx,.xlsx,.pptx,.ofd,.eml',
      busiId: '',
      invoiceType: ''
    }
  },
  methods: {
    // 附件信息删除 函数
    delEnclosureOneItem() {
      const selection = this.$refs.enclosureTableRef.$children[0].selection
      const udmpIds = selection.map(v => v.udmpId)
      if (udmpIds.length) {
        fetchDelFileByUdmpids({ udmpIds, busiId: this.busiId }).then(res => {
          this.enclosureTable = this.enclosureTable.filter(v => !selection.includes(v))
        })
      }
    },
    // 处理时间显示
    handleTime(createdDate) {
      if (createdDate.indexOf('T') > 0) {
        return createdDate.split('T')[0]
      } else {
        return createdDate.split(' ')[0]
      }
    },
    // 处理附件类型
    handleSubmodule(submodule) {
      switch (submodule) {
        case 'e_invoice':
          return '电子普票'
        case 'spe_invoice':
          return '电子专票'
        case 'attach':
          return '普通附件'
      }
    },
    // 添加附件 dialog 确定事件
    async addEnclosureComfirm() {
      if (!this.addEnclosureFileList.length) {
        this.addEnclosureVisible = false
        return
      }
      this.enclosureTable.push(...this.addEnclosureFileList)
      this.addEnclosureVisible = false
    },
    // 打开上传电子专票、发票
    openElectronicsInvoice(invoiceType) {
      this.uploadElectronicsInvoice = true
      this.invoiceType = invoiceType
    },
    // 打开上传文件框的公共函数
    openUpload(id) {
      this.inputShow = true
      this.$nextTick(() => {
        document.getElementById(id).click()
      })
    },
    // 添加附件 file表单 change事件
    addEnclosureFileChange($event) {
      const file = $event.target.files[0]
      if (file) {
        if (file.size > 30 * 1024 * 1024) {
          this.$message('文件不能大于30M')
          return false
        }
        const extname = '.' + file.name.split('.').slice(-1)[0]
        const extList = this.acceptStr.split(',')
        if (!extList.includes(extname)) {
          this.$message.warning('文件类型错误')
          return false
        }
        uploadFileToUdmp([{ file }])
        .then(res => {
          if (res.length) {
            const [fileData] = res
            this.addEnclosureFileList.push({
              udmpId: fileData.doc_id,
              fileName: file.name,
              name: file.name,
              createdBy: `${this.$store.state.userInfo.umId}`,
              createdByName: this.$store.state.userInfo.empName,
              createdDate: getCurrentTime(true),
              sizes: fileData.file.size,
              module: 'reim_init',
              submodule: 'attach',
              busiId: this.busiId,
            })
            this.inputShow = false
          }
        }).catch(err => {
          console.log(err, '错误');
        })
      }
    },
    // 上传电子普票  dialog 确定事件
    async uploadElectronicsInvoiceComfirm() {
      if (!this.uploadElectronicsInvoiceFileList.length) {
        this.uploadElectronicsInvoice = false
        return
      }
      this.enclosureTable.push(...this.uploadElectronicsInvoiceFileList)
      this.uploadElectronicsInvoice = false
    },
    // 上传电子普票 file表单 change事件
    uploadElectronicsInvoiceFileInputChange($event) {
      const file = $event.target.files[0]
      if (file) {
        const extname = file.name.split('.').slice(-1)[0]
        if (!['pdf', 'ofd'].includes(extname.toLowerCase())) {
          this.$message(this.invoiceType==='e_invoice'?'电子普票':'电子专票'+'只能上传pdf,ofd格式')
          return false
        }
        uploadFileToUdmp([{ file }])
        .then(res => {
          if (res.length) {
            const [fileData] = res
            this.uploadElectronicsInvoiceFileList.push({
              udmpId: fileData.doc_id,
              fileName: file.name,
              name: file.name,
              createdBy: `${this.$store.state.userInfo.umId}`,
              createdByName: this.$store.state.userInfo.empName,
              createdDate: getCurrentTime(true),
              sizes: fileData.file.size,
              module: 'reim_init',
              submodule: this.invoiceType,
              busiId: this.busiId,
            })
          }
        }).catch(err => {
          console.log(err, '错误');
        })
      }
    },
    async handleDownloadFile (row) {
      try {
        downloadFileAsAlink(await fileDownload(row.udmpId))
      } catch (error) {}
    },
    _initData() {
      this.enclosureTable = CopyObj(this.attaches)
    }
  },
  created() {
    this.acceptStr = this.acceptStr + ',' + this.acceptStr.toUpperCase()
  },
  watch: {
    baseInfobusiId: {
      handler(n) {
        this.busiId = this.baseInfobusiId || ''
      }
    },
    attaches: {
      deep: true,
      handler(n) {
        this._initData()
      }
    },
    enclosureTable: {
      deep: true,
      handler(n) {
        this.$emit('save', this.enclosureTable)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.Attach {
  &__title {
    display: flex;
    justify-content: space-between;
    &__left {
      font-size: 14px;
      font-family: 'PingFangSC-Medium', 'Roboto-Regular', 'PingFang SC', 'Droid Sans', 'HelveticaNeue', 'Helvetica Neue', arial, sans-serif;
      &__menu {
        display: inline-block;
        width: 3px;
        height: 10px;
        margin-right: 7px;
        background-color: #fd6720;
      }
    }
  }
}
</style>