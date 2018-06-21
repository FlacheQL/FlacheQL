'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineFragmentOnNonCompositeErrorMessage = inlineFragmentOnNonCompositeErrorMessage;
exports.fragmentOnNonCompositeErrorMessage = fragmentOnNonCompositeErrorMessage;
exports.FragmentsOnCompositeTypes = FragmentsOnCompositeTypes;

var _error = require('../../error');

var _printer = require('../../language/printer');

var _definition = require('../../type/definition');

var _typeFromAST = require('../../utilities/typeFromAST');

function inlineFragmentOnNonCompositeErrorMessage(type) {
  return 'Fragment cannot condition on non composite type "' + String(type) + '".';
}
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

function fragmentOnNonCompositeErrorMessage(fragName, type) {
  return 'Fragment "' + fragName + '" cannot condition on non composite ' + ('type "' + String(type) + '".');
}

/**
 * Fragments on composite type
 *
 * Fragments use a type condition to determine if they apply, since fragments
 * can only be spread into a composite type (object, interface, or union), the
 * type condition must also be a composite type.
 */
function FragmentsOnCompositeTypes(context) {
  return {
    InlineFragment: function InlineFragment(node) {
      if (node.typeCondition) {
        var type = (0, _typeFromAST.typeFromAST)(context.getSchema(), node.typeCondition);
        if (type && !(0, _definition.isCompositeType)(type)) {
          context.reportError(new _error.GraphQLError(inlineFragmentOnNonCompositeErrorMessage((0, _printer.print)(node.typeCondition)), [node.typeCondition]));
        }
      }
    },
    FragmentDefinition: function FragmentDefinition(node) {
      var type = (0, _typeFromAST.typeFromAST)(context.getSchema(), node.typeCondition);
      if (type && !(0, _definition.isCompositeType)(type)) {
        context.reportError(new _error.GraphQLError(fragmentOnNonCompositeErrorMessage(node.name.value, (0, _printer.print)(node.typeCondition)), [node.typeCondition]));
      }
    }
  };
}