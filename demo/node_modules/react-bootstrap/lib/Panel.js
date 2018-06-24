'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

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

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _bootstrapUtils = require('./utils/bootstrapUtils');

var _StyleConfig = require('./utils/StyleConfig');

var _PanelBody = require('./PanelBody');

var _PanelBody2 = _interopRequireDefault(_PanelBody);

var _PanelHeading = require('./PanelHeading');

var _PanelHeading2 = _interopRequireDefault(_PanelHeading);

var _PanelTitle = require('./PanelTitle');

var _PanelTitle2 = _interopRequireDefault(_PanelTitle);

var _PanelFooter = require('./PanelFooter');

var _PanelFooter2 = _interopRequireDefault(_PanelFooter);

var _PanelToggle = require('./PanelToggle');

var _PanelToggle2 = _interopRequireDefault(_PanelToggle);

var _PanelCollapse = require('./PanelCollapse');

var _PanelCollapse2 = _interopRequireDefault(_PanelCollapse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var has = Object.prototype.hasOwnProperty;

var defaultGetId = function defaultGetId(id, type) {
  return id ? id + '--' + type : null;
};

var propTypes = {
  /**
   * Controls the collapsed/expanded state ofthe Panel. Requires
   * a `Panel.Collapse` or `<Panel.Body collapsible>` child component
   * in order to actually animate out or in.
   *
   * @controllable onToggle
   */
  expanded: _propTypes2.default.bool,
  /**
   * A callback fired when the collapse state changes.
   *
   * @controllable expanded
   */
  onToggle: _propTypes2.default.func,
  eventKey: _propTypes2.default.any,

  /**
   * An HTML `id` attribute uniquely identifying the Panel component.
   */
  id: _propTypes2.default.string
};

var contextTypes = {
  $bs_panelGroup: _propTypes2.default.shape({
    getId: _propTypes2.default.func,
    activeKey: _propTypes2.default.any,
    onToggle: _propTypes2.default.func
  })
};

var childContextTypes = {
  $bs_panel: _propTypes2.default.shape({
    headingId: _propTypes2.default.string,
    bodyId: _propTypes2.default.string,
    bsClass: _propTypes2.default.string,
    onToggle: _propTypes2.default.func,
    expanded: _propTypes2.default.bool
  })
};

var Panel = function (_React$Component) {
  (0, _inherits3.default)(Panel, _React$Component);

  function Panel() {
    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Panel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.handleToggle = function (e) {
      var panelGroup = _this.context.$bs_panelGroup;
      var expanded = !_this.getExpanded();

      if (panelGroup && panelGroup.onToggle) {
        panelGroup.onToggle(_this.props.eventKey, expanded, e);
      } else {
        _this.props.onToggle(expanded, e);
      }
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  Panel.prototype.getChildContext = function getChildContext() {
    var _props = this.props,
        eventKey = _props.eventKey,
        id = _props.id;

    var idKey = eventKey == null ? id : eventKey;

    var ids = void 0;

    if (idKey !== null) {
      var panelGroup = this.context.$bs_panelGroup;
      var getId = panelGroup && panelGroup.getId || defaultGetId;

      ids = {
        headingId: getId(idKey, 'heading'),
        bodyId: getId(idKey, 'body')
      };
    }

    return {
      $bs_panel: (0, _extends3.default)({}, ids, {
        bsClass: this.props.bsClass,
        expanded: this.getExpanded(),
        onToggle: this.handleToggle
      })
    };
  };

  Panel.prototype.getExpanded = function getExpanded() {
    var panelGroup = this.context.$bs_panelGroup;

    if (panelGroup && has.call(panelGroup, 'activeKey')) {
      process.env.NODE_ENV !== 'production' ? (0, _warning2.default)(this.props.expanded == null, 'Specifying `<Panel>` `expanded` in the context of an accordion ' + '`<PanelGroup>` is not supported. Set `activeKey` on the ' + '`<PanelGroup>` instead.') : void 0;

      return panelGroup.activeKey === this.props.eventKey;
    }

    return !!this.props.expanded;
  };

  Panel.prototype.render = function render() {
    var _props2 = this.props,
        className = _props2.className,
        children = _props2.children;

    var _splitBsPropsAndOmit = (0, _bootstrapUtils.splitBsPropsAndOmit)(this.props, ['onToggle', 'eventKey', 'expanded']),
        bsProps = _splitBsPropsAndOmit[0],
        props = _splitBsPropsAndOmit[1];

    return _react2.default.createElement(
      'div',
      (0, _extends3.default)({}, props, { className: (0, _classnames2.default)(className, (0, _bootstrapUtils.getClassSet)(bsProps)) }),
      children
    );
  };

  return Panel;
}(_react2.default.Component);

Panel.propTypes = propTypes;

Panel.contextTypes = contextTypes;
Panel.childContextTypes = childContextTypes;

var UncontrolledPanel = (0, _uncontrollable2.default)((0, _bootstrapUtils.bsClass)('panel', (0, _bootstrapUtils.bsStyles)([].concat((0, _values2.default)(_StyleConfig.State), [_StyleConfig.Style.DEFAULT, _StyleConfig.Style.PRIMARY]), _StyleConfig.Style.DEFAULT, Panel)), { expanded: 'onToggle' });

(0, _assign2.default)(UncontrolledPanel, {
  Heading: _PanelHeading2.default,
  Title: _PanelTitle2.default,
  Body: _PanelBody2.default,
  Footer: _PanelFooter2.default,
  Toggle: _PanelToggle2.default,
  Collapse: _PanelCollapse2.default
});

exports.default = UncontrolledPanel;
module.exports = exports['default'];