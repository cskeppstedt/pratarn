import NodeCache from "node-cache";
import logger from "./logger";

export type IStoreFunction<T> = () => Promise<T>;
export type CacheKey = string | number;

class MemoryCache {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false
    });
  }

  public get<T>(key: CacheKey, storeFunction: IStoreFunction<T>) {
    const value = this.cache.get(key);
    if (value) {
      logger.verbose(`[MemoryCache] cache found for ${key}`);
      return Promise.resolve(value);
    }

    logger.verbose(`[MemoryCache] cache not found for ${key}`);

    return storeFunction().then((result) => {
      logger.verbose(`[MemoryCache] cache set for ${key}`);
      this.cache.set(key, result);
      return result;
    }) as Promise<T>;
  }
}

export default MemoryCache;
