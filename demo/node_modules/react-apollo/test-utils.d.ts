/// <reference types="react" />
import * as React from 'react';
export * from './test-links';
export declare class MockedProvider extends React.Component<any, any> {
    static defaultProps: {
        addTypename: boolean;
    };
    private client;
    constructor(props: any, context: any);
    render(): JSX.Element;
}
