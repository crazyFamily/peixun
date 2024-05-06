<template>
  <div>
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="模板名称">
          <el-input
            class="w200"
            placeholder="模板名称/模板ID"
            v-model="queryForm.templateName"
          ></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="icons__add" @click="addTemplateHandle">
          <i class="icons__add__icon"></i>
          新增
        </span>
      </div>
      <table-pagination
        class="table-left"
        :list="columns"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              placement="left"
              :visible-arrow="false"
              popper-class="bgf shadow-1"
            >
              <div slot="content" class="tooltip__operation">
                <span class="active" @click="handleDownloadFile(scope.row)">下载</span>
                <span class="active" @click="removeTemplateHandle(scope.row)"
                  >删除</span
                >
              </div>
              <el-button class="button-48-24">操作</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>
    <gc-model
      width="500px"
      title="新增模板"
      :visible.sync="isShowAddTemplate"
      @close="addTempCloseHandle"
      @comfirm="sentAddTemp"
    >
      <div class="add-temp-container">
        <el-form
          :model="addTempForm"
          :rules="addTempFormRules"
          ref="addTempFormRef"
        >
          <el-form-item label="模板名称" prop="templateName">
            <gc-select
              class="w-200 p0"
              placeholder="模板名称"
              filterable
              k="templateName"
              v="templateCode"
              v-model="selectTemplateName"
              @change="selectTempHandle"
              :options="options"
            ></gc-select>
          </el-form-item>
          <el-form-item prop="udmpId">
            <udmp-upload
              :on-before="fileListChangeBefore"
              :on-sucess="fileListChange"
            >
              <span v-show="uploadFileName" class="ml10 tintColor">{{
                uploadFileName
              }}</span>
            </udmp-upload>
          </el-form-item>
        </el-form>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { downloadFileAsAlink } from '@/util/utils'
import {
  fetchListTemplateManege,
  fetchAddTemplateManege,
  fetchDeleteTemplateManege,
  fetchListTemplateName
} from '@/fetch/templateManament'
import { fileDownload } from '@/util/udmp'
export default {
  name: 'TemplateManagement',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      // 查询表单
      queryForm: {
        templateName: '',
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      // 表格头
      columns: [
        {
          label: '序号',
          type: 'index',
          width: '60'
        },
        {
          label: '模板编码',
          prop: 'templateCode'
        },
        {
          label: '模板名称',
          prop: 'templateName'
        }
      ],
      // 表格数据
      tableList: [],
      // 新增模板表单
      addTempForm: {
        templateCode: '',
        templateName: '',
        udmpId: ''
      },
      // 控制弹窗显示
      isShowAddTemplate: false,
      uploadFileName: '',
      addTempFormRules: {
        templateCode: [requiredHandle('请选择输入模板编码')],
        templateName: [requiredHandle('请选择输入模板名称')],
        udmpId: [requiredHandle('请选择上传模板')]
      },
      selectTemplateName: '',
      options: []
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.getList()
    this.getTemplateList()
  },

  methods: {
    async handleDownloadFile(row) {
      try {
        downloadFileAsAlink(await fileDownload(row.udmpId))
      } catch (error) {}
    },
    // 拉取数据
    async getList() {
      let { total, list } = await fetchListTemplateManege({
        data: this.queryForm
      })
      this.queryForm.total = total
      this.tableList = list
    },
    // 查询数据
    query() {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 重置功能
    resetQuery() {
      this.reset('queryForm')
      this.query()
    },
    /**
     * 重置逻辑
     * @param key String|Array 需要重置的key, 如果为数组，则进行遍历重置
     */
    reset(key) {
      if (!key) return
      if (!Array.isArray(key)) {
        key = [key]
      }
      key.forEach((item) => {
        this[item] = this.$options.data.call(this)[item]
      })
    },
    // 新增操作，显示弹窗
    addTemplateHandle() {
      this.isShowAddTemplate = true
    },
    fileListChangeBefore() {},
    // 组件上传回调
    fileListChange(data, file) {
      let { fileName, udmpId } = data[0]
      this.uploadFileName = fileName
      this.addTempForm.udmpId = udmpId
    },
    // 删除提示
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定删除这个模板？', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject()
          })
      })
    },
    // 删除模板
    async removeTemplateHandle(row) {
      try {
        await this.removeTips()
        await fetchDeleteTemplateManege({
          templateCode: row.templateCode
        })
        this.$data.queryForm.currPage = 1
        this.getList()
      } catch (error) {}
    },
    // 发送新增模板请求
    sentAddTemp() {
      this.$refs.addTempFormRef.validate(async (v) => {
        if (!v) return false
        let data = this.addTempForm
        await fetchAddTemplateManege({ data })
        this.$message.success('新增成功')
        this.addTempCloseHandle()
        this.reset('queryForm')
        this.getList()
      })
    },
    // 弹窗关闭操作
    addTempCloseHandle() {
      this.reset(['uploadFileName', 'selectTemplateName', 'addTempForm'])
      this.isShowAddTemplate = false
    },
    // 下拉列表切换选中的模板
    selectTempHandle(item) {
      if (!item) {
        this.addTempForm.templateCode = ''
        this.addTempForm.templateName = ''
        return
      }
      let { templateName, templateCode } = this.options.find(
        (optItem) => optItem.templateCode === item
      )
      this.addTempForm.templateCode = templateCode
      this.addTempForm.templateName = templateName
    },
    getTemplateList() {
      fetchListTemplateName().then((res) => {
        this.options = res || []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.icons__add {
  border: unset;
}
</style>