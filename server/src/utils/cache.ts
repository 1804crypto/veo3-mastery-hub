import NodeCache from 'node-cache';

// Cache TTL: 5 minutes for AI responses
const AI_CACHE_TTL = 300;

// In-memory cache instance
// For production at scale, replace with Redis
const cache = new NodeCache({
    stdTTL: AI_CACHE_TTL,
    checkperiod: 60,
    useClones: false,
});

/**
 * Generate a cache key from the input
 * Normalizes the input to improve cache hit rate
 */
function generateCacheKey(prefix: string, input: string): string {
    // Normalize: lowercase, trim, collapse whitespace
    const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ');
    return `${prefix}:${normalized}`;
}

/**
 * Get cached AI response
 */
export function getCachedResponse<T>(prefix: string, input: string): T | undefined {
    const key = generateCacheKey(prefix, input);
    const cached = cache.get<T>(key);

    if (cached) {
        console.log(`[Cache] HIT for key: ${key.substring(0, 50)}...`);
    }

    return cached;
}

/**
 * Set cached AI response
 */
export function setCachedResponse<T>(prefix: string, input: string, value: T, ttl?: number): void {
    const key = generateCacheKey(prefix, input);
    cache.set(key, value, ttl || AI_CACHE_TTL);
    console.log(`[Cache] SET for key: ${key.substring(0, 50)}...`);
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
    return {
        keys: cache.keys().length,
        hits: cache.getStats().hits,
        misses: cache.getStats().misses,
        hitRate: cache.getStats().hits / (cache.getStats().hits + cache.getStats().misses) || 0,
    };
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
    cache.flushAll();
    console.log('[Cache] Cleared all entries');
}

export default cache;
