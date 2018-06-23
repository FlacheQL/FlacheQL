import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { prefix, bsClass, splitBsProps } from './utils/bootstrapUtils';

var contextTypes = {
  $bs_panel: PropTypes.shape({
    bsClass: PropTypes.string
  })
};

var PanelFooter = function (_React$Component) {
  _inherits(PanelFooter, _React$Component);

  function PanelFooter() {
    _classCallCheck(this, PanelFooter);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  PanelFooter.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className;

    var _ref = this.context.$bs_panel || {},
        _bsClass = _ref.bsClass;

    var _splitBsProps = splitBsProps(this.props),
        bsProps = _splitBsProps[0],
        elementProps = _splitBsProps[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    return React.createElement(
      'div',
      _extends({}, elementProps, {
        className: cn(className, prefix(bsProps, 'footer'))
      }),
      children
    );
  };

  return PanelFooter;
}(React.Component);

PanelFooter.contextTypes = contextTypes;

export default bsClass('panel', PanelFooter);