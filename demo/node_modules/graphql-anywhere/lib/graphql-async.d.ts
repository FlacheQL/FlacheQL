import { DocumentNode } from 'graphql';
import { Resolver, VariableMap, ExecOptions } from './graphql';
export declare function graphql(resolver: Resolver, document: DocumentNode, rootValue?: any, contextValue?: any, variableValues?: VariableMap, execOptions?: ExecOptions): Promise<null | Object>;
