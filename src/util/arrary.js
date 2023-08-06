export default {
    arrayRemoval(targetArray, soureArray) {
      return Array.from(new Set(targetArray.push(...soureArray)))
    },
    removeValue(array = [], key = 'id') {
      const obj = {}
  
      let _array = array.reduce((cur, next) => {
        obj[next[key]] ? '' : (obj[next[key]] = true && cur.push(next))
        return cur
      }, [])
      return _array
    }
  }
  