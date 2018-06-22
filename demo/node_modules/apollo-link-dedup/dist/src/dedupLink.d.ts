import { ApolloLink, Operation, NextLink, FetchResult, Observable } from 'apollo-link-core';
export default class DedupLink extends ApolloLink {
    private inFlightRequestObservables;
    constructor();
    request(operation: Operation, forward: NextLink): Observable<FetchResult>;
    private getKey(operation);
}
