<template>
  <keep-alive>
    <component :is="activeComp" :compData="activeCompData" @changeComp="changeComp" />
  </keep-alive>
</template>
<script>
import SpecialList from './SpecialManage'
import AddSpecial from './AddSpecial'
import ScoringReport from './ScoringReport'
export default {
  name: 'SpecialManage',
  components: {
    SpecialList,
    AddSpecial,
    ScoringReport
  },
  data() {
    return {
      activeComp: 'SpecialList',
      activeCompData: {},
      recordId: '',
      compMapping: {
        list: SpecialList,
        add: AddSpecial,
        edit: AddSpecial,
        report: ScoringReport
      }
    }
  },
  methods: {
    changeComp(params) {
      console.log('params',params)
      const { flag, data } = params
      this.activeComp = this.compMapping[flag]
      this.activeCompData = data
    }
  },
  mounted() {
    console.log('mounted')
  },
  activated() {
    console.log('activated')
  }
}
</script>
