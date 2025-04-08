
/**
 * Simple in-memory cache for AI responses
 * Uses LRU (Least Recently Used) strategy
 */

interface CacheEntry {
  value: any;
  expiry: number;
}

export class AICache {
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 100, defaultTTLInSeconds = 3600) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTLInSeconds * 1000;
  }

  get(key: string): any | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    // Move entry to the end of the cache (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.value;
  }

  set(key: string, value: any, ttlInSeconds?: number): void {
    // If cache is at maxSize, remove least recently used item
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    const ttl = (ttlInSeconds || this.defaultTTL) * 1000;
    
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
