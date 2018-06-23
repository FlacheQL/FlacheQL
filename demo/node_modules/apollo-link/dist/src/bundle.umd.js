(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.apolloLink = {})));
}(this, (function (exports) { 'use strict';

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_link_core_1 = require("apollo-link-core");
var apollo_link_batch_1 = require("apollo-link-batch");
exports.BatchLink = apollo_link_batch_1.default;
var apollo_link_batch_http_1 = require("apollo-link-batch-http");
exports.BatchHttpLink = apollo_link_batch_http_1.default;
var apollo_link_dedup_1 = require("apollo-link-dedup");
exports.DedupLink = apollo_link_dedup_1.default;
var apollo_link_http_1 = require("apollo-link-http");
exports.HttpLink = apollo_link_http_1.default;
var apollo_link_retry_1 = require("apollo-link-retry");
exports.RetryLink = apollo_link_retry_1.default;
var apollo_link_set_context_1 = require("apollo-link-set-context");
exports.SetContextLink = apollo_link_set_context_1.default;
var apollo_link_polling_1 = require("apollo-link-polling");
exports.PollingLink = apollo_link_polling_1.default;
var apollo_link_ws_1 = require("apollo-link-ws");
exports.WebSocketLink = apollo_link_ws_1.default;
__export(require("apollo-link-core"));
exports.default = apollo_link_core_1.default;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bundle.umd.js.map
