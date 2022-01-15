'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

exports.__esModule = true
exports['default'] = void 0

var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'))

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/objectWithoutPropertiesLoose')
)

var _inheritsLoose2 = _interopRequireDefault(require('@babel/runtime/helpers/inheritsLoose'))

var _react = _interopRequireWildcard(require('react'))

var _propTypes = _interopRequireDefault(require('prop-types'))

var _prefixName = _interopRequireDefault(require('./util/prefixName'))

var _ReduxFormContext = require('./ReduxFormContext')

var _validateComponentProp = _interopRequireDefault(require('./util/validateComponentProp'))

var _excluded = ['_reduxForm', 'children', 'name', 'component']

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

var FormSection = /*#__PURE__*/ (function(_Component) {
  ;(0, _inheritsLoose2['default'])(FormSection, _Component)

  function FormSection(props) {
    var _this

    _this = _Component.call(this, props) || this

    if (!props._reduxForm) {
      throw new Error('FormSection must be inside a component decorated with reduxForm()')
    }

    return _this
  }

  var _proto = FormSection.prototype

  _proto.render = function render() {
    var _this$props = this.props,
      _reduxForm = _this$props._reduxForm,
      children = _this$props.children,
      name = _this$props.name,
      component = _this$props.component,
      rest = (0, _objectWithoutPropertiesLoose2['default'])(_this$props, _excluded)

    if (/*#__PURE__*/ _react['default'].isValidElement(children)) {
      return /*#__PURE__*/ (0, _react.createElement)(_ReduxFormContext.ReduxFormContext.Provider, {
        value: (0, _extends2['default'])({}, this.props._reduxForm, {
          sectionPrefix: (0, _prefixName['default'])(this.props, name)
        }),
        children: children
      })
    }

    return /*#__PURE__*/ (0, _react.createElement)(_ReduxFormContext.ReduxFormContext.Provider, {
      value: (0, _extends2['default'])({}, this.props._reduxForm, {
        sectionPrefix: (0, _prefixName['default'])(this.props, name)
      }),
      children: /*#__PURE__*/ (0, _react.createElement)(
        component,
        (0, _extends2['default'])({}, rest, {
          children: children
        })
      )
    })
  }

  return FormSection
})(_react.Component)

FormSection.propTypes = {
  name: _propTypes['default'].string.isRequired,
  component: _validateComponentProp['default']
}
FormSection.defaultProps = {
  component: 'div'
}

var _default = (0, _ReduxFormContext.withReduxForm)(FormSection)

exports['default'] = _default
