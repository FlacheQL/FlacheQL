'use strict';

exports.__esModule = true;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

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

var _elementType = require('react-prop-types/lib/elementType');

var _elementType2 = _interopRequireDefault(_elementType);

var _SafeAnchor = require('./SafeAnchor');

var _SafeAnchor2 = _interopRequireDefault(_SafeAnchor);

var _createChainedFunction = require('./utils/createChainedFunction');

var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  /**
   * only here to satisfy linting, just the html onClick handler.
   *
   * @private
   */
  onClick: _propTypes2.default.func,
  /**
   * You can use a custom element for this component
   */
  componentClass: _elementType2.default
};

var defaultProps = {
  componentClass: _SafeAnchor2.default
};

var contextTypes = {
  $bs_panel: _propTypes2.default.shape({
    bodyId: _propTypes2.default.string,
    onToggle: _propTypes2.default.func,
    expanded: _propTypes2.default.bool
  })
};

var PanelToggle = function (_React$Component) {
  (0, _inherits3.default)(PanelToggle, _React$Component);

  function PanelToggle() {
    (0, _classCallCheck3.default)(this, PanelToggle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args)));

    _this.handleToggle = _this.handleToggle.bind(_this);
    return _this;
  }

  PanelToggle.prototype.handleToggle = function handleToggle(event) {
    var _ref = this.context.$bs_panel || {},
        onToggle = _ref.onToggle;

    if (onToggle) {
      onToggle(event);
    }
  };

  PanelToggle.prototype.render = function render() {
    var _props = this.props,
        onClick = _props.onClick,
        className = _props.className,
        componentClass = _props.componentClass,
        props = (0, _objectWithoutProperties3.default)(_props, ['onClick', 'className', 'componentClass']);

    var _ref2 = this.context.$bs_panel || {},
        expanded = _ref2.expanded,
        bodyId = _ref2.bodyId;

    var Component = componentClass;

    props.onClick = (0, _createChainedFunction2.default)(onClick, this.handleToggle);

    props['aria-expanded'] = expanded;
    props.className = (0, _classnames2.default)(className, !expanded && 'collapsed');

    if (bodyId) {
      props['aria-controls'] = bodyId;
    }

    return _react2.default.createElement(Component, props);
  };

  return PanelToggle;
}(_react2.default.Component);

PanelToggle.propTypes = propTypes;
PanelToggle.defaultProps = defaultProps;
PanelToggle.contextTypes = contextTypes;

exports.default = PanelToggle;
module.exports = exports['default'];