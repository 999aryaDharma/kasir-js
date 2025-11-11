// Advanced in-memory cache with performance metrics
class AdvancedCache {
  constructor() {
    this.cache = new Map();
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0
    };
  }

  set(key, value, ttl = 300) { // Default 5 menit
    const expiration = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiration, timestamp: Date.now() });
    this.metrics.sets++;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      this.metrics.misses++;
      return null;
    }

    if (Date.now() > item.expiration) {
      this.cache.delete(key);
      this.metrics.misses++;
      return null;
    }

    this.metrics.hits++;
    return item.value;
  }

  has(key) {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }

    if (Date.now() > item.expiration) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  getMetrics() {
    const totalRequests = this.metrics.hits + this.metrics.misses;
    const hitRate = totalRequests > 0 ? (this.metrics.hits / totalRequests * 100).toFixed(2) : 0;
    
    return {
      ...this.metrics,
      hitRate: `${hitRate}%`,
      totalRequests
    };
  }

  // Fungsi untuk cleanup item yang expired (untuk maintenance)
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiration) {
        this.cache.delete(key);
      }
    }
  }
}

const cache = new AdvancedCache();

// Fungsi untuk invalidasi cache berdasarkan pattern
cache.invalidatePattern = function(pattern) {
  for (const key of this.cache.keys()) {
    if (key.includes(pattern)) {
      this.cache.delete(key);
    }
  }
};

// Fungsi untuk invalidasi beberapa cache sekaligus
cache.invalidateKeys = function(keys) {
  for (const key of keys) {
    this.cache.delete(key);
  }
};

// Cleanup otomatis setiap 10 menit
setInterval(() => {
  cache.cleanup();
}, 600000); // 10 menit

// Fungsi untuk logging metrics cache
setInterval(() => {
  console.log('[CACHE METRICS]', cache.getMetrics());
}, 300000); // 5 menit

module.exports = cache;