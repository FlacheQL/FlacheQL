/// <reference types="react" />
import * as React from 'react';
import { OperationOption } from './types';
import { ApolloClient } from 'apollo-client';
export declare type WithApolloClient<P> = P & {
    client: ApolloClient<any>;
};
export default function withApollo<TProps, TResult = any>(WrappedComponent: React.ComponentType<WithApolloClient<TProps>>, operationOptions?: OperationOption<TProps, TResult>): React.ComponentClass<TProps>;
