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

var _fadeStyles;

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Transition = require('react-transition-group/Transition');

var _Transition2 = _interopRequireDefault(_Transition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  /**
   * Show the component; triggers the fade in or fade out animation
   */
  in: _propTypes2.default.bool,

  /**
   * Wait until the first "enter" transition to mount the component (add it to the DOM)
   */
  mountOnEnter: _propTypes2.default.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is faded out
   */
  unmountOnExit: _propTypes2.default.bool,

  /**
   * Run the fade in animation when the component mounts, if it is initially
   * shown
   */
  appear: _propTypes2.default.bool,

  /**
   * Duration of the fade animation in milliseconds, to ensure that finishing
   * callbacks are fired even if the original browser transition end events are
   * canceled
   */
  timeout: _propTypes2.default.number,

  /**
   * Callback fired before the component fades in
   */
  onEnter: _propTypes2.default.func,
  /**
   * Callback fired after the component starts to fade in
   */
  onEntering: _propTypes2.default.func,
  /**
   * Callback fired after the has component faded in
   */
  onEntered: _propTypes2.default.func,
  /**
   * Callback fired before the component fades out
   */
  onExit: _propTypes2.default.func,
  /**
   * Callback fired after the component starts to fade out
   */
  onExiting: _propTypes2.default.func,
  /**
   * Callback fired after the component has faded out
   */
  onExited: _propTypes2.default.func
};

var defaultProps = {
  in: false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false
};

var fadeStyles = (_fadeStyles = {}, _fadeStyles[_Transition.ENTERING] = 'in', _fadeStyles[_Transition.ENTERED] = 'in', _fadeStyles);

var Fade = function (_React$Component) {
  (0, _inherits3.default)(Fade, _React$Component);

  function Fade() {
    (0, _classCallCheck3.default)(this, Fade);
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }

  Fade.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        children = _props.children,
        props = (0, _objectWithoutProperties3.default)(_props, ['className', 'children']);


    return _react2.default.createElement(
      _Transition2.default,
      props,
      function (status, innerProps) {
        return _react2.default.cloneElement(children, (0, _extends3.default)({}, innerProps, {
          className: (0, _classnames2.default)('fade', className, children.props.className, fadeStyles[status])
        }));
      }
    );
  };

  return Fade;
}(_react2.default.Component);

Fade.propTypes = propTypes;
Fade.defaultProps = defaultProps;

exports.default = Fade;
module.exports = exports['default'];