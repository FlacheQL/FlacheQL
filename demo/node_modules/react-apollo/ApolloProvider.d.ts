/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Component } from 'react';
import ApolloClient from 'apollo-client';
export interface ApolloProviderProps<TCache> {
    client: ApolloClient<TCache>;
    children: React.ReactNode;
}
export default class ApolloProvider<TCache> extends Component<ApolloProviderProps<TCache>> {
    static propTypes: {
        client: PropTypes.Validator<any>;
        children: PropTypes.Validator<any>;
    };
    static childContextTypes: {
        client: PropTypes.Validator<any>;
        operations: PropTypes.Requireable<any>;
    };
    private operations;
    constructor(props: ApolloProviderProps<TCache>, context: any);
    getChildContext(): {
        client: ApolloClient<TCache>;
        operations: any;
    };
    render(): React.ReactNode;
}
