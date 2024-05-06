<template>
  <div class="system-management__role-application">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="角色名称">
          <el-select v-model="queryForm.roleName" filterable class="w-250" @change="getOrgDatas($event, queryForm, 'searchInstitutionRef')">
            <el-option v-for="item in roleOptions" :key="item.label" :label="item.label" :value="item"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="institution-item" label="机构">
          <QCOrgTree
            v-show="queryForm.roleName === TANLENTS_LINE_ADMIN_NAME || queryForm.roleName === TANLENTS_ORG_ADMIN_NAME"
            :orgList="orgTreeOptions"
            v-model="queryForm.orgId"
          ></QCOrgTree>
          <el-select
            v-model="queryForm.newOrgId"
            filterable
            class="w-250"
            v-show="queryForm.roleName === ORG_NEW_USER_ADMIN_LABEL"
            @change="setBusiType($event, queryForm)"
          >
            <el-option v-for="item in newOrgOptions" :key="item.orgId" :label="item.orgName" :value="item.orgId"> </el-option>
          </el-select>
          <div v-show="isPublicOrgTree" style="display: flex">
            <gc-institution
              v-model="queryForm.busiType"
              :fetch-params="{ roleName: queryForm.roleName }"
              :immediate="false"
              :disabled="disabledOrgSelect"
              ref="searchInstitutionRef"
            >
            </gc-institution>
            <el-checkbox v-model="queryForm.isGotSubBranch" :disabled="disabledOrgSelect">含下属机构</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item class="mr20">
          <gc-input label="人员姓名" v-model="queryForm.searchUmIdOrName"></gc-input>
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
        <div @click="openAuthAssign">
          <span class="instructor-icons__add">
            <i class="instructor-icons__add__icon"></i>
            权限分配</span
          >
        </div>
        <div @click="batchDel">
          <span class="instructor-icons__del">
            <i class="instructor-icons__del__icon"></i>
            批量删除
          </span>
        </div>
        <span class="instructor-icons__download" @click="handleExport('/fn/system/func/reportListUserRole', getQueryForm())">
          <i class="instructor-icons__download__icon"></i>
          导出</span
        >
      </div>
      <gc-table
        :list="roleList"
        :tableList="roleTableList"
        ref="authorityRef"
        class="system-management__role-application__content__table general__table"
      >
      </gc-table>
      <!-- 分页 -->
      <gc-pagination
        :total="total"
        layout="prev, pager, next,slot, sizes"
        prev-text=""
        next-text=""
        :page-sizes="[10, 20]"
        :page-size="queryForm.pageSize"
        :current-page="queryForm.currPage"
        @sizeChange="sizeChange($event, queryForm, getAuthorityList)"
        @currentChange="currentChange($event, queryForm, getAuthorityList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 权限分配 弹窗 -->
    <gc-model
      title="权限分配"
      width="1120px"
      :visible="authAssignVisible"
      :isAppend="true"
      @close="authAssignClose"
      @cancel="authAssignVisible = false"
      @comfirm="authorityConfirm"
    >
      <div class="title">
        <div class="title__menu"></div>
        申请人
      </div>
      <gc-table :list="addRoleList" :tableList="addRoleTableList" class="system-management__role-application__add-role__table general__table mt20">
        <el-table-column class="mt10" label="角色" min-width="200px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.roleName" filterable class="w-200" @change="getOrgDatas($event, scope.row, 'institution')">
              <el-option v-for="item in roleOptions" :key="item.label" :label="item.label" :value="item"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="机构" min-width="200px">
          <template slot-scope="scope">
            <QCOrgTree
              v-show="scope.row.roleName === TANLENTS_LINE_ADMIN_NAME || scope.row.roleName === TANLENTS_ORG_ADMIN_NAME"
              :orgList="scope.row.orgTreeOptions"
              v-model="scope.row.orgId"
              @change="institutionChange(scope.row)"
            ></QCOrgTree>
            <el-select
              v-model="scope.row.newOrgId"
              :disabled="scope.row.orgRequired === 'N'"
              filterable
              class="w-200"
              v-if="scope.row.roleName === ORG_NEW_USER_ADMIN_LABEL"
              @change="setBusiType($event, scope.row)"
            >
              <el-option v-for="item in newOrgOptions" :key="item.orgId" :label="item.orgName" :value="item.orgId"> </el-option>
            </el-select>
            <gc-institution
              style="margin-top: 5px"
              ref="institution"
              v-model="scope.row.busiType"
              :fetch-params="orgFetchParams"
              @change="institutionChange(scope.row)"
              :immediate="false"
              :disabled="scope.row.roleName === BANK_NEW_USER_ADMIN_LABEL || scope.row.orgRequired === 'N'"
              v-if="isPublicOrgTreeFn(scope.row)"
            >
            </gc-institution>
          </template>
        </el-table-column>
        <el-table-column label="申请人" min-width="200px">
          <template slot-scope="scope">
            <div class="df">
              <el-input v-model.trim="scope.row.umId" @input="input(scope.row)" @blur="blur(scope.row)" placeholder="请输入UM号"></el-input>
              <el-button class="button-60-h30 ml10" type="primary" @click="checkUm(scope.row)">{{ scope.row.text }}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名" min-width="200px"
          ><template slot-scope="scope">{{ scope.row.empName }}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <div class="">
              <span class="active mr10" @click="handleAddRole(scope.row)">添加</span>
              <span class="active" @click="handleDelRole(scope.$index, scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </gc-table>
    </gc-model>
  </div>
