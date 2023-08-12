<template>
  <div>
    <el-select
      v-model="form.person"
      filterable
      remote
      :remote-method="umQuerySearch"
      @change="(v) => $emit('UmSelect', v)"
      placeholder="请输入UM号/姓名"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { jsonHeaders } from '@/util/utils'
import { fetchUserInfos } from '@/fetch/public'
export default {
  name: 'UMSelect',
  props: {
    form: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  data() {
    return {
      options: []
    }
  },
  methods: {
    async umQuerySearch(queryString, cb) {
      if (!queryString) {
        this.ums = []
        return
      }
      const data = { empName: queryString, pageSize: '20' }
      let res = await fetchUserInfos({
        data
      })

      this.options = res.list.map(({ umId, empName }) => ({
        value: umId,
        address: empName,
        label: `${empName}(${umId})`
      }))
    }
  }
}
</script>

<style lang="scss" scoped></style>
