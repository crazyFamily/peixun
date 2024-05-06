<template>
  <div class="permission-container">
    <div class="main-container">
      <el-form
        :model="addForm"
        :rules="formRules"
        ref="formRef"
        :disabled="status === 'view'"
      >
        <template v-for="(item, index) in addForm.userList">
          <el-form-item
            :label="index === 0 ? `员工UM姓名: ` : ' '"
            :label-width="formLabelWidth"
            :prop="`userList[${index}].userName`"
            :rules="{ required: true, message: '请输入员工UM姓名' }"
            :key="index"
          >
            <div class="line-container">
              <div class="info-container">
                <el-input
                  v-model="item.userUm"
                  style="width: 100px"
                  @change="userNameBlurHandle(index)"
                  :disabled="status === 'edit'"
                ></el-input>
                -
                <el-input
                  v-model="item.userName"
                  style="width: 100px"
                  disabled
                ></el-input>
                -
                <el-input v-model="item.orgName" disabled style="width: 300px">
                  <span slot="prepend">岗位</span>
                </el-input>
              </div>
              <div class="control-container" v-if="status === 'create'">
                <span class="item active" @click="addUserHandle">添加</span>
                <span
                  class="item active"
                  v-if="index !== 0"
                  @click="delUserHandle(index)"
                  >删除</span
                >
                <!-- <span
                  class="item active"
                  v-if="index === 0"
                  @click="isUploadShow = true"
                  >批量添加</span
                > -->
              </div>
            </div>
          </el-form-item>
        </template>
        <el-form-item
          label="潜才角色: "
          :label-width="formLabelWidth"
          prop="roleId"
        >
          <gc-select
            class="p0"
            :options="roleList"
            v-model="addForm.roleId"
            @change="roleChangeHandle"
          >
          </gc-select>
        </el-form-item>
        <div class="line-org-wrapper" v-show="addForm.roleId !== HEADQUARTER_ADMIN">
          <el-form-item
            label="条线列表: "
            :label-width="formLabelWidth"
            prop="lineId"
            v-show="addForm.roleId !== '30012'"
          >
            <headquarter-tree
              :tree-options="lineTreeOptions"
              :normalizer="normalizer"
              class="tree-container"
              v-model="addForm.lineId"
              style="width: 200px"
              :disabled="status === 'view'"
            ></headquarter-tree>
          </el-form-item>
          <el-form-item
            label="机构列表: "
            :label-width="formLabelWidth"
            prop="orgId"
            v-show="addForm.roleId !== '30011'"
          >
            <headquarter-tree
              :tree-options="orgTreeOptions"
              :normalizer="normalizer"
              class="tree-container"
              v-model="addForm.orgId"
              style="width: 200px"
              :disabled="status === 'view'"
            ></headquarter-tree>
          </el-form-item>
        </div>
        <el-form-item
          label="申请日期: "
          :label-width="formLabelWidth"
          prop="applyDate"
          class="ws dr-label"
        >
          <el-input
            v-model="addForm.applyDate"
            disabled
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer-box dfc">
      <el-button class="button-w80-h30" @click="closeHandle">关闭</el-button>
      <el-button
        class="button-w80-h30"
        type="primary"
        @click="saveHandle"
        :disabled="status === 'view'"
        >提交</el-button
      >
    </div>
    <tanlents-upload
      :show.sync="isUploadShow"
      @comfirm="uploadConfirmHandle"
      :export-fetch="fetchExportFailedUser"
    ></tanlents-upload>
    <!-- 多选项目弹窗 -->
    <MultipleSelect
      :show.sync="isMultipleUser"
      :columns="list"
      :table-list="tableList"
      @save="userComfirmHandle"
    >
    </MultipleSelect>
  </div>
</template>

