var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { getMainDefinition, getFragmentDefinitions, createFragmentMap, shouldInclude, getDirectiveInfoFromField, isField, isInlineFragment, resultKeyNameFromField, argumentsObjectFromField, } from 'apollo-utilities';
import { merge, } from './graphql';
/* Based on graphql function from graphql-js:
 *
 * graphql(
 *   schema: GraphQLSchema,
 *   requestString: string,
 *   rootValue?: ?any,
 *   contextValue?: ?any,
 *   variableValues?: ?{[key: string]: any},
 *   operationName?: ?string
 * ): Promise<GraphQLResult>
 *
 * The default export as of graphql-anywhere is sync as of 4.0,
 * but below is an exported alternative that is async.
 * In the 5.0 version, this will be the only export again
 * and it will be async
 *
 */
export function graphql(resolver, document, rootValue, contextValue, variableValues, execOptions) {
    if (execOptions === void 0) { execOptions = {}; }
    var mainDefinition = getMainDefinition(document);
    var fragments = getFragmentDefinitions(document);
    var fragmentMap = createFragmentMap(fragments);
    var resultMapper = execOptions.resultMapper;
    // Default matcher always matches all fragments
    var fragmentMatcher = execOptions.fragmentMatcher || (function () { return true; });
    var execContext = {
        fragmentMap: fragmentMap,
        contextValue: contextValue,
        variableValues: variableValues,
        resultMapper: resultMapper,
        resolver: resolver,
        fragmentMatcher: fragmentMatcher,
    };
    return executeSelectionSet(mainDefinition.selectionSet, rootValue, execContext);
}
function executeSelectionSet(selectionSet, rootValue, execContext) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var fragmentMap, contextValue, variables, result, execute;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fragmentMap = execContext.fragmentMap, contextValue = execContext.contextValue, variables = execContext.variableValues;
                    result = {};
                    execute = function (selection) { return __awaiter(_this, void 0, void 0, function () {
                        var fieldResult, resultFieldKey, fragment, typeCondition, fragmentResult;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!shouldInclude(selection, variables)) {
                                        // Skip this entirely
                                        return [2 /*return*/];
                                    }
                                    if (!isField(selection)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, executeField(selection, rootValue, execContext)];
                                case 1:
                                    fieldResult = _a.sent();
                                    resultFieldKey = resultKeyNameFromField(selection);
                                    if (fieldResult !== undefined) {
                                        if (result[resultFieldKey] === undefined) {
                                            result[resultFieldKey] = fieldResult;
                                        }
                                        else {
                                            merge(result[resultFieldKey], fieldResult);
                                        }
                                    }
                                    return [2 /*return*/];
                                case 2:
                                    if (isInlineFragment(selection)) {
                                        fragment = selection;
                                    }
                                    else {
                                        // This is a named fragment
                                        fragment = fragmentMap[selection.name.value];
                                        if (!fragment) {
                                            throw new Error("No fragment named " + selection.name.value);
                                        }
                                    }
                                    typeCondition = fragment.typeCondition.name.value;
                                    if (!execContext.fragmentMatcher(rootValue, typeCondition, contextValue)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, executeSelectionSet(fragment.selectionSet, rootValue, execContext)];
                                case 3:
                                    fragmentResult = _a.sent();
                                    merge(result, fragmentResult);
                                    _a.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, Promise.all(selectionSet.selections.map(execute))];
                case 1:
                    _a.sent();
                    if (execContext.resultMapper) {
                        return [2 /*return*/, execContext.resultMapper(result, rootValue)];
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function executeField(field, rootValue, execContext) {
    return __awaiter(this, void 0, void 0, function () {
        var variables, contextValue, resolver, fieldName, args, info, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    variables = execContext.variableValues, contextValue = execContext.contextValue, resolver = execContext.resolver;
                    fieldName = field.name.value;
                    args = argumentsObjectFromField(field, variables);
                    info = {
                        isLeaf: !field.selectionSet,
                        resultKey: resultKeyNameFromField(field),
                        directives: getDirectiveInfoFromField(field, variables),
                    };
                    return [4 /*yield*/, resolver(fieldName, rootValue, args, contextValue, info)];
                case 1:
                    result = _a.sent();
                    // Handle all scalar types here
                    if (!field.selectionSet) {
                        return [2 /*return*/, result];
                    }
                    // From here down, the field has a selection set, which means it's trying to
                    // query a GraphQLObjectType
                    if (result == null) {
                        // Basically any field in a GraphQL response can be null, or missing
                        return [2 /*return*/, result];
                    }
                    if (Array.isArray(result)) {
                        return [2 /*return*/, executeSubSelectedArray(field, result, execContext)];
                    }
                    // Returned value is an object, and the query has a sub-selection. Recurse.
                    return [2 /*return*/, executeSelectionSet(field.selectionSet, result, execContext)];
            }
        });
    });
}
function executeSubSelectedArray(field, result, execContext) {
    return Promise.all(result.map(function (item) {
        // null value in array
        if (item === null) {
            return null;
        }
        // This is a nested array, recurse
        if (Array.isArray(item)) {
            return executeSubSelectedArray(field, item, execContext);
        }
        // This is an object, run the selection set on it
        return executeSelectionSet(field.selectionSet, item, execContext);
    }));
}
//# sourceMappingURL=graphql-async.js.map