</template>

<script>
import _ from 'lodash'
import { uuid, CopyObj, sizeChange, handleExport, currentChange } from '@/util/utils'
import { fetchListSelectRole, fetchSelectRoleIdByRoleNameAndBusiType, fetchListXrAllTree } from '@/fetch/public'
import { ORG_NEW_USER_ADMIN_LABEL, BANK_NEW_USER_ADMIN_LABEL } from '@/views/SystemManagement/enum'
import { fetchQCSotreQryParam } from '@/fetch/tanlents'
import { fetchAddUserRole, fetchDeleteUserRole, fetchCheckRoleApplyByUm, fetchListUserRole } from '@/fetch/systemManagement'
import { HEADQUARTER_ADMIN_NAME, TANLENTS_LINE_ADMIN_NAME, TANLENTS_ORG_ADMIN_NAME } from '@/views/TalentsCultivation/enum'
import QCOrgTree from './components/QCOrgTree.vue'

export default {
  name: 'AuthorityAssignment',
  components: {
    QCOrgTree
  },
  data() {
    return {
      total: 0,
      queryForm: {
        // 条线分类
        busiType: [],
        // 角色id
        roleId: '',
        // 角色名称
        roleName: '',
        // 人员姓名
        searchUmIdOrName: '',
        pageSize: 10,
        currPage: 1,
        isGotSubBranch: true,
        // 用于缓存机构新人培养员机构id
        newOrgId: ''
      },
      // 结构设置对象
      // cascaderOptions: {},
      // orgOptions: [],
      // 条线分类 设置数组
      orgOptions: [],
      cascaderOptions: [],
      // 角色设置数组
      roleOptions: [],
      roleList: [
        {
          type: 'selection',
          width: '54'
        },
        {
          type: 'index',
          label: '序号',
          width: '50'
        },
        {
          label: 'UM号',
          prop: 'umId',
          width: '80'
        },
        {
          label: '姓名',
          prop: 'empName',
          width: '60'
        },
        {
          label: '用户所属机构',
          prop: 'userOrgName',
          width: '150'
        },
        {
          label: '角色条线',
          prop: 'roleBlgStripLine',
          type: 'setWidth',
          width: '80'
        },
        {
          label: '角色名称',
          prop: 'roleName',
          type: 'setWidth',
          width: '200'
        },
        {
          label: '操作机构',
          prop: 'authorizedOrgName',
          width: '150'
        },
        {
          label: '时间',
          prop: 'authorizedDate',
          type: 'setWidth',
          width: '110'
        }
      ],
      // 角色表格 数据 数组
      roleTableList: [],
      // 权限分配
      addRoleList: [
        {
          type: 'index',
          label: '序号'
        }
      ],
      addRoleTableList: [],
      authAssignVisible: false,
      currentChange,
      sizeChange,
      oraName: '',
      orgFetchParams: { roleName: '' },
      newOrgOptions: [],
      handleExport,
      BANK_NEW_USER_ADMIN_LABEL,
      ORG_NEW_USER_ADMIN_LABEL,
      TANLENTS_ORG_ADMIN_NAME,
      TANLENTS_LINE_ADMIN_NAME,
      QCorgTreeOptions: [],
      QClineTreeOptions: [],
      orgTreeOptions: [],
      HEADQUARTER_ADMIN_NAME,
      normalizer(node) {
        return {
          id: node.qCCode,
          label: node.qCMsg,
          children: node.subLine
        }
      },
      lineKeys: [],
      addRoleTableObj: {
        umId: '',
        orgId: '',
        empName: '',
        orgName: '',
        roleName: '',
        roleIds: [],
        text: '检查',
        busiType: [],
        roleOptions: [],
        blgStripLine: '',
        roleId: '',
        newOrgId: '',
        orgRequired: null,
        orgTreeOptions: []
      }
    }
  },
  methods: {
    // 查询函数
    query() {
      this.queryForm.currPage = 1
      this.getAuthorityList()
    },
    // 重置查询
    reset() {
      this.queryForm.busiType = []
      this.queryForm.orgId = ''
      this.queryForm.roleId = ''
      this.queryForm.roleName = ''
      this.queryForm.isGotSubBranch = true
      this.queryForm.searchUmIdOrName = ''
      this.queryForm.currPage = 1
      this.queryForm.newOrgId = ''
      this.queryForm.pageSize = 10
      this.$refs.searchInstitutionRef.clear({ clearBlgStripLine: true })
    },
    // 处理queryForm
    getQueryForm() {
      const data = CopyObj(this.queryForm)
      this.getBusiTypeAndOrgId(data)
      data.isGotSubBranch = data.isGotSubBranch ? 'Y' : 'N'
      return { data }
    },
    // 处理busiType和orgId
    getBusiTypeAndOrgId(data) {
      // 总行新人培养管理员、潜才管理员传FL
      if (data.busiType.length > 1) {
        data.orgId = data.busiType.slice(-1)[0]
        data.busiType = data.busiType[0]
      } else {
        data.busiType = data.busiType[0]
      }
      if (data.roleName === BANK_NEW_USER_ADMIN_LABEL || data.roleName === HEADQUARTER_ADMIN_NAME) {
        data.busiType = 'FL'
        data.orgId = ''
      } else if (data.roleName === TANLENTS_LINE_ADMIN_NAME || data.roleName === TANLENTS_ORG_ADMIN_NAME) {
        data.busiType = 'FL'
      }
    },
    // 获取所有人员权限机构列表
    getAuthorityList() {
      const data = this.getQueryForm()
      data.data.uuid = uuid()
      fetchListUserRole(data.data).then((res) => {
        this.roleTableList = res.list
        this.total = res.total
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
        }
      }
    },
    // 初始化获取  下拉 角色 列表
    async getRoleOptions(queryForm) {
      queryForm = queryForm || this.queryForm
      const busiType = queryForm.busiType[0] || this.$store.state.userInfo.blgStripLine
      const res = await fetchListSelectRole({ busiType, oprType: 'admin' })
      const results = res.map((v) => ({
        label: v.roleName,
        value: v.roleName,
        roleId: v.roleId,
        orgRequired: v.orgRequired
      }))
      if (queryForm.roleOptions) {
        queryForm.roleOptions = results
      } else {
        this.roleOptions = results
      }
      if (results.find((v) => v.label === TANLENTS_LINE_ADMIN_NAME || v.roleName === TANLENTS_ORG_ADMIN_NAME)) {
        this._getSeachDatas()
      }
    },
    // 批量删除
    batchDel() {
      const selection = this.$refs.authorityRef.$children[0].selection
      if (selection.length < 1) {
        return this.$nextTick(() => {
          this.$message.warning('请勾选角色')
        })
      }
      this.$alert('确定删除此角色？', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonClass: 'cancel',
        customClass: `loginTimeout`
      })
        .then((valied) => {
          if (valied === 'confirm') {
            const data = selection.map((v) => {
              let umId = v.umId,
                orgId = v.orgId,
                roleId = v.roleId,
                uuid = v.uuid,
                vBatch = { umId, orgId, roleId, uuid }
              // console.log(vBatch);
              return vBatch
            })
            // console.log(data);
            fetchDeleteUserRole(data).then((res) => {
              this.$message.success('删除成功')
              this.getAuthorityList()
            })
          }
        })
        .catch((err) => err)
    },

    // 权限分配 dialog 关闭事件
    authAssignClose() {
      this.authAssignVisible = false
      this.$refs.institution?.clear({ clearBlgStripLine: true })
    },
    // 打开权限分配dialog
    openAuthAssign() {
      this.addRoleTableList = [{ ...this.addRoleTableObj }]
      this.authAssignVisible = true
    },
    // 弹框操作添加
    handleAddRole() {
      this.addRoleTableList.push({ ...this.addRoleTableObj })
    },
    // 检查um
    async checkUm(row) {
      if (row.text === '已检查') return
      if (!row.umId) return this.$message.warning('请先填写um账号')
      // 总行新人管理员,总行潜才管理员不需要检查机构;条线潜才管理员、机构潜才管理员需要校验orgId有值，orgRequired为N将选择机构条线置灰，提交的时候，也不判断有没有值
      if (row.busiType.length < 2 && !row.orgId && row.orgRequired !== 'N') {
        return this.$message.warning('请选择机构')
      }
      const roleIds = row.orgRequired === 'N' ? [] : [await this.getRoleId(row)]
      row.roleIds = roleIds
      const data = CopyObj({
        umId: row.umId,
        busiType: row.busiType,
        orgId: row.orgId,
        roleIds,
        roleName: row.roleName
      })
      this.getBusiTypeAndOrgId(data)
      Reflect.deleteProperty(data, 'roleName')
      fetchCheckRoleApplyByUm(data).then((res) => {
        if (res) {
          row.empName = res.empName
          row.umId = res.umId
          row.text = '已检查'
        }
      })
    },
    // 根据机构条线和roleName获取roleId
    async getRoleId({ busiType, roleName }) {
      let resultBusitype = ''
      // 总行新人培养管理员、潜才管理员传FL
      if (
        roleName === BANK_NEW_USER_ADMIN_LABEL ||
        roleName === HEADQUARTER_ADMIN_NAME ||
        roleName === TANLENTS_LINE_ADMIN_NAME ||
        roleName === TANLENTS_ORG_ADMIN_NAME
      ) {
        resultBusitype = 'FL'
      } else {
        resultBusitype = busiType[0]
      }
      const roleId = await fetchSelectRoleIdByRoleNameAndBusiType({ busiType: resultBusitype, roleName })
      return roleId
    },
    // 需求变更，根据角色查机构列表
    async getOrgDatas(item, row, refName = 'institution') {
      if (refName === 'institution') {
        row.roleName = item.label
        row.orgRequired = item.orgRequired
        row.roleId = item.roleId
        row.newOrgId = ''
        row.orgId = ''
        row.busiType = []
        this.institutionChange(row)
      }

      if (refName === 'searchInstitutionRef') {
        this.queryForm.roleName = item.label
        this.queryForm.orgRequired = item.orgRequired
        this.queryForm.roleId = item.roleId
        this.queryForm.newOrgId = ''
        this.queryForm.orgId = ''
        this.queryForm.busiType = []
      }
      this.orgFetchParams = { roleName: item.label }
      // 机构新人培养管理员需要用新机构的数据
      if (item.label === ORG_NEW_USER_ADMIN_LABEL) {
        await this.getNewOrgDatas()
        return
      }
      // 机构潜才管理员需要用潜才机构的数据，条线潜才管理员需要用潜才条线的数据
      if (item.label === TANLENTS_LINE_ADMIN_NAME) {
        if (refName === 'institution') {
          row.orgTreeOptions = CopyObj(this.QClineTreeOptions)
        } else if (refName === 'searchInstitutionRef') {
          this.orgTreeOptions = CopyObj(this.QClineTreeOptions)
        }
        return
      }
      if (item.label === TANLENTS_ORG_ADMIN_NAME) {
        if (refName === 'institution') {
          row.orgTreeOptions = CopyObj(this.QCorgTreeOptions)
        } else if (refName === 'searchInstitutionRef') {
          this.orgTreeOptions = CopyObj(this.QCorgTreeOptions)
        }
        return
      }
      this.$refs[refName]?.clear({ clearBlgStripLine: true })
      this.$refs[refName]?.createTreeData({ roleName: item.label })
    },
    async getNewOrgDatas() {
      this.newOrgOptions = await fetchListXrAllTree()
    },
    // 申请权限弹框确认事件
    authorityConfirm() {
      const index = this.addRoleTableList.findIndex((v) => v.text === '检查')
      if (index > -1) {
        return this.$message.warning(`第${index + 1}行未检查`)
      }
      const data = []
      this.addRoleTableList.forEach((v) => {
        const result = CopyObj(v)
        this.getBusiTypeAndOrgId(result)
        Reflect.deleteProperty(result, 'roleIds')
        Reflect.deleteProperty(result, 'roleOptions')
        // 需求变更，=N的时候，将选择机构条线置灰，提交的时候，也不判断有没有值；
        if (v.orgRequired === 'N') {
          data.push({ ...result })
        } else {
          v.roleIds.forEach((n) => {
            result.roleId = n
            data.push({ ...result })
          })
        }
      })
      fetchAddUserRole(data).then((res) => {
        this.$message.success('权限增加成功')
        this.authAssignVisible = false
        this.getAuthorityList()
      })
    },
    // 权限分配 机构变化事件
    institutionChange(row) {
      this.input(row)
    },
    // 失焦权限增加弹框输入框变成大写
    blur(row) {
      row.umId = row.umId.toUpperCase()
    },
    // 已检查 改为检查
    input(row) {
      if (row.text === '已检查') {
        row.text = '检查'
      }
    },
    // 弹框添加删除
    handleDelRole(index, row) {
      if (this.addRoleTableList.length > 1) {
        this.addRoleTableList.splice(index, 1)
      }
    },
    setBusiType(value, row) {
      row.busiType = ['FL', value]
      this.input(row)
    },
    // 获取潜才机构及条线数据
    async _getSeachDatas() {
      let data = { tip: 'Y' }
      let { orgs, lines } = await fetchQCSotreQryParam({
        data
      })
      this.QCorgTreeOptions = this._formatTreeData(orgs)
      this.QClineTreeOptions = this._formatTreeData(lines)
    },
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
    isPublicOrgTreeFn(row) {
      return row.roleName !== TANLENTS_LINE_ADMIN_NAME && row.roleName !== TANLENTS_ORG_ADMIN_NAME && row.roleName !== ORG_NEW_USER_ADMIN_LABEL
    }
  },
  mounted() {
    // this.initStripe()
    this.getRoleOptions()
  },
  computed: {
    // 总行潜才管理员、总行新人培养管理员机构置灰
    disabledOrgSelect() {
      return this.queryForm.roleName === BANK_NEW_USER_ADMIN_LABEL || this.queryForm.roleName === HEADQUARTER_ADMIN_NAME
    },
    // 非条线潜才管理员、机构潜才管理员、机构新人培养管理员展示默认机构树
    isPublicOrgTree() {
      return (
        this.queryForm.roleName !== TANLENTS_LINE_ADMIN_NAME &&
        this.queryForm.roleName !== TANLENTS_ORG_ADMIN_NAME &&
        this.queryForm.roleName !== ORG_NEW_USER_ADMIN_LABEL
      )
    }
  },
  watch: {
    'queryForm.busiType': {
      handler(newValue) {
        // this.getRoleOptions()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/views/TalentsCultivation/publicStyles.scss';
.system-management__role-application {
  .search-card .el-input {
    width: 200px;
  }
  .search-card .institution-item {
    padding: 0px;
  }
  &__search-card {
    .el-input {
      width: 200px;
    }
  }
}
</style>