import { Operation, GraphQLRequest, ApolloLink, FetchResult, Observable } from 'apollo-link';
export interface MockedResponse {
    request: GraphQLRequest;
    result?: FetchResult;
    error?: Error;
    delay?: number;
    newData?: () => FetchResult;
}
export interface MockedSubscriptionResult {
    result?: FetchResult;
    error?: Error;
    delay?: number;
}
export interface MockedSubscription {
    request: GraphQLRequest;
}
export declare class MockLink extends ApolloLink {
    addTypename: Boolean;
    private mockedResponsesByKey;
    constructor(mockedResponses: MockedResponse[], addTypename?: Boolean);
    addMockedResponse(mockedResponse: MockedResponse): void;
    request(operation: Operation): Observable<FetchResult<Record<string, any>, Record<string, any>>>;
}
export declare class MockSubscriptionLink extends ApolloLink {
    unsubscribers: any[];
    setups: any[];
    private observer;
    constructor();
    request(_req: any): Observable<FetchResult<Record<string, any>, Record<string, any>>>;
    simulateResult(result: MockedSubscriptionResult): void;
    onSetup(listener: any): void;
    onUnsubscribe(listener: any): void;
}
export declare function mockSingleLink(...mockedResponses: Array<any>): ApolloLink;
export declare function mockObservableLink(): MockSubscriptionLink;
