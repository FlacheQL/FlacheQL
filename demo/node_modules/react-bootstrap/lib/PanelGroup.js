'use strict';

exports.__esModule = true;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _bootstrapUtils = require('./utils/bootstrapUtils');

var _ValidComponentChildren = require('./utils/ValidComponentChildren');

var _ValidComponentChildren2 = _interopRequireDefault(_ValidComponentChildren);

var _PropTypes = require('./utils/PropTypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  accordion: _propTypes2.default.bool,
  /**
   * When `accordion` is enabled, `activeKey` controls the which child `Panel` is expanded. `activeKey` should
   * match a child Panel `eventKey` prop exactly.
   *
   * @controllable onSelect
   */
  activeKey: _propTypes2.default.any,

  /**
   * A callback fired when a child Panel collapse state changes. It's called with the next expanded `activeKey`
   *
   * @controllable activeKey
   */
  onSelect: _propTypes2.default.func,

  /**
   * An HTML role attribute
   */
  role: _propTypes2.default.string,

  /**
   * A function that takes an eventKey and type and returns a
   * unique id for each Panel heading and Panel Collapse. The function _must_ be a pure function,
   * meaning it should always return the _same_ id for the same set of inputs. The default
   * value requires that an `id` to be set for the PanelGroup.
   *
   * The `type` argument will either be `"body"` or `"heading"`.
   *
   * @defaultValue (eventKey, type) => `${this.props.id}-${type}-${key}`
   */
  generateChildId: _propTypes2.default.func,

  /**
   * HTML id attribute, required if no `generateChildId` prop
   * is specified.
   */
  id: (0, _PropTypes.generatedId)('PanelGroup')
};

var defaultProps = {
  accordion: false
};

var childContextTypes = {
  $bs_panelGroup: _propTypes2.default.shape({
    getId: _propTypes2.default.func,
    headerRole: _propTypes2.default.string,
    panelRole: _propTypes2.default.string,
    activeKey: _propTypes2.default.any,
    onToggle: _propTypes2.default.func
  })
};

var PanelGroup = function (_React$Component) {
  (0, _inherits3.default)(PanelGroup, _React$Component);

  function PanelGroup() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, PanelGroup);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleSelect = function (key, expanded, e) {
      if (expanded) {
        _this.props.onSelect(key, e);
      } else if (_this.props.activeKey === key) {
        _this.props.onSelect(null, e);
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  PanelGroup.prototype.getChildContext = function getChildContext() {
    var _props = this.props,
        activeKey = _props.activeKey,
        accordion = _props.accordion,
        generateChildId = _props.generateChildId,
        id = _props.id;

    var getId = null;

    if (accordion) {
      getId = generateChildId || function (key, type) {
        return id ? id + '-' + type + '-' + key : null;
      };
    }

    return {
      $bs_panelGroup: (0, _extends3.default)({
        getId: getId,
        headerRole: 'tab',
        panelRole: 'tabpanel'
      }, accordion && {
        activeKey: activeKey,
        onToggle: this.handleSelect
      })
    };
  };

  PanelGroup.prototype.render = function render() {
    var _props2 = this.props,
        accordion = _props2.accordion,
        className = _props2.className,
        children = _props2.children,
        props = (0, _objectWithoutProperties3.default)(_props2, ['accordion', 'className', 'children']);

    var _splitBsPropsAndOmit = (0, _bootstrapUtils.splitBsPropsAndOmit)(props, ['onSelect', 'activeKey']),
        bsProps = _splitBsPropsAndOmit[0],
        elementProps = _splitBsPropsAndOmit[1];

    if (accordion) {
      elementProps.role = elementProps.role || 'tablist';
    }

    var classes = (0, _bootstrapUtils.getClassSet)(bsProps);

    return _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, elementProps, { className: (0, _classnames2.default)(className, classes) }),
      _ValidComponentChildren2.default.map(children, function (child) {
        return (0, _react.cloneElement)(child, {
          bsStyle: child.props.bsStyle || bsProps.bsStyle
        });
      })
    );
  };

  return PanelGroup;
}(_react2.default.Component);

PanelGroup.propTypes = propTypes;
PanelGroup.defaultProps = defaultProps;
PanelGroup.childContextTypes = childContextTypes;

exports.default = (0, _uncontrollable2.default)((0, _bootstrapUtils.bsClass)('panel-group', PanelGroup), {
  activeKey: 'onSelect'
});
module.exports = exports['default'];