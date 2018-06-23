/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import ApolloClient, { ApolloError } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { OperationVariables } from './types';
export interface SubscriptionResult<TData = any> {
    loading: boolean;
    data?: TData;
    error?: ApolloError;
}
export interface SubscriptionProps<TData = any, TVariables = OperationVariables> {
    subscription: DocumentNode;
    variables?: TVariables;
    shouldResubscribe?: any;
    children: (result: SubscriptionResult<TData>) => React.ReactNode;
}
export interface SubscriptionState<TData = any> {
    loading: boolean;
    data?: TData;
    error?: ApolloError;
}
export interface SubscriptionContext {
    client: ApolloClient<Object>;
}
declare class Subscription<TData = any, TVariables = any> extends React.Component<SubscriptionProps<TData, TVariables>, SubscriptionState<TData>> {
    static contextTypes: {
        client: PropTypes.Validator<any>;
    };
    static propTypes: {
        subscription: PropTypes.Validator<any>;
        variables: PropTypes.Requireable<any>;
        children: PropTypes.Validator<any>;
        shouldResubscribe: PropTypes.Requireable<any>;
    };
    private client;
    private queryObservable;
    private querySubscription;
    constructor(props: SubscriptionProps<TData, TVariables>, context: SubscriptionContext);
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: SubscriptionProps<TData, TVariables>, nextContext: SubscriptionContext): void;
    componentWillUnmount(): void;
    render(): React.ReactNode;
    private initialize;
    private startSubscription;
    private getInitialState;
    private updateCurrentData;
    private updateError;
    private endSubscription;
}
export default Subscription;
