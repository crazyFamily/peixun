<template>
  <div class="system-management__role-application">
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item>
          <gc-input label="菜单名称" v-model="queryForm.menuName"></gc-input>
        </el-form-item>
      </el-form>
      <div class="search-card__button">
        <el-button @click="query" type="primary">搜索</el-button>
      </div>
    </el-card>
    <el-card class="mt10">
      <gc-table
        class="general__table table-center"
        :list="titleList"
        :tableList="menuTitleList"
      >
        <template>
          <el-table-column
            min-width="20%"
            label="菜单名称"
            style="text-align: right"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.menuName }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="20%" label="菜单层级">
            <template slot-scope="scope">
              <span>{{ scope.row.menuLvl }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="20%" label="菜单状态">
            <template slot-scope="scope">
              <span>{{ scope.row.isValid }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="20%" label="操作">
            <template slot-scope="scope">
              <span class="active" @click="openChangeCurriculum(scope.row)">{{
                scope.row.isValid == '禁用' ? '启用' : '禁用'
              }}</span>
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
  </div>
</template>

<script>
import _ from 'lodash'
import { CopyObj, currentChange, jsonHeaders } from '@/util/utils'
import { log } from 'util'
export default {
  name: 'MenuManagement',
  data() {
    return {
      total: 0,
      checkStyle: '禁用',
      queryForm: {
        // 菜单名称
        menuTitle: '',
        currPage: 1,
        pageSize: 10
      },
      menuTitleList: [],
      titleList: [
        {
          type: 'index',
          label: '序号'
        }
      ],
      currentChange
    }
  },
  methods: {
    //   查询菜单名称
    query() {
      this.queryForm.currPage = 1
      this.getMenuList()
    },
    // 获取 菜单名称列表
    getMenuList() {
      const data = CopyObj(this.queryForm)
      this.$axios
        .post('/fn/system/func/listMenuInfo', { data }, jsonHeaders)
        .then((res) => {
          //   console.log(res);
          const { code, data } = res.data
          if (code === 0) {
            this.menuTitleList = data.list
            this.total = data.total
          }
        })
    },
    openChangeCurriculum(rowParam) {
      let ifValid = rowParam.ifValid === 'Y' ? 'N' : 'Y',
        menuId = rowParam.menuId,
        onParams = { ifValid, menuId }
      const data = CopyObj(onParams)
      //   console.log(data);
      this.$axios
        .post('/fn/system/func/adjustMenu', data, jsonHeaders)
        .then((res) => {
          console.log(res)
          if (res.data.code == '0') {
            //  console.log(11111,res.data.code);
            this.getMenuList()
          }
        })
      //  this.$message.closeAll=("rowParam.ifValid==='Y'?'禁用':'启用'")
      //  console.log(11111111111);
    }
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
}
</style>