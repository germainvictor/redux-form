import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/objectWithoutPropertiesLoose'
import _isFunction from 'lodash/isFunction'
var _excluded = ['_error'],
  _excluded2 = ['_error']
import {
  ARRAY_INSERT,
  ARRAY_MOVE,
  ARRAY_POP,
  ARRAY_PUSH,
  ARRAY_REMOVE,
  ARRAY_REMOVE_ALL,
  ARRAY_SHIFT,
  ARRAY_SPLICE,
  ARRAY_SWAP,
  ARRAY_UNSHIFT,
  AUTOFILL,
  BLUR,
  CHANGE,
  CLEAR_ASYNC_ERROR,
  CLEAR_SUBMIT,
  CLEAR_SUBMIT_ERRORS,
  DESTROY,
  FOCUS,
  INITIALIZE,
  prefix,
  REGISTER_FIELD,
  RESET,
  RESET_SECTION,
  SET_SUBMIT_FAILED,
  SET_SUBMIT_SUCCEEDED,
  START_ASYNC_VALIDATION,
  START_SUBMIT,
  STOP_ASYNC_VALIDATION,
  STOP_SUBMIT,
  SUBMIT,
  TOUCH,
  UNREGISTER_FIELD,
  UNTOUCH,
  UPDATE_SYNC_ERRORS,
  CLEAR_FIELDS,
  UPDATE_SYNC_WARNINGS
} from './actionTypes'
import createDeleteInWithCleanUp from './deleteInWithCleanUp'
import plain from './structure/plain'

var shouldDelete = function shouldDelete(_ref) {
  var getIn = _ref.getIn
  return function(state, path) {
    var initialValuesPath = null

    if (/^values/.test(path)) {
      initialValuesPath = path.replace('values', 'initial')
    }

    var initialValueComparison = initialValuesPath
      ? getIn(state, initialValuesPath) === undefined
      : true
    return getIn(state, path) !== undefined && initialValueComparison
  }
}

var isReduxFormAction = function isReduxFormAction(action) {
  return (
    action &&
    action.type &&
    action.type.length > prefix.length &&
    action.type.substring(0, prefix.length) === prefix
  )
}

