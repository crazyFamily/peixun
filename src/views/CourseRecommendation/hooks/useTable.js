export function useTable(options) {
    const { selectedList: _tableSelectedDatas } = options
  
    // 用于记录在其他分页上，从未显示的数据。
    const unshowPageSelectedDatas = new Map()
    _tableSelectedDatas.forEach((row) => {
      unshowPageSelectedDatas.set(row.id, row)
    })
  
    // 更新数据
    const updateUnshowDatasMaps = (datas) => {
      if (datas && !Array.isArray(datas)) datas = [datas]
      datas.forEach((row) => {
        if (unshowPageSelectedDatas.has(row.id)) {
          unshowPageSelectedDatas.delete(row.id)
        }
      })
    }
  
    const getUnshowPageSelectedDatas = () => {
      return Array.from(unshowPageSelectedDatas.values())
    }
  
    const initDatasMap = (datas) => {
      unshowPageSelectedDatas.clear()
      updateUnshowDatasMaps(datas)
    }
  
    return {
      updateUnshowDatasMaps,
      getUnshowPageSelectedDatas,
      initDatasMap
    }
  }
  