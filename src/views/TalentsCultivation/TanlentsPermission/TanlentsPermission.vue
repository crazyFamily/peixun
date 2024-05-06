<template>
  <div class="talents-permission">
    <el-card class="search-card">
      <el-form :model="queryForm" inline ref="querFormRef">
        <el-form-item label="管理员UM/姓名" prop="empInfo">
          <el-input v-model="queryForm.empInfo" placeholder="请输入UM/姓名"></el-input>
        </el-form-item>
        <el-form-item label="潜才角色" prop="roleIds">
          <gc-select :options="roleList" v-model="queryForm.roleIds"> </gc-select>
        </el-form-item>
        <el-form-item label="所在部门" prop="deptIds">
          <gc-institution v-model="queryForm.deptIds" ref="institutionRef" :left-show="false" busi-type="FL" :fetchParams="{ showBusiType: 'FL' }">
          </gc-institution>
        </el-form-item>
        <el-form-item label="机构列表" prop="orgIds">
          <headquarter-tree
            :tree-options="orgTreeOptions"
            :normalizer="normalizer"
            class="tree-container"
            v-model="queryForm.orgIds"
          ></headquarter-tree>
        </el-form-item>
        <el-form-item label="条线列表" prop="lineIds">
          <headquarter-tree
            :tree-options="lineTreeOptions"
            :normalizer="normalizer"
            class="tree-container"
            v-model="queryForm.lineIds"
          ></headquarter-tree>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDatas">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
        <span class="instructor-icons__add" @click="importHandle">
          <i class="instructor-icons__add__icon"></i>
          批量添加权限
        </span>
        <span class="instructor-icons__add" @click="openCreateHandle">
          <i class="instructor-icons__add__icon"></i>
          添加权限
        </span>
        <span class="instructor-icons__del" @click="removePermissionHandle">
          <i class="instructor-icons__del__icon"></i>
          取消权限
        </span>
        <span class="instructor-icons__download" @click="exportHandle">
          <i class="instructor-icons__download__icon"></i>
          导出
        </span>
      </div>
      <table-pagination
        :list="list"
        :tableList="tableList"
        :queryForm="queryForm"
        :getList="getList"
        @selection-change="selectionHandle"
        ref="tablePagination"
      >
        <el-table-column label="操作" min-width="90">
          <template slot-scope="scope">
            <div class="table-options-label">
              <span class="item active" @click="openViewHandle(scope.row)">查看</span>
              <span class="item active" @click="openEditHandle(scope.row)">配置</span>
            </div>
          </template>
        </el-table-column>
      </table-pagination>
    </el-card>

    <!-- 批量添加 -->
    <CompTanlentsUpload
      :show.sync="isUploadShow"
      @comfirm="importSuccessHandle"
      :export-fetch="fetchExportFailedUser"
    >
    </CompTanlentsUpload>
  </div>
</template>