function createReducer(structure) {
  var _behaviors

  var deepEqual = structure.deepEqual,
    empty = structure.empty,
    forEach = structure.forEach,
    getIn = structure.getIn,
    setIn = structure.setIn,
    deleteIn = structure.deleteIn,
    fromJS = structure.fromJS,
    keys = structure.keys,
    size = structure.size,
    some = structure.some,
    splice = structure.splice
  var deleteInWithCleanUp = createDeleteInWithCleanUp(structure)(shouldDelete)
  var plainDeleteInWithCleanUp = createDeleteInWithCleanUp(plain)(shouldDelete)

  var doSplice = function doSplice(state, key, field, index, removeNum, value, force) {
    var existing = getIn(state, key + '.' + field)
    return existing || force
      ? setIn(state, key + '.' + field, splice(existing, index, removeNum, value))
      : state
  }

  var doPlainSplice = function doPlainSplice(state, key, field, index, removeNum, value, force) {
    var slice = getIn(state, key)
    var existing = plain.getIn(slice, field)
    return existing || force
      ? setIn(
          state,
          key,
          plain.setIn(slice, field, plain.splice(existing, index, removeNum, value))
        )
      : state
  }

  var rootKeys = ['values', 'fields', 'submitErrors', 'asyncErrors']

  var arraySplice = function arraySplice(state, field, index, removeNum, value) {
    var result = state
    var nonValuesValue = value != null ? empty : undefined
    result = doSplice(result, 'values', field, index, removeNum, value, true)
    result = doSplice(result, 'fields', field, index, removeNum, nonValuesValue)
    result = doPlainSplice(result, 'syncErrors', field, index, removeNum, undefined)
    result = doPlainSplice(result, 'syncWarnings', field, index, removeNum, undefined)
    result = doSplice(result, 'submitErrors', field, index, removeNum, undefined)
    result = doSplice(result, 'asyncErrors', field, index, removeNum, undefined)
    return result
  }

  var behaviors =
    ((_behaviors = {}),
    (_behaviors[ARRAY_INSERT] = function(state, _ref2) {
      var _ref2$meta = _ref2.meta,
        field = _ref2$meta.field,
        index = _ref2$meta.index,
        payload = _ref2.payload
      return arraySplice(state, field, index, 0, payload)
    }),
    (_behaviors[ARRAY_MOVE] = function(state, _ref3) {
      var _ref3$meta = _ref3.meta,
        field = _ref3$meta.field,
        from = _ref3$meta.from,
        to = _ref3$meta.to
      var array = getIn(state, 'values.' + field)
      var length = array ? size(array) : 0
      var result = state

      if (length) {
        rootKeys.forEach(function(key) {
          var path = key + '.' + field

          if (getIn(result, path)) {
            var value = getIn(result, path + '[' + from + ']')
            result = setIn(result, path, splice(getIn(result, path), from, 1)) // remove

            result = setIn(result, path, splice(getIn(result, path), to, 0, value)) // insert
          }
        })
      }

      return result
    }),
    (_behaviors[ARRAY_POP] = function(state, _ref4) {
      var field = _ref4.meta.field
      var array = getIn(state, 'values.' + field)
      var length = array ? size(array) : 0
      return length ? arraySplice(state, field, length - 1, 1) : state
    }),
    (_behaviors[ARRAY_PUSH] = function(state, _ref5) {
      var field = _ref5.meta.field,
        payload = _ref5.payload
      var array = getIn(state, 'values.' + field)
      var length = array ? size(array) : 0
      return arraySplice(state, field, length, 0, payload)
    }),
    (_behaviors[ARRAY_REMOVE] = function(state, _ref6) {
      var _ref6$meta = _ref6.meta,
        field = _ref6$meta.field,
        index = _ref6$meta.index
      return arraySplice(state, field, index, 1)
    }),
    (_behaviors[ARRAY_REMOVE_ALL] = function(state, _ref7) {
      var field = _ref7.meta.field
      var array = getIn(state, 'values.' + field)
      var length = array ? size(array) : 0
      return length ? arraySplice(state, field, 0, length) : state
    }),
    (_behaviors[ARRAY_SHIFT] = function(state, _ref8) {
      var field = _ref8.meta.field
      return arraySplice(state, field, 0, 1)
    }),
    (_behaviors[ARRAY_SPLICE] = function(state, _ref9) {
      var _ref9$meta = _ref9.meta,
        field = _ref9$meta.field,
        index = _ref9$meta.index,
        removeNum = _ref9$meta.removeNum,
        payload = _ref9.payload
      return arraySplice(state, field, index, removeNum, payload)
    }),
    (_behaviors[ARRAY_SWAP] = function(state, _ref10) {
      var _ref10$meta = _ref10.meta,
        field = _ref10$meta.field,
        indexA = _ref10$meta.indexA,
        indexB = _ref10$meta.indexB
      var result = state
      rootKeys.forEach(function(key) {
        var valueA = getIn(result, key + '.' + field + '[' + indexA + ']')
        var valueB = getIn(result, key + '.' + field + '[' + indexB + ']')

        if (valueA !== undefined || valueB !== undefined) {
          result = setIn(result, key + '.' + field + '[' + indexA + ']', valueB)
          result = setIn(result, key + '.' + field + '[' + indexB + ']', valueA)
        }
      })
      return result
    }),
    (_behaviors[ARRAY_UNSHIFT] = function(state, _ref11) {
      var field = _ref11.meta.field,
        payload = _ref11.payload
      return arraySplice(state, field, 0, 0, payload)
    }),
    (_behaviors[AUTOFILL] = function(state, _ref12) {
      var field = _ref12.meta.field,
        payload = _ref12.payload
      var result = state
      result = deleteInWithCleanUp(result, 'asyncErrors.' + field)
      result = deleteInWithCleanUp(result, 'submitErrors.' + field)
      result = setIn(result, 'fields.' + field + '.autofilled', true)
      result = setIn(result, 'values.' + field, payload)
      return result
    }),
    (_behaviors[BLUR] = function(state, _ref13) {
      var _ref13$meta = _ref13.meta,
        field = _ref13$meta.field,
        touch = _ref13$meta.touch,
        payload = _ref13.payload
      var result = state
      var initial = getIn(result, 'initial.' + field)

      if (initial === undefined && payload === '') {
        result = deleteInWithCleanUp(result, 'values.' + field)
      } else if (payload !== undefined) {
        result = setIn(result, 'values.' + field, payload)
      }

      if (field === getIn(result, 'active')) {
        result = deleteIn(result, 'active')
      }

      result = deleteIn(result, 'fields.' + field + '.active')

      if (touch) {
        result = setIn(result, 'fields.' + field + '.touched', true)
        result = setIn(result, 'anyTouched', true)
      }

      return result
    }),
    (_behaviors[CHANGE] = function(state, _ref14) {
      var _ref14$meta = _ref14.meta,
        field = _ref14$meta.field,
        touch = _ref14$meta.touch,
        persistentSubmitErrors = _ref14$meta.persistentSubmitErrors,
        payload = _ref14.payload
      var result = state
      var initial = getIn(result, 'initial.' + field)

      if ((initial === undefined && payload === '') || payload === undefined) {
        result = deleteInWithCleanUp(result, 'values.' + field)
      } else if (_isFunction(payload)) {
        var fieldCurrentValue = getIn(state, 'values.' + field)
        result = setIn(result, 'values.' + field, payload(fieldCurrentValue, state.values))
      } else {
        result = setIn(result, 'values.' + field, payload)
      }

      result = deleteInWithCleanUp(result, 'asyncErrors.' + field)

      if (!persistentSubmitErrors) {
        result = deleteInWithCleanUp(result, 'submitErrors.' + field)
      }

      result = deleteInWithCleanUp(result, 'fields.' + field + '.autofilled')

      if (touch) {
        result = setIn(result, 'fields.' + field + '.touched', true)
        result = setIn(result, 'anyTouched', true)
      }

      return result
    }),
    (_behaviors[CLEAR_SUBMIT] = function(state) {
      return deleteIn(state, 'triggerSubmit')
    }),
    (_behaviors[CLEAR_SUBMIT_ERRORS] = function(state) {
      var result = state
      result = deleteInWithCleanUp(result, 'submitErrors')
      result = deleteIn(result, 'error')
      return result
    }),
    (_behaviors[CLEAR_ASYNC_ERROR] = function(state, _ref15) {
      var field = _ref15.meta.field
      return deleteIn(state, 'asyncErrors.' + field)
    }),
    (_behaviors[CLEAR_FIELDS] = function(state, _ref16) {
      var _ref16$meta = _ref16.meta,
        keepTouched = _ref16$meta.keepTouched,
        persistentSubmitErrors = _ref16$meta.persistentSubmitErrors,
        fields = _ref16$meta.fields
      var result = state
      fields.forEach(function(field) {
        result = deleteInWithCleanUp(result, 'asyncErrors.' + field)

        if (!persistentSubmitErrors) {
          result = deleteInWithCleanUp(result, 'submitErrors.' + field)
        }

        result = deleteInWithCleanUp(result, 'fields.' + field + '.autofilled')

        if (!keepTouched) {
          result = deleteIn(result, 'fields.' + field + '.touched')
        }

        var values = getIn(state, 'initial.' + field)
        result = values
          ? setIn(result, 'values.' + field, values)
          : deleteInWithCleanUp(result, 'values.' + field)
      })
      var anyTouched = some(keys(getIn(result, 'registeredFields')), function(key) {
        return getIn(result, 'fields.' + key + '.touched')
      })
      result = anyTouched ? setIn(result, 'anyTouched', true) : deleteIn(result, 'anyTouched')
      return result
    }),
    (_behaviors[FOCUS] = function(state, _ref17) {
      var field = _ref17.meta.field
      var result = state
      var previouslyActive = getIn(state, 'active')
      result = deleteIn(result, 'fields.' + previouslyActive + '.active')
      result = setIn(result, 'fields.' + field + '.visited', true)
      result = setIn(result, 'fields.' + field + '.active', true)
      result = setIn(result, 'active', field)
      return result
    }),
    (_behaviors[INITIALIZE] = function(state, _ref18) {
      var payload = _ref18.payload,
        _ref18$meta = _ref18.meta,
        keepDirty = _ref18$meta.keepDirty,
        keepSubmitSucceeded = _ref18$meta.keepSubmitSucceeded,
        updateUnregisteredFields = _ref18$meta.updateUnregisteredFields,
        keepValues = _ref18$meta.keepValues
      var mapData = fromJS(payload)
      var result = empty // clean all field state
      // persist old warnings, they will get recalculated if the new form values are different from the old values

      var warning = getIn(state, 'warning')

      if (warning) {
        result = setIn(result, 'warning', warning)
      }

      var syncWarnings = getIn(state, 'syncWarnings')

      if (syncWarnings) {
        result = setIn(result, 'syncWarnings', syncWarnings)
      } // persist old errors, they will get recalculated if the new form values are different from the old values

      var error = getIn(state, 'error')

      if (error) {
        result = setIn(result, 'error', error)
      }

      var syncErrors = getIn(state, 'syncErrors')

      if (syncErrors) {
        result = setIn(result, 'syncErrors', syncErrors)
      }

      var registeredFields = getIn(state, 'registeredFields')

      if (registeredFields) {
        result = setIn(result, 'registeredFields', registeredFields)
      }

      var previousValues = getIn(state, 'values')
      var previousInitialValues = getIn(state, 'initial')
      var newInitialValues = mapData
      var newValues = previousValues

      if (keepDirty && registeredFields) {
        if (!deepEqual(newInitialValues, previousInitialValues)) {
          //
          // Keep the value of dirty fields while updating the value of
          // pristine fields. This way, apps can reinitialize forms while
          // avoiding stomping on user edits.
          //
          // Note 1: The initialize action replaces all initial values
          // regardless of keepDirty.
          //
          // Note 2: When a field is dirty, keepDirty is enabled, and the field
          // value is the same as the new initial value for the field, the
          // initialize action causes the field to become pristine. That effect
          // is what we want.
          //
          var overwritePristineValue = function overwritePristineValue(name) {
            var previousInitialValue = getIn(previousInitialValues, name)
            var previousValue = getIn(previousValues, name)

            if (deepEqual(previousValue, previousInitialValue)) {
              // Overwrite the old pristine value with the new pristine value
              var newInitialValue = getIn(newInitialValues, name) // This check prevents any 'setIn' call that would create useless
              // nested objects, since the path to the new field value would
              // evaluate to the same (especially for undefined values)

              if (getIn(newValues, name) !== newInitialValue) {
                newValues = setIn(newValues, name, newInitialValue)
              }
            }
          }

          if (!updateUnregisteredFields) {
            forEach(keys(registeredFields), function(name) {
              return overwritePristineValue(name)
            })
          }

          forEach(keys(newInitialValues), function(name) {
            var previousInitialValue = getIn(previousInitialValues, name)

            if (typeof previousInitialValue === 'undefined') {
              // Add new values at the root level.
              var newInitialValue = getIn(newInitialValues, name)
              newValues = setIn(newValues, name, newInitialValue)
            }

            if (updateUnregisteredFields) {
              overwritePristineValue(name)
            }
          })
        }
      } else {
        newValues = newInitialValues
      }

      if (keepValues) {
        forEach(keys(previousValues), function(name) {
          var previousValue = getIn(previousValues, name)
          newValues = setIn(newValues, name, previousValue)
        })
        forEach(keys(previousInitialValues), function(name) {
          var previousInitialValue = getIn(previousInitialValues, name)
          newInitialValues = setIn(newInitialValues, name, previousInitialValue)
        })
      }

      if (keepSubmitSucceeded && getIn(state, 'submitSucceeded')) {
        result = setIn(result, 'submitSucceeded', true)
      }

      result = setIn(result, 'values', newValues)
      result = setIn(result, 'initial', newInitialValues)
      return result
    }),
    (_behaviors[REGISTER_FIELD] = function(state, _ref19) {
      var _ref19$payload = _ref19.payload,
        name = _ref19$payload.name,
        type = _ref19$payload.type
      var key = "registeredFields['" + name + "']"
      var field = getIn(state, key)

      if (field) {
        var count = getIn(field, 'count') + 1
        field = setIn(field, 'count', count)
      } else {
        field = fromJS({
          name: name,
          type: type,
          count: 1
        })
      }

      return setIn(state, key, field)
    }),
    (_behaviors[RESET] = function(state) {
      var result = empty
      var registeredFields = getIn(state, 'registeredFields')

      if (registeredFields) {
        result = setIn(result, 'registeredFields', registeredFields)
      }

      var values = getIn(state, 'initial')

      if (values) {
        result = setIn(result, 'values', values)
        result = setIn(result, 'initial', values)
      }

      return result
    }),
    (_behaviors[RESET_SECTION] = function(state, _ref20) {
      var sections = _ref20.meta.sections
      var result = state
      sections.forEach(function(section) {
        result = deleteInWithCleanUp(result, 'asyncErrors.' + section)
        result = deleteInWithCleanUp(result, 'submitErrors.' + section)
        result = deleteInWithCleanUp(result, 'fields.' + section)
        var values = getIn(state, 'initial.' + section)
        result = values
          ? setIn(result, 'values.' + section, values)
          : deleteInWithCleanUp(result, 'values.' + section)
      })
      var anyTouched = some(keys(getIn(result, 'registeredFields')), function(key) {
        return getIn(result, 'fields.' + key + '.touched')
      })
      result = anyTouched ? setIn(result, 'anyTouched', true) : deleteIn(result, 'anyTouched')
      return result
    }),
    (_behaviors[SUBMIT] = function(state) {
      return setIn(state, 'triggerSubmit', true)
    }),
    (_behaviors[START_ASYNC_VALIDATION] = function(state, _ref21) {
      var field = _ref21.meta.field
      return setIn(state, 'asyncValidating', field || true)
    }),
    (_behaviors[START_SUBMIT] = function(state) {
      return setIn(state, 'submitting', true)
    }),
    (_behaviors[STOP_ASYNC_VALIDATION] = function(state, _ref22) {
      var payload = _ref22.payload
      var result = state
      result = deleteIn(result, 'asyncValidating')

      if (payload && Object.keys(payload).length) {
        var _error = payload._error,
          fieldErrors = _objectWithoutPropertiesLoose(payload, _excluded)

        if (_error) {
          result = setIn(result, 'error', _error)
        }

        if (Object.keys(fieldErrors).length) {
          result = setIn(result, 'asyncErrors', fromJS(fieldErrors))
        }
      } else {
        result = deleteIn(result, 'error')
        result = deleteIn(result, 'asyncErrors')
      }

      return result
    }),
    (_behaviors[STOP_SUBMIT] = function(state, _ref23) {
      var payload = _ref23.payload
      var result = state
      result = deleteIn(result, 'submitting')
      result = deleteIn(result, 'submitFailed')
      result = deleteIn(result, 'submitSucceeded')

      if (payload && Object.keys(payload).length) {
        var _error = payload._error,
          fieldErrors = _objectWithoutPropertiesLoose(payload, _excluded2)

        if (_error) {
          result = setIn(result, 'error', _error)
        } else {
          result = deleteIn(result, 'error')
        }

        if (Object.keys(fieldErrors).length) {
          result = setIn(result, 'submitErrors', fromJS(fieldErrors))
        } else {
          result = deleteIn(result, 'submitErrors')
        }

        result = setIn(result, 'submitFailed', true)
      } else {
        result = deleteIn(result, 'error')
        result = deleteIn(result, 'submitErrors')
      }

      return result
    }),
    (_behaviors[SET_SUBMIT_FAILED] = function(state, _ref24) {
      var fields = _ref24.meta.fields
      var result = state
      result = setIn(result, 'submitFailed', true)
      result = deleteIn(result, 'submitSucceeded')
      result = deleteIn(result, 'submitting')
      fields.forEach(function(field) {
        return (result = setIn(result, 'fields.' + field + '.touched', true))
      })

      if (fields.length) {
        result = setIn(result, 'anyTouched', true)
      }

      return result
    }),
    (_behaviors[SET_SUBMIT_SUCCEEDED] = function(state) {
      var result = state
      result = deleteIn(result, 'submitFailed')
      result = setIn(result, 'submitSucceeded', true)
      return result
    }),
    (_behaviors[TOUCH] = function(state, _ref25) {
      var fields = _ref25.meta.fields
      var result = state
      fields.forEach(function(field) {
        return (result = setIn(result, 'fields.' + field + '.touched', true))
      })
      result = setIn(result, 'anyTouched', true)
      return result
    }),
    (_behaviors[UNREGISTER_FIELD] = function(state, _ref26) {
      var _ref26$payload = _ref26.payload,
        name = _ref26$payload.name,
        destroyOnUnmount = _ref26$payload.destroyOnUnmount
      var result = state
      var key = "registeredFields['" + name + "']"
      var field = getIn(result, key)

      if (!field) {
        return result
      }

      var count = getIn(field, 'count') - 1

      if (count <= 0 && destroyOnUnmount) {
        // Note: Cannot use deleteWithCleanUp here because of the flat nature of registeredFields
        result = deleteIn(result, key)

        if (deepEqual(getIn(result, 'registeredFields'), empty)) {
          result = deleteIn(result, 'registeredFields')
        }

        var syncErrors = getIn(result, 'syncErrors')

        if (syncErrors) {
          syncErrors = plainDeleteInWithCleanUp(syncErrors, name)

          if (plain.deepEqual(syncErrors, plain.empty)) {
            result = deleteIn(result, 'syncErrors')
          } else {
            result = setIn(result, 'syncErrors', syncErrors)
          }
        }

        var syncWarnings = getIn(result, 'syncWarnings')

        if (syncWarnings) {
          syncWarnings = plainDeleteInWithCleanUp(syncWarnings, name)

          if (plain.deepEqual(syncWarnings, plain.empty)) {
            result = deleteIn(result, 'syncWarnings')
          } else {
            result = setIn(result, 'syncWarnings', syncWarnings)
          }
        }

        result = deleteInWithCleanUp(result, 'submitErrors.' + name)
        result = deleteInWithCleanUp(result, 'asyncErrors.' + name)
      } else {
        field = setIn(field, 'count', count)
        result = setIn(result, key, field)
      }

      return result
    }),
    (_behaviors[UNTOUCH] = function(state, _ref27) {
      var fields = _ref27.meta.fields
      var result = state
      fields.forEach(function(field) {
        return (result = deleteIn(result, 'fields.' + field + '.touched'))
      })
      var anyTouched = some(keys(getIn(result, 'registeredFields')), function(key) {
        return getIn(result, 'fields.' + key + '.touched')
      })
      result = anyTouched ? setIn(result, 'anyTouched', true) : deleteIn(result, 'anyTouched')
      return result
    }),
    (_behaviors[UPDATE_SYNC_ERRORS] = function(state, _ref28) {
      var _ref28$payload = _ref28.payload,
        syncErrors = _ref28$payload.syncErrors,
        error = _ref28$payload.error
      var result = state

      if (error) {
        result = setIn(result, 'error', error)
        result = setIn(result, 'syncError', true)
      } else {
        result = deleteIn(result, 'error')
        result = deleteIn(result, 'syncError')
      }

      if (Object.keys(syncErrors).length) {
        result = setIn(result, 'syncErrors', syncErrors)
      } else {
        result = deleteIn(result, 'syncErrors')
      }

      return result
    }),
    (_behaviors[UPDATE_SYNC_WARNINGS] = function(state, _ref29) {
      var _ref29$payload = _ref29.payload,
        syncWarnings = _ref29$payload.syncWarnings,
        warning = _ref29$payload.warning
      var result = state

      if (warning) {
        result = setIn(result, 'warning', warning)
      } else {
        result = deleteIn(result, 'warning')
      }

      if (Object.keys(syncWarnings).length) {
        result = setIn(result, 'syncWarnings', syncWarnings)
      } else {
        result = deleteIn(result, 'syncWarnings')
      }

      return result
    }),
    _behaviors)

  var reducer = function reducer(state, action) {
    if (state === void 0) {
      state = empty
    }

    var behavior = behaviors[action.type]
    return behavior ? behavior(state, action) : state
  }

  var byForm = function byForm(reducer) {
    return function(state, action) {
      if (state === void 0) {
        state = empty
      }

      if (action === void 0) {
        action = {
          type: 'NONE'
        }
      }

      var form = action && action.meta && action.meta.form

      if (!form || !isReduxFormAction(action)) {
        return state
      }

      if (action.type === DESTROY && action.meta && action.meta.form) {
        return action.meta.form.reduce(function(result, form) {
          return deleteInWithCleanUp(result, form)
        }, state)
      }

      var formState = getIn(state, form)
      var result = reducer(formState, action)
      return result === formState ? state : setIn(state, form, result)
    }
  }
  /**
   * Adds additional functionality to the reducer
   */

  function decorate(target) {
    target.plugin = function(reducers, config) {
      var _this = this

      if (config === void 0) {
        config = {}
      }

      // use 'function' keyword to enable 'this'
      return decorate(function(state, action) {
        if (state === void 0) {
          state = empty
        }

        if (action === void 0) {
          action = {
            type: 'NONE'
          }
        }

        var callPlugin = function callPlugin(processed, key) {
          var previousState = getIn(processed, key)
          var nextState = reducers[key](previousState, action, getIn(state, key))
          return nextState !== previousState ? setIn(processed, key, nextState) : processed
        }

        var processed = _this(state, action) // run through redux-form reducer

        var form = action && action.meta && action.meta.form

        if (form && !config.receiveAllFormActions) {
          // this is an action aimed at forms, so only give it to the specified form's plugin
          return reducers[form] ? callPlugin(processed, form) : processed
        } else {
          // this is not a form-specific action, so send it to all the plugins
          return Object.keys(reducers).reduce(callPlugin, processed)
        }
      })
    }

    return target
  }

  return decorate(byForm(reducer))
}

export default createReducer
