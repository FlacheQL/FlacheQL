"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_link_core_1 = require("apollo-link-core");
var printer_1 = require("graphql/language/printer");
var DedupLink = (function (_super) {
    __extends(DedupLink, _super);
    function DedupLink() {
        var _this = _super.call(this) || this;
        _this.inFlightRequestObservables = {};
        return _this;
    }
    DedupLink.prototype.request = function (operation, forward) {
        var _this = this;
        if (operation.context.forceFetch) {
            return forward(operation);
        }
        var key = this.getKey(operation);
        if (!this.inFlightRequestObservables[key]) {
            this.inFlightRequestObservables[key] = forward(operation);
        }
        return new apollo_link_core_1.Observable(function (observer) {
            _this.inFlightRequestObservables[key].subscribe({
                next: observer.next.bind(observer),
                error: function (error) {
                    delete _this.inFlightRequestObservables[key];
                    observer.error(error);
                },
                complete: function () {
                    delete _this.inFlightRequestObservables[key];
                    observer.complete();
                },
            });
        });
    };
    DedupLink.prototype.getKey = function (operation) {
        return printer_1.print(operation.query) + "|" + JSON.stringify(operation.variables) + "|" + operation.operationName;
    };
    return DedupLink;
}(apollo_link_core_1.ApolloLink));
exports.default = DedupLink;
//# sourceMappingURL=dedupLink.js.map