<script>
import CompTanlentsUpload from './CompTanlentsUpload.vue'
import HeadquarterTree from '@/components/tree/HeadquarterTree.vue'
import { closeCurrPageAndGoPath, getCurrentTime, CopyObj } from '@/util/utils'
import {
  fetchQryAuthUser,
  fetchQCSotreQryParam,
  fetchAddOrEditQCAuth,
  fetchQCAuthDetail,
  fetchExportFailedUser
} from '@/fetch/tanlents'
import MultipleSelect from '../components/MultipleSelect.vue'
import store from '@/store'
export default {
  name: 'AddTanlentsPermission',

  props: {},

  data() {
    return {
      roleList: [],
      baseInfoObj: { userName: '', userUm: '', orgName: '' },
      addForm: {
        um: [],
        roleId: '',
        lineId: null,
        orgId: null,
        applyDate: getCurrentTime(),
        userList: [{ userName: '', userUm: '', orgName: '' }]
      },
      formRules: {
        roleId: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择潜才角色'
          }
        ]
      },
      formLabelWidth: '100px',
      normalizer(node) {
        return {
          id: node.qCCode,
          label: node.qCMsg,
          children: node.subLine
        }
      },
      orgTreeOptions: [],
      lineTreeOptions: [],
      status: 'create',
      isUploadShow: false,
      isMultipleUser: false,
      list: [
        {
          type: 'selection'
        },
        {
          label: 'UM',
          prop: 'um'
        },
        {
          label: '姓名',
          prop: 'umName'
        },
        {
          label: '岗位',
          prop: 'position',
          width: '200'
        }
      ],
      tableList: [],
      userSelectedList: [],
      currentIndex: -1,
      isSaving: false,
      fetchExportFailedUser,
      HEADQUARTER_ADMIN: '30010'
    }
  },

  components: {
    'tanlents-upload': CompTanlentsUpload,
    HeadquarterTree,
    MultipleSelect
  },

  computed: {},

  mounted() {
    this._initData()
  },

  methods: {
    // 获取查询条件的下拉列表
    async _getSeachDatas() {
      let data = {tip: 'Y'}
      let { orgs, lines, role } = await fetchQCSotreQryParam({
        data
      })
      this.roleList = role.map((item) => ({
        label: item.qCMsg,
        value: item.qCCode
      }))
      this.orgTreeOptions = this._formatTreeData(orgs)
      this.lineTreeOptions = this._formatTreeData(lines)
    },
    async _initData() {
      await this._getSeachDatas()
      this.status = this.$route.params.type || this.status
      if (this.$route.params.id) {
        let res = await fetchQCAuthDetail({ id: this.$route.params.id })
        this.addForm = { ...this.addForm, ...this._formatRanderData(res) }
      }
    },
    _formatRanderData(data) {
      data.lineId = data.lineId || null
      data.orgId = data.orgId || null
      data.userList = [
        {
          userName: data.umName,
          userUm: data.um,
          orgName: data.position
        }
      ]
      data.um = []
      return data
    },
    closeHandle() {
      let { name } = this.$router
        .getRoutes()
        .find((item) => item.path === '/TanlentsPermission')
      closeCurrPageAndGoPath({ path: this.$route.path })
      this.$router.push({ name })
    },
    _formatParams(params) {
      let res = CopyObj(params)
      console.log(res, 'rrr')
      res.userList.forEach((item) => {
        res.um.push(item.userUm)
      })
      if (!res.lineId) res.lineId = ''
      if (!res.orgId) res.orgId = ''
      res.oprType = res.id ? 'edit' : 'add'
      Reflect.deleteProperty(res, 'userList')
      return res
    },
    saveHandle() {
      if (this.isSaving) return
      this.$refs.formRef.validate((v) => {
        if (!v) return false
        let data = this._formatParams(this.addForm)
        this.isSaving = true
        fetchAddOrEditQCAuth({ data })
          .then(() => {
            this.$message.success('提交成功')
            // 设置待更新状态
            store.commit('updateQueue', '/TanlentsPermission')
            this.closeHandle()
          })
          .finally(() => {
            this.isSaving = false
          })
      })
    },
    addUserHandle() {
      this.addForm.userList.push({ userName: '', orgName: '' })
    },
    delUserHandle(index) {
      this.addForm.userList.splice(index, 1)
    },
    // 员工姓名失焦需要进行部门检索，并填入信息
    async userNameBlurHandle(index) {
      let userList = this.addForm.userList
      if (!userList[index].userUm) {
        this._setUserInfo(index)
        return
      }
      try {
        let res = await fetchQryAuthUser({ um: userList[index].userUm })
        if (!res || !res.length) {
          this.$message.warning('没有找到对应员工信息')
          this._setUserInfo(index)
        } else if (res.length === 1) {
          this._setUserInfo(index, res[0])
        } else {
          this.isMultipleUser = true
          this.tableList = res
          this.currentIndex = index
        }
      } catch (e) {
        console.log(e, 'ee')
        this._setUserInfo(index)
      }
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
    uploadConfirmHandle(list) {
      if (!list.length) return
      this.addForm.userList = list.map((item) => {
        return {
          userUm: item.um,
          userName: item.umName,
          orgName: item.position
        }
      })
    },
    roleChangeHandle() {
      this.addForm.orgId = null
      this.addForm.lineId = null
    },
    userComfirmHandle(data) {
      console.log(data, 'ddd')
      this._setUserInfo(this.currentIndex, data)
      this.userCloseHandle()
    },
    userCloseHandle() {
      this.isMultipleUser = false
      this.currentIndex = -1
    },
    _setUserInfo(index, info) {
      let data
      if (!info || !Object.keys(info).length) {
        data = CopyObj(this.baseInfoObj)
      } else {
        data = {
          userUm: info.um,
          userName: info.umName,
          orgName: info.position
        }
      }
      let userList = this.addForm.userList
      this.$set(userList, index, data)
    }
  },
  activated() {
    this._initData()
  }
}
</script>
<style lang='scss' scoped>
.permission-container {
  width: 100%;
  min-height: 100%;
  background-color: #fff;
  box-sizing: border-box;
}

.main-container {
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
}

.line-container {
  display: flex;
}

.info-container {
  margin-right: 10px;
}

.control-container {
  .item {
    margin: 0 5px;
  }
}

.tanlents-upload-footer {
  padding: 15px 24px !important;
  border-top: 1px solid #eaecf1;
  box-sizing: border-box;
  text-align: right;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;

  .item-button {
    padding: 0 10px;
    min-width: 80px;
    height: 30px;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>