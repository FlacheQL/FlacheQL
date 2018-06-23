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

var _bootstrapUtils = require('./utils/bootstrapUtils');

var _Collapse = require('./Collapse');

var _Collapse2 = _interopRequireDefault(_Collapse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  /**
   * Callback fired before the component expands
   */
  onEnter: _propTypes2.default.func,
  /**
   * Callback fired after the component starts to expand
   */
  onEntering: _propTypes2.default.func,
  /**
   * Callback fired after the component has expanded
   */
  onEntered: _propTypes2.default.func,
  /**
   * Callback fired before the component collapses
   */
  onExit: _propTypes2.default.func,
  /**
   * Callback fired after the component starts to collapse
   */
  onExiting: _propTypes2.default.func,
  /**
   * Callback fired after the component has collapsed
   */
  onExited: _propTypes2.default.func
};

var contextTypes = {
  $bs_panel: _propTypes2.default.shape({
    headingId: _propTypes2.default.string,
    bodyId: _propTypes2.default.string,
    bsClass: _propTypes2.default.string,
    expanded: _propTypes2.default.bool
  })
};

var PanelCollapse = function (_React$Component) {
  (0, _inherits3.default)(PanelCollapse, _React$Component);

  function PanelCollapse() {
    (0, _classCallCheck3.default)(this, PanelCollapse);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  PanelCollapse.prototype.render = function render() {
    var children = this.props.children;

    var _ref = this.context.$bs_panel || {},
        headingId = _ref.headingId,
        bodyId = _ref.bodyId,
        _bsClass = _ref.bsClass,
        expanded = _ref.expanded;

    var _splitBsProps = (0, _bootstrapUtils.splitBsProps)(this.props),
        bsProps = _splitBsProps[0],
        props = _splitBsProps[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    if (headingId && bodyId) {
      props.id = bodyId;
      props.role = props.role || 'tabpanel';
      props['aria-labelledby'] = headingId;
    }

    return _react2.default.createElement(
      _Collapse2.default,
      (0, _extends3.default)({ 'in': expanded }, props),
      _react2.default.createElement(
        'div',
        { className: (0, _bootstrapUtils.prefix)(bsProps, 'collapse') },
        children
      )
    );
  };

  return PanelCollapse;
}(_react2.default.Component);

PanelCollapse.propTypes = propTypes;
PanelCollapse.contextTypes = contextTypes;

exports.default = (0, _bootstrapUtils.bsClass)('panel', PanelCollapse);
module.exports = exports['default'];