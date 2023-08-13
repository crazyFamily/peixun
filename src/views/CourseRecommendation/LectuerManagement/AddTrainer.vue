<template>
  <div class="trainer-management__add-trainer">
    <!-- 新增表单 -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      label-width="70px"
      ref="addRef"
    >
      <el-form-item label="讲师类型" prop="isExternal" v-show="isSuperAdmin">
        <!-- 编辑状态下不可进行切换 -->
        <el-radio-group v-model="addForm.isExternal" :disabled="disabled">
          <el-radio label="N">内部讲师</el-radio>
          <el-radio label="Y">外部讲师</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="讲师UM" prop="teacherUm">
        <el-input
          placeholder="请输入讲师UM"
          @blur="checkUM"
          v-model="addForm.teacherUm"
          :disabled="disabled"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="讲师姓名" prop="teacherName">
        <el-input
          :placeholder="
            addForm.isExternal === 'N' ? '输入讲师UM自动关联' : '输入讲师姓名'
          "
          :disabled="addForm.isExternal === 'N'"
          v-model="addForm.teacherName"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="headImgList">
        <gc-upload
          ref="uploadRef"
          :size="1024"
          :list="fileList"
          :custom-url="APIUploadPicFile"
          v-model="addForm.headImgList"
        ></gc-upload>
        <p class="tintColor mt10">
          推荐比例1：1，支持 jpg、png格式，文件大小不超过1M
        </p>
      </el-form-item>
      <el-form-item label="讲师性别" prop="gender">
        <el-radio-group v-model="addForm.gender">
          <el-radio label="m">男</el-radio>
          <el-radio label="w">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="擅长领域">
        <TreeDropdown
          multiple
          ref="treeDropdownRef"
          label="tagName"
          show-checkbox
          check-strictly
          node-key="tagId"
          :max-value="10"
          :list="goodAtAreasOptions"
          :props="{ label: 'tagName' }"
          :contentArr="goodAtAreasNames"
          v-model="addForm.goodAtAreas"
          placeholder="请选择标签"
        />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <div class="df">
          <el-select
            multiple
            class="f1"
            placeholder="请选择头衔"
            v-model="addForm.titleId"
            :multiple-limit="10"
          >
            <el-option
              v-for="item in titleIdOptions"
              :key="item.titleId"
              :label="item.titleName"
              :value="item.titleId"
            ></el-option>
          </el-select>
          <el-button
            @click="titleDialog = true"
            class="button-60-h30 button-my-primary-plain ml10"
            >自定义</el-button
          >
        </div>
      </el-form-item>
      <el-form-item
        label="讲师简介"
        prop="introduce"
        class="mb0"
        :rules="[
          {
            required: addForm.isExternal === 'N',
            message: '请填写讲师简介',
            trigger: 'blur'
          }
        ]"
      >
        <el-input
          type="textarea"
          resize="none"
          class="h-90"
          maxlength="250"
          show-word-limit
          placeholder="250字以内"
          v-model="addForm.introduce"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 底部按钮 -->
    <div class="footer-box dfc mt60">
      <el-button class="button-w80-h30" @click="cancel">取消</el-button>
      <el-button class="button-w80-h30" type="primary" @click="save"
        >保存</el-button
      >
    </div>

    <!-- 自定义头衔dialog -->
    <gc-model
      width="500px"
      title="自定义头衔"
      :visible.sync="titleDialog"
      @close="close"
      @comfirm="customTitle"
    >
      <div class="aic mb30 mt45">
        <span>头衔名称</span>
        <el-input
          class="f1 ml10"
          maxlength="10"
          show-word-limit
          v-model.trim="titleName"
        ></el-input>
      </div>
    </gc-model>
  </div>
</template>

