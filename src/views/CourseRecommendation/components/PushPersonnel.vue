<template>
  <gc-model
    title="推送人员设置"
    width="800px"
    :visible.sync="pushPersonelVisible"
    @comfirm="pushPersonelComfirm"
    @close="close"
    custom-class="CourseRecommendation__PushPersonnel"
  >
    <el-form
      ref="pushInfoFormRef"
      :model="pushInfoForm"
      :rules="pushInfoRules"
      label-width="70px"
      class="item-mb30"
      @submit.native.prevent
      :disabled="disabled"
    >
      <el-form-item label="推送人员设置" class="ws dr-label" prop="pushMode">
        <div class="df">
          <gc-select
            class="mr20 w-290 padding-0"
            :options="pushModeOptions"
            v-model="pushInfoForm.pushMode"
          ></gc-select>
        </div>
      </el-form-item>
      <div v-if="pushInfoForm.pushMode === PUSH_ORGAN_POST" key="2">
        <el-form-item label="推送岗位" prop="positionSort">
          <el-checkbox-group v-model="pushInfoForm.positionSort" class="dfw">
            <el-checkbox
              :label="item.dataEncode"
              v-for="item in listScPosition"
              :key="item.dataEncode"
              style="width: 20%; margin-right: 0"
              >{{ item.dataValue }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="在岗时间" prop="posnStage">
          <el-checkbox-group v-model="pushInfoForm.posnStage" class="df">
            <el-checkbox label="1" style="width: 20%; margin-right: 0"
              >3个月内</el-checkbox
            >
            <el-checkbox label="2" style="width: 20%; margin-right: 0"
              >3-6个月</el-checkbox
            >
            <el-checkbox label="3" style="width: 20%; margin-right: 0"
              >6-12个月</el-checkbox
            >
            <el-checkbox label="4" style="width: 20%; margin-right: 0"
              >12-24个月</el-checkbox
            >
            <el-checkbox label="5" style="width: 20%; margin-right: 0"
              >24个月以上</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="推送机构" prop="orgId">
          <DropdownTree
            search
            ref="dropdownTree"
            show-checkbox
            :list="orgList"
            nodeKey="orgId"
            :props="{ label: 'orgName' }"
            :filter-node-method="filterNodeMethod"
            @change="orgIdChange"
          />
        </el-form-item>
      </div>
      <!-- <el-form-item label="推送序列" v-if="pushInfoForm.a === '2'">
                <el-radio-group v-model="pushInfoForm.radio">
                    <el-radio :label="6" class="sw-120">综金 </el-radio>
                    <el-radio :label="7" class="w123">顶级私行 </el-radio>
                    <el-radio :label="8" class="w127">银保 </el-radio>
                    <el-radio :label="8">普通 </el-radio>
                </el-radio-group>
            </el-form-item> -->
      <div v-if="pushInfoForm.pushMode === PUSH_WHITELIST" key="1">
        <el-form-item label="上传文件" class="mb10">
          <div class="df">
            <gc-fileInput btn-text="选择文件" @change="fileChange" />
            <div
              class="b926 ml20"
              @click="
                templateDownload('/common/file/downloadModule', {
                  fileCode: 'tkStudentList'
                })
              "
            >
              <span class="instructor-icons__download margin-0 gary-color">
                <i class="instructor-icons__download__icon"></i>
                模版下载
              </span>
            </div>
          </div>
        </el-form-item>
        <p class="mt10 aic tintColor">
          <i class="icons-wraning mr10"></i>
          需先下载模版，添加数据后再上传文件，请勿修改模版格式。
        </p>
        <el-form-item prop="files">
          <div
            class="doc-box mt20"
            v-for="(file, i) in pushInfoForm.files"
            :key="file.lastModified"
          >
            <span>
              <i class="operation__doc mr10"></i>
              {{ file.name }}
              <i class="operation__close ml15" @click="delFile(i)"></i>
            </span>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </gc-model>
</template>

<script>
import DropdownTree from '@/components/dropdown/DropdownTree'
import { jsonHeaders, templateDownload } from '../../../util/utils'
import {
  PUSH_MODE,
  PUSH_WHITELIST,
  PUSH_ORGAN_POST
} from '@/views/CourseRecommendation/enum'
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    DropdownTree
  },
  data() {
    return {
      pushPersonelVisible: false,
      // 验证表单
      pushInfoForm: {
        pushMode: '',
        positionSort: [],
        orgId: [],
        posnStage: [],
        files: []
      },
      // 验证规则
      pushInfoRules: {
        pushMode: [{ required: true, message: '请选择推送人员设置' }],
        positionSort: [{ required: true, message: '请选择推送岗位' }],
        orgId: [{ required: true, message: '请选择推送机构' }],
        posnStage: [{ required: true, message: '请选择在岗时间' }]
      },
      PUSH_WHITELIST,
      PUSH_ORGAN_POST,
      // 推送人员设置 下拉选项
      pushModeOptions: [
        {
          label: PUSH_MODE[PUSH_ORGAN_POST],
          value: PUSH_ORGAN_POST
        },
        {
          label: PUSH_MODE[PUSH_WHITELIST],
          value: PUSH_WHITELIST
        }
      ],
      // 推送岗位
      listScPosition: [],
      // 下载模版工具函数
      templateDownload,
      // 机构树数据
      orgList: []
    }
  },
  methods: {
    open() {
      this.pushPersonelVisible = true
    },
    getListScPosition() {
      this.$axios
        .post(
          '/fn/commons/dict/listDictsForSelector',
          {
            data: {
              dataCtgy: 'tk_push_position'
            }
          },
          jsonHeaders
        )
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.listScPosition = data
          }
        })
    },
    arrToTree(arr, data) {
      arr.forEach((v) => {
        const children = data.filter((child) => child.parentOrgId == v.orgId)
        if (children.length > 0) {
          v.children = children
          this.arrToTree(children, data)
        }
      })
    },
    getOrgList() {
      this.$axios
        .post('/fn/commons/privatewealth/listIctSysOrgs', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            const tree = data.filter((v) => v.orgLevel == 1)
            this.arrToTree(tree, data)
            this.orgList = tree
          }
        })
    },
    // 树节点搜索方法
    filterNodeMethod(value, data, node) {
      if (!value || !value.trim()) return true
      return data.orgName.includes(value)
    },
    orgIdChange(keys) {
      this.pushInfoForm.orgId = keys ? true : false
    },
    getOrgId() {
      const nodes = this.$refs.dropdownTree.getTreeRef().getCheckedNodes() || []
      const arr = nodes.map(item => ({
        id: item.orgId,
        parentId: item.parentOrgId
      }))
      const orgId = this.filterTreeData(arr)
      return { orgId }
    },
    // 过滤tree的子集
    filterTreeData(data) {
      // 将数据存储为以id为KEY的map索引数据列
      let map = {}
      data.forEach(item => {
        map[item.id] = 1
      })
      let result = []
      data.forEach(item => {
        // 以当前遍历项的parentId,去map对象中找到索引的id
        const parent = map[item.parentId]
        if (!parent) {
          result.push(item.id)
        }
      })
      return result
    },
    // 推送人员确认事件
    pushPersonelComfirm() {
      if (this.pushInfoForm.pushMode === PUSH_ORGAN_POST) {
        this.$refs.pushInfoFormRef.validate((valied) => {
          if (valied) {
            const data = Object.assign({}, this.pushInfoForm, this.getOrgId())
            this.$emit('confirm', data)
          }
        })
      } else if (this.pushInfoForm.pushMode === PUSH_WHITELIST) {
        if (!this.pushInfoForm.files.length) {
          return this.$message.warning('请上传文件')
        }
        this.$emit('confirm', this.pushInfoForm)
      }
    },
    fileChange($event) {
      this.pushInfoForm.files = [$event.target.files[0]]
    },
    delFile(i) {
      this.pushInfoForm.files.splice(i, 1)
    },
    close() {
      this.pushInfoForm = {
        pushMode: '',
        positionSort: [],
        orgId: [],
        posnStage: [],
        files: []
      }
      this.$refs.pushInfoFormRef.resetFields()
      this.pushPersonelVisible = false
    },
    setField(form) {
      Object.assign(this.pushInfoForm, form)
    }
  },
  mounted() {
    this.getListScPosition()
    this.getOrgList()
  }
}
</script>

<style lang="scss">
.CourseRecommendation__PushPersonnel {
  .el-form {
    width: 670px;
    margin: auto;
  }
}
</style>
