<template>
  <div class="gc-input">
    <div class="label">
      <span class="red" v-if="mustFill">*</span>
      {{ label }}
    </div>
    <el-input
      v-model="thisValue"
      :maxlength="maxlength"
      :name="name"
      :type="type"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      @change="change"
      @focus="focus"
      @input="input"
      @blur="blur"
    >
      <slot name="suffix" slot="suffix"> </slot>
    </el-input>
  </div>
</template>

<script>
import component from '../../mixins/component.js'
export default {
  name: 'gc-input',
  mixins: [component],
  props: {
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      thisValue: ''
    }
  },
  mounted() {
   this.thisValue = this.value
  },
  methods: {
    change(data) {
      this.$emit('change', { [this.name]: data })
    },
    select(e) {},
    focus(e) {
      this.thisValue = e.currentTarget.value
      this.$emit('focus', { [this.name]: e.currentTarget.value })
    },
    input(data) {
      this.$emit('input', data)
    },
    blur() {
      this.$emit('blur')
    }
  },
  watch: {
    value(newValue) {
      this.thisValue = newValue
    }
  }
}
</script>

<style lang="scss" scoped>
.gc-input {
  display: flex;
  align-items: center;
  width: 100%;
  .label {
    width: 19ch;
    text-align: right;
    position: relative;
    right: 10px;
  }
  .main {
    display: flex;
    & > div {
      flex-grow: 1;
    }
  }
  .input {
    flex-grow: 1;
  }
  .input div {
    display: block;
  }
  .red {
    color: red;
  }
  &.left {
    .label {
      width: auto;
      right: 0;
    }
    .el-input {
      width: 200px;
      left: 10px;
    }
  }
}
.el-table .label {
  width: 0;
}
</style>
