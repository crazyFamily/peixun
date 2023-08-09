<template>
  <keep-alive>
    <component :is="activeComp" :compData="activeCompData" @changeComp="changeComp" />
  </keep-alive>
</template>
<script>
import ZnSpecialList from './ZnSpecialList'
import AddZnSpecial from './AddZnSpecial'
export default {
  name: 'ZnSpecialManage',
  components: {
    ZnSpecialList,
    AddZnSpecial
  },
  data() {
    return {
      activeComp: 'ZnSpecialList',
      activeCompData: {},
      recordId: '',
      compMapping: {
        list: ZnSpecialList,
        add: AddZnSpecial,
        edit: AddZnSpecial,
      }
    }
  },
  methods: {
    changeComp(params) {
			console.log(params)
      const { flag, data } = params
			this.activeComp = this.compMapping[flag]
      this.activeCompData = data
    }
  },
  mounted () {
    console.log('mounted')
  },
  activated () {
    console.log('activated')
  }
}
</script>
