import { ref, reactive } from 'vue'
import { fetchRecruitQryParam } from '@/fetch/newPeopleTrainingManagement'


// setOrgData
export function useRecruitQryParam (_formData) {

  const isZhAdmin = ref('')
  const orgList = ref([])
  const orgOneNode = ref({})
  const annualList = ref([])
  const recruitNumList = ref([])
  const recruitNumListAll = reactive({})
  const formData = _formData.value || _formData

  const initRecruitQryParam = async (setOrgData) => {
    const res = await fetchRecruitQryParam()
    // 是否总行管理员：Y是、N否
    isZhAdmin.value = res.isZhAdmin === 'Y'
    // isZhAdmin.value = false 
    // 处理搜索查询项"机构"下拉数据项
    if (res?.orgs?.length && setOrgData) {
      setOrgList(res.orgs)
    }
    // 处理搜索查询项“年度”和“期次”下拉数据项
    setAnnualListAndRecruitNumList(res.annuals)
  }

  const setOrgList = (data) => {
    data.forEach(m => {
      m.orgId = m.xrCode
      m.orgName = m.xrMsg
      m.value = m.xrCode
      m.label = m.xrMsg
      m.parentOrgId = m.parentXrCode
      m.orgLevel = 1
    })
    const tree = data.filter(v => Number(v.orgLevel) === 1)
    // arrToTree(tree, data)
    orgList.value = tree
    orgOneNode.value = tree[0] || {}
  }

  // function arrToTree(arr, data) {
  //   arr.forEach(v => {
  //     const children = data.filter(child => child.parentOrgId == v.orgId)
  //     if (children.length > 0) {
  //       v.children = children
  //       arrToTree(children, data)
  //     }
  //   })
  // }
  // 树节点搜索方法
  function filterNodeMethod(value, data, node) {
    if (!value || !value.trim()) return true
    return data.orgName.includes(value)
  }

  const setAnnualListAndRecruitNumList = async (_annualList) => {
    _annualList.forEach(item => {
      recruitNumListAll[item.xrCode] = item.recruitNums
    })
    setNewYearData(String(new Date().getFullYear()))
    if (_annualList.length) {
      annualList.value = _annualList
        .map(m => ({ value: m.xrCode, label: m.xrCode }))
        // .sort((a, b) => Number(b.value) - Number(a.value))
      formData.annual = annualList.value[0].value
      annualChangeHandle()
    }
  }

  const setNewYearData = (value) => {
    // 处理：如果后端数据没有的话，前端数据结构默认为第一期
    if (!recruitNumListAll[value]) {
      // 这里设置初始值为0，在渲染逻辑中会+1
      recruitNumListAll[value] = [{ xrCode: '0' }]
    }
  }

  // 查询框：年度变更
  const annualChangeHandle = (value) => {
    // 值为空的时候需要把数据清一下
    if(value === '') {
      formData.period = ''
      recruitNumList.value = []
      return
    }
    setNewYearData(formData.annual)
    const _recruitNumList = recruitNumListAll[formData.annual]
    if (_recruitNumList.length) {
      recruitNumList.value = _recruitNumList
        .map(m => ({ value: m.xrCode, label: `第${m.xrCode}期` }))
        // .sort((a, b) => Number(b.value) - Number(a.value))
      typeof formData.recruitNum !== 'undefined' && (formData.recruitNum = recruitNumList.value[0].value)
      typeof formData.period !== 'undefined' && (formData.period = recruitNumList.value[0].value)
    } else {
      recruitNumList.value = []
      typeof formData.recruitNum !== 'undefined' && (formData.recruitNum = '')
      typeof formData.period !== 'undefined' && (formData.period = '')
    }
  }

  const getOptionsObj = (list = []) => {
    const res = {}
    list.forEach(m => {
      res[m.value] = m.label
    })
    return res
  }

  return {
    initRecruitQryParam,
    annualChangeHandle,
    filterNodeMethod,
    isZhAdmin,
    orgList,
    orgOneNode,
    annualList,
    recruitNumList,
    recruitNumListAll,
    setNewYearData,
    getOptionsObj
  }
}
