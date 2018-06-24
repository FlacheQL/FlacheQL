import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import elementType from 'react-prop-types/lib/elementType';
import SafeAnchor from './SafeAnchor';
import createChainedFunction from './utils/createChainedFunction';

var propTypes = {
  /**
   * only here to satisfy linting, just the html onClick handler.
   *
   * @private
   */
  onClick: PropTypes.func,
  /**
   * You can use a custom element for this component
   */
  componentClass: elementType
};

var defaultProps = {
  componentClass: SafeAnchor
};

var contextTypes = {
  $bs_panel: PropTypes.shape({
    bodyId: PropTypes.string,
    onToggle: PropTypes.func,
    expanded: PropTypes.bool
  })
};

var PanelToggle = function (_React$Component) {
  _inherits(PanelToggle, _React$Component);

  function PanelToggle() {
    _classCallCheck(this, PanelToggle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args)));

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
        props = _objectWithoutProperties(_props, ['onClick', 'className', 'componentClass']);

    var _ref2 = this.context.$bs_panel || {},
        expanded = _ref2.expanded,
        bodyId = _ref2.bodyId;

    var Component = componentClass;

    props.onClick = createChainedFunction(onClick, this.handleToggle);

    props['aria-expanded'] = expanded;
    props.className = classNames(className, !expanded && 'collapsed');

    if (bodyId) {
      props['aria-controls'] = bodyId;
    }

    return React.createElement(Component, props);
  };

  return PanelToggle;
}(React.Component);

PanelToggle.propTypes = propTypes;
PanelToggle.defaultProps = defaultProps;
PanelToggle.contextTypes = contextTypes;

export default PanelToggle;