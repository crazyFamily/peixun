<template>
  <div class="SystemManagement__RoleJurisdiction">
    <!-- 搜索card -->
    <el-card>
      <div class="between-noc mb-20">
        <el-form :model="queryForm" class="search-form" inline>
          <el-form-item label="条线">
            <gc-select :options="blgStripLineOptions"> </gc-select>
          </el-form-item>
          <el-form-item label="角色">
            <gc-select v-model="queryForm.roleId" :options="roleOptions">
            </gc-select>
          </el-form-item>
        </el-form>
        <div class="buttons sw-200 fs0">
          <el-button @click="query" class="button-w80-h30" type="primary"
            >查询</el-button
          >
          <el-button @click="submit" class="button-w80-h30">提交</el-button>
        </div>
      </div>
    </el-card>
    <!-- 内容card -->
    <el-card class="mt10 border-table">
      <el-table border :data="tableList">
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="一级菜单">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.one.state">{{
              scope.row.one.name
            }}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="二级菜单" class-name="item-column">
          <template slot-scope="scope">
            <div class="item" v-for="item in scope.row.two" :key="item.name">
              <el-checkbox v-model="item.state">{{ item.name }}</el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="按钮" class-name="item-column">
          <template slot-scope="scope">
            <div class="item" v-for="item in scope.row.two" :key="item.name">
              <el-checkbox v-model="item.add">新增</el-checkbox>
              <el-checkbox v-model="item.del">删除</el-checkbox>
              <el-checkbox v-model="item.edit">修改</el-checkbox>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { CopyObj, jsonHeaders, blgStripLineOptions } from '../../util/utils'
export default {
  name: 'RoleJurisdiction',
  data() {
    return {
      queryForm: {
        busiType: []
      },
      // 角色设置数组
      roleOptions: [],
      blgStripLineOptions,
      tableList: [
        {
          one: {
            name: '讲师管理',
            state: true
          },
          two: [
            {
              name: '讲师管理1',
              state: false,
              add: false
            },
            {
              name: '讲师管理2',
              state: false,
              add: false
            },
            {
              name: '讲师管理3',
              state: false,
              add: false
            }
          ]
        }
      ]
    }
  },
  methods: {
    // 初始化获取  下拉 角色 列表
    getRoleOptions() {
      const data = CopyObj(this.queryForm)
      ;[data.busiType = this.$store.state.userInfo.blgStripLine, data.orgId] =
        data.busiType
      return this.$axios
        .post('/fn/system/roleApply/listSelectRole', data, jsonHeaders)
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
    // 查询
    query() {},
    // 提交
    submit() {}
  },
  mounted() {
    this.getRoleOptions()
  }
}
</script>

<style lang="scss"></style>