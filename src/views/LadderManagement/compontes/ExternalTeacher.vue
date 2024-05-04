<template>
  <div class="external-teacher-container">
    <div class="nav-container">
      <el-tabs
        v-model="activeTeacher"
        type="card"
        closable
        @tab-remove="teacherRemoveHandle"
        :before-leave="teacherTagChangeHandle"
        class="ladder-tabs"
        :class="{ 'disabled-style': disabled }"
      >
        <template v-for="(item, index) in navTeachers">
          <el-tab-pane
            :key="index"
            :label="item.label"
            :name="item.value"
          ></el-tab-pane>
        </template>
      </el-tabs>
      <span
        class="add-button active"
        @click="addTeacherHandle"
        v-show="!disabled"
        >+新增讲师</span
      >
    </div>
    <div
      class="teacher-info-container"
      v-for="(formItem, index) in teacherFormList.list"
      :key="index"
      v-show="formItem.symbolValue === activeTeacher"
    >
      <el-form
        :model="teacherFormList"
        ref="teacherFormRef"
        label-width="100px"
        class="teacher-info-form"
        inline
        :disabled="disabled"
      >
        <el-form-item
          label="讲师姓名"
          :prop="`list[${index}].teacherName`"
          :rules="{ required: true, message: '请输入名称' }"
          class="form-item"
        >
          <el-input
            v-model="teacherFormList.list[index].teacherName"
            @input="teacherNameChangeHandle"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="讲师ID"
          :prop="`list[${index}].teacherId`"
          class="form-item"
        >
          <el-input
            v-model="teacherFormList.list[index].teacherId"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          :prop="`list[${index}].teacherSex`"
          :rules="{ required: true, message: '请选择性别' }"
          class="form-item"
        >
          <el-radio-group v-model="teacherFormList.list[index].teacherSex">
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="报价"
          :prop="`list[${index}].teacherOffer`"
          :rules="validateOffer"
          class="form-item"
        >
          <el-input v-model="teacherFormList.list[index].teacherOffer">
            <span slot="append">元</span>
          </el-input>
        </el-form-item>
        <el-form-item
          label="擅长领域"
          :prop="`list[${index}].expertField`"
          :rules="{ required: true, message: '请输入擅长领域' }"
          class="form-item full-item"
        >
          <el-input
            type="textarea"
            class="full-item"
            :rows="5"
            maxlength="1000"
            show-word-limit
            v-model="teacherFormList.list[index].expertField"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="供应商名称"
          :prop="`list[${index}].supplyName`"
          :rules="{ required: true, message: '请输入供应商名称' }"
          class="form-item full-item"
        >
          <el-input v-model="teacherFormList.list[index].supplyName"></el-input>
        </el-form-item>
        <el-form-item
          label="联系人姓名"
          :prop="`list[${index}].contactName`"
          :rules="{ required: true, message: '请输入联系人姓名' }"
          class="form-item"
        >
          <el-input
            v-model="teacherFormList.list[index].contactName"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人电话"
          :prop="`list[${index}].contactPhone`"
          :rules="validatePhone"
          class="form-item"
        >
          <el-input
            v-model="teacherFormList.list[index].contactPhone"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="联系人邮箱"
          :prop="`list[${index}].contactEmail`"
          :rules="validateEmail"
          class="form-item full-item"
        >
          <el-input
            v-model="teacherFormList.list[index].contactEmail"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * 外部讲师组件
 * 通过v-model进行绑定,类型为Object 结果数据会反映到上面
 *
 * resultData: Array,  结果数据，通过校验的结果数据
 *
 * list: Array, 传进来的数据，会组合到讲师数据上去。
 */
