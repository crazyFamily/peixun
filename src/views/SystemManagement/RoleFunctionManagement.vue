<template>
  <div class="system-management__role-function">
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
    <el-card class="system-management__role-function__content mt10">
      <gc-table
        row-key="funcId"
        :stripe="false"
        :list="dataList"
        default-expand-all
        :tableList="dataTableList"
        @select="handleSelect"
        ref="tableRef"
        class="
          system-management__role-function__table
          general__table
          table-radio
        "
      >
        <el-table-column label="功能名称">
          <template slot-scope="scope">
            {{ handleName(scope.row) }}
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
  name: 'RoleFunctionManagement',
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
      const funcIds = selection
        .filter((v) => v.funcId !== v.blgMenuId)
        .map((v) => v.funcId)
      const data = { roleId, funcIds }
      this.$axios
        .post('/fn/system/func/modifyRoleFuncRelation', data, jsonHeaders)
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
      console.log('RoleFunctionManagement',roleId)
      if (!roleId) {
        return this.$message.warning('请先选择角色')
      }
      const data = { roleId }
      this.$axios
        .post('/fn/system/func/listFuncListByRoleId', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const checked = data.filter((v) => v.isSelected === 'Y')
            this.dataTableList = this.handleData(data)
            this.$nextTick(() => {
              checked.forEach((v) => {
                this.$refs.tableRef.$children[0].toggleRowSelection(v, true)
              })
            })
          }
        })
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
    handleData(arr) {
      const data = {}
      const newArr = []
      arr.forEach((v) => {
        const { blgMenuId, blgMenuName, pageSort } = v
        if (!data[blgMenuId]) {
          data[blgMenuId] = {
            blgMenuId,
            blgMenuName,
            children: [],
            funcId: blgMenuId,
            pageSort
          }
        }
        data[blgMenuId].children.push(v)
      })
      Object.keys(data).forEach((key) => {
        newArr.push(data[key])
      })
      newArr.forEach((v) => {
        v.children.sort((a, b) => a.pageSort - b.pageSort)
      })
      newArr.sort((a, b) => a.pageSort - b.pageSort)
      return newArr
    },
    handleName(row) {
      return row.funcName ? `${row.funcName}(${row.funcUrl})` : row.blgMenuName
    },
    handleSelect(selection, row) {
      const flag = selection.includes(row)
      row.children?.forEach((v) => {
        this.$refs.tableRef.$children[0].toggleRowSelection(v, flag)
      })
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="scss"></style>