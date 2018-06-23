import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { prefix, splitBsPropsAndOmit, bsClass } from './utils/bootstrapUtils';
import PanelCollapse from './PanelCollapse';

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
  collapsible: PropTypes.bool.isRequired
};

var defaultProps = {
  collapsible: false
};

var contextTypes = {
  $bs_panel: PropTypes.shape({
    bsClass: PropTypes.string
  })
};

var PanelBody = function (_React$Component) {
  _inherits(PanelBody, _React$Component);

  function PanelBody() {
    _classCallCheck(this, PanelBody);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  PanelBody.prototype.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        collapsible = _props.collapsible;

    var _ref = this.context.$bs_panel || {},
        _bsClass = _ref.bsClass;

    var _splitBsPropsAndOmit = splitBsPropsAndOmit(this.props, ['collapsible']),
        bsProps = _splitBsPropsAndOmit[0],
        elementProps = _splitBsPropsAndOmit[1];

    bsProps.bsClass = _bsClass || bsProps.bsClass;

    var body = React.createElement(
      'div',
      _extends({}, elementProps, { className: cn(className, prefix(bsProps, 'body')) }),
      children
    );

    if (collapsible) {
      body = React.createElement(
        PanelCollapse,
        null,
        body
      );
    }

    return body;
  };

  return PanelBody;
}(React.Component);

PanelBody.propTypes = propTypes;
PanelBody.defaultProps = defaultProps;
PanelBody.contextTypes = contextTypes;

export default bsClass('panel', PanelBody);