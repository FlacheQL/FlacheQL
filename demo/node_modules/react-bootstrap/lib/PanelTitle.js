'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _elementType = require('react-prop-types/lib/elementType');

var _elementType2 = _interopRequireDefault(_elementType);

var _bootstrapUtils = require('./utils/bootstrapUtils');

var _PanelToggle = require('./PanelToggle');

var _PanelToggle2 = _interopRequireDefault(_PanelToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  componentClass: _elementType2.default,
  /**
   * A convenience prop that renders the Panel.Title as a panel collapse toggle component
   * for the common use-case.
   */
  toggle: _propTypes2.default.bool
};

var contextTypes = {
  $bs_panel: _propTypes2.default.shape({
    bsClass: _propTypes2.default.string
  })
};

var defaultProps = {
  componentClass: 'div'
};

var PanelTitle = function (_React$Component) {
  (0, _inherits3.default)(PanelTitle, _React$Component);

  function PanelTitle() {
    (0, _classCallCheck3.default)(this, PanelTitle);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  PanelTitle.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        toggle = _props.toggle,
        Component = _props.componentClass,
        props = (0, _objectWithoutProperties3.default)(_props, ['children', 'className', 'toggle', 'componentClass']);

    var _ref = this.context.$bs_panel || {},
        _bsClass = _ref.bsClass;

    var _splitBsProps = (0, _bootstrapUtils.splitBsProps)(props),
        bsProps = _splitBsProps[0],
        elementProps = _splitBsProps[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    if (toggle) {
      children = _react2.default.createElement(
        _PanelToggle2.default,
        null,
        children
      );
    }

    return _react2.default.createElement(
      Component,
      (0, _extends3.default)({}, elementProps, {
        className: (0, _classnames2.default)(className, (0, _bootstrapUtils.prefix)(bsProps, 'title'))
      }),
      children
    );
  };

  return PanelTitle;
}(_react2.default.Component);

PanelTitle.propTypes = propTypes;
PanelTitle.defaultProps = defaultProps;
PanelTitle.contextTypes = contextTypes;

exports.default = (0, _bootstrapUtils.bsClass)('panel', PanelTitle);
module.exports = exports['default'];