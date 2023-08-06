export default {
    setLocalStorage(key = 'myCat', data = 'Tom') {
      localStorage.setItem(key, data)
    },
    getLocalStorage(key) {
      return localStorage.getItem(key)
    }
  }
  