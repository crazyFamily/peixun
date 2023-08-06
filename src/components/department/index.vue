<template>
  <el-cascader :props="props" style="width:60%;"></el-cascader>
</template>
<script>
import { fetchUserOrgTree } from '@/fetch/public'
let id = 0
export default {
  data(vm) {
    return {
      module: 'systemModule',
      content: [],
      activeBlgStripLine: '',
      blgStripLineMaping: {},
      props: {
        lazy: true,
        multiple: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          //   debugger
          const { level, data, root } = node
          const params = { module: vm.module }
          if (root) {
            fetchUserOrgTree(params).then(res => {
              const nodes = vm.handleBusiType(res)
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes)
            })
          } else {
            const { busiType, label } = data
            vm.content = [label]
            vm.activeBlgStripLine = busiType
            const tree = vm.blgStripLineMaping[busiType]

            params.busiType = data.busiType
            fetchUserOrgTree(params).then(res => {
             if (res && res.length) {
                const { busiType, orgList } = res[0]
                // debugger
                // const nodes = orgList.map()
                // orgList.forEach((v) => {
                //     v.leaf = this.level === 1
                // })
                vm.blgStripLineMaping[busiType] = orgList
                resolve(orgList)
              } else {
                resolve([])
              }
            })
          }
          // setTimeout(() => {
          //   const nodes = Array.from({ length: level + 1 })
          //     .map(item => ({
          //       value: ++id,
          //       label: `选项${id}`,
          //       leaf: level >= 2
          //     }));
          //   // 通过调用resolve将子节点数据返回，通知组件数据加载完成
          //   resolve(nodes);
          // }, 1000);
        }
      }
    }
  },
  methods: {
    handleBusiType(data) {
      data.forEach(item => {
        if (item.busiType === 'LS') {
          item.label = '零售'
        } else if (item.busiType === 'FL') {
          item.label = '非零'
        } else {
          item.label = '金服'
        }
      })
      return data
    },
    handleDepart(data) {
      const items = data[0].orgList
      items.forEach(v => {
        v.leaf = this.level === 1
      })
      this.blgStripLineMaping[busiType] = items
    }
  }
}
</script>
<style lang="less" scoped>
</style>
