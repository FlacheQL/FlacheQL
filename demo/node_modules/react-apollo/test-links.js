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
import { ApolloLink, Observable, } from 'apollo-link';
import { print } from 'graphql/language/printer';
import { addTypenameToDocument } from 'apollo-utilities';
var MockLink = (function (_super) {
    __extends(MockLink, _super);
    function MockLink(mockedResponses, addTypename) {
        if (addTypename === void 0) { addTypename = true; }
        var _this = _super.call(this) || this;
        _this.addTypename = true;
        _this.mockedResponsesByKey = {};
        _this.addTypename = addTypename;
        if (mockedResponses)
            mockedResponses.forEach(function (mockedResponse) {
                _this.addMockedResponse(mockedResponse);
            });
        return _this;
    }
    MockLink.prototype.addMockedResponse = function (mockedResponse) {
        var key = requestToKey(mockedResponse.request, this.addTypename);
        var mockedResponses = this.mockedResponsesByKey[key];
        if (!mockedResponses) {
            mockedResponses = [];
            this.mockedResponsesByKey[key] = mockedResponses;
        }
        mockedResponses.push(mockedResponse);
    };
    MockLink.prototype.request = function (operation) {
        var key = requestToKey(operation, this.addTypename);
        var responses = this.mockedResponsesByKey[key];
        if (!responses || responses.length === 0) {
            throw new Error("No more mocked responses for the query: " + print(operation.query) + ", variables: " + JSON.stringify(operation.variables));
        }
        var original = this.mockedResponsesByKey[key].slice();
        var _a = this.mockedResponsesByKey[key].shift() || {}, result = _a.result, error = _a.error, delay = _a.delay, newData = _a.newData;
        if (newData) {
            original[0].result = newData();
            this.mockedResponsesByKey[key].push(original[0]);
        }
        if (!result && !error) {
            throw new Error("Mocked response should contain either result or error: " + key);
        }
        return new Observable(function (observer) {
            var timer = setTimeout(function () {
                if (error) {
                    observer.error(error);
                }
                else {
                    if (result)
                        observer.next(result);
                    observer.complete();
                }
            }, delay ? delay : 0);
            return function () {
                clearTimeout(timer);
            };
        });
    };
    return MockLink;
}(ApolloLink));
export { MockLink };
var MockSubscriptionLink = (function (_super) {
    __extends(MockSubscriptionLink, _super);
    function MockSubscriptionLink() {
        var _this = _super.call(this) || this;
        _this.unsubscribers = [];
        _this.setups = [];
        return _this;
    }
    MockSubscriptionLink.prototype.request = function (_req) {
        var _this = this;
        return new Observable(function (observer) {
            _this.setups.forEach(function (x) { return x(); });
            _this.observer = observer;
            return function () {
                _this.unsubscribers.forEach(function (x) { return x(); });
            };
        });
    };
    MockSubscriptionLink.prototype.simulateResult = function (result) {
        var _this = this;
        setTimeout(function () {
            var observer = _this.observer;
            if (!observer)
                throw new Error('subscription torn down');
            if (result.result && observer.next)
                observer.next(result.result);
            if (result.error && observer.error)
                observer.error(result.error);
        }, result.delay || 0);
    };
    MockSubscriptionLink.prototype.onSetup = function (listener) {
        this.setups = this.setups.concat([listener]);
    };
    MockSubscriptionLink.prototype.onUnsubscribe = function (listener) {
        this.unsubscribers = this.unsubscribers.concat([listener]);
    };
    return MockSubscriptionLink;
}(ApolloLink));
export { MockSubscriptionLink };
function requestToKey(request, addTypename) {
    var queryString = request.query && print(addTypename ? addTypenameToDocument(request.query) : request.query);
    var requestKey = {
        variables: request.variables || {},
        query: queryString,
    };
    return JSON.stringify(requestKey);
}
export function mockSingleLink() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i] = arguments[_i];
    }
    var maybeTypename = mockedResponses[mockedResponses.length - 1];
    var mocks = mockedResponses.slice(0, mockedResponses.length - 1);
    if (typeof maybeTypename !== 'boolean') {
        mocks = mockedResponses;
        maybeTypename = true;
    }
    return new MockLink(mocks, maybeTypename);
}
export function mockObservableLink() {
    return new MockSubscriptionLink();
}
//# sourceMappingURL=test-links.js.map