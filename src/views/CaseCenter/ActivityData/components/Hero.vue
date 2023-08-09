<template>
  <div class="CaseCenter__ActivityData__Activity">
    <!-- 搜索 card -->
    <el-card class="search-form-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="所属片区">
          <el-input
            v-model="queryForm.areaName"
            placeholder="请输入所属片区"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属分行">
          <el-input
            v-model="queryForm.subBranchName"
            placeholder="请输入所属分行"
          ></el-input>
        </el-form-item>
        <el-form-item label="英雄信息">
          <el-input
            v-model="queryForm.umOrName"
            placeholder="输入英雄UM/姓名"
          ></el-input>
        </el-form-item>
        <div class="buttons">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="reset" class="button-w80-h30">重置</el-button>
          <el-button @click="downCase" class="button-w80-h30">导出</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="addHeroVisible = true">
          <i class="instructor-icons__add__icon"></i>
          新增</span
        >
        <span
          class="instructor-icons__download"
          @click="heroImportVisible = true"
        >
          <i class="instructor-icons__download__icon"></i>
          批量导入
        </span>
        <span class="instructor-icons__del" @click="del">
          <i class="instructor-icons__del__icon"></i>
          删除</span
        >
      </div>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        ref="tablePagination"
      >
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <span class="active" @click="updateState(scope.row)">
              {{ scope.row.ifValid === 'Y' ? '无效' : '有效' }}
            </span>
            <span class="active ml20" @click="openEdit(scope.row)">编辑</span>
            <span class="active ml20" @click="del(scope.row)">删除</span>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 新增案例英雄 -->
    <gc-model
      width="600px"
      title="新增案例英雄"
      :visible.sync="addHeroVisible"
      @close="addHeroClose"
      @comfirm="addHeroComfirm"
    >
      <el-form
        class="content-form mr40"
        ref="addForm"
        :model="formData"
        :rules="formRules"
        label-width="140px"
      >
        <div class="df">
          <el-form-item label="UM号" class="ws dr-label" prop="umId">
            <el-input
              v-model="formData.umId"
              placeholder="请输入UM号"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" class="ws dr-label" prop="umName">
            <el-input v-model="formData.umName"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="条线" prop="blgStripLine">
          <el-input
            v-model="formData.blgStripLine"
            placeholder="请填写条线"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属片区" prop="areaName">
          <el-input
            v-model="formData.areaName"
            placeholder="请填写所属片区"
          ></el-input>
        </el-form-item>
        <el-form-item label="一级分行名称/分中心" prop="subBranchName">
          <el-input
            v-model="formData.subBranchName"
            placeholder="请填写一级分行名称/分中心"
          ></el-input>
        </el-form-item>
        <el-form-item label="二级分行名称/分中心">
          <el-input
            v-model="formData.twoBranchName"
            placeholder="请填写二级分行名称/分中心"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="orgName">
          <el-input
            v-model="formData.orgName"
            placeholder="请填写部门"
          ></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="position">
          <el-input
            v-model="formData.position"
            placeholder="请填写岗位"
          ></el-input>
        </el-form-item>
        <el-form-item label="预获英雄荟奖项" prop="heroPrize">
          <el-input
            type="textarea"
            resize="none"
            class="h-90"
            maxlength="200"
            show-word-limit
            v-model="formData.heroPrize"
            placeholder="请填写预获英雄荟奖项"
          ></el-input>
        </el-form-item>
      </el-form>
    </gc-model>

    <!-- 导入英雄名单 -->
    <InstructorBatchImport
      title="导入英雄名单"
      :visible.sync="heroImportVisible"
      @change="heroImportChange"
      @templateDownload="downloadAdapter({ templateCode: 'HERO_USERS' })"
      @comfirm="heroImportComfirm"
      @close="heroImportClose"
    >
      <div v-if="heroImportData.title">
        <p>
          {{ heroImportData.title }}
        </p>
       <p
          v-for="error in heroImportData.failStrList"
          :key="error"
          class="error-color"
        >
          {{ error }}
        </p>
      </div>
    </InstructorBatchImport>
  </div>
</template>

