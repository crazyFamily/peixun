<template>
  <div class="tanlents-repository">
    <el-card class="search-card">
      <el-form :model="queryForm" inline ref="querFormRef">
        <el-form-item label="年度" prop="annual">
          <gc-select :options="yearsList" v-model="queryForm.annual"> </gc-select>
        </el-form-item>
        <el-form-item label="项目类型" prop="projectType">
          <gc-select :options="projectTypeList" v-model="queryForm.projectType" :clearable="false" @change="projectTypeChangeHandle"> </gc-select>
        </el-form-item>
        <el-form-item label="项目所属单位">
          <headquarter-tree
            :tree-options="treeOptions"
            :normalizer="normalizer"
            class="tree-container"
            v-model="treeData"
            :disabled="queryForm.projectType === '0' || treeData === 'headquarter'"
          ></headquarter-tree>
        </el-form-item>
        <el-form-item label="员工所在部门" prop="deptIds">
          <gc-institution v-model="queryForm.deptIds" ref="institutionRef" :left-show="false" busi-type="FL"> </gc-institution>
        </el-form-item>
        <el-form-item label="员工" prop="empInfo">
          <el-input v-model="queryForm.empInfo" placeholder="请输入姓名/UM"></el-input>
        </el-form-item>
        <div class="search-card__button">
          <el-button type="primary" @click="queryDatas">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="mt10">
      <div class="menu-right">
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
      </table-pagination>
    </el-card>
  </div>
</template>

<script>
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import { fetchQCSotreList, fetchQCSotreQryParam, fetchExportQCSotreList } from '@/fetch/tanlents'
import { CopyObj } from '@/plugins/until'
export default {
  name: 'TanlentsRepository',

  props: {},

  data() {
    return {
      // 年度下拉选项
      yearsList: [],
      // 项目类型
      projectTypeList: [],
      // 部门
      orgList: [],
      // 条线
      lineList: [],
      queryForm: {
        annual: '',
        projectType: '',
        lineIds: [],
        orgIds: [],
        empInfo: '',
        deptIds: [],
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      tableList: [],
      list: [
        {
          type: 'selection'
        },
        {
          label: '年度',
          prop: 'annual',
          type: 'setWidth',
          width: 70,
          formatter: row => `${row.annual}年`
        },
        {
          label: '项目名称',
          prop: 'projectName'
        },
        {
          label: '项目类型',
          prop: 'projectTypeDesc'
        },
        {
          label: '项目所属单位',
          prop: 'projectBlg'
        },
        {
          label: '姓名/UM帐号',
          prop: 'empInfo'
        },
        {
          label: '员工所在部门',
          prop: 'deptName'
        },
        {
          label: '岗位',
          prop: 'postName'
        }
      ],
      // 树级下拉
      treeOptions: [{ parentQcCode: null, qCCode: '', qCMsg: '全部' }],
      normalizer(node) {
        return {
          id: node.qCCode,
          label: node.qCMsg,
          children: node.subLine
        }
      },
      // 组件关系，空数据必须为null，否则会有UI显示问题
      treeData: null,
      selectedList: []
    }
  },

  components: {
    HeadquarterTree
  },

  computed: {
    isHideOrg() {
      return this.queryForm.projectType === '0'
    }
  },

  mounted() {
    this.treeData = null
    this._getSeachDatas()
    this.queryDatas()
  },

  methods: {
    // 获取查询条件的下拉列表
    async _getSeachDatas() {
      let data = {}
      let { annual, projectType, orgs, lines } = await fetchQCSotreQryParam({
        data
      })

      // 数据格式化处理
      this.yearsList = annual.map((item) => ({
        label: `${item.qCCode}年`,
        value: item.qCCode
      }))
      this.projectTypeList = projectType.map((item) => ({
        label: item.qCMsg,
        value: item.qCCode
      }))
      this.orgList = this._formatTreeData(orgs)
      this.lineList = this._formatTreeData(lines)
      this.queryForm.projectType = this.projectTypeList[0].value
      this.projectTypeChangeHandle(this.queryForm.projectType)
      // this.queryForm.projectType = this.queryForm.projectType || '0'
    },
    queryDatas() {
      this.queryForm.currPage = 1
      this.getList()
    },
    // 数据请求参数格式化
    _formatParams(params) {
      let res = CopyObj(params)
      // 条线和部门与项目类型会有级联关系，交互上是单选，后端设置为了list, 需要做下转化
      if (res.projectType === '28002' && this.treeData) res.lineIds = [this.treeData]
      if (res.projectType === '28003' && this.treeData) res.orgIds = [this.treeData]
      res.deptIds = res.deptIds.length ? [res.deptIds[res.deptIds.length - 1]] : []
      res.annual = res.annual ? [res.annual] : []
      res.projectType = res.projectType || '0'
      return res
    },
    async getList() {
      let data = this._formatParams(this.queryForm)
      let { list, total } = await fetchQCSotreList({ data })
      this.tableList = list
      this.queryForm.total = total
    },
    selectionHandle(list) {
      this.selectedList = list
    },
    async exportHandle() {
      let data
      if (this.selectedList.length) {
        data = { ids: this.selectedList.map((item) => item.id) }
      } else {
        data = this._formatParams(this.queryForm)
      }
      await fetchExportQCSotreList({ data })
    },
    reset() {
      this.treeData = null
      this.$refs.querFormRef.resetFields()
      this.$refs.institutionRef.createTreeData()
      this.queryForm.projectType = '0'
      this.queryDatas()
    },
    /**
     * 项目类型切换关联关系
     * 0: 全部，28001: 耀你闪亮， 28002: 条线， 28003: 机构
     * 0: 不显示项目所属单位
     * 28001: 固定选项为总行
     * 28002: 选项切换为条线
     * 28003: 选项切换为机构
     */
    projectTypeChangeHandle(value) {
      this.treeData = null
      switch (value) {
        case '0':
          this.treeOptions = [{ parentQcCode: null, qCCode: '', qCMsg: '全部' }]
          this.treeData = ''
          break
        case '28001':
          this.treeOptions = [{ parentQcCode: null, qCCode: 'headquarter', qCMsg: '总行' }]
          this.treeData = 'headquarter'
          break
        // 条线
        case '28002':
          this.treeOptions = this.lineList
          break
        // 机构
        case '28003':
          this.treeOptions = this.orgList
          break
      }
    },
    // 配合组件数据格式，如无存在下组，需要把下组相关的字段去除，避免UI渲染问题
    _formatTreeData(treeData) {
      for (let i = 0, j = treeData.length; i < j; i++) {
        if (Array.isArray(treeData[i].subLine) && treeData[i].subLine.length) {
          treeData[i].subLine = this._formatTreeData(treeData[i].subLine)
        } else {
          Reflect.deleteProperty(treeData[i], 'subLine')
        }
      }
      return treeData
    }
  }
}
</script>
<style lang='scss' scoped>
.search-card {
  overflow: unset;
}

.tree-container {
  min-width: 330px;
}
</style>