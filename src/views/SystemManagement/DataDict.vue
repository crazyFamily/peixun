<template>
  <div class="system-management__data-dict">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="数据类别">
          <el-input v-model="queryForm.dataCtgy"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button @click="query" type="primary">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 内容card -->
    <el-card class="system-management__data-dict__content mt10">
      <div class="instructor-icons menu-right">
        <div class="" @click="openAdd">
          <span class="instructor-icons__add">
            <i class="instructor-icons__add__icon"></i>
            添加</span
          >
        </div>
      </div>
      <gc-table
        :list="dataList"
        :tableList="dataTableList"
        class="system-management__data-dict__content__table general__table"
      >
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <div class="">
              <span
                v-if="scope.row.ifValid === 'Y'"
                class="active mr20"
                @click="openEdit(scope.row)"
                >修改</span
              >
              <span v-else class="mr20 shallow">修改</span>
              <span
                class="active mr20"
                v-if="scope.row.ifValid === 'Y'"
                @click="changeStatus(scope.row, 'N')"
                >冻结</span
              >
              <span
                class="active mr20"
                v-else
                @click="changeStatus(scope.row, 'Y')"
                >启用</span
              >
              <!-- <span class="active" @click="delDict(scope.row)"
                                >删除</span
                            > -->
              <span class="active" @click="delDict(scope.row)">{{
                scope.row.isCustomized === 'Y' ? '删除' : ''
              }}</span>
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
        @sizeChange="sizeChange($event, queryForm, getDataList)"
        @currentChange="currentChange($event, queryForm, getDataList)"
        class="between"
      >
        <span class="text">每页显示</span>
      </gc-pagination>
    </el-card>

    <!-- 添加 字典 弹窗 -->
    <gc-model
      title="新增字典"
      width="600px"
      :visible="addDataVisible"
      @close="addDataVisible = false"
      @cancel="addDataVisible = false"
      @comfirm="addDataConfirm"
    >
      <el-form
        ref="addForm"
        :model="addDataForm"
        :rules="addDataFormRules"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item class="mt10" label="数据类别" prop="dataCtgy">
          <el-input v-model="addDataForm.dataCtgy"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="数据编码" prop="dataEncode">
          <el-input v-model="addDataForm.dataEncode"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="数据名称/值" prop="dataValue">
          <el-input v-model="addDataForm.dataValue"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="页面排序" prop="pageSort">
          <el-input
            v-model.number="addDataForm.pageSort"
            maxlength="5"
          ></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="父数据编码">
          <el-input v-model="addDataForm.prnDataEncode"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="是否有效" prop="ifValid">
          <el-radio-group v-model="addDataForm.ifValid">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="mt10" label="数据描述">
          <el-input v-model="addDataForm.dataDesc"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="业务功能">
          <el-input v-model="addDataForm.dataFunc"></el-input>
        </el-form-item>
      </el-form>
    </gc-model>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  sizeChange,
  currentChange,
  CopyObj,
  jsonHeaders,
  resetObj,
  merge
} from '../../util/utils'
export default {
  name: 'SystemManagementDict',
  data() {
    return {
      total: 0,
      // 查询 提交的 表单
      queryForm: {
        // 数据描述
        dataCtgy: '',
        pageSize: 10,
        currPage: 1
      },
      // 角色表格字段数组
      dataList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '数据类别',
          prop: 'dataCtgy'
        },
        {
          label: '数据编码',
          prop: 'dataEncode'
        },
        {
          label: '数据名称/值',
          prop: 'dataValue'
        },
        {
          label: '页面排序',
          prop: 'pageSort'
        },
        {
          label: '父数据编码',
          prop: 'prnDataEncode'
        },
        {
          label: '是否有效',
          prop: 'isValid'
        },
        {
          label: '数据描述',
          prop: 'dataDesc'
        },
        {
          label: '业务功能',
          prop: 'dataFunc'
        }
      ],
      // 角色表格 数据 数组
      dataTableList: [],
      // 页面变化函数
      sizeChange,
      currentChange,
      // 添加字典 dialog 是否显示
      addDataVisible: false,
      // 添加 新字典 表单
      addDataForm: {
        id: '',
        dataCtgy: '',
        dataEncode: '',
        dataValue: '',
        pageSort: '',
        prnDataEncode: '',
        ifValid: '',
        dataDesc: '',
        dataFunc: ''
      },
      // 添加 新字典 表单验证规则
      addDataFormRules: {
        dataCtgy: [
          {
            required: true,
            message: '请填写数据类别',
            trigger: 'blur'
          }
        ],
        dataEncode: [
          {
            required: true,
            message: '请填写数据编码',
            trigger: 'blur'
          }
        ],
        dataValue: [
          {
            required: true,
            message: '请填写数据名称',
            trigger: 'blur'
          }
        ],
        pageSort: [
          {
            required: true,
            message: '请填写页面排序',
            trigger: 'blur'
          },
          {
            type: 'number',
            message: '只能填写数字',
            trigger: 'blur'
          }
        ],
        ifValid: [
          {
            required: true,
            message: '请选择是否有效'
          }
        ]
      }
    }
  },
  methods: {
    // 查询角色
    query() {
      this.queryForm.pageSize = 10
      this.queryForm.currPage = 1
      this.getDataList()
    },
    // 重置查询
    reset() {
      this.queryForm.dataCtgy = ''
      this.queryForm.pageSize = 10
      this.queryForm.currPage = 1
      this.getDataList()
    },
    // 获取字典数据
    getDataList() {
      this.$axios
        .post(
          '/fn/system/func/listDataCode',
          { data: this.queryForm },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.dataTableList = data.list
            this.total = data.total
          }
        })
    },
    // 修改状态
    changeStatus(row, isValid) {
      const { dataEncode, id } = row
      this.$axios
        .post(
          '/fn/system/func/modifyDataCodeStatus',
          { dataEncode, isValid, id },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          }
        })
    },
    // 打开 新增
    openAdd() {
      resetObj(this.addDataForm)
      this.addDataVisible = true
    },
    // 打开 修改
    openEdit(row) {
      resetObj(this.addDataForm)
      merge(this.addDataForm, row)
      this.addDataForm.pageSort = parseInt(this.addDataForm.pageSort)
      if (
        this.addDataForm.ifValid !== 'Y' &&
        this.addDataForm.ifValid !== 'N'
      ) {
        this.addDataForm.ifValid = ''
      }
      this.addDataVisible = true
    },
    // 新增/修改  字典 确认事件
    addDataConfirm() {
      this.$refs.addForm.validate((valied) => {
        if (valied) {
          let url
          const data = CopyObj(this.addDataForm)
          if (this.addDataForm.id) {
            url = '/fn/system/func/modifyDataCode'
          } else {
            url = '/fn/system/func/addDataCode'
            Reflect.deleteProperty(data, 'id')
          }
          this.$axios.post(url, { data }, jsonHeaders).then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.getDataList()
              this.$message.success('操作成功')
              this.addDataVisible = false
            }
          })
        }
      })
    },
    // 删除 一条数据
    delDict(row) {
      const { dataEncode, id, dataCtgy } = row
      this.$axios
        .post(
          '/fn/system/func/deleteDataCode',
          { data: { dataEncode, id, dataCtgy } },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('操作成功')
            this.getDataList()
          }
        })
    }
  },
  mounted() {
    this.getDataList()
  }
}
</script>

<style lang="scss">
.system-management__data-dict {
  .search-card .el-input {
    width: 200px;
  }
  .userinfo-items {
    &__item {
      &__left {
        line-height: 30px;
      }
      &__right {
        flex: 1;
      }
    }
    .overrun {
      position: relative;
      white-space: nowrap;
      span {
        position: absolute;
        right: 0;
      }
    }
    .necessary::after {
      top: 7.5px;
    }
    .label {
      width: 0;
    }
  }
}
</style>