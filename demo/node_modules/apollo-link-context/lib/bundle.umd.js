(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('apollo-link')) :
    typeof define === 'function' && define.amd ? define(['exports', 'apollo-link'], factory) :
    (factory((global.apolloLink = global.apolloLink || {}, global.apolloLink.context = {}),global.apolloLink.core));
}(this, (function (exports,apolloLink) { 'use strict';

    var __rest = (undefined && undefined.__rest) || function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };
    var setContext = function (setter) {
        return new apolloLink.ApolloLink(function (operation, forward) {
            var request = __rest(operation, []);
            return new apolloLink.Observable(function (observer) {
                var handle;
                Promise.resolve(request)
                    .then(function (req) { return setter(req, operation.getContext()); })
                    .then(operation.setContext)
                    .then(function () {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    });
                })
                    .catch(observer.error.bind(observer));
                return function () {
                    if (handle)
                        handle.unsubscribe();
                };
            });
        });
    };

    exports.setContext = setContext;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
