<template>
  <gc-select
    class="w-full auto-select"
    filterable
    remote
    :options="umOptions"
    :loading="umLoading"
    :remote-method="getUmInfo"
    v-on="$listeners"
    v-bind="$attrs"
  ></gc-select>
</template>
<script>
export default {
  name: 'gc-select-auto'
}
</script>
<script setup>
import { ref, reactive } from 'vue'
import { fetchUserInfos } from '@/fetch/public'

const props = defineProps({
  fetchFn: {
    type: Function,
    default: fetchUserInfos
  },
  getParams: {
    type: Function,
    default: (v) => ({ data: { empName: v } })
  },
  getResList: {
    type: Function,
    default: (res) => {
      const list = res.list || res || []
      list.forEach((v) => {
        v.value = v.umId
        v.label = `${v.empName} (${v.umId})`
      })
      return list
    }
  },
})

const umOptions = ref([])
const umLoading = ref(false)
function getUmInfo (value) {
  if (value !== '') {
    umLoading.value = true
    const params = props.getParams(value)
    props.fetchFn(params)
    .then(resData => {
      const list = props.getResList(resData) || []
      umLoading.value = false
      umOptions.value = list
    })
  } else {
    umOptions.value = [];
  }
}

</script>
<style lang="scss" scoped>
.auto-select {
  padding: 0 !important;
}
</style>
