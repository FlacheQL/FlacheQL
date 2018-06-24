'use strict';

exports.__esModule = true;
exports.Last = exports.Next = exports.Ellipsis = exports.Prev = exports.First = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = PaginationItem;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/no-multi-comp */
var propTypes = {
  eventKey: _propTypes2.default.any,
  className: _propTypes2.default.string,
  onSelect: _propTypes2.default.func,
  disabled: _propTypes2.default.bool,
  active: _propTypes2.default.bool,
  activeLabel: _propTypes2.default.string.isRequired
};

var defaultProps = {
  active: false,
  disabled: false,
  activeLabel: '(current)'
};

function PaginationItem(_ref) {
  var active = _ref.active,
      disabled = _ref.disabled,
      className = _ref.className,
      style = _ref.style,
      activeLabel = _ref.activeLabel,
      children = _ref.children,
      props = (0, _objectWithoutProperties3.default)(_ref, ['active', 'disabled', 'className', 'style', 'activeLabel', 'children']);

  var Component = active || disabled ? 'span' : _SafeAnchor2.default;
  return _react2.default.createElement(
    'li',
    { style: style, className: (0, _classnames2.default)(className, { active: active, disabled: disabled }) },
    _react2.default.createElement(
      Component,
      (0, _extends3.default)({ disabled: disabled }, props),
      children,
      active && _react2.default.createElement(
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
    (0, _inherits3.default)(_class, _React$Component);

    function _class() {
      (0, _classCallCheck3.default)(this, _class);
      return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
    }

    _class.prototype.render = function render() {
      var _props = this.props,
          disabled = _props.disabled,
          children = _props.children,
          className = _props.className,
          props = (0, _objectWithoutProperties3.default)(_props, ['disabled', 'children', 'className']);

      var Component = disabled ? 'span' : _SafeAnchor2.default;

      return _react2.default.createElement(
        'li',
        (0, _extends3.default)({
          'aria-label': label,
          className: (0, _classnames2.default)(className, { disabled: disabled })
        }, props),
        _react2.default.createElement(
          Component,
          null,
          children || defaultValue
        )
      );
    };

    return _class;
  }(_react2.default.Component), _class.displayName = name, _class.propTypes = { disabled: _propTypes2.default.bool }, _temp;
}

var First = exports.First = createButton('First', '\xAB');
var Prev = exports.Prev = createButton('Prev', '\u2039');
var Ellipsis = exports.Ellipsis = createButton('Ellipsis', '\u2026', 'More');
var Next = exports.Next = createButton('Next', '\u203A');
var Last = exports.Last = createButton('Last', '\xBB');