<script>
import { resetObj, filterObj, merge, downloadAdapter } from '@/util/utils'
import { fetchUserInfos } from '@/fetch/public'
import {
  fetchListAreaOrg,
  fetchHeroUsers,
  fetchExportHeroUsers,
  fetchUpdateHeroUserIfValid,
  fetchFindHeroUserDetail,
  fetchUpdateHeroUser,
  fetchDeleteHeroUser,
  fetchSaveHeroUser,
  fetchBatchImportHeroUsers,
  fetchSaveHeroUserBatch
} from '@/fetch/caseCenter'
import { handlePickerOptions, loadingMixin } from '@/mixins/component'
export default {
  mixins: [handlePickerOptions, loadingMixin],
  data() {
    return {
      queryForm: {
        areaName: '',
        subBranchName: '',
        umOrName: '',
        total: 0,
        currPage: 1,
        pageSize: 10
      },
      areaList: [],
      branchList: [],
      list: [
        { type: 'selection' },
        { label: '序号', type: 'index' },
        { label: '姓名', prop: 'umName' },
        { label: 'UM号', prop: 'umId', width: '140' },
        { label: '条线', prop: 'blgStripLine' },
        { label: '所属片区', prop: 'areaName' },
        { label: '所属一级分行/分中心', prop: 'subBranchName', width: '160' },
        { label: '所属二级分行/分中心', prop: 'twoBranchName', width: '160' },
        { label: '部门', prop: 'orgName' },
        { label: '岗位', prop: 'position' },
        { label: '英雄荟预获奖项', prop: 'heroPrize', width: '140' },
        { label: '创建时间', prop: 'createdDate', width: '140' },
        {
          label: '状态',
          prop: 'ifValid',
          ctx: (row) => (row.ifValid === 'Y' ? '有效' : '无效')
        }
      ],
      tableList: [],
      heroImportVisible: false,
      heroImportData: {
        title: '',
        failStrList: [],
        failUsers: [],
        succeUsers: []
      },
      downloadAdapter,
      addHeroVisible: false,
      formData: {
        umId: '',
        umName: '',
        blgStripLine: '',
        areaName: '',
        subBranchName: '',
        twoBranchName: '',
        orgName: '',
        position: '',
        heroPrize: '',
        id: ''
      },
      formRules: {
        umId: [{ required: true, trigger: 'blur', message: '请输入UM号' }],
        umName: [{ required: true, trigger: 'blur', message: '请输入姓名' }],
        blgStripLine: [
          { required: true, trigger: 'blur', message: '请填写条线' }
        ],
        areaName: [
          { required: true, trigger: 'blur', message: '请填写所属片区' }
        ],
        subBranchName: [
          {
            required: true,
            trigger: 'blur',
            message: '请填写一级分行名称/分中心'
          }
        ],
        orgName: [{ required: true, trigger: 'blur', message: '请填写部门' }],
        position: [{ required: true, trigger: 'blur', message: '请填写岗位' }],
        heroPrize: [
          { required: true, trigger: 'blur', message: '请填写预获英雄荟奖项' }
        ]
      },
      ums: []
    }
  },
  methods: {
    query() {
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getList()
    },
    reset() {
      resetObj(this.queryForm, { currPage: 1, pageSize: 10 })
      this.getList()
    },
    getList() {
      const condition = filterObj(this.queryForm)
      fetchHeroUsers({ condition }).then((res) => {
        const { list, total } = res
        this.tableList = list
        this.queryForm.total = total
      })
    },
    downCase() {
      const condition = filterObj(this.queryForm)
      Reflect.deleteProperty(condition, 'total')
      Reflect.deleteProperty(condition, 'currPage')
      Reflect.deleteProperty(condition, 'pageSize')
      fetchExportHeroUsers({ condition })
    },
    updateState(row) {
      fetchUpdateHeroUserIfValid({ id: row.id }).then((_) => {
        this.$message.success('英雄状态更新成功')
        this.getList()
      })
    },
    openEdit(row) {
      fetchFindHeroUserDetail({ id: row.id }).then((data) => {
        merge(this.formData, data)
        this.addHeroVisible = true
      })
    },
    del(row) {
      let idList
      if (row.id) {
        idList = [row.id]
      } else {
        idList = this.$refs.tablePagination.getSelection().map((v) => v.id)
        if (!idList.length) return this.$message.warning('请先选择英雄')
      }
      fetchDeleteHeroUser({ idList }).then((_) => {
        this.$message.success('删除成功')
        this.getList()
      })
    },

    heroImportChange($event) {
      const file = $event.target.files[0]
      if (!file.name) {
        this.heroImportData = {}
        return
      }
      const data = new FormData()
      data.append('file', file)
      fetchBatchImportHeroUsers(data).then((res) => {
        this.heroImportData = res
      })
    },
    heroImportComfirm() {
      const heroList = this.heroImportData.succeUsers
      if (heroList.length) {
        fetchSaveHeroUserBatch({ heroList }).then((_) => {
          this.$message.success('批量导入成功')
          this.getList()
        })
      }
      this.heroImportVisible = false
    },
    heroImportClose() {
      this.heroImportData = {}
      this.heroImportVisible = false
    },
    addHeroClose() {
      resetObj(this.formData)
      this.addHeroVisible = false
      this.$nextTick(() => {
        this.$refs.addForm.clearValidate()
      })
    },
    addHeroComfirm() {
      this.$refs.addForm.validate((valied) => {
        if (!valied) return
        const condition = filterObj(this.formData)
        if (this.formData.id) {
          fetchUpdateHeroUser({ condition }).then((_) => {
            this.$message.success('修改成功')
            this.getList()
            this.addHeroVisible = false
          })
        } else {
          fetchSaveHeroUser({ condition }).then((_) => {
            this.$message.success('新增成功')
            this.getList()
            this.addHeroVisible = false
          })
        }
      })
    },
    async umQuerySearch(queryString) {
      if (!queryString) {
        this.ums = []
        return
      }
      const data = { empName: queryString, pageSize: '20' }
      let res = await fetchUserInfos({ data })
      this.ums = res.list.map((item) => {
        return {
          ...item,
          labelName: `${item.empName}(${item.umId})`
        }
      })
    },
    umSelectHandle(value) {
      if (!value) return
      this.formData.umName = this.ums.find(
        (item) => item.umId === value
      )?.empName
    },
    getArea() {
      fetchListAreaOrg().then((res) => {
        const { areaList = [], branchList = [] } = res
        this.areaList = areaList
        this.branchList = branchList
      })
    }
  },

  mounted() {
    this.getArea()
  }
}
</script>

<style lang="scss" scoped></style>
