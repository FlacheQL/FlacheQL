import { NormalizedCache, NormalizedCacheObject, StoreObject } from './types';
export declare class RecordingCache implements NormalizedCache {
    private readonly data;
    constructor(data?: NormalizedCacheObject);
    private recordedData;
    record(transaction: (recordingCache: RecordingCache) => void): NormalizedCacheObject;
    toObject(): NormalizedCacheObject;
    get(dataId: string): StoreObject;
    set(dataId: string, value: StoreObject): void;
    delete(dataId: string): void;
    clear(): void;
    replace(newData: NormalizedCacheObject): void;
}
export declare function record(startingState: NormalizedCacheObject, transaction: (recordingCache: RecordingCache) => void): NormalizedCacheObject;
