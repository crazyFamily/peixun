<template>
  <div class="emial-temp">
    <div class="main-container">
      <el-form :model="queryForm" :rules="formRules" inline ref="pushRuleRef">
        <p class="rule-title mt0">基础信息</p>
        <el-form-item
          class="block-item"
          label="推送方式"
          label-width="110px"
          prop="pushType"
        >
          <el-radio-group
            v-model="queryForm.pushType"
            :disabled="isDetail"
            @change="pushTypeChangeHandle"
          >
            <el-radio label="0">立即推送</el-radio>
            <el-radio label="1">定时推送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          class="block-item"
          label="选择日期"
          label-width="110px"
          prop="pushTime"
          v-show="queryForm.pushType === '1'"
        >
          <el-date-picker
            v-model="queryForm.pushTime"
            type="datetime"
            placeholder="选择日期时间"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="isDetail"
          >
          </el-date-picker>
        </el-form-item>
        <p class="rule-title">
          推送对象-条件推送
          <span class="color-gray">
            （推送对象为同时满足组织和岗位条件的人员）
          </span>
        </p>
        <el-form-item
          class="block-item"
          label="组织"
          label-width="110px"
          prop="pushTarget"
        >
          <treeselect
            class="case-org-tree inherit"
            :multiple="true"
            :options="treeOptions"
            :load-options="loadOptions"
            :normalizer="normalizer"
            placeholder="请选择组织"
            v-model="treeData"
            :auto-load-root-options="false"
            :disabled="isDetail"
            @input="changeaaHandle"
            ref="treeselectRef"
          />
          <el-form-item label="只选外勤" class="ml30">
            <el-switch v-model="queryForm.inLegworkCtgy" active-value="Y" inactive-value="N" :disabled="isDetail"></el-switch>
          </el-form-item>
        </el-form-item>
        <el-form-item
          class="block-item"
          label="满足条件人数"
          label-width="110px"
          prop="orgId"
        >
          <el-input class="w80 mr20" :value="userNumber"></el-input>
          <el-button class="button-w80-h30" @click="caculateHandle"
            >计算</el-button
          >
          <el-button
            class="button-w80-h30"
            type="primary"
            @click="exportOrgHandle"
            >导出名单</el-button
          >
        </el-form-item>
        <p class="rule-title mb0">
          推送对象-名单推送
          <span class="color-red"
            >名单推送方式一次推送人数不能超过15000人(不包含组织推送方式所选的人数)！</span
          >
        </p>
        <el-form-item class="block-item push-user-container" prop="pushTarget">
          <div class="buttons-container mt20">
            <el-button
              class="button-w80-h30"
              @click="isSelectCaseUserShow = true"
              :disabled="isDetail"
              >添加</el-button
            >
            <el-button
              class="button-w80-h30"
              @click="openImportHandle"
              :disabled="isDetail"
              >导入</el-button
            >
            <el-button
              class="button-w80-h30"
              @click="clearUserHandle"
              :disabled="isDetail"
              >清空</el-button
            >
            <el-button class="button-w80-h30" @click="refreshHandle"
              >刷新</el-button
            >
          </div>
          <table-pagination
            class="table-list"
            :list="pushUserColumn"
            :tableList="pushUserTableList"
            :queryForm="pushUserQueryForm"
            :getList="getUserList"
            ref="tablePagination"
          >
            <el-table-column label="操作" min-width="90" fixed="right">
              <template slot-scope="scope">
                <span
                  class="active"
                  @click="removeUserRow(scope.row)"
                  v-show="!isDetail"
                  >移除</span
                >
              </template>
            </el-table-column>
          </table-pagination>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">返回</el-button>
      <el-button class="button-w80-h30" type="primary" @click="confirmHandle"
        >确定</el-button
      >
    </div>
    <comp-select-case-user
      :show.sync="isSelectCaseUserShow"
      :uuid="uuid"
      @save="caseUserSaveHandle"
    >
    </comp-select-case-user>
  </div>
</template>

