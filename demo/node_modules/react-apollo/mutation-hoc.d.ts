/// <reference types="react" />
import * as React from 'react';
import { DocumentNode } from 'graphql';
import { OperationOption, MutateProps } from './types';
export declare function mutation<TProps extends TGraphQLVariables | {} = {}, TData = {}, TGraphQLVariables = {}, TChildProps = Partial<MutateProps<TData, TGraphQLVariables>>>(document: DocumentNode, operationOptions?: OperationOption<TProps, TData, TGraphQLVariables, TChildProps>): (WrappedComponent: React.ComponentType<TChildProps & TProps>) => React.ComponentClass<TProps>;
