<template>
  <div class="gc-menu">
    <el-menu @select="select">
      <el-menu-item
        v-for="item in menuList"
        :key="item[id]"
        :index="item[id].toString()"
      >
        <span slot="title"> {{ item[name] }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'gc-menu',
  props: {
    name: {
      type: String,
      default: 'name'
    },
    id: {
      type: String,
      default: 'id'
    },
    menuList: {
      type: Array,
      default: () => {
        return Array(20)
          .fill()
          .map((v, i) => {
            return {
              name: `tag${i}1`,
              id: i
            }
          })
      }
    }
  },
  methods: {
    select(data) {
      this.$emit('select', data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
