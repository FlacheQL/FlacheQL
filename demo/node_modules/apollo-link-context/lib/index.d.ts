import { ApolloLink, GraphQLRequest } from 'apollo-link';
export declare type ContextSetter = (operation: GraphQLRequest, prevContext: any) => Promise<any> | any;
export declare const setContext: (setter: ContextSetter) => ApolloLink;
