/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import ApolloClient, { PureQueryOptions, ApolloError } from 'apollo-client';
import { DataProxy } from 'apollo-cache';
import { DocumentNode, GraphQLError } from 'graphql';
import { OperationVariables, RefetchQueriesProviderFn } from './types';
export interface MutationResult<TData = Record<string, any>> {
    data?: TData;
    error?: ApolloError;
    loading: boolean;
    called: boolean;
}
export interface MutationContext {
    client: ApolloClient<Object>;
    operations: Map<string, {
        query: DocumentNode;
        variables: any;
    }>;
}
export interface ExecutionResult<T = Record<string, any>> {
    data?: T;
    extensions?: Record<string, any>;
    errors?: GraphQLError[];
}
export declare type MutationUpdaterFn<T = {
    [key: string]: any;
}> = (proxy: DataProxy, mutationResult: FetchResult<T>) => void;
export declare type FetchResult<C = Record<string, any>, E = Record<string, any>> = ExecutionResult<C> & {
    extensions?: E;
    context?: C;
};
export declare type MutationOptions<TData = any, TVariables = OperationVariables> = {
    variables?: TVariables;
    optimisticResponse?: Object;
    refetchQueries?: string[] | PureQueryOptions[] | RefetchQueriesProviderFn;
    update?: MutationUpdaterFn<TData>;
};
export declare type MutationFn<TData = any, TVariables = OperationVariables> = (options?: MutationOptions<TData, TVariables>) => Promise<void | FetchResult<TData>>;
export interface MutationProps<TData = any, TVariables = OperationVariables> {
    mutation: DocumentNode;
    ignoreResults?: boolean;
    optimisticResponse?: Object;
    variables?: TVariables;
    refetchQueries?: string[] | PureQueryOptions[] | RefetchQueriesProviderFn;
    update?: MutationUpdaterFn<TData>;
    children: (mutateFn: MutationFn<TData, TVariables>, result: MutationResult<TData>) => React.ReactNode;
    onCompleted?: (data: TData) => void;
    onError?: (error: ApolloError) => void;
    context?: Record<string, any>;
}
export interface MutationState<TData = any> {
    called: boolean;
    error?: ApolloError;
    data?: TData;
    loading: boolean;
}
declare class Mutation<TData = any, TVariables = OperationVariables> extends React.Component<MutationProps<TData, TVariables>, MutationState<TData>> {
    static contextTypes: {
        client: PropTypes.Validator<any>;
        operations: PropTypes.Requireable<any>;
    };
    static propTypes: {
        mutation: PropTypes.Validator<any>;
        variables: PropTypes.Requireable<any>;
        optimisticResponse: PropTypes.Requireable<any>;
        refetchQueries: PropTypes.Requireable<any>;
        update: PropTypes.Requireable<any>;
        children: PropTypes.Validator<any>;
        onCompleted: PropTypes.Requireable<any>;
        onError: PropTypes.Requireable<any>;
    };
    private client;
    private mostRecentMutationId;
    private hasMounted;
    constructor(props: MutationProps<TData, TVariables>, context: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: MutationProps<TData, TVariables>, nextContext: MutationContext): void;
    render(): React.ReactNode;
    private runMutation;
    private mutate;
    private onStartMutation;
    private onCompletedMutation;
    private onMutationError;
    private generateNewMutationId;
    private isMostRecentMutation;
    private verifyDocumentIsMutation;
    private verifyContext;
}
export default Mutation;
