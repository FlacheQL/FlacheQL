/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import ApolloClient, { ObservableQuery, ApolloError, FetchPolicy, ErrorPolicy, ApolloQueryResult, NetworkStatus } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { OperationVariables } from './types';
export interface FetchMoreOptions<TData, TVariables> {
    updateQuery: (previousQueryResult: TData, options: {
        fetchMoreResult?: TData;
        variables: TVariables;
    }) => TData;
}
export interface FetchMoreQueryOptions<TVariables, K extends keyof TVariables> {
    variables: Pick<TVariables, K>;
}
export declare type ObservableQueryFields<TData, TVariables> = Pick<ObservableQuery<TData>, 'startPolling' | 'stopPolling' | 'subscribeToMore'> & {
    variables: TVariables;
    refetch: (variables?: TVariables) => Promise<ApolloQueryResult<TData>>;
    fetchMore: (<K extends keyof TVariables>(fetchMoreOptions: FetchMoreQueryOptions<TVariables, K> & FetchMoreOptions<TData, TVariables>) => Promise<ApolloQueryResult<TData>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: {
        query: DocumentNode;
    } & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>) => Promise<ApolloQueryResult<TData2>>);
    updateQuery: (mapFn: (previousQueryResult: TData, options: {
        variables?: TVariables;
    }) => TData) => void;
};
export interface QueryResult<TData = any, TVariables = OperationVariables> extends ObservableQueryFields<TData, TVariables> {
    client: ApolloClient<any>;
    data: TData | undefined;
    error?: ApolloError;
    loading: boolean;
    networkStatus: NetworkStatus;
}
export interface QueryProps<TData = any, TVariables = OperationVariables> {
    children: (result: QueryResult<TData, TVariables>) => React.ReactNode;
    fetchPolicy?: FetchPolicy;
    errorPolicy?: ErrorPolicy;
    notifyOnNetworkStatusChange?: boolean;
    pollInterval?: number;
    query: DocumentNode;
    variables?: TVariables;
    ssr?: boolean;
    displayName?: string;
    skip?: boolean;
    client?: ApolloClient<Object>;
    context?: Record<string, any>;
}
export interface QueryContext {
    client: ApolloClient<Object>;
    operations?: Map<string, {
        query: DocumentNode;
        variables: any;
    }>;
}
export default class Query<TData = any, TVariables = OperationVariables> extends React.Component<QueryProps<TData, TVariables>> {
    static contextTypes: {
        client: PropTypes.Validator<any>;
        operations: PropTypes.Requireable<any>;
    };
    static propTypes: {
        children: PropTypes.Validator<any>;
        fetchPolicy: PropTypes.Requireable<any>;
        notifyOnNetworkStatusChange: PropTypes.Requireable<any>;
        pollInterval: PropTypes.Requireable<any>;
        query: PropTypes.Validator<any>;
        variables: PropTypes.Requireable<any>;
        ssr: PropTypes.Requireable<any>;
    };
    context: QueryContext;
    private client;
    private queryObservable;
    private querySubscription;
    private previousData;
    private refetcherQueue;
    private hasMounted;
    private operation;
    constructor(props: QueryProps<TData, TVariables>, context: QueryContext);
    fetchData(): Promise<ApolloQueryResult<any>> | boolean;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: QueryProps<TData, TVariables>, nextContext: QueryContext): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    private extractOptsFromProps(props);
    private initializeQueryObservable(props);
    private updateQuery(props);
    private startQuerySubscription;
    private removeQuerySubscription;
    private resubscribeToQuery();
    private updateCurrentData;
    private getQueryResult;
}
