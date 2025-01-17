// @flow
const isHotReloading = (): boolean => {
  return !!(
    typeof module !== 'undefined' &&
    module.hot &&
    typeof module.hot.status === 'function' &&
    module.hot.status() === 'apply'
  )
}

export default isHotReloading
