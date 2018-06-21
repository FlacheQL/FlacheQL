var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { ApolloLink, Observable, fromError } from 'apollo-link';
import { serializeFetchParameter, selectURI, parseAndCheckHttpResponse, checkFetcher, selectHttpOptionsAndBody, createSignalIfSupported, fallbackHttpConfig, } from 'apollo-link-http-common';
export var createHttpLink = function (linkOptions) {
    if (linkOptions === void 0) { linkOptions = {}; }
    var _a = linkOptions.uri, uri = _a === void 0 ? '/graphql' : _a, 
    // use default global fetch is nothing passed in
    fetcher = linkOptions.fetch, includeExtensions = linkOptions.includeExtensions, useGETForQueries = linkOptions.useGETForQueries, requestOptions = __rest(linkOptions, ["uri", "fetch", "includeExtensions", "useGETForQueries"]);
    // dev warnings to ensure fetch is present
    checkFetcher(fetcher);
    //fetcher is set here rather than the destructuring to ensure fetch is
    //declared before referencing it. Reference in the destructuring would cause
    //a ReferenceError
    if (!fetcher) {
        fetcher = fetch;
    }
    var linkConfig = {
        http: { includeExtensions: includeExtensions },
        options: requestOptions.fetchOptions,
        credentials: requestOptions.credentials,
        headers: requestOptions.headers,
    };
    return new ApolloLink(function (operation) {
        var chosenURI = selectURI(operation, uri);
        var context = operation.getContext();
        var contextConfig = {
            http: context.http,
            options: context.fetchOptions,
            credentials: context.credentials,
            headers: context.headers,
        };
        //uses fallback, link, and then context to build options
        var _a = selectHttpOptionsAndBody(operation, fallbackHttpConfig, linkConfig, contextConfig), options = _a.options, body = _a.body;
        var controller;
        if (!options.signal) {
            var _b = createSignalIfSupported(), _controller = _b.controller, signal = _b.signal;
            controller = _controller;
            if (controller)
                options.signal = signal;
        }
        // If requested, set method to GET if there are no mutations.
        var definitionIsMutation = function (d) {
            return d.kind === 'OperationDefinition' && d.operation === 'mutation';
        };
        if (useGETForQueries &&
            !operation.query.definitions.some(definitionIsMutation)) {
            options.method = 'GET';
        }
        if (options.method === 'GET') {
            var _c = rewriteURIForGET(chosenURI, body), newURI = _c.newURI, parseError = _c.parseError;
            if (parseError) {
                return fromError(parseError);
            }
            chosenURI = newURI;
        }
        else {
            try {
                options.body = serializeFetchParameter(body, 'Payload');
            }
            catch (parseError) {
                return fromError(parseError);
            }
        }
        return new Observable(function (observer) {
            fetcher(chosenURI, options)
                .then(function (response) {
                operation.setContext({ response: response });
                return response;
            })
                .then(parseAndCheckHttpResponse(operation))
                .then(function (result) {
                // we have data and can send it to back up the link chain
                observer.next(result);
                observer.complete();
                return result;
            })
                .catch(function (err) {
                // fetch was cancelled so its already been cleaned up in the unsubscribe
                if (err.name === 'AbortError')
                    return;
                // if it is a network error, BUT there is graphql result info
                // fire the next observer before calling error
                // this gives apollo-client (and react-apollo) the `graphqlErrors` and `networErrors`
                // to pass to UI
                // this should only happen if we *also* have data as part of the response key per
                // the spec
                if (err.result && err.result.errors && err.result.data) {
                    // if we dont' call next, the UI can only show networkError because AC didn't
                    // get andy graphqlErrors
                    // this is graphql execution result info (i.e errors and possibly data)
                    // this is because there is no formal spec how errors should translate to
                    // http status codes. So an auth error (401) could have both data
                    // from a public field, errors from a private field, and a status of 401
                    // {
                    //  user { // this will have errors
                    //    firstName
                    //  }
                    //  products { // this is public so will have data
                    //    cost
                    //  }
                    // }
                    //
                    // the result of above *could* look like this:
                    // {
                    //   data: { products: [{ cost: "$10" }] },
                    //   errors: [{
                    //      message: 'your session has timed out',
                    //      path: []
                    //   }]
                    // }
                    // status code of above would be a 401
                    // in the UI you want to show data where you can, errors as data where you can
                    // and use correct http status codes
                    observer.next(err.result);
                }
                observer.error(err);
            });
            return function () {
                // XXX support canceling this request
                // https://developers.google.com/web/updates/2017/09/abortable-fetch
                if (controller)
                    controller.abort();
            };
        });
    });
};
// For GET operations, returns the given URI rewritten with parameters, or a
// parse error.
function rewriteURIForGET(chosenURI, body) {
    // Implement the standard HTTP GET serialization, plus 'extensions'. Note
    // the extra level of JSON serialization!
    var queryParams = [];
    var addQueryParam = function (key, value) {
        queryParams.push(key + "=" + encodeURIComponent(value));
    };
    if ('query' in body) {
        addQueryParam('query', body.query);
    }
    if (body.operationName) {
        addQueryParam('operationName', body.operationName);
    }
    if (body.variables) {
        var serializedVariables = void 0;
        try {
            serializedVariables = serializeFetchParameter(body.variables, 'Variables map');
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam('variables', serializedVariables);
    }
    if (body.extensions) {
        var serializedExtensions = void 0;
        try {
            serializedExtensions = serializeFetchParameter(body.extensions, 'Extensions map');
        }
        catch (parseError) {
            return { parseError: parseError };
        }
        addQueryParam('extensions', serializedExtensions);
    }
    // Reconstruct the URI with added query params.
    // XXX This assumes that the URI is well-formed and that it doesn't
    //     already contain any of these query params. We could instead use the
    //     URL API and take a polyfill (whatwg-url@6) for older browsers that
    //     don't support URLSearchParams. Note that some browsers (and
    //     versions of whatwg-url) support URL but not URLSearchParams!
    var fragment = '', preFragment = chosenURI;
    var fragmentStart = chosenURI.indexOf('#');
    if (fragmentStart !== -1) {
        fragment = chosenURI.substr(fragmentStart);
        preFragment = chosenURI.substr(0, fragmentStart);
    }
    var queryParamsPrefix = preFragment.indexOf('?') === -1 ? '?' : '&';
    var newURI = preFragment + queryParamsPrefix + queryParams.join('&') + fragment;
    return { newURI: newURI };
}
var HttpLink = /** @class */ (function (_super) {
    __extends(HttpLink, _super);
    function HttpLink(opts) {
        return _super.call(this, createHttpLink(opts).request) || this;
    }
    return HttpLink;
}(ApolloLink));
export { HttpLink };
//# sourceMappingURL=httpLink.js.map