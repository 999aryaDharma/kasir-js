// express-api/src/config/prisma.js

const { PrismaClient } = require('@prisma/client');

// Konfigurasi connection pooling
const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'], // Hanya log pada level ini
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    }
  },
  __internal: {
    // Connection pool configuration
    // Untuk production, atur sesuai kebutuhan server
    // Secara default Prisma menggunakan pooling internal
  }
});

// Optimasi untuk production
if (process.env.NODE_ENV === 'production') {
  // Tambahkan beberapa optimasi untuk production
  prisma.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    
    // Log query yang memakan waktu lama
    if (after - before > 1000) { // Lebih dari 1 detik
      console.log(`Query took ${after - before}ms: ${params.model}.${params.action}`);
    }
    
    return result;
  });
}

module.exports = prisma;