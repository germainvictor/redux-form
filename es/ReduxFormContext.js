import _inheritsLoose from '@babel/runtime/helpers/inheritsLoose'
import _extends from '@babel/runtime/helpers/extends'
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose'
var _excluded = ['forwardedRef']
import * as React from 'react'
export var ReduxFormContext = /*#__PURE__*/ React.createContext(null)
export var renderChildren = function renderChildren(Component, _ref) {
  var forwardedRef = _ref.forwardedRef,
    rest = _objectWithoutPropertiesLoose(_ref, _excluded)

  return function(_reduxForm) {
    return /*#__PURE__*/ React.createElement(
      Component,
      _extends({}, rest, {
        _reduxForm: _reduxForm,
        ref: forwardedRef
      })
    )
  }
}
export var withReduxForm = function withReduxForm(Component) {
  var Hoc = /*#__PURE__*/ (function(_React$Component) {
    _inheritsLoose(Hoc, _React$Component)

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
      _extends({}, props, {
        forwardedRef: ref
      })
    )
  })
  ref.displayName = Component.displayName || Component.name || 'Component'
  return ref
}
