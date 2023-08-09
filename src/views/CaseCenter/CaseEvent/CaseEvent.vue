<template>
  <keep-alive>
    <component
      :is="currentRoute"
      @change="changeHandle"
      :is-view="isView"
      :is-create="isCreate"
      :is-edit="isEdit"
      :row-data="rowData"
    ></component>
  </keep-alive>
</template>

<script>
import AddCaseEvent from './AddCaseEvent.vue'
import CaseEventManage from './CaseEventManage.vue'
export default {
  name: 'CaseEvent',

  props: {},

  data() {
    return {
      currentRoute: 'CaseEventManage',
      isView: false,
      isCreate: false,
      isEdit: false,
      rowData: {}
    }
  },

  components: {
    CaseEventManage,
    AddCaseEvent
  },

  computed: {},

  mounted() {},

  methods: {
    changeHandle(compName, type, data) {
      this.currentRoute = compName
      this.isView = type === 'view'
      this.isCreate = type === 'create'
      this.isEdit = type === 'edit'
      if (data && data.id) {
        this.rowData = data
      } else {
        this.rowData = {}
      }
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
