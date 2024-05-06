<template>
  <div class="system-management__role-application">
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="机构分类">
          <el-select v-model="queryForm.roleType" placeholder="全部">
            <el-option
              v-for="item in instiOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click.stop="addMore">新增</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <gc-table
        class="general__table table-center"
        :list="titleList"
        :tableList="instiTitleList"
      >
        <template>
          <el-table-column
            min-width="20%"
            label="机构分类"
            style="text-align: right"
          >
            <template slot-scope="scope">
              <span>{{ getRoleName(scope.row.roleType) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="20%" label="审批链角色">
            <template slot-scope="scope">
              <span>{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="20%" label="是否为自定义角色">
            <template slot-scope="scope">
              <span>{{ scope.row.isCustomized == 'Y' ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="20%" label="操作">
            <template slot-scope="scope">
              <div>
                <span
                  class="active operation__edit"
                  @click.stop="editNew(scope.row)"
                  style="margin-right: 25px; top: 0"
                ></span>
                <span
                  class="active operation__del-disabled"
                  @click="delOption(scope.row)"
                ></span>
              </div>
            </template>
          </el-table-column>
        </template>
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getMenuList)"
        @currentChange="currentChange($event, queryForm, getMenuList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>
    <!-- 新增/修改弹框 -->
    <gc-model
      :title="disabled ? '修改审批链角色名称' : '新增审批链角色'"
      width="1120px"
      :visible="addApprovalRole"
      @close="addApprovalRole = false"
      @cancel="addApprovalRole = false"
      @comfirm="confirm"
    >
      <div class="search-card system-management__role-application__search-card">
        <!-- 新增表单 -->
        <template v-if="!disabled">
          <el-form
            ref="form"
            :model="addApprovalForm"
            :inline="true"
            @submit.native.prevent
          >
            <el-form-item class="mt10" label="机构分类">
              <el-select v-model="addApprovalForm.roleType" placeholder="全部">
                <el-option
                  v-for="item in instiOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                  :disabled="disabled"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-form ref="form" :model="addApprovalForm" :inline="true">
            <el-form-item>
              <gc-input
                class="approval-title"
                label="审批链角色名称"
                v-model="addApprovalForm.roleName"
              ></gc-input>
            </el-form-item>
          </el-form>
        </template>
        <!-- 修改审批链角色名称 -->
        <template v-else>
          <div
            class="search-card system-management__role-application__search-card"
          >
            <el-form ref="form" :model="newEditForm" :inline="true">
              <el-form-item class="mt10" label="机构分类">
                <el-input
                  v-model="newEditForm.roleType"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <el-form ref="form" :model="newEditForm" :inline="true">
            <el-form-item>
              <gc-input
                class="approval-title"
                label="审批链角色名称"
                v-model="newEditForm.roleName"
              ></gc-input>
            </el-form-item>
          </el-form>
        </template>
      </div>
    </gc-model>
  </div>
</template>

<script>
import { CopyObj, currentChange, jsonHeaders } from '@/util/utils'
export default {
  name: 'ApprovalRoleManagement',
  data() {
    return {
      total: 0,
      queryForm: {
        roleType: '',
        currPage: 1,
        pageSize: 10
      },
      insClass: '全部',
      instiOptions: [
        {
          value: '1',
          label: '分行'
        },
        {
          value: '2',
          label: '片区'
        },
        {
          value: '3',
          label: '零售业务支持部'
        },
        {
          value: '4',
          label: '总行其他部门'
        },
        {
          value: '5',
          label: '信用卡'
        },
        {
          value: '6',
          label: '汽融'
        }
      ],
      instiTitleList: [],
      titleList: [
        {
          type: 'index',
          label: '序号'
        }
      ],
      addApprovalForm: {
        roleType: '',
        roleName: ''
      },
      addApprovalRole: false,
      currentChange,
      newEditForm: {
        roleType: '',
        roleName: ''
      },
      roleId: '',
      disabled: false
    }
  },
  methods: {
    confirm() {
      // 修改
      if (this.disabled) {
        this.editConfirm()
      } else {
        // 增加
        this.approvalRoleConfirm()
      }
    },
    addMore() {
      this.addApprovalRole = true
      this.addApprovalForm.roleType = ''
      this.disabled = false
      this.addApprovalForm.roleName = ''
    },
    // 修改审批链角色名称
    editNew(row) {
      this.disabled = true
      this.addApprovalRole = true
      this.this.newEditForm.roleType = this.getRoleName(row.roleTyp)
      this.roleId = row.roleId
      this.newEditForm.roleName = row.roleName
    },
    // 搜索查询
    query() {
      this.queryForm.currPage = 1
      this.getMenuList()
    },
    // 新增审批链角色
    approvalRoleConfirm() {
      if (
        [this.addApprovalForm.roleType, this.addApprovalForm.roleName].includes(
          ''
        )
      ) {
        this.$message('请正确填写')
        return
      }
      const data = CopyObj(this.addApprovalForm)
      this.$axios
        .post('/fn/system/func/addEoaChainRoleName', { data }, jsonHeaders)
        .then((res) => {
          this.$message.success('新增成功')
          this.addApprovalRole = false
          this.getMenuList()
        })
    },
    // 获取列表
    getMenuList() {
      const data = CopyObj(this.queryForm)
      this.$axios
        .post('/fn/system/func/listEoaChainRoleName', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.instiTitleList = data.list
            this.total = data.total
          }
        })
    },
    // 修改审批链角色
    editConfirm() {
      let roleId = this.roleId,
        roleName = this.newEditForm.roleName,
        subForm = { roleId, roleName }
      const data = CopyObj(subForm)
      if (this.newEditForm.roleName == '') {
        this.$message('审批链角色名称不能为空')
        return
      }
      this.$axios
        .post('/fn/system/func/modifyEoaChainRoleName', { data }, jsonHeaders)
        .then((res) => {
          this.$message.success('修改成功')
          this.addApprovalRole = false
          this.getMenuList()
        })
    },

    // 删除
    delOption(row) {
      if (row.isCustomized === 'N') {
        return this.$message.warning('此用户角色暂时不能删除')
      }
      this.$alert('确定删除此审批链角色？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const { roleId } = row
            this.$axios
              .post(
                '/fn/system/func/deleteEoaChainRoleName',
                { roleId },
                jsonHeaders
              )
              .then((res) => {
                const { code } = res.data
                if (code === 0) {
                  this.$message.success('删除成功')
                  this.getMenuList()
                }
              })
          }
        })
        .catch((err) => err)
    },
    getRoleName(roleType) {
      switch (roleType) {
        case '1':
          return '分行'
        case '2':
          return '片区'
        case '3':
          return '零售业务支持部'
        case '4':
          return '总行其他部门'
        case '5':
          return '信用卡'
        case '6':
          return '汽融'
        default:
          return ''
      }
    }
  },
  addMore() {
    this.addApprovalRole = true
    this.addApprovalForm.roleType = ''
    this.disabled = false
    this.addApprovalForm.roleName = ''
  },
  // 修改审批链角色名称
  editNew(row) {
    this.disabled = true
    this.addApprovalRole = true
    this.newEditForm.roleType = this.getRoleName(row.roleType)
    this.roleId = row.roleId
    this.newEditForm.roleName = row.roleName
  },
  // 搜索查询
  query() {
    this.queryForm.currPage = 1
    this.getMenuList()
  },
  // 新增审批链角色
  approvalRoleConfirm() {
    if (
      [this.addApprovalForm.roleType, this.addApprovalForm.roleName].includes(
        ''
      )
    ) {
      this.$message('请检查机构或角色是否完整')
      return
    }
    const data = CopyObj(this.addApprovalForm)
    this.$axios
      .post('/system/func/addEoaChainRoleName', { data }, jsonHeaders)
      .then((res) => {
        this.$message.success('新增成功')
        this.addApprovalRole = false
        this.getMenuList()
      })
  },
  // 获取列表
  getMenuList() {
    const data = CopyObj(this.queryForm)
    this.$axios
      .post('/system/func/listEoaChainRoleName', data, jsonHeaders)
      .then((res) => {
        const { code, data } = res.data
        if (code === 0) {
          this.instiTitleList = data.list
          this.total = data.total
        }
      })
  },
  // 修改审批链角色
  editConfirm() {
    let roleId = this.roleId,
      roleName = this.newEditForm.roleName,
      subForm = { roleId, roleName }
    const data = CopyObj(subForm)
    if (this.newEditForm.roleName == '') {
      this.$message('审批链角色名称不能为空')
      return
    }
    this.$axios
      .post('/system/func/modifyEoaChainRoleName', { data }, jsonHeaders)
      .then((res) => {
        this.$message.success('修改成功')
        this.addApprovalRole = false
        this.getMenuList()
      })
  },

  // 删除
  delOption(row) {
    if (row.isCustomized === 'N') {
      return this.$message.warning('此用户角色暂时不能删除')
    }
    this.$alert('确定删除此审批链角色？', '提示', {
      confirmButtonText: '确定',
      showCancelButton: true,
      cancelButtonClass: 'cancel',
      customClass: `loginTimeout`
    })
      .then((valied) => {
        if (valied === 'confirm') {
          const { roleId } = row
          this.$axios
            .post(
              '/system/func/deleteEoaChainRoleName',
              { roleId },
              jsonHeaders
            )
            .then((res) => {
              const { code } = res.data
              if (code === 0) {
                this.$message.success('删除成功')
                this.getMenuList()
              }
            })
        }
      })
      .catch((err) => err)
  },
  mounted() {
    this.getMenuList()
  }
}
</script>

<style lang="scss">
.system-management__role-application {
  .search-card .el-input {
    padding-top: 0px;
    width: 200px;
  }
  &__search-card {
    .el-input {
      width: 200px;
    }
  }
  .table-center {
    th,
    td {
      .cell {
        padding-left: 0 !important;
        text-align: center !important;
      }
    }
  }
  .approval-title {
    padding: 25px 0 0 5px;
  }
}
</style>