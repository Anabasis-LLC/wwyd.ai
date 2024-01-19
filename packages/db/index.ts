// 3rd party
import { PrismaClient } from '@prisma/client';

/**
 * db
 */

let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };

  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }

  db = globalWithPrisma.prisma;
}

export { db };

/**
 * re-export
 */

export * from '@prisma/client';
