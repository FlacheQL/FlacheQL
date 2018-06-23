import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import elementType from 'react-prop-types/lib/elementType';

import { prefix, bsClass, splitBsProps } from './utils/bootstrapUtils';

var propTypes = {
  componentClass: elementType
};

var defaultProps = {
  componentClass: 'div'
};

var contextTypes = {
  $bs_panel: PropTypes.shape({
    headingId: PropTypes.string,
    bsClass: PropTypes.string
  })
};

var PanelHeading = function (_React$Component) {
  _inherits(PanelHeading, _React$Component);

  function PanelHeading() {
    _classCallCheck(this, PanelHeading);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  PanelHeading.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        Component = _props.componentClass,
        props = _objectWithoutProperties(_props, ['children', 'className', 'componentClass']);

    var _ref = this.context.$bs_panel || {},
        headingId = _ref.headingId,
        _bsClass = _ref.bsClass;

    var _splitBsProps = splitBsProps(props),
        bsProps = _splitBsProps[0],
        elementProps = _splitBsProps[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    if (headingId) {
      elementProps.role = elementProps.role || 'tab';
      elementProps.id = headingId;
    }

    return React.createElement(
      Component,
      _extends({}, elementProps, {
        className: cn(className, prefix(bsProps, 'heading'))
      }),
      children
    );
  };

  return PanelHeading;
}(React.Component);

PanelHeading.propTypes = propTypes;
PanelHeading.defaultProps = defaultProps;
PanelHeading.contextTypes = contextTypes;

export default bsClass('panel', PanelHeading);