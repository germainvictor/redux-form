'use strict'

exports.__esModule = true
exports['default'] = void 0

var isHotReloading = function isHotReloading() {
  return !!(
    typeof module !== 'undefined' &&
    module.hot &&
    typeof module.hot.status === 'function' &&
    module.hot.status() === 'apply'
  )
}

var _default = isHotReloading
exports['default'] = _default
