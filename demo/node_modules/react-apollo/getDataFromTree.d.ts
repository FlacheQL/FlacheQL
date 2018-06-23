/// <reference types="react" />
import * as React from 'react';
export interface Context {
    [key: string]: any;
}
export declare function walkTree(element: React.ReactNode, context: Context, visitor: (element: React.ReactNode, instance: React.Component<any> | null, context: Context, childContext?: Context) => boolean | void): void;
export default function getDataFromTree(rootElement: React.ReactNode, rootContext?: any): Promise<any>;
