"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dedupLink_1 = require("../src/dedupLink");
var apollo_link_core_1 = require("apollo-link-core");
var graphql_tag_1 = require("graphql-tag");
function getOperationName(doc) {
    var res = null;
    doc.definitions.forEach(function (definition) {
        if (definition.kind === 'OperationDefinition' && definition.name) {
            res = definition.name.value;
        }
    });
    return res;
}
describe('DedupLink', function () {
    it("does not affect different queries", function () {
        var document = (_a = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], _a.raw = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], graphql_tag_1.default(_a));
        var variables1 = { x: 'Hello World' };
        var variables2 = { x: 'Goodbye World' };
        var request1 = {
            query: document,
            variables: variables1,
            operationName: getOperationName(document),
        };
        var request2 = {
            query: document,
            variables: variables2,
            operationName: getOperationName(document),
        };
        var called = 0;
        var deduper = apollo_link_core_1.ApolloLink.from([
            new dedupLink_1.default(),
            function () {
                called += 1;
                return null;
            },
        ]);
        apollo_link_core_1.execute(deduper, request1);
        apollo_link_core_1.execute(deduper, request2);
        chai_1.assert.equal(called, 2);
        var _a;
    });
    it("will not deduplicate requests following an errored query", function (done) {
        var document = (_a = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], _a.raw = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], graphql_tag_1.default(_a));
        var variables = { x: 'Hello World' };
        var error;
        var data = { data: { data: 'some data' } };
        var request = {
            query: document,
            variables: variables,
            operationName: getOperationName(document),
        };
        var called = 0;
        var deduper = apollo_link_core_1.ApolloLink.from([
            new dedupLink_1.default(),
            function () {
                called += 1;
                switch (called) {
                    case 1:
                        return new apollo_link_core_1.Observable(function (observer) {
                            error = new Error('some error');
                            observer.error(error);
                        });
                    case 2:
                        return new apollo_link_core_1.Observable(function (observer) {
                            observer.next(data);
                            observer.complete();
                        });
                    default:
                        chai_1.assert(false, 'Should not have been called more than twice');
                        return null;
                }
            },
        ]);
        apollo_link_core_1.execute(deduper, request).subscribe({
            error: function (actualError) {
                chai_1.assert.equal(actualError, error);
                apollo_link_core_1.execute(deduper, request).subscribe({
                    next: function (result) {
                        chai_1.assert.equal(result, data);
                        chai_1.assert.equal(called, 2);
                        done();
                    },
                });
            },
        });
        var _a;
    });
    it("deduplicates identical queries", function () {
        var document = (_a = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], _a.raw = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], graphql_tag_1.default(_a));
        var variables1 = { x: 'Hello World' };
        var variables2 = { x: 'Hello World' };
        var request1 = {
            query: document,
            variables: variables1,
            operationName: getOperationName(document),
        };
        var request2 = {
            query: document,
            variables: variables2,
            operationName: getOperationName(document),
        };
        var called = 0;
        var deduper = apollo_link_core_1.ApolloLink.from([
            new dedupLink_1.default(),
            function () {
                called += 1;
                return new apollo_link_core_1.Observable(function (observer) {
                    setTimeout(observer.complete.bind(observer));
                });
            },
        ]);
        apollo_link_core_1.execute(deduper, request1).subscribe({});
        apollo_link_core_1.execute(deduper, request2).subscribe({});
        chai_1.assert.equal(called, 1);
        var _a;
    });
    it("can bypass deduplication if desired", function () {
        var document = (_a = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], _a.raw = ["\n      query test1($x: String) {\n        test(x: $x)\n      }\n    "], graphql_tag_1.default(_a));
        var variables1 = { x: 'Hello World' };
        var variables2 = { x: 'Hello World' };
        var request1 = {
            query: document,
            variables: variables1,
            operationName: getOperationName(document),
            context: {
                forceFetch: true,
            },
        };
        var request2 = {
            query: document,
            variables: variables2,
            operationName: getOperationName(document),
            context: {
                forceFetch: true,
            },
        };
        var called = 0;
        var deduper = apollo_link_core_1.ApolloLink.from([
            new dedupLink_1.default(),
            function () {
                called += 1;
                return null;
            },
        ]);
        apollo_link_core_1.execute(deduper, request1).subscribe({});
        apollo_link_core_1.execute(deduper, request2).subscribe({});
        chai_1.assert.equal(called, 2);
        var _a;
    });
});
//# sourceMappingURL=dedupLink.js.map