<script>
import {
  CopyObj,
  resetObj,
  jsonHeaders,
  handleUdmpHref,
  getCurriculumTree,
  closeCurrPageAndGoPath
} from '@/util/utils'
import gcUpload from '@/components/upload'
import TreeDropdown from '@/components/dropdown/TreeDropdown'
import { APIUploadPicFile } from '@/fetch/public'
export default {
  name: 'CRAddTrainer',
  components: { gcUpload, TreeDropdown },
  data() {
    return {
      addForm: {
        teacherUm: '',
        teacherName: '',
        headImgList: [],
        headFileName: '',
        gender: '',
        goodAtAreas: [],
        titleId: [],
        introduce: '',
        // 是否外部讲师
        isExternal: 'N'
      },
      addFormRules: {
        teacherUm: [{ required: true, message: '请填写UM' }],
        teacherName: [{ required: true, message: '请填写讲师名称' }],
        gender: [{ required: true, message: '请选择讲师性别' }],
        // headImgList: [
        //     {
        //         required: true,
        //         message: "请选择头像",
        //         type: "array",
        //         trigger: "change"
        //     }
        // ],
        goodAtAreas: [
          {
            required: true,
            message: '请选择擅长领域',
            type: 'array',
            trigger: 'change'
          }
        ]
        // introduce: [
        //     {
        //         required: true,
        //         message: "请填写讲师简介",
        //         trigger: "blur"
        //     }
        // ]
      },
      // 擅长领域下拉选项
      goodAtAreasOptions: [],
      // 讲师头衔下拉选项
      titleIdOptions: [],
      // 自定义头衔 dialog 状态
      titleDialog: false,
      // 自定义头衔
      titleName: '',
      // 修改时查询的讲师信息
      trainerObj: {},
      // 修改讲师信息时的图片数组
      fileList: [],
      // 修改讲师时 标签数组
      goodAtAreasNames: [],
      timer: null,
      // 修改还是新增
      state: '',
      isSuperAdmin: false,
      APIUploadPicFile
    }
  },
  methods: {
    // 获取标签
    getTag() {
      const tagType = '2',
        blgStripLine = 'LS'
      getCurriculumTree(
        tagType,
        blgStripLine,
        1,
        '/fn/course/tag/selectCourseTagsForTk'
      ).then((res) => {
        this.goodAtAreasOptions = res
      })
    },
    // 获取 讲师头衔下拉选项
    getTitleIdOptions() {
      this.$axios
        .post('/fn/privatewealth/teacher/titleList', {}, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.titleIdOptions = data
          }
        })
    },
    // 自定义头衔
    customTitle() {
      if (!this.titleName) return
      const data = { titleName: this.titleName }
      this.$axios
        .post('/fn/privatewealth/teacher/addTeacherTitle', data, jsonHeaders)
        .then((res) => {
          const { code, data } = res.data
          if (code === 0) {
            this.$message.success('添加成功')
            this.getTitleIdOptions()
            this.titleDialog = false
          }
        })
    },
    close() {
      this.titleName = ''
      this.titleDialog = false
    },
    // 取消 按钮点击事件
    cancel() {
      // 重置表单
      this.$refs.addRef.resetFields()
      // 关闭当前页面跳到指定页面
      closeCurrPageAndGoPath({ path: '/CRLecturerManagement' })
    },
    // 保存 按钮点击事件
    save() {
      this.$refs.addRef.validate((valied) => {
        if (valied) {
          const data = CopyObj(this.addForm)
          if (data.headImgList.length) {
            ;({ udmpId: data.headUdmp, fileName: data.headFileName } =
              data.headImgList[0])
          }
          data.goodAtAreas = data.goodAtAreas.join(',')
          data.titleId = data.titleId.join(',')
          let url = '/fn/privatewealth/teacher/addTeacher'
          if (this.state === 'edit') {
            url = '/fn/privatewealth/teacher/updateTeacher'
          }
          this.$axios.post(url, { data }, jsonHeaders).then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.$message.success(
                `${this.state === 'edit' ? '修改' : '新增'}成功`
              )
              this.cancel()
            }
          })
        }
      })
    },
    // 修改讲师信息时 转换后台的数据
    transitionData(params) {
      const {
        teacherUm,
        teacherName,
        headFileName,
        headUdmp,
        goodAtAreasId,
        goodAtAreasName,
        titleId,
        introduce,
        id,
        isExternal,
        gender
      } = params
      this.addForm.teacherUm = teacherUm
      this.addForm.teacherName = teacherName
      this.addForm.goodAtAreas = goodAtAreasId
        ? goodAtAreasId.split(',').filter((_) => _)
        : []
      this.goodAtAreasNames = goodAtAreasName
        ? goodAtAreasName.split(',').filter((_) => _)
        : []
      this.addForm.titleId = titleId?.split(',').filter((_) => _) || []
      this.addForm.introduce = introduce
      if (headUdmp) {
        this.addForm.headImgList = [
          { fileName: headFileName, udmpId: headUdmp }
        ]
        this.fileList = [
          {
            url: handleUdmpHref(headUdmp),
            name: headFileName,
            uid: headUdmp
          }
        ]
      }
      this.addForm.id = id
      this.addForm.isExternal = isExternal
      this.addForm.gender = gender
    },
    // 检查UM号
    checkUM() {
      // 外部讲师不需要做校验
      if (this.addForm.isExternal === 'Y') return
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
        const data = {
          teacherUm: this.addForm.teacherUm,
          busiType: this.$store.state.userInfo.blgStripLine
        }
        this.$axios
          .post('/fn/privatewealth/teacher/checkUm', data, jsonHeaders)
          .then((res) => {
            const { code, data } = res.data
            if (code === 0) {
              this.addForm.teacherName = data.empName
            } else {
              this.addForm.teacherName = ''
            }
          })
          .catch((err) => {
            this.addForm.teacherName = ''
          })
      }, 500)
    },
    resetFormData() {
      resetObj(this.addForm)
      this.$refs.addRef.resetFields()
      this.$refs.uploadRef.clear()
      this.$refs.treeDropdownRef.clear()
    }
  },
  mounted() {
    this.isSuperAdmin = this.$store.state.userInfo.roleIds.includes('50001')
    this.getTag()
    this.getTitleIdOptions()
  },
  activated() {
    const params = this.$route.params
    if (params.state) {
      this.state = params.state
      this.resetFormData()
    }
    if (params.id) {
      this.transitionData(params)
      this.trainerObj = params
    }
  },
  computed: {
    disabled() {
      return this.state === 'edit'
    }
  }
}
</script>

<style lang="scss">
.trainer-management__add-trainer {
  background-color: #fff;
  padding-top: 30px;
  .el-form {
    width: 670px;
    margin: auto;
    background-color: #fff;
    .el-form-item {
      margin-bottom: 30px;
    }
  }
}
</style>
