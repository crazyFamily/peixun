
import { ref, watch } from 'vue'
import { fetchUserOrgTree, fetchFixedTree, fetchAllTree } from '@/fetch/public'
import { CopyObj } from '@/plugins/until'

/**
1. 当节点有options/children属性时，则此节点会渲染为成父节点，即有“可打开本节点的按钮”
  1.1 当 options/children = null 时，打开节点时，会触发 loadOptions 方法；
  1.2 当 options/children = [] 时, 打开节点时，则不会触发 loadOptions 方法，显示“No options-available”,“No sub-options”
  1.3 options 中对象结构：
  {
    id: Number | String (required),
    label: String (required),
    children: node[] | null,
    isDisabled: Boolean,
    isNew: Boolean,
    isDefaultExpanded,
  }
2. 涉及两个接口（加载选项的接口，回显时的已选项数据）
  2.1 加载选项的接口 的 节点数据
  {
    busiType: "FL",
    orgList: [{
      allPrnNode: "S000002922|S000004169"
      blgStripLine: "FL"
      createdBy: null
      createdDate: null
      ifFixNode: null
      isChoose: null
      isSpread: "Y", // 是否展开，  Y：可展开, N：不可展开
      lateFixNode: null
      orgId: "S000004169"
      orgLvl: null
      orgName: "平安银行分行"
      pageSort: null
      prnOrgId: null
      prnPageSort: null
      updatedBy: null
      updatedDate: null
    }]
  }
  2.2 回显时的已选项数据 的 节点数据
  experimentsOrgList: [{
    allPrnNode: "S000002922|S000004169|S000000001"
    blgStripLine: "FL"
    createdBy: null
    createdDate: null
    lineAndOrgName: "非零-平安银行北京分行"
    orgId: "S000000001"
    orgName: "平安银行北京分行"
    updatedBy: null
    updatedDate: null
  }]

 */

