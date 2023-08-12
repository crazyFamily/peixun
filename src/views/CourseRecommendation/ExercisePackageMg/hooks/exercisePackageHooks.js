export function exercisePackageHooks() {
    const useCacheParams = (params, vueInt) => {
      if (params && Object.keys(params).length) {
        return params
      }
      return vueInt.params
    }
    return { useCacheParams }
  }
  