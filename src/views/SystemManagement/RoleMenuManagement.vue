<template>
  <div class="system-management__role-menu">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item>
          <gc-select
            class="w200"
            label="角色列表"
            k="roleName"
            v="roleId"
            :options="roleList"
            v-model="queryForm.roleId"
          ></gc-select>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="submit">提交</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="system-management__role-menu__content mt10">
      <gc-table
        :stripe="false"
        :list="dataList"
        :tableList="dataTableList"
        :row-class-name="handleRowClass"
        @select="handleSelect"
        default-expand-all
        ref="tableRef"
        row-key="menuId"
        class="system-management__role-menu__table general__table"
      >
        <el-table-column>
          <template slot-scope="scope">
            <div v-if="Array.isArray(scope.row)">
              <el-checkbox
                v-for="item in scope.row"
                v-model="item.checked"
                :key="item.menuId"
                >{{ item.menuName }}</el-checkbox
              >
            </div>
            <span v-else>
              {{ scope.row.menuName }}
            </span>
          </template>
        </el-table-column>
      </gc-table>
    </el-card>
  </div>
</template>

<script>
import {
  merge,
  CopyObj,
  resetObj,
  sizeChange,
  jsonHeaders,
  currentChange
} from '../../util/utils'
export default {
  name: 'RoleMenuManagement',
  data() {
    return {
      total: 0,
      // 查询 提交的 表单
      queryForm: {
        roleId: '',
        pageSize: 10,
        currPage: 1
      },
      // 角色列表
      roleList: [],
      // 表格字段数组
      dataList: [
        {
          type: 'selection',
          width: '54'
        }
      ],
      // 表格数据数组
      dataTableList: []
    }
  },
  methods: {
    query() {
      this.getDataList()
    },
    submit() {
      const roleId = this.queryForm.roleId
      if (!roleId) {
        return this.$message.warning('请先选择角色')
      }
      const selection = this.$refs.tableRef.$refs.gcTable.selection
      const checked = []
      this.getCheckedItem(this.dataTableList, checked)
      selection.push(...checked)
      const menuIds = selection.map((v) => v.menuId)
      const data = { roleId, menuIds }
      this.$axios
        .post('/fn/system/func/modifyRoleMenuRelation', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('修改成功')
            this.getDataList()
          }
        })
    },
    getDataList() {
      const roleId = this.queryForm.roleId
      if (!roleId) {
        return this.$message.warning('请先选择角色')
      }
      const data = { roleId }
      this.$axios
        .post('/fn/system/func/listMenuInfoListByRoleId', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const results = {}
            const selection = []
            data.forEach((v) => {
              ;(results[v.prnMenuId] || (results[v.prnMenuId] = [])).push(v)
              if (v.isSelected === 'Y') {
                selection.push(v)
              }
            })
            Object.keys(results).forEach((key) => {
              const arr = results[key]
              arr.forEach((v) => {
                const children = results[v.menuId]
                children && (v.children = children)
              })
            })
            results[0].forEach((v) => {
              this.handleLastTier(v, selection)
            })
            this.dataTableList = results[0]
            this.$nextTick(() => {
              selection.forEach((row) => {
                this.$refs.tableRef.$refs.gcTable.toggleRowSelection(row, true)
              })
            })
          }
        })
    },
    handleLastTier(data, selection) {
      let flag = true
      if (!data.children) return
      data.children.forEach((v) => {
        if (v.children) {
          this.handleLastTier(v, selection)
          flag = false
        }
      })
      if (flag) {
        const children = [...data.children]
        children.forEach((v) => {
          const index = selection.findIndex((n) => n.menuId === v.menuId)
          if (index > -1) {
            v.checked = true
            selection.splice(index, 1)
          } else {
            v.checked = false
          }
        })
        children.menuId = children.map((v) => v.menuId).join(',')
        data.children = [children]
      }
    },
    getCheckedItem(arr, checkedArr) {
      arr.forEach((v) => {
        if (v.children) {
          this.getCheckedItem(v.children, checkedArr)
        } else if (Array.isArray(v)) {
          v.forEach((c) => {
            c.checked && checkedArr.push(c)
          })
        }
      })
    },
    handleRowClass(row, rowIndex) {
      if (Array.isArray(row.row)) {
        return 'cancel-select'
      }
      return ''
    },
    getRoleList() {
      this.$axios
        .post('/fn/system/func/listRole', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.roleList = data
          }
        })
    },
    handleSelect(selection, row) {
      const flag = selection.includes(row)

      if (row.children.length === 1 && Array.isArray(row.children[0])) {
        row.children[0].forEach((v) => {
          v.checked = flag
        })
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="scss">
.system-management__role-menu {
  .cancel-select {
    td:first-child {
      .cell {
        display: none;
      }
    }
    .cell {
      display: flex;
    }
  }
}
</style>