const busiTypeMap = {
  LS: '零售',
  FL: '非零',
  JF: '金服',
  CX: '橙信'
}
const isObj = (m) => Object.prototype.toString.call(m) === '[object Object]'
export default function useDeptTreeSelect (props) {
  const treeData = ref(null)
  const options = ref(null)
  // ============================================= 处理树节点自动加载 ============================================

  // 若父节点已被选中，则打开其子节点时，若有被禁用节点，则将选中节点中的此父节点删除
  function handleParentNodeIfChildNodeHasDisabled(parentNode, children) {
    if (children.some((m) => m.isDisabled)) {
      // 至少有一个节点被禁用，则要删除已被选择的节点
      const index = treeData.value?.findIndex((m) => m === parentNode.id || m.id === parentNode.id) || -1
      if (index > -1) {
        // 删除被选中的父节点
        treeData.value.splice(index, 1)
      }
    }
  }

  // 加载树选项
  // action: 当前需要加载选项的节点类型，LOAD_ROOT_OPTIONS ：根节点，LOAD_CHILDREN_OPTIONS：子节点
  async function loadOptions({ action, parentNode = {}, callback }) {
    try {
      // console.log(`当前点击节点:${parentNode?.label}(${parentNode?.id})`, parentNode)
      if (!parentNode?.children?.length) {
        // console.log('加载节点', parentNode.label)
        if (action === 'LOAD_ROOT_OPTIONS') {
          // 根节点加载选项
          options.value = await getOrgList(props.busiTypeParams, true) // 加载部门子节点
        } else if (action === 'LOAD_CHILDREN_OPTIONS') {
          // 子节点加载选项
          const param = { busiType: parentNode[props.txField] },
            orgId = parentNode.orgId
          if (!['LS', 'FL'].includes(orgId)) {
            param.orgId = orgId.indexOf('/') > -1 ? orgId.substr(orgId.indexOf('/') + 1) : orgId
          }
          const children = await getOrgList(param)
          handleParentNodeIfChildNodeHasDisabled(parentNode, children)
          parentNode.children = children
        }
        callback()
      } else {
        // console.log('不加载节点', parentNode.label)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // ============================================= 处理数据回显 ============================================

  /**
   * 数据进来的时候需要做一层数据过滤，当数据集中同时含有树极结构的父子id，则父级的node抽离到log的map集合中
   */

  // 当前节点的下级 是否 已加载 下级，即当前节点是否已 加载 下下级
  const hasNextNextChildren = (node) => {
    return node?.children?.some((m) => m.children?.length > 0) || false
  }
  // 当前节点的下级 是否 有被禁用节点
  const hasNextDisabledChildren = (node) => {
    return node?.children?.some((m) => m.isDisabled) || false
  }
  // 选择节点时，处理下级节点
  const handleNextChildren = (node) => {
    console.groupCollapsed(`-------- 节点开始：${node.orgName}(${node.children?.length || 0}) --------`, node)
    const resNode = []
    const hasNextNext = hasNextNextChildren(node) //
    if (hasNextNext) {
      console.log('有下两级节点', node.children)
      // 已加载过 下两级 或 更多级
      const nodeChildren = []
      node.children.forEach((subNode) => {
        if (subNode.isDisabled) {
          // 当前节点为禁用节点
          nodeChildren.push({
            orgId: subNode.orgId,
            orgName: subNode.orgName,
            hasChildren: !!subNode.children,
            hasDisabledSubNode: false,
            isDisabled: subNode.isDisabled,
            resNode: [subNode]
          })
        } else {
          // 当前节点不是禁用节点
          // 有的子节点有下级，有的子节点没有下级
          if (subNode.children?.length) {
            const subNodeChildren = handleNextChildren(subNode)
            console.log('subNodeChildren', subNodeChildren)
            // 当下级返回的是本节点，则说明下级没有禁用节点
            const hasDisabledSubNode = !(subNodeChildren.length === 1 && subNodeChildren[0].orgId === subNode.orgId)
            nodeChildren.push({
              orgId: subNode.orgId,
              orgName: subNode.orgName,
              hasChildren: true,
              hasDisabledSubNode: hasDisabledSubNode,
              isDisabled: subNode.isDisabled,
              resNode: subNodeChildren
            })
          } else {
            // 没有加载 下一级
            nodeChildren.push({
              orgId: subNode.orgId,
              orgName: subNode.orgName,
              hasChildren: false,
              hasDisabledSubNode: false,
              isDisabled: subNode.isDisabled,
              resNode: [subNode]
            })
          }
        }
      })
      console.log('重构后节点 ==> ', nodeChildren)
      const canReturnNode = nodeChildren.every((m) => !m.isDisabled && !m.hasDisabledSubNode)
      const canUseNodeList = nodeChildren.filter((m) => !m.isDisabled)
      if (canReturnNode) {
        resNode.push(node)
      } else {
        canUseNodeList.forEach((m) => {
          resNode.push(...m.resNode)
        })
      }
    } else {
      console.log(
        '没有下级，或有下一级节点',
        node?.children?.map((m) => m.children)
      )
      if (node.children?.length) {
        // 只加载有 下一级，但没有加载下两级
        if (node.children.some((m) => m.isDisabled)) {
          // 若下一级有禁用节点，但追加未禁用子节点
          const filterDatas = node.children.filter((m) => !m.isDisabled)
          resNode.push(...filterDatas)
        } else {
          // 若下一级没有禁用节点，则追加本节点
          resNode.push(node)
        }
      } else if (!node.isDisabled) {
        // 没有加载 下一级
        resNode.push(node)
      }
    }
    console.log(
      `最终结果：选中'${node.orgName}' ==>`,
      resNode.map((m) => m.orgName)
    )
    console.groupEnd(`-------- 节点结束：${node.orgName} --------`)
    return resNode
  }

  const formatDatas = (datas) => {
    let resultDatas = []
    datas.forEach(row => {
      console.log(handleNextChildren(row), '===>> row')
      resultDatas = resultDatas.concat(handleNextChildren(row))
    })
    return resultDatas
  }
  watch(
    () => props.value,
    (newVal) => {
      // formatDatas(newVal)
      // treeData.value = newVal
    }
  )

  const isLoadingTree = ref(false)
  watch(
    () => props.originalValue,
    async (newVal) => {
      // console.log('回显数据(originalValue)-原始数据', newVal)
      if (!newVal) return
      if (newVal.length) {
        try {
          isLoadingTree.value = true
          await handleOriginalValue(newVal)
          isLoadingTree.value = false
        } catch (error) {
          isLoadingTree.value = false
        }
        const originDatas = []
        props.value.forEach(row => {
          console.log(flatTreeMap, row, '===>> getRow')

          // 判断：如果当前节点其下子节点含有被禁用节点，需要把这个节点存到logMap中
          const targetNode = flatTreeMap.get(row.orgId)
          if (hasNextDisabledChildren(targetNode)) {
            updateLog(targetNode)
          }
          originDatas.push(targetNode || {})
        })
        treeData.value = [...(treeData.value||[]), ...formatDatas(originDatas)]
      } else {
        treeData.value = []
      }
    }
    // { deep: true, immediate: true }
    // { immediate: true }
  )
  /**
   * 处理原始数据。即：当回显时，递归加载树节点
   * @param {*} _data 传入的原始数据
   */
  async function handleOriginalValue(_data) {
    return new Promise(async (resolve, reject) => {
      try {
        _data = _data.map((m) => {
          const allPrnNodeArr = m.allPrnNode?.split('|') || []
          allPrnNodeArr.pop()
          const res = {
            ...m,
            allPrnNodeArrOriginal: [...allPrnNodeArr], // 节点路径(不包括叶子节点) - 不变化用于后期比较
            allPrnNodeArr: [...allPrnNodeArr] // 节点路径(不包括叶子节点) - 每渲染一节点少一节点
          }
          return res
        })
        // console.log('回显数据-处理1:', _data)
  
        // [{ busiType: 'LS' }, { busiType: 'FL' }]
        const loadParamsTree = props.busiTypeParams.map((m) => {
          const treeNode = { loadParams: m }
          treeNode.children = getParamsChildren(treeNode, _data)
          return treeNode
        })
        console.log(loadParamsTree, '===>>. loadParamsTree')
        // console.log('回显数据-默认展开的节点', defaultExpandedIds.value)
        // console.log('回显数据-处理2:加载参数树', loadParamsTree)
  
        // 加载回显数据，设置 options，treeData 的值
        const loadRootPromise = loadParamsTree.map((m) => getOrgList(m.loadParams, true))
        Promise.all(loadRootPromise).then(async (resArr) => {
          console.log(resArr, '===>> resarr')
          const rootOptions = []
          resArr.forEach((m) => {
            rootOptions.push(...m)
          })
  
          // 代码变更： 要在for loop中使用async/await，不能使用forEach语法糖
          for (let i = 0; i < rootOptions.length; i++) {
            const paramsNode = loadParamsTree[i]
            const option = rootOptions[i]
            if (paramsNode.children && Array.isArray(paramsNode.children)) {
              for (let j = 0; j < paramsNode.children.length; j++) {
                await loadOriginalTreeChildren(paramsNode.children[j], option)
              }
            }
          }
  
          // 设置 options，treeData 的值
          options.value = rootOptions
          resolve()
          // treeData.value = [...props.value]
        })
      } catch (err) {
        reject(err)
        console.error(err)
      }
    })
  }
  /**
   * 递归获取回显树节点
   * @param {*} node 重构后树的节点
   * @param {*} originalList 回显示的数据列表
   */
  function getParamsChildren(node, originalList) {
    const loadParams = node.loadParams
    // 存储“回显数据列表”中的所有“节点路径”中的节点id（已去重）
    const orgIdSet = new Set()
    // 设置筛选条件
    let filterFn
    if (loadParams.hasOwnProperty('orgId')) {
      filterFn = (m) => m.busiType === loadParams.busiType && m.allPrnNodeArr?.length && m.allPrnNodeArrOriginal.includes(loadParams.orgId)
    } else {
      filterFn = (m) => m.busiType === loadParams.busiType && m.allPrnNodeArr?.length
    }

    originalList.filter(filterFn).forEach((item) => {
      // 追加一级上级节点，allPrnNodeArr 就会少一条父节点
      orgIdSet.add(item.allPrnNodeArr.shift())
    })

    // 还有子节点
    if (orgIdSet.size) {
      const resTree = []
      const orgIdArr = [...orgIdSet]
      // defaultExpandedIds.value.push(...orgIdArr)
      orgIdArr.forEach((orgId) => {
        const treeNode = { loadParams: { busiType: loadParams.busiType, orgId: orgId } }
        treeNode.children = getParamsChildren(treeNode, originalList)
        resTree.push(treeNode)
      })
      return resTree
    }
    return []
  }
  /**
   * 递归加载获取回显树节点
   * @param {*} parentNode
   * @param {*} parentOption
   */
  async function loadOriginalTreeChildren(parentNode, parentOption) {
    // 从数据库中获取节点的下级部门（通过 node.orgId）
    // 设置组件树的下级选项
    parentOption.children = await getOrgList(parentNode.loadParams, false) // 加载部门子节点
    
    // 代码变更： 要在for loop中使用async/await，不能使用forEach语法糖
    for (let i = 0; i < parentNode.children.length; i++) {
      const node = parentNode.children[i]
      const option = parentOption.children.find((m) => m.orgId === node.loadParams.orgId)
      await loadOriginalTreeChildren(node, option)
    }
  }

  // =========================================================================================

  function loadChildrenNode(param) {
    // return fetchUserOrgTree(param)
    // return fetchFixedTree(param)
    return fetchAllTree(param)
  }

  // 服务器节点 转换为 <treeselect>树节点
  function formatServeToWeb(data = [], isRoot) {
    const separator = props.nodeLabelSeparator || props.labelSeparator || '/'
    data.forEach((item) => {
      const id = item[props.idField],
        label = item[props.labelField],
        tx = item[props.txField],
        leaf = item[props.leafField]

      if (leaf === 'Y') {
        item.children = null
        // item.children = []
      }
      if (tx) {
        item.busiType = tx
      }

      if (props.nodeLabelIsShowTX === 'all') {
        item.id = id // `${tx}/${id}`
        item.label = `${busiTypeMap[tx]}${separator}${label}`
      } else if (props.nodeLabelIsShowTX === 'onlyRoot') {
        item.id = id // `${tx}/${id}`
        item.label = isRoot ? `${busiTypeMap[tx]}${separator}${label}` : label
      } else {
        item.id = id
        item.label = label
      }

      if (props.disabledIdArr?.length) {
        item.isDisabled = props.disabledIdArr.includes(id)
      }

      item.prnOrgId = item.prnOrgId || item.allPrnNode?.split('|')?.slice(-2, -1)?.[0]

      // item.isRootNode = !!isRoot
    })
    return data
  }

  // params：获取机构列表的参数，
  // isRoot：获取的是否是根节点
  const flatTreeMap = new Map()
  async function getOrgList(params, isRoot) {
    if (isObj(params)) params = [params]

    const orgListArr = []
    const promiseArr = params.map((param) => loadChildrenNode(param))
    const resArr = await Promise.all(promiseArr)
    resArr.forEach((busiTypeArr) => {
      // 遍历条线下的列表
      busiTypeArr.forEach((org) => {
        orgListArr.push(...org.orgList)

        // 新加功能：使用一个map，把Tree结构拉平后，用于记录
        org.orgList.forEach((row) => {
          flatTreeMap.set(row.orgId, row)
        })
      })
    })
    return formatServeToWeb(orgListArr, isRoot)
  }

  /**
   * 设置一个log集合，用于记录点击过的节点
   * 如果有取消操作，就从log集合中移除。
   * 最后广播出去的结果为treeData和结果集的加总
   */
  const nodeLogMap = ref(new Map())
  const updateLog = (node) => {
    if (!isObj(node)) return

    // 在进行数据插入前，需要以传入的node为起点，递归查询logMap中是否含有待插入节点的子节点，如有，则移除
    const findNodeChildren = (rootNode) => {
      rootNode?.children?.forEach(row => {
        if(nodeLogMap.value.get(row.orgId)) removeLog(row.orgId)
        if(Array.isArray(row.children) && row.children.length) {
          findNodeChildren(row.children)
        }
      })
    }

    findNodeChildren(node)
    nodeLogMap.value.set(node.orgId, node)
  }

  const removeLog = (orgId) => {
    // 在进行数据插入前，需要以传入的id为起点，递归查询logMap中是否含有待插入节点的上级节点，如有，则移除
    // 更新： 移除操作需要移除当前节点的上级节点以及其所有的子节点，这里做递归到最底层，然后通过 allPrnNode 属性进行log移除
    const targetNode = flatTreeMap.get(orgId)
    const childrenMap = new Map()
    const parentMap = new Map()
    const findLastLeaf = (node) => {
      if(node.children && node.children.length) {
        node.children.forEach(row => {
          childrenMap.set(row.orgId, row)
          findLastLeaf(row)
        })
      }
    }
    const allPrnNode = flatTreeMap.get(orgId)?.allPrnNode?.split('|') || []
    allPrnNode?.forEach((aOrgId) => {
      parentMap.set(aOrgId, flatTreeMap.get(aOrgId))
    })
    Array.from(childrenMap.keys()).concat(Array.from(parentMap.keys())).forEach(nOrgId => {
      nodeLogMap.value.delete(nOrgId)
    })
    nodeLogMap.value.delete(orgId)
  }
  const clearLog = () => {
    nodeLogMap.value.clear()
  }
  const getLogList = () => {
    return Array.from(nodeLogMap.value.values())
  }

  return {
    busiTypeMap,
    treeData,
    options,
    loadOptions,
    flatTreeMap,
    nodeLogMap,
    updateLog,
    removeLog,
    clearLog,
    getLogList,
    isLoadingTree,
    hasNextNextChildren,
    hasNextDisabledChildren,
    handleNextChildren,
  }
}