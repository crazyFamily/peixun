<template>
  <div class="system-management__data-dict">
    <!-- 搜索 card -->
    <el-card class="search-card">
      <el-form ref="form" :model="queryForm" :inline="true">
        <el-form-item label="机构">
          <el-input
            placeholder="请输入机构名称"
            v-model="queryForm.treeName"
          ></el-input>
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
        <el-table-column width="100">
          <template slot="header">
            <gc-tablecolumnfilters
              label="是否有效"
              ref="tablecolumnfilters"
              className="table__screen__icon"
              :list="[
                { label: '是', value: 'Y' },
                { label: '否', value: 'N' }
              ]"
              confirmText="确定"
              popperClass="circular"
              @filter="
                commonFilter(
                  $event,
                  queryForm,
                  'isValid',
                  getDataList,
                  'filter'
                )
              "
              @reset="commonFilter($event, queryForm, 'isValid', getDataList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            <span>{{
              scope.row.isValid === 'Y'
                ? '是'
                : scope.row.isValid === 'N'
                ? '否'
                : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column width="110">
          <template slot="header">
            <gc-tablecolumnfilters
              label="是否固定节点"
              ref="tablecolumnfilters"
              className="table__screen__icon"
              :list="[
                { label: '是', value: 'Y' },
                { label: '否', value: 'N' }
              ]"
              confirmText="确定"
              popperClass="circular"
              @filter="
                commonFilter(
                  $event,
                  queryForm,
                  'ifFixNode',
                  getDataList,
                  'filter'
                )
              "
              @reset="commonFilter($event, queryForm, 'ifFixNode', getDataList)"
              radio
            >
            </gc-tablecolumnfilters>
          </template>
          <template slot-scope="scope">
            <span>{{
              scope.row.ifFixNode === 'Y'
                ? '是'
                : scope.row.ifFixNode === 'N'
                ? '否'
                : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <div class="">
              <span class="active mr20" @click="openEdit(scope.row)">修改</span>
              <span class="active" @click="delDict(scope.row)">删除</span>
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

    <!-- 添加 零售机构树 弹窗 -->
    <gc-model
      :title="asideTitle"
      width="600px"
      :visible="addDataVisible"
      @close="closeAside"
      @cancel="closeAside"
      @comfirm="addDataConfirm"
    >
      <el-form
        ref="addForm"
        :model="addDataForm"
        :rules="addDataFormRules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item class="mt10" label="机构ID" prop="treeId">
          <el-input
            :disabled="asideTitle === '修改零售机构树'"
            v-model="addDataForm.treeId"
          ></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="机构名称" prop="treeName">
          <el-input v-model="addDataForm.treeName"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="上级机构ID" prop="parentTreeId">
          <el-input v-model="addDataForm.parentTreeId"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="PS的机构ID" prop="psDeptno">
          <el-input v-model="addDataForm.psDeptno"></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="排序序号" prop="sortnum">
          <el-input
            v-model.number="addDataForm.sortnum"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item class="mt10" label="是否有效" prop="isValid">
          <el-radio-group v-model="addDataForm.isValid">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="mt10" label="是否固定节点" prop="ifFixNode">
          <el-radio-group v-model="addDataForm.ifFixNode">
            <el-radio label="Y">是</el-radio>
            <el-radio label="N">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="mt10" label="归属区域" prop="treeZone">
          <el-select v-model="addDataForm.treeZone" class="w-250">
            <el-option
              v-for="item in treeZoneList"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </gc-model>
  </div>
</template>

<script>
import {
  sizeChange,
  hintFrame,
  currentChange,
  CopyObj,
  jsonHeaders,
  resetObj,
  commonFilter,
  merge
} from '../../util/utils'
export default {
  name: 'SystemManagementDict',
  data() {
    return {
      total: 0,
      // 查询 提交的 表单
      queryForm: {
        // 机构名称/代码
        treeName: '',
        isValid: '',
        ifFixNode: '',
        pageSize: 10,
        currPage: 1
      },
      // 机构树数组
      dataList: [
        {
          type: 'index',
          label: '序号'
        },
        {
          label: '机构ID',
          minWidth: '100',
          prop: 'treeId'
        },
        {
          label: '机构名称',
          minWidth: '250',
          prop: 'treeName'
        },
        {
          label: '上级机构ID',
          minWidth: '100',
          prop: 'parentTreeId'
        },
        {
          label: 'PS的机构ID',
          minWidth: '100',
          prop: 'psDeptno'
        },
        {
          label: '归属区域',
          prop: 'treeZone'
        }
      ],
      asideTitle: '新增零售机构树',
      isValidList: [
        { label: '否', value: 'N' },
        { label: '是', value: 'Y' }
      ],
      // 入库管理字段
      ifFixNodeList: [
        { label: '否', value: 'N' },
        { label: '是', value: 'Y' }
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
        treeId: '',
        treeName: '',
        parentTreeId: '',
        psDeptno: '',
        sortnum: '',
        isValid: '',
        ifFixNode: '',
        treeZone: ''
      },
      treeZoneList: [
        { label: '总行', value: 'ZH' },
        { label: '片区', value: 'FQ' },
        { label: '分行', value: 'FH' },
        { label: '二级分行', value: 'EJFH' }
      ],
      // 添加 新字典 表单验证规则
      addDataFormRules: {
        treeId: [
          {
            required: true,
            message: '请填写机构ID',
            trigger: 'blur'
          }
        ],
        treeName: [
          {
            required: true,
            message: '请填写机构名称',
            trigger: 'blur'
          }
        ],
        parentTreeId: [
          {
            required: true,
            message: '请填写上级机构ID',
            trigger: 'blur'
          }
        ],
        sortnum: [
          {
            required: true,
            message: '请填写排序序号'
          }
        ],
        isValid: [
          {
            required: true,
            message: '请选择是否有效'
          }
        ],
        ifFixNode: [
          {
            required: true,
            message: '请选择是否固定节点'
          }
        ],
        treeZone: [
          {
            required: true,
            message: '请选择归属区域'
          }
        ]
      },
      commonFilter
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
      this.queryForm = this.$options.data().queryForm
      this.getDataList()
    },
    // 获取机构树数据
    getDataList() {
      this.$axios
        .post('/fn/system/func/listTemplateTree', this.queryForm, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.dataTableList = data.list
            this.total = data.total
          }
        })
    },
    // 打开 新增
    openAdd() {
      resetObj(this.addDataForm)
      this.asideTitle = '新增零售机构树'
      this.addDataVisible = true
    },
    // 打开 修改
    openEdit(row) {
      resetObj(this.addDataForm)
      this.asideTitle = '修改零售机构树'
      merge(this.addDataForm, row)
      this.addDataForm.id = row.id
      this.treeZoneList.forEach((i) => {
        if (this.addDataForm.treeZone === i.label) {
          this.addDataForm.treeZone = i.value
        }
      })
      this.addDataVisible = true
    },
    // 查询管理状态
    storageStatusFilter(list) {
      this.queryForm.ifFixNode = list.list[0]
      this.queryForm.currPage = 1
      this.getDataList()
    },
    closeAside() {
      this.addDataVisible = false
      this.addDataForm = {
        treeId: '',
        treeName: '',
        parentTreeId: '',
        psDeptno: '',
        sortnum: '',
        isValid: '',
        ifFixNode: '',
        treeZone: ''
      }
      this.$nextTick(() => {
        this.$refs.addForm.clearValidate()
      })
    },
    // 重置管理状态
    storageStatusReset(list) {
      this.queryForm.ifFixNode = ''
      this.queryForm.currPage = 1
      this.getDataList()
    },
    // 新增/修改  字典 确认事件
    addDataConfirm() {
      this.$refs.addForm.validate((valied) => {
        if (valied) {
          let url
          const data = CopyObj(this.addDataForm)
          if (this.addDataForm.id) {
            url = '/fn/system/func/updateTemplateTreeInfo'
          } else {
            url = '/fn/system/func/saveTemplateTreeInfo'
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
      hintFrame('确认删除？').then((res) => {
        const { dataEncode, id } = row
        this.$axios
          .post('/fn/system/func/deleteTemplateTreeInfo', { id }, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success('操作成功')
              this.getDataList()
            }
          })
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