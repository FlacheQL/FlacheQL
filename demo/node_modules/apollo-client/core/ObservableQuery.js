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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { isEqual, tryFunctionOrLogError, maybeDeepFreeze, } from 'apollo-utilities';
import { NetworkStatus, isNetworkRequestInFlight } from './networkStatus';
import { Observable } from '../util/Observable';
import { ApolloError } from '../errors/ApolloError';
import { FetchType } from './types';
export var hasError = function (storeValue, policy) {
    if (policy === void 0) { policy = 'none'; }
    return storeValue &&
        ((storeValue.graphQLErrors &&
            storeValue.graphQLErrors.length > 0 &&
            policy === 'none') ||
            storeValue.networkError);
};
var ObservableQuery = /** @class */ (function (_super) {
    __extends(ObservableQuery, _super);
    function ObservableQuery(_a) {
        var scheduler = _a.scheduler, options = _a.options, _b = _a.shouldSubscribe, shouldSubscribe = _b === void 0 ? true : _b;
        var _this = _super.call(this, function (observer) {
            return _this.onSubscribe(observer);
        }) || this;
        // active state
        _this.isCurrentlyPolling = false;
        _this.isTornDown = false;
        // query information
        _this.options = options;
        _this.variables = options.variables || {};
        _this.queryId = scheduler.queryManager.generateQueryId();
        _this.shouldSubscribe = shouldSubscribe;
        // related classes
        _this.scheduler = scheduler;
        _this.queryManager = scheduler.queryManager;
        // interal data stores
        _this.observers = [];
        _this.subscriptionHandles = [];
        return _this;
    }
    ObservableQuery.prototype.result = function () {
        var that = this;
        return new Promise(function (resolve, reject) {
            var subscription;
            var observer = {
                next: function (result) {
                    resolve(result);
                    // Stop the query within the QueryManager if we can before
                    // this function returns.
                    //
                    // We do this in order to prevent observers piling up within
                    // the QueryManager. Notice that we only fully unsubscribe
                    // from the subscription in a setTimeout(..., 0)  call. This call can
                    // actually be handled by the browser at a much later time. If queries
                    // are fired in the meantime, observers that should have been removed
                    // from the QueryManager will continue to fire, causing an unnecessary
                    // performance hit.
                    if (!that.observers.some(function (obs) { return obs !== observer; })) {
                        that.queryManager.removeQuery(that.queryId);
                    }
                    setTimeout(function () {
                        subscription.unsubscribe();
                    }, 0);
                },
                error: function (error) {
                    reject(error);
                },
            };
            subscription = that.subscribe(observer);
        });
    };
    /**
     * Return the result of the query from the local cache as well as some fetching status
     * `loading` and `networkStatus` allow to know if a request is in flight
     * `partial` lets you know if the result from the local cache is complete or partial
     * @return {result: Object, loading: boolean, networkStatus: number, partial: boolean}
     */
    ObservableQuery.prototype.currentResult = function () {
        if (this.isTornDown) {
            return {
                data: this.lastError ? {} : this.lastResult ? this.lastResult.data : {},
                error: this.lastError,
                loading: false,
                networkStatus: NetworkStatus.error,
            };
        }
        var queryStoreValue = this.queryManager.queryStore.get(this.queryId);
        if (hasError(queryStoreValue, this.options.errorPolicy)) {
            return {
                data: {},
                loading: false,
                networkStatus: queryStoreValue.networkStatus,
                error: new ApolloError({
                    graphQLErrors: queryStoreValue.graphQLErrors,
                    networkError: queryStoreValue.networkError,
                }),
            };
        }
        var _a = this.queryManager.getCurrentQueryResult(this), data = _a.data, partial = _a.partial;
        var queryLoading = !queryStoreValue ||
            queryStoreValue.networkStatus === NetworkStatus.loading;
        // We need to be careful about the loading state we show to the user, to try
        // and be vaguely in line with what the user would have seen from .subscribe()
        // but to still provide useful information synchronously when the query
        // will not end up hitting the server.
        // See more: https://github.com/apollostack/apollo-client/issues/707
        // Basically: is there a query in flight right now (modolo the next tick)?
        var loading = (this.options.fetchPolicy === 'network-only' && queryLoading) ||
            (partial && this.options.fetchPolicy !== 'cache-only');
        // if there is nothing in the query store, it means this query hasn't fired yet or it has been cleaned up. Therefore the
        // network status is dependent on queryLoading.
        var networkStatus;
        if (queryStoreValue) {
            networkStatus = queryStoreValue.networkStatus;
        }
        else {
            networkStatus = loading ? NetworkStatus.loading : NetworkStatus.ready;
        }
        var result = {
            data: data,
            loading: isNetworkRequestInFlight(networkStatus),
            networkStatus: networkStatus,
        };
        if (queryStoreValue &&
            queryStoreValue.graphQLErrors &&
            this.options.errorPolicy === 'all') {
            result.errors = queryStoreValue.graphQLErrors;
        }
        if (!partial) {
            var stale = false;
            this.lastResult = __assign({}, result, { stale: stale });
        }
        return __assign({}, result, { partial: partial });
    };
    // Returns the last result that observer.next was called with. This is not the same as
    // currentResult! If you're not sure which you need, then you probably need currentResult.
    ObservableQuery.prototype.getLastResult = function () {
        return this.lastResult;
    };
    ObservableQuery.prototype.getLastError = function () {
        return this.lastError;
    };
    ObservableQuery.prototype.resetLastResults = function () {
        delete this.lastResult;
        delete this.lastError;
        this.isTornDown = false;
    };
    ObservableQuery.prototype.refetch = function (variables) {
        var fetchPolicy = this.options.fetchPolicy;
        // early return if trying to read from cache during refetch
        if (fetchPolicy === 'cache-only') {
            return Promise.reject(new Error('cache-only fetchPolicy option should not be used together with query refetch.'));
        }
        if (!isEqual(this.variables, variables)) {
            // update observable variables
            this.variables = Object.assign({}, this.variables, variables);
        }
        if (!isEqual(this.options.variables, this.variables)) {
            // Update the existing options with new variables
            this.options.variables = Object.assign({}, this.options.variables, this.variables);
        }
        // Override fetchPolicy for this call only
        // only network-only and no-cache are safe to use
        var isNetworkFetchPolicy = fetchPolicy === 'network-only' || fetchPolicy === 'no-cache';
        var combinedOptions = __assign({}, this.options, { fetchPolicy: isNetworkFetchPolicy ? fetchPolicy : 'network-only' });
        return this.queryManager
            .fetchQuery(this.queryId, combinedOptions, FetchType.refetch)
            .then(function (result) { return maybeDeepFreeze(result); });
    };
    ObservableQuery.prototype.fetchMore = function (fetchMoreOptions) {
        var _this = this;
        // early return if no update Query
        if (!fetchMoreOptions.updateQuery) {
            throw new Error('updateQuery option is required. This function defines how to update the query data with the new results.');
        }
        var combinedOptions;
        return Promise.resolve()
            .then(function () {
            var qid = _this.queryManager.generateQueryId();
            if (fetchMoreOptions.query) {
                // fetch a new query
                combinedOptions = fetchMoreOptions;
            }
            else {
                // fetch the same query with a possibly new variables
                combinedOptions = __assign({}, _this.options, fetchMoreOptions, { variables: Object.assign({}, _this.variables, fetchMoreOptions.variables) });
            }
            combinedOptions.fetchPolicy = 'network-only';
            return _this.queryManager.fetchQuery(qid, combinedOptions, FetchType.normal, _this.queryId);
        })
            .then(function (fetchMoreResult) {
            _this.updateQuery(function (previousResult) {
                return fetchMoreOptions.updateQuery(previousResult, {
                    fetchMoreResult: fetchMoreResult.data,
                    variables: combinedOptions.variables,
                });
            });
            return fetchMoreResult;
        });
    };
    // XXX the subscription variables are separate from the query variables.
    // if you want to update subscription variables, right now you have to do that separately,
    // and you can only do it by stopping the subscription and then subscribing again with new variables.
    ObservableQuery.prototype.subscribeToMore = function (options) {
        var _this = this;
        var subscription = this.queryManager
            .startGraphQLSubscription({
            query: options.document,
            variables: options.variables,
        })
            .subscribe({
            next: function (data) {
                if (options.updateQuery) {
                    _this.updateQuery(function (previous, _a) {
                        var variables = _a.variables;
                        return options.updateQuery(previous, {
                            subscriptionData: data,
                            variables: variables,
                        });
                    });
                }
            },
            error: function (err) {
                if (options.onError) {
                    options.onError(err);
                    return;
                }
                console.error('Unhandled GraphQL subscription error', err);
            },
        });
        this.subscriptionHandles.push(subscription);
        return function () {
            var i = _this.subscriptionHandles.indexOf(subscription);
            if (i >= 0) {
                _this.subscriptionHandles.splice(i, 1);
                subscription.unsubscribe();
            }
        };
    };
    // Note: if the query is not active (there are no subscribers), the promise
    // will return null immediately.
    ObservableQuery.prototype.setOptions = function (opts) {
        var oldOptions = this.options;
        this.options = Object.assign({}, this.options, opts);
        if (opts.pollInterval) {
            this.startPolling(opts.pollInterval);
        }
        else if (opts.pollInterval === 0) {
            this.stopPolling();
        }
        // If fetchPolicy went from cache-only to something else, or from something else to network-only
        var tryFetch = (oldOptions.fetchPolicy !== 'network-only' &&
            opts.fetchPolicy === 'network-only') ||
            (oldOptions.fetchPolicy === 'cache-only' &&
                opts.fetchPolicy !== 'cache-only') ||
            (oldOptions.fetchPolicy === 'standby' &&
                opts.fetchPolicy !== 'standby') ||
            false;
        return this.setVariables(this.options.variables, tryFetch, opts.fetchResults);
    };
    /**
     * Update the variables of this observable query, and fetch the new results
     * if they've changed. If you want to force new results, use `refetch`.
     *
     * Note: if the variables have not changed, the promise will return the old
     * results immediately, and the `next` callback will *not* fire.
     *
     * Note: if the query is not active (there are no subscribers), the promise
     * will return null immediately.
     *
     * @param variables: The new set of variables. If there are missing variables,
     * the previous values of those variables will be used.
     *
     * @param tryFetch: Try and fetch new results even if the variables haven't
     * changed (we may still just hit the store, but if there's nothing in there
     * this will refetch)
     *
     * @param fetchResults: Option to ignore fetching results when updating variables
     *
     */
    ObservableQuery.prototype.setVariables = function (variables, tryFetch, fetchResults) {
        if (tryFetch === void 0) { tryFetch = false; }
        if (fetchResults === void 0) { fetchResults = true; }
        // since setVariables restarts the subscription, we reset the tornDown status
        this.isTornDown = false;
        var newVariables = variables ? variables : this.variables;
        if (isEqual(newVariables, this.variables) && !tryFetch) {
            // If we have no observers, then we don't actually want to make a network
            // request. As soon as someone observes the query, the request will kick
            // off. For now, we just store any changes. (See #1077)
            if (this.observers.length === 0 || !fetchResults) {
                return new Promise(function (resolve) { return resolve(); });
            }
            return this.result();
        }
        else {
            this.variables = newVariables;
            this.options.variables = newVariables;
            // See comment above
            if (this.observers.length === 0) {
                return new Promise(function (resolve) { return resolve(); });
            }
            // Use the same options as before, but with new variables
            return this.queryManager
                .fetchQuery(this.queryId, __assign({}, this.options, { variables: this.variables }))
                .then(function (result) { return maybeDeepFreeze(result); });
        }
    };
    ObservableQuery.prototype.updateQuery = function (mapFn) {
        var _a = this.queryManager.getQueryWithPreviousResult(this.queryId), previousResult = _a.previousResult, variables = _a.variables, document = _a.document;
        var newResult = tryFunctionOrLogError(function () {
            return mapFn(previousResult, { variables: variables });
        });
        if (newResult) {
            this.queryManager.dataStore.markUpdateQueryResult(document, variables, newResult);
            this.queryManager.broadcastQueries();
        }
    };
    ObservableQuery.prototype.stopPolling = function () {
        if (this.isCurrentlyPolling) {
            this.scheduler.stopPollingQuery(this.queryId);
            this.options.pollInterval = undefined;
            this.isCurrentlyPolling = false;
        }
    };
    ObservableQuery.prototype.startPolling = function (pollInterval) {
        if (this.options.fetchPolicy === 'cache-first' ||
            this.options.fetchPolicy === 'cache-only') {
            throw new Error('Queries that specify the cache-first and cache-only fetchPolicies cannot also be polling queries.');
        }
        if (this.isCurrentlyPolling) {
            this.scheduler.stopPollingQuery(this.queryId);
            this.isCurrentlyPolling = false;
        }
        this.options.pollInterval = pollInterval;
        this.isCurrentlyPolling = true;
        this.scheduler.startPollingQuery(this.options, this.queryId);
    };
    ObservableQuery.prototype.onSubscribe = function (observer) {
        var _this = this;
        // Zen Observable has its own error function, in order to log correctly
        // we need to declare a custom error if nothing is passed
        if (observer._subscription &&
            observer._subscription._observer &&
            !observer._subscription._observer.error) {
            observer._subscription._observer.error = function (error) {
                console.error('Unhandled error', error.message, error.stack);
            };
        }
        this.observers.push(observer);
        // Deliver initial result
        if (observer.next && this.lastResult)
            observer.next(this.lastResult);
        if (observer.error && this.lastError)
            observer.error(this.lastError);
        // setup the query if it hasn't been done before
        if (this.observers.length === 1)
            this.setUpQuery();
        return function () {
            _this.observers = _this.observers.filter(function (obs) { return obs !== observer; });
            if (_this.observers.length === 0) {
                _this.tearDownQuery();
            }
        };
    };
    ObservableQuery.prototype.setUpQuery = function () {
        var _this = this;
        if (this.shouldSubscribe) {
            this.queryManager.addObservableQuery(this.queryId, this);
        }
        if (!!this.options.pollInterval) {
            if (this.options.fetchPolicy === 'cache-first' ||
                this.options.fetchPolicy === 'cache-only') {
                throw new Error('Queries that specify the cache-first and cache-only fetchPolicies cannot also be polling queries.');
            }
            this.isCurrentlyPolling = true;
            this.scheduler.startPollingQuery(this.options, this.queryId);
        }
        var observer = {
            next: function (result) {
                _this.lastResult = result;
                _this.observers.forEach(function (obs) { return obs.next && obs.next(result); });
            },
            error: function (error) {
                _this.lastError = error;
                _this.observers.forEach(function (obs) { return obs.error && obs.error(error); });
            },
        };
        this.queryManager.startQuery(this.queryId, this.options, this.queryManager.queryListenerForObserver(this.queryId, this.options, observer));
    };
    ObservableQuery.prototype.tearDownQuery = function () {
        this.isTornDown = true;
        if (this.isCurrentlyPolling) {
            this.scheduler.stopPollingQuery(this.queryId);
            this.isCurrentlyPolling = false;
        }
        // stop all active GraphQL subscriptions
        this.subscriptionHandles.forEach(function (sub) { return sub.unsubscribe(); });
        this.subscriptionHandles = [];
        this.queryManager.removeObservableQuery(this.queryId);
        this.queryManager.stopQuery(this.queryId);
        this.observers = [];
    };
    return ObservableQuery;
}(Observable));
export { ObservableQuery };
//# sourceMappingURL=ObservableQuery.js.map