'use strict';

exports.__esModule = true;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _bootstrapUtils = require('./utils/bootstrapUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contextTypes = {
  $bs_panel: _propTypes2.default.shape({
    bsClass: _propTypes2.default.string
  })
};

var PanelFooter = function (_React$Component) {
  (0, _inherits3.default)(PanelFooter, _React$Component);

  function PanelFooter() {
    (0, _classCallCheck3.default)(this, PanelFooter);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  PanelFooter.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className;

    var _ref = this.context.$bs_panel || {},
        _bsClass = _ref.bsClass;

    var _splitBsProps = (0, _bootstrapUtils.splitBsProps)(this.props),
        bsProps = _splitBsProps[0],
        elementProps = _splitBsProps[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    return _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, elementProps, {
        className: (0, _classnames2.default)(className, (0, _bootstrapUtils.prefix)(bsProps, 'footer'))
      }),
      children
    );
  };

  return PanelFooter;
}(_react2.default.Component);

PanelFooter.contextTypes = contextTypes;

exports.default = (0, _bootstrapUtils.bsClass)('panel', PanelFooter);
module.exports = exports['default'];