import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose'
import _inheritsLoose from '@babel/runtime/helpers/inheritsLoose'
var _excluded = ['_reduxForm']
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withReduxForm } from './ReduxFormContext'

var Form = /*#__PURE__*/ (function(_Component) {
  _inheritsLoose(Form, _Component)

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
      rest = _objectWithoutPropertiesLoose(_this$props, _excluded)

    return /*#__PURE__*/ React.createElement('form', rest)
  }

  return Form
})(Component)

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  _reduxForm: PropTypes.object
}
export default withReduxForm(Form)
