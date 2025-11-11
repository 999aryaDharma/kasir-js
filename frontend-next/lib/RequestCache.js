// Global cache untuk request deduplication
class RequestCache {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  // Mendapatkan key untuk request berdasarkan URL dan options
  getCacheKey(url, options = {}) {
    // Gabungkan URL dan options menjadi key unik
    const optionsKey = JSON.stringify(options);
    return `${url}_${optionsKey}`;
  }

  // Cek apakah request sedang pending
  hasPendingRequest(key) {
    return this.pendingRequests.has(key);
  }

  // Tambahkan promise pending untuk request
  setPendingRequest(key, promise) {
    this.pendingRequests.set(key, promise);
    
    // Hapus dari pending setelah selesai
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
    
    return promise;
  }

  // Cek apakah response tersedia di cache
  hasCachedResponse(key) {
    return this.cache.has(key);
  }

  // Dapatkan response dari cache
  getCachedResponse(key) {
    return this.cache.get(key);
  }

  // Simpan response ke cache
  setCachedResponse(key, response, ttl = 60000) { // Default 60 detik
    this.cache.set(key, response);
    
    // Bersihkan cache setelah TTL
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl);
  }
}

// Singleton instance
const requestCache = new RequestCache();

export { requestCache };