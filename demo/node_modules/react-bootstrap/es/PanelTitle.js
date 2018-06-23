import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import elementType from 'react-prop-types/lib/elementType';

import { prefix, splitBsProps, bsClass } from './utils/bootstrapUtils';
import PanelToggle from './PanelToggle';

var propTypes = {
  componentClass: elementType,
  /**
   * A convenience prop that renders the Panel.Title as a panel collapse toggle component
   * for the common use-case.
   */
  toggle: PropTypes.bool
};

var contextTypes = {
  $bs_panel: PropTypes.shape({
    bsClass: PropTypes.string
  })
};

var defaultProps = {
  componentClass: 'div'
};

var PanelTitle = function (_React$Component) {
  _inherits(PanelTitle, _React$Component);

  function PanelTitle() {
    _classCallCheck(this, PanelTitle);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  PanelTitle.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        toggle = _props.toggle,
        Component = _props.componentClass,
        props = _objectWithoutProperties(_props, ['children', 'className', 'toggle', 'componentClass']);

    var _ref = this.context.$bs_panel || {},
        _bsClass = _ref.bsClass;

    var _splitBsProps = splitBsProps(props),
        bsProps = _splitBsProps[0],
        elementProps = _splitBsProps[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    if (toggle) {
      children = React.createElement(
        PanelToggle,
        null,
        children
      );
    }

    return React.createElement(
      Component,
      _extends({}, elementProps, {
        className: cn(className, prefix(bsProps, 'title'))
      }),
      children
    );
  };

  return PanelTitle;
}(React.Component);

PanelTitle.propTypes = propTypes;
PanelTitle.defaultProps = defaultProps;
PanelTitle.contextTypes = contextTypes;

export default bsClass('panel', PanelTitle);