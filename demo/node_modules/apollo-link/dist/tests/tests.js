"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Allpollo = require("../src/index");
var chai_1 = require("chai");
describe('Exports', function () {
    describe('HttpLink', function () {
        it('constructor', function () {
            chai_1.assert.doesNotThrow(function () { return new Allpollo.HttpLink(); });
        });
    });
    describe('BatchLink', function () {
        it('constructor', function () {
            chai_1.assert.doesNotThrow(function () { return new Allpollo.BatchLink({ batchHandler: function () { return void 0; } }); });
        });
    });
    describe('BatchHttpLink', function () {
        it('constructor', function () {
            chai_1.assert.doesNotThrow(function () { return new Allpollo.BatchHttpLink(); });
        });
    });
    describe('RetryLink', function () {
        it('constructor', function () {
            chai_1.assert.doesNotThrow(function () { return new Allpollo.RetryLink(); });
        });
    });
    describe('SetContextLink', function () {
        it('constructor', function () {
            chai_1.assert.doesNotThrow(function () { return new Allpollo.SetContextLink(); });
        });
    });
    describe('PollingLink', function () {
        it('constructor', function () {
            chai_1.assert.doesNotThrow(function () { return new Allpollo.PollingLink(function () { return 1; }); });
        });
    });
    describe('DedupLink', function () {
        it('constructor', function () {
            chai_1.assert.doesNotThrow(function () { return new Allpollo.DedupLink(); });
        });
    });
    describe('WebSocketLink', function () {
        it('constructor', function () {
            chai_1.assert.property(Allpollo.WebSocketLink, 'split');
            chai_1.assert.property(Allpollo.WebSocketLink, 'from');
        });
    });
    describe('Link Core', function () {
        describe('execute', function () {
            it('exists', function () {
                chai_1.assert.doesNotThrow(function () {
                    Allpollo.execute(Allpollo.ApolloLink.from([function () { return null; }]), {});
                });
            });
        });
        describe('Observable', function () {
            it('exists', function () {
                chai_1.assert.doesNotThrow(Allpollo.Observable.of);
            });
        });
        describe('makePromise', function () {
            it('exists', function () {
                chai_1.assert.doesNotThrow(function () {
                    Allpollo.makePromise(Allpollo.Observable.of());
                });
            });
        });
        describe('ApolloLink', function () {
            it('exists', function () {
                chai_1.assert.doesNotThrow(function () {
                    var apolloLink;
                    apolloLink = apolloLink;
                });
            });
        });
        describe('ApolloLink imported from default', function () {
            it('exists', function () {
                chai_1.assert.doesNotThrow(function () {
                    var apolloLink;
                    apolloLink = apolloLink;
                });
            });
        });
    });
});
//# sourceMappingURL=tests.js.map