<template>
  <div class="system-management__role-application">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item class="first-item" label="机构">
          <gc-institution v-model="queryForm.busiType"> </gc-institution>
          <el-checkbox class="ml10" v-model="queryForm.isGotSubBranch"
            >含下属机构</el-checkbox
          >
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="queryForm.roleId">
            <el-option
              v-for="item in roleOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="mr20">
          <gc-input label="申请人UM" v-model="queryForm.umId"></gc-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="system-management__role-application__content mt10">
      <div class="instructor-icons menu-right">
        <div class="" @click="addRole">
          <span class="instructor-icons__add">
            <i class="instructor-icons__add__icon"></i>
            角色申请</span
          >
        </div>
      </div>
      <gc-table
        :list="roleList"
        :tableList="roleTableList"
        class="
          system-management__role-application__content__table
          general__table
        "
      >
        <el-table-column min-width="96" prop="applyDesc">
          <template slot="header">
            <gc-tablecolumnfilters
              label="审批状态"
              ref="tablecolumnfiltersCate"
              className="table__screen__icon"
              :list="expenseStatus"
              confirmText="确定"
              popperClass="circular m183"
              @filter="tableFilter"
              @reset="tableReset"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="110">
          <template slot-scope="scope">
            <div class="">
              <span class="active mr20" @click="delRole(scope.row)">删除</span>
              <template v-if="scope.row.roleTip">
                <span
                  class="active"
                  @click="passRole(scope.row)"
                  v-if="scope.row.applyStatus === '02001'"
                  >通过</span
                >
                <span v-else class="shallow">通过</span>
              </template>
            </div>
          </template>
        </el-table-column>
      </gc-table>
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getRoleList)"
        @currentChange="currentChange($event, queryForm, getRoleList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 添加角色 弹窗 -->
    <gc-model
      title="新增角色"
      width="1120px"
      :visible="addRoleVisible"
      :isAppend="true"
      @close="addRoleVisible = false"
      @cancel="addRoleVisible = false"
      @comfirm="addRoleConfirm"
    >
      <div class="search-card system-management__role-application__search-card">
        <el-form
          ref="form"
          :model="addRoleForm"
          :inline="true"
          @submit.native.prevent
        >
          <el-form-item class="mt10" label="机构">
            <gc-institution
              ref="institution"
              orgUrl="/fn/user/selectAllTree"
              v-model="addRoleForm.busiType"
              @change="institutionChange"
            >
            </gc-institution>
          </el-form-item>
          <el-form-item class="mt10" label="角色">
            <el-select v-model="addRoleForm.roleIds" multiple>
              <el-option
                v-for="item in roleOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="title mt20">
        <div class="title__menu"></div>
        申请人
      </div>
      <gc-table
        :list="addRoleList"
        :tableList="addRoleTableList"
        class="
          system-management__role-application__add-role__table
          general__table
          mt20
        "
      >
        <el-table-column label="申请人" min-width="302px">
          <template slot-scope="scope">
            <div class="df">
              <el-input
                v-model.trim="scope.row.umId"
                @input="input(scope.row)"
              ></el-input>
              <el-button
                class="button-60-h30 ml10"
                type="primary"
                @click="checkUm(scope.row)"
                >{{ scope.row.text }}</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="empName"
          label="姓名"
          min-width="300px"
        ></el-table-column>
        <el-table-column
          prop="orgName"
          label="机构"
          min-width="280px"
        ></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <div class="">
              <span class="active mr10" @click="handleAddRole">添加</span>
              <span class="active" @click="handleDelRole(scope.$index)"
                >删除</span
              >
            </div>
          </template>
        </el-table-column>
      </gc-table>
      <div class="title mt20">
        <div class="title__menu"></div>
        审批链
      </div>
      <ApprovalChain
        class="mt20"
        ref="approvalChain"
        @confirm="approvalChainConfirm"
        v-model="addRoleForm.approvalChainValue"
      />
    </gc-model>
  </div>
</template>

