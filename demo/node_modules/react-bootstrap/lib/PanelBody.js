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

var _PanelCollapse = require('./PanelCollapse');

var _PanelCollapse2 = _interopRequireDefault(_PanelCollapse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  /**
   * A convenience prop that renders a Collapse component around the Body for
   * situations when the parent Panel only contains a single Panel.Body child.
   *
   * renders:
   * ```jsx
   * <Panel.Collapse>
   *  <Panel.Body />
   * </Panel.Collapse>
   * ```
   */
  collapsible: _propTypes2.default.bool.isRequired
};

var defaultProps = {
  collapsible: false
};

var contextTypes = {
  $bs_panel: _propTypes2.default.shape({
    bsClass: _propTypes2.default.string
  })
};

var PanelBody = function (_React$Component) {
  (0, _inherits3.default)(PanelBody, _React$Component);

  function PanelBody() {
    (0, _classCallCheck3.default)(this, PanelBody);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  PanelBody.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        collapsible = _props.collapsible;

    var _ref = this.context.$bs_panel || {},
        _bsClass = _ref.bsClass;

    var _splitBsPropsAndOmit = (0, _bootstrapUtils.splitBsPropsAndOmit)(this.props, ['collapsible']),
        bsProps = _splitBsPropsAndOmit[0],
        elementProps = _splitBsPropsAndOmit[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    var body = _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, elementProps, { className: (0, _classnames2.default)(className, (0, _bootstrapUtils.prefix)(bsProps, 'body')) }),
      children
    );

    if (collapsible) {
      body = _react2.default.createElement(
        _PanelCollapse2.default,
        null,
        body
      );
    }

    return body;
  };

  return PanelBody;
}(_react2.default.Component);

PanelBody.propTypes = propTypes;
PanelBody.defaultProps = defaultProps;
PanelBody.contextTypes = contextTypes;

exports.default = (0, _bootstrapUtils.bsClass)('panel', PanelBody);
module.exports = exports['default'];