<script>
import CompTanlentsUpload from './CompTanlentsUpload.vue'
import { addAllowKeepAlive, CopyObj } from '@/util/utils'
import { fetchQCAuthList, fetchExportQCAuthList, fetchRemoveQCAuths, fetchQCSotreQryParam, fetchExportFailedUser, fetchImportUser } from '@/fetch/tanlents'
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import TanlentsUpload from '../components/TanlentsUpload.vue'
import store from '@/store'
export default {
  name: 'TanlentsPermission',

  props: {},

  data() {
    return {
      queryForm: {
        roleIds: '',
        deptIds: [],
        empInfo: '',
        lineIds: null,
        orgIds: null,
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      // 角色选项
      roleList: [],
      yearsList: [],
      projectTypeList: [],
      orgList: [],
      lineList: [],
      list: [
        {
          type: 'selection'
        },
        {
          label: 'UM账号',
          prop: 'um'
        },
        {
          label: '姓名',
          prop: 'umName'
        },
        {
          label: '潜才角色',
          prop: 'roleName'
        },
        {
          label: '所在部门',
          prop: 'dept'
        },
        {
          label: '条线列表',
          prop: 'lineName'
        },
        {
          label: '机构列表',
          prop: 'orgName'
        },
        {
          label: '更新人',
          prop: 'updatedByStr'
        },
        {
          label: '更新日期',
          prop: 'updatedDateStr'
        },
      ],
      orgTreeOptions: [],
      normalizer(node) {
        return {
          id: node.qCCode,
          label: node.qCMsg,
          children: node.subLine
        }
      },
      lineTreeOptions: [],
      tableList: [],
      selectedList: [],
      isUploadShow: false,
      uploadTableColumns: [
        {label: 'UM账号', prop: ''},
        {label: '姓名', prop: ''},
        {label: '潜才角色', prop: ''},
        {label: '条线', prop: ''},
        {label: '机构', prop: ''},
        {label: '失败原因', prop: ''}
      ],
      fetchExportFailedUser
    }
  },

  components: {
    HeadquarterTree,
    TanlentsUpload,
    CompTanlentsUpload
  },

  computed: {},

  mounted() {
    this._getSeachDatas()
    this.queryDatas()
  },

  activated() {
    if(store.getters.getRefreshQueue.find(row => row === this.$route.path)) {
      this.queryDatas()
    }
  },

  methods: {
    // 获取查询条件的下拉列表
    async _getSeachDatas() {
      let data = { tip: 'Y' }
      let { projectType, orgs, lines, role } = await fetchQCSotreQryParam({
        data
      })

      // 数据格式化处理
      this.roleList = role.map((item) => ({
        label: item.qCMsg,
        value: item.qCCode
      }))
      this.projectTypeList = projectType.map((item) => ({
        label: item.qCMsg,
        value: item.qCCode
      }))
      this.orgTreeOptions = this._formatTreeData(orgs)
      this.lineTreeOptions = this._formatTreeData(lines)
    },
    queryDatas() {
      this.queryForm.currPage = 1
      this.getList()
      store.commit('removeQueue', this.$route.path)
    },
    // 请求参数格式化
    _formatParams(params) {
      let res = CopyObj(params)
      res.roleIds = res.roleIds ? [res.roleIds] : []
      res.lineIds = res.lineIds ? [res.lineIds] : []
      res.orgIds = res.orgIds ? [res.orgIds] : []
      res.deptIds = res.deptIds.length ? [res.deptIds[res.deptIds.length - 1]] : []
      return res
    },
    async getList() {
      let data = this._formatParams(this.queryForm)
      let { list, total } = await fetchQCAuthList({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    reset() {
      this.$refs.querFormRef.resetFields()
      this.$refs.institutionRef.createTreeData()
      this.queryDatas()
    },
    selectionHandle(list) {
      this.selectedList = list
    },
    openViewHandle(row) {
      this._toDetailHandle('view', row.id)
    },
    openEditHandle(row) {
      this._toDetailHandle('edit', row.id)
    },
    openCreateHandle() {
      this._toDetailHandle('create')
    },
    _toDetailHandle(type = 'create', id) {
      let { path, name } = this.$router.getRoutes().find((item) => item.path === '/AddTanlentsPermission')
      addAllowKeepAlive(path)
      const params = { type, id }
      this.$router.push({ name, params })
    },
    async removePermissionHandle() {
      if (!this.selectedList.length) return this.$message.warning('请先选择一项')
      let ids = this.selectedList.map((item) => item.id)
      await this.removeTips()
      await fetchRemoveQCAuths({ ids })
      this.$message.success('已取消所选权限')
      this.queryDatas()
    },
    // 删除操作的二次提示
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定取消所选用户权限', '提示', {
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
    // 树级数据处理
    _formatTreeData(treeData) {
      for (let i = 0, j = treeData.length; i < j; i++) {
        if (Array.isArray(treeData[i].subLine) && treeData[i].subLine.length) {
          treeData[i].subLine = this._formatTreeData(treeData[i].subLine)
        } else {
          Reflect.deleteProperty(treeData[i], 'subLine')
        }
      }
      return treeData
    },
    // 批量添加
    importHandle() {
      this.isUploadShow = true
    },
    // 批量的请求成功回调
    async importSuccessHandle(sucessList, branchId) {
      this.isUploadShow = false
      await fetchImportUser({ sucessList, branchId })
      this.queryDatas()
    },
    // 导出
    async exportHandle() {
      const data = this._formatParams(this.queryForm)
      await fetchExportQCAuthList({ data })
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.form-item-df {
  :deep(.el-form-item__content) {
    display: inline-flex;
    align-items: center;
  }
}

.long-content {
  :deep(.el-form-item__content) {
    max-width: calc(100% - 180px);
  }
}
</style>