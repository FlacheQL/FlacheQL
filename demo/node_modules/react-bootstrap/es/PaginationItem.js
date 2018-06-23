import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
/* eslint-disable react/no-multi-comp */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import SafeAnchor from './SafeAnchor';

var propTypes = {
  eventKey: PropTypes.any,
  className: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  activeLabel: PropTypes.string.isRequired
};

var defaultProps = {
  active: false,
  disabled: false,
  activeLabel: '(current)'
};

export default function PaginationItem(_ref) {
  var active = _ref.active,
      disabled = _ref.disabled,
      className = _ref.className,
      style = _ref.style,
      activeLabel = _ref.activeLabel,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['active', 'disabled', 'className', 'style', 'activeLabel', 'children']);

  var Component = active || disabled ? 'span' : SafeAnchor;
  return React.createElement(
    'li',
    { style: style, className: classNames(className, { active: active, disabled: disabled }) },
    React.createElement(
      Component,
      _extends({ disabled: disabled }, props),
      children,
      active && React.createElement(
        'span',
        { className: 'sr-only' },
        activeLabel
      )
    )
  );
}

PaginationItem.propTypes = propTypes;
PaginationItem.defaultProps = defaultProps;

function createButton(name, defaultValue) {
  var _class, _temp;

  var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : name;

  return _temp = _class = function (_React$Component) {
    _inherits(_class, _React$Component);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _props = this.props,
          disabled = _props.disabled,
          children = _props.children,
          className = _props.className,
          props = _objectWithoutProperties(_props, ['disabled', 'children', 'className']);

      var Component = disabled ? 'span' : SafeAnchor;

      return React.createElement(
        'li',
        _extends({
          'aria-label': label,
          className: classNames(className, { disabled: disabled })
        }, props),
        React.createElement(
          Component,
          null,
          children || defaultValue
        )
      );
    };

    return _class;
  }(React.Component), _class.displayName = name, _class.propTypes = { disabled: PropTypes.bool }, _temp;
}

export var First = createButton('First', '\xAB');
export var Prev = createButton('Prev', '\u2039');
export var Ellipsis = createButton('Ellipsis', '\u2026', 'More');
export var Next = createButton('Next', '\u203A');
export var Last = createButton('Last', '\xBB');