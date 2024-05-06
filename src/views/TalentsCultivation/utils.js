import { CopyObj, addAllowKeepAlive } from '@/util/utils'
import router from '@/router'

// 树级数据处理
export const formatTreeData = (treeData) => {
  for (let i = 0, j = treeData.length; i < j; i++) {
    if (Array.isArray(treeData[i].subLine) && treeData[i].subLine.length) {
      treeData[i].subLine = formatTreeData(treeData[i].subLine)
    } else {
      Reflect.deleteProperty(treeData[i], 'subLine')
    }
  }
  return treeData
}

/**
 * 项目类型切换关联关系
 * 0: 全部，28001: 耀你闪亮， 28002: 条线， 28003: 机构
 * 0: 不显示项目所属单位
 * 28001: 固定选项为总行
 * 28002: 选项切换为条线
 * 28003: 选项切换为机构
 */
export const projectTypeEvents = (value, vueInsData) => {
  vueInsData.treeData = null
  switch (value) {
    case '0':
      vueInsData.treeOptions = [{ parentQcCode: null, qCCode: '', qCMsg: '全部' }]
      vueInsData.treeData = ''
      break
    case '28001':
      vueInsData.treeOptions = [{ parentQcCode: null, qCCode: 'headquarter', qCMsg: '总行' }]
      vueInsData.treeData = 'headquarter'
      break
    // 条线
    case '28002':
      vueInsData.treeOptions = vueInsData.lineList
      break
    // 机构
    case '28003':
      vueInsData.treeOptions = vueInsData.orgList
      break
  }
}

/**
 * 跳转至详情页
 */
export const goToPage = (targetPath, router, params) => {
  let { path, name } = router.getRoutes().find((item) => item.path === targetPath)
  addAllowKeepAlive(path)
  router.push({ name, params })
}

/**
 * 与项目类型相关的参数格式化处理
 */

export const formatParamsByProjectType = (params, treeData) => {
  // 数据请求参数格式化
  let res = CopyObj(params)
  // 条线和部门与项目类型会有级联关系，交互上是单选，后端设置为了list, 需要做下转化
  const setLineAndOrgData = () => {
    if(!treeData) return
    // 后端同一个功能取了不同的字段，这里需要做个匹配
    if (res.projectType === '28002' || res.projectBlgType === '28002') {
      res.lineIds = Array.isArray(treeData) && treeData.length ? [treeData] : []
      if(!Array.isArray(treeData)) res.lineIds = [treeData]
    }
    if (res.projectType === '28003' || res.projectBlgType === '28003') {
      res.orgIds = (Array.isArray(treeData) && treeData.length) ? [treeData] : []
      res.organIds = (Array.isArray(treeData) && treeData.length) ? [treeData] : []
      if(!Array.isArray(treeData)) {
        res.orgIds = [treeData]
        res.organIds = [treeData]
      }
    }
  }
  setLineAndOrgData()
  res.deptIds = res.deptIds.length ? [res.deptIds[res.deptIds.length - 1]] : []
  res.annual = res.annual ? [res.annual] : []
  res.projectType = res.projectType || '0'
  res.projectBlgType = res.projectBlgType || '0'
  console.log(res, '====>>> res');
  return res
}