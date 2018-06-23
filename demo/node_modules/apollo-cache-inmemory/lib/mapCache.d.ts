import { NormalizedCache, NormalizedCacheObject, StoreObject } from './types';
/**
 * A Map-based implementation of the NormalizedCache.
 * Note that you need a polyfill for Object.entries for this to work.
 */
export declare class MapCache implements NormalizedCache {
    cache: Map<string, StoreObject>;
    constructor(data?: NormalizedCacheObject);
    get(dataId: string): StoreObject;
    set(dataId: string, value: StoreObject): void;
    delete(dataId: string): void;
    clear(): void;
    toObject(): NormalizedCacheObject;
    replace(newData: NormalizedCacheObject): void;
}
export declare function mapNormalizedCacheFactory(seed?: NormalizedCacheObject): NormalizedCache;
