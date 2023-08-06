<template>
  <treeselect
    class="case-org-tree"
    v-model="treeData"
    :multiple="true"
    :options="treeOptions"
    :load-options="loadOptions"
    :auto-load-root-options="false"
    @input="changeHandle"
    v-bind="$attrs"
    v-on="$listeners"
    ref="treeselectRef"
  >
    <div slot="value-label" slot-scope="{ node }">
      <template v-if="['orgName'].includes(labelType)" >
        <!-- 显示组织名称 -->
        <span>{{node.raw[labelType]}}</span>
      </template>
      <template v-else>
        <!-- 显示条线+组织名称 -->
        <template v-if="node.raw.label">
          <span v-if="['LS','FL'].includes(node.raw.id)">{{node.raw.label}}</span>
          <span v-else>{{busiTypeMap[node.raw.blgStripLine]}}-{{node.raw.orgName}}</span>
        </template>
        <template v-else>
          <span>{{node.raw.id}}</span>
        </template>
      </template>
    </div>
  </treeselect>
</template>
<script>
import { fetchUserOrgTree, fetchFixedTree, fetchAllTree } from '@/fetch/public'
import treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { CopyObj } from '../../util/utils'
export default {
  components: {
    treeselect
  },
  props: {
    value: {
      // 当前值，选择树节点值
      type: Array,
      default: () => []
    },
    originalValue: {
      // 原始值，编辑数据时，回显数据
      type: Array,
      default: () => []
    },
    labelType: {
      type: String,
      default: 'label'
    },
   onlyLS: {
      type: Boolean,
      default: false
    },
    loadFn: {
      type: Function,
    },
    getOrgListFn: {
      type: Function
    },
    dataHandleFn: {
      type: Function,
    }
    // valueInputHandle: {
    //   type: Function,
    //   default: () => {
    //     return () => {}
    //   }
    // },
    // valueOutHandle: {
    //   type: Function,
    //   default: () => {
    //     return () => {}
    //   }
    // }
  },
  data() {
    return {
      module: 'systemModule',
      isDetail: true,
      treeData: null,
      treeOptions: null,
      normalizer(node) {
        return {
          id: node.orgId,
          label: node.orgName
        }
      },
      busiTypeMap: {
        LS: '零售',
        FL: '非零',
        JF: '金服'
      },
      treeNodeAll: []
    }
  },
  watch: {
    originalValue: {
      handler(newVal, oldVal) {
        console.log('xf-originalValue', newVal)
        if (!newVal) return
        if (newVal.length) {
          this.handleOriginalValue(newVal)
        } else {
          this.treeData = []
        }
      },
      deep: true,
      immediate: true 
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    loadChildrenNode(param) {
      // return fetchUserOrgTree(param)
      // return fetchFixedTree(param)
      if (this.loadFn) {
        return this.loadFn(param)
      } else {
        return fetchAllTree(param)
      }
    },
   getOrgList (m) {
      if (this.getOrgListFn) {
        return this.getOrgListFn(m)
      } else {
        if (Array.isArray(m)) {
          return m[0].orgList
        } 
      }
      return []
    },
    // 获取条线信息
    getBlgStripLineArr () {
      let res = []
      if (this.onlyLS) {
        res = [{ busiType: 'LS' }]
      } else {
        res = [{ busiType: 'LS' }, { busiType: 'FL' }]
      }
      return res
    },
    // 处理“试点机构”回显数据
    // 将 list 转成 tree
    async getOriginalValueParentTree(_data) {
      // { busiType: 'LS', orgId: '', children: [] }
      if (this.loadFn) {
        const rootArr = await this.loadChildrenNode()
        _data = _data.map(m => {
          let rIndex = -1
          rootArr.forEach(r => {
            const cIndex = m.allPrnNode.indexOf(r.orgId)
            if (rIndex == -1) {
              rIndex = cIndex
            } else {
              rIndex = cIndex > -1 && cIndex < rIndex ? cIndex : rIndex
            }
          })
          const allPrnNodeArr = m.allPrnNode?.substr(rIndex)?.split('|') || []
          allPrnNodeArr.pop()
          return {
            blgStripLine: m.blgStripLine,
            orgId: m.orgId,
            allPrnNode: m.allPrnNode, // 所以的节点路径，如 001｜001001｜001001001
            allPrnNodeArrOriginal: [...allPrnNodeArr], // 节点原始的路径
            allPrnNodeArr: [...allPrnNodeArr] // 当前未加载的路径
          }
        })
      } else {
      _data = _data.map(m => {
          const allPrnNodeArr = m.allPrnNode?.split('|') || []
          allPrnNodeArr.pop()
          return {
            blgStripLine: m.blgStripLine,
            orgId: m.orgId,
            allPrnNode: m.allPrnNode, // 所以的节点路径，如 001｜001001｜001001001
            allPrnNodeArrOriginal: [...allPrnNodeArr], // 节点原始的路径
            allPrnNodeArr: [...allPrnNodeArr] // 当前未加载的路径
          }
        })
      }
      // 不使用接口，固定加载“零售”和“非零”
      const blgStripLineArr = this.getBlgStripLineArr() // [{ busiType: 'LS' }, { busiType: 'FL' }]
      // 以“条线”为根节点
      const resTree = blgStripLineArr.map(m => {
        const param = { module: this.module, busiType: m.busiType }
        const treeNode = {
          blgStripLine: m.busiType
        }
        treeNode.children = this.getChildren(treeNode, _data)
        treeNode.promise = new Promise(resolve =>
          resolve(this.loadChildrenNode(param))
        )
        return treeNode
      })

      // 以“部门”根节点
      // const resTree2 = resTree.map(m => m.children[0])
      console.log('xf-node', _data, resTree)
      return resTree
    },
    // 递归获取树子节点
    getChildren(node, originalList) {
      const orgIdSet = new Set()
      // 获取筛条件
      let filterFn = m => m.blgStripLine === node.blgStripLine && m.allPrnNodeArr?.length
      if (node.hasOwnProperty('orgId')) {
        filterFn = m =>
          m.blgStripLine === node.blgStripLine &&
          m.allPrnNodeArr?.length &&
          m.allPrnNodeArrOriginal.includes(node.orgId)
   }
      originalList.filter(filterFn).forEach(item => {
        // 追加一级上级节点，allPrnNodeArr 就会少一条父节点
        orgIdSet.add(item.allPrnNodeArr.shift())
      })
      // 还有子节点
      if (orgIdSet.size) {
        const resTree = []
        const orgIdArr = [...orgIdSet]
        orgIdArr.forEach(orgId => {
          const param = {
            module: this.module,
            busiType: node.blgStripLine,
            orgId: orgId
          }
          const treeNode = {
            blgStripLine: node.blgStripLine,
            orgId: orgId
          }
          treeNode.children = this.getChildren(treeNode, originalList)
          treeNode.promise = new Promise(resolve =>
            resolve(this.loadChildrenNode(param))
          )
          resTree.push(treeNode)
        })
        return resTree
      }
      return []
    },
    async loadOriginalTree(originalTree) {
      this.treeOptions = []
      this.treeData = this.value
      originalTree.forEach(async node => {
        // node: 条线级
        const res = await node.promise
        // const orgList = res[0].orgList.map(m => ({ ...m, isDepartRoot: true })) // 部门根节点
        const orgList = this.getOrgList(res).map(m => ({ ...m, isDepartRoot: true })) // 部门根节点
        const options = this._formatTreeData(orgList) // 树组件 - 根节点
        
        this.treeNodeAll.push(...CopyObj(options))
        options.forEach(option => {
          if (node?.children?.length) {
            node.children.forEach(subNode => {
              // console.log(subNode, option)
              if (subNode.orgId === option.orgId){
                this.loadOriginalTreeChildren(subNode, option)
              }
           })
          }
          if (this.treeOptions?.length && option.blgStripLine === 'LS' && this.treeOptions[0].blgStripLine !== 'LS') {
            console.log('将"零售"节点插入到第一个节点')
            this.treeOptions.unshift(option)
          } else {
            this.treeOptions.push(option)
          }
        })
      })
      // console.log(this.treeOptions)
    },
    async loadOriginalTreeChildren(parentNode, parentOption) {
      // 从数据库中获取节点的下级部门（通过 node.orgId）
      const res = await parentNode.promise
      // 设置组件树的下级选项
      parentOption.children = this._formatTreeData(this.getOrgList(res))

      this.treeNodeAll.push(...parentOption.children)
      parentNode.children.forEach(node => {
        const option = parentOption.children.find(m => m.orgId === node.orgId)
        this.loadOriginalTreeChildren(node, option)
      })
    },
    // 处理原始数据。即：当回显时，递归加载树节点
    async handleOriginalValue(_data) {
      console.log('xf-originalData', _data)
      const originalTree = await this.getOriginalValueParentTree(_data)
      console.log('xf-originalTree', originalTree)
      this.loadOriginalTree(originalTree)
    },
    // 重构树节点结构
    _formatTreeData (data) {
      return data.map(item => {
        if (item.isSpread === null) {
          item.isSpread = 'Y'
        }
        let res = { ...item, leaf: item.isSpread === 'N' }
        if (item.isSpread === 'Y') {
          res.children = null
        }
        res.orgId = item.orgId
        if (this.onlyLS) { // 只显示零售（则不显示条线）
          res.id = `${item.orgId}`
          res.label = res.isDepartRoot
            ? `${res.orgName}`
            : res.orgName
        } else { // 只显示零售/非零（根节点条线）
          res.id = `${item.blgStripLine}/${item.orgId}`
          res.label = res.isDepartRoot
            ? `${this.busiTypeMap[res.blgStripLine]}/${res.orgName}`
            : res.orgName
        }
        return res
      })
    },
 // 加载“树子节点”
    async _getTreeData(param, isChildrenFetch = false) {
      let res = await this.loadChildrenNode(param)
      let orgList = this.getOrgList(res)
      let data = this._formatTreeData(orgList)
      return data
    },
    // 加载“条线”根节点（目前没有被使用）
    async _treeRootData(param) {
      // this.treeOptions = [
      //   {
      //     blgStripLine: "FL",
      //     children: null,
      //     isSpread: "Y",
      //     leaf: false,
      //     orgId: "FL",
      //     orgName: "非零",
      //   },
      // ]
      const resData = await this.loadChildrenNode(param)
      const res = resData.map(item => {
        const node = {
          blgStripLine: item.busiType,
          children: null,
          isSpread: 'Y',
          leaf: false,
          disabled: true,
          orgId: item.busiType,
          orgName: this.busiTypeMap[item.busiType],
          id: item.busiType,
          label: this.busiTypeMap[item.busiType]
        }
        return node
      })
      return res
    },
    // 加载“部门”根节点（正在使用中）
    async _treeDepartRootData(param) {
      // 不使用接口，固定加载“零售”和“非零”
      if (this.loadFn) {
        const res = await this.loadChildrenNode()
        const rootArr = this.getOrgList(res).map(m => ({...m, isDepartRoot: true }))
        return this._formatTreeData(rootArr)
      } else {
        const res = this.getBlgStripLineArr()
        if (Array.isArray(res)) {
          const promiseArr = res.map(m => {
            const param2 = { ...param, busiType: m.busiType }
            return new Promise(resolve => resolve(this.loadChildrenNode(param2)))
          })
          const resArr = await Promise.all(promiseArr)
          const rootArr = []
          resArr.forEach(res => {
            const orgList = this.getOrgList(res).map(m => ({...m, isDepartRoot: true }))
            rootArr.push(...orgList)
        })
          return this._formatTreeData(rootArr)
        }
        return []
      }
    },
    // 树节点点击时，加载树子节点
    async loadOptions({ action, parentNode, callback }) {
      // console.log('xf-parentNode', parentNode)
      const param = { module: this.module }
      // 加载根节点
      if (action === 'LOAD_ROOT_OPTIONS') {
        // this.treeOptions = await this._treeRootData(param) // 加载“条线”
        this.treeOptions = await this._treeDepartRootData(param) // 加载部门子节点
        console.log(this.treeOptions)
        this.treeNodeAll.push(...this.treeOptions)
        callback()
      }
      // 加载其他子节点
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        // 没有加载过子节点，则需要加载。（加载过子节点的情况，则是编辑时显示数据时）
        if (!parentNode?.children?.length) {
          param.busiType = parentNode.blgStripLine
          if (['LS', 'FL'].includes(parentNode.orgId)) {
            parentNode.children = await this._getTreeData(param, true)
          } else {
            param.orgId =
              parentNode.orgId.indexOf('/') > -1
                ? parentNode.orgId.substr(parentNode.orgId.indexOf('/') + 1)
                : parentNode.orgId
            parentNode.children = await this._getTreeData(param, true)
          }
          this.treeNodeAll.push(...parentNode.children)
        }
        callback()
      }
    },
    changeHandle(v) {
      console.log(v, '---vvv')
      this.$emit('change', v)
    },
    getOrgData () {
      // const vObj = this.treeNodeAll.filter(m => this.treeData?.includes(m.orgId))
      // console.log(this.treeNodeAll, vObj)
      const vObj = this.treeData.map(m => {
     return this.treeNodeAll.find(v => v.orgId === m)
      })
      return vObj
    },
    clearData () {
      this.treeNodeAll = []
    }
  }
  // created () {
  //     console.log('xf-tree-select:created')
  // },
  // activated () {
  //     console.log('xf-tree-select:activated')

  // }
}
</script>
<style lang='scss' scoped>
.case-org-tree {
  // width: 450px;
  :deep(.vue-treeselect__multi-value-item) {
    background-color: $themeColor;
    color: #fff;
  }
  :deep(.vue-treeselect__value-remove) {
    color: #fff;
  }
  :deep(.vue-treeselect__checkbox--checked) {
    background-color: $themeColor;
    border-color: $themeColor;
  }
  :deep(.vue-treeselect__label-container:hover
      .vue-treeselect__checkbox--unchecked) {
    border-color: $themeColor;
  }
}
</style>