<script>
import _ from 'lodash'
import { handlePickerOptions } from '../../mixins/component'
import ApprovalChain from '@/components/ApprovalChain.vue'
import {
  sizeChange,
  currentChange,
  CopyObj,
  jsonHeaders,
  blgStripLineMaping,
  resetObj,
  throttle
} from '../../util/utils'
export default {
  name: 'SystemManagementApplication',
  mixins: [handlePickerOptions],
  data() {
    return {
      total: 0,
      // 查询 提交的 表单
      queryForm: {
        // 条线分类
        busiType: [],
        // 机构id
        orgId: '',
        // 角色id
        roleId: '',
        umId: '',
        isGotSubBranch: false,
        // 审批状态
        applyStatus: '',
        pageSize: 10,
        currPage: 1
      },
      // 角色设置数组
      roleOptions: [],
      // 角色表格字段数组
      roleList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '申请人',
          prop: 'umId',
          width: '130'
        },
        {
          label: '创建人',
          prop: 'createdBy',
          width: '90'
        },
        {
          label: '所属机构',
          prop: 'orgName',
          width: '300'
        },
        {
          label: '类型',
          prop: 'busiTypeName',
          width: '60'
        },
        {
          label: '审批链',
          prop: 'auditUsersUm',
          width: '300'
        },
        {
          label: '角色名称',
          prop: 'roleName',
          width: '100'
        }
      ],
      // 角色表格 数据 数组
      roleTableList: [],
      // 页面变化函数
      sizeChange,
      currentChange,
      // 新增角色 dialog 是否显示
      addRoleVisible: false,
      // 新增角色 字段列表
      addRoleList: [
        {
          type: 'index',
          label: '序号',
          width: '64'
        }
      ],
      // 新增角色 数据列表
      addRoleTableList: [],
      // 新增角色 form
      addRoleForm: {
        approvalChainValue: '',
        // 条线分类
        busiType: [],
        // 机构id
        orgId: '',
        // 角色id
        roleIds: []
      },
      // 审批状态 选项数组
      expenseStatus: [
        {
          label: '未提交',
          value: '02000'
        },
        {
          label: '审批中',
          value: '02001'
        },
        {
          label: '已通过',
          value: '02002'
        },
        {
          label: '已退回',
          value: '02003'
        },
        {
          label: '已撤回',
          value: '02004'
        }
      ]
    }
  },
  methods: {
    // 查询角色
    query() {
      this.queryForm.currPage = 1
      this.getRoleList()
    },
    // 重置查询
    reset() {
      this.queryForm.busiType = [this.$store.state.userInfo.blgStripLine]
      this.queryForm.orgId = ''
      this.queryForm.roleId = ''
      this.queryForm.umId = ''
      this.queryForm.currPage = 1
      this.queryForm.pageSize = 10
      this.getRoleList()
    },
    // 处理queryForm
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      if (data.busiType.length > 1) {
        data.orgId = data.busiType.slice(-1)[0]
        data.busiType = data.busiType[0]
      } else {
        data.busiType = data.busiType[0]
        data.orgId = ''
      }
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      return data
    },
    // 初始化获取  下拉 角色 列表
    getRoleOptions(queryForm) {
      queryForm = queryForm || this.queryForm
      const busiType =
        queryForm.busiType[0] || this.$store.state.userInfo.blgStripLine
      return this.$axios
        .post(
          '/fn/system/roleApply/listSelectRole',
          { busiType, oprType: 'all' },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.roleOptions = data.map((v) => ({
              label: v.roleName,
              value: v.roleId
            }))
          }
        })
    },
    // 初始化 用户um
    initStripe() {
      if (!this.queryForm.busiType.length) {
        if (!this.$store.state.userInfo.blgStripLine) {
          setTimeout(() => {
            this.initStripe()
          }, 500)
        } else {
          this.queryForm.busiType.push(this.$store.state.userInfo.blgStripLine)
          this.getRoleOptions()
          this.getRoleList()
        }
      }
    },
    // 获取角色 表格列表
    getRoleList() {
      const data = this.getQueryForm()
      this.$axios
        .post('/fn/system/roleApply/listApply', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.roleTableList = data.list
            this.total = data.total
          }
        })
    },
    // 重置 新增角色 数据
    resetUploadObj() {
      resetObj(this.addRoleForm)
      this.$refs.approvalChain?.clearInput()
      this.addRoleForm.auditUsers = ''
      this.addRoleForm.auditUsersUm = ''
      this.addRoleForm.auditUsersName = ''
    },
    // 新增角色
    addRole() {
      this.addRoleVisible = true
      this.$refs.institution?.clear()
      this.resetUploadObj()
      this.addRoleTableList = [
        {
          umId: '',
          orgName: '',
          empName: '',
          text: '检查',
          roleIds: []
        }
      ]
    },
    // 删除角色
    delRole(row) {
      this.$alert('确定删除此角色？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const { umId, id, roleId, orgId, busiType } = row
            this.$axios
              .post(
                '/fn/system/roleApply/roleToFreeze',
                { data: { umId, id, roleId, orgId, busiType } },
                jsonHeaders
              )
              .then((res) => {
                const { code } = res.data
                if (code === 0) {
                  this.$message.success('删除成功')
                  this.getRoleList()
                }
              })
          }
        })
        .catch((err) => err)
    },
    // 添加 新增角色
    handleAddRole() {
      this.addRoleTableList.push({
        umId: '',
        orgName: '',
        empName: '',
        text: '检查',
        roleIds: []
      })
    },
    // 删除 新增角色
    handleDelRole(index) {
      if (this.addRoleTableList.length > 1) {
        this.addRoleTableList.splice(index, 1)
      }
    },
    // 检查um
    checkUm(row) {
      if (row.text === '已检查') return
      if (!row.umId) return this.$message.warning('请先填写um账号')
      if (this.addRoleForm.busiType.length < 2)
        return this.$message.warning('请选择机构')
      const { roleIds } = this.addRoleForm
      if (!roleIds.length) {
        return this.$message.warning('请选择角色')
      }
      const alreadyPerson = this.addRoleTableList.filter(
        (v) => v.umId === row.umId.toUpperCase()
      )
      const alreadyInspectionPerson = alreadyPerson.filter((v) => v.empName)
      if (alreadyInspectionPerson.length >= 1 && alreadyPerson.length >= 2) {
        return this.$alert(`${row.umId} 重复`, '提示', {
          confirmButtonText: '确定',
          customClass: `loginTimeout`
        })
      }
      const orgId = this.addRoleForm.busiType.slice(-1)[0]
      const busiType = this.addRoleForm.busiType[0]
      const data = {
        umId: row.umId,
        busiType,
        orgId,
        roleIds
      }
      this.$axios
        .post('/fn/system/roleApply/checkRoleApplyByUm', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            _.merge(row, data)
            row.text = '已检查'
          }
        })
    },
    // 审批链 确认事件
    approvalChainConfirm(data) {
      _.merge(this.addRoleForm, data)
    },
    // 处理 申请角色 form 表单数据
    handleAddRoleForm() {
      const data = CopyObj(this.addRoleForm)
      if (data.busiType.length > 1) {
        data.orgId = data.busiType.slice(-1)[0]
        data.busiType = data.busiType[0]
      } else if (data.busiType.length > 0) {
        this.$message.warning('请选择机构')
        return
      } else {
        this.$message.warning('请选择条线')
        return
      }
      if (!data.roleIds.length) {
        this.$message.warning('请选择角色')
        return
      }
      const notInspectionPerson = this.addRoleTableList.findIndex(
        (v) => v.text === '检查'
      )
      if (notInspectionPerson + 1 > 0) {
        this.$message.warning(`第${notInspectionPerson + 1}行未检查`)
        return
      }
      const person = this.addRoleTableList.filter((v) => v.orgId)
      if (person.length < 1) {
        this.$message.warning('请填写申请人')
        return
      }
      if (!data.approvalChainValue) {
        this.$message.warning('请填写审批人')
        return
      }
      if (!data.auditUsers) {
        this.$message.warning('请查询并确认审批链')
        return
      }
      const {
        roleIds,
        busiType,
        orgId,
        orgName,
        auditUsers,
        auditUsersUm,
        auditUsersName
      } = data
      const employeeList = person.map((v) => {
        const { umId, empName, blgOrgId, blgOrgName, blgStripLine } = v
        return {
          umId,
          empName,
          blgOrgId: orgId,
          blgOrgName: orgName,
          blgStripLine: busiType
        }
      })
      return {
        busiType,
        busiTypeName: blgStripLineMaping[busiType],
        roleIds,
        orgId,
        orgName,
        auditUsers,
        auditUsersUm,
        auditUsersName,
        employeeList
      }
    },
    // 机构
    institutionChange(orgName) {
      this.addRoleForm.orgName = orgName
    },
    // 申请角色确认事件
    addRoleConfirm() {
      const data = this.handleAddRoleForm()
      if (!data) return
      return this.$axios
        .post('/fn/system/roleApply/addRoleApply', { data }, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('申请成功')
            this.addRoleVisible = false
            this.getRoleList()
          }
        })
    },
    // 通过 申请
    passRole(row) {
      this.$axios
        .post('/fn/system/roleApply/passRoleApply', { data: row }, jsonHeaders)
        .then((res) => {
          const { code } = res.data
          if (code === 0) {
            this.$message.success('操作成功')
            this.getRoleList()
          }
        })
    },
    // 已检查 改为检查
    input(row) {
      if (row.text === '已检查') {
        row.text = '检查'
      }
    },
    // 角色 随机构变化
    async roleChange(form) {
      const { blgStripLine } = form
      if (blgStripLine !== form.busiType[0]) {
        form.blgStripLine = form.busiType[0]
        this.getRoleOptions(form)
      }
    },
    // 审批状态 过滤
    tableFilter(list) {
      this.queryForm.applyStatus = list.list[0]
      this.queryForm.currPage = 1
      this.getRoleList()
    },
    // 审批状态 重置
    tableReset(list) {
      this.queryForm.applyStatus = ''
      this.queryForm.currPage = 1
      this.getRoleList()
    }
  },
  mounted() {
    this.initStripe()
  },
  watch: {
    'queryForm.busiType': {
      handler(newValue) {
        this.roleChange(this.queryForm)
      }
    },
    'addRoleForm.busiType': {
      handler(newValue) {
        this.roleChange(this.addRoleForm)
      }
    }
  },
  created() {
    this.addRoleConfirm = throttle(this.addRoleConfirm)
  }
}
</script>

<style lang="scss">
.system-management__role-application {
  .search-card {
    .el-input {
      width: 200px;
    }
    .first-item .el-form-item__content {
      height: 30px;
      .el-checkbox {
        float: right;
      }
    }
  }
  &__search-card {
    .el-input {
      width: 200px;
    }
  }
}
</style>