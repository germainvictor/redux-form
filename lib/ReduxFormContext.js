'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

exports.__esModule = true
exports.withReduxForm = exports.renderChildren = exports.ReduxFormContext = void 0

var _inheritsLoose2 = _interopRequireDefault(require('@babel/runtime/helpers/inheritsLoose'))

var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'))

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutPropertiesLoose')
)

var React = _interopRequireWildcard(require('react'))

var _excluded = ['forwardedRef']

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null
  var cacheBabelInterop = new WeakMap()
  var cacheNodeInterop = new WeakMap()
  return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop
  })(nodeInterop)
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return { default: obj }
  }
  var cache = _getRequireWildcardCache(nodeInterop)
  if (cache && cache.has(obj)) {
    return cache.get(obj)
  }
  var newObj = {}
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc)
      } else {
        newObj[key] = obj[key]
      }
    }
  }
  newObj['default'] = obj
  if (cache) {
    cache.set(obj, newObj)
  }
  return newObj
}

var ReduxFormContext = /*#__PURE__*/ React.createContext(null)
exports.ReduxFormContext = ReduxFormContext

var renderChildren = function renderChildren(Component, _ref) {
  var forwardedRef = _ref.forwardedRef,
    rest = (0, _objectWithoutPropertiesLoose2['default'])(_ref, _excluded)
  return function(_reduxForm) {
    return /*#__PURE__*/ React.createElement(
      Component,
      (0, _extends2['default'])({}, rest, {
        _reduxForm: _reduxForm,
        ref: forwardedRef
      })
    )
  }
}

exports.renderChildren = renderChildren

var withReduxForm = function withReduxForm(Component) {
  var Hoc = /*#__PURE__*/ (function(_React$Component) {
    ;(0, _inheritsLoose2['default'])(Hoc, _React$Component)

    function Hoc() {
      return _React$Component.apply(this, arguments) || this
    }

    var _proto = Hoc.prototype

    _proto.render = function render() {
      return /*#__PURE__*/ React.createElement(ReduxFormContext.Consumer, {
        children: renderChildren(Component, this.props)
      })
    }

    return Hoc
  })(React.Component)

  var ref = /*#__PURE__*/ React.forwardRef(function(props, ref) {
    return /*#__PURE__*/ React.createElement(
      Hoc,
      (0, _extends2['default'])({}, props, {
        forwardedRef: ref
      })
    )
  })
  ref.displayName = Component.displayName || Component.name || 'Component'
  return ref
}

exports.withReduxForm = withReduxForm
