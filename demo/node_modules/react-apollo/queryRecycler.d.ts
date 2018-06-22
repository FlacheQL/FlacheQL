import { ObservableQuery } from 'apollo-client';
import { QueryOpts } from './types';
export declare class ObservableQueryRecycler {
    private observableQueries;
    recycle(observableQuery: ObservableQuery<any>): void;
    reuse(options: QueryOpts): null | ObservableQuery<any>;
}
