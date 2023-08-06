<template>
  <div class="gc-select">
    <div class="label" v-show="label" :style="{ width: labelWidth }">
      <span class="red" v-if="mustFill">*</span>
      {{ label }}
    </div>
    <el-select
      v-model="thisValue"
      @change="change"
      @focus="focus"
      :multiple="multiple"
      :placeholder="placeholder"
      @input="input"
      :disabled="thisDisabled"
      :class="{ w1, [elClass]: elClass }"
      v-on="$listeners"
      v-bind="$attrs"
      :clearable="clearable"
    >
      <el-option
        v-for="item in options"
        :key="item[v]"
        :label="item[k]"
        :value="item[v]"
        :disabled="!!item.disabled"
      >
      </el-option>
    </el-select>
    <div v-if="soltShow" class="slot" @click="click">
      {{ btnText }}
    </div>
  </div>
</template>

<script>
import component from '../../mixins/component.js'
export default {
  name: 'gc-select',
  mixins: [component],
  props: {
    k: {
      type: String,
      default: 'label'
    },
    v: {
      type: String,
      default: 'value'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    w1: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Array, Number],
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
  clearable: {
      type: Boolean,
      default: true
    },
    elClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      thisValue: '',
      thisDisabled: false
    }
  },
  methods: {
    focus(e) {},
    change(e) {
      // this.$emit("change", e);
    },
    blur(e) {},
    click() {},
    input(data) {
      // this.$emit("input", data);
    }
  },
  mounted() {
    this.thisValue = this.value
  },
  watch: {
    value(newValue) {
      this.thisValue = newValue
    },
    disabled: {
      immediate: true,
      handler(n) {
        this.thisDisabled = n
      }
    }
  }
}
</script>

<style scoped lang="scss">
.gc-select {
  display: flex;
  align-items: center;
  padding: 15px 0;
}
.gc-select .label {
  width: 19ch;
  text-align: right;
  position: relative;
  right: 10px;
}
.gc-select .label .red {
  color: red;
}
.gc-select .select {
  flex-grow: 1;
  display: flex;
  align-items: center;
}
.gc-select .slot {
  min-width: 8ch;
  padding: 0 auto;
  text-align: center;
  color: #fd6720;
}
.gc-select {
  :deep(.el-input.is-disabled input) {
    height: 30px !important;
  }
  :deep(.w1) {
    width: 100%;
  }
}
</style>
