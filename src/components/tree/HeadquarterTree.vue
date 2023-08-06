<template>
  <div class="headquarter-wrapper">
    <treeselect
      class="headquarter-tree"
      :options="treeOptions"
      :placeholder="placeholder"
      v-model="treeData"
      :auto-load-root-options="false"
      :disabled="disabled"
      no-results-text="暂无数据"
      no-options-text="暂无数据"
      no-children-text="暂无数据"
      v-bind="$attrs"
      v-on="$listeners"
      ref="treeselectRef"
    >
      <slot name="option-label" slot="option-label"></slot>
    </treeselect>
  </div>
</template>

<script>
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'HeadquarterTree',

  props: {
    value: {
      type: [String, Number, Array, null],
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择...'
    },
    treeOptions: {
      type: [Array, null],
      default: null
    }
  },

  data() {
    return {
      treeData: null
    }
  },

  watch: {
    value(n) {
      this.treeData = n
    },
    treeData(n) {
      this.$emit('input', n)
    }
  },

  components: {
    treeselect
  },

  computed: {},

  mounted() {},

  methods: {}
}
</script>
<style lang='scss' scoped>

.headquarter-tree {
  $base-height: 30px;
  min-width: 200px;
  height: $base-height;

  :deep(.vue-treeselect__control) {
    height: $base-height;
    line-height: $base-height;
    border-radius: 3px;
    display: flex;
    align-items: center;
  }

  :deep(.vue-treeselect__value-container) {
    height: 100%;
    line-height: $base-height;
  }

  :deep(.vue-treeselect__placeholder) {
    line-height: $base-height;
  }

  :deep(.vue-treeselect__input-container) {
    position: absolute;
    width: 100%;
    height: $base-height;
    line-height: $base-height;
    box-sizing: border-box;
    top: 0;
  }

  :deep(.vue-treeselect__single-value) {
    height: 100%;
    line-height: $base-height;
  }

  :deep(.vue-treeselect__input) {
    outline: none;
  }

  :deep(.vue-treeselect__option--selected) {
    background-color: rgb($themeColor, 0.3);
  }

  :deep(.vue-treeselect__option) {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  :deep(.vue-treeselect__value-remove) {
    display: flex;
    align-items: center;
    height: 100%;
  }

  :deep(.vue-treeselect__value-remove) {
    color: $themeColor;
  }

  :deep(.vue-treeselect__multi-value-item) {
    height: 28px;
    background-color: rgba(253, 103, 32, 0.3);
    color: #000;
    line-height: 0;
    padding: 0;
  }

  :deep(.vue-treeselect__multi-value-item-container) {
    padding-top: 0;
  }

  :deep(.vue-treeselect__input-container) {
    padding-top: 0 !important;
  }

  :deep(.vue-treeselect__checkbox--checked) {
    border-color: $themeColor;
    background: $themeColor;
  }
}

:deep(.headquarter-tree.vue-treeselect--disabled) {
  .vue-treeselect__control {
    background-color: #f7f8fa;
    border-color: #e4e7ed;
    color: #b4b6bc;
  }
  .vue-treeselect__single-value {
    color: #b4b6bc;
  }
}

:deep(.headquarter-tree.vue-treeselect--focused:not(.vue-treeselect--open)) {
  .vue-treeselect__control {
    border-color: $themeColor;
    box-shadow: 0 0 0 3px rgb($themeColor, 0.1);
  }
}
</style>
