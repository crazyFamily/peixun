<template>
  <el-dropdown
    class="gc-dropdown"
    :trigger="trigger"
    :placement="placement"
    :style="myStyle"
    @command="dropDownCommandHandle"
  >
    <span class="el-dropdown-link">
      <template v-if="$slots.label">
        <slot name="label"></slot>
      </template>
      <template v-else>
        {{ label }}<i class="el-icon-arrow-down el-icon--right"></i>
      </template>
    </span>
    <el-dropdown-menu size="large" slot="dropdown" :class="dropClass">
      <div class="slot">
        <slot />
      </div>
      <div>
        <el-dropdown-item
          v-for="item in options"
          :value="item.id"
          :key="item.id"
          :icon="item.icon"
          :command="item.id"
          >{{ item[labelName] }}</el-dropdown-item
        >
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'gc-dropdown',
  props: {
    label: {
      type: String,
      default: '下拉菜单'
    },
    labelName: {
      type: String,
      default: 'labelName'
    },
    name: {
      type: String,
      default: 'key'
    },
    options: {
      type: Array,
      default: () => [
        // {
        //   label: '黄金糕',
        //   icon: 'el-icon-plus',
        //   value: 1,
        // }
      ]
    },
    trigger: {
      type: String,
      default: 'hover'
    },
    dropClass: {
      type: String,
      default: 'gc-dropClass'
    },
    placement: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: ''
    }
  },
  computed: {
    myStyle() {
      if (this.width === 'block') {
        return { width: '100%' }
      }
      return {}
    }
  },
  methods: {
    dropDownCommandHandle(type) {
      this.$emit('command', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.gc-dropdown {
  .slot {
    width: 200px;
    padding: 10px 15px;
  }
}
</style>
