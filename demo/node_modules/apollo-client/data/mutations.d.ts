export declare class MutationStore {
    private store;
    getStore(): {
        [mutationId: string]: MutationStoreValue;
    };
    get(mutationId: string): MutationStoreValue;
    initMutation(mutationId: string, mutationString: string, variables: Object | undefined): void;
    markMutationError(mutationId: string, error: Error): void;
    markMutationResult(mutationId: string): void;
    reset(): void;
}
export interface MutationStoreValue {
    mutationString: string;
    variables: Object;
    loading: boolean;
    error: Error | null;
}