<script>
import CompSelectCaseUser from './CompSelectCaseUser.vue'
import {
  fetchSelectOrgTagList,
  fetchCountOrgPushCaseUser,
  fetchExportOrgPushCaseUser,
  fetchListToPushCaseUsers,
  fetchDeletePushCaseUser
} from '@/fetch/caseCenter'
import { fetchSelectTree } from '@/fetch/public'
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'CasePushRule',

  props: {},

  data() {
    let requiredHandle = (message, trigger = 'blur') => ({
      required: true,
      trigger,
      message
    })
    return {
      isSelectCaseUserShow: false,
      queryForm: {
        pushType: '0',
        pushTime: '',
        pushTarget: ''
      },
      formRules: {
        pushType: [requiredHandle('请输入案例推送名称')],
        pushTime: [
          {
            validator: (rule, value, callback) => {
              if (this.queryForm.pushType === '1' && !this.queryForm.pushTime) {
                return callback(new Error('定时推送需要设置推送日期'))
              }
              return callback()
            }
          }
        ],
        pushTarget: [
          {
            validator: (rule, value, callback) => {
              if (
                !this.pushUserTableList.length &&
                (!this.treeData || !this.treeData.length)
              ) {
                return callback(new Error('推送组织或推送名单最少要设置一项'))
              }
              return callback()
            }
          }
        ]
      },
      userNumber: '',
      pushUserColumn: [
        { label: '序号', type: 'index' },
        { label: 'UM号', prop: 'umId' },
        { label: '姓名', prop: 'umName' }
      ],
      pushUserTableList: [],
      pushUserQueryForm: {
        currPage: 1,
        pageSize: 10,
        total: 0
      },
      treeData: null,
      defaultProps: {
        id: 'orgId',
        children: 'children',
        label: 'orgName',
        isLeaf: 'leaf'
      },
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName
        }
      },
      treeOptions: null,
      uuid: '',
      isDetail: false,
      fetchSelectOrgTagList
    }
  },

  components: {
    CompSelectCaseUser,
    treeselect
  },

  computed: {},

  mounted() {},

  methods: {
    closeHandle(params) {
      this.userNumber = ''
      this.$router.push({ name: '新增案例推送', params })
    },
    confirmHandle() {
      this.$refs.pushRuleRef.validate(async (v) => {
        if (!v) return false
        this.closeHandle({
          ruleInfo: {
            ...this.queryForm,
            pushOrg: (this.treeData || []).join(',')
          }
        })
      })
    },
    pushUserGetList() {
      this.getUserList()
    },
    openImportHandle() {
      this.$router.push({ name: '案例推送导入', params: { uuid: this.uuid } })
    },
    async loadOptions({ action, parentNode, callback }) {
      if (action === 'LOAD_ROOT_OPTIONS') {
        this._treeRootData()
        callback()
      }
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        parentNode.children = await this._getTreeData(
          {
            orgId: parentNode.orgId,
            busiType: 'LS',
            module: 'case'
          },
          true
        )
        callback()
      }
    },
    async _treeRootData() {
      this.treeOptions = await this._getTreeData({
        busiType: 'LS',
        module: 'case'
      })
    },
    async _getTreeData(param, isChildrenFetch = false) {
      let res = await fetchSelectTree(param)
      // let { orgList } = res[0]
      let orgList = res
      let data = this._formatTreeData(orgList)

      if (this.$route.params.ruleInfo?.pushOrgPrn) {
        let list = this.$route.params.ruleInfo.pushOrgPrn.map((item) => {
          let o = item.split('|')
          // o.shift()
          o.pop()
          return o
        })
        list = [...new Set(list.flat())]
        let childrenList = []
        for (let i = 0; i < list.length; i++) {
          let orgId = list[i]
          let res = await fetchSelectTree({
            orgId: orgId,
            busiType: 'LS',
            module: 'case'
          })
          let formatList = this._formatTreeData(
            // let orgList = res.map((orgItem) => ({
            //   ...orgItem,
            //   parent: orgId
            // }))
            res.map((orgItem) => ({
              ...orgItem,
              parent: orgId
            }))
          )
          childrenList = [...childrenList, ...formatList]
        }
        childrenList = this.toTree(childrenList)
        console.log(childrenList, '---- ccc ')
        data.forEach((item, i) => {
          let c = childrenList.filter((cItem) => cItem.parent === item.orgId)
          if (c.length) {
            data[i].children = c
          }
        })
      }

      return data
    },
    toTree(data) {
      let obj = {}, // 使用对象重新存储数据
        res = [], // 存储最后结果
        len = data.length

      // 遍历原始数据data，构造obj数据，键名为orgId，值为数据
      for (let i = 0; i < len; i++) {
        obj[data[i]['orgId']] = data[i]
      }

      // 遍历原始数据
      for (let j = 0; j < len; j++) {
        let list = data[j]
        // 通过每条数据的 pid 去obj中查询
        let parentList = obj[list['parent']]

        if (parentList) {
          // 根据 pid 找到的是父节点，list是子节点，
          if (!parentList['children']) {
            parentList['children'] = []
          }
          // 将子节点插入 父节点的 children 字段中
          parentList['children'].push(list)
        } else {
          // pid 找不到对应值，说明是根结点，直接插到根数组中
          res.push(list)
        }
      }

      return res
    },
    _formatTreeData(data) {
      return data.map((item) => {
        let res = { ...item, leaf: item.isSpread === 'N' }
        if (item.isSpread === 'Y') {
          res.children = null
        }
        return res
      })
    },
    async caculateHandle() {
      if (this._checkOrgSelected()) {
        this.userNumber = await fetchCountOrgPushCaseUser({
          orgIds: this.treeData.join(','),
          inLegworkCtgy: this.queryForm.inLegworkCtgy
        })
      }
    },
    async exportOrgHandle() {
      if (this._checkOrgSelected()) {
        await fetchExportOrgPushCaseUser({ orgIds: this.treeData.join(','), inLegworkCtgy: this.queryForm.inLegworkCtgy })
      }
    },
   _checkOrgSelected() {
      if (!this.treeData || !this.treeData.length) {
        this.$message.warning('请先选择机构')
        return false
      }
      return true
    },
    refreshHandle() {
      this.queryUserList()
      this.$message.success('已刷新')
    },
    queryUserList() {
      this.pushUserQueryForm.currPage = 1
      this.getUserList()
    },
    async getUserList() {
      let data = {
        batchId: this.uuid,
        ...this.pushUserQueryForm
      }
      let { list, total } = await fetchListToPushCaseUsers({ data })
      this.pushUserTableList = list
      this.pushUserQueryForm.total = total
    },
    async clearUserHandle() {
      try {
        await this.removeTips()
        let data = { batchId: this.uuid, type: 'batch' }
        await fetchDeletePushCaseUser({ data })
        this.getUserList()
      } catch {}
    },
    // 删除操作的二次提示
    removeTips() {
      return new Promise((resolve, reject) => {
        this.$confirm('是否确定清空', '提示', {
          confirmButtonText: '确定',
          showCancelButton: true,
          cancelButtonClass: 'cancel',
          customClass: 'loginTimeout'
        })
          .then(() => {
            return resolve()
          })
          .catch(() => {
            return reject()
          })
      })
    },
    caseUserSaveHandle() {
      this.getUserList()
    },
    async removeUserRow(row) {
      let data = {
        batchId: this.uuid,
        type: 'one',
        umId: row.umId
      }
      await fetchDeletePushCaseUser({ data })
      this.getUserList()
    },
    _initData() {
      this.$route.params.isDetail !== undefined &&
        (this.isDetail = this.$route.params.isDetail)
      if (this.$route.params.ruleInfo) {
        let { pushType, pushTimeStr, pushTime, pushOrg, inLegworkCtgy } =
          this.$route.params.ruleInfo
        this.queryForm.pushType = pushType || this.queryForm.pushType || '0'
        this.queryForm.pushTime = pushTimeStr || pushTime
        this.queryForm.inLegworkCtgy = inLegworkCtgy
        console.log(this.queryForm, pushType, pushTime, pushTimeStr)
        this.treeData = pushOrg ? pushOrg.split(',') : null
        if (this.treeData && !this.treeData.length) this.treeData = null
      }
    },
    pushTypeChangeHandle() {
      // this.queryForm.pushTime == ''
    },
    changeaaHandle(v) {
      console.log(v, '---vvv')
    }
  },

  activated() {
    if (this.$route.params.uuid) {
      this.uuid = this.$route.params.uuid
      this.getUserList()
    }
    this._initData()
    this._treeRootData()
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === '案例推送导入') {
      next((vm) => {
        vm.getUserList()
      })
    } else {
      next()
    }
  }
}
</script>
<style lang='scss' scoped>
.main-container {
  background-color: #fff;
  padding: 20px;
}

.rule-title {
  // margin: 10px 0;
  font-size: 14px;
  padding-left: 10px;
  margin-bottom: 20px;
  margin-top: 30px;
  position: relative;

  &::before {
    content: '';
    width: 3px;
    height: 10px;
    background-color: $themeColor;
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .color-red {
    font-size: 12px;
    color: #e02020;
  }

  .color-gray {
    font-size: 12px;
    color: $color9;
  }
}

.block-item {
  display: block;

  &.push-user-container {
    :deep(.el-form-item__content) {
      width: 100%;
    }
  }
}

.w80 {
  width: 80px;
}

.table-list {
  width: 100%;
  margin-top: 20px;
}

.case-org-tree {
  width: 450px;
}
.inherit {
  display: inline-block;
}
:deep(.case-org-tree){
  .vue-treeselect__multi-value-item {
    background-color: $themeColor;
    color: #fff;
  }
  .vue-treeselect__value-remove {
    color: #fff;
  }
  .vue-treeselect__checkbox--checked {
    background-color: $themeColor;
    border-color: $themeColor;
  }
  .vue-treeselect__label-container:hover .vue-treeselect__checkbox--unchecked {
    border-color: $themeColor;
  }
}
</style>