import { CopyObj, uuid } from '@/util/utils'
export default {
  name: 'ExternalTeacher',

  props: {
    value: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      activeTeacher: '0',
      navTeachers: [],
      teacherForm: {
        teacherName: '',
        teacherId: '',
        teacherSex: '1',
        teacherOffer: '',
        expertField: '',
        supplyName: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
      },
      teacherFormList: {
        list: []
      },
      teacherFormRules: {},
      isFirst: false
    }
  },

  watch: {
    'teacherFormList.list': {
      handler(n) {
        let resultData = []
        let validate = true
        n.forEach((item) => {
          // 加兼容是为了初始加载问题
          if (item.teacherName) {
            resultData.push(item)
          } else {
            validate = false
          }
        })
        this.$emit('input', resultData)
      },
      deep: true
    },
    list: {
      handler(n) {
        if (n.length) {
          this._initData(n)
        }
      },
      immediate: true
    }
  },

  components: {},

  computed: {
    validateEmail() {
      return {
        validator: (rule, value, callback) => {
          let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (emailReg.test(value) || !value) {
            return callback()
          } else {
            callback(new Error('邮箱格式错误'))
          }
        }
      }
    },
    validatePhone() {
      return [
        { required: true, message: '请输入手机号码' },
        {
          validator: (rule, value, callback) => {
            //手机电话
            var mobileReg = /^1[3456789]\d{9}$/
            //座机电话
            var phoneReg = /^((0\d{2,3})-)?(\d{7,8})$/
            if (phoneReg.test(value) || mobileReg.test(value)) {
              return callback()
            } else {
              callback(new Error('手机或电话格式错误'))
            }
          }
        }
      ]
    },
    validateOffer() {
      return [
        { required: true, message: '请输入讲师报价' },
        {
          validator: (rule, value, callback) => {
            // 正整数
            var numberReg = /^[1-9]\d*$/
            if (numberReg.test(value)) {
              return callback()
            } else {
              callback(new Error('请输入正整数'))
            }
          }
        }
      ]
    }
  },

  mounted() {
    !this.list.length && this.addTeacherHandle(true)
  },

  methods: {
    _initData(data) {
      let symbolData = CopyObj(data).map((item) => ({
        ...item,
        symbolValue: uuid()
      }))
      this.teacherFormList.list = symbolData
      this.navTeachers = []
      symbolData.forEach((item) => {
        this.navTeachers.push({
          // title: item.teacherName,
          label: item.teacherName,
          value: item.symbolValue,
          symbolValue: item.symbolValue
          // name: item.symbolValue
        })
      })
      this.activeTeacher = this.navTeachers[0].symbolValue
    },
    teacherRemoveHandle(value) {
      if (this.disabled) return
      let tabs = this.navTeachers
      let activeName = this.activeTeacher
      let nexTab
      if (activeName === value) {
        tabs.forEach((tab, index) => {
          if (tab.value === value) {
            nexTab = tabs[index + 1] || tabs[index - 1]
            if (nexTab) {
              activeName = nexTab.value
            }
          }
        })
      }

      this.activeTeacher = activeName
      let resultformlist = []
      this.teacherFormList.list.forEach((formItem) => {
        if (
          formItem.symbolValue !==
          tabs.find((item) => item.value === value).symbolValue
        ) {
          resultformlist.push(formItem)
        }
      })

      this.$set(this.teacherFormList, 'list', resultformlist)
      this.navTeachers = tabs.filter((tab) => tab.value !== value)
    },
    addTeacherHandle(isFirst) {
      if (isFirst) this.isFirst = true
      if (!this.validateForm()) return
      let symbolValue = uuid()
      this.navTeachers.push({
        label: '未命名',
        value: symbolValue,
        symbolValue
      })
      this.teacherFormList.list.push({
        ...CopyObj(this.teacherForm),
        symbolValue
      })
      this.activeTeacher = symbolValue
    },
    validateForm() {
      let res = true
      if (this.$refs.teacherFormRef) {
        this.$refs.teacherFormRef.forEach((formRef) => {
          formRef.validate((v) => {
            if (!v) res = false
          })
        })
      }
      return res
    },
    teacherNameChangeHandle(value) {
      let findItem = this.navTeachers.find(
        (item) => item.value === this.activeTeacher
      )
      findItem.label = value || '未命名'
    },
    teacherTagChangeHandle() {
      if (this.disabled) return true
      if (this.isFirst) {
        this.isFirst = false
        return true
      }
      if (this.validateForm()) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang='scss' scoped>
.external-teacher-container {
  background-color: #fff;
  padding: 20px 0;
}

.teacher-info-form {
  display: block;
  width: 70%;
  margin: 0 auto;
}

.form-item {
  width: 45%;
}

.full-item {
  width: 100%;

  :deep(.el-form-item__content) {
    width: 63%;
  }
}

.nav-container {
  border-bottom: 1px solid $line-color;
  margin-bottom: 15px;
}
.ladder-tabs {
  $base-height: 30px;
  :deep(.el-tabs__item) {
    height: $base-height !important;
    line-height: $base-height !important;
    background-color: $background-color;

    &.is-active {
      background-color: #fff;
    }

    &:first-child {
      .el-icon-close {
        display: none;
      }
    }
  }
  :deep(.el-tabs__header) {
    height: $base-height;
    margin-bottom: 0;
    border: 0 !important;
  }
}

.disabled-style {
  :deep(.el-icon-close) {
    display: none;
  }
}

.nav-container {
  display: flex;
}

.add-button {
  display: flex;
  align-items: center;
  margin-left: 15px;
}
</style>