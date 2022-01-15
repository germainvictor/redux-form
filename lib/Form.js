'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

exports.__esModule = true
exports['default'] = void 0

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutPropertiesLoose')
)

var _inheritsLoose2 = _interopRequireDefault(require('@babel/runtime/helpers/inheritsLoose'))

var _react = _interopRequireWildcard(require('react'))

var _propTypes = _interopRequireDefault(require('prop-types'))

var _ReduxFormContext = require('./ReduxFormContext')

var _excluded = ['_reduxForm']

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

var Form = /*#__PURE__*/ (function(_Component) {
  ;(0, _inheritsLoose2['default'])(Form, _Component)

  function Form(props) {
    var _this

    _this = _Component.call(this, props) || this

    if (!props._reduxForm) {
      throw new Error('Form must be inside a component decorated with reduxForm()')
    }

    return _this
  }

  var _proto = Form.prototype

  _proto.componentDidMount = function componentDidMount() {
    this.props._reduxForm.registerInnerOnSubmit(this.props.onSubmit)
  }

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.onSubmit !== prevProps.onSubmit) {
      this.props._reduxForm.registerInnerOnSubmit(this.props.onSubmit)
    }
  }

  _proto.render = function render() {
    var _this$props = this.props,
      _reduxForm = _this$props._reduxForm,
      rest = (0, _objectWithoutPropertiesLoose2['default'])(_this$props, _excluded)
    return /*#__PURE__*/ _react['default'].createElement('form', rest)
  }

  return Form
})(_react.Component)

Form.propTypes = {
  onSubmit: _propTypes['default'].func.isRequired,
  _reduxForm: _propTypes['default'].object
}

var _default = (0, _ReduxFormContext.withReduxForm)(Form)

exports['default'] = _default
