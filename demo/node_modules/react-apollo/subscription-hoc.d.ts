/// <reference types="react" />
import * as React from 'react';
import { DocumentNode } from 'graphql';
import { OperationOption, DataProps } from './types';
export declare function subscribe<TProps extends TGraphQLVariables | {} = {}, TData = {}, TGraphQLVariables = {}, TChildProps = Partial<DataProps<TData, TGraphQLVariables>>>(document: DocumentNode, operationOptions?: OperationOption<TProps, TData, TGraphQLVariables, TChildProps>): (WrappedComponent: React.ComponentType<TChildProps & TProps>) => React.ComponentClass<TProps>;
